// initializing firebase
$(document).ready(function(){

var config = {
    apiKey: "AIzaSyCZFgxlm7OYDtYudao20tc-24xjNhnPUa8",
    authDomain: "awesomedoctor-907ea.firebaseapp.com",
    databaseURL: "https://awesomedoctor-907ea.firebaseio.com",
    projectId: "awesomedoctor-907ea",
    storageBucket: "awesomedoctor-907ea.appspot.com",
    messagingSenderId: "563734361620"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
    
        // Button for adding Trains
        $("#searchBtn").on("click", function(){
    
            // Grabs user input and assign to variables
            var location = $("#location-input").val().trim();
            var symptoms = $("#symptoms-input").val().trim();
            var distanceFromLocation = $(".materials-icons").val().trim();
            
            
            // Test for variables entered
            console.log(location);
            console.log(symptoms);
            console.log(distanceFromLocation);
            
    
            // pushing info to firebase and storing it
            firebase.database().ref().push({
                location:  location,
                symptoms: symptoms,
                distanceFromLocation: distanceFromLocation,
            })
    
            // clear text-boxes
            $("#location-input").val("");
            $("#symptoms-input").val("");
            $(".materials-icons").val("");
          
    
            // Prevents page from refreshing
            // return false;
        });
        firebase.database().ref().on("child_added", function(childSnapshot, prevChildKey){
    
            console.log(childSnapshot.val());
            console.log(location);
            console.log(symptoms);
        });
    });
    


    function initMap(){
        // google map
        var geocoder = new google.maps.Geocoder();
        var address = "7772 22nd St Westminster CA 92683";   
    
        geocoder.geocode({'address': address}, displayMap)
    }
    
    function displayMap(results, status){
        var coordinatesValue = [];
        if(status == google.maps.GeocoderStatus.OK){
            var latitude = results[0].geometry.location.lat();
            var longtitude = results[0].geometry.location.lng();
            console.log(latitude);
            console.log(longtitude);
            
            coordinatesValue.push(latitude, longtitude);        
        }
        
        drawMap(coordinatesValue);
    }
    
    function drawMap(coordinates){
        var options = {
            zoom : 14, // zoom out
            center: {lat: coordinates[0], lng: coordinates[1]}
        }
    
        var mapTag = $("#map");    
        var map = new google.maps.Map(mapTag[0], options);    
    }
    
    
    $(document).ready(function () {
        $('select').material_select();
    
        
        
        // doctor api
        var doctorApi = "bbc8405334e9bfa31c8a02401fdacfd6";
        var resource_url = 'https://api.betterdoctor.com/2016-03-01/doctors?location=37.773,-122.413,100&skip=2&limit=10&user_key=' + doctorApi;
    
        $.ajax({
            url : resource_url,
            method : 'GET'
        }).then(function(resp){ 
            console.log(resp);
            // console.log(resp.data.length)
            for ( var i = 0; i < resp.data.length; i++) {
                var firstName = resp.data[i].profile.first_name + " "         
                var lastName = resp.data[i].profile.last_name         
                var title = resp.data[i].profile.title          
                var image = resp.data[i].profile.image_url  
                var specialty = resp.data[i].specialties[0].actor 
                var street = resp.data[i].practices[0].visit_address.street    
                var street2 = resp.data[i].practices[0].visit_address.street2    
                var city = resp.data[i].practices[0].visit_address.city   
                var zip = resp.data[i].practices[0].visit_address.zip   
                var state = resp.data[i].practices[0].visit_address.state  
                var lat = resp.data[i].practices[0].visit_address.lat  
                var lon = resp.data[i].practices[0].visit_address.lon  
                console.log(resp.data[i].profile.first_name)
                console.log(resp.data[i].profile.last_name)
                console.log(resp.data[i].profile.title)
                $("#doctorData").append("<li><div class='collapsible-header' data-value='"+i+"' data-lat='"+ lat + "' data-lon='"+ lon +"'><div class='s3'><img style='border-radius: 50%; float:right' src='"+ image +"'></div><div class='s9'><h5>"+ firstName + lastName + "  " + title + "</h5><br /><p>"+ specialty +"</p><p>"+ street + " " + street2 + "," + city + ", " + state + zip +"</p></div></div><div class='collapsible-body'></div></li>")
            }
          $("#firstEntry").append(firstName, lastName)
        }).catch(function(err){
            console.error(err);
        })
    
    
    });
