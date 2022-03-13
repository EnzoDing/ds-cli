# `@ds-cli/package`

## description
`Package`类 为一个NPM包的抽象

```js
class Package {
    targetPath
    storePath
    name
    version
    
    // 包是否存在
    exists(){}
    // 包更新
    update() {}
    // 包安装
    install() {}
    // 包入口文件 package.json下的main
    getRootFile() {}
}
```

## Usage

```
const index = require('@ds-cli/index');

// TODO: DEMONSTRATE API
```
