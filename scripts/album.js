


var createSongRow = function(songNumber, songName, songLength) {
    var template =
    '<tr class="album-view-song-item">'
 + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
 + '  <td class="song-item-title">' + songName + '</td>'
 + '  <td class="song-item-duration">' + songLength + '</td>'
 + '</tr>'
 ;

    var $row = $(template);


    var clickHandler = function(){
      var songItemNumber = parseInt($(this).attr('data-song-number'));
      if (currentlyPlayingSongNumber !== songNumber) {
             $(this).html(pauseButtonTemplate);
             setSong(songNumber);
             currentSoundFile.play();
             updatePlayerBarSong();
         } else if (currentlyPlayingSongNumber === songNumber) {
             if (currentSoundFile.isPaused()){
               currentSoundFile.play();
               $(this).html(pauseButtonTemplate);
             }else{
               currentSoundFile.pause();
               $(this).html(playButtonTemplate);
               $('.main-controls .play-pause').html(playerBarPlayButton);
             }
         }

    };

    var onHover = function(event){

      var songItem = $(this).find('.song-item-number');
      var songItemNumber = parseInt(songItem.attr('data-song-number'));


      if (songItemNumber != currentlyPlayingSongNumber){
          songItem.html(playButtonTemplate);
      }

    };
    var offHover = function(event){

      var songItem = $(this).find('.song-item-number');
      var songItemNumber = parseInt(songItem.attr('data-song-number'));

      if (songItemNumber != currentlyPlayingSongNumber){
        songItem.html(songItemNumber);
      }


    };



    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);

    return $row;
};


var setCurrentAlbum = function(album){

  currentAlbum = album;


  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' '+ album.label);
  $albumImage.attr('src', album.albumArtUrl);


  $albumSongList.empty();

  for (var i = 0; i < album.songs.length; i++) {
      var $newRow = createSongRow(i+1, album.songs[i].title, album.songs[i].duration);
      $albumSongList.append($newRow);
    }
  };

var trackIndex = function(album, song){
  return album.songs.indexOf(song);
}

var nextSong = function(){
  var getLastSongNumber = function(index) {
       return index == 0 ? currentAlbum.songs.length : index;
   };

   var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
   currentSongIndex++;

   if (currentSongIndex >= currentAlbum.songs.length) {
       currentSongIndex = 0;
   }

   setSong(currentSongIndex + 1);

   currentSoundFile.play();
   updatePlayerBarSong();

   var lastSongNumber = getLastSongNumber(currentSongIndex);
   var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
   var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

   $nextSongNumberCell.html(pauseButtonTemplate);
   $lastSongNumberCell.html(lastSongNumber);
}

var previousSong = function(){
  var getLastSongNumber = function(index) {
       return index == (currentAlbum.songs.length - 1) ? 1 : index+2;
   };

   var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
   currentSongIndex--;

   if (currentSongIndex < 0) {
       currentSongIndex = currentAlbum.songs.length - 1;
   }

   setSong(currentSongIndex + 1);

   currentSoundFile.play();
   updatePlayerBarSong();

   var lastSongNumber = getLastSongNumber(currentSongIndex);
   var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
   var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

   $nextSongNumberCell.html(pauseButtonTemplate);
   $lastSongNumberCell.html(lastSongNumber);
}

var setSong = function(songNumber){
  if (currentSoundFile){
    currentSoundFile.stop();
  }
  currentlyPlayingSongNumber = songNumber;
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    formats: ['mp3'],
    preload: true
  });
  setVolume(currentVolume);
};

var setVolume = function(volume){
  if (currentSoundFile){
    currentSoundFile.setVolume(volume);
  }
}

var togglePlayFromPlayerBar = function(){
  if (currentSoundFile.isPaused()){
    getSongNumberCell(currentlyPlayingSongNumber).html(playerBarPauseButton);
    $mainControls.html(playerBarPauseButton);
    currentSoundFile.play();
  }else{
    getSongNumberCell(currentlyPlayingSongNumber).html(playerBarPlayButton);
    $mainControls.html(playerBarPlayButton);
    currentSoundFile.pause();
  }
};

var getSongNumberCell = function(number){
  return $('.song-item-number[data-song-number="' + number + '"]');
}

var updatePlayerBarSong = function(){

  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
  $('.main-controls .play-pause').html(playerBarPauseButton);
}


var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

//album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"<span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;



var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $mainControls = $('.main-controls .play-pause')


$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $mainControls.click(togglePlayFromPlayerBar);

  });
