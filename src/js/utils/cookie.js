/*
	Обработка cookies
	NetPoint, 2019
*/
let cookie = {
	set: (data, isSession = true) => {
		document.cookie =
			data +
			'; path=/; domain=' +
			document.domain +
			(isSession? '' : ';max-age=' + (180 * 86400));
	},

	get: data => {
		let cookie = ' ' + document.cookie;
		let search = ' ' + data + '=';
		let setStr = null;
		let offset = 0;
		let end = 0;

		if (cookie.length > 0) {
			offset = cookie.indexOf(search);

			if (offset !== -1) {
				offset += search.length;
				end = cookie.indexOf(';', offset);

				if (end === -1)
					end = cookie.length;

				setStr = cookie.substring(offset, end);
			}
		}

		return(setStr);
	},

	clear: data => {
		let olddate = new Date('2018-01-01 12:00');
		olddate.setTime(olddate.getTime());
		document.cookie = data + '=; expires=' + olddate.toGMTString() + '; path=/; domain=' + document.domain;
	}

};

export default cookie;
