var on = false;
var compClick = [];
var playerClick = [];
var compStore;
var paused = false;
var compTurn = true;
var strict = false;
var options = ["#blue", "#red", "#yellow", "#green"];
var score = compClick.length;
var start = false;
var oops = false;
var message = "Winner!"
var blue = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
var red = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
var green = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
var yellow = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");

function gameReset() {
  playerClick = [];
  compClick = [];
  compTurn = true;
}

// strict mode can be set if the game has been turned on
$("#strictBut").mousedown(function() {
  $("#strictBut").css({
    "box-shadow": "none"
  });
  if (on) {
    if (!strict) {
      strict = true;
      $("#showStrict").css({
        "background": "red"
      });
    } else {
      strict = false;
      $("#showStrict").css({
        "background": "#500"
      });
    }
  }
});
$("#strictBut").mouseup(function() {
  $("#strictBut").css({
    "box-shadow": "inset -1px -1px 1px #333"
  });
});

// start button starts a new game only if the game has been turned on
$("#startBut").mousedown(function() {
  if (on) {
    start = true;
    gameReset();
  }

  $("#startBut").css({
    "box-shadow": "none"
  });
});
$("#startBut").mouseup(function() {
  $("#startBut").css({
    "box-shadow": "inset -1px -1px 1px #333"
  });
});

// on switch automatically resets the game variables to their original state
$("#switchOn").click(function() {
  score = 0;
  gameReset();
  if (on) {
    on = false;
    start = false;
    strict = false;
    $("#showStrict").css({
        "background": "#500"
    });
    $("#disp").text(" -- ");
    $("#disp").css({
      "color": "#300"
    });
  } else {
    on = true;
    $("#disp").css({
      "color": "#fcc"
    });
  }
});

/* for each color that is pressed the color is added to an array
    this array is compared to the array of random computer selected colors
    If the two arrays match the game continues
*/
function playerMove() {
  //unbind is used so that each time the player clicks only the current click is added to the array
  $("#blue").unbind().mousedown(function() {
    $("#blue").css({
      "background": "lightblue"
    });
    blue.play();
    playerClick.push("#blue");

  });
  $("#blue").mouseup("click", function() {
    $("#blue").css({
      "background": "blue"
    });
    checkWin();
    checkTurn();

  });
  $("#red").unbind().mousedown(function() {
    $("#red").css({
      "background": "pink"
    });
    red.play();
    playerClick.push("#red");
  });
  $("#red").mouseup(function() {
    $("#red").css({
      "background": "red"
    });
    checkWin();
    checkTurn();

  });
  $("#green").unbind().mousedown(function() {
    $("#green").css({
      "background": "lightgreen"
    });
    green.play();
    playerClick.push("#green");
  });
  $("#green").mouseup(function() {
    $("#green").css({
      "background": "green"
    });
    checkWin();
    checkTurn();

  });
  $("#yellow").unbind().mousedown(function() {
    $("#yellow").css({
      "background": "#ffffbb"
    });
    yellow.play();
    playerClick.push("#yellow");
  });
  $("#yellow").mouseup(function() {
    $("#yellow").css({
      "background": "yellow"
    });
    checkWin();
    checkTurn();
  });
}

function checkWin() {
  // determines whether the colors the player clicked are in the same order as the computer selected colors
  for (var p = 0; p < playerClick.length; p++) {
    // if the colors don't match the pause screen shows
    if (playerClick[p] !== compClick[p]) {
      message = "Sorry try again!";
      $("#msg").text(message);
      $("#pause").show();
      paused = true;
      if (strict) {
        oops = false;
      } 
      // if strict mode is not selected a variable is set that retains the computer's color array
      else if (!strict) {
        oops = true;
      }
    } else if (score == 20 && playerClick.length == 20) {
      paused = true;
      oops = false;
      $("#pause").show();
      message = "Winner!";
      $("#msg").text(message);
    }
  }
}

function checkTurn() {
  if (playerClick.length < compClick.length) {
    compTurn = false;
  } else {
    compTurn = true;
  }
}

function game() {
  // clicking on the pause screen returns the player to the normal gameplay
  $("#pause").click(function() {
    $(this).hide();
    paused = false;
    compTurn = true;
    gameReset();
    if (oops) {
      compClick = compStore;
    }
  });
  // Each click furthers the game so long as the game is on and not on the pause screen
  $("body, #pause, #startBut").click(function() {
    if (on && start && !paused) {
      if (compTurn) {
        playerClick = [];
        computerMove();
      } else {
        playerMove();
      }
    }
  });
}

function computerMove() {
  // will fail to add to the compClick array if the previous player's move failed an strict mode was off
  if (!oops) {
    compClick.push(options[Math.floor(Math.random() * 4)]);
  }

  score = compClick.length
  var mark = 0;
  var len = compClick.length;

  /* Setting the timeout causes the selected colors to flash to a lighter color and back
    blinkLoop function is created to loop through the compClick array one at a time based on value of mark variable which only changes after the timeout is complete.
    for loop is not used because it initiates timeouts before previous timeout finishes
    */
  function blinkLoop() {
    var color = $(compClick[mark]).attr('id');
    setTimeout(function() {
      switch (color) {
        case 'blue':
          $(compClick[mark]).css({
            "background": "lightblue"
          });
          blue.play();
          break;
        case 'yellow':
          $(compClick[mark]).css({
            "background": "white"
          });
          yellow.play();
          break;
        case 'red':
          $(compClick[mark]).css({
            "background": "pink"
          });
          red.play();
          break;
        case 'green':
          $(compClick[mark]).css({
            "background": "lightgreen"
          });
          green.play();
          break;
      }
    }, 300);
    setTimeout(function() {
      $(compClick[mark]).css({
        "background": color
      });
      mark++;
      if (mark < len) {
        blinkLoop();
      }
    }, 700);
  }
  blinkLoop();
  $("#disp").text(score);
  compStore = compClick;
  compTurn = false;
  oops = false;
}

$(document).ready(function(){
  game();
});
