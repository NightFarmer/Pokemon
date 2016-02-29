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