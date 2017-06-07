import L from 'leaflet';
import * as d3 from 'd3';
import D3SvgOverlay from '../common/libs/L.D3SvgOverlay';
import { map } from './basemap.js';
import pop2010 from '../data/pop2010.json';

class Svgs {
    init(pointNum) {
        this.pointNum = pointNum;

        this.pop2010();
    }
    pop2010() {
        let data = pop2010[0][1];
        let markers = [];
        let pointNum = this.pointNum && this.pointNum < data.length ? this.pointNum : data.length;
        let cities = [];
        // console.log("pointNum:",pointNum);
        for (let i = 0; i < pointNum; i += 3) {
            let obj = {};
            obj.latLng = [+data[i], +data[i+1]];
            //人口是data[2]
            obj.population = +data[i+2];
            cities.push(obj);
        }

        // console.log("cities:",cities);
        let citiesOverlay = L.d3SvgOverlay(function(sel, proj) {

            let minLogPop = Math.log2(d3.min(cities, function(d) {
                return d.population;
            }));
            let citiesUpd = sel.selectAll('circle').data(cities);
            citiesUpd.enter()
                .append('circle')
                .attr('r', function(d) {
                    // return Math.log2(d.population) - minLogPop + 2;
                    return 1;
                })
                .attr('cx', function(d) {
                    return proj.latLngToLayerPoint(d.latLng).x;
                })
                .attr('cy', function(d) {
                    return proj.latLngToLayerPoint(d.latLng).y;
                })
                .attr('stroke', '#ff0000')
                .attr('stroke-width', 1)
                .attr('fill','#44a3e5');
                /*.attr('fill', function(d) {
                    return (d.place == 'city') ? "red" : "blue";
                });*/
            
        });

        citiesOverlay.addTo(map);
    }
}

export default Svgs;
