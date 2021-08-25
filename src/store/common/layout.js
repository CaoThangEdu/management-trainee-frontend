import store from '../../store/index';

const stateDefault = {
    loading: {
        isShow: false,
    },

    sidebarShow: localStorage.getItem('sidebarShow'),
    sidebarMinimize: localStorage.getItem('sidebarMinimize'),
};

// initial state
const state = Object.assign({}, stateDefault);

// getters
const getters = {
    // Loading
    getIsShowLoading(state) {
        return state.loading.isShow;
    },
    getLoadingInfo(state) {
        return state.loading;
    },

    //Sidebar
    getSidebarShow() {
        if (state.sidebarShow == undefined || state.sidebarShow === 'responsive') {
            return true;
        }

        return state.sidebarShow === 'true' || state.sidebarShow === true;
    },
    getSidebarMinimize() {
        if (!state.sidebarMinimize || state.sidebarMinimize == 'false') {
            return false;
        }
        return true;
    },
};

// mutations
const mutations = {
    resetState(state) {
        // Remove sidebarShow and sidebarMinimize in localStorage
        localStorage.removeItem('sidebarShow');
        localStorage.removeItem('sidebarMinimize');
        Object.assign(state, stateDefault);
    },

    // Loading
    setLoadingInfo(state, loading) {
        state.loading = loading;
    },
    setIsShowLoading(state, isShowLoading) {
        state.loading.isShow = isShowLoading;
    },

    //Sidebar
    //first time, get by localStorage value is 'false' or 'true'
    toggleSidebarMobile(state) {
        let currentState = state.sidebarShow == undefined ? false : state.sidebarShow;
        const sidebarClosed = ['false', false, 'responsive'].includes(currentState);
        state.sidebarShow = sidebarClosed ? true : false;
        localStorage.setItem('sidebarShow', state.sidebarShow);
    },

    toggleSidebarDesktop(state) {
        let currentState = state.sidebarShow == undefined ? true : state.sidebarShow;
        const sidebarOpened = ['true', true, 'responsive'].includes(currentState);
        state.sidebarShow = sidebarOpened ? false : true;
        localStorage.setItem('sidebarShow', state.sidebarShow);
    },

    setSidebarShow(state, value) {
        state.sidebarShow = value != 'responsive';
        localStorage.setItem('sidebarShow', value);
    },

    setSidebarMinimize(state, value) {
        state.sidebarMinimize = value;
        localStorage.setItem('sidebarMinimize', value);
    },
};

// actions
const actions = {
    // Loading
    setIsShowLoadingData({ commit }, isShow) {
        commit('setIsShowLoading', isShow);
    },

    //Sidebar
    setToggleSidebarMobile({ commit }) {
        commit('toggleSidebarMobile');
    },
    setToggleSidebarDesktop({ commit }) {
        commit('toggleSidebarDesktop');
    },

    setSidebarShowData({ commit }, value) {
        commit('setSidebarShow', value);
    },

    setSidebarMinimizeData({ commit }, value) {
        commit('setSidebarMinimize', value);
    },

    resetStoreData({ commit }) {
        let modules = Object.keys(store.state);
        for (let i in modules) {
            commit(modules[i] + '/resetState', null, {
                root: true,
            });
        }
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};