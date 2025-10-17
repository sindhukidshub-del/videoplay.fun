// Global variables
let allVideos = [];
let newVideos = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'index.html' || currentPage === '' || currentPage === '/') {
        loadHomePage();
    } else if (currentPage === 'video.html') {
        loadVideoPage();
    }

    // Add event listeners for modals
    setupModalEvents();
});

// Home page functionality
async function loadHomePage() {
    showLoading(true);
    
    try {
        // Load videos from JSON file
        const response = await fetch('videos.json');
        const data = await response.json();
        allVideos = data.videos;
        
        // Get latest 4 videos as new videos
        newVideos = allVideos.slice(0, 4);
        
        displayNewVideos(newVideos);
        displayAllVideos(allVideos);
        
    } catch (error) {
        console.error('Error loading videos:', error);
        showError('Failed to load videos. Please try again later.');
    } finally {
        showLoading(false);
    }
}

// Display new videos in the featured section
function displayNewVideos(videos) {
    const newVideosGrid = document.getElementById('newVideosGrid');
    
    if (!newVideosGrid) return;
    
    if (videos.length === 0) {
        newVideosGrid.innerHTML = '<p class="no-videos">No new videos available.</p>';
        return;
    }
    
    newVideosGrid.innerHTML = videos.map(video => `
        <div class="new-video-card video-card" onclick="openVideo(${video.id})">
            <div class="new-badge">NEW</div>
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjdmYWZjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk0YTBhYiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5FVyBWaWRlbzwvdGV4dD48L3N2Zz4='">
                <div class="video-duration">${video.duration}</div>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <p class="video-description">${video.description}</p>
            </div>
        </div>
    `).join('');
}

// Display all videos in the main grid
function displayAllVideos(videos) {
    const videoGrid = document.getElementById('videoGrid');
    
    if (!videoGrid) return;
    
    if (videos.length === 0) {
        videoGrid.innerHTML = '<p class="no-videos">No videos found. Please try a different search.</p>';
        return;
    }
    
    videoGrid.innerHTML = videos.map(video => `
        <div class="video-card" onclick="openVideo(${video.id})">
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjdmYWZjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk0YTBhYiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlZpZGVvIFRodW1ibmFpbDwvdGV4dD48L3N2Zz4='">
                <div class="video-duration">${video.duration}</div>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <p class="video-description">${video.description}</p>
            </div>
        </div>
    `).join('');
}

// Search functionality
function searchVideos() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (searchTerm === '') {
        displayAllVideos(allVideos);
        return;
    }
    
    const filteredVideos = allVideos.filter(video => 
        video.title.toLowerCase().includes(searchTerm) ||
        video.description.toLowerCase().includes(searchTerm) ||
        (video.category && video.category.toLowerCase().includes(searchTerm))
    );
    
    displayAllVideos(filteredVideos);
}

// Open video in new page
function openVideo(videoId) {
    window.location.href = `video.html?id=${videoId}`;
}

// Video page functionality (unchanged from previous)
async function loadVideoPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentVideoId = parseInt(urlParams.get('id'));
    
    if (!currentVideoId) {
        window.location.href = 'index.html';
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch('videos.json');
        const data = await response.json();
        allVideos = data.videos;
        
        const currentVideo = allVideos.find(video => video.id === currentVideoId);
        
        if (!currentVideo) {
            window.location.href = 'index.html';
            return;
        }
        
        // Set current video
        document.getElementById('mainVideoPlayer').src = currentVideo.videoUrl;
        document.getElementById('videoTitle').textContent = currentVideo.title;
        document.getElementById('videoDescription').textContent = currentVideo.description;
        
        // Load related videos (excluding current video)
        const relatedVideos = allVideos.filter(video => 
            video.id !== currentVideoId && 
            video.category === currentVideo.category
        ).slice(0, 4);
        
        displayRelatedVideos(relatedVideos);
        
    } catch (error) {
        console.error('Error loading video:', error);
        showError('Failed to load video. Please try again.');
    } finally {
        showLoading(false);
    }
}

// Display related videos
function displayRelatedVideos(videos) {
    const relatedGrid = document.getElementById('relatedVideos');
    
    if (!relatedGrid) return;
    
    if (videos.length === 0) {
        relatedGrid.innerHTML = '<p>No related videos found.</p>';
        return;
    }
    
    relatedGrid.innerHTML = videos.map(video => `
        <div class="video-card" onclick="openVideo(${video.id})">
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjdmYWZjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk0YTBhYiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlZpZGVvIFRodW1ibmFpbDwvdGV4dD48L3N2Zz4='">
                <div class="video-duration">${video.duration}</div>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
            </div>
        </div>
    `).join('');
}

// Modal Functions
function setupModalEvents() {
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                closeModal();
            }
        });
    });

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for subscribing to VideoPlay.fun!');
            this.reset();
        });
    }

    // Contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
            closeModal();
        });
    }

    // Subscribe form submission
    const subscribeForm = document.querySelector('.subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for subscribing to VideoPlay.fun updates!');
            this.reset();
            closeModal();
        });
    }
}

function showPrivacyPolicy() {
    document.getElementById('policyModal').style.display = 'block';
}

function showTerms() {
    document.getElementById('termsModal').style.display = 'block';
}

function showContact() {
    document.getElementById('contactModal').style.display = 'block';
}

function showSubscribeForm() {
    document.getElementById('subscribeModal').style.display = 'block';
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// Utility functions
function showLoading(show) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.classList.toggle('show', show);
    }
}

function showError(message) {
    const videoGrid = document.getElementById('videoGrid');
    if (videoGrid) {
        videoGrid.innerHTML = `<div class="error-message"><p>${message}</p></div>`;
    }
}

// Add search on Enter key
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchVideos();
            }
        });
    }
});
