import './App.css'
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import Hero from "./components/Hero.tsx";
import BottomNav from "./components/BottomNav.tsx";
import Training from "./pages/Training.tsx";
import TrainingDetail from "./pages/TrainingDetail.tsx";
import LeaderBoard from "./pages/LeaderBoard.tsx";
import Profile from "./pages/Profile.tsx";
import Statistics from "./pages/Statistics.tsx";
import History from "./pages/History.tsx";
import Editprofile from "./pages/Editprofile.tsx";
import Settings from "./pages/Setting.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Jyly from "./pages/Jyly.tsx";
import Survival from "./pages/Survival.tsx";
import Drill from "./pages/Drill.tsx";
import {useEffect, useRef} from "react";
import GameDetailStats from "./pages/Gamedetail.tsx";

const Home = () => <Hero/>;

const MainLayout = () => {
    const location = useLocation();
    const gamePaths = ['/jyly', '/survival', '/drill'];
    const authPaths = ['/login', '/register'];
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const hideNav = gamePaths.includes(location.pathname) || authPaths.includes(location.pathname);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo(0, 0);
        }
    }, [location.pathname]);

    return (
        <div className="fixed inset-0 h-dvh w-full bg-white flex flex-col overflow-hidden">
            {/*<ScrollUp/>*/}

            {/*{!hideNav && <Header/>}*/}

            <main
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto w-full scroll-smooth"
            >
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/training" element={<Training/>}/>
                    <Route path="/training/:gameId" element={<TrainingDetail/>}/>
                    <Route path="/history/:gameId" element={<GameDetailStats/>}/>
                    <Route path="/leaderboard" element={<LeaderBoard/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/statistics" element={<Statistics/>}/>
                    <Route path="/history" element={<History/>}/>
                    <Route path="/editprofile" element={<Editprofile/>}/>
                    <Route path="/settings" element={<Settings/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/jyly" element={<Jyly/>}/>
                    <Route path="/survival" element={<Survival/>}/>
                    <Route path="/drill" element={<Drill/>}/>
                </Routes>

                {!hideNav && <div className="h-24" />}
            </main>

            {!hideNav && (
                <div className="bg-white/95 backdrop-blur-sm border-t border-gray-100 z-50 flex-none">
                    <div className="max-w-md mx-auto px-6 h-20 flex items-center justify-between pb-[env(safe-area-inset-bottom)]">
                        <BottomNav/>
                    </div>
                </div>
            )}
        </div>
    );
};

function App() {
    return (
        <Router>
            <MainLayout/>
        </Router>
    )
}

export default App;