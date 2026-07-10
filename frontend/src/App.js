import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import ModeSelection from './pages/ModeSelection';
import ScannerMode from './pages/ScannerMode';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OwnerMode from './pages/OwnerMode';
import Profile from './pages/Profile';
import AddMember from './pages/AddMember';
import GeneratedQRList from './pages/GeneratedQRList';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ModeSelection />} />
          <Route path="/scanner" element={<ScannerMode />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/owner" element={<OwnerMode />} />
          <Route path="/owner/profile" element={<Profile />} />
          <Route path="/owner/add-member" element={<AddMember />} />
          <Route path="/owner/qr-list" element={<GeneratedQRList />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
