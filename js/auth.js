/* ================================
   CONTROLE DE SESSÃO DO PORTAL (MADESONDA)
   - Sessão por aba (sessionStorage): ao fechar a aba/navegador, desloga
   - Expiração diária: 23:59:59
   - Fluxo correto do projeto:
       * index.html  = LOGIN
       * dashboard.html = HOME (pós-login)
   Observação: NÃO existe login.html neste projeto.
================================ */

/* ======= CONFIGURAÇÕES ======= */
const AUTH = {
  KEY_LOGADO: "logado",
  KEY_EXPIRA: "expiraEm",
  LOGIN_PAGE: "index.html",
  HOME_PAGE: "dashboard.html",
  // Usuários permitidos (AJUSTE AQUI).
  // Exemplo:
  // USERS: [{ user: "admin", pass: "1234" }]
  USERS: [
    // coloque aqui os logins reais
    // { user: "admin", pass: "1234" },
  ],
};

/* ======= UTILITÁRIOS ======= */
function _fimDoDiaTimestamp() {
  const expira = new Date();
  expira.setHours(23, 59, 59, 999);
  return expira.getTime();
}

function _estaLogadoEValido() {
  const logado = sessionStorage.getItem(AUTH.KEY_LOGADO);
  const expiraEm = sessionStorage.getItem(AUTH.KEY_EXPIRA);
  if (!logado || !expiraEm) return false;
  return Date.now() <= Number(expiraEm);
}

/* ======= API PÚBLICA ======= */
function loginUsuario() {
  sessionStorage.setItem(AUTH.KEY_LOGADO, "true");
  sessionStorage.setItem(AUTH.KEY_EXPIRA, String(_fimDoDiaTimestamp()));
  window.location.href = AUTH.HOME_PAGE;
}

function logoutUsuario() {
  sessionStorage.clear();
  window.location.href = AUTH.LOGIN_PAGE;
}

/**
 * Verifica a sessão nas páginas protegidas.
 * Se inválida/expirada, redireciona para index.html (login).
 */
function verificarSessao() {
  if (_estaLogadoEValido()) return true;

  // Se havia algo salvo mas expirou, limpa e avisa
  const expiraEm = sessionStorage.getItem(AUTH.KEY_EXPIRA);
  if (expiraEm && Date.now() > Number(expiraEm)) {
    sessionStorage.clear();
    alert("Sessão expirada. Faça login novamente.");
  }

  window.location.href = AUTH.LOGIN_PAGE;
  return false;
}

/* ======= INICIALIZAÇÃO AUTOMÁTICA (SEM QUEBRAR O LOGIN) ======= */
document.addEventListener("DOMContentLoaded", function () {
  // Se existe o formulário de login, estamos no index.html
  const loginForm = document.getElementById("loginForm");
  const erroEl = document.getElementById("erro");

  if (loginForm) {
    // Se já estiver logado e válido, manda direto pra HOME
    if (_estaLogadoEValido()) {
      window.location.href = AUTH.HOME_PAGE;
      return;
    }

    // Liga o submit do login
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const login = (document.getElementById("login")?.value || "").trim();
      const senha = (document.getElementById("senha")?.value || "").trim();

      // Regra de validação:
      // - Se AUTH.USERS estiver vazio, aceita qualquer login/senha NÃO vazios (modo demo).
      // - Se AUTH.USERS tiver usuários, valida contra a lista.
      let ok = false;

      if (AUTH.USERS.length === 0) {
        ok = Boolean(login) && Boolean(senha);
      } else {
        ok = AUTH.USERS.some((u) => u.user === login && u.pass === senha);
      }

      if (!ok) {
        if (erroEl) erroEl.style.display = "block";
        return;
      }

      if (erroEl) erroEl.style.display = "none";
      loginUsuario();
    });

    return; // IMPORTANTÍSSIMO: não chama verificarSessao() no login
  }

  // Se não é página de login, assume "página protegida" (dashboard e/ou portais dentro de projetos)
  verificarSessao();
});
