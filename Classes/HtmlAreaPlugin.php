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

    protected $pluginButtons = 'showAnnotate';

    protected $convertToolbarForHtmlAreaArray = array(
        'showAnnotate' => 'showAnnotate'
    );

    protected $requiredPlugins = 'InlineElements';

    public function buildJavascriptConfiguration() {
        $js = array();

        $js[] = 'RTEarea[editornumber].buttons.showAnnotate = new Object();';
        //extract table and id from editor number as our config is not provided with that anymore in 7.6
        $js[] = 'var extractor = editornumber.match(/.*?_(.*?)__(.*?)__.*/i);';
        $js[] = 'RTEarea[editornumber].buttons.showAnnotate.table = extractor[0];';
        $js[] = 'RTEarea[editornumber].buttons.showAnnotate.id = extractor[1];';
        $js[] = 'RTEarea[editornumber].buttons.showAnnotate.wrap = "editorWrap"+editornumber;';

        //add special css to edited htmldocument
        $documentcss = \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::siteRelPath($this->extensionKey) . 'Resources/Public/Skin/document.css';
        $js[] = 'RTEarea[editornumber].buttons.showAnnotate.documentcssPath = "../' . $documentcss . '";';

        //not nice, but the skin attribute is not honored anymore
        $listcss = \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::siteRelPath($this->extensionKey) . 'Resources/Public/Skin/list.css';
        $js[] = 'debugger;';
        $js[] = 'var cssele = document.createElement("link")';
        $js[] = 'cssele.rel = "stylesheet";';
        $js[] = 'cssele.type = "text/css";';
        $js[] = 'cssele.href = "../' . $listcss .'";';
        $js[] = 'document.head.appendChild(cssele);';

        return implode(LF, $js);
    }
}