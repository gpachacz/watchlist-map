// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto */

var map = L.map('map').setView([7.318882, 30.421143], 6);

// Add base layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(map);

// Initialize Carto
var client = new carto.Client({
  apiKey: 'apikey',
  username: 'gpachacz'
});

// Initialze source data
// map original 
//var source = new carto.source.Dataset('s_sudan_incident_reports_updated');

var source = new carto.source.SQL("SELECT * FROM s_sudan_incident_reports_updated");

// Create style for the data
var style = new carto.style.CartoCSS(`
  #layer {
  marker-width: 8;
  marker-fill: #d58831;
  marker-fill-opacity: 0.9;
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
`);

// Add style to the data
var layer = new carto.layer.Layer(source, style);

// Add the data to the map as a layer
client.addLayer(layer);
client.getLeafletLayer().addTo(map);


//ADDING BUTTONS


// Step 1: Find the button by its class. If you are using a different class, change this.
var gregButton = document.querySelector('.greg-button');
var adiButton = document.querySelector('.adi-button');

// Step 2: Add an event listener to the button. We will run some code whenever the button is clicked.
gregButton.addEventListener('click', function (e) {
  source.setQuery("SELECT * FROM s_sudan_incident_reports_updated WHERE team_member = 'Greg'");
})
adiButton.addEventListener('click', function (e) {
  source.setQuery("SELECT * FROM s_sudan_incident_reports_updated WHERE team_member = 'Adi'");
  
  // Sometimes it helps to log messages, here we log to let us know the button was clicked. You can see this if you open developer tools and look at the console.
  console.log('Greg was clicked');
});

//ADDING POPUPS

// Note: any column you want to show up in the popup needs to be in the list of
// featureClickColumns below
var layer = new carto.layer.Layer(source, style, {
  featureClickColumns: ['report_no', 'notes', 'report_link']
});


//ADDING CHECKBOXES


// Step 1: Find the checkbox by class. If you are using a different class, change this.
//var element = document.querySelector('.juvenile-checkbox');

// Step 2: Add an event listener to the checkbox. We will run some code whenever the button is clicked.
//element.addEventListener('change', function (e) {
  // Sometimes it helps to log messages, here we log to let us know the button was clicked. You can see this if you open developer tools and look at the console.
 // console.log('Juvenile was clicked', e.target.checked);
  
  //if (e.target.checked) {
    //source.setQuery("SELECT * FROM hms_efh_2009tiger_shark WHERE life_stage = 'Juvenile'");
  //}
  //else {
    //source.setQuery("SELECT * FROM hms_efh_2009tiger_shark");
  //}
//});


//ADDING TEXT INPUTS


// Step 1: Find the search input by class. If you are using a different class, change this.
//var element = document.querySelector('.name-search');

// Step 2: Add an event listener to the input. We will run some code whenever the text changes.
//element.addEventListener('keyup', function (e) {
  // The value of the input is in e.target.value when it changes
  //var searchText = e.target.value;
  
  // Step 3: Decide on the SQL query to use and set it on the datasource
  //if (searchText === '') {
    // If the search text is empty, then we show all of the features, unfiltered
    //source.setQuery("SELECT * FROM airbnb_listings");
  //}
  //else {
    // Else use the search text in an SQL query that will filter to names with that text in it
    //source.setQuery("SELECT * FROM airbnb_listings WHERE host_name ILIKE '%" + searchText + "%'");
  //}
  
  // Sometimes it helps to log messages, here we log the search text. You can see this if you open developer tools and look at the console.
  //console.log('Input changed to "' + searchText + '"');
//});


//ADDING SHAPES (CIRCLES, POLYGONS, ETC.)


// var circle = L.circle([9.535749, 31.644745], {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 50000
// }).addTo(map);


//ADDING POPUPS


var popup = L.popup();
layer.on('featureClicked', function (event) { 
  // Create the HTML that will go in the popup. event.data has all the data for 
  // the clicked feature.

    
  //
  // I will add the content line-by-line here to make it a little easier to read.
  var content = '<h1>' + event.data['report_no'] + '</h1>'
  //content += '<div>$' + event.data['report_link']

  content += '<a href="' + event.data['report_link'] + '"target="_blank">click for incident report</a>';
  content += '<h2>' + event.data['notes'] + '</h2>'
  
  popup.setContent(content);
  
  // Place the popup and open it
  popup.setLatLng(event.latLng);
  popup.openOn(map);
});

// Add the data to the map as a layer
client.addLayer(layer);
client.getLeafletLayer().addTo(map);


//ADDING DROPDOWNS


// Step 1: Find the dropdown by class. If you are using a different class, change this.
var layerPicker = document.querySelector('.layer-picker');

// Step 2: Add an event listener to the dropdown. We will run some code whenever the dropdown changes.
layerPicker.addEventListener('change', function (e) {
  // The value of the dropdown is in e.target.value when it changes
  var precision = e.target.value;
  
  // Step 3: Decide on the SQL query to use and set it on the datasource
  if (precision === 'all') {
    // If the value is "all" then we show all of the features, unfiltered
    source.setQuery("SELECT * FROM s_sudan_incident_reports_updated");
  }
  else {
    // Else the value must be set to a life stage. Use it in an SQL query that will filter to that life stage.
    source.setQuery("SELECT * FROM s_sudan_incident_reports_updated WHERE precision = '" + precision + "'");
  }
  
  // Sometimes it helps to log messages, here we log the lifestage. You can see this if you open developer tools and look at the console.
  console.log('Dropdown changed to "' + precision + '"');
});