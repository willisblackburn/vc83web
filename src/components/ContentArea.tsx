import React from 'react';
import ReactMarkdown from 'react-markdown';
import { navigationContent } from '../data/content';

interface ContentAreaProps {
  activeTab: string;
}

const ContentArea: React.FC<ContentAreaProps> = ({ activeTab }) => {
  const page = navigationContent[activeTab];

  if (!page) return null;

  return (
    <section className="content-area-panel">
      <h2 className="retro-title">{page.title}</h2>
      <div className="page-content">
        <ReactMarkdown>{page.content}</ReactMarkdown>
      </div>
    </section>
  );
};

export default ContentArea;
