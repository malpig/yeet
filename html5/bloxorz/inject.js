
const lsijVersion = 1;
(function() {
  if (window.top === window.self) {
    console.log('[LS Filter] -> ' + window.location.href);
    const tabId = Math.random() * 16;
    let currentUrl, killYTAutoplayInt, hideYTAvatarInt, failedRetry;

    const saTicker = function () {
      if ((currentUrl !== window.location.href) || failedRetry) {
        saReport();
        checkYoutube();
        currentUrl = window.location.href;
      }
    };
    setInterval(saTicker, 1000);

    const saReport = function () {
      const xhr = new XMLHttpRequest();
      const body = {
        url: window.location.href
      };
      console.log('[LS Filter] logging -> ' + JSON.stringify(body));
      xhr.open('POST', document.location.origin + '/522675c8e566c8eeb53a06be383e5a78f4460bd5d3e6f5b56e9c6ba2413722e5/log', true);
      xhr.send(JSON.stringify(body));
    };

    const checkYoutube = function() {
      if (window.location.href.match(/(^|\.)youtube\./)) {
        console.log('[LS Filter] YouTube detected');
        applyYouTube();
      };
    }

    const applyYouTube = function () {
      const xhr = new XMLHttpRequest();
      const body = {
        url: window.location.href
      };
      xhr.open('POST', document.location.origin + '/522675c8e566c8eeb53a06be383e5a78f4460bd5d3e6f5b56e9c6ba2413722e5/ytconf', true);
      xhr.send(JSON.stringify(body));
      xhr.onreadystatechange = function () {
				console.log('[LS Filter] YouTube check status -> ', this.status);
        if (this.status === 200 && xhr.responseText) {
					failedRetry = false;
          const ytSettings = JSON.parse(xhr.responseText);
          console.log('[LS Filter] YouTube settings -> ' + JSON.stringify(ytSettings));
          if (ytSettings.redirect && ytSettings.redirect != '') {
            window.location.href = ytSettings.redirect;
          } else {
            configureYoutube(ytSettings);
          }
        } else {
					failedRetry = true;
				}
      };
    };

    const killMiniPlayers = function() {
			const vc = document.getElementById('video-preview-container');
			if (vc) {
				vc.remove();
			}
			const mp = document.getElementsByTagName('ytd-miniplayer');
			if (mp.length > 0) {
				mp[0].remove();
			}
			document.querySelectorAll('div#mouseover-overlay').forEach((d) => { d.remove(); });
			document.querySelectorAll('div#hover-overlays').forEach((d) => { d.remove(); });
		};
		
		const configureYoutube = function(ytSettings) {
			if (typeof(ytSettings) === 'undefined') { return;}
		
			const style = document.createElement('STYLE');
			style.type = 'text/css';
			style.innerText = '';
			if (ytSettings.hide_sidebar) {
				console.debug('[LS Filter] hide sidebar');
				style.innerText += '.watch-sidebar, .ytd-watch-next-secondary-results-renderer {display: none !important;}\n';
			}
			if (ytSettings.hide_comments) {
				console.debug('[LS Filter] hide comments');
				style.innerText += '#watch-discussion, .watch-discussion, ytd-comments {display: none !important;}\n';
			}
			if (style.innerText !== '') {
				let head = document.getElementsByTagName('head');
				if (head && head.length > 0) {
					head = head[0];
					head.append(style);
				}
			}
		
			if (ytSettings.disable_chan_autoplay) {
				console.debug('[LS Filter] disable autoplay');
				if (typeof(killYTAutoplayInt) !== 'undefined') {
					clearInterval(killYTAutoplayInt);
					killYTAutoplayInt = undefined;
				}
				killYTAutoplay();
				killYTAutoplayInt = setInterval(killYTAutoplay, 1000);
			}
		
			if (ytSettings.hide_thumbnails) {
				console.debug('[LS Filter] hide thumbnails');
				if (typeof(hideYTAvatarInt) !== 'undefined') {
					clearInterval(hideYTAvatarInt);
					hideYTAvatarInt = undefined;
				}
				hideYTAvatars();
				hideYTAvatarInt = setInterval(hideYTAvatars, 1000);
			}
		
			console.debug('[LS Filter] hide miniplayers');
			if (typeof(killMiniPlayerInt) !== 'undefined') {
				clearInterval(killMiniPlayerInt);
				killMiniPlayerInt = undefined;
			}
			killMiniPlayers();
			killMiniPlayerInt = setInterval(killMiniPlayers, 1000);
		};

    const blockYTImg = '/522675c8e566c8eeb53a06be383e5a78f4460bd5d3e6f5b56e9c6ba2413722e5/blocked-image-search.png';
    function hideYTAvatars() {
      const a = [...document.querySelectorAll('#avatar, #channel-thumbnail')];
      a.forEach((t) => {
        [...t.getElementsByTagName('img')].forEach((i) => {
          if (!i.src.match(blockYTImg) && i.src.startsWith('https://')) {
            console.log('[LS Filter] hiding thumbnail ->', i.src);
            i.src = blockYTImg;
          }
        });
      });
    };

    const killYTAutoplay = function() {
		const a = document.createElement('A');
		a.href = window.location.href;
		if (a.hostname.match(/(^|\.)youtube\./)) {
			if (
				a.pathname.match(/^\/user\/[^\/\?]+$/)
				||
				a.pathname.match(/^\/channel\/[^\/\?]+$/)
				||
				a.pathname.match(/^\/c\/[^\/\?]+$/)
				||
				a.pathname.match(/\/featured$/)
			) {
				const v = document.getElementsByTagName('video');
				if (v.length > 0) {
					for (i in v) {
						if (typeof(v[i].pause) === 'function') {
							if (!v[i].paused) {
								console.debug('[LS Filter] pause autoplay');
								v[i].pause();
							}
							const c = v[i].closest('ytd-channel-video-player-renderer');
							if (c && c.style.display !== 'none') {
								console.debug('[LS Filter] hide autoplay container');
								c.style.display = 'none';
							}
						}
					};
				}
			}
		}
	};

    saTicker();
  }
}).call(this);


(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
	window.relay_log = 'debug'
	const a = document.createElement('A');
	a.href = window.location.href;
	const FlagEngine = require('./in_page/in_page_flags');
	
	const setupFlagScanning = function(terms, ignoredSites, mode) {
		if (window.relay_log === 'debug') { console.debug('[LS Filter] setup flag scanning'); }
		if (!Array.isArray(ignoredSites)) { ignoredSites = []; }
		if (terms && terms.length > 0) {
			if (window.relay_log === 'debug') { console.debug('[LS Filter] terms found'); }
			let scanInterval;
			const flagger = new FlagEngine(a);
			flagger.Initialize(terms, ignoredSites, mode).then(() => {
				if (mode === 'intent') {
					// Intent
					if (flagger.google) {
						const docbody = document.createElement('input');
						docbody.type = 'hidden';
						docbody.id = 'docbodytext';
						document.body.appendChild(docbody);

						let lastText = '';
						setInterval(() => {
							const text = docbody.value;
							if (text === "" || text === lastText)
								return;
							lastText = text;
							flagger.ScanValue(text);
						}, 1000);

						// Hook XMLHttpRequest
						const open = window.XMLHttpRequest.prototype.open;
						const send = window.XMLHttpRequest.prototype.send;
						window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
							this._url = url;
							return open.apply(this, arguments);
						}
						window.XMLHttpRequest.prototype.send = function(data) {
							if (this._url.includes('assistwriting')) {
								const e = document.getElementById('docbodytext');
								if (e)
									e.value = decodeURIComponent(data);
							}
							return send.apply(this, arguments);
						}
					}
				} else {
					// Page Scan
					console.debug('[LS Filter] page scanning');
					if (typeof(scanInterval) !== 'undefined') {
						clearInterval(scanInterval);
					}

					let lastText = '';
					const scanAndReport = () => {
						if (window.relay_log === 'debug') { console.debug('[LS Filter] scanAndReport'); }
						try {
							// Make sure we are up to date on our url
							if (a.href !== window.location.href) {
								if (window.relay_log === 'debug') { console.debug('[LS Filter] location changed'); }
								a.href = window.location.href;
							}

							let text = '';
							if (flagger.google) {
								// Google Docs
								// Title and initial content
								const title = document.querySelector("meta[property='og:title']");
								if (title)
								  text += title.getAttribute('content');
								const content = document.querySelector("meta[property='og:description']");
								if (content)
								  text += ' ' + content.getAttribute('content');
							}
							text += document.body.innerText;

							// Only scan text if changed
							if (text === lastText)
								return;
							lastText = text;

							// Scan
							const flags = flagger.Scan(text, false);
							if (Array.isArray(flags) && flags.length > 0) {
								if (window.relay_log === 'debug') { console.debug('[LS Filter] scanning found flags, reporting them: ', flags); }
								flagger.Report(flags);
							}
						} catch (e) {
							console.error(e);
						}
					};
					scanInterval = setInterval(scanAndReport, 5000);
					scanAndReport();
				}
			}).catch(console.error);
		}
	};
	setupFlagScanning([], {"docs.google.com":{"matcher":"docs.google.com","mode":"page"}}, 'intent');
	
	},{"./in_page/in_page_flags":5}],2:[function(require,module,exports){
	class FacebookFlags {
		constructor(url) {
			if (typeof(url) === 'undefined') { throw new Error('URL Object required'); }
			this.disabled = true;
			this.moduleName = 'facebook';
			if (url.hostname.match(/\.?facebook\.com$/i)) {
				this.disabled = false;
			}
		}
	
		GatherIntent() {
			if (this.disabled) { return;}
			const ret = [];
			const elements = document.querySelectorAll('[data-text="true"]');
			elements.forEach((e) => {
				ret.push(e.innerText);
			});
			return ret;
		}
	}
	
	module.exports = FacebookFlags;
	
	},{}],3:[function(require,module,exports){
	class GmailFlags {
		constructor(url) {
			if (typeof(url) === 'undefined') { throw new Error('URL Object required'); }
			this.disabled = true;
			this.moduleName = 'gmail';
			if (url.hostname.match(/mail\.google\.com$/i)) {
				this.disabled = false;
			}
		}
	
		GatherIntent() {
			if (this.disabled) { return;}
			const ret = [];
			const elements = document.querySelectorAll('[role="textbox"]');
			elements.forEach((e) => {
				ret.push(e.innerText);
			});
			return ret;
		}
	}
	
	module.exports = GmailFlags;
	
	},{}],4:[function(require,module,exports){
	class GoogleDoc {
		constructor(url) {
			if (typeof(url) === 'undefined') { throw new Error('URL Object required'); }
			this.disabled = true;
			this.moduleName = 'google_doc';
			if (url.hostname.match(/docs\.google\.com$/i)) {
				this.disabled = false;
			}
		}
	
		GatherIntent() {
			if (this.disabled) { return;}
			const ret = [document.body.innerText];
			return ret;
		}
	}
	
	module.exports = GoogleDoc;
	
	},{}],5:[function(require,module,exports){
	const supportedDOMEvents = ['change', 'keyup'];
	const FB = require('./facebook_flags');
	const Twitter = require('./twitter_flags');
	const Gmail = require('./gmail_flags');
	const GoogleDoc = require('./google_doc_flags');
	const MSOffice = require('./ms_office_flags');
	class Flags {
		constructor(url) {
			if (typeof(url) === 'undefined') {
				throw new Error('URL object required');
			}
			this.url = url;
			this.terms = [];
			this.target = {};
			this.initialized = false;
			this.reportedTerms = {};
			this.modules = [];
			this.google = null;

			const fbModule = new FB(url);
			if (!fbModule.disabled) {
				this.modules.push(fbModule);
			}
			const twitterModule = new Twitter(url);
			if (!twitterModule.disabled) {
				this.modules.push(twitterModule);
			}
			const gmailModule = new Gmail(url);
			if (!gmailModule.disabled) {
				this.modules.push(gmailModule);
			}
			const googleDocModule = new GoogleDoc(url);
			if (!googleDocModule.disabled) {
				this.modules.push(googleDocModule);
				this.google = googleDocModule;
			}
			const msOfficeModule = new MSOffice(url);
			if (!msOfficeModule.disabled) {
				this.modules.push(msOfficeModule);
			}
		}

		ScanValue(value) {
			if (typeof(this.target.RelayFlaggedTerms) === 'undefined')
				this.target.RelayFlaggedTerms = {};

			const flags = this.Scan(value, true);
			const toReport = [];
			flags.forEach((flag) => {
				const term = flag[0];
				const cnt = flag[1];
				flag[2] = true; // mark it as user entered
				if (typeof(this.target.RelayFlaggedTerms[term]) === 'undefined') {
					this.target.RelayFlaggedTerms[term] = cnt;
					toReport.push(flag);
				} else {
					if (this.target.RelayFlaggedTerms[term] < cnt) {
						// Only report the new difference
						flag[1] = cnt - this.target.RelayFlaggedTerms[term];
						this.target.RelayFlaggedTerms[term] += flag[1];
						toReport.push(flag);
					}
				}
			});

			if (toReport.length > 0)
				this.Report(toReport);
		}

		DOMExtractAndScan(event) {
			if (typeof(event.target) === 'undefined') { throw new Error('event has no target'); }
			let values;
			let scanType;
			switch (event.type) {
			case 'scan':
				scanType = 'GatherIntent';
				break;
			default:
				scanType = event.target.tagName.toLowerCase();
				break;
			}
	
			switch (scanType) {
			case 'input':
				let type = event.target.type || 'text';
				type = type.toLowerCase();
				// Dont scan password fields
				if (type === 'password') { break;}
				values = [event.target.value];
				break;
			case 'textarea':
				values = [event.target.value];
				break;
			default:
				values = [];
				this.modules.forEach((module) => {
					if (typeof(module.GatherIntent) === 'function') {
						const intent = module.GatherIntent();
						if (typeof(intent) === 'string') {
							values.push(intent);
						} else if (Array.isArray(intent)) {
							values = values.concat(intent);
						}
					}
				});
				break;
			}

			if (typeof(values) !== 'undefined') {
				values.forEach((value) => {
					this.ScanValue(value);
				});
			}
		}
	
		HandleDOM_change(event) {
			if (typeof(event) === 'undefined') { throw new Error('event required'); }
			if (event.type !== 'change') { throw new Error('event must be a change event'); }
			if (typeof(event.target) === 'undefined') { throw new Error('event has no target'); }
			if (typeof(event.target.tagName) === 'undefined') { return; }
			if (this.ShouldIgnore()) { return; }
			this.DOMExtractAndScan(event);
		}
	
		HandleDOM_keyup(event) {
			if (typeof(event) === 'undefined') { throw new Error('event required'); }
			if (event.type !== 'keyup') { throw new Error('event must be a keyup event'); }
			if (typeof(event.target) === 'undefined') { throw new Error('event has no target'); }
			if (typeof(event.target.tagName) === 'undefined') { return; }
			if (this.ShouldIgnore()) { return; }
			this.DOMExtractAndScan(event);
		}
	
		HandleDOM(event) {
			if (typeof(event) === 'undefined') { throw new Error('event required'); }
			if (supportedDOMEvents.indexOf(event.type) === -1) {
				throw new Error('unsupported event type - ', event.type);
			}
			if (typeof(this['HandleDOM_' + event.type]) === 'function') {
				this['HandleDOM_' + event.type](event);
			}
		};
	
		BindToDOM() {
			document.addEventListener('change', this.HandleDOM.bind(this));
			document.addEventListener('keyup', this.HandleDOM.bind(this));
			setInterval(() => {
				this.DOMExtractAndScan(new Event('scan'));
			}, 1000);
		}
	
		Initialize(terms, ignoredSites, mode) {
			if (!Array.isArray(terms)) { throw new Error('terms required'); }
			if (!Array.isArray(ignoredSites)) { throw new Error('ignoredSites required'); }
			return new Promise((resolve, reject) => {
				this.terms = [];
				terms.forEach((term) => {
					const args = {term: term};
					let regexTerm = term.replace(/[\]{}?^$().*\\+|[]/g, '\\$&');
					regexTerm = regexTerm.replace(/\\\*/g, '.*');
					regexTerm = regexTerm.replace(/\\\?/g, '.');
					args.regex = new RegExp('\\b' + regexTerm + '\\b','gi');
					this.terms.push(args);
				});
				this.ignoredSites = ignoredSites;
				this.initialized = true;
				if (mode === 'intent') {
					console.debug('[LS Filter] user intent');
					this.BindToDOM();
				}
				resolve();
			});
		}
	
		SiteMatchers() {
			if (typeof(this.siteMatchers) !== 'undefined') { return this.siteMatchers; }
			if (!Boolean(this.initialized)) { throw new Error('Initialization required'); }
			try {
				this.siteMatchers = [];
				this.ignoredSites.forEach((site) => {
					if (typeof(site) === 'object') {
						if (Boolean(site.r)) {
							this.siteMatchers.push(
								new RegExp(site.url, 'i')
							);
						}
					} else if (typeof(site) === 'string') {
						if (site.match(/^([\w\d-]{1,63}\.)+[\w\d-]{1,63}$/i)) {
							this.siteMatchers.push(site.toLowerCase().split('.'));
						} else {
							let escapedUrl = site.replace(/[\]{}?^$().*\\+|[]/g, '\\$&');
							escapedUrl = escapedUrl.replace(/\\\*/g, '.*');
							this.siteMatchers.push(new RegExp('^' + escapedUrl + '$', 'i'));
						}
					}
				});
			} catch (e) {
				this.siteMatchers = undefined;
				throw e;
			}
			return this.siteMatchers;
		}
	
		ShouldIgnore() {
			if (!Boolean(this.initialized)) { throw new Error('Initialization required'); }
			let ignore = false;
			const parts = this.url.hostname.toLowerCase().split('.');
			this.SiteMatchers().some((site) => {
				if (Object.prototype.toString.call(site) === '[object Array]') {
					const al = site.length;
					const pl = site.length;
					if (al <= pl) {
						for (let i=0; i<al; i++) {
							if (site[(al-1)-i] !== parts[(pl-1)-i]) {
								return false;
							}
						}
						ignore = true;
						return true;
					}
				} else if (this.url.href.match(site)) {
					ignore = true;
					return true;
				}
			});
			return ignore;
		}
	
		Scan(input, flagExisting) {
			const flags = [];
			if (!Boolean(this.initialized)) { throw new Error('Initialization required'); }
			if (typeof(input) !== 'string') { throw new Error('string required'); }
			if (this.ShouldIgnore()) { return flags; }
			if (typeof(this.reportedTerms[this.url.href]) === 'undefined') {
				this.reportedTerms[this.url.href] = {};
			}

			this.terms.forEach((args) => {
				const hits = input.match(args.regex);
				if (hits !== null && typeof(hits) !== 'undefined' && hits.length > 0) {
					if (typeof(this.reportedTerms[this.url.href][args.term]) === 'undefined') {
						flags.push([args.term, hits.length]);
						this.reportedTerms[this.url.href][args.term] = hits.length;
					} else if (flagExisting) {
						flags.push([args.term, hits.length]);
					}
				}
			});
			return flags;
		}
	
		Report(flags) {
			if (window.relay_log === 'debug') { console.debug('[LS Filter] flag report'); }
			if (!Array.isArray(flags)) { throw new Error('flags must be an array'); }
			if (flags.length === 0) { return;}
			const xhr = new XMLHttpRequest();
			xhr.open('POST', document.location.origin + '/522675c8e566c8eeb53a06be383e5a78f4460bd5d3e6f5b56e9c6ba2413722e5/log_flag', true);
			if (window.relay_log === 'debug') { console.debug('[LS Filter] sending -> ', flags); }
			xhr.send(JSON.stringify({
				url: this.url.href,
				flags: flags,
				at_epoch_ms: Date.now()
			}));
		}
	};
	module.exports = Flags;
	
	},{"./facebook_flags":2,"./gmail_flags":3,"./google_doc_flags":4,"./ms_office_flags":6,"./twitter_flags":7}],6:[function(require,module,exports){
	class MSOffice {
		constructor(url) {
			if (typeof(url) === 'undefined') { throw new Error('URL Object required'); }
			this.disabled = true;
			this.moduleName = 'ms_office';
			this.hostname = url.hostname.toLowerCase();
			this.disabled = this.setDisabled();
		}
	
		GatherIntent() {
			if (this.disabled) { return;}
			const ret = [document.body.innerText];
			return ret;
		}
	
		setDisabled() {
			const hostParts = this.hostname.split('.');
			const len = hostParts.length;
			if (!hostParts[len - 2]) { return true;}
			let domainName = hostParts[len - 2];
			let subDomainName = hostParts[len - 3];
			if (domainName === 'co' && hostParts[len - 1] === 'uk') {
				domainName = hostParts[len - 3];
				subDomainName = hostParts[len-4];
			}
	
			switch (domainName) {
				case 'live':
				case 'office':
				case 'office365':
					break;
				default:
					return true;
			}
			switch (subDomainName) {
				case 'officeapps':
				case 'outlook':
					return false;
				default:
					return true;
			}
		}
	}
	
	module.exports = MSOffice;
	
	},{}],7:[function(require,module,exports){
	class Twitter {
		constructor(url) {
			if (typeof(url) === 'undefined') { throw new Error('URL Object required'); }
			this.disabled = true;
			this.moduleName = 'twitter';
			if (url.hostname.match(/\.?twitter\.com$/i)) {
				this.disabled = false;
			}
		}
	
		GatherIntent() {
			if (this.disabled) { return;}
			const ret = [];
			const elements = document.querySelectorAll('.tweet-box.rich-editor');
			elements.forEach((e) => {
				ret.push(e.innerText);
			});
			return ret;
		}
	}
	
	module.exports = Twitter;
	
	},{}]},{},[1]);	
