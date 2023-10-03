const url = "https://crudcrud.com/api/7038d89af08c4c29b89b577487245340/users";
async function getUsers() {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

const btnLogin = document.querySelector(".login-btn");
btnLogin.addEventListener("click", async () => {
  const users = await getUsers();
  const loginInput = document.getElementById("login-input").value;
  const passwordInput = document.getElementById("password-input").value;
  const currentUser = users.filter((user) => user.nomeUsuario === loginInput);
  if (currentUser.length > 0) {
    if (currentUser.at(-1).senha === passwordInput) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      window.location = "./crud.html";
    } else {
      alert("Senha incorreta!");
    }
  } else {
    alert("Usuário não cadastrado!");
  }
});
