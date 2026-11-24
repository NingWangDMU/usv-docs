/* Official Just the Docs hook (_includes/js/custom.js).
   Offline/file:// helpers only. Do not change theme layout or colors. */

(function () {
  if (window.jtd_search_data && window.XMLHttpRequest) {
    var OrigXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function () {
      var xhr = new OrigXHR();
      var origOpen = xhr.open;
      var origSend = xhr.send;
      xhr.open = function (method, url) {
        this._jtdOfflineSearch = /search-data\.json(\?|$)/.test(String(url || ""));
        return origOpen.apply(this, arguments);
      };
      xhr.send = function () {
        if (this._jtdOfflineSearch && window.jtd_search_data) {
          var self = this;
          var body = JSON.stringify(window.jtd_search_data);
          Object.defineProperty(self, "status", { configurable: true, get: function () { return 200; } });
          Object.defineProperty(self, "responseText", { configurable: true, get: function () { return body; } });
          Object.defineProperty(self, "readyState", { configurable: true, get: function () { return 4; } });
          setTimeout(function () {
            if (typeof self.onload === "function") self.onload();
            if (typeof self.onreadystatechange === "function") self.onreadystatechange();
          }, 0);
          return;
        }
        return origSend.apply(this, arguments);
      };
      return xhr;
    };
  }

  if (!window.jtd || typeof window.jtd.onReady !== "function") return;

  window.jtd.onReady(function () {
    if (document.querySelector("div.highlighter-rouge button, div.listingblock > div.content button, figure.highlight button")) {
      return;
    }
    var codeBlocks = document.querySelectorAll("div.highlighter-rouge, div.listingblock > div.content, figure.highlight");
    if (!codeBlocks.length) return;

    var svgCopied = '<svg viewBox="0 0 24 24" class="copy-icon"><use xlink:href="#svg-copied"></use></svg>';
    var svgCopy = '<svg viewBox="0 0 24 24" class="copy-icon"><use xlink:href="#svg-copy"></use></svg>';

    function copyText(text) {
      if (window.isSecureContext && navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      }
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
      } finally {
        document.body.removeChild(area);
      }
      return Promise.resolve();
    }

    codeBlocks.forEach(function (codeBlock) {
      var copyButton = document.createElement("button");
      var timeout = null;
      copyButton.type = "button";
      copyButton.setAttribute("aria-label", "Copy code to clipboard");
      copyButton.innerHTML = svgCopy;
      codeBlock.append(copyButton);
      copyButton.addEventListener("click", function () {
        if (timeout !== null) return;
        var node = codeBlock.querySelector("pre:not(.lineno, .highlight)") || codeBlock.querySelector("code");
        if (!node) return;
        copyText(node.innerText).then(function () {
          copyButton.innerHTML = svgCopied;
          timeout = setTimeout(function () {
            copyButton.innerHTML = svgCopy;
            timeout = null;
          }, 4000);
        }).catch(function () {});
      });
    });
  });
})();
