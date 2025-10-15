
maptilersdk.config.apiKey =mapToken;
const homeMarker = document.createElement('div');
homeMarker.style.width = "40px";
homeMarker.style.height = "40px";
homeMarker.style.backgroundColor = "red"; // red circle
homeMarker.style.borderRadius = "50%";
homeMarker.style.display = "flex";
homeMarker.style.alignItems = "center";
homeMarker.style.justifyContent = "center";
homeMarker.style.boxShadow = "0 0 10px rgba(255,0,0,0.6)";
homeMarker.style.cursor = "pointer";

// Add inline SVG home icon
homeMarker.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 12L12 3l9 9v9a1 1 0 0 1-1 1h-6v-6h-4v6H4a1 1 0 0 1-1-1v-9z"/>
  </svg>
`;
const map = new maptilersdk.Map({
  container: 'map', // container's id or the HTML element in which the SDK will render the map
  style: maptilersdk.MapStyle.STREETS,
  center: listing.geometry.coordinates, // starting position [lng, lat]
  zoom: 14// starting zoom
});

new maptilersdk.Marker(
  {
  // color: "red",
  element: homeMarker,
  draggable: true
}
)
  .setLngLat(listing.geometry.coordinates)//listing.geometry.coordinates
  .setPopup(new maptilersdk.Popup({offset: 25})
  .setHTML(`<h4>${listing.title}</h4> <p>Exact location will be provided after booking </p>`))
  .addTo(map);