const currentUser = JSON.parse(localStorage.getItem("currentUser")).at(-1);

const users = JSON.parse(localStorage.getItem("users"));

const formGame = document.getElementById("form-game");

function creatSpan(campo, divCampo) {
  const div = document.querySelector(divCampo);
  const error = document.createElement("span");
  error.innerText = `O campo ${campo} é obrigatório!`;
  div.appendChild(error);
}
//validação da data
const currentDate = new Date().toISOString().split("T", 1);

formGame.addEventListener("submit", (event) => {
  event.preventDefault();
  //desestruturação do objeto:
  // name do input : nome que eu quero dar
  const {
    name: nome_jogo,
    date: data_lancamento,
    time: tempo_duracao,
    price: preco,
    photo: foto_jogo,
    gender: genero,
    platform: plataforma,
  } = event.target;

  const newGame = {
    nome: nome_jogo.value,
    data: data_lancamento.value,
    duracao: tempo_duracao.value,
    preco: preco.value,
    foto: foto_jogo.value,
    genero: genero.value,
    plataforma: plataforma.value,
  };
  console.log(newGame.foto);
  //VALIDAÇÃO DO NOME:
  if (newGame.nome === "") {
    creatSpan("nome do jogo", ".div-nome");
    return;
  } else if (newGame.nome.length > 200) {
    alert("Nome do jogo não deve exceder 200 caracteres");
    return;
  }
  //VALIDAÇÃO DA DATA
  if (newGame.data === "") {
    creatSpan("data de lançamento", ".div-data");
    return;
  } else if (newGame.data > currentDate) {
    alert("A data de lançamento não deve ser além de hoje.");
    return;
  }
  //VALIDAÇÃO DA DURAÇÃO
  if (newGame.duracao === "") {
    creatSpan("duração", ".div-duracao");
    return;
  } else if (Number(newGame.duracao) <= 0 || newGame.duracao.length > 6) {
    alert("Duração não pode ser menor que zero e nem maior que 6 dígitos");
    return;
  }
  //VALIDAÇÃO DO PREÇO
  if (newGame.preco === "") {
    creatSpan("preço", ".div-preco");
    return;
  } else if (Number(newGame.preco) <= 0 || newGame.preco.length > 6) {
    alert("Preço não pode ser menor que zero e nem maior que 6 dígitos.");
    return;
  }
  if (newGame.genero === "") {
    creatSpan("gênero", ".div-genero");
    return;
  }
  if (newGame.plataforma === "") {
    alert("Você precisa marcar uma plataforma");
    return;
  }

  users.forEach((user) => {
    if (currentUser.nomeUsuario === user.nomeUsuario) {
      user.jogos.push(newGame);
    }
  });
  console.log(users);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Jogo cadastrado com sucesso!");
});
