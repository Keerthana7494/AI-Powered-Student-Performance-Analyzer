import axios from 'axios'
const api=axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL,
    headers:{'Content-Type':'application/json'}})

api.interceptors.request.use(
    config=>{const token=localStorage.getItem('spa_token');
        if(token)config.headers.Authorization=`Bearer ${token}`;
        return config})

api.interceptors.response.use(
    r=>r,e=>{if(e.response?.status===401){
        localStorage.removeItem('spa_token');
        localStorage.removeItem('spa_user');
        if(!location.pathname.startsWith('/login'))
            location.href='/login'}return Promise.reject(e)})

export const getStudents=()=>api.get('/students')
export const createStudent=data=>api.post('/students',data)
export const getDashboard=()=>api.get('/performance/dashboard')
export const getPerformance=()=>api.get('/performance')
export const getPerformanceById=id=>api.get(`/performance/${id}`)
export const createPerformance=data=>api.post('/performance',data)
export const deletePerformance=id=>api.delete(`/performance/${id}`)
export default api

