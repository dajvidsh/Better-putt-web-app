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
            </Routes>

            <BottomNav />

        </Router>
    )
}

export default App
