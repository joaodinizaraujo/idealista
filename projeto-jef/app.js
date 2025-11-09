require("dotenv").config();
const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const csrf = require("csurf");
const exphbs = require("express-handlebars");
const path = require("path");

// Conexão com o banco (Aiven)
const sequelize = require("./db/conn");

// Rotas
const authRoutes = require("./routes/authRoutes");
const ideaRoutes = require("./routes/ideaRoutes");
const isLoggedIn = require("./middlewares/isLoggedIn");

const app = express();

// Configurar Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middlewares base
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Sessão
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // alterar para true se for HTTPS
  })
);

// Flash e CSRF
app.use(flash());
app.use(csrf());

// Middleware global (CSRF e mensagens)
app.use((req, res, next) => {
  if (req.csrfToken) {
    const token = req.csrfToken();
    res.locals.csrfToken = token;
    console.log("🔐 Novo CSRF Token:", token);
  }
  res.locals.messages = req.flash();
  res.locals.userId = req.session.userId || null;
  next();
});

// Rotas
app.use("/auth", authRoutes);
app.use("/ideias", ideaRoutes);

// Teste de rota raiz
app.get("/", (req, res) => {
  res.redirect("/auth/login");
});

app.get("/dashboard", isLoggedIn, (req, res) => {
  res.render("dashboard", { user: req.session.user });
});
// Conectar ao banco e iniciar servidor
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Conectado ao MySQL (Aiven) com sucesso!");
    app.listen(3000, () =>
      console.log("🚀 Servidor rodando em http://localhost:3000")
    );
  })
  .catch((err) => console.error("❌ Erro ao conectar ao MySQL (Aiven):", err));

// Middleware de erro CSRF (evita crash se o token expirar)
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    req.flash("error", "Sessão expirada. Tente novamente.");
    return res.redirect("back");
  }
  next(err);
});
