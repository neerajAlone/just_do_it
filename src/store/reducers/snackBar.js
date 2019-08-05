const initialState = {
  snack: false,
  bar: null
}

export default function(state=initialState, actions) {
  switch(actions.type) {
    case 'SNACK_IT':
      return {
        ...state,
        snack: true,
        bar: actions.payload
      }
    case 'DONT_SNACK':
      return {
        ...state,
        snack: false,
        bar: null
      }
    default:
      return state;
  }
}