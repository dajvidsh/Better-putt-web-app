import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Target, Settings2, Check } from 'lucide-react';

export default function Drill() {
  const navigate = useNavigate();

  const [phase, setPhase] = useState<'setup' | 'playing' | 'finished'>('setup');

  // NASTAVENÍ TRÉNINKU
  const [distance, setDistance] = useState(7);
  const [discsCount, setDiscsCount] = useState(5);
  const [targetPutts, setTargetPutts] = useState(100);

  // STAV BĚHEM HRY
  const [makes, setMakes] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [history, setHistory] = useState<{ makes: number, attempts: number, distance: number }[]>([]);

  // VÝPOČTY
  const successRate = attempts === 0 ? 0 : Math.round((makes / attempts) * 100);
  const remainingPutts = targetPutts - attempts;
  const isLastRound = remainingPutts <= discsCount;
  const currentThrowCount = isLastRound ? remainingPutts : discsCount;
  const startDrill = () => setPhase('playing');

  const handleSuccess = (madeAmount: number) => {
    const roundAttempts = currentThrowCount;

    const updatedHistory = [...history, { makes: madeAmount, attempts: roundAttempts, distance }];

    setHistory(updatedHistory);
    setMakes(prev => prev + madeAmount);
    setAttempts(prev => prev + roundAttempts);

    if (attempts + roundAttempts >= targetPutts) {
      setTimeout(() => setPhase('finished'), 300);

      const finalScore = makes + madeAmount;
      saveGameToDb(finalScore, updatedHistory);
    }
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const lastRound = history[history.length - 1];

    setMakes(prev => prev - lastRound.makes);
    setAttempts(prev => prev - lastRound.attempts);

    setHistory(prev => prev.slice(0, -1));
  };

  // AKCE: Reset
  const handleReset = () => {
    setMakes(0);
    setAttempts(0);
    setHistory([]);
    setPhase('setup');
  };

  const saveGameToDb = async (finalScore: number, finalHistory: typeof history) => {
    const totalMakes = finalScore;

    const trainingData = {
      game_mode_id: "drill",
      total_score: finalScore,
      total_makes: totalMakes,
      total_attempts: targetPutts,
      rounds: history.map((h, index) => ({
        round_number: index + 1,
        distance: h.distance,
        attempts: h.attempts,
        makes: h.makes,
        score_earned: h.makes
      }))
    };

    try {
      const response = await fetch("http://localhost:8000/api/trainings/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(trainingData)
      });

      if (response.ok) {
        console.log("Paráda! Hra byla uložena do databáze.");
      } else {
        console.error("Něco se pokazilo při ukládání.");
      }
    } catch (error) {
      console.error("Nelze se spojit se serverem:", error);
    }
  }

  return (
    <div className="size-full bg-white overflow-auto flex flex-col pb-20 min-h-screen">
      {/* Hlavička */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-4 px-6 py-4">
          <button
            onClick={() => phase === 'playing' ? handleReset() : navigate(-1)}
            className="p-2 -ml-2 active:opacity-50 transition-opacity"
          >
            <ArrowLeft className="size-5" />
          </button>
          <h1 className="text-sm font-normal tracking-wide uppercase">
            {phase === 'setup' ? 'Nastavení tréninku' : 'Aktivní trénink'}
          </h1>
        </div>
      </div>

      {/* --- FÁZE 1: NASTAVENÍ --- */}
      {phase === 'setup' && (
        <div className="flex-1 flex flex-col px-6 py-8">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-light mb-2">Drill</h2>
          </div>

          <div className="space-y-8 flex-1">
            {/* Vzdálenost */}
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-lg text-center">
              <p className="text-sm text-gray-500 mb-4">Vzdálenost</p>
              <div className="flex items-center justify-center gap-8">
                <button onClick={() => setDistance(d => Math.max(3, d - 1))} className="size-12 rounded-full border border-gray-200 flex items-center justify-center text-2xl active:bg-gray-200 transition-colors">-</button>
                <div className="w-24 text-center">
                  <span className="text-4xl font-light">{distance}</span><span className="text-xl text-gray-400 ml-1">m</span>
                </div>
                <button onClick={() => setDistance(d => d + 1)} className="size-12 rounded-full border border-gray-200 flex items-center justify-center text-2xl active:bg-gray-200 transition-colors">+</button>
              </div>
            </div>

            {/* Počet disků v ruce */}
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-lg text-center">
              <p className="text-sm text-gray-500 mb-4">Počet disků</p>
              <div className="flex items-center justify-center gap-8">
                <button onClick={() => setDiscsCount(c => Math.max(1, c - 1))} className="size-12 rounded-full border border-gray-200 flex items-center justify-center text-2xl active:bg-gray-200 transition-colors">-</button>
                <div className="w-24 text-center">
                  <span className="text-4xl font-light">{discsCount}</span><span className="text-xl text-gray-400 ml-1">ks</span>
                </div>
                <button onClick={() => setDiscsCount(c => Math.min(30, c + 1))} className="size-12 rounded-full border border-gray-200 flex items-center justify-center text-2xl active:bg-gray-200 transition-colors">+</button>
              </div>
            </div>

            {/* Cílový počet hodů */}
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-lg text-center">
              <p className="text-sm text-gray-500 mb-4">Počet puttů</p>
              <div className="flex items-center justify-center gap-8">
                <button onClick={() => setTargetPutts(t => Math.max(10, t - 10))} className="size-12 rounded-full border border-gray-200 flex items-center justify-center text-2xl active:bg-gray-200 transition-colors">-</button>
                <div className="w-24 text-center">
                  <span className="text-4xl font-light">{targetPutts}</span>
                </div>
                <button onClick={() => setTargetPutts(t => t + 10)} className="size-12 rounded-full border border-gray-200 flex items-center justify-center text-2xl active:bg-gray-200 transition-colors">+</button>
              </div>
            </div>
          </div>

          <button
            onClick={startDrill}
            className="flex justify-center gap-2 w-full bg-black text-white py-4 mt-8 active:opacity-70 transition-opacity"
          >
            <Target className="size-5" />
            Začít Drill
          </button>
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
              <div className="text-3xl font-light text-black">{attempts} <span className="text-lg text-gray-400">/ {targetPutts}</span></div>
            </div>
          </div>

          {/* Úspěšnost Dashboard */}
          <div className="flex-1 flex flex-col items-center justify-center py-8 w-full">
            <div className="flex gap-4 w-full mb-12">
              <div className="flex-1 border border-gray-200 bg-gray-50 rounded-lg py-6 text-center flex flex-col items-center justify-center">
                <div className="flex items-baseline justify-center mb-1">
                  <span className="text-6xl font-light text-black">{makes}</span>
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Trefeno</p>
              </div>

              <div className="flex-1 border border-gray-200 bg-gray-50 rounded-lg py-6 text-center flex flex-col items-center justify-center relative overflow-hidden">
                <div className="flex items-baseline justify-center mb-1 z-10">
                  <span className="text-6xl font-light text-black">{successRate}</span>
                  <span className="text-xl font-light text-gray-400 ml-1">%</span>
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1 z-10">Úspěšnost</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-xs mt-auto">
              {/*<div className="flex justify-between text-xs text-gray-400 mb-2">*/}
              {/*  <span>{Math.round((attempts / targetPutts) * 100)}%</span>*/}
              {/*</div>*/}
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-300"
                  style={{ width: `${(attempts / targetPutts) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Tlačítka pro zadání skóre */}
          <div className="pb-8 space-y-3">

            {/* Vygenerování tlačítek dynamicky podle toho, kolik disků hráč zrovna hází */}
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: currentThrowCount + 1 }).map((_, num) => (
                <button
                  key={num}
                  onClick={() => handleSuccess(num)}
                  className="text-2xl py-5 border text-gray-400 border-gray-500 bg-gray-50/30 active:bg-gray-50"
                >
                  {num}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleBack}
                disabled={history.length === 0}
                className={`w-full py-4 border border-gray-400 flex items-center justify-center gap-2 transition-colors ${
                  history.length === 0 ? 'opacity-40 cursor-not-allowed bg-white' : 'active:bg-gray-50 bg-gray-50'
                }`}
              >
                Zpět
              </button>

              <button
                onClick={handleReset}
                // className="w-16 py-4 text-gray-400 flex items-center justify-center border border-gray-100 rounded-lg active:bg-gray-50 transition-colors"
                className={`w-16 py-4 border border-gray-400 flex items-center justify-center gap-2 transition-colors`}
              >
                <Settings2 className="size-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- FÁZE 3: HOTOVO --- */}
      {phase === 'finished' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="size-15 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6">
            <Check className="size-10" />
          </div>
          <h2 className="text-3xl font-light mb-2">Drill Dokončen</h2>
          <p className="text-gray-500 mb-12">Odházeno {targetPutts} puttů ze {distance}m.</p>

          <div className="border border-gray-200 bg-gray-50 rounded-lg py-8 px-12 text-center w-full max-w-sm mb-12">
            <p className="text-5xl font-light mb-2">{successRate}<span className="text-3xl text-gray-400">%</span></p>
            <p className="text-sm text-gray-400 uppercase tracking-widest">Konečná úspěšnost</p>
          </div>

          <button
            onClick={() => navigate('/training')}
            className="flex justify-center gap-2 mt-8 w-full bg-black text-white py-4 mt-8 active:opacity-70 transition-opacity"
          >
            Zpět na tréninky
          </button>
        </div>
      )}
    </div>
  );
}