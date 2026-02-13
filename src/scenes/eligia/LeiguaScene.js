export default class LeiguaScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LeiguaScene' });
  }

  preload() {
    // 背景
    this.load.image('eligia-bg', 'images/eligia/leigua-bg.png');
    
    // キャラクター
    this.load.image('fuji', 'images/characters/fuji.png');
    this.load.image('ajadra', 'images/characters/ajadra.png');
  }

  create() {
    console.log('=== LeiguaScene: create started ===');
    
    // 背景画像
    const bg = this.add.image(640, 360, 'eligia-bg');
    bg.setDisplaySize(1280, 720);
    
    // 浮遊する装飾（パーティクル風）
    this.createFloatingElements();
    
    // フジ（主人公）
    this.fuji = this.add.image(640, 480, 'fuji');
    this.fuji.setScale(1.2); // サイズ調整（大きく）
    this.fuji.setAlpha(0); // 最初は非表示
    
    // フジのフェードイン
    this.tweens.add({
      targets: this.fuji,
      alpha: 1,
      duration: 2000,
      ease: 'Power2'
    });
    
    // フジの呼吸アニメーション
    this.tweens.add({
      targets: this.fuji,
      scaleX: 1.23,
      scaleY: 1.23,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // アジャドラ（右側から登場）
    this.ajadra = this.add.image(1400, 300, 'ajadra');
    this.ajadra.setScale(0.8); // サイズ調整（大きく）
    
    // アジャドラが飛んでくる
    this.tweens.add({
      targets: this.ajadra,
      x: 900,
      duration: 1500,
      delay: 1000,
      ease: 'Power2',
      onComplete: () => {
        // 浮遊アニメーション
        this.tweens.add({
          targets: this.ajadra,
          y: 280,
          duration: 1000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    });
    
    // セリフボックス
    this.dialogueBox = this.add.rectangle(640, 620, 1200, 180, 0x000000, 0.85);
    this.dialogueBox.setStrokeStyle(3, 0x6633aa);
    this.dialogueBox.setAlpha(0);
    
    // セリフテキスト
    this.dialogueText = this.add.text(640, 600, '', {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      align: 'left',
      wordWrap: { width: 1100 }
    }).setOrigin(0.5, 0);
    this.dialogueText.setAlpha(0);
    
    // 話者名
    this.speakerName = this.add.text(100, 545, '', {
      fontSize: '24px',
      color: '#ffdd00',
      fontFamily: 'sans-serif',
      fontStyle: 'bold',
      backgroundColor: '#000000',
      padding: { x: 15, y: 8 }
    });
    this.speakerName.setAlpha(0);
    
    // クリックで進む表示
    this.clickPrompt = this.add.text(1150, 690, '▼ クリック', {
      fontSize: '20px',
      color: '#ffdd00',
      fontFamily: 'sans-serif'
    }).setOrigin(1, 1);
    this.clickPrompt.setAlpha(0);
    
    // 点滅アニメーション
    this.tweens.add({
      targets: this.clickPrompt,
      alpha: 1,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
    
    // セリフ配列
    this.dialogues = [
      { speaker: 'フジ', text: '......うっ。......ここは？ 夢の続きか？' },
      { speaker: 'フジ', text: '空に花が咲いて、魚が雲を泳いでいる......。めちゃくちゃだ' },
      { speaker: 'アジャドラ', text: '大変だドラ！ 時間が溶けていくドラ！ 鐘が鳴る前に急がないとドラ！' },
      { speaker: 'フジ', text: '......喋るドラゴン？ しかも、妙な服を着ているな' },
      { speaker: 'アジャドラ', text: 'そこに突っ立っている旅人さんドラ！ ぼんやりしていると、影に飲み込まれて消えてしまうドラよ！' },
      { speaker: 'フジ', text: '影？ 飲み込まれる......？ おい、説明してくれ！' },
      { speaker: 'アジャドラ', text: '説明なんて後回しドラ！ ボクについてくるドラ！ 立ち止まることは、ここでは『終わり』を意味するドラ！' },
      { speaker: 'フジ', text: '......なんだかよく分からないが、ここにいちゃいけないことだけは分かる。待ってくれ！' },
    ];
    
    this.currentDialogue = 0;
    
    // クリックで進む
    this.input.on('pointerdown', () => {
      this.advanceDialogue();
    });
    
    // スペースキーでも進む
    this.input.keyboard.on('keydown-SPACE', () => {
      this.advanceDialogue();
    });
    
    // 初回表示（3秒後）
    this.time.delayedCall(3000, () => {
      this.showDialogueBox();
      this.showDialogue();
    });
    
    console.log('=== LeiguaScene: create finished ===');
  }

  createFloatingElements() {
    // 浮遊する花（シンプルな円で表現）
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(100, 1180);
      const y = Phaser.Math.Between(50, 400);
      const size = Phaser.Math.Between(8, 16);
      
      const flower = this.add.circle(x, y, size, 0xff66cc, 0.6);
      
      // ランダムな浮遊アニメーション
      this.tweens.add({
        targets: flower,
        y: y + Phaser.Math.Between(-30, 30),
        x: x + Phaser.Math.Between(-20, 20),
        alpha: 0.3,
        duration: Phaser.Math.Between(3000, 5000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Phaser.Math.Between(0, 2000)
      });
    }
    
    // 泳ぐ魚（楕円で表現）
    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(100, 1180);
      const y = Phaser.Math.Between(100, 500);
      
      const fish = this.add.ellipse(x, y, 30, 15, 0x66ccff, 0.5);
      
      // 横に泳ぐアニメーション
      this.tweens.add({
        targets: fish,
        x: x + Phaser.Math.Between(-200, 200),
        y: y + Phaser.Math.Between(-50, 50),
        duration: Phaser.Math.Between(4000, 7000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Phaser.Math.Between(0, 3000)
      });
    }
    
    // 結晶（小さい四角で表現）
    for (let i = 0; i < 6; i++) {
      const x = Phaser.Math.Between(100, 1180);
      const y = Phaser.Math.Between(100, 600);
      const size = Phaser.Math.Between(6, 12);
      
      const crystal = this.add.rectangle(x, y, size, size, 0xaa66ff, 0.7);
      crystal.setRotation(Math.PI / 4);
      
      // 回転しながら浮遊
      this.tweens.add({
        targets: crystal,
        y: y + Phaser.Math.Between(-40, 40),
        rotation: crystal.rotation + Math.PI * 2,
        alpha: 0.3,
        duration: Phaser.Math.Between(3000, 6000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Phaser.Math.Between(0, 2000)
      });
    }
  }

  showDialogueBox() {
    this.tweens.add({
      targets: [this.dialogueBox, this.dialogueText, this.speakerName],
      alpha: 1,
      duration: 500
    });
  }

  showDialogue() {
    if (this.currentDialogue >= this.dialogues.length) {
      this.endScene();
      return;
    }
    
    const dialogue = this.dialogues[this.currentDialogue];
    
    // 話者名を表示
    this.speakerName.setText(dialogue.speaker);
    
    // セリフを表示
    this.dialogueText.setText(dialogue.text);
    
    // キャラクターを光らせる
    if (dialogue.speaker === 'フジ') {
      this.highlightCharacter(this.fuji);
    } else if (dialogue.speaker === 'アジャドラ') {
      this.highlightCharacter(this.ajadra);
    }
  }

  highlightCharacter(character) {
    // 他のキャラクターを暗くする
    [this.fuji, this.ajadra].forEach(char => {
      if (char !== character) {
        char.setTint(0x888888);
      }
    });
    
    // 話者を明るくする
    character.clearTint();
    
    // 軽く拡大
    this.tweens.add({
      targets: character,
      scaleX: character.scaleX * 1.05,
      scaleY: character.scaleY * 1.05,
      duration: 200,
      yoyo: true
    });
  }

  advanceDialogue() {
    this.currentDialogue++;
    
    if (this.currentDialogue < this.dialogues.length) {
      this.showDialogue();
    } else {
      this.endScene();
    }
  }

  endScene() {
    console.log('=== LeiguaScene: ending ===');
    
    // アジャドラが右に飛んでいく
    this.tweens.add({
      targets: this.ajadra,
      x: 1400,
      duration: 1000,
      ease: 'Power2'
    });
    
    // フジも追いかける準備
    this.time.delayedCall(500, () => {
      this.dialogueText.setText('フジ：「待ってくれ！」');
      
      this.time.delayedCall(1500, () => {
        // フェードアウト
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.stop('LeiguaScene');
          this.scene.start('ChaseScene');
        });
      });
    });
  }
}
