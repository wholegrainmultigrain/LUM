
AFRAME.registerComponent('soundring', {
 schema: {
  // all angles represent the 'z' value in a rotation vec3
  RANDOM_ANGLE: {default: {}},
  INDUSTRY_ANGLE: {default: {}},
  current_angle: {default: {}},
  current_state: {type: 'string', default: 'RANDOM'}
 },
 init: function () {
    //this.system.registerMe(this.el);
    
  //  console.log("------- init!!!")
    this.data.RANDOM_ANGLE = this.el.getAttribute('rotation');
    this.data.current_angle = this.data.RANDOM_ANGLE;
    this.data.INDUSTRY_ANGLE = {x:0, y:0, z: -1};

  },
  remove: function () {
    //this.system.unregisterMe(this.el);
  },
  updateIndustryAngle: function(industry_angle) {
    this.data.INDUSTRY_ANGLE = {x:0, y:0, z: (industry_angle)};
  },
  rotateToState: function(new_state) {
    // if (typeof(newAngle) != 'number' || isNaN(newAngle)) {
    var fadeTime = 1000;
    var rotateTime = 1800;

    if (new_state != this.data.current_state) {
      this.data.current_state = new_state;
      var goal_angle = this.data[String(new_state).toUpperCase()+'_ANGLE'];
 
      // if we don't have an industry and we're trying to do industry mode, fade out 
      if (this.data.INDUSTRY_ANGLE.z == -1 && new_state == 'INDUSTRY') {
        var circle = this.el.querySelector('a-circle');
        var text = this.el.querySelector('.mytext');
        
        var tween2 = new AFRAME.TWEEN.Tween({opacitytween: 1}).to({opacitytween: 0}, fadeTime);
        tween2.easing(AFRAME.TWEEN.Easing.Cubic.InOut)
        tween2.onUpdate(function(){
          circle.setAttribute('material', {opacity: this.opacitytween})
          text.setAttribute('text', {opacity: this.opacitytween})
        })
        tween2.start();

      }
      // if it's random mode, fade in beeyatch
      if (new_state == 'RANDOM') {
        var circle = this.el.querySelector('a-circle');
        var text = this.el.querySelector('.mytext');
        
        var tween3 = new AFRAME.TWEEN.Tween({opacitytween: 0}).to({opacitytween: 1}, fadeTime);
        tween3.easing(AFRAME.TWEEN.Easing.Cubic.InOut)
        tween3.onUpdate(function(){
          if (circle.getAttribute('material').opacity != 1) {
            circle.setAttribute('material', {opacity: this.opacitytween})
            text.setAttribute('text', {opacity: this.opacitytween})
          }
          
        })
        tween3.start();
      }
      // ease it 
            
      var that = this;

    //  console.log(String(that.data.current_state).toUpperCase()+'_ANGLE')
     // console.log("tween from "+that.data.current_angle+" to "+this.data[String(that.data.current_state).toUpperCase()+'_ANGLE'])

   //     console.log("**** Random Angle: "+ that.data.RANDOM_ANGLE.z + " ::::  INDUSTRY ANGLE: "+that.data.INDUSTRY_ANGLE.z)
      // if (this.data.current_state == 'RANDOM') {
      //   console.log("Random: "+ that.data.RANDOM_ANGLE.z + " // INDUSTRY: "+this.data.INDUSTRY_ANGLE.z+ " :::: current angle: "+that.data.current_angle.z)
      //   console.log("switch to: "+ this.data[String(that.data.current_state).toUpperCase()+'_ANGLE'].z)
      // }
      var tween = new AFRAME.TWEEN.Tween({finalangle: that.data.current_angle.z})
          .to({finalangle: this.data[String(that.data.current_state).toUpperCase()+'_ANGLE'].z}, rotateTime);
      tween.easing(AFRAME.TWEEN.Easing.Cubic.InOut)
      tween.onUpdate(function(){
        that.el.setAttribute('rotation', {x: 0, y: 0, z: this.finalangle})
      //  console.log("after: ",that.el.getAttribute('rotation'))
      })
      tween.onComplete(function(){
        that.data.current_angle = that.el.getAttribute('rotation');
      //  console.log("Random Angle: "+ that.data.RANDOM_ANGLE.z + " :::: current angle: "+that.data.current_angle.z)
      });
      tween.start();
  }
   
  }
});

