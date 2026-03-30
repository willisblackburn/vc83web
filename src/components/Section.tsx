import React from 'react';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, title, children }) => {
  return (
    <div id={id} className="content-section">
      <h1>{title}</h1>
      <div className="section-content">
        {children}
      </div>
    </div>
  );
};

export default Section;
