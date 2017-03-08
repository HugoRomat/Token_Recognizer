
function MovementDetection(canvas_to_detect, my_environment) // constructor
{

  this.canvas = canvas_to_detect;
  this.environment = my_environment;
  this.element_drag = null;


}
MovementDetection.prototype.initialize = function(){

  this.environment.selection = new MakeSelection();

  var self = this;
  var mc = new Hammer.Manager(this.canvas);

  mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 10 }) );
  mc.add( new Hammer.Tap({ event: 'doubletap', taps: 2, threshold: 100 }) );
  mc.add( new Hammer.Tap({ event: 'singletap', taps: 1, threshold: 100}) );

  mc.add( new Hammer.Press({ event: 'press', pointers:1, time:500}) );
  //mc.add( new Hammer.Pinch({ event: 'pinch', pointers:2}) );

  mc.on("panstart",  function(e){ self.handlePanStart(e);}, false);
  mc.on("panmove", function(e){ self.handlePanMove(e);}, false);
  mc.on("panend", function(e){ self.handlePanEnd(e);}, false);
  // mc.on("doubletap", handleDoubleTap);
  mc.on("singletap", function(e){ self.handleSingleTap(e);}, false);

  mc.on("press", function(e){ self.handlePress(e);}, false);

  //mc.on("pinch", function(e){ self.handlePinchIn(e);}, false);

}

// Declare my Hammer event
//
// var element_drag = null;
// var last_position = {x:0, y: 0}
// var youp = null;

MovementDetection.prototype.handlePanMove = function(e)
{
  var self = this;
  var x = e.pointers[0].pageX - e.pointers[0].target.offsetLeft;
  var y = e.pointers[0].pageY- e.pointers[0].target.offsetTop;
  //console.log(mode);
  if (mode == "drag_object")
  {
    self.element_drag.x = x;
    self.element_drag.y = y;
    self.element_drag.px = x;
    self.element_drag.py = y;
    self.environment.tick();

    self.environment.update_particule(self.element_drag.index,x,y);

    // Detect the collision between nodes
    var object_collide = this.detect_collision(this.element_drag,x,y);

    if (object_collide != null)
    {
      this.environment.addNodesForCollision(object_collide,this.element_drag);
    }
  }
  else if (mode == "draw_form")
  {
    // Pour DOLLARONE
    this.environment.selection.add_points_to_array({X:e.pointers[0].pageX - e.pointers[0].target.offsetLeft,Y:e.pointers[0].pageY- e.pointers[0].target.offsetTop});
   //console.log(point_recognizer_drawn);
    //this.environment.redraw();
    //this.environment.drawSelection(this.selection.array_of_points);
  }
  else if (mode == "move_selection")
  {

    //force.stop();
    var x2 = e.pointers[0].pageX - this.environment.selection.position.x;
    var y2 = e.pointers[0].pageY - this.environment.selection.position.y;

    this.environment.move_nodes(x2 , y2, this.environment.selection.objects_inside);
    this.environment.selection.move_selection(x2 , y2);
    //force.resume()
    this.environment.selection.position.x = e.pointers[0].pageX;
    this.environment.selection.position.y = e.pointers[0].pageY;


    //this.environment.tick();

  }
}


MovementDetection.prototype.handlePanStart = function(e)
{


  console.log("Pan");
  var i = 0;
  var self = this;
  //console.log(e)
  //console.log(e.pointers[0].pageX - e.pointers[0].target.offsetLeft, e.pointers[0].pageY- e.pointers[0].target.offsetTop);
  var x = e.pointers[0].pageX - e.pointers[0].target.offsetLeft;
  var y = e.pointers[0].pageY- e.pointers[0].target.offsetTop;

  self.environment.nodes.forEach(function(target) {

    //Si je pan sur un cercle
    if (x < target.x + target.r  && x > target.x - target.r && y < target.y + target.r && y > target.y - target.r )
    {
      //Pass by reference
      self.environment.force.stop();
      self.element_drag = self.environment.nodes[i];
      //element_drag.fixed = false;
      mode = "drag_object";
    }
    i++;
  });
  // Si je pan au sein de ma selection

  if (self.environment.selection.is_point_inside_selection([x,y]) == true)
  {
    console.log("MOVE SELECTION")
    self.environment.force.stop();
    mode = "move_selection";
    self.environment.selection.position.x = x;
    self.environment.selection.position.y = y;
  }

  //Si je ne drague pas un objet alors je dessine
  if (mode != "drag_object" && mode != "move_selection")
  {

    mode = "draw_form";
    // Si je refais une selection j'enlever l'ancienne
    self.environment.selection.unselect_selection(this.environment.nodes);
  }
  console.log(mode);
}


MovementDetection.prototype.handlePanEnd = function(e)
{
  console.log("END")
  //Si je suis bien en train de drager
  //console.log(element_drag);
  if (mode == "drag_object")
  {
    this.element_drag.fixed = true;
    //Je remet mon element a drager null quand je relache
    this.element_drag = null;
    this.environment.tick();
    //Relance mon force layout apres le drag pour que mes noeuds suivent
    this.environment.force.resume();
  }
  else if (mode == "draw_form")
  {
    //console.log(mode)
    // Pour DollarONe

    //var form = detect_form(selection_object.array_selection);

    //drawing_boundig_box(form);
    this.environment.selection.who_is_inside(this.environment.nodes);
    //this.selection.name = form.Name;
    //this.selection.score = form.Score;

    this.environment.selection.paint_selected_nodes(this.environment.nodes);

  }
  else if (mode == "move_selection")
  {
    this.environment.set_nodes_fixed(this.environment.selection.objects_inside);
    //this.environment.selection.unselect_selection(this.environment.nodes);
    //this.environment.tick();

  }
  mode = null;
  //this.environment.force.resume();

}
//
//
//
// function handleDoubleTap(e)
// {
//   console.log("Double Tap")
//   var x = e.pointers[0].pageX - e.pointers[0].target.offsetLeft;
//   var y = e.pointers[0].pageY- e.pointers[0].target.offsetTop;
//   var offset = {x: e.pointers[0].target.offsetLeft, y:e.pointers[0].target.offsetTop};
//
//   map.canvas.nodes.forEach(function(target) {
//     var r = target.r/2;
//     if (x < target.x + r && x > target.x - r && y < target.y + r && y > target.y - r )
//     {
//       console.log("Target Detected");
//       target.r = 50;
//       target.is_selected = true;
//       build_interaction(target);
//     }
//   });
//   map.redraw();
// }
MovementDetection.prototype.handleSingleTap = function(e)
{
  var x1 = e.pointers[0].pageX - e.pointers[0].target.offsetLeft;
  var y1 = e.pointers[0].pageY- e.pointers[0].target.offsetTop;

  console.log("Single Tap");
  // For the selection of my node
  this.environment.selection.unselect_selection(this.environment.nodes);
  //this.environment.redraw();


  var object = this.environment.is_finger_touch_node(x,y);
  if (object != null) {this.environment.object_selected(object);}



}



MovementDetection.prototype.detect_collision = function(object, PointerX, PointerY)
{
  var object_collide = null;

  this.environment.nodes.forEach(function(target) {
    var a;
    var x;
    var y;

    a = object.r + target.r;
    x = object.x - target.x;
    y = object.y - target.y;

    //Si l'object touche :
      // est une requete
      // est different de l'objet
    if (target != object && a > Math.sqrt( (x*x) + (y*y) ) ) {
        console.log("COLISION", target)
        object_collide = target;
    }
  });
  return object_collide;
}

MovementDetection.prototype.handlePinchIn = function(e)
{
  console.log(e)
  my_environment.redraw();
  my_environment.contextLayout.translate(e.center.x,e.center.y);
  if (e.additionalEvent == "pinchin") {my_environment.contextLayout.scale(0.99,0.99);}
  if (e.additionalEvent == "pinchout") {my_environment.contextLayout.scale(1.1,1.1);}
  my_environment.contextLayout.translate(- e.center.x,- e.center.y);
}
MovementDetection.prototype.handlePress = function(e)
{
  console.log(e,"Press");
  var x = e.pointers[0].pageX - e.pointers[0].target.offsetLeft;
  var y = e.pointers[0].pageY- e.pointers[0].target.offsetTop;
  var my_object = my_environment.is_finger_touch_node(x,y);

  if (my_object != null)
  {
    for (var i =0; i < my_environment.nodes.length; i++)
    {
      if (my_object.index == my_environment.nodes[i].index)
      {
        my_environment.nodes.splice(i,1);
        console.log(my_object)
        my_environment.delete_target(my_object);
      }
    }
  }

}
