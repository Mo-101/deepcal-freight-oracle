import { useNavigate } from 'react-router-dom';

export default function DeepCALSymbolicHeader() {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-lime-500/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lime-400 to-cyan-300 cursor-pointer hover:from-lime-300 hover:to-cyan-200 transition-all duration-300"
              onClick={() => handleNavigate('/')}
            >
              DeepCAL++
            </h1>
            <span className="text-xs bg-lime-500 text-black px-2 py-1 rounded font-semibold">
              NEURAL ACTIVE
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => handleNavigate('/deepcal')}
              className="text-indigo-300 hover:text-lime-400 transition-colors text-sm font-medium"
            >
              Engine Core
            </button>
            <button 
              onClick={() => handleNavigate('/analytics')}
              className="text-indigo-300 hover:text-lime-400 transition-colors text-sm font-medium"
            >
              Analytics
            </button>
            <button 
              onClick={() => handleNavigate('/new-shipments')}
              className="text-indigo-300 hover:text-lime-400 transition-colors text-sm font-medium"
            >
              New Shipments
            </button>
            <button 
              onClick={() => handleNavigate('/map')}
              className="text-indigo-300 hover:text-lime-400 transition-colors text-sm font-medium"
            >
              Route Map
            </button>
            <button 
              onClick={() => handleNavigate('/rfq')}
              className="text-indigo-300 hover:text-lime-400 transition-colors text-sm font-medium"
            >
              RFQ
            </button>
            <button 
              onClick={() => handleNavigate('/symbolic-consciousness')}
              className="text-indigo-300 hover:text-lime-400 transition-colors text-sm font-medium"
            >
              Consciousness
            </button>
            <button 
              onClick={() => handleNavigate('/symbolic-training')}
              className="text-indigo-300 hover:text-lime-400 transition-colors text-sm font-medium"
            >
              Training
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-xs">
              <span className="w-2 h-2 bg-lime-500 rounded-full animate-pulse"></span>
              <span className="text-lime-400 font-mono">SYMBOLIC</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
