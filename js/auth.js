/* ================================
   CONTROLE DE SESSÃO DO PORTAL
   - Logout ao fechar aba/navegador
   - Logout automático às 23:59:59
================================ */

/* -------- LOGIN -------- */
function loginUsuario() {
  const agora = new Date();
  const expira = new Date();

  // Define expiração para 23:59:59 do dia atual
  expira.setHours(23, 59, 59, 999);

  sessionStorage.setItem("logado", "true");
  sessionStorage.setItem("expiraEm", expira.getTime());

  // Redireciona para a página inicial
  window.location.href = "index.html";
}

/* -------- VERIFICAÇÃO DE SESSÃO -------- */
function verificarSessao() {
  const logado = sessionStorage.getItem("logado");
  const expiraEm = sessionStorage.getItem("expiraEm");

  if (!logado || !expiraEm) {
    window.location.href = "login.html";
    return;
  }

  const agora = Date.now();

  if (agora > Number(expiraEm)) {
    sessionStorage.clear();
    alert("Sessão expirada. Faça login novamente.");
    window.location.href = "login.html";
  }
}

/* -------- LOGOUT MANUAL -------- */
function logoutUsuario() {
  sessionStorage.clear();
  window.location.href = "login.html";
}

/* -------- EXECUTA AO CARREGAR PÁGINAS PROTEGIDAS -------- */
document.addEventListener("DOMContentLoaded", function () {
  verificarSessao();
});
