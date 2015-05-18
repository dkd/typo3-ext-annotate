<?php

namespace Dkd\Annotate;

class HtmlAreaPlugin extends \TYPO3\CMS\Rtehtmlarea\RteHtmlAreaApi {

    protected $extensionKey = 'annotate';

    protected $pluginName = 'Annotate';
    
    protected $requiredPlugins = 'Annotate';

    protected $relativePathToLocallangFile = '';

    protected $relativePathToSkin = 'Resources/public/skin/htmlarea.css';

    protected $pluginButtons = 'annotateAuto, annotateHighlight';
    protected $convertToolbarForHtmlAreaArray = array(
        'annotateAuto' => 'annotateAuto',
        'annotateHighlight' => 'annotateHighlight'
    );

    protected $elementUid = '';

    protected $elementTable = '';
     
    public function main($parentObject) {
        parent::main($parentObject);
        $this->elementTable = $parentObject->elementParts[0];
        $this->elementUid = $parentObject->elementParts[1];
        return TRUE;
    }

    public function addButtonsToToolbar() {
        //xdebug_break();
        //array_unshift($this->htmlAreaRTE->thisConfig["showButtons"],"AnnotateButton");
        //$this->htmlAreaRTE->thisConfig["showButtons"] = "*";
        //Add only buttons not yet in the default toolbar order
        $addButtons = implode(',', array_diff(\TYPO3\CMS\Core\Utility\GeneralUtility::trimExplode(',', $this->pluginButtons, TRUE), \TYPO3\CMS\Core\Utility\GeneralUtility::trimExplode(',', $this->htmlAreaRTE->defaultToolbarOrder, TRUE)));
        return ($addButtons ? $this->pluginButtons . ',' : '') . $this->htmlAreaRTE->defaultToolbarOrder;
    }

    public function buildJavascriptConfiguration($RTEcounter) {
        $registerRTEinJavascriptString = parent::buildJavascriptConfiguration($RTEcounter);
        $registerRTEinJavascriptString .= 'RTEarea[' . $RTEcounter . '].buttons.annotateAuto.uid = "' . ($this->elementUid ?: 'null').'";';
        return $registerRTEinJavascriptString . 'RTEarea[' . $RTEcounter . '].buttons.annotateAuto.table = "' . ($this->elementTable ?: 'null').'";';
    }
}