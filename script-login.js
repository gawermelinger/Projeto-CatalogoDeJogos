const btnLogin = document.querySelector(".login-btn");
btnLogin.addEventListener("click", () => {
  const users = JSON.parse(localStorage.getItem("users"));
  const loginInput = document.getElementById("login-input").value;
  const passwordInput = document.getElementById("password-input").value;
  const currentUser = users.filter((user) => user.nomeUsuario === loginInput);
  if (currentUser.length > 0) {
    if (currentUser.at(-1).senha === passwordInput) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      window.location = "./crud.html";
    }
  } else {
    alert("Usuário não cadastrado!");
  }
});
