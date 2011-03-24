<?php

/**
 * Function to return admin setting form
 * @return array 
 */
function islandora_solr_admin_settings() {

  //checks for existence of PHP Solr client.

  module_load_include('php', 'islandora_solr_search', 'Solr/Service');
  if (!class_exists(Apache_Solr_Service)) {
    drupal_set_message("This module requires the " . l('Apache Solr php client', 'http://code.google.com/p/solr-php-client') . '.
      Please install the client directory in the root directory of this module before continuing.');
    return;
  }
  $handlers['standard'] = 'standard';
  $solr_avail = solr_available();
  if ($solr_avail) {
    $handlers = get_handlers();
  }


  // optional config modules will use hook_alter_form to add to this array

  $config_options = array();
  //               module_name          file_name                 class_name           display_method
  $config_options['islandora_solr_search~IslandoraSolrResults.inc~IslandoraSolrResults~displayResults'] = 'Default';

  $form = array();
  $form['wrapper'] = array(
      '#type' => 'fieldset',
  );
  $form['wrapper']['islandora_solr_search_block_url'] = array(
      '#type' => 'textfield',
      '#title' => t('Solr url'),
      '#size' => 25,
      '#weight' => -1,
      '#description' => t('The url of the Solr installation.  The default is localhost:8080/solr.'),
      '#default_value' => variable_get('islandora_solr_search_block_url', 'localhost:8080/solr'),
      '#suffix' => '<p>' . ($solr_avail ? '<img src="' . url('misc/watchdog-ok.png') . '"/>' . t('Successfully connected to Solr server at !islandora_solr_search_block_url', array('!islandora_solr_search_block_url' => variable_get('islandora_solr_search_block_url', ''))) : '<img src="' . url('misc/watchdog-error.png') . '"/> ' . t('Unable to connect to Solr server at !islandora_solr_search_block_url</p>', array('!islandora_solr_search_block_url' => variable_get('islandora_solr_search_block_url', '')))),
  );
  $form['islandora_solr_config_options'] = array(
      '#type' => 'select',
      '#title' => t('Configuration package'),
      '#multiple' => false,
      '#options' => $config_options,
      '#description' => t('Name of configuration package for displaying output.'),
      '#default_value' => variable_get('islandora_solr_config_options', 'islandora_solr_search~IslandoraSolrResults.inc~IslandoraSolrResults~displayResults'),
  );
  $form['islandora_solr_search_block_repeat'] = array(
      '#type' => 'textfield',
      '#title' => t('Search Field Repetition'),
      '#size' => 5,
      '#description' => t('The number of times you would like the search blocks to be repeated'),
      '#default_value' => variable_get('islandora_solr_search_block_repeat', t('3')),
  );
  $form['islandora_solr_search_block_request_handler'] = array(
      '#type' => 'select',
      '#title' => t('Request Handler'),
      '#options' => $handlers,
      '#description' => t('The name of the solr request handler to use for this search.  This must be configured in your solr config file.  If this is not set we will use the default handler.'),
      '#default_value' => variable_get('islandora_solr_search_block_request_handler', t('standard')),
  );
  $form['islandora_solr_search_block_facets'] = array(
      '#type' => 'textarea',
      '#title' => t('Facet Fields'),
      // '#size' => 75,
      '#description' => t('a comma-separated list of fields to use as facets'),
      '#default_value' => variable_get('islandora_solr_search_block_facets', t('dc.subject,dc.type')),
  );


  $form['islandora_solr_search_block_facet_min_count'] = array(
      '#type' => 'textfield',
      '#title' => t('Minimum facet fields responses'),
      '#size' => 5,
      '#description' => t('This param indicates the minimum counts for facet fields should be included in the response. '),
      '#default_value' => variable_get('islandora_solr_search_block_facet_min_count', '2'),
  );
  $form['islandora_solr_search_block_facet_limit'] = array(
      '#type' => 'textfield',
      '#title' => t('Maximum facet field constraints'),
      '#size' => 5,
      '#description' => t('This param indicates the maximum number of constraint counts that should be returned for the facet fields. A negative value means unlimited. '),
      '#default_value' => variable_get('islandora_solr_search_block_facet_limit', '10'),
  );
  $form['islandora_solr_search_num_of_results'] = array(
      '#type' => 'textfield',
      '#title' => t('Results per page'),
      '#size' => 5,
      '#description' => t('This param indicates the number of results to show per page. '),
      '#default_value' => variable_get('islandora_solr_search_num_of_results', '20'),
  );
  $form['islandora_solr_search_debug_mode'] = array(
      '#type' => 'checkbox',
      '#title' => t('Debug Mode?'),
      '#return_value' => 1,
      '#default_value' => variable_get('islandora_solr_search_debug_mode', 0),
      '#description' => t('Dumps solr query info to the screen for testing purposes.'),
  );


  return system_settings_form($form);
}

function solr_available() {
  // path from url is parsed to allow graceful inclusion or exclusion of 'http://'
  $url = variable_get('islandora_solr_search_block_url', 'localhost:8080/solr') . '';
  $pathParts = parse_url($url);
  $path = 'http://' . $pathParts['host'] . ':' . $pathParts['port'] . $pathParts['path'];
  $test = @fopen($path, "r");
  if ($test) {
    return true;
  }
  return false;
}

function get_handlers() {
  $url = variable_get('islandora_solr_search_block_url', 'localhost:8080/solr') . '/admin/file/?file=solrconfig.xml';
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
  curl_setopt($ch, CURLOPT_URL, $url);
  $xml = simplexml_load_string(curl_exec($ch));
  foreach ($xml->requestHandler as $handler) {
    if ($handler['class'] == 'solr.SearchHandler') {
      $handlers[(string) $handler['name']] = (string) $handler['name'];
    }
  }
  return $handlers;
}

