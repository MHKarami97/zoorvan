document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  // فیلتر ساده سمت کلاینت برای صفحه دسته‌بندی‌ها (بر اساس data-category)
  var searchInput = document.querySelector("[data-experience-search]");
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      var term = e.target.value.trim().toLowerCase();
      document
        .querySelectorAll("[data-experience-card]")
        .forEach(function (card) {
          var text = card.textContent.toLowerCase();
          card.style.display = text.includes(term) ? "" : "none";
        });
    });
  }
});
