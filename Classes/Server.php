<?php
namespace TYPO3\CMS\gateannotator;

class Server {
    
    private $client = null;

    function __construct() {       
        // $path = \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::extPath('gateannotator') . 'Resources/Private/guzzle.phar';
        // require_once($path);

        $this->client = new \GuzzleHttp\Client(
            [
                'base_url' => "http://gate:8089/",
                'defaults' => [
                    'query'   => [
                        //'annotationSetName' => 'Shef',
                        'annotationType' => 'Mention',
                        'featureName' => 'inst',
                        'gate.export.format' => 'gate.corpora.export.HTMLOutput'
                    ],
                ]]);
    }

    function annotate($text,$table,$uid) {
        $ret = $this->client->get('/ggws/service', ['query' => [
            'text' => $text,
            'gate.mimir.uri' => "http://localhost:8081/typo3/alt_doc.php?edit[$table][$uid]=edit"
        ]]);
        //force mimir to annotate immediately
        // xdebug_break();
        // $resync = (string) $this->client->get('/mimir-cloud-5.1-SNAPSHOT/admin/actions/78f58cf4-5fd7-4093-aedb-d0d67c4a9c60/sync', ['auth' => ['admin', 'admin']]);    
        return (string) $ret;
    }

    /**
     * @param $extjsParams
     * @param $table
     * @param $uid
     * @return string
     */
    public function someFunction($input,$table,$uid)
    {
        $annotated = $this->annotate($input,$table,$uid);

        preg_match("/<body.*\/body>/s", $annotated, $body);

        $xml = new \DOMDocument();
        libxml_use_internal_errors(true);
        $xml->loadHTML($body[0]);

        $xslt = new \DOMDocument();
        $xslt->load(\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::extPath('gateannotator') . 'Resources/Private/transform.xslt');

        $proc = new \XSLTProcessor();
        $proc->importStylesheet($xslt);
        $result = $proc->transformToDoc($xml);

        $string = $result->saveXML();

        preg_match("/<body.*?>(.*)<\/body>/", $annotated, $body);

        return $body[1];
    }
}
