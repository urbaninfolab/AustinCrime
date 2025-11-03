# Austin Crime Map - 2D Visualization

This is a 2D crime data visualization map for Austin, Texas, rebuilt based on the structure of AustinUrbanMobility.

## Structure

- `index.html` - Main HTML file with Leaflet map
- `assets/css/` - CSS styling files
  - `style.css` - Base styles
  - `crimeMap.css` - Crime map specific styles
- `assets/js/` - JavaScript files
  - `crimeMap2d.js` - Main map logic and crime data loading
- `assets/images/` - Image assets
  - `crime_icon.png` - Icon for the map
- `CrimeMap_geocoded.json` - Crime data file

## Features

- Interactive 2D map using Leaflet
- Crime data visualization from JSON file
- Marker clustering for performance
- Popup showing crime details when clicking on markers
- Responsive design

## Usage

Simply open `index.html` in a web browser. The map will automatically load and display the crime data from `CrimeMap_geocoded.json`.

## Technologies

- Leaflet - for 2D mapping
- Leaflet.markercluster - for marker clustering
- jQuery - for modal functionality
- Bootstrap - for UI components
