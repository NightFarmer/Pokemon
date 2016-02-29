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