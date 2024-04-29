#!/bin/bash -e

if [ -z "$BASE_API_URL" ]; then
    echo "Error: BASE_API_URL environment variable is not set"
    exit 1
fi

if [ -z "$TERMS_URL" ]; then
    echo "Error: TERMS_URL environment variable is not set"
    exit 1
fi

baseApiUrl=$BASE_API_URL
termsUrl=$TERMS_URL

jsonTemplate='{"baseApiUrl": "%s", "termsUrl": "%s"}'
jsonContent=$(printf "$jsonTemplate" "$baseApiUrl" "$termsUrl")

echo $jsonContent > /usr/share/nginx/html/assets/config/config.json
