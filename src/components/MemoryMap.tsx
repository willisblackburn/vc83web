import React from 'react';

export interface MemoryBlockData {
  address: string;
  name: string;
  height: number; // Factor of unitHeight (e.g., 1.0 = unitHeight)
  isSystem?: boolean;
  description?: React.ReactNode;
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
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const totalHeight = blocks.reduce((acc, block) => acc + block.height * unitHeight, 0);
  
  // We'll use a fixed internal coordinate system and scale the SVG
  // Let's center the unitWidth block in a 800px wide viewBox
  const viewBoxWidth = 800;
  const blockX = (viewBoxWidth - unitWidth) / 2;
  const svgHeight = totalHeight + 40;

  let currentY = 20;

  return (
    <>
      <div className="memory-map-container">
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${svgHeight}`}
          xmlns="http://www.w3.org/2000/svg"
          className="memory-map-svg"
          style={{ maxWidth: `${viewBoxWidth}px` }}
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

          {blocks.map((block, index) => {
            const blockHeight = block.height * unitHeight;
            const y = currentY;
            currentY += blockHeight;

            return (
              <g 
                key={index} 
                className={`memory-block ${block.isSystem ? 'is-system' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => !block.isSystem && setSelectedBlock(block)}
                onMouseEnter={() => !block.isSystem && setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Address Label */}
                <text
                  x={blockX - 15}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="address-label"
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
                >
                  {block.name}
                </text>
              </g>
            );
          })}

          {/* Render highlight overlay last for perfect Z-order */}
          {hoveredIndex !== null && (() => {
            const block = blocks[hoveredIndex];
            const previousBlocksHeight = blocks
              .slice(0, hoveredIndex)
              .reduce((acc, b) => acc + b.height * unitHeight, 0);
            const blockHeight = block.height * unitHeight;
            const y = 20 + previousBlocksHeight;

            return (
              <rect
                x={blockX}
                y={y}
                width={unitWidth}
                height={blockHeight}
                className="memory-highlight-overlay"
              />
            );
          })()}
        </svg>
      </div>

      {selectedBlock && (
        <div className="modal-overlay" onClick={() => setSelectedBlock(null)}>
          <div className="memory-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="memory-modal-header">
              <div className="memory-modal-top-bar">
                <h1>{selectedBlock.address}</h1>
                <button className="close-button" onClick={() => setSelectedBlock(null)}>&times;</button>
              </div>
              <h2>{selectedBlock.name}</h2>
            </div>
            <div className="description-container">
              <div className="description-text">
                {selectedBlock.description || "Detailed information about this memory section will be added soon."}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MemoryMap;
