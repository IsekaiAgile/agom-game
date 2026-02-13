/**
 * カンリドラゴン（管理竜）
 * 停滞税の監視官・記録者
 * 実はアジャドラの変装（語尾「アジャ」でにじませ）
 */
export default class KanriDragon {
  constructor(scene) {
    this.scene = scene;
    this.sprite = null;
    this.hintText = null;
  }

  create(x = 1150, y = 100) {
    // スプライト
    this.sprite = this.scene.add.image(x, y, 'kanri-dragon');
    this.sprite.setScale(0.35);
    this.sprite.setScrollFactor(0); // カメラに固定
    this.sprite.setInteractive({ useHandCursor: true });
    
    // 浮遊アニメーション
    this.scene.tweens.add({
      targets: this.sprite,
      y: y - 10,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // クリックでヒント
    this.sprite.on('pointerdown', () => {
      this.showHint();
    });
    
    return this;
  }

  showHint() {
    // すでにヒント表示中なら無視
    if (this.hintText && this.hintText.active) {
      return;
    }
    
    // 現在のシーンに応じたヒント
    const hint = this.getHintForScene();
    
    if (!hint) return;
    
    // ヒントテキスト
    this.hintText = this.scene.add.text(1150, 200, hint, {
      fontSize: '18px',
      color: '#ffdd00',
      fontFamily: 'sans-serif',
      backgroundColor: '#000000',
      padding: { x: 10, y: 8 },
      align: 'center',
      wordWrap: { width: 250 }
    }).setOrigin(0.5);
    this.hintText.setScrollFactor(0);
    
    // 喋る演出
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 0.38,
      scaleY: 0.38,
      duration: 150,
      yoyo: true,
      repeat: 2
    });
    
    // ヒントが消える
    this.scene.tweens.add({
      targets: this.hintText,
      alpha: 0,
      y: 160,
      duration: 3000,
      delay: 2000,
      ease: 'Power2',
      onComplete: () => {
        this.hintText.destroy();
        this.hintText = null;
      }
    });
  }

  getHintForScene() {
    const sceneName = this.scene.scene.key;
    
    const hints = {
      'DeviationScene': '別の道を探すアジャ',
      'QuickDecisionScene': 'すぐ決めるアジャ',
      'IncompleteScene': '80%で完了するアジャ',
      'ConflictScene': '反対するアジャ',
      'ChangeScene': '新しい方法を試すアジャ'
    };
    
    return hints[sceneName] || null;
  }

  say(message, duration = 3000) {
    // カンリドラゴンが喋る
    const text = this.scene.add.text(1150, 200, message, {
      fontSize: '20px',
      color: '#ffdd00',
      fontFamily: 'sans-serif',
      backgroundColor: '#000000',
      padding: { x: 10, y: 8 },
      align: 'center',
      wordWrap: { width: 250 }
    }).setOrigin(0.5);
    text.setScrollFactor(0);
    
    // 喋る演出
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 0.38,
      scaleY: 0.38,
      duration: 150,
      yoyo: true,
      repeat: 2
    });
    
    // 消える
    this.scene.tweens.add({
      targets: text,
      alpha: 0,
      y: 160,
      duration: 2000,
      delay: duration,
      ease: 'Power2',
      onComplete: () => {
        text.destroy();
      }
    });
  }

  recordTax(baseTax, bonusTax, time) {
    let message = `停滞税+${baseTax + bonusTax}アジャ`;
    
    if (bonusTax > 0) {
      message += `\n（${time.toFixed(1)}秒）`;
      message += `\n積極的 +${bonusTax}`;
    } else if (time) {
      message += `\n（${time.toFixed(1)}秒）`;
      message += `\n慎重`;
    }
    
    this.say(message, 4000);
  }

  destroy() {
    if (this.sprite) {
      this.sprite.destroy();
    }
    if (this.hintText) {
      this.hintText.destroy();
    }
  }
}
