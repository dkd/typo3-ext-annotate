<?php

if (!defined('TYPO3_MODE')) {
    die('Access denied.');
}

$TYPO3_CONF_VARS['EXTCONF']['rtehtmlarea']['plugins']['AnnotateButton'] = array();
$TYPO3_CONF_VARS['EXTCONF']['rtehtmlarea']['plugins']['AnnotateButton']['objectReference'] = '&TYPO3\\CMS\\gateannotator\\Extension\\AnnotateButton';
$TYPO3_CONF_VARS['EXTCONF']['rtehtmlarea']['plugins']['AnnotateButton']['addIconsToSkin'] = 1;
$TYPO3_CONF_VARS['EXTCONF']['rtehtmlarea']['plugins']['AnnotateButton']['disableInFE'] = 1;

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::registerExtDirectComponent(
    'TYPO3.GATE.Server',
    'TYPO3\\CMS\\gateannotator\\Server'
);