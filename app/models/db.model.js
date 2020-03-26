const Sequelize= require("sequelize");
const sequelize = new Sequelize('project', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

let db = {};

//Import all the sequlize models
db['User'] = sequelize['import']('./user.model.js');
db['UserDetail'] = sequelize['import']('./userDetails.model.js');


// Do all the relations
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;