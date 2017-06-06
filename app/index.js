import {map} from './component/basemap.js';
import Icons from './component/icons.js';
import Svgs from './component/svgs.js';
import Canvas from './component/canvas.js';
import WebGL from './component/webgl.js';
import Stats from 'stats.js';  

let pointNum = 0;//渲染多少点 0表示全部渲染

window.addEventListener("load",hashManager);
window.addEventListener("hashchange",hashManager);

function hashManager(){
	console.log(window.location.hash.slice(1));
	switch(window.location.hash.slice(1)) {
		case "imgs":
			let icons = new Icons();
			icons.init(pointNum);
			break;
		case "svgs":
			let svgs = new Svgs();
			svgs.init(pointNum);
			break;		
		case "canvas":
			let canvas = new Canvas();
			canvas.init(pointNum);
			break;
		case "webgl":
			let webgl = new WebGL();
			webgl.init(pointNum);
			break;
	}
}
let location = window.location;
let showIcons =  document.getElementById('showIcons');
let unshow =  document.getElementById('unshow');
let showSvgs =  document.getElementById('showSvgs');
let showCavans =  document.getElementById('showCavans');
let showWebGL =  document.getElementById('showWebGL');

unshow.addEventListener('click',()=>{
	location.assign(location.origin);
});

showIcons.addEventListener('click',()=>{
	location.assign(location.origin+"/#imgs");
	location.reload();
});
showSvgs.addEventListener('click',()=>{
	location.assign(location.origin+"/#svgs");
	location.reload();
});
showCavans.addEventListener('click',()=>{
	location.assign(location.origin+"/#canvas");
	location.reload();
});
showWebGL.addEventListener('click',()=>{
	location.assign(location.origin+"/#webgl");
	location.reload();
});

//show fps
let stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

function animate() {

    stats.begin();

    // monitored code goes here
    stats.end();

    requestAnimationFrame(animate);

}

requestAnimationFrame(animate);