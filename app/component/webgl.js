import L from 'leaflet';
import { map } from './basemap.js';

import pop2010 from '../data/pop2010.json';

class WebGL{
	init(pointNum) {
        this.pointNum = pointNum;

        this.pop2010();
    }
    pop2010() {
        let data = pop2010[0][1];
        let markers = [];
        let pointNum = this.pointNum && this.pointNum < data.length ? this.pointNum : data.length;
        
	}
}


export default WebGL;