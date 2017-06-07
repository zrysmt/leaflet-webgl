import L from 'leaflet';
import { map } from './basemap.js';
// import tileLoader from '../common/libs/leaflet_tileLoader_mixin.js';
import canvasLayer from '../common/libs/leaflet_canvas_layer.js';

import pop2010 from '../data/pop2010.json';

class Canvas {
    init(pointNum) {
        this.pointNum = pointNum;

        this.pop2010();
    }
    pop2010() {
        var BigPointLayer = L.CanvasLayer.extend({
            renderCircle: function(ctx, point, radius) {
                ctx.fillStyle = 'rgba(255, 0, 0, 1)';
                ctx.strokeStyle = 'rgba(255, 0, 0, 1)';
                ctx.beginPath();
                ctx.arc(point.x, point.y, radius, 0, Math.PI * 2.0, true, true);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            },
            render: function() {
                var canvas = this.getCanvas();
                var ctx = canvas.getContext('2d');
                // clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                /********************************************************************/
                // console.log("绘制");222
                let data = pop2010[0][1];
                let pointNum = this.pointNum && this.pointNum < data.length ? this.pointNum : data.length;
                for (let i = 0; i < pointNum; i += 3) {
                    // get center from the map (projected)
                    var point = this._map.latLngToContainerPoint(new L.LatLng(+data[i], +data[i+1]));
                    // render
                    // this.renderCircle(ctx, point, (1.0 + Math.sin(Date.now() * 0.001)) * 300);//是动态的
                    this.renderCircle(ctx, point, 1);
                }
                /********************************************************************/
                this.redraw();
            }
        });
        var layer = new BigPointLayer({
            zIndex: 999 //高于map底图
        });
        layer.addTo(map);
    }
}

export default Canvas;
