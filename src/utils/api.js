import axios from 'axios'
import {vm} from '../main'

const api = axios.create({
    baseURL: 'http://sandbox_api.estudy.chanke.xyz'
})
api.defaults.withCredentials = true;
api.defaults.headers.post['Content-Type'] = 'application/json'
api.interceptors.response.use((response) => {
    return response.data.data;
}, (error) => {
    // 请求出错改变 vuex的error
    vm.$store.commit('addError', error.response.data.errorMessage);
    return Promise.reject(error.response.data.errorMessage);
})
export {api}