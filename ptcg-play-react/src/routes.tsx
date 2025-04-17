import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/login/Login';
import GamesComponent from './components/games/GamesComponent';
import MainComponent from './components/main/MainComponent';
import MessagesComponent from './components/messages/MessagesComponent';
import ProfileComponent from './components/profile/ProfileComponent';
import RankingComponent from './components/ranking/RankingComponent';
import TermsComponent from './components/terms/TermsComponent';
import TableComponent from './components/table/TableComponent';
import DeckComponent from './components/deck/DeckComponent';
import ReplaysComponent from './components/replays/ReplaysComponent';


export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/main" element={<MainComponent />} />
      <Route path="/profile" element={<ProfileComponent />} />
      <Route path="/ranking" element={<RankingComponent />} />
      <Route path="/terms" element={<TermsComponent />} />
      <Route path="/messages" element={<MessagesComponent />} />
      <Route path="/table/:id" element={<TableComponent />} />
      <Route path="/deck/:id" element={<DeckComponent />} />
      <Route path="/replays" element={<ReplaysComponent />} />
      <Route path="/games" element={<GamesComponent />} />
      <Route path="/" element={<Navigate to="/main" replace />} />
    </Routes>
  );
}; 