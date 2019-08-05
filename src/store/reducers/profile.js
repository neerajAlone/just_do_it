const initialSate = {
  _id: null,
  username: null,
  email: null,
  image: null,
  mobile: null,
  joined_at: null,
  courses: null
}

export default function(state=initialSate, actions) {
  switch(actions.type) {
    case 'ADD_PROFILE':
      return {
        ...state,
        _id: actions.payload._id,
        username: actions.payload.username,
        email: actions.payload.email,
        image: actions.payload.image,
        joined_at: actions.payload.joined_at,
        mobile: actions.payload.mobile,
      }
    case 'ADD_PROFILE_COURSES':
      return {
        ...state,
        courses: actions.payload.courses
      }
    case 'REMOVE_PROFILE':
      return {
        ...state,
        _id: null,
        username: null,
        email: null,
        image: null,
        mobile: null,
        courses: null
      }
    default:
      return state
  }
}