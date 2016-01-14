<?php
namespace Dkd\Annotate\Controller;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;

/**
 * Search Controller of the Annotate extension
 *
 * @category    Controller
 */
class OntoautController extends ActionController
{
    /**
     * index action for this controller.
	 * @return void
	 */
    public function indexAction()
    {
    }

    /**
     * index action for this controller.
     * @return void
     */
    public function relay(ServerRequestInterface $request, ResponseInterface $response)
    {
        $response->getBody()->write(json_encode(['message' => 'relayed']));
        return $response;
    }
}
