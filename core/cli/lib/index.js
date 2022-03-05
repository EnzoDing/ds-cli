'use strict';

const pkg = require('../package.json')
const log = require('@ds-cli/log')

module.exports = core;

function core() {
    // 1 检查 package.json 版本号
    checkPkgVersion()
}

function checkPkgVersion() {
    log.info('checking version:', pkg.version)
}
