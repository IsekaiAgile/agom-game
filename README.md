# AGOM - アガイルドの炎 🔥

![Development Status](https://img.shields.io/badge/status-in%20development-yellow)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20PC%20%7C%20Mobile-blue)
![License](https://img.shields.io/badge/license-MIT%20%28code%29-green)

**現実の仕事に疲れた30-40代に贈る、異世界アジャイルRPG**

> 「変化を自ら求める、あなたの一歩を後押しするRPG」

---

## 🎮 概要

**AGOM（Agile Gamified Operation Model）** は、停滞からの脱却をテーマにした異世界RPGです。

### ストーリー

ITエンジニアのフジは、過労で倒れる。  
目覚めたそこは、異世界「アガイルド」だった。

停滞の王に支配され、人々が挑戦を恐れるようになったこの世界で、  
フジは「守護者」として、世界を再び動かす旅に出る。

---

## ✨ 特徴

- **共感できる主人公**: チート無し。現実の疲労と責任感を背負った30-40代
- **選択が物語を変える**: ドラクエ風の選択肢システム
- **行動ベースの成長**: プレイヤーの選択で能力が変化
- **アジャイル思想の体現**: 停滞vs変化、責任vs信頼、孤独vs協働
- **現実に活かせる学び**: ゲーム内の気づきを現実世界へ

---

## 🚀 開発状況

### ✅ 完成
- [x] プロローグ（78行のシナリオ）
- [x] 選択肢システム
- [x] GAME OVER画面
- [x] BGM実装

### 🔨 開発中
- [ ] 試練の間（職業選択）
- [ ] 背景画像

### 📋 予定
- [ ] 序盤RPGパート
- [ ] 行動ベースステータスシステム
- [ ] 振り返りシステム

詳細は [ROADMAP.md](ROADMAP.md) を参照

---

## 🎯 出展予定

### ニコニコ超会議 2026（4月末）
**出展内容**: プロローグ + 職業選択試練  
**プレイ時間**: 15-20分

### 東京ゲームショウ 2026（9月）
**出展内容**: プロローグ + 試練 + 序盤RPG  
**プレイ時間**: 60-90分

---

## 🛠️ 技術スタック

- **フレームワーク**: Vite
- **ゲームエンジン**: Phaser.js 3.x
- **言語**: JavaScript (ES6+)
- **プラットフォーム**: Web（PC/Mobile対応）

---

## 🎨 世界観

### 主要キャラクター

- **フジ・カゼハヤ（主人公）**: 守護者（SM）。元ITエンジニア
- **ツバキ・フレイムロード**: 炎冠王家の末裔（PO）
- **アジャドラ**: フジを導く小さな竜
- **グラジオアス**: 大地の鍛冶士（Dev）
- **コウリン・タンポポ**: 灯輪族の錬金術師（Dev）
- **ヤマブキ・カナリア**: 月鏡塔の設計技師（Dev）

### 敵

- **停滞の王（マルデス）**: 変化を凍らせる支配者

詳細は [世界観設定ドキュメント](docs/WORLD.md)（後日追加予定）

---

## 🎵 使用素材

### BGM
- 魔王魂（https://maou.audio/）

### SE
- フリー素材使用予定

### グラフィック
- Canva + AI生成 + 外注

---

## 🚦 ローカル環境でのセットアップ

```bash
# リポジトリをクローン
git clone https://github.com/IsekaiAgile/agom-game.git
cd agom-game

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで `http://localhost:5173/` を開く

**注意**: BGMファイル（`public/audio/*.mp3`）はGitHubに含まれていません。  
各自でフリー素材をダウンロードして配置してください。

---

## 📂 プロジェクト構造

```
agom-game/
├── public/           # 静的ファイル
│   └── audio/       # BGM/SE（.gitignoreで除外）
├── src/
│   ├── main.js      # エントリーポイント
│   └── scenes/      # ゲームシーン
│       └── PrologueScene.js  # プロローグ
├── index.html
├── package.json
├── ROADMAP.md       # 開発ロードマップ
└── README.md
```

---

## 🤝 コントリビューション

現在は個人開発ですが、フィードバックやアイデアは大歓迎です！

- **Issue**: バグ報告、機能提案
- **Discussion**: ゲームデザインに関する議論
- **Pull Request**: コード改善（要相談）

---

## 📜 ライセンス

### コード
MIT License - 自由に使用・改変・配布可能

### ストーリー・キャラクター・世界観
© 2026 パンプキング - All Rights Reserved  
ゲームのストーリー、キャラクター設定、世界観は著作権で保護されています

---

## 👤 開発者

**パンプキング**  
- GitHub: [@IsekaiAgile](https://github.com/IsekaiAgile)
- Twitter: （後日追加予定）
- Email: （後日追加予定）

---

## 🙏 謝辞

- **シナリオライター**: （春頃合流予定）
- **BGM**: 魔王魂
- **開発支援**: Claude (Anthropic)

---

## 📊 開発進捗

![GitHub commit activity](https://img.shields.io/github/commit-activity/m/IsekaiAgile/agom-game)
![GitHub last commit](https://img.shields.io/github/last-commit/IsekaiAgile/agom-game)

**最終更新**: 2026年1月24日

---

**Let's escape from stagnation together! 🚀**
