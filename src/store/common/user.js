import store from '../../store/index'
import AccountService from "../../services/account/accountServices"

const stateDefault = {
  /**
   * Thông tin profile của user đang login
   */
  userInfo: {
    userName: null,
    name: null,
    surname: null,
    emailAddress: null,
    isActive: false,
    fullName: null,
    roleNames: null,
    id: "",
  },
  /**
   * Thông tin về token đang login
   */
  tokenInfo: {
    accessToken: '',
    expiredTime: '',
  },
}


// initial state
const state = Object.assign({}, stateDefault)

// getters
const getters = {
  getUserInfo(state) {
    return state.userInfo
  },
  getTokenKey(state) {
    let tokenState = state.tokenInfo ? state.tokenInfo.accessToken : '';
    if (!tokenState) {
      tokenState = localStorage.getItem('AUTH_TOKEN') || '';
    }
    return tokenState;
  },
  getUserSetting(state) {
    return state.userSetting;
  }
}

// mutations
const mutations = {
  resetState(state) {
    // Remove Token and TokenInfo in localStorage
    localStorage.removeItem('AUTH_TOKEN');
    Object.assign(state, stateDefault);
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo;
  },
  setTokenInfo(state, tokenInfo) {
    if (tokenInfo && tokenInfo.accessToken) {
      // Set expired Date with expiresIn
      tokenInfo.expiredTime = new Date().setSeconds(new Date(tokenInfo.expired).getSeconds());
      state.tokenInfo = tokenInfo;
      // Save token info to localStorage
      localStorage.setItem('AUTH_TOKEN', JSON.stringify(state.tokenInfo));
    } else {
      state.tokenInfo = null;
    }
  }
}

// actions
const actions = {
  /**
   * Update UserProfile (UserInfo) with data
   * @param {Object} param0 commit to mutations
   * @param {Object} userData user profile of account login
   */
  setUserInfoData({
    commit
  }, userData) {
    // dispatch('resetStoreData')
    commit('setUserInfo', userData)
  },

  /**
    * Call AccountAPI to Update UserProfile (UserInfo)
    * @param {Object} param0 commit to mutations
    */
  async updateUserInfoDataAsync({
    commit
  }) {
    let token = localStorage.getItem('AUTH_TOKEN');
    let tokenKey = JSON.parse(token);
    let api = new AccountService();
    let userResult = await api.getUserAsync(tokenKey.userId);
    if (userResult.isOK) {
      commit('setUserInfo', userResult.data)
    }
    return userResult;
  },

  /**
   * Set Token to state and Save to localStorage. Reset all state
   * @param {Object} param0 dispatch and commit
   * @param {Object} tokenData Token info when logined
   */
  setTokenInfoData({
    dispatch,
    commit
  }, tokenData) {
    dispatch('resetStoreData')
    commit('setTokenInfo', tokenData)
  },
  /**
   * Set Token to state and Save to localStorage without reset all state
   * @param {Object} param0 dispatch and commit
   * @param {Object} tokenData Token info when logined
   */
  setTokenInfoWithoutResetStateData({
    commit
  }, tokenData) {
    commit('setTokenInfo', tokenData)
  },

  resetStoreData({
    commit
  }) {
    let modules = Object.keys(store.state);
    for (let i in modules) {
      commit(modules[i] + '/resetState', null, {
        root: true
      });
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}