export default class DebugMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DebugMenuScene' });
  }

  create(data) {
    this.previousScene = data.previousScene || 'PrologueScene';
    
    // 背景（半透明の黒）
    const bg = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.8);
    
    // タイトル
    const title = this.add.text(640, 100, 'デバッグメニュー', {
      fontSize: '48px',
      color: '#ff6400',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // シーン選択ボタン
    this.createButton(640, 200, 'ロゴ', () => {
      this.scene.stop();
      this.scene.start('LogoScene');
    });
    
    this.createButton(640, 280, 'OP動画', () => {
      this.scene.stop();
      this.scene.start('OpeningVideoScene');
    });
    
    this.createButton(640, 360, 'タイトル', () => {
      this.scene.stop();
      this.scene.start('TitleScene');
    });
    
    const prologueButton = this.createButton(640, 440, 'プロローグ', () => {
      this.scene.stop();
      this.scene.start('PrologueScene');
    });
    
    const trialButton = this.createButton(640, 520, '試練の間', () => {
      this.scene.stop();
      this.scene.start('TrialScene');
    });
    
    // 戻るボタン
    const backButton = this.createButton(640, 600, '戻る', () => {
      this.scene.stop();
      this.scene.resume(this.previousScene);
    });
    
    // ESCキーで閉じる
    this.input.keyboard.once('keydown-ESC', () => {
      this.scene.stop();
      this.scene.resume(this.previousScene);
    });
  }

  createButton(x, y, text, callback) {
    const button = this.add.rectangle(x, y, 400, 60, 0xff6400);
    button.setInteractive({ useHandCursor: true });
    
    const buttonText = this.add.text(x, y, text, {
      fontSize: '28px',
      color: '#000000',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    button.on('pointerover', () => {
      button.setFillStyle(0xffaa00);
    });
    
    button.on('pointerout', () => {
      button.setFillStyle(0xff6400);
    });
    
    button.on('pointerdown', callback);
    
    return button;
  }
}
