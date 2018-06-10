#!/usr/bin/env bash

./node_modules/concurrently/src/main.js \
"./node_modules/nodemon/bin/nodemon.js --exec "./node_modules/truffle/build/cli.bundled.js compile" --watch contracts -e .sol" \
"./node_modules/truffle/build/cli.bundled.js develop" \
"next dev" \
"./node_modules/nodemon/bin/nodemon.js --watch server server.js"
