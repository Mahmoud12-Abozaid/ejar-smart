import { showToast, validateForm } from './utils.js';

$(document).ready(function() {
    // 1. Initialize Swiper Slider
    // @ts-ignore
    const swiper = new Swiper('.mySwiper', {
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        }
    });

    // 2. Initialize Leaflet Map (Mock Location for Cairo)
    const map = L.map('map').setView([30.0444, 31.2357], 13); // Cairo coordinates

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([30.0444, 31.2357]).addTo(map)
        .bindPopup('موقع العقار التقريبي')
        .openPopup();

    // Fix map rendering issue when inside hidden tabs/modals (if applicable)
    setTimeout(() => {
        map.invalidateSize();
    }, 100);

    // 3. Mask/Unmask Phone Number
    $('#showPhoneBtn').on('click', function() {
        const $btn = $(this);
        const $phone = $('#ownerPhone');
        
        if ($btn.text() === 'إظهار') {
            // Mock fetching phone
            $phone.text('٠١٠١٢٣٤٥٦٧٨');
            $btn.text('إخفاء');
        } else {
            $phone.text('٠١٠xxxxxxx');
            $btn.text('إظهار');
        }
    });

    // 4. Handle Rental Form Submit
    $('#rentalForm').on('submit', function(e) {
        e.preventDefault();

        if (!validateForm('rentalForm')) {
            return;
        }

        const $btn = $('#submitRentalBtn');
        const $spinner = $('#rentalSpinner');
        
        $btn.prop('disabled', true);
        $spinner.removeClass('d-none');

        // Mock AJAX
        setTimeout(() => {
            $btn.prop('disabled', false);
            $spinner.addClass('d-none');
            
            // @ts-ignore
            $('#rentalModal').modal('hide');
            showToast('تم إرسال طلبك بنجاح. سيتم إشعارك عند رد المالك.', 'success');
            
        }, 1500);
    });

    // Set minimum date for startDate to today
    const today = new Date().toISOString().split('T')[0];
    $('#startDate').attr('min', today);
});
