const Idea = require("../models/Idea");
const Vote = require("../models/Vote");
const { User } = require("../models");

// Listar ideias ordenadas por votos (desc)
exports.list = async (req, res) => {
  const ideas = await Idea.findAll({
    include: [
      {
        model: Vote,
        attributes: [],
      },
    ],
    attributes: {
      include: [
        [
          // Subquery pra contar votos UP
          sequelize.literal(`(
            SELECT COUNT(*) FROM tb_votes 
            WHERE tb_votes.idea_id = Idea.id AND tb_votes.vote_type = 'UP'
          )`),
          "upvotes",
        ],
      ],
    },
    order: [[sequelize.literal("upvotes"), "DESC"]],
  });

  res.render("ideas/list", { ideas, user: req.session.user });
};

// Tela de nova ideia
exports.createPage = (req, res) => {
  res.render("ideas/create");
};

// Criar nova ideia
exports.create = async (req, res) => {
  const { title, description, category } = req.body;
  await Idea.create({
    title,
    description,
    category,
    owner_id: req.session.user.id,
  });
  req.flash("success", "Ideia criada com sucesso!");
  res.redirect("/ideias");
};

// Tela de detalhe
exports.detail = async (req, res) => {
  const idea = await Idea.findByPk(req.params.id, {
    include: [{ model: Vote }],
  });
  if (!idea) return res.redirect("/ideias");
  // Conta votos
  const upvotes = await Vote.count({
    where: { idea_id: idea.id, vote_type: "UP" },
  });
  const downvotes = await Vote.count({
    where: { idea_id: idea.id, vote_type: "DOWN" },
  });
  res.render("ideas/detail", { idea, upvotes, downvotes });
};

// Editar página (só dono)
exports.editPage = async (req, res) => {
  const idea = await Idea.findByPk(req.params.id);
  if (!idea || idea.owner_id !== req.session.user.id) {
    req.flash("error", "Acesso negado!");
    return res.redirect("/ideias");
  }
  res.render("ideas/edit", { idea });
};

// Editar (só dono)
exports.edit = async (req, res) => {
  const { title, description, category } = req.body;
  const idea = await Idea.findByPk(req.params.id);
  if (!idea || idea.owner_id !== req.session.user.id) {
    req.flash("error", "Acesso negado!");
    return res.redirect("/ideias");
  }
  idea.title = title;
  idea.description = description;
  idea.category = category;
  await idea.save();
  req.flash("success", "Ideia editada com sucesso!");
  res.redirect(`/ideias/${idea.id}`);
};

// Remover (só dono)
exports.delete = async (req, res) => {
  const idea = await Idea.findByPk(req.params.id);
  if (!idea || idea.owner_id !== req.session.user.id) {
    req.flash("error", "Acesso negado!");
    return res.redirect("/ideias");
  }
  await idea.destroy();
  req.flash("success", "Ideia removida!");
  res.redirect("/ideias");
};

// Votar
exports.vote = async (req, res) => {
  const { type } = req.body; // type = 'UP' ou 'DOWN'
  const { id: idea_id } = req.params;
  const user_id = req.session.user.id;

  // Garante voto único
  const existing = await Vote.findOne({ where: { user_id, idea_id } });
  if (existing) {
    req.flash("error", "Você já votou nesta ideia!");
    return res.redirect(`/ideias/${idea_id}`);
  }

  await Vote.create({ user_id, idea_id, vote_type: type });
  req.flash("success", "Voto registrado!");
  res.redirect(`/ideias/${idea_id}`);
};
