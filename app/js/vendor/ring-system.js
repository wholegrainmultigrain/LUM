
AFRAME.registerSystem('soundring', {
  schema: {

    CATEGORY_COLORS: {
      default: {
        'Academic': {
          color: '#57fbff',
          represented: 0
        },
        'FIN': {
          color: '#f9aa00',
          represented: 0
        },
        'Government':  {
          color: '#ef4503',
          represented: 0
        },
        'Industry':  {
          color: '#008cff',
          represented: 0
        },
        'Media':  {
          color: '#fff255',
          represented: 0
        },
        'Startup':  {
          color: '#ffaef0',
          represented: 0
        },
        'Non-Profit':  {
          color: '#bfff33',
          represented: 0
        },
      }
    }
    location: {
    	default: {
    		x: 0,
    		y: 0,
    		z: 0
    	}
    },
    MAX_SIZE: .5,
    MIN_SIZE: .1
  },
  init: function () {
    this.entities = [];

  },

  registerMe: function (el) {
    this.entities.push(el);
  },
  unregisterMe: function (el) {
    var index = this.entities.indexOf(el);
    this.entities.splice(index, 1);
  }
});
