//start

//list variables
var searchBtn = $(".search-button");
var apiKey = "59c656d9966b237cd72451d992b2acee"
var index = 0;

//populate save data on load 

searchBtn.click(function () {
    var searchContent = $(".searchContent").val();
    urlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + searchContent + "&Appid=" + apiKey + "&units=metric";
    if (searchContent == "") {
        alert("Please enter a city")
    } else {
        $.ajax({
            url: urlCurrent,
            method: "GET"
        }).then(function (httpResponse) {
            //declare a variable for where you want to append city name
            var cityName = $(".savedCities");
            //append city name to link list
            cityName.append('<a class="btn btn-outline-secondary" href="#">' + httpResponse.name + "</a>");
            //save item to local storage as "index: city name"
            localStorage.setItem(index, httpResponse.name);
            //add a iteration to each index so it doesn't overwrite
            index = index + 1;
            //get current city and date, display 
            var today = new Date();
            //correct the month
            var month = today.getMonth() + 1
            var date = today.getDate() + "-" + month + "-" + today.getFullYear();
            var currentDate = $(".currentDate")
            currentDate.empty();
            currentDate.append(httpResponse.name + " " + date)
            //get icon and display
            var icon = $(".icon");
            icon.empty();
            icon.append(`<img src="https://openweathermap.org/img/wn/${httpResponse.weather[0].icon}@2x.png">`);
            //get current temp of city, display 
            var currentTemp = $(".currentTemp");
            currentTemp.empty();
            currentTemp.append("Temperature: " + httpResponse.main.temp.toFixed(0) + "°C")
            //get current wind of city, display
            var currentWind = $(".currentWind");
            currentWind.empty();
            currentWind.append("Wind speed: " + httpResponse.wind.speed.toFixed(1) + "km/h")
            //get current humidity in city, display
            var currentHumidity = $(".currentHumidity");
            currentHumidity.empty();
            currentHumidity.append("Humidity: " + httpResponse.main.humidity + "%")
            var lat = httpResponse.coord.lat;
            var lon = httpResponse.coord.lon;
            //get uv index, display
            var uvIndexURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=` + apiKey
            $.ajax({
                url: uvIndexURL,
                method: "GET"
            }).then(function (httpResponse) {
                var currentUV = $(".uvIndex");
                currentUV.empty();
                currentUV.append("UV Index: " + httpResponse.value)
            })
            //five day forecast
            var fiveDayForecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchContent + "&appid=" + apiKey + "&units=metric"
            $.ajax({
                url: fiveDayForecastURL,
                method: "GET"
            }).then(function (httpResponse) {
                //to ensure you get the 12pm time for weather
                var day = [2, 10, 18, 26, 34];
                var forecastDiv = $(".forecast");
                forecastDiv.empty();
                //for each of the 5 days in the forecast, do this...
                day.forEach(function (i) {
                    //get the local time
                    var time = new Date(httpResponse.list[i].dt * 1000);
                    //convert the time into a readable format (australia) so the date is the right way around
                    time = time.toLocaleDateString("en-AU");
                    //append the following items to the forecastDiv card (date, icon, temp, wind, humidity)
                    forecastDiv.append('<div class="col">' + "<br></br>" + "<p>" + time + "</p>" + `<img src="https://openweathermap.org/img/wn/${httpResponse.list[i].weather[0].icon}@2x.png">` + "<p>" + "Temperature: " + httpResponse.list[i].main.temp.toFixed(0) + "°C" + "</p>" + "<p>" + "Wind speed: " + httpResponse.list[i].wind.speed.toFixed(1) + "km/h" + "</p>" + "<p>" + "Humidity: " + httpResponse.list[i].main.humidity + "%" + "</p>" + "</div>");
                })

            });
        });
    };
});

