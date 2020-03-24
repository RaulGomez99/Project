export const logUser = object =>  ({
    type:'LOG_USER',
    user:object.user,
})

export const setToken = object =>  ({
    type:'SET_TOKEN',
    token:object.token
})

export const setItem = object =>  ({
    type:'SET_ITEM',
    token:object.token,
    user:object.user
})

export const logOut = _ =>  ({
    type:'LOG_OUT'
})