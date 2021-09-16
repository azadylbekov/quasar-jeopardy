<template>
  <q-page class="">
		<div>
			<div class='modal-wrapper row text-center'>
				<div class='col-12'>
					<h2 class='no-margin'>Welcome to Jeopardy game</h2>
				</div>
				<q-card class="login-card q-pa-sm col-auto">
					<q-card-section>
						<h2>Enter your name</h2>
						<q-form 
							class="q-gutter-md modal-form row"
							@submit="loginSubmit"
							>
							<div class='col-8'>
								<q-input 
									outlined 
									v-model='userName' 
									label="Name" 
									size="lg"
									@input="checkValid"
									required
									/>
							</div>
							<div class='col-auto'>
								<q-btn 
									type='submit' 
									class='login-btn' 
									color="primary" 
									label="Enter" 
									size="lg"
									/>
							</div>
							<div v-if='userName' class='validInfo'>
								<span v-if='isNameValid' class='text-positive'>
									The name is valid
								</span>
								<span v-else class='text-negative'>
									The name is invalid. It can only contain characters of cyrillic, latin, numbers and underscore
								</span>
							</div>
						</q-form>
					</q-card-section>
				</q-card>
			</div>
		</div>
	</q-page>
</template>

<script>
// import { IS_lOGGED_IN } from 'src/store/module-example/getters'
import { mapActions, mapGetters } from "vuex";


export default {
  name: 'PageIndex',
	data() {
		return {
			userName: "",
			isNameValid: false
		}
	},
	methods: {
    ...mapActions(["SET_IS_LOGGED_IN", 
		"SET_LOGIN_NAME", 
		"SET_SUM_OF_POINTS", 
		"SET_CORRECT_ANSWER_COUNT", 
		"SET_INCORRECT_ANSWER_COUNT",
		"SET_NUMBER_OF_QUESTIONS_ANSWERED",
		"SET_SELECTED_BUTTON",
		"SET_GAME_STARTED"
		]),
		setIsLoggedIn(value) {
			// this.isLoggedIn.set(value);
			this.setLoggedIn(value);
			// console.log(this.isLoggedIn);
			this.$router.push(this.$route.query.redirect || '/game')
		},
		checkValid() {
			let myRegex = /\p{sc=Latin}|\p{sc=Cyrillic}|\p{Nd}|_/gu;
			let result = this.userName.match(myRegex)
			// console.log(result);
			if(result){
				this.isNameValid = result.length === this.userName.length;
				this.setLoggedIn();
			} else {
				this.isNameValid = false;
				this.userName = ""
			}
		},
		setLoggedIn(val) {
			this.SET_IS_LOGGED_IN(true)
			this.SET_LOGIN_NAME(this.userName);
			this.SET_SUM_OF_POINTS(0);
			this.SET_INCORRECT_ANSWER_COUNT(0);
			this.SET_CORRECT_ANSWER_COUNT(0);
			this.SET_NUMBER_OF_QUESTIONS_ANSWERED(0);
			this.SET_SELECTED_BUTTON([]);
			this.SET_GAME_STARTED(false);
			},
		loginSubmit(e) {
			e.preventDefault();
			if(this.isNameValid) {
				this.setIsLoggedIn(this.isNameValid);
			}
		}
	},
	computed: {
     ...mapGetters({isLoggedIn: "IS_LOGGED_IN"})
	},
	mounted() {
		this.SET_IS_LOGGED_IN(false);
		// this.
	},
	created() {
		let sum = 0;
		this.SET_SUM_OF_POINTS(sum);
	}
}
</script>


<style lang='scss'>
	.modal-wrapper {
		width: 100%;
		height: 100vh;
		background: #0684ab;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		.login-card {
			width: 500px;
			margin-top: 100px;
			text-align: left;
			h2 {
				margin: 0;
				margin-bottom: 40px;
			}
			.modal-form {
				.login-btn {
					width: 100%;
				}
			}
		}
	}
</style>