function getPicture(the_user_id, your_div_id){
		var apiKey = "2a8606045cc0cd8dcda41e5ffd2947f2"; // replace this with your API key

		var url_to_a_photo_head = "https://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos&api_key="+apiKey+"&photo_id=";

		var url_to_a_photo_tail = "&format=json&jsoncallback=?";

		// get an array of random photos
		$.getJSON(
			"https://api.flickr.com/services/rest/",
			{
				method: 'flickr.groups.pools.getPhotos',
				api_key: apiKey,
				group_id : the_user_id,
				user_id : '49679809@N07',
				format: 'json',
				nojsoncallback: 1,
				per_page: 100 // you can increase this to get a bigger array
			},
			function(data){
        console.log(data);
				// if everything went good
				if(data.stat == 'ok'){
					// get a random id from the array
					var photoId = data.photos.photo[ Math.floor( Math.random() * data.photos.photo.length ) ];
          console.log(photoId);
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
              console.log(response);
							if(response.stat == 'ok'){
								var the_url = response.sizes.size[9].source;
                console.log(the_url);
								$('body').append('<img src="' + the_url + '" />');
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

getPicture('34741466@N00', 'body');
