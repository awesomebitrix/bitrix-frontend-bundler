# Bitrix Frontend Bundler

Моя реализация сборщика CSS/JS компонентов в рамках проектов на 1С-Битрикс.

## Введение

Так что же мы будем собирать?

**Основной JS:** _/local/source/js/_ 

Это любые JS-файлы в указанной папке.
Здесь можно смело использовать все прелести стандарта ES6, потому что всё это скомпилируется в ES5.

Билд: _/local/build/main.js_



**Основные стили:** _/local/source/scss/_

Любые SCSS файлы в указанной папке.

Компилируется в обычный CSS. 

Билд: _/local/build/main.css_



**Вспомогательный JS:** _/local/source/vendor/js/_

Любые JS-файлы в указанной папке.

Билд: _/local/build/vendor.js_



**Вспомогательный CSS:** _/local/source/vendor/css/_

Любые CSS-файлы в указанной папке.

Билд: _/local/build/vendor.css_




## Установка

Менеджером NPM-пакетов выступит Yarn, а собирать всё будет силами Gulp.js.
Следующий способ установки применим для систем CentOS:

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

Собрать запустить сборку можно так:
```bash
$ yarn build
```

Также предусмотрен watch-режим, с перезапуском Gulp при изменениях gulpfile.js:

```bash
$ yarn serve
```

Если сборка работает успешно, то в шаблоне сайта нам достаточно подключить 4 файла:
```php
$assetManager = \Bitrix\Main\Page\Asset::getInstance();
$assetManager->addCss('/local/build/vendor.css');
$assetManager->addJs('/local/build/vendor.js');
$assetManager->addCss('/local/build/main.css', true);
$assetManager->addJs('/local/build/main.js', true);
```
## Режим разработки

По-умолчанию файлы билда будут минифицированы и их отладка будет весьма затруднительной. Данный подход применим для продакшна. Для девелопмент-версий проектов вам следует определить переменную среды _DEV_SERVER_ со значением 1.

Например:

```bash
$ export DEV_SERVER=1
```
В данном случае файлы не будут минифицироваться + добавятся .map-файлы для отладки.


## Итог
Вот и всё! На тестовых серваках используем _yarn serve,_ а в продакшене запускаем _yarn build_ при деплое (см. _deploy.php_).
