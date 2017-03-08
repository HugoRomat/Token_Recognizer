

function Particle(particle, index) // constructor
{
  this.index = index;
  this.r = 2;
  this.direction = 1;
  this.x = particle.X;
  this.y = particle.Y;
  this.x2 = particle.X2;
  this.y2 = particle.Y2;
  this.target = particle.target,
  this.is_big_node = particle.is_big_node;
  this.is_selected = particle.is_selected;
  this.data = particle.data;
  this.target_r = 40;

  this.i = 0;

  this.timer = 0;
  this.velocity = 3 +(Math.random() * 5);

}
Particle.prototype.draw = function(canvas, ctx) {


  ctx.beginPath();
  //d.draw(this.contextLayout)
  var gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
  gradient.addColorStop(0, "white");
  gradient.addColorStop(1, "white");



  cx = d.x;
  cy = d.y;
  ctx.fillStyle = gradient;
  ctx.arc(cx, cy, d.r, 0, 2 * Math.PI, false);

  ctx.fill();

  ctx.lineWidth = 1;
  // ctx.strokeStyle = 'black';
  // ctx.stroke();

  var a = this.r + this.target_r ;
  var x = this.x2 - this.x;
  var y = this.y2 - this.y;

  if (a > Math.sqrt( (x*x) + (y*y) ) ){
    //console.log("collision")
    this.timer++;
  }


  if (this.timer == this.target.length){
    //J'arrive a la fin de mon tableau
    this.timer = 0;
  }
/*
  if(this.target.length == 1 && this.target[this.timer].index != -1)
  {
    console.log("Yo")
    this.x2 = this.r * Math.cos(2*Math.PI)
    this.y2 = this.r * Math.sin(2*Math.PI * this.i)
  }
*/
//console.log(this.target[this.timer])
var rayon = this.target[this.timer].r + 30;
//console.log(this.target[this.timer])
  this.x2 = (rayon * Math.cos(2*Math.PI * this.i/80)) + this.target[this.timer].x
  this.y2 = (rayon * Math.sin(2*Math.PI * this.i/80)) + this.target[this.timer].y
// X = cos(angle) * radius + middleX
// Y = cos(angle) * radius + middleY
//
  this.x2 = this.target[this.timer].x;
  this.y2 = this.target[this.timer].y;

  var r = this.target[this.timer].r;
  dx = this.x2 + (((Math.random() *r*4) - r*2)) - this.x;
  dy = this.y2 + (((Math.random() *r*4) - r*2)) - this.y;

  angle = Math.atan2(dy, dx)


  var velocity = this.velocity;


  xVelocity = this.direction * velocity * Math.cos(angle);
  yVelocity = this.direction * velocity * Math.sin(angle);
  // COLLISION //
  this.x += xVelocity;
  this.y += yVelocity;

  //console.log(this.timer)
  this.i++;
}
