var prng = new Alea();

function validateForm() {
  if (
    validatePonds() &&
    validateFishes() &&
    validateGameTime() &&
    validateMinIntro() &&
    validateMaxIntro() &&
    validateVisibility() &&
    validateFishPerSecond() &&
    validateMissingThreshold()
  ) {
    $("#save").attr("disabled", false);
  } else {
    $("#save").attr("disabled", true);
  }
}

function validatePonds() {
  var answer = true;
  for (let i = 1; i < 13; i++) {
    if (!validatePond("#pond" + i.toString())) {
      answer = false;
    }
  }
  return answer;
}

function validatePond(pond) {
  if ($(pond).val() < 0 || !$.isNumeric($(pond).val())) {
    $(pond)
      .siblings(".errorMessage")
      .show();
    return false;
  } else {
    $(pond)
      .siblings(".errorMessage")
      .hide();
    return true;
  }
}

function validateFishes() {
  var answer = true;
  var fishTypes = [
    "#goldenPr",
    "#bluePr",
    "#greenPr",
    "#purplePr",
    "#grayPr",
    "#goldenEv",
    "#blueEv",
    "#greenEv",
    "#purpleEv",
    "#grayEv"
  ];

  var pondTypes = ["RD", "RT", "N"];

  pondTypes.forEach(pondType => {
    fishTypes.forEach(fishType => {
      if (!validateFish(fishType + pondType)) {
        answer = false;
      }
    });


  });

  return answer;
}

function validateFish(fish) {
  if ($(fish).val() < 0 || $(fish).val() > 100 || !$.isNumeric($(fish).val())) {
    $(fish)
      .siblings(".errorMessage")
      .show();
    return false;
  } else {
    $(fish)
      .siblings(".errorMessage")
      .hide();
    return true;
  }
}
function validateGameTime() {
  if ($("#gameTime").val() < 0 || !$.isNumeric($("#gameTime").val())) {
    $("#gameTime")
      .siblings(".errorMessage")
      .show();
    return false;
  } else {
    $("#gameTime")
      .siblings(".errorMessage")
      .hide();
    return true;
  }
}

function validateMinIntro() {
  if ($("#minIntroTime").val() < 0 || !$.isNumeric($("#minIntroTime").val())) {
    $("#minIntroTime")
      .siblings(".errorMessage")
      .show();
    return false;
  } else {
    $("#minIntroTime")
      .siblings(".errorMessage")
      .hide();
    return true;
  }
}

function validateMaxIntro() {
  if ($("#maxIntroTime").val() < 0 || !$.isNumeric($("#maxIntroTime").val())) {
    $("#maxIntroTime")
      .siblings(".errorMessage")
      .show();
    return false;
  } else {
    $("#maxIntroTime")
      .siblings(".errorMessage")
      .hide();
    return true;
  }
}

function validateVisibility() {
  if (
    $("#changeVisibility").val() < 0 ||
    !$.isNumeric($("#changeVisibility").val())
  ) {
    $("#changeVisibility")
      .siblings(".errorMessage")
      .show();
    return false;
  } else {
    $("#changeVisibility")
      .siblings(".errorMessage")
      .hide();
    return true;
  }
}

function validateFishPerSecond() {
  if (
    $("#changeFishPerSecond").val() < 0 ||
    !$.isNumeric($("#changeFishPerSecond").val())
  ) {
    $("#changeFishPerSecond")
      .siblings(".errorMessage")
      .show();
    return false;
  } else {
    $("#changeFishPerSecond")
      .siblings(".errorMessage")
      .hide();
    return true;
  }
}

function validateMissingThreshold() {
  if (
    $("#missingThreshold").val() < 1 ||
    !$.isNumeric($("#missingThreshold").val())
  ) {
    $("#missingThreshold")
      .siblings(".errorMessage")
      .show();
    return false;
  } else {
    $("#missingThreshold")
      .siblings(".errorMessage")
      .hide();
    return true;
  }
}

$("#save").click(() => {
  fetch("/admin", {
    method: "POST",
    body: JSON.stringify({
      pond1: $("#pond1").val(),
      pond1Type: $("#pond1Type").val(),
      pond2: $("#pond2").val(),
      pond2Type: $("#pond2Type").val(),
      pond3: $("#pond3").val(),
      pond3Type: $("#pond3Type").val(),
      pond4: $("#pond4").val(),
      pond4Type: $("#pond4Type").val(),
      pond5: $("#pond5").val(),
      pond5Type: $("#pond5Type").val(),
      pond6: $("#pond6").val(),
      pond6Type: $("#pond6Type").val(),
      pond7: $("#pond7").val(),
      pond7Type: $("#pond7Type").val(),
      pond8: $("#pond8").val(),
      pond8Type: $("#pond8Type").val(),
      pond9: $("#pond9").val(),
      pond9Type: $("#pond9Type").val(),
      pond10: $("#pond10").val(),
      pond10Type: $("#pond10Type").val(),
      pond11: $("#pond11").val(),
      pond11Type: $("#pond11Type").val(),
      pond12: $("#pond12").val(),
      pond12Type: $("#pond12Type").val(),

      goldenPrRD: $("#goldenPrRD").val(),
      goldenEvRD: $("#goldenEvRD").val(),

      bluePrRD: $("#bluePrRD").val(),
      blueEvRD: $("#blueEvRD").val(),

      greenPrRD: $("#greenPrRD").val(),
      greenEvRD: $("#greenEvRD").val(),

      purplePrRD: $("#purplePrRD").val(),
      purpleEvRD: $("#purpleEvRD").val(),

      grayPrRD: $("#grayPrRD").val(),
      grayEvRD: $("#grayEvRD").val(),

      goldenPrRT: $("#goldenPrRT").val(),
      goldenEvRT: $("#goldenEvRT").val(),

      bluePrRT: $("#bluePrRT").val(),
      blueEvRT: $("#blueEvRT").val(),

      greenPrRT: $("#greenPrRT").val(),
      greenEvRT: $("#greenEvRT").val(),

      purplePrRT: $("#purplePrRT").val(),
      purpleEvRT: $("#purpleEvRT").val(),

      grayPrRT: $("#grayPrRT").val(),
      grayEvRT: $("#grayEvRT").val(),

      goldenPrN: $("#goldenPrN").val(),
      goldenEvN: $("#goldenEvN").val(),

      bluePrN: $("#bluePrN").val(),
      blueEvN: $("#blueEvN").val(),

      greenPrN: $("#greenPrN").val(),
      greenEvN: $("#greenEvN").val(),

      purplePrN: $("#purplePrN").val(),
      purpleEvN: $("#purpleEvN").val(),

      grayPrN: $("#grayPrN").val(),
      grayEvN: $("#grayEvN").val(),
      gameTime: $("#gameTime").val(),
      minNumberOfFishes: Number($("#minNumberOfFishes").val()),
      maxNumberOfFishes: Number($("#maxNumberOfFishes").val()),
      minIntroTime:$("#minIntroTime").val(),
      maxIntroTime:$("#maxIntroTime").val(),
      fishVisibilityTime: $("#changeVisibility").val(),
      fishPerSecondRatio: $("#changeFishPerSecond").val(),
      missingThreshold: $("#missingThreshold").val()
    }),
    headers: { "Content-Type": "application/json" }
  })
    .then(response => response.json())
    .then(resp => {
      console.log(resp);
      location.reload();
    });
});

$("#clear").click(() => {
  $(".pond").val(0);
  $(".fishProp").val(0);
  $(".pondTypes").val("N");
  $("#changeIntro").val(1);
  $("#changeVisibility").val(1);
  $("#changeFishPerSecond").val(0.001);
  $("#missingThreshold").val(3);
  $(".errorMessage").css("display", "none");
});

$("#randomizer").click(() => {
  for (let i = 1; i < 13; i++) {
    let pondNum = "#pond" + i;
    let min = Number($("#minNumberOfFishes").val());
    let max = Number($("#maxNumberOfFishes").val());
    let diff = Number(max - min);
    let randNum = Math.floor(Math.random() * diff);
    $(pondNum).val(min + randNum);
  }
});

$("#typeRD").click(() => {
  for (let i = 1; i < 13; i++) {
    let pondNum = "#pond" + i + "Type";
    $(pondNum).val("RD");
  }
});

$("#typeRT").click(() => {
  for (let i = 1; i < 13; i++) {
    let pondNum = "#pond" + i + "Type";
    $(pondNum).val("RT");
  }
});

$("#typeNeutral").click(() => {
  for (let i = 1; i < 13; i++) {
    let pondNum = "#pond" + i + "Type";
    $(pondNum).val("N");
  }
});

$("#pondTypeRandomizer").click(() => {
  for (let i = 1; i < 13; i++) {
    let pondNum = "#pond" + i + "Type";
    let options = ["N", "RD", "RT"];
    let randNum = Math.floor(Math.random() * options.length);
    $(pondNum).val(options[randNum]);
  }
});

$("#fishPropsRandomizer").click(() => {
  let options = ["N", "RD", "RT"];
  let fishes = [
    "goldenPr",
    "goldenEv",

    "bluePr",
    "blueEv",

    "greenPr",
    "greenEv",

    "purplePr",
    "purpleEv",

    "grayPr",
    "grayEv"
  ];
  let suffix = ["", "Pr", "Ev"];
  options.forEach(pondType => {
    suffix.forEach(suffix => {
      let goldenRandom = prng();
      let blueRandom = prng() * (1 - goldenRandom);
      let greenRandom = prng() * (1 - goldenRandom - blueRandom);
      let purpleRandom = prng() * (1 - goldenRandom - blueRandom - greenRandom);
      let grayRandom =
        1 - goldenRandom - blueRandom - greenRandom - purpleRandom;
      $("#golden" + suffix + pondType).val(
        Math.round(goldenRandom * 100) / 100
      );
      $("#blue" + suffix + pondType).val(Math.round(blueRandom * 100) / 100);
      $("#green" + suffix + pondType).val(Math.round(greenRandom * 100) / 100);
      $("#purple" + suffix + pondType).val(
        Math.round(purpleRandom * 100) / 100
      );
      $("#gray" + suffix + pondType).val(Math.round(grayRandom * 100) / 100);
    });
  });
});

//////////////////////////ALEA////////////////////////////////

// From http://baagoe.com/en/RandomMusings/javascript/
// Johannes BaagÃ¸e <baagoe@baagoe.com>, 2010
function Mash() {
  var n = 0xefc8249d;

  var mash = function(data) {
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
  return (function(args) {
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

    var random = function() {
      var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
      s0 = s1;
      s1 = s2;
      return (s2 = t - (c = t | 0));
    };
    random.uint32 = function() {
      return random() * 0x100000000; // 2^32
    };
    random.fract53 = function() {
      return random() + ((random() * 0x200000) | 0) * 1.1102230246251565e-16; // 2^-53
    };
    random.version = "Alea 0.9";
    random.args = args;
    return random;
  })(Array.prototype.slice.call(arguments));
}
