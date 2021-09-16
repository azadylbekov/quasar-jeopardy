<template>
	<div class='container'>
		<h2>Stats</h2>
		<Header />
		<div class='row' v-if='isLoggedIn'>
			<div class="col-12">
				<h5 class='q-ma-sm'>LOGIN NAME: {{loginName}}</h5>
			</div>
			<div class="col-12">
				<h5 class='q-ma-sm'>COFRECT ANSWER COUNT: {{correctAnswerCount}}</h5>
			</div>
			<div class="col-12">
				<h5 class='q-ma-sm'>INCORRECT ANSWER COUNT: {{incorrectAnswerCount}}</h5>
			</div>
			<div class="col-12">
				<h5 class='q-ma-sm'>NUMBER OF QUESTIONS ANSWERED: {{numberOfQuestionsAnswered}}</h5>
			</div>
			<div class="col-12">
				<h5 class='q-ma-sm'>SUM OF POINTS: {{sumOfPoints}}</h5>
			</div>
		</div>
	</div>
</template>

<script>
// import { IS_lOGGED_IN } from 'src/store/module-example/getters'
import Header from '../components/Header.vue'
import { mapActions, mapGetters } from "vuex";


export default {
  name: 'Stats',
	components: {
		Header
	},
	data() {
		return {

		}
	},
	methods: {
    ...mapActions([
			"UPDATE_IS_LOGGED_IN", 
			"SET_GAME_STARTED",
			"SET_LOGIN_NAME",
			"IS_GAME_STARTED",
			"SET_CORRECT_ANSWER_COUNT",
			]),
	},
	computed: {
     ...mapGetters({
			isLoggedIn: "IS_LOGGED_IN", 
			loginName: "LOGIN_NAME",
			isGameStarted: "IS_GAME_STARTED",
			correctAnswerCount: "CORRECT_ANSWER_COUNT",
			incorrectAnswerCount: "INCORRECT_ANSWER_COUNT",
			numberOfQuestionsAnswered: "NUMBER_OF_QUESTIONS_ANSWERED",
			sumOfPoints: "SUM_OF_POINTS"
		 }),
	},
	mounted() {
		this.SET_GAME_STARTED(false);
	},
	created() {
	}
}
</script>


<style lang='scss'>
	.container {
		max-width: 1200px;
		margin: 0 auto;
	}
</style>