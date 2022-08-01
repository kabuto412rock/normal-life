
module.exports = (sequelize, Sequelize) => {
  const Cost = sequelize.define("daily_costs", {
    name: Sequelize.STRING,
    cash: Sequelize.INTEGER,
    remark: Sequelize.STRING
  }, {
    timestamps: true
  });

  return Cost;
}

