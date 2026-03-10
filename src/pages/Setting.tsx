import {useState} from "react";
import {useNavigate} from "react-router";
import {ArrowLeft, ChevronRight, ExternalLink, Moon, Ruler, Shield, Trash2} from "lucide-react";

export default function Settings() {
    const navigate = useNavigate();

    const [unit, setUnit] = useState<"Metry" | "Stopy">("Metry");
    const [theme, setTheme] = useState<"Světlý" | "Tmavý">("Světlý");

    const toggleUnit = () => setUnit(prev => prev === "Metry" ? "Stopy" : "Metry");
    const toggleTheme = () => setTheme(prev => prev === "Světlý" ? "Tmavý" : "Světlý");

    const handleDeleteAccount = () => {
        const confirmed = window.confirm("Opravdu chcete smazat svůj účet? Tato akce je nevratná a smaže všechny vaše tréninky.");
        if (confirmed) {
            console.log("Mažu účet...");
            // Logika pro smazání
        }
        navigate('/register')
    };

    return (
        <div className="size-full bg-white overflow-auto pb-20">
            <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
                <div className="flex items-center gap-4 px-6 py-4">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 active:opacity-50 transition-opacity">
                        <ArrowLeft className="size-5"/>
                    </button>
                    <h1 className="text-sm font-normal tracking-wide">NASTAVENÍ</h1>
                </div>
            </div>

            {/* Předvolby aplikace */}
            <div className="px-6 pb-10 pt-5">
                <h2 className="text-sm text-gray-400 mb-2">Obecné</h2>

                <button
                    onClick={toggleUnit}
                    className="w-full flex items-center justify-between py-4 active:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <Ruler className="size-5 text-gray-600" strokeWidth={1.5}/>
                        <span>Jednotky vzdálenosti</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">{unit}</span>
                        <ChevronRight className="size-5 text-gray-300"/>
                    </div>
                </button>

                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between py-4 active:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <Moon className="size-5 text-gray-600" strokeWidth={1.5}/>
                        <span>Vzhled aplikace</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">{theme}</span>
                        <ChevronRight className="size-5 text-gray-300"/>
                    </div>
                </button>
            </div>

            {/* Právní informace */}
            <div className="px-6 pb-10">
                <h2 className="text-sm text-gray-400 mb-2">O aplikaci</h2>

                <button
                    onClick={() => navigate('/privacy')}
                    className="w-full flex items-center justify-between py-4 active:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <Shield className="size-5 text-gray-600" strokeWidth={1.5}/>
                        <span>Ochrana osobních údajů</span>
                    </div>
                    <ChevronRight className="size-5 text-gray-300"/>
                </button>

                <a
                    href="https://pdga.com/rules"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between py-4 active:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <ExternalLink className="size-5 text-gray-600" strokeWidth={1.5}/>
                        <span>Pravidla discgolfu (PDGA)</span>
                    </div>
                    <ChevronRight className="size-5 text-gray-300"/>
                </a>
            </div>

            {/* Správa účtu (Nebezpečná zóna) */}
            <div className="px-6">
                <h2 className="text-sm text-gray-400 mb-2">Správa účtu</h2>

                <button
                    onClick={handleDeleteAccount}
                    className="w-full flex items-center justify-center gap-2 py-4 mt-8 text-red-500 active:opacity-50 transition-opacity"
                >
                    <Trash2 className="size-5" strokeWidth={1.5}/>
                    <span>Smazat účet</span>
                </button>
            </div>

            {/* Verze aplikace */}
            <div className="mt-8 text-center">
                <p className="text-xs text-gray-300 font-light tracking-widest uppercase">
                    Better Putt v1.0.0
                </p>
            </div>
        </div>
    );
}