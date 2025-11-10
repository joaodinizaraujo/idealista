const { Vote } = require("../models");

exports.vote = async (req, res) => {
  const { id, type } = req.body;
  const userId = req.session.user.id;

  try {
    const existingVote = await Vote.findOne({
      where: { user_id: userId, idea_id: id },
    });

    if (existingVote) {
      req.flash("error", "Você já votou nesta ideia!");
      return res.redirect("/ideas");
    }

    await Vote.create({ user_id: userId, idea_id: id, vote_type: type });
    req.flash("success", "Voto registrado com sucesso!");
    res.redirect("/ideas");
  } catch (err) {
    console.error("Erro ao votar:", err);
    req.flash("error", "Erro ao registrar voto.");
    res.redirect("/ideas");
  }
};
