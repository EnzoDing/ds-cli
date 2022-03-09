'use strict';

const path = require('path')
const pkgDir = require('pkg-dir')
const npminstall = require('npminstall')
const pathExists = require('path-exists')
const fse = require('fs-extra')

const { isObject, formatPath, getLatestVersion } = require('@ds-cli/utils')
const log = require('@ds-cli/log')

class Package {
    constructor(options){
        if(!options) throw new Error('Package Constructor options cannot be empty')
        if (!isObject(options)) throw new Error('Package Constructor options shuuld be Object')

        // package目标路径
        this.targetPath = options.targetPath
        // 缓存路径
        this.storedPath = options.storedPath
        // 包名
        this.name = options.name
        // 包版本号
        this.version = options.version

        log.info('packageInfo', this)
    }

    /**
     * 获取缓存包路径 <br>
     * storedPath: /Users/shengding/.ds-cli/node_modules <br>
     * name: @ds-cli/init <br>
     * @param version 1.1.0
     * @returns {string} /Users/shengding/.ds-cli/node_modules/_@ds-cli_init@1.1.0@ds-cli
     */
    getCacheFilePath(version) {
        return path.resolve(this.storedPath, `_${this.name.replace('/', '_')}@${version}@${this.name}`)
    }

    /**
     * 前置处理 <br>
     * 1 storedPath不存在时，创建文件夹 <br>
     * 2 version为latest时，获取npm包的最新版本号 <br>
     * @returns {Promise<void>}
     */
    async prepare() {
        if (this.storedPath && !pathExists.sync(this.storedPath)) {
            fse.mkdirpSync(this.storedPath)
        }
        if (this.version === 'latest') {
            this.version = await getLatestVersion(this.name)
        }
        console.log('version', this.version)
    }

    // package是否存在
    async exists() {
        if (this.storedPath) {
            await this.prepare()
            return pathExists.sync(this.getCacheFilePath(this.version))
        } else {
            return pathExists.sync(this.targetPath)
        }
    }

    // package 安装 -- npminstall包
    async install() {
        log.info('installing ...')
        await this.prepare()
        await npminstall({
            root: this.targetPath,
            pkgs: [
              {
                name: this.name,
                version: this.version
              },
            ],
            registry: 'https://registry.npmjs.org',
            storeDir: this.storedPath
        })
    }

    // package 更新
    async update() {
        await this.prepare()
        // 1 获取最新的npm模块版本号
        const latestVersion = await getLatestVersion(this.name)
        log.info('updateing ... version', latestVersion)
        // 2 查询最新版本号对应的路径是否存在
        const latestVersionFilePath = this.getCacheFilePath(latestVersion)
        // 3 如果不存在，则直接安装最新版本
        if(!pathExists.sync(latestVersionFilePath)) {
            await npminstall({
                root: this.targetPath,
                storeDir: this.storedPath,
                registry: 'https://registry.npmjs.org',
                pkgs: [
                    {
                        name: this.name,
                        version: latestVersion
                    },
                ],
            })
        }
    }


    // 获取入口文件
    getRootFilePath() {
        function _getRootFile(targetPath) {
            // 1 获取package.json 所在目录 - pkg-dir
            const dir = pkgDir.sync(targetPath)
            console.log('getRootFilePath', dir)
            if (dir) {
                // 2 读取package.json - require()
                const pkgFile = require(path.resolve(dir, 'package.json'))
                // 3 获取 main/lib - path
                if (pkgFile && (pkgFile.main)) {
                    // 4 mac/win 下路径的兼容
                    return formatPath(path.resolve(dir, pkgFile.main))
                }
            }
            return null
        }
        if(this.storedPath) {
            return _getRootFile(this.getCacheFilePath(this.version))
        } else {
           return  _getRootFile(this.targetPath)
        }

    }
}
module.exports = Package;

