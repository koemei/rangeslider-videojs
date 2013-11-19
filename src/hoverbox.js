(function (){
  function HoverBox_(options){
    var player = this;

    player.hoverbox = new HoverBox(player, options);

    //When the DOM and the video media is loaded
    function initialVideoFinished(event) {
      var plugin = player.hoverbox;
      //All components will be initialize after they have been loaded by videojs
      for (var index in plugin.components) {
        // plugin.components[index].init_();  // this was causing failures so I commented it out.
      }

      // plugin._reset();
      player.trigger('loadedHoverBox'); //Let know if the DOM is ready
    }
    if (player.techName == 'Youtube'){
      //Detect youtube problems
      player.one('error', function(e){
        switch (player.error) {
          case 2:
            alert("The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.");
            break;
          case 5:
            alert("The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.");
            break;
          case 100:
            alert("The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.");
            break;
          case 101:
            alert("The owner of the requested video does not allow it to be played in embedded players.");
            break;
          case 150:
            alert("The owner of the requested video does not allow it to be played in embedded players.");
            break;
          default:
            alert("Unknown Error");
            break;
        }
      });
      player.on('firstplay', initialVideoFinished);
    }else{
      player.one('playing', initialVideoFinished);
    }

    console.log("Loaded Plugin HoverBox");
  }

  videojs.plugin('hoverbox', HoverBox_);



  //-- Plugin
  function HoverBox(player,options){
    var vjsPlayer = player || this;

    this.player = vjsPlayer;

    this.components = {}; // holds any custom components we add to the player

    options = options || {}; // plugin options - of which we have none

    this.options = options;

    this.init();
  }

  //-- Methods
  HoverBox.prototype = {
    /*Constructor*/
    init:function(){
      var player = this.player || {};

      var hoverBox = this.components.HoverBox = player.hoverbox; // what exactly is happening here?  Is it necessary?
    },
  };


  /**
   * This is the hover box
   * @param {videojs.Player|Object} player
   * @param {Object=} options
   * @constructor
   */
  videojs.HoverBox = videojs.Component.extend({
    /** @constructor */
    init: function(player, options){
      videojs.Component.call(this, player, options);
    }
  });

  // -- Helper variables and function for mouseover box countdown

  // TODO: Refactor these static values as plugin Options

  // TODO : what is this? (add code review message in github)
  videojs.HoverBox.prototype.timer = 1.5;

  // This is a static variable used to reset the timer 
  videojs.HoverBox.prototype.duration = 1.5;

  // This value is used to start a highlight prior to the completion of the animation  
  videojs.HoverBox.prototype.buffer = 5;

  // countdown interval
  videojs.HoverBox.prototype.countDownInterval = 500;

  // this is a variable to toggle on and off on mouseenter
  videojs.HoverBox.prototype.set = false;

  // this is a variable to store the setInterval value which will get cleared onmouseleave
  videojs.HoverBox.prototype.interval = undefined;

  // this is a variable to store the setTimeout value which will get cleared onmouseleave
  videojs.HoverBox.prototype.timeout = undefined;

  // this is a method to adjust the highlight hover animation in the plugin
  // TODO: Clean up this function.
  videojs.HoverBox.prototype.countDown = function () {
    var el = this.element;

    elCounter = this.elementCounter;

    if (this.timer > 0) { // if the timer is greater than zero, addClass 'counting' and decrement timer
      $(el)
        .removeClass('active')
        .addClass('counting');
      $(elCounter).html("Highlighting");
      this.timer -= this.countDownInterval/1000;
    }
    else if (this.timer === 0) { // if the timer equals zero, change the innerHTML and decrement timer
      $(elCounter).html('Don\'t move!');
      this.timer -= this.countDownInterval/1000;
      // TODO: remove the final else block and adjust the animation so it ends at timer === 0...
    } else { // stop the timer by clearing the interval
      clearInterval(this.interval);
      $(el).addClass('counting-done');
      $(elCounter).html('Clipping!');
    }
  };

  videojs.HoverBox.prototype.endClip = function(){
      $(this.element).removeClass('counting');
      clearInterval(this.interval);
      clearTimeout(this.timeout);
      this.set = false;

    if ( $(event.srcElement).hasClass('counting-done') ) {
      this.endTime = this.player_.currentTime();
      this.set = false;
      console.log('querystring:', $(location).attr('href') + '?start=' + this.startTime + '&end=' + this.endTime);
    }
    this.reset.call(this);
  };

  // Rest all hoverbox attributes
  videojs.HoverBox.prototype.reset = function(){
    el = this.element;
      $(el)
        .removeClass('counting')
      $(this.elementCounter).html("highlight");
    this.timer = this.duration;
    return this;
  };

  // Create the hoverbox DOM element
  videojs.HoverBox.prototype.createEl = function(){
    // This is the main hoverbox element
    this.element = videojs.Component.prototype.createEl.call(this, 'div', {
      className: 'vjs-hoverbox'
    });

    // This is the counter element inside the main hoverbox element
    this.elementCounter = videojs.Component.prototype.createEl.call(this, 'span', {
      className: 'vjs-hoverbox-counter'
    });

    $(this.element).append(this.elementCounter);

    // on mouse enter: start the countdown and init the timeout
    this.element.onmouseenter = function() {
      $(this.element).removeClass('counting-done');

      // register the periodic countdown call and store the pointer
      this.interval = setInterval(function() {
        this.countDown.call(this, this.element);
      }.bind(this), this.countDownInterval);

      this.timeout = setTimeout(function() {
        if (!this.set) {
          this.set = true;
          // logic to set highlight start time before the user took action
          if (this.player_.currentTime() < this.buffer) {
            this.startTime = 0;
          } else {
            this.startTime = this.player_.currentTime() - this.buffer;
          }
        }
      }.bind(this), this.duration);
    }.bind(this);

    // on mouse leave: reset the animation, clear timeout and countdown 
    this.element.onmouseleave = function(event) {
      this.endClip.call(this);
    }.bind(this);

    return this.element;
  };

})();
