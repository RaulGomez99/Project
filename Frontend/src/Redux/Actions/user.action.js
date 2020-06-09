export const logUser = user =>  ({
    type:'LOG_USER',
    user
})

export const logOut = _ =>  ({
    type:'LOG_OUT'
})

export const addTournament = tournament => ({
    type: 'ADD_TOURNAMENT',
    tournament
})

export const removeTournament = id => ({
    type: 'REMOVE_TOURNAMENT',
    id
})

export const selectTournament = id => ({
    type: 'SELECT_TOURNAMENT',
    id
})

export const editTournament = (id, tournament) => ({
    type: 'EDIT_TOURNAMENT',
    id, tournament
})
