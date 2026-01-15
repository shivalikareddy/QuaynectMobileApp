const opportunityData = {
    garden: {
        title: "Community Garden Coordinator",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=450&fit=crop",
        date: "Ongoing",
        time: "Flexible Schedule",
        location: "Waterfront Garden, Quayside",
        commitment: "4-6 hours/week",
        description: "Help manage planting schedules and coordinate volunteers for our beautiful waterfront garden. You'll work alongside passionate community members to maintain and grow our urban green space, plan seasonal plantings, and organize volunteer gardening sessions.",
        requirements: [
            "Basic gardening knowledge helpful but not required",
            "Ability to work independently and with groups",
            "Comfortable working outdoors in various weather",
            "Strong organizational and communication skills"
        ]
    },
    event: {
        title: "Event Support Volunteer",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=450&fit=crop",
        date: "Varies by Event",
        time: "Event-dependent",
        location: "Various Locations, Quayside",
        commitment: "Occasional weekends",
        description: "Assist with setup, registration, and logistics for community events. From seasonal festivals to workshops and community gatherings, you'll help create memorable experiences for residents. Perfect for those who enjoy variety and meeting new people.",
        requirements: [
            "Friendly and welcoming demeanor",
            "Able to lift and carry light equipment",
            "Available for weekend events",
            "Comfortable with event technology and registration tools"
        ]
    },
    cleanup: {
        title: "Waterfront Cleanup Lead",
        image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=450&fit=crop",
        date: "Last Saturday of Month",
        time: "9:00 AM - 12:00 PM",
        location: "Parliament Slip, Quayside",
        commitment: "Monthly",
        description: "Organize and lead monthly cleanup drives along the harbor. Help keep our beautiful waterfront clean and thriving by removing litter and maintaining naturalized areas. It's a great way to give back to the community while enjoying the outdoors.",
        requirements: [
            "Comfortable clothing and sturdy shoes recommended",
            "Leadership or coordination experience helpful",
            "All ages welcome (under 14 with guardian)",
            "Tools, gloves, and bags provided"
        ]
    }
};

function showDetails(type) {
    const data = opportunityData[type];
    const modal = document.getElementById('detailsModal');
    
    // Populate modal content
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalImage').src = data.image;
    document.getElementById('modalDescription').textContent = data.description;
    
    // Populate info grid
    const infoGrid = document.getElementById('modalInfo');
    infoGrid.innerHTML = `
        <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 flex flex-col items-center text-center">
            <ion-icon name="calendar-outline" class="text-2xl text-primary mb-2"></ion-icon>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">Date & Time</p>
            <p class="text-sm font-semibold text-slate-900 dark:text-white leading-tight">${data.date}</p>
            <p class="text-xs text-slate-600 dark:text-slate-400 mt-0.5">${data.time}</p>
        </div>
        <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 flex flex-col items-center text-center">
            <ion-icon name="location-outline" class="text-2xl text-primary mb-2"></ion-icon>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">Location</p>
            <p class="text-sm font-semibold text-slate-900 dark:text-white leading-tight">${data.location}</p>
        </div>
        <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 flex flex-col items-center text-center">
            <ion-icon name="time-outline" class="text-2xl text-primary mb-2"></ion-icon>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">Commitment</p>
            <p class="text-sm font-semibold text-slate-900 dark:text-white leading-tight">${data.commitment}</p>
        </div>
    `;
    
    // Populate requirements
    const requirementsList = document.getElementById('modalRequirements');
    requirementsList.innerHTML = data.requirements.map(req => `
        <li class="flex items-start gap-3">
            <div class="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-600 flex-shrink-0"></div>
            <p class="text-[15px] text-slate-600 dark:text-zinc-300">${req}</p>
        </li>
    `).join('');
    
    // Prevent scroll jump by calculating scrollbar width
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = scrollbarWidth + 'px';
    document.body.style.overflow = 'hidden';
    
    // Show modal
    modal.classList.remove('hidden');
}

function closeDetails() {
    const modal = document.getElementById('detailsModal');
    const modalSheet = document.getElementById('modalSheet');
    modalSheet.style.transform = '';
    modalSheet.style.transition = 'transform 0.3s';
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
}

// Handle drag to close functionality
let startY = 0;
let currentY = 0;
let isDragging = false;

const modalHandle = document.getElementById('modalHandle');
const modalSheet = document.getElementById('modalSheet');

modalHandle.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
    isDragging = true;
    modalSheet.style.transition = 'none';
});

modalHandle.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    
    // Only allow dragging down
    if (diff > 0) {
        modalSheet.style.transform = `translateY(${diff}px)`;
    }
});

modalHandle.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    
    isDragging = false;
    const diff = currentY - startY;
    
    modalSheet.style.transition = 'transform 0.3s';
    
    // Close if dragged down more than 150px
    if (diff > 150) {
        closeDetails();
    } else {
        // Snap back to original position
        modalSheet.style.transform = 'translateY(0)';
    }
});

// Also support mouse dragging for desktop
modalHandle.addEventListener('mousedown', (e) => {
    startY = e.clientY;
    isDragging = true;
    modalSheet.style.transition = 'none';
    e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    currentY = e.clientY;
    const diff = currentY - startY;
    
    if (diff > 0) {
        modalSheet.style.transform = `translateY(${diff}px)`;
    }
});

document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    
    isDragging = false;
    const diff = currentY - startY;
    
    modalSheet.style.transition = 'transform 0.3s';
    
    if (diff > 150) {
        closeDetails();
    } else {
        modalSheet.style.transform = 'translateY(0)';
    }
});

// Sign up functionality with loading and confetti
function signUpVolunteer() {
    const signUpModal = document.getElementById('signUpModal');
    const loadingState = document.getElementById('loadingState');
    const successState = document.getElementById('successState');
    
    // Show modal with loading state
    signUpModal.classList.remove('hidden');
    signUpModal.classList.add('flex');
    loadingState.classList.remove('hidden');
    successState.classList.add('hidden');
    
    // Simulate API call - show success after 2 seconds
    setTimeout(() => {
        loadingState.classList.add('hidden');
        successState.classList.remove('hidden');
        
        // Trigger confetti
        launchConfetti();
    }, 2000);
}

function closeSignUpModal() {
    const signUpModal = document.getElementById('signUpModal');
    signUpModal.classList.add('hidden');
    signUpModal.classList.remove('flex');
}

// Confetti animation
function launchConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.remove('hidden');
    
    const confettiCount = 150;
    const confetti = [];
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    
    // Create confetti particles
    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            r: Math.random() * 6 + 4,
            dx: (Math.random() - 0.5) * 8,
            dy: (Math.random() - 0.5) * 8 - 5,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            gravity: 0.3,
            opacity: 1
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let activeConfetti = 0;
        
        confetti.forEach((c, index) => {
            if (c.opacity <= 0) return;
            
            activeConfetti++;
            
            ctx.save();
            ctx.globalAlpha = c.opacity;
            ctx.translate(c.x, c.y);
            ctx.rotate((c.rotation * Math.PI) / 180);
            ctx.fillStyle = c.color;
            ctx.fillRect(-c.r / 2, -c.r / 2, c.r, c.r);
            ctx.restore();
            
            // Update position
            c.x += c.dx;
            c.y += c.dy;
            c.dy += c.gravity;
            c.rotation += c.rotationSpeed;
            
            // Fade out when falling
            if (c.y > canvas.height / 2) {
                c.opacity -= 0.01;
            }
        });
        
        if (activeConfetti > 0) {
            requestAnimationFrame(animate);
        } else {
            canvas.classList.add('hidden');
        }
    }
    
    animate();
}
