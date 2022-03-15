'use strict';
const Command = require('@ds-cli/command')
const fs = require('fs')
const inquirer = require('inquirer')
const fse = require('fs-extra')
const validatePkgName = require("validate-npm-package-name")
const semver = require('semver')


const INIT_TYPE = {
   PROJECT: 'project',
   COMPONENT: 'component',
}
class InitCommand extends Command {
   init() {
      this.projectName = this._argv[0] || ''
      this.force = this._cmd.force
      console.log(this.projectName, this.force)
   }

   async exec() {
      // 1 准备阶段
      await this._prepare()
      // 2 下载阶段
      // 3 安装阶段
   }

   async _prepare(){
      // 1 获取当前目录是否为空
      const currentPath = process.cwd()
      if(!this._isDirEmpty(currentPath)) {
         let ifContinue
         // 2 是否启动强制更新
         if (!this.force) {
            const answer = await inquirer.prompt([{
               type: 'confirm',
               message: '当前文件夹不为空，是否继续创建',
               name: 'ifContinue',
               default: false
            }])
            ifContinue = answer['ifContinue']
         }

         console.log('force', this.force)
         console.log('ifContinue', ifContinue)

         if (ifContinue || this.force) {
            const { ifEmptyDir } = await inquirer.prompt([{
               type: 'confirm',
               message: '是否清空当前目录下的文件',
               name: 'ifEmptyDir',
               default: false
            }])
            // 清空当前目录
            if(ifEmptyDir) fse.emptydirSync(currentPath)
         }
      }
      // 3 选择创建项目/组件
      const { init_type } = await inquirer.prompt([{
         type: 'list',
         message: '请选择初始化类型',
         name: 'init_type',
         choices: [
            {name: '项目', value: INIT_TYPE.PROJECT},
            {name: '组件', value: INIT_TYPE.COMPONENT}
         ],
         default: INIT_TYPE.PROJECT
      }])
      // 4 获取项目的基本信息
      if (init_type === INIT_TYPE.PROJECT) {
         const answer = await inquirer.prompt([
            {
               type: 'input',
               message: '请输入项目名称',
               name: 'projectName',
               default: '',
               validate(v) {
                  return validatePkgName(v).validForNewPackages
               },
            },
            {
               type: 'input',
               message: '请输入项目版本号',
               name: 'projectVersion',
               default: '',
               validate(v) {
                  return !!semver.valid(v)
               },
            }
         ])
         console.log(answer)
      }
   }
   _download() {}
   _install() {}

   _isDirEmpty(currentPath) {
      let fileList = fs.readdirSync(currentPath)
      fileList = fileList.filter(file => {
         return !file.startsWith(".") && ['node_modules'].indexOf(file) < 0
      })
      console.log(fileList)
      return fileList?.length === 0
   }
}

function init(args) {
   return new InitCommand(args);
}

module.exports = init
module.exports.InitCommand = InitCommand

