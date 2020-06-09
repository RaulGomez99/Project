const swissTournament = require('../lib/swissMatching')({maxPerRound:1});
module.exports = {
    addParticipant,
    addTournament,
    deleteTournament,
    deleteParticipant,
    startTournament,
    changeRound,
    pairResult
}

async function addTournament(req, res){
    if(!req.user) return res.status(401).send({msg:"Error not user loged"});
    if(!req.body.tournament) return res.status(401).send({msg:"Error not data"});
    const { tournament } = req.body;
    const { Tournament } = req.app.locals.db;
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
        tournament.creator = 1;
        await tournament.save();
    }else{
        return res.send({msg:'No puedes borrar un torneo ya empezado y no finalizado'});
    }
    res.send({success:'success'})
}

async function addParticipant(req, res){
    if(!req.user) return res.status(401).send({msg:"Error not user loged"});
    const { Tournament } = req.app.locals.db;
    const { id } = req.params;
    const { participant } = req.body;
    const tournament = await Tournament.findByPk(id);
    if(tournament.creator !== req.user.id) return res.status(401).send({msg:"You aren't the creator"});
    const { participants } = tournament;
    if(participants.filter(a => a.id === participant.id).length) return res.send({msg:"El participante no puede estar repetido"});
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
    if(tournament.creator !== req.user.id) return res.status(401).send({msg:"You aren't the creator"});
    if(tournament.participants.length<6) return res.send({msg:"Minimo son 6 personas"})
    try{
        tournament.state = 1;
        const pairings = swissTournament.getMatchups(1, tournament.participants, tournament.matches);
        const matches = pairings.map(pair => pairToMatches(pair,1));
        tournament.matches = JSON.stringify(tournament.matches.concat(matches));
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
    if(tournament.matches.filter(match => (match.round==tournament.state))
                         .filter(match => match.home.points+match.away.points != 1).length) return res.status(401).send({msg:"No estan seleccionados todos los partidos"})
    try{
        tournament.state++;
        if(tournament.state == Math.ceil(Math.log2(tournament.participants.length))){
            tournament.state = -1;
            await tournament.save();
            return res.send({final:"final"});
        } 
        const pairings = swissTournament.getMatchups(tournament.state, tournament.participants, tournament.matches);
        const matches = pairings.map(pair => pairToMatches(pair, tournament.state));
        tournament.matches = JSON.stringify(tournament.matches.concat(matches));
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
    const newPair = tournament.matches.map(match => {
        console.log(pair)
        if(match.home.id == pair.home.id && match.away.id == pair.away.id) {
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
function pairToMatches(pair,round){
    if(pair.home === null) return { round, home:{id:null, points:0}, away:{id:pair.away, points:1}}
    return {
        round, 
        home: {id: pair.home, points:0},
        away: {id: pair.away, points:0}
    }
}