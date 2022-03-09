'use strict';

const path = require('path')
const npm = require('./npm')

function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

function formatPath(p) {
    if(p && typeof p === 'string') {
        const sep = path.sep
        if (sep !== '/') {
            p = p.replace(/\\/g, '/')
        }
    }
    return p
}
module.exports = {
    isObject,
    formatPath,
    ...npm
};

