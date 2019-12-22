'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const rename = require('gulp-rename');
const _ = require('lodash');
const mkdirp = require('mkdirp');
const path = require('path');
const yosay = require('yosay');

module.exports = class extends Generator {
  initializing() {
    this.registerTransformStream(
      rename(path => {
        // Remove leading _ from template file names.

        if (path.basename.startsWith('_')) {
          path.basename = path.basename.substring(1);

          if (path.basename === '') {
            path.basename = path.extname;
            path.extname = '';
          }
        }
      })
    );
  }

  prompting() {
    this.log(yosay(`Welcome to the ${chalk.red('cspace-ui plugin')} generator!`));

    const questions = [
      {
        type: 'list',
        name: 'pluginType',
        message: 'What kind of plugin would you like to make?',
        choices: ['profile'],
        default: 'profile'
      },
      {
        type: 'input',
        when: answers => answers.pluginType === 'profile',
        name: 'pluginDisplayName',
        message: 'What is the display name of the profile?',
        validate: input => (input ? true : 'The display name must not be blank.')
      },
      {
        type: 'input',
        when: answers => answers.pluginType === 'profile',
        name: 'pluginName',
        message: 'What is the name of the profile?',
        default: answers =>
          answers.pluginDisplayName.replace(/[^A-Za-z0-9]/g, '').toLowerCase(),
        validate: input => {
          if (input.toLowerCase() !== input) {
            return 'The profile name should be lowercase.';
          }

          if (!input.match(/^[a-z0-9]+$/)) {
            return 'The profile name should only contain the characters a-z and 0-9.';
          }

          return true;
        }
      },
      {
        type: 'input',
        when: answers => answers.pluginType === 'profile',
        name: 'libraryName',
        message: 'What is the library name of the profile?',
        default: answers => _.upperFirst(answers.pluginName),
        validate: (input, answers) => {
          if (input.toLowerCase() !== answers.pluginName.toLowerCase()) {
            return 'The library name should be identical to the profile name, aside from case.';
          }

          if (_.upperCase(input[0]) !== input[0]) {
            return 'The library name must be camel case, with an initial upper case letter.';
          }

          return true;
        }
      },
      {
        type: 'input',
        when: answers => answers.pluginType === 'profile',
        name: 'tenantID',
        message: 'What is the tenant ID of the profile?',
        validate: input =>
          input.match(/^[0-9]+$/) ? true : 'The tenant ID should be numeric.'
      }
    ];

    return this.prompt(questions).then(answers => {
      this.props = answers;

      const { pluginType, pluginDisplayName, pluginName, libraryName } = answers;

      this.props.packageName = `cspace-ui-plugin-${pluginType}-${pluginName}`;
      this.props.repoName = `${this.props.packageName}.js`;
      this.props.libraryName = `cspaceUIPluginProfile${libraryName}`;
      this.props.packageDesc = `${pluginDisplayName} ${pluginType} plugin for the CollectionSpace UI`;

      if (pluginType === 'profile') {
        this.props.adminUser = `admin@${pluginName}.collectionspace.org`;
      }
    });
  }

  default() {
    if (path.basename(this.destinationPath()) !== this.props.repoName) {
      this.log(
        `Your plugin must be inside a folder named ${this.props.repoName}.\nI'll create this folder.`
      );

      mkdirp(this.props.repoName);

      this.destinationRoot(this.destinationPath(this.props.repoName));
    }
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('**'),
      this.destinationPath(),
      this.props,
      {},
      {
        globOptions: {
          dot: true
        }
      }
    );

    if (
      this.fs.exists(
        this.destinationPath('styles/cspace-ui-plugin-pluginType/pluginName.css')
      )
    ) {
      const { pluginType, pluginName } = this.props;

      this.fs.move(
        this.destinationPath(`styles/cspace-ui-plugin-pluginType/pluginName.css`),
        this.destinationPath(`styles/cspace-ui-plugin-${pluginType}/${pluginName}.css`)
      );
    }
  }

  install() {
    this.installDependencies({
      bower: false,
      yarn: false
    });
  }
};
