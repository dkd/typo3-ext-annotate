<?php
$path = '/Users/dkd-goslar/dkd/andemo/typo3conf/ext/gateannotator/Resources/Private/guzzle.phar';
require_once($path);
        
$client = new \GuzzleHttp\Client(
    [
        'base_url' => "http://services.gate.ac.uk/",
        'defaults' => [
            'query'   => [
                'annotationSetName' => 'Shef',
                'annotationType' => 'Mention',
                'featureName' => 'inst',
                'gate.export.format' => 'gate.corpora.export.HTMLOutput',
            ],
        ]
    ]
);
$annotated = $client->get('/yodie/service', ['query' => ['text' => 'Angela Merkel lives in Berlin']]);

preg_match("/<body.*\/body>/s", $annotated, $body);

$xml = new \DOMDocument();
libxml_use_internal_errors(true);
$xml->loadHTML($body[0]);

$xslt = new \DOMDocument();
$xslt->load("transform.xslt");

$proc = new XSLTProcessor();
$proc->importStylesheet($xslt);
$result = $proc->transformToDoc($xml);

$string = $result->saveXML();

preg_match("/<body.*?>(.*)<\/body>/", $annotated, $body);

return $body;

