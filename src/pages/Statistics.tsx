import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const modeUnit: Record<string, string> = {
    drill: "%",
    survival: "m",
    jyly: "pts",
};

const modeBadgeClass: Record<string, string> = {
    jyly: "bg-gray-100 text-gray-500",
    survival: "bg-orange-50 text-orange-400",
    drill: "bg-blue-50 text-blue-400",
};

const modeLabel: Record<string, string> = {
    jyly: "JYLY",
    survival: "SURVIVAL",
    drill: "DRILL",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">
            {children}
        </p>
    );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="flex flex-col bg-gray-50 rounded-2xl p-4">
            <span className="text-2xl font-medium tracking-tight text-gray-900 leading-none">
                {value}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-gray-400 mt-2">
                {label}
            </span>
        </div>
    );
}

function GameTooltip({ active, payload, unit, onNavigate }: {
    active?: boolean;
    payload?: any[];
    unit: string;
    onNavigate: (id: number) => void;
    [key: string]: any;
}) {
    if (!active || !payload?.length) return null;
    const g = payload[0].payload;
    return (
        <div className="bg-white border border-gray-100 rounded-xl px-3 py-2.5 shadow-sm text-xs min-w-[120px]">
            <p className="text-gray-400 mb-1">{g.date}</p>
            <p className="font-medium text-gray-900 mb-2">
                {g.score}
                <span className="text-gray-400 ml-0.5 font-normal">{unit}</span>
            </p>
            <button
                onClick={() => onNavigate(g.id)}
                className="text-[10px] uppercase tracking-wide font-medium text-black border-b border-black pb-0.5"
            >
                Detail →
            </button>
        </div>
    );
}

function ClickableDot(props: any) {
    const { cx, cy, payload, onNavigate } = props;
    return (
        <circle
            cx={cx} cy={cy} r={5}
            fill="#111827" stroke="white" strokeWidth={2}
            style={{ cursor: "pointer" }}
            onClick={() => onNavigate(payload.id)}
        />
    );
}

export default function Statistics() {
    const navigate = useNavigate();

    const [stats, setStats] = useState<any>(() => {
        const saved = localStorage.getItem("cache_stats");
        return saved ? JSON.parse(saved) : null;
    });
    const [games, setGames] = useState<any[]>(() => {
        const saved = localStorage.getItem("cache_games");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        const headers = { Authorization: `Bearer ${token}` };

        fetch(`${API_BASE_URL}/api/statistics`, { headers })
            .then((res) => res.json())
            .then((data) => { setStats(data); localStorage.setItem("cache_stats", JSON.stringify(data)); });

        fetch(`${API_BASE_URL}/api/games`, { headers })
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => { setGames(data); localStorage.setItem("cache_games", JSON.stringify(data)); });
    }, []);

    const overview = stats?.overview ?? {
        total_trainings: 0, total_putts: 0, rank: "-", total_time_hours: "0h",
    };
    const gameStats: any[] = stats?.gameStats ?? [];

    // Skupiny her dle módu — nejstarší první pro chart
    const gamesByMode: Record<string, any[]> = {};
    for (const g of [...games].reverse()) {
        const mode = g.game_mode_id;
        if (!gamesByMode[mode]) gamesByMode[mode] = [];
        gamesByMode[mode].push({
            id: g.id,
            date: g.date,
            score: g.total_score,
            index: gamesByMode[mode].length + 1,
        });
    }

    const handleNavigate = (id: number) => navigate(`/history/${id}`);

    return (
        <div className="size-full bg-white overflow-auto">
            <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
                <div className="flex items-center gap-4 px-6 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft className="size-5 text-gray-700" />
                    </button>
                    <h1 className="text-sm font-medium tracking-widest text-gray-900">STATISTIKY</h1>
                </div>
            </div>

            <div className="px-6 pb-24 space-y-8 pt-6">

                {/* Přehled */}
                <section>
                    <SectionLabel>Přehled</SectionLabel>
                    <div className="grid grid-cols-2 gap-3">
                        <StatCard label="Celkem puttů" value={overview.total_putts} />
                        <StatCard label="Tréninků" value={overview.total_trainings} />
                        <StatCard label="Umístění" value={overview.rank} />
                        <StatCard label="Celkový čas" value={overview.total_time_hours} />
                    </div>
                </section>

                {gameStats.length === 0 ? (
                    <section>
                        <SectionLabel>Dle módu</SectionLabel>
                        <div className="flex flex-col items-center justify-center py-12 gap-2">
                            <p className="text-sm text-gray-400">Zatím nemáš žádné tréninky</p>
                            <p className="text-xs text-gray-300">Po první hře se tu objeví tvoje statistiky</p>
                        </div>
                    </section>
                ) : (
                    gameStats.map((game: any) => {
                        const modeId = game.name.toLowerCase();
                        const unit = modeUnit[modeId] ?? "";
                        const badge = modeBadgeClass[modeId] ?? "bg-gray-100 text-gray-500";
                        const modeGames = gamesByMode[modeId] ?? [];

                        return (
                            <section key={game.name}>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wide ${badge}`}>
                                        {modeLabel[modeId] ?? game.name}
                                    </span>
                                    <span className="text-[10px] text-gray-400">
                                        {game.attempts} {game.attempts === 1 ? "hra" : game.attempts <= 4 ? "hry" : "her"}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-gray-50 rounded-2xl p-4 text-center">
                                        <p className="text-xl font-medium text-gray-900">
                                            {game.avgScore}
                                            <span className="text-xs font-normal text-gray-400 ml-0.5">{unit}</span>
                                        </p>
                                        <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">Průměr</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl p-4 text-center">
                                        <p className="text-xl font-medium text-gray-900">
                                            {game.bestScore}
                                            <span className="text-xs font-normal text-gray-400 ml-0.5">{unit}</span>
                                        </p>
                                        <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">Nejlepší</p>
                                    </div>
                                </div>

                                <div className="border border-gray-100 rounded-2xl p-5">
                                    {/* Line chart — jen pokud 2+ her */}
                                    {modeGames.length >= 2 ? (
                                        <>
                                            <SectionLabel>Vývoj — klikni na bod pro detail</SectionLabel>
                                            <ResponsiveContainer width="100%" height={160}>
                                                <LineChart data={modeGames} margin={{ top: 8, right: 8, left: -28, bottom: 0 }}>
                                                    <CartesianGrid vertical={false} stroke="#f3f4f6" />
                                                    <XAxis
                                                        dataKey="index"
                                                        tick={{ fontSize: 10, fill: "#9ca3af" }}
                                                        axisLine={false}
                                                        tickLine={false}
                                                        label={{ value: "hra", position: "insideBottomRight", offset: 0, fontSize: 10, fill: "#d1d5db" }}
                                                    />
                                                    <YAxis
                                                        tick={{ fontSize: 10, fill: "#9ca3af" }}
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tickFormatter={(v) => `${v}${unit}`}
                                                    />
                                                    <ReferenceLine y={game.avgScore} stroke="#e5e7eb" strokeDasharray="4 4" />
                                                    <Tooltip
                                                        content={(props) => (
                                                            <GameTooltip {...props} unit={unit} onNavigate={handleNavigate} />
                                                        )}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="score"
                                                        stroke="#111827"
                                                        strokeWidth={1.5}
                                                        dot={(props) => <ClickableDot {...props} onNavigate={handleNavigate} />}
                                                        activeDot={{ r: 6, fill: "#111827", stroke: "white", strokeWidth: 2 }}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>

                                            <div className="mt-5 pt-4 border-t border-gray-50 divide-y divide-gray-50">
                                                {[...modeGames].reverse().slice(0, 5).map((g) => (
                                                    <button
                                                        key={g.id}
                                                        onClick={() => handleNavigate(g.id)}
                                                        className="w-full flex items-center justify-between py-3 active:bg-gray-50 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xs text-gray-400 w-4">{g.index}</span>
                                                            <span className="text-xs text-gray-500">{g.date}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {g.score}
                                                                <span className="text-xs font-normal text-gray-400 ml-0.5">{unit}</span>
                                                            </span>
                                                            <span className="text-gray-300 text-xs">→</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        /* Jen 1 hra — zobrazíme ji bez chartu */
                                        <div className="divide-y divide-gray-50">
                                            <SectionLabel>Odehrané hry</SectionLabel>
                                            {modeGames.map((g) => (
                                                <button
                                                    key={g.id}
                                                    onClick={() => handleNavigate(g.id)}
                                                    className="w-full flex items-center justify-between py-3 active:bg-gray-50 transition-colors"
                                                >
                                                    <span className="text-xs text-gray-500">{g.date}</span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {g.score}
                                                            <span className="text-xs font-normal text-gray-400 ml-0.5">{unit}</span>
                                                        </span>
                                                        <span className="text-gray-300 text-xs">→</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {modeGames.length > 5 && (
                                        <button
                                            onClick={() => navigate("/history")}
                                            className="w-full text-center text-[10px] uppercase tracking-widest text-gray-400 pt-3 mt-1 border-t border-gray-50 active:text-gray-700"
                                        >
                                            Zobrazit všechny hry ({modeGames.length})
                                        </button>
                                    )}
                                </div>
                            </section>
                        );
                    })
                )}
            </div>
        </div>
    );
}