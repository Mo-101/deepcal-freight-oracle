
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calculator, 
  BarChart3, 
  MessageSquare, 
  Dumbbell, 
  FileText, 
  Home,
  Activity
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/calculator', label: 'Calculator', icon: Calculator },
  { path: '/dashboard', label: 'Dashboard', icon: Activity },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/deeptalk', label: 'DeepTalk', icon: MessageSquare },
  { path: '/training', label: 'Training', icon: Dumbbell },
  { path: '/rfq', label: 'RFQ', icon: FileText }
];

const UnifiedGlassHeader: React.FC = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-900/20 border-b border-white/10">
      <div className="container max-w-full mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300">
              <span className="text-white font-bold text-lg">∞</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
                DeepCAL
              </h1>
              <span className="text-xs text-slate-400 -mt-1">v2.0</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-white/10 text-white shadow-lg shadow-purple-500/20 border border-white/20' 
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button + Avatar */}
          <div className="flex items-center gap-4">
            {/* Mobile menu would go here */}
            <div className="md:hidden">
              <button className="text-slate-300 hover:text-white p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            
            <Avatar className="w-8 h-8 border-2 border-white/20">
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback className="bg-purple-600 text-white text-xs">DC</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-slate-400">System Online</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Real Data: 105+ Records</span>
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <span>🔱</span>
            <span>The Oracle of Freight</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UnifiedGlassHeader;
