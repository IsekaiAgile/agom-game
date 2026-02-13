export default class SizeChangeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SizeChangeScene' });
  }

  preload() {
    // 背景
    this.load.image('eligia-bg', 'images/eligia/leigua-bg.png');
    
    // キャラクター
    this.load.image('fuji', 'images/characters/fuji.png');
    this.load.image('ajadra', 'images/characters/ajadra.png');
    
    // アイテム
    this.load.image('bottle', 'images/eligia/bottle.png');
    this.load.image('cake', 'images/eligia/cake.png');
    this.load.image('door', 'images/eligia/door.png');
  }

  create() {
    console.log('=== SizeChangeScene: create started ===');
    
    // サイズシステム
    this.sizeScale = [0.3, 0.6, 0.9, 1.2, 1.5]; // tiny, small, normal, large, huge
    this.sizeName = ['極小', '小', '普通', '大', '極大'];
    this.currentSizeIndex = 4; // huge から開始
    
    // アイテム回数
    this.bottleCount = 4;
    this.cakeCount = 4;
    
    // ゲーム開始フラグ
    this.gameStarted = false;
    this.dialogueComplete = false;
    
    // 背景
    const bg = this.add.image(640, 360, 'eligia-bg');
    bg.setDisplaySize(1280, 720);
    
    // アジャドラ（ヒントキャラ）
    this.ajadra = this.add.image(200, 300, 'ajadra');
    this.ajadra.setScale(0.35);
    this.ajadra.setInteractive({ useHandCursor: true });
    
    // アジャドラの浮遊アニメーション
    this.tweens.add({
      targets: this.ajadra,
      y: 290,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // アジャドラをクリックするとヒント
    this.ajadra.on('pointerdown', () => {
      if (this.dialogueComplete) {
        this.showHint();
      }
    });
    
    // タイトル
    const title = this.add.text(640, 40, 'サイズ変化の部屋', {
      fontSize: '42px',
      color: '#ffdd00',
      fontFamily: 'sans-serif',
      fontStyle: 'bold',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);
    
    // 扉
    this.door = this.add.image(640, 420, 'door');
    this.door.setScale(0.8);
    
    // 扉を光らせる
    this.tweens.add({
      targets: this.door,
      alpha: 0.8,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // テーブル
    const table = this.add.rectangle(180, 520, 280, 20, 0x663300);
    table.setStrokeStyle(3, 0x996633);
    
    // 瓶
    this.bottle = this.add.image(120, 450, 'bottle');
    this.bottle.setScale(0.3);
    this.bottle.setInteractive({ useHandCursor: true });
    
    // 瓶を光らせる
    this.tweens.add({
      targets: this.bottle,
      scaleX: 0.32,
      scaleY: 0.32,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // ケーキ
    this.cake = this.add.image(240, 460, 'cake');
    this.cake.setScale(0.3);
    this.cake.setInteractive({ useHandCursor: true });
    
    // ケーキを光らせる
    this.tweens.add({
      targets: this.cake,
      scaleX: 0.32,
      scaleY: 0.32,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 400
    });
    
    // フジ（プレイヤー）- 最初は極大
    this.fuji = this.add.image(950, 450, 'fuji');
    this.updatePlayerSize();
    
    // リセットボタン（最初は非表示）
    this.resetButton = this.add.rectangle(640, 680, 200, 50, 0xff3366);
    this.resetButton.setStrokeStyle(3, 0xffffff);
    this.resetButton.setInteractive({ useHandCursor: true });
    this.resetButton.setVisible(false);
    
    this.resetButtonText = this.add.text(640, 680, 'リセット', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.resetButtonText.setVisible(false);
    
    this.resetButton.on('pointerdown', () => {
      this.resetScene();
    });
    
    // 瓶のクリックイベント
    this.bottle.on('pointerdown', () => {
      if (this.dialogueComplete) {
        this.drinkBottle();
      }
    });
    
    // ケーキのクリックイベント
    this.cake.on('pointerdown', () => {
      if (this.dialogueComplete) {
        this.eatCake();
      }
    });
    
    // 扉のクリックイベント
    this.door.setInteractive({ useHandCursor: true });
    this.door.on('pointerdown', () => {
      if (this.dialogueComplete) {
        this.tryDoor();
      }
    });
    
    // セリフボックス
    this.dialogueBox = this.add.rectangle(640, 600, 1200, 200, 0x000000, 0.9);
    this.dialogueBox.setStrokeStyle(3, 0x6633aa);
    
    this.dialogueText = this.add.text(640, 570, '', {
      fontSize: '26px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      align: 'left',
      wordWrap: { width: 1100 }
    }).setOrigin(0.5, 0);
    
    this.speakerName = this.add.text(100, 510, '', {
      fontSize: '24px',
      color: '#ffdd00',
      fontFamily: 'sans-serif',
      fontStyle: 'bold',
      backgroundColor: '#000000',
      padding: { x: 15, y: 8 }
    });
    
    this.clickPrompt = this.add.text(1150, 680, '▼ クリック', {
      fontSize: '20px',
      color: '#ffdd00',
      fontFamily: 'sans-serif'
    }).setOrigin(1, 1);
    
    this.tweens.add({
      targets: this.clickPrompt,
      alpha: 0.3,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
    
    // オープニング会話（最小限）
    this.openingDialogues = [
      { speaker: 'フジ', text: '......ここは？' },
      { speaker: 'フジ', text: '体が......大きくなっている？' },
      { speaker: 'アジャドラ', text: '困ったらボクをクリックするドラ！' }
    ];
    
    this.currentDialogueIndex = 0;
    
    // クリックでセリフ進行
    this.input.on('pointerdown', () => {
      if (!this.dialogueComplete) {
        this.advanceDialogue();
      }
    });
    
    // 最初のセリフを表示
    this.time.delayedCall(500, () => {
      this.showDialogue();
    });
    
    console.log('=== SizeChangeScene: create finished ===');
  }

  showHint() {
    // 現在の状況に応じたヒント
    let hintText = '';
    
    if (this.currentSizeIndex === 2) {
      // 正解サイズ
      hintText = '完璧なサイズドラ！\n扉を試してみるドラ';
    } else if (this.currentSizeIndex > 2) {
      // 大きすぎる
      if (this.bottleCount > 0) {
        hintText = '大きすぎるドラね\n瓶を使ってみるドラ';
      } else {
        hintText = '瓶がないドラ...\nケーキで調整するしかないドラ';
      }
    } else if (this.currentSizeIndex < 2) {
      // 小さすぎる
      if (this.cakeCount > 0) {
        hintText = '小さすぎるドラね\nケーキを使ってみるドラ';
      } else {
        hintText = 'ケーキがないドラ...\n瓶で調整するしかないドラ';
      }
    }
    
    // 回数の情報も追加（押し付けがましくなく）
    if (this.bottleCount === 0 && this.cakeCount === 0) {
      hintText = 'アイテムがないドラ...\nリセットするしかないドラね';
    } else if (this.bottleCount <= 1 && this.cakeCount <= 1) {
      hintText += '\n\n...残りが少ないドラ';
    }
    
    // ヒントを表示
    const hint = this.add.text(200, 220, hintText, {
      fontSize: '18px',
      color: '#ffdd00',
      fontFamily: 'sans-serif',
      backgroundColor: '#000000',
      padding: { x: 10, y: 8 },
      align: 'center',
      wordWrap: { width: 250 }
    }).setOrigin(0.5);
    
    // アジャドラが喋る演出
    this.tweens.add({
      targets: this.ajadra,
      scaleX: 0.38,
      scaleY: 0.38,
      duration: 150,
      yoyo: true,
      repeat: 2
    });
    
    // ヒントが消える
    this.tweens.add({
      targets: hint,
      alpha: 0,
      y: 180,
      duration: 3000,
      delay: 2000,
      ease: 'Power2',
      onComplete: () => {
        hint.destroy();
      }
    });
  }

  showDialogue() {
    if (this.currentDialogueIndex >= this.openingDialogues.length) {
      this.endOpeningDialogue();
      return;
    }
    
    const dialogue = this.openingDialogues[this.currentDialogueIndex];
    
    this.speakerName.setText(dialogue.speaker);
    this.dialogueText.setText(dialogue.text);
    
    // 話者を光らせる
    if (dialogue.speaker === 'アジャドラ') {
      this.tweens.add({
        targets: this.ajadra,
        scaleX: 0.38,
        scaleY: 0.38,
        duration: 200,
        yoyo: true
      });
    } else if (dialogue.speaker === 'フジ') {
      this.tweens.add({
        targets: this.fuji,
        scaleX: this.sizeScale[this.currentSizeIndex] * 1.05,
        scaleY: this.sizeScale[this.currentSizeIndex] * 1.05,
        duration: 200,
        yoyo: true
      });
    }
  }

  advanceDialogue() {
    this.currentDialogueIndex++;
    this.showDialogue();
  }

  endOpeningDialogue() {
    console.log('Opening dialogue complete');
    this.dialogueComplete = true;
    
    // セリフボックスを隠す
    this.tweens.add({
      targets: [this.dialogueBox, this.dialogueText, this.speakerName, this.clickPrompt],
      alpha: 0,
      duration: 500,
      onComplete: () => {
        this.dialogueBox.setVisible(false);
        this.dialogueText.setVisible(false);
        this.speakerName.setVisible(false);
        this.clickPrompt.setVisible(false);
      }
    });
  }

  updatePlayerSize() {
    const targetScale = this.sizeScale[this.currentSizeIndex];
    const targetY = 450 + (1.5 - targetScale) * 100; // サイズに応じて位置調整
    
    this.tweens.add({
      targets: this.fuji,
      scaleX: targetScale,
      scaleY: targetScale,
      y: targetY,
      duration: 800,
      ease: 'Power2'
    });
  }

  drinkBottle() {
    if (this.bottleCount <= 0) {
      this.showMessage('瓶は空だ', '#ff3366');
      this.cameras.main.shake(200, 0.01);
      this.checkGameOver();
      return;
    }
    
    console.log('Drinking bottle');
    
    // 回数を減らす
    this.bottleCount--;
    
    // サイズを小さく
    if (this.currentSizeIndex > 0) {
      this.currentSizeIndex--;
    } else {
      this.showMessage('これ以上小さくなれない', '#66ccff');
      this.cameras.main.shake(200, 0.01);
      return;
    }
    
    // 飲む演出
    this.tweens.add({
      targets: this.bottle,
      scaleX: 0.25,
      scaleY: 0.25,
      alpha: 0.7,
      duration: 200,
      yoyo: true,
      onComplete: () => {
        this.bottle.setAlpha(1);
      }
    });
    
    // プレイヤーサイズ更新
    this.updatePlayerSize();
  }

  eatCake() {
    if (this.cakeCount <= 0) {
      this.showMessage('ケーキはもうない', '#ff3366');
      this.cameras.main.shake(200, 0.01);
      this.checkGameOver();
      return;
    }
    
    console.log('Eating cake');
    
    // 回数を減らす
    this.cakeCount--;
    
    // サイズを大きく
    if (this.currentSizeIndex < 4) {
      this.currentSizeIndex++;
    } else {
      this.showMessage('これ以上大きくなれない', '#ffcc99');
      this.cameras.main.shake(200, 0.01);
      return;
    }
    
    // 食べる演出
    this.tweens.add({
      targets: this.cake,
      scaleX: 0.25,
      scaleY: 0.25,
      alpha: 0.7,
      duration: 200,
      yoyo: true,
      onComplete: () => {
        this.cake.setAlpha(1);
      }
    });
    
    // プレイヤーサイズ更新
    this.updatePlayerSize();
  }

  checkGameOver() {
    // 両方使い切って、normalサイズでない場合
    if (this.bottleCount === 0 && this.cakeCount === 0 && this.currentSizeIndex !== 2) {
      this.showMessage('アイテムを使い切った...', '#ff3366');
      
      // リセットボタンを表示
      this.time.delayedCall(2000, () => {
        this.resetButton.setVisible(true);
        this.resetButtonText.setVisible(true);
        
        this.tweens.add({
          targets: [this.resetButton, this.resetButtonText],
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 500,
          yoyo: true,
          repeat: -1
        });
      });
    }
  }

  resetScene() {
    console.log('Resetting scene');
    this.scene.restart();
  }

  tryDoor() {
    console.log('Trying door, current size:', this.currentSizeIndex);
    
    if (this.currentSizeIndex === 2) {
      // 成功 - normal サイズ
      this.successDoor();
    } else if (this.currentSizeIndex < 2) {
      // 失敗（小さすぎ）
      this.showMessage('小さすぎる', '#66ccff');
      this.cameras.main.shake(300, 0.01);
    } else if (this.currentSizeIndex > 2) {
      // 失敗（大きすぎ）
      this.showMessage('大きすぎる', '#ff6666');
      this.cameras.main.shake(300, 0.01);
    }
  }

  showMessage(text, color = '#ffffff') {
    const message = this.add.text(640, 360, text, {
      fontSize: '32px',
      color: color,
      fontFamily: 'sans-serif',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 },
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: message,
      alpha: 0,
      y: 300,
      duration: 2000,
      ease: 'Power2',
      onComplete: () => {
        message.destroy();
      }
    });
  }

  successDoor() {
    console.log('=== Door opened successfully! ===');
    
    // 成功メッセージ
    const successText = this.add.text(640, 360, '扉が開いた！✨', {
      fontSize: '72px',
      color: '#00ff00',
      fontFamily: 'sans-serif',
      fontStyle: 'bold',
      backgroundColor: '#000000',
      padding: { x: 30, y: 15 }
    }).setOrigin(0.5);
    successText.setAlpha(0);
    
    this.tweens.add({
      targets: successText,
      alpha: 1,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 500
    });
    
    // 扉が光る
    this.tweens.add({
      targets: this.door,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 2000
    });
    
    // 次のシーンへ
    this.time.delayedCall(2500, () => {
      this.cameras.main.fadeOut(1000, 255, 255, 255);
      
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.stop('SizeChangeScene');
        this.scene.start('TeaPartyScene');
      });
    });
  }
}
