var vows = require('vows');
var assert = require('assert');
var events = require('events');
var zmq = require('zmq');

vows.describe('Test event Server').addBatch({
  'Test Event Server pub msg and sub msg' : {
    topic : function() {
      var promise = new (events.EventEmitter);
      var error_timeout_id = setTimeout(function() {
        promise.emit('error', 'can not recieve msg');
      }, 2000);
      var options = {};
      options.pub = options.pub || 'tcp://127.0.0.1:3002';
      options.sub = options.sub || 'tcp://127.0.0.1:3001';
      var pub = zmq.socket('pub');
      pub.connect(options.pub);
      var sub = zmq.socket('sub');
      sub.connect(options.sub);
      sub.on('message', function(msg) {
        promise.emit('success', msg);
        clearTimeout(error_timeout_id);
      });
      sub.subscribe('');
      pub.send('this is a test msg');

      return promise;
    },
    'sub receive msg' : function(err, msg) {
      assert.equal(err, null);
      assert.equal(msg, 'this is a test msg');
    }
  }
}).run();