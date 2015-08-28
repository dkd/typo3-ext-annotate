<?php

if (!defined('TYPO3_MODE')) {
    die('Access denied.');
}

$TYPO3_CONF_VARS['EXTCONF']['rtehtmlarea']['plugins']['Annotate'] = array();
$TYPO3_CONF_VARS['EXTCONF']['rtehtmlarea']['plugins']['Annotate']['objectReference'] = '&Dkd\\Annotate\\HtmlAreaPlugin';
$TYPO3_CONF_VARS['EXTCONF']['rtehtmlarea']['plugins']['Annotate']['addIconsToSkin'] = 1;
$TYPO3_CONF_VARS['EXTCONF']['rtehtmlarea']['plugins']['Annotate']['disableInFE'] = 1;

if (TYPO3_MODE === 'BE') {
    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::registerExtDirectComponent(
        'TYPO3.Annotate.Server',
        'Dkd\\Annotate\\Server'
    );
}