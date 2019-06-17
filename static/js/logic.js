var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

d3.json(url, function(data){
  createFeatures(data.features);
  console.log(data.features)
});

function createFeatures(earthquakeData){
    function onEachFeature (feature, layer) {
      layer.bindPopup(feature.properties.place + "<hr>" + 
      new Date(feature.properties.time));
}

    function markerSize(magnitude) {
      return magnitude * 2;
    }
    function chooseColor(magnitude) {
      if (magnitude > 6){ 
        return "#b10026"
      } 
      else if (magnitude > 5){
        return "#fc4e2a"
      }
      else if (magnitude > 4){
        return "#fd8d3c"
      }
      else if (magnitude > 3){
        return "#feb24c"
      }
      else if (magnitude > 2){
        return "#fed976"
      }
      else if (magnitude > 1){
        return "#ffeda0"
      }else{
        return "#ffffcc"
      
      }
    } 
  
    var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function(earthquakeData, latlng) {
        return  L.circleMarker(latlng, { 
          radius: markerSize(earthquakeData.properties.mag),
          fillColor: chooseColor(earthquakeData.properties.mag),
          fillOpacity: 1,
          color: chooseColor(earthquakeData.properties.mag),
          weight: 1
          
      });
    },
    onEachFeature: onEachFeature
  });

  createMap(earthquakes);
}

function createMap(earthquakes){

// Adding tile layer
  var streetsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var grayscalemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var baseMaps = {
    'Grayscale': grayscalemap,
    'Street': streetsmap
  };

  var overlapMaps = {
    Earthquakes: earthquakes
  };

  // Creating map object
var map = L.map("map", {
  center: [40, -100],
  zoom: 4,
  layers: [grayscalemap, earthquakes]
  
});

L.control.layers(baseMaps, overlapMaps, {
  collapsed: true
}).addTo(map);

function getColor(m) {
  return m > 6 ? '#b10026':
         m > 5 ? '#fc4e2a':
         m > 4 ? '#fd8d3c':
         m > 3 ? '#feb24c':
         m > 2 ? '#fed976':
         m > 1 ? '#ffeda0':
                  '#ffffcc';
};

var legend = L.control({position: "bottomleft"});
legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "info legend");
  grades = [0, 1, 2, 3, 4, 5, 6];
  labels = [];

  
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(grades[i] + 1) + '"></i>' +
      grades[i] + (grades[i+1] ? '&ndash;' + grades[i+1] + '<br>' : '+');
    
  }

  return div;
};

legend.addTo(map);
}

























