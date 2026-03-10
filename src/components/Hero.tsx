import {BarChart3, Clock, Target, TrendingUp, Users, History} from "lucide-react";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router";
import {useEffect, useState} from "react";

export default function Hero() {

    const navigate = useNavigate();
    const [games, setGames] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        fetch("https://better-putt-web-app-server.onrender.com/api/games")
        // fetch("http://127.0.0.1:8000/api/games")
            .then(res => res.json())
            .then(data => setGames(data))
            .catch(err => console.error(err))
        // .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        fetch("https://better-putt-web-app-server.onrender.com/api/statistics")
        // fetch("http://127.0.0.1:8000/api/statistics")
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error(err))
    }, []);

    return (
        <div className="px-6 pb-20">
            {/* Hero */}
            <div className="py-8">
                <h1 className="text-2xl font-light mb-2">Vítej zpět</h1>
                <p className="text-gray-500">Pokračuj v tréninku</p>
            </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="border border-gray-100 rounded-lg p-4 text-center">
                        <Target className="size-5 mx-auto mb-2 text-gray-400" strokeWidth={1.5}/>
                        <p className="text-lg font-light mb-1">{stats?.overview?.total_trainings || 0}</p>
                        <p className="text-xs text-gray-400">Tréninků</p>
                    </div>
                    <div className="border border-gray-100 rounded-lg p-4 text-center">
                        <Clock className="size-5 mx-auto mb-2 text-gray-400" strokeWidth={1.5}/>
                        <p className="text-lg font-light mb-1">{stats?.overview?.total_trainings || 0}h</p>
                        <p className="text-xs text-gray-400">Hod. trénink</p>
                    </div>
                    <div className="border border-gray-100 rounded-lg p-4 text-center">
                        <TrendingUp className="size-5 mx-auto mb-2 text-gray-400" strokeWidth={1.5}/>
                        <p className="text-lg font-light mb-1">{stats?.overview?.total_putts || 0}</p>
                        <p className="text-xs text-gray-400">puttů</p>
                    </div>
                </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
                <Link to={'/statistics'}
                      className="border border-gray-300 rounded-lg p-4 text-center active:bg-gray-50">
                    <BarChart3 className="size-6 mx-auto mb-2" strokeWidth={1.5}/>
                    <p className="text-xs font-light mb-1">Statistiky</p>
                </Link>
                <Link to={'/leaderboard'}
                      className="border border-gray-300 rounded-lg p-4 text-center active:bg-gray-50">
                    <Users className="size-6 mx-auto mb-2" strokeWidth={1.5}/>
                    <p className="text-xs">Žebříček</p>
                </Link>
                <Link to={'/history'} className="border border-gray-300 rounded-lg p-4 text-center active:bg-gray-50">
                    <History className="size-6 mx-auto mb-2" strokeWidth={1.5}/>
                    <p className="text-xs">Historie</p>
                </Link>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm text-gray-400">Poslední aktivity</h2>
                    <button onClick={() => navigate(`/history`)} className="text-sm text-black">Vše</button>
                </div>

                <div className="space-y-1">
                    {games.map((game) => (
                        <button
                            key={game.id}
                            className="w-full text-left py-4 border-b border-gray-100 active:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-normal mb-1">{game.game_name}</h3>
                                    <p className="text-sm text-gray-400">{game.date}</p>
                                </div>
                                <p className="text-sm">{game.total_score} {game.game_name === 'SURVIVAL' ? 'm' : game.game_name === 'DRILL' ? '%' : ''}</p>
                            </div>
                        </button>
                    )).slice(0, 3)}
                </div>

                <button onClick={() => navigate(`/training`)}
                        className="w-full bg-black text-white py-4 mt-8 active:opacity-70 transition-opacity">
                    Začít trénink
                </button>
            </div>
        </div>
    )
}