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