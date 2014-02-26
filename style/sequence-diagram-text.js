var sequenceDiagram = (function () {
	var handledCounts = [2, 3, 4, 5, 6, 9, 12, 20];

	function Diagram() {
		this.currentAgents = [];
		this.events = [this.currentAgents];
		this.activeGroups = 0;
	}
	Diagram.prototype = {
		setAgents: function (agents) {
			if (this.events[this.events.length - 1] === this.currentAgents) {
				this.events.pop();
			}
			this.currentAgents = agents;
			this.events.push(agents);
		},
		startGroup: function (who, label) {
			if (this.currentAgents.indexOf(who) === -1) {
				this.currentAgents.push(who);
			}
			this.events.push({group: who, label: label});
			this.activeGroups++;
		},
		stopGroup: function () {
			this.events.push({group: false});
			this.activeGroups--;
		},
		finish: function () {
			while (this.activeGroups > 0) {
				this.stopGroup();
			}
			return this;
		},
		addAction: function (from, to, label) {
			if (this.currentAgents.indexOf(from) === -1) {
				this.currentAgents.push(from);
			}
			if (this.currentAgents.indexOf(to) === -1) {
				this.currentAgents.push(to);
			}
			this.events.push({from: from, to: to, label: label});
		},
		addEvent: function (left, right, label, type) {
			if (this.currentAgents.indexOf(left) === -1) {
				this.currentAgents.push(left);
			}
			if (this.currentAgents.indexOf(right) === -1) {
				this.currentAgents.push(right);
			}
			this.events.push({left: left, right: right, label: label, type: type || 'event'});
		},
		addBar: function (label) {
			this.events.push(label || '');
		},
		toHtml: function () {
			var html = ['<div class="sequence-diagram">']
			var haveHead = false, haveContent = false, inBody = false;
			var agents = [], agentCount = 0;
			var indent = '\t\t';
			var events = this.events.slice(0);
			for (var eventNum = 0; eventNum < events.length; eventNum++) {
				var event = events[eventNum];
				if (Array.isArray(event)) {
					agents = event;
					agentCount = agents.length;
					while (handledCounts.indexOf(agentCount) === -1 && agentCount < handledCounts[handledCounts.length - 1]) {
						agentCount++;
					}
					agentCount = Math.min(agentCount, handledCounts[handledCounts.length - 1]);
					if (inBody) {
						html.push('\t</div>');
					}
					html.push('\t<div class="header">');
					for (var i = 0; i < agentCount; i++) {
						if (agents[i]) {
							html.push(indent + '<div class="entity col-' + (i + 1) + '-' + agentCount + '">' + escapeHtml(agents[i]) + '</div>');
						}
					}
					html.push('\t</div>');
					html.push('\t<div class="body">');
					for (var i = 0; i < agentCount; i++) {
						if (agents[i]) {
							html.push(indent + '<div class="line left-' + (i + 1) + '-' + agentCount + '"></div>');
						}
					}
					html.push('');
					inBody = true;
					haveContent = false;
				} else {
					if (!inBody) {
						html.push('\t<div class="body">');
					}
					inBody = true;
					if (typeof event === 'string') {
						html.push('');
						if (haveContent) {
							html.push(indent + '<hr>');
						}
						if (event) {
							html.push(indent + '<div class="section-title">' + escapeHtml(event) + '</div>');
						}
						html.push('');
					} else if (event.group) {
						var ownerPos = agents.indexOf(event.group) + 1;
						html.push(indent + '<div class="group">');
						indent += '\t';
						html.push(indent + '<div class="lifeline left-' + ownerPos + '-' + agentCount + '">' + escapeHtml(event.label || '') + '</div>');
					} else if (event.group === false) {
						indent = indent.replace(/\t$/, '');
						html.push(indent + '</div>');
					} else if (event.from && event.to) {
						var fromPos = agents.indexOf(event.from) + 1;
						var toPos = agents.indexOf(event.to) + 1;
						if (fromPos < toPos) {
							var alt = event.from + ' --> ' + event.to;
							html.push(indent + '<div class="action left-' + fromPos + '-' + agentCount + ' right-' + toPos + '-' + agentCount + '">'
								+ '<img class="arrow-right" src="' + escapeHtml(lineImages.right) + '" alt="' + escapeHtml(alt) + '">'
								+ escapeHtml(event.label || '')
								+ '</div>');
						} else if (fromPos > toPos) {
							var alt = event.to + ' <-- ' + event.from;
							html.push(indent + '<div class="action left-' + toPos + '-' + agentCount + ' right-' + fromPos + '-' + agentCount + '">'
								+ '<img class="arrow-left" src="' + escapeHtml(lineImages.left) + '" alt="' + escapeHtml(alt) + '">'
								+ escapeHtml(event.label || '')
								+ '</div>');
						} else {
							throw new Error('Self-signals not supported yet');
						}
					} else if (event.left && event.right) {
						var leftPos = agents.indexOf(event.left) + 1;
						var rightPos = agents.indexOf(event.right) + 1;
						if (leftPos > rightPos) {
							var tmp = leftPos;
							leftPos = rightPos, rightPos = tmp;
						}
						if (leftPos === rightPos) {
							html.push(indent + '<div class="' + event.type + ' col-' + leftPos + '-' + agentCount + '">' + escapeHtml(event.label || '') + '</div>');
						} else {
							html.push(indent + '<div class="' + event.type + ' left-' + leftPos + '-' + agentCount + ' right-' + rightPos + '-' + agentCount + '">'
							+ escapeHtml(event.label || '')
							+ '</div>');
						}
					} else if (event.left === null && event.right === null) {
							html.push(indent + '<div class="' + event.type + '">'
							+ escapeHtml(event.label || '')
							+ '</div>');
					} else {
						throw new Error('Unknown event: ' + JSON.stringify(event));
					}
					haveContent = true;
				}
			}
			if (inBody) {
				html.push('\t</div>');
			}
			html.push('</div>');
			return html.join('\n');
		}
	};
	
	function escapeHtml(str) {
		return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}
	
	function strip(str) {
		return str.replace(/^[ \t\r\n]*/, '').replace(/[ \t\r\n]*$/, '');
	}
	
	function splitStr(line, splitChar, stripParts) {
		var parts = [];
		var nextPart = "";
		for (var i = 0; i < line.length; i++) {
			var c = line.charAt(i);
			if (c === '\\') {
				nextPart += c + line.charAt(++i);
			} else if (c === splitChar) {
				parts.push(stripParts ? strip(nextPart) : nextPart);
				nextPart = "";
			} else {
				nextPart += c;
			}
		}
		parts.push(stripParts ? strip(nextPart) : nextPart);
		return parts;
	}
	
	var lineImages = {
		left: 'style/arrow-left.png',
		right: 'style/arrow-right.png'
	};
	
	var api = {
		fromText: function (text) {
			var lines = text.split('\n');
			var diagram = new Diagram();
			var indents = [];
			for (var i = 0; i < lines.length; i++) {
				var stripped = strip(lines[i]);
				var parts = splitStr(stripped, ':', false);
				// Close groups until indent found
				while (stripped && indents.length && lines[i].substring(0, indents[0].length) !== indents[0]) {
					diagram.stopGroup();
					indents.shift();
				}
				if (/^(--+|\/\/)/.test(stripped)) {
					var label = stripped.replace(/^(--+|\/\/)/, '');
					diagram.addBar(label);
				} else if (parts.length === 1) {
					parts[0] = strip(parts[0]);
					if (parts[0]) {
						var names = splitStr(parts[0], ',', true);
						if (names.length > 1) {
							diagram.setAgents(names);
						} else {
							var type = 'event';
							var remainder = strip(names[0]);
							if (/^\(.+\)$/.test(remainder)) {
								type = 'note';
								remainder = remainder.replace(/^\(/, '').replace(/\)$/, '');
							}
							diagram.addEvent(null, null, names[0], type);
						}
					}
				} else {
					var who = strip(parts[0]), whoParts;
					var thisIndent = lines[i].match(/^[ \t]*/)[0];
					var nextIndent = (lines[i + 1] || '').match(/^[ \t]*/)[0];
					var remainder = parts.slice(1).join(':');
					if ((whoParts = who.split(/-+>/)).length > 1) {
						diagram.addAction(strip(whoParts[0]), strip(whoParts[1]), remainder);
					} else if ((whoParts = who.split(/<-+/)).length > 1) {
						diagram.addAction(strip(whoParts[1]), strip(whoParts[0]), remainder);
					} else {
						var type = 'event';
						var remainder = strip(remainder);
						if (/^\(.+\)$/.test(remainder)) {
							type = 'note';
							remainder = remainder.replace(/^\(/, '').replace(/\)$/, '');
						}
						if ((whoParts = who.split(/--+/)).length > 1) {
							diagram.addEvent(strip(whoParts[0]), strip(whoParts[1]), remainder, type);
						} else if (nextIndent.substring(0, thisIndent.length) === thisIndent && nextIndent !== thisIndent) {
							diagram.startGroup(who, remainder);
							indents.unshift(nextIndent);
						} else {
							diagram.addEvent(who, who, remainder, type);
						}
					}
				}
			}
			diagram.finish();
			return diagram;
		},
		textToHtml: function (text) {
			var diagram = this.fromText(text);
			return diagram.toHtml();
		},
		setLines: function (leftImg, rightImg) {
			lineImages.left = leftImg;
			lineImages.right = rightImg;
		}
	};
	
	return api;
})();