document.addEventListener('DOMContentLoaded', () => {
   // header
   const header = document.querySelector('.header');

   const callback = function (entries, observer){
       if(entries[0].isIntersecting){
           header.classList.remove('_scroll');
       }else{
           header.classList.add('_scroll');
       }
   }

   const headerObserver = new IntersectionObserver(callback);
   headerObserver.observe(header);
   // header links scroll
   const menuLinks = document.querySelectorAll('.header__link[data-goto]');
   if(menuLinks.length > 0){
        function onMenuLinkClick(e){
            const link = e.target;
            if(link.dataset.goto && document.querySelector(link.dataset.goto)){
                const gotoBlock = document.querySelector(link.dataset.goto);
                const gotoBlockValue = gotoBlock.getBoundingClientRect().top + scrollY - document.querySelector('.header__wrapper').offsetHeight;

                window.scrollTo({
                    top: gotoBlockValue,
                    behavior: 'smooth'
                });

                headerMenu.classList.remove("_active");
                burger.classList.remove("_active");
                document.body.classList.remove("_lock");
                e.preventDefault();
            }
        }

        menuLinks.forEach(link => {
            link.addEventListener('click', onMenuLinkClick);
        });
   }

   // form
   const input = document.querySelector('.hero__input');
   const scrollCont = document.querySelector('.hero__scroll');
   const searchItems = document.querySelector('.hero__items');
   const suggestItems = document.querySelector('.suggestions-hero__items');

   const pushItem = value => searchItems.insertAdjacentHTML('beforeend', `<div class="hero__item">${value}</div>`);

   const isItemNew = (currentItems, value) => {
        let isNew = true;
        currentItems.forEach(item => {
            if(item.textContent === value){
                isNew = false;
            }
        });
        return isNew;
    };

   input.addEventListener('keydown', (e) => {
      if(e.code === 'Enter'){
        e.preventDefault();

        const value = input.value.trim();
        const currentItems = document.querySelectorAll('.hero__item');
        if(value && isItemNew(currentItems,value)){
            pushItem(value);
            input.value = '';
            scrollCont.scrollLeft = searchItems.offsetWidth;
        }
      }
   });

    searchItems.addEventListener('click', (e) => {
        if(e.target.classList.contains('hero__item') || e.target.closest('.hero__item')){
            e.target.remove();
        }
    });

   suggestItems.addEventListener('click', (e) => {
        if(e.target.classList.contains('suggestions-hero__item') || e.target.closest('.suggestions-hero__item')){
            const currentItems = document.querySelectorAll('.hero__item');
            const value = e.target.dataset.value;
            if(value && isItemNew(currentItems,value)){
                pushItem(value);
                scrollCont.scrollLeft = searchItems.offsetWidth;
            }
        }
   });

   // hover item
   const hoverItems = document.querySelectorAll('.classes__item');
   const hoverDuration = 500;

   if(hoverItems){
        if(isMobile.any()){
            const itemBottoms = document.querySelectorAll('.classes__bottom');

            itemBottoms.forEach(item => {
                item.style.display = 'block';
            });
        }else{
            hoverItems.forEach(item => {
                let timePass = hoverDuration;
                let isCanHover = true;
                let interval;
                item.addEventListener('mouseenter', () => {
                    if(isCanHover){
                        isCanHover = false;
                        timePass = 0;
                        _slideDown(item.querySelector('.classes__bottom'), hoverDuration);
                        interval = clearInterval(interval);
                        interval = setInterval(() => {
                            if(timePass !== hoverDuration){
                                timePass += 1;
                            }
                        }, 1);
                    }
                });
                item.addEventListener('mouseleave', () => {
                    if(timePass === hoverDuration){
                        interval = clearInterval(interval);
                        _slideUp(item.querySelector('.classes__bottom'), hoverDuration);
                        timePass = 0;
                        setTimeout(() => {
                            isCanHover = true;
                        }, hoverDuration);
                    }else if(isCanHover === false && timePass !== 0 && !!interval){
                        interval = clearInterval(interval);
                        setTimeout(() => {
                            _slideUp(item.querySelector('.classes__bottom'), hoverDuration);
                            timePass = 0;
                            setTimeout(() => {
                                isCanHover = true;
                            }, hoverDuration);
                        }, hoverDuration - timePass);
                    }
                });
            });            
        }
   }

    // slider
    const sliderWebinar = document.querySelector('.webinar__slider');
    const webinarItems = document.querySelectorAll('.item-webinar');
    const pagination = document.querySelector('.webinar__pagination');

    for (let i = 0; i < webinarItems.length; i++) {
        pagination.insertAdjacentHTML('beforeend', `
            <div class="webinar__point" data-slide="${i}"></div>
        `);
    }
    setActivePoint();

    pagination.addEventListener('click', e => {
        if(!!e.target.dataset.slide){
            const activeItem = document.querySelector('.item-webinar._active');
            removeVideoClasses(activeItem);
            activeItem.removeEventListener('click', pauseVideo);
            pagination.querySelectorAll('.webinar__point').forEach(item => item.classList.remove('_active'));
            webinarItems.forEach(item => item.classList.remove('_active', '_next', '_prev'));
            e.target.classList.add('_active');
            webinarItems[e.target.dataset.slide].classList.add('_active');

            const item = webinarItems[e.target.dataset.slide];
            if(item.previousElementSibling){
                item.previousElementSibling.classList.add('_prev');
            }else{
                webinarItems[webinarItems.length - 1].classList.add('_prev');
            }
            if(item.nextElementSibling){
                item.nextElementSibling.classList.add('_next');
            }else{
                webinarItems[0].classList.add('_next');
            }
        }
    });

    function setActivePoint(){
        webinarItems.forEach((item,i) => {
            if(item.classList.contains('_active')){
                const points = pagination.querySelectorAll('.webinar__point');
                points.forEach(item => item.classList.remove('_active'));
                points[i].classList.add('_active');
            }
        });
    }

   function getFormatTime(time){
        const newTime = String(Math.round(time));
        const minutes = newTime.slice(0, -2) || 0;
        let seconds = newTime.slice(-2);
        if(seconds.length === 1){
            seconds = `0${seconds}`;
        }
        return `${minutes}:${seconds}`;
   }

   if(sliderWebinar){
    function playVideo(item){
        const video = item.querySelector('.item-webinar__video video');
        const title = item.querySelector('.item-webinar__title');
        const bottom = item.querySelector('.item-webinar__bottom');
        const playBtn = item.querySelector('.item-webinar__play');

        item.classList.add('play');
        title.classList.add('hide');
        bottom.classList.add('hide');
        playBtn.classList.add('hide');
        video.play();

        setTimeout(() => {
            item.addEventListener('click', pauseVideo);
        }, 0);
    }

    function removeVideoClasses(item, isNeedPause = true){
        const video = item.querySelector('.item-webinar__video video');
        const title = item.querySelector('.item-webinar__title');
        const bottom = item.querySelector('.item-webinar__bottom');
        const playBtn = item.querySelector('.item-webinar__play');

        item.classList.remove('play');
        title.classList.remove('hide');
        bottom.classList.remove('hide');
        playBtn.classList.remove('hide');
        if(isNeedPause) video.pause();
    }

    function pauseVideo(e){
        const item = e.target.closest('.item-webinar');
        removeVideoClasses(item);
        item.removeEventListener('click', pauseVideo);
    }

    
    webinarItems.forEach(item => {
        const slider = item.querySelector('.item-webinar__time-slider');
        const video = item.querySelector('.item-webinar__video video');
        video.addEventListener('loadeddata', () => {
            item.querySelector('.item-webinar__all-time').textContent = getFormatTime(video.duration);
            noUiSlider.create(slider, {
                start: 0,
                connect: 'lower',
                step: 1,
                range: {
                    'min': 0,
                    'max': Math.round(video.duration)
                }
            });
            slider.noUiSlider.on('change', (value) => {
                video.currentTime = Number(value[0]);
            });
            slider.noUiSlider.on('update', (value) => {
                if(video.duration === video.currentTime){
                    removeVideoClasses(item, false); 
                    item.removeEventListener('click', pauseVideo);
                }
            });
        })
        video.addEventListener('timeupdate', () => {
            item.querySelector('.item-webinar__current-time').textContent = getFormatTime(video.currentTime);
            slider.noUiSlider.set(Math.round(video.currentTime));
        });
        item.querySelector('.item-webinar__play').addEventListener('click', () => {
            if(Math.round(video.duration) === Math.round(video.currentTime)){
                video.currentTime = 0;
            }
            playVideo(item);
        });
        item.querySelector('.item-webinar__mute').addEventListener('click', () => {
            video.muted = !video.muted;
        });
        item.querySelector('.item-webinar__zoom').addEventListener('click', () => {
            item.classList.toggle('zoom');
            document.body.classList.toggle('_lock');
            document.querySelector('.webinar').classList.toggle('high');
        });
    });
   }

   // webinar slider
   webinarItems.forEach(item => {
        item.querySelector('.item-webinar__body').addEventListener('click', () => {
            if(!item.classList.contains('_active')){
                const activeItem = document.querySelector('.item-webinar._active');
                removeVideoClasses(activeItem);
                if(item.classList.contains('_prev')){
                    webinarItems.forEach(item => item.classList.remove('_active', '_next', '_prev'));
                    if(item.previousElementSibling){
                        item.previousElementSibling.classList.add('_prev');
                    }else{
                        webinarItems[webinarItems.length - 1].classList.add('_prev');
                    }
                    if(item.nextElementSibling){
                        item.nextElementSibling.classList.add('_next');
                    }else{
                        webinarItems[0].classList.add('_next');
                    }
                }else{
                    webinarItems.forEach(item => item.classList.remove('_active', '_next', '_prev'));
                    if(item.previousElementSibling){
                        item.previousElementSibling.classList.add('_prev');
                    }else{
                        webinarItems[webinarItems.length - 1].classList.add('_prev');
                    }
                    if(item.nextElementSibling){
                        item.nextElementSibling.classList.add('_next');
                    }else{
                        webinarItems[0].classList.add('_next');
                    }
                }
                item.classList.add('_active');
                setActivePoint();
            }
            
        });
    });

}); // end