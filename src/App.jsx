import { useState, useEffect } from 'react';
import './styles.css';
import { initialData } from './data';
import { loadData, saveData } from './storage';

// Components
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ErrorBoundary from './components/ErrorBoundary';
import LockScreen from './components/LockScreen';
import SearchGlobal from './components/SearchGlobal';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

// Pages
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Daughter from './pages/Daughter';
import Tasks from './pages/Tasks';
import Economy from './pages/Economy';
import Needs from './pages/Needs';
import Goals from './pages/Goals';
import ShoppingList from './pages/ShoppingList';
import WeeklyMenu from './pages/WeeklyMenu';
import LocalPlans from './pages/LocalPlans';
import FocusMode from './pages/FocusMode';
import SundayReview from './pages/SundayReview';
import Diary from './pages/Diary';
import Settings from './pages/Settings';
import AIAssistant from './pages/AIAssistant';

// PRO Pages
import ProDashboard from './pages/ProDashboard.jsx';
import Custody from './pages/pro/Custody.jsx';
import AlicantePlans from './pages/pro/AlicantePlans.jsx';
import ShoppingListPro from './pages/pro/ShoppingListPro.jsx';
import WeeklyMenuPro from './pages/pro/WeeklyMenuPro.jsx';
import BudgetPro from './pages/pro/BudgetPro.jsx';
import EmergencyMode from './pages/pro/EmergencyMode.jsx';
import WeeklyReview from './pages/pro/WeeklyReview.jsx';


function App() {
  const [data, setData] = useState(() => loadData() || initialData);
  const [page, setPage] = useState(() => localStorage.getItem("last_page") || 'dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [isLocked, setIsLocked] = useState(!!localStorage.getItem("app_pin_hash"));
  const [showSearch, setShowSearch] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Persistence of page
  useEffect(() => {
    localStorage.setItem("last_page", page);
  }, [page]);

  // Toast System
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Override window.alert for better feedback if desired, or just provide showToast
  window.notify = showToast;

  useEffect(() => {
    if (import.meta.env.PROD) {
      console.log = () => {};
    }
  }, []);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const handleUnlock = () => {
    setIsLocked(false);
    showToast("Acceso concedido", "success");
  };

  const renderPage = () => {
    const props = { data, setData, setPage, showToast };
    switch (page) {
      case 'dashboard': return <Dashboard {...props} />;
      case 'calendar': return <Calendar {...props} />;
      case 'daughter': return <Daughter {...props} />;
      case 'tasks': return <Tasks {...props} />;
      case 'economy': return <Economy {...props} />;
      case 'needs': return <Needs {...props} />;
      case 'goals': return <Goals {...props} />;
      case 'shopping': return <ShoppingList {...props} />;
      case 'menu': return <WeeklyMenu {...props} />;
      case 'plans': return <LocalPlans {...props} />;
      case 'focus': return <FocusMode {...props} />;
      case 'sunday-review': return <SundayReview {...props} />;
      case 'diary': return <Diary {...props} />;
      case 'assistant': return <AIAssistant {...props} />;
      case 'settings': return <Settings {...props} darkMode={darkMode} setDarkMode={setDarkMode} setIsLocked={setIsLocked} />;
      
      // PRO Routes
      case 'pro': return <ProDashboard {...props} />;
      case 'pro-custody': return <Custody {...props} />;
      case 'pro-alicante': return <AlicantePlans {...props} />;
      case 'pro-shopping': return <ShoppingListPro {...props} />;
      case 'pro-menu': return <WeeklyMenuPro {...props} />;
      case 'pro-budget': return <BudgetPro {...props} />;
      case 'pro-emergency': return <EmergencyMode {...props} />;
      case 'pro-review': return <WeeklyReview {...props} />;
      
      default: return <Dashboard {...props} />;
    }
  };

  return (
    <ErrorBoundary>
      {isLocked ? (
        <LockScreen 
          storedPinHash={localStorage.getItem("app_pin_hash")} 
          onUnlock={handleUnlock} 
        />
      ) : (
        <div className={`app ${darkMode ? 'dark' : ''}`}>
          <Header page={page} onSearch={() => setShowSearch(true)} />
          
          <main className="main page-transition" key={page}>
            {renderPage()}
          </main>

          <BottomNav page={page} setPage={setPage} />

          {showSearch && (
            <SearchGlobal 
              data={data} 
              setPage={setPage} 
              onClose={() => setShowSearch(false)} 
            />
          )}

          <div className="toast-container">
            {toasts.map(t => (
              <div key={t.id} className={`toast ${t.type}`}>
                {t.type === 'success' && <CheckCircle size={18} />}
                {t.type === 'error' && <AlertCircle size={18} />}
                {t.type === 'info' && <Info size={18} />}
                {t.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}

export default App;


