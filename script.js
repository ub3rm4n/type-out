function addUser(){
    //adds users to the database using post method and JSON 
    var user=document.getElementById("createAccount").value;
    var passkey=document.getElementById("createPassword").value;
    let url ="/add/user/";
    p = fetch(url ,{//fetching url
      method: 'POST',
        body: JSON.stringify({
        username: user,
        password: passkey,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        }
      });
    p.then((response) => {
        console.log("successful");
        document.getElementById("createAccount").value="";
        document.getElementById("createPassword").value="";
        }
    )
    .catch( (error) => {
        console.log('THERE WAS A PROBLEM');
        console.log(error);
    });
}

function getUsers(){
    //Works for get and search methods in the url using fetch api
    var userkey=document.getElementById("loginAccount").value;
    var passkey=document.getElementById("loginPassword").value;
    let url="/get/users"
    p = fetch(url ,{//fetching url
      method: 'POST',
        body: JSON.stringify({
        username: userkey,
        password: passkey,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        }
      });
    p.then((response) => {
        return response.text();
        }

    )
    .then(response => {
        if (response=="successful"){
        setInterval(loaddiffpage,500);
        clearInterval(setInterval(loaddiffpage,500));
        document.getElementById("loginMessage").innerHTML="Login Successful";
        }
        else{
        document.getElementById("loginMessage").innerHTML="Login Failed";
        document.getElementById("loginAccount").value="";
        document.getElementById("loginPassword").value="";
        }
    })
    .catch( (error) => {
        console.log('THERE WAS A PROBLEM');
        console.log(error);
    });
}

function setDifficulty(difficulty) {
    localStorage.setItem("difficulty", difficulty);
    loadHomePage();
  }

function loadHomePage(){    
    window.location.href="home.html";
    }

function loaddiffpage(){    
    window.location.href="difficulty.html";
    }

function showHelp() {
     alert("Helpful info");
     }
     
function showRules() {
    alert("Hello! Welcome to our boxing typing game, Type Out!!!. To get started you will need to create a user and password and log in. Remember to keep it safe if you ever want to have bragging rights to your score! Once you're logged into the game, you'll need to select a difficulty to play the game on. The difficulty will just adjust the enemy health. Once you've selected your difficulty, the game will wait for you to start typing in your words. The way you play this game is to type the words correctly in order to win basically to outbox your opponent. Given our calculated formulas, the damage will be dealt based on the accuracy and how fast you type or words per minute (WPM). Accuracy is very important so make sure to prioritize that over speed! They will also be displayed to denote how much damage you've done to your enemy. Once you've cleared the enemy, your score will be based on how fast you cleared the enemy within that respective difficulty. The top 3 best clear speeds will be documented for this game! There will be a victory screen and a defeat screen. This game will also feature hand drawn pictures by the group that made this game and our unique way of animating. Once you've cleared the game once, you can always replay it with the button. Please enjoy!");
  }



// This will be the actual game code below.
let stringTime = "00:00:00";
const difficulty=localStorage.getItem("difficulty");

var flag=false;
function formatTime(timeInMilliseconds) {
  const minutes = Math.floor(timeInMilliseconds / 60000);
  const seconds = Math.floor((timeInMilliseconds % 60000) / 1000);
  const centiseconds = Math.floor((timeInMilliseconds % 1000) / 10);

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${centiseconds.toString().padStart(2, '0')}`;
}

let stopwatchInterval;
let stopwatchTime = 0;

function startStopwatch() {
  if (stopwatchInterval) {
    clearInterval(stopwatchInterval);
  }
  
  stopwatchTime = 0;
  timeH.innerHTML = formatTime(stopwatchTime);
  
  stopwatchInterval = setInterval(function () {
    stopwatchTime += 10;
    timeH.innerHTML = formatTime(stopwatchTime);
  }, 10);
}

function stopStopwatch() {
  if (stopwatchInterval) {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
  }
}

//player health and enemy health that will change depending on difficulty.
let enemyHealthpoints = 1;
let userHealthpoints = 40;

if (difficulty==="easy"){
  enemyHealthpoints=10;
}
else if (difficulty==="medium"){
  enemyHealthpoints=20;
}
else if (difficulty==="hard"){
  userHealthpoints=30;
}

const timeH = document.querySelector("#countdown");
const onscreenWord = document.querySelector("#objective");

var picture = document.getElementById("picture");
var ani = document.getElementById("ani");
var static = document.getElementById("static");
var static2 = "img/staticBoxer2.png";
var static3 = "img/staticBoxer3.png";

var pictures = ["img/punchAni1.png", "img/punchAni2.png", "img/punchAni4.png", "img/punchAni3.png", "img/punchAni5.png"];

function checkGameStatus() {
  // the damage conditions will change how the opponent looks.
  if (enemyHealthpoints <= 15){
    static.src = static2;

  }
  if (enemyHealthpoints <= 12){
    static.src = static3;
  }
  if (enemyHealthpoints <= 0) {
      stopStopwatch();
      document.getElementById('inputText').disabled = true;

      static.src = "img/victory.png"
      console.log("Game Over: Enemy defeated!");
      stopStopwatch();
      flag=true;
  }
  if (userHealthpoints <= 0) {

      stopStopwatch();
      document.getElementById('inputText').disabled = true;

      static.src = "img/defeat.png"
      console.log("Game Over: Enemy defeated!");
      stopStopwatch();
      flag=true;
  }
}

let startTime = null;
let correctChars = 0;
let totalChars = 0;
const wpmAverages = new Array();
const accuracyAverages = new Array();
var wordbank = ["broughton", "unicef", "mage", "succession", "september", "macross", "barcodes", "fools", "systeme", "kinh", "stephen", "delinquent", "fixme", "fatah", "dobson", "malaise", "overlaps", "fissure", "censored", "lyx", "judges", "partitioned", "armchair", "deftones", "referendum", "force", "bryan", "lsb", "telecoms", "fragmented", "boarder", "asc", "transformers", "skateboard", "phosphate", "weinberg", "logout", "freelancers", "innumerable", "champs", "consonant", "breen", "fueled", "adbrite", "fairway", "jasper", "macbook", "gss", "decomposed", "juicer", "leela", "igor", "subsidiary", "cornish", "copley", "seafood", "metarating", "idyllic", "turkey", "abduction", "psychologists", "schuler", "bossa", "scared", "sunglass", "ethos", "aquamarine", "tpi", "missiles", "kent", "flawed", "easter", "gladys", "salesperson", "pentecost", "spikes", "corwin", "thrust", "ja", "kilobytes", "lbj", "jeopardy", "gustavo", "jalan", "conceive", "gene", "ruled", "predict", "massachusetts", "catalonia", "obrazki", "expressive", "receptus", "berwyn", "watford", "tl", "offerings", "kenyan", "hale", "insufficiency", "schmidt", "bootcamp", "porter", "mth", "austell", "sheen", "inflate", "bathroom", "tow", "appliances", "sahara", "faces", "selector", "sneakers", "welivetogether", "contend", "hopkins", "empowered", "newbury", "licensor", "volley", "java", "cain", "uzbekistan", "antics", "rpath", "timetable", "baptism", "townhouses", "spain", "lucinda", "antiwar", "hassle", "statistics", "recognised", "acp", "adequate", "rare", "pontoon", "thalia", "gonorrhea", "lending", "qe", "feeder", "balenciaga", "thyroid", "vpc", "charisma", "gripped", "garner", "demonstrate", "stef", "hebert", "food", "degrade", "erick", "radiology", "celebrating", "cooked", "resistant", "anmelden", "innocents", "councillors", "aboriginal", "posters", "mucous", "selma", "bettis", "farsi", "bonded", "rua", "ordinal", "sunken", "oppression", "maternity", "buchanan", "catered", "juelz", "commercialisation", "reminding", "permutation", "broughton", "unicef", "mage", "succession", "september", "macross", "barcodes", "fools", "systeme", "kinh", "stephen", "delinquent", "fixme", "fatah", "dobson", "malaise", "overlaps", "fissure", "censored", "lyx", "judges", "partitioned", "armchair", "deftones", "animal", "referendum", "force", "lsb", "telecoms", "fragmented", "boarder", "asc", "transformers", "skateboard", "phosphate", "resistant", "anmelden", "innocents", "councillors", "aboriginal", "posters"];
// this will be how the animation and wordbank will be called for. 

function getRandomWords() {
  const Rand1 = Math.floor(Math.random() * wordbank.length);
  const Rand2 = Math.floor(Math.random() * wordbank.length);
  const Rand3 = Math.floor(Math.random() * wordbank.length);

  return `${wordbank[Rand1]} ${wordbank[Rand2]} ${wordbank[Rand3]}`;
}

function updateOnscreenWords() {
  const words = getRandomWords();
  onscreenWord.innerHTML = words;
  return words;
}


let words = updateOnscreenWords();

let stopwatchStarted = false;

var inputText = document.getElementById("inputText");



inputText.addEventListener("keydown", function (event) {
  if (!stopwatchStarted && event.key !== "Enter") {
    startStopwatch();
    stopwatchStarted = true;
  }

    if (event.key === "Enter" && inputText.value.trim() !== "") {
        const elapsedTime = (new Date() - startTime) / 1000 / 60;
        const wpm = correctChars / 5 / elapsedTime;
        const accuracy = (correctChars / totalChars) * 100; 
        if (accuracy == 100){
          enemyHealthpoints -= 2.5;
          userHealthpoints -= 0;
          document.getElementById("wpmDMG").innerHTML = `ACC DMG: ${2.5}`;         
        }
        else if (100 > accuracy >= 90){
          enemyHealthpoints -=2;
          userHealthpoints -= 0.5;
          document.getElementById("wpmDMG").innerHTML = `ACC DMG: ${2}`;     
          
        }
        else if (90 > accuracy > 80){
          enemyHealthpoints -=1;
          userHealthpoints -= 1;
           document.getElementById("wpmDMG").innerHTML = `ACC DMG: ${1}`;   
          
           
        }
        else if(accuracy < 70){
          enemyHealthpoints -= 0;
          userHealthpoints -= 1.5;
          document.getElementById("wpmDMG").innerHTML = `ACC DMG: ${0}`;   
          
        }

        if (wpm > 70){
          enemyHealthpoints -= 5;
          userHealthpoints -= 0;
          document.getElementById("accDMG").innerHTML = `WPM DMG: ${5}`;  
          
        }
        else if (70 >= wpm >= 60){
          enemyHealthpoints -= 4;
          userHealthpoints -= 0.5;
          document.getElementById("accDMG").innerHTML = `WPM DMG: ${4}`;  
        }
        else if (59 >= wpm >= 50){
          enemyHealthpoints -= 3;
          userHealthpoints -= 1;
          document.getElementById("accDMG").innerHTML = `WPM DMG: ${3}`;  
          
        }
        else if (50 > wpm >= 0){
          enemyHealthpoints -= 1;
          userHealthpoints -= 1.1;
          document.getElementById("accDMG").innerHTML = `WPM DMG: ${1}`;  
          
        }
        
       
     
        wpmAverages.push(wpm);
;
        inputText.style.display = "none";
        accuracyAverages.push(accuracy);




        // Rest of the code (unchanged)
        const apple = timeH;
0
        stringTime=apple.innerHTML;

        checkGameStatus();
        if (flag==true){
          const url="/gamepage";
          p = fetch(url ,{//fetching url
            method: 'POST',
            body:JSON.stringify({
              difficulty:localStorage.getItem("difficulty"),
              time:stringTime,
            }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
          }
          });
          p.then((response) => {
              console.log("successful");
              }
          )
          .catch( (error) => {
              console.log('THERE WAS A PROBLEM');
              console.log(error);
          });
        }
        timeH.style.display = "none";
        document.getElementById("typeText").style.display = "none";
        document.getElementById("inputBox").style.display = "none";
        console.log(enemyHealthpoints);
        inputText.value = "";
        picture.src = pictures[0];
        picture.style.display = "block";
        static.style.display ="none";
        interval = setInterval(function () {
            if (i >= pictures.length) {
                clearInterval(interval);
                picture.classList.add("fadeOut");
                picture.addEventListener("animationend", function () {
                    timeH.style.display = "none";
                    picture.style.display = "none";
                    picture.classList.remove("fadeOut");
                    
                    i = 0;
                    inputText.value = "";
                    document.getElementById("typeText").style.display = "block";
                    document.getElementById("inputBox").style.display = "block";
                    timeH.style.display = "block";
                    inputText.style.display = "block";
                    static.style.display = "block";
                    
                });
            } else {
                picture.src = pictures[i];
                words = updateOnscreenWords();  // Update the onscreen words
                //reset the wpm and accuracy
                startTime = new Date();
                correctChars = 0;
                totalChars = 0;

            }
            i++;
        }, 700);
    } else {
        const currentWord = words; 
        if (event.key === currentWord.charAt(inputText.value.length)) {
            correctChars++;
        }
        totalChars++;

        const elapsedTime = (new Date() - startTime) / 1000 / 60;
        const wpm = correctChars / 5 / elapsedTime;
        const accuracy = (correctChars / totalChars) * 100;

        // Update the accuracy and WPM elements
        document.getElementById("accuracy").innerHTML = `Accuracy: ${accuracy.toFixed(1)}%`;
        document.getElementById("wpm").innerHTML = `WPM: ${wpm.toFixed(1)}`;
    }
});

inputText.addEventListener("focus", function () {
    i = 0;
});




function leaderboard(){
    let url="/leaderboard";
    p = fetch(url);
        p.then((response) => {
            return response.json();
          })
        .then((listings) => {
            document.getElementById("name1").innerHTML=listings[0][1];
            document.getElementById("name2").innerHTML=listings[0][1];
            document.getElementById("name3").innerHTML=listings[0][2];
            document.getElementById("score1").innerHTML=listings[1][1];
            document.getElementById("score2").innerHTML=listings[1][1];
            document.getElementById("score3").innerHTML=listings[1][2];
            document.getElementById("difficulty1").innerHTML=listings[2][1];
            document.getElementById("difficulty2").innerHTML=listings[2][1];
            document.getElementById("difficulty3").innerHTML=listings[2][2];
        })
        .catch( (error) => {
          console.log('THERE WAS A PROBLEM');
          console.log(error);
        });
}



