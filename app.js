// ==========================================================================
// AspiringMusicians.in — Master JavaScript Application
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Sticky Navigation Scroll Shadow & Active Link Observer Effect
    const navbarHeader = document.getElementById('navbarHeader');
    const navLinks = document.querySelectorAll('.nav-link[data-nav]');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbarHeader.classList.add('scrolled');
        } else {
            navbarHeader.classList.remove('scrolled');
        }

        // Active Section Scroll Highlight logic
        const isHomePage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname === '';
        
        if (isHomePage) {
            let currentSectionId = '';
            const scrollPosition = window.scrollY + 200;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            if (currentSectionId) {
                navLinks.forEach(link => {
                    if (link.getAttribute('data-nav') === currentSectionId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        }
    });

    // 2. Mobile Navigation Drawer Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const closeDrawer = document.getElementById('closeDrawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    if (mobileToggle && mobileDrawer) {
        mobileToggle.addEventListener('click', () => {
            mobileDrawer.classList.add('open');
        });
    }

    if (closeDrawer && mobileDrawer) {
        closeDrawer.addEventListener('click', () => {
            mobileDrawer.classList.remove('open');
        });
    }

    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileDrawer) {
                mobileDrawer.classList.remove('open');
            }
        });
    });

    // 3. Scroll Reveal Motion Graphics (IntersectionObserver)
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Custom Sleek Dropdown Component Logic
    const sortCustomDropdown = document.getElementById('sortCustomDropdown');
    const sortDropdownTrigger = document.getElementById('sortDropdownTrigger');
    const currentSortText = document.getElementById('currentSortText');
    const dropdownItems = document.querySelectorAll('#sortDropdownMenu .dropdown-item');

    let currentSortValue = 'featured';

    if (sortDropdownTrigger && sortCustomDropdown) {
        sortDropdownTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = sortCustomDropdown.classList.contains('open');
            if (isOpen) {
                sortCustomDropdown.classList.remove('open');
                sortDropdownTrigger.setAttribute('aria-expanded', 'false');
            } else {
                sortCustomDropdown.classList.add('open');
                sortDropdownTrigger.setAttribute('aria-expanded', 'true');
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!sortCustomDropdown.contains(e.target)) {
                sortCustomDropdown.classList.remove('open');
                sortDropdownTrigger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    if (dropdownItems.length > 0) {
        dropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                currentSortValue = item.getAttribute('data-sort') || 'featured';
                const labelText = item.querySelector('span') ? item.querySelector('span').innerText : item.innerText;
                if (currentSortText) currentSortText.innerText = labelText;

                if (sortCustomDropdown) sortCustomDropdown.classList.remove('open');
                if (sortDropdownTrigger) sortDropdownTrigger.setAttribute('aria-expanded', 'false');

                filterAndSortCourses();
            });
        });
    }

    // 5. Bulletproof Course & Product Catalog Search & Category Filter Logic
    const courseSearchInput = document.getElementById('courseSearchInput');
    const clearCourseSearch = document.getElementById('clearCourseSearch');
    const courseCategoryPills = document.getElementById('courseCategoryPills');
    const coursesDisplayGrid = document.getElementById('coursesDisplayGrid');
    const catalogResultsCount = document.getElementById('catalogResultsCount');
    const activeFilterBadge = document.getElementById('activeFilterBadge');
    const activeFilterBadgeText = document.getElementById('activeFilterBadgeText');
    const clearActiveFilterBtn = document.getElementById('clearActiveFilterBtn');
    const resetSidebarCategoryBtn = document.getElementById('resetSidebarCategoryBtn');
    const resetCourseFiltersBtn = document.getElementById('resetCourseFiltersBtn');
    const noCoursesState = document.getElementById('noCoursesState');

    let activeCategory = 'all';

    function resetAllFilters() {
        if (courseSearchInput) courseSearchInput.value = '';
        activeCategory = 'all';
        if (courseCategoryPills) {
            const catPills = courseCategoryPills.querySelectorAll('.cat-pill');
            catPills.forEach(p => p.classList.remove('active'));
            if (catPills[0]) catPills[0].classList.add('active');
        }
        filterAndSortCourses();
    }

    function filterAndSortCourses() {
        if (!coursesDisplayGrid) return;

        const query = courseSearchInput && courseSearchInput.value ? courseSearchInput.value.toLowerCase().trim() : '';

        if (clearCourseSearch) {
            if (query.length > 0) {
                clearCourseSearch.classList.add('visible');
            } else {
                clearCourseSearch.classList.remove('visible');
            }
        }

        const cards = Array.from(coursesDisplayGrid.querySelectorAll('.catalog-course-card'));
        let visibleCount = 0;

        cards.forEach(card => {
            const cardTitle = (card.getAttribute('data-title') || '').toLowerCase();
            const cardCat = (card.getAttribute('data-category') || '').toLowerCase().trim();
            const targetCat = (activeCategory || 'all').toLowerCase().trim();

            // Exact Multi-Tag Category Matching
            let matchesCategory = false;
            if (targetCat === 'all' || targetCat === '') {
                matchesCategory = true;
            } else {
                const cardTags = cardCat.split(/\s+/);
                matchesCategory = cardTags.includes(targetCat);
            }

            // Ultra-flexible Query Matching
            let matchesQuery = true;
            if (query !== '') {
                const cardText = (card.innerText || '').toLowerCase();
                matchesQuery = cardTitle.includes(query) || cardCat.includes(query) || cardText.includes(query);
            }

            if (matchesCategory && matchesQuery) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Dynamic Results Counter Update
        if (catalogResultsCount) {
            catalogResultsCount.innerText = visibleCount;
        }

        // Active Filter Badge & Sidebar Clear Cross Link Visibility
        const isFiltered = (activeCategory !== 'all') || (query !== '');
        
        if (activeFilterBadge) {
            if (isFiltered) {
                activeFilterBadge.classList.remove('hidden');
                let filterLabel = '';
                if (activeCategory !== 'all') {
                    const activePill = courseCategoryPills ? courseCategoryPills.querySelector('.cat-pill.active span') : null;
                    filterLabel = activePill ? activePill.innerText : activeCategory;
                }
                if (query !== '') {
                    filterLabel = filterLabel ? `${filterLabel} ("${query}")` : `Search: "${query}"`;
                }
                if (activeFilterBadgeText) activeFilterBadgeText.innerText = filterLabel;
            } else {
                activeFilterBadge.classList.add('hidden');
            }
        }

        if (resetSidebarCategoryBtn) {
            if (activeCategory !== 'all') {
                resetSidebarCategoryBtn.classList.remove('hidden');
            } else {
                resetSidebarCategoryBtn.classList.add('hidden');
            }
        }

        // Handle Sorting
        cards.sort((a, b) => {
            const priceA = parseFloat(a.getAttribute('data-price')) || 0;
            const priceB = parseFloat(b.getAttribute('data-price')) || 0;

            if (currentSortValue === 'price-asc') {
                return priceA - priceB;
            } else if (currentSortValue === 'price-desc') {
                return priceB - priceA;
            }
            return 0;
        });

        cards.forEach(card => coursesDisplayGrid.appendChild(card));

        // Toggle Grid vs No Courses State
        if (noCoursesState) {
            if (visibleCount === 0) {
                noCoursesState.classList.remove('hidden');
                coursesDisplayGrid.classList.add('hidden');
            } else {
                noCoursesState.classList.add('hidden');
                coursesDisplayGrid.classList.remove('hidden');
            }
        }
    }

    if (courseSearchInput) {
        courseSearchInput.addEventListener('input', filterAndSortCourses);
    }

    if (clearCourseSearch) {
        clearCourseSearch.addEventListener('click', () => {
            if (courseSearchInput) {
                courseSearchInput.value = '';
                filterAndSortCourses();
                courseSearchInput.focus();
            }
        });
    }

    // Category Pill Event Delegation for Robust Button & Child Icon Clicks
    if (courseCategoryPills) {
        courseCategoryPills.addEventListener('click', (e) => {
            const pill = e.target.closest('.cat-pill');
            if (!pill) return;

            const catPills = courseCategoryPills.querySelectorAll('.cat-pill');
            catPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            activeCategory = pill.getAttribute('data-category') || 'all';
            filterAndSortCourses();
        });
    }

    if (clearActiveFilterBtn) {
        clearActiveFilterBtn.addEventListener('click', resetAllFilters);
    }

    if (resetSidebarCategoryBtn) {
        resetSidebarCategoryBtn.addEventListener('click', resetAllFilters);
    }

    if (resetCourseFiltersBtn) {
        resetCourseFiltersBtn.addEventListener('click', resetAllFilters);
    }

    // Initial Filter Evaluation on Page Load
    filterAndSortCourses();

    // 6. Producer Packs Interactive Auto-Scrolling Carousel Engine
    const producerCarouselWrapper = document.getElementById('producerCarouselWrapper');
    const producerCarouselTrack = document.getElementById('producerCarouselTrack');
    const carouselPrevBtn = document.getElementById('carouselPrevBtn');
    const carouselNextBtn = document.getElementById('carouselNextBtn');
    const carouselDotsWrapper = document.getElementById('carouselDotsWrapper');

    if (producerCarouselWrapper && producerCarouselTrack) {
        const slides = Array.from(producerCarouselTrack.querySelectorAll('.carousel-slide'));
        const totalSlides = slides.length;

        if (totalSlides > 0) {
            // Random Initial Product Selection on Refresh
            let currentSlideIndex = Math.floor(Math.random() * totalSlides);
            let autoScrollTimer = null;

            // Generate Pagination Dots
            if (carouselDotsWrapper) {
                carouselDotsWrapper.innerHTML = '';
                slides.forEach((_, idx) => {
                    const dot = document.createElement('button');
                    dot.type = 'button';
                    dot.className = `carousel-dot ${idx === currentSlideIndex ? 'active' : ''}`;
                    dot.setAttribute('aria-label', `Go to product ${idx + 1}`);
                    dot.addEventListener('click', () => goToSlide(idx));
                    carouselDotsWrapper.appendChild(dot);
                });
            }

            function updateSlidePosition(smooth = true) {
                if (smooth) {
                    producerCarouselTrack.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                } else {
                    producerCarouselTrack.style.transition = 'none';
                }
                producerCarouselTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

                if (carouselDotsWrapper) {
                    const dots = carouselDotsWrapper.querySelectorAll('.carousel-dot');
                    dots.forEach((dot, idx) => {
                        if (idx === currentSlideIndex) {
                            dot.classList.add('active');
                        } else {
                            dot.classList.remove('active');
                        }
                    });
                }
            }

            function goToSlide(index) {
                currentSlideIndex = (index + totalSlides) % totalSlides;
                updateSlidePosition(true);
            }

            function nextSlide() {
                goToSlide(currentSlideIndex + 1);
            }

            function prevSlide() {
                goToSlide(currentSlideIndex - 1);
            }

            if (carouselPrevBtn) carouselPrevBtn.addEventListener('click', prevSlide);
            if (carouselNextBtn) carouselNextBtn.addEventListener('click', nextSlide);

            // Auto-Scroll (Every 5 seconds)
            function startAutoScroll() {
                stopAutoScroll();
                autoScrollTimer = setInterval(nextSlide, 5000);
            }

            function stopAutoScroll() {
                if (autoScrollTimer) {
                    clearInterval(autoScrollTimer);
                    autoScrollTimer = null;
                }
            }

            producerCarouselWrapper.addEventListener('mouseenter', stopAutoScroll);
            producerCarouselWrapper.addEventListener('mouseleave', startAutoScroll);

            // 1:1 Live Finger Tracking Touch & Mouse Engine (60fps Silky Smooth)
            let startX = 0;
            let startY = 0;
            let currentX = 0;
            let currentY = 0;
            let isDragging = false;
            let isScrolling = undefined; // undefined = undecided, true = vertical page scroll, false = horizontal carousel swipe
            let dragOffset = 0;

            function onTouchStart(e) {
                const touch = e.touches ? e.touches[0] : e;
                isDragging = true;
                isScrolling = undefined;
                startX = touch.clientX;
                startY = touch.clientY;
                currentX = touch.clientX;
                currentY = touch.clientY;
                dragOffset = 0;
                stopAutoScroll();
            }

            function onTouchMove(e) {
                if (!isDragging) return;
                const touch = e.touches ? e.touches[0] : e;
                currentX = touch.clientX;
                currentY = touch.clientY;

                const diffX = currentX - startX;
                const diffY = currentY - startY;

                // Determine swipe direction on initial movement
                if (typeof isScrolling === 'undefined') {
                    if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
                        isScrolling = Math.abs(diffY) > Math.abs(diffX);
                    }
                }

                // If horizontal swipe is active, perform 1:1 live track follow & prevent vertical page scroll
                if (isScrolling === false) {
                    if (e.cancelable) e.preventDefault();
                    dragOffset = diffX;
                    const trackWidth = producerCarouselTrack.offsetWidth || 1;
                    const offsetPercent = (dragOffset / trackWidth) * 100;
                    const currentPercent = -currentSlideIndex * 100 + offsetPercent;
                    producerCarouselTrack.style.transition = 'none';
                    producerCarouselTrack.style.transform = `translateX(${currentPercent}%)`;
                }
            }

            function onTouchEnd(e) {
                if (!isDragging) return;
                isDragging = false;

                if (isScrolling === false) {
                    const threshold = 35; // Sensitive flick distance
                    if (dragOffset < -threshold) {
                        currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
                    } else if (dragOffset > threshold) {
                        currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
                    }

                    // Suppress click on link if user swiped
                    if (Math.abs(dragOffset) > 10 && e && e.target) {
                        const link = e.target.closest('a');
                        if (link) {
                            const preventLinkClick = (evt) => {
                                evt.preventDefault();
                                evt.stopPropagation();
                                link.removeEventListener('click', preventLinkClick, true);
                            };
                            link.addEventListener('click', preventLinkClick, true);
                        }
                    }
                }

                updateSlidePosition(true);
                startAutoScroll();
            }

            // Bind Touch Events with passive: false for touchmove to enable e.preventDefault()
            producerCarouselTrack.addEventListener('touchstart', onTouchStart, { passive: true });
            producerCarouselTrack.addEventListener('touchmove', onTouchMove, { passive: false });
            producerCarouselTrack.addEventListener('touchend', onTouchEnd, { passive: true });
            producerCarouselTrack.addEventListener('touchcancel', onTouchEnd, { passive: true });

            // Bind Mouse Pointer Events for Desktop Dragging
            producerCarouselTrack.addEventListener('mousedown', (e) => {
                onTouchStart(e);
                const onMouseMove = (evt) => onTouchMove(evt);
                const onMouseUp = (evt) => {
                    onTouchEnd(evt);
                    window.removeEventListener('mousemove', onMouseMove);
                    window.removeEventListener('mouseup', onMouseUp);
                };
                window.addEventListener('mousemove', onMouseMove);
                window.addEventListener('mouseup', onMouseUp);
            });

            // Initialize Position & Start Auto Scroll
            updateSlidePosition(false);
            startAutoScroll();
        }
    }

    // 7. Enforce 100% Reliable 1:1 Mentorship Superprofile Booking Link across Mobile & Desktop
    const MENTORSHIP_BOOKING_URL = 'https://superprofile.bio/bookings/aspiringmusicians?sessionId=6a6f341c4c5b8300133c3c03';
    
    document.querySelectorAll('a[href*="bookings/aspiringmusicians"]').forEach(link => {
        link.setAttribute('href', MENTORSHIP_BOOKING_URL);
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(MENTORSHIP_BOOKING_URL, '_blank', 'noopener,noreferrer');
        });
    });

});
