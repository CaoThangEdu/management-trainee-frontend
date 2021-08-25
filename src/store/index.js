import Vue from 'vue';
import Vuex from 'vuex';

import layout from './common/layout';
import user from './common/user';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    layout,
    user
  },
});