import Phaser from 'phaser';
import LogoScene from './scenes/LogoScene';
import TitleScene from './scenes/TitleScene';
import PrologueScene from './scenes/PrologueScene';
import TrialScene from './scenes/TrialScene';
import AjadraScene from './scenes/AjadraScene';
import DebugMenuScene from './scenes/DebugMenuScene';

// デバッグ用設定
const DEBUG_MODE = false; // true → false
const DEBUG_START_SCENE = 'PrologueScene'; // 'PrologueScene' または 'TrialScene'
const ENABLE_DEBUG_MENU = true; // デバッグメニューを有効化（本番環境では false）

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game-container',
  backgroundColor: '#000000',
  scene: [LogoScene, TitleScene, PrologueScene, TrialScene, AjadraScene, DebugMenuScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: DEBUG_MODE // デバッグモード（衝突判定を表示）
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'game-container',
    width: 1280,
    height: 720
  },
  dom: {
    createContainer: true
  }
};

const game = new Phaser.Game(config);

// デバッグメニューのキーバインド（Dキー）
if (ENABLE_DEBUG_MENU) {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'd' || event.key === 'D') {
      const currentScene = game.scene.getScenes(true)[0];
      if (currentScene && currentScene.scene.key !== 'DebugMenuScene') {
        // 現在のシーンを一時停止
        currentScene.scene.pause();
        // デバッグメニューを起動
        currentScene.scene.launch('DebugMenuScene', { previousScene: currentScene.scene.key });
      }
    }
  });
  
  console.log('🔧 デバッグモード有効: Dキーでデバッグメニューを開く');
}
