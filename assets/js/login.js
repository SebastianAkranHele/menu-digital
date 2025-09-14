document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    console.log("🔄 Tentando login com:", email);

    const res = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log("📡 Status da resposta:", res.status);

    const data = await res.json();
    console.log("📦 Resposta JSON:", data);

    if (!res.ok) {
      throw new Error(data.error || "Erro no login");
    }

    if (!data.token) {
      throw new Error("Token não recebido do servidor");
    }

    // Salva token no sessionStorage
    sessionStorage.setItem("token", data.token);
    console.log("✅ Token salvo:", sessionStorage.getItem("token"));

    // Mensagem de sucesso
    Swal.fire({
      title: "Bem-vindo(a)!",
      text: "Login realizado com sucesso. Redirecionando...",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      background: "#800000",
      color: "#fff",
    });

    // Redireciona após o alerta
    setTimeout(() => {
      console.log("➡️ Redirecionando para menu-admin.html");
      window.location.href = "/menu-admin.html"; // sempre procura no frontend-server
    }, 1600);

  } catch (err) {
    console.error("❌ Erro no login:", err);
    Swal.fire({
      title: "Erro!",
      text: err.message,
      icon: "error",
      confirmButtonText: "Tentar novamente",
      background: "#800000",
      color: "#fff",
    });
  }
});
