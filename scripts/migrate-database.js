#!/usr/bin/env node

require('dotenv').config();

const fs = require('fs');
const Postgrator = require('js-base-lib/lib/Postgrator');
Postgrator(__dirname + '/../database');
