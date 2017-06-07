import L from 'leaflet';
import { map } from './basemap.js';

// import data from '../data/film-locations-2016.json';
import pop2010 from '../data/pop2010.json';

class Icons {
    init(pointNum) {
    	this.pointNum = pointNum;
        // this.filmLocation();
        this.pop2010();
    }
    filmLocation() {
        // console.log(data);
        console.time('icons')
        let markers = [];
        let pointNum = this.pointNum && this.pointNum < data.length? this.pointNum : data.length;
        let myIcon = L.icon({
            iconUrl: '/app/common/imgs/p-blue-32.png',
            iconSize: [10, 10],
            // iconAnchor: [22, 94]
        });
        for (let i = 0; i < pointNum; i++) {
            // L.marker(item.coordinates).addTo(map);  //直接添加

            markers.push(L.marker(data[i].coordinates, { icon: myIcon }));
        }

        L.layerGroup(markers).addTo(map);
        console.timeEnd('icons')
    }
    pop2010() {
    	let data = pop2010[0][1];
        let markers = [];
        let pointNum = this.pointNum && this.pointNum < data.length? this.pointNum : data.length;

        let myIcon = L.icon({
            iconUrl: '/app/common/imgs/p-red-32.png',
            iconSize: [10, 10],
            // iconAnchor: [22, 94]
        });
        for (let i = 0; i < pointNum; i+=3) {
            // L.marker(item.coordinates).addTo(map);  //直接添加

            markers.push(L.marker([data[i],data[i+1]],{ icon: myIcon }));
            //人口是data[2]
        }

        L.layerGroup(markers).addTo(map);
    }
}

export default Icons;
