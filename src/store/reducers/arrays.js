const initialState = {
  userAdmins: [],
  allCourses: [],
  respCourseMssgs: {
    _id: null,
    box: []
  },
  adminMssgBox: [],
  adminSubmitsBox: [],
  studentSubmitsBox: []
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
    case 'RESPECTIVE_COURSE_MSSG_BOX':
      return {
        ...state,
        respCourseMssgs: {
          ...state.respCourseMssgs,
          _id: actions.payload.id,
          box: actions.payload.array
        }
      }
    case 'ADMIN_MSSG_BOX':
      return {
        ...state,
        adminMssgBox: actions.payload
      }
    case 'ADMIN_SUBMITS_BOX':
      return {
        ...state,
        adminSubmitsBox: actions.payload
      }
    case 'STUDENT_SUBMITS_BOX':
      return {
        ...state,
        studentSubmitsBox: actions.payload
      }
    default:
      return state
  }
}