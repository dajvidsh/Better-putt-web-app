import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, LineChart, Line, ReferenceLine,
} from "recharts";

// ── Typy ────────────────────────────────────────────────────────────────────

interface Round {
    round_number: number;
    distance: number;
    attempts: number;
    makes: number;
    score_earned: number;
}

interface GameDetail {
    id: number;
    game_mode_id: "drill" | "survival" | "jyly";
    game_name: string;
    total_score: number;
    total_makes: number;
    total_attempts: number;
    date: string;
    rounds: Round[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

// ── Helpers ──────────────────────────────────────────────────────────────────

const pct = (makes: number, attempts: number) =>
    attempts ? Math.round((makes / attempts) * 100) : 0;

const pctColor = (p: number) =>
    p >= 80 ? "#16a34a" : p >= 50 ? "#111827" : "#dc2626";

const survivalColor = (makes: number) => {
    if (makes === 0) return "#ef4444";
    if (makes === 1) return "#f97316";
    if (makes === 2) return "#9ca3af";
    return "#84cc16";
};

function groupByDistance(rounds: Round[]) {
    const map: Record<number, { makes: number; attempts: number }> = {};
    for (const r of rounds) {
        if (!map[r.distance]) map[r.distance] = { makes: 0, attempts: 0 };
        map[r.distance].makes += r.makes;
        map[r.distance].attempts += r.attempts;
    }
    return Object.entries(map)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([dist, d]) => ({
            dist: Number(dist),
            makes: d.makes,
            attempts: d.attempts,
            pct: pct(d.makes, d.attempts),
        }));
}

// ── Sdílené sub-komponenty ───────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">
            {children}
        </p>
    );
}

function Card({ children }: { children: React.ReactNode }) {
    return (
        <div className="border border-gray-100 rounded-2xl p-5">
            {children}
        </div>
    );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
    return (
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl py-4 px-2">
            <span className="text-2xl font-medium tracking-tight text-gray-900 leading-none">
                {value}
            </span>
            {sub && <span className="text-[10px] text-gray-400 mt-0.5">{sub}</span>}
            <span className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">{label}</span>
        </div>
    );
}

function TooltipBox({ label, rows }: { label: string; rows: [string, string][] }) {
    return (
        <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm text-xs">
            <p className="font-medium text-gray-900 mb-1">{label}</p>
            {rows.map(([k, v]) => (
                <p key={k} className="text-gray-500">
                    <span className="text-gray-900">{v}</span> {k}
                </p>
            ))}
        </div>
    );
}

// ── DRILL ────────────────────────────────────────────────────────────────────

function DrillStats({ game }: { game: GameDetail }) {
    const overall = pct(game.total_makes, game.total_attempts);
    const distance = game.rounds[0]?.distance ?? "?";

    let best = 0, cur = 0;
    for (const r of game.rounds) {
        if (r.makes === r.attempts) { cur++; best = Math.max(best, cur); }
        else cur = 0;
    }

    const chartData = game.rounds.map((r) => ({ ...r, p: pct(r.makes, r.attempts) }));

    return (
        <>
            <div className="grid grid-cols-3 gap-3">
                <StatCard label="Úspěšnost" value={`${overall} %`} />
                <StatCard label="Trefeno" value={game.total_makes} sub={`z ${game.total_attempts}`} />
                <StatCard label="Vzdálenost" value={`${distance} m`} />
            </div>

            <Card>
                <SectionLabel>Úspěšnost po kolech</SectionLabel>
                <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={chartData} margin={{ top: 4, right: 0, left: -32, bottom: 0 }} barCategoryGap="30%">
                        <CartesianGrid vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="round_number" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} ticks={[0, 50, 100]} />
                        <ReferenceLine y={overall} stroke="#e5e7eb" strokeDasharray="4 4" />
                        <Tooltip cursor={{ fill: "#f9fafb" }} content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;
                            const r = payload[0].payload as Round & { p: number };
                            return <TooltipBox label={`Kolo ${r.round_number}`} rows={[["trefeno", `${r.makes}/${r.attempts}`], ["úspěšnost", `${r.p} %`]]} />;
                        }} />
                        <Bar dataKey="p" radius={[4, 4, 0, 0]}>
                            {chartData.map((r, i) => (
                                <Cell key={i} fill={r.p >= 80 ? "#111827" : r.p >= 50 ? "#9ca3af" : "#e5e7eb"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                {best > 1 && (
                    <p className="text-[11px] text-gray-400 mt-2 text-right">
                        Nejlepší série: <span className="text-gray-700 font-medium">{best} kol za sebou</span>
                    </p>
                )}
            </Card>

            <RoundsTable rounds={game.rounds} showScore={false} />
        </>
    );
}

// ── SURVIVAL ──────────────────────────────────────────────────────────────────

function SurvivalStats({ game }: { game: GameDetail }) {
    const maxDist = game.total_score;
    const roundsPlayed = game.rounds.length;
    const overall = pct(game.total_makes, game.total_attempts);

    const progressData = game.rounds.map((r) => ({ ...r, label: `K${r.round_number}` }));

    const resultCounts = [0, 1, 2, 3].map((n) => ({
        makes: n,
        count: game.rounds.filter((r) => r.makes === n).length,
        label: n === 0 ? "Miss (0)" : n === 1 ? "1 zásah" : n === 2 ? "2 zásahy" : "Perfekt (3)",
    }));

    return (
        <>
            <div className="grid grid-cols-3 gap-3">
                <StatCard label="Max. vzdál." value={`${maxDist} m`} />
                <StatCard label="Kol přežito" value={roundsPlayed} />
                <StatCard label="Úspěšnost" value={`${overall} %`} />
            </div>

            <Card>
                <SectionLabel>Postup vzdálenosti</SectionLabel>
                <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={progressData} margin={{ top: 4, right: 8, left: -32, bottom: 0 }}>
                        <CartesianGrid vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                        <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}m`} />
                        <Tooltip cursor={{ stroke: "#e5e7eb" }} content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;
                            const r = payload[0].payload as Round;
                            return <TooltipBox label={`Kolo ${r.round_number}`} rows={[["vzdálenost", `${r.distance} m`], ["trefeno", `${r.makes}/3`]]} />;
                        }} />
                        <Line type="monotone" dataKey="distance" stroke="#111827" strokeWidth={1.5}
                            dot={(props: any) => {
                                const r = props.payload as Round;
                                return <circle key={props.key} cx={props.cx} cy={props.cy} r={3} fill={survivalColor(r.makes)} stroke="white" strokeWidth={1} />;
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
                <div className="flex gap-3 mt-3 flex-wrap">
                    {[{ c: "#ef4444", l: "Miss" }, { c: "#f97316", l: "1/3" }, { c: "#9ca3af", l: "2/3" }, { c: "#84cc16", l: "3/3" }].map(({ c, l }) => (
                        <div key={l} className="flex items-center gap-1">
                            <div className="size-2 rounded-full" style={{ background: c }} />
                            <span className="text-[10px] text-gray-400">{l}</span>
                        </div>
                    ))}
                </div>
            </Card>

            <Card>
                <SectionLabel>Výsledky kol</SectionLabel>
                <div className="space-y-2.5">
                    {resultCounts.map(({ makes, count, label }) => {
                        const share = roundsPlayed ? Math.round((count / roundsPlayed) * 100) : 0;
                        return (
                            <div key={makes} className="flex items-center gap-3">
                                <div className="size-2 rounded-full shrink-0" style={{ background: survivalColor(makes) }} />
                                <span className="text-xs text-gray-500 w-20 shrink-0">{label}</span>
                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${share}%`, background: survivalColor(makes) }} />
                                </div>
                                <span className="text-xs font-medium text-gray-700 w-6 text-right">{count}×</span>
                            </div>
                        );
                    })}
                </div>
            </Card>

            <RoundsTable rounds={game.rounds} showScore={false} survival />
        </>
    );
}

// ── JYLY ──────────────────────────────────────────────────────────────────────

function JylyStats({ game }: { game: GameDetail }) {
    const overall = pct(game.total_makes, game.total_attempts);
    const distGroups = groupByDistance(game.rounds);
    const chartData = game.rounds.map((r) => ({ ...r, p: pct(r.makes, r.attempts) }));

    return (
        <>
            <div className="grid grid-cols-3 gap-3">
                <StatCard label="Skóre" value={game.total_score} />
                <StatCard label="Trefeno" value={`${game.total_makes}/${game.total_attempts}`} />
                <StatCard label="Úspěšnost" value={`${overall} %`} />
            </div>

            <Card>
                <SectionLabel>Úspěšnost po kolech</SectionLabel>
                <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={chartData} margin={{ top: 4, right: 0, left: -32, bottom: 0 }} barCategoryGap="30%">
                        <CartesianGrid vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="round_number" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} ticks={[0, 50, 100]} />
                        <ReferenceLine y={overall} stroke="#e5e7eb" strokeDasharray="4 4" />
                        <Tooltip cursor={{ fill: "#f9fafb" }} content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;
                            const r = payload[0].payload as Round & { p: number };
                            return <TooltipBox label={`Kolo ${r.round_number}`} rows={[["vzdálenost", `${r.distance} m`], ["trefeno", `${r.makes}/${r.attempts}`], ["body", `+${r.score_earned}`]]} />;
                        }} />
                        <Bar dataKey="p" radius={[4, 4, 0, 0]}>
                            {chartData.map((r, i) => (
                                <Cell key={i} fill={r.p >= 80 ? "#111827" : r.p >= 50 ? "#9ca3af" : "#e5e7eb"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            {distGroups.length > 1 && (
                <Card>
                    <SectionLabel>Dle vzdálenosti</SectionLabel>
                    <div className="space-y-3">
                        {distGroups.map(({ dist, makes, attempts, pct: p }) => (
                            <div key={dist} className="flex items-center gap-3">
                                <span className="text-xs text-gray-400 w-8 shrink-0">{dist} m</span>
                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-gray-900 rounded-full" style={{ width: `${p}%` }} />
                                </div>
                                <span className="text-xs font-medium w-10 text-right" style={{ color: pctColor(p) }}>
                                    {p} %
                                </span>
                                <span className="text-xs text-gray-300 w-10 text-right">{makes}/{attempts}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            <RoundsTable rounds={game.rounds} showScore />
        </>
    );
}

// ── Tabulka kol ─────────────────────────────────────────────────────────────

function RoundsTable({ rounds, showScore, survival }: { rounds: Round[]; showScore: boolean; survival?: boolean }) {
    return (
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <div className="px-5 pt-5 pb-3">
                <SectionLabel>Detail kol</SectionLabel>
            </div>
            <div className="divide-y divide-gray-50">
                {rounds.map((r) => {
                    const p = pct(r.makes, r.attempts);
                    return (
                        <div key={r.round_number} className="flex items-center justify-between px-5 py-3">
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-gray-400 w-5">{r.round_number}</span>
                                <span className="text-xs text-gray-500">{r.distance} m</span>
                            </div>
                            <div className="flex items-center gap-4">
                                {survival ? (
                                    <div className="flex gap-1">
                                        {Array.from({ length: r.attempts }).map((_, i) => (
                                            <div
                                                key={i}
                                                className="size-2 rounded-full"
                                                style={{ background: i < r.makes ? survivalColor(r.makes) : "#e5e7eb" }}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-xs text-gray-400">{r.makes}/{r.attempts}</span>
                                )}
                                {showScore && (
                                    <span className="text-xs text-gray-400">+{r.score_earned}</span>
                                )}
                                <span className="text-xs font-medium w-10 text-right" style={{ color: pctColor(p) }}>
                                    {p} %
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ── Hlavní komponenta ────────────────────────────────────────────────────────

export default function GameDetailStats() {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState<GameDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || !gameId) return;

        fetch(`${API_BASE_URL}/api/games/${gameId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => (res.ok ? res.json() : Promise.reject()))
            .then((data) => { setGame(data); setLoading(false); })
            .catch(() => navigate("/history"));
    }, [gameId]);

    if (loading)
        return (
            <div className="flex items-center justify-center h-48">
                <span className="text-sm text-gray-400 tracking-wide">Načítám...</span>
            </div>
        );

    if (!game) return null;

    return (
        <div className="min-h-full bg-white pb-8">
            <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
                <div className="flex items-center gap-3 px-6 py-4 max-w-md mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft className="size-5 text-gray-700" />
                    </button>
                    <div>
                        <h1 className="text-sm font-medium tracking-widest text-gray-900">
                            {game.game_name}
                        </h1>
                        <p className="text-[11px] text-gray-400 tracking-wide">{game.date}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-6 pt-6 space-y-5">
                {game.game_mode_id === "drill" && <DrillStats game={game} />}
                {game.game_mode_id === "survival" && <SurvivalStats game={game} />}
                {(game.game_mode_id === "jyly" || !["drill", "survival"].includes(game.game_mode_id)) && (
                    <JylyStats game={game} />
                )}
            </div>
        </div>
    );
}