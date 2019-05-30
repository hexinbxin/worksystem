import {
    api
} from '../utils/api'
const state = {
    loggedin: JSON.parse(localStorage.getItem("form")) == null ? null : JSON.parse(localStorage.getItem("form")).loggedin || false,
    form: JSON.parse(localStorage.getItem("form")) || {},
    error: '',
    info: {},
    correctioning: false,
    create: false
};
const getters = {

};
const mutations = {
    addError(state, value) {
        state.error = value;
    },
    changeLoggedin(state, flag) {
        state.loggedin = flag
    },
    changeForm(state, form) {
        state.form = form
    },
    changeToken(state, token) {
        state.form.token = token;
    },
    changeinfo (state, obj){
        state.info = obj
    },
    changecorrectioning (state, val) {
        state.correctioning = val;
    },
    changeCreate(state, val) {
        state.create = val;
    }
};
const actions = {
    login({commit, state}, obj) {
        api.post("/auth/login", obj).then(result => {
            console.log(result);
           commit('changeForm', result);
           commit('changeLoggedin', true);
           state.form.loggedin = true;
            localStorage.setItem("form", JSON.stringify(state.form));
        });
    },
    chenkeToken({commit,state}) {
        api.defaults.headers.common['Token'] = state.form.token;
        api.post('/auth/refreshToken').then((token) => {
            commit('changeToken', token);
            localStorage.setItem("form", JSON.stringify(state.form));
        }).catch(() => {
            localStorage.removeItem("form");
            commit('changeForm', {});
            commit('changeLoggedin', false)
        })
    }
}
export default {
    state,
    getters,
    mutations,
    actions
}