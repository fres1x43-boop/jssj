// Initialize Telegram WebApp
Telegram.WebApp.ready();
Telegram.WebApp.expand();

// DOM Elements
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const userId = document.getElementById('user-id');
const starBalance = document.getElementById('star-balance');
const topupButton = document.getElementById('topup-button');

// Load user data
function initUserData() {
    const user = Telegram.WebApp.initDataUnsafe.user;
    
    if (user) {
        // Display profile
        if (user.photo_url) {
            userAvatar.src = user.photo_url;
        }
        userName.textContent = `${user.first_name} ${user.last_name || ''}`;
        userId.textContent = `ID: ${user.id}`;
        
        // Load balance (in real app, fetch from backend)
        starBalance.textContent = localStorage.getItem(`stars_${user.id}`) || '0';
    }
    
    // Setup payment button
    topupButton.addEventListener('click', initiatePayment);
}

// Payment handler
function initiatePayment() {
    const user = Telegram.WebApp.initDataUnsafe.user;
    
    Telegram.WebApp.openInvoice(
        {
            title: "Star Top-Up",
            description: "Add 20 stars to your balance",
            currency: "USD",
            prices: [{ label: "20 Stars", amount: "2000" }], // $20.00
            payload: `star_topup_${user.id}_${Date.now()}`
        },
        function(status) {
            if (status === 'paid') {
                // Update balance locally (in real app, verify with backend)
                const current = parseInt(localStorage.getItem(`stars_${user.id}`)) || 0;
                localStorage.setItem(`stars_${user.id}`, current + 20);
                starBalance.textContent = current + 20;
                
                // Notify user
                Telegram.WebApp.showAlert("✅ 20 stars added to your balance!");
            }
        }
    );
}

// Initialize
document.addEventListener('DOMContentLoaded', initUserData);
