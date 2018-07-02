// ===========================================================================
// ==  
// ==  RECENTLY DONE
// ==  
// ==  * Fixed Dissolve effect when used with multiphoto questions. There's one in Space Quiz.
// ==	 - My fix is backward-compatible. Need to update quizMaker to put multiphotos into a div.layer
// ==  
// ==  
// ==  TO DO LIST
// ==  
// ==  * Beef up effect-scroll.
// ==    - Allow it to take pixel offsets or percentages?
// ==    - Make it work on question load and on user answer, similar to sound effects. 
// ==    - Use CSS3 transforms instead of jquery math
// ==  
// ==  * Refactor references to userChoice.
// ==    - Instead of passing a number, pass the actual jQuery object for the AnswerLine
// ==  
// ===========================================================================




var judgmentImg = '';
var totalQues = 0;
var quesNum = 0;
var score = 0;
var basePath = '';
var scoringRangeSize = scoringRange.length;
var quizUrl = document.URL;
// HTML assets on STLtoday get a funky title that looks like this:
// Html : The Political Gaffes Quiz : Stltoday!
// So let's strip away the prefix and suffix.
var quizTitle = document.title.split(' : ')[0];
document.title = quizTitle;
var hasAudio = checkAudio();

// Add "no-touch" class if this is not a mobile device.
// This is necessary so I can keep :hover classes from appearing on mobile devices.
if ( !('ontouchstart' in document.documentElement) ) {
	document.documentElement.className += ' no-touch';
}


// A callback function for effect-dissolve.
// Loops backward through multiple images dissolving each until it gets to the 1st.
var dissolve = function() {
	if ( jQuery(this).index() !== 1 ) {
		jQuery(this).prev().fadeOut(2000, dissolve);
	}
};



// jQUERY READY HANDLER
// The script must be enclosed entirely within this handler because
// stltoday.com uses .noConflict, which removes the $ variable.

jQuery(document).ready(function($) {

	// No need to hard-code length of quiz. Just count the questions.
	totalQues = $('#quiz .questions').length;
	$('#quiz .spinningWheel').remove();
	$('#quiz .questions').hide();
	$('#quiz #scoring').hide();

	addEffects();

	// Is it a newer quiz with a cover?
	if ( $('.cover').length ) {
		// do stuff
		$('#playButton').click(function(){
			$('#playButton').unbind('click').hide();
			$('.cover').hide();
			playQuiz();
		});
	}
	// If it's an older quiz, go straight to play.
	else {
		playQuiz();
	}



	// cycle through the quiz questions and add any bells/whistles needed for transitions
	function addEffects() {
		// have to edit this when I'm testing
//		var splitSeparator = 'Mardi-Gras-masks';
		var splitSeparator = 'content';

		for (i=0; i<totalQues; i++) {
			var $thisQuestion = $('#question' + i);
			imageNum = i;
			if (i<10) { imageNum = '0'+imageNum; }
			// Effect-dissolve allows several images to fade into one another after question is answered.
			if ( checkDissolve( $thisQuestion ) ) {
				// this stuff is no longer necessary. Script now supports multiple <img> elements
				// instead of one background-image property.
				/*
				var theUrl = $thisQuestion.children('.photos').attr('data');
				$thisQuestion.children('.photos').css('background-image', 'url(' + theUrl + ')');
				$thisQuestion.children('.photos').css('background-position', '0px 4px');
				$thisQuestion.children('.photos').css('background-repeat', 'no-repeat');
				*/
				// the lower opacity with MultiPhoto questions doesn't work well with a background image
				if ( $thisQuestion.hasClass('multiphoto') ) {
					$thisQuestion.find('.multiphoto .photos img').css({ opacity: 1 });
				}
			}

			// Effect-sound allows for sounds to be played "before" and/or "after" a question.
			if ( checkSound( $thisQuestion ) ) {
				$thisQuestion.children('.sounds').hide();
				// check for <audio> support.
				if ( !hasAudio ) {
					$('.cover p').html('It looks like your browser doesn\'t support the sound effects used in this quiz. Please consider <a target="_blank" href="//browsehappy.com/">upgrading your browser</a>.');
				}
				else {
				}
			}

			// The following Effects still are not implemented in quizMaker.
			// Have to be added manually to a quiz.

			// Transition-scroll allows a foreground image to be positioned then
			// scrolled to a different position after the question is answered.
			// Used only in Mardi Gras masks game and Bilbo-Weatherbird quiz
			if ( checkScroll( $thisQuestion) ) {
				$thePhoto = $thisQuestion.find('.photos img');

				// grab any offsets specified in HTML
				var xScrollFrom = $thisQuestion.attr('xScrollFrom');
				var yScrollFrom = $thisQuestion.attr('yScrollFrom');

				if (typeof xScrollFrom !== "undefined") {
					var xStart = parseInt( xScrollFrom );
					$thePhoto.css({
						left: xStart
					});
				}

				if (typeof yScrollFrom !== "undefined") {
					var yStart = parseInt( yScrollFrom );
					$thePhoto.css({
						top: yStart
					});
				}
			}
			// transition-bg just adds a background-image. 
			// Used only in the Mardi Gras masks game.
			if ( checkBg( $thisQuestion ) ) {
				$thisQuestion.show();
				var imageUrl = $thisQuestion.find('.photos img:first-child')[0].src.split(splitSeparator).shift();
				var theUrl = imageUrl + splitSeparator + '/' + imageNum + 'b-fade.jpg';
				$thisQuestion.children('.photos').css('background-image', 'url(' + theUrl + ')');
				$thisQuestion.children('.photos').css('background-position', '0px 4px');
				$thisQuestion.children('.photos').css('background-repeat', 'no-repeat');
				$thisQuestion.children('.photos').css('background-size', 'contain');
				$thisQuestion.hide();
			}
		}
	}

	// NEW - not yet implemented in quizMaker
	function checkSound($thisQuestion) {
		return $thisQuestion.hasClass('effect-sound');
	}

	// NEW - not yet implemented in quizMaker
	function checkZoomIn($thisQuestion) {
		return $thisQuestion.hasClass('effect-zoom-in');
	}
	// NEW - not yet implemented in quizMaker
	function checkZoomOut($thisQuestion) {
		return $thisQuestion.hasClass('effect-zoom-out');
	}

	// implemented in quizMaker
	function checkDissolve($thisQuestion) {
		return $thisQuestion.hasClass('effect-dissolve');
	}

	// legacy
	function checkScroll($thisQuestion) {
		return $thisQuestion.hasClass('transition-scroll');
	}

	function checkBg($thisQuestion) {
		return $thisQuestion.hasClass('transition-bg');
	}


	// determine which type of quiz question we have, then use the appropriate Hover and Click handlers

	function playQuiz() {
		var $thisQuestion = $('#question' + quesNum);
		$thisQuestion.show();
		var hasMultiPhoto = $thisQuestion.hasClass('multiphoto');
		var hasMultiChoice = $thisQuestion.hasClass('multichoice');

		if ( hasMultiPhoto ) {
			randomizeMultiPhoto();
			multiPhotoHover();
			multiPhotoClick();
		}
		else if ( hasMultiChoice ) {
			randomizeMultiChoice();
			multiChoiceHover();
			multiChoiceClick();
		}
		else {
			// T/F usually don't need randomization (should be in same order) -- unless you 
			// are using custom labels. So, check if randomizeMultiChoice variable flag exists.
			// If so, then randomize.
			if (typeof randomTrueFalse != "undefined") {
				randomizeMultiChoice();
			}
			multiChoiceHover();
			multiChoiceClick();
		}
		// Play "before" sound, if there is one
		if ( checkSound($thisQuestion) && hasAudio ) {
			var $beforeSound = $thisQuestion.find('.sounds .before');
			// is there a "before" sound?
			if ( $beforeSound.length ) {
				// The jQuery wrapper doesn't know about play(). We have to invoke
				// on the native dom element. get(0) grabs that native element.
//				$beforeSound.get(0).currentTime = 0;
				$beforeSound.get(0).play();
			}
		} 
	}


	// MULTIPLE PHOTOS HOVER HANDLERS

	function multiPhotoHover() {
		$('#ques' + quesNum + 'pho0').hover(
			function(){
				$('#ques' + quesNum + 'ans0').parent().addClass('hover');
				$(this).addClass('hover');
			},
			function(){
				$('#ques' + quesNum + 'ans0').parent().removeClass('hover');
				$(this).removeClass('hover');
			}
		);
		$('#ques' + quesNum + 'pho1').hover(
			function(){
				$('#ques' + quesNum + 'ans1').parent().addClass('hover');
				$(this).addClass('hover');
			},
			function(){
				$('#ques' + quesNum + 'ans1').parent().removeClass('hover');
				$(this).removeClass('hover');
			}
		);
		$('#ques' + quesNum + 'pho2').hover(
			function(){
				$('#ques' + quesNum + 'ans2').parent().addClass('hover');
				$(this).addClass('hover');
			},
			function(){
				$('#ques' + quesNum + 'ans2').parent().removeClass('hover');
				$(this).removeClass('hover');
			}
		);
		$('#ques' + quesNum + 'pho3').hover(
			function(){
				$('#ques' + quesNum + 'ans3').parent().addClass('hover');
				$(this).addClass('hover');
			},
			function(){
				$('#ques' + quesNum + 'ans3').parent().removeClass('hover');
				$(this).removeClass('hover');
			}
		);



		$('#ques' + quesNum + 'ans0').parent().hover(
			function(){
				$('#ques' + quesNum + 'pho0').addClass('hover');
				$(this).addClass('hover');
			},
			function(){
				$('#ques' + quesNum + 'pho0').removeClass('hover');
				$(this).removeClass('hover');
			}
		);
		$('#ques' + quesNum + 'ans1').parent().hover(
			function(){
				$('#ques' + quesNum + 'pho1').addClass('hover');
				$(this).addClass('hover');
			},
			function(){
				$('#ques' + quesNum + 'pho1').removeClass('hover');
				$(this).removeClass('hover');
			}
		);
		$('#ques' + quesNum + 'ans2').parent().hover(
			function(){
				$('#ques' + quesNum + 'pho2').addClass('hover');
				$(this).addClass('hover');
			},
			function(){
				$('#ques' + quesNum + 'pho2').removeClass('hover');
				$(this).removeClass('hover');
			}
		);
		$('#ques' + quesNum + 'ans3').parent().hover(
			function(){
				$('#ques' + quesNum + 'pho3').addClass('hover');
				$(this).addClass('hover');
			},
			function(){
				$('#ques' + quesNum + 'pho3').removeClass('hover');
				$(this).removeClass('hover');
			}
		);
	}


	// MULTIPLE-CHOICE / TRUE-FALSE HOVER HANDLERS

	function multiChoiceHover() {
		$('#ques' + quesNum + 'ans0').parent().hover(
			function(){ $(this).addClass('hover'); },
			function(){ $(this).removeClass('hover'); }
		);
		$('#ques' + quesNum + 'ans1').parent().hover(
			function(){ $(this).addClass('hover'); },
			function(){ $(this).removeClass('hover'); }
		);
		$('#ques' + quesNum + 'ans2').parent().hover(
			function(){ $(this).addClass('hover'); },
			function(){ $(this).removeClass('hover'); }
		);
		$('#ques' + quesNum + 'ans3').parent().hover(
			function(){ $(this).addClass('hover'); },
			function(){ $(this).removeClass('hover'); }
		);
	}


	// MULTIPLE PHOTOS CLICK HANDLERS

	function multiPhotoClick() {
		$('.answerLine').click( function(){
			$('img').unbind();
			$('.answerLine').unbind();
			// only do this if there's NOT a dissolve effect
			if ( !checkDissolve( $('#question' + quesNum) ) ) {
				$('#question' + quesNum + ' .photos img.wrong').css('opacity','0.3').removeClass('hover');
				$('#question' + quesNum + ' .photos img.correct').addClass('highlight');
			}
			var userChoice = $(this).children('input').attr('id').slice(-1);
			answerAndScore(userChoice);
		});

		$('.photos img').click( function(){
			$('img').unbind();
			$('.answerLine').unbind();
			// only do this if there's NOT a dissolve effect
			if ( !checkDissolve( $('#question' + quesNum) ) ) {
				$('#question' + quesNum + ' .photos img.wrong').css('opacity','0.3').removeClass('hover');
				$('#question' + quesNum + ' .photos img.correct').addClass('highlight');
			}
			var userChoice = $(this).attr('id').slice(-1);
			answerAndScore(userChoice);
		});
	}


	// MULTIPLE-CHOICE / TRUE-FALSE HOVER HANDLER

	function multiChoiceClick() {
		$('.answerLine').click( function(){
			$('.answerLine').unbind();
			var userChoice = $(this).children('input').attr('id').slice(-1);
			answerAndScore(userChoice);
		});
	}



	// GENERATE THE ANSWER SCREEN, THEN FIGURE OUT HOW TO PROCEED

	function answerAndScore(userChoice) {
		var $thisQuestion = $('#question' + quesNum);
		$thisQuestion.addClass('answered');
		$thePhotoContainer = $thisQuestion.find('.photos');
		$thePhoto = $thisQuestion.find('.photos img');
		$('input#ques' + quesNum + 'ans' + userChoice).parent().removeClass('hover');
		$('input#ques' + quesNum + 'ans' + userChoice).parent().addClass('userAnswer');
		$thisQuestion.find('input').attr('disabled','disabled');
		$thisQuestion.find('input.correct').parent().addClass('correct');
		$thisQuestion.find('input.wrong').parent().css('opacity','0.3');

		$thisQuestion.children('.response').show();

		// does this question need a Dissolve effect?
		if (checkDissolve($thisQuestion) ) {
			$thisQuestion.find('.photos .layer:last-child').fadeOut(2000, dissolve);
		}

		// does this question need a Zoom In effect?
		if (checkZoomIn($thisQuestion) ) {
			$thisQuestion.find('.photos .layer:first-child').addClass("zoomIn");
		}

		// does this question need a Zoom Out effect?
		if (checkZoomOut($thisQuestion) ) {
			$thisQuestion.find('.photos .layer:first-child').addClass("zoomOut");
		}

		// does this question need a Scroll transition?
		if (checkScroll($thisQuestion)) {
			var theWidth  = $thePhoto.width();
			var theHeight = $thePhoto.height();

			// grab any offsets specified in HTML
			var xScrollTo = $thisQuestion.attr('xScrollTo');
			var yScrollTo = $thisQuestion.attr('yScrollTo');

			// if for some reason there's no xScrollTo defined in HTML then fall back
			// to finding dif between this image's width and the container's width 
			// (container is usually 600, but can be smaller due to responsive resizes).
			if (typeof xScrollTo === "undefined") {
				var xOffset = (theWidth - $thePhotoContainer.width() ) * -1;
			}
			// otherwise, use the offset specified in HTML
			else {
				var xOffset = parseInt( xScrollTo );
			}

			// if for some reason there's no yScrollTo defined in HTML then fall back
			// to finding dif between this image's height and the container's height
			// (container is usually 350+8, but can be smaller due to responsive resizes).
			if (typeof yScrollTo === "undefined") {
				var yOffset = (theHeight - $thePhotoContainer.height() ) * -1;
			}
			// otherwise, use the offset specified in HTML
			else {
				var yOffset = parseInt( yScrollTo );
			}

			$thePhoto.animate({
				left: xOffset,
				top:  yOffset
			},1500);
//			$thePhoto.scrollTop( $(this).height() );
		}

		// Does this question need a sound effect on answer?
		if ( checkSound($thisQuestion) && hasAudio ) {
			// is there an "after" sound?
			if ( $thisQuestion.find('.sounds audio.after').length ) {
				// The jQuery wrapper doesn't know about play(). We have to invoke
				// on the native dom element. get(0) grabs that native element.
				$thisQuestion.find('.sounds audio.after').get(0).play();
			}
		} 


		// did they answer correctly?
		if ( $('input#ques' + quesNum + 'ans' + userChoice).hasClass('correct') ) {
			$thisQuestion.find('.response .answeredCorrect').show();
			score++;
		}
		else {
			$thisQuestion.find('.response .answeredWrong').show();
		}

		// did they answer the last question? If so, judgment screen. If not, continue.
		if (quesNum === totalQues-1) {
			judgment(userChoice);
		}
		else {
			continueButton(userChoice);
		}

	}


	// CREATE THE CONTINUE BUTTON

	function continueButton(userChoice) {
		var $thisQuestion = $('#question' + quesNum);
		$('<div id="continueButton">NEXT QUESTION <span class="arrow">&rarr;</span></div>').appendTo('#quiz');
		$('#continueButton').click( function(){ 
			$('#continueButton').unbind().remove();
			// If there's an "after" sound effect playing, we need to stop it.
			if ( checkSound( $thisQuestion ) && hasAudio ) {
				// is there an "after" sound?
				var $afterSound = $thisQuestion.find('.sounds audio.after');
				if ( $afterSound.length ) {
					// The jQuery wrapper doesn't know about sound functions. 
					// We have to invoke on the native dom element. get(0) grabs that.
					// Also, there's no stop() function. Instead, we pause and reset the counter.
					$afterSound.get(0).pause();
//					$afterSound.get(0).currentTime = 0;
				}
			} 
			cleanUpSlide(userChoice);
			$thisQuestion.hide();
			quesNum++;
			playQuiz();
		});
	}


	// CREATE THE "SEE YOUR SCORE" BUTTON

	function judgment(userChoice) {
		var $thisQuestion = $('#question' + quesNum);
		$('<div id="continueButton">SEE YOUR SCORE <span class="arrow">&rarr;</span></div>').appendTo('#quiz');
		$('#continueButton').click( function(){ 
			$('#continueButton').unbind().remove();
			// If there's an "after" sound effect playing, we need to stop it.
			if ( checkSound( $thisQuestion ) && hasAudio ) {
				// is there an "after" sound?
				var $afterSound = $thisQuestion.find('.sounds audio.after');
				if ( $afterSound.length ) {
					// The jQuery wrapper doesn't know about sound functions.
					// We have to invoke on the native dom element. get(0) grabs that.
					// Also, there's no stop() function. Instead, we pause and reset the counter.
					$afterSound.get(0).pause();
//					$afterSound.get(0).currentTime = 0;
				}
			}
			cleanUpSlide(userChoice);
			$thisQuestion.hide();
			scoringScreen();
		});
	}


	// CLEAN UP BETWEEN SLIDES
	function cleanUpSlide(userChoice) {
		$('#question' + quesNum).removeClass('answered');
		$('input#ques' + quesNum + 'ans' + userChoice).parent().removeClass('userAnswer');
		$('#question' + quesNum + ' input').removeAttr('disabled');
		$('#question' + quesNum + ' input').attr('checked', false);
		$('#question' + quesNum + ' input.correct').parent().removeClass('correct');
		$('#question' + quesNum + ' input.wrong').parent().css('opacity','');
		$('#question' + quesNum + ' .photos img.wrong').css('opacity','');
		$('#question' + quesNum + ' .photos img.correct').removeClass('hover');
		$('#question' + quesNum + ' .response span').hide();
		$('#question' + quesNum + ' .response').hide();
		$('#question' + quesNum + ' .highlight').removeClass('highlight');
	}


	// GENERATE THE SCORING SCREEN

	function scoringScreen() {
		$scoring = $('#scoring');
		var encQuizUrl = encodeURIComponent(quizUrl);
		var encQuizTitle = encodeURIComponent(quizTitle);

		var fbShare = '<div class="facebookShare"><a href="https://www.facebook.com/sharer.php?u='+encQuizUrl+'" target="_blank">Share on Facebook!</a></div>';
		var twShare = '<div class="twitterShare"><a href="https://twitter.com/intent/tweet?source=tweetbutton&amp;text=I%20scored%20'+score+'%20out%20of%20'+totalQues+'%20on%20'+encQuizTitle+'!&amp;url='+encQuizUrl+'&amp;via=stltoday" target="_blank">Tweet your score!</a></div>';

		$('#quiz #scoring').show();
		$('<div id="score">' + score + ' out of ' + totalQues + '</div>').insertBefore('#response');
		$('<div class="quizShare">' + fbShare + twShare + '</div>').insertBefore('#response');

		// does this question need a Dissolve effect?
		if (checkDissolve( $scoring ) ) {
			$scoring.find('.photos .layer:last-child').fadeOut(2000, dissolve);
		}

		if ( checkSound( $scoring ) && hasAudio ) {
			// is there a "before" sound?
			if ( $scoring.find('.sounds .before').length ) {
				// The jQuery wrapper doesn't know about play(). We have to invoke
				// on the native dom element. get(0) grabs that native element.
				$scoring.find('.sounds .before').get(0).play();
			}
		}

		// does this question need a Zoom In effect?
		if (checkZoomIn( $scoring ) ) {
			$thisQuestion.find('.photos .layer').addClass("zoomIn");
		}

		// does this question need a Zoom Out effect?
		if (checkZoomOut( $scoring ) ) {
			$thisQuestion.find('.photos .layer').addClass("zoomOut");
		}

		for (x=0; x<scoringRangeSize; x++) {
			// this line is for debugging
			//$('<p>your score: '+score+'&nbsp;&nbsp;&nbsp;'+x+'th range: '+scoringRange[x]+'</div>').appendTo('body');
			if (score >= scoringRange[x]) {
				$('<div id="evaluation">' + scoringEvaluation[x] + '</div>').insertAfter('#score');
				break;
			}
			else if ( (x === scoringRangeSize-1) && (score < scoringRange[x]) ) {
				$('<div id="evaluation">' + scoringEvaluation[x] + '</div>').insertAfter('#score');
				break;
			}
		}
		playAgain();
	}


	// CREATE THE "PLAY AGAIN" BUTTON

	function playAgain() {
		$('<div id="continueButton" class="playAgainButton">PLAY AGAIN <span class="arrow">&rarr;</span></div>').appendTo('#scoring');
		$('#continueButton').click( function(){ 
			$('#continueButton').unbind().remove();
			$('#score').remove();
			$('#evaluation').remove();
			$('#scoring').hide();
			$('.quizShare').remove();

	//		$('#quiz').children().remove();
			$('.questions .photos img').show();
			addEffects();
			quesNum = 0;
			score = 0;
			playQuiz();
		});
	}


	// Randomize the photos/answers

	function randomizeMultiPhoto() {
		var layers = '';
		// Check if this question has a dissolve effect.
		// If so, then only randomize photos within a .layers div
		// If there's no dissolve, then the only photos are answer photos, so randomize them all
		if ( checkDissolve( $('#question' + quesNum) ) ) {
			layers = ' div.layer ';
		}
		var elemsPhotos = $('#question' + quesNum + ' .photos' + layers).children('img').get();
		var elemsQuests = $('#question' + quesNum + ' .answers').children('.answerLine').get();
		var n = elemsQuests.length;
		var randomIndexes = [];
		for (i=0; i<n; i++) {
		   randomIndexes[i] = i;
		}
		randomIndexes.sort(function() { return (Math.round(Math.random())-0.5); });

		$('#question' + quesNum + ' .photos' + layers).remove('img');
		$('#question' + quesNum + ' .answers').remove('.answerLine');
		for (i=0; i < n; i++) {
			$('#question' + quesNum + ' .photos' + layers).append(elemsPhotos[randomIndexes[i]]);
			$('#question' + quesNum + ' .answers').append(elemsQuests[randomIndexes[i]]);
		}
	}

	function randomizeMultiChoice() {
		var elemsQuests = $('#question' + quesNum + ' .answers').children('.answerLine').get();
		elemsQuests.sort(function() { return (Math.round(Math.random())-0.5); });
		$('#question' + quesNum + ' .answers').remove('.answerLine');
		for (i=0; i < elemsQuests.length; i++) {
			$('#question' + quesNum + ' .answers').append(elemsQuests[i]);
		}
	}


});


function checkAudio() {
	return !!document.createElement('audio').canPlayType;
}
