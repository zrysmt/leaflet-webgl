import L from 'leaflet';

let map = L.map('map',{
	crs:L.CRS.EPSG3857, //默认墨卡托投影 ESPG：3857
	minZoom:2,
	maxZoom:18,
	// crs:L.CRS.EPSG4326
}).setView([30, 20], 2); 

let osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
})
osm.addTo(map);

L.control.scale().addTo(map); //比例尺

export { map};
