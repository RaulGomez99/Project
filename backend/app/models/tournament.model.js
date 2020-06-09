module.exports = (sequelize, Datatypes) => {
    const Tournament = sequelize.define('tournament',{
        name:Datatypes.STRING,
        participants:Datatypes.TEXT,
        matches:Datatypes.TEXT,
        state:Datatypes.INTEGER,
        description: Datatypes.TEXT,
        creator: Datatypes.INTEGER
    },{timestamps:false});
    Tournament.associate = models => {
        Tournament.belongsTo(models.User,{foreignKey:'creator'});
    }
    return Tournament;
}