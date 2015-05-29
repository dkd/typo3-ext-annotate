<?php

namespace Dkd\Annotate;

class HtmlAreaPlugin extends \TYPO3\CMS\Rtehtmlarea\RteHtmlAreaApi {

    protected $extensionKey = 'annotate';

    protected $pluginName = 'Annotate';
    
    protected $relativePathToLocallangFile = '';

    protected $relativePathToSkin = 'Resources/Public/Skin/htmlarea.css';

    protected $pluginButtons = 'annotateAuto, annotateHighlight';
    protected $convertToolbarForHtmlAreaArray = array(
        'annotateAuto' => 'annotateAuto',
        'annotateHighlight' => 'annotateHighlight'
    );

    protected $elementUid = '';

    protected $elementTable = '';
   
    public function addButtonsToToolbar() {
        $this->htmlAreaRTE->thisConfig["showButtons"] = "*";
        return parent::addButtonsToToolbar();
    }
    
    public function main($parentObject) {
        parent::main($parentObject);
        $this->elementTable = $parentObject->elementParts[0];
        $this->elementUid = $parentObject->elementParts[1];
        
        $pageRenderer = $GLOBALS['SOBE']->doc->getPageRenderer();
        $pageRenderer->loadRequireJs();
        $pageRenderer->addRequireJsConfiguration(array(
            "urlArgs" => "bust=" + time()
        ));
        return TRUE;
    }
    
    public function buildJavascriptConfiguration($RTEcounter) {
        $registerRTEinJavascriptString = parent::buildJavascriptConfiguration($RTEcounter);
        $registerRTEinJavascriptString .= 'RTEarea[' . $RTEcounter . '].buttons.annotateAuto.uid = "' . ($this->elementUid ?: 'null').'";';
        $registerRTEinJavascriptString .= 'RTEarea[' . $RTEcounter . '].buttons.annotateAuto.table = "' . ($this->elementTable ?: 'null').'";';
        $documentcss = \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::siteRelPath($this->extensionKey) . 'Resources/Public/Skin/document.css';
        $registerRTEinJavascriptString .= 'RTEarea[' . $RTEcounter . '].documentcssPath = "../' . $documentcss . '";';
        return $registerRTEinJavascriptString;
    }
}