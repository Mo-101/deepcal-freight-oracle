import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const DeepCALHeader: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white py-4 shadow-md">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-deepcal-light">
          DeepCAL
        </Link>

        <nav className="flex space-x-6">
          <Link to="/" className="text-white hover:text-deepcal-light transition-colors">
            Home
          </Link>
          <Link to="/calculator" className="text-white hover:text-deepcal-light transition-colors">
            Calculator
          </Link>
          <Link to="/about" className="text-white hover:text-deepcal-light transition-colors">
            About
          </Link>
          <Link to="/analytics" className="text-white hover:text-deepcal-light transition-colors">
            Analytics
          </Link>
          <Link to="/deeptalk" className="text-white hover:text-deepcal-light transition-colors">
            DeepTalk
          </Link>
          <Link to="/training" className="text-white hover:text-deepcal-light transition-colors">
            Training
          </Link>
            <Link to="/map" className="text-white hover:text-deepcal-light transition-colors">
              Map
            </Link>
          <Link to="/rfq" className="text-white hover:text-deepcal-light transition-colors">
            RFQ
          </Link>
        </nav>

        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default DeepCALHeader;
