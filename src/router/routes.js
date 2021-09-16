
const routes = [
	{
		path: '/',
		component: () => import('layouts/MainLayout.vue'),
		children: [
			{ path: '', component: () => import('pages/Index.vue') }
		]
	},
	{
		path: '/game',
		component: () => import('layouts/MainLayout.vue'),
		children: [
			{ path: '/game', component: () => import('pages/Game.vue') }
		]
	},
	{
		path: '/stats',
		component: () => import('layouts/MainLayout.vue'),
		children: [
			{ path: '', component: () => import('pages/Stats.vue') }
		]
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		path: '*',
		component: () => import('pages/Error404.vue')
	}
]

export default routes
