import Phaser from 'phaser';

export default class EligiaTitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EligiaTitleScene' });
  }

  create() {
    console.log('=== EligiaTitleScene: create started ===');
    
    // 暗い背景
    const bg = this.add.rectangle(640, 360, 1280, 720, 0x1a1a2e);
    
    // タイトル（日本語）
    const titleJP = this.add.text(640, 280, 'エリージア', {
      fontSize: '96px',
      color: '#4444aa',
      fontFamily: 'sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 10
    }).setOrigin(0.5);
    titleJP.setAlpha(0);
    
    // サブタイトル
    const subtitle = this.add.text(640, 380, '〜停滞の国〜', {
      fontSize: '48px',
      color: '#6666cc',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    subtitle.setAlpha(0);
    
    // 英語タイトル
    const titleEN = this.add.text(640, 460, 'Eligia: Land of Stagnation', {
      fontSize: '32px',
      color: '#8888dd',
      fontFamily: 'serif',
      fontStyle: 'italic'
    }).setOrigin(0.5);
    titleEN.setAlpha(0);
    
    // 小さく説明（Agile の逆）
    const hint = this.add.text(640, 520, '(Agile を逆から読むと...)', {
      fontSize: '20px',
      color: '#666699',
      fontFamily: 'sans-serif',
      fontStyle: 'italic'
    }).setOrigin(0.5);
    hint.setAlpha(0);
    
    // フェードイン
    this.tweens.add({
      targets: titleJP,
      alpha: 1,
      scale: 1.1,
      duration: 2000,
      ease: 'Power2'
    });
    
    this.tweens.add({
      targets: subtitle,
      alpha: 1,
      duration: 2000,
      delay: 500,
      ease: 'Power2'
    });
    
    this.tweens.add({
      targets: titleEN,
      alpha: 1,
      duration: 2000,
      delay: 1000,
      ease: 'Power2'
    });
    
    this.tweens.add({
      targets: hint,
      alpha: 0.6,
      duration: 2000,
      delay: 1500,
      ease: 'Power2'
    });
    
    // 4秒後にフェードアウト
    this.time.delayedCall(5000, () => {
      this.tweens.add({
        targets: [titleJP, subtitle, titleEN, hint],
        alpha: 0,
        duration: 1500,
        onComplete: () => {
          console.log('=== Transitioning to DarknessScene ===');
          this.scene.stop('EligiaTitleScene');
          this.scene.start('DarknessScene');
        }
      });
    });
  }
}
