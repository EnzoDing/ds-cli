'use strict';

const path = require('path')
const userHome = require('user-home')

const Package = require('@ds-cli/package')
const log = require('@ds-cli/log')

const COMMANDS = {
    init: '@imooc-cli/init'
}
async function exec() {
    let pkg
    let targetPath = process.env.CLI_TARGET_PATH
    let storedPath = ''
    const cmd = arguments[arguments.length - 1]
    const cmdName = COMMANDS[cmd.name()]

    // 是否执行本地代码
    if (!targetPath) {
        // 获取缓存目录
        targetPath = path.resolve(userHome, '.ds-cli')
        storedPath = path.resolve(targetPath, 'node_modules')

        // 初始化Package对象
        pkg = new Package({
            targetPath: targetPath,
            storedPath: storedPath,
            name: cmdName,
            version: '1.1.0'
        })

        // package是否存在
        if (await pkg.exists()) {
            // 存在 -> 更新package
            await pkg.update()
        } else {
            // 不存在 -> 安装package
            await pkg.install()
        }
    } else {
        pkg = new Package({
            targetPath: targetPath,
            name: cmdName,
            version: 'latest'
        })
    }

    // 获取本地代码入口文件
    const rootFile = pkg.getRootFilePath()

    if (rootFile) {
        try {
            require(rootFile)(Array.from(arguments))
        } catch (e) {
            log.error(e.message)
        }
    }
}
module.exports = exec;
