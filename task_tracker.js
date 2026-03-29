const { addTask, updateTask, deleteTask, readTask, changeStatusTask, searchTaskDone, searchTaskInExecussion, searchTaskTodo } = require("./Handler");
const readline = require("readline/promises");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});
let choix;
const main = async () => {
  do {
    console.log("\n");

    console.log("=========== Menu de navigation ============= ");
    console.log("1 - Ajouter une tache ");
    console.log("2 - Modifier une tache ");
    console.log("3 - Supprier une tache ");
    console.log("4 - Afficher une tache ");
    console.log("5 - Marquer une tache comme etant en cour ou effectuees ");
    console.log("6 - Enumerer toute les taches effectuees ");
    console.log("7 - Enumerer toute les taches en cour ");
    console.log("8 - Enumerer toute les taches qui ne sont pas effectuees ");
    console.log("9 - Quitter ");

    const saisie = await rl.question("Votre choix (1 à 9): ");
    choix = parseInt(saisie, 10);

    if (choix < 1 || choix > 9) {
      console.log("Choix non possible ");
      return;
    }

    switch (choix) {
      case 1:
        await addTask();
        await main()
        break;

      case 2:
        await updateTask();
        break;

      case 3:
        await deleteTask();
        break;

      case 4:
        await readTask();
        break;

      case 5: 
        await changeStatusTask();
        break;

      case 6:
        await searchTaskDone();
        break;

      case 7:
        await searchTaskInExecussion()
        break;

      case 8:
        await searchTaskTodo()
        break;

      case 9:
        console.log("Aurevoir !");
        break;

      default:
        console.log("Erreur lors du choix");

        break;
    }
  } while (choix !== 9);
};

main();
