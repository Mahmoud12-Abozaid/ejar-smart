// Utility functions for Egar Smart Platform

// Mock Interceptor for AJAX (can be removed when real API is ready)
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (settings.url && settings.url.includes('/api/')) {
            console.log(`[MOCK AJAX] Request intercept: ${settings.type} ${settings.url}`);
        }
    }
});

export function showLoader() {
    const loader = document.getElementById('global-loader');
    if (loader) {
        loader.classList.remove('d-none');
    } else {
        const loaderHtml = `
            <div id="global-loader">
                <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                    <span class="visually-hidden">جاري التحميل...</span>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loaderHtml);
    }
}

export function hideLoader() {
    const loader = document.getElementById('global-loader');
    if (loader) {
        loader.classList.add('d-none');
    }
}

export function showToast(message, type = 'info') {
    const containerId = 'toast-container';
    let container = document.getElementById(containerId);
    
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(container);
    }

    let bgClass = 'bg-primary';
    if (type === 'success') bgClass = 'bg-success';
    if (type === 'error') bgClass = 'bg-danger';

    const toastId = `toast-${Date.now()}`;
    const toastHtml = `
        <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', toastHtml);
    const toastEl = document.getElementById(toastId);
    if (toastEl) {
        // @ts-ignore
        const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
        toast.show();
        
        toastEl.addEventListener('hidden.bs.toast', () => {
            toastEl.remove();
        });
    }
}

export function showModal(title, body) {
    const modalId = 'dynamic-modal';
    let modalEl = document.getElementById(modalId);
    
    if (!modalEl) {
        const modalHtml = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" id="${modalId}-body">
                            ${body}
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        modalEl = document.getElementById(modalId);
    } else {
        const titleEl = modalEl.querySelector('.modal-title');
        const bodyEl = document.getElementById(`${modalId}-body`);
        if (titleEl) titleEl.innerHTML = title;
        if (bodyEl) bodyEl.innerHTML = body;
    }

    if (modalEl) {
        // @ts-ignore
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    }
}

export function formatCurrency(amount) {
    const formatter = new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 0
    });
    return formatter.format(amount).replace('EGP', 'ج.م');
}

export function formatDate(dateStr) {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

export function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        }
    });

    return isValid;
}

window.utils = {
    showLoader,
    hideLoader,
    showToast,
    showModal,
    formatCurrency,
    formatDate,
    validateForm
};
