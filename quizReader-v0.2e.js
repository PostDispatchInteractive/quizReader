// jQUERY READY HANDLER
// The script must be enclosed entirely within this handler because
// stltoday.com uses .noConflict, which removes the $ variable.

jQuery(document).ready(function($) {

	var judgmentImg = '';
	var quesNum = 0;
	var score = 0;
	var basePath = '';
	var scoringRangeSize = scoringRange.length;
	var quizTitle = document.title;
	var quizUrl = document.URL;

	$('#quiz .spinningWheel').remove();
	$('#quiz .questions').hide();
	$('#quiz #scoring').hide();

	addEffects();
	playQuiz();



	// cycle through the quiz questions and add any bells/whistles needed for transitions
	function addEffects() {
		// have to edit this when I'm testing
//		var splitSeparator = 'Mardi-Gras-masks';
		var splitSeparator = 'content';

		for (i=0; i<totalQuestions; i++) {
			imageNum = i;
			if (i<10) { imageNum = '0'+imageNum; }
			// newly implemented in quizMaker. Allows user to specify the image, rather than rely on a naming convention
			// Dissolve is the NEW format. Transition-fade is old format. Support for both included.
			if ( checkDissolve(i) || checkFade(i) ) {
				// new format
				if ( checkDissolve(i) ) { 
					var theUrl = $('#question'+i+' .photos').attr('data');
				}
				// old format
				else if ( checkFade(i) ) {
					var imageUrl = $('#question'+i+' .photos img:first-child')[0].src.split(splitSeparator).shift();
					var imageExt = $('#question'+i+' .photos img:first-child')[0].src.split('.').pop();
					var theUrl = imageUrl + splitSeparator + '/' + imageNum + 'b-fade.' + imageExt;
				}
				$('#question' + i + ' .photos').css('background-image', 'url(' + theUrl + ')');
				$('#question' + i + ' .photos').css('background-position', '0px 4px');
				$('#question' + i + ' .photos').css('background-repeat', 'no-repeat');

				// the lower opacity with MultiPhoto questions doesn't work well with a background image
				if ( $('#question' + i).hasClass('multiphoto') ) {
					$('#question' + i + '.multiphoto .photos img').css({ opacity: 1 });
				}
			}

			// The following Effects still are not implemented in quizMaker. Have to be added manually to a quiz.
			if ( checkScroll(i) ) {
				$thePhoto = $('#question' + i + ' .photos img');

				// grab any offsets specified in HTML
				var xScrollFrom = $('#question' + i).attr('xScrollFrom');
				var yScrollFrom = $('#question' + i).attr('yScrollFrom');

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
			if ( checkBg(i) ) {
				$('#question' + i).show();
				var imageUrl = $('#question' + i + ' .photos img:first-child')[0].src.split(splitSeparator).shift();
				var theUrl = imageUrl + splitSeparator + '/' + imageNum + 'b-fade.jpg';
				$('#question' + i + ' .photos').css('background-image', 'url(' + theUrl + ')');
				$('#question' + i + ' .photos').css('background-position', '0px 4px');
				$('#question' + i + ' .photos').css('background-repeat', 'no-repeat');
				$('#question' + i).hide();
			}
		}
	}

	// NEW - implemented in quizMaker
	function checkDissolve(i) {
		return $('#question' + i).hasClass('effect-dissolve');
	}

	// legacy
	function checkFade(i) {
		return $('#question' + i).hasClass('transition-fade');
	}

	function checkScroll(i) {
		return $('#question' + i).hasClass('transition-scroll');
	} 

	function checkBg(i) {
		return $('#question' + i).hasClass('transition-bg');
	}


	// determine which type of quiz question we have, then use the appropriate Hover and Click handlers

	function playQuiz() {
		$('#question' + quesNum).show();
		var hasMultiPhoto = $('#question' + quesNum).hasClass('multiphoto');
		var hasMultiChoice = $('#question' + quesNum).hasClass('multichoice');

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
			$('#question' + quesNum + ' .photos img.wrong').css('opacity','0.3').removeClass('hover');
			$('#question' + quesNum + ' .photos img.correct').addClass('highlight');
			var userChoice = $(this).children('input').attr('id').slice(-1);
			answerAndScore(userChoice);
		});

		$('.photos img').click( function(){ 
			$('img').unbind();
			$('.answerLine').unbind();
			$('#question' + quesNum + ' .photos img.wrong').css('opacity','0.3').removeClass('hover');
			$('#question' + quesNum + ' .photos img.correct').addClass('highlight');
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
		$thePhoto = $('#question' + quesNum + ' .photos img');
		$('input#ques' + quesNum + 'ans' + userChoice).parent().removeClass('hover');
		$('input#ques' + quesNum + 'ans' + userChoice).parent().addClass('answered');
		$('#question' + quesNum + ' input').attr('disabled','disabled');
		$('#question' + quesNum + ' input.correct').parent().addClass('correct');
		$('#question' + quesNum + ' input.wrong').parent().css('opacity','0.3');

		$('#question' + quesNum + ' .response').show();

		// does this question need a Fade transition?
		if (checkDissolve(quesNum) || checkFade(quesNum) ) {
			$thePhoto.fadeOut();
		}

		// does this question need a Scroll transition?
		if (checkScroll(quesNum)) {
			var theWidth  = $thePhoto.width();
			var theHeight = $thePhoto.height();

			// grab any offsets specified in HTML
			var xScrollTo = $('#question' + quesNum).attr('xScrollTo');
			var yScrollTo = $('#question' + quesNum).attr('yScrollTo');

			// if for some reason there's no ScrollTo defined in HTML then fall back
			// to finding dif between this image's height and normal width (600).
			if (typeof xScrollTo === "undefined") {
				var xOffset = (theWidth - 600) * -1;
			}
			// otherwise, use the offset specified in HTML
			else {
				var xOffset = parseInt( xScrollTo );
			}

			// if for some reason there's no ScrollTo defined in HTML then fall back
			// to finding dif between this image's height and normal height (350+8).
			if (typeof yScrollTo === "undefined") {
				var yOffset = (theHeight - 358) * -1;
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


		// did they answer correctly?
		if ( $('input#ques' + quesNum + 'ans' + userChoice).hasClass('correct') ) {
			$('#question' + quesNum + ' .response .answeredCorrect').show();
			score++;
		}
		else {
			$('#question' + quesNum + ' .response .answeredWrong').show();
		}

		// did they answer the last question? If so, judgment screen. If not, continue.
		if (quesNum === totalQuestions-1) {
			judgment(userChoice);
		}
		else {
			continueButton(userChoice);
		}
		
	}	


	// CREATE THE CONTINUE BUTTON

	function continueButton(userChoice) {
		$('<div id="continueButton">NEXT QUESTION <span class="arrow">&rarr;</span></div>').appendTo('#quiz');
	//	alert('Answered '+quesNum+' out of '+totalQuestions);
		$('#continueButton').click( function(){ 
			$('#continueButton').unbind().remove();
	//		$('#question'+quesNum+' .photos').flash().remove();
			cleanUpSlide(userChoice);
			$('#question' + quesNum).hide();
			quesNum++;
			playQuiz();
		});
	}


	// CREATE THE "SEE YOUR SCORE" BUTTON

	function judgment(userChoice) {
		$('<div id="continueButton">SEE YOUR SCORE <span class="arrow">&rarr;</span></div>').appendTo('#quiz');
		$('#continueButton').click( function(){ 
			$('#continueButton').unbind().remove();
			cleanUpSlide(userChoice);
			$('#question' + quesNum).hide();
			scoringScreen();
		});
	}


	// CLEAN UP BETWEEN SLIDES
	function cleanUpSlide(userChoice) {
		$('input#ques' + quesNum + 'ans' + userChoice).parent().removeClass('answered');
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
		var encQuizUrl = encodeURIComponent(quizUrl);
		var encQuizTitle = encodeURIComponent(quizTitle);

		var fbShare = '<div class="facebookShare"><a href="https://www.facebook.com/sharer.php?u='+encQuizUrl+'" target="_blank">Share your score!</a></div>';
		var twShare = '<div class="twitterShare"><a href="https://twitter.com/intent/tweet?source=tweetbutton&amp;text=I%20scored%20'+score+'%20out%20of%20'+totalQuestions+'%20on%20'+encQuizTitle+'!&amp;url='+encQuizUrl+'&amp;via=stltoday" target="_blank">Tweet your score!</a></div>';

		$('#quiz #scoring').show();
		$('<div id="score">' + score + ' out of ' + totalQuestions + '</div>').insertBefore('#response');
		$('<div class="quizShare">' + twShare + fbShare + '</div>').insertBefore('#response');

		for (x=0; x<scoringRangeSize; x++) {
	//	this line is for debugging
	//	$('<p>your score: '+score+'&nbsp;&nbsp;&nbsp;'+x+'th range: '+scoringRange[x]+'</div>').appendTo('body');
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
		$('<div id="continueButton">PLAY AGAIN <span class="arrow">&rarr;</span></div>').appendTo('#scoring');
		$('#continueButton').css('position','relative').css('top','0px').css('left','0px');
		$('#continueButton').click( function(){ 
			$('#continueButton').unbind().remove();
			$('#score').remove();
			$('#evaluation').remove();
			$('#scoring').hide();
			$('.quizShare').remove();

	//		$('#quiz').children().remove();
			$('.questions .photos img').show();
			addTransitions();
			quesNum = 0;
			score = 0;
			playQuiz();
		});
	}


	// Randomize the photos/answers

	function randomizeMultiPhoto() {
		var elemsPhotos = $('#question' + quesNum + ' .photos').children('img').get();
		var elemsQuests = $('#question' + quesNum + ' .answers').children('.answerLine').get();
		var n = elemsQuests.length;
		var randomIndexes = [];
		for (i=0; i<n; i++) {
		   randomIndexes[i] = i;
		}
		randomIndexes.sort(function() { return (Math.round(Math.random())-0.5); });

		$('#question' + quesNum + ' .photos').remove('img');
		$('#question' + quesNum + ' .answers').remove('.answerLine');
		for (i=0; i < n; i++) {
			$('#question' + quesNum + ' .photos').append(elemsPhotos[randomIndexes[i]]);      
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


