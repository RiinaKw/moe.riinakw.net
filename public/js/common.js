
var timer = null;
var interval = 5000;

function startTimer()
{
	timer = setInterval(cbTimer, interval);
}

function stopTimer()
{
	clearInterval(timer);
}

function cbTimer()
{
	var $active = $(".active");
	if ( $active.hasClass("en") ) {
		$(".lang *", $active).animate({top: 0});
		$active.removeClass("en")
	} else {
		$(".lang *", $active).animate({top: "-4vmin"});
		$active.addClass("en")
	}
}

function openCharacter(icon)
{
	$(icon).parent("li").addClass("animating");
	var pos = $(icon).position();
	var $content = $(icon).siblings(".content");
	var $iconbox = $("iconbox", $content);
	if ( $iconbox.length == 0 ) {
		$iconbox = $('<div class="iconbox" />').prependTo($content);
	}
	$iconbox.empty()
		.css({position:"absolute", left:pos.left, top:pos.top, width:"33.333%", height:"33.333%"})
		.prepend( $(icon).clone() );
	$(".iconbox img").css({opacity:1}).on("click", function(){
		closeCharacter(this);
	});
	$content.css({opacity:0, display:"block"});
	$(".text", $content).css({opacity:0});
	$(".lang *", $content).css({top:0});
	$content.fadeTo(300, 1, function(){
		var duration = ( pos.left || pos.top ? 800 : 0 );
		$(".animating .iconbox").animate(
			{left:0, top:0},
			{
				duration: duration,
				complete: function(){
					$(".animating .text").fadeTo(500, 1, function(){
						$(this).parents(".animating").removeClass("animating").addClass("active")
					});
					startTimer();
				}
			}
		);
	});
}

function closeCharacter(icon)
{
	if ( $(icon).parents(".active").length == 0 ) {
		return;
	}
	var $iconbox = $(icon).parent();
	var $parent = $(icon).parents(".active");
	var left = $parent.position().left;
	var top = $parent.position().top;
	
	var duration = ( left || top ? 800 : 0 );
	$(".active .text").fadeTo(400, 0, function(){
		$iconbox.animate(
			{left:left, top:top},
			{
				duration: duration,
				complete: function(){
					$(this).parent().fadeTo(400, 0, function(){
						$(this).hide();
						$(".iconbox", this).remove();
						$(this).parents(".active").removeClass("active");
						stopTimer();
					});
				}
			}
		);
	});
}

$(function(){
	$("#popup-background").on("click", function(){
		closeCharacter( $(".active .iconbox img") );
	});
	
	// icon hover effect
	$(".icon").hover({
		// hover
		'mouseenter' : function(){
			$(this).fadeTo(100, 1, function(){
				$(".icon-wrapper > ol > li").removeClass("hover")
				$(this).parent("li").addClass("hover");
			});
		},
		//blur
		"mouseleave": function(){
			$(this).parent("li").removeClass("hover");
			$(this).fadeTo(100, 0.5, function(){
			});
		}
	}).on("click", function(){
		openCharacter(this);
	});
});
