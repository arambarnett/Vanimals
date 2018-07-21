const routes = require('next-routes')();

routes
	.add('/', '/', '/modules/home')
	.add('about', '/about', '/modules/about')
	.add('admin', '/admin', '/modules/admin')
	.add('collection', '/collection', '/modules/collection')
	.add('coming-soon', '/coming-soon', '/modules/coming-soon')
	.add('faq', '/faq', '/modules/faq')
	.add('marketplace', '/marketplace', '/modules/marketplace')
	.add('my-account', '/my-account', '/modules/my-account')
	.add('settings', '/settings', '/modules/settings')
	.add('store', '/store', '/modules/store')
	.add('vanimals', '/vanimals/:id', '/modules/vanimal');

module.exports = routes;
