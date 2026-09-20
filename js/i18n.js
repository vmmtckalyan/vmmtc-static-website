/* ==========================================================================
   VMMTC — English ⇄ Tamil language switcher
   Google's official website-translate widget is preferred (key-free).
   The hand-maintained T dictionary below is kept as an offline / blocked
   fallback. State persists via localStorage ("vmmtc.lang"); Google's widget
   sets its own "googtrans" cookie, which we reconcile on every boot.
   ========================================================================== */
(function () {
	'use strict';

	var LANG_KEY = 'vmmtc.lang';
	var LANGS = ['en', 'ta'];

	/* ---- Google website-translate widget ---- */
	var GT_CALLBACK = 'GTranslateElementInit';
	var GT_URL = 'https://translate.google.com/translate_a/element.js?cb=' + GT_CALLBACK;
	var GT_TARGET = 'ta';
	var WIDGET_TIMEOUT = 3500;
	var TRANSLATE_TIMEOUT = 10000;
	var widgetState = 'idle'; // 'idle' | 'loading' | 'ready' | 'failed'
	var widgetBooted = false;
	var bootReconciled = false;

	/* ------------------------------------------------------------------
	   Dictionary — key = exact (trimmed) English text from the site.
	   ------------------------------------------------------------------ */
	var T = {
		/* ---- shared chrome: brand / nav / footer ---- */
		'Vernon Memorial': 'வெர்னான் மெமோரியல்',
		'Methodist Tamil Church': 'மெதடிஸ்ட் தமிழ்த் திருச்சபை',
		'Methodist Tamil Church · Kalyan': 'மெதடிஸ்ட் தமிழ்த் திருச்சபை · கல்யாண்',
		'Home': 'முகப்பு',
		'Who We Are': 'எங்களைப் பற்றி',
		'Ministries': 'ஊழியங்கள்',
		'All Ministries': 'அனைத்து ஊழியங்களும்',
		'WCSS (Women)': 'டபிள்யூ.சி.எஸ்.எஸ் (மகளிர்)',
		'Methodist Men': 'மெதடிஸ்ட் ஆண்கள்',
		'MYF (Youth)': 'எம்.ஒய்.எஃப் (இளைஞர்)',
		'Sunday School': 'ஞாயிறு பள்ளி',
		'Events': 'நிகழ்வுகள்',
		'Gallery': 'புகைப்படக் காட்சி',
		'Contact': 'தொடர்பு',
		'Login': 'உள்நுழைவு',
		'Contact Us': 'எங்களைத் தொடர்பு கொள்ளுங்கள்',
		'Quick Links': 'விரைவு இணைப்புகள்',
		'WCSS — Women': 'டபிள்யூ.சி.எஸ்.எஸ் — மகளிர்',
		'MYF — Youth': 'எம்.ஒய்.எஃப் — இளைஞர்',
		'Souvenir': 'நினைவு மலர்',
		'Youth Retreat 2024': 'இளைஞர் மாநாடு 2024',
		'Retreat Songs': 'மாநாட்டுப் பாடல்கள்',
		'Visit Us': 'எங்களை வந்து பாருங்கள்',
		'Opp. SBI Bank, Kalyan–Murbad Road': 'எஸ்.பி.ஐ. வங்கிக்கு எதிரே, கல்யாண்–முர்பாத் சாலை',
		'Kalyan West, Maharashtra': 'கல்யாண் மேற்கு, மகாராஷ்டிரம்',
		'Sunday Service': 'ஞாயிறு ஆராதனை',
		'7:30 AM – 9:30 AM': 'காலை 7:30 – 9:30',
		'Get In Touch': 'தொடர்பு கொள்ளுங்கள்',
		'Get in Touch': 'தொடர்பு கொள்ளுங்கள்',
		'Vernon Memorial Methodist Tamil Church, Kalyan. Love God. Love People. Influence the World.': 'வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண். தேவனிடம் அன்புகூருங்கள். மக்களிடம் அன்புகூருங்கள். உலகத்தில் தாக்கத்தை ஏற்படுத்துங்கள்.',
		'Name': 'பெயர்',
		'Phone / Email': 'தொலைபேசி / மின்னஞ்சல்',
		'Leave us a message': 'எங்களுக்கு ஒரு செய்தியை அனுப்புங்கள்',
		'Send Message': 'செய்தி அனுப்புங்கள்',
		' Vernon Memorial Methodist Tamil Church, Kalyan. Love God. Love People. Influence the World.': ' வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண். தேவனிடம் அன்புகூருங்கள். மக்களிடம் அன்புகூருங்கள். உலகத்தில் தாக்கத்தை ஏற்படுத்துங்கள்.',
		'For over 60 years, a people committed to the study, practice and spread of the knowledge of God’s Word by the power of the Holy Spirit.': 'அறுபது ஆண்டுகளுக்கும் மேலாக, பரிசுத்த ஆவியின் வல்லமையினால் தேவனுடைய வார்த்தையின் அறிவைக் கற்றல், பயிற்சி செய்தல், பரப்புதல் ஆகியவற்றில் அர்ப்பணிக்கப்பட்ட மக்கள்.',
		'Your browser does not support the video tag.': 'உங்கள் உலாவி வீடியோ காட்சியை ஆதரிப்பதில்லை.',

		/* ---- home: hero ---- */
		'Est. 1965 · Kalyan, India': 'தொடக்கம் 1965 · கல்யாண், இந்தியா',
		'We Love God.': 'நாங்கள் தேவனிடம் அன்புகூருகிறோம்.',
		'We Love His People.': 'நாங்கள் அவருடைய மக்களிடம் அன்புகூருகிறோம்.',
		'“I am as a wonder unto many; but thou art my strong refuge.”': '“நான் அநேகருக்கு அதிசயமாக இருக்கிறேன்; நீரோ என் பலத்த அடைக்கலம்.”',
		'Psalm 71:7': 'சங்கீதம் 71:7',
		'Upcoming Events': 'வரவிருக்கும் நிகழ்வுகள்',
		'2024 Theme': '2024 கருத்தரங்கக் கருப்பொருள்',
		'I am a Wonder': 'நான் ஓர் அதிசயம்',
		'Psalm 71:7 — “I am as a wonder unto many; but thou art my strong refuge.”': 'சங்கீதம் 71:7 — “நான் அநேகருக்கு அதிசயமாக இருக்கிறேன்; நீரோ என் பலத்த அடைக்கலம்.”',

		/* ---- home: about / mission / vision ---- */
		'About Our Church': 'எங்கள் திருச்சபையைப் பற்றி',
		'A people growing in the knowledge of His Word': 'அவருடைய வார்த்தையின் அறிவில் வளரும் மக்கள்',
		'Our Mission': 'எங்கள் நோக்கம்',
		'We are people of God committed to the study, practice and spread of the knowledge of His Word by the power of the Holy Spirit.': 'பரிசுத்த ஆவியின் வல்லமையினால் அவருடைய வார்த்தையின் அறிவைக் கற்றல், பயிற்சி செய்தல், பரப்புதல் ஆகியவற்றில் அர்ப்பணிக்கப்பட்ட தேவனுடைய மக்கள் நாங்கள்.',
		'Our Vision': 'எங்கள் இலக்கு',
		'To develop members into Christ-like maturity and build healthy relations to take care of the needs of the Church and serve the community.': 'உறுப்பினர்களை கிறிஸ்துவைப் போன்ற முதிர்ச்சிக்கு வளர்த்து, திருச்சபையின் தேவைகளைப் பார்த்துக்கொள்ளவும் சமுதாயத்திற்கு ஊழியம் செய்யவும் ஆரோக்கியமான உறவுகளை உருவாக்குதல்.',
		'Part of the Methodist Church in India': 'இந்திய மெதடிஸ்ட் திருச்சபையின் அங்கம்',
		'Mumbai Regional Conference': 'மும்பை மண்டல மாநாடு',
		'Read Our Story': 'எங்கள் வரலாற்றை வாசியுங்கள்',
		'Daily Prayers': 'தினமும் ஜெபம்',
		'Continuous Teaching': 'தொடர் போதனை',
		'Community Helpers': 'சமுதாயத்திற்கு உதவுவோர்',
		'Set of Sermons': 'பிரசங்கத் தொகுப்பு',

		/* ---- home: watch & connect / videos ---- */
		'Watch & Connect': 'காணுங்கள் & இணையுங்கள்',
		'A glimpse of worship and fellowship': 'ஆராதனையும் சகவாசமும் — ஒரு பார்வை',
		'We invite anyone and everyone to attend our Sunday gathering to celebrate God.': 'தேவனை மகிமைப்படுத்தவும் ஆராதிக்கவும் எங்கள் ஞாயிறு ஆராதனையில் அனைவரையும் அன்புடன் அழைக்கிறோம்.',
		'Vernon Memorial — Sunday Service': 'வெர்னான் மெமோரியல் — ஞாயிறு ஆராதனை',
		'Watch': 'பாருங்கள்',
		'Vernon Memorial — Fellowship': 'வெர்னான் மெமோரியல் — சகவாசம்',

		/* ---- home: gallery / happening now / featured ---- */
		'Explore our gallery to get familiar with us.': 'எங்களை நன்கு அறிந்துகொள்ள எங்கள் புகைப்படக் காட்சியைப் பாருங்கள்.',
		'Explore Our Gallery': 'எங்கள் புகைப்படக் காட்சியைக் காண',
		'Happening Now': 'தற்போது நடைபெறுவது',
		'Upcoming & featured events': 'வரவிருக்கும் & சிறப்பு நிகழ்வுகள்',
		'We invite and welcome you to all of our events. Visit us.': 'எங்கள் அனைத்து நிகழ்வுகளுக்கும் உங்களை அன்புடன் அழைக்கிறோம். எங்களை வந்து பாருங்கள்.',
		'Featured': 'சிறப்பு',
		'Limitless (Mark 10:27, Ephesians 3). With God, all things are possible — stop putting limits on what you can do, don’t put God in a box, because He’ll break it!': 'வரம்பற்றது (மாற்கு 10:27, எபேசியர் 3). தேவனோடு அனைத்தும் இயலும் — உங்களால் இயன்றவற்றிற்கு வரம்பு வைப்பதை நிறுத்துங்கள்; தேவனை ஒரு பெட்டிக்குள் அடைக்க வேண்டாம், ஏனெனில் அவர் அதை உடைப்பார்!',
		'Enroll Now': 'இப்போதே பதிவு செய்யுங்கள்',
		'60 Years': '60 ஆண்டுகள்',
		'Souvenir Book': 'நினைவு மலர்',
		'As we celebrate 60 years of unwavering faith, we are excited to present our commemorative Souvenir Book. Join us in marking this milestone.': 'அசையாத விசுவாசத்தின் 60 ஆண்டுகளைக் கொண்டாடும் இந்த நேரத்தில், எங்கள் நினைவு மலரை வெளியிடுவதில் மகிழ்ச்சி அடைகிறோம். இந்த மைல்கல்லை நினைவுகொள்ள எங்களோடு இணையுங்கள்.',
		'Participate': 'பங்கேற்க',

		/* ---- home: pastor ---- */
		'Leading the flock': 'மந்தையை வழிநடத்துதல்',
		'Our Pastor & Guide': 'எங்கள் போதகரும் வழிகாட்டியும்',
		'Our Incumbent & Guide': 'எங்கள் போதகரும் வழிகாட்டியும்',
		'Meet our Reverend': 'எங்கள் போதகர்',
		'Rev. Christopher Raja': 'அருட்பணி. கிறிஸ்டோபர் ராஜா',
		'Fueled by prayer and a zealous love for God, Rev. Christopher Raja is passionate about building the local church and advancing God’s kingdom on earth.': 'ஜெபத்தினாலும் தேவனிடம் ஊக்கமான அன்பினாலும் நிறைந்த அருட்பணி. கிறிஸ்டோபர் ராஜா, உள்ளூர் திருச்சபையைக் கட்டியெழுப்பவும் தேவனுடைய ராஜ்யத்தை பூமியில் முன்னேற்றவும் ஒப்பற்ற ஆர்வம் கொண்டவர்.',

		/* ---- home: weekly programs ---- */
		'Join Us Weekly': 'வாரந்தோறும் எங்களோடு இணையுங்கள்',
		'Weekly programs schedule': 'வாராந்திர நிகழ்ச்சி அட்டவணை',
		'Gather with us through the week for prayer, teaching and worship.': 'ஜெபம், போதனை, ஆராதனைக்காக வாரம் முழுவதும் எங்களோடு ஒன்றுகூடுங்கள்.',
		'Main Service': 'முதன்மை ஆராதனை',
		'Sunday': 'ஞாயிறு',
		'Prayers & Counselling': 'ஜெபமும் ஆலோசனையும்',
		'Tuesday – Friday': 'செவ்வாய் – வெள்ளி',
		'10 AM – 2 PM': 'காலை 10 – மதியம் 2',
		'Light Encounter': 'ஒளி சந்திப்பு',
		'Wednesday': 'புதன்',
		'6 PM – 8 PM': 'மாலை 6 – 8',
		'Dominion Hour': 'ஆட்சி நேரம்',
		'Thursday': 'வியாழன்',
		'9 AM – 12 PM': 'காலை 9 – மதியம் 12',
		'Kids Ministry': 'குழந்தைகள் ஊழியம்',
		'Little Ones': 'சிறியோர்',
		'We love kids! Our pastors are richly educated in the Word of God and teach children from the age of 5–15 about the wonderful Word of God.': 'குழந்தைகளை நாங்கள் மிகவும் நேசிக்கிறோம்! எங்கள் போதகர்கள் தேவனுடைய வார்த்தையில் நன்கு பயின்றவர்கள்; 5 முதல் 15 வயதுடைய குழந்தைகளுக்கு தேவனுடைய அற்புதமான வார்த்தையைக் கற்பிக்கிறோம்.',
		'Ages 5 – 15': 'வயது 5 – 15',
		'Youth Ministry': 'இளைஞர் ஊழியம்',
		'Youth of Integrity': 'ஒழுக்கமுள்ள இளைஞர்கள்',
		'We believe in the next generation because they are the future of the church. They congregate weekly to grow their faith and connect with students their age to help one another.': 'அடுத்த தலைமுறையில் நாங்கள் விசுவாசம் கொள்கிறோம்; ஏனெனில் அவர்களே திருச்சபையின் எதிர்காலம். அவர்கள் வாரந்தோறும் ஒன்றுகூடி தங்கள் விசுவாசத்தை வளர்க்கவும், தங்கள் வயதுடைய மாணவர்களோடு இணைந்து ஒருவருக்கொருவர் உதவிக்கொள்ளவும் செய்கிறார்கள்.',
		'Giving': 'காணிக்கை',
		'Love God. Love People. Influence the World.': 'தேவனிடம் அன்புகூருங்கள். மக்களிடம் அன்புகூருங்கள். உலகைத் தாக்கம் செய்யுங்கள்.',
		'It is a privilege to give back to God what He has graciously given. We commit to being good stewards of your generosity.': 'தேவன் கிருபையோடு தந்ததை அவருக்குத் திரும்பக் கொடுப்பது ஒரு பாக்கியம். உங்கள் ஈகையின் நல்ல பொறுப்பாளர்களாக இருக்க நாங்கள் உறுதி பூணுகிறோம்.',
		'Give a Donation': 'நன்கொடை வழங்குங்கள்',
		'We would love to hear from you': 'உங்கள் கருத்தை அறிய மிகவும் விரும்புகிறோம்',
		'Find Us': 'எங்களைக் காண',
		'Follow Along': 'பின்தொடருங்கள்',
		'Opp. SBI Bank, Kalyan – Murbad Road, Kalyan West': 'எஸ்.பி.ஐ. வங்கிக்கு எதிரே, கல்யாண் – முர்பாத் சாலை, கல்யாண் மேற்கு',
		'Sundays 7:30 AM – 9:30 AM': 'ஞாயிற்றுக்கிழமைகளில் காலை 7:30 – 9:30',

		/* ---- about us ---- */
		'Our Story': 'எங்கள் வரலாறு',
		'A brief history of our church': 'எங்கள் திருச்சபையின் சுருக்கமான வரலாறு',
		'One hundred years of God’s faithfulness — from Kalyan’s early days to a thriving Tamil congregation.': 'தேவனுடைய உண்மையுள்ள ஒரு நூறு ஆண்டுகள் — கல்யாணின் தொடக்க நாட்களிலிருந்து சிறப்பாக வளர்ந்து வரும் தமிழ் சபை வரை.',
		'Since 1914': '1914 முதல்',
		'The story of Vernon Memorial Methodist Church, Kalyan began over a hundred years ago. In the year 1914, when Rev. Wilson E. Bancroft was the Pastor, the official board of the Taylor Memorial Church at Byculla decided to organise a church at Kalyan, which at that time was growing as an important junction.': 'கல்யாணில் உள்ள வெர்னான் மெமோரியல் மெதடிஸ்ட் திருச்சபையின் வரலாறு நூறு ஆண்டுகளுக்கும் முன் தொடங்கியது. 1914-ஆம் ஆண்டு, அருட்பணி. வில்சன் ஈ. பான்கிராப்ட் போதகராக இருந்தபோது, பைகுல்லாவில் உள்ள டெய்லர் மெமோரியல் திருச்சபையின் அதிகாரப்பூர்வக் குழு, அக்காலத்தில் முக்கியமான சந்திப்பு நகரமாக வளர்ந்து வந்த கல்யாணில் ஒரு திருச்சபையை அமைக்க முடிவு செய்தது.',
		'By the beginning of 1917 an English Service was duly started at Kalyan and by the end of that year a Methodist Church was established.': '1917-ஆம் ஆண்டின் தொடக்கத்தில் கல்யாணில் ஆங்கில ஆராதனை முறையாகத் தொடங்கப்பட்டது; அந்த ஆண்டின் முடிவில் ஒரு மெதடிஸ்ட் திருச்சபை நிறுவப்பட்டது.',
		'Our Vernon Memorial Methodist Tamil Church was founded on Dec 12, 1965, by Rev. Dr. Sabarenjithan and 12 other members. What began as a small and humble congregation has grown tremendously over the past 60 years into a well-organised, spiritual, and self supportive church. Today, approximately 140 Tamil families attend our church.': 'எங்கள் வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, டிசம்பர் 12, 1965-ஆம் நாள், அருட்பணி. டாக்டர். சபரேன்ஜிதன் மற்றும் வேறு 12 உறுப்பினர்களால் நிறுவப்பட்டது. சிறிய, எளிமையான கூட்டமாகத் தொடங்கிய இது, கடந்த 60 ஆண்டுகளில் நன்கு ஒழுங்கமைக்கப்பட்ட, ஆன்மீகமான, தன்னிறைவான திருச்சபையாக மிகப்பெரிய அளவில் வளர்ந்துள்ளது. இன்று ஏறத்தாழ 140 தமிழ் குடும்பங்கள் எங்கள் திருச்சபையில் கலந்துகொள்கின்றனர்.',
		'Deeply committed to the community': 'சமுதாயத்திற்கு ஆழ்ந்த அர்ப்பணிப்பு',
		'Our church is committed to making a difference through a wide range of social and outreach initiatives:': 'எங்கள் திருச்சபை, பரந்த அளவிலான சமூக மற்றும் ஊழிய முயற்சிகளால் மாற்றத்தை ஏற்படுத்த அர்ப்பணிக்கப்பட்டுள்ளது:',
		'Financial assistance for the education of underprivileged children': 'வசதியற்ற குழந்தைகளின் கல்விக்கு நிதியுதவி',
		'Medical aid for those in need': 'தேவைப்படுவோருக்கு மருத்துவ உதவி',
		'Support for widows': 'விதவைகளுக்கு ஆதரவு',
		'Contributions to missionary organisations and church construction': 'மிஷனரி அமைப்புகளுக்கும் திருச்சபை கட்டுமானத்திற்கும் பங்களிப்புகள்',
		'Programs that uplift and empower — for the blind, missionaries, children, women, youth, old-age homes and orphanages': 'பார்வையற்றோர், மிஷனரிகள், குழந்தைகள், மகளிர், இளைஞர், வயோதிகர் இல்லங்கள், அனாதை இல்லங்கள் ஆகியோருக்காக மேம்படுத்தி அதிகாரப்படுத்தும் நிகழ்ச்சிகள்',
		'60th Anniversary Souvenir': '60-வது ஆண்டு நினைவு மலர்',
		'Church founded': 'திருச்சபை நிறுவப்பட்டது',
		'Years of faith': 'விசுவாசத்தின் ஆண்டுகள்',
		'Tamil families': 'தமிழ் குடும்பங்கள்',
		'Our Connection': 'எங்கள் இணைப்பு',
		'Anchored in the Gospel, connected to a worldwide family of believers in the Wesleyan and Methodist tradition.': 'நற்செய்தியில் நிலைத்து, வெஸ்லிய மற்றும் மெதடிஸ்ட் பாரம்பரியத்தில் உலகெங்கிலும் உள்ள விசுவாசிகளின் குடும்பத்தோடு இணைந்துள்ளவர்கள்.',
		'Work in India began': 'இந்தியாவில் ஊழியம் தொடங்கியது',
		'Conference–District–Church': 'மாநாடு – மாவட்டம் – திருச்சபை',
		'Worldwide family': 'உலகளாவிய குடும்பம்',
		'Vernon Memorial is a Tamil congregation of the': 'வெர்னான் மெமோரியல் என்பது இந்திய மெதடிஸ்ட் திருச்சபையின் (ஐ.எம்.சி.ஐ) தமிழ் சபை ஆகும்;',
		'Methodist Church in India (MCI)': 'இந்திய மெதடிஸ்ட் திருச்சபை (ஐ.எம்.சி.ஐ)',
		', serving Kalyan as part of the': ', கல்யாணிற்கு மும்பை மண்டல மாநாட்டின் அங்கமாக ஊழியம் செய்கின்றது.',
		'The story of Methodism in India reaches back to 1856, when missionary William Butler began the movement’s work on Indian soil. From that early beginning the church has grown into a self-governing body that organises itself connectionally — from the central church, through Regional Conferences and Districts, to the local congregations that live out the Gospel every day.': 'இந்தியாவில் மெதடிஸ்ட் இயக்கத்தின் வரலாறு 1856-ஆம் ஆண்டை அடைகிறது; அப்போது மிஷனரி வில்லியம் பட்லர் இந்திய மண்ணில் இந்த இயக்கத்தின் ஊழியத்தைத் தொடங்கினார். அந்தத் தொடக்கத்திலிருந்து திருச்சபை, தன்னாட்சி அமைப்பாக வளர்ந்து, மையத் திருச்சபையிலிருந்து மண்டல மாநாடுகள், மாவட்டங்கள் வழியாக தினமும் நற்செய்தியை வாழ்ந்து காட்டும் உள்ளூர் சபைகள் வரை இணைப்பு முறையில் தன்னை ஒழுங்கமைத்துக்கொள்கிறது.',
		'As part of this worldwide Methodist and Wesleyan family, we carry a spiritual heritage that spans more than two centuries — a heritage of grace, holiness and service that finds its roots in the teaching of John Wesley.': 'இந்த உலகளாவிய மெதடிஸ்ட் மற்றும் வெஸ்லிய குடும்பத்தின் அங்கமாக, இரண்டு நூற்றாண்டுகளுக்கும் மேலான ஆன்மீகப் பாரம்பரியத்தை நாங்கள் கொண்டு செல்கிறோம் — ஜான் வெஸ்லியின் போதனையில் வேர்கொண்ட கிருபை, பரிசுத்தம், ஊழியம் ஆகியவற்றின் பாரம்பரியம்.',
		'Part of the Methodist Church in India': 'இந்திய மெதடிஸ்ட் திருச்சபையின் அங்கம்',

		/* ---- ministries ---- */
		'Serve With Us': 'எங்களோடு ஊழியம் செய்யுங்கள்',
		'Our Ministries': 'எங்கள் ஊழியங்கள்',
		'A variety of ministries to help you grow, serve, and connect.': 'வளரவும், ஊழியம் செய்யவும், இணையவும் உதவும் பல்வேறு ஊழியங்கள்.',
		'Find Your Place': 'உங்கள் இடத்தைக் கண்டறியுங்கள்',
		'Ministries at Vernon Memorial': 'வெர்னான் மெமோரியலில் உள்ள ஊழியங்கள்',
		'Whatever your age or season of life, there is a fellowship here for you. Explore the ministries of VMMTC and find where you can grow.': 'உங்கள் வயது அல்லது வாழ்க்கை நிலை எதுவாக இருந்தாலும், இங்கே உங்களுக்காக ஒரு சகவாசம் உண்டு. வி.எம்.எம்.டி.சி-யின் ஊழியங்களை ஆராய்ந்து, நீங்கள் வளரக்கூடிய இடத்தைக் கண்டறியுங்கள்.',
		'Women’s Christian Service Society': 'மகளிர் கிறிஸ்தவ சேவை சங்கம்',
		'WCSS': 'டபிள்யூ.சி.எஸ்.எஸ்',
		'A sisterhood of prayer, service and faith — women of VMMTC serving God, the Church and the community.': 'ஜெபம், ஊழியம், விசுவாசம் கொண்ட சகோதரி கூட்டமைப்பு — தேவனுக்கும், திருச்சபைக்கும், சமுதாயத்திற்கும் ஊழியம் செய்யும் வி.எம்.எம்.டி.சி மகளிர்.',
		'Men’s Fellowship': 'ஆண்கள் சகவாசம்',
		'Men growing in faith, character and service — as fathers, husbands, sons and servant-leaders.': 'தந்தைகளாக, கணவர்களாக, மகன்களாக, ஊழியத் தலைவர்களாக விசுவாசம், குணம், ஊழியத்தில் வளரும் ஆண்கள்.',
		'Methodist Youth Fellowship': 'மெதடிஸ்ட் இளைஞர் சகவாசம்',
		'MYF': 'எம்.ஒய்.எஃப்',
		'MYF Short Films': 'எம்.ஒய்.எஃப் குறும்படங்கள்',
		'The youth movement of VMMTC — young people growing in faith and leading the church of tomorrow.': 'வி.எம்.எம்.டி.சி-யின் இளைஞர் இயக்கம் — விசுவாசத்தில் வளர்ந்து, நாளைய திருச்சபையை வழிநடத்தும் இளைஞர்கள்.',
		'Children’s Ministry': 'குழந்தைகள் ஊழியம்',
		'Teaching children aged 5–15 the wonderful Word of God in lessons, songs and activities.': '5 முதல் 15 வயதுடைய குழந்தைகளுக்கு பள்ளி மாணவர் பாடம், பாடல்கள், செயல்பாடுகள் வழியாக தேவனுடைய அற்புதமான வார்த்தையைக் கற்பித்தல்.',
		'Not Sure Where You Fit?': 'உங்கள் இடம் எது என்று தெரியவில்லையா?',
		'Come share a Sunday with us and find your place in the family.': 'எங்களோடு ஒரு ஞாயிறு பகிர்ந்து, குடும்பத்தில் உங்கள் இடத்தைக் கண்டறியுங்கள்.',
		'Talk to Us': 'எங்களிடம் பேசுங்கள்',

		/* ---- ministry inner pages (women / men / youth / sunday school) ---- */
		'Women’s Fellowship': 'மகளிர் சகவாசம்',
		'The Women’s Christian Service Society — a sisterhood of prayer, service and faith at Vernon Memorial, serving God, the Church and the community.': 'மகளிர் கிறிஸ்தவ சேவை சங்கம் (டபிள்யூ.சி.எஸ்.எஸ்) — வெர்னான் மெமோரியலில் தேவனுக்கும், திருச்சபைக்கும், சமுதாயத்திற்கும் ஊழியம் செய்யும் ஜெபம், ஊழியம், விசுவாசம் கொண்ட சகோதரி கூட்டமைப்பு.',
		'The Women’s Christian Service Society (WCSS) is the women’s fellowship of the Methodist Church in India. At Vernon Memorial, our women gather in faith and friendship to pray, study the Word, serve the church and reach out to those in need. The society gives women of every generation a place to belong, to grow and to lead.': 'மகளிர் கிறிஸ்தவ சேவை சங்கம் (டபிள்யூ.சி.எஸ்.எஸ்) என்பது இந்திய மெதடிஸ்ட் திருச்சபையின் மகளிர் சகவாசமாகும். வெர்னான் மெமோரியலில், எங்கள் பெண்கள் ஜெபிக்கவும், வார்த்தையைக் கற்கவும், திருச்சபைக்கு ஊழியம் செய்யவும், தேவையில் உள்ளவர்களை அணுகவும் விசுவாசத்தோடும் நட்போடும் ஒன்றுகூடுகிறார்கள். இந்தச் சங்கம் ஒவ்வொரு தலைமுறை பெண்களுக்கும் உரிமையுடனும், வளர்ச்சியுடனும், தலைமைத்துவத்துடனும் வாழ ஒரு இடத்தை வழங்குகிறது.',
		'At a Glance': 'ஒரு பார்வையில்',
		'Meets': 'கூடும் நாள்',
		'Monthly': 'மாதந்தோறும்',
		'Serves': 'ஊழியம்',
		'Sunday worship & special services': 'ஞாயிறு ஆராதனை & சிறப்பு ஆராதனைகள்',
		'Open to': 'யாருக்காக',
		'All women of the church': 'திருச்சபையின் அனைத்து பெண்களும்',
		'How to join': 'இணைவது எப்படி',
		'Speak to the pastor or any WCSS member': 'போதகரிடமோ அல்லது எந்த டபிள்யூ.சி.எஸ்.எஸ் உறுப்பினரிடமோ பேசுங்கள்',
		'Serving Together': 'இணைந்து ஊழியம் செய்தல்',
		'What we do': 'நாங்கள் என்ன செய்கிறோம்',
		'Prayer & Worship': 'ஜெபமும் ஆராதனையும்',
		'A regular prayer life together — monthly fellowship meetings, intercession and support for one another in every season.': 'ஒன்றிணைந்த வழக்கமான ஜெப வாழ்க்கை — மாதாந்திர சகவாசக் கூட்டங்கள், பரிந்து பேசுதல், எல்லா நிலைமைகளிலும் ஒருவருக்கொருவர் துணை நிற்றல்.',
		'Bible Study & Growth': 'வேதப் பயிற்சியும் வளர்ச்சியும்',
		'Studying the Word of God together to grow in faith, wisdom and confidence in everyday life.': 'அன்றாட வாழ்க்கையில் விசுவாசம், ஞானம், உறுதி பெற ஒன்றாக தேவனுடைய வார்த்தையைப் பயில்வது.',
		'Community Service': 'சமுதாய ஊழியம்',
		'Reaching out to the needy, visiting the sick and serving the community with the love of Christ.': 'தேவையில் உள்ளவர்களை அணுகுதல், நோயாளிகளைச் சந்தித்தல், கிறிஸ்துவின் அன்போடு சமுதாயத்திற்கு ஊழியம் செய்தல்.',
		'Fellowship & Sisterhood': 'சகவாசமும் சகோதரத்துவமும்',
		'A warm, welcoming sisterhood that supports families, celebrates together and encourages every woman of the church.': 'குடும்பங்களைத் தாங்கி, ஒன்றாகக் கொண்டாடி, திருச்சபையின் ஒவ்வொரு பெண்ணையும் ஊக்குவிக்கும் அன்பான, வரவேற்கும் சகோதரத்துவம்.',
		'Get Involved': 'பங்கேருங்கள்',
		'Whether you are new to VMMTC or an old friend, every woman is welcome to become part of our WCSS family.': 'நீங்கள் வி.எம்.எம்.டி.சி-க்கு புதியவராக இருந்தாலும் அல்லது பழைய நண்பராக இருந்தாலும், ஒவ்வொரு பெண்ணும் எங்கள் டபிள்யூ.சி.எஸ்.எஸ் குடும்பத்தின் அங்கமாக வரவேற்கப்படுகிறீர்கள்.',
		'Men of Vernon Memorial growing in faith, character and service — as fathers, husbands, sons and servant-leaders of the church.': 'தந்தைகளாக, கணவர்களாக, மகன்களாக, திருச்சபையின் ஊழியத் தலைவர்களாக விசுவாசம், குணம், ஊழியத்தில் வளரும் வெர்னான் மெமோரியலின் ஆண்கள்.',
		'Who we are': 'நாங்கள் யார்',
		'The Methodist Men fellowship unites the men of VMMTC in faith, friendship and service. Together we build one another up through the Word, take up the practical work of the church, and model godly leadership at home and in the community.': 'மெதடிஸ்ட் ஆண்கள் சகவாசம், வி.எம்.எம்.டி.சி-யின் ஆண்களை விசுவாசத்திலும், நட்பிலும், ஊழியத்திலும் இணைக்கிறது. ஒன்றாக நாங்கள் வார்த்தையின் மூலம் ஒருவரையொருவர் பலப்படுத்துகிறோம்; திருச்சபையின் நடைமுறை வேலைகளை மேற்கொள்கிறோம்; வீட்டிலும் சமுதாயத்திலும் தேவபக்தியான தலைமைத்துவத்தை முன்மாதிரியாகக் காட்டுகிறோம்.',
		'Men’s Fellowship': 'ஆண்கள் சகவாசம்',
		'Church upkeep & special services': 'திருச்சபை பராமரிப்பு & சிறப்பு ஆராதனைகள்',
		'All men of the church': 'திருச்சபையின் அனைத்து ஆண்களும்',
		'Speak to the pastor or any member': 'போதகரிடமோ அல்லது எந்த உறுப்பினரிடமோ பேசுங்கள்',
		'Discipleship & Bible Study': 'சீடத்துவம் & வேதப் பயிற்சி',
		'Growing together through the Word and shared accountability as men of faith.': 'வார்த்தையின் மூலமாகவும், விசுவாச ஆண்களாக ஒருவருக்கொருவர் பொறுப்புணர்வோடும் ஒன்றாக வளர்வது.',
		'Service & Church Upkeep': 'ஊழியம் & திருச்சபை பராமரிப்பு',
		'Helping hands for church maintenance, special events and the practical needs of the congregation.': 'திருச்சபைப் பராமரிப்பு, சிறப்பு நிகழ்வுகள், சபையின் நடைமுறைத் தேவைகளுக்கு உதவும் கைகள்.',
		'Fellowship': 'சகவாசம்',
		'A brotherhood that shares life together — encouragement, friendship and laughter.': 'ஊக்கம், நட்பு, மகிழ்ச்சி — வாழ்க்கையை ஒன்றாகப் பகிரும் சகோதரத்துவம்.',
		'Mentorship & Support': 'வழிகாட்டுதலும் துணையும்',
		'Supporting families, mentoring young men and standing with one another in every season.': 'குடும்பங்களைத் தாங்குதல், இளைஞர்களுக்கு வழிகாட்டுதல், எல்லா சூழல்களிலும் ஒருவருக்கொருவர் துணை நிற்றல்.',
		'Come and stand shoulder to shoulder with the men of VMMTC — there is a place for you here.': 'வி.எம்.எம்.டி.சி-யின் ஆண்களோடு தோளோடு தோள் நிற்க வாருங்கள் — இங்கே உங்களுக்கு ஒரு இடம் உண்டு.',
		'Youth Fellowship': 'இளைஞர் சகவாசம்',
		'MYF — Methodist Youth Fellowship': 'எம்.ஒய்.எஃப் — மெதடிஸ்ட் இளைஞர் சகவாசம்',
		'The youth movement of Vernon Memorial — a community of young people growing in faith and leading the church of tomorrow.': 'வெர்னான் மெமோரியலின் இளைஞர் இயக்கம் — விசுவாசத்தில் வளர்ந்து, நாளைய திருச்சபையை வழிநடத்தும் இளைஞர்களின் சமூகம்.',
		'We believe in the next generation because they are the future of the church. Our young people congregate weekly to grow their faith and connect with students their age to help one another. Through worship, retreats and service, the MYF is shaping today’s youth into tomorrow’s leaders.': 'அடுத்த தலைமுறையில் நாங்கள் விசுவாசம் கொள்கிறோம்; ஏனெனில் அவர்களே திருச்சபையின் எதிர்காலம். எங்கள் இளைஞர்கள் வாரந்தோறும் ஒன்றுகூடி தங்கள் விசுவாசத்தை வளர்க்கவும், தங்கள் வயதுடைய மாணவர்களோடு இணைந்து ஒருவருக்கொருவர் உதவிக்கொள்ளவும் செய்கிறார்கள். ஆராதனை, மாநாடு, ஊழியம் ஆகியவற்றின் வழியாக, இன்றைய இளைஞர்களை நாளைய தலைவர்களாக எம்.ஒய்.எஃப் உருவாக்குகிறது.',
		'Weekly': 'வாரந்தோறும்',
		'Worship, retreats & special programmes': 'ஆராதனை, மாநாடுகள் & சிறப்பு நிகழ்ச்சிகள்',
		'Students & young adults': 'மாணவர்கள் & இளைஞர்கள்',
		'Speak to the pastor or any MYF member': 'போதகரிடமோ அல்லது எந்த எம்.ஒய்.எஃப் உறுப்பினரிடமோ பேசுங்கள்',
		'Weekly Gatherings': 'வாராந்திர கூட்டங்கள்',
		'A vibrant weekly fellowship of song, prayer and the Word with friends your age.': 'உங்கள் வயதுடைய நண்பர்களோடு பாடல், ஜெபம், வார்த்தை — துடிப்பான வாராந்திர சகவாசம்.',
		'Worship & Music': 'ஆராதனையும் இசையும்',
		'Leading the church in praise through the youth choir and worship teams.': 'இளைஞர் பாடகர் குழு மற்றும் ஆராதனை குழுக்கள் வழியாக திருச்சபையைத் துதியில் முன்னிறுத்துதல்.',
		'Retreats & Events': 'மாநாடுகள் & நிகழ்வுகள்',
		'Youth retreats, competitions and programmes that build faith, fun and lasting friendship.': 'விசுவாசம், மகிழ்ச்சி, நிலையான நட்பை உருவாக்கும் இளைஞர் மாநாடுகள், போட்டிகள், நிகழ்ச்சிகள்.',
		'Outreach & Service': 'வெளி ஊழியமும் சேவையும்',
		'Serving the church and community, and carrying the good news beyond our walls.': 'திருச்சபைக்கும் சமுதாயத்திற்கும் ஊழியம் செய்து, நற்செய்தியை எங்கள் சுவர்களுக்கு அப்பால் கொண்டு செல்வது.',
		'Relive our most unforgettable retreat': 'எங்கள் மிகவும் மறக்க முடியாத மாநாட்டை மீண்டும் உணருங்கள்',
		'Watch the trailer and sing along with all the worship songs from Youth Retreat 2024.': 'டிரெய்லரைக் கண்டு, இளைஞர் மாநாடு 2024-ன் அனைத்து ஆராதனைப் பாடல்களோடு இணைந்து பாடுங்கள்.',
		'Retreat 2024 Songs': 'மாநாடு 2024 பாடல்கள்',
		'If you are young and you belong to VMMTC, the MYF is your home — come, grow and lead with us.': 'நீங்கள் இளைஞராக இருந்து வி.எம்.எம்.டி.சி-க்குச் சொந்தமானவரானால், எம்.ஒய்.எஃப் உங்கள் இல்லமே — வாருங்கள், வளருங்கள், எங்களோடு வழிநடத்துங்கள்.',
		'Teaching the next generation about the wonderful Word of God — children from the age of 5 to 15.': '5 முதல் 15 வயது வரையிலான குழந்தைகளுக்கு தேவனுடைய அற்புதமான வார்த்தையை அடுத்த தலைமுறைக்கு கற்பித்தல்.',
		'We love kids! Our Sunday School is led by caring teachers who love and teach children the wonderful Word of God in lessons, songs and activities they will remember for life. In class, in play and in prayer, children here learn to know Jesus and to love His Church.': 'குழந்தைகளை நாங்கள் மிகவும் நேசிக்கிறோம்! எங்கள் ஞாயிறு பள்ளியை, குழந்தைகளை நேசித்து, வாழ்நாள் முழுவதும் நினைவில் நிற்கும் பாடங்கள், பாடல்கள், செயல்பாடுகள் வழியாக தேவனுடைய அற்புதமான வார்த்தையைக் கற்றுத் தரும் அன்பான ஆசிரியர்கள் வழிநடத்துகிறார்கள். வகுப்பிலும், விளையாட்டிலும், ஜெபத்திலும் இங்கே குழந்தைகள் இயேசுவை அறிந்துகொள்ளவும், அவருடைய திருச்சபையை நேசிக்கவும் கற்றுக்கொள்கிறார்கள்.',
		'Every Sunday': 'ஒவ்வொரு ஞாயிறும்',
		'Time': 'நேரம்',
		'Before the morning worship service': 'காலை ஆராதனைக்கு முன்',
		'Age group': 'வயது வரம்பு',
		'5 to 15 years': '5 முதல் 15 வயது',
		'Bring your child on Sunday — no registration needed': 'ஞாயிற்றுக்கிழமை உங்கள் குழந்தையை அழைத்து வாருங்கள் — பதிவு தேவையில்லை',
		'Age-Appropriate Classes': 'வயதுக்கேற்ற வகுப்புகள்',
		'Children aged 5–15 are grouped into classes with the right lesson, pace and teacher for them.': '5–15 வயதுடைய குழந்தைகள், அவர்களுக்கேற்ற பாடம், வேகம், ஆசிரியருடன் வகுப்புகளாகப் பிரிக்கப்படுகிறார்கள்.',
		'Bible Lessons & Memory Verses': 'வேதப்பாடங்கள் & மனப்பாட வசனங்கள்',
		'Learning the great stories of Scripture and hiding God’s Word in their hearts.': 'வேதத்தின் மகத்துவமான கதைகளைக் கற்று, தேவனுடைய வார்த்தையை அவர்களுடைய இருதயங்களில் பதித்தல்.',
		'Songs & Activities': 'பாடல்களும் செயல்பாடுகளும்',
		'Worship songs, crafts and games that make Sunday School a joy every week.': 'ஒவ்வொரு வாரமும் ஞாயிறு பள்ளியை மகிழ்ச்சியாக்கும் ஆராதனைப் பாடல்கள், கைவினைப் பொருட்கள், விளையாட்டுகள்.',
		'Annual Programmes': 'வருடாந்திர நிகழ்ச்சிகள்',
		'Children’s Day, Christmas love feasts and anniversary celebrations where our kids shine.': 'எங்கள் குழந்தைகள் மிளிரும் குழந்தைகள் தினம், கிறிஸ்துமஸ் அன்பு விருந்து, ஆண்டு நிறைவு கொண்டாட்டங்கள்.',
		'Bring your little ones every Sunday — a warm welcome awaits them in Sunday School.': 'ஒவ்வொரு ஞாயிறும் உங்கள் சிறியோரை அழைத்து வாருங்கள் — ஞாயிறு பள்ளியில் அவர்களுக்கு அன்பான வரவேற்பு காத்திருக்கிறது.',

		/* ---- events ---- */
		'Mark Your Calendar': 'உங்கள் நாட்காட்டியில் குறியுங்கள்',
		'September 2024': 'செப்டம்பர் 2024',
		'Youth Convention & Retreat': 'இளைஞர் மாநாடு & ஆன்மீக ஒன்றுகூடல்',
		'6th & 7th September': 'செப்டம்பர் 6, 7',
		'Theme:': 'கருப்பொருள்:',
		'Flee From Idolatry. 1 Cor 10:14': 'விக்கிரக ஆராதனையிலிருந்து ஓடுங்கள். 1 கொரிந்தியர் 10:14',
		'Venue:': 'இடம்:',
		'Vernon Memorial Methodist Tamil Church, Kalyan': 'வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண்',
		'Speakers:': 'பேச்சாளர்கள்:',
		'CONVENTION SPEAKER: PS. JOYEL BABU SAMUEL & RETREAT SPEAKER: REV. DANIEL HALZANDE': 'மாநாட்டுப் பேச்சாளர்: பிரசஞ். ஜோயல் பாபு சாமுவேல் & ஒன்றுகூடல் பேச்சாளர்: அருட்பணி. டேனியல் ஹால்சாண்டே',
		'Two Days Convention On 6th & 7th September 2024 7pm - 9pm / Retreat on 7th September 9am - 5pm': 'இரு நாள் மாநாடு: செப்டம்பர் 6, 7, 2024, மாலை 7 – இரவு 9 / ஒன்றுகூடல்: செப்டம்பர் 7, காலை 9 – மாலை 5',
		'October 2024': 'அக்டோபர் 2024',
		'Children Retreat': 'குழந்தைகள் மாநாடு',
		'Wednesday, October 2': 'புதன்கிழமை, அக்டோபர் 2',
		'Let the children come to me': 'குழந்தைகளை என்னிடம் வரச்செய்யுங்கள்',
		'Time:': 'நேரம்:',
		'4:30 – 8:00pm': 'மாலை 4:30 – 8:00',
		'This event will feature a dynamic lineup of activities, including an exciting Action Song competition, and a vibrant Exhibition. It will be a day of spiritual growth, creativity and a joyful celebration of our children. We look forward to sharing this inspiring and uplifting experience with you.': 'இந்த நிகழ்வில் அற்புதமான அதிரடிப் பாடல் போட்டி, உற்சாகமான கண்காட்சி உள்ளிட்ட பல்வேறு செயல்பாடுகள் இடம்பெறும். ஆன்மீக வளர்ச்சி, படைப்பாற்றல், எங்கள் குழந்தைகளின் மகிழ்ச்சியான கொண்டாட்டம் நிறைந்த ஒரு நாளாக அது இருக்கும். இந்த ஊக்கமளிக்கும் அனுபவத்தை உங்களோடு பகிர்ந்துகொள்ள ஆவலுடன் எதிர்நோக்குகிறோம்.',
		'Watch the recap': 'மீள்பார்வையைக் காண',
		'Speaker:': 'பேச்சாளர்:',
		'Ministry:': 'பணித்துறை:',
		'Occasion:': 'சந்தர்ப்பம்:',
		'Led by:': 'தலைமையேற்றவர்:',
		'September 2026': 'செப்டம்பர் 2026',
		'August 2026': 'ஆகஸ்ட் 2026',
		'December 2025': 'டிசம்பர் 2025',
		'October 2025': 'அக்டோபர் 2025',
		'March 2024': 'மார்ச் 2024',
		'October 2023': 'அக்டோபர் 2023',
		'2025': '2025',
		'2024': '2024',
		'2023': '2023',
		'Annual Youth Retreat 2026': 'வருடாந்திர இளைஞர் ஒன்றுகூடல் 2026',
		'14th September 2026': 'செப்டம்பர் 14, 2026',
		'Remnant of God': 'தேவனின் மீதி',
		'Rev. Samuel Ragland Paul': 'அருட்பணி. சாமுவேல் ராக்லண்ட் பால்',
		'MYF / Youth': 'எம்.ஒய்.எஃப் / இளைஞர்',
		'Women Sunday Divine Service': 'மகளிர் ஞாயிறு தெய்வீக ஆராதனை',
		'16th August 2026': 'ஆகஸ்ட் 16, 2026',
		'WSCS (Women)': 'WSCS (மகளிர்)',
		'One Day Women’s Retreat': 'ஒரு நாள் மகளிர் ஒன்றுகூடல்',
		'15th August 2026': 'ஆகஸ்ட் 15, 2026',
		'Have salt among yourselves. Mark 9:50b': 'உங்களுக்குள்ளே உப்பை உடையவர்களாயிருங்கள். மாற்கு 9:50b',
		'Mrs. Sujatha Jeeva': 'திருமதி. சுஜாதா ஜீவா',
		'Preparatory Convention': 'ஆயத்த மாநாடு',
		'14th August 2026': 'ஆகஸ்ட் 14, 2026',
		'Grand Church Day Service': 'பெரும் திருச்சபை தின ஆராதனை',
		'8th December 2025': 'டிசம்பர் 8, 2025',
		'Diamond Jubilee – 60th anniversary celebrations': 'வைர ஜூபிலி – 60வது ஆண்டு நிறைவு கொண்டாட்டங்கள்',
		'6:00 PM and fellowship dinner': 'மாலை 6:00 & அன்பு விருந்து',
		'Family Meeting': 'குடும்பக் கூட்டம்',
		'7th December 2025': 'டிசம்பர் 7, 2025',
		'D. Augustine Jebakumar': 'டி. அகஸ்டின் ஜெபக்குமார்',
		'11 AM – 1 PM': 'காலை 11 – மதியம் 1',
		'Revival Meeting': 'மீட்புக் கூட்டம்',
		'6th & 7th December 2025': 'டிசம்பர் 6, 7, 2025',
		'6:30 PM': 'மாலை 6:30',
		'Insights on Prayer': 'ஜெபம் குறித்த நுண்ணறிவு',
		'5th December 2025': 'டிசம்பர் 5, 2025',
		'Karthi Gamaliel': 'கர்தி கமலியேல்',
		'4th & 5th December 2025': 'டிசம்பர் 4, 5, 2025',
		'Confirmation Service': 'உறுதிப்படுத்தல் ஆராதனை',
		'1st December 2025': 'டிசம்பர் 1, 2025',
		'Diamond Jubilee – 60th anniversary': 'வைர ஜூபிலி – 60வது ஆண்டு',
		'Bishop Dr. Anilkumar J. Servand, MRC': 'பிஷப் டாக்டர். அனில்குமார் ஜே. செர்வாண்ட், MRC',
		'VBS 2025': 'VBS 2025',
		'23rd October 2025': 'அக்டோபர் 23, 2025',
		'Fellowship with God’s Word & Learning': 'தேவனுடைய வார்த்தையோடு சகவாசம் & கற்றல்',
		'Annual Youth Retreat 2025': 'வருடாந்திர இளைஞர் ஒன்றுகூடல் 2025',
		'Guard Your Heart': 'உன் இருதயத்தைக் காத்துக்கொள்',
		'Children’s Sunday Service': 'குழந்தைகள் ஞாயிறு ஆராதனை',
		'MYF Sunday Services': 'MYF ஞாயிறு ஆராதனைகள்',
		'Year not confirmed': 'வருடம் உறுதிப்படுத்தப்படவில்லை',
		'Palm Sunday Service': 'பாம் ஞாயிறு ஆராதனை',
		'24th March 2024': 'மார்ச் 24, 2024',
		'Palm Sunday': 'பாம் ஞாயிறு',
		'VBS 2024': 'VBS 2024',
		'Let’s Rise Up': 'எழுந்திருப்போம்',
		'Family Sunday 2024': 'குடும்ப ஞாயிறு 2024',
		'Singapore Trip 2024': 'சிங்கப்பூர் பயணம் 2024',
		'Photos from the 2024 Singapore trip.': '2024 சிங்கப்பூர் பயண புகைப்படங்கள்.',
		'View trip page': 'பயணப் பக்கத்தைக் காண்க',
		'Path of the Righteous – Short Film': 'நீதிமானின் பாதை – குறும்படம்',
		'Men’s Fellowship Sunday Service': 'ஆண்கள் சகவாச ஞாயிறு ஆராதனை',
		'29th October 2023': 'அக்டோபர் 29, 2023',
		'Trip to Tarkarli': 'தர்கார்லி பயணம்',
		'2023 (estimated)': '2023 (மதிப்பீடு)',
		'Church-wide outing': 'சபை முழுமைக்குமான உல்லாசப் பயணம்',
		'MVM Mission Field Visit': 'MVM ஊழிய மைய விஜயம்',
		'Church-wide outreach': 'சபை முழுமைக்குமான ஊழிய நடவடிக்கை',
		'A visit to the mission field at Jawhar, Palghar.': 'ஜவ்ஹர், பால்கர் பகுதி ஊழிய மையத்திற்கு நடந்த விஜயம்.',
		'MYF Annual Youth Retreat 2023': 'MYF வருடாந்திர இளைஞர் ஒன்றுகூடல் 2023',
		'VBS 2023': 'VBS 2023',
		'Bambelela': 'பம்பெலேலா',
		'Children’s Sunday Service 2023': 'குழந்தைகள் ஞாயிறு ஆராதனை 2023',
		'Youth Sunday Service 2023': 'இளைஞர் ஞாயிறு ஆராதனை 2023',
		'Dates marked (estimated) are inferred from the channel’s upload order.': 'மதிப்பீடு எனக் குறிக்கப்பட்ட தேதிகள் சேனலின் பதிவேற்ற வரிசையின்படி மதிப்பிடப்பட்டவை.',
		'Mrs. Sheema Evanjiline': 'திருமதி. ஷீமா ஈவஞ்சிலின்',
		'Watch the recap - Part 1': 'மீள்பார்வையைக் காண - பகுதி 1',
		'Watch the recap - Part 2': 'மீள்பார்வையைக் காண - பகுதி 2',
		'Watch the recap - Day 1': 'மீள்பார்வையைக் காண - நாள் 1',
		'Watch the recap - Day 2': 'மீள்பார்வையைக் காண - நாள் 2',
		'Watch the recap - Day 3': 'மீள்பார்வையைக் காண - நாள் 3',
		'Watch the recap - Day 4': 'மீள்பார்வையைக் காண - நாள் 4',
		'Homiletics': 'பிரசங்கக் கலை',
		'3rd March 2026': 'மார்ச் 3, 2026',
		'Rev. Muthukumar Natarajan': 'அருட்பணி. முத்துகுமார் நடராஜன்',
		'27th August 2025': 'ஆகஸ்ட் 27, 2025',
		'Rev. Thomas Samuel': 'அருட்பணி. தாமஸ் சாமுவேல்',
		'November 2025': 'நவம்பர் 2025',
		'Mrs. Nancy Leenus (Omkar Cambridge International school)': 'திருமதி. நான்சி லீனஸ் (ஓம்கர் கேம்பிரிட்ஜ் பன்னாட்டுப் பள்ளி)',
		'24th November 2024': 'நவம்பர் 24, 2024',
		'2nd October 2024': 'அக்டோபர் 2, 2024',
		'This event featured a dynamic lineup of activities, including an exciting Action Song competition, and a vibrant Exhibition. It was a day of spiritual growth, creativity and a joyful celebration of our children. We look forward to sharing this inspiring and uplifting experience with you.': 'இந்த நிகழ்வில் அற்புதமான அதிரடிப் பாடல் போட்டி, உற்சாகமான கண்காட்சி உள்ளிட்ட பல்வேறு செயல்பாடுகள் இடம்பெற்றன. ஆன்மீக வளர்ச்சி, படைப்பாற்றல், எங்கள் குழந்தைகளின் மகிழ்ச்சியான கொண்டாட்டம் நிறைந்த ஒரு நாளாக அது இருந்தது. இந்த ஊக்கமளிக்கும் அனுபவத்தை உங்களோடு பகிர்ந்துகொள்ள ஆவலுடன் எதிர்நோக்குகிறோம்.',
		'28th October - 02nd November 2024': 'அக்டோபர் 28 – நவம்பர் 2, 2024',
		'Let’s Rise Up (Isaiah 40:31)': 'எழுந்திருப்போம் (ஏசாயா 40:31)',
		'January 2024': 'ஜனவரி 2024',
		'April 2024': 'ஏப்ரல் 2024',
		'Proverbs 2:20 - Thus you will walk in the ways of the good and keep to the paths of the righteous.': 'நீதிமொழிகள் 2:20 - ஆகவே நீ நல்லோர் வழியில் நடந்து, நீதிமான்களின் பாதைகளைக் கைக்கொள்வாய்.',
		'November 2023': 'நவம்பர் 2023',
		'22nd October 2023': 'அக்டோபர் 22, 2023',
		'19th September 2023': 'செப்டம்பர் 19, 2023',
		'Armour of God (Ephesians 6:11)': 'தேவனுடைய சர்வாயுதவர்க்கம் (எபேசியர் 6:11)',
		'Bro. D. M. Bhagyaraj': 'சகோ. டி. எம். பாக்யராஜ்',
		'VBS Theme:': 'VBS கருப்பொருள்:',
		'Serve one another (Galatians 5:13)': 'ஒருவருக்கொருவர் ஊழியம் செய்யுங்கள் (கலாத்தியர் 5:13)',
		'26th November 2023': 'நவம்பர் 26, 2023',
		'Rev. Gilbert William': 'அருட்பணி. கில்பர்ட் வில்லியம்',

		/* ---- gallery ---- */
		'Our Community': 'எங்கள் சமூகம்',
		'Moments of worship, fellowship and joy from Vernon Memorial.': 'வெர்னான் மெமோரியலின் ஆராதனை, சகவாசம், மகிழ்ச்சி நிறைந்த தருணங்கள்.',
		'Stay Connected': 'இணைந்திருங்கள்',
		'See more videos on our YouTube Channel': 'எங்கள் யூடியூப் சேனலில் மேலும் வீடியோக்களைக் காண',
		'Visit Our YouTube Channel': 'எங்கள் யூடியூப் சேனலைப் பார்வையிடுங்கள்',
		'Worship Sessions': 'ஆராதனை அமர்வுகள்',
		'Videos': 'வீடியோக்கள்',
		'Showing 4 of 8 images': '8 படங்களில் 4 காட்டப்படுகின்றன',
		'Cherished Moments': 'பொக்கிஷ தருணங்கள்',
		'Images': 'படங்கள்',
		'Reset': 'மீட்டமை',
		'Load More…': 'மேலும் காண…',
		'gallery_showing': 'மொத்தம் {total} படங்களில் {shown} காட்டப்படுகின்றன',
		'View': 'காண்க',

		/* ---- login ---- */
		'Members Portal': 'உறுப்பினர் வலைவாசல்',
		'Access your profile and manage your giving.': 'உங்கள் சுயவிவரத்தை அணுகி, உங்கள் காணிக்கைகளை நிர்வகிக்கவும்.',
		'Coming Soon': 'விரைவில்',
		'The members portal is under construction. For now, the invoicing tool remains available from the Login button above.': 'உறுப்பினர் வலைவாசல் கட்டுமானத்தில் உள்ளது. தற்போது, மேலே உள்ள உள்நுழைவு பொத்தானிலிருந்து பில் கருவி கிடைக்கிறது.',
		'Open Invoicing Tool': 'பில் கருவியைத் திற',

		/* ---- souvenir ---- */
		'60th Anniversary': '60-வது ஆண்டு நிறைவு',
		'Commemorative Souvenir Book': 'நினைவு மலர்',
		'Friends, we are delighted to invite you to join us in commemorating a significant milestone in the life of our beloved Church.': 'நண்பர்களே, எங்கள் அன்பான திருச்சபையின் வாழ்வில் ஒரு முக்கியமான மைல்கல்லை நினைவுகொள்ள எங்களோடு இணையுமாறு மகிழ்ச்சியோடு உங்களை அழைக்கிறோம்.',
		'60 Years of Faith': 'விசுவாசத்தின் 60 ஆண்டுகள்',
		'Be A Part Of History': 'வரலாற்றின் பங்காக இருங்கள்',
		'As we celebrate 60 years of unwavering faith': 'அசையாத விசுவாசத்தின் 60 ஆண்டுகளை நாங்கள் கொண்டாடுகிறோம்',
		'We are excited to present our commemorative Souvenir Book — celebrating six decades of God’s faithfulness through Vernon Memorial Methodist Tamil Church, Kalyan.': 'வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாணின் மூலம் காட்டப்படும் தேவனுடைய உண்மையுள்ள ஆறு பத்தாண்டுகளைக் கொண்டாடும் எங்கள் நினைவு மலரை வழங்குவதில் நாங்கள் உற்சாகமாக இருக்கிறோம்.',
		'Participate Now': 'இப்போதே பங்கேற்கவும்',
		'View Memories': 'நினைவுகளைக் காண',
		'Enrollment Form': 'பதிவு படிவம்',
		'Fill in the form below to participate in the Souvenir Book.': 'நினைவு மலரில் பங்கேற்க கீழே உள்ள படிவத்தை நிரப்புங்கள்.',

		/* ---- singapore trip ---- */
		'Adventure Awaits': 'சாகசம் காத்திருக்கிறது',
		'Singapore Trip': 'சிங்கப்பூர் பயணம்',
		'Get ready to be swept away by a whirlwind of awe-inspiring experiences.': 'அதிசயமான அனுபவங்களின் சூறாவளியில் சிக்கிக்கொள்ளத் தயாராகுங்கள்.',
		'Travel With Us': 'எங்களோடு பயணியுங்கள்',
		'Come join us for an adventurous trip': 'சாகசப் பயணத்திற்கு எங்களோடு இணையுங்கள்',
		'Register your interest below and we will be in touch with all the details.': 'கீழே உங்கள் ஆர்வத்தைப் பதிவு செய்யுங்கள்; அனைத்து விவரங்களுடன் நாங்கள் உங்களைத் தொடர்புகொள்வோம்.',

		/* ---- youth retreat 2024 ---- */
		'Limitless · Mark 10:27': 'வரம்பற்றது · மாற்கு 10:27',
		'Limitless · Mark 10:27 · Ephesians 3': 'வரம்பற்றது · மாற்கு 10:27 · எபேசியர் 3',
		'Join Us for an Unforgettable Youth Retreat': 'மறக்க முடியாத இளைஞர் மாநாட்டில் எங்களோடு இணையுங்கள்',
		'Discover new adventures, make lifelong friendships, and experience unforgettable moments. Stop putting limits on what you can do — don’t put God in a box, because He’ll break it!': 'புதிய சாகசங்களைக் கண்டறியுங்கள், வாழ்நாள் நட்பை உருவாக்குங்கள், மறக்க முடியாத தருணங்களை அனுபவியுங்கள். உங்களால் இயன்றவற்றிற்கு வரம்பு வைப்பதை நிறுத்துங்கள் — தேவனை ஒரு பெட்டிக்குள் அடைக்க வேண்டாம், ஏனெனில் அவர் அதை உடைப்பார்!',
		'View Songs': 'பாடல்களைக் காண',
		'🌟 Youth Retreat 2024 — Two Days of Worship, Word and Fellowship 🌟  🌟 Discover What It Truly Means to Be Limitless 🌟': '🌟 இளைஞர் மாநாடு 2024 — இரண்டு நாட்கள் ஆராதனை, வார்த்தை, சகவாசம் 🌟  🌟 வரம்பற்றவர்களாக இருப்பதன் உண்மையான பொருளைக் கண்டறியுங்கள் 🌟',
		'The Experience': 'அனுபவம்',
		'What to Expect': 'எதை எதிர்பார்க்கலாம்',
		'Here are some exciting features of our retreat.': 'எங்கள் மாநாட்டின் சில இன்பமான சிறப்பம்சங்கள் இவை.',
		'God’s Word': 'தேவனுடைய வார்த்தை',
		'Experience thrilling teaching and outdoor activities designed for adventure seekers and nature lovers.': 'சாகச ஆர்வலர்களுக்கும் இயற்கை அன்பர்களுக்குமாக வடிவமைக்கப்பட்ட உற்சாகமான போதனையும் வெளிப்புற செயல்பாடுகளையும் அனுபவியுங்கள்.',
		'Singing Competition': 'பாடல் போட்டி',
		'Participate in workshops and sessions that promote personal growth and skill development.': 'தனிப்பட்ட வளர்ச்சியையும் திறன் மேம்பாட்டையும் ஊக்குவிக்கும் பயிலரங்குகளிலும் அமர்வுகளிலும் பங்கேற்கவும்.',
		'Inspiring Songs': 'ஊக்கமளிக்கும் பாடல்கள்',
		'Build strong connections with like-minded individuals and form lasting friendships.': 'ஒத்த எண்ணம் கொண்டவர்களுடன் உறுதியான உறவுகளை உருவாக்கி, நிலையான நட்பைப் பெறுங்கள்.',
		'Amazing Food': 'சுவையான உணவு',
		'Enjoy delicious and healthy meals prepared by top-notch chefs throughout the retreat.': 'மாநாட்டின் முழுவதும் சிறந்த சமையல்காரர்கள் தயாரிக்கும் சுவையான, ஆரோக்கியமான உணவை அனுபவியுங்கள்.',
		'Ready to sing along?': 'ஒன்றாகப் பாடத் தயாரா?',
		'Find all the lyrics from the retreat on our songs page.': 'மாநாட்டின் அனைத்து பாடல் வரிகளையும் எங்கள் பாடல் பக்கத்தில் காணலாம்.',
		'Youth Retreat 2024 Songs →': 'இளைஞர் மாநாடு 2024 பாடல்கள் →',
		'Reserve Your Spot': 'உங்கள் இடத்தை முன்பதிவு செய்யுங்கள்',
		'Fill in the form below to enroll for the Youth Retreat 2024.': 'இளைஞர் மாநாடு 2024-இல் சேர கீழே உள்ள படிவத்தை நிரப்புங்கள்.',

		/* ---- songs ---- */
		'Youth Retreat 2024 — Songs': 'இளைஞர் மாநாடு 2024 — பாடல்கள்',
		'Sing along with the songs of the retreat. Choose a song from the list to view its lyrics.': 'மாநாட்டின் பாடல்களோடு இணைந்து பாடுங்கள். அதன் வரிகளைக் காண பட்டியலிலிருந்து ஒரு பாடலைத் தேர்ந்தெடுங்கள்.',
		'Back to Youth Retreat': 'இளைஞர் மாநாட்டிற்குத் திரும்பு',
		'Select a Song': 'ஒரு பாடலைத் தேர்ந்தெடு',
		'Song': 'பாடல்',
		'← Previous': '← முந்தையது',
		'Next →': 'அடுத்தது →',
		'song_pager': 'பாடல் {n} / {total}',
		'song_select_n': 'பாடல் {n}',
		'Song 1 of 19': 'பாடல் 1 / 19',

		/* ---- a11y & chrome ---- */
		'Skip to main content': 'முக்கிய உள்ளடக்கத்திற்குச் செல்',
		'Privacy Policy': 'தனியுரிமைக் கொள்கை',
		'Terms & Conditions': 'விதிமுறைகள் & நிபந்தனைகள்',
		'Cookies & Local Data': 'குக்கீகள் & உள்ளூர் தரவு',
		'Legal': 'சட்டம்',
		'Email:': 'மின்னஞ்சல்:',
		'Phone:': 'தொலைபேசி:',
		'Last updated: 17 September 2026': 'கடைசியாகப் புதுப்பிக்கப்பட்டது: 17 செப்டம்பர் 2026',

		/* ---- events.html ---- */
		'Our Gatherings': 'எங்கள் கூட்டங்கள்',
		'Past Events': 'கடந்த கால நிகழ்வுகள்',
		'Recaps of recent events, retreats and celebrations at Vernon Memorial.': 'வெர்னான் மெமோரியலின் அண்மைக் கால நிகழ்வுகள், மாநாடுகள், கொண்டாட்டங்களின் சுருக்கங்கள்.',
		'Photos, videos and recaps of these concluded events are in the': 'இந்த நிறைவான நிகழ்வுகளின் புகைப்படங்கள், வீடியோக்கள், சுருக்கங்கள் இதில் உள்ளன:',
		'gallery': 'புகைப்படக் காட்சி',

		/* ---- index.html ---- */
		'Our Events': 'எங்கள் நிகழ்வுகள்',
		'Past & Featured': 'கடந்த கால & சிறப்பு',
		'Recent & featured events': 'சமீபகால & சிறப்பு நிகழ்வுகள்',
		'Look back at our recent gatherings and celebrations.': 'எங்கள் அண்மைக் கால கூட்டங்களையும் கொண்டாட்டங்களையும் திரும்பிப் பாருங்கள்.',
		'View Recap': 'சுருக்கத்தைக் காண',
		'View Souvenir': 'நினைவு மலரைக் காண',
		'Contact us by email to arrange your gift securely.': 'உங்கள் அன்பளிப்பை பாதுகாப்பாக ஏற்பாடு செய்ய மின்னஞ்சல் மூலம் எங்களைத் தொடர்பு கொள்ளுங்கள்.',
		'Email & Phone': 'மின்னஞ்சல் & தொலைபேசி',

		/* ---- myf.html ---- */
		'Look back at Youth Retreat 2024': 'இளைஞர் மாநாடு 2024-ஐ திரும்பிப் பாருங்கள்',

		/* ---- souvenir.html ---- */
		'Remembering 60 Years': '60 ஆண்டுகளை நினைவுகூரல்',
		'A Thank-You Moment': 'நன்றிக்குரிய ஒரு தருணம்',
		'The Souvenir Book was published as part of our 60th-anniversary celebrations. We thank everyone who contributed and shared their memories.': 'நினைவு மலர் எங்கள் 60 ஆண்டு விழா கொண்டாட்டத்தின் ஒரு பகுதியாக வெளியிடப்பட்டது. பங்களித்து தங்கள் நினைவுகளைப் பகிர்ந்த அனைவருக்கும் நன்றி.',

		/* ---- singapore-trip.html ---- */
		'Trip Recap': 'பயணச் சுருக்கம்',
		'Enjoy highlights from our 2024 trip to Singapore.': 'சிங்கப்பூருக்கான எங்கள் 2024 பயணத்தின் சிறப்புகளை ரசியுங்கள்.',
		'Trip Highlights': 'பயணச் சிறப்புகள்',
		'A look back at our Singapore trip': 'எங்கள் சிங்கப்பூர் பயணத்தைத் திரும்பிப் பார்த்தல்',
		'The 2024 Singapore trip has concluded. Watch our events page for future outings.': '2024 சிங்கப்பூர் பயணம் நிறைவடைந்தது. எதிர்கால பயணங்களுக்கு எங்கள் நிகழ்வுகள் பக்கத்தைக் கவனியுங்கள்.',

		/* ---- youth-retreat-2024.html ---- */
		'Youth Retreat 2024 — A Look Back': 'இளைஞர் மாநாடு 2024 — ஒரு திரும்பிப் பார்வை',
		'Two days of worship, the Word and fellowship. Revisit the highlights, memories and songs from our youth retreat.': 'இரண்டு நாட்கள் ஆராதனை, வார்த்தை, சகவாசம். எங்கள் இளைஞர் மாநாட்டின் சிறப்புகள், நினைவுகள், பாடல்களை மீண்டும் நினைவுகூருங்கள்.',
		'Watch Recap': 'சுருக்கத்தைக் காண',
		'Recap': 'சுருக்கம்',
		'Highlights of the Retreat': 'மாநாட்டின் சிறப்புகள்',
		'Some of what made the retreat special.': 'மாநாட்டைச் சிறப்பாக்கிய சில அம்சங்கள்.',
		'Wholesome meals were arranged throughout the retreat.': 'மாநாட்டின் முழுவதும் சத்தான உணவு ஏற்பாடு செய்யப்பட்டது.',

		/* ---- privacy.html ---- */
		'How we collect, use and protect your information.': 'உங்கள் தகவலை நாங்கள் எவ்வாறு சேகரிக்கிறோம், பயன்படுத்துகிறோம், பாதுகாக்கிறோம்.',
		'This website is operated by Vernon Memorial Methodist Tamil Church, Kalyan (located opposite SBI Bank, Kalyan–Murbad Road, Kalyan West, Maharashtra).': 'இந்த இணையதளம் வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண் மூலம் நிர்வகிக்கப்படுகிறது (எஸ்.பி.ஐ. வங்கிக்கு எதிரே, கல்யாண்–முர்பாத் சாலை, கல்யாண் மேற்கு, மகாராஷ்டிரம்).',
		'If you have any questions about this policy, you can contact us using the details below.': 'இந்தக் கொள்கை குறித்து ஏதேனும் கேள்விகள் இருந்தால், கீழே உள்ள விவரங்களைப் பயன்படுத்தி எங்களைத் தொடர்பு கொள்ளலாம்.',
		'What We Collect': 'நாங்கள் சேகரிப்பது',
		'Information you send us by email, phone or through the contact details on this website.': 'இந்த இணையதளத்தில் உள்ள தொடர்பு விவரங்கள் மூலம் நீங்கள் அனுப்பும் தகவல்.',
		'Information shared through Google Forms for our past events, trips and souvenir book, such as your name, contact number and address.': 'எங்கள் கடந்த கால நிகழ்வுகள், பயணங்கள், நினைவு மலருக்காக கூகுள் படிவங்கள் வழியாகப் பகிரப்பட்ட தகவல் — உங்கள் பெயர், தொலைபேசி எண், முகவரி போன்றவை.',
		'Your language preference, stored locally on your own device so the site remembers whether you read English or Tamil.': 'உங்கள் மொழி விருப்பம் — நீங்கள் ஆங்கிலமா அல்லது தமிழா வாசிக்கிறீர்கள் என்பதை இந்தத் தளம் நினைவில் வைத்திருக்க உங்கள் சாதனத்தில் உள்ளூரில் சேமிக்கப்படும்.',
		'Anonymous technical data your browser sends automatically, such as which pages you visit.': 'நீங்கள் பார்வையிடும் பக்கங்கள் போன்ற, உங்கள் உலாவி தானாக அனுப்பும் அடையாளம் தெரியாத தொழில்நுட்பத் தரவு.',
		'How We Use It': 'நாங்கள் அதை எவ்வாறு பயன்படுத்துகிறோம்',
		'We use the information you share with us to respond to your enquiries, keep you informed about church life, and administer events, trips and other activities.': 'உங்கள் விசாரணைகளுக்குப் பதிலளிக்கவும், திருச்சபை வாழ்க்கை குறித்து உங்களைத் தெரிவிக்கவும், நிகழ்வுகள், பயணங்கள், பிற செயல்பாடுகளை நிர்வகிக்கவும் நீங்கள் எங்களுடன் பகிர்ந்து கொள்ளும் தகவலைப் பயன்படுத்துகிறோம்.',
		'Third-Party Services': 'மூன்றாம் தரப்பு சேவைகள்',
		'Some parts of this website use third-party services, which have their own privacy policies and may process limited data such as your IP address:': 'இந்த இணையதளத்தின் சில பகுதிகள் மூன்றாம் தரப்பு சேவைகளைப் பயன்படுத்துகின்றன; அவற்றுக்கு தங்கள் சொந்த தனியுரிமைக் கொள்கைகள் உள்ளன, மேலும் உங்கள் IP முகவரி போன்ற வரம்புக்குட்பட்ட தரவை அவை செயலாக்கலாம்:',
		'Children in Our Gallery': 'எங்கள் புகைப்படக் காட்சியில் குழந்தைகள்',
		'Our gallery may include photos of children at church events. We share such photos only with the permission of their families.': 'எங்கள் புகைப்படக் காட்சியில் திருச்சபை நிகழ்வுகளில் குழந்தைகளின் புகைப்படங்கள் இருக்கலாம். அவற்றின் குடும்பங்களின் அனுமதியுடன் மட்டுமே அத்தகைய புகைப்படங்களை நாங்கள் பகிர்வோம்.',
		'If you are a parent or guardian and would like your child’s photo removed, please contact us using the details below. We will act on your request promptly.': 'நீங்கள் பெற்றோர் அல்லது பாதுகாவலராக இருந்து உங்கள் குழந்தையின் புகைப்படத்தை நீக்க விரும்பினால், கீழே உள்ள விவரங்களைப் பயன்படுத்தி எங்களைத் தொடர்பு கொள்ளுங்கள். உங்கள் கோரிக்கைக்கு விரைவாகச் செயல்படுவோம்.',
		'Your Rights': 'உங்கள் உரிமைகள்',
		'Under the Digital Personal Data Protection Act, 2023 of India, you have the right to access, correct and erase the personal information we hold about you, and to withdraw consent where consent is the basis of processing.': 'இந்திய தனிப்பட்ட தரவு பாதுகாப்புச் சட்டம் 2023-இன் கீழ், உங்களைப் பற்றி நாங்கள் வைத்திருக்கும் தனிப்பட்ட தகவலை அணுகவும், திருத்தவும், அழிக்கவும், ஏற்கனவே ஒப்புதல் அடிப்படையாக இருந்தால் அதைத் திரும்பப் பெறவும் உங்களுக்கு உரிமை உள்ளது.',
		'To exercise any of these rights, contact us using the details below.': 'இந்த உரிமைகளில் ஏதேனும் ஒன்றைப் பயன்படுத்த, கீழே உள்ள விவரங்களைப் பயன்படுத்தி எங்களைத் தொடர்பு கொள்ளுங்கள்.',
		'Cookies and Local Data': 'குக்கீகள் மற்றும் உள்ளூர் தரவு',
		'This website does not set tracking cookies. It stores only your language preference in your browser’s local storage.': 'இந்த இணையதளம் கண்காணிப்பு குக்கீகளை வைப்பதில்லை. உங்கள் உலாவியின் உள்ளூர் சேமிப்பில் உங்கள் மொழி விருப்பத்தை மட்டுமே சேமிக்கிறது.',
		'Read our': 'எங்கள்',
		'Cookie & Local Data policy': 'குக்கீ & உள்ளூர் தரவு கொள்கையை',
		'for full details.': 'முழு விவரங்களுக்கு.',
		'For any questions, requests or concerns, contact us:': 'கேள்விகள், கோரிக்கைகள், கவலைகள் ஏதேனும் இருந்தால், எங்களைத் தொடர்பு கொள்ளுங்கள்:',

		/* ---- terms.html ---- */
		'The terms that apply when you use this website.': 'இந்த இணையதளத்தை நீங்கள் பயன்படுத்தும்போது பொருந்தும் விதிமுறைகள்.',
		'Acceptance of Terms': 'விதிமுறைகளை ஏற்பது',
		'By using this website you agree to these terms. If you do not agree, please do not use the site.': 'இந்த இணையதளத்தைப் பயன்படுத்துவதன் மூலம் இந்த விதிமுறைகளை ஏற்கிறீர்கள். நீங்கள் ஒப்புக்கொள்ளவில்லை என்றால், இந்தத் தளத்தைப் பயன்படுத்த வேண்டாம்.',
		'About This Website': 'இந்த இணையதளத்தைப் பற்றி',
		'This website is provided by Vernon Memorial Methodist Tamil Church, Kalyan to share news, events and worship resources with our community and friends.': 'இந்த இணையதளம், எங்கள் சமூகத்துடனும் நண்பர்களுடனும் செய்திகள், நிகழ்வுகள், ஆராதனை வளங்களைப் பகிர, வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண் மூலம் வழங்கப்படுகிறது.',
		'Accuracy of Information': 'தகவலின் துல்லியம்',
		'We work to keep the information on this site accurate and current. Event details may change, and past events and trips are presented as records and recaps.': 'இந்தத் தளத்தில் உள்ள தகவலைத் துல்லியமாகவும் நடப்புடையதாகவும் வைத்திருக்க முயற்சிக்கிறோம். நிகழ்வு விவரங்கள் மாறக்கூடும்; கடந்த கால நிகழ்வுகளும் பயணங்களும் பதிவுகளாகவும் சுருக்கங்களாகவும் வழங்கப்படுகின்றன.',
		'External Links': 'வெளிப்புற இணைப்புகள்',
		'The site links to third-party websites such as YouTube, Facebook, Instagram, Google and Vercel. We are not responsible for the content or privacy practices of those sites.': 'இந்தத் தளம் YouTube, Facebook, Instagram, Google, Vercel போன்ற மூன்றாம் தரப்பு இணையதளங்களுக்கு இணைக்கிறது. அந்தத் தளங்களின் உள்ளடக்கம் அல்லது தனியுரிமை நடைமுறைகளுக்கு நாங்கள் பொறுப்பல்ல.',
		'Intellectual Property': 'அறிவுசார் சொத்து',
		'The text, design and photographs on this website belong to the Church or are used with permission. Photos of people are published with their families’ consent. Please contact us before reusing any content.': 'இந்த இணையதளத்தில் உள்ள உரை, வடிவமைப்பு, புகைப்படங்கள் திருச்சபைக்கு சொந்தமானவை அல்லது அனுமதியுடன் பயன்படுத்தப்படுகின்றன. மக்களின் புகைப்படங்கள் அவர்களின் குடும்பங்களின் ஒப்புதலுடன் வெளியிடப்படுகின்றன. எந்த உள்ளடக்கத்தையும் மீண்டும் பயன்படுத்துவதற்கு முன் எங்களைத் தொடர்பு கொள்ளுங்கள்.',
		'Donations are received offline through the church. This website does not collect payments or card details.': 'நன்கொடைகள் திருச்சபை மூலம் நேரடியாகப் பெறப்படுகின்றன. இந்த இணையதளம் கட்டணங்கள் அல்லது அட்டை விவரங்களைச் சேகரிப்பதில்லை.',
		'Limitation of Liability': 'பொறுப்பின் வரம்பு',
		'This website is provided as-is. To the extent permitted by law, the Church is not liable for any loss arising from your use of this website.': 'இந்த இணையதளம் அப்படியே வழங்கப்படுகிறது. சட்டம் அனுமதிக்கும் அளவிற்கு, இந்த இணையதளத்தைப் பயன்படுத்துவதால் ஏற்படும் எந்த இழப்பிற்கும் திருச்சபை பொறுப்பல்ல.',
		'Governing Law': 'நிர்வகிக்கும் சட்டம்',
		'These terms are governed by the laws of India. Any disputes are subject to the jurisdiction of the courts at Kalyan, Maharashtra.': 'இந்த விதிமுறைகள் இந்தியச் சட்டங்களால் நிர்வகிக்கப்படுகின்றன. ஏதேனும் தகராறுகள் கல்யாண், மகாராஷ்டிர நீதிமன்றங்களின் அதிகார வரம்பிற்கு உட்பட்டவை.',
		'For any questions about these terms, contact us:': 'இந்த விதிமுறைகள் குறித்து ஏதேனும் கேள்விகள் இருந்தால், எங்களைத் தொடர்பு கொள்ளுங்கள்:',

		/* ---- cookies.html ---- */
		'Cookie & Local Data Policy': 'குக்கீ & உள்ளூர் தரவு கொள்கை',
		'What this website stores on your device, and why.': 'இந்த இணையதளம் உங்கள் சாதனத்தில் எதைச் சேமிக்கிறது, ஏன்.',
		'No Tracking Cookies': 'கண்காணிப்பு குக்கீகள் இல்லை',
		'This website does not use cookies for advertising, analytics, or tracking.': 'இந்த இணையதளம் விளம்பரம், பகுப்பாய்வு அல்லது கண்காணிப்புக்கு குக்கீகளைப் பயன்படுத்துவதில்லை.',
		'The only item this site stores on your device is your language choice. It is kept in your browser’s local storage under the name "vmmtc.lang", so we can show this site in the language you prefer. This is essential for the site to work, and it is never shared with anyone.': 'இந்தத் தளம் உங்கள் சாதனத்தில் சேமிக்கும் ஒரே விஷயம் உங்கள் மொழித் தேர்வு. அது "vmmtc.lang" என்ற பெயரில் உங்கள் உலாவியின் உள்ளூர் சேமிப்பில் வைக்கப்படுகிறது — நீங்கள் விரும்பும் மொழியில் இந்தத் தளத்தைக் காட்டுவதற்காக. தளம் செயல்பட இது அவசியம், மேலும் இது யாருடனும் பகிரப்படுவதில்லை.',
		'Third-Party Content': 'மூன்றாம் தரப்பு உள்ளடக்கம்',
		'Some pages load content from third parties, which may use their own cookies or similar technologies:': 'சில பக்கங்கள் மூன்றாம் தரப்பினரிடமிருந்து உள்ளடக்கத்தை ஏற்றுகின்றன; அவை தங்கள் சொந்த குக்கீகள் அல்லது ஒத்த தொழில்நுட்பங்களைப் பயன்படுத்தலாம்:',
		'Please review each service’s own policy for details on how it handles your data.': 'உங்கள் தரவை அது எவ்வாறு கையாள்கிறது என்பதற்கான விவரங்களுக்கு ஒவ்வொரு சேவையின் சொந்தக் கொள்கையையும் பார்க்கவும்.',
		'Managing Local Data': 'உள்ளூர் தரவை நிர்வகித்தல்',
		'You can clear your language choice at any time through your browser’s settings, where you can view and remove the data stored by websites. If you remove it, this site will return to English.': 'உங்கள் உலாவியின் அமைப்புகளில், இணையதளங்கள் சேமித்த தரவைக் காணவும் அகற்றவும் கூடிய இடத்தில், உங்கள் மொழித் தேர்வை எப்போது வேண்டுமானாலும் அழிக்கலாம். அதை அகற்றினால், இந்தத் தளம் ஆங்கிலத்திற்குத் திரும்பும்.',
		'Updates and Contact': 'புதுப்பிப்புகள் & தொடர்பு',
		'We may update this policy occasionally. The date above shows when it was last updated.': 'இந்தக் கொள்கையை அவ்வப்போது புதுப்பிக்கலாம். கடைசியாக எப்போது புதுப்பிக்கப்பட்டது என்பதை மேலே உள்ள தேதி காட்டுகிறது.',
		'For questions, contact us:': 'கேள்விகளுக்கு, எங்களைத் தொடர்பு கொள்ளுங்கள்:'
	};

	/* ------------------------------------------------------------------
	   Per-page Tamil <title> and meta description.
	   ------------------------------------------------------------------ */
	var PAGE_TA = {
		'index.html': {
			title: 'வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண்',
			desc: 'வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண் — தேவனுடைய வார்த்தையின் அறிவைக் கற்றல், பயிற்சி செய்தல், பரப்புதல் ஆகியவற்றில் அர்ப்பணிக்கப்பட்ட சமூகம். ஒவ்வொரு ஞாயிற்றுக்கிழமையும் காலை 7:30 மணிக்கு எங்களோடு இணையுங்கள்.'
		},
		'about_us.html': {
			title: 'நாங்கள் யார் - வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண்',
			desc: 'எங்கள் திருச்சபையின் வரலாறு, ஊழியங்கள், சமுதாய ஈடுபாடு பற்றி அறிந்துகொள்ளுங்கள். வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண்.'
		},
		'ministries.html': {
			title: 'ஊழியங்கள் - வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண்',
			desc: 'வெர்னான் மெமோரியலின் ஊழியங்கள் — டபிள்யூ.சி.எஸ்.எஸ், மெதடிஸ்ட் ஆண்கள், எம்.ஒய்.எஃப், ஞாயிறு பள்ளி. உங்கள் வளர்ச்சிக்கும், ஊழியத்திற்கும் இணைவதற்கும் இடம் கண்டறியுங்கள்.'
		},
		'wcss.html': {
			title: 'டபிள்யூ.சி.எஸ்.எஸ் - மகளிர் கிறிஸ்தவ சேவை சங்கம் - வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண்',
			desc: 'மகளிர் கிறிஸ்தவ சேவை சங்கம் (டபிள்யூ.சி.எஸ்.எஸ்) — வெர்னான் மெமோரியலின் மகளிர் சகவாசம்: ஜெபம், ஊழியம், விசுவாசம்.'
		},
		'methodist-men.html': {
			title: 'மெதடிஸ்ட் ஆண்கள் - வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண்',
			desc: 'வெர்னான் மெமோரியலின் ஆண்கள் சகவாசம் — விசுவாசம், குணம், ஊழியத்தில் வளரும் ஆண்கள்.'
		},
		'myf.html': {
			title: 'எம்.ஒய்.எஃப் - மெதடிஸ்ட் இளைஞர் சகவாசம் - வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண்',
			desc: 'மெதடிஸ்ட் இளைஞர் சகவாசம் (எம்.ஒய்.எஃப்) — விசுவாசத்தில் வளர்ந்து நாளைய திருச்சபையை வழிநடத்தும் இளைஞர்கள்.'
		},
		'sunday-school.html': {
			title: 'ஞாயிறு பள்ளி - வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண்',
			desc: '5 முதல் 15 வயது வரையிலான குழந்தைகளுக்கு தேவனுடைய அற்புதமான வார்த்தையைக் கற்பிக்கும் எங்கள் ஞாயிறு பள்ளி.'
		},
		'events.html': {
			title: 'நிகழ்வுகள் - வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண்',
			desc: 'வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாணின் நிறைவான நிகழ்வுகள்: இளைஞர் மாநாடு 2024, சிங்கப்பூர் பயணம், நினைவு மலர். புகைப்படங்கள், வீடியோக்கள், சுருக்கங்கள்.'
		},
		'gallery.html': {
			title: 'புகைப்படக் காட்சி - வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண்',
			desc: 'வெர்னான் மெமோரியலின் ஆராதனை, சகவாசம், மகிழ்ச்சியின் தருணங்கள் — புகைப்படங்கள் மற்றும் வீடியோக்கள்.'
		},
		'souvenir.html': {
			title: 'நினைவு மலர் - 60 ஆண்டுகள் - வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண்',
			desc: 'வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாணின் 60 ஆண்டு விழாவைக் கொண்டாடி வெளியிடப்பட்ட நினைவு மலர். பங்களித்த அனைவருக்கும் நன்றி.'
		},
		'login.html': {
			title: 'உள்நுழைவு - உறுப்பினர் வலைவாசல் - வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண்',
			desc: 'வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபையின் உறுப்பினர் வலைவாசலில் உள்நுழையுங்கள்.'
		},
		'songs.html': {
			title: 'இளைஞர் மாநாடு 2024 - பாடல்கள் - வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண்',
			desc: 'இளைஞர் மாநாடு 2024 பாடல்கள் — வரிகளோடு! வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண்.'
		},
		'youth-retreat-2024.html': {
			title: 'இளைஞர் மாநாடு 2024 - வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண்',
			desc: 'வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாணின் இளைஞர் மாநாடு 2024 — இரண்டு நாட்கள் ஆராதனை, வார்த்தை, சகவாசம். சிறப்புகள், நினைவுகள், பாடல்கள்.'
		},
		'youth-retreat-2024-songs.html': {
			title: 'இளைஞர் மாநாடு 2024 - பாடல்கள் - வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண்',
			desc: 'இளைஞர் மாநாடு 2024 பாடல்கள் — வரிகளோடு பாடுங்கள்! வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண்.'
		},
		'singapore-trip.html': {
			title: 'சிங்கப்பூர் பயணம் - வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண்',
			desc: 'வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாணின் சிங்கப்பூர் பயணம் 2024 — பயணத்தின் சிறப்புகள் மற்றும் நினைவுகள்.'
		},
		'privacy.html': {
			title: 'தனியுரிமைக் கொள்கை - வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண்',
			desc: 'நாங்கள் உங்கள் தகவலை எவ்வாறு சேகரிக்கிறோம், பயன்படுத்துகிறோம், பாதுகாக்கிறோம் — வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண்.'
		},
		'terms.html': {
			title: 'விதிமுறைகள் & நிபந்தனைகள் - வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண்',
			desc: 'இந்த இணையதளத்தைப் பயன்படுத்துவதற்கான விதிமுறைகள் — வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண்.'
		},
		'cookies.html': {
			title: 'குக்கீ & உள்ளூர் தரவு கொள்கை - வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண்',
			desc: 'இந்த இணையதளம் உங்கள் சாதனத்தில் சேமிப்பது குறித்த கொள்கை — வெர்னான் மெமோரியல் மெதடிஸ்ட் தமிழ்த் திருச்சபை, கல்யாண்.'
		}
	};

	/* ------------------------------------------------------------------ */
	var meta = document.querySelector('meta[name="description"]');
	var origTitle = document.title;
	var origDesc = meta ? meta.content : '';

	function loadLang() {
		try {
			var v = localStorage.getItem(LANG_KEY);
			if (v === 'ta') return 'ta';
		} catch (e) {}
		return 'en';
	}

	function saveLang(l) {
		try { localStorage.setItem(LANG_KEY, l); } catch (e) {}
	}

	/* ---- Dictionary fallback engine (offline / widget blocked) ---- */
	function skippedNode(node) {
		for (var el = node.parentElement; el && el !== document.body; el = el.parentElement) {
			if (el.getAttribute && el.getAttribute('data-no-i18n') !== null) return true;
		}
		return false;
	}

	function translateNode(node) {
		var v = node.nodeValue;
		var lead = (v.match(/^\s+/) || [''])[0];
		var trail = (v.match(/\s+$/) || [''])[0];
		var key = v.replace(/\u00A0/g, ' ').trim();
		if (!key || !T.hasOwnProperty(key)) return;
		if (node._i18nOrig === undefined) node._i18nOrig = v;
		node.nodeValue = lead + T[key] + trail;
	}

	function restoreNode(node) {
		if (node._i18nOrig !== undefined) node.nodeValue = node._i18nOrig;
	}

	function collectNodes() {
		var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
		var nodes = [];
		var node;
		while ((node = walker.nextNode())) {
			if (!node.nodeValue || !node.nodeValue.trim()) continue;
			if (/^[\s\d\W]+$/.test(node.nodeValue.trim()) && !/[A-Za-z\u00C0-\u024F]/.test(node.nodeValue)) continue;
			if (skippedNode(node)) continue;
			nodes.push(node);
		}
		return nodes;
	}

	var textNodes = null;

	function applyDictionary(lang) {
		if (!textNodes) textNodes = collectNodes();
		textNodes.forEach(function (n) {
			if (lang === 'ta') translateNode(n);
			else restoreNode(n);
		});
		var inputs = document.querySelectorAll('input, textarea');
		Array.prototype.forEach.call(inputs, function (el) {
			if (skippedNode(el)) return;
			if (el._i18nOrigPh === undefined) el._i18nOrigPh = el.getAttribute('placeholder');
			var ph = el.getAttribute('placeholder');
			if (!ph) return;
			if (lang === 'ta') {
				var key = ph.replace(/\u00A0/g, ' ').trim();
				if (key && T.hasOwnProperty(key)) el.setAttribute('placeholder', T[key]);
			} else {
				el.setAttribute('placeholder', el._i18nOrigPh);
			}
		});
	}

	function setPageMeta(lang) {
		var file = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
		var p = PAGE_TA[file] || PAGE_TA['index.html'];
		if (lang === 'ta') {
			document.documentElement.lang = 'ta';
			document.title = p.title;
			if (meta) meta.content = p.desc;
		} else {
			document.documentElement.lang = 'en';
			document.title = origTitle;
			if (meta) meta.content = origDesc;
		}
	}

	function setActiveSegs(lang) {
		var segs = document.querySelectorAll('.lang-switch__seg');
		Array.prototype.forEach.call(segs, function (seg) {
			seg.classList.toggle('lang-switch__seg--active', seg.getAttribute('data-lang') === lang);
		});
	}

	/* ---- Google website-translate widget helpers ---- */
	function markNotranslate(el) {
		if (el && el.classList && !el.classList.contains('notranslate')) el.classList.add('notranslate');
	}

	/* Brand names, the switcher and dynamic lyric/gallery zones keep their
	   own text (Google honours the "notranslate" class). */
	function protectNotranslate() {
		var sels = [
			'[data-no-i18n]',
			'#lyricsTitle',
			'#lyricsText',
			'#songNav',
			'#masonry',
			'#galleryCount'
		].join(',');
		Array.prototype.forEach.call(document.querySelectorAll(sels), markNotranslate);
		if (!('MutationObserver' in window)) return;
		var guard = '#lyricsTitle, #lyricsText, .song-btn';
		new MutationObserver(function (mutations) {
			mutations.forEach(function (m) {
				Array.prototype.forEach.call(m.addedNodes, function (node) {
					if (!node || node.nodeType !== 1) return;
					if (node.matches && node.matches(guard)) markNotranslate(node);
					if (node.querySelectorAll) {
						Array.prototype.forEach.call(node.querySelectorAll(guard), markNotranslate);
					}
				});
			});
		}).observe(document.body, { childList: true, subtree: true });
	}

	function findCombo() {
		return document.querySelector('select.goog-te-combo');
	}

	function widgetReady() {
		return widgetState === 'ready' && !!findCombo();
	}

	function isTranslated() {
		return document.documentElement.classList.contains('translated-ltr');
	}

	function triggerWidget(lang) {
		var combo = findCombo();
		if (!combo) return false;
		combo.value = lang;
		combo.dispatchEvent(new Event('change'));
		return true;
	}

	function bootWidget() {
		if (widgetBooted) return;
		widgetBooted = true;
		if (navigator.onLine === false) { widgetState = 'failed'; return; }
		if (!document.querySelector('.lang-switch')) { widgetState = 'failed'; return; }
		widgetState = 'loading';

		var holder = document.createElement('div');
		holder.id = 'google_translate_element';
		holder.setAttribute('aria-hidden', 'true');
		holder.style.cssText = 'position:absolute;left:-9999px;top:0;width:1px;height:0;overflow:hidden;';
		document.body.appendChild(holder);

		window[GT_CALLBACK] = function () {
			try {
				new google.translate.TranslateElement({
					pageLanguage: 'en',
					includedLanguages: GT_TARGET,
					autoDisplay: false,
					layout: google.translate.TranslateElement.InlineLayout.SIMPLE
				}, 'google_translate_element');
			} catch (e) {}
		};

		var s = document.createElement('script');
		s.src = GT_URL;
		s.async = true;
		s.onload = function () {
			window.setTimeout(function () {
				if (findCombo()) widgetState = 'ready';
				reconcileAfterBoot();
			}, 150);
		};
		s.onerror = function () { widgetState = 'failed'; };
		document.body.appendChild(s);

		window.setTimeout(function () {
			if (widgetState === 'loading') {
				widgetState = findCombo() ? 'ready' : 'failed';
				reconcileAfterBoot();
			}
		}, WIDGET_TIMEOUT);
	}

	/* Keep our localStorage state in charge, overriding Google's "googtrans"
	   cookie whenever the two disagree after the widget boots. */
	function reconcileAfterBoot() {
		if (bootReconciled || !widgetReady()) return;
		bootReconciled = true;
		var desired = loadLang();
		var translated = isTranslated();
		if (desired === 'ta' && !translated) triggerWidget('ta');
		else if (desired !== 'ta' && translated) triggerWidget('en');
	}

	function finishApply(lang) {
		if (lang === 'ta') {
			document.documentElement.setAttribute('data-lang', 'ta');
			document.documentElement.classList.add('i18n-ready');
		} else {
			document.documentElement.removeAttribute('data-lang');
			document.documentElement.classList.remove('i18n-ready');
		}
		setPageMeta(lang);
		setActiveSegs(lang);
		document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang: lang } }));
	}

	function finishWidget(lang, root) {
		root.classList.remove('lang-switching');
		finishApply(lang);
	}

	/* Google applies the translation asynchronously after the combo change;
	   finalise once the <html> class tells us it is done (or a failsafe
	   timer releases the fade regardless). */
	var classObserver = null;
	function watchTranslated() {
		if (classObserver || !('MutationObserver' in window)) return;
		var lastSeen = isTranslated();
		classObserver = new MutationObserver(function () {
			var now = isTranslated();
			if (now === lastSeen) return;
			lastSeen = now;
			var lang = now ? 'ta' : 'en';
			if (lang !== loadLang()) return;
			finishWidget(lang, document.documentElement);
		});
		classObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
	}

	function dictionaryApply(lang, root) {
		applyDictionary(lang);
		root.classList.remove('lang-switching');
		finishApply(lang);
	}

	var applyToken = 0;
	var SWITCH_MS = 220;

	function waitForWidget(cb) {
		var started = Date.now();
		(function poll() {
			if (widgetState === 'ready' || widgetState === 'failed') { cb(widgetState === 'ready'); return; }
			if (Date.now() - started > WIDGET_TIMEOUT) { widgetState = 'failed'; cb(false); return; }
			window.setTimeout(poll, 100);
		})();
	}

	function widgetApply(lang, root, token) {
		watchTranslated();
		if (!triggerWidget(lang)) { dictionaryApply(lang, root); return; }
		var done = false;
		var finish = function () {
			if (done) return;
			done = true;
			if (token !== applyToken) return;
			finishWidget(lang, root);
		};
		if (isTranslated() === (lang === 'ta')) {
			window.setTimeout(finish, 80);
			return;
		}
		window.setTimeout(finish, TRANSLATE_TIMEOUT);
	}

	function applyOne(lang, root, token) {
		if (widgetState === 'loading') {
			waitForWidget(function (ready) {
				if (token !== applyToken) return;
				if (ready) widgetApply(lang, root, token);
				else dictionaryApply(lang, root);
			});
		} else if (widgetReady()) {
			widgetApply(lang, root, token);
		} else {
			dictionaryApply(lang, root);
		}
	}

	function apply(lang) {
		var root = document.documentElement;
		var token = ++applyToken;
		root.classList.add('lang-switching');
		window.setTimeout(function () {
			if (token !== applyToken) return;
			applyOne(lang, root, token);
		}, SWITCH_MS);
	}

	function setLanguage(lang) {
		if (LANGS.indexOf(lang) === -1) lang = 'en';
		saveLang(lang);
		apply(lang);
	}

	function bindSwitches() {
		Array.prototype.forEach.call(document.querySelectorAll('.lang-switch'), function (btn) {
			btn.addEventListener('click', function (ev) {
				var seg = ev.target.closest ? ev.target.closest('.lang-switch__seg') : null;
				var desired = seg ? seg.getAttribute('data-lang') : (loadLang() === 'ta' ? 'en' : 'ta');
				if (desired !== loadLang()) setLanguage(desired);
			});
		});
	}

	function init() {
		protectNotranslate();
		bindSwitches();
		bootWidget();
		if (loadLang() === 'ta') apply('ta');
	}

	window.I18N = {
		get: function (key, args) {
			var base = T[key] !== undefined ? T[key] : ('__missing__' === key ? '' : key);
			if (args) {
				Object.keys(args).forEach(function (k) {
					base = base.replace(new RegExp('\\{' + k + '\\}', 'g'), args[k]);
				});
			}
			return base;
		},
		lang: function () { return loadLang(); }
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();