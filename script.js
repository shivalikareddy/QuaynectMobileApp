document.addEventListener('DOMContentLoaded', () => {
    // Determine path depth for navigation
    const knownFolders = ['payments', 'booking', 'digital-key', 'community', 'points', 'packages'];
    const isInSubfolder = knownFolders.some(folder => window.location.pathname.includes('/' + folder + '/'));
    const prefix = isInSubfolder ? '../' : '';

    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    
    // Check if we are on billing page by title or unique element
    // Actually, on payments.html, 'Services' is hardcoded as active.
    // However, if the user clicks other tabs, the JS runs.
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
             // Basic navigation simulation
             const spanText = item.querySelector('span')?.innerText;

             if(spanText === 'Home') {
                 window.location.href = prefix + 'index.html';
                 return;
             }
             if(spanText === 'Services') {
                 window.location.href = prefix + 'services.html';
                 return;
             }

            // Reset all items: remove active class and ensure outline icon
            navItems.forEach(nav => {
                nav.classList.remove('active');
                const icon = nav.querySelector('ion-icon');
                const name = icon.getAttribute('name');
                // If it's a filled icon (doesn't have -outline) AND it's not a logo/special icon that shouldn't change
                if (name && !name.endsWith('-outline')) {
                    // Try to guess outline name
                    // Check if 'construct' -> 'construct-outline'
                    icon.setAttribute('name', name + '-outline');
                }
            });

            // Set active item: add class and switch to filled icon
            item.classList.add('active');
            const activeIcon = item.querySelector('ion-icon');
            const activeName = activeIcon.getAttribute('name');
            if (activeName && activeName.endsWith('-outline')) {
                activeIcon.setAttribute('name', activeName.replace('-outline', ''));
            }
            
            console.log(`Navigated to: ${spanText}`);
        });
    });

    // RSVP Button
    const rsvpBtn = document.querySelector('.rsvp-btn');
    if (rsvpBtn) {
        rsvpBtn.addEventListener('click', () => {
            rsvpBtn.textContent = 'RSVP Sent!';
            rsvpBtn.style.backgroundColor = '#fff';
            rsvpBtn.style.color = '#333';
            setTimeout(() => {
                rsvpBtn.textContent = 'RSVP';
                rsvpBtn.style.backgroundColor = '';
                rsvpBtn.style.color = '';
            }, 2000);
        });
    }

    // Dashboard Cards Interaction
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h4').innerText;
            console.log(`Open ${title}`);
            
            // Subtle feedback
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 100);
        });
    });

    // --- Unified Dashboard Logic (Edit & Expand) ---
    const editLink = document.querySelector('.edit-link');
    const expandBtn = document.querySelector('.expand-btn');
    const mainGrid = document.querySelector('.dashboard-section > .grid-container');
    const extraGrid = document.querySelector('.second-grid');
    const expandableWrapper = document.querySelector('.expandable-wrapper');

    // --- Card Order Persistence ---
    const loadDashboardOrder = () => {
        const savedOrder = localStorage.getItem('dashboardCardOrder');
        if (!savedOrder || !mainGrid) return;

        const orderIds = JSON.parse(savedOrder);
        const allCards = document.querySelectorAll('.dashboard-card[data-id]');
        const cardMap = {};
        allCards.forEach(card => cardMap[card.getAttribute('data-id')] = card);

        // Clear and re-append in order
        orderIds.forEach((id, index) => {
            const card = cardMap[id];
            if (card) {
                if (index < 4) {
                    mainGrid.appendChild(card);
                } else if (extraGrid) {
                    extraGrid.appendChild(card);
                }
            }
        });
    };

    const saveDashboardOrder = () => {
        const allCurrentCards = [];
        if (mainGrid) {
            Array.from(mainGrid.children).forEach(child => {
                if (child.hasAttribute('data-id')) allCurrentCards.push(child.getAttribute('data-id'));
            });
        }
        if (extraGrid && !isEditing) { // Only check extra grid if not currently merged
            Array.from(extraGrid.children).forEach(child => {
                if (child.hasAttribute('data-id')) allCurrentCards.push(child.getAttribute('data-id'));
            });
        }
        localStorage.setItem('dashboardCardOrder', JSON.stringify(allCurrentCards));
    };

    loadDashboardOrder();

    let isEditing = false;
    let sortableInstance = null;

    // Helper to get current expansion state visually
    const isExpanded = () => {
        const icon = expandBtn ? expandBtn.querySelector('ion-icon, svg') : null;
        return icon && icon.style.transform === 'rotate(180deg)';
    };

    // Helper to set expansion state
    const setExpanded = (shouldExpand) => {
         if (!expandBtn || !expandableWrapper) return;
         
         const icon = expandBtn.querySelector('ion-icon, svg');
         if (shouldExpand) {
             expandableWrapper.style.maxHeight = expandableWrapper.scrollHeight + "px";
             expandableWrapper.style.opacity = "1";
             if(icon) icon.style.transform = 'rotate(180deg)';
         } else {
             expandableWrapper.style.maxHeight = "0px";
             expandableWrapper.style.opacity = "0";
             if(icon) icon.style.transform = 'rotate(0deg)';
         }
    };

    if (editLink) {
        editLink.addEventListener('click', (e) => {
            e.preventDefault();
            isEditing = !isEditing;
            editLink.textContent = isEditing ? 'DONE' : 'EDIT';

            if (isEditing) {
                // 1. Force Expand visual
                setExpanded(true);

                // 2. Merge items for seamless sorting
                if (extraGrid && mainGrid) {
                    const extraCards = Array.from(extraGrid.children);
                    extraCards.forEach(card => mainGrid.appendChild(card));
                }

                // 3. Init Sortable (Single Grid)
                if (typeof Sortable !== 'undefined' && mainGrid) {
                    sortableInstance = new Sortable(mainGrid, {
                        animation: 350,
                        easing: "cubic-bezier(0.2, 0, 0, 1)", // iOS-like easing
                        delay: 50, // Slight delay to feel more intentional
                        touchStartThreshold: 5,
                        forceFallback: true,
                        fallbackClass: 'sortable-drag',
                        ghostClass: 'sortable-ghost',
                        chosenClass: 'sortable-chosen',
                        fallbackOnBody: true,
                        onStart: (evt) => {
                            evt.item.classList.remove('wiggle');
                            document.body.classList.add('dragging-active');
                        },
                        onEnd: (evt) => {
                            if (isEditing) evt.item.classList.add('wiggle');
                            document.body.classList.remove('dragging-active');
                            saveDashboardOrder();
                        }
                    });
                }

                // 4. Start Wiggle
                document.querySelectorAll('.dashboard-card').forEach(c => c.classList.add('wiggle'));

            } else {
                // 1. Stop Wiggle
                document.querySelectorAll('.dashboard-card').forEach(c => c.classList.remove('wiggle'));

                // 2. Destroy Sortable
                if (sortableInstance) {
                    sortableInstance.destroy();
                    sortableInstance = null;
                }

                // 3. Split items back (Maintain 4 in main, rest in extra)
                if (mainGrid && extraGrid) {
                    const allCards = Array.from(mainGrid.children);
                    if (allCards.length > 4) {
                        const cardsToMove = allCards.slice(4);
                        cardsToMove.forEach(card => extraGrid.appendChild(card));
                    }
                }

                saveDashboardOrder();

                // 4. Update wrapper height to match new content flow
                // Since we are still expanded, we just update the explicit height
                if (expandableWrapper) {
                    expandableWrapper.style.maxHeight = expandableWrapper.scrollHeight + "px";
                }
            }
        });
    }

    if (expandBtn) {
        expandBtn.addEventListener('click', () => {
            // Check current visual state
            const currentExpanded = isExpanded();
            
            // If we are Editing, we might want to block collapsing? 
            // Or if user collapses while editing, we should probably stop editing?
            // For now, let's allow toggle but it might hide the active sortable items if not careful.
            // BUT: In edit mode, we moved items OUT of the wrapper. So collapsing wrapper does nothing to the last 2 items!
            // This is a side effect of the merge. 
            // FIX: If editing, clicking expand arrow should probably just Exit Edit mode or be ignored.
            // Let's make it exit edit mode for a clean state.
            
            if (isEditing) {
                // Simulate clicking 'Done'
                editLink.click();
                // Then collapse
                setTimeout(() => setExpanded(false), 50);
            } else {
                // Normal toggle behavior
                setExpanded(!currentExpanded);
            }
        });
    }

    // Notification Banner
    const banner = document.querySelector('.notification-banner');
    if (banner) {
        banner.addEventListener('click', () => {
            banner.style.transform = 'scale(0.98)';
            setTimeout(() => {
                window.location.href = prefix + 'booking/index.html#occupancy-section';
            }, 100);
        });
    }

    // View More Transactions
    const viewMoreBtn = document.querySelector('.view-more');
    const expandableTransactions = document.querySelector('.expandable-transactions');

    if (viewMoreBtn && expandableTransactions) {
        let transactionsExpanded = false;
        viewMoreBtn.addEventListener('click', () => {
            transactionsExpanded = !transactionsExpanded;
            
            // Rotate icon
            const icon = viewMoreBtn.querySelector('ion-icon');
            if(icon) {
                 icon.style.transition = 'transform 0.4s ease';
                 icon.style.transform = transactionsExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
            }
            
            // Animate wrapper
            if (transactionsExpanded) {
                expandableTransactions.style.maxHeight = expandableTransactions.scrollHeight + "px";
                expandableTransactions.style.opacity = "1";
                viewMoreBtn.querySelector('span').textContent = "View Less";
            } else {
                expandableTransactions.style.maxHeight = "0px";
                expandableTransactions.style.opacity = "0";
                viewMoreBtn.querySelector('span').textContent = "View More";
            }
        });
    }

    // Utilities Card Navigation
    const utilitiesCard = document.getElementById('utilities-card');
    if (utilitiesCard) {
        utilitiesCard.addEventListener('click', (e) => {
            e.preventDefault();
            utilitiesCard.style.transform = 'scale(0.96)';
            setTimeout(() => {
                window.location.href = prefix + 'payments/utilities.html';
            }, 100);
        });
    }

    // Navigation for Insurance
    const insurancePill = document.getElementById('insurance-pill');
    const insuranceCard = document.getElementById('insurance-card');
    
    const navigateToInsurance = (e) => {
        e.preventDefault();
        const target = e.currentTarget;
        target.style.transform = 'scale(0.96)';
        setTimeout(() => {
            window.location.href = prefix + 'payments/insurance.html';
        }, 100);
    };

    if (insurancePill) insurancePill.addEventListener('click', navigateToInsurance);
    if (insuranceCard) insuranceCard.addEventListener('click', navigateToInsurance);

    // Community Navigation
    const communityCardId = document.querySelector('[data-id="card-community"]');
    const communityCard = document.getElementById('community-card');
    const navigateToCommunity = (e) => {
        const target = e.currentTarget;
        target.style.transform = 'scale(0.96)';
        setTimeout(() => {
            window.location.href = prefix + 'community/index.html';
        }, 100);
    };
    if (communityCardId) communityCardId.addEventListener('click', navigateToCommunity);
    if (communityCard) communityCard.addEventListener('click', navigateToCommunity);

    // Booking Navigation
    const bookingCardId = document.querySelector('[data-id="card-booking"]');
    const bookingCard = document.getElementById('booking-card');
    const navigateToBooking = (e) => {
        const target = e.currentTarget;
        target.style.transform = 'scale(0.96)';
        setTimeout(() => {
            window.location.href = prefix + 'booking/index.html';
        }, 100);
    };
    if (bookingCardId) bookingCardId.addEventListener('click', navigateToBooking);
    if (bookingCard) bookingCard.addEventListener('click', navigateToBooking);

    // Payments Navigation
    const paymentsCard = document.getElementById('payments-card');
    if (paymentsCard) {
        paymentsCard.addEventListener('click', (e) => {
            e.preventDefault();
            paymentsCard.style.transform = 'scale(0.96)';
            setTimeout(() => {
                window.location.href = prefix + 'payments/index.html';
            }, 100);
        });
    }

    // Maintenance
    const maintenanceCard = document.getElementById('maintenance-card');
    if (maintenanceCard) {
        maintenanceCard.addEventListener('click', () => {
            maintenanceCard.style.transform = 'scale(0.96)';
            setTimeout(() => {
                window.location.href = prefix + 'payments/maintenance.html';
            }, 100);
        });
    }

    // New 6-Folder Main Entry Points
    const keyCard = document.querySelector('[data-id="card-key"]');
    if (keyCard) {
        keyCard.addEventListener('click', () => {
            keyCard.style.transform = 'scale(0.96)';
            setTimeout(() => window.location.href = prefix + 'digital-key/index.html', 100);
        });
    }

    const pointsCard = document.querySelector('[data-id="card-points"]');
    const pointsCardSub = document.querySelector('[data-id="card-points"]'); // redundant but for safety
    if (pointsCard) {
        pointsCard.addEventListener('click', () => {
            pointsCard.style.transform = 'scale(0.96)';
            setTimeout(() => window.location.href = prefix + 'points/index.html', 100);
        });
    }

    const packagesCard = document.querySelector('[data-id="card-packages"]');
    if (packagesCard) {
        packagesCard.addEventListener('click', () => {
            packagesCard.style.transform = 'scale(0.96)';
            setTimeout(() => window.location.href = prefix + 'packages/index.html', 100);
        });
    }

    const dashboardPaymentsCard = document.querySelector('[data-id="card-payments"]');
    if (dashboardPaymentsCard) {
        dashboardPaymentsCard.addEventListener('click', () => {
            dashboardPaymentsCard.style.transform = 'scale(0.96)';
            setTimeout(() => window.location.href = prefix + 'payments/index.html', 100);
        });
    }

    // Gym Capacity Card (Homepage) -> Occupancy Section
    const gymCapacityCard = document.querySelector('.capacity-card');
    if (gymCapacityCard) {
        gymCapacityCard.addEventListener('click', () => {
            gymCapacityCard.style.transform = 'scale(0.98)';
            setTimeout(() => {
                window.location.href = prefix + 'index.html#occupancy-section';
            }, 100);
        });
    }

    // Rent Navigation (Legacy naming)
    const rentCard = document.getElementById('rent-card');
    const rentPill = document.getElementById('rent-pill');
    const navigateToRent = (e) => {
        e.preventDefault();
        const target = e.currentTarget;
        target.style.transform = 'scale(0.96)';
        setTimeout(() => {
            window.location.href = prefix + 'payments/index.html';
        }, 100);
    };
    if (rentCard) rentCard.addEventListener('click', navigateToRent);
    if (rentPill) rentPill.addEventListener('click', navigateToRent);

    // Payments Option Sub-pages
    const optionBank = document.getElementById('option-bank');
    const optionTransfer = document.getElementById('option-transfer');
    const optionAutopay = document.getElementById('option-autopay');
    const optionHistory = document.getElementById('option-history');

    if (optionBank) {
        optionBank.addEventListener('click', () => {
            optionBank.style.transform = 'scale(0.98)';
            setTimeout(() => window.location.href = prefix + 'payments/bank.html', 100);
        });
    }
    if (optionTransfer) {
        optionTransfer.addEventListener('click', () => {
            optionTransfer.style.transform = 'scale(0.98)';
            setTimeout(() => window.location.href = prefix + 'payments/transfer.html', 100);
        });
    }
    if (optionAutopay) {
        optionAutopay.addEventListener('click', () => {
            optionAutopay.style.transform = 'scale(0.98)';
            setTimeout(() => window.location.href = prefix + 'payments/autopay.html', 100);
        });
    }
    if (optionHistory) {
        optionHistory.addEventListener('click', () => {
            optionHistory.style.transform = 'scale(0.98)';
            setTimeout(() => window.location.href = prefix + 'payments/history.html', 100);
        });
    }

    // Breakdown Actions
    const rentPayNow = document.getElementById('rent-pay-now');
    const rentViewInvoices = document.getElementById('rent-view-invoices');

    if (rentPayNow) {
        rentPayNow.addEventListener('click', () => {
             rentPayNow.style.transform = 'scale(0.95)';
             setTimeout(() => window.location.href = prefix + 'payments/bank.html', 100);
        });
    }
    if (rentViewInvoices) {
        rentViewInvoices.addEventListener('click', () => {
             rentViewInvoices.style.transform = 'scale(0.95)';
             setTimeout(() => window.location.href = prefix + 'payments/history.html', 100);
        });
    }

    // --- Universal Search Functionality ---
    const searchInput = document.querySelector('.search-bar input');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            // List of all possible searchable items across pages
            const itemSelectors = [
                '.dashboard-card',
                '.option-item',
                '.service-action-item',
                '.transaction-item',
                '.maintenance-request-card',
                '.bill-line-item',
                '.upcoming-card',
                '.history-item',
                '.auto-pay-card',
                '.account-picker'
            ];

            const allItems = document.querySelectorAll(itemSelectors.join(', '));
            
            allItems.forEach(item => {
                const text = item.innerText.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });

            // Handle section headers visibility
            const sections = document.querySelectorAll('section.section-container, .dashboard-section');
            sections.forEach(section => {
                const visibleItems = section.querySelectorAll(itemSelectors.join(', '));
                let hasVisible = false;
                visibleItems.forEach(i => {
                    if (i.style.display !== 'none') hasVisible = true;
                });

                // If a section has searchable items and none are visible, hide the section
                if (visibleItems.length > 0) {
                    section.style.display = hasVisible ? '' : 'none';
                }
            });
        });
    }

    // --- Points Card Flip ---
    const flipCard = document.getElementById('points-card-flip');
    if (flipCard) {
        flipCard.addEventListener('click', () => {
            flipCard.classList.toggle('flipped');
        });
    }
});

// --- Digital Access Card Logic ---
const initDigitalKey = () => {
    const unlockBtn = document.getElementById('unlockBtn');
    const digitalCard = document.getElementById('digitalCard');
    const doorItems = document.querySelectorAll('.door-item');

    if (unlockBtn && digitalCard) {
        unlockBtn.addEventListener('click', () => {
            // Unlocking state
            unlockBtn.disabled = true;
            unlockBtn.innerHTML = '<ion-icon name="sync-outline" class="spin"></ion-icon> Unlocking...';
            
            // Add ripple to card
            const ripple = document.createElement('div');
            ripple.className = 'unlock-ripple animate-ripple';
            digitalCard.appendChild(ripple);
            
            // Success after delay
            setTimeout(() => {
                digitalCard.classList.add('success');
                unlockBtn.innerHTML = '<ion-icon name="checkmark-circle-outline"></ion-icon> Door Unlocked';
                unlockBtn.style.background = 'linear-gradient(135deg, #059669 0%, #064e3b 100%)';
                
                // Feedback
                if (window.navigator.vibrate) {
                    window.navigator.vibrate([100, 30, 100]);
                }

                // Reset after 3 seconds
                setTimeout(() => {
                    digitalCard.classList.remove('success');
                    ripple.remove();
                    unlockBtn.disabled = false;
                    unlockBtn.innerHTML = '<ion-icon name="bluetooth-outline"></ion-icon> Tap to Unlock';
                    unlockBtn.style.background = '';
                }, 3000);
            }, 1200);
        });
    }

    // Door Selection
    doorItems.forEach(item => {
        item.addEventListener('click', () => {
            doorItems.forEach(d => {
                d.classList.remove('selected');
                const check = d.querySelector('.check-icon');
                if (check) check.remove();
            });
            
            item.classList.add('selected');
            const checkIcon = document.createElement('ion-icon');
            checkIcon.setAttribute('name', 'checkmark-circle');
            checkIcon.className = 'check-icon';
            item.appendChild(checkIcon);
            
            // Update card info if it's the apartment
            const doorName = item.querySelector('h4').innerText;
            console.log(`Selected Door: ${doorName}`);
        });
    });
};

// Initialize if on the digital key page
if (window.location.pathname.includes('digital-key')) {
    initDigitalKey();
}

// Ensure it also works with SPA-like transitions if any
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('digital-key')) {
        initDigitalKey();
    }
});


/* --- Notifications Logic --- */
const initNotifications = () => {
    const tabs = document.querySelectorAll('.notification-tabs button');
    const rows = document.querySelectorAll('.notif-row');
    const groupHeaders = document.querySelectorAll('.group-header');

    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.getAttribute('data-filter');

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Filter rows and track group visibility
            let hasVisibleNew = false;
            let hasVisiblePrevious = false;

            rows.forEach(row => {
                const category = row.getAttribute('data-category');
                const isVisible = (filter === 'all' || filter === category);
                row.style.display = isVisible ? 'flex' : 'none';

                if (isVisible) {
                    // Check if row belongs to 'NEW' or 'PREVIOUS'
                    // We can check sibling order or add data-group to rows too
                    let prevHeader = row.previousElementSibling;
                    while (prevHeader && !prevHeader.classList.contains('group-header')) {
                        prevHeader = prevHeader.previousElementSibling;
                    }
                    
                    if (prevHeader) {
                        if (prevHeader.getAttribute('data-group') === 'new') hasVisibleNew = true;
                        if (prevHeader.getAttribute('data-group') === 'previous') hasVisiblePrevious = true;
                    }
                }
            });

            // Toggle group headers
            groupHeaders.forEach(header => {
                const group = header.getAttribute('data-group');
                if (group === 'new') header.style.display = hasVisibleNew ? 'block' : 'none';
                if (group === 'previous') header.style.display = hasVisiblePrevious ? 'block' : 'none';
            });
        });
    });

    // Action buttons
    const approveBtns = document.querySelectorAll('.approve-btn');
    approveBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.textContent = 'Approved';
            btn.style.background = '#10b981'; // Green
            btn.style.width = '100px';
            btn.disabled = true;
            
            const row = btn.closest('.notif-row');
            row.style.opacity = '0.7';
        });
    });
};

// Initialize Notifications logic
if (window.location.pathname.includes('notifications')) {
    initNotifications();
}

// Add to DOMContentLoaded as well for reliability
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('notifications')) {
        initNotifications();
    }
});

// Focus search input when header search button is clicked
document.querySelectorAll('.search-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = document.querySelector('.search-bar input');
        if (input) {
            input.focus();
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
});

// --- Expanding Header Search Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const mainHeader = document.getElementById('mainHeader');
    const openSearchBtn = document.getElementById('openSearchBtn');
    const closeSearchBtn = document.getElementById('closeSearchBtn');
    const headerSearchInput = document.getElementById('headerSearchInput');

    if (openSearchBtn && mainHeader) {
        openSearchBtn.addEventListener('click', () => {
            mainHeader.classList.add('search-active');
            setTimeout(() => {
                if (headerSearchInput) headerSearchInput.focus();
            }, 100);
        });
    }

    if (closeSearchBtn && mainHeader) {
        closeSearchBtn.addEventListener('click', () => {
            mainHeader.classList.remove('search-active');
            if (headerSearchInput) {
                headerSearchInput.value = '';
                // Trigger input event to clear results
                headerSearchInput.dispatchEvent(new Event('input'));
            }
        });
    }
});
