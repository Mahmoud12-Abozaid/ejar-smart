import { showToast } from './utils.js';

$(document).ready(function() {
    const ctx = document.getElementById('revenueChart');
    
    if (ctx) {
        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس'];
        const data = [65000, 72000, 85000, 81000, 95000, 110000, 120000, 125000];

        // @ts-ignore
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'الإيرادات (ج.م)',
                    data: data,
                    borderColor: '#1a4fa0',
                    backgroundColor: 'rgba(26, 79, 160, 0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: '#f5a623',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        titleFont: { family: 'Cairo' },
                        bodyFont: { family: 'Cairo' },
                        padding: 10,
                        backgroundColor: 'rgba(0,0,0,0.8)'
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { family: 'Cairo' } }
                    },
                    y: {
                        grid: { borderDash: [5, 5] },
                        ticks: { 
                            font: { family: 'Cairo' },
                            callback: function(value) {
                                return value.toLocaleString('ar-EG') + ' ج';
                            }
                        }
                    }
                }
            }
        });
    }
});
