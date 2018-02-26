var slider = (function() {
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var defaults = {
    timeOut: 4000,
    showSwitchBtn: true,
    switchClassName: 'slider-item-btn',
    showPrevNext: true,
    prevClassName: 'slider-prev',
    nextClassName: 'slider-next',
    switchWrapperClass: 'slider-item-wrapper',
    containerClassName: 'slider-container',
    switchActiveClassName: 'active',
    autoplay: true,
    items: 1,
    itemClassName: 'slide-item',
    elClass: 'slide'
  };

  function removeClass(el, cls) {
    var classes = el.className.split(/\s+/);
    if (classes.indexOf(cls) !== -1) {
      classes.splice(classes.indexOf(cls), 1);
    }
    el.className = classes.join(' ');
  }

  function hasClass(el, cls) {
    var classes = el.className.split(/\s+/);
    if (classes.indexOf(cls) !== -1) {
      return true;
    }
    return false;
  }

  function addClass(el, cls) {
    if (!hasClass(el, cls)) {
      var arr = el.className.split(/\s+/);
      arr.push(cls);
      el.className = arr.join(' ');
    }
  }

  function AddClass(els, cls, index) {
    for (var f = 0; f < els.length; f++) {
      if (f === index) {
        addClass(els[f], cls);
      } else {
        removeClass(els[f], cls);
      }
    }
  }

  function makeSwitch(num, cls, pcls, ac, func) {
    var p = document.createElement('div');
    var u = document.createElement('ul');
    p.className = pcls;
    var i = 0;
    while (i < num) {
      var li = document.createElement('li');
      if (i == 0) {
        li.className = cls + ' ' + ac
      } else {
        li.className = cls;
      }
      li.setAttribute('data-index', i);
      u.appendChild(li);
      i++;
    }
    p.appendChild(u);
    return p;
  }
  var slider = function(opt) {
    this.options = this.extend(opt || {}, defaults);
    this.init();
  }
  slider.prototype = {
    init: function() {
      if (!hasOwnProperty.call(this.options, 'el') || !document.querySelector(this.options.el)) {
        throw 'Container [' + this.options.el + ']' + ' not found';
        return;
      }
      var _this=this;
      this.el = document.querySelector(this.options.el);
      this.render();
      window.onresize=function(){
        _this.WIDTH=_this.options.width || window.getComputedStyle(_this.el, null).getPropertyValue('width');
        for (var i = 0; i < _this.CHILDRENS.length; i++) {
          _this.CHILDRENS[i].style.width = parseFloat(_this.WIDTH) / _this.options.items + 'px';
          _this.CHILDRENS[i].style.height = _this.HEIGHT;
          _this.CHILDRENS[i].style.float = 'left';
        }
        _this.animation=true;
        _this.WRAPPER.style.left=-((_this.nowIndex+1)*parseFloat(_this.WIDTH))+'px';
        _this.animation=false;
        _this.WRAPPER.style.width=_this.CHILDRENS.length*parseFloat(_this.WIDTH)+'px';
      }
    },
    reset: function() {
      var _this = this;
      addClass(this.el, this.options.elClass);
      this.WIDTH = this.options.width || window.getComputedStyle(this.el, null).getPropertyValue('width');
      this.CHILDRENS = Object.assign([], this.el.getElementsByClassName(this.options.itemClassName));
      this.el.innerHTML = '';
      this.WRAPPER = document.createElement('div');
      addClass(this.WRAPPER, 'slide-content');
      this.CHILDRENS.forEach(function(i) {
        _this.WRAPPER.appendChild(i);
      });
      var head = this.CHILDRENS[0].cloneNode(true),
        last = this.CHILDRENS[this.CHILDRENS.length - 1].cloneNode(true);
      this.WRAPPER.insertBefore(last, this.CHILDRENS[0]);
      this.CHILDRENS.push(last);
      this.WRAPPER.appendChild(head);
      this.CHILDRENS.splice(0, 0, head);
      this.WRAPPER.style.width = parseFloat(this.WIDTH) * this.CHILDRENS.length + 'px';
      this.WRAPPER.style.left = '-' + this.WIDTH;
      this.HEIGHT = this.options.height || window.getComputedStyle(this.CHILDRENS[0], null).getPropertyValue('height');
      this.el.style.height = this.HEIGHT;
      addClass(this.el, this.options.containerClassName);
      this.el.appendChild(this.WRAPPER);
    },
    render: function() {
      this.reset();
      this.animation=false;
      if (this.CHILDRENS.length == 1) {
        return;
      } // only one picture
      this.el.style.position = 'relative';
      this.el.style.overflow = 'hidden';
      this.nowIndex = 0;
      for (var i = 0; i < this.CHILDRENS.length; i++) {
        this.CHILDRENS[i].style.width = parseFloat(this.WIDTH) / this.options.items + 'px';
        this.CHILDRENS[i].style.height = this.HEIGHT;
        this.CHILDRENS[i].style.float = 'left';
      }
      if (this.options.showSwitchBtn) {
        var inum = this.CHILDRENS.length - 2,
          _this = this;
        this.sws = makeSwitch(inum, this.options.switchClassName, this.options.switchWrapperClass, this.options.switchActiveClassName, this.setIndex);
        this.el.appendChild(this.sws);
        var els = this.sws.querySelectorAll('.slider-item-btn');
        for (var k = 0; k < els.length; k++) {
          els[k].addEventListener('click', function() {
            _this.setIndex(parseInt(this.getAttribute('data-index')));
            _this.restart();
          }, false);
        }
      }
      if (this.options.showPrevNext) {
        var prev = document.createElement('div');
        var next = document.createElement('div');
        var _this = this;
        prev.className = this.options.prevClassName;
        next.className = this.options.nextClassName;
        prev.addEventListener('click', function() {
          _this.prev();
        }, false);
        next.addEventListener('click', function() {
          _this.next();
        }, false);
        this.el.appendChild(prev);
        this.el.appendChild(next);
      }
      this.start();
    },
    setIndex: function(index /*移动多少个单位的距离 */) {
        if(this.animation)return /*正在切换中*/
        if(this.nowIndex < index&&index<this.CHILDRENS.length - 2){ //左移动 next
              this.nowIndex = index;
              this.showBtn();
              this.move(-((this.nowIndex+1)*parseFloat(this.WIDTH)));
        }else if(index >= this.CHILDRENS.length - 2){
            this.move(-(this.CHILDRENS.length-1)*parseFloat(this.WIDTH),function(){
            this.WRAPPER.style.left=-parseFloat(this.WIDTH)+'px';
          });
            this.nowIndex = 0;
        }else if(index<0){//左边距
              this.move(0,function(){
              this.WRAPPER.style.left=-(this.CHILDRENS.length-2)*parseFloat(this.WIDTH)+'px';
            });
            this.nowIndex=this.CHILDRENS.length-3;
        }else if(this.nowIndex > index){
              this.move(-((this.nowIndex)*parseFloat(this.WIDTH)));
              this.nowIndex=index;
        }
        this.showBtn();
    },
    move: function(target, _callback) {
        var _call = _callback || function() {},
            _this = this;
        var left = _this.WRAPPER.style.left,
        dis = parseFloat(target) - parseFloat(left), //需要移动的距离
        speed = dis / 10;
        this.animation=true;
        var timer = setInterval(function() {
            var now = _this.WRAPPER.style.left;
            if( parseFloat(now) === parseFloat(target)){
              clearInterval(timer);
              _this.WRAPPER.style.left = parseFloat(target) + 'px';
                _call.call(_this);
              _this.animation=false;
            }else{
                _this.WRAPPER.style.left = parseFloat(now) + speed + 'px';
            }
        }, 30);
    },
    showBtn: function() { //
      var eles = this.el.querySelector('.' + this.options.switchWrapperClass).querySelectorAll('.' + this.options.switchClassName);
      AddClass(eles, this.options.switchActiveClassName, this.nowIndex);
    },
    prev: function() {
      this.setIndex(this.nowIndex-1);
      this.restart();
    },
    next: function() {
      this.setIndex(this.nowIndex+1);
      this.restart();
    },
    start: function() {
      if (!this.options.autoplay) return;
      var _this = this;
      this.timer = setInterval(function() {
        _this.next();
      }, _this.options.timeOut);
    },
    restart: function() {
      this.pause();
      this.start();
    },
    pause: function() {
      clearInterval(this.timer);
    },
    extend: function() {
      var arr = arguments;
      var i = 1;
      var target = arguments[0] || {};
      for (; i < arguments.length; i++) {
        if (typeof arguments[i] !== 'object' || typeof arguments[i] === null) {
          continue;
        }
        for (var name in arguments[i]) {
          target[name] = arguments[i][name];
        }
      }
      return target;
    }
  };
  return slider;
})()
