const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db/conn");

class Vote extends Model {}

Vote.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: { type: DataTypes.STRING, allowNull: false },
    idea_id: { type: DataTypes.STRING, allowNull: false },
    vote_type: {
      type: DataTypes.ENUM("UP", "DOWN"),
      allowNull: false,
    },
  },
  {
    tableName: "tb_votes",
    sequelize,
    modelName: "Vote",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["user_id", "idea_id"],
      },
    ],
  }
);

module.exports = Vote;
