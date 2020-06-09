module.exports = (sequelize, Datatypes) => {
    const User = sequelize.define('user',{
        id:{
            type:Datatypes.INTEGER,
            primaryKey:true,
            autoIncrement : true
        },
        name:Datatypes.STRING,
        last_name:Datatypes.STRING,
        email:Datatypes.STRING,
        username:Datatypes.STRING,
        password:Datatypes.STRING,
        ispremiun:Datatypes.INTEGER,
        logo:Datatypes.STRING
    },{timestamps:false});
    User.associate = models => {
        User.hasMany(models.Tournament, {foreignKey:'creator'})
    }
    return User;
}