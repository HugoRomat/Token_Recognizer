

function ForceEnvironment(canvas, width, height) // constructor
{

  this.width = width;
  this.height = height;
  this.x =  d3.scale.linear()
      .domain([0, this.width])
      .range([0, this.width]);

  this.y = d3.scale.linear()
      .domain([0, this.height])
      .range([this.height, 0]);

  this.canvasLayout = d3.select(canvas).node().getContext('2d');
  this.contextLayout = canvas.getContext("2d");
  this.selection_object = {objects_inside:[], array_selection:[], name:null, score: null};

  this.size_nodes = 5;
  this.my_color = "#75485E";

  this.nodes = [];
  this.links = [];
  this.particles = [];
  this.force = d3.layout.force();
  this.nodes_count = 0;

  this.frame = 0;

  this.selection = [];



}
ForceEnvironment.prototype.initializeNodes = function(number_nodes) {
  console.log(number_nodes)
  this.selection = new MakeSelection();
  var self = this;

  this.particles =
  d3.range(number_nodes).map(function(d, i) {
    if (i%3 == 0){
        return new Particle({
        index:i,
        X: self.width/2,
        Y: self.height/2,
        X2: 0,
        Y2: 0,
        target : [{index:-1, r: 40, x:self.width/2, y:self.height/2}],
        is_big_node: true,
        is_selected : false,
        data : {type: "publication", year: "2015" }
      }, i);
    }
    if (i%2 == 0) {
      return new Particle({
      index:i,
      X: self.width/2,
      Y: self.height/2,
      X2: 0,
      Y2: 0,
      target : [{index:-1, r: 40, x:self.width/2, y:self.height/2}],
      is_big_node: true,
      is_selected : false,
      data : {type: "patent", year: "2015" }
    }, i);

    }
    else{
      return new Particle({
      index:i,
      X: self.width/2,
      Y: self.height/2,
      X2: 0,
      Y2: 0,
      target : [{index:-1, r: 40, x:self.width/2, y:self.height/2}],
      is_big_node: true,
      is_selected : false,
      data : {type: "patent", year: "2012" }
    }, i);

    }
  });

}

//   /******** LINKS ******************/
// ForceEnvironment.prototype.drawLinks = function() {
//   this.contextLayout.strokeStyle = "#ccc";
//   this.canvasLayout.beginPath();
//
//   var i = -1, cx, cy;
//   while (++i < this.links.length) {
//     d = this.links[i];
//     cx = d.source.x;
//     cy = d.source.y;
//     this.canvasLayout.moveTo(cx, cy);
//     this.canvasLayout.lineTo(d.target.x, d.target.y);
//   }
//   this.canvasLayout.stroke();
// }
//


ForceEnvironment.prototype.drawParticles = function() {
  var i = -1, cx, cy;

  while (++i < this.particles.length) {

    d = this.particles[i];
    //console.log(d)
    d.draw(this.canvasLayout, this.contextLayout)
  }
}
  /*********** NODES ****************/
ForceEnvironment.prototype.drawNodes = function() {
  var i = -1, cx, cy;
  while (++i < this.nodes.length) {
    this.contextLayout.beginPath();
    d = this.nodes[i];

    //console.log(d.x, d.y)
    d.x = Math.max(d.r, Math.min(this.width - d.r, d.x));
    d.y = Math.max(d.r, Math.min(this.height - d.r, d.y));
    cx = d.x;
    cy = d.y;

    var gradient = this.contextLayout.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
    gradient.addColorStop(0.1, "black");
    gradient.addColorStop(0.7, "white");
    gradient.addColorStop(0.8, "white");
    gradient.addColorStop(1, "black");

    this.contextLayout.arc(cx, cy, d.r, 0, 2 * Math.PI, false);
    this.contextLayout.fillStyle = gradient;//d.color;

    //map.canvas.moveTo(cx, cy);

    this.contextLayout.fill();

    this.contextLayout.lineWidth = 1;
    this.contextLayout.strokeStyle = 'black';
    this.contextLayout.stroke();
  }
}
ForceEnvironment.prototype.drawSelection = function() {
  //console.log(point_recognizer_drawn)
  //console.log(array)
  array = this.selection.array_of_points;
  //console.log(array)
  if (array.length != 0)
  {
    /*this.contextLayout.beginPath();*/

    this.contextLayout.lineWidth = 1.5;
    this.contextLayout.strokeStyle = 'red';

    this.contextLayout.beginPath();
    for (var i = 0; i < array.length; i++)
    {
        var x = array[i].X,
            y = array[i].Y;
        this.contextLayout.lineTo(x, y);
    }
    this.contextLayout.lineTo(array[0].X, array[0].Y);
    this.contextLayout.stroke();
  }
}
ForceEnvironment.prototype.drawText = function() {


  /******** Writing *********/
  this.canvasLayout.beginPath();
  var i = -1, cx, cy;
  while (++i < this.nodes.length) {
    d = this.nodes[i];
    //if (d.is_big_node == true)
  //  {

      cx = d.x;
      cy = d.y + d.r + 20;
      this.contextLayout.fillStyle = "white";
      this.contextLayout.font = "20px Arial";
      //map.canvas.fillText(map.canvas.nodes[i].type,cx - (d.r/2), cy);
      var txt = this.nodes[i].data.value;
      var txt_length = this.contextLayout.measureText(txt).width;
      //console.log(txt)

      this.contextLayout.fillText(txt, cx - (txt_length/2), cy);

    this.contextLayout.fill();
  //  }
  }
}
ForceEnvironment.prototype.redraw = function(frame) {
  //console.log(this.frame);
  this.frame = frame;
  //this.contextLayout.clearRect(0, 0, this.width, this.height);
    // Fill the path
  this.contextLayout.globalCompositeOperation = "source-over";
  this.contextLayout.fillStyle = "rgba(0, 0, 0, 0.4)";

  /*var gradient = this.contextLayout.createRadialGradient(this.width/2,this.height/2, 0, this.width/2,this.height/2, this.width/2);
  gradient.addColorStop(0, "black");
  gradient.addColorStop(0.8, "black");
  gradient.addColorStop(1, "blue");

  this.contextLayout.fillStyle = gradient;*/
  //this.contextLayout.fill();
  this.contextLayout.fillRect(0,0,this.width, this.height);
  //this.contextLayout.globalCompositeOperation = "lighter";


  //this.drawLinks();
  this.drawNodes();
  this.drawParticles();
  //this.drawText();



  this.drawSelection([]);
}

ForceEnvironment.prototype.createNode = function(token) {

  var self = this;
  var selector_input_type = null;
  var type_of = null;


  //console.log(token_recognized);
  if (token.tokenID == "Circle_4") { selector_input_type = "publication"; type_of = "support";}
  if (token.tokenID == "Triangle_5") { selector_input_type = "patent"; type_of = "support";}
  if (token.tokenID == "Rectangle_5") { selector_input_type = 2012; type_of = "year";}
  if (token.tokenID == "Square_5") { selector_input_type = 2015; type_of = "year";}

  var node = {
		    x: token.center.x * CSS_PX_PER_MM,
      	y: token.center.y * CSS_PX_PER_MM ,
      	r: 40,
        fixed: true,
        color: "#51A3A3",
        index: this.nodes_count,
        //nodeType : selector_input_type,
        is_big_node: false,
        is_selected : false,
        data : {type: type_of, value: selector_input_type },
      };
  this.nodes_count ++;
  this.nodes.push(node);

  this.particles.forEach(function(target) {
    //console.log(target.x)
    //console.log(target.type, selector_input_type)

    // Si particle et rond de meme type je les attire.
    if (target.data.type == selector_input_type || target.data.year == selector_input_type )
    {
      if (target.target[0].index == -1)
      {
        target.target[0] = {index:node.index,r:node.r,x:node.x, y:node.y};
      }
      else {
        target.target.push({index:node.index,r:node.r, x:node.x, y:node.y});
      }
      //console.log(target)
      /*target.x2 = node.x;
      target.y2 = node.y;
      target.target_r = node.r;***/
    }
  });

  //this.force.start();

}

ForceEnvironment.prototype.setup_force_display = function() {

}
ForceEnvironment.prototype.tick = function(e) {
  // var self = this;
  //
  // for (i =0; i < self.links.length; ++i) {
  //   self.particles[i].x1 = self.links[i].source.x;
  //   self.particles[i].y1 = self.links[i].source.y;
  //   self.particles[i].x2 = self.links[i].target.x;
  //   self.particles[i].y2 = self.links[i].target.y;
  // }
  //
  // var q = d3.geom.quadtree(self.nodes), i;
  // for (i = 1; i < self.nodes.length; ++i) {
  //   q.visit( self.collide(self.nodes[i]) );
  // }
  // self.redraw();

}


// Eviter lq collision entre les boules
ForceEnvironment.prototype.collide = function(node) {

}

// DRAG AND DROP
ForceEnvironment.prototype.update_particule = function(index,x,y) {

  for (var i =0; i < this.particles.length; i++)
  {
    //console.log(target.type, selector_input_type)
    //console.log(link, object_initial)
    for (var j =0; j < this.particles[i].target.length; j++)
    {
      if(this.particles[i].target[j].index == index)
      {
        //this.particles[i].target[j].index = index;
        this.particles[i].target[j].x = x;
        this.particles[i].target[j].y = y;
      }
    }

  }

}

//Delete a node target from particles and from array of nodes
ForceEnvironment.prototype.delete_target = function(old_target) {
 console.log(old_target)
  for (var i =0; i < this.particles.length; i++)
  {
    //console.log(target.type, selector_input_type)
    //console.log(link, object_initial)
    for (var j =0; j < this.particles[i].target.length; j++)
    {
      if(this.particles[i].target[j].index == old_target.index)
      {
        this.particles[i].target.splice(j,1);
        if(this.particles[i].target.length == 0){
          this.particles[i].target[j] = {index:-1, r: 40, x:this.width/2, y:this.height/2}
        }
        else {
          var length = this.particles[i].target.length;
          this.particles[i].target[j] = this.particles[i].target[length-1];
        }
      }
    }

  }
}
//For collision update particule target
ForceEnvironment.prototype.update_target = function(old_target, new_target) {
  console.log(old_target, new_target)
  for (var i =0; i < this.particles.length; i++)
  {
    //console.log(target.type, selector_input_type)
    //console.log(link, object_initial)
    for (var j =0; j < this.particles[i].target.length; j++)
    {
      if(this.particles[i].target[j].index == old_target.index)
      {
        //this.particles[i].target[j].index = index;

        this.particles[i].target[j] = new_target;
      }
    }

  }
}
// Eviter lq collision entre les boules
ForceEnvironment.prototype.addNodesForCollision = function(element_drag, element_touched) {
  // Supprimer la deuxieme entite
  // Creer un noeud plus gros a la place de la premiere
  //console.log(object1.type, object2.type);


  //1: Element drag
  //2: Element touched
  // On delete this.nodes
  //element_drag.r = 10 + element_drag.r;

  for (var i =0; i < this.nodes.length; i++)
  {
    if (element_touched == this.nodes[i])
    {
      this.change_links(this.nodes[i], element_drag);
      this.update_target(this.nodes[i], element_drag);
      this.nodes.splice(i,1);
      element_drag.data.value = element_drag.data.value + '\n\n' + element_touched.data.value;

    }
  }
}

ForceEnvironment.prototype.change_links = function(element_drag, element_touched) {

  console.log(element_drag.index);
  var i = -1 ;
  this.links.forEach(function(link) {
    //console.log(target.type, selector_input_type)
    //console.log(link, object_initial)
    if (link.target.index == element_touched.index)
    {
      link.target = element_drag;
    }
    if (link.source.index == element_touched.index)
    {
      link.source = element_drag;
    }

    i++;
  });
}

ForceEnvironment.prototype.move_nodes = function (x, y, node_array)
{
  for (var i = 0; i <  this.nodes.length; i++)
  {
    for (var j = 0; j < node_array.length; j++)
    {
      if (this.nodes[i].index == node_array[j])
      {
        var element = this.nodes[i];
        //console.log(map.canvas.nodes[i].x,map.canvas.nodes[i].y);
        //map.canvas.nodes[i].fixed = false;
        //element.fixed = false;
        this.nodes[i].px += x;
        this.nodes[i].py += y;
        this.nodes[i].x += x;
        this.nodes[i].y += y;
        this.nodes[i].color = "red"
      //  this.node[i].fixed = true;
        //map.canvas.nodes[i].fixed = true;
      }
    }
  }
}
// Fixe mes noeuds
ForceEnvironment.prototype.set_nodes_fixed = function (node_array)
{
  for (var i = 0; i < this.nodes.length; i++)
    {
      for (var j = 0; j < node_array.length; j++)
      {
        if (this.nodes[i].index == node_array[j])
        {
          var element = this.nodes[i];

          this.nodes[i].fixed = true;
        }
      }
    }
}
// Savoir ce que le touch touche comme noeud
ForceEnvironment.prototype.is_finger_touch_node = function (x,y)
{
  for(var i= 0; i < this.nodes.length; i++)
	{
    var target = this.nodes[i];
    //Si je pan sur un cercle
    if (x < target.x + target.r  && x > target.x - target.r && y < target.y + target.r && y > target.y - target.r )
    {
      return target;
    }
  }
  return null;

}
ForceEnvironment.prototype.object_selected = function (my_object)
{
  if (my_object.is_big_node == false){
    var animation_circle = function(){
      if (my_object.r < 100){
        webkitRequestAnimationFrame(animation_circle);
        my_object.r += 3;
      }
    }
    my_object.is_big_node = true;
    animation_circle();
  }

  else{
    var animation_circle = function(){
      if (my_object.r > 40){
        webkitRequestAnimationFrame(animation_circle);
        my_object.r -= 3;
      }
    }
    my_object.is_big_node = false;
    animation_circle();
  }
}
