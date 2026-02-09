import Phaser from 'phaser';

export default class ChaseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ChaseScene' });
  }

  create() {
    console.log('=== ChaseScene: create started ===');
    
    // 背景（横長に）
    const bg = this.add.rectangle(1000, 360, 2000, 720, 0x3a2a4e);
    
    // タイトル（カメラに固定）
    const title = this.add.text(640, 80, '🏃 追いかけっこシーン', {
      fontSize: '48px',
      color: '#ffff00',
      fontFamily: 'sans-serif',
      fontStyle: 'bold',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);
    title.setScrollFactor(0); // カメラに固定
    
    // 説明（カメラに固定）
    const desc = this.add.text(640, 160, '右へ進んでゴールを目指そう！', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);
    desc.setScrollFactor(0); // カメラに固定
    
    // プレイヤー
    this.player = this.add.rectangle(200, 400, 50, 50, 0x00ffff);
    this.player.setStrokeStyle(5, 0xffffff);
    
    // プレイヤーラベル
    this.playerLabel = this.add.text(200, 470, 'あなた', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      backgroundColor: '#000000'
    }).setOrigin(0.5);
    
    // ゴール（もっと右に配置）
    this.goal = this.add.rectangle(1800, 400, 120, 120, 0x00ff00);
    this.goal.setStrokeStyle(8, 0xffff00);
    
    // ゴールラベル
    this.goalLabel = this.add.text(1800, 540, 'ゴール！', {
      fontSize: '48px',
      color: '#ffff00',
      fontFamily: 'sans-serif',
      fontStyle: 'bold',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);
    
    // ゴールを光らせる
    this.tweens.add({
      targets: [this.goal, this.goalLabel],
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // 目印（道しるべ）
    for (let i = 400; i <= 1600; i += 400) {
      const marker = this.add.text(i, 350, '→', {
        fontSize: '48px',
        color: '#888888'
      });
    }
    
    // 操作説明（カメラに固定）
    const controls = this.add.text(640, 650, '← → ↑ ↓ キーで移動', {
      fontSize: '28px',
      color: '#00ff00',
      fontFamily: 'sans-serif',
      backgroundColor: '#000000',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5);
    controls.setScrollFactor(0); // カメラに固定
    
    // 距離表示（カメラに固定）
    this.distanceText = this.add.text(20, 20, '', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    });
    this.distanceText.setScrollFactor(0); // カメラに固定
    
    // カメラ設定（横長の世界）
    this.cameras.main.setBounds(0, 0, 2000, 720);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    
    // キーボード操作
    this.cursors = this.input.keyboard.createCursorKeys();
    this.playerSpeed = 8;
    
    // ゴール済みフラグ
    this.isGoalReached = false;
    
    console.log('Player position:', this.player.x, this.player.y);
    console.log('Goal position:', this.goal.x, this.goal.y);
    console.log('=== ChaseScene: create finished ===');
  }

  update() {
    if (this.isGoalReached) return;
    
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
    
    // 画面外に出ないように（横長の世界に対応）
    this.player.x = Phaser.Math.Clamp(this.player.x, 25, 1975);
    this.player.y = Phaser.Math.Clamp(this.player.y, 25, 695);
    
    // プレイヤーラベルを追従
    this.playerLabel.x = this.player.x;
    this.playerLabel.y = this.player.y + 70;
    
    // ゴールまでの距離を表示
    const distance = Phaser.Math.Distance.Between(
      this.player.x, this.player.y,
      this.goal.x, this.goal.y
    );
    
    this.distanceText.setText(`ゴールまで: ${Math.floor(distance)}px`);
    
    // ゴール判定
    if (distance < 150) {
      this.reachGoal();
    }
  }

  reachGoal() {
    if (this.isGoalReached) return;
    
    this.isGoalReached = true;
    console.log('=== Goal reached! ===');
    
    // カメラを止める
    this.cameras.main.stopFollow();
    
    // ゴール演出
    this.tweens.add({
      targets: this.goal,
      scaleX: 3,
      scaleY: 3,
      alpha: 0,
      duration: 500
    });
    
    this.tweens.add({
      targets: this.player,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 300,
      yoyo: true,
      repeat: 3
    });
    
    // 成功メッセージ（カメラに固定）
    const successBg = this.add.rectangle(640, 360, 900, 250, 0x000000, 0.95);
    successBg.setScrollFactor(0);
    
    const successText = this.add.text(640, 360, 'ゴール！🎉\n次のシーンへ...', {
      fontSize: '72px',
      color: '#ffff00',
      fontFamily: 'sans-serif',
      align: 'center',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    successText.setScrollFactor(0);
    
    // 2秒後に次へ
    this.time.delayedCall(2000, () => {
      console.log('=== Transitioning to TownScene ===');
      this.scene.stop('ChaseScene');
      this.scene.start('TownScene');
    });
  }
}
