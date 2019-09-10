const initialState = {
  eachWorkspaceCourseObject: null
};

export default function (state = initialState, actions) {
  switch(actions.type) {
    case 'ADD_EACH_WORKSPACE_COURSE_OBJECT':
      return {
        ...state,
        eachWorkspaceCourseObject: actions.payload
      }
    case 'REMOVE_EACH_WORKSPACE_COURSE_OBJECT':
      return {
        ...state,
        eachWorkspaceCourseObject: null
      }
    default:
      return state;
  }
}