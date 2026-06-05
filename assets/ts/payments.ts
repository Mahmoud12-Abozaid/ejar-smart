import { validateForm } from './utils.js';

$(document).ready(function() {
    
    // 1. Initialize input masks
    // @ts-ignore
    $('#cardNumber').mask('0000 0000 0000 0000');
    // @ts-ignore
    $('#cardExpiry').mask('00/00');
    // @ts-ignore
    $('#cardCvv').mask('000');

    // 2. Handle Payment Submission
    $('#paymentForm').on('submit', function(e) {
        e.preventDefault();

        if (!validateForm('paymentForm')) {
            return;
        }

        const $btn = $('#submitPaymentBtn');
        const $spinner = $('#paymentSpinner');
        const $formBody = $('#paymentForm .modal-body, #paymentForm .modal-footer');
        const $successState = $('#paymentSuccessState');

        $btn.prop('disabled', true);
        $spinner.removeClass('d-none');

        // Simulate AJAX Request
        setTimeout(() => {
            $btn.prop('disabled', false);
            $spinner.addClass('d-none');
            
            // Hide form, show success checkmark
            $formBody.slideUp();
            $successState.removeClass('d-none').hide().fadeIn();

            // Refresh page or update table after delay (mock behavior)
            setTimeout(() => {
                // @ts-ignore
                $('#paymentModal').modal('hide');
                location.reload(); // simple way to mock state change for now
            }, 3000);

        }, 2000);
    });

    // Reset modal on close
    $('#paymentModal').on('hidden.bs.modal', function () {
        $('#paymentForm')[0].reset();
        $('#paymentForm').find('.is-invalid, .is-valid').removeClass('is-invalid is-valid');
        $('#paymentForm .modal-body, #paymentForm .modal-footer').show();
        $('#paymentSuccessState').addClass('d-none');
    });
});
