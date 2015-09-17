<?php
namespace Dkd\Annotate;
use Dkd\Annotate\Configuration;
/**
 * Server Endpoint Wrapper for Annotate
 * At the moment do a straight call to gate
 * @author    Johannes Goslar <johannes.goslar@dkd.de>
 */
class Server {
    /**
     * getAnnotationHost call for actually annotating text
     * @param $input Text to be Annotated
     * @return string annotated text
     */
    private function annotateRemotely($text)
    {
        $configuration = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance('Dkd\\Annotate\\Configuration');
        $remote = new \GuzzleHttp\Client(['base_url' => $configuration->getAnnotationHost()]);
        $ret = $remote->get('/gate/service', ['query' => [
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
     * Get internal mimir count
     * @return current count
     */
    private function getMimirIdCount()
    {
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
        return $count;
    }

    /**2
     * Set internal mimir count
     * @param $count new Value
     */
    private function setMimirIdCount($count)
    {
        $record = $GLOBALS['TYPO3_DB']->exec_UPDATEquery(
            'tx_annotate_id_count',
            "1=1",
            array(
                'count' => $count
            )
        );
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
        $configuration = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance('Dkd\\Annotate\\Configuration');
        $remote = new \GuzzleHttp\Client(['base_url' => $configuration->getMimirIndex()]);
        $ret = $remote->get('/gate/service', ['query' => [
            'text' => $content,
            //not really needed but default is the not present rdfaexporter, so we set it to something
            'gate.export.format' => 'gate.corpora.export.GateXMLExporter'
        ]]);

        $oldId = $this->mimirGetId($table, $id);
        if ($oldId != null)
        {
            $remote2 = new \GuzzleHttp\Client(['base_url' => $configuration->getMimirQuery()]);
            $delete = $remote2->get(sprintf('mimir-cloud/admin/actions/%s/doDeleteOrUndelete', $configuration->getMimirDatabase()), ['query' => [
                'documentIds' => $oldId,
                'operation' => 'delete'
            ], 'auth' => [
                'admin', 'abcdefg'
            ]]);
        }

        $count = $this->getMimirIdCount();
        $this->mimirStoreId($table, $id, $count);
        $this->setMimirIdCount($count+1);

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
        $configuration = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance('Dkd\\Annotate\\Configuration');
        $remote = new \GuzzleHttp\Client(['base_url' => $configuration->getMimirQuery()]);
        $ret = $remote->get('/mimir-cloud/1/search/' . $action, ['query' => $extractedargs]);
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
     * Ext.Direct wrapper for TYPO3.Annotate.Server.mimirSetIdCount
     * to be called when the index is reset
     * @param $count new count
     * @return new count
     */
    public function mimirSetIdCount($count)
    {
        $this->setMimirIdCount($count);
        return $count;
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
