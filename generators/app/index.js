'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const _ = require('lodash');
const mkdirp = require('mkdirp');
const path = require('path');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    this.log(
      yosay(`Welcome to the ${chalk.red('cspace-ui plugin')} generator!`)
    );

    const questions = [
      {
        type: 'list',
        name: 'pluginType',
        message: 'What kind of plugin would you like to make?',
        choices: [ 'profile' ],
        default: 'profile',
      },
      {
        type: 'input',
        when: answers => answers.pluginType === 'profile',
        name: 'pluginDisplayName',
        message: 'What is the display name of the profile?',
      },
      {
        type: 'input',
        when: answers => answers.pluginType === 'profile',
        name: 'pluginName',
        message: 'What is the name of the profile?',
        default: answers => answers.pluginDisplayName.toLowerCase().replace(/[^A-Za-z0-9]/g, ''),
      },
      {
        type: 'input',
        when: answers => answers.pluginType === 'profile',
        name: 'profileTenantID',
        message: 'What is the tenant ID of the profile?',
      },
    ];

    return this.prompt(questions).then((answers) => {
      this.props = answers;

      const {
        pluginType,
        pluginDisplayName,
        pluginName,
      } = answers;

      this.props.packageName = `cspace-ui-plugin-${pluginType}-${pluginName}`;
      this.props.repoName = `${this.props.packageName}.js`;
      this.props.libraryName = `cspaceUIPlugin${_.upperFirst(pluginType)}${_.upperFirst(_.camelCase(pluginDisplayName))}`;
      this.props.packageDesc = `${pluginDisplayName} ${pluginType} plugin for the CollectionSpace UI`;

      if (pluginType === 'profile') {
        this.props.adminUser = `admin@${pluginName}.collectionspace.org`;
      }
    });
  }

  default() {
    if (path.basename(this.destinationPath()) !== this.props.repoName) {
      this.log(
        `Your plugin must be inside a folder named ${this.props.repoName}.\nI\'ll create this folder.`
      );

      mkdirp(this.props.repoName);

      this.destinationRoot(this.destinationPath(this.props.repoName));
    }
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('**/*'),
      this.destinationPath(),
      this.props,
      {},
      {
        globOptions: {
          dot: true,
        },
      },
    );

    if (this.fs.exists(
      this.destinationPath('styles/cspace-ui-plugin-pluginType/pluginName.css')
    )) {
      const {
        pluginType,
        pluginName,
      } = this.props;

      this.fs.move(
        this.destinationPath(`styles/cspace-ui-plugin-pluginType/pluginName.css`),
        this.destinationPath(`styles/cspace-ui-plugin-${pluginType}/${pluginName}.css`),
      );
    }
  }

  install() {
    this.installDependencies({
      bower: false,
      yarn: false,
    });
  }
};
