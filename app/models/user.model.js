module.exports = (sequelize, Datatypes) => {
    const User = sequelize.define('user',{
        id:{
            type:Datatypes.INTEGER,
            primaryKey:true
        },
        username:Datatypes.STRING,
        password:Datatypes.STRING,
        logo:Datatypes.STRING
    },{timestamps:false});
    // User.associate = models => {

    // }
    return User;
}