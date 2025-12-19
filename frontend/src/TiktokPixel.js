export const loadTikTokPixel = () => {
  if (window.ttq) return;

  !(function (w, d, t) {
    w.TiktokAnalyticsObject = t;
    var ttq = (w[t] = w[t] || []);
    ttq.methods = [
      "page","track","identify","instances","debug","on","off",
      "once","ready","alias","group","enableCookie","disableCookie",
      "holdConsent","revokeConsent","grantConsent"
    ];
    ttq.setAndDefer = function (t, e) {
      t[e] = function () {
        t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
      };
    };
    for (var i = 0; i < ttq.methods.length; i++)
      ttq.setAndDefer(ttq, ttq.methods[i]);

    ttq.load = function (e) {
      var n = d.createElement("script");
      n.async = true;
      n.src =
        "https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=" + e;
      var s = d.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(n, s);
    };

    ttq.load("D52LIRRC77U6T74NAJ80");
    ttq.page();
  })(window, document, "ttq");
};