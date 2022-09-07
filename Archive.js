var
	// change this value to save diffrent tweets to a files
	tweets_per_files = 500,
	file_index = 0,
	tweets = [],
	total = 0,
	empty = 0,
	prevlen = 0;



var savefile = (data, filename = "text.txt", type = "text/plain") => {
	var url = URL.createObjectURL(new Blob([data], {
		type
	})),
		a = Object.assign(document.createElement("a"), {
			href: url,
			download: filename
		});
	document.body.appendChild(a);
	a.click();
	setTimeout(() => {

		console.log(`==== FILE (${filename}) SAVED ====`)
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	}, 0);
}


var loadtweets = (len = tweets_per_files, waitms = 1500) => {


	let filename = Object.fromEntries(new URLSearchParams(window.location.search)).q;

	var tdivs = [...document.querySelectorAll('article')];


	tdivs.forEach((t, i) => {
		try {

			let tweetId = t.querySelectorAll('a')[3].href.split('status/')[1];

			if (!tweets.find(x => x.tweetId == tweetId)) tweets.push({
				tweetId: t.querySelectorAll('a')[3].href.split('status/')[1],
				handle: t.querySelectorAll('a')[2].innerText,
				name: t.querySelectorAll('a')[1].innerText,
				text: t.querySelector('[lang]').innerText,
				time: t.querySelectorAll('[datetime]')[0].getAttribute('datetime')
			});

			t.remove();
		} catch (e) {
			//	console.log(e)
		}
	})

	console.log('total', total + tweets.length);




	if (tweets.length >= len || empty > 4) {
		total += tweets.length;
		let savetweets = Array.from(tweets);
		savefile(JSON.stringify(savetweets), `${filename}.${file_index++}.json`, 'application/json');


	}



	if (empty > 4) {
		console.log("===== DONE =====", total);

		return;
	}

	if (prevlen == tweets.length) empty += 1; else empty = 0;
	prevlen = tweets.length;

	setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);

	setTimeout(() => loadtweets(len, waitms), waitms);


}

loadtweets();
