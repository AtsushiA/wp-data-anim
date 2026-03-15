# WP Data Anim

WordPress ブロックエディター（Gutenberg）にアニメーション機能を追加するプラグインです。
[data-anim](https://github.com/ryo-manba/data-anim) ライブラリをベースにしており、スクロール・クリック・ホバーなど多彩なトリガーで 30 種類以上のアニメーションを設定できます。

---

## 機能

- **すべてのブロック**にアニメーション設定を追加（フィルター方式・ラッパー不要）
- Inspector パネルから全アニメーション設定を GUI で変更可能
- 静的ブロック・ダイナミックブロックどちらにも対応
- フロントエンドは [data-anim](https://github.com/ryo-manba/data-anim) ライブラリが処理（3KB 以下・依存ゼロ）
- `prefers-reduced-motion` 対応済み（OS のアクセシビリティ設定を尊重）

---

## 使い方

1. ブロックエディターで任意のブロック（段落・画像・カバーなど）を選択
2. 右サイドバーの **「アニメーション設定」** パネルでアニメーション種類を選択
3. トリガー・duration・delay などを必要に応じて調整

### フロントエンド出力例

```html
<div class="wp-block-cover"
     data-anim="fadeInUp"
     data-anim-trigger="scroll"
     data-anim-duration="1200"
     data-anim-delay="200">
  <!-- ブロックのコンテンツ -->
</div>
```

---

## アニメーション設定項目

| 設定項目 | 説明 | デフォルト |
|---|---|---|
| アニメーション種類 | 30 種類から選択（下記参照）。なし を選ぶと無効 | なし |
| トリガー | `scroll` / `load` / `click` / `hover` | `scroll` |
| duration | 再生時間（ms） | `1600` |
| delay | 遅延時間（ms） | `0` |
| イージング | `ease` / `ease-out-expo` / `ease-out-back` / `spring` | `ease` |
| offset | viewport 内の表示割合（0〜1） | `0.2` |
| distance | 移動距離（fadeInUp 等で使用） | `30px` |
| once | 1 回だけ再生 | `false` |
| mirror | viewport 離脱時に逆再生 | `false` |
| デバイス無効化 | `mobile` / `tablet` / `desktop` を指定して無効化 | なし |

### アニメーション一覧

| カテゴリ | 種類 |
|---|---|
| Fade | `fadeIn` `fadeOut` `fadeInUp` `fadeInDown` `fadeInLeft` `fadeInRight` |
| Slide | `slideInUp` `slideInDown` `slideInLeft` `slideInRight` |
| Zoom | `zoomIn` `zoomOut` `zoomInUp` `zoomInDown` |
| Bounce | `bounce` `bounceIn` `bounceInUp` `bounceInDown` |
| Attention | `shake` `pulse` `wobble` `flip` `swing` `rubberBand` |
| Rotate | `rotateIn` |
| Special | `blur` `clipReveal` `typewriter` |

---

## 動作環境

- WordPress 6.0 以上
- PHP 7.4 以上
- フロントエンドに CDN アクセス（`unpkg.com`）が必要

---

## ベースライブラリ

このプラグインは以下のライブラリをベースにしています。

**data-anim** — https://github.com/ryo-manba/data-anim
宣言的な `data-*` 属性だけでアニメーションを定義できる軽量ライブラリ（MIT License）

---

## ライセンス

MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
