const routes = require('next-routes')();

routes
	.add('/', '/', '/modules/home')
	.add('admin', '/admin', '/modules/admin')
	.add('collection', '/collection', '/modules/collection')
	.add('marketplace', '/marketplace', '/modules/marketplace')
	.add('vanimal', '/vanimal/:id', '/modules/vanimal');

module.exports = routes;
