'use strict';

angular.module('app')
.controller('FormFlowDialogCtrl', ['MyPop', '$scope', 'ItemData', 'AjaxService', 'toastr', '$uibModalInstance', 'Dialog',
function (MyPop, $scope, ItemData, AjaxService, toastr, $uibModalInstance, Dialog) {

    var vm = this;
    vm.ItemData = ItemData;
    vm.Cancel = Cancel;
    vm.OK = OK;
    var newPlumb = null;

    //取旧流程
    vm.promise = AjaxService.GetPlans("foFormFlowNode", { name: "FlowNo", value: ItemData.FunNo }).then(function (data) {
        vm.Data = data;
        newPlumb = jsPlumb.getInstance();
        newPlumb.importDefaults({
            ConnectionsDetachable: false
        })
        newPlumb.removeAllEndpoints("RouterApp");
        newPlumb.ready(main)
    })


    //初始化节点流程
    function InitPlumb() {
        $("#drop-bg .pa").each(function (idx, elem) {
            //移除节点
            newPlumb.remove($(elem).attr('id'))
        });
        DataDraw.draw(vm.Data);
    }


    function OK() {
        GetNodeData();
        vm.Data = vm.Data || [];
        if (vm.Data.length == 0) {
            toastr.error("还未配置任何节点信息，无法保存");
            return;
        }
        
        var en = { FlowNo: ItemData.FunNo }, ListNode = [], ListRel = [];
        var haveStart = false;
        //值获取
        for (var i = 0, len = vm.Data.length; i < len; i++) {
            var node = angular.copy(vm.Data[i]);
            node.Relate = node.Relate || [];
            for (var j = 0, len2 = node.Relate.length; j < len2; j++) {
                ListRel.push(node.Relate[j]);
            }
            //判断是否有开始节点
            if (node.NodeType == 'A') {
                haveStart = true;
            }
            node.Relate = undefined;
            ListNode.push(node);
        }
        if (!haveStart) {
            toastr.error("没有配置开始节点，无法保存");
            return;
        }


        en.ListNode = JSON.stringify(ListNode);
        en.listRel = JSON.stringify(ListRel);
        en.TempColumns = "ListNode,listRel";
        vm.promise = AjaxService.ExecPlan("foFormFlowNode", "save", en).then(function (data) {
            toastr.success("存储成功");
            $uibModalInstance.close(en);
        })
    }

    //节点信息JSON化
    function GetNodeData() {
        var List = [];
        vm.Data = vm.Data || [];
        //记录位置
        $("#drop-bg .pa").each(function (idx, elem) {
            var $elem = $(elem);
            for (var i = 0, len = vm.Data.length; i < len; i++) {
                if (vm.Data[i].NodeNo == $elem.attr('id')) {
                    vm.Data[i].PosTop = parseInt($elem.css("top"), 10);
                    vm.Data[i].PosLeft = parseInt($elem.css("left"), 10);
                }
            }
        });
        for (var i = 0, len = vm.Data.length; i < len; i++) {
            vm.Data[i].Relate = [];
            $.each(newPlumb.getConnections(), function (idx, connection) {
                var con = {
                    RelateNo: connection.sourceId, NextNodeNo: connection.targetId
                };
                if (vm.Data[i].NodeNo == connection.sourceId || vm.Data[i].NodeNo + "-OK" == connection.sourceId) {
                    con.RelateType = 'OK';
                }
                else if (vm.Data[i].NodeNo + "-NG" == connection.sourceId) {
                    con.RelateType = 'NG';
                }
                if (con.RelateType) {
                    con.FlowNo = ItemData.FunNo;
                    con.NodeNo = vm.Data[i].NodeNo;
                    vm.Data[i].Relate.push(con)
                }
            });
        }
    }

    //取消
    function Cancel() {
        $uibModalInstance.dismiss('cancel');
    }

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    var visoConfig = {
        visoTemplate: {}
    }

    // 基本连接线样式
    visoConfig.connectorPaintStyle = {
        lineWidth: 1.5,
        strokeStyle: '#2e8505',
        //strokeStyle: 'blue',
        joinstyle: 'round',
        fill: 'pink',
        outlineColor: '',
        outlineWidth: ''
    }

    // 鼠标悬浮在连接线上的样式
    visoConfig.connectorHoverStyle = {
        lineWidth: 3,
        strokeStyle: 'red',
        outlineWidth: 10,
        outlineColor: ''
    }

    visoConfig.baseStyle = {
        endpoint: ['Dot', {
            radius: 8,
            fill: 'pink'
        }], // 端点的形状
        connectorStyle: visoConfig.connectorPaintStyle, // 连接线的颜色，大小样式
        connectorHoverStyle: visoConfig.connectorHoverStyle,
        paintStyle: {
            //默认
            strokeStyle: '#0b6df5',
            stroke: '#0b6df5',
            fill: 'pink',
            fillStyle: '#0b6df5',
            radius: 3,
            lineWidth: 2
        }, // 端点的颜色样式
        // hoverPaintStyle: {
        //   outlineStroke: 'pink'
        // },
        hoverPaintStyle: {
            stroke: 'blue'
        },
        isSource: true, // 是否可以拖动（作为连线起点）
        connector: ['Flowchart', { gap: 5, cornerRadius: 2, alwaysRespectStubs: true }],  // 连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
        isTarget: true, // 是否可以放置（连线终点）
        maxConnections: -1, // 设置连接点最多可以连接几条线
        connectorOverlays: [
          ['Arrow', {
              width: 10,
              length: 10,
              location: 1
          }],
          ['Arrow', {
              width: 10,
              length: 10,
              location: 0.2
          }],
          ['Arrow', {
              width: 10,
              length: 10,
              location: 0.7
          }],
          ['Label', {
              label: '',
              cssClass: '',
              labelStyle: {
                  color: 'red'
              },
              events: {
                  click: function (labelOverlay, originalEvent) {
                      console.log('click on label overlay for :' + labelOverlay.component)
                      console.log(labelOverlay)
                      console.log(originalEvent)
                  }
              }
          }]
        ]
    }

    visoConfig.baseArchors = ['RightMiddle', 'LeftMiddle'];



    var area = 'drop-bg'
    var areaId = '#' + area
    var fixedNodeId = {
        begin: 'begin-node',
        end: 'end-node'
    }

    // 放入拖动节点 --新增节点
    function dropNode(template, position, name) {
        var node = {
        };
        node.NodeNo = uuid.v1();
        node.PosTop = position.top;
        node.PosLeft = position.left - $('#side-buttons').outerWidth();
        node.NodeName = name;
        node.FlowNo = ItemData.FunNo;
        node.PosIn = "Left";
        node.PosOkOut = "Right";
        node.PosNgOut = "Right";
        switch (template) {
            case 'tpl-A':
                node.NodeType = "A";
                node.SignType = "A";
                node.StageType = 'AB';
                node.AbleIn = false;
                node.AbleOkOut = true;
                node.AbleNgOut = false;
                break;
            case 'tpl-S': node.NodeType = "S";
                node.PosIn = "Top";
                node.SignType = "S";
                node.StageType = 'WA';
                node.AbleIn = true;
                node.AbleOkOut = true;
                node.AbleNgOut = true;
                break;
            case 'tpl-H':
                node.NodeType = "H";
                node.SignType = "H";
                node.StageType = 'WA';
                node.AbleIn = true;
                node.AbleOkOut = true;
                node.AbleNgOut = false;
                break;
            case 'tpl-E': node.NodeType = "E"; node.SignType = "S"; node.StageType = 'WA'; node.AbleIn = true; node.AbleOkOut = false; node.AbleNgOut = false; break;
        }
        Dialog.OpenDialog("FlowNodeSetDialog", node).then(function (data) {
            vm.Data = vm.Data || [];
            vm.Data.push(data);
            //获取页面上节点数据
            GetNodeData();
            InitPlumb();
        })
    }

    // 设置节点入口点
    function setEnterPoint(id, position) {
        var config = getBaseNodeConfig()
        config.isSource = false
        config.maxConnections = -1
        newPlumb.addEndpoint(id, {
            anchors: position || 'Top',
            uuid: id + '-In'
        }, config)
    }

    // 设置ok出口点
    function setExitPointOk(id, position) {
        var config = angular.copy(getBaseNodeConfig())
        //OK的线
        config.paintStyle.strokeStyle = '#10b741';
        config.paintStyle.stroke = '#7AB02C';
        config.paintStyle.fillStyle = '#10b741';

        config.isTarget = false
        config.maxConnections = 1

        newPlumb.addEndpoint(id, {
            anchors: position || 'Bottom',
            uuid: id + '-Out'
        }, config)
    }

    function setExitPointNG(id, position) {
        var config = angular.copy(getBaseNodeConfig())
        //OK的线
        config.paintStyle.strokeStyle = '#d75757';
        config.paintStyle.stroke = '#d75757';
        config.paintStyle.fillStyle = '#d75757';
        config.isTarget = false
        config.maxConnections = 1

        config.connectorStyle.strokeStyle = '#9b75a1';
        config.connectorHoverStyle.strokeStyle = '#c210de';


        newPlumb.addEndpoint(id, {
            anchors: position || 'Bottom',
            uuid: id + '-Out'
        }, config)
    }


    // 删除一个节点以及
    function emptyNode(id) {
        newPlumb.remove(id)
    }

    // 让元素可拖动
    function addDraggable(id) {
        newPlumb.draggable(id, {
            containment: 'parent'
        })
    }

    // 渲染html
    function renderHtml(type, position) {
        return Mustache.render($('#' + type).html(), position)
    }

    function eventHandler(data) {
        if (data.type === 'deleteNode') {
            MyPop.ngConfirm({ text: '确定删除所点击的节点吗？' }).then(function () {
                var index = -1;
                for (var i = 0, len = vm.Data.length; i < len; i++) {
                    if (vm.Data[i].NodeNo == data.id) {
                        index = i;
                        emptyNode(data.id);
                    }
                }
                vm.Data.splice(index, 1);
            })
        }
    }

    function eventdbHandler(data) {
        if (data.type === 'OpenSetting') {
            GetNodeData();
            var node, index;
            vm.Data = vm.Data || [];
            for (var i = 0, len = vm.Data.length; i < len; i++) {
                if (vm.Data[i].NodeNo == data.id) {
                    index = i;
                    node = vm.Data[i]; break;
                }
            }
            Dialog.OpenDialog("FlowNodeSetDialog", node).then(function (data) {
                vm.Data[index] = data;
                InitPlumb();
                console.log(vm.Data)
            }, function (data2) { })
        }
    }

    // 主要入口
    function main() {
        newPlumb.setContainer('diagramContainer')

        $('.btn-controler').draggable({
            helper: 'clone',
            scope: 'ss',
        })

        $(areaId).droppable({
            scope: 'ss',
            drop: function (event, ui) {
                console.log(ui.draggable[0].dataset);
                dropNode(ui.draggable[0].dataset.template, ui.position, ui.draggable[0].dataset.name)
            }
        })

        //主体单机事件
        $('#RouterApp').on('click', function (event) {
            event.stopPropagation()
            event.preventDefault()
            eventHandler(event.target.dataset)
        })
        //主体单机事件
        $('#RouterApp').on('dblclick', function (event) {
            event.stopPropagation()
            event.preventDefault()
            eventdbHandler(event.target.dataset)
        })

        // 单点击了连接线上的X号
        newPlumb.bind('dblclick', function (conn, originalEvent) {
            DataDraw.deleteLine(conn)
        })

        // 当链接建立
        newPlumb.bind('beforeDrop', function (info) {
            return connectionBeforeDropCheck(info)
        })

        // DataProcess.inputData(data.nodeList)
        DataDraw.draw(vm.Data)
    }

    // 链接建立后的检查
    // 当出现自连接的情况后，要将链接断开
    function connectionBeforeDropCheck(info) {
        if (!info.connection.source.dataset.pid) {
            return true
        }
        return info.connection.source.dataset.pid !== info.connection.target.dataset.id
    }

    // 获取基本配置
    function getBaseNodeConfig() {
        return Object.assign({}, visoConfig.baseStyle)
    }

    var DataProcess = {
        inputData: function (nodes) {
            var ids = this.getNodeIds(nodes)
            var g = new graphlib.Graph()

            ids.forEach(function (id) {
                g.setNode(id)
            })

            var me = this

            nodes.forEach(function (item) {
                
            })
            var distance = graphlib.alg.dijkstra(g, 'Start')

            return this.generateDepth(distance)
        },
        setNodesPosition: function (nodes) {
            var me = this
            nodes.forEach(function (item) {
                me.getNodePosition(item)
            })
        },
        getNodePosition: function (node) {
            var $node = document.getElementById(node.NodeNo)
            node.PosTop = parseInt($node.style.top)
            node.PosLeft = parseInt($node.style.left)
        },
        generateDepth: function (deep) {
            var depth = []

            Object.keys(deep).forEach(function (key) {
                var distance = deep[key].distance

                if (!depth[distance]) {
                    depth[distance] = []
                }

                depth[distance].push(key)
            })

            return depth
        },
        getNodeIds: function (nodes) {
            return nodes.map(function (item) {
                return item.nextNode
            })
        },
        setEdge: function name(g, from, to) {
            console.log(from + ' ---> ' + to)
            g.setEdge(from, to)
        }
    }

    //绘制节点
    var DataDraw = {
        deleteLine: function (conn) {
            MyPop.ngConfirm({ text: '确定删除所点击的链接吗？' }).then(function () {
                newPlumb.detach(conn);
            })
        },
        draw: function (nodes) {
            // 将Exit节点排到最后
            nodes.sort(function (a, b) {
                if (a.NodeType === 'E') return 1
                if (b.NodeType === 'E') return -1
                return 0
            })

            this.computeXY(nodes)

            // var template = $('#tpl-demo').html()
            var $container = $(areaId)
            var me = this
            //节点初始化
            nodes.forEach(function (item, key) {
                var template = me.getTemplate(item);
                $container.append(Mustache.render(template, item));
                addDraggable(item.NodeNo)
                switch (item.NodeType) {
                    case "A":
                    case "H":
                    case "E":
                        if (item.AbleIn) {
                            setEnterPoint(item.NodeNo, item.PosIn);
                        }
                        if (item.AbleOkOut) {
                            setExitPointOk(item.NodeNo, item.PosOkOut);
                        } break;
                    case "S":
                        if (item.AbleIn) {
                            setEnterPoint(item.NodeNo, item.PosIn);
                        }
                        if (item.AbleOkOut) {
                            setExitPointOk(item.NodeNo + "-OK", item.PosOkOut);
                        }
                        if (item.AbleNgOut) {
                            setExitPointNG(item.NodeNo + "-NG", item.PosNgOut);
                        }
                        break;
                }
            })

            //连线
            nodes.forEach(function (item, key) {
                //连接连线
                if (item.Relate && item.Relate.length > 0) {
                    for (var j = 0, len1 = item.Relate.length; j < len1; j++) {
                        var config = angular.copy(getBaseNodeConfig())
                        var con = newPlumb.connect({ uuids: [item.Relate[j].RelateNo + '-Out', item.Relate[j].NextNodeNo + '-In'] });
                    }
                }
            })

            this.mainConnect(nodes)
        },
        connectEndpoint: function (from, to) {
            newPlumb.connect({ uuids: [from, to] })
        },
        mainConnect: function (nodes) {
            var me = this
            //nodes.forEach(function (item) {
            //    if (me['connectEndpointOf' + item.type]) {
            //        me['connectEndpointOf' + item.type](item)
            //    }
            //})
        },
        getTemplate: function (node) {
            return $('#tpl-' + node.NodeType).html();
        },
        computeXY: function (nodes) {
            var matrix = DataProcess.inputData(nodes)

            var base = {
                topBase: 50,
                topStep: 150,
                leftBase: 150,
                leftStep: 200
            }

            for (var i = 0; i < matrix.length; i++) {
                for (var j = 0; j < matrix[i].length; j++) {
                    var key = matrix[i][j]

                    var dest = nodes.find(function (item) {
                        return item.id === key
                    })

                    dest.top = dest.top || base.topBase + i * base.topStep
                    dest.left = dest.left || base.leftBase + j * base.leftStep
                }
            }
        },
    }
}
]);