module.exports = (sequelize, Datatypes) => {
    const User = sequelize.define('user',{
        id:{
            type:Datatypes.INTEGER,
            primaryKey:true
        },
        username:Datatypes.STRING,
        password:Datatypes.STRING
    },{freezeTableName:true,timestamps:false});
    User.associate = models => {
        User.hasMany(models.UserDetail,{foreignKey:'id_user'});
    }
    return User;
}