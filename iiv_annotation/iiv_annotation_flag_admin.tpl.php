<?php
  //load the include files
  module_load_include('inc', 'iiv_annotation', 'inc/iiv_annotation_flagging');
  drupal_add_css(drupal_get_path('module','iiv_annotation') . '/css/flag.css');

  $rowsPerPage = 10; 
  $pageNum = 1;
  if (isset($_GET['page']))
    {
      $pageNum = $_GET['page'];
    }

  $offset = ($pageNum - 1) * $rowsPerPage; //offset for the number of pages.
  $flagged = iiv_annotation_get_flagged($offset, $rowsPerPage);
  $counterArray = iiv_annotation_get_count(); //get the number of elements in the array
  $counterRow = db_fetch_array($counterArray);
  $counter = $counterRow['numrows'];
  $maxPage = ceil($counter/$rowsPerPage); //the maxi

  echo('<center>');
  $self = $_SERVER['REQUEST_URI'];
  $queryCut= 0 - strlen(strstr($self,'?')); //Removes the page of a query from the variable $self
  if ($queryCut != 0){
    $self = substr($self, 0 ,$queryCut); //is ignored if queryCut is 0
  }
  
  $nav = "<form name ='listSel'><select name = page>"; // form a list that will
  //create the page table.
  for($page = 1; $page <= $maxPage; $page++)
  {
     if ($page == $pageNum)
    {
        $nav .= '<option value = '. $page. ' selected><a href=\"$self?page=$page\'>'.$page.'</a></option> ';
    }
    else
    {
        $nav .= '<option value = '. $page. '><a href=\"$self?page=$page\'>'.$page.'</a></option> ';
    } 
 }

  if ($pageNum > 1)
  {
     $page  = $pageNum - 1;
     $prev  = " <a href=\"$self?page=$page\">[Prev]</a> ";
  
    $first = " <a href=\"$self?page=1\">[First Page]</a> ";
  } 
  else
  {
     $prev  = '&nbsp;'; // we're on page one, don't print previous link
     $first = '&nbsp;'; // nor the first page link
  }

  if ($pageNum < $maxPage)
  {
     $page = $pageNum + 1;
     $next = " <a href=\"$self?page=$page\">[Next]</a> ";

     $last = " <a href=\"$self?page=$maxPage\">[Last Page]</a> ";
  } 
  else
  {
     $next = '&nbsp;'; // we're on the last page, don't print next link
     $last = '&nbsp;'; // nor the last page link
  }
  $nav .= ("</select><input type = 'submit' value ='Go to Page' /></form>");
  // print the navigation link
  echo $first . $prev . $nav . $next . $last;
  echo ('</center>');
  //Create the table and elements.
?>
<fieldset>
	<legend><? echo t('Flagged annotations');?></legend>
	<table class="flagged">
	  <tr>
	    <? echo '<th>' . t('Number of flags') . '</th>'; ?>
	    <? echo '<th>' . t('Annotation text') . '</th>'; ?>
	    <? echo '<th>' . t('Annotation Author') . '</th>'; ?>
	    <? echo '<th>' . t('Clear all flags') . '</th>'; ?>
	    <? echo '<th>' . t('Delete') . '</th>'; ?>
	  </tr>
	  <? $row_count = 0;
	     while($row = db_fetch_array($flagged)){  //print all flagged annotations into a table
		   echo '<tr class=flag_row'. ($row_count % 2) .'>';//used to alternate row color of output
		   echo '<td>' . $row['num_flags'] . '</td>';
		   echo '<td>' . check_plain($row['annotation_text']) . '</td>'; //always use check plain on user input to prevent XSS
		   echo '<td>' . l(user_load($row['uid'])->name, 'user/' . $row['uid']) . '</td>';
		   echo '<td>' . l(t('clear'), 'islandora/annotation/clearflags/' . $row['aid']) . '</td>';
		   echo '<td>' . l(t('delete'), 'islandora/annotation/delete/' . $row['aid'] . '/admin') . '</td>';
		   echo '</tr>';
		   $row_count++;
	     }
	     if(!$row_count){
			echo  '<tr colspan="5"><td>' . t('no flagged annotations') . '</td></tr>';
	     }
	  ?>
	</table>
</fieldset>

    
	
