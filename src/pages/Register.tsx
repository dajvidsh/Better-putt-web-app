import {useState} from 'react';
import {useNavigate} from 'react-router';
import {ArrowLeft, ArrowRight, Target} from 'lucide-react';
import * as React from "react";

export default function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // const response = await fetch("https://better-putt-web-app-server.onrender.com/api/join", {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/join`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({email, password, username}),
                })

            if (response.ok) {
                // TADY: Ujisti se, že naviguješ na pevnou adresu jako řetězec
                navigate('/login');
            } else {
                const data = await response.json();
                // Pokud detail není text, převedeme ho na text (prevence pádu)
                setError(typeof data.detail === 'string' ? data.detail : "Chyba registrace");
            }
        } catch (err) {
            setError("Nelze se spojit se serverem (CORS nebo vypnutý backend)");
        }
    };

    return (
        <div className="size-full bg-white flex flex-col pb-10">
            {/* Hlavička */}
            <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
                <div className="flex items-center gap-4 px-6 py-4">
                    <button onClick={() => navigate('/')} className="p-2 -ml-2 active:opacity-50 transition-opacity">
                        <ArrowLeft className="size-5"/>
                    </button>
                    <h1 className="text-sm font-normal tracking-wide">ZPĚT</h1>
                </div>
            </div>
            <div className="flex-1 flex flex-col justify-center px-8 pt-10">
                <div className="mb-12 text-center">
                    <div
                        className="inline-flex items-center justify-center size-16 border-2 border-black rounded-full mb-6">
                        <Target className="size-8"/>
                    </div>
                    <h1 className="text-3xl font-light mb-2">Better Putt</h1>
                    <p className="text-gray-500">Registrace</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm text-gray-600 mb-2">
                            Jméno a Příjmení
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:border-black outline-none transition-colors bg-transparent"
                            placeholder="Paul McBeth"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm text-gray-600 mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:border-black outline-none transition-colors bg-transparent"
                            placeholder="vas@email.cz"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm text-gray-600 mb-2">
                            Heslo
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:border-black outline-none transition-colors bg-transparent"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/* Zobrazení chybové hlášky */}
                    {error && (
                        <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-4 mt-8 flex items-center justify-center gap-2 active:opacity-70 transition-opacity"
                    >
                        Registrovat se
                        <ArrowRight className="size-4"/>
                    </button>
                </form>

                <button className="mt-6 text-sm text-gray-500 text-center w-full">
                    Zapomenuté heslo?
                </button>
            </div>

            <div className="px-8 pb-8 text-center">
                <p className="text-sm text-gray-400">
                    Už máte účet?{' '}
                    <button onClick={() => navigate('/login')} className="text-black underline font-medium">Přihlásit
                    </button>
                </p>
            </div>
        </div>
    );
}