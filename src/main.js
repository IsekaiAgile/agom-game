import Phaser from 'phaser';
import PrologueScene from './scenes/PrologueScene';

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game-container',
  backgroundColor: '#000000',
  scene: [PrologueScene],
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
