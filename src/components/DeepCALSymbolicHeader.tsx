import { useNavigate } from 'react-router-dom';
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
