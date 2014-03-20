---

---
function checkTeams(){
  // for loop to check which team this guy is a part of
    $.each(teams, function (i, team){
      $.get("https://api.github.com/teams/" + team.id + "/members/"+$.cookie('user').login+"?access_token="+$.cookie('token'), function(data, status){
        // if a part of county X, make X streets editable on the map for them.
        console.log(status + " for " + team.name)
        if (status === "success"){
          drawGeoJSON(team.name);
        }
      })
    })
    drawUab();
    drawCounties();
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
    
    var authUrl = dev ? 'http://localhost:9999' : 'http://gatekeeper-fc-review.herokuapp.com/'
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
    //   $.cookie('teams', data)
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
      $('#welcome-message').hide()
      $('#gh-login').removeClass('btn-danger').addClass('btn-success').text('Log in').attr('title', 'Log in with GitHub')
      // window.location = '{{ site.baseurl }}/'
      
    }

  })
var ePrev = null;
var click = false;
var map = L.map('map', {
    center: [33.77686437792359, -84.3145751953125],
    zoom: 9
});
// map.on('click', onMapClick);
var geojson;
var raw;
// var popup = new L.popup();
L.tileLayer('http://{s}.tile.cloudmade.com/{key}/22677/256/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2012 CloudMade',
		key: '7486205c8fd540b0903a0298b3d7c447'
	}).addTo(map);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        type = [3,
				4,
				5,
				6,
				7
				]
        

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
// function onMapClick(e) {
//       	 //map click event object (e) has latlng property which is a location at which the click occured.
//          popup
//            .setLatLng(e.latlng)
//            .setContent("You clicked the map at " + e.latlng.toString())
//            .openOn(map);
//       }
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
	if (type == 1){
		console.log("BIKE")
		return getColor("Bicycle")
	}
	else if (type == 1){
		console.log("SAFETY")
		return getColor("Safety")
	}
	else if (type == 1){
		console.log("TRANSIT")
		return getColor("Transit")
	}
	else if (type == 1){
		console.log("LMC")
		return getColor("Last Mile")
	}
	else if (type == 1){
		console.log("ROAD")
		return getColor("Roadway")
	}
	else{
		console.log(props)
		return getColor();
	}
}
function getColor(d) {
    return d === 3 ? "#ff0000" :
           d === 4  ? "#38a800" :
           d === 5   ? "#ab42e0" :
           d === 6  ? "#ffaa00" :
           d === 7  ? "#b2b2b2" :
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
							color: getColor(feature.properties.F_SYSTEM),
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

function drawUab(){
	$.ajax({
		type: "GET",
		url: "{{ site.baseurl}}/data/uab_2010.geojson", 
		dataType: "json",
		success: function(data){
			console.log(data)
			raw = data;
			geojson = L.geoJson(data, {
				// filter: function(feature, layer){
				// 	if (feature.properties.F_SYSTEM > 2 && feature.properties.F_SYSTEM < 7){
				// 		return true;
				// 	}
				// 	return false
				// },
				style: function (feature) {
					// var projType = feature.properties.PRJ_TYPE;
					// var description = feature.properties.PRJ_DESC;
					// console.log(feature.properties.PRJ_DESC+': '+feature.properties.PRJ_TYPE)
					if (feature.properties.NAME10 == "Atlanta, GA"){
						return {
							color: "#bbe3d4",
							weight: 0,
							// // dashArray: '3',
							fillOpacity: .5,
							clickable: false
						}
					}
					else if(feature.properties.ALAND10 > 254841000){
						return {
							color: "#fdcc8a",
							weight: 0,
							// // dashArray: '3',
							fillOpacity: .5,
							clickable: false
						}
					}
					else {
						return {
							color: "#ffbebe",
							weight: 0,
							// // dashArray: '3',
							fillOpacity: .5,
							clickable: false
						}
					}
					
				}
				// onEachFeature: onEachFeature,
				// pointToLayer: function (feature, latlng) {

				// }
			}).addTo(map);
		}
	})
}
function drawCounties(){
	$.ajax({
		type: "GET",
		url: "{{ site.baseurl}}/data/counties.geojson", 
		dataType: "json",
		success: function(data){
			console.log(data)
			raw = data;
			geojson = L.geoJson(data, {
				// filter: function(feature, layer){
				// 	if (feature.properties.F_SYSTEM > 2 && feature.properties.F_SYSTEM < 7){
				// 		return true;
				// 	}
				// 	return false
				// },
				style: function (feature) {
					// if (feature.properties.NAME10 == "Atlanta, GA"){
						return {
							color: "#aaa",
							weight: 1,
							fill: false,
							// // dashArray: '3',
							opacity: 1,
							clickable: false
						}
					// }
					
					
				}
				// onEachFeature: onEachFeature,
				// pointToLayer: function (feature, latlng) {

				// }
			}).addTo(map);
		}
	})
}