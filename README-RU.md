# Protoss
Набор [Gulp](http://gulpjs.com/)-тасков для сборки frontend.

## Возможности
0. Компиляция [Jade](https://pugjs.org/api/getting-started.html) шаблонов, тестирование валидности HTML. Опциональное использование PostHTML плагинов.
0. Компиляция [SCSS](http://sass-lang.com/), добавление вендорных префиксов, оптимизация и минификация. Опциональное использование PostCSS плагинов. Разделение по бандлам с разными настройками. Можно использовать `glob` импорты.
0. Объединение и минификация JavaScript с разделением на бандлы.
0. Генерация любого количества png-спрайтов (с поддержкой retina).
0. Генерация любого количества svg-спрайтов (опциональный fallback на png спрайт для старых браузеров).
0. Генерация любого количества наборотв svg-иконок.
0. Оптимизация изображений.
0. [BrowserSync](https://www.browsersync.io/).
0. Генерация favicons.  
0. Добавление постфиксов для сброса кэша в HTML и CSS файлах.  
0. Утилиты для копирования/удаления файлов.
0. Sourcemaps для SCSS и JavaScript.
0. Гибкий конфиг.

## Установка

Вам потребуется установленный глобально Gulp:
``$ npm install -g gulp``

И установленные в проекте Gulp и Protoss:
``$ npm install --save-dev gulp``
``$ npm install --save-dev protoss``

Создайте в корне проекта файл `gulpfile.js` со следующим содержанием:
``
var gulp = require('gulp');
var config = require('./protoss-config.js');
require('protoss')(gulp, config);
``
И файл `protoss-config.js` с [конфигурацией](#Конфигурация).

Теперь вы можете использовать таски Protoss и добавлять по необходимости свои.

[Демо-проект](https://github.com/andrey-hohlov/protoss/tree/master/demo/1-basic)

## Таски

Для запуска таска воспользуйтесь командой `gulp %taskName%`.

`protoss/watch` - собрать dev-версию проекта и запустить все watchers

`protoss/watch-and-sync` - собрать dev-версию проекта, запустить все watchers и локальный веб-сервер, открыть браузер

`protoss/build` - полностью очистить build-директорию и собрать production-версию проекта

`protoss/dev` - собрать dev-версию проекта

`protoss/styles:build` - собрать CSS-бандлы со всеми оптимизациями и добавлением хэшей

`protoss/scripts:build` - собрать JS-бандлы со всеми оптимизациями

`protoss/templates:build`  - собрать HTML с форматированием и добавлением хэшей

`protoss/styles` - собрать CSS-бандлы

`protoss/styles:lint` - проверить SCSS с помощью [stylelint](http://stylelint.io/)

`protoss/scripts` - собрать JS-бандлы

`protoss/scripts:lint` - проверить JS с помощью [ESLint](http://eslint.org/)

`protoss/templates` - собрать HTML

`protoss/icons` - собрать наборы svg-иконок

`protoss/images` - скопировать изображения в build-директорию

`protoss/sprites` - собрать png-спрайты

`protoss/sprites-svg` - собрать svg-спрайты

`protoss/favicons` - сгенерировать favicons

`protoss/copy` - скопировать необходимые файлы в build-директорию

`protoss/del` - очистить build-директорию

`protoss/templates:w3c` - протестировать валидность HTML

## Конфигурация

Конфигурация по умолчанию находится в файле [protoss/protoss-config.js](https://github.com/andrey-hohlov/protoss/blob/master/protoss-config.js) и рассчитана на следующую структуру проекта.

Создайте в корне проекта файл `protoss-config.js` с вашей конфигурацией и передайте его вторым параметром при [инициализации Protoss](Установка). Можно не создавать отдельный файл и разместить конфиг непосредственно в `gulpfile.js`.

Определите в конфиге только необходимые параметры, для остальных будут использованы значения по умолчанию.


### Шаблоны

```
templates: {
  src: './src/**/*.jade', // шаблоны
  filterFunc: false, // функция-фильтр, используемая при компиляции шаблонов. По умолчанию не компилируются файлы начинающиеся с `_` либо лежащие в папках, начинающихся с `_`. 
  inhBaseDir: './src/', // параметр для jade-inheritance, корневая директория для шаблонов
  dest: './build/', // папка для собранных HTML
  data: {}, // данные для передачи в шаблонизатор (переменные, функции)
  prettify: true, // "причесать" финальный HTML (только при production сборке)
  posthtml: false, // Плагины и опции для PostHTML
  hashes: {
        enabled: true, // добавлять ли хэши для подключаемых файлов (только при production сборке)
        build_dir: './', // https://www.npmjs.com/package/gulp-hash-src#options
        src_path: './'
      },
  w3c: {
    src: './build/*.html' // HTML файлы для тестирования валидности
  }
}
```


Можно указать, чтобы их всех файлов компилировались в HTML только те, что лежат в папке './src/pages': 

```
filterFunc: function (file) {
  return /src[\\\/]pages/.test(file.path);
}
```

Разместите в корневой директории проекта файл `.jsbeautifyrc` с настройкой форматирования финального HTML. [Пример настроек](https://github.com/andrey-hohlov/protoss/blob/master/demo/1-basic/.jsbeautifyrc)

### Стили

```
styles: {
  bundles: [ // css-бандлы, каждый с отдельными настройками
    {
    name: 'app', // название бандла
    src: ['./src/styles/app.scss'], // файл для компиляции
    dest: './build/static/css/', // папка для скомпилированного CSS
    watch: './src/styles/**/*.scss', // путь для вотчера изменений
    minify: true, // минифицировтаь ли финальный CSS
    hashes: true, // добавлять ли хэши для подключаемых файлов (только при production сборке)
    postcss: false // применяемые postcss-плагины
    }
  ]
}
```

`postcss` - массив объектов, содержащих информацию о применяемых postcss-плагинах. Плагины нужно устанавливать отдельно.

```
const easyImport = require('postcss-easy-import');
```
```
postcss: [
  {
    processor: easyImport,
    options: {}
  }
]
```

Разместите в корневой директории проекта файл `browserslist` с настройкой поддерживаемых браузеров для автопрефиксера. [Параметры](https://github.com/ai/browserslist)

Разместите в корневой директории проекта файл `.csscomb.json` с настройкой форматирования финального CSS, если не собираетесь минифицировать финальный файл. [Пример настроек](https://github.com/andrey-hohlov/protoss/blob/master/demo/1-basic/.csscomb.json)

### Скрипты

```
scripts: {
  bundles: [ // js-бандлы, каждый с отдельными настройками
    {
    name: 'app', // название бандла
    src: ['./src/styles/**/*.js'], // файл для компиляции
    dest: './build/static/js/', // папка для собранного JS
    watch: './src/scripts/**/*.scss', // путь для вотчера изменений
    concat: true, // объединить в один или скопировать как есть
    minify: true // минифицировтаь ли финальный JS
    }
  ],
  lint: {
    src: ['./src/scripts/**/*.js']
  }
}
```


### Изображения

```
images: {
  src: ['./src/resources/images/**/*.{png,jpg,gif,svg}'], // откуда копировать изображения
  dest: './build/images/', // и куда
  minPath: './build/images/' // путь для оптимизации изображений
}
```


### Png-спрайты

```
sprites: {
  enabled: true, // генерировать png-спрайты
  src: './src/sprites/png/', // папка с исходными иконками
  dest: './build/static/images/sprites/', // папка для сгенерированного спрайта
  retina: true, // генерировать спрайты для retina-экранов
  stylesName: '_sprites.scss', // имя генерируемого файла стилей
  stylesDest: './src/styles/_global/_sprites/', // папка для сгенерированного файла стилей
  spritePath: '#{$pathToImages}sprites/', // путь до спрайта в CSS
  template: __dirname + '/assets/sprite.mustache' // шаблон для генерации файла стилей
}
```

В папке с иконками необходимо создать отдельные папки для каждого набора иконок, например `src/sprites/png/ui` и `src/sprites/png/social`. 

Генерируется 1 файл стилей, содержащий переменные для всех иконок + миксим для использования этих иконок.

Для генерации спрайтов под retina-экраны подготовьте 2 версии ихображений - в обычном и 2x размерах, например: `icon.png(20x20)` и `icon@2x.png(40x40)`.


### Svg-спрайты

```
spritesSvg: {
  enabled: true, // генерировать svg-спрайты
  src: './src/sprites/svg/', // папка с исходными иконками
  dest: './build/static/images/sprites-svg/', // папка для сгенерированного спрайта
  stylesName: '_sprites-svg.scss', // имя генерируемого файла стилей
  stylesDest: './src/styles/_global/_sprites/', // папка для сгенерированного файла стилей
  spritePath: '#{$pathToImages}sprites-svg/', // путь до спрайта в CSS
  template: __dirname + '/assets/sprite-svg.mustache'б // шаблон для генерации файла стилей
  fallback: false // генерировать png-fallback спрайта
}
```

В папке с иконками необходимо создать отдельные папки для каждого набора иконок, например `src/sprites/svg/ui` и `src/sprites/svg/social`. 

Генерируется 1 файл стилей, содержащий переменные для всех иконок + миксим для использования этих иконок.


### Svg-иконки (svg symbols)

```
icons: {
  enabled: true, // генерировать наборы иконок
  src: './src/icons/', // папка с исходными иконками
  dest: './build/static/images/icons/' // папка для финального файла с иконками
}
```

В папке с иконками необходимо создать отдельные папки для каждого набора иконок, например `src/icons/ui` и `src/icons/social`. 
 
[Про подключение svg-иконок](https://css-tricks.com/svg-symbol-good-choice-icons/).


### Копирование

```
copy: [
  ['./src/resources/fonts/**/*', './build/fonts/'] // [откуда, куда]
]
```


### Удаление

```
del: [
  './build'
]
```


### Favicons

```
favicons: {
  enabled: true, // генерировать favicons
  src: './src/resources/favicon-master.png', // исходное изображение
  dest: './build/static/favicons/', / папка для сгенерированных изображений
  config: { // favicons конфигурация
    appName: 'Protoss',
    background: '#ffffff',
    path: '/static/favicons/',
    display: 'standalone',
    orientation: 'portrait',
    version: 2.0,
    logging: false,
    online: false,
    html: false,
    replace: true,
    icons: {
      favicons: true,
      android: true,
      appleIcon: true,
      windows: true,
      appleStartup: false,
      coast: false,
      firefox: false,
      opengraph: false,
      twitter: false,
      yandex: false
    }
  }
},
```

[Favicons](https://github.com/haydenbleasel/favicons)


### BrowserSync

Конфигурация [BrowserSync](https://www.browsersync.io/docs/options)

```
serve: {
  browsersync: { // Конфигурация BrowserSync
    open: true,
    port: 9001,
    server: {
      directory: true,
      baseDir: './build/'
    },
    reloadDelay: 200,
    logConnections: true,
    debugInfo: true,
    injectChanges: false,
    browser: 'default',
    startPath: '/',
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false
    }
  },
  watch: './build/' // Перезагружать браузер при изменении файлов
}
```
