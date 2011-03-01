<!--        
<script src="lib/OpenLayers.js"></script>

        var map;                    
        var image1 ;
        var styleMap = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults(
        {fillColor: "yellow", fillOpacity: 0.1, strokeColor: "green"},
        OpenLayers.Feature.Vector.style["default"]));

        /*---------------------------------------------------------------------------------------
        getLat: Accepts pixel, performs calc and returns 
        Parameter(s): Pixels 
        returns:float
        ---------------------------------------------------------------------------------------*/
        function getlat(a,b)
        {
            var pixel = new OpenLayers.Pixel(a,b);
			var lonlat = this.map.getLonLatFromPixel(pixel);
			OpenLayers.Console.debug("Lat: " + lonlat.lat + " (Pixel.x:" + pixel.x + ")" + "\n" + "Lon: " + lonlat.lon + " (Pixel.y:" + pixel.y);
            return (lonlat.lat);
        }        
        
         function getlong(a,b)
        {
                var pixel = new OpenLayers.Pixel(a,b);
                var lonlat = map.getLonLatFromPixel(pixel);
                OpenLayers.Console.log("Lat: " + lonlat.lat + " (Pixel.x:" + pixel.x + ")" + "\n" + "Lon: " + lonlat.lon + " (Pixel.y:" + pixel.y + ")" );
                return (lonlat.lon);
        }        
        
        /*---------------------------------------------------------------------------------------
        drawBox: Accepts array and draws the boxes using the coordinates
        Parameter(s): array []
        ---------------------------------------------------------------------------------------*/       
        function drawBox(arrayPositions) 
        {  
                OpenLayers.Console.debug("drawBox method called with Array:["+arrayPositions+"]");
               
                var boxes  = new OpenLayers.Layer.Vector("Boxes",{styleMap: styleMap} );  
                
                for (var i = 0; i < arrayPositions.length; i++) 
                {
                    //left, bottom, right, top [LBRT]
                    bounds = new OpenLayers.Bounds(arrayPositions[0], arrayPositions[1], arrayPositions[2], arrayPositions[3]);                    
                    box = new OpenLayers.Feature.Vector(bounds.toGeometry(),{styleMap: styleMap});                     
                    boxes.addFeatures(box);                   
                }//for
                
               map.addLayers([image1, boxes]);                
        }//drawBox         
        
        /*---------------------------------------------------------------------------------------
        init: Intializing method called on body load
        Parameter(s): none
        ---------------------------------------------------------------------------------------*/    
        function init()
        {
            OpenLayers.Console.debug("Init method called");
			map= new OpenLayers.Map('map');		
			var options = 
			{		                 			
                minExtent: new OpenLayers.Bounds(-1, -1, 1, 1),
                maxResolution: "auto",
                maxExtent: new OpenLayers.Bounds(-180, -90, 180, 90),                                       
                  
			};
			//Define image-size,source etc
			image1= new OpenLayers.Layer.Image
			(
                'JPEG','newspaper.jpg',
                //new OpenLayers.Bounds (-180, -90, 180, 100),
                new OpenLayers.Bounds(-180,-90, 180, 100),	
                new OpenLayers.Size(296,900),
                options
			);     
			//to capture mouse movement/pixels x,y
			map.events.register("mousemove", map, function(e) 
			{ 
                var position = this.events.getMousePosition(e);
                OpenLayers.Util.getElement("aside").innerHTML = position;
            });
			
			//Call drawBox with location positions
			//left, bottom, right, top [LBRT]
			map.addControl(new OpenLayers.Control.MousePosition());
			drawBox([-144.64,-42.69,-115.68,-36.42]);	//to highlight "university"
			drawBox([76.43,-18.92,117.50,-12.46]);      //to highlight "documentary"
			drawBox([-57.80,25.38,-29.26,31.38]);
			
			
            if (!map.getCenter()) map.zoomToMaxExtent();  			
			/*
			var pixel = new OpenLayers.Pixel(88.44,340);
			var lonlat = this.map.getLonLatFromPixel(pixel);
			OpenLayers.Console.debug("Lat: " + lonlat.lat + " (Pixel.x:" + pixel.x + ")" + "\n" + "Lon: " + lonlat.lon + " (Pixel.y:" + pixel.y);
			*/
			var left = getlat(515,190);
			var bottom = getlong(515,190);			
			var right = getlong(562.13,204);
			var top = getlat(562.13,204);
			OpenLayers.Console.debug(left+" "+bottom+" "+right+" "+top+"");
			drawBox([left,bottom,right,top]);
			//getlat(42.44,351);
            //map.addLayers([image1]);                      
            //To view the long/lat coordinates
        }
		
		
		/*---------------------------------------------------------------------------------------
        
        ---------------------------------------------------------------------------------------*/
		function poly()
		{
			var lon = 5;
			var lat = 40;
			var zoom = 5;
			var map, layer;
			var style_green = {
                strokeColor: "#339933",
                strokeOpacity: 1,
                strokeWidth: 3,
                pointRadius: 6,
                pointerEvents: "visiblePainted"
            };
			var vlayer  = new OpenLayers.Layer.Vector("PolyLayer",{styleMap: styleMap} );  
            map = new OpenLayers.Map('map', {theme: null});
            var options = 
			{		                 			
                minExtent: new OpenLayers.Bounds(-1, -1, 1, 1),
                maxResolution: "auto",
                maxExtent: new OpenLayers.Bounds(-180, -90, 180, 90),                                       
                  
			};
			//Define image-size,source etc
			image1= new OpenLayers.Layer.Image
			(
                'JPEG','diagram.jpg',
                //new OpenLayers.Bounds (-180, -90, 180, 100),
                new OpenLayers.Bounds(-180,-90, 180, 100),	
                new OpenLayers.Size(296,900),
                options
			);     
          
			//-------------------------------------------------from resize-features.html---------------------------
			// create a line feature from a list of points
            var pointList = [];            
			var point = new OpenLayers.Geometry.Point(-110, 45);          
			var newPoint = point;
			//Create polygon feature
			for(var p=0; p<6; ++p) {
                var a = p * (2 * Math.PI) / 7;
                var r = Math.random(1) + 1;
                var newPoint = new OpenLayers.Geometry.Point(point.x + (r * Math.cos(a)),
                                                             point.y + (r * Math.sin(a)));
                pointList.push(newPoint);
            }
            pointList.push(pointList[0]);
             map.addLayer(image1);
            var linearRing = new OpenLayers.Geometry.LinearRing(pointList);
            polygonFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([linearRing]));
                
            //-------------------------------------------------end code from resize-features.html---------------------------
           // setCenter: function(	lonlat,	zoom,dragging,forceZoomChange	)
		     vlayer.addFeatures([polygonFeature]);                
           // map.addLayer(vlayer);
			
            map.setCenter(new OpenLayers.LonLat(point.x, point.y),3);                 
			var origin = new OpenLayers.Geometry.Point(-111.04, 45.68);	            
			layer = new OpenLayers.Layer.Vector( "Editable" );			 
            map.addLayer(vlayer);
			if (!map.getCenter()) map.zoomToMaxExtent(); 
			
			//Get panel ID 
            var container = document.getElementById("panel");
            var panel = new OpenLayers.Control.EditingToolbar(
                vlayer, {div: container}
            );
            map.addControl(panel);  
			
        }
		
		-->