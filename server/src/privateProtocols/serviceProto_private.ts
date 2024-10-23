import { ServiceProto } from 'tsrpc-proto';
import { MsgChatTransform } from './game/MsgChatTransform';
import { ReqCreateRoom, ResCreateRoom } from './game/PtlCreateRoom';
import { ReqGetAllUserLocations, ResGetAllUserLocations } from './game/PtlGetAllUserLocations';
import { ReqGetRoomStates, ResGetRoomStates } from './game/PtlGetRoomStates';
import { ReqKickUser, ResKickUser } from './game/PtlKickUser';
import { ReqGetGameServerList, ResGetGameServerList } from './master/PtlGetGameServerList';
import { ReqGetGameServerMap, ResGetGameServerMap } from './master/PtlGetGameServerMap';
import { ReqGetLobbyServerList, ResGetLobbyServerList } from './master/PtlGetLobbyServerList';
import { ReqGetMatchServerList, ResGetMatchServerList } from './master/PtlGetMatchServerList';
import { ReqGetUserLocation, ResGetUserLocation } from './master/PtlGetUserLocation';
import { ReqReportServerState, ResReportServerState } from './master/PtlReportServerState';
import { ReqUpdateUserLocation, ResUpdateUserLocation } from './master/PtlUpdateUserLocation';
import { ReqUserLoginPrepare, ResUserLoginPrepare } from './master/PtlUserLoginPrepare';
import { ReqCancelMatch, ResCancelMatch } from './match/PtlCancelMatch';
import { ReqCreateRoomOnMinLoadServer, ResCreateRoomOnMinLoadServer } from './match/PtlCreateRoomOnMinLoadServer';
import { ReqGetRoomListByType, ResGetRoomListByType } from './match/PtlGetRoomListByType';
import { ReqGetRoomServerState, ResGetRoomServerState } from './match/PtlGetRoomServerState';
import { ReqStartMatch, ResStartMatch } from './match/PtlStartMatch';
import { ReqUpdateRoomState, ResUpdateRoomState } from './match/PtlUpdateRoomState';
import { ReqCheckServerAlive, ResCheckServerAlive } from './PtlCheckServerAlive';

export interface ServiceType {
    api: {
        "game/CreateRoom": {
            req: ReqCreateRoom,
            res: ResCreateRoom
        },
        "game/GetAllUserLocations": {
            req: ReqGetAllUserLocations,
            res: ResGetAllUserLocations
        },
        "game/GetRoomStates": {
            req: ReqGetRoomStates,
            res: ResGetRoomStates
        },
        "game/KickUser": {
            req: ReqKickUser,
            res: ResKickUser
        },
        "master/GetGameServerList": {
            req: ReqGetGameServerList,
            res: ResGetGameServerList
        },
        "master/GetGameServerMap": {
            req: ReqGetGameServerMap,
            res: ResGetGameServerMap
        },
        "master/GetLobbyServerList": {
            req: ReqGetLobbyServerList,
            res: ResGetLobbyServerList
        },
        "master/GetMatchServerList": {
            req: ReqGetMatchServerList,
            res: ResGetMatchServerList
        },
        "master/GetUserLocation": {
            req: ReqGetUserLocation,
            res: ResGetUserLocation
        },
        "master/ReportServerState": {
            req: ReqReportServerState,
            res: ResReportServerState
        },
        "master/UpdateUserLocation": {
            req: ReqUpdateUserLocation,
            res: ResUpdateUserLocation
        },
        "master/UserLoginPrepare": {
            req: ReqUserLoginPrepare,
            res: ResUserLoginPrepare
        },
        "match/CancelMatch": {
            req: ReqCancelMatch,
            res: ResCancelMatch
        },
        "match/CreateRoomOnMinLoadServer": {
            req: ReqCreateRoomOnMinLoadServer,
            res: ResCreateRoomOnMinLoadServer
        },
        "match/GetRoomListByType": {
            req: ReqGetRoomListByType,
            res: ResGetRoomListByType
        },
        "match/GetRoomServerState": {
            req: ReqGetRoomServerState,
            res: ResGetRoomServerState
        },
        "match/StartMatch": {
            req: ReqStartMatch,
            res: ResStartMatch
        },
        "match/UpdateRoomState": {
            req: ReqUpdateRoomState,
            res: ResUpdateRoomState
        },
        "CheckServerAlive": {
            req: ReqCheckServerAlive,
            res: ResCheckServerAlive
        }
    },
    msg: {
        "game/ChatTransform": MsgChatTransform
    }
}

export const serviceProto: ServiceProto<ServiceType> = {
    "version": 9,
    "services": [
        {
            "id": 0,
            "name": "game/ChatTransform",
            "type": "msg"
        },
        {
            "id": 2,
            "name": "game/CreateRoom",
            "type": "api",
            "conf": {
                "allowGuest": true
            }
        },
        {
            "id": 3,
            "name": "game/GetAllUserLocations",
            "type": "api",
            "conf": {}
        },
        {
            "id": 4,
            "name": "game/GetRoomStates",
            "type": "api",
            "conf": {}
        },
        {
            "id": 5,
            "name": "game/KickUser",
            "type": "api",
            "conf": {}
        },
        {
            "id": 6,
            "name": "master/GetGameServerList",
            "type": "api",
            "conf": {}
        },
        {
            "id": 18,
            "name": "master/GetGameServerMap",
            "type": "api",
            "conf": {}
        },
        {
            "id": 20,
            "name": "master/GetLobbyServerList",
            "type": "api",
            "conf": {}
        },
        {
            "id": 7,
            "name": "master/GetMatchServerList",
            "type": "api",
            "conf": {}
        },
        {
            "id": 8,
            "name": "master/GetUserLocation",
            "type": "api",
            "conf": {}
        },
        {
            "id": 9,
            "name": "master/ReportServerState",
            "type": "api",
            "conf": {}
        },
        {
            "id": 10,
            "name": "master/UpdateUserLocation",
            "type": "api",
            "conf": {}
        },
        {
            "id": 11,
            "name": "master/UserLoginPrepare",
            "type": "api",
            "conf": {}
        },
        {
            "id": 12,
            "name": "match/CancelMatch",
            "type": "api"
        },
        {
            "id": 13,
            "name": "match/CreateRoomOnMinLoadServer",
            "type": "api",
            "conf": {}
        },
        {
            "id": 14,
            "name": "match/GetRoomListByType",
            "type": "api",
            "conf": {}
        },
        {
            "id": 15,
            "name": "match/GetRoomServerState",
            "type": "api",
            "conf": {}
        },
        {
            "id": 16,
            "name": "match/StartMatch",
            "type": "api"
        },
        {
            "id": 19,
            "name": "match/UpdateRoomState",
            "type": "api",
            "conf": {}
        },
        {
            "id": 17,
            "name": "CheckServerAlive",
            "type": "api",
            "conf": {}
        }
    ],
    "types": {
        "game/MsgChatTransform/MsgChatTransform": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "time",
                    "type": {
                        "type": "Date"
                    }
                },
                {
                    "id": 1,
                    "name": "user",
                    "type": {
                        "type": "Reference",
                        "target": "../shared/types/UserInfo/UserInfo"
                    }
                },
                {
                    "id": 2,
                    "name": "channel",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 3,
                    "name": "content",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "../shared/types/UserInfo/UserInfo": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "uid",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "name",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 2,
                    "name": "visualId",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 3,
                    "name": "gender",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 4,
                    "name": "introduction",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 5,
                    "name": "coin",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                }
            ]
        },
        "game/PtlCreateRoom/ReqCreateRoom": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "roomId",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "displayId",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "roomName",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 3,
                    "name": "gameType",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 4,
                    "name": "password",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "game/PtlCreateRoom/ResCreateRoom": {
            "type": "Interface",
            "properties": [
                {
                    "id": 1,
                    "name": "state",
                    "type": {
                        "type": "Reference",
                        "target": "game/RoomStateDef/IRoomFullState"
                    }
                }
            ]
        },
        "game/RoomStateDef/IRoomFullState": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "id",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "displayId",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "gameType",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 3,
                    "name": "name",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 4,
                    "name": "userNum",
                    "type": {
                        "type": "Number",
                        "scalarType": "uint"
                    }
                },
                {
                    "id": 5,
                    "name": "maxUserNum",
                    "type": {
                        "type": "Number",
                        "scalarType": "uint"
                    }
                },
                {
                    "id": 6,
                    "name": "playerNum",
                    "type": {
                        "type": "Number",
                        "scalarType": "uint"
                    }
                },
                {
                    "id": 7,
                    "name": "maxPlayerNum",
                    "type": {
                        "type": "Number",
                        "scalarType": "uint"
                    }
                },
                {
                    "id": 8,
                    "name": "isPlaying",
                    "type": {
                        "type": "Boolean"
                    }
                },
                {
                    "id": 9,
                    "name": "startMatchTime",
                    "type": {
                        "type": "Number",
                        "scalarType": "uint"
                    },
                    "optional": true
                },
                {
                    "id": 10,
                    "name": "updateTime",
                    "type": {
                        "type": "Number",
                        "scalarType": "uint"
                    }
                },
                {
                    "id": 11,
                    "name": "password",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 12,
                    "name": "serverInternalUrl",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 13,
                    "name": "serverPublicUrl",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "game/PtlGetAllUserLocations/ReqGetAllUserLocations": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseRequest"
                    }
                }
            ]
        },
        "../shared/protocols/base/BaseRequest": {
            "type": "Interface"
        },
        "game/PtlGetAllUserLocations/ResGetAllUserLocations": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "locations",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Interface",
                            "properties": [
                                {
                                    "id": 0,
                                    "name": "uid",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 1,
                                    "name": "roomId",
                                    "type": {
                                        "type": "String"
                                    },
                                    "optional": true
                                },
                                {
                                    "id": 2,
                                    "name": "gameType",
                                    "type": {
                                        "type": "String"
                                    },
                                    "optional": true
                                }
                            ]
                        }
                    }
                }
            ]
        },
        "../shared/protocols/base/BaseResponse": {
            "type": "Interface"
        },
        "game/PtlGetRoomStates/ReqGetRoomStates": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseRequest"
                    }
                }
            ]
        },
        "game/PtlGetRoomStates/ResGetRoomStates": {
            "type": "Interface",
            "extends": [
                {
                    "id": 1,
                    "type": {
                        "type": "Reference",
                        "target": "game/RoomStateDef/IRoomServerInfo"
                    }
                }
            ]
        },
        "game/RoomStateDef/IRoomServerInfo": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "instanceId",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "internalUrl",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "publicUrl",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 6,
                    "name": "maxRoomNum",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 3,
                    "name": "rooms",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "game/RoomStateDef/IRoomFullState"
                        }
                    }
                },
                {
                    "id": 4,
                    "name": "supportedGameTypes",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "String"
                        }
                    }
                },
                {
                    "id": 5,
                    "name": "disabled",
                    "type": {
                        "type": "Boolean"
                    },
                    "optional": true
                },
                {
                    "id": 7,
                    "name": "lastUpdateTime",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                }
            ]
        },
        "game/PtlKickUser/ReqKickUser": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "uid",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "reason",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "game/PtlKickUser/ResKickUser": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseResponse"
                    }
                }
            ]
        },
        "master/PtlGetGameServerList/ReqGetGameServerList": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseRequest"
                    }
                }
            ]
        },
        "master/PtlGetGameServerList/ResGetGameServerList": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "serverList",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "../shared/types/ServerDef/ServerState"
                        }
                    }
                }
            ]
        },
        "../shared/types/ServerDef/ServerState": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "type",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 3,
                    "name": "interalUrl",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 4,
                    "name": "publicUrl",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 5,
                    "name": "userNum",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 6,
                    "name": "roomNum",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 8,
                    "name": "updateTimeCost",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 7,
                    "name": "lastUpdateTime",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                }
            ]
        },
        "master/PtlGetGameServerMap/ReqGetGameServerMap": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseRequest"
                    }
                }
            ]
        },
        "master/PtlGetGameServerMap/ResGetGameServerMap": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "serverMap",
                    "type": {
                        "type": "Interface",
                        "indexSignature": {
                            "keyType": "String",
                            "type": {
                                "type": "Reference",
                                "target": "../shared/types/ServerDef/ServerState"
                            }
                        }
                    }
                }
            ]
        },
        "master/PtlGetLobbyServerList/ReqGetLobbyServerList": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseRequest"
                    }
                }
            ]
        },
        "master/PtlGetLobbyServerList/ResGetLobbyServerList": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "serverList",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "../shared/types/ServerDef/ServerState"
                        }
                    }
                }
            ]
        },
        "master/PtlGetMatchServerList/ReqGetMatchServerList": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseRequest"
                    }
                }
            ]
        },
        "master/PtlGetMatchServerList/ResGetMatchServerList": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseResponse"
                    }
                }
            ]
        },
        "master/PtlGetUserLocation/ReqGetUserLocation": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "uid",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "master/PtlGetUserLocation/ResGetUserLocation": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "serverUrl",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 1,
                    "name": "roomId",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 2,
                    "name": "gameType",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "master/PtlReportServerState/ReqReportServerState": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "state",
                    "type": {
                        "type": "Reference",
                        "target": "../shared/types/ServerDef/ServerState"
                    }
                }
            ]
        },
        "master/PtlReportServerState/ResReportServerState": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseResponse"
                    }
                }
            ]
        },
        "master/PtlUpdateUserLocation/ReqUpdateUserLocation": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 4,
                    "name": "uids",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "String"
                        }
                    }
                },
                {
                    "id": 1,
                    "name": "serverUrl",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 2,
                    "name": "roomId",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 3,
                    "name": "gameType",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "master/PtlUpdateUserLocation/ResUpdateUserLocation": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseResponse"
                    }
                }
            ]
        },
        "master/PtlUserLoginPrepare/ReqUserLoginPrepare": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "uid",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "serverUrl",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "master/PtlUserLoginPrepare/ResUserLoginPrepare": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseResponse"
                    }
                }
            ]
        },
        "match/PtlCancelMatch/ReqCancelMatch": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "uid",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "match/PtlCancelMatch/ResCancelMatch": {
            "type": "Interface"
        },
        "match/PtlCreateRoomOnMinLoadServer/ReqCreateRoomOnMinLoadServer": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "uid",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "roomName",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "gameType",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 3,
                    "name": "password",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "match/PtlCreateRoomOnMinLoadServer/ResCreateRoomOnMinLoadServer": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "serverUrl",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "roomId",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "match/PtlGetRoomListByType/ReqGetRoomListByType": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "gameType",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "match/PtlGetRoomListByType/ResGetRoomListByType": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "roomList",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "game/RoomStateDef/IRoomFullState"
                        }
                    }
                }
            ]
        },
        "match/PtlGetRoomServerState/ReqGetRoomServerState": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "roomId",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "match/PtlGetRoomServerState/ResGetRoomServerState": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "state",
                    "type": {
                        "type": "Union",
                        "members": [
                            {
                                "id": 2,
                                "type": {
                                    "type": "Reference",
                                    "target": "game/RoomStateDef/IRoomFullState"
                                }
                            },
                            {
                                "id": 1,
                                "type": {
                                    "type": "Literal"
                                }
                            }
                        ]
                    }
                }
            ]
        },
        "match/PtlStartMatch/ReqStartMatch": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "uid",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "type",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "immediate",
                    "type": {
                        "type": "Boolean"
                    },
                    "optional": true
                }
            ]
        },
        "match/PtlStartMatch/ResStartMatch": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/types/GameServerAuthParams/GameServerAuthParams"
                    }
                }
            ]
        },
        "../shared/types/GameServerAuthParams/GameServerAuthParams": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "roomId",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "gameType",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "token",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 3,
                    "name": "time",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 4,
                    "name": "serverUrl",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "match/PtlUpdateRoomState/ReqUpdateRoomState": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "internalUrl",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "instanceId",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "updateRooms",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "game/RoomStateDef/IRoomUpdateState"
                        }
                    }
                },
                {
                    "id": 3,
                    "name": "deleteRooms",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "String"
                        }
                    }
                }
            ]
        },
        "game/RoomStateDef/IRoomUpdateState": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "id",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "isPlaying",
                    "type": {
                        "type": "Boolean"
                    }
                },
                {
                    "id": 2,
                    "name": "userNum",
                    "type": {
                        "type": "Number",
                        "scalarType": "uint"
                    }
                },
                {
                    "id": 3,
                    "name": "playerNum",
                    "type": {
                        "type": "Number",
                        "scalarType": "uint"
                    }
                }
            ]
        },
        "match/PtlUpdateRoomState/ResUpdateRoomState": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseResponse"
                    }
                }
            ]
        },
        "PtlCheckServerAlive/ReqCheckServerAlive": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseRequest"
                    }
                }
            ]
        },
        "PtlCheckServerAlive/ResCheckServerAlive": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../shared/protocols/base/BaseResponse"
                    }
                }
            ]
        }
    }
};