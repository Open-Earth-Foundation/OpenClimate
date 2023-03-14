#!/bin/bash

echo <<<$END_OF_HERE > /app/public/config.json
{
    "matomoserver": "${MATOMO_SERVER}",
    "apiserver": "${API_SERVER}"
}
END_OF_HERE

exec nginx -g daemon off