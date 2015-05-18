<?php
namespace Dkd\Annotate;

class Server {
    
    private $client = null;

    function __construct()
    {
        $this->client = new \GuzzleHttp\Client(['base_url' => "http://gate:8089/"]);
    }

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
     * @param $extjsParams
     * @param $table
     * @param $uid
     * @return string
     */
    public function someFunction($input,$table,$uid)
    {
        $annotated = $this->annotate($input,$table,$uid);
        return $annotated;
    }
}
