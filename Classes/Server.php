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
     * @param $table table of the edited text
     * @param $id id of the edited text
     * @param $content to be indexed
     * @return string indexed document
     */
    private function indexRemotely($table, $id, $content)
    {
        $ret = $this->mimirIndex->get('/gate/service', ['query' => [
            'text' => $content,
            //not really needed but default is the not present rdfaexporter, so we set it to something
            'gate.export.format' => 'gate.corpora.export.GateXMLExporter'
        ]]);

        //fix counting
        $count = $GLOBALS['TYPO3_DB']->exec_SELECTgetSingleRow(
            'count',
            'tx_annotate_id_count',
            '1=1'
        );
        $count = $count["count"];
        if ($count == null)
        {
            $record = $GLOBALS['TYPO3_DB']->exec_INSERTquery(
                'tx_annotate_id_count',
                array(
                    'count' => 0
                )
            );
            $count = 0;
        }

        $this->mimirStoreId($table, $id, $count);

        $record = $GLOBALS['TYPO3_DB']->exec_UPDATEquery(
            'tx_annotate_id_count',
            "1=1",
            array(
                'count' => $count + 1
            )
        );

        return (string) $ret->getBody();
    }

    /**
     * Ext.Direct wrapper for TYPO3.Annotate.Server.index
     * @param $table table of the edited text
     * @param $id id of the edited text
     * @param $content to be indexed
     */
    public function index($table, $id, $content)
    {
        $xml_string = $this->indexRemotely($table, $id, $content);
        $xml = simplexml_load_string($xml_string);
        $json = json_encode($xml);
        return $json;
    }

    /**
     * Ext.Direct wrapper for TYPO3.Annotate.Server.mimirQuery
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

    /**
     * Ext.Direct wrapper for TYPO3.Annotate.Server.mimirResolveUuid
     * @param $mimirId string
     * @return array [tablename, uid] the resource location
     */
    public function mimirResolveId($mimirId)
    {
        $record = $GLOBALS['TYPO3_DB']->exec_SELECTgetSingleRow(
            'typo3_table, typo3_uid',
            'tx_annotate_ids',
            sprintf('mimir_id = %s', $GLOBALS['TYPO3_DB']->fullQuoteStr($mimirId, 'tx_annotate_ids'))
        );
        return ($record == false) ? null : $record;
    }

    /**
     * Ext.Direct wrapper for TYPO3.Annotate.Server.mimirGetId
     * @param $tablename TYPO3 tablename
     * @param $uid TYPO3 uid
     * @return mimirId
     */
    public function mimirGetId($tablename, $uid)
    {
        $record = $GLOBALS['TYPO3_DB']->exec_SELECTgetSingleRow(
            'mimir_id',
            'tx_annotate_ids',
            sprintf('typo3_table = %s AND typo3_uid = %s', $GLOBALS['TYPO3_DB']->fullQuoteStr($tablename, 'tx_annotate_ids'), $GLOBALS['TYPO3_DB']->fullQuoteStr($uid, 'tx_annotate_ids'))
        );
        return ($record == false) ? null : $record["mimir_id"];
    }

    /**
 * Ext.Direct wrapper for TYPO3.Annotate.Server.mimirStoreId
 * @param $tablename TYPO3 tablename
 * @param $uid TYPO3 uid
 * @param $mimirId mimirId
 */
public function mimirStoreId($tablename, $uid, $mimirId)
{
    if ($this->mimirGetId($tablename, $uid) != NULL)
        $record = $GLOBALS['TYPO3_DB']->exec_UPDATEquery(
            'tx_annotate_ids',
            sprintf('typo3_table = %s AND typo3_uid = %s', $GLOBALS['TYPO3_DB']->fullQuoteStr($tablename, 'tx_annotate_ids'), $GLOBALS['TYPO3_DB']->fullQuoteStr($uid, 'tx_annotate_ids')),
            array(
                'mimir_id' => $mimirId
            )
        );
    else
        $record = $GLOBALS['TYPO3_DB']->exec_INSERTquery(
            'tx_annotate_ids',
            array(
                'typo3_table' => $tablename,
                'typo3_uid' => $uid,
                'mimir_id' => $mimirId
            )
        );
    return $record;
}
}
