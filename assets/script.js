// Global variables
let allVideos = [];
let currentVideoId = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'index.html' || currentPage === '' || currentPage === '/') {
        loadHomePage();
    } else if (currentPage === 'video.html') {
        loadVideoPage();
    }
});

// Home page functionality
async function loadHomePage() {
    showLoading(true);
    
    try {
        // Load videos from JSON file
        const response = await fetch('videos.json');
        allVideos = await response.json();
        
        displayVideos(allVideos.videos);
    } catch (error) {
        console.error('Error loading videos:', error);
        document.getElementById('videoGrid').innerHTML = `
            <div class="error-message">
                <p>Failed to load videos. Please try again later.</p>
            </div>
        `;
    } finally {
        showLoading(false);
    }
}

// Display videos in grid
function displayVideos(videos) {
    const videoGrid = document.getElementById('videoGrid');
    
    if (videos.length === 0) {
        videoGrid.innerHTML = `
            <div class="no-videos">
                <p>No videos found. Please try a different search.</p>
            </div>
        `;
        return;
    }
    
    videoGrid.innerHTML = videos.map(video => `
        <div class="video-card" onclick="openVideo(${video.id})">
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjdmYWZjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk0YTBhYiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlZpZGVvIFRodW1ibmFpbDwvdGV4dD48L3N2Zz4='">
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
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (searchTerm === '') {
        displayVideos(allVideos.videos);
        return;
    }
    
    const filteredVideos = allVideos.videos.filter(video => 
        video.title.toLowerCase().includes(searchTerm) ||
        video.description.toLowerCase().includes(searchTerm) ||
        video.category.toLowerCase().includes(searchTerm)
    );
    
    displayVideos(filteredVideos);
}

// Open video in new page
function openVideo(videoId) {
    window.location.href = `video.html?id=${videoId}`;
}

// Video page functionality
async function loadVideoPage() {
    const urlParams = new URLSearchParams(window.location.search);
    currentVideoId = parseInt(urlParams.get('id'));
    
    if (!currentVideoId) {
        window.location.href = 'index.html';
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch('videos.json');
        allVideos = await response.json();
        
        const currentVideo = allVideos.videos.find(video => video.id === currentVideoId);
        
        if (!currentVideo) {
            window.location.href = 'index.html';
            return;
        }
        
        // Set current video
        document.getElementById('mainVideoPlayer').src = currentVideo.videoUrl;
        document.getElementById('videoTitle').textContent = currentVideo.title;
        document.getElementById('videoDescription').textContent = currentVideo.description;
        
        // Load related videos (excluding current video)
        const relatedVideos = allVideos.videos.filter(video => 
            video.id !== currentVideoId && video.category === currentVideo.category
        ).slice(0, 4);
        
        displayRelatedVideos(relatedVideos);
        
    } catch (error) {
        console.error('Error loading video:', error);
    } finally {
        showLoading(false);
    }
}

// Display related videos
function displayRelatedVideos(videos) {
    const relatedGrid = document.getElementById('relatedVideos');
    
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

// Utility functions
function showLoading(show) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.classList.toggle('show', show);
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
