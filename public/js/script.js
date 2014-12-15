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

function playSound(buffer,type,freq) {
	var source = context.createBufferSource();
	source.buffer = buffer;
	if(type){
		var filter = context.createBiquadFilter();
		filter.type = type;
		filter.frequency.value = freq;
		source.connect(filter);
		filter.connect(context.destination);
		this.filter = filter;
	}
	else
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
}

// Seeding random "data" so that it doesn't look bad while I'm coding
function seed() {
	for (var i=1; i<27; i++) {
		for (var j=1; j<17; j++) {
			if (Math.round((Math.random())) > 0) {
			if (Math.round((Math.random())) > 0) {
			if (Math.round((Math.random())) > 0) {
				$('.sequences ul:nth-child(' + i + ') li:nth-child(' + j + ')').css({'opacity': 1}).animate({'opacity': 0.125}, death);
			}}}
		}
	}
}

function startIntro() {
	for (var k=0; k<83; k++) {
		for (var i=0; i<16; i++) {
			for (var j=0; j<26; j++) {
				var l = j + k;
				$('.sequences ul:nth-child(' + (j+1) + ') li:nth-child(' + (i+1) + ')').delay(0).animate({'opacity': intro[i][l]}, 0);
			}
		}
	}
}

$(document).ready(function() {
	turnOnShortcuts();
	var inputField = $("#simForm input:text");
	inputField.on('focus',function(e){
		console.log('ff');
		e.preventDefault();
		$(document).unbind('keydown');
	}).on('focusout', function(e) {
		turnOnShortcuts();
	});
	$('#simForm').on('submit', function(e){
		e.preventDefault();
		data = inputField.val().split('');
		data.forEach(function(letter, index, arr){
			for(var i=0; i<tracks.length; i++){
				if(letter == tracks[i].name){
					lightObject(i+1,(index+1)%16)
				}
				else if(letter == '-' || letter == ' '){
					offObject(i+1,(index+1)%16)
				}
			}
		})
		inputField.val('');
	})
	function lightObject(x, y){
		$('.sequences ul:nth-child(' + x + ') li:nth-child(' + y + ')').css({'opacity': 1}).animate({'opacity': 0.125}, death);
	}
	function offObject(x, y){
		$('.sequences ul:nth-child(' + x + ') li:nth-child(' + y + ')').css({'opacity': 0.125});
	}
	var socket = io();
	socket.on('keys', function (data) {
		data.forEach(function(letter, index, arr){
			for(var i=0; i<tracks.length; i++){
				if(letter == tracks[i].name){
					lightObject(i+1,(index+1)%16)
				}
				else if(letter == '-' || letter == ' '){
					console.log('beat')
					offObject(i+1,(index+1)%16)
				}
			}
		})
		//
	});

	uiEvents();
	
	play();
});

//Setting up basic timing & loop variables

var mainLoop;
var state = 'stopped';
var time = 1;
var tempo = 120;
var fxpass = 0;
var death = 20000;

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
			playSound(samples[i-1],false,false);
		}
	}
}

function rowFilter(type, freq){
	for (var i=1; i<27; i++) {
		var object = $('.sequences ul:nth-child(' + i + ') li:nth-child(' + time + ')')
		if (object.css('opacity') > .125) {
			pulse(object);
			playSound(samples[i-1],type,freq)
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
	if (tempo + change > 0 && tempo + change < 1000) {
		if (state == 'playing') {
			play(tempo + change);
		} else {
			tempo = tempo + change;
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

function changeFxPass(change) {
	if (fxpass + change < 11 && fxpass + change > -11) {
		fxpass = fxpass + change;
	}

	var width = $('filters').outerWidth();
	var barWidth = $('.slider .bar').width();
	var left = barWidth/2.0;
	var right = barWidth/2.0;
	if (fxpass > 0) {
		right = barWidth/2.0 + (fxpass / 20)*barWidth;
		rowFilter('lowpass',left*24)
	} else if (fxpass < 0) {
		left = barWidth/2.0 - (Math.abs(fxpass) / 20)*barWidth;
		rowFilter('highpass',right*24)
	} else {
		left = barWidth*.4875;
		right = barWidth*.5125;
	}

	$('.slider .bar').css({
		'clip': 'rect(0px,' + right + 'px,' + $(this).height() + 'px,' + left + 'px)'
	});
}

// Helper function
/*setInterval(function() {
	$('.tweet').attr('placeholder',
		'state: ' + state + ', ' +
		'tempo: ' + tempo + ', ' +
		'gater: ' + gater() + ', ' +
		'stutter: ' + stutter() + ', ' +
		'fxpass: ' + fxpass + ', ' +
		'time: ' + time
	);
}, 15);*/
