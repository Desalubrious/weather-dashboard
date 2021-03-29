var key = '24f16cad0b4bc6b35e26c565f7a99e03';

function init(){
    var inputEl = document.getElementById('city-input');
    var searchEl = document.getElementById('search-button');
    var currentHumidityEl = document.getElementById('humidity');
    var currentTempEl = document.getElementById('temp');
    var currentPhotoEl = document.getElementById('current-pic');
    var clearEl = document.getElementById('clear-history');
    var historyEl = document.getElementById('history');
    var nameEl = document.getElementById('city-name');
    var currentWindEl = document.getElementById('wind');
    var currentUVEl = document.getElementById('UV-index');

    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    console.log(searches);

    // Reads the city name from user, then requests from the open weather api.
    function getWeather(cityName){
        let query = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + key;
        axios.get(query)
        
        // Parses response with current conditions, and gets date.
        .then(function(response){
            console.log(response);
            const currentDate = new Date(response.data.dt*1000);
            console.log(currentDate);
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            nameEl.innerHTML = response.data.name + ' (' + month + '-' + day + '-' + year + ") ";
            // Weather Photos
            let weatherPic = response.data.weather[0].icon;
            currentPhotoEl.setAttribute('src','https://openweathermap.org/img/wn/'+ weatherPic + '@2x.png');
            currentPhotoEl.setAttribute('alt',response.data.weather[0].description);
            currentTempEl.innerHTML = 'Temperature: ' + k2f(response.data.main.temp) + '&#176F' 
            currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
            currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
            
            
            let lat = response.data.coord.lat;
            let long = response.data.coord.lon;
            let UVQuery = 'https://api.openweathermap.org/data/2.5/uvi/forecast?lat=' + lat + '&lon=' + long + '&appid=' + key + '&cnt=1';

            // Gets UV Index, and creates HTML element
            axios.get(UVQuery)
            .then(function(response){
                let UVIndex = document.createElement('span');
                UVIndex.setAttribute('class', 'badge badge-danger');
                UVIndex.innerHTML = response.data[0].value;
                currentUVEl.innerHTML= 'UV Index: ';
                currentUVEl.append(UVIndex);
            });
            // API call for 5 day forecast using city name, and creates HTML elements to display the forecast 
            let cityID= response.data.id;
            let forecast = 'https://api.openweathermap.org/data/2.5/forecast?id=' + cityID + '&appid=' + key;
            axios.get(forecast)
            .then(function(response){
                console.log(response);
                var forecastEls = document.querySelectorAll('.forecast');
                for(i=0; i<forecastEls.length; i++)
                {
                    forecastEls[i].innerHTML= '';
                    var forecastIndex = i*8 + 4;
                    var forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                    var forecastDay = forecastDate.getDate();
                    var forecastMonth = forecastDate.getMonth() + 1;
                    var forecastYear = forecastDate.getFullYear();
                    var forecastDateEl = document.createElement('p');
                    forecastDateEl.setAttribute('class','mt-3 mb-0 forecast-date');
                    forecastDateEl.innerHTML =  forecastMonth + '/' + forecastDay + '/' + forecastYear;
                    forecastEls[i].append(forecastDateEl);
                    var forecastWeatherEl = document.createElement('img');
                    forecastWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                    forecastWeatherEl.setAttribute("alt",response.data.list[forecastIndex].weather[0].description);
                    forecastEls[i].append(forecastWeatherEl);
                    var forecastTempEl = document.createElement("p");
                    forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
                    forecastEls[i].append(forecastTempEl);
                    var forecastHumidityEl = document.createElement("p");
                    forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                    forecastEls[i].append(forecastHumidityEl);
                }
            })
        });
    }

    // On Click Event Listener That Updates Search History
    searchEl.addEventListener('click',function(){
        var searchTerm = inputEl.value;
        getWeather(searchTerm);
        searches.push(searchTerm);
        localStorage.setItem('search',JSON.stringify(searches));
        setSearchHistory();
    })

    // Creates the search history function

    clearEl.addEventListener('click',function(){
        searches = [];
        setSearchHistory();
    })


    setSearchHistory();
    if(searches.length > 0){
        getWeather(searches[searches.length -1]);
    }


    function k2f(K) {
        return Math.floor((K - 273.15) *1.8 +32);
    }

    function setSearchHistory(){
        historyEl.innerHTML = '';
        for (var i=0; i<searches.length; i++){
            var historyItems = document.createElement('input');
            historyItems.setAttribute('type','text');
            historyItems.setAttribute("readonly",true);
            historyItems.setAttribute("class", "form-control d-block bg-white");
            historyItems.setAttribute("value", searches[i]);
            historyItems.addEventListener('click',function(){
                getWeather(historyItems.value);
            })
            historyEl.append(historyItems);
        }

       

     
    }

   

}
init();