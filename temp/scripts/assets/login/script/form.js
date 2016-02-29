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