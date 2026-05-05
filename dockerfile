# Use the official PHP image with Apache
FROM php:8.2-apache

# Install required system packages and PostgreSQL drivers for Supabase
RUN apt-get update && apt-get install -y \
    libpq-dev \
    zip \
    unzip \
    git \
    && docker-php-ext-install pdo pdo_pgsql

# Enable Apache routing (required for Laravel)
RUN a2enmod rewrite

# Change Apache's root folder to Laravel's /public folder
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Copy your Laravel code into the server
COPY . /var/www/html

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Give the server permission to write to storage (for logs/cache)
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache