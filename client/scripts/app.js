var app;
// users' friends storage
var friends = {};
app = {


  // global app properties
  roomsProcessed: [],
  server: 'https://api.parse.com/1/classes/chatterbox',
  currentRoom: 'Lobby',
  allData: "",
  username: 'anonymous',


  //startup function is called in index.html; wrapped in doc ready 
  init: function() {
    // name provided by user from prompt
    app.username = window.location.search.substr(10);

    //start fetch
    app.fetch();

    // continuous fetch 
    function repeat() {
      setInterval(app.fetch, 1000);
    }
    repeat();


    //click events 
    $('#chats').on('click', '.username', app.addFriend);
    $("#roomSelect").on("change", app.saveRoom);
    $('#send').on('submit', function(e) {
      app.handleSubmit();
      e.preventDefault();
      $("#message").val("");
    });

  },


  //post message 
  send: function(data) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(data) {
        console.log('chatterbox: Message sent');
      },
      error: function(data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  //fetch data from the server
  fetch: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      contentType: "application/json",
      data: {
        order: '-createdAt'
      },
      error: function(err) {
        console.log('Failed to receive message. ERROR');
        console.error(err);
      },
      success: function(data) {
        console.log('Messages received.');
        alldata = data.results;
        console.log(alldata);

        if (data.results.length === 0) {
          return;
        }

        $("#roomSelect").val(app.currentRoom);

        app.clearMessages();

        _.each(data.results, function(message) {
          app.processRoom(message.roomname);
          if (app.currentRoom == message.roomname) {
            app.addMessage(message);
          }
        });

      }

    });
  },


  // clear chat messages
  clearMessages: function() {
    $('#chats').empty();
  },


  // save selected room to app.currentRoom
  saveRoom: function() {
    app.clearMessages();

    var text = $('#roomSelect option:selected').val();
    var input;

    if (text === "New Room") {
      input = prompt("Enter Room Name");
      app.currentRoom = input;
      app.processRoom(input);
    } else {
      app.currentRoom = text;
    }

    $("#roomSelect").val(app.currentRoom);
    app.fetch();
  },


  //processed room against app.roomsProcessed for duplicates & empty strings/undefined values 
  processRoom: function(room) {
    $("#roomSelect").html('<option data-room ="newRoom">New Room</option><option data-room = "Lobby"selected>Lobby</option>');
    
    if (app.roomsProcessed.indexOf(room) === -1) {
      if (room != " " && room !== undefined) {
        if (room !== "Lobby" && room !== "lobby") {
          app.roomsProcessed.push(room);
        }
      }
    }
    _.each(app.roomsProcessed, function(room) {
      app.addRoom(room);
    });

    $("#roomSelect").val(app.currentRoom);
  },

  // add room to #roomSelect
  addRoom: function(room) {
    var $select = $('<option>').text(room).attr('data-room', room);
    $("#roomSelect").append($select);
  },


  // add message to #chats
  addMessage: function(message) {
    var $chat = $('<div>');
    $chat.attr('data-room', message.roomname);
    $chat.addClass('chat');
    $chat.appendTo('#chats');

    $('<span>').text(message.username + ': ').attr('data-username', message.username).addClass('username').prependTo($chat);
    $('<span>').text(message.text).addClass('msg').appendTo($chat);

    if (friends[message.username]) {
      $('[data-username="' + message.username + '"]').addClass("friend");
    }
  },


  //handle the message to send
  handleSubmit: function() {
    var message = {
      username: app.username,
      text: $('#message').val(),
      roomname: app.currentRoom
    };
    app.send(message);
  },

  
  // add friend to friends storage object
  addFriend: function(e) {
    var friend = $(e.currentTarget).attr('data-username');
    $('[data-username="' + friend + '"]').addClass("friend");
    if (friend) {
      friends[friend] = true;
    }
  },
};
