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

            function updateSlidePosition() {
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
                updateSlidePosition();
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
            producerCarouselWrapper.addEventListener('mouseleave', startAutoScroll);            // Comprehensive Mobile Touch & Pointer Swipe Engine
            let startX = 0;
            let startY = 0;
            let currentX = 0;
            let currentY = 0;
            let isDragging = false;
            let isHorizontalSwipe = false;

            function handleSwipeStart(clientX, clientY) {
                isDragging = true;
                isHorizontalSwipe = false;
                startX = clientX;
                startY = clientY;
                currentX = clientX;
                currentY = clientY;
                stopAutoScroll();
                producerCarouselTrack.style.cursor = 'grabbing';
            }

            function handleSwipeMove(clientX, clientY, e) {
                if (!isDragging) return;
                currentX = clientX;
                currentY = clientY;

                const diffX = Math.abs(startX - currentX);
                const diffY = Math.abs(startY - currentY);

                if (diffX > 5 || diffY > 5) {
                    if (diffX > diffY) {
                        isHorizontalSwipe = true;
                    }
                }

                if (isHorizontalSwipe && e && e.cancelable) {
                    e.preventDefault();
                }
            }

            function handleSwipeEnd(e) {
                if (!isDragging) return;
                isDragging = false;
                producerCarouselTrack.style.cursor = 'grab';

                const diffX = startX - currentX;
                const threshold = 30; // Sensitive mobile threshold

                if (Math.abs(diffX) > threshold) {
                    if (e && e.target && diffX !== 0) {
                        const link = e.target.closest('a');
                        if (link) {
                            const suppressClick = (evt) => {
                                evt.preventDefault();
                                evt.stopPropagation();
                                link.removeEventListener('click', suppressClick, true);
                            };
                            link.addEventListener('click', suppressClick, true);
                        }
                    }

                    if (diffX > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                }

                startAutoScroll();
            }

            producerCarouselTrack.style.cursor = 'grab';
            producerCarouselTrack.style.userSelect = 'none';

            // Touch Events (Mobile Native)
            producerCarouselTrack.addEventListener('touchstart', (e) => {
                if (e.touches && e.touches.length === 1) {
                    handleSwipeStart(e.touches[0].clientX, e.touches[0].clientY);
                }
            }, { passive: true });

            producerCarouselTrack.addEventListener('touchmove', (e) => {
                if (e.touches && e.touches.length === 1) {
                    handleSwipeMove(e.touches[0].clientX, e.touches[0].clientY, e);
                }
            }, { passive: false });

            producerCarouselTrack.addEventListener('touchend', (e) => {
                handleSwipeEnd(e);
            }, { passive: true });

            producerCarouselTrack.addEventListener('touchcancel', () => {
                isDragging = false;
                startAutoScroll();
            });

            // Pointer Events (Desktop & Stylus)
            producerCarouselTrack.addEventListener('pointerdown', (e) => {
                if (e.pointerType === 'touch') return;
                handleSwipeStart(e.clientX, e.clientY);
            });

            producerCarouselTrack.addEventListener('pointermove', (e) => {
                if (e.pointerType === 'touch') return;
                handleSwipeMove(e.clientX, e.clientY, e);
            });

            producerCarouselTrack.addEventListener('pointerup', (e) => {
                if (e.pointerType === 'touch') return;
                handleSwipeEnd(e);
            });

            producerCarouselTrack.addEventListener('pointercancel', () => {
                isDragging = false;
                startAutoScroll();
            });

            // Initialize Position & Start Auto Scroll
            updateSlidePosition();
            startAutoScroll();
        }
    }

});
