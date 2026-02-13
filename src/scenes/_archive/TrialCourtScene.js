export default class TrialCourtScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TrialCourtScene' });
  }

  create() {
    console.log('=== TrialCourtScene: create started ===');
    
    // 背景（法廷）
    const bg = this.add.rectangle(640, 360, 1280, 720, 0x2a1a3e);
    
    // タイトル
    const title = this.add.text(640, 50, '裁判所', {
      fontSize: '42px',
      color: '#ff3366',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // 裁判官席（高い位置）
    const judgeSeat = this.add.rectangle(640, 180, 300, 150, 0x663300);
    judgeSeat.setStrokeStyle(5, 0xffdd00);
    
    // 炎の女王（裁判官）
    this.queen = this.add.rectangle(640, 150, 60, 80, 0xff3366);
    this.queen.setStrokeStyle(3, 0xffff00);
    
    const queenLabel = this.add.text(640, 100, '炎の女王\n（裁判長）', {
      fontSize: '20px',
      color: '#ffff00',
      fontFamily: 'sans-serif',
      align: 'center'
    }).setOrigin(0.5);
    
    // 被告席
    const defendantSeat = this.add.rectangle(400, 450, 200, 150, 0x333333);
    defendantSeat.setStrokeStyle(3, 0x666666);
    
    // フジ（被告）
    this.player = this.add.rectangle(400, 420, 50, 50, 0x00ffff);
    this.player.setStrokeStyle(3, 0xffffff);
    
    const playerLabel = this.add.text(400, 530, '被告\n（あなた）', {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      align: 'center'
    }).setOrigin(0.5);
    
    // 証人席
    const witnessSeat = this.add.rectangle(880, 450, 200, 150, 0x333333);
    witnessSeat.setStrokeStyle(3, 0x666666);
    
    // 証人（？）
    this.witness = this.add.rectangle(880, 420, 50, 50, 0x666666);
    this.witness.setStrokeStyle(3, 0xffffff);
    
    const witnessLabel = this.add.text(880, 530, '証人\n（？）', {
      fontSize: '18px',
      color: '#888888',
      fontFamily: 'sans-serif',
      align: 'center'
    }).setOrigin(0.5);
    
    // セリフボックス
    this.dialogueBox = this.add.rectangle(640, 650, 1200, 120, 0x000000, 0.8);
    this.dialogueText = this.add.text(640, 650, '', {
      fontSize: '22px',
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
    
    this.tweens.add({
      targets: this.clickText,
      alpha: 1,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
    
    // セリフ配列
    this.dialogues = [
      { speaker: '炎の女王', text: '裁判を開廷する' },
      { speaker: '炎の女王', text: '被告の罪状は「変化をもたらそうとした罪」だ' },
      { speaker: 'フジ', text: '待ってくれ！僕は何もしていない！' },
      { speaker: '炎の女王', text: '黙れ！証人を呼べ' },
      { speaker: '証人', text: '被告は確かに......その......何か......したような......' },
      { speaker: 'フジ', text: 'あいまいすぎる！それのどこが証言なんだ！' },
      { speaker: '炎の女王', text: 'ふむ、では証拠を提出せよ' },
      { speaker: '証人', text: '（おもむろに何かを取り出す）これです' },
      { speaker: 'フジ', text: '何だそれは！今その場で作っただろう！' },
      { speaker: '炎の女王', text: '完璧な証拠だ。有罪' },
      { speaker: 'フジ', text: 'ちょっと待て！判決が早すぎる！' },
      { speaker: 'フジ', text: '証拠も後から出てくるし、証言もあいまいだし、判決は最初から決まってる......' },
      { speaker: 'フジ', text: 'こんなの裁判じゃない！馬鹿げてる！' },
      { speaker: '炎の女王', text: '黙れ！ 判決：有罪。刑罰：永遠の停滞' },
      { speaker: 'フジ', text: 'ふざけるな！こんな理不尽、認めるか！' },
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
    
    console.log('=== TrialCourtScene: create finished ===');
  }

  showDialogue() {
    if (this.currentDialogue >= this.dialogues.length) {
      this.endScene();
      return;
    }
    
    const dialogue = this.dialogues[this.currentDialogue];
    
    // 話者を光らせる
    this.highlightSpeaker(dialogue.speaker);
    
    // テキスト表示
    this.dialogueText.setText(`${dialogue.speaker}：「${dialogue.text}」`);
  }

  highlightSpeaker(speaker) {
    // 全員を暗くする
    [this.queen, this.player, this.witness].forEach(char => {
      char.setAlpha(0.5);
    });
    
    // 話者を明るくする
    switch(speaker) {
      case '炎の女王':
        this.queen.setAlpha(1);
        break;
      case 'フジ':
        this.player.setAlpha(1);
        break;
      case '証人':
        this.witness.setAlpha(1);
        break;
    }
  }

  advanceDialogue() {
    this.currentDialogue++;
    this.showDialogue();
  }

  endScene() {
    console.log('=== TrialCourtScene: ending ===');
    
    this.dialogueText.setText('フジの怒りが頂点に達した......');
    this.clickText.setAlpha(0);
    
    // 画面を揺らす
    this.cameras.main.shake(1000, 0.01);
    
    // 次のシーンへ
    this.time.delayedCall(2000, () => {
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.stop('TrialCourtScene');
        this.scene.start('FlameQueenBossScene');
      });
    });
  }
}
