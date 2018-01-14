# Bitrix Frontend Bundler

Моя реализация сборщика JS/CSS компонентов в рамках проектов на 1С-Битрикс.

## Введение

Так что же мы будем собирать?

**Основной JS:** _/local/source/js/**/*.js_ 

Это любые JS-файлы в указанной папке. На выходе получите 2 файла: собранный оригинал и его ES5-версия. Так что можно смело использовать все прелести ES6, не парясь о работе кода в каком-нибудь IE10.

Подключайте файлы динамически через JS: сначала определите поддерживается ли ES6, потом подключайте соответствующий билд-файл (см. пример ниже).

Результат: _/local/build/main.latest.js_ и _/local/build/main.es5.js_

**Основные стили:** _/local/source/scss/**/*.scss_

Любые SCSS-файлы в указанной папке, кроме файлов импорта.

Компилируется в обычный CSS. 

Результат: _/local/build/main.css_



**Вспомогательный JS:** _/local/source/vendor/js/**/*.js_

Любые JS-файлы в указанной папке.

Результат: _/local/build/vendor.js_



**Вспомогательный CSS:** _/local/source/vendor/css/**/*.css_

Любые CSS-файлы в указанной папке.

Результат: _/local/build/vendor.css_




## Установка

Менеджером npm-пакетов выступит Yarn, а собирать всё будет силами Gulp.js.
Пример установки под CentOS:

```bash
$ wget https://dl.yarnpkg.com/rpm/yarn.repo -O /etc/yum.repos.d/yarn.repo
$ curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -
$ yum install -y yarn
$ yarn global add gulp
```

## Управление

Если ваша система готова к работе с Yarn и Gulp, тогда кладём следующие файлы в корень сайта:
* _gulpfile.js_
* _package.json_
* _.babelrc_

После этого, находясь в корне сайта, делаем:
```bash
$ yarn install
```

Запустить сборку можно так:
```bash
$ yarn build
```

Также предусмотрен watch-режим - сборка отдельных билдов при изменениях исходников + перезапуск Gulp при изменении gulpfile.js:
```bash
$ yarn serve
```

## Подключение JS/CSS на странице

Сейчас поговорим о подключении JS/CSS. Собранные стили (vendor.css и main.css) я подключаю на уровне PHP:

```php
$assetManager = \Bitrix\Main\Page\Asset::getInstance();
$assetManager->addCss('/local/build/vendor.css');
$assetManager->addCss('/local/build/main.css', true);
```

А основной JS советую подключать динамически, в зависимости от поддержки ES6. Например так:
```html
<script>
    function onVendorJsLoaded() {
        if(supportedLatestJs()) {
            loadDynamicJs('/local/build/main.latest.js');
        } else {
            loadDynamicJs('/local/build/main.es5.js');
        }
    }

    loadDynamicJs('/local/build/vendor.js', onVendorJsLoaded);
</script>
```

То есть в последнем Chrome подключиться _main.latest.js_, а в IE11 подключится _main.es5.js_
Исходники этих функций ищите в _/local/tools/js-includer.js_.

## Режим разработки

По-умолчанию файлы билда будут минифицированы и их отладка будет весьма затруднительной. Данный подход применим для продакшна. Для девелопмент-версий проектов вам следует определить переменную среды _DEV_SERVER_ со значением 1.

Например:

```bash
$ export DEV_SERVER=1
```
В данном случае файлы не будут минифицироваться + добавятся .map-файлы для отладки.


## Итог
Вот и всё! На дев-серверах используем _yarn serve,_ а в продакшене запускаем _yarn build_ при деплое (см. _deploy.php_).
