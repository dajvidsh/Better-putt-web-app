import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const modeUnit: Record<string, string> = {
    DRILL: "%",
    SURVIVAL: "m",
    JYLY: "pts",
};

const modeBadgeClass: Record<string, string> = {
    JYLY: "bg-gray-100 text-gray-500",
    SURVIVAL: "bg-orange-50 text-orange-400",
    DRILL: "bg-blue-50 text-blue-400",
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

export default function Statistics() {
    const navigate = useNavigate();

    const [stats, setStats] = useState<any>(() => {
        const saved = localStorage.getItem("cache_stats");
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`${API_BASE_URL}/api/statistics`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setStats(data);
                localStorage.setItem("cache_stats", JSON.stringify(data));
            });
    }, []);

    const overview = stats?.overview ?? {
        total_score: 0,
        total_trainings: 0,
        total_putts: 0,
        rank: "-",
        total_time_hours: "0h",
    };

    const gameStats: any[] = stats?.gameStats ?? [];

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
                    <h1 className="text-sm font-medium tracking-widest text-gray-900">
                        STATISTIKY
                    </h1>
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

                {/* Statistiky her */}
                <section>
                    <SectionLabel>Dle módu</SectionLabel>

                    {gameStats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-2">
                            <p className="text-sm text-gray-400">Zatím nemáš žádné tréninky</p>
                            <p className="text-xs text-gray-300">Po první hře se tu objeví tvoje statistiky</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {gameStats.map((game: any) => {
                                const unit = modeUnit[game.name] ?? "";
                                const badge = modeBadgeClass[game.name] ?? "bg-gray-100 text-gray-500";

                                // Bar chart data: průměr vs nejlepší
                                const barData = [
                                    { label: "Průměr", value: game.avgScore },
                                    { label: "Nejlepší", value: game.bestScore },
                                ];

                                return (
                                    <div
                                        key={game.name}
                                        className="border border-gray-100 rounded-2xl p-5"
                                    >
                                        {/* Název + badge */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wide ${badge}`}>
                                                {game.name}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {game.attempts}{" "}
                                                {game.attempts === 1 ? "hra" : game.attempts <= 4 ? "hry" : "her"}
                                            </span>
                                        </div>

                                        {/* Stat řádky */}
                                        <div className="grid grid-cols-2 gap-3 mb-5">
                                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                                                <p className="text-xl font-medium text-gray-900">
                                                    {game.avgScore}
                                                    <span className="text-xs font-normal text-gray-400 ml-0.5">{unit}</span>
                                                </p>
                                                <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">Průměr</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                                                <p className="text-xl font-medium text-gray-900">
                                                    {game.bestScore}
                                                    <span className="text-xs font-normal text-gray-400 ml-0.5">{unit}</span>
                                                </p>
                                                <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">Nejlepší</p>
                                            </div>
                                        </div>

                                        {/* Mini bar chart průměr vs nejlepší */}
                                        <ResponsiveContainer width="100%" height={80}>
                                            <BarChart
                                                data={barData}
                                                margin={{ top: 0, right: 0, left: -32, bottom: 0 }}
                                                barCategoryGap="40%"
                                            >
                                                <CartesianGrid vertical={false} stroke="#f3f4f6" />
                                                <XAxis
                                                    dataKey="label"
                                                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />
                                                <YAxis
                                                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tickFormatter={(v) => `${v}${unit}`}
                                                />
                                                <Tooltip
                                                    cursor={{ fill: "#f9fafb" }}
                                                    content={({ active, payload }) => {
                                                        if (!active || !payload?.length) return null;
                                                        return (
                                                            <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm text-xs">
                                                                <p className="font-medium text-gray-900">
                                                                    {payload[0].payload.label}: {payload[0].value}{unit}
                                                                </p>
                                                            </div>
                                                        );
                                                    }}
                                                />
                                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                                    <Cell fill="#9ca3af" />
                                                    <Cell fill="#111827" />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
}