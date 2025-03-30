const search_form = document.querySelector(".header_form");
search_form.addEventListener("submit", (event) => {
	event.preventDefault();
	const value = document.querySelector("#search").value;
	search_Ip_Address(value);
})

async function search_Ip_Address(ip_address) {
	const api_key = import.meta.env.VITE_API_KEY;
	const request = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${api_key}&ipAddress=${ip_address}`);
	const response = await request.json();
	const { location, ip, isp } = response;
	update_ui(ip, location.city, location.timezone, isp)

	if (map !== undefined && map !== null) {
		map.remove()
	}
	create_map(location.lat, location.lng, location.country, location.region)
}

let map;
function create_map(lat, lng, country, region) {
	map = L.map('map').setView([lat, lng], 14);
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 20,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	const my_icon = L.icon({
		iconUrl: '/images/icon-location.svg',
		iconSize: [40, 60],
		iconAnchor: [22, 94],
		popupAnchor: [-3, -76],

	})
	L.marker([lat, lng], { icon: my_icon }).addTo(map)
		.bindPopup(`${region}, ${country}`)
		.openPopup();
}

function update_ui(ip_address, location, timezone, isp) {
	const address = document.querySelector(".address");
	const city = document.querySelector(".location");
	const utc = document.querySelector(".utc");
	const isprovider = document.querySelector(".isp");

	address.textContent = ip_address;
	city.textContent = location;
	utc.textContent = 'UTC' + timezone;
	isprovider.textContent = isp;
}

const defaultIp = "26.37.52.179";
search_Ip_Address(defaultIp)