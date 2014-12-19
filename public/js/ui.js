function uiEvents() {

	// Enable Tooltips

	$('.tooltip').tooltipster();

	// Click handler for help menu

	$('.help').on('click', function() {
		$('body').toggleClass('helping');
		$('body.helping').on('click', function() {
			$(this).removeClass('helping');
			$(this).off('click');
			$('.help').html('?');
			$('.help').tooltipster('content', 'Help');
		});
		if ($('body').hasClass('helping')) {
			$(this).html('<img src="images/clear-menu.png" alt="X" />');
			$(this).tooltipster('content', 'Close');
		} else {
			$(this).html('?');
			$(this).tooltipster('content', 'Help');
		}
		return false;
	});

	// Click handler for sound on labels

	$('.label').on('click', function() {
		playSound(samples[$('.' + $(this).text()).index()]);
		return false;
	});

	// Click handler for text generation on labels

	// $('.sequences ul li:not(:last-child)').on('click', function() {
	// 	var tweet = $('.tweet').attr('value');
	// 	var letter = $(this).parent().attr('class');
	// 	$('.tweet').attr('value', tweet + letter);
	// 	if (tweet === "") {
	// 		var sequence = "----------------"
	// 		$('.tweet').attr('value', sequence.substr(0, $(this).index()) + letter + sequence.substr($(this).index()+1));
	// 	} else if (tweet.length == 16) {
	// 		$('.tweet').attr('value', tweet.substr(0, $(this).index()) + letter + tweet.substr($(this).index()+1));
	// 	}
	// })
	function bin2String(array) {
		var result = "";
		for (var i = 0; i < array.length; i++) {
			result += String.fromCharCode(parseInt(array[i], 8));
		}
		return result;
	}


	// Click handler for locked column

	$('.sequences ul').on('click', function() {
		lockColumn($(this).index());
		if ($('.save').hasClass('saved')) {
			$('.save').removeClass('saved');
			saveState = [];
			undoSave = [];
			$('.save').tooltipster('destroy');
			$('.save').tooltipster({'content': 'Save & Share'});
		}
	});

	// Click handler for saving state

	$('.save').on('click', function() {

		if ($(this).hasClass('saved')) {

			$.each(lock, function(index, value) {
				if ($.inArray(index, undoSave) < 0) {
					lockColumn(index);
				}
			});

			$(this).removeClass('saved');
			saveState = [];
			undoSave = [];
			$(this).tooltipster('destroy');
			$(this).tooltipster({'content': 'Save & Share'});

		} else {

			$.each(lock, function(index, value) {
				if (value < 1) {
					lockColumn(index);
				} else {
					undoSave.push(index);
				}
			});
			$(this).addClass('saved');

			saveState = [];
			var saveString = [];
			for (var i=1; i<27; i++) {
				for (var j=1; j<17; j++) {
					var opacity = $('.sequences ul:nth-child(' + i + ') li:nth-child(' + j + ') span').css('opacity');
					if (opacity < 1) {
						saveString.push("-");

					} else {
						saveString.push(tracks[i-1].name);
					}
				}
			}
			var longState = saveString.join('')
			console.log(longState)

			var request = new XMLHttpRequest();
			request.open('GET', '/save/'+longState, true);
			request.send();

			/*for (var i=8;i<416;i+=8) {
				saveState.push(saveString.join('').substring(i-8, i));
			}*/
			var ell = $(this);

			request.onreadystatechange = function() {
				if (request.readyState == 4 && request.status == 200){
					saveUrl = document.location.host+"/sm/"+request.responseText.replace(/"/g, "");

					ell.tooltipster('destroy');
					ell.tooltipster({
						'content': $('<span class="saveUrl" contenteditable="true">' + saveUrl + '</span>'),
						'interactive': 'true'
					}).tooltipster('show');
					$('.saveUrl').focus().selectText();

					var tweet = $('.tweet').attr('value');
					if (tweet === "") {
						$('.tweet').attr('value', tweet + saveUrl);
					}
				}
			};

		}

		return false;
	});

	$('#saveUrl').on('click', function() {
		$(this).select();
		return false;
	});

	jQuery.fn.selectText = function(){
	   var doc = document;
	   var element = this[0];
	   console.log(this, element);
	   if (doc.body.createTextRange) {
	       var range = document.body.createTextRange();
	       range.moveToElementText(element);
	       range.select();
	   } else if (window.getSelection) {
	       var selection = window.getSelection();
	       var range = document.createRange();
	       range.selectNodeContents(element);
	       selection.removeAllRanges();
	       selection.addRange(range);
	   }
	};

	// Click handler for opening room

	$('.room').on('click', function() {
		$(this).addClass('opened');
		$('.roomform').fadeIn();
		$(this).tooltipster('disable');
		return false;
	});

	$('.roomform input:text').on('focus',function(e){
		e.preventDefault();
		$(document).unbind('keydown');
	}).on('focusout', function(e) {
		turnOnShortcuts();
	});

	$('.roomform input:submit').on('click', function(e) {
		e.preventDefault();

		document.location.href = '/'+$('.roomform input:text').attr('value');

		$('.room').removeClass('opened');
		$('.roomform').fadeOut(function() {
			$('.roomform input:text').attr('value', '');
		});
		$('.room').tooltipster('enable');
		return false;
	});

	// Click handlers for effects buttons

	var drag = false;
	$('.filters:not(.sliding)').on('click', function() {
		$(this).addClass('sliding');
		if ($(this).hasClass('tooltip')) {
			$(this).removeClass('tooltip');
			$(this).tooltipster('destroy');
		}
		$(this).attr('title', '');
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
		return false;
	});

	$('.pauseplay').click(function(e) {
		if (state == 'playing') {
			pause();
		} else {
			play();
		}
		return false;
	});

	$('.stop').click(function(e) {
		stop();
		return false;
	});

	$('.restart').click(function(e) {
		restart();
		return false;
	});

	$('.tempo .larrow').click(function(e) {
		changeTempo(-10);
		return false;
	});

	$('.tempo .rarrow').click(function(e) {
		changeTempo(10);
		return false;
	});

	$('.menu .clear').click(function(e) {
		for (var i=1; i<27; i++) {
			for (var j=1; j<17; j++) {
				offObject(i, j);
			}
		}
		clearLock();
		$('.stream').empty();
		return false;
	});

	$('.effects .clear').click(function(e) {
		stutter(0);
		gater(0);
		clearFxPass();
		return false;
	});

	$('.stutter .none').click(function(e) {
		stutter(0);
		return false;
	});

	$('.stutter .full').click(function(e) {
		stutter(1);
		return false;
	});

	$('.stutter .half').click(function(e) {
		stutter(2);
		return false;
	});

	$('.stutter .quarter').click(function(e) {
		stutter(3);
		return false;
	});
	$('.stutter .eighth').click(function(e) {
		stutter(4);
		return false;
	});

	$('.gater .none').click(function(e) {
		gater(0);
		return false;
	});

	$('.gater .half').click(function(e) {
		gater(1);
		return false;
	});

	$('.gater .third').click(function(e) {
		gater(2);
		return false;
	});
}

// Handlers for keyboard buttons

function turnOnShortcuts(){
	$(document).keydown(function(e) {
		if (e.keyCode == 46 || e.keyCode == 8) {
			// Backspace / Delete
			e.preventDefault();
			for (var i=1; i<27; i++) {
				for (var j=1; j<17; j++) {
					offObject(i, j);
				}
			}
			clearLock();
			$('.stream').empty();
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
