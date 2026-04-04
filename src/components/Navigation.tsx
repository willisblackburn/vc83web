import React from 'react';
import { NavLink } from 'react-router-dom';
import Manual from '../pages/Manual';
import Technical from '../pages/Technical';
import Platforms from '../pages/Platforms';
import Project from '../pages/Project';
import FAQ from '../pages/FAQ';

export interface PageInfo {
  id: string;
  path: string;
  label: string;
  title: string;
  component: React.ReactNode;
}

export const navigationPages: PageInfo[] = [
  {
    id: 'manual',
    path: '/manual',
    label: 'User Manual',
    title: "User Manual",
    component: <Manual />
  },
  {
    id: 'technical',
    path: '/technical',
    label: 'Technical Reference',
    title: "Technical Reference",
    component: <Technical />
  },
  {
    id: 'platforms',
    path: '/platforms',
    label: 'Platforms and Extending',
    title: "Platforms and Extending",
    component: <Platforms />
  },
  {
    id: 'project',
    path: '/project',
    label: 'Project',
    title: "Project",
    component: <Project />
  },
  {
    id: 'faq',
    path: '/faq',
    label: 'FAQ',
    title: "Frequently Asked Questions",
    component: <FAQ />
  },
];

const Navigation: React.FC = () => {
  return (
    <nav className="retro-nav">
      {navigationPages.map((page) => (
        <NavLink
          key={page.id}
          to={page.path}
          className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
        >
          {page.label}
        </NavLink>
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
