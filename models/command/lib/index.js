'use strict';


class Command {
    constructor(argv) {
        if (!argv) throw new Error('参数不能为空')
        if (!Array.isArray(argv)) throw new Error('参数必须为数组')
        if (argv.length < 1) throw new Error('参数列表不能为空')

        this._argv = argv
        let runner = new Promise((resolve, reject) => {
            let chain = Promise.resolve()
            chain = chain.then(() => this._checkNodeVersion())
            chain = chain.then(() => this._initArgs())
            chain = chain.then(() => this.init())
            chain = chain.then(() => this.exec())
            chain.catch(err => logger.error(err))
        })
    }

    init() {
        throw new Error('init method not implemented')
    }

    exec() {
        throw new Error('exec method not implemented')
    }

    _checkNodeVersion() {}
    _initArgs() {
        this._cmd = this._argv[this._argv.length - 1]
        this._argv = this._argv.slice(0, -1)
        console.log(this._cmd, this._argv)
    }
}

module.exports = Command;
