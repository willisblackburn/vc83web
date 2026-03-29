import React from 'react';
import { navigationPages } from './Navigation';

interface ContentAreaProps {
  activeTab: string;
}

const ContentArea: React.FC<ContentAreaProps> = ({ activeTab }) => {
  const page = navigationPages.find((p) => p.id === activeTab);

  if (!page) return null;

  return (
    <section className="content-area-panel">
      <h2 className="retro-title">{page.title}</h2>
      <div className="page-content">
        {page.component}
      </div>
    </section>
  );
};

export default ContentArea;
