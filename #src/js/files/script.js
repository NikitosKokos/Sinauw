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
                let isCanHover = hoverDuration;
                let interval;
                item.addEventListener('mouseenter', () => {
                    if(isCanHover === hoverDuration){
                        isCanHover = 0;
                        _slideDown(item.querySelector('.classes__bottom'), hoverDuration);
                        clearInterval(interval);
                        interval = setInterval(() => {
                            if(isCanHover !== hoverDuration){
                                isCanHover += 100;
                            }
                        }, 100);
                    }
                });
                item.addEventListener('mouseleave', () => {
                    if(isCanHover === hoverDuration){
                        _slideUp(item.querySelector('.classes__bottom'), hoverDuration);                       
                    }else if(interval){
                        clearInterval(interval);
                        isCanHover = 0;
                        setTimeout(() => {
                            _slideUp(item.querySelector('.classes__bottom'), hoverDuration);
                            setTimeout(() => {
                                isCanHover = hoverDuration;
                            }, hoverDuration);
                        }, hoverDuration - isCanHover);
                    }
                });
            });            
        }
   }

}); // end