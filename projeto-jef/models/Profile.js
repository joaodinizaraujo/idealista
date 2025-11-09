const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db/conn");

class Profile extends Model {}

Profile.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
  },
  {
    tableName: "tb_profiles",
    sequelize,
    modelName: "Profile",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Profile;
