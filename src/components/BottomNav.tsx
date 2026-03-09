import {Home, Target, Trophy, User} from "lucide-react";
import {Link} from "react-router-dom";

export default function BottomNav() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
            <div className="flex items-center justify-around px-2">
                <Link to={'/'} className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors`}>
                    <Home className="size-5" strokeWidth={1.5}/>
                    <span className="text-xs">Domů</span>
                </Link>
                <Link to={'/training'} className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors`}>
                    <Target className="size-5" strokeWidth={1.5}/>
                    <span className="text-xs">Trénink</span>
                </Link>
                <Link to={'/leaderboard'} className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors`}>
                    <Trophy className="size-5" strokeWidth={1.5}/>
                    <span className="text-xs">Žebříček</span>
                </Link>
                <Link to={'/profile'} className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors`}>
                    <User className="size-5" strokeWidth={1.5}/>
                    <span className="text-xs">Profil</span>
                </Link>
            </div>
        </nav>
    )
}