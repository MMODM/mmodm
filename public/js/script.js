/*var tracks = [
{
"id": 0,
"name": "a",
"filename": "arp-c2.mp3"
},
{
"id": 1,
"name": "b",
"filename": "arp-c3.mp3"
},
{
"id": 2,
"name": "c",
"filename": "base-f4.mp3"
},
{
"id": 3,
"name": "d",
"filename": "base-f5.mp3"
},
{
"id": 4,
"name": "e",
"filename": "bell.mp3"
},
{
"id": 5,
"name": "f",
"filename": "bongo-hi.mp3"
},
{
"id": 6,
"name": "g",
"filename": "bongo-low.mp3"
},
{
"id": 7,
"name": "h",
"filename": "chimes.mp3"
},
{
"id": 8,
"name": "i",
"filename": "conga-hi.mp3"
},
{
"id": 9,
"name": "j",
"filename": "conga-low.mp3"
},
{
"id": 10,
"name": "k",
"filename": "cowbell.mp3"
},
{
"id": 11,
"name": "l",
"filename": "cyan.mp3"
},
{
"id": 12,
"name": "m",
"filename": "hihat-closed.mp3"
},
{
"id": 13,
"name": "n",
"filename": "hihat-open.mp3"
},
{
"id": 14,
"name": "o",
"filename": "kick.mp3"
},
{
"id": 15,
"name": "p",
"filename": "lofi.mp3"
},
{
"id": 16,
"name": "q",
"filename": "piano.mp3"
},
{
"id": 17,
"name": "r",
"filename": "rimshot.mp3"
},
{
"id": 18,
"name": "s",
"filename": "saw-c4.mp3"
},
{
"id": 19,
"name": "t",
"filename": "saw-c5.mp3"
},
{
"id": 20,
"name": "u",
"filename": "shaker.mp3"
},
{
"id": 21,
"name": "v",
"filename": "snare.mp3"
},
{
"id": 22,
"name": "w",
"filename": "tambourin.mp3"
},
{
"id": 23,
"name": "x",
"filename": "wood-hi.mp3"
},
{
"id": 24,
"name": "y",
"filename": "wood-low.mp3"
},
{
"id": 25,
"name": "z",
"filename": "wub.mp3"
}
]

window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var samples = [];
var loader=0;

tracks.forEach(function(track, i, arr){
loadSample('samples/'+track.filename);
})

function loadSample(url) {
var request = new XMLHttpRequest();
request.open('GET', url, true);
request.responseType = 'arraybuffer';

// Decode asynchronously and push to samples
request.onload = function() {
context.decodeAudioData(request.response, function(buffer) {
samples.push(buffer);
incLoader(loader++)
}, function(err){});
}
request.send();

}

function incLoader(loader){
if(loader == tracks.length-1)
return samplesLoaded(samples);
}

function playSound(buffer, time) {
var source = context.createBufferSource();
source.buffer = buffer;
source.connect(context.destination);
source.start(time);
}

function samplesLoaded(samples){
var kick = samples[14];
var snare = samples[14];
var hihat = samples[13];
//playSound(kick,0)
//playSound(kick,0.5)
//playSound(kick,1)
playSound(kick,0)
playSound(kick,1)

for (var bar = 0; bar < 2; bar++) {
var time = startTime + bar * 8 * eighthNoteTime;
// Play the bass (kick) drum on beats 1, 5
playSound(kick, time);
playSound(kick, time + 4 * eighthNoteTime);

// Play the snare drum on beats 3, 7
playSound(snare, time + 2 * eighthNoteTime);
playSound(snare, time + 6 * eighthNoteTime);

// Play the hi-hat every eighth note.
for (var i = 0; i < 8; ++i) {
playSound(hihat, time + i * eighthNoteTime);
}
}
}

$(document).ready(function(){

});*/
