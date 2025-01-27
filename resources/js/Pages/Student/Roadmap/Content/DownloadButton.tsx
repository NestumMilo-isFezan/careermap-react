import React from 'react';
import {
  Panel,
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from '@xyflow/react';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';

function downloadImage(dataUrl: string) {
  const a = document.createElement('a');
  a.setAttribute('download', 'roadmap.png');
  a.setAttribute('href', dataUrl);
  a.click();
}

function DownloadButton() {
  const { getNodes, getViewport, setViewport, fitView } = useReactFlow();

  const onClick = () => {
    const reactFlowElement = document.querySelector('.react-flow') as HTMLElement;
    if (!reactFlowElement) return;

    // Save current viewport
    const currentViewport = getViewport();

    // Get all nodes and calculate bounds
    const nodes = getNodes();
    const bounds = getNodesBounds(nodes);

    // Calculate padding and dimensions with constraints
    const horizontalPadding = 400; // Increased horizontal padding
    const verticalPadding = 200;  // Increased vertical padding
    const minHeight = 1000; // Increased minimum height
    const maxHeight = 3000; // Increased maximum height
    const maxWidth = 4000; // Increased maximum width

    // Calculate total width and height needed with constraints
    const totalWidth = Math.min(maxWidth, bounds.width + (horizontalPadding * 2));
    const totalHeight = Math.min(maxHeight, Math.max(minHeight, bounds.height + (verticalPadding * 2)));

    // Calculate zoom to fit content within max dimensions
    const widthZoom = totalWidth / (bounds.width + (horizontalPadding * 2));
    const heightZoom = totalHeight / (bounds.height + (verticalPadding * 2));
    const zoom = Math.min(0.7, widthZoom, heightZoom); // Reduced max zoom for better overview

    // Calculate center points with extra space
    const centerX = bounds.x + (bounds.width / 2);
    const centerY = bounds.y + (bounds.height / 2);

    // Add extra space to the right and bottom by adjusting transform
    const transformX = (totalWidth / 2) - centerX + (horizontalPadding * 0.5); // Less shift to the left
    const transformY = (totalHeight / 2) - centerY + (verticalPadding * 0.3); // Shift down slightly

    // Set viewport to center the content
    setViewport({
      x: transformX,
      y: transformY,
      zoom: zoom,
    });

    setTimeout(() => {
      toPng(reactFlowElement, {
        backgroundColor: '#fefce8',
        quality: 1,
        pixelRatio: 2,
        width: totalWidth,
        height: totalHeight,
        style: {
          width: `${totalWidth}px`,
          height: `${totalHeight}px`,
        },
        filter: (node) => {
          const exclude = ['react-flow__minimap', 'react-flow__controls'];
          return !exclude.some(className => node.classList?.contains(className));
        }
      }).then((dataUrl) => {
        // Restore original viewport
        setViewport(currentViewport);
        downloadImage(dataUrl);
      }).catch((error) => {
        console.error('Error capturing image:', error);
        setViewport(currentViewport);
      });
    }, 100);
  };

  return (
    <Panel position="top-right">
      <button
        className="download-btn flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-md"
        onClick={onClick}
      >
        <Download className="h-4 w-4" />
        <span>Download</span>
      </button>
    </Panel>
  );
}

export default DownloadButton;
