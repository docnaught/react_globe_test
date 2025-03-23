# React Globe Test

An interactive 3D globe visualization using [react-globe.gl](https://github.com/vasturiano/react-globe.gl) with hexed polygons visualization and real-time collaboration features.

## Live Demo

Visit the live demo at: https://docnaught.github.io/react_globe_test

## Features

- Interactive 3D globe visualization
- Hexed polygons representing countries
- Color coded countries with tooltips
- Smooth animations and interactions
- Real-time collaboration:
  - See other users' country selections
  - Share camera movements with other users
  - User presence and activity tracking
  - Real-time activity log

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

## Setting Up Real-time Collaboration

The real-time collaboration requires a backend server:

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install server dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

4. The server will run on port 3001 by default.

5. Update the connection URL:
   - For local development, the client is already set to connect to `http://localhost:3001`
   - For production deployment, set the `REACT_APP_SOCKET_SERVER` environment variable to your server URL.

## Deployment

### Deploying the Frontend to GitHub Pages

```
npm run deploy
```

This will build the app and push it to the `gh-pages` branch of your repository.

### Deploying the Backend

The Socket.io server should be deployed to a hosting service that supports Node.js. Options include:

- Heroku
- Glitch
- Railway
- Render
- Digital Ocean

After deploying the backend server, update the `REACT_APP_SOCKET_SERVER` environment variable in your GitHub Pages settings to the URL of your deployed backend.

## Using the Collaboration Features

1. When you open the application, you'll automatically be assigned a random username
2. You can change your username using the panel in the top-right corner
3. Click on any country to highlight it - other users will see your selection in real-time
4. When you move the camera, other users will see your perspective
5. The activity log in the bottom-left shows real-time updates of user activities

## Technologies Used

- React
- react-globe.gl
- Three.js (used by react-globe.gl)
- D3.js for data visualization
- Socket.io for real-time communication
- Express.js for the backend server

## Customization

You can customize the globe by modifying the props in `src/App.js`:

- Change the globe texture with `globeImageUrl`
- Modify polygon colors by changing the color function
- Adjust the polygon resolution with `hexPolygonResolution`
- Change the background with `backgroundImageUrl`

## Project Structure

```
/                   # Root directory
├── public/         # Public assets
└── src/            # Source code
    ├── components/ # React components
    ├── contexts/   # Context providers
    └── App.js      # Main application component
├── server/         # Backend Socket.io server
```

## License

This project is open source and available under the MIT License.
