export function saveSession(data){
    localStorage.setItem('spa_token',data.token);
    localStorage.setItem(
        'spa_user',
        JSON.stringify({userId:data.userId,fullName:data.fullName,email:data.email})
    )}

export function isLoggedIn(){
    return Boolean(localStorage.getItem('spa_token'))
}
export function logoutUser(){
    localStorage.removeItem('spa_token');
    localStorage.removeItem('spa_user')
}
