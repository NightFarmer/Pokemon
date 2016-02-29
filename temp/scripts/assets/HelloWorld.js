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