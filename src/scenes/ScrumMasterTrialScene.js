export default class ScrumMasterTrialScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ScrumMasterTrialScene' });
  }

  preload() {
    this.load.image('trial-bg-far', 'images/trial/bg-far.png');
    this.load.image('trial-bg-mid', 'images/trial/bg-mid.png');
    this.load.audio('trial-bgm', 'audio/trial-bgm.mp3');
  }

  create() {
    console.log('ScrumMasterTrialScene: create started');
    
    this.bgm = this.sound.add('trial-bgm', {
      loop: true,
      volume: 0.5
    });
    this.bgm.play();
    
    // 背景
    this.bgFar = this.add.tileSprite(640, 360, 1280, 720, 'trial-bg-far');
    this.bgFar.setScrollFactor(0.3);
    
    this.bgMid = this.add.tileSprite(640, 360, 1280, 720, 'trial-bg-mid');
    this.bgMid.setScrollFactor(0.6);
    
    // タイトル
    const title = this.add.text(640, 100, '🟢 スクラムマスターの試練', {
      fontSize: '48px',
      color: '#00ff00',
      fontFamily: 'sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);
    title.setScrollFactor(0);
    title.setDepth(100);
    
    const desc = this.add.text(640, 160, '仲間と協力してゴールを目指せ！', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    desc.setScrollFactor(0);
    desc.setDepth(100);
    
    this.time.delayedCall(3000, () => {
      this.tweens.add({
        targets: [title, desc],
        alpha: 0,
        duration: 1000,
        onComplete: () => {
          title.destroy();
          desc.destroy();
        }
      });
    });
    
    this.physics.world.setBounds(0, 0, 3000, 720);
    
    // 地面
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 680, null).setDisplaySize(800, 80).setTint(0x44ff44);
    this.platforms.create(1200, 680, null).setDisplaySize(800, 80).setTint(0x44ff44);
    this.platforms.create(2000, 680, null).setDisplaySize(800, 80).setTint(0x44ff44);
    this.platforms.create(2800, 680, null).setDisplaySize(400, 80).setTint(0x44ff44);
    
    this.platforms.create(900, 580, null).setDisplaySize(200, 40).setTint(0x88ff88);
    this.platforms.create(1600, 520, null).setDisplaySize(200, 40).setTint(0x88ff88);
    this.platforms.create(2200, 480, null).setDisplaySize(200, 40).setTint(0x88ff88);
    
    // プレイヤー（緑の四角 = スクラムマスター）
    this.player = this.physics.add.sprite(100, 500, null);
    this.player.setDisplaySize(35, 35);
    this.player.setTint(0x00ff00);
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    
    // 仲間NPC（青い四角）
    this.allies = this.physics.add.group();
    
    for (let i = 0; i < 3; i++) {
      const x = 200 + (i * 100);
      const ally = this.allies.create(x, 600, null);
      ally.setDisplaySize(30, 30);
      ally.setTint(0x00aaff);
      ally.setBounce(0.1);
      ally.setCollideWorldBounds(true);
      ally.setData('following', false);
    }
    
    // 敵
    this.enemies = this.physics.add.group();
    
    for (let i = 0; i < 4; i++) {
      const x = 800 + (i * 600);
      const enemy = this.enemies.create(x, 600, null);
      enemy.setDisplaySize(35, 35);
      enemy.setTint(0xff0000);
      enemy.setBounce(1);
      enemy.setCollideWorldBounds(true);
      enemy.setVelocityX(Phaser.Math.Between(-150, 150));
    }
    
    // ゴール
    this.goal = this.physics.add.sprite(2900, 600, null);
    this.goal.setDisplaySize(60, 80);
    this.goal.setTint(0x00ff00);
    this.goal.setImmovable(true);
    
    // 衝突判定
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.allies, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.overlap(this.player, this.allies, this.recruitAlly, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);
    this.physics.add.overlap(this.allies, this.enemies, this.allyHitEnemy, null, this);
    this.physics.add.overlap(this.player, this.goal, this.reachGoal, null, this);
    
    this.cameras.main.setBounds(0, 0, 3000, 720);
    this.cameras.main.startFollow(this.player);
    
    this.cursors = this.input.keyboard.createCursorKeys();
    
    this.createTouchControls();
    
    this.isGameOver = false;
  }

  update() {
    if (this.isGameOver) return;
    
    // 移動（バランス型）
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-220);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(220);
    } else {
      this.player.setVelocityX(0);
    }
    
    // ジャンプ
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-400);
    }
    
    // 仲間を追従させる
    this.allies.children.entries.forEach(ally => {
      if (ally.getData('following')) {
        const distance = Phaser.Math.Distance.Between(ally.x, ally.y, this.player.x, this.player.y);
        
        if (distance > 50) {
          this.physics.moveToObject(ally, this.player, 200);
        } else {
          ally.setVelocity(0, 0);
        }
      }
    });
    
    this.bgFar.tilePositionX = this.cameras.main.scrollX * 0.3;
    this.bgMid.tilePositionX = this.cameras.main.scrollX * 0.6;
  }

  recruitAlly(player, ally) {
    if (!ally.getData('following')) {
      ally.setData('following', true);
      ally.setTint(0x00ffff);
      
      // テキスト表示
      const text = this.add.text(ally.x, ally.y - 50, '仲間になった！', {
        fontSize: '20px',
        color: '#00ff00',
        fontFamily: 'sans-serif'
      }).setOrigin(0.5);
      
      this.time.delayedCall(1000, () => {
        text.destroy();
      });
    }
  }

  allyHitEnemy(ally, enemy) {
    // 仲間が敵を倒す
    enemy.destroy();
    
    this.tweens.add({
      targets: ally,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 100,
      yoyo: true
    });
  }

  createTouchControls() {
    this.input.on('pointerdown', (pointer) => {
      if (this.isGameOver) return;
      
      const screenWidth = this.cameras.main.width;
      
      if (pointer.x < screenWidth / 3) {
        this.player.setVelocityX(-220);
      } else if (pointer.x > screenWidth * 2 / 3) {
        this.player.setVelocityX(220);
      } else if (pointer.y < 300) {
        if (this.player.body.touching.down) {
          this.player.setVelocityY(-400);
        }
      }
    });
  }

  hitEnemy(player, enemy) {
    // ダメージ
    this.tweens.add({
      targets: player,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        player.alpha = 1;
      }
    });
  }

  reachGoal(player, goal) {
    if (this.isGameOver) return;
    
    console.log('Goal reached!');
    this.isGameOver = true;
    
    if (this.bgm) {
      this.bgm.stop();
    }
    
    player.setVelocity(0, 0);
    this.allies.setVelocityX(0);
    this.allies.setVelocityY(0);
    
    const clearBg = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.8);
    clearBg.setScrollFactor(0);
    clearBg.setDepth(50);
    
    const clearText = this.add.text(640, 300, 'クリア！', {
      fontSize: '72px',
      color: '#00ff00',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    clearText.setScrollFactor(0);
    clearText.setDepth(51);
    
    const button = this.add.rectangle(640, 450, 300, 80, 0xff6400);
    button.setScrollFactor(0);
    button.setDepth(51);
    button.setInteractive({ useHandCursor: true });
    
    const buttonText = this.add.text(640, 450, '続ける', {
      fontSize: '32px',
      color: '#000000',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    buttonText.setScrollFactor(0);
    buttonText.setDepth(52);
    
    button.on('pointerdown', () => {
      // 職業を保存
      this.registry.set('playerJob', 'scrummaster');
      
      // 職業確定シーンへ
      this.scene.start('JobConfirmScene');
    });
  }
}
