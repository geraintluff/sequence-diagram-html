var fs = require('fs');
var intervals = [2, 3, 4, 5, 6, 9, 12, 20];

function percentage(ratio) {
	return (Math.round(ratio*1000)/10) + '%';
}

var css = [];
for (var i = 0; i < intervals.length; i++) {
	var interval = intervals[i];
	
	for (var pos = 0; pos < interval; pos++) {
		css.push('.col-' + (pos + 1) + '-' + interval + ' {');
		css.push('	margin-left: ' + percentage(pos/interval) + ';');
		css.push('	margin-right: ' + percentage((interval - pos - 1)/interval));
		css.push('}');
		css.push('.left-' + (pos + 1) + '-' + interval + ' {');
		css.push('	margin-left: ' + percentage((pos + 0.5)/interval));
		css.push('}');
		css.push('.right-' + (pos + 1) + '-' + interval + ' {');
		css.push('	margin-right: ' + percentage((interval - pos - 0.5)/interval));
		css.push('}');
	}
}

fs.writeFileSync('sequence-diagram-columns.css', css.join('\n'));