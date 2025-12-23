# CYBER MIRROR (Motion Parallax App)

ユーザーの顔の動きをトラッキングし、奥行きのある3D空間と、鏡のように反応するデジタルアバターを描画するインタラクティブ・Webアプリケーションです。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-live-success.svg)

## 🌐 Demo
**[Launch App (Vercel)](https://motion-parallax-app.vercel.app/)**

## ✨ Features (機能)

### 1. Motion Parallax (視差効果)
顔を動かすことで、画面の奥にある世界を覗き込むような体験ができます。
- 背景、中間、前景のレイヤーが異なる速度で動き、強力な深度（奥行き）を感じさせます。

### 2. Cyber Mirror Avatar
あなたの顔がデジタルな点群（ポイントクラウド）として画面中央に映し出されます。
- 瞬き、口の動き、首の傾げなどをリアルタイムに反映します。

### 3. Emotion Feedback
**「鏡は先に笑わない」**
あなたがアバターに向かって微笑む（口角を上げる）と、アバターの色が冷たい青色から暖かい金色に変化します。

### 4. Calibration
どんな姿勢（寝そべり、ローテーブルなど）でも快適に操作できます。
- **[SPACE] キー** を押すと、現在の顔の位置を「中心」としてリセットします。

---

## 🚀 Usage

1.  上記デモリンクを開き、**カメラの使用を許可** してください。
2.  画面左上のステータスが `FACE DETECTED` になるのを待ちます。
3.  体を動かしてパララックスを楽しんだり、アバターに笑いかけたりして操作します。

---

## 👨‍💻 Development

技術的な詳細、コンポーネント構成、アーキテクチャについては、同梱の仕様書をご確認ください。

👉 **[See TECHNICAL SPECIFICATIONS (SPEC.md)](./SPEC.md)**

### Installation

```bash
# Clone repository
git clone https://github.com/iidaatcnt/motion-parallax-app.git

# Install dependencies
npm install

# Run development server
npm run dev
```
