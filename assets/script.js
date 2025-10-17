// Global variables
let allVideos = [];
let newVideos = [];

// Cache busting function - GitHub Pages auto update ke liye
function addCacheBusting(url) {
    const timestamp = new Date().getTime();
    return url + '?v=' + timestamp;
}

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
        // Load videos from JSON file WITH CACHE BUSTING
        const response = await fetch(addCacheBusting('videos.json'));
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
                <img src="${addCacheBusting(video.thumbnail)}" alt="${video.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjdmYWZjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk0YTBhYiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5FVyBWaWRlbzwvdGV4dD48L3N2Zz4='">
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
                <img src="${addCacheBusting(video.thumbnail)}" alt="${video.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjdmYWZjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk0YTBhYiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlZpZGVvIFRodW1ibmFpbDwvdGV4dD48L3N2Zz4='">
                <div class="video-duration">${video.duration}</div>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <p class="video-description">${video.description}</p>
            </div>
        </div>
    `).join('');
}

// Video page functionality
async function loadVideoPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentVideoId = parseInt(urlParams.get('id'));
    
    if (!currentVideoId) {
        window.location.href = 'index.html';
        return;
    }
    
    showLoading(true);
    
    try {
        // Load videos WITH CACHE BUSTING
        const response = await fetch(addCacheBusting('videos.json'));
        const data = await response.json();
        allVideos = data.videos;
        
        const currentVideo = allVideos.find(video => video.id === currentVideoId);
        
        if (!currentVideo) {
            window.location.href = 'index.html';
            return;
        }
        
        // Set current video
        const videoPlayer = document.getElementById('mainVideoPlayer');
        videoPlayer.src = currentVideo.videoUrl;
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
                <img src="${addCacheBusting(video.thumbnail)}" alt="${video.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjdmYWZjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk0YTBhYiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlZpZGVvIFRodW1ibmFpbDwvdGV4dD48L3N2Zz4='">
                <div class="video-duration">${video.duration}</div>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
            </div>
        </div>
    `).join('');
}

// Rest of the code remains same as before...
// (Modal functions, utility functions, etc.)
