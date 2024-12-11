import { StrictMode } from 'react';  // Import StrictMode from React to help identify potential problems in the application during development
import { createRoot } from 'react-dom/client';  // Import the createRoot method from react-dom/client to create the root element for the React app
import './index.css';  // Import the CSS file to apply global styles to the entire application
import App from './App.jsx';  // Import the App component, which is the root component of the app

// Create the root React element and render the App component inside the HTML element with id 'root'
createRoot(document.getElementById('root')).render(
  // StrictMode is a development tool that helps identify potential issues in the app
  // It does not affect the production build but highlights issues with components in development mode
  <StrictMode>
    {/* Render the App component inside StrictMode */}
    <App />
  </StrictMode>,
);
