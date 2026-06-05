import { validateForm } from './utils.js';

$(document).ready(function() {
    
    // @ts-ignore
    $('#cardNumber').mask('0000 0000 0000 0000');
    // @ts-ignore
    $('#cardExpiry').mask('00/00');
    // @ts-ignore
    $('#cardCvv').mask('000');

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

        setTimeout(() => {
            $btn.prop('disabled', false);
            $spinner.addClass('d-none');
            
            $formBody.slideUp();
            $successState.removeClass('d-none').hide().fadeIn();

            setTimeout(() => {
                // @ts-ignore
                $('#paymentModal').modal('hide');
                location.reload();
            }, 3000);

        }, 2000);
    });

    $('#paymentModal').on('hidden.bs.modal', function () {
        // @ts-ignore
        $('#paymentForm')[0].reset();
        $('#paymentForm').find('.is-invalid, .is-valid').removeClass('is-invalid is-valid');
        $('#paymentForm .modal-body, #paymentForm .modal-footer').show();
        $('#paymentSuccessState').addClass('d-none');
    });
});
