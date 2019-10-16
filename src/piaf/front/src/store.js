import Vue from 'vue'
import Vuex from 'vuex'
import { getNewParagraph, sendQA, getUserDetails } from './storeUtils.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // should the user see the screen "choose a theme"
    currentTheme: null,
    // show or not specific Vue components
    showTheme: true,
    showFooter: false,
    showNavbar: false,
    showAnnotationTask: false,
    // Current paragraph we display
    currentDocument: {
      title: 'Titre',
      text:'Ceci est un document par défaut. Il y a donc un problème de connexion, ou alors veuillez nous contacter à l`adresse : piaf@data.gouv.fr'
    },
    // annotations from the user on the current paragraph
    annotations: [
      {question:{}, answer:{} },
      {question:{}, answer:{} },
      {question:{}, answer:{} },
      {question:{}, answer:{} },
      {question:{}, answer:{} }
    ], // [{"question": {"text": "question 1"}, "answer": {"text": "a1", "index": 1}}]
    currentQuestionIndex:0,
    maxAnnotationsPerDoc: 5,
    // interaction with the text for highliting answers
    startOffset: null,
    endOffset: null,
    highlitedText: null,
    editMode:false,
    // what deals with the user
    userDetails: {}
  },
  getters: {
    // here we have the number of completed annotation (It means proper question and its proper answer)
    numOfFinishedQA: state => {
      return state.annotations.filter(annotation =>
        typeof annotation.question.text === 'string' && typeof annotation.answer.text === 'string').length
    },
    currentAnnotation: state => {
      return state.annotations[state.currentQuestionIndex]
    },
    currentProgress: (state, getters) => {
      let index = state.currentQuestionIndex
      let hasAnswer = getters.hasAnswer
      let hasQuestion = getters.hasQuestion
      return index + 1 / 3 + hasAnswer / 3 + hasQuestion / 3
    },
    hasQuestion: (state, getters) => {
      return (typeof getters.currentAnnotation.question.text === 'string') ? true : false
    },
    hasAnswer: (state, getters) => {
      return (typeof getters.currentAnnotation.answer.text === 'string') ? true : false
    },
    answersForTextInteraction: state => {
      return state.annotations
      .map(annotation => (annotation.answer && typeof annotation.answer.text === 'string') ? annotation.answer : {})
    },
  },
  mutations: {
    setShowTheme(state,boo) {
      state.showTheme = boo
    },
    setShowNavbar(state,boo) {
      state.showNavbar = boo
    },
    setShowAnnotationTask(state,boo) {
      state.showAnnotationTask = boo
    },
    setCurrentTheme(state,newTheme) {
      state.currentTheme = newTheme
    },
    setAnnotations(state,annotations){
      state.annotations = annotations
    },
    setStartOffset(state,num){
      state.startOffset = num
    },
    setEndOffset(state,num){
      state.endOffset = num
    },
    setHighlitedText(state,text){
      state.highlitedText = text
    },
    setEditeMode(state,boo){
      state.editMode = boo
    },
    setCurrentDocument(state, currentDocument){
      state.currentDocument = currentDocument
    },
    setCurrentQuestionIndex(state, num){
      state.currentQuestionIndex = num
    },
    setShowFooter(state, boo){
      state.showFooter = boo
    },
    setUserDetails(state, doc){
      state.userDetails = doc
    },
  },
  actions: {
    switchFromThemeToAnnotationTask(context){
      context.commit('setShowAnnotationTask', true)
      context.commit('setShowTheme', false)
      context.commit('setShowNavbar', true)
    },
    addNewHighlitedText({ commit, state }) {
      let newAnnotations = state.annotations
      newAnnotations[state.currentQuestionIndex].answer = {"text": state.highlitedText, "index": state.startOffset},
      commit('setAnnotations', newAnnotations)
      commit('setEndOffset', null)
      commit('setStartOffset', null)
      commit('setHighlitedText', null)
    },
    removeAnswer({ commit, state }) {
      let newAnnotations = state.annotations
      newAnnotations[state.currentQuestionIndex].answer = {}
      commit('setAnnotations', newAnnotations)
      commit('setShowFooter', false)
    },
    async loadNewText ({ commit, state }) {
      const p = await getNewParagraph(state.currentTheme)
      if(p){
        const doc = {
          title: p.title,
          id: p.id,
          theme: p.theme,
          text: p.text
        }
        commit('setCurrentDocument', doc)
        return true
      }else{
        console.log('problem loading the new paragraph');
        return false
      }
    },
    async saveQAs ({ state }) {
      let qas = {}
      qas.paragraph = 1 //currentDocument.title
      qas.data = state.annotations
      const res = await sendQA(qas)
      if(res){
        return true
      }else{
        console.log('problem saving your Q&As');
        return false
      }
    },
    goToNextIndex({commit, state, getters}){
      let i = state.currentQuestionIndex
      let f = getters.numOfFinishedQA
      console.log('i',i,'f',f);
      if( (i + 1) <= f){
        if (i + 1 < 5) {
          commit('setCurrentQuestionIndex', i + 1)
        }else{
          console.log('we cannot go further than 5 QR');
        }
      }else{
        console.log('we cannot increase the current question index');
      }
    },
    async getUserDetails ({ commit }) {
      const u = await getUserDetails()
      if(u){
        commit('setUserDetails', u)
        return true
      }else{
        return false
      }
    },
  }
})