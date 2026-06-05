import { showToast, validateForm, showLoader, hideLoader } from './utils.js';

const API_BASE = 'http://localhost:5000/api';

$(document).ready(function() {
    // Intercept mock login/register API
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (settings.url && settings.url.includes(`${API_BASE}/auth/`)) {
                return false; // Prevent actual network request
            }
        }
    });

    // ==========================================
    // LOGIN LOGIC
    // ==========================================
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();

        if (!validateForm('loginForm')) {
            return;
        }

        const email = $('#email').val() as string;
        const password = $('#password').val() as string;
        const $btn = $('#loginBtn');
        const $spinner = $('#loginSpinner');
        const $errorAlert = $('#loginError');

        $errorAlert.addClass('d-none').text('');
        $btn.prop('disabled', true);
        $spinner.removeClass('d-none');

        setTimeout(() => {
            $btn.prop('disabled', false);
            $spinner.addClass('d-none');

            if (email === 'admin@egar.com' && password === 'admin') {
                window.location.href = 'dashboard-admin.html';
            } else if (email === 'owner@egar.com' && password === 'owner') {
                window.location.href = 'dashboard-owner.html';
            } else if (email === 'tenant@egar.com' && password === 'tenant') {
                window.location.href = 'dashboard-tenant.html';
            } else {
                $errorAlert.removeClass('d-none').text('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
                showToast('خطأ في تسجيل الدخول', 'error');
            }
        }, 1000);
    });

    // ==========================================
    // REGISTRATION LOGIC (Multi-step form)
    // ==========================================
    const $registerForm = $('#registerForm');
    if ($registerForm.length) {
        const totalSteps = 4;
        let currentStep = 1;

        // Step Navigation
        $('.btn-next').on('click', function() {
            const nextStepId = $(this).data('next');
            const stepNum = parseInt(nextStepId.replace('step', ''));
            
            // Validate current step inputs before moving
            let isValid = true;
            $(`#step${currentStep} input[required]`).each(function() {
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

            // Special validation for step 1 (passwords match)
            if (currentStep === 1) {
                const p1 = $('#regPassword').val();
                const p2 = $('#regConfirmPassword').val();
                if (p1 !== p2) {
                    $('#regConfirmPassword').addClass('is-invalid');
                    showToast('كلمتا المرور غير متطابقتين', 'error');
                    return;
                }
            }

            goToStep(stepNum);
        });

        $('.btn-prev').on('click', function() {
            const prevStepId = $(this).data('prev');
            const stepNum = parseInt(prevStepId.replace('step', ''));
            goToStep(stepNum);
        });

        function goToStep(step) {
            $('.step-content').removeClass('active');
            $(`#step${step}`).addClass('active');
            
            currentStep = step;
            
            // Update Progress Bar
            const progressPct = ((step - 1) / (totalSteps - 1)) * 100;
            $('#formProgress').css('width', `${progressPct}%`);
            
            // Update Indicators
            $('.step-indicator').removeClass('bg-primary bg-accent text-white active').addClass('bg-light text-secondary');
            
            const role = $registerForm.data('role');
            const activeClass = role === 'owner' ? 'bg-primary text-white active' : 'bg-accent text-white active';

            for (let i = 1; i <= step; i++) {
                $(`#indicator-${i}`).removeClass('bg-light text-secondary').addClass(activeClass);
            }

            // If entering step 4, init camera
            if (step === 4) {
                // We do not auto-start camera to avoid prompt spam, user clicks "Start Camera"
            }
        }

        // --- File Previews ---
        function handleFilePreview(inputId: string, previewContainerId: string) {
            $(`#${inputId}`).on('change', function(e: any) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const $preview = $(`#${previewContainerId}`);
                        $preview.find('img').attr('src', e.target?.result as string);
                        $preview.removeClass('d-none');
                        // Hide the icon/text placeholder inside the dropzone to make it cleaner
                        $(`#${inputId}`).siblings('i, span, small').hide();
                    }
                    reader.readAsDataURL(file);
                }
            });
        }

        handleFilePreview('profilePhoto', 'profilePreview');
        handleFilePreview('idFront', 'idFrontPreview');
        handleFilePreview('idBack', 'idBackPreview');

        // --- Webcam Logic (Selfie) ---
        let stream: MediaStream | null = null;
        const video = document.getElementById('video-feed') as HTMLVideoElement;
        const canvas = document.getElementById('canvas-capture') as HTMLCanvasElement;
        const resultImg = document.getElementById('selfie-result') as HTMLImageElement;

        $('#btn-start-camera').on('click', async function() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                if (video) {
                    video.srcObject = stream;
                    $(video).removeClass('d-none');
                    $(resultImg).addClass('d-none');
                    
                    $('#btn-start-camera').addClass('d-none');
                    $('#btn-capture').removeClass('d-none');
                    $('#btn-retake').addClass('d-none');
                }
            } catch (err) {
                console.error(err);
                showToast('تعذر الوصول إلى الكاميرا. يرجى التحقق من الصلاحيات.', 'error');
            }
        });

        $('#btn-capture').on('click', function() {
            if (video && canvas) {
                const context = canvas.getContext('2d');
                if (context) {
                    // Draw video frame to canvas
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL('image/png');
                    
                    // Show result image, hide video
                    resultImg.src = dataUrl;
                    $(resultImg).removeClass('d-none');
                    $(video).addClass('d-none');
                    
                    $('#selfieData').val(dataUrl);

                    // Stop camera stream
                    if (stream) {
                        stream.getTracks().forEach(track => track.stop());
                    }

                    // Toggle buttons
                    $('#btn-capture').addClass('d-none');
                    $('#btn-retake').removeClass('d-none');
                }
            }
        });

        $('#btn-retake').on('click', function() {
            $('#selfieData').val('');
            $('#btn-start-camera').click();
        });

        // --- Final Submit ---
        $registerForm.on('submit', function(e) {
            e.preventDefault();

            // Validate selfie exists
            if (!$('#selfieData').val()) {
                showToast('يرجى التقاط صورة التحقق المباشر (Selfie)', 'error');
                return;
            }

            const role = $registerForm.data('role');
            const $btn = $('#submitRegBtn');
            const $spinner = $('#regSpinner');

            $btn.prop('disabled', true);
            $spinner.removeClass('d-none');
            showLoader();

            // Simulated AJAX POST to /api/auth/register
            setTimeout(() => {
                hideLoader();
                $btn.prop('disabled', false);
                $spinner.addClass('d-none');
                
                showToast('تم إرسال طلب التسجيل بنجاح! سيتم مراجعة بياناتك من قبل الإدارة.', 'success');
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);

            }, 2000);
        });
    }
});
