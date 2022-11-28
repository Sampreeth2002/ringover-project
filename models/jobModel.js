module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define("job", {
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    priority: {
      type: DataTypes.INTEGER,
    },
    dependent: {
      type: DataTypes.INTEGER,
    },
  });

  return Job;
};
