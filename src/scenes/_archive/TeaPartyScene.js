export default class TeaPartyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TeaPartyScene' });
  }

  create() {
    console.log('=== TeaPartyScene: create started ===');
    
    // 背景
    const bg = this.add.rectangle(640, 360, 1280, 720, 0x3a2a4e);
    
    // タイトル
    const title = this.add.text(640, 50, '永遠のお茶会', {
      fontSize: '42px',
      color: '#ffdd00',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // 長テーブル
    const table = this.add.rectangle(640, 400, 900, 150, 0x663300);
    table.setStrokeStyle(5, 0x996633);
    
    // ティーカップ（浮遊）
    for (let i = 0; i < 5; i++) {
      const cup = this.add.circle(300 + i * 150, 350 - Math.random() * 30, 20, 0xffffff);
      this.tweens.add({
        targets: cup,
        y: cup.y + 20,
        duration: 1000 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
    
    // 登場人物（四角で表現）
    // 帽子屋
    this.hatter = this.add.rectangle(350, 320, 60, 80, 0xff6600);
    this.hatter.setStrokeStyle(3, 0xffffff);
    const hatterLabel = this.add.text(350, 250, '帽子屋', {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5);
    
    // 三月ウサギ
    this.hare = this.add.rectangle(640, 320, 60, 80, 0x00ff66);
    this.hare.setStrokeStyle(3, 0xffffff);
    const hareLabel = this.add.text(640, 250, '三月ウサギ', {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5);
    
    // ヤマネ
    this.dormouse = this.add.rectangle(930, 320, 50, 60, 0x6666ff);
    this.dormouse.setStrokeStyle(3, 0xffffff);
    const dormouseLabel = this.add.text(930, 250, 'ヤマネ', {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5);
    
    // フジ（プレイヤー）
    this.player = this.add.rectangle(200, 520, 50, 50, 0x00ffff);
    this.player.setStrokeStyle(3, 0xffffff);
    const playerLabel = this.add.text(200, 590, 'あなた', {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'sans-serif'
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
    
    // 「次へ」ボタン（最初は非表示）
    this.nextButton = this.add.rectangle(1100, 650, 150, 50, 0xff6600);
    this.nextButton.setStrokeStyle(3, 0xffffff);
    this.nextButton.setInteractive({ useHandCursor: true });
    this.nextButton.setAlpha(0);
    
    this.nextButtonText = this.add.text(1100, 650, '次へ', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.nextButtonText.setAlpha(0);
    
    this.nextButton.on('pointerdown', () => {
      this.advanceDialogue();
    });
    
    // セリフ配列
    this.dialogues = [
      { speaker: 'フジ', text: '......お茶会？ なんだここは' },
      { speaker: '帽子屋', text: '会議を始めよう！議題は「なぜカラスは机に似ているのか」だ' },
      { speaker: 'フジ', text: 'え......？ 意味が分からない' },
      { speaker: '三月ウサギ', text: '賛成！でも反対！いや、保留！' },
      { speaker: 'ヤマネ', text: 'Zzz......' },
      { speaker: '帽子屋', text: '素晴らしい意見だ！では次の議題「昨日の明日は今日か？」' },
      { speaker: 'フジ', text: 'ちょっと待って、さっきの議題は......？' },
      { speaker: '三月ウサギ', text: '結論は出た！出てない！出たことにしよう！' },
      { speaker: '帽子屋', text: 'では次の議題に移ろう' },
      { speaker: 'フジ', text: '......終わらない。この会議、永遠にループしてる' },
      { speaker: 'フジ', text: 'もう、やめだ！こんな意味のない会議、付き合ってられるか！' },
    ];
    
    this.currentDialogue = 0;
    
    // 初回表示
    this.time.delayedCall(500, () => {
      this.showDialogue();
    });
    
    console.log('=== TeaPartyScene: create finished ===');
  }

  showDialogue() {
    if (this.currentDialogue >= this.dialogues.length) {
      // 終了
      this.endScene();
      return;
    }
    
    const dialogue = this.dialogues[this.currentDialogue];
    
    // 話者を光らせる
    this.highlightSpeaker(dialogue.speaker);
    
    // テキスト表示
    this.dialogueText.setText(`${dialogue.speaker}：「${dialogue.text}」`);
    
    // ボタン表示
    this.tweens.add({
      targets: this.nextButton,
      alpha: 1,
      duration: 300
    });
    
    this.tweens.add({
      targets: this.nextButtonText,
      alpha: 1,
      duration: 300
    });
  }

  highlightSpeaker(speaker) {
    // 全員を暗くする
    [this.hatter, this.hare, this.dormouse, this.player].forEach(char => {
      char.setAlpha(0.5);
    });
    
    // 話者を明るくする
    switch(speaker) {
      case '帽子屋':
        this.hatter.setAlpha(1);
        break;
      case '三月ウサギ':
        this.hare.setAlpha(1);
        break;
      case 'ヤマネ':
        this.dormouse.setAlpha(1);
        break;
      case 'フジ':
        this.player.setAlpha(1);
        break;
    }
  }

  advanceDialogue() {
    this.currentDialogue++;
    this.showDialogue();
  }

  endScene() {
    console.log('=== TeaPartyScene: ending ===');
    
    this.dialogueText.setText('フジ：「席を立って、扉へ向かう」');
    
    // ボタンを非表示
    this.nextButton.setAlpha(0);
    this.nextButtonText.setAlpha(0);
    
    // フェードアウト
    this.time.delayedCall(2000, () => {
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.stop('TeaPartyScene');
        this.scene.start('QueenScene');
      });
    });
  }
}
