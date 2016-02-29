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