import React from 'react';
import Manual from '../pages/Manual';
import Technical from '../pages/Technical';
import Platforms from '../pages/Platforms';
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
    label: 'Technical Reference',
    title: "Technical Reference",
    component: <Technical />
  },
  {
    id: 'platforms',
    label: 'Platforms and Extending',
    title: "Platforms and Extending",
    component: <Platforms />
  },
  {
    id: 'project',
    label: 'Project',
    title: "Project",
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
      <div className="nav-social-links">
        <a 
          href="https://github.com/willisblackburn/vc83basic" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="social-link"
          title="VC83BASIC on GitHub"
        >
          <i className="fa-brands fa-github social-icon" aria-hidden="true"></i>
        </a>
        <a 
          href="mailto:info@vc83.org" 
          className="social-link"
          title="Email info@vc83.org"
        >
          <i className="fa-solid fa-envelope social-icon" aria-hidden="true"></i>
        </a>
      </div>
    </nav>
  );
};


export default Navigation;
