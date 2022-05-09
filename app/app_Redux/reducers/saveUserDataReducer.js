const initialState={
    userProfileData:''
}

const saveUserDataReducer =(state=initialState, action)=>{
  console.warn('in user reduser', action.data)
switch(action.type){
    case "USER_PROFILE": {
        return {
          ...state,
          userProfileData: action.data
        };
      }
      default:
        return state;
    }
}
export default saveUserDataReducer
