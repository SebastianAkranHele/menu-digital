document.getElementById("login-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMessage = document.getElementById("error-message");

  // Limpa mensagens antigas
  errorMessage.textContent = "";
  errorMessage.className = "error-message";

  // Exemplo simples (ajustar para sua lógica real de autenticação)
  if (username === "admin" && password === "1234") {
    sessionStorage.setItem("isLoggedIn", true);

    // Mostra mensagem de sucesso rápida antes de redirecionar
    errorMessage.textContent = "Login realizado com sucesso! Redirecionando...";
    errorMessage.classList.add("success");

    setTimeout(() => {
      window.location.href = "menu-admin.html";
    }, 1000);
  } else {
    errorMessage.textContent = "Usuário ou senha incorretos!";
    errorMessage.classList.add("show");
  }
});
