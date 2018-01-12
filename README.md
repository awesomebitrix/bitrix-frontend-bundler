# Bitrix Frontend Bundler

Моя реализация сборщика CSS/JS компонентов в рамках проектов на 1С-Битрикс.

### Установка

Будем устанавливать пакетный менеджер Yarn и таск-менеджер Gulp.
Данный способ применим для систем CentOS:

```bash
# wget https://dl.yarnpkg.com/rpm/yarn.repo -O /etc/yum.repos.d/yarn.repo
# curl --silent --location https://rpm.nodesource.com/setup_6.x | bash - && yum install -y yarn
# yarn global add gulp
```

### Введение

Что из чего мы всё-таки собираем?

**Основной JS:** _/local/source/js/_ 

Это любые JS-файлы в указанной папке.
Можно смело применять всю мощь ES6: модуль
Babel затранспайлит код в ES5. Билд: _/local/build/main.js_

**Основные стили:** _/local/source/scss/_

Любые SCSS файлы в указанной папке.
Компилируется в обычный CSS. Билд: _/local/build/main.css_


**Вспомогательный JS:** _/local/source/vendor/js/_

Любые JS-файлы в указанной папке.
Билд: _/local/build/vendor.js_

**Вспомогательный CSS:** _/local/source/vendor/css/_

Любые CSS-файлы в указанной папке.
Билд: _/local/build/vendor.css_

Как вы уже поняли, можно создавать сколько угодно scss/css/js файлов в папке исходников: весь код будет конкатенироваться в один файл.
Вдобавок к этому, результат будет минифицирован, но это можно отключить, задав переменную среды _DEV_SERVER=1_


```bash
$ export DEV_SERVER=1
```

#### Source maps

Стоит отметить, что если не выставлена переменная окружения _DEV_SERVER=1_, то к каждому файла билда будет прилагаться файл _source-map_. Это в разы облегчит отладку скомпилированных файлов.


### Управление

Если ваша система готова к работе с Yarn и Gulp, тогда кладём следующие файлы в корень сайта:
* _gulpfile.js_
* _package.json_
* _.babelrc_

После этого, находясь в корне сайта, делаем:
```bash
$ yarn install
```

Собрать весь фронтэнд можно следующим образом:
```bash
$ yarn build
```

Запустить прослушивание файлов-исходников и, при их изменениях, скомпилировать более свежий билд:
```bash
$ yarn watch
```

Собрать все билды, запустить прослушивание файлов и перезапускать Gulp при изменениях _gulpfile.js_ (применяется в тестовых песочницах):

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

Вот и всё! На тестовых серваках используем _yarn serve,_ а в продакшене запускаем _yarn build_ при деплое (см. _deploy.php_).


