const Sequelize= require("sequelize");
const sequelize = new Sequelize('project', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize.define('user', {
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true
    },
    username:{
        type:Sequelize.STRING
    },
    password:{
        type:Sequelize.STRING
    }
},{timestamps:false,freezeTableName:true})
