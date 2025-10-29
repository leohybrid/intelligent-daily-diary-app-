import React from 'react';
import { View } from '../types';
import { HomeIcon, CalendarDaysIcon, CheckBadgeIcon, StarIcon, UserCircleIcon, Cog6ToothIcon, CreditCardIcon, IntelliJournalIcon } from './icons';

interface NavigationBarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ currentView, setCurrentView }) => {
  const navItems: { view: View; label: string; icon: React.ReactNode }[] = [
    { view: 'Home', label: 'Home', icon: <HomeIcon className="w-6 h-6"/> },
    { view: 'Agenda', label: 'Agenda', icon: <CalendarDaysIcon className="w-6 h-6"/> },
    { view: 'Completion', label: 'Completion', icon: <CheckBadgeIcon className="w-6 h-6"/> },
    { view: 'Highlights', label: 'Highlights', icon: <StarIcon className="w-6 h-6" fill="none"/> },
    { view: 'Personal', label: 'Personal', icon: <UserCircleIcon className="w-6 h-6"/> },
    { view: 'Finance', label: 'Finance', icon: <CreditCardIcon className="w-6 h-6"/> },
  ];

  const NavButton: React.FC<{item: typeof navItems[0]}> = ({ item }) => (
    <div className="w-full lg:px-4">
        <button
          onClick={() => setCurrentView(item.view)}
          title={item.label}
          className={`flex items-center justify-center lg:justify-start gap-4 w-full py-3 px-2 lg:px-4 rounded-lg transition-colors duration-200 ${
            currentView === item.view 
              ? 'bg-primary/10 text-primary' 
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          {item.icon}
          <span className="hidden lg:inline text-sm font-semibold">{item.label}</span>
        </button>
      </div>
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border z-50 md:relative md:bottom-auto md:left-auto md:right-auto md:border-t-0 md:border-r md:h-screen md:w-20 lg:w-56 md:flex-shrink-0">
      <div className="flex justify-around md:flex-col md:h-full md:justify-start md:items-center md:py-8 md:gap-4">
          <div className="hidden lg:flex items-center gap-3 mb-8 px-4">
              <div className="w-8 h-8 text-primary">
                <IntelliJournalIcon />
              </div>
              <span className="text-xl font-bold">IntelliJournal</span>
          </div>
        
        {navItems.map((item) => <NavButton key={item.view} item={item} />)}

        <div className="hidden md:block mt-auto w-full">
             <NavButton item={{ view: 'Settings', label: 'Settings', icon: <Cog6ToothIcon className="w-6 h-6"/> }} />
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
