<?xml version="1.0" encoding="ISO-8859-1" ?>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>IIV Image Viewer: ${param.pid}</title>
<style>
  html, body {margin: 0; padding: 0; }
</style>
</head>
  <body style="margin: 0;">
    <!-- begin iiv code -->
    <script src="/iiv/js/OpenLayers-2.7/OpenLayers.js"></script>    
    <script src="/iiv/js/jquery-1.3.2.min.js"></script>
    <script src="/iiv/js/jquery-ui-1.7.2.custom.min.js"></script>
    <script src="/iiv/js/iiv.js"></script>
    <script src="/iiv/js/iivutil.js"></script>
    <script>
    var drupal_uid = '${param.drupal_uid}';
    var drupal_domain = '${param.drupal_domain}';
    var viewer;
    document.write('<div class="iiv"></div>');
    $(document).ready(function() {
        viewer = new iiv.Viewer({
        pid: '${param.pid}',
        cmodel: '${param.cmodel}', 
        dsid: 'JP2',
        uid: '${param.uid}'})
    });
    </script>
    <!-- end iiv code -->
  </body>
</html>