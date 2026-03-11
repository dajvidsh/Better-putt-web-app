import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {Target, Settings2, Check, ArrowLeft} from 'lucide-react';

export default function Drill() {
    const navigate = useNavigate();

    // 1. Inicializace stavu z cache nebo výchozích hodnot
    const [gameState, setGameState] = useState(() => {
        const saved = localStorage.getItem('active_drill_game');
        if (saved) return JSON.parse(saved);
        return {
            phase: 'setup', // 'setup' | 'playing' | 'finished'
            distance: 7,
            discsCount: 5,
            targetPutts: 100,
            makes: 0,
            attempts: 0,
            history: []
        };
    });

    const { phase, distance, discsCount, targetPutts, makes, attempts, history } = gameState;

    // 2. Automatické ukládání při každé změně
    useEffect(() => {
        localStorage.setItem('active_drill_game', JSON.stringify(gameState));
    }, [gameState]);

    // Pomocná funkce pro aktualizaci stavu
    const updateGame = (updates: Partial<typeof gameState>) => {
        setGameState((prev: any) => ({ ...prev, ...updates }));
    };

    // Výpočty pro UI
    const successRate = attempts === 0 ? 0 : Math.round((makes / attempts) * 100);
    const remainingPutts = targetPutts - attempts;
    const isLastRound = remainingPutts <= discsCount;
    const currentThrowCount = isLastRound ? remainingPutts : discsCount;

    const startDrill = () => updateGame({ phase: 'playing' });

    const handleSuccess = (madeAmount: number) => {
        const roundAttempts = currentThrowCount;
        const newMakes = makes + madeAmount;
        const newAttempts = attempts + roundAttempts;
        const updatedHistory = [...history, { makes: madeAmount, attempts: roundAttempts, distance }];

        if (newAttempts >= targetPutts) {
            handleFinish(newMakes, updatedHistory);
        } else {
            updateGame({
                makes: newMakes,
                attempts: newAttempts,
                history: updatedHistory
            });
        }
    };

    const handleBack = () => {
        if (history.length === 0) return;
        const lastRound = history[history.length - 1];

        updateGame({
            makes: makes - lastRound.makes,
            attempts: attempts - lastRound.attempts,
            history: history.slice(0, -1)
        });
    };

    const handleReset = () => {
        if (phase === 'playing' && !confirm("Opravdu chceš ukončit probíhající Drill?")) return;

        localStorage.removeItem('active_drill_game');
        setGameState({
            phase: 'setup',
            distance: 7,
            discsCount: 5,
            targetPutts: 100,
            makes: 0,
            attempts: 0,
            history: []
        });
    };

    const handleFinish = (finalMakes: number, finalHistory: any[]) => {
        updateGame({ phase: 'finished', makes: finalMakes, history: finalHistory, attempts: targetPutts });
        saveGameToDb(finalMakes, finalHistory);
    };

    const saveGameToDb = async (finalScore: number, finalHistory: any[]) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const trainingData = {
            game_mode_id: "drill",
            total_score: finalScore,
            total_makes: finalScore,
            total_attempts: targetPutts,
            rounds: finalHistory.map((h, index) => ({
                round_number: index + 1,
                distance: h.distance,
                attempts: h.attempts,
                makes: h.makes,
                score_earned: h.makes
            }))
        };

        try {
            const response = await fetch("https://better-putt-web-app-server.onrender.com/api/trainings/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(trainingData)
            });

            if (response.ok) {
                localStorage.removeItem('active_drill_game');
                localStorage.removeItem('cache_stats');
                localStorage.removeItem('cache_games');
                navigate('/');
            }
        } catch (error) {
            console.error("Chyba při ukládání:", error);
        }
    };

    return (
        <div className="size-full bg-white overflow-auto flex flex-col pb-20 min-h-screen">
            <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
                <div className="flex items-center gap-4 px-6 py-4">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 active:opacity-50 transition-opacity">
                        <ArrowLeft className="size-5"/>
                    </button>
                    <h1 className="text-sm font-normal tracking-wide">DETAIL HRY</h1>
                </div>
            </div>
            {/* --- FÁZE 1: NASTAVENÍ --- */}
            {phase === 'setup' && (
                <div className="flex-1 flex flex-col px-6 py-8">
                    <div className="text-center mb-4"><h2 className="text-3xl font-light mb-2">Drill</h2></div>
                    <div className="space-y-8 flex-1">
                        {/* Vzdálenost */}
                        <div className="bg-gray-50 border border-gray-100 p-6 rounded-lg text-center">
                            <p className="text-sm text-gray-500 mb-4">Vzdálenost</p>
                            <div className="flex items-center justify-center gap-8">
                                <button onClick={() => updateGame({ distance: Math.max(3, distance - 1) })} className="size-12 rounded-full border border-gray-200 flex items-center justify-center text-2xl active:bg-gray-200">-</button>
                                <div className="w-24 text-center"><span className="text-4xl font-light">{distance}</span><span className="text-xl text-gray-400 ml-1">m</span></div>
                                <button onClick={() => updateGame({ distance: distance + 1 })} className="size-12 rounded-full border border-gray-200 flex items-center justify-center text-2xl active:bg-gray-200">+</button>
                            </div>
                        </div>
                        {/* Disky */}
                        <div className="bg-gray-50 border border-gray-100 p-6 rounded-lg text-center">
                            <p className="text-sm text-gray-500 mb-4">Počet disků</p>
                            <div className="flex items-center justify-center gap-8">
                                <button onClick={() => updateGame({ discsCount: Math.max(1, discsCount - 1) })} className="size-12 rounded-full border border-gray-200 flex items-center justify-center text-2xl active:bg-gray-200">-</button>
                                <div className="w-24 text-center"><span className="text-4xl font-light">{discsCount}</span><span className="text-xl text-gray-400 ml-1">ks</span></div>
                                <button onClick={() => updateGame({ discsCount: Math.min(30, discsCount + 1) })} className="size-12 rounded-full border border-gray-200 flex items-center justify-center text-2xl active:bg-gray-200">+</button>
                            </div>
                        </div>
                        {/* Cíl */}
                        <div className="bg-gray-50 border border-gray-100 p-6 rounded-lg text-center">
                            <p className="text-sm text-gray-500 mb-4">Počet puttů</p>
                            <div className="flex items-center justify-center gap-8">
                                <button onClick={() => updateGame({ targetPutts: Math.max(10, targetPutts - 10) })} className="size-12 rounded-full border border-gray-200 flex items-center justify-center text-2xl active:bg-gray-200">-</button>
                                <div className="w-24 text-center"><span className="text-4xl font-light">{targetPutts}</span></div>
                                <button onClick={() => updateGame({ targetPutts: targetPutts + 10 })} className="size-12 rounded-full border border-gray-200 flex items-center justify-center text-2xl active:bg-gray-200">+</button>
                            </div>
                        </div>
                    </div>
                    <button onClick={startDrill} className="flex justify-center gap-2 w-full bg-black text-white py-4 mt-8 active:opacity-70"><Target className="size-5"/> Začít Drill</button>
                </div>
            )}

            {/* --- FÁZE 2: HRA --- */}
            {phase === 'playing' && (
                <div className="flex-1 flex flex-col px-6">
                    <div className="text-center py-6 border-b border-gray-100 flex justify-between items-center">
                        <div className="text-left">
                            <h2 className="text-xl font-light">Drill: {distance}m</h2>
                            <p className="text-gray-400 text-sm">Cíl: {targetPutts} puttů</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-light">{attempts} <span className="text-lg text-gray-400">/ {targetPutts}</span></div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center py-8">
                        <div className="flex gap-4 w-full mb-12">
                            <div className="flex-1 border border-gray-200 bg-gray-50 rounded-lg py-6 text-center">
                                <p className="text-6xl font-light">{makes}</p>
                                <p className="text-xs text-gray-400 uppercase mt-1">Trefeno</p>
                            </div>
                            <div className="flex-1 border border-gray-200 bg-gray-50 rounded-lg py-6 text-center">
                                <p className="text-6xl font-light">{successRate}<span className="text-2xl text-gray-400">%</span></p>
                                <p className="text-xs text-gray-400 uppercase mt-1">Úspěšnost</p>
                            </div>
                        </div>
                        <div className="w-full max-w-xs h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-black transition-all" style={{ width: `${(attempts / targetPutts) * 100}%` }} />
                        </div>
                    </div>

                    <div className="pb-8 space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                            {Array.from({ length: currentThrowCount + 1 }).map((_, num) => (
                                <button key={num} onClick={() => handleSuccess(num)} className="text-2xl py-5 border text-gray-400 border-gray-500 active:bg-gray-50">{num}</button>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <button onClick={handleBack} disabled={history.length === 0} className="w-full py-4 border border-gray-400 disabled:opacity-30">Zpět</button>
                            <button onClick={handleReset} className="w-16 py-4 border border-gray-400 flex justify-center"><Settings2 className="size-5"/></button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- FÁZE 3: HOTOVO --- */}
            {phase === 'finished' && (
                <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                    <div className="size-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6"><Check className="size-10"/></div>
                    <h2 className="text-3xl font-light mb-2">Drill Dokončen</h2>
                    <div className="border border-gray-200 bg-gray-50 rounded-lg py-8 px-12 text-center w-full max-w-sm mb-12">
                        <p className="text-5xl font-light">{successRate}<span className="text-3xl text-gray-400">%</span></p>
                        <p className="text-sm text-gray-400 uppercase tracking-widest">Úspěšnost</p>
                    </div>
                    <button onClick={() => { localStorage.removeItem('active_drill_game'); navigate('/training'); }} className="w-full bg-black text-white py-4">Zpět na tréninky</button>
                </div>
            )}
        </div>
    );
}