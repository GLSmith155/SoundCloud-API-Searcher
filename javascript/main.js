/* To do: Add auto-play functionality. Improve search bar. Also a reset. */






var UI = {};


UI.handleEnterPress = function() {
	document.querySelector(".js-search").addEventListener('keypress', function( e ) {
		if ( event.which === 13 ) {
			var inputValue = e.target.value;
			// onValueRead( inputValue );
			//console.log(inputValue);
			SoundCloudAPI.getTrack(inputValue);
			
		}
	});
}

UI.handleSubmitClick = function() {
	document.querySelector(".js-submit").addEventListener('click', function( e ) {
		var inputValue = document.querySelector(".js-search").value;
		//onValueRead( inputValue );
		//console.log(inputValue);
		SoundCloudAPI.getTrack(inputValue);
	});
} 

// // set up the search
UI.handleEnterPress();
UI.handleSubmitClick();

/* 2. Query SoundCloud API */

//SC is an object. .initialize and .get are properties of the SC object.

//Sometimes objects that contain large amounts of code will have their first letter in caps.

var SoundCloudAPI = {};

  SoundCloudAPI.init = function() {

  SC.initialize({
    client_id: 'cd9be64eeb32d1741c17cb39e41d254d'
  });
}

SoundCloudAPI.init();


SoundCloudAPI.getTrack = function(inputValue) {
  // find all sounds of buskers licensed under 'creative commons share alike'
  SC.get('/tracks', {
    q: inputValue
  }).then(function(tracks) {
    console.log(tracks);

    var searchResult = document.querySelector('.js-search-results');
    searchResult.innerHTML = "";
    SoundCloudAPI.renderTracks(tracks, searchResult);
  });
}




/* 3. Display the cards */
SoundCloudAPI.renderTracks = function(tracks) {

tracks.forEach(function(track) {
  console.log(track.artwork_url);

          //card
          var card = document.createElement('div');
          card.classList.add("card");
    
          //image
          var imageDiv = document.createElement('div');
          imageDiv.classList.add("image");
    
          var image_img = document.createElement('img');
          image_img.classList.add("image_img");
          image_img.src = track.artwork_url || 'http://lorempixel.com/100/100/abstract';
    
          imageDiv.appendChild(image_img);
    
          //content
          var content = document.createElement('div');
          content.classList.add('content');
    
          var header = document.createElement('div');
          header.classList.add('header');
          header.innerHTML = '<a href="' + track.permalink_url + '" target="_blank">' + track.title + '</a>';
    
          //button
          var button = document.createElement('div');
          button.classList.add('ui', 'button', 'attached', 'bottom', 'js-button');
    
          var icon = document.createElement('i');
          icon.classList.add('add', 'icon');
    
          var buttonText = document.createElement('span');
          buttonText.innerHTML = 'Add to playlist';
    
          //appendChild
          content.appendChild(header);
    
          button.appendChild(icon);
          button.appendChild(buttonText);

          button.addEventListener('click', function(){
              SoundCloudAPI.getEmbed(track.permalink_url);
          });
    
          card.appendChild(imageDiv);  
          card.appendChild(content);  
          card.appendChild(button);  
    
          var searchResults = document.querySelector(".js-search-results");
          searchResults.appendChild(card);

});

  

}
SoundCloudAPI.getEmbed = function(trackURL) {
console.log("cllick");
SC.oEmbed(trackURL, {
  auto_play: true
}).then(function(embed){
  console.log('oEmbed response: ', embed);

  var sideBar = document.querySelector('.js-playlist');


  var box = document.createElement('div');
    box.innerHTML = embed.html;

  sideBar.insertBefore(box, sideBar.firstChild);
  localStorage.setItem("key", sideBar.innerHTML);

	  // grab the widget object
		var SCWdiget = SoundCloudAPI.getWidget( embed.childNodes[ 0 ] );

		// bind the finish event to init
		SCWdiget.bind('finish', function() {
			alert("FINISHED");
			// Playlist.next();

			// var nextEmbed = sidebar.childNodes[ Playlist.currentTrack ];
			// var nextWidget = SoundCloudAPI.getWidget( nextEmbed.childNodes[ 0 ] );

			// nextWidget.play();
		});
		SCWdiget.bind('play', function() {
			var widgetIndex = Array.from( sidebar.childNodes ).indexOf( embed );
					// OLDer JAVASCRIPT: [].slice.call( sidebar.childNodes ).indexOf( embed ).
			Playlist.currentTrack = widgetIndex;
		});
});





}






var sideBar = document.querySelector('.js-playlist');
sideBar.innerHTML = localStorage.getItem("key");


