var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe('ItemsHandler', function() {

  var items = {};

  function getContainer() {
    return document.getElementById('myContainer');
  }

  before(function() {
    window.document.body.innerHTML = window.__html__['test/unit/itemsHandler_spec.html'];
    Array.prototype.map.call(getContainer().querySelectorAll('section'), function(element) {
      items[element.id] = element;
    });
  });

  after(function() {
    window.document.body.innerHTML = null;
  });

  function dispatchCustomEvent(name, reason, id, enabled) {
    window.dispatchEvent(new CustomEvent(name, {
      detail: {
        id: id,
        reason: reason,
        enabled: !!enabled
      }
    }));
  }

  function clickButton(ctx, selector, id, type, cb) {
    var control = getContainer().querySelector(selector);

    ctx.stub(window, 'CustomEvent', function(name, data) {
      expect(name).to.equal('roomView:buttonClick');
      expect(data.detail.streamId).to.equal(id);
      expect(data.detail.name).to.equal(type);
      cb();
    });

    control.click();
  }

  describe('#init', function() {
    it('should export a init function', function() {
      expect(ItemsHandler.init).to.exist;
      expect(ItemsHandler.init).to.be.a('function');
    });

    it('should be initialized', function() {
      ItemsHandler.init(getContainer(), items);
    });

    it('should listen click events on video button for the publisher', sinon.test(function(done) {
      clickButton(this, '#publisher i[data-icon="video"]', 'publisher', 'video', done);
    }));

    it('should listen click events on mic button for the publisher', sinon.test(function(done) {
      clickButton(this, '#publisher i[data-icon="mic"]', 'publisher', 'audio', done);
    }));

    it('should listen click events on video button for subscribers', sinon.test(function(done) {
      clickButton(this, '#subscriber i[data-icon="video"]', 'subscriber', 'video', done);
    }));

    it('should listen click events on audio button for subscribers', sinon.test(function(done) {
      clickButton(this, '#subscriber i[data-icon="audio"]', 'subscriber', 'audio', done);
    }));

    it('should listen roomController events', function() {

      var check = function(id) {
        var reasonPrefix = (id === 'publisher') ? 'publish' : 'subscribe';

        var elem = getContainer().querySelector('#' + id + ' .video-action');

        expect(elem.classList.contains('enabled')).to.be.true;
        dispatchCustomEvent('roomController:video', reasonPrefix + 'Video', id);
        expect(elem.classList.contains('enabled')).to.be.false;

        elem = getContainer().querySelector('#' + id + ' .audio-action');

        expect(elem.classList.contains('enabled')).to.be.true;
        dispatchCustomEvent('roomController:audio', reasonPrefix + 'Audio', id);
        expect(elem.classList.contains('enabled')).to.be.false;
      };

      check('publisher');
      check('subscriber');
    });

  });

});
