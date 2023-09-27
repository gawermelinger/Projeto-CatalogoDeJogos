const users = JSON.parse(localStorage.getItem("users")) || [];

const form = document.getElementById("form-btn");

function creatSpan(campo, divCampo) {
  const div = document.querySelector(divCampo);
  const error = document.createElement("span");
  error.innerText = `O campo ${campo} é obrigatório!`;
  div.appendChild(error);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const {
    completeName: nome,
    userName: nomeUsuario,
    password: senha,
    passwordCheck: senhaConfirmada,
  } = event.target;

  const newUser = {
    nome: nome.value,
    nomeUsuario: nomeUsuario.value,
    senha: senha.value,
    jogos: [],
  };

  //VERIFICAÇÃO DE NOME
  if (newUser.nome === "") {
    creatSpan("nome", ".div-name");
    return;
  } else if (newUser.nome.length > 150) {
    alert("Nome não pode ultrapassar 150 caracteres!");
    return;
  }
  //VERIFICAÇÃO DE NOME DE USUÁRIO
  if (newUser.nomeUsuario === "") {
    creatSpan("nome de usuário", ".div-userName");
    return;
  } else if (newUser.nomeUsuario.includes(" ")) {
    alert("Nome de usuário não deve conter espaços!");
    return;
  } else if (
    newUser.nomeUsuario.length < 3 ||
    newUser.nomeUsuario.length > 15
  ) {
    alert("Nome de usuário pode ter no mínimo 3 caracteres e no máximo 15!");
    return;
  } else if (
    users.filter((user) => user.nomeUsuario === newUser.nomeUsuario).length !==
    0
  ) {
    alert("Nome de usuário indisponível!");
    return;
  }
  //VERIFICAÇÃO DE SENHA
  if (newUser.senha === "") {
    creatSpan("senha", ".div-password");
    return;
  } else if (newUser.senha.length < 4 || newUser.senha.length > 8) {
    alert("Senha deve ter no mínimo 4 caracteres e no máximo 8!");
    return;
  } else if (newUser.senha.includes(" ")) {
    alert("A senha não deve conter espaços!");
    return;
  }
  //VERIFICAÇÃO DE CONFIRMAÇÃO DE SENHA
  if (senhaConfirmada.value === "") {
    creatSpan("confirmação de senha", ".div-confirmPassword");
    return;
  } else if (newUser.senha !== senhaConfirmada.value) {
    alert("As senhas devem ser iguais!");
    return;
  }
  users.push(newUser);

  localStorage.setItem("users", JSON.stringify(users));

  alert("Usuário cadastrado com sucesso!");

  window.location = "./index.html";
});
