<?php
namespace Dkd\Annotate;
use TYPO3\CMS\Extbase\Configuration\ConfigurationManagerInterface;
use TYPO3\CMS\Extbase\Reflection\ObjectAccess;

/**
 * Annotation Configuration
 *
 * Contains the master API for other code to interact
 * or acquire other interaction APIs for CMIS.
 */
class Configuration implements \TYPO3\CMS\Core\SingletonInterface {

    /**
     * Configuration array
     *
     * @var array
     */
    protected $settings = null;

    function __construct()
    {
        $this->settings =$confArray = unserialize($GLOBALS['TYPO3_CONF_VARS']['EXT']['extConf']['annotate']);
    }

    /**
     * Get Mimir Index Host+Port
     *
     * @return string
     */
    public function getMimirIndex()
    {
        return $this->settings['mimirIndex'];
    }

    /**
     * Get Mimir Query Host+Port
     *
     * @return string
     */
    public function getMimirQuery()
    {
        return $this->settings['mimirQuery'];
    }

    /**
     * Get Mimir Database ID
     *
     * @return string
     */
    public function getMimirDatabase()
    {
        return $this->settings['mimirDatabase'];
    }

    /**
     * Get Annotation Host
     *
     * @return string
     */
    public function getAnnotationHost()
    {
        return $this->settings['annotateHost'];
    }

    /**
     * Get Annotation Host
     *
     * @return string
     */
    public function getOntoautHost()
    {
        return $this->settings['ontoautHost'];
    }
}
