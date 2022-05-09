export function saveCompanyDataAction(data){
    console.warn('action data company', data)
    return dispatch=>{
        dispatch({ type: 'COMPANY_PROFILE', data })
    }
}