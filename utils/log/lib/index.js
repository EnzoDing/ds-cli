'use strict';

const log = require('npmlog')

/**
 * npmlog 定制化：
 *  添加heading
 *  添加自定义级别
 *  设置默认级别
 */
log.heading = 'ds-cli'
log.headingStyle = { fg: 'red', bg: 'black' }
log.addLevel('success', 2000, { fg: 'green', bold: true})
log.level = process.env?.LOG_LEVEL ?? 'info'

module.exports = log;
