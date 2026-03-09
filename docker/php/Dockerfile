FROM php:8.4-fpm

# 設定ファイルをコピー
COPY php.ini /usr/local/etc/php/

# 必要な道具をインストール（libpng-dev を追加！）
RUN apt update && apt install -y \
    default-mysql-client \
    zlib1g-dev \
    libzip-dev \
    libpng-dev \
    unzip \
    curl \
    gnupg \
    python3

# PHPの拡張機能（gd を追加！）
# これでプロフィール画像などの加工ができるようになります
RUN docker-php-ext-install pdo_mysql zip bcmath gd

# ★Node.jsのインストール部分は削除してOK！（Nextコンテナで動かすため）

# Composer をインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www