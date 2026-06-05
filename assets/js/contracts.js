import { showToast } from './utils.js';

$(document).ready(function() {
    const canvas = document.getElementById('signaturePad');
    if (canvas) {
        // @ts-ignore
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;
        let hasSignature = false;

        function resizeCanvas() {
            const ratio = Math.max(window.devicePixelRatio || 1, 1);
            // @ts-ignore
            canvas.width = canvas.offsetWidth * ratio;
            // @ts-ignore
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

        function draw(e) {
            if (!isDrawing || !ctx) return;
            e.preventDefault();

            let clientX, clientY;
            if (e.touches) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            // @ts-ignore
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
            // @ts-ignore
            const rect = canvas.getBoundingClientRect();
            lastX = e.clientX - rect.left;
            lastY = e.clientY - rect.top;
        });
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mouseout', () => isDrawing = false);

        canvas.addEventListener('touchstart', (e) => {
            isDrawing = true;
            // @ts-ignore
            const rect = canvas.getBoundingClientRect();
            // @ts-ignore
            lastX = e.touches[0].clientX - rect.left;
            // @ts-ignore
            lastY = e.touches[0].clientY - rect.top;
        }, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', () => isDrawing = false);

        $('#clearSignature').on('click', () => {
            if (ctx) {
                // @ts-ignore
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                hasSignature = false;
            }
        });

        $('#confirmSignature').on('click', function() {
            if (!hasSignature) {
                showToast('يرجى رسم توقيعك أولاً', 'error');
                return;
            }

            // @ts-ignore
            const dataUrl = canvas.toDataURL('image/png');
            const $btn = $(this);
            const $spinner = $('#signSpinner');

            $btn.prop('disabled', true);
            $spinner.removeClass('d-none');

            setTimeout(() => {
                $btn.prop('disabled', false);
                $spinner.addClass('d-none');
                
                $('#signatureSection').slideUp();
                $('#successCard').removeClass('d-none').hide().slideDown();
                
                $('#tenantSignaturePlaceholder').addClass('d-none');
                const $sigImg = $('#tenantSignatureImg');
                $sigImg.attr('src', dataUrl).removeClass('d-none');

                showToast('تم حفظ التوقيع وإتمام العقد بنجاح', 'success');
            }, 1500);
        });
    }
});
