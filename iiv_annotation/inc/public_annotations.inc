<?
// $Id$

/*
 * @file public_annotations.inc
 */

/**
 * Public annotation acquisition and saving
 * Based on tagging.inc from Islandora by aoneill
 *
 * @author avessey
 */
class AnnotationSet {
  public $annotations = array();
  public $item = NULL;
  public $annotationsDSID = 'ANNOTATIONS';
  public $iiv_id = NULL;

  function AnnotationSet($item = NULL) {
    if (!empty($item) && get_class($item) == 'Fedora_Item') {
      $this->item = $item;
	  $this->iiv_id = variable_get('iiv_annotation_id', 'ID_NOT_SET');
      $this->load();
    }
  }

  function load() {
    $annosxml = isset($this->item->datastreams[$this->annotationsDSID])? $this->item->get_datastream_dissemination($this->annotationsDSID) : NULL;
    if (empty($annosxml)) {
      $this->annotations = array();
      return FALSE;
    }
	
    $annodoc = new DOMDocument();
    $annodoc->loadXML($annosxml);
    $annotations = $annodoc->getElementsByTagName('annotation');
    foreach ($annotations as $anno) 
	{
		$anno_iiv_id = $anno->getAttribute('did');
		$anno_info = explode('-', $anno_iiv_id);
		
		$creator = $anno->getElementsByTagName('creator')->item(0);
		
		$this->annotations[] = array(
			'db_aid' => $anno_iiv_id,
			'aid' => ((strcmp($anno_info[0], $this->iiv_id) == 0)?($anno_info[1]):$anno_iiv_id),
			'pid' => $this->item->pid,
			'name' => $creator->getAttribute('name'),
			'uid' => $creator->getAttribute('uid'),
			'annotation_text' => check_plain($anno->getElementsByTagName('text')->item(0)->textContent),
			'annotation_location_size' => check_plain($anno->getElementsByTagName('coords')->item(0)->textContent),
			'public' => '1',
			'timestamp' => $creator->getAttribute('time')
		);
    }
  }

  /**
   * Saves an associative array of annotations to a datastream.
   *	Have call during deconstructor? (Assuming PHP5)
   */
  function save() {
    $annodoc = new DomDocument();
    $root_anno = $annodoc->createElement('annotations');
    $annodoc->appendChild($root_anno);
	
    foreach ($this->annotations as $anno)
	{
		if(strcmp($anno['public'], '1') == 0)
		{
			$anno_node = $annodoc->createElement('annotation');			//Create annotation node
			$anno_node->setAttribute('did', $anno['db_aid']);
			
			$creator_node = $annodoc->createElement('creator');			//Create creator node...
			$creator_node->setAttribute('uid', $anno['uid']);			//... and set it up...
			$creator_node->setAttribute('name', $anno['name']);
			$creator_node->setAttribute('time', $anno['timestamp']);
			$anno_node->appendChild($creator_node);						//... and append the creator node
																		//	to the annotation
			
			$coord_node = $annodoc->createElement('coords', $anno['annotation_location_size']);
			$anno_node->appendChild($coord_node);
			
			$text_node = $annodoc->createElement('text', $anno['annotation_text']);
			$anno_node->appendChild($text_node);
			
			$root_anno->appendChild($anno_node);
		}
    }
    try {
      $datastreams = $this->item->get_datastreams_list_as_array();
      if (empty($datastreams[$this->annotationsDSID])) {
        $this->item->add_datastream_from_string($annodoc->saveXML(), $this->annotationsDSID, 'Annotations', 'text/xml', 'X');
      }
      else {
        $this->item->modify_datastream_by_value($annodoc->saveXML(), $this->annotationsDSID, 'Annotations', 'text/xml', 'X');
      }
    }
    catch (exception $e) {
      drupal_set_message('There was an error saving the annotations datastream: !e', array('!e' => $e), 'error');
      return FALSE;
    }
    return TRUE;
  }
  
  // Convenience function; adds an annotation with the given parameters to the array.
  function addAnnotation($aid, $uid, $username, $coords, $text, $time)
  {
	//"Ensure" that all data is provided
	if(!empty($aid) && !empty($uid) && !empty($username) && !empty($coords) && !empty($text) && !empty($time))
	{
		//Add to the array.
		$this->annotations[] = array(
			'db_aid' => $this->iiv_id . '-' . $aid,
			'aid' => $aid,
			'pid' => $item,
			'name' => $username,
			'uid' => $uid,
			'annotation_text' => check_plain($text),
			'annotation_location_size' => $coords,
			'public' => '1',
			'timestamp' => $time
		);
	}
  }
  
  function deleteAnnotation($aid)
  {
	//Dumb linear search for the specified annotation...
	for($i = 0; $i < sizeof($this->annotations); $i++)
	{
		if($this->annotations[$i]['aid'] == $aid)
		{
			//Round about way to delete the annotation
			$a = array_slice($this->annotations, 0, $i);
			$b = array_slice($this->annotations, $i + 1);
			$this->annotations = array_merge($a, $b);
			return true;
		}	
	}
	return false;
  }
}
