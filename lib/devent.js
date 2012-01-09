var zmq = require('zmq');
var events = require("events");

function DEvent( name, options ) {
  var self = this;

  options = options || {};
  options.pub = options.pub || 'tcp://127.0.0.1:3002';
  options.sub = options.sub || 'tcp://127.0.0.1:3001';

  this.debug = options.debug || false;
  this.name = name;
  this.handle = new events.EventEmitter();

  this.pub = zmq.socket('pub');
  this.pub.connect( options.pub );

  this.sub = zmq.socket('sub');
  this.sub.connect( options.sub );
  this.sub.on('message', function(msg){
    var obj = {};
    try {
      obj = JSON.parse(msg.toString());
    } catch (e) {
      console.log(e);
    }
    if(self.debug) {
      console.log(['debug', obj]);
    }
    if(obj.event !== undefined) {
      self.handle.emit(obj.event, obj.arg);
    }
  });
  this.sub.subscribe('');
}

DEvent.prototype.on = function(evt, cb){
  this.handle.on(evt, cb);
};

DEvent.prototype.emit = function(evt, arg){
  this.pub.send( JSON.stringify( { source: this.name, event: evt, arg: arg } ) );
};

exports.createDEvent = function( name, options ){
  return new DEvent( name, options );
};
