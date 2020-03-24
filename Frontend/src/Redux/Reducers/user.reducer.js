const initalState = {
    user:null,
    token:""
}

const reducer = (state = initalState, action) => {
    switch(action.type){
        case 'LOG_USER':
            return {
                ...state,
                user:{
                    ...state.user,
                    id:state.user.id+1
                }
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
            console.log("LOG_OUT",initalState)
            localStorage.clear();
            return  initalState;
            
        default : 
            return({...state})
    }
}

export default reducer;

export const readUser = state => (state.userReducer.user);
export const readToken = state => (state.userReducer.token);