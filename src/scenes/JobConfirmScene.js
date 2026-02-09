export default class JobConfirmScene extends Phaser.Scene {
  constructor() {
    super({ key: 'JobConfirmScene' });
  }

  preload() {
    // 特になし
  }

  create() {
    console.log('=== JobConfirmScene: create started ===');
    
    // カメラフェードイン
    this.cameras.main.fadeIn(500, 0, 0, 0);
    
    // 選択した職業を取得
    const job = this.registry.get('playerJob') || 'warrior';
    console.log('Job confirmed:', job);
    
    // 職業データ
    const jobData = {
      warrior: {
        name: '戦士',
        color: 0xff0000,
        emoji: '⚔️',
        description: '力で道を切り拓く者',
        stats: 'HP: 高 / 攻撃: 高 / 魔力: 低'
      },
      mage: {
        name: '魔法使い',
        color: 0x0000ff,
        emoji: '🔮',
        description: '知恵で戦う者',
        stats: 'HP: 低 / 攻撃: 低 / 魔力: 高'
      },
      scrummaster: {
        name: 'スクラムマスター',
        color: 0x00ff00,
        emoji: '🤝',
        description: '協力で勝利を掴む者',
        stats: 'HP: 中 / 攻撃: 中 / 魔力: 中'
      }
    };
    
    const currentJob = jobData[job];
    
    // 背景
    const bg = this.add.rectangle(640, 360, 1280, 720, 0x000000);
    
    // 光のエフェクト
    const light = this.add.rectangle(640, 360, 800, 800, currentJob.color, 0.3);
    light.setAlpha(0);
    
    this.tweens.add({
      targets: light,
      alpha: 0.3,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 2000,
      ease: 'Power2'
    });
    
    // 絵文字（職業アイコン）
    const emoji = this.add.text(640, 200, currentJob.emoji, {
      fontSize: '120px'
    }).setOrigin(0.5);
    emoji.setAlpha(0);
    
    this.tweens.add({
      targets: emoji,
      alpha: 1,
      y: 180,
      duration: 1500,
      delay: 500,
      ease: 'Back.easeOut'
    });
    
    // メインテキスト
    const mainText = this.add.text(640, 320, `あなたは${currentJob.name}になった！`, {
      fontSize: '48px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    mainText.setAlpha(0);
    
    this.tweens.add({
      targets: mainText,
      alpha: 1,
      duration: 1000,
      delay: 1000
    });
    
    // 説明
    const desc = this.add.text(640, 400, currentJob.description, {
      fontSize: '28px',
      color: '#cccccc',
      fontFamily: 'sans-serif',
      fontStyle: 'italic'
    }).setOrigin(0.5);
    desc.setAlpha(0);
    
    this.tweens.add({
      targets: desc,
      alpha: 1,
      duration: 1000,
      delay: 1500
    });
    
    // ステータス
    const stats = this.add.text(640, 480, currentJob.stats, {
      fontSize: '24px',
      color: '#ffff00',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5);
    stats.setAlpha(0);
    
    this.tweens.add({
      targets: stats,
      alpha: 1,
      duration: 1000,
      delay: 2000
    });
    
    // 続けるボタン
    const button = this.add.rectangle(640, 600, 400, 80, 0xff6400);
    button.setAlpha(0);
    button.setInteractive({ useHandCursor: true });
    
    const buttonText = this.add.text(640, 600, '冒険を始める', {
      fontSize: '32px',
      color: '#000000',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    buttonText.setAlpha(0);
    
    this.tweens.add({
      targets: [button, buttonText],
      alpha: 1,
      duration: 1000,
      delay: 2500
    });
    
    // ホバーエフェクト
    button.on('pointerover', () => {
      button.setFillStyle(0xffaa00);
    });
    button.on('pointerout', () => {
      button.setFillStyle(0xff6400);
    });
    
    // クリックで街へ（修正版）
    button.on('pointerdown', () => {
      console.log('=== Starting town transition ===');
      
      // カメラフェードアウト
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      
      this.cameras.main.once('camerafadeoutcomplete', () => {
        console.log('=== Fade complete, starting TownScene ===');
        
        // 現在のシーンを停止してから次へ
        this.scene.stop('JobConfirmScene');
        this.scene.start('TownScene');
      });
    });
  }
}
