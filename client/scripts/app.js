// YOUR CODE HERE:
//var retrieve = function() {
//wrap in jquery ready

//

//var messagesReceived = {};
var allData;
var currentRoom;
var friends = {};
$(document).ready(function() {
    ajaxCall();

    // button submit - posting messages
    $("button.submit").click(function() {
        //console.log($('#textbox').val());
        // we will need to change the username
        // get text from textarea box that we created
        // get room name from ??
        var message = {
            username: getUserName(window.location.search),
            text: $('#textbox').val(),
            roomname: currentRoom
        };
        console.log(message.roomname);
        $.ajax({
          url: 'https://api.parse.com/1/classes/chatterbox',
          type: 'POST',
          data: JSON.stringify(message),
          contentType: 'application/json',
          error: function(data) {
            console.log('chatterbox: Failed to send message. Error: ', data);
          },
          success: function(data) {
              console.log(data);
            console.log('chatterbox: Message sent. Data: ', data);
            return data;
          }
        });

    });

    //create click event to just get the text from the input tag that we created
    // wrap in function
    // call that function on line 20
    // we'll get the room
    $('.submitRoom').click(function () {
        var text = $('input').val();
        var $roomName = $('<option></option>').text(text);
        $(".dropDownButton").append($roomName);
        //append text to the array of rooms that we already have

    });

    $('.allMessages').on('click', '.username', function (e) {
        var username = $(e.currentTarget).attr('data-username');
        if (username !== undefined) {
            console.log("Adding " + username);
            friends[username] = true;
        }
        styleFriends(friends);
    });


    // create a click event for the dropdown
    // which will grab the text from the drop down
    //erase div allMessages tag
    // iterate over each person & check their room
    // repopulate allMessages tag w/ data - room selected
    // $("#yourdropdownid option:selected").text();
    $(".dropDownButton").click(function() {
        //$().change();
        var text = $('.dropDownButton option:selected').val();
        currentRoom = text;
        //document.getElementsByClassName(".allMessages").innerHTML = "" ;
        $('.allMessages').empty();
        //
        //allData IS NOT THE DATA THAT WE WANT HERE BECAUSE IT DOESN'T HAVE ALL THE CLASS ETC...      //
          _.each(allData, function(data, i) {
            //displays messages
            if (text === data.roomname) {
                var $message = ('<div>' + data.username + " : " +data.text + '</div>');
                $('.allMessages').prepend($message);
            }
        });
    });


});

// receives messages
var ajaxCall = function() {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
      data: {order: '-createdAt'},
    error: function() {
      console.log('chatterbox: Failed to receive message. Error: ');
    },
    success: function(data) {
      console.log('chatterbox: Messages received. Data: ', data);
      console.log(data);
        displayNameAndMessage(data.results);
        allData = data.results;
        displayRoom(availableRooms);

    }
  });
};



//iterate the messagesReceived
//create a outside var that is a jquery object
// that will create an div every time on each element
// append div's to our our allMessages

var rooms = []; // all rooms
var availableRooms = []; // is our filter array, we are adding here upon condition

//filtering function from Room
var filteringRoomNames = function (allRooms) {
    _.each(allRooms, function (room) {
        if (room !== null) {
          if (room !== undefined) {
            if (room !== "") {
             if (availableRooms.indexOf(room) === -1) {
                 availableRooms.push(room);
             }
            }
          }
        }
    });
};

var displayNameAndMessage = function(allMessages) {
  _.each(allMessages, function(data, i) {
    //displays messages

      var $chat = $('<div/>');



      var $username = $("<span class='username'/>");
      $username.text(data.username+': ')
          .attr('data-username', data.username)
          .attr('data-roomname',data.roomname).appendTo($chat)
          .addClass(data.username);

      var $message = $("<br><span/>");
      $message.text(data.text).appendTo($chat);

    $('.allMessages').prepend($chat);

      // Grabs rooms
      rooms.push(data.roomname);
  });
    filteringRoomNames(rooms);
};

var displayRoom = function(availableRooms) {
 _.each(availableRooms, function(roomName) {
      var $roomName = $('<option></option>').text(roomName);
      $(".dropDownButton").append($roomName);
 });
};


var getUserName = function (windowData) {
    var result = '';
    for (var i = 10; i < windowData.length; i++) {
        result += windowData[i];
    }
    return result;
};

// refresh messages
setInterval(ajaxCall, 20000);


var styleFriends = function (friends) {
    _.each(friends, function (value, friend) {
        $("." + friend).css("font-weight", "bold");
    });
};






