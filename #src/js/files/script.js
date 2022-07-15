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
                    if(timePass === hoverDuration){
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
                    }else if(isCanHover){
                        interval = clearInterval(interval);
                        isCanHover = false;
                        setTimeout(() => {
                            _slideUp(item.querySelector('.classes__bottom'), hoverDuration);
                            timePass = 0;
                            setTimeout(() => {
                                timePass = hoverDuration;
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

    function pauseVideo(e){
        const item = e.target.closest('.item-webinar');
        const video = item.querySelector('.item-webinar__video video');
        const title = item.querySelector('.item-webinar__title');
        const bottom = item.querySelector('.item-webinar__bottom');
        const playBtn = item.querySelector('.item-webinar__play');

        item.classList.remove('play');
        title.classList.remove('hide');
        bottom.classList.remove('hide');
        playBtn.classList.remove('hide');
        video.pause();
        item.removeEventListener('click', pauseVideo);
    }

    document.querySelectorAll('.item-webinar').forEach(item => {
        const video = item.querySelector('.item-webinar__video video');
        video.addEventListener('loadeddata', () => {
            item.querySelector('.item-webinar__all-time').textContent = getFormatTime(video.duration);
        })
        video.addEventListener('timeupdate', () => {
            item.querySelector('.item-webinar__current-time').textContent = getFormatTime(video.currentTime);
        });
        item.querySelector('.item-webinar__play').addEventListener('click', () => {
            playVideo(item);
        });
        item.querySelector('.item-webinar__zoom').addEventListener('click', () => {
            item.classList.toggle('zoom');
            document.body.classList.toggle('_lock');
            document.querySelector('.webinar').classList.toggle('high');
        });
    });

   }

}); // end