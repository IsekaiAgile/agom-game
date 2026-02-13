import KanriDragon from './components/KanriDragon.js';
import TaxMeter from './components/TaxMeter.js';

/**
 * Scene1: 逸脱シーン（完全版）
 * オープニング会話 → フィールド探索 → エンディング会話
 */
export default class DeviationScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DeviationScene' });
    this.phase = 'opening'; // 'opening', 'field', 'ending'
    this.startTime = null;
    this.loopCount = 0;
    this.playerCanMove = false;
    this.playerDirection = 'down';
  }

  preload() {
    // 背景
    this.load.image('deviation-bg', 'images/backgrounds/deviation-bg-pixel.png');
    
    // 立ち絵（既存画像を一旦使用）
    this.load.image('guard-portrait', 'images/characters/guard.png');
    this.load.image('fuji-portrait', 'images/characters/fuji.png');
    this.load.image('kanri-portrait', 'images/characters/kanri-dragon.png');
    
    // フィールド用キャラ
    this.load.image('guard', 'images/characters/guard.png');
    this.load.image('fuji-up', 'images/characters/fuji-up.png');
    this.load.image('fuji-down', 'images/characters/fuji-down.png');
    this.load.image('fuji-left', 'images/characters/fuji-left.png');
    this.load.image('fuji-right', 'images/characters/fuji-right.png');
    
    // カンリドラゴン（UI用）
    this.load.image('kanri-dragon', 'images/characters/kanri-dragon.png');
  }

  create() {
    console.log('=== DeviationScene: create started ===');
    
    // 停滞税を初期化
    if (!this.registry.has('teitaiTax')) {
      this.registry.set('teitaiTax', 0);
    }
    
    // 背景
    this.bg = this.add.image(640, 360, 'deviation-bg');
    this.bg.setDisplaySize(1280, 720);
    
    // タイトル
    this.titleText = this.add.text(640, 40, '逸脱', {
      fontSize: '42px',
      color: '#ffdd00',
      fontFamily: 'sans-serif',
      fontStyle: 'bold',
      backgroundColor: '#000000aa',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);
    
    // カンリドラゴン
    this.kanri = new KanriDragon(this);
    this.kanri.create();
    
    // 停滞税メーター
    this.taxMeter = new TaxMeter(this);
    this.taxMeter.create();
    this.taxMeter.update(this.registry.get('teitaiTax') || 0);
    
    // 各Phase用の要素を作成（最初は非表示）
    this.createNovelElements();
    this.createFieldElements();
    
    // オープニングから開始
    this.startOpening();
    
    console.log('=== DeviationScene: create finished ===');
  }

  createNovelElements() {
    // 立ち絵（規程兵 - 左）
    this.guardPortrait = this.add.image(300, 400, 'guard-portrait');
    this.guardPortrait.setScale(1.5);
    this.guardPortrait.setAlpha(0.5);
    this.guardPortrait.setVisible(false);
    
    // 立ち絵（フジ - 右）
    this.fujiPortrait = this.add.image(980, 400, 'fuji-portrait');
    this.fujiPortrait.setScale(1.5);
    this.fujiPortrait.setAlpha(0.5);
    this.fujiPortrait.setVisible(false);
    
    // 立ち絵（カンリドラゴン - 右上）
    this.kanriPortrait = this.add.image(980, 300, 'kanri-portrait');
    this.kanriPortrait.setScale(1.2);
    this.kanriPortrait.setAlpha(0.5);
    this.kanriPortrait.setVisible(false);
    
    // セリフボックス
    this.dialogueBox = this.add.rectangle(640, 600, 1200, 200, 0x000000, 0.95);
    this.dialogueBox.setStrokeStyle(3, 0x6633aa);
    this.dialogueBox.setVisible(false);
    
    // セリフテキスト
    this.dialogueText = this.add.text(100, 560, '', {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      align: 'left',
      wordWrap: { width: 1080 },
      lineSpacing: 8
    });
    this.dialogueText.setVisible(false);
    
    // 話者名ボックス
    this.speakerNameBox = this.add.rectangle(150, 510, 200, 50, 0x6633aa, 0.9);
    this.speakerNameBox.setOrigin(0.5);
    this.speakerNameBox.setVisible(false);
    
    this.speakerName = this.add.text(150, 510, '', {
      fontSize: '24px',
      color: '#ffdd00',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.speakerName.setVisible(false);
    
    // クリックプロンプト
    this.clickPrompt = this.add.text(1150, 680, '▼ クリック', {
      fontSize: '20px',
      color: '#ffdd00',
      fontFamily: 'sans-serif'
    }).setOrigin(1, 1);
    this.clickPrompt.setVisible(false);
    
    this.tweens.add({
      targets: this.clickPrompt,
      alpha: 0.3,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
  }

  createFieldElements() {
    // 規程兵
    this.guard = this.add.image(250, 350, 'guard');
    this.guard.setScale(0.5);
    this.guard.setVisible(false);
    
    this.guardTween = this.tweens.add({
      targets: this.guard,
      y: 340,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      paused: true
    });
    
    // プレイヤー
    this.playerX = 640;
    this.playerY = 620;
    this.player = this.add.sprite(this.playerX, this.playerY, 'fuji-down');
    this.player.setScale(2);
    this.player.setVisible(false);
    
    // キーボード入力
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    
    // ゴールエリア
    this.mainGoalArea = { x: 200, y: 100, radius: 70 };
    this.sideGoalArea = { x: 1000, y: 150, radius: 90 };
    
    // ゴールマーカー
    this.mainGoalMarker = this.add.circle(
      this.mainGoalArea.x, 
      this.mainGoalArea.y, 
      this.mainGoalArea.radius, 
      0xffdd00, 
      0.4
    );
    this.mainGoalMarker.setStrokeStyle(4, 0xffdd00);
    this.mainGoalMarker.setVisible(false);
    
    this.mainGoalTween = this.tweens.add({
      targets: this.mainGoalMarker,
      alpha: 0.2,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      paused: true
    });
    
    this.sideGoalMarker = this.add.circle(
      this.sideGoalArea.x,
      this.sideGoalArea.y,
      this.sideGoalArea.radius,
      0x00ff00,
      0.4
    );
    this.sideGoalMarker.setStrokeStyle(4, 0x00ff00);
    this.sideGoalMarker.setVisible(false);
    
    this.sideGoalTween = this.tweens.add({
      targets: this.sideGoalMarker,
      alpha: 0.2,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      paused: true
    });
  }

  // ========================================
  // Phase 1: オープニング会話
  // ========================================

  startOpening() {
    console.log('=== Phase: Opening ===');
    this.phase = 'opening';
    
    // 背景を暗く
    this.bg.setAlpha(0.5);
    
    // ノベル要素を表示
    this.guardPortrait.setVisible(true);
    this.fujiPortrait.setVisible(true);
    this.dialogueBox.setVisible(true);
    this.dialogueText.setVisible(true);
    this.speakerNameBox.setVisible(true);
    this.speakerName.setVisible(true);
    this.clickPrompt.setVisible(true);
    
    // 会話データ
    this.dialogues = [
      { speaker: '規程兵', char: 'guard', text: '停止！' },
      { speaker: '規程兵', char: 'guard', text: '前方に2つの道がある' },
      { speaker: '規程兵', char: 'guard', text: '左の規定路を進め。それが規則だ' },
      { speaker: 'フジ', char: 'fuji', text: '......分かった' }
    ];
    
    this.currentDialogue = 0;
    this.showDialogue();
    
    // クリックイベント
    this.input.on('pointerdown', this.onOpeningClick, this);
  }

  showDialogue() {
    const dialogue = this.dialogues[this.currentDialogue];
    
    this.speakerName.setText(dialogue.speaker);
    this.dialogueText.setText(dialogue.text);
    
    // 立ち絵の強調
    this.guardPortrait.setAlpha(0.5);
    this.fujiPortrait.setAlpha(0.5);
    
    if (dialogue.char === 'guard') {
      this.guardPortrait.setAlpha(1.0);
      this.tweens.add({
        targets: this.guardPortrait,
        scaleX: 0.85,
        scaleY: 0.85,
        duration: 200,
        yoyo: true
      });
    } else if (dialogue.char === 'fuji') {
      this.fujiPortrait.setAlpha(1.0);
      this.tweens.add({
        targets: this.fujiPortrait,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 200,
        yoyo: true
      });
    }
  }

  onOpeningClick() {
    this.currentDialogue++;
    
    if (this.currentDialogue < this.dialogues.length) {
      this.showDialogue();
    } else {
      this.endOpening();
    }
  }

  endOpening() {
    // クリックイベント削除
    this.input.off('pointerdown', this.onOpeningClick, this);
    
    // ノベル要素を非表示
    this.guardPortrait.setVisible(false);
    this.fujiPortrait.setVisible(false);
    this.dialogueBox.setVisible(false);
    this.dialogueText.setVisible(false);
    this.speakerNameBox.setVisible(false);
    this.speakerName.setVisible(false);
    this.clickPrompt.setVisible(false);
    
    // 背景を明るく
    this.bg.setAlpha(1.0);
    
    // フィールドPhaseへ
    this.startField();
  }

  // ========================================
  // Phase 2: フィールド探索
  // ========================================

  startField() {
    console.log('=== Phase: Field ===');
    this.phase = 'field';
    
    // タイマー開始
    this.startTime = Date.now();
    this.loopCount = 0;
    
    // フィールド要素を表示
    this.guard.setVisible(true);
    this.guardTween.resume();
    
    this.player.setVisible(true);
    
    this.mainGoalMarker.setVisible(true);
    this.mainGoalTween.resume();
    
    this.sideGoalMarker.setVisible(true);
    this.sideGoalTween.resume();
    
    // 説明テキスト
    const pathGuide = this.add.text(640, 100, '← 左の明るい道 = 規定路　　右の暗い森 = 脇道 →', {
      fontSize: '20px',
      color: '#ffdd00',
      fontFamily: 'sans-serif',
      backgroundColor: '#000000aa',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5);
    
    this.time.delayedCall(5000, () => {
      this.tweens.add({
        targets: pathGuide,
        alpha: 0,
        duration: 1000,
        onComplete: () => pathGuide.destroy()
      });
    });
    
    const instruction = this.add.text(640, 650, 'WASD または 矢印キーで移動', {
      fontSize: '24px',
      color: '#ffdd00',
      fontFamily: 'sans-serif',
      backgroundColor: '#000000aa',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: instruction,
      alpha: 0,
      duration: 3000,
      delay: 3000,
      onComplete: () => instruction.destroy()
    });
    
    // 移動を有効化
    this.playerCanMove = true;
  }

  updatePlayerSprite() {
    let newTexture = null;
    
    switch(this.playerDirection) {
      case 'up': newTexture = 'fuji-up'; break;
      case 'down': newTexture = 'fuji-down'; break;
      case 'left': newTexture = 'fuji-left'; break;
      case 'right': newTexture = 'fuji-right'; break;
    }
    
    if (newTexture && this.player.texture.key !== newTexture) {
      this.player.setTexture(newTexture);
    }
  }

  update() {
    if (this.phase !== 'field' || !this.playerCanMove) return;
    
    const speed = 3;
    let vx = 0;
    let vy = 0;
    let moving = false;
    
    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      vx -= 1;
      this.playerDirection = 'left';
      moving = true;
    }
    if (this.cursors.right.isDown || this.wasd.right.isDown) {
      vx += 1;
      this.playerDirection = 'right';
      moving = true;
    }
    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      vy -= 1;
      this.playerDirection = 'up';
      moving = true;
    }
    if (this.cursors.down.isDown || this.wasd.down.isDown) {
      vy += 1;
      this.playerDirection = 'down';
      moving = true;
    }
    
    if (vx !== 0 || vy !== 0) {
      const length = Math.sqrt(vx * vx + vy * vy);
      vx = (vx / length) * speed;
      vy = (vy / length) * speed;
      
      this.playerX += vx;
      this.playerY += vy;
    }
    
    this.playerX = Phaser.Math.Clamp(this.playerX, 100, 1180);
    this.playerY = Phaser.Math.Clamp(this.playerY, 100, 650);
    
    this.player.x = this.playerX;
    this.player.y = this.playerY;
    
    if (moving) {
      this.updatePlayerSprite();
    }
    
    this.checkGoal();
  }

  checkGoal() {
    const mainDist = Phaser.Math.Distance.Between(
      this.playerX, this.playerY,
      this.mainGoalArea.x, this.mainGoalArea.y
    );
    
    if (mainDist < this.mainGoalArea.radius) {
      this.reachMainGoal();
    }
    
    const sideDist = Phaser.Math.Distance.Between(
      this.playerX, this.playerY,
      this.sideGoalArea.x, this.sideGoalArea.y
    );
    
    if (sideDist < this.sideGoalArea.radius) {
      this.reachSideGoal();
    }
  }

  reachMainGoal() {
    if (!this.playerCanMove) return;
    
    console.log('Main goal reached, loop:', this.loopCount);
    
    this.playerCanMove = false;
    this.loopCount++;
    
    if (this.loopCount <= 3) {
      this.showLoopMessage(this.loopCount);
    } else {
      this.showResetButton();
    }
  }

  showLoopMessage(count) {
    const messages = {
      1: '規定路を進んだな。正しい',
      2: 'また規定路を進んだな。非常に正しい',
      3: '......規定路以外の道もあるのだが'
    };
    
    const message = this.add.text(640, 360, messages[count], {
      fontSize: '32px',
      color: '#ffdd00',
      fontFamily: 'sans-serif',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: this.guard,
      scaleX: 0.52,
      scaleY: 0.52,
      duration: 200,
      yoyo: true
    });
    
    if (count === 3) {
      const hint = this.add.text(640, 420, 'ヒント: 右の暗い森を探せ', {
        fontSize: '24px',
        color: '#ff6666',
        fontFamily: 'sans-serif',
        backgroundColor: '#000000',
        padding: { x: 15, y: 8 }
      }).setOrigin(0.5);
      
      this.time.delayedCall(3000, () => hint.destroy());
    }
    
    this.time.delayedCall(2000, () => {
      message.destroy();
      this.resetToStart();
    });
  }

  showResetButton() {
    const resetBtn = this.add.rectangle(640, 360, 200, 50, 0xff3366);
    resetBtn.setStrokeStyle(3, 0xffffff);
    resetBtn.setInteractive({ useHandCursor: true });
    
    const resetText = this.add.text(640, 360, 'リセット', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: [resetBtn, resetText],
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
    
    resetBtn.on('pointerdown', () => {
      this.scene.restart();
    });
  }

  resetToStart() {
    this.playerX = 640;
    this.playerY = 620;
    this.player.x = this.playerX;
    this.player.y = this.playerY;
    this.playerDirection = 'down';
    this.player.setTexture('fuji-down');
    
    this.playerCanMove = true;
  }

  reachSideGoal() {
    if (!this.playerCanMove) return;
    
    console.log('Side goal reached - SUCCESS');
    
    this.playerCanMove = false;
    
    // 経過時間と税計算
    const elapsedTime = (Date.now() - this.startTime) / 1000;
    const baseTax = 15;
    let bonusTax = 0;
    if (elapsedTime <= 15) {
      bonusTax = 10;
    } else if (elapsedTime <= 40) {
      bonusTax = 5;
    }
    const totalTax = baseTax + bonusTax;
    
    console.log(`Time: ${elapsedTime.toFixed(1)}s, Base: ${baseTax}, Bonus: ${bonusTax}, Total: ${totalTax}`);
    
    // データを保存
    this.elapsedTime = elapsedTime;
    this.baseTax = baseTax;
    this.bonusTax = bonusTax;
    this.totalTax = totalTax;
    
    // フィールド要素を非表示
    this.guard.setVisible(false);
    this.guardTween.pause();
    this.player.setVisible(false);
    this.mainGoalMarker.setVisible(false);
    this.mainGoalTween.pause();
    this.sideGoalMarker.setVisible(false);
    this.sideGoalTween.pause();
    
    // エンディングPhaseへ
    this.startEnding();
  }

  // ========================================
  // Phase 3: エンディング会話
  // ========================================

  startEnding() {
    console.log('=== Phase: Ending ===');
    this.phase = 'ending';
    
    // 背景を暗く
    this.bg.setAlpha(0.5);
    
    // ノベル要素を表示
    this.guardPortrait.setVisible(true);
    this.fujiPortrait.setVisible(true);
    this.kanriPortrait.setVisible(true);
    this.dialogueBox.setVisible(true);
    this.dialogueText.setVisible(true);
    this.speakerNameBox.setVisible(true);
    this.speakerName.setVisible(true);
    this.clickPrompt.setVisible(true);
    
    // エンディング会話
    const speedComment = this.bonusTax === 10 ? '積極的アジャ' : 
                         this.bonusTax === 5 ? '慎重アジャ' : 
                         '非常に慎重アジャ';
    
    this.endingDialogues = [
      { speaker: '規程兵', char: 'guard', text: '逸脱した！規則違反だ！' },
      { speaker: 'カンリドラゴン', char: 'kanri', text: `停滞税+${this.totalTax}アジャ` },
      { speaker: 'カンリドラゴン', char: 'kanri', text: `（${this.elapsedTime.toFixed(1)}秒）${speedComment}` }
    ];
    
    this.currentDialogue = 0;
    this.showEndingDialogue();
    
    // クリックイベント
    this.input.on('pointerdown', this.onEndingClick, this);
  }

  showEndingDialogue() {
    const dialogue = this.endingDialogues[this.currentDialogue];
    
    this.speakerName.setText(dialogue.speaker);
    this.dialogueText.setText(dialogue.text);
    
    // 立ち絵の強調
    this.guardPortrait.setAlpha(0.5);
    this.fujiPortrait.setAlpha(0.5);
    this.kanriPortrait.setAlpha(0.5);
    
    if (dialogue.char === 'guard') {
      this.guardPortrait.setAlpha(1.0);
      this.tweens.add({
        targets: this.guardPortrait,
        scaleX: 0.85,
        scaleY: 0.85,
        duration: 200,
        yoyo: true,
        repeat: 2
      });
    } else if (dialogue.char === 'kanri') {
      this.kanriPortrait.setAlpha(1.0);
      this.tweens.add({
        targets: this.kanriPortrait,
        scaleX: 0.65,
        scaleY: 0.65,
        duration: 200,
        yoyo: true
      });
    }
    
    // 税メーター更新（2番目のセリフで）
    if (this.currentDialogue === 1) {
      this.taxMeter.addTax(this.totalTax, this.bonusTax > 0);
      this.kanri.recordTax(this.baseTax, this.bonusTax, this.elapsedTime);
    }
  }

  onEndingClick() {
    this.currentDialogue++;
    
    if (this.currentDialogue < this.endingDialogues.length) {
      this.showEndingDialogue();
    } else {
      this.endScene();
    }
  }

  endScene() {
    console.log('=== DeviationScene: Complete ===');
    
    // クリックイベント削除
    this.input.off('pointerdown', this.onEndingClick, this);
    
    // デバッグメニューに戻る（次のシーンができるまで）
    this.time.delayedCall(2000, () => {
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.stop('DeviationScene');
        this.scene.start('DebugMenuScene');
        // TODO: 次のシーンができたら以下に変更
        // this.scene.start('QuickDecisionScene');
      });
    });
  }
}
