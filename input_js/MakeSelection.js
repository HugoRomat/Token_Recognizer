
function MakeSelection() // constructor
{
	this.array_of_points = [];
	this.objects_inside = [];
	this.name = null;
	this.score = null;
	this.position = {};
}

MakeSelection.prototype.is_point_inside_selection = function(point) {
          // ray-casting algorithm based on
          // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
  var vs = [];
	var self = this;

  for (var i = 0; i < self.array_of_points.length; i++)
  {
      var x = self.array_of_points[i].X,
          y = self.array_of_points[i].Y;
      vs.push([x,y])
  }

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
	//console.log(self.array_of_points.length)
  return inside;
}
MakeSelection.prototype.add_points_to_array = function(point) {

	this.array_of_points.push(point);
	//console.log(this.array_of_points);
}
MakeSelection.prototype.who_is_inside = function(array)
{
	//console.log(array);
  var array_is_in_form = [];

  for (var i = 0; i < array.length; i++)
  {
    var is_in = this.is_point_inside_selection([array[i].x,  array[i].y]);
		//console.log(is_in)
    if (is_in == true)
    {
      //console.log(map.canvas.nodes[i]);
      this.objects_inside.push(array[i].index);
    }
  }
}
MakeSelection.prototype.unselect_selection = function(nodes)
{

	this.array_of_points = [];
	this.array_is_in_form = [];
	this.objects_inside = [];
	this.name = null;
	this.score = null;
	for (var i = 0; i < nodes.length; i++)
  {
    var d = nodes[i];
    if (d.is_big_node == false)
    {
      d.color = "#75485E";
    }
  }
}
MakeSelection.prototype.paint_selected_nodes = function(array_nodes)
{
	//console.log(array_nodes)
	var self = this;
  for (var i = 0; i < self.objects_inside.length; i++)
  {
    for (var j = 0; j < array_nodes.length; j++)
    {
      if(self.objects_inside[i] == array_nodes[j].index)
      {
        array_nodes[j].color = "blue";
        array_nodes[j].is_selected = true;
        //console.log(map.canvas.nodes[j])
      }
    }
  }
}
MakeSelection.prototype.move_selection = function(x,y)
{
	//console.log(array_nodes)
	var self = this;
  for (var i = 0; i < self.array_of_points.length; i++)
  {
		self.array_of_points[i].X += x;

		self.array_of_points[i].Y += y;
  }
}
