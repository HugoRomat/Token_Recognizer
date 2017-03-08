
function ListenerInput(canvas_to_detect, type_of_input, token_recognizer, my_environment) // constructor
{
	this.canvas = canvas_to_detect;
	this.type_surface = type_of_input;
	this.array_fingers = [null,null,null];
	this.mouseDownCount = 0;
	this.token_recognizer = token_recognizer;
	this.my_environment = my_environment;
}

ListenerInput.prototype.startListen = function() {
	var self = this;

  switch (this.type_surface)
	{
		case "desktop":
			this.canvas.addEventListener("mousedown", function(e){self.doMouseDown(e, self.token_recognizer);}, false);
			break;

		case "tablet":
			this.canvas.addEventListener("touchstart", function(e){self.doTouchStart(e, self.token_recognizer);}, false);
			this.canvas.addEventListener("touchmove", function(e){self.doTouchMove(e, self.token_recognizer);}, false);
			this.canvas.addEventListener("touchend", function(e){self.doTouchEnd(e, self.token_recognizer);}, false);
			break;

		case "surface":
			this.canvas.addEventListener("pointerenter", function(e){self.doPointerEnter(e,self.token_recognizer);}, false);
			this.canvas.addEventListener("pointermove", function(e){self.doPointerMove(e);}, false);
			this.canvas.addEventListener("pointerleave", function(e){self.doPointerEnd(e);}, false);
			break;
	}

};
ListenerInput.prototype.doMouseDown = function(event, token_recognizer) {
		var touchPoint =
      {
        x: this.getMousePos(canvas, event).x / CSS_PX_PER_MM,
        y: this.getMousePos(canvas, event).y  / CSS_PX_PER_MM
      };

    this.array_fingers[this.mouseDownCount] = touchPoint;
    this.mouseDownCount++;

    if (this.mouseDownCount == 3)
    {
      mode = "recognize_tokens";
      token_recognizer.recognize(this.array_fingers);

      token_recognizer.printTemplateRecognized();
      this.mise_zero_array_fingers(this.array_fingers);
      this.mouseDownCount = 0;
    }
		my_environment.redraw();

}


ListenerInput.prototype.doTouchStart = function(event, token_detector) {

		for (var i = 0; i < event.touches.length; i++) {
		    var touch = event.touches[i];
				//console.log(ListenerInput.prototype.detect_point_contact_surfaces(event.touches[i]))
				this.detect_point_contact_surfaces(event.touches[i]);
		}
		console.log(this.array_fingers)
		// Active le mode RECNNAISSEUR TOKEN
		if (this.array_fingers[0]!= null && this.array_fingers[1]!= null && this.array_fingers[2]!= null)
		{
			mode = "recognize_tokens";
			console.log(this.array_fingers)
			//console.log(token_detector.tokenRecognized);
			token_detector.recognize(this.array_fingers);
			//token_detector.redraw(this.array_fingers);
			console.log(token_detector.tokenRecognized);
			if (token_detector.tokenRecognized != null) {my_environment.createNode(token_detector.tokenRecognized);}
			//my_environment.redraw();
		}

	}
ListenerInput.prototype.doTouchMove = function(event, token_detector)
	{
		//mise_zero_array_fingers(array_fingers);

		/*for (var i = 0; i < event.touches.length; i++) {
		    var touch = event.touches[i];
				this.detect_point_contact_surfaces(event.touches[i]);
		}

		//console.log("FIN TABLET ", tokenRecognized)
		if (this.array_fingers[0]!= null && this.array_fingers[1]!= null && this.array_fingers[2]!= null)
		{
			//recognize_token();

		}*/

	}
ListenerInput.prototype.doTouchEnd = function(event, token_detector)
	{
		// SI mes trois doigts sont enleves alors je recommence a reconnaitre des formes
		if (this.array_fingers[0]== null && this.array_fingers[1]== null && this.array_fingers[2]== null)
		{
			console.log("changement")
			//token_detector.array_token = [nu];
			is_recognized = false;
			mode = null;
			//stop_move_token();
		}
		this.mise_zero_array_fingers();
	}





	/*********** POINTER EVENTS *******************/
ListenerInput.prototype.doPointerEnter = function(event, token_detector)
	{
		console.log("ENTER ",event.pointerId)
		var touchPoint = {
		        x: (event.pageX - event.target.offsetLeft) / CSS_PX_PER_MM,
		        y: (event.pageY - event.target.offsetTop) / CSS_PX_PER_MM,
		        pointerId :event.pointerId
		      };

		// Regarde ou il y a une case dans mon tableau de libre
		for(var i= 0; i < this.array_fingers.length; i++)
		{
		    if (this.array_fingers[i] == null)
		    {
		    	this.array_fingers[i] = touchPoint;
		    	break;
		    }
		}
		if (this.array_fingers[0]!= null && this.array_fingers[1]!= null && this.array_fingers[2]!= null)
		{
			mode = "recognize_tokens";
			console.log(this.array_fingers)
			//console.log(token_detector.tokenRecognized);
			token_detector.recognize(this.array_fingers);
			//token_detector.redraw(this.array_fingers);
			console.log(token_detector.tokenRecognized);
			my_environment.createNode(token_detector.tokenRecognized);

			//console.log(tokenRecognized.tokenID);
		}

	}
ListenerInput.prototype.doPointerMove = function(event)
	{
		var touchPoint = {
		        x: (event.pageX - event.target.offsetLeft) / CSS_PX_PER_MM,
		        y: (event.pageY - event.target.offsetTop) / CSS_PX_PER_MM,
		        pointerId :event.pointerId
		      };
		// perform painting of fingers
		//Paint(event.pageX - event.target.offsetLeft,event.pageY - event.target.offsetTop);

		// To update the position of the fingers
		// for(var i= 0; i < this.array_fingers.length; i++)
		// {
		// 	//console.log(array_fingers[i].pointerId)
		//   if (this.array_fingers[i] != null && this.array_fingers[i].pointerId == event.pointerId)
		// 	{
		// 	   	this.array_fingers[i] = touchPoint;
		// 	    break;
		// 	}
		//
		// }
		//Si mes trois doigts sont remplis alors je commence a reconnaitre des formes pour l'apparition des noeuds

	}
ListenerInput.prototype.doPointerEnd = function (event)
{
	//console.log("EXIT ", event.pointerId);
	//Parcours mon tableau pour regarder quel id est a enlever ==> ID = event.Id
	for(var i= 0; i < this.array_fingers.length; i++)
	{
		if (this.array_fingers[i] != null)
		{

		    if (this.array_fingers[i].pointerId == event.pointerId)
		    {
		    	this.array_fingers[i] = null;
		    	break;
		    }
	    }
	}
	//console.log(array_fingers);

	// SI mes trois doigts sont enleves alors je met le tableau a zero et je recommence a reconnaitre
	if (this.array_fingers[0]== null && this.array_fingers[1]== null && this.array_fingers[2]== null)
	{
		//console.log("changement")
		array_token = [];
		is_recognized = false;
	}
}
ListenerInput.prototype.getMousePos = function(cvs, evt) {
		    var rect = cvs.getBoundingClientRect();

		    return {
		      x: evt.clientX - rect.left,
		      y: evt.clientY - rect.top
		    };
		}

ListenerInput.prototype.detect_point_contact_surfaces = function(point){
	var id_finger = point.identifier;

	var touchPoint = {
	        x: (point.pageX - point.target.offsetLeft) / CSS_PX_PER_MM,
	        y: (point.pageY - point.target.offsetTop) / CSS_PX_PER_MM
	      };
	this.array_fingers[id_finger] = touchPoint;
}

ListenerInput.prototype.mise_zero_array_fingers = function()
	{
		for (var i=0; i < this.array_fingers.length; i++)
		{
			this.array_fingers[i] =  null;
		}
	}




// /*
//
// function move_token(token)
// {
//
// 	console.log(map.canvas.nodes[map.canvas.nodes.length-1].x, token.center.x);
//
// 	map.canvas.nodes[map.canvas.nodes.length - 1].x = token.center.x * CSS_PX_PER_MM;
//     map.canvas.nodes[map.canvas.nodes.length - 1].y = token.center.y * CSS_PX_PER_MM;
//     map.canvas.nodes[map.canvas.nodes.length - 1].fixed = false;
//
//     map.redraw();
//     force.resume();
//
// }
//
// function stop_move_token()
// {
//     map.canvas.nodes[map.canvas.nodes.length - 1].fixed = true;
// }
//
// /************ DRAWING FUNCTION ****************/
// /*
// function Paint(X,Y)
// {
// 	context.beginPath(X,Y);
// 	context.arc(X,Y, 10, 0, 2 * Math.PI);
// 	context.stroke();
// }
// */
