export default class LogoScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LogoScene' });
  }

  preload() {
    this.load.image('logo', 'images/isekai-agile-logo.png');
  }

  create() {
    // 暗い背景
    const bg = this.add.rectangle(640, 360, 1280, 720, 0x000000);
    
    // ロゴ画像
    const logo = this.add.image(640, 360, 'logo');
    logo.setAlpha(0);
    
    // 「クリックして開始」テキスト
    const clickText = this.add.text(640, 600, 'クリックして開始', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5);
    clickText.setAlpha(0);
    
    // ロゴをフェードイン
    this.tweens.add({
      targets: logo,
      alpha: 1,
      duration: 1500,
      onComplete: () => {
        // クリックテキストをフェードイン
        this.tweens.add({
          targets: clickText,
          alpha: 1,
          duration: 1000,
          onComplete: () => {
            // 点滅アニメーション
            this.tweens.add({
              targets: clickText,
              alpha: 0.3,
              duration: 800,
              yoyo: true,
              repeat: -1
            });
          }
        });
      }
    });
    
    // クリックイベント
    this.input.once('pointerdown', () => {
      // 音声コンテキストを有効化
      if (this.sound.context) {
        this.sound.context.resume();
      }
      
      // フェードアウトしてオープニングへ
      this.tweens.add({
        targets: [logo, clickText],
        alpha: 0,
        duration: 1000,
        onComplete: () => {
          this.scene.stop('LogoScene');
          this.scene.start('OpeningVideoScene');
        }
      });
    });
  }
}
