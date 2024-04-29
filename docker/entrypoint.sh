#!/bin/bash -e

bash /usr/local/app/generate-config.sh

nginx -g 'daemon off;'
