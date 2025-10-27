/*
Austin Crime Map 2D Visualization
Created under Dr. Jiao's Urban Information Lab.
*/

// Global variables
var map;
var markers;
var crimeMarkers = new L.FeatureGroup();

// Load crime data
async function loadCrimeData() {
    try {
        console.log('Loading crime data...');
        
        // Hide spinner
        var spinner = document.getElementById("spinner");
        if (spinner) {
            spinner.style.display = 'none';
        }

        // Fetch crime data
        var response = await fetch('CrimeMap_geocoded.json');
        var crimeData = await response.json();
        
        console.log('Loaded', crimeData.length, 'crime records');

        // Create marker cluster group
        markers = L.markerClusterGroup({
            showCoverageOnHover: false,
            iconCreateFunction: function(cluster) {
                var childCount = cluster.getChildCount();
                return new L.DivIcon({ 
                    html: '<div><span><b>' + childCount + '</b></span></div>', 
                    className: 'marker-cluster marker-cluster-red', 
                    iconSize: new L.Point(40, 40) 
                });
            }
        });

        // Add markers for each crime
        var markerCount = 0;
        crimeData.forEach(function(crime) {
            // Skip if coordinates are null or undefined
            if (crime.latitude === null || crime.latitude === undefined ||
                crime.longitude === null || crime.longitude === undefined) {
                return; // Skip this record
            }
            
            // Check for corrupted data (looks like JSON fragments)
            if (typeof crime.latitude === 'string' && crime.latitude.includes('zoom')) {
                return; // Skip corrupted data
            }
            if (typeof crime.longitude === 'string' && crime.longitude.includes('zoom')) {
                return; // Skip corrupted data
            }
            
            // Convert to numbers and validate coordinates
            var lat = parseFloat(crime.latitude);
            var lng = parseFloat(crime.longitude);
            
            // Check if coordinates are valid numbers and within reasonable bounds
            if (!isNaN(lat) && !isNaN(lng) && 
                lat >= -90 && lat <= 90 && 
                lng >= -180 && lng <= 180 &&
                lat !== 0 && lng !== 0) {  // Also skip 0,0 coordinates
                
                var marker = L.marker([lat, lng]);
                
                // Create popup content
                var popupContent = `
                    <div class="crime-popup">
                        <div class="offense-type">${crime.offenses ? crime.offenses.join(', ') : 'N/A'}</div>
                        <div class="location">${crime.offense_location && crime.offense_location.length > 0 ? crime.offense_location[0] : 'N/A'}</div>
                        <div class="date-time">Date: ${crime.report_date_time || 'N/A'}</div>
                        <div class="date-time">Report: ${crime.report_number || 'N/A'}</div>
                    </div>
                `;
                
                marker.bindPopup(popupContent);
                markers.addLayer(marker);
                markerCount++;
            } else {
                console.warn('Invalid coordinates for crime:', crime.report_number, lat, lng);
            }
        });

        console.log('Added', markerCount, 'markers to map');

        // Add cluster group to map
        map.addLayer(markers);

        // Fit bounds to show all markers
        if (markers.getLayers().length > 0) {
            map.fitBounds(markers.getBounds());
            console.log('Map bounds fitted to markers');
        }

    } catch (error) {
        console.error('Error loading crime data:', error);
        
        // Hide spinner on error
        var spinner = document.getElementById("spinner");
        if (spinner) {
            spinner.style.display = 'none';
        }
    }
}

// Initialize the map
function initializeMap() {
    console.log('Initializing map...');
    
    map = L.map('map', {
        center: [30.2672, -97.7431], // Austin, TX
        zoom: 11
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    console.log('Map initialized');
}

// Load crime data when page loads
window.addEventListener('load', function() {
    console.log('Window loaded');
    initializeMap();
    setTimeout(function() {
        loadCrimeData();
    }, 500); // Wait a bit to ensure map is fully initialized
});

// Modal functions
function info() {
    $("#infoModal").modal({backdrop: true});
}

