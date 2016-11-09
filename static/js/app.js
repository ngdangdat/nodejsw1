(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = Ractive.extend({
	template: require('../../tpl/home'),
	components: {
		navigation: require('../views/Navigation'),
		appfooter: require('../views/Footer')
	},
	onrender: function() {
		console.log('Home page rendered');
	}
});
},{"../../tpl/home":13,"../views/Footer":10,"../views/Navigation":11}],2:[function(require,module,exports){
module.exports = Ractive.extend({
	template: require('../../tpl/login'),
	components: {
		navigation: require('../views/Navigation'),
		appfooter: require('../views/Footer')
	},
	onrender: function() {
		var self = this;
		this.observe('email', userModel.setter('email'));
		this.observe('password', userModel.setter('password'));
		this.on('login', function() {
			userModel.login(function(error, result) { 
				if(error) {
					self.set('error', error.error);
				} else {
					self.set('error', false);
					// redirecting the user to the home page
					window.location.href = '/';
				}
			});
		});
	}
})
},{"../../tpl/login":14,"../views/Footer":10,"../views/Navigation":11}],3:[function(require,module,exports){
module.exports = Ractive.extend({
	template: require('../../tpl/register'),
	components: {
		navigation: require('../views/Navigation'),
		appfooter: require('../views/Footer')
	},
	onrender: function() {
		var self = this;
		this.observe('firstName', userModel.setter('value.firstName'));
		this.observe('lastName', userModel.setter('value.lastName'));
		this.observe('email', userModel.setter('value.email'));
		this.observe('password', userModel.setter('value.password'));
		this.on('register', function() {
			userModel.create(function(error, result) {
				if(error) {
					self.set('error', error.error)
				} else {
					self.set('error', false);
					self.set('success', 'Registration successful. Click <a href="/login">here</a> to login.');
				}
			});
		});
	}
});
},{"../../tpl/register":16,"../views/Footer":10,"../views/Navigation":11}],4:[function(require,module,exports){
var Router = require('./lib/Router')();
var Home = require('./controllers/Home');
var currentPage;
var body;
var Register = require('./controllers/Register');
var Login = require('./controllers/Login');
var UserModel = require('./models/User');

var showPage = function(newPage) {
	if(currentPage) currentPage.teardown();
	currentPage = newPage;
	body.innerHTML = '';
	currentPage.render(body);
	currentPage.on('navigation.goto', function(e, route) {
		Route.navigate(route);
	})
}

window.onload = function() {
	body = document.querySelector('body');
	userModel = new UserModel();
	userModel = fetch(function(error, result) {
		//...router setting
	});

	Router
	.add('home', function() {
		var p = new Home();
		showPage(p);
	})
	.add(function() {
		Router.navigate('home');
	})
	.listen()
	.check();
	Router
	.add('register', function() {
		var p = new Register();
		showPage(p);
	});
	Route
	.add('login', function (){
		var p = new Login();
		showPage(p);
	})
}
},{"./controllers/Home":1,"./controllers/Login":2,"./controllers/Register":3,"./lib/Router":6,"./models/User":8}],5:[function(require,module,exports){
module.exports = {
  request: function(ops) {
    if(typeof ops == 'string') ops = { url: ops };
    ops.url = ops.url || '';
    ops.method = ops.method || 'get'
    ops.data = ops.data || {};
    var getParams = function(data, url) {
      var arr = [], str;
      for(var name in data) {
        arr.push(name + '=' + encodeURIComponent(data[name]));
      }
      str = arr.join('&');
      if(str != '') {
        return url ? (url.indexOf('?') < 0 ? '?' + str : '&' + str) : str;
      }
      return '';
    }
    var api = {
      host: {},
      process: function(ops) {
        var self = this;
        this.xhr = null;
        if(window.ActiveXObject) { this.xhr = new ActiveXObject('Microsoft.XMLHTTP'); }
        else if(window.XMLHttpRequest) { this.xhr = new XMLHttpRequest(); }
        if(this.xhr) {
          this.xhr.onreadystatechange = function() {
            if(self.xhr.readyState == 4 && self.xhr.status == 200) {
              var result = self.xhr.responseText;
              if(ops.json === true && typeof JSON != 'undefined') {
                result = JSON.parse(result);
              }
              self.doneCallback && self.doneCallback.apply(self.host, [result, self.xhr]);
            } else if(self.xhr.readyState == 4) {
              self.failCallback && self.failCallback.apply(self.host, [self.xhr]);
            }
            self.alwaysCallback && self.alwaysCallback.apply(self.host, [self.xhr]);
          }
        }
        if(ops.method == 'get') {
          this.xhr.open("GET", ops.url + getParams(ops.data, ops.url), true);
        } else {
          this.xhr.open(ops.method, ops.url, true);
          this.setHeaders({
            'X-Requested-With': 'XMLHttpRequest',
            'Content-type': 'application/x-www-form-urlencoded'
          });
        }
        if(ops.headers && typeof ops.headers == 'object') {
          this.setHeaders(ops.headers);
        }       
        setTimeout(function() { 
          ops.method == 'get' ? self.xhr.send() : self.xhr.send(getParams(ops.data)); 
        }, 20);
        return this;
      },
      done: function(callback) {
        this.doneCallback = callback;
        return this;
      },
      fail: function(callback) {
        this.failCallback = callback;
        return this;
      },
      always: function(callback) {
        this.alwaysCallback = callback;
        return this;
      },
      setHeaders: function(headers) {
        for(var name in headers) {
          this.xhr && this.xhr.setRequestHeader(name, headers[name]);
        }
      }
    }
    return api.process(ops);
  }
}
},{}],6:[function(require,module,exports){
module.exports = function() {
	return {
		routes: [],
		root: '/',
		add: function(path, handler) {
			if(typeof path == 'function') {
				handler = path;
				path = '';
			}
			this.routes.push({
				path: path,
				handler: handler
			});
			return this;
		},
		check: function(f, params) {
			var fragment, vars;
			if (typeof f !== 'undefined') {
				fragment = f.replace(/^\//, '');
			} else {
				fragment = this.getFragment();
			}
			for (var i=0; i < this.routes.length; i++) {
				var match, path = this.routes[i].path;
				path = path.replace(/^\//, '');
				vars = path.match(/:[^\s/]+/g);
				var r = new RegExp('^' + path.replace(/:[^\s/]+/g, '([\\w-]+)'));
				match = fragment.match(r);
				if(match) {
					match.shift();
					var matchObj = {};
					if(vars) {
						for (var j = 0; j < vars.length; j++) {
							var v = vars[j];
							matchObj[v.substr(1, v.length)] = match[j];
						}
					}
					this.routes[i].handler.apply({},(params || []).concat([matchObj]));
					return this;
				}
			}
			return false;
		},
		listen: function() {
			var self = this;
			var current = self.getFragment();
			var fn = function() {
				if (current !== self.getFragment()) {
					current = self.getFragment();
					self.check(current);
				}
			}
			clearInterval(this.interval);
			this.interval = setInterval(fn, 50);
			return this;
		},
		navigate: function(path) {
			path = path ? path : '';
			history.pushState(null, null, this.root + this.clearSlashes(path));
			return this;
		},
		getFragment: function() {
			var fragment = '';
			fragment = this.clearSlashes(decodeURI(window.location.pathname + location.search));
			fragment = fragment.replace(/\?(.*)$/, '');
			return this.clearSlashes(fragment);
		},
		clearSlashes: function(path) {
			return path.toString().replace(/\/$/, '').replace(/^\//, '');
		}
	}
}
},{}],7:[function(require,module,exports){
var ajax = require('../lib/Ajax');
module.exports = Ractive.extend({
	data: {
		value: null,
		url: ''
	},
	fetch: function() {
		var self = this;
		ajax.request({
			url: self.get('url'),
			json: true
		})
		.done(function(result) {
			self.set('value', result);
		})
		.fail(function(xhr) {
			self.fire('Error fetching ' + self.get('url'))
		});
		return this;
	},
	bindComponent: function(component) {
		if(component) {
			this.observe('value', function(v) {
				for (var key in v) {
					component.set(key, v[key]);
				}
			}, { init: false });
		}
		return this;
	},
	create: function(callback) {
		var self = this;
		ajax.request({
			url: self.get('url'),
			method: 'POST',
			data: this.get('value'),
			json: true
		})
		.done(function(result) {
			if(callback){
				callback(null, result);
			}
		})
		.fail(function(xhr) {
			if(callback) {
				callback(JSON.parse(xhr.responseText));
			}
		});
		return this;
	},
	save: function(callback) {
		var self = this;
		ajax.request({
			url: self.get('url'),
			method: 'PUT',
			data: this.get('value'),
			json: true
		})
		.done(function(result) {

		})
		.fail(function(xhr) {

		})
	},
	del: function(callback) {
		var self = this;
		ajax.request({
			url: self.get('url'),
			method: 'DELETE',
			json: true
		})
		.done(function(result) {

		})
		.fail(function(xhr) {

		});
		return this;
	}
})
},{"../lib/Ajax":5}],8:[function(require,module,exports){
var Base = require('./Base');
module.exports = Base.extend({
	data: {
		url: '/api/user'
	},
	login: function(callback) {
		var self = this;
		ajax.request({
			url: this.get('url') + '/login',
			method: 'POST',
			data: {
				email: this.get('email'),
				password: this.get('password')
			},
			json: true
		})
		.done(function(result) {
			callback(null, result);
		})
		.fail(function(xhr) {
			callback(JSON.parse(xhr.responseText));
		})
	},
	isLogged: function() {
		return this.get('value.firstName') && this.get('value.lastName');
	}
});
},{"./Base":7}],9:[function(require,module,exports){
var Base = require('./Base');
module.exports = Base.extend({
	data: {
		url: '/api/version'
	}
});
},{"./Base":7}],10:[function(require,module,exports){
var FooterModel = require('../models/Version');

module.exports = Ractive.extend({
	template: require('../../tpl/footer'),
	onrender: function () {
		var model = new FooterModel();
		model.bindComponent(this).fetch();
	}
})
},{"../../tpl/footer":12,"../models/Version":9}],11:[function(require,module,exports){
module.exports = Ractive.extend({
	template: require('../../tpl/navigation')
});
},{"../../tpl/navigation":15}],12:[function(require,module,exports){
module.exports = {"v":4,"t":[{"t":7,"e":"footer","f":["Version: ",{"t":2,"r":"version"}]}]}
},{}],13:[function(require,module,exports){
module.exports = {"v":4,"t":[{"t":7,"e":"header","f":[{"t":7,"e":"navigation"}," ",{"t":7,"e":"div","m":[{"n":"class","f":"hero","t":13}],"f":[{"t":7,"e":"h1","f":["Node.js by Example"]}]}]}," ",{"t":7,"e":"appfooter"}]}
},{}],14:[function(require,module,exports){
module.exports = {"v":4,"t":[{"t":7,"e":"header","f":[{"t":7,"e":"navigation"}]}," ",{"t":7,"e":"div","m":[{"n":"class","f":"hero","t":13}],"f":[{"t":7,"e":"h1","f":["Login"]}]}," ",{"t":7,"e":"form","f":[{"t":4,"f":[{"t":7,"e":"div","m":[{"n":"class","f":"error","t":13}],"f":[{"t":2,"r":"error"}]}],"n":50,"x":{"r":["error"],"s":"_0&&_0!=\"\""}}," ",{"t":4,"f":[{"t":7,"e":"div","m":[{"n":"class","f":"success","t":13}],"f":[{"t":3,"r":"success"}]}],"n":50,"x":{"r":["success"],"s":"_0&&_0!=\"\""}},{"t":4,"n":51,"f":[{"t":7,"e":"label","m":[{"n":"for","f":"email","t":13}],"f":["Email"]}," ",{"t":7,"e":"input","m":[{"n":"type","f":"text","t":13},{"n":"id","f":"email","t":13},{"n":"value","f":[{"t":2,"r":"email"}],"t":13}]}," ",{"t":7,"e":"label","m":[{"n":"for","f":"password","t":13}],"f":["Password"]}," ",{"t":7,"e":"input","m":[{"n":"type","f":"password","t":13},{"n":"id","f":"password","t":13},{"n":"value","f":[{"t":2,"r":"password"}],"t":13}]}," ",{"t":7,"e":"input","m":[{"n":"type","f":"button","t":13},{"n":"value","f":"login","t":13},{"n":"click","f":"login","t":70}]}],"l":1}]}," ",{"t":7,"e":"appfooter"}],"e":{}}
},{}],15:[function(require,module,exports){
module.exports = {"v":4,"t":[{"t":7,"e":"nav","f":[{"t":7,"e":"ul","f":[{"t":7,"e":"li","f":[{"t":7,"e":"a","m":[{"n":"click","f":{"n":"goto","a":["home"]},"t":70}],"f":["Home"]}]}," ",{"t":4,"f":[{"t":7,"e":"li","f":[{"t":7,"e":"a","m":[{"n":"click","f":{"n":"goto","a":["register"]},"t":70}],"f":["Register"]}]}," ",{"t":7,"e":"li","f":[{"t":7,"e":"a","m":[{"n":"click","f":{"n":"goto","a":["login"]},"t":70}],"f":["Login"]}]}],"n":50,"x":{"r":["isLogged"],"s":"!_0"}},{"t":4,"n":51,"f":[{"t":7,"e":"li","m":[{"n":"class","f":"right","t":13}],"f":[{"t":7,"e":"a","m":[{"n":"click","f":{"n":"goto","a":["logout"]},"t":70}],"f":["Logout"]}]}," ",{"t":7,"e":"li","m":[{"n":"class","f":"right","t":13}],"f":[{"t":7,"e":"a","m":[{"n":"click","f":{"n":"goto","a":["profile"]},"t":70}],"f":["Profile"]}]}],"l":1}]}]}],"e":{}}
},{}],16:[function(require,module,exports){
module.exports = {"v":4,"t":[{"t":7,"e":"header","f":[{"t":7,"e":"navigation"}]}," ",{"t":7,"e":"div","m":[{"n":"class","f":"hero","t":13}],"f":[{"t":7,"e":"h1","f":["Register"]}]}," ",{"t":7,"e":"form","f":[{"t":4,"f":[{"t":7,"e":"div","m":[{"n":"class","f":"error","t":13}],"f":[{"t":2,"r":"error"}]}],"n":50,"x":{"r":["error"],"s":"_0&&_0!=\"\""}}," ",{"t":4,"f":[{"t":7,"e":"div","m":[{"n":"class","f":"success","t":13}],"f":[{"t":2,"r":"success"}]}],"n":50,"x":{"r":["success"],"s":"_0&&_0!=\"\""}},{"t":4,"n":51,"f":[{"t":7,"e":"label","m":[{"n":"for","f":"first-name","t":13}],"f":["First name"]}," ",{"t":7,"e":"input","m":[{"n":"type","f":"text","t":13},{"n":"id","f":"first-name","t":13},{"n":"value","f":[{"t":2,"r":"firstName"}],"t":13}]}," ",{"t":7,"e":"label","m":[{"n":"for","f":"last-name","t":13}],"f":["Last name"]}," ",{"t":7,"e":"input","m":[{"n":"type","f":"text","t":13},{"n":"id","f":"last-name","t":13},{"n":"value","f":[{"t":2,"r":"lastName"}],"t":13}]}," ",{"t":7,"e":"label","m":[{"n":"for","f":"email","t":13}],"f":["Email"]}," ",{"t":7,"e":"input","m":[{"n":"type","f":"text","t":13},{"n":"id","f":"email","t":13},{"n":"value","f":[{"t":2,"r":"email"}],"t":13}]}," ",{"t":7,"e":"label","m":[{"n":"for","f":"password","t":13}],"f":["Password"]}," ",{"t":7,"e":"input","m":[{"n":"type","f":"password","t":13},{"n":"id","f":"password","t":13},{"n":"value","f":[{"t":2,"r":"password"}],"t":13}]}," ",{"t":7,"e":"input","m":[{"n":"type","f":"button","t":13},{"n":"value","f":"register","t":13},{"n":"click","f":"register","t":70}]}],"l":1}]}," ",{"t":7,"e":"appfooter"}],"e":{}}
},{}]},{},[4])