import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function ImageTest() {
  const [code, setCode] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetchImage = async () => {
    if (!code.trim()) {
      setError('Digite um código válido');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Construir URL da API
      const apiUrl = `/api/image/${code}`;
      setImageUrl(apiUrl);
    } catch (err) {
      setError('Erro ao buscar imagem');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (exampleCode: string) => {
    setCode(exampleCode);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-primary">Teste de API de Imagens</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium mb-2">
            Código da Carta
          </label>
          <div className="flex gap-2">
            <Input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ex: BLK-67, WHT-9"
              className="flex-1"
            />
            <Button 
              onClick={handleFetchImage} 
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Buscar'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Formato: XXX-1 (3 letras maiúsculas + hífen + número)
          </p>
        </div>

        {/* Exemplos de códigos */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Exemplos:</p>
          <div className="flex flex-wrap gap-2">
            {['BLK-67', 'WHT-9', 'RED-15', 'GRN-25'].map((example) => (
              <Button
                key={example}
                variant="outline"
                size="sm"
                onClick={() => handleExampleClick(example)}
                className="text-xs"
              >
                {example}
              </Button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {imageUrl && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Resultado:</h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <img 
                src={imageUrl} 
                alt={`Carta ${code}`}
                className="w-full h-48 object-contain mx-auto"
                onError={() => setError('Erro ao carregar imagem')}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              URL: {imageUrl}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
