var myPlayList;
var playlistCustom = [];
let codeVerifier = localStorage.getItem('code_verifier');

const urlParams = new URLSearchParams(window.location.search);
let code = urlParams.get('code');

let body = new URLSearchParams({
  grant_type: 'authorization_code',
  code: code,
  redirect_uri: 'http://127.0.0.1:5500/Spotify_Isaias/playlist.html',
  client_id: '6f162346c8a14aeb8a5ccd323fd19da3',
  code_verifier: codeVerifier
});

async function updateToken(){

  const response = fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('HTTP status ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      localStorage.setItem('access_token', data.access_token);
      getProfile();
    })
    .catch(error => {
      console.error('Error:', error);
    });

}

  async function getProfile() {
    let accessToken = localStorage.getItem('access_token');
  
    const response = await fetch('https://api.spotify.com/v1/playlists/5kc1GDZ2NTrDduvvW81WvE', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
  
    const data = await response.json();
    myPlayList = data;
    showT();
  }
  
  updateToken();

  function showT(){
    document.getElementById('play-title').textContent = myPlayList.name;

    myPlayList.tracks.items.forEach((cancion,index) => {
        const tr = document.createElement('tr');
        const tdImage = document.createElement('td');
        const image = document.createElement('img');
        const tdCancion = document.createElement('td');
        const tdArtista = document.createElement('td');
        const tdAlbum = document.createElement('td');
        const adButton = document.createElement('button');

        image.setAttribute('src',`${cancion.track.album.images[0].url}`);
        image.setAttribute('class','imageSize');
      
        tdCancion.textContent = cancion.track.name;
        cancion.track.artists.forEach(artist =>{
        tdArtista.textContent = artist.name;
      });

      tdAlbum.textContent = cancion.track.name;

      adButton.setAttribute('onclick',`customAdd(${index})`);
      adButton.textContent = 'Add list';

      tdImage.appendChild(image);

      tr.appendChild(tdImage);
      tr.appendChild(tdCancion);
      tr.appendChild(tdArtista);
      tr.appendChild(tdAlbum);
      tr.appendChild(adButton);
      
      document.getElementById('playlist-cont').appendChild(tr);
    });
  }

  function customAdd(index){
    const newSound = myPlayList.tracks.items[index];
    if(validateSongRepeat(newSound)){
      alert('La cancion: '+newSound.track.name+' ya existe');
    }
    else{
      playlistCustom.push(newSound);
      showPlayListCustom();
    }
  }

  function showPlayListCustom(){

    document.getElementById('playlist-cont-custom').innerHTML = '';

    playlistCustom.forEach((cancion,index)=>{

      const tr = document.createElement('tr');
      const tdImage = document.createElement('td');
        const image = document.createElement('img');
      const tdCancion = document.createElement('td');
      const tdArtista = document.createElement('td');
      const tdAlbum = document.createElement('td');
      const deleteButton = document.createElement('button');

      image.setAttribute('src',`${cancion.track.album.images[0].url}`);
      image.setAttribute('class','imageSize');
      
      tdCancion.textContent = cancion.track.name
      cancion.track.artists.forEach(artist =>{
        tdArtista.textContent = artist.name;
      });

      tdAlbum.textContent = cancion.track.album.name;

      deleteButton.setAttribute('onclick',`deleteSong(${index})`);
      deleteButton.textContent = 'Delete song';

      tdImage.appendChild(image);

      tr.appendChild(tdImage);
      tr.appendChild(tdCancion);
      tr.appendChild(tdArtista);
      tr.appendChild(tdAlbum);
      tr.appendChild(deleteButton);

      document.getElementById('playlist-cont-custom').appendChild(tr);
    });

  }

  function deleteSong(index){
    playlistCustom.splice(index,1);
    showPlayListCustom();
  }

  function validateSongRepeat(newSound){
    return playlistCustom.includes(newSound);
  }