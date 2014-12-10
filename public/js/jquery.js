$(document).ready(function(){	
	for (var i=0; i<27; i++) {
		for (var j=0; j<17; j++) {
			if (Math.round((Math.random())) > 0) {
				$('.sequences ul:nth-child(' + i + ') li:nth-child(' + j + ')').css({'opacity': .15});
				$('.sequences ul:nth-child(' + i + ') li:nth-child(' + j + ')').css({'opacity': .15});
			}
		}
	}

	$(document).keydown(function(e) {
		console.log(e.keyCode);
		if (e.keyCode == 46 || e.keyCode == 8) {
			// Backspace / Delete
			e.preventDefault();
			$('.sequences ul li').css({
				'opacity': 0.15
			});
			playState('paused');
		}
		if (e.keyCode == 32) {
			// Spacebar
			if (playState() === 'running') {
				playState('paused');
			} else {
				playState('running');
			}
		}
		if (e.keyCode == 38) {
			// Up Arrow
		}
		if (e.keyCode == 40) {
			// Down Arrow
		}
	});
});

function playState(state) {
	if (state === 'running') {
		$('.sequences ul li').css({
			'-webkit-animation-play-state': 'running',
			'-moz-animation-play-state': 'running',
			'animation-play-state': 'running'
		});
		return state;
	} else if (state === 'paused') {
		$('.sequences ul li').css({
			'-webkit-animation-play-state': 'paused',
			'-moz-animation-play-state': 'paused',
			'animation-play-state': 'paused'
		});
		return state;
	} else {
		return $('.sequences ul li').css('animation-play-state');
	}
}