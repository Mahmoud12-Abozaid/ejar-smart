import { showToast, validateForm } from './utils.js';

$(document).ready(function() {
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

    // @ts-ignore
    const map = L.map('map').setView([30.0444, 31.2357], 13);

    // @ts-ignore
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // @ts-ignore
    L.marker([30.0444, 31.2357]).addTo(map)
        .bindPopup('موقع العقار التقريبي')
        .openPopup();

    setTimeout(() => {
        map.invalidateSize();
    }, 100);

    $('#showPhoneBtn').on('click', function() {
        const $btn = $(this);
        const $phone = $('#ownerPhone');
        
        if ($btn.text() === 'إظهار') {
            $phone.text('٠١٠١٢٣٤٥٦٧٨');
            $btn.text('إخفاء');
        } else {
            $phone.text('٠١٠xxxxxxx');
            $btn.text('إظهار');
        }
    });

    $('#rentalForm').on('submit', function(e) {
        e.preventDefault();

        if (!validateForm('rentalForm')) {
            return;
        }

        const $btn = $('#submitRentalBtn');
        const $spinner = $('#rentalSpinner');
        
        $btn.prop('disabled', true);
        $spinner.removeClass('d-none');

        setTimeout(() => {
            $btn.prop('disabled', false);
            $spinner.addClass('d-none');
            
            // @ts-ignore
            $('#rentalModal').modal('hide');
            showToast('تم إرسال طلبك بنجاح. سيتم إشعارك عند رد المالك.', 'success');
            
        }, 1500);
    });

    const today = new Date().toISOString().split('T')[0];
    $('#startDate').attr('min', today);
});
