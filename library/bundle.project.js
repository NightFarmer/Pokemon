require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"HelloWorld":[function(require,module,exports){
cc._RFpush(module, '280c3rsZJJKnZ9RqbALVwtK', 'HelloWorld');
// HelloWorld.js

'use strict';

cc.Class({
    'extends': cc.Component,

    properties: {
        label: {
            'default': null,
            type: cc.Label
        },
        text: 'Hello, World!'
    },

    // use this for initialization
    onLoad: function onLoad() {
        // this.label.string = this.text;
    },

    // called every frame
    update: function update(dt) {}
});

cc._RFpop();
},{}],"ground":[function(require,module,exports){
cc._RFpush(module, '4d612J0f6VIarqHA0vlwqYq', 'ground');
// script\ground.js

'use strict';

cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        canvas: {
            'default': null,
            type: cc.Canvas
        },
        player: {
            'default': null,
            type: cc.Label
        },
        playerMoveSteps: [],
        speed: 10,
        midu: 50
    },

    // use this for initialization
    onLoad: function onLoad() {
        var self = this;

        this.mapMaxX = -this.canvas.node.width / 2;
        this.mapMaxY = -this.canvas.node.height / 2;
        this.mapMinX = -this.node.width + this.canvas.node.width / 2;
        this.mapMinY = -this.node.height + this.canvas.node.height / 2;

        var playerOnScreenX = this.player.node.x + this.node.x;
        var playerOnScreenY = this.player.node.y + this.node.y;
        this.node.x = this.node.x - playerOnScreenX;
        this.node.y = this.node.y - playerOnScreenY;

        // var myUtil = self.getComponent('myUtil');  //这次我们不用require 我们用组件的方式
        //我们将myUtil.js扔到层级管理器的background的属性检查器中

        this.node.on('touchend', function (event) {
            self.player.string = event.touch.getLocationY();
            var myevent = new cc.Event.EventCustom('myClick', true); //这个是下一部分的内容
            myevent.setUserData(event.touch);

            self.node.dispatchEvent(myevent);
            self.player.string = "A";
            var mapAbsX = self.node.x + self.canvas.node.width / 2; //地图的世界坐标
            var mapAbsY = self.node.y + self.canvas.node.height / 2;
            self.player.string = "B";
            // console.info("xxx")
            var eventOnMapX = event.touch.getLocationX() - mapAbsX;
            var eventOnMapY = event.touch.getLocationY() - mapAbsY;
            // console.info(eventOnMapX, eventOnMapY) //点击的地图坐标
            self.player.string = "C";
            self.player.node.stopAllActions();
            self.node.stopAllActions();
            self.player.string = "D";
            self.toMove(eventOnMapX, eventOnMapY); //然后移动就行了
            self.player.string = "E";
        }, this);

        //cc.director.getScheduler().schedule(this.moveMap, this, 0.5, false);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    //this.moveMap();
    //},

    //moveMap:function(){
    //    this.node.stopAllActions();
    //
    //    var playerOnScreenX = this.player.node.x + this.node.x;
    //    var playerOnScreenY = this.player.node.y + this.node.y;
    //    var screenDestX = Math.min(this.mapMaxX, Math.max(this.mapMinX, this.node.x - playerOnScreenX));
    //    var screenDestY = Math.min(this.mapMaxY, Math.max(this.mapMinY, this.node.y - playerOnScreenY));
    //    //var screenMoveDistance = Math.sqrt(Math.pow(this.node.x - screenDestX, 2) + Math.pow(this.node.y - screenDestY, 2));
    //    //var screenMoveTime = screenMoveDistance / 100 / this.speed;
    //    this.node.runAction(
    //        cc.sequence(
    //            cc.moveTo(
    //                0.5,
    //                screenDestX,
    //                screenDestY
    //            )
    //        ));
    //},

    toMove: function toMove(x, y) {
        var self = this;
        var moveUtil = require("./moveUtil");
        var playerX = Math.round(self.player.node.x / self.midu);
        var playerY = Math.round(self.player.node.y / self.midu);
        self.player.string = "F";
        var descX = Math.round(x / self.midu);
        var descY = Math.round(y / self.midu);
        if (playerX == descX && playerY == descY) return;
        var path = moveUtil.find_path([playerX, playerY], [descX, descY]);
        self.player.string = "G";
        // console.info(path);
        var steps = path.map(function (node) {
            return { x: node[0] * self.midu, y: node[1] * self.midu };
        });
        self.player.string = "H";
        //this.playerMoveSteps = [{x:x,y:y}];
        self.playerMoveSteps = steps;
        self.moveByStep();
    },

    moveByStep: function moveByStep(steps) {
        var step = this.playerMoveSteps.shift();
        if (step === undefined) return;
        var distance = Math.sqrt(Math.pow(this.player.node.x - step.x, 2) + Math.pow(this.player.node.y - step.y, 2));
        var moveTime = distance / 100 / this.speed;
        this.player.node.runAction( //开始移动吧 
        cc.sequence(cc.moveTo(moveTime, step.x, step.y), cc.callFunc(this.moveByStep, this)));

        var screenDestX = Math.min(this.mapMaxX, Math.max(this.mapMinX, -step.x));
        // console.info(screenDestX, moveTime);
        var screenDestY = Math.min(this.mapMaxY, Math.max(this.mapMinY, -step.y));
        //var screenMoveDistance = Math.sqrt(Math.pow(this.node.x - screenDestX, 2) + Math.pow(this.node.y - screenDestY, 2));
        //var screenMoveTime = screenMoveDistance / 100 / this.speed;
        this.node.runAction(cc.sequence(cc.moveTo(moveTime, screenDestX, screenDestY)));
    }
});

cc._RFpop();
},{"./moveUtil":"moveUtil"}],"moveUtil":[function(require,module,exports){
cc._RFpush(module, '17208IhGTZPIptS6i7XFQUu', 'moveUtil');
// script\moveUtil.js

"use strict";

var moveUitl = {

    find_path: function find_path(start, end, map, marker) {
        var self = this;
        var open = [];
        var close = [];

        var startNode = start;
        var endNode = end;
        // console.info(startNode)
        // console.info(endNode)
        //var map_arr = map;
        //var tra_marker = marker;

        var G = 0;
        var H = 0;
        var F = 0;

        //加入起始节点  [x, y , G ,F ,father]
        open.push([startNode[0], startNode[1], 0, Math.abs(endNode[0] - startNode[0]) + Math.abs(endNode[1] - startNode[1]), null]);

        return (function (node) {
            //重拍，取最小的一个
            var count = 0;
            var nodeX = node[0];
            var nodeY = node[1];
            var nodeG = node[2];
            for (var i = nodeX - 1, ilen = i + 3; i < ilen; i++) {
                for (var j = nodeY - 1, jlen = j + 3; j < jlen; j++) {
                    //遍历周围八节点,排除自己
                    if (i == nodeX && j == nodeY) continue;
                    //排除斜着走的情况
                    //if(!((i == obj[0] ) || ( j == obj[1])) && ( map_arr[i] && map_arr[obj[0]] && map_arr[i][obj[1]] != tra_marker && map_arr[obj[0]][j] != tra_marker))
                    //if (!(i == nodeX || j == nodeY))
                    //    continue;
                    if (i == endNode[0] && j == endNode[1]) {
                        var endPoint = [i, j, G, F, node];
                        open.push(endPoint);
                        var ways = [];
                        var ele = endPoint;
                        do {
                            ways.unshift(ele);
                            ele = ele[4];
                        } while (ele[4] != null);

                        // for(var i=0; i<ways.length;i++){
                        //     for(var j=i+1; j+1<ways.length;j++){
                        //         if(ways[i][0]==ways[j][0] && ways[j][0]==ways[j+1][0] ||
                        //             ways[i][1]==ways[j][1] && ways[j][1]==ways[j+1][1] ||
                        //             Math.abs(ways[i][0]-ways[j][0])==Math.abs(ways[i][1]-ways[j][1]) && Math.abs(ways[j][0]-ways[j+1][0])==Math.abs(ways[j][1]-ways[j+1][1])
                        //         ){
                        //             ways.splice(i+1,1)
                        //             j--;
                        //         }
                        //     }
                        // }

                        return ways;
                    }
                    //map_arr[i] && map_arr[i][j] && map_arr[i][j] == tra_marker &&
                    if (self.is_exist(open, [i, j]) === -1 && self.is_exist(close, [i, j]) === -1) {
                        G = i == nodeX || j == nodeY ? nodeG + 1.0 : nodeG + 1.4;
                        var distX = endNode[0] - i;
                        var distY = endNode[1] - j;
                        //H = Math.sqrt(distX * distX + distY * distY);
                        H = Math.abs(distX) + Math.abs(distY);
                        F = G + H;

                        //var td = document.getElementById(i+"-"+j);
                        //td.innerHTML = "G:" + G.toFixed(2) + "\nH:" + H.toFixed(2) + "\nF:" + F.toFixed(2);
                        open.push([i, j, G, F, node]);
                        count++;
                    }
                }
            }
            close.push(open.shift());
            var o;
            if (open[0] && open[0][4] == node[4]) {
                //console.info(open)
                o = count == 0 ? get_brother(open, node) : (self.arr_sort(open), open[0]);
            } else {
                //console.info(open)
                o = (self.arr_sort(open), open[0]);
            }

            if (o) {
                return arguments.callee(o);
            } else {
                return [];
            }
        })(open[0]);
    },

    get_brother: function get_brother(arr, o) {
        var a = [];
        for (var i = 0; i < arr.length; i++) {
            if (o && arr[i][4] == o[4]) {
                return arr[i];
            }
        }
        if (o[4]) {
            return arguments.callee(o[4]);
        } else {
            return null;
        }
    },

    arr_sort: (function () {
        function s(a, b) {
            return a[3] - b[3];
        }

        return function (arr) {
            arr.sort(s);
        };
    })(),

    is_exist: function is_exist(arr, p) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][0] == p[0] && arr[i][1] == p[1]) {
                return i;
            }
        }
        return -1;
    }
};

module.exports = moveUitl;

cc._RFpop();
},{}],"socket.io":[function(require,module,exports){
cc._RFpush(module, '96c7a5UFKRG+Yr837toq1T4', 'socket.io');
// script\socket.io.js

/*! Socket.IO.js build:0.9.16, development. Copyright(c) 2011 LearnBoost <dev@learnboost.com> MIT Licensed */

'use strict';

var io = 'undefined' === typeof module ? {} : module.exports;
(function () {

  /**
   * socket.io
   * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
   * MIT Licensed
   */

  (function (exports, global) {

    /**
     * IO namespace.
     *
     * @namespace
     */

    var io = exports;

    /**
     * Socket.IO version
     *
     * @api public
     */

    io.version = '0.9.16';

    /**
     * Protocol implemented.
     *
     * @api public
     */

    io.protocol = 1;

    /**
     * Available transports, these will be populated with the available transports
     *
     * @api public
     */

    io.transports = [];

    /**
     * Keep track of jsonp callbacks.
     *
     * @api private
     */

    io.j = [];

    /**
     * Keep track of our io.Sockets
     *
     * @api private
     */
    io.sockets = {};

    /**
     * Manages connections to hosts.
     *
     * @param {String} uri
     * @Param {Boolean} force creation of new socket (defaults to false)
     * @api public
     */

    io.connect = function (host, details) {
      var uri = io.util.parseUri(host),
          uuri,
          socket;

      if (global && global.location) {
        uri.protocol = uri.protocol || global.location.protocol.slice(0, -1);
        uri.host = uri.host || (global.document ? global.document.domain : global.location.hostname);
        uri.port = uri.port || global.location.port;
      }

      uuri = io.util.uniqueUri(uri);

      var options = {
        host: uri.host,
        secure: 'https' == uri.protocol,
        port: uri.port || ('https' == uri.protocol ? 443 : 80),
        query: uri.query || ''
      };

      io.util.merge(options, details);

      if (options['force new connection'] || !io.sockets[uuri]) {
        socket = new io.Socket(options);
      }

      if (!options['force new connection'] && socket) {
        io.sockets[uuri] = socket;
      }

      socket = socket || io.sockets[uuri];

      // if path is different from '' or /
      return socket.of(uri.path.length > 1 ? uri.path : '');
    };
  })('object' === typeof module ? module.exports : this.io = {}, this);
  /**
   * socket.io
   * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
   * MIT Licensed
   */

  (function (exports, global) {

    /**
     * Utilities namespace.
     *
     * @namespace
     */

    var util = exports.util = {};

    /**
     * Parses an URI
     *
     * @author Steven Levithan <stevenlevithan.com> (MIT license)
     * @api public
     */

    var re = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

    var parts = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'];

    util.parseUri = function (str) {
      var m = re.exec(str || ''),
          uri = {},
          i = 14;

      while (i--) {
        uri[parts[i]] = m[i] || '';
      }

      return uri;
    };

    /**
     * Produces a unique url that identifies a Socket.IO connection.
     *
     * @param {Object} uri
     * @api public
     */

    util.uniqueUri = function (uri) {
      var protocol = uri.protocol,
          host = uri.host,
          port = uri.port;

      if ('document' in global) {
        host = host || document.domain;
        port = port || (protocol == 'https' && document.location.protocol !== 'https:' ? 443 : document.location.port);
      } else {
        host = host || 'localhost';

        if (!port && protocol == 'https') {
          port = 443;
        }
      }

      return (protocol || 'http') + '://' + host + ':' + (port || 80);
    };

    /**
     * Mergest 2 query strings in to once unique query string
     *
     * @param {String} base
     * @param {String} addition
     * @api public
     */

    util.query = function (base, addition) {
      var query = util.chunkQuery(base || ''),
          components = [];

      util.merge(query, util.chunkQuery(addition || ''));
      for (var part in query) {
        if (query.hasOwnProperty(part)) {
          components.push(part + '=' + query[part]);
        }
      }

      return components.length ? '?' + components.join('&') : '';
    };

    /**
     * Transforms a querystring in to an object
     *
     * @param {String} qs
     * @api public
     */

    util.chunkQuery = function (qs) {
      var query = {},
          params = qs.split('&'),
          i = 0,
          l = params.length,
          kv;

      for (; i < l; ++i) {
        kv = params[i].split('=');
        if (kv[0]) {
          query[kv[0]] = kv[1];
        }
      }

      return query;
    };

    /**
     * Executes the given function when the page is loaded.
     *
     *     io.util.load(function () { console.log('page loaded'); });
     *
     * @param {Function} fn
     * @api public
     */

    var pageLoaded = false;

    util.load = function (fn) {
      if ('document' in global && document.readyState === 'complete' || pageLoaded) {
        return fn();
      }

      util.on(global, 'load', fn, false);
    };

    /**
     * Adds an event.
     *
     * @api private
     */

    util.on = function (element, event, fn, capture) {
      if (element.attachEvent) {
        element.attachEvent('on' + event, fn);
      } else if (element.addEventListener) {
        element.addEventListener(event, fn, capture);
      }
    };

    /**
     * Generates the correct `XMLHttpRequest` for regular and cross domain requests.
     *
     * @param {Boolean} [xdomain] Create a request that can be used cross domain.
     * @returns {XMLHttpRequest|false} If we can create a XMLHttpRequest.
     * @api private
     */

    util.request = function (xdomain) {

      if (xdomain && 'undefined' != typeof XDomainRequest && !util.ua.hasCORS) {
        return new XDomainRequest();
      }

      if ('undefined' != typeof XMLHttpRequest && (!xdomain || util.ua.hasCORS)) {
        return new XMLHttpRequest();
      }

      if (!xdomain) {
        try {
          return new (window[['Active'].concat('Object').join('X')])('Microsoft.XMLHTTP');
        } catch (e) {}
      }

      return null;
    };

    /**
     * XHR based transport constructor.
     *
     * @constructor
     * @api public
     */

    /**
     * Change the internal pageLoaded value.
     */

    if ('undefined' != typeof window) {
      util.load(function () {
        pageLoaded = true;
      });
    }

    /**
     * Defers a function to ensure a spinner is not displayed by the browser
     *
     * @param {Function} fn
     * @api public
     */

    util.defer = function (fn) {
      if (!util.ua.webkit || 'undefined' != typeof importScripts) {
        return fn();
      }

      util.load(function () {
        setTimeout(fn, 100);
      });
    };

    /**
     * Merges two objects.
     *
     * @api public
     */

    util.merge = function merge(target, additional, deep, lastseen) {
      var seen = lastseen || [],
          depth = typeof deep == 'undefined' ? 2 : deep,
          prop;

      for (prop in additional) {
        if (additional.hasOwnProperty(prop) && util.indexOf(seen, prop) < 0) {
          if (typeof target[prop] !== 'object' || !depth) {
            target[prop] = additional[prop];
            seen.push(additional[prop]);
          } else {
            util.merge(target[prop], additional[prop], depth - 1, seen);
          }
        }
      }

      return target;
    };

    /**
     * Merges prototypes from objects
     *
     * @api public
     */

    util.mixin = function (ctor, ctor2) {
      util.merge(ctor.prototype, ctor2.prototype);
    };

    /**
     * Shortcut for prototypical and static inheritance.
     *
     * @api private
     */

    util.inherit = function (ctor, ctor2) {
      function f() {};
      f.prototype = ctor2.prototype;
      ctor.prototype = new f();
    };

    /**
     * Checks if the given object is an Array.
     *
     *     io.util.isArray([]); // true
     *     io.util.isArray({}); // false
     *
     * @param Object obj
     * @api public
     */

    util.isArray = Array.isArray || function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };

    /**
     * Intersects values of two arrays into a third
     *
     * @api public
     */

    util.intersect = function (arr, arr2) {
      var ret = [],
          longest = arr.length > arr2.length ? arr : arr2,
          shortest = arr.length > arr2.length ? arr2 : arr;

      for (var i = 0, l = shortest.length; i < l; i++) {
        if (~util.indexOf(longest, shortest[i])) ret.push(shortest[i]);
      }

      return ret;
    };

    /**
     * Array indexOf compatibility.
     *
     * @see bit.ly/a5Dxa2
     * @api public
     */

    util.indexOf = function (arr, o, i) {

      for (var j = arr.length, i = i < 0 ? i + j < 0 ? 0 : i + j : i || 0; i < j && arr[i] !== o; i++) {}

      return j <= i ? -1 : i;
    };

    /**
     * Converts enumerables to array.
     *
     * @api public
     */

    util.toArray = function (enu) {
      var arr = [];

      for (var i = 0, l = enu.length; i < l; i++) arr.push(enu[i]);

      return arr;
    };

    /**
     * UA / engines detection namespace.
     *
     * @namespace
     */

    util.ua = {};

    /**
     * Whether the UA supports CORS for XHR.
     *
     * @api public
     */

    util.ua.hasCORS = 'undefined' != typeof XMLHttpRequest && (function () {
      try {
        var a = new XMLHttpRequest();
      } catch (e) {
        return false;
      }

      return a.withCredentials != undefined;
    })();

    /**
     * Detect webkit.
     *
     * @api public
     */

    util.ua.webkit = 'undefined' != typeof navigator && /webkit/i.test(navigator.userAgent);

    /**
    * Detect iPad/iPhone/iPod.
    *
    * @api public
    */

    util.ua.iDevice = 'undefined' != typeof navigator && /iPad|iPhone|iPod/i.test(navigator.userAgent);
  })('undefined' != typeof io ? io : module.exports, this);
  /**
   * socket.io
   * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
   * MIT Licensed
   */

  (function (exports, io) {

    /**
     * Expose constructor.
     */

    exports.EventEmitter = EventEmitter;

    /**
     * Event emitter constructor.
     *
     * @api public.
     */

    function EventEmitter() {};

    /**
     * Adds a listener
     *
     * @api public
     */

    EventEmitter.prototype.on = function (name, fn) {
      if (!this.$events) {
        this.$events = {};
      }

      if (!this.$events[name]) {
        this.$events[name] = fn;
      } else if (io.util.isArray(this.$events[name])) {
        this.$events[name].push(fn);
      } else {
        this.$events[name] = [this.$events[name], fn];
      }

      return this;
    };

    EventEmitter.prototype.addListener = EventEmitter.prototype.on;

    /**
     * Adds a volatile listener.
     *
     * @api public
     */

    EventEmitter.prototype.once = function (name, fn) {
      var self = this;

      function on() {
        self.removeListener(name, on);
        fn.apply(this, arguments);
      };

      on.listener = fn;
      this.on(name, on);

      return this;
    };

    /**
     * Removes a listener.
     *
     * @api public
     */

    EventEmitter.prototype.removeListener = function (name, fn) {
      if (this.$events && this.$events[name]) {
        var list = this.$events[name];

        if (io.util.isArray(list)) {
          var pos = -1;

          for (var i = 0, l = list.length; i < l; i++) {
            if (list[i] === fn || list[i].listener && list[i].listener === fn) {
              pos = i;
              break;
            }
          }

          if (pos < 0) {
            return this;
          }

          list.splice(pos, 1);

          if (!list.length) {
            delete this.$events[name];
          }
        } else if (list === fn || list.listener && list.listener === fn) {
          delete this.$events[name];
        }
      }

      return this;
    };

    /**
     * Removes all listeners for an event.
     *
     * @api public
     */

    EventEmitter.prototype.removeAllListeners = function (name) {
      if (name === undefined) {
        this.$events = {};
        return this;
      }

      if (this.$events && this.$events[name]) {
        this.$events[name] = null;
      }

      return this;
    };

    /**
     * Gets all listeners for a certain event.
     *
     * @api publci
     */

    EventEmitter.prototype.listeners = function (name) {
      if (!this.$events) {
        this.$events = {};
      }

      if (!this.$events[name]) {
        this.$events[name] = [];
      }

      if (!io.util.isArray(this.$events[name])) {
        this.$events[name] = [this.$events[name]];
      }

      return this.$events[name];
    };

    /**
     * Emits an event.
     *
     * @api public
     */

    EventEmitter.prototype.emit = function (name) {
      if (!this.$events) {
        return false;
      }

      var handler = this.$events[name];

      if (!handler) {
        return false;
      }

      var args = Array.prototype.slice.call(arguments, 1);

      if ('function' == typeof handler) {
        handler.apply(this, args);
      } else if (io.util.isArray(handler)) {
        var listeners = handler.slice();

        for (var i = 0, l = listeners.length; i < l; i++) {
          listeners[i].apply(this, args);
        }
      } else {
        return false;
      }

      return true;
    };
  })('undefined' != typeof io ? io : module.exports, 'undefined' != typeof io ? io : module.parent.exports);

  /**
   * socket.io
   * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
   * MIT Licensed
   */

  /**
   * Based on JSON2 (http://www.JSON.org/js.html).
   */

  (function (exports, nativeJSON) {
    "use strict";

    // use native JSON if it's available
    if (nativeJSON && nativeJSON.parse) {
      return exports.JSON = {
        parse: nativeJSON.parse,
        stringify: nativeJSON.stringify
      };
    }

    var JSON = exports.JSON = {};

    function f(n) {
      // Format integers to have at least two digits.
      return n < 10 ? '0' + n : n;
    }

    function date(d, key) {
      return isFinite(d.valueOf()) ? d.getUTCFullYear() + '-' + f(d.getUTCMonth() + 1) + '-' + f(d.getUTCDate()) + 'T' + f(d.getUTCHours()) + ':' + f(d.getUTCMinutes()) + ':' + f(d.getUTCSeconds()) + 'Z' : null;
    };

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = { // table of character substitutions
      '\b': '\\b',
      '\t': '\\t',
      '\n': '\\n',
      '\f': '\\f',
      '\r': '\\r',
      '"': '\\"',
      '\\': '\\\\'
    },
        rep;

    function quote(string) {

      // If the string contains no control characters, no quote characters, and no
      // backslash characters, then we can safely slap some quotes around it.
      // Otherwise we must also replace the offending characters with safe escape
      // sequences.

      escapable.lastIndex = 0;
      return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
        var c = meta[a];
        return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
      }) + '"' : '"' + string + '"';
    }

    function str(key, holder) {

      // Produce a string from holder[key].

      var i,
          // The loop counter.
      k,
          // The member key.
      v,
          // The member value.
      length,
          mind = gap,
          partial,
          value = holder[key];

      // If the value has a toJSON method, call it to obtain a replacement value.

      if (value instanceof Date) {
        value = date(key);
      }

      // If we were called with a replacer function, then call the replacer to
      // obtain a replacement value.

      if (typeof rep === 'function') {
        value = rep.call(holder, key, value);
      }

      // What happens next depends on the value's type.

      switch (typeof value) {
        case 'string':
          return quote(value);

        case 'number':

          // JSON numbers must be finite. Encode non-finite numbers as null.

          return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

          // If the value is a boolean or null, convert it to a string. Note:
          // typeof null does not produce 'null'. The case is included here in
          // the remote chance that this gets fixed someday.

          return String(value);

        // If the type is 'object', we might be dealing with an object or an array or
        // null.

        case 'object':

          // Due to a specification blunder in ECMAScript, typeof null is 'object',
          // so watch out for that case.

          if (!value) {
            return 'null';
          }

          // Make an array to hold the partial results of stringifying this object value.

          gap += indent;
          partial = [];

          // Is the value an array?

          if (Object.prototype.toString.apply(value) === '[object Array]') {

            // The value is an array. Stringify every element. Use null as a placeholder
            // for non-JSON values.

            length = value.length;
            for (i = 0; i < length; i += 1) {
              partial[i] = str(i, value) || 'null';
            }

            // Join all of the elements together, separated with commas, and wrap them in
            // brackets.

            v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
            gap = mind;
            return v;
          }

          // If the replacer is an array, use it to select the members to be stringified.

          if (rep && typeof rep === 'object') {
            length = rep.length;
            for (i = 0; i < length; i += 1) {
              if (typeof rep[i] === 'string') {
                k = rep[i];
                v = str(k, value);
                if (v) {
                  partial.push(quote(k) + (gap ? ': ' : ':') + v);
                }
              }
            }
          } else {

            // Otherwise, iterate through all of the keys in the object.

            for (k in value) {
              if (Object.prototype.hasOwnProperty.call(value, k)) {
                v = str(k, value);
                if (v) {
                  partial.push(quote(k) + (gap ? ': ' : ':') + v);
                }
              }
            }
          }

          // Join all of the member texts together, separated with commas,
          // and wrap them in braces.

          v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
          gap = mind;
          return v;
      }
    }

    // If the JSON object does not yet have a stringify method, give it one.

    JSON.stringify = function (value, replacer, space) {

      // The stringify method takes a value and an optional replacer, and an optional
      // space parameter, and returns a JSON text. The replacer can be a function
      // that can replace values, or an array of strings that will select the keys.
      // A default replacer method can be provided. Use of the space parameter can
      // produce text that is more easily readable.

      var i;
      gap = '';
      indent = '';

      // If the space parameter is a number, make an indent string containing that
      // many spaces.

      if (typeof space === 'number') {
        for (i = 0; i < space; i += 1) {
          indent += ' ';
        }

        // If the space parameter is a string, it will be used as the indent string.
      } else if (typeof space === 'string') {
          indent = space;
        }

      // If there is a replacer, it must be a function or an array.
      // Otherwise, throw an error.

      rep = replacer;
      if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
        throw new Error('JSON.stringify');
      }

      // Make a fake root object containing our value under the key of ''.
      // Return the result of stringifying the value.

      return str('', { '': value });
    };

    // If the JSON object does not yet have a parse method, give it one.

    JSON.parse = function (text, reviver) {
      // The parse method takes a text and an optional reviver function, and returns
      // a JavaScript value if the text is a valid JSON text.

      var j;

      function walk(holder, key) {

        // The walk method is used to recursively walk the resulting structure so
        // that modifications can be made.

        var k,
            v,
            value = holder[key];
        if (value && typeof value === 'object') {
          for (k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = walk(value, k);
              if (v !== undefined) {
                value[k] = v;
              } else {
                delete value[k];
              }
            }
          }
        }
        return reviver.call(holder, key, value);
      }

      // Parsing happens in four stages. In the first stage, we replace certain
      // Unicode characters with escape sequences. JavaScript handles many characters
      // incorrectly, either silently deleting them, or treating them as line endings.

      text = String(text);
      cx.lastIndex = 0;
      if (cx.test(text)) {
        text = text.replace(cx, function (a) {
          return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        });
      }

      // In the second stage, we run the text against regular expressions that look
      // for non-JSON patterns. We are especially concerned with '()' and 'new'
      // because they can cause invocation, and '=' because it can cause mutation.
      // But just to be safe, we want to reject all unexpected forms.

      // We split the second stage into 4 regexp operations in order to work around
      // crippling inefficiencies in IE's and Safari's regexp engines. First we
      // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
      // replace all simple value tokens with ']' characters. Third, we delete all
      // open brackets that follow a colon or comma or that begin the text. Finally,
      // we look to see that the remaining characters are only whitespace or ']' or
      // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

      if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

        // In the third stage we use the eval function to compile the text into a
        // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
        // in JavaScript: it can begin a block or an object literal. We wrap the text
        // in parens to eliminate the ambiguity.

        j = eval('(' + text + ')');

        // In the optional fourth stage, we recursively walk the new structure, passing
        // each name/value pair to a reviver function for possible transformation.

        return typeof reviver === 'function' ? walk({ '': j }, '') : j;
      }

      // If the text is not JSON parseable, then a SyntaxError is thrown.

      throw new SyntaxError('JSON.parse');
    };
  })('undefined' != typeof io ? io : module.exports, typeof JSON !== 'undefined' ? JSON : undefined);

  /**
   * socket.io
   * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
   * MIT Licensed
   */

  (function (exports, io) {

    /**
     * Parser namespace.
     *
     * @namespace
     */

    var parser = exports.parser = {};

    /**
     * Packet types.
     */

    var packets = parser.packets = ['disconnect', 'connect', 'heartbeat', 'message', 'json', 'event', 'ack', 'error', 'noop'];

    /**
     * Errors reasons.
     */

    var reasons = parser.reasons = ['transport not supported', 'client not handshaken', 'unauthorized'];

    /**
     * Errors advice.
     */

    var advice = parser.advice = ['reconnect'];

    /**
     * Shortcuts.
     */

    var JSON = io.JSON,
        indexOf = io.util.indexOf;

    /**
     * Encodes a packet.
     *
     * @api private
     */

    parser.encodePacket = function (packet) {
      var type = indexOf(packets, packet.type),
          id = packet.id || '',
          endpoint = packet.endpoint || '',
          ack = packet.ack,
          data = null;

      switch (packet.type) {
        case 'error':
          var reason = packet.reason ? indexOf(reasons, packet.reason) : '',
              adv = packet.advice ? indexOf(advice, packet.advice) : '';

          if (reason !== '' || adv !== '') data = reason + (adv !== '' ? '+' + adv : '');

          break;

        case 'message':
          if (packet.data !== '') data = packet.data;
          break;

        case 'event':
          var ev = { name: packet.name };

          if (packet.args && packet.args.length) {
            ev.args = packet.args;
          }

          data = JSON.stringify(ev);
          break;

        case 'json':
          data = JSON.stringify(packet.data);
          break;

        case 'connect':
          if (packet.qs) data = packet.qs;
          break;

        case 'ack':
          data = packet.ackId + (packet.args && packet.args.length ? '+' + JSON.stringify(packet.args) : '');
          break;
      }

      // construct packet with required fragments
      var encoded = [type, id + (ack == 'data' ? '+' : ''), endpoint];

      // data fragment is optional
      if (data !== null && data !== undefined) encoded.push(data);

      return encoded.join(':');
    };

    /**
     * Encodes multiple messages (payload).
     *
     * @param {Array} messages
     * @api private
     */

    parser.encodePayload = function (packets) {
      var decoded = '';

      if (packets.length == 1) return packets[0];

      for (var i = 0, l = packets.length; i < l; i++) {
        var packet = packets[i];
        decoded += '�' + packet.length + '�' + packets[i];
      }

      return decoded;
    };

    /**
     * Decodes a packet
     *
     * @api private
     */

    var regexp = /([^:]+):([0-9]+)?(\+)?:([^:]+)?:?([\s\S]*)?/;

    parser.decodePacket = function (data) {
      var pieces = data.match(regexp);

      if (!pieces) return {};

      var id = pieces[2] || '',
          data = pieces[5] || '',
          packet = {
        type: packets[pieces[1]],
        endpoint: pieces[4] || ''
      };

      // whether we need to acknowledge the packet
      if (id) {
        packet.id = id;
        if (pieces[3]) packet.ack = 'data';else packet.ack = true;
      }

      // handle different packet types
      switch (packet.type) {
        case 'error':
          var pieces = data.split('+');
          packet.reason = reasons[pieces[0]] || '';
          packet.advice = advice[pieces[1]] || '';
          break;

        case 'message':
          packet.data = data || '';
          break;

        case 'event':
          try {
            var opts = JSON.parse(data);
            packet.name = opts.name;
            packet.args = opts.args;
          } catch (e) {}

          packet.args = packet.args || [];
          break;

        case 'json':
          try {
            packet.data = JSON.parse(data);
          } catch (e) {}
          break;

        case 'connect':
          packet.qs = data || '';
          break;

        case 'ack':
          var pieces = data.match(/^([0-9]+)(\+)?(.*)/);
          if (pieces) {
            packet.ackId = pieces[1];
            packet.args = [];

            if (pieces[3]) {
              try {
                packet.args = pieces[3] ? JSON.parse(pieces[3]) : [];
              } catch (e) {}
            }
          }
          break;

        case 'disconnect':
        case 'heartbeat':
          break;
      };

      return packet;
    };

    /**
     * Decodes data payload. Detects multiple messages
     *
     * @return {Array} messages
     * @api public
     */

    parser.decodePayload = function (data) {
      // IE doesn't like data[i] for unicode chars, charAt works fine
      if (data.charAt(0) == '�') {
        var ret = [];

        for (var i = 1, length = ''; i < data.length; i++) {
          if (data.charAt(i) == '�') {
            ret.push(parser.decodePacket(data.substr(i + 1).substr(0, length)));
            i += Number(length) + 1;
            length = '';
          } else {
            length += data.charAt(i);
          }
        }

        return ret;
      } else {
        return [parser.decodePacket(data)];
      }
    };
  })('undefined' != typeof io ? io : module.exports, 'undefined' != typeof io ? io : module.parent.exports);
  /**
   * socket.io
   * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
   * MIT Licensed
   */

  (function (exports, io) {

    /**
     * Expose constructor.
     */

    exports.Transport = Transport;

    /**
     * This is the transport template for all supported transport methods.
     *
     * @constructor
     * @api public
     */

    function Transport(socket, sessid) {
      this.socket = socket;
      this.sessid = sessid;
    };

    /**
     * Apply EventEmitter mixin.
     */

    io.util.mixin(Transport, io.EventEmitter);

    /**
     * Indicates whether heartbeats is enabled for this transport
     *
     * @api private
     */

    Transport.prototype.heartbeats = function () {
      return true;
    };

    /**
     * Handles the response from the server. When a new response is received
     * it will automatically update the timeout, decode the message and
     * forwards the response to the onMessage function for further processing.
     *
     * @param {String} data Response from the server.
     * @api private
     */

    Transport.prototype.onData = function (data) {
      this.clearCloseTimeout();

      // If the connection in currently open (or in a reopening state) reset the close
      // timeout since we have just received data. This check is necessary so
      // that we don't reset the timeout on an explicitly disconnected connection.
      if (this.socket.connected || this.socket.connecting || this.socket.reconnecting) {
        this.setCloseTimeout();
      }

      if (data !== '') {
        // todo: we should only do decodePayload for xhr transports
        var msgs = io.parser.decodePayload(data);

        if (msgs && msgs.length) {
          for (var i = 0, l = msgs.length; i < l; i++) {
            this.onPacket(msgs[i]);
          }
        }
      }

      return this;
    };

    /**
     * Handles packets.
     *
     * @api private
     */

    Transport.prototype.onPacket = function (packet) {
      this.socket.setHeartbeatTimeout();

      if (packet.type == 'heartbeat') {
        return this.onHeartbeat();
      }

      if (packet.type == 'connect' && packet.endpoint == '') {
        this.onConnect();
      }

      if (packet.type == 'error' && packet.advice == 'reconnect') {
        this.isOpen = false;
      }

      this.socket.onPacket(packet);

      return this;
    };

    /**
     * Sets close timeout
     *
     * @api private
     */

    Transport.prototype.setCloseTimeout = function () {
      if (!this.closeTimeout) {
        var self = this;

        this.closeTimeout = setTimeout(function () {
          self.onDisconnect();
        }, this.socket.closeTimeout);
      }
    };

    /**
     * Called when transport disconnects.
     *
     * @api private
     */

    Transport.prototype.onDisconnect = function () {
      if (this.isOpen) this.close();
      this.clearTimeouts();
      this.socket.onDisconnect();
      return this;
    };

    /**
     * Called when transport connects
     *
     * @api private
     */

    Transport.prototype.onConnect = function () {
      this.socket.onConnect();
      return this;
    };

    /**
     * Clears close timeout
     *
     * @api private
     */

    Transport.prototype.clearCloseTimeout = function () {
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout);
        this.closeTimeout = null;
      }
    };

    /**
     * Clear timeouts
     *
     * @api private
     */

    Transport.prototype.clearTimeouts = function () {
      this.clearCloseTimeout();

      if (this.reopenTimeout) {
        clearTimeout(this.reopenTimeout);
      }
    };

    /**
     * Sends a packet
     *
     * @param {Object} packet object.
     * @api private
     */

    Transport.prototype.packet = function (packet) {
      this.send(io.parser.encodePacket(packet));
    };

    /**
     * Send the received heartbeat message back to server. So the server
     * knows we are still connected.
     *
     * @param {String} heartbeat Heartbeat response from the server.
     * @api private
     */

    Transport.prototype.onHeartbeat = function (heartbeat) {
      this.packet({ type: 'heartbeat' });
    };

    /**
     * Called when the transport opens.
     *
     * @api private
     */

    Transport.prototype.onOpen = function () {
      this.isOpen = true;
      this.clearCloseTimeout();
      this.socket.onOpen();
    };

    /**
     * Notifies the base when the connection with the Socket.IO server
     * has been disconnected.
     *
     * @api private
     */

    Transport.prototype.onClose = function () {
      var self = this;

      /* FIXME: reopen delay causing a infinit loop
      this.reopenTimeout = setTimeout(function () {
        self.open();
      }, this.socket.options['reopen delay']);*/

      this.isOpen = false;
      this.socket.onClose();
      this.onDisconnect();
    };

    /**
     * Generates a connection url based on the Socket.IO URL Protocol.
     * See <https://github.com/learnboost/socket.io-node/> for more details.
     *
     * @returns {String} Connection url
     * @api private
     */

    Transport.prototype.prepareUrl = function () {
      var options = this.socket.options;

      return this.scheme() + '://' + options.host + ':' + options.port + '/' + options.resource + '/' + io.protocol + '/' + this.name + '/' + this.sessid;
    };

    /**
     * Checks if the transport is ready to start a connection.
     *
     * @param {Socket} socket The socket instance that needs a transport
     * @param {Function} fn The callback
     * @api private
     */

    Transport.prototype.ready = function (socket, fn) {
      fn.call(this);
    };
  })('undefined' != typeof io ? io : module.exports, 'undefined' != typeof io ? io : module.parent.exports);
  /**
   * socket.io
   * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
   * MIT Licensed
   */

  (function (exports, io, global) {

    /**
     * Expose constructor.
     */

    exports.Socket = Socket;

    /**
     * Create a new `Socket.IO client` which can establish a persistent
     * connection with a Socket.IO enabled server.
     *
     * @api public
     */

    function Socket(options) {
      this.options = {
        port: 80,
        secure: false,
        document: 'document' in global ? document : false,
        resource: 'socket.io',
        transports: io.transports,
        'connect timeout': 10000,
        'try multiple transports': true,
        'reconnect': true,
        'reconnection delay': 500,
        'reconnection limit': Infinity,
        'reopen delay': 3000,
        'max reconnection attempts': 10,
        'sync disconnect on unload': false,
        'auto connect': true,
        'flash policy port': 10843,
        'manualFlush': false
      };

      io.util.merge(this.options, options);

      this.connected = false;
      this.open = false;
      this.connecting = false;
      this.reconnecting = false;
      this.namespaces = {};
      this.buffer = [];
      this.doBuffer = false;

      if (this.options['sync disconnect on unload'] && (!this.isXDomain() || io.util.ua.hasCORS)) {
        var self = this;
        io.util.on(global, 'beforeunload', function () {
          self.disconnectSync();
        }, false);
      }

      if (this.options['auto connect']) {
        this.connect();
      }
    };

    /**
     * Apply EventEmitter mixin.
     */

    io.util.mixin(Socket, io.EventEmitter);

    /**
     * Returns a namespace listener/emitter for this socket
     *
     * @api public
     */

    Socket.prototype.of = function (name) {
      if (!this.namespaces[name]) {
        this.namespaces[name] = new io.SocketNamespace(this, name);

        if (name !== '') {
          this.namespaces[name].packet({ type: 'connect' });
        }
      }

      return this.namespaces[name];
    };

    /**
     * Emits the given event to the Socket and all namespaces
     *
     * @api private
     */

    Socket.prototype.publish = function () {
      this.emit.apply(this, arguments);

      var nsp;

      for (var i in this.namespaces) {
        if (this.namespaces.hasOwnProperty(i)) {
          nsp = this.of(i);
          nsp.$emit.apply(nsp, arguments);
        }
      }
    };

    /**
     * Performs the handshake
     *
     * @api private
     */

    function empty() {};

    Socket.prototype.handshake = function (fn) {
      var self = this,
          options = this.options;

      function complete(data) {
        if (data instanceof Error) {
          self.connecting = false;
          self.onError(data.message);
        } else {
          fn.apply(null, data.split(':'));
        }
      };

      var url = ['http' + (options.secure ? 's' : '') + ':/', options.host + ':' + options.port, options.resource, io.protocol, io.util.query(this.options.query, 't=' + +new Date())].join('/');

      if (this.isXDomain() && !io.util.ua.hasCORS) {
        var insertAt = document.getElementsByTagName('script')[0],
            script = document.createElement('script');

        script.src = url + '&jsonp=' + io.j.length;
        insertAt.parentNode.insertBefore(script, insertAt);

        io.j.push(function (data) {
          complete(data);
          script.parentNode.removeChild(script);
        });
      } else {
        var xhr = io.util.request();

        xhr.open('GET', url, true);
        if (this.isXDomain()) {
          xhr.withCredentials = true;
        }
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
            xhr.onreadystatechange = empty;

            if (xhr.status == 200) {
              complete(xhr.responseText);
            } else if (xhr.status == 403) {
              self.onError(xhr.responseText);
            } else {
              self.connecting = false;
              !self.reconnecting && self.onError(xhr.responseText);
            }
          }
        };
        xhr.send(null);
      }
    };

    /**
     * Find an available transport based on the options supplied in the constructor.
     *
     * @api private
     */

    Socket.prototype.getTransport = function (override) {
      var transports = override || this.transports,
          match;

      for (var i = 0, transport; transport = transports[i]; i++) {
        if (io.Transport[transport] && io.Transport[transport].check(this) && (!this.isXDomain() || io.Transport[transport].xdomainCheck(this))) {
          return new io.Transport[transport](this, this.sessionid);
        }
      }

      return null;
    };

    /**
     * Connects to the server.
     *
     * @param {Function} [fn] Callback.
     * @returns {io.Socket}
     * @api public
     */

    Socket.prototype.connect = function (fn) {
      if (this.connecting) {
        return this;
      }

      var self = this;
      self.connecting = true;

      this.handshake(function (sid, heartbeat, close, transports) {
        self.sessionid = sid;
        self.closeTimeout = close * 1000;
        self.heartbeatTimeout = heartbeat * 1000;
        if (!self.transports) self.transports = self.origTransports = transports ? io.util.intersect(transports.split(','), self.options.transports) : self.options.transports;

        self.setHeartbeatTimeout();

        function connect(transports) {
          if (self.transport) self.transport.clearTimeouts();

          self.transport = self.getTransport(transports);
          if (!self.transport) return self.publish('connect_failed');

          // once the transport is ready
          self.transport.ready(self, function () {
            self.connecting = true;
            self.publish('connecting', self.transport.name);
            self.transport.open();

            if (self.options['connect timeout']) {
              self.connectTimeoutTimer = setTimeout(function () {
                if (!self.connected) {
                  self.connecting = false;

                  if (self.options['try multiple transports']) {
                    var remaining = self.transports;

                    while (remaining.length > 0 && remaining.splice(0, 1)[0] != self.transport.name) {}

                    if (remaining.length) {
                      connect(remaining);
                    } else {
                      self.publish('connect_failed');
                    }
                  }
                }
              }, self.options['connect timeout']);
            }
          });
        }

        connect(self.transports);

        self.once('connect', function () {
          clearTimeout(self.connectTimeoutTimer);

          fn && typeof fn == 'function' && fn();
        });
      });

      return this;
    };

    /**
     * Clears and sets a new heartbeat timeout using the value given by the
     * server during the handshake.
     *
     * @api private
     */

    Socket.prototype.setHeartbeatTimeout = function () {
      clearTimeout(this.heartbeatTimeoutTimer);
      if (this.transport && !this.transport.heartbeats()) return;

      var self = this;
      this.heartbeatTimeoutTimer = setTimeout(function () {
        self.transport.onClose();
      }, this.heartbeatTimeout);
    };

    /**
     * Sends a message.
     *
     * @param {Object} data packet.
     * @returns {io.Socket}
     * @api public
     */

    Socket.prototype.packet = function (data) {
      if (this.connected && !this.doBuffer) {
        this.transport.packet(data);
      } else {
        this.buffer.push(data);
      }

      return this;
    };

    /**
     * Sets buffer state
     *
     * @api private
     */

    Socket.prototype.setBuffer = function (v) {
      this.doBuffer = v;

      if (!v && this.connected && this.buffer.length) {
        if (!this.options['manualFlush']) {
          this.flushBuffer();
        }
      }
    };

    /**
     * Flushes the buffer data over the wire.
     * To be invoked manually when 'manualFlush' is set to true.
     *
     * @api public
     */

    Socket.prototype.flushBuffer = function () {
      this.transport.payload(this.buffer);
      this.buffer = [];
    };

    /**
     * Disconnect the established connect.
     *
     * @returns {io.Socket}
     * @api public
     */

    Socket.prototype.disconnect = function () {
      if (this.connected || this.connecting) {
        if (this.open) {
          this.of('').packet({ type: 'disconnect' });
        }

        // handle disconnection immediately
        this.onDisconnect('booted');
      }

      return this;
    };

    /**
     * Disconnects the socket with a sync XHR.
     *
     * @api private
     */

    Socket.prototype.disconnectSync = function () {
      // ensure disconnection
      var xhr = io.util.request();
      var uri = ['http' + (this.options.secure ? 's' : '') + ':/', this.options.host + ':' + this.options.port, this.options.resource, io.protocol, '', this.sessionid].join('/') + '/?disconnect=1';

      xhr.open('GET', uri, false);
      xhr.send(null);

      // handle disconnection immediately
      this.onDisconnect('booted');
    };

    /**
     * Check if we need to use cross domain enabled transports. Cross domain would
     * be a different port or different domain name.
     *
     * @returns {Boolean}
     * @api private
     */

    Socket.prototype.isXDomain = function () {

      var port = global.location.port || ('https:' == global.location.protocol ? 443 : 80);

      return this.options.host !== global.location.hostname || this.options.port != port;
    };

    /**
     * Called upon handshake.
     *
     * @api private
     */

    Socket.prototype.onConnect = function () {
      if (!this.connected) {
        this.connected = true;
        this.connecting = false;
        if (!this.doBuffer) {
          // make sure to flush the buffer
          this.setBuffer(false);
        }
        this.emit('connect');
      }
    };

    /**
     * Called when the transport opens
     *
     * @api private
     */

    Socket.prototype.onOpen = function () {
      this.open = true;
    };

    /**
     * Called when the transport closes.
     *
     * @api private
     */

    Socket.prototype.onClose = function () {
      this.open = false;
      clearTimeout(this.heartbeatTimeoutTimer);
    };

    /**
     * Called when the transport first opens a connection
     *
     * @param text
     */

    Socket.prototype.onPacket = function (packet) {
      this.of(packet.endpoint).onPacket(packet);
    };

    /**
     * Handles an error.
     *
     * @api private
     */

    Socket.prototype.onError = function (err) {
      if (err && err.advice) {
        if (err.advice === 'reconnect' && (this.connected || this.connecting)) {
          this.disconnect();
          if (this.options.reconnect) {
            this.reconnect();
          }
        }
      }

      this.publish('error', err && err.reason ? err.reason : err);
    };

    /**
     * Called when the transport disconnects.
     *
     * @api private
     */

    Socket.prototype.onDisconnect = function (reason) {
      var wasConnected = this.connected,
          wasConnecting = this.connecting;

      this.connected = false;
      this.connecting = false;
      this.open = false;

      if (wasConnected || wasConnecting) {
        this.transport.close();
        this.transport.clearTimeouts();
        if (wasConnected) {
          this.publish('disconnect', reason);

          if ('booted' != reason && this.options.reconnect && !this.reconnecting) {
            this.reconnect();
          }
        }
      }
    };

    /**
     * Called upon reconnection.
     *
     * @api private
     */

    Socket.prototype.reconnect = function () {
      this.reconnecting = true;
      this.reconnectionAttempts = 0;
      this.reconnectionDelay = this.options['reconnection delay'];

      var self = this,
          maxAttempts = this.options['max reconnection attempts'],
          tryMultiple = this.options['try multiple transports'],
          limit = this.options['reconnection limit'];

      function reset() {
        if (self.connected) {
          for (var i in self.namespaces) {
            if (self.namespaces.hasOwnProperty(i) && '' !== i) {
              self.namespaces[i].packet({ type: 'connect' });
            }
          }
          self.publish('reconnect', self.transport.name, self.reconnectionAttempts);
        }

        clearTimeout(self.reconnectionTimer);

        self.removeListener('connect_failed', maybeReconnect);
        self.removeListener('connect', maybeReconnect);

        self.reconnecting = false;

        delete self.reconnectionAttempts;
        delete self.reconnectionDelay;
        delete self.reconnectionTimer;
        delete self.redoTransports;

        self.options['try multiple transports'] = tryMultiple;
      };

      function maybeReconnect() {
        if (!self.reconnecting) {
          return;
        }

        if (self.connected) {
          return reset();
        };

        if (self.connecting && self.reconnecting) {
          return self.reconnectionTimer = setTimeout(maybeReconnect, 1000);
        }

        if (self.reconnectionAttempts++ >= maxAttempts) {
          if (!self.redoTransports) {
            self.on('connect_failed', maybeReconnect);
            self.options['try multiple transports'] = true;
            self.transports = self.origTransports;
            self.transport = self.getTransport();
            self.redoTransports = true;
            self.connect();
          } else {
            self.publish('reconnect_failed');
            reset();
          }
        } else {
          if (self.reconnectionDelay < limit) {
            self.reconnectionDelay *= 2; // exponential back off
          }

          self.connect();
          self.publish('reconnecting', self.reconnectionDelay, self.reconnectionAttempts);
          self.reconnectionTimer = setTimeout(maybeReconnect, self.reconnectionDelay);
        }
      };

      this.options['try multiple transports'] = false;
      this.reconnectionTimer = setTimeout(maybeReconnect, this.reconnectionDelay);

      this.on('connect', maybeReconnect);
    };
  })('undefined' != typeof io ? io : module.exports, 'undefined' != typeof io ? io : module.parent.exports, this);
  /**
   * socket.io
   * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
   * MIT Licensed
   */

  (function (exports, io) {

    /**
     * Expose constructor.
     */

    exports.SocketNamespace = SocketNamespace;

    /**
     * Socket namespace constructor.
     *
     * @constructor
     * @api public
     */

    function SocketNamespace(socket, name) {
      this.socket = socket;
      this.name = name || '';
      this.flags = {};
      this.json = new Flag(this, 'json');
      this.ackPackets = 0;
      this.acks = {};
    };

    /**
     * Apply EventEmitter mixin.
     */

    io.util.mixin(SocketNamespace, io.EventEmitter);

    /**
     * Copies emit since we override it
     *
     * @api private
     */

    SocketNamespace.prototype.$emit = io.EventEmitter.prototype.emit;

    /**
     * Creates a new namespace, by proxying the request to the socket. This
     * allows us to use the synax as we do on the server.
     *
     * @api public
     */

    SocketNamespace.prototype.of = function () {
      return this.socket.of.apply(this.socket, arguments);
    };

    /**
     * Sends a packet.
     *
     * @api private
     */

    SocketNamespace.prototype.packet = function (packet) {
      packet.endpoint = this.name;
      this.socket.packet(packet);
      this.flags = {};
      return this;
    };

    /**
     * Sends a message
     *
     * @api public
     */

    SocketNamespace.prototype.send = function (data, fn) {
      var packet = {
        type: this.flags.json ? 'json' : 'message',
        data: data
      };

      if ('function' == typeof fn) {
        packet.id = ++this.ackPackets;
        packet.ack = true;
        this.acks[packet.id] = fn;
      }

      return this.packet(packet);
    };

    /**
     * Emits an event
     *
     * @api public
     */

    SocketNamespace.prototype.emit = function (name) {
      var args = Array.prototype.slice.call(arguments, 1),
          lastArg = args[args.length - 1],
          packet = {
        type: 'event',
        name: name
      };

      if ('function' == typeof lastArg) {
        packet.id = ++this.ackPackets;
        packet.ack = 'data';
        this.acks[packet.id] = lastArg;
        args = args.slice(0, args.length - 1);
      }

      packet.args = args;

      return this.packet(packet);
    };

    /**
     * Disconnects the namespace
     *
     * @api private
     */

    SocketNamespace.prototype.disconnect = function () {
      if (this.name === '') {
        this.socket.disconnect();
      } else {
        this.packet({ type: 'disconnect' });
        this.$emit('disconnect');
      }

      return this;
    };

    /**
     * Handles a packet
     *
     * @api private
     */

    SocketNamespace.prototype.onPacket = function (packet) {
      var self = this;

      function ack() {
        self.packet({
          type: 'ack',
          args: io.util.toArray(arguments),
          ackId: packet.id
        });
      };

      switch (packet.type) {
        case 'connect':
          this.$emit('connect');
          break;

        case 'disconnect':
          if (this.name === '') {
            this.socket.onDisconnect(packet.reason || 'booted');
          } else {
            this.$emit('disconnect', packet.reason);
          }
          break;

        case 'message':
        case 'json':
          var params = ['message', packet.data];

          if (packet.ack == 'data') {
            params.push(ack);
          } else if (packet.ack) {
            this.packet({ type: 'ack', ackId: packet.id });
          }

          this.$emit.apply(this, params);
          break;

        case 'event':
          var params = [packet.name].concat(packet.args);

          if (packet.ack == 'data') params.push(ack);

          this.$emit.apply(this, params);
          break;

        case 'ack':
          if (this.acks[packet.ackId]) {
            this.acks[packet.ackId].apply(this, packet.args);
            delete this.acks[packet.ackId];
          }
          break;

        case 'error':
          if (packet.advice) {
            this.socket.onError(packet);
          } else {
            if (packet.reason == 'unauthorized') {
              this.$emit('connect_failed', packet.reason);
            } else {
              this.$emit('error', packet.reason);
            }
          }
          break;
      }
    };

    /**
     * Flag interface.
     *
     * @api private
     */

    function Flag(nsp, name) {
      this.namespace = nsp;
      this.name = name;
    };

    /**
     * Send a message
     *
     * @api public
     */

    Flag.prototype.send = function () {
      this.namespace.flags[this.name] = true;
      this.namespace.send.apply(this.namespace, arguments);
    };

    /**
     * Emit an event
     *
     * @api public
     */

    Flag.prototype.emit = function () {
      this.namespace.flags[this.name] = true;
      this.namespace.emit.apply(this.namespace, arguments);
    };
  })('undefined' != typeof io ? io : module.exports, 'undefined' != typeof io ? io : module.parent.exports);

  /**
   * socket.io
   * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
   * MIT Licensed
   */

  (function (exports, io, global) {

    /**
     * Expose constructor.
     */

    exports.websocket = WS;

    /**
     * The WebSocket transport uses the HTML5 WebSocket API to establish an
     * persistent connection with the Socket.IO server. This transport will also
     * be inherited by the FlashSocket fallback as it provides a API compatible
     * polyfill for the WebSockets.
     *
     * @constructor
     * @extends {io.Transport}
     * @api public
     */

    function WS(socket) {
      io.Transport.apply(this, arguments);
    };

    /**
     * Inherits from Transport.
     */

    io.util.inherit(WS, io.Transport);

    /**
     * Transport name
     *
     * @api public
     */

    WS.prototype.name = 'websocket';

    /**
     * Initializes a new `WebSocket` connection with the Socket.IO server. We attach
     * all the appropriate listeners to handle the responses from the server.
     *
     * @returns {Transport}
     * @api public
     */

    WS.prototype.open = function () {
      var query = io.util.query(this.socket.options.query),
          self = this,
          Socket;

      if (!Socket) {
        Socket = global.MozWebSocket || global.WebSocket;
      }

      this.websocket = new Socket(this.prepareUrl() + query);

      this.websocket.onopen = function () {
        self.onOpen();
        self.socket.setBuffer(false);
      };
      this.websocket.onmessage = function (ev) {
        self.onData(ev.data);
      };
      this.websocket.onclose = function () {
        self.onClose();
        self.socket.setBuffer(true);
      };
      this.websocket.onerror = function (e) {
        self.onError(e);
      };

      return this;
    };

    /**
     * Send a message to the Socket.IO server. The message will automatically be
     * encoded in the correct message format.
     *
     * @returns {Transport}
     * @api public
     */

    // Do to a bug in the current IDevices browser, we need to wrap the send in a
    // setTimeout, when they resume from sleeping the browser will crash if
    // we don't allow the browser time to detect the socket has been closed
    if (io.util.ua.iDevice) {
      WS.prototype.send = function (data) {
        var self = this;
        setTimeout(function () {
          self.websocket.send(data);
        }, 0);
        return this;
      };
    } else {
      WS.prototype.send = function (data) {
        this.websocket.send(data);
        return this;
      };
    }

    /**
     * Payload
     *
     * @api private
     */

    WS.prototype.payload = function (arr) {
      for (var i = 0, l = arr.length; i < l; i++) {
        this.packet(arr[i]);
      }
      return this;
    };

    /**
     * Disconnect the established `WebSocket` connection.
     *
     * @returns {Transport}
     * @api public
     */

    WS.prototype.close = function () {
      this.websocket.close();
      return this;
    };

    /**
     * Handle the errors that `WebSocket` might be giving when we
     * are attempting to connect or send messages.
     *
     * @param {Error} e The error.
     * @api private
     */

    WS.prototype.onError = function (e) {
      this.socket.onError(e);
    };

    /**
     * Returns the appropriate scheme for the URI generation.
     *
     * @api private
     */
    WS.prototype.scheme = function () {
      return this.socket.options.secure ? 'wss' : 'ws';
    };

    /**
     * Checks if the browser has support for native `WebSockets` and that
     * it's not the polyfill created for the FlashSocket transport.
     *
     * @return {Boolean}
     * @api public
     */

    WS.check = function () {
      return 'WebSocket' in global && !('__addTask' in WebSocket) || 'MozWebSocket' in global;
    };

    /**
     * Check if the `WebSocket` transport support cross domain communications.
     *
     * @returns {Boolean}
     * @api public
     */

    WS.xdomainCheck = function () {
      return true;
    };

    /**
     * Add the transport to your public io.transports array.
     *
     * @api private
     */

    io.transports.push('websocket');
  })('undefined' != typeof io ? io.Transport : module.exports, 'undefined' != typeof io ? io : module.parent.exports, this);

  /**
   * socket.io
   * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
   * MIT Licensed
   */

  (function (exports, io, global) {

    /**
     * Expose constructor.
     *
     * @api public
     */

    exports.XHR = XHR;

    /**
     * XHR constructor
     *
     * @costructor
     * @api public
     */

    function XHR(socket) {
      if (!socket) return;

      io.Transport.apply(this, arguments);
      this.sendBuffer = [];
    };

    /**
     * Inherits from Transport.
     */

    io.util.inherit(XHR, io.Transport);

    /**
     * Establish a connection
     *
     * @returns {Transport}
     * @api public
     */

    XHR.prototype.open = function () {
      this.socket.setBuffer(false);
      this.onOpen();
      this.get();

      // we need to make sure the request succeeds since we have no indication
      // whether the request opened or not until it succeeded.
      this.setCloseTimeout();

      return this;
    };

    /**
     * Check if we need to send data to the Socket.IO server, if we have data in our
     * buffer we encode it and forward it to the `post` method.
     *
     * @api private
     */

    XHR.prototype.payload = function (payload) {
      var msgs = [];

      for (var i = 0, l = payload.length; i < l; i++) {
        msgs.push(io.parser.encodePacket(payload[i]));
      }

      this.send(io.parser.encodePayload(msgs));
    };

    /**
     * Send data to the Socket.IO server.
     *
     * @param data The message
     * @returns {Transport}
     * @api public
     */

    XHR.prototype.send = function (data) {
      this.post(data);
      return this;
    };

    /**
     * Posts a encoded message to the Socket.IO server.
     *
     * @param {String} data A encoded message.
     * @api private
     */

    function empty() {};

    XHR.prototype.post = function (data) {
      var self = this;
      this.socket.setBuffer(true);

      function stateChange() {
        if (this.readyState == 4) {
          this.onreadystatechange = empty;
          self.posting = false;

          if (this.status == 200) {
            self.socket.setBuffer(false);
          } else {
            self.onClose();
          }
        }
      }

      function onload() {
        this.onload = empty;
        self.socket.setBuffer(false);
      };

      this.sendXHR = this.request('POST');

      if (global.XDomainRequest && this.sendXHR instanceof XDomainRequest) {
        this.sendXHR.onload = this.sendXHR.onerror = onload;
      } else {
        this.sendXHR.onreadystatechange = stateChange;
      }

      this.sendXHR.send(data);
    };

    /**
     * Disconnects the established `XHR` connection.
     *
     * @returns {Transport}
     * @api public
     */

    XHR.prototype.close = function () {
      this.onClose();
      return this;
    };

    /**
     * Generates a configured XHR request
     *
     * @param {String} url The url that needs to be requested.
     * @param {String} method The method the request should use.
     * @returns {XMLHttpRequest}
     * @api private
     */

    XHR.prototype.request = function (method) {
      var req = io.util.request(this.socket.isXDomain()),
          query = io.util.query(this.socket.options.query, 't=' + +new Date());

      req.open(method || 'GET', this.prepareUrl() + query, true);

      if (method == 'POST') {
        try {
          if (req.setRequestHeader) {
            req.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
          } else {
            // XDomainRequest
            req.contentType = 'text/plain';
          }
        } catch (e) {}
      }

      return req;
    };

    /**
     * Returns the scheme to use for the transport URLs.
     *
     * @api private
     */

    XHR.prototype.scheme = function () {
      return this.socket.options.secure ? 'https' : 'http';
    };

    /**
     * Check if the XHR transports are supported
     *
     * @param {Boolean} xdomain Check if we support cross domain requests.
     * @returns {Boolean}
     * @api public
     */

    XHR.check = function (socket, xdomain) {
      try {
        var request = io.util.request(xdomain),
            usesXDomReq = global.XDomainRequest && request instanceof XDomainRequest,
            socketProtocol = socket && socket.options && socket.options.secure ? 'https:' : 'http:',
            isXProtocol = global.location && socketProtocol != global.location.protocol;
        if (request && !(usesXDomReq && isXProtocol)) {
          return true;
        }
      } catch (e) {}

      return false;
    };

    /**
     * Check if the XHR transport supports cross domain requests.
     *
     * @returns {Boolean}
     * @api public
     */

    XHR.xdomainCheck = function (socket) {
      return XHR.check(socket, true);
    };
  })('undefined' != typeof io ? io.Transport : module.exports, 'undefined' != typeof io ? io : module.parent.exports, this);
  /**
   * socket.io
   * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
   * MIT Licensed
   */

  (function (exports, io) {

    /**
     * Expose constructor.
     */

    exports.htmlfile = HTMLFile;

    /**
     * The HTMLFile transport creates a `forever iframe` based transport
     * for Internet Explorer. Regular forever iframe implementations will 
     * continuously trigger the browsers buzy indicators. If the forever iframe
     * is created inside a `htmlfile` these indicators will not be trigged.
     *
     * @constructor
     * @extends {io.Transport.XHR}
     * @api public
     */

    function HTMLFile(socket) {
      io.Transport.XHR.apply(this, arguments);
    };

    /**
     * Inherits from XHR transport.
     */

    io.util.inherit(HTMLFile, io.Transport.XHR);

    /**
     * Transport name
     *
     * @api public
     */

    HTMLFile.prototype.name = 'htmlfile';

    /**
     * Creates a new Ac...eX `htmlfile` with a forever loading iframe
     * that can be used to listen to messages. Inside the generated
     * `htmlfile` a reference will be made to the HTMLFile transport.
     *
     * @api private
     */

    HTMLFile.prototype.get = function () {
      this.doc = new (window[['Active'].concat('Object').join('X')])('htmlfile');
      this.doc.open();
      this.doc.write('<html></html>');
      this.doc.close();
      this.doc.parentWindow.s = this;

      var iframeC = this.doc.createElement('div');
      iframeC.className = 'socketio';

      this.doc.body.appendChild(iframeC);
      this.iframe = this.doc.createElement('iframe');

      iframeC.appendChild(this.iframe);

      var self = this,
          query = io.util.query(this.socket.options.query, 't=' + +new Date());

      this.iframe.src = this.prepareUrl() + query;

      io.util.on(window, 'unload', function () {
        self.destroy();
      });
    };

    /**
     * The Socket.IO server will write script tags inside the forever
     * iframe, this function will be used as callback for the incoming
     * information.
     *
     * @param {String} data The message
     * @param {document} doc Reference to the context
     * @api private
     */

    HTMLFile.prototype._ = function (data, doc) {
      // unescape all forward slashes. see GH-1251
      data = data.replace(/\\\//g, '/');
      this.onData(data);
      try {
        var script = doc.getElementsByTagName('script')[0];
        script.parentNode.removeChild(script);
      } catch (e) {}
    };

    /**
     * Destroy the established connection, iframe and `htmlfile`.
     * And calls the `CollectGarbage` function of Internet Explorer
     * to release the memory.
     *
     * @api private
     */

    HTMLFile.prototype.destroy = function () {
      if (this.iframe) {
        try {
          this.iframe.src = 'about:blank';
        } catch (e) {}

        this.doc = null;
        this.iframe.parentNode.removeChild(this.iframe);
        this.iframe = null;

        CollectGarbage();
      }
    };

    /**
     * Disconnects the established connection.
     *
     * @returns {Transport} Chaining.
     * @api public
     */

    HTMLFile.prototype.close = function () {
      this.destroy();
      return io.Transport.XHR.prototype.close.call(this);
    };

    /**
     * Checks if the browser supports this transport. The browser
     * must have an `Ac...eXObject` implementation.
     *
     * @return {Boolean}
     * @api public
     */

    HTMLFile.check = function (socket) {
      if (typeof window != "undefined" && ['Active'].concat('Object').join('X') in window) {
        try {
          var a = new (window[['Active'].concat('Object').join('X')])('htmlfile');
          return a && io.Transport.XHR.check(socket);
        } catch (e) {}
      }
      return false;
    };

    /**
     * Check if cross domain requests are supported.
     *
     * @returns {Boolean}
     * @api public
     */

    HTMLFile.xdomainCheck = function () {
      // we can probably do handling for sub-domains, we should
      // test that it's cross domain but a subdomain here
      return false;
    };

    /**
     * Add the transport to your public io.transports array.
     *
     * @api private
     */

    io.transports.push('htmlfile');
  })('undefined' != typeof io ? io.Transport : module.exports, 'undefined' != typeof io ? io : module.parent.exports);

  /**
   * socket.io
   * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
   * MIT Licensed
   */

  (function (exports, io, global) {

    /**
     * Expose constructor.
     */

    exports['xhr-polling'] = XHRPolling;

    /**
     * The XHR-polling transport uses long polling XHR requests to create a
     * "persistent" connection with the server.
     *
     * @constructor
     * @api public
     */

    function XHRPolling() {
      io.Transport.XHR.apply(this, arguments);
    };

    /**
     * Inherits from XHR transport.
     */

    io.util.inherit(XHRPolling, io.Transport.XHR);

    /**
     * Merge the properties from XHR transport
     */

    io.util.merge(XHRPolling, io.Transport.XHR);

    /**
     * Transport name
     *
     * @api public
     */

    XHRPolling.prototype.name = 'xhr-polling';

    /**
     * Indicates whether heartbeats is enabled for this transport
     *
     * @api private
     */

    XHRPolling.prototype.heartbeats = function () {
      return false;
    };

    /** 
     * Establish a connection, for iPhone and Android this will be done once the page
     * is loaded.
     *
     * @returns {Transport} Chaining.
     * @api public
     */

    XHRPolling.prototype.open = function () {
      var self = this;

      io.Transport.XHR.prototype.open.call(self);
      return false;
    };

    /**
     * Starts a XHR request to wait for incoming messages.
     *
     * @api private
     */

    function empty() {};

    XHRPolling.prototype.get = function () {
      if (!this.isOpen) return;

      var self = this;

      function stateChange() {
        if (this.readyState == 4) {
          this.onreadystatechange = empty;

          if (this.status == 200) {
            self.onData(this.responseText);
            self.get();
          } else {
            self.onClose();
          }
        }
      };

      function onload() {
        this.onload = empty;
        this.onerror = empty;
        self.retryCounter = 1;
        self.onData(this.responseText);
        self.get();
      };

      function onerror() {
        self.retryCounter++;
        if (!self.retryCounter || self.retryCounter > 3) {
          self.onClose();
        } else {
          self.get();
        }
      };

      this.xhr = this.request();

      if (global.XDomainRequest && this.xhr instanceof XDomainRequest) {
        this.xhr.onload = onload;
        this.xhr.onerror = onerror;
      } else {
        this.xhr.onreadystatechange = stateChange;
      }

      this.xhr.send(null);
    };

    /**
     * Handle the unclean close behavior.
     *
     * @api private
     */

    XHRPolling.prototype.onClose = function () {
      io.Transport.XHR.prototype.onClose.call(this);

      if (this.xhr) {
        this.xhr.onreadystatechange = this.xhr.onload = this.xhr.onerror = empty;
        try {
          this.xhr.abort();
        } catch (e) {}
        this.xhr = null;
      }
    };

    /**
     * Webkit based browsers show a infinit spinner when you start a XHR request
     * before the browsers onload event is called so we need to defer opening of
     * the transport until the onload event is called. Wrapping the cb in our
     * defer method solve this.
     *
     * @param {Socket} socket The socket instance that needs a transport
     * @param {Function} fn The callback
     * @api private
     */

    XHRPolling.prototype.ready = function (socket, fn) {
      var self = this;

      io.util.defer(function () {
        fn.call(self);
      });
    };

    /**
     * Add the transport to your public io.transports array.
     *
     * @api private
     */

    io.transports.push('xhr-polling');
  })('undefined' != typeof io ? io.Transport : module.exports, 'undefined' != typeof io ? io : module.parent.exports, this);

  /**
   * socket.io
   * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
   * MIT Licensed
   */

  (function (exports, io, global) {
    /**
     * There is a way to hide the loading indicator in Firefox. If you create and
     * remove a iframe it will stop showing the current loading indicator.
     * Unfortunately we can't feature detect that and UA sniffing is evil.
     *
     * @api private
     */

    var indicator = global.document && "MozAppearance" in global.document.documentElement.style;

    /**
     * Expose constructor.
     */

    exports['jsonp-polling'] = JSONPPolling;

    /**
     * The JSONP transport creates an persistent connection by dynamically
     * inserting a script tag in the page. This script tag will receive the
     * information of the Socket.IO server. When new information is received
     * it creates a new script tag for the new data stream.
     *
     * @constructor
     * @extends {io.Transport.xhr-polling}
     * @api public
     */

    function JSONPPolling(socket) {
      io.Transport['xhr-polling'].apply(this, arguments);

      this.index = io.j.length;

      var self = this;

      io.j.push(function (msg) {
        self._(msg);
      });
    };

    /**
     * Inherits from XHR polling transport.
     */

    io.util.inherit(JSONPPolling, io.Transport['xhr-polling']);

    /**
     * Transport name
     *
     * @api public
     */

    JSONPPolling.prototype.name = 'jsonp-polling';

    /**
     * Posts a encoded message to the Socket.IO server using an iframe.
     * The iframe is used because script tags can create POST based requests.
     * The iframe is positioned outside of the view so the user does not
     * notice it's existence.
     *
     * @param {String} data A encoded message.
     * @api private
     */

    JSONPPolling.prototype.post = function (data) {
      var self = this,
          query = io.util.query(this.socket.options.query, 't=' + +new Date() + '&i=' + this.index);

      if (!this.form) {
        var form = document.createElement('form'),
            area = document.createElement('textarea'),
            id = this.iframeId = 'socketio_iframe_' + this.index,
            iframe;

        form.className = 'socketio';
        form.style.position = 'absolute';
        form.style.top = '0px';
        form.style.left = '0px';
        form.style.display = 'none';
        form.target = id;
        form.method = 'POST';
        form.setAttribute('accept-charset', 'utf-8');
        area.name = 'd';
        form.appendChild(area);
        document.body.appendChild(form);

        this.form = form;
        this.area = area;
      }

      this.form.action = this.prepareUrl() + query;

      function complete() {
        initIframe();
        self.socket.setBuffer(false);
      };

      function initIframe() {
        if (self.iframe) {
          self.form.removeChild(self.iframe);
        }

        try {
          // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
          iframe = document.createElement('<iframe name="' + self.iframeId + '">');
        } catch (e) {
          iframe = document.createElement('iframe');
          iframe.name = self.iframeId;
        }

        iframe.id = self.iframeId;

        self.form.appendChild(iframe);
        self.iframe = iframe;
      };

      initIframe();

      // we temporarily stringify until we figure out how to prevent
      // browsers from turning `\n` into `\r\n` in form inputs
      this.area.value = io.JSON.stringify(data);

      try {
        this.form.submit();
      } catch (e) {}

      if (this.iframe.attachEvent) {
        iframe.onreadystatechange = function () {
          if (self.iframe.readyState == 'complete') {
            complete();
          }
        };
      } else {
        this.iframe.onload = complete;
      }

      this.socket.setBuffer(true);
    };

    /**
     * Creates a new JSONP poll that can be used to listen
     * for messages from the Socket.IO server.
     *
     * @api private
     */

    JSONPPolling.prototype.get = function () {
      var self = this,
          script = document.createElement('script'),
          query = io.util.query(this.socket.options.query, 't=' + +new Date() + '&i=' + this.index);

      if (this.script) {
        this.script.parentNode.removeChild(this.script);
        this.script = null;
      }

      script.async = true;
      script.src = this.prepareUrl() + query;
      script.onerror = function () {
        self.onClose();
      };

      var insertAt = document.getElementsByTagName('script')[0];
      insertAt.parentNode.insertBefore(script, insertAt);
      this.script = script;

      if (indicator) {
        setTimeout(function () {
          var iframe = document.createElement('iframe');
          document.body.appendChild(iframe);
          document.body.removeChild(iframe);
        }, 100);
      }
    };

    /**
     * Callback function for the incoming message stream from the Socket.IO server.
     *
     * @param {String} data The message
     * @api private
     */

    JSONPPolling.prototype._ = function (msg) {
      this.onData(msg);
      if (this.isOpen) {
        this.get();
      }
      return this;
    };

    /**
     * The indicator hack only works after onload
     *
     * @param {Socket} socket The socket instance that needs a transport
     * @param {Function} fn The callback
     * @api private
     */

    JSONPPolling.prototype.ready = function (socket, fn) {
      var self = this;
      if (!indicator) return fn.call(this);

      io.util.load(function () {
        fn.call(self);
      });
    };

    /**
     * Checks if browser supports this transport.
     *
     * @return {Boolean}
     * @api public
     */

    JSONPPolling.check = function () {
      return 'document' in global;
    };

    /**
     * Check if cross domain requests are supported
     *
     * @returns {Boolean}
     * @api public
     */

    JSONPPolling.xdomainCheck = function () {
      return true;
    };

    /**
     * Add the transport to your public io.transports array.
     *
     * @api private
     */

    io.transports.push('jsonp-polling');
  })('undefined' != typeof io ? io.Transport : module.exports, 'undefined' != typeof io ? io : module.parent.exports, this);

  if (typeof define === "function" && define.amd) {
    define([], function () {
      return io;
    });
  }
})();

cc._RFpop();
},{}]},{},["moveUtil","HelloWorld","ground","socket.io"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL1Byb2dyYW0vQ29jb3NDcmVhdG9yL3Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL0hlbGxvV29ybGQuanMiLCJhc3NldHMvc2NyaXB0L2dyb3VuZC5qcyIsImFzc2V0cy9zY3JpcHQvbW92ZVV0aWwuanMiLCJhc3NldHMvc2NyaXB0L3NvY2tldC5pby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjYy5fUkZwdXNoKG1vZHVsZSwgJzI4MGMzcnNaSkpLblo5UnFiQUxWd3RLJywgJ0hlbGxvV29ybGQnKTtcbi8vIEhlbGxvV29ybGQuanNcblxuJ3VzZSBzdHJpY3QnO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGxhYmVsOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICB0ZXh0OiAnSGVsbG8sIFdvcmxkISdcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIC8vIHRoaXMubGFiZWwuc3RyaW5nID0gdGhpcy50ZXh0O1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWVcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge31cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJjYy5fUkZwdXNoKG1vZHVsZSwgJzRkNjEySjBmNlZJYXJxSEEwdmx3cVlxJywgJ2dyb3VuZCcpO1xuLy8gc2NyaXB0XFxncm91bmQuanNcblxuJ3VzZSBzdHJpY3QnO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBjYW52YXM6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkNhbnZhc1xuICAgICAgICB9LFxuICAgICAgICBwbGF5ZXI6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIHBsYXllck1vdmVTdGVwczogW10sXG4gICAgICAgIHNwZWVkOiAxMCxcbiAgICAgICAgbWlkdTogNTBcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICB0aGlzLm1hcE1heFggPSAtdGhpcy5jYW52YXMubm9kZS53aWR0aCAvIDI7XG4gICAgICAgIHRoaXMubWFwTWF4WSA9IC10aGlzLmNhbnZhcy5ub2RlLmhlaWdodCAvIDI7XG4gICAgICAgIHRoaXMubWFwTWluWCA9IC10aGlzLm5vZGUud2lkdGggKyB0aGlzLmNhbnZhcy5ub2RlLndpZHRoIC8gMjtcbiAgICAgICAgdGhpcy5tYXBNaW5ZID0gLXRoaXMubm9kZS5oZWlnaHQgKyB0aGlzLmNhbnZhcy5ub2RlLmhlaWdodCAvIDI7XG5cbiAgICAgICAgdmFyIHBsYXllck9uU2NyZWVuWCA9IHRoaXMucGxheWVyLm5vZGUueCArIHRoaXMubm9kZS54O1xuICAgICAgICB2YXIgcGxheWVyT25TY3JlZW5ZID0gdGhpcy5wbGF5ZXIubm9kZS55ICsgdGhpcy5ub2RlLnk7XG4gICAgICAgIHRoaXMubm9kZS54ID0gdGhpcy5ub2RlLnggLSBwbGF5ZXJPblNjcmVlblg7XG4gICAgICAgIHRoaXMubm9kZS55ID0gdGhpcy5ub2RlLnkgLSBwbGF5ZXJPblNjcmVlblk7XG5cbiAgICAgICAgLy8gdmFyIG15VXRpbCA9IHNlbGYuZ2V0Q29tcG9uZW50KCdteVV0aWwnKTsgIC8v6L+Z5qyh5oiR5Lus5LiN55SocmVxdWlyZSDmiJHku6znlKjnu4Tku7bnmoTmlrnlvI9cbiAgICAgICAgLy/miJHku6zlsIZteVV0aWwuanPmiZTliLDlsYLnuqfnrqHnkIblmajnmoRiYWNrZ3JvdW5k55qE5bGe5oCn5qOA5p+l5Zmo5LitXG5cbiAgICAgICAgdGhpcy5ub2RlLm9uKCd0b3VjaGVuZCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgc2VsZi5wbGF5ZXIuc3RyaW5nID0gZXZlbnQudG91Y2guZ2V0TG9jYXRpb25ZKCk7XG4gICAgICAgICAgICB2YXIgbXlldmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnbXlDbGljaycsIHRydWUpOyAvL+i/meS4quaYr+S4i+S4gOmDqOWIhueahOWGheWuuVxuICAgICAgICAgICAgbXlldmVudC5zZXRVc2VyRGF0YShldmVudC50b3VjaCk7XG5cbiAgICAgICAgICAgIHNlbGYubm9kZS5kaXNwYXRjaEV2ZW50KG15ZXZlbnQpO1xuICAgICAgICAgICAgc2VsZi5wbGF5ZXIuc3RyaW5nID0gXCJBXCI7XG4gICAgICAgICAgICB2YXIgbWFwQWJzWCA9IHNlbGYubm9kZS54ICsgc2VsZi5jYW52YXMubm9kZS53aWR0aCAvIDI7IC8v5Zyw5Zu+55qE5LiW55WM5Z2Q5qCHXG4gICAgICAgICAgICB2YXIgbWFwQWJzWSA9IHNlbGYubm9kZS55ICsgc2VsZi5jYW52YXMubm9kZS5oZWlnaHQgLyAyO1xuICAgICAgICAgICAgc2VsZi5wbGF5ZXIuc3RyaW5nID0gXCJCXCI7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmluZm8oXCJ4eHhcIilcbiAgICAgICAgICAgIHZhciBldmVudE9uTWFwWCA9IGV2ZW50LnRvdWNoLmdldExvY2F0aW9uWCgpIC0gbWFwQWJzWDtcbiAgICAgICAgICAgIHZhciBldmVudE9uTWFwWSA9IGV2ZW50LnRvdWNoLmdldExvY2F0aW9uWSgpIC0gbWFwQWJzWTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUuaW5mbyhldmVudE9uTWFwWCwgZXZlbnRPbk1hcFkpIC8v54K55Ye755qE5Zyw5Zu+5Z2Q5qCHXG4gICAgICAgICAgICBzZWxmLnBsYXllci5zdHJpbmcgPSBcIkNcIjtcbiAgICAgICAgICAgIHNlbGYucGxheWVyLm5vZGUuc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgICAgIHNlbGYubm9kZS5zdG9wQWxsQWN0aW9ucygpO1xuICAgICAgICAgICAgc2VsZi5wbGF5ZXIuc3RyaW5nID0gXCJEXCI7XG4gICAgICAgICAgICBzZWxmLnRvTW92ZShldmVudE9uTWFwWCwgZXZlbnRPbk1hcFkpOyAvL+eEtuWQjuenu+WKqOWwseihjOS6hlxuICAgICAgICAgICAgc2VsZi5wbGF5ZXIuc3RyaW5nID0gXCJFXCI7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIC8vY2MuZGlyZWN0b3IuZ2V0U2NoZWR1bGVyKCkuc2NoZWR1bGUodGhpcy5tb3ZlTWFwLCB0aGlzLCAwLjUsIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuICAgIC8vdGhpcy5tb3ZlTWFwKCk7XG4gICAgLy99LFxuXG4gICAgLy9tb3ZlTWFwOmZ1bmN0aW9uKCl7XG4gICAgLy8gICAgdGhpcy5ub2RlLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgLy9cbiAgICAvLyAgICB2YXIgcGxheWVyT25TY3JlZW5YID0gdGhpcy5wbGF5ZXIubm9kZS54ICsgdGhpcy5ub2RlLng7XG4gICAgLy8gICAgdmFyIHBsYXllck9uU2NyZWVuWSA9IHRoaXMucGxheWVyLm5vZGUueSArIHRoaXMubm9kZS55O1xuICAgIC8vICAgIHZhciBzY3JlZW5EZXN0WCA9IE1hdGgubWluKHRoaXMubWFwTWF4WCwgTWF0aC5tYXgodGhpcy5tYXBNaW5YLCB0aGlzLm5vZGUueCAtIHBsYXllck9uU2NyZWVuWCkpO1xuICAgIC8vICAgIHZhciBzY3JlZW5EZXN0WSA9IE1hdGgubWluKHRoaXMubWFwTWF4WSwgTWF0aC5tYXgodGhpcy5tYXBNaW5ZLCB0aGlzLm5vZGUueSAtIHBsYXllck9uU2NyZWVuWSkpO1xuICAgIC8vICAgIC8vdmFyIHNjcmVlbk1vdmVEaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyh0aGlzLm5vZGUueCAtIHNjcmVlbkRlc3RYLCAyKSArIE1hdGgucG93KHRoaXMubm9kZS55IC0gc2NyZWVuRGVzdFksIDIpKTtcbiAgICAvLyAgICAvL3ZhciBzY3JlZW5Nb3ZlVGltZSA9IHNjcmVlbk1vdmVEaXN0YW5jZSAvIDEwMCAvIHRoaXMuc3BlZWQ7XG4gICAgLy8gICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihcbiAgICAvLyAgICAgICAgY2Muc2VxdWVuY2UoXG4gICAgLy8gICAgICAgICAgICBjYy5tb3ZlVG8oXG4gICAgLy8gICAgICAgICAgICAgICAgMC41LFxuICAgIC8vICAgICAgICAgICAgICAgIHNjcmVlbkRlc3RYLFxuICAgIC8vICAgICAgICAgICAgICAgIHNjcmVlbkRlc3RZXG4gICAgLy8gICAgICAgICAgICApXG4gICAgLy8gICAgICAgICkpO1xuICAgIC8vfSxcblxuICAgIHRvTW92ZTogZnVuY3Rpb24gdG9Nb3ZlKHgsIHkpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgbW92ZVV0aWwgPSByZXF1aXJlKFwiLi9tb3ZlVXRpbFwiKTtcbiAgICAgICAgdmFyIHBsYXllclggPSBNYXRoLnJvdW5kKHNlbGYucGxheWVyLm5vZGUueCAvIHNlbGYubWlkdSk7XG4gICAgICAgIHZhciBwbGF5ZXJZID0gTWF0aC5yb3VuZChzZWxmLnBsYXllci5ub2RlLnkgLyBzZWxmLm1pZHUpO1xuICAgICAgICBzZWxmLnBsYXllci5zdHJpbmcgPSBcIkZcIjtcbiAgICAgICAgdmFyIGRlc2NYID0gTWF0aC5yb3VuZCh4IC8gc2VsZi5taWR1KTtcbiAgICAgICAgdmFyIGRlc2NZID0gTWF0aC5yb3VuZCh5IC8gc2VsZi5taWR1KTtcbiAgICAgICAgaWYgKHBsYXllclggPT0gZGVzY1ggJiYgcGxheWVyWSA9PSBkZXNjWSkgcmV0dXJuO1xuICAgICAgICB2YXIgcGF0aCA9IG1vdmVVdGlsLmZpbmRfcGF0aChbcGxheWVyWCwgcGxheWVyWV0sIFtkZXNjWCwgZGVzY1ldKTtcbiAgICAgICAgc2VsZi5wbGF5ZXIuc3RyaW5nID0gXCJHXCI7XG4gICAgICAgIC8vIGNvbnNvbGUuaW5mbyhwYXRoKTtcbiAgICAgICAgdmFyIHN0ZXBzID0gcGF0aC5tYXAoZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHg6IG5vZGVbMF0gKiBzZWxmLm1pZHUsIHk6IG5vZGVbMV0gKiBzZWxmLm1pZHUgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHNlbGYucGxheWVyLnN0cmluZyA9IFwiSFwiO1xuICAgICAgICAvL3RoaXMucGxheWVyTW92ZVN0ZXBzID0gW3t4OngseTp5fV07XG4gICAgICAgIHNlbGYucGxheWVyTW92ZVN0ZXBzID0gc3RlcHM7XG4gICAgICAgIHNlbGYubW92ZUJ5U3RlcCgpO1xuICAgIH0sXG5cbiAgICBtb3ZlQnlTdGVwOiBmdW5jdGlvbiBtb3ZlQnlTdGVwKHN0ZXBzKSB7XG4gICAgICAgIHZhciBzdGVwID0gdGhpcy5wbGF5ZXJNb3ZlU3RlcHMuc2hpZnQoKTtcbiAgICAgICAgaWYgKHN0ZXAgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3codGhpcy5wbGF5ZXIubm9kZS54IC0gc3RlcC54LCAyKSArIE1hdGgucG93KHRoaXMucGxheWVyLm5vZGUueSAtIHN0ZXAueSwgMikpO1xuICAgICAgICB2YXIgbW92ZVRpbWUgPSBkaXN0YW5jZSAvIDEwMCAvIHRoaXMuc3BlZWQ7XG4gICAgICAgIHRoaXMucGxheWVyLm5vZGUucnVuQWN0aW9uKCAvL+W8gOWni+enu+WKqOWQpyBcbiAgICAgICAgY2Muc2VxdWVuY2UoY2MubW92ZVRvKG1vdmVUaW1lLCBzdGVwLngsIHN0ZXAueSksIGNjLmNhbGxGdW5jKHRoaXMubW92ZUJ5U3RlcCwgdGhpcykpKTtcblxuICAgICAgICB2YXIgc2NyZWVuRGVzdFggPSBNYXRoLm1pbih0aGlzLm1hcE1heFgsIE1hdGgubWF4KHRoaXMubWFwTWluWCwgLXN0ZXAueCkpO1xuICAgICAgICAvLyBjb25zb2xlLmluZm8oc2NyZWVuRGVzdFgsIG1vdmVUaW1lKTtcbiAgICAgICAgdmFyIHNjcmVlbkRlc3RZID0gTWF0aC5taW4odGhpcy5tYXBNYXhZLCBNYXRoLm1heCh0aGlzLm1hcE1pblksIC1zdGVwLnkpKTtcbiAgICAgICAgLy92YXIgc2NyZWVuTW92ZURpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KHRoaXMubm9kZS54IC0gc2NyZWVuRGVzdFgsIDIpICsgTWF0aC5wb3codGhpcy5ub2RlLnkgLSBzY3JlZW5EZXN0WSwgMikpO1xuICAgICAgICAvL3ZhciBzY3JlZW5Nb3ZlVGltZSA9IHNjcmVlbk1vdmVEaXN0YW5jZSAvIDEwMCAvIHRoaXMuc3BlZWQ7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2MubW92ZVRvKG1vdmVUaW1lLCBzY3JlZW5EZXN0WCwgc2NyZWVuRGVzdFkpKSk7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsImNjLl9SRnB1c2gobW9kdWxlLCAnMTcyMDhJaEdUWlBJcHRTNmk3WEZRVXUnLCAnbW92ZVV0aWwnKTtcbi8vIHNjcmlwdFxcbW92ZVV0aWwuanNcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtb3ZlVWl0bCA9IHtcblxuICAgIGZpbmRfcGF0aDogZnVuY3Rpb24gZmluZF9wYXRoKHN0YXJ0LCBlbmQsIG1hcCwgbWFya2VyKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIG9wZW4gPSBbXTtcbiAgICAgICAgdmFyIGNsb3NlID0gW107XG5cbiAgICAgICAgdmFyIHN0YXJ0Tm9kZSA9IHN0YXJ0O1xuICAgICAgICB2YXIgZW5kTm9kZSA9IGVuZDtcbiAgICAgICAgLy8gY29uc29sZS5pbmZvKHN0YXJ0Tm9kZSlcbiAgICAgICAgLy8gY29uc29sZS5pbmZvKGVuZE5vZGUpXG4gICAgICAgIC8vdmFyIG1hcF9hcnIgPSBtYXA7XG4gICAgICAgIC8vdmFyIHRyYV9tYXJrZXIgPSBtYXJrZXI7XG5cbiAgICAgICAgdmFyIEcgPSAwO1xuICAgICAgICB2YXIgSCA9IDA7XG4gICAgICAgIHZhciBGID0gMDtcblxuICAgICAgICAvL+WKoOWFpei1t+Wni+iKgueCuSAgW3gsIHkgLCBHICxGICxmYXRoZXJdXG4gICAgICAgIG9wZW4ucHVzaChbc3RhcnROb2RlWzBdLCBzdGFydE5vZGVbMV0sIDAsIE1hdGguYWJzKGVuZE5vZGVbMF0gLSBzdGFydE5vZGVbMF0pICsgTWF0aC5hYnMoZW5kTm9kZVsxXSAtIHN0YXJ0Tm9kZVsxXSksIG51bGxdKTtcblxuICAgICAgICByZXR1cm4gKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAvL+mHjeaLje+8jOWPluacgOWwj+eahOS4gOS4qlxuICAgICAgICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAgICAgICAgIHZhciBub2RlWCA9IG5vZGVbMF07XG4gICAgICAgICAgICB2YXIgbm9kZVkgPSBub2RlWzFdO1xuICAgICAgICAgICAgdmFyIG5vZGVHID0gbm9kZVsyXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBub2RlWCAtIDEsIGlsZW4gPSBpICsgMzsgaSA8IGlsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSBub2RlWSAtIDEsIGpsZW4gPSBqICsgMzsgaiA8IGpsZW47IGorKykge1xuICAgICAgICAgICAgICAgICAgICAvL+mBjeWOhuWRqOWbtOWFq+iKgueCuSzmjpLpmaToh6rlt7FcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT0gbm9kZVggJiYgaiA9PSBub2RlWSkgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIC8v5o6S6Zmk5pac552A6LWw55qE5oOF5Ya1XG4gICAgICAgICAgICAgICAgICAgIC8vaWYoISgoaSA9PSBvYmpbMF0gKSB8fCAoIGogPT0gb2JqWzFdKSkgJiYgKCBtYXBfYXJyW2ldICYmIG1hcF9hcnJbb2JqWzBdXSAmJiBtYXBfYXJyW2ldW29ialsxXV0gIT0gdHJhX21hcmtlciAmJiBtYXBfYXJyW29ialswXV1bal0gIT0gdHJhX21hcmtlcikpXG4gICAgICAgICAgICAgICAgICAgIC8vaWYgKCEoaSA9PSBub2RlWCB8fCBqID09IG5vZGVZKSlcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpID09IGVuZE5vZGVbMF0gJiYgaiA9PSBlbmROb2RlWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZW5kUG9pbnQgPSBbaSwgaiwgRywgRiwgbm9kZV07XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuLnB1c2goZW5kUG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHdheXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbGUgPSBlbmRQb2ludDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3YXlzLnVuc2hpZnQoZWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGUgPSBlbGVbNF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IHdoaWxlIChlbGVbNF0gIT0gbnVsbCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZvcih2YXIgaT0wOyBpPHdheXMubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgZm9yKHZhciBqPWkrMTsgaisxPHdheXMubGVuZ3RoO2orKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGlmKHdheXNbaV1bMF09PXdheXNbal1bMF0gJiYgd2F5c1tqXVswXT09d2F5c1tqKzFdWzBdIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB3YXlzW2ldWzFdPT13YXlzW2pdWzFdICYmIHdheXNbal1bMV09PXdheXNbaisxXVsxXSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgTWF0aC5hYnMod2F5c1tpXVswXS13YXlzW2pdWzBdKT09TWF0aC5hYnMod2F5c1tpXVsxXS13YXlzW2pdWzFdKSAmJiBNYXRoLmFicyh3YXlzW2pdWzBdLXdheXNbaisxXVswXSk9PU1hdGguYWJzKHdheXNbal1bMV0td2F5c1tqKzFdWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICApe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgd2F5cy5zcGxpY2UoaSsxLDEpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBqLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB3YXlzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vbWFwX2FycltpXSAmJiBtYXBfYXJyW2ldW2pdICYmIG1hcF9hcnJbaV1bal0gPT0gdHJhX21hcmtlciAmJlxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5pc19leGlzdChvcGVuLCBbaSwgal0pID09PSAtMSAmJiBzZWxmLmlzX2V4aXN0KGNsb3NlLCBbaSwgal0pID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgRyA9IGkgPT0gbm9kZVggfHwgaiA9PSBub2RlWSA/IG5vZGVHICsgMS4wIDogbm9kZUcgKyAxLjQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGlzdFggPSBlbmROb2RlWzBdIC0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkaXN0WSA9IGVuZE5vZGVbMV0gLSBqO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9IID0gTWF0aC5zcXJ0KGRpc3RYICogZGlzdFggKyBkaXN0WSAqIGRpc3RZKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIEggPSBNYXRoLmFicyhkaXN0WCkgKyBNYXRoLmFicyhkaXN0WSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBGID0gRyArIEg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdmFyIHRkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaStcIi1cIitqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdGQuaW5uZXJIVE1MID0gXCJHOlwiICsgRy50b0ZpeGVkKDIpICsgXCJcXG5IOlwiICsgSC50b0ZpeGVkKDIpICsgXCJcXG5GOlwiICsgRi50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3Blbi5wdXNoKFtpLCBqLCBHLCBGLCBub2RlXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2xvc2UucHVzaChvcGVuLnNoaWZ0KCkpO1xuICAgICAgICAgICAgdmFyIG87XG4gICAgICAgICAgICBpZiAob3BlblswXSAmJiBvcGVuWzBdWzRdID09IG5vZGVbNF0pIHtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUuaW5mbyhvcGVuKVxuICAgICAgICAgICAgICAgIG8gPSBjb3VudCA9PSAwID8gZ2V0X2Jyb3RoZXIob3Blbiwgbm9kZSkgOiAoc2VsZi5hcnJfc29ydChvcGVuKSwgb3BlblswXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5pbmZvKG9wZW4pXG4gICAgICAgICAgICAgICAgbyA9IChzZWxmLmFycl9zb3J0KG9wZW4pLCBvcGVuWzBdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJndW1lbnRzLmNhbGxlZShvKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KShvcGVuWzBdKTtcbiAgICB9LFxuXG4gICAgZ2V0X2Jyb3RoZXI6IGZ1bmN0aW9uIGdldF9icm90aGVyKGFyciwgbykge1xuICAgICAgICB2YXIgYSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKG8gJiYgYXJyW2ldWzRdID09IG9bNF0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChvWzRdKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJndW1lbnRzLmNhbGxlZShvWzRdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGFycl9zb3J0OiAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBzKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBhWzNdIC0gYlszXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoYXJyKSB7XG4gICAgICAgICAgICBhcnIuc29ydChzKTtcbiAgICAgICAgfTtcbiAgICB9KSgpLFxuXG4gICAgaXNfZXhpc3Q6IGZ1bmN0aW9uIGlzX2V4aXN0KGFyciwgcCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGFycltpXVswXSA9PSBwWzBdICYmIGFycltpXVsxXSA9PSBwWzFdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbW92ZVVpdGw7XG5cbmNjLl9SRnBvcCgpOyIsImNjLl9SRnB1c2gobW9kdWxlLCAnOTZjN2E1VUZLUkcrWXI4Mzd0b3ExVDQnLCAnc29ja2V0LmlvJyk7XG4vLyBzY3JpcHRcXHNvY2tldC5pby5qc1xuXG4vKiEgU29ja2V0LklPLmpzIGJ1aWxkOjAuOS4xNiwgZGV2ZWxvcG1lbnQuIENvcHlyaWdodChjKSAyMDExIExlYXJuQm9vc3QgPGRldkBsZWFybmJvb3N0LmNvbT4gTUlUIExpY2Vuc2VkICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGlvID0gJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBtb2R1bGUgPyB7fSA6IG1vZHVsZS5leHBvcnRzO1xuKGZ1bmN0aW9uICgpIHtcblxuICAvKipcbiAgICogc29ja2V0LmlvXG4gICAqIENvcHlyaWdodChjKSAyMDExIExlYXJuQm9vc3QgPGRldkBsZWFybmJvb3N0LmNvbT5cbiAgICogTUlUIExpY2Vuc2VkXG4gICAqL1xuXG4gIChmdW5jdGlvbiAoZXhwb3J0cywgZ2xvYmFsKSB7XG5cbiAgICAvKipcbiAgICAgKiBJTyBuYW1lc3BhY2UuXG4gICAgICpcbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICovXG5cbiAgICB2YXIgaW8gPSBleHBvcnRzO1xuXG4gICAgLyoqXG4gICAgICogU29ja2V0LklPIHZlcnNpb25cbiAgICAgKlxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG5cbiAgICBpby52ZXJzaW9uID0gJzAuOS4xNic7XG5cbiAgICAvKipcbiAgICAgKiBQcm90b2NvbCBpbXBsZW1lbnRlZC5cbiAgICAgKlxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG5cbiAgICBpby5wcm90b2NvbCA9IDE7XG5cbiAgICAvKipcbiAgICAgKiBBdmFpbGFibGUgdHJhbnNwb3J0cywgdGhlc2Ugd2lsbCBiZSBwb3B1bGF0ZWQgd2l0aCB0aGUgYXZhaWxhYmxlIHRyYW5zcG9ydHNcbiAgICAgKlxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG5cbiAgICBpby50cmFuc3BvcnRzID0gW107XG5cbiAgICAvKipcbiAgICAgKiBLZWVwIHRyYWNrIG9mIGpzb25wIGNhbGxiYWNrcy5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gICAgaW8uaiA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogS2VlcCB0cmFjayBvZiBvdXIgaW8uU29ja2V0c1xuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgaW8uc29ja2V0cyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogTWFuYWdlcyBjb25uZWN0aW9ucyB0byBob3N0cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmlcbiAgICAgKiBAUGFyYW0ge0Jvb2xlYW59IGZvcmNlIGNyZWF0aW9uIG9mIG5ldyBzb2NrZXQgKGRlZmF1bHRzIHRvIGZhbHNlKVxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG5cbiAgICBpby5jb25uZWN0ID0gZnVuY3Rpb24gKGhvc3QsIGRldGFpbHMpIHtcbiAgICAgIHZhciB1cmkgPSBpby51dGlsLnBhcnNlVXJpKGhvc3QpLFxuICAgICAgICAgIHV1cmksXG4gICAgICAgICAgc29ja2V0O1xuXG4gICAgICBpZiAoZ2xvYmFsICYmIGdsb2JhbC5sb2NhdGlvbikge1xuICAgICAgICB1cmkucHJvdG9jb2wgPSB1cmkucHJvdG9jb2wgfHwgZ2xvYmFsLmxvY2F0aW9uLnByb3RvY29sLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgdXJpLmhvc3QgPSB1cmkuaG9zdCB8fCAoZ2xvYmFsLmRvY3VtZW50ID8gZ2xvYmFsLmRvY3VtZW50LmRvbWFpbiA6IGdsb2JhbC5sb2NhdGlvbi5ob3N0bmFtZSk7XG4gICAgICAgIHVyaS5wb3J0ID0gdXJpLnBvcnQgfHwgZ2xvYmFsLmxvY2F0aW9uLnBvcnQ7XG4gICAgICB9XG5cbiAgICAgIHV1cmkgPSBpby51dGlsLnVuaXF1ZVVyaSh1cmkpO1xuXG4gICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgaG9zdDogdXJpLmhvc3QsXG4gICAgICAgIHNlY3VyZTogJ2h0dHBzJyA9PSB1cmkucHJvdG9jb2wsXG4gICAgICAgIHBvcnQ6IHVyaS5wb3J0IHx8ICgnaHR0cHMnID09IHVyaS5wcm90b2NvbCA/IDQ0MyA6IDgwKSxcbiAgICAgICAgcXVlcnk6IHVyaS5xdWVyeSB8fCAnJ1xuICAgICAgfTtcblxuICAgICAgaW8udXRpbC5tZXJnZShvcHRpb25zLCBkZXRhaWxzKTtcblxuICAgICAgaWYgKG9wdGlvbnNbJ2ZvcmNlIG5ldyBjb25uZWN0aW9uJ10gfHwgIWlvLnNvY2tldHNbdXVyaV0pIHtcbiAgICAgICAgc29ja2V0ID0gbmV3IGlvLlNvY2tldChvcHRpb25zKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFvcHRpb25zWydmb3JjZSBuZXcgY29ubmVjdGlvbiddICYmIHNvY2tldCkge1xuICAgICAgICBpby5zb2NrZXRzW3V1cmldID0gc29ja2V0O1xuICAgICAgfVxuXG4gICAgICBzb2NrZXQgPSBzb2NrZXQgfHwgaW8uc29ja2V0c1t1dXJpXTtcblxuICAgICAgLy8gaWYgcGF0aCBpcyBkaWZmZXJlbnQgZnJvbSAnJyBvciAvXG4gICAgICByZXR1cm4gc29ja2V0Lm9mKHVyaS5wYXRoLmxlbmd0aCA+IDEgPyB1cmkucGF0aCA6ICcnKTtcbiAgICB9O1xuICB9KSgnb2JqZWN0JyA9PT0gdHlwZW9mIG1vZHVsZSA/IG1vZHVsZS5leHBvcnRzIDogdGhpcy5pbyA9IHt9LCB0aGlzKTtcbiAgLyoqXG4gICAqIHNvY2tldC5pb1xuICAgKiBDb3B5cmlnaHQoYykgMjAxMSBMZWFybkJvb3N0IDxkZXZAbGVhcm5ib29zdC5jb20+XG4gICAqIE1JVCBMaWNlbnNlZFxuICAgKi9cblxuICAoZnVuY3Rpb24gKGV4cG9ydHMsIGdsb2JhbCkge1xuXG4gICAgLyoqXG4gICAgICogVXRpbGl0aWVzIG5hbWVzcGFjZS5cbiAgICAgKlxuICAgICAqIEBuYW1lc3BhY2VcbiAgICAgKi9cblxuICAgIHZhciB1dGlsID0gZXhwb3J0cy51dGlsID0ge307XG5cbiAgICAvKipcbiAgICAgKiBQYXJzZXMgYW4gVVJJXG4gICAgICpcbiAgICAgKiBAYXV0aG9yIFN0ZXZlbiBMZXZpdGhhbiA8c3RldmVubGV2aXRoYW4uY29tPiAoTUlUIGxpY2Vuc2UpXG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cblxuICAgIHZhciByZSA9IC9eKD86KD8hW146QF0rOlteOkBcXC9dKkApKFteOlxcLz8jLl0rKTopPyg/OlxcL1xcLyk/KCg/OigoW146QF0qKSg/OjooW146QF0qKSk/KT9AKT8oW146XFwvPyNdKikoPzo6KFxcZCopKT8pKCgoXFwvKD86W14/I10oPyFbXj8jXFwvXSpcXC5bXj8jXFwvLl0rKD86Wz8jXXwkKSkpKlxcLz8pPyhbXj8jXFwvXSopKSg/OlxcPyhbXiNdKikpPyg/OiMoLiopKT8pLztcblxuICAgIHZhciBwYXJ0cyA9IFsnc291cmNlJywgJ3Byb3RvY29sJywgJ2F1dGhvcml0eScsICd1c2VySW5mbycsICd1c2VyJywgJ3Bhc3N3b3JkJywgJ2hvc3QnLCAncG9ydCcsICdyZWxhdGl2ZScsICdwYXRoJywgJ2RpcmVjdG9yeScsICdmaWxlJywgJ3F1ZXJ5JywgJ2FuY2hvciddO1xuXG4gICAgdXRpbC5wYXJzZVVyaSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgIHZhciBtID0gcmUuZXhlYyhzdHIgfHwgJycpLFxuICAgICAgICAgIHVyaSA9IHt9LFxuICAgICAgICAgIGkgPSAxNDtcblxuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICB1cmlbcGFydHNbaV1dID0gbVtpXSB8fCAnJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHVyaTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUHJvZHVjZXMgYSB1bmlxdWUgdXJsIHRoYXQgaWRlbnRpZmllcyBhIFNvY2tldC5JTyBjb25uZWN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHVyaVxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG5cbiAgICB1dGlsLnVuaXF1ZVVyaSA9IGZ1bmN0aW9uICh1cmkpIHtcbiAgICAgIHZhciBwcm90b2NvbCA9IHVyaS5wcm90b2NvbCxcbiAgICAgICAgICBob3N0ID0gdXJpLmhvc3QsXG4gICAgICAgICAgcG9ydCA9IHVyaS5wb3J0O1xuXG4gICAgICBpZiAoJ2RvY3VtZW50JyBpbiBnbG9iYWwpIHtcbiAgICAgICAgaG9zdCA9IGhvc3QgfHwgZG9jdW1lbnQuZG9tYWluO1xuICAgICAgICBwb3J0ID0gcG9ydCB8fCAocHJvdG9jb2wgPT0gJ2h0dHBzJyAmJiBkb2N1bWVudC5sb2NhdGlvbi5wcm90b2NvbCAhPT0gJ2h0dHBzOicgPyA0NDMgOiBkb2N1bWVudC5sb2NhdGlvbi5wb3J0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGhvc3QgPSBob3N0IHx8ICdsb2NhbGhvc3QnO1xuXG4gICAgICAgIGlmICghcG9ydCAmJiBwcm90b2NvbCA9PSAnaHR0cHMnKSB7XG4gICAgICAgICAgcG9ydCA9IDQ0MztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gKHByb3RvY29sIHx8ICdodHRwJykgKyAnOi8vJyArIGhvc3QgKyAnOicgKyAocG9ydCB8fCA4MCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIE1lcmdlc3QgMiBxdWVyeSBzdHJpbmdzIGluIHRvIG9uY2UgdW5pcXVlIHF1ZXJ5IHN0cmluZ1xuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGJhc2VcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYWRkaXRpb25cbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgdXRpbC5xdWVyeSA9IGZ1bmN0aW9uIChiYXNlLCBhZGRpdGlvbikge1xuICAgICAgdmFyIHF1ZXJ5ID0gdXRpbC5jaHVua1F1ZXJ5KGJhc2UgfHwgJycpLFxuICAgICAgICAgIGNvbXBvbmVudHMgPSBbXTtcblxuICAgICAgdXRpbC5tZXJnZShxdWVyeSwgdXRpbC5jaHVua1F1ZXJ5KGFkZGl0aW9uIHx8ICcnKSk7XG4gICAgICBmb3IgKHZhciBwYXJ0IGluIHF1ZXJ5KSB7XG4gICAgICAgIGlmIChxdWVyeS5oYXNPd25Qcm9wZXJ0eShwYXJ0KSkge1xuICAgICAgICAgIGNvbXBvbmVudHMucHVzaChwYXJ0ICsgJz0nICsgcXVlcnlbcGFydF0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb21wb25lbnRzLmxlbmd0aCA/ICc/JyArIGNvbXBvbmVudHMuam9pbignJicpIDogJyc7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRyYW5zZm9ybXMgYSBxdWVyeXN0cmluZyBpbiB0byBhbiBvYmplY3RcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBxc1xuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG5cbiAgICB1dGlsLmNodW5rUXVlcnkgPSBmdW5jdGlvbiAocXMpIHtcbiAgICAgIHZhciBxdWVyeSA9IHt9LFxuICAgICAgICAgIHBhcmFtcyA9IHFzLnNwbGl0KCcmJyksXG4gICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgbCA9IHBhcmFtcy5sZW5ndGgsXG4gICAgICAgICAga3Y7XG5cbiAgICAgIGZvciAoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgIGt2ID0gcGFyYW1zW2ldLnNwbGl0KCc9Jyk7XG4gICAgICAgIGlmIChrdlswXSkge1xuICAgICAgICAgIHF1ZXJ5W2t2WzBdXSA9IGt2WzFdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBxdWVyeTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZXMgdGhlIGdpdmVuIGZ1bmN0aW9uIHdoZW4gdGhlIHBhZ2UgaXMgbG9hZGVkLlxuICAgICAqXG4gICAgICogICAgIGlvLnV0aWwubG9hZChmdW5jdGlvbiAoKSB7IGNvbnNvbGUubG9nKCdwYWdlIGxvYWRlZCcpOyB9KTtcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cblxuICAgIHZhciBwYWdlTG9hZGVkID0gZmFsc2U7XG5cbiAgICB1dGlsLmxvYWQgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICAgIGlmICgnZG9jdW1lbnQnIGluIGdsb2JhbCAmJiBkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnIHx8IHBhZ2VMb2FkZWQpIHtcbiAgICAgICAgcmV0dXJuIGZuKCk7XG4gICAgICB9XG5cbiAgICAgIHV0aWwub24oZ2xvYmFsLCAnbG9hZCcsIGZuLCBmYWxzZSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFkZHMgYW4gZXZlbnQuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICAgIHV0aWwub24gPSBmdW5jdGlvbiAoZWxlbWVudCwgZXZlbnQsIGZuLCBjYXB0dXJlKSB7XG4gICAgICBpZiAoZWxlbWVudC5hdHRhY2hFdmVudCkge1xuICAgICAgICBlbGVtZW50LmF0dGFjaEV2ZW50KCdvbicgKyBldmVudCwgZm4pO1xuICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBmbiwgY2FwdHVyZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlcyB0aGUgY29ycmVjdCBgWE1MSHR0cFJlcXVlc3RgIGZvciByZWd1bGFyIGFuZCBjcm9zcyBkb21haW4gcmVxdWVzdHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFt4ZG9tYWluXSBDcmVhdGUgYSByZXF1ZXN0IHRoYXQgY2FuIGJlIHVzZWQgY3Jvc3MgZG9tYWluLlxuICAgICAqIEByZXR1cm5zIHtYTUxIdHRwUmVxdWVzdHxmYWxzZX0gSWYgd2UgY2FuIGNyZWF0ZSBhIFhNTEh0dHBSZXF1ZXN0LlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gICAgdXRpbC5yZXF1ZXN0ID0gZnVuY3Rpb24gKHhkb21haW4pIHtcblxuICAgICAgaWYgKHhkb21haW4gJiYgJ3VuZGVmaW5lZCcgIT0gdHlwZW9mIFhEb21haW5SZXF1ZXN0ICYmICF1dGlsLnVhLmhhc0NPUlMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBYRG9tYWluUmVxdWVzdCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoJ3VuZGVmaW5lZCcgIT0gdHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICYmICgheGRvbWFpbiB8fCB1dGlsLnVhLmhhc0NPUlMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF4ZG9tYWluKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyAod2luZG93W1snQWN0aXZlJ10uY29uY2F0KCdPYmplY3QnKS5qb2luKCdYJyldKSgnTWljcm9zb2Z0LlhNTEhUVFAnKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFhIUiBiYXNlZCB0cmFuc3BvcnQgY29uc3RydWN0b3IuXG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlIHRoZSBpbnRlcm5hbCBwYWdlTG9hZGVkIHZhbHVlLlxuICAgICAqL1xuXG4gICAgaWYgKCd1bmRlZmluZWQnICE9IHR5cGVvZiB3aW5kb3cpIHtcbiAgICAgIHV0aWwubG9hZChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHBhZ2VMb2FkZWQgPSB0cnVlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVmZXJzIGEgZnVuY3Rpb24gdG8gZW5zdXJlIGEgc3Bpbm5lciBpcyBub3QgZGlzcGxheWVkIGJ5IHRoZSBicm93c2VyXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG5cbiAgICB1dGlsLmRlZmVyID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICBpZiAoIXV0aWwudWEud2Via2l0IHx8ICd1bmRlZmluZWQnICE9IHR5cGVvZiBpbXBvcnRTY3JpcHRzKSB7XG4gICAgICAgIHJldHVybiBmbigpO1xuICAgICAgfVxuXG4gICAgICB1dGlsLmxvYWQoZnVuY3Rpb24gKCkge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAxMDApO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIE1lcmdlcyB0d28gb2JqZWN0cy5cbiAgICAgKlxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG5cbiAgICB1dGlsLm1lcmdlID0gZnVuY3Rpb24gbWVyZ2UodGFyZ2V0LCBhZGRpdGlvbmFsLCBkZWVwLCBsYXN0c2Vlbikge1xuICAgICAgdmFyIHNlZW4gPSBsYXN0c2VlbiB8fCBbXSxcbiAgICAgICAgICBkZXB0aCA9IHR5cGVvZiBkZWVwID09ICd1bmRlZmluZWQnID8gMiA6IGRlZXAsXG4gICAgICAgICAgcHJvcDtcblxuICAgICAgZm9yIChwcm9wIGluIGFkZGl0aW9uYWwpIHtcbiAgICAgICAgaWYgKGFkZGl0aW9uYWwuaGFzT3duUHJvcGVydHkocHJvcCkgJiYgdXRpbC5pbmRleE9mKHNlZW4sIHByb3ApIDwgMCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0W3Byb3BdICE9PSAnb2JqZWN0JyB8fCAhZGVwdGgpIHtcbiAgICAgICAgICAgIHRhcmdldFtwcm9wXSA9IGFkZGl0aW9uYWxbcHJvcF07XG4gICAgICAgICAgICBzZWVuLnB1c2goYWRkaXRpb25hbFtwcm9wXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHV0aWwubWVyZ2UodGFyZ2V0W3Byb3BdLCBhZGRpdGlvbmFsW3Byb3BdLCBkZXB0aCAtIDEsIHNlZW4pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBNZXJnZXMgcHJvdG90eXBlcyBmcm9tIG9iamVjdHNcbiAgICAgKlxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG5cbiAgICB1dGlsLm1peGluID0gZnVuY3Rpb24gKGN0b3IsIGN0b3IyKSB7XG4gICAgICB1dGlsLm1lcmdlKGN0b3IucHJvdG90eXBlLCBjdG9yMi5wcm90b3R5cGUpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTaG9ydGN1dCBmb3IgcHJvdG90eXBpY2FsIGFuZCBzdGF0aWMgaW5oZXJpdGFuY2UuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICAgIHV0aWwuaW5oZXJpdCA9IGZ1bmN0aW9uIChjdG9yLCBjdG9yMikge1xuICAgICAgZnVuY3Rpb24gZigpIHt9O1xuICAgICAgZi5wcm90b3R5cGUgPSBjdG9yMi5wcm90b3R5cGU7XG4gICAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBmKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGFuIEFycmF5LlxuICAgICAqXG4gICAgICogICAgIGlvLnV0aWwuaXNBcnJheShbXSk7IC8vIHRydWVcbiAgICAgKiAgICAgaW8udXRpbC5pc0FycmF5KHt9KTsgLy8gZmFsc2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSBPYmplY3Qgb2JqXG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cblxuICAgIHV0aWwuaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBJbnRlcnNlY3RzIHZhbHVlcyBvZiB0d28gYXJyYXlzIGludG8gYSB0aGlyZFxuICAgICAqXG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cblxuICAgIHV0aWwuaW50ZXJzZWN0ID0gZnVuY3Rpb24gKGFyciwgYXJyMikge1xuICAgICAgdmFyIHJldCA9IFtdLFxuICAgICAgICAgIGxvbmdlc3QgPSBhcnIubGVuZ3RoID4gYXJyMi5sZW5ndGggPyBhcnIgOiBhcnIyLFxuICAgICAgICAgIHNob3J0ZXN0ID0gYXJyLmxlbmd0aCA+IGFycjIubGVuZ3RoID8gYXJyMiA6IGFycjtcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBzaG9ydGVzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKH51dGlsLmluZGV4T2YobG9uZ2VzdCwgc2hvcnRlc3RbaV0pKSByZXQucHVzaChzaG9ydGVzdFtpXSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFycmF5IGluZGV4T2YgY29tcGF0aWJpbGl0eS5cbiAgICAgKlxuICAgICAqIEBzZWUgYml0Lmx5L2E1RHhhMlxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG5cbiAgICB1dGlsLmluZGV4T2YgPSBmdW5jdGlvbiAoYXJyLCBvLCBpKSB7XG5cbiAgICAgIGZvciAodmFyIGogPSBhcnIubGVuZ3RoLCBpID0gaSA8IDAgPyBpICsgaiA8IDAgPyAwIDogaSArIGogOiBpIHx8IDA7IGkgPCBqICYmIGFycltpXSAhPT0gbzsgaSsrKSB7fVxuXG4gICAgICByZXR1cm4gaiA8PSBpID8gLTEgOiBpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyBlbnVtZXJhYmxlcyB0byBhcnJheS5cbiAgICAgKlxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG5cbiAgICB1dGlsLnRvQXJyYXkgPSBmdW5jdGlvbiAoZW51KSB7XG4gICAgICB2YXIgYXJyID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gZW51Lmxlbmd0aDsgaSA8IGw7IGkrKykgYXJyLnB1c2goZW51W2ldKTtcblxuICAgICAgcmV0dXJuIGFycjtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVUEgLyBlbmdpbmVzIGRldGVjdGlvbiBuYW1lc3BhY2UuXG4gICAgICpcbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICovXG5cbiAgICB1dGlsLnVhID0ge307XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRoZSBVQSBzdXBwb3J0cyBDT1JTIGZvciBYSFIuXG4gICAgICpcbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgdXRpbC51YS5oYXNDT1JTID0gJ3VuZGVmaW5lZCcgIT0gdHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICYmIChmdW5jdGlvbiAoKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgYSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhLndpdGhDcmVkZW50aWFscyAhPSB1bmRlZmluZWQ7XG4gICAgfSkoKTtcblxuICAgIC8qKlxuICAgICAqIERldGVjdCB3ZWJraXQuXG4gICAgICpcbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgdXRpbC51YS53ZWJraXQgPSAndW5kZWZpbmVkJyAhPSB0eXBlb2YgbmF2aWdhdG9yICYmIC93ZWJraXQvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXG4gICAgLyoqXG4gICAgKiBEZXRlY3QgaVBhZC9pUGhvbmUvaVBvZC5cbiAgICAqXG4gICAgKiBAYXBpIHB1YmxpY1xuICAgICovXG5cbiAgICB1dGlsLnVhLmlEZXZpY2UgPSAndW5kZWZpbmVkJyAhPSB0eXBlb2YgbmF2aWdhdG9yICYmIC9pUGFkfGlQaG9uZXxpUG9kL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgfSkoJ3VuZGVmaW5lZCcgIT0gdHlwZW9mIGlvID8gaW8gOiBtb2R1bGUuZXhwb3J0cywgdGhpcyk7XG4gIC8qKlxuICAgKiBzb2NrZXQuaW9cbiAgICogQ29weXJpZ2h0KGMpIDIwMTEgTGVhcm5Cb29zdCA8ZGV2QGxlYXJuYm9vc3QuY29tPlxuICAgKiBNSVQgTGljZW5zZWRcbiAgICovXG5cbiAgKGZ1bmN0aW9uIChleHBvcnRzLCBpbykge1xuXG4gICAgLyoqXG4gICAgICogRXhwb3NlIGNvbnN0cnVjdG9yLlxuICAgICAqL1xuXG4gICAgZXhwb3J0cy5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBlbWl0dGVyIGNvbnN0cnVjdG9yLlxuICAgICAqXG4gICAgICogQGFwaSBwdWJsaWMuXG4gICAgICovXG5cbiAgICBmdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7fTtcblxuICAgIC8qKlxuICAgICAqIEFkZHMgYSBsaXN0ZW5lclxuICAgICAqXG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cblxuICAgIEV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBmdW5jdGlvbiAobmFtZSwgZm4pIHtcbiAgICAgIGlmICghdGhpcy4kZXZlbnRzKSB7XG4gICAgICAgIHRoaXMuJGV2ZW50cyA9IHt9O1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuJGV2ZW50c1tuYW1lXSkge1xuICAgICAgICB0aGlzLiRldmVudHNbbmFtZV0gPSBmbjtcbiAgICAgIH0gZWxzZSBpZiAoaW8udXRpbC5pc0FycmF5KHRoaXMuJGV2ZW50c1tuYW1lXSkpIHtcbiAgICAgICAgdGhpcy4kZXZlbnRzW25hbWVdLnB1c2goZm4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4kZXZlbnRzW25hbWVdID0gW3RoaXMuJGV2ZW50c1tuYW1lXSwgZm5dO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUub247XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgdm9sYXRpbGUgbGlzdGVuZXIuXG4gICAgICpcbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gKG5hbWUsIGZuKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIGZ1bmN0aW9uIG9uKCkge1xuICAgICAgICBzZWxmLnJlbW92ZUxpc3RlbmVyKG5hbWUsIG9uKTtcbiAgICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG5cbiAgICAgIG9uLmxpc3RlbmVyID0gZm47XG4gICAgICB0aGlzLm9uKG5hbWUsIG9uKTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYSBsaXN0ZW5lci5cbiAgICAgKlxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG5cbiAgICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gKG5hbWUsIGZuKSB7XG4gICAgICBpZiAodGhpcy4kZXZlbnRzICYmIHRoaXMuJGV2ZW50c1tuYW1lXSkge1xuICAgICAgICB2YXIgbGlzdCA9IHRoaXMuJGV2ZW50c1tuYW1lXTtcblxuICAgICAgICBpZiAoaW8udXRpbC5pc0FycmF5KGxpc3QpKSB7XG4gICAgICAgICAgdmFyIHBvcyA9IC0xO1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBsaXN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgaWYgKGxpc3RbaV0gPT09IGZuIHx8IGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gZm4pIHtcbiAgICAgICAgICAgICAgcG9zID0gaTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHBvcyA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxpc3Quc3BsaWNlKHBvcywgMSk7XG5cbiAgICAgICAgICBpZiAoIWxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy4kZXZlbnRzW25hbWVdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChsaXN0ID09PSBmbiB8fCBsaXN0Lmxpc3RlbmVyICYmIGxpc3QubGlzdGVuZXIgPT09IGZuKSB7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuJGV2ZW50c1tuYW1lXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgbGlzdGVuZXJzIGZvciBhbiBldmVudC5cbiAgICAgKlxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG5cbiAgICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICBpZiAobmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuJGV2ZW50cyA9IHt9O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuJGV2ZW50cyAmJiB0aGlzLiRldmVudHNbbmFtZV0pIHtcbiAgICAgICAgdGhpcy4kZXZlbnRzW25hbWVdID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdldHMgYWxsIGxpc3RlbmVycyBmb3IgYSBjZXJ0YWluIGV2ZW50LlxuICAgICAqXG4gICAgICogQGFwaSBwdWJsY2lcbiAgICAgKi9cblxuICAgIEV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIGlmICghdGhpcy4kZXZlbnRzKSB7XG4gICAgICAgIHRoaXMuJGV2ZW50cyA9IHt9O1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuJGV2ZW50c1tuYW1lXSkge1xuICAgICAgICB0aGlzLiRldmVudHNbbmFtZV0gPSBbXTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpby51dGlsLmlzQXJyYXkodGhpcy4kZXZlbnRzW25hbWVdKSkge1xuICAgICAgICB0aGlzLiRldmVudHNbbmFtZV0gPSBbdGhpcy4kZXZlbnRzW25hbWVdXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuJGV2ZW50c1tuYW1lXTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRW1pdHMgYW4gZXZlbnQuXG4gICAgICpcbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIGlmICghdGhpcy4kZXZlbnRzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGhhbmRsZXIgPSB0aGlzLiRldmVudHNbbmFtZV07XG5cbiAgICAgIGlmICghaGFuZGxlcikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgICAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGhhbmRsZXIpIHtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgIH0gZWxzZSBpZiAoaW8udXRpbC5pc0FycmF5KGhhbmRsZXIpKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gIH0pKCd1bmRlZmluZWQnICE9IHR5cGVvZiBpbyA/IGlvIDogbW9kdWxlLmV4cG9ydHMsICd1bmRlZmluZWQnICE9IHR5cGVvZiBpbyA/IGlvIDogbW9kdWxlLnBhcmVudC5leHBvcnRzKTtcblxuICAvKipcbiAgICogc29ja2V0LmlvXG4gICAqIENvcHlyaWdodChjKSAyMDExIExlYXJuQm9vc3QgPGRldkBsZWFybmJvb3N0LmNvbT5cbiAgICogTUlUIExpY2Vuc2VkXG4gICAqL1xuXG4gIC8qKlxuICAgKiBCYXNlZCBvbiBKU09OMiAoaHR0cDovL3d3dy5KU09OLm9yZy9qcy5odG1sKS5cbiAgICovXG5cbiAgKGZ1bmN0aW9uIChleHBvcnRzLCBuYXRpdmVKU09OKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvLyB1c2UgbmF0aXZlIEpTT04gaWYgaXQncyBhdmFpbGFibGVcbiAgICBpZiAobmF0aXZlSlNPTiAmJiBuYXRpdmVKU09OLnBhcnNlKSB7XG4gICAgICByZXR1cm4gZXhwb3J0cy5KU09OID0ge1xuICAgICAgICBwYXJzZTogbmF0aXZlSlNPTi5wYXJzZSxcbiAgICAgICAgc3RyaW5naWZ5OiBuYXRpdmVKU09OLnN0cmluZ2lmeVxuICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgSlNPTiA9IGV4cG9ydHMuSlNPTiA9IHt9O1xuXG4gICAgZnVuY3Rpb24gZihuKSB7XG4gICAgICAvLyBGb3JtYXQgaW50ZWdlcnMgdG8gaGF2ZSBhdCBsZWFzdCB0d28gZGlnaXRzLlxuICAgICAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4gOiBuO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRhdGUoZCwga2V5KSB7XG4gICAgICByZXR1cm4gaXNGaW5pdGUoZC52YWx1ZU9mKCkpID8gZC5nZXRVVENGdWxsWWVhcigpICsgJy0nICsgZihkLmdldFVUQ01vbnRoKCkgKyAxKSArICctJyArIGYoZC5nZXRVVENEYXRlKCkpICsgJ1QnICsgZihkLmdldFVUQ0hvdXJzKCkpICsgJzonICsgZihkLmdldFVUQ01pbnV0ZXMoKSkgKyAnOicgKyBmKGQuZ2V0VVRDU2Vjb25kcygpKSArICdaJyA6IG51bGw7XG4gICAgfTtcblxuICAgIHZhciBjeCA9IC9bXFx1MDAwMFxcdTAwYWRcXHUwNjAwLVxcdTA2MDRcXHUwNzBmXFx1MTdiNFxcdTE3YjVcXHUyMDBjLVxcdTIwMGZcXHUyMDI4LVxcdTIwMmZcXHUyMDYwLVxcdTIwNmZcXHVmZWZmXFx1ZmZmMC1cXHVmZmZmXS9nLFxuICAgICAgICBlc2NhcGFibGUgPSAvW1xcXFxcXFwiXFx4MDAtXFx4MWZcXHg3Zi1cXHg5ZlxcdTAwYWRcXHUwNjAwLVxcdTA2MDRcXHUwNzBmXFx1MTdiNFxcdTE3YjVcXHUyMDBjLVxcdTIwMGZcXHUyMDI4LVxcdTIwMmZcXHUyMDYwLVxcdTIwNmZcXHVmZWZmXFx1ZmZmMC1cXHVmZmZmXS9nLFxuICAgICAgICBnYXAsXG4gICAgICAgIGluZGVudCxcbiAgICAgICAgbWV0YSA9IHsgLy8gdGFibGUgb2YgY2hhcmFjdGVyIHN1YnN0aXR1dGlvbnNcbiAgICAgICdcXGInOiAnXFxcXGInLFxuICAgICAgJ1xcdCc6ICdcXFxcdCcsXG4gICAgICAnXFxuJzogJ1xcXFxuJyxcbiAgICAgICdcXGYnOiAnXFxcXGYnLFxuICAgICAgJ1xccic6ICdcXFxccicsXG4gICAgICAnXCInOiAnXFxcXFwiJyxcbiAgICAgICdcXFxcJzogJ1xcXFxcXFxcJ1xuICAgIH0sXG4gICAgICAgIHJlcDtcblxuICAgIGZ1bmN0aW9uIHF1b3RlKHN0cmluZykge1xuXG4gICAgICAvLyBJZiB0aGUgc3RyaW5nIGNvbnRhaW5zIG5vIGNvbnRyb2wgY2hhcmFjdGVycywgbm8gcXVvdGUgY2hhcmFjdGVycywgYW5kIG5vXG4gICAgICAvLyBiYWNrc2xhc2ggY2hhcmFjdGVycywgdGhlbiB3ZSBjYW4gc2FmZWx5IHNsYXAgc29tZSBxdW90ZXMgYXJvdW5kIGl0LlxuICAgICAgLy8gT3RoZXJ3aXNlIHdlIG11c3QgYWxzbyByZXBsYWNlIHRoZSBvZmZlbmRpbmcgY2hhcmFjdGVycyB3aXRoIHNhZmUgZXNjYXBlXG4gICAgICAvLyBzZXF1ZW5jZXMuXG5cbiAgICAgIGVzY2FwYWJsZS5sYXN0SW5kZXggPSAwO1xuICAgICAgcmV0dXJuIGVzY2FwYWJsZS50ZXN0KHN0cmluZykgPyAnXCInICsgc3RyaW5nLnJlcGxhY2UoZXNjYXBhYmxlLCBmdW5jdGlvbiAoYSkge1xuICAgICAgICB2YXIgYyA9IG1ldGFbYV07XG4gICAgICAgIHJldHVybiB0eXBlb2YgYyA9PT0gJ3N0cmluZycgPyBjIDogJ1xcXFx1JyArICgnMDAwMCcgKyBhLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtNCk7XG4gICAgICB9KSArICdcIicgOiAnXCInICsgc3RyaW5nICsgJ1wiJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdHIoa2V5LCBob2xkZXIpIHtcblxuICAgICAgLy8gUHJvZHVjZSBhIHN0cmluZyBmcm9tIGhvbGRlcltrZXldLlxuXG4gICAgICB2YXIgaSxcbiAgICAgICAgICAvLyBUaGUgbG9vcCBjb3VudGVyLlxuICAgICAgayxcbiAgICAgICAgICAvLyBUaGUgbWVtYmVyIGtleS5cbiAgICAgIHYsXG4gICAgICAgICAgLy8gVGhlIG1lbWJlciB2YWx1ZS5cbiAgICAgIGxlbmd0aCxcbiAgICAgICAgICBtaW5kID0gZ2FwLFxuICAgICAgICAgIHBhcnRpYWwsXG4gICAgICAgICAgdmFsdWUgPSBob2xkZXJba2V5XTtcblxuICAgICAgLy8gSWYgdGhlIHZhbHVlIGhhcyBhIHRvSlNPTiBtZXRob2QsIGNhbGwgaXQgdG8gb2J0YWluIGEgcmVwbGFjZW1lbnQgdmFsdWUuXG5cbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgdmFsdWUgPSBkYXRlKGtleSk7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHdlIHdlcmUgY2FsbGVkIHdpdGggYSByZXBsYWNlciBmdW5jdGlvbiwgdGhlbiBjYWxsIHRoZSByZXBsYWNlciB0b1xuICAgICAgLy8gb2J0YWluIGEgcmVwbGFjZW1lbnQgdmFsdWUuXG5cbiAgICAgIGlmICh0eXBlb2YgcmVwID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhbHVlID0gcmVwLmNhbGwoaG9sZGVyLCBrZXksIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgLy8gV2hhdCBoYXBwZW5zIG5leHQgZGVwZW5kcyBvbiB0aGUgdmFsdWUncyB0eXBlLlxuXG4gICAgICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgIHJldHVybiBxdW90ZSh2YWx1ZSk7XG5cbiAgICAgICAgY2FzZSAnbnVtYmVyJzpcblxuICAgICAgICAgIC8vIEpTT04gbnVtYmVycyBtdXN0IGJlIGZpbml0ZS4gRW5jb2RlIG5vbi1maW5pdGUgbnVtYmVycyBhcyBudWxsLlxuXG4gICAgICAgICAgcmV0dXJuIGlzRmluaXRlKHZhbHVlKSA/IFN0cmluZyh2YWx1ZSkgOiAnbnVsbCc7XG5cbiAgICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgIGNhc2UgJ251bGwnOlxuXG4gICAgICAgICAgLy8gSWYgdGhlIHZhbHVlIGlzIGEgYm9vbGVhbiBvciBudWxsLCBjb252ZXJ0IGl0IHRvIGEgc3RyaW5nLiBOb3RlOlxuICAgICAgICAgIC8vIHR5cGVvZiBudWxsIGRvZXMgbm90IHByb2R1Y2UgJ251bGwnLiBUaGUgY2FzZSBpcyBpbmNsdWRlZCBoZXJlIGluXG4gICAgICAgICAgLy8gdGhlIHJlbW90ZSBjaGFuY2UgdGhhdCB0aGlzIGdldHMgZml4ZWQgc29tZWRheS5cblxuICAgICAgICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xuXG4gICAgICAgIC8vIElmIHRoZSB0eXBlIGlzICdvYmplY3QnLCB3ZSBtaWdodCBiZSBkZWFsaW5nIHdpdGggYW4gb2JqZWN0IG9yIGFuIGFycmF5IG9yXG4gICAgICAgIC8vIG51bGwuXG5cbiAgICAgICAgY2FzZSAnb2JqZWN0JzpcblxuICAgICAgICAgIC8vIER1ZSB0byBhIHNwZWNpZmljYXRpb24gYmx1bmRlciBpbiBFQ01BU2NyaXB0LCB0eXBlb2YgbnVsbCBpcyAnb2JqZWN0JyxcbiAgICAgICAgICAvLyBzbyB3YXRjaCBvdXQgZm9yIHRoYXQgY2FzZS5cblxuICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAnbnVsbCc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gTWFrZSBhbiBhcnJheSB0byBob2xkIHRoZSBwYXJ0aWFsIHJlc3VsdHMgb2Ygc3RyaW5naWZ5aW5nIHRoaXMgb2JqZWN0IHZhbHVlLlxuXG4gICAgICAgICAgZ2FwICs9IGluZGVudDtcbiAgICAgICAgICBwYXJ0aWFsID0gW107XG5cbiAgICAgICAgICAvLyBJcyB0aGUgdmFsdWUgYW4gYXJyYXk/XG5cbiAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5hcHBseSh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcblxuICAgICAgICAgICAgLy8gVGhlIHZhbHVlIGlzIGFuIGFycmF5LiBTdHJpbmdpZnkgZXZlcnkgZWxlbWVudC4gVXNlIG51bGwgYXMgYSBwbGFjZWhvbGRlclxuICAgICAgICAgICAgLy8gZm9yIG5vbi1KU09OIHZhbHVlcy5cblxuICAgICAgICAgICAgbGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgIHBhcnRpYWxbaV0gPSBzdHIoaSwgdmFsdWUpIHx8ICdudWxsJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSm9pbiBhbGwgb2YgdGhlIGVsZW1lbnRzIHRvZ2V0aGVyLCBzZXBhcmF0ZWQgd2l0aCBjb21tYXMsIGFuZCB3cmFwIHRoZW0gaW5cbiAgICAgICAgICAgIC8vIGJyYWNrZXRzLlxuXG4gICAgICAgICAgICB2ID0gcGFydGlhbC5sZW5ndGggPT09IDAgPyAnW10nIDogZ2FwID8gJ1tcXG4nICsgZ2FwICsgcGFydGlhbC5qb2luKCcsXFxuJyArIGdhcCkgKyAnXFxuJyArIG1pbmQgKyAnXScgOiAnWycgKyBwYXJ0aWFsLmpvaW4oJywnKSArICddJztcbiAgICAgICAgICAgIGdhcCA9IG1pbmQ7XG4gICAgICAgICAgICByZXR1cm4gdjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBJZiB0aGUgcmVwbGFjZXIgaXMgYW4gYXJyYXksIHVzZSBpdCB0byBzZWxlY3QgdGhlIG1lbWJlcnMgdG8gYmUgc3RyaW5naWZpZWQuXG5cbiAgICAgICAgICBpZiAocmVwICYmIHR5cGVvZiByZXAgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBsZW5ndGggPSByZXAubGVuZ3RoO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVwW2ldID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGsgPSByZXBbaV07XG4gICAgICAgICAgICAgICAgdiA9IHN0cihrLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKHYpIHtcbiAgICAgICAgICAgICAgICAgIHBhcnRpYWwucHVzaChxdW90ZShrKSArIChnYXAgPyAnOiAnIDogJzonKSArIHYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgaXRlcmF0ZSB0aHJvdWdoIGFsbCBvZiB0aGUga2V5cyBpbiB0aGUgb2JqZWN0LlxuXG4gICAgICAgICAgICBmb3IgKGsgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgaykpIHtcbiAgICAgICAgICAgICAgICB2ID0gc3RyKGssIHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAodikge1xuICAgICAgICAgICAgICAgICAgcGFydGlhbC5wdXNoKHF1b3RlKGspICsgKGdhcCA/ICc6ICcgOiAnOicpICsgdik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gSm9pbiBhbGwgb2YgdGhlIG1lbWJlciB0ZXh0cyB0b2dldGhlciwgc2VwYXJhdGVkIHdpdGggY29tbWFzLFxuICAgICAgICAgIC8vIGFuZCB3cmFwIHRoZW0gaW4gYnJhY2VzLlxuXG4gICAgICAgICAgdiA9IHBhcnRpYWwubGVuZ3RoID09PSAwID8gJ3t9JyA6IGdhcCA/ICd7XFxuJyArIGdhcCArIHBhcnRpYWwuam9pbignLFxcbicgKyBnYXApICsgJ1xcbicgKyBtaW5kICsgJ30nIDogJ3snICsgcGFydGlhbC5qb2luKCcsJykgKyAnfSc7XG4gICAgICAgICAgZ2FwID0gbWluZDtcbiAgICAgICAgICByZXR1cm4gdjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgSlNPTiBvYmplY3QgZG9lcyBub3QgeWV0IGhhdmUgYSBzdHJpbmdpZnkgbWV0aG9kLCBnaXZlIGl0IG9uZS5cblxuICAgIEpTT04uc3RyaW5naWZ5ID0gZnVuY3Rpb24gKHZhbHVlLCByZXBsYWNlciwgc3BhY2UpIHtcblxuICAgICAgLy8gVGhlIHN0cmluZ2lmeSBtZXRob2QgdGFrZXMgYSB2YWx1ZSBhbmQgYW4gb3B0aW9uYWwgcmVwbGFjZXIsIGFuZCBhbiBvcHRpb25hbFxuICAgICAgLy8gc3BhY2UgcGFyYW1ldGVyLCBhbmQgcmV0dXJucyBhIEpTT04gdGV4dC4gVGhlIHJlcGxhY2VyIGNhbiBiZSBhIGZ1bmN0aW9uXG4gICAgICAvLyB0aGF0IGNhbiByZXBsYWNlIHZhbHVlcywgb3IgYW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0IHdpbGwgc2VsZWN0IHRoZSBrZXlzLlxuICAgICAgLy8gQSBkZWZhdWx0IHJlcGxhY2VyIG1ldGhvZCBjYW4gYmUgcHJvdmlkZWQuIFVzZSBvZiB0aGUgc3BhY2UgcGFyYW1ldGVyIGNhblxuICAgICAgLy8gcHJvZHVjZSB0ZXh0IHRoYXQgaXMgbW9yZSBlYXNpbHkgcmVhZGFibGUuXG5cbiAgICAgIHZhciBpO1xuICAgICAgZ2FwID0gJyc7XG4gICAgICBpbmRlbnQgPSAnJztcblxuICAgICAgLy8gSWYgdGhlIHNwYWNlIHBhcmFtZXRlciBpcyBhIG51bWJlciwgbWFrZSBhbiBpbmRlbnQgc3RyaW5nIGNvbnRhaW5pbmcgdGhhdFxuICAgICAgLy8gbWFueSBzcGFjZXMuXG5cbiAgICAgIGlmICh0eXBlb2Ygc3BhY2UgPT09ICdudW1iZXInKSB7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBzcGFjZTsgaSArPSAxKSB7XG4gICAgICAgICAgaW5kZW50ICs9ICcgJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZSBzcGFjZSBwYXJhbWV0ZXIgaXMgYSBzdHJpbmcsIGl0IHdpbGwgYmUgdXNlZCBhcyB0aGUgaW5kZW50IHN0cmluZy5cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHNwYWNlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGluZGVudCA9IHNwYWNlO1xuICAgICAgICB9XG5cbiAgICAgIC8vIElmIHRoZXJlIGlzIGEgcmVwbGFjZXIsIGl0IG11c3QgYmUgYSBmdW5jdGlvbiBvciBhbiBhcnJheS5cbiAgICAgIC8vIE90aGVyd2lzZSwgdGhyb3cgYW4gZXJyb3IuXG5cbiAgICAgIHJlcCA9IHJlcGxhY2VyO1xuICAgICAgaWYgKHJlcGxhY2VyICYmIHR5cGVvZiByZXBsYWNlciAhPT0gJ2Z1bmN0aW9uJyAmJiAodHlwZW9mIHJlcGxhY2VyICE9PSAnb2JqZWN0JyB8fCB0eXBlb2YgcmVwbGFjZXIubGVuZ3RoICE9PSAnbnVtYmVyJykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdKU09OLnN0cmluZ2lmeScpO1xuICAgICAgfVxuXG4gICAgICAvLyBNYWtlIGEgZmFrZSByb290IG9iamVjdCBjb250YWluaW5nIG91ciB2YWx1ZSB1bmRlciB0aGUga2V5IG9mICcnLlxuICAgICAgLy8gUmV0dXJuIHRoZSByZXN1bHQgb2Ygc3RyaW5naWZ5aW5nIHRoZSB2YWx1ZS5cblxuICAgICAgcmV0dXJuIHN0cignJywgeyAnJzogdmFsdWUgfSk7XG4gICAgfTtcblxuICAgIC8vIElmIHRoZSBKU09OIG9iamVjdCBkb2VzIG5vdCB5ZXQgaGF2ZSBhIHBhcnNlIG1ldGhvZCwgZ2l2ZSBpdCBvbmUuXG5cbiAgICBKU09OLnBhcnNlID0gZnVuY3Rpb24gKHRleHQsIHJldml2ZXIpIHtcbiAgICAgIC8vIFRoZSBwYXJzZSBtZXRob2QgdGFrZXMgYSB0ZXh0IGFuZCBhbiBvcHRpb25hbCByZXZpdmVyIGZ1bmN0aW9uLCBhbmQgcmV0dXJuc1xuICAgICAgLy8gYSBKYXZhU2NyaXB0IHZhbHVlIGlmIHRoZSB0ZXh0IGlzIGEgdmFsaWQgSlNPTiB0ZXh0LlxuXG4gICAgICB2YXIgajtcblxuICAgICAgZnVuY3Rpb24gd2Fsayhob2xkZXIsIGtleSkge1xuXG4gICAgICAgIC8vIFRoZSB3YWxrIG1ldGhvZCBpcyB1c2VkIHRvIHJlY3Vyc2l2ZWx5IHdhbGsgdGhlIHJlc3VsdGluZyBzdHJ1Y3R1cmUgc29cbiAgICAgICAgLy8gdGhhdCBtb2RpZmljYXRpb25zIGNhbiBiZSBtYWRlLlxuXG4gICAgICAgIHZhciBrLFxuICAgICAgICAgICAgdixcbiAgICAgICAgICAgIHZhbHVlID0gaG9sZGVyW2tleV07XG4gICAgICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgZm9yIChrIGluIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrKSkge1xuICAgICAgICAgICAgICB2ID0gd2Fsayh2YWx1ZSwgayk7XG4gICAgICAgICAgICAgIGlmICh2ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZVtrXSA9IHY7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHZhbHVlW2tdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXZpdmVyLmNhbGwoaG9sZGVyLCBrZXksIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgLy8gUGFyc2luZyBoYXBwZW5zIGluIGZvdXIgc3RhZ2VzLiBJbiB0aGUgZmlyc3Qgc3RhZ2UsIHdlIHJlcGxhY2UgY2VydGFpblxuICAgICAgLy8gVW5pY29kZSBjaGFyYWN0ZXJzIHdpdGggZXNjYXBlIHNlcXVlbmNlcy4gSmF2YVNjcmlwdCBoYW5kbGVzIG1hbnkgY2hhcmFjdGVyc1xuICAgICAgLy8gaW5jb3JyZWN0bHksIGVpdGhlciBzaWxlbnRseSBkZWxldGluZyB0aGVtLCBvciB0cmVhdGluZyB0aGVtIGFzIGxpbmUgZW5kaW5ncy5cblxuICAgICAgdGV4dCA9IFN0cmluZyh0ZXh0KTtcbiAgICAgIGN4Lmxhc3RJbmRleCA9IDA7XG4gICAgICBpZiAoY3gudGVzdCh0ZXh0KSkge1xuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKGN4LCBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgIHJldHVybiAnXFxcXHUnICsgKCcwMDAwJyArIGEuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnNsaWNlKC00KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIEluIHRoZSBzZWNvbmQgc3RhZ2UsIHdlIHJ1biB0aGUgdGV4dCBhZ2FpbnN0IHJlZ3VsYXIgZXhwcmVzc2lvbnMgdGhhdCBsb29rXG4gICAgICAvLyBmb3Igbm9uLUpTT04gcGF0dGVybnMuIFdlIGFyZSBlc3BlY2lhbGx5IGNvbmNlcm5lZCB3aXRoICcoKScgYW5kICduZXcnXG4gICAgICAvLyBiZWNhdXNlIHRoZXkgY2FuIGNhdXNlIGludm9jYXRpb24sIGFuZCAnPScgYmVjYXVzZSBpdCBjYW4gY2F1c2UgbXV0YXRpb24uXG4gICAgICAvLyBCdXQganVzdCB0byBiZSBzYWZlLCB3ZSB3YW50IHRvIHJlamVjdCBhbGwgdW5leHBlY3RlZCBmb3Jtcy5cblxuICAgICAgLy8gV2Ugc3BsaXQgdGhlIHNlY29uZCBzdGFnZSBpbnRvIDQgcmVnZXhwIG9wZXJhdGlvbnMgaW4gb3JkZXIgdG8gd29yayBhcm91bmRcbiAgICAgIC8vIGNyaXBwbGluZyBpbmVmZmljaWVuY2llcyBpbiBJRSdzIGFuZCBTYWZhcmkncyByZWdleHAgZW5naW5lcy4gRmlyc3Qgd2VcbiAgICAgIC8vIHJlcGxhY2UgdGhlIEpTT04gYmFja3NsYXNoIHBhaXJzIHdpdGggJ0AnIChhIG5vbi1KU09OIGNoYXJhY3RlcikuIFNlY29uZCwgd2VcbiAgICAgIC8vIHJlcGxhY2UgYWxsIHNpbXBsZSB2YWx1ZSB0b2tlbnMgd2l0aCAnXScgY2hhcmFjdGVycy4gVGhpcmQsIHdlIGRlbGV0ZSBhbGxcbiAgICAgIC8vIG9wZW4gYnJhY2tldHMgdGhhdCBmb2xsb3cgYSBjb2xvbiBvciBjb21tYSBvciB0aGF0IGJlZ2luIHRoZSB0ZXh0LiBGaW5hbGx5LFxuICAgICAgLy8gd2UgbG9vayB0byBzZWUgdGhhdCB0aGUgcmVtYWluaW5nIGNoYXJhY3RlcnMgYXJlIG9ubHkgd2hpdGVzcGFjZSBvciAnXScgb3JcbiAgICAgIC8vICcsJyBvciAnOicgb3IgJ3snIG9yICd9Jy4gSWYgdGhhdCBpcyBzbywgdGhlbiB0aGUgdGV4dCBpcyBzYWZlIGZvciBldmFsLlxuXG4gICAgICBpZiAoL15bXFxdLDp7fVxcc10qJC8udGVzdCh0ZXh0LnJlcGxhY2UoL1xcXFwoPzpbXCJcXFxcXFwvYmZucnRdfHVbMC05YS1mQS1GXXs0fSkvZywgJ0AnKS5yZXBsYWNlKC9cIlteXCJcXFxcXFxuXFxyXSpcInx0cnVlfGZhbHNlfG51bGx8LT9cXGQrKD86XFwuXFxkKik/KD86W2VFXVsrXFwtXT9cXGQrKT8vZywgJ10nKS5yZXBsYWNlKC8oPzpefDp8LCkoPzpcXHMqXFxbKSsvZywgJycpKSkge1xuXG4gICAgICAgIC8vIEluIHRoZSB0aGlyZCBzdGFnZSB3ZSB1c2UgdGhlIGV2YWwgZnVuY3Rpb24gdG8gY29tcGlsZSB0aGUgdGV4dCBpbnRvIGFcbiAgICAgICAgLy8gSmF2YVNjcmlwdCBzdHJ1Y3R1cmUuIFRoZSAneycgb3BlcmF0b3IgaXMgc3ViamVjdCB0byBhIHN5bnRhY3RpYyBhbWJpZ3VpdHlcbiAgICAgICAgLy8gaW4gSmF2YVNjcmlwdDogaXQgY2FuIGJlZ2luIGEgYmxvY2sgb3IgYW4gb2JqZWN0IGxpdGVyYWwuIFdlIHdyYXAgdGhlIHRleHRcbiAgICAgICAgLy8gaW4gcGFyZW5zIHRvIGVsaW1pbmF0ZSB0aGUgYW1iaWd1aXR5LlxuXG4gICAgICAgIGogPSBldmFsKCcoJyArIHRleHQgKyAnKScpO1xuXG4gICAgICAgIC8vIEluIHRoZSBvcHRpb25hbCBmb3VydGggc3RhZ2UsIHdlIHJlY3Vyc2l2ZWx5IHdhbGsgdGhlIG5ldyBzdHJ1Y3R1cmUsIHBhc3NpbmdcbiAgICAgICAgLy8gZWFjaCBuYW1lL3ZhbHVlIHBhaXIgdG8gYSByZXZpdmVyIGZ1bmN0aW9uIGZvciBwb3NzaWJsZSB0cmFuc2Zvcm1hdGlvbi5cblxuICAgICAgICByZXR1cm4gdHlwZW9mIHJldml2ZXIgPT09ICdmdW5jdGlvbicgPyB3YWxrKHsgJyc6IGogfSwgJycpIDogajtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgdGhlIHRleHQgaXMgbm90IEpTT04gcGFyc2VhYmxlLCB0aGVuIGEgU3ludGF4RXJyb3IgaXMgdGhyb3duLlxuXG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ0pTT04ucGFyc2UnKTtcbiAgICB9O1xuICB9KSgndW5kZWZpbmVkJyAhPSB0eXBlb2YgaW8gPyBpbyA6IG1vZHVsZS5leHBvcnRzLCB0eXBlb2YgSlNPTiAhPT0gJ3VuZGVmaW5lZCcgPyBKU09OIDogdW5kZWZpbmVkKTtcblxuICAvKipcbiAgICogc29ja2V0LmlvXG4gICAqIENvcHlyaWdodChjKSAyMDExIExlYXJuQm9vc3QgPGRldkBsZWFybmJvb3N0LmNvbT5cbiAgICogTUlUIExpY2Vuc2VkXG4gICAqL1xuXG4gIChmdW5jdGlvbiAoZXhwb3J0cywgaW8pIHtcblxuICAgIC8qKlxuICAgICAqIFBhcnNlciBuYW1lc3BhY2UuXG4gICAgICpcbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICovXG5cbiAgICB2YXIgcGFyc2VyID0gZXhwb3J0cy5wYXJzZXIgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIFBhY2tldCB0eXBlcy5cbiAgICAgKi9cblxuICAgIHZhciBwYWNrZXRzID0gcGFyc2VyLnBhY2tldHMgPSBbJ2Rpc2Nvbm5lY3QnLCAnY29ubmVjdCcsICdoZWFydGJlYXQnLCAnbWVzc2FnZScsICdqc29uJywgJ2V2ZW50JywgJ2FjaycsICdlcnJvcicsICdub29wJ107XG5cbiAgICAvKipcbiAgICAgKiBFcnJvcnMgcmVhc29ucy5cbiAgICAgKi9cblxuICAgIHZhciByZWFzb25zID0gcGFyc2VyLnJlYXNvbnMgPSBbJ3RyYW5zcG9ydCBub3Qgc3VwcG9ydGVkJywgJ2NsaWVudCBub3QgaGFuZHNoYWtlbicsICd1bmF1dGhvcml6ZWQnXTtcblxuICAgIC8qKlxuICAgICAqIEVycm9ycyBhZHZpY2UuXG4gICAgICovXG5cbiAgICB2YXIgYWR2aWNlID0gcGFyc2VyLmFkdmljZSA9IFsncmVjb25uZWN0J107XG5cbiAgICAvKipcbiAgICAgKiBTaG9ydGN1dHMuXG4gICAgICovXG5cbiAgICB2YXIgSlNPTiA9IGlvLkpTT04sXG4gICAgICAgIGluZGV4T2YgPSBpby51dGlsLmluZGV4T2Y7XG5cbiAgICAvKipcbiAgICAgKiBFbmNvZGVzIGEgcGFja2V0LlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgICBwYXJzZXIuZW5jb2RlUGFja2V0ID0gZnVuY3Rpb24gKHBhY2tldCkge1xuICAgICAgdmFyIHR5cGUgPSBpbmRleE9mKHBhY2tldHMsIHBhY2tldC50eXBlKSxcbiAgICAgICAgICBpZCA9IHBhY2tldC5pZCB8fCAnJyxcbiAgICAgICAgICBlbmRwb2ludCA9IHBhY2tldC5lbmRwb2ludCB8fCAnJyxcbiAgICAgICAgICBhY2sgPSBwYWNrZXQuYWNrLFxuICAgICAgICAgIGRhdGEgPSBudWxsO1xuXG4gICAgICBzd2l0Y2ggKHBhY2tldC50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2Vycm9yJzpcbiAgICAgICAgICB2YXIgcmVhc29uID0gcGFja2V0LnJlYXNvbiA/IGluZGV4T2YocmVhc29ucywgcGFja2V0LnJlYXNvbikgOiAnJyxcbiAgICAgICAgICAgICAgYWR2ID0gcGFja2V0LmFkdmljZSA/IGluZGV4T2YoYWR2aWNlLCBwYWNrZXQuYWR2aWNlKSA6ICcnO1xuXG4gICAgICAgICAgaWYgKHJlYXNvbiAhPT0gJycgfHwgYWR2ICE9PSAnJykgZGF0YSA9IHJlYXNvbiArIChhZHYgIT09ICcnID8gJysnICsgYWR2IDogJycpO1xuXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnbWVzc2FnZSc6XG4gICAgICAgICAgaWYgKHBhY2tldC5kYXRhICE9PSAnJykgZGF0YSA9IHBhY2tldC5kYXRhO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2V2ZW50JzpcbiAgICAgICAgICB2YXIgZXYgPSB7IG5hbWU6IHBhY2tldC5uYW1lIH07XG5cbiAgICAgICAgICBpZiAocGFja2V0LmFyZ3MgJiYgcGFja2V0LmFyZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgICBldi5hcmdzID0gcGFja2V0LmFyZ3M7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGF0YSA9IEpTT04uc3RyaW5naWZ5KGV2KTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdqc29uJzpcbiAgICAgICAgICBkYXRhID0gSlNPTi5zdHJpbmdpZnkocGFja2V0LmRhdGEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2Nvbm5lY3QnOlxuICAgICAgICAgIGlmIChwYWNrZXQucXMpIGRhdGEgPSBwYWNrZXQucXM7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnYWNrJzpcbiAgICAgICAgICBkYXRhID0gcGFja2V0LmFja0lkICsgKHBhY2tldC5hcmdzICYmIHBhY2tldC5hcmdzLmxlbmd0aCA/ICcrJyArIEpTT04uc3RyaW5naWZ5KHBhY2tldC5hcmdzKSA6ICcnKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgLy8gY29uc3RydWN0IHBhY2tldCB3aXRoIHJlcXVpcmVkIGZyYWdtZW50c1xuICAgICAgdmFyIGVuY29kZWQgPSBbdHlwZSwgaWQgKyAoYWNrID09ICdkYXRhJyA/ICcrJyA6ICcnKSwgZW5kcG9pbnRdO1xuXG4gICAgICAvLyBkYXRhIGZyYWdtZW50IGlzIG9wdGlvbmFsXG4gICAgICBpZiAoZGF0YSAhPT0gbnVsbCAmJiBkYXRhICE9PSB1bmRlZmluZWQpIGVuY29kZWQucHVzaChkYXRhKTtcblxuICAgICAgcmV0dXJuIGVuY29kZWQuam9pbignOicpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBFbmNvZGVzIG11bHRpcGxlIG1lc3NhZ2VzIChwYXlsb2FkKS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IG1lc3NhZ2VzXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgICBwYXJzZXIuZW5jb2RlUGF5bG9hZCA9IGZ1bmN0aW9uIChwYWNrZXRzKSB7XG4gICAgICB2YXIgZGVjb2RlZCA9ICcnO1xuXG4gICAgICBpZiAocGFja2V0cy5sZW5ndGggPT0gMSkgcmV0dXJuIHBhY2tldHNbMF07XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gcGFja2V0cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFyIHBhY2tldCA9IHBhY2tldHNbaV07XG4gICAgICAgIGRlY29kZWQgKz0gJ++/vScgKyBwYWNrZXQubGVuZ3RoICsgJ++/vScgKyBwYWNrZXRzW2ldO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZGVjb2RlZDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRGVjb2RlcyBhIHBhY2tldFxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgICB2YXIgcmVnZXhwID0gLyhbXjpdKyk6KFswLTldKyk/KFxcKyk/OihbXjpdKyk/Oj8oW1xcc1xcU10qKT8vO1xuXG4gICAgcGFyc2VyLmRlY29kZVBhY2tldCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICB2YXIgcGllY2VzID0gZGF0YS5tYXRjaChyZWdleHApO1xuXG4gICAgICBpZiAoIXBpZWNlcykgcmV0dXJuIHt9O1xuXG4gICAgICB2YXIgaWQgPSBwaWVjZXNbMl0gfHwgJycsXG4gICAgICAgICAgZGF0YSA9IHBpZWNlc1s1XSB8fCAnJyxcbiAgICAgICAgICBwYWNrZXQgPSB7XG4gICAgICAgIHR5cGU6IHBhY2tldHNbcGllY2VzWzFdXSxcbiAgICAgICAgZW5kcG9pbnQ6IHBpZWNlc1s0XSB8fCAnJ1xuICAgICAgfTtcblxuICAgICAgLy8gd2hldGhlciB3ZSBuZWVkIHRvIGFja25vd2xlZGdlIHRoZSBwYWNrZXRcbiAgICAgIGlmIChpZCkge1xuICAgICAgICBwYWNrZXQuaWQgPSBpZDtcbiAgICAgICAgaWYgKHBpZWNlc1szXSkgcGFja2V0LmFjayA9ICdkYXRhJztlbHNlIHBhY2tldC5hY2sgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBoYW5kbGUgZGlmZmVyZW50IHBhY2tldCB0eXBlc1xuICAgICAgc3dpdGNoIChwYWNrZXQudHlwZSkge1xuICAgICAgICBjYXNlICdlcnJvcic6XG4gICAgICAgICAgdmFyIHBpZWNlcyA9IGRhdGEuc3BsaXQoJysnKTtcbiAgICAgICAgICBwYWNrZXQucmVhc29uID0gcmVhc29uc1twaWVjZXNbMF1dIHx8ICcnO1xuICAgICAgICAgIHBhY2tldC5hZHZpY2UgPSBhZHZpY2VbcGllY2VzWzFdXSB8fCAnJztcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdtZXNzYWdlJzpcbiAgICAgICAgICBwYWNrZXQuZGF0YSA9IGRhdGEgfHwgJyc7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnZXZlbnQnOlxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgb3B0cyA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgICAgICBwYWNrZXQubmFtZSA9IG9wdHMubmFtZTtcbiAgICAgICAgICAgIHBhY2tldC5hcmdzID0gb3B0cy5hcmdzO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG5cbiAgICAgICAgICBwYWNrZXQuYXJncyA9IHBhY2tldC5hcmdzIHx8IFtdO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2pzb24nOlxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwYWNrZXQuZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdjb25uZWN0JzpcbiAgICAgICAgICBwYWNrZXQucXMgPSBkYXRhIHx8ICcnO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2Fjayc6XG4gICAgICAgICAgdmFyIHBpZWNlcyA9IGRhdGEubWF0Y2goL14oWzAtOV0rKShcXCspPyguKikvKTtcbiAgICAgICAgICBpZiAocGllY2VzKSB7XG4gICAgICAgICAgICBwYWNrZXQuYWNrSWQgPSBwaWVjZXNbMV07XG4gICAgICAgICAgICBwYWNrZXQuYXJncyA9IFtdO1xuXG4gICAgICAgICAgICBpZiAocGllY2VzWzNdKSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcGFja2V0LmFyZ3MgPSBwaWVjZXNbM10gPyBKU09OLnBhcnNlKHBpZWNlc1szXSkgOiBbXTtcbiAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnZGlzY29ubmVjdCc6XG4gICAgICAgIGNhc2UgJ2hlYXJ0YmVhdCc6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gcGFja2V0O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBEZWNvZGVzIGRhdGEgcGF5bG9hZC4gRGV0ZWN0cyBtdWx0aXBsZSBtZXNzYWdlc1xuICAgICAqXG4gICAgICogQHJldHVybiB7QXJyYXl9IG1lc3NhZ2VzXG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cblxuICAgIHBhcnNlci5kZWNvZGVQYXlsb2FkID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIC8vIElFIGRvZXNuJ3QgbGlrZSBkYXRhW2ldIGZvciB1bmljb2RlIGNoYXJzLCBjaGFyQXQgd29ya3MgZmluZVxuICAgICAgaWYgKGRhdGEuY2hhckF0KDApID09ICfvv70nKSB7XG4gICAgICAgIHZhciByZXQgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMSwgbGVuZ3RoID0gJyc7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGRhdGEuY2hhckF0KGkpID09ICfvv70nKSB7XG4gICAgICAgICAgICByZXQucHVzaChwYXJzZXIuZGVjb2RlUGFja2V0KGRhdGEuc3Vic3RyKGkgKyAxKS5zdWJzdHIoMCwgbGVuZ3RoKSkpO1xuICAgICAgICAgICAgaSArPSBOdW1iZXIobGVuZ3RoKSArIDE7XG4gICAgICAgICAgICBsZW5ndGggPSAnJztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGVuZ3RoICs9IGRhdGEuY2hhckF0KGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gW3BhcnNlci5kZWNvZGVQYWNrZXQoZGF0YSldO1xuICAgICAgfVxuICAgIH07XG4gIH0pKCd1bmRlZmluZWQnICE9IHR5cGVvZiBpbyA/IGlvIDogbW9kdWxlLmV4cG9ydHMsICd1bmRlZmluZWQnICE9IHR5cGVvZiBpbyA/IGlvIDogbW9kdWxlLnBhcmVudC5leHBvcnRzKTtcbiAgLyoqXG4gICAqIHNvY2tldC5pb1xuICAgKiBDb3B5cmlnaHQoYykgMjAxMSBMZWFybkJvb3N0IDxkZXZAbGVhcm5ib29zdC5jb20+XG4gICAqIE1JVCBMaWNlbnNlZFxuICAgKi9cblxuICAoZnVuY3Rpb24gKGV4cG9ydHMsIGlvKSB7XG5cbiAgICAvKipcbiAgICAgKiBFeHBvc2UgY29uc3RydWN0b3IuXG4gICAgICovXG5cbiAgICBleHBvcnRzLlRyYW5zcG9ydCA9IFRyYW5zcG9ydDtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgaXMgdGhlIHRyYW5zcG9ydCB0ZW1wbGF0ZSBmb3IgYWxsIHN1cHBvcnRlZCB0cmFuc3BvcnQgbWV0aG9kcy5cbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG5cbiAgICBmdW5jdGlvbiBUcmFuc3BvcnQoc29ja2V0LCBzZXNzaWQpIHtcbiAgICAgIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuICAgICAgdGhpcy5zZXNzaWQgPSBzZXNzaWQ7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFwcGx5IEV2ZW50RW1pdHRlciBtaXhpbi5cbiAgICAgKi9cblxuICAgIGlvLnV0aWwubWl4aW4oVHJhbnNwb3J0LCBpby5FdmVudEVtaXR0ZXIpO1xuXG4gICAgLyoqXG4gICAgICogSW5kaWNhdGVzIHdoZXRoZXIgaGVhcnRiZWF0cyBpcyBlbmFibGVkIGZvciB0aGlzIHRyYW5zcG9ydFxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgICBUcmFuc3BvcnQucHJvdG90eXBlLmhlYXJ0YmVhdHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogSGFuZGxlcyB0aGUgcmVzcG9uc2UgZnJvbSB0aGUgc2VydmVyLiBXaGVuIGEgbmV3IHJlc3BvbnNlIGlzIHJlY2VpdmVkXG4gICAgICogaXQgd2lsbCBhdXRvbWF0aWNhbGx5IHVwZGF0ZSB0aGUgdGltZW91dCwgZGVjb2RlIHRoZSBtZXNzYWdlIGFuZFxuICAgICAqIGZvcndhcmRzIHRoZSByZXNwb25zZSB0byB0aGUgb25NZXNzYWdlIGZ1bmN0aW9uIGZvciBmdXJ0aGVyIHByb2Nlc3NpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YSBSZXNwb25zZSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgICBUcmFuc3BvcnQucHJvdG90eXBlLm9uRGF0YSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICB0aGlzLmNsZWFyQ2xvc2VUaW1lb3V0KCk7XG5cbiAgICAgIC8vIElmIHRoZSBjb25uZWN0aW9uIGluIGN1cnJlbnRseSBvcGVuIChvciBpbiBhIHJlb3BlbmluZyBzdGF0ZSkgcmVzZXQgdGhlIGNsb3NlXG4gICAgICAvLyB0aW1lb3V0IHNpbmNlIHdlIGhhdmUganVzdCByZWNlaXZlZCBkYXRhLiBUaGlzIGNoZWNrIGlzIG5lY2Vzc2FyeSBzb1xuICAgICAgLy8gdGhhdCB3ZSBkb24ndCByZXNldCB0aGUgdGltZW91dCBvbiBhbiBleHBsaWNpdGx5IGRpc2Nvbm5lY3RlZCBjb25uZWN0aW9uLlxuICAgICAgaWYgKHRoaXMuc29ja2V0LmNvbm5lY3RlZCB8fCB0aGlzLnNvY2tldC5jb25uZWN0aW5nIHx8IHRoaXMuc29ja2V0LnJlY29ubmVjdGluZykge1xuICAgICAgICB0aGlzLnNldENsb3NlVGltZW91dCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGF0YSAhPT0gJycpIHtcbiAgICAgICAgLy8gdG9kbzogd2Ugc2hvdWxkIG9ubHkgZG8gZGVjb2RlUGF5bG9hZCBmb3IgeGhyIHRyYW5zcG9ydHNcbiAgICAgICAgdmFyIG1zZ3MgPSBpby5wYXJzZXIuZGVjb2RlUGF5bG9hZChkYXRhKTtcblxuICAgICAgICBpZiAobXNncyAmJiBtc2dzLmxlbmd0aCkge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gbXNncy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMub25QYWNrZXQobXNnc1tpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIHBhY2tldHMuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICAgIFRyYW5zcG9ydC5wcm90b3R5cGUub25QYWNrZXQgPSBmdW5jdGlvbiAocGFja2V0KSB7XG4gICAgICB0aGlzLnNvY2tldC5zZXRIZWFydGJlYXRUaW1lb3V0KCk7XG5cbiAgICAgIGlmIChwYWNrZXQudHlwZSA9PSAnaGVhcnRiZWF0Jykge1xuICAgICAgICByZXR1cm4gdGhpcy5vbkhlYXJ0YmVhdCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFja2V0LnR5cGUgPT0gJ2Nvbm5lY3QnICYmIHBhY2tldC5lbmRwb2ludCA9PSAnJykge1xuICAgICAgICB0aGlzLm9uQ29ubmVjdCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFja2V0LnR5cGUgPT0gJ2Vycm9yJyAmJiBwYWNrZXQuYWR2aWNlID09ICdyZWNvbm5lY3QnKSB7XG4gICAgICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc29ja2V0Lm9uUGFja2V0KHBhY2tldCk7XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIGNsb3NlIHRpbWVvdXRcbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gICAgVHJhbnNwb3J0LnByb3RvdHlwZS5zZXRDbG9zZVRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXRoaXMuY2xvc2VUaW1lb3V0KSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICB0aGlzLmNsb3NlVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYub25EaXNjb25uZWN0KCk7XG4gICAgICAgIH0sIHRoaXMuc29ja2V0LmNsb3NlVGltZW91dCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIHRyYW5zcG9ydCBkaXNjb25uZWN0cy5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gICAgVHJhbnNwb3J0LnByb3RvdHlwZS5vbkRpc2Nvbm5lY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5pc09wZW4pIHRoaXMuY2xvc2UoKTtcbiAgICAgIHRoaXMuY2xlYXJUaW1lb3V0cygpO1xuICAgICAgdGhpcy5zb2NrZXQub25EaXNjb25uZWN0KCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gdHJhbnNwb3J0IGNvbm5lY3RzXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICAgIFRyYW5zcG9ydC5wcm90b3R5cGUub25Db25uZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5zb2NrZXQub25Db25uZWN0KCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2xlYXJzIGNsb3NlIHRpbWVvdXRcbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gICAgVHJhbnNwb3J0LnByb3RvdHlwZS5jbGVhckNsb3NlVGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLmNsb3NlVGltZW91dCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5jbG9zZVRpbWVvdXQpO1xuICAgICAgICB0aGlzLmNsb3NlVGltZW91dCA9IG51bGw7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENsZWFyIHRpbWVvdXRzXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICAgIFRyYW5zcG9ydC5wcm90b3R5cGUuY2xlYXJUaW1lb3V0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuY2xlYXJDbG9zZVRpbWVvdXQoKTtcblxuICAgICAgaWYgKHRoaXMucmVvcGVuVGltZW91dCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5yZW9wZW5UaW1lb3V0KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2VuZHMgYSBwYWNrZXRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYWNrZXQgb2JqZWN0LlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gICAgVHJhbnNwb3J0LnByb3RvdHlwZS5wYWNrZXQgPSBmdW5jdGlvbiAocGFja2V0KSB7XG4gICAgICB0aGlzLnNlbmQoaW8ucGFyc2VyLmVuY29kZVBhY2tldChwYWNrZXQpKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2VuZCB0aGUgcmVjZWl2ZWQgaGVhcnRiZWF0IG1lc3NhZ2UgYmFjayB0byBzZXJ2ZXIuIFNvIHRoZSBzZXJ2ZXJcbiAgICAgKiBrbm93cyB3ZSBhcmUgc3RpbGwgY29ubmVjdGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGhlYXJ0YmVhdCBIZWFydGJlYXQgcmVzcG9uc2UgZnJvbSB0aGUgc2VydmVyLlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gICAgVHJhbnNwb3J0LnByb3RvdHlwZS5vbkhlYXJ0YmVhdCA9IGZ1bmN0aW9uIChoZWFydGJlYXQpIHtcbiAgICAgIHRoaXMucGFja2V0KHsgdHlwZTogJ2hlYXJ0YmVhdCcgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIHRoZSB0cmFuc3BvcnQgb3BlbnMuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICAgIFRyYW5zcG9ydC5wcm90b3R5cGUub25PcGVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5pc09wZW4gPSB0cnVlO1xuICAgICAgdGhpcy5jbGVhckNsb3NlVGltZW91dCgpO1xuICAgICAgdGhpcy5zb2NrZXQub25PcGVuKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIE5vdGlmaWVzIHRoZSBiYXNlIHdoZW4gdGhlIGNvbm5lY3Rpb24gd2l0aCB0aGUgU29ja2V0LklPIHNlcnZlclxuICAgICAqIGhhcyBiZWVuIGRpc2Nvbm5lY3RlZC5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gICAgVHJhbnNwb3J0LnByb3RvdHlwZS5vbkNsb3NlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAvKiBGSVhNRTogcmVvcGVuIGRlbGF5IGNhdXNpbmcgYSBpbmZpbml0IGxvb3BcbiAgICAgIHRoaXMucmVvcGVuVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLm9wZW4oKTtcbiAgICAgIH0sIHRoaXMuc29ja2V0Lm9wdGlvbnNbJ3Jlb3BlbiBkZWxheSddKTsqL1xuXG4gICAgICB0aGlzLmlzT3BlbiA9IGZhbHNlO1xuICAgICAgdGhpcy5zb2NrZXQub25DbG9zZSgpO1xuICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogR2VuZXJhdGVzIGEgY29ubmVjdGlvbiB1cmwgYmFzZWQgb24gdGhlIFNvY2tldC5JTyBVUkwgUHJvdG9jb2wuXG4gICAgICogU2VlIDxodHRwczovL2dpdGh1Yi5jb20vbGVhcm5ib29zdC9zb2NrZXQuaW8tbm9kZS8+IGZvciBtb3JlIGRldGFpbHMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSBDb25uZWN0aW9uIHVybFxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gICAgVHJhbnNwb3J0LnByb3RvdHlwZS5wcmVwYXJlVXJsID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLnNvY2tldC5vcHRpb25zO1xuXG4gICAgICByZXR1cm4gdGhpcy5zY2hlbWUoKSArICc6Ly8nICsgb3B0aW9ucy5ob3N0ICsgJzonICsgb3B0aW9ucy5wb3J0ICsgJy8nICsgb3B0aW9ucy5yZXNvdXJjZSArICcvJyArIGlvLnByb3RvY29sICsgJy8nICsgdGhpcy5uYW1lICsgJy8nICsgdGhpcy5zZXNzaWQ7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgdHJhbnNwb3J0IGlzIHJlYWR5IHRvIHN0YXJ0IGEgY29ubmVjdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U29ja2V0fSBzb2NrZXQgVGhlIHNvY2tldCBpbnN0YW5jZSB0aGF0IG5lZWRzIGEgdHJhbnNwb3J0XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGNhbGxiYWNrXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgICBUcmFuc3BvcnQucHJvdG90eXBlLnJlYWR5ID0gZnVuY3Rpb24gKHNvY2tldCwgZm4pIHtcbiAgICAgIGZuLmNhbGwodGhpcyk7XG4gICAgfTtcbiAgfSkoJ3VuZGVmaW5lZCcgIT0gdHlwZW9mIGlvID8gaW8gOiBtb2R1bGUuZXhwb3J0cywgJ3VuZGVmaW5lZCcgIT0gdHlwZW9mIGlvID8gaW8gOiBtb2R1bGUucGFyZW50LmV4cG9ydHMpO1xuICAvKipcbiAgICogc29ja2V0LmlvXG4gICAqIENvcHlyaWdodChjKSAyMDExIExlYXJuQm9vc3QgPGRldkBsZWFybmJvb3N0LmNvbT5cbiAgICogTUlUIExpY2Vuc2VkXG4gICAqL1xuXG4gIChmdW5jdGlvbiAoZXhwb3J0cywgaW8sIGdsb2JhbCkge1xuXG4gICAgLyoqXG4gICAgICogRXhwb3NlIGNvbnN0cnVjdG9yLlxuICAgICAqL1xuXG4gICAgZXhwb3J0cy5Tb2NrZXQgPSBTb2NrZXQ7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgYFNvY2tldC5JTyBjbGllbnRgIHdoaWNoIGNhbiBlc3RhYmxpc2ggYSBwZXJzaXN0ZW50XG4gICAgICogY29ubmVjdGlvbiB3aXRoIGEgU29ja2V0LklPIGVuYWJsZWQgc2VydmVyLlxuICAgICAqXG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cblxuICAgIGZ1bmN0aW9uIFNvY2tldChvcHRpb25zKSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAgIHBvcnQ6IDgwLFxuICAgICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgICBkb2N1bWVudDogJ2RvY3VtZW50JyBpbiBnbG9iYWwgPyBkb2N1bWVudCA6IGZhbHNlLFxuICAgICAgICByZXNvdXJjZTogJ3NvY2tldC5pbycsXG4gICAgICAgIHRyYW5zcG9ydHM6IGlvLnRyYW5zcG9ydHMsXG4gICAgICAgICdjb25uZWN0IHRpbWVvdXQnOiAxMDAwMCxcbiAgICAgICAgJ3RyeSBtdWx0aXBsZSB0cmFuc3BvcnRzJzogdHJ1ZSxcbiAgICAgICAgJ3JlY29ubmVjdCc6IHRydWUsXG4gICAgICAgICdyZWNvbm5lY3Rpb24gZGVsYXknOiA1MDAsXG4gICAgICAgICdyZWNvbm5lY3Rpb24gbGltaXQnOiBJbmZpbml0eSxcbiAgICAgICAgJ3Jlb3BlbiBkZWxheSc6IDMwMDAsXG4gICAgICAgICdtYXggcmVjb25uZWN0aW9uIGF0dGVtcHRzJzogMTAsXG4gICAgICAgICdzeW5jIGRpc2Nvbm5lY3Qgb24gdW5sb2FkJzogZmFsc2UsXG4gICAgICAgICdhdXRvIGNvbm5lY3QnOiB0cnVlLFxuICAgICAgICAnZmxhc2ggcG9saWN5IHBvcnQnOiAxMDg0MyxcbiAgICAgICAgJ21hbnVhbEZsdXNoJzogZmFsc2VcbiAgICAgIH07XG5cbiAgICAgIGlvLnV0aWwubWVyZ2UodGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgdGhpcy5jb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMub3BlbiA9IGZhbHNlO1xuICAgICAgdGhpcy5jb25uZWN0aW5nID0gZmFsc2U7XG4gICAgICB0aGlzLnJlY29ubmVjdGluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5uYW1lc3BhY2VzID0ge307XG4gICAgICB0aGlzLmJ1ZmZlciA9IFtdO1xuICAgICAgdGhpcy5kb0J1ZmZlciA9IGZhbHNlO1xuXG4gICAgICBpZiAodGhpcy5vcHRpb25zWydzeW5jIGRpc2Nvbm5lY3Qgb24gdW5sb2FkJ10gJiYgKCF0aGlzLmlzWERvbWFpbigpIHx8IGlvLnV0aWwudWEuaGFzQ09SUykpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBpby51dGlsLm9uKGdsb2JhbCwgJ2JlZm9yZXVubG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLmRpc2Nvbm5lY3RTeW5jKCk7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9uc1snYXV0byBjb25uZWN0J10pIHtcbiAgICAgICAgdGhpcy5jb25uZWN0KCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFwcGx5IEV2ZW50RW1pdHRlciBtaXhpbi5cbiAgICAgKi9cblxuICAgIGlvLnV0aWwubWl4aW4oU29ja2V0LCBpby5FdmVudEVtaXR0ZXIpO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5hbWVzcGFjZSBsaXN0ZW5lci9lbWl0dGVyIGZvciB0aGlzIHNvY2tldFxuICAgICAqXG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cblxuICAgIFNvY2tldC5wcm90b3R5cGUub2YgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgaWYgKCF0aGlzLm5hbWVzcGFjZXNbbmFtZV0pIHtcbiAgICAgICAgdGhpcy5uYW1lc3BhY2VzW25hbWVdID0gbmV3IGlvLlNvY2tldE5hbWVzcGFjZSh0aGlzLCBuYW1lKTtcblxuICAgICAgICBpZiAobmFtZSAhPT0gJycpIHtcbiAgICAgICAgICB0aGlzLm5hbWVzcGFjZXNbbmFtZV0ucGFja2V0KHsgdHlwZTogJ2Nvbm5lY3QnIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLm5hbWVzcGFjZXNbbmFtZV07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEVtaXRzIHRoZSBnaXZlbiBldmVudCB0byB0aGUgU29ja2V0IGFuZCBhbGwgbmFtZXNwYWNlc1xuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgICBTb2NrZXQucHJvdG90eXBlLnB1Ymxpc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmVtaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgdmFyIG5zcDtcblxuICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLm5hbWVzcGFjZXMpIHtcbiAgICAgICAgaWYgKHRoaXMubmFtZXNwYWNlcy5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgIG5zcCA9IHRoaXMub2YoaSk7XG4gICAgICAgICAgbnNwLiRlbWl0LmFwcGx5KG5zcCwgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtcyB0aGUgaGFuZHNoYWtlXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICAgIGZ1bmN0aW9uIGVtcHR5KCkge307XG5cbiAgICBTb2NrZXQucHJvdG90eXBlLmhhbmRzaGFrZSA9IGZ1bmN0aW9uIChmbikge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cbiAgICAgIGZ1bmN0aW9uIGNvbXBsZXRlKGRhdGEpIHtcbiAgICAgICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgIHNlbGYuY29ubmVjdGluZyA9IGZhbHNlO1xuICAgICAgICAgIHNlbGYub25FcnJvcihkYXRhLm1lc3NhZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZuLmFwcGx5KG51bGwsIGRhdGEuc3BsaXQoJzonKSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHZhciB1cmwgPSBbJ2h0dHAnICsgKG9wdGlvbnMuc2VjdXJlID8gJ3MnIDogJycpICsgJzovJywgb3B0aW9ucy5ob3N0ICsgJzonICsgb3B0aW9ucy5wb3J0LCBvcHRpb25zLnJlc291cmNlLCBpby5wcm90b2NvbCwgaW8udXRpbC5xdWVyeSh0aGlzLm9wdGlvbnMucXVlcnksICd0PScgKyArbmV3IERhdGUoKSldLmpvaW4oJy8nKTtcblxuICAgICAgaWYgKHRoaXMuaXNYRG9tYWluKCkgJiYgIWlvLnV0aWwudWEuaGFzQ09SUykge1xuICAgICAgICB2YXIgaW5zZXJ0QXQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF0sXG4gICAgICAgICAgICBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcblxuICAgICAgICBzY3JpcHQuc3JjID0gdXJsICsgJyZqc29ucD0nICsgaW8uai5sZW5ndGg7XG4gICAgICAgIGluc2VydEF0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHNjcmlwdCwgaW5zZXJ0QXQpO1xuXG4gICAgICAgIGlvLmoucHVzaChmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIGNvbXBsZXRlKGRhdGEpO1xuICAgICAgICAgIHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHhociA9IGlvLnV0aWwucmVxdWVzdCgpO1xuXG4gICAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuICAgICAgICBpZiAodGhpcy5pc1hEb21haW4oKSkge1xuICAgICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBlbXB0eTtcblxuICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT0gMjAwKSB7XG4gICAgICAgICAgICAgIGNvbXBsZXRlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh4aHIuc3RhdHVzID09IDQwMykge1xuICAgICAgICAgICAgICBzZWxmLm9uRXJyb3IoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzZWxmLmNvbm5lY3RpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgIXNlbGYucmVjb25uZWN0aW5nICYmIHNlbGYub25FcnJvcih4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhoci5zZW5kKG51bGwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGaW5kIGFuIGF2YWlsYWJsZSB0cmFuc3BvcnQgYmFzZWQgb24gdGhlIG9wdGlvbnMgc3VwcGxpZWQgaW4gdGhlIGNvbnN0cnVjdG9yLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgICBTb2NrZXQucHJvdG90eXBlLmdldFRyYW5zcG9ydCA9IGZ1bmN0aW9uIChvdmVycmlkZSkge1xuICAgICAgdmFyIHRyYW5zcG9ydHMgPSBvdmVycmlkZSB8fCB0aGlzLnRyYW5zcG9ydHMsXG4gICAgICAgICAgbWF0Y2g7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCB0cmFuc3BvcnQ7IHRyYW5zcG9ydCA9IHRyYW5zcG9ydHNbaV07IGkrKykge1xuICAgICAgICBpZiAoaW8uVHJhbnNwb3J0W3RyYW5zcG9ydF0gJiYgaW8uVHJhbnNwb3J0W3RyYW5zcG9ydF0uY2hlY2sodGhpcykgJiYgKCF0aGlzLmlzWERvbWFpbigpIHx8IGlvLlRyYW5zcG9ydFt0cmFuc3BvcnRdLnhkb21haW5DaGVjayh0aGlzKSkpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IGlvLlRyYW5zcG9ydFt0cmFuc3BvcnRdKHRoaXMsIHRoaXMuc2Vzc2lvbmlkKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ29ubmVjdHMgdG8gdGhlIHNlcnZlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtmbl0gQ2FsbGJhY2suXG4gICAgICogQHJldHVybnMge2lvLlNvY2tldH1cbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgU29ja2V0LnByb3RvdHlwZS5jb25uZWN0ID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICBpZiAodGhpcy5jb25uZWN0aW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBzZWxmLmNvbm5lY3RpbmcgPSB0cnVlO1xuXG4gICAgICB0aGlzLmhhbmRzaGFrZShmdW5jdGlvbiAoc2lkLCBoZWFydGJlYXQsIGNsb3NlLCB0cmFuc3BvcnRzKSB7XG4gICAgICAgIHNlbGYuc2Vzc2lvbmlkID0gc2lkO1xuICAgICAgICBzZWxmLmNsb3NlVGltZW91dCA9IGNsb3NlICogMTAwMDtcbiAgICAgICAgc2VsZi5oZWFydGJlYXRUaW1lb3V0ID0gaGVhcnRiZWF0ICogMTAwMDtcbiAgICAgICAgaWYgKCFzZWxmLnRyYW5zcG9ydHMpIHNlbGYudHJhbnNwb3J0cyA9IHNlbGYub3JpZ1RyYW5zcG9ydHMgPSB0cmFuc3BvcnRzID8gaW8udXRpbC5pbnRlcnNlY3QodHJhbnNwb3J0cy5zcGxpdCgnLCcpLCBzZWxmLm9wdGlvbnMudHJhbnNwb3J0cykgOiBzZWxmLm9wdGlvbnMudHJhbnNwb3J0cztcblxuICAgICAgICBzZWxmLnNldEhlYXJ0YmVhdFRpbWVvdXQoKTtcblxuICAgICAgICBmdW5jdGlvbiBjb25uZWN0KHRyYW5zcG9ydHMpIHtcbiAgICAgICAgICBpZiAoc2VsZi50cmFuc3BvcnQpIHNlbGYudHJhbnNwb3J0LmNsZWFyVGltZW91dHMoKTtcblxuICAgICAgICAgIHNlbGYudHJhbnNwb3J0ID0gc2VsZi5nZXRUcmFuc3BvcnQodHJhbnNwb3J0cyk7XG4gICAgICAgICAgaWYgKCFzZWxmLnRyYW5zcG9ydCkgcmV0dXJuIHNlbGYucHVibGlzaCgnY29ubmVjdF9mYWlsZWQnKTtcblxuICAgICAgICAgIC8vIG9uY2UgdGhlIHRyYW5zcG9ydCBpcyByZWFkeVxuICAgICAgICAgIHNlbGYudHJhbnNwb3J0LnJlYWR5KHNlbGYsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdGluZyA9IHRydWU7XG4gICAgICAgICAgICBzZWxmLnB1Ymxpc2goJ2Nvbm5lY3RpbmcnLCBzZWxmLnRyYW5zcG9ydC5uYW1lKTtcbiAgICAgICAgICAgIHNlbGYudHJhbnNwb3J0Lm9wZW4oKTtcblxuICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9uc1snY29ubmVjdCB0aW1lb3V0J10pIHtcbiAgICAgICAgICAgICAgc2VsZi5jb25uZWN0VGltZW91dFRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFzZWxmLmNvbm5lY3RlZCkge1xuICAgICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnNbJ3RyeSBtdWx0aXBsZSB0cmFuc3BvcnRzJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlbWFpbmluZyA9IHNlbGYudHJhbnNwb3J0cztcblxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAocmVtYWluaW5nLmxlbmd0aCA+IDAgJiYgcmVtYWluaW5nLnNwbGljZSgwLCAxKVswXSAhPSBzZWxmLnRyYW5zcG9ydC5uYW1lKSB7fVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZW1haW5pbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgY29ubmVjdChyZW1haW5pbmcpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIHNlbGYucHVibGlzaCgnY29ubmVjdF9mYWlsZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSwgc2VsZi5vcHRpb25zWydjb25uZWN0IHRpbWVvdXQnXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25uZWN0KHNlbGYudHJhbnNwb3J0cyk7XG5cbiAgICAgICAgc2VsZi5vbmNlKCdjb25uZWN0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNsZWFyVGltZW91dChzZWxmLmNvbm5lY3RUaW1lb3V0VGltZXIpO1xuXG4gICAgICAgICAgZm4gJiYgdHlwZW9mIGZuID09ICdmdW5jdGlvbicgJiYgZm4oKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENsZWFycyBhbmQgc2V0cyBhIG5ldyBoZWFydGJlYXQgdGltZW91dCB1c2luZyB0aGUgdmFsdWUgZ2l2ZW4gYnkgdGhlXG4gICAgICogc2VydmVyIGR1cmluZyB0aGUgaGFuZHNoYWtlLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgICBTb2NrZXQucHJvdG90eXBlLnNldEhlYXJ0YmVhdFRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5oZWFydGJlYXRUaW1lb3V0VGltZXIpO1xuICAgICAgaWYgKHRoaXMudHJhbnNwb3J0ICYmICF0aGlzLnRyYW5zcG9ydC5oZWFydGJlYXRzKCkpIHJldHVybjtcblxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgdGhpcy5oZWFydGJlYXRUaW1lb3V0VGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi50cmFuc3BvcnQub25DbG9zZSgpO1xuICAgICAgfSwgdGhpcy5oZWFydGJlYXRUaW1lb3V0KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2VuZHMgYSBtZXNzYWdlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgcGFja2V0LlxuICAgICAqIEByZXR1cm5zIHtpby5Tb2NrZXR9XG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cblxuICAgIFNvY2tldC5wcm90b3R5cGUucGFja2V0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIGlmICh0aGlzLmNvbm5lY3RlZCAmJiAhdGhpcy5kb0J1ZmZlcikge1xuICAgICAgICB0aGlzLnRyYW5zcG9ydC5wYWNrZXQoZGF0YSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmJ1ZmZlci5wdXNoKGRhdGEpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2V0cyBidWZmZXIgc3RhdGVcbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gICAgU29ja2V0LnByb3RvdHlwZS5zZXRCdWZmZXIgPSBmdW5jdGlvbiAodikge1xuICAgICAgdGhpcy5kb0J1ZmZlciA9IHY7XG5cbiAgICAgIGlmICghdiAmJiB0aGlzLmNvbm5lY3RlZCAmJiB0aGlzLmJ1ZmZlci5sZW5ndGgpIHtcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnNbJ21hbnVhbEZsdXNoJ10pIHtcbiAgICAgICAgICB0aGlzLmZsdXNoQnVmZmVyKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRmx1c2hlcyB0aGUgYnVmZmVyIGRhdGEgb3ZlciB0aGUgd2lyZS5cbiAgICAgKiBUbyBiZSBpbnZva2VkIG1hbnVhbGx5IHdoZW4gJ21hbnVhbEZsdXNoJyBpcyBzZXQgdG8gdHJ1ZS5cbiAgICAgKlxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG5cbiAgICBTb2NrZXQucHJvdG90eXBlLmZsdXNoQnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy50cmFuc3BvcnQucGF5bG9hZCh0aGlzLmJ1ZmZlcik7XG4gICAgICB0aGlzLmJ1ZmZlciA9IFtdO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBEaXNjb25uZWN0IHRoZSBlc3RhYmxpc2hlZCBjb25uZWN0LlxuICAgICAqXG4gICAgICogQHJldHVybnMge2lvLlNvY2tldH1cbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgU29ja2V0LnByb3RvdHlwZS5kaXNjb25uZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMuY29ubmVjdGVkIHx8IHRoaXMuY29ubmVjdGluZykge1xuICAgICAgICBpZiAodGhpcy5vcGVuKSB7XG4gICAgICAgICAgdGhpcy5vZignJykucGFja2V0KHsgdHlwZTogJ2Rpc2Nvbm5lY3QnIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaGFuZGxlIGRpc2Nvbm5lY3Rpb24gaW1tZWRpYXRlbHlcbiAgICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QoJ2Jvb3RlZCcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRGlzY29ubmVjdHMgdGhlIHNvY2tldCB3aXRoIGEgc3luYyBYSFIuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICAgIFNvY2tldC5wcm90b3R5cGUuZGlzY29ubmVjdFN5bmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBlbnN1cmUgZGlzY29ubmVjdGlvblxuICAgICAgdmFyIHhociA9IGlvLnV0aWwucmVxdWVzdCgpO1xuICAgICAgdmFyIHVyaSA9IFsnaHR0cCcgKyAodGhpcy5vcHRpb25zLnNlY3VyZSA/ICdzJyA6ICcnKSArICc6LycsIHRoaXMub3B0aW9ucy5ob3N0ICsgJzonICsgdGhpcy5vcHRpb25zLnBvcnQsIHRoaXMub3B0aW9ucy5yZXNvdXJjZSwgaW8ucHJvdG9jb2wsICcnLCB0aGlzLnNlc3Npb25pZF0uam9pbignLycpICsgJy8/ZGlzY29ubmVjdD0xJztcblxuICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVyaSwgZmFsc2UpO1xuICAgICAgeGhyLnNlbmQobnVsbCk7XG5cbiAgICAgIC8vIGhhbmRsZSBkaXNjb25uZWN0aW9uIGltbWVkaWF0ZWx5XG4gICAgICB0aGlzLm9uRGlzY29ubmVjdCgnYm9vdGVkJyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHdlIG5lZWQgdG8gdXNlIGNyb3NzIGRvbWFpbiBlbmFibGVkIHRyYW5zcG9ydHMuIENyb3NzIGRvbWFpbiB3b3VsZFxuICAgICAqIGJlIGEgZGlmZmVyZW50IHBvcnQgb3IgZGlmZmVyZW50IGRvbWFpbiBuYW1lLlxuICAgICAqXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgICBTb2NrZXQucHJvdG90eXBlLmlzWERvbWFpbiA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgdmFyIHBvcnQgPSBnbG9iYWwubG9jYXRpb24ucG9ydCB8fCAoJ2h0dHBzOicgPT0gZ2xvYmFsLmxvY2F0aW9uLnByb3RvY29sID8gNDQzIDogODApO1xuXG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmhvc3QgIT09IGdsb2JhbC5sb2NhdGlvbi5ob3N0bmFtZSB8fCB0aGlzLm9wdGlvbnMucG9ydCAhPSBwb3J0O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgdXBvbiBoYW5kc2hha2UuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICAgIFNvY2tldC5wcm90b3R5cGUub25Db25uZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCF0aGlzLmNvbm5lY3RlZCkge1xuICAgICAgICB0aGlzLmNvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuY29ubmVjdGluZyA9IGZhbHNlO1xuICAgICAgICBpZiAoIXRoaXMuZG9CdWZmZXIpIHtcbiAgICAgICAgICAvLyBtYWtlIHN1cmUgdG8gZmx1c2ggdGhlIGJ1ZmZlclxuICAgICAgICAgIHRoaXMuc2V0QnVmZmVyKGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVtaXQoJ2Nvbm5lY3QnKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gdGhlIHRyYW5zcG9ydCBvcGVuc1xuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgICBTb2NrZXQucHJvdG90eXBlLm9uT3BlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMub3BlbiA9IHRydWU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIHRoZSB0cmFuc3BvcnQgY2xvc2VzLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgICBTb2NrZXQucHJvdG90eXBlLm9uQ2xvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLm9wZW4gPSBmYWxzZTtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmhlYXJ0YmVhdFRpbWVvdXRUaW1lcik7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIHRoZSB0cmFuc3BvcnQgZmlyc3Qgb3BlbnMgYSBjb25uZWN0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdGV4dFxuICAgICAqL1xuXG4gICAgU29ja2V0LnByb3RvdHlwZS5vblBhY2tldCA9IGZ1bmN0aW9uIChwYWNrZXQpIHtcbiAgICAgIHRoaXMub2YocGFja2V0LmVuZHBvaW50KS5vblBhY2tldChwYWNrZXQpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIGFuIGVycm9yLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgICBTb2NrZXQucHJvdG90eXBlLm9uRXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICBpZiAoZXJyICYmIGVyci5hZHZpY2UpIHtcbiAgICAgICAgaWYgKGVyci5hZHZpY2UgPT09ICdyZWNvbm5lY3QnICYmICh0aGlzLmNvbm5lY3RlZCB8fCB0aGlzLmNvbm5lY3RpbmcpKSB7XG4gICAgICAgICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5yZWNvbm5lY3QpIHtcbiAgICAgICAgICAgIHRoaXMucmVjb25uZWN0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMucHVibGlzaCgnZXJyb3InLCBlcnIgJiYgZXJyLnJlYXNvbiA/IGVyci5yZWFzb24gOiBlcnIpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiB0aGUgdHJhbnNwb3J0IGRpc2Nvbm5lY3RzLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgICBTb2NrZXQucHJvdG90eXBlLm9uRGlzY29ubmVjdCA9IGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIHZhciB3YXNDb25uZWN0ZWQgPSB0aGlzLmNvbm5lY3RlZCxcbiAgICAgICAgICB3YXNDb25uZWN0aW5nID0gdGhpcy5jb25uZWN0aW5nO1xuXG4gICAgICB0aGlzLmNvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5jb25uZWN0aW5nID0gZmFsc2U7XG4gICAgICB0aGlzLm9wZW4gPSBmYWxzZTtcblxuICAgICAgaWYgKHdhc0Nvbm5lY3RlZCB8fCB3YXNDb25uZWN0aW5nKSB7XG4gICAgICAgIHRoaXMudHJhbnNwb3J0LmNsb3NlKCk7XG4gICAgICAgIHRoaXMudHJhbnNwb3J0LmNsZWFyVGltZW91dHMoKTtcbiAgICAgICAgaWYgKHdhc0Nvbm5lY3RlZCkge1xuICAgICAgICAgIHRoaXMucHVibGlzaCgnZGlzY29ubmVjdCcsIHJlYXNvbik7XG5cbiAgICAgICAgICBpZiAoJ2Jvb3RlZCcgIT0gcmVhc29uICYmIHRoaXMub3B0aW9ucy5yZWNvbm5lY3QgJiYgIXRoaXMucmVjb25uZWN0aW5nKSB7XG4gICAgICAgICAgICB0aGlzLnJlY29ubmVjdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgdXBvbiByZWNvbm5lY3Rpb24uXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICAgIFNvY2tldC5wcm90b3R5cGUucmVjb25uZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5yZWNvbm5lY3RpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5yZWNvbm5lY3Rpb25BdHRlbXB0cyA9IDA7XG4gICAgICB0aGlzLnJlY29ubmVjdGlvbkRlbGF5ID0gdGhpcy5vcHRpb25zWydyZWNvbm5lY3Rpb24gZGVsYXknXTtcblxuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIG1heEF0dGVtcHRzID0gdGhpcy5vcHRpb25zWydtYXggcmVjb25uZWN0aW9uIGF0dGVtcHRzJ10sXG4gICAgICAgICAgdHJ5TXVsdGlwbGUgPSB0aGlzLm9wdGlvbnNbJ3RyeSBtdWx0aXBsZSB0cmFuc3BvcnRzJ10sXG4gICAgICAgICAgbGltaXQgPSB0aGlzLm9wdGlvbnNbJ3JlY29ubmVjdGlvbiBsaW1pdCddO1xuXG4gICAgICBmdW5jdGlvbiByZXNldCgpIHtcbiAgICAgICAgaWYgKHNlbGYuY29ubmVjdGVkKSB7XG4gICAgICAgICAgZm9yICh2YXIgaSBpbiBzZWxmLm5hbWVzcGFjZXMpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLm5hbWVzcGFjZXMuaGFzT3duUHJvcGVydHkoaSkgJiYgJycgIT09IGkpIHtcbiAgICAgICAgICAgICAgc2VsZi5uYW1lc3BhY2VzW2ldLnBhY2tldCh7IHR5cGU6ICdjb25uZWN0JyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc2VsZi5wdWJsaXNoKCdyZWNvbm5lY3QnLCBzZWxmLnRyYW5zcG9ydC5uYW1lLCBzZWxmLnJlY29ubmVjdGlvbkF0dGVtcHRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNsZWFyVGltZW91dChzZWxmLnJlY29ubmVjdGlvblRpbWVyKTtcblxuICAgICAgICBzZWxmLnJlbW92ZUxpc3RlbmVyKCdjb25uZWN0X2ZhaWxlZCcsIG1heWJlUmVjb25uZWN0KTtcbiAgICAgICAgc2VsZi5yZW1vdmVMaXN0ZW5lcignY29ubmVjdCcsIG1heWJlUmVjb25uZWN0KTtcblxuICAgICAgICBzZWxmLnJlY29ubmVjdGluZyA9IGZhbHNlO1xuXG4gICAgICAgIGRlbGV0ZSBzZWxmLnJlY29ubmVjdGlvbkF0dGVtcHRzO1xuICAgICAgICBkZWxldGUgc2VsZi5yZWNvbm5lY3Rpb25EZWxheTtcbiAgICAgICAgZGVsZXRlIHNlbGYucmVjb25uZWN0aW9uVGltZXI7XG4gICAgICAgIGRlbGV0ZSBzZWxmLnJlZG9UcmFuc3BvcnRzO1xuXG4gICAgICAgIHNlbGYub3B0aW9uc1sndHJ5IG11bHRpcGxlIHRyYW5zcG9ydHMnXSA9IHRyeU11bHRpcGxlO1xuICAgICAgfTtcblxuICAgICAgZnVuY3Rpb24gbWF5YmVSZWNvbm5lY3QoKSB7XG4gICAgICAgIGlmICghc2VsZi5yZWNvbm5lY3RpbmcpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VsZi5jb25uZWN0ZWQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzZXQoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoc2VsZi5jb25uZWN0aW5nICYmIHNlbGYucmVjb25uZWN0aW5nKSB7XG4gICAgICAgICAgcmV0dXJuIHNlbGYucmVjb25uZWN0aW9uVGltZXIgPSBzZXRUaW1lb3V0KG1heWJlUmVjb25uZWN0LCAxMDAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZWxmLnJlY29ubmVjdGlvbkF0dGVtcHRzKysgPj0gbWF4QXR0ZW1wdHMpIHtcbiAgICAgICAgICBpZiAoIXNlbGYucmVkb1RyYW5zcG9ydHMpIHtcbiAgICAgICAgICAgIHNlbGYub24oJ2Nvbm5lY3RfZmFpbGVkJywgbWF5YmVSZWNvbm5lY3QpO1xuICAgICAgICAgICAgc2VsZi5vcHRpb25zWyd0cnkgbXVsdGlwbGUgdHJhbnNwb3J0cyddID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlbGYudHJhbnNwb3J0cyA9IHNlbGYub3JpZ1RyYW5zcG9ydHM7XG4gICAgICAgICAgICBzZWxmLnRyYW5zcG9ydCA9IHNlbGYuZ2V0VHJhbnNwb3J0KCk7XG4gICAgICAgICAgICBzZWxmLnJlZG9UcmFuc3BvcnRzID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdCgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWxmLnB1Ymxpc2goJ3JlY29ubmVjdF9mYWlsZWQnKTtcbiAgICAgICAgICAgIHJlc2V0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChzZWxmLnJlY29ubmVjdGlvbkRlbGF5IDwgbGltaXQpIHtcbiAgICAgICAgICAgIHNlbGYucmVjb25uZWN0aW9uRGVsYXkgKj0gMjsgLy8gZXhwb25lbnRpYWwgYmFjayBvZmZcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzZWxmLmNvbm5lY3QoKTtcbiAgICAgICAgICBzZWxmLnB1Ymxpc2goJ3JlY29ubmVjdGluZycsIHNlbGYucmVjb25uZWN0aW9uRGVsYXksIHNlbGYucmVjb25uZWN0aW9uQXR0ZW1wdHMpO1xuICAgICAgICAgIHNlbGYucmVjb25uZWN0aW9uVGltZXIgPSBzZXRUaW1lb3V0KG1heWJlUmVjb25uZWN0LCBzZWxmLnJlY29ubmVjdGlvbkRlbGF5KTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdGhpcy5vcHRpb25zWyd0cnkgbXVsdGlwbGUgdHJhbnNwb3J0cyddID0gZmFsc2U7XG4gICAgICB0aGlzLnJlY29ubmVjdGlvblRpbWVyID0gc2V0VGltZW91dChtYXliZVJlY29ubmVjdCwgdGhpcy5yZWNvbm5lY3Rpb25EZWxheSk7XG5cbiAgICAgIHRoaXMub24oJ2Nvbm5lY3QnLCBtYXliZVJlY29ubmVjdCk7XG4gICAgfTtcbiAgfSkoJ3VuZGVmaW5lZCcgIT0gdHlwZW9mIGlvID8gaW8gOiBtb2R1bGUuZXhwb3J0cywgJ3VuZGVmaW5lZCcgIT0gdHlwZW9mIGlvID8gaW8gOiBtb2R1bGUucGFyZW50LmV4cG9ydHMsIHRoaXMpO1xuICAvKipcbiAgICogc29ja2V0LmlvXG4gICAqIENvcHlyaWdodChjKSAyMDExIExlYXJuQm9vc3QgPGRldkBsZWFybmJvb3N0LmNvbT5cbiAgICogTUlUIExpY2Vuc2VkXG4gICAqL1xuXG4gIChmdW5jdGlvbiAoZXhwb3J0cywgaW8pIHtcblxuICAgIC8qKlxuICAgICAqIEV4cG9zZSBjb25zdHJ1Y3Rvci5cbiAgICAgKi9cblxuICAgIGV4cG9ydHMuU29ja2V0TmFtZXNwYWNlID0gU29ja2V0TmFtZXNwYWNlO1xuXG4gICAgLyoqXG4gICAgICogU29ja2V0IG5hbWVzcGFjZSBjb25zdHJ1Y3Rvci5cbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG5cbiAgICBmdW5jdGlvbiBTb2NrZXROYW1lc3BhY2Uoc29ja2V0LCBuYW1lKSB7XG4gICAgICB0aGlzLnNvY2tldCA9IHNvY2tldDtcbiAgICAgIHRoaXMubmFtZSA9IG5hbWUgfHwgJyc7XG4gICAgICB0aGlzLmZsYWdzID0ge307XG4gICAgICB0aGlzLmpzb24gPSBuZXcgRmxhZyh0aGlzLCAnanNvbicpO1xuICAgICAgdGhpcy5hY2tQYWNrZXRzID0gMDtcbiAgICAgIHRoaXMuYWNrcyA9IHt9O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBcHBseSBFdmVudEVtaXR0ZXIgbWl4aW4uXG4gICAgICovXG5cbiAgICBpby51dGlsLm1peGluKFNvY2tldE5hbWVzcGFjZSwgaW8uRXZlbnRFbWl0dGVyKTtcblxuICAgIC8qKlxuICAgICAqIENvcGllcyBlbWl0IHNpbmNlIHdlIG92ZXJyaWRlIGl0XG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICAgIFNvY2tldE5hbWVzcGFjZS5wcm90b3R5cGUuJGVtaXQgPSBpby5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQ7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IG5hbWVzcGFjZSwgYnkgcHJveHlpbmcgdGhlIHJlcXVlc3QgdG8gdGhlIHNvY2tldC4gVGhpc1xuICAgICAqIGFsbG93cyB1cyB0byB1c2UgdGhlIHN5bmF4IGFzIHdlIGRvIG9uIHRoZSBzZXJ2ZXIuXG4gICAgICpcbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgU29ja2V0TmFtZXNwYWNlLnByb3RvdHlwZS5vZiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLnNvY2tldC5vZi5hcHBseSh0aGlzLnNvY2tldCwgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2VuZHMgYSBwYWNrZXQuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICAgIFNvY2tldE5hbWVzcGFjZS5wcm90b3R5cGUucGFja2V0ID0gZnVuY3Rpb24gKHBhY2tldCkge1xuICAgICAgcGFja2V0LmVuZHBvaW50ID0gdGhpcy5uYW1lO1xuICAgICAgdGhpcy5zb2NrZXQucGFja2V0KHBhY2tldCk7XG4gICAgICB0aGlzLmZsYWdzID0ge307XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2VuZHMgYSBtZXNzYWdlXG4gICAgICpcbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgU29ja2V0TmFtZXNwYWNlLnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24gKGRhdGEsIGZuKSB7XG4gICAgICB2YXIgcGFja2V0ID0ge1xuICAgICAgICB0eXBlOiB0aGlzLmZsYWdzLmpzb24gPyAnanNvbicgOiAnbWVzc2FnZScsXG4gICAgICAgIGRhdGE6IGRhdGFcbiAgICAgIH07XG5cbiAgICAgIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBmbikge1xuICAgICAgICBwYWNrZXQuaWQgPSArK3RoaXMuYWNrUGFja2V0cztcbiAgICAgICAgcGFja2V0LmFjayA9IHRydWU7XG4gICAgICAgIHRoaXMuYWNrc1twYWNrZXQuaWRdID0gZm47XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnBhY2tldChwYWNrZXQpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBFbWl0cyBhbiBldmVudFxuICAgICAqXG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cblxuICAgIFNvY2tldE5hbWVzcGFjZS5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSksXG4gICAgICAgICAgbGFzdEFyZyA9IGFyZ3NbYXJncy5sZW5ndGggLSAxXSxcbiAgICAgICAgICBwYWNrZXQgPSB7XG4gICAgICAgIHR5cGU6ICdldmVudCcsXG4gICAgICAgIG5hbWU6IG5hbWVcbiAgICAgIH07XG5cbiAgICAgIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBsYXN0QXJnKSB7XG4gICAgICAgIHBhY2tldC5pZCA9ICsrdGhpcy5hY2tQYWNrZXRzO1xuICAgICAgICBwYWNrZXQuYWNrID0gJ2RhdGEnO1xuICAgICAgICB0aGlzLmFja3NbcGFja2V0LmlkXSA9IGxhc3RBcmc7XG4gICAgICAgIGFyZ3MgPSBhcmdzLnNsaWNlKDAsIGFyZ3MubGVuZ3RoIC0gMSk7XG4gICAgICB9XG5cbiAgICAgIHBhY2tldC5hcmdzID0gYXJncztcblxuICAgICAgcmV0dXJuIHRoaXMucGFja2V0KHBhY2tldCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERpc2Nvbm5lY3RzIHRoZSBuYW1lc3BhY2VcbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gICAgU29ja2V0TmFtZXNwYWNlLnByb3RvdHlwZS5kaXNjb25uZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMubmFtZSA9PT0gJycpIHtcbiAgICAgICAgdGhpcy5zb2NrZXQuZGlzY29ubmVjdCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5wYWNrZXQoeyB0eXBlOiAnZGlzY29ubmVjdCcgfSk7XG4gICAgICAgIHRoaXMuJGVtaXQoJ2Rpc2Nvbm5lY3QnKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXMgYSBwYWNrZXRcbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gICAgU29ja2V0TmFtZXNwYWNlLnByb3RvdHlwZS5vblBhY2tldCA9IGZ1bmN0aW9uIChwYWNrZXQpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgZnVuY3Rpb24gYWNrKCkge1xuICAgICAgICBzZWxmLnBhY2tldCh7XG4gICAgICAgICAgdHlwZTogJ2FjaycsXG4gICAgICAgICAgYXJnczogaW8udXRpbC50b0FycmF5KGFyZ3VtZW50cyksXG4gICAgICAgICAgYWNrSWQ6IHBhY2tldC5pZFxuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIHN3aXRjaCAocGFja2V0LnR5cGUpIHtcbiAgICAgICAgY2FzZSAnY29ubmVjdCc6XG4gICAgICAgICAgdGhpcy4kZW1pdCgnY29ubmVjdCcpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2Rpc2Nvbm5lY3QnOlxuICAgICAgICAgIGlmICh0aGlzLm5hbWUgPT09ICcnKSB7XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5vbkRpc2Nvbm5lY3QocGFja2V0LnJlYXNvbiB8fCAnYm9vdGVkJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoJ2Rpc2Nvbm5lY3QnLCBwYWNrZXQucmVhc29uKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnbWVzc2FnZSc6XG4gICAgICAgIGNhc2UgJ2pzb24nOlxuICAgICAgICAgIHZhciBwYXJhbXMgPSBbJ21lc3NhZ2UnLCBwYWNrZXQuZGF0YV07XG5cbiAgICAgICAgICBpZiAocGFja2V0LmFjayA9PSAnZGF0YScpIHtcbiAgICAgICAgICAgIHBhcmFtcy5wdXNoKGFjayk7XG4gICAgICAgICAgfSBlbHNlIGlmIChwYWNrZXQuYWNrKSB7XG4gICAgICAgICAgICB0aGlzLnBhY2tldCh7IHR5cGU6ICdhY2snLCBhY2tJZDogcGFja2V0LmlkIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuJGVtaXQuYXBwbHkodGhpcywgcGFyYW1zKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdldmVudCc6XG4gICAgICAgICAgdmFyIHBhcmFtcyA9IFtwYWNrZXQubmFtZV0uY29uY2F0KHBhY2tldC5hcmdzKTtcblxuICAgICAgICAgIGlmIChwYWNrZXQuYWNrID09ICdkYXRhJykgcGFyYW1zLnB1c2goYWNrKTtcblxuICAgICAgICAgIHRoaXMuJGVtaXQuYXBwbHkodGhpcywgcGFyYW1zKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdhY2snOlxuICAgICAgICAgIGlmICh0aGlzLmFja3NbcGFja2V0LmFja0lkXSkge1xuICAgICAgICAgICAgdGhpcy5hY2tzW3BhY2tldC5hY2tJZF0uYXBwbHkodGhpcywgcGFja2V0LmFyZ3MpO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuYWNrc1twYWNrZXQuYWNrSWRdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdlcnJvcic6XG4gICAgICAgICAgaWYgKHBhY2tldC5hZHZpY2UpIHtcbiAgICAgICAgICAgIHRoaXMuc29ja2V0Lm9uRXJyb3IocGFja2V0KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHBhY2tldC5yZWFzb24gPT0gJ3VuYXV0aG9yaXplZCcpIHtcbiAgICAgICAgICAgICAgdGhpcy4kZW1pdCgnY29ubmVjdF9mYWlsZWQnLCBwYWNrZXQucmVhc29uKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuJGVtaXQoJ2Vycm9yJywgcGFja2V0LnJlYXNvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGbGFnIGludGVyZmFjZS5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gICAgZnVuY3Rpb24gRmxhZyhuc3AsIG5hbWUpIHtcbiAgICAgIHRoaXMubmFtZXNwYWNlID0gbnNwO1xuICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2VuZCBhIG1lc3NhZ2VcbiAgICAgKlxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG5cbiAgICBGbGFnLnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5uYW1lc3BhY2UuZmxhZ3NbdGhpcy5uYW1lXSA9IHRydWU7XG4gICAgICB0aGlzLm5hbWVzcGFjZS5zZW5kLmFwcGx5KHRoaXMubmFtZXNwYWNlLCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBFbWl0IGFuIGV2ZW50XG4gICAgICpcbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgRmxhZy5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMubmFtZXNwYWNlLmZsYWdzW3RoaXMubmFtZV0gPSB0cnVlO1xuICAgICAgdGhpcy5uYW1lc3BhY2UuZW1pdC5hcHBseSh0aGlzLm5hbWVzcGFjZSwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9KSgndW5kZWZpbmVkJyAhPSB0eXBlb2YgaW8gPyBpbyA6IG1vZHVsZS5leHBvcnRzLCAndW5kZWZpbmVkJyAhPSB0eXBlb2YgaW8gPyBpbyA6IG1vZHVsZS5wYXJlbnQuZXhwb3J0cyk7XG5cbiAgLyoqXG4gICAqIHNvY2tldC5pb1xuICAgKiBDb3B5cmlnaHQoYykgMjAxMSBMZWFybkJvb3N0IDxkZXZAbGVhcm5ib29zdC5jb20+XG4gICAqIE1JVCBMaWNlbnNlZFxuICAgKi9cblxuICAoZnVuY3Rpb24gKGV4cG9ydHMsIGlvLCBnbG9iYWwpIHtcblxuICAgIC8qKlxuICAgICAqIEV4cG9zZSBjb25zdHJ1Y3Rvci5cbiAgICAgKi9cblxuICAgIGV4cG9ydHMud2Vic29ja2V0ID0gV1M7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgV2ViU29ja2V0IHRyYW5zcG9ydCB1c2VzIHRoZSBIVE1MNSBXZWJTb2NrZXQgQVBJIHRvIGVzdGFibGlzaCBhblxuICAgICAqIHBlcnNpc3RlbnQgY29ubmVjdGlvbiB3aXRoIHRoZSBTb2NrZXQuSU8gc2VydmVyLiBUaGlzIHRyYW5zcG9ydCB3aWxsIGFsc29cbiAgICAgKiBiZSBpbmhlcml0ZWQgYnkgdGhlIEZsYXNoU29ja2V0IGZhbGxiYWNrIGFzIGl0IHByb3ZpZGVzIGEgQVBJIGNvbXBhdGlibGVcbiAgICAgKiBwb2x5ZmlsbCBmb3IgdGhlIFdlYlNvY2tldHMuXG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAZXh0ZW5kcyB7aW8uVHJhbnNwb3J0fVxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG5cbiAgICBmdW5jdGlvbiBXUyhzb2NrZXQpIHtcbiAgICAgIGlvLlRyYW5zcG9ydC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBJbmhlcml0cyBmcm9tIFRyYW5zcG9ydC5cbiAgICAgKi9cblxuICAgIGlvLnV0aWwuaW5oZXJpdChXUywgaW8uVHJhbnNwb3J0KTtcblxuICAgIC8qKlxuICAgICAqIFRyYW5zcG9ydCBuYW1lXG4gICAgICpcbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgV1MucHJvdG90eXBlLm5hbWUgPSAnd2Vic29ja2V0JztcblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIGEgbmV3IGBXZWJTb2NrZXRgIGNvbm5lY3Rpb24gd2l0aCB0aGUgU29ja2V0LklPIHNlcnZlci4gV2UgYXR0YWNoXG4gICAgICogYWxsIHRoZSBhcHByb3ByaWF0ZSBsaXN0ZW5lcnMgdG8gaGFuZGxlIHRoZSByZXNwb25zZXMgZnJvbSB0aGUgc2VydmVyLlxuICAgICAqXG4gICAgICogQHJldHVybnMge1RyYW5zcG9ydH1cbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgV1MucHJvdG90eXBlLm9wZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSBpby51dGlsLnF1ZXJ5KHRoaXMuc29ja2V0Lm9wdGlvbnMucXVlcnkpLFxuICAgICAgICAgIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIFNvY2tldDtcblxuICAgICAgaWYgKCFTb2NrZXQpIHtcbiAgICAgICAgU29ja2V0ID0gZ2xvYmFsLk1veldlYlNvY2tldCB8fCBnbG9iYWwuV2ViU29ja2V0O1xuICAgICAgfVxuXG4gICAgICB0aGlzLndlYnNvY2tldCA9IG5ldyBTb2NrZXQodGhpcy5wcmVwYXJlVXJsKCkgKyBxdWVyeSk7XG5cbiAgICAgIHRoaXMud2Vic29ja2V0Lm9ub3BlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5vbk9wZW4oKTtcbiAgICAgICAgc2VsZi5zb2NrZXQuc2V0QnVmZmVyKGZhbHNlKTtcbiAgICAgIH07XG4gICAgICB0aGlzLndlYnNvY2tldC5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgc2VsZi5vbkRhdGEoZXYuZGF0YSk7XG4gICAgICB9O1xuICAgICAgdGhpcy53ZWJzb2NrZXQub25jbG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5vbkNsb3NlKCk7XG4gICAgICAgIHNlbGYuc29ja2V0LnNldEJ1ZmZlcih0cnVlKTtcbiAgICAgIH07XG4gICAgICB0aGlzLndlYnNvY2tldC5vbmVycm9yID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgc2VsZi5vbkVycm9yKGUpO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFNlbmQgYSBtZXNzYWdlIHRvIHRoZSBTb2NrZXQuSU8gc2VydmVyLiBUaGUgbWVzc2FnZSB3aWxsIGF1dG9tYXRpY2FsbHkgYmVcbiAgICAgKiBlbmNvZGVkIGluIHRoZSBjb3JyZWN0IG1lc3NhZ2UgZm9ybWF0LlxuICAgICAqXG4gICAgICogQHJldHVybnMge1RyYW5zcG9ydH1cbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgLy8gRG8gdG8gYSBidWcgaW4gdGhlIGN1cnJlbnQgSURldmljZXMgYnJvd3Nlciwgd2UgbmVlZCB0byB3cmFwIHRoZSBzZW5kIGluIGFcbiAgICAvLyBzZXRUaW1lb3V0LCB3aGVuIHRoZXkgcmVzdW1lIGZyb20gc2xlZXBpbmcgdGhlIGJyb3dzZXIgd2lsbCBjcmFzaCBpZlxuICAgIC8vIHdlIGRvbid0IGFsbG93IHRoZSBicm93c2VyIHRpbWUgdG8gZGV0ZWN0IHRoZSBzb2NrZXQgaGFzIGJlZW4gY2xvc2VkXG4gICAgaWYgKGlvLnV0aWwudWEuaURldmljZSkge1xuICAgICAgV1MucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYud2Vic29ja2V0LnNlbmQoZGF0YSk7XG4gICAgICAgIH0sIDApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIFdTLnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgdGhpcy53ZWJzb2NrZXQuc2VuZChkYXRhKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBheWxvYWRcbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gICAgV1MucHJvdG90eXBlLnBheWxvYWQgPSBmdW5jdGlvbiAoYXJyKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGFyci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdGhpcy5wYWNrZXQoYXJyW2ldKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBEaXNjb25uZWN0IHRoZSBlc3RhYmxpc2hlZCBgV2ViU29ja2V0YCBjb25uZWN0aW9uLlxuICAgICAqXG4gICAgICogQHJldHVybnMge1RyYW5zcG9ydH1cbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgV1MucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy53ZWJzb2NrZXQuY2xvc2UoKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIGVycm9ycyB0aGF0IGBXZWJTb2NrZXRgIG1pZ2h0IGJlIGdpdmluZyB3aGVuIHdlXG4gICAgICogYXJlIGF0dGVtcHRpbmcgdG8gY29ubmVjdCBvciBzZW5kIG1lc3NhZ2VzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFcnJvcn0gZSBUaGUgZXJyb3IuXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgICBXUy5wcm90b3R5cGUub25FcnJvciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICB0aGlzLnNvY2tldC5vbkVycm9yKGUpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBhcHByb3ByaWF0ZSBzY2hlbWUgZm9yIHRoZSBVUkkgZ2VuZXJhdGlvbi5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIFdTLnByb3RvdHlwZS5zY2hlbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zb2NrZXQub3B0aW9ucy5zZWN1cmUgPyAnd3NzJyA6ICd3cyc7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgYnJvd3NlciBoYXMgc3VwcG9ydCBmb3IgbmF0aXZlIGBXZWJTb2NrZXRzYCBhbmQgdGhhdFxuICAgICAqIGl0J3Mgbm90IHRoZSBwb2x5ZmlsbCBjcmVhdGVkIGZvciB0aGUgRmxhc2hTb2NrZXQgdHJhbnNwb3J0LlxuICAgICAqXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgV1MuY2hlY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJ1dlYlNvY2tldCcgaW4gZ2xvYmFsICYmICEoJ19fYWRkVGFzaycgaW4gV2ViU29ja2V0KSB8fCAnTW96V2ViU29ja2V0JyBpbiBnbG9iYWw7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHRoZSBgV2ViU29ja2V0YCB0cmFuc3BvcnQgc3VwcG9ydCBjcm9zcyBkb21haW4gY29tbXVuaWNhdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgV1MueGRvbWFpbkNoZWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFkZCB0aGUgdHJhbnNwb3J0IHRvIHlvdXIgcHVibGljIGlvLnRyYW5zcG9ydHMgYXJyYXkuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICAgIGlvLnRyYW5zcG9ydHMucHVzaCgnd2Vic29ja2V0Jyk7XG4gIH0pKCd1bmRlZmluZWQnICE9IHR5cGVvZiBpbyA/IGlvLlRyYW5zcG9ydCA6IG1vZHVsZS5leHBvcnRzLCAndW5kZWZpbmVkJyAhPSB0eXBlb2YgaW8gPyBpbyA6IG1vZHVsZS5wYXJlbnQuZXhwb3J0cywgdGhpcyk7XG5cbiAgLyoqXG4gICAqIHNvY2tldC5pb1xuICAgKiBDb3B5cmlnaHQoYykgMjAxMSBMZWFybkJvb3N0IDxkZXZAbGVhcm5ib29zdC5jb20+XG4gICAqIE1JVCBMaWNlbnNlZFxuICAgKi9cblxuICAoZnVuY3Rpb24gKGV4cG9ydHMsIGlvLCBnbG9iYWwpIHtcblxuICAgIC8qKlxuICAgICAqIEV4cG9zZSBjb25zdHJ1Y3Rvci5cbiAgICAgKlxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG5cbiAgICBleHBvcnRzLlhIUiA9IFhIUjtcblxuICAgIC8qKlxuICAgICAqIFhIUiBjb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICogQGNvc3RydWN0b3JcbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgZnVuY3Rpb24gWEhSKHNvY2tldCkge1xuICAgICAgaWYgKCFzb2NrZXQpIHJldHVybjtcblxuICAgICAgaW8uVHJhbnNwb3J0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB0aGlzLnNlbmRCdWZmZXIgPSBbXTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogSW5oZXJpdHMgZnJvbSBUcmFuc3BvcnQuXG4gICAgICovXG5cbiAgICBpby51dGlsLmluaGVyaXQoWEhSLCBpby5UcmFuc3BvcnQpO1xuXG4gICAgLyoqXG4gICAgICogRXN0YWJsaXNoIGEgY29ubmVjdGlvblxuICAgICAqXG4gICAgICogQHJldHVybnMge1RyYW5zcG9ydH1cbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgWEhSLnByb3RvdHlwZS5vcGVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5zb2NrZXQuc2V0QnVmZmVyKGZhbHNlKTtcbiAgICAgIHRoaXMub25PcGVuKCk7XG4gICAgICB0aGlzLmdldCgpO1xuXG4gICAgICAvLyB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSB0aGUgcmVxdWVzdCBzdWNjZWVkcyBzaW5jZSB3ZSBoYXZlIG5vIGluZGljYXRpb25cbiAgICAgIC8vIHdoZXRoZXIgdGhlIHJlcXVlc3Qgb3BlbmVkIG9yIG5vdCB1bnRpbCBpdCBzdWNjZWVkZWQuXG4gICAgICB0aGlzLnNldENsb3NlVGltZW91dCgpO1xuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgd2UgbmVlZCB0byBzZW5kIGRhdGEgdG8gdGhlIFNvY2tldC5JTyBzZXJ2ZXIsIGlmIHdlIGhhdmUgZGF0YSBpbiBvdXJcbiAgICAgKiBidWZmZXIgd2UgZW5jb2RlIGl0IGFuZCBmb3J3YXJkIGl0IHRvIHRoZSBgcG9zdGAgbWV0aG9kLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgICBYSFIucHJvdG90eXBlLnBheWxvYWQgPSBmdW5jdGlvbiAocGF5bG9hZCkge1xuICAgICAgdmFyIG1zZ3MgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBwYXlsb2FkLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBtc2dzLnB1c2goaW8ucGFyc2VyLmVuY29kZVBhY2tldChwYXlsb2FkW2ldKSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2VuZChpby5wYXJzZXIuZW5jb2RlUGF5bG9hZChtc2dzKSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFNlbmQgZGF0YSB0byB0aGUgU29ja2V0LklPIHNlcnZlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhIFRoZSBtZXNzYWdlXG4gICAgICogQHJldHVybnMge1RyYW5zcG9ydH1cbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgWEhSLnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIHRoaXMucG9zdChkYXRhKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBQb3N0cyBhIGVuY29kZWQgbWVzc2FnZSB0byB0aGUgU29ja2V0LklPIHNlcnZlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhIEEgZW5jb2RlZCBtZXNzYWdlLlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gICAgZnVuY3Rpb24gZW1wdHkoKSB7fTtcblxuICAgIFhIUi5wcm90b3R5cGUucG9zdCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICB0aGlzLnNvY2tldC5zZXRCdWZmZXIodHJ1ZSk7XG5cbiAgICAgIGZ1bmN0aW9uIHN0YXRlQ2hhbmdlKCkge1xuICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgICB0aGlzLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGVtcHR5O1xuICAgICAgICAgIHNlbGYucG9zdGluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09IDIwMCkge1xuICAgICAgICAgICAgc2VsZi5zb2NrZXQuc2V0QnVmZmVyKGZhbHNlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZi5vbkNsb3NlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG9ubG9hZCgpIHtcbiAgICAgICAgdGhpcy5vbmxvYWQgPSBlbXB0eTtcbiAgICAgICAgc2VsZi5zb2NrZXQuc2V0QnVmZmVyKGZhbHNlKTtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuc2VuZFhIUiA9IHRoaXMucmVxdWVzdCgnUE9TVCcpO1xuXG4gICAgICBpZiAoZ2xvYmFsLlhEb21haW5SZXF1ZXN0ICYmIHRoaXMuc2VuZFhIUiBpbnN0YW5jZW9mIFhEb21haW5SZXF1ZXN0KSB7XG4gICAgICAgIHRoaXMuc2VuZFhIUi5vbmxvYWQgPSB0aGlzLnNlbmRYSFIub25lcnJvciA9IG9ubG9hZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2VuZFhIUi5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBzdGF0ZUNoYW5nZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZW5kWEhSLnNlbmQoZGF0YSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERpc2Nvbm5lY3RzIHRoZSBlc3RhYmxpc2hlZCBgWEhSYCBjb25uZWN0aW9uLlxuICAgICAqXG4gICAgICogQHJldHVybnMge1RyYW5zcG9ydH1cbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgWEhSLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMub25DbG9zZSgpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlcyBhIGNvbmZpZ3VyZWQgWEhSIHJlcXVlc3RcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVGhlIHVybCB0aGF0IG5lZWRzIHRvIGJlIHJlcXVlc3RlZC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kIFRoZSBtZXRob2QgdGhlIHJlcXVlc3Qgc2hvdWxkIHVzZS5cbiAgICAgKiBAcmV0dXJucyB7WE1MSHR0cFJlcXVlc3R9XG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgICBYSFIucHJvdG90eXBlLnJlcXVlc3QgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgICB2YXIgcmVxID0gaW8udXRpbC5yZXF1ZXN0KHRoaXMuc29ja2V0LmlzWERvbWFpbigpKSxcbiAgICAgICAgICBxdWVyeSA9IGlvLnV0aWwucXVlcnkodGhpcy5zb2NrZXQub3B0aW9ucy5xdWVyeSwgJ3Q9JyArICtuZXcgRGF0ZSgpKTtcblxuICAgICAgcmVxLm9wZW4obWV0aG9kIHx8ICdHRVQnLCB0aGlzLnByZXBhcmVVcmwoKSArIHF1ZXJ5LCB0cnVlKTtcblxuICAgICAgaWYgKG1ldGhvZCA9PSAnUE9TVCcpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAocmVxLnNldFJlcXVlc3RIZWFkZXIpIHtcbiAgICAgICAgICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04Jyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFhEb21haW5SZXF1ZXN0XG4gICAgICAgICAgICByZXEuY29udGVudFR5cGUgPSAndGV4dC9wbGFpbic7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVxO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBzY2hlbWUgdG8gdXNlIGZvciB0aGUgdHJhbnNwb3J0IFVSTHMuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICAgIFhIUi5wcm90b3R5cGUuc2NoZW1lID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc29ja2V0Lm9wdGlvbnMuc2VjdXJlID8gJ2h0dHBzJyA6ICdodHRwJztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGhlIFhIUiB0cmFuc3BvcnRzIGFyZSBzdXBwb3J0ZWRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0geGRvbWFpbiBDaGVjayBpZiB3ZSBzdXBwb3J0IGNyb3NzIGRvbWFpbiByZXF1ZXN0cy5cbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgWEhSLmNoZWNrID0gZnVuY3Rpb24gKHNvY2tldCwgeGRvbWFpbikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIHJlcXVlc3QgPSBpby51dGlsLnJlcXVlc3QoeGRvbWFpbiksXG4gICAgICAgICAgICB1c2VzWERvbVJlcSA9IGdsb2JhbC5YRG9tYWluUmVxdWVzdCAmJiByZXF1ZXN0IGluc3RhbmNlb2YgWERvbWFpblJlcXVlc3QsXG4gICAgICAgICAgICBzb2NrZXRQcm90b2NvbCA9IHNvY2tldCAmJiBzb2NrZXQub3B0aW9ucyAmJiBzb2NrZXQub3B0aW9ucy5zZWN1cmUgPyAnaHR0cHM6JyA6ICdodHRwOicsXG4gICAgICAgICAgICBpc1hQcm90b2NvbCA9IGdsb2JhbC5sb2NhdGlvbiAmJiBzb2NrZXRQcm90b2NvbCAhPSBnbG9iYWwubG9jYXRpb24ucHJvdG9jb2w7XG4gICAgICAgIGlmIChyZXF1ZXN0ICYmICEodXNlc1hEb21SZXEgJiYgaXNYUHJvdG9jb2wpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHt9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGhlIFhIUiB0cmFuc3BvcnQgc3VwcG9ydHMgY3Jvc3MgZG9tYWluIHJlcXVlc3RzLlxuICAgICAqXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cblxuICAgIFhIUi54ZG9tYWluQ2hlY2sgPSBmdW5jdGlvbiAoc29ja2V0KSB7XG4gICAgICByZXR1cm4gWEhSLmNoZWNrKHNvY2tldCwgdHJ1ZSk7XG4gICAgfTtcbiAgfSkoJ3VuZGVmaW5lZCcgIT0gdHlwZW9mIGlvID8gaW8uVHJhbnNwb3J0IDogbW9kdWxlLmV4cG9ydHMsICd1bmRlZmluZWQnICE9IHR5cGVvZiBpbyA/IGlvIDogbW9kdWxlLnBhcmVudC5leHBvcnRzLCB0aGlzKTtcbiAgLyoqXG4gICAqIHNvY2tldC5pb1xuICAgKiBDb3B5cmlnaHQoYykgMjAxMSBMZWFybkJvb3N0IDxkZXZAbGVhcm5ib29zdC5jb20+XG4gICAqIE1JVCBMaWNlbnNlZFxuICAgKi9cblxuICAoZnVuY3Rpb24gKGV4cG9ydHMsIGlvKSB7XG5cbiAgICAvKipcbiAgICAgKiBFeHBvc2UgY29uc3RydWN0b3IuXG4gICAgICovXG5cbiAgICBleHBvcnRzLmh0bWxmaWxlID0gSFRNTEZpbGU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgSFRNTEZpbGUgdHJhbnNwb3J0IGNyZWF0ZXMgYSBgZm9yZXZlciBpZnJhbWVgIGJhc2VkIHRyYW5zcG9ydFxuICAgICAqIGZvciBJbnRlcm5ldCBFeHBsb3Jlci4gUmVndWxhciBmb3JldmVyIGlmcmFtZSBpbXBsZW1lbnRhdGlvbnMgd2lsbCBcbiAgICAgKiBjb250aW51b3VzbHkgdHJpZ2dlciB0aGUgYnJvd3NlcnMgYnV6eSBpbmRpY2F0b3JzLiBJZiB0aGUgZm9yZXZlciBpZnJhbWVcbiAgICAgKiBpcyBjcmVhdGVkIGluc2lkZSBhIGBodG1sZmlsZWAgdGhlc2UgaW5kaWNhdG9ycyB3aWxsIG5vdCBiZSB0cmlnZ2VkLlxuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQGV4dGVuZHMge2lvLlRyYW5zcG9ydC5YSFJ9XG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cblxuICAgIGZ1bmN0aW9uIEhUTUxGaWxlKHNvY2tldCkge1xuICAgICAgaW8uVHJhbnNwb3J0LlhIUi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBJbmhlcml0cyBmcm9tIFhIUiB0cmFuc3BvcnQuXG4gICAgICovXG5cbiAgICBpby51dGlsLmluaGVyaXQoSFRNTEZpbGUsIGlvLlRyYW5zcG9ydC5YSFIpO1xuXG4gICAgLyoqXG4gICAgICogVHJhbnNwb3J0IG5hbWVcbiAgICAgKlxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG5cbiAgICBIVE1MRmlsZS5wcm90b3R5cGUubmFtZSA9ICdodG1sZmlsZSc7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IEFjLi4uZVggYGh0bWxmaWxlYCB3aXRoIGEgZm9yZXZlciBsb2FkaW5nIGlmcmFtZVxuICAgICAqIHRoYXQgY2FuIGJlIHVzZWQgdG8gbGlzdGVuIHRvIG1lc3NhZ2VzLiBJbnNpZGUgdGhlIGdlbmVyYXRlZFxuICAgICAqIGBodG1sZmlsZWAgYSByZWZlcmVuY2Ugd2lsbCBiZSBtYWRlIHRvIHRoZSBIVE1MRmlsZSB0cmFuc3BvcnQuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICAgIEhUTUxGaWxlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmRvYyA9IG5ldyAod2luZG93W1snQWN0aXZlJ10uY29uY2F0KCdPYmplY3QnKS5qb2luKCdYJyldKSgnaHRtbGZpbGUnKTtcbiAgICAgIHRoaXMuZG9jLm9wZW4oKTtcbiAgICAgIHRoaXMuZG9jLndyaXRlKCc8aHRtbD48L2h0bWw+Jyk7XG4gICAgICB0aGlzLmRvYy5jbG9zZSgpO1xuICAgICAgdGhpcy5kb2MucGFyZW50V2luZG93LnMgPSB0aGlzO1xuXG4gICAgICB2YXIgaWZyYW1lQyA9IHRoaXMuZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgaWZyYW1lQy5jbGFzc05hbWUgPSAnc29ja2V0aW8nO1xuXG4gICAgICB0aGlzLmRvYy5ib2R5LmFwcGVuZENoaWxkKGlmcmFtZUMpO1xuICAgICAgdGhpcy5pZnJhbWUgPSB0aGlzLmRvYy5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcblxuICAgICAgaWZyYW1lQy5hcHBlbmRDaGlsZCh0aGlzLmlmcmFtZSk7XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICBxdWVyeSA9IGlvLnV0aWwucXVlcnkodGhpcy5zb2NrZXQub3B0aW9ucy5xdWVyeSwgJ3Q9JyArICtuZXcgRGF0ZSgpKTtcblxuICAgICAgdGhpcy5pZnJhbWUuc3JjID0gdGhpcy5wcmVwYXJlVXJsKCkgKyBxdWVyeTtcblxuICAgICAgaW8udXRpbC5vbih3aW5kb3csICd1bmxvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYuZGVzdHJveSgpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBTb2NrZXQuSU8gc2VydmVyIHdpbGwgd3JpdGUgc2NyaXB0IHRhZ3MgaW5zaWRlIHRoZSBmb3JldmVyXG4gICAgICogaWZyYW1lLCB0aGlzIGZ1bmN0aW9uIHdpbGwgYmUgdXNlZCBhcyBjYWxsYmFjayBmb3IgdGhlIGluY29taW5nXG4gICAgICogaW5mb3JtYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YSBUaGUgbWVzc2FnZVxuICAgICAqIEBwYXJhbSB7ZG9jdW1lbnR9IGRvYyBSZWZlcmVuY2UgdG8gdGhlIGNvbnRleHRcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICAgIEhUTUxGaWxlLnByb3RvdHlwZS5fID0gZnVuY3Rpb24gKGRhdGEsIGRvYykge1xuICAgICAgLy8gdW5lc2NhcGUgYWxsIGZvcndhcmQgc2xhc2hlcy4gc2VlIEdILTEyNTFcbiAgICAgIGRhdGEgPSBkYXRhLnJlcGxhY2UoL1xcXFxcXC8vZywgJy8nKTtcbiAgICAgIHRoaXMub25EYXRhKGRhdGEpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIHNjcmlwdCA9IGRvYy5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07XG4gICAgICAgIHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95IHRoZSBlc3RhYmxpc2hlZCBjb25uZWN0aW9uLCBpZnJhbWUgYW5kIGBodG1sZmlsZWAuXG4gICAgICogQW5kIGNhbGxzIHRoZSBgQ29sbGVjdEdhcmJhZ2VgIGZ1bmN0aW9uIG9mIEludGVybmV0IEV4cGxvcmVyXG4gICAgICogdG8gcmVsZWFzZSB0aGUgbWVtb3J5LlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgICBIVE1MRmlsZS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLmlmcmFtZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoaXMuaWZyYW1lLnNyYyA9ICdhYm91dDpibGFuayc7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG5cbiAgICAgICAgdGhpcy5kb2MgPSBudWxsO1xuICAgICAgICB0aGlzLmlmcmFtZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuaWZyYW1lKTtcbiAgICAgICAgdGhpcy5pZnJhbWUgPSBudWxsO1xuXG4gICAgICAgIENvbGxlY3RHYXJiYWdlKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERpc2Nvbm5lY3RzIHRoZSBlc3RhYmxpc2hlZCBjb25uZWN0aW9uLlxuICAgICAqXG4gICAgICogQHJldHVybnMge1RyYW5zcG9ydH0gQ2hhaW5pbmcuXG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cblxuICAgIEhUTUxGaWxlLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgcmV0dXJuIGlvLlRyYW5zcG9ydC5YSFIucHJvdG90eXBlLmNsb3NlLmNhbGwodGhpcyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgYnJvd3NlciBzdXBwb3J0cyB0aGlzIHRyYW5zcG9ydC4gVGhlIGJyb3dzZXJcbiAgICAgKiBtdXN0IGhhdmUgYW4gYEFjLi4uZVhPYmplY3RgIGltcGxlbWVudGF0aW9uLlxuICAgICAqXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgSFRNTEZpbGUuY2hlY2sgPSBmdW5jdGlvbiAoc29ja2V0KSB7XG4gICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPSBcInVuZGVmaW5lZFwiICYmIFsnQWN0aXZlJ10uY29uY2F0KCdPYmplY3QnKS5qb2luKCdYJykgaW4gd2luZG93KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIGEgPSBuZXcgKHdpbmRvd1tbJ0FjdGl2ZSddLmNvbmNhdCgnT2JqZWN0Jykuam9pbignWCcpXSkoJ2h0bWxmaWxlJyk7XG4gICAgICAgICAgcmV0dXJuIGEgJiYgaW8uVHJhbnNwb3J0LlhIUi5jaGVjayhzb2NrZXQpO1xuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiBjcm9zcyBkb21haW4gcmVxdWVzdHMgYXJlIHN1cHBvcnRlZC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG5cbiAgICBIVE1MRmlsZS54ZG9tYWluQ2hlY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyB3ZSBjYW4gcHJvYmFibHkgZG8gaGFuZGxpbmcgZm9yIHN1Yi1kb21haW5zLCB3ZSBzaG91bGRcbiAgICAgIC8vIHRlc3QgdGhhdCBpdCdzIGNyb3NzIGRvbWFpbiBidXQgYSBzdWJkb21haW4gaGVyZVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBZGQgdGhlIHRyYW5zcG9ydCB0byB5b3VyIHB1YmxpYyBpby50cmFuc3BvcnRzIGFycmF5LlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgICBpby50cmFuc3BvcnRzLnB1c2goJ2h0bWxmaWxlJyk7XG4gIH0pKCd1bmRlZmluZWQnICE9IHR5cGVvZiBpbyA/IGlvLlRyYW5zcG9ydCA6IG1vZHVsZS5leHBvcnRzLCAndW5kZWZpbmVkJyAhPSB0eXBlb2YgaW8gPyBpbyA6IG1vZHVsZS5wYXJlbnQuZXhwb3J0cyk7XG5cbiAgLyoqXG4gICAqIHNvY2tldC5pb1xuICAgKiBDb3B5cmlnaHQoYykgMjAxMSBMZWFybkJvb3N0IDxkZXZAbGVhcm5ib29zdC5jb20+XG4gICAqIE1JVCBMaWNlbnNlZFxuICAgKi9cblxuICAoZnVuY3Rpb24gKGV4cG9ydHMsIGlvLCBnbG9iYWwpIHtcblxuICAgIC8qKlxuICAgICAqIEV4cG9zZSBjb25zdHJ1Y3Rvci5cbiAgICAgKi9cblxuICAgIGV4cG9ydHNbJ3hoci1wb2xsaW5nJ10gPSBYSFJQb2xsaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIFhIUi1wb2xsaW5nIHRyYW5zcG9ydCB1c2VzIGxvbmcgcG9sbGluZyBYSFIgcmVxdWVzdHMgdG8gY3JlYXRlIGFcbiAgICAgKiBcInBlcnNpc3RlbnRcIiBjb25uZWN0aW9uIHdpdGggdGhlIHNlcnZlci5cbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG5cbiAgICBmdW5jdGlvbiBYSFJQb2xsaW5nKCkge1xuICAgICAgaW8uVHJhbnNwb3J0LlhIUi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBJbmhlcml0cyBmcm9tIFhIUiB0cmFuc3BvcnQuXG4gICAgICovXG5cbiAgICBpby51dGlsLmluaGVyaXQoWEhSUG9sbGluZywgaW8uVHJhbnNwb3J0LlhIUik7XG5cbiAgICAvKipcbiAgICAgKiBNZXJnZSB0aGUgcHJvcGVydGllcyBmcm9tIFhIUiB0cmFuc3BvcnRcbiAgICAgKi9cblxuICAgIGlvLnV0aWwubWVyZ2UoWEhSUG9sbGluZywgaW8uVHJhbnNwb3J0LlhIUik7XG5cbiAgICAvKipcbiAgICAgKiBUcmFuc3BvcnQgbmFtZVxuICAgICAqXG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cblxuICAgIFhIUlBvbGxpbmcucHJvdG90eXBlLm5hbWUgPSAneGhyLXBvbGxpbmcnO1xuXG4gICAgLyoqXG4gICAgICogSW5kaWNhdGVzIHdoZXRoZXIgaGVhcnRiZWF0cyBpcyBlbmFibGVkIGZvciB0aGlzIHRyYW5zcG9ydFxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgICBYSFJQb2xsaW5nLnByb3RvdHlwZS5oZWFydGJlYXRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICAvKiogXG4gICAgICogRXN0YWJsaXNoIGEgY29ubmVjdGlvbiwgZm9yIGlQaG9uZSBhbmQgQW5kcm9pZCB0aGlzIHdpbGwgYmUgZG9uZSBvbmNlIHRoZSBwYWdlXG4gICAgICogaXMgbG9hZGVkLlxuICAgICAqXG4gICAgICogQHJldHVybnMge1RyYW5zcG9ydH0gQ2hhaW5pbmcuXG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cblxuICAgIFhIUlBvbGxpbmcucHJvdG90eXBlLm9wZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIGlvLlRyYW5zcG9ydC5YSFIucHJvdG90eXBlLm9wZW4uY2FsbChzZWxmKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU3RhcnRzIGEgWEhSIHJlcXVlc3QgdG8gd2FpdCBmb3IgaW5jb21pbmcgbWVzc2FnZXMuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICAgIGZ1bmN0aW9uIGVtcHR5KCkge307XG5cbiAgICBYSFJQb2xsaW5nLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXRoaXMuaXNPcGVuKSByZXR1cm47XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgZnVuY3Rpb24gc3RhdGVDaGFuZ2UoKSB7XG4gICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICAgIHRoaXMub25yZWFkeXN0YXRlY2hhbmdlID0gZW1wdHk7XG5cbiAgICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT0gMjAwKSB7XG4gICAgICAgICAgICBzZWxmLm9uRGF0YSh0aGlzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICBzZWxmLmdldCgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWxmLm9uQ2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGZ1bmN0aW9uIG9ubG9hZCgpIHtcbiAgICAgICAgdGhpcy5vbmxvYWQgPSBlbXB0eTtcbiAgICAgICAgdGhpcy5vbmVycm9yID0gZW1wdHk7XG4gICAgICAgIHNlbGYucmV0cnlDb3VudGVyID0gMTtcbiAgICAgICAgc2VsZi5vbkRhdGEodGhpcy5yZXNwb25zZVRleHQpO1xuICAgICAgICBzZWxmLmdldCgpO1xuICAgICAgfTtcblxuICAgICAgZnVuY3Rpb24gb25lcnJvcigpIHtcbiAgICAgICAgc2VsZi5yZXRyeUNvdW50ZXIrKztcbiAgICAgICAgaWYgKCFzZWxmLnJldHJ5Q291bnRlciB8fCBzZWxmLnJldHJ5Q291bnRlciA+IDMpIHtcbiAgICAgICAgICBzZWxmLm9uQ2xvc2UoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxmLmdldCgpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB0aGlzLnhociA9IHRoaXMucmVxdWVzdCgpO1xuXG4gICAgICBpZiAoZ2xvYmFsLlhEb21haW5SZXF1ZXN0ICYmIHRoaXMueGhyIGluc3RhbmNlb2YgWERvbWFpblJlcXVlc3QpIHtcbiAgICAgICAgdGhpcy54aHIub25sb2FkID0gb25sb2FkO1xuICAgICAgICB0aGlzLnhoci5vbmVycm9yID0gb25lcnJvcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMueGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IHN0YXRlQ2hhbmdlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnhoci5zZW5kKG51bGwpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIHVuY2xlYW4gY2xvc2UgYmVoYXZpb3IuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICAgIFhIUlBvbGxpbmcucHJvdG90eXBlLm9uQ2xvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpby5UcmFuc3BvcnQuWEhSLnByb3RvdHlwZS5vbkNsb3NlLmNhbGwodGhpcyk7XG5cbiAgICAgIGlmICh0aGlzLnhocikge1xuICAgICAgICB0aGlzLnhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSB0aGlzLnhoci5vbmxvYWQgPSB0aGlzLnhoci5vbmVycm9yID0gZW1wdHk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhpcy54aHIuYWJvcnQoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgdGhpcy54aHIgPSBudWxsO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBXZWJraXQgYmFzZWQgYnJvd3NlcnMgc2hvdyBhIGluZmluaXQgc3Bpbm5lciB3aGVuIHlvdSBzdGFydCBhIFhIUiByZXF1ZXN0XG4gICAgICogYmVmb3JlIHRoZSBicm93c2VycyBvbmxvYWQgZXZlbnQgaXMgY2FsbGVkIHNvIHdlIG5lZWQgdG8gZGVmZXIgb3BlbmluZyBvZlxuICAgICAqIHRoZSB0cmFuc3BvcnQgdW50aWwgdGhlIG9ubG9hZCBldmVudCBpcyBjYWxsZWQuIFdyYXBwaW5nIHRoZSBjYiBpbiBvdXJcbiAgICAgKiBkZWZlciBtZXRob2Qgc29sdmUgdGhpcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U29ja2V0fSBzb2NrZXQgVGhlIHNvY2tldCBpbnN0YW5jZSB0aGF0IG5lZWRzIGEgdHJhbnNwb3J0XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGNhbGxiYWNrXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgICBYSFJQb2xsaW5nLnByb3RvdHlwZS5yZWFkeSA9IGZ1bmN0aW9uIChzb2NrZXQsIGZuKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIGlvLnV0aWwuZGVmZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICBmbi5jYWxsKHNlbGYpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFkZCB0aGUgdHJhbnNwb3J0IHRvIHlvdXIgcHVibGljIGlvLnRyYW5zcG9ydHMgYXJyYXkuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICAgIGlvLnRyYW5zcG9ydHMucHVzaCgneGhyLXBvbGxpbmcnKTtcbiAgfSkoJ3VuZGVmaW5lZCcgIT0gdHlwZW9mIGlvID8gaW8uVHJhbnNwb3J0IDogbW9kdWxlLmV4cG9ydHMsICd1bmRlZmluZWQnICE9IHR5cGVvZiBpbyA/IGlvIDogbW9kdWxlLnBhcmVudC5leHBvcnRzLCB0aGlzKTtcblxuICAvKipcbiAgICogc29ja2V0LmlvXG4gICAqIENvcHlyaWdodChjKSAyMDExIExlYXJuQm9vc3QgPGRldkBsZWFybmJvb3N0LmNvbT5cbiAgICogTUlUIExpY2Vuc2VkXG4gICAqL1xuXG4gIChmdW5jdGlvbiAoZXhwb3J0cywgaW8sIGdsb2JhbCkge1xuICAgIC8qKlxuICAgICAqIFRoZXJlIGlzIGEgd2F5IHRvIGhpZGUgdGhlIGxvYWRpbmcgaW5kaWNhdG9yIGluIEZpcmVmb3guIElmIHlvdSBjcmVhdGUgYW5kXG4gICAgICogcmVtb3ZlIGEgaWZyYW1lIGl0IHdpbGwgc3RvcCBzaG93aW5nIHRoZSBjdXJyZW50IGxvYWRpbmcgaW5kaWNhdG9yLlxuICAgICAqIFVuZm9ydHVuYXRlbHkgd2UgY2FuJ3QgZmVhdHVyZSBkZXRlY3QgdGhhdCBhbmQgVUEgc25pZmZpbmcgaXMgZXZpbC5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gICAgdmFyIGluZGljYXRvciA9IGdsb2JhbC5kb2N1bWVudCAmJiBcIk1vekFwcGVhcmFuY2VcIiBpbiBnbG9iYWwuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlO1xuXG4gICAgLyoqXG4gICAgICogRXhwb3NlIGNvbnN0cnVjdG9yLlxuICAgICAqL1xuXG4gICAgZXhwb3J0c1snanNvbnAtcG9sbGluZyddID0gSlNPTlBQb2xsaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIEpTT05QIHRyYW5zcG9ydCBjcmVhdGVzIGFuIHBlcnNpc3RlbnQgY29ubmVjdGlvbiBieSBkeW5hbWljYWxseVxuICAgICAqIGluc2VydGluZyBhIHNjcmlwdCB0YWcgaW4gdGhlIHBhZ2UuIFRoaXMgc2NyaXB0IHRhZyB3aWxsIHJlY2VpdmUgdGhlXG4gICAgICogaW5mb3JtYXRpb24gb2YgdGhlIFNvY2tldC5JTyBzZXJ2ZXIuIFdoZW4gbmV3IGluZm9ybWF0aW9uIGlzIHJlY2VpdmVkXG4gICAgICogaXQgY3JlYXRlcyBhIG5ldyBzY3JpcHQgdGFnIGZvciB0aGUgbmV3IGRhdGEgc3RyZWFtLlxuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQGV4dGVuZHMge2lvLlRyYW5zcG9ydC54aHItcG9sbGluZ31cbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgZnVuY3Rpb24gSlNPTlBQb2xsaW5nKHNvY2tldCkge1xuICAgICAgaW8uVHJhbnNwb3J0Wyd4aHItcG9sbGluZyddLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgIHRoaXMuaW5kZXggPSBpby5qLmxlbmd0aDtcblxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICBpby5qLnB1c2goZnVuY3Rpb24gKG1zZykge1xuICAgICAgICBzZWxmLl8obXNnKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBJbmhlcml0cyBmcm9tIFhIUiBwb2xsaW5nIHRyYW5zcG9ydC5cbiAgICAgKi9cblxuICAgIGlvLnV0aWwuaW5oZXJpdChKU09OUFBvbGxpbmcsIGlvLlRyYW5zcG9ydFsneGhyLXBvbGxpbmcnXSk7XG5cbiAgICAvKipcbiAgICAgKiBUcmFuc3BvcnQgbmFtZVxuICAgICAqXG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cblxuICAgIEpTT05QUG9sbGluZy5wcm90b3R5cGUubmFtZSA9ICdqc29ucC1wb2xsaW5nJztcblxuICAgIC8qKlxuICAgICAqIFBvc3RzIGEgZW5jb2RlZCBtZXNzYWdlIHRvIHRoZSBTb2NrZXQuSU8gc2VydmVyIHVzaW5nIGFuIGlmcmFtZS5cbiAgICAgKiBUaGUgaWZyYW1lIGlzIHVzZWQgYmVjYXVzZSBzY3JpcHQgdGFncyBjYW4gY3JlYXRlIFBPU1QgYmFzZWQgcmVxdWVzdHMuXG4gICAgICogVGhlIGlmcmFtZSBpcyBwb3NpdGlvbmVkIG91dHNpZGUgb2YgdGhlIHZpZXcgc28gdGhlIHVzZXIgZG9lcyBub3RcbiAgICAgKiBub3RpY2UgaXQncyBleGlzdGVuY2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YSBBIGVuY29kZWQgbWVzc2FnZS5cbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICAgIEpTT05QUG9sbGluZy5wcm90b3R5cGUucG9zdCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgcXVlcnkgPSBpby51dGlsLnF1ZXJ5KHRoaXMuc29ja2V0Lm9wdGlvbnMucXVlcnksICd0PScgKyArbmV3IERhdGUoKSArICcmaT0nICsgdGhpcy5pbmRleCk7XG5cbiAgICAgIGlmICghdGhpcy5mb3JtKSB7XG4gICAgICAgIHZhciBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpLFxuICAgICAgICAgICAgYXJlYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyksXG4gICAgICAgICAgICBpZCA9IHRoaXMuaWZyYW1lSWQgPSAnc29ja2V0aW9faWZyYW1lXycgKyB0aGlzLmluZGV4LFxuICAgICAgICAgICAgaWZyYW1lO1xuXG4gICAgICAgIGZvcm0uY2xhc3NOYW1lID0gJ3NvY2tldGlvJztcbiAgICAgICAgZm9ybS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGZvcm0uc3R5bGUudG9wID0gJzBweCc7XG4gICAgICAgIGZvcm0uc3R5bGUubGVmdCA9ICcwcHgnO1xuICAgICAgICBmb3JtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIGZvcm0udGFyZ2V0ID0gaWQ7XG4gICAgICAgIGZvcm0ubWV0aG9kID0gJ1BPU1QnO1xuICAgICAgICBmb3JtLnNldEF0dHJpYnV0ZSgnYWNjZXB0LWNoYXJzZXQnLCAndXRmLTgnKTtcbiAgICAgICAgYXJlYS5uYW1lID0gJ2QnO1xuICAgICAgICBmb3JtLmFwcGVuZENoaWxkKGFyZWEpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGZvcm0pO1xuXG4gICAgICAgIHRoaXMuZm9ybSA9IGZvcm07XG4gICAgICAgIHRoaXMuYXJlYSA9IGFyZWE7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZm9ybS5hY3Rpb24gPSB0aGlzLnByZXBhcmVVcmwoKSArIHF1ZXJ5O1xuXG4gICAgICBmdW5jdGlvbiBjb21wbGV0ZSgpIHtcbiAgICAgICAgaW5pdElmcmFtZSgpO1xuICAgICAgICBzZWxmLnNvY2tldC5zZXRCdWZmZXIoZmFsc2UpO1xuICAgICAgfTtcblxuICAgICAgZnVuY3Rpb24gaW5pdElmcmFtZSgpIHtcbiAgICAgICAgaWYgKHNlbGYuaWZyYW1lKSB7XG4gICAgICAgICAgc2VsZi5mb3JtLnJlbW92ZUNoaWxkKHNlbGYuaWZyYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gaWU2IGR5bmFtaWMgaWZyYW1lcyB3aXRoIHRhcmdldD1cIlwiIHN1cHBvcnQgKHRoYW5rcyBDaHJpcyBMYW1iYWNoZXIpXG4gICAgICAgICAgaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnPGlmcmFtZSBuYW1lPVwiJyArIHNlbGYuaWZyYW1lSWQgKyAnXCI+Jyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgICAgICAgICBpZnJhbWUubmFtZSA9IHNlbGYuaWZyYW1lSWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZnJhbWUuaWQgPSBzZWxmLmlmcmFtZUlkO1xuXG4gICAgICAgIHNlbGYuZm9ybS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICAgICAgICBzZWxmLmlmcmFtZSA9IGlmcmFtZTtcbiAgICAgIH07XG5cbiAgICAgIGluaXRJZnJhbWUoKTtcblxuICAgICAgLy8gd2UgdGVtcG9yYXJpbHkgc3RyaW5naWZ5IHVudGlsIHdlIGZpZ3VyZSBvdXQgaG93IHRvIHByZXZlbnRcbiAgICAgIC8vIGJyb3dzZXJzIGZyb20gdHVybmluZyBgXFxuYCBpbnRvIGBcXHJcXG5gIGluIGZvcm0gaW5wdXRzXG4gICAgICB0aGlzLmFyZWEudmFsdWUgPSBpby5KU09OLnN0cmluZ2lmeShkYXRhKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5mb3JtLnN1Ym1pdCgpO1xuICAgICAgfSBjYXRjaCAoZSkge31cblxuICAgICAgaWYgKHRoaXMuaWZyYW1lLmF0dGFjaEV2ZW50KSB7XG4gICAgICAgIGlmcmFtZS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKHNlbGYuaWZyYW1lLnJlYWR5U3RhdGUgPT0gJ2NvbXBsZXRlJykge1xuICAgICAgICAgICAgY29tcGxldGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmlmcmFtZS5vbmxvYWQgPSBjb21wbGV0ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zb2NrZXQuc2V0QnVmZmVyKHRydWUpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IEpTT05QIHBvbGwgdGhhdCBjYW4gYmUgdXNlZCB0byBsaXN0ZW5cbiAgICAgKiBmb3IgbWVzc2FnZXMgZnJvbSB0aGUgU29ja2V0LklPIHNlcnZlci5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gICAgSlNPTlBQb2xsaW5nLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0JyksXG4gICAgICAgICAgcXVlcnkgPSBpby51dGlsLnF1ZXJ5KHRoaXMuc29ja2V0Lm9wdGlvbnMucXVlcnksICd0PScgKyArbmV3IERhdGUoKSArICcmaT0nICsgdGhpcy5pbmRleCk7XG5cbiAgICAgIGlmICh0aGlzLnNjcmlwdCkge1xuICAgICAgICB0aGlzLnNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuc2NyaXB0KTtcbiAgICAgICAgdGhpcy5zY3JpcHQgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xuICAgICAgc2NyaXB0LnNyYyA9IHRoaXMucHJlcGFyZVVybCgpICsgcXVlcnk7XG4gICAgICBzY3JpcHQub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5vbkNsb3NlKCk7XG4gICAgICB9O1xuXG4gICAgICB2YXIgaW5zZXJ0QXQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07XG4gICAgICBpbnNlcnRBdC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzY3JpcHQsIGluc2VydEF0KTtcbiAgICAgIHRoaXMuc2NyaXB0ID0gc2NyaXB0O1xuXG4gICAgICBpZiAoaW5kaWNhdG9yKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICAgICAgICB9LCAxMDApO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayBmdW5jdGlvbiBmb3IgdGhlIGluY29taW5nIG1lc3NhZ2Ugc3RyZWFtIGZyb20gdGhlIFNvY2tldC5JTyBzZXJ2ZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YSBUaGUgbWVzc2FnZVxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gICAgSlNPTlBQb2xsaW5nLnByb3RvdHlwZS5fID0gZnVuY3Rpb24gKG1zZykge1xuICAgICAgdGhpcy5vbkRhdGEobXNnKTtcbiAgICAgIGlmICh0aGlzLmlzT3Blbikge1xuICAgICAgICB0aGlzLmdldCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBpbmRpY2F0b3IgaGFjayBvbmx5IHdvcmtzIGFmdGVyIG9ubG9hZFxuICAgICAqXG4gICAgICogQHBhcmFtIHtTb2NrZXR9IHNvY2tldCBUaGUgc29ja2V0IGluc3RhbmNlIHRoYXQgbmVlZHMgYSB0cmFuc3BvcnRcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgY2FsbGJhY2tcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICAgIEpTT05QUG9sbGluZy5wcm90b3R5cGUucmVhZHkgPSBmdW5jdGlvbiAoc29ja2V0LCBmbikge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgaWYgKCFpbmRpY2F0b3IpIHJldHVybiBmbi5jYWxsKHRoaXMpO1xuXG4gICAgICBpby51dGlsLmxvYWQoZnVuY3Rpb24gKCkge1xuICAgICAgICBmbi5jYWxsKHNlbGYpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBicm93c2VyIHN1cHBvcnRzIHRoaXMgdHJhbnNwb3J0LlxuICAgICAqXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgSlNPTlBQb2xsaW5nLmNoZWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICdkb2N1bWVudCcgaW4gZ2xvYmFsO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiBjcm9zcyBkb21haW4gcmVxdWVzdHMgYXJlIHN1cHBvcnRlZFxuICAgICAqXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cblxuICAgIEpTT05QUG9sbGluZy54ZG9tYWluQ2hlY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWRkIHRoZSB0cmFuc3BvcnQgdG8geW91ciBwdWJsaWMgaW8udHJhbnNwb3J0cyBhcnJheS5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gICAgaW8udHJhbnNwb3J0cy5wdXNoKCdqc29ucC1wb2xsaW5nJyk7XG4gIH0pKCd1bmRlZmluZWQnICE9IHR5cGVvZiBpbyA/IGlvLlRyYW5zcG9ydCA6IG1vZHVsZS5leHBvcnRzLCAndW5kZWZpbmVkJyAhPSB0eXBlb2YgaW8gPyBpbyA6IG1vZHVsZS5wYXJlbnQuZXhwb3J0cywgdGhpcyk7XG5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFtdLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gaW87XG4gICAgfSk7XG4gIH1cbn0pKCk7XG5cbmNjLl9SRnBvcCgpOyJdfQ==
