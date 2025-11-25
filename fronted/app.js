// Mood data
const moods = [
    { name: 'Sad', emoji: '😢', color: 'bg-blue-100 hover:bg-blue-200 border-blue-300' },
    { name: 'Happy', emoji: '😊', color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300' },
    { name: 'Anxious', emoji: '😰', color: 'bg-purple-100 hover:bg-purple-200 border-purple-300' },
    { name: 'Grateful', emoji: '🙏', color: 'bg-green-100 hover:bg-green-200 border-green-300' },
    { name: 'Lonely', emoji: '😔', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
    { name: 'Stressed', emoji: '😫', color: 'bg-red-100 hover:bg-red-200 border-red-300' },
    { name: 'Hopeful', emoji: '🌟', color: 'bg-pink-100 hover:bg-pink-200 border-pink-300' },
    { name: 'Tired', emoji: '😴', color: 'bg-gray-100 hover:bg-gray-200 border-gray-300' },
];

// API Configuration
const API_URL = 'http://localhost:3000/api/verse'; // Change this to your backend URL

let currentMood = '';

// Initialize mood buttons
function initMoodButtons() {
    const container = document.getElementById('moodButtons');
    moods.forEach(mood => {
        const button = document.createElement('button');
        button.className = `${mood.color} border-2 rounded-xl p-4 transition-all duration-200 transform hover:scale-105`;
        button.innerHTML = `
            <div class="text-3xl mb-1">${mood.emoji}</div>
            <div class="font-medium text-gray-700">${mood.name}</div>
        `;
        button.addEventListener('click', () => handleMoodSelect(mood.name, button));
        container.appendChild(button);
    });
}

// Handle mood selection
function handleMoodSelect(mood, button) {
    currentMood = mood;
    
    // Update active state
    document.querySelectorAll('#moodButtons button').forEach(btn => {
        btn.classList.remove('ring-4', 'ring-purple-300');
    });
    button.classList.add('ring-4', 'ring-purple-300');
    
    // Get verse
    getVerse(mood);
}

// Get verse from API
async function getVerse(mood) {
    // Show loading state
    document.getElementById('emptyState').classList.add('hidden');
    document.getElementById('verseDisplay').classList.add('hidden');
    document.getElementById('loadingState').classList.remove('hidden');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mood: mood })
        });

        const data = await response.json();
        
        if (data.success) {
            displayVerse(data.verse);
        } else {
            throw new Error('Failed to get verse');
        }
    } catch (error) {
        console.error('Error:', error);
        // Display fallback verse
        displayVerse({
            verse: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
            reference: "Psalm 34:18",
            message: "Remember, you are deeply loved and never alone. God is with you in every moment."
        });
    }
}

// Display verse
function displayVerse(verseData) {
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('emptyState').classList.add('hidden');
    
    const verseDisplay = document.getElementById('verseDisplay');
    document.getElementById('verseReference').textContent = verseData.reference;
    document.getElementById('verseText').textContent = `"${verseData.verse}"`;
    document.getElementById('verseMessage').textContent = verseData.message;
    
    verseDisplay.classList.remove('hidden');
    verseDisplay.classList.add('fade-in');
}

// Handle custom mood submission
function handleCustomMood() {
    const input = document.getElementById('customMood');
    const mood = input.value.trim();
    
    if (mood) {
        currentMood = mood;
        getVerse(mood);
        input.value = '';
        
        // Remove active state from mood buttons
        document.querySelectorAll('#moodButtons button').forEach(btn => {
            btn.classList.remove('ring-4', 'ring-purple-300');
        });
    }
}

// Event listeners
document.getElementById('submitCustom').addEventListener('click', handleCustomMood);
document.getElementById('customMood').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleCustomMood();
    }
});

// Initialize
initMoodButtons();