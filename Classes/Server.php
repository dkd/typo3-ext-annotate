<?php
namespace Dkd\Annotate;
/**
 * Server Endpoint Wrapper for Annotate
 * At the moment do a straight call to gate
 * @author    Johannes Goslar <johannes.goslar@dkd.de>
 */
class Server {

    private $client = null;

    function __construct()
    {
        $this->client = new \GuzzleHttp\Client(['base_url' => "http://gate:8089/"]);
    }

    /**
     * Server call for actually annotating text
     * @param $input Text to be Annotated
     * @param $table TableId of the edited text
     * @param $uid uid of the edited text
     * @return string annotated text
     */
    function annotate($text,$table,$uid)
    {
        $ret = $this->client->get('/gate/service', ['query' => [
            'text' => $text
            //'gate.mimir.uri' => "http://localhost:8081/typo3/alt_doc.php?edit[$table][$uid]=edit"
        ]]);
        //force mimir to annotate
        // $resync = (string) $this->client->get('/mimir-cloud-5.1-SNAPSHOT/admin/actions/78f58cf4-5fd7-4093-aedb-d0d67c4a9c60/sync', ['auth' => ['admin', 'admin']]);
        return (string) $ret->getBody();
    }

    /**
     * Ext.Direct wrapper for annotating Text TYPO3.Annotate.Server.annotateText
     * @param $input Text to be Annotated
     * @param $table TableId of the edited text
     * @param $uid uid of the edited text
     * @return string annotated text
     */
    public function annotateText($input,$table,$uid)
    {
        $annotated = $this->annotate($input,$table,$uid);
        return $annotated;
    }
}
