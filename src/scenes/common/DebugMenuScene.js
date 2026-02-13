export default class DebugMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DebugMenuScene' });
  }

  create() {
    console.log('=== DebugMenuScene: create started ===');
    
    // 背景
    const bg = this.add.rectangle(640, 360, 1280, 720, 0x1a1a2e);
    
    // タイトル（カメラに固定）
    const title = this.add.text(640, 30, 'デバッグメニュー', {
      fontSize: '48px',
      color: '#ff6400',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    title.setScrollFactor(0);
    
    // 説明（カメラに固定）
    const subtitle = this.add.text(640, 80, 'シーンを選択してください', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5);
    subtitle.setScrollFactor(0);
    
    // エリージア編のシーン
    const scenes = [
      // === Common ===
      { label: 'ロゴ', scene: 'LogoScene' },
      { label: 'オープニング動画', scene: 'OpeningVideoScene' },
      { label: 'プロローグ', scene: 'PrologueScene' },
      // === Eligia ===
      { label: '--- エリージア編 ---', scene: null }, // 区切り
      { label: 'エリージアタイトル', scene: 'EligiaTitleScene' },
      { label: '暗転（トンネル）', scene: 'DarknessScene' },
      { label: 'レイグア', scene: 'LeiguaScene' },
      { label: '逸脱', scene: 'DeviationScene' },
    ];
    
    const spacing = 70;
    const startY = 150;
    
    // ボタンを作成
    let yPos = startY;
    
    scenes.forEach((sceneInfo) => {
      if (sceneInfo.scene === null) {
        // 区切り線
        this.add.text(640, yPos, sceneInfo.label, {
          fontSize: '20px',
          color: '#888888',
          fontFamily: 'sans-serif'
        }).setOrigin(0.5);
        this.add.rectangle(640, yPos + 25, 600, 2, 0x666666);
        yPos += spacing;
      } else {
        this.createButton(yPos, sceneInfo.label, sceneInfo.scene);
        yPos += spacing;
      }
    });
    
    // 閉じるボタン（カメラに固定）
    const closeButton = this.add.rectangle(640, 680, 300, 60, 0x666666);
    closeButton.setInteractive({ useHandCursor: true });
    closeButton.setScrollFactor(0);
    
    const closeText = this.add.text(640, 680, '閉じる', {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    closeText.setScrollFactor(0);
    
    closeButton.on('pointerover', () => {
      closeButton.setFillStyle(0x888888);
    });
    
    closeButton.on('pointerout', () => {
      closeButton.setFillStyle(0x666666);
    });
    
    closeButton.on('pointerdown', () => {
      this.scene.stop('DebugMenuScene');
    });
    
    // 操作説明（カメラに固定）
    const helpText = this.add.text(640, 720, 'ESCキーで閉じる', {
      fontSize: '16px',
      color: '#888888',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5);
    helpText.setScrollFactor(0);
    
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
      
      // 全シーンを停止してからクリーンアップ
      this.scene.manager.scenes.forEach(scene => {
        if (scene.scene.key !== 'DebugMenuScene' && scene.scene.key !== sceneName) {
          this.scene.stop(scene.scene.key);
        }
      });
      
      // カメラをリセット
      this.cameras.main.setBounds(0, 0, 1280, 720);
      this.cameras.main.setScroll(0, 0);
      
      // 現在のシーンを停止
      this.scene.stop('DebugMenuScene');
      
      // 指定されたシーンを開始
      this.scene.start(sceneName);
    });
  }
}
