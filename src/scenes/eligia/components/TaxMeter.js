/**
 * 停滞税メーター
 * 0-175の範囲を表示
 * 100で色が変わる
 */
export default class TaxMeter {
  constructor(scene) {
    this.scene = scene;
    this.container = null;
    this.bar = null;
    this.text = null;
  }

  create(x = 950, y = 150) {
    this.container = this.scene.add.container(x, y);
    this.container.setScrollFactor(0);
    
    // 背景フレーム
    const frame = this.scene.add.rectangle(0, 0, 200, 30, 0x000000, 0.8);
    frame.setStrokeStyle(2, 0x6633aa);
    
    // バー（塗りつぶし部分）
    this.bar = this.scene.add.rectangle(-98, 0, 4, 26, 0x6633aa);
    this.bar.setOrigin(0, 0.5);
    
    // テキスト
    this.text = this.scene.add.text(0, 0, '停滞税: 0', {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.container.add([frame, this.bar, this.text]);
    
    return this;
  }

  update(value) {
    // 値を0-175の範囲に制限
    const tax = Math.max(0, Math.min(175, value));
    
    // バーの幅（最大196px）
    const maxWidth = 196;
    const width = (tax / 175) * maxWidth;
    this.bar.width = width;
    
    // 色の変化
    if (tax >= 100) {
      // 100以上で赤
      this.bar.setFillStyle(0xff3366);
    } else if (tax >= 80) {
      // 80以上で黄色
      this.bar.setFillStyle(0xffdd00);
    } else {
      // 通常は紫
      this.bar.setFillStyle(0x6633aa);
    }
    
    // テキスト更新
    this.text.setText(`停滞税: ${tax}`);
    
    return this;
  }

  addTax(amount, isBonus = false) {
    const currentTax = this.scene.registry.get('teitaiTax') || 0;
    const newTax = currentTax + amount;
    
    // 値を保存
    this.scene.registry.set('teitaiTax', newTax);
    
    // アニメーション
    this.animateIncrease(currentTax, newTax, isBonus);
    
    return newTax;
  }

  animateIncrease(from, to, isBonus) {
    // 点滅
    this.scene.tweens.add({
      targets: this.bar,
      alpha: 0.5,
      duration: 100,
      yoyo: true,
      repeat: 3
    });
    
    // 数値カウントアップ
    const duration = 1000;
    const steps = 30;
    const increment = (to - from) / steps;
    let current = from;
    let step = 0;
    
    const timer = this.scene.time.addEvent({
      delay: duration / steps,
      callback: () => {
        step++;
        current = from + (increment * step);
        this.update(Math.round(current));
        
        if (step >= steps) {
          timer.remove();
          this.update(to);
        }
      },
      repeat: steps - 1
    });
    
    // ボーナスの場合は特別エフェクト
    if (isBonus) {
      const bonus = this.scene.add.text(
        this.container.x + 100,
        this.container.y - 20,
        '+BONUS!',
        {
          fontSize: '20px',
          color: '#ffdd00',
          fontFamily: 'sans-serif',
          fontStyle: 'bold'
        }
      ).setOrigin(0.5);
      bonus.setScrollFactor(0);
      
      this.scene.tweens.add({
        targets: bonus,
        alpha: 0,
        y: bonus.y - 30,
        duration: 2000,
        ease: 'Power2',
        onComplete: () => {
          bonus.destroy();
        }
      });
    }
  }

  destroy() {
    if (this.container) {
      this.container.destroy();
    }
  }
}
