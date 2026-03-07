import {ChevronRight, Crosshair, Target, TrendingUp, Zap} from "lucide-react";
import {useNavigate} from "react-router";

export default function Training() {

    const navigate = useNavigate();

    const trainingGames = [
    {
      id: 'putting',
      name: 'Putting Challenge',
      description: 'Trénink krátkých hodů do koše',
      difficulty: 'Začátečník',
      duration: '15 min',
      icon: Target,
    },
    {
      id: 'accuracy',
      name: 'Accuracy Test',
      description: 'Test přesnosti na různé vzdálenosti',
      difficulty: 'Středně pokročilý',
      duration: '25 min',
      icon: Crosshair,
    },
    {
      id: 'distance',
      name: 'Distance Drive',
      description: 'Maximální vzdálenost drivu',
      difficulty: 'Pokročilý',
      duration: '20 min',
      icon: TrendingUp,
    },
    {
      id: 'speed',
      name: 'Speed Round',
      description: 'Rychlý herní scénář pod tlakem',
      difficulty: 'Pokročilý',
      duration: '30 min',
      icon: Zap,
    },
  ];

    return (
        <div className="px-6">
          <div className="py-8">
            <h1 className="text-2xl font-light mb-2">Tréninkové hry</h1>
            <p className="text-gray-500">Vyberte si trénink</p>
          </div>

          <div className="space-y-3 pb-6">
          {trainingGames.map((game) => {
          const Icon = game.icon;
          return (
            <button
              key={game.id}
              onClick={() => navigate(`/training/${game.id}`)}
              className="w-full border border-gray-100 rounded-lg p-5 active:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="border border-gray-200 rounded-lg p-3 flex-shrink-0">
                  <Icon className="size-6" strokeWidth={1.5} />
                </div>

                <div className="flex-1 text-left min-w-0">
                  <h3 className="font-normal mb-1">{game.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{game.description}</p>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-gray-400">{game.duration}</span>
                  </div>
                </div>

                <ChevronRight className="size-5 text-gray-400 flex-shrink-0 mt-2" />
              </div>
            </button>
          );
        })}
      </div>
        </div>
    )
}