function uiEvents() {

	// Click handler for sound on labels

	$('.label').on('click', function() {
		playSound(samples[$('.' + $(this).text()).index()]);
	})

	// Click handlers for effects buttons

	var drag = false;
	$('.filters:not(.sliding)').on('click', function() {
		$(this).addClass('sliding');
		$(this).on('mousedown', function(e) {
			drag = true;
		}).on('mouseup', function(e) {
			drag = false;
		})
		$(this).on('mousemove mousedown', function(e) {
			if (drag) {
				var position = e.pageX - $(this).offset().left;
				var width = $(this).outerWidth();
				var barWidth = $('.slider .bar').width();
				if (position + width/60.0 < width/2.0 - width/60.0) {
					fxpass = -1 * (10 - Math.floor(position / 10.0));
				} else if (position - width/60.0 > width/2.0 + width/60.0) {
					fxpass = Math.floor(position / 10.0) - 9;
				} else {
					fxpass = 0;
				}
				var left = barWidth/2.0;
				var right = barWidth/2.0;
				if (fxpass > 0) {
					right = barWidth/2.0 + (fxpass / 20)*barWidth;
					rowFilter('lowpass',right*24)
				} else if (fxpass < 0) {
					left = barWidth/2.0 - (Math.abs(fxpass) / 20)*barWidth;
					rowFilter('lowpass',left*24)
				} else {
					left = barWidth*.4875;
					right = barWidth*.5125;
				}
				$('.slider .bar').css({
					'clip': 'rect(0px,' + right + 'px,' + $(this).height() + 'px,' + left + 'px)'
				});
			}
		});
		changeFxPass(0);
	});

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
}

// Handlers for keyboard buttons

function turnOnShortcuts(){
	$(document).keydown(function(e) {
		if (e.keyCode == 46 || e.keyCode == 8) {
			// Backspace / Delete
			e.preventDefault();
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
		if (e.keyCode == 189) {
			// _-
			e.preventDefault();
			changeFxPass(-1);
		}
		if (e.keyCode == 187) {
			// +=
			e.preventDefault();
			changeFxPass(1);
		}
	});
}