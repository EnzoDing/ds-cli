#! /usr/bin/env node

const importLocal = require('import-local')
const log = require('@ds-cli/log')

if(importLocal(__filename)) {
    // 本地项目的node_modules中如果存在库则 使用本地库而非全局库
    log.info('cli', '正在使用 ds-cli 本地版本')
} else {
    require('../lib')(process.argv.slice(2))
}
