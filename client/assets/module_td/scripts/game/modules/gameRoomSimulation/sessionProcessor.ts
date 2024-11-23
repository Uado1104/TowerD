// GameController.ts
export class SessionProcessor {
  private currentRound: number = 1;
  private totalRounds: number;
  private cardDrawDuration: number = 15; // 15秒抽卡时间

  constructor(totalRounds: number) {
      this.totalRounds = totalRounds;
  }

  startGame() {
      console.log('游戏开始！');
      this.startRound(this.currentRound);
  }

  startRound(round: number) {
      console.log(`第 ${round} 轮开始`);
      this.startCardDraw();
  }

  startCardDraw() {
      console.log(`抽卡时间开始，持续 ${this.cardDrawDuration} 秒`);
      setTimeout(() => {
          console.log('抽卡时间结束');
          this.startBattle();
      }, this.cardDrawDuration * 1000); // 15秒后开始战斗
  }

  private startBattle() {
      console.log('战斗阶段开始');
      this.simulateBattle(3, () => {
          console.log(`第 ${this.currentRound} 轮结束`);
          this.currentRound++;
          if (this.currentRound <= this.totalRounds) {
              this.startRound(this.currentRound);
          } else {
              console.log('游戏结束！');
          }
      });
  }

  private simulateBattle(waves: number, callback: () => void) {
      if (waves > 0) {
          console.log(`第 ${4 - waves} 波怪物开始`);
          setTimeout(() => {
              console.log(`第 ${4 - waves} 波怪物消灭`);
              this.simulateBattle(waves - 1, callback);
          }, 5000); // 每波怪物战斗持续5秒
      } else {
          callback();
      }
  }
}
