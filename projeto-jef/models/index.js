const sequelize = require("../db/conn");

const User = require("./User");
const Idea = require("./Idea");
const Vote = require("./Vote");
const Profile = require("./Profile");

// Relações
Profile.hasMany(User, { foreignKey: "profile_id" });
User.belongsTo(Profile, { foreignKey: "profile_id" });

User.hasMany(Idea, { foreignKey: "owner_id" });
Idea.belongsTo(User, { foreignKey: "owner_id" });

User.belongsToMany(Idea, {
  through: Vote,
  foreignKey: "user_id",
  otherKey: "idea_id",
});
Idea.belongsToMany(User, {
  through: Vote,
  foreignKey: "idea_id",
  otherKey: "user_id",
});

module.exports = { sequelize, User, Idea, Vote, Profile };
