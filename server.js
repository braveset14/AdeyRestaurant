// --- Header and Footer Feature 
let topBtn= document.getElementById('backToTop');
document.addEventListener('DOMContentLoaded',()=>{
    
    if (topBtn) {
        topBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    if(slides.length>0){
        createDots();
        startAutoSlide();
    }
});

window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    // If we scroll more than 50px, add a 'scrolled' class
    if (header && window.scrollY > 50) {
        header.classList.add('header-scrolled');
    } else if (header) {
        header.classList.remove('header-scrolled');
    }
    // Re-query the button in case it wasn't found initially
    if (!topBtn) {
        topBtn = document.getElementById('backToTop');
    }
    if (topBtn) {
        if (window.scrollY > 100) {
            topBtn.classList.remove('hidden');
        } else {
            topBtn.classList.add('hidden');
        }
    }
});