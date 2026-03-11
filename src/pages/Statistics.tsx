import {ArrowLeft} from "lucide-react";
import {useNavigate} from "react-router";
import {useState, useEffect} from 'react';

export default function Statistics() {
    const navigate = useNavigate();

    // 1. Získáme cache hned na začátku mimo state pro okamžitý přístup
    const getCachedData = () => {
        const saved = localStorage.getItem('cache_stats');
        return saved ? JSON.parse(saved) : null;
    };

    const [stats, setStats] = useState<any>(getCachedData);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        fetch("/api/statistics", {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            setStats(data);
            localStorage.setItem('cache_stats', JSON.stringify(data));
        });
    }, []);

    // 2. Definujeme overview tak, aby prioritně bral data, která už v stats JSOU
    // Pokud stats existují (i z cache), overview nebude prázdné
    const overview = stats?.overview || {
        total_score: 0,
        total_trainings: 0,
        total_putts: 0,
        rank: "-",
        total_time_hours: "0h"
    };

    // Fiktivní data pro grafy (na ty se vrhneme později)
    // const progressData = [
    //     { month: 'Leden', score: 1650 },
    //     { month: 'Únor', score: 1720 },
    //     { month: 'Březen', score: 1850 },
    // ];
    //
    // const weeklyData = [
    //     { day: 'Po', minutes: 45 },
    //     { day: 'Út', minutes: 0 },
    //     { day: 'St', minutes: 60 },
    //     { day: 'Čt', minutes: 30 },
    //     { day: 'Pá', minutes: 90 },
    //     { day: 'So', minutes: 120 },
    //     { day: 'Ne', minutes: 75 },
    // ];

    // if (isLoading) {
    //     return (
    //         <div className="size-full bg-white flex items-center justify-center">
    //             <p className="text-gray-400 font-light">Načítám statistiky...</p>
    //         </div>
    //     );
    // }

    const gameStats = stats?.gameStats || [];

    return (
        <div className="size-full bg-white overflow-auto">
            {/* Hlavička */}
            <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
                <div className="flex items-center gap-4 px-6 py-4">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 active:opacity-50 transition-opacity">
                        <ArrowLeft className="size-5"/>
                    </button>
                    <h1 className="text-sm font-normal tracking-wide">STATISTIKY</h1>
                </div>
            </div>

            <div className="px-6 pb-24">
                <div className="py-6">
                    <h2 className="text-sm text-gray-400 mb-4">Přehled</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <div
                            className="w-full border border-gray-200 rounded-lg p-4 active:bg-gray-50 bg-white transition-colors shadow-sm">
                            {/*<div className="flex items-center gap-2 text-green-600 mb-2">*/}
                            {/*  <TrendingUp className="size-4" />*/}
                            {/*  <span className="text-xs">+15%</span>*/}
                            {/*</div>*/}
                            <p className="text-2xl font-light mb-1">{overview.total_putts}</p>
                            <p className="text-xs text-gray-400">Celkem puttů</p>
                        </div>

                        <div
                            className="w-full border border-gray-200 rounded-lg p-4 active:bg-gray-50 bg-white transition-colors shadow-sm">
                            {/*<div className="flex items-center gap-2 text-green-600 mb-2">*/}
                            {/*  <TrendingUp className="size-4" />*/}
                            {/*  <span className="text-xs">+5</span>*/}
                            {/*</div>*/}
                            <p className="text-2xl font-light mb-1">{overview.rank}</p>
                            <p className="text-xs text-gray-400">Umístění</p>
                        </div>

                        <div
                            className="w-full border border-gray-200 rounded-lg p-4 active:bg-gray-50 bg-white transition-colors shadow-sm">
                            <p className="text-2xl font-light mb-1">{overview.total_trainings}</p>
                            <p className="text-xs text-gray-400">Celkem tréninků</p>
                        </div>

                        <div
                            className="w-full border border-gray-200 rounded-lg p-4 active:bg-gray-50 bg-white transition-colors shadow-sm">
                            <p className="text-2xl font-light mb-1">{overview.total_time_hours}</p>
                            <p className="text-xs text-gray-400">Celkový čas</p>
                        </div>
                    </div>
                </div>

                {/* Progress Chart (Zatím testovací data) */}
                {/*<div className="py-6 border-t border-gray-100">*/}
                {/*  <h2 className="text-sm text-gray-400 mb-4">Pokrok v bodech</h2>*/}
                {/*  <div className="h-48 -mx-2">*/}
                {/*    <ResponsiveContainer width="100%" height="100%">*/}
                {/*      <LineChart data={progressData}>*/}
                {/*        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />*/}
                {/*        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#999" />*/}
                {/*        <YAxis tick={{ fontSize: 12 }} stroke="#999" />*/}
                {/*        <Tooltip />*/}
                {/*        <Line type="monotone" dataKey="score" stroke="#000" strokeWidth={2} dot={{ r: 4 }} />*/}
                {/*      </LineChart>*/}
                {/*    </ResponsiveContainer>*/}
                {/*  </div>*/}
                {/*</div>*/}

                {/* Weekly Activity (Zatím testovací data) */}
                {/*<div className="py-6 border-t border-gray-100">*/}
                {/*  <h2 className="text-sm text-gray-400 mb-4">Aktivita tento týden</h2>*/}
                {/*  <div className="h-48 -mx-2">*/}
                {/*    <ResponsiveContainer width="100%" height="100%">*/}
                {/*      <BarChart data={weeklyData}>*/}
                {/*        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />*/}
                {/*        <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#999" />*/}
                {/*        <YAxis tick={{ fontSize: 12 }} stroke="#999" />*/}
                {/*        <Tooltip />*/}
                {/*        <Bar dataKey="minutes" fill="#000" radius={[4, 4, 0, 0]} />*/}
                {/*      </BarChart>*/}
                {/*    </ResponsiveContainer>*/}
                {/*  </div>*/}
                {/*</div>*/}

                {/* Statistiky her */}
                <div className="py-6 border-t border-gray-100">
                    <h2 className="text-sm text-gray-400 mb-4">Statistiky her</h2>
                    {gameStats.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4 bg-gray-50 rounded-lg">
                            Zatím nemáš odehrané žádné tréninky.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {gameStats.map((game: any, index: number) => (
                                <div key={index}
                                     className="w-full border border-gray-200 rounded-lg p-4 active:bg-gray-50 bg-white transition-colors shadow-sm">
                                    <h3 className="font-normal mb-3">{game.name}</h3>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <p className="text-lg font-light">{game.attempts}</p>
                                            <p className="text-xs text-gray-400"> {game.attempts === 1 ? "Hra" : game.attempts <= 4 ? "Hry" : "Her"} </p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-light">{game.avgScore} {game.name === 'DRILL' ? '%' : game.name === 'SURVIVAL' ? 'm' : ''}</p>
                                            <p className="text-xs text-gray-400">Průměr</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-light">{game.bestScore} {game.name === 'DRILL' ? '%' : game.name === 'SURVIVAL' ? 'm' : ''}</p>
                                            <p className="text-xs text-gray-400">Nejlepší</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}