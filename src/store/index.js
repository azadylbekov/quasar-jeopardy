
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

// import example from './module-example'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
	const Store = new Vuex.Store({
		state: {
			loginName: '',
			numberOfQuestionsAnswered: 0,
			correctAnswerCount: 0,
			incorrectAnswerCount: 0,
			sumOfPoints: 0,
			isLoggedIn: false,
			isGameStarted: false,
			allCategories: [],
			selectedCategories: [],
			clues: [],
			cluesLimited: [],
			selectedButtons: [],
		},
		mutations: {
			UPDATE_IS_LOGGED_IN: (state, isLoggedIn) => {
				state.isLoggedIn = isLoggedIn;
			},
			SET_LOGIN_NAME_TO_STATE: (state, loginName) => {
				state.loginName = loginName;
			},
			UPDATE_IS_GAME_STARTED: (state, isGameStarted) => {
				state.isGameStarted = isGameStarted
			},
			SET_ALL_CATEGORIES_TO_STATE: (state, allCategories) => {
				state.allCategories = allCategories;
			},
			SET_SELECTED_CATEGORIES_TO_STATE: (state, arrSelectedCategories) => {
				state.selectedCategories = arrSelectedCategories;
			},
			SET_CLUES_TO_STATE: (state, clues) => {
				state.clues = clues;
			},
			SET_LIMITED_CLUES_TO_STATE: (state, limitedClues) => {
				state.limitedClues = limitedClues;
			},
			SET_CORRECT_ANSWER_COUNT_TO_STATE: (state, correctAnswerCount) => {
				state.correctAnswerCount = correctAnswerCount;
			},
			SET_INCORRECT_ANSWER_COUNT_TO_STATE: (state, incorrectAnswerCount) => {
				state.incorrectAnswerCount = incorrectAnswerCount;
			},
			SET_NUMBER_OF_QUESTIONS_ANSWERED_TO_STATE: (state, numberOfQuestionsAnswered) => {
				state.numberOfQuestionsAnswered = numberOfQuestionsAnswered;
			},
			INCREMENT_CORRECT_ANSWER_COUNT_TO_STATE: (state) => {
				state.correctAnswerCount = ++state.correctAnswerCount;
			},
			INCREMENT_INCORRECT_ANSWER_COUNT_TO_STATE: (state) => {
				state.incorrectAnswerCount = ++state.incorrectAnswerCount;
			},
			INCREMENT_NUMBER_OF_QUESTIONS_ANSWERED_TO_STATE: (state) => {
				state.numberOfQuestionsAnswered = ++state.numberOfQuestionsAnswered;
			},
			SET_SUM_OF_POINTS_TO_STATE: (state, sumOfPoints) => {
				if (sumOfPoints !== 0) {
					state.sumOfPoints = state.sumOfPoints + sumOfPoints;
				} else {
					state.sumOfPoints = 0;
				}
				// if (state.sumOfPoints <= 0) {
				// 	state.sumOfPoints = 0;
				// }
				// console.log('sum of points set')
			},
			SET_SELECTED_BUTTON_TO_STATE: (state) => {
				state.selectedButtons = []
			},
			PUSH_SELECTED_BUTTON_TO_STATE: (state, selectedButton) => {
				state.selectedButtons.push(selectedButton)
			}
		},
		actions: {
			SET_IS_LOGGED_IN({ commit }, isLoggedIn) {
				commit('UPDATE_IS_LOGGED_IN', isLoggedIn);
			},
			SET_LOGIN_NAME({ commit }, loginName) {
				commit("SET_LOGIN_NAME_TO_STATE", loginName);
			},
			SET_GAME_STARTED({ commit }, isGameStarted) {
				commit('UPDATE_IS_GAME_STARTED', isGameStarted)
			},
			GET_ALL_CATEGORIES_FROM_API({ commit, dispatch }) {
				axios('https://jservice.io/api/categories?count=100', {
					method: "GET"
				})
					.then(allCategories => {
						commit('SET_ALL_CATEGORIES_TO_STATE', allCategories.data);
						dispatch('SET_SELECTED_CATEGORIES', allCategories.data)
					})
					.catch(error => {
						console.error(error)
					})
			},
			SET_SELECTED_CATEGORIES({ commit, dispatch }, allCategories, numOfCategories = 6) {
				let arrSelectedCategories = [];
				let arrRandomCategoryIndex = []
				let i = 0;
				while (i < numOfCategories) {
					let randomCategoryIndex = Math.floor(Math.random() * allCategories.length);
					if (!arrRandomCategoryIndex.includes(randomCategoryIndex)) {
						arrRandomCategoryIndex.push(randomCategoryIndex);
						i++;
					}
				}
				arrRandomCategoryIndex.map(randomIndex => {
					arrSelectedCategories.push(allCategories[randomIndex])
				})
				commit('SET_SELECTED_CATEGORIES_TO_STATE', arrSelectedCategories)
				let clues = [];
				arrSelectedCategories.map(itemCategory => {
					dispatch("GET_CLUE_FROM_API", itemCategory)
						.then(data => clues.push(data))
						.catch(error => console.error(error));
				})
				dispatch("SET_CLUES", clues);
			},
			GET_CLUE_FROM_API({ commit }, itemCategory) {
				// console.log('dispatched')
				return axios(`http://jservice.io/api/category?id=${itemCategory.id}`, {
					method: "GET"
				})
					.then(clueItem => {
						return clueItem.data;
					})
					.catch(error => {
						console.error(error)
					})
			},
			SET_CLUES({ commit, dispatch }, allClues) {
				commit("SET_CLUES_TO_STATE", allClues)
				dispatch("SET_CLUES_LIMITED", allClues);
			},
			SET_CLUES_LIMITED({ commit }, allClues) {
				// console.log("limited clues");
				// let cluesLimited = [];
			},
			SET_CORRECT_ANSWER_COUNT({ commit }, correctAnswerCount) {
				commit('SET_CORRECT_ANSWER_COUNT_TO_STATE', correctAnswerCount);
			},
			SET_INCORRECT_ANSWER_COUNT({ commit }, incorrectAnswerCount) {
				commit('SET_INCORRECT_ANSWER_COUNT_TO_STATE', incorrectAnswerCount);
			},
			SET_NUMBER_OF_QUESTIONS_ANSWERED({ commit }, numberOfQuestionsAnswered) {
				commit('SET_NUMBER_OF_QUESTIONS_ANSWERED_TO_STATE', numberOfQuestionsAnswered);
			},
			INCREMENT_CORRECT_ANSWER_COUNT({ commit }) {
				commit('INCREMENT_CORRECT_ANSWER_COUNT_TO_STATE');
			},
			INCREMENT_INCORRECT_ANSWER_COUNT({ commit }) {
				commit('INCREMENT_INCORRECT_ANSWER_COUNT_TO_STATE');
			},
			INCREMENT_NUMBER_OF_QUESTIONS_ANSWERED({ commit }) {
				commit('INCREMENT_NUMBER_OF_QUESTIONS_ANSWERED_TO_STATE');
			},
			SET_SUM_OF_POINTS({ commit }, sumOfPoints) {
				commit('SET_SUM_OF_POINTS_TO_STATE', sumOfPoints);
			},
			SET_SELECTED_BUTTON({ commit }) {
				commit("SET_SELECTED_BUTTON_TO_STATE");
			},
			PUSH_SELECTED_BUTTON({ commit }, selectedButton) {
				commit("PUSH_SELECTED_BUTTON_TO_STATE", selectedButton);
			}
		},
		getters: {
			IS_LOGGED_IN(state) {
				return state.isLoggedIn;
			},
			LOGIN_NAME(state) {
				return state.loginName;
			},
			IS_GAME_STARTED(state) {
				return state.isGameStarted;
			},
			ALL_CATEGORIES(state) {
				return state.allCategories;
			},
			CLUES(state) {
				return state.clues;
			},
			CLUES_LIMITED(state) {
				return state.cluesLimited;
			},
			CORRECT_ANSWER_COUNT(state) {
				return state.correctAnswerCount;
			},
			INCORRECT_ANSWER_COUNT(state) {
				return state.incorrectAnswerCount;
			},
			NUMBER_OF_QUESTIONS_ANSWERED(state) {
				return state.numberOfQuestionsAnswered;
			},
			SUM_OF_POINTS(state) {
				return state.sumOfPoints;
			},
			SELECTED_BUTTONS(state) {
				return state.selectedButtons;
			}
		}
		// enable strict mode (adds overhead!)
		// for dev mode only
		// strict: process.env.DEBUGGING

	})

	return Store
}
