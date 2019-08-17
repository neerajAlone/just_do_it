const initialState = {
  userAdmins: [],
  allCourses: []
}

export default function(state=initialState, actions) {
  switch(actions.type) {
    case 'RETRIEVE_ALL_USER_ADMINS':
      return {
        ...state,
        userAdmins: actions.payload
      }
    case 'REMOVE_ALL_USER_ADMINS':
      return {
        ...state,
        userAdmins: []
      }
    case 'RETRIEVE_ALL_COURSES':
      return {
        ...state,
        allCourses: actions.payload
      }
    default:
      return state
  }
}