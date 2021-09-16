<template>
	<q-header elevated>
		<q-toolbar>
		<router-link class='route-links' to="/">
      <!-- <div>Game</div> -->
			<div class='route-links'>Login</div>
    </router-link>	
		<router-link class='route-links' to="/game">
      <div>Game</div>
    </router-link>
		<router-link class='route-links' to="/stats">
      <div>Statistics</div>
    </router-link>
	</q-toolbar>
	</q-header>
</template>

<script>
// import { IS_lOGGED_IN } from 'src/store/module-example/getters'
import { mapActions, mapGetters } from "vuex";


export default {
  name: 'Header',
	data() {
		return {

		}
	},
	methods: {
    ...mapActions(["SET_IS_LOGGED_IN"]),
	},
	computed: {
     ...mapGetters({isLoggedIn: "IS_LOGGED_IN"})
	},
	mounted() {
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
	.route-links {
		margin: 0 10px;
		font-size: 24px;
		text-decoration: none;
		color: #fff;
		// &:visited {
		// 	color: rgb(216, 212, 248);
		// }
	}
</style>