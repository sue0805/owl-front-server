import Vue from 'vue'
import Vuex from 'vuex'
import jwtDecode from 'jwt-decode'
import axios from 'axios'

import animals from '../data/animals.json'

Vue.use(Vuex)

const resourceHost = 'http://localhost:8095'

const store = new Vuex.Store({
  state: {
    accessToken: null,
    email: null,
    nickname: null,
    sortedQuestions: null,
    unsolvedQuestions: null,
    memberScraps: null,
    unsolvedQuestionReplies: null,
    sortedQuestionReplies: null,
    mem_idx: null,
    etcKeywords: null,
    koreanKeywords: null,
    searchHistory: null,
    searchKeyword: null,
    page: 0,
    korMainKeyword: null,
    etcMainKeyword: null,
    mainKeyword: null,
    apis: null,
  },
  getters: {
    getMember(state){
      return state;
    },
    apis(state){
      return state.apis
    }

  },
  mutations: {
    LOGIN (state, {accessToken, member}) {
      if(accessToken) state.accessToken = accessToken
      if(accessToken) localStorage.accessToken = accessToken
    },
    LOGOUT (state) {
      state.accessToken = null
      delete localStorage.accessToken      
      state.email = null
      delete localStorage.email      
      state.nickname = '익명의 ' + animals[Math.floor(Math.random() * animals.length)];
      state.mem_idx = null
      state.memberScraps = null
      state.sortedQuestions = null
      state.unsolvedQuestions = null
      delete localStorage.mem_idx
      delete localStorage.nickname
    },
    INIT (state) {
      state.accessToken = localStorage.accessToken
    },
    APILOGIN(state, token) {
      state.accessToken = token
      localStorage.accessToken = token
      const decoded = jwtDecode(token)
      state.email = `${decoded.id}@${decoded.aud}`
      localStorage.email = `${decoded.id}@${decoded.aud}`
      state.nickname = decoded.sub
      localStorage.nickname = decoded.sub
    },
    SETMEMBER(state, data){
      if(data._email) state.email = data._email
      if(data._email) localStorage.email = data._email
      if(data.email) state.email = data.email
      if(data.email) localStorage.email = data.email
      if(data._nickName) state.nickname = data._nickName
      if(data._nickName) localStorage.nickname = data._nickName
      if(data.nickname) state.nickname = data.nickname
      if(data.nickname) localStorage.nickname = data.nickname
      if(data.sortedQuestions) state.sortedQuestions = data.sortedQuestions
      if(data.unsolvedQuestions) state.unsolvedQuestions = data.unsolvedQuestions
      if(data.memberScraps) state.memberScraps = data.memberScraps
      if(data.idx) {
        state.mem_idx = data.idx
        localStorage.mem_idx = data.idx
      }
      if(data.unsolvedQuestionReplies) state.unsolvedQuestionReplies = data.unsolvedQuestionReplies
      if(data.sortedQuestionReplies) state.sortedQuestionReplies = data.sortedQuestionReplies
    },
    SETCUSTOMKEYWORD(state, {etcKeywords, koreanKeywords}){
      if(etcKeywords) state.etcKeywords = etcKeywords
      if(koreanKeywords) state.koreanKeywords = koreanKeywords
    },
    SETHISTORY(state, {searchHistory}){
      if(searchHistory) state.searchHistory = searchHistory
    },
    SET_SEARCH_KEYWORD(state, searchKeyword){
      if(searchKeyword) state.searchKeyword = searchKeyword
    },
    SET_PAGE(state, page){
      if(page) state.page = page
    },
    SET_MAIN_KEYWORD(state, {korMainKeyword, etcMainKeyword, mainKeyword}){
      if(korMainKeyword) state.korMainKeyword = korMainKeyword
      if(etcMainKeyword) state.etcMainKeyword = etcMainKeyword
      if(mainKeyword) state.mainKeyword = mainKeyword
    },
    SET_APIS(state, apis){
      if(apis) state.apis = apis
    }
  },
  actions: {
    LOGIN ({commit}, {email, password}) {
      let loginData = new FormData()
      loginData.append('email', email)
      loginData.append('password', password)
      return axios.post(`${resourceHost}/member/signin`, loginData)
        .then(({data}) => {
          alert(data.message)
          commit('LOGIN', data)
          commit('SETMEMBER', data.member)
         window.location.href="http://localhost:8085/"
        })
    },
    LOGOUT ({commit}) {
      commit('LOGOUT')
    },
    INIT ({commit}) {
      commit('INIT')
    },
    APILOGIN ({commit}, token){
      commit('APILOGIN', token)
    },
    SETMEMBER({commit}, data){
      commit('SETMEMBER', data)
    },
    SETCUSTOMKEYWORD({commit}, data){
      commit('SETCUSTOMKEYWORD', data)
    },
    SETHISTORY({commit}, data){
      commit('SETHISTORY', data)
    },
    SET_SEARCH_KEYWORD({commit}, data){
      commit('SET_SEARCH_KEYWORD', data)
    },
    SET_PAGE({commit}, data){
      commit('SET_PAGE', data)
    },    
    SET_MAIN_KEYWORD({commit}, data){
      commit('SET_MAIN_KEYWORD', data)
    },
    SET_APIS({commit}, data){
      commit('SET_APIS', data)
    }
  },
  created: {
  },
})

export default store