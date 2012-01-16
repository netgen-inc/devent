var vows = require('vows');
var assert = require('assert');
var events = require('events');
var devent = require('../lib/devent').createDEvent('vows_tester');

vows.describe('Test lib devent').addBatch({
  'DEvent should respond to "emit()" and "on()"' : {
    topic : devent,
    'should respond to "createDEvent()"' : function(devent) {
      assert.isFunction(devent.on);
      assert.isFunction(devent.emit);
    }
  },
  'Test Devent emit "task-finished"' : {
    topic : function() {
      var promise = new (events.EventEmitter);
      var error_timeout_id = setTimeout(function() {
        promise.emit('error', 'can not recieve "task-finished"');
      }, 5000);
      devent.on('task-finished', function(task) {
        promise.emit('success', task);
        clearTimeout(error_timeout_id);
      });
      setTimeout(function() {
        var queue = 'test';
        var uri = 'mysql://127.0.0.1"3306/spider?url#1';
        var retry = 0;
        var task1 = {
          queue : queue,
          uri : uri,
          retry : retry
        };
        devent.emit('task-finished', task1);
      }, 1000);

      return promise;
    },
    'task finished' : function(err, task) {
      var queue = 'test';
      var uri = 'mysql://127.0.0.1"3306/spider?url#1';
      var retry = 0;
      var task1 = {
        queue : queue,
        uri : uri,
        retry : retry
      };
      assert.deepEqual(err, null);
      assert.deepEqual(task, task1);
    }
  },
  'Test Devent emit "task-error"' : {
    topic : function() {
      var promise = new (events.EventEmitter);
      var error_timeout_id = setTimeout(function() {
        promise.emit('error', 'can not recieve "task-error"');
      }, 7000);
      devent.on('task-error', function(task) {
        promise.emit('success', task);
        clearTimeout(error_timeout_id);
      });
      setTimeout(function() {
        var queue = 'test';
        var uri = 'mysql://127.0.0.1"3306/spider?url#1';
        var retry = 0;
        var task1 = {
          queue : queue,
          uri : uri,
          retry : retry
        };
        devent.emit('task-error', task1);
      }, 2000);

      return promise;
    },
    'task error' : function(err, task) {
      var queue = 'test';
      var uri = 'mysql://127.0.0.1"3306/spider?url#1';
      var retry = 0;
      var task1 = {
        queue : queue,
        uri : uri,
        retry : retry
      };
      assert.deepEqual(err, null);
      assert.deepEqual(task, task1);
    }
  }
}).run();