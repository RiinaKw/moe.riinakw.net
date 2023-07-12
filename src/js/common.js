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
 * jQuery の対象要素が存在しなかったら null に変換
 *
 * @param {jquery} $obj
 * @return {jquery|null}
 */
function jqOrNull($obj) {
  return $obj.length !== 0 ? $obj : null;
}

/**
 * character operations
 */
class Character {
  /**
   *
   */
  constructor() {
    this.$current = null;
  }

  /**
   *
   * @param {*} icon
   */
  open(icon) {
    const $icon = $(icon);
    this.$current = $icon.parent('li').addClass('animating');

    const pos = $icon.position();
    const $content = $icon.siblings('.content');
    const $iconbox =
      jqOrNull($('iconbox', $content)) ??
      $('<div />').addClass('iconbox').prependTo($content);
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
    }).on('click', () => {
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
    const $iconClone = $icon.clone().css({
      position: 'absolute',
      left: pos.left,
      top: pos.top,
      width: iconWidth,
      height: iconHeight,
    });
    $('<div />')
        .addClass('overlay')
        .appendTo( $('.animating') )
        .append($iconClone)
        .show();

    // open animation
    $.globalQueue.queue(() => {
      return $content.fadeTo(300, 1, () => {
        $('.animating .overlay').remove();
      });
    }).queue(() => {
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
    }).queue(() => {
      return $('.animating .text').fadeTo(500, 1);
    }).queue(() => {
      $('.animating').removeClass('animating').addClass('active');
      page.startTimer();
      return $('.active');
    });
  } // this.open

  /**
   *
   */
  close() {
    const $icon = $('.iconbox img', this.$current);
    if ($icon.parents('.active').length == 0) {
      return;
    }
    const $iconbox = $icon.parent();
    const left = this.$current.position().left;
    const top = this.$current.position().top;

    // close animation
    $.globalQueue.queue(() => {
      return $('.active .text').fadeTo(400, 0);
    }).queue(() => {
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
    }).queue(() => {
      return $iconbox.fadeTo(500, 0);
    }).queue(() => {
      return $('.active .content').fadeTo(300, 0);
    }).queue(() => {
      return $iconbox.hide().remove();
    }).queue(() => {
      $('.active .content').hide();
      $('.active').removeClass('active');
      page.stopTimer();
      return $iconbox;
    });

    this.$current = null;
  } // this.close
} // class Character

const page = new Page;
const character = new Character;

$(() => {
  $('#js-background').on('click', () => {
    character.close();
  });

  // icon hover effect
  $('.icon').on('click', (e) => {
    character.open(e.target);
  });

  $(window).on('load resize', page.reload);
});
