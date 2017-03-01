# ナンバーリンクを解くスクリプト

## 使い方

### 準備

```bash
$ npm install
```

### 実行

```
$ ./number-link-cli.js -h

  Usage: number-link-cli [puzzle]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  if puzzle is not specified, please input puzzle from stdin

  Puzzle format: <w>x<h>:<grid>
       w: width
       h: height
    grid: numbers and dots

  Puzzle example: 6x6:3......4.31........2.....1.4.2......
```

コマンドラインで直接わたす

```bash
$ ./number-link.cli.js 6x6:3......4.31........2.....1.4.2......
```

または、標準入力から渡す

```bash
$ ./number-link-cli.js
Please input puzzle.
6x6:3......4.31........2.....1.4.2......
```

## なぜ作ったのか？

スリザーリンクを解くスクリプトを作っている最中に、`SAT Solver`なる便利そうなツールがあり、npmで`logic-solver`というのSAT Solverの実装を見つけたので使ってみたかった。

## 作る前に考えたこと

### 例題
http://drysyrup333.blog.fc2.com/blog-entry-135.html より

6x6のサイズ
```text
+---+---+---+---+---+---+
| 3 |   |   |   |   |   |
+---+---+---+---+---+---+
|   | 4 |   | 3 | 1 |   |
+---+---+---+---+---+---+
|   |   |   |   |   |   |
+---+---+---+---+---+---+
|   | 2 |   |   |   |   |
+---+---+---+---+---+---+
|   | 1 |   | 4 |   | 2 |
+---+---+---+---+---+---+
|   |   |   |   |   |   |
+---+---+---+---+---+---+
```

数独のGrid的に表記して、
```text
6x6:3......4.31........2.....1.4.2......
```
と置くことにします。

### 制約を考える

#### ルール

http://www.nikoli.com/ja/puzzles/numberlink/rule.html より

> 1. 白マスに線を引いて、同じ数字どうしをつなげましょう。
> 2. 線は、マスの中央を通るようにタテヨコに引きます。線を交差させたり、枝分かれさせたりしてはいけません。
> 3. 数字の入っているマスを通過するように線を引いてはいけません。
> 4. 1マスに2本以上の線を引いてはいけません。

調べて見ると、もう一つ

> すべてのマスに線が通る。

というのがあるらしい。
この制限がないと、別解の余地ができるみたい。(そういった別解のことを「関西解」というらしいです。)

#### 用語定義

* Matrix : 問題の全体の画面
* Element: それぞれのマス目
* Anchor: 問題で数字が指定されているElement
* Blank: 数字が指定されていない空白のElement

#### 制約

ナンバーリンクは、「線をつなぐ」→「Elementに数字を置いていく」と置き換えることができて、解けた状態では、あるAnchorから同じ数字を辿っていくと、もう一方のAnchorにたどり着ける状態になっている。

なので、制約としては、

1. Elementには必ず１つだけ数字が入る
2. Blankでは、隣り合うElementのうち、2つが同じ数字になる
3. Anchorでは、隣り合うElementのうち、1つだけが同じ数字になる

多分これだけで、いけるはず。
