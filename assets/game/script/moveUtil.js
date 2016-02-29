cc.Class({
    extends: cc.Component,

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
    onLoad: function () {
 
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    find_path: function (start, end, map, marker) {
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
        open.push([startNode[0], startNode[1], 0, (Math.abs(endNode[0] - startNode[0]) + Math.abs(endNode[1] - startNode[1])), null]);

        return function (node) {
            //重拍，取最小的一个
            var count = 0;
            var nodeX = node[0];
            var nodeY = node[1];
            var nodeG = node[2];
            for (var i = nodeX - 1, ilen = i + 3; i < ilen; i++) {
                for (var j = nodeY - 1, jlen = j + 3; j < jlen; j++) {
                    //遍历周围八节点,排除自己
                    if (i == nodeX && j == nodeY)
                        continue;
                    //排除斜着走的情况
                    //if(!((i == obj[0] ) || ( j == obj[1])) && ( map_arr[i] && map_arr[obj[0]] && map_arr[i][obj[1]] != tra_marker && map_arr[obj[0]][j] != tra_marker))
                    //if (!(i == nodeX || j == nodeY))
                    //    continue;
                    if (i == endNode[0] && j == endNode[1]) {
                        var endPoint =[i, j, G, F, node];
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
                        G = (i == nodeX || j == nodeY) ? nodeG + 1.0 : nodeG + 1.4;
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
        }(open[0])
    },

    get_brother: function (arr, o) {
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


    arr_sort: function () {
        function s(a, b) {
            return a[3] - b[3];
        }

        return function (arr) {
            arr.sort(s);
        }
    }(),

    is_exist: function (arr, p) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][0] == p[0] && arr[i][1] == p[1]) {
                return i;
            }
        }
        return -1;
    }
});
