import {useState} from 'react';
import {useNavigate} from 'react-router';
import {ArrowLeft, User} from 'lucide-react';
import * as React from "react";

export default function Editprofile() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('Dajvid');
    const [email, setEmail] = useState('dajvid@example.com');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        console.log('Ukládám profil:', {username, email, avatarUrl, newPassword});
        navigate(-1);
    };

    return (
        <div className="size-full bg-white overflow-auto pb-20">
            {/* Hlavička */}
            <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
                <div className="flex items-center gap-4 px-6 py-4">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 active:opacity-50 transition-opacity">
                        <ArrowLeft className="size-5"/>
                    </button>
                    <h1 className="text-sm font-normal tracking-wide">UPRAVIT PROFIL</h1>
                </div>
            </div>

            <div className="flex-1 p-6 flex flex-col">
                {/* Náhled profilové fotky (pokud je zadána URL) */}
                <div className="flex justify-center mb-8">
                    <div
                        className="size-24 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Profilovka" className="size-full object-cover"/>
                        ) : (
                            <User className="size-12 text-slate-400"/>
                        )}
                    </div>
                </div>

                {/* Formulář */}
                <form onSubmit={handleSave} className="flex-1 flex flex-col gap-6">

                    {/* Osobní údaje */}
                    <div className="space-y-6 bg-white rounded-lg p-5 shadow-sm border border-slate-100">
                        <h2 className="font-normal mb-1">Obecné</h2>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-500 mb-3">Jméno</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-slate-50 rounded-lg p-5 border border-slate-200 px-4 py-3 text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                                placeholder="Tvoje přezdívka"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-500 mb-3">E-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-5 px-4 py-3 text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                                placeholder="tvuj@email.cz"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-500 mb-3">Odkaz na profilovou fotku</label>
                            <input
                                type="url"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-5 px-4 py-3 text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {/* Zabezpečení */}
                    <div className="space-y-4 bg-white p-5 rounded-lg p-5 shadow-sm border border-slate-100">
                        <h2 className="font-normal mb-1">Změnit heslo</h2>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-500 mb-3">Nové heslo</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-5 px-4 py-3 text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                                placeholder="Zadej nové heslo"
                            />
                        </div>
                    </div>

                    <div className="flex-1 mt-4"></div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-4 mt-8 active:opacity-70 transition-opacity"
                    >
                        Uložit změny
                    </button>
                </form>
            </div>
        </div>
    );
}