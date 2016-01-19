<?php
return [
    'annotate_ontoaut' => [
        'path'=> '/annotate/ontoaut',
        'target'=> Dkd\Annotate\Controller\RemoteController::class. '::ontoaut'
    ],
    'annotate_annotate' => [
        'path'=> '/annotate/annotate',
        'target'=> Dkd\Annotate\Controller\RemoteController::class. '::annotate'
    ],
    'annotate_index' => [
        'path'=> '/annotate/index',
        'target'=> Dkd\Annotate\Controller\RemoteController::class. '::index'
    ],
    'annotate_resolveId' => [
        'path'=> '/annotate/resolveId',
        'target'=> Dkd\Annotate\Controller\RemoteController::class. '::resolveId'
    ],
    'annotate_query' => [
        'path'=> '/annotate/query',
        'target'=> Dkd\Annotate\Controller\RemoteController::class. '::query'
    ]
];