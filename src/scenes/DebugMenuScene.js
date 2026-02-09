export default class DebugMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DebugMenuScene' });
  }

  create() {
    console.log('=== DebugMenuScene: create started ===');
    
    // 背景
    const bg = this.add.rectangle(640, 360, 1280, 720, 0x1a1a2e);
    
    // タイトル
    const title = this.add.text(640, 80, 'デバッグメニュー', {
      fontSize: '48px',
      color: '#ff6400',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // 説明
    const subtitle = this.add.text(640, 140, 'シーンを選択してください', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5);
    
    // ボタンを作成
    let yPos = 220;
    const spacing = 70;
    
    // === 現在使用中のシーン ===
    
    this.createButton(yPos, 'ロゴ', 'LogoScene');
    yPos += spacing;
    
    this.createButton(yPos, 'オープニング動画', 'OpeningVideoScene');
    yPos += spacing;
    
    this.createButton(yPos, 'プロローグ', 'PrologueScene');
    yPos += spacing;
    
    this.createButton(yPos, '暗転（トンネル）', 'DarknessScene');
    yPos += spacing;
    
    this.createButton(yPos, 'レイグア', 'LeiguaScene');
    yPos += spacing;
    
    this.createButton(yPos, '追いかけゲーム', 'ChaseScene');
    yPos += spacing;
    
    // 区切り線
    const line = this.add.rectangle(640, yPos + 35, 800, 2, 0x666666);
    yPos += spacing;
    
    this.createButton(yPos, 'オワリの街', 'TownScene');
    yPos += spacing;
    
    // === 未実装シーン（コメントアウト） ===
    
    // this.createButton(yPos, '食堂', 'RestaurantScene');
    // yPos += spacing;
    
    // this.createButton(yPos, '扉選択', 'DoorSelectionScene');
    // yPos += spacing;
    
    // this.createButton(yPos, '職業確定', 'JobConfirmScene');
    // yPos += spacing;
    
    // 閉じるボタン
    const closeButton = this.add.rectangle(640, 650, 300, 60, 0x666666);
    closeButton.setInteractive({ useHandCursor: true });
    
    const closeText = this.add.text(640, 650, '閉じる', {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    closeButton.on('pointerover', () => {
      closeButton.setFillStyle(0x888888);
    });
    
    closeButton.on('pointerout', () => {
      closeButton.setFillStyle(0x666666);
    });
    
    closeButton.on('pointerdown', () => {
      this.scene.stop('DebugMenuScene');
    });
    
    // 操作説明
    const helpText = this.add.text(640, 700, 'ESCキーでも閉じられます', {
      fontSize: '18px',
      color: '#888888',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5);
    
    // ESCキーで閉じる
    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.stop('DebugMenuScene');
    });
  }

  createButton(y, label, sceneName) {
    // ボタンの背景
    const button = this.add.rectangle(640, y, 600, 50, 0xff6400);
    button.setInteractive({ useHandCursor: true });
    
    // ボタンのテキスト
    const buttonText = this.add.text(640, y, label, {
      fontSize: '24px',
      color: '#000000',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // ホバーエフェクト
    button.on('pointerover', () => {
      button.setFillStyle(0xffaa00);
    });
    
    button.on('pointerout', () => {
      button.setFillStyle(0xff6400);
    });
    
    // クリックイベント
    button.on('pointerdown', () => {
      console.log('=== Debug: Starting', sceneName, '===');
      
      // 現在のシーンを停止
      this.scene.stop('DebugMenuScene');
      
      // 指定されたシーンを開始
      this.scene.start(sceneName);
    });
  }
}
