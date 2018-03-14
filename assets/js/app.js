// initializing firebase
$(document).ready(function() {
    $('#doctorData').hide()
    // var config = {
    //     apiKey: "AIzaSyCZFgxlm7OYDtYudao20tc-24xjNhnPUa8",
    //     authDomain: "awesomedoctor-907ea.firebaseapp.com",
    //     databaseURL: "https://awesomedoctor-907ea.firebaseio.com",
    //     projectId: "awesomedoctor-907ea",
    //     storageBucket: "awesomedoctor-907ea.appspot.com",
    //     messagingSenderId: "563734361620"
    // };
    // firebase.initializeApp(config);

    // var database = firebase.database();

    // // Button for appending search to database
    // $("#search").on("click", function() {

    //     // Grabs user input and assign to variables
    //     var specialist = $("#specialty").val().trim();
    //     // var location = $("#location").val().trim();
    //     var radius = $("#radius").val().trim();


    //     // Test for variables entered
    //     console.log(specialty);
    //     // console.log(location);
    //     console.log(radius);


    //     // pushing info to firebase and storing it
    //     firebase.database().ref().push({
    //         specialty: specialty,
    //         // location: location,
    //         radius: radius,
    //     })

    //     // clear text-boxes
    //     $("#specialty").val("");
    //     // $("#location").val("");
    //     $("#radius").val("");


    //     // Prevents page from refreshing
    //     // return false;
    // });
    // firebase.database().ref().on("child_added", function(childSnapshot, prevChildKey) {

    //     console.log(childSnapshot.val());
    //     console.log(specialty);
    //     // console.log(location);
    //     console.log(radius)
    // });


    // result page
    $('select').material_select();

    var specialty = '';
    var location = '';
    var radius = 0;

    var doctorArray = [];
    var coordinatesValue = [];
    $('#search').on('click', function() {
        
        $('#doctorData').show();
        
        coordinatesValue = [];

        specialty = $('#specialty').val();
        location = $('#location').val().trim();
        radius = $('#radius').val().trim();
        var geocoder = new google.maps.Geocoder();
        
        geocoder.geocode({ 'address': location }, function(results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
                var latitude = results[0].geometry.location.lat();
                var longtitude = results[0].geometry.location.lng();
                console.log("lat: " + latitude);
                console.log("long: " + longtitude);

                coordinatesValue.push(latitude, longtitude);

            }

            betterDoctor(specialty, coordinatesValue[0], coordinatesValue[1], radius);           

        })
    })


    function betterDoctor(specialty, lat, long, radius) {
        // doctor api
        var doctorApi = "bbc8405334e9bfa31c8a02401fdacfd6";
        var resource_url = "https://api.betterdoctor.com/2016-03-01/doctors?query=" + specialty + "&location=" + lat + "," + long + "," + radius + "&skip=2&limit=10&user_key=" + doctorApi;



        $.ajax({
            url: resource_url,
            method: 'GET'
        }).then(function(resp) {
            // debugger
            // $('.body-item').remove();
            console.log(resp);

            doctorArray = resp.data;
            console.log(doctorArray);

            console.log("lat: " + coordinatesValue[0]);
            console.log("long: " + coordinatesValue[1]);


            for (var i = 0; i < doctorArray.length; i++) {
                var firstName = doctorArray[i].profile.first_name
                var lastName = doctorArray[i].profile.last_name
                var title = doctorArray[i].profile.title
                var image = doctorArray[i].profile.image_url

                // this is an array
                var specialties = convertArrayObjectToString(doctorArray[i].specialties);                
                var li = $("<li class='item' data-index='" + i + "'><div class='collapsible-header title-header'>" + firstName + " " + lastName + ", " + title + " - Specialities: " + specialties + "</div><div class='collapsible-body body-item'><div class='row'><div class='col m2 s12'><img class='responsive-img avatar' src='" + image + "'></div><div class='col m10 s12 bio'></div></div><div id='map'></div></div>");
                $("#doctorData").append(li);
            }

           
        }).catch(function(err) {
            console.error(err);
        })
    };

    $(document).on("click", ".item", function() {
        //$(".item").empty();
        var index = $(this).attr("data-index");
        var content = $(this).find(".bio");

        var address = getOfficeAddress(doctorArray[index].practices[0]);        
        var numbers = displayContactNumbers(doctorArray[index].practices[0].phones);
        console.log("address: " + address);
        console.log("numbers: " + numbers);
        
        var bio = "<p id='intro'>" + doctorArray[index].profile.bio + "</p>";
        var contacts = "<div id='contact-info'>";
        console.log(bio);
        contacts += address + "<br>" + numbers;
        contacts += "</div>";
        content.empty();
        content.append(bio, contacts);        
        
        // add google map in here

        // find div map in here
        var mapTag = $(this).find("#map");
        console.log(mapTag);
        
        var latitude = doctorArray[index].practices[0].visit_address.lat;        
        var longtitude = doctorArray[index].practices[0].visit_address.lon;        

        // map options
        var options = {
            zoom: 10, // zoom in
            center: { lat: latitude, lng: longtitude },
            zoomControl: false, // disable the zoom control
            mapTypeControl: false, // disable map type control to switch between map and satellite
            fullscreenControl: false, // disable full screen control
            streetViewControl: false // disable street view control
        }

        var map = new google.maps.Map(mapTag[0], options);

        var marker = new google.maps.Marker({
            position: { lat: latitude, lng: longtitude },
            map: map
        });


    });

    function convertArrayObjectToString(obj) {
        // debugger;
        var value = []
        for (var i = 0; i < obj.length; i++) {
            value.push(obj[i].name);
        }

        return value.join(', ');
    }

    function displayContactNumbers(obj){
        var numbers = "";
        for(var i = 0; i < obj.length; i++){
            obj[i].type = obj[i].type === "landline" ? "Phone" : obj[i].type;            
            numbers += obj[i].type + ": " + obj[i].number.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3") + "<br>";
        }        
        
        return numbers;
        
    }

    function getOfficeAddress(obj){       

        var address = "";
        address += obj.visit_address.street + ", ";
        address += obj.visit_address.street2 != undefined ? obj.visit_address.street2 + ", " : "";
        address += obj.visit_address.city + ", ";
        address += obj.visit_address.state + " ";
        address += obj.visit_address.zip;
        
        return address;

    }

});