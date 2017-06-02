import L from 'leaflet';
import { map } from './basemap.js';
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
                ctx.fillStyle = 'rgba(255, 60, 60, 0.2)';
                ctx.strokeStyle = 'rgba(255, 60, 60, 0.9)';
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
                // get center from the map (projected)
                var point = this._map.latLngToContainerPoint(new L.LatLng(0, 0));
                // render
                this.renderCircle(ctx, point, (1.0 + Math.sin(Date.now() * 0.001)) * 300);
                this.redraw();
            }
        });
        var layer = new BigPointLayer();
        layer.addTo(map);
    }
}

export default Canvas;
