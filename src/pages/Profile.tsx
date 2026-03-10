import {Award, ChevronRight, LogOut, Target, TrendingUp} from "lucide-react";
import {useNavigate} from "react-router";
import {useEffect, useState} from "react";

export default function Profile() {

    const navigate = useNavigate();

    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // fetch("https://better-putt-web-app-server.onrender.com/api/games")
        fetch("/api/me", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.status === 401) throw new Error("Unauthorized");
                return res.json();
            })
            .then(data => {
                setUser(data);
                setLoading(false);
            })
            .catch(() => {
                localStorage.removeItem('token');
                navigate('/login');
            });

        fetch("/api/statistics", {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setStats(data));
    }, [navigate]);

    if (loading) return <div className="p-6 text-center">Načítání profilu...</div>;

    // const stats = [{
    //     id: 1, rank: 12, points: 250, trainings: 15, idUser: 1
    // }];

    const menuItems = [
        {label: 'Upravit profil', value: '', path: '/editprofile'},
        {label: 'Moje statistiky', value: '', path: '/statistics'},
        {label: 'Historie tréninků', value: '', path: '/history'},
        {label: 'Nastavení', value: '', path: '/settings'},
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="px-6 pb-25">
            {/* Profile Header */}
            <div className="py-8 text-center border-b border-gray-100">
                <div
                    className="size-20 bg-black rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-light">
                    {user?.username.charAt(0).toUpperCase()}
                </div>
                <h1 className="text-xl font-normal mb-1">{user?.username}</h1>
                {/*<p className="text-gray-500 text-sm mb-4">Členem od {user[0].memberSince}</p>*/}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 py-8 text-center border-b border-gray-100">
                <div>
                    <p className="text-2xl font-light mb-1">{stats?.overview?.total_trainings || 0}</p>
                    <p className="text-xs text-gray-400">Tréninků</p>
                </div>
                <div>
                    <p className="text-2xl font-light mb-1">{stats?.overview?.rank}.</p>
                    <p className="text-xs text-gray-400">Umístění</p>
                </div>
                <div>
                    <p className="text-2xl font-light mb-1">{stats?.overview?.total_putts || 0}</p>
                    <p className="text-xs text-gray-400">Bodů(puttu)</p>
                </div>
            </div>

            {/* Achievements */}
            <div className="py-6 border-b border-gray-100">
                <h2 className="text-sm text-gray-400 mb-4">Úspěchy</h2>
                <div className="flex gap-3">
                    <div className="flex-1 border border-gray-200 rounded-lg p-4 text-center active:bg-gray-50 bg-white transition-colors shadow-sm">
                        <Target className="size-6 mx-auto mb-2" strokeWidth={1.5}/>
                        <p className="text-xs text-gray-600">50 tréninků</p>
                    </div>
                    <div className="flex-1 border border-gray-200 rounded-lg p-4 text-center active:bg-gray-50 bg-white transition-colors shadow-sm">
                        <TrendingUp className="size-6 mx-auto mb-2" strokeWidth={1.5}/>
                        <p className="text-xs text-gray-600">1000 puttů</p>
                    </div>
                    <div className="flex-1 border border-gray-200 rounded-lg p-4 text-center active:bg-gray-50 bg-white transition-colors shadow-sm">
                        <Award className="size-6 mx-auto mb-2" strokeWidth={1.5}/>
                        <p className="text-xs text-gray-600">Top 3</p>
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
                        <ChevronRight className="size-5 text-gray-400"/>
                    </button>
                ))}
            </div>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-4 mt-8 text-red-500 active:opacity-50 transition-opacity"
            >
                <LogOut className="size-5"/>
                Odhlásit se
            </button>
        </div>
    )
}