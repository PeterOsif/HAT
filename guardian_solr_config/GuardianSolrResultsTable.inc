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
    $items = array();
    $type = "ol";
    $title = null;
    $recordStart = $results->response->start;
    
    global $base_url;
    if(empty($results)) {
      return "no results";
    }

    foreach($results->response->docs as $doc) {
      $rows = array();
      $row = 0;

      foreach($doc as $field => $value) {
        $rows[$row][] = array(
          'data' => $field,
          'header' => true,
        );
        if(is_array($value)) {
          $value = implode(", ",$value);
        }

        if($field=='PID') {
          $l = l($value,'fedora/repository/'.htmlspecialchars($value,ENT_QUOTES,'utf-8') . 'text');
          $rows[$row][] = $l;
        }else {
          $rows[$row][] = $value;
        }
        $row++;
      }
      $items[] = theme_table(null,$rows,array('class'=>'islandora_solr_search_results_object'));
    }
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

