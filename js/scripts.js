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
    }
    else if(unit == 'jenks') {
        return  d == 0 ? '#a50026' :
        d == 1  ? '#d73027' :
        d == 2  ? '#f46d43' :
        d == 3  ? '#fdae61' :
        d == 4  ? '#fee08b' :
        d == 5  ? '#d9ef8b' :
        d == 6  ? '#a6d96a' :
        d == 7  ? '#66bd63' :
        d == 8  ? '#1a9850' :
        d == 9 ? '#006837' :
        //if none
        '#FFFFFF'; 
    } 
    else
     {
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
    } 
    else if (unitOfDisplay == 'jenks') {
        if (currentMap == 'Education') {var propReset = layer.feature.properties.MNI_j}
        if (currentMap == 'Inmigration') {var propReset = layer.feature.properties.P05_j}
        if (currentMap == 'Celular') {var propReset = layer.feature.properties.H2819C_j}
        if (currentMap == 'Computer') {var propReset = layer.feature.properties.H2819B_j}
        if (currentMap == 'Empty') {var propReset = layer.feature.properties.V02_j}
        if (currentMap == 'Owner') {var propReset = layer.feature.properties.PROP_j}
        if (currentMap == 'Rent') {var propReset = layer.feature.properties.INQ_j}
        if (currentMap == 'Regular') {var propReset = layer.feature.properties.TENREG_j}
    }
    else {
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
    var variableText, percent,quantile,jenk
    if(props){
        if (currentMap == 'Education') {
            variableText = 'Head of household with college education (%)';
            percent = props.MNI_p;
            quantile = props.MNI_q;
            jenk = props.MNI_j;
        }
        else if (currentMap == 'Inmigration') {
            variableText = 'Head of household borned in another country (%)';
            percent = props.P05_p;
            quantile = props.P05_q;
            jenk = props.P05_j;
        }
        else if (currentMap == 'Celular') {
            variableText = 'Household with mobile phone (%)';
            percent = props.H2819C_p;
            quantile = props.H2819C_q;
            jenk = props.H2819C_j;
        }
        else if (currentMap == 'Computer') {
            variableText = 'Household with a computer (%)';
            percent = props.H2819B_p;
            quantile = props.H2819B_q;
            jenk = props.H2819B_j;
        }
        else if (currentMap == 'Empty') {
            variableText = 'Empty dwellings (%)';
            percent = props.V02_p;
            quantile = props.V02_q;
            jenk = props.V02_j;
        }
        else if (currentMap == 'Owner') {
            variableText = 'Owners (%)';
            percent = props.PROP_p;
            quantile = props.PROP_q;
            jenk = props.PROP_j;
        }
        else if (currentMap == 'Rent') {
            variableText = 'Tennants (%)';
            percent = props.INQ_p;
            quantile = props.INQ_q;
            jenk = props.INQ_j;
        }
        else if (currentMap == 'Regular') {
            variableText = 'Legally occupied household (%)';
            percent = props.TENREG_p;
            quantile = props.TENREG_q;
            jenk = props.TENREG_j;
        }

        this._div.innerHTML = '<h4>Census Block Information</h4>' + 
        '<b> Block ID: </b>' + props.REDCODE + '<br />' +
        '<b> Department: </b>' + props.DEPTO_NAME + '<br />' + 
        '<b>' + variableText + ': </b>' + percent + '<br />'  +
        '<b> Quantile: </b>' + quantile  + '<br />' +
        '<b> Jenks Natural Breaks: </b>' + jenk  + '<br />'
    } else {
        this._div.innerHTML = '<h4>Census Block Information</h4>' + 'Hover over a block'
    }

};


//LEGENDS

    //quantile
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

    //jenks
var legendJenks = L.control({position: 'bottomright'});

legendJenks.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend jenks'),
        grades = [0, 1, 2, 3, 4, 5, 6, 7,8,9],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i],'jenks') + '"></i> ' +
            grades[i] + ' J <br />';
    }

    return div;
};

    //percent
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
legendJenks.addTo(map);

info.addTo(map);





//LISTENERS

        //NAV BAAR BUTTONS


$("#list-btn").click(function() {
  animateSidebar();
  return false;
});


$("#maximizeButton").click(function() {
    map.setView(new L.LatLng(-34.652889, -58.442420), 10);
});
$("#caba").click(function() {
    map.setView(new L.LatLng(-34.602889, -58.442420), 13);
});

$("#almiranteBrown").click(function() {
    // 'ALMIRANTE BROWN':'06028',
    zoomToDepto(0)
});
$("#avellaneda").click(function() {
    // 'AVELLANEDA':'06035',
    zoomToDepto(1)
});
$("#berazategui").click(function() {
    // 'BERAZATEGUI':'06091',
    zoomToDepto(2)
});
$("#escobar").click(function() {
    // 'ESCOBAR':'06252',
    zoomToDepto(3)
});
$("#estebanEcheverria").click(function() {
    // 'ESTEBAN ECHEVERRIA':'06260',
    zoomToDepto(4)
});
$("#ezeiza").click(function() {
    // 'EZEIZA':'06270',
    zoomToDepto(5)
});
$("#florencioVarela").click(function() {
    // 'FLORENCIO VARELA':'06274',
    zoomToDepto(6)
});
$("#generalRodriguez").click(function() {
    // 'GENERAL RODRIGUEZ':'06364',
    zoomToDepto(7)
});
$("#generalSanMartin").click(function() {
    // 'GENERAL SAN MARTIN':'06371',
    zoomToDepto(8)
});
$("#hurlingham").click(function() {
    // 'HURLINGHAM':'06408',
    zoomToDepto(9)
});
$("#ituzaingo").click(function() {
    // 'ITUZAINGO':'06410',
    zoomToDepto(10)
});
$("#joseCPaz").click(function() {
    // 'JOSE C PAZ':'06412',
    zoomToDepto(11)
});
$("#laMatanza").click(function() {
    // 'LA MATANZA':'06427',
    zoomToDepto(12)
});
$("#lanus").click(function() {
    // 'LANUS':'06434',
    zoomToDepto(13)
});
$("#lomasDeZamora").click(function() {
    // 'LOMAS DE ZAMORA':'06490',
    zoomToDepto(14)
});
$("#malvinasArgentinas").click(function() {
    // 'MALVINAS ARGENTINAS':'06515',
    zoomToDepto(15)
});
$("#marcosPaz").click(function() {
    // 'MARCOS PAZ':'06525',
    zoomToDepto(16)
});
$("#merlo").click(function() {
    // 'MERLO':'06539',
    zoomToDepto(17)
});
$("#moreno").click(function() {
    // 'MORENO':'06560',
    zoomToDepto(18)
});
$("#moron").click(function() {
    // 'MORON':'06568',
    zoomToDepto(19)
});
$("#pilar").click(function() {
    // 'PILAR':'06638',
    zoomToDepto(20)
});
$("#presidentePeron").click(function() {
    // 'PRESIDENTE PERON':'06648',
    zoomToDepto(21)
});
$("#quilmes").click(function() {
    // 'QUILMES':'06658',
    zoomToDepto(22)
});
$("#sanFernando").click(function() {
    // 'SAN FERNANDO':'06749',
    zoomToDepto(23)
});
$("#sanIsidro").click(function() {
    // 'SAN ISIDRO':'06756',
    zoomToDepto(24)
});
$("#sanMiguel").click(function() {
    // 'SAN MIGUEL':'06760',
    zoomToDepto(25)
});
$("#sanVicente").click(function() {
    // 'SAN VICENTE':'06778',
    zoomToDepto(26)
});
$("#tigre").click(function() {
    // 'TIGRE':'06805',
    zoomToDepto(27)
});

$("#tresDeFebrero").click(function() {
    // 'TRES DE FEBRERO':'06840',
    zoomToDepto(28)
});
$("#vicenteLopex").click(function() {
    // 'VICENTE LOPEZ':'06861'
    zoomToDepto(29)
});




        //VARIABLE BUTTONS

$("#percentButton").click(function() {
    unitOfDisplay = 'percent'

    $('.percent').css('display','initial');
    $('.quantile').css('display','none');
    $('.jenks').css('display','none');

    $('#percentButton').css('background','#8c6bb1');
    $('#percentButton').css('color','white');

    $('#quantileButton').css('background','initial');
    $('#quantileButton').css('color','initial');

    $('#jenksButton').css('background','initial');
    $('#jenksButton').css('color','initial');

});

$("#quantileButton").click(function() {
    unitOfDisplay = 'quantile';

    $('.percent').css('display','none');
    $('.quantile').css('display','initial');
    $('.jenks').css('display','none');

    $('#quantileButton').css('background','#d6604d');
    $('#quantileButton').css('color','white');

    $('#percentButton').css('background','initial');
    $('#percentButton').css('color','initial');

    $('#jenksButton').css('background','initial');
    $('#jenksButton').css('color','initial');


});

$("#jenksButton").click(function() {
    unitOfDisplay = 'jenks';

    $('.percent').css('display','none');
    $('.quantile').css('display','none');
    $('.jenks').css('display','initial');

    $('#quantileButton').css('background','initial');
    $('#quantileButton').css('color','initial');

    $('#percentButton').css('background','initial');
    $('#percentButton').css('color','initial');

    $('#jenksButton').css('background','#006837');
    $('#jenksButton').css('color','white');

});

//BUTTON BEHAVIOUR

$('#buttonEduc').on('click', function(){
    currentMap = 'Education';
    if (unitOfDisplay == 'percent') {
        geojson.eachLayer(function (layer) {
            layer.setStyle(style(layer.feature,layer.feature.properties.MNI_p,unitOfDisplay));
        });
    } 
    else if (unitOfDisplay == 'jenks') {
        geojson.eachLayer(function (layer) {
            layer.setStyle(style(layer.feature,layer.feature.properties.MNI_j,unitOfDisplay));
        });
    }

    else {
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
    } 

    else if (unitOfDisplay == 'jenks') {
        geojson.eachLayer(function (layer) {
            layer.setStyle(style(layer.feature,layer.feature.properties.P05_j,unitOfDisplay));
        });
    }
    else {
        geojson.eachLayer(function (layer) {
            layer.setStyle(style(layer.feature,layer.feature.properties.P05_q,unitOfDisplay));
        });
    }
});


$('#buttonCel').on('click', function(){
    //set the current visualization we are dealing with
    currentMap = 'Celular'; 

    if (unitOfDisplay == 'percent') {
        geojson.eachLayer(function (layer) {
            layer.setStyle(style(layer.feature,layer.feature.properties.H2819C_p,unitOfDisplay));
        });
    } 

    else if (unitOfDisplay == 'jenks') {
        geojson.eachLayer(function (layer) {
            layer.setStyle(style(layer.feature,layer.feature.properties.H2819C_j,unitOfDisplay));
        });
    }
    else {
        geojson.eachLayer(function (layer) {
            layer.setStyle(style(layer.feature,layer.feature.properties.H2819C_q,unitOfDisplay));
        });
    }

});

$('#buttonComp').on('click', function(){
    //set the current visualization we are dealing with
    currentMap = 'Computer'; 

    if (unitOfDisplay == 'percent') {
        geojson.eachLayer(function (layer) {
            layer.setStyle(style(layer.feature,layer.feature.properties.H2819B_p,unitOfDisplay));
        });
    } 

    else if (unitOfDisplay == 'jenks') {
        geojson.eachLayer(function (layer) {
            layer.setStyle(style(layer.feature,layer.feature.properties.H2819B_j,unitOfDisplay));
        });
    }
    else {
        geojson.eachLayer(function (layer) {
            layer.setStyle(style(layer.feature,layer.feature.properties.H2819B_q,unitOfDisplay));
        });
    }

});



$('#buttonEmpty').on('click', function(){
    //set the current visualization we are dealing with
    currentMap = 'Empty'; 

    if (unitOfDisplay == 'percent') {
        geojson.eachLayer(function (layer) {
            layer.setStyle(style(layer.feature,layer.feature.properties.V02_p,unitOfDisplay));
        });
    } 

    else if (unitOfDisplay == 'jenks') {
        geojson.eachLayer(function (layer) {
            layer.setStyle(style(layer.feature,layer.feature.properties.V02_j,unitOfDisplay));
        });
    }

    else {
        geojson.eachLayer(function (layer) {
            layer.setStyle(style(layer.feature,layer.feature.properties.V02_q,unitOfDisplay));
        });
    }

});

$('#buttonOwner').on('click', function(){
    //set the current visualization we are dealing with
    currentMap = 'Owner'; 


    if (unitOfDisplay == 'percent') {
        geojson.eachLayer(function (layer) {
            layer.setStyle(style(layer.feature,layer.feature.properties.PROP_p,unitOfDisplay));
        });
    } 

    else if (unitOfDisplay == 'jenks') {
        geojson.eachLayer(function (layer) {
            layer.setStyle(style(layer.feature,layer.feature.properties.PROP_j,unitOfDisplay));
        });
    }
    else {
        geojson.eachLayer(function (layer) {
            layer.setStyle(style(layer.feature,layer.feature.properties.PROP_q,unitOfDisplay));
        });
    }

});

$('#buttonRent').on('click', function(){
    //set the current visualization we are dealing with
    currentMap = 'Rent'; 

    if (unitOfDisplay == 'percent') {
        geojson.eachLayer(function (layer) {
            layer.setStyle(style(layer.feature,layer.feature.properties.INQ_p,unitOfDisplay));
        });
    } 

    else if (unitOfDisplay == 'jenks') {
        geojson.eachLayer(function (layer) {
            layer.setStyle(style(layer.feature,layer.feature.properties.INQ_j,unitOfDisplay));
        });
    }
    else {
        geojson.eachLayer(function (layer) {
            layer.setStyle(style(layer.feature,layer.feature.properties.INQ_q,unitOfDisplay));
        });
    }
});

$('#buttonRegular').on('click', function(){
    //set the current visualization we are dealing with
    currentMap = 'Regular'; 

    if (unitOfDisplay == 'percent') {
        geojson.eachLayer(function (layer) {
            layer.setStyle(style(layer.feature,layer.feature.properties.TENREG_p,unitOfDisplay));
        });
    } 

    else if (unitOfDisplay == 'jenks') {
        geojson.eachLayer(function (layer) {
            layer.setStyle(style(layer.feature,layer.feature.properties.TENREG_j,unitOfDisplay));
        });
    }
    else {
        geojson.eachLayer(function (layer) {
            layer.setStyle(style(layer.feature,layer.feature.properties.TENREG_q,unitOfDisplay));
        });
    }
});

