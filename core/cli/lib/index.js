'use strict';

const log = require('@ds-cli/log')
const prepare = require('./prepare')
const registerCli = require('./registerCli')

module.exports = () => {
    try {
        prepare()
        registerCli()
    } catch (e) {
        log.error(e.message)
        if(process.env.LOG_LEVEL === 'verbose') {
            console.log(e)
        }
    }
};
