import {Award, ChevronRight, LogOut, Target, TrendingUp} from "lucide-react";
import {useNavigate} from "react-router";

export default function Profile() {

    const navigate = useNavigate();

    const user = [{
        id: 1, name: "Jan Novak", memberSince: "12.1.2025"
    }];

    const stats = [{
        id: 1, rank: 12, points: 250, trainings: 15, idUser: 1
    }];

    const menuItems = [
        { label: 'Upravit profil', value: '', path: '' },
        { label: 'Statistiky', value: '', path: '/statistics' },
        { label: 'Historie tréninků', value: '', path: '/history' },
        { label: 'Sociální', value: '', path: '/social' },
        { label: 'Nastavení', value: '', path: '/settings' },
      ];

    return (
        <div className="px-6 pb-25">
            {/* Profile Header */}
            <div className="py-8 text-center border-b border-gray-100">
                <div className="size-20 bg-black rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-light">
                    {user[0].name.charAt(0).toUpperCase()}
                </div>
                <h1 className="text-xl font-normal mb-1">{user[0].name}</h1>
                <p className="text-gray-500 text-sm mb-4">Členem od {user[0].memberSince}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 py-8 text-center border-b border-gray-100">
                <div>
                  <p className="text-2xl font-light mb-1">{stats[0].trainings}</p>
                  <p className="text-xs text-gray-400">Tréninků</p>
                </div>
                <div>
                  <p className="text-2xl font-light mb-1">{stats[0].rank}.</p>
                  <p className="text-xs text-gray-400">Umístění</p>
                </div>
                <div>
                  <p className="text-2xl font-light mb-1">{stats[0].points}</p>
                  <p className="text-xs text-gray-400">Bodů</p>
                </div>
            </div>

            {/* Achievements */}
            <div className="py-6 border-b border-gray-100">
                <h2 className="text-sm text-gray-400 mb-4">Úspěchy</h2>
                <div className="flex gap-3">
                    <div className={`flex-1 border rounded-lg p-4 text-center border-gray-200 bg-gray-50`}>
                        <Target className="size-6 mx-auto mb-2" strokeWidth={1.5} />
                        <p className="text-xs text-gray-600">50 tréninků</p>
                    </div>
                    <div className={`flex-1 border rounded-lg p-4 text-center border-gray-200 bg-gray-50`}>
                        <TrendingUp className="size-6 mx-auto mb-2" strokeWidth={1.5} />
                        <p className="text-xs text-gray-600">Zlepšení</p>
                    </div>
                    <div className={`flex-1 border rounded-lg p-4 text-center border-gray-100 opacity-40`}>
                        <Award className="size-6 mx-auto mb-2" strokeWidth={1.5} />
                        <p className="text-xs text-gray-600">Top 10</p>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <div className="py-4 space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => item.path && navigate(item.path)}
                className="w-full flex items-center justify-between py-4 border-b border-gray-100 active:bg-gray-50 transition-colors"
              >
                <span>{item.label}</span>
                <ChevronRight className="size-5 text-gray-400" />
              </button>
            ))}
            </div>

            {/* Logout */}
            <button
                // onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-4 mt-8 text-red-500 active:opacity-50 transition-opacity"
                >
                <LogOut className="size-5" />
                Odhlásit se
            </button>
        </div>
    )
}