---

---
var ePrev = null;
$(".alert").alert()
var previous = null;
var eHov = null;
var click = false;
var map = L.map('map', {
	center: [33.77686437792359, -84.3145751953125],
	zoom: 9
});
var changesMap = L.map('changes-map', {
	center: [33.77686437792359, -84.3145751953125],
	zoom: 9
});
var issueMap  = L.map('issue-map', {
		center: [33.77686437792359, -84.3145751953125],
		zoom: 9
	});

var issueBase = L.tileLayer('http://api.tiles.mapbox.com/v3/atlregional.i86o780c/{z}/{x}/{y}.png', {
		attribution: '© Mapbox © OpenStreetMap',
		key: '7486205c8fd540b0903a0298b3d7c447'
}).addTo(issueMap)
var changesBase = L.tileLayer('http://api.tiles.mapbox.com/v3/atlregional.i86o780c/{z}/{x}/{y}.png', {
		attribution: '© Mapbox © OpenStreetMap',
		key: '7486205c8fd540b0903a0298b3d7c447'
}).addTo(changesMap)
var issueData;
// map.on('click', onMapClick);
var geojson;
var geojsonChanges;

map.on("zoomend", function (e) { 
	console.log("ZOOMEND", e); 
	changesMap.setView(map.getCenter(), map.getZoom())
});
map.on("dragend", function (e) { console.log("ZOOMEND", e);
	changesMap.setView(map.getCenter(), map.getZoom())
 });

 changesMap.on("zoomend", function (e) { 
	console.log("ZOOMEND", e); 
	map.setView(changesMap.getCenter(), changesMap.getZoom())
});
changesMap.on("dragend", function (e) { console.log("ZOOMEND", e);
	map.setView(changesMap.getCenter(), changesMap.getZoom())
 });
map.on("zoomend", function (e) { console.log("ZOOMEND", e); });
map.on("dragstart", function (e) { console.log("ZOOMSTART", e); });

map.on("drag", function (e) { console.log("draggin", e); });
var raw = {};
// var popup = new L.popup();
var base = L.tileLayer('http://api.tiles.mapbox.com/v3/atlregional.i86o780c/{z}/{x}/{y}.png', {
		attribution: '© Mapbox © OpenStreetMap',
		key: '7486205c8fd540b0903a0298b3d7c447'
	}).addTo(map)

var streets = L.tileLayer('http://api.tiles.mapbox.com/v3/atlregional.i17fd2t9/{z}/{x}/{y}.png', {
		attribution: '© Atlanta Regional Commission',
		// key: '7486205c8fd540b0903a0298b3d7c447'
	})

var fringe = L.tileLayer('http://api.tiles.mapbox.com/v3/atlregional.o8rm5cdi/{z}/{x}/{y}.png', {
		attribution: '',
		// key: '7486205c8fd540b0903a0298b3d7c447'
	})
var streets2 = L.tileLayer('http://api.tiles.mapbox.com/v3/atlregional.i17fd2t9/{z}/{x}/{y}.png', {
		attribution: '© Atlanta Regional Commission',
		// key: '7486205c8fd540b0903a0298b3d7c447'
	})

var fringe2 = L.tileLayer('http://api.tiles.mapbox.com/v3/atlregional.o8rm5cdi/{z}/{x}/{y}.png', {
		attribution: '',
		// key: '7486205c8fd540b0903a0298b3d7c447'
	})
var streets3 = L.tileLayer('http://api.tiles.mapbox.com/v3/atlregional.i17fd2t9/{z}/{x}/{y}.png', {
		attribution: '© Atlanta Regional Commission',
		// key: '7486205c8fd540b0903a0298b3d7c447'
	})

var fringe3 = L.tileLayer('http://api.tiles.mapbox.com/v3/atlregional.o8rm5cdi/{z}/{x}/{y}.png', {
		attribution: '',
		// key: '7486205c8fd540b0903a0298b3d7c447'
	})
var proposed = L.tileLayer('http://api.tiles.mapbox.com/v3/landonreed.ge23ayvi/{z}/{x}/{y}.png', {
		attribution: '© GDOT',
		// key: '7486205c8fd540b0903a0298b3d7c447'
	})
var cities = L.tileLayer('http://api.tiles.mapbox.com/v3/atlregional.7gvw8kt9/{z}/{x}/{y}.png', {
		attribution: '',
		// key: '7486205c8fd540b0903a0298b3d7c447'
	})
var uab = L.tileLayer('http://api.tiles.mapbox.com/v3/atlregional.o3hj8aor/{z}/{x}/{y}.png', {
		attribution: '',
		// key: '7486205c8fd540b0903a0298b3d7c447'
	})
var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/API-key/{styleId}/256/{z}/{x}/{y}.png',
	cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';

var minimal   = L.tileLayer(cloudmadeUrl, {styleId: 22677, attribution: cloudmadeAttribution}),
	midnight  = L.tileLayer(cloudmadeUrl, {styleId: 999,   attribution: cloudmadeAttribution}),
	motorways = L.tileLayer(cloudmadeUrl, {styleId: 46561, attribution: cloudmadeAttribution});

var overlayMaps = {	
	"GDOT Proposed Changes": proposed,
	"Atlanta Region Roads": streets,
	"External County Roads": fringe,
	"City Boundaries": cities,
	"Urbanized Areas": uab
};
var changeOverlays = {
	"Atlanta Region Roads": streets2,
	"External County Roads": fringe2,
}
var issueOverlays = {
	"Atlanta Region Roads": streets3,
	"External County Roads": fringe3,
}
var baseMaps = {
	"Base map": base,
};
var baseMaps2 = {
	"Base map": changesBase,
};
var baseMaps3 = {
	"Base map": issueBase,
};
L.control.layers(baseMaps, overlayMaps, {position: 'topleft'}).addTo(map);
L.control.layers(baseMaps2, changeOverlays, {position: 'topleft'}).addTo(changesMap);
L.control.layers(baseMaps3, issueOverlays, {position: 'topright'}).addTo(issueMap);
map.on('overlayadd',function(e){
	if (e.name == "GDOT Proposed Changes"){
		$('.gdot').show()
	}
	console.log(e);
});
map.on('overlayremove',function(e){
	if (e.name == "GDOT Proposed Changes"){
		$('.gdot').hide()
	}
	console.log(e);
});
var legend = L.control({position: 'bottomright'});

var type = {
	"1": "Interstate",
	"2": "Freeway",
	"3": "Principal arterial",
	"4": "Minor arterial",
	"5": "Major Collector",
	"6": "Minor Collector",
	"7": "Local"
}
var teams = [
		{
		"name": "Barrow",
		"id": 738687,
		"slug": "barrow",
		"permission": "pull",
		"url": "https://api.github.com/teams/738687",
		"members_url": "https://api.github.com/teams/738687/members{/member}",
		"repositories_url": "https://api.github.com/teams/738687/repos"
		},
		{
		"name": "Bartow",
		"id": 738688,
		"slug": "bartow",
		"permission": "pull",
		"url": "https://api.github.com/teams/738688",
		"members_url": "https://api.github.com/teams/738688/members{/member}",
		"repositories_url": "https://api.github.com/teams/738688/repos"
		},
		{
		"name": "Carroll",
		"id": 807180,
		"slug": "carroll",
		"permission": "pull",
		"url": "https://api.github.com/teams/807180",
		"members_url": "https://api.github.com/teams/807180/members{/member}",
		"repositories_url": "https://api.github.com/teams/807180/repos"
		},
		{
		"name": "Cherokee",
		"id": 738689,
		"slug": "cherokee",
		"permission": "pull",
		"url": "https://api.github.com/teams/738689",
		"members_url": "https://api.github.com/teams/738689/members{/member}",
		"repositories_url": "https://api.github.com/teams/738689/repos"
		},
		{
		"name": "Clayton",
		"id": 738690,
		"slug": "clayton",
		"permission": "pull",
		"url": "https://api.github.com/teams/738690",
		"members_url": "https://api.github.com/teams/738690/members{/member}",
		"repositories_url": "https://api.github.com/teams/738690/repos"
		},
		{
		"name": "Cobb",
		"id": 738691,
		"slug": "cobb",
		"permission": "pull",
		"url": "https://api.github.com/teams/738691",
		"members_url": "https://api.github.com/teams/738691/members{/member}",
		"repositories_url": "https://api.github.com/teams/738691/repos"
		},
		{
		"name": "Coweta",
		"id": 738692,
		"slug": "coweta",
		"permission": "pull",
		"url": "https://api.github.com/teams/738692",
		"members_url": "https://api.github.com/teams/738692/members{/member}",
		"repositories_url": "https://api.github.com/teams/738692/repos"
		},
		{
		"name": "Dawson",
		"id": 807184,
		"slug": "dawson",
		"permission": "pull",
		"url": "https://api.github.com/teams/807184",
		"members_url": "https://api.github.com/teams/807184/members{/member}",
		"repositories_url": "https://api.github.com/teams/807184/repos"
		},
		{
		"name": "DeKalb",
		"id": 738693,
		"slug": "dekalb",
		"permission": "pull",
		"url": "https://api.github.com/teams/738693",
		"members_url": "https://api.github.com/teams/738693/members{/member}",
		"repositories_url": "https://api.github.com/teams/738693/repos"
		},
		{
		"name": "Douglas",
		"id": 738694,
		"slug": "douglas",
		"permission": "pull",
		"url": "https://api.github.com/teams/738694",
		"members_url": "https://api.github.com/teams/738694/members{/member}",
		"repositories_url": "https://api.github.com/teams/738694/repos"
		},
		{
		"name": "Fayette",
		"id": 738695,
		"slug": "fayette",
		"permission": "pull",
		"url": "https://api.github.com/teams/738695",
		"members_url": "https://api.github.com/teams/738695/members{/member}",
		"repositories_url": "https://api.github.com/teams/738695/repos"
		},
		{
		    "name": "FC Approval",
		    "id": 796559,
		    "slug": "fc-approval",
		    "permission": "push",
		    "url": "https://api.github.com/teams/796559",
		    "members_url": "https://api.github.com/teams/796559/members{/member}",
		    "repositories_url": "https://api.github.com/teams/796559/repos"
		  },
		{
		"name": "Forsyth",
		"id": 738696,
		"slug": "forsyth",
		"permission": "pull",
		"url": "https://api.github.com/teams/738696",
		"members_url": "https://api.github.com/teams/738696/members{/member}",
		"repositories_url": "https://api.github.com/teams/738696/repos"
		},
		{
		"name": "Fulton",
		"id": 738697,
		"slug": "fulton",
		"permission": "pull",
		"url": "https://api.github.com/teams/738697",
		"members_url": "https://api.github.com/teams/738697/members{/member}",
		"repositories_url": "https://api.github.com/teams/738697/repos"
		},
		{
		"name": "Gwinnett",
		"id": 738698,
		"slug": "gwinnett",
		"permission": "pull",
		"url": "https://api.github.com/teams/738698",
		"members_url": "https://api.github.com/teams/738698/members{/member}",
		"repositories_url": "https://api.github.com/teams/738698/repos"
		},
		{
		"name": "Hall",
		"id": 807182,
		"slug": "hall",
		"permission": "pull",
		"url": "https://api.github.com/teams/807182",
		"members_url": "https://api.github.com/teams/807182/members{/member}",
		"repositories_url": "https://api.github.com/teams/807182/repos"
		},
		{
		"name": "Henry",
		"id": 738700,
		"slug": "henry",
		"permission": "pull",
		"url": "https://api.github.com/teams/738700",
		"members_url": "https://api.github.com/teams/738700/members{/member}",
		"repositories_url": "https://api.github.com/teams/738700/repos"
		},
		{
		"name": "Newton",
		"id": 738701,
		"slug": "newton",
		"permission": "pull",
		"url": "https://api.github.com/teams/738701",
		"members_url": "https://api.github.com/teams/738701/members{/member}",
		"repositories_url": "https://api.github.com/teams/738701/repos"
		},
		{
		"name": "Paulding",
		"id": 738702,
		"slug": "paulding",
		"permission": "pull",
		"url": "https://api.github.com/teams/738702",
		"members_url": "https://api.github.com/teams/738702/members{/member}",
		"repositories_url": "https://api.github.com/teams/738702/repos"
		},
		{
		"name": "Rockdale",
		"id": 738703,
		"slug": "rockdale",
		"permission": "pull",
		"url": "https://api.github.com/teams/738703",
		"members_url": "https://api.github.com/teams/738703/members{/member}",
		"repositories_url": "https://api.github.com/teams/738703/repos"
		},
		{
		"name": "Spalding",
		"id": 738704,
		"slug": "spalding",
		"permission": "pull",
		"url": "https://api.github.com/teams/738704",
		"members_url": "https://api.github.com/teams/738704/members{/member}",
		"repositories_url": "https://api.github.com/teams/738704/repos"
		},
		{
		"name": "Walton",
		"id": 738705,
		"slug": "walton",
		"permission": "pull",
		"url": "https://api.github.com/teams/738705",
		"members_url": "https://api.github.com/teams/738705/members{/member}",
		"repositories_url": "https://api.github.com/teams/738705/repos"
		}
]
function checkTeams(){
	var membership = []
	if ($.cookie('user') == undefined || $.cookie('team') == undefined){
		console.log('let\'s go!')
		$.each(teams, function (i, team){
			$.get("https://api.github.com/teams/" + team.id + "/members/"+$.cookie('user').login+"?access_token="+$.cookie('token'), function(data, status){
				// if a part of county X, make X streets editable on the map for them.
				console.log(status + " for " + team.name)
				if (status === "success"){
					if (team.slug == "fc-approval"){
						$('.owner').show()
						$.cookie('owner', 1)
					}
					else{
						membership.push(team)
						$.cookie('team', membership)
						console.log(membership)
						drawGeoJSON(team.name, false, map);
						if ($('.county').is(':empty')){
							$('.county').append(team.name)
						}
						else{
							$('.county').append(' and ' + team.name)
						}
						$('.no-login').hide()
		 				$('.login').show()
					}
					
				}
			})
			console.log(i +" " + teams.length )
			if (i == teams.length - 1){
				 //  	drawUab();
				 console.log('last?')
		 		
			
			}
		})
	 }
	 else {
	 	if ($.cookie('owner') == 1){
	 		$('.owner').show()
	 	}	
	 	$.each($.cookie('team'), function (i, team){
	 		if ($('.county').is(':empty')){
				$('.county').append(team.name)
			}
			else{
				$('.county').append(' and ' + team.name)
			}
			drawGeoJSON(team.name, false, map);
			$('.no-login').hide()
	 		$('.login').show()
	 	})
	 	
	 }
	$('.user').text($.cookie('user').login)
}

$.cookie.json = true;

// Code to make the appropriate nav active
var nav = '{{ page.category }}'
if(nav != '')
	$('.' + nav ).addClass('active');

// Check if working on development server
var dev = false
if ('{{ site.baseurl }}' != '/fc-review')
dev = true;


var code = '';
if($.cookie('token') !== undefined){
	console.log("cookie worked!")
}
else
	console.log("cookie didn't work!")

var github;
if(window.location.href.split('?').length > 1){
code = window.location.href.match(/\?code=(.*)/)[1];
$('.btn').button()
$('#gh-login').button('loading')

var authUrl = dev ? 'http://localhost:9999' : 'http://gatekeeper-fc-review.herokuapp.com'
$.getJSON(authUrl + '/authenticate/'+code, function(data) {
	
 console.log(data.token);
 $.cookie('token', data.token);
 window.history.pushState("object or string", "Title", "{{ site.baseurl }}/")
 $.getJSON("https://api.github.com/user?access_token="+ data.token, function(data){
	
	$.cookie('user', data)
	$('#welcome-message').html('<a style="margin-right:5px;" href="'+$.cookie('user').html_url+'">'+$.cookie('user').login+'</a><a style="margin-right:5px;" href="'+$.cookie('user').html_url+'"><img width="34px" style="margin-right:5px;" height="34px" src="'+$.cookie('user').avatar_url+'"></a>').show()
	$('#gh-login').removeClass('btn-success').addClass('btn-danger').text('Log out').attr('title', 'Log out of Plan-It')
	console.log('showing username')
	$('#gh-login').button('reset').text('Log out')
	checkTeams()
	if($.cookie('return-href') !== undefined){
		window.location = $.cookie('return-href')
	}
 })


});
}

	github = new Github({
		token: $.cookie('token'),
		auth: "oauth"
	 })
	if ($.cookie('token') !== undefined){
	$('#welcome-message').html('<a style="margin-right:5px;" href="'+$.cookie('user').html_url+'">'+$.cookie('user').login+'</a><a style="margin-right:5px;" href="'+$.cookie('user').html_url+'"><img width="34px" style="margin-right:5px;" height="34px" src="'+$.cookie('user').avatar_url+'"></a>').show()
	$('#gh-login').removeClass('btn-success').addClass('btn-danger').text('Log out').attr('title', 'Log out of Plan-It')
	 // get list of teams
	// $.getJSON("https://api.github.com/orgs/atlregional/teams?access_token="+$.cookie('token'), function(data){
	//   // store teams object in a cookie? YES
	//   
	//   console.log(data)
	// })
	
	checkTeams()
	
	}


	$('#gh-view').click(function(){
	window.location='https://github.com/{{ site.githubuser }}/plan-it'
	})
	$('#gh-login').click(function(){
	if($(this).hasClass('btn-success')){
		// $.cookie('return-href', window.location.href)
		// setTimeout(function(){
		var client_id = dev ? '2bd555487ef16b607509' : 'b1de8b245dfd9b2cc62e'
		var params = '?response_type=code&client_id=' + client_id + '&scope=repo'
		window.location =  'https://github.com/login/oauth/authorize' + params 
		// }, 250)
		
	}
	else{
		window.location='{{ site.baseurl }}/'
		$.removeCookie('user', { path: '{{ site.baseurl }}' })
		$.removeCookie('token', { path: '{{ site.baseurl }}' })
		$.removeCookie('team', { path: '{{ site.baseurl }}' })
		$.removeCookie('owner', { path: '{{ site.baseurl }}' })

		$('#welcome-message').hide()
		$('#gh-login').removeClass('btn-danger').addClass('btn-success').text('Log in').attr('title', 'Log in with GitHub')
		// window.location = '{{ site.baseurl }}/'
		
	}

	})


legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend')

		

	// loop through our density intervals and generate a label with a colored square for each interval
	$.each(type, function(key,val){
		if (parseInt(key) < 8){
			div.innerHTML +=
				'<i style="background:' + getColor(parseInt(key)) + '"></i> ' +
				key + ' - ' + val + '<br>';
		}
	})
	div.innerHTML += '<span style="display:none;" class="gdot"><br><i style="background:rgb(0,197,255)"></i>4 to 3<br><i style="background:rgb(85,255,0)"></i>3 to 4</span>'

	return div;
};
new L.Control.GeoSearch({
	provider: new L.GeoSearch.Provider.OpenStreetMap(),
	position: 'bottomleft',
	showMarker: false
}).addTo(map);
legend.addTo(map);
// function onMapClick(e) {
//       	 //map click event object (e) has latlng property which is a location at which the click occured.
//          popup
//            .setLatLng(e.latlng)
//            .setContent("You clicked the map at " + e.latlng.toString())
//            .openOn(map);
//       }
var target = null;
var zoom = null;
function onEachFeature (feature, layer) {
	layer.bindLabel(feature.properties.RCLINK, {noHide:true});
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
	console.log(props)
	var vol12 = 'N/A'
	var vol11 = 'N/A'
	var vol10 = 'N/A'
	var volume = 'N/A'
	if (props){
		vol12 = props['2012AvAADT'] ? commaSeparateNumber(parseInt(props['2012AvAADT'])) : 'N/A'
		vol11 = props['2011AvAADT'] ? commaSeparateNumber(parseInt(props['2011AvAADT'])) : 'N/A'
		vol10 = props['2010AvAADT'] ? commaSeparateNumber(parseInt(props['2010AvAADT'])) : 'N/A' 
		if (vol12 !== 'N/A' && vol11 !== 'N/A' && vol10 !== 'N/A'){
			volume = '<br />' + '&lsquo;12: ' + vol12 + ' | &lsquo;11: ' + vol11 + ' | &lsquo;10: ' + vol10
		}
	}
	// checks if user is member of owners of app and if not, turns off add street button
	// also checks if segment already has an issue open... or something
	if (props && segments.length > 0 || $.cookie('owner') !== 1){
		disabled = 'disabled="disabled"'
	}
	this._div.innerHTML = '<h4>Functional Class Review</h4>' +  (props ?
		'ID #: ' + props.RCLINK + ' <button type="button" ' + disabled + ' data-value=\''+JSON.stringify(props)+'\' title="Add street segment to edits" class="btn btn-xs btn-success add-street" id="'+props.RCLINK+'"><span class="glyphicon glyphicon-plus-sign"></span></button><br />' +
		'County: ' + toTitleCase(props.County) + '<br />' +
		'Functional Class: ' + props.F_SYSTEM + ' - ' + type[String(props.F_SYSTEM)] + '<br />' +
		'Volume: ' + volume
		: 'Click a street segment');
};

info.addTo(map);

function getColor(d) {

		return d === 1 ? "#0070ff" :
			 d === 2 ? "#730000" :
			 d === 3 ? "#ff0000" :
			 d === 4  ? "#38a800" :
			 d === 5   ? "#ab42e0" :
			 d === 6  ? "#ffaa00" :
			 d === 7  ? "#666" :
					 "#000000" ;
	
}
function highlightFeature(e) {
	// if (ePrev && ePrev.target != e.target)
	// 	geojson.resetStyle(ePrev.target);
	console.log(e)
	if (e.target._map._container.id === "map"){
		console.log('test')
		target = e.target;
		if (zoom != null && zoom == target){
			return;
		}
		else{
			var layer = e.target;
			click = false;
			e.click = false
			layer.setStyle({
				weight: layer.options.weight,
				color: '#444',
				dashArray: '',
				opacity: 0.7
			});

			if (!L.Browser.ie && !L.Browser.opera) {
				layer.bringToFront();
			}
			eHov = e
			if (ePrev != null && eHov != null && eHov.target == ePrev.target){
				ePrev.click = false;
			}
			// info.update(layer.feature.properties);
		}	
	}
	
	
}
function resetHighlight(e) {
	if (e.target._map._container.id === "map"){
		if (zoom != null && zoom == target){
			return;
		}
		else{
			if (!click){
				geojson.resetStyle(e.target);
				
			}
			if (ePrev != null && eHov != null && !ePrev.click && !eHov.click){
				info.update();
			}
		}
	}
}
function zoomToFeature(e) {
	if (e.target._map._container.id === "map"){

		var layer = e.target;
		zoom = e.target;
		
		 if (confirmChanges(layer.feature.properties.RCLINK)){
		 	$('#home-tab').trigger('click');
			map.fitBounds(e.target.getBounds());
			console.log(ePrev)
			
			if (ePrev != null && ePrev.click){
				geojson.resetStyle(ePrev.target);
			}
			click = true;
			e.click = true;
			if (click){
				geojson.resetStyle(e.target);
				layer.setStyle({
					weight: '8',
					color: '#000',
					dashArray: '',
					opacity:.3
				});
			 }
		 }
		 
			
		
		 info.update(layer.feature.properties);
		 ePrev = e;
		 console.log(ePrev)
		 previous = layer.feature.properties;
		 console.log(previous)
	}
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
	
})

function drawGeoJSON(county, changes, drawMap){
	$.ajax({
			type: "GET",
			url: "{{ site.baseurl}}/data/"+county+".geojson", 
			dataType: "json",
			success: function(data){
				console.log(data)
				raw[county] = data;
				console.log(raw[county])
				console.log(county)
				if (!changes){
					geojson = L.geoJson(data, {
						filter: function(feature, layer){
							if (feature.properties.F_SYSTEM > 2){  // && feature.properties.F_SYSTEM < 7){
									return true;
							}
							return false
						},
						style: function (feature) {
							return {
								color: getColor(feature.properties.F_SYSTEM),
								weight: 16/(feature.properties.F_SYSTEM+1),
								// dashArray: '3',
								opacity: .5
							}
							
						},
						onEachFeature: onEachFeature,
						pointToLayer: function (feature, latlng) {

						}
					}).addTo(map);
				}
				else if (changes){
					geojsonChanges = L.geoJson(data, {
						filter: function(feature, layer){
							if (typeof feature.properties.FC_NEW !== 'undefined' && feature.properties.status === $('#changes-map-select option:selected').text()){  // && feature.properties.F_SYSTEM < 7){
									console.log(feature.properties);
									return true
							}
							return false
						},
						style: function (feature) {
							return {
								color: getColor(feature.properties.FC_NEW),
								weight: 16/(feature.properties.F_SYSTEM+1),
								// dashArray: '3',
								opacity: .5
							}
							
						},
						onEachFeature: function(feature, layer) {
								if (feature.properties) {
									popupContent = "<table>"
									$.each(feature.properties, function(key, value){
										if (key === "NAME" || key === "County" || key === "FC_NEW" || key === "F_SYSTEM" || key === "user"){
											if (key === "FC_NEW")
												key = "Proposed FC"
											else if (key === "F_SYSTEM")
												key = "Existing FC"

											popupContent += "<tr><td><strong>" + key + "</strong></td>" + "<td>" + value + "</td></tr>"
										}
									})
									popupContent += "</table>"
								}
								layer.bindPopup(popupContent, null, {maxHeight: 80});
						},
						pointToLayer: function (feature, latlng) {

						}
					}).addTo(changesMap);
				}
			}
		})
}

function issuePopup(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.RCLINK) {
        layer.bindPopup(feature.properties.RCLINK);
    }
}
function drawIssueData(data, issueMap, linkdata){
	var issueBounds = null;
	issueData = L.geoJson(data, {
		style: function (feature) {
			if (feature.properties.RCLINK == linkdata[1] && feature.properties.BEG_MEASUR == linkdata[2] && feature.properties.END_MEASUR == linkdata[3]){
				var polyline = [];
				$.each(feature.geometry.coordinates, function(i, coord){
					var latlng = L.latLng(coord[1], coord[0]);
					polyline.push(latlng);
				});
				var poly = L.polyline(polyline);
				var featureGroup = L.featureGroup([poly])
				console.log(feature)
				issueBounds = featureGroup.getBounds();
				console.log(issueBounds);
			}
			var color = (feature.properties.RCLINK == linkdata[1] && feature.properties.BEG_MEASUR == linkdata[2] && feature.properties.END_MEASUR == linkdata[3]) ? '#00FF00' : '#CCC'
				return {
					color: color,
					weight: 16/(feature.properties.F_SYSTEM+1),
					fill: false,
					fillColor: color,
					opacity: .5,
					fillOpacity:0,
					clickable: false
				}

		},
		onEachFeature: function (feature, layer) {
	         layer.bindPopup(feature.properties.RCLINK);
	     }

	}).addTo(issueMap);
	issueMap.fitBounds(issueBounds)
}
function clearMap(m) {
    for(i in m._layers) {
        if(m._layers[i]._path != undefined) {
            try {
                m.removeLayer(m._layers[i]);
            }
            catch(e) {
                console.log("problem with " + e + m._layers[i]);
            }
        }
    }
}
function drawChanges(){
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
	console.log('drawing changes')
	$.each(counties, function(i, county){
		drawGeoJSON(county, true, changesMap)	
	})

}


	
