#!/bin/bash

cd ${DEPLOYDIR}/new

BRANCH=$(git rev-parse --abbrev-ref HEAD)
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://raw.githubusercontent.com/meedan/check-api/${BRANCH}/public/relay.json)

# if it's 404, then grab the one from `develop` branch
if [ $STATUS == "404" ]; then
    BRANCH=develop
fi
curl https://raw.githubusercontent.com/meedan/check-api/${BRANCH}/public/relay.json -o ${DEPLOYDIR}/latest/relay.json

sed "s|https://raw.githubusercontent.com/meedan/check-api/develop/public/relay.json|${DEPLOYDIR}/latest/relay.json|" < config-build.js.example > ${DEPLOYDIR}/latest/config-build.js
