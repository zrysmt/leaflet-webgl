import L from 'leaflet';
import { map } from './basemap.js';
import WebGLTileLayer from '../common/Leaflet.WebGL/src/L.WebGL.js';
// import WebGLTileLayer from '../common/leaflet_webgl/L.WebGL.js';

import pop2010 from '../data/pop2010.json';

class WebGL{
	init(pointNum) {
        this.pointNum = pointNum;

        this.pop2010();
    }
    pop2010() {
        let data = pop2010[0][1];
        let pointNum = this.pointNum && this.pointNum < data.length ? this.pointNum : data.length;
		let res = [];
        for (var i = 0; i < pointNum; i+=3) {
        	let latlng = {};
        	latlng.x = data[i];
        	latlng.y = data[i+1];
        	// latlng = lonLat2WebMercator(latlng);
        	latlng.value= data[i+2];
        	res.push(latlng);
        }
		// console.log(res);         

       /* let res = {};
        res.latlng = [];
        res.value = [];
        for (var i = 0; i < pointNum; i++) {
        	if(i%3 == 2){
        		res.value.push(data[i]);
        	}else{
        		res.latlng.push(data[i]);
        	}
        	
        }*/
        //目前仅仅考虑点  //精度，纬度，值
        //形式是
        //{
        //	latlng:[]//经纬度
        //	value:[]  //值
        //}
        let webGLLayer = new L.TileLayer.WebGL({
        	data:res
        });
    	map.addLayer(webGLLayer);
	}
}
/**
 * [lonLat2WebMercator 经纬度转为墨卡托投影]
 * @param  {[type]} lonLat [description]
 * @return {[type]}        [description]
 */
function lonLat2WebMercator(lonLat){
    var mercator = {};
    var x = lonLat.x *20037508.34/180;
    var y = Math.log(Math.tan((90+lonLat.y)*Math.PI/360))/(Math.PI/180);
    y = y *20037508.34/180;
    mercator.x = x;
    mercator.y = y;
    return mercator ;
}
export default WebGL;