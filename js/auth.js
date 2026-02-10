(function () {
  function doLogin() {
    const user = document.getElementById("login").value.trim();
    const pass = document.getElementById("senha").value;

    if (user === "madesonda2026" && pass === "madesonda2026") {
      window.location.href = "dashboard.html";
      return;
    }
    document.getElementById("erro").style.display = "block";
  }

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      doLogin();
    });
  });
})();