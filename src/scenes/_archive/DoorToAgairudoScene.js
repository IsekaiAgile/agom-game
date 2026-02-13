export default class DoorToAgairudoScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DoorToAgairudoScene' });
  }

  create() {
    console.log('=== DoorToAgairudoScene: create started ===');
    
    // 背景（白から徐々に暗く）
    const bg = this.add.rectangle(640, 360, 1280, 720, 0xffffff);
    
    // 暗い背景を上に重ねてフェードイン（fillColorの代わり）
    const darkBg = this.add.rectangle(640, 360, 1280, 720, 0x3a2a4e);
    darkBg.setAlpha(0);
    
    this.tweens.add({
      targets: darkBg,
      alpha: 1,
      duration: 3000
    });
    
    // タイトル
    const title = this.add.text(640, 50, '真実', {
      fontSize: '48px',
      color: '#ffdd00',
      fontFamily: 'sans-serif',
      fontStyle: 'bold',
      alpha: 0
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: title,
      alpha: 1,
      delay: 2000,
      duration: 1000
    });
    
    // 扉（最初は見えない）
    this.door = this.add.rectangle(640, 360, 150, 250, 0xff6600);
    this.door.setStrokeStyle(8, 0xffdd00);
    this.door.setAlpha(0);
    
    const doorLabel = this.add.text(640, 480, '扉', {
      fontSize: '32px',
      color: '#ffdd00',
      fontFamily: 'sans-serif',
      fontStyle: 'bold',
      alpha: 0
    }).setOrigin(0.5);
    
    // doorLabelを保存（参照用）
    this.doorLabel = doorLabel;
    
    // アジャドラ
    this.ajadra = this.add.text(200, 500, '🐉', {
      fontSize: '80px',
      alpha: 0
    });
    
    // フジ
    this.player = this.add.rectangle(1000, 500, 50, 50, 0x00ffff);
    this.player.setStrokeStyle(3, 0xffffff);
    this.player.setAlpha(0);
    
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
    
    this.tweens.add({
      targets: this.clickText,
      alpha: 1,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
    
    // セリフ配列
    this.dialogues = [
      { speaker: 'フジ', text: '......女王は......消えた......' },
      { speaker: null, text: '（光の中から扉が現れる）' },
      { speaker: 'アジャドラ', text: 'ここが本当の世界への扉ドラ' },
      { speaker: 'フジ', text: 'アジャドラ......あの女王は......' },
      { speaker: 'アジャドラ', text: 'エリージアは「もしも」の世界ドラ' },
      { speaker: 'アジャドラ', text: 'フジが来なかった世界ドラ' },
      { speaker: 'アジャドラ', text: 'あの女王は、フジが来なかった世界のツバキドラ' },
      { speaker: 'フジ', text: '僕が来なかったら、ツバキは......あんな風に......' },
      { speaker: 'フジ', text: '孤独に戦って、絶望して......' },
      { speaker: 'アジャドラ', text: 'でも、あなたは来たドラ' },
      { speaker: 'アジャドラ', text: 'だから、本当の世界では、ツバキは一人じゃないドラ' },
      { speaker: 'フジ', text: 'ああ。今度こそ、一緒に' },
      { speaker: 'フジ', text: '僕は......選んだ' },
      { speaker: 'アジャドラ', text: 'さあ、扉を開くドラ！' },
    ];
    
    this.currentDialogue = 0;
    
    // クリックで進む
    this.input.on('pointerdown', () => {
      this.advanceDialogue();
    });
    
    // 初回表示（5秒後）
    this.time.delayedCall(5000, () => {
      // キャラクター表示
      this.tweens.add({
        targets: [this.ajadra, this.player],
        alpha: 1,
        duration: 1000
      });
      
      this.time.delayedCall(1500, () => {
        this.showDialogue();
      });
    });
    
    console.log('=== DoorToAgairudoScene: create finished ===');
  }

  showDialogue() {
    if (this.currentDialogue >= this.dialogues.length) {
      this.openDoor();
      return;
    }
    
    const dialogue = this.dialogues[this.currentDialogue];
    
    // 扉を表示（2番目のセリフで）
    if (this.currentDialogue === 1) {
      this.tweens.add({
        targets: this.door,
        alpha: 1,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 2000,
        ease: 'Power2',
        onComplete: () => {
          // 扉を光らせる（1.2から1.3へのアニメーション）
          this.tweens.add({
            targets: this.door,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
          });
        }
      });
      
      this.tweens.add({
        targets: this.doorLabel,
        alpha: 1,
        duration: 2000
      });
    }
    
    // テキスト表示
    if (dialogue.speaker) {
      this.dialogueText.setText(`${dialogue.speaker}：「${dialogue.text}」`);
    } else {
      this.dialogueText.setText(dialogue.text);
    }
    
    this.clickText.setAlpha(1);
  }

  advanceDialogue() {
    this.currentDialogue++;
    this.showDialogue();
  }

  openDoor() {
    console.log('=== Opening door to Agairudo ===');
    
    this.dialogueText.setText('（扉を開ける......）');
    this.clickText.setAlpha(0);
    
    // 扉を開くアニメーション
    this.tweens.add({
      targets: this.door,
      scaleX: 3,
      scaleY: 3,
      alpha: 0,
      duration: 2000
    });
    
    // 白いフラッシュ
    const flash = this.add.rectangle(640, 360, 1280, 720, 0xffffff, 0);
    
    this.tweens.add({
      targets: flash,
      alpha: 1,
      duration: 2000
    });
    
    // 次のシーンへ
    this.time.delayedCall(3000, () => {
      this.scene.stop('DoorToAgairudoScene');
      this.scene.start('AgairudoTitleScene');
    });
  }
}
