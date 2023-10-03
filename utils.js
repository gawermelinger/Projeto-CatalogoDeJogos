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
