module.exports = (sequelize, Datatypes) => {
    const Participant = sequelize.define('participant',{
        id:{
            type:Datatypes.INTEGER,
            primaryKey:true,
            autoIncrement : true
        },
        id_users: Datatypes.INTEGER,
        id_tournament: Datatypes.INTEGER,
    },{timestamps:false});
    Participant.associate = models => {
        Participant.belongsTo(models.Tournament,{foreignKey: 'id_tournament'})
    }
    return Participant;
}