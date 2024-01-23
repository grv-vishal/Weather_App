const API_Key="781c701d12e92c6588de76223bc33c0b";


// async function showWeather(){

//     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=21.135572&lon=79.0515144&appid=${API_Key}`);
//     // const response_new = await fetch(`https://api.tomorrow.io/v4/weather/forecast?location=21.135572,79.0515144&apikey=XSq5akBHcbiCfchMyGzmdMTb9IQOarBh`);
//     const data=await response.json();
//     // const data_new=await response_new.json();
    
//     // console.log(data_new);
//     let newElement=document.createElement('p');
//     newElement.textContent=`${data?.main?.temp.toFixed(2)} °C`
//     // newElement.textContent=`${data_new?.main?.temp.toFixed(2)} °C`
    
//     document.body.appendChild(newElement);

// }

// showWeather()




const UserTab=document.querySelector("[data-userWeather]");
const SearchTab=document.querySelector("[data-searchWeather]");


const SearchForm=document.querySelector(".search-container");
const GrantLoc=document.querySelector(".grant-location");
const Loading=document.querySelector(".load-container");
const WeatherInfo=document.querySelector(".info-container");
const CloseBtn=document.querySelector(".closebtn");

let currTab=UserTab;
currTab.classList.add("curr-tab");
getFromSessionStorage();

function switchTab(clicked){
    if(currTab!=clicked){
        currTab.classList.remove("curr-tab");
        currTab=clicked;
        currTab.classList.add("curr-tab");

        if(!SearchForm.classList.contains("active")){
            SearchInput.value="";
            CloseBtn.classList.remove("active");
            ErrorFound.classList.remove("active");
            GrantLoc.classList.remove("active");
            WeatherInfo.classList.remove("active");
            SearchForm.classList.add("active");
        }
        else{
            ErrorFound.classList.remove("active");
            SearchForm.classList.remove("active");
            WeatherInfo.classList.remove("active");
            getFromSessionStorage();
        }
    }
}

UserTab.addEventListener("click",() =>{
    switchTab(UserTab);
    // SearchForm.classList.remove("active");
    // WeatherInfo.classList.remove("active");
    // getFromSessionStorage();

});

SearchTab.addEventListener("click",() =>{
    switchTab(SearchTab);
    // SearchInput.value="";
    // CloseBtn.classList.remove("active");
    // GrantLoc.classList.remove("active");
    // WeatherInfo.classList.remove("active");
    // SearchForm.classList.add("active");
    
});

function getFromSessionStorage(){
    const getCoordinates=sessionStorage.getItem("user-coordinates");

    if(!getCoordinates){
        GrantLoc.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(getCoordinates); //transform into javascript object
        GrantLoc.classList.remove("active");
        console.log(coordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
const ErrorFound=document.querySelector(".not-found");

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
     Loading.classList.add("active");

     try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_Key}&units=metric`);
        const data= await response.json();
        Loading.classList.remove("active");
        WeatherInfo.classList.add("active");
        // console.log(data);
        renderInfo(data);
     }
     catch(e){
        Loading.classList.remove("active");
     }


}

function  renderInfo(data){

    // console.log("renderinfo");
    // console.log(data);
    const CityName=document.querySelector("[data-cityName]");
    const CountryIcon=document.querySelector("[data-CountryIcon]");
    const des=document.querySelector("[data-weatherDesc]");
    const desIcon=document.querySelector("[data-descImg]");
    const temp=document.querySelector("[data-temp]");
    const humidity=document.querySelector("[data-humidity]");
    const windspeed=document.querySelector("[data-windspeed]");
    const cloud=document.querySelector("[data-cloud]");
    const errorCode=document.querySelector("[data-code]");
    const errorMsg=document.querySelector("[data-msg]");

    // console.log("after_renderinfo");

    
    if(data?.name===undefined){    //if user data undefined
        WeatherInfo.classList.remove("active");
        ErrorFound.classList.add("active");
        errorCode.innerText=data?.cod;
        errorMsg.innerText=data?.message;
    }
    else {
      ErrorFound.classList.remove("active");
      CityName.innerText=data?.name;
      CountryIcon.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
      des.innerText=data?.weather?.[0].description;
      desIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
      temp.innerText = `${data?.main?.temp.toFixed(2)} °C`;
      windspeed.innerText = `${data?.wind?.speed.toFixed(2)} m/s`;
      humidity.innerText = `${data?.main?.humidity}%`;
      cloud.innerText = `${data?.clouds?.all}%`;
   }

}

const GrantAccessBtn=document.querySelector(".grant-access");
GrantAccessBtn.addEventListener("click", getLoctaion);
const AccessFailed=document.querySelector(".no-access");


 function getLoctaion(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(setPosition);
        GrantLoc.classList.remove("active");
    }
    else{
        AccessFailed.classList.add("active");
    }
}

function setPosition(position){

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates)); //transform usercoordinates into JSON string
    fetchUserWeatherInfo(userCoordinates);
}


const SearchInput=document.querySelector("[data-SearchInput]");
const SearchBtn=document.querySelector(".searchbtn");

SearchBtn.addEventListener("click",(e) => {
    e.preventDefault();   
    const cityName=SearchInput.value;
    if(cityName==="") {
        WeatherInfo.classList.remove("active");
        return;
    }
       
    else{
        
        fetchSearchWeatherInfo(cityName);
    }
})


 function Myfunction(){
    console.log("Myfunction");
    const input=SearchInput.value;
    
    if(input.length){
        CloseBtn.classList.add("active");
    }
    else{
    CloseBtn.classList.remove("active");
   }    
}

CloseBtn.addEventListener("click",function(){
    SearchInput.value='';
    WeatherInfo.classList.remove("active");
    ErrorFound.classList.remove("active");
    CloseBtn.classList.remove("active");
});


async function fetchSearchWeatherInfo(city){
    // console.log(SearchInput.value);
    Loading.classList.add("active");
    GrantLoc.classList.remove("active");
    WeatherInfo.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_Key}&units=metric`);
        const data= await response.json();
        // console.log(data);
        Loading.classList.remove("active");
        WeatherInfo.classList.add("active");
        renderInfo(data);

    }
    catch(e){
        Loading.classList.remove("active");
    }
}


const CrossBtn=document.querySelector(".crossbtn");
CrossBtn.addEventListener("click",() =>{
    AccessFailed.classList.remove("active");
})