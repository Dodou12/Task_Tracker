const readline = require("readline/promises");
const fs = require("fs/promises");
const { log } = require("console");
const FICHIER = "Task_Tracker/tasks.json";

var id;
var description;
var statu;
var createdAt;
var updatedAt;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Fonction pour lire le fichier
const readFichier = async (file) => {
  try {
    // Ont ouvre le fichier et ont donne le format voulue
    const contenu = await fs.readFile(file, "utf-8");
    // Ont le converti de JSON en tableau
    return contenu ? JSON.parse(contenu) : {};
  } catch (error) {
    return {}; // Si le fichier est vide ont par d'un objet vide
  }
};

const trouverId = async (ID) => {
  // Lectue du fichier
  const contenu = await readFichier(FICHIER);

  // Ont recupere tous les clef de l'objet (id,description,...) sous forme de tableau temporaire
  const ID_tasks = Object.keys(contenu);

  // Parcour le tableau des elements et recherche pour lequel l'ID correspond
  for (let index = 0; index < ID_tasks.length; index++) {
    const element = ID_tasks[index];
    if (ID === element) {
      return ID;
    }
  }
  return false;
};

const addTask = async () => {
  const contenu = await readFichier(FICHIER);

  id = "TASK_" + Date.now();
  description = await rl.question("Entrer la description : ");
  statu = "todo";
  createdAt = Date.now();
  updatedAt = "";

  console.log("========Affichage========");
  console.log(`id : ${id}`);
  console.log(`description : ${description}`);
  console.log(`statu : ${statu}`);
  console.log(`createdAt : ${createdAt}`);
  console.log(`updatedAt : ${updatedAt}`);
  console.log("========Affichage========");

  // Création de la nouvelle tache
  const newTask = {
    id: id,
    description: description,
    statu: statu,
    createdAt: createdAt,
    updatedAt: updatedAt,
  };

  // Lecture du fichier

  // Ajoute de l'objet Task dans contenu pour l'utiliser
  contenu[id] = newTask;
  // Ont convertir le tableau obtenu en JSON
  const convertToJSON = JSON.stringify(contenu, null, 2);
  // Et ont ajoute le contenu obtenue dans le fichier json
  await fs.writeFile(FICHIER, convertToJSON, "utf-8");

  console.log("Enregistrement bien effectuer !");
  console.log("Nouvelle tache ajouter .");
  console.log(contenu[id]);

  rl.close();
};

/*
 ouvertur du fichier 
 demande a l'utilisateur de saisir l'ID de la tache a modifier
  verifie dans le tableau si cet ID existe si oui continuer
  s'il exist modifier la description 
  et possiblement le Status

*/
const updateTask = async () => {
  // Lecture du fichier
  const contenu = await readFichier(FICHIER);
  const ID = await rl.question("Entrer l'ID de la tache a modifier :");
  try {
    // Verification de l'existance du fichier
    if (await trouverId(ID)) {
      contenu[ID].description = await rl.question("Modifier la description :");
      contenu[ID].updatedAt = Date.now();

      console.log(`La description est : ${contenu[ID].description}`);
      console.log(`La date de MAJ est : ${contenu[ID].updatedAt}`);

      // Ajouter les modification effectuer a la tache modifier
      const data = JSON.stringify(contenu, null, 2);

      // Reecrire le fichier completement avec les modification effectué
      await fs.writeFile(FICHIER, data, "utf-8");

      console.log("Modification bien effectuer !");
    } else {
      console.log("Identifiant non trouvé");
    }
  } catch (error) {
    throw new Error(error.toString());
  }
};
// Fonction pour supprimer une tache
const readTask = async () => {
  const contenu = await readFichier(FICHIER);
  const ID = await rl.question("Entrer l'ID de la tache a afficher :");

  if (trouverId(ID)) {
    console.log("========Tache ========");
    console.log(`id : ${contenu[ID].id}`);
    console.log(`description : ${contenu[ID].description}`);
    console.log(`statu : ${contenu[ID].statu}`);
    console.log(`createdAt : ${contenu[ID].createdAt}`);
    console.log(`updatedAt : ${contenu[ID].updatedAt}`);
    console.log("========Affichage========");
  } else {
    console.log("La tache n'a pas ete trouvé ");
  }
  console.log("\n");
};
// Fonction pour supprimer une tache
const deleteTask = async () => {
  try {
    const contenu = await readFichier(FICHIER);
    const ID = await rl.question("Entrer l'ID de la tache a modifier :");

    if (await trouverId(ID)) {
      delete contenu[ID];

      const data = JSON.stringify(contenu, null, 2);

      await fs.writeFile(FICHIER, data, "utf-8");

      console.log("Tache bien supprimer avec succès");
      console.log(contenu);
    } else {
      console.log("Tache inexistante dans la liste");
    }
  } catch (error) {
    throw error;
  }
};
// Fonction pour cahnger le status d'une tache
const changeStatusTask = async () => {
  const contenu = await readFichier(FICHIER);
  const ID = await rl.question("Entrer l'ID d'une tache :");

  if (await trouverId(ID)) {
    // Mini menu pour choisir l'etat de la tache
    console.log("Changer le status de la tache :");
    console.log("1 - todo");
    console.log("2 - done");
    console.log("3 - en cours");

    // Choix de l"etat a effectue
    let saisie = await rl.question("Votre choix (1,2,3) :");
    const choix = parseInt(saisie, 10);

    if (choix === 1) {
      contenu[ID].statu = "todo";
    } else if (choix === 2) {
      contenu[ID].statu = "done";
    } else if (choix === 3) {
      contenu[ID].statu = "in execussion";
    } else {
      console.log("Choix non valide !");
    }

    // Convertie le fichier en Objet JSON
    const data = JSON.stringify(contenu, null, 2);

    // Reecrire le fichier avec les modification effectué
    await fs.writeFile(FICHIER, data, "utf-8");

    console.log("Mise a jour de l'etat la tache bien effectué !");

    console.log("========Tache ========");
    console.log(`id : ${contenu[ID].id}`);
    console.log(`description : ${contenu[ID].description}`);
    console.log(`statu : ${contenu[ID].statu}`);
    console.log(`createdAt : ${contenu[ID].createdAt}`);
    console.log(`updatedAt : ${contenu[ID].updatedAt}`);
    console.log("========Affichage========");

    console.log("\n");
  } else {
    console.log(`Aucune tache n'existe pour ID : ${ID}`);
  }
};

// Fonction pour recherche les taches terminés
const searchTaskDone = async () => {
  // Lecture du contenue du fchier
  const contenu = await readFichier(FICHIER);

  // Ont cree un tableau des valeur des tache (descitption,todo,date..)
  const listeTask = Object.values(contenu);

  // Ont filtre les valueur obtenue qui son terminer
  const taskDone = listeTask.filter((Task) => {
    return Task.statu === "done";
  });

  console.log("La liste des taches terminés :");
  console.log(taskDone);
};

// Fonction pour recherche les taches en execussion
const searchTaskInExecussion = async () => {
  // Lecture du contenue du fchier
  const contenu = await readFichier(FICHIER);

  // Ont cree un tableau des valeur des tache (descitption,todo,date..)
  const listeTask = Object.values(contenu);

  // Ont filtre les valueur obtenue qui son todo
  const taskInExcecussion = listeTask.filter((Task) => {
    return Task.statu === "in execussion";
  });

  console.log(taskInExcecussion);

  console.log("\n");
};

// Fonction pour recherche les taches a faire
const searchTaskTodo = async () => {
  // Lecture du contenue du fchier
  const contenu = await readFichier(FICHIER);

  // Ont cree un tableau des valeur des tache (descitption,todo,date..)
  const listeTask = Object.values(contenu);

  // Ont filtre les valueur obtenue qui son todo
  const taskTodo = listeTask.filter((Task) => {
    return Task.statu === "todo";
  });

  console.log(taskTodo);

  console.log("\n");
};

module.exports = {
  addTask,
  updateTask,
  deleteTask,
  readTask,
  changeStatusTask,
  searchTaskDone,
  searchTaskTodo,
  searchTaskInExecussion,
};
