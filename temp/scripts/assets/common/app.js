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