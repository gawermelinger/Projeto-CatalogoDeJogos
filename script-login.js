const url = "https://crudcrud.com/api/b53d9e046da6426994adb24153e9da51/users";
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
