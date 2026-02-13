export default class FlameQueenBossScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FlameQueenBossScene' });
  }

  create() {
    console.log('=== FlameQueenBossScene: create started ===');
    
    // 背景（戦闘フィールド）
    const bg = this.add.rectangle(640, 360, 1280, 720, 0x1a0a2a);
    
    // タイトル
    const title = this.add.text(640, 50, 'BOSS: 炎の女王', {
      fontSize: '48px',
      color: '#ff3366',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // 炎の女王
    this.queen = this.add.rectangle(640, 250, 100, 150, 0xff3366);
    this.queen.setStrokeStyle(5, 0xffff00);
    
    const queenLabel = this.add.text(640, 350, '炎の女王', {
      fontSize: '24px',
      color: '#ffff00',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // 炎エフェクト
    this.flames = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const flame = this.add.circle(
        640 + Math.cos(angle) * 80,
        250 + Math.sin(angle) * 100,
        15,
        0xff6600
      );
      this.flames.push(flame);
    }
    
    // 炎を回転
    this.time.addEvent({
      delay: 50,
      callback: () => {
        this.flames.forEach((flame, index) => {
          const angle = (index / 12) * Math.PI * 2 + this.time.now * 0.002;
          const radius = 80 + Math.sin(this.time.now * 0.003 + index) * 20;
          flame.x = 640 + Math.cos(angle) * radius;
          flame.y = 250 + Math.sin(angle) * (100 + Math.sin(this.time.now * 0.003) * 20);
        });
      },
      loop: true
    });
    
    // フジ（プレイヤー）
    this.player = this.add.rectangle(640, 520, 50, 50, 0x00ffff);
    this.player.setStrokeStyle(3, 0xffffff);
    
    // HP バー（女王）
    this.queenHPBg = this.add.rectangle(640, 120, 600, 30, 0x333333);
    this.queenHPBg.setStrokeStyle(3, 0xffffff);
    
    this.queenHPBar = this.add.rectangle(340, 120, 600, 30, 0xff3366);
    this.queenHPBar.setOrigin(0, 0.5);
    
    this.queenHPText = this.add.text(640, 120, 'HP: 100%', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // HP バー（プレイヤー）
    this.playerHPBg = this.add.rectangle(640, 600, 400, 20, 0x333333);
    this.playerHPBg.setStrokeStyle(2, 0xffffff);
    
    this.playerHPBar = this.add.rectangle(440, 600, 400, 20, 0x00ffff);
    this.playerHPBar.setOrigin(0, 0.5);
    
    // セリフボックス
    this.dialogueBox = this.add.rectangle(640, 670, 1200, 80, 0x000000, 0.9);
    this.dialogueText = this.add.text(640, 670, '', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      align: 'center',
      wordWrap: { width: 1100 }
    }).setOrigin(0.5);
    
    // 戦闘フェーズ
    this.phase = 1;
    this.queenHP = 100;
    this.playerHP = 100;
    
    // セリフ配列（フェーズ別）
    this.phase1Dialogues = [
      { speaker: '炎の女王', text: '停滞こそ平和だ！変化は悪だ！' },
      { speaker: '炎の女王', text: '首をはねよ！' },
      { speaker: 'フジ', text: '（攻撃）', action: 'attack' },
    ];
    
    this.phase2Dialogues = [
      { speaker: '炎の女王', text: 'ぐっ......！' },
      { speaker: 'フジ', text: '女王の炎が......弱まっている？' },
      { speaker: '炎の女王', text: '変化は......苦しみしか......生まない......' },
      { speaker: 'フジ', text: '（さらに攻撃）', action: 'attack' },
    ];
    
    this.phase3Dialogues = [
      { speaker: '炎の女王', text: '......ああ......' },
      { speaker: 'フジ', text: '！ 女王の髪が......赤い......？' },
      { speaker: '炎の女王', text: '......私は......一人で......戦った......' },
      { speaker: '炎の女王', text: '誰も......来てくれなかった......' },
      { speaker: '炎の女王', text: 'だから......もう......変化なんて......' },
      { speaker: 'フジ', text: 'あなたは......ツバキ......？' },
      { speaker: '炎の女王', text: '......そうだった......私は......' },
      { speaker: '炎の女王', text: '......今度は......一人じゃない......' },
      { speaker: null, text: '（炎の女王の体が光に包まれる）' },
      { speaker: null, text: '（女王は静かに消えていった......）' },
    ];
    
    this.currentDialogueSet = this.phase1Dialogues;
    this.currentDialogue = 0;
    
    // クリックで戦闘進行
    this.input.on('pointerdown', () => {
      this.advanceBattle();
    });
    
    // 初回表示
    this.time.delayedCall(1000, () => {
      this.showDialogue();
    });
    
    console.log('=== FlameQueenBossScene: create finished ===');
  }

  showDialogue() {
    if (this.currentDialogue >= this.currentDialogueSet.length) {
      if (this.phase === 1) {
        this.startPhase2();
      } else if (this.phase === 2) {
        this.startPhase3();
      } else {
        this.endBattle();
      }
      return;
    }
    
    const dialogue = this.currentDialogueSet[this.currentDialogue];
    
    // テキスト表示
    if (dialogue.speaker) {
      this.dialogueText.setText(`${dialogue.speaker}：「${dialogue.text}」`);
    } else {
      this.dialogueText.setText(dialogue.text);
    }
  }

  advanceBattle() {
    const dialogue = this.currentDialogueSet[this.currentDialogue];
    
    // プレイヤーの攻撃
    if (dialogue?.action === 'attack') {
      this.queenHP -= 30;
      this.updateQueenHP();
      
      // 攻撃エフェクト
      this.cameras.main.shake(200, 0.01);
      
      this.tweens.add({
        targets: this.queen,
        alpha: 0.5,
        duration: 100,
        yoyo: true,
        repeat: 2
      });
    }
    
    this.currentDialogue++;
    this.showDialogue();
  }

  updateQueenHP() {
    const hpPercent = Math.max(0, this.queenHP);
    
    this.tweens.add({
      targets: this.queenHPBar,
      width: (hpPercent / 100) * 600,
      duration: 500,
      ease: 'Power2'
    });
    
    this.queenHPText.setText(`HP: ${Math.floor(hpPercent)}%`);
  }

  startPhase2() {
    console.log('=== Phase 2 started ===');
    this.phase = 2;
    this.currentDialogueSet = this.phase2Dialogues;
    this.currentDialogue = 0;
    
    // 炎を弱める
    this.flames.forEach(flame => {
      this.tweens.add({
        targets: flame,
        alpha: 0.5,
        scale: 0.7,
        duration: 1000
      });
    });
    
    this.time.delayedCall(500, () => {
      this.showDialogue();
    });
  }

  startPhase3() {
    console.log('=== Phase 3 started ===');
    this.phase = 3;
    this.currentDialogueSet = this.phase3Dialogues;
    this.currentDialogue = 0;
    
    // 炎をさらに弱める
    this.flames.forEach(flame => {
      this.tweens.add({
        targets: flame,
        alpha: 0.2,
        scale: 0.5,
        duration: 1000
      });
    });
    
    // 女王の色を変える（赤い髪が見える）
    this.queen.setFillStyle(0xff6666);
    
    this.time.delayedCall(500, () => {
      this.showDialogue();
    });
  }

  endBattle() {
    console.log('=== Battle ended ===');
    
    this.dialogueText.setText('');
    
    // 女王を消す
    this.tweens.add({
      targets: [this.queen, ...this.flames],
      alpha: 0,
      duration: 3000,
      ease: 'Power2'
    });
    
    // 光のエフェクト
    const light = this.add.circle(640, 250, 10, 0xffffff);
    this.tweens.add({
      targets: light,
      radius: 300,
      alpha: 0,
      duration: 3000
    });
    
    // 次のシーンへ
    this.time.delayedCall(4000, () => {
      this.cameras.main.fadeOut(1000, 255, 255, 255);
      
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.stop('FlameQueenBossScene');
        this.scene.start('DoorToAgairudoScene');
      });
    });
  }
}
