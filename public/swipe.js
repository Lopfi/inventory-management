let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

const gestureZone = document.getElementById('content-wrapper');

gestureZone.addEventListener('touchstart', function(event) {
    console.log("lol1");
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}, false);

gestureZone.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesture();
}, false);

console.log("lol4");

function handleGesture() {
    console.log("lol");
    if (touchendX > touchstartX) {
        setPage("items-page");
    }

    if (touchendX < touchstartX) {
        setPage("locations-page");
    }

}