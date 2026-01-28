export default class AjadraScene extends Phaser.Scene {
  constructor() {
    super({ key: 'AjadraScene' });
    
    this.currentLine = 0;
    this.isTyping = false;
    this.currentBGM = null;
  }

  preload() {
    this.load.audio('fantasy-bgm', 'audio/fantasy-bgm.mp3');
    this.load.image('bg-agairud', 'images/agairud_login.png');
  }

  scenario = [
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: '？？？', text: 'よくぞ辿り着いたドラ！ その歩みこそ、変化への第一歩だドラ' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: '藤田', text: '……誰だ？ ここは……どこなんだ……' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: '？？？', text: 'ようこそ、アガイルドへ！ 自らを燃やし尽くし、変化を求めた旅人さんドラ！' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: '藤田', text: 'アガイルド……？ 竜……？ 僕は、死んだのか？' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: '？？？', text: '死んじゃいないドラ。ここは、君のような『魂の停滞』に陥った者が、再生を待つ場所ドラ' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: 'アジャドラ', text: 'ボクの名前はアジャドラ。君の『アジャイル（機敏な歩み）』を導く者だドラ！' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: '藤田', text: 'アジャイル……機敏な歩み……？' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: 'アジャドラ', text: '君は、独りで全部を背負って戦ってきたんだね。本当に、よく頑張ったドラ' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: 'アジャドラ', text: 'でも、その戦い方は、自分を傷つけるだけだったドラ' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: '藤田', text: '……自分を傷つける……そうだ、僕は……倒れて……' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: 'アジャドラ', text: 'それは『責任』じゃなくて『呪い』だドラ。君は、自分を助けるのを忘れていたドラ' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: 'アジャドラ', text: '思い出させてあげるドラ。自分を活かし、仲間と共に生きるための、本当の力を' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: 'アジャドラ', text: 'さあ、目を開けるドラ！ 変化を恐れない、あなたの本当の物語を始めるドラ！' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: '藤田', text: '……本当の……物語……' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: '', text: '（まばゆい光が画面を包み込む）' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: '', text: '...' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: '', text: '......' },
    { 
      type: 'nameReveal',
      text: 'ん、何か声がしたような……'
    }
  ];

  create() {
    console.log('AjadraScene: create started');
    
    this.bgm = this.sound.add('fantasy-bgm', {
      loop: true,
      volume: 0.5
    });
    this.bgm.play();
    console.log('Fantasy BGM started');
    
    this.backgroundImage = this.add.image(640, 360, 'bg-agairud');
    this.backgroundImage.setDisplaySize(1280, 720);
    
    this.background = this.add.rectangle(640, 360, 1280, 720, 0x2a1a3e);
    this.background.setDepth(-1);
    this.backgroundImage.setDepth(0);
    
    this.textWindow = this.add.rectangle(640, 600, 1200, 200, 0x000000, 0.8);
    this.textWindow.setStrokeStyle(2, 0xff6400);
    
    this.speakerText = this.add.text(100, 520, '', {
      fontSize: '24px',
      color: '#ff6400',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    });
    
    this.dialogueText = this.add.text(100, 560, '', {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      wordWrap: { width: 1080 }
    });
    
    this.clickIcon = this.add.text(1150, 680, '▼', {
      fontSize: '24px',
      color: '#ff6400'
    });
    this.clickIcon.setVisible(false);
    
    this.tweens.add({
      targets: this.clickIcon,
      alpha: 0.3,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
    
    this.input.on('pointerdown', () => this.advanceText());
    
    this.showLine();
  }

  showLine() {
    if (this.currentLine >= this.scenario.length) {
      this.dialogueText.setText('（続きを実装予定）');
      this.stopBGM();
      return;
    }
    
    const line = this.scenario[this.currentLine];
    
    // 名前表示形式の場合
    if (line.type === 'nameReveal') {
      this.showNameReveal(line);
      return;
    }
    
    if (line.background) {
      this.background.setFillStyle(parseInt(line.background.replace('#', '0x')));
    }
    
    if (line.backgroundImage) {
      this.backgroundImage.setTexture(line.backgroundImage);
    }
    
    this.speakerText.setText(line.speaker);
    
    if (line.speaker === '') {
      this.dialogueText.setStyle({
        fontSize: '24px',
        color: '#cccccc',
        fontFamily: 'sans-serif',
        fontStyle: 'italic',
        wordWrap: { width: 1080 }
      });
    } else {
      this.dialogueText.setStyle({
        fontSize: '28px',
        color: '#ffffff',
        fontFamily: 'sans-serif',
        fontStyle: 'normal',
        wordWrap: { width: 1080 }
      });
    }
    
    this.isTyping = true;
    this.clickIcon.setVisible(false);
    this.dialogueText.setText('');
    
    let typingSpeed = 50;
    if (line.text.includes('…')) typingSpeed = 70;
    if (line.speaker === '') typingSpeed = 40;
    if (line.text === '...' || line.text === '......') typingSpeed = 300;
    
    let charIndex = 0;
    const typingTimer = this.time.addEvent({
      delay: typingSpeed,
      callback: () => {
        this.dialogueText.setText(line.text.substring(0, charIndex + 1));
        charIndex++;
        
        if (charIndex >= line.text.length) {
          typingTimer.remove();
          this.isTyping = false;
          this.clickIcon.setVisible(true);
        }
      },
      loop: true
    });
  }

  advanceText() {
    if (this.isTyping) return;
    
    this.currentLine++;
    this.showLine();
  }

  showNameReveal(data) {
    // UIを隠す
    this.textWindow.setVisible(false);
    this.speakerText.setVisible(false);
    this.dialogueText.setVisible(false);
    this.clickIcon.setVisible(false);
    
    // 名前表示（中央に大きく）
    const nameText = this.add.text(640, 360, data.text, {
      fontSize: '48px',
      color: '#ff6400',
      fontFamily: 'sans-serif',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);
    nameText.setAlpha(0);
    
    // フェードイン
    this.tweens.add({
      targets: nameText,
      alpha: 1,
      duration: 2000,
      onComplete: () => {
        // 3秒後にフェードアウト
        this.time.delayedCall(3000, () => {
          this.tweens.add({
            targets: nameText,
            alpha: 0,
            duration: 2000,
            onComplete: () => {
              nameText.destroy();
              // 終了
              this.dialogueText.setVisible(true);
              this.dialogueText.setText('（続きを実装予定）');
            }
          });
        });
      }
    });
  }

  stopBGM() {
    if (this.bgm && this.bgm.isPlaying) {
      this.bgm.stop();
    }
  }
}
