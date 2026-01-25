import Phaser from 'phaser';

export default class PrologueScene extends Phaser.Scene {
  constructor() {
    super('PrologueScene');
    this.currentLine = 0;
    this.isTyping = false;
    this.currentBGM = null;
  }

  preload() {
    // BGMファイルを読み込み
    console.log('Loading audio files...');
    this.load.audio('dark-bgm', 'audio/dark-bgm.mp3');
    this.load.audio('fantasy-bgm', 'audio/fantasy-bgm.mp3');
    
    // 背景画像を読み込み
    console.log('Loading background images...');
    this.load.image('bg-room', 'images/room.png');
    this.load.image('bg-train-morning', 'images/train_morning.png');
    this.load.image('bg-office-morning', 'images/office_morning.png');
    this.load.image('bg-office-night', 'images/office_night.png');
    this.load.image('bg-train-night', 'images/train_night.png');
    this.load.image('bg-dark', 'images/dark.png');
    this.load.image('bg-agairud', 'images/agairud_login.png');
    
    this.load.on('filecomplete', (key) => {
      console.log('Loaded:', key);
    });
    
    this.load.on('loaderror', (file) => {
      console.error('Failed to load:', file.key, file.src);
    });
  }

  // 『AGOM - アガイルドの炎』プロローグ完全版：終わらない円環
  scenario = [
    // 選択肢1: 第1幕の前
    {
      type: 'choice',
      question: '朝、目覚めますか？',
      gameOverText: 'あなたは永遠に眠り続けた。\n目覚めることは、二度となかった...'
    },
    
    // 第1幕：AM 06:00 覚醒と絶望
    { background: '#0f0f1e', backgroundImage: 'bg-room', speaker: '藤田', text: '……う、あ……' },
    { background: '#0f0f1e', backgroundImage: 'bg-room', speaker: '', text: '（アラームを止める。画面には『06:00』の文字）' },
    { background: '#0f0f1e', backgroundImage: 'bg-room', speaker: '藤田', text: '……寝た気がしない。いや、一瞬も意識が途切れなかった' },
    { background: '#0f0f1e', backgroundImage: 'bg-room', speaker: '藤田', text: '目を閉じても、頭の中でずっと今日のタスクの段取りが回っていた' },
    { background: '#0f0f1e', backgroundImage: 'bg-room', speaker: '藤田', text: '……あと1時間は寝れるはずだ。目だけ、目だけ瞑ろう……' },
    { background: '#0f0f1e', backgroundImage: 'bg-room', speaker: '藤田', text: '……ダメだ。あのバグ、昨日の修正で本当に直ったのか……？' },
    { background: '#0f0f1e', backgroundImage: 'bg-room', speaker: '藤田', text: 'あの資料、上司は納得するだろうか。クライアントは怒らないだろうか……' },
    { background: '#0f0f1e', backgroundImage: 'bg-room', speaker: '藤田', text: '……気がつけば、またアラームが鳴っている。心臓が嫌な速さで打っている' },
    { background: '#0f0f1e', backgroundImage: 'bg-room', speaker: '藤田', text: '……起きなきゃ。体が、冷たい泥のように重い' },
    { background: '#0f0f1e', backgroundImage: 'bg-room', speaker: '藤田', text: '健康サプリ、ビタミン、……。これで、午前中は持つはずだ' },
    { background: '#0f0f1e', backgroundImage: 'bg-room', speaker: '藤田', text: '……よし。行こう' },
    
    // 選択肢2: 第2幕の前
    {
      type: 'choice',
      question: '満員電車に乗りますか？',
      gameOverText: 'あなたは会社に行かず、職を失った。\nそして、社会から消えていった...'
    },
    
    // 第2幕：AM 08:15 摩擦の戦場
    { background: '#1a1a2e', backgroundImage: 'bg-train-morning', speaker: '', text: '（駅までの数分で、もう息が切れている。酸素が足りない）' },
    { background: '#1a1a2e', backgroundImage: 'bg-train-morning', speaker: '', text: '（……来た。今日を生き延びるための、最初の試練だ）' },
    { background: '#1a1a2e', backgroundImage: 'bg-train-morning', speaker: '', text: '（ドア付近はダメだ。乗り降りのたびに弾き出されて消耗する）' },
    { background: '#1a1a2e', backgroundImage: 'bg-train-morning', speaker: '', text: '（通路の……あの隙間。あそこが今日の僕の『陣地』だ）' },
    { background: '#1a1a2e', backgroundImage: 'bg-train-morning', speaker: '', text: '（人波をかき分け、通路に滑り込む。周囲からの無言の圧力）' },
    { background: '#1a1a2e', backgroundImage: 'bg-train-morning', speaker: '', text: '（毎日、ポジションは変わる。同じ日なんて、一日もない）' },
    { background: '#1a1a2e', backgroundImage: 'bg-train-morning', speaker: '', text: '（誰かの肩が当たり、舌打ちが聞こえる。会社に着く頃には、心はもう磨り潰されている）' },
    
    // 選択肢3: 第3幕の前
    {
      type: 'choice',
      question: '仕事を始めますか？',
      gameOverText: 'あなたは責任を放棄した。\nチームは崩壊し、あなたは孤独になった...'
    },
    
    // 第3幕：AM 09:30 無限のTODO
    { background: '#1a1a2e', backgroundImage: 'bg-office-morning', speaker: '藤田', text: 'おはようございます……' },
    { background: '#1a1a2e', backgroundImage: 'bg-office-morning', speaker: '', text: '（PCを起動する。未読のチャット通知が画面の端を埋め尽くす）' },
    { background: '#1a1a2e', backgroundImage: 'bg-office-morning', speaker: '藤田', text: '……よし、今日のTODOリストをまとめ直そう' },
    { background: '#1a1a2e', backgroundImage: 'bg-office-morning', speaker: '藤田', text: '昨日の残り、さっき届いた割り込み、午後の定例会議の準備……' },
    { background: '#1a1a2e', backgroundImage: 'bg-office-morning', speaker: '', text: '（リストがどんどん長くなっていく。スクロールしても終わらない）' },
    { background: '#1a1a2e', backgroundImage: 'bg-office-morning', speaker: '藤田', text: '……多いな。見るだけで、胃の奥がギュッと縮む' },
    { background: '#1a1a2e', backgroundImage: 'bg-office-morning', speaker: '上司', text: 'フジ君、ちょっといいかな' },
    { background: '#1a1a2e', backgroundImage: 'bg-office-morning', speaker: '藤田', text: '……はい、何でしょうか' },
    { background: '#1a1a2e', backgroundImage: 'bg-office-morning', speaker: '上司', text: '例の件、君が出してくれた成果、評判いいよ。だからこれも追加で任せたい' },
    { background: '#1a1a2e', backgroundImage: 'bg-office-morning', speaker: '藤田', text: '……承知しました。調整します' },
    { background: '#1a1a2e', backgroundImage: 'bg-office-morning', speaker: '', text: '（成果を出せば出すほど、仕事が増えていく）' },
    { background: '#1a1a2e', backgroundImage: 'bg-office-morning', speaker: '', text: '（期待に応えれば応えるほど、自分の首が締まっていく）' },
    { background: '#1a1a2e', backgroundImage: 'bg-office-morning', speaker: '', text: '（……無限だ。このサイクルに、出口なんて最初からなかったんだ）' },
    
    // 第4幕：PM 14:00 孤独の燃料補給
    { background: '#1a1a2e', backgroundImage: 'bg-office-morning', speaker: '藤田', text: '……もう14時か。午前中が終わったなんて信じられない' },
    { background: '#1a1a2e', backgroundImage: 'bg-office-morning', speaker: '藤田', text: 'お昼、外に食べに行く時間が……いや、このメールを返してからにしよう' },
    { background: '#1a1a2e', backgroundImage: 'bg-office-morning', speaker: '', text: '（30分後。結局デスクで冷めたおにぎりを袋から出す）' },
    { background: '#1a1a2e', backgroundImage: 'bg-office-morning', speaker: '藤田', text: '……味がしない。何を食べているのか、脳が認識していない' },
    { background: '#1a1a2e', backgroundImage: 'bg-office-morning', speaker: '藤田', text: '胃が重い。何かを摂取すること自体、体が拒絶している気がする' },
    { background: '#1a1a2e', backgroundImage: 'bg-office-morning', speaker: '藤田', text: '……でも、エネルギーを入れないと。夜まで持たないんだ' },
    
    // 選択肢4: 第5幕の前
    {
      type: 'choice',
      question: '残業を始めますか？',
      gameOverText: 'あなたはチームを見捨てた。\n期待を裏切り、信頼を失った...'
    },
    
    // 第5幕：PM 21:00 『本番』の始まり
    { background: '#0a0a1e', backgroundImage: 'bg-office-night', speaker: '藤田', text: '……ふぅ。やっと、静かになった' },
    { background: '#0a0a1e', backgroundImage: 'bg-office-night', speaker: '藤田', text: '日中は、目の前に来る仕事をスピーディーにこなすだけで終わる' },
    { background: '#0a0a1e', backgroundImage: 'bg-office-night', speaker: '藤田', text: '……ここからが、ようやく『自分の仕事』をする時間だ' },
    { background: '#0a0a1e', backgroundImage: 'bg-office-night', speaker: '', text: '（エナジードリンクと、さらにサプリ。ここからが本番だ）' },
    { background: '#0a0a1e', backgroundImage: 'bg-office-night', speaker: '', text: '（頼られている。期待されている。僕がやらなきゃいけないんだ）' },
    { background: '#0a0a1e', backgroundImage: 'bg-office-night', speaker: '', text: '（僕が止まれば、チームが止まる。それだけは、絶対にいけない）' },
    { background: '#0a0a1e', backgroundImage: 'bg-office-night', speaker: '', text: '（激しくキーボードを叩く音。青白い光だけが、フジの青ざめた顔を照らす）' },
    
    // 第6幕：AM 00:30 終電という名の棺
    { background: '#050510', backgroundImage: 'bg-train-night', speaker: '', text: '（……終電。今日も、なんとか滑り込んだ）' },
    { background: '#050510', backgroundImage: 'bg-train-night', speaker: '', text: '（朝ほどではないが、まだ満員だ。みんな、幽霊のような顔をしている）' },
    { background: '#050510', backgroundImage: 'bg-train-night', speaker: '', text: '（座りたい。……でも、空いていない。足が震えている）' },
    { background: '#050510', backgroundImage: 'bg-train-night', speaker: '', text: '（座席が一つ空く。しかし、隣の乗客が体を押し付けてきて、座ることができない）' },
    { background: '#050510', backgroundImage: 'bg-train-night', speaker: '', text: '（……痛いな。苦しいな。でも、それを訴える気力すら残っていない）' },
    { background: '#050510', backgroundImage: 'bg-train-night', speaker: '', text: '（揺られながら、また明日の段取りが頭をよぎる）' },
    { background: '#050510', backgroundImage: 'bg-train-night', speaker: '', text: '（……あ。あのバグ、再発しないだろうか）' },
    { background: '#050510', backgroundImage: 'bg-train-night', speaker: '', text: '（……明日の朝イチの会議、資料に不備はなかっただろうか）' },
    { background: '#050510', backgroundImage: 'bg-train-night', speaker: '', text: '（……休みたい。……でも、休むのが怖い）' },
    
    // 選択肢5: 第7幕の前（最も重要な選択）
    {
      type: 'choice',
      question: 'まだ頑張れそうですか？',
      gameOverText: 'あなたは限界を認めた。\nしかし、それはもう遅すぎた...'
    },
    
    // 第7幕：AM 01:45 崩壊
    { background: '#050510', backgroundImage: 'bg-room', speaker: '藤田', text: '……ただいま。……あぁ、食欲も、寝る気力すらない' },
    { background: '#050510', backgroundImage: 'bg-room', speaker: '藤田', text: '仕事のことだけが、頭の中で渦を巻いている' },
    { background: '#050510', backgroundImage: 'bg-room', speaker: '藤田', text: '……あれはやっただろうか。……大丈夫だろうか……' },
    { background: '#050510', backgroundImage: 'bg-room', speaker: '藤田', text: '……ちょっとだけ、PCを確認……' },
    { background: '#050510', backgroundImage: 'bg-room', speaker: '藤田', text: '……っ。急に、目の前が……' },
    { background: '#000000', backgroundImage: 'bg-dark', speaker: '', text: '...' },
    { background: '#000000', backgroundImage: 'bg-dark', speaker: '', text: '......' },
    { background: '#000000', backgroundImage: 'bg-dark', speaker: '藤田', text: '真っ暗だ。……何も、見えな……' },
    { background: '#000000', backgroundImage: 'bg-dark', speaker: '', text: '（心臓の音が「ドクン……」と重く響き、完全に消失する）' },
    { background: '#000000', backgroundImage: 'bg-dark', speaker: '', text: '（完全な暗転。長い静寂）' },
    { background: '#000000', backgroundImage: 'bg-dark', speaker: '', text: '...' },
    { background: '#000000', backgroundImage: 'bg-dark', speaker: '', text: '......' },
    
    // 第8幕：虚無の淵
    { background: '#000000', backgroundImage: 'bg-dark', speaker: '', text: '（……ああ、そうか。こういうことだったのか）' },
    { background: '#000000', backgroundImage: 'bg-dark', speaker: '', text: '（頑張ることが、自分を殺すことになっていたんだ）' },
    { background: '#000000', backgroundImage: 'bg-dark', speaker: '', text: '（成果を出すほどに、自分を絞め殺す縄は太くなっていく）' },
    { background: '#000000', backgroundImage: 'bg-dark', speaker: '', text: '（……僕は、自分で自分を、この真っ暗な場所に追い込んだんだ）' },
    { background: '#000000', backgroundImage: 'bg-dark', speaker: '', text: '（……もう、いいよな。……これで、終わりに……）' },
    { background: '#000000', backgroundImage: 'bg-dark', speaker: '', text: '（遠くから、小さく温かい橙色の光が差してくる）' },
    { background: '#000000', backgroundImage: 'bg-dark', speaker: '', text: '...' },
    
    // 第9幕：アジャドラとの邂逅
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: '？？？', text: '……そんなところで寝ていると、本当に灰になってしまうドラ' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: '藤田', text: '……誰だ？ 放っておいてくれ。僕は、もう一歩も動けない' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: '？？？', text: '動けないんじゃないドラ。君は、動く方向を間違えていただけだドラ' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: '？？？', text: 'ようこそ、アガイルドへ！ 自らを燃やし尽くし、変化を求めた旅人さんドラ！' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: '藤田', text: 'アガイルド……？ 竜……？ 僕は、死んだのか？' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: 'アジャドラ', text: '死んじゃいないドラ。ここは、君のような『魂の停滞』に陥った者が、再生を待つ場所ドラ' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: 'アジャドラ', text: 'ボクの名前はアジャドラ。君の『アジャイル（機敏な歩み）』を導く者だドラ！' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: 'アジャドラ', text: '君は、独りで全部を背負って戦ってきたんだね。本当に、よく頑張ったドラ' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: 'アジャドラ', text: 'でも、その戦い方は、ここでは自分を傷つけるだけだドラ' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: '藤田', text: '……自分を傷つける……？ 僕は、ただ責任を果たそうと……' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: 'アジャドラ', text: 'それは『責任』じゃなくて『呪い』だドラ。君は、自分を助けるのを忘れていたドラ' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: 'アジャドラ', text: '思い出させてあげるドラ。自分を活かし、仲間と共に生きるための、本当の力を' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: 'アジャドラ', text: 'さあ、目を開けるドラ！ 変化を恐れない、あなたの本当の物語を始めるドラ！' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: '藤田', text: '……本当の……物語……' },
    { background: '#2a1a3e', backgroundImage: 'bg-agairud', speaker: '', text: '（まばゆい光が画面を包み込み、異世界の草原へとフェードイン）' }
  ];

  create() {
    // 背景画像（最初は room.png を表示）
    this.backgroundImage = this.add.image(640, 360, 'bg-room');
    this.backgroundImage.setDisplaySize(1280, 720);
    
    // 背景色の矩形（フォールバック用、画像の下）
    this.background = this.add.rectangle(640, 360, 1280, 720, 0x1a1a2e);
    this.background.setDepth(-1);
    this.backgroundImage.setDepth(0);

    // テキストウィンドウの背景
    this.textWindow = this.add.rectangle(640, 600, 1200, 200, 0x000000, 0.8);
    this.textWindow.setStrokeStyle(2, 0xff6400);

    // 話者名
    this.speakerText = this.add.text(100, 520, '', {
      fontSize: '24px',
      color: '#ff6400',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    });

    // メインテキスト
    this.dialogueText = this.add.text(100, 560, '', {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      wordWrap: { width: 1080 }
    });

    // クリック待ちアイコン
    this.clickIcon = this.add.text(1150, 680, '▼', {
      fontSize: '24px',
      color: '#ff6400'
    });
    this.clickIcon.setVisible(false);

    // 点滅アニメーション
    this.tweens.add({
      targets: this.clickIcon,
      alpha: 0.3,
      duration: 500,
      yoyo: true,
      repeat: -1
    });

    // 選択肢UI（最初は非表示）
    this.createChoiceUI();

    // クリックイベント
    this.input.on('pointerdown', () => this.advanceText());

    // 最初のテキストを表示
    this.showLine();
  }

  createChoiceUI() {
    // 選択肢背景
    this.choiceWindow = this.add.rectangle(640, 360, 600, 300, 0x000000, 0.9);
    this.choiceWindow.setStrokeStyle(3, 0xff6400);
    this.choiceWindow.setVisible(false);

    // 質問テキスト
    this.questionText = this.add.text(640, 280, '', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      align: 'center'
    }).setOrigin(0.5);
    this.questionText.setVisible(false);

    // 「はい」ボタン
    this.yesButton = this.add.rectangle(640, 360, 200, 60, 0xff6400);
    this.yesButton.setStrokeStyle(2, 0xffffff);
    this.yesButton.setInteractive({ useHandCursor: true });
    this.yesButton.setVisible(false);

    this.yesText = this.add.text(640, 360, 'はい', {
      fontSize: '28px',
      color: '#000000',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.yesText.setVisible(false);

    // 「いいえ」ボタン
    this.noButton = this.add.rectangle(640, 440, 200, 60, 0x444444);
    this.noButton.setStrokeStyle(2, 0xffffff);
    this.noButton.setInteractive({ useHandCursor: true });
    this.noButton.setVisible(false);

    this.noText = this.add.text(640, 440, 'いいえ', {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.noText.setVisible(false);

    // ホバーエフェクト
    this.yesButton.on('pointerover', () => {
      this.yesButton.setFillStyle(0xffaa00);
    });
    this.yesButton.on('pointerout', () => {
      this.yesButton.setFillStyle(0xff6400);
    });

    this.noButton.on('pointerover', () => {
      this.noButton.setFillStyle(0x666666);
    });
    this.noButton.on('pointerout', () => {
      this.noButton.setFillStyle(0x444444);
    });
  }

  showLine() {
    if (this.currentLine >= this.scenario.length) {
      // シナリオ終了
      this.dialogueText.setText('プロローグはここまでです。\n（続きを実装予定）');
      this.stopBGM();
      return;
    }

    const line = this.scenario[this.currentLine];

    // 選択肢の場合
    if (line.type === 'choice') {
      this.showChoice(line);
      return;
    }

    // BGMの切り替え（テキスト内容で判定）
    // 第8幕：虚無の淵の開始でBGM停止
    if (line.text && line.text.includes('……ああ、そうか。こういうことだったのか')) {
      console.log('Stopping BGM - Scene 8 detected');
      this.stopBGM();
    }
    
    // 第9幕：アジャドラ登場でfantasy-bgm開始
    if (line.text && line.text.includes('……そんなところで寝ていると、本当に灰になってしまうドラ')) {
      console.log('Starting fantasy-bgm - Scene 9 detected');
      this.playBGM('fantasy-bgm');
    }

    // 背景色を変更
    this.background.setFillStyle(parseInt(line.background.replace('#', '0x')));
    
    // 背景画像を切り替え（指定されている場合）
    if (line.backgroundImage) {
      this.backgroundImage.setTexture(line.backgroundImage);
    }

    // 話者名を設定
    this.speakerText.setText(line.speaker);

    // モノローグ（心の声）の場合、フォントスタイルを変更
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

    // テキストを1文字ずつ表示
    this.isTyping = true;
    this.clickIcon.setVisible(false);
    this.dialogueText.setText('');

    // テキスト速度を決定（重要な台詞はゆっくり、モノローグは少し速く）
    let typingSpeed = 50; // デフォルト
    
    if (line.text.includes('…') || line.text.includes('っ。') || line.text.includes('……')) {
      typingSpeed = 70; // 重要な台詞はゆっくり
    }
    if (line.speaker === '') {
      typingSpeed = 40; // モノローグは少し速く
    }
    if (line.text === '...' || line.text === '......') {
      typingSpeed = 300; // 「間」は長く
    }

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
    if (this.isTyping) {
      // タイピング中ならスキップ
      return;
    }

    this.currentLine++;
    this.showLine();
  }

  playBGM(key) {
    console.log('playBGM called with key:', key);
    
    // 既に同じBGMが再生中なら何もしない
    if (this.currentBGM && this.currentBGM.key === key && this.currentBGM.isPlaying) {
      console.log('BGM already playing:', key);
      return;
    }

    // 現在のBGMを停止
    if (this.currentBGM) {
      console.log('Stopping current BGM');
      this.currentBGM.stop();
    }

    // 新しいBGMを再生
    if (key) {
      console.log('Creating and playing new BGM:', key);
      this.currentBGM = this.sound.add(key, { loop: true, volume: 0.5 });
      this.currentBGM.play();
      console.log('BGM playing:', this.currentBGM.isPlaying);
    }
  }

  stopBGM() {
    if (this.currentBGM) {
      this.currentBGM.stop();
      this.currentBGM = null;
    }
  }

  showChoice(choiceData) {
    // テキストウィンドウを隠す
    this.textWindow.setVisible(false);
    this.speakerText.setVisible(false);
    this.dialogueText.setVisible(false);
    this.clickIcon.setVisible(false);

    // 選択肢UIを表示
    this.choiceWindow.setVisible(true);
    this.questionText.setText(choiceData.question);
    this.questionText.setVisible(true);
    this.yesButton.setVisible(true);
    this.yesText.setVisible(true);
    this.noButton.setVisible(true);
    this.noText.setVisible(true);

    // ボタンのクリックイベント
    this.yesButton.removeAllListeners();
    this.noButton.removeAllListeners();

    this.yesButton.once('pointerdown', () => {
      this.hideChoice();
      this.currentLine++;
      
      // 最初の選択肢の後にBGMを開始（ブラウザの自動再生ポリシー対策）
      if (this.currentLine === 1 && !this.currentBGM) {
        console.log('Starting dark-bgm after user interaction...');
        this.playBGM('dark-bgm');
      }
      
      this.showLine();
    });

    this.noButton.once('pointerdown', () => {
      this.showGameOver(choiceData.gameOverText);
    });
  }

  hideChoice() {
    this.choiceWindow.setVisible(false);
    this.questionText.setVisible(false);
    this.yesButton.setVisible(false);
    this.yesText.setVisible(false);
    this.noButton.setVisible(false);
    this.noText.setVisible(false);

    this.textWindow.setVisible(true);
    this.speakerText.setVisible(true);
    this.dialogueText.setVisible(true);
  }

  showGameOver(message) {
    // BGMを止める
    this.stopBGM();

    // すべてのUIを隠す
    this.hideChoice();
    this.textWindow.setVisible(false);
    this.speakerText.setVisible(false);
    this.dialogueText.setVisible(false);
    this.clickIcon.setVisible(false);

    // 画面を赤黒く
    this.background.setFillStyle(0x220000);

    // GAME OVERテキスト
    const gameOverTitle = this.add.text(640, 250, 'GAME OVER', {
      fontSize: '72px',
      color: '#ff0000',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const gameOverMessage = this.add.text(640, 360, message, {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      align: 'center'
    }).setOrigin(0.5);

    // リトライボタン
    const retryButton = this.add.rectangle(640, 500, 300, 60, 0xff6400);
    retryButton.setStrokeStyle(2, 0xffffff);
    retryButton.setInteractive({ useHandCursor: true });

    const retryText = this.add.text(640, 500, '最初からやり直す', {
      fontSize: '24px',
      color: '#000000',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    retryButton.on('pointerover', () => {
      retryButton.setFillStyle(0xffaa00);
    });
    retryButton.on('pointerout', () => {
      retryButton.setFillStyle(0xff6400);
    });

    retryButton.on('pointerdown', () => {
      this.scene.restart();
    });
  }
}
