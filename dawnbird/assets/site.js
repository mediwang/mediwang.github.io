/* DawnBird site: language switching. No cookies, no network requests.
   Order of precedence: ?lang= in the URL, then the visitor's saved choice, then English. */
(function () {
  "use strict";

  var LANGS = ["en", "es", "fr", "zh"];
  var HTML_LANG = { en: "en", es: "es", fr: "fr", zh: "zh-Hans" };
  var KEY = "dawnbird-lang";
  var root = document.documentElement;

  function fromUrl() {
    var m = /[?&]lang=([A-Za-z-]+)/.exec(window.location.search);
    if (!m) return null;
    var code = m[1].toLowerCase().slice(0, 2);
    return LANGS.indexOf(code) > -1 ? code : null;
  }

  function saved() {
    try {
      var v = window.localStorage.getItem(KEY);
      return LANGS.indexOf(v) > -1 ? v : null;
    } catch (e) {
      return null;
    }
  }

  function save(lang) {
    try {
      window.localStorage.setItem(KEY, lang);
    } catch (e) {
      /* Private mode or storage disabled: the choice still rides along in the URL. */
    }
  }

  function withLang(href, lang) {
    var hash = "";
    var i = href.indexOf("#");
    if (i > -1) { hash = href.slice(i); href = href.slice(0, i); }
    href = href.replace(/([?&])lang=[^&]*(&|$)/, function (_, a, b) { return b ? a : ""; });
    if (lang !== "en") href += (href.indexOf("?") > -1 ? "&" : "?") + "lang=" + lang;
    return href + hash;
  }

  function apply(lang) {
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", HTML_LANG[lang]);

    var title = root.getAttribute("data-title-" + lang);
    if (title) document.title = title;

    var i;
    var switches = document.querySelectorAll("[data-set-lang]");
    for (i = 0; i < switches.length; i++) {
      var on = switches[i].getAttribute("data-set-lang") === lang;
      if (on) switches[i].setAttribute("aria-current", "true");
      else switches[i].removeAttribute("aria-current");
    }

    /* Keep the chosen language when moving between pages. */
    var links = document.querySelectorAll("a[data-int]");
    for (i = 0; i < links.length; i++) {
      links[i].setAttribute("href", withLang(links[i].getAttribute("href"), lang));
    }
  }

  var current = fromUrl() || saved() || "en";

  /* Set the language before the page paints, so there is no flash of English. */
  root.setAttribute("data-lang", current);
  root.setAttribute("lang", HTML_LANG[current]);

  function ready() {
    apply(current);

    document.addEventListener("click", function (ev) {
      var el = ev.target;
      while (el && el !== document && !(el.getAttribute && el.getAttribute("data-set-lang"))) {
        el = el.parentNode;
      }
      if (!el || el === document) return;
      ev.preventDefault();
      current = el.getAttribute("data-set-lang");
      save(current);
      apply(current);
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", withLang(window.location.pathname + window.location.search, current) + window.location.hash);
      }
    });

    /* Until the App Store link placeholder is replaced, show "Coming soon" instead of a dead link. */
    var store = document.querySelectorAll("a[data-store]");
    for (var i = 0; i < store.length; i++) {
      var href = store[i].getAttribute("href") || "";
      if (href.indexOf("[[") > -1 || href === "" || href === "#") {
        root.classList.add("store-pending");
        store[i].removeAttribute("href");
        store[i].setAttribute("aria-disabled", "true");
      }
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready);
  else ready();
})();
