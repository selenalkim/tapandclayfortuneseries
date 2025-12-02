let allFortunes = [];
// --- CONFIGURATION: PUT YOUR ETSY/SHOP LINK HERE ---
const SHOP_URL = "https://www.etsy.com/shop/TapAndClay"; 

async function loadData() {
    try {
        const response = await fetch('fortunes.json');
        allFortunes = await response.json();
        checkDailyStatus();
    } catch (error) {
        console.error("Error loading fortunes:", error);
    }
}

function checkDailyStatus() {
    const today = new Date().toLocaleDateString();
    const lastVisitDate = localStorage.getItem('tapClayDate');
    const storedFortuneId = localStorage.getItem('tapClayFortuneId');

    // If user already visited today, show the same fortune and switch button to shop
    if (lastVisitDate === today && storedFortuneId) {
        const savedFortune = allFortunes.find(f => f.id == storedFortuneId);
        if (savedFortune) {
            displayFortune(savedFortune);
            switchToShopMode(); 
        }
    }
}

function handleMainButton() {
    const btn = document.getElementById('main-btn');
    
    // If button is red (Shop Mode), go to website
    if (btn.classList.contains('shop-mode')) {
        window.location.href = SHOP_URL;
        return;
    }

    // Otherwise, crack the cookie
    revealNewFortune();
}

function revealNewFortune() {
    if (allFortunes.length === 0) return;

    // 1. Pick random fortune
    const randomIndex = Math.floor(Math.random() * allFortunes.length);
    const fortune = allFortunes[randomIndex];

    // 2. Save today's date and the fortune ID
    const today = new Date().toLocaleDateString();
    localStorage.setItem('tapClayDate', today);
    localStorage.setItem('tapClayFortuneId', fortune.id);

    // 3. Display
    displayFortune(fortune);
    switchToShopMode();
}

function displayFortune(fortune) {
    const textEl = document.getElementById('fortune-text');
    const badgeEl = document.getElementById('category-badge');
    const cardEl = document.getElementById('card');
    
    // Update Text
    textEl.innerText = fortune.text;
    badgeEl.innerText = fortune.category;
    badgeEl.className = 'badge ' + fortune.category;

    // Reset Animation
    cardEl.classList.remove('fade-in');
    void cardEl.offsetWidth; 
    cardEl.classList.add('fade-in');

    // Show Share Buttons
    document.getElementById('share-container').classList.remove('hidden');

    // Update WhatsApp Link
    const waMsg = encodeURIComponent(`My Tap & Clay fortune today: "${fortune.text}" 🥠✨`);
    document.getElementById('whatsapp-btn').href = `https://wa.me/?text=${waMsg}`;
}

function switchToShopMode() {
    const btn = document.getElementById('main-btn');
    const msg = document.getElementById('timer-msg');

    // Change Button Text and Style
    btn.innerText = "Visit our website for more 🛍️";
    btn.classList.add('shop-mode');
    
    // Show the "Come back tomorrow" text
    msg.classList.remove('hidden');
}

// --- SHARING FUNCTIONS ---
async function shareNative() {
    const textEl = document.getElementById('fortune-text').innerText;
    const shareData = {
        title: 'Tap & Clay Fortune',
        text: `I just tapped my fortune cookie: "${textEl}"`,
        url: window.location.href
    };

    // Use Native Share (Instagram Stories/Messages/etc)
    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.log('Error sharing:', err);
        }
    } else {
        // Fallback for Desktop
        navigator.clipboard.writeText(`"${textEl}" - Read yours at Tap & Clay!`);
        alert("Fortune copied to clipboard!");
    }
}

// Initialize App
loadData();