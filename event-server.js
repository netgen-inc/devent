var zmq = require('zmq')
  , sub = zmq.socket('sub')
  , pub = zmq.socket('pub');

pub.bindSync('tcp://0.0.0.0:3001');
sub.bindSync('tcp://0.0.0.0:3002');

sub.on('message', function(msg){
  console.log(msg.toString());
  pub.send(msg);
});
sub.subscribe('');
