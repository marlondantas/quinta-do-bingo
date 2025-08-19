import { NextApiRequest, NextApiResponse } from 'next';

// Configurações do serviço externo
const EXTERNAL_SERVICE_CONFIG = {
  baseUrl: process.env.EXTERNAL_IMAGE_CARD_SERVICE_URL || 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/{set}/{set}_{number}_R_PT.png',
  timeout: 10000, // 10 segundos
};

// Cache em memória para as imagens
interface CachedImage {
  buffer: Buffer;
  contentType: string;
  timestamp: number;
  expiresAt: number;
}

const imageCache = new Map<string, CachedImage>();

// Configurações do cache
const CACHE_CONFIG = {
  maxSize: 150, // Máximo de 150 imagens em cache
  ttl: 7 * 24 * 60 * 60 * 1000, // 7 dias em millisegundos
  cleanupInterval: 60 * 60 * 1000, // Limpeza a cada 1 hora
};

// Função para limpar cache expirado
function cleanupExpiredCache() {
  const now = Date.now();
  const expiredKeys: string[] = [];
  
  for (const [key, cachedImage] of imageCache.entries()) {
    if (now > cachedImage.expiresAt) {
      expiredKeys.push(key);
    }
  }
  
  expiredKeys.forEach(key => imageCache.delete(key));
  
  // Se o cache ainda estiver muito grande, remover as entradas mais antigas
  if (imageCache.size > CACHE_CONFIG.maxSize) {
    const entries = Array.from(imageCache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toRemove = entries.slice(0, imageCache.size - CACHE_CONFIG.maxSize);
    toRemove.forEach(([key]) => imageCache.delete(key));
  }
}

// Função para obter imagem do cache
function getCachedImage(code: string): CachedImage | null {
  const cached = imageCache.get(code);
  
  if (!cached) {
    return null;
  }
  
  // Verificar se a imagem expirou
  if (Date.now() > cached.expiresAt) {
    imageCache.delete(code);
    return null;
  }
  
  return cached;
}

// Função para salvar imagem no cache
function saveToCache(code: string, buffer: Buffer, contentType: string) {
  const now = Date.now();
  
  const cachedImage: CachedImage = {
    buffer,
    contentType,
    timestamp: now,
    expiresAt: now + CACHE_CONFIG.ttl,
  };
  
  imageCache.set(code, cachedImage);
  
  // Limpar cache se necessário (apenas ocasionalmente para não impactar performance)
  if (Math.random() < 0.01) { // 1% de chance de limpar
    cleanupExpiredCache();
  }
}

// Função para obter estatísticas do cache
function getCacheStats() {
  const now = Date.now();
  let expiredCount = 0;
  let totalSize = 0;
  
  for (const cachedImage of imageCache.values()) {
    if (now > cachedImage.expiresAt) {
      expiredCount++;
    }
    totalSize += cachedImage.buffer.length;
  }
  
  return {
    totalEntries: imageCache.size,
    expiredEntries: expiredCount,
    totalSizeBytes: totalSize,
    totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
    maxSize: CACHE_CONFIG.maxSize,
    ttlHours: CACHE_CONFIG.ttl / (60 * 60 * 1000),
  };
}

// Função para gerar uma imagem padrão baseada no código
function generateFallbackImage(code: string): Buffer {
  // Criar uma imagem SVG simples como fallback
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#f0f0f0"/>
      <text x="100" y="100" font-family="Arial" font-size="16" text-anchor="middle" fill="#666">
        ${code}
      </text>
      <text x="100" y="120" font-family="Arial" font-size="12" text-anchor="middle" fill="#999">
        Imagem não encontrada
      </text>
    </svg>
  `;
  
  return Buffer.from(svg);
}

// Função para extrair set e número do código
function parseCode(code: string): { set: string; number: string } | null {
  // Formato esperado: XXX-1 (ex: BLK-67)
  const match = code.match(/^([A-Z]{3})-(\d+)$/);
  if (!match) return null;
  
  const [, set, number] = match;
  // Garantir que o número tenha 3 casas (ex: 67 -> 067)
  const paddedNumber = number.padStart(3, '0');
  
  return { set, number: paddedNumber };
}

// Função para construir a URL da imagem
function buildImageUrl(set: string, number: string): string {
  return EXTERNAL_SERVICE_CONFIG.baseUrl
    .replace('{set}', set)
    .replace('{set}', set)
    .replace('{number}', number);
}

// Função para buscar imagem do serviço externo
async function fetchExternalImage(code: string): Promise<{ buffer: Buffer; contentType: string } | null> {
  try {
    // Verificar se a imagem está em cache
    const cachedImage = getCachedImage(code);
    if (cachedImage) {
      console.log('Imagem encontrada em cache:', code);
      return {
        buffer: cachedImage.buffer,
        contentType: cachedImage.contentType
      };
    }

    // Extrair set e número do código
    const parsed = parseCode(code);
    if (!parsed) {
      console.error('Formato de código inválido:', code);
      return null;
    }

    const { set, number } = parsed;
    const imageUrl = buildImageUrl(set, number);
    
    console.log('Buscando imagem do serviço externo:', imageUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), EXTERNAL_SERVICE_CONFIG.timeout);

    const response = await fetch(imageUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Bingo-Pokemon-App/1.0',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('Erro na resposta:', response.status, response.statusText);
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get('content-type') || 'image/png';

    // Salvar no cache
    saveToCache(code, buffer, contentType);
    console.log('Imagem salva no cache:', code);

    return { buffer, contentType };
  } catch (error) {
    console.error('Erro ao buscar imagem externa:', error);
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Código é obrigatório' });
  }

  // Rota especial para estatísticas do cache
  if (code === 'stats') {
    return res.status(200).json({
      cache: getCacheStats(),
      timestamp: new Date().toISOString(),
    });
  }

  // Validar formato do código (BLK-67, WHT-9, etc.)
  const codeRegex = /^[A-Z]{3}-\d+$/;
  if (!codeRegex.test(code)) {
    return res.status(400).json({ 
      error: 'Formato de código inválido', 
      message: 'Use o formato: XXX-1 (ex: BLK-67, WHT-9) ou "stats" para estatísticas do cache' 
    });
  }

  try {
    // Tentar buscar imagem do serviço externo
    const externalImage = await fetchExternalImage(code);

    if (externalImage) {
      // Configurar headers da resposta
      res.setHeader('Content-Type', externalImage.contentType);
      res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache por 1 hora
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('X-Cache-Status', getCachedImage(code) ? 'HIT' : 'MISS');
      res.setHeader('X-Cache-Size', imageCache.size.toString());
      
      // Retornar a imagem externa
      res.send(externalImage.buffer);
    } else {
      // Gerar imagem de fallback
      const fallbackImage = generateFallbackImage(code);
      
      // Configurar headers da resposta
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=300'); // Cache por 5 minutos para fallbacks
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('X-Cache-Status', 'FALLBACK');
      res.setHeader('X-Cache-Size', imageCache.size.toString());
      
      // Retornar a imagem de fallback
      res.send(fallbackImage);
    }

  } catch (error) {
    console.error('Erro interno:', error);
    
    // Em caso de erro crítico, retornar erro JSON
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Não foi possível processar a requisição'
    });
  }
}
