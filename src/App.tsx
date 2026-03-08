import './App.css'
// import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Header.tsx";
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
// import Editprofile from "./pages/Editprofile.tsx";

const Home = () => (
  <>
    <Hero />
  </>
);

function App() {

    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/training" element={<Training />} />
                <Route path="/training/:gameId" element={<TrainingDetail />} />
                <Route path="/leaderboard" element={<LeaderBoard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/history" element={<History />} />
                <Route path="/editprofile" element={<Editprofile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/jyly" element={<Jyly />} />
                <Route path="/survival" element={<Survival/>} />
                <Route path="/drill" element={<Drill/>} />
            </Routes>

            <BottomNav />

        </Router>
    )
}

export default App
