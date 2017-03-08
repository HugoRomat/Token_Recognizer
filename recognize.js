

function TokenRecognizer() // constructor
{

  this.CSS_PX_PER_MM = null;

  this.tokenTemplates = [];
  this.tokenTemplate = null;
  this.tokenNone = {
    tokenID: "none",
    points: [],
    distance: 0,
    angle: 0,
    center: {
      x: 0,
      y: 0,
    },
    outline: [],
    originalGeometryTemplate: []
  };
  this.tokenRecognized = {
    tokenID: "none",
    points: [],
    distance: 0,
    angle: 0,
    center: {
      x: 0,
      y: 0,
    },
    outline: [],
    originalGeometryTemplate: []
  };

  this.loadTemplates = function(url)
  {
    var self = this;

    var myFile = new XMLHttpRequest();
    myFile.open("GET",url,true);
    myFile.onreadystatechange = function(){
      if (myFile.readyState == 4 && myFile.status == 200){
        // Print entire file
        // console.log(myFile.responseText);

        // Parse by lines
        var lines = myFile.responseText.split('\n');
        var templateCount = 0;

        for(var line = 0; line < lines.length; line++){
          if(lines[line].length > 0) {
            var tokenTemplate;

            var splitLine = lines[line].split(',');
            // var outlineCoords = [];

            tokenTemplate = {
              tokenID: splitLine[0],
              points: [],

              distance: 0,
              angle: 0,

              center: {
                x: parseFloat(splitLine[8]),
                y: parseFloat(splitLine[9]),
              },

              outline: [],
              originalGeometryTemplate: []
            };
            //console.log(self)
            self.tokenTemplates[templateCount] = tokenTemplate;
            templateCount++;

            for(var index = 2; index <= 7; index+=2){
              tokenTemplate.points[tokenTemplate.points.length] = {
                x: parseFloat(splitLine[index]),
                y: parseFloat(splitLine[index+1])
              };
            }
            for(var index = 10; index < splitLine.length; index+=2){
              tokenTemplate.outline[tokenTemplate.outline.length] = {
                x: parseFloat(splitLine[index]),
                y: parseFloat(splitLine[index+1])
              };
            }

          }
        }
      }
    };
    myFile.send();
  }




  this.drawTemplates = function() {
    contextTemplates.clearRect(0, 0, contextTemplates.canvas.width, contextTemplates.canvas.height);
    contextTemplates.fillStyle = "rgba(0, 0, 255, 0.5)";
    contextTemplates.save();
    contextTemplates.translate(100, 250);

    for(var i = 0; i < this.tokenTemplates.length; i++) {
      var points = this.tokenTemplates[i].points;
      var outline = this.tokenTemplates[i].outline;
      contextTemplates.strokeStyle = 'gray';
      contextTemplates.fillStyle = 'gray';
      contextTemplates.beginPath();
      for(var j = 0; j < this.tokenTemplates[i].outline.length; j++) {
        contextTemplates.lineTo(this.tokenTemplates[i].outline[j].x * CSS_PX_PER_MM, this.tokenTemplates[i].outline[j].y * CSS_PX_PER_MM);
      }
      contextTemplates.closePath();
      contextTemplates.stroke();

      for(var j = 0; j < this.tokenTemplates[i].points.length; j++) {
        contextTemplates.fillRect(this.tokenTemplates[i].points[j].x * CSS_PX_PER_MM - 5, this.tokenTemplates[i].points[j].y * CSS_PX_PER_MM - 5, 10, 10);
      }

      contextTemplates.fillStyle = "rgba(0, 0, 255, 0.5)";
      contextTemplates.fillRect(this.tokenTemplates[i].center.x * CSS_PX_PER_MM - 5, this.tokenTemplates[i].center.y * CSS_PX_PER_MM - 5, 10, 10);

      contextTemplates.translate(240, 0);
    }
    contextTemplates.restore();
  };

  /******* CANVAS FOR RECOGNITON ************/




  this.redraw = function (array_fingers) {

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = "rgba(0, 0, 255, 0.5)";
    context.save();

    for(index = 0; index < array_fingers.length; index++) {
      if (array_fingers[index] != null)
      {
        context.fillRect(array_fingers[index].x * CSS_PX_PER_MM, array_fingers[index].y * CSS_PX_PER_MM, 2, 2);
      }
    }
    if(this.tokenRecognized.tokenID != "none") {
      context.fillStyle = "rgba(255, 0, 255, 0.2)";
      context.fillRect(this.tokenRecognized.center.x * CSS_PX_PER_MM - 1, this.tokenRecognized.center.y * CSS_PX_PER_MM - 1, 2, 2);
      // the increasing size of dots is to check that template points reordering is correct (the first touch point is th smallest and the last touch point is the largest)
      for(var i = 0; i < this.tokenRecognized.points.length; i++) {
        context.fillRect(this.tokenRecognized.points[i].x * CSS_PX_PER_MM - 4*(i+1), this.tokenRecognized.points[i].y * CSS_PX_PER_MM - 4*(i+1), 8*(i+1), 8*(i+1));
      }
      // draw outline (which, for optimization purpose, is not stored in tokenRecognized)
      // tokenRecognized rather provides a pointer to the original geometry of the template
      context.lineWidth = 1.5;
      context.strokeStyle = 'red';
      context.translate(this.tokenRecognized.center.x * CSS_PX_PER_MM, this.tokenRecognized.center.y * CSS_PX_PER_MM);
      context.rotate(-this.tokenRecognized.angle);
      context.beginPath();
      for(var i = 0; i < this.tokenRecognized.originalGeometryTemplate.outline.length; i++) {
        context.lineTo(this.tokenRecognized.originalGeometryTemplate.outline[i].x * CSS_PX_PER_MM, this.tokenRecognized.originalGeometryTemplate.outline[i].y * CSS_PX_PER_MM);
      }
      context.closePath();
      context.stroke();
    }
    context.restore();
  }



    /********* PRINTING **********/

  this.printTemplateRecognized = function() {
    var textRecognition = "";
    textRecognition += "<br/><b>"+this.tokenRecognized.tokenID+"</b>";
    textRecognition += "<br/>center:("+this.tokenRecognized.center.x+", "+this.tokenRecognized.center.y+")";
    textRecognition += "<br/>angle:"+this.tokenRecognized.angle;
    var textPoints = "<br/>points:[";
    for (var j = 0; j < this.tokenRecognized.points.length; j++) {
      if(j > 0) {
        textPoints += ", ";
      }
      textPoints += "("+this.tokenRecognized.points[j].x+", "+this.tokenRecognized.points[j].y+")";
    }
    textPoints += "]";
    textRecognition += textPoints;
    var textOutline = "<br/>outline:[";
    console.log(this.tokenRecognized)

    for (var j = 0; j < this.tokenRecognized.originalGeometryTemplate.outline.length; j++) {
      if(j > 0) {
        textOutline += ", ";
      }
      textOutline += "("+this.tokenRecognized.originalGeometryTemplate.outline[j].x+", "+this.tokenRecognized.originalGeometryTemplate.outline[j].y+")";
    }
    textOutline += "]";
    textRecognition += textOutline;
    //console.log(tokenRecognized.tokenID)
    document.getElementById("recognitionResult").innerHTML = textRecognition;
  };

  this.printTemplates = function() {
    var textTemplates = "";
    console.log(this.tokenTemplates);
    console.log("print "+this.tokenTemplates.length+" templates");
    for (var i = 0; i < this.tokenTemplates.length; i++) {
      console.log("i="+i);
      textTemplates += "<br/><b>"+this.tokenTemplates[i].tokenID+"</b>";
      textTemplates += "<br/>center:("+this.tokenTemplates[i].center.x+", "+this.tokenTemplates[i].center.y+")";
      var textPoints = "<br/>points:[";
      for (var j = 0; j < this.tokenTemplates[i].points.length; j++) {
        if(j > 0) {
          textPoints += ", ";
        }
        textPoints += "("+this.tokenTemplates[i].points[j].x+", "+this.tokenTemplates[i].points[j].y+")";
      }
      textPoints += "]";
      textTemplates += textPoints;
      var textOutline = "<br/>outline:[";
      for (var j = 0; j < this.tokenTemplates[i].outline.length; j++) {
        if(j > 0) {
          textOutline += ", ";
        }
        textOutline += "("+this.tokenTemplates[i].outline[j].x+", "+this.tokenTemplates[i].outline[j].y+")";
      }
      textOutline += "]";
      textTemplates += textOutline;
    }
    document.getElementById("viewTemplates").innerHTML = textTemplates;
  };

  /********** GEOMETRY UTILS ****************/

  this.centroid = function(points) {
    var sumX = 0;
    var sumY = 0;
    for (var i = 0; i < points.length; i++) {
      sumX += points[i].x;
      sumY += points[i].y;
    }
    var c = {
      x: sumX / points.length,
      y: sumY / points.length
    };
    return c;
  };

  this.centerOnPoint = function(points, refPoint) {
    for(var i = 0; i < points.length; i++) {
      points[i].x -= refPoint.x;
      points[i].y -= refPoint.y;
    }
  };

  this.angleBetweenVectors = function(vector1, vector2) {
    var angle = Math.atan2(vector2.y, vector2.x) - Math.atan2(vector1.y, vector1.x);
    //  normalize to the range 0 .. 2 * Pi:
    if (angle < 0) angle += 2 * Math.PI;
    return angle;
  };

  this.rotateBy = function(points, refPoint, theta, newPoints) {
    var ptSrc;
    var ptDest;
    for (var i = 0; i < points.length; i++) {
      ptSrc = points[i];
      if (newPoints.length > i) {
        ptDest = newPoints[i];
      } else {
        ptDest = {
          x: 0,
          y: 0
        };
        newPoints[i] = ptDest;
      }
      var x = (ptSrc.x - refPoint.x) * Math.cos(theta) - (ptSrc.y - refPoint.y) * Math.sin(theta) + refPoint.x;
      var y = (ptSrc.x - refPoint.x) * Math.sin(theta) + (ptSrc.y - refPoint.y) * Math.cos(theta) + refPoint.y;
      ptDest.x = x;
      ptDest.y = y;
    }
  };

  this.sortCCW = function(points, refPoint) {
    var vectorXAxis = {
      x: 10,
      y: 0
    };
    var angles = [];
    for(var i = 0; i < points.length; i++) {
      var vect = {
        x: points[i].x - refPoint.x,
        y: points[i].y - refPoint.y
      };
      angles[i] = this.angleBetweenVectors(vectorXAxis, vect);
    }
    var sortedPoints = [];
    var stillPositiveValues = true;
    while(stillPositiveValues) {
      var minIndex = -1;
      var minValue = 10000;
      for(var i = 0; i < angles.length; i++) {
        if(angles[i] >= 0 && angles[i] < minValue) {
          minValue = angles[i];
          minIndex = i;
        }
      }
      if(minIndex == -1) {
        stillPositiveValues = false;
      } else {
        sortedPoints[sortedPoints.length] = points[minIndex];
        angles[minIndex] = -1;
      }
    };
    for(var i = 0; i < points.length; i++) {
      points[i] = sortedPoints[i];
    }
  };

  this.sortAndAlignTemplate = function(template, refPoint) {
    this.centerOnPoint(template.points, refPoint);
    template.center.x -= refPoint.x;
    template.center.y -= refPoint.y;
    var origin = {
      x: 0,
      y: 0
    };
    this.sortCCW(template.points, origin);
    var refVector = {
      x: template.points[0].x,
      y: template.points[0].y,
    };
    var xAxisVector = {
      x: 10,
      y: 0
    };
    var angle = this.angleBetweenVectors(refVector, xAxisVector);
    this.rotateBy(template.points, origin, angle, template.points);
    var x = template.center.x * Math.cos(angle) - template.center.y * Math.sin(angle);
    var y = template.center.x * Math.sin(angle) + template.center.y * Math.cos(angle);
    template.center.x = x;
    template.center.y = y;
    return angle;
  };

  this.sort = function(points, refPoint) {
    var resPoints = [];
    for (var i = 0; i < points.length; i++) {
      resPoints[resPoints.length] = {
        x: points[i].x,
        y: points[i].y
      };
    }
    this.centerOnPoint(resPoints, refPoint);
    var origin = {
      x: 0,
      y: 0
    };
    this.sortCCW(resPoints, origin);
    return resPoints;
  };

  this.allPermutations = function(points) {
    var allPerms = [];
    for (var i = 0; i < points.length; i++) {
      var order = [];
      order[order.length] = points[i];
      for(var j = i+1; j < points.length; j++) {
          order[order.length] = points[j];
      }
      for(var j = 0; j < i; j++) {
          order[order.length] = points[j];
      }
      allPerms[allPerms.length] = order;
    }
    return allPerms;
  };

  this.rotateTemplate = function(template, angle) {
    var resPoints = [];
    for (var i = 0; i < template.points.length; i++) {
      resPoints[resPoints.length] = {
        x: template.points[i].x,
        y: template.points[i].y
      };
    }
    var origin = {
      x: 0,
      y: 0
    };
    this.rotateBy(resPoints, origin, angle, resPoints);
    var resCenter = {
      x: template.center.x,
      y: template.center.y
    };
    var x = resCenter.x * Math.cos(angle) - resCenter.y * Math.sin(angle);
    var y = resCenter.x * Math.sin(angle) + resCenter.y * Math.cos(angle);
    resCenter.x = x;
    resCenter.y = y;
    template.points = resPoints;
    template.center = resCenter;
  };

  this.translateTemplate = function(template, translate) {
    for (var i = 0; i < template.points.length; i++) {
      template.points[i].x += translate.x;
      template.points[i].y += translate.y;
    }
    template.center.x += translate.x;
    template.center.y += translate.y;
  };

  this.distance = function(point1, point2) {
    return Math.sqrt((point2.x - point1.x) * (point2.x - point1.x) + (point2.y - point1.y) * (point2.y - point1.y));
  };

  /********* PointArray UTILS *********/

  this.pointArrayToString = function(array) {
    var res = "[";
    for(var i = 0; i < array.length; i++) {
      res += "("+array[i].x+","+array[i].y+")"
    }
    res += "]";
    return res;
  };

  this.pointArrayCopy = function(array) {
    var res = [];
    for(var i = 0; i < array.length; i++) {
      res[res.length] = {
        x: array[i].x,
        y: array[i].y
      };
    }
    return res;
  };

  /********* Point UTILS *********/

  this.pointToString = function(point) {
    return "("+point.x+", "+point.y+")";
  };

  this.pointCopy = function(point) {
    var res = {
      x: point.x,
      y: point.y
    };
    return res;
  };

  /********* RECOGNITION ENGINE *********/

  this.meanSquaredPairedPointDistanceForAlignedPairs = function(points1, points2) {
    if(points1.length != points2.length) {
      return Number.MAX_VALUE;
    } else {
      var res = 0;
      for (var i = 0; i < points1.length; i++) {
        var p1 = {
          x: points1[i].x,
          y: points1[i].y,
        };
        var p2 = {
          x: points2[i].x,
          y: points2[i].y,
        };
        res += (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
      }
      return res / points1.length;
    }
  }

  this.minDistance = function(templateOrderedAndAligned, inputPoints, refPoint) {
    var inputPointsOrderedAndAligned = this.sort(inputPoints, refPoint);
    var allPerms = this.allPermutations(inputPointsOrderedAndAligned);
    var minDis = Number.MAX_VALUE;
    var angleRotate = 0;

    for (var i = 0; i < allPerms.length; i++) {
      var inputPermutation = allPerms[i];
      var origin = {
        x: 0,
        y: 0
      };
      var refVector = {
        x: inputPermutation[0].x,
        y: inputPermutation[0].y
      };
      var xAxisVector = {
        x: 10,
        y: 0
      };
      var angle = this.angleBetweenVectors(refVector, xAxisVector);
      var inputPermutationRotated = [];
      this.rotateBy(inputPermutation, origin, angle, inputPermutationRotated);
      var d = this.meanSquaredPairedPointDistanceForAlignedPairs(inputPermutationRotated, templateOrderedAndAligned.points);
      if(d < minDis) {
        minDis = d;
        angleRotate = angle;
      }
    }

    // modify the template to align it with input
    this.rotateTemplate(templateOrderedAndAligned, -(angleRotate));
    this.translateTemplate(templateOrderedAndAligned, refPoint);
    var distResult = {
      angle: angleRotate,
      distance: minDis
    };
    return distResult;
  };


   this.recognize = function(input) {

    this.tokenRecognized = this.tokenNone;
    if(input.length != 3) {
      return;
    }
    for (var i = 0; i < this.tokenTemplates.length; i++) {
      this.tokenTemplates[i].distance = Number.MAX_VALUE;
    }
    var minDis = Number.MAX_VALUE;
    //console.log(minDis)
    for (var i = 0; i < this.tokenTemplates.length; i++) {
      this.tokenTemplate = this.tokenTemplates[i];

      var points = [];
      for (var j = 0; j < this.tokenTemplate.points.length; j++) {
        points[j] = {
          x: this.tokenTemplate.points[j].x,
          y: this.tokenTemplate.points[j].y
        }
      }
      var center = {
        x: this.tokenTemplate.center.x,
        y: this.tokenTemplate.center.y,
      }
      var templateTransformed = {
        tokenID: this.tokenTemplate.tokenID,
        points: this.pointArrayCopy(this.tokenTemplate.points),
        distance: 0,
        angle: 0,
        center: this.pointCopy(this.tokenTemplate.center),
        outline: [],
        originalGeometryTemplate: this.tokenTemplate
      };
      var c = this.centroid(this.tokenTemplate.points);

      var templateAngle = this.sortAndAlignTemplate(templateTransformed, c);
      var inputDistance = this.minDistance(templateTransformed, input, this.centroid(input));
      templateTransformed.distance = inputDistance.distance;
      templateTransformed.angle = inputDistance.angle - templateAngle;

      //console.log(inputDistance)
      if(inputDistance.distance < minDis) {

        minDis = inputDistance.distance;
        this.tokenRecognized = templateTransformed;
      }

      // sort template points
      var unsortedTemplatePoints = [];
      for(var j = 0; j < this.tokenRecognized.points.length; j++) {
        //console.log(this.tokenRecognized.points[j])
        unsortedTemplatePoints[unsortedTemplatePoints.length] = this.tokenRecognized.points[j];
      }

      var sortedTemplatePoints = [];

      for(var j = 0; j < input.length; j++) {
        var minD = Number.MAX_VALUE;
        var indexMinDistance = -1;
        for(var k = 0; k < unsortedTemplatePoints.length; k++) {
          //console.log(input[j], unsortedTemplatePoints[k])
          var d = this.distance(input[j], unsortedTemplatePoints[k]);
          if(d < minD) {
            minD = d;
            indexMinDistance = k;
          }
        }
        sortedTemplatePoints[sortedTemplatePoints.length] = unsortedTemplatePoints[indexMinDistance];
        // remove element at indexMinDistance from unsortedTemplatePoints
        unsortedTemplatePoints.splice(indexMinDistance, 1);
      }
      this.tokenRecognized.points = sortedTemplatePoints;
    }
  };
}
