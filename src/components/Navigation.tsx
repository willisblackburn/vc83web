import React from 'react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'about', label: 'about' },
    { id: 'manual', label: 'user manual' },
    { id: 'technical', label: 'technical details' },
    { id: 'extending', label: 'extending' },
    { id: 'contributing', label: 'contributing' }
  ];

  return (
    <nav className="retro-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nav-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
