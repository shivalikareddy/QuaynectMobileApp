// Filter button interactions and pagination
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const groupCards = document.querySelectorAll('.group-card');
    const scrollContainer = document.getElementById('groups-scroll-container');
    const paginationDots = document.querySelectorAll('.pagination-dot');
    
    // Events pagination elements
    const eventsScrollContainer = document.getElementById('events-scroll-container');
    const eventsPaginationDots = document.querySelectorAll('.events-pagination-dot');
    
    // Section navigation
    const exploreSection = document.getElementById('explore-section');
    const discoverGroupsSection = document.getElementById('discover-groups-section');
    const discoverEventsSection = document.getElementById('discover-events-section');
    const exploreHeader = document.getElementById('explore-header');
    const discoverHeader = document.getElementById('discover-header');
    const eventsHeader = document.getElementById('events-header');
    const groupsCard = document.getElementById('groups-card');
    const eventsCard = document.getElementById('events-card');
    const backToExploreBtn = document.getElementById('back-to-explore');
    const backToExploreEventsBtn = document.getElementById('back-to-explore-events');
    const backToExploreFromEventsBtn = document.getElementById('back-to-explore-from-events');
    const blueBoxContainer = document.getElementById('blue-box-container');
    const eventsBlueBoxContainer = document.getElementById('events-blue-box-container');
    
    // Policy rows
    const policyRows = document.querySelectorAll('.policy-row');
    policyRows.forEach(row => {
        row.addEventListener('click', () => {
            policyRows.forEach(otherRow => {
                if (otherRow !== row) otherRow.classList.remove('active');
            });
            row.classList.toggle('active');
        });
    });

    // Navigate to Discover Groups
    if (groupsCard) {
        groupsCard.addEventListener('click', function() {
            console.log('Groups card clicked');
            // Fade out explore section
            exploreSection.style.transition = 'opacity 0.3s ease';
            exploreSection.style.opacity = '0';
            
            setTimeout(() => {
                exploreSection.classList.add('hidden');
                discoverGroupsSection.classList.remove('hidden');
                
                // Fade in discover groups section
                discoverGroupsSection.style.opacity = '0';
                discoverGroupsSection.style.transition = 'opacity 0.3s ease';
                
                setTimeout(() => {
                    discoverGroupsSection.style.opacity = '1';
                }, 50);
                
                // Reset explore section for next time
                exploreSection.style.opacity = '1';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 300);
        });
    } else {
        console.error('Groups card not found!');
    }
    
    // Navigate back to Explore Quayside
    if (backToExploreBtn) {
        backToExploreBtn.addEventListener('click', function() {
            // Fade out discover groups section
            discoverGroupsSection.style.transition = 'opacity 0.3s ease';
            discoverGroupsSection.style.opacity = '0';
            
            setTimeout(() => {
                discoverGroupsSection.classList.add('hidden');
                exploreSection.classList.remove('hidden');
                
                // Fade in explore section
                exploreSection.style.opacity = '0';
                exploreSection.style.transition = 'opacity 0.3s ease';
                
                setTimeout(() => {
                    exploreSection.style.opacity = '1';
                }, 50);
                
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 300);
        });
    }
    
    // Navigate back to Explore Quayside from Events (first events section)
    if (backToExploreEventsBtn) {
        backToExploreEventsBtn.addEventListener('click', function() {
            // Fade out discover events section
            discoverEventsSection.style.transition = 'opacity 0.3s ease';
            discoverEventsSection.style.opacity = '0';
            
            setTimeout(() => {
                discoverEventsSection.classList.add('hidden');
                exploreSection.classList.remove('hidden', 'opacity-0');
                exploreSection.classList.add('opacity-100');
                
                // Fade in explore section
                exploreSection.style.opacity = '0';
                exploreSection.style.transition = 'opacity 0.3s ease';
                
                setTimeout(() => {
                    exploreSection.style.opacity = '1';
                }, 50);
                
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 300);
        });
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active state from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-primary', 'text-white', 'shadow-md', '-translate-y-1', 'border-transparent');
                btn.classList.add('bg-white', 'dark:bg-card-dark', 'text-gray-700', 'dark:text-gray-200', 'shadow-sm', 'border-gray-100', 'dark:border-gray-700');
            });
            
            // Add active state to clicked button
            this.classList.remove('bg-white', 'dark:bg-card-dark', 'text-gray-700', 'dark:text-gray-200', 'shadow-sm', 'border-gray-100', 'dark:border-gray-700');
            this.classList.add('bg-primary', 'text-white', 'shadow-md', '-translate-y-1', 'border-transparent');
            
            // Get the filter category
            const category = this.getAttribute('data-filter');
            
            // Filter the cards
            groupCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (cardCategory === category) {
                    card.classList.remove('hidden');
                    // Add fade-in animation
                    card.style.animation = 'fadeIn 0.3s ease-in';
                } else {
                    card.classList.add('hidden');
                }
            });
            
            // Reset scroll position
            if (scrollContainer) {
                scrollContainer.scrollTop = 0;
            }
            updatePaginationDots();
        });
    });
    
    // Update pagination dots based on scroll position
    let scrollTimeout;
    function updatePaginationDots() {
        if (!scrollContainer) return;
        const scrollTop = scrollContainer.scrollTop;
        const scrollHeight = scrollContainer.scrollHeight;
        const clientHeight = scrollContainer.clientHeight;
        const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
        
        // Determine which page we're on (0-based index)
        const currentPage = Math.round(scrollPercentage);
        
        paginationDots.forEach((dot, index) => {
            if (index === currentPage) {
                dot.classList.remove('opacity-30');
                dot.classList.add('opacity-100');
            } else {
                dot.classList.remove('opacity-100');
                dot.classList.add('opacity-30');
            }
        });
    }
    
    // Snap to nearest page after scrolling stops
    function snapToPage() {
        if (!scrollContainer) return;
        const scrollTop = scrollContainer.scrollTop;
        const scrollHeight = scrollContainer.scrollHeight;
        const clientHeight = scrollContainer.clientHeight;
        const maxScroll = scrollHeight - clientHeight;
        
        // If scrolled past halfway, snap to page 2 (bottom), otherwise snap to page 1 (top)
        if (scrollTop > maxScroll / 2) {
            scrollContainer.scrollTo({ top: maxScroll, behavior: 'smooth' });
        } else {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    // Listen to scroll events
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', function() {
            updatePaginationDots();
            
            // Clear previous timeout
            clearTimeout(scrollTimeout);
            
            // Set new timeout to snap after scrolling stops
            scrollTimeout = setTimeout(snapToPage, 150);
        });
    }
    
    // Events pagination update function
    function updateEventsPaginationDots() {
        if (!eventsScrollContainer) return;
        const scrollTop = eventsScrollContainer.scrollTop;
        const scrollHeight = eventsScrollContainer.scrollHeight;
        const clientHeight = eventsScrollContainer.clientHeight;
        const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
        
        // Determine which page we're on based on scroll percentage
        let currentPage = 0;
        if (scrollPercentage < 0.33) {
            currentPage = 0;
        } else if (scrollPercentage < 0.66) {
            currentPage = 1;
        } else {
            currentPage = 2;
        }
        
        eventsPaginationDots.forEach((dot, index) => {
            if (index === currentPage) {
                dot.classList.remove('opacity-30');
                dot.classList.add('opacity-100');
            } else {
                dot.classList.remove('opacity-100');
                dot.classList.add('opacity-30');
            }
        });
    }
    
    // Events snap to page function
    let eventsScrollTimeout;
    function snapToEventsPage() {
        if (!eventsScrollContainer) return;
        const scrollTop = eventsScrollContainer.scrollTop;
        const scrollHeight = eventsScrollContainer.scrollHeight;
        const clientHeight = eventsScrollContainer.clientHeight;
        const maxScroll = scrollHeight - clientHeight;
        const scrollPercentage = scrollTop / maxScroll;
        
        // Snap to nearest third
        if (scrollPercentage < 0.17) {
            eventsScrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (scrollPercentage < 0.5) {
            eventsScrollContainer.scrollTo({ top: maxScroll / 2, behavior: 'smooth' });
        } else if (scrollPercentage < 0.83) {
            eventsScrollContainer.scrollTo({ top: maxScroll / 2, behavior: 'smooth' });
        } else {
            eventsScrollContainer.scrollTo({ top: maxScroll, behavior: 'smooth' });
        }
    }
    
    // Listen to events scroll
    if (eventsScrollContainer) {
        eventsScrollContainer.addEventListener('scroll', function() {
            updateEventsPaginationDots();
            
            // Clear previous timeout
            clearTimeout(eventsScrollTimeout);
            
            // Set new timeout to snap after scrolling stops
            eventsScrollTimeout = setTimeout(snapToEventsPage, 150);
        });
    }
    
    // Navigate to Discover Events
    if (eventsCard) {
        eventsCard.addEventListener('click', function() {
            console.log('Events card clicked');
            // Fade out explore section
            exploreSection.style.transition = 'opacity 0.3s ease';
            exploreSection.style.opacity = '0';
            
            setTimeout(() => {
                exploreSection.classList.add('hidden');
                discoverEventsSection.classList.remove('hidden');
                
                // Fade in discover events section
                discoverEventsSection.style.opacity = '0';
                discoverEventsSection.style.transition = 'opacity 0.3s ease';
                
                setTimeout(() => {
                    discoverEventsSection.style.opacity = '1';
                }, 50);
                
                // Reset explore section for next time
                exploreSection.style.opacity = '1';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 300);
        });
    } else {
        console.error('Events card not found!');
    }
    
    // Navigate back to Explore from Events
    if (backToExploreFromEventsBtn) {
        backToExploreFromEventsBtn.addEventListener('click', function() {
            // Fade out discover events section
            discoverEventsSection.style.transition = 'opacity 0.3s ease';
            discoverEventsSection.style.opacity = '0';
            
            setTimeout(() => {
                discoverEventsSection.classList.add('hidden');
                exploreSection.classList.remove('hidden', 'opacity-0');
                exploreSection.classList.add('opacity-100');
                
                // Fade in explore section
                exploreSection.style.opacity = '0';
                exploreSection.style.transition = 'opacity 0.3s ease';
                
                setTimeout(() => {
                    exploreSection.style.opacity = '1';
                }, 50);
                
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 300);
        });
    }
    
    // Initial update
    updatePaginationDots();
    
    // Group detail card navigation (in discover groups section)
    const groupDetailCards = document.querySelectorAll('.group-card');
    
    // Map group names to their URL pages
    const groupPages = {
        'Garden Club': 'greenthumb-club.html',
        'Biidaasige Park Nature Walk': 'group-detail.html?group=biidaasige-park-nature-walk',
        'Native Plant Care': 'group-detail.html?group=native-plant-care',
        'Urban Bird & Insect Spotting': 'group-detail.html?group=urban-bird-insect-spotting'
    };
    
    groupDetailCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking the bookmark button
            if (e.target.closest('button')) {
                return;
            }
            
            const groupTitle = this.querySelector('h3').textContent.trim();
            const groupPage = groupPages[groupTitle];
            
            if (groupPage) {
                window.location.href = groupPage;
            }
        });
    });
    
    // Debug log to check if buttons are found
    console.log('Groups card found:', groupsCard);
    console.log('Events card found:', eventsCard);
});
