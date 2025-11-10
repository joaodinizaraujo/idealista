const bcrypt = require("bcrypt");
const { User } = require("../models");

// Página de login
exports.loginPage = (req, res) => {
  res.render("auth/login");
};

// Login de usuário
exports.login = async (req, res) => {
  console.log("🔹 Requisição de login recebida:", req.body);

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("erro no user!");
      req.flash("error", "Usuário não encontrado!");
      return res.redirect("/auth/login");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("Senha incorreta!!!");
      req.flash("error", "Senha incorreta!");
      return res.redirect("/auth/login");
    }

    // Salva o usuário na sessão
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      profile_id: user.profile_id,
    };

    req.session.save((err) => {
      if (err) {
        console.error("❌ Erro ao salvar sessão:", err);
        req.flash("error", "Erro ao iniciar sessão. Tente novamente.");
        return res.redirect("/auth/login");
      }

      console.log("✅ Login bem-sucedido! Redirecionando para dashboard...");
      return res.redirect("/dashboard");
    });
  } catch (err) {
    console.error("❌ Erro ao fazer login:", err);
    req.flash("error", "Erro interno. Tente novamente.");
    return res.redirect("/auth/login");
  }
};

// Página de registro
exports.registerPage = (req, res) => {
  res.render("auth/register");
};

// Registro de novo usuário
exports.register = async (req, res) => {
  try {
    const { name, email, password, profile_id } = req.body;

    // Verifica se já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      req.flash("error", "E-mail já cadastrado!");
      return res.redirect("/auth/register");
    }

    // Criptografa a senha
    const hash = await bcrypt.hash(password, 10);

    // Cria o usuário
    await User.create({ name, email, password, profile_id });

    req.flash(
      "success",
      "Conta criada com sucesso! Faça login para continuar."
    );
    return res.redirect("/auth/login");
  } catch (err) {
    console.error("❌ Erro ao registrar usuário:", err);
    req.flash("error", "Erro ao registrar. Tente novamente.");
    return res.redirect("/auth/register");
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
};
