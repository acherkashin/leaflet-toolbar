var mymap = L.map('mapid', {
    zoomControl: false
}).setView([51.505, -0.09], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets',

}).addTo(mymap);

const zoomButtons = [{
    title: 'Zoom out',
    classes: 'glyphicon glyphicon-zoom-out',
    callback: () => {
        console.log('zoom-out');
    }
}, {
    title: 'Zoom in',
    classes: 'glyphicon glyphicon-zoom-in',
    callback: () => {
        console.log('zoom-in');
    }
}];

const groupButtons = [{
    title: 'Example-1',
    classes: 'glyphicon glyphicon-map-marker',
    callback: () => {
        console.log('map-marker');
    }
}, {
    title: 'Example-2',
    classes: 'glyphicon glyphicon-info-sign',
    callback: () => {
        console.log('glyphicon-info-sign');
    }
}];

const btns = L.Toolbar([zoomButtons, groupButtons], {
    position: 'topleft',
    template: {
        tag: 'button',
        classes: 'btn btn-default tool-bar-item'
    },
    orientation: 'column', //column or row
    toolbarTemplate: {
        classes: 'leaflet-toolbar'
    },
    groupTemplate: {
        classes: 'leaflet-toolbar-group'
    }
});

btns.on('clicked', (data) => {

});

mymap.addControl(btns);