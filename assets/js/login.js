document.getElementById("login-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // Autenticação simples (substitua pela lógica real)
  if (username === "admin" && password === "1234") {
    sessionStorage.setItem("isLoggedIn", true);

    // Mensagem de sucesso com SweetAlert
    Swal.fire({
      title: 'Bem-vindo(a)!',
      text: 'Login realizado com sucesso. Redirecionando...',
      icon: 'success',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      background: '#800000',
      color: '#fff',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    }).then(() => {
      window.location.href = "menu-admin.html";
    });

  } else {
    // Mensagem de erro com SweetAlert
    Swal.fire({
      title: 'Erro!',
      text: 'Usuário ou senha incorretos!',
      icon: 'error',
      confirmButtonText: 'Tentar novamente',
      background: '#800000',
      color: '#fff',
      confirmButtonColor: '#d4af37',
      showClass: {
        popup: 'animate__animated animate__shakeX'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOut'
      }
    });
  }
});
