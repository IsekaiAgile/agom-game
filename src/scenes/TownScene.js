export default class TownScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TownScene' });
  }

  preload() {
    this.load.audio('town-bgm', 'audio/fantasy-bgm.mp3');
  }

  create() {
    console.log('TownScene: create started');
    
    // BGM
    this.bgm = this.sound.add('town-bgm', {
      loop: true,
      volume: 0.3
    });
    this.bgm.play();
    
    // フェードイン
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    
    // 背景
    const bg = this.add.rectangle(640, 360, 1280, 720, 0x4a4a4a);
    
    // 道
    const road = this.add.rectangle(640, 360, 120, 720, 0x888888);
    
    // === 建物 ===
    
    // 灯火亭（食堂）- 中央
    this.restaurant = this.add.rectangle(640, 400, 220, 180, 0xaa6633);
    this.restaurant.setStrokeStyle(4, 0x000000);
    
    const restaurantEmoji = this.add.text(640, 380, '🍜', {
      fontSize: '48px'
    }).setOrigin(0.5);
    
    const restaurantName = this.add.text(640, 440, '灯火亭', {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    
    // オワリ城 - 上
    const castle = this.add.rectangle(640, 120, 280, 180, 0x555555);
    castle.setStrokeStyle(4, 0x000000);
    
    const castleEmoji = this.add.text(640, 100, '🏯', {
      fontSize: '48px'
    }).setOrigin(0.5);
    
    const castleName = this.add.text(640, 160, 'オワリ城', {
      fontSize: '32px',
      color: '#ffff00',
      fontFamily: 'sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    
    // 武器屋 - 左
    const weaponShop = this.add.rectangle(350, 550, 180, 150, 0x996644);
    weaponShop.setStrokeStyle(4, 0x000000);
    
    const weaponEmoji = this.add.text(350, 535, '⚔️', {
      fontSize: '36px'
    }).setOrigin(0.5);
    
    const weaponName = this.add.text(350, 590, '武器屋', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5);
    
    // 宿屋 - 右
    const inn = this.add.rectangle(930, 550, 180, 150, 0x8888aa);
    inn.setStrokeStyle(4, 0x000000);
    
    const innEmoji = this.add.text(930, 535, '🛏️', {
      fontSize: '36px'
    }).setOrigin(0.5);
    
    const innName = this.add.text(930, 590, '宿屋', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5);
    
    // === NPCを配置 ===
    
    // NPC1: 妖精（左上）
    this.npc1 = this.createNPC(300, 250, '🧚', 
      '見て、あの子！\n羽がないのにドラゴン！？');
    
    // NPC2: 老人（広場）
    this.npc2 = this.createNPC(640, 300, '👴', 
      '昔はこの街も賑やかでな…\n今は皆、挑戦することを忘れてしまった');
    
    // NPC3: 衛兵（城の前）
    this.npc3 = this.createNPC(640, 220, '💂', 
      '異邦人、身分証明書を提示せよ。\n……ふむ、問題ないな');
    
    // NPC4: 妖精（右）
    this.npc4 = this.createNPC(980, 350, '🧚', 
      '最近、街がつまらないのよね\nでも、それを言うと幸福度が下がるから黙ってるの');
    
    // NPC5: 常連客（食堂の前）
    this.npc5 = this.createNPC(640, 500, '👨', 
      '灯火亭の料理は美味いぞ。\n店主のゴンザさんは良い人だ');
    
    // === プレイヤー ===
    
    const job = this.registry.get('playerJob') || 'warrior';
    const playerColor = job === 'warrior' ? 0xff0000 : 
                        job === 'mage' ? 0x0000ff : 0x00ff00;
    
    this.player = this.add.rectangle(640, 650, 35, 35, playerColor);
    this.player.setStrokeStyle(3, 0xffffff);
    this.player.setDepth(10);
    
    // アジャドラ
    this.ajadra = this.add.text(680, 630, '🐉', {
      fontSize: '32px'
    });
    this.ajadra.setDepth(10);
    
    // === 操作 ===
    
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    // 会話表示用
    this.dialogueBox = null;
    this.currentNPC = null;
    
    // 導入テキスト
    this.showIntroduction();
  }

  createNPC(x, y, emoji, dialogue) {
    const npc = this.add.text(x, y, emoji, {
      fontSize: '40px'
    }).setOrigin(0.5);
    npc.setData('dialogue', dialogue);
    return npc;
  }

  update() {
    // プレイヤー移動
    const speed = 4;
    
    if (this.cursors.left.isDown) {
      this.player.x -= speed;
    }
    if (this.cursors.right.isDown) {
      this.player.x += speed;
    }
    if (this.cursors.up.isDown) {
      this.player.y -= speed;
    }
    if (this.cursors.down.isDown) {
      this.player.y += speed;
    }
    
    // 画面外に出ないように制限
    this.player.x = Phaser.Math.Clamp(this.player.x, 20, 1260);
    this.player.y = Phaser.Math.Clamp(this.player.y, 20, 700);
    
    // アジャドラも同じ範囲に
    this.ajadra.x = this.player.x + 40;
    this.ajadra.y = this.player.y - 20;
    
    // NPCとの距離チェック
    const npcs = [this.npc1, this.npc2, this.npc3, this.npc4, this.npc5];
    let nearNPC = null;
    
    npcs.forEach(npc => {
      const distance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y, npc.x, npc.y
      );
      
      if (distance < 80) {
        nearNPC = npc;
      }
    });
    
    // スペースキーで会話
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      if (nearNPC) {
        this.showDialogue(nearNPC.getData('dialogue'));
      } else {
        // 灯火亭の近く？
        const distToRestaurant = Phaser.Math.Distance.Between(
          this.player.x, this.player.y, 640, 400
        );
        
        if (distToRestaurant < 150) {
          this.enterRestaurant();
        }
      }
    }
  }

  showIntroduction() {
    const overlay = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.8);
    overlay.setDepth(100);
    
    const texts = [
      'ここは、オワリの街。',
      'アガイルドの入り口にある宿場町だ。',
      '矢印キーで移動、スペースキーで調べる。',
      'まずは、灯火亭で仕事を探そう。'
    ];
    
    let currentIndex = 0;
    
    const textObject = this.add.text(640, 360, texts[0], {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      align: 'center',
      wordWrap: { width: 1000 }
    }).setOrigin(0.5);
    textObject.setDepth(101);
    
    const clickIcon = this.add.text(640, 500, '▼ クリックで続ける', {
      fontSize: '24px',
      color: '#ffaa00',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5);
    clickIcon.setDepth(101);
    
    this.tweens.add({
      targets: clickIcon,
      alpha: 0.3,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
    
    const advance = () => {
      currentIndex++;
      
      if (currentIndex >= texts.length) {
        overlay.destroy();
        textObject.destroy();
        clickIcon.destroy();
        this.input.off('pointerdown', advance);
      } else {
        textObject.setText(texts[currentIndex]);
      }
    };
    
    this.input.on('pointerdown', advance);
  }

  showDialogue(text) {
    // 既存の会話ボックスを削除
    if (this.dialogueBox) {
      this.dialogueBox.destroy();
      this.dialogueText.destroy();
    }
    
    // 会話ボックス
    this.dialogueBox = this.add.rectangle(640, 600, 1000, 100, 0x000000, 0.8);
    this.dialogueBox.setStrokeStyle(2, 0xffffff);
    this.dialogueBox.setDepth(50);
    
    this.dialogueText = this.add.text(640, 600, text, {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      align: 'center',
      wordWrap: { width: 950 }
    }).setOrigin(0.5);
    this.dialogueText.setDepth(51);
    
    // 2秒後に消える
    this.time.delayedCall(3000, () => {
      if (this.dialogueBox) {
        this.dialogueBox.destroy();
        this.dialogueText.destroy();
        this.dialogueBox = null;
        this.dialogueText = null;
      }
    });
  }

  enterRestaurant() {
    if (this.bgm) {
      this.bgm.stop();
    }
    
    this.cameras.main.fadeOut(1000, 0, 0, 0);
    
    this.cameras.main.once('camerafadeoutcomplete', () => {
      alert('灯火亭に入った！\n\n（食堂シーンを実装予定）');
      this.scene.stop('TownScene');
      this.scene.start('DebugMenuScene');
    });
  }
}
