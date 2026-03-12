import { useNavigate } from 'react-router';
import {ArrowLeft, Check, RotateCcw} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Jyly() {
    const navigate = useNavigate();
    const maxRounds = 20;
    const API_BASE_URL = import.meta.env.VITE_API_URL || '';

    // 1. Inicializace stavu z cache nebo default
    const [gameState, setGameState] = useState(() => {
        const saved = localStorage.getItem('active_jyly_game');
        if (saved) return JSON.parse(saved);
        return {
            score: 0,
            phase: false,
            pace: 0,
            distance: 10,
            round: 1,
            history: []
        };
    });

    const { score, phase, pace, distance, round, history } = gameState;

    // 2. Automatické ukládání při každé změně
    useEffect(() => {
        localStorage.setItem('active_jyly_game', JSON.stringify(gameState));
    }, [gameState]);

    // Pomocná funkce pro aktualizaci stavu
    const updateGame = (updates: Partial<typeof gameState>) => {
        setGameState((prev: any) => ({ ...prev, ...updates }));
    };

    function handleSuccess(amountOfPutts: number) {
        const pointsGained = distance * amountOfPutts;
        const newScore = score + pointsGained;
        const updatedHistory = [...history, { score, distance, pace, makes: amountOfPutts }];
        const currentPace = Math.round((newScore / round) * maxRounds);

        if (round < maxRounds) {
            updateGame({
                score: newScore,
                distance: 5 + amountOfPutts,
                round: round + 1,
                pace: currentPace,
                history: updatedHistory
            });
        } else {
            handleFinish(newScore, updatedHistory);
        }
    }

    const handleBack = () => {
        if (history.length === 0) return;
        const prev = history[history.length - 1];

        updateGame({
            score: prev.score,
            distance: prev.distance,
            round: round - 1,
            pace: prev.pace,
            history: history.slice(0, -1)
        });
    };

    const handleFinish = (finalScore: number, finalHistory: any[]) => {
        updateGame({ phase: true, score: finalScore, history: finalHistory });
        saveGameToDb(finalScore, finalHistory);
    };

    const handleReset = () => {
        if (confirm("Opravdu chceš restartovat hru JYLY?")) {
            localStorage.removeItem('active_jyly_game');
            setGameState({
                score: 0,
                phase: false,
                pace: 0,
                distance: 10,
                round: 1,
                history: []
            });
        }
    };

    const saveGameToDb = async (finalScore: number, finalHistory: any[]) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const totalMakes = finalHistory.reduce((sum, r) => sum + r.makes, 0);
        const trainingData = {
            game_mode_id: "jyly",
            total_score: finalScore,
            total_makes: totalMakes,
            total_attempts: finalHistory.length * 5,
            rounds: finalHistory.map((h, index) => ({
                round_number: index + 1,
                distance: h.distance,
                attempts: 5,
                makes: h.makes,
                score_earned: h.distance * h.makes
            }))
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/trainings/save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(trainingData)
            });

            if (response.ok) {
                localStorage.removeItem('active_jyly_game');
                localStorage.removeItem('cache_stats');
                localStorage.removeItem('cache_games');
                navigate('/');
            }
        } catch (error) {
            console.error("Nelze se spojit se serverem:", error);
        }
    };

    return (
        <div className="size-full bg-white overflow-auto flex flex-col pb-20">
            <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
                <div className="flex items-center gap-4 px-6 py-4">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 active:opacity-50 transition-opacity">
                        <ArrowLeft className="size-5"/>
                    </button>
                    <h1 className="text-sm font-normal tracking-wide">DETAIL HRY</h1>
                </div>
            </div>

            {!phase && (
                <div className="flex-1 flex flex-col px-6">
                    <div className="text-center py-4 flex flex-col items-center">
                        <h2 className="text-xl font-light mb-1">JYLY</h2>
                        <p className="text-gray-500 mb-3">Kolo {round} z {maxRounds}</p>
                        <div className="inline-flex items-center gap-2 border border-gray-200 bg-gray-50 rounded-lg px-4 py-1.5">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Tempo</span>
                            <span className="text-sm font-medium text-black">{pace}</span>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center py-0 pb-10">
                        <div className="flex gap-4 w-full mb-8">
                            <div className="flex-1 border border-gray-200 bg-gray-50 rounded-lg py-6 text-center">
                                <div className="flex items-baseline justify-center mb-1">
                                    <span className="text-5xl font-light text-black">{distance}</span>
                                    <span className="text-xl font-light text-gray-400 ml-1">m</span>
                                </div>
                                <p className="text-xs text-gray-400">Vzdálenost</p>
                            </div>
                            <div className="flex-1 border border-gray-200 bg-gray-50 rounded-lg py-6 text-center">
                                <p className="text-5xl font-light mb-1">{score}</p>
                                <p className="text-xs text-gray-400">Skóre</p>
                            </div>
                        </div>
                        <div className="w-full max-w-xs h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-black transition-all duration-300" style={{ width: `${(round / maxRounds) * 100}%` }} />
                        </div>
                    </div>

                    <div className="pb-8 space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                            {[0, 1, 2, 3, 4, 5].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => handleSuccess(num)}
                                    className={`text-2xl py-5 border active:bg-gray-50 transition-colors ${
                                        num === 0 ? 'text-red-500 border-red-500 bg-red-50/30' :
                                        num < 3 ? 'text-orange-400 border-orange-500 bg-orange-50/30' :
                                        'text-emerald-500 border-emerald-500 bg-emerald-50/30'
                                    }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                        <button onClick={handleBack} disabled={history.length === 0} className="w-full py-4 border border-gray-400 disabled:opacity-30">Zpět</button>
                        <button onClick={handleReset} className="w-full py-4 text-gray-500 flex items-center justify-center gap-2"><RotateCcw className="size-4"/> Reset</button>
                    </div>
                </div>
            )}

            {phase && (
                <div className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-10">
                    <div className="size-15 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6"><Check className="size-10"/></div>
                    <h2 className="text-3xl font-light mb-2">JYLY Dokončeno</h2>
                    <div className="border border-gray-200 bg-gray-50 rounded-lg py-8 px-12 text-center w-full max-w-sm mb-12">
                        <p className="text-5xl font-light mb-2">{score}</p>
                        <p className="text-sm text-gray-400 uppercase tracking-widest">Konečné skóre</p>
                    </div>
                    <button onClick={() => { localStorage.removeItem('active_jyly_game'); navigate('/training'); }} className="w-full bg-black text-white py-4">Zpět na tréninky</button>
                </div>
            )}
        </div>
    );
}