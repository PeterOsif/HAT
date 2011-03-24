The islandora_solr_search module allows users of the Islandora fedora repository
to search their Fedora Repository with a properly configured Solr instance.

The code in this module is dependant on Conduit IT's Solr PHP client, available from
http://code.google.com/p/solr-php-client

solr-php-client one-liner:
$ curl http://solr-php-client.googlecode.com/files/SolrPhpClient.r22.2009-11-09.tgz | tar xz && mv SolrPhpClient/Apache/Solr . && rm -Rf SolrPhpClient

This code used to display search results can be modified through an external customization
module.  Islandora_solr_config has been included as a template to show how this is done.
