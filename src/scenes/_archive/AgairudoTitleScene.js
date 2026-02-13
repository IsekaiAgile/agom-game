import Phaser from 'phaser';

export default class AgairudoTitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'AgairudoTitleScene' });
  }

  create() {
    console.log('=== AgairudoTitleScene: create started ===');
    
    // 明るい背景（炎のグラデーション）
    const bg = this.add.rectangle(640, 360, 1280, 720, 0x331100);
    
    // 炎のエフェクト（簡易版）
    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(100, 1180);
      const y = Phaser.Math.Between(400, 720);
      const particle = this.add.circle(x, y, Phaser.Math.Between(5, 15), 0xff6600, 0.8);
      
      this.tweens.add({
        targets: particle,
        y: y - Phaser.Math.Between(100, 300),
        alpha: 0,
        duration: Phaser.Math.Between(1000, 2000),
        repeat: -1
      });
    }
    
    // タイトル（日本語）
    const titleJP = this.add.text(640, 280, 'アガイルド', {
      fontSize: '96px',
      color: '#ff6600',
      fontFamily: 'sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 10
    }).setOrigin(0.5);
    titleJP.setAlpha(0);
    
    // サブタイトル
    const subtitle = this.add.text(640, 380, '〜炎の国〜', {
      fontSize: '48px',
      color: '#ffaa00',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    subtitle.setAlpha(0);
    
    // 英語タイトル
    const titleEN = this.add.text(640, 460, 'Agairudo: Kingdom of Flame', {
      fontSize: '32px',
      color: '#ffcc88',
      fontFamily: 'serif',
      fontStyle: 'italic'
    }).setOrigin(0.5);
    titleEN.setAlpha(0);
    
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
    
    // 4秒後にフェードアウト
    this.time.delayedCall(5000, () => {
      this.tweens.add({
        targets: [titleJP, subtitle, titleEN],
        alpha: 0,
        duration: 1500,
        onComplete: () => {
          console.log('=== Transitioning to TownScene ===');
          this.scene.stop('AgairudoTitleScene');
          this.scene.start('TownScene');
        }
      });
    });
  }
}
