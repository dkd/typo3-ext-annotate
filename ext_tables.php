<?php
if (!defined('TYPO3_MODE')) {
	die('Access denied.');
}

if (TYPO3_MODE === 'BE') {
    /**
     * Registers a Backend Module
     */
    \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerModule(
        'Dkd.' . $_EXTKEY,
        'tools',	 // Make module a submodule of 'tools'
        'search',	// Submodule key
        '',						// Position
        array(
            'Search' => 'index',
        ),
        array(
            'access' => 'user,group',
            'icon'   => 'EXT:' . $_EXTKEY . '/ext_icon.gif',
            'labels' => 'LLL:EXT:' . $_EXTKEY . '/Resources/Private/Language/locallang_search.xlf',
        )
    );

}

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile($_EXTKEY, 'Configuration/TypoScript', 'Annotate');
