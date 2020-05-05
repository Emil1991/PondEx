var prng = new Alea();
var gameSettings = {};

var gameStarted = false;
var numberOfMissedFishes = 0;
var generateFishStop = false;
var clickedOnFish = false;
var lockFishClick = false;
var clickedOnChangePond = false;
var missedFishes = 0;
var selectedFishType = [];
var fishArray;
var probabilityArray;
var playerID;
var timer;
var missedMoreThan = false;
var pondIntroTime = 0;
var currentSelectedPond;

var ponds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
var pondTypes = ["RD", "RT", "N"];
var newPondSource = "Ponds";
var newPondTarget = "Origin";

var fishApperSetTimeOut = 0;
var fishDisApperSetTimeOut = 0;
var waitForPondApperThenGenerateFishSetTimeOut;
var changeCurrentPondGamePropsSetTimeOut;
var containerFadeOutSetTimeOut;
var generateFirstFishSetTimeOut;

var gameTimer;
var startGameTime;
var endGameTime;
var currentPond;
var currentPondType;
var currentPondNumberOfFishes;
var currentPondStartingTime;
var pondTimeUntilNow; //time on current pond
var numberOfPondsUntilNow = 0;
var numOfFishesUntilNow = 0;
var currentFishType;
var currentFishEV;
var currentFishLatency; // moment curr fish fade in minus moment last fish fade out
var currentFishShowUp; //moment fish fade in
var lastFadeOff; //moment last fish fade off
var giveUpTime = -1; //time between lastFadeOff and clicking change pond
var currentFishCatchTime;
var currentPondTotalOutcome = 0;
var totalPondsOutcome = 0;

var gameOutputBody;
var gameOutput;
var fishCounter = {
  golden: 0,
  blue: 0,
  green: 0,
  purple: 0,
  gray: 0
}

var currentPondFishProps = {
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

var pondTypesDist = {
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

function setRandomPondProbs() {
  ponds.forEach(pondNum => {
    pondTypesDist[gameSettings["pond" + pondNum + "Type"]]["Dist"]++;
    pondTypesDist[gameSettings["pond" + pondNum + "Type"]]["Ponds"].push(pondNum);
  });
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
        // var clock = setInterval(() => {
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
    "\n" + ["RD","GoldFish","Probability", gameSettings.fishProps.RD.golden.probability] +
    "\n" + ["RD","GoldFish","Outcome", gameSettings.fishProps.RD.golden.ev] +
    "\n" + ["RD","BlueFish","Probability", gameSettings.fishProps.RD.blue.probability] +
    "\n" + ["RD","BlueFish","Outcome", gameSettings.fishProps.RD.blue.ev] +
    "\n" + ["RD","GreenFish","Probability", gameSettings.fishProps.RD.green.probability] +
    "\n" + ["RD","GreenFish","Outcome", gameSettings.fishProps.RD.green.ev] +
    "\n" + ["RD","PurpleFish","Probability", gameSettings.fishProps.RD.purple.probability] +
    "\n" + ["RD","PurpleFish","Outcome", gameSettings.fishProps.RD.purple.ev] +
    "\n" + ["RD","GreyFish","Probability", gameSettings.fishProps.RD.gray.probability] +
    "\n" + ["RD","GreyFish","Outcome", gameSettings.fishProps.RD.gray.ev] +
    "\n" + ["RT","GoldFish","Probability", gameSettings.fishProps.RT.golden.probability] +
    "\n" + ["RT","GoldFish","Outcome", gameSettings.fishProps.RT.golden.ev] +
    "\n" + ["RT","BlueFish","Probability", gameSettings.fishProps.RT.blue.probability] +
    "\n" + ["RT","BlueFish","Outcome", gameSettings.fishProps.RT.blue.ev] +
    "\n" + ["RT","GreenFish","Probability", gameSettings.fishProps.RT.green.probability] +
    "\n" + ["RT","GreenFish","Outcome", gameSettings.fishProps.RT.green.ev] +
    "\n" + ["RT","PurpleFish","Probability", gameSettings.fishProps.RT.purple.probability] +
    "\n" + ["RT","PurpleFish","Outcome", gameSettings.fishProps.RT.purple.ev] +
    "\n" + ["RT","GreyFish","Probability", gameSettings.fishProps.RT.gray.probability] +
    "\n" + ["RT","GreyFish","Outcome", gameSettings.fishProps.RT.gray.ev] +
    "\n" + ["N","GoldFish","Probability", gameSettings.fishProps.N.golden.probability] +
    "\n" + ["N","GoldFish","Outcome", gameSettings.fishProps.N.golden.ev] +
    "\n" + ["N","BlueFish","Probability", gameSettings.fishProps.N.blue.probability] +
    "\n" + ["N","BlueFish","Outcome", gameSettings.fishProps.N.blue.ev] +
    "\n" + ["N","GreenFish","Probability", gameSettings.fishProps.N.green.probability] +
    "\n" + ["N","GreenFish","Outcome", gameSettings.fishProps.N.green.ev] +
    "\n" + ["N","PurpleFish","Probability", gameSettings.fishProps.N.purple.probability] +
    "\n" + ["N","PurpleFish","Outcome", gameSettings.fishProps.N.purple.ev] +
    "\n" + ["N","GreyFish","Probability", gameSettings.fishProps.N.gray.probability] +
    "\n" + ["N","GreyFish","Outcome", gameSettings.fishProps.N.gray.ev] +
    "\n" + ["Pond","1","Type", gameSettings.pond1Type] +
    "\n" + ["Pond","1","FishN", gameSettings.pond1] +
    "\n" + ["Pond","2","Type", gameSettings.pond2Type] +
    "\n" + ["Pond","2","FishN", gameSettings.pond2] +
    "\n" + ["Pond","3","Type", gameSettings.pond3Type] +
    "\n" + ["Pond","3","FishN", gameSettings.pond3] +
    "\n" + ["Pond","4","Type", gameSettings.pond4Type] +
    "\n" + ["Pond","4","FishN", gameSettings.pond4] +
    "\n" + ["Pond","5","Type", gameSettings.pond5Type] +
    "\n" + ["Pond","5","FishN", gameSettings.pond5] +
    "\n" + ["Pond","6","Type", gameSettings.pond6Type] +
    "\n" + ["Pond","6","FishN", gameSettings.pond6] +
    "\n" + ["Pond","7","Type", gameSettings.pond7Type] +
    "\n" + ["Pond","7","FishN", gameSettings.pond7] +
    "\n" + ["Pond","8","Type", gameSettings.pond8Type] +
    "\n" + ["Pond","8","FishN", gameSettings.pond8] +
    "\n" + ["Pond","9","Type", gameSettings.pond9Type] +
    "\n" + ["Pond","9","FishN", gameSettings.pond9] +
    "\n" + ["Pond","10","Type", gameSettings.pond10Type] +
    "\n" + ["Pond","10","FishN", gameSettings.pond10] +
    "\n" + ["Pond","11","Type", gameSettings.pond11Type] +
    "\n" + ["Pond","11","FishN", gameSettings.pond11] +
    "\n" + ["Pond","12","Type", gameSettings.pond12Type] +
    "\n" + ["Pond","12","FishN", gameSettings.pond12] +
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


  gameOutputBody += [
      "Pond",
      currentSelectedPond,
      "_GiveUpTime",
      giveUpTime / 1000
    ] +
    "\n" + [
      "Pond",
      currentSelectedPond,
      "_PondTime",
      pondTimeUntilNow / 1000
    ] +
    "\n" + [
      "Pond",
      currentSelectedPond,
      "_PondOutcome",
      currentPondTotalOutcome
    ] +
    "\n" + [
      "Pond",
      currentSelectedPond,
      "_TotalOutcome",
      totalPondsOutcome
    ] +
    "\n" + [
      "Pond",
      currentSelectedPond,
      "_TimeLeft",
      (endGameTime - new Date() + 2000) / 1000
    ] +
    "\n";
}

function generateOutput() {
  gameOutputBody += ["Pond", currentSelectedPond, "Type", currentPondType] +
    "\n" + ["Pond",
      currentSelectedPond,
      "Fish",
      numOfFishesUntilNow,
      "_FishType",
      currentFishType
    ] +
    "\n" + ["Pond",
      currentSelectedPond,
      "Fish",
      numOfFishesUntilNow,
      "_FishLatency",
      currentFishLatency
    ] +
    "\n" + ["Pond",
      currentSelectedPond,
      "Fish",
      numOfFishesUntilNow,
      "_CatchTime",
      currentFishCatchTime == -1 ? -1 : currentFishCatchTime / 1000
    ] +
    "\n" + ["Pond",
      currentSelectedPond,
      "Fish",
      numOfFishesUntilNow,
      "_PondTime",
      pondTimeUntilNow / 1000
    ] +
    "\n" + ["Pond",
      currentSelectedPond,
      "Fish",
      numOfFishesUntilNow,
      "_PondOutcome",
      currentPondTotalOutcome
    ] +
    "\n" + ["Pond",
      currentSelectedPond,
      "Fish",
      numOfFishesUntilNow,
      "_TotalOutcome",
      totalPondsOutcome
    ] +
    "\n" + ["Pond",
      currentSelectedPond,
      "Fish",
      numOfFishesUntilNow,
      "_TimeLeft",
      (endGameTime - new Date() + 2000 + 400) / 1000
    ] +
    "\n";

  // console.log("current game output body:", gameOutputBody);
}

function generateFish() {
  console.log("entered generateFish()");
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

  var selectedFish;

  ///////////////// Randomize fish /////////////////

  // assign selectedFish 

  if (currentPondType == "N") {
    selectedFish = "green";
    currentFishEV = currentPondFishProps.green.ev;
  } else {
    var randomFishIndex = prng();
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

  console.log("selectedFish after randomization:", selectedFish);

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
    if (generateFishStop == true) return;
    fishApperSetTimeOut = setTimeout(() => {
      if (generateFishStop == true) {
        return;
      } else {
        $("#" + selectedFish + "Fish").fadeIn(50, () => {
          currentFishShowUp = new Date();
          console.log("fish fade in");
          // POND FISH UPDATE

          fishDisApperSetTimeOut = setTimeout(() => {
            $("#" + selectedFish + "Fish").fadeOut(50, () => {
              console.log("fish fade out");
              setTimeout(() => { //give some air
                if (generateFishStop == true) {
                  return;
                } else { //generateFishStop==false
                  if (clickedOnFish == false) {
                    //need to update catch time to -1
                    currentFishCatchTime = -1;
                    pondTimeUntilNow = new Date() - currentPondStartingTime - 400;
                    generateOutput();
                    // currentPondStartingTime = new Date();
                  }

                  if (clickedOnFish == false && clickedOnChangePond == false) {
                    missedFishes++;
                    $("#numberOfMissed").html(missedFishes);
                    if (missedFishes == gameSettings.missingThreshold + 1) {
                      console.log("missed more than threshold,starting to decline");
                      generateFishStop = true;
                      missedMoreThan = true;
                      $("#container").fadeOut(400, () => {
                        $("#missedGameOver").css("display", "grid");
                        $("#gameOver").css("display", "none");
                        $("#cover").fadeIn(400);

                        gameOutput = ["", playerID] +
                          "\n" + ["PlayerDetails", playerID] +
                          "\n" + ["GameCompleted", "declined"] +
                          "\n" + gameOutputBody;

                        sendOutputToServer();
                        console.log("sent to server that declined");

                        for (var i = 1; i < 999; i++) window.clearTimeout(i);
                        for (var i = 1; i < 999; i++) window.clearInterval(i);

                        console.log("cleared all time out and intervals");
                      });
                    }

                  } else if (clickedOnFish == true) {
                    // user clicked on fish
                    currentPondTotalOutcome += currentFishEV;
                    totalPondsOutcome += currentFishEV;
                    pondTimeUntilNow = new Date() - currentPondStartingTime - 400;
                    clickedOnFish = false;
                    generateOutput();
                    // currentPondStartingTime = new Date();
                  } else if (clickedOnChangePond == true) {
                    missedFishes = 0;
                    $("#numberOfMissed").html(missedFishes);
                  }

                  setTimeout(() => { //give some air
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
      "\n" + gameOutputBody;

    sendOutputToServer();
    $("#gameOver").css("display", "grid");
    $("#missedGameOver").css("display", "none");
    $("#cover").fadeIn(400);

    for (var i = 1; i < 999; i++) window.clearTimeout(i);
  });
}

function initNewPond() {
  ////////////OUTPUT UPDATE////////////

  numberOfPondsUntilNow++;
  currentPondTotalOutcome = 0;
  numOfFishesUntilNow = 0;

  /////////////////////////////////////

  changePond();
  waitForPondApperThenGenerateFishSetTimeOut = setTimeout(() => {
    currentPondStartingTime = new Date();
    lastFadeOff = new Date();
    generateFish();
  }, 2 * 1000);
}

function startGame() {
  ///////////////////////////////////////////////////////////////////////////
  $("#fisherManLine").append(
    "<svg><line id='fisherManLineSvg' x1='900' y1='0' x2='500' y2='500' style='stroke:rgb(0,0,0,0.5)'></line></svg>"
  );
  var animationTime = 4.5;
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
      console.log("entering endGame()");
      endGame();
    }
    clearInterval(timer);
    console.log("cleared timer");
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
  $("#goldenFish").fadeOut(300, () => {
    lastFadeOff = new Date();
    if (fishCounter["golden"] == 0) { //no golden fish had been caught
      console.log("golden is empty. appending");
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

  $("#blueFish").fadeOut(300, () => {
    lastFadeOff = new Date();

    if (fishCounter["blue"] == 0) { //no blue fish had been caught
      console.log("blue is empty. appending");
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

  $("#greenFish").fadeOut(300, () => {
    lastFadeOff = new Date();

    if (fishCounter["green"] == 0) { //no green fish had been caught
      console.log("green is empty. appending");
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

  $("#purpleFish").fadeOut(300, () => {
    lastFadeOff = new Date();

    if (fishCounter["purple"] == 0) { //no purple fish had been caught
      console.log("purple is empty. appending");
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

  $("#grayFish").fadeOut(300, () => {
    lastFadeOff = new Date();
    if (fishCounter["gray"] == 0) { //no gray fish had been caught
      console.log("gray is empty. appending");
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

function changeCurrentPondGameProps(pondNumber) {
  changeCurrentPondGamePropsSetTimeOut = setTimeout(() => {
    // console.log("pondNumber", pondNumber);
    currentPond = pondNumber;

    // console.log("`pond`+pondNumber+`Type`", "pond" + pondNumber + "Type");
    currentPondType = gameSettings["pond" + pondNumber + "Type"];

    // console.log("currentPondType", currentPondType);
    currentPondNumberOfFishes = gameSettings["pond" + pondNumber];



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

    // console.log("currenPondFishProps:");
    // console.log(currentPondFishProps);
  }, 2000);
}

function changePond() {
  // let randomPondIndex = Math.floor(Math.random() * ponds.length);
  while (true) {
    let randomPondTypeIndex = Math.floor(Math.random() * pondTypes.length);

    if (pondTypesDist[pondTypes[randomPondTypeIndex]][newPondSource].length == 0)
      continue;

    let randomPondIndex = Math.floor(Math.random() * pondTypesDist[pondTypes[randomPondTypeIndex]][newPondSource].length);
    currentSelectedPond = pondTypesDist[pondTypes[randomPondTypeIndex]][newPondSource][randomPondIndex];
    console.log("current selected pond type:", pondTypes[randomPondTypeIndex]);
    console.log("current selected pond:", currentSelectedPond);
    let pondImgSrc = "/images/ponds/" + currentSelectedPond + ".png";
    $("#pondImage").attr("src", pondImgSrc);
    changeCurrentPondGameProps(currentSelectedPond);
    pondTypesDist[pondTypes[randomPondTypeIndex]][newPondSource].splice(randomPondIndex, 1);
    pondTypesDist[pondTypes[randomPondTypeIndex]][newPondTarget].push(currentSelectedPond);
    console.log(" selected pond type array after slice:", pondTypesDist[pondTypes[randomPondTypeIndex]][newPondSource]);

    if (pondTypesDist[pondTypes[randomPondTypeIndex]][newPondSource].length == 0) {
      pondTypesDist["Alive"]--;
      if (pondTypesDist["Alive"] == 0) {
        pondTypesDist["Alive"] = 3;
        var tempMode = newPondSource;
        newPondSource = newPondTarget;
        newPondTarget = tempMode;
      }
    }
    break;

  }

  // let pondImgSrc = "/images/ponds/" + ponds[randomPondIndex] + ".png";
  // $("#pondImage").attr("src", pondImgSrc);
  // changeCurrentPondGameProps(ponds[randomPondIndex]);
  // currentSelectedPond = ponds[randomPondIndex];
  // ponds.splice(randomPondIndex, 1);
  // if (ponds.length == 0) {
  //   ponds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  // }
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

  console.log("changePond clicked");

  if (fishApperSetTimeOut) {
    clearTimeout(fishApperSetTimeOut);
    console.log("cleared fishApperSet");
    fishApperSetTimeOut = 0;
  }
  if (fishDisApperSetTimeOut) {
    clearTimeout(fishDisApperSetTimeOut);
    console.log("cleared fishDisApperSet");
    fishDisApperSetTimeOut = 0;
  }
  generateFishStop = true;


  setTimeout(() => { //give some air
    clearAllSetTimeOutBeforeGenerateNewPond();
    pondIntroTime = (gameSettings.maxIntroTime - gameSettings.minIntroTime) * prng() + gameSettings.minIntroTime;
    //update info of moments before changing pond
    currentFishCatchTime = -1;

    // pondTimeUntilNow = new Date() - currentPondStartingTime;
    // giveUpTime = new Date() - lastFadeOff;


    // generateOutput();
    generateGiveUpTimeOutput();
    currentPondStartingTime = new Date();

    $("#container").fadeOut(200, () => {
      ////////////OUTPUT UPDATE////////////

      numberOfPondsUntilNow++;
      currentPondTotalOutcome = 0;
      numOfFishesUntilNow = 0;

      setTimeout(() => { //give some air
        console.log("after air sending exited by default");
        gameOutput = ["", playerID] +
          "\n" + ["PlayerDetails", playerID] +
          "\n" + ["GameCompleted", "exited"] +
          "\n" + gameOutputBody;

        sendOutputToServer();

      }, 50);

      /////////////////////////////////////
      $("#mapContainer").css("display", "flex");

      changePond();
      gameOutputBody += ["Pond" + currentSelectedPond + "IntroTime", pondIntroTime] + "\n";
      changeTrees();

      $("#mapContainer").fadeIn(200);

      containerFadeOutSetTimeOut = setTimeout(() => {
        $("#mapContainer").fadeOut(200, () => {
          $("#container").fadeIn(600, () => {
            zeroFisherManLine();

            setTimeout(() => { //give some air
              generateFishStop = false;
              clickedOnChangePond = false;
              giveUpTime = -1;
              generateFirstFishSetTimeOut = setTimeout(() => {
                generateFish();
              }, 2 * 1000);
            }, 10);

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
  var n = 0xefc8249d;

  var mash = function (data) {
    data = data.toString();
    for (var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
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
    var s0 = 0;
    var s1 = 0;
    var s2 = 0;
    var c = 1;

    if (args.length == 0) {
      args = [+new Date()];
    }
    var mash = Mash();
    s0 = mash(" ");
    s1 = mash(" ");
    s2 = mash(" ");

    for (var i = 0; i < args.length; i++) {
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

    var random = function () {
      var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
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

