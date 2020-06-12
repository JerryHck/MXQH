//var data = {
//      'id': '4000',
//      'name': '功能测试',
//      'status': 'enable',
//      'varList': [],
//    'nodeList':[]
//};
var data = {
  'id': '4000',
  'name': '功能测试',
  'status': 'enable',
  'varList': [

  ],
  'nodeList': [
    {
      'id': 'Start',
      'type': 'Root',
      'comment': '开始',
      'status': '1',
      'data': {
        'nextNode': 'Announce'
      },
      'top': 50,
      'left': 150
    },
    {
      'id': 'Announce',
      'type': 'Announce',
      'comment': '语音节点',
      'status': '1',
      'data': {
        'nextNode': 'WorkTime',
        'prompts': [
          {
            'type': 'VOX',
            'value': 'api/file/download/nosession/90247cf3-eb3b-455e-97dd-714e2df5b47a.mp3'
          }
        ]
      },
      'top': 178,
      'left': 131
    },
    {
      'id': 'WorkTime',
      'type': 'WorkTime',
      'comment': '',
      'status': '1',
      'data': {
        'weekDay': '1,2,3,4,5',
        'workTime': '08:00~16:00',
        'onWorkNode': 'Menu',
        'offWorkNode': 'Menu2',
        'mDays': [
          {
            'date': '',
            'type': 'onWork'
          },
          {
            'date': '',
            'type': 'offWork'
          }
        ]
      },
      'top': 305,
      'left': 85
    },
    {
      'id': 'Menu',
      'type': 'Menu',
      'comment': '',
      'status': '1',
      'data': {
        'nextNode': 'Exit',
        'prompts': [
          {
            'type': 'VOX',
            'value': 'api/file/download/nosession/.mp3'
          }
        ],
        'noinput': {
          'timeout': '',
          'threshold': '',
          'nextNode': 'Exit',
          'prompt': {
            'type': 'VOX',
            'value': 'api/file/download/nosession/.mp3'
          }
        },
        'nomatch': {
          'threshold': '',
          'nextNode': 'Exit',
          'prompt': {
            'type': 'VOX',
            'value': 'api/file/download/nosession/.mp3'
          }
        },
        'choices': [
          {
            'key': '1',
            'nextNode': 'Exit'
          },
          {
            'key': '2',
            'nextNode': 'Exit'
          },
          {
            'key': '3',
            'nextNode': 'Exit'
          }
        ]
      },
      'top': 499,
      'left': 281
    },
    {
      'id': 'Menu2',
      'type': 'Menu',
      'comment': '',
      'status': '1',
      'data': {
        'nextNode': 'Exit',
        'prompts': [
          {
            'type': 'VOX',
            'value': 'api/file/download/nosession/.mp3'
          }
        ],
        'noinput': {
          'timeout': '',
          'threshold': '',
          'nextNode': 'Exit',
          'prompt': {
            'type': 'VOX',
            'value': 'api/file/download/nosession/.mp3'
          }
        },
        'nomatch': {
          'threshold': '',
          'nextNode': 'Exit',
          'prompt': {
            'type': 'VOX',
            'value': 'api/file/download/nosession/.mp3'
          }
        },
        'choices': [
          {
            'key': '1',
            'nextNode': 'Exit'
          },
          {
            'key': '2',
            'nextNode': 'Announce'
          }
        ]
      },
      'top': 330,
      'left': 503
    },
    {
      'id': 'Exit',
      'type': 'Exit',
      'status': '1',
      'comment': '结束',
      'data': {

      },
      'top': 829,
      'left': 883
    }
  ]
}

var Nodes = [
    { "blockId": "Start", "positionX": 150, "positionY": 50 },
    { "blockId": "Announce", "positionX": 131, "positionY": 178 },
    { "blockId": "WorkTime", "positionX": 85, "positionY": 305 },
    { "blockId": "Menu", "positionX": 281, "positionY": 499 },
    { "blockId": "Menu2", "positionX": 503, "positionY": 330 },
    { "blockId": "Exit", "positionX": 883, "positionY": 829 }
]
var Connects = [
    { "connectionId": "con_37", "pageSourceId": "Start", "pageTargetId": "Announce" },
    { "connectionId": "con_39", "pageSourceId": "Announce", "pageTargetId": "WorkTime" },
    { "connectionId": "con_41", "pageSourceId": "WorkTime-onWorkTime", "pageTargetId": "Menu" },
    { "connectionId": "con_43", "pageSourceId": "WorkTime-offWorkTime", "pageTargetId": "Menu2" },
    { "connectionId": "con_45", "pageSourceId": "Menu-noinput", "pageTargetId": "Exit" },
    { "connectionId": "con_47", "pageSourceId": "Menu-nomatch", "pageTargetId": "Exit" },
    { "connectionId": "con_49", "pageSourceId": "Menu-key-1", "pageTargetId": "Exit" },
    { "connectionId": "con_51", "pageSourceId": "Menu-key-2", "pageTargetId": "Exit" },
    { "connectionId": "con_53", "pageSourceId": "Menu-key-3", "pageTargetId": "Exit" },
    { "connectionId": "con_55", "pageSourceId": "Menu2-noinput", "pageTargetId": "Exit" },
    { "connectionId": "con_57", "pageSourceId": "Menu2-nomatch", "pageTargetId": "Exit" },
    { "connectionId": "con_59", "pageSourceId": "Menu2-key-1", "pageTargetId": "Exit" },
    { "connectionId": "con_61", "pageSourceId": "Menu2-key-2", "pageTargetId": "Announce" }
]