import { BarChart3, Clock, Target, TrendingUp, Users, History } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

export default function Hero() {
    const navigate = useNavigate();

    // Stavy pro data
    const [games, setGames] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null); // Data z /api/me
    const [stats, setStats] = useState<any>(null); // Data z /api/statistics
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setIsLoggedIn(false);
            return;
        }

        setIsLoggedIn(true);
        const headers = { "Authorization": `Bearer ${token}` };

        // 1. Načtení info o uživateli (pro pozdrav)
        fetch("/api/me", { headers })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => setUser(data))
            .catch(() => setIsLoggedIn(false));

        // 2. Načtení statistik (pro horní boxy)
        fetch("/api/statistics", { headers })
            .then(res => res.ok ? res.json() : null)
            .then(data => setStats(data))
            .catch(err => console.error("Chyba statistik:", err));

        // 3. Načtení historie (pro seznam aktivit)
        fetch("/api/games", { headers })
            .then(res => res.ok ? res.json() : [])
            .then(data => setGames(data))
            .catch(err => console.error("Chyba her:", err));

    }, [navigate]);

    // Funkce pro bezpečné přesměrování
    const protectedNavigate = (path: string) => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            navigate(path);
        }
    };

    return (
        <div className="px-6 pb-20">
            {/* Hero Header */}
            <div className="py-8">
                <h1 className="text-2xl font-light mb-2">
                    {isLoggedIn && user ? `Vítej zpět, ${user.username}` : "Vítej v Better Putt"}
                </h1>
                <p className="text-gray-500 text-sm">
                    {isLoggedIn ? "Pokračuj ve svém tréninku" : "Zlepši své puttování ještě dnes"}
                </p>
            </div>

            {/* Horní Stat boxy */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="border border-gray-100 rounded-lg p-4 text-center bg-white shadow-sm">
                    <Target className="size-5 mx-auto mb-2 text-gray-400" strokeWidth={1.5}/>
                    <p className="text-lg font-light mb-1">{stats?.overview?.total_trainings || 0}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Tréninků</p>
                </div>
                <div className="border border-gray-100 rounded-lg p-4 text-center bg-white shadow-sm">
                    <Clock className="size-5 mx-auto mb-2 text-gray-400" strokeWidth={1.5}/>
                    <p className="text-lg font-light mb-1">{stats?.overview?.total_time_hours || "0h"}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Čas</p>
                </div>
                <div className="border border-gray-100 rounded-lg p-4 text-center bg-white shadow-sm">
                    <TrendingUp className="size-5 mx-auto mb-2 text-gray-400" strokeWidth={1.5}/>
                    <p className="text-lg font-light mb-1">{stats?.overview?.total_putts || 0}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Puttů</p>
                </div>
            </div>

            {/* Hlavní menu dlaždice */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <button
                    onClick={() => protectedNavigate('/statistics')}
                    className="border border-gray-200 rounded-lg p-4 text-center active:bg-gray-50 bg-white transition-colors shadow-sm"
                >
                    <BarChart3 className="size-6 mx-auto mb-2 text-black" strokeWidth={1.5}/>
                    <p className="text-[10px] font-medium uppercase">Statistiky</p>
                </button>
                <button
                    onClick={() => protectedNavigate('/leaderboard')}
                    className="border border-gray-200 rounded-lg p-4 text-center active:bg-gray-50 bg-white transition-colors shadow-sm"
                >
                    <Users className="size-6 mx-auto mb-2 text-black" strokeWidth={1.5}/>
                    <p className="text-[10px] font-medium uppercase">Žebříček</p>
                </button>
                <button
                    onClick={() => protectedNavigate('/history')}
                    className="border border-gray-200 rounded-lg p-4 text-center active:bg-gray-50 bg-white transition-colors shadow-sm"
                >
                    <History className="size-6 mx-auto mb-2 text-black" strokeWidth={1.5}/>
                    <p className="text-[10px] font-medium uppercase">Historie</p>
                </button>
            </div>

            {/* Poslední aktivity */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest">Poslední aktivity</h2>
                    {isLoggedIn && (
                        <button onClick={() => navigate(`/history`)} className="text-xs font-bold text-black border-b border-black">VŠE</button>
                    )}
                </div>

                <div className="space-y-1">
                    {!isLoggedIn ? (
                        <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                            <p className="text-sm text-gray-400 mb-3">Pro zobrazení tvých her se přihlas</p>
                            <button
                                onClick={() => navigate('/login')}
                                className="text-sm font-bold underline"
                            >
                                PŘIHLÁSIT SE
                            </button>
                        </div>
                    ) : games.length > 0 ? (
                        games.slice(0, 3).map((game) => (
                            <button
                                key={game.id}
                                className="w-full text-left py-4 border-b border-gray-100 active:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium mb-1 tracking-tight">{game.game_name}</h3>
                                        <p className="text-xs text-gray-400">{game.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">
                                            {game.total_score}
                                            <span className="text-[10px] ml-0.5 font-normal text-gray-400">
                                                {game.game_mode_id === 'survival' ? 'm' : game.game_mode_id === 'drill' ? '%' : ' pts'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 py-10 text-sm italic">Zatím jsi neodehrál žádnou hru.</p>
                    )}
                </div>

                <button
                    onClick={() => protectedNavigate('/training')}
                    className="w-full bg-black text-white py-4 mt-8 active:opacity-70 transition-opacity"
                >
                    Začít trénink
                </button>
            </div>
        </div>
    );
}