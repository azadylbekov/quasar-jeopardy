<template>
	<div class='container'>
		<Header />
		<div v-if='isGameStarted && isLoggedIn'>
			<h6 class='q-ma-sm'>Game started</h6>
			<div class="layout-wrapper row">

				<q-card
					class="my-card text-white col-12 q-ma-md"
					v-if='showIsAnswerCorrectModal'
				>
					<q-card-section>
						<h2 class='text-positive' v-if='isAnswerCorrect'>Correct</h2>
						<h2 class='text-negative' v-else>Incorrect!<br />
							<span>Correct answer is: {{this.currentClueItem.answer}}</span>
						</h2>
					</q-card-section>
				</q-card>
				<q-spinner
					color="primary" size="3em" :thickness="10" v-if="clues.length < 1"
				/>
				<div class="game-layout-wrapper col-12" v-else>
					<div class="top-game-layout">
						<div class="game-score">
							{{currentGameScore}} Points
						</div>
						<q-btn 
							color="negative" 
							label="End the Game" 
							size='lg'
							class='q-mb-sm'
							@click='endGame'
						/>
					</div>
					
					<div  class="game-wrapper">
						<div class='clue-form-wrapper row' v-if='isShowClueForm'>
							<h5 
							class='col-12 q-ma-none flex text-justify' 
							:style="{height: '50px'}">{{ timer }}</h5>
							<div class="col-6 row">
								<div class='question-title col-12 flex flex-center'>
									<h5 class='q-ma-sm'>{{ currentClueItem.question }}</h5>
								</div>
								<q-card class="answer-card col-12 q-mt-md">
									<q-card-section>
										<q-form
											class="q-gutter-md answer-form"
											@submit="submitAnswer"
										>
											<q-input filled label="Answer" v-model="currentAnswer"
												lazy-rules
												:rules="[ val => val && val.length > 0 || 'Please type something']"
											/>
											<div>
												<q-btn label="Submit" type="submit" color="primary"/>
											</div>
										</q-form>
									</q-card-section>
								</q-card>

							</div>
							
						</div>
						<div v-else class="main-row row">
							<div class="col-5">
								<div class='category-row-title' v-for="clue in clues" :key="clue.id">
									<h5 class='category-title'>{{clue.title}}</h5>
								</div>
							</div>
							<div class="col-7 row points-row">
								<div class='col-12 row points-row-item' v-for="clue in clues" :key="clue.id">
									<button
										class='col-2 points-row-title' 
										v-for="clueItem in clue.clues.slice(0,5)" 
										:key='clueItem.id'
										@click='clueSelected(clueItem, $event)'
										:disabled="checkIfButtonActive(clueItem)"
										>
										<div v-if='clueItem.value'>{{clueItem.value}}</div>
										<div v-else>Random point</div>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-else class='row flex-center' :style="{minHeight: '300px'}">
			<div v-if='isLoggedIn'>
				<h3 class='q-ma-sm col-12'>Welcome {{loginName}}!</h3>
			</div>
			<div v-else>
				<h3 class='q-ma-sm col-12'>You are not logged in</h3>
				<router-link class='route-links text-primary text-center' to="/">
      		<div>Go back to login page</div>
    		</router-link>
			</div>
			<div class="button-wrapper col-12">
				<q-btn 
					color="primary" 
					label="Start game"
					@click='startGame'
					size="xl"
				/>
			</div>
		</div>

	</div>
</template>

<script>
// import { IS_lOGGED_IN } from 'src/store/module-example/getters'
import { mapActions, mapGetters } from "vuex";
import Header from '../components/Header'


export default {
  name: 'Game',
	components: {
		Header
	},
	data() {
		return {
			gameData: {},
			isShowClueForm: false,
			currentClueItem: {},
			timer: 10,
			timerInterval: null,
			currentAnswer: '',
			showIsAnswerCorrectModal: false,
			isAnswerCorrect: false,
			buttonDisabled: true,
			buttons: [],
			foundButtons: [],
			currentGameScore: 0,
		}
	},
	methods: {
    ...mapActions([
			"SET_IS_LOGGED_IN", 
			"SET_GAME_STARTED",
			 "GET_ALL_CATEGORIES_FROM_API", 
			 "GET_QUESTIONS_FROM_API",
			 "INCREMENT_CORRECT_ANSWER_COUNT",
			 "INCREMENT_INCORRECT_ANSWER_COUNT",
			 "INCREMENT_NUMBER_OF_QUESTIONS_ANSWERED",
			 "SET_SUM_OF_POINTS",
			 "SET_SELECTED_BUTTON",
			 "PUSH_SELECTED_BUTTON"
			 ]),
		startGame() {
			if(!this.isLoggedIn) {
				alert("You have to login to start the game");
			} else {
				this.SET_GAME_STARTED(true);
				this.fetchCategories();
				this.showIsAnswerCorrectModal = false;
				this.currentGameScore = 0;
				this.SET_SELECTED_BUTTON();
			}
		},
		fetchCategories() {
			this.GET_ALL_CATEGORIES_FROM_API();
		},
		endGame() {
			if(confirm("Are you sure you want to finish the game?")) {
				this.SET_GAME_STARTED(false);
				this.isShowClueForm = false;
				clearInterval(this.timerInterval);
			}
		},
		clueSelected(clueItem, e) {
			this.disableButton(clueItem.id);
			if(clueItem.value) {
				this.showClueForm(clueItem);
			} else {
				let randomValues = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
				let randomValue = randomValues[Math.floor(Math.random() * randomValues.length)]
				clueItem.value = randomValue;
				this.showClueForm(clueItem);
				console.log(clueItem);
			}
			console.log(clueItem.answer);
		},
		showClueForm(clueItem) {
			this.isShowClueForm = true;
			this.currentClueItem = clueItem;
			// console.log(this.currentClueItem);
			this.startTimer();
		},
		disableButton(clueItem) {
			this.PUSH_SELECTED_BUTTON(clueItem);
		},
		startTimer() {
			this.timerInterval = setInterval(() => {
				if(this.timer > 0) {
					this.timer--;
				} else {
					this.stopResetTime();
					if(!this.currentAnswer) {
						this.INCREMENT_INCORRECT_ANSWER_COUNT();
						this.isAnswerCorrect = false;
						this.currentGameScore -= this.currentClueItem.value;
						// if(this.currentGameScore < 0) {
						// 	this.showGameOver();
						// }
					}
				}
			}, 1000)
		},
		stopResetTime() {
				clearInterval(this.timerInterval);
				this.showIsAnswerCorrect()
				this.timer = 10;
				this.INCREMENT_NUMBER_OF_QUESTIONS_ANSWERED();
				if(this.isAnswerCorrect) {
					this.SET_SUM_OF_POINTS(this.currentClueItem.value);
				}
				if(this.selectedButtons.length === 30) {
					this.showGameOver();
				}
				// else {
				// 	this.SET_SUM_OF_POINTS(-this.currentClueItem.value);
				// }
		},
		submitAnswer() {
			if(this.currentAnswer.toLowerCase() === this.currentClueItem.answer.toLowerCase()) {
				this.isAnswerCorrect = true;
				this.currentGameScore += this.currentClueItem.value;
				this.INCREMENT_CORRECT_ANSWER_COUNT();
			} else {
				this.isAnswerCorrect = false;
				this.currentGameScore -= this.currentClueItem.value;
				this.INCREMENT_INCORRECT_ANSWER_COUNT();
				// if(this.currentGameScore < 0) {
				// 	this.showGameOver();
				// }
			}
			this.currentAnswer = ''
			this.stopResetTime();
		},
		showGameOver() {
			alert("GAME OVER!")
			setTimeout(() => {
				this.SET_GAME_STARTED(false);
				this.isShowClueForm = false;
				clearInterval(this.timerInterval);
			}, 1000)
		},
		showIsAnswerCorrect() {
			this.showIsAnswerCorrectModal = true;
			setTimeout(() => {
				this.showIsAnswerCorrectModal = false;
				this.isShowClueForm = false;
			}, 3000)
		},
		checkIfButtonActive(clueItem) {
			for(let i = 0; i < this.selectedButtons.length; i++) {
				if(this.selectedButtons[i] === clueItem.id) {
					return true
				}
			}
			return false;

		}
	},
	computed: {
     ...mapGetters({
		 isLoggedIn: "IS_LOGGED_IN", 
		 isGameStarted: "IS_GAME_STARTED", 
		 allCategories: "ALL_CATEGORIES",
		 clues: "CLUES",
		 cluesLimited: "CLUES_LIMITED",
		 loginName: "LOGIN_NAME",
		 sumOfPoints: "SUM_OF_POINTS",
		 selectedButtons: "SELECTED_BUTTONS"
		 }),
	},
	mounted() {
		// if(this.isLoggedIn) {
		// 	this.SET_SUM_OF_POINTS(0)
		// }
		console.log("What are you looking at? 😀")
	},
	created() {
	}
}
</script>


<style lang='scss'>
	.container {
		max-width: 1440px;
		margin: 0 auto;
	}
	.button-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 700px;
	}
	.main-row {
		.category-row-title {
			text-align: center;
			margin: 0;
			height: 100px;
			display: flex;
			align-items: center;
			justify-content: center;
			border: 0.5px solid #fff;
			.category-title {
				text-transform: uppercase;
				font-weight: bold;
				letter-spacing: 1.2;
				margin: 0;
			}
		}
		.points-row {
			flex-direction: column;
			.points-row-title {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100px;
				border: 0.5px solid #fff;
				width: 20%;
				cursor: pointer;
				transition: 0.3s;
				font-size: 24px;
				background: transparent; 
				color: #fff;
				&:hover{
					background: #262177;
				}
				&:disabled {
					color: #000;
					background: #0d0952;
				}
				.points-title {
					margin: 0;
				}
			}
		}
	}
	.game-layout-wrapper {
		width: 100%;
		margin: 50px 0;
		margin-top: 0;
		.top-game-layout {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.game-score {
				font-size: 32px;
			}
		}
	}
	.layout-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 400px;
	}
	.game-wrapper {
		font-family: "Roboto";
		background: rgb(31,35,209);
		background: radial-gradient(circle, rgba(31,35,209,1) 0%, rgba(6,10,136,1) 100%);
		color: #fff;
		border-radius: 5px;
		border: 0.5px solid #fff;
		box-sizing: border-box;
		width: 100%;
		min-height: 400px;
		// display: flex;
		// align-items: flex-start;
		.clue-form-wrapper {
			// min-height: 500px;
			display: flex;
			justify-content: center;
			padding: 20px;
		}
	}
</style>