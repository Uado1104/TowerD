export interface MsgGameDataChangedPush {
    gameState?:"waiting"|"counting"|"playing"|"gameover",
    gameStateRemainingTime?: number,
    teamWeights?:{[key:number]:number},
}
