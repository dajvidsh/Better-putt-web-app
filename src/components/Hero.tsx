import { BarChart3, Clock, Target, TrendingUp, Users, History } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const modeUnit: Record<string, string> = {
    survival: "m",
    drill: "%",
    jyly: "pts",
};

const modeBadgeClass: Record<string, string> = {
    jyly: "bg-gray-100 text-gray-500",
    survival: "bg-orange-50 text-orange-400",
    drill: "bg-blue-50 text-blue-400",
};

export default function Hero() {
    const navigate = useNavigate();

    const [games, setGames] = useState<any[]>(() => {
        const saved = localStorage.getItem("cache_games");
        return saved ? JSON.parse(saved) : [];
    });
    const [user, setUser] = useState<any>(() => {
        const saved = localStorage.getItem("cache_user");
        return saved ? JSON.parse(saved) : null;
    });
    const [stats, setStats] = useState<any>(() => {
        const saved = localStorage.getItem("cache_stats");
        return saved ? JSON.parse(saved) : null;
    });
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { setIsLoggedIn(false); return; }

        const headers = { Authorization: `Bearer ${token}` };

        fetch(`${API_BASE_URL}/api/me`, { headers })
            .then((res) => (res.ok ? res.json() : Promise.reject()))
            .then((data) => { setUser(data); localStorage.setItem("cache_user", JSON.stringify(data)); })
            .catch(() => setIsLoggedIn(false));

        fetch(`${API_BASE_URL}/api/statistics`, { headers })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => { if (data) { setStats(data); localStorage.setItem("cache_stats", JSON.stringify(data)); } });

        fetch(`${API_BASE_URL}/api/games`, { headers })
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => { setGames(data); localStorage.setItem("cache_games", JSON.stringify(data)); });
    }, []);

    const protectedNavigate = (path: string) => {
        isLoggedIn ? navigate(path) : navigate("/login");
    };

    const overview = stats?.overview;

    return (
        <div className="px-6 pb-20">

            {/* Header */}
            <div className="py-8 flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-normal tracking-tight text-black">BETTER PUTT</h1>
                    <p className="text-sm text-gray-400 tracking-wider mt-1">
                        {isLoggedIn && user ? user.username : "Vítej v tréninku"}
                    </p>
                </div>
                {isLoggedIn && overview && (
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 border border-gray-100 rounded-full px-3 py-1">
                        #{overview.rank}
                    </span>
                )}
            </div>

            {/* Stat boxy */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                    <Target className="size-4 mx-auto mb-2 text-gray-400" strokeWidth={1.5} />
                    <p className="text-lg font-medium text-gray-900 leading-none">
                        {overview?.total_trainings ?? 0}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1.5">Tréninků</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                    <Clock className="size-4 mx-auto mb-2 text-gray-400" strokeWidth={1.5} />
                    <p className="text-lg font-medium text-gray-900 leading-none">
                        {overview?.total_time_hours ?? "0h"}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1.5">Čas</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                    <TrendingUp className="size-4 mx-auto mb-2 text-gray-400" strokeWidth={1.5} />
                    <p className="text-lg font-medium text-gray-900 leading-none">
                        {overview?.total_putts ?? 0}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1.5">Puttů</p>
                </div>
            </div>

            {/* Navigační dlaždice */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                <button
                    onClick={() => protectedNavigate("/statistics")}
                    className="border border-gray-100 rounded-2xl p-4 text-center active:bg-gray-50 bg-white transition-colors"
                >
                    <BarChart3 className="size-5 mx-auto mb-2 text-black" strokeWidth={1.5} />
                    <p className="text-[10px] font-medium uppercase tracking-wide">Statistiky</p>
                </button>
                <button
                    onClick={() => protectedNavigate("/leaderboard")}
                    className="border border-gray-100 rounded-2xl p-4 text-center active:bg-gray-50 bg-white transition-colors"
                >
                    <Users className="size-5 mx-auto mb-2 text-black" strokeWidth={1.5} />
                    <p className="text-[10px] font-medium uppercase tracking-wide">Žebříček</p>
                </button>
                <button
                    onClick={() => protectedNavigate("/history")}
                    className="border border-gray-100 rounded-2xl p-4 text-center active:bg-gray-50 bg-white transition-colors"
                >
                    <History className="size-5 mx-auto mb-2 text-black" strokeWidth={1.5} />
                    <p className="text-[10px] font-medium uppercase tracking-wide">Historie</p>
                </button>
            </div>

            {/* Poslední aktivity */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400">
                        Poslední aktivity
                    </p>
                    {isLoggedIn && games.length > 0 && (
                        <button
                            onClick={() => navigate("/history")}
                            className="text-[10px] uppercase tracking-widest font-medium text-black border-b border-black pb-0.5"
                        >
                            Vše
                        </button>
                    )}
                </div>

                {!isLoggedIn ? (
                    <div className="py-10 text-center border border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
                        <p className="text-sm text-gray-400 mb-3">Pro zobrazení tvých her se přihlas</p>
                        <button
                            onClick={() => navigate("/login")}
                            className="text-sm font-medium underline text-black"
                        >
                            Přihlásit se
                        </button>
                    </div>
                ) : games.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                        {games.slice(0, 3).map((game) => (
                            <button
                                key={game.id}
                                onClick={() => navigate(`/history/${game.id}`)}
                                className="w-full text-left py-3.5 active:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0 ${modeBadgeClass[game.game_mode_id] ?? "bg-gray-100 text-gray-500"}`}>
                                            {game.game_name}
                                        </span>
                                        <p className="text-xs text-gray-400 truncate">{game.date}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-medium text-gray-900">
                                            {game.total_score}
                                            <span className="text-[10px] ml-0.5 font-normal text-gray-400">
                                                {modeUnit[game.game_mode_id] ?? ""}
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
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 gap-2">
                        <p className="text-sm text-gray-400">Zatím jsi neodehrál žádnou hru</p>
                        <p className="text-xs text-gray-300">Začni první trénink níže</p>
                    </div>
                )}

                <button
                    onClick={() => protectedNavigate("/training")}
                    className="w-full bg-black text-white py-4 mt-8 rounded-none active:opacity-70 transition-opacity tracking-wide text-sm"
                >
                    Začít trénink
                </button>
            </div>
        </div>
    );
}