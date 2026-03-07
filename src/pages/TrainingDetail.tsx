import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Play, BarChart3 } from 'lucide-react';
// import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function GameDetail() {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const gameData: Record<string, any> = {
    putting: {
      name: 'Putting Challenge',
      description: 'Vylepšete své krátké hody. Cílem je trefit koš z různých pozic a vzdáleností.',
      rules: [
        'Postavte se na značku 3m, 5m, 7m a 10m od koše',
        'Z každé pozice hoďte 5 pokusů',
        'Počítejte úspěšné hody do koše',
        'Zaznamenejte čas pro každou sérii',
      ],
      bestScore: '45/50',
      avgScore: '38/50',
      attempts: 12,
    },
    accuracy: {
      name: 'Accuracy Test',
      description: 'Test přesnosti na různé vzdálenosti s různými disky.',
      rules: [
        'Vyberte 5 cílů ve vzdálenostech 10-30m',
        'Každý cíl trefte 10x',
        'Započítávají se hody do 2m od cíle',
        'Měřte čas dokončení',
      ],
      bestScore: '42/50',
      avgScore: '35/50',
      attempts: 8,
    },
    distance: {
      name: 'Distance Drive',
      description: 'Změřte maximální vzdálenost vašeho drivu.',
      rules: [
        'Proveďte 10 pokusů na maximum',
        'Zaznamenejte nejdelší hod',
        'Sledujte průměrnou vzdálenost',
        'Zaměřte se na techniku',
      ],
      bestScore: '92m',
      avgScore: '78m',
      attempts: 15,
    },
    speed: {
      name: 'Speed Round',
      description: 'Rychlý herní scénář pod časovým tlakem.',
      rules: [
        'Zahrajte 9 jamek co nejrychleji',
        'Zaznamenejte počet hodů a čas',
        'Penalizace +2 hody za OB',
        'Cíl: pod 30 minut',
      ],
      bestScore: '32 hodů',
      avgScore: '38 hodů',
      attempts: 6,
    },
  };

  const game = gameData[gameId || ''] || gameData.putting;

  return (
    <div className="size-full bg-white overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="flex items-center gap-4 px-6 py-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 active:opacity-50 transition-opacity">
            <ArrowLeft className="size-5" />
          </button>
          <h1 className="text-sm font-normal tracking-wide">DETAIL HRY</h1>
        </div>
      </div>

      <div className="px-6 pb-24">
        {/* Image */}
        <div className="relative h-48 rounded-lg overflow-hidden my-6">
          {/*<ImageWithFallback*/}
          {/*  src="https://images.unsplash.com/photo-1593890849134-5e6ff4c496de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwZm9yZXN0JTIwbmF0dXJlJTIwcGF0aHxlbnwxfHx8fDE3NzI4ODg0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"*/}
          {/*  alt={game.name}*/}
          {/*  className="w-full h-full object-cover"*/}
          {/*/>*/}
        </div>

        {/* Game Info */}
        <div className="mb-8">
          <h2 className="text-2xl font-light mb-3">{game.name}</h2>
          <p className="text-gray-600 leading-relaxed">{game.description}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 mb-1">Nejlepší</p>
            <p className="font-normal">{game.bestScore}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Průměr</p>
            <p className="font-normal">{game.avgScore}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Pokusů</p>
            <p className="font-normal">{game.attempts}</p>
          </div>
        </div>

        {/* Rules */}
        <div className="mb-8">
          <h3 className="text-sm text-gray-400 mb-4">Pravidla</h3>
          <div className="space-y-3">
            {game.rules.map((rule: string, index: number) => (
              <div key={index} className="flex gap-3">
                <span className="text-gray-300 font-light flex-shrink-0">{index + 1}.</span>
                <p className="text-gray-600">{rule}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => navigate(`/training/${gameId}/play`)}
            className="w-full bg-black text-white py-4 flex items-center justify-center gap-2 active:opacity-70 transition-opacity"
          >
            <Play className="size-5 fill-white" />
            Začít hru
          </button>

          <button
            onClick={() => navigate('/statistics')}
            className="w-full border border-gray-200 py-4 flex items-center justify-center gap-2 active:bg-gray-50 transition-colors"
          >
            <BarChart3 className="size-5" />
            Zobrazit statistiky
          </button>
        </div>
      </div>
    </div>
  );
}