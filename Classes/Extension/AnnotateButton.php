<?php

namespace TYPO3\CMS\gateannotator\Extension;

class AnnotateButton extends \TYPO3\CMS\Rtehtmlarea\RteHtmlAreaApi {

    protected $extensionKey = 'gateannotator';

    protected $pluginName = 'AnnotateButton';

    protected $relativePathToLocallangFile = '';

    protected $relativePathToSkin = 'extensions/AnnotateButton/skin/htmlarea.css';

    protected $pluginButtons = 'AnnotateButton';
    protected $convertToolbarForHtmlAreaArray = array('AnnotateButton' => 'AnnotateButton');

    protected $requiredPlugins = 'AnnotateButton';

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
        $this->htmlAreaRTE->thisConfig["showButtons"] = "*";
        //Add only buttons not yet in the default toolbar order
        $addButtons = implode(',', array_diff(\TYPO3\CMS\Core\Utility\GeneralUtility::trimExplode(',', $this->pluginButtons, TRUE), \TYPO3\CMS\Core\Utility\GeneralUtility::trimExplode(',', $this->htmlAreaRTE->defaultToolbarOrder, TRUE)));
        return ($addButtons ? 'AnnotateButton,' : '') . $this->htmlAreaRTE->defaultToolbarOrder;
    }

    public function buildJavascriptConfiguration($RTEcounter) {
        $registerRTEinJavascriptString = parent::buildJavascriptConfiguration($RTEcounter);
        $registerRTEinJavascriptString .= 'RTEarea[' . $RTEcounter . '].buttons.AnnotateButton.uid = "' . ($this->elementUid ?: 'null').'";';
        return $registerRTEinJavascriptString . 'RTEarea[' . $RTEcounter . '].buttons.AnnotateButton.table = "' . ($this->elementTable ?: 'null').'";';
    }
}