const url = "https://crudcrud.com/api/7038d89af08c4c29b89b577487245340/users";

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

//Botão para deletar a conta de usuário:
async function deleteUser(uuid) {
  await fetch(`${url}/${uuid}`, {
    method: "DELETE",
  });
}
const btnDeleteUser = document.querySelector(".btn-user");
btnDeleteUser.addEventListener("click", async () => {
  if (confirm("Tem certeza que deseja excluir sua conta? 😥")) {
    const currentUser = await getCurrentUser();
    deleteUser(currentUser._id);
    window.location = "./index.html";
  }
});

//Botão para adicionar um novo jogo:
const btnAdd = document.getElementById("btn-add");
btnAdd.addEventListener("click", () => {
  clearGameCards();
  toggleBtn();
});

//Função para criar dinamicamente o span com mensagem de erro caso o input não passe na validação:
function creatSpan(campo, divCampo) {
  const div = document.querySelector(divCampo);
  const error = document.createElement("span");
  error.classList.add("span-error");
  error.innerText = `O campo ${campo} é obrigatório!`;
  div.appendChild(error);
}

//Função para esconder o botão quando o formulário abrir e vice-versa:
function toggleBtn() {
  sectionForm.classList.toggle("display-hidden");
  btnAdd.classList.toggle("display-hidden");
}

//Definição da data atual para validação da data:
const currentDate = new Date().toISOString().split("T", 1);
let currentGameId = null;

//Função para formatar a primeira letra do input como maiúscula e demais minúsculas:
function inputFormated(input) {
  let maiuscula = input[0].toUpperCase();
  let minuscula = input.slice(1).toLowerCase();
  return maiuscula + minuscula;
}

//Função para tratar as imagens vindas do form e armazenar no localStorage:
function getImage() {
  const imageInput = document.getElementById("input-img");
  //Evento de change no input file
  imageInput.addEventListener("change", (event) => {
    //acesso a imagem:
    const image = event.target.files[0];
    //uso o constructor FileReader para criar um novo objeto:
    const reader = new FileReader();

    //quando a leitura como URL for concluída, o load é disparado, colocando o dado no localStorage:
    reader.addEventListener("load", () => {
      localStorage.setItem(image.name, reader.result);
    });

    if (image) {
      //quando finaliza a leitura, o result vai possuir uma URL, que traduz os dados do arquivo:
      reader.readAsDataURL(image);
    }
  });
}

const formGame = document.getElementById("form-game");
formGame.addEventListener("submit", async (event) => {
  event.preventDefault();
  getImage(); //Chamo essa função porque quando a o form for submetido, vai haver o evento de change

  //desestruturação do objeto:
  const {
    name: nome_jogo,
    date: data_lancamento,
    time: tempo_duracao,
    price: preco,
    gender: genero,
    image: imagem,
    platform: plataforma,
  } = event.target;

  const newGame = {
    nome: nome_jogo.value,
    data: data_lancamento.value,
    duracao: tempo_duracao.value,
    preco: preco.value,
    genero: genero.value,
    imagem: imagem.value.split("\\").at(-1), //removendo o fakepath da imagem
    plataforma: plataforma.value,
  };
  //Caso algum campo não passe na validação, retorna false, se for o true, retorna o newGame:
  if (!validateGame(newGame)) {
    return;
  }
  //Faço uma flag para validar a imagem:
  let flagImagem = newGame.imagem === "";
  const user = await getCurrentUser();
  if (currentGameId === null) {
    //VALIDAÇÃO DE IMAGEM:
    if (flagImagem) {
      alert("Adicione uma imagem!");
      return false;
    }

    //acessando o array com todos os ids válidos de jogos do usuário
    let listaId = user.jogos.map((jogo) =>
      jogo.id !== null && jogo.id !== undefined ? jogo.id : 0
    );
    //inicio uma variável com id = 0 e caso haja jogos cadastrados, o próximo jogo vai pegar o maior id e somar 1
    //caso não exista jogos cadastrados, i id será 0
    let maxId = 0;
    if (listaId.length > 0) {
      maxId = Math.max(...listaId) + 1;
    }

    newGame.id = maxId;

    //após validação de todos os campos e de imagem:
    user.jogos.push(newGame);
    alert("Jogo cadastrado com sucesso!");
    //caso esteja atualizando um jogo, e não criando:
  } else {
    newGame.id = currentGameId;
    let updatedGame = user.jogos.find((jogo) => jogo.id === newGame.id);
    updatedGame.nome = newGame.nome;
    updatedGame.data = newGame.data;
    updatedGame.duracao = newGame.duracao;
    updatedGame.preco = newGame.preco;
    updatedGame.genero = newGame.genero;
    //se, durante a edição, o usuário adicionar nova imagem, ela será exibida. Se não continua a antiga:
    if (!flagImagem) {
      updatedGame.imagem = newGame.imagem;
    }
    updatedGame.plataforma = newGame.plataforma;
    //retornando o status do currentGameId para null(estado padrão), para possibilitar adição de novo jogo:
    currentGameId = null;
    //removendo o modal correspondente ao jogo para ser criado novamente com as informações atualizadas:
    const modal = document.getElementById(newGame.id);
    modal.remove();
    alert("Jogo atualizado com sucesso!");
  }

  updateUser(user);
  createCard(user);

  formGame.reset();
  toggleBtn();
  //mudando o botão do formulário que era 'atualizar' para criar:
  const buttonCreate = document.getElementById("button");
  buttonCreate.value = "Criar";
  return;
});

//Função para validar cada campo do formulário:
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
//Função para atualizar os jogos do usuário no crud crud:
async function updateUser(user) {
  const uuid = `${user._id}`;
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

//Função para criar dinamicamente cada card dentro de uma <li>, com uma imagem e o nome do jogo:
async function createCard(user) {
  const ulGames = clearGameCards();

  user.jogos.forEach((game) => {
    const liCard = document.createElement("li");
    liCard.classList.add("game-card");
    ulGames.appendChild(liCard);

    const divPhoto = document.createElement("div");
    divPhoto.classList.add("div-photo");
    liCard.appendChild(divPhoto);

    const btnPhoto = document.createElement("button");
    btnPhoto.classList.add("btn-photo");
    divPhoto.appendChild(btnPhoto);

    const photo = document.createElement("img");
    photo.classList.add("img-game");
    photo.src = localStorage.getItem(game.imagem); //!!!
    btnPhoto.appendChild(photo);

    const divName = document.createElement("div");
    divName.classList.add("div-name");
    liCard.appendChild(divName);

    spanName = document.createElement("span");
    spanName.classList.add("span-name");
    spanName.innerText = inputFormated(game.nome);
    divName.appendChild(spanName);

    btnPhoto.addEventListener("click", async () => {
      const modal = document.getElementById(game.id);
      //Para não criar outro modal, caso um já esteja aberto:
      if (modal === null) {
        createModal(game);
      } else {
        modal.classList.toggle("display-hidden");
      }
    });
  });
}

//Função para criar o modal com todas as informações sobre o jogo, fornecidas no form:
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
  gameName.innerText = inputFormated(game.nome);
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
//Função para adequar o formulário do CREATE, para atualizar o jogo
//cada campo de input recebe o valor atual, que pode ser editado
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
  //configuração do currentGameId para ser igual ao do jogo atualizado:
  currentGameId = updatedGame.id;
  //substituo o value do botão de submissão para 'atualizar' em vez de 'criar' (form creat):
  const buttonCreate = document.getElementById("button");
  buttonCreate.value = "Atualizar";
}

//Função para injetar os elemntos dentro da ul:
function clearGameCards() {
  const ulGames = document.querySelector(".games-list");
  ulGames.innerHTML = "";
  return ulGames;
}

//função para deletar um jogo e atualizar o array de jogos do usuário e recriar os cards que não foram excluídos:
async function deleteGame(gameId) {
  const user = await getCurrentUser();
  user.jogos = user.jogos.filter((jogo) => jogo.id !== gameId);
  updateUser(user);
  createCard(user);
}

//função para fechar o modal do jogo com base no seu id:
function closeModal(game) {
  const modal = document.getElementById(game.id);
  modal.classList.add("display-hidden");
}

//função para reconhecer o usuário atual e criar os cards de seus jogos cadastrados:
async function init() {
  const user = await getCurrentUser();
  const welcome = document.getElementById("welcome");
  welcome.innerText = `Olá, ${user.nome} :)`;
  createCard(user);
}

const sectionForm = document.getElementById("section-form");

init();

//função para recarregar a página de 5 em 5 segundos, somente quando o form não estiver aberto:
setInterval(() => {
  if (sectionForm.classList.contains("display-hidden")) {
    init();
  }
}, 5000);
