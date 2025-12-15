import './index.css';
// import { StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import App from './App.tsx';

let root: Root;

export function mount(el: HTMLElement) {
  root = createRoot(el);
  root.render(<App />);
}

export function unmount() {
  root.unmount();
}

if (process.env.NODE_ENV === 'development') {
  import('../index-dev.css');
  createRoot(document.getElementById('root')!).render(
    // <StrictMode>
    <App />
    // </StrictMode>
  );
}
