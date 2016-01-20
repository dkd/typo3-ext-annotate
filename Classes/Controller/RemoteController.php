<?php
namespace Dkd\Annotate\Controller;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;
use TYPO3\CMS\Backend\Utility\BackendUtility;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Remote Controller of the Annotate extension
 * Forwarding requests to other services through TYPO3
 *
 * @category    Controller
 */
class RemoteController extends ActionController
{
    /**
     * index action for this controller.
	 * @return void
	 */
    public function indexAction()
    {
    }

    /**
     * intern remotecall for actually annotating text
     * @param $input text to be annotated
     * @return string annotated text
     */
    private function annotateIntern($text)
    {
        $configuration = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance('Dkd\\Annotate\\Configuration');
        $remote = new \GuzzleHttp\Client(['base_url' => $configuration->getAnnotationHost()]);
        $ret = $remote->get('/gate/service', ['query' => [
            'text' => $text
        ]]);
        return (string) $ret->getBody();
    }

    /**
     */
    public function annotate(ServerRequestInterface $request, ResponseInterface $response)
    {
        $params = $request->getParsedBody();

        $text = $params['text'];
        $annotated = $this->annotateIntern($text);
        $response->getBody()->write(json_encode($annotated));

        return $response;
    }

    /**
     * Server call for actually indexing text
     * @param $table table of the edited text
     * @param $id id of the edited text
     * @param $content to be indexed
     * @return string indexed document
     */
    private function indexIntern($table, $id, $content)
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
     * Remote wrapper for indexing to Mimir
     */
    public function index(ServerRequestInterface $request, ResponseInterface $response)
    {
        $params = $request->getParsedBody();

        $table = $params['tablename'];
        $id = $params['id'];
        $content = $params['content'];

        $xml_string = $this->indexIntern($table, $id, $content);
        $xml = simplexml_load_string($xml_string);
        $json = json_encode($xml);

        $response->getBody()->write($json);
        return $response;
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

    /**
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
     * mimirGetId for TYPO3 tablename and element
     * @param $tablename TYPO3 tablename
     * @param $uid TYPO3 uid
     * @return mimirId
     */
    private function mimirGetId($tablename, $uid)
    {
        $record = $GLOBALS['TYPO3_DB']->exec_SELECTgetSingleRow(
            'mimir_id',
            'tx_annotate_ids',
            sprintf('typo3_table = %s AND typo3_uid = %s', $GLOBALS['TYPO3_DB']->fullQuoteStr($tablename, 'tx_annotate_ids'), $GLOBALS['TYPO3_DB']->fullQuoteStr($uid, 'tx_annotate_ids'))
        );
        return ($record == false) ? null : $record["mimir_id"];
    }

    /**
     * store id mapping between mimir and typo3 ids
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

    /**
     * intern resolve id
     * @param $mimirId string
     * @return array [tablename, uid] the resource location
     */
    private function resolveIdIntern($mimirId)
    {
        $record = $GLOBALS['TYPO3_DB']->exec_SELECTgetSingleRow(
            'typo3_table, typo3_uid',
            'tx_annotate_ids',
            sprintf('mimir_id = %s', $GLOBALS['TYPO3_DB']->fullQuoteStr($mimirId, 'tx_annotate_ids'))
        );
        return ($record == false) ? null : $record;
    }

    /**
     */
    public function resolveId(ServerRequestInterface $request, ResponseInterface $response)
    {
        $params = $request->getParsedBody();
        $id= $params['id'];

        $resolved = $this->resolveIdIntern($id);
        if($resolved)
            $resolved['base'] = BackendUtility::getModuleUrl('record_edit');

        $response->getBody()->write(json_encode($resolved));

        return $response;
    }

    /**
     * @param $action mimir verb
     * @param $args dictionary of query args
     * @return string result
     */
    private function queryIntern($action, $args)
    {
        $extractedargs = $args;
        $configuration = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance('Dkd\\Annotate\\Configuration');
        $remote = new \GuzzleHttp\Client(['base_url' => $configuration->getMimirQuery()]);
        $ret = $remote->get('/mimir-cloud/1/search/' . $action, ['query' => $extractedargs]);
        $xml_string = (string) $ret->getBody();
        if (!$extractedargs["keepOriginal"])
        {
            $xml = simplexml_load_string($xml_string);
            return $xml;
        }
        return $xml_string;
    }

    /**
     */
    public function query(ServerRequestInterface $request, ResponseInterface $response)
    {
        $params = $request->getParsedBody();
        $action = $params['verb'];
        $args = $params['args'];

        $result = $this->queryIntern($action, $args);

        $response->getBody()->write(json_encode($result));

        return $response;
    }

    /**
     * This is just a proxy for the ontoaut rpc
     * FIXME: for some reason we cannot directly pass streams in here? needs guzzle-6?
     * not that important for the moment, still interesting to know
     */
    public function ontoaut(ServerRequestInterface $request, ResponseInterface $response)
    {
        $configuration = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance('Dkd\\Annotate\\Configuration');
        $remote = new \GuzzleHttp\Client(['base_url' => $configuration->getOntoautHost()]);

        $text = $request->getBody()->getContents();
        error_log($text);
        $ret = $remote->post('/', [
            'headers'  => ['content-type' => 'application/json', 'Accept' => 'application/json'],
            'body' => $text
        ]);
        $json = $ret->getBody()->getContents();
        error_log($json);
        $response = $response->withHeader('Content-Type', 'json');
        $response->getBody()->write($json);
        return $response;
    }
}
