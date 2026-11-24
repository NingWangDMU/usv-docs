/* CJK-aware lunr tokenizer and trimmer for Just the Docs.
 *
 * Root cause: lunr's default tokenizer only splits on /[\s\-/]+/, so a Chinese
 * sentence becomes one token; and lunr.trimmer uses \W, which treats CJK as
 * non-word and strips those tokens to empty. English tokens such as "GPS" are
 * kept, so Latin queries work while 推进器 does not.
 *
 * This file only changes lunr tokenization. It does not alter theme CSS or markup.
 * No network / CDN dependency. Safe for file://.
 */
(function (root) {
  "use strict";

  var CJK = /[\u3400-\u9fff\uf900-\ufaff]/;

  function isCjk(ch) {
    return CJK.test(ch);
  }

  function isAsciiWord(ch) {
    return /[a-z0-9_]/.test(ch);
  }

  function cjkSafeTrimmer(token) {
    return token.update(function (s) {
      return s
        .replace(/^[^\w\u3400-\u9fff\uf900-\ufaff]+/, "")
        .replace(/[^\w\u3400-\u9fff\uf900-\ufaff]+$/, "");
    });
  }

  function tokenize(lunr, obj, metadata) {
    if (obj == null) return [];
    if (Array.isArray(obj)) {
      return obj.map(function (t) {
        return new lunr.Token(lunr.utils.asString(t).toLowerCase(), lunr.utils.clone(metadata));
      });
    }

    var str = obj.toString().toLowerCase();
    var tokens = [];

    function pushToken(slice, start) {
      if (!slice) return;
      var meta = lunr.utils.clone(metadata) || {};
      meta.position = [start, slice.length];
      meta.index = tokens.length;
      tokens.push(new lunr.Token(slice, meta));
    }

    var i = 0;
    var n = str.length;
    while (i < n) {
      var ch = str.charAt(i);
      if (isCjk(ch)) {
        var start = i;
        i += 1;
        while (i < n && isCjk(str.charAt(i))) i += 1;
        var word = str.slice(start, i);
        pushToken(word, start);
        if (word.length >= 2) {
          for (var j = 0; j + 2 <= word.length; j += 1) {
            pushToken(word.slice(j, j + 2), start + j);
          }
        }
      } else if (isAsciiWord(ch)) {
        var asciiStart = i;
        i += 1;
        while (i < n && isAsciiWord(str.charAt(i))) i += 1;
        pushToken(str.slice(asciiStart, i), asciiStart);
      } else {
        i += 1;
      }
    }
    return tokens;
  }

  function install(lunr) {
    if (!lunr) {
      throw new Error("installJtdCjkLunr requires lunr");
    }
    lunr.trimmer = cjkSafeTrimmer;
    // Replace in place so lunr does not warn about re-registering "trimmer".
    if (lunr.Pipeline.registeredFunctions) {
      lunr.Pipeline.registeredFunctions.trimmer = cjkSafeTrimmer;
    }
    lunr.tokenizer = function (obj, metadata) {
      return tokenize(lunr, obj, metadata);
    };
    return lunr;
  }

  var api = { install: install, tokenize: tokenize, cjkSafeTrimmer: cjkSafeTrimmer };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.installJtdCjkLunr = install;
  root.jtdCjkLunr = api;

  if (typeof lunr !== "undefined") {
    install(lunr);
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
