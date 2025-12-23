# CYBER MIRROR - Motion Parallax App

Webカメラを使用してユーザーの「顔の動き」をトラッキングし、深度のある3D空間体験と、鏡のように反応するデジタルアバターを提供するインタラクティブ・アプリケーションです。

## 🌐 Demo
[https://motion-parallax-app.vercel.app/](https://motion-parallax-app.vercel.app/)

## 🚀 Key Features (主な機能)

### 1. Motion Parallax Control
顔の位置（上下左右）をリアルタイムに検知し、画面内の複数のレイヤー（背景、中間、前景、UI）を異なる速度で移動させます。これにより、まるで「窓やコックピットを通して奥行きのある世界を覗き込んでいる」ような錯覚を生み出します。
- **感度増幅**: わずかな頭の動きでダイナミックな視点移動を実現。
- **3D Tilt**: 画面全体が傾くようなパースペクティブ効果を追加。

### 2. Cyber Mirror Avatar (サイバーミラー)
画面中央に表示される点群（Point Cloud）のアバターは、ユーザー自身の顔の動きと完全に同期します。
- **瞬き・口の動き・首の傾げ** をリアルタイムに反映。
- **"自己認識"**: 「これは自分の動きだ」と直感的に理解できるデジタルインターフェース。

### 3. Smile Interaction (笑顔検知)
> 「鏡は先に笑わない（鏡の中の誰かに笑って欲しければ、まず自分が笑いかけよ）」

この哲学を体現するため、ユーザーの表情を分析し、**微笑み（Smile）** を検知するとアバターの色が変化します。
- **通常時**: Cool Cyan (青緑色)
- **笑顔時**: Warm Gold (暖色)

### 4. Calibration System (位置リセット)
ノートPCを低いテーブルに置いたり、寝そべった姿勢で使用したりする場合でも、ワンボタンで「現在の顔の位置」を「真正面（ゼロ地点）」として再設定できます。
- **操作**: `SPACE` キー または 画面下の `RESET CENTER` ボタン。

## 🛠 Tech Stack
- **Framework**: React (TypeScript) + Vite
- **Face Tracking**: Google MediaPipe Face Mesh
- **Styling**: Vanilla CSS Points / Tailwind Utilities
- **Deployment**: Vercel

## 📖 How to Use
1.  アプリを開き、**カメラの使用を許可** してください。
2.  数秒待つと、左上のSTATUSが `FACE DETECTED` になり、画面中央にアバターが表示されます。
3.  体を左右に動かしたり、覗き込むように動いて、背景のパララックス効果を楽しんでください。
4.  **キャリブレーション**: 視点がずれていると感じたら、楽な姿勢で **[SPACE]** キーを押してください。
5.  **スマイル**: 画面のアバターに向かって微笑んでください。色が暖かく変化します。

---
Created by Antigravity
