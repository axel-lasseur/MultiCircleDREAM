var MultiCircleDREAM = (function(){
// Class MultiCircleDREAM

//private:
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;


function CircleMulTable(width, height){
	const WIDTH = width;
	const HEIGHT = height;

	let r = (WIDTH < HEIGHT) ? WIDTH/2 : HEIGHT/2;
	let base;
	let multiplication;

	this.color = {
		"background": "#000000",
		"circle": "#FFFFFF",
		"dots": "#AAAAAA",
		"lines": getRandomColor()
	}

	this.setColorLines = function(color){
		this.color.lines = color;
	}
	this.setBase = function(n){this.base = n;}
	this.setMultiplication = function(n){this.multiplication = n;}
	this.getMultiplication = function(){return this.multiplication;}

	this.draw = function(){
		const DOTSIZE = 5;

		ctx.clearRect(0,0,WIDTH,HEIGHT);
		ctx.fillStyle = this.color.background;
		ctx.fillRect(0,0,WIDTH,HEIGHT);

		ctx.beginPath();
		ctx.arc(WIDTH/2,HEIGHT/2,r,0,2*Math.PI);
		ctx.strokeStyle = this.color.circle;
		ctx.lineWidth = 2;
		ctx.stroke();

		let basicAngle = 2*Math.PI/this.base;
		let offset_w = WIDTH/2;
		let offset_h = HEIGHT/2;

		for(let i=0 ; i<this.base ; i++){
			//dots
			ctx.fillStyle = this.color.dots;
			ctx.fillRect(offset_w-DOTSIZE/2+Math.cos(i*basicAngle)*r,
						 offset_h-DOTSIZE/2+Math.sin(i*basicAngle)*r,
						 DOTSIZE,DOTSIZE);

			//multiplications links
			ctx.beginPath();
			ctx.moveTo(offset_w+Math.cos(i*basicAngle)*r,
					   offset_h+Math.sin(i*basicAngle)*r);
			ctx.lineTo(offset_w+Math.cos(i*this.multiplication*basicAngle)*r,
					   offset_h+Math.sin(i*this.multiplication*basicAngle)*r);

			ctx.strokeStyle = this.color.lines;
			ctx.stroke();
		}

		//color.lines = color.lines;
	}
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * make a color transition between two colors
 * choose how long (or rather how many iterations) you want to make the transition with n param
 * @param colorFrom : string(hexa)
 * @param colorTo : string(hexa)
 * @param n : int
 * @return string(hexa) <- currentColor || false <- when it is done
 */
function colorTransition(colorFrom, colorTo, n){
	//init
	if(this.i === undefined){
		this.i = 0;
	
		//this.currentColor = colorFrom;
		this.currentColorR = parseInt(colorFrom.slice(1,3),16);
		this.currentColorG = parseInt(colorFrom.slice(3,5),16);
		this.currentColorB = parseInt(colorFrom.slice(5,7),16);

		this.colorToR = parseInt(colorTo.slice(1,3),16);
		this.colorToG = parseInt(colorTo.slice(3,5),16);
		this.colorToB = parseInt(colorTo.slice(5,7),16);

		this.stepR = (this.colorToR - this.currentColorR) / n;
		this.stepG = (this.colorToG - this.currentColorG) / n;
		this.stepB = (this.colorToB - this.currentColorB) / n;

		//console.log(this.stepR);
	}
	
	//transition calculation
	this.currentColorR += this.stepR;
	this.currentColorG += this.stepG;
	this.currentColorB += this.stepB;

	if(this.currentColorR > 0xFF) this.currentColorR = 0xFF;
	if(this.currentColorG > 0xFF) this.currentColorG = 0xFF;
	if(this.currentColorB > 0xFF) this.currentColorB = 0xFF;
	if(this.currentColorR < 0x0) this.currentColorR = 0x0;
	if(this.currentColorG < 0x0) this.currentColorG = 0x0;
	if(this.currentColorB < 0x0) this.currentColorB = 0x0;

	if(this.i++ == n || 
		this.currentColorR == this.colorToR
		&& this.currentColorG == this.colorToG
		&& this.currentColorB == this.colorToB){
		this.i = undefined;
		return false;
	}

	//return
	let r = Math.round(this.currentColorR).toString(16);
	let g = Math.round(this.currentColorG).toString(16);
	let b = Math.round(this.currentColorB).toString(16);
	if(r.length == 1) r = "0"+r;
	if(g.length == 1) g = "0"+g;
	if(b.length == 1) b = "0"+b;
	//console.log(i);
	//console.log("#"+r+g+b)
	return "#"+r+g+b;
}
colorTransition.prototype.i; //current step
//current color
colorTransition.prototype.currentColorR;
colorTransition.prototype.currentColorG;
colorTransition.prototype.currentColorB;
//final desired color
colorTransition.prototype.colorToR;
colorTransition.prototype.colorToG;
colorTransition.prototype.colorToB;
//step for progress range
colorTransition.prototype.stepR;
colorTransition.prototype.stepG;
colorTransition.prototype.stepB;

function animate(){
	circle.setMultiplication(circle.getMultiplication()+speed);
	circle.draw();

	//document.getElementById('slider_multiplication').value = circle.getMultiplication();
	
	let newColor = colorTransition(currentColor,finalColor,500);
	//console.log(newColor);
	if(newColor)
		circle.setColorLines(newColor);
	else{
		currentColor = finalColor;
		finalColor = getRandomColor();
	}

	if(start)
		requestAnimationFrame(animate);
}

var currentColor = getRandomColor();
var finalColor = getRandomColor();

var start = true;
var circle;
var speed = 0.01;
var ctx;

//Public:
return {
	"init": function(idCanvas,width,height){
		if(width === undefined || height === undefined){
			width = window.innerWidth;
			height = window.innerHeight;
		}
		width -= 15;
		ctx = document.getElementById(idCanvas).getContext("2d");
		ctx.canvas.width = width;
		ctx.canvas.height = height;
		circle = new CircleMulTable(width,height);
		circle.setBase(100);
		circle.setMultiplication(0);

		animate();
		//this.start();
	},
	"start": function(){start = true ; animate()},
	"stop": function(){start = false},

	"setSpeed": function(s){ speed = s; },
	"setBase": function(b) { circle.setBase(b); if(!start) animate(); },
	"setMultiplicator": function(m){ circle.setMultiplication(m); if(!start) animate(); },

	"getMultiplicator": function(){ return circle.multiplication }
};
})();

//MultiCircleDREAM.init();
// MultiCircleDREAM.setBase(300);
// MultiCircleDREAM.setSpeed(0.01);
// MultiCircleDREAM.setMultiplicator(3);
// MultiCircleDREAM.stop();