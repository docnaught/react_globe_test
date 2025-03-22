# React Globe Test

An interactive 3D globe visualization using [react-globe.gl](https://github.com/vasturiano/react-globe.gl) with hexed polygons visualization.

## Live Demo

Visit the live demo at: https://docnaught.github.io/react_globe_test

## Features

- Interactive 3D globe visualization
- Hexed polygons representing countries
- Color coded countries with tooltips
- Smooth animations and interactions

## Development Setup

### Option 1: GitHub Codespaces

1. Click on the "Code" button on the GitHub repository
2. Select the "Codespaces" tab
3. Click "Create codespace on main"
4. Once the codespace is ready, run:
   ```
   npm install
   npm start
   ```

### Option 2: Local Development

1. Clone the repository:
   ```
   git clone https://github.com/docnaught/react_globe_test.git
   cd react_globe_test
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Deployment to GitHub Pages

To deploy the app to GitHub Pages:

```
npm run deploy
```

This will build the app and push it to the `gh-pages` branch of your repository.

## Technologies Used

- React
- react-globe.gl
- Three.js (used by react-globe.gl)
- D3.js for data visualization

## Customization

You can customize the globe by modifying the props in `src/App.js`:

- Change the globe texture with `globeImageUrl`
- Modify polygon colors by changing the color function
- Adjust the polygon resolution with `hexPolygonResolution`
- Change the background with `backgroundImageUrl`

## License

This project is open source and available under the MIT License.
