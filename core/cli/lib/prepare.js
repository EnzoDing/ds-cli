'use strict';

const pkg = require('../package.json')
const log = require('@ds-cli/log')
const semver = require('semver')
const colors = require('colors/safe')
const rootCheck = require('root-check')
const userHome = require('user-home')
const pathExists = require('path-exists')
const minimist = require('minimist')
const path = require("path")

// 检查 package.json 版本号
function checkPkgVersion() {
    log.info('package.json version:', pkg.version)
}

// 检查 Node.js 版本号(有些API在低版本中不支持)
function checkNodeVersion() {
    // 1获取当前版本号
    const currentVersion = process.version
    // 2比对最低版本号
    const lowestVersion = '12.0.0'
    if (!semver.gte(currentVersion, lowestVersion)) {
        throw new Error(colors.red(`ds-cli 需要安装 v${lowestVersion}以上版本的 Node.js`))
    } else {
        log.info('Node.js version:', currentVersion)
    }
}

// 检查是否为root账户(root用户 uid为0，如果是root需要降级为普通用户)
function checkRoot() {
    rootCheck()
}

// 检查用户目录
function checkUserHome() {
    if (!userHome || !pathExists.sync(userHome)) {
        throw new Error(colors.red(`user home not found`))
    }
}

// 检查环境变量
function checkEnv() {
    // 将环境变量从 .env -> process.env
    const dotenv = require('dotenv')
    const envPath = path.resolve(userHome, '.env')
    if (pathExists.sync(envPath)) {
        dotenv.config({
            path: envPath
        })
    }
    createDefaultConfig()
    log.info('cli cache home', process.env.CLI_HOME_PATH)
}
function createDefaultConfig() {
    const cli_config = {
        home: userHome
    }
    if (process.env.CLI_HOME) {
        cli_config['cliHome'] = path.join(userHome, process.env.CLI_HOME)
    } else {
        cli_config['cliHome'] = path.join(userHome, '.ds-cli')
    }
    process.env.CLI_HOME_PATH = cli_config.cliHome
}

function prepare() {
    checkPkgVersion()
    checkNodeVersion()
    checkRoot()
    checkUserHome()
    checkEnv()
}

module.exports = prepare
