const apiUrl =
  "https://v5.bvg.transport.rest/stops/900000100516/departures?duration=80";
  
// 900000100014
const nycDestinations = [] // ["Leopoldplatz", "Leopoldplatz", "Stadtmitte"]; // Add NYC bus destinations
const klDestinations = ["Ostbahnhof", "Schöneweide", "Köpenick"]; // Add KL bus destinations

async function fetchBusTimes() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("An error occurred while fetching bus times");
    }
    const data = await response.json();
    displayBusTimes(data);
  } catch (error) {
    console.error("Error fetching bus times:", error);
  }
}

function displayBusTimes(busTimes) {
  const nycContainer = document.getElementById("nyc");
  const klContainer = document.getElementById("kl");
  nycContainer.innerHTML = ""
  klContainer.innerHTML = ""

  let displayed = 0;
  busTimes.forEach((bus) => {
    if (displayed === 5) {
        return;
    }
    const currentTime = new Date();
    const departureTime = new Date(bus.when);
    const remainingMinutes = Math.round((departureTime - currentTime) / 60000);

    if (remainingMinutes < 1) {
        return;
    }

    let direction = bus.direction || "Unknown direction";
    let container;

    if (bus.line.product === "subway" && bus.line.name === "U2") {
      return;
      if (bus.platform === "1") {
        direction = "NYC";
        container = nycContainer;
      } else if (bus.platform === "2") {
        direction = "KL";
        container = klContainer;
      } else {
        console.log(bus.platform);
        return; // Skip the entry if the platform is not "1" or "2"
      }
    } else if (nycDestinations.some((substring) => bus.direction.includes(substring))) {
      container = nycContainer;
    } else if (klDestinations.some((substring) => bus.direction.includes(substring))) {
      container = klContainer;
    } else {
      console.log(bus.direction);
      return; // Skip the entry if the destination is not in the hardcoded lists
    }

    displayed += 1

    const busInfo = document.createElement("p");
    busInfo.textContent = `${remainingMinutes}`;
    container.appendChild(busInfo);
  });
}

function refreshData() {
  fetchBusTimes();
  setTimeout(refreshData, 30000);
}

refreshData();
