var argv = require('optimist').argv;
var zmq = require('zmq')
  , sub = zmq.socket('sub')
  , pub = zmq.socket('pub');

var debug = argv.debug || false;

pub.bindSync(argv.pub || 'tcp://0.0.0.0:3001');
sub.bindSync(argv.sub || 'tcp://0.0.0.0:3002');

sub.on('message', function(msg){
  pub.send(msg);
  if( debug ) {
    console.log(msg.toString());
  }
});
sub.subscribe('');
