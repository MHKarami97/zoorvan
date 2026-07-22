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

document.addEventListener("DOMContentLoaded", function () {
  var uploaders = document.querySelectorAll("[data-file-upload]");

  uploaders.forEach(function (uploader) {
    var input = uploader.querySelector(".file-upload__input");
    var status = uploader.querySelector("[data-file-status]");
    var maxFiles = Number(input.dataset.maxFiles || 0);

    function updateStatus(files) {
      if (!files || files.length === 0) {
        status.textContent = "هنوز فایلی انتخاب نشده";
        return;
      }

      if (maxFiles > 0 && files.length > maxFiles) {
        status.textContent = "تعداد فایل‌ها بیشتر از حد مجاز است";
        input.value = "";
        return;
      }

      if (files.length === 1) {
        status.textContent = files[0].name;
        return;
      }

      var names = Array.from(files).map(function (file) {
        return file.name;
      });

      status.textContent =
        files.length + " فایل انتخاب شد: " + names.join("، ");
    }

    input.addEventListener("change", function () {
      updateStatus(input.files);
    });

    ["dragenter", "dragover"].forEach(function (eventName) {
      uploader.addEventListener(eventName, function (event) {
        event.preventDefault();
        uploader.classList.add("is-dragover");
      });
    });

    ["dragleave", "drop"].forEach(function (eventName) {
      uploader.addEventListener(eventName, function (event) {
        event.preventDefault();
        uploader.classList.remove("is-dragover");
      });
    });

    uploader.addEventListener("drop", function (event) {
      if (!event.dataTransfer || !event.dataTransfer.files) {
        return;
      }

      var files = event.dataTransfer.files;

      if (maxFiles > 0 && files.length > maxFiles) {
        status.textContent = "حداکثر " + maxFiles + " فایل مجاز است";
        return;
      }

      input.files = files;
      updateStatus(files);
    });
  });
});
