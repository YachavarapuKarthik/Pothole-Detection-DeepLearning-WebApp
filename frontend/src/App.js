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
        <h1>Home page</h1>
        <Routes>
        <Route path="/image-detection" element = {<ImageDetection/>}/>
        <Route path="/video-detection" element ={<VideoDetection/>}/>
        <Route path="/live-detection" element ={<RealTimeDetection/>}/>
        </Routes>
        </Router>
        );
}

export default App;

//import React from 'react';
//
//const App = () => {
//  const videoSrc = 'http://127.0.0.1:5000/api/video/tested';
//
//  return (
//    <div>
//      <h1>React Video Player</h1>
//      <video width="640" height="360" controls>
//        <source src={videoSrc} type="video/mp4" />
//        Your browser does not support the video tag.
//      </video>
//    </div>
//  );
//};
//
//export default App;

