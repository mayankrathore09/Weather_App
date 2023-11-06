const userTab = document.querySelector("[data-yourweather]");
const SearchTab = document.querySelector("[data-searchweather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const grantAccessButton = document.querySelector("[data-grantaccess]");
const searchForm = document.querySelector("[data-searchform]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let currentTab = userTab;
const API_key = "5e7e59e285227231746fab6242f64a1f";
currentTab.classList.add("current-tab");

getSessionFromStorage();

function switchTab(clickedTab){

    if(clickedTab != currentTab)
    {
        currentTab.classList.remove("current-tab");
        currentTab= clickedTab;
        currentTab.classList.add("current-tab");


        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");

        }else{
            //phele search wale pr tha abb your weather pr lana hai, then coordinates needed 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");

            getSessionFromStorage();
        }
    }

    
}

userTab.addEventListener("click", ()=>{
    switchTab(userTab);
});

SearchTab.addEventListener("click", ()=>{
    switchTab(SearchTab);
})

//check for coordinates available at storage
function getSessionFromStorage(){
    const localcoordinates = sessionStorage.getItem("user-coordinates");
     
    if(!localcoordinates){
        //agar local coordinates nhi mile
        grantAccessContainer.classList.add("active");
    }
    else{
        //agar local coordinates mil gaya toh
        let coordinates = JSON.parse(localcoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates)
{
    const {lat,lon} = coordinates;
    console.log(coordinates);
    grantAccessContainer.classList.remove("active");

    loadingScreen.classList.add("active");

    //API CALL
    try{
        console.log(lat);
        console.log(lon);
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`
          );
        const data =  await response.json();

        console.log(data);

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }
    catch(err)
    {
        loadingScreen.classList.remove("active");
        console.log("ERRor Occcureed " + err);
    }
}

function renderWeatherInfo(WeatherInfo)
{
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-country-icon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.innerText = WeatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${WeatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = WeatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`https://openweathermap.org/img/w/${WeatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText =` ${WeatherInfo?.main?.temp} °C `;
    windspeed.innerText = `${WeatherInfo?.wind?.speed} m/s`;
    humidity.innerText =  `${WeatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${WeatherInfo?.clouds?.all}%`;


}

function getlocation(){

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(Showposition);
    }
    else{
       alert("No Geolocation available there!")
    }
}

function Showposition(position){

    const Usercoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,          
    }
     
    sessionStorage.setItem("user-coordinates" ,JSON.stringify(Usercoordinates));
    console.log(Usercoordinates);
    fetchUserWeatherInfo(Usercoordinates);
}
grantAccessButton.addEventListener("click",getlocation);


const searchInput = document.querySelector("[data-searchinput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === ""){
        return;
    }else{
        fetchSearchWeatherInfo(cityName);
    }
} );

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }
    catch(err){
        console.log(err);
    }
}