export default class LogoScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LogoScene' });
  }

  preload() {
    // ロゴ画像を読み込み
    this.load.image('logo', 'images/isekai-agile-logo.png');
  }

  create() {
    // 暗い背景
    const bg = this.add.rectangle(640, 360, 1280, 720, 0x000000);
    
    // ロゴ画像
    const logo = this.add.image(640, 360, 'logo');
    
    // 画面サイズに合わせてスケール調整（必要に応じて）
    // logo.setScale(0.5); // ロゴが大きすぎる場合
    
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
              // オープニング動画へ
              this.scene.start('OpeningVideoScene');
            }
          });
        });
      }
    });
  }
}
