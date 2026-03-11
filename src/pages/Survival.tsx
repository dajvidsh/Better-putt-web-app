import {useNavigate} from 'react-router';
import {AlertTriangle, ArrowLeft, Check, RotateCcw, Zap} from 'lucide-react';
import {useState, useEffect} from 'react';

export default function Survival() {
    const navigate = useNavigate();

    // 1. Inicializace stavu - zkusíme načíst z cache, jinak default
    const [gameState, setGameState] = useState(() => {
        const saved = localStorage.getItem('active_survival_game');
        if (saved) return JSON.parse(saved);
        return {
            lives: 1,
            distance: 3,
            round: 1,
            sumOfPutts: 0,
            beenHere: false,
            history: [],
            phase: false
        };
    });

    // Destrukturalizace pro snadnější práci v kódu (při zachování funkčnosti tvé logiky)
    const { lives, distance, round, sumOfPutts, beenHere, history, phase } = gameState;

    // 2. Kdykoliv se gameState změní, uložíme ho do localStorage
    useEffect(() => {
        localStorage.setItem('active_survival_game', JSON.stringify(gameState));
    }, [gameState]);

    // Pomocná funkce pro update stavu (zkracuje zápis)
    const updateGame = (updates: Partial<typeof gameState>) => {
        setGameState((prev: any) => ({ ...prev, ...updates }));
    };

    function handleSuccess(amountOfPutts: number) {
        const updatedHistory = [...history, {lives, distance, beenHere, sumOfPutts, makes: amountOfPutts}];

        let newSum = sumOfPutts + amountOfPutts;
        let newLives = lives;
        let newDistance = distance;
        let newBeenHere = beenHere;
        let isGameOver = false;

        if (amountOfPutts === 0) {
            isGameOver = true;
        } else if (amountOfPutts === 1) {
            newLives -= 1;
            newBeenHere = true;
            if (newLives === 0) isGameOver = true;
        } else if (amountOfPutts === 3) {
            if (!beenHere) newLives += 1;
            newDistance += 1;
            newBeenHere = false;
        } else {
            newBeenHere = true;
        }

        if (isGameOver) {
            handleFinish(updatedHistory, distance, newSum);
        } else {
            updateGame({
                lives: newLives,
                distance: newDistance,
                beenHere: newBeenHere,
                round: round + 1,
                sumOfPutts: newSum,
                history: updatedHistory
            });
        }
    }

    const handleBack = () => {
        if (history.length === 0) return;
        const prev = history[history.length - 1];

        updateGame({
            lives: prev.lives,
            distance: prev.distance,
            round: round - 1,
            beenHere: prev.beenHere,
            sumOfPutts: prev.sumOfPutts,
            history: history.slice(0, -1)
        });
    };

    const handleFinish = (finalHistory: any[], finalDistance: number, finalSum: number) => {
        updateGame({ phase: true, history: finalHistory, distance: finalDistance, sumOfPutts: finalSum });
        saveGameToDb(finalHistory, finalDistance, finalSum);
    };

    const handleReset = () => {
        // if (confirm("Opravdu chceš restartovat hru?")) {
            localStorage.removeItem('active_survival_game');
            setGameState({
                lives: 1,
                distance: 3,
                round: 1,
                sumOfPutts: 0,
                beenHere: false,
                history: [],
                phase: false
            });
        // }
    };

    const saveGameToDb = async (finalHistory: any[], finalDistance: number, finalSum: number) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const totalAttempts = finalHistory.length * 3;
        const trainingData = {
            game_mode_id: "survival",
            total_score: finalDistance,
            total_makes: finalSum,
            total_attempts: totalAttempts,
            rounds: finalHistory.map((h, index) => ({
                round_number: index + 1,
                distance: h.distance,
                attempts: 3,
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
                // Po úspěšném uložení smažeme rozdělanou hru z cache
                localStorage.removeItem('active_survival_game');
                localStorage.removeItem('cache_stats');
                localStorage.removeItem('cache_games');
                navigate('/');
            }
        } catch (error) {
            console.error("Chyba při ukládání:", error);
        }
    };

    const gameName = 'Survival';

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
                    <div className="text-center py-4">
                        <h2 className="text-xl font-light mb-2">{gameName}</h2>
                        <p className="text-gray-500">Kolo {round}</p>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center py-0 pb-10">
                        <div className="flex gap-4 w-full mb-8">
                            <div className="flex-1 border border-gray-200 bg-gray-50 rounded-lg py-6 text-center">
                                <div className="flex items-baseline justify-center mb-1">
                                    <span className="text-5xl font-light">{distance}</span>
                                    <span className="text-xl text-gray-400 ml-1">m</span>
                                </div>
                                <p className="text-xs text-gray-400">Vzdálenost</p>
                            </div>
                            <div className="flex-1 border border-gray-200 bg-gray-50 rounded-lg py-6 text-center">
                                <p className="text-5xl font-light mb-1">{lives}</p>
                                <p className="text-xs text-gray-400">{lives === 1 ? "Život" : "Životy"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pb-8 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            {[0, 1, 2, 3].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => handleSuccess(num)}
                                    className={`text-2xl py-5 border active:opacity-50 transition-all ${
                                        num === 0 ? 'text-red-500 border-red-500 bg-red-50/10' :
                                        num === 1 ? 'text-orange-400 border-orange-500 bg-orange-50/10' :
                                        num === 2 ? 'text-gray-400 border-gray-500' :
                                        'text-lime-500 border-lime-500 bg-lime-50/10'
                                    }`}
                                >
                                    {num === 1 && lives === 1 && round !== 1 ? <AlertTriangle className="size-8 mx-auto"/> :
                                     num === 3 && !beenHere && round !== 1 ? <Zap className="size-8 mx-auto"/> : num}
                                </button>
                            ))}
                        </div>
                        <button onClick={handleBack} disabled={history.length === 0} className="w-full py-4 border border-gray-400 disabled:opacity-30">Zpět</button>
                        <button onClick={handleReset} className="w-full py-4 text-gray-400 flex items-center justify-center gap-2"><RotateCcw className="size-4"/> Reset</button>
                    </div>
                </div>
            )}

            {phase && (
                <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                    <div className="size-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6"><Check className="size-10"/></div>
                    <h2 className="text-3xl font-light mb-2">Dokončeno</h2>
                    <p className="text-gray-500 mb-8">Nejlepší vzdálenost: {distance}m</p>
                    <button onClick={() => { localStorage.removeItem('active_survival_game'); navigate('/training'); }} className="w-full bg-black text-white py-4">Zpět na tréninky</button>
                </div>
            )}
        </div>
    );
}