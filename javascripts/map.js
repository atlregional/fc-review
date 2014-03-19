---

---
var ePrev = null;
var click = false;
var map = L.map('map', {
    center: [33.77686437792359, -84.3145751953125],
    zoom: 9
});
map.on('click', onMapClick);
var geojson;
var raw;
var popup = new L.popup();
L.tileLayer('http://{s}.tile.cloudmade.com/{key}/22677/256/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2012 CloudMade',
		key: '7486205c8fd540b0903a0298b3d7c447'
	}).addTo(map);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        type = ["Bicycle",
				"Safety",
				"Transit",
				"Last Mile",
				"Roadway",
				"Other"]
        

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < type.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(type[i]) + '"></i> ' +
            type[i] + '<br>';
    }

    return div;
};
new L.Control.GeoSearch({
    provider: new L.GeoSearch.Provider.OpenStreetMap(),
    position: 'bottomleft',
    showMarker: false
}).addTo(map);
legend.addTo(map);
function onMapClick(e) {
      	 //map click event object (e) has latlng property which is a location at which the click occured.
         popup
           .setLatLng(e.latlng)
           .setContent("You clicked the map at " + e.latlng.toString())
           .openOn(map);
      }
function onEachFeature (feature, layer) {
	layer.bindLabel(feature.properties.RCLINK, {noHide:true});
	// layer.bindPopup('<button type="button" title="Add street segment to edits" class="btn btn-xs btn-success add-street" id="'+feature.properties.RCLINK+'"><span class="glyphicon glyphicon-plus-sign"></span></button>');
	layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
	var disabled = ''
	if (props && $.inArray(props.RCLINK, segments) == 0)
		disabled = 'disabled="disabled"'
    this._div.innerHTML = '<h4>Functional Class Review</h4>' +  (props ?
        'RCLINK: ' + props.RCLINK + ' <button type="button" ' + disabled + ' title="Add street segment to edits" class="btn btn-xs btn-success add-street" id="'+props.RCLINK+'"><span class="glyphicon glyphicon-plus-sign"></span></button><br />' +
        'County: ' + toTitleCase(props.County) + '<br />' +
        'Functional Class: ' + props.F_SYSTEM + ''
        : 'Hover over a street segment');
};

info.addTo(map);
function lineColor(props) {
	var type = props.PRJ_TYPE;
	var desc = props.PRJ_DESC;
	if (/bicycle/i.test(type) || /bicycle/i.test(desc)){
		console.log("BIKE")
		return getColor("Bicycle")
	}
	else if (/safety/i.test(type) ){
		console.log("SAFETY")
		return getColor("Safety")
	}
	else if (/transit/i.test(type)){
		console.log("TRANSIT")
		return getColor("Transit")
	}
	else if (/last mile connectivity/i.test(type)){
		console.log("LMC")
		return getColor("Last Mile")
	}
	else if (/roadway/i.test(type)){
		console.log("ROAD")
		return getColor("Roadway")
	}
	else{
		console.log(props)
		return getColor();
	}
}
function getColor(d) {
    return d === "Bicycle" ? "#ff0000" :
           d === "Safety"  ? "#fcb90f" :
           d === "Transit"   ? "#0f23ff" :
           d === "Last Mile"  ? "#00ffff" :
           d === "Roadway"  ? "#b90ffc" :
                     "#000000" ;
}
function highlightFeature(e) {
	// if (ePrev && ePrev.target != e.target)
	// 	geojson.resetStyle(ePrev.target);
	console.log(e)
    var layer = e.target;
    click = false;
    layer.setStyle({
        weight: layer.options.weight,
        color: '#666',
        dashArray: '',
        opacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
    // info.update(layer.feature.properties);
}
function resetHighlight(e) {
	if (!click){
    	geojson.resetStyle(e.target);
    	// info.update();
	}
    
    
}
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
    var layer = e.target;
    if (click)
    	geojson.resetStyle(ePrev.target);
    click = true;
    if (click){
    	geojson.resetStyle(e.target);
	    layer.setStyle({
	        weight: layer.options.weight,
	        color: '#000',
	        dashArray: '',
	        opacity:1
	    });
	 }
	 info.update(layer.feature.properties);
	 ePrev = e;
}
$(document).ready(function() {
	var counties = [
		"Barrow",
		"Bartow",
		"Cherokee",
		"Clayton",
		"Cobb",
		"Coweta",
		"DeKalb",
		"Douglas",
		"Fayette",
		"Forsyth",
		"Fulton",
		"Gwinnett",
		"Henry",
		"Newton",
		"Paulding",
		"Rockdale",
		"Spalding",
		"Walton"
	];
	// $.each(counties, function(i, county){
	// 	drawGeoJSON(county)
		
	// })
	
})

function drawGeoJSON(county){
	$.ajax({
			type: "GET",
			url: "{{ site.baseurl}}/data/"+county+".geojson", 
			dataType: "json",
			success: function(data){
				console.log(data)
				raw = data;
				geojson = L.geoJson(data, {
					filter: function(feature, layer){
						if (feature.properties.F_SYSTEM > 2 && feature.properties.F_SYSTEM < 7){
							return true;
						}
						return false
					},
					style: function (feature) {
						// var projType = feature.properties.PRJ_TYPE;
						// var description = feature.properties.PRJ_DESC;
						// console.log(feature.properties.PRJ_DESC+': '+feature.properties.PRJ_TYPE)
						return {
							color: "#E6324B",
							weight: 16/(feature.properties.F_SYSTEM+1),
							// dashArray: '3',
							opacity: 9/(feature.properties.F_SYSTEM*feature.properties.F_SYSTEM)
						}
						
					},
					onEachFeature: onEachFeature,
					pointToLayer: function (feature, latlng) {

					}
				}).addTo(map);
			}
		})
}