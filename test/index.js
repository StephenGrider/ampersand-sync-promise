if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

var redtape = require('redtape');
var sync = require('../ampersand-sync-promise');
var Model = require('ampersand-model');

var Me = Model.extend({
  url: '/hi',
  ajaxConfig: {
    useXDR: true,
    xhrFields: {
      withCredentials: true
    }
  }
});

var model;

var test = redtape({
  beforeEach: function(cb){
    model = new Me()
    cb();
  },
  afterEach: function(cb) {

    cb();
  }
});

test('should allow models to overwrite ajax configs at the model level', function (t) {
  t.plan(3);

  model.on('request', function (model, xhr, options, ajaxSettings) {
    t.equal(ajaxSettings.type, 'GET');
    t.equal(ajaxSettings.xhrFields.withCredentials, true);
    t.equal(ajaxSettings.useXDR, true);
    t.end();
  });
  sync('read', model);
});

test('read', function (t) {

  model.on('request', function(model, xhr, options, ajaxSettings){
    t.equal(ajaxSettings.url, '/hi');
    t.equal(ajaxSettings.type, 'GET');
    t.ok(!ajaxSettings.json);
    t.ok(!ajaxSettings.data);
    t.end();
  });
  model.sync('read', model);
});

test('passing data', function (t) {
  // on reads it should be part of the URL

  model.on('request', function(model, xhr, options, ajaxSettings){
    t.equal(ajaxSettings.url, '/hi?a=a&one=1', 'data passed to reads should be made into a query string');
    t.end();
  });
  model.sync('read', model, {data: {a: 'a', one: 1}})
});
//
// test('create', function (t) {
//   var xhr = sync('create', getStub({
//     title: 'The Tempest',
//     author: 'Bill Shakespeare',
//     length: 123
//   }));
//   t.equal(xhr.ajaxSettings.url, '/library');
//   t.equal(xhr.ajaxSettings.type, 'POST');
//   t.equal(xhr.ajaxSettings.headers['Content-Type'], 'application/json');
//   var data = xhr.ajaxSettings.json;
//   t.equal(data.title, 'The Tempest');
//   t.equal(data.author, 'Bill Shakespeare');
//   t.equal(data.length, 123);
//   t.end();
// });
//
// test('update', function (t) {
//   var xhr = sync('update', getStub({
//     id: '1-the-tempest',
//     author: 'William Shakespeare'
//   }));
//   t.equal(xhr.ajaxSettings.url, '/library');
//   t.equal(xhr.ajaxSettings.type, 'PUT');
//   t.equal(xhr.ajaxSettings.headers['Content-Type'], 'application/json');
//   var data = xhr.ajaxSettings.json;
//   t.equal(data.id, '1-the-tempest');
//   t.equal(data.author, 'William Shakespeare');
//   t.end();
// });
//
// test('update with emulateHTTP and emulateJSON', function (t) {
//   var xhr = sync('update', getStub({
//     id: '2-the-tempest',
//     author: 'Tim Shakespeare',
//     length: 123
//   }),
//   {
//     emulateHTTP: true,
//     emulateJSON: true
//   }
// );
// t.equal(xhr.ajaxSettings.url, '/library');
// t.equal(xhr.ajaxSettings.type, 'POST');
// t.equal(xhr.ajaxSettings.body, 'model%5Bid%5D=2-the-tempest&model%5Bauthor%5D=Tim%20Shakespeare&model%5Blength%5D=123&_method=PUT');
// t.equal(xhr.ajaxSettings.headers['Content-Type'], 'application/x-www-form-urlencoded');
// t.end();
// });
//
// test('update with just emulateHTTP', function (t) {
//   var xhr = sync('update', getStub({
//     id: '2-the-tempest',
//     author: 'Tim Shakespeare',
//     length: 123
//   }),
//   {
//     emulateHTTP: true
//   }
// );
// t.equal(xhr.ajaxSettings.url, '/library');
// t.equal(xhr.ajaxSettings.type, 'POST');
// t.equal(xhr.ajaxSettings.headers['Content-Type'], 'application/json');
// var data = xhr.ajaxSettings.json;
// t.equal(data.id, '2-the-tempest');
// t.equal(data.author, 'Tim Shakespeare');
// t.equal(data.length, 123);
// t.end();
// });
//
//
// test("update with just emulateJSON", function (t) {
//   var xhr = sync('update', getStub({
//     id: '2-the-tempest',
//     author: 'Tim Shakespeare',
//     length: 123
//   }),
//   {
//     emulateJSON: true
//   }
// );
// t.equal(xhr.ajaxSettings.url, '/library');
// t.equal(xhr.ajaxSettings.type, 'PUT');
// t.equal(xhr.ajaxSettings.headers['Content-Type'], 'application/x-www-form-urlencoded');
// t.equal(xhr.ajaxSettings.body, 'model%5Bid%5D=2-the-tempest&model%5Bauthor%5D=Tim%20Shakespeare&model%5Blength%5D=123');
// t.end();
// });
//
// test('delete', function (t) {
//   var xhr = sync('delete', getStub({
//     author: 'Tim Shakespeare',
//     length: 123
//   }));
//   t.equal(xhr.ajaxSettings.url, '/library');
//   t.equal(xhr.ajaxSettings.type, 'DELETE');
//   t.notOk(xhr.ajaxSettings.data);
//   t.end();
// });
//
//
// test('destroy with emulateHTTP', function (t) {
//   var xhr = sync('delete', getStub({
//     author: 'Tim Shakespeare',
//     length: 123
//   }),
//   {
//     emulateHTTP: true,
//     emulateJSON: true
//   }
// );
// t.equal(xhr.ajaxSettings.url, '/library');
// t.equal(xhr.ajaxSettings.type, 'POST');
// t.equal(xhr.ajaxSettings.body, '_method=DELETE');
// t.end();
// });
//
// test('urlError', function (t) {
//   t.throws(function () {
//     var xhr = sync('read', {});
//   }, Error);
//   t.end();
// });
//
// test('Call provided error callback on error.', function (t) {
//   t.plan(1);
//   var xhr = sync('read', getStub(), {
//     error: function () {
//       t.pass();
//       t.end();
//     }
//   });
//   xhr.ajaxSettings.error();
// });
//
// test('Call user provided beforeSend function.', function (t) {
//   t.plan(1);
//   var xhr = sync('delete', getStub(), {
//     beforeSend: function (_xhr) {
//       t.pass();
//     },
//     emulateHTTP: true
//   });
//   t.end();
// });
