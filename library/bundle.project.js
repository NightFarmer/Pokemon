require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"NewScript":[function(require,module,exports){
cc._RFpush(module, 'd0e6dXEgdFGA5wAuyarQS/H', 'NewScript');
// game\image\NewScript.js

"use strict";

cc.Class({
    "extends": cc.Component,

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
    },

    // use this for initialization
    onLoad: function onLoad() {

        this.node.on("touchend", function (event) {
            console.info("xxxxxxxxxxxxxxxxxxxxxxxxxx");
            event.stopPropagation();
        }, this);
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"app":[function(require,module,exports){
cc._RFpush(module, '280c3rsZJJKnZ9RqbALVwtK', 'app');
// common\app.js

'use strict';

cc.Class({
    'extends': cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {

        // this.label.string = this.text;
        // console.info(this.player.getChildByName("username"))

        var self = this;

        if (cc.sys.isNative) {
            window.io = SocketIO;
        } else {
            window.io = require('socket.io');
        }
        // this.label.string = window.io;
        socket = io('https://testnode-nightfarmer.c9users.io');

        // console.info("2");
        // //begin---------------登录处理-----------------------//
        //socket.emit("new message", "aaaaaaaaaaaaaaaaaaaa");

        var username = "玩家" + Math.floor(cc.random0To1() * 100);
        user = {
            username: username,
            sex: "man",
            password: "123456",
            position: {
                x: 0,
                y: 0
            },
            target: {
                x: -1,
                y: -1
            }
        };

        cc.game.addPersistRootNode(this.node);
        console.info("yizhuce");
    },

    // called every frame
    update: function update(dt) {}
});

cc._RFpop();
},{"socket.io":"socket.io"}],"form":[function(require,module,exports){
cc._RFpush(module, '6ffd9QDk7ZEI4EhFCenmlBM', 'form');
// login\script\form.js

"use strict";

cc.Class({
    "extends": cc.Component,

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
    },

    // use this for initialization
    onLoad: function onLoad() {},

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    login: function login() {
        cc.director.loadScene("game");
    },

    register: function register() {}
});

cc._RFpop();
},{}],"game":[function(require,module,exports){
cc._RFpush(module, 'dd22aGTkx5EkrZN1Zkla8N/', 'game');
// game\script\game.js

"use strict";

cc.Class({
    "extends": cc.Component,

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
        playground: {
            "default": null,
            type: cc.Node
        },

        player: {
            "default": null,
            type: cc.Node
        },
        otherPlayer: {
            "default": null,
            type: cc.Prefab
        },

        text: 'Hello, World!',
        _playerName: {
            "default": null,
            type: cc.Label
        },
        _allPlayer: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        var self = this;
        this._allPlayer = {};
        //var app = cc.director.getScene().getChildByName("app");
        //console.info(app);
        //var appjs = app.getComponent("app");
        //console.info(appjs)
        this.player.getComponent("otherPlayer").isTrue = false;
        this._playerName = this.player.getChildByName("username");
        this._playerName._components[0].string = user.username;

        user.position = { x: this.player.x, y: this.player.y };

        socket.on("connected", function (msg) {
            console.info(msg);
            if (user !== undefined) {
                user.position.x = self.player.x;
                user.position.y = self.player.y;
                console.info(user, "重连");
                socket.emit("reLogin", user);
            } else {
                console.info("连接成功");
            }
        });

        socket.on("loginResult", function (data) {
            if (data.result) {
                self._playerName._components[0].string = user.username;
                if (data.users && data.users[user.username]) {
                    delete data.users[user.username];
                }
                for (var tempPlayerName in data.users) {
                    var onePlayer = undefined;
                    var tempPlayer = data.users[tempPlayerName];
                    onePlayer = self._allPlayer[tempPlayerName];
                    if (!onePlayer) {
                        onePlayer = cc.instantiate(self.otherPlayer);
                    }
                    onePlayer.setPosition(cc.p(tempPlayer.position.x, tempPlayer.position.y));
                    onePlayer.getChildByName("username")._components[0].string = tempPlayer.username;
                    self.playground.addChild(onePlayer);
                    self._allPlayer[tempPlayerName] = onePlayer;
                    onePlayer.info = tempPlayer;
                    if (-1 != tempPlayer.target.x || -1 != tempPlayer.target.y) {
                        var playerToMove = onePlayer.getComponent("otherPlayer");
                        playerToMove.toMove(tempPlayer.target.x, tempPlayer.target.y, self.playground.getComponent("ground").midu);
                    }
                }
            } else {
                alert(data.msg);
            }
        });

        socket.on("userLeft", function (data) {
            console.info("<p>" + data.username + " 离开</p>");
            var onePlayer = self._allPlayer[data.username];
            if (onePlayer) {
                //onePlayer.removeFromParent()
                onePlayer.destroy();
            }
            delete self._allPlayer[data.username];
        });
        socket.on("userJoin", function (data) {
            console.info(data, " 加入");
            var onePlayer = self._allPlayer[data.username];
            if (!onePlayer) {
                onePlayer = cc.instantiate(self.otherPlayer);
            }
            onePlayer.setPosition(cc.p(data.position.x, data.position.y));
            onePlayer.getChildByName("username")._components[0].string = data.username;
            self.playground.addChild(onePlayer);
            self._allPlayer[data.username] = onePlayer;
            onePlayer.info = data;
        });

        socket.emit("login", user);

        socket.on("onOthersMove", function (data) {
            console.info("移动", data);
            var playerToMove = self._allPlayer[data.username].getComponent("otherPlayer");
            playerToMove.toMove(data.target.x, data.target.y, self.playground.getComponent("ground").midu);
        });

        self.node.on('toMove', function (event) {
            user.target = event.targetPoint;
            user.position = event.locPosition;
            // console.info("xxxx",user)
            socket.emit("toMove", user);
        }, this);
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"ground":[function(require,module,exports){
cc._RFpush(module, '4d612J0f6VIarqHA0vlwqYq', 'ground');
// game\script\ground.js

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
            type: cc.Node
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

        var playerOnScreenX = this.player.x + this.node.x;
        var playerOnScreenY = this.player.y + this.node.y;
        this.node.x = this.node.x - playerOnScreenX;
        this.node.y = this.node.y - playerOnScreenY;

        // var myUtil = self.getComponent('myUtil');  //这次我们不用require 我们用组件的方式
        //我们将myUtil.js扔到层级管理器的background的属性检查器中

        var onClick = function onClick(event) {
            var touch = event.touch;
            // console.info(touch)
            var myevent = new cc.Event.EventCustom('myClick', true); //这个是下一部分的内容
            myevent.setUserData(touch);

            this.node.dispatchEvent(myevent);
            var mapAbsX = self.node.x + self.canvas.node.width / 2; //地图的世界坐标
            var mapAbsY = self.node.y + self.canvas.node.height / 2;
            // console.info(absX)
            //this.player.string=touch;
            //console.info(event);
            var eventOnMapX = touch.getLocationX() - mapAbsX;
            var eventOnMapY = touch.getLocationY() - mapAbsY;
            // console.info(eventOnMapX, eventOnMapY) //点击的地图坐标
            this.player.stopAllActions();
            this.node.stopAllActions();
            this.toMove(eventOnMapX, eventOnMapY); //然后移动就行了
            var moveEvent = new cc.Event('toMove', true);
            moveEvent.targetPoint = { x: eventOnMapX, y: eventOnMapY };
            moveEvent.locPosition = { x: self.player.x, y: self.player.y };
            this.node.dispatchEvent(moveEvent);
        };
        // this.node.on('mouseup', onClick, this);
        this.node.on('touchend', onClick, this);
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
        var moveUtil = this.getComponent('moveUtil');
        var playerX = Math.round(this.player.x / self.midu);
        var playerY = Math.round(this.player.y / self.midu);
        var descX = Math.round(x / self.midu);
        var descY = Math.round(y / self.midu);
        if (playerX == descX && playerY == descY) return;
        var path = moveUtil.find_path([playerX, playerY], [descX, descY]);
        var steps = path.map(function (node) {
            return { x: node[0] * self.midu, y: node[1] * self.midu };
        });
        //this.playerMoveSteps = [{x:x,y:y}];
        this.playerMoveSteps = steps;
        this.moveByStep();
    },

    moveByStep: function moveByStep(steps) {
        var step = this.playerMoveSteps.shift();
        if (step === undefined) {
            user.position = { x: this.player.x, y: this.player.y };
            user.target = { x: -1, y: -1 };
            socket.emit("playerStand", user);
            return;
        }
        var distance = Math.sqrt(Math.pow(this.player.x - step.x, 2) + Math.pow(this.player.y - step.y, 2));
        var moveTime = distance / 100 / this.speed;
        this.player.runAction( //开始移动吧 
        cc.sequence(cc.moveTo(moveTime, step.x, step.y), cc.callFunc(this.moveByStep, this)));

        var screenDestX = Math.min(this.mapMaxX, Math.max(this.mapMinX, -step.x));
        var screenDestY = Math.min(this.mapMaxY, Math.max(this.mapMinY, -step.y));
        //var screenMoveDistance = Math.sqrt(Math.pow(this.node.x - screenDestX, 2) + Math.pow(this.node.y - screenDestY, 2));
        //var screenMoveTime = screenMoveDistance / 100 / this.speed;
        this.node.runAction(cc.sequence(cc.moveTo(moveTime, screenDestX, screenDestY)));
    }
});

cc._RFpop();
},{}],"menuOnPlayer":[function(require,module,exports){
cc._RFpush(module, '3495bMEa9tLI42Dxd8bjFIO', 'menuOnPlayer');
// game\script\menuOnPlayer.js

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
        player: {
            'default': null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.node.on('touchend', function (event) {
            event.stopPropagation();
        }, this);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    makeFriend: function makeFriend() {
        // event.stopPropagation();
        console.info(this.player.info);
        this.node.active = false;
    },
    pk: function pk() {
        this.node.active = false;
    },
    hehe: function hehe() {
        this.node.active = false;
    }
});

cc._RFpop();
},{}],"moveUtil":[function(require,module,exports){
cc._RFpush(module, '17208IhGTZPIptS6i7XFQUu', 'moveUtil');
// game\script\moveUtil.js

"use strict";

cc.Class({
    "extends": cc.Component,

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
    },

    // use this for initialization
    onLoad: function onLoad() {},

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    find_path: function find_path(start, end, map, marker) {
        var self = this;
        var open = [];
        var close = [];

        var startNode = start;
        var endNode = end;
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
});

cc._RFpop();
},{}],"otherPlayer":[function(require,module,exports){
cc._RFpush(module, '6a90do3QB1OzrdQwaaPG9el', 'otherPlayer');
// game\script\otherPlayer.js

"use strict";

cc.Class({
    "extends": cc.Component,

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
        speed: 1,
        isTrue: true
    },

    // use this for initialization
    onLoad: function onLoad() {
        var self = this;
        var playerImage = this.node.getChildByName("image");

        var onTouch = function onTouch(event) {
            event.stopPropagation();
            if ("undefined" != typeof shownMenu) {
                shownMenu.active = false;
            }
            var menuOnPlayer = this.node.getChildByName("menuOnPlayer");
            shownMenu = menuOnPlayer;
            // var touch = event.touch;
            // var menu  = cc.find("Canvas/menuOnPlayer");
            // menu.x    = touch.getLocationX();
            // menu.y    = touch.getLocationX();
            menuOnPlayer.active = true;
        };
        // this.node.on("touchend", onTouch,this);
        if (self.isTrue) {
            playerImage.on("touchend", onTouch, this);
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    toMove: function toMove(x, y, midu) {
        this.node.stopAllActions();
        var self = this;
        var moveUtil = this.getComponent('moveUtil');
        var playerX = Math.round(this.node.x / midu);
        var playerY = Math.round(this.node.y / midu);
        var descX = Math.round(x / midu);
        var descY = Math.round(y / midu);
        if (playerX == descX && playerY == descY) return;
        var path = moveUtil.find_path([playerX, playerY], [descX, descY]);
        console.info(path);
        var steps = path.map(function (node) {
            return { x: node[0] * midu, y: node[1] * midu };
        });
        //this.playerMoveSteps = [{x:x,y:y}];
        this.playerMoveSteps = steps;
        this.moveByStep();
    },

    moveByStep: function moveByStep(steps) {
        var step = this.playerMoveSteps.shift();
        if (step === undefined) return;
        var distance = Math.sqrt(Math.pow(this.node.x - step.x, 2) + Math.pow(this.node.y - step.y, 2));
        var moveTime = distance / 100 / this.speed;
        this.node.runAction( //开始移动吧 
        cc.sequence(cc.moveTo(moveTime, step.x, step.y), cc.callFunc(this.moveByStep, this)));
    }
});

cc._RFpop();
},{}],"player":[function(require,module,exports){
cc._RFpush(module, 'fcb6aUu2BhJQZEXs6u9YvHK', 'player');
// game\script\player.js

"use strict";

cc.Class({
    "extends": cc.Component,

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
    },

    // use this for initialization
    onLoad: function onLoad() {}

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"socket.io":[function(require,module,exports){
(function (global){
cc._RFpush(module, 'ec6c3gaXHpLq60t8Id7HC44', 'socket.io');
// common\socket.io.js

"use strict";if(!cc.sys.isNative){(function(f){if(typeof exports === "object" && typeof module !== "undefined"){module.exports = f();}else if(typeof define === "function" && define.amd){define([],f);}else {var g;if(typeof window !== "undefined"){g = window;}else if(typeof global !== "undefined"){g = global;}else if(typeof self !== "undefined"){g = self;}else {g = this;}g.io = f();}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require == "function" && require;if(!u && a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '" + o + "'");throw (f.code = "MODULE_NOT_FOUND",f);}var l=n[o] = {exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e);},l,l.exports,e,t,n,r);}return n[o].exports;}var i=typeof require == "function" && require;for(var o=0;o < r.length;o++) s(r[o]);return s;})({1:[function(_dereq_,module,exports){module.exports = _dereq_('./lib/');},{"./lib/":2}],2:[function(_dereq_,module,exports){module.exports = _dereq_('./socket'); /**
                 * Exports parser
                 *
                 * @api public
                 *
                 */module.exports.parser = _dereq_('engine.io-parser');},{"./socket":3,"engine.io-parser":19}],3:[function(_dereq_,module,exports){(function(global){ /**
                     * Module dependencies.
                     */var transports=_dereq_('./transports');var Emitter=_dereq_('component-emitter');var debug=_dereq_('debug')('engine.io-client:socket');var index=_dereq_('indexof');var parser=_dereq_('engine.io-parser');var parseuri=_dereq_('parseuri');var parsejson=_dereq_('parsejson');var parseqs=_dereq_('parseqs'); /**
                     * Module exports.
                     */module.exports = Socket; /**
                     * Noop function.
                     *
                     * @api private
                     */function noop(){} /**
                     * Socket constructor.
                     *
                     * @param {String|Object} uri or options
                     * @param {Object} options
                     * @api public
                     */function Socket(uri,opts){if(!(this instanceof Socket))return new Socket(uri,opts);opts = opts || {};if(uri && 'object' == typeof uri){opts = uri;uri = null;}if(uri){uri = parseuri(uri);opts.hostname = uri.host;opts.secure = uri.protocol == 'https' || uri.protocol == 'wss';opts.port = uri.port;if(uri.query)opts.query = uri.query;}else if(opts.host){opts.hostname = parseuri(opts.host).host;}this.secure = null != opts.secure?opts.secure:global.location && 'https:' == location.protocol;if(opts.hostname && !opts.port){ // if no port is specified manually, use the protocol default
opts.port = this.secure?'443':'80';}this.agent = opts.agent || false;this.hostname = opts.hostname || (global.location?location.hostname:'localhost');this.port = opts.port || (global.location && location.port?location.port:this.secure?443:80);this.query = opts.query || {};if('string' == typeof this.query)this.query = parseqs.decode(this.query);this.upgrade = false !== opts.upgrade;this.path = (opts.path || '/engine.io').replace(/\/$/,'') + '/';this.forceJSONP = !!opts.forceJSONP;this.jsonp = false !== opts.jsonp;this.forceBase64 = !!opts.forceBase64;this.enablesXDR = !!opts.enablesXDR;this.timestampParam = opts.timestampParam || 't';this.timestampRequests = opts.timestampRequests;this.transports = opts.transports || ['polling','websocket'];this.readyState = '';this.writeBuffer = [];this.policyPort = opts.policyPort || 843;this.rememberUpgrade = opts.rememberUpgrade || false;this.binaryType = null;this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;this.perMessageDeflate = false !== opts.perMessageDeflate?opts.perMessageDeflate || {}:false;if(true === this.perMessageDeflate)this.perMessageDeflate = {};if(this.perMessageDeflate && null == this.perMessageDeflate.threshold){this.perMessageDeflate.threshold = 1024;} // SSL options for Node.js client
this.pfx = opts.pfx || null;this.key = opts.key || null;this.passphrase = opts.passphrase || null;this.cert = opts.cert || null;this.ca = opts.ca || null;this.ciphers = opts.ciphers || null;this.rejectUnauthorized = opts.rejectUnauthorized === undefined?null:opts.rejectUnauthorized; // other options for Node.js client
var freeGlobal=typeof global == 'object' && global;if(freeGlobal.global === freeGlobal){if(opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0){this.extraHeaders = opts.extraHeaders;}}this.open();}Socket.priorWebsocketSuccess = false; /**
                     * Mix in `Emitter`.
                     */Emitter(Socket.prototype); /**
                     * Protocol version.
                     *
                     * @api public
                     */Socket.protocol = parser.protocol; // this is an int
/**
                     * Expose deps for legacy compatibility
                     * and standalone browser access.
                     */Socket.Socket = Socket;Socket.Transport = _dereq_('./transport');Socket.transports = _dereq_('./transports');Socket.parser = _dereq_('engine.io-parser'); /**
                     * Creates transport of the given type.
                     *
                     * @param {String} transport name
                     * @return {Transport}
                     * @api private
                     */Socket.prototype.createTransport = function(name){debug('creating transport "%s"',name);var query=clone(this.query); // append engine.io protocol identifier
query.EIO = parser.protocol; // transport name
query.transport = name; // session id if we already have one
if(this.id)query.sid = this.id;var transport=new transports[name]({agent:this.agent,hostname:this.hostname,port:this.port,secure:this.secure,path:this.path,query:query,forceJSONP:this.forceJSONP,jsonp:this.jsonp,forceBase64:this.forceBase64,enablesXDR:this.enablesXDR,timestampRequests:this.timestampRequests,timestampParam:this.timestampParam,policyPort:this.policyPort,socket:this,pfx:this.pfx,key:this.key,passphrase:this.passphrase,cert:this.cert,ca:this.ca,ciphers:this.ciphers,rejectUnauthorized:this.rejectUnauthorized,perMessageDeflate:this.perMessageDeflate,extraHeaders:this.extraHeaders});return transport;};function clone(obj){var o={};for(var i in obj) {if(obj.hasOwnProperty(i)){o[i] = obj[i];}}return o;} /**
                     * Initializes transport to use and starts probe.
                     *
                     * @api private
                     */Socket.prototype.open = function(){var transport;if(this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') != -1){transport = 'websocket';}else if(0 === this.transports.length){ // Emit error on next tick so it can be listened to
var self=this;setTimeout(function(){self.emit('error','No transports available');},0);return;}else {transport = this.transports[0];}this.readyState = 'opening'; // Retry with the next transport if the transport is disabled (jsonp: false)
try{transport = this.createTransport(transport);}catch(e) {this.transports.shift();this.open();return;}transport.open();this.setTransport(transport);}; /**
                     * Sets the current transport. Disables the existing one (if any).
                     *
                     * @api private
                     */Socket.prototype.setTransport = function(transport){debug('setting transport %s',transport.name);var self=this;if(this.transport){debug('clearing existing transport %s',this.transport.name);this.transport.removeAllListeners();} // set up transport
this.transport = transport; // set up transport listeners
transport.on('drain',function(){self.onDrain();}).on('packet',function(packet){self.onPacket(packet);}).on('error',function(e){self.onError(e);}).on('close',function(){self.onClose('transport close');});}; /**
                     * Probes a transport.
                     *
                     * @param {String} transport name
                     * @api private
                     */Socket.prototype.probe = function(name){debug('probing transport "%s"',name);var transport=this.createTransport(name,{probe:1}),failed=false,self=this;Socket.priorWebsocketSuccess = false;function onTransportOpen(){if(self.onlyBinaryUpgrades){var upgradeLosesBinary=!this.supportsBinary && self.transport.supportsBinary;failed = failed || upgradeLosesBinary;}if(failed)return;debug('probe transport "%s" opened',name);transport.send([{type:'ping',data:'probe'}]);transport.once('packet',function(msg){if(failed)return;if('pong' == msg.type && 'probe' == msg.data){debug('probe transport "%s" pong',name);self.upgrading = true;self.emit('upgrading',transport);if(!transport)return;Socket.priorWebsocketSuccess = 'websocket' == transport.name;debug('pausing current transport "%s"',self.transport.name);self.transport.pause(function(){if(failed)return;if('closed' == self.readyState)return;debug('changing transport and sending upgrade packet');cleanup();self.setTransport(transport);transport.send([{type:'upgrade'}]);self.emit('upgrade',transport);transport = null;self.upgrading = false;self.flush();});}else {debug('probe transport "%s" failed',name);var err=new Error('probe error');err.transport = transport.name;self.emit('upgradeError',err);}});}function freezeTransport(){if(failed)return; // Any callback called by transport should be ignored since now
failed = true;cleanup();transport.close();transport = null;} //Handle any error that happens while probing
function onerror(err){var error=new Error('probe error: ' + err);error.transport = transport.name;freezeTransport();debug('probe transport "%s" failed because of error: %s',name,err);self.emit('upgradeError',error);}function onTransportClose(){onerror("transport closed");} //When the socket is closed while we're probing
function onclose(){onerror("socket closed");} //When the socket is upgraded while we're probing
function onupgrade(to){if(transport && to.name != transport.name){debug('"%s" works - aborting "%s"',to.name,transport.name);freezeTransport();}} //Remove all listeners on the transport and on self
function cleanup(){transport.removeListener('open',onTransportOpen);transport.removeListener('error',onerror);transport.removeListener('close',onTransportClose);self.removeListener('close',onclose);self.removeListener('upgrading',onupgrade);}transport.once('open',onTransportOpen);transport.once('error',onerror);transport.once('close',onTransportClose);this.once('close',onclose);this.once('upgrading',onupgrade);transport.open();}; /**
                     * Called when connection is deemed open.
                     *
                     * @api public
                     */Socket.prototype.onOpen = function(){debug('socket open');this.readyState = 'open';Socket.priorWebsocketSuccess = 'websocket' == this.transport.name;this.emit('open');this.flush(); // we check for `readyState` in case an `open`
// listener already closed the socket
if('open' == this.readyState && this.upgrade && this.transport.pause){debug('starting upgrade probes');for(var i=0,l=this.upgrades.length;i < l;i++) {this.probe(this.upgrades[i]);}}}; /**
                     * Handles a packet.
                     *
                     * @api private
                     */Socket.prototype.onPacket = function(packet){if('opening' == this.readyState || 'open' == this.readyState){debug('socket receive: type "%s", data "%s"',packet.type,packet.data);this.emit('packet',packet); // Socket is live - any packet counts
this.emit('heartbeat');switch(packet.type){case 'open':this.onHandshake(parsejson(packet.data));break;case 'pong':this.setPing();this.emit('pong');break;case 'error':var err=new Error('server error');err.code = packet.data;this.onError(err);break;case 'message':this.emit('data',packet.data);this.emit('message',packet.data);break;}}else {debug('packet received with socket readyState "%s"',this.readyState);}}; /**
                     * Called upon handshake completion.
                     *
                     * @param {Object} handshake obj
                     * @api private
                     */Socket.prototype.onHandshake = function(data){this.emit('handshake',data);this.id = data.sid;this.transport.query.sid = data.sid;this.upgrades = this.filterUpgrades(data.upgrades);this.pingInterval = data.pingInterval;this.pingTimeout = data.pingTimeout;this.onOpen(); // In case open handler closes socket
if('closed' == this.readyState)return;this.setPing(); // Prolong liveness of socket on heartbeat
this.removeListener('heartbeat',this.onHeartbeat);this.on('heartbeat',this.onHeartbeat);}; /**
                     * Resets ping timeout.
                     *
                     * @api private
                     */Socket.prototype.onHeartbeat = function(timeout){clearTimeout(this.pingTimeoutTimer);var self=this;self.pingTimeoutTimer = setTimeout(function(){if('closed' == self.readyState)return;self.onClose('ping timeout');},timeout || self.pingInterval + self.pingTimeout);}; /**
                     * Pings server every `this.pingInterval` and expects response
                     * within `this.pingTimeout` or closes connection.
                     *
                     * @api private
                     */Socket.prototype.setPing = function(){var self=this;clearTimeout(self.pingIntervalTimer);self.pingIntervalTimer = setTimeout(function(){debug('writing ping packet - expecting pong within %sms',self.pingTimeout);self.ping();self.onHeartbeat(self.pingTimeout);},self.pingInterval);}; /**
                     * Sends a ping packet.
                     *
                     * @api private
                     */Socket.prototype.ping = function(){var self=this;this.sendPacket('ping',function(){self.emit('ping');});}; /**
                     * Called on `drain` event
                     *
                     * @api private
                     */Socket.prototype.onDrain = function(){this.writeBuffer.splice(0,this.prevBufferLen); // setting prevBufferLen = 0 is very important
// for example, when upgrading, upgrade packet is sent over,
// and a nonzero prevBufferLen could cause problems on `drain`
this.prevBufferLen = 0;if(0 === this.writeBuffer.length){this.emit('drain');}else {this.flush();}}; /**
                     * Flush write buffers.
                     *
                     * @api private
                     */Socket.prototype.flush = function(){if('closed' != this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length){debug('flushing %d packets in socket',this.writeBuffer.length);this.transport.send(this.writeBuffer); // keep track of current length of writeBuffer
// splice writeBuffer and callbackBuffer on `drain`
this.prevBufferLen = this.writeBuffer.length;this.emit('flush');}}; /**
                     * Sends a message.
                     *
                     * @param {String} message.
                     * @param {Function} callback function.
                     * @param {Object} options.
                     * @return {Socket} for chaining.
                     * @api public
                     */Socket.prototype.write = Socket.prototype.send = function(msg,options,fn){this.sendPacket('message',msg,options,fn);return this;}; /**
                     * Sends a packet.
                     *
                     * @param {String} packet type.
                     * @param {String} data.
                     * @param {Object} options.
                     * @param {Function} callback function.
                     * @api private
                     */Socket.prototype.sendPacket = function(type,data,options,fn){if('function' == typeof data){fn = data;data = undefined;}if('function' == typeof options){fn = options;options = null;}if('closing' == this.readyState || 'closed' == this.readyState){return;}options = options || {};options.compress = false !== options.compress;var packet={type:type,data:data,options:options};this.emit('packetCreate',packet);this.writeBuffer.push(packet);if(fn)this.once('flush',fn);this.flush();}; /**
                     * Closes the connection.
                     *
                     * @api private
                     */Socket.prototype.close = function(){if('opening' == this.readyState || 'open' == this.readyState){this.readyState = 'closing';var self=this;if(this.writeBuffer.length){this.once('drain',function(){if(this.upgrading){waitForUpgrade();}else {close();}});}else if(this.upgrading){waitForUpgrade();}else {close();}}function close(){self.onClose('forced close');debug('socket closing - telling transport to close');self.transport.close();}function cleanupAndClose(){self.removeListener('upgrade',cleanupAndClose);self.removeListener('upgradeError',cleanupAndClose);close();}function waitForUpgrade(){ // wait for upgrade to finish since we can't send packets while pausing a transport
self.once('upgrade',cleanupAndClose);self.once('upgradeError',cleanupAndClose);}return this;}; /**
                     * Called upon transport error
                     *
                     * @api private
                     */Socket.prototype.onError = function(err){debug('socket error %j',err);Socket.priorWebsocketSuccess = false;this.emit('error',err);this.onClose('transport error',err);}; /**
                     * Called upon transport close.
                     *
                     * @api private
                     */Socket.prototype.onClose = function(reason,desc){if('opening' == this.readyState || 'open' == this.readyState || 'closing' == this.readyState){debug('socket close with reason: "%s"',reason);var self=this; // clear timers
clearTimeout(this.pingIntervalTimer);clearTimeout(this.pingTimeoutTimer); // stop event from firing again for transport
this.transport.removeAllListeners('close'); // ensure transport won't stay open
this.transport.close(); // ignore further transport communication
this.transport.removeAllListeners(); // set ready state
this.readyState = 'closed'; // clear session id
this.id = null; // emit close event
this.emit('close',reason,desc); // clean buffers after, so users can still
// grab the buffers on `close` event
self.writeBuffer = [];self.prevBufferLen = 0;}}; /**
                     * Filters upgrades, returning only those matching client transports.
                     *
                     * @param {Array} server upgrades
                     * @api private
                     *
                     */Socket.prototype.filterUpgrades = function(upgrades){var filteredUpgrades=[];for(var i=0,j=upgrades.length;i < j;i++) {if(~index(this.transports,upgrades[i]))filteredUpgrades.push(upgrades[i]);}return filteredUpgrades;};}).call(this,typeof self !== "undefined"?self:typeof window !== "undefined"?window:typeof global !== "undefined"?global:{});},{"./transport":4,"./transports":5,"component-emitter":15,"debug":17,"engine.io-parser":19,"indexof":23,"parsejson":26,"parseqs":27,"parseuri":28}],4:[function(_dereq_,module,exports){ /**
                 * Module dependencies.
                 */var parser=_dereq_('engine.io-parser');var Emitter=_dereq_('component-emitter'); /**
                 * Module exports.
                 */module.exports = Transport; /**
                 * Transport abstract constructor.
                 *
                 * @param {Object} options.
                 * @api private
                 */function Transport(opts){this.path = opts.path;this.hostname = opts.hostname;this.port = opts.port;this.secure = opts.secure;this.query = opts.query;this.timestampParam = opts.timestampParam;this.timestampRequests = opts.timestampRequests;this.readyState = '';this.agent = opts.agent || false;this.socket = opts.socket;this.enablesXDR = opts.enablesXDR; // SSL options for Node.js client
this.pfx = opts.pfx;this.key = opts.key;this.passphrase = opts.passphrase;this.cert = opts.cert;this.ca = opts.ca;this.ciphers = opts.ciphers;this.rejectUnauthorized = opts.rejectUnauthorized; // other options for Node.js client
this.extraHeaders = opts.extraHeaders;} /**
                 * Mix in `Emitter`.
                 */Emitter(Transport.prototype); /**
                 * Emits an error.
                 *
                 * @param {String} str
                 * @return {Transport} for chaining
                 * @api public
                 */Transport.prototype.onError = function(msg,desc){var err=new Error(msg);err.type = 'TransportError';err.description = desc;this.emit('error',err);return this;}; /**
                 * Opens the transport.
                 *
                 * @api public
                 */Transport.prototype.open = function(){if('closed' == this.readyState || '' == this.readyState){this.readyState = 'opening';this.doOpen();}return this;}; /**
                 * Closes the transport.
                 *
                 * @api private
                 */Transport.prototype.close = function(){if('opening' == this.readyState || 'open' == this.readyState){this.doClose();this.onClose();}return this;}; /**
                 * Sends multiple packets.
                 *
                 * @param {Array} packets
                 * @api private
                 */Transport.prototype.send = function(packets){if('open' == this.readyState){this.write(packets);}else {throw new Error('Transport not open');}}; /**
                 * Called upon open
                 *
                 * @api private
                 */Transport.prototype.onOpen = function(){this.readyState = 'open';this.writable = true;this.emit('open');}; /**
                 * Called with data.
                 *
                 * @param {String} data
                 * @api private
                 */Transport.prototype.onData = function(data){var packet=parser.decodePacket(data,this.socket.binaryType);this.onPacket(packet);}; /**
                 * Called with a decoded packet.
                 */Transport.prototype.onPacket = function(packet){this.emit('packet',packet);}; /**
                 * Called upon close.
                 *
                 * @api private
                 */Transport.prototype.onClose = function(){this.readyState = 'closed';this.emit('close');};},{"component-emitter":15,"engine.io-parser":19}],5:[function(_dereq_,module,exports){(function(global){ /**
                     * Module dependencies
                     */var XMLHttpRequest=_dereq_('xmlhttprequest-ssl');var XHR=_dereq_('./polling-xhr');var JSONP=_dereq_('./polling-jsonp');var websocket=_dereq_('./websocket'); /**
                     * Export transports.
                     */exports.polling = polling;exports.websocket = websocket; /**
                     * Polling transport polymorphic constructor.
                     * Decides on xhr vs jsonp based on feature detection.
                     *
                     * @api private
                     */function polling(opts){var xhr;var xd=false;var xs=false;var jsonp=false !== opts.jsonp;if(global.location){var isSSL='https:' == location.protocol;var port=location.port; // some user agents have empty `location.port`
if(!port){port = isSSL?443:80;}xd = opts.hostname != location.hostname || port != opts.port;xs = opts.secure != isSSL;}opts.xdomain = xd;opts.xscheme = xs;xhr = new XMLHttpRequest(opts);if('open' in xhr && !opts.forceJSONP){return new XHR(opts);}else {if(!jsonp)throw new Error('JSONP disabled');return new JSONP(opts);}}}).call(this,typeof self !== "undefined"?self:typeof window !== "undefined"?window:typeof global !== "undefined"?global:{});},{"./polling-jsonp":6,"./polling-xhr":7,"./websocket":9,"xmlhttprequest-ssl":10}],6:[function(_dereq_,module,exports){(function(global){ /**
                     * Module requirements.
                     */var Polling=_dereq_('./polling');var inherit=_dereq_('component-inherit'); /**
                     * Module exports.
                     */module.exports = JSONPPolling; /**
                     * Cached regular expressions.
                     */var rNewline=/\n/g;var rEscapedNewline=/\\n/g; /**
                     * Global JSONP callbacks.
                     */var callbacks; /**
                     * Callbacks count.
                     */var index=0; /**
                     * Noop.
                     */function empty(){} /**
                     * JSONP Polling constructor.
                     *
                     * @param {Object} opts.
                     * @api public
                     */function JSONPPolling(opts){Polling.call(this,opts);this.query = this.query || {}; // define global callbacks array if not present
// we do this here (lazily) to avoid unneeded global pollution
if(!callbacks){ // we need to consider multiple engines in the same page
if(!global.___eio)global.___eio = [];callbacks = global.___eio;} // callback identifier
this.index = callbacks.length; // add callback to jsonp global
var self=this;callbacks.push(function(msg){self.onData(msg);}); // append to query string
this.query.j = this.index; // prevent spurious errors from being emitted when the window is unloaded
if(global.document && global.addEventListener){global.addEventListener('beforeunload',function(){if(self.script)self.script.onerror = empty;},false);}} /**
                     * Inherits from Polling.
                     */inherit(JSONPPolling,Polling); /*
                     * JSONP only supports binary as base64 encoded strings
                     */JSONPPolling.prototype.supportsBinary = false; /**
                     * Closes the socket.
                     *
                     * @api private
                     */JSONPPolling.prototype.doClose = function(){if(this.script){this.script.parentNode.removeChild(this.script);this.script = null;}if(this.form){this.form.parentNode.removeChild(this.form);this.form = null;this.iframe = null;}Polling.prototype.doClose.call(this);}; /**
                     * Starts a poll cycle.
                     *
                     * @api private
                     */JSONPPolling.prototype.doPoll = function(){var self=this;var script=document.createElement('script');if(this.script){this.script.parentNode.removeChild(this.script);this.script = null;}script.async = true;script.src = this.uri();script.onerror = function(e){self.onError('jsonp poll error',e);};var insertAt=document.getElementsByTagName('script')[0];if(insertAt){insertAt.parentNode.insertBefore(script,insertAt);}else {(document.head || document.body).appendChild(script);}this.script = script;var isUAgecko='undefined' != typeof navigator && /gecko/i.test(navigator.userAgent);if(isUAgecko){setTimeout(function(){var iframe=document.createElement('iframe');document.body.appendChild(iframe);document.body.removeChild(iframe);},100);}}; /**
                     * Writes with a hidden iframe.
                     *
                     * @param {String} data to send
                     * @param {Function} called upon flush.
                     * @api private
                     */JSONPPolling.prototype.doWrite = function(data,fn){var self=this;if(!this.form){var form=document.createElement('form');var area=document.createElement('textarea');var id=this.iframeId = 'eio_iframe_' + this.index;var iframe;form.className = 'socketio';form.style.position = 'absolute';form.style.top = '-1000px';form.style.left = '-1000px';form.target = id;form.method = 'POST';form.setAttribute('accept-charset','utf-8');area.name = 'd';form.appendChild(area);document.body.appendChild(form);this.form = form;this.area = area;}this.form.action = this.uri();function complete(){initIframe();fn();}function initIframe(){if(self.iframe){try{self.form.removeChild(self.iframe);}catch(e) {self.onError('jsonp polling iframe removal error',e);}}try{ // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
var html='<iframe src="javascript:0" name="' + self.iframeId + '">';iframe = document.createElement(html);}catch(e) {iframe = document.createElement('iframe');iframe.name = self.iframeId;iframe.src = 'javascript:0';}iframe.id = self.iframeId;self.form.appendChild(iframe);self.iframe = iframe;}initIframe(); // escape \n to prevent it from being converted into \r\n by some UAs
// double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
data = data.replace(rEscapedNewline,'\\\n');this.area.value = data.replace(rNewline,'\\n');try{this.form.submit();}catch(e) {}if(this.iframe.attachEvent){this.iframe.onreadystatechange = function(){if(self.iframe.readyState == 'complete'){complete();}};}else {this.iframe.onload = complete;}};}).call(this,typeof self !== "undefined"?self:typeof window !== "undefined"?window:typeof global !== "undefined"?global:{});},{"./polling":8,"component-inherit":16}],7:[function(_dereq_,module,exports){(function(global){ /**
                     * Module requirements.
                     */var XMLHttpRequest=_dereq_('xmlhttprequest-ssl');var Polling=_dereq_('./polling');var Emitter=_dereq_('component-emitter');var inherit=_dereq_('component-inherit');var debug=_dereq_('debug')('engine.io-client:polling-xhr'); /**
                     * Module exports.
                     */module.exports = XHR;module.exports.Request = Request; /**
                     * Empty function
                     */function empty(){} /**
                     * XHR Polling constructor.
                     *
                     * @param {Object} opts
                     * @api public
                     */function XHR(opts){Polling.call(this,opts);if(global.location){var isSSL='https:' == location.protocol;var port=location.port; // some user agents have empty `location.port`
if(!port){port = isSSL?443:80;}this.xd = opts.hostname != global.location.hostname || port != opts.port;this.xs = opts.secure != isSSL;}else {this.extraHeaders = opts.extraHeaders;}} /**
                     * Inherits from Polling.
                     */inherit(XHR,Polling); /**
                     * XHR supports binary
                     */XHR.prototype.supportsBinary = true; /**
                     * Creates a request.
                     *
                     * @param {String} method
                     * @api private
                     */XHR.prototype.request = function(opts){opts = opts || {};opts.uri = this.uri();opts.xd = this.xd;opts.xs = this.xs;opts.agent = this.agent || false;opts.supportsBinary = this.supportsBinary;opts.enablesXDR = this.enablesXDR; // SSL options for Node.js client
opts.pfx = this.pfx;opts.key = this.key;opts.passphrase = this.passphrase;opts.cert = this.cert;opts.ca = this.ca;opts.ciphers = this.ciphers;opts.rejectUnauthorized = this.rejectUnauthorized; // other options for Node.js client
opts.extraHeaders = this.extraHeaders;return new Request(opts);}; /**
                     * Sends data.
                     *
                     * @param {String} data to send.
                     * @param {Function} called upon flush.
                     * @api private
                     */XHR.prototype.doWrite = function(data,fn){var isBinary=typeof data !== 'string' && data !== undefined;var req=this.request({method:'POST',data:data,isBinary:isBinary});var self=this;req.on('success',fn);req.on('error',function(err){self.onError('xhr post error',err);});this.sendXhr = req;}; /**
                     * Starts a poll cycle.
                     *
                     * @api private
                     */XHR.prototype.doPoll = function(){debug('xhr poll');var req=this.request();var self=this;req.on('data',function(data){self.onData(data);});req.on('error',function(err){self.onError('xhr poll error',err);});this.pollXhr = req;}; /**
                     * Request constructor
                     *
                     * @param {Object} options
                     * @api public
                     */function Request(opts){this.method = opts.method || 'GET';this.uri = opts.uri;this.xd = !!opts.xd;this.xs = !!opts.xs;this.async = false !== opts.async;this.data = undefined != opts.data?opts.data:null;this.agent = opts.agent;this.isBinary = opts.isBinary;this.supportsBinary = opts.supportsBinary;this.enablesXDR = opts.enablesXDR; // SSL options for Node.js client
this.pfx = opts.pfx;this.key = opts.key;this.passphrase = opts.passphrase;this.cert = opts.cert;this.ca = opts.ca;this.ciphers = opts.ciphers;this.rejectUnauthorized = opts.rejectUnauthorized; // other options for Node.js client
this.extraHeaders = opts.extraHeaders;this.create();} /**
                     * Mix in `Emitter`.
                     */Emitter(Request.prototype); /**
                     * Creates the XHR object and sends the request.
                     *
                     * @api private
                     */Request.prototype.create = function(){var opts={agent:this.agent,xdomain:this.xd,xscheme:this.xs,enablesXDR:this.enablesXDR}; // SSL options for Node.js client
opts.pfx = this.pfx;opts.key = this.key;opts.passphrase = this.passphrase;opts.cert = this.cert;opts.ca = this.ca;opts.ciphers = this.ciphers;opts.rejectUnauthorized = this.rejectUnauthorized;opts.transports = ["xhr-polling"];var xhr=this.xhr = new XMLHttpRequest(opts);var self=this;try{debug('xhr open %s: %s',this.method,this.uri);xhr.open(this.method,this.uri,this.async);try{if(this.extraHeaders){xhr.setDisableHeaderCheck(true);for(var i in this.extraHeaders) {if(this.extraHeaders.hasOwnProperty(i)){xhr.setRequestHeader(i,this.extraHeaders[i]);}}}}catch(e) {}if(this.supportsBinary){ // This has to be done after open because Firefox is stupid
// http://stackoverflow.com/questions/13216903/get-binary-data-with-xmlhttprequest-in-a-firefox-extension
xhr.responseType = 'arraybuffer';}if('POST' == this.method){try{if(this.isBinary){xhr.setRequestHeader('Content-type','application/octet-stream');}else {xhr.setRequestHeader('Content-type','text/plain;charset=UTF-8');}}catch(e) {}} // ie6 check
if('withCredentials' in xhr){xhr.withCredentials = true;}if(this.hasXDR()){xhr.onload = function(){self.onLoad();};xhr.onerror = function(){self.onError(xhr.responseText);};}else {xhr.onreadystatechange = function(){if(4 != xhr.readyState)return;if(200 == xhr.status || 1223 == xhr.status){self.onLoad();}else { // make sure the `error` event handler that's user-set
// does not throw in the same tick and gets caught here
setTimeout(function(){self.onError(xhr.status);},0);}};}debug('xhr data %s',this.data);xhr.send(this.data);}catch(e) { // Need to defer since .create() is called directly fhrom the constructor
// and thus the 'error' event can only be only bound *after* this exception
// occurs.  Therefore, also, we cannot throw here at all.
setTimeout(function(){self.onError(e);},0);return;}if(global.document){this.index = Request.requestsCount++;Request.requests[this.index] = this;}}; /**
                     * Called upon successful response.
                     *
                     * @api private
                     */Request.prototype.onSuccess = function(){this.emit('success');this.cleanup();}; /**
                     * Called if we have data.
                     *
                     * @api private
                     */Request.prototype.onData = function(data){this.emit('data',data);this.onSuccess();}; /**
                     * Called upon error.
                     *
                     * @api private
                     */Request.prototype.onError = function(err){this.emit('error',err);this.cleanup(true);}; /**
                     * Cleans up house.
                     *
                     * @api private
                     */Request.prototype.cleanup = function(fromError){if('undefined' == typeof this.xhr || null === this.xhr){return;} // xmlhttprequest
if(this.hasXDR()){this.xhr.onload = this.xhr.onerror = empty;}else {this.xhr.onreadystatechange = empty;}if(fromError){try{this.xhr.abort();}catch(e) {}}if(global.document){delete Request.requests[this.index];}this.xhr = null;}; /**
                     * Called upon load.
                     *
                     * @api private
                     */Request.prototype.onLoad = function(){var data;try{var contentType;try{contentType = this.xhr.getResponseHeader('Content-Type').split(';')[0];}catch(e) {}if(contentType === 'application/octet-stream'){data = this.xhr.response;}else {if(!this.supportsBinary){data = this.xhr.responseText;}else {try{data = String.fromCharCode.apply(null,new Uint8Array(this.xhr.response));}catch(e) {var ui8Arr=new Uint8Array(this.xhr.response);var dataArray=[];for(var idx=0,length=ui8Arr.length;idx < length;idx++) {dataArray.push(ui8Arr[idx]);}data = String.fromCharCode.apply(null,dataArray);}}}}catch(e) {this.onError(e);}if(null != data){this.onData(data);}}; /**
                     * Check if it has XDomainRequest.
                     *
                     * @api private
                     */Request.prototype.hasXDR = function(){return 'undefined' !== typeof global.XDomainRequest && !this.xs && this.enablesXDR;}; /**
                     * Aborts the request.
                     *
                     * @api public
                     */Request.prototype.abort = function(){this.cleanup();}; /**
                     * Aborts pending requests when unloading the window. This is needed to prevent
                     * memory leaks (e.g. when using IE) and to ensure that no spurious error is
                     * emitted.
                     */if(global.document){Request.requestsCount = 0;Request.requests = {};if(global.attachEvent){global.attachEvent('onunload',unloadHandler);}else if(global.addEventListener){global.addEventListener('beforeunload',unloadHandler,false);}}function unloadHandler(){for(var i in Request.requests) {if(Request.requests.hasOwnProperty(i)){Request.requests[i].abort();}}}}).call(this,typeof self !== "undefined"?self:typeof window !== "undefined"?window:typeof global !== "undefined"?global:{});},{"./polling":8,"component-emitter":15,"component-inherit":16,"debug":17,"xmlhttprequest-ssl":10}],8:[function(_dereq_,module,exports){ /**
                 * Module dependencies.
                 */var Transport=_dereq_('../transport');var parseqs=_dereq_('parseqs');var parser=_dereq_('engine.io-parser');var inherit=_dereq_('component-inherit');var yeast=_dereq_('yeast');var debug=_dereq_('debug')('engine.io-client:polling'); /**
                 * Module exports.
                 */module.exports = Polling; /**
                 * Is XHR2 supported?
                 */var hasXHR2=(function(){var XMLHttpRequest=_dereq_('xmlhttprequest-ssl');var xhr=new XMLHttpRequest({xdomain:false});return null != xhr.responseType;})(); /**
                 * Polling interface.
                 *
                 * @param {Object} opts
                 * @api private
                 */function Polling(opts){var forceBase64=opts && opts.forceBase64;if(!hasXHR2 || forceBase64){this.supportsBinary = false;}Transport.call(this,opts);} /**
                 * Inherits from Transport.
                 */inherit(Polling,Transport); /**
                 * Transport name.
                 */Polling.prototype.name = 'polling'; /**
                 * Opens the socket (triggers polling). We write a PING message to determine
                 * when the transport is open.
                 *
                 * @api private
                 */Polling.prototype.doOpen = function(){this.poll();}; /**
                 * Pauses polling.
                 *
                 * @param {Function} callback upon buffers are flushed and transport is paused
                 * @api private
                 */Polling.prototype.pause = function(onPause){var pending=0;var self=this;this.readyState = 'pausing';function pause(){debug('paused');self.readyState = 'paused';onPause();}if(this.polling || !this.writable){var total=0;if(this.polling){debug('we are currently polling - waiting to pause');total++;this.once('pollComplete',function(){debug('pre-pause polling complete');--total || pause();});}if(!this.writable){debug('we are currently writing - waiting to pause');total++;this.once('drain',function(){debug('pre-pause writing complete');--total || pause();});}}else {pause();}}; /**
                 * Starts polling cycle.
                 *
                 * @api public
                 */Polling.prototype.poll = function(){debug('polling');this.polling = true;this.doPoll();this.emit('poll');}; /**
                 * Overloads onData to detect payloads.
                 *
                 * @api private
                 */Polling.prototype.onData = function(data){var self=this;debug('polling got data %s',data);var callback=function callback(packet,index,total){ // if its the first message we consider the transport open
if('opening' == self.readyState){self.onOpen();} // if its a close packet, we close the ongoing requests
if('close' == packet.type){self.onClose();return false;} // otherwise bypass onData and handle the message
self.onPacket(packet);}; // decode payload
parser.decodePayload(data,this.socket.binaryType,callback); // if an event did not trigger closing
if('closed' != this.readyState){ // if we got data we're not polling
this.polling = false;this.emit('pollComplete');if('open' == this.readyState){this.poll();}else {debug('ignoring poll - transport state "%s"',this.readyState);}}}; /**
                 * For polling, send a close packet.
                 *
                 * @api private
                 */Polling.prototype.doClose = function(){var self=this;function close(){debug('writing close packet');self.write([{type:'close'}]);}if('open' == this.readyState){debug('transport open - closing');close();}else { // in case we're trying to close while
// handshaking is in progress (GH-164)
debug('transport not open - deferring close');this.once('open',close);}}; /**
                 * Writes a packets payload.
                 *
                 * @param {Array} data packets
                 * @param {Function} drain callback
                 * @api private
                 */Polling.prototype.write = function(packets){var self=this;this.writable = false;var callbackfn=function callbackfn(){self.writable = true;self.emit('drain');};var self=this;parser.encodePayload(packets,this.supportsBinary,function(data){self.doWrite(data,callbackfn);});}; /**
                 * Generates uri for connection.
                 *
                 * @api private
                 */Polling.prototype.uri = function(){var query=this.query || {};var schema=this.secure?'https':'http';var port=''; // cache busting is forced
if(false !== this.timestampRequests){query[this.timestampParam] = yeast();}if(!this.supportsBinary && !query.sid){query.b64 = 1;}query = parseqs.encode(query); // avoid port if default for schema
if(this.port && ('https' == schema && this.port != 443 || 'http' == schema && this.port != 80)){port = ':' + this.port;} // prepend ? to query
if(query.length){query = '?' + query;}var ipv6=this.hostname.indexOf(':') !== -1;return schema + '://' + (ipv6?'[' + this.hostname + ']':this.hostname) + port + this.path + query;};},{"../transport":4,"component-inherit":16,"debug":17,"engine.io-parser":19,"parseqs":27,"xmlhttprequest-ssl":10,"yeast":30}],9:[function(_dereq_,module,exports){(function(global){ /**
                     * Module dependencies.
                     */var Transport=_dereq_('../transport');var parser=_dereq_('engine.io-parser');var parseqs=_dereq_('parseqs');var inherit=_dereq_('component-inherit');var yeast=_dereq_('yeast');var debug=_dereq_('debug')('engine.io-client:websocket');var BrowserWebSocket=global.WebSocket || global.MozWebSocket; /**
                     * Get either the `WebSocket` or `MozWebSocket` globals
                     * in the browser or the WebSocket-compatible interface
                     * exposed by `ws` for Node environment.
                     */var WebSocket=BrowserWebSocket || (typeof window !== 'undefined'?null:_dereq_('ws')); /**
                     * Module exports.
                     */module.exports = WS; /**
                     * WebSocket transport constructor.
                     *
                     * @api {Object} connection options
                     * @api public
                     */function WS(opts){var forceBase64=opts && opts.forceBase64;if(forceBase64){this.supportsBinary = false;}this.perMessageDeflate = opts.perMessageDeflate;Transport.call(this,opts);} /**
                     * Inherits from Transport.
                     */inherit(WS,Transport); /**
                     * Transport name.
                     *
                     * @api public
                     */WS.prototype.name = 'websocket'; /*
                     * WebSockets support binary
                     */WS.prototype.supportsBinary = true; /**
                     * Opens socket.
                     *
                     * @api private
                     */WS.prototype.doOpen = function(){if(!this.check()){ // let probe timeout
return;}var self=this;var uri=this.uri();var protocols=void 0;var opts={agent:this.agent,perMessageDeflate:this.perMessageDeflate}; // SSL options for Node.js client
opts.pfx = this.pfx;opts.key = this.key;opts.passphrase = this.passphrase;opts.cert = this.cert;opts.ca = this.ca;opts.ciphers = this.ciphers;opts.rejectUnauthorized = this.rejectUnauthorized;if(this.extraHeaders){opts.headers = this.extraHeaders;}this.ws = BrowserWebSocket?new WebSocket(uri):new WebSocket(uri,protocols,opts);if(this.ws.binaryType === undefined){this.supportsBinary = false;}if(this.ws.supports && this.ws.supports.binary){this.supportsBinary = true;this.ws.binaryType = 'buffer';}else {this.ws.binaryType = 'arraybuffer';}this.addEventListeners();}; /**
                     * Adds event listeners to the socket
                     *
                     * @api private
                     */WS.prototype.addEventListeners = function(){var self=this;this.ws.onopen = function(){self.onOpen();};this.ws.onclose = function(){self.onClose();};this.ws.onmessage = function(ev){self.onData(ev.data);};this.ws.onerror = function(e){self.onError('websocket error',e);};}; /**
                     * Override `onData` to use a timer on iOS.
                     * See: https://gist.github.com/mloughran/2052006
                     *
                     * @api private
                     */if('undefined' != typeof navigator && /iPad|iPhone|iPod/i.test(navigator.userAgent)){WS.prototype.onData = function(data){var self=this;setTimeout(function(){Transport.prototype.onData.call(self,data);},0);};} /**
                     * Writes data to socket.
                     *
                     * @param {Array} array of packets.
                     * @api private
                     */WS.prototype.write = function(packets){var self=this;this.writable = false; // encodePacket efficient as it uses WS framing
// no need for encodePayload
var total=packets.length;for(var i=0,l=total;i < l;i++) {(function(packet){parser.encodePacket(packet,self.supportsBinary,function(data){if(!BrowserWebSocket){ // always create a new object (GH-437)
var opts={};if(packet.options){opts.compress = packet.options.compress;}if(self.perMessageDeflate){var len='string' == typeof data?global.Buffer.byteLength(data):data.length;if(len < self.perMessageDeflate.threshold){opts.compress = false;}}} //Sometimes the websocket has already been closed but the browser didn't
//have a chance of informing us about it yet, in that case send will
//throw an error
try{if(BrowserWebSocket){ // TypeError is thrown when passing the second argument on Safari
self.ws.send(data);}else {self.ws.send(data,opts);}}catch(e) {debug('websocket closed before onclose event');}--total || done();});})(packets[i]);}function done(){self.emit('flush'); // fake drain
// defer to next tick to allow Socket to clear writeBuffer
setTimeout(function(){self.writable = true;self.emit('drain');},0);}}; /**
                     * Called upon close
                     *
                     * @api private
                     */WS.prototype.onClose = function(){Transport.prototype.onClose.call(this);}; /**
                     * Closes socket.
                     *
                     * @api private
                     */WS.prototype.doClose = function(){if(typeof this.ws !== 'undefined'){this.ws.close();}}; /**
                     * Generates uri for connection.
                     *
                     * @api private
                     */WS.prototype.uri = function(){var query=this.query || {};var schema=this.secure?'wss':'ws';var port=''; // avoid port if default for schema
if(this.port && ('wss' == schema && this.port != 443 || 'ws' == schema && this.port != 80)){port = ':' + this.port;} // append timestamp to URI
if(this.timestampRequests){query[this.timestampParam] = yeast();} // communicate binary support capabilities
if(!this.supportsBinary){query.b64 = 1;}query = parseqs.encode(query); // prepend ? to query
if(query.length){query = '?' + query;}var ipv6=this.hostname.indexOf(':') !== -1;return schema + '://' + (ipv6?'[' + this.hostname + ']':this.hostname) + port + this.path + query;}; /**
                     * Feature detection for WebSocket.
                     *
                     * @return {Boolean} whether this transport is available.
                     * @api public
                     */WS.prototype.check = function(){return !!WebSocket && !('__initialize' in WebSocket && this.name === WS.prototype.name);};}).call(this,typeof self !== "undefined"?self:typeof window !== "undefined"?window:typeof global !== "undefined"?global:{});},{"../transport":4,"component-inherit":16,"debug":17,"engine.io-parser":19,"parseqs":27,"ws":undefined,"yeast":30}],10:[function(_dereq_,module,exports){ // browser shim for xmlhttprequest module
var hasCORS=_dereq_('has-cors');module.exports = function(opts){var xdomain=opts.xdomain; // scheme must be same when usign XDomainRequest
// http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
var xscheme=opts.xscheme; // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
// https://github.com/Automattic/engine.io-client/pull/217
var enablesXDR=opts.enablesXDR; // XMLHttpRequest can be disabled on IE
try{if('undefined' != typeof XMLHttpRequest && (!xdomain || hasCORS)){return new XMLHttpRequest();}}catch(e) {} // Use XDomainRequest for IE8 if enablesXDR is true
// because loading bar keeps flashing when using jsonp-polling
// https://github.com/yujiosaka/socke.io-ie8-loading-example
try{if('undefined' != typeof XDomainRequest && !xscheme && enablesXDR){return new XDomainRequest();}}catch(e) {}if(!xdomain){try{return new ActiveXObject('Microsoft.XMLHTTP');}catch(e) {}}};},{"has-cors":22}],11:[function(_dereq_,module,exports){module.exports = after;function after(count,callback,err_cb){var bail=false;err_cb = err_cb || noop;proxy.count = count;return count === 0?callback():proxy;function proxy(err,result){if(proxy.count <= 0){throw new Error('after called too many times');}--proxy.count; // after first error, rest are passed to err_cb
if(err){bail = true;callback(err); // future error callbacks will go to error handler
callback = err_cb;}else if(proxy.count === 0 && !bail){callback(null,result);}}}function noop(){}},{}],12:[function(_dereq_,module,exports){ /**
                 * An abstraction for slicing an arraybuffer even when
                 * ArrayBuffer.prototype.slice is not supported
                 *
                 * @api public
                 */module.exports = function(arraybuffer,start,end){var bytes=arraybuffer.byteLength;start = start || 0;end = end || bytes;if(arraybuffer.slice){return arraybuffer.slice(start,end);}if(start < 0){start += bytes;}if(end < 0){end += bytes;}if(end > bytes){end = bytes;}if(start >= bytes || start >= end || bytes === 0){return new ArrayBuffer(0);}var abv=new Uint8Array(arraybuffer);var result=new Uint8Array(end - start);for(var i=start,ii=0;i < end;i++,ii++) {result[ii] = abv[i];}return result.buffer;};},{}],13:[function(_dereq_,module,exports){ /*
                 * base64-arraybuffer
                 * https://github.com/niklasvh/base64-arraybuffer
                 *
                 * Copyright (c) 2012 Niklas von Hertzen
                 * Licensed under the MIT license.
                 */(function(chars){"use strict";exports.encode = function(arraybuffer){var bytes=new Uint8Array(arraybuffer),i,len=bytes.length,base64="";for(i = 0;i < len;i += 3) {base64 += chars[bytes[i] >> 2];base64 += chars[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];base64 += chars[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];base64 += chars[bytes[i + 2] & 63];}if(len % 3 === 2){base64 = base64.substring(0,base64.length - 1) + "=";}else if(len % 3 === 1){base64 = base64.substring(0,base64.length - 2) + "==";}return base64;};exports.decode = function(base64){var bufferLength=base64.length * 0.75,len=base64.length,i,p=0,encoded1,encoded2,encoded3,encoded4;if(base64[base64.length - 1] === "="){bufferLength--;if(base64[base64.length - 2] === "="){bufferLength--;}}var arraybuffer=new ArrayBuffer(bufferLength),bytes=new Uint8Array(arraybuffer);for(i = 0;i < len;i += 4) {encoded1 = chars.indexOf(base64[i]);encoded2 = chars.indexOf(base64[i + 1]);encoded3 = chars.indexOf(base64[i + 2]);encoded4 = chars.indexOf(base64[i + 3]);bytes[p++] = encoded1 << 2 | encoded2 >> 4;bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;}return arraybuffer;};})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");},{}],14:[function(_dereq_,module,exports){(function(global){ /**
                     * Create a blob builder even when vendor prefixes exist
                     */var BlobBuilder=global.BlobBuilder || global.WebKitBlobBuilder || global.MSBlobBuilder || global.MozBlobBuilder; /**
                     * Check if Blob constructor is supported
                     */var blobSupported=(function(){try{var a=new Blob(['hi']);return a.size === 2;}catch(e) {return false;}})(); /**
                     * Check if Blob constructor supports ArrayBufferViews
                     * Fails in Safari 6, so we need to map to ArrayBuffers there.
                     */var blobSupportsArrayBufferView=blobSupported && (function(){try{var b=new Blob([new Uint8Array([1,2])]);return b.size === 2;}catch(e) {return false;}})(); /**
                     * Check if BlobBuilder is supported
                     */var blobBuilderSupported=BlobBuilder && BlobBuilder.prototype.append && BlobBuilder.prototype.getBlob; /**
                     * Helper function that maps ArrayBufferViews to ArrayBuffers
                     * Used by BlobBuilder constructor and old browsers that didn't
                     * support it in the Blob constructor.
                     */function mapArrayBufferViews(ary){for(var i=0;i < ary.length;i++) {var chunk=ary[i];if(chunk.buffer instanceof ArrayBuffer){var buf=chunk.buffer; // if this is a subarray, make a copy so we only
// include the subarray region from the underlying buffer
if(chunk.byteLength !== buf.byteLength){var copy=new Uint8Array(chunk.byteLength);copy.set(new Uint8Array(buf,chunk.byteOffset,chunk.byteLength));buf = copy.buffer;}ary[i] = buf;}}}function BlobBuilderConstructor(ary,options){options = options || {};var bb=new BlobBuilder();mapArrayBufferViews(ary);for(var i=0;i < ary.length;i++) {bb.append(ary[i]);}return options.type?bb.getBlob(options.type):bb.getBlob();};function BlobConstructor(ary,options){mapArrayBufferViews(ary);return new Blob(ary,options || {});};module.exports = (function(){if(blobSupported){return blobSupportsArrayBufferView?global.Blob:BlobConstructor;}else if(blobBuilderSupported){return BlobBuilderConstructor;}else {return undefined;}})();}).call(this,typeof self !== "undefined"?self:typeof window !== "undefined"?window:typeof global !== "undefined"?global:{});},{}],15:[function(_dereq_,module,exports){ /**
                 * Expose `Emitter`.
                 */module.exports = Emitter; /**
                 * Initialize a new `Emitter`.
                 *
                 * @api public
                 */function Emitter(obj){if(obj)return mixin(obj);}; /**
                 * Mixin the emitter properties.
                 *
                 * @param {Object} obj
                 * @return {Object}
                 * @api private
                 */function mixin(obj){for(var key in Emitter.prototype) {obj[key] = Emitter.prototype[key];}return obj;} /**
                 * Listen on the given `event` with `fn`.
                 *
                 * @param {String} event
                 * @param {Function} fn
                 * @return {Emitter}
                 * @api public
                 */Emitter.prototype.on = Emitter.prototype.addEventListener = function(event,fn){this._callbacks = this._callbacks || {};(this._callbacks[event] = this._callbacks[event] || []).push(fn);return this;}; /**
                 * Adds an `event` listener that will be invoked a single
                 * time then automatically removed.
                 *
                 * @param {String} event
                 * @param {Function} fn
                 * @return {Emitter}
                 * @api public
                 */Emitter.prototype.once = function(event,fn){var self=this;this._callbacks = this._callbacks || {};function on(){self.off(event,on);fn.apply(this,arguments);}on.fn = fn;this.on(event,on);return this;}; /**
                 * Remove the given callback for `event` or all
                 * registered callbacks.
                 *
                 * @param {String} event
                 * @param {Function} fn
                 * @return {Emitter}
                 * @api public
                 */Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event,fn){this._callbacks = this._callbacks || {}; // all
if(0 == arguments.length){this._callbacks = {};return this;} // specific event
var callbacks=this._callbacks[event];if(!callbacks)return this; // remove all handlers
if(1 == arguments.length){delete this._callbacks[event];return this;} // remove specific handler
var cb;for(var i=0;i < callbacks.length;i++) {cb = callbacks[i];if(cb === fn || cb.fn === fn){callbacks.splice(i,1);break;}}return this;}; /**
                 * Emit `event` with the given args.
                 *
                 * @param {String} event
                 * @param {Mixed} ...
                 * @return {Emitter}
                 */Emitter.prototype.emit = function(event){this._callbacks = this._callbacks || {};var args=[].slice.call(arguments,1),callbacks=this._callbacks[event];if(callbacks){callbacks = callbacks.slice(0);for(var i=0,len=callbacks.length;i < len;++i) {callbacks[i].apply(this,args);}}return this;}; /**
                 * Return array of callbacks for `event`.
                 *
                 * @param {String} event
                 * @return {Array}
                 * @api public
                 */Emitter.prototype.listeners = function(event){this._callbacks = this._callbacks || {};return this._callbacks[event] || [];}; /**
                 * Check if this emitter has `event` handlers.
                 *
                 * @param {String} event
                 * @return {Boolean}
                 * @api public
                 */Emitter.prototype.hasListeners = function(event){return !!this.listeners(event).length;};},{}],16:[function(_dereq_,module,exports){module.exports = function(a,b){var fn=function fn(){};fn.prototype = b.prototype;a.prototype = new fn();a.prototype.constructor = a;};},{}],17:[function(_dereq_,module,exports){ /**
                 * This is the web browser implementation of `debug()`.
                 *
                 * Expose `debug()` as the module.
                 */exports = module.exports = _dereq_('./debug');exports.log = log;exports.formatArgs = formatArgs;exports.save = save;exports.load = load;exports.useColors = useColors;exports.storage = 'undefined' != typeof chrome && 'undefined' != typeof chrome.storage?chrome.storage.local:localstorage(); /**
                 * Colors.
                 */exports.colors = ['lightseagreen','forestgreen','goldenrod','dodgerblue','darkorchid','crimson']; /**
                 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
                 * and the Firebug extension (any Firefox version) are known
                 * to support "%c" CSS customizations.
                 *
                 * TODO: add a `localStorage` variable to explicitly enable/disable colors
                 */function useColors(){ // is webkit? http://stackoverflow.com/a/16459606/376773
return 'WebkitAppearance' in document.documentElement.style ||  // is firebug? http://stackoverflow.com/a/398120/376773
window.console && (console.firebug || console.exception && console.table) ||  // is firefox >= v31?
// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1,10) >= 31;} /**
                 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
                 */exports.formatters.j = function(v){return JSON.stringify(v);}; /**
                 * Colorize log arguments if enabled.
                 *
                 * @api public
                 */function formatArgs(){var args=arguments;var useColors=this.useColors;args[0] = (useColors?'%c':'') + this.namespace + (useColors?' %c':' ') + args[0] + (useColors?'%c ':' ') + '+' + exports.humanize(this.diff);if(!useColors)return args;var c='color: ' + this.color;args = [args[0],c,'color: inherit'].concat(Array.prototype.slice.call(args,1)); // the final "%c" is somewhat tricky, because there could be other
// arguments passed either before or after the %c, so we need to
// figure out the correct index to insert the CSS into
var index=0;var lastC=0;args[0].replace(/%[a-z%]/g,function(match){if('%%' === match)return;index++;if('%c' === match){ // we only are interested in the *last* %c
// (the user may have provided their own)
lastC = index;}});args.splice(lastC,0,c);return args;} /**
                 * Invokes `console.log()` when available.
                 * No-op when `console.log` is not a "function".
                 *
                 * @api public
                 */function log(){ // this hackery is required for IE8/9, where
// the `console.log` function doesn't have 'apply'
return 'object' === typeof console && console.log && Function.prototype.apply.call(console.log,console,arguments);} /**
                 * Save `namespaces`.
                 *
                 * @param {String} namespaces
                 * @api private
                 */function save(namespaces){try{if(null == namespaces){exports.storage.removeItem('debug');}else {exports.storage.debug = namespaces;}}catch(e) {}} /**
                 * Load `namespaces`.
                 *
                 * @return {String} returns the previously persisted debug modes
                 * @api private
                 */function load(){var r;try{r = exports.storage.debug;}catch(e) {}return r;} /**
                 * Enable namespaces listed in `localStorage.debug` initially.
                 */exports.enable(load()); /**
                 * Localstorage attempts to return the localstorage.
                 *
                 * This is necessary because safari throws
                 * when a user disables cookies/localstorage
                 * and you attempt to access it.
                 *
                 * @return {LocalStorage}
                 * @api private
                 */function localstorage(){try{return window.localStorage;}catch(e) {}}},{"./debug":18}],18:[function(_dereq_,module,exports){ /**
                 * This is the common logic for both the Node.js and web browser
                 * implementations of `debug()`.
                 *
                 * Expose `debug()` as the module.
                 */exports = module.exports = debug;exports.coerce = coerce;exports.disable = disable;exports.enable = enable;exports.enabled = enabled;exports.humanize = _dereq_('ms'); /**
                 * The currently active debug mode names, and names to skip.
                 */exports.names = [];exports.skips = []; /**
                 * Map of special "%n" handling functions, for the debug "format" argument.
                 *
                 * Valid key names are a single, lowercased letter, i.e. "n".
                 */exports.formatters = {}; /**
                 * Previously assigned color.
                 */var prevColor=0; /**
                 * Previous log timestamp.
                 */var prevTime; /**
                 * Select a color.
                 *
                 * @return {Number}
                 * @api private
                 */function selectColor(){return exports.colors[prevColor++ % exports.colors.length];} /**
                 * Create a debugger with the given `namespace`.
                 *
                 * @param {String} namespace
                 * @return {Function}
                 * @api public
                 */function debug(namespace){ // define the `disabled` version
function disabled(){}disabled.enabled = false; // define the `enabled` version
function enabled(){var self=enabled; // set `diff` timestamp
var curr=+new Date();var ms=curr - (prevTime || curr);self.diff = ms;self.prev = prevTime;self.curr = curr;prevTime = curr; // add the `color` if not set
if(null == self.useColors)self.useColors = exports.useColors();if(null == self.color && self.useColors)self.color = selectColor();var args=Array.prototype.slice.call(arguments);args[0] = exports.coerce(args[0]);if('string' !== typeof args[0]){ // anything else let's inspect with %o
args = ['%o'].concat(args);} // apply any `formatters` transformations
var index=0;args[0] = args[0].replace(/%([a-z%])/g,function(match,format){ // if we encounter an escaped % then don't increase the array index
if(match === '%%')return match;index++;var formatter=exports.formatters[format];if('function' === typeof formatter){var val=args[index];match = formatter.call(self,val); // now we need to remove `args[index]` since it's inlined in the `format`
args.splice(index,1);index--;}return match;});if('function' === typeof exports.formatArgs){args = exports.formatArgs.apply(self,args);}var logFn=enabled.log || exports.log || console.log.bind(console);logFn.apply(self,args);}enabled.enabled = true;var fn=exports.enabled(namespace)?enabled:disabled;fn.namespace = namespace;return fn;} /**
                 * Enables a debug mode by namespaces. This can include modes
                 * separated by a colon and wildcards.
                 *
                 * @param {String} namespaces
                 * @api public
                 */function enable(namespaces){exports.save(namespaces);var split=(namespaces || '').split(/[\s,]+/);var len=split.length;for(var i=0;i < len;i++) {if(!split[i])continue; // ignore empty strings
namespaces = split[i].replace(/\*/g,'.*?');if(namespaces[0] === '-'){exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));}else {exports.names.push(new RegExp('^' + namespaces + '$'));}}} /**
                 * Disable debug output.
                 *
                 * @api public
                 */function disable(){exports.enable('');} /**
                 * Returns true if the given mode name is enabled, false otherwise.
                 *
                 * @param {String} name
                 * @return {Boolean}
                 * @api public
                 */function enabled(name){var i,len;for(i = 0,len = exports.skips.length;i < len;i++) {if(exports.skips[i].test(name)){return false;}}for(i = 0,len = exports.names.length;i < len;i++) {if(exports.names[i].test(name)){return true;}}return false;} /**
                 * Coerce `val`.
                 *
                 * @param {Mixed} val
                 * @return {Mixed}
                 * @api private
                 */function coerce(val){if(val instanceof Error)return val.stack || val.message;return val;}},{"ms":25}],19:[function(_dereq_,module,exports){(function(global){ /**
                     * Module dependencies.
                     */var keys=_dereq_('./keys');var hasBinary=_dereq_('has-binary');var sliceBuffer=_dereq_('arraybuffer.slice');var base64encoder=_dereq_('base64-arraybuffer');var after=_dereq_('after');var utf8=_dereq_('utf8'); /**
                     * Check if we are running an android browser. That requires us to use
                     * ArrayBuffer with polling transports...
                     *
                     * http://ghinda.net/jpeg-blob-ajax-android/
                     */var isAndroid=navigator.userAgent.match(/Android/i); /**
                     * Check if we are running in PhantomJS.
                     * Uploading a Blob with PhantomJS does not work correctly, as reported here:
                     * https://github.com/ariya/phantomjs/issues/11395
                     * @type boolean
                     */var isPhantomJS=/PhantomJS/i.test(navigator.userAgent); /**
                     * When true, avoids using Blobs to encode payloads.
                     * @type boolean
                     */var dontSendBlobs=isAndroid || isPhantomJS; /**
                     * Current protocol version.
                     */exports.protocol = 3; /**
                     * Packet types.
                     */var packets=exports.packets = {open:0, // non-ws
close:1, // non-ws
ping:2,pong:3,message:4,upgrade:5,noop:6};var packetslist=keys(packets); /**
                     * Premade error packet.
                     */var err={type:'error',data:'parser error'}; /**
                     * Create a blob api even for blob builder when vendor prefixes exist
                     */var Blob=_dereq_('blob'); /**
                     * Encodes a packet.
                     *
                     *     <packet type id> [ <data> ]
                     *
                     * Example:
                     *
                     *     5hello world
                     *     3
                     *     4
                     *
                     * Binary is encoded in an identical principle
                     *
                     * @api private
                     */exports.encodePacket = function(packet,supportsBinary,utf8encode,callback){if('function' == typeof supportsBinary){callback = supportsBinary;supportsBinary = false;}if('function' == typeof utf8encode){callback = utf8encode;utf8encode = null;}var data=packet.data === undefined?undefined:packet.data.buffer || packet.data;if(global.ArrayBuffer && data instanceof ArrayBuffer){return encodeArrayBuffer(packet,supportsBinary,callback);}else if(Blob && data instanceof global.Blob){return encodeBlob(packet,supportsBinary,callback);} // might be an object with { base64: true, data: dataAsBase64String }
if(data && data.base64){return encodeBase64Object(packet,callback);} // Sending data as a utf-8 string
var encoded=packets[packet.type]; // data fragment is optional
if(undefined !== packet.data){encoded += utf8encode?utf8.encode(String(packet.data)):String(packet.data);}return callback('' + encoded);};function encodeBase64Object(packet,callback){ // packet data is an object { base64: true, data: dataAsBase64String }
var message='b' + exports.packets[packet.type] + packet.data.data;return callback(message);} /**
                     * Encode packet helpers for binary types
                     */function encodeArrayBuffer(packet,supportsBinary,callback){if(!supportsBinary){return exports.encodeBase64Packet(packet,callback);}var data=packet.data;var contentArray=new Uint8Array(data);var resultBuffer=new Uint8Array(1 + data.byteLength);resultBuffer[0] = packets[packet.type];for(var i=0;i < contentArray.length;i++) {resultBuffer[i + 1] = contentArray[i];}return callback(resultBuffer.buffer);}function encodeBlobAsArrayBuffer(packet,supportsBinary,callback){if(!supportsBinary){return exports.encodeBase64Packet(packet,callback);}var fr=new FileReader();fr.onload = function(){packet.data = fr.result;exports.encodePacket(packet,supportsBinary,true,callback);};return fr.readAsArrayBuffer(packet.data);}function encodeBlob(packet,supportsBinary,callback){if(!supportsBinary){return exports.encodeBase64Packet(packet,callback);}if(dontSendBlobs){return encodeBlobAsArrayBuffer(packet,supportsBinary,callback);}var length=new Uint8Array(1);length[0] = packets[packet.type];var blob=new Blob([length.buffer,packet.data]);return callback(blob);} /**
                     * Encodes a packet with binary data in a base64 string
                     *
                     * @param {Object} packet, has `type` and `data`
                     * @return {String} base64 encoded message
                     */exports.encodeBase64Packet = function(packet,callback){var message='b' + exports.packets[packet.type];if(Blob && packet.data instanceof global.Blob){var fr=new FileReader();fr.onload = function(){var b64=fr.result.split(',')[1];callback(message + b64);};return fr.readAsDataURL(packet.data);}var b64data;try{b64data = String.fromCharCode.apply(null,new Uint8Array(packet.data));}catch(e) { // iPhone Safari doesn't let you apply with typed arrays
var typed=new Uint8Array(packet.data);var basic=new Array(typed.length);for(var i=0;i < typed.length;i++) {basic[i] = typed[i];}b64data = String.fromCharCode.apply(null,basic);}message += global.btoa(b64data);return callback(message);}; /**
                     * Decodes a packet. Changes format to Blob if requested.
                     *
                     * @return {Object} with `type` and `data` (if any)
                     * @api private
                     */exports.decodePacket = function(data,binaryType,utf8decode){ // String data
if(typeof data == 'string' || data === undefined){if(data.charAt(0) == 'b'){return exports.decodeBase64Packet(data.substr(1),binaryType);}if(utf8decode){try{data = utf8.decode(data);}catch(e) {return err;}}var type=data.charAt(0);if(Number(type) != type || !packetslist[type]){return err;}if(data.length > 1){return {type:packetslist[type],data:data.substring(1)};}else {return {type:packetslist[type]};}}var asArray=new Uint8Array(data);var type=asArray[0];var rest=sliceBuffer(data,1);if(Blob && binaryType === 'blob'){rest = new Blob([rest]);}return {type:packetslist[type],data:rest};}; /**
                     * Decodes a packet encoded in a base64 string
                     *
                     * @param {String} base64 encoded message
                     * @return {Object} with `type` and `data` (if any)
                     */exports.decodeBase64Packet = function(msg,binaryType){var type=packetslist[msg.charAt(0)];if(!global.ArrayBuffer){return {type:type,data:{base64:true,data:msg.substr(1)}};}var data=base64encoder.decode(msg.substr(1));if(binaryType === 'blob' && Blob){data = new Blob([data]);}return {type:type,data:data};}; /**
                     * Encodes multiple messages (payload).
                     *
                     *     <length>:data
                     *
                     * Example:
                     *
                     *     11:hello world2:hi
                     *
                     * If any contents are binary, they will be encoded as base64 strings. Base64
                     * encoded strings are marked with a b before the length specifier
                     *
                     * @param {Array} packets
                     * @api private
                     */exports.encodePayload = function(packets,supportsBinary,callback){if(typeof supportsBinary == 'function'){callback = supportsBinary;supportsBinary = null;}var isBinary=hasBinary(packets);if(supportsBinary && isBinary){if(Blob && !dontSendBlobs){return exports.encodePayloadAsBlob(packets,callback);}return exports.encodePayloadAsArrayBuffer(packets,callback);}if(!packets.length){return callback('0:');}function setLengthHeader(message){return message.length + ':' + message;}function encodeOne(packet,doneCallback){exports.encodePacket(packet,!isBinary?false:supportsBinary,true,function(message){doneCallback(null,setLengthHeader(message));});}map(packets,encodeOne,function(err,results){return callback(results.join(''));});}; /**
                     * Async array map using after
                     */function map(ary,each,done){var result=new Array(ary.length);var next=after(ary.length,done);var eachWithIndex=function eachWithIndex(i,el,cb){each(el,function(error,msg){result[i] = msg;cb(error,result);});};for(var i=0;i < ary.length;i++) {eachWithIndex(i,ary[i],next);}} /*
                     * Decodes data when a payload is maybe expected. Possible binary contents are
                     * decoded from their base64 representation
                     *
                     * @param {String} data, callback method
                     * @api public
                     */exports.decodePayload = function(data,binaryType,callback){if(typeof data != 'string'){return exports.decodePayloadAsBinary(data,binaryType,callback);}if(typeof binaryType === 'function'){callback = binaryType;binaryType = null;}var packet;if(data == ''){ // parser error - ignoring payload
return callback(err,0,1);}var length='',n,msg;for(var i=0,l=data.length;i < l;i++) {var chr=data.charAt(i);if(':' != chr){length += chr;}else {if('' == length || length != (n = Number(length))){ // parser error - ignoring payload
return callback(err,0,1);}msg = data.substr(i + 1,n);if(length != msg.length){ // parser error - ignoring payload
return callback(err,0,1);}if(msg.length){packet = exports.decodePacket(msg,binaryType,true);if(err.type == packet.type && err.data == packet.data){ // parser error in individual packet - ignoring payload
return callback(err,0,1);}var ret=callback(packet,i + n,l);if(false === ret)return;} // advance cursor
i += n;length = '';}}if(length != ''){ // parser error - ignoring payload
return callback(err,0,1);}}; /**
                     * Encodes multiple messages (payload) as binary.
                     *
                     * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
                     * 255><data>
                     *
                     * Example:
                     * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
                     *
                     * @param {Array} packets
                     * @return {ArrayBuffer} encoded payload
                     * @api private
                     */exports.encodePayloadAsArrayBuffer = function(packets,callback){if(!packets.length){return callback(new ArrayBuffer(0));}function encodeOne(packet,doneCallback){exports.encodePacket(packet,true,true,function(data){return doneCallback(null,data);});}map(packets,encodeOne,function(err,encodedPackets){var totalLength=encodedPackets.reduce(function(acc,p){var len;if(typeof p === 'string'){len = p.length;}else {len = p.byteLength;}return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
},0);var resultArray=new Uint8Array(totalLength);var bufferIndex=0;encodedPackets.forEach(function(p){var isString=typeof p === 'string';var ab=p;if(isString){var view=new Uint8Array(p.length);for(var i=0;i < p.length;i++) {view[i] = p.charCodeAt(i);}ab = view.buffer;}if(isString){ // not true binary
resultArray[bufferIndex++] = 0;}else { // true binary
resultArray[bufferIndex++] = 1;}var lenStr=ab.byteLength.toString();for(var i=0;i < lenStr.length;i++) {resultArray[bufferIndex++] = parseInt(lenStr[i]);}resultArray[bufferIndex++] = 255;var view=new Uint8Array(ab);for(var i=0;i < view.length;i++) {resultArray[bufferIndex++] = view[i];}});return callback(resultArray.buffer);});}; /**
                     * Encode as Blob
                     */exports.encodePayloadAsBlob = function(packets,callback){function encodeOne(packet,doneCallback){exports.encodePacket(packet,true,true,function(encoded){var binaryIdentifier=new Uint8Array(1);binaryIdentifier[0] = 1;if(typeof encoded === 'string'){var view=new Uint8Array(encoded.length);for(var i=0;i < encoded.length;i++) {view[i] = encoded.charCodeAt(i);}encoded = view.buffer;binaryIdentifier[0] = 0;}var len=encoded instanceof ArrayBuffer?encoded.byteLength:encoded.size;var lenStr=len.toString();var lengthAry=new Uint8Array(lenStr.length + 1);for(var i=0;i < lenStr.length;i++) {lengthAry[i] = parseInt(lenStr[i]);}lengthAry[lenStr.length] = 255;if(Blob){var blob=new Blob([binaryIdentifier.buffer,lengthAry.buffer,encoded]);doneCallback(null,blob);}});}map(packets,encodeOne,function(err,results){return callback(new Blob(results));});}; /*
                     * Decodes data when a payload is maybe expected. Strings are decoded by
                     * interpreting each byte as a key code for entries marked to start with 0. See
                     * description of encodePayloadAsBinary
                     *
                     * @param {ArrayBuffer} data, callback method
                     * @api public
                     */exports.decodePayloadAsBinary = function(data,binaryType,callback){if(typeof binaryType === 'function'){callback = binaryType;binaryType = null;}var bufferTail=data;var buffers=[];var numberTooLong=false;while(bufferTail.byteLength > 0) {var tailArray=new Uint8Array(bufferTail);var isString=tailArray[0] === 0;var msgLength='';for(var i=1;;i++) {if(tailArray[i] == 255)break;if(msgLength.length > 310){numberTooLong = true;break;}msgLength += tailArray[i];}if(numberTooLong)return callback(err,0,1);bufferTail = sliceBuffer(bufferTail,2 + msgLength.length);msgLength = parseInt(msgLength);var msg=sliceBuffer(bufferTail,0,msgLength);if(isString){try{msg = String.fromCharCode.apply(null,new Uint8Array(msg));}catch(e) { // iPhone Safari doesn't let you apply to typed arrays
var typed=new Uint8Array(msg);msg = '';for(var i=0;i < typed.length;i++) {msg += String.fromCharCode(typed[i]);}}}buffers.push(msg);bufferTail = sliceBuffer(bufferTail,msgLength);}var total=buffers.length;buffers.forEach(function(buffer,i){callback(exports.decodePacket(buffer,binaryType,true),i,total);});};}).call(this,typeof self !== "undefined"?self:typeof window !== "undefined"?window:typeof global !== "undefined"?global:{});},{"./keys":20,"after":11,"arraybuffer.slice":12,"base64-arraybuffer":13,"blob":14,"has-binary":21,"utf8":29}],20:[function(_dereq_,module,exports){ /**
                 * Gets the keys for an object.
                 *
                 * @return {Array} keys
                 * @api private
                 */module.exports = Object.keys || function keys(obj){var arr=[];var has=Object.prototype.hasOwnProperty;for(var i in obj) {if(has.call(obj,i)){arr.push(i);}}return arr;};},{}],21:[function(_dereq_,module,exports){(function(global){ /*
                     * Module requirements.
                     */var isArray=_dereq_('isarray'); /**
                     * Module exports.
                     */module.exports = hasBinary; /**
                     * Checks for binary data.
                     *
                     * Right now only Buffer and ArrayBuffer are supported..
                     *
                     * @param {Object} anything
                     * @api public
                     */function hasBinary(data){function _hasBinary(obj){if(!obj)return false;if(global.Buffer && global.Buffer.isBuffer(obj) || global.ArrayBuffer && obj instanceof ArrayBuffer || global.Blob && obj instanceof Blob || global.File && obj instanceof File){return true;}if(isArray(obj)){for(var i=0;i < obj.length;i++) {if(_hasBinary(obj[i])){return true;}}}else if(obj && 'object' == typeof obj){if(obj.toJSON){obj = obj.toJSON();}for(var key in obj) {if(Object.prototype.hasOwnProperty.call(obj,key) && _hasBinary(obj[key])){return true;}}}return false;}return _hasBinary(data);}}).call(this,typeof self !== "undefined"?self:typeof window !== "undefined"?window:typeof global !== "undefined"?global:{});},{"isarray":24}],22:[function(_dereq_,module,exports){ /**
                 * Module exports.
                 *
                 * Logic borrowed from Modernizr:
                 *
                 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
                 */try{module.exports = typeof XMLHttpRequest !== 'undefined' && 'withCredentials' in new XMLHttpRequest();}catch(err) { // if XMLHttp support is disabled in IE then it will throw
// when trying to create
module.exports = false;}},{}],23:[function(_dereq_,module,exports){var indexOf=[].indexOf;module.exports = function(arr,obj){if(indexOf)return arr.indexOf(obj);for(var i=0;i < arr.length;++i) {if(arr[i] === obj)return i;}return -1;};},{}],24:[function(_dereq_,module,exports){module.exports = Array.isArray || function(arr){return Object.prototype.toString.call(arr) == '[object Array]';};},{}],25:[function(_dereq_,module,exports){ /**
                 * Helpers.
                 */var s=1000;var m=s * 60;var h=m * 60;var d=h * 24;var y=d * 365.25; /**
                 * Parse or format the given `val`.
                 *
                 * Options:
                 *
                 *  - `long` verbose formatting [false]
                 *
                 * @param {String|Number} val
                 * @param {Object} options
                 * @return {String|Number}
                 * @api public
                 */module.exports = function(val,options){options = options || {};if('string' == typeof val)return parse(val);return options.long?long(val):short(val);}; /**
                 * Parse the given `str` and return milliseconds.
                 *
                 * @param {String} str
                 * @return {Number}
                 * @api private
                 */function parse(str){str = '' + str;if(str.length > 10000)return;var match=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);if(!match)return;var n=parseFloat(match[1]);var type=(match[2] || 'ms').toLowerCase();switch(type){case 'years':case 'year':case 'yrs':case 'yr':case 'y':return n * y;case 'days':case 'day':case 'd':return n * d;case 'hours':case 'hour':case 'hrs':case 'hr':case 'h':return n * h;case 'minutes':case 'minute':case 'mins':case 'min':case 'm':return n * m;case 'seconds':case 'second':case 'secs':case 'sec':case 's':return n * s;case 'milliseconds':case 'millisecond':case 'msecs':case 'msec':case 'ms':return n;}} /**
                 * Short format for `ms`.
                 *
                 * @param {Number} ms
                 * @return {String}
                 * @api private
                 */function short(ms){if(ms >= d)return Math.round(ms / d) + 'd';if(ms >= h)return Math.round(ms / h) + 'h';if(ms >= m)return Math.round(ms / m) + 'm';if(ms >= s)return Math.round(ms / s) + 's';return ms + 'ms';} /**
                 * Long format for `ms`.
                 *
                 * @param {Number} ms
                 * @return {String}
                 * @api private
                 */function long(ms){return plural(ms,d,'day') || plural(ms,h,'hour') || plural(ms,m,'minute') || plural(ms,s,'second') || ms + ' ms';} /**
                 * Pluralization helper.
                 */function plural(ms,n,name){if(ms < n)return;if(ms < n * 1.5)return Math.floor(ms / n) + ' ' + name;return Math.ceil(ms / n) + ' ' + name + 's';}},{}],26:[function(_dereq_,module,exports){(function(global){ /**
                     * JSON parse.
                     *
                     * @see Based on jQuery#parseJSON (MIT) and JSON2
                     * @api private
                     */var rvalidchars=/^[\],:{}\s]*$/;var rvalidescape=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;var rvalidtokens=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;var rvalidbraces=/(?:^|:|,)(?:\s*\[)+/g;var rtrimLeft=/^\s+/;var rtrimRight=/\s+$/;module.exports = function parsejson(data){if('string' != typeof data || !data){return null;}data = data.replace(rtrimLeft,'').replace(rtrimRight,''); // Attempt to parse using the native JSON parser first
if(global.JSON && JSON.parse){return JSON.parse(data);}if(rvalidchars.test(data.replace(rvalidescape,'@').replace(rvalidtokens,']').replace(rvalidbraces,''))){return new Function('return ' + data)();}};}).call(this,typeof self !== "undefined"?self:typeof window !== "undefined"?window:typeof global !== "undefined"?global:{});},{}],27:[function(_dereq_,module,exports){ /**
                 * Compiles a querystring
                 * Returns string representation of the object
                 *
                 * @param {Object}
                 * @api private
                 */exports.encode = function(obj){var str='';for(var i in obj) {if(obj.hasOwnProperty(i)){if(str.length)str += '&';str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);}}return str;}; /**
                 * Parses a simple querystring into an object
                 *
                 * @param {String} qs
                 * @api private
                 */exports.decode = function(qs){var qry={};var pairs=qs.split('&');for(var i=0,l=pairs.length;i < l;i++) {var pair=pairs[i].split('=');qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);}return qry;};},{}],28:[function(_dereq_,module,exports){ /**
                 * Parses an URI
                 *
                 * @author Steven Levithan <stevenlevithan.com> (MIT license)
                 * @api private
                 */var re=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;var parts=['source','protocol','authority','userInfo','user','password','host','port','relative','path','directory','file','query','anchor'];module.exports = function parseuri(str){var src=str,b=str.indexOf('['),e=str.indexOf(']');if(b != -1 && e != -1){str = str.substring(0,b) + str.substring(b,e).replace(/:/g,';') + str.substring(e,str.length);}var m=re.exec(str || ''),uri={},i=14;while(i--) {uri[parts[i]] = m[i] || '';}if(b != -1 && e != -1){uri.source = src;uri.host = uri.host.substring(1,uri.host.length - 1).replace(/;/g,':');uri.authority = uri.authority.replace('[','').replace(']','').replace(/;/g,':');uri.ipv6uri = true;}return uri;};},{}],29:[function(_dereq_,module,exports){(function(global){ /*! https://mths.be/utf8js v2.0.0 by @mathias */;(function(root){ // Detect free variables `exports`
var freeExports=typeof exports == 'object' && exports; // Detect free variable `module`
var freeModule=typeof module == 'object' && module && module.exports == freeExports && module; // Detect free variable `global`, from Node.js or Browserified code,
// and use it as `root`
var freeGlobal=typeof global == 'object' && global;if(freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal){root = freeGlobal;} /*--------------------------------------------------------------------------*/var stringFromCharCode=String.fromCharCode; // Taken from https://mths.be/punycode
function ucs2decode(string){var output=[];var counter=0;var length=string.length;var value;var extra;while(counter < length) {value = string.charCodeAt(counter++);if(value >= 0xD800 && value <= 0xDBFF && counter < length){ // high surrogate, and there is a next character
extra = string.charCodeAt(counter++);if((extra & 0xFC00) == 0xDC00){ // low surrogate
output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);}else { // unmatched surrogate; only append this code unit, in case the next
// code unit is the high surrogate of a surrogate pair
output.push(value);counter--;}}else {output.push(value);}}return output;} // Taken from https://mths.be/punycode
function ucs2encode(array){var length=array.length;var index=-1;var value;var output='';while(++index < length) {value = array[index];if(value > 0xFFFF){value -= 0x10000;output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);value = 0xDC00 | value & 0x3FF;}output += stringFromCharCode(value);}return output;}function checkScalarValue(codePoint){if(codePoint >= 0xD800 && codePoint <= 0xDFFF){throw Error('Lone surrogate U+' + codePoint.toString(16).toUpperCase() + ' is not a scalar value');}} /*--------------------------------------------------------------------------*/function createByte(codePoint,shift){return stringFromCharCode(codePoint >> shift & 0x3F | 0x80);}function encodeCodePoint(codePoint){if((codePoint & 0xFFFFFF80) == 0){ // 1-byte sequence
return stringFromCharCode(codePoint);}var symbol='';if((codePoint & 0xFFFFF800) == 0){ // 2-byte sequence
symbol = stringFromCharCode(codePoint >> 6 & 0x1F | 0xC0);}else if((codePoint & 0xFFFF0000) == 0){ // 3-byte sequence
checkScalarValue(codePoint);symbol = stringFromCharCode(codePoint >> 12 & 0x0F | 0xE0);symbol += createByte(codePoint,6);}else if((codePoint & 0xFFE00000) == 0){ // 4-byte sequence
symbol = stringFromCharCode(codePoint >> 18 & 0x07 | 0xF0);symbol += createByte(codePoint,12);symbol += createByte(codePoint,6);}symbol += stringFromCharCode(codePoint & 0x3F | 0x80);return symbol;}function utf8encode(string){var codePoints=ucs2decode(string);var length=codePoints.length;var index=-1;var codePoint;var byteString='';while(++index < length) {codePoint = codePoints[index];byteString += encodeCodePoint(codePoint);}return byteString;} /*--------------------------------------------------------------------------*/function readContinuationByte(){if(byteIndex >= byteCount){throw Error('Invalid byte index');}var continuationByte=byteArray[byteIndex] & 0xFF;byteIndex++;if((continuationByte & 0xC0) == 0x80){return continuationByte & 0x3F;} // If we end up here, it’s not a continuation byte
throw Error('Invalid continuation byte');}function decodeSymbol(){var byte1;var byte2;var byte3;var byte4;var codePoint;if(byteIndex > byteCount){throw Error('Invalid byte index');}if(byteIndex == byteCount){return false;} // Read first byte
byte1 = byteArray[byteIndex] & 0xFF;byteIndex++; // 1-byte sequence (no continuation bytes)
if((byte1 & 0x80) == 0){return byte1;} // 2-byte sequence
if((byte1 & 0xE0) == 0xC0){var byte2=readContinuationByte();codePoint = (byte1 & 0x1F) << 6 | byte2;if(codePoint >= 0x80){return codePoint;}else {throw Error('Invalid continuation byte');}} // 3-byte sequence (may include unpaired surrogates)
if((byte1 & 0xF0) == 0xE0){byte2 = readContinuationByte();byte3 = readContinuationByte();codePoint = (byte1 & 0x0F) << 12 | byte2 << 6 | byte3;if(codePoint >= 0x0800){checkScalarValue(codePoint);return codePoint;}else {throw Error('Invalid continuation byte');}} // 4-byte sequence
if((byte1 & 0xF8) == 0xF0){byte2 = readContinuationByte();byte3 = readContinuationByte();byte4 = readContinuationByte();codePoint = (byte1 & 0x0F) << 0x12 | byte2 << 0x0C | byte3 << 0x06 | byte4;if(codePoint >= 0x010000 && codePoint <= 0x10FFFF){return codePoint;}}throw Error('Invalid UTF-8 detected');}var byteArray;var byteCount;var byteIndex;function utf8decode(byteString){byteArray = ucs2decode(byteString);byteCount = byteArray.length;byteIndex = 0;var codePoints=[];var tmp;while((tmp = decodeSymbol()) !== false) {codePoints.push(tmp);}return ucs2encode(codePoints);} /*--------------------------------------------------------------------------*/var utf8={'version':'2.0.0','encode':utf8encode,'decode':utf8decode}; // Some AMD build optimizers, like r.js, check for specific condition patterns
// like the following:
if(typeof define == 'function' && typeof define.amd == 'object' && define.amd){define(function(){return utf8;});}else if(freeExports && !freeExports.nodeType){if(freeModule){ // in Node.js or RingoJS v0.8.0+
freeModule.exports = utf8;}else { // in Narwhal or RingoJS v0.7.0-
var object={};var hasOwnProperty=object.hasOwnProperty;for(var key in utf8) {hasOwnProperty.call(utf8,key) && (freeExports[key] = utf8[key]);}}}else { // in Rhino or a web browser
root.utf8 = utf8;}})(this);}).call(this,typeof self !== "undefined"?self:typeof window !== "undefined"?window:typeof global !== "undefined"?global:{});},{}],30:[function(_dereq_,module,exports){'use strict';var alphabet='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split(''),length=64,map={},seed=0,i=0,prev; /**
                 * Return a string representing the specified number.
                 *
                 * @param {Number} num The number to convert.
                 * @returns {String} The string representation of the number.
                 * @api public
                 */function encode(num){var encoded='';do {encoded = alphabet[num % length] + encoded;num = Math.floor(num / length);}while(num > 0);return encoded;} /**
                 * Return the integer value specified by the given string.
                 *
                 * @param {String} str The string to convert.
                 * @returns {Number} The integer value represented by the string.
                 * @api public
                 */function decode(str){var decoded=0;for(i = 0;i < str.length;i++) {decoded = decoded * length + map[str.charAt(i)];}return decoded;} /**
                 * Yeast: A tiny growing id generator.
                 *
                 * @returns {String} A unique id.
                 * @api public
                 */function yeast(){var now=encode(+new Date());if(now !== prev)return seed = 0,prev = now;return now + '.' + encode(seed++);} //
// Map each character to its index.
//
for(;i < length;i++) map[alphabet[i]] = i; //
// Expose the `yeast`, `encode` and `decode` functions.
//
yeast.encode = encode;yeast.decode = decode;module.exports = yeast;},{}],31:[function(_dereq_,module,exports){ /**
                 * Module dependencies.
                 */var url=_dereq_('./url');var parser=_dereq_('socket.io-parser');var Manager=_dereq_('./manager');var debug=_dereq_('debug')('socket.io-client'); /**
                 * Module exports.
                 */module.exports = exports = lookup; /**
                 * Managers cache.
                 */var cache=exports.managers = {}; /**
                 * Looks up an existing `Manager` for multiplexing.
                 * If the user summons:
                 *
                 *   `io('http://localhost/a');`
                 *   `io('http://localhost/b');`
                 *
                 * We reuse the existing instance based on same scheme/port/host,
                 * and we initialize sockets for each namespace.
                 *
                 * @api public
                 */function lookup(uri,opts){if(typeof uri == 'object'){opts = uri;uri = undefined;}opts = opts || {};var parsed=url(uri);var source=parsed.source;var id=parsed.id;var path=parsed.path;var sameNamespace=cache[id] && path in cache[id].nsps;var newConnection=opts.forceNew || opts['force new connection'] || false === opts.multiplex || sameNamespace;var io;if(newConnection){debug('ignoring socket cache for %s',source);io = Manager(source,opts);}else {if(!cache[id]){debug('new io instance for %s',source);cache[id] = Manager(source,opts);}io = cache[id];}return io.socket(parsed.path);} /**
                 * Protocol version.
                 *
                 * @api public
                 */exports.protocol = parser.protocol; /**
                 * `connect`.
                 *
                 * @param {String} uri
                 * @api public
                 */exports.connect = lookup; /**
                 * Expose constructors for standalone build.
                 *
                 * @api public
                 */exports.Manager = _dereq_('./manager');exports.Socket = _dereq_('./socket');},{"./manager":32,"./socket":34,"./url":35,"debug":39,"socket.io-parser":47}],32:[function(_dereq_,module,exports){ /**
                 * Module dependencies.
                 */var eio=_dereq_('engine.io-client');var Socket=_dereq_('./socket');var Emitter=_dereq_('component-emitter');var parser=_dereq_('socket.io-parser');var on=_dereq_('./on');var bind=_dereq_('component-bind');var debug=_dereq_('debug')('socket.io-client:manager');var indexOf=_dereq_('indexof');var Backoff=_dereq_('backo2'); /**
                 * IE6+ hasOwnProperty
                 */var has=Object.prototype.hasOwnProperty; /**
                 * Module exports
                 */module.exports = Manager; /**
                 * `Manager` constructor.
                 *
                 * @param {String} engine instance or engine uri/opts
                 * @param {Object} options
                 * @api public
                 */function Manager(uri,opts){if(!(this instanceof Manager))return new Manager(uri,opts);if(uri && 'object' == typeof uri){opts = uri;uri = undefined;}opts = opts || {};opts.path = opts.path || '/socket.io';this.nsps = {};this.subs = [];this.opts = opts;this.reconnection(opts.reconnection !== false);this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);this.reconnectionDelay(opts.reconnectionDelay || 1000);this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);this.randomizationFactor(opts.randomizationFactor || 0.5);this.backoff = new Backoff({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()});this.timeout(null == opts.timeout?20000:opts.timeout);this.readyState = 'closed';this.uri = uri;this.connecting = [];this.lastPing = null;this.encoding = false;this.packetBuffer = [];this.encoder = new parser.Encoder();this.decoder = new parser.Decoder();this.autoConnect = opts.autoConnect !== false;if(this.autoConnect)this.open();} /**
                 * Propagate given event to sockets and emit on `this`
                 *
                 * @api private
                 */Manager.prototype.emitAll = function(){this.emit.apply(this,arguments);for(var nsp in this.nsps) {if(has.call(this.nsps,nsp)){this.nsps[nsp].emit.apply(this.nsps[nsp],arguments);}}}; /**
                 * Update `socket.id` of all sockets
                 *
                 * @api private
                 */Manager.prototype.updateSocketIds = function(){for(var nsp in this.nsps) {if(has.call(this.nsps,nsp)){this.nsps[nsp].id = this.engine.id;}}}; /**
                 * Mix in `Emitter`.
                 */Emitter(Manager.prototype); /**
                 * Sets the `reconnection` config.
                 *
                 * @param {Boolean} true/false if it should automatically reconnect
                 * @return {Manager} self or value
                 * @api public
                 */Manager.prototype.reconnection = function(v){if(!arguments.length)return this._reconnection;this._reconnection = !!v;return this;}; /**
                 * Sets the reconnection attempts config.
                 *
                 * @param {Number} max reconnection attempts before giving up
                 * @return {Manager} self or value
                 * @api public
                 */Manager.prototype.reconnectionAttempts = function(v){if(!arguments.length)return this._reconnectionAttempts;this._reconnectionAttempts = v;return this;}; /**
                 * Sets the delay between reconnections.
                 *
                 * @param {Number} delay
                 * @return {Manager} self or value
                 * @api public
                 */Manager.prototype.reconnectionDelay = function(v){if(!arguments.length)return this._reconnectionDelay;this._reconnectionDelay = v;this.backoff && this.backoff.setMin(v);return this;};Manager.prototype.randomizationFactor = function(v){if(!arguments.length)return this._randomizationFactor;this._randomizationFactor = v;this.backoff && this.backoff.setJitter(v);return this;}; /**
                 * Sets the maximum delay between reconnections.
                 *
                 * @param {Number} delay
                 * @return {Manager} self or value
                 * @api public
                 */Manager.prototype.reconnectionDelayMax = function(v){if(!arguments.length)return this._reconnectionDelayMax;this._reconnectionDelayMax = v;this.backoff && this.backoff.setMax(v);return this;}; /**
                 * Sets the connection timeout. `false` to disable
                 *
                 * @return {Manager} self or value
                 * @api public
                 */Manager.prototype.timeout = function(v){if(!arguments.length)return this._timeout;this._timeout = v;return this;}; /**
                 * Starts trying to reconnect if reconnection is enabled and we have not
                 * started reconnecting yet
                 *
                 * @api private
                 */Manager.prototype.maybeReconnectOnOpen = function(){ // Only try to reconnect if it's the first time we're connecting
if(!this.reconnecting && this._reconnection && this.backoff.attempts === 0){ // keeps reconnection from firing twice for the same reconnection loop
this.reconnect();}}; /**
                 * Sets the current transport `socket`.
                 *
                 * @param {Function} optional, callback
                 * @return {Manager} self
                 * @api public
                 */Manager.prototype.open = Manager.prototype.connect = function(fn){debug('readyState %s',this.readyState);if(~this.readyState.indexOf('open'))return this;debug('opening %s',this.uri);this.engine = eio(this.uri,this.opts);var socket=this.engine;var self=this;this.readyState = 'opening';this.skipReconnect = false; // emit `open`
var openSub=on(socket,'open',function(){self.onopen();fn && fn();}); // emit `connect_error`
var errorSub=on(socket,'error',function(data){debug('connect_error');self.cleanup();self.readyState = 'closed';self.emitAll('connect_error',data);if(fn){var err=new Error('Connection error');err.data = data;fn(err);}else { // Only do this if there is no fn to handle the error
self.maybeReconnectOnOpen();}}); // emit `connect_timeout`
if(false !== this._timeout){var timeout=this._timeout;debug('connect attempt will timeout after %d',timeout); // set timer
var timer=setTimeout(function(){debug('connect attempt timed out after %d',timeout);openSub.destroy();socket.close();socket.emit('error','timeout');self.emitAll('connect_timeout',timeout);},timeout);this.subs.push({destroy:function destroy(){clearTimeout(timer);}});}this.subs.push(openSub);this.subs.push(errorSub);return this;}; /**
                 * Called upon transport open.
                 *
                 * @api private
                 */Manager.prototype.onopen = function(){debug('open'); // clear old subs
this.cleanup(); // mark as open
this.readyState = 'open';this.emit('open'); // add new subs
var socket=this.engine;this.subs.push(on(socket,'data',bind(this,'ondata')));this.subs.push(on(socket,'ping',bind(this,'onping')));this.subs.push(on(socket,'pong',bind(this,'onpong')));this.subs.push(on(socket,'error',bind(this,'onerror')));this.subs.push(on(socket,'close',bind(this,'onclose')));this.subs.push(on(this.decoder,'decoded',bind(this,'ondecoded')));}; /**
                 * Called upon a ping.
                 *
                 * @api private
                 */Manager.prototype.onping = function(){this.lastPing = new Date();this.emitAll('ping');}; /**
                 * Called upon a packet.
                 *
                 * @api private
                 */Manager.prototype.onpong = function(){this.emitAll('pong',new Date() - this.lastPing);}; /**
                 * Called with data.
                 *
                 * @api private
                 */Manager.prototype.ondata = function(data){this.decoder.add(data);}; /**
                 * Called when parser fully decodes a packet.
                 *
                 * @api private
                 */Manager.prototype.ondecoded = function(packet){this.emit('packet',packet);}; /**
                 * Called upon socket error.
                 *
                 * @api private
                 */Manager.prototype.onerror = function(err){debug('error',err);this.emitAll('error',err);}; /**
                 * Creates a new socket for the given `nsp`.
                 *
                 * @return {Socket}
                 * @api public
                 */Manager.prototype.socket = function(nsp){var socket=this.nsps[nsp];if(!socket){socket = new Socket(this,nsp);this.nsps[nsp] = socket;var self=this;socket.on('connecting',onConnecting);socket.on('connect',function(){socket.id = self.engine.id;});if(this.autoConnect){ // manually call here since connecting evnet is fired before listening
onConnecting();}}function onConnecting(){if(! ~indexOf(self.connecting,socket)){self.connecting.push(socket);}}return socket;}; /**
                 * Called upon a socket close.
                 *
                 * @param {Socket} socket
                 */Manager.prototype.destroy = function(socket){var index=indexOf(this.connecting,socket);if(~index)this.connecting.splice(index,1);if(this.connecting.length)return;this.close();}; /**
                 * Writes a packet.
                 *
                 * @param {Object} packet
                 * @api private
                 */Manager.prototype.packet = function(packet){debug('writing packet %j',packet);var self=this;if(!self.encoding){ // encode, then write to engine with result
self.encoding = true;this.encoder.encode(packet,function(encodedPackets){for(var i=0;i < encodedPackets.length;i++) {self.engine.write(encodedPackets[i],packet.options);}self.encoding = false;self.processPacketQueue();});}else { // add packet to the queue
self.packetBuffer.push(packet);}}; /**
                 * If packet buffer is non-empty, begins encoding the
                 * next packet in line.
                 *
                 * @api private
                 */Manager.prototype.processPacketQueue = function(){if(this.packetBuffer.length > 0 && !this.encoding){var pack=this.packetBuffer.shift();this.packet(pack);}}; /**
                 * Clean up transport subscriptions and packet buffer.
                 *
                 * @api private
                 */Manager.prototype.cleanup = function(){debug('cleanup');var sub;while(sub = this.subs.shift()) sub.destroy();this.packetBuffer = [];this.encoding = false;this.lastPing = null;this.decoder.destroy();}; /**
                 * Close the current socket.
                 *
                 * @api private
                 */Manager.prototype.close = Manager.prototype.disconnect = function(){debug('disconnect');this.skipReconnect = true;this.reconnecting = false;if('opening' == this.readyState){ // `onclose` will not fire because
// an open event never happened
this.cleanup();}this.backoff.reset();this.readyState = 'closed';if(this.engine)this.engine.close();}; /**
                 * Called upon engine close.
                 *
                 * @api private
                 */Manager.prototype.onclose = function(reason){debug('onclose');this.cleanup();this.backoff.reset();this.readyState = 'closed';this.emit('close',reason);if(this._reconnection && !this.skipReconnect){this.reconnect();}}; /**
                 * Attempt a reconnection.
                 *
                 * @api private
                 */Manager.prototype.reconnect = function(){if(this.reconnecting || this.skipReconnect)return this;var self=this;if(this.backoff.attempts >= this._reconnectionAttempts){debug('reconnect failed');this.backoff.reset();this.emitAll('reconnect_failed');this.reconnecting = false;}else {var delay=this.backoff.duration();debug('will wait %dms before reconnect attempt',delay);this.reconnecting = true;var timer=setTimeout(function(){if(self.skipReconnect)return;debug('attempting reconnect');self.emitAll('reconnect_attempt',self.backoff.attempts);self.emitAll('reconnecting',self.backoff.attempts); // check again for the case socket closed in above events
if(self.skipReconnect)return;self.open(function(err){if(err){debug('reconnect attempt error');self.reconnecting = false;self.reconnect();self.emitAll('reconnect_error',err.data);}else {debug('reconnect success');self.onreconnect();}});},delay);this.subs.push({destroy:function destroy(){clearTimeout(timer);}});}}; /**
                 * Called upon successful reconnect.
                 *
                 * @api private
                 */Manager.prototype.onreconnect = function(){var attempt=this.backoff.attempts;this.reconnecting = false;this.backoff.reset();this.updateSocketIds();this.emitAll('reconnect',attempt);};},{"./on":33,"./socket":34,"backo2":36,"component-bind":37,"component-emitter":38,"debug":39,"engine.io-client":1,"indexof":42,"socket.io-parser":47}],33:[function(_dereq_,module,exports){ /**
                 * Module exports.
                 */module.exports = on; /**
                 * Helper for subscriptions.
                 *
                 * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
                 * @param {String} event name
                 * @param {Function} callback
                 * @api public
                 */function on(obj,ev,fn){obj.on(ev,fn);return {destroy:function destroy(){obj.removeListener(ev,fn);}};}},{}],34:[function(_dereq_,module,exports){ /**
                 * Module dependencies.
                 */var parser=_dereq_('socket.io-parser');var Emitter=_dereq_('component-emitter');var toArray=_dereq_('to-array');var on=_dereq_('./on');var bind=_dereq_('component-bind');var debug=_dereq_('debug')('socket.io-client:socket');var hasBin=_dereq_('has-binary'); /**
                 * Module exports.
                 */module.exports = exports = Socket; /**
                 * Internal events (blacklisted).
                 * These events can't be emitted by the user.
                 *
                 * @api private
                 */var events={connect:1,connect_error:1,connect_timeout:1,connecting:1,disconnect:1,error:1,reconnect:1,reconnect_attempt:1,reconnect_failed:1,reconnect_error:1,reconnecting:1,ping:1,pong:1}; /**
                 * Shortcut to `Emitter#emit`.
                 */var emit=Emitter.prototype.emit; /**
                 * `Socket` constructor.
                 *
                 * @api public
                 */function Socket(io,nsp){this.io = io;this.nsp = nsp;this.json = this; // compat
this.ids = 0;this.acks = {};this.receiveBuffer = [];this.sendBuffer = [];this.connected = false;this.disconnected = true;if(this.io.autoConnect)this.open();} /**
                 * Mix in `Emitter`.
                 */Emitter(Socket.prototype); /**
                 * Subscribe to open, close and packet events
                 *
                 * @api private
                 */Socket.prototype.subEvents = function(){if(this.subs)return;var io=this.io;this.subs = [on(io,'open',bind(this,'onopen')),on(io,'packet',bind(this,'onpacket')),on(io,'close',bind(this,'onclose'))];}; /**
                 * "Opens" the socket.
                 *
                 * @api public
                 */Socket.prototype.open = Socket.prototype.connect = function(){if(this.connected)return this;this.subEvents();this.io.open(); // ensure open
if('open' == this.io.readyState)this.onopen();this.emit('connecting');return this;}; /**
                 * Sends a `message` event.
                 *
                 * @return {Socket} self
                 * @api public
                 */Socket.prototype.send = function(){var args=toArray(arguments);args.unshift('message');this.emit.apply(this,args);return this;}; /**
                 * Override `emit`.
                 * If the event is in `events`, it's emitted normally.
                 *
                 * @param {String} event name
                 * @return {Socket} self
                 * @api public
                 */Socket.prototype.emit = function(ev){if(events.hasOwnProperty(ev)){emit.apply(this,arguments);return this;}var args=toArray(arguments);var parserType=parser.EVENT; // default
if(hasBin(args)){parserType = parser.BINARY_EVENT;} // binary
var packet={type:parserType,data:args};packet.options = {};packet.options.compress = !this.flags || false !== this.flags.compress; // event ack callback
if('function' == typeof args[args.length - 1]){debug('emitting packet with ack id %d',this.ids);this.acks[this.ids] = args.pop();packet.id = this.ids++;}if(this.connected){this.packet(packet);}else {this.sendBuffer.push(packet);}delete this.flags;return this;}; /**
                 * Sends a packet.
                 *
                 * @param {Object} packet
                 * @api private
                 */Socket.prototype.packet = function(packet){packet.nsp = this.nsp;this.io.packet(packet);}; /**
                 * Called upon engine `open`.
                 *
                 * @api private
                 */Socket.prototype.onopen = function(){debug('transport is open - connecting'); // write connect packet if necessary
if('/' != this.nsp){this.packet({type:parser.CONNECT});}}; /**
                 * Called upon engine `close`.
                 *
                 * @param {String} reason
                 * @api private
                 */Socket.prototype.onclose = function(reason){debug('close (%s)',reason);this.connected = false;this.disconnected = true;delete this.id;this.emit('disconnect',reason);}; /**
                 * Called with socket packet.
                 *
                 * @param {Object} packet
                 * @api private
                 */Socket.prototype.onpacket = function(packet){if(packet.nsp != this.nsp)return;switch(packet.type){case parser.CONNECT:this.onconnect();break;case parser.EVENT:this.onevent(packet);break;case parser.BINARY_EVENT:this.onevent(packet);break;case parser.ACK:this.onack(packet);break;case parser.BINARY_ACK:this.onack(packet);break;case parser.DISCONNECT:this.ondisconnect();break;case parser.ERROR:this.emit('error',packet.data);break;}}; /**
                 * Called upon a server event.
                 *
                 * @param {Object} packet
                 * @api private
                 */Socket.prototype.onevent = function(packet){var args=packet.data || [];debug('emitting event %j',args);if(null != packet.id){debug('attaching ack callback to event');args.push(this.ack(packet.id));}if(this.connected){emit.apply(this,args);}else {this.receiveBuffer.push(args);}}; /**
                 * Produces an ack callback to emit with an event.
                 *
                 * @api private
                 */Socket.prototype.ack = function(id){var self=this;var sent=false;return function(){ // prevent double callbacks
if(sent)return;sent = true;var args=toArray(arguments);debug('sending ack %j',args);var type=hasBin(args)?parser.BINARY_ACK:parser.ACK;self.packet({type:type,id:id,data:args});};}; /**
                 * Called upon a server acknowlegement.
                 *
                 * @param {Object} packet
                 * @api private
                 */Socket.prototype.onack = function(packet){var ack=this.acks[packet.id];if('function' == typeof ack){debug('calling ack %s with %j',packet.id,packet.data);ack.apply(this,packet.data);delete this.acks[packet.id];}else {debug('bad ack %s',packet.id);}}; /**
                 * Called upon server connect.
                 *
                 * @api private
                 */Socket.prototype.onconnect = function(){this.connected = true;this.disconnected = false;this.emit('connect');this.emitBuffered();}; /**
                 * Emit buffered events (received and emitted).
                 *
                 * @api private
                 */Socket.prototype.emitBuffered = function(){var i;for(i = 0;i < this.receiveBuffer.length;i++) {emit.apply(this,this.receiveBuffer[i]);}this.receiveBuffer = [];for(i = 0;i < this.sendBuffer.length;i++) {this.packet(this.sendBuffer[i]);}this.sendBuffer = [];}; /**
                 * Called upon server disconnect.
                 *
                 * @api private
                 */Socket.prototype.ondisconnect = function(){debug('server disconnect (%s)',this.nsp);this.destroy();this.onclose('io server disconnect');}; /**
                 * Called upon forced client/server side disconnections,
                 * this method ensures the manager stops tracking us and
                 * that reconnections don't get triggered for this.
                 *
                 * @api private.
                 */Socket.prototype.destroy = function(){if(this.subs){ // clean subscriptions to avoid reconnections
for(var i=0;i < this.subs.length;i++) {this.subs[i].destroy();}this.subs = null;}this.io.destroy(this);}; /**
                 * Disconnects the socket manually.
                 *
                 * @return {Socket} self
                 * @api public
                 */Socket.prototype.close = Socket.prototype.disconnect = function(){if(this.connected){debug('performing disconnect (%s)',this.nsp);this.packet({type:parser.DISCONNECT});} // remove socket from pool
this.destroy();if(this.connected){ // fire events
this.onclose('io client disconnect');}return this;}; /**
                 * Sets the compress flag.
                 *
                 * @param {Boolean} if `true`, compresses the sending data
                 * @return {Socket} self
                 * @api public
                 */Socket.prototype.compress = function(compress){this.flags = this.flags || {};this.flags.compress = compress;return this;};},{"./on":33,"component-bind":37,"component-emitter":38,"debug":39,"has-binary":41,"socket.io-parser":47,"to-array":51}],35:[function(_dereq_,module,exports){(function(global){ /**
                     * Module dependencies.
                     */var parseuri=_dereq_('parseuri');var debug=_dereq_('debug')('socket.io-client:url'); /**
                     * Module exports.
                     */module.exports = url; /**
                     * URL parser.
                     *
                     * @param {String} url
                     * @param {Object} An object meant to mimic window.location.
                     *                 Defaults to window.location.
                     * @api public
                     */function url(uri,loc){var obj=uri; // default to window.location
var loc=loc || global.location;if(null == uri)uri = loc.protocol + '//' + loc.host; // relative path support
if('string' == typeof uri){if('/' == uri.charAt(0)){if('/' == uri.charAt(1)){uri = loc.protocol + uri;}else {uri = loc.host + uri;}}if(!/^(https?|wss?):\/\//.test(uri)){debug('protocol-less url %s',uri);if('undefined' != typeof loc){uri = loc.protocol + '//' + uri;}else {uri = 'https://' + uri;}} // parse
debug('parse %s',uri);obj = parseuri(uri);} // make sure we treat `localhost:80` and `localhost` equally
if(!obj.port){if(/^(http|ws)$/.test(obj.protocol)){obj.port = '80';}else if(/^(http|ws)s$/.test(obj.protocol)){obj.port = '443';}}obj.path = obj.path || '/';var ipv6=obj.host.indexOf(':') !== -1;var host=ipv6?'[' + obj.host + ']':obj.host; // define unique id
obj.id = obj.protocol + '://' + host + ':' + obj.port; // define href
obj.href = obj.protocol + '://' + host + (loc && loc.port == obj.port?'':':' + obj.port);return obj;}}).call(this,typeof self !== "undefined"?self:typeof window !== "undefined"?window:typeof global !== "undefined"?global:{});},{"debug":39,"parseuri":45}],36:[function(_dereq_,module,exports){ /**
                 * Expose `Backoff`.
                 */module.exports = Backoff; /**
                 * Initialize backoff timer with `opts`.
                 *
                 * - `min` initial timeout in milliseconds [100]
                 * - `max` max timeout [10000]
                 * - `jitter` [0]
                 * - `factor` [2]
                 *
                 * @param {Object} opts
                 * @api public
                 */function Backoff(opts){opts = opts || {};this.ms = opts.min || 100;this.max = opts.max || 10000;this.factor = opts.factor || 2;this.jitter = opts.jitter > 0 && opts.jitter <= 1?opts.jitter:0;this.attempts = 0;} /**
                 * Return the backoff duration.
                 *
                 * @return {Number}
                 * @api public
                 */Backoff.prototype.duration = function(){var ms=this.ms * Math.pow(this.factor,this.attempts++);if(this.jitter){var rand=Math.random();var deviation=Math.floor(rand * this.jitter * ms);ms = (Math.floor(rand * 10) & 1) == 0?ms - deviation:ms + deviation;}return Math.min(ms,this.max) | 0;}; /**
                 * Reset the number of attempts.
                 *
                 * @api public
                 */Backoff.prototype.reset = function(){this.attempts = 0;}; /**
                 * Set the minimum duration
                 *
                 * @api public
                 */Backoff.prototype.setMin = function(min){this.ms = min;}; /**
                 * Set the maximum duration
                 *
                 * @api public
                 */Backoff.prototype.setMax = function(max){this.max = max;}; /**
                 * Set the jitter
                 *
                 * @api public
                 */Backoff.prototype.setJitter = function(jitter){this.jitter = jitter;};},{}],37:[function(_dereq_,module,exports){ /**
                 * Slice reference.
                 */var slice=[].slice; /**
                 * Bind `obj` to `fn`.
                 *
                 * @param {Object} obj
                 * @param {Function|String} fn or string
                 * @return {Function}
                 * @api public
                 */module.exports = function(obj,fn){if('string' == typeof fn)fn = obj[fn];if('function' != typeof fn)throw new Error('bind() requires a function');var args=slice.call(arguments,2);return function(){return fn.apply(obj,args.concat(slice.call(arguments)));};};},{}],38:[function(_dereq_,module,exports){ /**
                 * Expose `Emitter`.
                 */module.exports = Emitter; /**
                 * Initialize a new `Emitter`.
                 *
                 * @api public
                 */function Emitter(obj){if(obj)return mixin(obj);}; /**
                 * Mixin the emitter properties.
                 *
                 * @param {Object} obj
                 * @return {Object}
                 * @api private
                 */function mixin(obj){for(var key in Emitter.prototype) {obj[key] = Emitter.prototype[key];}return obj;} /**
                 * Listen on the given `event` with `fn`.
                 *
                 * @param {String} event
                 * @param {Function} fn
                 * @return {Emitter}
                 * @api public
                 */Emitter.prototype.on = Emitter.prototype.addEventListener = function(event,fn){this._callbacks = this._callbacks || {};(this._callbacks['$' + event] = this._callbacks['$' + event] || []).push(fn);return this;}; /**
                 * Adds an `event` listener that will be invoked a single
                 * time then automatically removed.
                 *
                 * @param {String} event
                 * @param {Function} fn
                 * @return {Emitter}
                 * @api public
                 */Emitter.prototype.once = function(event,fn){function on(){this.off(event,on);fn.apply(this,arguments);}on.fn = fn;this.on(event,on);return this;}; /**
                 * Remove the given callback for `event` or all
                 * registered callbacks.
                 *
                 * @param {String} event
                 * @param {Function} fn
                 * @return {Emitter}
                 * @api public
                 */Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event,fn){this._callbacks = this._callbacks || {}; // all
if(0 == arguments.length){this._callbacks = {};return this;} // specific event
var callbacks=this._callbacks['$' + event];if(!callbacks)return this; // remove all handlers
if(1 == arguments.length){delete this._callbacks['$' + event];return this;} // remove specific handler
var cb;for(var i=0;i < callbacks.length;i++) {cb = callbacks[i];if(cb === fn || cb.fn === fn){callbacks.splice(i,1);break;}}return this;}; /**
                 * Emit `event` with the given args.
                 *
                 * @param {String} event
                 * @param {Mixed} ...
                 * @return {Emitter}
                 */Emitter.prototype.emit = function(event){this._callbacks = this._callbacks || {};var args=[].slice.call(arguments,1),callbacks=this._callbacks['$' + event];if(callbacks){callbacks = callbacks.slice(0);for(var i=0,len=callbacks.length;i < len;++i) {callbacks[i].apply(this,args);}}return this;}; /**
                 * Return array of callbacks for `event`.
                 *
                 * @param {String} event
                 * @return {Array}
                 * @api public
                 */Emitter.prototype.listeners = function(event){this._callbacks = this._callbacks || {};return this._callbacks['$' + event] || [];}; /**
                 * Check if this emitter has `event` handlers.
                 *
                 * @param {String} event
                 * @return {Boolean}
                 * @api public
                 */Emitter.prototype.hasListeners = function(event){return !!this.listeners(event).length;};},{}],39:[function(_dereq_,module,exports){arguments[4][17][0].apply(exports,arguments);},{"./debug":40,"dup":17}],40:[function(_dereq_,module,exports){arguments[4][18][0].apply(exports,arguments);},{"dup":18,"ms":44}],41:[function(_dereq_,module,exports){(function(global){ /*
                     * Module requirements.
                     */var isArray=_dereq_('isarray'); /**
                     * Module exports.
                     */module.exports = hasBinary; /**
                     * Checks for binary data.
                     *
                     * Right now only Buffer and ArrayBuffer are supported..
                     *
                     * @param {Object} anything
                     * @api public
                     */function hasBinary(data){function _hasBinary(obj){if(!obj)return false;if(global.Buffer && global.Buffer.isBuffer && global.Buffer.isBuffer(obj) || global.ArrayBuffer && obj instanceof ArrayBuffer || global.Blob && obj instanceof Blob || global.File && obj instanceof File){return true;}if(isArray(obj)){for(var i=0;i < obj.length;i++) {if(_hasBinary(obj[i])){return true;}}}else if(obj && 'object' == typeof obj){ // see: https://github.com/Automattic/has-binary/pull/4
if(obj.toJSON && 'function' == typeof obj.toJSON){obj = obj.toJSON();}for(var key in obj) {if(Object.prototype.hasOwnProperty.call(obj,key) && _hasBinary(obj[key])){return true;}}}return false;}return _hasBinary(data);}}).call(this,typeof self !== "undefined"?self:typeof window !== "undefined"?window:typeof global !== "undefined"?global:{});},{"isarray":43}],42:[function(_dereq_,module,exports){arguments[4][23][0].apply(exports,arguments);},{"dup":23}],43:[function(_dereq_,module,exports){arguments[4][24][0].apply(exports,arguments);},{"dup":24}],44:[function(_dereq_,module,exports){arguments[4][25][0].apply(exports,arguments);},{"dup":25}],45:[function(_dereq_,module,exports){arguments[4][28][0].apply(exports,arguments);},{"dup":28}],46:[function(_dereq_,module,exports){(function(global){ /*global Blob,File*/ /**
                     * Module requirements
                     */var isArray=_dereq_('isarray');var isBuf=_dereq_('./is-buffer'); /**
                     * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
                     * Anything with blobs or files should be fed through removeBlobs before coming
                     * here.
                     *
                     * @param {Object} packet - socket.io event packet
                     * @return {Object} with deconstructed packet and list of buffers
                     * @api public
                     */exports.deconstructPacket = function(packet){var buffers=[];var packetData=packet.data;function _deconstructPacket(data){if(!data)return data;if(isBuf(data)){var placeholder={_placeholder:true,num:buffers.length};buffers.push(data);return placeholder;}else if(isArray(data)){var newData=new Array(data.length);for(var i=0;i < data.length;i++) {newData[i] = _deconstructPacket(data[i]);}return newData;}else if('object' == typeof data && !(data instanceof Date)){var newData={};for(var key in data) {newData[key] = _deconstructPacket(data[key]);}return newData;}return data;}var pack=packet;pack.data = _deconstructPacket(packetData);pack.attachments = buffers.length; // number of binary 'attachments'
return {packet:pack,buffers:buffers};}; /**
                     * Reconstructs a binary packet from its placeholder packet and buffers
                     *
                     * @param {Object} packet - event packet with placeholders
                     * @param {Array} buffers - binary buffers to put in placeholder positions
                     * @return {Object} reconstructed packet
                     * @api public
                     */exports.reconstructPacket = function(packet,buffers){var curPlaceHolder=0;function _reconstructPacket(data){if(data && data._placeholder){var buf=buffers[data.num]; // appropriate buffer (should be natural order anyway)
return buf;}else if(isArray(data)){for(var i=0;i < data.length;i++) {data[i] = _reconstructPacket(data[i]);}return data;}else if(data && 'object' == typeof data){for(var key in data) {data[key] = _reconstructPacket(data[key]);}return data;}return data;}packet.data = _reconstructPacket(packet.data);packet.attachments = undefined; // no longer useful
return packet;}; /**
                     * Asynchronously removes Blobs or Files from data via
                     * FileReader's readAsArrayBuffer method. Used before encoding
                     * data as msgpack. Calls callback with the blobless data.
                     *
                     * @param {Object} data
                     * @param {Function} callback
                     * @api private
                     */exports.removeBlobs = function(data,callback){function _removeBlobs(obj,curKey,containingObject){if(!obj)return obj; // convert any blob
if(global.Blob && obj instanceof Blob || global.File && obj instanceof File){pendingBlobs++; // async filereader
var fileReader=new FileReader();fileReader.onload = function(){ // this.result == arraybuffer
if(containingObject){containingObject[curKey] = this.result;}else {bloblessData = this.result;} // if nothing pending its callback time
if(! --pendingBlobs){callback(bloblessData);}};fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
}else if(isArray(obj)){ // handle array
for(var i=0;i < obj.length;i++) {_removeBlobs(obj[i],i,obj);}}else if(obj && 'object' == typeof obj && !isBuf(obj)){ // and object
for(var key in obj) {_removeBlobs(obj[key],key,obj);}}}var pendingBlobs=0;var bloblessData=data;_removeBlobs(bloblessData);if(!pendingBlobs){callback(bloblessData);}};}).call(this,typeof self !== "undefined"?self:typeof window !== "undefined"?window:typeof global !== "undefined"?global:{});},{"./is-buffer":48,"isarray":43}],47:[function(_dereq_,module,exports){ /**
                 * Module dependencies.
                 */var debug=_dereq_('debug')('socket.io-parser');var json=_dereq_('json3');var isArray=_dereq_('isarray');var Emitter=_dereq_('component-emitter');var binary=_dereq_('./binary');var isBuf=_dereq_('./is-buffer'); /**
                 * Protocol version.
                 *
                 * @api public
                 */exports.protocol = 4; /**
                 * Packet types.
                 *
                 * @api public
                 */exports.types = ['CONNECT','DISCONNECT','EVENT','BINARY_EVENT','ACK','BINARY_ACK','ERROR']; /**
                 * Packet type `connect`.
                 *
                 * @api public
                 */exports.CONNECT = 0; /**
                 * Packet type `disconnect`.
                 *
                 * @api public
                 */exports.DISCONNECT = 1; /**
                 * Packet type `event`.
                 *
                 * @api public
                 */exports.EVENT = 2; /**
                 * Packet type `ack`.
                 *
                 * @api public
                 */exports.ACK = 3; /**
                 * Packet type `error`.
                 *
                 * @api public
                 */exports.ERROR = 4; /**
                 * Packet type 'binary event'
                 *
                 * @api public
                 */exports.BINARY_EVENT = 5; /**
                 * Packet type `binary ack`. For acks with binary arguments.
                 *
                 * @api public
                 */exports.BINARY_ACK = 6; /**
                 * Encoder constructor.
                 *
                 * @api public
                 */exports.Encoder = Encoder; /**
                 * Decoder constructor.
                 *
                 * @api public
                 */exports.Decoder = Decoder; /**
                 * A socket.io Encoder instance
                 *
                 * @api public
                 */function Encoder(){} /**
                 * Encode a packet as a single string if non-binary, or as a
                 * buffer sequence, depending on packet type.
                 *
                 * @param {Object} obj - packet object
                 * @param {Function} callback - function to handle encodings (likely engine.write)
                 * @return Calls callback with Array of encodings
                 * @api public
                 */Encoder.prototype.encode = function(obj,callback){debug('encoding packet %j',obj);if(exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type){encodeAsBinary(obj,callback);}else {var encoding=encodeAsString(obj);callback([encoding]);}}; /**
                 * Encode packet as string.
                 *
                 * @param {Object} packet
                 * @return {String} encoded
                 * @api private
                 */function encodeAsString(obj){var str='';var nsp=false; // first is type
str += obj.type; // attachments if we have them
if(exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type){str += obj.attachments;str += '-';} // if we have a namespace other than `/`
// we append it followed by a comma `,`
if(obj.nsp && '/' != obj.nsp){nsp = true;str += obj.nsp;} // immediately followed by the id
if(null != obj.id){if(nsp){str += ',';nsp = false;}str += obj.id;} // json data
if(null != obj.data){if(nsp)str += ',';str += json.stringify(obj.data);}debug('encoded %j as %s',obj,str);return str;} /**
                 * Encode packet as 'buffer sequence' by removing blobs, and
                 * deconstructing packet into object with placeholders and
                 * a list of buffers.
                 *
                 * @param {Object} packet
                 * @return {Buffer} encoded
                 * @api private
                 */function encodeAsBinary(obj,callback){function writeEncoding(bloblessData){var deconstruction=binary.deconstructPacket(bloblessData);var pack=encodeAsString(deconstruction.packet);var buffers=deconstruction.buffers;buffers.unshift(pack); // add packet info to beginning of data list
callback(buffers); // write all the buffers
}binary.removeBlobs(obj,writeEncoding);} /**
                 * A socket.io Decoder instance
                 *
                 * @return {Object} decoder
                 * @api public
                 */function Decoder(){this.reconstructor = null;} /**
                 * Mix in `Emitter` with Decoder.
                 */Emitter(Decoder.prototype); /**
                 * Decodes an ecoded packet string into packet JSON.
                 *
                 * @param {String} obj - encoded packet
                 * @return {Object} packet
                 * @api public
                 */Decoder.prototype.add = function(obj){var packet;if('string' == typeof obj){packet = decodeString(obj);if(exports.BINARY_EVENT == packet.type || exports.BINARY_ACK == packet.type){ // binary packet's json
this.reconstructor = new BinaryReconstructor(packet); // no attachments, labeled binary but no binary data to follow
if(this.reconstructor.reconPack.attachments === 0){this.emit('decoded',packet);}}else { // non-binary full packet
this.emit('decoded',packet);}}else if(isBuf(obj) || obj.base64){ // raw binary data
if(!this.reconstructor){throw new Error('got binary data when not reconstructing a packet');}else {packet = this.reconstructor.takeBinaryData(obj);if(packet){ // received final buffer
this.reconstructor = null;this.emit('decoded',packet);}}}else {throw new Error('Unknown type: ' + obj);}}; /**
                 * Decode a packet String (JSON data)
                 *
                 * @param {String} str
                 * @return {Object} packet
                 * @api private
                 */function decodeString(str){var p={};var i=0; // look up type
p.type = Number(str.charAt(0));if(null == exports.types[p.type])return error(); // look up attachments if type binary
if(exports.BINARY_EVENT == p.type || exports.BINARY_ACK == p.type){var buf='';while(str.charAt(++i) != '-') {buf += str.charAt(i);if(i == str.length)break;}if(buf != Number(buf) || str.charAt(i) != '-'){throw new Error('Illegal attachments');}p.attachments = Number(buf);} // look up namespace (if any)
if('/' == str.charAt(i + 1)){p.nsp = '';while(++i) {var c=str.charAt(i);if(',' == c)break;p.nsp += c;if(i == str.length)break;}}else {p.nsp = '/';} // look up id
var next=str.charAt(i + 1);if('' !== next && Number(next) == next){p.id = '';while(++i) {var c=str.charAt(i);if(null == c || Number(c) != c){--i;break;}p.id += str.charAt(i);if(i == str.length)break;}p.id = Number(p.id);} // look up json data
if(str.charAt(++i)){try{p.data = json.parse(str.substr(i));}catch(e) {return error();}}debug('decoded %s as %j',str,p);return p;} /**
                 * Deallocates a parser's resources
                 *
                 * @api public
                 */Decoder.prototype.destroy = function(){if(this.reconstructor){this.reconstructor.finishedReconstruction();}}; /**
                 * A manager of a binary event's 'buffer sequence'. Should
                 * be constructed whenever a packet of type BINARY_EVENT is
                 * decoded.
                 *
                 * @param {Object} packet
                 * @return {BinaryReconstructor} initialized reconstructor
                 * @api private
                 */function BinaryReconstructor(packet){this.reconPack = packet;this.buffers = [];} /**
                 * Method to be called when binary data received from connection
                 * after a BINARY_EVENT packet.
                 *
                 * @param {Buffer | ArrayBuffer} binData - the raw binary data received
                 * @return {null | Object} returns null if more binary data is expected or
                 *   a reconstructed packet object if all buffers have been received.
                 * @api private
                 */BinaryReconstructor.prototype.takeBinaryData = function(binData){this.buffers.push(binData);if(this.buffers.length == this.reconPack.attachments){ // done with buffer list
var packet=binary.reconstructPacket(this.reconPack,this.buffers);this.finishedReconstruction();return packet;}return null;}; /**
                 * Cleans up binary packet reconstruction variables.
                 *
                 * @api private
                 */BinaryReconstructor.prototype.finishedReconstruction = function(){this.reconPack = null;this.buffers = [];};function error(data){return {type:exports.ERROR,data:'parser error'};}},{"./binary":46,"./is-buffer":48,"component-emitter":49,"debug":39,"isarray":43,"json3":50}],48:[function(_dereq_,module,exports){(function(global){module.exports = isBuf; /**
                     * Returns true if obj is a buffer or an arraybuffer.
                     *
                     * @api private
                     */function isBuf(obj){return global.Buffer && global.Buffer.isBuffer(obj) || global.ArrayBuffer && obj instanceof ArrayBuffer;}}).call(this,typeof self !== "undefined"?self:typeof window !== "undefined"?window:typeof global !== "undefined"?global:{});},{}],49:[function(_dereq_,module,exports){arguments[4][15][0].apply(exports,arguments);},{"dup":15}],50:[function(_dereq_,module,exports){(function(global){ /*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */;(function(){ // Detect the `define` function exposed by asynchronous module loaders. The
// strict `define` check is necessary for compatibility with `r.js`.
var isLoader=typeof define === "function" && define.amd; // A set of types used to distinguish objects from primitives.
var objectTypes={"function":true,"object":true}; // Detect the `exports` object exposed by CommonJS implementations.
var freeExports=objectTypes[typeof exports] && exports && !exports.nodeType && exports; // Use the `global` object exposed by Node (including Browserify via
// `insert-module-globals`), Narwhal, and Ringo as the default context,
// and the `window` object in browsers. Rhino exports a `global` function
// instead.
var root=objectTypes[typeof window] && window || this,freeGlobal=freeExports && objectTypes[typeof module] && module && !module.nodeType && typeof global == "object" && global;if(freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal || freeGlobal["self"] === freeGlobal)){root = freeGlobal;} // Public: Initializes JSON 3 using the given `context` object, attaching the
// `stringify` and `parse` functions to the specified `exports` object.
function runInContext(context,exports){context || (context = root["Object"]());exports || (exports = root["Object"]()); // Native constructor aliases.
var Number=context["Number"] || root["Number"],String=context["String"] || root["String"],Object=context["Object"] || root["Object"],Date=context["Date"] || root["Date"],SyntaxError=context["SyntaxError"] || root["SyntaxError"],TypeError=context["TypeError"] || root["TypeError"],Math=context["Math"] || root["Math"],nativeJSON=context["JSON"] || root["JSON"]; // Delegate to the native `stringify` and `parse` implementations.
if(typeof nativeJSON == "object" && nativeJSON){exports.stringify = nativeJSON.stringify;exports.parse = nativeJSON.parse;} // Convenience aliases.
var objectProto=Object.prototype,getClass=objectProto.toString,isProperty,forEach,undef; // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
var isExtended=new Date(-3509827334573292);try{ // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
// results for certain dates in Opera >= 10.53.
isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&  // Safari < 2.0.2 stores the internal millisecond time value correctly,
// but clips the values returned by the date methods to the range of
// signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;}catch(exception) {} // Internal: Determines whether the native `JSON.stringify` and `parse`
// implementations are spec-compliant. Based on work by Ken Snyder.
function has(name){if(has[name] !== undef){ // Return cached feature test result.
return has[name];}var isSupported;if(name == "bug-string-char-index"){ // IE <= 7 doesn't support accessing string characters using square
// bracket notation. IE 8 only supports this for primitives.
isSupported = "a"[0] != "a";}else if(name == "json"){ // Indicates whether both `JSON.stringify` and `JSON.parse` are
// supported.
isSupported = has("json-stringify") && has("json-parse");}else {var value,serialized="{\"a\":[1,true,false,null,\"\\u0000\\b\\n\\f\\r\\t\"]}"; // Test `JSON.stringify`.
if(name == "json-stringify"){var stringify=exports.stringify,stringifySupported=typeof stringify == "function" && isExtended;if(stringifySupported){ // A test function object with a custom `toJSON` method.
(value = function(){return 1;}).toJSON = value;try{stringifySupported =  // Firefox 3.1b1 and b2 serialize string, number, and boolean
// primitives as object literals.
stringify(0) === "0" &&  // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
// literals.
stringify(new Number()) === "0" && stringify(new String()) == '""' &&  // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
// does not define a canonical JSON representation (this applies to
// objects with `toJSON` properties as well, *unless* they are nested
// within an object or array).
stringify(getClass) === undef &&  // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
// FF 3.1b3 pass this test.
stringify(undef) === undef &&  // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
// respectively, if the value is omitted entirely.
stringify() === undef &&  // FF 3.1b1, 2 throw an error if the given value is not a number,
// string, array, object, Boolean, or `null` literal. This applies to
// objects with custom `toJSON` methods as well, unless they are nested
// inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
// methods entirely.
stringify(value) === "1" && stringify([value]) == "[1]" &&  // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
// `"[null]"`.
stringify([undef]) == "[null]" &&  // YUI 3.0.0b1 fails to serialize `null` literals.
stringify(null) == "null" &&  // FF 3.1b1, 2 halts serialization if an array contains a function:
// `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
// elides non-JSON values from objects and arrays, unless they
// define custom `toJSON` methods.
stringify([undef,getClass,null]) == "[null,null,null]" &&  // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
// where character escape codes are expected (e.g., `\b` => `\u0008`).
stringify({"a":[value,true,false,null,"\x00\b\n\f\r\t"]}) == serialized &&  // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
stringify(null,value) === "1" && stringify([1,2],null,1) == "[\n 1,\n 2\n]" &&  // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
// serialize extended years.
stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&  // The milliseconds are optional in ES 5, but required in 5.1.
stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&  // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
// four-digit years instead of six-digit years. Credits: @Yaffle.
stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&  // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
// values less than 1000. Credits: @Yaffle.
stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';}catch(exception) {stringifySupported = false;}}isSupported = stringifySupported;} // Test `JSON.parse`.
if(name == "json-parse"){var parse=exports.parse;if(typeof parse == "function"){try{ // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
// Conforming implementations should also coerce the initial argument to
// a string prior to parsing.
if(parse("0") === 0 && !parse(false)){ // Simple parsing test.
value = parse(serialized);var parseSupported=value["a"].length == 5 && value["a"][0] === 1;if(parseSupported){try{ // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
parseSupported = !parse('"\t"');}catch(exception) {}if(parseSupported){try{ // FF 4.0 and 4.0.1 allow leading `+` signs and leading
// decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
// certain octal literals.
parseSupported = parse("01") !== 1;}catch(exception) {}}if(parseSupported){try{ // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
// points. These environments, along with FF 3.1b1 and 2,
// also allow trailing commas in JSON objects and arrays.
parseSupported = parse("1.") !== 1;}catch(exception) {}}}}}catch(exception) {parseSupported = false;}}isSupported = parseSupported;}}return has[name] = !!isSupported;}if(!has("json")){ // Common `[[Class]]` name aliases.
var functionClass="[object Function]",dateClass="[object Date]",numberClass="[object Number]",stringClass="[object String]",arrayClass="[object Array]",booleanClass="[object Boolean]"; // Detect incomplete support for accessing string characters by index.
var charIndexBuggy=has("bug-string-char-index"); // Define additional utility methods if the `Date` methods are buggy.
if(!isExtended){var floor=Math.floor; // A mapping between the months of the year and the number of days between
// January 1st and the first of the respective month.
var Months=[0,31,59,90,120,151,181,212,243,273,304,334]; // Internal: Calculates the number of days between the Unix epoch and the
// first day of the given month.
var getDay=function getDay(year,month){return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);};} // Internal: Determines if a property is a direct property of the given
// object. Delegates to the native `Object#hasOwnProperty` method.
if(!(isProperty = objectProto.hasOwnProperty)){isProperty = function(property){var members={},constructor;if((members.__proto__ = null,members.__proto__ = { // The *proto* property cannot be set multiple times in recent
// versions of Firefox and SeaMonkey.
"toString":1},members).toString != getClass){ // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
// supports the mutable *proto* property.
isProperty = function(property){ // Capture and break the object's prototype chain (see section 8.6.2
// of the ES 5.1 spec). The parenthesized expression prevents an
// unsafe transformation by the Closure Compiler.
var original=this.__proto__,result=(property in (this.__proto__ = null,this)); // Restore the original prototype chain.
this.__proto__ = original;return result;};}else { // Capture a reference to the top-level `Object` constructor.
constructor = members.constructor; // Use the `constructor` property to simulate `Object#hasOwnProperty` in
// other environments.
isProperty = function(property){var parent=(this.constructor || constructor).prototype;return property in this && !(property in parent && this[property] === parent[property]);};}members = null;return isProperty.call(this,property);};} // Internal: Normalizes the `for...in` iteration algorithm across
// environments. Each enumerated key is yielded to a `callback` function.
forEach = function(object,callback){var size=0,Properties,members,property; // Tests for bugs in the current environment's `for...in` algorithm. The
// `valueOf` property inherits the non-enumerable flag from
// `Object.prototype` in older versions of IE, Netscape, and Mozilla.
(Properties = function(){this.valueOf = 0;}).prototype.valueOf = 0; // Iterate over a new instance of the `Properties` class.
members = new Properties();for(property in members) { // Ignore all properties inherited from `Object.prototype`.
if(isProperty.call(members,property)){size++;}}Properties = members = null; // Normalize the iteration algorithm.
if(!size){ // A list of non-enumerable properties inherited from `Object.prototype`.
members = ["valueOf","toString","toLocaleString","propertyIsEnumerable","isPrototypeOf","hasOwnProperty","constructor"]; // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
// properties.
forEach = function(object,callback){var isFunction=getClass.call(object) == functionClass,property,length;var hasProperty=!isFunction && typeof object.constructor != "function" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;for(property in object) { // Gecko <= 1.0 enumerates the `prototype` property of functions under
// certain conditions; IE does not.
if(!(isFunction && property == "prototype") && hasProperty.call(object,property)){callback(property);}} // Manually invoke the callback for each non-enumerable property.
for(length = members.length;property = members[--length];hasProperty.call(object,property) && callback(property));};}else if(size == 2){ // Safari <= 2.0.4 enumerates shadowed properties twice.
forEach = function(object,callback){ // Create a set of iterated properties.
var members={},isFunction=getClass.call(object) == functionClass,property;for(property in object) { // Store each property name to prevent double enumeration. The
// `prototype` property of functions is not enumerated due to cross-
// environment inconsistencies.
if(!(isFunction && property == "prototype") && !isProperty.call(members,property) && (members[property] = 1) && isProperty.call(object,property)){callback(property);}}};}else { // No bugs detected; use the standard `for...in` algorithm.
forEach = function(object,callback){var isFunction=getClass.call(object) == functionClass,property,isConstructor;for(property in object) {if(!(isFunction && property == "prototype") && isProperty.call(object,property) && !(isConstructor = property === "constructor")){callback(property);}} // Manually invoke the callback for the `constructor` property due to
// cross-environment inconsistencies.
if(isConstructor || isProperty.call(object,property = "constructor")){callback(property);}};}return forEach(object,callback);}; // Public: Serializes a JavaScript `value` as a JSON string. The optional
// `filter` argument may specify either a function that alters how object and
// array members are serialized, or an array of strings and numbers that
// indicates which properties should be serialized. The optional `width`
// argument may be either a string or number that specifies the indentation
// level of the output.
if(!has("json-stringify")){ // Internal: A map of control characters and their escaped equivalents.
var Escapes={92:"\\\\",34:'\\"',8:"\\b",12:"\\f",10:"\\n",13:"\\r",9:"\\t"}; // Internal: Converts `value` into a zero-padded string such that its
// length is at least equal to `width`. The `width` must be <= 6.
var leadingZeroes="000000";var toPaddedString=function toPaddedString(width,value){ // The `|| 0` expression is necessary to work around a bug in
// Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
return (leadingZeroes + (value || 0)).slice(-width);}; // Internal: Double-quotes a string `value`, replacing all ASCII control
// characters (characters with code unit values between 0 and 31) with
// their escaped equivalents. This is an implementation of the
// `Quote(value)` operation defined in ES 5.1 section 15.12.3.
var unicodePrefix="\\u00";var quote=function quote(value){var result='"',index=0,length=value.length,useCharIndex=!charIndexBuggy || length > 10;var symbols=useCharIndex && (charIndexBuggy?value.split(""):value);for(;index < length;index++) {var charCode=value.charCodeAt(index); // If the character is a control character, append its Unicode or
// shorthand escape sequence; otherwise, append the character as-is.
switch(charCode){case 8:case 9:case 10:case 12:case 13:case 34:case 92:result += Escapes[charCode];break;default:if(charCode < 32){result += unicodePrefix + toPaddedString(2,charCode.toString(16));break;}result += useCharIndex?symbols[index]:value.charAt(index);}}return result + '"';}; // Internal: Recursively serializes an object. Implements the
// `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
var serialize=function serialize(property,object,callback,properties,whitespace,indentation,stack){var value,className,year,month,date,time,hours,minutes,seconds,milliseconds,results,element,index,length,prefix,result;try{ // Necessary for host object support.
value = object[property];}catch(exception) {}if(typeof value == "object" && value){className = getClass.call(value);if(className == dateClass && !isProperty.call(value,"toJSON")){if(value > -1 / 0 && value < 1 / 0){ // Dates are serialized according to the `Date#toJSON` method
// specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
// for the ISO 8601 date time string format.
if(getDay){ // Manually compute the year, month, date, hours, minutes,
// seconds, and milliseconds if the `getUTC*` methods are
// buggy. Adapted from @Yaffle's `date-shim` project.
date = floor(value / 864e5);for(year = floor(date / 365.2425) + 1970 - 1;getDay(year + 1,0) <= date;year++);for(month = floor((date - getDay(year,0)) / 30.42);getDay(year,month + 1) <= date;month++);date = 1 + date - getDay(year,month); // The `time` value specifies the time within the day (see ES
// 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
// to compute `A modulo B`, as the `%` operator does not
// correspond to the `modulo` operation for negative numbers.
time = (value % 864e5 + 864e5) % 864e5; // The hours, minutes, seconds, and milliseconds are obtained by
// decomposing the time within the day. See section 15.9.1.10.
hours = floor(time / 36e5) % 24;minutes = floor(time / 6e4) % 60;seconds = floor(time / 1e3) % 60;milliseconds = time % 1e3;}else {year = value.getUTCFullYear();month = value.getUTCMonth();date = value.getUTCDate();hours = value.getUTCHours();minutes = value.getUTCMinutes();seconds = value.getUTCSeconds();milliseconds = value.getUTCMilliseconds();} // Serialize extended years correctly.
value = (year <= 0 || year >= 1e4?(year < 0?"-":"+") + toPaddedString(6,year < 0?-year:year):toPaddedString(4,year)) + "-" + toPaddedString(2,month + 1) + "-" + toPaddedString(2,date) +  // Months, dates, hours, minutes, and seconds should have two
// digits; milliseconds should have three.
"T" + toPaddedString(2,hours) + ":" + toPaddedString(2,minutes) + ":" + toPaddedString(2,seconds) +  // Milliseconds are optional in ES 5.0, but required in 5.1.
"." + toPaddedString(3,milliseconds) + "Z";}else {value = null;}}else if(typeof value.toJSON == "function" && (className != numberClass && className != stringClass && className != arrayClass || isProperty.call(value,"toJSON"))){ // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
// `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
// ignores all `toJSON` methods on these objects unless they are
// defined directly on an instance.
value = value.toJSON(property);}}if(callback){ // If a replacement function was provided, call it to obtain the value
// for serialization.
value = callback.call(object,property,value);}if(value === null){return "null";}className = getClass.call(value);if(className == booleanClass){ // Booleans are represented literally.
return "" + value;}else if(className == numberClass){ // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
// `"null"`.
return value > -1 / 0 && value < 1 / 0?"" + value:"null";}else if(className == stringClass){ // Strings are double-quoted and escaped.
return quote("" + value);} // Recursively serialize objects and arrays.
if(typeof value == "object"){ // Check for cyclic structures. This is a linear search; performance
// is inversely proportional to the number of unique nested objects.
for(length = stack.length;length--;) {if(stack[length] === value){ // Cyclic structures cannot be serialized by `JSON.stringify`.
throw TypeError();}} // Add the object to the stack of traversed objects.
stack.push(value);results = []; // Save the current indentation level and indent one additional level.
prefix = indentation;indentation += whitespace;if(className == arrayClass){ // Recursively serialize array elements.
for(index = 0,length = value.length;index < length;index++) {element = serialize(index,value,callback,properties,whitespace,indentation,stack);results.push(element === undef?"null":element);}result = results.length?whitespace?"[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]":"[" + results.join(",") + "]":"[]";}else { // Recursively serialize object members. Members are selected from
// either a user-specified list of property names, or the object
// itself.
forEach(properties || value,function(property){var element=serialize(property,value,callback,properties,whitespace,indentation,stack);if(element !== undef){ // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
// is not the empty string, let `member` {quote(property) + ":"}
// be the concatenation of `member` and the `space` character."
// The "`space` character" refers to the literal space
// character, not the `space` {width} argument provided to
// `JSON.stringify`.
results.push(quote(property) + ":" + (whitespace?" ":"") + element);}});result = results.length?whitespace?"{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}":"{" + results.join(",") + "}":"{}";} // Remove the object from the traversed object stack.
stack.pop();return result;}}; // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
exports.stringify = function(source,filter,width){var whitespace,callback,properties,className;if(objectTypes[typeof filter] && filter){if((className = getClass.call(filter)) == functionClass){callback = filter;}else if(className == arrayClass){ // Convert the property names array into a makeshift set.
properties = {};for(var index=0,length=filter.length,value;index < length;value = filter[index++],(className = getClass.call(value),className == stringClass || className == numberClass) && (properties[value] = 1));}}if(width){if((className = getClass.call(width)) == numberClass){ // Convert the `width` to an integer and create a string containing
// `width` number of space characters.
if((width -= width % 1) > 0){for(whitespace = "",width > 10 && (width = 10);whitespace.length < width;whitespace += " ");}}else if(className == stringClass){whitespace = width.length <= 10?width:width.slice(0,10);}} // Opera <= 7.54u2 discards the values associated with empty string keys
// (`""`) only if they are used directly within an object member list
// (e.g., `!("" in { "": 1})`).
return serialize("",(value = {},value[""] = source,value),callback,properties,whitespace,"",[]);};} // Public: Parses a JSON source string.
if(!has("json-parse")){var fromCharCode=String.fromCharCode; // Internal: A map of escaped control characters and their unescaped
// equivalents.
var Unescapes={92:"\\",34:'"',47:"/",98:"\b",116:"\t",110:"\n",102:"\f",114:"\r"}; // Internal: Stores the parser state.
var Index,Source; // Internal: Resets the parser state and throws a `SyntaxError`.
var abort=function abort(){Index = Source = null;throw SyntaxError();}; // Internal: Returns the next token, or `"$"` if the parser has reached
// the end of the source string. A token may be a string, number, `null`
// literal, or Boolean literal.
var lex=function lex(){var source=Source,length=source.length,value,begin,position,isSigned,charCode;while(Index < length) {charCode = source.charCodeAt(Index);switch(charCode){case 9:case 10:case 13:case 32: // Skip whitespace tokens, including tabs, carriage returns, line
// feeds, and space characters.
Index++;break;case 123:case 125:case 91:case 93:case 58:case 44: // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
// the current position.
value = charIndexBuggy?source.charAt(Index):source[Index];Index++;return value;case 34: // `"` delimits a JSON string; advance to the next character and
// begin parsing the string. String tokens are prefixed with the
// sentinel `@` character to distinguish them from punctuators and
// end-of-string tokens.
for(value = "@",Index++;Index < length;) {charCode = source.charCodeAt(Index);if(charCode < 32){ // Unescaped ASCII control characters (those with a code unit
// less than the space character) are not permitted.
abort();}else if(charCode == 92){ // A reverse solidus (`\`) marks the beginning of an escaped
// control character (including `"`, `\`, and `/`) or Unicode
// escape sequence.
charCode = source.charCodeAt(++Index);switch(charCode){case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114: // Revive escaped control characters.
value += Unescapes[charCode];Index++;break;case 117: // `\u` marks the beginning of a Unicode escape sequence.
// Advance to the first character and validate the
// four-digit code point.
begin = ++Index;for(position = Index + 4;Index < position;Index++) {charCode = source.charCodeAt(Index); // A valid sequence comprises four hexdigits (case-
// insensitive) that form a single hexadecimal value.
if(!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)){ // Invalid Unicode escape sequence.
abort();}} // Revive the escaped character.
value += fromCharCode("0x" + source.slice(begin,Index));break;default: // Invalid escape sequence.
abort();}}else {if(charCode == 34){ // An unescaped double-quote character marks the end of the
// string.
break;}charCode = source.charCodeAt(Index);begin = Index; // Optimize for the common case where a string is valid.
while(charCode >= 32 && charCode != 92 && charCode != 34) {charCode = source.charCodeAt(++Index);} // Append the string as-is.
value += source.slice(begin,Index);}}if(source.charCodeAt(Index) == 34){ // Advance to the next character and return the revived string.
Index++;return value;} // Unterminated string.
abort();default: // Parse numbers and literals.
begin = Index; // Advance past the negative sign, if one is specified.
if(charCode == 45){isSigned = true;charCode = source.charCodeAt(++Index);} // Parse an integer or floating-point value.
if(charCode >= 48 && charCode <= 57){ // Leading zeroes are interpreted as octal literals.
if(charCode == 48 && (charCode = source.charCodeAt(Index + 1),charCode >= 48 && charCode <= 57)){ // Illegal octal literal.
abort();}isSigned = false; // Parse the integer component.
for(;Index < length && (charCode = source.charCodeAt(Index),charCode >= 48 && charCode <= 57);Index++); // Floats cannot contain a leading decimal point; however, this
// case is already accounted for by the parser.
if(source.charCodeAt(Index) == 46){position = ++Index; // Parse the decimal component.
for(;position < length && (charCode = source.charCodeAt(position),charCode >= 48 && charCode <= 57);position++);if(position == Index){ // Illegal trailing decimal.
abort();}Index = position;} // Parse exponents. The `e` denoting the exponent is
// case-insensitive.
charCode = source.charCodeAt(Index);if(charCode == 101 || charCode == 69){charCode = source.charCodeAt(++Index); // Skip past the sign following the exponent, if one is
// specified.
if(charCode == 43 || charCode == 45){Index++;} // Parse the exponential component.
for(position = Index;position < length && (charCode = source.charCodeAt(position),charCode >= 48 && charCode <= 57);position++);if(position == Index){ // Illegal empty exponent.
abort();}Index = position;} // Coerce the parsed value to a JavaScript number.
return +source.slice(begin,Index);} // A negative sign may only precede numbers.
if(isSigned){abort();} // `true`, `false`, and `null` literals.
if(source.slice(Index,Index + 4) == "true"){Index += 4;return true;}else if(source.slice(Index,Index + 5) == "false"){Index += 5;return false;}else if(source.slice(Index,Index + 4) == "null"){Index += 4;return null;} // Unrecognized token.
abort();}} // Return the sentinel `$` character if the parser has reached the end
// of the source string.
return "$";}; // Internal: Parses a JSON `value` token.
var get=function get(value){var results,hasMembers;if(value == "$"){ // Unexpected end of input.
abort();}if(typeof value == "string"){if((charIndexBuggy?value.charAt(0):value[0]) == "@"){ // Remove the sentinel `@` character.
return value.slice(1);} // Parse object and array literals.
if(value == "["){ // Parses a JSON array, returning a new JavaScript array.
results = [];for(;;hasMembers || (hasMembers = true)) {value = lex(); // A closing square bracket marks the end of the array literal.
if(value == "]"){break;} // If the array literal contains elements, the current token
// should be a comma separating the previous element from the
// next.
if(hasMembers){if(value == ","){value = lex();if(value == "]"){ // Unexpected trailing `,` in array literal.
abort();}}else { // A `,` must separate each array element.
abort();}} // Elisions and leading commas are not permitted.
if(value == ","){abort();}results.push(get(value));}return results;}else if(value == "{"){ // Parses a JSON object, returning a new JavaScript object.
results = {};for(;;hasMembers || (hasMembers = true)) {value = lex(); // A closing curly brace marks the end of the object literal.
if(value == "}"){break;} // If the object literal contains members, the current token
// should be a comma separator.
if(hasMembers){if(value == ","){value = lex();if(value == "}"){ // Unexpected trailing `,` in object literal.
abort();}}else { // A `,` must separate each object member.
abort();}} // Leading commas are not permitted, object property names must be
// double-quoted strings, and a `:` must separate each property
// name and value.
if(value == "," || typeof value != "string" || (charIndexBuggy?value.charAt(0):value[0]) != "@" || lex() != ":"){abort();}results[value.slice(1)] = get(lex());}return results;} // Unexpected token encountered.
abort();}return value;}; // Internal: Updates a traversed object member.
var update=function update(source,property,callback){var element=walk(source,property,callback);if(element === undef){delete source[property];}else {source[property] = element;}}; // Internal: Recursively traverses a parsed JSON object, invoking the
// `callback` function for each value. This is an implementation of the
// `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
var walk=function walk(source,property,callback){var value=source[property],length;if(typeof value == "object" && value){ // `forEach` can't be used to traverse an array in Opera <= 8.54
// because its `Object#hasOwnProperty` implementation returns `false`
// for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
if(getClass.call(value) == arrayClass){for(length = value.length;length--;) {update(value,length,callback);}}else {forEach(value,function(property){update(value,property,callback);});}}return callback.call(source,property,value);}; // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
exports.parse = function(source,callback){var result,value;Index = 0;Source = "" + source;result = get(lex()); // If a JSON string contains multiple tokens, it is invalid.
if(lex() != "$"){abort();} // Reset the parser state.
Index = Source = null;return callback && getClass.call(callback) == functionClass?walk((value = {},value[""] = result,value),"",callback):result;};}}exports["runInContext"] = runInContext;return exports;}if(freeExports && !isLoader){ // Export for CommonJS environments.
runInContext(root,freeExports);}else { // Export for web browsers and JavaScript engines.
var nativeJSON=root.JSON,previousJSON=root["JSON3"],isRestored=false;var JSON3=runInContext(root,root["JSON3"] = { // Public: Restores the original value of the global `JSON` object and
// returns a reference to the `JSON3` object.
"noConflict":function noConflict(){if(!isRestored){isRestored = true;root.JSON = nativeJSON;root["JSON3"] = previousJSON;nativeJSON = previousJSON = null;}return JSON3;}});root.JSON = {"parse":JSON3.parse,"stringify":JSON3.stringify};} // Export for asynchronous module loaders.
if(isLoader){define(function(){return JSON3;});}}).call(this);}).call(this,typeof self !== "undefined"?self:typeof window !== "undefined"?window:typeof global !== "undefined"?global:{});},{}],51:[function(_dereq_,module,exports){module.exports = toArray;function toArray(list,index){var array=[];index = index || 0;for(var i=index || 0;i < list.length;i++) {array[i - index] = list[i];}return array;}},{}]},{},[31])(31);});}

cc._RFpop();
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},["moveUtil","app","ground","menuOnPlayer","otherPlayer","form","NewScript","game","socket.io","player"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2dyYW0vQ29jb3NDcmVhdG9yL3Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL2dhbWUvaW1hZ2UvTmV3U2NyaXB0LmpzIiwiYXNzZXRzL2NvbW1vbi9hcHAuanMiLCJhc3NldHMvbG9naW4vc2NyaXB0L2Zvcm0uanMiLCJhc3NldHMvZ2FtZS9zY3JpcHQvZ2FtZS5qcyIsImFzc2V0cy9nYW1lL3NjcmlwdC9ncm91bmQuanMiLCJhc3NldHMvZ2FtZS9zY3JpcHQvbWVudU9uUGxheWVyLmpzIiwiYXNzZXRzL2dhbWUvc2NyaXB0L21vdmVVdGlsLmpzIiwiYXNzZXRzL2dhbWUvc2NyaXB0L290aGVyUGxheWVyLmpzIiwiYXNzZXRzL2dhbWUvc2NyaXB0L3BsYXllci5qcyIsImFzc2V0cy9jb21tb24vc29ja2V0LmlvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNjLl9SRnB1c2gobW9kdWxlLCAnZDBlNmRYRWdkRkdBNXdBdXlhclFTL0gnLCAnTmV3U2NyaXB0Jyk7XG4vLyBnYW1lXFxpbWFnZVxcTmV3U2NyaXB0LmpzXG5cblwidXNlIHN0cmljdFwiO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuXG4gICAgICAgIHRoaXMubm9kZS5vbihcInRvdWNoZW5kXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKFwieHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHhcIik7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJjYy5fUkZwdXNoKG1vZHVsZSwgJzI4MGMzcnNaSkpLblo5UnFiQUxWd3RLJywgJ2FwcCcpO1xuLy8gY29tbW9uXFxhcHAuanNcblxuJ3VzZSBzdHJpY3QnO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7fSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuXG4gICAgICAgIC8vIHRoaXMubGFiZWwuc3RyaW5nID0gdGhpcy50ZXh0O1xuICAgICAgICAvLyBjb25zb2xlLmluZm8odGhpcy5wbGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJ1c2VybmFtZVwiKSlcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgd2luZG93LmlvID0gU29ja2V0SU87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aW5kb3cuaW8gPSByZXF1aXJlKCdzb2NrZXQuaW8nKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0aGlzLmxhYmVsLnN0cmluZyA9IHdpbmRvdy5pbztcbiAgICAgICAgc29ja2V0ID0gaW8oJ2h0dHBzOi8vdGVzdG5vZGUtbmlnaHRmYXJtZXIuYzl1c2Vycy5pbycpO1xuXG4gICAgICAgIC8vIGNvbnNvbGUuaW5mbyhcIjJcIik7XG4gICAgICAgIC8vIC8vYmVnaW4tLS0tLS0tLS0tLS0tLS3nmbvlvZXlpITnkIYtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgICAgIC8vc29ja2V0LmVtaXQoXCJuZXcgbWVzc2FnZVwiLCBcImFhYWFhYWFhYWFhYWFhYWFhYWFhXCIpO1xuXG4gICAgICAgIHZhciB1c2VybmFtZSA9IFwi546p5a62XCIgKyBNYXRoLmZsb29yKGNjLnJhbmRvbTBUbzEoKSAqIDEwMCk7XG4gICAgICAgIHVzZXIgPSB7XG4gICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICAgICAgICBzZXg6IFwibWFuXCIsXG4gICAgICAgICAgICBwYXNzd29yZDogXCIxMjM0NTZcIixcbiAgICAgICAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgeDogMCxcbiAgICAgICAgICAgICAgICB5OiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGFyZ2V0OiB7XG4gICAgICAgICAgICAgICAgeDogLTEsXG4gICAgICAgICAgICAgICAgeTogLTFcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjYy5nYW1lLmFkZFBlcnNpc3RSb290Tm9kZSh0aGlzLm5vZGUpO1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ5aXpodWNlXCIpO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWVcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge31cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJjYy5fUkZwdXNoKG1vZHVsZSwgJzZmZmQ5UURrN1pFSTRFaEZDZW5tbEJNJywgJ2Zvcm0nKTtcbi8vIGxvZ2luXFxzY3JpcHRcXGZvcm0uanNcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG5cbiAgICBsb2dpbjogZnVuY3Rpb24gbG9naW4oKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcImdhbWVcIik7XG4gICAgfSxcblxuICAgIHJlZ2lzdGVyOiBmdW5jdGlvbiByZWdpc3RlcigpIHt9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiY2MuX1JGcHVzaChtb2R1bGUsICdkZDIyYUdUa3g1RWtyWk4xWmtsYThOLycsICdnYW1lJyk7XG4vLyBnYW1lXFxzY3JpcHRcXGdhbWUuanNcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgcGxheWdyb3VuZDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG5cbiAgICAgICAgcGxheWVyOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcbiAgICAgICAgb3RoZXJQbGF5ZXI6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXG4gICAgICAgIH0sXG5cbiAgICAgICAgdGV4dDogJ0hlbGxvLCBXb3JsZCEnLFxuICAgICAgICBfcGxheWVyTmFtZToge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICBfYWxsUGxheWVyOiBudWxsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuX2FsbFBsYXllciA9IHt9O1xuICAgICAgICAvL3ZhciBhcHAgPSBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLmdldENoaWxkQnlOYW1lKFwiYXBwXCIpO1xuICAgICAgICAvL2NvbnNvbGUuaW5mbyhhcHApO1xuICAgICAgICAvL3ZhciBhcHBqcyA9IGFwcC5nZXRDb21wb25lbnQoXCJhcHBcIik7XG4gICAgICAgIC8vY29uc29sZS5pbmZvKGFwcGpzKVxuICAgICAgICB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoXCJvdGhlclBsYXllclwiKS5pc1RydWUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcGxheWVyTmFtZSA9IHRoaXMucGxheWVyLmdldENoaWxkQnlOYW1lKFwidXNlcm5hbWVcIik7XG4gICAgICAgIHRoaXMuX3BsYXllck5hbWUuX2NvbXBvbmVudHNbMF0uc3RyaW5nID0gdXNlci51c2VybmFtZTtcblxuICAgICAgICB1c2VyLnBvc2l0aW9uID0geyB4OiB0aGlzLnBsYXllci54LCB5OiB0aGlzLnBsYXllci55IH07XG5cbiAgICAgICAgc29ja2V0Lm9uKFwiY29ubmVjdGVkXCIsIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhtc2cpO1xuICAgICAgICAgICAgaWYgKHVzZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHVzZXIucG9zaXRpb24ueCA9IHNlbGYucGxheWVyLng7XG4gICAgICAgICAgICAgICAgdXNlci5wb3NpdGlvbi55ID0gc2VsZi5wbGF5ZXIueTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmluZm8odXNlciwgXCLph43ov55cIik7XG4gICAgICAgICAgICAgICAgc29ja2V0LmVtaXQoXCJyZUxvZ2luXCIsIHVzZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmluZm8oXCLov57mjqXmiJDlip9cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNvY2tldC5vbihcImxvZ2luUmVzdWx0XCIsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBpZiAoZGF0YS5yZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBzZWxmLl9wbGF5ZXJOYW1lLl9jb21wb25lbnRzWzBdLnN0cmluZyA9IHVzZXIudXNlcm5hbWU7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEudXNlcnMgJiYgZGF0YS51c2Vyc1t1c2VyLnVzZXJuYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgZGF0YS51c2Vyc1t1c2VyLnVzZXJuYW1lXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgdGVtcFBsYXllck5hbWUgaW4gZGF0YS51c2Vycykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgb25lUGxheWVyID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcFBsYXllciA9IGRhdGEudXNlcnNbdGVtcFBsYXllck5hbWVdO1xuICAgICAgICAgICAgICAgICAgICBvbmVQbGF5ZXIgPSBzZWxmLl9hbGxQbGF5ZXJbdGVtcFBsYXllck5hbWVdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW9uZVBsYXllcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25lUGxheWVyID0gY2MuaW5zdGFudGlhdGUoc2VsZi5vdGhlclBsYXllcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgb25lUGxheWVyLnNldFBvc2l0aW9uKGNjLnAodGVtcFBsYXllci5wb3NpdGlvbi54LCB0ZW1wUGxheWVyLnBvc2l0aW9uLnkpKTtcbiAgICAgICAgICAgICAgICAgICAgb25lUGxheWVyLmdldENoaWxkQnlOYW1lKFwidXNlcm5hbWVcIikuX2NvbXBvbmVudHNbMF0uc3RyaW5nID0gdGVtcFBsYXllci51c2VybmFtZTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wbGF5Z3JvdW5kLmFkZENoaWxkKG9uZVBsYXllcik7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2FsbFBsYXllclt0ZW1wUGxheWVyTmFtZV0gPSBvbmVQbGF5ZXI7XG4gICAgICAgICAgICAgICAgICAgIG9uZVBsYXllci5pbmZvID0gdGVtcFBsYXllcjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKC0xICE9IHRlbXBQbGF5ZXIudGFyZ2V0LnggfHwgLTEgIT0gdGVtcFBsYXllci50YXJnZXQueSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBsYXllclRvTW92ZSA9IG9uZVBsYXllci5nZXRDb21wb25lbnQoXCJvdGhlclBsYXllclwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllclRvTW92ZS50b01vdmUodGVtcFBsYXllci50YXJnZXQueCwgdGVtcFBsYXllci50YXJnZXQueSwgc2VsZi5wbGF5Z3JvdW5kLmdldENvbXBvbmVudChcImdyb3VuZFwiKS5taWR1KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoZGF0YS5tc2cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBzb2NrZXQub24oXCJ1c2VyTGVmdFwiLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKFwiPHA+XCIgKyBkYXRhLnVzZXJuYW1lICsgXCIg56a75byAPC9wPlwiKTtcbiAgICAgICAgICAgIHZhciBvbmVQbGF5ZXIgPSBzZWxmLl9hbGxQbGF5ZXJbZGF0YS51c2VybmFtZV07XG4gICAgICAgICAgICBpZiAob25lUGxheWVyKSB7XG4gICAgICAgICAgICAgICAgLy9vbmVQbGF5ZXIucmVtb3ZlRnJvbVBhcmVudCgpXG4gICAgICAgICAgICAgICAgb25lUGxheWVyLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlbGV0ZSBzZWxmLl9hbGxQbGF5ZXJbZGF0YS51c2VybmFtZV07XG4gICAgICAgIH0pO1xuICAgICAgICBzb2NrZXQub24oXCJ1c2VySm9pblwiLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKGRhdGEsIFwiIOWKoOWFpVwiKTtcbiAgICAgICAgICAgIHZhciBvbmVQbGF5ZXIgPSBzZWxmLl9hbGxQbGF5ZXJbZGF0YS51c2VybmFtZV07XG4gICAgICAgICAgICBpZiAoIW9uZVBsYXllcikge1xuICAgICAgICAgICAgICAgIG9uZVBsYXllciA9IGNjLmluc3RhbnRpYXRlKHNlbGYub3RoZXJQbGF5ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb25lUGxheWVyLnNldFBvc2l0aW9uKGNjLnAoZGF0YS5wb3NpdGlvbi54LCBkYXRhLnBvc2l0aW9uLnkpKTtcbiAgICAgICAgICAgIG9uZVBsYXllci5nZXRDaGlsZEJ5TmFtZShcInVzZXJuYW1lXCIpLl9jb21wb25lbnRzWzBdLnN0cmluZyA9IGRhdGEudXNlcm5hbWU7XG4gICAgICAgICAgICBzZWxmLnBsYXlncm91bmQuYWRkQ2hpbGQob25lUGxheWVyKTtcbiAgICAgICAgICAgIHNlbGYuX2FsbFBsYXllcltkYXRhLnVzZXJuYW1lXSA9IG9uZVBsYXllcjtcbiAgICAgICAgICAgIG9uZVBsYXllci5pbmZvID0gZGF0YTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc29ja2V0LmVtaXQoXCJsb2dpblwiLCB1c2VyKTtcblxuICAgICAgICBzb2NrZXQub24oXCJvbk90aGVyc01vdmVcIiwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhcIuenu+WKqFwiLCBkYXRhKTtcbiAgICAgICAgICAgIHZhciBwbGF5ZXJUb01vdmUgPSBzZWxmLl9hbGxQbGF5ZXJbZGF0YS51c2VybmFtZV0uZ2V0Q29tcG9uZW50KFwib3RoZXJQbGF5ZXJcIik7XG4gICAgICAgICAgICBwbGF5ZXJUb01vdmUudG9Nb3ZlKGRhdGEudGFyZ2V0LngsIGRhdGEudGFyZ2V0LnksIHNlbGYucGxheWdyb3VuZC5nZXRDb21wb25lbnQoXCJncm91bmRcIikubWlkdSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNlbGYubm9kZS5vbigndG9Nb3ZlJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB1c2VyLnRhcmdldCA9IGV2ZW50LnRhcmdldFBvaW50O1xuICAgICAgICAgICAgdXNlci5wb3NpdGlvbiA9IGV2ZW50LmxvY1Bvc2l0aW9uO1xuICAgICAgICAgICAgLy8gY29uc29sZS5pbmZvKFwieHh4eFwiLHVzZXIpXG4gICAgICAgICAgICBzb2NrZXQuZW1pdChcInRvTW92ZVwiLCB1c2VyKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJjYy5fUkZwdXNoKG1vZHVsZSwgJzRkNjEySjBmNlZJYXJxSEEwdmx3cVlxJywgJ2dyb3VuZCcpO1xuLy8gZ2FtZVxcc2NyaXB0XFxncm91bmQuanNcblxuJ3VzZSBzdHJpY3QnO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBjYW52YXM6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkNhbnZhc1xuICAgICAgICB9LFxuICAgICAgICBwbGF5ZXI6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcbiAgICAgICAgcGxheWVyTW92ZVN0ZXBzOiBbXSxcbiAgICAgICAgc3BlZWQ6IDEwLFxuICAgICAgICBtaWR1OiA1MFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMubWFwTWF4WCA9IC10aGlzLmNhbnZhcy5ub2RlLndpZHRoIC8gMjtcbiAgICAgICAgdGhpcy5tYXBNYXhZID0gLXRoaXMuY2FudmFzLm5vZGUuaGVpZ2h0IC8gMjtcbiAgICAgICAgdGhpcy5tYXBNaW5YID0gLXRoaXMubm9kZS53aWR0aCArIHRoaXMuY2FudmFzLm5vZGUud2lkdGggLyAyO1xuICAgICAgICB0aGlzLm1hcE1pblkgPSAtdGhpcy5ub2RlLmhlaWdodCArIHRoaXMuY2FudmFzLm5vZGUuaGVpZ2h0IC8gMjtcblxuICAgICAgICB2YXIgcGxheWVyT25TY3JlZW5YID0gdGhpcy5wbGF5ZXIueCArIHRoaXMubm9kZS54O1xuICAgICAgICB2YXIgcGxheWVyT25TY3JlZW5ZID0gdGhpcy5wbGF5ZXIueSArIHRoaXMubm9kZS55O1xuICAgICAgICB0aGlzLm5vZGUueCA9IHRoaXMubm9kZS54IC0gcGxheWVyT25TY3JlZW5YO1xuICAgICAgICB0aGlzLm5vZGUueSA9IHRoaXMubm9kZS55IC0gcGxheWVyT25TY3JlZW5ZO1xuXG4gICAgICAgIC8vIHZhciBteVV0aWwgPSBzZWxmLmdldENvbXBvbmVudCgnbXlVdGlsJyk7ICAvL+i/measoeaIkeS7rOS4jeeUqHJlcXVpcmUg5oiR5Lus55So57uE5Lu255qE5pa55byPXG4gICAgICAgIC8v5oiR5Lus5bCGbXlVdGlsLmpz5omU5Yiw5bGC57qn566h55CG5Zmo55qEYmFja2dyb3VuZOeahOWxnuaAp+ajgOafpeWZqOS4rVxuXG4gICAgICAgIHZhciBvbkNsaWNrID0gZnVuY3Rpb24gb25DbGljayhldmVudCkge1xuICAgICAgICAgICAgdmFyIHRvdWNoID0gZXZlbnQudG91Y2g7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmluZm8odG91Y2gpXG4gICAgICAgICAgICB2YXIgbXlldmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnbXlDbGljaycsIHRydWUpOyAvL+i/meS4quaYr+S4i+S4gOmDqOWIhueahOWGheWuuVxuICAgICAgICAgICAgbXlldmVudC5zZXRVc2VyRGF0YSh0b3VjaCk7XG5cbiAgICAgICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15ZXZlbnQpO1xuICAgICAgICAgICAgdmFyIG1hcEFic1ggPSBzZWxmLm5vZGUueCArIHNlbGYuY2FudmFzLm5vZGUud2lkdGggLyAyOyAvL+WcsOWbvueahOS4lueVjOWdkOagh1xuICAgICAgICAgICAgdmFyIG1hcEFic1kgPSBzZWxmLm5vZGUueSArIHNlbGYuY2FudmFzLm5vZGUuaGVpZ2h0IC8gMjtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUuaW5mbyhhYnNYKVxuICAgICAgICAgICAgLy90aGlzLnBsYXllci5zdHJpbmc9dG91Y2g7XG4gICAgICAgICAgICAvL2NvbnNvbGUuaW5mbyhldmVudCk7XG4gICAgICAgICAgICB2YXIgZXZlbnRPbk1hcFggPSB0b3VjaC5nZXRMb2NhdGlvblgoKSAtIG1hcEFic1g7XG4gICAgICAgICAgICB2YXIgZXZlbnRPbk1hcFkgPSB0b3VjaC5nZXRMb2NhdGlvblkoKSAtIG1hcEFic1k7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmluZm8oZXZlbnRPbk1hcFgsIGV2ZW50T25NYXBZKSAvL+eCueWHu+eahOWcsOWbvuWdkOagh1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5zdG9wQWxsQWN0aW9ucygpO1xuICAgICAgICAgICAgdGhpcy50b01vdmUoZXZlbnRPbk1hcFgsIGV2ZW50T25NYXBZKTsgLy/nhLblkI7np7vliqjlsLHooYzkuoZcbiAgICAgICAgICAgIHZhciBtb3ZlRXZlbnQgPSBuZXcgY2MuRXZlbnQoJ3RvTW92ZScsIHRydWUpO1xuICAgICAgICAgICAgbW92ZUV2ZW50LnRhcmdldFBvaW50ID0geyB4OiBldmVudE9uTWFwWCwgeTogZXZlbnRPbk1hcFkgfTtcbiAgICAgICAgICAgIG1vdmVFdmVudC5sb2NQb3NpdGlvbiA9IHsgeDogc2VsZi5wbGF5ZXIueCwgeTogc2VsZi5wbGF5ZXIueSB9O1xuICAgICAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobW92ZUV2ZW50KTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gdGhpcy5ub2RlLm9uKCdtb3VzZXVwJywgb25DbGljaywgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vbigndG91Y2hlbmQnLCBvbkNsaWNrLCB0aGlzKTtcbiAgICAgICAgLy9jYy5kaXJlY3Rvci5nZXRTY2hlZHVsZXIoKS5zY2hlZHVsZSh0aGlzLm1vdmVNYXAsIHRoaXMsIDAuNSwgZmFsc2UpO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG4gICAgLy90aGlzLm1vdmVNYXAoKTtcbiAgICAvL30sXG5cbiAgICAvL21vdmVNYXA6ZnVuY3Rpb24oKXtcbiAgICAvLyAgICB0aGlzLm5vZGUuc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAvL1xuICAgIC8vICAgIHZhciBwbGF5ZXJPblNjcmVlblggPSB0aGlzLnBsYXllci5ub2RlLnggKyB0aGlzLm5vZGUueDtcbiAgICAvLyAgICB2YXIgcGxheWVyT25TY3JlZW5ZID0gdGhpcy5wbGF5ZXIubm9kZS55ICsgdGhpcy5ub2RlLnk7XG4gICAgLy8gICAgdmFyIHNjcmVlbkRlc3RYID0gTWF0aC5taW4odGhpcy5tYXBNYXhYLCBNYXRoLm1heCh0aGlzLm1hcE1pblgsIHRoaXMubm9kZS54IC0gcGxheWVyT25TY3JlZW5YKSk7XG4gICAgLy8gICAgdmFyIHNjcmVlbkRlc3RZID0gTWF0aC5taW4odGhpcy5tYXBNYXhZLCBNYXRoLm1heCh0aGlzLm1hcE1pblksIHRoaXMubm9kZS55IC0gcGxheWVyT25TY3JlZW5ZKSk7XG4gICAgLy8gICAgLy92YXIgc2NyZWVuTW92ZURpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KHRoaXMubm9kZS54IC0gc2NyZWVuRGVzdFgsIDIpICsgTWF0aC5wb3codGhpcy5ub2RlLnkgLSBzY3JlZW5EZXN0WSwgMikpO1xuICAgIC8vICAgIC8vdmFyIHNjcmVlbk1vdmVUaW1lID0gc2NyZWVuTW92ZURpc3RhbmNlIC8gMTAwIC8gdGhpcy5zcGVlZDtcbiAgICAvLyAgICB0aGlzLm5vZGUucnVuQWN0aW9uKFxuICAgIC8vICAgICAgICBjYy5zZXF1ZW5jZShcbiAgICAvLyAgICAgICAgICAgIGNjLm1vdmVUbyhcbiAgICAvLyAgICAgICAgICAgICAgICAwLjUsXG4gICAgLy8gICAgICAgICAgICAgICAgc2NyZWVuRGVzdFgsXG4gICAgLy8gICAgICAgICAgICAgICAgc2NyZWVuRGVzdFlcbiAgICAvLyAgICAgICAgICAgIClcbiAgICAvLyAgICAgICAgKSk7XG4gICAgLy99LFxuXG4gICAgdG9Nb3ZlOiBmdW5jdGlvbiB0b01vdmUoeCwgeSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBtb3ZlVXRpbCA9IHRoaXMuZ2V0Q29tcG9uZW50KCdtb3ZlVXRpbCcpO1xuICAgICAgICB2YXIgcGxheWVyWCA9IE1hdGgucm91bmQodGhpcy5wbGF5ZXIueCAvIHNlbGYubWlkdSk7XG4gICAgICAgIHZhciBwbGF5ZXJZID0gTWF0aC5yb3VuZCh0aGlzLnBsYXllci55IC8gc2VsZi5taWR1KTtcbiAgICAgICAgdmFyIGRlc2NYID0gTWF0aC5yb3VuZCh4IC8gc2VsZi5taWR1KTtcbiAgICAgICAgdmFyIGRlc2NZID0gTWF0aC5yb3VuZCh5IC8gc2VsZi5taWR1KTtcbiAgICAgICAgaWYgKHBsYXllclggPT0gZGVzY1ggJiYgcGxheWVyWSA9PSBkZXNjWSkgcmV0dXJuO1xuICAgICAgICB2YXIgcGF0aCA9IG1vdmVVdGlsLmZpbmRfcGF0aChbcGxheWVyWCwgcGxheWVyWV0sIFtkZXNjWCwgZGVzY1ldKTtcbiAgICAgICAgdmFyIHN0ZXBzID0gcGF0aC5tYXAoZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHg6IG5vZGVbMF0gKiBzZWxmLm1pZHUsIHk6IG5vZGVbMV0gKiBzZWxmLm1pZHUgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vdGhpcy5wbGF5ZXJNb3ZlU3RlcHMgPSBbe3g6eCx5Onl9XTtcbiAgICAgICAgdGhpcy5wbGF5ZXJNb3ZlU3RlcHMgPSBzdGVwcztcbiAgICAgICAgdGhpcy5tb3ZlQnlTdGVwKCk7XG4gICAgfSxcblxuICAgIG1vdmVCeVN0ZXA6IGZ1bmN0aW9uIG1vdmVCeVN0ZXAoc3RlcHMpIHtcbiAgICAgICAgdmFyIHN0ZXAgPSB0aGlzLnBsYXllck1vdmVTdGVwcy5zaGlmdCgpO1xuICAgICAgICBpZiAoc3RlcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB1c2VyLnBvc2l0aW9uID0geyB4OiB0aGlzLnBsYXllci54LCB5OiB0aGlzLnBsYXllci55IH07XG4gICAgICAgICAgICB1c2VyLnRhcmdldCA9IHsgeDogLTEsIHk6IC0xIH07XG4gICAgICAgICAgICBzb2NrZXQuZW1pdChcInBsYXllclN0YW5kXCIsIHVzZXIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyh0aGlzLnBsYXllci54IC0gc3RlcC54LCAyKSArIE1hdGgucG93KHRoaXMucGxheWVyLnkgLSBzdGVwLnksIDIpKTtcbiAgICAgICAgdmFyIG1vdmVUaW1lID0gZGlzdGFuY2UgLyAxMDAgLyB0aGlzLnNwZWVkO1xuICAgICAgICB0aGlzLnBsYXllci5ydW5BY3Rpb24oIC8v5byA5aeL56e75Yqo5ZCnIFxuICAgICAgICBjYy5zZXF1ZW5jZShjYy5tb3ZlVG8obW92ZVRpbWUsIHN0ZXAueCwgc3RlcC55KSwgY2MuY2FsbEZ1bmModGhpcy5tb3ZlQnlTdGVwLCB0aGlzKSkpO1xuXG4gICAgICAgIHZhciBzY3JlZW5EZXN0WCA9IE1hdGgubWluKHRoaXMubWFwTWF4WCwgTWF0aC5tYXgodGhpcy5tYXBNaW5YLCAtc3RlcC54KSk7XG4gICAgICAgIHZhciBzY3JlZW5EZXN0WSA9IE1hdGgubWluKHRoaXMubWFwTWF4WSwgTWF0aC5tYXgodGhpcy5tYXBNaW5ZLCAtc3RlcC55KSk7XG4gICAgICAgIC8vdmFyIHNjcmVlbk1vdmVEaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyh0aGlzLm5vZGUueCAtIHNjcmVlbkRlc3RYLCAyKSArIE1hdGgucG93KHRoaXMubm9kZS55IC0gc2NyZWVuRGVzdFksIDIpKTtcbiAgICAgICAgLy92YXIgc2NyZWVuTW92ZVRpbWUgPSBzY3JlZW5Nb3ZlRGlzdGFuY2UgLyAxMDAgLyB0aGlzLnNwZWVkO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKGNjLnNlcXVlbmNlKGNjLm1vdmVUbyhtb3ZlVGltZSwgc2NyZWVuRGVzdFgsIHNjcmVlbkRlc3RZKSkpO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJjYy5fUkZwdXNoKG1vZHVsZSwgJzM0OTViTUVhOXRMSTQyRHhkOGJqRklPJywgJ21lbnVPblBsYXllcicpO1xuLy8gZ2FtZVxcc2NyaXB0XFxtZW51T25QbGF5ZXIuanNcblxuJ3VzZSBzdHJpY3QnO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBwbGF5ZXI6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5ub2RlLm9uKCd0b3VjaGVuZCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxuXG4gICAgbWFrZUZyaWVuZDogZnVuY3Rpb24gbWFrZUZyaWVuZCgpIHtcbiAgICAgICAgLy8gZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGNvbnNvbGUuaW5mbyh0aGlzLnBsYXllci5pbmZvKTtcbiAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgIH0sXG4gICAgcGs6IGZ1bmN0aW9uIHBrKCkge1xuICAgICAgICB0aGlzLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgfSxcbiAgICBoZWhlOiBmdW5jdGlvbiBoZWhlKCkge1xuICAgICAgICB0aGlzLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsImNjLl9SRnB1c2gobW9kdWxlLCAnMTcyMDhJaEdUWlBJcHRTNmk3WEZRVXUnLCAnbW92ZVV0aWwnKTtcbi8vIGdhbWVcXHNjcmlwdFxcbW92ZVV0aWwuanNcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG5cbiAgICBmaW5kX3BhdGg6IGZ1bmN0aW9uIGZpbmRfcGF0aChzdGFydCwgZW5kLCBtYXAsIG1hcmtlcikge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBvcGVuID0gW107XG4gICAgICAgIHZhciBjbG9zZSA9IFtdO1xuXG4gICAgICAgIHZhciBzdGFydE5vZGUgPSBzdGFydDtcbiAgICAgICAgdmFyIGVuZE5vZGUgPSBlbmQ7XG4gICAgICAgIC8vdmFyIG1hcF9hcnIgPSBtYXA7XG4gICAgICAgIC8vdmFyIHRyYV9tYXJrZXIgPSBtYXJrZXI7XG5cbiAgICAgICAgdmFyIEcgPSAwO1xuICAgICAgICB2YXIgSCA9IDA7XG4gICAgICAgIHZhciBGID0gMDtcblxuICAgICAgICAvL+WKoOWFpei1t+Wni+iKgueCuSAgW3gsIHkgLCBHICxGICxmYXRoZXJdXG4gICAgICAgIG9wZW4ucHVzaChbc3RhcnROb2RlWzBdLCBzdGFydE5vZGVbMV0sIDAsIE1hdGguYWJzKGVuZE5vZGVbMF0gLSBzdGFydE5vZGVbMF0pICsgTWF0aC5hYnMoZW5kTm9kZVsxXSAtIHN0YXJ0Tm9kZVsxXSksIG51bGxdKTtcblxuICAgICAgICByZXR1cm4gKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAvL+mHjeaLje+8jOWPluacgOWwj+eahOS4gOS4qlxuICAgICAgICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAgICAgICAgIHZhciBub2RlWCA9IG5vZGVbMF07XG4gICAgICAgICAgICB2YXIgbm9kZVkgPSBub2RlWzFdO1xuICAgICAgICAgICAgdmFyIG5vZGVHID0gbm9kZVsyXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBub2RlWCAtIDEsIGlsZW4gPSBpICsgMzsgaSA8IGlsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSBub2RlWSAtIDEsIGpsZW4gPSBqICsgMzsgaiA8IGpsZW47IGorKykge1xuICAgICAgICAgICAgICAgICAgICAvL+mBjeWOhuWRqOWbtOWFq+iKgueCuSzmjpLpmaToh6rlt7FcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT0gbm9kZVggJiYgaiA9PSBub2RlWSkgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIC8v5o6S6Zmk5pac552A6LWw55qE5oOF5Ya1XG4gICAgICAgICAgICAgICAgICAgIC8vaWYoISgoaSA9PSBvYmpbMF0gKSB8fCAoIGogPT0gb2JqWzFdKSkgJiYgKCBtYXBfYXJyW2ldICYmIG1hcF9hcnJbb2JqWzBdXSAmJiBtYXBfYXJyW2ldW29ialsxXV0gIT0gdHJhX21hcmtlciAmJiBtYXBfYXJyW29ialswXV1bal0gIT0gdHJhX21hcmtlcikpXG4gICAgICAgICAgICAgICAgICAgIC8vaWYgKCEoaSA9PSBub2RlWCB8fCBqID09IG5vZGVZKSlcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpID09IGVuZE5vZGVbMF0gJiYgaiA9PSBlbmROb2RlWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZW5kUG9pbnQgPSBbaSwgaiwgRywgRiwgbm9kZV07XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuLnB1c2goZW5kUG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHdheXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbGUgPSBlbmRQb2ludDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3YXlzLnVuc2hpZnQoZWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGUgPSBlbGVbNF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IHdoaWxlIChlbGVbNF0gIT0gbnVsbCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZvcih2YXIgaT0wOyBpPHdheXMubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgZm9yKHZhciBqPWkrMTsgaisxPHdheXMubGVuZ3RoO2orKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGlmKHdheXNbaV1bMF09PXdheXNbal1bMF0gJiYgd2F5c1tqXVswXT09d2F5c1tqKzFdWzBdIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB3YXlzW2ldWzFdPT13YXlzW2pdWzFdICYmIHdheXNbal1bMV09PXdheXNbaisxXVsxXSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgTWF0aC5hYnMod2F5c1tpXVswXS13YXlzW2pdWzBdKT09TWF0aC5hYnMod2F5c1tpXVsxXS13YXlzW2pdWzFdKSAmJiBNYXRoLmFicyh3YXlzW2pdWzBdLXdheXNbaisxXVswXSk9PU1hdGguYWJzKHdheXNbal1bMV0td2F5c1tqKzFdWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICApe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgd2F5cy5zcGxpY2UoaSsxLDEpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBqLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB3YXlzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vbWFwX2FycltpXSAmJiBtYXBfYXJyW2ldW2pdICYmIG1hcF9hcnJbaV1bal0gPT0gdHJhX21hcmtlciAmJlxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5pc19leGlzdChvcGVuLCBbaSwgal0pID09PSAtMSAmJiBzZWxmLmlzX2V4aXN0KGNsb3NlLCBbaSwgal0pID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgRyA9IGkgPT0gbm9kZVggfHwgaiA9PSBub2RlWSA/IG5vZGVHICsgMS4wIDogbm9kZUcgKyAxLjQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGlzdFggPSBlbmROb2RlWzBdIC0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkaXN0WSA9IGVuZE5vZGVbMV0gLSBqO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9IID0gTWF0aC5zcXJ0KGRpc3RYICogZGlzdFggKyBkaXN0WSAqIGRpc3RZKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIEggPSBNYXRoLmFicyhkaXN0WCkgKyBNYXRoLmFicyhkaXN0WSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBGID0gRyArIEg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdmFyIHRkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaStcIi1cIitqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdGQuaW5uZXJIVE1MID0gXCJHOlwiICsgRy50b0ZpeGVkKDIpICsgXCJcXG5IOlwiICsgSC50b0ZpeGVkKDIpICsgXCJcXG5GOlwiICsgRi50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3Blbi5wdXNoKFtpLCBqLCBHLCBGLCBub2RlXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2xvc2UucHVzaChvcGVuLnNoaWZ0KCkpO1xuICAgICAgICAgICAgdmFyIG87XG4gICAgICAgICAgICBpZiAob3BlblswXSAmJiBvcGVuWzBdWzRdID09IG5vZGVbNF0pIHtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUuaW5mbyhvcGVuKVxuICAgICAgICAgICAgICAgIG8gPSBjb3VudCA9PSAwID8gZ2V0X2Jyb3RoZXIob3Blbiwgbm9kZSkgOiAoc2VsZi5hcnJfc29ydChvcGVuKSwgb3BlblswXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5pbmZvKG9wZW4pXG4gICAgICAgICAgICAgICAgbyA9IChzZWxmLmFycl9zb3J0KG9wZW4pLCBvcGVuWzBdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJndW1lbnRzLmNhbGxlZShvKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KShvcGVuWzBdKTtcbiAgICB9LFxuXG4gICAgZ2V0X2Jyb3RoZXI6IGZ1bmN0aW9uIGdldF9icm90aGVyKGFyciwgbykge1xuICAgICAgICB2YXIgYSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKG8gJiYgYXJyW2ldWzRdID09IG9bNF0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChvWzRdKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJndW1lbnRzLmNhbGxlZShvWzRdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGFycl9zb3J0OiAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBzKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBhWzNdIC0gYlszXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoYXJyKSB7XG4gICAgICAgICAgICBhcnIuc29ydChzKTtcbiAgICAgICAgfTtcbiAgICB9KSgpLFxuXG4gICAgaXNfZXhpc3Q6IGZ1bmN0aW9uIGlzX2V4aXN0KGFyciwgcCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGFycltpXVswXSA9PSBwWzBdICYmIGFycltpXVsxXSA9PSBwWzFdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJjYy5fUkZwdXNoKG1vZHVsZSwgJzZhOTBkbzNRQjFPenJkUXdhYVBHOWVsJywgJ290aGVyUGxheWVyJyk7XG4vLyBnYW1lXFxzY3JpcHRcXG90aGVyUGxheWVyLmpzXG5cblwidXNlIHN0cmljdFwiO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIHNwZWVkOiAxLFxuICAgICAgICBpc1RydWU6IHRydWVcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHBsYXllckltYWdlID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwiaW1hZ2VcIik7XG5cbiAgICAgICAgdmFyIG9uVG91Y2ggPSBmdW5jdGlvbiBvblRvdWNoKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGlmIChcInVuZGVmaW5lZFwiICE9IHR5cGVvZiBzaG93bk1lbnUpIHtcbiAgICAgICAgICAgICAgICBzaG93bk1lbnUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbWVudU9uUGxheWVyID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwibWVudU9uUGxheWVyXCIpO1xuICAgICAgICAgICAgc2hvd25NZW51ID0gbWVudU9uUGxheWVyO1xuICAgICAgICAgICAgLy8gdmFyIHRvdWNoID0gZXZlbnQudG91Y2g7XG4gICAgICAgICAgICAvLyB2YXIgbWVudSAgPSBjYy5maW5kKFwiQ2FudmFzL21lbnVPblBsYXllclwiKTtcbiAgICAgICAgICAgIC8vIG1lbnUueCAgICA9IHRvdWNoLmdldExvY2F0aW9uWCgpO1xuICAgICAgICAgICAgLy8gbWVudS55ICAgID0gdG91Y2guZ2V0TG9jYXRpb25YKCk7XG4gICAgICAgICAgICBtZW51T25QbGF5ZXIuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gdGhpcy5ub2RlLm9uKFwidG91Y2hlbmRcIiwgb25Ub3VjaCx0aGlzKTtcbiAgICAgICAgaWYgKHNlbGYuaXNUcnVlKSB7XG4gICAgICAgICAgICBwbGF5ZXJJbWFnZS5vbihcInRvdWNoZW5kXCIsIG9uVG91Y2gsIHRoaXMpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG5cbiAgICB0b01vdmU6IGZ1bmN0aW9uIHRvTW92ZSh4LCB5LCBtaWR1KSB7XG4gICAgICAgIHRoaXMubm9kZS5zdG9wQWxsQWN0aW9ucygpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBtb3ZlVXRpbCA9IHRoaXMuZ2V0Q29tcG9uZW50KCdtb3ZlVXRpbCcpO1xuICAgICAgICB2YXIgcGxheWVyWCA9IE1hdGgucm91bmQodGhpcy5ub2RlLnggLyBtaWR1KTtcbiAgICAgICAgdmFyIHBsYXllclkgPSBNYXRoLnJvdW5kKHRoaXMubm9kZS55IC8gbWlkdSk7XG4gICAgICAgIHZhciBkZXNjWCA9IE1hdGgucm91bmQoeCAvIG1pZHUpO1xuICAgICAgICB2YXIgZGVzY1kgPSBNYXRoLnJvdW5kKHkgLyBtaWR1KTtcbiAgICAgICAgaWYgKHBsYXllclggPT0gZGVzY1ggJiYgcGxheWVyWSA9PSBkZXNjWSkgcmV0dXJuO1xuICAgICAgICB2YXIgcGF0aCA9IG1vdmVVdGlsLmZpbmRfcGF0aChbcGxheWVyWCwgcGxheWVyWV0sIFtkZXNjWCwgZGVzY1ldKTtcbiAgICAgICAgY29uc29sZS5pbmZvKHBhdGgpO1xuICAgICAgICB2YXIgc3RlcHMgPSBwYXRoLm1hcChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgeDogbm9kZVswXSAqIG1pZHUsIHk6IG5vZGVbMV0gKiBtaWR1IH07XG4gICAgICAgIH0pO1xuICAgICAgICAvL3RoaXMucGxheWVyTW92ZVN0ZXBzID0gW3t4OngseTp5fV07XG4gICAgICAgIHRoaXMucGxheWVyTW92ZVN0ZXBzID0gc3RlcHM7XG4gICAgICAgIHRoaXMubW92ZUJ5U3RlcCgpO1xuICAgIH0sXG5cbiAgICBtb3ZlQnlTdGVwOiBmdW5jdGlvbiBtb3ZlQnlTdGVwKHN0ZXBzKSB7XG4gICAgICAgIHZhciBzdGVwID0gdGhpcy5wbGF5ZXJNb3ZlU3RlcHMuc2hpZnQoKTtcbiAgICAgICAgaWYgKHN0ZXAgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3codGhpcy5ub2RlLnggLSBzdGVwLngsIDIpICsgTWF0aC5wb3codGhpcy5ub2RlLnkgLSBzdGVwLnksIDIpKTtcbiAgICAgICAgdmFyIG1vdmVUaW1lID0gZGlzdGFuY2UgLyAxMDAgLyB0aGlzLnNwZWVkO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKCAvL+W8gOWni+enu+WKqOWQpyBcbiAgICAgICAgY2Muc2VxdWVuY2UoY2MubW92ZVRvKG1vdmVUaW1lLCBzdGVwLngsIHN0ZXAueSksIGNjLmNhbGxGdW5jKHRoaXMubW92ZUJ5U3RlcCwgdGhpcykpKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiY2MuX1JGcHVzaChtb2R1bGUsICdmY2I2YVV1MkJoSlFaRVhzNnU5WXZISycsICdwbGF5ZXInKTtcbi8vIGdhbWVcXHNjcmlwdFxccGxheWVyLmpzXG5cblwidXNlIHN0cmljdFwiO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge31cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiY2MuX1JGcHVzaChtb2R1bGUsICdlYzZjM2dhWEhwTHE2MHQ4SWQ3SEM0NCcsICdzb2NrZXQuaW8nKTtcbi8vIGNvbW1vblxcc29ja2V0LmlvLmpzXG5cblwidXNlIHN0cmljdFwiO2lmKCFjYy5zeXMuaXNOYXRpdmUpeyhmdW5jdGlvbihmKXtpZih0eXBlb2YgZXhwb3J0cyA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiKXttb2R1bGUuZXhwb3J0cyA9IGYoKTt9ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCl7ZGVmaW5lKFtdLGYpO31lbHNlIHt2YXIgZztpZih0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKXtnID0gd2luZG93O31lbHNlIGlmKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIpe2cgPSBnbG9iYWw7fWVsc2UgaWYodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIpe2cgPSBzZWxmO31lbHNlIHtnID0gdGhpczt9Zy5pbyA9IGYoKTt9fSkoZnVuY3Rpb24oKXt2YXIgZGVmaW5lLG1vZHVsZSxleHBvcnRzO3JldHVybiAoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmUgPT0gXCJmdW5jdGlvblwiICYmIHJlcXVpcmU7aWYoIXUgJiYgYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBvICsgXCInXCIpO3Rocm93IChmLmNvZGUgPSBcIk1PRFVMRV9OT1RfRk9VTkRcIixmKTt9dmFyIGw9bltvXSA9IHtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpO30sbCxsLmV4cG9ydHMsZSx0LG4scik7fXJldHVybiBuW29dLmV4cG9ydHM7fXZhciBpPXR5cGVvZiByZXF1aXJlID09IFwiZnVuY3Rpb25cIiAmJiByZXF1aXJlO2Zvcih2YXIgbz0wO28gPCByLmxlbmd0aDtvKyspIHMocltvXSk7cmV0dXJuIHM7fSkoezE6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe21vZHVsZS5leHBvcnRzID0gX2RlcmVxXygnLi9saWIvJyk7fSx7XCIuL2xpYi9cIjoyfV0sMjpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7bW9kdWxlLmV4cG9ydHMgPSBfZGVyZXFfKCcuL3NvY2tldCcpOyAvKipcbiAgICAgICAgICAgICAgICAgKiBFeHBvcnRzIHBhcnNlclxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqL21vZHVsZS5leHBvcnRzLnBhcnNlciA9IF9kZXJlcV8oJ2VuZ2luZS5pby1wYXJzZXInKTt9LHtcIi4vc29ja2V0XCI6MyxcImVuZ2luZS5pby1wYXJzZXJcIjoxOX1dLDM6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihnbG9iYWwpeyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAgICAgICAgICAgICAgICAgICAgICovdmFyIHRyYW5zcG9ydHM9X2RlcmVxXygnLi90cmFuc3BvcnRzJyk7dmFyIEVtaXR0ZXI9X2RlcmVxXygnY29tcG9uZW50LWVtaXR0ZXInKTt2YXIgZGVidWc9X2RlcmVxXygnZGVidWcnKSgnZW5naW5lLmlvLWNsaWVudDpzb2NrZXQnKTt2YXIgaW5kZXg9X2RlcmVxXygnaW5kZXhvZicpO3ZhciBwYXJzZXI9X2RlcmVxXygnZW5naW5lLmlvLXBhcnNlcicpO3ZhciBwYXJzZXVyaT1fZGVyZXFfKCdwYXJzZXVyaScpO3ZhciBwYXJzZWpzb249X2RlcmVxXygncGFyc2Vqc29uJyk7dmFyIHBhcnNlcXM9X2RlcmVxXygncGFyc2VxcycpOyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogTW9kdWxlIGV4cG9ydHMuXG4gICAgICAgICAgICAgICAgICAgICAqL21vZHVsZS5leHBvcnRzID0gU29ja2V0OyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogTm9vcCBmdW5jdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICAgICAqL2Z1bmN0aW9uIG5vb3AoKXt9IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBTb2NrZXQgY29uc3RydWN0b3IuXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gdXJpIG9yIG9wdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgICAgICovZnVuY3Rpb24gU29ja2V0KHVyaSxvcHRzKXtpZighKHRoaXMgaW5zdGFuY2VvZiBTb2NrZXQpKXJldHVybiBuZXcgU29ja2V0KHVyaSxvcHRzKTtvcHRzID0gb3B0cyB8fCB7fTtpZih1cmkgJiYgJ29iamVjdCcgPT0gdHlwZW9mIHVyaSl7b3B0cyA9IHVyaTt1cmkgPSBudWxsO31pZih1cmkpe3VyaSA9IHBhcnNldXJpKHVyaSk7b3B0cy5ob3N0bmFtZSA9IHVyaS5ob3N0O29wdHMuc2VjdXJlID0gdXJpLnByb3RvY29sID09ICdodHRwcycgfHwgdXJpLnByb3RvY29sID09ICd3c3MnO29wdHMucG9ydCA9IHVyaS5wb3J0O2lmKHVyaS5xdWVyeSlvcHRzLnF1ZXJ5ID0gdXJpLnF1ZXJ5O31lbHNlIGlmKG9wdHMuaG9zdCl7b3B0cy5ob3N0bmFtZSA9IHBhcnNldXJpKG9wdHMuaG9zdCkuaG9zdDt9dGhpcy5zZWN1cmUgPSBudWxsICE9IG9wdHMuc2VjdXJlP29wdHMuc2VjdXJlOmdsb2JhbC5sb2NhdGlvbiAmJiAnaHR0cHM6JyA9PSBsb2NhdGlvbi5wcm90b2NvbDtpZihvcHRzLmhvc3RuYW1lICYmICFvcHRzLnBvcnQpeyAvLyBpZiBubyBwb3J0IGlzIHNwZWNpZmllZCBtYW51YWxseSwgdXNlIHRoZSBwcm90b2NvbCBkZWZhdWx0XG5vcHRzLnBvcnQgPSB0aGlzLnNlY3VyZT8nNDQzJzonODAnO310aGlzLmFnZW50ID0gb3B0cy5hZ2VudCB8fCBmYWxzZTt0aGlzLmhvc3RuYW1lID0gb3B0cy5ob3N0bmFtZSB8fCAoZ2xvYmFsLmxvY2F0aW9uP2xvY2F0aW9uLmhvc3RuYW1lOidsb2NhbGhvc3QnKTt0aGlzLnBvcnQgPSBvcHRzLnBvcnQgfHwgKGdsb2JhbC5sb2NhdGlvbiAmJiBsb2NhdGlvbi5wb3J0P2xvY2F0aW9uLnBvcnQ6dGhpcy5zZWN1cmU/NDQzOjgwKTt0aGlzLnF1ZXJ5ID0gb3B0cy5xdWVyeSB8fCB7fTtpZignc3RyaW5nJyA9PSB0eXBlb2YgdGhpcy5xdWVyeSl0aGlzLnF1ZXJ5ID0gcGFyc2Vxcy5kZWNvZGUodGhpcy5xdWVyeSk7dGhpcy51cGdyYWRlID0gZmFsc2UgIT09IG9wdHMudXBncmFkZTt0aGlzLnBhdGggPSAob3B0cy5wYXRoIHx8ICcvZW5naW5lLmlvJykucmVwbGFjZSgvXFwvJC8sJycpICsgJy8nO3RoaXMuZm9yY2VKU09OUCA9ICEhb3B0cy5mb3JjZUpTT05QO3RoaXMuanNvbnAgPSBmYWxzZSAhPT0gb3B0cy5qc29ucDt0aGlzLmZvcmNlQmFzZTY0ID0gISFvcHRzLmZvcmNlQmFzZTY0O3RoaXMuZW5hYmxlc1hEUiA9ICEhb3B0cy5lbmFibGVzWERSO3RoaXMudGltZXN0YW1wUGFyYW0gPSBvcHRzLnRpbWVzdGFtcFBhcmFtIHx8ICd0Jzt0aGlzLnRpbWVzdGFtcFJlcXVlc3RzID0gb3B0cy50aW1lc3RhbXBSZXF1ZXN0czt0aGlzLnRyYW5zcG9ydHMgPSBvcHRzLnRyYW5zcG9ydHMgfHwgWydwb2xsaW5nJywnd2Vic29ja2V0J107dGhpcy5yZWFkeVN0YXRlID0gJyc7dGhpcy53cml0ZUJ1ZmZlciA9IFtdO3RoaXMucG9saWN5UG9ydCA9IG9wdHMucG9saWN5UG9ydCB8fCA4NDM7dGhpcy5yZW1lbWJlclVwZ3JhZGUgPSBvcHRzLnJlbWVtYmVyVXBncmFkZSB8fCBmYWxzZTt0aGlzLmJpbmFyeVR5cGUgPSBudWxsO3RoaXMub25seUJpbmFyeVVwZ3JhZGVzID0gb3B0cy5vbmx5QmluYXJ5VXBncmFkZXM7dGhpcy5wZXJNZXNzYWdlRGVmbGF0ZSA9IGZhbHNlICE9PSBvcHRzLnBlck1lc3NhZ2VEZWZsYXRlP29wdHMucGVyTWVzc2FnZURlZmxhdGUgfHwge306ZmFsc2U7aWYodHJ1ZSA9PT0gdGhpcy5wZXJNZXNzYWdlRGVmbGF0ZSl0aGlzLnBlck1lc3NhZ2VEZWZsYXRlID0ge307aWYodGhpcy5wZXJNZXNzYWdlRGVmbGF0ZSAmJiBudWxsID09IHRoaXMucGVyTWVzc2FnZURlZmxhdGUudGhyZXNob2xkKXt0aGlzLnBlck1lc3NhZ2VEZWZsYXRlLnRocmVzaG9sZCA9IDEwMjQ7fSAvLyBTU0wgb3B0aW9ucyBmb3IgTm9kZS5qcyBjbGllbnRcbnRoaXMucGZ4ID0gb3B0cy5wZnggfHwgbnVsbDt0aGlzLmtleSA9IG9wdHMua2V5IHx8IG51bGw7dGhpcy5wYXNzcGhyYXNlID0gb3B0cy5wYXNzcGhyYXNlIHx8IG51bGw7dGhpcy5jZXJ0ID0gb3B0cy5jZXJ0IHx8IG51bGw7dGhpcy5jYSA9IG9wdHMuY2EgfHwgbnVsbDt0aGlzLmNpcGhlcnMgPSBvcHRzLmNpcGhlcnMgfHwgbnVsbDt0aGlzLnJlamVjdFVuYXV0aG9yaXplZCA9IG9wdHMucmVqZWN0VW5hdXRob3JpemVkID09PSB1bmRlZmluZWQ/bnVsbDpvcHRzLnJlamVjdFVuYXV0aG9yaXplZDsgLy8gb3RoZXIgb3B0aW9ucyBmb3IgTm9kZS5qcyBjbGllbnRcbnZhciBmcmVlR2xvYmFsPXR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsO2lmKGZyZWVHbG9iYWwuZ2xvYmFsID09PSBmcmVlR2xvYmFsKXtpZihvcHRzLmV4dHJhSGVhZGVycyAmJiBPYmplY3Qua2V5cyhvcHRzLmV4dHJhSGVhZGVycykubGVuZ3RoID4gMCl7dGhpcy5leHRyYUhlYWRlcnMgPSBvcHRzLmV4dHJhSGVhZGVyczt9fXRoaXMub3BlbigpO31Tb2NrZXQucHJpb3JXZWJzb2NrZXRTdWNjZXNzID0gZmFsc2U7IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBNaXggaW4gYEVtaXR0ZXJgLlxuICAgICAgICAgICAgICAgICAgICAgKi9FbWl0dGVyKFNvY2tldC5wcm90b3R5cGUpOyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogUHJvdG9jb2wgdmVyc2lvbi5cbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgICAgICovU29ja2V0LnByb3RvY29sID0gcGFyc2VyLnByb3RvY29sOyAvLyB0aGlzIGlzIGFuIGludFxuLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEV4cG9zZSBkZXBzIGZvciBsZWdhY3kgY29tcGF0aWJpbGl0eVxuICAgICAgICAgICAgICAgICAgICAgKiBhbmQgc3RhbmRhbG9uZSBicm93c2VyIGFjY2Vzcy5cbiAgICAgICAgICAgICAgICAgICAgICovU29ja2V0LlNvY2tldCA9IFNvY2tldDtTb2NrZXQuVHJhbnNwb3J0ID0gX2RlcmVxXygnLi90cmFuc3BvcnQnKTtTb2NrZXQudHJhbnNwb3J0cyA9IF9kZXJlcV8oJy4vdHJhbnNwb3J0cycpO1NvY2tldC5wYXJzZXIgPSBfZGVyZXFfKCdlbmdpbmUuaW8tcGFyc2VyJyk7IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBDcmVhdGVzIHRyYW5zcG9ydCBvZiB0aGUgZ2l2ZW4gdHlwZS5cbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHRyYW5zcG9ydCBuYW1lXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge1RyYW5zcG9ydH1cbiAgICAgICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICAgICAqL1NvY2tldC5wcm90b3R5cGUuY3JlYXRlVHJhbnNwb3J0ID0gZnVuY3Rpb24obmFtZSl7ZGVidWcoJ2NyZWF0aW5nIHRyYW5zcG9ydCBcIiVzXCInLG5hbWUpO3ZhciBxdWVyeT1jbG9uZSh0aGlzLnF1ZXJ5KTsgLy8gYXBwZW5kIGVuZ2luZS5pbyBwcm90b2NvbCBpZGVudGlmaWVyXG5xdWVyeS5FSU8gPSBwYXJzZXIucHJvdG9jb2w7IC8vIHRyYW5zcG9ydCBuYW1lXG5xdWVyeS50cmFuc3BvcnQgPSBuYW1lOyAvLyBzZXNzaW9uIGlkIGlmIHdlIGFscmVhZHkgaGF2ZSBvbmVcbmlmKHRoaXMuaWQpcXVlcnkuc2lkID0gdGhpcy5pZDt2YXIgdHJhbnNwb3J0PW5ldyB0cmFuc3BvcnRzW25hbWVdKHthZ2VudDp0aGlzLmFnZW50LGhvc3RuYW1lOnRoaXMuaG9zdG5hbWUscG9ydDp0aGlzLnBvcnQsc2VjdXJlOnRoaXMuc2VjdXJlLHBhdGg6dGhpcy5wYXRoLHF1ZXJ5OnF1ZXJ5LGZvcmNlSlNPTlA6dGhpcy5mb3JjZUpTT05QLGpzb25wOnRoaXMuanNvbnAsZm9yY2VCYXNlNjQ6dGhpcy5mb3JjZUJhc2U2NCxlbmFibGVzWERSOnRoaXMuZW5hYmxlc1hEUix0aW1lc3RhbXBSZXF1ZXN0czp0aGlzLnRpbWVzdGFtcFJlcXVlc3RzLHRpbWVzdGFtcFBhcmFtOnRoaXMudGltZXN0YW1wUGFyYW0scG9saWN5UG9ydDp0aGlzLnBvbGljeVBvcnQsc29ja2V0OnRoaXMscGZ4OnRoaXMucGZ4LGtleTp0aGlzLmtleSxwYXNzcGhyYXNlOnRoaXMucGFzc3BocmFzZSxjZXJ0OnRoaXMuY2VydCxjYTp0aGlzLmNhLGNpcGhlcnM6dGhpcy5jaXBoZXJzLHJlamVjdFVuYXV0aG9yaXplZDp0aGlzLnJlamVjdFVuYXV0aG9yaXplZCxwZXJNZXNzYWdlRGVmbGF0ZTp0aGlzLnBlck1lc3NhZ2VEZWZsYXRlLGV4dHJhSGVhZGVyczp0aGlzLmV4dHJhSGVhZGVyc30pO3JldHVybiB0cmFuc3BvcnQ7fTtmdW5jdGlvbiBjbG9uZShvYmope3ZhciBvPXt9O2Zvcih2YXIgaSBpbiBvYmopIHtpZihvYmouaGFzT3duUHJvcGVydHkoaSkpe29baV0gPSBvYmpbaV07fX1yZXR1cm4gbzt9IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBJbml0aWFsaXplcyB0cmFuc3BvcnQgdG8gdXNlIGFuZCBzdGFydHMgcHJvYmUuXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAgICAgKi9Tb2NrZXQucHJvdG90eXBlLm9wZW4gPSBmdW5jdGlvbigpe3ZhciB0cmFuc3BvcnQ7aWYodGhpcy5yZW1lbWJlclVwZ3JhZGUgJiYgU29ja2V0LnByaW9yV2Vic29ja2V0U3VjY2VzcyAmJiB0aGlzLnRyYW5zcG9ydHMuaW5kZXhPZignd2Vic29ja2V0JykgIT0gLTEpe3RyYW5zcG9ydCA9ICd3ZWJzb2NrZXQnO31lbHNlIGlmKDAgPT09IHRoaXMudHJhbnNwb3J0cy5sZW5ndGgpeyAvLyBFbWl0IGVycm9yIG9uIG5leHQgdGljayBzbyBpdCBjYW4gYmUgbGlzdGVuZWQgdG9cbnZhciBzZWxmPXRoaXM7c2V0VGltZW91dChmdW5jdGlvbigpe3NlbGYuZW1pdCgnZXJyb3InLCdObyB0cmFuc3BvcnRzIGF2YWlsYWJsZScpO30sMCk7cmV0dXJuO31lbHNlIHt0cmFuc3BvcnQgPSB0aGlzLnRyYW5zcG9ydHNbMF07fXRoaXMucmVhZHlTdGF0ZSA9ICdvcGVuaW5nJzsgLy8gUmV0cnkgd2l0aCB0aGUgbmV4dCB0cmFuc3BvcnQgaWYgdGhlIHRyYW5zcG9ydCBpcyBkaXNhYmxlZCAoanNvbnA6IGZhbHNlKVxudHJ5e3RyYW5zcG9ydCA9IHRoaXMuY3JlYXRlVHJhbnNwb3J0KHRyYW5zcG9ydCk7fWNhdGNoKGUpIHt0aGlzLnRyYW5zcG9ydHMuc2hpZnQoKTt0aGlzLm9wZW4oKTtyZXR1cm47fXRyYW5zcG9ydC5vcGVuKCk7dGhpcy5zZXRUcmFuc3BvcnQodHJhbnNwb3J0KTt9OyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogU2V0cyB0aGUgY3VycmVudCB0cmFuc3BvcnQuIERpc2FibGVzIHRoZSBleGlzdGluZyBvbmUgKGlmIGFueSkuXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAgICAgKi9Tb2NrZXQucHJvdG90eXBlLnNldFRyYW5zcG9ydCA9IGZ1bmN0aW9uKHRyYW5zcG9ydCl7ZGVidWcoJ3NldHRpbmcgdHJhbnNwb3J0ICVzJyx0cmFuc3BvcnQubmFtZSk7dmFyIHNlbGY9dGhpcztpZih0aGlzLnRyYW5zcG9ydCl7ZGVidWcoJ2NsZWFyaW5nIGV4aXN0aW5nIHRyYW5zcG9ydCAlcycsdGhpcy50cmFuc3BvcnQubmFtZSk7dGhpcy50cmFuc3BvcnQucmVtb3ZlQWxsTGlzdGVuZXJzKCk7fSAvLyBzZXQgdXAgdHJhbnNwb3J0XG50aGlzLnRyYW5zcG9ydCA9IHRyYW5zcG9ydDsgLy8gc2V0IHVwIHRyYW5zcG9ydCBsaXN0ZW5lcnNcbnRyYW5zcG9ydC5vbignZHJhaW4nLGZ1bmN0aW9uKCl7c2VsZi5vbkRyYWluKCk7fSkub24oJ3BhY2tldCcsZnVuY3Rpb24ocGFja2V0KXtzZWxmLm9uUGFja2V0KHBhY2tldCk7fSkub24oJ2Vycm9yJyxmdW5jdGlvbihlKXtzZWxmLm9uRXJyb3IoZSk7fSkub24oJ2Nsb3NlJyxmdW5jdGlvbigpe3NlbGYub25DbG9zZSgndHJhbnNwb3J0IGNsb3NlJyk7fSk7fTsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFByb2JlcyBhIHRyYW5zcG9ydC5cbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHRyYW5zcG9ydCBuYW1lXG4gICAgICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAgICAgKi9Tb2NrZXQucHJvdG90eXBlLnByb2JlID0gZnVuY3Rpb24obmFtZSl7ZGVidWcoJ3Byb2JpbmcgdHJhbnNwb3J0IFwiJXNcIicsbmFtZSk7dmFyIHRyYW5zcG9ydD10aGlzLmNyZWF0ZVRyYW5zcG9ydChuYW1lLHtwcm9iZToxfSksZmFpbGVkPWZhbHNlLHNlbGY9dGhpcztTb2NrZXQucHJpb3JXZWJzb2NrZXRTdWNjZXNzID0gZmFsc2U7ZnVuY3Rpb24gb25UcmFuc3BvcnRPcGVuKCl7aWYoc2VsZi5vbmx5QmluYXJ5VXBncmFkZXMpe3ZhciB1cGdyYWRlTG9zZXNCaW5hcnk9IXRoaXMuc3VwcG9ydHNCaW5hcnkgJiYgc2VsZi50cmFuc3BvcnQuc3VwcG9ydHNCaW5hcnk7ZmFpbGVkID0gZmFpbGVkIHx8IHVwZ3JhZGVMb3Nlc0JpbmFyeTt9aWYoZmFpbGVkKXJldHVybjtkZWJ1ZygncHJvYmUgdHJhbnNwb3J0IFwiJXNcIiBvcGVuZWQnLG5hbWUpO3RyYW5zcG9ydC5zZW5kKFt7dHlwZToncGluZycsZGF0YToncHJvYmUnfV0pO3RyYW5zcG9ydC5vbmNlKCdwYWNrZXQnLGZ1bmN0aW9uKG1zZyl7aWYoZmFpbGVkKXJldHVybjtpZigncG9uZycgPT0gbXNnLnR5cGUgJiYgJ3Byb2JlJyA9PSBtc2cuZGF0YSl7ZGVidWcoJ3Byb2JlIHRyYW5zcG9ydCBcIiVzXCIgcG9uZycsbmFtZSk7c2VsZi51cGdyYWRpbmcgPSB0cnVlO3NlbGYuZW1pdCgndXBncmFkaW5nJyx0cmFuc3BvcnQpO2lmKCF0cmFuc3BvcnQpcmV0dXJuO1NvY2tldC5wcmlvcldlYnNvY2tldFN1Y2Nlc3MgPSAnd2Vic29ja2V0JyA9PSB0cmFuc3BvcnQubmFtZTtkZWJ1ZygncGF1c2luZyBjdXJyZW50IHRyYW5zcG9ydCBcIiVzXCInLHNlbGYudHJhbnNwb3J0Lm5hbWUpO3NlbGYudHJhbnNwb3J0LnBhdXNlKGZ1bmN0aW9uKCl7aWYoZmFpbGVkKXJldHVybjtpZignY2xvc2VkJyA9PSBzZWxmLnJlYWR5U3RhdGUpcmV0dXJuO2RlYnVnKCdjaGFuZ2luZyB0cmFuc3BvcnQgYW5kIHNlbmRpbmcgdXBncmFkZSBwYWNrZXQnKTtjbGVhbnVwKCk7c2VsZi5zZXRUcmFuc3BvcnQodHJhbnNwb3J0KTt0cmFuc3BvcnQuc2VuZChbe3R5cGU6J3VwZ3JhZGUnfV0pO3NlbGYuZW1pdCgndXBncmFkZScsdHJhbnNwb3J0KTt0cmFuc3BvcnQgPSBudWxsO3NlbGYudXBncmFkaW5nID0gZmFsc2U7c2VsZi5mbHVzaCgpO30pO31lbHNlIHtkZWJ1ZygncHJvYmUgdHJhbnNwb3J0IFwiJXNcIiBmYWlsZWQnLG5hbWUpO3ZhciBlcnI9bmV3IEVycm9yKCdwcm9iZSBlcnJvcicpO2Vyci50cmFuc3BvcnQgPSB0cmFuc3BvcnQubmFtZTtzZWxmLmVtaXQoJ3VwZ3JhZGVFcnJvcicsZXJyKTt9fSk7fWZ1bmN0aW9uIGZyZWV6ZVRyYW5zcG9ydCgpe2lmKGZhaWxlZClyZXR1cm47IC8vIEFueSBjYWxsYmFjayBjYWxsZWQgYnkgdHJhbnNwb3J0IHNob3VsZCBiZSBpZ25vcmVkIHNpbmNlIG5vd1xuZmFpbGVkID0gdHJ1ZTtjbGVhbnVwKCk7dHJhbnNwb3J0LmNsb3NlKCk7dHJhbnNwb3J0ID0gbnVsbDt9IC8vSGFuZGxlIGFueSBlcnJvciB0aGF0IGhhcHBlbnMgd2hpbGUgcHJvYmluZ1xuZnVuY3Rpb24gb25lcnJvcihlcnIpe3ZhciBlcnJvcj1uZXcgRXJyb3IoJ3Byb2JlIGVycm9yOiAnICsgZXJyKTtlcnJvci50cmFuc3BvcnQgPSB0cmFuc3BvcnQubmFtZTtmcmVlemVUcmFuc3BvcnQoKTtkZWJ1ZygncHJvYmUgdHJhbnNwb3J0IFwiJXNcIiBmYWlsZWQgYmVjYXVzZSBvZiBlcnJvcjogJXMnLG5hbWUsZXJyKTtzZWxmLmVtaXQoJ3VwZ3JhZGVFcnJvcicsZXJyb3IpO31mdW5jdGlvbiBvblRyYW5zcG9ydENsb3NlKCl7b25lcnJvcihcInRyYW5zcG9ydCBjbG9zZWRcIik7fSAvL1doZW4gdGhlIHNvY2tldCBpcyBjbG9zZWQgd2hpbGUgd2UncmUgcHJvYmluZ1xuZnVuY3Rpb24gb25jbG9zZSgpe29uZXJyb3IoXCJzb2NrZXQgY2xvc2VkXCIpO30gLy9XaGVuIHRoZSBzb2NrZXQgaXMgdXBncmFkZWQgd2hpbGUgd2UncmUgcHJvYmluZ1xuZnVuY3Rpb24gb251cGdyYWRlKHRvKXtpZih0cmFuc3BvcnQgJiYgdG8ubmFtZSAhPSB0cmFuc3BvcnQubmFtZSl7ZGVidWcoJ1wiJXNcIiB3b3JrcyAtIGFib3J0aW5nIFwiJXNcIicsdG8ubmFtZSx0cmFuc3BvcnQubmFtZSk7ZnJlZXplVHJhbnNwb3J0KCk7fX0gLy9SZW1vdmUgYWxsIGxpc3RlbmVycyBvbiB0aGUgdHJhbnNwb3J0IGFuZCBvbiBzZWxmXG5mdW5jdGlvbiBjbGVhbnVwKCl7dHJhbnNwb3J0LnJlbW92ZUxpc3RlbmVyKCdvcGVuJyxvblRyYW5zcG9ydE9wZW4pO3RyYW5zcG9ydC5yZW1vdmVMaXN0ZW5lcignZXJyb3InLG9uZXJyb3IpO3RyYW5zcG9ydC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLG9uVHJhbnNwb3J0Q2xvc2UpO3NlbGYucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJyxvbmNsb3NlKTtzZWxmLnJlbW92ZUxpc3RlbmVyKCd1cGdyYWRpbmcnLG9udXBncmFkZSk7fXRyYW5zcG9ydC5vbmNlKCdvcGVuJyxvblRyYW5zcG9ydE9wZW4pO3RyYW5zcG9ydC5vbmNlKCdlcnJvcicsb25lcnJvcik7dHJhbnNwb3J0Lm9uY2UoJ2Nsb3NlJyxvblRyYW5zcG9ydENsb3NlKTt0aGlzLm9uY2UoJ2Nsb3NlJyxvbmNsb3NlKTt0aGlzLm9uY2UoJ3VwZ3JhZGluZycsb251cGdyYWRlKTt0cmFuc3BvcnQub3BlbigpO307IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBDYWxsZWQgd2hlbiBjb25uZWN0aW9uIGlzIGRlZW1lZCBvcGVuLlxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAgICAgKi9Tb2NrZXQucHJvdG90eXBlLm9uT3BlbiA9IGZ1bmN0aW9uKCl7ZGVidWcoJ3NvY2tldCBvcGVuJyk7dGhpcy5yZWFkeVN0YXRlID0gJ29wZW4nO1NvY2tldC5wcmlvcldlYnNvY2tldFN1Y2Nlc3MgPSAnd2Vic29ja2V0JyA9PSB0aGlzLnRyYW5zcG9ydC5uYW1lO3RoaXMuZW1pdCgnb3BlbicpO3RoaXMuZmx1c2goKTsgLy8gd2UgY2hlY2sgZm9yIGByZWFkeVN0YXRlYCBpbiBjYXNlIGFuIGBvcGVuYFxuLy8gbGlzdGVuZXIgYWxyZWFkeSBjbG9zZWQgdGhlIHNvY2tldFxuaWYoJ29wZW4nID09IHRoaXMucmVhZHlTdGF0ZSAmJiB0aGlzLnVwZ3JhZGUgJiYgdGhpcy50cmFuc3BvcnQucGF1c2Upe2RlYnVnKCdzdGFydGluZyB1cGdyYWRlIHByb2JlcycpO2Zvcih2YXIgaT0wLGw9dGhpcy51cGdyYWRlcy5sZW5ndGg7aSA8IGw7aSsrKSB7dGhpcy5wcm9iZSh0aGlzLnVwZ3JhZGVzW2ldKTt9fX07IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBIYW5kbGVzIGEgcGFja2V0LlxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgICAgICovU29ja2V0LnByb3RvdHlwZS5vblBhY2tldCA9IGZ1bmN0aW9uKHBhY2tldCl7aWYoJ29wZW5pbmcnID09IHRoaXMucmVhZHlTdGF0ZSB8fCAnb3BlbicgPT0gdGhpcy5yZWFkeVN0YXRlKXtkZWJ1Zygnc29ja2V0IHJlY2VpdmU6IHR5cGUgXCIlc1wiLCBkYXRhIFwiJXNcIicscGFja2V0LnR5cGUscGFja2V0LmRhdGEpO3RoaXMuZW1pdCgncGFja2V0JyxwYWNrZXQpOyAvLyBTb2NrZXQgaXMgbGl2ZSAtIGFueSBwYWNrZXQgY291bnRzXG50aGlzLmVtaXQoJ2hlYXJ0YmVhdCcpO3N3aXRjaChwYWNrZXQudHlwZSl7Y2FzZSAnb3Blbic6dGhpcy5vbkhhbmRzaGFrZShwYXJzZWpzb24ocGFja2V0LmRhdGEpKTticmVhaztjYXNlICdwb25nJzp0aGlzLnNldFBpbmcoKTt0aGlzLmVtaXQoJ3BvbmcnKTticmVhaztjYXNlICdlcnJvcic6dmFyIGVycj1uZXcgRXJyb3IoJ3NlcnZlciBlcnJvcicpO2Vyci5jb2RlID0gcGFja2V0LmRhdGE7dGhpcy5vbkVycm9yKGVycik7YnJlYWs7Y2FzZSAnbWVzc2FnZSc6dGhpcy5lbWl0KCdkYXRhJyxwYWNrZXQuZGF0YSk7dGhpcy5lbWl0KCdtZXNzYWdlJyxwYWNrZXQuZGF0YSk7YnJlYWs7fX1lbHNlIHtkZWJ1ZygncGFja2V0IHJlY2VpdmVkIHdpdGggc29ja2V0IHJlYWR5U3RhdGUgXCIlc1wiJyx0aGlzLnJlYWR5U3RhdGUpO319OyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQ2FsbGVkIHVwb24gaGFuZHNoYWtlIGNvbXBsZXRpb24uXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoYW5kc2hha2Ugb2JqXG4gICAgICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAgICAgKi9Tb2NrZXQucHJvdG90eXBlLm9uSGFuZHNoYWtlID0gZnVuY3Rpb24oZGF0YSl7dGhpcy5lbWl0KCdoYW5kc2hha2UnLGRhdGEpO3RoaXMuaWQgPSBkYXRhLnNpZDt0aGlzLnRyYW5zcG9ydC5xdWVyeS5zaWQgPSBkYXRhLnNpZDt0aGlzLnVwZ3JhZGVzID0gdGhpcy5maWx0ZXJVcGdyYWRlcyhkYXRhLnVwZ3JhZGVzKTt0aGlzLnBpbmdJbnRlcnZhbCA9IGRhdGEucGluZ0ludGVydmFsO3RoaXMucGluZ1RpbWVvdXQgPSBkYXRhLnBpbmdUaW1lb3V0O3RoaXMub25PcGVuKCk7IC8vIEluIGNhc2Ugb3BlbiBoYW5kbGVyIGNsb3NlcyBzb2NrZXRcbmlmKCdjbG9zZWQnID09IHRoaXMucmVhZHlTdGF0ZSlyZXR1cm47dGhpcy5zZXRQaW5nKCk7IC8vIFByb2xvbmcgbGl2ZW5lc3Mgb2Ygc29ja2V0IG9uIGhlYXJ0YmVhdFxudGhpcy5yZW1vdmVMaXN0ZW5lcignaGVhcnRiZWF0Jyx0aGlzLm9uSGVhcnRiZWF0KTt0aGlzLm9uKCdoZWFydGJlYXQnLHRoaXMub25IZWFydGJlYXQpO307IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBSZXNldHMgcGluZyB0aW1lb3V0LlxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgICAgICovU29ja2V0LnByb3RvdHlwZS5vbkhlYXJ0YmVhdCA9IGZ1bmN0aW9uKHRpbWVvdXQpe2NsZWFyVGltZW91dCh0aGlzLnBpbmdUaW1lb3V0VGltZXIpO3ZhciBzZWxmPXRoaXM7c2VsZi5waW5nVGltZW91dFRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpe2lmKCdjbG9zZWQnID09IHNlbGYucmVhZHlTdGF0ZSlyZXR1cm47c2VsZi5vbkNsb3NlKCdwaW5nIHRpbWVvdXQnKTt9LHRpbWVvdXQgfHwgc2VsZi5waW5nSW50ZXJ2YWwgKyBzZWxmLnBpbmdUaW1lb3V0KTt9OyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogUGluZ3Mgc2VydmVyIGV2ZXJ5IGB0aGlzLnBpbmdJbnRlcnZhbGAgYW5kIGV4cGVjdHMgcmVzcG9uc2VcbiAgICAgICAgICAgICAgICAgICAgICogd2l0aGluIGB0aGlzLnBpbmdUaW1lb3V0YCBvciBjbG9zZXMgY29ubmVjdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICAgICAqL1NvY2tldC5wcm90b3R5cGUuc2V0UGluZyA9IGZ1bmN0aW9uKCl7dmFyIHNlbGY9dGhpcztjbGVhclRpbWVvdXQoc2VsZi5waW5nSW50ZXJ2YWxUaW1lcik7c2VsZi5waW5nSW50ZXJ2YWxUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtkZWJ1Zygnd3JpdGluZyBwaW5nIHBhY2tldCAtIGV4cGVjdGluZyBwb25nIHdpdGhpbiAlc21zJyxzZWxmLnBpbmdUaW1lb3V0KTtzZWxmLnBpbmcoKTtzZWxmLm9uSGVhcnRiZWF0KHNlbGYucGluZ1RpbWVvdXQpO30sc2VsZi5waW5nSW50ZXJ2YWwpO307IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBTZW5kcyBhIHBpbmcgcGFja2V0LlxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgICAgICovU29ja2V0LnByb3RvdHlwZS5waW5nID0gZnVuY3Rpb24oKXt2YXIgc2VsZj10aGlzO3RoaXMuc2VuZFBhY2tldCgncGluZycsZnVuY3Rpb24oKXtzZWxmLmVtaXQoJ3BpbmcnKTt9KTt9OyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQ2FsbGVkIG9uIGBkcmFpbmAgZXZlbnRcbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICAgICAqL1NvY2tldC5wcm90b3R5cGUub25EcmFpbiA9IGZ1bmN0aW9uKCl7dGhpcy53cml0ZUJ1ZmZlci5zcGxpY2UoMCx0aGlzLnByZXZCdWZmZXJMZW4pOyAvLyBzZXR0aW5nIHByZXZCdWZmZXJMZW4gPSAwIGlzIHZlcnkgaW1wb3J0YW50XG4vLyBmb3IgZXhhbXBsZSwgd2hlbiB1cGdyYWRpbmcsIHVwZ3JhZGUgcGFja2V0IGlzIHNlbnQgb3Zlcixcbi8vIGFuZCBhIG5vbnplcm8gcHJldkJ1ZmZlckxlbiBjb3VsZCBjYXVzZSBwcm9ibGVtcyBvbiBgZHJhaW5gXG50aGlzLnByZXZCdWZmZXJMZW4gPSAwO2lmKDAgPT09IHRoaXMud3JpdGVCdWZmZXIubGVuZ3RoKXt0aGlzLmVtaXQoJ2RyYWluJyk7fWVsc2Uge3RoaXMuZmx1c2goKTt9fTsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEZsdXNoIHdyaXRlIGJ1ZmZlcnMuXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAgICAgKi9Tb2NrZXQucHJvdG90eXBlLmZsdXNoID0gZnVuY3Rpb24oKXtpZignY2xvc2VkJyAhPSB0aGlzLnJlYWR5U3RhdGUgJiYgdGhpcy50cmFuc3BvcnQud3JpdGFibGUgJiYgIXRoaXMudXBncmFkaW5nICYmIHRoaXMud3JpdGVCdWZmZXIubGVuZ3RoKXtkZWJ1ZygnZmx1c2hpbmcgJWQgcGFja2V0cyBpbiBzb2NrZXQnLHRoaXMud3JpdGVCdWZmZXIubGVuZ3RoKTt0aGlzLnRyYW5zcG9ydC5zZW5kKHRoaXMud3JpdGVCdWZmZXIpOyAvLyBrZWVwIHRyYWNrIG9mIGN1cnJlbnQgbGVuZ3RoIG9mIHdyaXRlQnVmZmVyXG4vLyBzcGxpY2Ugd3JpdGVCdWZmZXIgYW5kIGNhbGxiYWNrQnVmZmVyIG9uIGBkcmFpbmBcbnRoaXMucHJldkJ1ZmZlckxlbiA9IHRoaXMud3JpdGVCdWZmZXIubGVuZ3RoO3RoaXMuZW1pdCgnZmx1c2gnKTt9fTsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFNlbmRzIGEgbWVzc2FnZS5cbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2UuXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy5cbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7U29ja2V0fSBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAgICAgICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAgICAgICAgICAgICAqL1NvY2tldC5wcm90b3R5cGUud3JpdGUgPSBTb2NrZXQucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbihtc2csb3B0aW9ucyxmbil7dGhpcy5zZW5kUGFja2V0KCdtZXNzYWdlJyxtc2csb3B0aW9ucyxmbik7cmV0dXJuIHRoaXM7fTsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFNlbmRzIGEgcGFja2V0LlxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFja2V0IHR5cGUuXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhLlxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy5cbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAgICAgKi9Tb2NrZXQucHJvdG90eXBlLnNlbmRQYWNrZXQgPSBmdW5jdGlvbih0eXBlLGRhdGEsb3B0aW9ucyxmbil7aWYoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSl7Zm4gPSBkYXRhO2RhdGEgPSB1bmRlZmluZWQ7fWlmKCdmdW5jdGlvbicgPT0gdHlwZW9mIG9wdGlvbnMpe2ZuID0gb3B0aW9ucztvcHRpb25zID0gbnVsbDt9aWYoJ2Nsb3NpbmcnID09IHRoaXMucmVhZHlTdGF0ZSB8fCAnY2xvc2VkJyA9PSB0aGlzLnJlYWR5U3RhdGUpe3JldHVybjt9b3B0aW9ucyA9IG9wdGlvbnMgfHwge307b3B0aW9ucy5jb21wcmVzcyA9IGZhbHNlICE9PSBvcHRpb25zLmNvbXByZXNzO3ZhciBwYWNrZXQ9e3R5cGU6dHlwZSxkYXRhOmRhdGEsb3B0aW9uczpvcHRpb25zfTt0aGlzLmVtaXQoJ3BhY2tldENyZWF0ZScscGFja2V0KTt0aGlzLndyaXRlQnVmZmVyLnB1c2gocGFja2V0KTtpZihmbil0aGlzLm9uY2UoJ2ZsdXNoJyxmbik7dGhpcy5mbHVzaCgpO307IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBDbG9zZXMgdGhlIGNvbm5lY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAgICAgKi9Tb2NrZXQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKXtpZignb3BlbmluZycgPT0gdGhpcy5yZWFkeVN0YXRlIHx8ICdvcGVuJyA9PSB0aGlzLnJlYWR5U3RhdGUpe3RoaXMucmVhZHlTdGF0ZSA9ICdjbG9zaW5nJzt2YXIgc2VsZj10aGlzO2lmKHRoaXMud3JpdGVCdWZmZXIubGVuZ3RoKXt0aGlzLm9uY2UoJ2RyYWluJyxmdW5jdGlvbigpe2lmKHRoaXMudXBncmFkaW5nKXt3YWl0Rm9yVXBncmFkZSgpO31lbHNlIHtjbG9zZSgpO319KTt9ZWxzZSBpZih0aGlzLnVwZ3JhZGluZyl7d2FpdEZvclVwZ3JhZGUoKTt9ZWxzZSB7Y2xvc2UoKTt9fWZ1bmN0aW9uIGNsb3NlKCl7c2VsZi5vbkNsb3NlKCdmb3JjZWQgY2xvc2UnKTtkZWJ1Zygnc29ja2V0IGNsb3NpbmcgLSB0ZWxsaW5nIHRyYW5zcG9ydCB0byBjbG9zZScpO3NlbGYudHJhbnNwb3J0LmNsb3NlKCk7fWZ1bmN0aW9uIGNsZWFudXBBbmRDbG9zZSgpe3NlbGYucmVtb3ZlTGlzdGVuZXIoJ3VwZ3JhZGUnLGNsZWFudXBBbmRDbG9zZSk7c2VsZi5yZW1vdmVMaXN0ZW5lcigndXBncmFkZUVycm9yJyxjbGVhbnVwQW5kQ2xvc2UpO2Nsb3NlKCk7fWZ1bmN0aW9uIHdhaXRGb3JVcGdyYWRlKCl7IC8vIHdhaXQgZm9yIHVwZ3JhZGUgdG8gZmluaXNoIHNpbmNlIHdlIGNhbid0IHNlbmQgcGFja2V0cyB3aGlsZSBwYXVzaW5nIGEgdHJhbnNwb3J0XG5zZWxmLm9uY2UoJ3VwZ3JhZGUnLGNsZWFudXBBbmRDbG9zZSk7c2VsZi5vbmNlKCd1cGdyYWRlRXJyb3InLGNsZWFudXBBbmRDbG9zZSk7fXJldHVybiB0aGlzO307IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBDYWxsZWQgdXBvbiB0cmFuc3BvcnQgZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICAgICAqL1NvY2tldC5wcm90b3R5cGUub25FcnJvciA9IGZ1bmN0aW9uKGVycil7ZGVidWcoJ3NvY2tldCBlcnJvciAlaicsZXJyKTtTb2NrZXQucHJpb3JXZWJzb2NrZXRTdWNjZXNzID0gZmFsc2U7dGhpcy5lbWl0KCdlcnJvcicsZXJyKTt0aGlzLm9uQ2xvc2UoJ3RyYW5zcG9ydCBlcnJvcicsZXJyKTt9OyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQ2FsbGVkIHVwb24gdHJhbnNwb3J0IGNsb3NlLlxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgICAgICovU29ja2V0LnByb3RvdHlwZS5vbkNsb3NlID0gZnVuY3Rpb24ocmVhc29uLGRlc2Mpe2lmKCdvcGVuaW5nJyA9PSB0aGlzLnJlYWR5U3RhdGUgfHwgJ29wZW4nID09IHRoaXMucmVhZHlTdGF0ZSB8fCAnY2xvc2luZycgPT0gdGhpcy5yZWFkeVN0YXRlKXtkZWJ1Zygnc29ja2V0IGNsb3NlIHdpdGggcmVhc29uOiBcIiVzXCInLHJlYXNvbik7dmFyIHNlbGY9dGhpczsgLy8gY2xlYXIgdGltZXJzXG5jbGVhclRpbWVvdXQodGhpcy5waW5nSW50ZXJ2YWxUaW1lcik7Y2xlYXJUaW1lb3V0KHRoaXMucGluZ1RpbWVvdXRUaW1lcik7IC8vIHN0b3AgZXZlbnQgZnJvbSBmaXJpbmcgYWdhaW4gZm9yIHRyYW5zcG9ydFxudGhpcy50cmFuc3BvcnQucmVtb3ZlQWxsTGlzdGVuZXJzKCdjbG9zZScpOyAvLyBlbnN1cmUgdHJhbnNwb3J0IHdvbid0IHN0YXkgb3BlblxudGhpcy50cmFuc3BvcnQuY2xvc2UoKTsgLy8gaWdub3JlIGZ1cnRoZXIgdHJhbnNwb3J0IGNvbW11bmljYXRpb25cbnRoaXMudHJhbnNwb3J0LnJlbW92ZUFsbExpc3RlbmVycygpOyAvLyBzZXQgcmVhZHkgc3RhdGVcbnRoaXMucmVhZHlTdGF0ZSA9ICdjbG9zZWQnOyAvLyBjbGVhciBzZXNzaW9uIGlkXG50aGlzLmlkID0gbnVsbDsgLy8gZW1pdCBjbG9zZSBldmVudFxudGhpcy5lbWl0KCdjbG9zZScscmVhc29uLGRlc2MpOyAvLyBjbGVhbiBidWZmZXJzIGFmdGVyLCBzbyB1c2VycyBjYW4gc3RpbGxcbi8vIGdyYWIgdGhlIGJ1ZmZlcnMgb24gYGNsb3NlYCBldmVudFxuc2VsZi53cml0ZUJ1ZmZlciA9IFtdO3NlbGYucHJldkJ1ZmZlckxlbiA9IDA7fX07IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBGaWx0ZXJzIHVwZ3JhZGVzLCByZXR1cm5pbmcgb25seSB0aG9zZSBtYXRjaGluZyBjbGllbnQgdHJhbnNwb3J0cy5cbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHtBcnJheX0gc2VydmVyIHVwZ3JhZGVzXG4gICAgICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKi9Tb2NrZXQucHJvdG90eXBlLmZpbHRlclVwZ3JhZGVzID0gZnVuY3Rpb24odXBncmFkZXMpe3ZhciBmaWx0ZXJlZFVwZ3JhZGVzPVtdO2Zvcih2YXIgaT0wLGo9dXBncmFkZXMubGVuZ3RoO2kgPCBqO2krKykge2lmKH5pbmRleCh0aGlzLnRyYW5zcG9ydHMsdXBncmFkZXNbaV0pKWZpbHRlcmVkVXBncmFkZXMucHVzaCh1cGdyYWRlc1tpXSk7fXJldHVybiBmaWx0ZXJlZFVwZ3JhZGVzO307fSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiP3NlbGY6dHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIj93aW5kb3c6dHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIj9nbG9iYWw6e30pO30se1wiLi90cmFuc3BvcnRcIjo0LFwiLi90cmFuc3BvcnRzXCI6NSxcImNvbXBvbmVudC1lbWl0dGVyXCI6MTUsXCJkZWJ1Z1wiOjE3LFwiZW5naW5lLmlvLXBhcnNlclwiOjE5LFwiaW5kZXhvZlwiOjIzLFwicGFyc2Vqc29uXCI6MjYsXCJwYXJzZXFzXCI6MjcsXCJwYXJzZXVyaVwiOjI4fV0sNDpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7IC8qKlxuICAgICAgICAgICAgICAgICAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gICAgICAgICAgICAgICAgICovdmFyIHBhcnNlcj1fZGVyZXFfKCdlbmdpbmUuaW8tcGFyc2VyJyk7dmFyIEVtaXR0ZXI9X2RlcmVxXygnY29tcG9uZW50LWVtaXR0ZXInKTsgLyoqXG4gICAgICAgICAgICAgICAgICogTW9kdWxlIGV4cG9ydHMuXG4gICAgICAgICAgICAgICAgICovbW9kdWxlLmV4cG9ydHMgPSBUcmFuc3BvcnQ7IC8qKlxuICAgICAgICAgICAgICAgICAqIFRyYW5zcG9ydCBhYnN0cmFjdCBjb25zdHJ1Y3Rvci5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zLlxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAqL2Z1bmN0aW9uIFRyYW5zcG9ydChvcHRzKXt0aGlzLnBhdGggPSBvcHRzLnBhdGg7dGhpcy5ob3N0bmFtZSA9IG9wdHMuaG9zdG5hbWU7dGhpcy5wb3J0ID0gb3B0cy5wb3J0O3RoaXMuc2VjdXJlID0gb3B0cy5zZWN1cmU7dGhpcy5xdWVyeSA9IG9wdHMucXVlcnk7dGhpcy50aW1lc3RhbXBQYXJhbSA9IG9wdHMudGltZXN0YW1wUGFyYW07dGhpcy50aW1lc3RhbXBSZXF1ZXN0cyA9IG9wdHMudGltZXN0YW1wUmVxdWVzdHM7dGhpcy5yZWFkeVN0YXRlID0gJyc7dGhpcy5hZ2VudCA9IG9wdHMuYWdlbnQgfHwgZmFsc2U7dGhpcy5zb2NrZXQgPSBvcHRzLnNvY2tldDt0aGlzLmVuYWJsZXNYRFIgPSBvcHRzLmVuYWJsZXNYRFI7IC8vIFNTTCBvcHRpb25zIGZvciBOb2RlLmpzIGNsaWVudFxudGhpcy5wZnggPSBvcHRzLnBmeDt0aGlzLmtleSA9IG9wdHMua2V5O3RoaXMucGFzc3BocmFzZSA9IG9wdHMucGFzc3BocmFzZTt0aGlzLmNlcnQgPSBvcHRzLmNlcnQ7dGhpcy5jYSA9IG9wdHMuY2E7dGhpcy5jaXBoZXJzID0gb3B0cy5jaXBoZXJzO3RoaXMucmVqZWN0VW5hdXRob3JpemVkID0gb3B0cy5yZWplY3RVbmF1dGhvcml6ZWQ7IC8vIG90aGVyIG9wdGlvbnMgZm9yIE5vZGUuanMgY2xpZW50XG50aGlzLmV4dHJhSGVhZGVycyA9IG9wdHMuZXh0cmFIZWFkZXJzO30gLyoqXG4gICAgICAgICAgICAgICAgICogTWl4IGluIGBFbWl0dGVyYC5cbiAgICAgICAgICAgICAgICAgKi9FbWl0dGVyKFRyYW5zcG9ydC5wcm90b3R5cGUpOyAvKipcbiAgICAgICAgICAgICAgICAgKiBFbWl0cyBhbiBlcnJvci5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtUcmFuc3BvcnR9IGZvciBjaGFpbmluZ1xuICAgICAgICAgICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAgICAgICAgICovVHJhbnNwb3J0LnByb3RvdHlwZS5vbkVycm9yID0gZnVuY3Rpb24obXNnLGRlc2Mpe3ZhciBlcnI9bmV3IEVycm9yKG1zZyk7ZXJyLnR5cGUgPSAnVHJhbnNwb3J0RXJyb3InO2Vyci5kZXNjcmlwdGlvbiA9IGRlc2M7dGhpcy5lbWl0KCdlcnJvcicsZXJyKTtyZXR1cm4gdGhpczt9OyAvKipcbiAgICAgICAgICAgICAgICAgKiBPcGVucyB0aGUgdHJhbnNwb3J0LlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgKi9UcmFuc3BvcnQucHJvdG90eXBlLm9wZW4gPSBmdW5jdGlvbigpe2lmKCdjbG9zZWQnID09IHRoaXMucmVhZHlTdGF0ZSB8fCAnJyA9PSB0aGlzLnJlYWR5U3RhdGUpe3RoaXMucmVhZHlTdGF0ZSA9ICdvcGVuaW5nJzt0aGlzLmRvT3BlbigpO31yZXR1cm4gdGhpczt9OyAvKipcbiAgICAgICAgICAgICAgICAgKiBDbG9zZXMgdGhlIHRyYW5zcG9ydC5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAqL1RyYW5zcG9ydC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpe2lmKCdvcGVuaW5nJyA9PSB0aGlzLnJlYWR5U3RhdGUgfHwgJ29wZW4nID09IHRoaXMucmVhZHlTdGF0ZSl7dGhpcy5kb0Nsb3NlKCk7dGhpcy5vbkNsb3NlKCk7fXJldHVybiB0aGlzO307IC8qKlxuICAgICAgICAgICAgICAgICAqIFNlbmRzIG11bHRpcGxlIHBhY2tldHMuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBwYWNrZXRzXG4gICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICovVHJhbnNwb3J0LnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24ocGFja2V0cyl7aWYoJ29wZW4nID09IHRoaXMucmVhZHlTdGF0ZSl7dGhpcy53cml0ZShwYWNrZXRzKTt9ZWxzZSB7dGhyb3cgbmV3IEVycm9yKCdUcmFuc3BvcnQgbm90IG9wZW4nKTt9fTsgLyoqXG4gICAgICAgICAgICAgICAgICogQ2FsbGVkIHVwb24gb3BlblxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICovVHJhbnNwb3J0LnByb3RvdHlwZS5vbk9wZW4gPSBmdW5jdGlvbigpe3RoaXMucmVhZHlTdGF0ZSA9ICdvcGVuJzt0aGlzLndyaXRhYmxlID0gdHJ1ZTt0aGlzLmVtaXQoJ29wZW4nKTt9OyAvKipcbiAgICAgICAgICAgICAgICAgKiBDYWxsZWQgd2l0aCBkYXRhLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGFcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKi9UcmFuc3BvcnQucHJvdG90eXBlLm9uRGF0YSA9IGZ1bmN0aW9uKGRhdGEpe3ZhciBwYWNrZXQ9cGFyc2VyLmRlY29kZVBhY2tldChkYXRhLHRoaXMuc29ja2V0LmJpbmFyeVR5cGUpO3RoaXMub25QYWNrZXQocGFja2V0KTt9OyAvKipcbiAgICAgICAgICAgICAgICAgKiBDYWxsZWQgd2l0aCBhIGRlY29kZWQgcGFja2V0LlxuICAgICAgICAgICAgICAgICAqL1RyYW5zcG9ydC5wcm90b3R5cGUub25QYWNrZXQgPSBmdW5jdGlvbihwYWNrZXQpe3RoaXMuZW1pdCgncGFja2V0JyxwYWNrZXQpO307IC8qKlxuICAgICAgICAgICAgICAgICAqIENhbGxlZCB1cG9uIGNsb3NlLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICovVHJhbnNwb3J0LnByb3RvdHlwZS5vbkNsb3NlID0gZnVuY3Rpb24oKXt0aGlzLnJlYWR5U3RhdGUgPSAnY2xvc2VkJzt0aGlzLmVtaXQoJ2Nsb3NlJyk7fTt9LHtcImNvbXBvbmVudC1lbWl0dGVyXCI6MTUsXCJlbmdpbmUuaW8tcGFyc2VyXCI6MTl9XSw1OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oZ2xvYmFsKXsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIE1vZHVsZSBkZXBlbmRlbmNpZXNcbiAgICAgICAgICAgICAgICAgICAgICovdmFyIFhNTEh0dHBSZXF1ZXN0PV9kZXJlcV8oJ3htbGh0dHByZXF1ZXN0LXNzbCcpO3ZhciBYSFI9X2RlcmVxXygnLi9wb2xsaW5nLXhocicpO3ZhciBKU09OUD1fZGVyZXFfKCcuL3BvbGxpbmctanNvbnAnKTt2YXIgd2Vic29ja2V0PV9kZXJlcV8oJy4vd2Vic29ja2V0Jyk7IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBFeHBvcnQgdHJhbnNwb3J0cy5cbiAgICAgICAgICAgICAgICAgICAgICovZXhwb3J0cy5wb2xsaW5nID0gcG9sbGluZztleHBvcnRzLndlYnNvY2tldCA9IHdlYnNvY2tldDsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFBvbGxpbmcgdHJhbnNwb3J0IHBvbHltb3JwaGljIGNvbnN0cnVjdG9yLlxuICAgICAgICAgICAgICAgICAgICAgKiBEZWNpZGVzIG9uIHhociB2cyBqc29ucCBiYXNlZCBvbiBmZWF0dXJlIGRldGVjdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICAgICAqL2Z1bmN0aW9uIHBvbGxpbmcob3B0cyl7dmFyIHhocjt2YXIgeGQ9ZmFsc2U7dmFyIHhzPWZhbHNlO3ZhciBqc29ucD1mYWxzZSAhPT0gb3B0cy5qc29ucDtpZihnbG9iYWwubG9jYXRpb24pe3ZhciBpc1NTTD0naHR0cHM6JyA9PSBsb2NhdGlvbi5wcm90b2NvbDt2YXIgcG9ydD1sb2NhdGlvbi5wb3J0OyAvLyBzb21lIHVzZXIgYWdlbnRzIGhhdmUgZW1wdHkgYGxvY2F0aW9uLnBvcnRgXG5pZighcG9ydCl7cG9ydCA9IGlzU1NMPzQ0Mzo4MDt9eGQgPSBvcHRzLmhvc3RuYW1lICE9IGxvY2F0aW9uLmhvc3RuYW1lIHx8IHBvcnQgIT0gb3B0cy5wb3J0O3hzID0gb3B0cy5zZWN1cmUgIT0gaXNTU0w7fW9wdHMueGRvbWFpbiA9IHhkO29wdHMueHNjaGVtZSA9IHhzO3hociA9IG5ldyBYTUxIdHRwUmVxdWVzdChvcHRzKTtpZignb3BlbicgaW4geGhyICYmICFvcHRzLmZvcmNlSlNPTlApe3JldHVybiBuZXcgWEhSKG9wdHMpO31lbHNlIHtpZighanNvbnApdGhyb3cgbmV3IEVycm9yKCdKU09OUCBkaXNhYmxlZCcpO3JldHVybiBuZXcgSlNPTlAob3B0cyk7fX19KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCI/c2VsZjp0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiP3dpbmRvdzp0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiP2dsb2JhbDp7fSk7fSx7XCIuL3BvbGxpbmctanNvbnBcIjo2LFwiLi9wb2xsaW5nLXhoclwiOjcsXCIuL3dlYnNvY2tldFwiOjksXCJ4bWxodHRwcmVxdWVzdC1zc2xcIjoxMH1dLDY6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihnbG9iYWwpeyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogTW9kdWxlIHJlcXVpcmVtZW50cy5cbiAgICAgICAgICAgICAgICAgICAgICovdmFyIFBvbGxpbmc9X2RlcmVxXygnLi9wb2xsaW5nJyk7dmFyIGluaGVyaXQ9X2RlcmVxXygnY29tcG9uZW50LWluaGVyaXQnKTsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIE1vZHVsZSBleHBvcnRzLlxuICAgICAgICAgICAgICAgICAgICAgKi9tb2R1bGUuZXhwb3J0cyA9IEpTT05QUG9sbGluZzsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIENhY2hlZCByZWd1bGFyIGV4cHJlc3Npb25zLlxuICAgICAgICAgICAgICAgICAgICAgKi92YXIgck5ld2xpbmU9L1xcbi9nO3ZhciByRXNjYXBlZE5ld2xpbmU9L1xcXFxuL2c7IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBHbG9iYWwgSlNPTlAgY2FsbGJhY2tzLlxuICAgICAgICAgICAgICAgICAgICAgKi92YXIgY2FsbGJhY2tzOyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQ2FsbGJhY2tzIGNvdW50LlxuICAgICAgICAgICAgICAgICAgICAgKi92YXIgaW5kZXg9MDsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIE5vb3AuXG4gICAgICAgICAgICAgICAgICAgICAqL2Z1bmN0aW9uIGVtcHR5KCl7fSAvKipcbiAgICAgICAgICAgICAgICAgICAgICogSlNPTlAgUG9sbGluZyBjb25zdHJ1Y3Rvci5cbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdHMuXG4gICAgICAgICAgICAgICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAgICAgICAgICAgICAqL2Z1bmN0aW9uIEpTT05QUG9sbGluZyhvcHRzKXtQb2xsaW5nLmNhbGwodGhpcyxvcHRzKTt0aGlzLnF1ZXJ5ID0gdGhpcy5xdWVyeSB8fCB7fTsgLy8gZGVmaW5lIGdsb2JhbCBjYWxsYmFja3MgYXJyYXkgaWYgbm90IHByZXNlbnRcbi8vIHdlIGRvIHRoaXMgaGVyZSAobGF6aWx5KSB0byBhdm9pZCB1bm5lZWRlZCBnbG9iYWwgcG9sbHV0aW9uXG5pZighY2FsbGJhY2tzKXsgLy8gd2UgbmVlZCB0byBjb25zaWRlciBtdWx0aXBsZSBlbmdpbmVzIGluIHRoZSBzYW1lIHBhZ2VcbmlmKCFnbG9iYWwuX19fZWlvKWdsb2JhbC5fX19laW8gPSBbXTtjYWxsYmFja3MgPSBnbG9iYWwuX19fZWlvO30gLy8gY2FsbGJhY2sgaWRlbnRpZmllclxudGhpcy5pbmRleCA9IGNhbGxiYWNrcy5sZW5ndGg7IC8vIGFkZCBjYWxsYmFjayB0byBqc29ucCBnbG9iYWxcbnZhciBzZWxmPXRoaXM7Y2FsbGJhY2tzLnB1c2goZnVuY3Rpb24obXNnKXtzZWxmLm9uRGF0YShtc2cpO30pOyAvLyBhcHBlbmQgdG8gcXVlcnkgc3RyaW5nXG50aGlzLnF1ZXJ5LmogPSB0aGlzLmluZGV4OyAvLyBwcmV2ZW50IHNwdXJpb3VzIGVycm9ycyBmcm9tIGJlaW5nIGVtaXR0ZWQgd2hlbiB0aGUgd2luZG93IGlzIHVubG9hZGVkXG5pZihnbG9iYWwuZG9jdW1lbnQgJiYgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIpe2dsb2JhbC5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLGZ1bmN0aW9uKCl7aWYoc2VsZi5zY3JpcHQpc2VsZi5zY3JpcHQub25lcnJvciA9IGVtcHR5O30sZmFsc2UpO319IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBJbmhlcml0cyBmcm9tIFBvbGxpbmcuXG4gICAgICAgICAgICAgICAgICAgICAqL2luaGVyaXQoSlNPTlBQb2xsaW5nLFBvbGxpbmcpOyAvKlxuICAgICAgICAgICAgICAgICAgICAgKiBKU09OUCBvbmx5IHN1cHBvcnRzIGJpbmFyeSBhcyBiYXNlNjQgZW5jb2RlZCBzdHJpbmdzXG4gICAgICAgICAgICAgICAgICAgICAqL0pTT05QUG9sbGluZy5wcm90b3R5cGUuc3VwcG9ydHNCaW5hcnkgPSBmYWxzZTsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIENsb3NlcyB0aGUgc29ja2V0LlxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgICAgICovSlNPTlBQb2xsaW5nLnByb3RvdHlwZS5kb0Nsb3NlID0gZnVuY3Rpb24oKXtpZih0aGlzLnNjcmlwdCl7dGhpcy5zY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLnNjcmlwdCk7dGhpcy5zY3JpcHQgPSBudWxsO31pZih0aGlzLmZvcm0pe3RoaXMuZm9ybS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuZm9ybSk7dGhpcy5mb3JtID0gbnVsbDt0aGlzLmlmcmFtZSA9IG51bGw7fVBvbGxpbmcucHJvdG90eXBlLmRvQ2xvc2UuY2FsbCh0aGlzKTt9OyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogU3RhcnRzIGEgcG9sbCBjeWNsZS5cbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICAgICAqL0pTT05QUG9sbGluZy5wcm90b3R5cGUuZG9Qb2xsID0gZnVuY3Rpb24oKXt2YXIgc2VsZj10aGlzO3ZhciBzY3JpcHQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7aWYodGhpcy5zY3JpcHQpe3RoaXMuc2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5zY3JpcHQpO3RoaXMuc2NyaXB0ID0gbnVsbDt9c2NyaXB0LmFzeW5jID0gdHJ1ZTtzY3JpcHQuc3JjID0gdGhpcy51cmkoKTtzY3JpcHQub25lcnJvciA9IGZ1bmN0aW9uKGUpe3NlbGYub25FcnJvcignanNvbnAgcG9sbCBlcnJvcicsZSk7fTt2YXIgaW5zZXJ0QXQ9ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO2lmKGluc2VydEF0KXtpbnNlcnRBdC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzY3JpcHQsaW5zZXJ0QXQpO31lbHNlIHsoZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5ib2R5KS5hcHBlbmRDaGlsZChzY3JpcHQpO310aGlzLnNjcmlwdCA9IHNjcmlwdDt2YXIgaXNVQWdlY2tvPSd1bmRlZmluZWQnICE9IHR5cGVvZiBuYXZpZ2F0b3IgJiYgL2dlY2tvL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtpZihpc1VBZ2Vja28pe3NldFRpbWVvdXQoZnVuY3Rpb24oKXt2YXIgaWZyYW1lPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaWZyYW1lKTtkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGlmcmFtZSk7fSwxMDApO319OyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogV3JpdGVzIHdpdGggYSBoaWRkZW4gaWZyYW1lLlxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YSB0byBzZW5kXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxlZCB1cG9uIGZsdXNoLlxuICAgICAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgICAgICovSlNPTlBQb2xsaW5nLnByb3RvdHlwZS5kb1dyaXRlID0gZnVuY3Rpb24oZGF0YSxmbil7dmFyIHNlbGY9dGhpcztpZighdGhpcy5mb3JtKXt2YXIgZm9ybT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7dmFyIGFyZWE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTt2YXIgaWQ9dGhpcy5pZnJhbWVJZCA9ICdlaW9faWZyYW1lXycgKyB0aGlzLmluZGV4O3ZhciBpZnJhbWU7Zm9ybS5jbGFzc05hbWUgPSAnc29ja2V0aW8nO2Zvcm0uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO2Zvcm0uc3R5bGUudG9wID0gJy0xMDAwcHgnO2Zvcm0uc3R5bGUubGVmdCA9ICctMTAwMHB4Jztmb3JtLnRhcmdldCA9IGlkO2Zvcm0ubWV0aG9kID0gJ1BPU1QnO2Zvcm0uc2V0QXR0cmlidXRlKCdhY2NlcHQtY2hhcnNldCcsJ3V0Zi04Jyk7YXJlYS5uYW1lID0gJ2QnO2Zvcm0uYXBwZW5kQ2hpbGQoYXJlYSk7ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmb3JtKTt0aGlzLmZvcm0gPSBmb3JtO3RoaXMuYXJlYSA9IGFyZWE7fXRoaXMuZm9ybS5hY3Rpb24gPSB0aGlzLnVyaSgpO2Z1bmN0aW9uIGNvbXBsZXRlKCl7aW5pdElmcmFtZSgpO2ZuKCk7fWZ1bmN0aW9uIGluaXRJZnJhbWUoKXtpZihzZWxmLmlmcmFtZSl7dHJ5e3NlbGYuZm9ybS5yZW1vdmVDaGlsZChzZWxmLmlmcmFtZSk7fWNhdGNoKGUpIHtzZWxmLm9uRXJyb3IoJ2pzb25wIHBvbGxpbmcgaWZyYW1lIHJlbW92YWwgZXJyb3InLGUpO319dHJ5eyAvLyBpZTYgZHluYW1pYyBpZnJhbWVzIHdpdGggdGFyZ2V0PVwiXCIgc3VwcG9ydCAodGhhbmtzIENocmlzIExhbWJhY2hlcilcbnZhciBodG1sPSc8aWZyYW1lIHNyYz1cImphdmFzY3JpcHQ6MFwiIG5hbWU9XCInICsgc2VsZi5pZnJhbWVJZCArICdcIj4nO2lmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaHRtbCk7fWNhdGNoKGUpIHtpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtpZnJhbWUubmFtZSA9IHNlbGYuaWZyYW1lSWQ7aWZyYW1lLnNyYyA9ICdqYXZhc2NyaXB0OjAnO31pZnJhbWUuaWQgPSBzZWxmLmlmcmFtZUlkO3NlbGYuZm9ybS5hcHBlbmRDaGlsZChpZnJhbWUpO3NlbGYuaWZyYW1lID0gaWZyYW1lO31pbml0SWZyYW1lKCk7IC8vIGVzY2FwZSBcXG4gdG8gcHJldmVudCBpdCBmcm9tIGJlaW5nIGNvbnZlcnRlZCBpbnRvIFxcclxcbiBieSBzb21lIFVBc1xuLy8gZG91YmxlIGVzY2FwaW5nIGlzIHJlcXVpcmVkIGZvciBlc2NhcGVkIG5ldyBsaW5lcyBiZWNhdXNlIHVuZXNjYXBpbmcgb2YgbmV3IGxpbmVzIGNhbiBiZSBkb25lIHNhZmVseSBvbiBzZXJ2ZXItc2lkZVxuZGF0YSA9IGRhdGEucmVwbGFjZShyRXNjYXBlZE5ld2xpbmUsJ1xcXFxcXG4nKTt0aGlzLmFyZWEudmFsdWUgPSBkYXRhLnJlcGxhY2Uock5ld2xpbmUsJ1xcXFxuJyk7dHJ5e3RoaXMuZm9ybS5zdWJtaXQoKTt9Y2F0Y2goZSkge31pZih0aGlzLmlmcmFtZS5hdHRhY2hFdmVudCl7dGhpcy5pZnJhbWUub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKXtpZihzZWxmLmlmcmFtZS5yZWFkeVN0YXRlID09ICdjb21wbGV0ZScpe2NvbXBsZXRlKCk7fX07fWVsc2Uge3RoaXMuaWZyYW1lLm9ubG9hZCA9IGNvbXBsZXRlO319O30pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIj9zZWxmOnR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCI/d2luZG93OnR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCI/Z2xvYmFsOnt9KTt9LHtcIi4vcG9sbGluZ1wiOjgsXCJjb21wb25lbnQtaW5oZXJpdFwiOjE2fV0sNzpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKGdsb2JhbCl7IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBNb2R1bGUgcmVxdWlyZW1lbnRzLlxuICAgICAgICAgICAgICAgICAgICAgKi92YXIgWE1MSHR0cFJlcXVlc3Q9X2RlcmVxXygneG1saHR0cHJlcXVlc3Qtc3NsJyk7dmFyIFBvbGxpbmc9X2RlcmVxXygnLi9wb2xsaW5nJyk7dmFyIEVtaXR0ZXI9X2RlcmVxXygnY29tcG9uZW50LWVtaXR0ZXInKTt2YXIgaW5oZXJpdD1fZGVyZXFfKCdjb21wb25lbnQtaW5oZXJpdCcpO3ZhciBkZWJ1Zz1fZGVyZXFfKCdkZWJ1ZycpKCdlbmdpbmUuaW8tY2xpZW50OnBvbGxpbmcteGhyJyk7IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBNb2R1bGUgZXhwb3J0cy5cbiAgICAgICAgICAgICAgICAgICAgICovbW9kdWxlLmV4cG9ydHMgPSBYSFI7bW9kdWxlLmV4cG9ydHMuUmVxdWVzdCA9IFJlcXVlc3Q7IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBFbXB0eSBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICAgKi9mdW5jdGlvbiBlbXB0eSgpe30gLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFhIUiBQb2xsaW5nIGNvbnN0cnVjdG9yLlxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0c1xuICAgICAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAgICAgKi9mdW5jdGlvbiBYSFIob3B0cyl7UG9sbGluZy5jYWxsKHRoaXMsb3B0cyk7aWYoZ2xvYmFsLmxvY2F0aW9uKXt2YXIgaXNTU0w9J2h0dHBzOicgPT0gbG9jYXRpb24ucHJvdG9jb2w7dmFyIHBvcnQ9bG9jYXRpb24ucG9ydDsgLy8gc29tZSB1c2VyIGFnZW50cyBoYXZlIGVtcHR5IGBsb2NhdGlvbi5wb3J0YFxuaWYoIXBvcnQpe3BvcnQgPSBpc1NTTD80NDM6ODA7fXRoaXMueGQgPSBvcHRzLmhvc3RuYW1lICE9IGdsb2JhbC5sb2NhdGlvbi5ob3N0bmFtZSB8fCBwb3J0ICE9IG9wdHMucG9ydDt0aGlzLnhzID0gb3B0cy5zZWN1cmUgIT0gaXNTU0w7fWVsc2Uge3RoaXMuZXh0cmFIZWFkZXJzID0gb3B0cy5leHRyYUhlYWRlcnM7fX0gLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEluaGVyaXRzIGZyb20gUG9sbGluZy5cbiAgICAgICAgICAgICAgICAgICAgICovaW5oZXJpdChYSFIsUG9sbGluZyk7IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBYSFIgc3VwcG9ydHMgYmluYXJ5XG4gICAgICAgICAgICAgICAgICAgICAqL1hIUi5wcm90b3R5cGUuc3VwcG9ydHNCaW5hcnkgPSB0cnVlOyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQ3JlYXRlcyBhIHJlcXVlc3QuXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2RcbiAgICAgICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICAgICAqL1hIUi5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uKG9wdHMpe29wdHMgPSBvcHRzIHx8IHt9O29wdHMudXJpID0gdGhpcy51cmkoKTtvcHRzLnhkID0gdGhpcy54ZDtvcHRzLnhzID0gdGhpcy54cztvcHRzLmFnZW50ID0gdGhpcy5hZ2VudCB8fCBmYWxzZTtvcHRzLnN1cHBvcnRzQmluYXJ5ID0gdGhpcy5zdXBwb3J0c0JpbmFyeTtvcHRzLmVuYWJsZXNYRFIgPSB0aGlzLmVuYWJsZXNYRFI7IC8vIFNTTCBvcHRpb25zIGZvciBOb2RlLmpzIGNsaWVudFxub3B0cy5wZnggPSB0aGlzLnBmeDtvcHRzLmtleSA9IHRoaXMua2V5O29wdHMucGFzc3BocmFzZSA9IHRoaXMucGFzc3BocmFzZTtvcHRzLmNlcnQgPSB0aGlzLmNlcnQ7b3B0cy5jYSA9IHRoaXMuY2E7b3B0cy5jaXBoZXJzID0gdGhpcy5jaXBoZXJzO29wdHMucmVqZWN0VW5hdXRob3JpemVkID0gdGhpcy5yZWplY3RVbmF1dGhvcml6ZWQ7IC8vIG90aGVyIG9wdGlvbnMgZm9yIE5vZGUuanMgY2xpZW50XG5vcHRzLmV4dHJhSGVhZGVycyA9IHRoaXMuZXh0cmFIZWFkZXJzO3JldHVybiBuZXcgUmVxdWVzdChvcHRzKTt9OyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogU2VuZHMgZGF0YS5cbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGEgdG8gc2VuZC5cbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGVkIHVwb24gZmx1c2guXG4gICAgICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAgICAgKi9YSFIucHJvdG90eXBlLmRvV3JpdGUgPSBmdW5jdGlvbihkYXRhLGZuKXt2YXIgaXNCaW5hcnk9dHlwZW9mIGRhdGEgIT09ICdzdHJpbmcnICYmIGRhdGEgIT09IHVuZGVmaW5lZDt2YXIgcmVxPXRoaXMucmVxdWVzdCh7bWV0aG9kOidQT1NUJyxkYXRhOmRhdGEsaXNCaW5hcnk6aXNCaW5hcnl9KTt2YXIgc2VsZj10aGlzO3JlcS5vbignc3VjY2VzcycsZm4pO3JlcS5vbignZXJyb3InLGZ1bmN0aW9uKGVycil7c2VsZi5vbkVycm9yKCd4aHIgcG9zdCBlcnJvcicsZXJyKTt9KTt0aGlzLnNlbmRYaHIgPSByZXE7fTsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFN0YXJ0cyBhIHBvbGwgY3ljbGUuXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAgICAgKi9YSFIucHJvdG90eXBlLmRvUG9sbCA9IGZ1bmN0aW9uKCl7ZGVidWcoJ3hociBwb2xsJyk7dmFyIHJlcT10aGlzLnJlcXVlc3QoKTt2YXIgc2VsZj10aGlzO3JlcS5vbignZGF0YScsZnVuY3Rpb24oZGF0YSl7c2VsZi5vbkRhdGEoZGF0YSk7fSk7cmVxLm9uKCdlcnJvcicsZnVuY3Rpb24oZXJyKXtzZWxmLm9uRXJyb3IoJ3hociBwb2xsIGVycm9yJyxlcnIpO30pO3RoaXMucG9sbFhociA9IHJlcTt9OyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogUmVxdWVzdCBjb25zdHJ1Y3RvclxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAgICAgKi9mdW5jdGlvbiBSZXF1ZXN0KG9wdHMpe3RoaXMubWV0aG9kID0gb3B0cy5tZXRob2QgfHwgJ0dFVCc7dGhpcy51cmkgPSBvcHRzLnVyaTt0aGlzLnhkID0gISFvcHRzLnhkO3RoaXMueHMgPSAhIW9wdHMueHM7dGhpcy5hc3luYyA9IGZhbHNlICE9PSBvcHRzLmFzeW5jO3RoaXMuZGF0YSA9IHVuZGVmaW5lZCAhPSBvcHRzLmRhdGE/b3B0cy5kYXRhOm51bGw7dGhpcy5hZ2VudCA9IG9wdHMuYWdlbnQ7dGhpcy5pc0JpbmFyeSA9IG9wdHMuaXNCaW5hcnk7dGhpcy5zdXBwb3J0c0JpbmFyeSA9IG9wdHMuc3VwcG9ydHNCaW5hcnk7dGhpcy5lbmFibGVzWERSID0gb3B0cy5lbmFibGVzWERSOyAvLyBTU0wgb3B0aW9ucyBmb3IgTm9kZS5qcyBjbGllbnRcbnRoaXMucGZ4ID0gb3B0cy5wZng7dGhpcy5rZXkgPSBvcHRzLmtleTt0aGlzLnBhc3NwaHJhc2UgPSBvcHRzLnBhc3NwaHJhc2U7dGhpcy5jZXJ0ID0gb3B0cy5jZXJ0O3RoaXMuY2EgPSBvcHRzLmNhO3RoaXMuY2lwaGVycyA9IG9wdHMuY2lwaGVyczt0aGlzLnJlamVjdFVuYXV0aG9yaXplZCA9IG9wdHMucmVqZWN0VW5hdXRob3JpemVkOyAvLyBvdGhlciBvcHRpb25zIGZvciBOb2RlLmpzIGNsaWVudFxudGhpcy5leHRyYUhlYWRlcnMgPSBvcHRzLmV4dHJhSGVhZGVyczt0aGlzLmNyZWF0ZSgpO30gLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIE1peCBpbiBgRW1pdHRlcmAuXG4gICAgICAgICAgICAgICAgICAgICAqL0VtaXR0ZXIoUmVxdWVzdC5wcm90b3R5cGUpOyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQ3JlYXRlcyB0aGUgWEhSIG9iamVjdCBhbmQgc2VuZHMgdGhlIHJlcXVlc3QuXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAgICAgKi9SZXF1ZXN0LnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbigpe3ZhciBvcHRzPXthZ2VudDp0aGlzLmFnZW50LHhkb21haW46dGhpcy54ZCx4c2NoZW1lOnRoaXMueHMsZW5hYmxlc1hEUjp0aGlzLmVuYWJsZXNYRFJ9OyAvLyBTU0wgb3B0aW9ucyBmb3IgTm9kZS5qcyBjbGllbnRcbm9wdHMucGZ4ID0gdGhpcy5wZng7b3B0cy5rZXkgPSB0aGlzLmtleTtvcHRzLnBhc3NwaHJhc2UgPSB0aGlzLnBhc3NwaHJhc2U7b3B0cy5jZXJ0ID0gdGhpcy5jZXJ0O29wdHMuY2EgPSB0aGlzLmNhO29wdHMuY2lwaGVycyA9IHRoaXMuY2lwaGVycztvcHRzLnJlamVjdFVuYXV0aG9yaXplZCA9IHRoaXMucmVqZWN0VW5hdXRob3JpemVkO29wdHMudHJhbnNwb3J0cyA9IFtcInhoci1wb2xsaW5nXCJdO3ZhciB4aHI9dGhpcy54aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3Qob3B0cyk7dmFyIHNlbGY9dGhpczt0cnl7ZGVidWcoJ3hociBvcGVuICVzOiAlcycsdGhpcy5tZXRob2QsdGhpcy51cmkpO3hoci5vcGVuKHRoaXMubWV0aG9kLHRoaXMudXJpLHRoaXMuYXN5bmMpO3RyeXtpZih0aGlzLmV4dHJhSGVhZGVycyl7eGhyLnNldERpc2FibGVIZWFkZXJDaGVjayh0cnVlKTtmb3IodmFyIGkgaW4gdGhpcy5leHRyYUhlYWRlcnMpIHtpZih0aGlzLmV4dHJhSGVhZGVycy5oYXNPd25Qcm9wZXJ0eShpKSl7eGhyLnNldFJlcXVlc3RIZWFkZXIoaSx0aGlzLmV4dHJhSGVhZGVyc1tpXSk7fX19fWNhdGNoKGUpIHt9aWYodGhpcy5zdXBwb3J0c0JpbmFyeSl7IC8vIFRoaXMgaGFzIHRvIGJlIGRvbmUgYWZ0ZXIgb3BlbiBiZWNhdXNlIEZpcmVmb3ggaXMgc3R1cGlkXG4vLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEzMjE2OTAzL2dldC1iaW5hcnktZGF0YS13aXRoLXhtbGh0dHByZXF1ZXN0LWluLWEtZmlyZWZveC1leHRlbnNpb25cbnhoci5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO31pZignUE9TVCcgPT0gdGhpcy5tZXRob2Qpe3RyeXtpZih0aGlzLmlzQmluYXJ5KXt4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJyk7fWVsc2Uge3hoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKTt9fWNhdGNoKGUpIHt9fSAvLyBpZTYgY2hlY2tcbmlmKCd3aXRoQ3JlZGVudGlhbHMnIGluIHhocil7eGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7fWlmKHRoaXMuaGFzWERSKCkpe3hoci5vbmxvYWQgPSBmdW5jdGlvbigpe3NlbGYub25Mb2FkKCk7fTt4aHIub25lcnJvciA9IGZ1bmN0aW9uKCl7c2VsZi5vbkVycm9yKHhoci5yZXNwb25zZVRleHQpO307fWVsc2Uge3hoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpe2lmKDQgIT0geGhyLnJlYWR5U3RhdGUpcmV0dXJuO2lmKDIwMCA9PSB4aHIuc3RhdHVzIHx8IDEyMjMgPT0geGhyLnN0YXR1cyl7c2VsZi5vbkxvYWQoKTt9ZWxzZSB7IC8vIG1ha2Ugc3VyZSB0aGUgYGVycm9yYCBldmVudCBoYW5kbGVyIHRoYXQncyB1c2VyLXNldFxuLy8gZG9lcyBub3QgdGhyb3cgaW4gdGhlIHNhbWUgdGljayBhbmQgZ2V0cyBjYXVnaHQgaGVyZVxuc2V0VGltZW91dChmdW5jdGlvbigpe3NlbGYub25FcnJvcih4aHIuc3RhdHVzKTt9LDApO319O31kZWJ1ZygneGhyIGRhdGEgJXMnLHRoaXMuZGF0YSk7eGhyLnNlbmQodGhpcy5kYXRhKTt9Y2F0Y2goZSkgeyAvLyBOZWVkIHRvIGRlZmVyIHNpbmNlIC5jcmVhdGUoKSBpcyBjYWxsZWQgZGlyZWN0bHkgZmhyb20gdGhlIGNvbnN0cnVjdG9yXG4vLyBhbmQgdGh1cyB0aGUgJ2Vycm9yJyBldmVudCBjYW4gb25seSBiZSBvbmx5IGJvdW5kICphZnRlciogdGhpcyBleGNlcHRpb25cbi8vIG9jY3Vycy4gIFRoZXJlZm9yZSwgYWxzbywgd2UgY2Fubm90IHRocm93IGhlcmUgYXQgYWxsLlxuc2V0VGltZW91dChmdW5jdGlvbigpe3NlbGYub25FcnJvcihlKTt9LDApO3JldHVybjt9aWYoZ2xvYmFsLmRvY3VtZW50KXt0aGlzLmluZGV4ID0gUmVxdWVzdC5yZXF1ZXN0c0NvdW50Kys7UmVxdWVzdC5yZXF1ZXN0c1t0aGlzLmluZGV4XSA9IHRoaXM7fX07IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBDYWxsZWQgdXBvbiBzdWNjZXNzZnVsIHJlc3BvbnNlLlxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgICAgICovUmVxdWVzdC5wcm90b3R5cGUub25TdWNjZXNzID0gZnVuY3Rpb24oKXt0aGlzLmVtaXQoJ3N1Y2Nlc3MnKTt0aGlzLmNsZWFudXAoKTt9OyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQ2FsbGVkIGlmIHdlIGhhdmUgZGF0YS5cbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICAgICAqL1JlcXVlc3QucHJvdG90eXBlLm9uRGF0YSA9IGZ1bmN0aW9uKGRhdGEpe3RoaXMuZW1pdCgnZGF0YScsZGF0YSk7dGhpcy5vblN1Y2Nlc3MoKTt9OyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQ2FsbGVkIHVwb24gZXJyb3IuXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAgICAgKi9SZXF1ZXN0LnByb3RvdHlwZS5vbkVycm9yID0gZnVuY3Rpb24oZXJyKXt0aGlzLmVtaXQoJ2Vycm9yJyxlcnIpO3RoaXMuY2xlYW51cCh0cnVlKTt9OyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQ2xlYW5zIHVwIGhvdXNlLlxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgICAgICovUmVxdWVzdC5wcm90b3R5cGUuY2xlYW51cCA9IGZ1bmN0aW9uKGZyb21FcnJvcil7aWYoJ3VuZGVmaW5lZCcgPT0gdHlwZW9mIHRoaXMueGhyIHx8IG51bGwgPT09IHRoaXMueGhyKXtyZXR1cm47fSAvLyB4bWxodHRwcmVxdWVzdFxuaWYodGhpcy5oYXNYRFIoKSl7dGhpcy54aHIub25sb2FkID0gdGhpcy54aHIub25lcnJvciA9IGVtcHR5O31lbHNlIHt0aGlzLnhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBlbXB0eTt9aWYoZnJvbUVycm9yKXt0cnl7dGhpcy54aHIuYWJvcnQoKTt9Y2F0Y2goZSkge319aWYoZ2xvYmFsLmRvY3VtZW50KXtkZWxldGUgUmVxdWVzdC5yZXF1ZXN0c1t0aGlzLmluZGV4XTt9dGhpcy54aHIgPSBudWxsO307IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBDYWxsZWQgdXBvbiBsb2FkLlxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgICAgICovUmVxdWVzdC5wcm90b3R5cGUub25Mb2FkID0gZnVuY3Rpb24oKXt2YXIgZGF0YTt0cnl7dmFyIGNvbnRlbnRUeXBlO3RyeXtjb250ZW50VHlwZSA9IHRoaXMueGhyLmdldFJlc3BvbnNlSGVhZGVyKCdDb250ZW50LVR5cGUnKS5zcGxpdCgnOycpWzBdO31jYXRjaChlKSB7fWlmKGNvbnRlbnRUeXBlID09PSAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJyl7ZGF0YSA9IHRoaXMueGhyLnJlc3BvbnNlO31lbHNlIHtpZighdGhpcy5zdXBwb3J0c0JpbmFyeSl7ZGF0YSA9IHRoaXMueGhyLnJlc3BvbnNlVGV4dDt9ZWxzZSB7dHJ5e2RhdGEgPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsbmV3IFVpbnQ4QXJyYXkodGhpcy54aHIucmVzcG9uc2UpKTt9Y2F0Y2goZSkge3ZhciB1aThBcnI9bmV3IFVpbnQ4QXJyYXkodGhpcy54aHIucmVzcG9uc2UpO3ZhciBkYXRhQXJyYXk9W107Zm9yKHZhciBpZHg9MCxsZW5ndGg9dWk4QXJyLmxlbmd0aDtpZHggPCBsZW5ndGg7aWR4KyspIHtkYXRhQXJyYXkucHVzaCh1aThBcnJbaWR4XSk7fWRhdGEgPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsZGF0YUFycmF5KTt9fX19Y2F0Y2goZSkge3RoaXMub25FcnJvcihlKTt9aWYobnVsbCAhPSBkYXRhKXt0aGlzLm9uRGF0YShkYXRhKTt9fTsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIENoZWNrIGlmIGl0IGhhcyBYRG9tYWluUmVxdWVzdC5cbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICAgICAqL1JlcXVlc3QucHJvdG90eXBlLmhhc1hEUiA9IGZ1bmN0aW9uKCl7cmV0dXJuICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZ2xvYmFsLlhEb21haW5SZXF1ZXN0ICYmICF0aGlzLnhzICYmIHRoaXMuZW5hYmxlc1hEUjt9OyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQWJvcnRzIHRoZSByZXF1ZXN0LlxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAgICAgKi9SZXF1ZXN0LnByb3RvdHlwZS5hYm9ydCA9IGZ1bmN0aW9uKCl7dGhpcy5jbGVhbnVwKCk7fTsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEFib3J0cyBwZW5kaW5nIHJlcXVlc3RzIHdoZW4gdW5sb2FkaW5nIHRoZSB3aW5kb3cuIFRoaXMgaXMgbmVlZGVkIHRvIHByZXZlbnRcbiAgICAgICAgICAgICAgICAgICAgICogbWVtb3J5IGxlYWtzIChlLmcuIHdoZW4gdXNpbmcgSUUpIGFuZCB0byBlbnN1cmUgdGhhdCBubyBzcHVyaW91cyBlcnJvciBpc1xuICAgICAgICAgICAgICAgICAgICAgKiBlbWl0dGVkLlxuICAgICAgICAgICAgICAgICAgICAgKi9pZihnbG9iYWwuZG9jdW1lbnQpe1JlcXVlc3QucmVxdWVzdHNDb3VudCA9IDA7UmVxdWVzdC5yZXF1ZXN0cyA9IHt9O2lmKGdsb2JhbC5hdHRhY2hFdmVudCl7Z2xvYmFsLmF0dGFjaEV2ZW50KCdvbnVubG9hZCcsdW5sb2FkSGFuZGxlcik7fWVsc2UgaWYoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIpe2dsb2JhbC5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLHVubG9hZEhhbmRsZXIsZmFsc2UpO319ZnVuY3Rpb24gdW5sb2FkSGFuZGxlcigpe2Zvcih2YXIgaSBpbiBSZXF1ZXN0LnJlcXVlc3RzKSB7aWYoUmVxdWVzdC5yZXF1ZXN0cy5oYXNPd25Qcm9wZXJ0eShpKSl7UmVxdWVzdC5yZXF1ZXN0c1tpXS5hYm9ydCgpO319fX0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIj9zZWxmOnR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCI/d2luZG93OnR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCI/Z2xvYmFsOnt9KTt9LHtcIi4vcG9sbGluZ1wiOjgsXCJjb21wb25lbnQtZW1pdHRlclwiOjE1LFwiY29tcG9uZW50LWluaGVyaXRcIjoxNixcImRlYnVnXCI6MTcsXCJ4bWxodHRwcmVxdWVzdC1zc2xcIjoxMH1dLDg6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpeyAvKipcbiAgICAgICAgICAgICAgICAgKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICAgICAgICAgICAgICAgICAqL3ZhciBUcmFuc3BvcnQ9X2RlcmVxXygnLi4vdHJhbnNwb3J0Jyk7dmFyIHBhcnNlcXM9X2RlcmVxXygncGFyc2VxcycpO3ZhciBwYXJzZXI9X2RlcmVxXygnZW5naW5lLmlvLXBhcnNlcicpO3ZhciBpbmhlcml0PV9kZXJlcV8oJ2NvbXBvbmVudC1pbmhlcml0Jyk7dmFyIHllYXN0PV9kZXJlcV8oJ3llYXN0Jyk7dmFyIGRlYnVnPV9kZXJlcV8oJ2RlYnVnJykoJ2VuZ2luZS5pby1jbGllbnQ6cG9sbGluZycpOyAvKipcbiAgICAgICAgICAgICAgICAgKiBNb2R1bGUgZXhwb3J0cy5cbiAgICAgICAgICAgICAgICAgKi9tb2R1bGUuZXhwb3J0cyA9IFBvbGxpbmc7IC8qKlxuICAgICAgICAgICAgICAgICAqIElzIFhIUjIgc3VwcG9ydGVkP1xuICAgICAgICAgICAgICAgICAqL3ZhciBoYXNYSFIyPShmdW5jdGlvbigpe3ZhciBYTUxIdHRwUmVxdWVzdD1fZGVyZXFfKCd4bWxodHRwcmVxdWVzdC1zc2wnKTt2YXIgeGhyPW5ldyBYTUxIdHRwUmVxdWVzdCh7eGRvbWFpbjpmYWxzZX0pO3JldHVybiBudWxsICE9IHhoci5yZXNwb25zZVR5cGU7fSkoKTsgLyoqXG4gICAgICAgICAgICAgICAgICogUG9sbGluZyBpbnRlcmZhY2UuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0c1xuICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAqL2Z1bmN0aW9uIFBvbGxpbmcob3B0cyl7dmFyIGZvcmNlQmFzZTY0PW9wdHMgJiYgb3B0cy5mb3JjZUJhc2U2NDtpZighaGFzWEhSMiB8fCBmb3JjZUJhc2U2NCl7dGhpcy5zdXBwb3J0c0JpbmFyeSA9IGZhbHNlO31UcmFuc3BvcnQuY2FsbCh0aGlzLG9wdHMpO30gLyoqXG4gICAgICAgICAgICAgICAgICogSW5oZXJpdHMgZnJvbSBUcmFuc3BvcnQuXG4gICAgICAgICAgICAgICAgICovaW5oZXJpdChQb2xsaW5nLFRyYW5zcG9ydCk7IC8qKlxuICAgICAgICAgICAgICAgICAqIFRyYW5zcG9ydCBuYW1lLlxuICAgICAgICAgICAgICAgICAqL1BvbGxpbmcucHJvdG90eXBlLm5hbWUgPSAncG9sbGluZyc7IC8qKlxuICAgICAgICAgICAgICAgICAqIE9wZW5zIHRoZSBzb2NrZXQgKHRyaWdnZXJzIHBvbGxpbmcpLiBXZSB3cml0ZSBhIFBJTkcgbWVzc2FnZSB0byBkZXRlcm1pbmVcbiAgICAgICAgICAgICAgICAgKiB3aGVuIHRoZSB0cmFuc3BvcnQgaXMgb3Blbi5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAqL1BvbGxpbmcucHJvdG90eXBlLmRvT3BlbiA9IGZ1bmN0aW9uKCl7dGhpcy5wb2xsKCk7fTsgLyoqXG4gICAgICAgICAgICAgICAgICogUGF1c2VzIHBvbGxpbmcuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayB1cG9uIGJ1ZmZlcnMgYXJlIGZsdXNoZWQgYW5kIHRyYW5zcG9ydCBpcyBwYXVzZWRcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKi9Qb2xsaW5nLnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uKG9uUGF1c2Upe3ZhciBwZW5kaW5nPTA7dmFyIHNlbGY9dGhpczt0aGlzLnJlYWR5U3RhdGUgPSAncGF1c2luZyc7ZnVuY3Rpb24gcGF1c2UoKXtkZWJ1ZygncGF1c2VkJyk7c2VsZi5yZWFkeVN0YXRlID0gJ3BhdXNlZCc7b25QYXVzZSgpO31pZih0aGlzLnBvbGxpbmcgfHwgIXRoaXMud3JpdGFibGUpe3ZhciB0b3RhbD0wO2lmKHRoaXMucG9sbGluZyl7ZGVidWcoJ3dlIGFyZSBjdXJyZW50bHkgcG9sbGluZyAtIHdhaXRpbmcgdG8gcGF1c2UnKTt0b3RhbCsrO3RoaXMub25jZSgncG9sbENvbXBsZXRlJyxmdW5jdGlvbigpe2RlYnVnKCdwcmUtcGF1c2UgcG9sbGluZyBjb21wbGV0ZScpOy0tdG90YWwgfHwgcGF1c2UoKTt9KTt9aWYoIXRoaXMud3JpdGFibGUpe2RlYnVnKCd3ZSBhcmUgY3VycmVudGx5IHdyaXRpbmcgLSB3YWl0aW5nIHRvIHBhdXNlJyk7dG90YWwrKzt0aGlzLm9uY2UoJ2RyYWluJyxmdW5jdGlvbigpe2RlYnVnKCdwcmUtcGF1c2Ugd3JpdGluZyBjb21wbGV0ZScpOy0tdG90YWwgfHwgcGF1c2UoKTt9KTt9fWVsc2Uge3BhdXNlKCk7fX07IC8qKlxuICAgICAgICAgICAgICAgICAqIFN0YXJ0cyBwb2xsaW5nIGN5Y2xlLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgKi9Qb2xsaW5nLnByb3RvdHlwZS5wb2xsID0gZnVuY3Rpb24oKXtkZWJ1ZygncG9sbGluZycpO3RoaXMucG9sbGluZyA9IHRydWU7dGhpcy5kb1BvbGwoKTt0aGlzLmVtaXQoJ3BvbGwnKTt9OyAvKipcbiAgICAgICAgICAgICAgICAgKiBPdmVybG9hZHMgb25EYXRhIHRvIGRldGVjdCBwYXlsb2Fkcy5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAqL1BvbGxpbmcucHJvdG90eXBlLm9uRGF0YSA9IGZ1bmN0aW9uKGRhdGEpe3ZhciBzZWxmPXRoaXM7ZGVidWcoJ3BvbGxpbmcgZ290IGRhdGEgJXMnLGRhdGEpO3ZhciBjYWxsYmFjaz1mdW5jdGlvbiBjYWxsYmFjayhwYWNrZXQsaW5kZXgsdG90YWwpeyAvLyBpZiBpdHMgdGhlIGZpcnN0IG1lc3NhZ2Ugd2UgY29uc2lkZXIgdGhlIHRyYW5zcG9ydCBvcGVuXG5pZignb3BlbmluZycgPT0gc2VsZi5yZWFkeVN0YXRlKXtzZWxmLm9uT3BlbigpO30gLy8gaWYgaXRzIGEgY2xvc2UgcGFja2V0LCB3ZSBjbG9zZSB0aGUgb25nb2luZyByZXF1ZXN0c1xuaWYoJ2Nsb3NlJyA9PSBwYWNrZXQudHlwZSl7c2VsZi5vbkNsb3NlKCk7cmV0dXJuIGZhbHNlO30gLy8gb3RoZXJ3aXNlIGJ5cGFzcyBvbkRhdGEgYW5kIGhhbmRsZSB0aGUgbWVzc2FnZVxuc2VsZi5vblBhY2tldChwYWNrZXQpO307IC8vIGRlY29kZSBwYXlsb2FkXG5wYXJzZXIuZGVjb2RlUGF5bG9hZChkYXRhLHRoaXMuc29ja2V0LmJpbmFyeVR5cGUsY2FsbGJhY2spOyAvLyBpZiBhbiBldmVudCBkaWQgbm90IHRyaWdnZXIgY2xvc2luZ1xuaWYoJ2Nsb3NlZCcgIT0gdGhpcy5yZWFkeVN0YXRlKXsgLy8gaWYgd2UgZ290IGRhdGEgd2UncmUgbm90IHBvbGxpbmdcbnRoaXMucG9sbGluZyA9IGZhbHNlO3RoaXMuZW1pdCgncG9sbENvbXBsZXRlJyk7aWYoJ29wZW4nID09IHRoaXMucmVhZHlTdGF0ZSl7dGhpcy5wb2xsKCk7fWVsc2Uge2RlYnVnKCdpZ25vcmluZyBwb2xsIC0gdHJhbnNwb3J0IHN0YXRlIFwiJXNcIicsdGhpcy5yZWFkeVN0YXRlKTt9fX07IC8qKlxuICAgICAgICAgICAgICAgICAqIEZvciBwb2xsaW5nLCBzZW5kIGEgY2xvc2UgcGFja2V0LlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICovUG9sbGluZy5wcm90b3R5cGUuZG9DbG9zZSA9IGZ1bmN0aW9uKCl7dmFyIHNlbGY9dGhpcztmdW5jdGlvbiBjbG9zZSgpe2RlYnVnKCd3cml0aW5nIGNsb3NlIHBhY2tldCcpO3NlbGYud3JpdGUoW3t0eXBlOidjbG9zZSd9XSk7fWlmKCdvcGVuJyA9PSB0aGlzLnJlYWR5U3RhdGUpe2RlYnVnKCd0cmFuc3BvcnQgb3BlbiAtIGNsb3NpbmcnKTtjbG9zZSgpO31lbHNlIHsgLy8gaW4gY2FzZSB3ZSdyZSB0cnlpbmcgdG8gY2xvc2Ugd2hpbGVcbi8vIGhhbmRzaGFraW5nIGlzIGluIHByb2dyZXNzIChHSC0xNjQpXG5kZWJ1ZygndHJhbnNwb3J0IG5vdCBvcGVuIC0gZGVmZXJyaW5nIGNsb3NlJyk7dGhpcy5vbmNlKCdvcGVuJyxjbG9zZSk7fX07IC8qKlxuICAgICAgICAgICAgICAgICAqIFdyaXRlcyBhIHBhY2tldHMgcGF5bG9hZC5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7QXJyYXl9IGRhdGEgcGFja2V0c1xuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGRyYWluIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICovUG9sbGluZy5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihwYWNrZXRzKXt2YXIgc2VsZj10aGlzO3RoaXMud3JpdGFibGUgPSBmYWxzZTt2YXIgY2FsbGJhY2tmbj1mdW5jdGlvbiBjYWxsYmFja2ZuKCl7c2VsZi53cml0YWJsZSA9IHRydWU7c2VsZi5lbWl0KCdkcmFpbicpO307dmFyIHNlbGY9dGhpcztwYXJzZXIuZW5jb2RlUGF5bG9hZChwYWNrZXRzLHRoaXMuc3VwcG9ydHNCaW5hcnksZnVuY3Rpb24oZGF0YSl7c2VsZi5kb1dyaXRlKGRhdGEsY2FsbGJhY2tmbik7fSk7fTsgLyoqXG4gICAgICAgICAgICAgICAgICogR2VuZXJhdGVzIHVyaSBmb3IgY29ubmVjdGlvbi5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAqL1BvbGxpbmcucHJvdG90eXBlLnVyaSA9IGZ1bmN0aW9uKCl7dmFyIHF1ZXJ5PXRoaXMucXVlcnkgfHwge307dmFyIHNjaGVtYT10aGlzLnNlY3VyZT8naHR0cHMnOidodHRwJzt2YXIgcG9ydD0nJzsgLy8gY2FjaGUgYnVzdGluZyBpcyBmb3JjZWRcbmlmKGZhbHNlICE9PSB0aGlzLnRpbWVzdGFtcFJlcXVlc3RzKXtxdWVyeVt0aGlzLnRpbWVzdGFtcFBhcmFtXSA9IHllYXN0KCk7fWlmKCF0aGlzLnN1cHBvcnRzQmluYXJ5ICYmICFxdWVyeS5zaWQpe3F1ZXJ5LmI2NCA9IDE7fXF1ZXJ5ID0gcGFyc2Vxcy5lbmNvZGUocXVlcnkpOyAvLyBhdm9pZCBwb3J0IGlmIGRlZmF1bHQgZm9yIHNjaGVtYVxuaWYodGhpcy5wb3J0ICYmICgnaHR0cHMnID09IHNjaGVtYSAmJiB0aGlzLnBvcnQgIT0gNDQzIHx8ICdodHRwJyA9PSBzY2hlbWEgJiYgdGhpcy5wb3J0ICE9IDgwKSl7cG9ydCA9ICc6JyArIHRoaXMucG9ydDt9IC8vIHByZXBlbmQgPyB0byBxdWVyeVxuaWYocXVlcnkubGVuZ3RoKXtxdWVyeSA9ICc/JyArIHF1ZXJ5O312YXIgaXB2Nj10aGlzLmhvc3RuYW1lLmluZGV4T2YoJzonKSAhPT0gLTE7cmV0dXJuIHNjaGVtYSArICc6Ly8nICsgKGlwdjY/J1snICsgdGhpcy5ob3N0bmFtZSArICddJzp0aGlzLmhvc3RuYW1lKSArIHBvcnQgKyB0aGlzLnBhdGggKyBxdWVyeTt9O30se1wiLi4vdHJhbnNwb3J0XCI6NCxcImNvbXBvbmVudC1pbmhlcml0XCI6MTYsXCJkZWJ1Z1wiOjE3LFwiZW5naW5lLmlvLXBhcnNlclwiOjE5LFwicGFyc2Vxc1wiOjI3LFwieG1saHR0cHJlcXVlc3Qtc3NsXCI6MTAsXCJ5ZWFzdFwiOjMwfV0sOTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKGdsb2JhbCl7IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICAgICAgICAgICAgICAgICAgICAgKi92YXIgVHJhbnNwb3J0PV9kZXJlcV8oJy4uL3RyYW5zcG9ydCcpO3ZhciBwYXJzZXI9X2RlcmVxXygnZW5naW5lLmlvLXBhcnNlcicpO3ZhciBwYXJzZXFzPV9kZXJlcV8oJ3BhcnNlcXMnKTt2YXIgaW5oZXJpdD1fZGVyZXFfKCdjb21wb25lbnQtaW5oZXJpdCcpO3ZhciB5ZWFzdD1fZGVyZXFfKCd5ZWFzdCcpO3ZhciBkZWJ1Zz1fZGVyZXFfKCdkZWJ1ZycpKCdlbmdpbmUuaW8tY2xpZW50OndlYnNvY2tldCcpO3ZhciBCcm93c2VyV2ViU29ja2V0PWdsb2JhbC5XZWJTb2NrZXQgfHwgZ2xvYmFsLk1veldlYlNvY2tldDsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEdldCBlaXRoZXIgdGhlIGBXZWJTb2NrZXRgIG9yIGBNb3pXZWJTb2NrZXRgIGdsb2JhbHNcbiAgICAgICAgICAgICAgICAgICAgICogaW4gdGhlIGJyb3dzZXIgb3IgdGhlIFdlYlNvY2tldC1jb21wYXRpYmxlIGludGVyZmFjZVxuICAgICAgICAgICAgICAgICAgICAgKiBleHBvc2VkIGJ5IGB3c2AgZm9yIE5vZGUgZW52aXJvbm1lbnQuXG4gICAgICAgICAgICAgICAgICAgICAqL3ZhciBXZWJTb2NrZXQ9QnJvd3NlcldlYlNvY2tldCB8fCAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc/bnVsbDpfZGVyZXFfKCd3cycpKTsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIE1vZHVsZSBleHBvcnRzLlxuICAgICAgICAgICAgICAgICAgICAgKi9tb2R1bGUuZXhwb3J0cyA9IFdTOyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogV2ViU29ja2V0IHRyYW5zcG9ydCBjb25zdHJ1Y3Rvci5cbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQGFwaSB7T2JqZWN0fSBjb25uZWN0aW9uIG9wdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgICAgICovZnVuY3Rpb24gV1Mob3B0cyl7dmFyIGZvcmNlQmFzZTY0PW9wdHMgJiYgb3B0cy5mb3JjZUJhc2U2NDtpZihmb3JjZUJhc2U2NCl7dGhpcy5zdXBwb3J0c0JpbmFyeSA9IGZhbHNlO310aGlzLnBlck1lc3NhZ2VEZWZsYXRlID0gb3B0cy5wZXJNZXNzYWdlRGVmbGF0ZTtUcmFuc3BvcnQuY2FsbCh0aGlzLG9wdHMpO30gLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEluaGVyaXRzIGZyb20gVHJhbnNwb3J0LlxuICAgICAgICAgICAgICAgICAgICAgKi9pbmhlcml0KFdTLFRyYW5zcG9ydCk7IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBUcmFuc3BvcnQgbmFtZS5cbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgICAgICovV1MucHJvdG90eXBlLm5hbWUgPSAnd2Vic29ja2V0JzsgLypcbiAgICAgICAgICAgICAgICAgICAgICogV2ViU29ja2V0cyBzdXBwb3J0IGJpbmFyeVxuICAgICAgICAgICAgICAgICAgICAgKi9XUy5wcm90b3R5cGUuc3VwcG9ydHNCaW5hcnkgPSB0cnVlOyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogT3BlbnMgc29ja2V0LlxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgICAgICovV1MucHJvdG90eXBlLmRvT3BlbiA9IGZ1bmN0aW9uKCl7aWYoIXRoaXMuY2hlY2soKSl7IC8vIGxldCBwcm9iZSB0aW1lb3V0XG5yZXR1cm47fXZhciBzZWxmPXRoaXM7dmFyIHVyaT10aGlzLnVyaSgpO3ZhciBwcm90b2NvbHM9dm9pZCAwO3ZhciBvcHRzPXthZ2VudDp0aGlzLmFnZW50LHBlck1lc3NhZ2VEZWZsYXRlOnRoaXMucGVyTWVzc2FnZURlZmxhdGV9OyAvLyBTU0wgb3B0aW9ucyBmb3IgTm9kZS5qcyBjbGllbnRcbm9wdHMucGZ4ID0gdGhpcy5wZng7b3B0cy5rZXkgPSB0aGlzLmtleTtvcHRzLnBhc3NwaHJhc2UgPSB0aGlzLnBhc3NwaHJhc2U7b3B0cy5jZXJ0ID0gdGhpcy5jZXJ0O29wdHMuY2EgPSB0aGlzLmNhO29wdHMuY2lwaGVycyA9IHRoaXMuY2lwaGVycztvcHRzLnJlamVjdFVuYXV0aG9yaXplZCA9IHRoaXMucmVqZWN0VW5hdXRob3JpemVkO2lmKHRoaXMuZXh0cmFIZWFkZXJzKXtvcHRzLmhlYWRlcnMgPSB0aGlzLmV4dHJhSGVhZGVyczt9dGhpcy53cyA9IEJyb3dzZXJXZWJTb2NrZXQ/bmV3IFdlYlNvY2tldCh1cmkpOm5ldyBXZWJTb2NrZXQodXJpLHByb3RvY29scyxvcHRzKTtpZih0aGlzLndzLmJpbmFyeVR5cGUgPT09IHVuZGVmaW5lZCl7dGhpcy5zdXBwb3J0c0JpbmFyeSA9IGZhbHNlO31pZih0aGlzLndzLnN1cHBvcnRzICYmIHRoaXMud3Muc3VwcG9ydHMuYmluYXJ5KXt0aGlzLnN1cHBvcnRzQmluYXJ5ID0gdHJ1ZTt0aGlzLndzLmJpbmFyeVR5cGUgPSAnYnVmZmVyJzt9ZWxzZSB7dGhpcy53cy5iaW5hcnlUeXBlID0gJ2FycmF5YnVmZmVyJzt9dGhpcy5hZGRFdmVudExpc3RlbmVycygpO307IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBBZGRzIGV2ZW50IGxpc3RlbmVycyB0byB0aGUgc29ja2V0XG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAgICAgKi9XUy5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcnMgPSBmdW5jdGlvbigpe3ZhciBzZWxmPXRoaXM7dGhpcy53cy5vbm9wZW4gPSBmdW5jdGlvbigpe3NlbGYub25PcGVuKCk7fTt0aGlzLndzLm9uY2xvc2UgPSBmdW5jdGlvbigpe3NlbGYub25DbG9zZSgpO307dGhpcy53cy5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldil7c2VsZi5vbkRhdGEoZXYuZGF0YSk7fTt0aGlzLndzLm9uZXJyb3IgPSBmdW5jdGlvbihlKXtzZWxmLm9uRXJyb3IoJ3dlYnNvY2tldCBlcnJvcicsZSk7fTt9OyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogT3ZlcnJpZGUgYG9uRGF0YWAgdG8gdXNlIGEgdGltZXIgb24gaU9TLlxuICAgICAgICAgICAgICAgICAgICAgKiBTZWU6IGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL21sb3VnaHJhbi8yMDUyMDA2XG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAgICAgKi9pZigndW5kZWZpbmVkJyAhPSB0eXBlb2YgbmF2aWdhdG9yICYmIC9pUGFkfGlQaG9uZXxpUG9kL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSl7V1MucHJvdG90eXBlLm9uRGF0YSA9IGZ1bmN0aW9uKGRhdGEpe3ZhciBzZWxmPXRoaXM7c2V0VGltZW91dChmdW5jdGlvbigpe1RyYW5zcG9ydC5wcm90b3R5cGUub25EYXRhLmNhbGwoc2VsZixkYXRhKTt9LDApO307fSAvKipcbiAgICAgICAgICAgICAgICAgICAgICogV3JpdGVzIGRhdGEgdG8gc29ja2V0LlxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBvZiBwYWNrZXRzLlxuICAgICAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgICAgICovV1MucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24ocGFja2V0cyl7dmFyIHNlbGY9dGhpczt0aGlzLndyaXRhYmxlID0gZmFsc2U7IC8vIGVuY29kZVBhY2tldCBlZmZpY2llbnQgYXMgaXQgdXNlcyBXUyBmcmFtaW5nXG4vLyBubyBuZWVkIGZvciBlbmNvZGVQYXlsb2FkXG52YXIgdG90YWw9cGFja2V0cy5sZW5ndGg7Zm9yKHZhciBpPTAsbD10b3RhbDtpIDwgbDtpKyspIHsoZnVuY3Rpb24ocGFja2V0KXtwYXJzZXIuZW5jb2RlUGFja2V0KHBhY2tldCxzZWxmLnN1cHBvcnRzQmluYXJ5LGZ1bmN0aW9uKGRhdGEpe2lmKCFCcm93c2VyV2ViU29ja2V0KXsgLy8gYWx3YXlzIGNyZWF0ZSBhIG5ldyBvYmplY3QgKEdILTQzNylcbnZhciBvcHRzPXt9O2lmKHBhY2tldC5vcHRpb25zKXtvcHRzLmNvbXByZXNzID0gcGFja2V0Lm9wdGlvbnMuY29tcHJlc3M7fWlmKHNlbGYucGVyTWVzc2FnZURlZmxhdGUpe3ZhciBsZW49J3N0cmluZycgPT0gdHlwZW9mIGRhdGE/Z2xvYmFsLkJ1ZmZlci5ieXRlTGVuZ3RoKGRhdGEpOmRhdGEubGVuZ3RoO2lmKGxlbiA8IHNlbGYucGVyTWVzc2FnZURlZmxhdGUudGhyZXNob2xkKXtvcHRzLmNvbXByZXNzID0gZmFsc2U7fX19IC8vU29tZXRpbWVzIHRoZSB3ZWJzb2NrZXQgaGFzIGFscmVhZHkgYmVlbiBjbG9zZWQgYnV0IHRoZSBicm93c2VyIGRpZG4ndFxuLy9oYXZlIGEgY2hhbmNlIG9mIGluZm9ybWluZyB1cyBhYm91dCBpdCB5ZXQsIGluIHRoYXQgY2FzZSBzZW5kIHdpbGxcbi8vdGhyb3cgYW4gZXJyb3JcbnRyeXtpZihCcm93c2VyV2ViU29ja2V0KXsgLy8gVHlwZUVycm9yIGlzIHRocm93biB3aGVuIHBhc3NpbmcgdGhlIHNlY29uZCBhcmd1bWVudCBvbiBTYWZhcmlcbnNlbGYud3Muc2VuZChkYXRhKTt9ZWxzZSB7c2VsZi53cy5zZW5kKGRhdGEsb3B0cyk7fX1jYXRjaChlKSB7ZGVidWcoJ3dlYnNvY2tldCBjbG9zZWQgYmVmb3JlIG9uY2xvc2UgZXZlbnQnKTt9LS10b3RhbCB8fCBkb25lKCk7fSk7fSkocGFja2V0c1tpXSk7fWZ1bmN0aW9uIGRvbmUoKXtzZWxmLmVtaXQoJ2ZsdXNoJyk7IC8vIGZha2UgZHJhaW5cbi8vIGRlZmVyIHRvIG5leHQgdGljayB0byBhbGxvdyBTb2NrZXQgdG8gY2xlYXIgd3JpdGVCdWZmZXJcbnNldFRpbWVvdXQoZnVuY3Rpb24oKXtzZWxmLndyaXRhYmxlID0gdHJ1ZTtzZWxmLmVtaXQoJ2RyYWluJyk7fSwwKTt9fTsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIENhbGxlZCB1cG9uIGNsb3NlXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAgICAgKi9XUy5wcm90b3R5cGUub25DbG9zZSA9IGZ1bmN0aW9uKCl7VHJhbnNwb3J0LnByb3RvdHlwZS5vbkNsb3NlLmNhbGwodGhpcyk7fTsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIENsb3NlcyBzb2NrZXQuXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAgICAgKi9XUy5wcm90b3R5cGUuZG9DbG9zZSA9IGZ1bmN0aW9uKCl7aWYodHlwZW9mIHRoaXMud3MgIT09ICd1bmRlZmluZWQnKXt0aGlzLndzLmNsb3NlKCk7fX07IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBHZW5lcmF0ZXMgdXJpIGZvciBjb25uZWN0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgICAgICovV1MucHJvdG90eXBlLnVyaSA9IGZ1bmN0aW9uKCl7dmFyIHF1ZXJ5PXRoaXMucXVlcnkgfHwge307dmFyIHNjaGVtYT10aGlzLnNlY3VyZT8nd3NzJzond3MnO3ZhciBwb3J0PScnOyAvLyBhdm9pZCBwb3J0IGlmIGRlZmF1bHQgZm9yIHNjaGVtYVxuaWYodGhpcy5wb3J0ICYmICgnd3NzJyA9PSBzY2hlbWEgJiYgdGhpcy5wb3J0ICE9IDQ0MyB8fCAnd3MnID09IHNjaGVtYSAmJiB0aGlzLnBvcnQgIT0gODApKXtwb3J0ID0gJzonICsgdGhpcy5wb3J0O30gLy8gYXBwZW5kIHRpbWVzdGFtcCB0byBVUklcbmlmKHRoaXMudGltZXN0YW1wUmVxdWVzdHMpe3F1ZXJ5W3RoaXMudGltZXN0YW1wUGFyYW1dID0geWVhc3QoKTt9IC8vIGNvbW11bmljYXRlIGJpbmFyeSBzdXBwb3J0IGNhcGFiaWxpdGllc1xuaWYoIXRoaXMuc3VwcG9ydHNCaW5hcnkpe3F1ZXJ5LmI2NCA9IDE7fXF1ZXJ5ID0gcGFyc2Vxcy5lbmNvZGUocXVlcnkpOyAvLyBwcmVwZW5kID8gdG8gcXVlcnlcbmlmKHF1ZXJ5Lmxlbmd0aCl7cXVlcnkgPSAnPycgKyBxdWVyeTt9dmFyIGlwdjY9dGhpcy5ob3N0bmFtZS5pbmRleE9mKCc6JykgIT09IC0xO3JldHVybiBzY2hlbWEgKyAnOi8vJyArIChpcHY2PydbJyArIHRoaXMuaG9zdG5hbWUgKyAnXSc6dGhpcy5ob3N0bmFtZSkgKyBwb3J0ICsgdGhpcy5wYXRoICsgcXVlcnk7fTsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEZlYXR1cmUgZGV0ZWN0aW9uIGZvciBXZWJTb2NrZXQuXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHdoZXRoZXIgdGhpcyB0cmFuc3BvcnQgaXMgYXZhaWxhYmxlLlxuICAgICAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAgICAgKi9XUy5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbigpe3JldHVybiAhIVdlYlNvY2tldCAmJiAhKCdfX2luaXRpYWxpemUnIGluIFdlYlNvY2tldCAmJiB0aGlzLm5hbWUgPT09IFdTLnByb3RvdHlwZS5uYW1lKTt9O30pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIj9zZWxmOnR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCI/d2luZG93OnR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCI/Z2xvYmFsOnt9KTt9LHtcIi4uL3RyYW5zcG9ydFwiOjQsXCJjb21wb25lbnQtaW5oZXJpdFwiOjE2LFwiZGVidWdcIjoxNyxcImVuZ2luZS5pby1wYXJzZXJcIjoxOSxcInBhcnNlcXNcIjoyNyxcIndzXCI6dW5kZWZpbmVkLFwieWVhc3RcIjozMH1dLDEwOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXsgLy8gYnJvd3NlciBzaGltIGZvciB4bWxodHRwcmVxdWVzdCBtb2R1bGVcbnZhciBoYXNDT1JTPV9kZXJlcV8oJ2hhcy1jb3JzJyk7bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcHRzKXt2YXIgeGRvbWFpbj1vcHRzLnhkb21haW47IC8vIHNjaGVtZSBtdXN0IGJlIHNhbWUgd2hlbiB1c2lnbiBYRG9tYWluUmVxdWVzdFxuLy8gaHR0cDovL2Jsb2dzLm1zZG4uY29tL2IvaWVpbnRlcm5hbHMvYXJjaGl2ZS8yMDEwLzA1LzEzL3hkb21haW5yZXF1ZXN0LXJlc3RyaWN0aW9ucy1saW1pdGF0aW9ucy1hbmQtd29ya2Fyb3VuZHMuYXNweFxudmFyIHhzY2hlbWU9b3B0cy54c2NoZW1lOyAvLyBYRG9tYWluUmVxdWVzdCBoYXMgYSBmbG93IG9mIG5vdCBzZW5kaW5nIGNvb2tpZSwgdGhlcmVmb3JlIGl0IHNob3VsZCBiZSBkaXNhYmxlZCBhcyBhIGRlZmF1bHQuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vQXV0b21hdHRpYy9lbmdpbmUuaW8tY2xpZW50L3B1bGwvMjE3XG52YXIgZW5hYmxlc1hEUj1vcHRzLmVuYWJsZXNYRFI7IC8vIFhNTEh0dHBSZXF1ZXN0IGNhbiBiZSBkaXNhYmxlZCBvbiBJRVxudHJ5e2lmKCd1bmRlZmluZWQnICE9IHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAmJiAoIXhkb21haW4gfHwgaGFzQ09SUykpe3JldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKTt9fWNhdGNoKGUpIHt9IC8vIFVzZSBYRG9tYWluUmVxdWVzdCBmb3IgSUU4IGlmIGVuYWJsZXNYRFIgaXMgdHJ1ZVxuLy8gYmVjYXVzZSBsb2FkaW5nIGJhciBrZWVwcyBmbGFzaGluZyB3aGVuIHVzaW5nIGpzb25wLXBvbGxpbmdcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS95dWppb3Nha2Evc29ja2UuaW8taWU4LWxvYWRpbmctZXhhbXBsZVxudHJ5e2lmKCd1bmRlZmluZWQnICE9IHR5cGVvZiBYRG9tYWluUmVxdWVzdCAmJiAheHNjaGVtZSAmJiBlbmFibGVzWERSKXtyZXR1cm4gbmV3IFhEb21haW5SZXF1ZXN0KCk7fX1jYXRjaChlKSB7fWlmKCF4ZG9tYWluKXt0cnl7cmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpO31jYXRjaChlKSB7fX19O30se1wiaGFzLWNvcnNcIjoyMn1dLDExOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXttb2R1bGUuZXhwb3J0cyA9IGFmdGVyO2Z1bmN0aW9uIGFmdGVyKGNvdW50LGNhbGxiYWNrLGVycl9jYil7dmFyIGJhaWw9ZmFsc2U7ZXJyX2NiID0gZXJyX2NiIHx8IG5vb3A7cHJveHkuY291bnQgPSBjb3VudDtyZXR1cm4gY291bnQgPT09IDA/Y2FsbGJhY2soKTpwcm94eTtmdW5jdGlvbiBwcm94eShlcnIscmVzdWx0KXtpZihwcm94eS5jb3VudCA8PSAwKXt0aHJvdyBuZXcgRXJyb3IoJ2FmdGVyIGNhbGxlZCB0b28gbWFueSB0aW1lcycpO30tLXByb3h5LmNvdW50OyAvLyBhZnRlciBmaXJzdCBlcnJvciwgcmVzdCBhcmUgcGFzc2VkIHRvIGVycl9jYlxuaWYoZXJyKXtiYWlsID0gdHJ1ZTtjYWxsYmFjayhlcnIpOyAvLyBmdXR1cmUgZXJyb3IgY2FsbGJhY2tzIHdpbGwgZ28gdG8gZXJyb3IgaGFuZGxlclxuY2FsbGJhY2sgPSBlcnJfY2I7fWVsc2UgaWYocHJveHkuY291bnQgPT09IDAgJiYgIWJhaWwpe2NhbGxiYWNrKG51bGwscmVzdWx0KTt9fX1mdW5jdGlvbiBub29wKCl7fX0se31dLDEyOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXsgLyoqXG4gICAgICAgICAgICAgICAgICogQW4gYWJzdHJhY3Rpb24gZm9yIHNsaWNpbmcgYW4gYXJyYXlidWZmZXIgZXZlbiB3aGVuXG4gICAgICAgICAgICAgICAgICogQXJyYXlCdWZmZXIucHJvdG90eXBlLnNsaWNlIGlzIG5vdCBzdXBwb3J0ZWRcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAgICAgICAgICovbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihhcnJheWJ1ZmZlcixzdGFydCxlbmQpe3ZhciBieXRlcz1hcnJheWJ1ZmZlci5ieXRlTGVuZ3RoO3N0YXJ0ID0gc3RhcnQgfHwgMDtlbmQgPSBlbmQgfHwgYnl0ZXM7aWYoYXJyYXlidWZmZXIuc2xpY2Upe3JldHVybiBhcnJheWJ1ZmZlci5zbGljZShzdGFydCxlbmQpO31pZihzdGFydCA8IDApe3N0YXJ0ICs9IGJ5dGVzO31pZihlbmQgPCAwKXtlbmQgKz0gYnl0ZXM7fWlmKGVuZCA+IGJ5dGVzKXtlbmQgPSBieXRlczt9aWYoc3RhcnQgPj0gYnl0ZXMgfHwgc3RhcnQgPj0gZW5kIHx8IGJ5dGVzID09PSAwKXtyZXR1cm4gbmV3IEFycmF5QnVmZmVyKDApO312YXIgYWJ2PW5ldyBVaW50OEFycmF5KGFycmF5YnVmZmVyKTt2YXIgcmVzdWx0PW5ldyBVaW50OEFycmF5KGVuZCAtIHN0YXJ0KTtmb3IodmFyIGk9c3RhcnQsaWk9MDtpIDwgZW5kO2krKyxpaSsrKSB7cmVzdWx0W2lpXSA9IGFidltpXTt9cmV0dXJuIHJlc3VsdC5idWZmZXI7fTt9LHt9XSwxMzpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7IC8qXG4gICAgICAgICAgICAgICAgICogYmFzZTY0LWFycmF5YnVmZmVyXG4gICAgICAgICAgICAgICAgICogaHR0cHM6Ly9naXRodWIuY29tL25pa2xhc3ZoL2Jhc2U2NC1hcnJheWJ1ZmZlclxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQ29weXJpZ2h0IChjKSAyMDEyIE5pa2xhcyB2b24gSGVydHplblxuICAgICAgICAgICAgICAgICAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAgICAgICAgICAgICAgICAgKi8oZnVuY3Rpb24oY2hhcnMpe1widXNlIHN0cmljdFwiO2V4cG9ydHMuZW5jb2RlID0gZnVuY3Rpb24oYXJyYXlidWZmZXIpe3ZhciBieXRlcz1uZXcgVWludDhBcnJheShhcnJheWJ1ZmZlciksaSxsZW49Ynl0ZXMubGVuZ3RoLGJhc2U2ND1cIlwiO2ZvcihpID0gMDtpIDwgbGVuO2kgKz0gMykge2Jhc2U2NCArPSBjaGFyc1tieXRlc1tpXSA+PiAyXTtiYXNlNjQgKz0gY2hhcnNbKGJ5dGVzW2ldICYgMykgPDwgNCB8IGJ5dGVzW2kgKyAxXSA+PiA0XTtiYXNlNjQgKz0gY2hhcnNbKGJ5dGVzW2kgKyAxXSAmIDE1KSA8PCAyIHwgYnl0ZXNbaSArIDJdID4+IDZdO2Jhc2U2NCArPSBjaGFyc1tieXRlc1tpICsgMl0gJiA2M107fWlmKGxlbiAlIDMgPT09IDIpe2Jhc2U2NCA9IGJhc2U2NC5zdWJzdHJpbmcoMCxiYXNlNjQubGVuZ3RoIC0gMSkgKyBcIj1cIjt9ZWxzZSBpZihsZW4gJSAzID09PSAxKXtiYXNlNjQgPSBiYXNlNjQuc3Vic3RyaW5nKDAsYmFzZTY0Lmxlbmd0aCAtIDIpICsgXCI9PVwiO31yZXR1cm4gYmFzZTY0O307ZXhwb3J0cy5kZWNvZGUgPSBmdW5jdGlvbihiYXNlNjQpe3ZhciBidWZmZXJMZW5ndGg9YmFzZTY0Lmxlbmd0aCAqIDAuNzUsbGVuPWJhc2U2NC5sZW5ndGgsaSxwPTAsZW5jb2RlZDEsZW5jb2RlZDIsZW5jb2RlZDMsZW5jb2RlZDQ7aWYoYmFzZTY0W2Jhc2U2NC5sZW5ndGggLSAxXSA9PT0gXCI9XCIpe2J1ZmZlckxlbmd0aC0tO2lmKGJhc2U2NFtiYXNlNjQubGVuZ3RoIC0gMl0gPT09IFwiPVwiKXtidWZmZXJMZW5ndGgtLTt9fXZhciBhcnJheWJ1ZmZlcj1uZXcgQXJyYXlCdWZmZXIoYnVmZmVyTGVuZ3RoKSxieXRlcz1uZXcgVWludDhBcnJheShhcnJheWJ1ZmZlcik7Zm9yKGkgPSAwO2kgPCBsZW47aSArPSA0KSB7ZW5jb2RlZDEgPSBjaGFycy5pbmRleE9mKGJhc2U2NFtpXSk7ZW5jb2RlZDIgPSBjaGFycy5pbmRleE9mKGJhc2U2NFtpICsgMV0pO2VuY29kZWQzID0gY2hhcnMuaW5kZXhPZihiYXNlNjRbaSArIDJdKTtlbmNvZGVkNCA9IGNoYXJzLmluZGV4T2YoYmFzZTY0W2kgKyAzXSk7Ynl0ZXNbcCsrXSA9IGVuY29kZWQxIDw8IDIgfCBlbmNvZGVkMiA+PiA0O2J5dGVzW3ArK10gPSAoZW5jb2RlZDIgJiAxNSkgPDwgNCB8IGVuY29kZWQzID4+IDI7Ynl0ZXNbcCsrXSA9IChlbmNvZGVkMyAmIDMpIDw8IDYgfCBlbmNvZGVkNCAmIDYzO31yZXR1cm4gYXJyYXlidWZmZXI7fTt9KShcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIik7fSx7fV0sMTQ6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihnbG9iYWwpeyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQ3JlYXRlIGEgYmxvYiBidWlsZGVyIGV2ZW4gd2hlbiB2ZW5kb3IgcHJlZml4ZXMgZXhpc3RcbiAgICAgICAgICAgICAgICAgICAgICovdmFyIEJsb2JCdWlsZGVyPWdsb2JhbC5CbG9iQnVpbGRlciB8fCBnbG9iYWwuV2ViS2l0QmxvYkJ1aWxkZXIgfHwgZ2xvYmFsLk1TQmxvYkJ1aWxkZXIgfHwgZ2xvYmFsLk1vekJsb2JCdWlsZGVyOyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQ2hlY2sgaWYgQmxvYiBjb25zdHJ1Y3RvciBpcyBzdXBwb3J0ZWRcbiAgICAgICAgICAgICAgICAgICAgICovdmFyIGJsb2JTdXBwb3J0ZWQ9KGZ1bmN0aW9uKCl7dHJ5e3ZhciBhPW5ldyBCbG9iKFsnaGknXSk7cmV0dXJuIGEuc2l6ZSA9PT0gMjt9Y2F0Y2goZSkge3JldHVybiBmYWxzZTt9fSkoKTsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIENoZWNrIGlmIEJsb2IgY29uc3RydWN0b3Igc3VwcG9ydHMgQXJyYXlCdWZmZXJWaWV3c1xuICAgICAgICAgICAgICAgICAgICAgKiBGYWlscyBpbiBTYWZhcmkgNiwgc28gd2UgbmVlZCB0byBtYXAgdG8gQXJyYXlCdWZmZXJzIHRoZXJlLlxuICAgICAgICAgICAgICAgICAgICAgKi92YXIgYmxvYlN1cHBvcnRzQXJyYXlCdWZmZXJWaWV3PWJsb2JTdXBwb3J0ZWQgJiYgKGZ1bmN0aW9uKCl7dHJ5e3ZhciBiPW5ldyBCbG9iKFtuZXcgVWludDhBcnJheShbMSwyXSldKTtyZXR1cm4gYi5zaXplID09PSAyO31jYXRjaChlKSB7cmV0dXJuIGZhbHNlO319KSgpOyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQ2hlY2sgaWYgQmxvYkJ1aWxkZXIgaXMgc3VwcG9ydGVkXG4gICAgICAgICAgICAgICAgICAgICAqL3ZhciBibG9iQnVpbGRlclN1cHBvcnRlZD1CbG9iQnVpbGRlciAmJiBCbG9iQnVpbGRlci5wcm90b3R5cGUuYXBwZW5kICYmIEJsb2JCdWlsZGVyLnByb3RvdHlwZS5nZXRCbG9iOyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogSGVscGVyIGZ1bmN0aW9uIHRoYXQgbWFwcyBBcnJheUJ1ZmZlclZpZXdzIHRvIEFycmF5QnVmZmVyc1xuICAgICAgICAgICAgICAgICAgICAgKiBVc2VkIGJ5IEJsb2JCdWlsZGVyIGNvbnN0cnVjdG9yIGFuZCBvbGQgYnJvd3NlcnMgdGhhdCBkaWRuJ3RcbiAgICAgICAgICAgICAgICAgICAgICogc3VwcG9ydCBpdCBpbiB0aGUgQmxvYiBjb25zdHJ1Y3Rvci5cbiAgICAgICAgICAgICAgICAgICAgICovZnVuY3Rpb24gbWFwQXJyYXlCdWZmZXJWaWV3cyhhcnkpe2Zvcih2YXIgaT0wO2kgPCBhcnkubGVuZ3RoO2krKykge3ZhciBjaHVuaz1hcnlbaV07aWYoY2h1bmsuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpe3ZhciBidWY9Y2h1bmsuYnVmZmVyOyAvLyBpZiB0aGlzIGlzIGEgc3ViYXJyYXksIG1ha2UgYSBjb3B5IHNvIHdlIG9ubHlcbi8vIGluY2x1ZGUgdGhlIHN1YmFycmF5IHJlZ2lvbiBmcm9tIHRoZSB1bmRlcmx5aW5nIGJ1ZmZlclxuaWYoY2h1bmsuYnl0ZUxlbmd0aCAhPT0gYnVmLmJ5dGVMZW5ndGgpe3ZhciBjb3B5PW5ldyBVaW50OEFycmF5KGNodW5rLmJ5dGVMZW5ndGgpO2NvcHkuc2V0KG5ldyBVaW50OEFycmF5KGJ1ZixjaHVuay5ieXRlT2Zmc2V0LGNodW5rLmJ5dGVMZW5ndGgpKTtidWYgPSBjb3B5LmJ1ZmZlcjt9YXJ5W2ldID0gYnVmO319fWZ1bmN0aW9uIEJsb2JCdWlsZGVyQ29uc3RydWN0b3IoYXJ5LG9wdGlvbnMpe29wdGlvbnMgPSBvcHRpb25zIHx8IHt9O3ZhciBiYj1uZXcgQmxvYkJ1aWxkZXIoKTttYXBBcnJheUJ1ZmZlclZpZXdzKGFyeSk7Zm9yKHZhciBpPTA7aSA8IGFyeS5sZW5ndGg7aSsrKSB7YmIuYXBwZW5kKGFyeVtpXSk7fXJldHVybiBvcHRpb25zLnR5cGU/YmIuZ2V0QmxvYihvcHRpb25zLnR5cGUpOmJiLmdldEJsb2IoKTt9O2Z1bmN0aW9uIEJsb2JDb25zdHJ1Y3Rvcihhcnksb3B0aW9ucyl7bWFwQXJyYXlCdWZmZXJWaWV3cyhhcnkpO3JldHVybiBuZXcgQmxvYihhcnksb3B0aW9ucyB8fCB7fSk7fTttb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpe2lmKGJsb2JTdXBwb3J0ZWQpe3JldHVybiBibG9iU3VwcG9ydHNBcnJheUJ1ZmZlclZpZXc/Z2xvYmFsLkJsb2I6QmxvYkNvbnN0cnVjdG9yO31lbHNlIGlmKGJsb2JCdWlsZGVyU3VwcG9ydGVkKXtyZXR1cm4gQmxvYkJ1aWxkZXJDb25zdHJ1Y3Rvcjt9ZWxzZSB7cmV0dXJuIHVuZGVmaW5lZDt9fSkoKTt9KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCI/c2VsZjp0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiP3dpbmRvdzp0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiP2dsb2JhbDp7fSk7fSx7fV0sMTU6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpeyAvKipcbiAgICAgICAgICAgICAgICAgKiBFeHBvc2UgYEVtaXR0ZXJgLlxuICAgICAgICAgICAgICAgICAqL21vZHVsZS5leHBvcnRzID0gRW1pdHRlcjsgLyoqXG4gICAgICAgICAgICAgICAgICogSW5pdGlhbGl6ZSBhIG5ldyBgRW1pdHRlcmAuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAqL2Z1bmN0aW9uIEVtaXR0ZXIob2JqKXtpZihvYmopcmV0dXJuIG1peGluKG9iaik7fTsgLyoqXG4gICAgICAgICAgICAgICAgICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICovZnVuY3Rpb24gbWl4aW4ob2JqKXtmb3IodmFyIGtleSBpbiBFbWl0dGVyLnByb3RvdHlwZSkge29ialtrZXldID0gRW1pdHRlci5wcm90b3R5cGVba2V5XTt9cmV0dXJuIG9iajt9IC8qKlxuICAgICAgICAgICAgICAgICAqIExpc3RlbiBvbiB0aGUgZ2l2ZW4gYGV2ZW50YCB3aXRoIGBmbmAuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgKi9FbWl0dGVyLnByb3RvdHlwZS5vbiA9IEVtaXR0ZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCxmbil7dGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9Oyh0aGlzLl9jYWxsYmFja3NbZXZlbnRdID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXSkucHVzaChmbik7cmV0dXJuIHRoaXM7fTsgLyoqXG4gICAgICAgICAgICAgICAgICogQWRkcyBhbiBgZXZlbnRgIGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIGEgc2luZ2xlXG4gICAgICAgICAgICAgICAgICogdGltZSB0aGVuIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZC5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7RW1pdHRlcn1cbiAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAqL0VtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldmVudCxmbil7dmFyIHNlbGY9dGhpczt0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307ZnVuY3Rpb24gb24oKXtzZWxmLm9mZihldmVudCxvbik7Zm4uYXBwbHkodGhpcyxhcmd1bWVudHMpO31vbi5mbiA9IGZuO3RoaXMub24oZXZlbnQsb24pO3JldHVybiB0aGlzO307IC8qKlxuICAgICAgICAgICAgICAgICAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXG4gICAgICAgICAgICAgICAgICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgKi9FbWl0dGVyLnByb3RvdHlwZS5vZmYgPSBFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCxmbil7dGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9OyAvLyBhbGxcbmlmKDAgPT0gYXJndW1lbnRzLmxlbmd0aCl7dGhpcy5fY2FsbGJhY2tzID0ge307cmV0dXJuIHRoaXM7fSAvLyBzcGVjaWZpYyBldmVudFxudmFyIGNhbGxiYWNrcz10aGlzLl9jYWxsYmFja3NbZXZlbnRdO2lmKCFjYWxsYmFja3MpcmV0dXJuIHRoaXM7IC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcbmlmKDEgPT0gYXJndW1lbnRzLmxlbmd0aCl7ZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1tldmVudF07cmV0dXJuIHRoaXM7fSAvLyByZW1vdmUgc3BlY2lmaWMgaGFuZGxlclxudmFyIGNiO2Zvcih2YXIgaT0wO2kgPCBjYWxsYmFja3MubGVuZ3RoO2krKykge2NiID0gY2FsbGJhY2tzW2ldO2lmKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pe2NhbGxiYWNrcy5zcGxpY2UoaSwxKTticmVhazt9fXJldHVybiB0aGlzO307IC8qKlxuICAgICAgICAgICAgICAgICAqIEVtaXQgYGV2ZW50YCB3aXRoIHRoZSBnaXZlbiBhcmdzLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtNaXhlZH0gLi4uXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7RW1pdHRlcn1cbiAgICAgICAgICAgICAgICAgKi9FbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oZXZlbnQpe3RoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTt2YXIgYXJncz1bXS5zbGljZS5jYWxsKGFyZ3VtZW50cywxKSxjYWxsYmFja3M9dGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtpZihjYWxsYmFja3Mpe2NhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgwKTtmb3IodmFyIGk9MCxsZW49Y2FsbGJhY2tzLmxlbmd0aDtpIDwgbGVuOysraSkge2NhbGxiYWNrc1tpXS5hcHBseSh0aGlzLGFyZ3MpO319cmV0dXJuIHRoaXM7fTsgLyoqXG4gICAgICAgICAgICAgICAgICogUmV0dXJuIGFycmF5IG9mIGNhbGxiYWNrcyBmb3IgYGV2ZW50YC5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAgICAgICAgICovRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe3RoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtyZXR1cm4gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXTt9OyAvKipcbiAgICAgICAgICAgICAgICAgKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAgICAgICAgICovRW1pdHRlci5wcm90b3R5cGUuaGFzTGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe3JldHVybiAhIXRoaXMubGlzdGVuZXJzKGV2ZW50KS5sZW5ndGg7fTt9LHt9XSwxNjpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihhLGIpe3ZhciBmbj1mdW5jdGlvbiBmbigpe307Zm4ucHJvdG90eXBlID0gYi5wcm90b3R5cGU7YS5wcm90b3R5cGUgPSBuZXcgZm4oKTthLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGE7fTt9LHt9XSwxNzpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7IC8qKlxuICAgICAgICAgICAgICAgICAqIFRoaXMgaXMgdGhlIHdlYiBicm93c2VyIGltcGxlbWVudGF0aW9uIG9mIGBkZWJ1ZygpYC5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEV4cG9zZSBgZGVidWcoKWAgYXMgdGhlIG1vZHVsZS5cbiAgICAgICAgICAgICAgICAgKi9leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBfZGVyZXFfKCcuL2RlYnVnJyk7ZXhwb3J0cy5sb2cgPSBsb2c7ZXhwb3J0cy5mb3JtYXRBcmdzID0gZm9ybWF0QXJncztleHBvcnRzLnNhdmUgPSBzYXZlO2V4cG9ydHMubG9hZCA9IGxvYWQ7ZXhwb3J0cy51c2VDb2xvcnMgPSB1c2VDb2xvcnM7ZXhwb3J0cy5zdG9yYWdlID0gJ3VuZGVmaW5lZCcgIT0gdHlwZW9mIGNocm9tZSAmJiAndW5kZWZpbmVkJyAhPSB0eXBlb2YgY2hyb21lLnN0b3JhZ2U/Y2hyb21lLnN0b3JhZ2UubG9jYWw6bG9jYWxzdG9yYWdlKCk7IC8qKlxuICAgICAgICAgICAgICAgICAqIENvbG9ycy5cbiAgICAgICAgICAgICAgICAgKi9leHBvcnRzLmNvbG9ycyA9IFsnbGlnaHRzZWFncmVlbicsJ2ZvcmVzdGdyZWVuJywnZ29sZGVucm9kJywnZG9kZ2VyYmx1ZScsJ2RhcmtvcmNoaWQnLCdjcmltc29uJ107IC8qKlxuICAgICAgICAgICAgICAgICAqIEN1cnJlbnRseSBvbmx5IFdlYktpdC1iYXNlZCBXZWIgSW5zcGVjdG9ycywgRmlyZWZveCA+PSB2MzEsXG4gICAgICAgICAgICAgICAgICogYW5kIHRoZSBGaXJlYnVnIGV4dGVuc2lvbiAoYW55IEZpcmVmb3ggdmVyc2lvbikgYXJlIGtub3duXG4gICAgICAgICAgICAgICAgICogdG8gc3VwcG9ydCBcIiVjXCIgQ1NTIGN1c3RvbWl6YXRpb25zLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogVE9ETzogYWRkIGEgYGxvY2FsU3RvcmFnZWAgdmFyaWFibGUgdG8gZXhwbGljaXRseSBlbmFibGUvZGlzYWJsZSBjb2xvcnNcbiAgICAgICAgICAgICAgICAgKi9mdW5jdGlvbiB1c2VDb2xvcnMoKXsgLy8gaXMgd2Via2l0PyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNjQ1OTYwNi8zNzY3NzNcbnJldHVybiAnV2Via2l0QXBwZWFyYW5jZScgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlIHx8ICAvLyBpcyBmaXJlYnVnPyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zOTgxMjAvMzc2NzczXG53aW5kb3cuY29uc29sZSAmJiAoY29uc29sZS5maXJlYnVnIHx8IGNvbnNvbGUuZXhjZXB0aW9uICYmIGNvbnNvbGUudGFibGUpIHx8ICAvLyBpcyBmaXJlZm94ID49IHYzMT9cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvVG9vbHMvV2ViX0NvbnNvbGUjU3R5bGluZ19tZXNzYWdlc1xubmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLm1hdGNoKC9maXJlZm94XFwvKFxcZCspLykgJiYgcGFyc2VJbnQoUmVnRXhwLiQxLDEwKSA+PSAzMTt9IC8qKlxuICAgICAgICAgICAgICAgICAqIE1hcCAlaiB0byBgSlNPTi5zdHJpbmdpZnkoKWAsIHNpbmNlIG5vIFdlYiBJbnNwZWN0b3JzIGRvIHRoYXQgYnkgZGVmYXVsdC5cbiAgICAgICAgICAgICAgICAgKi9leHBvcnRzLmZvcm1hdHRlcnMuaiA9IGZ1bmN0aW9uKHYpe3JldHVybiBKU09OLnN0cmluZ2lmeSh2KTt9OyAvKipcbiAgICAgICAgICAgICAgICAgKiBDb2xvcml6ZSBsb2cgYXJndW1lbnRzIGlmIGVuYWJsZWQuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAqL2Z1bmN0aW9uIGZvcm1hdEFyZ3MoKXt2YXIgYXJncz1hcmd1bWVudHM7dmFyIHVzZUNvbG9ycz10aGlzLnVzZUNvbG9yczthcmdzWzBdID0gKHVzZUNvbG9ycz8nJWMnOicnKSArIHRoaXMubmFtZXNwYWNlICsgKHVzZUNvbG9ycz8nICVjJzonICcpICsgYXJnc1swXSArICh1c2VDb2xvcnM/JyVjICc6JyAnKSArICcrJyArIGV4cG9ydHMuaHVtYW5pemUodGhpcy5kaWZmKTtpZighdXNlQ29sb3JzKXJldHVybiBhcmdzO3ZhciBjPSdjb2xvcjogJyArIHRoaXMuY29sb3I7YXJncyA9IFthcmdzWzBdLGMsJ2NvbG9yOiBpbmhlcml0J10uY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MsMSkpOyAvLyB0aGUgZmluYWwgXCIlY1wiIGlzIHNvbWV3aGF0IHRyaWNreSwgYmVjYXVzZSB0aGVyZSBjb3VsZCBiZSBvdGhlclxuLy8gYXJndW1lbnRzIHBhc3NlZCBlaXRoZXIgYmVmb3JlIG9yIGFmdGVyIHRoZSAlYywgc28gd2UgbmVlZCB0b1xuLy8gZmlndXJlIG91dCB0aGUgY29ycmVjdCBpbmRleCB0byBpbnNlcnQgdGhlIENTUyBpbnRvXG52YXIgaW5kZXg9MDt2YXIgbGFzdEM9MDthcmdzWzBdLnJlcGxhY2UoLyVbYS16JV0vZyxmdW5jdGlvbihtYXRjaCl7aWYoJyUlJyA9PT0gbWF0Y2gpcmV0dXJuO2luZGV4Kys7aWYoJyVjJyA9PT0gbWF0Y2gpeyAvLyB3ZSBvbmx5IGFyZSBpbnRlcmVzdGVkIGluIHRoZSAqbGFzdCogJWNcbi8vICh0aGUgdXNlciBtYXkgaGF2ZSBwcm92aWRlZCB0aGVpciBvd24pXG5sYXN0QyA9IGluZGV4O319KTthcmdzLnNwbGljZShsYXN0QywwLGMpO3JldHVybiBhcmdzO30gLyoqXG4gICAgICAgICAgICAgICAgICogSW52b2tlcyBgY29uc29sZS5sb2coKWAgd2hlbiBhdmFpbGFibGUuXG4gICAgICAgICAgICAgICAgICogTm8tb3Agd2hlbiBgY29uc29sZS5sb2dgIGlzIG5vdCBhIFwiZnVuY3Rpb25cIi5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAgICAgICAgICovZnVuY3Rpb24gbG9nKCl7IC8vIHRoaXMgaGFja2VyeSBpcyByZXF1aXJlZCBmb3IgSUU4LzksIHdoZXJlXG4vLyB0aGUgYGNvbnNvbGUubG9nYCBmdW5jdGlvbiBkb2Vzbid0IGhhdmUgJ2FwcGx5J1xucmV0dXJuICdvYmplY3QnID09PSB0eXBlb2YgY29uc29sZSAmJiBjb25zb2xlLmxvZyAmJiBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuY2FsbChjb25zb2xlLmxvZyxjb25zb2xlLGFyZ3VtZW50cyk7fSAvKipcbiAgICAgICAgICAgICAgICAgKiBTYXZlIGBuYW1lc3BhY2VzYC5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG4gICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICovZnVuY3Rpb24gc2F2ZShuYW1lc3BhY2VzKXt0cnl7aWYobnVsbCA9PSBuYW1lc3BhY2VzKXtleHBvcnRzLnN0b3JhZ2UucmVtb3ZlSXRlbSgnZGVidWcnKTt9ZWxzZSB7ZXhwb3J0cy5zdG9yYWdlLmRlYnVnID0gbmFtZXNwYWNlczt9fWNhdGNoKGUpIHt9fSAvKipcbiAgICAgICAgICAgICAgICAgKiBMb2FkIGBuYW1lc3BhY2VzYC5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ30gcmV0dXJucyB0aGUgcHJldmlvdXNseSBwZXJzaXN0ZWQgZGVidWcgbW9kZXNcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKi9mdW5jdGlvbiBsb2FkKCl7dmFyIHI7dHJ5e3IgPSBleHBvcnRzLnN0b3JhZ2UuZGVidWc7fWNhdGNoKGUpIHt9cmV0dXJuIHI7fSAvKipcbiAgICAgICAgICAgICAgICAgKiBFbmFibGUgbmFtZXNwYWNlcyBsaXN0ZWQgaW4gYGxvY2FsU3RvcmFnZS5kZWJ1Z2AgaW5pdGlhbGx5LlxuICAgICAgICAgICAgICAgICAqL2V4cG9ydHMuZW5hYmxlKGxvYWQoKSk7IC8qKlxuICAgICAgICAgICAgICAgICAqIExvY2Fsc3RvcmFnZSBhdHRlbXB0cyB0byByZXR1cm4gdGhlIGxvY2Fsc3RvcmFnZS5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2Ugc2FmYXJpIHRocm93c1xuICAgICAgICAgICAgICAgICAqIHdoZW4gYSB1c2VyIGRpc2FibGVzIGNvb2tpZXMvbG9jYWxzdG9yYWdlXG4gICAgICAgICAgICAgICAgICogYW5kIHlvdSBhdHRlbXB0IHRvIGFjY2VzcyBpdC5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge0xvY2FsU3RvcmFnZX1cbiAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKi9mdW5jdGlvbiBsb2NhbHN0b3JhZ2UoKXt0cnl7cmV0dXJuIHdpbmRvdy5sb2NhbFN0b3JhZ2U7fWNhdGNoKGUpIHt9fX0se1wiLi9kZWJ1Z1wiOjE4fV0sMTg6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpeyAvKipcbiAgICAgICAgICAgICAgICAgKiBUaGlzIGlzIHRoZSBjb21tb24gbG9naWMgZm9yIGJvdGggdGhlIE5vZGUuanMgYW5kIHdlYiBicm93c2VyXG4gICAgICAgICAgICAgICAgICogaW1wbGVtZW50YXRpb25zIG9mIGBkZWJ1ZygpYC5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEV4cG9zZSBgZGVidWcoKWAgYXMgdGhlIG1vZHVsZS5cbiAgICAgICAgICAgICAgICAgKi9leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBkZWJ1ZztleHBvcnRzLmNvZXJjZSA9IGNvZXJjZTtleHBvcnRzLmRpc2FibGUgPSBkaXNhYmxlO2V4cG9ydHMuZW5hYmxlID0gZW5hYmxlO2V4cG9ydHMuZW5hYmxlZCA9IGVuYWJsZWQ7ZXhwb3J0cy5odW1hbml6ZSA9IF9kZXJlcV8oJ21zJyk7IC8qKlxuICAgICAgICAgICAgICAgICAqIFRoZSBjdXJyZW50bHkgYWN0aXZlIGRlYnVnIG1vZGUgbmFtZXMsIGFuZCBuYW1lcyB0byBza2lwLlxuICAgICAgICAgICAgICAgICAqL2V4cG9ydHMubmFtZXMgPSBbXTtleHBvcnRzLnNraXBzID0gW107IC8qKlxuICAgICAgICAgICAgICAgICAqIE1hcCBvZiBzcGVjaWFsIFwiJW5cIiBoYW5kbGluZyBmdW5jdGlvbnMsIGZvciB0aGUgZGVidWcgXCJmb3JtYXRcIiBhcmd1bWVudC5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIFZhbGlkIGtleSBuYW1lcyBhcmUgYSBzaW5nbGUsIGxvd2VyY2FzZWQgbGV0dGVyLCBpLmUuIFwiblwiLlxuICAgICAgICAgICAgICAgICAqL2V4cG9ydHMuZm9ybWF0dGVycyA9IHt9OyAvKipcbiAgICAgICAgICAgICAgICAgKiBQcmV2aW91c2x5IGFzc2lnbmVkIGNvbG9yLlxuICAgICAgICAgICAgICAgICAqL3ZhciBwcmV2Q29sb3I9MDsgLyoqXG4gICAgICAgICAgICAgICAgICogUHJldmlvdXMgbG9nIHRpbWVzdGFtcC5cbiAgICAgICAgICAgICAgICAgKi92YXIgcHJldlRpbWU7IC8qKlxuICAgICAgICAgICAgICAgICAqIFNlbGVjdCBhIGNvbG9yLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAqL2Z1bmN0aW9uIHNlbGVjdENvbG9yKCl7cmV0dXJuIGV4cG9ydHMuY29sb3JzW3ByZXZDb2xvcisrICUgZXhwb3J0cy5jb2xvcnMubGVuZ3RoXTt9IC8qKlxuICAgICAgICAgICAgICAgICAqIENyZWF0ZSBhIGRlYnVnZ2VyIHdpdGggdGhlIGdpdmVuIGBuYW1lc3BhY2VgLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZVxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAgICAgICAgICovZnVuY3Rpb24gZGVidWcobmFtZXNwYWNlKXsgLy8gZGVmaW5lIHRoZSBgZGlzYWJsZWRgIHZlcnNpb25cbmZ1bmN0aW9uIGRpc2FibGVkKCl7fWRpc2FibGVkLmVuYWJsZWQgPSBmYWxzZTsgLy8gZGVmaW5lIHRoZSBgZW5hYmxlZGAgdmVyc2lvblxuZnVuY3Rpb24gZW5hYmxlZCgpe3ZhciBzZWxmPWVuYWJsZWQ7IC8vIHNldCBgZGlmZmAgdGltZXN0YW1wXG52YXIgY3Vycj0rbmV3IERhdGUoKTt2YXIgbXM9Y3VyciAtIChwcmV2VGltZSB8fCBjdXJyKTtzZWxmLmRpZmYgPSBtcztzZWxmLnByZXYgPSBwcmV2VGltZTtzZWxmLmN1cnIgPSBjdXJyO3ByZXZUaW1lID0gY3VycjsgLy8gYWRkIHRoZSBgY29sb3JgIGlmIG5vdCBzZXRcbmlmKG51bGwgPT0gc2VsZi51c2VDb2xvcnMpc2VsZi51c2VDb2xvcnMgPSBleHBvcnRzLnVzZUNvbG9ycygpO2lmKG51bGwgPT0gc2VsZi5jb2xvciAmJiBzZWxmLnVzZUNvbG9ycylzZWxmLmNvbG9yID0gc2VsZWN0Q29sb3IoKTt2YXIgYXJncz1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO2FyZ3NbMF0gPSBleHBvcnRzLmNvZXJjZShhcmdzWzBdKTtpZignc3RyaW5nJyAhPT0gdHlwZW9mIGFyZ3NbMF0peyAvLyBhbnl0aGluZyBlbHNlIGxldCdzIGluc3BlY3Qgd2l0aCAlb1xuYXJncyA9IFsnJW8nXS5jb25jYXQoYXJncyk7fSAvLyBhcHBseSBhbnkgYGZvcm1hdHRlcnNgIHRyYW5zZm9ybWF0aW9uc1xudmFyIGluZGV4PTA7YXJnc1swXSA9IGFyZ3NbMF0ucmVwbGFjZSgvJShbYS16JV0pL2csZnVuY3Rpb24obWF0Y2gsZm9ybWF0KXsgLy8gaWYgd2UgZW5jb3VudGVyIGFuIGVzY2FwZWQgJSB0aGVuIGRvbid0IGluY3JlYXNlIHRoZSBhcnJheSBpbmRleFxuaWYobWF0Y2ggPT09ICclJScpcmV0dXJuIG1hdGNoO2luZGV4Kys7dmFyIGZvcm1hdHRlcj1leHBvcnRzLmZvcm1hdHRlcnNbZm9ybWF0XTtpZignZnVuY3Rpb24nID09PSB0eXBlb2YgZm9ybWF0dGVyKXt2YXIgdmFsPWFyZ3NbaW5kZXhdO21hdGNoID0gZm9ybWF0dGVyLmNhbGwoc2VsZix2YWwpOyAvLyBub3cgd2UgbmVlZCB0byByZW1vdmUgYGFyZ3NbaW5kZXhdYCBzaW5jZSBpdCdzIGlubGluZWQgaW4gdGhlIGBmb3JtYXRgXG5hcmdzLnNwbGljZShpbmRleCwxKTtpbmRleC0tO31yZXR1cm4gbWF0Y2g7fSk7aWYoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGV4cG9ydHMuZm9ybWF0QXJncyl7YXJncyA9IGV4cG9ydHMuZm9ybWF0QXJncy5hcHBseShzZWxmLGFyZ3MpO312YXIgbG9nRm49ZW5hYmxlZC5sb2cgfHwgZXhwb3J0cy5sb2cgfHwgY29uc29sZS5sb2cuYmluZChjb25zb2xlKTtsb2dGbi5hcHBseShzZWxmLGFyZ3MpO31lbmFibGVkLmVuYWJsZWQgPSB0cnVlO3ZhciBmbj1leHBvcnRzLmVuYWJsZWQobmFtZXNwYWNlKT9lbmFibGVkOmRpc2FibGVkO2ZuLm5hbWVzcGFjZSA9IG5hbWVzcGFjZTtyZXR1cm4gZm47fSAvKipcbiAgICAgICAgICAgICAgICAgKiBFbmFibGVzIGEgZGVidWcgbW9kZSBieSBuYW1lc3BhY2VzLiBUaGlzIGNhbiBpbmNsdWRlIG1vZGVzXG4gICAgICAgICAgICAgICAgICogc2VwYXJhdGVkIGJ5IGEgY29sb24gYW5kIHdpbGRjYXJkcy5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG4gICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgKi9mdW5jdGlvbiBlbmFibGUobmFtZXNwYWNlcyl7ZXhwb3J0cy5zYXZlKG5hbWVzcGFjZXMpO3ZhciBzcGxpdD0obmFtZXNwYWNlcyB8fCAnJykuc3BsaXQoL1tcXHMsXSsvKTt2YXIgbGVuPXNwbGl0Lmxlbmd0aDtmb3IodmFyIGk9MDtpIDwgbGVuO2krKykge2lmKCFzcGxpdFtpXSljb250aW51ZTsgLy8gaWdub3JlIGVtcHR5IHN0cmluZ3Ncbm5hbWVzcGFjZXMgPSBzcGxpdFtpXS5yZXBsYWNlKC9cXCovZywnLio/Jyk7aWYobmFtZXNwYWNlc1swXSA9PT0gJy0nKXtleHBvcnRzLnNraXBzLnB1c2gobmV3IFJlZ0V4cCgnXicgKyBuYW1lc3BhY2VzLnN1YnN0cigxKSArICckJykpO31lbHNlIHtleHBvcnRzLm5hbWVzLnB1c2gobmV3IFJlZ0V4cCgnXicgKyBuYW1lc3BhY2VzICsgJyQnKSk7fX19IC8qKlxuICAgICAgICAgICAgICAgICAqIERpc2FibGUgZGVidWcgb3V0cHV0LlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgKi9mdW5jdGlvbiBkaXNhYmxlKCl7ZXhwb3J0cy5lbmFibGUoJycpO30gLyoqXG4gICAgICAgICAgICAgICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBtb2RlIG5hbWUgaXMgZW5hYmxlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAgICAgICAgICovZnVuY3Rpb24gZW5hYmxlZChuYW1lKXt2YXIgaSxsZW47Zm9yKGkgPSAwLGxlbiA9IGV4cG9ydHMuc2tpcHMubGVuZ3RoO2kgPCBsZW47aSsrKSB7aWYoZXhwb3J0cy5za2lwc1tpXS50ZXN0KG5hbWUpKXtyZXR1cm4gZmFsc2U7fX1mb3IoaSA9IDAsbGVuID0gZXhwb3J0cy5uYW1lcy5sZW5ndGg7aSA8IGxlbjtpKyspIHtpZihleHBvcnRzLm5hbWVzW2ldLnRlc3QobmFtZSkpe3JldHVybiB0cnVlO319cmV0dXJuIGZhbHNlO30gLyoqXG4gICAgICAgICAgICAgICAgICogQ29lcmNlIGB2YWxgLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtNaXhlZH0gdmFsXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7TWl4ZWR9XG4gICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICovZnVuY3Rpb24gY29lcmNlKHZhbCl7aWYodmFsIGluc3RhbmNlb2YgRXJyb3IpcmV0dXJuIHZhbC5zdGFjayB8fCB2YWwubWVzc2FnZTtyZXR1cm4gdmFsO319LHtcIm1zXCI6MjV9XSwxOTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKGdsb2JhbCl7IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICAgICAgICAgICAgICAgICAgICAgKi92YXIga2V5cz1fZGVyZXFfKCcuL2tleXMnKTt2YXIgaGFzQmluYXJ5PV9kZXJlcV8oJ2hhcy1iaW5hcnknKTt2YXIgc2xpY2VCdWZmZXI9X2RlcmVxXygnYXJyYXlidWZmZXIuc2xpY2UnKTt2YXIgYmFzZTY0ZW5jb2Rlcj1fZGVyZXFfKCdiYXNlNjQtYXJyYXlidWZmZXInKTt2YXIgYWZ0ZXI9X2RlcmVxXygnYWZ0ZXInKTt2YXIgdXRmOD1fZGVyZXFfKCd1dGY4Jyk7IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBDaGVjayBpZiB3ZSBhcmUgcnVubmluZyBhbiBhbmRyb2lkIGJyb3dzZXIuIFRoYXQgcmVxdWlyZXMgdXMgdG8gdXNlXG4gICAgICAgICAgICAgICAgICAgICAqIEFycmF5QnVmZmVyIHdpdGggcG9sbGluZyB0cmFuc3BvcnRzLi4uXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIGh0dHA6Ly9naGluZGEubmV0L2pwZWctYmxvYi1hamF4LWFuZHJvaWQvXG4gICAgICAgICAgICAgICAgICAgICAqL3ZhciBpc0FuZHJvaWQ9bmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQW5kcm9pZC9pKTsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIENoZWNrIGlmIHdlIGFyZSBydW5uaW5nIGluIFBoYW50b21KUy5cbiAgICAgICAgICAgICAgICAgICAgICogVXBsb2FkaW5nIGEgQmxvYiB3aXRoIFBoYW50b21KUyBkb2VzIG5vdCB3b3JrIGNvcnJlY3RseSwgYXMgcmVwb3J0ZWQgaGVyZTpcbiAgICAgICAgICAgICAgICAgICAgICogaHR0cHM6Ly9naXRodWIuY29tL2FyaXlhL3BoYW50b21qcy9pc3N1ZXMvMTEzOTVcbiAgICAgICAgICAgICAgICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAgICAgICAgICAgICAgKi92YXIgaXNQaGFudG9tSlM9L1BoYW50b21KUy9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBXaGVuIHRydWUsIGF2b2lkcyB1c2luZyBCbG9icyB0byBlbmNvZGUgcGF5bG9hZHMuXG4gICAgICAgICAgICAgICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgICAgICAgICAgICAgICovdmFyIGRvbnRTZW5kQmxvYnM9aXNBbmRyb2lkIHx8IGlzUGhhbnRvbUpTOyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQ3VycmVudCBwcm90b2NvbCB2ZXJzaW9uLlxuICAgICAgICAgICAgICAgICAgICAgKi9leHBvcnRzLnByb3RvY29sID0gMzsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFBhY2tldCB0eXBlcy5cbiAgICAgICAgICAgICAgICAgICAgICovdmFyIHBhY2tldHM9ZXhwb3J0cy5wYWNrZXRzID0ge29wZW46MCwgLy8gbm9uLXdzXG5jbG9zZToxLCAvLyBub24td3NcbnBpbmc6Mixwb25nOjMsbWVzc2FnZTo0LHVwZ3JhZGU6NSxub29wOjZ9O3ZhciBwYWNrZXRzbGlzdD1rZXlzKHBhY2tldHMpOyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogUHJlbWFkZSBlcnJvciBwYWNrZXQuXG4gICAgICAgICAgICAgICAgICAgICAqL3ZhciBlcnI9e3R5cGU6J2Vycm9yJyxkYXRhOidwYXJzZXIgZXJyb3InfTsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIENyZWF0ZSBhIGJsb2IgYXBpIGV2ZW4gZm9yIGJsb2IgYnVpbGRlciB3aGVuIHZlbmRvciBwcmVmaXhlcyBleGlzdFxuICAgICAgICAgICAgICAgICAgICAgKi92YXIgQmxvYj1fZGVyZXFfKCdibG9iJyk7IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBFbmNvZGVzIGEgcGFja2V0LlxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiAgICAgPHBhY2tldCB0eXBlIGlkPiBbIDxkYXRhPiBdXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEV4YW1wbGU6XG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqICAgICA1aGVsbG8gd29ybGRcbiAgICAgICAgICAgICAgICAgICAgICogICAgIDNcbiAgICAgICAgICAgICAgICAgICAgICogICAgIDRcbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQmluYXJ5IGlzIGVuY29kZWQgaW4gYW4gaWRlbnRpY2FsIHByaW5jaXBsZVxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgICAgICovZXhwb3J0cy5lbmNvZGVQYWNrZXQgPSBmdW5jdGlvbihwYWNrZXQsc3VwcG9ydHNCaW5hcnksdXRmOGVuY29kZSxjYWxsYmFjayl7aWYoJ2Z1bmN0aW9uJyA9PSB0eXBlb2Ygc3VwcG9ydHNCaW5hcnkpe2NhbGxiYWNrID0gc3VwcG9ydHNCaW5hcnk7c3VwcG9ydHNCaW5hcnkgPSBmYWxzZTt9aWYoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgdXRmOGVuY29kZSl7Y2FsbGJhY2sgPSB1dGY4ZW5jb2RlO3V0ZjhlbmNvZGUgPSBudWxsO312YXIgZGF0YT1wYWNrZXQuZGF0YSA9PT0gdW5kZWZpbmVkP3VuZGVmaW5lZDpwYWNrZXQuZGF0YS5idWZmZXIgfHwgcGFja2V0LmRhdGE7aWYoZ2xvYmFsLkFycmF5QnVmZmVyICYmIGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcil7cmV0dXJuIGVuY29kZUFycmF5QnVmZmVyKHBhY2tldCxzdXBwb3J0c0JpbmFyeSxjYWxsYmFjayk7fWVsc2UgaWYoQmxvYiAmJiBkYXRhIGluc3RhbmNlb2YgZ2xvYmFsLkJsb2Ipe3JldHVybiBlbmNvZGVCbG9iKHBhY2tldCxzdXBwb3J0c0JpbmFyeSxjYWxsYmFjayk7fSAvLyBtaWdodCBiZSBhbiBvYmplY3Qgd2l0aCB7IGJhc2U2NDogdHJ1ZSwgZGF0YTogZGF0YUFzQmFzZTY0U3RyaW5nIH1cbmlmKGRhdGEgJiYgZGF0YS5iYXNlNjQpe3JldHVybiBlbmNvZGVCYXNlNjRPYmplY3QocGFja2V0LGNhbGxiYWNrKTt9IC8vIFNlbmRpbmcgZGF0YSBhcyBhIHV0Zi04IHN0cmluZ1xudmFyIGVuY29kZWQ9cGFja2V0c1twYWNrZXQudHlwZV07IC8vIGRhdGEgZnJhZ21lbnQgaXMgb3B0aW9uYWxcbmlmKHVuZGVmaW5lZCAhPT0gcGFja2V0LmRhdGEpe2VuY29kZWQgKz0gdXRmOGVuY29kZT91dGY4LmVuY29kZShTdHJpbmcocGFja2V0LmRhdGEpKTpTdHJpbmcocGFja2V0LmRhdGEpO31yZXR1cm4gY2FsbGJhY2soJycgKyBlbmNvZGVkKTt9O2Z1bmN0aW9uIGVuY29kZUJhc2U2NE9iamVjdChwYWNrZXQsY2FsbGJhY2speyAvLyBwYWNrZXQgZGF0YSBpcyBhbiBvYmplY3QgeyBiYXNlNjQ6IHRydWUsIGRhdGE6IGRhdGFBc0Jhc2U2NFN0cmluZyB9XG52YXIgbWVzc2FnZT0nYicgKyBleHBvcnRzLnBhY2tldHNbcGFja2V0LnR5cGVdICsgcGFja2V0LmRhdGEuZGF0YTtyZXR1cm4gY2FsbGJhY2sobWVzc2FnZSk7fSAvKipcbiAgICAgICAgICAgICAgICAgICAgICogRW5jb2RlIHBhY2tldCBoZWxwZXJzIGZvciBiaW5hcnkgdHlwZXNcbiAgICAgICAgICAgICAgICAgICAgICovZnVuY3Rpb24gZW5jb2RlQXJyYXlCdWZmZXIocGFja2V0LHN1cHBvcnRzQmluYXJ5LGNhbGxiYWNrKXtpZighc3VwcG9ydHNCaW5hcnkpe3JldHVybiBleHBvcnRzLmVuY29kZUJhc2U2NFBhY2tldChwYWNrZXQsY2FsbGJhY2spO312YXIgZGF0YT1wYWNrZXQuZGF0YTt2YXIgY29udGVudEFycmF5PW5ldyBVaW50OEFycmF5KGRhdGEpO3ZhciByZXN1bHRCdWZmZXI9bmV3IFVpbnQ4QXJyYXkoMSArIGRhdGEuYnl0ZUxlbmd0aCk7cmVzdWx0QnVmZmVyWzBdID0gcGFja2V0c1twYWNrZXQudHlwZV07Zm9yKHZhciBpPTA7aSA8IGNvbnRlbnRBcnJheS5sZW5ndGg7aSsrKSB7cmVzdWx0QnVmZmVyW2kgKyAxXSA9IGNvbnRlbnRBcnJheVtpXTt9cmV0dXJuIGNhbGxiYWNrKHJlc3VsdEJ1ZmZlci5idWZmZXIpO31mdW5jdGlvbiBlbmNvZGVCbG9iQXNBcnJheUJ1ZmZlcihwYWNrZXQsc3VwcG9ydHNCaW5hcnksY2FsbGJhY2spe2lmKCFzdXBwb3J0c0JpbmFyeSl7cmV0dXJuIGV4cG9ydHMuZW5jb2RlQmFzZTY0UGFja2V0KHBhY2tldCxjYWxsYmFjayk7fXZhciBmcj1uZXcgRmlsZVJlYWRlcigpO2ZyLm9ubG9hZCA9IGZ1bmN0aW9uKCl7cGFja2V0LmRhdGEgPSBmci5yZXN1bHQ7ZXhwb3J0cy5lbmNvZGVQYWNrZXQocGFja2V0LHN1cHBvcnRzQmluYXJ5LHRydWUsY2FsbGJhY2spO307cmV0dXJuIGZyLnJlYWRBc0FycmF5QnVmZmVyKHBhY2tldC5kYXRhKTt9ZnVuY3Rpb24gZW5jb2RlQmxvYihwYWNrZXQsc3VwcG9ydHNCaW5hcnksY2FsbGJhY2spe2lmKCFzdXBwb3J0c0JpbmFyeSl7cmV0dXJuIGV4cG9ydHMuZW5jb2RlQmFzZTY0UGFja2V0KHBhY2tldCxjYWxsYmFjayk7fWlmKGRvbnRTZW5kQmxvYnMpe3JldHVybiBlbmNvZGVCbG9iQXNBcnJheUJ1ZmZlcihwYWNrZXQsc3VwcG9ydHNCaW5hcnksY2FsbGJhY2spO312YXIgbGVuZ3RoPW5ldyBVaW50OEFycmF5KDEpO2xlbmd0aFswXSA9IHBhY2tldHNbcGFja2V0LnR5cGVdO3ZhciBibG9iPW5ldyBCbG9iKFtsZW5ndGguYnVmZmVyLHBhY2tldC5kYXRhXSk7cmV0dXJuIGNhbGxiYWNrKGJsb2IpO30gLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEVuY29kZXMgYSBwYWNrZXQgd2l0aCBiaW5hcnkgZGF0YSBpbiBhIGJhc2U2NCBzdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhY2tldCwgaGFzIGB0eXBlYCBhbmQgYGRhdGFgXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ30gYmFzZTY0IGVuY29kZWQgbWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICAgKi9leHBvcnRzLmVuY29kZUJhc2U2NFBhY2tldCA9IGZ1bmN0aW9uKHBhY2tldCxjYWxsYmFjayl7dmFyIG1lc3NhZ2U9J2InICsgZXhwb3J0cy5wYWNrZXRzW3BhY2tldC50eXBlXTtpZihCbG9iICYmIHBhY2tldC5kYXRhIGluc3RhbmNlb2YgZ2xvYmFsLkJsb2Ipe3ZhciBmcj1uZXcgRmlsZVJlYWRlcigpO2ZyLm9ubG9hZCA9IGZ1bmN0aW9uKCl7dmFyIGI2ND1mci5yZXN1bHQuc3BsaXQoJywnKVsxXTtjYWxsYmFjayhtZXNzYWdlICsgYjY0KTt9O3JldHVybiBmci5yZWFkQXNEYXRhVVJMKHBhY2tldC5kYXRhKTt9dmFyIGI2NGRhdGE7dHJ5e2I2NGRhdGEgPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsbmV3IFVpbnQ4QXJyYXkocGFja2V0LmRhdGEpKTt9Y2F0Y2goZSkgeyAvLyBpUGhvbmUgU2FmYXJpIGRvZXNuJ3QgbGV0IHlvdSBhcHBseSB3aXRoIHR5cGVkIGFycmF5c1xudmFyIHR5cGVkPW5ldyBVaW50OEFycmF5KHBhY2tldC5kYXRhKTt2YXIgYmFzaWM9bmV3IEFycmF5KHR5cGVkLmxlbmd0aCk7Zm9yKHZhciBpPTA7aSA8IHR5cGVkLmxlbmd0aDtpKyspIHtiYXNpY1tpXSA9IHR5cGVkW2ldO31iNjRkYXRhID0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLGJhc2ljKTt9bWVzc2FnZSArPSBnbG9iYWwuYnRvYShiNjRkYXRhKTtyZXR1cm4gY2FsbGJhY2sobWVzc2FnZSk7fTsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIERlY29kZXMgYSBwYWNrZXQuIENoYW5nZXMgZm9ybWF0IHRvIEJsb2IgaWYgcmVxdWVzdGVkLlxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHdpdGggYHR5cGVgIGFuZCBgZGF0YWAgKGlmIGFueSlcbiAgICAgICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICAgICAqL2V4cG9ydHMuZGVjb2RlUGFja2V0ID0gZnVuY3Rpb24oZGF0YSxiaW5hcnlUeXBlLHV0ZjhkZWNvZGUpeyAvLyBTdHJpbmcgZGF0YVxuaWYodHlwZW9mIGRhdGEgPT0gJ3N0cmluZycgfHwgZGF0YSA9PT0gdW5kZWZpbmVkKXtpZihkYXRhLmNoYXJBdCgwKSA9PSAnYicpe3JldHVybiBleHBvcnRzLmRlY29kZUJhc2U2NFBhY2tldChkYXRhLnN1YnN0cigxKSxiaW5hcnlUeXBlKTt9aWYodXRmOGRlY29kZSl7dHJ5e2RhdGEgPSB1dGY4LmRlY29kZShkYXRhKTt9Y2F0Y2goZSkge3JldHVybiBlcnI7fX12YXIgdHlwZT1kYXRhLmNoYXJBdCgwKTtpZihOdW1iZXIodHlwZSkgIT0gdHlwZSB8fCAhcGFja2V0c2xpc3RbdHlwZV0pe3JldHVybiBlcnI7fWlmKGRhdGEubGVuZ3RoID4gMSl7cmV0dXJuIHt0eXBlOnBhY2tldHNsaXN0W3R5cGVdLGRhdGE6ZGF0YS5zdWJzdHJpbmcoMSl9O31lbHNlIHtyZXR1cm4ge3R5cGU6cGFja2V0c2xpc3RbdHlwZV19O319dmFyIGFzQXJyYXk9bmV3IFVpbnQ4QXJyYXkoZGF0YSk7dmFyIHR5cGU9YXNBcnJheVswXTt2YXIgcmVzdD1zbGljZUJ1ZmZlcihkYXRhLDEpO2lmKEJsb2IgJiYgYmluYXJ5VHlwZSA9PT0gJ2Jsb2InKXtyZXN0ID0gbmV3IEJsb2IoW3Jlc3RdKTt9cmV0dXJuIHt0eXBlOnBhY2tldHNsaXN0W3R5cGVdLGRhdGE6cmVzdH07fTsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIERlY29kZXMgYSBwYWNrZXQgZW5jb2RlZCBpbiBhIGJhc2U2NCBzdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGJhc2U2NCBlbmNvZGVkIG1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSB3aXRoIGB0eXBlYCBhbmQgYGRhdGFgIChpZiBhbnkpXG4gICAgICAgICAgICAgICAgICAgICAqL2V4cG9ydHMuZGVjb2RlQmFzZTY0UGFja2V0ID0gZnVuY3Rpb24obXNnLGJpbmFyeVR5cGUpe3ZhciB0eXBlPXBhY2tldHNsaXN0W21zZy5jaGFyQXQoMCldO2lmKCFnbG9iYWwuQXJyYXlCdWZmZXIpe3JldHVybiB7dHlwZTp0eXBlLGRhdGE6e2Jhc2U2NDp0cnVlLGRhdGE6bXNnLnN1YnN0cigxKX19O312YXIgZGF0YT1iYXNlNjRlbmNvZGVyLmRlY29kZShtc2cuc3Vic3RyKDEpKTtpZihiaW5hcnlUeXBlID09PSAnYmxvYicgJiYgQmxvYil7ZGF0YSA9IG5ldyBCbG9iKFtkYXRhXSk7fXJldHVybiB7dHlwZTp0eXBlLGRhdGE6ZGF0YX07fTsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEVuY29kZXMgbXVsdGlwbGUgbWVzc2FnZXMgKHBheWxvYWQpLlxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiAgICAgPGxlbmd0aD46ZGF0YVxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBFeGFtcGxlOlxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiAgICAgMTE6aGVsbG8gd29ybGQyOmhpXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIElmIGFueSBjb250ZW50cyBhcmUgYmluYXJ5LCB0aGV5IHdpbGwgYmUgZW5jb2RlZCBhcyBiYXNlNjQgc3RyaW5ncy4gQmFzZTY0XG4gICAgICAgICAgICAgICAgICAgICAqIGVuY29kZWQgc3RyaW5ncyBhcmUgbWFya2VkIHdpdGggYSBiIGJlZm9yZSB0aGUgbGVuZ3RoIHNwZWNpZmllclxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBwYWNrZXRzXG4gICAgICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAgICAgKi9leHBvcnRzLmVuY29kZVBheWxvYWQgPSBmdW5jdGlvbihwYWNrZXRzLHN1cHBvcnRzQmluYXJ5LGNhbGxiYWNrKXtpZih0eXBlb2Ygc3VwcG9ydHNCaW5hcnkgPT0gJ2Z1bmN0aW9uJyl7Y2FsbGJhY2sgPSBzdXBwb3J0c0JpbmFyeTtzdXBwb3J0c0JpbmFyeSA9IG51bGw7fXZhciBpc0JpbmFyeT1oYXNCaW5hcnkocGFja2V0cyk7aWYoc3VwcG9ydHNCaW5hcnkgJiYgaXNCaW5hcnkpe2lmKEJsb2IgJiYgIWRvbnRTZW5kQmxvYnMpe3JldHVybiBleHBvcnRzLmVuY29kZVBheWxvYWRBc0Jsb2IocGFja2V0cyxjYWxsYmFjayk7fXJldHVybiBleHBvcnRzLmVuY29kZVBheWxvYWRBc0FycmF5QnVmZmVyKHBhY2tldHMsY2FsbGJhY2spO31pZighcGFja2V0cy5sZW5ndGgpe3JldHVybiBjYWxsYmFjaygnMDonKTt9ZnVuY3Rpb24gc2V0TGVuZ3RoSGVhZGVyKG1lc3NhZ2Upe3JldHVybiBtZXNzYWdlLmxlbmd0aCArICc6JyArIG1lc3NhZ2U7fWZ1bmN0aW9uIGVuY29kZU9uZShwYWNrZXQsZG9uZUNhbGxiYWNrKXtleHBvcnRzLmVuY29kZVBhY2tldChwYWNrZXQsIWlzQmluYXJ5P2ZhbHNlOnN1cHBvcnRzQmluYXJ5LHRydWUsZnVuY3Rpb24obWVzc2FnZSl7ZG9uZUNhbGxiYWNrKG51bGwsc2V0TGVuZ3RoSGVhZGVyKG1lc3NhZ2UpKTt9KTt9bWFwKHBhY2tldHMsZW5jb2RlT25lLGZ1bmN0aW9uKGVycixyZXN1bHRzKXtyZXR1cm4gY2FsbGJhY2socmVzdWx0cy5qb2luKCcnKSk7fSk7fTsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEFzeW5jIGFycmF5IG1hcCB1c2luZyBhZnRlclxuICAgICAgICAgICAgICAgICAgICAgKi9mdW5jdGlvbiBtYXAoYXJ5LGVhY2gsZG9uZSl7dmFyIHJlc3VsdD1uZXcgQXJyYXkoYXJ5Lmxlbmd0aCk7dmFyIG5leHQ9YWZ0ZXIoYXJ5Lmxlbmd0aCxkb25lKTt2YXIgZWFjaFdpdGhJbmRleD1mdW5jdGlvbiBlYWNoV2l0aEluZGV4KGksZWwsY2Ipe2VhY2goZWwsZnVuY3Rpb24oZXJyb3IsbXNnKXtyZXN1bHRbaV0gPSBtc2c7Y2IoZXJyb3IscmVzdWx0KTt9KTt9O2Zvcih2YXIgaT0wO2kgPCBhcnkubGVuZ3RoO2krKykge2VhY2hXaXRoSW5kZXgoaSxhcnlbaV0sbmV4dCk7fX0gLypcbiAgICAgICAgICAgICAgICAgICAgICogRGVjb2RlcyBkYXRhIHdoZW4gYSBwYXlsb2FkIGlzIG1heWJlIGV4cGVjdGVkLiBQb3NzaWJsZSBiaW5hcnkgY29udGVudHMgYXJlXG4gICAgICAgICAgICAgICAgICAgICAqIGRlY29kZWQgZnJvbSB0aGVpciBiYXNlNjQgcmVwcmVzZW50YXRpb25cbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGEsIGNhbGxiYWNrIG1ldGhvZFxuICAgICAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAgICAgKi9leHBvcnRzLmRlY29kZVBheWxvYWQgPSBmdW5jdGlvbihkYXRhLGJpbmFyeVR5cGUsY2FsbGJhY2spe2lmKHR5cGVvZiBkYXRhICE9ICdzdHJpbmcnKXtyZXR1cm4gZXhwb3J0cy5kZWNvZGVQYXlsb2FkQXNCaW5hcnkoZGF0YSxiaW5hcnlUeXBlLGNhbGxiYWNrKTt9aWYodHlwZW9mIGJpbmFyeVR5cGUgPT09ICdmdW5jdGlvbicpe2NhbGxiYWNrID0gYmluYXJ5VHlwZTtiaW5hcnlUeXBlID0gbnVsbDt9dmFyIHBhY2tldDtpZihkYXRhID09ICcnKXsgLy8gcGFyc2VyIGVycm9yIC0gaWdub3JpbmcgcGF5bG9hZFxucmV0dXJuIGNhbGxiYWNrKGVyciwwLDEpO312YXIgbGVuZ3RoPScnLG4sbXNnO2Zvcih2YXIgaT0wLGw9ZGF0YS5sZW5ndGg7aSA8IGw7aSsrKSB7dmFyIGNocj1kYXRhLmNoYXJBdChpKTtpZignOicgIT0gY2hyKXtsZW5ndGggKz0gY2hyO31lbHNlIHtpZignJyA9PSBsZW5ndGggfHwgbGVuZ3RoICE9IChuID0gTnVtYmVyKGxlbmd0aCkpKXsgLy8gcGFyc2VyIGVycm9yIC0gaWdub3JpbmcgcGF5bG9hZFxucmV0dXJuIGNhbGxiYWNrKGVyciwwLDEpO31tc2cgPSBkYXRhLnN1YnN0cihpICsgMSxuKTtpZihsZW5ndGggIT0gbXNnLmxlbmd0aCl7IC8vIHBhcnNlciBlcnJvciAtIGlnbm9yaW5nIHBheWxvYWRcbnJldHVybiBjYWxsYmFjayhlcnIsMCwxKTt9aWYobXNnLmxlbmd0aCl7cGFja2V0ID0gZXhwb3J0cy5kZWNvZGVQYWNrZXQobXNnLGJpbmFyeVR5cGUsdHJ1ZSk7aWYoZXJyLnR5cGUgPT0gcGFja2V0LnR5cGUgJiYgZXJyLmRhdGEgPT0gcGFja2V0LmRhdGEpeyAvLyBwYXJzZXIgZXJyb3IgaW4gaW5kaXZpZHVhbCBwYWNrZXQgLSBpZ25vcmluZyBwYXlsb2FkXG5yZXR1cm4gY2FsbGJhY2soZXJyLDAsMSk7fXZhciByZXQ9Y2FsbGJhY2socGFja2V0LGkgKyBuLGwpO2lmKGZhbHNlID09PSByZXQpcmV0dXJuO30gLy8gYWR2YW5jZSBjdXJzb3JcbmkgKz0gbjtsZW5ndGggPSAnJzt9fWlmKGxlbmd0aCAhPSAnJyl7IC8vIHBhcnNlciBlcnJvciAtIGlnbm9yaW5nIHBheWxvYWRcbnJldHVybiBjYWxsYmFjayhlcnIsMCwxKTt9fTsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEVuY29kZXMgbXVsdGlwbGUgbWVzc2FnZXMgKHBheWxvYWQpIGFzIGJpbmFyeS5cbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogPDEgPSBiaW5hcnksIDAgPSBzdHJpbmc+PG51bWJlciBmcm9tIDAtOT48bnVtYmVyIGZyb20gMC05PlsuLi5dPG51bWJlclxuICAgICAgICAgICAgICAgICAgICAgKiAyNTU+PGRhdGE+XG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEV4YW1wbGU6XG4gICAgICAgICAgICAgICAgICAgICAqIDEgMyAyNTUgMSAyIDMsIGlmIHRoZSBiaW5hcnkgY29udGVudHMgYXJlIGludGVycHJldGVkIGFzIDggYml0IGludGVnZXJzXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7QXJyYXl9IHBhY2tldHNcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7QXJyYXlCdWZmZXJ9IGVuY29kZWQgcGF5bG9hZFxuICAgICAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgICAgICovZXhwb3J0cy5lbmNvZGVQYXlsb2FkQXNBcnJheUJ1ZmZlciA9IGZ1bmN0aW9uKHBhY2tldHMsY2FsbGJhY2spe2lmKCFwYWNrZXRzLmxlbmd0aCl7cmV0dXJuIGNhbGxiYWNrKG5ldyBBcnJheUJ1ZmZlcigwKSk7fWZ1bmN0aW9uIGVuY29kZU9uZShwYWNrZXQsZG9uZUNhbGxiYWNrKXtleHBvcnRzLmVuY29kZVBhY2tldChwYWNrZXQsdHJ1ZSx0cnVlLGZ1bmN0aW9uKGRhdGEpe3JldHVybiBkb25lQ2FsbGJhY2sobnVsbCxkYXRhKTt9KTt9bWFwKHBhY2tldHMsZW5jb2RlT25lLGZ1bmN0aW9uKGVycixlbmNvZGVkUGFja2V0cyl7dmFyIHRvdGFsTGVuZ3RoPWVuY29kZWRQYWNrZXRzLnJlZHVjZShmdW5jdGlvbihhY2MscCl7dmFyIGxlbjtpZih0eXBlb2YgcCA9PT0gJ3N0cmluZycpe2xlbiA9IHAubGVuZ3RoO31lbHNlIHtsZW4gPSBwLmJ5dGVMZW5ndGg7fXJldHVybiBhY2MgKyBsZW4udG9TdHJpbmcoKS5sZW5ndGggKyBsZW4gKyAyOyAvLyBzdHJpbmcvYmluYXJ5IGlkZW50aWZpZXIgKyBzZXBhcmF0b3IgPSAyXG59LDApO3ZhciByZXN1bHRBcnJheT1uZXcgVWludDhBcnJheSh0b3RhbExlbmd0aCk7dmFyIGJ1ZmZlckluZGV4PTA7ZW5jb2RlZFBhY2tldHMuZm9yRWFjaChmdW5jdGlvbihwKXt2YXIgaXNTdHJpbmc9dHlwZW9mIHAgPT09ICdzdHJpbmcnO3ZhciBhYj1wO2lmKGlzU3RyaW5nKXt2YXIgdmlldz1uZXcgVWludDhBcnJheShwLmxlbmd0aCk7Zm9yKHZhciBpPTA7aSA8IHAubGVuZ3RoO2krKykge3ZpZXdbaV0gPSBwLmNoYXJDb2RlQXQoaSk7fWFiID0gdmlldy5idWZmZXI7fWlmKGlzU3RyaW5nKXsgLy8gbm90IHRydWUgYmluYXJ5XG5yZXN1bHRBcnJheVtidWZmZXJJbmRleCsrXSA9IDA7fWVsc2UgeyAvLyB0cnVlIGJpbmFyeVxucmVzdWx0QXJyYXlbYnVmZmVySW5kZXgrK10gPSAxO312YXIgbGVuU3RyPWFiLmJ5dGVMZW5ndGgudG9TdHJpbmcoKTtmb3IodmFyIGk9MDtpIDwgbGVuU3RyLmxlbmd0aDtpKyspIHtyZXN1bHRBcnJheVtidWZmZXJJbmRleCsrXSA9IHBhcnNlSW50KGxlblN0cltpXSk7fXJlc3VsdEFycmF5W2J1ZmZlckluZGV4KytdID0gMjU1O3ZhciB2aWV3PW5ldyBVaW50OEFycmF5KGFiKTtmb3IodmFyIGk9MDtpIDwgdmlldy5sZW5ndGg7aSsrKSB7cmVzdWx0QXJyYXlbYnVmZmVySW5kZXgrK10gPSB2aWV3W2ldO319KTtyZXR1cm4gY2FsbGJhY2socmVzdWx0QXJyYXkuYnVmZmVyKTt9KTt9OyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogRW5jb2RlIGFzIEJsb2JcbiAgICAgICAgICAgICAgICAgICAgICovZXhwb3J0cy5lbmNvZGVQYXlsb2FkQXNCbG9iID0gZnVuY3Rpb24ocGFja2V0cyxjYWxsYmFjayl7ZnVuY3Rpb24gZW5jb2RlT25lKHBhY2tldCxkb25lQ2FsbGJhY2spe2V4cG9ydHMuZW5jb2RlUGFja2V0KHBhY2tldCx0cnVlLHRydWUsZnVuY3Rpb24oZW5jb2RlZCl7dmFyIGJpbmFyeUlkZW50aWZpZXI9bmV3IFVpbnQ4QXJyYXkoMSk7YmluYXJ5SWRlbnRpZmllclswXSA9IDE7aWYodHlwZW9mIGVuY29kZWQgPT09ICdzdHJpbmcnKXt2YXIgdmlldz1uZXcgVWludDhBcnJheShlbmNvZGVkLmxlbmd0aCk7Zm9yKHZhciBpPTA7aSA8IGVuY29kZWQubGVuZ3RoO2krKykge3ZpZXdbaV0gPSBlbmNvZGVkLmNoYXJDb2RlQXQoaSk7fWVuY29kZWQgPSB2aWV3LmJ1ZmZlcjtiaW5hcnlJZGVudGlmaWVyWzBdID0gMDt9dmFyIGxlbj1lbmNvZGVkIGluc3RhbmNlb2YgQXJyYXlCdWZmZXI/ZW5jb2RlZC5ieXRlTGVuZ3RoOmVuY29kZWQuc2l6ZTt2YXIgbGVuU3RyPWxlbi50b1N0cmluZygpO3ZhciBsZW5ndGhBcnk9bmV3IFVpbnQ4QXJyYXkobGVuU3RyLmxlbmd0aCArIDEpO2Zvcih2YXIgaT0wO2kgPCBsZW5TdHIubGVuZ3RoO2krKykge2xlbmd0aEFyeVtpXSA9IHBhcnNlSW50KGxlblN0cltpXSk7fWxlbmd0aEFyeVtsZW5TdHIubGVuZ3RoXSA9IDI1NTtpZihCbG9iKXt2YXIgYmxvYj1uZXcgQmxvYihbYmluYXJ5SWRlbnRpZmllci5idWZmZXIsbGVuZ3RoQXJ5LmJ1ZmZlcixlbmNvZGVkXSk7ZG9uZUNhbGxiYWNrKG51bGwsYmxvYik7fX0pO31tYXAocGFja2V0cyxlbmNvZGVPbmUsZnVuY3Rpb24oZXJyLHJlc3VsdHMpe3JldHVybiBjYWxsYmFjayhuZXcgQmxvYihyZXN1bHRzKSk7fSk7fTsgLypcbiAgICAgICAgICAgICAgICAgICAgICogRGVjb2RlcyBkYXRhIHdoZW4gYSBwYXlsb2FkIGlzIG1heWJlIGV4cGVjdGVkLiBTdHJpbmdzIGFyZSBkZWNvZGVkIGJ5XG4gICAgICAgICAgICAgICAgICAgICAqIGludGVycHJldGluZyBlYWNoIGJ5dGUgYXMgYSBrZXkgY29kZSBmb3IgZW50cmllcyBtYXJrZWQgdG8gc3RhcnQgd2l0aCAwLiBTZWVcbiAgICAgICAgICAgICAgICAgICAgICogZGVzY3JpcHRpb24gb2YgZW5jb2RlUGF5bG9hZEFzQmluYXJ5XG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9IGRhdGEsIGNhbGxiYWNrIG1ldGhvZFxuICAgICAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAgICAgKi9leHBvcnRzLmRlY29kZVBheWxvYWRBc0JpbmFyeSA9IGZ1bmN0aW9uKGRhdGEsYmluYXJ5VHlwZSxjYWxsYmFjayl7aWYodHlwZW9mIGJpbmFyeVR5cGUgPT09ICdmdW5jdGlvbicpe2NhbGxiYWNrID0gYmluYXJ5VHlwZTtiaW5hcnlUeXBlID0gbnVsbDt9dmFyIGJ1ZmZlclRhaWw9ZGF0YTt2YXIgYnVmZmVycz1bXTt2YXIgbnVtYmVyVG9vTG9uZz1mYWxzZTt3aGlsZShidWZmZXJUYWlsLmJ5dGVMZW5ndGggPiAwKSB7dmFyIHRhaWxBcnJheT1uZXcgVWludDhBcnJheShidWZmZXJUYWlsKTt2YXIgaXNTdHJpbmc9dGFpbEFycmF5WzBdID09PSAwO3ZhciBtc2dMZW5ndGg9Jyc7Zm9yKHZhciBpPTE7O2krKykge2lmKHRhaWxBcnJheVtpXSA9PSAyNTUpYnJlYWs7aWYobXNnTGVuZ3RoLmxlbmd0aCA+IDMxMCl7bnVtYmVyVG9vTG9uZyA9IHRydWU7YnJlYWs7fW1zZ0xlbmd0aCArPSB0YWlsQXJyYXlbaV07fWlmKG51bWJlclRvb0xvbmcpcmV0dXJuIGNhbGxiYWNrKGVyciwwLDEpO2J1ZmZlclRhaWwgPSBzbGljZUJ1ZmZlcihidWZmZXJUYWlsLDIgKyBtc2dMZW5ndGgubGVuZ3RoKTttc2dMZW5ndGggPSBwYXJzZUludChtc2dMZW5ndGgpO3ZhciBtc2c9c2xpY2VCdWZmZXIoYnVmZmVyVGFpbCwwLG1zZ0xlbmd0aCk7aWYoaXNTdHJpbmcpe3RyeXttc2cgPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsbmV3IFVpbnQ4QXJyYXkobXNnKSk7fWNhdGNoKGUpIHsgLy8gaVBob25lIFNhZmFyaSBkb2Vzbid0IGxldCB5b3UgYXBwbHkgdG8gdHlwZWQgYXJyYXlzXG52YXIgdHlwZWQ9bmV3IFVpbnQ4QXJyYXkobXNnKTttc2cgPSAnJztmb3IodmFyIGk9MDtpIDwgdHlwZWQubGVuZ3RoO2krKykge21zZyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHR5cGVkW2ldKTt9fX1idWZmZXJzLnB1c2gobXNnKTtidWZmZXJUYWlsID0gc2xpY2VCdWZmZXIoYnVmZmVyVGFpbCxtc2dMZW5ndGgpO312YXIgdG90YWw9YnVmZmVycy5sZW5ndGg7YnVmZmVycy5mb3JFYWNoKGZ1bmN0aW9uKGJ1ZmZlcixpKXtjYWxsYmFjayhleHBvcnRzLmRlY29kZVBhY2tldChidWZmZXIsYmluYXJ5VHlwZSx0cnVlKSxpLHRvdGFsKTt9KTt9O30pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIj9zZWxmOnR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCI/d2luZG93OnR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCI/Z2xvYmFsOnt9KTt9LHtcIi4va2V5c1wiOjIwLFwiYWZ0ZXJcIjoxMSxcImFycmF5YnVmZmVyLnNsaWNlXCI6MTIsXCJiYXNlNjQtYXJyYXlidWZmZXJcIjoxMyxcImJsb2JcIjoxNCxcImhhcy1iaW5hcnlcIjoyMSxcInV0ZjhcIjoyOX1dLDIwOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXsgLyoqXG4gICAgICAgICAgICAgICAgICogR2V0cyB0aGUga2V5cyBmb3IgYW4gb2JqZWN0LlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7QXJyYXl9IGtleXNcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKi9tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMob2JqKXt2YXIgYXJyPVtdO3ZhciBoYXM9T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtmb3IodmFyIGkgaW4gb2JqKSB7aWYoaGFzLmNhbGwob2JqLGkpKXthcnIucHVzaChpKTt9fXJldHVybiBhcnI7fTt9LHt9XSwyMTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKGdsb2JhbCl7IC8qXG4gICAgICAgICAgICAgICAgICAgICAqIE1vZHVsZSByZXF1aXJlbWVudHMuXG4gICAgICAgICAgICAgICAgICAgICAqL3ZhciBpc0FycmF5PV9kZXJlcV8oJ2lzYXJyYXknKTsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIE1vZHVsZSBleHBvcnRzLlxuICAgICAgICAgICAgICAgICAgICAgKi9tb2R1bGUuZXhwb3J0cyA9IGhhc0JpbmFyeTsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIENoZWNrcyBmb3IgYmluYXJ5IGRhdGEuXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIFJpZ2h0IG5vdyBvbmx5IEJ1ZmZlciBhbmQgQXJyYXlCdWZmZXIgYXJlIHN1cHBvcnRlZC4uXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhbnl0aGluZ1xuICAgICAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAgICAgKi9mdW5jdGlvbiBoYXNCaW5hcnkoZGF0YSl7ZnVuY3Rpb24gX2hhc0JpbmFyeShvYmope2lmKCFvYmopcmV0dXJuIGZhbHNlO2lmKGdsb2JhbC5CdWZmZXIgJiYgZ2xvYmFsLkJ1ZmZlci5pc0J1ZmZlcihvYmopIHx8IGdsb2JhbC5BcnJheUJ1ZmZlciAmJiBvYmogaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciB8fCBnbG9iYWwuQmxvYiAmJiBvYmogaW5zdGFuY2VvZiBCbG9iIHx8IGdsb2JhbC5GaWxlICYmIG9iaiBpbnN0YW5jZW9mIEZpbGUpe3JldHVybiB0cnVlO31pZihpc0FycmF5KG9iaikpe2Zvcih2YXIgaT0wO2kgPCBvYmoubGVuZ3RoO2krKykge2lmKF9oYXNCaW5hcnkob2JqW2ldKSl7cmV0dXJuIHRydWU7fX19ZWxzZSBpZihvYmogJiYgJ29iamVjdCcgPT0gdHlwZW9mIG9iail7aWYob2JqLnRvSlNPTil7b2JqID0gb2JqLnRvSlNPTigpO31mb3IodmFyIGtleSBpbiBvYmopIHtpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLGtleSkgJiYgX2hhc0JpbmFyeShvYmpba2V5XSkpe3JldHVybiB0cnVlO319fXJldHVybiBmYWxzZTt9cmV0dXJuIF9oYXNCaW5hcnkoZGF0YSk7fX0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIj9zZWxmOnR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCI/d2luZG93OnR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCI/Z2xvYmFsOnt9KTt9LHtcImlzYXJyYXlcIjoyNH1dLDIyOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXsgLyoqXG4gICAgICAgICAgICAgICAgICogTW9kdWxlIGV4cG9ydHMuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBMb2dpYyBib3Jyb3dlZCBmcm9tIE1vZGVybml6cjpcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqICAgLSBodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9ibG9iL21hc3Rlci9mZWF0dXJlLWRldGVjdHMvY29ycy5qc1xuICAgICAgICAgICAgICAgICAqL3RyeXttb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcgJiYgJ3dpdGhDcmVkZW50aWFscycgaW4gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7fWNhdGNoKGVycikgeyAvLyBpZiBYTUxIdHRwIHN1cHBvcnQgaXMgZGlzYWJsZWQgaW4gSUUgdGhlbiBpdCB3aWxsIHRocm93XG4vLyB3aGVuIHRyeWluZyB0byBjcmVhdGVcbm1vZHVsZS5leHBvcnRzID0gZmFsc2U7fX0se31dLDIzOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXt2YXIgaW5kZXhPZj1bXS5pbmRleE9mO21vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYXJyLG9iail7aWYoaW5kZXhPZilyZXR1cm4gYXJyLmluZGV4T2Yob2JqKTtmb3IodmFyIGk9MDtpIDwgYXJyLmxlbmd0aDsrK2kpIHtpZihhcnJbaV0gPT09IG9iailyZXR1cm4gaTt9cmV0dXJuIC0xO307fSx7fV0sMjQ6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe21vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbihhcnIpe3JldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJyKSA9PSAnW29iamVjdCBBcnJheV0nO307fSx7fV0sMjU6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpeyAvKipcbiAgICAgICAgICAgICAgICAgKiBIZWxwZXJzLlxuICAgICAgICAgICAgICAgICAqL3ZhciBzPTEwMDA7dmFyIG09cyAqIDYwO3ZhciBoPW0gKiA2MDt2YXIgZD1oICogMjQ7dmFyIHk9ZCAqIDM2NS4yNTsgLyoqXG4gICAgICAgICAgICAgICAgICogUGFyc2Ugb3IgZm9ybWF0IHRoZSBnaXZlbiBgdmFsYC5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIE9wdGlvbnM6XG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiAgLSBgbG9uZ2AgdmVyYm9zZSBmb3JtYXR0aW5nIFtmYWxzZV1cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gdmFsXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd8TnVtYmVyfVxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAgICAgICAgICovbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih2YWwsb3B0aW9ucyl7b3B0aW9ucyA9IG9wdGlvbnMgfHwge307aWYoJ3N0cmluZycgPT0gdHlwZW9mIHZhbClyZXR1cm4gcGFyc2UodmFsKTtyZXR1cm4gb3B0aW9ucy5sb25nP2xvbmcodmFsKTpzaG9ydCh2YWwpO307IC8qKlxuICAgICAgICAgICAgICAgICAqIFBhcnNlIHRoZSBnaXZlbiBgc3RyYCBhbmQgcmV0dXJuIG1pbGxpc2Vjb25kcy5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICovZnVuY3Rpb24gcGFyc2Uoc3RyKXtzdHIgPSAnJyArIHN0cjtpZihzdHIubGVuZ3RoID4gMTAwMDApcmV0dXJuO3ZhciBtYXRjaD0vXigoPzpcXGQrKT9cXC4/XFxkKykgKihtaWxsaXNlY29uZHM/fG1zZWNzP3xtc3xzZWNvbmRzP3xzZWNzP3xzfG1pbnV0ZXM/fG1pbnM/fG18aG91cnM/fGhycz98aHxkYXlzP3xkfHllYXJzP3x5cnM/fHkpPyQvaS5leGVjKHN0cik7aWYoIW1hdGNoKXJldHVybjt2YXIgbj1wYXJzZUZsb2F0KG1hdGNoWzFdKTt2YXIgdHlwZT0obWF0Y2hbMl0gfHwgJ21zJykudG9Mb3dlckNhc2UoKTtzd2l0Y2godHlwZSl7Y2FzZSAneWVhcnMnOmNhc2UgJ3llYXInOmNhc2UgJ3lycyc6Y2FzZSAneXInOmNhc2UgJ3knOnJldHVybiBuICogeTtjYXNlICdkYXlzJzpjYXNlICdkYXknOmNhc2UgJ2QnOnJldHVybiBuICogZDtjYXNlICdob3Vycyc6Y2FzZSAnaG91cic6Y2FzZSAnaHJzJzpjYXNlICdocic6Y2FzZSAnaCc6cmV0dXJuIG4gKiBoO2Nhc2UgJ21pbnV0ZXMnOmNhc2UgJ21pbnV0ZSc6Y2FzZSAnbWlucyc6Y2FzZSAnbWluJzpjYXNlICdtJzpyZXR1cm4gbiAqIG07Y2FzZSAnc2Vjb25kcyc6Y2FzZSAnc2Vjb25kJzpjYXNlICdzZWNzJzpjYXNlICdzZWMnOmNhc2UgJ3MnOnJldHVybiBuICogcztjYXNlICdtaWxsaXNlY29uZHMnOmNhc2UgJ21pbGxpc2Vjb25kJzpjYXNlICdtc2Vjcyc6Y2FzZSAnbXNlYyc6Y2FzZSAnbXMnOnJldHVybiBuO319IC8qKlxuICAgICAgICAgICAgICAgICAqIFNob3J0IGZvcm1hdCBmb3IgYG1zYC5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBtc1xuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKi9mdW5jdGlvbiBzaG9ydChtcyl7aWYobXMgPj0gZClyZXR1cm4gTWF0aC5yb3VuZChtcyAvIGQpICsgJ2QnO2lmKG1zID49IGgpcmV0dXJuIE1hdGgucm91bmQobXMgLyBoKSArICdoJztpZihtcyA+PSBtKXJldHVybiBNYXRoLnJvdW5kKG1zIC8gbSkgKyAnbSc7aWYobXMgPj0gcylyZXR1cm4gTWF0aC5yb3VuZChtcyAvIHMpICsgJ3MnO3JldHVybiBtcyArICdtcyc7fSAvKipcbiAgICAgICAgICAgICAgICAgKiBMb25nIGZvcm1hdCBmb3IgYG1zYC5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBtc1xuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKi9mdW5jdGlvbiBsb25nKG1zKXtyZXR1cm4gcGx1cmFsKG1zLGQsJ2RheScpIHx8IHBsdXJhbChtcyxoLCdob3VyJykgfHwgcGx1cmFsKG1zLG0sJ21pbnV0ZScpIHx8IHBsdXJhbChtcyxzLCdzZWNvbmQnKSB8fCBtcyArICcgbXMnO30gLyoqXG4gICAgICAgICAgICAgICAgICogUGx1cmFsaXphdGlvbiBoZWxwZXIuXG4gICAgICAgICAgICAgICAgICovZnVuY3Rpb24gcGx1cmFsKG1zLG4sbmFtZSl7aWYobXMgPCBuKXJldHVybjtpZihtcyA8IG4gKiAxLjUpcmV0dXJuIE1hdGguZmxvb3IobXMgLyBuKSArICcgJyArIG5hbWU7cmV0dXJuIE1hdGguY2VpbChtcyAvIG4pICsgJyAnICsgbmFtZSArICdzJzt9fSx7fV0sMjY6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihnbG9iYWwpeyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogSlNPTiBwYXJzZS5cbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHNlZSBCYXNlZCBvbiBqUXVlcnkjcGFyc2VKU09OIChNSVQpIGFuZCBKU09OMlxuICAgICAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgICAgICovdmFyIHJ2YWxpZGNoYXJzPS9eW1xcXSw6e31cXHNdKiQvO3ZhciBydmFsaWRlc2NhcGU9L1xcXFwoPzpbXCJcXFxcXFwvYmZucnRdfHVbMC05YS1mQS1GXXs0fSkvZzt2YXIgcnZhbGlkdG9rZW5zPS9cIlteXCJcXFxcXFxuXFxyXSpcInx0cnVlfGZhbHNlfG51bGx8LT9cXGQrKD86XFwuXFxkKik/KD86W2VFXVsrXFwtXT9cXGQrKT8vZzt2YXIgcnZhbGlkYnJhY2VzPS8oPzpefDp8LCkoPzpcXHMqXFxbKSsvZzt2YXIgcnRyaW1MZWZ0PS9eXFxzKy87dmFyIHJ0cmltUmlnaHQ9L1xccyskLzttb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlanNvbihkYXRhKXtpZignc3RyaW5nJyAhPSB0eXBlb2YgZGF0YSB8fCAhZGF0YSl7cmV0dXJuIG51bGw7fWRhdGEgPSBkYXRhLnJlcGxhY2UocnRyaW1MZWZ0LCcnKS5yZXBsYWNlKHJ0cmltUmlnaHQsJycpOyAvLyBBdHRlbXB0IHRvIHBhcnNlIHVzaW5nIHRoZSBuYXRpdmUgSlNPTiBwYXJzZXIgZmlyc3RcbmlmKGdsb2JhbC5KU09OICYmIEpTT04ucGFyc2Upe3JldHVybiBKU09OLnBhcnNlKGRhdGEpO31pZihydmFsaWRjaGFycy50ZXN0KGRhdGEucmVwbGFjZShydmFsaWRlc2NhcGUsJ0AnKS5yZXBsYWNlKHJ2YWxpZHRva2VucywnXScpLnJlcGxhY2UocnZhbGlkYnJhY2VzLCcnKSkpe3JldHVybiBuZXcgRnVuY3Rpb24oJ3JldHVybiAnICsgZGF0YSkoKTt9fTt9KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCI/c2VsZjp0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiP3dpbmRvdzp0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiP2dsb2JhbDp7fSk7fSx7fV0sMjc6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpeyAvKipcbiAgICAgICAgICAgICAgICAgKiBDb21waWxlcyBhIHF1ZXJ5c3RyaW5nXG4gICAgICAgICAgICAgICAgICogUmV0dXJucyBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIG9iamVjdFxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9XG4gICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICovZXhwb3J0cy5lbmNvZGUgPSBmdW5jdGlvbihvYmope3ZhciBzdHI9Jyc7Zm9yKHZhciBpIGluIG9iaikge2lmKG9iai5oYXNPd25Qcm9wZXJ0eShpKSl7aWYoc3RyLmxlbmd0aClzdHIgKz0gJyYnO3N0ciArPSBlbmNvZGVVUklDb21wb25lbnQoaSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQob2JqW2ldKTt9fXJldHVybiBzdHI7fTsgLyoqXG4gICAgICAgICAgICAgICAgICogUGFyc2VzIGEgc2ltcGxlIHF1ZXJ5c3RyaW5nIGludG8gYW4gb2JqZWN0XG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcXNcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKi9leHBvcnRzLmRlY29kZSA9IGZ1bmN0aW9uKHFzKXt2YXIgcXJ5PXt9O3ZhciBwYWlycz1xcy5zcGxpdCgnJicpO2Zvcih2YXIgaT0wLGw9cGFpcnMubGVuZ3RoO2kgPCBsO2krKykge3ZhciBwYWlyPXBhaXJzW2ldLnNwbGl0KCc9Jyk7cXJ5W2RlY29kZVVSSUNvbXBvbmVudChwYWlyWzBdKV0gPSBkZWNvZGVVUklDb21wb25lbnQocGFpclsxXSk7fXJldHVybiBxcnk7fTt9LHt9XSwyODpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7IC8qKlxuICAgICAgICAgICAgICAgICAqIFBhcnNlcyBhbiBVUklcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBhdXRob3IgU3RldmVuIExldml0aGFuIDxzdGV2ZW5sZXZpdGhhbi5jb20+IChNSVQgbGljZW5zZSlcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKi92YXIgcmU9L14oPzooPyFbXjpAXSs6W146QFxcL10qQCkoaHR0cHxodHRwc3x3c3x3c3MpOlxcL1xcLyk/KCg/OigoW146QF0qKSg/OjooW146QF0qKSk/KT9AKT8oKD86W2EtZjAtOV17MCw0fTopezIsN31bYS1mMC05XXswLDR9fFteOlxcLz8jXSopKD86OihcXGQqKSk/KSgoKFxcLyg/OltePyNdKD8hW14/I1xcL10qXFwuW14/I1xcLy5dKyg/Ols/I118JCkpKSpcXC8/KT8oW14/I1xcL10qKSkoPzpcXD8oW14jXSopKT8oPzojKC4qKSk/KS87dmFyIHBhcnRzPVsnc291cmNlJywncHJvdG9jb2wnLCdhdXRob3JpdHknLCd1c2VySW5mbycsJ3VzZXInLCdwYXNzd29yZCcsJ2hvc3QnLCdwb3J0JywncmVsYXRpdmUnLCdwYXRoJywnZGlyZWN0b3J5JywnZmlsZScsJ3F1ZXJ5JywnYW5jaG9yJ107bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZXVyaShzdHIpe3ZhciBzcmM9c3RyLGI9c3RyLmluZGV4T2YoJ1snKSxlPXN0ci5pbmRleE9mKCddJyk7aWYoYiAhPSAtMSAmJiBlICE9IC0xKXtzdHIgPSBzdHIuc3Vic3RyaW5nKDAsYikgKyBzdHIuc3Vic3RyaW5nKGIsZSkucmVwbGFjZSgvOi9nLCc7JykgKyBzdHIuc3Vic3RyaW5nKGUsc3RyLmxlbmd0aCk7fXZhciBtPXJlLmV4ZWMoc3RyIHx8ICcnKSx1cmk9e30saT0xNDt3aGlsZShpLS0pIHt1cmlbcGFydHNbaV1dID0gbVtpXSB8fCAnJzt9aWYoYiAhPSAtMSAmJiBlICE9IC0xKXt1cmkuc291cmNlID0gc3JjO3VyaS5ob3N0ID0gdXJpLmhvc3Quc3Vic3RyaW5nKDEsdXJpLmhvc3QubGVuZ3RoIC0gMSkucmVwbGFjZSgvOy9nLCc6Jyk7dXJpLmF1dGhvcml0eSA9IHVyaS5hdXRob3JpdHkucmVwbGFjZSgnWycsJycpLnJlcGxhY2UoJ10nLCcnKS5yZXBsYWNlKC87L2csJzonKTt1cmkuaXB2NnVyaSA9IHRydWU7fXJldHVybiB1cmk7fTt9LHt9XSwyOTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKGdsb2JhbCl7IC8qISBodHRwczovL210aHMuYmUvdXRmOGpzIHYyLjAuMCBieSBAbWF0aGlhcyAqLzsoZnVuY3Rpb24ocm9vdCl7IC8vIERldGVjdCBmcmVlIHZhcmlhYmxlcyBgZXhwb3J0c2BcbnZhciBmcmVlRXhwb3J0cz10eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzOyAvLyBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYFxudmFyIGZyZWVNb2R1bGU9dHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgbW9kdWxlLmV4cG9ydHMgPT0gZnJlZUV4cG9ydHMgJiYgbW9kdWxlOyAvLyBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCwgZnJvbSBOb2RlLmpzIG9yIEJyb3dzZXJpZmllZCBjb2RlLFxuLy8gYW5kIHVzZSBpdCBhcyBgcm9vdGBcbnZhciBmcmVlR2xvYmFsPXR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsO2lmKGZyZWVHbG9iYWwuZ2xvYmFsID09PSBmcmVlR2xvYmFsIHx8IGZyZWVHbG9iYWwud2luZG93ID09PSBmcmVlR2xvYmFsKXtyb290ID0gZnJlZUdsb2JhbDt9IC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL3ZhciBzdHJpbmdGcm9tQ2hhckNvZGU9U3RyaW5nLmZyb21DaGFyQ29kZTsgLy8gVGFrZW4gZnJvbSBodHRwczovL210aHMuYmUvcHVueWNvZGVcbmZ1bmN0aW9uIHVjczJkZWNvZGUoc3RyaW5nKXt2YXIgb3V0cHV0PVtdO3ZhciBjb3VudGVyPTA7dmFyIGxlbmd0aD1zdHJpbmcubGVuZ3RoO3ZhciB2YWx1ZTt2YXIgZXh0cmE7d2hpbGUoY291bnRlciA8IGxlbmd0aCkge3ZhbHVlID0gc3RyaW5nLmNoYXJDb2RlQXQoY291bnRlcisrKTtpZih2YWx1ZSA+PSAweEQ4MDAgJiYgdmFsdWUgPD0gMHhEQkZGICYmIGNvdW50ZXIgPCBsZW5ndGgpeyAvLyBoaWdoIHN1cnJvZ2F0ZSwgYW5kIHRoZXJlIGlzIGEgbmV4dCBjaGFyYWN0ZXJcbmV4dHJhID0gc3RyaW5nLmNoYXJDb2RlQXQoY291bnRlcisrKTtpZigoZXh0cmEgJiAweEZDMDApID09IDB4REMwMCl7IC8vIGxvdyBzdXJyb2dhdGVcbm91dHB1dC5wdXNoKCgodmFsdWUgJiAweDNGRikgPDwgMTApICsgKGV4dHJhICYgMHgzRkYpICsgMHgxMDAwMCk7fWVsc2UgeyAvLyB1bm1hdGNoZWQgc3Vycm9nYXRlOyBvbmx5IGFwcGVuZCB0aGlzIGNvZGUgdW5pdCwgaW4gY2FzZSB0aGUgbmV4dFxuLy8gY29kZSB1bml0IGlzIHRoZSBoaWdoIHN1cnJvZ2F0ZSBvZiBhIHN1cnJvZ2F0ZSBwYWlyXG5vdXRwdXQucHVzaCh2YWx1ZSk7Y291bnRlci0tO319ZWxzZSB7b3V0cHV0LnB1c2godmFsdWUpO319cmV0dXJuIG91dHB1dDt9IC8vIFRha2VuIGZyb20gaHR0cHM6Ly9tdGhzLmJlL3B1bnljb2RlXG5mdW5jdGlvbiB1Y3MyZW5jb2RlKGFycmF5KXt2YXIgbGVuZ3RoPWFycmF5Lmxlbmd0aDt2YXIgaW5kZXg9LTE7dmFyIHZhbHVlO3ZhciBvdXRwdXQ9Jyc7d2hpbGUoKytpbmRleCA8IGxlbmd0aCkge3ZhbHVlID0gYXJyYXlbaW5kZXhdO2lmKHZhbHVlID4gMHhGRkZGKXt2YWx1ZSAtPSAweDEwMDAwO291dHB1dCArPSBzdHJpbmdGcm9tQ2hhckNvZGUodmFsdWUgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApO3ZhbHVlID0gMHhEQzAwIHwgdmFsdWUgJiAweDNGRjt9b3V0cHV0ICs9IHN0cmluZ0Zyb21DaGFyQ29kZSh2YWx1ZSk7fXJldHVybiBvdXRwdXQ7fWZ1bmN0aW9uIGNoZWNrU2NhbGFyVmFsdWUoY29kZVBvaW50KXtpZihjb2RlUG9pbnQgPj0gMHhEODAwICYmIGNvZGVQb2ludCA8PSAweERGRkYpe3Rocm93IEVycm9yKCdMb25lIHN1cnJvZ2F0ZSBVKycgKyBjb2RlUG9pbnQudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCkgKyAnIGlzIG5vdCBhIHNjYWxhciB2YWx1ZScpO319IC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL2Z1bmN0aW9uIGNyZWF0ZUJ5dGUoY29kZVBvaW50LHNoaWZ0KXtyZXR1cm4gc3RyaW5nRnJvbUNoYXJDb2RlKGNvZGVQb2ludCA+PiBzaGlmdCAmIDB4M0YgfCAweDgwKTt9ZnVuY3Rpb24gZW5jb2RlQ29kZVBvaW50KGNvZGVQb2ludCl7aWYoKGNvZGVQb2ludCAmIDB4RkZGRkZGODApID09IDApeyAvLyAxLWJ5dGUgc2VxdWVuY2VcbnJldHVybiBzdHJpbmdGcm9tQ2hhckNvZGUoY29kZVBvaW50KTt9dmFyIHN5bWJvbD0nJztpZigoY29kZVBvaW50ICYgMHhGRkZGRjgwMCkgPT0gMCl7IC8vIDItYnl0ZSBzZXF1ZW5jZVxuc3ltYm9sID0gc3RyaW5nRnJvbUNoYXJDb2RlKGNvZGVQb2ludCA+PiA2ICYgMHgxRiB8IDB4QzApO31lbHNlIGlmKChjb2RlUG9pbnQgJiAweEZGRkYwMDAwKSA9PSAwKXsgLy8gMy1ieXRlIHNlcXVlbmNlXG5jaGVja1NjYWxhclZhbHVlKGNvZGVQb2ludCk7c3ltYm9sID0gc3RyaW5nRnJvbUNoYXJDb2RlKGNvZGVQb2ludCA+PiAxMiAmIDB4MEYgfCAweEUwKTtzeW1ib2wgKz0gY3JlYXRlQnl0ZShjb2RlUG9pbnQsNik7fWVsc2UgaWYoKGNvZGVQb2ludCAmIDB4RkZFMDAwMDApID09IDApeyAvLyA0LWJ5dGUgc2VxdWVuY2VcbnN5bWJvbCA9IHN0cmluZ0Zyb21DaGFyQ29kZShjb2RlUG9pbnQgPj4gMTggJiAweDA3IHwgMHhGMCk7c3ltYm9sICs9IGNyZWF0ZUJ5dGUoY29kZVBvaW50LDEyKTtzeW1ib2wgKz0gY3JlYXRlQnl0ZShjb2RlUG9pbnQsNik7fXN5bWJvbCArPSBzdHJpbmdGcm9tQ2hhckNvZGUoY29kZVBvaW50ICYgMHgzRiB8IDB4ODApO3JldHVybiBzeW1ib2w7fWZ1bmN0aW9uIHV0ZjhlbmNvZGUoc3RyaW5nKXt2YXIgY29kZVBvaW50cz11Y3MyZGVjb2RlKHN0cmluZyk7dmFyIGxlbmd0aD1jb2RlUG9pbnRzLmxlbmd0aDt2YXIgaW5kZXg9LTE7dmFyIGNvZGVQb2ludDt2YXIgYnl0ZVN0cmluZz0nJzt3aGlsZSgrK2luZGV4IDwgbGVuZ3RoKSB7Y29kZVBvaW50ID0gY29kZVBvaW50c1tpbmRleF07Ynl0ZVN0cmluZyArPSBlbmNvZGVDb2RlUG9pbnQoY29kZVBvaW50KTt9cmV0dXJuIGJ5dGVTdHJpbmc7fSAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9mdW5jdGlvbiByZWFkQ29udGludWF0aW9uQnl0ZSgpe2lmKGJ5dGVJbmRleCA+PSBieXRlQ291bnQpe3Rocm93IEVycm9yKCdJbnZhbGlkIGJ5dGUgaW5kZXgnKTt9dmFyIGNvbnRpbnVhdGlvbkJ5dGU9Ynl0ZUFycmF5W2J5dGVJbmRleF0gJiAweEZGO2J5dGVJbmRleCsrO2lmKChjb250aW51YXRpb25CeXRlICYgMHhDMCkgPT0gMHg4MCl7cmV0dXJuIGNvbnRpbnVhdGlvbkJ5dGUgJiAweDNGO30gLy8gSWYgd2UgZW5kIHVwIGhlcmUsIGl04oCZcyBub3QgYSBjb250aW51YXRpb24gYnl0ZVxudGhyb3cgRXJyb3IoJ0ludmFsaWQgY29udGludWF0aW9uIGJ5dGUnKTt9ZnVuY3Rpb24gZGVjb2RlU3ltYm9sKCl7dmFyIGJ5dGUxO3ZhciBieXRlMjt2YXIgYnl0ZTM7dmFyIGJ5dGU0O3ZhciBjb2RlUG9pbnQ7aWYoYnl0ZUluZGV4ID4gYnl0ZUNvdW50KXt0aHJvdyBFcnJvcignSW52YWxpZCBieXRlIGluZGV4Jyk7fWlmKGJ5dGVJbmRleCA9PSBieXRlQ291bnQpe3JldHVybiBmYWxzZTt9IC8vIFJlYWQgZmlyc3QgYnl0ZVxuYnl0ZTEgPSBieXRlQXJyYXlbYnl0ZUluZGV4XSAmIDB4RkY7Ynl0ZUluZGV4Kys7IC8vIDEtYnl0ZSBzZXF1ZW5jZSAobm8gY29udGludWF0aW9uIGJ5dGVzKVxuaWYoKGJ5dGUxICYgMHg4MCkgPT0gMCl7cmV0dXJuIGJ5dGUxO30gLy8gMi1ieXRlIHNlcXVlbmNlXG5pZigoYnl0ZTEgJiAweEUwKSA9PSAweEMwKXt2YXIgYnl0ZTI9cmVhZENvbnRpbnVhdGlvbkJ5dGUoKTtjb2RlUG9pbnQgPSAoYnl0ZTEgJiAweDFGKSA8PCA2IHwgYnl0ZTI7aWYoY29kZVBvaW50ID49IDB4ODApe3JldHVybiBjb2RlUG9pbnQ7fWVsc2Uge3Rocm93IEVycm9yKCdJbnZhbGlkIGNvbnRpbnVhdGlvbiBieXRlJyk7fX0gLy8gMy1ieXRlIHNlcXVlbmNlIChtYXkgaW5jbHVkZSB1bnBhaXJlZCBzdXJyb2dhdGVzKVxuaWYoKGJ5dGUxICYgMHhGMCkgPT0gMHhFMCl7Ynl0ZTIgPSByZWFkQ29udGludWF0aW9uQnl0ZSgpO2J5dGUzID0gcmVhZENvbnRpbnVhdGlvbkJ5dGUoKTtjb2RlUG9pbnQgPSAoYnl0ZTEgJiAweDBGKSA8PCAxMiB8IGJ5dGUyIDw8IDYgfCBieXRlMztpZihjb2RlUG9pbnQgPj0gMHgwODAwKXtjaGVja1NjYWxhclZhbHVlKGNvZGVQb2ludCk7cmV0dXJuIGNvZGVQb2ludDt9ZWxzZSB7dGhyb3cgRXJyb3IoJ0ludmFsaWQgY29udGludWF0aW9uIGJ5dGUnKTt9fSAvLyA0LWJ5dGUgc2VxdWVuY2VcbmlmKChieXRlMSAmIDB4RjgpID09IDB4RjApe2J5dGUyID0gcmVhZENvbnRpbnVhdGlvbkJ5dGUoKTtieXRlMyA9IHJlYWRDb250aW51YXRpb25CeXRlKCk7Ynl0ZTQgPSByZWFkQ29udGludWF0aW9uQnl0ZSgpO2NvZGVQb2ludCA9IChieXRlMSAmIDB4MEYpIDw8IDB4MTIgfCBieXRlMiA8PCAweDBDIHwgYnl0ZTMgPDwgMHgwNiB8IGJ5dGU0O2lmKGNvZGVQb2ludCA+PSAweDAxMDAwMCAmJiBjb2RlUG9pbnQgPD0gMHgxMEZGRkYpe3JldHVybiBjb2RlUG9pbnQ7fX10aHJvdyBFcnJvcignSW52YWxpZCBVVEYtOCBkZXRlY3RlZCcpO312YXIgYnl0ZUFycmF5O3ZhciBieXRlQ291bnQ7dmFyIGJ5dGVJbmRleDtmdW5jdGlvbiB1dGY4ZGVjb2RlKGJ5dGVTdHJpbmcpe2J5dGVBcnJheSA9IHVjczJkZWNvZGUoYnl0ZVN0cmluZyk7Ynl0ZUNvdW50ID0gYnl0ZUFycmF5Lmxlbmd0aDtieXRlSW5kZXggPSAwO3ZhciBjb2RlUG9pbnRzPVtdO3ZhciB0bXA7d2hpbGUoKHRtcCA9IGRlY29kZVN5bWJvbCgpKSAhPT0gZmFsc2UpIHtjb2RlUG9pbnRzLnB1c2godG1wKTt9cmV0dXJuIHVjczJlbmNvZGUoY29kZVBvaW50cyk7fSAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi92YXIgdXRmOD17J3ZlcnNpb24nOicyLjAuMCcsJ2VuY29kZSc6dXRmOGVuY29kZSwnZGVjb2RlJzp1dGY4ZGVjb2RlfTsgLy8gU29tZSBBTUQgYnVpbGQgb3B0aW1pemVycywgbGlrZSByLmpzLCBjaGVjayBmb3Igc3BlY2lmaWMgY29uZGl0aW9uIHBhdHRlcm5zXG4vLyBsaWtlIHRoZSBmb2xsb3dpbmc6XG5pZih0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT0gJ29iamVjdCcgJiYgZGVmaW5lLmFtZCl7ZGVmaW5lKGZ1bmN0aW9uKCl7cmV0dXJuIHV0Zjg7fSk7fWVsc2UgaWYoZnJlZUV4cG9ydHMgJiYgIWZyZWVFeHBvcnRzLm5vZGVUeXBlKXtpZihmcmVlTW9kdWxlKXsgLy8gaW4gTm9kZS5qcyBvciBSaW5nb0pTIHYwLjguMCtcbmZyZWVNb2R1bGUuZXhwb3J0cyA9IHV0Zjg7fWVsc2UgeyAvLyBpbiBOYXJ3aGFsIG9yIFJpbmdvSlMgdjAuNy4wLVxudmFyIG9iamVjdD17fTt2YXIgaGFzT3duUHJvcGVydHk9b2JqZWN0Lmhhc093blByb3BlcnR5O2Zvcih2YXIga2V5IGluIHV0ZjgpIHtoYXNPd25Qcm9wZXJ0eS5jYWxsKHV0Zjgsa2V5KSAmJiAoZnJlZUV4cG9ydHNba2V5XSA9IHV0Zjhba2V5XSk7fX19ZWxzZSB7IC8vIGluIFJoaW5vIG9yIGEgd2ViIGJyb3dzZXJcbnJvb3QudXRmOCA9IHV0Zjg7fX0pKHRoaXMpO30pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIj9zZWxmOnR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCI/d2luZG93OnR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCI/Z2xvYmFsOnt9KTt9LHt9XSwzMDpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7J3VzZSBzdHJpY3QnO3ZhciBhbHBoYWJldD0nMDEyMzQ1Njc4OUFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXotXycuc3BsaXQoJycpLGxlbmd0aD02NCxtYXA9e30sc2VlZD0wLGk9MCxwcmV2OyAvKipcbiAgICAgICAgICAgICAgICAgKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBzcGVjaWZpZWQgbnVtYmVyLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IG51bSBUaGUgbnVtYmVyIHRvIGNvbnZlcnQuXG4gICAgICAgICAgICAgICAgICogQHJldHVybnMge1N0cmluZ30gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgbnVtYmVyLlxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAgICAgICAgICovZnVuY3Rpb24gZW5jb2RlKG51bSl7dmFyIGVuY29kZWQ9Jyc7ZG8ge2VuY29kZWQgPSBhbHBoYWJldFtudW0gJSBsZW5ndGhdICsgZW5jb2RlZDtudW0gPSBNYXRoLmZsb29yKG51bSAvIGxlbmd0aCk7fXdoaWxlKG51bSA+IDApO3JldHVybiBlbmNvZGVkO30gLyoqXG4gICAgICAgICAgICAgICAgICogUmV0dXJuIHRoZSBpbnRlZ2VyIHZhbHVlIHNwZWNpZmllZCBieSB0aGUgZ2l2ZW4gc3RyaW5nLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3RyaW5nIHRvIGNvbnZlcnQuXG4gICAgICAgICAgICAgICAgICogQHJldHVybnMge051bWJlcn0gVGhlIGludGVnZXIgdmFsdWUgcmVwcmVzZW50ZWQgYnkgdGhlIHN0cmluZy5cbiAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAqL2Z1bmN0aW9uIGRlY29kZShzdHIpe3ZhciBkZWNvZGVkPTA7Zm9yKGkgPSAwO2kgPCBzdHIubGVuZ3RoO2krKykge2RlY29kZWQgPSBkZWNvZGVkICogbGVuZ3RoICsgbWFwW3N0ci5jaGFyQXQoaSldO31yZXR1cm4gZGVjb2RlZDt9IC8qKlxuICAgICAgICAgICAgICAgICAqIFllYXN0OiBBIHRpbnkgZ3Jvd2luZyBpZCBnZW5lcmF0b3IuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSBBIHVuaXF1ZSBpZC5cbiAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAqL2Z1bmN0aW9uIHllYXN0KCl7dmFyIG5vdz1lbmNvZGUoK25ldyBEYXRlKCkpO2lmKG5vdyAhPT0gcHJldilyZXR1cm4gc2VlZCA9IDAscHJldiA9IG5vdztyZXR1cm4gbm93ICsgJy4nICsgZW5jb2RlKHNlZWQrKyk7fSAvL1xuLy8gTWFwIGVhY2ggY2hhcmFjdGVyIHRvIGl0cyBpbmRleC5cbi8vXG5mb3IoO2kgPCBsZW5ndGg7aSsrKSBtYXBbYWxwaGFiZXRbaV1dID0gaTsgLy9cbi8vIEV4cG9zZSB0aGUgYHllYXN0YCwgYGVuY29kZWAgYW5kIGBkZWNvZGVgIGZ1bmN0aW9ucy5cbi8vXG55ZWFzdC5lbmNvZGUgPSBlbmNvZGU7eWVhc3QuZGVjb2RlID0gZGVjb2RlO21vZHVsZS5leHBvcnRzID0geWVhc3Q7fSx7fV0sMzE6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpeyAvKipcbiAgICAgICAgICAgICAgICAgKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICAgICAgICAgICAgICAgICAqL3ZhciB1cmw9X2RlcmVxXygnLi91cmwnKTt2YXIgcGFyc2VyPV9kZXJlcV8oJ3NvY2tldC5pby1wYXJzZXInKTt2YXIgTWFuYWdlcj1fZGVyZXFfKCcuL21hbmFnZXInKTt2YXIgZGVidWc9X2RlcmVxXygnZGVidWcnKSgnc29ja2V0LmlvLWNsaWVudCcpOyAvKipcbiAgICAgICAgICAgICAgICAgKiBNb2R1bGUgZXhwb3J0cy5cbiAgICAgICAgICAgICAgICAgKi9tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBsb29rdXA7IC8qKlxuICAgICAgICAgICAgICAgICAqIE1hbmFnZXJzIGNhY2hlLlxuICAgICAgICAgICAgICAgICAqL3ZhciBjYWNoZT1leHBvcnRzLm1hbmFnZXJzID0ge307IC8qKlxuICAgICAgICAgICAgICAgICAqIExvb2tzIHVwIGFuIGV4aXN0aW5nIGBNYW5hZ2VyYCBmb3IgbXVsdGlwbGV4aW5nLlxuICAgICAgICAgICAgICAgICAqIElmIHRoZSB1c2VyIHN1bW1vbnM6XG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiAgIGBpbygnaHR0cDovL2xvY2FsaG9zdC9hJyk7YFxuICAgICAgICAgICAgICAgICAqICAgYGlvKCdodHRwOi8vbG9jYWxob3N0L2InKTtgXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBXZSByZXVzZSB0aGUgZXhpc3RpbmcgaW5zdGFuY2UgYmFzZWQgb24gc2FtZSBzY2hlbWUvcG9ydC9ob3N0LFxuICAgICAgICAgICAgICAgICAqIGFuZCB3ZSBpbml0aWFsaXplIHNvY2tldHMgZm9yIGVhY2ggbmFtZXNwYWNlLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgKi9mdW5jdGlvbiBsb29rdXAodXJpLG9wdHMpe2lmKHR5cGVvZiB1cmkgPT0gJ29iamVjdCcpe29wdHMgPSB1cmk7dXJpID0gdW5kZWZpbmVkO31vcHRzID0gb3B0cyB8fCB7fTt2YXIgcGFyc2VkPXVybCh1cmkpO3ZhciBzb3VyY2U9cGFyc2VkLnNvdXJjZTt2YXIgaWQ9cGFyc2VkLmlkO3ZhciBwYXRoPXBhcnNlZC5wYXRoO3ZhciBzYW1lTmFtZXNwYWNlPWNhY2hlW2lkXSAmJiBwYXRoIGluIGNhY2hlW2lkXS5uc3BzO3ZhciBuZXdDb25uZWN0aW9uPW9wdHMuZm9yY2VOZXcgfHwgb3B0c1snZm9yY2UgbmV3IGNvbm5lY3Rpb24nXSB8fCBmYWxzZSA9PT0gb3B0cy5tdWx0aXBsZXggfHwgc2FtZU5hbWVzcGFjZTt2YXIgaW87aWYobmV3Q29ubmVjdGlvbil7ZGVidWcoJ2lnbm9yaW5nIHNvY2tldCBjYWNoZSBmb3IgJXMnLHNvdXJjZSk7aW8gPSBNYW5hZ2VyKHNvdXJjZSxvcHRzKTt9ZWxzZSB7aWYoIWNhY2hlW2lkXSl7ZGVidWcoJ25ldyBpbyBpbnN0YW5jZSBmb3IgJXMnLHNvdXJjZSk7Y2FjaGVbaWRdID0gTWFuYWdlcihzb3VyY2Usb3B0cyk7fWlvID0gY2FjaGVbaWRdO31yZXR1cm4gaW8uc29ja2V0KHBhcnNlZC5wYXRoKTt9IC8qKlxuICAgICAgICAgICAgICAgICAqIFByb3RvY29sIHZlcnNpb24uXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAqL2V4cG9ydHMucHJvdG9jb2wgPSBwYXJzZXIucHJvdG9jb2w7IC8qKlxuICAgICAgICAgICAgICAgICAqIGBjb25uZWN0YC5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmlcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAqL2V4cG9ydHMuY29ubmVjdCA9IGxvb2t1cDsgLyoqXG4gICAgICAgICAgICAgICAgICogRXhwb3NlIGNvbnN0cnVjdG9ycyBmb3Igc3RhbmRhbG9uZSBidWlsZC5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAgICAgICAgICovZXhwb3J0cy5NYW5hZ2VyID0gX2RlcmVxXygnLi9tYW5hZ2VyJyk7ZXhwb3J0cy5Tb2NrZXQgPSBfZGVyZXFfKCcuL3NvY2tldCcpO30se1wiLi9tYW5hZ2VyXCI6MzIsXCIuL3NvY2tldFwiOjM0LFwiLi91cmxcIjozNSxcImRlYnVnXCI6MzksXCJzb2NrZXQuaW8tcGFyc2VyXCI6NDd9XSwzMjpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7IC8qKlxuICAgICAgICAgICAgICAgICAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gICAgICAgICAgICAgICAgICovdmFyIGVpbz1fZGVyZXFfKCdlbmdpbmUuaW8tY2xpZW50Jyk7dmFyIFNvY2tldD1fZGVyZXFfKCcuL3NvY2tldCcpO3ZhciBFbWl0dGVyPV9kZXJlcV8oJ2NvbXBvbmVudC1lbWl0dGVyJyk7dmFyIHBhcnNlcj1fZGVyZXFfKCdzb2NrZXQuaW8tcGFyc2VyJyk7dmFyIG9uPV9kZXJlcV8oJy4vb24nKTt2YXIgYmluZD1fZGVyZXFfKCdjb21wb25lbnQtYmluZCcpO3ZhciBkZWJ1Zz1fZGVyZXFfKCdkZWJ1ZycpKCdzb2NrZXQuaW8tY2xpZW50Om1hbmFnZXInKTt2YXIgaW5kZXhPZj1fZGVyZXFfKCdpbmRleG9mJyk7dmFyIEJhY2tvZmY9X2RlcmVxXygnYmFja28yJyk7IC8qKlxuICAgICAgICAgICAgICAgICAqIElFNisgaGFzT3duUHJvcGVydHlcbiAgICAgICAgICAgICAgICAgKi92YXIgaGFzPU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7IC8qKlxuICAgICAgICAgICAgICAgICAqIE1vZHVsZSBleHBvcnRzXG4gICAgICAgICAgICAgICAgICovbW9kdWxlLmV4cG9ydHMgPSBNYW5hZ2VyOyAvKipcbiAgICAgICAgICAgICAgICAgKiBgTWFuYWdlcmAgY29uc3RydWN0b3IuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZW5naW5lIGluc3RhbmNlIG9yIGVuZ2luZSB1cmkvb3B0c1xuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgKi9mdW5jdGlvbiBNYW5hZ2VyKHVyaSxvcHRzKXtpZighKHRoaXMgaW5zdGFuY2VvZiBNYW5hZ2VyKSlyZXR1cm4gbmV3IE1hbmFnZXIodXJpLG9wdHMpO2lmKHVyaSAmJiAnb2JqZWN0JyA9PSB0eXBlb2YgdXJpKXtvcHRzID0gdXJpO3VyaSA9IHVuZGVmaW5lZDt9b3B0cyA9IG9wdHMgfHwge307b3B0cy5wYXRoID0gb3B0cy5wYXRoIHx8ICcvc29ja2V0LmlvJzt0aGlzLm5zcHMgPSB7fTt0aGlzLnN1YnMgPSBbXTt0aGlzLm9wdHMgPSBvcHRzO3RoaXMucmVjb25uZWN0aW9uKG9wdHMucmVjb25uZWN0aW9uICE9PSBmYWxzZSk7dGhpcy5yZWNvbm5lY3Rpb25BdHRlbXB0cyhvcHRzLnJlY29ubmVjdGlvbkF0dGVtcHRzIHx8IEluZmluaXR5KTt0aGlzLnJlY29ubmVjdGlvbkRlbGF5KG9wdHMucmVjb25uZWN0aW9uRGVsYXkgfHwgMTAwMCk7dGhpcy5yZWNvbm5lY3Rpb25EZWxheU1heChvcHRzLnJlY29ubmVjdGlvbkRlbGF5TWF4IHx8IDUwMDApO3RoaXMucmFuZG9taXphdGlvbkZhY3RvcihvcHRzLnJhbmRvbWl6YXRpb25GYWN0b3IgfHwgMC41KTt0aGlzLmJhY2tvZmYgPSBuZXcgQmFja29mZih7bWluOnRoaXMucmVjb25uZWN0aW9uRGVsYXkoKSxtYXg6dGhpcy5yZWNvbm5lY3Rpb25EZWxheU1heCgpLGppdHRlcjp0aGlzLnJhbmRvbWl6YXRpb25GYWN0b3IoKX0pO3RoaXMudGltZW91dChudWxsID09IG9wdHMudGltZW91dD8yMDAwMDpvcHRzLnRpbWVvdXQpO3RoaXMucmVhZHlTdGF0ZSA9ICdjbG9zZWQnO3RoaXMudXJpID0gdXJpO3RoaXMuY29ubmVjdGluZyA9IFtdO3RoaXMubGFzdFBpbmcgPSBudWxsO3RoaXMuZW5jb2RpbmcgPSBmYWxzZTt0aGlzLnBhY2tldEJ1ZmZlciA9IFtdO3RoaXMuZW5jb2RlciA9IG5ldyBwYXJzZXIuRW5jb2RlcigpO3RoaXMuZGVjb2RlciA9IG5ldyBwYXJzZXIuRGVjb2RlcigpO3RoaXMuYXV0b0Nvbm5lY3QgPSBvcHRzLmF1dG9Db25uZWN0ICE9PSBmYWxzZTtpZih0aGlzLmF1dG9Db25uZWN0KXRoaXMub3BlbigpO30gLyoqXG4gICAgICAgICAgICAgICAgICogUHJvcGFnYXRlIGdpdmVuIGV2ZW50IHRvIHNvY2tldHMgYW5kIGVtaXQgb24gYHRoaXNgXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKi9NYW5hZ2VyLnByb3RvdHlwZS5lbWl0QWxsID0gZnVuY3Rpb24oKXt0aGlzLmVtaXQuYXBwbHkodGhpcyxhcmd1bWVudHMpO2Zvcih2YXIgbnNwIGluIHRoaXMubnNwcykge2lmKGhhcy5jYWxsKHRoaXMubnNwcyxuc3ApKXt0aGlzLm5zcHNbbnNwXS5lbWl0LmFwcGx5KHRoaXMubnNwc1tuc3BdLGFyZ3VtZW50cyk7fX19OyAvKipcbiAgICAgICAgICAgICAgICAgKiBVcGRhdGUgYHNvY2tldC5pZGAgb2YgYWxsIHNvY2tldHNcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAqL01hbmFnZXIucHJvdG90eXBlLnVwZGF0ZVNvY2tldElkcyA9IGZ1bmN0aW9uKCl7Zm9yKHZhciBuc3AgaW4gdGhpcy5uc3BzKSB7aWYoaGFzLmNhbGwodGhpcy5uc3BzLG5zcCkpe3RoaXMubnNwc1tuc3BdLmlkID0gdGhpcy5lbmdpbmUuaWQ7fX19OyAvKipcbiAgICAgICAgICAgICAgICAgKiBNaXggaW4gYEVtaXR0ZXJgLlxuICAgICAgICAgICAgICAgICAqL0VtaXR0ZXIoTWFuYWdlci5wcm90b3R5cGUpOyAvKipcbiAgICAgICAgICAgICAgICAgKiBTZXRzIHRoZSBgcmVjb25uZWN0aW9uYCBjb25maWcuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHRydWUvZmFsc2UgaWYgaXQgc2hvdWxkIGF1dG9tYXRpY2FsbHkgcmVjb25uZWN0XG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7TWFuYWdlcn0gc2VsZiBvciB2YWx1ZVxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAgICAgICAgICovTWFuYWdlci5wcm90b3R5cGUucmVjb25uZWN0aW9uID0gZnVuY3Rpb24odil7aWYoIWFyZ3VtZW50cy5sZW5ndGgpcmV0dXJuIHRoaXMuX3JlY29ubmVjdGlvbjt0aGlzLl9yZWNvbm5lY3Rpb24gPSAhIXY7cmV0dXJuIHRoaXM7fTsgLyoqXG4gICAgICAgICAgICAgICAgICogU2V0cyB0aGUgcmVjb25uZWN0aW9uIGF0dGVtcHRzIGNvbmZpZy5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBtYXggcmVjb25uZWN0aW9uIGF0dGVtcHRzIGJlZm9yZSBnaXZpbmcgdXBcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtNYW5hZ2VyfSBzZWxmIG9yIHZhbHVlXG4gICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgKi9NYW5hZ2VyLnByb3RvdHlwZS5yZWNvbm5lY3Rpb25BdHRlbXB0cyA9IGZ1bmN0aW9uKHYpe2lmKCFhcmd1bWVudHMubGVuZ3RoKXJldHVybiB0aGlzLl9yZWNvbm5lY3Rpb25BdHRlbXB0czt0aGlzLl9yZWNvbm5lY3Rpb25BdHRlbXB0cyA9IHY7cmV0dXJuIHRoaXM7fTsgLyoqXG4gICAgICAgICAgICAgICAgICogU2V0cyB0aGUgZGVsYXkgYmV0d2VlbiByZWNvbm5lY3Rpb25zLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGRlbGF5XG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7TWFuYWdlcn0gc2VsZiBvciB2YWx1ZVxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAgICAgICAgICovTWFuYWdlci5wcm90b3R5cGUucmVjb25uZWN0aW9uRGVsYXkgPSBmdW5jdGlvbih2KXtpZighYXJndW1lbnRzLmxlbmd0aClyZXR1cm4gdGhpcy5fcmVjb25uZWN0aW9uRGVsYXk7dGhpcy5fcmVjb25uZWN0aW9uRGVsYXkgPSB2O3RoaXMuYmFja29mZiAmJiB0aGlzLmJhY2tvZmYuc2V0TWluKHYpO3JldHVybiB0aGlzO307TWFuYWdlci5wcm90b3R5cGUucmFuZG9taXphdGlvbkZhY3RvciA9IGZ1bmN0aW9uKHYpe2lmKCFhcmd1bWVudHMubGVuZ3RoKXJldHVybiB0aGlzLl9yYW5kb21pemF0aW9uRmFjdG9yO3RoaXMuX3JhbmRvbWl6YXRpb25GYWN0b3IgPSB2O3RoaXMuYmFja29mZiAmJiB0aGlzLmJhY2tvZmYuc2V0Sml0dGVyKHYpO3JldHVybiB0aGlzO307IC8qKlxuICAgICAgICAgICAgICAgICAqIFNldHMgdGhlIG1heGltdW0gZGVsYXkgYmV0d2VlbiByZWNvbm5lY3Rpb25zLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGRlbGF5XG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7TWFuYWdlcn0gc2VsZiBvciB2YWx1ZVxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAgICAgICAgICovTWFuYWdlci5wcm90b3R5cGUucmVjb25uZWN0aW9uRGVsYXlNYXggPSBmdW5jdGlvbih2KXtpZighYXJndW1lbnRzLmxlbmd0aClyZXR1cm4gdGhpcy5fcmVjb25uZWN0aW9uRGVsYXlNYXg7dGhpcy5fcmVjb25uZWN0aW9uRGVsYXlNYXggPSB2O3RoaXMuYmFja29mZiAmJiB0aGlzLmJhY2tvZmYuc2V0TWF4KHYpO3JldHVybiB0aGlzO307IC8qKlxuICAgICAgICAgICAgICAgICAqIFNldHMgdGhlIGNvbm5lY3Rpb24gdGltZW91dC4gYGZhbHNlYCB0byBkaXNhYmxlXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtNYW5hZ2VyfSBzZWxmIG9yIHZhbHVlXG4gICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgKi9NYW5hZ2VyLnByb3RvdHlwZS50aW1lb3V0ID0gZnVuY3Rpb24odil7aWYoIWFyZ3VtZW50cy5sZW5ndGgpcmV0dXJuIHRoaXMuX3RpbWVvdXQ7dGhpcy5fdGltZW91dCA9IHY7cmV0dXJuIHRoaXM7fTsgLyoqXG4gICAgICAgICAgICAgICAgICogU3RhcnRzIHRyeWluZyB0byByZWNvbm5lY3QgaWYgcmVjb25uZWN0aW9uIGlzIGVuYWJsZWQgYW5kIHdlIGhhdmUgbm90XG4gICAgICAgICAgICAgICAgICogc3RhcnRlZCByZWNvbm5lY3RpbmcgeWV0XG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKi9NYW5hZ2VyLnByb3RvdHlwZS5tYXliZVJlY29ubmVjdE9uT3BlbiA9IGZ1bmN0aW9uKCl7IC8vIE9ubHkgdHJ5IHRvIHJlY29ubmVjdCBpZiBpdCdzIHRoZSBmaXJzdCB0aW1lIHdlJ3JlIGNvbm5lY3RpbmdcbmlmKCF0aGlzLnJlY29ubmVjdGluZyAmJiB0aGlzLl9yZWNvbm5lY3Rpb24gJiYgdGhpcy5iYWNrb2ZmLmF0dGVtcHRzID09PSAwKXsgLy8ga2VlcHMgcmVjb25uZWN0aW9uIGZyb20gZmlyaW5nIHR3aWNlIGZvciB0aGUgc2FtZSByZWNvbm5lY3Rpb24gbG9vcFxudGhpcy5yZWNvbm5lY3QoKTt9fTsgLyoqXG4gICAgICAgICAgICAgICAgICogU2V0cyB0aGUgY3VycmVudCB0cmFuc3BvcnQgYHNvY2tldGAuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHRpb25hbCwgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtNYW5hZ2VyfSBzZWxmXG4gICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgKi9NYW5hZ2VyLnByb3RvdHlwZS5vcGVuID0gTWFuYWdlci5wcm90b3R5cGUuY29ubmVjdCA9IGZ1bmN0aW9uKGZuKXtkZWJ1ZygncmVhZHlTdGF0ZSAlcycsdGhpcy5yZWFkeVN0YXRlKTtpZih+dGhpcy5yZWFkeVN0YXRlLmluZGV4T2YoJ29wZW4nKSlyZXR1cm4gdGhpcztkZWJ1Zygnb3BlbmluZyAlcycsdGhpcy51cmkpO3RoaXMuZW5naW5lID0gZWlvKHRoaXMudXJpLHRoaXMub3B0cyk7dmFyIHNvY2tldD10aGlzLmVuZ2luZTt2YXIgc2VsZj10aGlzO3RoaXMucmVhZHlTdGF0ZSA9ICdvcGVuaW5nJzt0aGlzLnNraXBSZWNvbm5lY3QgPSBmYWxzZTsgLy8gZW1pdCBgb3BlbmBcbnZhciBvcGVuU3ViPW9uKHNvY2tldCwnb3BlbicsZnVuY3Rpb24oKXtzZWxmLm9ub3BlbigpO2ZuICYmIGZuKCk7fSk7IC8vIGVtaXQgYGNvbm5lY3RfZXJyb3JgXG52YXIgZXJyb3JTdWI9b24oc29ja2V0LCdlcnJvcicsZnVuY3Rpb24oZGF0YSl7ZGVidWcoJ2Nvbm5lY3RfZXJyb3InKTtzZWxmLmNsZWFudXAoKTtzZWxmLnJlYWR5U3RhdGUgPSAnY2xvc2VkJztzZWxmLmVtaXRBbGwoJ2Nvbm5lY3RfZXJyb3InLGRhdGEpO2lmKGZuKXt2YXIgZXJyPW5ldyBFcnJvcignQ29ubmVjdGlvbiBlcnJvcicpO2Vyci5kYXRhID0gZGF0YTtmbihlcnIpO31lbHNlIHsgLy8gT25seSBkbyB0aGlzIGlmIHRoZXJlIGlzIG5vIGZuIHRvIGhhbmRsZSB0aGUgZXJyb3JcbnNlbGYubWF5YmVSZWNvbm5lY3RPbk9wZW4oKTt9fSk7IC8vIGVtaXQgYGNvbm5lY3RfdGltZW91dGBcbmlmKGZhbHNlICE9PSB0aGlzLl90aW1lb3V0KXt2YXIgdGltZW91dD10aGlzLl90aW1lb3V0O2RlYnVnKCdjb25uZWN0IGF0dGVtcHQgd2lsbCB0aW1lb3V0IGFmdGVyICVkJyx0aW1lb3V0KTsgLy8gc2V0IHRpbWVyXG52YXIgdGltZXI9c2V0VGltZW91dChmdW5jdGlvbigpe2RlYnVnKCdjb25uZWN0IGF0dGVtcHQgdGltZWQgb3V0IGFmdGVyICVkJyx0aW1lb3V0KTtvcGVuU3ViLmRlc3Ryb3koKTtzb2NrZXQuY2xvc2UoKTtzb2NrZXQuZW1pdCgnZXJyb3InLCd0aW1lb3V0Jyk7c2VsZi5lbWl0QWxsKCdjb25uZWN0X3RpbWVvdXQnLHRpbWVvdXQpO30sdGltZW91dCk7dGhpcy5zdWJzLnB1c2goe2Rlc3Ryb3k6ZnVuY3Rpb24gZGVzdHJveSgpe2NsZWFyVGltZW91dCh0aW1lcik7fX0pO310aGlzLnN1YnMucHVzaChvcGVuU3ViKTt0aGlzLnN1YnMucHVzaChlcnJvclN1Yik7cmV0dXJuIHRoaXM7fTsgLyoqXG4gICAgICAgICAgICAgICAgICogQ2FsbGVkIHVwb24gdHJhbnNwb3J0IG9wZW4uXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKi9NYW5hZ2VyLnByb3RvdHlwZS5vbm9wZW4gPSBmdW5jdGlvbigpe2RlYnVnKCdvcGVuJyk7IC8vIGNsZWFyIG9sZCBzdWJzXG50aGlzLmNsZWFudXAoKTsgLy8gbWFyayBhcyBvcGVuXG50aGlzLnJlYWR5U3RhdGUgPSAnb3Blbic7dGhpcy5lbWl0KCdvcGVuJyk7IC8vIGFkZCBuZXcgc3Vic1xudmFyIHNvY2tldD10aGlzLmVuZ2luZTt0aGlzLnN1YnMucHVzaChvbihzb2NrZXQsJ2RhdGEnLGJpbmQodGhpcywnb25kYXRhJykpKTt0aGlzLnN1YnMucHVzaChvbihzb2NrZXQsJ3BpbmcnLGJpbmQodGhpcywnb25waW5nJykpKTt0aGlzLnN1YnMucHVzaChvbihzb2NrZXQsJ3BvbmcnLGJpbmQodGhpcywnb25wb25nJykpKTt0aGlzLnN1YnMucHVzaChvbihzb2NrZXQsJ2Vycm9yJyxiaW5kKHRoaXMsJ29uZXJyb3InKSkpO3RoaXMuc3Vicy5wdXNoKG9uKHNvY2tldCwnY2xvc2UnLGJpbmQodGhpcywnb25jbG9zZScpKSk7dGhpcy5zdWJzLnB1c2gob24odGhpcy5kZWNvZGVyLCdkZWNvZGVkJyxiaW5kKHRoaXMsJ29uZGVjb2RlZCcpKSk7fTsgLyoqXG4gICAgICAgICAgICAgICAgICogQ2FsbGVkIHVwb24gYSBwaW5nLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICovTWFuYWdlci5wcm90b3R5cGUub25waW5nID0gZnVuY3Rpb24oKXt0aGlzLmxhc3RQaW5nID0gbmV3IERhdGUoKTt0aGlzLmVtaXRBbGwoJ3BpbmcnKTt9OyAvKipcbiAgICAgICAgICAgICAgICAgKiBDYWxsZWQgdXBvbiBhIHBhY2tldC5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAqL01hbmFnZXIucHJvdG90eXBlLm9ucG9uZyA9IGZ1bmN0aW9uKCl7dGhpcy5lbWl0QWxsKCdwb25nJyxuZXcgRGF0ZSgpIC0gdGhpcy5sYXN0UGluZyk7fTsgLyoqXG4gICAgICAgICAgICAgICAgICogQ2FsbGVkIHdpdGggZGF0YS5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAqL01hbmFnZXIucHJvdG90eXBlLm9uZGF0YSA9IGZ1bmN0aW9uKGRhdGEpe3RoaXMuZGVjb2Rlci5hZGQoZGF0YSk7fTsgLyoqXG4gICAgICAgICAgICAgICAgICogQ2FsbGVkIHdoZW4gcGFyc2VyIGZ1bGx5IGRlY29kZXMgYSBwYWNrZXQuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKi9NYW5hZ2VyLnByb3RvdHlwZS5vbmRlY29kZWQgPSBmdW5jdGlvbihwYWNrZXQpe3RoaXMuZW1pdCgncGFja2V0JyxwYWNrZXQpO307IC8qKlxuICAgICAgICAgICAgICAgICAqIENhbGxlZCB1cG9uIHNvY2tldCBlcnJvci5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAqL01hbmFnZXIucHJvdG90eXBlLm9uZXJyb3IgPSBmdW5jdGlvbihlcnIpe2RlYnVnKCdlcnJvcicsZXJyKTt0aGlzLmVtaXRBbGwoJ2Vycm9yJyxlcnIpO307IC8qKlxuICAgICAgICAgICAgICAgICAqIENyZWF0ZXMgYSBuZXcgc29ja2V0IGZvciB0aGUgZ2l2ZW4gYG5zcGAuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtTb2NrZXR9XG4gICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgKi9NYW5hZ2VyLnByb3RvdHlwZS5zb2NrZXQgPSBmdW5jdGlvbihuc3Ape3ZhciBzb2NrZXQ9dGhpcy5uc3BzW25zcF07aWYoIXNvY2tldCl7c29ja2V0ID0gbmV3IFNvY2tldCh0aGlzLG5zcCk7dGhpcy5uc3BzW25zcF0gPSBzb2NrZXQ7dmFyIHNlbGY9dGhpcztzb2NrZXQub24oJ2Nvbm5lY3RpbmcnLG9uQ29ubmVjdGluZyk7c29ja2V0Lm9uKCdjb25uZWN0JyxmdW5jdGlvbigpe3NvY2tldC5pZCA9IHNlbGYuZW5naW5lLmlkO30pO2lmKHRoaXMuYXV0b0Nvbm5lY3QpeyAvLyBtYW51YWxseSBjYWxsIGhlcmUgc2luY2UgY29ubmVjdGluZyBldm5ldCBpcyBmaXJlZCBiZWZvcmUgbGlzdGVuaW5nXG5vbkNvbm5lY3RpbmcoKTt9fWZ1bmN0aW9uIG9uQ29ubmVjdGluZygpe2lmKCEgfmluZGV4T2Yoc2VsZi5jb25uZWN0aW5nLHNvY2tldCkpe3NlbGYuY29ubmVjdGluZy5wdXNoKHNvY2tldCk7fX1yZXR1cm4gc29ja2V0O307IC8qKlxuICAgICAgICAgICAgICAgICAqIENhbGxlZCB1cG9uIGEgc29ja2V0IGNsb3NlLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTb2NrZXR9IHNvY2tldFxuICAgICAgICAgICAgICAgICAqL01hbmFnZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbihzb2NrZXQpe3ZhciBpbmRleD1pbmRleE9mKHRoaXMuY29ubmVjdGluZyxzb2NrZXQpO2lmKH5pbmRleCl0aGlzLmNvbm5lY3Rpbmcuc3BsaWNlKGluZGV4LDEpO2lmKHRoaXMuY29ubmVjdGluZy5sZW5ndGgpcmV0dXJuO3RoaXMuY2xvc2UoKTt9OyAvKipcbiAgICAgICAgICAgICAgICAgKiBXcml0ZXMgYSBwYWNrZXQuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFja2V0XG4gICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICovTWFuYWdlci5wcm90b3R5cGUucGFja2V0ID0gZnVuY3Rpb24ocGFja2V0KXtkZWJ1Zygnd3JpdGluZyBwYWNrZXQgJWonLHBhY2tldCk7dmFyIHNlbGY9dGhpcztpZighc2VsZi5lbmNvZGluZyl7IC8vIGVuY29kZSwgdGhlbiB3cml0ZSB0byBlbmdpbmUgd2l0aCByZXN1bHRcbnNlbGYuZW5jb2RpbmcgPSB0cnVlO3RoaXMuZW5jb2Rlci5lbmNvZGUocGFja2V0LGZ1bmN0aW9uKGVuY29kZWRQYWNrZXRzKXtmb3IodmFyIGk9MDtpIDwgZW5jb2RlZFBhY2tldHMubGVuZ3RoO2krKykge3NlbGYuZW5naW5lLndyaXRlKGVuY29kZWRQYWNrZXRzW2ldLHBhY2tldC5vcHRpb25zKTt9c2VsZi5lbmNvZGluZyA9IGZhbHNlO3NlbGYucHJvY2Vzc1BhY2tldFF1ZXVlKCk7fSk7fWVsc2UgeyAvLyBhZGQgcGFja2V0IHRvIHRoZSBxdWV1ZVxuc2VsZi5wYWNrZXRCdWZmZXIucHVzaChwYWNrZXQpO319OyAvKipcbiAgICAgICAgICAgICAgICAgKiBJZiBwYWNrZXQgYnVmZmVyIGlzIG5vbi1lbXB0eSwgYmVnaW5zIGVuY29kaW5nIHRoZVxuICAgICAgICAgICAgICAgICAqIG5leHQgcGFja2V0IGluIGxpbmUuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKi9NYW5hZ2VyLnByb3RvdHlwZS5wcm9jZXNzUGFja2V0UXVldWUgPSBmdW5jdGlvbigpe2lmKHRoaXMucGFja2V0QnVmZmVyLmxlbmd0aCA+IDAgJiYgIXRoaXMuZW5jb2Rpbmcpe3ZhciBwYWNrPXRoaXMucGFja2V0QnVmZmVyLnNoaWZ0KCk7dGhpcy5wYWNrZXQocGFjayk7fX07IC8qKlxuICAgICAgICAgICAgICAgICAqIENsZWFuIHVwIHRyYW5zcG9ydCBzdWJzY3JpcHRpb25zIGFuZCBwYWNrZXQgYnVmZmVyLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICovTWFuYWdlci5wcm90b3R5cGUuY2xlYW51cCA9IGZ1bmN0aW9uKCl7ZGVidWcoJ2NsZWFudXAnKTt2YXIgc3ViO3doaWxlKHN1YiA9IHRoaXMuc3Vicy5zaGlmdCgpKSBzdWIuZGVzdHJveSgpO3RoaXMucGFja2V0QnVmZmVyID0gW107dGhpcy5lbmNvZGluZyA9IGZhbHNlO3RoaXMubGFzdFBpbmcgPSBudWxsO3RoaXMuZGVjb2Rlci5kZXN0cm95KCk7fTsgLyoqXG4gICAgICAgICAgICAgICAgICogQ2xvc2UgdGhlIGN1cnJlbnQgc29ja2V0LlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICovTWFuYWdlci5wcm90b3R5cGUuY2xvc2UgPSBNYW5hZ2VyLnByb3RvdHlwZS5kaXNjb25uZWN0ID0gZnVuY3Rpb24oKXtkZWJ1ZygnZGlzY29ubmVjdCcpO3RoaXMuc2tpcFJlY29ubmVjdCA9IHRydWU7dGhpcy5yZWNvbm5lY3RpbmcgPSBmYWxzZTtpZignb3BlbmluZycgPT0gdGhpcy5yZWFkeVN0YXRlKXsgLy8gYG9uY2xvc2VgIHdpbGwgbm90IGZpcmUgYmVjYXVzZVxuLy8gYW4gb3BlbiBldmVudCBuZXZlciBoYXBwZW5lZFxudGhpcy5jbGVhbnVwKCk7fXRoaXMuYmFja29mZi5yZXNldCgpO3RoaXMucmVhZHlTdGF0ZSA9ICdjbG9zZWQnO2lmKHRoaXMuZW5naW5lKXRoaXMuZW5naW5lLmNsb3NlKCk7fTsgLyoqXG4gICAgICAgICAgICAgICAgICogQ2FsbGVkIHVwb24gZW5naW5lIGNsb3NlLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICovTWFuYWdlci5wcm90b3R5cGUub25jbG9zZSA9IGZ1bmN0aW9uKHJlYXNvbil7ZGVidWcoJ29uY2xvc2UnKTt0aGlzLmNsZWFudXAoKTt0aGlzLmJhY2tvZmYucmVzZXQoKTt0aGlzLnJlYWR5U3RhdGUgPSAnY2xvc2VkJzt0aGlzLmVtaXQoJ2Nsb3NlJyxyZWFzb24pO2lmKHRoaXMuX3JlY29ubmVjdGlvbiAmJiAhdGhpcy5za2lwUmVjb25uZWN0KXt0aGlzLnJlY29ubmVjdCgpO319OyAvKipcbiAgICAgICAgICAgICAgICAgKiBBdHRlbXB0IGEgcmVjb25uZWN0aW9uLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICovTWFuYWdlci5wcm90b3R5cGUucmVjb25uZWN0ID0gZnVuY3Rpb24oKXtpZih0aGlzLnJlY29ubmVjdGluZyB8fCB0aGlzLnNraXBSZWNvbm5lY3QpcmV0dXJuIHRoaXM7dmFyIHNlbGY9dGhpcztpZih0aGlzLmJhY2tvZmYuYXR0ZW1wdHMgPj0gdGhpcy5fcmVjb25uZWN0aW9uQXR0ZW1wdHMpe2RlYnVnKCdyZWNvbm5lY3QgZmFpbGVkJyk7dGhpcy5iYWNrb2ZmLnJlc2V0KCk7dGhpcy5lbWl0QWxsKCdyZWNvbm5lY3RfZmFpbGVkJyk7dGhpcy5yZWNvbm5lY3RpbmcgPSBmYWxzZTt9ZWxzZSB7dmFyIGRlbGF5PXRoaXMuYmFja29mZi5kdXJhdGlvbigpO2RlYnVnKCd3aWxsIHdhaXQgJWRtcyBiZWZvcmUgcmVjb25uZWN0IGF0dGVtcHQnLGRlbGF5KTt0aGlzLnJlY29ubmVjdGluZyA9IHRydWU7dmFyIHRpbWVyPXNldFRpbWVvdXQoZnVuY3Rpb24oKXtpZihzZWxmLnNraXBSZWNvbm5lY3QpcmV0dXJuO2RlYnVnKCdhdHRlbXB0aW5nIHJlY29ubmVjdCcpO3NlbGYuZW1pdEFsbCgncmVjb25uZWN0X2F0dGVtcHQnLHNlbGYuYmFja29mZi5hdHRlbXB0cyk7c2VsZi5lbWl0QWxsKCdyZWNvbm5lY3RpbmcnLHNlbGYuYmFja29mZi5hdHRlbXB0cyk7IC8vIGNoZWNrIGFnYWluIGZvciB0aGUgY2FzZSBzb2NrZXQgY2xvc2VkIGluIGFib3ZlIGV2ZW50c1xuaWYoc2VsZi5za2lwUmVjb25uZWN0KXJldHVybjtzZWxmLm9wZW4oZnVuY3Rpb24oZXJyKXtpZihlcnIpe2RlYnVnKCdyZWNvbm5lY3QgYXR0ZW1wdCBlcnJvcicpO3NlbGYucmVjb25uZWN0aW5nID0gZmFsc2U7c2VsZi5yZWNvbm5lY3QoKTtzZWxmLmVtaXRBbGwoJ3JlY29ubmVjdF9lcnJvcicsZXJyLmRhdGEpO31lbHNlIHtkZWJ1ZygncmVjb25uZWN0IHN1Y2Nlc3MnKTtzZWxmLm9ucmVjb25uZWN0KCk7fX0pO30sZGVsYXkpO3RoaXMuc3Vicy5wdXNoKHtkZXN0cm95OmZ1bmN0aW9uIGRlc3Ryb3koKXtjbGVhclRpbWVvdXQodGltZXIpO319KTt9fTsgLyoqXG4gICAgICAgICAgICAgICAgICogQ2FsbGVkIHVwb24gc3VjY2Vzc2Z1bCByZWNvbm5lY3QuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKi9NYW5hZ2VyLnByb3RvdHlwZS5vbnJlY29ubmVjdCA9IGZ1bmN0aW9uKCl7dmFyIGF0dGVtcHQ9dGhpcy5iYWNrb2ZmLmF0dGVtcHRzO3RoaXMucmVjb25uZWN0aW5nID0gZmFsc2U7dGhpcy5iYWNrb2ZmLnJlc2V0KCk7dGhpcy51cGRhdGVTb2NrZXRJZHMoKTt0aGlzLmVtaXRBbGwoJ3JlY29ubmVjdCcsYXR0ZW1wdCk7fTt9LHtcIi4vb25cIjozMyxcIi4vc29ja2V0XCI6MzQsXCJiYWNrbzJcIjozNixcImNvbXBvbmVudC1iaW5kXCI6MzcsXCJjb21wb25lbnQtZW1pdHRlclwiOjM4LFwiZGVidWdcIjozOSxcImVuZ2luZS5pby1jbGllbnRcIjoxLFwiaW5kZXhvZlwiOjQyLFwic29ja2V0LmlvLXBhcnNlclwiOjQ3fV0sMzM6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpeyAvKipcbiAgICAgICAgICAgICAgICAgKiBNb2R1bGUgZXhwb3J0cy5cbiAgICAgICAgICAgICAgICAgKi9tb2R1bGUuZXhwb3J0cyA9IG9uOyAvKipcbiAgICAgICAgICAgICAgICAgKiBIZWxwZXIgZm9yIHN1YnNjcmlwdGlvbnMuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdHxFdmVudEVtaXR0ZXJ9IG9iaiB3aXRoIGBFbWl0dGVyYCBtaXhpbiBvciBgRXZlbnRFbWl0dGVyYFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudCBuYW1lXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAqL2Z1bmN0aW9uIG9uKG9iaixldixmbil7b2JqLm9uKGV2LGZuKTtyZXR1cm4ge2Rlc3Ryb3k6ZnVuY3Rpb24gZGVzdHJveSgpe29iai5yZW1vdmVMaXN0ZW5lcihldixmbik7fX07fX0se31dLDM0OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXsgLyoqXG4gICAgICAgICAgICAgICAgICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAgICAgICAgICAgICAgICAgKi92YXIgcGFyc2VyPV9kZXJlcV8oJ3NvY2tldC5pby1wYXJzZXInKTt2YXIgRW1pdHRlcj1fZGVyZXFfKCdjb21wb25lbnQtZW1pdHRlcicpO3ZhciB0b0FycmF5PV9kZXJlcV8oJ3RvLWFycmF5Jyk7dmFyIG9uPV9kZXJlcV8oJy4vb24nKTt2YXIgYmluZD1fZGVyZXFfKCdjb21wb25lbnQtYmluZCcpO3ZhciBkZWJ1Zz1fZGVyZXFfKCdkZWJ1ZycpKCdzb2NrZXQuaW8tY2xpZW50OnNvY2tldCcpO3ZhciBoYXNCaW49X2RlcmVxXygnaGFzLWJpbmFyeScpOyAvKipcbiAgICAgICAgICAgICAgICAgKiBNb2R1bGUgZXhwb3J0cy5cbiAgICAgICAgICAgICAgICAgKi9tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBTb2NrZXQ7IC8qKlxuICAgICAgICAgICAgICAgICAqIEludGVybmFsIGV2ZW50cyAoYmxhY2tsaXN0ZWQpLlxuICAgICAgICAgICAgICAgICAqIFRoZXNlIGV2ZW50cyBjYW4ndCBiZSBlbWl0dGVkIGJ5IHRoZSB1c2VyLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICovdmFyIGV2ZW50cz17Y29ubmVjdDoxLGNvbm5lY3RfZXJyb3I6MSxjb25uZWN0X3RpbWVvdXQ6MSxjb25uZWN0aW5nOjEsZGlzY29ubmVjdDoxLGVycm9yOjEscmVjb25uZWN0OjEscmVjb25uZWN0X2F0dGVtcHQ6MSxyZWNvbm5lY3RfZmFpbGVkOjEscmVjb25uZWN0X2Vycm9yOjEscmVjb25uZWN0aW5nOjEscGluZzoxLHBvbmc6MX07IC8qKlxuICAgICAgICAgICAgICAgICAqIFNob3J0Y3V0IHRvIGBFbWl0dGVyI2VtaXRgLlxuICAgICAgICAgICAgICAgICAqL3ZhciBlbWl0PUVtaXR0ZXIucHJvdG90eXBlLmVtaXQ7IC8qKlxuICAgICAgICAgICAgICAgICAqIGBTb2NrZXRgIGNvbnN0cnVjdG9yLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgKi9mdW5jdGlvbiBTb2NrZXQoaW8sbnNwKXt0aGlzLmlvID0gaW87dGhpcy5uc3AgPSBuc3A7dGhpcy5qc29uID0gdGhpczsgLy8gY29tcGF0XG50aGlzLmlkcyA9IDA7dGhpcy5hY2tzID0ge307dGhpcy5yZWNlaXZlQnVmZmVyID0gW107dGhpcy5zZW5kQnVmZmVyID0gW107dGhpcy5jb25uZWN0ZWQgPSBmYWxzZTt0aGlzLmRpc2Nvbm5lY3RlZCA9IHRydWU7aWYodGhpcy5pby5hdXRvQ29ubmVjdCl0aGlzLm9wZW4oKTt9IC8qKlxuICAgICAgICAgICAgICAgICAqIE1peCBpbiBgRW1pdHRlcmAuXG4gICAgICAgICAgICAgICAgICovRW1pdHRlcihTb2NrZXQucHJvdG90eXBlKTsgLyoqXG4gICAgICAgICAgICAgICAgICogU3Vic2NyaWJlIHRvIG9wZW4sIGNsb3NlIGFuZCBwYWNrZXQgZXZlbnRzXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKi9Tb2NrZXQucHJvdG90eXBlLnN1YkV2ZW50cyA9IGZ1bmN0aW9uKCl7aWYodGhpcy5zdWJzKXJldHVybjt2YXIgaW89dGhpcy5pbzt0aGlzLnN1YnMgPSBbb24oaW8sJ29wZW4nLGJpbmQodGhpcywnb25vcGVuJykpLG9uKGlvLCdwYWNrZXQnLGJpbmQodGhpcywnb25wYWNrZXQnKSksb24oaW8sJ2Nsb3NlJyxiaW5kKHRoaXMsJ29uY2xvc2UnKSldO307IC8qKlxuICAgICAgICAgICAgICAgICAqIFwiT3BlbnNcIiB0aGUgc29ja2V0LlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgKi9Tb2NrZXQucHJvdG90eXBlLm9wZW4gPSBTb2NrZXQucHJvdG90eXBlLmNvbm5lY3QgPSBmdW5jdGlvbigpe2lmKHRoaXMuY29ubmVjdGVkKXJldHVybiB0aGlzO3RoaXMuc3ViRXZlbnRzKCk7dGhpcy5pby5vcGVuKCk7IC8vIGVuc3VyZSBvcGVuXG5pZignb3BlbicgPT0gdGhpcy5pby5yZWFkeVN0YXRlKXRoaXMub25vcGVuKCk7dGhpcy5lbWl0KCdjb25uZWN0aW5nJyk7cmV0dXJuIHRoaXM7fTsgLyoqXG4gICAgICAgICAgICAgICAgICogU2VuZHMgYSBgbWVzc2FnZWAgZXZlbnQuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtTb2NrZXR9IHNlbGZcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAqL1NvY2tldC5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uKCl7dmFyIGFyZ3M9dG9BcnJheShhcmd1bWVudHMpO2FyZ3MudW5zaGlmdCgnbWVzc2FnZScpO3RoaXMuZW1pdC5hcHBseSh0aGlzLGFyZ3MpO3JldHVybiB0aGlzO307IC8qKlxuICAgICAgICAgICAgICAgICAqIE92ZXJyaWRlIGBlbWl0YC5cbiAgICAgICAgICAgICAgICAgKiBJZiB0aGUgZXZlbnQgaXMgaW4gYGV2ZW50c2AsIGl0J3MgZW1pdHRlZCBub3JtYWxseS5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudCBuYW1lXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7U29ja2V0fSBzZWxmXG4gICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgKi9Tb2NrZXQucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldil7aWYoZXZlbnRzLmhhc093blByb3BlcnR5KGV2KSl7ZW1pdC5hcHBseSh0aGlzLGFyZ3VtZW50cyk7cmV0dXJuIHRoaXM7fXZhciBhcmdzPXRvQXJyYXkoYXJndW1lbnRzKTt2YXIgcGFyc2VyVHlwZT1wYXJzZXIuRVZFTlQ7IC8vIGRlZmF1bHRcbmlmKGhhc0JpbihhcmdzKSl7cGFyc2VyVHlwZSA9IHBhcnNlci5CSU5BUllfRVZFTlQ7fSAvLyBiaW5hcnlcbnZhciBwYWNrZXQ9e3R5cGU6cGFyc2VyVHlwZSxkYXRhOmFyZ3N9O3BhY2tldC5vcHRpb25zID0ge307cGFja2V0Lm9wdGlvbnMuY29tcHJlc3MgPSAhdGhpcy5mbGFncyB8fCBmYWxzZSAhPT0gdGhpcy5mbGFncy5jb21wcmVzczsgLy8gZXZlbnQgYWNrIGNhbGxiYWNrXG5pZignZnVuY3Rpb24nID09IHR5cGVvZiBhcmdzW2FyZ3MubGVuZ3RoIC0gMV0pe2RlYnVnKCdlbWl0dGluZyBwYWNrZXQgd2l0aCBhY2sgaWQgJWQnLHRoaXMuaWRzKTt0aGlzLmFja3NbdGhpcy5pZHNdID0gYXJncy5wb3AoKTtwYWNrZXQuaWQgPSB0aGlzLmlkcysrO31pZih0aGlzLmNvbm5lY3RlZCl7dGhpcy5wYWNrZXQocGFja2V0KTt9ZWxzZSB7dGhpcy5zZW5kQnVmZmVyLnB1c2gocGFja2V0KTt9ZGVsZXRlIHRoaXMuZmxhZ3M7cmV0dXJuIHRoaXM7fTsgLyoqXG4gICAgICAgICAgICAgICAgICogU2VuZHMgYSBwYWNrZXQuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFja2V0XG4gICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICovU29ja2V0LnByb3RvdHlwZS5wYWNrZXQgPSBmdW5jdGlvbihwYWNrZXQpe3BhY2tldC5uc3AgPSB0aGlzLm5zcDt0aGlzLmlvLnBhY2tldChwYWNrZXQpO307IC8qKlxuICAgICAgICAgICAgICAgICAqIENhbGxlZCB1cG9uIGVuZ2luZSBgb3BlbmAuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKi9Tb2NrZXQucHJvdG90eXBlLm9ub3BlbiA9IGZ1bmN0aW9uKCl7ZGVidWcoJ3RyYW5zcG9ydCBpcyBvcGVuIC0gY29ubmVjdGluZycpOyAvLyB3cml0ZSBjb25uZWN0IHBhY2tldCBpZiBuZWNlc3NhcnlcbmlmKCcvJyAhPSB0aGlzLm5zcCl7dGhpcy5wYWNrZXQoe3R5cGU6cGFyc2VyLkNPTk5FQ1R9KTt9fTsgLyoqXG4gICAgICAgICAgICAgICAgICogQ2FsbGVkIHVwb24gZW5naW5lIGBjbG9zZWAuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcmVhc29uXG4gICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICovU29ja2V0LnByb3RvdHlwZS5vbmNsb3NlID0gZnVuY3Rpb24ocmVhc29uKXtkZWJ1ZygnY2xvc2UgKCVzKScscmVhc29uKTt0aGlzLmNvbm5lY3RlZCA9IGZhbHNlO3RoaXMuZGlzY29ubmVjdGVkID0gdHJ1ZTtkZWxldGUgdGhpcy5pZDt0aGlzLmVtaXQoJ2Rpc2Nvbm5lY3QnLHJlYXNvbik7fTsgLyoqXG4gICAgICAgICAgICAgICAgICogQ2FsbGVkIHdpdGggc29ja2V0IHBhY2tldC5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYWNrZXRcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKi9Tb2NrZXQucHJvdG90eXBlLm9ucGFja2V0ID0gZnVuY3Rpb24ocGFja2V0KXtpZihwYWNrZXQubnNwICE9IHRoaXMubnNwKXJldHVybjtzd2l0Y2gocGFja2V0LnR5cGUpe2Nhc2UgcGFyc2VyLkNPTk5FQ1Q6dGhpcy5vbmNvbm5lY3QoKTticmVhaztjYXNlIHBhcnNlci5FVkVOVDp0aGlzLm9uZXZlbnQocGFja2V0KTticmVhaztjYXNlIHBhcnNlci5CSU5BUllfRVZFTlQ6dGhpcy5vbmV2ZW50KHBhY2tldCk7YnJlYWs7Y2FzZSBwYXJzZXIuQUNLOnRoaXMub25hY2socGFja2V0KTticmVhaztjYXNlIHBhcnNlci5CSU5BUllfQUNLOnRoaXMub25hY2socGFja2V0KTticmVhaztjYXNlIHBhcnNlci5ESVNDT05ORUNUOnRoaXMub25kaXNjb25uZWN0KCk7YnJlYWs7Y2FzZSBwYXJzZXIuRVJST1I6dGhpcy5lbWl0KCdlcnJvcicscGFja2V0LmRhdGEpO2JyZWFrO319OyAvKipcbiAgICAgICAgICAgICAgICAgKiBDYWxsZWQgdXBvbiBhIHNlcnZlciBldmVudC5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYWNrZXRcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKi9Tb2NrZXQucHJvdG90eXBlLm9uZXZlbnQgPSBmdW5jdGlvbihwYWNrZXQpe3ZhciBhcmdzPXBhY2tldC5kYXRhIHx8IFtdO2RlYnVnKCdlbWl0dGluZyBldmVudCAlaicsYXJncyk7aWYobnVsbCAhPSBwYWNrZXQuaWQpe2RlYnVnKCdhdHRhY2hpbmcgYWNrIGNhbGxiYWNrIHRvIGV2ZW50Jyk7YXJncy5wdXNoKHRoaXMuYWNrKHBhY2tldC5pZCkpO31pZih0aGlzLmNvbm5lY3RlZCl7ZW1pdC5hcHBseSh0aGlzLGFyZ3MpO31lbHNlIHt0aGlzLnJlY2VpdmVCdWZmZXIucHVzaChhcmdzKTt9fTsgLyoqXG4gICAgICAgICAgICAgICAgICogUHJvZHVjZXMgYW4gYWNrIGNhbGxiYWNrIHRvIGVtaXQgd2l0aCBhbiBldmVudC5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAqL1NvY2tldC5wcm90b3R5cGUuYWNrID0gZnVuY3Rpb24oaWQpe3ZhciBzZWxmPXRoaXM7dmFyIHNlbnQ9ZmFsc2U7cmV0dXJuIGZ1bmN0aW9uKCl7IC8vIHByZXZlbnQgZG91YmxlIGNhbGxiYWNrc1xuaWYoc2VudClyZXR1cm47c2VudCA9IHRydWU7dmFyIGFyZ3M9dG9BcnJheShhcmd1bWVudHMpO2RlYnVnKCdzZW5kaW5nIGFjayAlaicsYXJncyk7dmFyIHR5cGU9aGFzQmluKGFyZ3MpP3BhcnNlci5CSU5BUllfQUNLOnBhcnNlci5BQ0s7c2VsZi5wYWNrZXQoe3R5cGU6dHlwZSxpZDppZCxkYXRhOmFyZ3N9KTt9O307IC8qKlxuICAgICAgICAgICAgICAgICAqIENhbGxlZCB1cG9uIGEgc2VydmVyIGFja25vd2xlZ2VtZW50LlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhY2tldFxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAqL1NvY2tldC5wcm90b3R5cGUub25hY2sgPSBmdW5jdGlvbihwYWNrZXQpe3ZhciBhY2s9dGhpcy5hY2tzW3BhY2tldC5pZF07aWYoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgYWNrKXtkZWJ1ZygnY2FsbGluZyBhY2sgJXMgd2l0aCAlaicscGFja2V0LmlkLHBhY2tldC5kYXRhKTthY2suYXBwbHkodGhpcyxwYWNrZXQuZGF0YSk7ZGVsZXRlIHRoaXMuYWNrc1twYWNrZXQuaWRdO31lbHNlIHtkZWJ1ZygnYmFkIGFjayAlcycscGFja2V0LmlkKTt9fTsgLyoqXG4gICAgICAgICAgICAgICAgICogQ2FsbGVkIHVwb24gc2VydmVyIGNvbm5lY3QuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKi9Tb2NrZXQucHJvdG90eXBlLm9uY29ubmVjdCA9IGZ1bmN0aW9uKCl7dGhpcy5jb25uZWN0ZWQgPSB0cnVlO3RoaXMuZGlzY29ubmVjdGVkID0gZmFsc2U7dGhpcy5lbWl0KCdjb25uZWN0Jyk7dGhpcy5lbWl0QnVmZmVyZWQoKTt9OyAvKipcbiAgICAgICAgICAgICAgICAgKiBFbWl0IGJ1ZmZlcmVkIGV2ZW50cyAocmVjZWl2ZWQgYW5kIGVtaXR0ZWQpLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICovU29ja2V0LnByb3RvdHlwZS5lbWl0QnVmZmVyZWQgPSBmdW5jdGlvbigpe3ZhciBpO2ZvcihpID0gMDtpIDwgdGhpcy5yZWNlaXZlQnVmZmVyLmxlbmd0aDtpKyspIHtlbWl0LmFwcGx5KHRoaXMsdGhpcy5yZWNlaXZlQnVmZmVyW2ldKTt9dGhpcy5yZWNlaXZlQnVmZmVyID0gW107Zm9yKGkgPSAwO2kgPCB0aGlzLnNlbmRCdWZmZXIubGVuZ3RoO2krKykge3RoaXMucGFja2V0KHRoaXMuc2VuZEJ1ZmZlcltpXSk7fXRoaXMuc2VuZEJ1ZmZlciA9IFtdO307IC8qKlxuICAgICAgICAgICAgICAgICAqIENhbGxlZCB1cG9uIHNlcnZlciBkaXNjb25uZWN0LlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICovU29ja2V0LnByb3RvdHlwZS5vbmRpc2Nvbm5lY3QgPSBmdW5jdGlvbigpe2RlYnVnKCdzZXJ2ZXIgZGlzY29ubmVjdCAoJXMpJyx0aGlzLm5zcCk7dGhpcy5kZXN0cm95KCk7dGhpcy5vbmNsb3NlKCdpbyBzZXJ2ZXIgZGlzY29ubmVjdCcpO307IC8qKlxuICAgICAgICAgICAgICAgICAqIENhbGxlZCB1cG9uIGZvcmNlZCBjbGllbnQvc2VydmVyIHNpZGUgZGlzY29ubmVjdGlvbnMsXG4gICAgICAgICAgICAgICAgICogdGhpcyBtZXRob2QgZW5zdXJlcyB0aGUgbWFuYWdlciBzdG9wcyB0cmFja2luZyB1cyBhbmRcbiAgICAgICAgICAgICAgICAgKiB0aGF0IHJlY29ubmVjdGlvbnMgZG9uJ3QgZ2V0IHRyaWdnZXJlZCBmb3IgdGhpcy5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZS5cbiAgICAgICAgICAgICAgICAgKi9Tb2NrZXQucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpe2lmKHRoaXMuc3Vicyl7IC8vIGNsZWFuIHN1YnNjcmlwdGlvbnMgdG8gYXZvaWQgcmVjb25uZWN0aW9uc1xuZm9yKHZhciBpPTA7aSA8IHRoaXMuc3Vicy5sZW5ndGg7aSsrKSB7dGhpcy5zdWJzW2ldLmRlc3Ryb3koKTt9dGhpcy5zdWJzID0gbnVsbDt9dGhpcy5pby5kZXN0cm95KHRoaXMpO307IC8qKlxuICAgICAgICAgICAgICAgICAqIERpc2Nvbm5lY3RzIHRoZSBzb2NrZXQgbWFudWFsbHkuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtTb2NrZXR9IHNlbGZcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAqL1NvY2tldC5wcm90b3R5cGUuY2xvc2UgPSBTb2NrZXQucHJvdG90eXBlLmRpc2Nvbm5lY3QgPSBmdW5jdGlvbigpe2lmKHRoaXMuY29ubmVjdGVkKXtkZWJ1ZygncGVyZm9ybWluZyBkaXNjb25uZWN0ICglcyknLHRoaXMubnNwKTt0aGlzLnBhY2tldCh7dHlwZTpwYXJzZXIuRElTQ09OTkVDVH0pO30gLy8gcmVtb3ZlIHNvY2tldCBmcm9tIHBvb2xcbnRoaXMuZGVzdHJveSgpO2lmKHRoaXMuY29ubmVjdGVkKXsgLy8gZmlyZSBldmVudHNcbnRoaXMub25jbG9zZSgnaW8gY2xpZW50IGRpc2Nvbm5lY3QnKTt9cmV0dXJuIHRoaXM7fTsgLyoqXG4gICAgICAgICAgICAgICAgICogU2V0cyB0aGUgY29tcHJlc3MgZmxhZy5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gaWYgYHRydWVgLCBjb21wcmVzc2VzIHRoZSBzZW5kaW5nIGRhdGFcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtTb2NrZXR9IHNlbGZcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAqL1NvY2tldC5wcm90b3R5cGUuY29tcHJlc3MgPSBmdW5jdGlvbihjb21wcmVzcyl7dGhpcy5mbGFncyA9IHRoaXMuZmxhZ3MgfHwge307dGhpcy5mbGFncy5jb21wcmVzcyA9IGNvbXByZXNzO3JldHVybiB0aGlzO307fSx7XCIuL29uXCI6MzMsXCJjb21wb25lbnQtYmluZFwiOjM3LFwiY29tcG9uZW50LWVtaXR0ZXJcIjozOCxcImRlYnVnXCI6MzksXCJoYXMtYmluYXJ5XCI6NDEsXCJzb2NrZXQuaW8tcGFyc2VyXCI6NDcsXCJ0by1hcnJheVwiOjUxfV0sMzU6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihnbG9iYWwpeyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAgICAgICAgICAgICAgICAgICAgICovdmFyIHBhcnNldXJpPV9kZXJlcV8oJ3BhcnNldXJpJyk7dmFyIGRlYnVnPV9kZXJlcV8oJ2RlYnVnJykoJ3NvY2tldC5pby1jbGllbnQ6dXJsJyk7IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBNb2R1bGUgZXhwb3J0cy5cbiAgICAgICAgICAgICAgICAgICAgICovbW9kdWxlLmV4cG9ydHMgPSB1cmw7IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBVUkwgcGFyc2VyLlxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBBbiBvYmplY3QgbWVhbnQgdG8gbWltaWMgd2luZG93LmxvY2F0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgKiAgICAgICAgICAgICAgICAgRGVmYXVsdHMgdG8gd2luZG93LmxvY2F0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAgICAgKi9mdW5jdGlvbiB1cmwodXJpLGxvYyl7dmFyIG9iaj11cmk7IC8vIGRlZmF1bHQgdG8gd2luZG93LmxvY2F0aW9uXG52YXIgbG9jPWxvYyB8fCBnbG9iYWwubG9jYXRpb247aWYobnVsbCA9PSB1cmkpdXJpID0gbG9jLnByb3RvY29sICsgJy8vJyArIGxvYy5ob3N0OyAvLyByZWxhdGl2ZSBwYXRoIHN1cHBvcnRcbmlmKCdzdHJpbmcnID09IHR5cGVvZiB1cmkpe2lmKCcvJyA9PSB1cmkuY2hhckF0KDApKXtpZignLycgPT0gdXJpLmNoYXJBdCgxKSl7dXJpID0gbG9jLnByb3RvY29sICsgdXJpO31lbHNlIHt1cmkgPSBsb2MuaG9zdCArIHVyaTt9fWlmKCEvXihodHRwcz98d3NzPyk6XFwvXFwvLy50ZXN0KHVyaSkpe2RlYnVnKCdwcm90b2NvbC1sZXNzIHVybCAlcycsdXJpKTtpZigndW5kZWZpbmVkJyAhPSB0eXBlb2YgbG9jKXt1cmkgPSBsb2MucHJvdG9jb2wgKyAnLy8nICsgdXJpO31lbHNlIHt1cmkgPSAnaHR0cHM6Ly8nICsgdXJpO319IC8vIHBhcnNlXG5kZWJ1ZygncGFyc2UgJXMnLHVyaSk7b2JqID0gcGFyc2V1cmkodXJpKTt9IC8vIG1ha2Ugc3VyZSB3ZSB0cmVhdCBgbG9jYWxob3N0OjgwYCBhbmQgYGxvY2FsaG9zdGAgZXF1YWxseVxuaWYoIW9iai5wb3J0KXtpZigvXihodHRwfHdzKSQvLnRlc3Qob2JqLnByb3RvY29sKSl7b2JqLnBvcnQgPSAnODAnO31lbHNlIGlmKC9eKGh0dHB8d3MpcyQvLnRlc3Qob2JqLnByb3RvY29sKSl7b2JqLnBvcnQgPSAnNDQzJzt9fW9iai5wYXRoID0gb2JqLnBhdGggfHwgJy8nO3ZhciBpcHY2PW9iai5ob3N0LmluZGV4T2YoJzonKSAhPT0gLTE7dmFyIGhvc3Q9aXB2Nj8nWycgKyBvYmouaG9zdCArICddJzpvYmouaG9zdDsgLy8gZGVmaW5lIHVuaXF1ZSBpZFxub2JqLmlkID0gb2JqLnByb3RvY29sICsgJzovLycgKyBob3N0ICsgJzonICsgb2JqLnBvcnQ7IC8vIGRlZmluZSBocmVmXG5vYmouaHJlZiA9IG9iai5wcm90b2NvbCArICc6Ly8nICsgaG9zdCArIChsb2MgJiYgbG9jLnBvcnQgPT0gb2JqLnBvcnQ/Jyc6JzonICsgb2JqLnBvcnQpO3JldHVybiBvYmo7fX0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIj9zZWxmOnR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCI/d2luZG93OnR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCI/Z2xvYmFsOnt9KTt9LHtcImRlYnVnXCI6MzksXCJwYXJzZXVyaVwiOjQ1fV0sMzY6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpeyAvKipcbiAgICAgICAgICAgICAgICAgKiBFeHBvc2UgYEJhY2tvZmZgLlxuICAgICAgICAgICAgICAgICAqL21vZHVsZS5leHBvcnRzID0gQmFja29mZjsgLyoqXG4gICAgICAgICAgICAgICAgICogSW5pdGlhbGl6ZSBiYWNrb2ZmIHRpbWVyIHdpdGggYG9wdHNgLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogLSBgbWluYCBpbml0aWFsIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIFsxMDBdXG4gICAgICAgICAgICAgICAgICogLSBgbWF4YCBtYXggdGltZW91dCBbMTAwMDBdXG4gICAgICAgICAgICAgICAgICogLSBgaml0dGVyYCBbMF1cbiAgICAgICAgICAgICAgICAgKiAtIGBmYWN0b3JgIFsyXVxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAqL2Z1bmN0aW9uIEJhY2tvZmYob3B0cyl7b3B0cyA9IG9wdHMgfHwge307dGhpcy5tcyA9IG9wdHMubWluIHx8IDEwMDt0aGlzLm1heCA9IG9wdHMubWF4IHx8IDEwMDAwO3RoaXMuZmFjdG9yID0gb3B0cy5mYWN0b3IgfHwgMjt0aGlzLmppdHRlciA9IG9wdHMuaml0dGVyID4gMCAmJiBvcHRzLmppdHRlciA8PSAxP29wdHMuaml0dGVyOjA7dGhpcy5hdHRlbXB0cyA9IDA7fSAvKipcbiAgICAgICAgICAgICAgICAgKiBSZXR1cm4gdGhlIGJhY2tvZmYgZHVyYXRpb24uXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgKi9CYWNrb2ZmLnByb3RvdHlwZS5kdXJhdGlvbiA9IGZ1bmN0aW9uKCl7dmFyIG1zPXRoaXMubXMgKiBNYXRoLnBvdyh0aGlzLmZhY3Rvcix0aGlzLmF0dGVtcHRzKyspO2lmKHRoaXMuaml0dGVyKXt2YXIgcmFuZD1NYXRoLnJhbmRvbSgpO3ZhciBkZXZpYXRpb249TWF0aC5mbG9vcihyYW5kICogdGhpcy5qaXR0ZXIgKiBtcyk7bXMgPSAoTWF0aC5mbG9vcihyYW5kICogMTApICYgMSkgPT0gMD9tcyAtIGRldmlhdGlvbjptcyArIGRldmlhdGlvbjt9cmV0dXJuIE1hdGgubWluKG1zLHRoaXMubWF4KSB8IDA7fTsgLyoqXG4gICAgICAgICAgICAgICAgICogUmVzZXQgdGhlIG51bWJlciBvZiBhdHRlbXB0cy5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAgICAgICAgICovQmFja29mZi5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbigpe3RoaXMuYXR0ZW1wdHMgPSAwO307IC8qKlxuICAgICAgICAgICAgICAgICAqIFNldCB0aGUgbWluaW11bSBkdXJhdGlvblxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgKi9CYWNrb2ZmLnByb3RvdHlwZS5zZXRNaW4gPSBmdW5jdGlvbihtaW4pe3RoaXMubXMgPSBtaW47fTsgLyoqXG4gICAgICAgICAgICAgICAgICogU2V0IHRoZSBtYXhpbXVtIGR1cmF0aW9uXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAqL0JhY2tvZmYucHJvdG90eXBlLnNldE1heCA9IGZ1bmN0aW9uKG1heCl7dGhpcy5tYXggPSBtYXg7fTsgLyoqXG4gICAgICAgICAgICAgICAgICogU2V0IHRoZSBqaXR0ZXJcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAgICAgICAgICovQmFja29mZi5wcm90b3R5cGUuc2V0Sml0dGVyID0gZnVuY3Rpb24oaml0dGVyKXt0aGlzLmppdHRlciA9IGppdHRlcjt9O30se31dLDM3OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXsgLyoqXG4gICAgICAgICAgICAgICAgICogU2xpY2UgcmVmZXJlbmNlLlxuICAgICAgICAgICAgICAgICAqL3ZhciBzbGljZT1bXS5zbGljZTsgLyoqXG4gICAgICAgICAgICAgICAgICogQmluZCBgb2JqYCB0byBgZm5gLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9ialxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb258U3RyaW5nfSBmbiBvciBzdHJpbmdcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAqL21vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqLGZuKXtpZignc3RyaW5nJyA9PSB0eXBlb2YgZm4pZm4gPSBvYmpbZm5dO2lmKCdmdW5jdGlvbicgIT0gdHlwZW9mIGZuKXRocm93IG5ldyBFcnJvcignYmluZCgpIHJlcXVpcmVzIGEgZnVuY3Rpb24nKTt2YXIgYXJncz1zbGljZS5jYWxsKGFyZ3VtZW50cywyKTtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gZm4uYXBwbHkob2JqLGFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO307fTt9LHt9XSwzODpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7IC8qKlxuICAgICAgICAgICAgICAgICAqIEV4cG9zZSBgRW1pdHRlcmAuXG4gICAgICAgICAgICAgICAgICovbW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyOyAvKipcbiAgICAgICAgICAgICAgICAgKiBJbml0aWFsaXplIGEgbmV3IGBFbWl0dGVyYC5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAgICAgICAgICovZnVuY3Rpb24gRW1pdHRlcihvYmope2lmKG9iailyZXR1cm4gbWl4aW4ob2JqKTt9OyAvKipcbiAgICAgICAgICAgICAgICAgKiBNaXhpbiB0aGUgZW1pdHRlciBwcm9wZXJ0aWVzLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9ialxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKi9mdW5jdGlvbiBtaXhpbihvYmope2Zvcih2YXIga2V5IGluIEVtaXR0ZXIucHJvdG90eXBlKSB7b2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO31yZXR1cm4gb2JqO30gLyoqXG4gICAgICAgICAgICAgICAgICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7RW1pdHRlcn1cbiAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAqL0VtaXR0ZXIucHJvdG90eXBlLm9uID0gRW1pdHRlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LGZuKXt0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307KHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF0gPSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdIHx8IFtdKS5wdXNoKGZuKTtyZXR1cm4gdGhpczt9OyAvKipcbiAgICAgICAgICAgICAgICAgKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcbiAgICAgICAgICAgICAgICAgKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtFbWl0dGVyfVxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAgICAgICAgICovRW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LGZuKXtmdW5jdGlvbiBvbigpe3RoaXMub2ZmKGV2ZW50LG9uKTtmbi5hcHBseSh0aGlzLGFyZ3VtZW50cyk7fW9uLmZuID0gZm47dGhpcy5vbihldmVudCxvbik7cmV0dXJuIHRoaXM7fTsgLyoqXG4gICAgICAgICAgICAgICAgICogUmVtb3ZlIHRoZSBnaXZlbiBjYWxsYmFjayBmb3IgYGV2ZW50YCBvciBhbGxcbiAgICAgICAgICAgICAgICAgKiByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7RW1pdHRlcn1cbiAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAqL0VtaXR0ZXIucHJvdG90eXBlLm9mZiA9IEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LGZuKXt0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307IC8vIGFsbFxuaWYoMCA9PSBhcmd1bWVudHMubGVuZ3RoKXt0aGlzLl9jYWxsYmFja3MgPSB7fTtyZXR1cm4gdGhpczt9IC8vIHNwZWNpZmljIGV2ZW50XG52YXIgY2FsbGJhY2tzPXRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF07aWYoIWNhbGxiYWNrcylyZXR1cm4gdGhpczsgLy8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xuaWYoMSA9PSBhcmd1bWVudHMubGVuZ3RoKXtkZWxldGUgdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtyZXR1cm4gdGhpczt9IC8vIHJlbW92ZSBzcGVjaWZpYyBoYW5kbGVyXG52YXIgY2I7Zm9yKHZhciBpPTA7aSA8IGNhbGxiYWNrcy5sZW5ndGg7aSsrKSB7Y2IgPSBjYWxsYmFja3NbaV07aWYoY2IgPT09IGZuIHx8IGNiLmZuID09PSBmbil7Y2FsbGJhY2tzLnNwbGljZShpLDEpO2JyZWFrO319cmV0dXJuIHRoaXM7fTsgLyoqXG4gICAgICAgICAgICAgICAgICogRW1pdCBgZXZlbnRgIHdpdGggdGhlIGdpdmVuIGFyZ3MuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge01peGVkfSAuLi5cbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtFbWl0dGVyfVxuICAgICAgICAgICAgICAgICAqL0VtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudCl7dGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O3ZhciBhcmdzPVtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLDEpLGNhbGxiYWNrcz10aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdO2lmKGNhbGxiYWNrcyl7Y2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApO2Zvcih2YXIgaT0wLGxlbj1jYWxsYmFja3MubGVuZ3RoO2kgPCBsZW47KytpKSB7Y2FsbGJhY2tzW2ldLmFwcGx5KHRoaXMsYXJncyk7fX1yZXR1cm4gdGhpczt9OyAvKipcbiAgICAgICAgICAgICAgICAgKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgKi9FbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7dGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O3JldHVybiB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdIHx8IFtdO307IC8qKlxuICAgICAgICAgICAgICAgICAqIENoZWNrIGlmIHRoaXMgZW1pdHRlciBoYXMgYGV2ZW50YCBoYW5kbGVycy5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgKi9FbWl0dGVyLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7cmV0dXJuICEhdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDt9O30se31dLDM5OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXthcmd1bWVudHNbNF1bMTddWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKTt9LHtcIi4vZGVidWdcIjo0MCxcImR1cFwiOjE3fV0sNDA6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe2FyZ3VtZW50c1s0XVsxOF1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpO30se1wiZHVwXCI6MTgsXCJtc1wiOjQ0fV0sNDE6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihnbG9iYWwpeyAvKlxuICAgICAgICAgICAgICAgICAgICAgKiBNb2R1bGUgcmVxdWlyZW1lbnRzLlxuICAgICAgICAgICAgICAgICAgICAgKi92YXIgaXNBcnJheT1fZGVyZXFfKCdpc2FycmF5Jyk7IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBNb2R1bGUgZXhwb3J0cy5cbiAgICAgICAgICAgICAgICAgICAgICovbW9kdWxlLmV4cG9ydHMgPSBoYXNCaW5hcnk7IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBDaGVja3MgZm9yIGJpbmFyeSBkYXRhLlxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBSaWdodCBub3cgb25seSBCdWZmZXIgYW5kIEFycmF5QnVmZmVyIGFyZSBzdXBwb3J0ZWQuLlxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gYW55dGhpbmdcbiAgICAgICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgICAgICovZnVuY3Rpb24gaGFzQmluYXJ5KGRhdGEpe2Z1bmN0aW9uIF9oYXNCaW5hcnkob2JqKXtpZighb2JqKXJldHVybiBmYWxzZTtpZihnbG9iYWwuQnVmZmVyICYmIGdsb2JhbC5CdWZmZXIuaXNCdWZmZXIgJiYgZ2xvYmFsLkJ1ZmZlci5pc0J1ZmZlcihvYmopIHx8IGdsb2JhbC5BcnJheUJ1ZmZlciAmJiBvYmogaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciB8fCBnbG9iYWwuQmxvYiAmJiBvYmogaW5zdGFuY2VvZiBCbG9iIHx8IGdsb2JhbC5GaWxlICYmIG9iaiBpbnN0YW5jZW9mIEZpbGUpe3JldHVybiB0cnVlO31pZihpc0FycmF5KG9iaikpe2Zvcih2YXIgaT0wO2kgPCBvYmoubGVuZ3RoO2krKykge2lmKF9oYXNCaW5hcnkob2JqW2ldKSl7cmV0dXJuIHRydWU7fX19ZWxzZSBpZihvYmogJiYgJ29iamVjdCcgPT0gdHlwZW9mIG9iail7IC8vIHNlZTogaHR0cHM6Ly9naXRodWIuY29tL0F1dG9tYXR0aWMvaGFzLWJpbmFyeS9wdWxsLzRcbmlmKG9iai50b0pTT04gJiYgJ2Z1bmN0aW9uJyA9PSB0eXBlb2Ygb2JqLnRvSlNPTil7b2JqID0gb2JqLnRvSlNPTigpO31mb3IodmFyIGtleSBpbiBvYmopIHtpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLGtleSkgJiYgX2hhc0JpbmFyeShvYmpba2V5XSkpe3JldHVybiB0cnVlO319fXJldHVybiBmYWxzZTt9cmV0dXJuIF9oYXNCaW5hcnkoZGF0YSk7fX0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIj9zZWxmOnR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCI/d2luZG93OnR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCI/Z2xvYmFsOnt9KTt9LHtcImlzYXJyYXlcIjo0M31dLDQyOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXthcmd1bWVudHNbNF1bMjNdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKTt9LHtcImR1cFwiOjIzfV0sNDM6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe2FyZ3VtZW50c1s0XVsyNF1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpO30se1wiZHVwXCI6MjR9XSw0NDpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7YXJndW1lbnRzWzRdWzI1XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cyk7fSx7XCJkdXBcIjoyNX1dLDQ1OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXthcmd1bWVudHNbNF1bMjhdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKTt9LHtcImR1cFwiOjI4fV0sNDY6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihnbG9iYWwpeyAvKmdsb2JhbCBCbG9iLEZpbGUqLyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogTW9kdWxlIHJlcXVpcmVtZW50c1xuICAgICAgICAgICAgICAgICAgICAgKi92YXIgaXNBcnJheT1fZGVyZXFfKCdpc2FycmF5Jyk7dmFyIGlzQnVmPV9kZXJlcV8oJy4vaXMtYnVmZmVyJyk7IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBSZXBsYWNlcyBldmVyeSBCdWZmZXIgfCBBcnJheUJ1ZmZlciBpbiBwYWNrZXQgd2l0aCBhIG51bWJlcmVkIHBsYWNlaG9sZGVyLlxuICAgICAgICAgICAgICAgICAgICAgKiBBbnl0aGluZyB3aXRoIGJsb2JzIG9yIGZpbGVzIHNob3VsZCBiZSBmZWQgdGhyb3VnaCByZW1vdmVCbG9icyBiZWZvcmUgY29taW5nXG4gICAgICAgICAgICAgICAgICAgICAqIGhlcmUuXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYWNrZXQgLSBzb2NrZXQuaW8gZXZlbnQgcGFja2V0XG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gd2l0aCBkZWNvbnN0cnVjdGVkIHBhY2tldCBhbmQgbGlzdCBvZiBidWZmZXJzXG4gICAgICAgICAgICAgICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAgICAgICAgICAgICAqL2V4cG9ydHMuZGVjb25zdHJ1Y3RQYWNrZXQgPSBmdW5jdGlvbihwYWNrZXQpe3ZhciBidWZmZXJzPVtdO3ZhciBwYWNrZXREYXRhPXBhY2tldC5kYXRhO2Z1bmN0aW9uIF9kZWNvbnN0cnVjdFBhY2tldChkYXRhKXtpZighZGF0YSlyZXR1cm4gZGF0YTtpZihpc0J1ZihkYXRhKSl7dmFyIHBsYWNlaG9sZGVyPXtfcGxhY2Vob2xkZXI6dHJ1ZSxudW06YnVmZmVycy5sZW5ndGh9O2J1ZmZlcnMucHVzaChkYXRhKTtyZXR1cm4gcGxhY2Vob2xkZXI7fWVsc2UgaWYoaXNBcnJheShkYXRhKSl7dmFyIG5ld0RhdGE9bmV3IEFycmF5KGRhdGEubGVuZ3RoKTtmb3IodmFyIGk9MDtpIDwgZGF0YS5sZW5ndGg7aSsrKSB7bmV3RGF0YVtpXSA9IF9kZWNvbnN0cnVjdFBhY2tldChkYXRhW2ldKTt9cmV0dXJuIG5ld0RhdGE7fWVsc2UgaWYoJ29iamVjdCcgPT0gdHlwZW9mIGRhdGEgJiYgIShkYXRhIGluc3RhbmNlb2YgRGF0ZSkpe3ZhciBuZXdEYXRhPXt9O2Zvcih2YXIga2V5IGluIGRhdGEpIHtuZXdEYXRhW2tleV0gPSBfZGVjb25zdHJ1Y3RQYWNrZXQoZGF0YVtrZXldKTt9cmV0dXJuIG5ld0RhdGE7fXJldHVybiBkYXRhO312YXIgcGFjaz1wYWNrZXQ7cGFjay5kYXRhID0gX2RlY29uc3RydWN0UGFja2V0KHBhY2tldERhdGEpO3BhY2suYXR0YWNobWVudHMgPSBidWZmZXJzLmxlbmd0aDsgLy8gbnVtYmVyIG9mIGJpbmFyeSAnYXR0YWNobWVudHMnXG5yZXR1cm4ge3BhY2tldDpwYWNrLGJ1ZmZlcnM6YnVmZmVyc307fTsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFJlY29uc3RydWN0cyBhIGJpbmFyeSBwYWNrZXQgZnJvbSBpdHMgcGxhY2Vob2xkZXIgcGFja2V0IGFuZCBidWZmZXJzXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYWNrZXQgLSBldmVudCBwYWNrZXQgd2l0aCBwbGFjZWhvbGRlcnNcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHtBcnJheX0gYnVmZmVycyAtIGJpbmFyeSBidWZmZXJzIHRvIHB1dCBpbiBwbGFjZWhvbGRlciBwb3NpdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSByZWNvbnN0cnVjdGVkIHBhY2tldFxuICAgICAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAgICAgKi9leHBvcnRzLnJlY29uc3RydWN0UGFja2V0ID0gZnVuY3Rpb24ocGFja2V0LGJ1ZmZlcnMpe3ZhciBjdXJQbGFjZUhvbGRlcj0wO2Z1bmN0aW9uIF9yZWNvbnN0cnVjdFBhY2tldChkYXRhKXtpZihkYXRhICYmIGRhdGEuX3BsYWNlaG9sZGVyKXt2YXIgYnVmPWJ1ZmZlcnNbZGF0YS5udW1dOyAvLyBhcHByb3ByaWF0ZSBidWZmZXIgKHNob3VsZCBiZSBuYXR1cmFsIG9yZGVyIGFueXdheSlcbnJldHVybiBidWY7fWVsc2UgaWYoaXNBcnJheShkYXRhKSl7Zm9yKHZhciBpPTA7aSA8IGRhdGEubGVuZ3RoO2krKykge2RhdGFbaV0gPSBfcmVjb25zdHJ1Y3RQYWNrZXQoZGF0YVtpXSk7fXJldHVybiBkYXRhO31lbHNlIGlmKGRhdGEgJiYgJ29iamVjdCcgPT0gdHlwZW9mIGRhdGEpe2Zvcih2YXIga2V5IGluIGRhdGEpIHtkYXRhW2tleV0gPSBfcmVjb25zdHJ1Y3RQYWNrZXQoZGF0YVtrZXldKTt9cmV0dXJuIGRhdGE7fXJldHVybiBkYXRhO31wYWNrZXQuZGF0YSA9IF9yZWNvbnN0cnVjdFBhY2tldChwYWNrZXQuZGF0YSk7cGFja2V0LmF0dGFjaG1lbnRzID0gdW5kZWZpbmVkOyAvLyBubyBsb25nZXIgdXNlZnVsXG5yZXR1cm4gcGFja2V0O307IC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBBc3luY2hyb25vdXNseSByZW1vdmVzIEJsb2JzIG9yIEZpbGVzIGZyb20gZGF0YSB2aWFcbiAgICAgICAgICAgICAgICAgICAgICogRmlsZVJlYWRlcidzIHJlYWRBc0FycmF5QnVmZmVyIG1ldGhvZC4gVXNlZCBiZWZvcmUgZW5jb2RpbmdcbiAgICAgICAgICAgICAgICAgICAgICogZGF0YSBhcyBtc2dwYWNrLiBDYWxscyBjYWxsYmFjayB3aXRoIHRoZSBibG9ibGVzcyBkYXRhLlxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgICAgICovZXhwb3J0cy5yZW1vdmVCbG9icyA9IGZ1bmN0aW9uKGRhdGEsY2FsbGJhY2spe2Z1bmN0aW9uIF9yZW1vdmVCbG9icyhvYmosY3VyS2V5LGNvbnRhaW5pbmdPYmplY3Qpe2lmKCFvYmopcmV0dXJuIG9iajsgLy8gY29udmVydCBhbnkgYmxvYlxuaWYoZ2xvYmFsLkJsb2IgJiYgb2JqIGluc3RhbmNlb2YgQmxvYiB8fCBnbG9iYWwuRmlsZSAmJiBvYmogaW5zdGFuY2VvZiBGaWxlKXtwZW5kaW5nQmxvYnMrKzsgLy8gYXN5bmMgZmlsZXJlYWRlclxudmFyIGZpbGVSZWFkZXI9bmV3IEZpbGVSZWFkZXIoKTtmaWxlUmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCl7IC8vIHRoaXMucmVzdWx0ID09IGFycmF5YnVmZmVyXG5pZihjb250YWluaW5nT2JqZWN0KXtjb250YWluaW5nT2JqZWN0W2N1cktleV0gPSB0aGlzLnJlc3VsdDt9ZWxzZSB7YmxvYmxlc3NEYXRhID0gdGhpcy5yZXN1bHQ7fSAvLyBpZiBub3RoaW5nIHBlbmRpbmcgaXRzIGNhbGxiYWNrIHRpbWVcbmlmKCEgLS1wZW5kaW5nQmxvYnMpe2NhbGxiYWNrKGJsb2JsZXNzRGF0YSk7fX07ZmlsZVJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihvYmopOyAvLyBibG9iIC0+IGFycmF5YnVmZmVyXG59ZWxzZSBpZihpc0FycmF5KG9iaikpeyAvLyBoYW5kbGUgYXJyYXlcbmZvcih2YXIgaT0wO2kgPCBvYmoubGVuZ3RoO2krKykge19yZW1vdmVCbG9icyhvYmpbaV0saSxvYmopO319ZWxzZSBpZihvYmogJiYgJ29iamVjdCcgPT0gdHlwZW9mIG9iaiAmJiAhaXNCdWYob2JqKSl7IC8vIGFuZCBvYmplY3RcbmZvcih2YXIga2V5IGluIG9iaikge19yZW1vdmVCbG9icyhvYmpba2V5XSxrZXksb2JqKTt9fX12YXIgcGVuZGluZ0Jsb2JzPTA7dmFyIGJsb2JsZXNzRGF0YT1kYXRhO19yZW1vdmVCbG9icyhibG9ibGVzc0RhdGEpO2lmKCFwZW5kaW5nQmxvYnMpe2NhbGxiYWNrKGJsb2JsZXNzRGF0YSk7fX07fSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiP3NlbGY6dHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIj93aW5kb3c6dHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIj9nbG9iYWw6e30pO30se1wiLi9pcy1idWZmZXJcIjo0OCxcImlzYXJyYXlcIjo0M31dLDQ3OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXsgLyoqXG4gICAgICAgICAgICAgICAgICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAgICAgICAgICAgICAgICAgKi92YXIgZGVidWc9X2RlcmVxXygnZGVidWcnKSgnc29ja2V0LmlvLXBhcnNlcicpO3ZhciBqc29uPV9kZXJlcV8oJ2pzb24zJyk7dmFyIGlzQXJyYXk9X2RlcmVxXygnaXNhcnJheScpO3ZhciBFbWl0dGVyPV9kZXJlcV8oJ2NvbXBvbmVudC1lbWl0dGVyJyk7dmFyIGJpbmFyeT1fZGVyZXFfKCcuL2JpbmFyeScpO3ZhciBpc0J1Zj1fZGVyZXFfKCcuL2lzLWJ1ZmZlcicpOyAvKipcbiAgICAgICAgICAgICAgICAgKiBQcm90b2NvbCB2ZXJzaW9uLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgKi9leHBvcnRzLnByb3RvY29sID0gNDsgLyoqXG4gICAgICAgICAgICAgICAgICogUGFja2V0IHR5cGVzLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgKi9leHBvcnRzLnR5cGVzID0gWydDT05ORUNUJywnRElTQ09OTkVDVCcsJ0VWRU5UJywnQklOQVJZX0VWRU5UJywnQUNLJywnQklOQVJZX0FDSycsJ0VSUk9SJ107IC8qKlxuICAgICAgICAgICAgICAgICAqIFBhY2tldCB0eXBlIGBjb25uZWN0YC5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAgICAgICAgICovZXhwb3J0cy5DT05ORUNUID0gMDsgLyoqXG4gICAgICAgICAgICAgICAgICogUGFja2V0IHR5cGUgYGRpc2Nvbm5lY3RgLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgKi9leHBvcnRzLkRJU0NPTk5FQ1QgPSAxOyAvKipcbiAgICAgICAgICAgICAgICAgKiBQYWNrZXQgdHlwZSBgZXZlbnRgLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgKi9leHBvcnRzLkVWRU5UID0gMjsgLyoqXG4gICAgICAgICAgICAgICAgICogUGFja2V0IHR5cGUgYGFja2AuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAqL2V4cG9ydHMuQUNLID0gMzsgLyoqXG4gICAgICAgICAgICAgICAgICogUGFja2V0IHR5cGUgYGVycm9yYC5cbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAgICAgICAgICovZXhwb3J0cy5FUlJPUiA9IDQ7IC8qKlxuICAgICAgICAgICAgICAgICAqIFBhY2tldCB0eXBlICdiaW5hcnkgZXZlbnQnXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAqL2V4cG9ydHMuQklOQVJZX0VWRU5UID0gNTsgLyoqXG4gICAgICAgICAgICAgICAgICogUGFja2V0IHR5cGUgYGJpbmFyeSBhY2tgLiBGb3IgYWNrcyB3aXRoIGJpbmFyeSBhcmd1bWVudHMuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAqL2V4cG9ydHMuQklOQVJZX0FDSyA9IDY7IC8qKlxuICAgICAgICAgICAgICAgICAqIEVuY29kZXIgY29uc3RydWN0b3IuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAqL2V4cG9ydHMuRW5jb2RlciA9IEVuY29kZXI7IC8qKlxuICAgICAgICAgICAgICAgICAqIERlY29kZXIgY29uc3RydWN0b3IuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAqL2V4cG9ydHMuRGVjb2RlciA9IERlY29kZXI7IC8qKlxuICAgICAgICAgICAgICAgICAqIEEgc29ja2V0LmlvIEVuY29kZXIgaW5zdGFuY2VcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAgICAgICAgICovZnVuY3Rpb24gRW5jb2Rlcigpe30gLyoqXG4gICAgICAgICAgICAgICAgICogRW5jb2RlIGEgcGFja2V0IGFzIGEgc2luZ2xlIHN0cmluZyBpZiBub24tYmluYXJ5LCBvciBhcyBhXG4gICAgICAgICAgICAgICAgICogYnVmZmVyIHNlcXVlbmNlLCBkZXBlbmRpbmcgb24gcGFja2V0IHR5cGUuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIC0gcGFja2V0IG9iamVjdFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gZnVuY3Rpb24gdG8gaGFuZGxlIGVuY29kaW5ncyAobGlrZWx5IGVuZ2luZS53cml0ZSlcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIENhbGxzIGNhbGxiYWNrIHdpdGggQXJyYXkgb2YgZW5jb2RpbmdzXG4gICAgICAgICAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICAgICAgICAgKi9FbmNvZGVyLnByb3RvdHlwZS5lbmNvZGUgPSBmdW5jdGlvbihvYmosY2FsbGJhY2spe2RlYnVnKCdlbmNvZGluZyBwYWNrZXQgJWonLG9iaik7aWYoZXhwb3J0cy5CSU5BUllfRVZFTlQgPT0gb2JqLnR5cGUgfHwgZXhwb3J0cy5CSU5BUllfQUNLID09IG9iai50eXBlKXtlbmNvZGVBc0JpbmFyeShvYmosY2FsbGJhY2spO31lbHNlIHt2YXIgZW5jb2Rpbmc9ZW5jb2RlQXNTdHJpbmcob2JqKTtjYWxsYmFjayhbZW5jb2RpbmddKTt9fTsgLyoqXG4gICAgICAgICAgICAgICAgICogRW5jb2RlIHBhY2tldCBhcyBzdHJpbmcuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFja2V0XG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7U3RyaW5nfSBlbmNvZGVkXG4gICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICovZnVuY3Rpb24gZW5jb2RlQXNTdHJpbmcob2JqKXt2YXIgc3RyPScnO3ZhciBuc3A9ZmFsc2U7IC8vIGZpcnN0IGlzIHR5cGVcbnN0ciArPSBvYmoudHlwZTsgLy8gYXR0YWNobWVudHMgaWYgd2UgaGF2ZSB0aGVtXG5pZihleHBvcnRzLkJJTkFSWV9FVkVOVCA9PSBvYmoudHlwZSB8fCBleHBvcnRzLkJJTkFSWV9BQ0sgPT0gb2JqLnR5cGUpe3N0ciArPSBvYmouYXR0YWNobWVudHM7c3RyICs9ICctJzt9IC8vIGlmIHdlIGhhdmUgYSBuYW1lc3BhY2Ugb3RoZXIgdGhhbiBgL2Bcbi8vIHdlIGFwcGVuZCBpdCBmb2xsb3dlZCBieSBhIGNvbW1hIGAsYFxuaWYob2JqLm5zcCAmJiAnLycgIT0gb2JqLm5zcCl7bnNwID0gdHJ1ZTtzdHIgKz0gb2JqLm5zcDt9IC8vIGltbWVkaWF0ZWx5IGZvbGxvd2VkIGJ5IHRoZSBpZFxuaWYobnVsbCAhPSBvYmouaWQpe2lmKG5zcCl7c3RyICs9ICcsJztuc3AgPSBmYWxzZTt9c3RyICs9IG9iai5pZDt9IC8vIGpzb24gZGF0YVxuaWYobnVsbCAhPSBvYmouZGF0YSl7aWYobnNwKXN0ciArPSAnLCc7c3RyICs9IGpzb24uc3RyaW5naWZ5KG9iai5kYXRhKTt9ZGVidWcoJ2VuY29kZWQgJWogYXMgJXMnLG9iaixzdHIpO3JldHVybiBzdHI7fSAvKipcbiAgICAgICAgICAgICAgICAgKiBFbmNvZGUgcGFja2V0IGFzICdidWZmZXIgc2VxdWVuY2UnIGJ5IHJlbW92aW5nIGJsb2JzLCBhbmRcbiAgICAgICAgICAgICAgICAgKiBkZWNvbnN0cnVjdGluZyBwYWNrZXQgaW50byBvYmplY3Qgd2l0aCBwbGFjZWhvbGRlcnMgYW5kXG4gICAgICAgICAgICAgICAgICogYSBsaXN0IG9mIGJ1ZmZlcnMuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFja2V0XG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7QnVmZmVyfSBlbmNvZGVkXG4gICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICovZnVuY3Rpb24gZW5jb2RlQXNCaW5hcnkob2JqLGNhbGxiYWNrKXtmdW5jdGlvbiB3cml0ZUVuY29kaW5nKGJsb2JsZXNzRGF0YSl7dmFyIGRlY29uc3RydWN0aW9uPWJpbmFyeS5kZWNvbnN0cnVjdFBhY2tldChibG9ibGVzc0RhdGEpO3ZhciBwYWNrPWVuY29kZUFzU3RyaW5nKGRlY29uc3RydWN0aW9uLnBhY2tldCk7dmFyIGJ1ZmZlcnM9ZGVjb25zdHJ1Y3Rpb24uYnVmZmVycztidWZmZXJzLnVuc2hpZnQocGFjayk7IC8vIGFkZCBwYWNrZXQgaW5mbyB0byBiZWdpbm5pbmcgb2YgZGF0YSBsaXN0XG5jYWxsYmFjayhidWZmZXJzKTsgLy8gd3JpdGUgYWxsIHRoZSBidWZmZXJzXG59YmluYXJ5LnJlbW92ZUJsb2JzKG9iaix3cml0ZUVuY29kaW5nKTt9IC8qKlxuICAgICAgICAgICAgICAgICAqIEEgc29ja2V0LmlvIERlY29kZXIgaW5zdGFuY2VcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gZGVjb2RlclxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAgICAgICAgICovZnVuY3Rpb24gRGVjb2Rlcigpe3RoaXMucmVjb25zdHJ1Y3RvciA9IG51bGw7fSAvKipcbiAgICAgICAgICAgICAgICAgKiBNaXggaW4gYEVtaXR0ZXJgIHdpdGggRGVjb2Rlci5cbiAgICAgICAgICAgICAgICAgKi9FbWl0dGVyKERlY29kZXIucHJvdG90eXBlKTsgLyoqXG4gICAgICAgICAgICAgICAgICogRGVjb2RlcyBhbiBlY29kZWQgcGFja2V0IHN0cmluZyBpbnRvIHBhY2tldCBKU09OLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9iaiAtIGVuY29kZWQgcGFja2V0XG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSBwYWNrZXRcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgICAgICAgICAqL0RlY29kZXIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKG9iail7dmFyIHBhY2tldDtpZignc3RyaW5nJyA9PSB0eXBlb2Ygb2JqKXtwYWNrZXQgPSBkZWNvZGVTdHJpbmcob2JqKTtpZihleHBvcnRzLkJJTkFSWV9FVkVOVCA9PSBwYWNrZXQudHlwZSB8fCBleHBvcnRzLkJJTkFSWV9BQ0sgPT0gcGFja2V0LnR5cGUpeyAvLyBiaW5hcnkgcGFja2V0J3MganNvblxudGhpcy5yZWNvbnN0cnVjdG9yID0gbmV3IEJpbmFyeVJlY29uc3RydWN0b3IocGFja2V0KTsgLy8gbm8gYXR0YWNobWVudHMsIGxhYmVsZWQgYmluYXJ5IGJ1dCBubyBiaW5hcnkgZGF0YSB0byBmb2xsb3dcbmlmKHRoaXMucmVjb25zdHJ1Y3Rvci5yZWNvblBhY2suYXR0YWNobWVudHMgPT09IDApe3RoaXMuZW1pdCgnZGVjb2RlZCcscGFja2V0KTt9fWVsc2UgeyAvLyBub24tYmluYXJ5IGZ1bGwgcGFja2V0XG50aGlzLmVtaXQoJ2RlY29kZWQnLHBhY2tldCk7fX1lbHNlIGlmKGlzQnVmKG9iaikgfHwgb2JqLmJhc2U2NCl7IC8vIHJhdyBiaW5hcnkgZGF0YVxuaWYoIXRoaXMucmVjb25zdHJ1Y3Rvcil7dGhyb3cgbmV3IEVycm9yKCdnb3QgYmluYXJ5IGRhdGEgd2hlbiBub3QgcmVjb25zdHJ1Y3RpbmcgYSBwYWNrZXQnKTt9ZWxzZSB7cGFja2V0ID0gdGhpcy5yZWNvbnN0cnVjdG9yLnRha2VCaW5hcnlEYXRhKG9iaik7aWYocGFja2V0KXsgLy8gcmVjZWl2ZWQgZmluYWwgYnVmZmVyXG50aGlzLnJlY29uc3RydWN0b3IgPSBudWxsO3RoaXMuZW1pdCgnZGVjb2RlZCcscGFja2V0KTt9fX1lbHNlIHt0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gdHlwZTogJyArIG9iaik7fX07IC8qKlxuICAgICAgICAgICAgICAgICAqIERlY29kZSBhIHBhY2tldCBTdHJpbmcgKEpTT04gZGF0YSlcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHBhY2tldFxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAqL2Z1bmN0aW9uIGRlY29kZVN0cmluZyhzdHIpe3ZhciBwPXt9O3ZhciBpPTA7IC8vIGxvb2sgdXAgdHlwZVxucC50eXBlID0gTnVtYmVyKHN0ci5jaGFyQXQoMCkpO2lmKG51bGwgPT0gZXhwb3J0cy50eXBlc1twLnR5cGVdKXJldHVybiBlcnJvcigpOyAvLyBsb29rIHVwIGF0dGFjaG1lbnRzIGlmIHR5cGUgYmluYXJ5XG5pZihleHBvcnRzLkJJTkFSWV9FVkVOVCA9PSBwLnR5cGUgfHwgZXhwb3J0cy5CSU5BUllfQUNLID09IHAudHlwZSl7dmFyIGJ1Zj0nJzt3aGlsZShzdHIuY2hhckF0KCsraSkgIT0gJy0nKSB7YnVmICs9IHN0ci5jaGFyQXQoaSk7aWYoaSA9PSBzdHIubGVuZ3RoKWJyZWFrO31pZihidWYgIT0gTnVtYmVyKGJ1ZikgfHwgc3RyLmNoYXJBdChpKSAhPSAnLScpe3Rocm93IG5ldyBFcnJvcignSWxsZWdhbCBhdHRhY2htZW50cycpO31wLmF0dGFjaG1lbnRzID0gTnVtYmVyKGJ1Zik7fSAvLyBsb29rIHVwIG5hbWVzcGFjZSAoaWYgYW55KVxuaWYoJy8nID09IHN0ci5jaGFyQXQoaSArIDEpKXtwLm5zcCA9ICcnO3doaWxlKCsraSkge3ZhciBjPXN0ci5jaGFyQXQoaSk7aWYoJywnID09IGMpYnJlYWs7cC5uc3AgKz0gYztpZihpID09IHN0ci5sZW5ndGgpYnJlYWs7fX1lbHNlIHtwLm5zcCA9ICcvJzt9IC8vIGxvb2sgdXAgaWRcbnZhciBuZXh0PXN0ci5jaGFyQXQoaSArIDEpO2lmKCcnICE9PSBuZXh0ICYmIE51bWJlcihuZXh0KSA9PSBuZXh0KXtwLmlkID0gJyc7d2hpbGUoKytpKSB7dmFyIGM9c3RyLmNoYXJBdChpKTtpZihudWxsID09IGMgfHwgTnVtYmVyKGMpICE9IGMpey0taTticmVhazt9cC5pZCArPSBzdHIuY2hhckF0KGkpO2lmKGkgPT0gc3RyLmxlbmd0aClicmVhazt9cC5pZCA9IE51bWJlcihwLmlkKTt9IC8vIGxvb2sgdXAganNvbiBkYXRhXG5pZihzdHIuY2hhckF0KCsraSkpe3RyeXtwLmRhdGEgPSBqc29uLnBhcnNlKHN0ci5zdWJzdHIoaSkpO31jYXRjaChlKSB7cmV0dXJuIGVycm9yKCk7fX1kZWJ1ZygnZGVjb2RlZCAlcyBhcyAlaicsc3RyLHApO3JldHVybiBwO30gLyoqXG4gICAgICAgICAgICAgICAgICogRGVhbGxvY2F0ZXMgYSBwYXJzZXIncyByZXNvdXJjZXNcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAgICAgICAgICovRGVjb2Rlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCl7aWYodGhpcy5yZWNvbnN0cnVjdG9yKXt0aGlzLnJlY29uc3RydWN0b3IuZmluaXNoZWRSZWNvbnN0cnVjdGlvbigpO319OyAvKipcbiAgICAgICAgICAgICAgICAgKiBBIG1hbmFnZXIgb2YgYSBiaW5hcnkgZXZlbnQncyAnYnVmZmVyIHNlcXVlbmNlJy4gU2hvdWxkXG4gICAgICAgICAgICAgICAgICogYmUgY29uc3RydWN0ZWQgd2hlbmV2ZXIgYSBwYWNrZXQgb2YgdHlwZSBCSU5BUllfRVZFTlQgaXNcbiAgICAgICAgICAgICAgICAgKiBkZWNvZGVkLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhY2tldFxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge0JpbmFyeVJlY29uc3RydWN0b3J9IGluaXRpYWxpemVkIHJlY29uc3RydWN0b3JcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKi9mdW5jdGlvbiBCaW5hcnlSZWNvbnN0cnVjdG9yKHBhY2tldCl7dGhpcy5yZWNvblBhY2sgPSBwYWNrZXQ7dGhpcy5idWZmZXJzID0gW107fSAvKipcbiAgICAgICAgICAgICAgICAgKiBNZXRob2QgdG8gYmUgY2FsbGVkIHdoZW4gYmluYXJ5IGRhdGEgcmVjZWl2ZWQgZnJvbSBjb25uZWN0aW9uXG4gICAgICAgICAgICAgICAgICogYWZ0ZXIgYSBCSU5BUllfRVZFTlQgcGFja2V0LlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtCdWZmZXIgfCBBcnJheUJ1ZmZlcn0gYmluRGF0YSAtIHRoZSByYXcgYmluYXJ5IGRhdGEgcmVjZWl2ZWRcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtudWxsIHwgT2JqZWN0fSByZXR1cm5zIG51bGwgaWYgbW9yZSBiaW5hcnkgZGF0YSBpcyBleHBlY3RlZCBvclxuICAgICAgICAgICAgICAgICAqICAgYSByZWNvbnN0cnVjdGVkIHBhY2tldCBvYmplY3QgaWYgYWxsIGJ1ZmZlcnMgaGF2ZSBiZWVuIHJlY2VpdmVkLlxuICAgICAgICAgICAgICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAqL0JpbmFyeVJlY29uc3RydWN0b3IucHJvdG90eXBlLnRha2VCaW5hcnlEYXRhID0gZnVuY3Rpb24oYmluRGF0YSl7dGhpcy5idWZmZXJzLnB1c2goYmluRGF0YSk7aWYodGhpcy5idWZmZXJzLmxlbmd0aCA9PSB0aGlzLnJlY29uUGFjay5hdHRhY2htZW50cyl7IC8vIGRvbmUgd2l0aCBidWZmZXIgbGlzdFxudmFyIHBhY2tldD1iaW5hcnkucmVjb25zdHJ1Y3RQYWNrZXQodGhpcy5yZWNvblBhY2ssdGhpcy5idWZmZXJzKTt0aGlzLmZpbmlzaGVkUmVjb25zdHJ1Y3Rpb24oKTtyZXR1cm4gcGFja2V0O31yZXR1cm4gbnVsbDt9OyAvKipcbiAgICAgICAgICAgICAgICAgKiBDbGVhbnMgdXAgYmluYXJ5IHBhY2tldCByZWNvbnN0cnVjdGlvbiB2YXJpYWJsZXMuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKi9CaW5hcnlSZWNvbnN0cnVjdG9yLnByb3RvdHlwZS5maW5pc2hlZFJlY29uc3RydWN0aW9uID0gZnVuY3Rpb24oKXt0aGlzLnJlY29uUGFjayA9IG51bGw7dGhpcy5idWZmZXJzID0gW107fTtmdW5jdGlvbiBlcnJvcihkYXRhKXtyZXR1cm4ge3R5cGU6ZXhwb3J0cy5FUlJPUixkYXRhOidwYXJzZXIgZXJyb3InfTt9fSx7XCIuL2JpbmFyeVwiOjQ2LFwiLi9pcy1idWZmZXJcIjo0OCxcImNvbXBvbmVudC1lbWl0dGVyXCI6NDksXCJkZWJ1Z1wiOjM5LFwiaXNhcnJheVwiOjQzLFwianNvbjNcIjo1MH1dLDQ4OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oZ2xvYmFsKXttb2R1bGUuZXhwb3J0cyA9IGlzQnVmOyAvKipcbiAgICAgICAgICAgICAgICAgICAgICogUmV0dXJucyB0cnVlIGlmIG9iaiBpcyBhIGJ1ZmZlciBvciBhbiBhcnJheWJ1ZmZlci5cbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQGFwaSBwcml2YXRlXG4gICAgICAgICAgICAgICAgICAgICAqL2Z1bmN0aW9uIGlzQnVmKG9iail7cmV0dXJuIGdsb2JhbC5CdWZmZXIgJiYgZ2xvYmFsLkJ1ZmZlci5pc0J1ZmZlcihvYmopIHx8IGdsb2JhbC5BcnJheUJ1ZmZlciAmJiBvYmogaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcjt9fSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiP3NlbGY6dHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIj93aW5kb3c6dHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIj9nbG9iYWw6e30pO30se31dLDQ5OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXthcmd1bWVudHNbNF1bMTVdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKTt9LHtcImR1cFwiOjE1fV0sNTA6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihnbG9iYWwpeyAvKiEgSlNPTiB2My4zLjIgfCBodHRwOi8vYmVzdGllanMuZ2l0aHViLmlvL2pzb24zIHwgQ29weXJpZ2h0IDIwMTItMjAxNCwgS2l0IENhbWJyaWRnZSB8IGh0dHA6Ly9raXQubWl0LWxpY2Vuc2Uub3JnICovOyhmdW5jdGlvbigpeyAvLyBEZXRlY3QgdGhlIGBkZWZpbmVgIGZ1bmN0aW9uIGV4cG9zZWQgYnkgYXN5bmNocm9ub3VzIG1vZHVsZSBsb2FkZXJzLiBUaGVcbi8vIHN0cmljdCBgZGVmaW5lYCBjaGVjayBpcyBuZWNlc3NhcnkgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBgci5qc2AuXG52YXIgaXNMb2FkZXI9dHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQ7IC8vIEEgc2V0IG9mIHR5cGVzIHVzZWQgdG8gZGlzdGluZ3Vpc2ggb2JqZWN0cyBmcm9tIHByaW1pdGl2ZXMuXG52YXIgb2JqZWN0VHlwZXM9e1wiZnVuY3Rpb25cIjp0cnVlLFwib2JqZWN0XCI6dHJ1ZX07IC8vIERldGVjdCB0aGUgYGV4cG9ydHNgIG9iamVjdCBleHBvc2VkIGJ5IENvbW1vbkpTIGltcGxlbWVudGF0aW9ucy5cbnZhciBmcmVlRXhwb3J0cz1vYmplY3RUeXBlc1t0eXBlb2YgZXhwb3J0c10gJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzOyAvLyBVc2UgdGhlIGBnbG9iYWxgIG9iamVjdCBleHBvc2VkIGJ5IE5vZGUgKGluY2x1ZGluZyBCcm93c2VyaWZ5IHZpYVxuLy8gYGluc2VydC1tb2R1bGUtZ2xvYmFsc2ApLCBOYXJ3aGFsLCBhbmQgUmluZ28gYXMgdGhlIGRlZmF1bHQgY29udGV4dCxcbi8vIGFuZCB0aGUgYHdpbmRvd2Agb2JqZWN0IGluIGJyb3dzZXJzLiBSaGlubyBleHBvcnRzIGEgYGdsb2JhbGAgZnVuY3Rpb25cbi8vIGluc3RlYWQuXG52YXIgcm9vdD1vYmplY3RUeXBlc1t0eXBlb2Ygd2luZG93XSAmJiB3aW5kb3cgfHwgdGhpcyxmcmVlR2xvYmFsPWZyZWVFeHBvcnRzICYmIG9iamVjdFR5cGVzW3R5cGVvZiBtb2R1bGVdICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIHR5cGVvZiBnbG9iYWwgPT0gXCJvYmplY3RcIiAmJiBnbG9iYWw7aWYoZnJlZUdsb2JhbCAmJiAoZnJlZUdsb2JhbFtcImdsb2JhbFwiXSA9PT0gZnJlZUdsb2JhbCB8fCBmcmVlR2xvYmFsW1wid2luZG93XCJdID09PSBmcmVlR2xvYmFsIHx8IGZyZWVHbG9iYWxbXCJzZWxmXCJdID09PSBmcmVlR2xvYmFsKSl7cm9vdCA9IGZyZWVHbG9iYWw7fSAvLyBQdWJsaWM6IEluaXRpYWxpemVzIEpTT04gMyB1c2luZyB0aGUgZ2l2ZW4gYGNvbnRleHRgIG9iamVjdCwgYXR0YWNoaW5nIHRoZVxuLy8gYHN0cmluZ2lmeWAgYW5kIGBwYXJzZWAgZnVuY3Rpb25zIHRvIHRoZSBzcGVjaWZpZWQgYGV4cG9ydHNgIG9iamVjdC5cbmZ1bmN0aW9uIHJ1bkluQ29udGV4dChjb250ZXh0LGV4cG9ydHMpe2NvbnRleHQgfHwgKGNvbnRleHQgPSByb290W1wiT2JqZWN0XCJdKCkpO2V4cG9ydHMgfHwgKGV4cG9ydHMgPSByb290W1wiT2JqZWN0XCJdKCkpOyAvLyBOYXRpdmUgY29uc3RydWN0b3IgYWxpYXNlcy5cbnZhciBOdW1iZXI9Y29udGV4dFtcIk51bWJlclwiXSB8fCByb290W1wiTnVtYmVyXCJdLFN0cmluZz1jb250ZXh0W1wiU3RyaW5nXCJdIHx8IHJvb3RbXCJTdHJpbmdcIl0sT2JqZWN0PWNvbnRleHRbXCJPYmplY3RcIl0gfHwgcm9vdFtcIk9iamVjdFwiXSxEYXRlPWNvbnRleHRbXCJEYXRlXCJdIHx8IHJvb3RbXCJEYXRlXCJdLFN5bnRheEVycm9yPWNvbnRleHRbXCJTeW50YXhFcnJvclwiXSB8fCByb290W1wiU3ludGF4RXJyb3JcIl0sVHlwZUVycm9yPWNvbnRleHRbXCJUeXBlRXJyb3JcIl0gfHwgcm9vdFtcIlR5cGVFcnJvclwiXSxNYXRoPWNvbnRleHRbXCJNYXRoXCJdIHx8IHJvb3RbXCJNYXRoXCJdLG5hdGl2ZUpTT049Y29udGV4dFtcIkpTT05cIl0gfHwgcm9vdFtcIkpTT05cIl07IC8vIERlbGVnYXRlIHRvIHRoZSBuYXRpdmUgYHN0cmluZ2lmeWAgYW5kIGBwYXJzZWAgaW1wbGVtZW50YXRpb25zLlxuaWYodHlwZW9mIG5hdGl2ZUpTT04gPT0gXCJvYmplY3RcIiAmJiBuYXRpdmVKU09OKXtleHBvcnRzLnN0cmluZ2lmeSA9IG5hdGl2ZUpTT04uc3RyaW5naWZ5O2V4cG9ydHMucGFyc2UgPSBuYXRpdmVKU09OLnBhcnNlO30gLy8gQ29udmVuaWVuY2UgYWxpYXNlcy5cbnZhciBvYmplY3RQcm90bz1PYmplY3QucHJvdG90eXBlLGdldENsYXNzPW9iamVjdFByb3RvLnRvU3RyaW5nLGlzUHJvcGVydHksZm9yRWFjaCx1bmRlZjsgLy8gVGVzdCB0aGUgYERhdGUjZ2V0VVRDKmAgbWV0aG9kcy4gQmFzZWQgb24gd29yayBieSBAWWFmZmxlLlxudmFyIGlzRXh0ZW5kZWQ9bmV3IERhdGUoLTM1MDk4MjczMzQ1NzMyOTIpO3RyeXsgLy8gVGhlIGBnZXRVVENGdWxsWWVhcmAsIGBNb250aGAsIGFuZCBgRGF0ZWAgbWV0aG9kcyByZXR1cm4gbm9uc2Vuc2ljYWxcbi8vIHJlc3VsdHMgZm9yIGNlcnRhaW4gZGF0ZXMgaW4gT3BlcmEgPj0gMTAuNTMuXG5pc0V4dGVuZGVkID0gaXNFeHRlbmRlZC5nZXRVVENGdWxsWWVhcigpID09IC0xMDkyNTIgJiYgaXNFeHRlbmRlZC5nZXRVVENNb250aCgpID09PSAwICYmIGlzRXh0ZW5kZWQuZ2V0VVRDRGF0ZSgpID09PSAxICYmICAvLyBTYWZhcmkgPCAyLjAuMiBzdG9yZXMgdGhlIGludGVybmFsIG1pbGxpc2Vjb25kIHRpbWUgdmFsdWUgY29ycmVjdGx5LFxuLy8gYnV0IGNsaXBzIHRoZSB2YWx1ZXMgcmV0dXJuZWQgYnkgdGhlIGRhdGUgbWV0aG9kcyB0byB0aGUgcmFuZ2Ugb2Zcbi8vIHNpZ25lZCAzMi1iaXQgaW50ZWdlcnMgKFstMiAqKiAzMSwgMiAqKiAzMSAtIDFdKS5cbmlzRXh0ZW5kZWQuZ2V0VVRDSG91cnMoKSA9PSAxMCAmJiBpc0V4dGVuZGVkLmdldFVUQ01pbnV0ZXMoKSA9PSAzNyAmJiBpc0V4dGVuZGVkLmdldFVUQ1NlY29uZHMoKSA9PSA2ICYmIGlzRXh0ZW5kZWQuZ2V0VVRDTWlsbGlzZWNvbmRzKCkgPT0gNzA4O31jYXRjaChleGNlcHRpb24pIHt9IC8vIEludGVybmFsOiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIG5hdGl2ZSBgSlNPTi5zdHJpbmdpZnlgIGFuZCBgcGFyc2VgXG4vLyBpbXBsZW1lbnRhdGlvbnMgYXJlIHNwZWMtY29tcGxpYW50LiBCYXNlZCBvbiB3b3JrIGJ5IEtlbiBTbnlkZXIuXG5mdW5jdGlvbiBoYXMobmFtZSl7aWYoaGFzW25hbWVdICE9PSB1bmRlZil7IC8vIFJldHVybiBjYWNoZWQgZmVhdHVyZSB0ZXN0IHJlc3VsdC5cbnJldHVybiBoYXNbbmFtZV07fXZhciBpc1N1cHBvcnRlZDtpZihuYW1lID09IFwiYnVnLXN0cmluZy1jaGFyLWluZGV4XCIpeyAvLyBJRSA8PSA3IGRvZXNuJ3Qgc3VwcG9ydCBhY2Nlc3Npbmcgc3RyaW5nIGNoYXJhY3RlcnMgdXNpbmcgc3F1YXJlXG4vLyBicmFja2V0IG5vdGF0aW9uLiBJRSA4IG9ubHkgc3VwcG9ydHMgdGhpcyBmb3IgcHJpbWl0aXZlcy5cbmlzU3VwcG9ydGVkID0gXCJhXCJbMF0gIT0gXCJhXCI7fWVsc2UgaWYobmFtZSA9PSBcImpzb25cIil7IC8vIEluZGljYXRlcyB3aGV0aGVyIGJvdGggYEpTT04uc3RyaW5naWZ5YCBhbmQgYEpTT04ucGFyc2VgIGFyZVxuLy8gc3VwcG9ydGVkLlxuaXNTdXBwb3J0ZWQgPSBoYXMoXCJqc29uLXN0cmluZ2lmeVwiKSAmJiBoYXMoXCJqc29uLXBhcnNlXCIpO31lbHNlIHt2YXIgdmFsdWUsc2VyaWFsaXplZD1cIntcXFwiYVxcXCI6WzEsdHJ1ZSxmYWxzZSxudWxsLFxcXCJcXFxcdTAwMDBcXFxcYlxcXFxuXFxcXGZcXFxcclxcXFx0XFxcIl19XCI7IC8vIFRlc3QgYEpTT04uc3RyaW5naWZ5YC5cbmlmKG5hbWUgPT0gXCJqc29uLXN0cmluZ2lmeVwiKXt2YXIgc3RyaW5naWZ5PWV4cG9ydHMuc3RyaW5naWZ5LHN0cmluZ2lmeVN1cHBvcnRlZD10eXBlb2Ygc3RyaW5naWZ5ID09IFwiZnVuY3Rpb25cIiAmJiBpc0V4dGVuZGVkO2lmKHN0cmluZ2lmeVN1cHBvcnRlZCl7IC8vIEEgdGVzdCBmdW5jdGlvbiBvYmplY3Qgd2l0aCBhIGN1c3RvbSBgdG9KU09OYCBtZXRob2QuXG4odmFsdWUgPSBmdW5jdGlvbigpe3JldHVybiAxO30pLnRvSlNPTiA9IHZhbHVlO3RyeXtzdHJpbmdpZnlTdXBwb3J0ZWQgPSAgLy8gRmlyZWZveCAzLjFiMSBhbmQgYjIgc2VyaWFsaXplIHN0cmluZywgbnVtYmVyLCBhbmQgYm9vbGVhblxuLy8gcHJpbWl0aXZlcyBhcyBvYmplY3QgbGl0ZXJhbHMuXG5zdHJpbmdpZnkoMCkgPT09IFwiMFwiICYmICAvLyBGRiAzLjFiMSwgYjIsIGFuZCBKU09OIDIgc2VyaWFsaXplIHdyYXBwZWQgcHJpbWl0aXZlcyBhcyBvYmplY3Rcbi8vIGxpdGVyYWxzLlxuc3RyaW5naWZ5KG5ldyBOdW1iZXIoKSkgPT09IFwiMFwiICYmIHN0cmluZ2lmeShuZXcgU3RyaW5nKCkpID09ICdcIlwiJyAmJiAgLy8gRkYgMy4xYjEsIDIgdGhyb3cgYW4gZXJyb3IgaWYgdGhlIHZhbHVlIGlzIGBudWxsYCwgYHVuZGVmaW5lZGAsIG9yXG4vLyBkb2VzIG5vdCBkZWZpbmUgYSBjYW5vbmljYWwgSlNPTiByZXByZXNlbnRhdGlvbiAodGhpcyBhcHBsaWVzIHRvXG4vLyBvYmplY3RzIHdpdGggYHRvSlNPTmAgcHJvcGVydGllcyBhcyB3ZWxsLCAqdW5sZXNzKiB0aGV5IGFyZSBuZXN0ZWRcbi8vIHdpdGhpbiBhbiBvYmplY3Qgb3IgYXJyYXkpLlxuc3RyaW5naWZ5KGdldENsYXNzKSA9PT0gdW5kZWYgJiYgIC8vIElFIDggc2VyaWFsaXplcyBgdW5kZWZpbmVkYCBhcyBgXCJ1bmRlZmluZWRcImAuIFNhZmFyaSA8PSA1LjEuNyBhbmRcbi8vIEZGIDMuMWIzIHBhc3MgdGhpcyB0ZXN0Llxuc3RyaW5naWZ5KHVuZGVmKSA9PT0gdW5kZWYgJiYgIC8vIFNhZmFyaSA8PSA1LjEuNyBhbmQgRkYgMy4xYjMgdGhyb3cgYEVycm9yYHMgYW5kIGBUeXBlRXJyb3Jgcyxcbi8vIHJlc3BlY3RpdmVseSwgaWYgdGhlIHZhbHVlIGlzIG9taXR0ZWQgZW50aXJlbHkuXG5zdHJpbmdpZnkoKSA9PT0gdW5kZWYgJiYgIC8vIEZGIDMuMWIxLCAyIHRocm93IGFuIGVycm9yIGlmIHRoZSBnaXZlbiB2YWx1ZSBpcyBub3QgYSBudW1iZXIsXG4vLyBzdHJpbmcsIGFycmF5LCBvYmplY3QsIEJvb2xlYW4sIG9yIGBudWxsYCBsaXRlcmFsLiBUaGlzIGFwcGxpZXMgdG9cbi8vIG9iamVjdHMgd2l0aCBjdXN0b20gYHRvSlNPTmAgbWV0aG9kcyBhcyB3ZWxsLCB1bmxlc3MgdGhleSBhcmUgbmVzdGVkXG4vLyBpbnNpZGUgb2JqZWN0IG9yIGFycmF5IGxpdGVyYWxzLiBZVUkgMy4wLjBiMSBpZ25vcmVzIGN1c3RvbSBgdG9KU09OYFxuLy8gbWV0aG9kcyBlbnRpcmVseS5cbnN0cmluZ2lmeSh2YWx1ZSkgPT09IFwiMVwiICYmIHN0cmluZ2lmeShbdmFsdWVdKSA9PSBcIlsxXVwiICYmICAvLyBQcm90b3R5cGUgPD0gMS42LjEgc2VyaWFsaXplcyBgW3VuZGVmaW5lZF1gIGFzIGBcIltdXCJgIGluc3RlYWQgb2Zcbi8vIGBcIltudWxsXVwiYC5cbnN0cmluZ2lmeShbdW5kZWZdKSA9PSBcIltudWxsXVwiICYmICAvLyBZVUkgMy4wLjBiMSBmYWlscyB0byBzZXJpYWxpemUgYG51bGxgIGxpdGVyYWxzLlxuc3RyaW5naWZ5KG51bGwpID09IFwibnVsbFwiICYmICAvLyBGRiAzLjFiMSwgMiBoYWx0cyBzZXJpYWxpemF0aW9uIGlmIGFuIGFycmF5IGNvbnRhaW5zIGEgZnVuY3Rpb246XG4vLyBgWzEsIHRydWUsIGdldENsYXNzLCAxXWAgc2VyaWFsaXplcyBhcyBcIlsxLHRydWUsXSxcIi4gRkYgMy4xYjNcbi8vIGVsaWRlcyBub24tSlNPTiB2YWx1ZXMgZnJvbSBvYmplY3RzIGFuZCBhcnJheXMsIHVubGVzcyB0aGV5XG4vLyBkZWZpbmUgY3VzdG9tIGB0b0pTT05gIG1ldGhvZHMuXG5zdHJpbmdpZnkoW3VuZGVmLGdldENsYXNzLG51bGxdKSA9PSBcIltudWxsLG51bGwsbnVsbF1cIiAmJiAgLy8gU2ltcGxlIHNlcmlhbGl6YXRpb24gdGVzdC4gRkYgMy4xYjEgdXNlcyBVbmljb2RlIGVzY2FwZSBzZXF1ZW5jZXNcbi8vIHdoZXJlIGNoYXJhY3RlciBlc2NhcGUgY29kZXMgYXJlIGV4cGVjdGVkIChlLmcuLCBgXFxiYCA9PiBgXFx1MDAwOGApLlxuc3RyaW5naWZ5KHtcImFcIjpbdmFsdWUsdHJ1ZSxmYWxzZSxudWxsLFwiXFx4MDBcXGJcXG5cXGZcXHJcXHRcIl19KSA9PSBzZXJpYWxpemVkICYmICAvLyBGRiAzLjFiMSBhbmQgYjIgaWdub3JlIHRoZSBgZmlsdGVyYCBhbmQgYHdpZHRoYCBhcmd1bWVudHMuXG5zdHJpbmdpZnkobnVsbCx2YWx1ZSkgPT09IFwiMVwiICYmIHN0cmluZ2lmeShbMSwyXSxudWxsLDEpID09IFwiW1xcbiAxLFxcbiAyXFxuXVwiICYmICAvLyBKU09OIDIsIFByb3RvdHlwZSA8PSAxLjcsIGFuZCBvbGRlciBXZWJLaXQgYnVpbGRzIGluY29ycmVjdGx5XG4vLyBzZXJpYWxpemUgZXh0ZW5kZWQgeWVhcnMuXG5zdHJpbmdpZnkobmV3IERhdGUoLTguNjRlMTUpKSA9PSAnXCItMjcxODIxLTA0LTIwVDAwOjAwOjAwLjAwMFpcIicgJiYgIC8vIFRoZSBtaWxsaXNlY29uZHMgYXJlIG9wdGlvbmFsIGluIEVTIDUsIGJ1dCByZXF1aXJlZCBpbiA1LjEuXG5zdHJpbmdpZnkobmV3IERhdGUoOC42NGUxNSkpID09ICdcIisyNzU3NjAtMDktMTNUMDA6MDA6MDAuMDAwWlwiJyAmJiAgLy8gRmlyZWZveCA8PSAxMS4wIGluY29ycmVjdGx5IHNlcmlhbGl6ZXMgeWVhcnMgcHJpb3IgdG8gMCBhcyBuZWdhdGl2ZVxuLy8gZm91ci1kaWdpdCB5ZWFycyBpbnN0ZWFkIG9mIHNpeC1kaWdpdCB5ZWFycy4gQ3JlZGl0czogQFlhZmZsZS5cbnN0cmluZ2lmeShuZXcgRGF0ZSgtNjIxOTg3NTUyZTUpKSA9PSAnXCItMDAwMDAxLTAxLTAxVDAwOjAwOjAwLjAwMFpcIicgJiYgIC8vIFNhZmFyaSA8PSA1LjEuNSBhbmQgT3BlcmEgPj0gMTAuNTMgaW5jb3JyZWN0bHkgc2VyaWFsaXplIG1pbGxpc2Vjb25kXG4vLyB2YWx1ZXMgbGVzcyB0aGFuIDEwMDAuIENyZWRpdHM6IEBZYWZmbGUuXG5zdHJpbmdpZnkobmV3IERhdGUoLTEpKSA9PSAnXCIxOTY5LTEyLTMxVDIzOjU5OjU5Ljk5OVpcIic7fWNhdGNoKGV4Y2VwdGlvbikge3N0cmluZ2lmeVN1cHBvcnRlZCA9IGZhbHNlO319aXNTdXBwb3J0ZWQgPSBzdHJpbmdpZnlTdXBwb3J0ZWQ7fSAvLyBUZXN0IGBKU09OLnBhcnNlYC5cbmlmKG5hbWUgPT0gXCJqc29uLXBhcnNlXCIpe3ZhciBwYXJzZT1leHBvcnRzLnBhcnNlO2lmKHR5cGVvZiBwYXJzZSA9PSBcImZ1bmN0aW9uXCIpe3RyeXsgLy8gRkYgMy4xYjEsIGIyIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGEgYmFyZSBsaXRlcmFsIGlzIHByb3ZpZGVkLlxuLy8gQ29uZm9ybWluZyBpbXBsZW1lbnRhdGlvbnMgc2hvdWxkIGFsc28gY29lcmNlIHRoZSBpbml0aWFsIGFyZ3VtZW50IHRvXG4vLyBhIHN0cmluZyBwcmlvciB0byBwYXJzaW5nLlxuaWYocGFyc2UoXCIwXCIpID09PSAwICYmICFwYXJzZShmYWxzZSkpeyAvLyBTaW1wbGUgcGFyc2luZyB0ZXN0LlxudmFsdWUgPSBwYXJzZShzZXJpYWxpemVkKTt2YXIgcGFyc2VTdXBwb3J0ZWQ9dmFsdWVbXCJhXCJdLmxlbmd0aCA9PSA1ICYmIHZhbHVlW1wiYVwiXVswXSA9PT0gMTtpZihwYXJzZVN1cHBvcnRlZCl7dHJ5eyAvLyBTYWZhcmkgPD0gNS4xLjIgYW5kIEZGIDMuMWIxIGFsbG93IHVuZXNjYXBlZCB0YWJzIGluIHN0cmluZ3MuXG5wYXJzZVN1cHBvcnRlZCA9ICFwYXJzZSgnXCJcXHRcIicpO31jYXRjaChleGNlcHRpb24pIHt9aWYocGFyc2VTdXBwb3J0ZWQpe3RyeXsgLy8gRkYgNC4wIGFuZCA0LjAuMSBhbGxvdyBsZWFkaW5nIGArYCBzaWducyBhbmQgbGVhZGluZ1xuLy8gZGVjaW1hbCBwb2ludHMuIEZGIDQuMCwgNC4wLjEsIGFuZCBJRSA5LTEwIGFsc28gYWxsb3dcbi8vIGNlcnRhaW4gb2N0YWwgbGl0ZXJhbHMuXG5wYXJzZVN1cHBvcnRlZCA9IHBhcnNlKFwiMDFcIikgIT09IDE7fWNhdGNoKGV4Y2VwdGlvbikge319aWYocGFyc2VTdXBwb3J0ZWQpe3RyeXsgLy8gRkYgNC4wLCA0LjAuMSwgYW5kIFJoaW5vIDEuN1IzLVI0IGFsbG93IHRyYWlsaW5nIGRlY2ltYWxcbi8vIHBvaW50cy4gVGhlc2UgZW52aXJvbm1lbnRzLCBhbG9uZyB3aXRoIEZGIDMuMWIxIGFuZCAyLFxuLy8gYWxzbyBhbGxvdyB0cmFpbGluZyBjb21tYXMgaW4gSlNPTiBvYmplY3RzIGFuZCBhcnJheXMuXG5wYXJzZVN1cHBvcnRlZCA9IHBhcnNlKFwiMS5cIikgIT09IDE7fWNhdGNoKGV4Y2VwdGlvbikge319fX19Y2F0Y2goZXhjZXB0aW9uKSB7cGFyc2VTdXBwb3J0ZWQgPSBmYWxzZTt9fWlzU3VwcG9ydGVkID0gcGFyc2VTdXBwb3J0ZWQ7fX1yZXR1cm4gaGFzW25hbWVdID0gISFpc1N1cHBvcnRlZDt9aWYoIWhhcyhcImpzb25cIikpeyAvLyBDb21tb24gYFtbQ2xhc3NdXWAgbmFtZSBhbGlhc2VzLlxudmFyIGZ1bmN0aW9uQ2xhc3M9XCJbb2JqZWN0IEZ1bmN0aW9uXVwiLGRhdGVDbGFzcz1cIltvYmplY3QgRGF0ZV1cIixudW1iZXJDbGFzcz1cIltvYmplY3QgTnVtYmVyXVwiLHN0cmluZ0NsYXNzPVwiW29iamVjdCBTdHJpbmddXCIsYXJyYXlDbGFzcz1cIltvYmplY3QgQXJyYXldXCIsYm9vbGVhbkNsYXNzPVwiW29iamVjdCBCb29sZWFuXVwiOyAvLyBEZXRlY3QgaW5jb21wbGV0ZSBzdXBwb3J0IGZvciBhY2Nlc3Npbmcgc3RyaW5nIGNoYXJhY3RlcnMgYnkgaW5kZXguXG52YXIgY2hhckluZGV4QnVnZ3k9aGFzKFwiYnVnLXN0cmluZy1jaGFyLWluZGV4XCIpOyAvLyBEZWZpbmUgYWRkaXRpb25hbCB1dGlsaXR5IG1ldGhvZHMgaWYgdGhlIGBEYXRlYCBtZXRob2RzIGFyZSBidWdneS5cbmlmKCFpc0V4dGVuZGVkKXt2YXIgZmxvb3I9TWF0aC5mbG9vcjsgLy8gQSBtYXBwaW5nIGJldHdlZW4gdGhlIG1vbnRocyBvZiB0aGUgeWVhciBhbmQgdGhlIG51bWJlciBvZiBkYXlzIGJldHdlZW5cbi8vIEphbnVhcnkgMXN0IGFuZCB0aGUgZmlyc3Qgb2YgdGhlIHJlc3BlY3RpdmUgbW9udGguXG52YXIgTW9udGhzPVswLDMxLDU5LDkwLDEyMCwxNTEsMTgxLDIxMiwyNDMsMjczLDMwNCwzMzRdOyAvLyBJbnRlcm5hbDogQ2FsY3VsYXRlcyB0aGUgbnVtYmVyIG9mIGRheXMgYmV0d2VlbiB0aGUgVW5peCBlcG9jaCBhbmQgdGhlXG4vLyBmaXJzdCBkYXkgb2YgdGhlIGdpdmVuIG1vbnRoLlxudmFyIGdldERheT1mdW5jdGlvbiBnZXREYXkoeWVhcixtb250aCl7cmV0dXJuIE1vbnRoc1ttb250aF0gKyAzNjUgKiAoeWVhciAtIDE5NzApICsgZmxvb3IoKHllYXIgLSAxOTY5ICsgKG1vbnRoID0gKyhtb250aCA+IDEpKSkgLyA0KSAtIGZsb29yKCh5ZWFyIC0gMTkwMSArIG1vbnRoKSAvIDEwMCkgKyBmbG9vcigoeWVhciAtIDE2MDEgKyBtb250aCkgLyA0MDApO307fSAvLyBJbnRlcm5hbDogRGV0ZXJtaW5lcyBpZiBhIHByb3BlcnR5IGlzIGEgZGlyZWN0IHByb3BlcnR5IG9mIHRoZSBnaXZlblxuLy8gb2JqZWN0LiBEZWxlZ2F0ZXMgdG8gdGhlIG5hdGl2ZSBgT2JqZWN0I2hhc093blByb3BlcnR5YCBtZXRob2QuXG5pZighKGlzUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eSkpe2lzUHJvcGVydHkgPSBmdW5jdGlvbihwcm9wZXJ0eSl7dmFyIG1lbWJlcnM9e30sY29uc3RydWN0b3I7aWYoKG1lbWJlcnMuX19wcm90b19fID0gbnVsbCxtZW1iZXJzLl9fcHJvdG9fXyA9IHsgLy8gVGhlICpwcm90byogcHJvcGVydHkgY2Fubm90IGJlIHNldCBtdWx0aXBsZSB0aW1lcyBpbiByZWNlbnRcbi8vIHZlcnNpb25zIG9mIEZpcmVmb3ggYW5kIFNlYU1vbmtleS5cblwidG9TdHJpbmdcIjoxfSxtZW1iZXJzKS50b1N0cmluZyAhPSBnZXRDbGFzcyl7IC8vIFNhZmFyaSA8PSAyLjAuMyBkb2Vzbid0IGltcGxlbWVudCBgT2JqZWN0I2hhc093blByb3BlcnR5YCwgYnV0XG4vLyBzdXBwb3J0cyB0aGUgbXV0YWJsZSAqcHJvdG8qIHByb3BlcnR5LlxuaXNQcm9wZXJ0eSA9IGZ1bmN0aW9uKHByb3BlcnR5KXsgLy8gQ2FwdHVyZSBhbmQgYnJlYWsgdGhlIG9iamVjdCdzIHByb3RvdHlwZSBjaGFpbiAoc2VlIHNlY3Rpb24gOC42LjJcbi8vIG9mIHRoZSBFUyA1LjEgc3BlYykuIFRoZSBwYXJlbnRoZXNpemVkIGV4cHJlc3Npb24gcHJldmVudHMgYW5cbi8vIHVuc2FmZSB0cmFuc2Zvcm1hdGlvbiBieSB0aGUgQ2xvc3VyZSBDb21waWxlci5cbnZhciBvcmlnaW5hbD10aGlzLl9fcHJvdG9fXyxyZXN1bHQ9KHByb3BlcnR5IGluICh0aGlzLl9fcHJvdG9fXyA9IG51bGwsdGhpcykpOyAvLyBSZXN0b3JlIHRoZSBvcmlnaW5hbCBwcm90b3R5cGUgY2hhaW4uXG50aGlzLl9fcHJvdG9fXyA9IG9yaWdpbmFsO3JldHVybiByZXN1bHQ7fTt9ZWxzZSB7IC8vIENhcHR1cmUgYSByZWZlcmVuY2UgdG8gdGhlIHRvcC1sZXZlbCBgT2JqZWN0YCBjb25zdHJ1Y3Rvci5cbmNvbnN0cnVjdG9yID0gbWVtYmVycy5jb25zdHJ1Y3RvcjsgLy8gVXNlIHRoZSBgY29uc3RydWN0b3JgIHByb3BlcnR5IHRvIHNpbXVsYXRlIGBPYmplY3QjaGFzT3duUHJvcGVydHlgIGluXG4vLyBvdGhlciBlbnZpcm9ubWVudHMuXG5pc1Byb3BlcnR5ID0gZnVuY3Rpb24ocHJvcGVydHkpe3ZhciBwYXJlbnQ9KHRoaXMuY29uc3RydWN0b3IgfHwgY29uc3RydWN0b3IpLnByb3RvdHlwZTtyZXR1cm4gcHJvcGVydHkgaW4gdGhpcyAmJiAhKHByb3BlcnR5IGluIHBhcmVudCAmJiB0aGlzW3Byb3BlcnR5XSA9PT0gcGFyZW50W3Byb3BlcnR5XSk7fTt9bWVtYmVycyA9IG51bGw7cmV0dXJuIGlzUHJvcGVydHkuY2FsbCh0aGlzLHByb3BlcnR5KTt9O30gLy8gSW50ZXJuYWw6IE5vcm1hbGl6ZXMgdGhlIGBmb3IuLi5pbmAgaXRlcmF0aW9uIGFsZ29yaXRobSBhY3Jvc3Ncbi8vIGVudmlyb25tZW50cy4gRWFjaCBlbnVtZXJhdGVkIGtleSBpcyB5aWVsZGVkIHRvIGEgYGNhbGxiYWNrYCBmdW5jdGlvbi5cbmZvckVhY2ggPSBmdW5jdGlvbihvYmplY3QsY2FsbGJhY2spe3ZhciBzaXplPTAsUHJvcGVydGllcyxtZW1iZXJzLHByb3BlcnR5OyAvLyBUZXN0cyBmb3IgYnVncyBpbiB0aGUgY3VycmVudCBlbnZpcm9ubWVudCdzIGBmb3IuLi5pbmAgYWxnb3JpdGhtLiBUaGVcbi8vIGB2YWx1ZU9mYCBwcm9wZXJ0eSBpbmhlcml0cyB0aGUgbm9uLWVudW1lcmFibGUgZmxhZyBmcm9tXG4vLyBgT2JqZWN0LnByb3RvdHlwZWAgaW4gb2xkZXIgdmVyc2lvbnMgb2YgSUUsIE5ldHNjYXBlLCBhbmQgTW96aWxsYS5cbihQcm9wZXJ0aWVzID0gZnVuY3Rpb24oKXt0aGlzLnZhbHVlT2YgPSAwO30pLnByb3RvdHlwZS52YWx1ZU9mID0gMDsgLy8gSXRlcmF0ZSBvdmVyIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBgUHJvcGVydGllc2AgY2xhc3MuXG5tZW1iZXJzID0gbmV3IFByb3BlcnRpZXMoKTtmb3IocHJvcGVydHkgaW4gbWVtYmVycykgeyAvLyBJZ25vcmUgYWxsIHByb3BlcnRpZXMgaW5oZXJpdGVkIGZyb20gYE9iamVjdC5wcm90b3R5cGVgLlxuaWYoaXNQcm9wZXJ0eS5jYWxsKG1lbWJlcnMscHJvcGVydHkpKXtzaXplKys7fX1Qcm9wZXJ0aWVzID0gbWVtYmVycyA9IG51bGw7IC8vIE5vcm1hbGl6ZSB0aGUgaXRlcmF0aW9uIGFsZ29yaXRobS5cbmlmKCFzaXplKXsgLy8gQSBsaXN0IG9mIG5vbi1lbnVtZXJhYmxlIHByb3BlcnRpZXMgaW5oZXJpdGVkIGZyb20gYE9iamVjdC5wcm90b3R5cGVgLlxubWVtYmVycyA9IFtcInZhbHVlT2ZcIixcInRvU3RyaW5nXCIsXCJ0b0xvY2FsZVN0cmluZ1wiLFwicHJvcGVydHlJc0VudW1lcmFibGVcIixcImlzUHJvdG90eXBlT2ZcIixcImhhc093blByb3BlcnR5XCIsXCJjb25zdHJ1Y3RvclwiXTsgLy8gSUUgPD0gOCwgTW96aWxsYSAxLjAsIGFuZCBOZXRzY2FwZSA2LjIgaWdub3JlIHNoYWRvd2VkIG5vbi1lbnVtZXJhYmxlXG4vLyBwcm9wZXJ0aWVzLlxuZm9yRWFjaCA9IGZ1bmN0aW9uKG9iamVjdCxjYWxsYmFjayl7dmFyIGlzRnVuY3Rpb249Z2V0Q2xhc3MuY2FsbChvYmplY3QpID09IGZ1bmN0aW9uQ2xhc3MscHJvcGVydHksbGVuZ3RoO3ZhciBoYXNQcm9wZXJ0eT0haXNGdW5jdGlvbiAmJiB0eXBlb2Ygb2JqZWN0LmNvbnN0cnVjdG9yICE9IFwiZnVuY3Rpb25cIiAmJiBvYmplY3RUeXBlc1t0eXBlb2Ygb2JqZWN0Lmhhc093blByb3BlcnR5XSAmJiBvYmplY3QuaGFzT3duUHJvcGVydHkgfHwgaXNQcm9wZXJ0eTtmb3IocHJvcGVydHkgaW4gb2JqZWN0KSB7IC8vIEdlY2tvIDw9IDEuMCBlbnVtZXJhdGVzIHRoZSBgcHJvdG90eXBlYCBwcm9wZXJ0eSBvZiBmdW5jdGlvbnMgdW5kZXJcbi8vIGNlcnRhaW4gY29uZGl0aW9uczsgSUUgZG9lcyBub3QuXG5pZighKGlzRnVuY3Rpb24gJiYgcHJvcGVydHkgPT0gXCJwcm90b3R5cGVcIikgJiYgaGFzUHJvcGVydHkuY2FsbChvYmplY3QscHJvcGVydHkpKXtjYWxsYmFjayhwcm9wZXJ0eSk7fX0gLy8gTWFudWFsbHkgaW52b2tlIHRoZSBjYWxsYmFjayBmb3IgZWFjaCBub24tZW51bWVyYWJsZSBwcm9wZXJ0eS5cbmZvcihsZW5ndGggPSBtZW1iZXJzLmxlbmd0aDtwcm9wZXJ0eSA9IG1lbWJlcnNbLS1sZW5ndGhdO2hhc1Byb3BlcnR5LmNhbGwob2JqZWN0LHByb3BlcnR5KSAmJiBjYWxsYmFjayhwcm9wZXJ0eSkpO307fWVsc2UgaWYoc2l6ZSA9PSAyKXsgLy8gU2FmYXJpIDw9IDIuMC40IGVudW1lcmF0ZXMgc2hhZG93ZWQgcHJvcGVydGllcyB0d2ljZS5cbmZvckVhY2ggPSBmdW5jdGlvbihvYmplY3QsY2FsbGJhY2speyAvLyBDcmVhdGUgYSBzZXQgb2YgaXRlcmF0ZWQgcHJvcGVydGllcy5cbnZhciBtZW1iZXJzPXt9LGlzRnVuY3Rpb249Z2V0Q2xhc3MuY2FsbChvYmplY3QpID09IGZ1bmN0aW9uQ2xhc3MscHJvcGVydHk7Zm9yKHByb3BlcnR5IGluIG9iamVjdCkgeyAvLyBTdG9yZSBlYWNoIHByb3BlcnR5IG5hbWUgdG8gcHJldmVudCBkb3VibGUgZW51bWVyYXRpb24uIFRoZVxuLy8gYHByb3RvdHlwZWAgcHJvcGVydHkgb2YgZnVuY3Rpb25zIGlzIG5vdCBlbnVtZXJhdGVkIGR1ZSB0byBjcm9zcy1cbi8vIGVudmlyb25tZW50IGluY29uc2lzdGVuY2llcy5cbmlmKCEoaXNGdW5jdGlvbiAmJiBwcm9wZXJ0eSA9PSBcInByb3RvdHlwZVwiKSAmJiAhaXNQcm9wZXJ0eS5jYWxsKG1lbWJlcnMscHJvcGVydHkpICYmIChtZW1iZXJzW3Byb3BlcnR5XSA9IDEpICYmIGlzUHJvcGVydHkuY2FsbChvYmplY3QscHJvcGVydHkpKXtjYWxsYmFjayhwcm9wZXJ0eSk7fX19O31lbHNlIHsgLy8gTm8gYnVncyBkZXRlY3RlZDsgdXNlIHRoZSBzdGFuZGFyZCBgZm9yLi4uaW5gIGFsZ29yaXRobS5cbmZvckVhY2ggPSBmdW5jdGlvbihvYmplY3QsY2FsbGJhY2spe3ZhciBpc0Z1bmN0aW9uPWdldENsYXNzLmNhbGwob2JqZWN0KSA9PSBmdW5jdGlvbkNsYXNzLHByb3BlcnR5LGlzQ29uc3RydWN0b3I7Zm9yKHByb3BlcnR5IGluIG9iamVjdCkge2lmKCEoaXNGdW5jdGlvbiAmJiBwcm9wZXJ0eSA9PSBcInByb3RvdHlwZVwiKSAmJiBpc1Byb3BlcnR5LmNhbGwob2JqZWN0LHByb3BlcnR5KSAmJiAhKGlzQ29uc3RydWN0b3IgPSBwcm9wZXJ0eSA9PT0gXCJjb25zdHJ1Y3RvclwiKSl7Y2FsbGJhY2socHJvcGVydHkpO319IC8vIE1hbnVhbGx5IGludm9rZSB0aGUgY2FsbGJhY2sgZm9yIHRoZSBgY29uc3RydWN0b3JgIHByb3BlcnR5IGR1ZSB0b1xuLy8gY3Jvc3MtZW52aXJvbm1lbnQgaW5jb25zaXN0ZW5jaWVzLlxuaWYoaXNDb25zdHJ1Y3RvciB8fCBpc1Byb3BlcnR5LmNhbGwob2JqZWN0LHByb3BlcnR5ID0gXCJjb25zdHJ1Y3RvclwiKSl7Y2FsbGJhY2socHJvcGVydHkpO319O31yZXR1cm4gZm9yRWFjaChvYmplY3QsY2FsbGJhY2spO307IC8vIFB1YmxpYzogU2VyaWFsaXplcyBhIEphdmFTY3JpcHQgYHZhbHVlYCBhcyBhIEpTT04gc3RyaW5nLiBUaGUgb3B0aW9uYWxcbi8vIGBmaWx0ZXJgIGFyZ3VtZW50IG1heSBzcGVjaWZ5IGVpdGhlciBhIGZ1bmN0aW9uIHRoYXQgYWx0ZXJzIGhvdyBvYmplY3QgYW5kXG4vLyBhcnJheSBtZW1iZXJzIGFyZSBzZXJpYWxpemVkLCBvciBhbiBhcnJheSBvZiBzdHJpbmdzIGFuZCBudW1iZXJzIHRoYXRcbi8vIGluZGljYXRlcyB3aGljaCBwcm9wZXJ0aWVzIHNob3VsZCBiZSBzZXJpYWxpemVkLiBUaGUgb3B0aW9uYWwgYHdpZHRoYFxuLy8gYXJndW1lbnQgbWF5IGJlIGVpdGhlciBhIHN0cmluZyBvciBudW1iZXIgdGhhdCBzcGVjaWZpZXMgdGhlIGluZGVudGF0aW9uXG4vLyBsZXZlbCBvZiB0aGUgb3V0cHV0LlxuaWYoIWhhcyhcImpzb24tc3RyaW5naWZ5XCIpKXsgLy8gSW50ZXJuYWw6IEEgbWFwIG9mIGNvbnRyb2wgY2hhcmFjdGVycyBhbmQgdGhlaXIgZXNjYXBlZCBlcXVpdmFsZW50cy5cbnZhciBFc2NhcGVzPXs5MjpcIlxcXFxcXFxcXCIsMzQ6J1xcXFxcIicsODpcIlxcXFxiXCIsMTI6XCJcXFxcZlwiLDEwOlwiXFxcXG5cIiwxMzpcIlxcXFxyXCIsOTpcIlxcXFx0XCJ9OyAvLyBJbnRlcm5hbDogQ29udmVydHMgYHZhbHVlYCBpbnRvIGEgemVyby1wYWRkZWQgc3RyaW5nIHN1Y2ggdGhhdCBpdHNcbi8vIGxlbmd0aCBpcyBhdCBsZWFzdCBlcXVhbCB0byBgd2lkdGhgLiBUaGUgYHdpZHRoYCBtdXN0IGJlIDw9IDYuXG52YXIgbGVhZGluZ1plcm9lcz1cIjAwMDAwMFwiO3ZhciB0b1BhZGRlZFN0cmluZz1mdW5jdGlvbiB0b1BhZGRlZFN0cmluZyh3aWR0aCx2YWx1ZSl7IC8vIFRoZSBgfHwgMGAgZXhwcmVzc2lvbiBpcyBuZWNlc3NhcnkgdG8gd29yayBhcm91bmQgYSBidWcgaW5cbi8vIE9wZXJhIDw9IDcuNTR1MiB3aGVyZSBgMCA9PSAtMGAsIGJ1dCBgU3RyaW5nKC0wKSAhPT0gXCIwXCJgLlxucmV0dXJuIChsZWFkaW5nWmVyb2VzICsgKHZhbHVlIHx8IDApKS5zbGljZSgtd2lkdGgpO307IC8vIEludGVybmFsOiBEb3VibGUtcXVvdGVzIGEgc3RyaW5nIGB2YWx1ZWAsIHJlcGxhY2luZyBhbGwgQVNDSUkgY29udHJvbFxuLy8gY2hhcmFjdGVycyAoY2hhcmFjdGVycyB3aXRoIGNvZGUgdW5pdCB2YWx1ZXMgYmV0d2VlbiAwIGFuZCAzMSkgd2l0aFxuLy8gdGhlaXIgZXNjYXBlZCBlcXVpdmFsZW50cy4gVGhpcyBpcyBhbiBpbXBsZW1lbnRhdGlvbiBvZiB0aGVcbi8vIGBRdW90ZSh2YWx1ZSlgIG9wZXJhdGlvbiBkZWZpbmVkIGluIEVTIDUuMSBzZWN0aW9uIDE1LjEyLjMuXG52YXIgdW5pY29kZVByZWZpeD1cIlxcXFx1MDBcIjt2YXIgcXVvdGU9ZnVuY3Rpb24gcXVvdGUodmFsdWUpe3ZhciByZXN1bHQ9J1wiJyxpbmRleD0wLGxlbmd0aD12YWx1ZS5sZW5ndGgsdXNlQ2hhckluZGV4PSFjaGFySW5kZXhCdWdneSB8fCBsZW5ndGggPiAxMDt2YXIgc3ltYm9scz11c2VDaGFySW5kZXggJiYgKGNoYXJJbmRleEJ1Z2d5P3ZhbHVlLnNwbGl0KFwiXCIpOnZhbHVlKTtmb3IoO2luZGV4IDwgbGVuZ3RoO2luZGV4KyspIHt2YXIgY2hhckNvZGU9dmFsdWUuY2hhckNvZGVBdChpbmRleCk7IC8vIElmIHRoZSBjaGFyYWN0ZXIgaXMgYSBjb250cm9sIGNoYXJhY3RlciwgYXBwZW5kIGl0cyBVbmljb2RlIG9yXG4vLyBzaG9ydGhhbmQgZXNjYXBlIHNlcXVlbmNlOyBvdGhlcndpc2UsIGFwcGVuZCB0aGUgY2hhcmFjdGVyIGFzLWlzLlxuc3dpdGNoKGNoYXJDb2RlKXtjYXNlIDg6Y2FzZSA5OmNhc2UgMTA6Y2FzZSAxMjpjYXNlIDEzOmNhc2UgMzQ6Y2FzZSA5MjpyZXN1bHQgKz0gRXNjYXBlc1tjaGFyQ29kZV07YnJlYWs7ZGVmYXVsdDppZihjaGFyQ29kZSA8IDMyKXtyZXN1bHQgKz0gdW5pY29kZVByZWZpeCArIHRvUGFkZGVkU3RyaW5nKDIsY2hhckNvZGUudG9TdHJpbmcoMTYpKTticmVhazt9cmVzdWx0ICs9IHVzZUNoYXJJbmRleD9zeW1ib2xzW2luZGV4XTp2YWx1ZS5jaGFyQXQoaW5kZXgpO319cmV0dXJuIHJlc3VsdCArICdcIic7fTsgLy8gSW50ZXJuYWw6IFJlY3Vyc2l2ZWx5IHNlcmlhbGl6ZXMgYW4gb2JqZWN0LiBJbXBsZW1lbnRzIHRoZVxuLy8gYFN0cihrZXksIGhvbGRlcilgLCBgSk8odmFsdWUpYCwgYW5kIGBKQSh2YWx1ZSlgIG9wZXJhdGlvbnMuXG52YXIgc2VyaWFsaXplPWZ1bmN0aW9uIHNlcmlhbGl6ZShwcm9wZXJ0eSxvYmplY3QsY2FsbGJhY2sscHJvcGVydGllcyx3aGl0ZXNwYWNlLGluZGVudGF0aW9uLHN0YWNrKXt2YXIgdmFsdWUsY2xhc3NOYW1lLHllYXIsbW9udGgsZGF0ZSx0aW1lLGhvdXJzLG1pbnV0ZXMsc2Vjb25kcyxtaWxsaXNlY29uZHMscmVzdWx0cyxlbGVtZW50LGluZGV4LGxlbmd0aCxwcmVmaXgscmVzdWx0O3RyeXsgLy8gTmVjZXNzYXJ5IGZvciBob3N0IG9iamVjdCBzdXBwb3J0LlxudmFsdWUgPSBvYmplY3RbcHJvcGVydHldO31jYXRjaChleGNlcHRpb24pIHt9aWYodHlwZW9mIHZhbHVlID09IFwib2JqZWN0XCIgJiYgdmFsdWUpe2NsYXNzTmFtZSA9IGdldENsYXNzLmNhbGwodmFsdWUpO2lmKGNsYXNzTmFtZSA9PSBkYXRlQ2xhc3MgJiYgIWlzUHJvcGVydHkuY2FsbCh2YWx1ZSxcInRvSlNPTlwiKSl7aWYodmFsdWUgPiAtMSAvIDAgJiYgdmFsdWUgPCAxIC8gMCl7IC8vIERhdGVzIGFyZSBzZXJpYWxpemVkIGFjY29yZGluZyB0byB0aGUgYERhdGUjdG9KU09OYCBtZXRob2Rcbi8vIHNwZWNpZmllZCBpbiBFUyA1LjEgc2VjdGlvbiAxNS45LjUuNDQuIFNlZSBzZWN0aW9uIDE1LjkuMS4xNVxuLy8gZm9yIHRoZSBJU08gODYwMSBkYXRlIHRpbWUgc3RyaW5nIGZvcm1hdC5cbmlmKGdldERheSl7IC8vIE1hbnVhbGx5IGNvbXB1dGUgdGhlIHllYXIsIG1vbnRoLCBkYXRlLCBob3VycywgbWludXRlcyxcbi8vIHNlY29uZHMsIGFuZCBtaWxsaXNlY29uZHMgaWYgdGhlIGBnZXRVVEMqYCBtZXRob2RzIGFyZVxuLy8gYnVnZ3kuIEFkYXB0ZWQgZnJvbSBAWWFmZmxlJ3MgYGRhdGUtc2hpbWAgcHJvamVjdC5cbmRhdGUgPSBmbG9vcih2YWx1ZSAvIDg2NGU1KTtmb3IoeWVhciA9IGZsb29yKGRhdGUgLyAzNjUuMjQyNSkgKyAxOTcwIC0gMTtnZXREYXkoeWVhciArIDEsMCkgPD0gZGF0ZTt5ZWFyKyspO2Zvcihtb250aCA9IGZsb29yKChkYXRlIC0gZ2V0RGF5KHllYXIsMCkpIC8gMzAuNDIpO2dldERheSh5ZWFyLG1vbnRoICsgMSkgPD0gZGF0ZTttb250aCsrKTtkYXRlID0gMSArIGRhdGUgLSBnZXREYXkoeWVhcixtb250aCk7IC8vIFRoZSBgdGltZWAgdmFsdWUgc3BlY2lmaWVzIHRoZSB0aW1lIHdpdGhpbiB0aGUgZGF5IChzZWUgRVNcbi8vIDUuMSBzZWN0aW9uIDE1LjkuMS4yKS4gVGhlIGZvcm11bGEgYChBICUgQiArIEIpICUgQmAgaXMgdXNlZFxuLy8gdG8gY29tcHV0ZSBgQSBtb2R1bG8gQmAsIGFzIHRoZSBgJWAgb3BlcmF0b3IgZG9lcyBub3Rcbi8vIGNvcnJlc3BvbmQgdG8gdGhlIGBtb2R1bG9gIG9wZXJhdGlvbiBmb3IgbmVnYXRpdmUgbnVtYmVycy5cbnRpbWUgPSAodmFsdWUgJSA4NjRlNSArIDg2NGU1KSAlIDg2NGU1OyAvLyBUaGUgaG91cnMsIG1pbnV0ZXMsIHNlY29uZHMsIGFuZCBtaWxsaXNlY29uZHMgYXJlIG9idGFpbmVkIGJ5XG4vLyBkZWNvbXBvc2luZyB0aGUgdGltZSB3aXRoaW4gdGhlIGRheS4gU2VlIHNlY3Rpb24gMTUuOS4xLjEwLlxuaG91cnMgPSBmbG9vcih0aW1lIC8gMzZlNSkgJSAyNDttaW51dGVzID0gZmxvb3IodGltZSAvIDZlNCkgJSA2MDtzZWNvbmRzID0gZmxvb3IodGltZSAvIDFlMykgJSA2MDttaWxsaXNlY29uZHMgPSB0aW1lICUgMWUzO31lbHNlIHt5ZWFyID0gdmFsdWUuZ2V0VVRDRnVsbFllYXIoKTttb250aCA9IHZhbHVlLmdldFVUQ01vbnRoKCk7ZGF0ZSA9IHZhbHVlLmdldFVUQ0RhdGUoKTtob3VycyA9IHZhbHVlLmdldFVUQ0hvdXJzKCk7bWludXRlcyA9IHZhbHVlLmdldFVUQ01pbnV0ZXMoKTtzZWNvbmRzID0gdmFsdWUuZ2V0VVRDU2Vjb25kcygpO21pbGxpc2Vjb25kcyA9IHZhbHVlLmdldFVUQ01pbGxpc2Vjb25kcygpO30gLy8gU2VyaWFsaXplIGV4dGVuZGVkIHllYXJzIGNvcnJlY3RseS5cbnZhbHVlID0gKHllYXIgPD0gMCB8fCB5ZWFyID49IDFlND8oeWVhciA8IDA/XCItXCI6XCIrXCIpICsgdG9QYWRkZWRTdHJpbmcoNix5ZWFyIDwgMD8teWVhcjp5ZWFyKTp0b1BhZGRlZFN0cmluZyg0LHllYXIpKSArIFwiLVwiICsgdG9QYWRkZWRTdHJpbmcoMixtb250aCArIDEpICsgXCItXCIgKyB0b1BhZGRlZFN0cmluZygyLGRhdGUpICsgIC8vIE1vbnRocywgZGF0ZXMsIGhvdXJzLCBtaW51dGVzLCBhbmQgc2Vjb25kcyBzaG91bGQgaGF2ZSB0d29cbi8vIGRpZ2l0czsgbWlsbGlzZWNvbmRzIHNob3VsZCBoYXZlIHRocmVlLlxuXCJUXCIgKyB0b1BhZGRlZFN0cmluZygyLGhvdXJzKSArIFwiOlwiICsgdG9QYWRkZWRTdHJpbmcoMixtaW51dGVzKSArIFwiOlwiICsgdG9QYWRkZWRTdHJpbmcoMixzZWNvbmRzKSArICAvLyBNaWxsaXNlY29uZHMgYXJlIG9wdGlvbmFsIGluIEVTIDUuMCwgYnV0IHJlcXVpcmVkIGluIDUuMS5cblwiLlwiICsgdG9QYWRkZWRTdHJpbmcoMyxtaWxsaXNlY29uZHMpICsgXCJaXCI7fWVsc2Uge3ZhbHVlID0gbnVsbDt9fWVsc2UgaWYodHlwZW9mIHZhbHVlLnRvSlNPTiA9PSBcImZ1bmN0aW9uXCIgJiYgKGNsYXNzTmFtZSAhPSBudW1iZXJDbGFzcyAmJiBjbGFzc05hbWUgIT0gc3RyaW5nQ2xhc3MgJiYgY2xhc3NOYW1lICE9IGFycmF5Q2xhc3MgfHwgaXNQcm9wZXJ0eS5jYWxsKHZhbHVlLFwidG9KU09OXCIpKSl7IC8vIFByb3RvdHlwZSA8PSAxLjYuMSBhZGRzIG5vbi1zdGFuZGFyZCBgdG9KU09OYCBtZXRob2RzIHRvIHRoZVxuLy8gYE51bWJlcmAsIGBTdHJpbmdgLCBgRGF0ZWAsIGFuZCBgQXJyYXlgIHByb3RvdHlwZXMuIEpTT04gM1xuLy8gaWdub3JlcyBhbGwgYHRvSlNPTmAgbWV0aG9kcyBvbiB0aGVzZSBvYmplY3RzIHVubGVzcyB0aGV5IGFyZVxuLy8gZGVmaW5lZCBkaXJlY3RseSBvbiBhbiBpbnN0YW5jZS5cbnZhbHVlID0gdmFsdWUudG9KU09OKHByb3BlcnR5KTt9fWlmKGNhbGxiYWNrKXsgLy8gSWYgYSByZXBsYWNlbWVudCBmdW5jdGlvbiB3YXMgcHJvdmlkZWQsIGNhbGwgaXQgdG8gb2J0YWluIHRoZSB2YWx1ZVxuLy8gZm9yIHNlcmlhbGl6YXRpb24uXG52YWx1ZSA9IGNhbGxiYWNrLmNhbGwob2JqZWN0LHByb3BlcnR5LHZhbHVlKTt9aWYodmFsdWUgPT09IG51bGwpe3JldHVybiBcIm51bGxcIjt9Y2xhc3NOYW1lID0gZ2V0Q2xhc3MuY2FsbCh2YWx1ZSk7aWYoY2xhc3NOYW1lID09IGJvb2xlYW5DbGFzcyl7IC8vIEJvb2xlYW5zIGFyZSByZXByZXNlbnRlZCBsaXRlcmFsbHkuXG5yZXR1cm4gXCJcIiArIHZhbHVlO31lbHNlIGlmKGNsYXNzTmFtZSA9PSBudW1iZXJDbGFzcyl7IC8vIEpTT04gbnVtYmVycyBtdXN0IGJlIGZpbml0ZS4gYEluZmluaXR5YCBhbmQgYE5hTmAgYXJlIHNlcmlhbGl6ZWQgYXNcbi8vIGBcIm51bGxcImAuXG5yZXR1cm4gdmFsdWUgPiAtMSAvIDAgJiYgdmFsdWUgPCAxIC8gMD9cIlwiICsgdmFsdWU6XCJudWxsXCI7fWVsc2UgaWYoY2xhc3NOYW1lID09IHN0cmluZ0NsYXNzKXsgLy8gU3RyaW5ncyBhcmUgZG91YmxlLXF1b3RlZCBhbmQgZXNjYXBlZC5cbnJldHVybiBxdW90ZShcIlwiICsgdmFsdWUpO30gLy8gUmVjdXJzaXZlbHkgc2VyaWFsaXplIG9iamVjdHMgYW5kIGFycmF5cy5cbmlmKHR5cGVvZiB2YWx1ZSA9PSBcIm9iamVjdFwiKXsgLy8gQ2hlY2sgZm9yIGN5Y2xpYyBzdHJ1Y3R1cmVzLiBUaGlzIGlzIGEgbGluZWFyIHNlYXJjaDsgcGVyZm9ybWFuY2Vcbi8vIGlzIGludmVyc2VseSBwcm9wb3J0aW9uYWwgdG8gdGhlIG51bWJlciBvZiB1bmlxdWUgbmVzdGVkIG9iamVjdHMuXG5mb3IobGVuZ3RoID0gc3RhY2subGVuZ3RoO2xlbmd0aC0tOykge2lmKHN0YWNrW2xlbmd0aF0gPT09IHZhbHVlKXsgLy8gQ3ljbGljIHN0cnVjdHVyZXMgY2Fubm90IGJlIHNlcmlhbGl6ZWQgYnkgYEpTT04uc3RyaW5naWZ5YC5cbnRocm93IFR5cGVFcnJvcigpO319IC8vIEFkZCB0aGUgb2JqZWN0IHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbnN0YWNrLnB1c2godmFsdWUpO3Jlc3VsdHMgPSBbXTsgLy8gU2F2ZSB0aGUgY3VycmVudCBpbmRlbnRhdGlvbiBsZXZlbCBhbmQgaW5kZW50IG9uZSBhZGRpdGlvbmFsIGxldmVsLlxucHJlZml4ID0gaW5kZW50YXRpb247aW5kZW50YXRpb24gKz0gd2hpdGVzcGFjZTtpZihjbGFzc05hbWUgPT0gYXJyYXlDbGFzcyl7IC8vIFJlY3Vyc2l2ZWx5IHNlcmlhbGl6ZSBhcnJheSBlbGVtZW50cy5cbmZvcihpbmRleCA9IDAsbGVuZ3RoID0gdmFsdWUubGVuZ3RoO2luZGV4IDwgbGVuZ3RoO2luZGV4KyspIHtlbGVtZW50ID0gc2VyaWFsaXplKGluZGV4LHZhbHVlLGNhbGxiYWNrLHByb3BlcnRpZXMsd2hpdGVzcGFjZSxpbmRlbnRhdGlvbixzdGFjayk7cmVzdWx0cy5wdXNoKGVsZW1lbnQgPT09IHVuZGVmP1wibnVsbFwiOmVsZW1lbnQpO31yZXN1bHQgPSByZXN1bHRzLmxlbmd0aD93aGl0ZXNwYWNlP1wiW1xcblwiICsgaW5kZW50YXRpb24gKyByZXN1bHRzLmpvaW4oXCIsXFxuXCIgKyBpbmRlbnRhdGlvbikgKyBcIlxcblwiICsgcHJlZml4ICsgXCJdXCI6XCJbXCIgKyByZXN1bHRzLmpvaW4oXCIsXCIpICsgXCJdXCI6XCJbXVwiO31lbHNlIHsgLy8gUmVjdXJzaXZlbHkgc2VyaWFsaXplIG9iamVjdCBtZW1iZXJzLiBNZW1iZXJzIGFyZSBzZWxlY3RlZCBmcm9tXG4vLyBlaXRoZXIgYSB1c2VyLXNwZWNpZmllZCBsaXN0IG9mIHByb3BlcnR5IG5hbWVzLCBvciB0aGUgb2JqZWN0XG4vLyBpdHNlbGYuXG5mb3JFYWNoKHByb3BlcnRpZXMgfHwgdmFsdWUsZnVuY3Rpb24ocHJvcGVydHkpe3ZhciBlbGVtZW50PXNlcmlhbGl6ZShwcm9wZXJ0eSx2YWx1ZSxjYWxsYmFjayxwcm9wZXJ0aWVzLHdoaXRlc3BhY2UsaW5kZW50YXRpb24sc3RhY2spO2lmKGVsZW1lbnQgIT09IHVuZGVmKXsgLy8gQWNjb3JkaW5nIHRvIEVTIDUuMSBzZWN0aW9uIDE1LjEyLjM6IFwiSWYgYGdhcGAge3doaXRlc3BhY2V9XG4vLyBpcyBub3QgdGhlIGVtcHR5IHN0cmluZywgbGV0IGBtZW1iZXJgIHtxdW90ZShwcm9wZXJ0eSkgKyBcIjpcIn1cbi8vIGJlIHRoZSBjb25jYXRlbmF0aW9uIG9mIGBtZW1iZXJgIGFuZCB0aGUgYHNwYWNlYCBjaGFyYWN0ZXIuXCJcbi8vIFRoZSBcImBzcGFjZWAgY2hhcmFjdGVyXCIgcmVmZXJzIHRvIHRoZSBsaXRlcmFsIHNwYWNlXG4vLyBjaGFyYWN0ZXIsIG5vdCB0aGUgYHNwYWNlYCB7d2lkdGh9IGFyZ3VtZW50IHByb3ZpZGVkIHRvXG4vLyBgSlNPTi5zdHJpbmdpZnlgLlxucmVzdWx0cy5wdXNoKHF1b3RlKHByb3BlcnR5KSArIFwiOlwiICsgKHdoaXRlc3BhY2U/XCIgXCI6XCJcIikgKyBlbGVtZW50KTt9fSk7cmVzdWx0ID0gcmVzdWx0cy5sZW5ndGg/d2hpdGVzcGFjZT9cIntcXG5cIiArIGluZGVudGF0aW9uICsgcmVzdWx0cy5qb2luKFwiLFxcblwiICsgaW5kZW50YXRpb24pICsgXCJcXG5cIiArIHByZWZpeCArIFwifVwiOlwie1wiICsgcmVzdWx0cy5qb2luKFwiLFwiKSArIFwifVwiOlwie31cIjt9IC8vIFJlbW92ZSB0aGUgb2JqZWN0IGZyb20gdGhlIHRyYXZlcnNlZCBvYmplY3Qgc3RhY2suXG5zdGFjay5wb3AoKTtyZXR1cm4gcmVzdWx0O319OyAvLyBQdWJsaWM6IGBKU09OLnN0cmluZ2lmeWAuIFNlZSBFUyA1LjEgc2VjdGlvbiAxNS4xMi4zLlxuZXhwb3J0cy5zdHJpbmdpZnkgPSBmdW5jdGlvbihzb3VyY2UsZmlsdGVyLHdpZHRoKXt2YXIgd2hpdGVzcGFjZSxjYWxsYmFjayxwcm9wZXJ0aWVzLGNsYXNzTmFtZTtpZihvYmplY3RUeXBlc1t0eXBlb2YgZmlsdGVyXSAmJiBmaWx0ZXIpe2lmKChjbGFzc05hbWUgPSBnZXRDbGFzcy5jYWxsKGZpbHRlcikpID09IGZ1bmN0aW9uQ2xhc3Mpe2NhbGxiYWNrID0gZmlsdGVyO31lbHNlIGlmKGNsYXNzTmFtZSA9PSBhcnJheUNsYXNzKXsgLy8gQ29udmVydCB0aGUgcHJvcGVydHkgbmFtZXMgYXJyYXkgaW50byBhIG1ha2VzaGlmdCBzZXQuXG5wcm9wZXJ0aWVzID0ge307Zm9yKHZhciBpbmRleD0wLGxlbmd0aD1maWx0ZXIubGVuZ3RoLHZhbHVlO2luZGV4IDwgbGVuZ3RoO3ZhbHVlID0gZmlsdGVyW2luZGV4KytdLChjbGFzc05hbWUgPSBnZXRDbGFzcy5jYWxsKHZhbHVlKSxjbGFzc05hbWUgPT0gc3RyaW5nQ2xhc3MgfHwgY2xhc3NOYW1lID09IG51bWJlckNsYXNzKSAmJiAocHJvcGVydGllc1t2YWx1ZV0gPSAxKSk7fX1pZih3aWR0aCl7aWYoKGNsYXNzTmFtZSA9IGdldENsYXNzLmNhbGwod2lkdGgpKSA9PSBudW1iZXJDbGFzcyl7IC8vIENvbnZlcnQgdGhlIGB3aWR0aGAgdG8gYW4gaW50ZWdlciBhbmQgY3JlYXRlIGEgc3RyaW5nIGNvbnRhaW5pbmdcbi8vIGB3aWR0aGAgbnVtYmVyIG9mIHNwYWNlIGNoYXJhY3RlcnMuXG5pZigod2lkdGggLT0gd2lkdGggJSAxKSA+IDApe2Zvcih3aGl0ZXNwYWNlID0gXCJcIix3aWR0aCA+IDEwICYmICh3aWR0aCA9IDEwKTt3aGl0ZXNwYWNlLmxlbmd0aCA8IHdpZHRoO3doaXRlc3BhY2UgKz0gXCIgXCIpO319ZWxzZSBpZihjbGFzc05hbWUgPT0gc3RyaW5nQ2xhc3Mpe3doaXRlc3BhY2UgPSB3aWR0aC5sZW5ndGggPD0gMTA/d2lkdGg6d2lkdGguc2xpY2UoMCwxMCk7fX0gLy8gT3BlcmEgPD0gNy41NHUyIGRpc2NhcmRzIHRoZSB2YWx1ZXMgYXNzb2NpYXRlZCB3aXRoIGVtcHR5IHN0cmluZyBrZXlzXG4vLyAoYFwiXCJgKSBvbmx5IGlmIHRoZXkgYXJlIHVzZWQgZGlyZWN0bHkgd2l0aGluIGFuIG9iamVjdCBtZW1iZXIgbGlzdFxuLy8gKGUuZy4sIGAhKFwiXCIgaW4geyBcIlwiOiAxfSlgKS5cbnJldHVybiBzZXJpYWxpemUoXCJcIiwodmFsdWUgPSB7fSx2YWx1ZVtcIlwiXSA9IHNvdXJjZSx2YWx1ZSksY2FsbGJhY2sscHJvcGVydGllcyx3aGl0ZXNwYWNlLFwiXCIsW10pO307fSAvLyBQdWJsaWM6IFBhcnNlcyBhIEpTT04gc291cmNlIHN0cmluZy5cbmlmKCFoYXMoXCJqc29uLXBhcnNlXCIpKXt2YXIgZnJvbUNoYXJDb2RlPVN0cmluZy5mcm9tQ2hhckNvZGU7IC8vIEludGVybmFsOiBBIG1hcCBvZiBlc2NhcGVkIGNvbnRyb2wgY2hhcmFjdGVycyBhbmQgdGhlaXIgdW5lc2NhcGVkXG4vLyBlcXVpdmFsZW50cy5cbnZhciBVbmVzY2FwZXM9ezkyOlwiXFxcXFwiLDM0OidcIicsNDc6XCIvXCIsOTg6XCJcXGJcIiwxMTY6XCJcXHRcIiwxMTA6XCJcXG5cIiwxMDI6XCJcXGZcIiwxMTQ6XCJcXHJcIn07IC8vIEludGVybmFsOiBTdG9yZXMgdGhlIHBhcnNlciBzdGF0ZS5cbnZhciBJbmRleCxTb3VyY2U7IC8vIEludGVybmFsOiBSZXNldHMgdGhlIHBhcnNlciBzdGF0ZSBhbmQgdGhyb3dzIGEgYFN5bnRheEVycm9yYC5cbnZhciBhYm9ydD1mdW5jdGlvbiBhYm9ydCgpe0luZGV4ID0gU291cmNlID0gbnVsbDt0aHJvdyBTeW50YXhFcnJvcigpO307IC8vIEludGVybmFsOiBSZXR1cm5zIHRoZSBuZXh0IHRva2VuLCBvciBgXCIkXCJgIGlmIHRoZSBwYXJzZXIgaGFzIHJlYWNoZWRcbi8vIHRoZSBlbmQgb2YgdGhlIHNvdXJjZSBzdHJpbmcuIEEgdG9rZW4gbWF5IGJlIGEgc3RyaW5nLCBudW1iZXIsIGBudWxsYFxuLy8gbGl0ZXJhbCwgb3IgQm9vbGVhbiBsaXRlcmFsLlxudmFyIGxleD1mdW5jdGlvbiBsZXgoKXt2YXIgc291cmNlPVNvdXJjZSxsZW5ndGg9c291cmNlLmxlbmd0aCx2YWx1ZSxiZWdpbixwb3NpdGlvbixpc1NpZ25lZCxjaGFyQ29kZTt3aGlsZShJbmRleCA8IGxlbmd0aCkge2NoYXJDb2RlID0gc291cmNlLmNoYXJDb2RlQXQoSW5kZXgpO3N3aXRjaChjaGFyQ29kZSl7Y2FzZSA5OmNhc2UgMTA6Y2FzZSAxMzpjYXNlIDMyOiAvLyBTa2lwIHdoaXRlc3BhY2UgdG9rZW5zLCBpbmNsdWRpbmcgdGFicywgY2FycmlhZ2UgcmV0dXJucywgbGluZVxuLy8gZmVlZHMsIGFuZCBzcGFjZSBjaGFyYWN0ZXJzLlxuSW5kZXgrKzticmVhaztjYXNlIDEyMzpjYXNlIDEyNTpjYXNlIDkxOmNhc2UgOTM6Y2FzZSA1ODpjYXNlIDQ0OiAvLyBQYXJzZSBhIHB1bmN0dWF0b3IgdG9rZW4gKGB7YCwgYH1gLCBgW2AsIGBdYCwgYDpgLCBvciBgLGApIGF0XG4vLyB0aGUgY3VycmVudCBwb3NpdGlvbi5cbnZhbHVlID0gY2hhckluZGV4QnVnZ3k/c291cmNlLmNoYXJBdChJbmRleCk6c291cmNlW0luZGV4XTtJbmRleCsrO3JldHVybiB2YWx1ZTtjYXNlIDM0OiAvLyBgXCJgIGRlbGltaXRzIGEgSlNPTiBzdHJpbmc7IGFkdmFuY2UgdG8gdGhlIG5leHQgY2hhcmFjdGVyIGFuZFxuLy8gYmVnaW4gcGFyc2luZyB0aGUgc3RyaW5nLiBTdHJpbmcgdG9rZW5zIGFyZSBwcmVmaXhlZCB3aXRoIHRoZVxuLy8gc2VudGluZWwgYEBgIGNoYXJhY3RlciB0byBkaXN0aW5ndWlzaCB0aGVtIGZyb20gcHVuY3R1YXRvcnMgYW5kXG4vLyBlbmQtb2Ytc3RyaW5nIHRva2Vucy5cbmZvcih2YWx1ZSA9IFwiQFwiLEluZGV4Kys7SW5kZXggPCBsZW5ndGg7KSB7Y2hhckNvZGUgPSBzb3VyY2UuY2hhckNvZGVBdChJbmRleCk7aWYoY2hhckNvZGUgPCAzMil7IC8vIFVuZXNjYXBlZCBBU0NJSSBjb250cm9sIGNoYXJhY3RlcnMgKHRob3NlIHdpdGggYSBjb2RlIHVuaXRcbi8vIGxlc3MgdGhhbiB0aGUgc3BhY2UgY2hhcmFjdGVyKSBhcmUgbm90IHBlcm1pdHRlZC5cbmFib3J0KCk7fWVsc2UgaWYoY2hhckNvZGUgPT0gOTIpeyAvLyBBIHJldmVyc2Ugc29saWR1cyAoYFxcYCkgbWFya3MgdGhlIGJlZ2lubmluZyBvZiBhbiBlc2NhcGVkXG4vLyBjb250cm9sIGNoYXJhY3RlciAoaW5jbHVkaW5nIGBcImAsIGBcXGAsIGFuZCBgL2ApIG9yIFVuaWNvZGVcbi8vIGVzY2FwZSBzZXF1ZW5jZS5cbmNoYXJDb2RlID0gc291cmNlLmNoYXJDb2RlQXQoKytJbmRleCk7c3dpdGNoKGNoYXJDb2RlKXtjYXNlIDkyOmNhc2UgMzQ6Y2FzZSA0NzpjYXNlIDk4OmNhc2UgMTE2OmNhc2UgMTEwOmNhc2UgMTAyOmNhc2UgMTE0OiAvLyBSZXZpdmUgZXNjYXBlZCBjb250cm9sIGNoYXJhY3RlcnMuXG52YWx1ZSArPSBVbmVzY2FwZXNbY2hhckNvZGVdO0luZGV4Kys7YnJlYWs7Y2FzZSAxMTc6IC8vIGBcXHVgIG1hcmtzIHRoZSBiZWdpbm5pbmcgb2YgYSBVbmljb2RlIGVzY2FwZSBzZXF1ZW5jZS5cbi8vIEFkdmFuY2UgdG8gdGhlIGZpcnN0IGNoYXJhY3RlciBhbmQgdmFsaWRhdGUgdGhlXG4vLyBmb3VyLWRpZ2l0IGNvZGUgcG9pbnQuXG5iZWdpbiA9ICsrSW5kZXg7Zm9yKHBvc2l0aW9uID0gSW5kZXggKyA0O0luZGV4IDwgcG9zaXRpb247SW5kZXgrKykge2NoYXJDb2RlID0gc291cmNlLmNoYXJDb2RlQXQoSW5kZXgpOyAvLyBBIHZhbGlkIHNlcXVlbmNlIGNvbXByaXNlcyBmb3VyIGhleGRpZ2l0cyAoY2FzZS1cbi8vIGluc2Vuc2l0aXZlKSB0aGF0IGZvcm0gYSBzaW5nbGUgaGV4YWRlY2ltYWwgdmFsdWUuXG5pZighKGNoYXJDb2RlID49IDQ4ICYmIGNoYXJDb2RlIDw9IDU3IHx8IGNoYXJDb2RlID49IDk3ICYmIGNoYXJDb2RlIDw9IDEwMiB8fCBjaGFyQ29kZSA+PSA2NSAmJiBjaGFyQ29kZSA8PSA3MCkpeyAvLyBJbnZhbGlkIFVuaWNvZGUgZXNjYXBlIHNlcXVlbmNlLlxuYWJvcnQoKTt9fSAvLyBSZXZpdmUgdGhlIGVzY2FwZWQgY2hhcmFjdGVyLlxudmFsdWUgKz0gZnJvbUNoYXJDb2RlKFwiMHhcIiArIHNvdXJjZS5zbGljZShiZWdpbixJbmRleCkpO2JyZWFrO2RlZmF1bHQ6IC8vIEludmFsaWQgZXNjYXBlIHNlcXVlbmNlLlxuYWJvcnQoKTt9fWVsc2Uge2lmKGNoYXJDb2RlID09IDM0KXsgLy8gQW4gdW5lc2NhcGVkIGRvdWJsZS1xdW90ZSBjaGFyYWN0ZXIgbWFya3MgdGhlIGVuZCBvZiB0aGVcbi8vIHN0cmluZy5cbmJyZWFrO31jaGFyQ29kZSA9IHNvdXJjZS5jaGFyQ29kZUF0KEluZGV4KTtiZWdpbiA9IEluZGV4OyAvLyBPcHRpbWl6ZSBmb3IgdGhlIGNvbW1vbiBjYXNlIHdoZXJlIGEgc3RyaW5nIGlzIHZhbGlkLlxud2hpbGUoY2hhckNvZGUgPj0gMzIgJiYgY2hhckNvZGUgIT0gOTIgJiYgY2hhckNvZGUgIT0gMzQpIHtjaGFyQ29kZSA9IHNvdXJjZS5jaGFyQ29kZUF0KCsrSW5kZXgpO30gLy8gQXBwZW5kIHRoZSBzdHJpbmcgYXMtaXMuXG52YWx1ZSArPSBzb3VyY2Uuc2xpY2UoYmVnaW4sSW5kZXgpO319aWYoc291cmNlLmNoYXJDb2RlQXQoSW5kZXgpID09IDM0KXsgLy8gQWR2YW5jZSB0byB0aGUgbmV4dCBjaGFyYWN0ZXIgYW5kIHJldHVybiB0aGUgcmV2aXZlZCBzdHJpbmcuXG5JbmRleCsrO3JldHVybiB2YWx1ZTt9IC8vIFVudGVybWluYXRlZCBzdHJpbmcuXG5hYm9ydCgpO2RlZmF1bHQ6IC8vIFBhcnNlIG51bWJlcnMgYW5kIGxpdGVyYWxzLlxuYmVnaW4gPSBJbmRleDsgLy8gQWR2YW5jZSBwYXN0IHRoZSBuZWdhdGl2ZSBzaWduLCBpZiBvbmUgaXMgc3BlY2lmaWVkLlxuaWYoY2hhckNvZGUgPT0gNDUpe2lzU2lnbmVkID0gdHJ1ZTtjaGFyQ29kZSA9IHNvdXJjZS5jaGFyQ29kZUF0KCsrSW5kZXgpO30gLy8gUGFyc2UgYW4gaW50ZWdlciBvciBmbG9hdGluZy1wb2ludCB2YWx1ZS5cbmlmKGNoYXJDb2RlID49IDQ4ICYmIGNoYXJDb2RlIDw9IDU3KXsgLy8gTGVhZGluZyB6ZXJvZXMgYXJlIGludGVycHJldGVkIGFzIG9jdGFsIGxpdGVyYWxzLlxuaWYoY2hhckNvZGUgPT0gNDggJiYgKGNoYXJDb2RlID0gc291cmNlLmNoYXJDb2RlQXQoSW5kZXggKyAxKSxjaGFyQ29kZSA+PSA0OCAmJiBjaGFyQ29kZSA8PSA1NykpeyAvLyBJbGxlZ2FsIG9jdGFsIGxpdGVyYWwuXG5hYm9ydCgpO31pc1NpZ25lZCA9IGZhbHNlOyAvLyBQYXJzZSB0aGUgaW50ZWdlciBjb21wb25lbnQuXG5mb3IoO0luZGV4IDwgbGVuZ3RoICYmIChjaGFyQ29kZSA9IHNvdXJjZS5jaGFyQ29kZUF0KEluZGV4KSxjaGFyQ29kZSA+PSA0OCAmJiBjaGFyQ29kZSA8PSA1Nyk7SW5kZXgrKyk7IC8vIEZsb2F0cyBjYW5ub3QgY29udGFpbiBhIGxlYWRpbmcgZGVjaW1hbCBwb2ludDsgaG93ZXZlciwgdGhpc1xuLy8gY2FzZSBpcyBhbHJlYWR5IGFjY291bnRlZCBmb3IgYnkgdGhlIHBhcnNlci5cbmlmKHNvdXJjZS5jaGFyQ29kZUF0KEluZGV4KSA9PSA0Nil7cG9zaXRpb24gPSArK0luZGV4OyAvLyBQYXJzZSB0aGUgZGVjaW1hbCBjb21wb25lbnQuXG5mb3IoO3Bvc2l0aW9uIDwgbGVuZ3RoICYmIChjaGFyQ29kZSA9IHNvdXJjZS5jaGFyQ29kZUF0KHBvc2l0aW9uKSxjaGFyQ29kZSA+PSA0OCAmJiBjaGFyQ29kZSA8PSA1Nyk7cG9zaXRpb24rKyk7aWYocG9zaXRpb24gPT0gSW5kZXgpeyAvLyBJbGxlZ2FsIHRyYWlsaW5nIGRlY2ltYWwuXG5hYm9ydCgpO31JbmRleCA9IHBvc2l0aW9uO30gLy8gUGFyc2UgZXhwb25lbnRzLiBUaGUgYGVgIGRlbm90aW5nIHRoZSBleHBvbmVudCBpc1xuLy8gY2FzZS1pbnNlbnNpdGl2ZS5cbmNoYXJDb2RlID0gc291cmNlLmNoYXJDb2RlQXQoSW5kZXgpO2lmKGNoYXJDb2RlID09IDEwMSB8fCBjaGFyQ29kZSA9PSA2OSl7Y2hhckNvZGUgPSBzb3VyY2UuY2hhckNvZGVBdCgrK0luZGV4KTsgLy8gU2tpcCBwYXN0IHRoZSBzaWduIGZvbGxvd2luZyB0aGUgZXhwb25lbnQsIGlmIG9uZSBpc1xuLy8gc3BlY2lmaWVkLlxuaWYoY2hhckNvZGUgPT0gNDMgfHwgY2hhckNvZGUgPT0gNDUpe0luZGV4Kys7fSAvLyBQYXJzZSB0aGUgZXhwb25lbnRpYWwgY29tcG9uZW50LlxuZm9yKHBvc2l0aW9uID0gSW5kZXg7cG9zaXRpb24gPCBsZW5ndGggJiYgKGNoYXJDb2RlID0gc291cmNlLmNoYXJDb2RlQXQocG9zaXRpb24pLGNoYXJDb2RlID49IDQ4ICYmIGNoYXJDb2RlIDw9IDU3KTtwb3NpdGlvbisrKTtpZihwb3NpdGlvbiA9PSBJbmRleCl7IC8vIElsbGVnYWwgZW1wdHkgZXhwb25lbnQuXG5hYm9ydCgpO31JbmRleCA9IHBvc2l0aW9uO30gLy8gQ29lcmNlIHRoZSBwYXJzZWQgdmFsdWUgdG8gYSBKYXZhU2NyaXB0IG51bWJlci5cbnJldHVybiArc291cmNlLnNsaWNlKGJlZ2luLEluZGV4KTt9IC8vIEEgbmVnYXRpdmUgc2lnbiBtYXkgb25seSBwcmVjZWRlIG51bWJlcnMuXG5pZihpc1NpZ25lZCl7YWJvcnQoKTt9IC8vIGB0cnVlYCwgYGZhbHNlYCwgYW5kIGBudWxsYCBsaXRlcmFscy5cbmlmKHNvdXJjZS5zbGljZShJbmRleCxJbmRleCArIDQpID09IFwidHJ1ZVwiKXtJbmRleCArPSA0O3JldHVybiB0cnVlO31lbHNlIGlmKHNvdXJjZS5zbGljZShJbmRleCxJbmRleCArIDUpID09IFwiZmFsc2VcIil7SW5kZXggKz0gNTtyZXR1cm4gZmFsc2U7fWVsc2UgaWYoc291cmNlLnNsaWNlKEluZGV4LEluZGV4ICsgNCkgPT0gXCJudWxsXCIpe0luZGV4ICs9IDQ7cmV0dXJuIG51bGw7fSAvLyBVbnJlY29nbml6ZWQgdG9rZW4uXG5hYm9ydCgpO319IC8vIFJldHVybiB0aGUgc2VudGluZWwgYCRgIGNoYXJhY3RlciBpZiB0aGUgcGFyc2VyIGhhcyByZWFjaGVkIHRoZSBlbmRcbi8vIG9mIHRoZSBzb3VyY2Ugc3RyaW5nLlxucmV0dXJuIFwiJFwiO307IC8vIEludGVybmFsOiBQYXJzZXMgYSBKU09OIGB2YWx1ZWAgdG9rZW4uXG52YXIgZ2V0PWZ1bmN0aW9uIGdldCh2YWx1ZSl7dmFyIHJlc3VsdHMsaGFzTWVtYmVycztpZih2YWx1ZSA9PSBcIiRcIil7IC8vIFVuZXhwZWN0ZWQgZW5kIG9mIGlucHV0LlxuYWJvcnQoKTt9aWYodHlwZW9mIHZhbHVlID09IFwic3RyaW5nXCIpe2lmKChjaGFySW5kZXhCdWdneT92YWx1ZS5jaGFyQXQoMCk6dmFsdWVbMF0pID09IFwiQFwiKXsgLy8gUmVtb3ZlIHRoZSBzZW50aW5lbCBgQGAgY2hhcmFjdGVyLlxucmV0dXJuIHZhbHVlLnNsaWNlKDEpO30gLy8gUGFyc2Ugb2JqZWN0IGFuZCBhcnJheSBsaXRlcmFscy5cbmlmKHZhbHVlID09IFwiW1wiKXsgLy8gUGFyc2VzIGEgSlNPTiBhcnJheSwgcmV0dXJuaW5nIGEgbmV3IEphdmFTY3JpcHQgYXJyYXkuXG5yZXN1bHRzID0gW107Zm9yKDs7aGFzTWVtYmVycyB8fCAoaGFzTWVtYmVycyA9IHRydWUpKSB7dmFsdWUgPSBsZXgoKTsgLy8gQSBjbG9zaW5nIHNxdWFyZSBicmFja2V0IG1hcmtzIHRoZSBlbmQgb2YgdGhlIGFycmF5IGxpdGVyYWwuXG5pZih2YWx1ZSA9PSBcIl1cIil7YnJlYWs7fSAvLyBJZiB0aGUgYXJyYXkgbGl0ZXJhbCBjb250YWlucyBlbGVtZW50cywgdGhlIGN1cnJlbnQgdG9rZW5cbi8vIHNob3VsZCBiZSBhIGNvbW1hIHNlcGFyYXRpbmcgdGhlIHByZXZpb3VzIGVsZW1lbnQgZnJvbSB0aGVcbi8vIG5leHQuXG5pZihoYXNNZW1iZXJzKXtpZih2YWx1ZSA9PSBcIixcIil7dmFsdWUgPSBsZXgoKTtpZih2YWx1ZSA9PSBcIl1cIil7IC8vIFVuZXhwZWN0ZWQgdHJhaWxpbmcgYCxgIGluIGFycmF5IGxpdGVyYWwuXG5hYm9ydCgpO319ZWxzZSB7IC8vIEEgYCxgIG11c3Qgc2VwYXJhdGUgZWFjaCBhcnJheSBlbGVtZW50LlxuYWJvcnQoKTt9fSAvLyBFbGlzaW9ucyBhbmQgbGVhZGluZyBjb21tYXMgYXJlIG5vdCBwZXJtaXR0ZWQuXG5pZih2YWx1ZSA9PSBcIixcIil7YWJvcnQoKTt9cmVzdWx0cy5wdXNoKGdldCh2YWx1ZSkpO31yZXR1cm4gcmVzdWx0czt9ZWxzZSBpZih2YWx1ZSA9PSBcIntcIil7IC8vIFBhcnNlcyBhIEpTT04gb2JqZWN0LCByZXR1cm5pbmcgYSBuZXcgSmF2YVNjcmlwdCBvYmplY3QuXG5yZXN1bHRzID0ge307Zm9yKDs7aGFzTWVtYmVycyB8fCAoaGFzTWVtYmVycyA9IHRydWUpKSB7dmFsdWUgPSBsZXgoKTsgLy8gQSBjbG9zaW5nIGN1cmx5IGJyYWNlIG1hcmtzIHRoZSBlbmQgb2YgdGhlIG9iamVjdCBsaXRlcmFsLlxuaWYodmFsdWUgPT0gXCJ9XCIpe2JyZWFrO30gLy8gSWYgdGhlIG9iamVjdCBsaXRlcmFsIGNvbnRhaW5zIG1lbWJlcnMsIHRoZSBjdXJyZW50IHRva2VuXG4vLyBzaG91bGQgYmUgYSBjb21tYSBzZXBhcmF0b3IuXG5pZihoYXNNZW1iZXJzKXtpZih2YWx1ZSA9PSBcIixcIil7dmFsdWUgPSBsZXgoKTtpZih2YWx1ZSA9PSBcIn1cIil7IC8vIFVuZXhwZWN0ZWQgdHJhaWxpbmcgYCxgIGluIG9iamVjdCBsaXRlcmFsLlxuYWJvcnQoKTt9fWVsc2UgeyAvLyBBIGAsYCBtdXN0IHNlcGFyYXRlIGVhY2ggb2JqZWN0IG1lbWJlci5cbmFib3J0KCk7fX0gLy8gTGVhZGluZyBjb21tYXMgYXJlIG5vdCBwZXJtaXR0ZWQsIG9iamVjdCBwcm9wZXJ0eSBuYW1lcyBtdXN0IGJlXG4vLyBkb3VibGUtcXVvdGVkIHN0cmluZ3MsIGFuZCBhIGA6YCBtdXN0IHNlcGFyYXRlIGVhY2ggcHJvcGVydHlcbi8vIG5hbWUgYW5kIHZhbHVlLlxuaWYodmFsdWUgPT0gXCIsXCIgfHwgdHlwZW9mIHZhbHVlICE9IFwic3RyaW5nXCIgfHwgKGNoYXJJbmRleEJ1Z2d5P3ZhbHVlLmNoYXJBdCgwKTp2YWx1ZVswXSkgIT0gXCJAXCIgfHwgbGV4KCkgIT0gXCI6XCIpe2Fib3J0KCk7fXJlc3VsdHNbdmFsdWUuc2xpY2UoMSldID0gZ2V0KGxleCgpKTt9cmV0dXJuIHJlc3VsdHM7fSAvLyBVbmV4cGVjdGVkIHRva2VuIGVuY291bnRlcmVkLlxuYWJvcnQoKTt9cmV0dXJuIHZhbHVlO307IC8vIEludGVybmFsOiBVcGRhdGVzIGEgdHJhdmVyc2VkIG9iamVjdCBtZW1iZXIuXG52YXIgdXBkYXRlPWZ1bmN0aW9uIHVwZGF0ZShzb3VyY2UscHJvcGVydHksY2FsbGJhY2spe3ZhciBlbGVtZW50PXdhbGsoc291cmNlLHByb3BlcnR5LGNhbGxiYWNrKTtpZihlbGVtZW50ID09PSB1bmRlZil7ZGVsZXRlIHNvdXJjZVtwcm9wZXJ0eV07fWVsc2Uge3NvdXJjZVtwcm9wZXJ0eV0gPSBlbGVtZW50O319OyAvLyBJbnRlcm5hbDogUmVjdXJzaXZlbHkgdHJhdmVyc2VzIGEgcGFyc2VkIEpTT04gb2JqZWN0LCBpbnZva2luZyB0aGVcbi8vIGBjYWxsYmFja2AgZnVuY3Rpb24gZm9yIGVhY2ggdmFsdWUuIFRoaXMgaXMgYW4gaW1wbGVtZW50YXRpb24gb2YgdGhlXG4vLyBgV2Fsayhob2xkZXIsIG5hbWUpYCBvcGVyYXRpb24gZGVmaW5lZCBpbiBFUyA1LjEgc2VjdGlvbiAxNS4xMi4yLlxudmFyIHdhbGs9ZnVuY3Rpb24gd2Fsayhzb3VyY2UscHJvcGVydHksY2FsbGJhY2spe3ZhciB2YWx1ZT1zb3VyY2VbcHJvcGVydHldLGxlbmd0aDtpZih0eXBlb2YgdmFsdWUgPT0gXCJvYmplY3RcIiAmJiB2YWx1ZSl7IC8vIGBmb3JFYWNoYCBjYW4ndCBiZSB1c2VkIHRvIHRyYXZlcnNlIGFuIGFycmF5IGluIE9wZXJhIDw9IDguNTRcbi8vIGJlY2F1c2UgaXRzIGBPYmplY3QjaGFzT3duUHJvcGVydHlgIGltcGxlbWVudGF0aW9uIHJldHVybnMgYGZhbHNlYFxuLy8gZm9yIGFycmF5IGluZGljZXMgKGUuZy4sIGAhWzEsIDIsIDNdLmhhc093blByb3BlcnR5KFwiMFwiKWApLlxuaWYoZ2V0Q2xhc3MuY2FsbCh2YWx1ZSkgPT0gYXJyYXlDbGFzcyl7Zm9yKGxlbmd0aCA9IHZhbHVlLmxlbmd0aDtsZW5ndGgtLTspIHt1cGRhdGUodmFsdWUsbGVuZ3RoLGNhbGxiYWNrKTt9fWVsc2Uge2ZvckVhY2godmFsdWUsZnVuY3Rpb24ocHJvcGVydHkpe3VwZGF0ZSh2YWx1ZSxwcm9wZXJ0eSxjYWxsYmFjayk7fSk7fX1yZXR1cm4gY2FsbGJhY2suY2FsbChzb3VyY2UscHJvcGVydHksdmFsdWUpO307IC8vIFB1YmxpYzogYEpTT04ucGFyc2VgLiBTZWUgRVMgNS4xIHNlY3Rpb24gMTUuMTIuMi5cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbihzb3VyY2UsY2FsbGJhY2spe3ZhciByZXN1bHQsdmFsdWU7SW5kZXggPSAwO1NvdXJjZSA9IFwiXCIgKyBzb3VyY2U7cmVzdWx0ID0gZ2V0KGxleCgpKTsgLy8gSWYgYSBKU09OIHN0cmluZyBjb250YWlucyBtdWx0aXBsZSB0b2tlbnMsIGl0IGlzIGludmFsaWQuXG5pZihsZXgoKSAhPSBcIiRcIil7YWJvcnQoKTt9IC8vIFJlc2V0IHRoZSBwYXJzZXIgc3RhdGUuXG5JbmRleCA9IFNvdXJjZSA9IG51bGw7cmV0dXJuIGNhbGxiYWNrICYmIGdldENsYXNzLmNhbGwoY2FsbGJhY2spID09IGZ1bmN0aW9uQ2xhc3M/d2FsaygodmFsdWUgPSB7fSx2YWx1ZVtcIlwiXSA9IHJlc3VsdCx2YWx1ZSksXCJcIixjYWxsYmFjayk6cmVzdWx0O307fX1leHBvcnRzW1wicnVuSW5Db250ZXh0XCJdID0gcnVuSW5Db250ZXh0O3JldHVybiBleHBvcnRzO31pZihmcmVlRXhwb3J0cyAmJiAhaXNMb2FkZXIpeyAvLyBFeHBvcnQgZm9yIENvbW1vbkpTIGVudmlyb25tZW50cy5cbnJ1bkluQ29udGV4dChyb290LGZyZWVFeHBvcnRzKTt9ZWxzZSB7IC8vIEV4cG9ydCBmb3Igd2ViIGJyb3dzZXJzIGFuZCBKYXZhU2NyaXB0IGVuZ2luZXMuXG52YXIgbmF0aXZlSlNPTj1yb290LkpTT04scHJldmlvdXNKU09OPXJvb3RbXCJKU09OM1wiXSxpc1Jlc3RvcmVkPWZhbHNlO3ZhciBKU09OMz1ydW5JbkNvbnRleHQocm9vdCxyb290W1wiSlNPTjNcIl0gPSB7IC8vIFB1YmxpYzogUmVzdG9yZXMgdGhlIG9yaWdpbmFsIHZhbHVlIG9mIHRoZSBnbG9iYWwgYEpTT05gIG9iamVjdCBhbmRcbi8vIHJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIGBKU09OM2Agb2JqZWN0LlxuXCJub0NvbmZsaWN0XCI6ZnVuY3Rpb24gbm9Db25mbGljdCgpe2lmKCFpc1Jlc3RvcmVkKXtpc1Jlc3RvcmVkID0gdHJ1ZTtyb290LkpTT04gPSBuYXRpdmVKU09OO3Jvb3RbXCJKU09OM1wiXSA9IHByZXZpb3VzSlNPTjtuYXRpdmVKU09OID0gcHJldmlvdXNKU09OID0gbnVsbDt9cmV0dXJuIEpTT04zO319KTtyb290LkpTT04gPSB7XCJwYXJzZVwiOkpTT04zLnBhcnNlLFwic3RyaW5naWZ5XCI6SlNPTjMuc3RyaW5naWZ5fTt9IC8vIEV4cG9ydCBmb3IgYXN5bmNocm9ub3VzIG1vZHVsZSBsb2FkZXJzLlxuaWYoaXNMb2FkZXIpe2RlZmluZShmdW5jdGlvbigpe3JldHVybiBKU09OMzt9KTt9fSkuY2FsbCh0aGlzKTt9KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCI/c2VsZjp0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiP3dpbmRvdzp0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiP2dsb2JhbDp7fSk7fSx7fV0sNTE6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe21vZHVsZS5leHBvcnRzID0gdG9BcnJheTtmdW5jdGlvbiB0b0FycmF5KGxpc3QsaW5kZXgpe3ZhciBhcnJheT1bXTtpbmRleCA9IGluZGV4IHx8IDA7Zm9yKHZhciBpPWluZGV4IHx8IDA7aSA8IGxpc3QubGVuZ3RoO2krKykge2FycmF5W2kgLSBpbmRleF0gPSBsaXN0W2ldO31yZXR1cm4gYXJyYXk7fX0se31dfSx7fSxbMzFdKSgzMSk7fSk7fVxuXG5jYy5fUkZwb3AoKTsiXX0=
