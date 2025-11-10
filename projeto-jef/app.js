require("dotenv").config();
const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const csrf = require("csurf");
const path = require("path");
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const exphbs = require("express-handlebars");
const ideaController = require("./controllers/ideaController");

// Conexão com o banco (Aiven)
const sequelize = require("./db/conn");

// Rotas
const authRoutes = require("./routes/authRoutes");
const ideaRoutes = require("./routes/ideaRoutes");
const isLoggedIn = require("./middlewares/isLoggedIn");

const app = express();

const hbs = exphbs.create({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: {
    eq: (a, b) => a === b,
  },
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(flash());
app.use(csrf());

// Middleware global para CSRF e mensagens
app.use((req, res, next) => {
  if (req.csrfToken) {
    const token = req.csrfToken();
    res.locals.csrfToken = token;
  }
  res.locals.messages = req.flash();
  res.locals.userId = req.session.userId || null;
  res.locals.user = req.session.user || null;
  next();
});

app.use("/auth", authRoutes);
app.use("/ideias", ideaRoutes);

// Rota raiz → login
app.get("/", (req, res) => {
  res.redirect("/auth/login");
});

app.get("/dashboard", isLoggedIn, ideaController.listIdeasForDashboard);

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Conectado ao MySQL (Aiven) com sucesso!");
    app.listen(3000, () =>
      console.log("🚀 Servidor rodando em http://localhost:3000")
    );
  })
  .catch((err) => console.error("❌ Erro ao conectar ao MySQL (Aiven):", err));

app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    req.flash("error", "Sessão expirada. Tente novamente.");
    return res.redirect("back");
  }
  next(err);
});
