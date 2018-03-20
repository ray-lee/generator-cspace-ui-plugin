/* global <%= libraryName %> */
/* The <%= libraryName %> global variable is set by webpack (in non-test builds). See
 * webpack.config.js. */

import { defineMessages } from 'react-intl';
import messages from './messages';
import plugins from './plugins';
import styles from '../styles/cspace-ui-plugin-<%= pluginType %>/<%= pluginName %>.css';

module.exports = () => ({
  messages,
  className: styles.common,
  prettyUrls: true,
  tenantId: '<%= tenantID %>',
  pluginInfo: {
    <%= libraryName %>: {
      messages: defineMessages({
        name: {
          id: '<%= libraryName %>.name',
          defaultMessage: '<%= pluginDisplayName %> <%= pluginType %>',
        },
      }),
      version: <%= libraryName %>.packageVersion,
    },
  },
  plugins: plugins.map(plugin => plugin()),
});
