// toggle dark light mode 
var toggle = document.getElementById("checkbox");
var storedTheme = window.localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

if (storedTheme) {
  document.body.classList.add(storedTheme);
  if (storedTheme === "dark") {
    toggle.checked = true;
  } else {
    toggle.checked = false;
  }
}

toggle.addEventListener("change", function() {
  var currentTheme = document.body.classList.contains("dark") ? "dark" : "light";
  var targetTheme = currentTheme === "light" ? "dark" : "light";

  document.body.classList.remove(currentTheme);
  document.body.classList.add(targetTheme);
  window.localStorage.setItem('theme', targetTheme);

  if (targetTheme === "dark") {
    toggle.checked = true;
  } else {
    toggle.checked = false;
  }
});

// fetch music data 
var currentTime = document.getElementById("current-time")
var totalTime = document.getElementById("total-time")
var isPlaying = false;
var index =0;
const playButton = document.getElementById('play-audio');
var playedMusicArtist = document.querySelector(".artist-name")
const playedMusicName = document.querySelector(".music-name")
var playedMusicImage = document.getElementById("music-image")
const musicBar = document.getElementById("music-bar")
var audioElement = document.getElementById('audio');

document.addEventListener("DOMContentLoaded", () => {
    const musicList = document.querySelector('.music-list');
    const currentTime = document.getElementById("current-time");
    const totalTime = document.getElementById("total-time");
    const musicBar = document.getElementById("music-bar");
    let currentPlayingDiv = null;
    let isPlaying = false;

    fetch('music-data.json')
        .then(response => response.json())
        .then(data => {
            data.songs.forEach((song, index) => {
                const musicDiv = document.createElement('div');
                musicDiv.classList.add('music', 'shadow');
                musicDiv.setAttribute("data-index", index);

                const img = document.createElement('img');
                img.src = song.image;
                img.classList.add('rounded-circle', 'music-image');

                const infoDiv = document.createElement('div');
                infoDiv.classList.add('d-flex', 'flex-column', 'justify-content-start', 'gap-1');

                const artistName = document.createElement('span');
                artistName.classList.add('artist-name');
                artistName.textContent = song.artist;

                const musicName = document.createElement('span');
                musicName.classList.add('music-name');
                musicName.textContent = song.title;

                infoDiv.appendChild(artistName);
                infoDiv.appendChild(musicName);

                const musicTime = document.createElement('div');
                musicTime.classList.add('music-time');
                musicTime.textContent = "..."; // Placeholder for time

                const actionsDiv = document.createElement('div');
                actionsDiv.classList.add('actions');

                const playPauseButton = document.createElement('button');
                playPauseButton.textContent = "✩";
              
                playPauseButton.classList.add("btn","btn-transparent","text-primary","fs-3","pe-none")
                  
                  // Initial state as play button
                actionsDiv.appendChild(playPauseButton);

                musicDiv.appendChild(img);
                musicDiv.appendChild(infoDiv);
                musicDiv.appendChild(musicTime);
                musicDiv.appendChild(actionsDiv);

                // Create a new Audio element to preload the metadata
                const tempAudio = new Audio();
                tempAudio.src = song.src;
                tempAudio.addEventListener('loadedmetadata', function () {
                    const totalMinutes = Math.floor(tempAudio.duration / 60);
                    const totalSeconds = Math.floor(tempAudio.duration % 60).toString().padStart(2, '0');
                    musicTime.textContent = `${totalMinutes}:${totalSeconds}`;
                });

                // Add event listener to update the audio element's source when musicDiv is clicked
                musicDiv.addEventListener('click', () => {
                  musicBar.value =0;
                    if (currentPlayingDiv && currentPlayingDiv !== musicDiv) {
                        currentPlayingDiv.classList.remove("active");
                        currentPlayingDiv.querySelector('button').textContent = "✩";
                    playButton.textContent = "▷";    
                    }

                    musicDiv.classList.toggle("active");
                    currentPlayingDiv = musicDiv.classList.contains("active") ? musicDiv : null;

                    if (currentPlayingDiv) {
                        audioElement.src = song.src;
                        audioElement.play();
                        playPauseButton.textContent = "|၊|";
                        playButton.textContent = "❚❚";
                        isPlaying = true;
                        playedMusicImage.classList.add("active")
                        
                        document.querySelector(".music-player").classList.add("active");
                        playedMusicName.textContent = song.title;
                        playedMusicArtist.textContent = song.artist;
                        playedMusicImage.src = song.image;
                    } else {
                        audioElement.pause();
                       isPlaying=false; playPauseButton.textContent = "✩";
                       
                        document.querySelector(".music-player").classList.remove("active");
                    }

                    // Update current time and total duration when metadata is loaded
                    audioElement.addEventListener('loadedmetadata', function () {
                        const totalMinutes = Math.floor(audioElement.duration / 60);
                        const totalSeconds = Math.floor(audioElement.duration % 60).toString().padStart(2, '0');
                        totalTime.textContent = `${totalMinutes}:${totalSeconds}`;
                        musicBar.max = audioElement.duration;

                        const currentMinutes = Math.floor(audioElement.currentTime / 60);
                        const currentSeconds = Math.floor(audioElement.currentTime % 60).toString().padStart(2, '0');
                        currentTime.textContent = `${currentMinutes}:${currentSeconds}`;
                    }, { once: true });

                    // Update current time during playback
                    audioElement.addEventListener('timeupdate', function () {
                        const currentMinutes = Math.floor(audioElement.currentTime / 60);
                        const currentSeconds = Math.floor(audioElement.currentTime % 60).toString().padStart(2, '0');
                        currentTime.textContent = `${currentMinutes}:${currentSeconds}`;
                        musicBar.value = audioElement.currentTime;
                    });
                });

                // Play/pause button event listener
               

                musicList.appendChild(musicDiv);
            });
        })
        .catch(error => console.error('Error fetching the JSON data:', error));

    // Add event listener to update the audio current time when the range input is changed
    musicBar.addEventListener('input', () => {
        audioElement.currentTime = musicBar.value;
    });
});

playButton.addEventListener("click" , () => {
if (audioElement.src) {
            if (!audioElement.paused) {
                playButton.textContent = "▷";
                audioElement.pause();
                playedMusicImage.classList.remove("active")
                isPlaying=false;
            } else {
                playButton.textContent = "❚❚";
                audioElement.play();
                playedMusicImage.classList.add("active")
                isPlaying=true;
            }
        } else {
            alert('Please select a song first.');
        }
})
audioElement.addEventListener("ended" , () => {
  audioElement.currentTime=0;
  audioElement.play();
  isPlaying=true;
})
// detect play audio 


// play phone files function
document.getElementById('file').addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file && file.type.startsWith("audio/")) {
          
                // Set the audio source
                const audioElement = document.getElementById('audio');
                const objectURL = URL.createObjectURL(file);
                audioElement.src = objectURL;
                
                // Read metadata from the file
                const fileReader = new FileReader();
                
                fileReader.onload = function(e) {
                    const arrayBuffer = e.target.result;
                    // Using the jsmediatags library to read metadata
                    jsmediatags.read(new Blob([arrayBuffer]), {
                        onSuccess: function(tag) {
                            const tags = tag.tags;
                            
   audioElement.addEventListener('timeupdate', function () {
                        const currentMinutes = Math.floor(audioElement.currentTime / 60);
                        const currentSeconds = Math.floor(audioElement.currentTime % 60).toString().padStart(2, '0');
                     totalMinutes = Math.floor(audioElement.duration / 60);
                        const totalSeconds = Math.floor(audioElement.duration % 60).toString().padStart(2, '0');   currentTime.textContent = `${currentMinutes}:${currentSeconds}`;
                        musicBar.value = audioElement.currentTime;
                        totalTime.textContent = `${totalMinutes}:${totalSeconds}`;
                        musicBar.max = audioElement.duration;
   })
   playedMusicName.textContent =  (tags.title || 'Unknown');
                            playedMusicArtist.textContent = (tags.artist || 'Unknown');
                            if (tags.picture) {
                                const base64String = arrayBufferToBase64(tags.picture.data);
                                playedMusicImage.src = `data:${tags.picture.format};base64,${base64String}`;
                            }
                        },
                        onError: function(error) {
                            console.log('Error reading tags: ', error);
                        }
                    });
                };
                fileReader.readAsArrayBuffer(file);
                // display audio player 
                const allMusic = document.querySelectorAll(".music")
  allMusic.forEach(music => {
    music.classList.remove("active")
})
            document.querySelector(".music-player").classList.add("active"); 
            audioElement.play();
            isPlaying = true;
            playButton.textContent = "❚❚";
            playedMusicImage.classList.add("active")
            }else {
              alert("The selected element is not of type Audio")
            }
           
        }); 

        function arrayBufferToBase64(buffer) {
            let binary = '';
            const bytes = new Uint8Array(buffer);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        }
    

// Helper function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

// down musoc player and stop playing 
document.getElementById("down").addEventListener('click',() => {
  document.getElementById("music-player").
  classList.remove("active")
  audioElement.pause()
  audioElement.currentTime=0;
  isPlaying=false;
  const allMusic = document.querySelectorAll(".music")
  allMusic.forEach(music => {
    music.classList.remove("active")
})
})

