document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector('form[role="search"]');
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var searchTerm = form.querySelector('input[type="search"]').value.trim();
    console.log("Search term:", searchTerm); // Debugging log
    if (searchTerm !== "") {
      fetchWeatherData(searchTerm);
    //   fetchForecastData(searchTerm);
    } else {
      alert("Please enter a city name.");
    }
  });

  var addToFavoriteBtn = document.getElementById("addToFavoriteBtn");
  addToFavoriteBtn.addEventListener("click", function () {
    var weatherInfo = document.getElementById("weatherInfo").innerHTML;
    console.log("Weather info:", weatherInfo); // Debugging log
    localStorage.setItem("favoriteWeather", weatherInfo);
    alert("Weather added to favorites!");
  });

  var favoriteWeather = localStorage.getItem("favoriteWeather");
  if (favoriteWeather) {
    console.log("Favorite weather:", favoriteWeather); // Debugging log
    document.getElementById("weatherInfo").innerHTML = favoriteWeather;
  }
});

function fetchWeatherData(city) {
  var apiKey = "0bcc93536226014de2b799082c16e39d";
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiKey;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      displayWeatherInfo(data);
    })
    .catch((error) => {
      console.error("There was a problem fetching the weather data:", error);
      alert("There was a problem fetching the weather data. Please try again.");
    });
}

// function fetchForecastData(city) {
    
// }

// function fetchWeatherData(city) {
//     var apiKey = '0bcc93536226014de2b799082c16e39d';
//     var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;

    //     
// }

// function fetchForecastData(city) {
//     var apiKey = '0bcc93536226014de2b799082c16e39d';
//     var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey;

//     fetch(apiUrl)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             displayForecastInfo(data);
//         })
//         .catch(error => {
//             console.error('There was a problem fetching the forecast data:', error);
//             alert('There was a problem fetching the forecast data. Please try again.');
//         });
// }





function displayWeatherInfo(data) {
  var weatherInfo = document.getElementById("weatherInfo");
  console.log(data.coord.lat)
  console.log(data.coord.lon)
  var lat = data.coord.lat 
  var lon = data.coord.lon 
  displayForecastInfo(lat,lon)

  document.getElementById("forecastInfo").classList.remove("d-none");
  document.getElementById("weatherInfo").classList.remove("d-none");
  weatherInfo.innerHTML = `
  <div class="d-flex flex-column justify-content-center align-items-center">
  <span class="text-align-center">
      <!-- Add your logo here -->
      <h2>${data.name}, ${data.sys.country}</h2>
  </span>
  <span class="mt-5">
      <div class="row">
          <div class="col">
              <p>Wind Speed: ${data.wind.speed} m/s</p>
          </div>
          <div class="col">
              <p>Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
          </div>
          <div class="col">
              <p>Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
          </div>
      </div>
      <div class="row">
          <div class="col">
              <p>Min Temperature: ${Math.round(data.main.temp_min - 273.15)}°C</p>
          </div>
          <div class="col">
              <p>Max Temperature: ${Math.round(data.main.temp_max - 273.15)}°C</p>
          </div>
          <div class="col">
              <p>Humidity: ${data.main.humidity}%</p>
          </div>
      </div>
      <div class="row">
          <div class="col">
              <p>Coordinates: [${data.coord.lat}, ${data.coord.lon}]</p>
          </div>
          <div class="col">
              <p>Weather Description: ${data.weather[0].description}</p>
          </div>
          <div class="col">
              <p>Current Temperature: ${Math.round(data.main.temp - 273.15)}°C</p>
          </div>
      </div>
  </span>

  <button id="favoriteBtn" class="mt-2 btn btn-primary">Favorite</button>
</div>

    `;

     // Add event listener to the newly created button
  document.getElementById("favoriteBtn").addEventListener("click", function() {
    addFavoriteLocation(data);
  });
}

function addFavoriteLocation(data) {
    // Retrieve existing favorites from localStorage, or initialize an empty array if none
    var existingFavorites = JSON.parse(localStorage.getItem("favLocations")) || [];
  
    console.log("Existing favorites before adding new one:", existingFavorites);
  
     // Prepare the new favorite location data
     var newFavorite = {
        name: data.name,
        country: data.sys.country,
        coord: data.coord,
        weather: {
          description: data.weather[0].description,
          temperature: Math.round(data.main.temp - 273.15),
          minTemperature: Math.round(data.main.temp_min - 273.15),
          maxTemperature: Math.round(data.main.temp_max - 273.15),
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
          sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString()
        }
      };
  
    // Check if the new favorite already exists in the list
    var isExisting = existingFavorites.some(fav => fav.name === newFavorite.name && fav.country === newFavorite.country);
  
    if (!isExisting) {
      // Add the new favorite to the existing list
      existingFavorites.push(newFavorite);
  
      // Save the updated list of favorites to localStorage
      localStorage.setItem("favLocations", JSON.stringify(existingFavorites));
  
      console.log("New favorite added:", newFavorite);
      alert(`${newFavorite.name}, ${newFavorite.country} has been added to favorites.`);
    } else {
      console.log("This location is already in favorites.");
      alert(`${newFavorite.name}, ${newFavorite.country} is already in your favorites.`);
    }
  
    console.log("Updated favorites list:", existingFavorites);
  }
  
  function displayFavoriteLocations() {
    // Retrieve the list of favorite locations from localStorage
    var favorites = JSON.parse(localStorage.getItem("favLocations")) || [];
  
    console.log("Retrieved favorites from localStorage:", favorites);
  
    // Get the HTML element where favorites should be displayed
    var favoritesList = document.getElementById("favoritesList");
    favoritesList.innerHTML = ''; // Clear existing items
  
    // Check if there are favorites to display
    if (favorites.length === 0) {
      favoritesList.innerHTML = '<li class="list-group-item">No favorites added yet.</li>';
      return;
    }
  
    // Iterate over each favorite location and add it to the list
    favorites.forEach(function(fav, index) {
      var item = document.createElement("li");
      item.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
  
      // Display name and country with coordinates as a title for more info
      console.log(fav)
      console.log(index)
            // Display name and country with coordinates as a title for more info
            item.innerHTML = `
            <span title="Coordinates: Lat ${fav.coord.lat}, Lon ${fav.coord.lon}">${fav.name}, ${fav.country}</span>
            <div>
              <div class="d-flex flex-row gap-3 justify-content-end">
                <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#${index}notes">Change name</button>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#${index}details">See more details</button>
                <button type="button" class="btn btn-danger btn-sm" onclick="removeFavorite(${index})">Remove</button>

              </div>
              <!-- Modal -->
<div class="modal fade" id="${index}details" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">${fav.name}, ${fav.country}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <p>Description: ${fav.weather.description}</p>
      <p>Temperature: ${fav.weather.temperature}°C</p>
      <p>Min Temperature: ${fav.weather.minTemperature}°C</p>
      <p>Max Temperature: ${fav.weather.maxTemperature}°C</p>
      <p>Humidity: ${fav.weather.humidity}%</p>
      <p>Wind Speed: ${fav.weather.windSpeed} m/s</p>
      <p>Sunrise: ${fav.weather.sunrise}</p>
      <p>Sunset: ${fav.weather.sunset}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

              <!-- Modal -->
              <div class="modal fade" id="${index}notes" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">${fav.name}, ${fav.country}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form>
                      <div class="mb-3">
                        <label for="message-text" class="col-form-label">Change name:</label>
                        <textarea class="form-control"  id="message-text-${index}"></textarea>
                      </div>
                    </form>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" onclick="changeName(${index})" class="btn btn-primary">Save</button>
                  </div>
                </div>
              </div>
            </div>

            </div>
          `;
      
    
  
      favoritesList.appendChild(item);
    });
  
    console.log("Favorites displayed on the page.");
  }
    
displayFavoriteLocations() 

function changeName(index) {
    var newName = document.getElementById(`message-text-${index}`).value;
    if (newName !== null && newName.trim() !== "") {
        // Retrieve existing favorites from localStorage
        var favorites = JSON.parse(localStorage.getItem("favLocations")) || [];

        // Store the original name before updating
        favorites[index].oldName = favorites[index].name;
        
        // Update the name for the corresponding favorite
        favorites[index].name = newName;
        
        // Save the updated list of favorites to localStorage
        localStorage.setItem("favLocations", JSON.stringify(favorites));
        
        // Update the modal title
        var modalTitle = document.getElementById(`${index}notes`).querySelector(".modal-title");
        modalTitle.textContent = `${newName}, ${favorites[index].country} (${favorites[index].oldName})`;
        
        console.log("Name updated for favorite index:", index);
    }
}



function removeFavorite(index) {
    // Retrieve the current list of favorites from localStorage
    var favorites = JSON.parse(localStorage.getItem("favLocations")) || [];
    
    // Remove the favorite at the specified index
    favorites.splice(index, 1);
    
    // Update the favorites in localStorage
    localStorage.setItem("favLocations", JSON.stringify(favorites));
    
    // Refresh the displayed favorites
    displayFavoriteLocations();
  }

function displayForecastInfo(lon,lat){
    var url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=0bcc93536226014de2b799082c16e39d`
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayForecast(data.list)
        })
        .catch(error => {
            console.error('There was a problem fetching the forecast data:', error);
            // alert('There was a problem fetching the forecast data. Please try again.');
        });
    
}


function displayForecast(forecastData) {
    var forecastInfo = document.getElementById('forecastInfo');
    forecastInfo.innerHTML = ''; // Clear existing content
  
    // Group forecast data by date
    let groupedByDate = {};
    forecastData.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push(item);
    });
  
    // Process only the first 5 days
    Object.keys(groupedByDate).slice(0, 5).forEach(date => {
      let items = groupedByDate[date];
      let item = items[0]; // Take the first item of the day for display purposes
  
      const fullDate = new Date(item.dt * 1000); // Convert timestamp to Date
      const day = fullDate.toLocaleDateString('en-US', { weekday: 'short' }); // Short day name
      const month = fullDate.toLocaleDateString('en-US', { month: 'short' }); // Short month name
      const dayOfMonth = fullDate.getDate();
      const tempMax = Math.round(item.main.temp_max - 273.15); // Convert from Kelvin to Celsius
      const tempMin = Math.round(item.main.temp_min - 273.15); // Convert from Kelvin to Celsius
      const description = item.weather[0].description; // Weather description
  
      // Create the list item and card structure
      var listItem = document.createElement('li');
      listItem.classList.add('list-group-item');
  
      listItem.innerHTML = `
          <div class="d-flex justify-content-between align-items-center text-align-center gap-3">
            <p>${day}, ${month} ${dayOfMonth}</p>
            <span>
              <p>${tempMax}/${tempMin}°C ${description}</p>
            </span>
          </div>
      `;
  
      // Append the list item to the ul#forecastInfo
      forecastInfo.appendChild(listItem);
    });
  }
  


// function displayForecastInfo(data) {
//   var forecastInfo = document.getElementById("forecastInfo");
//   forecastInfo.innerHTML = "";

//   // Group forecast data by day
//   var groupedForecast = groupForecastByDay(data.list);

//   // Iterate over each day's forecast
//   Object.keys(groupedForecast).forEach((day) => {
//     var dayForecast = groupedForecast[day];
//     var date = new Date(dayForecast[0].dt * 1000);
//     var dayOfWeek = getDayOfWeek(date.getDay());

//     // Create a container for the day's forecast
//     var dayContainer = document.createElement("div");
//     dayContainer.classList.add("day-forecast");

//     // Add day of week to the container
//     var dayHeader = document.createElement("h3");
//     dayHeader.textContent = dayOfWeek;
//     dayContainer.appendChild(dayHeader);

//     // Iterate over each forecast item for the day
//     dayForecast.forEach((forecast) => {
//       // Create forecast item element
//       var forecastItem = document.createElement("div");
//       forecastItem.classList.add("forecast-item");

//       // Populate forecast item with data
//       forecastItem.innerHTML = `
//                 <p>Date/Time: ${forecast.dt_txt}</p>
//                 <p>Description: ${forecast.weather[0].description}</p>
//                 <p>Temperature: ${Math.round(forecast.main.temp - 273.15)}°C</p>
//             `;

//       // Append forecast item to day container
//       dayContainer.appendChild(forecastItem);
//     });

//     // Append day container to forecastInfo
//     forecastInfo.appendChild(dayContainer);
//   });
// }

// function groupForecastByDay(forecastList) {
//   var groupedForecast = {};
//   forecastList.forEach((forecast) => {
//     var date = new Date(forecast.dt * 1000);
//     var dayKey = date.toLocaleDateString();
//     if (!groupedForecast[dayKey]) {
//       groupedForecast[dayKey] = [];
//     }
//     groupedForecast[dayKey].push(forecast);
//   });
//   return groupedForecast;
// }

// function getDayOfWeek(dayIndex) {
//   var daysOfWeek = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];
//   return daysOfWeek[dayIndex];
// }
// function displayForecastInfo(data) {
//   var forecastInfo = document.getElementById("forecastInfo");
//   forecastInfo.innerHTML = "";

//   // Group forecast data by day
//   var groupedForecast = groupForecastByDay(data.list);

//   // Iterate over each day's forecast
//   Object.keys(groupedForecast).forEach((day) => {
//     var dayForecast = groupedForecast[day];
//     var date = new Date(dayForecast[0].dt * 1000);
//     var dayOfWeek = getDayOfWeek(date.getDay());

//     // Create a container for the day's forecast
//     var dayContainer = document.createElement("div");
//     dayContainer.classList.add("day-forecast");

//     // Add day of week to the container
//     var dayHeader = document.createElement("h3");
//     dayHeader.textContent = dayOfWeek;
//     dayContainer.appendChild(dayHeader);

//     // Iterate over each forecast item for the day
//     dayForecast.forEach((forecast) => {
//       // Create forecast card element
//       var forecastCard = document.createElement("div");
//       forecastCard.classList.add("card", "forecast-card");

//       // Populate forecast card with data
//       forecastCard.innerHTML = `
//                 <div class="card-body">
//                     <h5 class="card-title">Date/Time: ${forecast.dt_txt}</h5>
//                     <p class="card-text">Description: ${
//                       forecast.weather[0].description
//                     }</p>
//                     <p class="card-text">Temperature: ${Math.round(
//                       forecast.main.temp - 273.15
//                     )}°C</p>
//                 </div>
//             `;

//       // Append forecast card to day container
//       dayContainer.appendChild(forecastCard);
//     });

//     // Append day container to forecastInfo
//     forecastInfo.appendChild(dayContainer);
//   });
// }
