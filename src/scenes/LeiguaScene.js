export default class LeiguaScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LeiguaScene' });
  }

  preload() {
    this.load.audio('leigua-bgm', 'audio/trial-bgm.mp3');
  }

  create() {
    console.log('=== LeiguaScene: create started ===');
    
    // BGM
    this.bgm = this.sound.add('leigua-bgm', {
      loop: true,
      volume: 0.3
    });
    this.bgm.play();
    
    // フェードイン
    this.cameras.main.fadeIn(2000, 0, 0, 0);
    
    // 不思議な背景
    const bg = this.add.rectangle(640, 360, 1280, 720, 0x2a1a3e);
    
    // 浮遊する物体（空に花、魚）
    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(100, 1180);
      const y = Phaser.Math.Between(100, 300);
      
      // 花
      const flower = this.add.text(x, y, '🌸', {
        fontSize: '40px'
      });
      
      this.tweens.add({
        targets: flower,
        y: y + Phaser.Math.Between(-30, 30),
        x: x + Phaser.Math.Between(-20, 20),
        duration: Phaser.Math.Between(3000, 5000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
    
    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(100, 1180);
      const y = Phaser.Math.Between(100, 400);
      
      // 魚
      const fish = this.add.text(x, y, '🐟', {
        fontSize: '35px'
      });
      
      this.tweens.add({
        targets: fish,
        x: x + 200,
        duration: Phaser.Math.Between(4000, 6000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
    
    // セリフ配列
    this.dialogues = [
      { speaker: 'フジ', text: '......うっ。......ここは？ 夢の続きか？' },
      { speaker: 'フジ', text: '空に花が咲いて、魚が雲を泳いでいる......。めちゃくちゃだ' },
      { speaker: '???', text: '大変だドラ！ 時間が溶けていくドラ！ 鐘が鳴る前に急がないとドラ！' },
      { speaker: 'フジ', text: '......喋るドラゴン？ しかも、妙な服を着ているな' },
      { speaker: 'アジャドラ', text: 'そこに突っ立っている旅人さんドラ！ ぼんやりしていると、影に飲み込まれて消えてしまうドラよ！' },
      { speaker: 'フジ', text: '影？ 飲み込まれる......？ おい、説明してくれ！' },
      { speaker: 'アジャドラ', text: '説明なんて後回しドラ！ ボクについてくるドラ！ 立ち止まることは、ここでは『終わり』を意味するドラ！' },
      { speaker: 'フジ', text: '......なんだかよく分からないが、ここにいちゃいけないことだけは分かる。待ってくれ！' }
    ];
    
    this.currentDialogue = 0;
    
    // プレイヤー
    this.player = this.add.rectangle(640, 500, 40, 40, 0x00aaff);
    this.player.setStrokeStyle(3, 0xffffff);
    
    // 会話ボックス
    this.dialogueBox = this.add.rectangle(640, 600, 1100, 120, 0x000000, 0.85);
    this.dialogueBox.setStrokeStyle(3, 0xffffff);
    this.dialogueBox.setDepth(10);
    
    // 話者名
    this.speakerText = this.add.text(120, 560, '', {
      fontSize: '24px',
      color: '#ffaa00',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    });
    this.speakerText.setDepth(11);
    
    // セリフテキスト
    this.dialogueText = this.add.text(640, 600, '', {
      fontSize: '26px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      align: 'center',
      wordWrap: { width: 1000 }
    }).setOrigin(0.5);
    this.dialogueText.setDepth(11);
    
    // クリックアイコン
    this.clickIcon = this.add.text(1100, 640, '▼', {
      fontSize: '24px',
      color: '#ffaa00',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5);
    this.clickIcon.setDepth(11);
    
    this.tweens.add({
      targets: this.clickIcon,
      alpha: 0.3,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
    
    // 最初のセリフを表示
    this.showDialogue();
    
    // クリックイベント
    this.input.on('pointerdown', () => {
      this.advanceDialogue();
    });
  }

  showDialogue() {
    const dialogue = this.dialogues[this.currentDialogue];
    
    this.speakerText.setText(dialogue.speaker);
    this.dialogueText.setText(dialogue.text);
    
    // アジャドラが登場するタイミング
    if (this.currentDialogue === 2 && !this.ajadra) {
      this.ajadra = this.add.text(200, 400, '🐉', {
        fontSize: '60px'
      });
      
      // 登場演出
      this.ajadra.setAlpha(0);
      this.tweens.add({
        targets: this.ajadra,
        alpha: 1,
        duration: 500
      });
    }
  }

  advanceDialogue() {
    this.currentDialogue++;
    
    if (this.currentDialogue >= this.dialogues.length) {
      // 最後のセリフの後、ChaseSceneへ
      console.log('=== Transitioning to ChaseScene ===');
      
      if (this.bgm) {
        this.bgm.stop();
      }
      
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.stop('LeiguaScene');
        this.scene.start('ChaseScene');
      });
    } else {
      this.showDialogue();
    }
  }
}
