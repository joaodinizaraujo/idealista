const express = require("express");
const router = express.Router();
const ideaController = require("../controllers/ideaController");
const isLoggedIn = require("../middlewares/isLoggedIn");

// Listar todas
router.get("/", isLoggedIn, ideaController.list);

// Nova ideia
router.get("/nova", isLoggedIn, ideaController.createPage);
router.post("/nova", isLoggedIn, ideaController.create);

// Detalhe
router.get("/:id", isLoggedIn, ideaController.detail);

// Editar
router.get("/:id/editar", isLoggedIn, ideaController.editPage);
router.post("/:id/editar", isLoggedIn, ideaController.edit);

// Deletar
router.post("/:id/deletar", isLoggedIn, ideaController.delete);

// Votar
router.post("/:id/votar", isLoggedIn, ideaController.vote);

module.exports = router;
