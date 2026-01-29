import { defineConfig } from 'vite'

export default defineConfig({
  base: '/agom-game/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Phaserを別チャンクに分離
          if (id.includes('node_modules/phaser')) {
            return 'phaser';
          }
          // シーンを個別のチャンクに分離
          if (id.includes('src/scenes/')) {
            const sceneName = id.split('scenes/')[1].split('.')[0];
            return `scene-${sceneName}`;
          }
        }
      }
    },
    // チャンクサイズの警告を調整（Phaserは約1.2MBなので1500KBに設定）
    chunkSizeWarningLimit: 1500
  }
})
