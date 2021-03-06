(function () {

	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// shim layer with setTimeout fallback
	window.requestAnimFrame = (function () {
		return  window.requestAnimationFrame
		|| window.webkitRequestAnimationFrame
		|| window.mozRequestAnimationFrame
		|| window.oRequestAnimationFrame
		|| window.msRequestAnimationFrame
		|| function (callback, element) {
			window.setTimeout(callback, 1000 / 60);
		};
	})();

	var WIDTH = 1000;
	var HEIGHT = 676;

	var Colors = {
		WHITE: "rgb(255, 255, 255)",
		BLACK: "rgb(0, 0, 0)",
		GRAY: "rgb(242, 242, 242)",
		DARK_ORANGE: "rgb(227, 76, 38)",
		LIGHT_ORANGE: "rgb(240, 101, 41)",
		DARK_WHITE: "rgb(235, 235, 235)"
	};

	var canvas = document.createElement("canvas");
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	document.body.appendChild(canvas);
	var ctx = canvas.getContext("2d");

	var lastTick = 0;

	var rayStart = 0;
	var raySpeed = 0.25;

	var loop = function (time) {
		update(time);
		drawBackground();
		drawShield();
		drawText();
		requestAnimFrame(loop, canvas);
	};

	var update = function (time) {
		if (lastTick == 0) {
			lastTick = time;
		}
		var elapsed = (time - lastTick);
		lastTick = time;
		rayStart += ((raySpeed / 1000) * elapsed);
		if (rayStart > 1) {
			rayStart = 0;
		}
	};

	var makeVector = function (angle) {
		return {
			x: Math.sin(angle * 1),
			y: -Math.cos(angle * 1)
		};
	};

	var drawShape = function (color, points) {
		ctx.save();
		ctx.fillStyle = color;
		ctx.beginPath();
		for (var i = 0, j = points.length; i < j; ++i) {
			var p = points[i];
			if (i === 0) {
				ctx.moveTo(p[0], p[1]);
			} else {
				ctx.lineTo(p[0], p[1]);
			}
		}
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	};

	var drawBackground = function () {

		ctx.save();

		// Background
		ctx.fillStyle = Colors.GRAY;
		ctx.fillRect(0, 0, WIDTH, HEIGHT);

		ctx.fillStyle = Colors.WHITE;

		// And now for the rays
		var center = {
			x: WIDTH / 2,
			y: HEIGHT / 2
		};

		var rays = {
			count: 32,
			width: 22,
			length: 900
		};

		var step = ((Math.PI * 2) / rays.count);

		for (var i = 0; i < rays.count; ++i) {

			// Yay math!
			var h = (((i + rayStart) * step) + (step / 2));
			var v = makeVector(h);
			var v1 = makeVector(h - (Math.PI / 2));
			var v2 = makeVector(h + (Math.PI / 2));

			ctx.beginPath();

			// Base left
			ctx.moveTo(
				center.x + (v1.x * (rays.width / 2)),
				center.y + (v1.y * (rays.width / 2))
			);

			// End point
			ctx.lineTo(
				center.x + (v.x * rays.length),
				center.y + (v.y * rays.length)
			);

			// Base right
			ctx.lineTo(
				center.x + (v2.x * (rays.width / 2)),
				center.y + (v2.y * (rays.width / 2))
			);

			ctx.fill();

		}

		ctx.restore();

	};

	var drawShield = function () {

		// Base shield; dark orange
		drawShape(Colors.DARK_ORANGE, [
			[329, 196],
			[669, 196],
			[638, 542],
			[499, 581],
			[360, 542]
		]);

		// Shield highlight; light orange
		drawShape(Colors.LIGHT_ORANGE, [
			[499, 224],
			[637, 224],
			[612, 519],
			[499, 551]
		]);

		// Top left half of shaded 5
		drawShape(Colors.DARK_WHITE, [
			[499, 266],
			[393, 266],
			[404, 395],
			[499, 395],
			[499, 353],
			[444, 353],
			[440, 310],
			[499, 310]
		]);

		// Bottom left half of shaded 5
		drawShape(Colors.DARK_WHITE, [
			[406, 414],
			[412, 483],
			[499, 507],
			[499, 462],
			[452, 450],
			[449, 414]
		]);

		// Top right half of 5
		drawShape(Colors.WHITE, [
			[499, 266],
			[606, 266],
			[602, 310],
			[499, 310]
		]);

		// Bottom right half of 5
		drawShape(Colors.WHITE, [
			[499, 353],
			[598, 353],
			[586, 483],
			[499, 507],
			[499, 462],
			[546, 450],
			[551, 395],
			[499, 395]
		]);

	};

	var drawText = function () {

		ctx.save();

		ctx.fillStyle = Colors.BLACK;

		// "H"
		ctx.fillRect(360, 103, 23, 65);
		ctx.fillRect(402, 103, 23, 65);
		ctx.fillRect(383, 124, 19, 23);

		// "T"
		ctx.fillRect(433, 103, 60, 22);
		ctx.fillRect(452, 103, 22, 65);

		// "M"
		ctx.fillRect(502, 103, 22, 65);
		ctx.fillRect(553, 103, 22, 65);
		drawShape(Colors.BLACK, [
			[524, 103],
			[538, 125],
			[553, 103],
			[553, 136],
			[538, 159],
			[524, 136]
		]);

		// "L"
		ctx.fillRect(585, 103, 22, 65);
		ctx.fillRect(585, 146, 53, 22);

		ctx.restore();

	};

	loop(Date.now());

}());
