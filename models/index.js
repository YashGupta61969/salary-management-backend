'use strict';

const fs = require('fs');
const path = require('path');
const {Sequelize, DataTypes} = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const Admin = require('./admin')
const Employee = require('./employee')
const Salary = require('./salaries')
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

sequelize.authenticate().then(()=>{
  console.log('connected')
}).catch(err=>console.log(err))

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Admin = Admin(sequelize,DataTypes)
db.Employee = Employee(sequelize,DataTypes)
db.Salary = Salary(sequelize,DataTypes)

// Associations
db.Employee.hasOne(db.Salary)
db.Salary.belongsTo(db.Employee,{foreignKey:'employee_id'})

db.sequelize.sync({force:false}).then(() => {
  console.log('Synced')
})
.catch(err => {
  console.log(err)
})


module.exports = db;
