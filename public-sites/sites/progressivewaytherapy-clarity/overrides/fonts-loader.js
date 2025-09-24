// Central font configuration for Webflow export overrides.
(function loadGoogleFonts() {
  var FONT_CONFIG = {
    heading: {
      cssVariable: '--font-heading',
      googleFamily: 'Inter:100,200,300,regular,500,600,700,800,900',
      stack: '"Inter", sans-serif'
    },
    body: {
      cssVariable: '--font-body',
      googleFamily: 'Lato:100,100italic,300,300italic,400,400italic,700,700italic,900,900italic',
      stack: '"Lato", sans-serif'
    }
  };

  var families = Object.keys(FONT_CONFIG).map(function (key) {
    return FONT_CONFIG[key].googleFamily;
  });

  if (window.WebFont && families.length) {
    window.WebFont.load({
      google: { families: families }
    });
  }

  var root = document.documentElement;
  if (!root) return;

  Object.keys(FONT_CONFIG).forEach(function (key) {
    var config = FONT_CONFIG[key];
    if (config.cssVariable && config.stack) {
      root.style.setProperty(config.cssVariable, config.stack);
    }
  });
})();
