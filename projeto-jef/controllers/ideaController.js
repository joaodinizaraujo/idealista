const { Idea, Vote, User } = require("../models");
const sequelize = require("sequelize");

exports.listIdeasForDashboard = async (req, res) => {
  const userId = req.session.user ? req.session.user.id : null;

  try {
    const ideas = await Idea.findAll({
      include: [{ model: User, attributes: ["name"] }],
      attributes: {
        include: [
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM tb_votes WHERE tb_votes.idea_id = Idea.id AND tb_votes.vote_type = 'UP')`
            ),
            "totalUpvotes",
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM tb_votes WHERE tb_votes.idea_id = Idea.id AND tb_votes.vote_type = 'DOWN')`
            ),
            "totalDownvotes",
          ],
          [
            sequelize.literal(
              `(SELECT tb_votes.vote_type FROM tb_votes WHERE tb_votes.idea_id = Idea.id AND tb_votes.user_id = '${userId}' LIMIT 1)`
            ),
            "userVoteType",
          ],
        ],
      },
      order: [[sequelize.literal("totalUpvotes - totalDownvotes"), "DESC"]],
      group: ["Idea.id", "User.id", "User.name"],
    });

    const formattedIdeas = ideas.map((idea) => idea.get({ plain: true }));

    res.render("dashboard", {
      ideas: formattedIdeas,
      user: req.session.user,
    });
  } catch (err) {
    console.error("Erro ao carregar ideias para o Dashboard:", err);
    req.flash("error", "Erro ao carregar ideias no Dashboard.");
    res.redirect("/");
  }
};

exports.redirectList = (req, res) => {
  res.redirect("/dashboard");
};

exports.createPage = (req, res) => {
  res.render("ideias/nova");
};

exports.createIdea = async (req, res) => {
  const { title, description, category } = req.body;
  try {
    await Idea.create({
      title,
      description,
      category,
      owner_id: req.session.user.id,
    });

    req.flash("success", "Ideia criada com sucesso!");
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Erro ao criar ideia:", err);
    req.flash("error", "Erro ao criar ideia.");
    res.redirect("/ideias/nova");
  }
};

exports.editPage = async (req, res) => {
  const { id } = req.params;
  try {
    const idea = await Idea.findByPk(id);
    if (!idea || idea.owner_id !== req.session.user.id) {
      req.flash("error", "Você não tem permissão para editar esta ideia!");
      return res.redirect("/dashboard");
    }
    res.render("ideias/editar", { idea });
  } catch (err) {
    console.error(err);
    req.flash("error", "Erro ao carregar ideia.");
    res.redirect("/dashboard");
  }
};

exports.updateIdea = async (req, res) => {
  const { id } = req.params;
  const { title, description, category } = req.body;

  try {
    const idea = await Idea.findByPk(id);
    if (!idea || idea.owner_id !== req.session.user.id) {
      req.flash("error", "Você não pode editar esta ideia!");
      return res.redirect("/dashboard");
    }

    await idea.update({ title, description, category });
    req.flash("success", "Ideia atualizada com sucesso!");
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    req.flash("error", "Erro ao atualizar ideia.");
    res.redirect("/dashboard");
  }
};

exports.deleteIdea = async (req, res) => {
  const { id } = req.params;
  try {
    const idea = await Idea.findByPk(id);
    if (!idea || idea.owner_id !== req.session.user.id) {
      req.flash("error", "Você não pode deletar esta ideia!");
      return res.redirect("/dashboard");
    }

    await idea.destroy();
    req.flash("success", "Ideia removida com sucesso!");
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    req.flash("error", "Erro ao deletar ideia.");
    res.redirect("/dashboard");
  }
};
