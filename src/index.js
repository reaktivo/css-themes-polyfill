;'use strict'; // eslint-disable-line
(function main() {
  /**
   * Exposing global function to post-processing CSS variables with current theme
   * @param  {String} cssRawText CSS raw text with CSS variables
   * @return {String} CSS style with resolved CSS variables
   */
  window.cssThemeService = function cssThemeService(cssRawText) {
    return cssRawText
      .split('\n').join('')
      .replace(/var\(--([\w-]+)\)/g, function replacer(match, group) {
        return (window.TravixTheme || {})[group];
      });
  };

  /**
   * Process all <link> tags with specific data attribute
   */
  [].forEach.call(document.querySelectorAll('[data-cssvars]'), function processAllFunc(elem) {
    var path = elem.href;
    var rawFile = new XMLHttpRequest();
    rawFile.open('GET', path, true);
    rawFile.onreadystatechange = function processStylesFile() {
      if (rawFile.readyState === 4 && (rawFile.status === 200 || rawFile.status === 0)) {
        var styleEl = document.createElement('style');
        document.head.appendChild(styleEl);

        styleEl.innerText = window.cssThemeService(rawFile.responseText);
      }
    };
    rawFile.send(null);
  });

  /**
   * Add listener to monitor new <style> tag added to the <head> and process them
   */
  document.head.addEventListener('DOMSubtreeModified', function onNewStyleTagAdded(e) {
    if (e.target instanceof HTMLStyleElement) {
      var styleEl = e.target;
      var containCssVars = styleEl.innerText.indexOf('var(--') !== -1;
      if (containCssVars) {
        e.target.innerText = window.cssThemeService(e.target.innerText);
      }
    }
  }, false);
}());
