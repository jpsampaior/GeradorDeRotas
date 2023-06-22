function initMap() {
    var options = {
        zoom:2,
        center: { lat: 40.781369, lng: -73.966315 }
    }

    var map = new
    google.maps.Map(document.getElementById('map'), options);
}