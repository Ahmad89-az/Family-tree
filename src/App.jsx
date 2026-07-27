import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { FamilyDataProvider } from './context/FamilyDataContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import FamilyTreeView from './components/tree/FamilyTreeView';
import SearchPage from './pages/SearchPage';
import TimelinePage from './pages/TimelinePage';
import StatsPage from './pages/StatsPage';
import MapPage from './pages/MapPage';
import AdminPage from './pages/AdminPage';
import AdminAuthGate from './components/admin/AdminAuthGate';

export default function App() {
  return (
    <ThemeProvider>
      <FamilyDataProvider>
        <HashRouter>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/pohon-keluarga" element={<FamilyTreeView />} />
                <Route path="/cari" element={<SearchPage />} />
                <Route path="/linimasa" element={<TimelinePage />} />
                <Route path="/statistik" element={<StatsPage />} />
                <Route path="/peta" element={<MapPage />} />
                <Route path="/admin" element={<AdminAuthGate><AdminPage /></AdminAuthGate>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </HashRouter>
      </FamilyDataProvider>
    </ThemeProvider>
  );
}
