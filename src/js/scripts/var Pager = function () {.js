var Pager = function () {
    function Pager(opts) {
        _classCallCheck(this, Pager);
        // Опции по умолчанию
        this.options = {
            sel: '.js-pager',
            // селектор
            sectionWrapSel: '.js-pager-sections',
            // родитель секций
            sectionsSel: '.js-pager-sections-item',
            // селектор секций
            videoWrapSel: '.js-intro-video',
            // родитель видео
            videosSel: '.js-intro-video-item',
            // селектор видео
            //navSel: '.js-pager-nav', // селектор навигации
            activePoint: 1,
            // активная секция
            sectionTransitionDuration: 0.9,
            // продолжительность анимации секций (в секундах)
            sectionEasing: 'cubic-bezier(0.23, 1, 0.32, 1)',
            // easing функция анимации секций
            // классы
            navCls: 'pager-nav',
            activeCls: 'is-active'
        };
        // Мержим опции
        if (isObject(opts)) {
            this.options = mergeObjects(this.options, opts);
        }
        this._init();
    }
    /* Инициалиция настроек объекта */
    _createClass(Pager, [{
        key: '_init',
        value: function _init() {
            this._pager = typeof this.options.sel === 'string' ? document.querySelector(this.options.sel) : this.options.sel;
            if (this._pager === null) {
                throw new Error('\u0421\u0435\u043B\u0435\u043A\u0442\u043E\u0440 ' + this.options.sel + ' \u043D\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442');
            }
            this._activeSection = this.options.activePoint;
            this._sectionWrap = document.querySelector(this.options.sectionWrapSel);
            this._sections = document.querySelectorAll(this.options.sectionsSel);
            this._sectionsLength = this._sections.length;
            this._videoWrap = document.querySelector(this.options.videoWrapSel);
            this._videos = document.querySelectorAll(this.options.videosSel);
            this._isMoving = false;
            this._build();
            this._bindEvents();
            
        }/* Привязка событий */
    }, {
        key: '_bindEvents',
        value: function _bindEvents() {
            var _this = this;
            this._pager.addEventListener('click', function (e) {
                var dataset = e.target.dataset;
                if (!dataset.sectionIndex) {
                    return;
                }
                _this.changeSection(Number(dataset.sectionIndex));
            });
            this._pager.addEventListener('wheel', function (e) {
                if (_this._isMoving) {
                    return;
                }
                var delta = Math.sign(e.deltaY);
                _this.changeSection(e.deltaY < 0 ? _this._activeSection - 1 : _this._activeSection + 1);
            });
            
            new Hammer(this._pager).on('swipe', function (e) {
                if (window.matchMedia('(max-width: 1359px)').matches) {
                    if (e.direction === 2) {
                        _this.changeSection(_this._activeSection + 1);
                    }
                    if (e.direction === 4) {
                        _this.changeSection(_this._activeSection - 1);
                    }
                }
            });
        }/* Меняем слайд */
    }, {
        key: 'changeSection',
        value: function changeSection(index) {
            var _this2 = this;
            if (index > this._sectionsLength) {
                index = this._sectionsLength;
            } else if (index < 1) {
                index = 1;
            }
            this._isMoving = true;
            this._activeSection = index;
            // Изменяем активный пункт у навигации
            this._nav.querySelector('.' + this.options.activeCls).classList.remove(this.options.activeCls);
            this._nav.children[this._activeSection - 1].querySelector('.pager-nav__btn').classList.add(this.options.activeCls);
            // Изменяем активный пункт у секции
            this._sectionWrap.querySelector('.' + this.options.activeCls).classList.remove(this.options.activeCls);
            this._sections[this._activeSection - 1].classList.add(this.options.activeCls);
            // Меняем активное видео
            [].concat(_toConsumableArray(this._videos)).forEach(function (item) {
                item.classList.remove(_this2.options.activeCls);
            });
            this._videos[this._activeSection - 1].classList.add(this.options.activeCls);
            this._videos[this._activeSection - 1].play();
            var unactiveVideos = this._videoWrap.querySelectorAll(this.options.videosSel + ':not(.' + this.options.activeCls + ')');
            setTimeout(function () {
                [].concat(_toConsumableArray(unactiveVideos)).forEach(function (item) {
                    item.pause();
                    item.currentTime = 0;
                });
                _this2._isMoving = false;
            }, this.options.sectionTransitionDuration * 1000);
        }/* Добавляем элементы плагина в DOM */
    }, {
        key: '_build',
        value: function _build() {
            var _this3 = this;
            // Строим пагинатор
            var pagerNav = document.createElement('ul');
            var fragment = document.createDocumentFragment();
            pagerNav.classList.add(this.options.navCls, 'js-pager-nav');
            var i = 1;
            while (i <= this._sectionsLength) {
                var pagerNavItem = document.createElement('li');
                var pagerNavBtn = document.createElement('button');
                pagerNavItem.classList.add(this.options.navCls + '__item');
                pagerNavBtn.classList.add(this.options.navCls + '__btn');
                pagerNavBtn.type = 'button';
                pagerNavBtn.dataset.sectionIndex = i;
                if (i === this._activeSection) {
                    pagerNavBtn.classList.add(this.options.activeCls);
                }
                pagerNavItem.appendChild(pagerNavBtn);
                fragment.appendChild(pagerNavItem);
                i += 1;
            }
            pagerNav.appendChild(fragment);
            this._pager.appendChild(pagerNav);
            // Воспроизводим видео
            this._videos[this._activeSection - 1].classList.add(this.options.activeCls);
            this._videos[this._activeSection - 1].play();
            this._nav = document.querySelector('.js-pager-nav');
            [].concat(_toConsumableArray(this._sections)).forEach(function (item) {
                item.style.cssText = 'transition-duration: ' + _this3.options.sectionTransitionDuration + 's; transition-timing-function: ' + _this3.options.sectionEasing + ';';
            });
        }
    }]);
    return Pager;
}();


/* Хелперы */
function isObject(val) {
    if (val === null) {
        return;
    }
    return (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object';
}

function mergeObjects() {
    var resObj = {};
    for (var i = 0; i < arguments.length; i += 1) {
        var obj = arguments[i]
            , keys = Object.keys(obj);
        for (var j = 0; j < keys.length; j += 1) {
            resObj[keys[j]] = obj[keys[j]];
        }
    }
    return resObj;
}

// Объект с логикой переключений главной страницы
if ($('.js-pager').length) {
    var pager = new Pager();
}