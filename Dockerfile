FROM composer:latest AS composer
FROM php:8.2-fpm

# Installing system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    supervisor \
    default-mysql-client

# Installing PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Installing Node.js and NPM
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Copy Composer from the builder stage
COPY --from=composer /usr/bin/composer /usr/bin/composer

# Setting the working directory
WORKDIR /var/www

# Copy composer and package files
COPY composer.json composer.lock /var/www/
COPY package.json package-lock.json /var/www/

# Install PHP dependencies
RUN composer install --no-interaction --no-scripts --prefer-dist --optimize-autoloader

# Copy the rest of the application code
COPY . /var/www

# Set permissions for the storage and cache directories
RUN mkdir -p /var/www/storage /var/www/bootstrap/cache && \
    chown -R www-data:www-data /var/www && \
    chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Exposing the ports
EXPOSE 9000 8080 8000 5173

# Copy Supervisor configuration
COPY supervisord.conf /etc/supervisor/supervisord.conf
