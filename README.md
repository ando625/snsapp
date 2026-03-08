

# 🦅 SNSアプリ


このアプリは、投稿に対して「星（いいね）」を飛ばしたり、リアルタイムでコメントをやり取りできるSNSです。フロントエンドにはReact、バックエンドにはLaravelを採用し、非同期通信（axios）で読み込み中など表示

---

## 使用技術

Next.js 14+ (App Router)
TypeScript
Tailwind CSS
React Hooks (useState, useEffect)
CSS Keyframes (Custom animations)
Laravel 12
PHP 8.4
Laravel Sanctum
REST API (JSON)
MySQL
Docker
nginx 1.21.1
GitHub
npm / composer
Axios

---

## データベース設計

### テーブル

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

---

---


### アクセス

* **Frontend**: `http://localhost:3000`
* **Backend API**: `http://localhost:80`

---

### 🌟 開発のこだわりポイント (README用)

* **Eloquent Accessors**: Laravel側でデータを「浅く」整形し、フロントエンドでの描画負荷を軽減。
* **Micro-Interactions**: いいねボタンを押した際の「星の回転ジャンプ」など、ユーザー体験を高めるアニメーションを実装。

---




#### ## セットアップ方法 (Setup)

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



3. プロジェクトのルートphp上で実行
```
docker compose exec php bash
```



4. **環境設定ファイルの準備**
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


5. **ライブラリのインストール (PHP & JavaScript)**

```bash
composer install
```

```
npm install
```
エラーが出た場合はこちらで
```
npm install --legacy-peer-deps
```


6. **アプリケーションキーの生成とデータベース、シンボリックリンクの準備**
```bash
php artisan key:generate
php artisan migrate:fresh --seed
php artisan storage:link
```




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
