import {Award} from 'lucide-react';
import { Link } from 'react-router-dom';
import {useState} from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/*<button onClick={() => setIsOpen(!isOpen)} className="p-2 -ml-2 active:opacity-50 transition-opacity">*/}
        {/*  <Menu className="size-5" />*/}
        {/*</button>*/}

        <h1 className="text-sm font-normal tracking-wide">
          <Link to={'/'} className="text-slate-900">BETTER PUTT</Link>
        </h1>

        <button className="p-2 -mr-2 active:opacity-50 transition-opacity">
          <Award className="size-5" />
        </button>
      </div>

      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className={"overflow-hidden"}>

          <div className="md:hidden bg-white border-t border-slate-50 p-6 space-y-4 shadow-inner">
            <Link to={'/'} className="block text-lg font-bold text-slate-900" onClick={() => setIsOpen(!isOpen)}>Neco</Link>
            <Link to={'/'} className="block text-lg font-bold text-slate-900" onClick={() => setIsOpen(!isOpen)}>Neco</Link>
            <Link to={'/'} className="block text-lg font-bold text-slate-900" onClick={() => setIsOpen(!isOpen)}>Neco</Link>
            <Link to={'/'} className="block text-lg font-bold text-slate-900" onClick={() => setIsOpen(!isOpen)}>Neco</Link>
          </div>
        </div>
      </div>

    </header>
  );
}