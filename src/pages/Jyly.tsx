import {useNavigate} from 'react-router';
import {Check, RotateCcw} from 'lucide-react';
import {useState} from 'react';

export default function Jyly() {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [phase, setPhase] = useState(false);
    const [pace, setPace] = useState(0);

    const [distance, setDistance] = useState(10);
    const [round, setRound] = useState(1);
    const maxRounds = 20;
    const [history, setHistory] = useState<{ score: number, distance: number, pace: number, makes: number }[]>([]);

    function handleSuccess(amountOfPutts: number) {
        const pointsGained = distance * amountOfPutts;
        const newScore = score + pointsGained;
        const updatedHistory = [...history, {score, distance, pace, makes: amountOfPutts}];

        setHistory(updatedHistory);
        setScore(newScore);
        setDistance(5 + amountOfPutts);

        const currentPace = Math.round((newScore / round) * maxRounds);
        setPace(currentPace);

        if (round < maxRounds) {
            setRound(round + 1);
        } else {
            handleFinish(newScore, updatedHistory);
        }
    }

    const handleBack = () => {
        if (history.length === 0) return;
        const previousState = history[history.length - 1];

        setScore(previousState.score);
        setDistance(previousState.distance);
        setRound(prev => prev - 1)
        setPace(previousState.pace)

        setHistory(prev => prev.slice(0, -1));
    };

    const saveGameToDb = async (finalScore: number, finalHistory: typeof history) => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error("Uživatel není přihlášen, hru nelze uložit.");
            return;
        }

        const totalMakes = finalHistory.reduce((sum, round) => sum + round.makes, 0);

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
            const response = await fetch("/api/trainings/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(trainingData)
            });

            if (response.ok) {
                console.log("Paráda! Hra byla uložena do databáze.");
            } else {
                const errorData = await response.json();
                console.error("Chyba při ukládání:", errorData.detail);
            }
        } catch (error) {
            console.error("Nelze se spojit se serverem:", error);
        }
    }

    const handleFinish = (finalScore: number, finalHistory: typeof history) => {
        setPhase(true);
        saveGameToDb(finalScore, finalHistory);
    };

    const handleReset = () => {
        setScore(0);
        setDistance(10);
        setRound(1);
        setPace(0);
        setHistory([]);
    };

    const gameName = 'JYLY';

    return (
        <div className="size-full bg-white overflow-auto flex flex-col pt-10 pb-20">

            {!phase && (

                <div className="flex-1 flex flex-col px-6">
                    {/* Game Info */}
                    <div className="text-center py-4 flex flex-col items-center">
                        <h2 className="text-xl font-light mb-1">{gameName}</h2>
                        <p className="text-gray-500 mb-3">Kolo {round} z {maxRounds}</p>

                        {/* Pace badge */}
                        <div
                            className="inline-flex items-center gap-2 border border-gray-200 bg-gray-50 rounded-lg px-4 py-1.5">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Tempo</span>
                            <span className="text-sm font-medium text-black">{pace}</span>
                        </div>
                    </div>

                    {/* Vzdalenost */}
                    <div className="flex-1 flex flex-col items-center justify-center py-0 pb-10">
                        <div className="flex gap-4 w-full mb-8">
                            <div
                                className="flex-1 border border-gray-200 bg-gray-50 rounded-lg py-6 text-center flex flex-col items-center justify-center">
                                <div className="flex items-baseline justify-center mb-1">
                                    <span className="text-5xl font-light text-black">{distance}</span>
                                    <span className="text-xl font-light text-gray-400 ml-1">m</span>
                                </div>
                                <p className="text-xs text-gray-400">Vzdálenost</p>
                            </div>

                            {/* Skóre */}
                            <div
                                className="flex-1 border border-gray-200 bg-gray-50 rounded-lg py-6 text-center flex flex-col items-center justify-center">
                                <p className="text-5xl font-light mb-1">{score}</p>
                                <p className="text-xs text-gray-400">Skóre</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full max-w-xs">
                            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-black transition-all duration-300"
                                    style={{width: `${(round / maxRounds) * 100}%`}}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="pb-8 space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={() => handleSuccess(0)}
                                className="text-2xl py-5 border text-red-500 border-red-500 bg-red-50/30 active:bg-red-50"
                            >
                                0
                            </button>
                            <button
                                onClick={() => handleSuccess(1)}
                                className="text-2xl py-5 border text-orange-400 border-orange-500 bg-orange-50/30 active:bg-orange-50"
                            >
                                1
                            </button>
                            <button
                                onClick={() => handleSuccess(2)}
                                className="text-2xl py-5 border text-orange-400 border-orange-500 bg-orange-50/30 active:bg-orange-50"
                            >
                                2
                            </button>
                            <button
                                onClick={() => handleSuccess(3)}
                                className="text-2xl py-5 border text-lime-500 border-lime-500 bg-lime-50/30 active:bg-lime-50"
                            >
                                3
                            </button>
                            <button
                                onClick={() => handleSuccess(4)}
                                className="text-2xl py-5 border text-lime-500 border-lime-500 bg-lime-50/30 active:bg-lime-50"
                            >
                                4
                            </button>
                            <button
                                onClick={() => handleSuccess(5)}
                                className="text-2xl py-5 border text-emerald-500 border-emerald-500 bg-emerald-50/30 active:bg-emerald-50"
                            >
                                5
                            </button>
                        </div>


                        <button
                            onClick={handleBack}
                            disabled={history.length === 0}
                            className={`w-full py-4 border border-gray-400 flex items-center justify-center gap-2 transition-colors ${
                                history.length === 0
                                    ? 'opacity-40 cursor-not-allowed bg-gray-50'
                                    : 'active:bg-gray-50'
                            }`}
                        >
                            Zpět
                        </button>

                        <button
                            onClick={handleReset}
                            className="w-full py-4 text-gray-500 flex items-center justify-center gap-2 active:opacity-50 transition-opacity"
                        >
                            <RotateCcw className="size-4"/>
                            Reset
                        </button>
                    </div>
                </div>
            )}
            {/* --- HOTOVO --- */}
            {phase && (
                <div className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-10">
                    <div
                        className="size-15 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                        <Check className="size-10"/>
                    </div>
                    <h2 className="text-3xl font-light mb-2">JYLY Dokončeno</h2>
                    <p className="text-gray-500 mb-2">Odházeno 100 puttů.</p>
                    <p className="text-gray-500 mb-12">Úspěšnost {Math.round((score / (100)) * 10)}%.</p>

                    <div
                        className="border border-gray-200 bg-gray-50 rounded-lg py-8 px-12 text-center w-full max-w-sm mb-12">
                        <p className="text-5xl font-light mb-2">{score}</p>
                        <p className="text-sm text-gray-400 uppercase tracking-widest">Konečné skóre</p>
                    </div>

                    <button
                        onClick={() => navigate('/training')}
                        className="flex justify-center gap-2 mt-8 w-full bg-black text-white py-4 active:opacity-70 transition-opacity"
                    >
                        Zpět na tréninky
                    </button>
                </div>
            )}
        </div>
    );
}
