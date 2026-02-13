export default class QueenScene extends Phaser.Scene {
  constructor() {
    super({ key: 'QueenScene' });
  }

  create() {
    console.log('=== QueenScene: create started ===');
    
    // 背景（広間）
    const bg = this.add.rectangle(640, 360, 1280, 720, 0x2a1a3e);
    
    // 床
    const floor = this.add.rectangle(640, 600, 1280, 240, 0x1a0a2a);
    
    // タイトル
    const title = this.add.text(640, 50, '女王の広間', {
      fontSize: '42px',
      color: '#ff3366',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // 玉座
    const throne = this.add.rectangle(640, 250, 200, 250, 0x663300);
    throne.setStrokeStyle(5, 0xffdd00);
    
    // 衛兵（左右に配置）
    for (let i = 0; i < 3; i++) {
      // 左側
      const guardL = this.add.rectangle(200 + i * 100, 500, 50, 80, 0x333333);
      guardL.setStrokeStyle(3, 0xff3366);
      
      // 右側
      const guardR = this.add.rectangle(880 + i * 100, 500, 50, 80, 0x333333);
      guardR.setStrokeStyle(3, 0xff3366);
    }
    
    // 炎の女王（最初は非表示）
    this.queen = this.add.rectangle(640, 200, 80, 120, 0xff3366);
    this.queen.setStrokeStyle(5, 0xffff00);
    this.queen.setAlpha(0);
    
    this.queenLabel = this.add.text(640, 300, '炎の女王', {
      fontSize: '28px',
      color: '#ffff00',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.queenLabel.setAlpha(0);
    
    // 炎エフェクト（女王の周り）
    this.flames = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const flame = this.add.circle(
        640 + Math.cos(angle) * 60,
        200 + Math.sin(angle) * 80,
        10,
        0xff6600,
        0
      );
      this.flames.push(flame);
    }
    
    // フジ（プレイヤー）
    this.player = this.add.rectangle(640, 520, 50, 50, 0x00ffff);
    this.player.setStrokeStyle(3, 0xffffff);
    
    // セリフボックス
    this.dialogueBox = this.add.rectangle(640, 650, 1200, 120, 0x000000, 0.8);
    this.dialogueText = this.add.text(640, 650, '', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      align: 'center',
      wordWrap: { width: 1100 }
    }).setOrigin(0.5);
    
    // クリックで進む表示
    this.clickText = this.add.text(1150, 690, '▼', {
      fontSize: '20px',
      color: '#ffff00',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5);
    this.clickText.setAlpha(0);
    
    // 点滅アニメーション
    this.tweens.add({
      targets: this.clickText,
      alpha: 1,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
    
    // セリフ配列
    this.dialogues = [
      { speaker: 'フジ', text: '......広間？ なんだか嫌な予感がする' },
      { speaker: 'フジ', text: '衛兵が並んでいる......。あの玉座に座っているのは......' },
      { speaker: null, text: '（炎が燃え上がる）' },
      { speaker: '炎の女王', text: '......来たか' },
      { speaker: 'フジ', text: '！ あなたは......！' },
      { speaker: '炎の女王', text: '私はこの国の女王。停滞こそが平和。変化は悪だ' },
      { speaker: '炎の女王', text: 'お前のような異邦人は......' },
      { speaker: '炎の女王', text: '首をはねよ！' },
      { speaker: 'フジ', text: 'なっ......！待ってくれ！' },
      { speaker: null, text: '（衛兵たちに取り囲まれる）' },
    ];
    
    this.currentDialogue = 0;
    
    // クリックで進む
    this.input.on('pointerdown', () => {
      this.advanceDialogue();
    });
    
    // 初回表示
    this.time.delayedCall(500, () => {
      this.showDialogue();
    });
    
    console.log('=== QueenScene: create finished ===');
  }

  showDialogue() {
    if (this.currentDialogue >= this.dialogues.length) {
      this.endScene();
      return;
    }
    
    const dialogue = this.dialogues[this.currentDialogue];
    
    // 女王登場演出（3番目のセリフで）
    if (this.currentDialogue === 2) {
      this.showQueen();
    }
    
    // テキスト表示
    if (dialogue.speaker) {
      this.dialogueText.setText(`${dialogue.speaker}：「${dialogue.text}」`);
    } else {
      this.dialogueText.setText(dialogue.text);
    }
    
    // クリック表示
    this.clickText.setAlpha(1);
  }

  showQueen() {
    // 女王を表示
    this.tweens.add({
      targets: this.queen,
      alpha: 1,
      duration: 1000,
      ease: 'Power2'
    });
    
    // ラベル表示
    this.tweens.add({
      targets: this.queenLabel,
      alpha: 1,
      duration: 1000
    });
    
    // 炎エフェクト
    this.flames.forEach((flame, index) => {
      this.tweens.add({
        targets: flame,
        alpha: 0.8,
        delay: index * 100,
        duration: 500
      });
    });
    
    // 炎を回転させる
    this.time.addEvent({
      delay: 100,
      callback: () => {
        this.flames.forEach((flame, index) => {
          const angle = (index / 8) * Math.PI * 2 + this.time.now * 0.001;
          flame.x = 640 + Math.cos(angle) * 60;
          flame.y = 200 + Math.sin(angle) * 80;
        });
      },
      loop: true
    });
  }

  advanceDialogue() {
    this.currentDialogue++;
    this.showDialogue();
  }

  endScene() {
    console.log('=== QueenScene: ending ===');
    
    this.dialogueText.setText('フジは捕らえられた......');
    this.clickText.setAlpha(0);
    
    // 画面を暗く
    const darkness = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0);
    
    this.tweens.add({
      targets: darkness,
      alpha: 0.8,
      duration: 2000
    });
    
    // 次のシーンへ
    this.time.delayedCall(3000, () => {
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.stop('QueenScene');
        this.scene.start('TrialCourtScene');
      });
    });
  }
}
