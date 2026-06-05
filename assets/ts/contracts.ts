import { showToast, showLoader, hideLoader } from './utils.js';

const API_BASE = 'http://localhost:5000/api';

$(document).ready(function() {
    // 1. Signature Pad Logic
    const canvas = document.getElementById('signaturePad') as HTMLCanvasElement;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;
        let hasSignature = false;

        // Fix canvas resolution
        function resizeCanvas() {
            const ratio = Math.max(window.devicePixelRatio || 1, 1);
            // We use fixed 600x200 in HTML, let's scale it for retina
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            ctx?.scale(ratio, ratio);
            if (ctx) {
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
            }
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function draw(e: MouseEvent | TouchEvent) {
            if (!isDrawing || !ctx) return;
            e.preventDefault();

            let clientX, clientY;
            if ('touches' in e) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = (e as MouseEvent).clientX;
                clientY = (e as MouseEvent).clientY;
            }

            const rect = canvas.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;

            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();

            [lastX, lastY] = [x, y];
            hasSignature = true;
        }

        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            lastX = e.clientX - rect.left;
            lastY = e.clientY - rect.top;
        });
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mouseout', () => isDrawing = false);

        canvas.addEventListener('touchstart', (e) => {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            lastX = e.touches[0].clientX - rect.left;
            lastY = e.touches[0].clientY - rect.top;
        }, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', () => isDrawing = false);

        $('#clearSignature').on('click', () => {
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                hasSignature = false;
            }
        });

        // 2. Submit Signature
        $('#confirmSignature').on('click', function() {
            if (!hasSignature) {
                showToast('يرجى رسم توقيعك أولاً', 'error');
                return;
            }

            const dataUrl = canvas.toDataURL('image/png');
            const $btn = $(this);
            const $spinner = $('#signSpinner');

            $btn.prop('disabled', true);
            $spinner.removeClass('d-none');

            // Mock AJAX POST
            setTimeout(() => {
                $btn.prop('disabled', false);
                $spinner.addClass('d-none');
                
                // Update UI
                $('#signatureSection').slideUp();
                $('#successCard').removeClass('d-none').hide().slideDown();
                
                // Inject signature into contract
                $('#tenantSignaturePlaceholder').addClass('d-none');
                const $sigImg = $('#tenantSignatureImg');
                $sigImg.attr('src', dataUrl).removeClass('d-none');

                showToast('تم حفظ التوقيع وإتمام العقد بنجاح', 'success');

                // Hash generation simulation
                console.log('[MOCK] SHA-256 Hash generated for document: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');

            }, 1500);
        });
    }
});
