// --- Testimonial page Slider Functionality --- 
let currentSlide=0;
let slideInterval;
const slides=document.querySelectorAll('.testimonial-card');
const dotsContainer=document.getElementById('dots-container');

function createDots(){
    slides.forEach((_,index)=>{
        const dot=document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active-dot');
        dot.addEventListener('click',()=>{
         goToSlide(index);
        });
        dotsContainer.appendChild(dot);
    });
}
function goToSlide(n){
    slides[currentSlide].classList.remove('active');
    updateDots(n); 
    currentSlide = n;
    slides[currentSlide].classList.add('active');
    resetTimer(); 
}
function updateDots(nextIndex){
const dots=document.querySelectorAll('.dot');
dots[currentSlide].classList.remove('active-dot');
dots[nextIndex].classList.add('active-dot');
}
function moveSlide(direction){
    const nextIndex=(currentSlide+direction+slides.length)%slides.length;
    updateDots(nextIndex);
    slides[currentSlide].classList.remove('active');
    currentSlide=nextIndex;
    slides[currentSlide].classList.add('active');
}
function startAutoSlide(){
    slideInterval=setInterval(()=>{
        moveSlide(1);
    },3600);
}
function resetTimer() {
    clearInterval(slideInterval);
    startAutoSlide();
}

// --- Contact Page Form Validtion ---
const contactForm=document.getElementById('contactForm');
if(contactForm){
    contactForm.addEventListener('submit',(event)=>{
        event.preventDefault();
        document.querySelectorAll('.error-msg').forEach(msg=>msg.textContent='');
        const name=document.getElementById('name');
        const email=document.getElementById('email').value.trim();
        const message=document.getElementById('message');
        let isValid=true;
        if(name.length<3){
            document.getElementById('nameError').textContent='Name must be at least 3 characters long';
            isValid=false;
        }
        if (!email.includes('@')) {
            document.getElementById('emailError').innerText = "Please enter a valid email.";
            isValid = false;
        }

        if (message.length < 10) {
            document.getElementById('messageError').innerText = "Message is too short.";
            isValid = false;
        }
        if (isValid) {
            contactForm.classList.add('hidden'); // Hide form
            document.getElementById('formSuccess').classList.remove('hidden'); // Show message
            console.log("Form Data Collected:", { name, email, message });
            // Later in Step 3, we will send this data to Node.js!
        }
    });
}
// --- Mock logic for reservation page
const resForm=document.getElementById('reservationForm');
const resDateInput = document.getElementById('resDate');
if (resDateInput) {
    const today = new Date().toISOString().split('T')[0];
    resDateInput.setAttribute('min', today);
}
if(resForm){
    resForm.addEventListener('submit',(e)=>{
        e.preventDefault();

        const name = document.getElementById('resName').value;
        const date = document.getElementById('resDate').value;
        const time = document.getElementById('resTime').value;
        const guests = document.getElementById('resGuests').value;
        const messageBox = document.getElementById('resMessage');

        messageBox.classList.remove('hidden');
        messageBox.innerText = "Checking tables...";
     

        setTimeout(()=>{
            messageBox.innerHTML=`
                <div style="background: #4CAF50; color: white; padding: 15px; border-radius: 5px;">
                    Success! Table for ${guests} confirmed for ${name} on ${date} at ${time}.
                </div>`;
            resForm.classList.add('hidden');
        },1500);
    })
}
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
