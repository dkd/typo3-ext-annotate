<?php
if (!defined('TYPO3_MODE')) {
	die('Access denied.');
}

if (TYPO3_MODE === 'BE') {
    \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerModule(
        'Dkd.' . $_EXTKEY,
        'tools',
        'search',
        '',
        array(
            'Search' => 'index',
        ),
        array(
            'access' => 'user,group',
            'icon'   => 'EXT:' . $_EXTKEY . '/Resources/Public/Icons/mimir.svg',
            'labels' => 'LLL:EXT:' . $_EXTKEY . '/Resources/Private/Language/locallang_search.xlf',
        )
    );

    \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerModule(
        'Dkd.' . $_EXTKEY,
        'tools',
        'ontoaut',
        '',
        array(
            'Ontoaut' => 'index',
        ),
        array(
            'access' => 'user,group',
            'icon'   => 'EXT:' . $_EXTKEY . '/Resources/Public/Icons/ontoaut.svg',
            'labels' => 'LLL:EXT:' . $_EXTKEY . '/Resources/Private/Language/locallang_ontoaut.xlf',
        )
    );
}

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile($_EXTKEY, 'Configuration/TypoScript', 'Annotate');
