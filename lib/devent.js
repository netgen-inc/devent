var zmq = require('zmq');
var util = require("util");
var events = require("events");

function DEvent(name, debug) {
  var self = this;

  this.debug = debug || false;
  this.name = name;
  this.handle = new events.EventEmitter();

  this.pub = zmq.socket('pub');
  this.pub.connect('tcp://127.0.0.1:3002');

  this.sub = zmq.socket('sub');
  this.sub.connect('tcp://127.0.0.1:3001');
  this.sub.on('message', function(msg){
    var obj = JSON.parse(msg.toString());
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

exports.createDEvent = function( name, debug ){
  return new DEvent( name, debug );
};
