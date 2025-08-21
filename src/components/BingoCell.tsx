import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BingoCellProps {
  id: string;
  isMarked?: boolean;
  isCenter?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function BingoCell({
  id,
  isMarked = false,
  isCenter = false,
  onClick,
  className
}: BingoCellProps) {
  // Determinar se é uma energia ou carta especial
  const isEnergy = id.startsWith('ENERGY-');
  const isFree = id === 'LIVRE';

  // URL da imagem apenas para cartas reais
  const imageUrl = !isEnergy && !isFree ? `/api/image/${id}` : null;

  // Nome da energia se for uma energia
  const energyNames = [
    'Grass',
    'Fire',
    'Water',
    'Lightning',
    'Psychic',
    'Fighting',
    'Darkness',
    'Metal'
  ];
  const energyNumber = isEnergy ? parseInt(id.split('-')[1]) : 0;
  const energyName = energyNumber >= 1 && energyNumber <= 8 ? energyNames[energyNumber - 1] : 'Unknown';

  // Cores específicas para cada tipo de energia
  const energyColors = {
    1: 'from-green-400 to-green-600', // Grass
    2: 'from-red-400 to-red-600',     // Fire
    3: 'from-blue-400 to-blue-600',   // Water
    4: 'from-yellow-400 to-yellow-600', // Lightning
    5: 'from-purple-400 to-purple-600', // Psychic
    6: 'from-orange-400 to-orange-600', // Fighting
    7: 'from-gray-600 to-gray-800',   // Darkness
    8: 'from-gray-400 to-gray-600'    // Metal
  };

  const energyColor = energyNumber >= 1 && energyNumber <= 8 ? energyColors[energyNumber as keyof typeof energyColors] : 'from-gray-400 to-gray-600';

  return (
    <div
      onClick={onClick}
      data-cell-id={id}
      className={cn(
        "aspect-[3/4] border-2 rounded-lg flex flex-col items-center justify-center text-center p-1 cursor-pointer transition-all",
        "bg-card hover:bg-muted",
        isCenter && "bg-primary text-primary-foreground font-bold",
        isMarked && !isCenter && "bg-accent border-primary line-through opacity-75",
        className
      )}
    >
      {isCenter || isFree ? (
        <span className="text-sm font-bold">LIVRE</span>
      ) : isEnergy ? (
        <>
          {/* ID da energia */}
          <span 
            className={cn(
                "font-bold mb-1 text-center leading-tight break-words",
                "text-[9px] sm:text-xs md:text-sm"
              )}
          >
            {energyName}
          </span>

          {/* Separador visual */}
          <div className="w-full h-px bg-border my-1" />

          {/* Símbolo da energia */}
          <div className="flex-1 w-full flex items-center justify-center">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${energyColor} flex items-center justify-center text-white font-bold text-xs shadow-lg`}>
              ⚡
            </div>
          </div>
        </>
      ) : (
        <>
          {/* ID da carta */}
          <span
            className={cn(
              "font-bold mb-1 text-center leading-tight break-words",
              "text-[9px] sm:text-xs md:text-sm"
            )}
          >
            {id}
          </span>

          {/* Separador visual */}
          <div className="w-full h-px bg-border my-1" />

          {/* Imagem da carta - maior possível dentro da visualização */}
          <div className="flex-1 w-full flex items-center justify-center relative">
            <Image
              src={imageUrl!}
              alt={`Carta ${id}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => {
                // Em caso de erro, mostrar um placeholder
                const container = document.querySelector(`[data-cell-id="${id}"] .image-fallback`);
                if (container) {
                  container.classList.remove('hidden');
                }
              }}
            />
            {/* Fallback em caso de erro na imagem */}
            <div className="hidden image-fallback absolute inset-0 flex items-center justify-center text-xs text-muted-foreground text-center">
              <span>Imagem não disponível</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
