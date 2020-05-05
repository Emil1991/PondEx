console.log("finale");
let prng = new Alea();
let gameSettings = {};

let gameStarted = false;
let numberOfMissedFishes = 0;
let generateFishStop = false;
let clickedOnFish = false;
let lockFishClick = false;
let clickedOnChangePond = false;
let missedFishes = 0;
let selectedFishType = [];
let fishArray;
let probabilityArray;
let playerID;
let timer;
let missedMoreThan = false;
let pondIntroTime = 0;
let currentSelectedPond;
let historyOfPonds=["Selected ponds in the game","======="]+"\n";

let ponds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
let pondTypes = ["RD", "RT", "N"];
let pondProbabilities = {
  "RD": {
    "left": 1,
    "right": 1
  },
  "RT": {
    "left": 1,
    "right": 1
  },
  "N": {
    "left": 1,
    "right": 1
  }
}
let newPondSource = "Ponds";
let newPondTarget = "Origin";

let fishApperSetTimeOut = 0;
let fishDisApperSetTimeOut = 0;
let waitForPondApperThenGenerateFishSetTimeOut;
let changeCurrentPondGamePropsSetTimeOut;
let containerFadeOutSetTimeOut;
let generateFirstFishSetTimeOut;

let gameTimer;
let startGameTime;
let endGameTime;
let currentPond;
let currentPondType;
let currentPondNumberOfFishes;
let currentPondInitialNumberOfFishes;
let currentPondStartingTime;
let pondTimeUntilNow; //time on current pond
let numberOfPondsUntilNow = 0;
let numOfFishesUntilNow = 0;
let lastNumberOfFishes = 0;
let currentFishType;
let currentFishEV;
let currentFishLatency; // moment curr fish fade in minus moment last fish fade out
let currentFishShowUp; //moment fish fade in
let lastFadeOff; //moment last fish fade off
let giveUpTime = -1; //time between lastFadeOff and clicking change pond
let currentFishCatchTime;
let currentPondTotalOutcome = 0;
let totalPondsOutcome = 0;

let gameOutputBody;
let gameOutput;
let fishCounter = {
  golden: 0,
  blue: 0,
  green: 0,
  purple: 0,
  gray: 0
}

let currentPondFishProps = {
  golden: {
    probability: 0,
    ev: 0,
    amount: 0,
    left: 0,
    right: 0
  },
  blue: {
    probability: 0,
    ev: 0,
    amount: 0,
    left: 0,
    right: 0
  },
  green: {
    probability: 0,
    ev: 0,
    amount: 0,
    left: 0,
    right: 0
  },
  purple: {
    probability: 0,
    ev: 0,
    amount: 0,
    left: 0,
    right: 0
  },
  gray: {
    probability: 0,
    ev: 0,
    amount: 0,
    left: 0,
    right: 0
  }
};

let pondTypesDist = {
  RD: {
    Dist: 0,
    Ponds: [],
    Origin: []
  },
  RT: {
    Dist: 0,
    Ponds: [],
    Origin: []
  },
  N: {
    Dist: 0,
    Ponds: [],
    Origin: []
  },
  Alive: 3

};
let airTime=0;



function setRandomPondProbs() {
  ponds.forEach(pondNum => {
    pondTypesDist[gameSettings["pond" + pondNum + "Type"]]["Dist"]++;
    pondTypesDist[gameSettings["pond" + pondNum + "Type"]]["Ponds"].push(pondNum);
  });

  pondProbabilities["RD"]["left"] = 0;
  pondProbabilities["RD"]["right"] = (pondTypesDist["RD"]["Dist"]) / ponds.length;
  pondProbabilities["RT"]["left"] = pondProbabilities["RD"]["right"];
  pondProbabilities["RT"]["right"] = pondProbabilities["RT"]["left"] + (pondTypesDist["RT"]["Dist"]) / ponds.length;
  pondProbabilities["N"]["left"] = pondProbabilities["RT"]["right"];
  pondProbabilities["N"]["right"] = pondProbabilities["N"]["left"] + (pondTypesDist["N"]["Dist"]) / ponds.length;
  // console.log("those are the pond probs:",pondProbabilities);
}



$.get("/settings", function (data) {
  gameSettings = {
    ...data
  };

  $("#gameTimeInstructions").text(gameSettings.gameTime);
  $("#fishMissedInstructions").text(gameSettings.missingThreshold);
  $("#minIntroTime").text(gameSettings.minIntroTime);
  $("#maxIntroTime").text(gameSettings.maxIntroTime);
  $("#missingThreshold").text(gameSettings.missingThreshold);

  gameSettings.gameTime = gameSettings.gameTime * 60 * 1000;
  gameSettings.gameTimeP = gameSettings.gameTime / 60 / 1000;

  setRandomPondProbs();
  // startGame();

  // console.log("fetched Game Settings from admin:", gameSettings);
});

//======================================================



function checkAnswers() {

  if (!$('#answer1').is(':checked')) {
    $("#qNum").text("1");
    $("#qError").css("visibility", "visible");
    return false;
  } else if (!$('#answer2').is(':checked')) {
    $("#qNum").text("2");
    $("#qError").css("visibility", "visible");
    return false;
  } else if (!$('#answer3').is(':checked')) {
    $("#qNum").text("3");
    $("#qError").css("visibility", "visible");
    return false;
  } else {
    return true;
  }
}

function idIsValid() {
  if ($("#subjectID").val() != "") {
    return true;
  } else {
    return false;
  }
}

$("#agree").click(() => {
  $("#contract").fadeOut(300, () => {
    $("#form").fadeIn(300);
  })
});

$("#toPage2").click(() => {
  if (idIsValid() == true) {
    playerID = $("#subjectID").val();
    $("#form").fadeOut(300, () => {
      $("#page2").fadeIn(300);
    });
  } else {
    $("#idError").css("display", "inline");
  }

});

$("#toPage3").click(() => {
  $("#page2").fadeOut(300, () => {
    $("#page3").fadeIn(300);
  })
});

$("#toPage4").click(() => {
  $("#page3").fadeOut(300, () => {
    $("#page4").fadeIn(300);
  })
});

$("#toPage5").click(() => {
  $("#page4").fadeOut(300, () => {
    $("#page5").fadeIn(300);
  })
});

$("#startGame").click(() => {
  if (checkAnswers()) {
    $("#page5").fadeOut(300, () => {
      $("#wrapper").fadeIn(250, () => {
        startGame();
        // let clock = setInterval(() => {
        //   clockTick();
        // }, 1000);
      });
    });
  }
});

function initGameOutput() {
  gameOutputBody = ["GameTime", gameSettings.gameTime / 1000] +
    "\n" + ["FishVisibilityTime", gameSettings.fishVisibilityTime] +
    "\n" + ["SecondPerFishRatio", gameSettings.fishPerSecondRatio] +
    "\n" + ["MissingThreshold", gameSettings.missingThreshold] +
    "\n" + ["RD", "GoldFish", "Probability", gameSettings.fishProps.RD.golden.probability] +
    "\n" + ["RD", "GoldFish", "Outcome", gameSettings.fishProps.RD.golden.ev] +
    "\n" + ["RD", "BlueFish", "Probability", gameSettings.fishProps.RD.blue.probability] +
    "\n" + ["RD", "BlueFish", "Outcome", gameSettings.fishProps.RD.blue.ev] +
    "\n" + ["RD", "GreenFish", "Probability", gameSettings.fishProps.RD.green.probability] +
    "\n" + ["RD", "GreenFish", "Outcome", gameSettings.fishProps.RD.green.ev] +
    "\n" + ["RD", "PurpleFish", "Probability", gameSettings.fishProps.RD.purple.probability] +
    "\n" + ["RD", "PurpleFish", "Outcome", gameSettings.fishProps.RD.purple.ev] +
    "\n" + ["RD", "GreyFish", "Probability", gameSettings.fishProps.RD.gray.probability] +
    "\n" + ["RD", "GreyFish", "Outcome", gameSettings.fishProps.RD.gray.ev] +
    "\n" + ["RT", "GoldFish", "Probability", gameSettings.fishProps.RT.golden.probability] +
    "\n" + ["RT", "GoldFish", "Outcome", gameSettings.fishProps.RT.golden.ev] +
    "\n" + ["RT", "BlueFish", "Probability", gameSettings.fishProps.RT.blue.probability] +
    "\n" + ["RT", "BlueFish", "Outcome", gameSettings.fishProps.RT.blue.ev] +
    "\n" + ["RT", "GreenFish", "Probability", gameSettings.fishProps.RT.green.probability] +
    "\n" + ["RT", "GreenFish", "Outcome", gameSettings.fishProps.RT.green.ev] +
    "\n" + ["RT", "PurpleFish", "Probability", gameSettings.fishProps.RT.purple.probability] +
    "\n" + ["RT", "PurpleFish", "Outcome", gameSettings.fishProps.RT.purple.ev] +
    "\n" + ["RT", "GreyFish", "Probability", gameSettings.fishProps.RT.gray.probability] +
    "\n" + ["RT", "GreyFish", "Outcome", gameSettings.fishProps.RT.gray.ev] +
    "\n" + ["N", "GoldFish", "Probability", gameSettings.fishProps.N.golden.probability] +
    "\n" + ["N", "GoldFish", "Outcome", gameSettings.fishProps.N.golden.ev] +
    "\n" + ["N", "BlueFish", "Probability", gameSettings.fishProps.N.blue.probability] +
    "\n" + ["N", "BlueFish", "Outcome", gameSettings.fishProps.N.blue.ev] +
    "\n" + ["N", "GreenFish", "Probability", gameSettings.fishProps.N.green.probability] +
    "\n" + ["N", "GreenFish", "Outcome", gameSettings.fishProps.N.green.ev] +
    "\n" + ["N", "PurpleFish", "Probability", gameSettings.fishProps.N.purple.probability] +
    "\n" + ["N", "PurpleFish", "Outcome", gameSettings.fishProps.N.purple.ev] +
    "\n" + ["N", "GreyFish", "Probability", gameSettings.fishProps.N.gray.probability] +
    "\n" + ["N", "GreyFish", "Outcome", gameSettings.fishProps.N.gray.ev] +
    "\n" + ["Date:", new Date()] +
    "\n";

  // console.log("game outputBody:", gameOutputBody);
}

//======================================================



jQuery.cssNumber.gridRowStart = true;
jQuery.cssNumber.gridRowEnd = true;
jQuery.cssNumber.gridColumnStart = true;
jQuery.cssNumber.gridColumnEnd = true;
jQuery.cssNumber.gridColumnEnd = true;

function between(number, min, max) {
  return number >= min && number < max;
}

function sendOutputToServer() {
  fetch("/output", {
    method: "POST",
    body: JSON.stringify({
      userID: playerID,
      output: gameOutput
    }),
    headers: {
      "Content-Type": "application/json"
    }
  });
}

function generateGiveUpTimeOutput() {


  gameOutputBody += ["PondEnd_LastFish", lastNumberOfFishes] +
    "\n" + ["FishN", currentPondInitialNumberOfFishes] +
    "\n" + ["Type", currentPondType] +
    "\n" + ["GiveUpTime",
      giveUpTime / 1000
    ] +
    "\n" + [
      "PondTime",
      pondTimeUntilNow / 1000
    ] +
    "\n" + [
      "TimeLeft",
      (endGameTime - new Date() + 2000) / 1000
    ] +
    "\n" + [
      "PondOutcome",
      currentPondTotalOutcome
    ] +
    "\n" + [
      "TotalOutcome",
      totalPondsOutcome
    ] +
    "\n"+["Total air",airTime]+
      "\n";
}

function generateOutput() {
  gameOutputBody += ["Type", currentPondType] +
    "\n" + ["FishN", gameSettings["pond" + currentSelectedPond]] +
    "\n" + ["Fish", numOfFishesUntilNow] +
    "\n" + ["Pond" + currentSelectedPond + "Fish" + numOfFishesUntilNow + "_FishType", currentFishType] +
    "\n" + ["Pond" +
      currentSelectedPond +
      "Fish" +
      numOfFishesUntilNow +
      "_FishLatency",
      currentFishLatency
    ] +
    "\n" + ["Pond" +
      currentSelectedPond +
      "Fish" +
      numOfFishesUntilNow +
      "_CatchTime",
      currentFishCatchTime == -1 ? -1 : currentFishCatchTime / 1000
    ] +
    "\n" + ["Pond" +
      currentSelectedPond +
      "Fish" +
      numOfFishesUntilNow +
      "_PondTime",
      pondTimeUntilNow / 1000
    ] +
    "\n" + ["Pond" +
      currentSelectedPond +
      "Fish" +
      numOfFishesUntilNow +
      "_PondOutcome",
      currentPondTotalOutcome
    ] +
    "\n" + ["Pond" +
      currentSelectedPond +
      "Fish" +
      numOfFishesUntilNow +
      "_TotalOutcome",
      totalPondsOutcome
    ] +
    "\n" + ["Pond" +
      currentSelectedPond +
      "Fish" +
      numOfFishesUntilNow +
      "_TimeLeft",
      (endGameTime - new Date() + 2000 + 400) / 1000
    ] +
    "\n";

  // console.log("current game output body:", gameOutputBody);
}
function generateFirstFish() {
  // console.log("entered generateFish()");
  if (currentPondNumberOfFishes == 0) {
    //ran out of fishes
    return;
  } else if (generateFishStop == true) {
    return;
  }

  ///////////////// GENERATE FISH /////////////////

  let fishX = Math.floor(Math.random() * 60 + 10);
  fishX += "%";
  let fishY = Math.floor(Math.random() * 60 + 10);
  fishY += "%";

  let selectedFish;

  ///////////////// Randomize fish /////////////////

  // assign selectedFish

  if (currentPondType == "N") {
    selectedFish = "green";
    currentFishEV = currentPondFishProps.green.ev;
  } else {
    let randomFishIndex = prng();
    // console.log("randomFishIndex generated:", randomFishIndex);

    if (randomFishIndex <= currentPondFishProps.golden.probability) {
      selectedFish = "golden";
      currentFishEV = currentPondFishProps.golden.ev;
    } else if (
        between(
            randomFishIndex,
            currentPondFishProps.blue.left,
            currentPondFishProps.blue.right
        )
    ) {
      selectedFish = "blue";
      currentFishEV = currentPondFishProps.blue.ev;
    } else if (
        between(
            randomFishIndex,
            currentPondFishProps.purple.left,
            currentPondFishProps.purple.right
        )
    ) {
      selectedFish = "purple";
      currentFishEV = currentPondFishProps.purple.ev;
    } else if (
        between(
            randomFishIndex,
            currentPondFishProps.gray.left,
            currentPondFishProps.gray.right
        )
    ) {
      selectedFish = "gray";
      currentFishEV = currentPondFishProps.gray.ev;
    }
  }

  ////////////////////////////////////

  // console.log("selectedFish after randomization:", selectedFish);

  currentFishType = selectedFish;
  numOfFishesUntilNow++;

  currentFishLatency =
      Number(gameSettings.fishPerSecondRatio) /
      Number(currentPondNumberOfFishes);

  if (currentPondFishProps[selectedFish].amount == 1) {
    currentPondNumberOfFishes--;
    currentPondFishProps[selectedFish].amount--;
    fishArray.splice(randomFishIndex, 1);
    foundFish = true;
  } else {
    currentPondNumberOfFishes--;
    currentPondFishProps[selectedFish].amount--;
    foundFish = true;
  }


  if (generateFishStop == true) {
    return;
  } else {
    $("#" + selectedFish + "Fish").css("left", fishX);
    $("#" + selectedFish + "Fish").css("top", fishY);

    let fishDirection = Math.random();
    if (fishDirection <= 0.5) {
      fishDirection = -1;
    } else {
      fishDirection = 1;
    }

    $("#" + selectedFish + "Fish > img").css("transform", "scaleX(" + fishDirection + ")");
  }


    fishApperSetTimeOut = setTimeout(() => {
      if (generateFishStop == true) {
        return;
      } else {
        $("#" + selectedFish + "Fish").fadeIn(0, () => {
          currentFishShowUp = new Date();
          // console.log("fish fade in");
          // POND FISH UPDATE

          fishDisApperSetTimeOut = setTimeout(() => {
            $("#" + selectedFish + "Fish").fadeOut(0, () => {
              // console.log("fish fade out");
              setTimeout(() => { //give some air
                airTime+=100;
                if (generateFishStop == true) {
                  return;
                } else { //generateFishStop==false
                  if (clickedOnFish == false) {
                    //need to update catch time to -1
                    currentFishCatchTime = -1;
                    pondTimeUntilNow = new Date() - currentPondStartingTime;
                    generateOutput();
                    // currentPondStartingTime = new Date();
                  }

                  if (clickedOnFish == false && clickedOnChangePond == false) {
                    missedFishes++;
                    $("#numberOfMissed").html(missedFishes);
                    if (missedFishes == gameSettings.missingThreshold + 1) {
                      // console.log("missed more than threshold,starting to decline");
                      generateFishStop = true;
                      missedMoreThan = true;
                      $("#container").fadeOut(400, () => {
                        $("#missedGameOver").css("display", "grid");
                        $("#gameOver").css("display", "none");
                        $("#cover").fadeIn(400);

                        gameOutput = ["", playerID] +
                            "\n" + ["PlayerDetails", playerID] +
                            "\n" + ["GameCompleted", "declined"] +
                            "\n" +historyOfPonds+ gameOutputBody;

                        sendOutputToServer();
                        // console.log("sent to server that declined");

                        for (let i = 1; i < 999; i++) window.clearTimeout(i);
                        for (let i = 1; i < 999; i++) window.clearInterval(i);

                        // console.log("cleared all time out and intervals");
                      });
                    }

                  } else if (clickedOnFish == true) {
                    // user clicked on fish
                    pondTimeUntilNow = new Date() - currentPondStartingTime;
                    currentPondTotalOutcome += currentFishEV;
                    totalPondsOutcome += currentFishEV;
                    generateOutput();
                    clickedOnFish = false;
                    // currentPondStartingTime = new Date();
                  } else if (clickedOnChangePond == true) {
                    missedFishes = 0;
                    $("#numberOfMissed").html(missedFishes);
                  }

                  lastNumberOfFishes = numOfFishesUntilNow;

                  setTimeout(() => { //give some air
                    if (generateFishStop == false) {
                      airTime+=100;
                      generateFish();
                    }
                  }, 100);
                }
              }, 100);
            });
          }, gameSettings.fishVisibilityTime * 1000);
        });
      }
    }, (Number(gameSettings.fishPerSecondRatio) / Number(currentPondNumberOfFishes)) * 1000);

    currentPondStartingTime = new Date();
    lastFadeOff = new Date();
    airTime=0;

}

function generateFish() {
  // console.log("entered generateFish()");
  if (currentPondNumberOfFishes == 0) {
    //ran out of fishes
    return;
  } else if (generateFishStop == true) {
    return;
  }

  ///////////////// GENERATE FISH /////////////////

  let fishX = Math.floor(Math.random() * 60 + 10);
  fishX += "%";
  let fishY = Math.floor(Math.random() * 60 + 10);
  fishY += "%";

  let selectedFish;

  ///////////////// Randomize fish /////////////////

  // assign selectedFish 

  if (currentPondType == "N") {
    selectedFish = "green";
    currentFishEV = currentPondFishProps.green.ev;
  } else {
    let randomFishIndex = prng();
    // console.log("randomFishIndex generated:", randomFishIndex);

    if (randomFishIndex <= currentPondFishProps.golden.probability) {
      selectedFish = "golden";
      currentFishEV = currentPondFishProps.golden.ev;
    } else if (
      between(
        randomFishIndex,
        currentPondFishProps.blue.left,
        currentPondFishProps.blue.right
      )
    ) {
      selectedFish = "blue";
      currentFishEV = currentPondFishProps.blue.ev;
    } else if (
      between(
        randomFishIndex,
        currentPondFishProps.purple.left,
        currentPondFishProps.purple.right
      )
    ) {
      selectedFish = "purple";
      currentFishEV = currentPondFishProps.purple.ev;
    } else if (
      between(
        randomFishIndex,
        currentPondFishProps.gray.left,
        currentPondFishProps.gray.right
      )
    ) {
      selectedFish = "gray";
      currentFishEV = currentPondFishProps.gray.ev;
    }
  }

  ////////////////////////////////////

  // console.log("selectedFish after randomization:", selectedFish);

  currentFishType = selectedFish;
  numOfFishesUntilNow++;

  currentFishLatency =
    Number(gameSettings.fishPerSecondRatio) /
    Number(currentPondNumberOfFishes);

  if (currentPondFishProps[selectedFish].amount == 1) {
    currentPondNumberOfFishes--;
    currentPondFishProps[selectedFish].amount--;
    fishArray.splice(randomFishIndex, 1);
    foundFish = true;
  } else {
    currentPondNumberOfFishes--;
    currentPondFishProps[selectedFish].amount--;
    foundFish = true;
  }


  if (generateFishStop == true) {
    return;
  } else {
    $("#" + selectedFish + "Fish").css("left", fishX);
    $("#" + selectedFish + "Fish").css("top", fishY);

    let fishDirection = Math.random();
    if (fishDirection <= 0.5) {
      fishDirection = -1;
    } else {
      fishDirection = 1;
    }

    $("#" + selectedFish + "Fish > img").css("transform", "scaleX(" + fishDirection + ")");
  }



  setTimeout(() => {
    airTime+=100;
    if (generateFishStop == true) return;
    fishApperSetTimeOut = setTimeout(() => {
      if (generateFishStop == true) {
        return;
      } else {
        $("#" + selectedFish + "Fish").fadeIn(0, () => {
          currentFishShowUp = new Date();
          // console.log("fish fade in");
          // POND FISH UPDATE

          fishDisApperSetTimeOut = setTimeout(() => {
            $("#" + selectedFish + "Fish").fadeOut(0, () => {
              // console.log("fish fade out");
              setTimeout(() => { //give some air
                airTime+=100;
                if (generateFishStop == true) {
                  return;
                } else { //generateFishStop==false
                  if (clickedOnFish == false) {
                    //need to update catch time to -1
                    currentFishCatchTime = -1;
                    pondTimeUntilNow = new Date() - currentPondStartingTime;
                    generateOutput();
                    // currentPondStartingTime = new Date();
                  }

                  if (clickedOnFish == false && clickedOnChangePond == false) {
                    missedFishes++;
                    $("#numberOfMissed").html(missedFishes);
                    if (missedFishes == gameSettings.missingThreshold + 1) {
                      // console.log("missed more than threshold,starting to decline");
                      generateFishStop = true;
                      missedMoreThan = true;
                      $("#container").fadeOut(400, () => {
                        $("#missedGameOver").css("display", "grid");
                        $("#gameOver").css("display", "none");
                        $("#cover").fadeIn(400);

                        gameOutput = ["", playerID] +
                          "\n" + ["PlayerDetails", playerID] +
                          "\n" + ["GameCompleted", "declined"] +
                          "\n" +historyOfPonds+ gameOutputBody;

                        sendOutputToServer();
                        // console.log("sent to server that declined");

                        for (let i = 1; i < 999; i++) window.clearTimeout(i);
                        for (let i = 1; i < 999; i++) window.clearInterval(i);

                        // console.log("cleared all time out and intervals");
                      });
                    }

                  } else if (clickedOnFish == true) {
                    // user clicked on fish
                    currentPondTotalOutcome += currentFishEV;
                    totalPondsOutcome += currentFishEV;
                    pondTimeUntilNow = new Date() - currentPondStartingTime;
                    clickedOnFish = false;
                    generateOutput();
                    // currentPondStartingTime = new Date();
                  } else if (clickedOnChangePond == true) {
                    missedFishes = 0;
                    $("#numberOfMissed").html(missedFishes);
                  }

                  lastNumberOfFishes = numOfFishesUntilNow;

                  setTimeout(() => { //give some air
                    airTime+=100;
                    if (generateFishStop == false) {
                      generateFish();
                    }
                  }, 100);
                }
              }, 100);
            });
          }, gameSettings.fishVisibilityTime * 1000);
        });
      }
    }, (Number(gameSettings.fishPerSecondRatio) / Number(currentPondNumberOfFishes)) * 1000);
  }, 100);

}

////// FIRST GENERATION OF FISH //////

function endGame() {
  // fade out current screen and fade in end game screen
  //send output
  $("#goldenFish").fadeOut();
  $("#blueFish").fadeOut();
  $("#greenFish").fadeOut();
  $("#purpleFish").fadeOut();
  $("#grayFish").fadeOut();
  generateFishStop = true;

  $("#container").fadeOut(650, () => {

    gameOutput = ["", playerID] +
      "\n" + ["PlayerDetails", playerID] +
      "\n" + ["GameCompleted", "finished"] +
      "\n" +historyOfPonds+ gameOutputBody;

    sendOutputToServer();
    $("#gameOver").css("display", "grid");
    $("#missedGameOver").css("display", "none");
    $("#cover").fadeIn(400);

    for (let i = 1; i < 999; i++) window.clearTimeout(i);
  });
}


function initFirstPond(){
  ////////////OUTPUT UPDATE////////////

  numberOfPondsUntilNow++;
  currentPondTotalOutcome = 0;
  numOfFishesUntilNow = 0;

  /////////////////////////////////////
}

function initNewPond() {
  ////////////OUTPUT UPDATE////////////

  numberOfPondsUntilNow++;
  currentPondTotalOutcome = 0;
  numOfFishesUntilNow = 0;

  /////////////////////////////////////

  changePond(true);
  // currentPondStartingTime = new Date();
  // waitForPondApperThenGenerateFishSetTimeOut = setTimeout(() => {
  //   lastFadeOff = new Date();
  //   generateFish();
  // }, 2 * 1000);
}

function startGame() {
  ///////////////////////////////////////////////////////////////////////////
  $("#fisherManLine").append(
    "<svg><line id='fisherManLineSvg' x1='900' y1='0' x2='500' y2='500' style='stroke:rgba(0,0,0,0.5)'></line></svg>"
  );
  let animationTime = 4.5;
  let x1Position = $("#environment").outerWidth();
  let y1Position = $("#fishManSpace").outerHeight();
  $("#fisherManLineSvg").attr("x1", x1Position);
  $("#fisherManLineSvg").attr("y1", y1Position);
  $("#fisherManLineSvg").attr("x2", $("#environment").outerWidth() * 0.98);
  $("#fisherManLineSvg").attr("y2", $("#environment").outerHeight());

  window.addEventListener("resize", () => {
    let x1Position = $("#environment").outerWidth();
    let y1Position = $("#fishManSpace").outerHeight();
    $("#fisherManLineSvg").attr("x1", x1Position);
    $("#fisherManLineSvg").attr("y1", y1Position);
    $("#fisherManLineSvg").attr("x2", $("#environment").outerWidth() * 0.98);
    $("#fisherManLineSvg").attr("y2", $("#environment").outerHeight());
  });

  window.addEventListener("mousemove", e => {
    if (
      e.clientX <= $("#environment").offset().left ||
      e.clientX >=
      $("#environment").offset().left + $("#environment").outerWidth() ||
      e.clientY <= $("#environment").offset().top ||
      e.clientY >=
      $("#environment").offset().top + $("#environment").outerHeight()
    ) {
      $("#fisherManLineSvg").attr("x2", $("#environment").outerWidth() * 0.98);
      $("#fisherManLineSvg").attr("y2", $("#environment").outerHeight());
    } else {
      $("#fisherManLineSvg").attr(
        "x2",
        e.clientX - $("#environment").offset().left + 5
      );
      $("#fisherManLineSvg").attr(
        "y2",
        e.clientY - $("#environment").offset().top - 18
      );
    }
  });

  let gameMinutes = Math.floor(gameSettings.gameTimeP);
  let gameSeconds = (gameSettings.gameTimeP - Math.floor(gameSettings.gameTimeP)) * 60;
  $("#timerMinutes").html(gameMinutes);
  $("#timerSeconds").html(gameSeconds);



  ////////////////////////////////////////////////////////////////////////
  startGameTime = new Date();
  endGameTime = new Date(startGameTime.getTime() + gameSettings.gameTime);
  initGameOutput();
  initNewPond();
  // printGameOutput(gameOutput);

  timer = setInterval(() => {
    if (missedMoreThan == false) {
      // console.log("entering endGame()");
      endGame();
    }
    clearInterval(timer);
    // console.log("cleared timer");
  }, gameSettings.gameTime);

}




$("#toProlific").click(() => {
  window.location.href =
    "https://app.prolific.ac/submissions/complete?cc=V2ZC3BJP";
});


$("#goldenFish").click(() => {
  if (lockFishClick === true) {
    return;
  }
  lockFishClick = true;
  clickedOnFish = true;
  currentFishCatchTime = new Date() - currentFishShowUp;
  $("#goldenFish").fadeOut(0, () => {
    lastFadeOff = new Date();
    if (fishCounter["golden"] == 0) { //no golden fish had been caught
      // console.log("golden is empty. appending");
      // $("#fishContainer").append(
      //   "<div class='goldenSiderBar'><img src='/images/goldenfish.png' alt='fish' class='fishSideImage' /><div id='goldenCounter' class='fishCaughtCounter'>&nbsp;X1</div></div> "
      // );
      $(".goldenSideBar").fadeIn(300);
      // $("#goldenSideBarP").fadeIn(300);
      fishCounter["golden"] = 1;
    } else {
      fishCounter["golden"]++;
      $("#goldenCounter").html('&nbsp;X' + fishCounter["golden"])
    }

    lockFishClick = false;
  });
});

$("#blueFish").click(() => {
  if (lockFishClick === true) {
    return;
  }
  lockFishClick = true;
  clickedOnFish = true;
  currentFishCatchTime = new Date() - currentFishShowUp;

  $("#blueFish").fadeOut(0, () => {
    lastFadeOff = new Date();

    if (fishCounter["blue"] == 0) { //no blue fish had been caught
      // console.log("blue is empty. appending");
      // $("#fishContainer").append(
      //   "<div class='blueSiderBar'><img src='/images/bluefish.png' alt='fish' class='fishSideImage' /><div id='blueCounter' class='fishCaughtCounter'>&nbsp;X1</div></div> "
      // );
      $(".blueSideBar").fadeIn(300);
      // $("#blueSideBarP").fadeIn(300);

      fishCounter["blue"] = 1;
    } else {
      fishCounter["blue"]++;
      $("#blueCounter").html('&nbsp;X' + fishCounter["blue"])
    }


    lockFishClick = false;
  });
});

$("#greenFish").click(() => {
  if (lockFishClick === true) {
    return;
  }
  lockFishClick = true;
  clickedOnFish = true;
  currentFishCatchTime = new Date() - currentFishShowUp;

  $("#greenFish").fadeOut(0, () => {
    lastFadeOff = new Date();

    if (fishCounter["green"] == 0) { //no green fish had been caught
      // console.log("green is empty. appending");
      // $("#fishContainer").append(
      //   "<div class='greenSiderBar'><img src='/images/greenfish.png' alt='fish' class='fishSideImage' /><div id='greenCounter' class='fishCaughtCounter'>&nbsp;X1</div></div> "
      // );
      $(".greenSideBar").fadeIn(300);
      // $("#greenSideBarP").fadeIn(300);

      fishCounter["green"] = 1;
    } else {
      fishCounter["green"]++;
      $("#greenCounter").html('&nbsp;X' + fishCounter["green"])
    }


    lockFishClick = false;
  });
});

$("#purpleFish").click(() => {
  if (lockFishClick === true) {
    return;
  }
  lockFishClick = true;
  clickedOnFish = true;
  currentFishCatchTime = new Date() - currentFishShowUp;

  $("#purpleFish").fadeOut(0, () => {
    lastFadeOff = new Date();

    if (fishCounter["purple"] == 0) { //no purple fish had been caught
      // console.log("purple is empty. appending");
      // $("#fishContainer").append(
      //   "<div class='purpleSiderBar'><img src='/images/purplefish.png' alt='fish' class='fishSideImage' /><div id='purpleCounter' class='fishCaughtCounter'>&nbsp;X1</div></div> "
      // );
      $(".purpleSideBar").fadeIn(300);
      // $("#purpleSideBarP").fadeIn(300);

      fishCounter["purple"] = 1;
    } else {
      fishCounter["purple"]++;
      $("#purpleCounter").html('&nbsp;X' + fishCounter["purple"])
    }


    lockFishClick = false;
  });
});

$("#grayFish").click(() => {
  if (lockFishClick === true) {
    return;
  }
  lockFishClick = true;
  clickedOnFish = true;
  currentFishCatchTime = new Date() - currentFishShowUp;

  $("#grayFish").fadeOut(0, () => {
    lastFadeOff = new Date();
    if (fishCounter["gray"] == 0) { //no gray fish had been caught
      // console.log("gray is empty. appending");
      // $("#fishContainer").append(
      //   "<div class='graySiderBar'><img src='/images/grayfish.png' alt='fish' class='fishSideImage' /><div id='grayCounter' class='fishCaughtCounter'>&nbsp;X1</div></div> "
      // );
      $(".graySideBar").fadeIn(300);
      // $("#graySideBarP").fadeIn(300);

      fishCounter["gray"] = 1;
    } else {
      fishCounter["gray"]++;
      $("#grayCounter").html('&nbsp;X' + fishCounter["gray"])
    }


    lockFishClick = false;
  });
});

function changeTrees() {
  let bottomTreeV = Math.floor(Math.random() * 2);
  if (bottomTreeV == 1) {
    let bottomTreeX = Math.floor(Math.random() * 70) + "%";
    $("#bottomTree").css("left", bottomTreeX);
    $("#bottomTree").css("display", "inline");
  } else {
    $("#bottomTree").css("display", "none");
  }

  let topLeftTreeV = Math.floor(Math.random() * 2);
  if (topLeftTreeV == 1) {
    let topLeftTreeY = Math.floor(Math.random() * 70) + "%";
    $("#topLeftTree").css("top", topLeftTreeY);
    $("#topLeftTree").css("display", "inline");
  } else {
    $("#topLeftTree").css("display", "none");
  }

  let topRightTreeV = Math.floor(Math.random() * 2);
  if (topRightTreeV == 1) {
    let topRightTreeY = Math.floor(Math.random() * 70) + "%";
    $("#topRightTree").css("display", "inline");
    $("#topRightTree").css("right", topRightTreeY);
  } else {
    $("#topRightTree").css("display", "none");
  }
}

function changeCurrentPondGameProps(pondNumber,pondType,numberOfFishes,veryFirstPond) {
  changeCurrentPondGamePropsSetTimeOut = setTimeout(() => {
    // console.log("pondNumber", pondNumber);
    currentPond = pondNumber;
    // console.log("current pond number:",currentPond);

    // console.log("`pond`+pondNumber+`Type`", "pond" + pondNumber + "Type");
    currentPondType = pondType;
    // console.log("current pond type:",pondType);

    // console.log("currentPondType", currentPondType);
    currentPondNumberOfFishes = numberOfFishes;
    currentPondInitialNumberOfFishes=numberOfFishes;
    // console.log("current Number of fishes:",numberOfFishes);
    // console.log("ponds left in array:",ponds);

    historyOfPonds+=[`Pond${pondNumber}_Type`,pondType]+ "\n" + [`Pond${pondNumber}_#Fishes`,numberOfFishes]+"\n";

    lastFadeOff = new Date();

    if (currentPondType == "N") {
      fishArray = ["green"];
      probabilityArray = [{
        [gameSettings.fishProps[currentPondType].green.probability]: "green"
      }];
    } else {
      fishArray = ["golden", "blue", "purple", "gray"];
      probabilityArray = fishArray.map(
        fish => gameSettings.fishProps[currentPondType][fish].probability
      );
      probabilityArray = probabilityArray.map((probability, index) => {
        if (index == 0) {
          return {
            [probability]: fishArray[0]
          };
        } else {
          return {
            [probabilityArray[index - 1] + probability]: fishArray[index]
          };
        }
      });
    }

    currentPondFishProps.golden.probability =
      gameSettings.fishProps[currentPondType].golden.probability;
    currentPondFishProps.golden.ev =
      gameSettings.fishProps[currentPondType].golden.ev;
    currentPondFishProps.golden.amount = Math.round(
      gameSettings.fishProps[currentPondType].golden.probability *
      currentPondNumberOfFishes
    );
    currentPondFishProps.golden.left = 0;
    currentPondFishProps.golden.right =
      gameSettings.fishProps[currentPondType].golden.probability;

    currentPondFishProps.blue.probability =
      gameSettings.fishProps[currentPondType].blue.probability;
    currentPondFishProps.blue.ev =
      gameSettings.fishProps[currentPondType].blue.ev;
    currentPondFishProps.blue.amount = Math.round(
      gameSettings.fishProps[currentPondType].blue.probability *
      currentPondNumberOfFishes
    );
    currentPondFishProps.blue.left = currentPondFishProps.golden.right;
    currentPondFishProps.blue.right =
      currentPondFishProps.blue.left +
      gameSettings.fishProps[currentPondType].blue.probability;

    currentPondFishProps.green.probability =
      gameSettings.fishProps[currentPondType].green.probability;
    currentPondFishProps.green.ev =
      gameSettings.fishProps[currentPondType].green.ev;
    currentPondFishProps.green.amount = Math.round(
      gameSettings.fishProps[currentPondType].green.probability *
      currentPondNumberOfFishes
    );

    currentPondFishProps.purple.probability =
      gameSettings.fishProps[currentPondType].purple.probability;
    currentPondFishProps.purple.ev =
      gameSettings.fishProps[currentPondType].purple.ev;
    currentPondFishProps.purple.amount = Math.round(
      gameSettings.fishProps[currentPondType].purple.probability *
      currentPondNumberOfFishes
    );

    currentPondFishProps.purple.left = currentPondFishProps.blue.right;
    currentPondFishProps.purple.right =
      currentPondFishProps.purple.left +
      gameSettings.fishProps[currentPondType].purple.probability;

    currentPondFishProps.gray.probability =
      gameSettings.fishProps[currentPondType].gray.probability;
    currentPondFishProps.gray.ev =
      gameSettings.fishProps[currentPondType].gray.ev;
    currentPondFishProps.gray.amount = Math.round(
      gameSettings.fishProps[currentPondType].gray.probability *
      currentPondNumberOfFishes
    );
    currentPondFishProps.gray.left = currentPondFishProps.purple.right;
    currentPondFishProps.gray.right =
      currentPondFishProps.gray.left +
      gameSettings.fishProps[currentPondType].gray.probability;

    $("#goldenPrice").text(gameSettings.fishProps[currentPondType].golden.ev);
    $("#bluePrice").text(gameSettings.fishProps[currentPondType].blue.ev);
    $("#greenPrice").text(gameSettings.fishProps[currentPondType].green.ev);
    $("#purplePrice").text(gameSettings.fishProps[currentPondType].purple.ev);
    $("#grayPrice").text(gameSettings.fishProps[currentPondType].gray.ev);

    if(veryFirstPond)
      generateFirstFish();
    // console.log("currenPondFishProps:");
    // console.log(currentPondFishProps);
    // currentPondStartingTime = new Date();
    // lastFadeOff = new Date();
    // generateFish();

  }, 2000);
}

function changePond(veryFirstPond) {
  let randomPondIndex = Math.floor(Math.random() * ponds.length);
  currentSelectedPond = ponds[randomPondIndex];
  let pondImgSrc = "/images/ponds/" + currentSelectedPond + ".png";
  $("#pondImage").attr("src", pondImgSrc);
  

  let randomPondType = prng();
  let selectedPondType = "RD";
  if (between(randomPondType,
      pondProbabilities["RT"]["left"],
      pondProbabilities["RT"]["right"])) {
        selectedPondType="RT";
  }else if(between(randomPondType,
    pondProbabilities["N"]["left"],
    pondProbabilities["N"]["right"])){
      selectedPondType="N";
  }
  // console.log("selected pond type:",selectedPondType);

  let randomNumberOfFishes = gameSettings.minNumberOfFishes + Math.floor(Math.random() * (gameSettings.maxNumberOfFishes-gameSettings.minNumberOfFishes));
  // console.log("number of fishes selected:",randomNumberOfFishes);
  ponds.splice(randomPondIndex, 1);
  if (ponds.length == 0) {
    ponds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  }
  changeCurrentPondGameProps(currentSelectedPond,selectedPondType,randomNumberOfFishes,veryFirstPond);
}

function clearAllSetTimeOutBeforeGenerateNewPond() {
  $("#goldenFish").fadeOut();
  $("#blueFish").fadeOut();
  $("#greenFish").fadeOut();
  $("#purpleFish").fadeOut();
  $("#grayFish").fadeOut();
  lockFishClick = false;
}

$("#changePond").click(() => {

  pondTimeUntilNow = new Date() - currentPondStartingTime;
  giveUpTime = new Date() - lastFadeOff;

  if (fishApperSetTimeOut) {
    clearTimeout(fishApperSetTimeOut);
    // console.log("cleared fishApperSet");
    fishApperSetTimeOut = 0;
  }
  if (fishDisApperSetTimeOut) {
    clearTimeout(fishDisApperSetTimeOut);
    // console.log("cleared fishDisApperSet");
    fishDisApperSetTimeOut = 0;
  }
  generateFishStop = true;


  setTimeout(() => { //give some air
    airTime+=100;
    clearAllSetTimeOutBeforeGenerateNewPond();
    pondIntroTime = (gameSettings.maxIntroTime - gameSettings.minIntroTime) * prng() + gameSettings.minIntroTime;
    //update info of moments before changing pond
    currentFishCatchTime = -1;

    // pondTimeUntilNow = new Date() - currentPondStartingTime;
    // giveUpTime = new Date() - lastFadeOff;


    // generateOutput();
    generateGiveUpTimeOutput();


    $("#container").fadeOut(200, () => {
      ////////////OUTPUT UPDATE////////////

      numberOfPondsUntilNow++;
      currentPondTotalOutcome = 0;
      numOfFishesUntilNow = 0;

      setTimeout(() => { //give some air
        // console.log("after air sending exited by default");
        gameOutput = ["", playerID] +
          "\n" + ["PlayerDetails", playerID] +
          "\n" + ["GameCompleted", "exited"] +
          "\n" +historyOfPonds+ gameOutputBody;
        let timeBeforeSend = new Date();
        sendOutputToServer();
        // console.log("sending output time:", new Date() - timeBeforeSend);

      }, 50);

      /////////////////////////////////////
      $("#mapContainer").css("display", "flex");

      changePond(false);
      gameOutputBody += ["PondStart", "PondStart"] + "\n" + ["PondIntroTime", pondIntroTime] + "\n";
      changeTrees();

      $("#mapContainer").fadeIn(200);

      containerFadeOutSetTimeOut = setTimeout(() => {
        $("#mapContainer").fadeOut(200, () => {
          $("#container").fadeIn(600, () => {
            $("#pondImage").fadeIn(50);
            $("#pondImage").show(50);
            zeroFisherManLine();
            // currentPondStartingTime = new Date();
              generateFishStop = false;
              clickedOnChangePond = false;
              giveUpTime = -1;
              generateFirstFish();
          });
        });
      }, pondIntroTime * 1000);

    });
  }, 100);
});

function zeroFisherManLine() {
  let x1Position = $("#environment").outerWidth();
  let y1Position = $("#fishManSpace").outerHeight();
  $("#fisherManLineSvg").attr("x1", x1Position);
  $("#fisherManLineSvg").attr("y1", y1Position);
  $("#fisherManLineSvg").attr("x2", $("#environment").outerWidth() * 0.98);
  $("#fisherManLineSvg").attr("y2", $("#environment").outerHeight());
}

function clockTick() {
  if (parseInt($("#timerSeconds").html()) == 0) { //zero seconds
    if (parseInt($("#timerMinutes").html()) == 0) { //zero minutes
      return;
    } else { //not zero minuts
      let newMinutes = parseInt($("#timerMinutes").html()) - 1;
      $("#timerMinutes").html(newMinutes);
      $("#timerSeconds").html(59);
    }
  } else { //only downgrade seconds
    let newSeconds = parseInt($("#timerSeconds").html()) - 1;
    $("#timerSeconds").html(newSeconds);
  }
}

$("#stopPond").click(() => {
  generateFishStop = true;
});

$("#continuePond").click(() => {
  if (generateFishStop == true) {
    generateFishStop = false;
    generateFish();
  }
});

//////////////////////////ALEA////////////////////////////////

// From http://baagoe.com/en/RandomMusings/javascript/
// Johannes BaagÃ¸e <baagoe@baagoe.com>, 2010
function Mash() {
  let n = 0xefc8249d;

  let mash = function (data) {
    data = data.toString();
    for (let i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      let h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  mash.version = "Mash 0.9";
  return mash;
}

// From http://baagoe.com/en/RandomMusings/javascript/
function Alea() {
  return (function (args) {
    // Johannes BaagÃ¸e <baagoe@baagoe.com>, 2010
    let s0 = 0;
    let s1 = 0;
    let s2 = 0;
    let c = 1;

    if (args.length == 0) {
      args = [+new Date()];
    }
    let mash = Mash();
    s0 = mash(" ");
    s1 = mash(" ");
    s2 = mash(" ");

    for (let i = 0; i < args.length; i++) {
      s0 -= mash(args[i]);
      if (s0 < 0) {
        s0 += 1;
      }
      s1 -= mash(args[i]);
      if (s1 < 0) {
        s1 += 1;
      }
      s2 -= mash(args[i]);
      if (s2 < 0) {
        s2 += 1;
      }
    }
    mash = null;

    let random = function () {
      let t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
      s0 = s1;
      s1 = s2;
      return (s2 = t - (c = t | 0));
    };
    random.uint32 = function () {
      return random() * 0x100000000; // 2^32
    };
    random.fract53 = function () {
      return random() + ((random() * 0x200000) | 0) * 1.1102230246251565e-16; // 2^-53
    };
    random.version = "Alea 0.9";
    random.args = args;
    return random;
  })(Array.prototype.slice.call(arguments));
}