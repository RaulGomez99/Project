const initalState = {
    user:null,
    tournamentSelected: null
}

const reducer = (state = initalState, action) => {
    switch(action.type){
        case 'LOG_USER':
            return {
                ...state,
                user:action.user
            }
        case 'SET_TOKEN':
            return {
                ...state,
                token:action.token
            }

        case 'SET_ITEM':
            return {
                ...state,
                token: action.token,
                user: action.user
            }
        case 'LOG_OUT':
            return  initalState;
        
        case 'ADD_TOURNAMENT':
            return {
                ...state,
                user:{
                    ...state.user,
                    tournaments: state.user.tournaments.concat(action.tournament)
                } 
            }
        case 'REMOVE_TOURNAMENT':
            return {
                ...state,
                user:{
                    ...state.user,
                    tournaments: state.user.tournaments.filter(tournament => tournament.id !== action.id)
                } 
            }
        case 'SELECT_TOURNAMENT':
            return {
                ...state,
                tournamentSelected : state.user.tournaments.filter(tournament => tournament.id === action.id)[0]
            }

        case 'EDIT_TOURNAMENT':
            return {
                ...state,
                user: {
                    ...state.user,
                    tournaments: state.user.tournaments.filter(tournament => tournament.id !== action.id).concat(action.tournament)
                }
            }
            
        default : 
            return({...state})
    }
}

export default reducer;

export const readUser = state => (state.userReducer.user);
export const readTournament = state => (state.userReducer.tournamentSelected);
export const readToken = state => (state.userReducer.token);