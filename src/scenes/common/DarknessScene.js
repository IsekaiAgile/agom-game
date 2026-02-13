export default class DarknessScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DarknessScene' });
  }

  create() {
    console.log('=== DarknessScene: create started ===');
    
    // 真っ暗な背景
    const bg = this.add.rectangle(640, 360, 1280, 720, 0x000000);
    
    // トンネル風のエフェクト（円が拡大していく）
    for (let i = 0; i < 10; i++) {
      const circle = this.add.circle(640, 360, 50 + (i * 50), 0x222244, 0);
      circle.setStrokeStyle(2, 0x4444aa, 0.3);
      
      this.tweens.add({
        targets: circle,
        scaleX: 2,
        scaleY: 2,
        alpha: 0.5,
        duration: 2000,
        delay: i * 200,
        repeat: -1,
        ease: 'Power2'
      });
    }
    
    // セリフ配列
    const dialogues = [
      '......落ちているのか？ どこまでも、深く......',
      'あんなに執着していた『責任』も『期限』も、もう何も聞こえない',
      '体が、嘘みたいに軽い。まるで水の中に溶けていくみたいだ......',
      '......。......暗闇の先に、光が見える'
    ];
    
    let currentDialogue = 0;
    
    // テキスト表示
    const dialogueText = this.add.text(640, 360, dialogues[0], {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      align: 'center',
      wordWrap: { width: 1000 }
    }).setOrigin(0.5);
    dialogueText.setAlpha(0);
    
    // クリックで次へ進む
    const clickIcon = this.add.text(640, 500, '▼ クリックで続ける', {
      fontSize: '20px',
      color: '#888888',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5);
    clickIcon.setAlpha(0);
    
    // 点滅アニメーション
    this.tweens.add({
      targets: clickIcon,
      alpha: 0.8,
      duration: 800,
      yoyo: true,
      repeat: -1
    });
    
    // 最初のセリフをフェードイン
    this.tweens.add({
      targets: [dialogueText, clickIcon],
      alpha: 1,
      duration: 1500
    });
    
    // クリックイベント
    const advanceDialogue = () => {
      currentDialogue++;
      
      if (currentDialogue >= dialogues.length) {
        // 最後のセリフの後、LeiguaSceneへ
        this.tweens.add({
          targets: [dialogueText, clickIcon],
          alpha: 0,
          duration: 1000,
          onComplete: () => {
            console.log('=== Transitioning to LeiguaScene ===');
            this.cameras.main.fadeOut(2000, 0, 0, 0);
            
            this.cameras.main.once('camerafadeoutcomplete', () => {
              this.scene.stop('DarknessScene');
              this.scene.start('LeiguaScene');
            });
          }
        });
        
        this.input.off('pointerdown', advanceDialogue);
      } else {
        // 次のセリフへ
        this.tweens.add({
          targets: dialogueText,
          alpha: 0,
          duration: 300,
          onComplete: () => {
            dialogueText.setText(dialogues[currentDialogue]);
            this.tweens.add({
              targets: dialogueText,
              alpha: 1,
              duration: 1000
            });
          }
        });
      }
    };
    
    this.input.on('pointerdown', advanceDialogue);
  }
}
