// ==UserScript==
// @name         search-filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  --
// @author       dy-xiaodong2022
// @match        https://www.google.com/search*
// @match        https://www.baidu.com/s*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @grant        unsafeWindow
// ==/UserScript==

(function () {
  // import module from https://cdn.jsdelivr.net/npm/fastjs-next@1.0.14/dist/fastjs-next-runtime-esm.min.js
  import('https://cdn.jsdelivr.net/npm/fastjs-next@1.0.14/dist/fastjs-next-runtime-esm.min.js').then((fastjs) => {
    const FastjsDom = fastjs.FastjsDom;
    const log = (msg, other = "") => void console.log(`[search-filter]`, msg, other);
    const father = (el) => new FastjsDom(el.father());

    const disabledWebsite = [
      /.*csdn.*/g,
    ]

    // if google
    if (location.host === 'www.google.com') {
      log("hook -> pageload");
      // wait for page load
      setInterval(() => {
        log("hot update");
        log("select result", fastjs.selecter('.iUh30.qLRx3b.tjvcx'));
        if (fastjs.selecter('.iUh30.tjvcx')._list.length) {
          fastjs.selecter(".eFM0qc").remove();
          fastjs.selecter(".fl.iUh30").remove();
          fastjs.selecter(".iUh30.tjvcx").each(el => {
            for (const website of disabledWebsite) {
              console.log(website)
              log("check website", el.text().split(' ')[0]);
              if (website.test(el.text().split(' ')[0])) {
                log("delete", el);

                function del(el) {
                  // if .MjjYud
                  if (el.el().className === 'MjjYud') {
                    el.remove();
                  } else {
                    del(father(el));
                  }
                }
                del(father(el));
              }
            }
          })
        }
      }, 200)
    }

    // if baidu
    if (location.host === 'www.baidu.com') {
      log("hook -> pageload");
      // wait for page load
      setInterval(() => {
        log("hot update");
        log("select result", fastjs.selecter('.xpath-log'));
        if (fastjs.selecter('.xpath-log')._list.length) {
          fastjs.selecter(".xpath-log").each(el => {
            // check el attr -> mu
            // if fk, remove el
            if (el.attr('fk')) el.remove();
            else {
              for (const website of disabledWebsite) {
                log("check website", el.attr('mu'));
                if (website.test(el.attr('mu'))) {
                  log("delete", el);
                  el.remove();
                }
              }
            }
          })
        }
      }, 200)
    }
  })
})();
