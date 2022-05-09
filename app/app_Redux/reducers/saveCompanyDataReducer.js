const initialState={
    companyData:''
}

const saveCompanyDataReducer =(state=initialState, action)=>{
switch(action.type){
    case "COMPANY_PROFILE": {
        return {
          ...state,
          companyData: action.data
        };
      }
      default:
        return state;
    }
}
export default saveCompanyDataReducer
