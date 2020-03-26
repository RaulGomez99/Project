module.exports = (sequelize, Datatypes) => {
    const UserDetail = sequelize.define('user_details',{
        id:{
            type:Datatypes.INTEGER,
            primaryKey:true
        },
        persona:Datatypes.STRING
    },{freezeTableName:true,timestamps:false});
    UserDetail.associate = models => {
        UserDetail.belongsTo(models.User,{foreignKey:'id_user'});
    }
    return UserDetail;
}