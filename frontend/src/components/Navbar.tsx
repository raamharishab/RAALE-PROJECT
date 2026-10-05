import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, Language } from '../context/LanguageContext';
import { ShieldCheck, Globe, LogOut, User as UserIcon, BookOpen, BarChart3, ShieldAlert, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  onOpenEthics?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEthics }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Main Nav Links */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">{t('appTitle')}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono uppercase font-bold">
                  70% Complete
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">{t('appSubtitle')}</p>
            </div>
          </Link>

          {/* Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1 pl-4 border-l border-slate-800 text-xs font-medium">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
                location.pathname === '/' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/benchmark"
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
                location.pathname === '/benchmark' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>{t('benchmark')}</span>
            </Link>

            <Link
              to="/edge-cases"
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
                location.pathname === '/edge-cases' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>{t('edgeCases')}</span>
            </Link>

            <Link
              to="/ethics"
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
                location.pathname === '/ethics' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>{t('ethics')}</span>
            </Link>
          </nav>
        </div>

        {/* Right Section Actions */}
        <div className="flex items-center space-x-4">
          
          {/* Language Selector */}
          <div className="flex items-center space-x-1 bg-slate-800 rounded-lg p-1 border border-slate-700 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            {(['en', 'ta', 'hi', 'es'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-0.5 rounded font-medium transition uppercase ${
                  language === lang ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang === 'ta' ? 'தமிழ்' : lang === 'hi' ? 'हिंदी' : lang.toUpperCase()}
              </button>
            ))}
          </div>

          {/* User Info & Role */}
          {user && (
            <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
              <div className="text-right hidden md:block">
                <p className="text-xs font-semibold text-slate-200">{user.full_name}</p>
                <p className="text-[10px] uppercase font-mono tracking-wider text-blue-400">{user.role}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                <UserIcon className="w-4 h-4" />
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                title={t('logout')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};

