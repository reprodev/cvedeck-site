// Copy buttons for code blocks.
//
// Progressive enhancement: the buttons are created here rather than written
// into the HTML, so a visitor without JavaScript never sees a button that does
// nothing, and the code stays ordinary selectable text. Served from this site
// only; the Content-Security-Policy allows no other script.
(function () {
  'use strict';

  var blocks = document.querySelectorAll('.code');
  if (!blocks.length) return;

  // One polite live region for the page, so "Copied" is announced to screen
  // readers without moving focus off the button.
  var status = document.createElement('p');
  status.className = 'visually-hidden';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  document.body.appendChild(status);

  function selectText(node) {
    var range = document.createRange();
    range.selectNodeContents(node);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function announce(button, label, message, state) {
    button.textContent = label;
    button.setAttribute('data-state', state);
    status.textContent = message;
    clearTimeout(button._reset);
    button._reset = setTimeout(function () {
      button.textContent = 'Copy';
      button.removeAttribute('data-state');
      status.textContent = '';
    }, 2000);
  }

  Array.prototype.forEach.call(blocks, function (block) {
    var code = block.querySelector('code');
    if (!code) return;

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-btn';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', 'Copy to clipboard');

    button.addEventListener('click', function () {
      // No trailing newline: pasting into a terminal should not run the last
      // line before the reader has looked at it.
      var text = code.textContent.replace(/\s+$/, '');

      function fallback() {
        selectText(code);
        announce(button, 'Press Ctrl+C', 'Text selected. Press Ctrl+C to copy.', 'manual');
      }

      if (!navigator.clipboard || !window.isSecureContext) {
        fallback();
        return;
      }
      navigator.clipboard.writeText(text).then(function () {
        announce(button, 'Copied', 'Copied to clipboard.', 'copied');
      }, fallback);
    });

    block.classList.add('has-copy');
    block.appendChild(button);
  });
})();
