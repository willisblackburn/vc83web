import React from 'react';
import { navigationContent } from '../data/content';

interface ContentAreaProps {
  activeTab: string;
}

const ContentArea: React.FC<ContentAreaProps> = ({ activeTab }) => {
  const page = navigationContent[activeTab];

  if (!page) return null;

  return (
    <div className="content-area">
      <h2 className="retro-title">{page.title}</h2>
      <div 
        className="page-content"
        dangerouslySetInnerHTML={{ 
          __html: page.content.trim()
            .split('\n')
            .map(line => {
              const trimmed = line.trim();
              if (trimmed.startsWith('### ')) return `<h3>${trimmed.substring(4)}</h3>`;
              if (trimmed.startsWith('- ')) return `<li>${trimmed.substring(2)}</li>`;
              if (trimmed === '') return '</p><p>';
              return trimmed;
            })
            .join(' ')
            .replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>')
            .replace(/<\/ul>\s*<ul>/g, '')
            .replace(/`([^`]*)`/g, '<code>$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        }}
      />
    </div>
  );
};

export default ContentArea;
