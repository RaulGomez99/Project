module.exports = (sequelize, Datatypes) => {
    const Tournament = sequelize.define('tournament',{
        id:{
            type:Datatypes.INTEGER,
            primaryKey:true,
            autoIncrement : true
        },
        name:Datatypes.STRING,
        participants:Datatypes.TEXT,
        matches:Datatypes.TEXT,
        state:Datatypes.INTEGER,
        description: Datatypes.TEXT,
        creator: Datatypes.INTEGER,
        last_upgrade: Datatypes.TEXT,
        idphoto: Datatypes.TEXT
    },{timestamps:false});
    Tournament.associate = models => {
        Tournament.belongsTo(models.User,{foreignKey:'creator'});
    }
    return Tournament;
}