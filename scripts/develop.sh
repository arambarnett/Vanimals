#!/usr/bin/env bash

./node_modules/nodemon/bin/nodemon.js --exec "./node_modules/truffle/build/cli.bundled.js compile" --watch contracts -e .sol
#./node_modules/truffle/build/cli.bundled.js develop
