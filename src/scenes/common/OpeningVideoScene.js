export default class OpeningVideoScene extends Phaser.Scene {
  constructor() {
    super({ key: 'OpeningVideoScene' });
    this.openingBgm = null;
    this.selectedIndex = 0;
  }

  preload() {
    this.load.video('opening', 'videos/opening.mp4');
    this.load.audio('opening-theme', 'audio/opening-theme.mp3');
    this.load.audio('title-bgm', 'audio/fantasy-bgm.mp3');
    this.load.image('title-logo', 'images/agom-title-logo.png');
  }

  create() {
    console.log('OpeningVideoScene: create started');
    
    // オープニングテーマを再生（グローバルに保存）
    if (!this.game.registry.get('openingBGM')) {
      this.openingBgm = this.sound.add('opening-theme', {
        volume: 0.5,
        loop: true  // ← ループ再生に変更
      });
      this.openingBgm.play();
      
      // グローバルに保存
      this.game.registry.set('openingBGM', this.openingBgm);
      console.log('Opening BGM started and saved to registry');
    }
    
    // 動画を再生（音声はミュート）
    const video = this.add.video(640, 360, 'opening');
    video.setOrigin(0.5, 0.5);
    video.setMute(true);
    video.play();
    
    // スキップボタン
    const skipText = this.add.text(1180, 680, 'SKIP >', {
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setOrigin(1, 1);
    skipText.setInteractive({ useHandCursor: true });
    skipText.setAlpha(0.7);
    skipText.setDepth(100);
    
    skipText.on('pointerover', () => skipText.setAlpha(1));
    skipText.on('pointerout', () => skipText.setAlpha(0.7));
    
    // スキップイベント（BGMは継続）
    skipText.on('pointerdown', () => {
      // BGMは停止しない（継続）
      video.stop();
      this.scene.stop('OpeningVideoScene');
      this.scene.start('TitleScene');  // ← TitleSceneへ
    });
    
    // 動画終了時の処理
    video.on('complete', () => {
      skipText.destroy();
      video.setPaused(true);
      this.showTitleScreen(video);
    });
  }

  showTitleScreen(video) {
    console.log('Showing title screen overlay');
    
    // BGMは継続（切り替えない）
    // this.startTitleBgm(); ← 削除
    
    // タイトルロゴ画像
    const titleLogo = this.add.image(640, 250, 'title-logo');
    titleLogo.setAlpha(0);
    titleLogo.setDepth(10);
    
    // メニュー項目
    const menuItems = [
      { text: 'NEW GAME', enabled: true },
      { text: 'CONTINUE', enabled: false }
    ];
    
    const menuY = 450;
    const menuSpacing = 60;
    
    this.menuTexts = [];
    
    menuItems.forEach((item, index) => {
      const y = menuY + (index * menuSpacing);
      
      const text = this.add.text(640, y, item.text, {
        fontSize: '36px',
        color: item.enabled ? '#ffffff' : '#666666',
        fontFamily: 'sans-serif',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      text.setAlpha(0);
      text.setDepth(10);
      
      if (item.enabled) {
        text.setInteractive({ useHandCursor: true });
        
        // ホバーエフェクト
        text.on('pointerover', () => {
          this.selectedIndex = index;
          this.updateMenuSelection();
        });
        
        // クリックイベント
        text.on('pointerdown', () => {
          this.startGame(video);
        });
      }
      
      this.menuTexts.push({ text, enabled: item.enabled });
    });
    
    // カーソル（▶）
    this.cursor = this.add.text(500, menuY, '▶', {
      fontSize: '36px',
      color: '#ff6400',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5);
    this.cursor.setAlpha(0);
    this.cursor.setDepth(10);
    
    // タイトルロゴをフェードイン
    this.tweens.add({
      targets: titleLogo,
      alpha: 1,
      duration: 1500,
      ease: 'Power2'
    });
    
    // メニューをフェードイン
    this.menuTexts.forEach((item, index) => {
      this.tweens.add({
        targets: item.text,
        alpha: 1,
        duration: 1000,
        delay: 1000 + (index * 200),
        ease: 'Power2'
      });
    });
    
    // カーソルをフェードイン
    this.tweens.add({
      targets: this.cursor,
      alpha: 1,
      duration: 1000,
      delay: 1400,
      ease: 'Power2',
      onComplete: () => {
        // カーソル点滅
        this.tweens.add({
          targets: this.cursor,
          alpha: 0.3,
          duration: 500,
          yoyo: true,
          repeat: -1
        });
      }
    });
    
    // バージョン表示
    const version = this.add.text(20, 680, 'v0.1.0 - Chokaigi 2026 Demo', {
      fontSize: '16px',
      color: '#666666'
    });
    version.setAlpha(0);
    version.setDepth(10);
    
    this.tweens.add({
      targets: version,
      alpha: 1,
      duration: 1000,
      delay: 1500
    });
    
    // キーボード操作
    this.input.keyboard.on('keydown-UP', () => {
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
        this.updateMenuSelection();
      }
    });
    
    this.input.keyboard.on('keydown-DOWN', () => {
      if (this.selectedIndex < menuItems.length - 1 && menuItems[this.selectedIndex + 1].enabled) {
        this.selectedIndex++;
        this.updateMenuSelection();
      }
    });
    
    this.input.keyboard.on('keydown-ENTER', () => {
      if (menuItems[this.selectedIndex].enabled) {
        this.startGame(video);
      }
    });
    
    this.input.keyboard.on('keydown-SPACE', () => {
      if (menuItems[this.selectedIndex].enabled) {
        this.startGame(video);
      }
    });
  }

  updateMenuSelection() {
    const menuY = 450;
    const menuSpacing = 60;
    
    // カーソル位置を更新
    this.cursor.setY(menuY + (this.selectedIndex * menuSpacing));
    
    // 選択中のメニューを強調
    this.menuTexts.forEach((item, index) => {
      if (item.enabled) {
        if (index === this.selectedIndex) {
          item.text.setColor('#ff6400');
          item.text.setScale(1.1);
        } else {
          item.text.setColor('#ffffff');
          item.text.setScale(1.0);
        }
      }
    });
  }

  startGame(video) {
    console.log('Starting game from OpeningVideoScene');
    
    // BGMを停止
    const bgm = this.game.registry.get('openingBGM');
    if (bgm) {
      bgm.stop();
      this.game.registry.set('openingBGM', null);
      console.log('Opening BGM stopped');
    }
    
    video.destroy();
    this.scene.stop('OpeningVideoScene');
    this.scene.start('PrologueScene');
  }
}
