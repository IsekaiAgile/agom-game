export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    console.log('=== TitleScene: create started ===');
    
    // BGMは触らない（継続再生）
    
    // 背景
    const bg = this.add.rectangle(640, 360, 1280, 720, 0x1a0a2a);
    
    // タイトルロゴ
    const title = this.add.text(640, 200, '異世界アジャイル', {
      fontSize: '72px',
      color: '#ff6600',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    const subtitle = this.add.text(640, 280, '〜炎の王国アガイルド〜', {
      fontSize: '36px',
      color: '#ffdd00',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5);
    
    // スタートボタン
    const startButton = this.add.rectangle(640, 450, 300, 80, 0xff6600);
    startButton.setStrokeStyle(5, 0xffffff);
    startButton.setInteractive({ useHandCursor: true });
    
    const startText = this.add.text(640, 450, 'スタート', {
      fontSize: '36px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // ボタンのホバーエフェクト
    startButton.on('pointerover', () => {
      startButton.setFillStyle(0xffaa00);
    });
    
    startButton.on('pointerout', () => {
      startButton.setFillStyle(0xff6600);
    });
    
    // クリックでゲーム開始
    startButton.on('pointerdown', () => {
      this.startGame();
    });
    
    // ボタンを光らせる
    this.tweens.add({
      targets: startButton,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    console.log('=== TitleScene: create finished ===');
  }

  startGame() {
    console.log('=== TitleScene: Starting game ===');
    
    // ここでBGMを停止
    const bgm = this.game.registry.get('openingBGM');
    if (bgm) {
      bgm.stop();
      this.game.registry.set('openingBGM', null);
      console.log('Opening BGM stopped');
    }
    
    // フェードアウト
    this.cameras.main.fadeOut(1000, 0, 0, 0);
    
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.stop('TitleScene');
      this.scene.start('PrologueScene');
    });
  }
}