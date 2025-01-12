// Add at the top of the file
const countryDataService = new CityDataService();

// Initialize the map
const map = L.map('map', {
    minZoom: 2.5,  // Increased from 2 to 2.5 to limit zoom out
    maxZoom: 19,   // Maximum zoom level
    maxBounds: [
        [-90, -180],  // Southwest coordinates
        [90, 180]     // Northeast coordinates
    ],
    maxBoundsViscosity: 1.0  // Prevent moving outside bounds
}).setView([30, 0], 3);

// Add the dark-themed map tiles
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors, © CARTO',
    noWrap: true,  // Prevent repeating maps
    bounds: [
        [-90, -180],
        [90, 180]
    ]
}).addTo(map);

// Initialize variables for markers
let currentMarker = null;
let markers = new Map(); // To store all markers
let circles = new Map(); // To store all circles

// Handle search functionality
document.getElementById('searchButton').addEventListener('click', handleSearch);
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Replace the dummyData initialization with this
async function initializeData() {
    try {
        document.getElementById('searchButton').disabled = true;
        document.getElementById('searchInput').placeholder = 'Loading country data...';

        await countryDataService.initialize();
        
        const allCountries = countryDataService.getAllCountries();
        SUNSHINE_RANGE.min = Math.min(...allCountries.map(d => d.sunshine));
        SUNSHINE_RANGE.max = Math.max(...allCountries.map(d => d.sunshine));
        RAIN_RANGE.min = Math.min(...allCountries.map(d => d.rain));
        RAIN_RANGE.max = Math.max(...allCountries.map(d => d.rain));

        initializeAllCountries();
        addCircleHoverEffects();

        document.getElementById('searchButton').disabled = false;
        document.getElementById('searchInput').placeholder = 'Enter country name...';

        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', handleSearchSuggestions);
    } catch (error) {
        console.error('Failed to initialize data:', error);
        alert('Failed to load country data. Please refresh the page to try again.');
    }
}

// Add search suggestions functionality
function handleSearchSuggestions(e) {
    const query = e.target.value;
    if (query.length < 2) return;

    const suggestions = countryDataService.searchCountries(query)
        .slice(0, 5)
        .map(country => `${country.name} (${country.region})`);

    updateSearchSuggestions(suggestions);
}

// Add these instead
const SUNSHINE_RANGE = { min: 0, max: 4000 }; // Initial values
const RAIN_RANGE = { min: 0, max: 3000 }; // Initial values

// Add event listeners for toggles
document.getElementById('sunshineToggle').addEventListener('change', updateVisibility);
document.getElementById('rainToggle').addEventListener('change', updateVisibility);

// Function to get color based on value and type
function getColor(value, type) {
    const normalize = (val, min, max) => (val - min) / (max - min);
    
    if (type === 'sunshine') {
        const normalized = normalize(value, SUNSHINE_RANGE.min, SUNSHINE_RANGE.max);
        // Create a more vibrant sunshine gradient: dark blue (cold) -> yellow -> red (hot)
        if (normalized < 0.5) {
            // From dark blue to yellow
            const ratio = normalized * 2; // Convert to 0-1 range for first half
            return `rgb(
                ${Math.floor(25 + (230 * ratio))},
                ${Math.floor(25 + (230 * ratio))},
                ${Math.floor(112 + (143 * (1 - ratio)))}
            )`;
        } else {
            // From yellow to red
            const ratio = (normalized - 0.5) * 2; // Convert to 0-1 range for second half
            return `rgb(
                ${Math.floor(255)},
                ${Math.floor(255 * (1 - ratio))},
                ${Math.floor(0)}
            )`;
        }
    } else {
        const normalized = normalize(value, RAIN_RANGE.min, RAIN_RANGE.max);
        // Create a more vibrant rain gradient: yellow (dry) -> green -> blue (wet)
        if (normalized < 0.5) {
            // From yellow to green
            const ratio = normalized * 2;
            return `rgb(
                ${Math.floor(255 * (1 - ratio))},
                ${Math.floor(255)},
                ${Math.floor(0)}
            )`;
        } else {
            // From green to blue
            const ratio = (normalized - 0.5) * 2;
            return `rgb(
                ${Math.floor(0)},
                ${Math.floor(255 * (1 - ratio))},
                ${Math.floor(255 * ratio)}
            )`;
        }
    }
}

// Modify the getCircleRadius function to be more zoom-sensitive
function getCircleRadius(map) {
    const zoom = map.getZoom();
    // Smaller base radius and more aggressive scaling
    return 15000 * Math.pow(1.8, (10 - zoom));
}

// Add function to calculate opacity based on zoom
function getCircleOpacity(map) {
    const zoom = map.getZoom();
    // Start with very low opacity at low zoom levels
    return Math.min(0.7, Math.max(0.15, (zoom - 2) * 0.1));
}

// Replace initializeAllCities function with initializeAllCountries
function initializeAllCountries() {
    countryDataService.getAllCountries().forEach(country => {
        const marker = L.marker([country.lat, country.lng])
            .bindPopup(`
                <div style="background: #1a1a1a; padding: 10px; border-radius: 8px;">
                    <h3 style="margin: 0 0 10px 0;">${country.name} (${country.region})</h3>
                    <div style="display: flex; justify-content: space-around; text-align: center;">
                        <div>
                            <div style="font-size: 24px;">☀️</div>
                            <div>Sunshine</div>
                            <div>${country.sunshine.toLocaleString()}</div>
                            <div>hours/year</div>
                        </div>
                        <div>
                            <div style="font-size: 24px;">🌧️</div>
                            <div>Rainfall</div>
                            <div>${country.rain}</div>
                            <div>mm/year</div>
                        </div>
                    </div>
                </div>
            `, {
                className: 'custom-popup',
                closeButton: true,
                autoClose: true,
                closeOnEscapeKey: true
            });
        
        const initialOpacity = getCircleOpacity(map);
        
        const sunshineCircle = L.circle([country.lat, country.lng], {
            color: getColor(country.sunshine, 'sunshine'),
            fillColor: getColor(country.sunshine, 'sunshine'),
            fillOpacity: initialOpacity,
            weight: 1,
            opacity: initialOpacity + 0.1,
            radius: getCircleRadius(map),
            interactive: true
        });
        
        const rainCircle = L.circle([country.lat, country.lng], {
            color: getColor(country.rain, 'rain'),
            fillColor: getColor(country.rain, 'rain'),
            fillOpacity: initialOpacity,
            weight: 1,
            opacity: initialOpacity + 0.1,
            radius: getCircleRadius(map),
            interactive: true
        });
        
        // Add click handlers
        marker.on('click', (e) => {
            e.originalEvent.preventDefault();
            showWeatherInfo(country.name, country);
        });

        sunshineCircle.on('click', (e) => {
            e.originalEvent.preventDefault();
            L.DomEvent.stopPropagation(e);
            showWeatherInfo(country.name, country);
            return false;
        });

        rainCircle.on('click', (e) => {
            e.originalEvent.preventDefault();
            L.DomEvent.stopPropagation(e);
            showWeatherInfo(country.name, country);
            return false;
        });
        
        // Add hover effects
        sunshineCircle.on('mouseover', (e) => {
            L.popup()
                .setLatLng(e.latlng)
                .setContent(`${country.name}<br>Sunshine: ${country.sunshine.toLocaleString()} hours/year`)
                .openOn(map);
        });

        rainCircle.on('mouseover', (e) => {
            L.popup()
                .setLatLng(e.latlng)
                .setContent(`${country.name}<br>Rain: ${country.rain} mm/year`)
                .openOn(map);
        });

        // Close popup on mouseout
        sunshineCircle.on('mouseout', () => map.closePopup());
        rainCircle.on('mouseout', () => map.closePopup());
        
        markers.set(country.name, marker);
        circles.set(country.name, {
            sunshine: sunshineCircle,
            rain: rainCircle
        });
    });
    
    // Show sunshine circles by default
    document.getElementById('sunshineToggle').checked = true;
    updateVisibility();
}

// Modify the updateVisibility function to handle initial state
function updateVisibility() {
    const showSunshine = document.getElementById('sunshineToggle').checked;
    const showRain = document.getElementById('rainToggle').checked;
    
    document.getElementById('sunshineScale').style.display = showSunshine ? 'block' : 'none';
    document.getElementById('rainScale').style.display = showRain ? 'block' : 'none';
    
    circles.forEach((cityCircles, city) => {
        // Always show markers
        markers.get(city).addTo(map);
        
        // Remove existing circles first
        map.removeLayer(cityCircles.sunshine);
        map.removeLayer(cityCircles.rain);
        
        // Add circles based on toggle state
        if (showSunshine) cityCircles.sunshine.addTo(map);
        if (showRain) cityCircles.rain.addTo(map);
    });
}

// Update the zoom handler to adjust both radius and opacity
map.on('zoomend', () => {
    const newRadius = getCircleRadius(map);
    const newOpacity = getCircleOpacity(map);
    
    circles.forEach((cityCircles) => {
        // Update sunshine circle
        cityCircles.sunshine.setRadius(newRadius);
        cityCircles.sunshine.setStyle({
            fillOpacity: newOpacity,
            opacity: newOpacity + 0.1
        });
        
        // Update rain circle
        cityCircles.rain.setRadius(newRadius);
        cityCircles.rain.setStyle({
            fillOpacity: newOpacity,
            opacity: newOpacity + 0.1
        });
    });
});

// Add hover effects to make circles more visible on mouseover
function addCircleHoverEffects() {
    circles.forEach((cityCircles) => {
        [cityCircles.sunshine, cityCircles.rain].forEach(circle => {
            circle.on('mouseover', function(e) {
                this.setStyle({
                    fillOpacity: 0.7,
                    opacity: 0.8
                });
                this.bringToFront();
            });
            
            circle.on('mouseout', function(e) {
                const currentOpacity = getCircleOpacity(map);
                this.setStyle({
                    fillOpacity: currentOpacity,
                    opacity: currentOpacity + 0.1
                });
            });
        });
    });
}

// Call this after initializing cities
initializeAllCountries();
addCircleHoverEffects();

function showWeatherInfo(countryName, data) {
    const weatherInfo = document.getElementById('weatherInfo');
    const cityNameEl = document.getElementById('cityName');
    const sunshineStatEl = document.getElementById('sunshineStat');
    const rainStatEl = document.getElementById('rainStat');
    
    // Update content
    cityNameEl.textContent = `${countryName} (${data.region})`;
    sunshineStatEl.textContent = `${data.sunshine.toLocaleString()} hours/year`;
    rainStatEl.textContent = `${data.rain} mm/year`;
    
    // Show the card
    weatherInfo.style.display = 'block';
}

function hideWeatherInfo() {
    document.getElementById('weatherInfo').style.display = 'none';
}

// Add map click handler to hide info when clicking elsewhere
map.on('click', (e) => {
    // Check if click was on a marker or circle
    if (!e.originalEvent.defaultPrevented) {
        hideWeatherInfo();
    }
}); 

// Add the missing updateSearchSuggestions function
function updateSearchSuggestions(suggestions) {
    const suggestionsDiv = document.getElementById('searchSuggestions');
    
    if (suggestions.length === 0) {
        suggestionsDiv.style.display = 'none';
        return;
    }

    suggestionsDiv.innerHTML = suggestions
        .map(suggestion => `<div class="search-suggestion">${suggestion}</div>`)
        .join('');
    
    suggestionsDiv.style.display = 'block';

    // Add click handlers to suggestions
    const suggestionElements = suggestionsDiv.getElementsByClassName('search-suggestion');
    Array.from(suggestionElements).forEach(element => {
        element.addEventListener('click', () => {
            document.getElementById('searchInput').value = element.textContent;
            suggestionsDiv.style.display = 'none';
            handleSearch();
        });
    });
}

// Add the missing handleSearch function
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const countryName = searchInput.value.split('(')[0].trim();
    const country = countryDataService.getCountry(countryName);
    
    if (country) {
        map.setView([country.lat, country.lng], 5);
        markers.get(countryName).openPopup();
        showWeatherInfo(countryName, country);
    } else {
        alert('Country not found. Please try another country name.');
    }
}

// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('#searchInput') && !e.target.closest('#searchSuggestions')) {
        document.getElementById('searchSuggestions').style.display = 'none';
    }
});

// Start the initialization at the end of the file
initializeData().catch(error => {
    console.error('Failed to initialize application:', error);
    alert('Failed to load the application. Please refresh the page.');
}); 