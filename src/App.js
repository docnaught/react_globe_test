import React, { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import * as d3 from 'd3';
import { SocketProvider, useSocket } from './contexts/SocketContext';
import UserPanel from './components/UserPanel';
import ActivityLog from './components/ActivityLog';
import './App.css';

const GlobeWithSocket = () => {
  const [polygons, setPolygons] = useState([]);
  const [globeReady, setGlobeReady] = useState(false);
  const { selectCountry, selectedCountries, updateCamera } = useSocket();
  const globeRef = useRef();
  const isDraggingRef = useRef(false);
  const lastCameraUpdateRef = useRef(0);
  
  useEffect(() => {
    // Load polygon data (countries)
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(countries => {
        const data = countries.features.map(feature => ({
          geometry: feature.geometry,
          properties: feature.properties,
          color: d3.interpolateRainbow(Math.random())
        }));
        setPolygons(data);
      });
  }, []);
  
  const getPolygonColor = (polygon) => {
    // Check if this polygon is selected by any user
    const isSelected = Object.values(selectedCountries).some(
      selectedCountry => selectedCountry?.properties?.ISO_A2 === polygon.properties.ISO_A2
    );
    
    if (isSelected) {
      return 'rgba(255, 215, 0, 0.8)'; // Highlighted gold color
    }
    
    // Default color from the polygon data
    return polygon.color;
  };
  
  // Handle polygon click
  const handlePolygonClick = (polygon) => {
    if (polygon && polygon.properties) {
      selectCountry(polygon);
    }
  };
  
  // Track camera changes and emit to other users
  useEffect(() => {
    if (!globeRef.current) return;
    
    const controlsInstance = globeRef.current.controls();
    
    const handleCameraMove = () => {
      // Only emit changes every 500ms to avoid flooding the server
      const now = Date.now();
      if (isDraggingRef.current && now - lastCameraUpdateRef.current > 500) {
        lastCameraUpdateRef.current = now;
        
        const camera = globeRef.current.camera();
        const controls = globeRef.current.controls();
        
        const cameraPosition = {
          position: {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z
          },
          target: {
            x: controls.target.x,
            y: controls.target.y,
            z: controls.target.z
          }
        };
        
        updateCamera(cameraPosition);
      }
    };
    
    const handleStart = () => {
      isDraggingRef.current = true;
    };
    
    const handleEnd = () => {
      isDraggingRef.current = false;
      
      // Send final camera position
      const camera = globeRef.current.camera();
      const controls = globeRef.current.controls();
      
      const cameraPosition = {
        position: {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z
        },
        target: {
          x: controls.target.x,
          y: controls.target.y,
          z: controls.target.z
        }
      };
      
      updateCamera(cameraPosition);
    };
    
    // Add event listeners
    controlsInstance.addEventListener('start', handleStart);
    controlsInstance.addEventListener('change', handleCameraMove);
    controlsInstance.addEventListener('end', handleEnd);
    
    return () => {
      // Remove event listeners on cleanup
      if (controlsInstance) {
        controlsInstance.removeEventListener('start', handleStart);
        controlsInstance.removeEventListener('change', handleCameraMove);
        controlsInstance.removeEventListener('end', handleEnd);
      }
    };
  }, [updateCamera]);
  
  const globeProps = {
    ref: globeRef,
    hexPolygonsData: polygons,
    hexPolygonResolution: 3,
    hexPolygonMargin: 0.2,
    hexPolygonColor: getPolygonColor,
    hexPolygonLabel: ({ properties: p }) => `
      <b>${p.NAME} (${p.ISO_A2})</b> <br />
      Population: <i>${p.POP_EST}</i>
    `,
    onHexPolygonClick: handlePolygonClick,
    onGlobeReady: () => setGlobeReady(true),
    
    // Visual settings
    globeImageUrl: 'https://unpkg.com/three-globe/example/img/earth-dark.jpg',
    backgroundImageUrl: 'https://unpkg.com/three-globe/example/img/night-sky.png',
    showAtmosphere: true,
    atmosphereColor: '#3a228a',
    atmosphereAltitude: 0.25,
    
    // Interactive settings
    enablePointerInteraction: true,
    
    // Initial position
    pointOfView: { lat: 20, lng: 40, altitude: 2.5 }
  };

  return (
    <div className="globe-container">
      <Globe {...globeProps} />
      <UserPanel />
      <ActivityLog />
    </div>
  );
};

// Wrap the main app with the socket provider
const App = () => {
  return (
    <SocketProvider>
      <GlobeWithSocket />
    </SocketProvider>
  );
};

export default App;
