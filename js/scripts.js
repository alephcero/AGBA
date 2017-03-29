var geojson;
var deptos;
var currentMap;     //variable to choose wich variable to show
var unitOfDisplay; //varible to choose wether to show in percent or quantiles

//FUNCTIONS
//Coropleth function

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function() {
    map.invalidateSize();
  });
}


//STYLES FOR FEATURES
function getColor(d,unit) {
    if (unit == 'percent') {
        return  d >= 90 ? '#4d004b' :
        d >= 80  ? '#810f7c' :
        d >= 70  ? '#88419d' :
        d >= 60  ? '#8c6bb1' :
        d >= 50  ? '#8c96c6' :
        d >= 40  ? '#9ebcda' :
        d >= 30  ? '#bfd3e6' :
        d >= 20  ? '#e0ecf4' :
        d >= 10  ? '#f7fcfd' :
        //if none
        '#FFFFFF';
    } else {
        return  d == 0 ? '#67001f' :
        d == 1  ? '#b2182b' :
        d == 2  ? '#d6604d' :
        d == 3  ? '#f4a582' :
        d == 4  ? '#fddbc7' :
        d == 5  ? '#d1e5f0' :
        d == 6  ? '#92c5de' :
        d == 7  ? '#4393c3' :
        d == 8  ? '#2166ac' :
        d == 9 ? '#053061' :
        //if none
        '#FFFFFF'; 
    }

}

//Style function that takes the Coropleth 
function style(feature,propiedad,unit) {
    return {
        fillColor: getColor(propiedad,unit),//takes the property of the feature as parameter
        weight: .5,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

var styleDeptos = {
    "color": "#000000",
    "fill": "false",
    "opacity": 1,
    'fillOpacity':0,
    "clickable": "false",

};


//Highlight on over
function highlightFeature(e) {
    var layer = e.target;
    
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 1
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    var layer = e.target;

    //if for the property en unit of display that we wan to reset

    if (unitOfDisplay == 'percent') {
        if (currentMap == 'Education') {var propReset = layer.feature.properties.MNI_p}
        if (currentMap == 'Inmigration') {var propReset = layer.feature.properties.P05_p}
        if (currentMap == 'Celular') {var propReset = layer.feature.properties.H2819C_p}
        if (currentMap == 'Computer') {var propReset = layer.feature.properties.H2819B_p}
        if (currentMap == 'Empty') {var propReset = layer.feature.properties.V02_p}
        if (currentMap == 'Owner') {var propReset = layer.feature.properties.PROP_p}
        if (currentMap == 'Rent') {var propReset = layer.feature.properties.INQ_p}
        if (currentMap == 'Regular') {var propReset = layer.feature.properties.TENREG_p}
    } else {
        if (currentMap == 'Education') {var propReset = layer.feature.properties.MNI_q}
        if (currentMap == 'Inmigration') {var propReset = layer.feature.properties.P05_q}
        if (currentMap == 'Celular') {var propReset = layer.feature.properties.H2819C_q}
        if (currentMap == 'Computer') {var propReset = layer.feature.properties.H2819B_q}
        if (currentMap == 'Empty') {var propReset = layer.feature.properties.V02_q}
        if (currentMap == 'Owner') {var propReset = layer.feature.properties.PROP_q}
        if (currentMap == 'Rent') {var propReset = layer.feature.properties.INQ_q}
        if (currentMap == 'Regular') {var propReset = layer.feature.properties.TENREG_q}
    }
    

    layer.setStyle(style(layer.feature, propReset, unitOfDisplay));
    info.update();
}

//Zoom on click
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function zoomToDepto(deptoID) {
    map.setView(new L.LatLng(deptosCentroids.features[deptoID].geometry.coordinates[1],deptosCentroids.features[deptoID].geometry.coordinates[0]), 14);    
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}


//BOX FOR DATA
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    var variableText, percent,quantile
    if(props){
        if (currentMap == 'Education') {
            variableText = 'Head of household with college education (%)';
            percent = props.MNI_p;
            quantile = props.MNI_q;
        }
        if (currentMap == 'Inmigration') {
            variableText = 'Head of household borned in another country (%)';
            percent = props.P05_p;
            quantile = props.P05_q;
        } 
        this._div.innerHTML = '<h4>Census Block Information</h4>' + 
        '<b> Block ID: </b>' + props.REDCODE + '<br />' +
        '<b> Comune: </b>' + props.Comune + '<br />' + 
        '<b>' + variableText + ': </b>' + percent + '<br />'  +
        '<b> Quantile: </b>' + quantile  + '<br />'
        
    } else {
        this._div.innerHTML = '<h4>Census Block Information</h4>' + 'Hover over a block'
    }

};


//legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend quantile'),
        grades = [0, 1, 2, 3, 4, 5, 6, 7,8,9],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '"></i> ' +
            grades[i] + ' Q <br />';
    }

    return div;
};

var legendPercent = L.control({position: 'bottomright'});

legendPercent.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend percent'),
        grades = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i],'percent') + '"></i> ' +
            grades[i] + ' % <br />';
    }

    return div;
};




// MAPS CREATION
geojson = L.geoJson(tablaDeDatos,{
    style: style,
    onEachFeature: onEachFeature
})

//Comunes in blacklines
deptos = L.geoJson(deptosGeoJSON,{
    style: styleDeptos,
})

deptos.addTo(map);
geojson.addTo(map);

legend.addTo(map);
legendPercent.addTo(map);

info.addTo(map);





//LISTENERS

        //NAV BAAR BUTTONS


$("#list-btn").click(function() {
  animateSidebar();
  return false;
});


$("#maximizeButton").click(function() {
    map.setView(new L.LatLng(-34.602889, -58.442420), 12);
});
$("#comune1-button").click(function() {
    zoomToDepto(0)
});
$("#comune2-button").click(function() {
    zoomToDepto(1)
});






        //VARIABLE BUTTONS

$("#percentButton").click(function() {
    unitOfDisplay = 'percent'
    $('.percent').css('display','initial');
    
    $('#percentButton').css('background','#8c6bb1');
    $('#percentButton').css('color','white');

    $('#quantileButton').css('background','initial');
    $('#quantileButton').css('color','initial');


    $('.quantile').css('display','none');
});

$("#quantileButton").click(function() {
    unitOfDisplay = 'quantile';
    $('.percent').css('display','none');
    $('#quantileButton').css('background','#d6604d');
    $('#quantileButton').css('color','white');

    $('#percentButton').css('background','initial');
    $('#percentButton').css('color','initial');


    $('.quantile').css('display','initial');
});

        //flip
$("#card").flip({
  axis: 'x',
  trigger: 'hover'
});


$('#buttonEduc').on('click', function(){
    currentMap = 'Education';
    if (unitOfDisplay == 'percent') {
        geojson.eachLayer(function (layer) {
            layer.setStyle(style(layer.feature,layer.feature.properties.MNI_p,unitOfDisplay));
        });
    } else {
        geojson.eachLayer(function (layer) {
            layer.setStyle(style(layer.feature,layer.feature.properties.MNI_q,unitOfDisplay));
        });
    }
});


$('#buttonInmigration').on('click', function(){
    //set the current visualization we are dealing with
    currentMap = 'Inmigration'; 
    if (unitOfDisplay == 'percent') {
        geojson.eachLayer(function (layer) {
            layer.setStyle(style(layer.feature,layer.feature.properties.P05_p,unitOfDisplay));
        });
    } else {
        geojson.eachLayer(function (layer) {
            layer.setStyle(style(layer.feature,layer.feature.properties.P05_q,unitOfDisplay));
        });
    }
});


//I HAVE TO CHANGE THE REST OF THE BUTTONS TO USE PERCENT

$('#buttonCel').on('click', function(){
    //set the current visualization we are dealing with
    currentMap = 'Celular'; 

    geojson.eachLayer(function (layer) {
       layer.setStyle(style(layer.feature,layer.feature.properties.H2819C_q));
       
       //console.log(layer.feature.properties.Comune)  
    });
});

$('#buttonComp').on('click', function(){
    //set the current visualization we are dealing with
    currentMap = 'Computer'; 

    geojson.eachLayer(function (layer) {
       layer.setStyle(style(layer.feature,layer.feature.properties.H2819B_q));
       
       //console.log(layer.feature.properties.Comune)  
    });
});

$('#buttonEmpty').on('click', function(){
    //set the current visualization we are dealing with
    currentMap = 'Empty'; 

    geojson.eachLayer(function (layer) {
       layer.setStyle(style(layer.feature,layer.feature.properties.V02_q));
       
       //console.log(layer.feature.properties.Comune)  
    });
});

$('#buttonOwner').on('click', function(){
    //set the current visualization we are dealing with
    currentMap = 'Owner'; 

    geojson.eachLayer(function (layer) {
       layer.setStyle(style(layer.feature,layer.feature.properties.PROP_q));
       
       //console.log(layer.feature.properties.Comune)  
    });
});

$('#buttonRent').on('click', function(){
    //set the current visualization we are dealing with
    currentMap = 'Rent'; 

    geojson.eachLayer(function (layer) {
       layer.setStyle(style(layer.feature,layer.feature.properties.INQ_q));
       
       //console.log(layer.feature.properties.Comune)  
    });
});

$('#buttonRegular').on('click', function(){
    //set the current visualization we are dealing with
    currentMap = 'Regular'; 

    geojson.eachLayer(function (layer) {
       layer.setStyle(style(layer.feature,layer.feature.properties.TENREG_q));
       
       //console.log(layer.feature.properties.Comune)  
    });
});

