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

    // // Button for adding Trains
    // $("#searchBtn").on("click", function() {

    //     // Grabs user input and assign to variables
    //     var location = $("#location-input").val().trim();
    //     var symptoms = $("#symptoms-input").val().trim();
    //     var distanceFromLocation = $(".materials-icons").val().trim();


    //     // Test for variables entered
    //     console.log(location);
    //     console.log(symptoms);
    //     console.log(distanceFromLocation);


    //     // pushing info to firebase and storing it
    //     firebase.database().ref().push({
    //         location: location,
    //         symptoms: symptoms,
    //         distanceFromLocation: distanceFromLocation,
    //     })

    //     // clear text-boxes
    //     $("#location-input").val("");
    //     $("#symptoms-input").val("");
    //     $(".materials-icons").val("");


    //     // Prevents page from refreshing
    //     // return false;
    // });
    // firebase.database().ref().on("child_added", function(childSnapshot, prevChildKey) {

    //     console.log(childSnapshot.val());
    //     console.log(location);
    //     console.log(symptoms);
    // });


    // result page
    $('select').material_select();

    var specialty = '';
    var location = '';
    var radius = 0;



    var doctorArray = [];
    var coordinatesValue = [];
    $('#search').on('click', function() {
        $('#doctorData').show()
        coordinatesValue = [];
        // $("#specialty").val("");
        // $("#location").val("");
        // $("#radius").val("");
        $('#doctorData').empty()



        specialty = $('#specialty').val();
        location = $('#location').val().trim();
        radius = $('#radius').val().trim();
        var geocoder = new google.maps.Geocoder();
        //var address = "92683";

        geocoder.geocode({ 'address': location }, function(results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
                var latitude = results[0].geometry.location.lat();
                var longtitude = results[0].geometry.location.lng();
                console.log("lat: " + latitude);
                console.log("long: " + longtitude);

                coordinatesValue.push(latitude, longtitude);

            }

            console.log(coordinatesValue);

            betterDoctor(specialty, coordinatesValue[0], coordinatesValue[1], radius)
            console.log(specialty)
            console.log(location)
            console.log(radius)

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
            console.log(resp);

            doctorArray = resp.data;
            console.log(doctorArray);

            console.log("lat: " + coordinatesValue[0]);
            console.log("long: " + coordinatesValue[1]);

            //var row = "<div class='row'><div class='col s12'><ul class='collapsible' id='doctorData' data-collapsible='accordian'></ul></div></div>"

            // $(".container").prepend(row);

            for (var i = 0; i < doctorArray.length; i++) {
                var firstName = doctorArray[i].profile.first_name
                var lastName = doctorArray[i].profile.last_name
                var title = doctorArray[i].profile.title
                var image = doctorArray[i].profile.image_url

                // this is an array
                var specialties = convertArrayObjectToString(doctorArray[i].specialties);

                //var li = $("<li class='item' data-index='" + i + "'data-lat='" + lat + "' data-lon='" + lon + "' data-bio='" + bio + "'><div class='collapsible-header'>" + firstName + " " + lastName + ", " + title + "</div><div class='collapsible-body body-item'><div class='row'><img src='" + image + "'><p></p></div><div id='map'></div></div>");
                //var li = $("<li class='item' data-index='" + i + "'data-lat='" + lat + "' data-lon='" + lon + "' data-bio='" + bio + "'><div class='collapsible-header'>" + firstName + " " + lastName + ", " + title + "</div><div class='collapsible-body body-item'><div class='row'><div class='col md-3 sm-12'><img src='" + image + "'></div><p></p></div><div id='map'></div></div>");
                var li = $("<li class='item' data-index='" + i + "'><div class='collapsible-header title-header'>" + firstName + " " + lastName + ", " + title + " - Specialities: " + specialties + "</div><div class='collapsible-body body-item'><div class='row'><div class='col m2 s12'><img class='responsive-img avatar' src='" + image + "'></div><div class='col m10 s12 bio'></div></div><div id='map'></div></div>");

                



                $("#doctorData").append(li);


            }

            // $("#firstEntry").append(firstName, lastName)
        }).catch(function(err) {
            console.error(err);
        })
    };

    $(document).on("click", ".item", function() {
        var index = $(this).attr("data-index");
        var bio = doctorArray[index].profile.bio;
        var content = $(this).find(".bio");
        // content.css("color", "red");

        content.text(bio);

        // add google map in here

        // find div map in here
        var mapTag = $(this).find("#map");
        console.log(mapTag);

        // var latitude = parseFloat($(this).attr("data-lat"));
        // console.log(latitude)
        // var long = parseFloat($(this).attr("data-lon"));
        // console.log(long)

        var latitude = doctorArray[index].practices[0].visit_address.lat;
        console.log(latitude)
        var longtitude = doctorArray[index].practices[0].visit_address.lon;
        console.log(longtitude)

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

});