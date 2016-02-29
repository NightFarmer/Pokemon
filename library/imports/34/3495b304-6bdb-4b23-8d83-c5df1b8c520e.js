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