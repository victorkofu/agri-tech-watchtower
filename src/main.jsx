
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Add d3 for gauge charts
import * as d3 from 'd3';

createRoot(document.getElementById("root")).render(<App />);
