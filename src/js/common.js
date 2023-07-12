'use strict';

// Convenience object to ease global animation queueing
$.globalQueue = {
  queue: function(anim) {
    $('html').queue(function(dequeue) {
      anim().queue(function(innerDequeue) {
        dequeue();
        innerDequeue();
      });
    });
    return this;
  },
};

/**
 * timer setting
 */
class Page {
  /**
   * constructor
   */
  constructor() {
    this.timer = null;
    this.interval = 5000;
  }

  /**
   *
   */
  startTimer() {
    this.timer = setInterval(this.cbTimer, this.interval);
  } // this.startTimer

  /**
   *
   */
  stopTimer() {
    clearInterval(this.timer);
  } // this.stopTimer

  /**
   *
   */
  cbTimer() {
    const $active = $('.active');
    if ( $active.hasClass('en') ) {
      $('.lang *', $active).animate({top: 0});
      $active.removeClass('en');
    } else {
      $('.lang *', $active).animate({top: '-4vmin'});
      $active.addClass('en');
    }
  } // this.stopTimer

  /**
   *
   */
  reload() {
    const $icon = $('.active > .icon');
    $('.active .iconbox').width($icon.width()).height($icon.height());
  } // this.reload
} // class Page

/**
 * character operations
 */
class Character {
  /**
   *
   */
  constructor() {
    this.current = null;
  }

  /**
   *
   * @param {*} icon
   */
  open(icon) {
    this.current = icon;
    const $icon = $(icon);
    $icon.parent('li').addClass('animating');
    const pos = $icon.position();
    const $content = $icon.siblings('.content');
    let $iconbox = $('iconbox', $content);
    if ( $iconbox.length == 0 ) {
      $iconbox = $('<div class="iconbox" />').prependTo($content);
    }
    const iconWidth = $icon.width();
    const iconHeight = $icon.height();
    $iconbox.empty().css({
      position: 'absolute',
      left: pos.left,
      top: pos.top,
      width: iconWidth,
      height: iconHeight,
    }).prepend( $icon.clone() );
    $('.iconbox img').css({
      opacity: 1,
    }).on('click', function() {
      character.close();
    });
    $content.css({
      opacity: 0,
      display: 'block',
    });
    $('.text', $content).css({
      opacity: 0,
    });
    $('.lang *', $content).css({
      top: 0,
    });

    // icon overlay
    const $overlay = $('<div />')
        .addClass('overlay')
        .appendTo( $('.animating') )
        .append( $icon.clone() );
    $('.overlay img').css({
      position: 'absolute',
      left: pos.left,
      top: pos.top,
      width: iconWidth,
      height: iconHeight,
    });
    $overlay.show();

    // open animation
    $.globalQueue.queue(function() {
      return $content.fadeTo(300, 1, function() {
        $('.animating .overlay').remove();
      });
    }).queue(function() {
      const duration =
        Math.floor(pos.left) || Math.floor(pos.top) ? 800 : 0;
      return $('.animating .iconbox').animate(
          {
            left: 0,
            top: 0,
          },
          {
            duration: duration,
          },
      );
    }).queue(function() {
      return $('.animating .text').fadeTo(500, 1);
    }).queue(function() {
      $('.animating').removeClass('animating').addClass('active');
      page.startTimer();
      return $('.active');
    });
  } // this.open

  /**
   *
   */
  close() {
    this.current = null;
    const $icon = $('.active .iconbox img');
    if ($icon.parents('.active').length == 0) {
      return;
    }
    const $iconbox = $icon.parent();
    const $parent = $icon.parents('.active');
    const left = $parent.position().left;
    const top = $parent.position().top;

    // close animation
    $.globalQueue.queue(function() {
      return $('.active .text').fadeTo(400, 0);
    }).queue(function() {
      const duration = ( Math.floor(left) || Math.floor(top) ? 800 : 0 );
      return $iconbox.animate(
          {
            left: left,
            top: top,
          },
          {
            duration: duration,
          },
      );
    }).queue(function() {
      return $iconbox.fadeTo(500, 0);
    }).queue(function() {
      return $('.active .content').fadeTo(300, 0);
    }).queue(function() {
      return $iconbox.hide().remove();
    }).queue(function() {
      $('.active .content').hide();
      $('.active').removeClass('active');
      page.stopTimer();
      return $iconbox;
    });
  } // this.close

  /**
   *
   */
  hover() {
    const $this = $(this);
    $this.stop();
    $this.fadeTo(100, 1, function() {
      $('.icon-wrapper > ol > li').removeClass('hover');
      $this.parent('li').addClass('hover');
    });
  } // this.hover

  /**
   *
   */
  blur() {
    const $this = $(this);
    $this.stop();
    const defaultOpacity = $('.meta .icon').css('opacity');
    $this.parent('li').removeClass('hover');
    $this.fadeTo(100, defaultOpacity, function() {
    });
  } // this.blur
} // class Character

const page = new Page;
const character = new Character;

$(function() {
  $('#js-background').on('click', character.close);

  // icon hover effect
  $('.icon').on({
    'mouseenter': character.hover,
    'mouseleave': character.blur,
  }).on('click', (e) => {
    character.open(e.target);
  });

  $(window).on('load resize', page.reload);
});
