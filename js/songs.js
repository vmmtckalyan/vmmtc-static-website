/* ==========================================================================
   VMMTC — Youth Retreat 2024 song lyrics + picker
   ========================================================================== */
(function () {
	'use strict';

	var SONGS = [
		{
			id: 'song1',
			title: '1. Pehela Pyaar',
			lyrics: `Tuhi hai mera pehela pyaar
Tujhi ko chaahun main har ek baar
Gaaon yahan Tu sunle aasman paar
Tuhi hai mera pehela pyaar
Yeshu Tu mera pehela pyaar - (2)

Tujhi ko mile meri Taareefein baari baari
Koi na tulna mein kareeb, Jahaan mein saare
Koi na tulna mein kareeb

Tere hi khoon se jude Naate hai mere saare
Tu hi hai dost, mera yaar
Mere liye hain dedi jaan

Chahiye thoda sa junoon, Tera Jisse rahun main marte zinda
Dhundli lage mujhe ab yeh duniya
Jo na utarta, Tu hai woh nasha
Jo na utarta, Tu hai woh nasha`
		},
		{
			id: 'song2',
			title: '2) Anand Ki Bharpuri',
			lyrics: `Yeh jeevan hai Tera Prabhuji
Tu hi raj kare, ho Teri marzi - (2)
Sang Tere, hum gaate jaayein
Aaye museebat, muskuraayein - (2)
Tere bhavan mein anand ki bharpuri hai
Yeshu Tu sang toh jeevan mein santushti hai
Tere bhavan mein anand ki bharpuri hai
Yeshu Tu sang to jeevan mein santushti hai
Kroos par sab hui samapti
Haara shaitan, mili paapon se mukti - (2)
Teri maut se mili hai azaadi
Rok sake na humein ab koi shakti - (2)
Tere bhavan mein anand ki bharpuri hai
Yeshu Tu sang toh jeevan mein santushti hai
Tere bhavan mein anand ki bharpuri hai Yeshu Tu sang to jeevan mein santushti hai
Bharpuri bharpuri, anand ki bharpuri Santushti santushti, Yeshu mein santushti - (2)
Mera pyaala umad umadte bhare Mera jeevan Yeshu, Tu khushi se bhare
Tere bhavan mein anand ki bharpuri hai Yeshu Tu sang toh jeevan mein santhushti hai Tere bhavan mein anand ki bharpuri hai Yeshu Tu sang toh jeevan mein santhushti hai
Tere bhavan mein anand ki bharpuri hai
Yeshu Tu sang toh jeevan mein santhushti hai
Tere bhavan mein anand ki bharpuri hai
Yeshu Tu sang toh - (3) Jeevan mein santhushti hai`
		},
		{
			id: 'song3',
			title: '3) Kaun hai, kaun hai',
			lyrics: `Kaun hai, kaun hai
Rajaon ka Raaja
Kaun hai, kaun hai
Duniya ka baadshah - (2)

Yeshu hai uska Naam - (2)
Toh karo jai jai kaar - (2)

Paani pe chalta hai
Bheed ko khilaata hai - (2)
Shaitaan bhi darta hai Yeshu ke Naam se - (2)

Krus ko uthaya hai
Maut ko haraya hai - (2)
Anugraha se uske
Humne uddhaar paaya hai - (2)`
		},
		{
			id: 'song4',
			title: '4) Dil Mein, Jaa Mein',
			lyrics: `Tum dil mein aise bas gaye
Zindagi bhar ke liyeh Raja baan gaye
Jeevan me aisa kaam kar gaye
Paap mere shraap mere chalte ban gaye - (2)
Dil mein jaa mein
Hoto pe aankhon mein tu hai
Dil mein jaa mein
Hoto pe aankhon mein tu hai - (2)
Darr darr ke mein jo jee raha tha
Darr se mujhko Yeshu ne kheech nikala Zanjeero mein jo jakhda hua tha
Tood kar unko azad hai kiya - (2)
Tu hi hai, Tu hi hai
Tu hi hai, Raja tu hi hai - (2) Tu hi hai, Tu hi hai
Tu hi hai, Yeshu tu hi hai - (2)`
		},
		{
			id: 'song5',
			title: '5) Naachoonga Gaoonga',
			lyrics: `Nachoonga gaoonga paglon ke samaan
Hosh mein na rahoonga mera Raja hai mahaan - (2)
Nachoonga, khoke apna swaabhimaan log kahe ise moorkhta Gaoonga, mera Raja hai mahaan
Nachoonga gaoonga paglon ke samaan
Hosh mein na rahoonga mera Raja hai mahaan - (2)
Nachoonga, khoke apna swabhimaan log kahe ise moorkhta Gaoonga, mera Raja hai mahaan - (2)
Na na na na na na, hey - (8)
Nachoonga, khoke apna swabhimaan log kahe ise moorkhta Gaoonga, mera Raja hia mahaan - (2)
Nachoonga, paglo ke samaan Gaoonga, mera Rajaa hai mahaan - (8)`
		},
		{
			id: 'song6',
			title: '6) Paavangal Pokave',
			lyrics: `Paavangal pokave, saabangal neekave Boologam vandaar aiya
Manithanai meetkave, paralogam thirakave Siluvaiyai sumanthaar aiya
Kannerai thudaithar aiya Santhosham thandar aiya
Enthan Yesuve.....
Thangathai ketkavillai, vairathai ketkavillai Ullathai kettar aiya
Aasthiyai ketkavillai, anthasthai ketkavillai Ullathai kettar aiya
Naan theadi pokavilla Ennai thaedi vanthaar aiya

Enthan Yesuve..
Thai unnai maranthalum, thanthai unnai maranthalum Avar unnai marakka maattar
Nanbar unnai maranthalum, uttar unnai maranthalum Avar unnai marakka maattar
Karam pidithu nadathiduvaar Kanmalai mael niruthiduvaar
Enthan Yesuve...`
		},
		{
			id: 'song7',
			title: '7) Jai Bolo',
			lyrics: `Jai Bolo Jai Bolo
Yeshu Masiha Ki Jai Bolo -2
Andhon Ko Aankh Diya, Yeshu Ne Langdo Ko Chalaa Diya, Yeshu Ne
Kodee Ko Changa Kiya, Yeshu Ne Lazar Ko Zinda Kiya, Yeshu Ne
Hum Sab Ko Bacha Liya, Yeshu Ne Paapo Se Chuda Liya, Yeshu Ne
Jai Bolo, Jai Bolo
Jai Bolo, Jai Bolo
Yeshu Masiha Ki Jai Bolo`
		},
		{
			id: 'song8',
			title: '8) Tu Hi Rab Hai',
			lyrics: `Tu Hi Rab Hai
Tu Hi Sab Hai
Tu Hi Kal Tha
Tu Hi Ab Hai
Tu Hi Sabse Alag Hai – (2)
Karte Hai Tujhko Hum Salaam
Sabse Ucha Hai Jo Naam
Usko Karte Hum Pranam
Sabse Ucha Hai Jo Naam
Yeshu Naam, Yeshu Naam
Yeshu Naam, Yeshu Naam, Yeshu Naam...
Dekhe Hai Humne, Lakho Aise Par Tere Jaisa Koye Nahi Re
Aise Waise Toh Hai Kitne
Par Deewane Hum Toh Hai Tere Tu Hi Hai Asha, Tu Hi Bharosa Tu Hi Mera, Bas Ek Khuda
Aaye Hai Hum, Iss Shehar Me Yeshu Ka naam Ucha Uthne Hum Karenge Balle Balle
Aur Bolenge Awaz Uthake
Tu Hi Hai Asha, Tu Hi Bharosa Tu Hi Hai Mera, Bas Ek Khuda
Bolo Naam, Yeshu Naam, Yeshu Naam Bolo naam, Yeshu Naam, Yeshu Naam - (3)`
		},
		{
			id: 'song9',
			title: '9) Aseervatham',
			lyrics: `Nichaiyamaagavae Mudivu Undu
Nambikkai Veen Pogadhu - (2)
Unnai Aasirvadhikavae
Aasirvadhithiduvaen
Unnai Peruga Pannavae Peruga Panniduvaen - (2)
1. Varaindhaen Unnai Naan Ulangkaigalil
Thaanginen Unnai Naan Thaayin Karuvil - (2)
Kaathiduven Unnai Kannin Mani Pol
Jeeviya Kaalamellam - (2)
Undhan Jeeviya Kaalamellam
2. Bhayapadadhe Endhan Chella Pillaye
Ini Endrum Theengai Kanbadhillaye - (2)
Unnodu Irundhu Naan Seiyum Kaariyam Bhayangaramaai Irukum - (2)
Avaigal Aacharyamaai Irukum`
		},
		{
			id: 'song10',
			title: '10) Desh',
			lyrics: `Yeh nafrat ki diwaar Kyun ek duje se juda Bhai-bhai ke khilaaf Kyun rota desh mera
Mere watan ki, Tu hi raza hai
Tere bharose, Hindusitaan hai - (2)
Is desh ka Khuda Tu hai Bachchon ka Pita Tu hai Jaati-paati dharm se bada
Ab dur nahi kisi se
Paas hai Tu har ik dil ke Saath Tu kabhi na chhodega
Hum sab ek parivaar,
Yahi hai hamari pehchan Bhinntaaon mein ekta Bharat hamara hai mahaan
Reham-o-karam se, badhte chale hain Teri wafa se, girke uthe hai - (2)

Is desh ka Khuda Tu hai Bachchon ka Pita Tu hai Jaati-paati dharm se bada Ab dur nahi kisi se
Paas hai Tu har ik dil ke Saath Tu kabhi na chhodega
Mere watan – uth jaag ja Tera samay ab aa gaya Mere watan – hum ek hain Tu pyaar ka – jhanda utha
Is desh ki aawaaz hai hum Aazadi ka saaz hain hum Milkar ek mann hokar gaaye Gulami se rehaa hue ab
Ekta ka atoot bandhan
Pyaar se badal dein ye jahaan
Pyaar se badal dein ye jahaan Pyaar se badal dein ye desh apna`
		},
		{
			id: 'song11',
			title: '11) Papa',
			lyrics: `Tujhe Chhod Main Chal Pada Dhundhne Ghar Har Jagah Khoj Me Main Kho Gaya Khud Ko Pahchaan Na Saka
Rehmat Ke Dariya Me Dubaya Mujhe Usse Jariya Banakar Chalaya Mujhe - (2)
Papa Papa
Beta Main Tera - (2)
Tujhe Chhod Main Jaun Kahan Tu Hi To Ghar Hai Mera
Na Tha Mujhe Ye Pata
Beta Main Tha Hi Tera
Nazar Teri Kabhi Na Hati
Mahfuz Hun Teri Parchhayi Me - (2)
Teri Aankhon Ki Putli Hun Papa Main Aankhon Ki Putli Hun Papa Teri Aankhon Ki Putli Hun Papa Teri Aankhon Ki Putli Hun Papa
Paraya Na Hun Main
Thukraya Na Tune
Sharmindgi Se Nikala Hai Tune - (4)
Gale Lagakar Chuma Mujhe
Mera Lata Hatakar Labada Diya – (2)`
		},
		{
			id: 'song12',
			title: '12) Sarvgnani',
			lyrics: `En Iyalaamaiyil Neer Seyal Paduveer
Um Karam Ennai Vilagaathirukkum - (2)
Malaigalai Peyarpeer Endraal
En Thadaigal Umakku Emmaathiram Marithorai Ezhaseitheer Endraal
En Noigal Umakku Emmaathiram
Gregikka Mudiyaa Kaariyam Seiveer Sarva Nyaaniye Ummai Aaraadhipen - (2)
Verum Kolum Kaiyum Iru Parivaaram Aagum Ummaal Andri Ithu Yaaraal Koodum - (2)
Aagaayathu Patchigalai Boshipeer Endraal Ennaiyum Boshippathu Nichayame
Kaattu Pushpangalai Uduthuvadhu Neer Endraal Ennai Kuraivindri Nadathuvathum Nichayame
Gregikka Mudiyaa Kaariyam Seiveer Sarva Nyaaniye Ummai Aaraadhipen - (2)
En Devan Ennakai Yethaagilum Seithiduvaar Endraagilum Ennai Marandhathu Undaa - (8)
Gregikka Mudiyaa Kaariyam Seiveer Sarva Nyaaniye Ummai Aaraadhipen - (2)`
		},
		{
			id: 'song13',
			title: '13) Jai Jai Naam',
			lyrics: `Jai Jai Naam Yeshu Naam Gaoon main subhoshaam - (4)
Balheen ka sahaara, Paapiyon ka dost hai Tu Yeshu Tu hai kitna pyaara Shabd na kaise bataoon - (2)
Jai Jai Naam Yeshu Naam Gaoon main subhoshaam - (4)
Tujh mein bana rahoon toh Amrut phal laoon main Gaoon teri jai sadaa to,
Tujh sa ban jaoon main - (2)
Jai Jai Naam Yeshu Naam Gaoon main subhoshaam - (4)
Tu hi hai jo mujhko bulaata Deta hai jeevan jal
Teri shakti paaoon sada aur Yojanaaye safal ho jaaye - (2)
Jai Jai Naam Yeshu Naam Gaoon main subhoshaam - (4)`
		},
		{
			id: 'song14',
			title: '14) Aasha Meri :',
			lyrics: `Hum mein woh doori, thi kitni gehri Kitna bada tha, woh fasla
Mayoos hokar, swarg ki oor dhekha Nirasha mein tera naam liya Andhkaar hataakar, teri mohabbat Se mera dil tune bhardhiya
Poora hua sab, likha gaya anth, Yeshu Masih, tu hai Aasha Meri
Kisne tha socha, ki aisi daya
Milegi humko bharpoori se
Yougon ka raja, Mahima ko chodkar Apnaya mere sharm aur gunaah Kroos se maine payi hai maafi
Main ho gaya uss raja ka
Sundar masiha, ab mein hun tera Yeshu Masih, tu hai Aasha Meri
Hallelujah, prabhu teri stuti ho Hallelujah, tune haraya mruthyu ko Tune todi har zanjeer,
Tere naam mein rihai
Yeshu Masih, tu hai Aasha Meri - (2)
Aayi woh subah, wada poora hua Bejaan shareer ne, fir saansein li Khamoshi mein se, tune pukara, Kabr teri jeet kahan
Aayi woh subah, wada poora hua Bejaan shareer ne, fir saansein li Khamoshi mein se, tune pukara, Kabr teri jeet kahan
Yeshua, teri jai ho sada
Hallelujah, prabhu teri stuti ho Hallelujah, tune haraya mruthyu ko Tune todi har zanjeer,
Tere naam mein rihai
Yeshu Masih, tu hai Aasha Meri
Hallelujah, prabhu teri stuti ho Hallelujah, tune haraya mruthyu ko Tune todi har zanjeer,
Tere naam mein rihai
Yeshua, tu hai Aasha Meri Yeshu Masih, tu hai Aasha Meri Yeshu Masih, tu hai Aasha Meri`
		},
		{
			id: 'song15',
			title: '15) Naan Emathiram',
			lyrics: `Idhuvarai Ennai Neer Nadathiyadharku
Naan Emmathiram En Vaazhkai Emmathiram Idhuvarai Ennai Neer Sumandhadharku
Naan Emmathiram En Kudumbam Emmathiram - (2)
Naan Kanda Menmaigal Ellam Um Karathin Eevu
Naan Paarkum Uyarvugal Ellam Neer Eendhum Thayavu - (2)
1. Yen Ennai Therindhu Kondeer Theriyavillai Yen Ennai Uyarthineer Puriyavillai - (2)
Aadugal Pinne Alaindhu Thirindhen - (2)
Ariyanai Yeatri Azhagu Paartheer - (2)
2. En Thittam Aasaigal Siriyadhena
Um Thittam Kanda Udan Purindhukonden - (2)
Tharkala Thevaikkai Ummai Nokki Paarthen - (2)
Thalaimurai Thaangum Thittam Thandheer
Thalaimurai Thaangidum Thittam Thandheer`
		},
		{
			id: 'song16',
			title: '16) Haath Uthakar Gayunga',
			lyrics: `Yeshu masih bharosa mera
Tu hi sahara hai mera
Mushkil samay mein Tu hi dilasa Saath rahega Tu sada
Karuna bhalayi Teri
Sada rahegi mujh par
Teri vishwas yogyata Dekhunga main umra bhar
Main haath uthakar gaunga Yeshu Tera naam rahe uncha Main haath uthakar gaunga Yeshu Tera naam rahe uncha
Maut se hai bachaya Tu ne Jeevan naya hai de diya Naam le kar pukara mujhe Mahima se mujhko bhar diya
Karuna bhalayi Teri
Sada rahegi mujh par
Teri vishwas yogyata Dekhunga main umra bhar
Main haath uthakar gaunga Yeshu Tera naam rahe uncha Main haath uthakar gaunga

Yeshu Tera naam rahe uncha
Aadar aur mahima ho Teri Tu hi hamara khuda
Puri ho Teri hi marzi
Aaye Tera raj yaha
Aadar aur mahima ho Teri Tu hi hamara khuda
Puri ho Teri hi marzi
Tera hi raj ho yahaan
Hum haath uthakar gayenge Yeshu Tera naam rahe uncha Hum haath uthakar gayenge Yeshu Tera naam rahe uncha
Karuna bhalayi Teri
Sada rahegi mujhpar
Teri vishwas yogyata Dekhunga main umra bhar
Main haath uthakar gaunga Yeshu Tera naam rahe uncha Main haath uthakar gaunga Yeshu Tera naam rahe uncha
Yeshu Tera naam rahe uncha Yeshu Tera naam rahe uncha`
		},
		{
			id: 'song17',
			title: '17) Tere Paas Aata Hu',
			lyrics: `Tere paas aata hoon Yeshu tere paas Tere paas aata hoon Yeshu tere paas
Har pal meri har saans Teri stuti karti rahe Har din meri har baat Teri mahima gaati rahe
Tere paas aata hoon Yeshu tere paas Tere paas aata hoon Yeshu tere paas
Har pal meri har saans Teri stuti karti rahe Har din meri har baat Teri mahima gaati rahe
Yeshua aa..... Yeshua aa..... Yeshua aa..... Yeshua aa.....`
		},
		{
			id: 'song18',
			title: '18) Tu Raj Kare',
			lyrics: `Tune kiya khaali apne aap ko
Chhodi sari mahima
Hokar Khuda kiya shunya apne aap ko Bana manushya samaan
Ban gaya daas samaan
Mrityu sahi, haan mrityu kroos ki Aur hua sabse mahaan
Tu raaj kare
Tu raaj kare
Tu raaj kare
Saari duniya pe
Ghutne tike, Saare ghutne tike Ghutne tike, Yeshu Naam ke liye
Aasmaanon mein hai sthir Tera sinhaasan Parakrami Khuda
Mahima se ab faile Tera shaasan
Kadmon pe saara jahaan
Sajde mein har insaan
Vadh jo hua, nirdosh memna Tera hai saaradhikaar
Kal, aaj aur sarvada
Yeshu Tu hi hai Khuda - (2)
Tu raaj kare
Tu raaj kare
Tu raaj kare
Saari duniya pe
Ghutne tike, Saare ghutne tike Ghutne tike, Yeshu Naam ke liye - (2)`
		},
		{
			id: 'song19',
			title: '19) Sang Tere',
			lyrics: `Yeh kaisa pyar hai Tera Ki aisa tu ne hai kiya Tera praan de diya Taaki jeeyu main sada
Shaitaan ko haraa diya
Paapon ko jad se ukhaad diya Mujhe gher liya naye geet se Ab main jee utha nayi shakti se
Peeche nahi mudunga Haar nahi maanoonga Badhta rahunga
Sang tere
Meri ore se ladega Kabhi haath na chodega Darr hatakar bal diya Jeet tune mujhe diya
Shaitaan ko haraa diya
Paapon ko jad se ukhaad diya Mujhe gher liya naye geet se Ab main jee utha nayi shakti se
Peeche nahi mudunga Haar nahi maanoonga Badhta rahunga
Sang tere - (2)
Kehna hi kya hai
Khuda mere paksh mein Toh kaun ab mera Virodhi thehrega - (2)

Meri ore se ladega Kabhi haath na chodega Darr hatakar bal diya Jeet tune mujhe diya
Kya de sakta hoon
Main kya la sakta hoon Kehta tujhe bas shukriya Shukriya tera shukriya tera
Peeche nahi mudunga Haar nahi maanoonga Badtha rahunga
Sang tere
Peeche nahi mudunga Haar nahi maanoonga Badtha rahunga
Sang tere`
		}
	];

	document.addEventListener('DOMContentLoaded', function () {
		var listEl = document.getElementById('songList');
		var lyricsNum = document.getElementById('lyricsNum');
		var lyricsTitle = document.getElementById('lyricsTitle');
		var lyricsText = document.getElementById('lyricsText');
		var pagerLabel = document.getElementById('songPagerLabel');
		var prevBtn = document.getElementById('songPrev');
		var nextBtn = document.getElementById('songNext');
		var selectBtn = document.getElementById('songSelect');
		var navPanel = document.getElementById('songNav');

		if (!listEl || !lyricsTitle || !lyricsText) return;

		var selectedIndex = 0;

		function i18nTa() {
			return !!(window.I18N && window.I18N.lang() === 'ta');
		}

		function pagerText(num) {
			if (i18nTa()) return window.I18N.get('song_pager', { n: num, total: SONGS.length });
			return 'Song ' + num + ' of ' + SONGS.length;
		}

		function selectText(num) {
			if (i18nTa()) return window.I18N.get('song_select_n', { n: num });
			return 'Song ' + num;
		}

		function selectSong(index) {
			if (index < 0 || index >= SONGS.length) return;
			selectedIndex = index;
			var song = SONGS[selectedIndex];
			var num = selectedIndex + 1;

			if (lyricsNum) lyricsNum.textContent = String(num);
			lyricsTitle.textContent = song.title;
			lyricsText.textContent = song.lyrics;
			if (pagerLabel) pagerLabel.textContent = pagerText(num);
			if (prevBtn) prevBtn.disabled = selectedIndex === 0;
			if (nextBtn) nextBtn.disabled = selectedIndex === SONGS.length - 1;

			listEl.querySelectorAll('.song-btn').forEach(function (btn) {
				btn.classList.toggle('active', btn.getAttribute('data-id') === song.id);
			});

			if (navPanel) navPanel.classList.remove('open-mobile');
			if (selectBtn) {
				selectBtn.setAttribute('aria-expanded', 'false');
				var label = selectBtn.querySelector('span');
				if (label) label.textContent = selectText(num);
			}

			var panel = document.getElementById('lyricsPanel');
			if (panel && window.innerWidth < 1024) {
				panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}

		// Build the song list
		SONGS.forEach(function (song, i) {
			var li = document.createElement('li');
			var btn = document.createElement('button');
			btn.type = 'button';
			btn.className = 'song-btn';
			btn.setAttribute('data-id', song.id);
			btn.textContent = song.title;
			btn.addEventListener('click', function () {
				selectSong(i);
			});
			li.appendChild(btn);
			listEl.appendChild(li);
		});

		// Wire up pager + mobile select toggle
		if (prevBtn) prevBtn.addEventListener('click', function () { selectSong(selectedIndex - 1); });
		if (nextBtn) nextBtn.addEventListener('click', function () { selectSong(selectedIndex + 1); });
		if (selectBtn) {
			selectBtn.setAttribute('aria-expanded', 'false');
			selectBtn.addEventListener('click', function () {
				var navPanel = document.getElementById('songNav');
				if (selectBtn) selectBtn.setAttribute('aria-expanded', navPanel && navPanel.classList.contains('open-mobile') ? 'false' : 'true');
				if (navPanel) navPanel.classList.toggle('open-mobile');
			});
		}

		document.addEventListener('i18n:change', function () {
			selectSong(selectedIndex);
		});

		selectSong(0);
	});
})();