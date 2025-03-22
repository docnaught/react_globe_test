import React, { useState, useEffect } from 'react';
import Globe from 'react-globe.gl';
import * as d3 from 'd3';

const App = () => {
  const [polygons, setPolygons] = useState([]);
  const [globeReady, setGlobeReady] = useState(false);

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

  const globeProps = {
    hexPolygonsData: polygons,
    hexPolygonResolution: 3,
    hexPolygonMargin: 0.2,
    hexPolygonColor: d => d.color,
    hexPolygonLabel: ({ properties: p }) => `
      <b>${p.NAME} (${p.ISO_A2})</b> <br />
      Population: <i>${p.POP_EST}</i>
    `,
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
    </div>
  );
};

export default App;
