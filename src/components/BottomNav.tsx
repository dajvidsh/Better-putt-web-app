import {Home, Target, Trophy, User} from "lucide-react";
import {Link, useLocation} from "react-router-dom";

export default function BottomNav() {
    const location = useLocation();

    // Funkce pro určení, jestli je link aktivní
    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0,05)] z-50">
            <div className="flex items-center justify-around px-2">
                <Link to={'/'} className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors ${isActive('/') ? 'text-black' : 'text-gray-400'}`}>
                    <Home className={`size-5 ${isActive('/') ? 'fill-black/5' : ''}`} strokeWidth={isActive('/') ? 1.5 : 1.5}/>
                    <span className="text-[10px] font-medium">Domů</span>
                </Link>
                <Link to={'/training'} className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors ${isActive('/training') ? 'text-black' : 'text-gray-400'}`}>
                    <Target className={`size-5 ${isActive('/training') ? 'fill-black/5' : ''}`} strokeWidth={isActive('/training') ? 1.5 : 1.5}/>
                    <span className="text-xs">Trénink</span>
                </Link>
                <Link to={'/leaderboard'} className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors ${isActive('/leaderboard') ? 'text-black' : 'text-gray-400'}`}>
                    <Trophy className={`size-5 ${isActive('/leaderboard') ? 'fill-black/5' : ''}`} strokeWidth={isActive('/leaderboard') ? 1.5 : 1.5}/>
                    <span className="text-xs">Žebříček</span>
                </Link>
                <Link to={'/profile'} className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors ${isActive('/profile') ? 'text-black' : 'text-gray-400'}`}>
                    <User className={`size-5 ${isActive('/profile') ? 'fill-black/5' : ''}`} strokeWidth={isActive('/profile') ? 1.5 : 1.5}/>
                    <span className="text-xs">Profil</span>
                </Link>
            </div>
        </nav>
    )
}