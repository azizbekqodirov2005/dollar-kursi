(function () {
  var FALLBACK = { rate: 12055.90, diff: 44.25, date: "19.10.2026", source: "saqlangan" };
  var MONTHS = ["yanvar","fevral","mart","aprel","may","iyun","iyul","avgust","sentabr","oktabr","noyabr","dekabr"];
  var current = null, usdToUzs = true;

  var $ = function (id) { return document.getElementById(id); };
  var rateEl = $("rate"), deltaEl = $("delta"), statusEl = $("status");
  var amount = $("amount"), result = $("result"), chips = $("chips");

  function fmt(n, d) {
    return n.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d }).replace(/[  ]/g, " ");
  }
  function parse(s) { return parseFloat(String(s).replace(/\s/g, "").replace(",", ".")); }
  function prettyDate(d) {
    var p = String(d).split(".");
    if (p.length !== 3) return d;
    return parseInt(p[0], 10) + "-" + MONTHS[parseInt(p[1], 10) - 1] + ", " + p[2];
  }
  function clock() {
    var t = new Date();
    return ("0" + t.getHours()).slice(-2) + ":" + ("0" + t.getMinutes()).slice(-2);
  }

  function showRate(data, note, warn) {
    current = data;
    rateEl.innerHTML = fmt(data.rate, 2) + "<small>so'm</small>";
    if (typeof data.diff === "number" && !isNaN(data.diff)) {
      var up = data.diff >= 0;
      deltaEl.hidden = false;
      deltaEl.className = "delta" + (up ? "" : " down");
      deltaEl.textContent = (up ? "▲ " : "▼ ") + fmt(Math.abs(data.diff), 2) + " so'm kechagidan";
    } else {
      deltaEl.hidden = true;
    }
    statusEl.className = "status" + (warn ? " warn" : "");
    statusEl.textContent = note;
    render();
  }

  function loadCbu() {
    return fetch("https://cbu.uz/oz/arkhiv-kursov-valyut/json/USD/", { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("cbu " + r.status); return r.json(); })
      .then(function (arr) {
        var x = arr && arr[0];
        var rate = x && parseFloat(x.Rate);
        if (!rate || isNaN(rate)) throw new Error("cbu bad data");
        return { rate: rate, diff: parseFloat(x.Diff), date: x.Date, source: "cbu" };
      });
  }
  function loadBackup() {
    return fetch("https://open.er-api.com/v6/latest/USD", { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("backup " + r.status); return r.json(); })
      .then(function (j) {
        var rate = j && j.rates && j.rates.UZS;
        if (!rate) throw new Error("backup bad data");
        return { rate: rate, diff: NaN, date: null, source: "backup" };
      });
  }

  function load() {
    statusEl.className = "status";
    statusEl.textContent = "Yangilanmoqda…";
    loadCbu().then(function (d) {
      try { localStorage.setItem("lastRate", JSON.stringify(d)); } catch (e) {}
      showRate(d, prettyDate(d.date) + " holatiga · yangilandi " + clock(), false);
    }).catch(function () {
      return loadBackup().then(function (d) {
        try { localStorage.setItem("lastRate", JSON.stringify(d)); } catch (e) {}
        showRate(d, "Zaxira manbadan olindi (Markaziy bankga ulanib bo'lmadi) · " + clock(), false);
      });
    }).catch(function () {
      var saved = null;
      try { saved = JSON.parse(localStorage.getItem("lastRate")); } catch (e) {}
      var d = saved && saved.rate ? saved : FALLBACK;
      var when = d.date ? prettyDate(d.date) : "oxirgi marta";
      showRate(d, "Internetga ulanib bo'lmadi. " + when + " holatidagi saqlangan kurs ko'rsatilmoqda.", true);
    });
  }

  function render() {
    if (!current) return;
    var r = current.rate, v = parse(amount.value);
    result.value = isNaN(v) ? "" : (usdToUzs ? fmt(v * r, 0) : fmt(v / r, 2));
    $("fromCur").textContent = usdToUzs ? "USD" : "UZS";
    $("toCur").textContent = usdToUzs ? "UZS" : "USD";
    $("fromLabel").textContent = usdToUzs ? "Dollar" : "So'm";
    $("toLabel").textContent = usdToUzs ? "So'm" : "Dollar";
  }
  function renderChips() {
    var amounts = usdToUzs ? [10, 50, 100, 500, 1000] : [100000, 500000, 1000000, 5000000];
    chips.innerHTML = "";
    amounts.forEach(function (a) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = fmt(a, 0);
      b.addEventListener("click", function () { amount.value = String(a); render(); });
      chips.appendChild(b);
    });
  }

  var root = document.documentElement, themeBtn = $("theme"), themeText = $("themeText");
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function isDark() {
    var t = root.getAttribute("data-theme");
    return t ? t === "dark" : !!(mq && mq.matches);
  }
  function syncTheme() {
    var d = isDark();
    themeBtn.setAttribute("aria-pressed", d ? "true" : "false");
    themeText.textContent = d ? "Kunduzgi rejim" : "Tungi rejim";
  }
  try { var saved = localStorage.getItem("theme"); if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved); } catch (e) {}
  themeBtn.addEventListener("click", function () {
    var next = isDark() ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    syncTheme();
  });
  if (mq && mq.addEventListener) mq.addEventListener("change", syncTheme);
  syncTheme();

  amount.addEventListener("input", render);
  $("swap").addEventListener("click", function () {
    var out = result.value;
    usdToUzs = !usdToUzs;
    amount.value = out ? out.replace(/\s/g, "") : "";
    renderChips();
    render();
  });
  $("refresh").addEventListener("click", load);

  renderChips();
  load();
  setInterval(load, 5 * 60 * 1000);
})();
