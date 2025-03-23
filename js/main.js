// ******************************************************************************************
// Data *************************************************************************************

const topBar = document.querySelector('#top-bar');
const exteriorColorSection = document.querySelector('#exterior-buttons');
const interiorColorSection = document.querySelector('#interior-buttons');
const exteriorImage = document.querySelector('#exterior-image');
const interiorImage = document.querySelector('#interior-image');
const wheelButtonsSection = document.querySelector('#wheel-buttons');
const performanceBtn = document.querySelector('#performance-btn');
const totalPriceElement = document.querySelector('#total-price');
const fullSelfDrivingCheckbox = document.querySelector('#full-self-driving-checkbox');
const accessoryCheckboxes = document.querySelectorAll('.accessory-form-checkbox');
const downPaymentElement = document.querySelector('#down-payment');
const monthlyPaymentElement = document.querySelector('#monthly-payment');


const basePrice = 52490;
let currentPrice = basePrice;

let selectedColor = 'Stealth Grey';

const selectedOptions = {
    'Performance Wheels' : false,
    'Performance Package' : false,
    'Full Self-Driving' : false
};

const pricing =  {
    'Performance Wheels' : 2500,
    'Performance Package' : 5000,
    'Full Self-Driving' : 8500,
    'Accessories' : {
        'Center Console Trays' : 35,
        'Sunshade' : 105,
        'All-Weather Interior Liners' : 225,
    }
}

// Image Mapping 
const exteriorImages = {
    'Stealth Grey' : './images/model-y-stealth-grey.jpg',
    'Pearl White' : './images/model-y-pearl-white.jpg',
    'Deep Blue' : './images/model-y-deep-blue-metallic.jpg',
    'Solid Black' : './images/model-y-solid-black.jpg',
    'Ultra Red' : './images/model-y-ultra-red.jpg',
    'Quicksilver' : './images/model-y-quicksilver.jpg',
}

const interiorImages = {
    'Dark' : './images/model-y-interior-dark.jpg',
    'Light' : './images/model-y-interior-light.jpg',
}




// ******************************************************************************************
// Functions ********************************************************************************

// Update Total Price in the UI
const updateTotalPrice = () => {
    // Reset the current price to base price
    currentPrice = basePrice;

    // Performance Wheel Options
    if (selectedOptions['Performance Wheels']) { 
        currentPrice += pricing['Performance Wheels'];
    }
    
    // Performance Package Optio
    if (selectedOptions['Performance Package']) { 
        currentPrice += pricing['Performance Package'];
    }

    // Full Self Driving Options
    if (selectedOptions['Full Self-Driving']) { 
        currentPrice += pricing['Full Self-Driving'];
    }

    // Accessory Checkboxes
    accessoryCheckboxes.forEach((checkbox) => {
        //Extract the accessory Label
        const accessoryLabel = checkbox.closest('label').querySelector('span').textContent.trim();
        const acessoryPrice = pricing['Accessories'][accessoryLabel];

        // Add to current price if the accessory is selected
        if (checkbox.checked) {
            currentPrice += acessoryPrice;
        }

    })

    // update the total price in UI
    totalPriceElement.textContent = `$${currentPrice.toLocaleString()}`;

    updatePaymentBreakdown();

}

// Update payment breakdown based on current price
const updatePaymentBreakdown = () => {
    // Calculate the down payment
    const downpayment = currentPrice*0.1;
    downPaymentElement.textContent = `$${downpayment.toLocaleString()}`;

    // Calculate loan details assuming 60 months loan and 3 % interest rate
    const loanTermMonth = 60;
    const interestRate = 0.03;

    const loanAmount = currentPrice - downpayment;

    // Monthly Payment formula : P * (r(1+r)^n)) / ((1+r)^n -1)
    const monthlyInterestRate = interestRate/12;
    const monthlyPayment = (loanAmount*(monthlyInterestRate *  Math.pow(1 + monthlyInterestRate, loanTermMonth)))/(Math.pow(1 +monthlyInterestRate, loanTermMonth) -1);
    monthlyPaymentElement.textContent = `$${monthlyPayment.toFixed(2).toLocaleString()}`;
 
}


// Handle Top Bar On Scroll
const handleScroll = () => {
    const atTop = window.scrollY === 0;
    topBar.classList.toggle('visible-bar', atTop);
    topBar.classList.toggle('hidden-bar', !atTop);
}

// Handle Color Selection
const handleColorButtonClick = (e) => {
    let button;
    if(e.target.tagName === 'IMG') {
        button = e.target.closest('button')
    }else if (e.target.tagName === 'BUTTON') {
        button = e.target;
    };
    if (button) {
        const buttons = e.currentTarget.querySelectorAll('button');
        buttons.forEach((btn) => btn.classList.remove('btn-selected'));
        button.classList.add('btn-selected');

        // change exterior image 
        if ( e.currentTarget === exteriorColorSection) {
            selectedColor = button.querySelector('img').alt;
            updateExteriorImage();

        }

        // change interior image
        if ( e.currentTarget === interiorColorSection) {
            const color = button.querySelector('img').alt;
            interiorImage.src = interiorImages[color];

        }
    }
}


// Updtae exterior Image based on color ad wheels
const updateExteriorImage = () => { 
    const performanceSuffix = selectedOptions['Performance Wheels'] ? '-performance' : '';
     const colorKey = selectedColor in exteriorImages ? selectedColor : 'Stealth Grey';
     exteriorImage.src = exteriorImages[colorKey].replace('.jpg', `${performanceSuffix}.jpg`);
}

//Wheel Selection
const handleWheelButtonClick = (e) => {
    if (e.target.tagName === 'BUTTON') {
        const buttons = document.querySelectorAll('#wheel-buttons button');
        buttons.forEach((btn) => {
            btn.classList.remove('bg-gray-700', 'text-white')
        });

        // Add selected styles to clicked button
        e.target.classList.add('bg-gray-700', 'text-white');
     
        selectedOptions['Performance Wheels'] = e.target.textContent.includes('Performance');

        updateExteriorImage();

        updateTotalPrice();

    }
}

// Performance Package Selection
const handlePerformanceButtonClick = () => {
    const isSelected = performanceBtn.classList.toggle('bg-gray-700');
    performanceBtn.classList.toggle('text-white');

    // Update Selected Options
    selectedOptions['Performance Package'] = isSelected;

    updateTotalPrice();
}

// Full Self Driving Selection
const fullSelfDrivingChange = () => {
    const isSelectedbis = fullSelfDrivingCheckbox.checked;
    selectedOptions['Full Self-Driving'] = isSelectedbis;
    updateTotalPrice ();
}

// HAndle Accessory Checkbox Listeners
accessoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => updateTotalPrice());
})

// Initial update price
updateTotalPrice();


// *****************************************************************************
// Event Listeners *************************************************************

window.addEventListener('scroll', () => {
    requestAnimationFrame(handleScroll)
})
exteriorColorSection.addEventListener('click', handleColorButtonClick);
interiorColorSection.addEventListener('click', handleColorButtonClick);
wheelButtonsSection.addEventListener('click', handleWheelButtonClick);
performanceBtn.addEventListener('click', handlePerformanceButtonClick);
fullSelfDrivingCheckbox.addEventListener('change', fullSelfDrivingChange);