import Phaser from 'phaser';
import LogoScene from './scenes/LogoScene';
import OpeningVideoScene from './scenes/OpeningVideoScene';
import DebugMenuScene from './scenes/DebugMenuScene';
import PrologueScene from './scenes/PrologueScene';
import EligiaTitleScene from './scenes/EligiaTitleScene';
import DarknessScene from './scenes/DarknessScene';
import LeiguaScene from './scenes/LeiguaScene';
import ChaseScene from './scenes/ChaseScene';
import AgairudoTitleScene from './scenes/AgairudoTitleScene';
import TrialScene from './scenes/TrialScene';
import AjadraScene from './scenes/AjadraScene';
import DoorSelectionScene from './scenes/DoorSelectionScene';
import JobConfirmScene from './scenes/JobConfirmScene';
import TownScene from './scenes/TownScene';

// 試練シーンは後で実装
// import WarriorTrialScene from './scenes/WarriorTrialScene';
// import MageTrialScene from './scenes/MageTrialScene';
// import ScrumMasterTrialScene from './scenes/ScrumMasterTrialScene';

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
  scene: [
    LogoScene,
    OpeningVideoScene,
    DebugMenuScene,
    PrologueScene,
    EligiaTitleScene,
    DarknessScene,
    LeiguaScene,
    ChaseScene,
    AgairudoTitleScene,
    TrialScene,         // これは後で ChaseScene に改造
    AjadraScene,
    DoorSelectionScene,
    JobConfirmScene,
    TownScene
    // 試練シーンは後で追加
    // WarriorTrialScene,
    // MageTrialScene,
    // ScrumMasterTrialScene
  ],
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
