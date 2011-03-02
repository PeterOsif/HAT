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
function addAnnotation(pid,uid,annotationText,annotationLocation,private){
	//http://192.168.56.101/islandora/annotation/insert/abc123/highthere/x=1,y=2,d=2,d1=2/1
	//var baseURL="http://192.168.56.101/islandora/annotation/insert";
	//messages success/error
	var baseURL="/islandora/annotation/insert";
	
	// call query function 
	var newURL = baseURL +'/'+ pid +'/' + annotationText  + '/' +  annotationLocation +'/' + private;
	//alert(newURL);	
	var html = $.ajax({
	  url: newURL,
	  async: false
	 }).responseText;
	console.log(html);
	updateStatusOnPage(html); 
	
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
    var newURL = drupalDomain + "/islandora/annotation/highlight/" + pid + "/" + query + "/?callback=?";
      
    //call query function
    $.getJSON(newURL, function (data){
                        getHighlightCoordinatesCallback(data);
                        //alert(data);
                      });
		 
    return coords;
}


function getHighlightCoordinatesCallback(retData){
   for(var i=0;i<retData.length;i++){
        var obj = retData[i];
        alert(obj.l + "," + obj.t + "," + obj.b + "," + obj.r);
    }
}
