require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // evita erro de certificado local
      },
    },
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => console.log("✅ Conectado ao MySQL (Aiven) com sucesso!"))
  .catch((err) => console.error("❌ Erro ao conectar ao MySQL (Aiven):", err));

module.exports = sequelize;
