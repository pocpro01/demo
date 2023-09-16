/******************************/
/********CORE JS FILE*********/
/****************************/
  //Init BaseMaps
  var OSMBase = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a>'
  });
  var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });
  var CyclOSM = L.tileLayer('https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  var googleHybrid = L.tileLayer('http://{s}.google.cn/maps/vt?lyrs=y@189&gl=en&x={x}&y={y}&z={z}', {
    maxZoom: 22,
    subdomains:['mt0','mt1','mt2','mt3','www'],
    attribution: 'google hybrid view'
  });
  var GoogleSat = L.tileLayer('http://{s}.google.cn/maps/vt?lyrs=s@189&gl=en&x={x}&y={y}&z={z}', {
    maxZoom: 22,
    subdomains:['mt0','mt1','mt2','mt3','www'],
    attribution: 'google satelite view'
  });
  var GoogleRoadmapAlt = L.tileLayer('http://{s}.google.cn/maps/vt?lyrs=r@189&gl=en&x={x}&y={y}&z={z}', {
    maxZoom: 22,
    subdomains:['mt0','mt1','mt2','mt3','www'],
    attribution: 'google roadmap view'
  });

var ESRIImagery = L.tileLayer('https://{s}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    minZoom: 1,
    maxZoom: 19,
    subdomains: ['server', 'services']
  });


//loading dist overlay file 
var assam_js = $.ajax({
  url: "assets/assam.geojson",
  dataType: "json",
  success: console.log("assam boundary loaded"),
  error: function(xhr) {
    alert(xhr.statusText)
  }
});

//loading parcel data
var proto_js = $.ajax({
  url: "assets/proto.geojson",
  dataType: "json",
  success: console.log("parcel data loaded"),
  error: function(xhr) {
    alert(xhr.statusText)
  }
});

//load resources then proceed
$.when(assam_js, proto_js).done(function() {


  //Map Options
  var mapOptions = {
    zoomControl: false,
    attributionControl: false,
    center: [25.745477067368604, 91.3568115234375],
    zoom: 8,
    layers: [OSMBase]
  };

  //Render Main Map
  var map = L.map("map", mapOptions);

  //Render scale information
  L.control.scale({
    metric: true,
    position: "bottomright"
  }).addTo(map);

  //Render Zoom Control
  L.control
  .zoom({
    position: "topright"
  }).addTo(map);

  //sidebar initialize
  var sidebar = L.control
  .sidebar({
    autopan: false,
    container: "sidebar",
    position: "left"
  }).addTo(map);

  //sidebar open - deafult tab open
  sidebar.open("home");


  //Init Overlays & add state boundary overlay
  var assam_bound = L.geoJSON(assam_js.responseJSON, {
    fillOpacity: 0.1,
    color: '#0352fc',
    weight: 4.0
  }).addTo(map);

  //parcel data load here
  var parcel_bound = L.geoJSON(proto_js.responseJSON,{
    
    onEachFeature: function(feature, featureLayer) {
      featureLayer.on('click', function(e) {

        sidebar.open("summary");

        $("#oname").html("Name: " + feature.properties.Name + "<br/>");
        $("#odist").html("District: " + feature.properties.District + "<br/>");
        $("#oblock").html("Block: " + feature.properties.Block + "<br/>");
        $("#ovill").html("Village: " + feature.properties.Village + "<br/>");
        $("#ocode").html("Code: " + feature.properties.Code + "<br/>");
        $("#olndhld").html("Landhold: " + feature.properties.Landhold + "<br/>");
        $("#osoil").html("Soil: " + feature.properties.Soiltype + "<br/>");
        $("#oscrop").html("Single Crop: " + feature.properties.Single_c + "<br/>");
        $("#omcrop").html("Multi Crop: " + feature.properties.Multi_c + "<br/>");
        $("#oyld").html("Yield(tnn): " + feature.properties.Yieldtnn + "<br/>");
      })
      
    },
    fillOpacity: 0.1,
    color: '#fc4c3f',
    weight: 2.0
  });

  var overlays = {
    "Assam Boundary": assam_bound,
  };
  
  var baseMaps = {
    "OSM": OSMBase,
    "OSM Terrain": OpenTopoMap,
    "OSM CyclOSM": CyclOSM,

    "ESRI Imagery": ESRIImagery,
    
    "Google Road": GoogleRoadmapAlt,
    "Google Hybrid": googleHybrid,
    "Google SAT": GoogleSat,
  };

  var baseTree = {
    label: ' Base Layers',
    children: [
    {
      label: ' OSM Maps',
      children: [
        { label: ' OpenStreetMap', layer: OSMBase },
        { label: ' OSM Terrain', layer: OpenTopoMap },
        { label: ' OSM CyclOSM', layer: CyclOSM },
        ]
    },
    {
      label: ' ESRI Layers',
      children: [
        {
          [ { label: 'ESRI Imagery', layer: ESRIImagery } ]
        },
      ]
    },
    /*{
      label: 'Google Maps',
      children: [
        { label: ' Google Road', layer: GoogleRoadmapAlt },
        { label: ' Google Satellite', layer: GoogleSat },
        { label: ' Google Hybrid', layer: googleHybrid},
        ]
    },*/
    ]
  };


  var overlaysTree = {
    label: ' Overlays',
      /*selectAllCheckbox: 'Un/select all',*/
    children: [
    {
      label: ' Administrative Boundary',
      selectAllCheckbox: true,
      children: [
        { label: ' State Boundary', layer: assam_bound },
        ]
    },
    {
      label: ' Data Layer',
      selectAllCheckbox: true,
      children: [
        { label: ' Parcel', layer: parcel_bound },
        ]
    }
    ]
  }


  //fit map AOI to region of interest
  //map.fitBounds(parcel_bound.getBounds());

  //on map load using timeout to flyto AOI
  setTimeout(function(){

      //remove assam boundary from map
      assam_bound.remove();

      //flyto AOI
      map.flyTo([25.82057977068155, 93.64484310150148], 17, {
                  animate: true,
                  duration: 3 // in seconds
              });

  }, 2000);

  //post map load and removing assam bound load parcel bound
  setTimeout(function(){

      //AOI:parcel data added to map
      parcel_bound.addTo(map);
    
  }, 2000);


  //layer control config
  var layerControl = L.control
  .layers.tree(baseTree, overlaysTree, {
    namedToggle: true,
    selectorBack: false,
    closedSymbol: '&#8862; &#x1f5c0;',
    openedSymbol: '&#8863; &#x1f5c1;',
    collapseAll: 'Collapse all',
    expandAll: 'Expand all',
    collapsed: false
  }).addTo(map);

  //layer control transfer from old to new container
  var oldLayerControl = layerControl.getContainer();
  var newLayerControl = $("#layercontrol");
  newLayerControl.append(oldLayerControl);
  $(".leaflet-control-layers-list").prepend("<strong class='title'>Base Maps</strong><br>");
  $(".leaflet-control-layers-separator").after("<br><strong class='title'>Layers</strong>");

  //Handle Map click to Display Lat/Lng
  map.on('click', function(e) {
    $("#latlng").html(e.latlng.lat + ", " + e.latlng.lng);
    $("#latlng").show();
  });

  //Handle Copy Lat/Lng to clipboard
  $('#latlng').click(function(e) {
    var $tempElement = $("<input>");
    $("body").append($tempElement);
    $tempElement.val($("#latlng").text()).select();
    document.execCommand("Copy");
    $tempElement.remove();
    alert("Copied: "+$("#latlng").text());
    $("#latlng").hide();
  });

  //Map Frame calculation
  var calculateLayout = function (e) {
    var map = $('#map'),
    sidebar = $('#sidebar'),
    //sideTitle = $('.sidebar-title'),
    //sideContent = $('.sidebar-content'),
    win = $(window),
    header = $('header'),
    footer = $('footer');

    map.height( win.height() - header.height() - footer.height() );
    sidebar.height( win.height() - header.height() - footer.height() - 20);
    //sideContent.height( win.height() - sideContent.offset().top - 100 );
  };

  var resetLayout = _.debounce( calculateLayout,250 ); // Maximum run of once per 1/4 second for performance


  $(document).ready(function () {

    resetLayout();

  });

  // Resize the map based on window and sidebar size
  $(window).resize(resetLayout);

});
