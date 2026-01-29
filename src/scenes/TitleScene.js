export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  preload() {
    // タイトル背景画像（後で追加）
    // this.load.image('title-bg', 'images/title-bg.png');
    
    // BGM
    this.load.audio('title-bgm', 'audio/fantasy-bgm.mp3');
  }

  create() {
    // 背景（とりあえずグラデーション）
    const bg = this.add.rectangle(640, 360, 1280, 720, 0x2a1a3e);
    
    // タイトルロゴ
    const title = this.add.text(640, 250, 'AGOM', {
      fontSize: '120px',
      color: '#ff6400',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    const subtitle = this.add.text(640, 350, 'アガイルドの炎', {
      fontSize: '48px',
      color: '#ffffff',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5);
    
    // クリックでスタート（点滅）
    const startText = this.add.text(640, 500, 'クリックでスタート', {
      fontSize: '32px',
      color: '#ffaa00',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: startText,
      alpha: 0.3,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
    
    // BGM再生
    const bgm = this.sound.add('title-bgm', {
      loop: true,
      volume: 0.3
    });
    bgm.play();
    
    // クリックイベント
    this.input.on('pointerdown', () => {
      // BGM停止
      bgm.stop();
      
      // プロローグへ
      this.scene.start('PrologueScene');
    });
    
    // バージョン表示
    this.add.text(20, 680, 'v0.1.0 - Chokaigi 2026 Demo', {
      fontSize: '16px',
      color: '#666666'
    });
  }
}
