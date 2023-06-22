function initMap() {
    var options = {
        zoom:2,
        center: { lat: 40.781369, lng: -73.966315 }
    }

    var map = new
    google.maps.Map(document.getElementById('map'), options);
}

const btnGenerateRoutes = document.querySelector("#btnGenerateRoutes");

btnGenerateRoutes.addEventListener("click",function(e) {
    e.preventDefault();

    const ipDepartureAdress = document.querySelector("#ipDepartureAdress");
    var departureAdress = ipDepartureAdress.value;

    generateCoordinates(departureAdress);

    console.log(departureAdress);
});


function generateCoordinates(inputAddress) {
  const address = inputAddress;
  const apiKey = "AIzaSyCMekkkZ9oy-zoKC5WUQq6ws2d6pQV9Yk4";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;

  fetch(url)
  .then(response => response.json())
  .then(data => {
    if (data.status === 'OK') {
      const latitude = data.results[0].geometry.location.lat;
      const longitude = data.results[0].geometry.location.lng;
      console.log(`Latitude: ${latitude}`);
      console.log(`Longitude: ${longitude}`);
    }
  })
  .catch(error => {
    console.error("Ocorreu um erro ao obter as coordenadas:", error);
  });
}