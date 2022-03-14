'use strict';

const path = require('path')
const { spawn } = require('child_process')
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
            // 在当前进程中执行
            // require(rootFile)(Array.from(arguments))

            // 子进程中执行
            _childProcessRequire(rootFile, arguments)
        } catch (e) {
            log.error(e.message)
        }
    }
}

function _childProcessRequire(rootFile, _arguments) {
    const args = Array.from(_arguments)
    let cmd = args[_arguments.length - 1]
    cmd = {...cmd, ...cmd.opts()}
    const o = Object.create(null)
    Object.keys(cmd).forEach(key => {
        if (cmd.hasOwnProperty(key) && !key.startsWith('_') && key !== 'parent') {
            o[key] = cmd[key]
        }
    })
    args[args.length - 1] = o

    const code = `require(${JSON.stringify(rootFile)}).call(null,${JSON.stringify(args)})`
    // windows下执行 spawn('cmd', ['/c', 'node', '-e', code])
    const cp = spawn('node', ['-e', code], {
        cwd: process.cwd(),
        stdio: 'inherit'
    })
    cp.on('error', err => {
        log.verbose('命令执行失败: ', e)
    })
    cp.on('exit', e => {
        log.verbose('命令执行完毕: ', e)
    })
}
module.exports = exec;
