import React from 'react';
import Manual from '../pages/Manual';
import Technical from '../pages/Technical';
import Extending from '../pages/Extending';
import Project from '../pages/Project';
import FAQ from '../pages/FAQ';

export interface PageInfo {
  id: string;
  label: string;
  title: string;
  component: React.ReactNode;
}

export const navigationPages: PageInfo[] = [
  {
    id: 'manual',
    label: 'User Manual',
    title: "User Manual",
    component: <Manual />
  },
  {
    id: 'technical',
    label: 'Technical Details',
    title: "Technical Details",
    component: <Technical />
  },
  {
    id: 'extending',
    label: 'Extending',
    title: "Extending VC83",
    component: <Extending />
  },
  {
    id: 'project',
    label: 'Project',
    title: "Project Overview",
    component: <Project />
  },
  {
    id: 'faq',
    label: 'FAQ',
    title: "Frequently Asked Questions",
    component: <FAQ />
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
      <a 
        href="https://github.com/willisblackburn/vc83basic" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="github-link"
        title="VC83BASIC on GitHub"
      >
        <i className="fa-brands fa-github github-icon" aria-hidden="true"></i>
      </a>
    </nav>
  );
};


export default Navigation;
