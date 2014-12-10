var tracks = [
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
	loadSample(i,'samples/'+track.filename);
})

function loadSample(id, url) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	// Decode asynchronously and push to samples
	request.onload = function() {
		context.decodeAudioData(request.response, function(buffer) {
			buffer.id=id;
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

function playSound(buffer) {
	var source = context.createBufferSource();
	source.buffer = buffer;
	source.connect(context.destination);
	source.start(0);
}

function samplesLoaded(samples){

	samples.sort(function (a, b) {
		if (a.id < b.id) {
			return -1;
		}
		else if (a.id > b.id) {
			return 1;
		}
		return 0;
	});
	console.log(samples);

}

$(document).ready(function() {
	// Seeding random "data" so that it doesn't look bad while I'm coding
	function seed() {
		for (var i=1; i<27; i++) {
			for (var j=1; j<17; j++) {
				if (Math.round((Math.random())) > 0) {
				if (Math.round((Math.random())) > 0) {
				if (Math.round((Math.random())) > 0) {
					$('.sequences ul:nth-child(' + i + ') li:nth-child(' + j + ')').css({'opacity': 1});
				}}}
			}
		}
	}


	function lightObject(x, y){
		$('.sequences ul:nth-child(' + x + ') li:nth-child(' + y + ')').css({'opacity': 1});
	}

	lightObject(26,1)
	lightObject(26,2)
	lightObject(26,3)
	lightObject(26,4)
	lightObject(26,5)
	lightObject(14,6)
	lightObject(15,5)
	lightObject(15,6)
	lightObject(12,7)
	lightObject(11,2)
	lightObject(10,10)
	lightObject(12,11)
	lightObject(11,16)
	lightObject(11,7)
	lightObject(3,12)

	//lightObject(5,5)
	// Click handlers for effects buttons

	$('.pauseplay').click(function(e) {
		if (state == 'playing') {
			pause();
		} else {
			play();
		}
	});

	$('.stop').click(function(e) {
		stop();
	});

	$('.restart').click(function(e) {
		restart();
	});

	$('.tempo .larrow').click(function(e) {
		changeTempo(-10);
	});

	$('.tempo .rarrow').click(function(e) {
		changeTempo(10);
	});

	$('.menu .clear').click(function(e) {
		stop();
		$('.sequences ul li').css({
			'opacity': 0.125
		});
	});

	$('.effects .clear').click(function(e) {
		stutter(0);
		gater(0);
	});

	$('.stutter .none').click(function(e) {
		stutter(0);
	});

	$('.stutter .full').click(function(e) {
		stutter(1);
	});

	$('.stutter .half').click(function(e) {
		stutter(2);
	});

	$('.stutter .quarter').click(function(e) {
		stutter(3);
	});
	$('.stutter .eighth').click(function(e) {
		stutter(4);
	});

	$('.gater .none').click(function(e) {
		gater(0);
	});

	$('.gater .half').click(function(e) {
		gater(1);
	});

	$('.gater .third').click(function(e) {
		gater(2);
	});

	// Handlers for keyboard buttons
	$(document).keydown(function(e) {
		if (e.keyCode == 46 || e.keyCode == 8) {
			// Backspace / Delete
			e.preventDefault();
			stop();
			$('.sequences ul li').css({
				'opacity': 0.125
			});
		}
		if (e.keyCode == 27) {
			// Esc
			e.preventDefault();
			stop();
		}
		if (e.keyCode == 32) {
			// Spacebar
			e.preventDefault();
			if (state == 'playing') {
				pause();
			} else {
				play();
			}
		}
		if (e.keyCode == 13) {
			// Enter
			e.preventDefault();
			restart();
		}
		if (e.keyCode == 39) {
			// Right Arrow
			e.preventDefault();
			changeTempo(10);
		}
		if (e.keyCode == 37) {
			// Left Arrow
			e.preventDefault();
			changeTempo(-10);
		}
		if (e.keyCode == 220) {
			// \
			e.preventDefault();
			stutter(0);
			gater(0);
		}
		if (e.keyCode == 81) {
			// Q
			e.preventDefault();
			stutter(0);
		}
		if (e.keyCode == 87) {
			// W
			e.preventDefault();
			stutter(1);
		}
		if (e.keyCode == 69) {
			// E
			e.preventDefault();
			stutter(2);
		}
		if (e.keyCode == 82) {
			// R
			e.preventDefault();
			stutter(3);
		}
		if (e.keyCode == 84) {
			// T
			e.preventDefault();
			stutter(4);
		}
		if (e.keyCode == 65) {
			// A
			e.preventDefault();
			gater(0);
		}
		if (e.keyCode == 83) {
			// S
			e.preventDefault();
			gater(1);
		}
		if (e.keyCode == 68) {
			// D
			e.preventDefault();
			gater(2);
		}
	});

	play();
});

//Setting up basic timing & loop variables

var mainLoop;
var state = 'stopped';
var time = 1;
var tempo = 120;

// Basic functions for pulse

function pulse(object) {
	object.addClass('pulse').on('webkitAnimationEnd animationend', function() {
		$(this).removeClass('pulse').off('webkitAnimationEnd animationend');
	});
	object.parent().find('.label').addClass('glow').on('webkitAnimationEnd animationend', function() {
		$(this).removeClass('glow').off('webkitAnimationEnd animationend');
	});
}

function row() {
	for (var i=1; i<27; i++) {
		var object = $('.sequences ul:nth-child(' + i + ') li:nth-child(' + time + ')')
		if (object.css('opacity') > .125) {
			pulse(object);
			playSound(samples[i-1]);
		}
	}
}

// Getter/Setter Effects functions

var gaterState = 0;
var gcounter = 0;

function gater(gate) {
	// Options are (1) 1/2, (2) 2/3
	if (gate > -1) {
		gaterState = gate;
		gcounter = 0;
		$('.gater .button').removeClass('on');
		if (gaterState == 0) {
			$('.gater .none').addClass('on');
		} else if (gaterState == 1) {
			$('.gater .half').addClass('on');
		} else if (gaterState == 2) {
			$('.gater .third').addClass('on');
		}
	} else {
		return gaterState;
	}
}

var stutterState = 0;
var scounter = 0;
var ssplit = 1;

function stutter(stut) {
	// Options are (1) 1, (2) 1/2, (3) 1/4, (4) 1/8
	if (stut > -1) {
		stutterState = stut;
		$('.stutter .button').removeClass('on');
		if (stutterState == 0) {
			ssplit = 1;
			$('.stutter .none').addClass('on');
		} else if (stutterState == 1) {
			ssplit = 1;
			$('.stutter .full').addClass('on');
		} else if (stutterState == 2) {
			ssplit = 2;
			$('.stutter .half').addClass('on');
		} else if (stutterState == 3) {
			ssplit = 4;
			$('.stutter .quarter').addClass('on');
		} else if (stutterState == 4) {
			ssplit = 8;
			$('.stutter .eighth').addClass('on');
		}
		play();
	} else {
		return stutterState;
	}
}

// Beat function computes gater effect

function beat() {
	if (gater() == 1) {
		if (gcounter < 1) {
			gcounter++;
		} else {
			row();
			gcounter = 0;
		}
	} else if (gater() == 2) {
		if (gcounter < 2) {
			gcounter++;
		} else {
			row();
			gcounter = 0;
		}
	} else {
		row();
	}
}

// Play is main timing loop

function play(newTempo) {
	if (newTempo != tempo) {
		if (newTempo > 0) {
			tempo = newTempo;
		}
	}
	if (tempo > 0) {
		if (state == 'paused') {
			for (var i=1; i<27; i++) {
				$('.sequences ul:nth-child(' + i + ') li:nth-child(' + time + ')').removeClass('paused');
			}
			if (time > 15) {
				time = 1;
			} else {
				time++;
			}
		} else if (state == 'playing') {
			clearInterval(mainLoop);
		}
		$('.off').removeClass('off');
		$('.play').addClass('off');
		mainLoop = setInterval(function() {
			beat();
			if (stutter() > 0) {
				if (scounter < 1) {
					time++;
					scounter++;
				} else {
					if (time < 2) {
						time = 16;
					} else {
						time--;
					}
					scounter = 0;
				}
			} else {
				time++;
			}
			if (time>16) { time = 1; }
		}, (1000.0/(tempo/60.0))/(4.0*ssplit));
		state = 'playing';
	}
}

// Secondary playback functions

function pause() {
	if (state == 'playing') {
		clearInterval(mainLoop);
		for (var i=1; i<27; i++) {
			$('.sequences ul:nth-child(' + i + ') li:nth-child(' + time + ')').addClass('paused');
		}
		$('.off').removeClass('off');
		$('.pause').addClass('off');
		state = 'paused';
	}
}

function stop() {
	time = 1;
	gater(0);
	stutter(0);
	clearInterval(mainLoop);
	$('.paused').removeClass('paused');
	$('.off').removeClass('off');
	$('.pause').addClass('off');
	state = 'stopped';
}

function restart() {
	$('.paused').removeClass('paused');
	$('.off').removeClass('off');
	$('.pause').addClass('off');
	time = 1;
	gcounter = 0;
	stutter(0);
	play();
}

function changeTempo(change) {
	if (state == 'playing') {
		if (tempo + change > 0 && tempo + change < 1000) {
			play(tempo + change);
		}
	}
	if (tempo < 100) {
		$('.tempo .text').html('&nbsp;&nbsp;' + tempo);
	} else if (tempo < 10) {
		$('.tempo .text').html('&nbsp;&nbsp;&nbsp;&nbsp;' + tempo);
	} else {
		$('.tempo .text').html(tempo);
	}
}

// Helper function

setInterval(function() {
	$('.tweet').attr('placeholder',
		'state: ' + state + ', ' +
		'tempo: ' + tempo + ', ' +
		'gater: ' + gater() + ', ' +
		'stutter: ' + stutter() + ', ' +
		'time: ' + time
	);
}, 15);
