$(document).ready(function(){	
	for (var i=0; i<27; i++) {
		for (var j=0; j<17; j++) {
			if (Math.round((Math.random())) > 0) {
				$('.sequences ul:nth-child(' + i + ') li:nth-child(' + j + ')').css({'opacity': Math.random()/5.0 + .15});
				$('.sequences ul:nth-child(' + i + ') li:nth-child(' + j + ')').css({'opacity': Math.random()/5.0 + .15});
			}
		}
	}

	$(document).keydown(function(e) {
		console.log(e.keyCode);
		if(e.keyCode == 32) {
			$('.sequences ul li').css({opacity: 0.15});
		}
	});
});