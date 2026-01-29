export default class OpeningVideoScene extends Phaser.Scene {
  constructor() {
    super({ key: 'OpeningVideoScene' });
  }

  preload() {
    this.load.video('opening', 'videos/opening.mp4');
    this.load.audio('title-bgm', 'audio/fantasy-bgm.mp3');
    // タイトルロゴ画像を読み込み
    this.load.image('title-logo', 'images/agom-title-logo.png');
  }

  create() {
    console.log('OpeningVideoScene: create started');
    
    // 動画を再生
    const video = this.add.video(640, 360, 'opening');
    video.setOrigin(0.5, 0.5);
    video.setMute(true);
    video.play();
    
    // スキップボタン
    const skipText = this.add.text(1180, 680, 'SKIP >', {
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setOrigin(1, 1);
    skipText.setInteractive({ useHandCursor: true });
    skipText.setAlpha(0.7);
    skipText.setDepth(100);
    
    skipText.on('pointerover', () => skipText.setAlpha(1));
    skipText.on('pointerout', () => skipText.setAlpha(0.7));
    
    // スキップイベント
    skipText.on('pointerdown', () => {
      video.stop();
      this.scene.start('PrologueScene');
    });
    
    // 動画終了時の処理
    video.on('complete', () => {
      skipText.destroy();
      video.setPaused(true);
      this.showTitleScreen(video);
    });
  }

  showTitleScreen(video) {
    console.log('Showing title screen overlay');
    
    // BGM開始
    const bgm = this.sound.add('title-bgm', {
      loop: true,
      volume: 0.3
    });
    bgm.play();
    
    // タイトルロゴ画像
    const titleLogo = this.add.image(640, 300, 'title-logo');
    titleLogo.setAlpha(0);
    titleLogo.setDepth(10);
    
    // サイズ調整（必要に応じて）
    // titleLogo.setScale(0.8);
    
    // クリックでスタート
    const startText = this.add.text(640, 520, 'クリックでスタート', {
      fontSize: '32px',
      color: '#ffaa00',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5);
    startText.setAlpha(0);
    startText.setDepth(10);
    
    // タイトルロゴをフェードイン
    this.tweens.add({
      targets: titleLogo,
      alpha: 1,
      duration: 1500,
      ease: 'Power2'
    });
    
    // クリックでスタートをフェードイン
    this.tweens.add({
      targets: startText,
      alpha: 1,
      duration: 1000,
      delay: 1000,
      ease: 'Power2',
      onComplete: () => {
        // 点滅アニメーション
        this.tweens.add({
          targets: startText,
          alpha: 0.3,
          duration: 1000,
          yoyo: true,
          repeat: -1
        });
      }
    });
    
    // バージョン表示
    const version = this.add.text(20, 680, 'v0.1.0 - Chokaigi 2026 Demo', {
      fontSize: '16px',
      color: '#666666'
    });
    version.setAlpha(0);
    version.setDepth(10);
    
    this.tweens.add({
      targets: version,
      alpha: 1,
      duration: 1000,
      delay: 1500
    });
    
    // クリックイベント
    this.input.on('pointerdown', () => {
      bgm.stop();
      video.destroy();
      this.scene.start('PrologueScene');
    });
  }
}
