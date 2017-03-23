var geojson;
var currentMap = 'Empty'; 

//Coropleth function
function getColor(d) {
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

//Style function that takes the Coropleth 
function style(feature,propiedad) {
    return {
        fillColor: getColor(propiedad),//takes the property of the feature as parameter
        weight: .5,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

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

    //if for the property that we wan to reset
    if (currentMap == 'Education') {var propReset = layer.feature.properties.P19_q}
    if (currentMap == 'Inmigration') {var propReset = layer.feature.properties.P05_q}
    if (currentMap == 'Celular') {var propReset = layer.feature.properties.H2819C_q}
    if (currentMap == 'Computer') {var propReset = layer.feature.properties.H2819B_q}
    if (currentMap == 'Empty') {var propReset = layer.feature.properties.V02_q}
    if (currentMap == 'Owner') {var propReset = layer.feature.properties.PROP_q}
    if (currentMap == 'Rent') {var propReset = layer.feature.properties.INQ_q}
    if (currentMap == 'Regular') {var propReset = layer.feature.properties.TENREG_q}


    layer.setStyle(style(layer.feature,propReset));
    info.update();
}

//Zoom on click
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}


function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

//data box
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Census Block Information</h4>' +  (props ?
        '<b> Block ID: </b>' + props.REDCODE + '<br />' + 
        '<b> Comune: </b>' + props.Comune + '<br />' + 
        '<b> % of Head of household with college education: </b>' + props.P19_p  + '<br />' +
        '<b> Quantile: </b>' + props.P19_q  + '<br />'
        : 'Hover over a state');

    //FALTA PONER IN IF ACA PAR DAR METRICAS DIFERENTES PARA CADA currentMap, SI ES empty NADA DE LO ABAJO
};


//legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5, 6, 7,8,9],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '"></i> ' +
            grades[i] + ' Quintile <br />';
    }

    return div;
};


// create map
geojson = L.geoJson(tablaDeDatos,{
    style: style,
    onEachFeature: onEachFeature
})
geojson.addTo(map);
info.addTo(map);
legend.addTo(map);


//listener with property of the feature as a parameter

$('#buttonEduc').on('click', function(){
    currentMap = 'Education';

    geojson.eachLayer(function (layer) {
       layer.setStyle(style(layer.feature,layer.feature.properties.P19_q));
       //console.log(layer.feature.properties.Comune)  
    });
});


$('#buttonInmigration').on('click', function(){
    //set the current visualization we are dealing with
    currentMap = 'Inmigration'; 

    geojson.eachLayer(function (layer) {
       layer.setStyle(style(layer.feature,layer.feature.properties.P05_q));
       
       //console.log(layer.feature.properties.Comune)  
    });
});


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
