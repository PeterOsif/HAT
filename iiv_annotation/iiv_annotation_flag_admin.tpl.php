<?php
  //load the include files
  module_load_include('inc', 'iiv_annotation', 'inc/iiv_annotation_flagging');
  drupal_add_css(drupal_get_path('module','iiv_annotation') . '/css/flag.css');
  $flagged = iiv_annotation_get_flagged(0, 100);
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

    
	