const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db/conn");
const bcrypt = require("bcrypt");

class User extends Model {
  async checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Sequelize gera UUID automaticamente
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    "2fa_code": { type: DataTypes.STRING(6), allowNull: true },
    profile_id: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "tb_users",
    sequelize,
    modelName: "User",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
      },
    },
  }
);

module.exports = User;
