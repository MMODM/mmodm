var audioContext = new (window.AudioContext || window.webkitAudioContext)();

function Sound(source, level) {
	var that = this;
	that.source = source;
	that.buffer = null;
	that.isLoaded = false;

	var getSound = new XMLHttpRequest();
	getSound.open("GET",that.source,true);
	getSound.responseType = "arraybuffer";
	getSound.onload = function() {
		audioContext.decodeAudioData(getSound.response,function(buffer) {
			that.buffer = buffer;
			that.isLoaded = true;
		});
	};
	getSound.send();
}

Sound.prototype.play = function(){

	if(this.isLoaded === true) {
		isOn = true;
		playSound = audioContext.createBufferSource();
		playSound.buffer = this.buffer;
		playSound.connect(audioContext.destination);
		playSound.start(0);
	}
};

var tracks = [
{
	"name": "a",
	"filename": "arp-c2.mp3"
},
{
	"name": "b",
	"filename": "arp-c3.mp3"
},
{
	"name": "c",
	"filename": "base-f4.mp3"
},
{
	"name": "d",
	"filename": "base-f5.mp3"
},
{
	"name": "e",
	"filename": "bell.mp3"
},
{
	"name": "f",
	"filename": "bongo-hi.mp3"
},
{
	"name": "g",
	"filename": "bongo-low.mp3"
},
{
	"name": "h",
	"filename": "chimes.mp3"
},
{
	"name": "i",
	"filename": "conga-hi.mp3"
},
{
	"name": "j",
	"filename": "conga-low.mp3"
},
{
	"name": "k",
	"filename": "cowbell.mp3"
},
{
	"name": "l",
	"filename": "cyan.mp3"
},
{
	"name": "m",
	"filename": "hihat-closed.mp3"
},
{
	"name": "n",
	"filename": "hihat-open.mp3"
},
{
	"name": "o",
	"filename": "kick.mp3"
},
{
	"name": "p",
	"filename": "lofi.mp3"
},
{
	"name": "q",
	"filename": "piano.mp3"
},
{
	"name": "r",
	"filename": "rimshot.mp3"
},
{
	"name": "s",
	"filename": "saw-c4.mp3"
},
{
	"name": "t",
	"filename": "saw-c5.mp3"
},
{
	"name": "u",
	"filename": "shaker.mp3"
},
{
	"name": "v",
	"filename": "snare.mp3"
},
{
	"name": "w",
	"filename": "tambourin.mp3"
},
{
	"name": "x",
	"filename": "wood-hi.mp3"
},
{
	"name": "y",
	"filename": "wood-low.mp3"
},
{
	"name": "z",
	"filename": "wub.mp3"
}
]

$(document).ready(function(){
	console.log(tracks[0].name);
});
