async function getUsers() {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function getCurrentUser() {
  const users = await getUsers();
  let currentLocalUser = JSON.parse(localStorage.getItem("currentUser")).at(-1);
  users.forEach((user) => {
    if (currentLocalUser.nomeUsuario === user.nomeUsuario) {
      currentLocalUser = user;
    }
  });
  return currentLocalUser;
}

const url = "https://crudcrud.com/api/b53d9e046da6426994adb24153e9da51/users";

//const users = JSON.parse(localStorage.getItem("users"));

const btnAdd = document.getElementById("btn-add");
btnAdd.addEventListener("click", () => {
  clearGameCards();
  toggleBtn();
});
const sectionForm = document.getElementById("section-form");

function creatSpan(campo, divCampo) {
  const div = document.querySelector(divCampo);
  const error = document.createElement("span");
  error.classList.add("span-error");
  error.innerText = `O campo ${campo} é obrigatório!`;
  div.appendChild(error);
}
function toggleBtn() {
  sectionForm.classList.toggle("display-hidden");
  btnAdd.classList.toggle("display-hidden");
}
//validação da data
const currentDate = new Date().toISOString().split("T", 1);
let currentGameId = null;
const formGame = document.getElementById("form-game");
formGame.addEventListener("submit", async (event) => {
  event.preventDefault();
  //desestruturação do objeto:
  // name do input : nome que eu quero dar
  const {
    name: nome_jogo,
    date: data_lancamento,
    time: tempo_duracao,
    price: preco,
    gender: genero,
    platform: plataforma,
  } = event.target;

  const newGame = {
    nome: nome_jogo.value,
    data: data_lancamento.value,
    duracao: tempo_duracao.value,
    preco: preco.value,
    genero: genero.value,
    plataforma: plataforma.value, //!!!aqui não pode ter essa virgula
  };
  if (!validateGame(newGame)) {
    return;
  }

  const user = await getCurrentUser();
  if (currentGameId === null) {
    let listaId = user.jogos.map((jogo) =>
      (jogo.id !== null) & (jogo.id !== undefined) ? jogo.id : 0
    );
    let maxId = 0;
    if (listaId.length > 0) {
      maxId = Math.max(...listaId) + 1;
    }

    newGame.id = maxId;
    user.jogos.push(newGame);
    alert("Jogo cadastrado com sucesso!");
  } else {
    newGame.id = currentGameId;
    let updatedGame = user.jogos.find((jogo) => jogo.id === newGame.id);
    updatedGame.nome = newGame.nome;
    updatedGame.data = newGame.data;
    updatedGame.duracao = newGame.duracao;
    updatedGame.preco = newGame.preco;
    updatedGame.genero = newGame.genero;
    updatedGame.plataforma = newGame.plataforma;

    currentGameId = null;
    const modal = document.getElementById(newGame.id);
    modal.remove();
    alert("Jogo Atualizado com sucesso!");
  }

  updateUser(user);
  createCard(user);

  formGame.reset();
  toggleBtn();
  const buttonCreate = document.getElementById("button");
  buttonCreate.value = "Criar";
  return;
});

function validateGame(newGame) {
  //VALIDAÇÃO DO NOME:
  if (newGame.nome === "") {
    creatSpan("nome do jogo", ".div-nome");
    return false;
  } else if (newGame.nome.length > 200) {
    alert("Nome do jogo não deve exceder 200 caracteres");
    return false;
  }
  //VALIDAÇÃO DA DATA
  if (newGame.data === "") {
    creatSpan("data de lançamento", ".div-data");
    return false;
  } else if (newGame.data > currentDate) {
    alert("A data de lançamento não deve ser além de hoje.");
    return false;
  }
  //VALIDAÇÃO DA DURAÇÃO
  if (newGame.duracao === "") {
    creatSpan("duração", ".div-duracao");
    return false;
  } else if (Number(newGame.duracao) <= 0 || newGame.duracao.length > 6) {
    alert("Duração não pode ser menor que zero e nem maior que 6 dígitos");
    return false;
  }
  //VALIDAÇÃO DO PREÇO
  if (newGame.preco === "") {
    creatSpan("preço", ".div-preco");
    return false;
  } else if (Number(newGame.preco) <= 0 || newGame.preco.length > 6) {
    alert("Preço não pode ser menor que zero e nem maior que 6 dígitos.");
    return false;
  }
  //VALIDAÇÃO DO GENERO
  if (newGame.genero === "") {
    creatSpan("gênero", ".div-genero");
    return false;
  }
  //VALIDAÇÃO DA PLATAFORMA
  if (newGame.plataforma === "") {
    alert("Você precisa marcar uma plataforma");
    return false;
  }
  return true;
}

async function updateUser(user) {
  const uuid = `${user._id}`; //!!ver isso aqui (id não pode começar com número ou caracter especial)
  const userContent = {
    nome: user.nome,
    nomeUsuario: user.nomeUsuario,
    senha: user.senha,
    jogos: user.jogos,
  };
  await fetch(`${url}/${uuid}`, {
    headers: { "Content-Type": "application/json" },
    method: "PUT",
    body: JSON.stringify(userContent),
  });
}

async function createCard(user) {
  const ulGames = clearGameCards();

  user.jogos.forEach((game) => {
    const liCard = document.createElement("li");
    liCard.classList.add("game-card");
    //liCard.id = uuid;
    ulGames.appendChild(liCard);

    const divPhoto = document.createElement("div");
    divPhoto.classList.add("div-photo");
    liCard.appendChild(divPhoto);

    const btnPhoto = document.createElement("button");
    btnPhoto.classList.add("btn-photo");
    divPhoto.appendChild(btnPhoto);

    const photo = document.createElement("img");
    photo.classList.add("img-game");
    photo.src = "./assets/dice-1.png";
    btnPhoto.appendChild(photo);

    const divName = document.createElement("div");
    divName.classList.add("div-name");
    liCard.appendChild(divName);

    spanName = document.createElement("span");
    spanName.classList.add("span-name");
    spanName.innerText = game.nome;
    divName.appendChild(spanName);

    btnPhoto.addEventListener("click", async () => {
      const modal = document.getElementById(game.id);
      if (modal === null) {
        createModal(game);
      } else {
        //o modal nunca é refeito
        modal.classList.toggle("display-hidden");
      }
    });
  });
}

async function createModal(game) {
  const main = document.querySelector("main");

  const modalSection = document.createElement("section");
  modalSection.classList.add("modal-section");
  modalSection.id = game.id;

  main.appendChild(modalSection);

  const divModal = document.createElement("div");
  divModal.classList.add("modal");
  modalSection.appendChild(divModal);

  const divContent = document.createElement("div");
  divContent.classList.add("content-modal");
  divModal.appendChild(divContent);

  const btnCloseModal = document.createElement("button");
  btnCloseModal.classList.add("close-modal");
  divContent.appendChild(btnCloseModal);

  const imgCloseModal = document.createElement("img");
  imgCloseModal.classList.add("img-button");
  imgCloseModal.src = "./assets/botao-fechar.png";
  btnCloseModal.appendChild(imgCloseModal);

  const gameName = document.createElement("h1");
  gameName.classList.add("game-name");
  gameName.innerText = game.nome; //!!!chamar a função pra colocar a primeira letra maiúscula
  divContent.appendChild(gameName);

  const dataLaunch = document.createElement("span");
  dataLaunch.classList.add("span-data");
  dataLaunch.innerText = `Data de lançamento: ${game.data}`;
  divContent.appendChild(dataLaunch);

  const gameHours = document.createElement("span");
  gameHours.classList.add("span-hours");
  gameHours.innerText = `Horas jogadas: ${game.duracao}`;
  divContent.appendChild(gameHours);

  const gamePrice = document.createElement("span");
  gamePrice.classList.add("span-price");
  gamePrice.innerText = `Quanto paguei: R$ ${game.preco}`;
  divContent.appendChild(gamePrice);

  const gameGender = document.createElement("span");
  gameGender.classList.add("span-gender");
  gameGender.innerText = `Gênero: ${game.genero}`;
  divContent.appendChild(gameGender);

  const gamePlatform = document.createElement("span");
  gamePlatform.classList.add("span-platform");
  gamePlatform.innerText = `Onde joguei: ${game.plataforma}`;
  divContent.appendChild(gamePlatform);

  const bntDiv = document.createElement("div");
  bntDiv.classList.add("div-botoes");
  divContent.appendChild(bntDiv);

  const btnDeleteGame = document.createElement("button");
  btnDeleteGame.classList.add("btn-modal");
  bntDiv.appendChild(btnDeleteGame);

  const imgDeleteGame = document.createElement("img");
  imgDeleteGame.classList.add("img-button");
  imgDeleteGame.src = "./assets/excluir-game.png";
  btnDeleteGame.appendChild(imgDeleteGame);

  const btnEditGame = document.createElement("button");
  btnEditGame.classList.add("btn-modal");
  bntDiv.appendChild(btnEditGame);

  const imgEditGame = document.createElement("img");
  imgEditGame.classList.add("img-button");
  imgEditGame.src = "./assets/editar-game.png";
  btnEditGame.appendChild(imgEditGame);

  btnCloseModal.addEventListener("click", () => {
    closeModal(game);
  });

  btnDeleteGame.addEventListener("click", () => {
    if (confirm("Você tem certeza? A exclusão é irreversível 😮")) {
      closeModal(game);
      deleteGame(game.id);
    }
  });

  btnEditGame.addEventListener("click", () => {
    closeModal(game);
    toggleBtn();
    clearGameCards();
    editGame(game);
  });
}

async function editGame(updatedGame) {
  const gameName = document.getElementById("game-name");
  gameName.value = updatedGame.nome;

  const gameData = document.getElementById("game-date");
  gameData.value = updatedGame.data;

  const gameDuration = document.getElementById("game-time");
  gameDuration.value = updatedGame.duracao;

  const gamePrice = document.getElementById("game-price");
  gamePrice.value = updatedGame.preco;

  const gameGender = document.getElementById("select-form");
  gameGender.value = updatedGame.genero;

  const gamePlatform = document.getElementById(updatedGame.plataforma);
  gamePlatform.checked = true;

  currentGameId = updatedGame.id;

  const buttonCreate = document.getElementById("button");
  buttonCreate.value = "Atualizar";
}
function clearGameCards() {
  const ulGames = document.querySelector(".games-list");
  ulGames.innerHTML = "";
  return ulGames;
}

async function deleteGame(gameId) {
  //!!!não estamos usando o method:delete
  const user = getCurrentUser();

  user.jogos = user.jogos.filter((jogo) => jogo.id !== gameId);
  updateUser(user);
  createCard(user);
}

function closeModal(game) {
  const modal = document.getElementById(game.id);
  modal.classList.add("display-hidden");
}

async function init() {
  const user = await getCurrentUser();
  createCard(user);
}

init();
