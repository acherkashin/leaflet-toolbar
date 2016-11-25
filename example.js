var mymap = L.map('mapid').setView([51.505, -0.09], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(mymap);

const btns = L.functionButtons([{
    title: 'Показать/скрыть панель условных знаков',
    classes: 'glyphicon glyphicon-map-marker'
}, {
    title: 'Включить/выключить режим показа информации о стране/регионе',
    classes: 'glyphicon glyphicon-info-sign'
}, {
    title: 'Включить/выключить режим показа информации о стране/регионе',
    classes: 'glyphicon glyphicon-zoom-out'
}, {
    classes: 'glyphicon glyphicon-zoom-in',
    title: 'Уменьшить масштаб'

}], {
        position: 'topleft',
        template: {
            tag: 'button',
            classes: 'btn btn-default tool-bar-item'
        },
        orientation: 'column' //column or row
    });

btns.on('clicked', (data) => {

});

mymap.addControl(btns);