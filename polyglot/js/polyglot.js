/* polyglot.js  */

var jsVersion = 9;

function resetIt()
{
	$.removeCookie("theSource", { path: '/' });
	$.removeCookie("languages", { path: '/' });
	window.location.reload(true);

}

var debug = null;
var polyglotClipboard = null;

function httpGetAsync(theUrl, callback, theLabel, targetLang)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText, theLabel, targetLang);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}


function processWebserviceResult(theResponseText, theLabel, targetLang)
{
	var oldString = theResponseText;
    var filtered = oldString.replace(/,+/g, ','); 
	var jsonObject = $.parseJSON(filtered);
	var translationResult = jsonObject[0][0][0];
	debug = jsonObject;
	var speakGUI = "";
	if (languages[targetLang].voice)
	{ speakGUI = " <input onclick='responsiveVoice.speak(\""+
	  translationResult+"\", \""+
	  languages[targetLang].voice+"\");' type='button' value='&#9658; Play' />";
	}
	//var copyGUI = "<button class='polyglotButton' "+
	//	" data-clipboard-target='#theText4"+targetLang+"' >Copy to clipboard</button>";

	var copyGUI = "<input class='polyglotButton' "+
		" data-clipboard-target='#theText4"+targetLang+"' type='button' value='Copy to clipboard' >";
	$("#msgid").append("<br>\n"+theLabel+": <span class='theText' id='theText4"+targetLang+"'>"+
		translationResult+"</span>"+speakGUI+copyGUI);
		
	if (Clipboard.isSupported())
	{
    	$("#copyButton2").show();
	}
}

function translateIt(sourceLang, targetLang, theLabel)
{
		 var sourceText = $("input#theSource").val();
		 var theURL4G = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" 
		            + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);          
		 httpGetAsync(theURL4G, processWebserviceResult, theLabel, targetLang);

}

function Language(urlParameter, labelInEnglish, isSource, voice) {
  this.urlParameter = urlParameter;
  this.labelInEnglish = labelInEnglish;
  this.isSource = isSource;
  this.voice = voice;
  //if (!voice)
  //{ this.voice = "US English Female"; }
}

function drawSourceSelector()
{
var counter=0;
$("#sourceSelector").html("");
$("#removeSelector").html("<optgroup disabled hidden></optgroup>");
$("#addSelector").html("<optgroup disabled hidden></optgroup>");

	for (theKey in languages)
	{
	  	var oneLanguage = languages[theKey];
			var checkedSnippet = "";
			if  (oneLanguage.isSource)
			{ checkedSnippet = " checked='checked' "; }
			$("#sourceSelector").append(
			 "<input type='radio' name='sourceRadio' value='"+
			 oneLanguage.urlParameter+"'"+
			 " id='radio"+counter+"' "+checkedSnippet+">"+
			 "<label for='radio"+counter+"'>"+
			 oneLanguage.labelInEnglish +
			  "</label> | ");
		  
		  $("#removeSelector").append($("<option>", { 
			  value: oneLanguage.urlParameter,
			  text: oneLanguage.labelInEnglish
		  })); 
		
		
		counter++;
		
	};	
	for (theKey in allLanguages)
	{
		var oneLanguage = allLanguages[theKey];

		// if exists in (current) languages then don't add to all languages
		if (languages[theKey])
		{ continue; }
		$("#addSelector").append($("<option>", { 
			  value: oneLanguage.urlParameter,
			  text: oneLanguage.labelInEnglish
		}));
		counter++;	
	};
	$("#addSelector").scrollTop(8888);

	
	$('input[type=radio][name=sourceRadio]').change(function() {
    
    	var theKey = ""+this.value;
    	// current one is no longer source
    	languages[currentLanguage.urlParameter].isSource = false;
	    // new current should be source (for displaying, maybe redundant?)
	    languages[theKey].isSource = true;
    	// set new current 	
    	currentLanguage = languages[theKey];
        $("#sourceLanguage").html(currentLanguage.labelInEnglish);
       
    });

} // drawSourceSelector() 

var languages = {};// new Array();
var allLanguages = {};// new Array();
var currentLanguage = (new Language("en","English", true, false));

$(document).ready(function(){


	allLanguages["af"] = (new Language("af","Afrikaans", false));
	allLanguages["sq"] = (new Language("sq","Albanian", false));
	allLanguages["am"] = (new Language("am","Amharic", false));
	allLanguages["ar"] = (new Language("ar","Arabic", false));
	allLanguages["hy"] = (new Language("hy","Armenian", false));
	allLanguages["az"] = (new Language("az","Azerbaijani", false));
	allLanguages["eu"] = (new Language("eu","Basque", false));
	allLanguages["be"] = (new Language("be","Belarusian", false));
	allLanguages["bn"] = (new Language("bn","Bengali", false));
	allLanguages["bs"] = (new Language("bs","Bosnian", false));
	allLanguages["bg"] = (new Language("bg","Bulgarian", false));
	allLanguages["ca"] = (new Language("ca","Catalan", false));
	allLanguages["ceb"] = (new Language("ceb","Cebuano", false));
	allLanguages["ny"] = (new Language("ny","Chichewa", false));
	allLanguages["zh-CN"] = (new Language("zh-CN","Chinese", false));
	allLanguages["co"] = (new Language("co","Corsican", false));
	allLanguages["hr"] = (new Language("hr","Croatian", false));
	allLanguages["cs"] = (new Language("cs","Czech", false));
	allLanguages["da"] = (new Language("da","Danish", false));
	allLanguages["nl"] = (new Language("nl","Dutch", false, "Dutch Female"));
	allLanguages["en"] = (new Language("en","English", true, "US English Female"));
	allLanguages["eo"] = (new Language("eo","Esperanto", false));
	allLanguages["et"] = (new Language("et","Estonian", false));
	allLanguages["tl"] = (new Language("tl","Filipino", false));
	allLanguages["fi"] = (new Language("fi","Finnish", false, "Finnish Female"));
	allLanguages["fr"] = (new Language("fr","French", false, "French Female"));
	allLanguages["fy"] = (new Language("fy","Frisian", false));
	allLanguages["gl"] = (new Language("gl","Galician", false));
	allLanguages["ka"] = (new Language("ka","Georgian", false));
	allLanguages["de"] = (new Language("de","German", false, "Deutsch Female"));
	allLanguages["el"] = (new Language("el","Greek", false, "Greek Female"));
	allLanguages["gu"] = (new Language("gu","Gujarati", false));
	allLanguages["ht"] = (new Language("ht","Haitian Creole", false));
	allLanguages["ha"] = (new Language("ha","Hausa", false));
	allLanguages["haw"] = (new Language("haw","Hawaiian", false));
	allLanguages["iw"] = (new Language("iw","Hebrew", false));
	allLanguages["hi"] = (new Language("hi","Hindi", false));
	allLanguages["hmn"] = (new Language("hmn","Hmong", false));
	allLanguages["hu"] = (new Language("hu","Hungarian", false));
	allLanguages["is"] = (new Language("is","Icelandic", false));
	allLanguages["ig"] = (new Language("ig","Igbo", false));
	allLanguages["id"] = (new Language("id","Indonesian", false));
	allLanguages["ga"] = (new Language("ga","Irish", false));
	allLanguages["it"] = (new Language("it","Italian", false, "Italian Female"));
	allLanguages["ja"] = (new Language("ja","Japanese", false, "Japanese Female"));
	allLanguages["jw"] = (new Language("jw","Javanese", false));
	allLanguages["kn"] = (new Language("kn","Kannada", false));
	allLanguages["kk"] = (new Language("kk","Kazakh", false));
	allLanguages["km"] = (new Language("km","Khmer", false));
	allLanguages["ko"] = (new Language("ko","Korean", false));
	allLanguages["ku"] = (new Language("ku","Kurdish (Kurmanji)", false));
	allLanguages["ky"] = (new Language("ky","Kyrgyz", false));
	allLanguages["lo"] = (new Language("lo","Lao", false));
	allLanguages["la"] = (new Language("la","Latin", false));
	allLanguages["lv"] = (new Language("lv","Latvian", false));
	allLanguages["lt"] = (new Language("lt","Lithuanian", false));
	allLanguages["lb"] = (new Language("lb","Luxembourgish", false));
	allLanguages["mk"] = (new Language("mk","Macedonian", false));
	allLanguages["mg"] = (new Language("mg","Malagasy", false));
	allLanguages["ms"] = (new Language("ms","Malay", false));
	allLanguages["ml"] = (new Language("ml","Malayalam", false));
	allLanguages["mt"] = (new Language("mt","Maltese", false));
	allLanguages["mi"] = (new Language("mi","Maori", false));
	allLanguages["mr"] = (new Language("mr","Marathi", false));
	allLanguages["mn"] = (new Language("mn","Mongolian", false));
	allLanguages["my"] = (new Language("my","Myanmar (Burmese)", false));
	allLanguages["ne"] = (new Language("ne","Nepali", false));
	allLanguages["no"] = (new Language("no","Norwegian", false));
	allLanguages["ps"] = (new Language("ps","Pashto", false));
	allLanguages["fa"] = (new Language("fa","Persian", false));
	allLanguages["pl"] = (new Language("pl","Polish", false, "Polish Female"));
	allLanguages["pt"] = (new Language("pt","Portuguese", false));
	allLanguages["pa"] = (new Language("pa","Punjabi", false));
	allLanguages["ro"] = (new Language("ro","Romanian", false));
	allLanguages["ru"] = (new Language("ru","Russian", false, "Russian Female"));
	allLanguages["sm"] = (new Language("sm","Samoan", false));
	allLanguages["gd"] = (new Language("gd","Scots Gaelic", false));
	allLanguages["sr"] = (new Language("sr","Serbian", false));
	allLanguages["st"] = (new Language("st","Sesotho", false));
	allLanguages["sn"] = (new Language("sn","Shona", false));
	allLanguages["sd"] = (new Language("sd","Sindhi", false));
	allLanguages["si"] = (new Language("si","Sinhala", false));
	allLanguages["sk"] = (new Language("sk","Slovak", false));
	allLanguages["sl"] = (new Language("sl","Slovenian", false));
	allLanguages["so"] = (new Language("so","Somali", false));
	allLanguages["es"] = (new Language("es","Spanish", false, "Spanish Female"));
	allLanguages["su"] = (new Language("su","Sundanese", false));
	allLanguages["sw"] = (new Language("sw","Swahili", false));
	allLanguages["sv"] = (new Language("sv","Swedish", false));
	allLanguages["tg"] = (new Language("tg","Tajik", false));
	allLanguages["ta"] = (new Language("ta","Tamil", false));
	allLanguages["te"] = (new Language("te","Telugu", false));
	allLanguages["th"] = (new Language("th","Thai", false));
	allLanguages["tr"] = (new Language("tr","Turkish", false, "Turkish Female"));
	allLanguages["uk"] = (new Language("uk","Ukrainian", false));
	allLanguages["ur"] = (new Language("ur","Urdu", false));
	allLanguages["uz"] = (new Language("uz","Uzbek", false));
	allLanguages["vi"] = (new Language("vi","Vietnamese", false));
	allLanguages["cy"] = (new Language("cy","Welsh", false));
	allLanguages["xh"] = (new Language("xh","Xhosa", false));
	allLanguages["yi"] = (new Language("yi","Yiddish", false));
	allLanguages["yo"] = (new Language("yo","Yoruba", false));
	allLanguages["zu"] = (new Language("zu","Zulu", false));
	

$('#theSource').on('input', function() {
    // do something
    $.cookie('theSource', $("#theSource").val(), { expires: 8, path: '/' });
    // $("#msgid").append("<br>changed to '"+$("#theSource").val()+"'");
});


if (Clipboard.isSupported())
{
    $("#copyButton").show();
}

if ($.cookie("theSource"))
{
	$("#theSource").val($.cookie("theSource"));
}


if ($.cookie("languages"))
{ // take from cookie
	var json_str = $.cookie("languages");
	languages = JSON.parse(json_str);
}
else 
{ // hard-corded, take from code
	languages["en"] = allLanguages["en"];
	languages["pl"] = allLanguages["pl"];
	languages["ru"] = allLanguages["ru"];
	languages["de"] = allLanguages["de"];
}

$("#theSource").keyup(function(event){
    if(event.keyCode == 13){
        $("#btn").click();
    }
});

// translation
$('#btn').on('click', function(){

//var voicelist = responsiveVoice.getVoices();
// var json_str = JSON.stringify(voicelist);
    $("#msgid").html("");
        //$("#msgid").html(""+json_str);
	var sourceText = $("input#theSource").val();
	var speakGUI = "";
	var targetLang = currentLanguage.urlParameter;
	if (allLanguages[targetLang].voice)
	{ speakGUI = " <input onclick='responsiveVoice.speak(\""+
	  sourceText+"\", \""+
	  allLanguages[targetLang].voice+"\");' type='button' value='&#9658; Play' />";
	  }
	
	$("#msgid").append("<br>"+currentLanguage.labelInEnglish+": "+sourceText+speakGUI);

	//languages.forEach( function( oneLanguage )
	for (theKey in languages)
	{
		var oneLanguage = languages[theKey];
	    if  (oneLanguage.isSource)
	    { continue; }
		translateIt(currentLanguage.urlParameter,oneLanguage.urlParameter,
			oneLanguage.labelInEnglish, sourceText);
	};
		
	
}); // on click 

$('#clearButton').on('click', function(){
// 	$("#msgid").append("<br>clear button clicked");	
	$("input#theSource").val("");
	document.getElementById("theSource").focus();
});



$('#copyButton').on('click', function(){
// 	$("#msgid").append("<br>copy button clicked");	
	//$("input#theSource").val();
});

$('#removeButton').on('click', function(){ //======================>

//$("#msgid").append("<br>removing ");
$("#removeSelector option:selected").each( function(){
 var val2remove = $(this).val();
  //$("#msgid").append("<br>removing : "+val2remove);	
  delete languages[val2remove];
});


var json_str = JSON.stringify(languages);
$.cookie("languages", json_str, { expires: 8, path: '/' });


for (theKey in languages)
{
   languages[theKey].isSource = true;
   currentLanguage = languages[theKey];
   $("#sourceLanguage").html(currentLanguage.labelInEnglish);       
   break;// we pick first one
}
drawSourceSelector();

}); // on click 2 - remove button

$('#addButton').on('click', function(){ //======================>
//$("#msgid").append("<br>adding ");
$("#addSelector option:selected").each( function(){
  var val2add = $(this).val();
  //$("#msgid").append("<br>adding: "+val2add);	
  allLanguages[val2add].isSource = false;
  var oneLanguage = allLanguages[val2add];
  languages[val2add] = oneLanguage;
  delete allLanguages[val2add];

});

var json_str = JSON.stringify(languages);
$.cookie("languages", json_str, { expires: 8, path: '/' });


for (theKey in languages)
{
   languages[theKey].isSource = true;
   currentLanguage = languages[theKey];
   $("#sourceLanguage").html(currentLanguage.labelInEnglish);       
   break;// we pick first one
}
drawSourceSelector();

}); // on click 3 - add button


drawSourceSelector()

polyglotClipboard = new Clipboard('.polyglotButton',{
    text: function(trigger) {
		return $($(trigger).attr("data-clipboard-target")).text();
    }});
polyglotClipboard.on('success',
   function(e)
   {
	e.clearSelection();
	//console.info('Action:',e.action);
	//console.info('Text:',e.text);
	//console.info('Trigger:',e.trigger);
	//showTooltip(e.trigger,'Copied!');
});
	
	
$("#jsVersion").html(""+jsVersion);

}); // end of .ready()

/*
new Clipboard('.btn', {
    text: function(trigger) {
        return trigger.getAttribute('aria-label');
    }
});
*/