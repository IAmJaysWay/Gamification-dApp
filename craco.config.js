const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { 
                "@component-background": "#001529",
                "@text-color": "white",
                "@primary-5": "white",
                "@primary-color": "darkslategrey",
                "@heading-color": "#21bf96",
                "@layout-header-background": "#001529", //header background
                "@menu-item-active-bg": "darkslategrey", //menu top color
                "@menu-dark-item-active-bg": "darkslategrey", //menu top color
                "@link-color": "#21bf96", //green color for text
                "@timeline-dot-bg": "transparent",
                //table
                "@table-bg": "#001529",
                "@table-header-bg": "#001529",
                "@table-header-color": "#21bf96",
                "@table-row-hover-bg": "darkslategrey",
                //table pagination
                "@pagination-item-bg": "#001529",
                "@pagination-item-bg-active": "darkslategrey",
                "@pagination-item-input-bg": "#001529",
                //button
                "@btn-link-hover-bg": "#001529",
                //icons
                "@icon-color-hover": "#001529",
                "@icon-color": "white",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};