import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log("=== MAIN.TSX START ===");
console.log("App import is:", typeof App, App);

try {
  const rootElement = document.getElementById('root');
  console.log("Root element is:", rootElement);
  const root = createRoot(rootElement!);
  console.log("React root created");
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  console.log("=== MAIN.TSX RENDER CALLED ===");
} catch (e) {
  console.error("=== MAIN.TSX ERROR ===", e);
}
