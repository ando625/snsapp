

# 🦅 SNSアプリ


## アプリの概要

このアプリは、Next.js（フロントエンド）と Laravel（バックエンド）を組み合わせたSNSアプリケーションです。画面全体を読み込み直さずに、その場でデータが更新されるスムーズな操作感を取り入れています。

### 主な機能

1. **ユーザー登録とプロフィールの作成**
メールアドレスとパスワードで自分専用のアカウントを作成できます。アカウント作成後は、自分のニックネームやプロフィール画像を設定し、いつでも変更することが可能です。
2. **タイムラインへの投稿と閲覧**
全ユーザーの投稿を一覧で確認できます。自分が新しく投稿した際は、ページを読み込み直すことなく、その場でリストの先頭に追加されます。なお、投稿には投稿した日付が表示されます。自分の投稿のみ削除可能です。
3. **投稿への「いいね」リアクション**
良いと思った投稿に対して、星マークのボタンで反応を送ることができます。ボタンを押すと星が回転しながら色が変わり、合計のいいね数がカウントされます。一度いいねをした状態は保存され、再度ログインしても維持されます。
4. **コメントによるコミュニケーション**
各投稿に対してコメントを残すことができます。コメント欄はボタンで表示・非表示を切り替えることができ、誰が書いたコメントなのかがアイコンと一緒に表示されます。また、「1分前」「2時間前」のように、投稿からの経過時間が直感的にわかる表示を取り入れています。
5. **自分専用の投稿管理**
自分のプロフィールページでは、これまでに自分が投稿した内容だけを一覧で確認することができます。


6. **AIによる感情分析と動的なリアクション**

投稿内容をPythonプログラムでリアルタイムに分析し、その感情に合わせた演出を行います。

* **感情スコアの算出（Python連携）**
投稿時にバックエンドからPythonスクリプトを呼び出し、独自のロジックで内容のポジティブ・ネガティブ度を0〜100点の間で数値化します。
* **「生まれたて」の投稿への特別演出**
新しく投稿された直後（10秒以内）の投稿が画面に表示された際、スコアに応じて3秒間だけ特別な演出が発生します。
* **ポジティブ（55点以上）**: 枠が金色に輝き、「☀️ 素敵な時間でしたね、いいね！」とお祝いメッセージが表示されます。
* **ネガティブ（45点以下）**: 枠が優しく青色に変化し、「☁️ 大丈夫、ゆっくり休んでね。」と寄り添うメッセージが表示されます。


* **データの永続化とUXの配慮**
感情スコアはデータベースに保存されるため、リロードしても点数が変わることはありません。また、古い投稿がリロードのたびに光らないよう、投稿時間と現在時刻を比較して演出の有無を制御するロジックを組み込んでいます。


7. **リアルタイム通知機能**
自分の投稿にたいてアクション（コメント・いいね）があった際、画面上部の鈴マークに通知が届きます。
- **未読バッジ**：新しい通知がある時は赤いバッジで件数を表示し、視覚的に知らせます。
- **クイックプレビュー**：鈴マークをクリックすると、誰がいつ反応したかを一覧で確認できるドロップダウンメニューが表示されます。
- **ダイレクトジャンプ**：通知をクリックすると該当する投稿位置まで自動的にスクロール（アンカーリンク）し、即座に内容を確認でます。

---

## 機能要件、テーブル仕様書、基本設計はこちらから
- https://docs.google.com/spreadsheets/d/1bPW1i7fDpJEod6UAV_DA4im0AejUD5gZ5z-DvwrmjuA/edit?usp=sharing 

---

## 使用技術

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- React Hooks (useState, useEffect)
- Laravel 12
- PHP 8.4
- Laravel Sanctum
- REST API (JSON)
- MySQL
- Docker
- nginx 1.21.1
- GitHub
- npm / composer
- Axios
- Python 3.13.5

---

## データベース設計


### 1. users テーブル
ユーザーの基本情報を管理します。
| カラム名 | 型 | 詳細 |
| :--- | :--- | :--- |
| id | unsigned bigint | プライマリキー |
| name | string | 氏名 |
| email | string | メールアドレス (Unique) |
| password | string | パスワード (Hash) |
| created_at | timestamp | 作成日時 |
| updated_at | timestamp | 更新日時 |

### 2. profiles テーブル
ユーザーの表示名や画像を管理します（1対1の関係）。
| カラム名 | 型 | 詳細 |
| :--- | :--- | :--- |
| id | unsigned bigint | プライマリキー |
| user_id | unsigned bigint | users(id) 外部キー |
| nickname | string | 表示名（ニックネーム） |
| profile_image | string | プロフィール画像パス (Nullable) |
| created_at | timestamp | 作成日時 |
| updated_at | timestamp | 更新日時 |

### 3. posts テーブル
ユーザーの投稿内容を管理します。
| カラム名 | 型 | 詳細 |
| :--- | :--- | :--- |
| id | unsigned bigint | プライマリキー |
| user_id | unsigned bigint | users(id) 外部キー |
| content | text | 投稿本文 |
| created_at | timestamp | 作成日時 |
| updated_at | timestamp | 更新日時 |

### 4. comments テーブル
投稿に対するコメントを管理します。
| カラム名 | 型 | 詳細 |
| :--- | :--- | :--- |
| id | unsigned bigint | プライマリキー |
| user_id | unsigned bigint | users(id) 外部キー |
| post_id | unsigned bigint | posts(id) 外部キー |
| body | text | コメント本文 |
| created_at | timestamp | 作成日時 |
| updated_at | timestamp | 更新日時 |

### 5. likes テーブル
投稿に対する「いいね」を管理します（1人1回制限）。
| カラム名 | 型 | 詳細 |
| :--- | :--- | :--- |
| id | unsigned bigint | プライマリキー |
| user_id | unsigned bigint | users(id) 外部キー |
| post_id | unsigned bigint | posts(id) 外部キー |
| created_at | timestamp | 作成日時 |
| updated_at | timestamp | 更新日時 |
※ `user_id` と `post_id` の組み合わせはユニーク。



### 6. notifications テーブル
ユーザーへの通知履歴を管理します。
| カラム名 | 型 | 詳細 |
| :--- | :--- | :--- |
| id | unsigned bigint | プライマリキー |
| user_id | unsigned bigint | 通知を受け取るユーザー(id) 外部キー |
| notified_by | unsigned bigint | アクションを起こしたユーザー(id) 外部キー |
| post_id | unsigned bigint | 対象の投稿(id) 外部キー |
| type | string | 通知の種類（`comment`, `like`） |
| is_read | boolean | 既読フラグ（デフォルト: `false`） |
| created_at | timestamp | 作成日時 |
| updated_at | timestamp | 更新日時 |


---




## セットアップ方法

このプロジェクトをローカル環境で起動するための手順です。

1. **リポジトリをクローンする**
```bash
git clone git@github.com:ando625/snsapp.git
cd snsapp

```

2. **Dockerコンテナの起動**
```bash
docker compose up -d --build

```

3. snsappからフロントエンドnextで実行
```
snsapp
├──  Laravel(backend)
└──  Next(frontend) ← ココ
```

```
npm install
```




4. プロジェクトのルートphp上で実行
```
docker compose exec php bash
```



5. **環境設定ファイルの準備**
```bash
cp .env.example .env

```

※ .env ファイルを開き、データベースの設定を以下のように書き換えてください：

```
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=laravel_db
DB_USERNAME=laravel_user
DB_PASSWORD=laravel_pass
```


6. **ライブラリのインストール**

```bash
composer install
```




7. **アプリケーションキーの生成とデータベース、シンボリックリンクの準備**
```bash
php artisan key:generate
php artisan migrate:fresh --seed
php artisan storage:link
```

---
### アクセス

* **Frontend**: http://localhost:3000 
* **Backend API**: http://localhost:80

---

#### テストユーザー

| メールアドレス        | パスワード |
|-----------------------|------------|
| yamada@example.com | pass1234   |


**UserSeeder.phpで作成しているのでログインする前に一度確認してください**


---


## phpMyAdmin

- URL: http://localhost:8080/
- ユーザー名・パスワードは `.env` と同じ
- DB: `laravel_db` を確認可能

---
