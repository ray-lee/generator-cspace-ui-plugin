# <%= packageName %>

<%= packageDesc %>.

## Installation

### For developers

Follow these instructions to download and install the source code of the plugin.

Using git:

```
$ git clone https://github.com/collectionspace/<%= repoName %>.git
$ cd <%= repoName %>
$ npm install
```

To run the cspace-ui application configured with this plugin:

```
$ npm run devserver --back-end=<url>
```

Replace `<url>` with the URL of a CollectionSpace server, for example `https://core.dev.collectionspace.org`.

Then open a browser to http://localhost:8080.
