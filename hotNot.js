// List of image file names

const imageSources = [
    'photos/u1.png', 'photos/u2.png', 'photos/u3.png', 'photos/tori.png', 'photos/stepheni.png',
    'photos/savvi.png', 'photos/nora.png', 'photos/mala.png', 'photos/lorraine.png', 'photos/lina.png',
    'photos/hanna.png', 'photos/erica.png', 'photos/dennise.png', 'photos/besma.png', 'photos/ashley.png'
];

// Initialize Elo ratings for each image
let ratings = Array(imageSources.length).fill(1000);  // Initialize all images with 1000 rating
const K = 32;  // K-factor to determine rating change sensitivity

// Store all unique pairs of images
let allPairs = [];
for (let i = 0; i < imageSources.length; i++) {
    for (let j = i + 1; j < imageSources.length; j++) {
        allPairs.push([i, j]);
    }
}

let currentPairIndex = 0;  // Track the current pair being compared
let currentImages = []; // Store the current pair of images

// Function to calculate the new Elo ratings
function updateElo(winnerIndex, loserIndex) {
    let ratingWinner = ratings[winnerIndex];
    let ratingLoser = ratings[loserIndex];

    // Calculate expected scores
    let expectedWinner = 1 / (1 + Math.pow(10, (ratingLoser - ratingWinner) / 400));
    let expectedLoser = 1 / (1 + Math.pow(10, (ratingWinner - ratingLoser) / 400));

    // Update ratings
    ratings[winnerIndex] = Math.round(ratingWinner + K * (1 - expectedWinner));
    ratings[loserIndex] = Math.round(ratingLoser + K * (0 - expectedLoser));

    // Update the displayed ratings
    document.getElementById('rating1').innerText = ratings[currentImages[0]];
    document.getElementById('rating2').innerText = ratings[currentImages[1]];
}

// Function to load the next pair of images
function loadNextPair() {
    if (currentPairIndex < allPairs.length) {
        // Get the next pair of images
        currentImages = allPairs[currentPairIndex];
        let img1Index = currentImages[0];
        let img2Index = currentImages[1];

        // Update the image sources and ratings displayed
        document.getElementById('img1').src = imageSources[img1Index];
        document.getElementById('img2').src = imageSources[img2Index];

        document.getElementById('rating1').innerText = ratings[img1Index];
        document.getElementById('rating2').innerText = ratings[img2Index];

        // Move to the next pair
        currentPairIndex++;
    } else {
        // End of comparisons
        alert('All images have been compared.');
    }
}

// Function to handle image comparison and load the next pair
function compareImages(winnerImageIndex, loserImageIndex) {
    let winnerIndex = currentImages[winnerImageIndex - 1];
    let loserIndex = currentImages[loserImageIndex - 1];
    updateElo(winnerIndex, loserIndex);

    // Load the next pair after comparison
    loadNextPair();
}

// Function to open the rankings modal
function openRankingsModal() {
    const rankingsModal = document.getElementById('rankings-modal');
    const rankingsContent = document.getElementById('rankings-list-content');
    rankingsContent.innerHTML = ''; // Clear previous rankings

    // Create an array of objects containing the index and rating
    const rankedImages = imageSources.map((src, index) => ({
        src,
        rating: ratings[index]
    }));

    // Sort the images based on ratings (higher rating first)
    rankedImages.sort((a, b) => b.rating - a.rating);

    // Populate the rankings content
    rankedImages.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image.src;
        imgElement.alt = 'Ranked Image';
        imgElement.style.width = '50px'; // Adjust size as needed
        imgElement.style.height = '50px';
        imgElement.style.borderRadius = '50%'; // Circular images

        const ratingElement = document.createElement('span');
        ratingElement.textContent = ` (${image.rating})`; // Display rating
        ratingElement.style.marginLeft = '5px'; // Space between image and rating

        const container = document.createElement('div');
        container.appendChild(imgElement);
        container.appendChild(ratingElement);

        rankingsContent.appendChild(container);
    });

    rankingsModal.style.display = 'flex'; // Show the modal
}

// Function to close the rankings modal
function closeRankingsModal() {
    const rankingsModal = document.getElementById('rankings-modal');
    rankingsModal.style.display = 'none'; // Hide the modal
}

//
Load the first pair of images when the page is loaded
window.onload = loadNextPair;
