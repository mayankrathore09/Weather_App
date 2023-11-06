console.log("mayank jee hello");


async function checkWeather(){

    try{

        let city="bhl";
        let API_KEY = "5e7e59e285227231746fab6242f64a1f";
        let lon=35.76678687;
        let lat=56.686743;

        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}
                                            &appid=${API_KEY}&units=metric`);

        let ans = await response.json();

        console.log(ans);

    }
    catch(err){

        console.log("error occured " ,err);
    }
    
} 

