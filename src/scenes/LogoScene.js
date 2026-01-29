export default class LogoScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LogoScene' });
  }

  preload() {
    // ロゴ画像（後で追加）
    // this.load.image('logo', 'images/isekai-agile-logo.png');
  }

  create() {
    // 暗い背景
    const bg = this.add.rectangle(640, 360, 1280, 720, 0x000000);
    
    // ロゴテキスト（画像ができるまでの仮）
    const logo = this.add.text(640, 360, '異世界アジャイル', {
      fontSize: '64px',
      color: '#ff6400',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    logo.setAlpha(0);
    
    // フェードイン
    this.tweens.add({
      targets: logo,
      alpha: 1,
      duration: 1500,
      onComplete: () => {
        // 2秒待機
        this.time.delayedCall(2000, () => {
          // フェードアウト
          this.tweens.add({
            targets: logo,
            alpha: 0,
            duration: 1500,
            onComplete: () => {
              // タイトル画面へ
              this.scene.start('TitleScene');
            }
          });
        });
      }
    });
  }
}
