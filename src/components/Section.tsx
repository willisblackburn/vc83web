import React from 'react';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, title, children }) => {
  return (
    <div id={id} className="content-section">
      <h2>{title}</h2>
      <div className="section-content">
        {children}
      </div>
    </div>
  );
};

export default Section;
