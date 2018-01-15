'use strict';

const Hapi = require('hapi');
const Good = require('good');
const Route = require('./app/route/home.js');


const server = new Hapi.Server();
server.connection({ port: 3000, host: 'localhost' });


server.register(
  [
    {
      register: Good,
      options: {
        reporters: {
          console: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{
              response: '*',
              log: '*'
            }]
          }, {
            module: 'good-console'
          }, 'stdout']
        }
      }
    },
    {
      register: require ('inert'),
    },
    {
      register: Route,
    },
    {
      register: require('vision'),
    }
  ],
  (err) => {
    if (err) {
      throw err; // something bad happened loading the plugin
    }
    server.start((err) => {
      if (err) {
        throw err;
      }
      server.log('info', 'Server running at: ' + server.info.uri);
    });
  }
);

server.views({  
    engines: {
        html: require('handlebars')
    },
  path: './app/views',
  //helpersPath: './app/views/assets/js',
  //layoutPath: './app/views/assets/js',
});
