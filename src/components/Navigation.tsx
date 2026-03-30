import React from 'react';
import About from '../pages/About';
import Manual from '../pages/Manual';
import Technical from '../pages/Technical';
import Extending from '../pages/Extending';
import Contributing from '../pages/Contributing';

export interface PageInfo {
  id: string;
  label: string;
  title: string;
  component: React.ReactNode;
}

export const navigationPages: PageInfo[] = [
  {
    id: 'manual',
    label: 'user manual',
    title: "User Manual",
    component: <Manual />
  },
  {
    id: 'technical',
    label: 'technical details',
    title: "Technical Details",
    component: <Technical />
  },
  {
    id: 'extending',
    label: 'extending',
    title: "Extending VC83",
    component: <Extending />
  },
  {
    id: 'contributing',
    label: 'contributing',
    title: "Contributing",
    component: <Contributing />
  },
  {
    id: 'about',
    label: 'about',
    title: "About VC83 BASIC",
    component: <About />
  },
];

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="retro-nav">
      {navigationPages.map((page) => (
        <button
          key={page.id}
          className={`nav-button ${activeTab === page.id ? 'active' : ''}`}
          onClick={() => onTabChange(page.id)}
        >
          {page.label}
        </button>
      ))}
    </nav>
  );
};


export default Navigation;
