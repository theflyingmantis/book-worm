
exports.register = function(server, options, next) {
  server.route({
    path: '/',
    method: 'GET',
    handler:   function (request, reply) {
      reply.view('home');
    }
  });

  server.route({
    path: '/ping',
    method: 'GET',
    handler: function (request, reply) {
      reply('pong');
    }
  });

  server.route({
    path: '/generatePoster',
    method: 'GET',
    handler: function (request, reply) {
      let books = JSON.parse(request.query.books);
      const makePoster = require('../controller/poster.js').makePoster;
      let poster = makePoster(books);
      reply({poster:poster});
    }
  });
  

  server.route({
    path: '/assets/{path*}',
    method: 'GET',
    handler:   {
      directory: {
        path: 'app/views/assets',
        redirectToSlash: true,
        index: true,
      }
    }
  });

  server.route({
    path: '/src/{path*}',
    method: 'GET',
    handler:   {
      directory: {
        path: 'app/views/src',
        redirectToSlash: true,
        index: true,
      }
    }
  });

  next();
};

exports.register.attributes = {
  name: 'homeRoute',
  version: require('../../package.json').version,
};

