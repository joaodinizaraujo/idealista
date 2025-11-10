const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const ideaController = require("../controllers/ideaController");
const voteController = require("../controllers/voteController");

// CRUD

router.get("/nova", isLoggedIn, ideaController.createPage);
router.post("/nova", isLoggedIn, ideaController.createIdea);
router.get("/editar/:id", isLoggedIn, ideaController.editPage);
router.post("/editar/:id", isLoggedIn, ideaController.updateIdea);
router.post("/deletar/:id", isLoggedIn, ideaController.deleteIdea);

// Votação
router.post("/votar", isLoggedIn, voteController.vote);

module.exports = router;
