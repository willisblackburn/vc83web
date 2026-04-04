import React from 'react';

export interface MemoryBlockData {
  address: string;
  name: string;
  height: number; // Factor of unitHeight (e.g., 1.0 = unitHeight)
  isSystem?: boolean;
  description?: string;
}

interface MemoryMapProps {
  blocks: MemoryBlockData[];
  unitWidth?: number;
  unitHeight?: number;
}

const MemoryMap: React.FC<MemoryMapProps> = ({
  blocks,
  unitWidth = 400,
  unitHeight = 80,
}) => {
  const [selectedBlock, setSelectedBlock] = React.useState<MemoryBlockData | null>(null);
  const totalHeight = blocks.reduce((acc, block) => acc + block.height * unitHeight, 0);
  
  // We'll use a fixed internal coordinate system and scale the SVG
  // Let's center the unitWidth block in a 800px wide viewBox
  const viewBoxWidth = 800;
  const blockX = (viewBoxWidth - unitWidth) / 2;
  const svgHeight = totalHeight + 40;

  let currentY = 20;

  return (
    <>
      <div className="memory-map-container" style={{ 
        width: '100%',
        margin: '2.5rem 0',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <svg
          width="100%"
          height="auto"
          viewBox={`0 0 ${viewBoxWidth} ${svgHeight}`}
          xmlns="http://www.w3.org/2000/svg"
          className="memory-map-svg"
          style={{ 
            maxWidth: `${viewBoxWidth}px`,
            filter: 'drop-shadow(0 0 10px rgba(51, 255, 51, 0.1))'
          }}
        >
          <defs>
            <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8">
              <path 
                d="M-1,1 l2,-2 M0,8 l8,-8 M7,9 l2,-2" 
                style={{ stroke: 'rgba(255, 204, 0, 0.25)', strokeWidth: 1 }} 
              />
            </pattern>
            <linearGradient id="systemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2a2200" />
              <stop offset="100%" stopColor="#1a1500" />
            </linearGradient>
          </defs>

          <style>
            {`
              .memory-block {
                transition: all 0.3s ease;
                cursor: pointer;
              }
              .memory-block rect.outline {
                fill: #1a1a1a; /* Matches example block perceived solid color */
              }
              .memory-block.is-system rect.outline {
                fill: url(#systemGrad);
              }
              .memory-block:hover rect.outline {
                fill: #222 !important;
              }
              .memory-block.is-system:hover rect.outline {
                fill: #3a2e00 !important;
              }
              .memory-block:hover rect.hover-highlight {
                opacity: 1 !important;
              }
              .memory-block:hover text.block-name {
                fill: #fff !important;
                font-weight: 600 !important;
              }
              .memory-block:hover text.address-label {
                fill: var(--retro-green) !important;
              }
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .memory-block {
                animation: fadeIn 0.5s ease backwards;
              }
            `}
          </style>

          {blocks.map((block, index) => {
            const blockHeight = block.height * unitHeight;
            const y = currentY;
            currentY += blockHeight;

            return (
              <g 
                key={index} 
                className={`memory-block ${block.isSystem ? 'is-system' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setSelectedBlock(block)}
              >
                {/* Address Label */}
                <text
                  x={blockX - 15}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="address-label"
                  style={{
                    fill: 'var(--retro-gray-dim)',
                    fontSize: '13px',
                    fontFamily: 'Courier New, monospace',
                    transition: 'fill 0.3s'
                  }}
                >
                  {block.address}
                </text>

                {/* Main Block Rectangle */}
                <rect
                  x={blockX}
                  y={y}
                  width={unitWidth}
                  height={blockHeight}
                  className="outline"
                  style={{
                    stroke: 'var(--retro-border)',
                    strokeWidth: 1.5,
                    transition: 'all 0.3s'
                  }}
                />

                {/* Inset Hover Highlight (Drawn inside to avoid being covered by next block) */}
                <rect
                  x={blockX + 2}
                  y={y + 2}
                  width={unitWidth - 4}
                  height={blockHeight - 4}
                  className="hover-highlight"
                  style={{
                    fill: 'transparent',
                    stroke: 'var(--retro-green)',
                    strokeWidth: 2,
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    pointerEvents: 'none'
                  }}
                />
                {block.isSystem && (
                  <rect
                    x={blockX}
                    y={y}
                    width={unitWidth}
                    height={blockHeight}
                    fill="url(#hatch)"
                    style={{ pointerEvents: 'none' }}
                  />
                )}

                {/* Block Name */}
                <text
                  x={blockX + unitWidth / 2}
                  y={y + blockHeight / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="block-name"
                  style={{
                    fill: block.isSystem ? 'var(--retro-amber)' : 'var(--retro-gray)',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '0.02em',
                    pointerEvents: 'none',
                    transition: 'all 0.3s'
                  }}
                >
                  {block.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {selectedBlock && (
        <div className="modal-overlay" onClick={() => setSelectedBlock(null)}>
          <div className="sample-browser" style={{ width: '550px' }} onClick={(e) => e.stopPropagation()}>
            <div className="sample-browser-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <code style={{ 
                  color: 'var(--retro-amber)', 
                  fontSize: '1.1rem',
                  fontFamily: 'Courier New, monospace'
                }}>
                  {selectedBlock.address}
                </code>
                <button className="close-button" onClick={() => setSelectedBlock(null)}>&times;</button>
              </div>
              <h1 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--retro-green)' }}>
                {selectedBlock.name}
              </h1>
            </div>
            <div className="sample-list" style={{ padding: '1.5rem', overflow: 'hidden' }}>
              <p style={{ 
                margin: 0, 
                fontSize: '1.05rem', 
                lineHeight: '1.6', 
                color: 'var(--retro-gray)' 
              }}>
                {selectedBlock.description || "Detailed information about this memory section will be added soon."}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MemoryMap;
