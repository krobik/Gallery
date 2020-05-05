class Gallery {
    constructor(opts) {
        this.photos = opts.photos
        this.size = opts.size
        this.current = opts.current
        this.container = opts.container
        this.options = {
            sel: '.js-gallery',
            firstClass: 'gallery',
            wrapper: 'gallery__wrapper',
            navCls: 'gallery-nav',
            navItem: 'gallery-nav__item',
            navImgName: 'gallery-nav__img',
            navBtnClass: 'gallery-nav__btn',
            navBtnNext: 'gallery-nav__next',
            nanBtnPrev: 'gallery-nav__prev',
            keyCode: {
                left: 37,
                right: 39
            },
            noPhoto: 'assets/img/no-photo.png',
            activeCls: 'is-active',
            magicNum: 2
        }
        this._createStructure()
        this._bindEvents()
        this._changeWidth('firstLoad')

    }

    _createStructure() {
        var _this = this

        this.galleryNav = document.createElement('div')
        let galleryWrapper = document.createElement('div')
        let fragment = document.createDocumentFragment()
        let btnPrev = document.createElement('button')
        let btnNext = document.createElement('button')

        this.galleryNav.classList.add(`${_this.options.navCls}`)
        galleryWrapper.classList.add(`${_this.options.wrapper}`)
        btnNext.classList.add(`${_this.options.navCls}__btn`, `${_this.options.navCls}__next`)
        btnPrev.classList.add(`${_this.options.navCls}__btn`, `${_this.options.navCls}__prev`)
        btnNext.append('>')
        btnPrev.append('<')

        let i = 0
        while (i <= (photos.length - 1)) {
            let galleryNavItem = document.createElement('div')
            let galleryNavImg = document.createElement('img')

            galleryNavItem.classList.add(`${_this.options.navItem}`)
            galleryNavImg.classList.add(`${_this.options.navImgName}`)
            galleryNavImg.src = this.photos[i] ? `${this.photos[i].src}` : `${_this.options.noPhoto}`
            if (this.photos[i].sizes) {
                let srcSetImages = ' '
                this.photos[i].sizes.map(item => {
                    srcSetImages = `${srcSetImages}, ${item.src} ${item.density}`
                    galleryNavImg.srcset = `${srcSetImages}`
                })
            }

            if (i === this.current) {
                galleryNavItem.classList.add(`${this.options.activeCls}`)
                galleryNavItem.tabIndex = 0
            } else {
                galleryNavItem.tabIndex = -1
            }

            galleryNavItem.append(galleryNavImg)
            fragment.append(galleryNavItem)
            i += 1
        }

        galleryWrapper.append(this.galleryNav)
        this.galleryNav.append(fragment)
        this.container.append(galleryWrapper)
        galleryWrapper.before(btnPrev)
        galleryWrapper.after(btnNext)
    }

    _bindEvents() {
        var _this = this

        this.container.querySelectorAll(`.${this.options.navItem}`).forEach(item => item.addEventListener('click', (event) => {
            this.clickOnItem(event, _this)
            this.setPosition(item.getAttribute('data-position'))
        }))

        this.container.addEventListener('keydown', (event) => {
            this.keyFunc(event, _this)
        })

        window.addEventListener('resize', () => {
            this._changeWidth()
        })

        this.container.querySelectorAll(`.${this.options.navBtnClass}`).forEach(item => item.addEventListener('click', (event) => {
            if (event.target.classList.contains(`${this.options.navBtnNext}`)) {
                this.btnNext(_this)
            } else if (event.target.classList.contains(`${this.options.nanBtnPrev}`)) {
                this.btnPrev(_this)
            }
        }))
    }

    _changeWidth(load) {
        if (load === 'firstLoad') {
            window.onload = () => {
                this.setWidth()
            }
        } else {
            this.setWidth()
        }
    }

    activate(item) {
        item.closest(`.${this.options.navCls}`).querySelectorAll(`.${this.options.navItem}`).forEach(elem => {
            elem.tabIndex = -1
            elem.classList.remove(`${this.options.activeCls}`)
        })

        item.tabIndex = 0
        item.focus()
        item.classList.add(`${this.options.activeCls}`)
    }

    clickOnItem(event, _this) {
        let button = event.target.closest(`.${this.options.navItem}`)

        if (button.tabIndex == 0) {
            return
        }

        _this.activate(button)
    }

    focusNextItem(_this) {
        const item = document.activeElement

        if (item.nextElementSibling) {
            _this.activate(item.nextElementSibling)

            this.setPosition(item.nextElementSibling.getAttribute('data-position'))
        }
    }

    focusPreviousItem(_this) {
        const item = document.activeElement

        if (item.previousElementSibling) {
            _this.activate(item.previousElementSibling)

            this.setPosition(item.previousElementSibling.getAttribute('data-position'))
        }
    }

    keyFunc(event, _this) {
        switch (event.keyCode) {
            case _this.options.keyCode.right:
                this.focusNextItem(_this)
                break
            case _this.options.keyCode.left:
                this.focusPreviousItem(_this)
                break
        }
    }

    btnNext(_this) {
        let elems = document.querySelectorAll(`.${this.options.navItem}`)
        let activeElem = [...elems].find(elem => elem.tabIndex === 0)

        if (activeElem.nextElementSibling) {
            _this.activate(activeElem.nextElementSibling)
            this.setPosition(activeElem.nextElementSibling.getAttribute('data-position'))
        }
    }

    btnPrev(_this) {
        let elems = document.querySelectorAll(`.${this.options.navItem}`)
        let activeElem = [...elems].find(elem => elem.tabIndex === 0)

        if (activeElem.previousElementSibling) {
            _this.activate(activeElem.previousElementSibling)
            this.setPosition(activeElem.previousElementSibling.getAttribute('data-position'))
        }
    }

    setPosition(left) {
        let galleryNav = this.container.querySelector(`.${this.options.navCls}`)
        galleryNav.style.left = `${left}px`
    }

    setWidth() {
        let galleryWrapperWidth = this.container.querySelector(`.${this.options.wrapper}`).offsetWidth
        let galleryNav = this.container.querySelector(`.${this.options.navCls}`)
        let slides = this.container.querySelectorAll(`.${this.options.navItem}`)

        //Ширина элемента = ширина окна / на количество видимых слайдов
        let widthElem = parseInt(galleryWrapperWidth / this.size)
        slides.forEach(item => item.style.width = `${widthElem}px`)

        //Ширина контейнера = ширина блоков умноженная на кол-во фоток в массиве
        galleryNav.style.width = `${widthElem * this.photos.length}px`

        //Установка отступа
        this._indentationСalc()
    }

    _indentationСalc() {
        let galleryWrapperWidth = this.container.querySelector(`.${this.options.wrapper}`).offsetWidth
        let galleryNavWidth = this.container.querySelector(`.${this.options.navCls}`).offsetWidth
        let widthElem = parseInt(galleryWrapperWidth / this.size)
        let galleryNavItem = this.container.querySelectorAll(`.${this.options.navItem}`)

        // Отнимаем от кол-ва слайдов число для центровки
        let count = galleryNavItem.length - this.options.magicNum

        for (let i = 0; i < galleryNavItem.length; i++) {
            if (i === 0) {
                galleryNavItem[i].setAttribute('data-position', 0)
            } else if (i === (galleryNavItem.length - 1)) {
                galleryNavItem[i].setAttribute('data-position', -(galleryNavWidth - (this.size * widthElem)))
            }
            else {
                galleryNavItem[i].setAttribute('data-position', galleryNavWidth - (++count * widthElem))
            }
        }

        this._setPosActiveElement(this.current)
    }

    _setPosActiveElement(current) {
        let galleryNavItem = this.container.querySelectorAll(`.${this.options.navItem}`)

        galleryNavItem.forEach((item, i) => {
            if (i === current) {
                this.setPosition(item.getAttribute('data-position'))
            }
        })
    }
}








const photos = [
    {
        id: '0',
        src: 'assets/img/0.w_1920.jpg',
        sizes: [
            {
                src: 'assets/img/0.w_480.jpg',
                density: '480w'
            },
            {
                src: 'assets/img/0.w_978.jpg',
                density: '978w'
            },
            {
                src: 'assets/img/0.w_1340.jpg',
                density: '1340w'
            },
            {
                src: 'assets/img/0.w_1648.jpg',
                density: '1648w'
            },
            {
                src: 'assets/img/0.w_1920.jpg',
                density: '1920w'
            },
        ]
    },
    {
        id: '1',
        src: 'assets/img/1.jpg',
    },
    {
        id: '2',
        src: 'assets/img/2.jpg',
    },
    {
        id: '3',
        src: 'assets/img/3.jpg',
    },
    {
        id: '4',
        src: 'assets/img/4.jpg',
    },
    {
        id: '5',
        src: 'assets/img/5.jpg',
    },
    {
        id: '6',
        src: 'assets/img/6.jpg',
    },
    {
        id: '7',
        src: 'assets/img/7.jpg',
    },
    /* {
        id: '8',
        src: 'assets/img/8.jpg',
    }, */
]

let gallery = new Gallery({
    photos,
    size: 5,
    current: 2,
    container: document.querySelector('#gallery'),
})