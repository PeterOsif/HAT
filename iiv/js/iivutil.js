//assumes jquery is included
//http://192.168.56.101/islandora/annotation/delete/1/admin
//http://192.168.56.101/islandora/annotation/insert/abc1234/text/x=1,y=1,d0=1,d1=1/1
//http://192.168.56.101/admin/settings/iiv_annotation_flag
/**
 * Util functions to use with iiv
 * 
 */
// function to select annotations, calls module to select the drupal database
function queryForAnnotation(pid){
	var baseURL="/islandora/annotation/select";
	var newURL = baseURL +'/'+ pid ;

	var html = $.ajax({
		  url: newURL,
		  async: false
		 }).responseText;
	parseSearchResults(html);
	//console.log(html);
	//document.data.myData.value = "Search Worked";
}
function parseSearchResults(details){
	//TODO:remove once we connect the pieces together, this was only used for testing
	$("div.status").text("Server Message:" + details);
}
function updateStatusOnPage(details){
	//TODO:remove once we connect the pieces together, this was only used for testing
	$("div.status").text("Server Message:" + details);
}

// function to remove annotations from drupal database
function deleteAnnotation(aid){
	var baseURL="/islandora/annotation/delete";
	// call query function 
	var newURL = baseURL +'/'+ aid +'/json';
	// perform call and capture result
	var html = $.ajax({
	  url: newURL,
	  async: false
	 }).responseText;
	console.log(html);
	updateStatusOnPage(html);
	
	//document.data.myData.value = "Delete Worked " +html;
}

// function to add annotations, call module to insert in the drupal database
function addAnnotation(pid,annotationText,annotationLocation,private){
	//http://192.168.56.101/islandora/annotation/insert/abc123/highthere/x=1,y=2,d=2,d1=2/1
	//var baseURL="http://192.168.56.101/islandora/annotation/insert";
	//messages success/error
	
	var newURL = drupalDomain + "/islandora/annotation/insert/";
	newURL += pid +'/' + annotationText  + '/' +  annotationLocation +'/' + private + "/?callback=?";
      
    //call query function
    $.getJSON(newURL, function (data){
                        addAnnotationCallback(data);
                        //alert(data);
                      });
}
function addAnnotationCallback(data){
    for(i=0; i< data.length; i++){
        var obj = data[i];
        alert(obj.message);
    }
}
//function to select annotations, calls module to select the drupal database
function flagAnnotation(aid){
	var baseURL="/islandora/annotation/flag";
	var newURL = baseURL +'/'+ aid ;
	
	// call query function and parse JSON
	var formText = null;
	var output ="";
	var html = $.ajax({
		  url: newURL,
		  async: false
		 }).responseText;
	console.log(html);
	 //document.data.myData.value = "Flag Worked " + html;
	updateStatusOnPage(html);
	
}
//function to select annotations, calls module to select the drupal database
function unflagAnnotation(aid){
	var baseURL="/islandora/annotation/unflag";
	var newURL = baseURL +'/'+ aid ;
	
	// call query function and parse JSON
	var formText = null;
	var output ="";
	var html = $.ajax({
		  url: newURL,
		  async: false
		 }).responseText;
	console.log(html);
	updateStatusOnPage(html);
	//document.data.myData.value = "UnFlag Worked " + html;

}

//function to grab coordinates for text to highlight
var coords;
function getHighlightCoordinates(pid, query){
    var newURL = drupal_domain + "/islandora/annotation/highlight/" + pid + "/" + query + "/?callback=?";
      
    //call query function
       $.getJSON(newURL, function (data){
                        getHighlightCoordinatesCallback(data);
                        //alert(data);
                      }); 
    return coords;
}


function getHighlightCoordinatesCallback(retData){
   //first clear all boxes
   clearHighlightLayer();
   
   //draw results
   for(var i=0;i<retData.length;i++){
        var obj = retData[i];
        drawBox(obj);
    }
}
/**
 * setupPopControl
 * 
 */
//added by sfb
function setupPopControl(){
	   map.addControl(polyControl);
	   polyControl.activate();
	   document.getElementById('iiv-image-panel').style.cursor = 'crosshair';
}
//Sabina
function setupPopControlforPolygon(){	   
	   map.addControl(mulpolyControl);
	   mulpolyControl.activate();	 
	   document.getElementById('iiv-image-panel').style.cursor = 'crosshair';
}
//added by sfb
/**
 * onPopupClose
 * Close the popup
 */
function onPopupClose(evt) {
    // 'this' is the popup.
	//polyControl.unselect(this.feature);
	//alert(evt);
    document.getElementById('iiv-image-panel').style.cursor = 'move';
    map.removePopup(popup);
    popup.destroy();
    popup = null;
    polyControl.box.clear();
   
    map.removeControl(polyControl);
    //TODO:set focus back to map so selection doesn't occur again
}

/**
 * boxNotice
 * When the selects a polygon
 */
//added by sfb
function boxNotice(geom) {
	 document.getElementById('iiv-image-panel').style.cursor = 'crosshair';
    var feature = new OpenLayers.Feature.Vector(geom, null, {
        strokeColor: "#0033ff",
        strokeOpacity: 0.7,
        strokeWidth: 5
    });
    featureSelect(feature);
    //sortOutButtons(oDragPanCtrl, false);
}//boxNotice

//Sabina
function drawPolygon(geom)
{
    //Define Layer 
    var polygonFeature = new OpenLayers.Feature.Vector(geom, null, {
        strokeColor: "#ff0000", //color of the line on features
        fillColor:"green", //color used to fill polygon, default is #ee9900
        strokeOpacity: 0.2,
        fillOpacity:0.4, //This is the opacity used for filling in Polygons	
        strokeWidth: 1 //default is 1
    });  
    var annotationLayer = getAnnotationLayer();                     
    annotationLayer.addFeatures(polygonFeature);   
}
  
function getAnnotationLayer(){
    var annotationLayer = this.map.getLayersByName("annotationLayer");
    if(annotationLayer.length > 0){
        return annotationLayer[0];
    }
    else{
        var styleMap = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults(
        {fillColor: "yellow", fillOpacity: 0.3, strokeColor: "green"},
        OpenLayers.Feature.Vector.style["default"]));
        
        highlightLayer = new OpenLayers.Layer.Vector("annotationLayer", {styleMap : styleMap});
        this.map.addLayers([highlightLayer]);
        return highlightLayer;
    }
}

function clearAnnotationLayer(){
    getAnnotationLayer().destroyFeatures();
}


/**
 *  featureSelect - show dialog for selection
*/
// added by sfb
function featureSelect(feature) {
    //need to have a minimum selection
    if (feature.geometry.getArea() < 10)
        return;
    document.getElementById('iiv-image-panel').style.cursor = 'move';
    /*
    */
    selectedFeature = feature;
    var bounds = selectedFeature.geometry.getBounds();
    //Sabina
    var coordinates = selectedFeature.geometry;//Array
    alert(coordinates);
     //leaving in for now, we may need this sfb
    //var currZoom = map.getZoom();
   // var canvasSize = mapcanvas;
    //if (currZoom == ZOOMIN)
    //    canvasSize = canvasMax;
    //if (currZoom == ZOOMOUT)
     //   canvasSize = canvasMin;

    /*
    alert (sortOutSelectedBox(bounds.toArray(), canvasSize, parseInt(bounds.getWidth()),
        parseInt(bounds.getHeight())));
    */
    
    var viewerUI = this;
    var title = "www.islandnewspapers.ca";
    popup = new OpenLayers.Popup.FramedCloud("Region", 
        feature.geometry.getBounds().getCenterLonLat(),
        null,
        "<div id='popupdiv'><form><strong>Selection from <i>" +
        title +"</i></strong><br/>\n" +
        "Please enter an annotation for the selected information, or<br/>\n" +
        "close this popup if you want to make another selection.<br/><br/>" +
        "<strong>Annotation Text:</strong><br/>" +       
        "<textarea name='annotationText' id='annotationText' cols='40' rows='6' wrap></textarea><br/>" + 
        "<div id='saveData' align='right'"+       
        	"<input type='checkbox' name='annotationPublic' id='annotationPublic' value='1' checked /> Public "+
        //	"<a href='#' onclick=saveAnnotation($('#annotationText').val(),"+coordinates+",$('input[name=annotationPublic]:checked').val());>Save</a>"+
        "<a href='#' onclick=saveAnnotation($('#annotationText').val(),$('input[name=annotationPublic]:checked').val());>Save</a>"+
        "</div>" + 
        "<br clear=\"left\"/>" +
       // sortOutSelectedBox(bounds.toArray(), canvasSize, parseInt(bounds.getWidth()),
       // parseInt(bounds.getHeight())) +
        "<br clear=\"left\"/>" +
        //"<i>Coming Soon: annotate this selection!</i>" +
        "</form></div>", 
        null, true, onPopupClose);
       feature.popup = popup;
    map.addPopup(popup);
}//featureSelect
/**
 * saveAnnotation
 * 
 */
 
function saveAnnotation(annotationText,publicOn){
	alert("i would have saved:" + annotationText + "\n" +"Public=" + publicOn);
	//var coordinates = selectedFeature.geometry;
	//alert(coordinates);
	//TODO: finish save logic
	//TODO:close popup
	
}

function drawBox(obj){
    var styleMap = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults(
        {fillColor: "yellow", fillOpacity: 0.3, strokeColor: "green"},
        OpenLayers.Feature.Vector.style["default"]));

                
	// y coordinates in the words XY start at 0 from the top where as
	// open layers consideres 0 the bottom.  Take the complement of the
	// given y value relative to the map height to invert the value. Note that in the Bounds function
	// the top value of the words xy data is passed to the bottom parameter in the function
	// because of this inversion.
	
	var mapHeight = this.map.maxExtent.top;
	bounds = new OpenLayers.Bounds(obj.l, (mapHeight - obj.t), obj.r, (mapHeight - obj.b));
	                    
	hightlightBox = new OpenLayers.Feature.Vector(bounds.toGeometry(),{styleMap: styleMap});
	
	var highlightLayer = getHighlightLayer();                     
	highlightLayer.addFeatures(hightlightBox);                   
                            
}//drawBox

function getHighlightLayer(){
    var highlightLayer = this.map.getLayersByName("highlightLayer");
    if(highlightLayer.length > 0){
        return highlightLayer[0];
    }
    else{
        var styleMap = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults(
        {fillColor: "yellow", fillOpacity: 0.3, strokeColor: "green"},
        OpenLayers.Feature.Vector.style["default"]));
        
        highlightLayer = new OpenLayers.Layer.Vector("highlightLayer", {styleMap : styleMap});
        this.map.addLayers([highlightLayer]);
        return highlightLayer;
    }
}

function clearHighlightLayer(){
    getHighlightLayer().destroyFeatures();
}
