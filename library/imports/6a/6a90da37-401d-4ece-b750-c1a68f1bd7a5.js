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