<?php
namespace Dkd\Annotate;
/**
 * htmlAreaRTE plugin for semantic annotations
 *
 * @author    Johannes Goslar <johannes.goslar@dkd.de>
 */
class HtmlAreaPlugin extends \TYPO3\CMS\Rtehtmlarea\RteHtmlAreaApi {

    protected $extensionKey = 'annotate';

    protected $pluginName = 'Annotate';

    protected $relativePathToLocallangFile = '';

    protected $relativePathToSkin = 'Resources/Public/Skin/htmlarea.css';

    protected $pluginButtons = 'annotate';

    protected $convertToolbarForHtmlAreaArray = array(
        'annotate' => 'annotate'
    );

    protected $requiredPlugins = 'InlineElements';

    protected $elementUid = '';

    protected $elementTable = '';

    /**
     * FIXME: Development RTE Config is Wonky
     */
    public function addButtonsToToolbar() {
        $this->htmlAreaRTE->thisConfig["showButtons"] = "*";
        return parent::addButtonsToToolbar();
    }

    public function main($parentObject) {
        parent::main($parentObject);

        //provide editing with ids for backlinking
        $this->elementTable = $parentObject->elementParts[0];
        $this->elementUid = $parentObject->elementParts[1];

        return TRUE;
    }

    public function buildJavascriptConfiguration($RTEcounter) {
        $registerRTEinJavascriptString = parent::buildJavascriptConfiguration($RTEcounter);

        //provide editing with ids for backlinking
        $registerRTEinJavascriptString .= 'RTEarea[' . $RTEcounter . '].buttons.annotate.uid = "' . ($this->elementUid ?: 'null').'";';
        $registerRTEinJavascriptString .= 'RTEarea[' . $RTEcounter . '].buttons.annotate.table = "' . ($this->elementTable ?: 'null').'";';

        //add special css to edited htmldocument
        $documentcss = \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::siteRelPath($this->extensionKey) . 'Resources/Public/Skin/document.css';
        $registerRTEinJavascriptString .= 'RTEarea[' . $RTEcounter . '].documentcssPath = "../' . $documentcss . '";';

        return $registerRTEinJavascriptString;
    }
}