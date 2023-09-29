const currentUser = JSON.parse(localStorage.getItem("currentUser")).at(-1);

const url = "https://crudcrud.com/api/5364100214b84a96aba99050d34cb2ff/users";
async function getUsers() {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

//const users = JSON.parse(localStorage.getItem("users"));
const formGame = document.getElementById("form-game");
let idJogos = 0;

const btnAdd = document.getElementById("btn-add");
const sectionForm = document.getElementById("section-form");

function creatSpan(campo, divCampo) {
  const div = document.querySelector(divCampo);
  const error = document.createElement("span");
  error.innerText = `O campo ${campo} é obrigatório!`;
  div.appendChild(error);
}
function toggleBtn() {
  sectionForm.classList.toggle("display-hidden");
  btnAdd.classList.toggle("display-hidden");
}
//validação da data
const currentDate = new Date().toISOString().split("T", 1);

btnAdd.addEventListener("click", () => {
  toggleBtn();
});

formGame.addEventListener("submit", async (event) => {
  event.preventDefault();
  const users = await getUsers();
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
    id: idJogos++,
  };
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
  //VALIDAÇÃO DO GENERO
  if (newGame.genero === "") {
    creatSpan("gênero", ".div-genero");
    return;
  }
  //VALIDAÇÃO DA PLATAFORMA
  if (newGame.plataforma === "") {
    alert("Você precisa marcar uma plataforma");
    return;
  }

  users.forEach((user) => {
    if (currentUser.nomeUsuario === user.nomeUsuario) {
      user.jogos.push(newGame);
      createCard(user);
      console.log(newGame.id);
      //localStorage.setItem("users", JSON.stringify(users));

      alert("Jogo cadastrado com sucesso!");
      formGame.reset();
      toggleBtn();
    }
  });
});

function createCard(user) {
  const ulGames = document.querySelector(".games-list");
  ulGames.innerHTML = "";

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

    btnPhoto.addEventListener("click", () => {
      creatModal(game);
    });
  });
}

function creatModal(game) {
  const main = document.querySelector("main");

  const modalSection = document.createElement("section");
  modalSection.classList.add("modal-section");
  modalSection.id = game.id;
  console.log(game.id);
  main.appendChild(modalSection);

  const divModal = document.createElement("div");
  divModal.classList.add("modal");
  modalSection.appendChild(divModal);

  const divContent = document.createElement("div");
  divContent.classList.add("content-modal");
  divModal.appendChild(divContent);

  const btnCloseModal = document.createElement("button");
  btnCloseModal.classList.add("close-modal");
  btnCloseModal.innerText = "x";
  divContent.appendChild(btnCloseModal);

  const gameName = document.createElement("h1");
  gameName.classList.add("game-name");
  gameName.innerText = game.nome;
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

  btnCloseModal.addEventListener("click", () => {
    closeModal();
  });
}

function closeModal() {
  const modal = document.querySelector("modal");
  modal.classList.add("display-hidden");
}
