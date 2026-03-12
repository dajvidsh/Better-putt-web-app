import { ChevronRight, Flame, Repeat, Target } from "lucide-react";
import { useNavigate } from "react-router";

export default function Training() {
    const navigate = useNavigate();

    const trainingGames = [
        {
            id: "jyly",
            name: "JYLY",
            description: "Trénink hodů z 5–10 m do koše",
            difficulty: "Začátečník",
            duration: "15–25 min",
            icon: Target,
            badge: "bg-gray-100 text-gray-500",
        },
        {
            id: "survival",
            name: "Survival",
            description: "Trénink turnajového tlaku",
            difficulty: "Středně pokročilý",
            duration: "5–? min",
            icon: Flame,
            badge: "bg-orange-50 text-orange-400",
        },
        {
            id: "drill",
            name: "Drill",
            description: "Opakované drillování",
            difficulty: "Pokročilý",
            duration: "20 min",
            icon: Repeat,
            badge: "bg-blue-50 text-blue-400",
        },
    ];

    return (
        <div className="px-6 pb-20">
            <div className="py-8">
                <h1 className="text-2xl font-normal tracking-tight text-black">Tréninkové hry</h1>
                <p className="text-sm text-gray-400 tracking-wider mt-1">Vyber si trénink</p>
            </div>

            <div className="space-y-3 pb-6">
                {trainingGames.map((game) => {
                    const Icon = game.icon;
                    return (
                        <button
                            key={game.id}
                            onClick={() => navigate(`/training/${game.id}`)}
                            className="w-full border border-gray-100 rounded-2xl p-4 text-left active:bg-gray-50 bg-white transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`rounded-xl p-3 flex-shrink-0 ${game.badge}`}>
                                    <Icon className="size-5" strokeWidth={1.5} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className="text-sm font-medium tracking-wide text-gray-900">
                                            {game.name}
                                        </h3>
                                        <span className="text-[10px] text-gray-400">{game.duration}</span>
                                    </div>
                                    <p className="text-xs text-gray-400">{game.description}</p>
                                </div>

                                <ChevronRight className="size-4 text-gray-300 shrink-0" />
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}