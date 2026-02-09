export default class DoorSelectionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DoorSelectionScene' });
  }

  preload() {
    this.load.audio('selection-bgm', 'audio/fantasy-bgm.mp3');
  }

  create() {
    console.log('=== DoorSelectionScene: create started ===');
    
    // BGM再生
    this.bgm = this.sound.add('selection-bgm', {
      loop: true,
      volume: 0.3
    });
    this.bgm.play();
    
    // 背景
    const bg = this.add.rectangle(640, 360, 1280, 720, 0x1a1a3e);
    
    // タイトル
    const title = this.add.text(640, 80, 'あなたの道を選べ', {
      fontSize: '48px',
      color: '#ff6400',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // 説明
    const subtitle = this.add.text(640, 140, '扉を選ぶと職業が決まります', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5);
    
    // 3つの扉
    this.createDoor(
      320, 360, 
      0xff0000, 
      '🔴 赤い扉',
      '戦士の道\n正面突破でスピード重視',
      'warrior'
    );
    
    this.createDoor(
      640, 360,
      0x0000ff,
      '🔵 青い扉',
      '魔法使いの道\n計画と戦略で挑む',
      'mage'
    );
    
    this.createDoor(
      960, 360,
      0x00ff00,
      '🟢 緑の扉',
      'スクラムマスターの道\n協力と調整で進む',
      'scrummaster'
    );
  }

  createDoor(x, y, color, title, description, job) {
    // 扉の本体
    const door = this.add.rectangle(x, y, 200, 300, color, 0.3);
    door.setStrokeStyle(4, color);
    door.setInteractive({ useHandCursor: true });
    
    // タイトル
    const doorTitle = this.add.text(x, y - 180, title, {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);
    
    // 説明テキスト（最初は非表示）
    const descText = this.add.text(x, y + 200, description, {
      fontSize: '18px',
      color: '#cccccc',
      fontFamily: 'sans-serif',
      align: 'center'
    }).setOrigin(0.5);
    descText.setVisible(false);
    
    // ホバーエフェクト
    door.on('pointerover', () => {
      door.setFillStyle(color, 0.6);
      doorTitle.setColor('#ff6400');
      descText.setVisible(true);
      
      this.tweens.add({
        targets: door,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 200,
        ease: 'Power2'
      });
    });
    
    door.on('pointerout', () => {
      door.setFillStyle(color, 0.3);
      doorTitle.setColor('#ffffff');
      descText.setVisible(false);
      
      this.tweens.add({
        targets: door,
        scaleX: 1.0,
        scaleY: 1.0,
        duration: 200,
        ease: 'Power2'
      });
    });
    
    // クリックで職業確定へ（修正版）
    door.on('pointerdown', () => {
      console.log('=== Door clicked, job:', job, '===');
      
      // 職業を保存
      this.registry.set('playerJob', job);
      
      // BGM停止
      if (this.bgm) {
        this.bgm.stop();
      }
      
      // カメラフェードを使う（tweenの代わり）
      this.cameras.main.fadeOut(500, 0, 0, 0);
      
      this.cameras.main.once('camerafadeoutcomplete', () => {
        console.log('=== Fade complete, starting JobConfirmScene ===');
        
        // 現在のシーンを停止してから次へ
        this.scene.stop('DoorSelectionScene');
        this.scene.start('JobConfirmScene');
      });
    });
  }
}
