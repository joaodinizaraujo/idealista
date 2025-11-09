const bcrypt = require("bcrypt");
const { User } = require("../models"); // importa o model do usuário

// Página de login
exports.loginPage = (req, res) => {
  res.render("auth/login");
};

// Login de usuário
exports.login = async (req, res) => {
  console.log("🔹 Requisição de login recebida:", req.body);

  const { email, password } = req.body;

  try {
    // Verifica se o usuário existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      req.flash("error", "Usuário não encontrado!");
      return res.redirect("/auth/login");
    }

    // Verifica senha
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash("error", "Senha incorreta!");
      return res.redirect("/auth/login");
    }

    // Guarda informações básicas na sessão (sem a senha)
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      profile_id: user.profile_id,
    };

    console.log("✅ Login bem-sucedido:", req.session.user);

    // Redireciona para o dashboard
    return res.redirect("/dashboard");
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
    await User.create({ name, email, password: hash, profile_id });

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
