
function randomUser(userArray){
  console.log(userArray);
  return userArray[Math.floor(Math.random()*userArray.length)];
}

function getTimeRemaining(endtime){
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor( (t/1000) % 60 );
  var minutes = Math.floor( (t/1000/60) % 60 );
  var hours = Math.floor( (t/(1000*60*60)) % 24 );
  var days = Math.floor( t/(1000*60*60*24) );
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

function getPicture(the_group_id, your_div_class){
		var apiKey = "2a8606045cc0cd8dcda41e5ffd2947f2"; // replace this with your API key
    var favoredUsers = ['49679809@N07','92238955@N06','91534967@N00','23720661@N08'];
    var currentUserId = randomUser(favoredUsers);
		var url_to_a_photo_head = "https://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos&api_key="+apiKey+"&photo_id=";

		var url_to_a_photo_tail = "&format=json&jsoncallback=?";
		// get an array of random photos
		$.getJSON(
			"https://api.flickr.com/services/rest/",
			{
				method: 'flickr.groups.pools.getPhotos',
				api_key: apiKey,
				group_id : the_group_id,
				// user_id : currentUserId,
				user_id : '49679809@N07',
				format: 'json',
				nojsoncallback: 1,
				per_page: 200 // you can increase this to get a bigger array
			},
			function(data){
        console.log(data);
				// if everything went good
				if(data.stat == 'ok'){
					// get a random id from the array
					var photoId = data.photos.photo[ Math.floor( Math.random() * data.photos.photo.length ) ];
					// now call the flickr API and get the picture with a nice size
					$.getJSON(
						"https://api.flickr.com/services/rest/",
						{
							method: 'flickr.photos.getSizes',
							api_key: apiKey,
							photo_id: photoId.id,
							format: 'json',
							nojsoncallback: 1
						},
						function(response){
							if(response.stat == 'ok'){
								var the_url_small = response.sizes.size[3].source;
								var the_url_large = response.sizes.size[9].source;
                function OnImageLoaded (img) {
                  if(img.src == the_url_small){
                    $('.'+your_div_class).append('<div class="smallImage" style="background-image: url(' + the_url_small + ');" />');
                    $('.loader').addClass('finished');
                    PreloadImage (the_url_large);
                  } else{
                    $('.'+your_div_class).append('<div class="largeImage" style="background-image: url(' + the_url_large + ');" />');
                    $('.smallImage').addClass('fade');
                  }
            		}
                function PreloadImage (src) {
                  var img = new Image ();
            			img.onload = function () {OnImageLoaded (this)};
                  img.src = src;
                }

            		PreloadImage (the_url_small);
								// $('.'+your_div_class).append('<div class="smallImage" style="background-image: url(' + the_url_small + ');" />');
							}
							else{
								console.log(" The request to get the picture was not good :\ ")
							}
						}
					);

				}
				else{
					console.log(" The request to get the array was not good");
				}
			}
		);
	};

$(function() {
  getPicture('34741466@N00', 'imageWrapper');
  // Save it using the Chrome extension storage API.
  // chrome.storage.local.clear(function() {
  //   var error = chrome.runtime.lastError;
  //   if (error) {
  //       console.error(error);
  //   }
  // });
  // chrome.storage.local.set({'countdownDate': '2014-9-9'}, function() {
  //   console.log('Settings Saved');
  // });
  // Read it using the storage API

  chrome.storage.local.get(['countdownDate'], function(items) {
    console.log(items.countdownDate);
    if(items.countdownDate == null){
      console.log('No Number Saved');
    } else {
      console.log('Settings retrieved', items);
      var endDate = getTimeRemaining(items.countdownDate);
      console.log(endDate.days);
      if (endDate.days > 0) {
        console.log(endDate);
        $('.countDownDate .number').text(endDate.days);
      } else {
        console.log('Choose New number');
        chrome.storage.local.clear(function() {
          var error = chrome.runtime.lastError;
          if (error) {
              console.error(error);
          }
        });
      }
    }
  });

  $('.chooseDate input[type=submit]').click(function(event) {
    event.preventDefault();
    var newNumber = $('input[name="tripDate"]').val();
    var endDate = getTimeRemaining(newNumber); 
    chrome.storage.local.set({'countdownDate': newNumber}, function() {
      console.log('Settings Saved');
      $('.countDownDate .number').text(endDate.days);
    });
  });
});
