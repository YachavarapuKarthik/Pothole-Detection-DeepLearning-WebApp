// App.js
import './App.css';
import NavBar from './components/NavBar'
import ImageDetection from './components/ImageDetection'
import VideoDetection from './components/VideoDetection'
import RealTimeDetection from './components/RealTimeDetection'
import {BrowserRouter as Router, Routes , Route} from 'react-router-dom';
function App() {
  return (
        <Router>
        <NavBar/>
        <Routes>
        <Route path="/image-detection" element = {<ImageDetection/>}/>
        <Route path="/video-detection" element ={<VideoDetection/>}/>
        <Route path="/live-detection" element ={<RealTimeDetection/>}/>
        </Routes>
        </Router>
        );
}

export default App;
