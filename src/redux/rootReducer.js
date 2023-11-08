const intialState = {
    loading: false,
    cartItem: [],
}

export const rootReducer = (state = intialState, action) => {
    switch (action.type) {
        case 'SHOW_LOADING':
            return {
                ...state,
                loading: true,
            }
        case 'HIDE_LOADING':
            return {
                ...state,
                loading: false,
            }
        case 'ADD_TO_CART':
            return {
                ...state,
                cartItem: [...state.cartItem, action.payload]
            }
        case 'UPDATE_CART':
            return {
                ...state,
                cartItem: state.cartItem.map(item => item._id === action.payload._id ? { ...item, quantity: action.payload.quantity } : item),
            }
        case 'DELETE_FROM_CART':
            return {
                ...state,
                cartItem: state.cartItem.filter(item => item._id !== action.payload._id),
            }
        default:
            return state;
    }
}
