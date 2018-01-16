$(document).ready(function() {
  var easy = true;    //difficulty
  var twoP = false;   //true for playing a friend, false for cpu
  var input = "X";    //click input; default is x
  var cpuLet = "O";   //cpu letter; default is o
  var board = [];     //for looking at the board
  var details = [];   //2D array, e.g. ["X", "", "O"]
  var lockboard = true; //prevents player and cpu from making moves
  var turn = 0;       //counter for moves played

  //resets board
  function clear() {
    $('.sq').html('');
    $('.bot').html('');
    $('.postwin').html('');
    var board = [];
    var details = [];
    turn = 0;
  }

  //differentiate difficulties
  function myTurn() {
    turn += 1;
    if (easy === true) {
      cpuTurnE();
    } else {
      cpuTurnH();
    }
  }

  //sets up the board in an array to be read by the cpu
  function setBoard() {
    var a = $('#a').html();
    var b = $('#b').html();
    var c = $('#c').html();
    var d = $('#d').html();
    var e = $('#e').html();
    var f = $('#f').html();
    var g = $('#g').html();
    var h = $('#h').html();
    var i = $('#i').html();
    var toprow = a + b + c;
    var midrow = d + e + f;
    var botrow = g + h + i;
    var col1 = a + d + g;
    var col2 = b + e + h;
    var col3 = c + f + i;
    var diag1 = a + e + i;
    var diag2 = g + e + c;
    details = [[a,b,c],[d,e,f],[g,h,i],[a,d,g],[b,e,h],[c,f,i],[a,e,i],[g,e,c]];
    board = [toprow, midrow, botrow, col1, col2, col3, diag1, diag2];
  }

  function changeVar(x,y) {
    switch(x + "|" + y) {
      //fall through
      case "0|0":
      case "3|0":
      case "6|0":
        $('#a').html(cpuLet);
        break;
        //fall through
      case "0|1":
      case "4|0":
        $('#b').html(cpuLet);
        break;
        //fall through
      case "0|2":
      case "5|0":
      case "7|2":
        $('#c').html(cpuLet);
        break;
        //fall through
      case "1|0":
      case "3|1":
        $('#d').html(cpuLet);
        break;
        //fall through
      case "1|1":
      case "4|1":
      case "6|1":
      case "7|1":
        $('#e').html(cpuLet);
        break;
        //fall through
      case "1|2":
      case "5|1":
        $('#f').html(cpuLet);
        break;
        //fall through
      case "2|0":
      case "3|2":
      case "7|0":
        $('#g').html(cpuLet);
        break;
        //fall through to h
      case "2|1":
      case "4|2":
        $('#h').html(cpuLet);
        break;
        //fall through to i
      case "2|2":
      case "5|2":
      case "6|2":
        $('#i').html(cpuLet);
        break;
      default:
        $('#i').html("?");
        break;
    }
  }

  //determines when a game is won or drawn, makes an announcement, and locks the board
  function winner() {
    setBoard();
    for (x = 0; x < 8; x++) {
      if (board[x] === "XXX") {
        $('.postwin').html("X wins!");
        lockboard = true;
        $('.postgame').fadeIn();
        return
      }
      if (board[x] === "OOO") {
        $('.postwin').html("O wins!");
        lockboard = true;
        $('.postgame').fadeIn();
        return
      }
    }
    if (turn > 8) {
      $('.postwin').html("Another draw...");
      lockboard = true;
      $('.postgame').fadeIn();
    }
  }

  //on easy mode; random selection
  function cpuTurnE() {
    //determines which locations are open and puts them in an array
    var open = [];
    for (x = 65; x <= 73; x++) {
      var loc = "#" + String.fromCharCode(x).toLowerCase();
      if ($(loc).html() !== "X" && $(loc).html() !== "O") {
        open.push(loc);
      }
    }
    //moves to a random location using the open array
    var num = Math.floor(Math.random() * open.length);
    $(open[num]).html(cpuLet);
    winner();
  }

  //on hard mode
  function cpuTurnH() {
    setBoard();
    //the following loop looks for two-in-a-row
    var mine = cpuLet + cpuLet;
    var yours = input + input;
    for (i=0; i < board.length; i++) {
      var wLoc = details[i].indexOf("");
      if (board[i] === mine) {
        //if the cpu can win, it will
        details[i][wLoc] = cpuLet;
        changeVar(i,wLoc);
        winner();
        return;
      }
    }
    //second loop to check if player will win and block it
    for (j=0; j < board.length; j++) {
      var bLoc = details[j].indexOf("");
      if (board[j] === yours) {
        details[j][bLoc] = cpuLet;
        changeVar(j,bLoc);
        winner();
        return;
      }
    }
    //if the cpu can't win and can't block it moves randomly
    cpuTurnE();
  };

  //settings
  $('.choose button').hover(function() {
    $(this).css({'color':'red'});
  }, function() {
      $( this ).css({'color':'rgb(10,210,210)'});
    });
  //player selects X
  $('#xbutton').on('click', function() {
    input = "X";
    cpuLet = "O";
    $('#obutton').css("border-color", "transparent");
    $(this).css("border-color", "cyan");
  });

  //player selects O
  $('#obutton').on('click', function() {
    input = "O";
    cpuLet = "X";
    $('#xbutton').css("border-color", "transparent");
    $(this).css("border-color", "cyan");
  });

  //play friend or play cpu
  $('#friend').on('click', function() {
    twoP = true;
    $('#cpu').css("border-color", "transparent");
    $(this).css("border-color", "cyan");
    $('.diffsett').fadeOut();
  });

  $('#cpu').on('click', function() {
    twoP = false;
    $('#friend').css("border-color", "transparent");
    $(this).css("border-color", "cyan");
    $('.diffsett').fadeIn();
  });

  //cpu difficulty; doesn't display when friend selected
  $('#easy').on('click', function() {
    easy = true;
    $('#hard').css("border-color", "transparent");
    $(this).css("border-color", "cyan");
  });

  $('#hard').on('click', function() {
    easy = false;
    $('#easy').css("border-color", "transparent");
    $(this).css("border-color", "cyan");
  });

  //start game
  $('#start').on('click', function() {
    $('.choose').fadeOut();
    clear();
    lockboard = false;
    if (input === "O" && twoP === false) {
      myTurn();
    }
  });

  //postgame buttons
  $('.postgame').hover(function() {
    $(this).css({'color':'rgb(10,200,255)'});
  }, function() {
      $( this ).css({'color':'rgb(10,10,255)'});
    });
  //starts a new game with same settings
  $("#newgame").on('click', function() {
    clear();
    $(".postgame").fadeOut();
    if (input === "O" && twoP === false) {
      myTurn();
    }
    lockboard = false;
  });

  //locks the board and brings up the settings
  $('.change').on('click', function() {
    lockboard = true;
    $('.choose').fadeIn();
    $('.postgame').fadeOut();
  });

  //when clicking on game board
  $('.sq').on('click', function() {
    if (lockboard === true) {
      return;
    }
    //prevents overwriting a button
    if ($(this).html() !== 'X' && $(this).html() !== 'O') {
      //for two player mode
      turn += 1;
      if (twoP === true) {
        $(this).html(input);
        winner();
        //if no one has won, this changes the input
        if (lockboard === false) {
          if (input === "X") {
           $('.postwin').html("Next up: O");
           input = "O";
          } else if (input === "O") {
            $('.postwin').html("Next up: X");
            input = "X";
          }
        }
      } else {
        //for cpu mode
        $(this).html(input);
        winner();
        if (lockboard === false) {
          myTurn();
        }
      }
    }
  });
})
