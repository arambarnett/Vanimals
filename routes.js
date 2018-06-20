const routes = require('next-routes')();

routes
	.add('/', '/', '/')
	.add('admin', '/admin', '/modules/admin')
	.add('vanimal', '/vanimal/:id', '/modules/vanimal');

module.exports = routes;
