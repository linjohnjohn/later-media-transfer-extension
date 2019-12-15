const video = document.querySelector('.video-stream.html5-main-video');

console.log('hi');
chrome.storage.local.get('mirrored', function(data) {
    if (data.mirrored) {
        setInterval(() => {
            video.style.transform = 'rotateY(180deg)';
        }, 1000);
    }
})