const swissTournament = require('../lib/swissMatching')({maxPerRound:1});
module.exports = {
    addParticipant,
    addTournament,
    deleteTournament,
    deleteParticipant,
    startTournament,
    changeRound,
    pairResult,
    getTournament,
    addCSV,
    deshacer,
    returnImg
}

async function addTournament(req, res){
    if(!req.user) return res.status(401).send({msg:"Error not user loged"});
    if(!req.body.tournament) return res.status(401).send({msg:"Error not data"});
    const { tournament, img } = req.body;
    const { Tournament } = req.app.locals.db;
    if(img){
        const tournamentSend = await Tournament.create({...tournament, creator:req.user.id, idphoto: img});
        return res.send(tournamentSend)
    }
    const tournamentSend = await Tournament.create({...tournament, creator:req.user.id});
    res.send(tournamentSend)
}

async function deleteTournament(req, res){
    if(!req.user) return res.status(401).send({msg:"Error not user loged"});
    const { id } = req.params;
    const { Tournament } = req.app.locals.db;
    const tournament = await Tournament.findByPk(id);
    if(tournament.creator !== req.user.id) return res.status(401).send({msg:"You aren't the creator"});
    if(tournament.state == 0){
        await tournament.destroy();
    }else if(tournament.state < 0){
        tournament.creator = null;
        await tournament.save();
    }else{
        return res.send({msg:'No puedes borrar un torneo ya empezado y no finalizado'});
    }
    res.send({success:'success'})
}

async function addParticipant(req, res){
    if(!req.user) return res.status(401).send({msg:"Error not user loged"});
    const { Tournament, User, Participant } = req.app.locals.db;
    const { id } = req.params;
    const { participant } = req.body;
    const tournament = await Tournament.findByPk(id);
    if(tournament.creator !== req.user.id) return res.status(401).send({msg:"You aren't the creator"});
    const { participants } = tournament;
    if(participants.filter(a => a.id === participant.id).length) return res.send({msg:"El participante no puede estar repetido"});
    if(!participant.seed && !participant.player) return res.send({msg:"El elo es obligatorio si no pones jugador"});
    if(isNaN(participant.seed)) return res.send({msg:"El elo debe ser un número"});
    if(participant.player){
        const user = await User.findOne({where:{username:participant.player.toLowerCase()}});
        if(!user) return res.send({msg:"El usuario no existe"});
        if(await Participant.findOne({where:{id_users:user.id, id_tournament:id}})) return res.send({msg:"El usuario no puede participar dos veces con la misma cuenta"});
        await Participant.create({id_users:user.id, id_tournament:id});
    }
    participants.push(participant);
    tournament.participants  = JSON.stringify(participants);
    await tournament.save();
    res.send(tournament);
}

async function deleteParticipant(req, res){
    if(!req.user) return res.status(401).send({msg:"Error not user loged"});
    const { Tournament } = req.app.locals.db;
    const { id } = req.params;
    const { idT } = req.body;
    const tournament = await Tournament.findByPk(id);
    if(tournament.creator !== req.user.id) return res.status(401).send({msg:"You aren't the creator"});
    const { participants } = tournament;
    tournament.participants = JSON.stringify(participants.filter(a => a.id !== idT));
    await tournament.save();
    res.send(tournament);
}

async function startTournament(req, res){
    if(!req.user) return res.status(401).send({msg:"Error not user loged"});
    const { Tournament } = req.app.locals.db;
    const { id }         = req.params;
    const tournament = await Tournament.findByPk(id);
    if(!req.user.ispremiun && tournament.participants.length>8) return res.status(401).send({msg:"Un torneo de prueba no puede tener más de 8 participantes"});
    if(tournament.creator !== req.user.id) return res.status(401).send({msg:"You aren't the creator"});
    if(tournament.participants.length<6) return res.send({msg:"Minimo son 6 personas"})
    try{
        tournament.state = 1;
        const pairings = swissTournament.getMatchups(1, tournament.participants, tournament.matches);
        let i = 1;
        const matches = pairings.map(pair => pairToMatches(pair,1, i++));
        tournament.matches = JSON.stringify(tournament.matches.concat(matches));
        tournament.last_upgrade = Date.now();
        tournament.save();
        res.send(tournament);
    }catch(e){
        res.send({msg:e.message})
    }
}

async function changeRound(req, res){
    if(!req.user) return res.status(401).send({msg:"Error not user loged"});
    const { Tournament } = req.app.locals.db;
    const { id }         = req.params;
    const tournament = await Tournament.findByPk(id);
    if(tournament.creator !== req.user.id) return res.status(401).send({msg:"You aren't the creator"});
    const matchesDidntPlayed = tournament.matches.filter(match => (match.round==tournament.state))
                                                 .filter(match => match.home.points+match.away.points != 1)
    if(matchesDidntPlayed.length){
        if(matchesDidntPlayed.filter(match => {
            const homePlayer = tournament.participants.filter(participant => participant.id === match.home.id)[0]; 
            const awayPlayer = tournament.participants.filter(participant => participant.id === match.away.id)[0]; 
            if(homePlayer.dropedOut && awayPlayer.dropedOut) return false;
            return true;
        }).length) return res.status(401).send({msg:"No estan seleccionados todos los partidos"})
    } 
    try{
        if(tournament.state >= Math.ceil(Math.log2(tournament.participants.length))){
            const standings = swissTournament.getStandings(Infinity, tournament.participants, tournament.matches);
            if(standings[0].wins == standings[1].wins){
                tournament.state += 1;
                const matches = tournament.matches;
                matches.push({
                    round:tournament.state, table:1,
                    home: {id: standings[0].id, points:0},
                    away: {id: standings[1].id, points:0}
                });
                tournament.matches = matches;
            }else tournament.state = -1;
            tournament.matches = JSON.stringify(tournament.matches);
            await tournament.save();
            return res.send(tournament);
        } 
        tournament.state++;
        const pairings = swissTournament.getMatchups(tournament.state, tournament.participants, tournament.matches);
        let i = 1;
        const matches = pairings.map(pair => pairToMatches(pair, tournament.state, i++));
        tournament.matches = JSON.stringify(tournament.matches.concat(matches));
        tournament.last_upgrade = Date.now();
        await tournament.save();
        res.send(tournament);
    }catch(e){
        res.send({msg:e.message})
    }
}

async function pairResult(req, res){
    if(!req.user) return res.status(401).send({msg:"Error not user loged"});
    const { Tournament } = req.app.locals.db;
    const { id }         = req.params;
    const pair           = req.body;
    const tournament = await Tournament.findByPk(id);
    if(tournament.creator !== req.user.id) return res.status(401).send({msg:"You aren't the creator"});
    if(pair.dropedOut){
        const participants = tournament.participants.map(participant => {
            if(participant.id == pair.home.id &&  pair.dropedOut.home!=undefined) {
                return{
                    ...participant,
                    dropedOut: pair.dropedOut.home ? true : false
                }
            }
            if(participant.id == pair.away.id && pair.dropedOut.away!=undefined){
                return{
                    ...participant,
                    dropedOut: pair.dropedOut.away ? true : false
                }
            }
            return participant;
        });
        tournament.participants = JSON.stringify(participants);
    }
    const newPair = tournament.matches.map(match => {
        if(match.home.id == pair.home.id && match.away.id == pair.away.id && match.round == pair.round) {
            return {
                ...match, 
                home:{...match.home, points: pair.home.points},
                away:{...match.away, points: pair.away.points}
            }
        }
        return match;
    })
    tournament.matches = JSON.stringify(newPair);
    await tournament.save();
    res.send(tournament);
}

function pairToMatches(pair,round, table){
    if(pair.home === null) return { round, home:{id:null, points:0}, away:{id:pair.away, points:1}}
    return {
        round, table,
        home: {id: pair.home, points:0},
        away: {id: pair.away, points:0}
    }
}

async function getTournament(req, res){
    const { Tournament } = req.app.locals.db;
    const { id } = req.params;
    try{
        const tournament = await Tournament.findByPk(id);
        if(!tournament || tournament.state===0) return res.status(404).send({msg:"Torneno no existente"})
        res.send(tournament);
    }catch(e){
        res.status(404).send({msg:"No existe ese torneo"});
    }
}

async function addCSV(req, res){
    if(!req.user) return res.status(401).send({msg:"Error not user loged"});
    const { Tournament, User, Participant } = req.app.locals.db;
    const { id } = req.params;
    const participantsBody = req.body;
    const tournament = await Tournament.findByPk(id);
    if(tournament.creator !== req.user.id) return res.status(401).send({msg:"You aren't the creator"});
    const { participants } = tournament;
    let errors = [];
    await Promise.all(participantsBody.map(async participant => {
        if(participants.filter(a => a.id === participant.id).length) errors.push(participant.id+": Está repetido");
        else if(isNaN(participant.seed)) errors.push(participant.id+": El elo deberia ser numerico");
        else if(participant.seed<=0) errors.push(participant.id+": El elo deberia ser mayor que 0");
        else if(participant.player){
            const user = await User.findOne({where:{username:participant.player.toLowerCase()}});
            if(!user) errors.push(participant.id+": El usuario no existe");
            else if(await Participant.findOne({where:{id_users:user.id, id_tournament:id}})) errors.push(participant.id+": El usuario no puede participar dos veces con la misma cuenta");
            else{
                await Participant.create({id_users:user.id, id_tournament:id});
                participants.push(participant);
            }
        }
        else{
            participants.push(participant);
        }
    }))
    console.log(errors);
    tournament.participants  = JSON.stringify(participants);
    await tournament.save();
    res.send({tournament, error:errors.join('\n')});
}

async function deshacer(req, res){
    if(!req.user) return res.status(401).send({msg:"Error not user loged"});
    const { Tournament } = req.app.locals.db;
    const { id }         = req.params;
    const tournament = await Tournament.findByPk(id);
    if(tournament.creator !== req.user.id) return res.status(401).send({msg:"You aren't the creator"});
    if(tournament.matches.filter(match => match.round == tournament.state).filter(match => {
        return match.home.points!==0 ||match.away.points !==0
    }).length) return res.send({msg:"No puedes deshacer una ronda habiendo jugado alguna partida"});
    tournament.matches = JSON.stringify(tournament.matches.filter(match => match.round !== tournament.state));
    tournament.last_upgrade = Date.now();
    tournament.state -= 1;
    await tournament.save();
    res.send(tournament);
}

async function returnImg(req, res){
    const { Tournament } = req.app.locals.db;
    const { id } = req.params;
    const tournament = await Tournament.findByPk(id);
    console.log(tournament)
    const fs = require('fs').promises;
    const contents = await fs.readFile('./img/'+tournament.idphoto+'.png', {encoding: 'base64'});
    res.send(contents);
}