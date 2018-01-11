# Bitrix Frontend Bundler

Моя реализация сборщика CSS/JS компонентов в рамках проектов на 1С-Битрикс.

### Введение

Что из чего мы всё-таки собираем?

**Основной JS.** Это любые JS-файлы в папке /local/source/js/.
Можно смело применять всю мощь ES6: модуль
Babel затранспайлит код в ES5. Билд: /local/build/main.js

**Основные стили.** Любые SCSS файлы в папке /local/source/scss/.
Компилируется в обычный CSS. Билд: /local/build/main.css


**Вспомогательный JS.** Любые JS-файлы по адресу /local/source/vendor/js/.
Билд: /local/build/vendor.js

**Вспомогательный CSS.** Любые CSS-файлы по адресу /local/source/vendor/css/.
Билд: /local/build/vendor.css

По-умолчанию билд будет минифицирован. Но это можно отменить, если задать переменную среды DEV_SERVER=1

```bash
$ DEV_SERVER=1
```

### Управление

Собрать весь фронтэнд можно следующим образом:
```bash
$ gulp build
```

Запустить прослушивание файлов-исходников и, при их изменениях, скомпилировать более свежий билд:
```bash
$ gulp watch
```

Собрать все билды, запустить прослушивание файлов и перезапускать Gulp при изменениях gulpfile.js:

```bash
$ gulp serve
```

После этого в шаблоне сайта мы подключаем всего лишь 4 файла:
```php
$assetManager = \Bitrix\Main\Page\Asset::getInstance();
$assetManager->addCss('/local/build/vendor.css');
$assetManager->addJs('/local/build/vendor.js');
$assetManager->addCss('/local/build/main.css', true);
$assetManager->addJs('/local/build/main.js', true);
```

Вот и всё! В тестовых песочницах используем _gulp serve,_ а в продакшене запускаем _gulp build_ при деплое.