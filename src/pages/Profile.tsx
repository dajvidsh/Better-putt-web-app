import {Award, ChevronRight, LogOut, Target, TrendingUp} from "lucide-react";
import {useNavigate} from "react-router";
import {useEffect, useState} from "react";

export default function Profile() {
    const navigate = useNavigate();

    // Pomocné funkce pro čistý kód
    const getCache = (key: string) => {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : null;
    };

    // 1. Inicializace přímo z cache - stránka se vykreslí OKAMŽITĚ
    const [user, setUser] = useState<any>(() => getCache('cache_user'));
    const [stats, setStats] = useState<any>(() => getCache('cache_stats'));

    // Loading je false, pokud už jsme něco vyhrabali z cache
    const [loading, setLoading] = useState(!user);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const headers = {"Authorization": `Bearer ${token}`};

        // 2. Refresh uživatele
        fetch("/api/me", {headers})
            .then(res => {
                if (res.status === 401) {
                    localStorage.clear();
                    navigate('/login');
                    throw new Error("Unauthorized");
                }
                return res.json();
            })
            .then(data => {
                setUser(data);
                localStorage.setItem('cache_user', JSON.stringify(data));
                setLoading(false); // Vypneme loading, až když dorazí první ostrá data
            })
            .catch(err => {
                console.error("Profile error:", err);
                setLoading(false); // Vypnout i při chybě, aby nezůstal viset loader
            });

        // 3. Refresh statistik na pozadí
        fetch("/api/statistics", {headers})
            .then(res => res.json())
            .then(data => {
                setStats(data);
                localStorage.setItem('cache_stats', JSON.stringify(data));
            })
            .catch(err => console.error("Stats error:", err));
    }, [navigate]);

    // Pokud nemáme cache a ani se ještě nic nenačetlo
    if (loading) {
        return (
            <div className="size-full flex items-center justify-center bg-white p-6">
                <p className="text-gray-400 animate-pulse font-light">Načítání profilu...</p>
            </div>
        );
    }

    const handleLogout = () => {
        localStorage.clear(); // Vymaže vše najednou (token i cache)
        navigate('/login');
    };

    return (
        <div className="px-6 pb-24 pt-8 bg-white overflow-y-auto">
            {/* Profile Header */}
            <div className="py-8 text-center border-b border-gray-100">
                <div className="size-20 bg-black rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-light shadow-lg">
                    {user?.username?.charAt(0).toUpperCase() || "?"}
                </div>
                <h1 className="text-xl font-normal mb-1">{user?.username}</h1>
            </div>

            {/* Stats - teď berou data buď z cache nebo z nového fetche */}
            <div className="grid grid-cols-3 gap-4 py-8 text-center border-b border-gray-100">
                <div className="flex flex-col">
                    <span className="text-2xl font-light mb-1">{stats?.overview?.total_trainings ?? 0}</span>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400">Tréninků</span>
                </div>
                <div className="flex flex-col border-x border-gray-50">
                    <span className="text-2xl font-light mb-1">{stats?.overview?.rank ?? "-"}</span>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400">Pořadí</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-2xl font-light mb-1">{stats?.overview?.total_putts ?? 0}</span>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400">Puttů</span>
                </div>
            </div>

            {/* Achievements */}
            <div className="py-6 border-b border-gray-100">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Úspěchy</h2>
                <div className="flex gap-3">
                    <div className={`flex-1 border rounded-xl p-4 text-center transition-all bg-white shadow-sm ${(stats?.overview?.total_trainings >= 50) ? 'border-green-100' : 'border-gray-100 opacity-50'}`}>
                        <Target className="size-6 mx-auto mb-2 text-gray-800" strokeWidth={1.5}/>
                        <p className="text-[10px] font-medium text-gray-600">50 TRÉNINKŮ</p>
                    </div>
                    <div className={`flex-1 border rounded-xl p-4 text-center transition-all bg-white shadow-sm ${(stats?.overview?.total_putts >= 1000) ? 'border-green-100' : 'border-gray-100 opacity-50'}`}>
                        <TrendingUp className="size-6 mx-auto mb-2 text-gray-800" strokeWidth={1.5}/>
                        <p className="text-[10px] font-medium text-gray-600">1000 PUTTŮ</p>
                    </div>
                    <div className={`flex-1 border rounded-xl p-4 text-center transition-all bg-white shadow-sm ${(stats?.overview?.rank <= 3 && stats?.overview?.rank !== "-") ? 'border-green-100' : 'border-gray-100 opacity-50'}`}>
                        <Award className="size-6 mx-auto mb-2 text-gray-800" strokeWidth={1.5}/>
                        <p className="text-[10px] font-medium text-gray-600">TOP 3</p>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <div className="py-2">
                {[
                    {label: 'Upravit profil', path: '/editprofile'},
                    {label: 'Moje statistiky', path: '/statistics'},
                    {label: 'Historie tréninků', path: '/history'},
                    {label: 'Nastavení', path: '/settings'},
                ].map((item, index) => (
                    <button
                        key={index}
                        onClick={() => navigate(item.path)}
                        className="w-full flex items-center justify-between py-4 border-b border-gray-50 active:bg-gray-50 transition-colors"
                    >
                        <span className="font-normal">{item.label}</span>
                        <ChevronRight className="size-4 text-gray-300"/>
                    </button>
                ))}
            </div>

            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-6 mt-4 text-red-400 font-normal active:opacity-50 transition-opacity"
            >
                <LogOut className="size-4"/>
                Odhlásit se
            </button>
        </div>
    );
}