<?php

return [
    'paths' => ['api/*'], // API végpontok

    'allowed_methods' => ['*'], // Engedélyezett HTTP metódusok

    'allowed_origins' => ['http://127.0.0.1:8000'], // Engedélyezett origin
    // Vagy ha több origin is van, akkor azokat egy tömbben add meg
    // 'allowed_origins' => ['http://localhost:8000', 'http://127.0.0.1:8000'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'], // Engedélyezett fejlécek

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true, // Engedélyezi a hitelesítést (cookie)
];
