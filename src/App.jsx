import { useState, useEffect } from 'react';
import './styles.css';
import { initialData } from './data';
import { loadData, saveData } from './storage';

// Components
import Header from './components/Header';
import BottomNav from './components/BottomNav';

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
  const [page, setPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const renderPage = () => {
    const props = { data, setData, setPage };
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
      case 'settings': return <Settings {...props} darkMode={darkMode} setDarkMode={setDarkMode} />;
      
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
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <Header page={page} />
      <main className="main">
        {renderPage()}
      </main>
      <BottomNav page={page} setPage={setPage} />
    </div>
  );
}

export default App;
