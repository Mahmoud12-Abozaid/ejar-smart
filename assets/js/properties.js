import { showLoader, hideLoader, formatCurrency } from './utils.js';

const API_BASE = 'http://localhost:5000/api';

const MOCK_PROPERTIES = [
    {
        id: 1,
        title: 'شقة فاخرة للإيجار في التجمع الخامس',
        type: 'apartment',
        city: 'cairo',
        price: 15000,
        area: 180,
        rooms: 3,
        bathrooms: 2,
        isFurnished: true,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
        location: 'التجمع الخامس، القاهرة',
        dateAdded: '2026-04-20'
    },
    {
        id: 2,
        title: 'فيلا مستقلة بمدينتي',
        type: 'villa',
        city: 'cairo',
        price: 35000,
        area: 450,
        rooms: 5,
        bathrooms: 4,
        isFurnished: false,
        image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800',
        location: 'مدينتي، القاهرة',
        dateAdded: '2026-04-25'
    },
    {
        id: 3,
        title: 'مكتب إداري مجهز بالمعادي',
        type: 'office',
        city: 'cairo',
        price: 22000,
        area: 120,
        rooms: 4,
        bathrooms: 1,
        isFurnished: true,
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
        location: 'المعادي، القاهرة',
        dateAdded: '2026-04-28'
    },
    {
        id: 4,
        title: 'شقة بإطلالة على البحر في سموحة',
        type: 'apartment',
        city: 'alex',
        price: 12000,
        area: 150,
        rooms: 3,
        bathrooms: 2,
        isFurnished: false,
        image: 'https://images.unsplash.com/photo-1502672260266-1c1e52d15461?auto=format&fit=crop&q=80&w=800',
        location: 'سموحة، الإسكندرية',
        dateAdded: '2026-04-29'
    },
    {
        id: 5,
        title: 'ستوديو مفروش بالمهندسين',
        type: 'apartment',
        city: 'giza',
        price: 8000,
        area: 60,
        rooms: 1,
        bathrooms: 1,
        isFurnished: true,
        image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=800',
        location: 'المهندسين، الجيزة',
        dateAdded: '2026-04-30'
    },
    {
        id: 6,
        title: 'محل تجاري بموقع متميز',
        type: 'shop',
        city: 'giza',
        price: 45000,
        area: 200,
        rooms: 0,
        bathrooms: 1,
        isFurnished: false,
        image: 'https://images.unsplash.com/photo-1582006748450-4828b634861d?auto=format&fit=crop&q=80&w=800',
        location: 'الدقي، الجيزة',
        dateAdded: '2026-04-22'
    }
];

$(document).ready(function() {
    const slider = document.getElementById('priceSlider');
    if (slider) {
        // @ts-ignore
        noUiSlider.create(slider, {
            start: [0, 50000],
            connect: true,
            direction: 'rtl',
            step: 1000,
            range: {
                'min': 0,
                'max': 50000
            }
        });

        slider.noUiSlider.on('update', function(values, handle) {
            const val = Math.round(Number(values[handle]));
            if (handle === 0) {
                $('#priceMin').text(formatCurrency(val));
            } else {
                $('#priceMax').text(val === 50000 ? '50,000+ ج.م' : formatCurrency(val));
            }
        });

        slider.noUiSlider.on('change', function() {
            loadProperties();
        });
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (settings.url && settings.url.includes(`${API_BASE}/properties`)) {
                return false; 
            }
        }
    });

    function loadProperties() {
        showLoader();
        
        const type = $('#filterType').val();
        const city = $('#filterCity').val();
        let priceMin = 0;
        let priceMax = 50000;
        
        if (slider && slider.noUiSlider) {
            const vals = slider.noUiSlider.get();
            priceMin = Number(vals[0]);
            priceMax = Number(vals[1]);
        }

        const rooms = $('input[name="rooms"]:checked').val();
        const isFurnished = $('#filterFurnished').is(':checked');
        const sort = $('#sortSelect').val();

        setTimeout(() => {
            let filtered = MOCK_PROPERTIES.filter(p => {
                if (type !== 'all' && p.type !== type) return false;
                if (city !== 'all' && p.city !== city) return false;
                if (p.price < priceMin || (priceMax < 50000 && p.price > priceMax)) return false;
                if (isFurnished && !p.isFurnished) return false;
                
                if (rooms !== 'all') {
                    if (rooms === '3' && p.rooms < 3) return false; 
                    else if (rooms !== '3' && p.rooms !== Number(rooms)) return false;
                }
                return true;
            });

            filtered.sort((a, b) => {
                if (sort === 'price_asc') return a.price - b.price;
                if (sort === 'price_desc') return b.price - a.price;
                if (sort === 'area_desc') return b.area - a.area;
                return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
            });

            renderGrid(filtered);
            hideLoader();
        }, 600);
    }

    function renderGrid(data) {
        const $grid = $('#propertiesGrid');
        const $noResults = $('#noResults');
        const $pagination = $('#paginationNav');
        
        $grid.empty();
        $('#resultsCount').text(data.length);

        if (data.length === 0) {
            $noResults.removeClass('d-none');
            $pagination.addClass('d-none');
            return;
        }

        $noResults.addClass('d-none');
        $pagination.removeClass('d-none');

        data.forEach(p => {
            const cardHtml = `
                <div class="col-md-6 col-xl-4">
                    <div class="card property-card">
                        <span class="badge bg-success property-badge px-3 py-2">متاح</span>
                        <div class="property-img-wrapper">
                            <img src="${p.image}" class="property-img" alt="${p.title}">
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title fw-bold text-primary mb-3">${p.title}</h5>
                            <h4 class="text-accent fw-bold mb-3">${formatCurrency(p.price)} <span class="fs-6 text-secondary fw-normal">/ شهر</span></h4>
                            
                            <div class="text-secondary mb-3 d-flex align-items-center">
                                <i class="bi bi-geo-alt-fill me-2 text-primary"></i> ${p.location}
                            </div>
                            
                            <div class="row g-2 text-center text-secondary small mb-4 bg-light rounded py-2 mt-auto">
                                <div class="col-4 border-end">
                                    <i class="bi bi-arrows-fullscreen d-block mb-1"></i>
                                    <span>${p.area} م²</span>
                                </div>
                                <div class="col-4 border-end">
                                    <i class="bi bi-door-closed d-block mb-1"></i>
                                    <span>${p.rooms} غرف</span>
                                </div>
                                <div class="col-4">
                                    <i class="bi bi-droplet d-block mb-1"></i>
                                    <span>${p.bathrooms} حمام</span>
                                </div>
                            </div>
                            
                            <a href="property-detail.html?id=${p.id}" class="btn btn-outline-primary w-100 mt-auto">التفاصيل الكاملة</a>
                        </div>
                    </div>
                </div>
            `;
            $grid.append(cardHtml);
        });
    }

    $('#filterForm').on('submit', function(e) {
        e.preventDefault();
        loadProperties();
    });

    $('#sortSelect').on('change', function() {
        loadProperties();
    });

    $('.filter-rooms').on('change', function() {
        loadProperties();
    });

    $('#filterType, #filterCity, #filterFurnished').on('change', function() {
        loadProperties();
    });

    loadProperties();
});
