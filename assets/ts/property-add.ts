import { showToast, validateForm, showLoader, hideLoader } from './utils.js';

$(document).ready(function() {
    const totalSteps = 5;
    let currentStep = 1;

    // Navigation
    $('.btn-next').on('click', function() {
        const nextStep = $(this).data('next');
        
        // Validate current step
        let isValid = true;
        $(`#step${currentStep} input[required], #step${currentStep} select[required]`).each(function() {
            if (!$(this).val()) {
                $(this).addClass('is-invalid');
                isValid = false;
            } else {
                $(this).removeClass('is-invalid');
            }
        });

        // Specific checks
        if (currentStep === 3) {
            // Photos step validation
            if ($('#photosPreviewGrid').children().length === 0) {
                showToast('يرجى رفع صورة واحدة على الأقل', 'error');
                isValid = false;
            }
        }

        if (!isValid) {
            if (currentStep !== 3) showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }

        goToStep(nextStep);
    });

    $('.btn-prev').on('click', function() {
        goToStep($(this).data('prev'));
    });

    function goToStep(step: number) {
        $('.step-content').removeClass('active');
        $(`#step${step}`).addClass('active');
        
        currentStep = step;
        
        const progressPct = (step / totalSteps) * 100;
        $('#addPropProgress').css('width', `${progressPct}%`);
        
        $('.step-indicator').removeClass('bg-primary text-white active').addClass('bg-light text-secondary');
        for (let i = 1; i <= step; i++) {
            $(`#ind-${i}`).removeClass('bg-light text-secondary').addClass('bg-primary text-white active');
        }
    }

    // Handle Multiple Photo Upload & Preview
    $('#photosInput').on('change', function(e: any) {
        const files = e.target.files;
        const $grid = $('#photosPreviewGrid');
        
        // Append new images
        Array.from(files).forEach((file: any) => {
            const reader = new FileReader();
            reader.onload = function(ev) {
                const html = `
                    <div class="col-4 col-md-3">
                        <div class="photo-preview-item border">
                            <img src="${ev.target?.result}" alt="Preview">
                            <button type="button" class="remove-btn" onclick="this.parentElement.parentElement.remove()"><i class="bi bi-x"></i></button>
                        </div>
                    </div>
                `;
                $grid.append(html);
            }
            reader.readAsDataURL(file);
        });

        // Reset input so same file can be selected again if needed
        $(this).val('');
        
        // Hide initial text if photos exist
        if ($grid.children().length > 0) {
            $('#photoDropzone span').text('إضافة المزيد من الصور');
        }
    });

    // Handle Video Upload Progress Simulation
    $('#videoInput').on('change', function(e: any) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 100 * 1024 * 1024) {
                showToast('حجم الفيديو يتجاوز ١٠٠ ميجابايت', 'error');
                $(this).val('');
                return;
            }

            $('#videoProgressContainer').removeClass('d-none');
            const $bar = $('#videoProgressBar');
            const $text = $('#videoUploadText');
            
            let progress = 0;
            $bar.css('width', '0%');
            $text.text('جاري الرفع... 0%');

            const interval = setInterval(() => {
                progress += Math.floor(Math.random() * 20) + 10;
                if (progress > 100) progress = 100;
                
                $bar.css('width', `${progress}%`);
                $text.text(`جاري الرفع... ${progress}%`);

                if (progress === 100) {
                    clearInterval(interval);
                    $bar.removeClass('progress-bar-animated bg-primary').addClass('bg-success');
                    $text.text('تم رفع الفيديو بنجاح!');
                }
            }, 500);
        }
    });

    // Final Submit
    $('#addPropertyForm').on('submit', function(e) {
        e.preventDefault();

        // Validate final step
        let isValid = true;
        $(`#step5 input[required], #step5 select[required]`).each(function() {
            if (!$(this).val()) {
                $(this).addClass('is-invalid');
                isValid = false;
            } else {
                $(this).removeClass('is-invalid');
            }
        });

        if (!isValid) {
            showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }

        const $btn = $('#submitPropBtn');
        const $spinner = $('#propSpinner');
        
        $btn.prop('disabled', true);
        $spinner.removeClass('d-none');
        showLoader();

        // Mock API POST
        setTimeout(() => {
            hideLoader();
            $btn.prop('disabled', false);
            $spinner.addClass('d-none');
            
            showToast('تم حفظ العقار بنجاح. سيتم مراجعته من قبل الإدارة.', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard-owner.html';
            }, 1500);

        }, 1500);
    });
});
