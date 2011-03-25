<?php

/*
 * contains methods to search solr and display results.  depends on Apache_Solr_Php client.
 */


/**
 * Extention of IslandoraSolrResults for templating purposes.
 * This overrides the displayResults function to provide an alternate display type.
 */

class GuardianSolrResultsTable extends IslandoraSolrResults {

  static $facetSeparator = '~';//used to separate facets in url
  static $slashReplacement = '~slsh~';// a pattern used to replace / in url's the slash breaks drupal clean url's
  public static $SEARCH_CLASS_ADVANCED_SEARCH_NUMBER_FIELDS = 5;
  function IslandoraSolrResults() {
    module_load_include('php', 'islandora_solr_search', 'Solr/Service');
  }

//Extracts a word from a query URL and loads it into another function. 
  function termExtract(){
     $data = '';
     if (array_key_exists('q', $_GET)){
       $data = explode("/",$_GET[q]);
       $query_dat = urldecode($data[3]);
	return $query_dat;
     }

  }
  
  /**
   * Outputs results in unified tabular format.
   *
   * This function collects all field names from all results in the 
   * resultset and constructs a single table with said field names in 
   * a unified header row, rather than outputting each result as a 
   * miniature horizontal table.
   *
   * @param $results
   *   A solr resultset object.
   *
   * @return
   *   html output for the resultset. Note: we currently create this 
   *   output manually, should refactor to use drupal forms api.
   */
  //default implementation of display results can be changed in the blocks config
  function displayResults($results){
   
   //Load the search term:
   $query_term = $this->termExtract();
   $output.= '<ol start="'.($recordStart + 1).'">';
    global $base_url;
    if(empty($results)) {
      return "no results";
    }

    foreach($results->response->docs as $doc) {
      $output .= '<li><table>';
      foreach($doc as $field => $value) {
        $output .= '<tr><th>'.$field.'</th>';
        if(is_array($value)) {//
          $value = implode(", ",$value);
        }

        if($field=='PID') {
          $output.='<td><a href="'.$base_url.'/fedora/repository/'.htmlspecialchars($value,ENT_QUOTES,'utf-8') . '?query=' . $query_term. '">'.$value.'</td>';
        }else {
          $output .= '<td>'.$value.'</td>';
        }
      }
      $output .='</table></li>';
    }
    $output .= '</ol>';

    $output .= theme_item_list($items, $title, $type, array('class'=>'stuff','start'=>($recordStart + 1)));
    if( variable_get('islandora_solr_search_debug_mode', 0) ) { // debug dump
      $results_r .= "<pre>Results: ".print_r($results,true)."</pre>";
      $fieldset_r = array(
        '#title' => t("Raw Results"),                                                                                                                                             
        '#collapsible' => TRUE,
        '#collapsed' => TRUE,
        '#value' => $results_r,
        );
      $output .= theme('fieldset', $fieldset_r);
    }
    return $output;
  }

}

