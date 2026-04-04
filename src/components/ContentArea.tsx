import React from 'react';
import { useParams } from 'react-router-dom';
import { navigationPages } from './Navigation';

const ContentArea: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const page = navigationPages.find((p) => p.id === pageId);

  if (!page) return null;

  return (
    <section className="content-area-panel">
      <h1 className="retro-title">{page.title}</h1>
      <div className="page-content">
        {page.component}
      </div>
    </section>
  );
};

export default ContentArea;
