<?php
namespace Dkd\Annotate\ViewHelpers;

class RequireJSViewHelper extends  \TYPO3\CMS\Fluid\ViewHelpers\Be\AbstractBackendViewHelper {

    public function render() {
        $doc = $this->getDocInstance();
        $pageRenderer = $doc->getPageRenderer();
        $pageRenderer->loadJquery();
        $pageRenderer->loadRequireJs();

        $output = $this->renderChildren();
        $output = $doc->startPage("title") . $output;
        $output .= $doc->endPage();

        return $output;
    }
}