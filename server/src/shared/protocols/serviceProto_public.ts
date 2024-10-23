import { ServiceProto } from 'tsrpc-proto';
import { MsgChat } from './public/chat/MsgChat';
import { ReqSendChat, ResSendChat } from './public/chat/PtlSendChat';
import { MsgCellDataChange } from './public/game/MsgCellDataChange';
import { MsgFoodAddedPush } from './public/game/MsgFoodAddedPush';
import { MsgFoodEatenPush } from './public/game/MsgFoodEatenPush';
import { MsgGameBeginPush } from './public/game/MsgGameBeginPush';
import { MsgGameDataChangedPush } from './public/game/MsgGameDataChangedPush';
import { MsgGameDataSyncPush } from './public/game/MsgGameDataSyncPush';
import { MsgGameOverPush } from './public/game/MsgGameOverPush';
import { MsgPlayerComesPush } from './public/game/MsgPlayerComesPush';
import { MsgPlayerDataChangedPush } from './public/game/MsgPlayerDataChangedPush';
import { MsgPlayerLeavesPush } from './public/game/MsgPlayerLeavesPush';
import { ReqAuthClient, ResAuthClient } from './public/game/PtlAuthClient';
import { ReqClearAllMails, ResClearAllMails } from './public/lobby/mail/PtlClearAllMails';
import { ReqDeleteMail, ResDeleteMail } from './public/lobby/mail/PtlDeleteMail';
import { ReqGetMails, ResGetMails } from './public/lobby/mail/PtlGetMails';
import { ReqMarkAllAsRead, ResMarkAllAsRead } from './public/lobby/mail/PtlMarkAllAsRead';
import { ReqMarkAsRead, ResMarkAsRead } from './public/lobby/mail/PtlMarkAsRead';
import { ReqAuth, ResAuth } from './public/lobby/PtlAuth';
import { ReqCancelMatch, ResCancelMatch } from './public/lobby/PtlCancelMatch';
import { ReqCreateRole, ResCreateRole } from './public/lobby/PtlCreateRole';
import { ReqCreateRoom, ResCreateRoom } from './public/lobby/PtlCreateRoom';
import { ReqGetAnnouncement, ResGetAnnouncement } from './public/lobby/PtlGetAnnouncement';
import { ReqGetBasicConfig, ResGetBasicConfig } from './public/lobby/PtlGetBasicConfig';
import { ReqGetNotice, ResGetNotice } from './public/lobby/PtlGetNotice';
import { ReqGetUserInfo, ResGetUserInfo } from './public/lobby/PtlGetUserInfo';
import { ReqModifyUserInfo, ResModifyUserInfo } from './public/lobby/PtlModifyUserInfo';
import { ReqStartMatch, ResStartMatch } from './public/lobby/PtlStartMatch';
import { ReqTryEnterRoom, ResTryEnterRoom } from './public/lobby/PtlTryEnterRoom';
import { ReqLogin, ResLogin } from './public/login/PtlLogin';
import { ReqRegister, ResRegister } from './public/login/PtlRegister';
import { MsgPing } from './public/MsgPing';
import { MsgPong } from './public/MsgPong';
import { MsgRoomClosed } from './public/room/MsgRoomClosed';
import { MsgRoomDataChangedPush } from './public/room/MsgRoomDataChangedPush';
import { MsgRoomDataSyncPush } from './public/room/MsgRoomDataSyncPush';
import { MsgRoomDismissedPush } from './public/room/MsgRoomDismissedPush';
import { MsgUserComesToRoomPush } from './public/room/MsgUserComesToRoomPush';
import { MsgUserDataChangedPush } from './public/room/MsgUserDataChangedPush';
import { MsgUserInfoChangedPush } from './public/room/MsgUserInfoChangedPush';
import { MsgUserLeavesFromRoomPush } from './public/room/MsgUserLeavesFromRoomPush';
import { ReqExitRoom, ResExitRoom } from './public/room/PtlExitRoom';
import { ReqReady, ResReady } from './public/room/PtlReady';

export interface ServiceType {
    api: {
        "chat/SendChat": {
            req: ReqSendChat,
            res: ResSendChat
        },
        "game/AuthClient": {
            req: ReqAuthClient,
            res: ResAuthClient
        },
        "lobby/mail/ClearAllMails": {
            req: ReqClearAllMails,
            res: ResClearAllMails
        },
        "lobby/mail/DeleteMail": {
            req: ReqDeleteMail,
            res: ResDeleteMail
        },
        "lobby/mail/GetMails": {
            req: ReqGetMails,
            res: ResGetMails
        },
        "lobby/mail/MarkAllAsRead": {
            req: ReqMarkAllAsRead,
            res: ResMarkAllAsRead
        },
        "lobby/mail/MarkAsRead": {
            req: ReqMarkAsRead,
            res: ResMarkAsRead
        },
        "lobby/Auth": {
            req: ReqAuth,
            res: ResAuth
        },
        "lobby/CancelMatch": {
            req: ReqCancelMatch,
            res: ResCancelMatch
        },
        "lobby/CreateRole": {
            req: ReqCreateRole,
            res: ResCreateRole
        },
        "lobby/CreateRoom": {
            req: ReqCreateRoom,
            res: ResCreateRoom
        },
        "lobby/GetAnnouncement": {
            req: ReqGetAnnouncement,
            res: ResGetAnnouncement
        },
        "lobby/GetBasicConfig": {
            req: ReqGetBasicConfig,
            res: ResGetBasicConfig
        },
        "lobby/GetNotice": {
            req: ReqGetNotice,
            res: ResGetNotice
        },
        "lobby/GetUserInfo": {
            req: ReqGetUserInfo,
            res: ResGetUserInfo
        },
        "lobby/ModifyUserInfo": {
            req: ReqModifyUserInfo,
            res: ResModifyUserInfo
        },
        "lobby/StartMatch": {
            req: ReqStartMatch,
            res: ResStartMatch
        },
        "lobby/TryEnterRoom": {
            req: ReqTryEnterRoom,
            res: ResTryEnterRoom
        },
        "login/Login": {
            req: ReqLogin,
            res: ResLogin
        },
        "login/Register": {
            req: ReqRegister,
            res: ResRegister
        },
        "room/ExitRoom": {
            req: ReqExitRoom,
            res: ResExitRoom
        },
        "room/Ready": {
            req: ReqReady,
            res: ResReady
        }
    },
    msg: {
        "chat/Chat": MsgChat,
        "game/CellDataChange": MsgCellDataChange,
        "game/FoodAddedPush": MsgFoodAddedPush,
        "game/FoodEatenPush": MsgFoodEatenPush,
        "game/GameBeginPush": MsgGameBeginPush,
        "game/GameDataChangedPush": MsgGameDataChangedPush,
        "game/GameDataSyncPush": MsgGameDataSyncPush,
        "game/GameOverPush": MsgGameOverPush,
        "game/PlayerComesPush": MsgPlayerComesPush,
        "game/PlayerDataChangedPush": MsgPlayerDataChangedPush,
        "game/PlayerLeavesPush": MsgPlayerLeavesPush,
        "Ping": MsgPing,
        "Pong": MsgPong,
        "room/RoomClosed": MsgRoomClosed,
        "room/RoomDataChangedPush": MsgRoomDataChangedPush,
        "room/RoomDataSyncPush": MsgRoomDataSyncPush,
        "room/RoomDismissedPush": MsgRoomDismissedPush,
        "room/UserComesToRoomPush": MsgUserComesToRoomPush,
        "room/UserDataChangedPush": MsgUserDataChangedPush,
        "room/UserInfoChangedPush": MsgUserInfoChangedPush,
        "room/UserLeavesFromRoomPush": MsgUserLeavesFromRoomPush
    }
}

export const serviceProto: ServiceProto<ServiceType> = {
    "version": 64,
    "services": [
        {
            "id": 11,
            "name": "chat/Chat",
            "type": "msg"
        },
        {
            "id": 12,
            "name": "chat/SendChat",
            "type": "api",
            "conf": {}
        },
        {
            "id": 77,
            "name": "game/CellDataChange",
            "type": "msg"
        },
        {
            "id": 78,
            "name": "game/FoodAddedPush",
            "type": "msg"
        },
        {
            "id": 79,
            "name": "game/FoodEatenPush",
            "type": "msg"
        },
        {
            "id": 80,
            "name": "game/GameBeginPush",
            "type": "msg"
        },
        {
            "id": 81,
            "name": "game/GameDataChangedPush",
            "type": "msg"
        },
        {
            "id": 82,
            "name": "game/GameDataSyncPush",
            "type": "msg"
        },
        {
            "id": 83,
            "name": "game/GameOverPush",
            "type": "msg"
        },
        {
            "id": 84,
            "name": "game/PlayerComesPush",
            "type": "msg"
        },
        {
            "id": 85,
            "name": "game/PlayerDataChangedPush",
            "type": "msg"
        },
        {
            "id": 86,
            "name": "game/PlayerLeavesPush",
            "type": "msg"
        },
        {
            "id": 91,
            "name": "game/AuthClient",
            "type": "api"
        },
        {
            "id": 22,
            "name": "lobby/mail/ClearAllMails",
            "type": "api"
        },
        {
            "id": 23,
            "name": "lobby/mail/DeleteMail",
            "type": "api"
        },
        {
            "id": 24,
            "name": "lobby/mail/GetMails",
            "type": "api"
        },
        {
            "id": 25,
            "name": "lobby/mail/MarkAllAsRead",
            "type": "api"
        },
        {
            "id": 26,
            "name": "lobby/mail/MarkAsRead",
            "type": "api"
        },
        {
            "id": 104,
            "name": "lobby/Auth",
            "type": "api"
        },
        {
            "id": 28,
            "name": "lobby/CancelMatch",
            "type": "api"
        },
        {
            "id": 105,
            "name": "lobby/CreateRole",
            "type": "api"
        },
        {
            "id": 65,
            "name": "lobby/CreateRoom",
            "type": "api"
        },
        {
            "id": 31,
            "name": "lobby/GetAnnouncement",
            "type": "api"
        },
        {
            "id": 93,
            "name": "lobby/GetBasicConfig",
            "type": "api",
            "conf": {}
        },
        {
            "id": 32,
            "name": "lobby/GetNotice",
            "type": "api"
        },
        {
            "id": 33,
            "name": "lobby/GetUserInfo",
            "type": "api"
        },
        {
            "id": 36,
            "name": "lobby/ModifyUserInfo",
            "type": "api"
        },
        {
            "id": 37,
            "name": "lobby/StartMatch",
            "type": "api"
        },
        {
            "id": 72,
            "name": "lobby/TryEnterRoom",
            "type": "api"
        },
        {
            "id": 39,
            "name": "login/Login",
            "type": "api"
        },
        {
            "id": 40,
            "name": "login/Register",
            "type": "api"
        },
        {
            "id": 62,
            "name": "Ping",
            "type": "msg"
        },
        {
            "id": 90,
            "name": "Pong",
            "type": "msg"
        },
        {
            "id": 94,
            "name": "room/RoomClosed",
            "type": "msg"
        },
        {
            "id": 95,
            "name": "room/RoomDataChangedPush",
            "type": "msg"
        },
        {
            "id": 96,
            "name": "room/RoomDataSyncPush",
            "type": "msg"
        },
        {
            "id": 97,
            "name": "room/RoomDismissedPush",
            "type": "msg"
        },
        {
            "id": 98,
            "name": "room/UserComesToRoomPush",
            "type": "msg"
        },
        {
            "id": 99,
            "name": "room/UserDataChangedPush",
            "type": "msg"
        },
        {
            "id": 100,
            "name": "room/UserInfoChangedPush",
            "type": "msg"
        },
        {
            "id": 101,
            "name": "room/UserLeavesFromRoomPush",
            "type": "msg"
        },
        {
            "id": 102,
            "name": "room/ExitRoom",
            "type": "api",
            "conf": {}
        },
        {
            "id": 103,
            "name": "room/Ready",
            "type": "api",
            "conf": {}
        }
    ],
    "types": {
        "chat/MsgChat/MsgChat": {
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
                        "target": "../../types/UserInfo/UserInfo"
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
        "../../types/UserInfo/UserInfo": {
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
        "chat/PtlSendChat/ReqSendChat": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "channel",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 1,
                    "name": "content",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "../base/BaseRequest": {
            "type": "Interface"
        },
        "chat/PtlSendChat/ResSendChat": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../base/BaseResponse"
                    }
                }
            ]
        },
        "../base/BaseResponse": {
            "type": "Interface"
        },
        "game/MsgCellDataChange/MsgCellDataChange": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "playerId",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 1,
                    "name": "transform",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Number"
                        }
                    },
                    "optional": true
                },
                {
                    "id": 2,
                    "name": "forceSync",
                    "type": {
                        "type": "Boolean"
                    },
                    "optional": true
                },
                {
                    "id": 3,
                    "name": "weight",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 4,
                    "name": "radius",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 5,
                    "name": "speed",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 6,
                    "name": "state",
                    "type": {
                        "type": "Union",
                        "members": [
                            {
                                "id": 0,
                                "type": {
                                    "type": "Literal",
                                    "literal": ""
                                }
                            },
                            {
                                "id": 1,
                                "type": {
                                    "type": "Literal",
                                    "literal": "moving"
                                }
                            }
                        ]
                    },
                    "optional": true
                },
                {
                    "id": 7,
                    "name": "protectedTime",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                }
            ]
        },
        "game/MsgFoodAddedPush/MsgFoodAddedPush": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "foods",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "game/GameTypeDef/IFood"
                        }
                    }
                }
            ]
        },
        "game/GameTypeDef/IFood": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "id",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "x",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "y",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 3,
                    "name": "type",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 5,
                    "name": "color",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 4,
                    "name": "radius",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "game/MsgFoodEatenPush/MsgFoodEatenPush": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "eatenFoods",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Number"
                        }
                    }
                }
            ]
        },
        "game/MsgGameBeginPush/MsgGameBeginPush": {
            "type": "Interface"
        },
        "game/MsgGameDataChangedPush/MsgGameDataChangedPush": {
            "type": "Interface",
            "properties": [
                {
                    "id": 1,
                    "name": "gameState",
                    "type": {
                        "type": "Union",
                        "members": [
                            {
                                "id": 0,
                                "type": {
                                    "type": "Literal",
                                    "literal": "waiting"
                                }
                            },
                            {
                                "id": 1,
                                "type": {
                                    "type": "Literal",
                                    "literal": "counting"
                                }
                            },
                            {
                                "id": 2,
                                "type": {
                                    "type": "Literal",
                                    "literal": "playing"
                                }
                            },
                            {
                                "id": 4,
                                "type": {
                                    "type": "Literal",
                                    "literal": "gameover"
                                }
                            }
                        ]
                    },
                    "optional": true
                },
                {
                    "id": 2,
                    "name": "gameStateRemainingTime",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 3,
                    "name": "teamWeights",
                    "type": {
                        "type": "Interface",
                        "indexSignature": {
                            "keyType": "Number",
                            "type": {
                                "type": "Number"
                            }
                        }
                    },
                    "optional": true
                }
            ]
        },
        "game/MsgGameDataSyncPush/MsgGameDataSyncPush": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "data",
                    "type": {
                        "type": "Reference",
                        "target": "game/GameTypeDef/IGameData"
                    }
                }
            ]
        },
        "game/GameTypeDef/IGameData": {
            "type": "Interface",
            "properties": [
                {
                    "id": 7,
                    "name": "defaultPlayerCellRadius",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 8,
                    "name": "mapWidth",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 9,
                    "name": "mapHeight",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "gameState",
                    "type": {
                        "type": "Union",
                        "members": [
                            {
                                "id": 0,
                                "type": {
                                    "type": "Literal",
                                    "literal": "waiting"
                                }
                            },
                            {
                                "id": 1,
                                "type": {
                                    "type": "Literal",
                                    "literal": "counting"
                                }
                            },
                            {
                                "id": 2,
                                "type": {
                                    "type": "Literal",
                                    "literal": "playing"
                                }
                            },
                            {
                                "id": 4,
                                "type": {
                                    "type": "Literal",
                                    "literal": "gameover"
                                }
                            }
                        ]
                    }
                },
                {
                    "id": 3,
                    "name": "gameStateRemainingTime",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 0,
                    "name": "players",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "game/GameTypeDef/IGamePlayer"
                        }
                    }
                },
                {
                    "id": 1,
                    "name": "foodList",
                    "type": {
                        "type": "Interface",
                        "indexSignature": {
                            "keyType": "Number",
                            "type": {
                                "type": "Reference",
                                "target": "game/GameTypeDef/IFood"
                            }
                        }
                    }
                },
                {
                    "id": 6,
                    "name": "teamsWeights",
                    "type": {
                        "type": "Interface",
                        "indexSignature": {
                            "keyType": "Number",
                            "type": {
                                "type": "Number"
                            }
                        }
                    }
                }
            ]
        },
        "game/GameTypeDef/IGamePlayer": {
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
                    "name": "color",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "playerId",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 3,
                    "name": "roleName",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 12,
                    "name": "location",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 16,
                    "name": "transform",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Number"
                        }
                    }
                },
                {
                    "id": 8,
                    "name": "reviveTime",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 15,
                    "name": "protectedTime",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 9,
                    "name": "weight",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 10,
                    "name": "radius",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 11,
                    "name": "speed",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 13,
                    "name": "teamId",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 14,
                    "name": "state",
                    "type": {
                        "type": "Union",
                        "members": [
                            {
                                "id": 0,
                                "type": {
                                    "type": "Literal",
                                    "literal": ""
                                }
                            },
                            {
                                "id": 1,
                                "type": {
                                    "type": "Literal",
                                    "literal": "moving"
                                }
                            }
                        ]
                    }
                }
            ]
        },
        "game/MsgGameOverPush/MsgGameOverPush": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "winner",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "game/MsgPlayerComesPush/MsgPlayerComesPush": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "player",
                    "type": {
                        "type": "Reference",
                        "target": "game/GameTypeDef/IGamePlayer"
                    }
                }
            ]
        },
        "game/MsgPlayerDataChangedPush/MsgPlayerDataChangedPush": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "playerId",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "reviveTime",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 2,
                    "name": "weight",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                }
            ]
        },
        "game/MsgPlayerLeavesPush/MsgPlayerLeavesPush": {
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
        "game/PtlAuthClient/ReqAuthClient": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "sign",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "uid",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "time",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 3,
                    "name": "roomId",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 4,
                    "name": "gameType",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 5,
                    "name": "roleName",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "game/PtlAuthClient/ResAuthClient": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "user",
                    "type": {
                        "type": "Reference",
                        "target": "../../types/UserInfo/UserInfo"
                    }
                }
            ]
        },
        "lobby/mail/PtlClearAllMails/ReqClearAllMails": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "token",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "lobby/mail/PtlClearAllMails/ResClearAllMails": {
            "type": "Interface"
        },
        "lobby/mail/PtlDeleteMail/ReqDeleteMail": {
            "type": "Interface",
            "properties": [
                {
                    "id": 2,
                    "name": "token",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 1,
                    "name": "mailId",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "lobby/mail/PtlDeleteMail/ResDeleteMail": {
            "type": "Interface"
        },
        "lobby/mail/PtlGetMails/ReqGetMails": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "token",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "lobby/mail/PtlGetMails/ResGetMails": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "mails",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Interface",
                            "properties": [
                                {
                                    "id": 0,
                                    "name": "mailId",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 1,
                                    "name": "uid",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 2,
                                    "name": "from",
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
                                    "name": "title",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 5,
                                    "name": "content",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 6,
                                    "name": "state",
                                    "type": {
                                        "type": "String"
                                    }
                                }
                            ]
                        }
                    }
                }
            ]
        },
        "lobby/mail/PtlMarkAllAsRead/ReqMarkAllAsRead": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "token",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "lobby/mail/PtlMarkAllAsRead/ResMarkAllAsRead": {
            "type": "Interface"
        },
        "lobby/mail/PtlMarkAsRead/ReqMarkAsRead": {
            "type": "Interface",
            "properties": [
                {
                    "id": 2,
                    "name": "token",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 1,
                    "name": "mailId",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "lobby/mail/PtlMarkAsRead/ResMarkAsRead": {
            "type": "Interface"
        },
        "lobby/PtlAuth/ReqAuth": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "token",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "uid",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "time",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 3,
                    "name": "sign",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "lobby/PtlAuth/ResAuth": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "userInfo",
                    "type": {
                        "type": "Reference",
                        "target": "../../types/UserInfo/UserInfo"
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
        "lobby/PtlCancelMatch/ReqCancelMatch": {
            "type": "Interface"
        },
        "lobby/PtlCancelMatch/ResCancelMatch": {
            "type": "Interface"
        },
        "lobby/PtlCreateRole/ReqCreateRole": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "token",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 1,
                    "name": "name",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "visualId",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "lobby/PtlCreateRole/ResCreateRole": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "name",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "visualId",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "lobby/PtlCreateRoom/ReqCreateRoom": {
            "type": "Interface",
            "properties": [
                {
                    "id": 4,
                    "name": "roomName",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 5,
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
        "lobby/PtlCreateRoom/ResCreateRoom": {
            "type": "Interface",
            "properties": [
                {
                    "id": 3,
                    "name": "enterRoomParams",
                    "type": {
                        "type": "Reference",
                        "target": "../../types/GameServerAuthParams/GameServerAuthParams"
                    }
                }
            ]
        },
        "../../types/GameServerAuthParams/GameServerAuthParams": {
            "type": "Interface",
            "properties": [
                {
                    "id": 5,
                    "name": "roomId",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 6,
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
        "lobby/PtlGetAnnouncement/ReqGetAnnouncement": {
            "type": "Interface",
            "properties": [
                {
                    "id": 2,
                    "name": "token",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 1,
                    "name": "type",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "lobby/PtlGetAnnouncement/ResGetAnnouncement": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "content",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "lobby/PtlGetBasicConfig/ReqGetBasicConfig": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "token",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "lobby/PtlGetBasicConfig/ResGetBasicConfig": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../../configs/BasicConfig/BasicConfig"
                    }
                }
            ]
        },
        "../../configs/BasicConfig/BasicConfig": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "userInfoModifyCost",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "lobby/PtlGetNotice/ReqGetNotice": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "token",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "lobby/PtlGetNotice/ResGetNotice": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "noticeList",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Interface",
                            "properties": [
                                {
                                    "id": 0,
                                    "name": "title",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 1,
                                    "name": "content",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 2,
                                    "name": "contentType",
                                    "type": {
                                        "type": "String"
                                    }
                                }
                            ]
                        }
                    }
                }
            ]
        },
        "lobby/PtlGetUserInfo/ReqGetUserInfo": {
            "type": "Interface",
            "properties": [
                {
                    "id": 3,
                    "name": "token",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 1,
                    "name": "uid",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 2,
                    "name": "uids",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "String"
                        }
                    },
                    "optional": true
                }
            ]
        },
        "lobby/PtlGetUserInfo/ResGetUserInfo": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "infos",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "../../types/UserInfo/UserInfo"
                        }
                    }
                }
            ]
        },
        "lobby/PtlModifyUserInfo/ReqModifyUserInfo": {
            "type": "Interface",
            "properties": [
                {
                    "id": 3,
                    "name": "token",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 1,
                    "name": "gender",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 2,
                    "name": "introduction",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "lobby/PtlModifyUserInfo/ResModifyUserInfo": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "gender",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 1,
                    "name": "introduction",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "lobby/PtlStartMatch/ReqStartMatch": {
            "type": "Interface",
            "properties": [
                {
                    "id": 3,
                    "name": "token",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
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
        "lobby/PtlStartMatch/ResStartMatch": {
            "type": "Interface",
            "extends": [
                {
                    "id": 1,
                    "type": {
                        "type": "Reference",
                        "target": "../../types/GameServerAuthParams/GameServerAuthParams"
                    }
                }
            ]
        },
        "lobby/PtlTryEnterRoom/ReqTryEnterRoom": {
            "type": "Interface",
            "properties": [
                {
                    "id": 2,
                    "name": "token",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 0,
                    "name": "id",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "password",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "lobby/PtlTryEnterRoom/ResTryEnterRoom": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../../types/GameServerAuthParams/GameServerAuthParams"
                    }
                }
            ]
        },
        "login/PtlLogin/ReqLogin": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "account",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "password",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "login/PtlLogin/ResLogin": {
            "type": "Interface",
            "properties": [
                {
                    "id": 4,
                    "name": "token",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 5,
                    "name": "uid",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 6,
                    "name": "time",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 7,
                    "name": "sign",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 8,
                    "name": "lobbyUrl",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "login/PtlRegister/ReqRegister": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "account",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "password",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "login/PtlRegister/ResRegister": {
            "type": "Interface"
        },
        "MsgPing/MsgPing": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "timestamp",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "MsgPong/MsgPong": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "timestamp",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "room/MsgRoomClosed/MsgRoomClosed": {
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
                }
            ]
        },
        "room/MsgRoomDataChangedPush/MsgRoomDataChangedPush": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "name",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 1,
                    "name": "maxUser",
                    "type": {
                        "type": "Number",
                        "scalarType": "uint"
                    },
                    "optional": true
                },
                {
                    "id": 2,
                    "name": "userList",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "../../types/RoomData/IUserData"
                        }
                    },
                    "optional": true
                },
                {
                    "id": 3,
                    "name": "maxPlayer",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 4,
                    "name": "numPlayer",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 5,
                    "name": "isPlaying",
                    "type": {
                        "type": "Boolean"
                    },
                    "optional": true
                }
            ]
        },
        "../../types/RoomData/IUserData": {
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
                    "id": 4,
                    "name": "name",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 5,
                    "name": "visualId",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 6,
                    "name": "gender",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 1,
                    "name": "ready",
                    "type": {
                        "type": "Boolean"
                    },
                    "optional": true
                },
                {
                    "id": 2,
                    "name": "playerId",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 3,
                    "name": "isOnline",
                    "type": {
                        "type": "Boolean"
                    },
                    "optional": true
                }
            ]
        },
        "room/MsgRoomDataSyncPush/MsgRoomDataSyncPush": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "data",
                    "type": {
                        "type": "Reference",
                        "target": "../../types/RoomData/IRoomData"
                    }
                }
            ]
        },
        "../../types/RoomData/IRoomData": {
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
                    "id": 9,
                    "name": "gameType",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "name",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 3,
                    "name": "maxUser",
                    "type": {
                        "type": "Number",
                        "scalarType": "uint"
                    }
                },
                {
                    "id": 4,
                    "name": "userList",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "../../types/RoomData/IUserData"
                        }
                    }
                },
                {
                    "id": 5,
                    "name": "maxPlayerNum",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 6,
                    "name": "playerNum",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 7,
                    "name": "isPlaying",
                    "type": {
                        "type": "Boolean"
                    }
                },
                {
                    "id": 8,
                    "name": "messages",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Interface",
                            "properties": [
                                {
                                    "id": 0,
                                    "name": "channel",
                                    "type": {
                                        "type": "String"
                                    },
                                    "optional": true
                                },
                                {
                                    "id": 1,
                                    "name": "user",
                                    "type": {
                                        "type": "Reference",
                                        "target": "../../types/UserInfo/UserInfo"
                                    }
                                },
                                {
                                    "id": 2,
                                    "name": "time",
                                    "type": {
                                        "type": "Date"
                                    }
                                },
                                {
                                    "id": 3,
                                    "name": "content",
                                    "type": {
                                        "type": "String"
                                    }
                                }
                            ]
                        }
                    }
                }
            ]
        },
        "room/MsgRoomDismissedPush/MsgRoomDismissedPush": {
            "type": "Interface"
        },
        "room/MsgUserComesToRoomPush/MsgUserComesToRoomPush": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../../types/RoomData/IUserData"
                    }
                }
            ]
        },
        "room/MsgUserDataChangedPush/MsgUserDataChangedPush": {
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
                    "name": "ready",
                    "type": {
                        "type": "Boolean"
                    },
                    "optional": true
                },
                {
                    "id": 2,
                    "name": "playerId",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 3,
                    "name": "isOnline",
                    "type": {
                        "type": "Boolean"
                    },
                    "optional": true
                }
            ]
        },
        "room/MsgUserInfoChangedPush/MsgUserInfoChangedPush": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../../types/UserInfo/UserInfo"
                    }
                }
            ]
        },
        "room/MsgUserLeavesFromRoomPush/MsgUserLeavesFromRoomPush": {
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
        "room/PtlExitRoom/ReqExitRoom": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../base/BaseRequest"
                    }
                }
            ]
        },
        "room/PtlExitRoom/ResExitRoom": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../base/BaseResponse"
                    }
                }
            ]
        },
        "room/PtlReady/ReqReady": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../base/BaseRequest"
                    }
                }
            ]
        },
        "room/PtlReady/ResReady": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../base/BaseResponse"
                    }
                }
            ]
        }
    }
};