import {Award} from 'lucide-react';
import {Link} from 'react-router-dom';

export default function Header() {
    return (
        <header className="bg-white border-b border-slate-100 top-0 z-50 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">

                <h1 className="text-sm font-normal tracking-wide">
                    <Link to={'/'} className="text-slate-900">BETTER PUTT</Link>
                </h1>

                <button className="p-2 -mr-2 active:opacity-50 transition-opacity">
                    <Award className="size-5"/>
                </button>
            </div>
        </header>
    );
}