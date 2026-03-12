import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const modeLabel: Record<string, string> = {
    jyly: "pts",
    survival: "m",
    drill: "%",
};

const modeBadgeClass: Record<string, string> = {
    jyly: "bg-gray-100 text-gray-500",
    survival: "bg-orange-50 text-orange-400",
    drill: "bg-blue-50 text-blue-400",
};

function groupByMonth(games: any[]) {
    const map: Record<string, any[]> = {};
    for (const g of games) {
        // date je "DD.MM.YYYY"
        const parts = g.date?.split(".") ?? [];
        const key =
            parts.length === 3
                ? `${parts[1]}.${parts[2]}`
                : "Neznámý datum";
        if (!map[key]) map[key] = [];
        map[key].push(g);
    }
    return Object.entries(map);
}

function monthName(key: string) {
    const months = [
        "", "Leden", "Únor", "Březen", "Duben", "Květen", "Červen",
        "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec",
    ];
    const [m, y] = key.split(".");
    return `${months[parseInt(m)] ?? m} ${y}`;
}

export default function History() {
    const navigate = useNavigate();
    const [games, setGames] = useState<any[]>(() => {
        const saved = localStorage.getItem("cache_games");
        return saved ? JSON.parse(saved) : [];
    });
    const [loading, setLoading] = useState(games.length === 0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`${API_BASE_URL}/api/games`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => (res.ok ? res.json() : Promise.reject()))
            .then((data) => {
                setGames(data);
                setLoading(false);
                localStorage.setItem("cache_games", JSON.stringify(data));
            })
            .catch(() => setLoading(false));
    }, []);

    const grouped = groupByMonth(games);

    return (
        <div className="size-full bg-white overflow-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
                <div className="flex items-center gap-4 px-6 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft className="size-5 text-gray-700" />
                    </button>
                    <div className="flex items-baseline gap-3">
                        <h1 className="text-sm font-medium tracking-widest text-gray-900">
                            HISTORIE
                        </h1>
                        {games.length > 0 && (
                            <span className="text-xs text-gray-400">{games.length} her</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Obsah */}
            <div className="px-6 pb-24">
                {loading && (
                    <p className="text-center text-gray-400 py-10 text-sm">Načítám...</p>
                )}

                {!loading && games.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 gap-2">
                        <p className="text-sm text-gray-400">Zatím nemáš žádné hry</p>
                        <p className="text-xs text-gray-300">Po první hře se tu objeví tvoje statistiky</p>
                    </div>
                )}

                {!loading && grouped.map(([monthKey, monthGames]) => (
                    <div key={monthKey} className="mt-6">
                        {/* Měsíc nadpis */}
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">
                            {monthName(monthKey)}
                        </p>

                        {/* Hry v měsíci */}
                        <div className="divide-y divide-gray-50">
                            {monthGames.map((game) => (
                                <button
                                    key={game.id}
                                    onClick={() => navigate(`/history/${game.id}`)}
                                    className="w-full text-left py-3.5 active:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            {/* Barevná tečka módu */}
                                            <span
                                                className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0 ${
                                                    modeBadgeClass[game.game_mode_id] ?? "bg-gray-100 text-gray-500"
                                                }`}
                                            >
                                                {game.game_name}
                                            </span>
                                            <p className="text-xs text-gray-400 truncate">{game.date}</p>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                {game.total_score}
                                                <span className="text-[10px] ml-0.5 font-normal text-gray-400">
                                                    {modeLabel[game.game_mode_id] ?? ""}
                                                </span>
                                            </p>
                                            <p className="text-[10px] text-gray-400">
                                                {game.total_makes}/{game.total_attempts}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}