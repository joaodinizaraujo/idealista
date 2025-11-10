// controllers/voteController.js
const { Vote } = require("../models");

exports.vote = async (req, res) => {
  const { ideaId, type } = req.body;
  const userId = req.session.user.id;

  const redirectPath = "/dashboard";

  try {
    const existingVote = await Vote.findOne({
      where: { user_id: userId, idea_id: ideaId },
    });

    if (existingVote) {
      if (existingVote.vote_type === type) {
        await existingVote.destroy();
        req.flash("success", "Voto removido com sucesso!");
        return res.redirect(redirectPath);
      } else {
        await existingVote.update({ vote_type: type });
        req.flash("success", "Voto alterado com sucesso!");
        return res.redirect(redirectPath);
      }
    } else {
      await Vote.create({ user_id: userId, idea_id: ideaId, vote_type: type });
      req.flash("success", "Voto registrado com sucesso!");
      return res.redirect(redirectPath);
    }
  } catch (err) {
    console.error("Erro ao votar:", err);
    req.flash("error", "Ocorreu um erro inesperado ao processar o voto.");
    res.redirect(redirectPath);
  }
};
