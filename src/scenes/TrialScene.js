export default class TrialScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TrialScene' });
    
    this.player = null;
    this.cursors = null;
    this.jumpKey = null;
    this.isGameOver = false;
    this.introComplete = false;
  }

  preload() {
    this.load.audio('trial-bgm', 'audio/trial-bgm.mp3');
    this.load.image('trial-bg-far', 'images/trial/bg-far.png');
    this.load.image('trial-bg-mid', 'images/trial/bg-mid.png');
  }

  create() {
    console.log('TrialScene: create started');
    this.showIntroduction();
  }

  showIntroduction() {
    const bg = this.add.rectangle(640, 360, 1280, 720, 0x000000);
    
    const introTexts = [
      '……ここは、どこだ……？',
      '見たこともない場所だ……',
      '……何が起こってるんだ'
    ];
    
    let currentIndex = 0;
    let isTyping = false;
    
    const text = this.add.text(640, 300, '', {
      fontSize: '40px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    
    const clickIcon = this.add.text(640, 600, '▼ クリックで続ける', {
      fontSize: '24px',
      color: '#aaaaaa'
    }).setOrigin(0.5);
    clickIcon.setVisible(false);
    
    this.tweens.add({
      targets: clickIcon,
      alpha: 0.3,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
    
    const typeText = (textToType) => {
      isTyping = true;
      clickIcon.setVisible(false);
      text.setText('');
      
      let charIndex = 0;
      
      const timer = this.time.addEvent({
        delay: 80,
        callback: () => {
          if (charIndex < textToType.length) {
            text.setText(textToType.substring(0, charIndex + 1));
            charIndex++;
          } else {
            timer.remove();
            isTyping = false;
            clickIcon.setVisible(true);
          }
        },
        loop: true
      });
    };
    
    const showNext = () => {
      if (isTyping) return;
      
      if (currentIndex >= introTexts.length) {
        // クリーンアップ
        bg.destroy();
        text.destroy();
        clickIcon.destroy();
        
        // イベントリスナーを削除（重要！）
        this.input.off('pointerdown', showNext);
        
        // ゲーム開始
        this.startGame();
        return;
      }
      
      typeText(introTexts[currentIndex]);
      currentIndex++;
    };
    
    // 最初のテキスト表示
    showNext();
    
    // クリックイベント登録（1回だけ）
    this.input.on('pointerdown', showNext);
  }

  startGame() {
    console.log('Starting game...');
    this.introComplete = true;
    
    this.createParallaxBackground();
    
    const title = this.add.text(640, 50, '？？？', {
      fontSize: '48px',
      color: '#ff6400',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    title.setScrollFactor(0);
    title.setDepth(100);
    
    const instructions = this.add.text(640, 120, '← → キーで移動、スペースでジャンプ', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5);
    instructions.setScrollFactor(0);
    instructions.setDepth(100);
    
    this.createGround();
    this.createPlayer();
    this.createEnemies();
    this.createGoal();
    
    this.physics.world.setBounds(0, 0, 3000, 720);
    
    this.cameras.main.setBounds(0, 0, 3000, 720);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    
    this.cursors = this.input.keyboard.createCursorKeys();
    this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.createTouchControls();
    
    this.bgm = this.sound.add('trial-bgm', {
      loop: true,
      volume: 0.5
    });
    this.bgm.play();
    
    console.log('Game started!');
  }

  createParallaxBackground() {
    const worldWidth = 3000;
    
    const farBg = this.add.tileSprite(0, 0, worldWidth * 2, 720, 'trial-bg-far');
    farBg.setOrigin(0, 0);
    farBg.setScrollFactor(0.1);
    
    const midBg = this.add.tileSprite(0, 0, worldWidth * 2, 720, 'trial-bg-mid');
    midBg.setOrigin(0, 0);
    midBg.setScrollFactor(0.5);
    
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(0, worldWidth);
      const y = Phaser.Math.Between(0, 720);
      const size = Phaser.Math.Between(3, 8);
      const particle = this.add.circle(x, y, size, 0xff8800, 0.4);
      particle.setScrollFactor(1.2);
      
      this.tweens.add({
        targets: particle,
        y: y + Phaser.Math.Between(-20, 20),
        alpha: Phaser.Math.FloatBetween(0.2, 0.6),
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true,
        repeat: -1
      });
    }
  }

  createGround() {
    this.platforms = this.physics.add.staticGroup();
    
    const groundY = 650;
    const groundHeight = 70;
    
    for (let i = 0; i < 10; i++) {
      const ground = this.add.rectangle(
        150 + i * 300, 
        groundY, 
        300, 
        groundHeight, 
        0xff6400
      );
      this.physics.add.existing(ground, true);
      this.platforms.add(ground);
    }
    
    const platform1 = this.add.rectangle(800, 550, 200, 30, 0xffaa00);
    this.physics.add.existing(platform1, true);
    this.platforms.add(platform1);
    
    const platform2 = this.add.rectangle(1200, 450, 200, 30, 0xffaa00);
    this.physics.add.existing(platform2, true);
    this.platforms.add(platform2);
    
    const platform3 = this.add.rectangle(1600, 550, 200, 30, 0xffaa00);
    this.physics.add.existing(platform3, true);
    this.platforms.add(platform3);
  }

  createPlayer() {
    this.player = this.add.rectangle(100, 500, 40, 60, 0x00ffff);
    this.physics.add.existing(this.player);
    
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setGravityY(800);
    
    this.physics.add.collider(this.player, this.platforms);
    
    this.player.isJumping = false;
  }

  createEnemies() {
    this.enemies = this.physics.add.group();
    
    const enemy1 = this.add.rectangle(600, 600, 50, 50, 0xff0000);
    this.physics.add.existing(enemy1);
    enemy1.body.setCollideWorldBounds(true);
    enemy1.body.setGravityY(800);
    enemy1.body.setVelocityX(-50);
    this.enemies.add(enemy1);
    
    const enemy2 = this.add.rectangle(1000, 600, 50, 50, 0xff0000);
    this.physics.add.existing(enemy2);
    enemy2.body.setCollideWorldBounds(true);
    enemy2.body.setGravityY(800);
    enemy2.body.setVelocityX(50);
    this.enemies.add(enemy2);
    
    const enemy3 = this.add.rectangle(1800, 600, 50, 50, 0xff0000);
    this.physics.add.existing(enemy3);
    enemy3.body.setCollideWorldBounds(true);
    enemy3.body.setGravityY(800);
    enemy3.body.setVelocityX(-50);
    this.enemies.add(enemy3);
    
    this.physics.add.collider(this.enemies, this.platforms);
    
    this.enemies.children.entries.forEach(enemy => {
      enemy.body.setBounce(1, 0);
    });
    
    this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);
  }

  createGoal() {
    this.goal = this.add.rectangle(2800, 500, 100, 200, 0x00ff00);
    this.physics.add.existing(this.goal, true);
    
    this.add.text(2800, 400, 'GOAL', {
      fontSize: '48px',
      color: '#00ff00',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.physics.add.overlap(this.player, this.goal, this.reachGoal, null, this);
  }

  createTouchControls() {
    this.input.on('pointerdown', (pointer) => {
      if (this.isGameOver || !this.introComplete) return;
      
      const screenWidth = this.cameras.main.width;
      
      if (pointer.x < screenWidth / 3) {
        this.player.body.setVelocityX(-200);
      } else if (pointer.x > screenWidth * 2 / 3) {
        this.player.body.setVelocityX(200);
      } else if (pointer.y < 300) {
        if (this.player.body.touching.down) {
          this.player.body.setVelocityY(-400);
        }
      }
    });
  }

  hitEnemy(player, enemy) {
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
    
    enemy.x -= 200;
  }

  reachGoal(player, goal) {
    if (this.isGameOver) return;
    
    console.log('Goal reached!');
    this.isGameOver = true;
    
    // BGMを即座に停止
    if (this.bgm && this.bgm.isPlaying) {
      this.bgm.stop();
    }
    
    this.player.body.setVelocity(0, 0);
    
    const overlay = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.8);
    overlay.setScrollFactor(0);
    overlay.setDepth(100);
    
    const text = this.add.text(640, 300, 'クリア！', {
      fontSize: '64px',
      color: '#00ff00',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    text.setScrollFactor(0);
    text.setDepth(101);
    
    const button = this.add.rectangle(640, 450, 300, 80, 0xff6400);
    button.setScrollFactor(0);
    button.setDepth(101);
    button.setInteractive({ useHandCursor: true });
    
    const buttonText = this.add.text(640, 450, '続ける', {
      fontSize: '32px',
      color: '#000000',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    buttonText.setScrollFactor(0);
    buttonText.setDepth(102);
    
    button.on('pointerdown', () => {
      // シーン遷移前に確実に停止
      if (this.bgm) {
        this.bgm.stop();
      }
      this.scene.start('AjadraScene');
    });
  }

  update() {
    if (this.isGameOver || !this.introComplete) return;
    
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(200);
    } else {
      this.player.body.setVelocityX(this.player.body.velocity.x * 0.9);
    }
    
    if (Phaser.Input.Keyboard.JustDown(this.jumpKey) && this.player.body.touching.down) {
      this.player.body.setVelocityY(-400);
    }
    
    if (this.player.y > 720) {
      this.gameOver();
    }
  }

  gameOver() {
    if (this.isGameOver) return;
    
    this.isGameOver = true;
    
    if (this.bgm && this.bgm.isPlaying) {
      this.bgm.stop();
    }
    
    const overlay = this.add.rectangle(640, 360, 1280, 720, 0x220000, 0.9);
    overlay.setScrollFactor(0);
    overlay.setDepth(100);
    
    const text = this.add.text(640, 300, 'GAME OVER', {
      fontSize: '64px',
      color: '#ff0000',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    text.setScrollFactor(0);
    text.setDepth(101);
    
    const button = this.add.rectangle(640, 450, 300, 80, 0xff6400);
    button.setScrollFactor(0);
    button.setDepth(101);
    button.setInteractive({ useHandCursor: true });
    
    const buttonText = this.add.text(640, 450, 'リトライ', {
      fontSize: '32px',
      color: '#000000',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    buttonText.setScrollFactor(0);
    buttonText.setDepth(102);
    
    button.on('pointerdown', () => {
      this.scene.restart();
    });
  }
}
