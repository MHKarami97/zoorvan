// assets/js/search.js — جستجوی سمت کلاینت مبتنی بر search.json (بدون وابستگی خارجی)
(function () {
  var input = document.getElementById("search-input");
  var results = document.getElementById("search-results");
  var status = document.getElementById("search-status");
  if (!input || !results) return;

  var data = [];

  fetch(window.SEARCH_JSON_URL)
    .then(function (res) { return res.json(); })
    .then(function (json) {
      data = json;
      status.textContent = data.length + " تجربه ثبت‌شده — عبارت خود را تایپ کنید";
    })
    .catch(function () {
      status.textContent = "خطا در بارگذاری داده‌های جستجو";
    });

  function render(items) {
    results.innerHTML = "";
    if (items.length === 0) {
      results.innerHTML = '<p style="color:var(--color-grey-500); grid-column:1/-1;">نتیجه‌ای پیدا نشد.</p>';
      return;
    }
    items.forEach(function (exp) {
      var stars = "";
      var r = exp.rating || 0;
      for (var i = 1; i <= 5; i++) stars += i <= r ? "★" : "☆";
      var catTitle = window.CATEGORY_MAP[exp.category] || exp.category;
      var card = document.createElement("article");
      card.className = "experience-card";
      card.innerHTML =
        '<a href="' + exp.url + '"><img class="thumb" src="' + (exp.image || "") + '" alt="' + exp.title + '" loading="lazy" onerror="this.style.display=\'none\'"></a>' +
        '<div class="body">' +
        '<span class="badge">' + catTitle + '</span>' +
        '<h3><a href="' + exp.url + '">' + exp.title + '</a></h3>' +
        '<div class="meta"><span>📍 ' + exp.location + '</span><span class="rating-stars">' + stars + '</span></div>' +
        '<p class="excerpt">' + exp.excerpt + '</p>' +
        '</div>';
      results.appendChild(card);
    });
  }

  function search(term) {
    term = term.trim().toLowerCase();
    if (!term) { render(data.slice(0, 12)); status.textContent = data.length + " تجربه ثبت‌شده — عبارت خود را تایپ کنید"; return; }
    var filtered = data.filter(function (exp) {
      var haystack = [exp.title, exp.location, exp.author, exp.excerpt, (exp.tags || []).join(" "), window.CATEGORY_MAP[exp.category] || exp.category]
        .join(" ").toLowerCase();
      return haystack.indexOf(term) !== -1;
    });
    status.textContent = filtered.length + " نتیجه برای «" + term + "»";
    render(filtered);
  }

  var debounceTimer;
  input.addEventListener("input", function (e) {
    clearTimeout(debounceTimer);
    var val = e.target.value;
    debounceTimer = setTimeout(function () { search(val); }, 200);
  });

  // اگر عبارت جستجو در URL باشد (مثلاً ?q=...) خودکار جستجو شود
  var params = new URLSearchParams(window.location.search);
  if (params.get("q")) {
    input.value = params.get("q");
  }
})();
