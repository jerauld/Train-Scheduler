// Initialize Firebase
var config = {
    apiKey: "AIzaSyC7VyQiRMliq_Ah7v0l-C0-4_OtZNFBB5U",
    authDomain: "train-scheduler-2bab1.firebaseapp.com",
    databaseURL: "https://train-scheduler-2bab1.firebaseio.com",
    projectId: "train-scheduler-2bab1",
    storageBucket: "",
    messagingSenderId: "840579553762"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

// Button for adding trains
$("#add-train").on("click", function (event) {
  event.preventDefault();
  
  //Grabs user input
  var trainName = $("#name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var trainStart = $("#start-input").val().trim();
  var frequency = $("#frequency-input").val().trim();

  //Creats local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: destination,
    start: trainStart,
    frequency: frequency
  }

  // Uploads train data to the database
  database.ref().push(newTrain);

  //Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.start);
  console.log(newTrain.frequency);

  // Alert
  alert("Train successfully added.");

  // Clears all of the text-boxes
  $("#name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#frequency-input").val("");
});

//Create Firebase event for adding train and a row in the html when a user adds an entry
database.ref().on("child_added", function(snap){

  console.log(snap.val());

  // Store everything into a variable.
  var trainName = snap.val().name;
  var destination = snap.val().destination;
  var trainStart = snap.val().start;
  var frequency = snap.val().frequency;

  // Train Info
  console.log(trainName);
  console.log(destination);
  console.log(trainStart);
  console.log(frequency);

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(trainStart, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % frequency;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = frequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  // Add each train's data into the table
  $("#train-table").append("<tr><td>" + trainName + "</td><td>" +
  destination + "</td><td>" + frequency +
  "</td><td>" + moment(nextTrain).format("HH:mm") + "</td><td>" + tMinutesTillTrain + "</td></tr>");
},
  // If any errors are experienced, log them to console.
  function(errorObject){
  console.log("Read failed: " + errorObject.code)
});