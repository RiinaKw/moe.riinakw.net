"use strict";

// Convenience object to ease global animation queueing
$.globalQueue = {
    queue: function(anim) {
        $("html")
        .queue(function(dequeue) {
            anim()
            .queue(function(innerDequeue) {
                dequeue();
                innerDequeue();
            });
        });
        return this;
    }
};

var page = new Page;
var character = new Character;

/**** timer setting ****/

function Page()
{
    this.timer = null;
    this.interval = 5000;

    this.startTimer = function()
    {
        this.timer = setInterval(this.cbTimer, this.interval);

    } // this.startTimer

    this.stopTimer = function()
    {
        clearInterval(this.timer);
    } // this.stopTimer

    this.cbTimer = function()
    {
        var $active = $(".active");
        if ( $active.hasClass("en") ) {
            $(".lang *", $active).animate({top: 0});
            $active.removeClass("en")
        } else {
            $(".lang *", $active).animate({top: "-4vmin"});
            $active.addClass("en")
        }
    } // this.stopTimer

    this.reload = function()
    {
        var $icon = $(".active > .icon");
        $(".active .iconbox").width($icon.width()).height($icon.height());
    } // this.reload
} // function Page()

/**** character operations ****/

function Character()
{
    this.current = null;

    this.open = function(icon)
    {
        this.current = icon;
        var $icon = $(icon);
        $icon.parent("li").addClass("animating");
        var pos = $icon.position();
        var $content = $icon.siblings(".content");
        var $iconbox = $("iconbox", $content);
        if ( $iconbox.length == 0 ) {
            $iconbox = $('<div class="iconbox" />').prependTo($content);
        }
        var iconWidth = $icon.width();
        var iconHeight = $icon.height();
        $iconbox.empty()
            .css({
                position: "absolute",
                left :pos.left,
                top: pos.top,
                width: iconWidth,
                height: iconHeight
            })
            .prepend( $icon.clone() );
        $(".iconbox img").css({
            opacity: 1
        }).on("click", function(){
            character.close();
        });
        $content.css({
            opacity: 0,
            display: "block"
        });
        $(".text", $content).css({
            opacity: 0
        });
        $(".lang *", $content).css({
            top: 0
        });

        // icon overlay
        var $overlay = $("<div />")
            .addClass("overlay")
            .appendTo( $(".animating") )
            .append( $icon.clone() );
        $(".overlay img").css({
            position: "absolute",
            left: pos.left,
            top: pos.top,
            width: iconWidth,
            height: iconHeight
        });
        $overlay.show();

        // open animation
        $.globalQueue
        .queue(function(){
            return $content.fadeTo(300, 1, function(){
                $(".animating .overlay").remove();
            });
        })
        .queue(function(){
            var duration = ( Math.floor(pos.left) || Math.floor(pos.top) ? 800 : 0 );
            return $(".animating .iconbox").animate(
                {
                    left: 0,
                    top: 0
                },
                {
                    duration: duration
                }
            );
        })
        .queue(function(){
            return $(".animating .text").fadeTo(500, 1);
        })
        .queue(function(){
            $(".animating").removeClass("animating").addClass("active");
            page.startTimer();
			return $(".active");
		});
	} // this.open

    this.close = function()
    {
        this.current = null;
        var $icon = $(".active .iconbox img");
        if ($icon.parents(".active").length == 0) {
            return;
        }
        var $iconbox = $icon.parent();
        var $parent = $icon.parents(".active");
        var left = $parent.position().left;
        var top = $parent.position().top;

        // close animation
        $.globalQueue
        .queue(function(){
            return $(".active .text").fadeTo(400, 0);
        })
        .queue(function(){
            var duration = ( Math.floor(left) || Math.floor(top) ? 800 : 0 );
            return $iconbox.animate(
                {
                    left: left,
                    top: top
                },
                {
                    duration: duration
                }
            );
        })
        .queue(function(){
            return $iconbox.fadeTo(500, 0);
        })
        .queue(function(){
            return $(".active .content").fadeTo(300, 0);
        })
        .queue(function(){
            return $iconbox.hide().remove();
        })
        .queue(function(){
            $(".active .content").hide();
            $(".active").removeClass("active");
            page.stopTimer();
            return $iconbox;
        });
    } // this.close

    this.hover = function()
    {
        $(this).stop();
        $(this).fadeTo(100, 1, function(){
            $(".icon-wrapper > ol > li").removeClass("hover");
            $(this).parent("li").addClass("hover");
        });
    } // this.hover

    this.blur = function()
    {
        $(this).stop();
        var defaultOpacity = $(".meta .icon").css("opacity");
        $(this).parent("li").removeClass("hover");
        $(this).fadeTo(100, defaultOpacity, function(){
        });
    } // this.blur
    } //function Character()

$(function(){
    $("#js-background").on("click", character.close);

    // icon hover effect
    $(".icon").on({
        // hover
        "mouseenter": character.hover,
        //blur
        "mouseleave": character.blur,
    }).on("click", function(){
        character.open(this);
    });

    $(window).on("load resize", page.reload);
});
