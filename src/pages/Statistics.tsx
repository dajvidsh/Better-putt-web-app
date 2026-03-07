import {ArrowLeft, TrendingUp} from "lucide-react";
import {useNavigate} from "react-router";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Statistics() {

    const navigate = useNavigate();
    const progressData = [
        { month: 'Leden', score: 1650 },
        { month: 'Únor', score: 1720 },
        { month: 'Březen', score: 1850 },
    ];

    const weeklyData = [
        { day: 'Po', minutes: 45 },
        { day: 'Út', minutes: 0 },
        { day: 'St', minutes: 60 },
        { day: 'Čt', minutes: 30 },
        { day: 'Pá', minutes: 90 },
        { day: 'So', minutes: 120 },
        { day: 'Ne', minutes: 75 },
    ];

    const gameStats = [
        { name: 'Putting', attempts: 12, avgScore: 38, bestScore: 45 },
        { name: 'Accuracy', attempts: 8, avgScore: 35, bestScore: 42 },
        { name: 'Distance', attempts: 15, avgScore: 78, bestScore: 92 },
        { name: 'Speed', attempts: 6, avgScore: 38, bestScore: 32 },
      ];

    return (
        <div className="size-full bg-white overflow-auto">
            <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
                <div className="flex items-center gap-4 px-6 py-4">
                  <button onClick={() => navigate(-1)} className="p-2 -ml-2 active:opacity-50 transition-opacity">
                    <ArrowLeft className="size-5" />
                  </button>
                  <h1 className="text-sm font-normal tracking-wide">STATISTIKY</h1>
                </div>
            </div>

            <div className="px-6 pb-24">
            {/* Overview Cards */}
            <div className="py-6">
              <h2 className="text-sm text-gray-400 mb-4">Přehled</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-gray-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <TrendingUp className="size-4" />
                    <span className="text-xs">+15%</span>
                  </div>
                  <p className="text-2xl font-light mb-1">1850</p>
                  <p className="text-xs text-gray-400">Celkové body</p>
                </div>

                <div className="border border-gray-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <TrendingUp className="size-4" />
                    <span className="text-xs">+5</span>
                  </div>
                  <p className="text-2xl font-light mb-1">47</p>
                  <p className="text-xs text-gray-400">Umístění</p>
                </div>

                <div className="border border-gray-100 rounded-lg p-4">
                  <p className="text-2xl font-light mb-1">24</p>
                  <p className="text-xs text-gray-400">Celkem tréninků</p>
                </div>

                <div className="border border-gray-100 rounded-lg p-4">
                  <p className="text-2xl font-light mb-1">12h</p>
                  <p className="text-xs text-gray-400">Celkový čas</p>
                </div>
              </div>
            </div>


            {/* Progress Chart */}
            <div className="py-6 border-t border-gray-100">
              <h2 className="text-sm text-gray-400 mb-4">Pokrok v bodech</h2>
              <div className="h-48 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#999" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#999" />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#000" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

                {/* Weekly Activity */}
        <div className="py-6 border-t border-gray-100">
          <h2 className="text-sm text-gray-400 mb-4">Aktivita tento týden</h2>
          <div className="h-48 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#999" />
                <YAxis tick={{ fontSize: 12 }} stroke="#999" />
                <Tooltip />
                <Bar dataKey="minutes" fill="#000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            Celkem: 420 minut tréninku
          </p>
        </div>


                <div className="py-6 border-t border-gray-100">
          <h2 className="text-sm text-gray-400 mb-4">Statistiky her</h2>
          <div className="space-y-4">
            {gameStats.map((game, index) => (
              <div key={index} className="border border-gray-100 rounded-lg p-4">
                <h3 className="font-normal mb-3">{game.name}</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-light">{game.attempts}</p>
                    <p className="text-xs text-gray-400">Pokusů</p>
                  </div>
                  <div>
                    <p className="text-lg font-light">{game.avgScore}</p>
                    <p className="text-xs text-gray-400">Průměr</p>
                  </div>
                  <div>
                    <p className="text-lg font-light">{game.bestScore}</p>
                    <p className="text-xs text-gray-400">Nejlepší</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

            </div>

        </div>
    )
}