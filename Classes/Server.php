<?php
namespace Dkd\Annotate;
/**
 * Server Endpoint Wrapper for Annotate
 * At the moment do a straight call to gate
 * @author    Johannes Goslar <johannes.goslar@dkd.de>
 */
class Server {

    private $gate = null;
    private $mimir = null;

    function __construct()
    {
        $this->gate = new \GuzzleHttp\Client(['base_url' => "http://gate:8089/"]);
        $this->mimirIndex = new \GuzzleHttp\Client(['base_url' => "http://mimir:8080/"]);
        $this->mimirQuery = new \GuzzleHttp\Client(['base_url' => "http://mimir:8091/"]);
    }

    /**
     * Server call for actually annotating text
     * @param $input Text to be Annotated
     * @return string annotated text
     */
    private function annotateRemotely($text)
    {
        $ret = $this->gate->get('/gate/service', ['query' => [
            'text' => $text
        ]]);
        return (string) $ret->getBody();
    }

    /**
     * Ext.Direct wrapper for annotating Text TYPO3.Annotate.Server.annotateText
     * @param $input Text to be Annotated
     * @return string annotated text
     */
    public function annotateText($input)
    {
        $annotated = $this->annotateRemotely($input);
        return $annotated;
    }

    /**
     * Server call for actually indexing text
     * @param $input Text to be Annotated
     * @param $table TableId of the edited text
     * @param $uid uid of the edited text
     * @return string annotated text
     */
    private function indexRemotely($text,$table,$uid)
    {
        $ret = $this->mimirIndex->get('/gate/service', ['query' => [
            'text' => $text,
            'gate.mimir.uri' => "[$table][$uid]",
            'gate.export.format' => 'gate.corpora.export.GateXMLExporter'
        ]]);
        //force mimir to annotate
        // $resync = (string) $this->client->get('/mimir-cloud-5.1-SNAPSHOT/admin/actions/78f58cf4-5fd7-4093-aedb-d0d67c4a9c60/sync', ['auth' => ['admin', 'admin']]);
        return (string) $ret->getBody();
    }

    /**
     * Ext.Direct wrapper for TYPO3.Annotate.Server.indexText
     * @param $input Text to be Annotated
     * @param $table TableId of the edited text
     * @param $uid uid of the edited text
     * @return string indexed document
     */
    public function index($text,$table,$uid)
    {
        return $this->indexRemotely($text,$table,$uid);
    }

    /**
     * Ext.Direct wrapper for TYPO3.Annotate.Server.MimirURL
     * @param $action mimir verb
     * @param $args dictionary of query args
     * @return string result
     */
    public function mimirQuery($action, $args)
    {
        $extractedargs = get_object_vars($args);
        $ret = $this->mimirQuery->get('/mimir-cloud/1/search/'.$action, ['query' => $extractedargs]);
        $xml_string = (string) $ret->getBody();
        if (!$extractedargs["keepOriginal"])
        {
            $xml = simplexml_load_string($xml_string);
            $json = json_encode($xml);
            return $json;
        }
        return json_encode($xml_string);
    }
}
