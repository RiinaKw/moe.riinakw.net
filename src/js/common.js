'use strict';

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

    // open animation
    (async () => {
      // icon overlay
      const $overlay = $icon.clone().css({
        position: 'absolute',
        left: pos.left,
        top: pos.top,
        width: iconWidth,
        height: iconHeight,
      });
      $('<div />')
          .addClass('overlay')
          .appendTo(this.$current)
          .append($overlay)
          .show();

      await $content.fadeTo(300, 1).promise();
      $overlay.remove();

      await $('.iconbox', this.$current).animate(
          {
            left: 0,
            top: 0,
          },
          {
            duration: this.iconAnimationDuration($icon),
          },
      ).promise();
      await $('.text', this.$current).fadeTo(500, 1).promise();

      this.$current.removeClass('animating').addClass('active');
      page.startTimer();
      $('.overlay').remove();
    })();
  } // this.open

  /**
   *
   * @param {jquery} $obj
   * @return {int}
   */
  iconAnimationDuration($obj) {
    const left = $obj.position().left;
    const top = $obj.position().top;
    return (Math.floor(left) || Math.floor(top)) ? 800 : 0;
  }

  /**
   *
   */
  close() {
    const $icon = $('.iconbox img', this.$current);
    if ($icon.parents('.active').length == 0) {
      return;
    }
    const $iconbox = $icon.parent();

    // close animation
    (async () => {
      await $('.active .text').fadeTo(400, 0).promise();

      const left = this.$current.position().left;
      const top = this.$current.position().top;
      await $iconbox.animate(
          {
            left: left,
            top: top,
          },
          {
            duration: this.iconAnimationDuration(this.$current),
          },
      ).promise();

      $('.content', this.$current).fadeTo(300, 0);
      await $iconbox.fadeTo(500, 0).promise();

      $iconbox.hide().remove();
      $('.content', this.$current).hide();
      this.$current.removeClass('active');
      page.stopTimer();

      this.$current = null;
    })();
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
