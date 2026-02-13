export default class ChaseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ChaseScene' });
    this.isGoalReached = false;
  }

  preload() {
    // 背景
    this.load.image('eligia-bg', 'images/eligia/leigua-bg.png');
    
    // キャラクター
    this.load.image('fuji', 'images/characters/fuji.png');
    this.load.image('ajadra', 'images/characters/ajadra.png');
  }

  create() {
    console.log('=== ChaseScene: create started ===');
    
    // 背景画像（横に3枚並べてループ感）
    for (let i = 0; i < 3; i++) {
      const bg = this.add.image(640 + (i * 1280), 360, 'eligia-bg');
      bg.setDisplaySize(1280, 720);
    }
    
    // 浮遊する装飾（パーティクル風）
    this.createFloatingElements();
    
    // タイトル（カメラに固定）
    const title = this.add.text(640, 80, '🏃 追いかけっこ', {
      fontSize: '48px',
      color: '#ffff00',
      fontFamily: 'sans-serif',
      fontStyle: 'bold',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);
    title.setScrollFactor(0);
    
    // プレイヤー（フジ）
    this.player = this.add.image(200, 400, 'fuji');
    this.player.setScale(0.15); // サイズ調整（小さく）
    
    // プレイヤーラベル
    this.playerLabel = this.add.text(200, 490, 'フジ', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      backgroundColor: '#000000',
      padding: { x: 5, y: 2 }
    }).setOrigin(0.5);
    
    // アジャドラ（画像、移動する）
    this.ajadra = this.add.image(600, 380, 'ajadra');
    this.ajadra.setScale(0.4); // サイズ調整
    
    // アジャドラのラベル
    this.ajadraLabel = this.add.text(600, 480, 'アジャドラ', {
      fontSize: '24px',
      color: '#ffff00',
      fontFamily: 'sans-serif',
      fontStyle: 'bold',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5);
    
    // アジャドラを光らせる
    this.tweens.add({
      targets: this.ajadra,
      scaleX: 0.42,
      scaleY: 0.42,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // アジャドラの浮遊アニメーション
    this.tweens.add({
      targets: this.ajadra,
      y: 370,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // ゴールエリア（透明、アジャドラの位置）
    this.goal = this.add.rectangle(600, 400, 150, 150, 0x00ff00, 0);
    this.goal.setStrokeStyle(5, 0xffff00);
    
    // アジャドラの移動速度
    this.ajadraSpeed = 150; // ピクセル/秒
    
    // キーボード入力
    this.cursors = this.input.keyboard.createCursorKeys();
    this.playerSpeed = 5;
    
    // カメラ設定
    this.cameras.main.setBounds(0, 0, 2000, 720);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    
    // 説明（カメラに固定）
    const desc = this.add.text(640, 160, 'アジャドラを追いかけろ！', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);
    desc.setScrollFactor(0);
    
    // 距離表示（カメラに固定）
    this.distanceText = this.add.text(640, 220, 'アジャドラまで: --m', {
      fontSize: '28px',
      color: '#ffdd00',
      fontFamily: 'sans-serif',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);
    this.distanceText.setScrollFactor(0);
    
    console.log('=== ChaseScene: create finished ===');
  }

  createFloatingElements() {
    // 浮遊する花
    for (let i = 0; i < 15; i++) {
      const x = Phaser.Math.Between(100, 3500);
      const y = Phaser.Math.Between(50, 300);
      const size = Phaser.Math.Between(8, 16);
      
      const flower = this.add.circle(x, y, size, 0xff66cc, 0.5);
      
      this.tweens.add({
        targets: flower,
        y: y + Phaser.Math.Between(-30, 30),
        x: x + Phaser.Math.Between(-20, 20),
        alpha: 0.2,
        duration: Phaser.Math.Between(3000, 5000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Phaser.Math.Between(0, 2000)
      });
    }
    
    // 泳ぐ魚
    for (let i = 0; i < 10; i++) {
      const x = Phaser.Math.Between(100, 3500);
      const y = Phaser.Math.Between(100, 600);
      
      const fish = this.add.ellipse(x, y, 30, 15, 0x66ccff, 0.4);
      
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
    
    // 結晶
    for (let i = 0; i < 12; i++) {
      const x = Phaser.Math.Between(100, 3500);
      const y = Phaser.Math.Between(100, 650);
      const size = Phaser.Math.Between(6, 12);
      
      const crystal = this.add.rectangle(x, y, size, size, 0xaa66ff, 0.6);
      crystal.setRotation(Math.PI / 4);
      
      this.tweens.add({
        targets: crystal,
        y: y + Phaser.Math.Between(-40, 40),
        rotation: crystal.rotation + Math.PI * 2,
        alpha: 0.2,
        duration: Phaser.Math.Between(3000, 6000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Phaser.Math.Between(0, 2000)
      });
    }
  }

  update() {
    if (this.isGoalReached) return;
    
    // アジャドラを右へ移動
    if (this.ajadraSpeed > 0) {
      this.ajadra.x += this.ajadraSpeed * (1/60);
      this.ajadraLabel.x = this.ajadra.x;
      this.goal.x = this.ajadra.x;
      
      // アジャドラが一定距離まで来たら止まる
      if (this.ajadra.x >= 1800) {
        this.ajadraSpeed = 0;
      }
    }
    
    // 移動
    if (this.cursors.left.isDown) {
      this.player.x -= this.playerSpeed;
    }
    if (this.cursors.right.isDown) {
      this.player.x += this.playerSpeed;
    }
    if (this.cursors.up.isDown) {
      this.player.y -= this.playerSpeed;
    }
    if (this.cursors.down.isDown) {
      this.player.y += this.playerSpeed;
    }
    
    // 画面外に出ないように
    this.player.x = Phaser.Math.Clamp(this.player.x, 25, 1975);
    this.player.y = Phaser.Math.Clamp(this.player.y, 25, 695);
    
    // プレイヤーラベルを追従
    this.playerLabel.x = this.player.x;
    this.playerLabel.y = this.player.y + 70;
    
    // アジャドラまでの距離を表示
    const distance = Phaser.Math.Distance.Between(
      this.player.x, this.player.y,
      this.goal.x, this.goal.y
    );
    
    const distanceInMeters = Math.floor(distance / 100);
    this.distanceText.setText(`アジャドラまで: ${distanceInMeters}m`);
    
    // ゴール判定
    if (distance < 150) {
      this.reachGoal();
    }
  }

  reachGoal() {
    if (this.isGoalReached) return;
    
    this.isGoalReached = true;
    
    console.log('=== Goal reached! ===');
    
    // アジャドラの移動を停止
    this.ajadraSpeed = 0;
    
    // 成功メッセージ（カメラに固定）
    const successBg = this.add.rectangle(640, 360, 900, 250, 0x000000, 0.95);
    successBg.setScrollFactor(0);
    
    const successText = this.add.text(640, 360, 'アジャドラに追いついた！🎉', {
      fontSize: '64px',
      color: '#ffff00',
      fontFamily: 'sans-serif',
      align: 'center',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    successText.setScrollFactor(0);
    
    // 2秒後にフェードアウト
    this.time.delayedCall(2000, () => {
      // 暗転
      this.cameras.main.fadeOut(1500, 0, 0, 0);
      
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.stop('ChaseScene');
        this.scene.start('SizeChangeScene');
      });
    });
  }
}
