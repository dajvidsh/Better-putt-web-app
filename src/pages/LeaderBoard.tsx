import {Award, Medal, Trophy} from "lucide-react";

export default function LeaderBoard() {

    const globalLeaders = [
        { rank: 1, name: 'Martin Kovář', score: 2450, trend: '+50' },
        { rank: 2, name: 'Petr Novotný', score: 2380, trend: '+30' },
        { rank: 3, name: 'Jan Svoboda', score: 2310, trend: '+20' },
        { rank: 4, name: 'Tomáš Černý', score: 2250, trend: '+15' },
        { rank: 5, name: 'David Procházka', score: 2180, trend: '+10' },
        { rank: 6, name: 'Lukáš Dvořák', score: 2120, trend: '+5' },
        { rank: 7, name: 'Jakub Král', score: 2080, trend: '-5' },
        { rank: 8, name: 'Michal Veselý', score: 2020, trend: '-10' },
    ];

    return (
        <div className="px-6">
            <div className="py-8">
                <h1 className="text-2xl font-light mb-2">Žebříček</h1>
                <p className="text-gray-500">Nejlepší hráči tento měsíc</p>
            </div>

            <div className="flex items-end justify-center gap-4 mb-8 py-6">
            {/* 2nd place */}
              <div className="flex flex-col items-center flex-1">
                <div className="size-12 bg-gray-200 rounded-full mb-2" />
                <Medal className="size-5 text-gray-400 mb-1" />
                <p className="text-xs font-normal mb-1">{globalLeaders[1].name.split(' ')[0]}</p>
                <p className="text-sm text-gray-500">{globalLeaders[1].score}</p>
              </div>

              {/* 1st place */}
              <div className="flex flex-col items-center flex-1">
                <div className="size-16 bg-amber-100 rounded-full mb-2" />
                <Trophy className="size-6 text-amber-500 mb-1" />
                <p className="text-sm font-normal mb-1">{globalLeaders[0].name.split(' ')[0]}</p>
                <p className="text-gray-900">{globalLeaders[0].score}</p>
              </div>

              {/* 3rd place */}
              <div className="flex flex-col items-center flex-1">
                <div className="size-10 bg-amber-50 rounded-full mb-2" />
                <Award className="size-5 text-amber-700 mb-1" />
                <p className="text-xs font-normal mb-1">{globalLeaders[2].name.split(' ')[0]}</p>
                <p className="text-sm text-gray-500">{globalLeaders[2].score}</p>
              </div>
            </div>

            <div className="space-y-1 pb-6 pb-20">
            {globalLeaders.map((leader) => (
              <div
                key={leader.rank}
                className={`flex items-center gap-4 py-4 border-b border-gray-100 ${
                  leader.name === 'Vy' ? 'bg-gray-50 -mx-6 px-6' : ''
                }`}
              >
                <div className="w-8 flex justify-center">
                  {String(leader.rank)}
                </div>

                <div className="flex-1">
                  <p className={leader.name === 'Vy' ? 'font-medium' : 'font-normal'}>
                    {leader.name}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-normal mb-1">{leader.score}</p>
                  <p className={`text-xs ${leader.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {leader.trend}
                  </p>
                </div>
              </div>
        ))}
      </div>

        </div>
    )
}