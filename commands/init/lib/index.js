'use strict';
const Command = require('@ds-cli/command')

class InitCommand extends Command {
   init() {
      this.projectName = this._argv[0] || ''
      this.force = this._cmd.force
      console.log(this.projectName, this.force)
   }

   exec() {
      console.log('InitCommand exec')
   }
}

function init(args) {
   return new InitCommand(args);
}

module.exports = init
module.exports.InitCommand = InitCommand

