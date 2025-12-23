# Developer Specifications (SPEC)

## 🏗 Architecture Overview

このアプリケーションは、Webカメラからの入力をリアルタイムで解析し、その結果（顔の位置・特徴点）を視覚的なフィードバック（パララックス効果・アバター）として描画する `React` アプリケーションです。

### Tech Stack
- **Frontend Framework**: React 18
- **Build Tool**: Vite (TypeScript)
- **Face Tracking**: `@mediapipe/face_mesh`, `@mediapipe/camera_utils`
- **Component Styling**: Vanilla CSS (Variables) + Tailwind CSS Classes
- **Deployment**: Vercel

---

## 🧩 Component Structure

### 1. `App.tsx` (Root Controller)
アプリケーションの状態管理のハブとして機能します。
- **State**:
    - `landmarks`: 顔の全特徴点データ（HoloAvatar用）。
    - `facePosition`: パララックス用に正規化された {x, y} 座標。
    - `offset`: キャリブレーション用のオフセット値。
- **Logic**:
    - `FaceTracker` からのデータを受け取り、キャリブレーション計算を行い、各コンポーネントに分配します。
    - Keyboard Event (`SPACE` key) を監視し、リセット処理を実行します。

### 2. `FaceTracker.tsx` (Input / Sensor)
カメラ映像の取得と MediaPipe の実行を担当します。
- **機能**:
    - `react-webcam` で映像を取得。
    - `FaceMesh` モデルをロードし、フレームごとに推論を実行。
    - 検出結果（Landmarks）を親コンポーネントにコールバック。
    - **Debug UI**: 画面右下に生のカメラ映像と接続ステータスを表示。

### 3. `ParallaxScene.tsx` (Output / Environment)
顔の位置に基づき、複数のレイヤーを制御して深度表現を行います。
- **Layering**:
    - `Background`: 宇宙・グリッド（動き：小 / 同方向）
    - `Midground`: 幾何学オブジェクト（動き：中 / 逆方向）
    - `Foreground`: テキスト（動き：大 / 逆方向）
    - `UI`: コックピット風HUD（動き：微細 + 3D回転）
- **Performance**:
    - `requestAnimationFrame` と `lerp` (線形補間) を使用し、60fpsで滑らかなアニメーションを実現。
    - Reactの再レンダリングを避けるため、DOM要素への `style.transform` 直接操作を採用。

### 4. `HoloAvatar.tsx` (Output / Character)
ユーザーの顔をデジタル空間に投影します。
- **Rendering**:
    - HTML5 Canvas を使用した軽量な2D描画。
    - 468点のランドマークを点群（Point Cloud）として描画。
- **Smile Detection**:
    - 口角の距離と顔の幅の比率から「笑顔度」を計算。
    - 閾値を超えた場合、点の色を `Cyan` から `Orange/Gold` へ補間。

---

## 💾 Data Flow

1.  **Input**: Webcam Video Feed (30fps)
2.  **Process**: MediaPipe Face Mesh -> Landmarks[468]
3.  **State Update**:
    - `Landmarks` -> 直接 `HoloAvatar` へ
    - `Face Center (Nose Tip)` -> Offset計算 -> `ParallaxScene` へ
4.  **Render**: Canvas Drawing & CSS Transform Updates

## ⚠️ Constraints & Considerations
- **Vercel Build**: TypeScript の厳格なチェック（未使用変数など）によりビルドが落ちる可能性があるため、`package.json` / `tsconfig` で一部緩和、またはコード側で未使用変数を徹底排除している。
- **Performance**: MediaPipe の処理負荷が高いため、Canvas描画は間引き（`i % 2`）などの最適化を行っている。
