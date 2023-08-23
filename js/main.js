let map;

async function initMap() {
  // The location of Biodome Montreal
  const position = { lat: 45.5158679, lng: -73.6761228 };
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The map settings
  map = new Map(document.getElementById("map"), {
    zoom: 16,
    center: position,
    mapId: "DEMO_MAP_ID",
  });

  // The marker, positioned at Vanier
  const marker = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: "Vanier College",
  });

  //showing marked destination
  const markDestination = document.getElementById("destination");
  markDestination.textContent = `Marked destination is : ${marker.title}`;

  const directionsRenderer = new google.maps.DirectionsRenderer();
  const directionsService = new google.maps.DirectionsService();

  directionsRenderer.setMap(map);
  calculateAndDisplayRoute(directionsService, directionsRenderer);
  document.getElementById("mode").addEventListener("change", () => {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  });
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  const selectedMode = document.getElementById("mode").value;

  function success(pos) {
    const crd = pos.coords;

    directionsService
      .route({
        //place the origin from your own location using geo location function
        origin: { lat: crd.latitude, lng: crd.longitude },
        //add marked destination which is Vanier College for this coordinates
        destination: { lat: 45.5158679, lng: -73.6761228 },
        //using google maps travel mode function to select the travel mode
        travelMode: google.maps.TravelMode[selectedMode],
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      })
      .catch((status) =>
        window.alert("Directions request failed due to " + status)
      );
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error);
}
