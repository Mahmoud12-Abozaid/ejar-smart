$(document).ready(function() {
    $('#openSidebar').on('click', function() {
        $('#adminSidebar').addClass('show');
        $('#sidebarBackdrop').addClass('show');
    });

    $('#closeSidebar, #sidebarBackdrop').on('click', function() {
        $('#adminSidebar').removeClass('show');
        $('#sidebarBackdrop').removeClass('show');
    });

    if ($('#usersTable').length) {
        // @ts-ignore
        $('#usersTable').DataTable({
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/ar.json',
            },
            responsive: true,
            pageLength: 5,
            lengthChange: false
        });
    }

    const ctx = document.getElementById('registrationsChart');
    if (ctx) {
        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
        const owners = [15, 22, 35, 41, 50, 65];
        const tenants = [45, 60, 85, 110, 140, 180];

        // @ts-ignore
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'ملاك',
                        data: owners,
                        backgroundColor: '#f5a623',
                        borderRadius: 4
                    },
                    {
                        label: 'مستأجرين',
                        data: tenants,
                        backgroundColor: '#1a4fa0',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        titleFont: { family: 'Cairo' },
                        bodyFont: { family: 'Cairo' }
                    },
                    legend: {
                        labels: { font: { family: 'Cairo' } }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { family: 'Cairo' } }
                    },
                    y: {
                        grid: { borderDash: [5, 5] },
                        ticks: { font: { family: 'Cairo' } }
                    }
                }
            }
        });
    }
});
