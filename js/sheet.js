var workbook;
var excelIO;
var achternaam = "A";

/** Dietary advice taken **/
var voorOntbijtGegeten = false;    
var ontbijtGegeten = false;
var tussendoorOchtendGegeten = false;
var lunchGegeten = false;
var tussendoorMiddagGegeten = false
var avondetenGegeten = false;
var tussendoorAvondGegeten = false;

/** Taking something else than dietary advice **/
var ietsandersVoorOntbijt = false;
var ietsandersOntbijt = false;
var ietsandersTussendoorOchtend = false;
var ietsandersLunch = false;
var ietsandersTussendoorMiddag = false;
var ietsandersAvond = false;
var ietsandersTussendoorAvond = false;


$(document).ready(function () {
	console.log('De document is ready!');
	workbook = new GC.Spread.Sheets.Workbook();
    excelIO = new GC.Spread.Excel.IO();

	ImportFile(); 
});

/** Import Excel file **/

function ImportFile() {
    var excelUrl = "promiss.xlsx";

    var oReq = new XMLHttpRequest();
    oReq.open('get', excelUrl, true);
    oReq.responseType = 'blob';
    oReq.onload = function () {
        var blob = oReq.response;
        excelIO.open(blob, LoadSpread, function (message) {
            console.log(message);
        });
    };
    oReq.send(null);
}

function stringToTime(timeString) {
	var split = timeString.split(":");
	var hours = parseInt(split[0]);
	var minutes = parseInt(split[1]) / 60;
	return hours + minutes;
}


/** Load spreadsheet **/

function LoadSpread(json) {
    console.log('Sheets?', json.sheets);
    jsonData = json;
    workbook.fromJSON(json);

    /** Gender of the user **/
    let aanspreekvorm;
    let geslacht = json.sheets[achternaam].data.dataTable[2][1].value;
        if (geslacht == 'vrouw') aanspreekvorm = 'mevrouw';
        if (geslacht == 'man') aanspreekvorm = 'meneer';
    console.log(geslacht)
    
    /** Variables for dietary advices **/
    const voedingsadviesVoorOntbijt = json.sheets[achternaam].data.dataTable[10][2].value;
    const voedingsadviesOntbijt = json.sheets[achternaam].data.dataTable[11][2].value;
    const voedingsadviesTussendoorOchtend = json.sheets[achternaam].data.dataTable[12][2].value;
    const voedingsadviesLunch = json.sheets[achternaam].data.dataTable[13][2].value;
    const voedingsadviesTussendoorMiddag = json.sheets[achternaam].data.dataTable[14][2].value;
    const voedingsadviesAvondeten = json.sheets[achternaam].data.dataTable[15][2].value;
    const voedingsadviesTussendoorAvond = json.sheets[achternaam].data.dataTable[16][2].value;

    /** Variables for notification time **/
	/** changed so it makes a number of the time **/
    const tijdVoorOntbijt = stringToTime(json.sheets[achternaam].data.dataTable[10][1].value);
    const tijdOntbijt = stringToTime(json.sheets[achternaam].data.dataTable[11][1].value);
    const tijdTussendoorOchtend = stringToTime(json.sheets[achternaam].data.dataTable[12][1].value);
    const tijdLunch = stringToTime(json.sheets[achternaam].data.dataTable[13][1].value);
    const tijdTussendoorMiddag = stringToTime(json.sheets[achternaam].data.dataTable[14][1].value);
    const tijdAvondeten = stringToTime(json.sheets[achternaam].data.dataTable[15][1].value);
    const tijdTussendoorAvond = stringToTime(json.sheets[achternaam].data.dataTable[16][1].value);
	

    /** The text content of the items in index.html **/
    document.getElementById("inputVoorOntbijt").textContent = voedingsadviesVoorOntbijt;
    document.getElementById("inputOntbijt").textContent = voedingsadviesOntbijt;
    document.getElementById("inputTussendoorOchtend").textContent = voedingsadviesTussendoorOchtend;
    document.getElementById("inputLunch").textContent = voedingsadviesLunch;
    document.getElementById("inputTussendoorMiddag").textContent = voedingsadviesTussendoorMiddag;
    document.getElementById("inputAvondeten").textContent = voedingsadviesAvondeten;
    document.getElementById("inputTussendoorAvond").textContent = voedingsadviesTussendoorAvond;


	//check cookie for advices
	checkCookiesAdvice(14);
	
	
    /** Notification buttons **/
	//The action after confirming that you've taken something 
	//This is dependent on the current time
    $('#notification .nu-btn').click(function(){
        if (currentTime >= tijdVoorOntbijt && currentTime < tijdOntbijt){
            $('#voorOntbijt input[type=checkbox]').prop('checked',true);
            voorOntbijtGegeten = true;
			cookieAdvices(14, 0);
        } else if (currentTime >= tijdOntbijt && currentTime < tijdTussendoorOchtend){
            $('#ontbijt input[type=checkbox]').prop('checked',true);
            ontbijtGegeten = true;
			cookieAdvices(14, 1);
        } else if (currentTime >= tijdTussendoorOchtend && currentTime < tijdLunch){
            $('#tussendoorOchtend input[type=checkbox]').prop('checked',true);
            tussendoorOchtendGegeten = true;
			cookieAdvices(14, 2);
        } else if (currentTime >= tijdLunch && currentTime < tijdTussendoorMiddag){
            $('#lunch input[type=checkbox]').prop('checked',true);
            lunchGegeten = true;
			cookieAdvices(14, 3);
        } else if (currentTime >= tijdTussendoorMiddag && currentTime < tijdAvondeten){
            $('#tussendoorMiddag input[type=checkbox]').prop('checked',true);
            tussendoorMiddagGegeten = true;
			cookieAdvices(14, 4);
        } else if (currentTime >= tijdAvondeten && currentTime < tijdTussendoorAvond){
            $('#avondeten input[type=checkbox]').prop('checked',true);
            avondetenGegeten = true;
			cookieAdvices(14, 5);
        } else if (currentTime >= tijdTussendoorAvond){
            $('#tussendoorAvond input[type=checkbox]').prop('checked',true);
            tussendoorAvondGegeten = true;
			cookieAdvices(14, 6);
        }
    });
	//Action when you choose 'later' option
    $('#notification .later-btn').click(function(){
        herinnering = true; 
    });
	//Action when you choose 'other' option
    $('#notification .anders-btn').click(function(){
        herinnering = false;
        if (currentTime >= tijdVoorOntbijt && currentTime < tijdOntbijt){
            $('#ietsandersVoorOntbijt input[type=checkbox]').prop('checked',true);
			document.getElementById('ietsandersVoorOntbijt').style.display = 'flex';
			ietsandersVoorOntbijt = true;
			cookieAdvices(14, 7);
        } else if (currentTime >= tijdOntbijt && currentTime < tijdTussendoorOchtend){
			$('#ietsandersOntbijt input[type=checkbox]').prop('checked',true);
			document.getElementById('ietsandersOntbijt').style.display = 'flex';
            ietsandersOntbijt = true;
			cookieAdvices(14, 8);
        } else if (currentTime >= tijdTussendoorOchtend && currentTime < tijdLunch){
            ietsandersTussendoorOchtend = true;
			$('#ietsandersTussendoorOchtend input[type=checkbox]').prop('checked',true);
			document.getElementById('ietsandersTussendoorOchtend').style.display = 'flex';
			cookieAdvices(14, 9);
        } else if (currentTime >= tijdLunch && currentTime < tijdTussendoorMiddag){
			$('#ietsandersLunch input[type=checkbox]').prop('checked',true);
            ietsandersLunch = true;
			document.getElementById('ietsandersLunch').style.display = 'flex';
			cookieAdvices(14, 10);
        } else if (currentTime >= tijdTussendoorMiddag && currentTime < tijdAvondeten){
			document.getElementById('ietsandersTussendoorMiddag').style.display = 'flex';
			$('#ietsandersTussendoorMiddag input[type=checkbox]').prop('checked',true);
            ietsandersTussendoorMiddag = true;
			cookieAdvices(14, 11);
        } else if (currentTime >= tijdAvondeten && currentTime < tijdTussendoorAvond){
			$('#ietsandersAvond input[type=checkbox]').prop('checked',true);
			document.getElementById('ietsandersAvond').style.display = 'flex';
            ietsandersAvond = true;
			cookieAdvices(14, 12);
        } else if (currentTime >= tijdTussendoorAvond){
			$('#ietsandersTussendoorAvond input[type=checkbox]').prop('checked',true);
			document.getElementById('ietsandersTussendoorAvond').style.display = 'flex';
            ietsandersTussendoorAvond = true;
			cookieAdvices(14, 13);
        }
    });

    /** Reminder buttons **/
	//Happens if you confirm/later/other the reminder
    $('#reminder .nu-btn').click(function(){
        herinnering = false;
		setCookie("reminder", "f%1800");
		tijdTotHerinnering = 60*30;
        if (currentTime >= tijdVoorOntbijt && currentTime < tijdOntbijt){
            $('#voorOntbijt input[type=checkbox]').prop('checked',true);
            voorOntbijtGegeten = true;
			cookieAdvices(14, 0);
        } else if (currentTime >= tijdOntbijt && currentTime < tijdTussendoorOchtend){
            $('#ontbijt input[type=checkbox]').prop('checked',true);
            ontbijtGegeten = true;
			cookieAdvices(14, 1);
        } else if (currentTime >= tijdTussendoorOchtend && currentTime < tijdLunch){
            $('#tussendoorMiddag input[type=checkbox]').prop('checked',true);
            tussendoorOchtendGegeten = true;
			cookieAdvices(14, 2);
        } else if (currentTime >= tijdLunch && currentTime < tijdTussendoorMiddag){
            $('#lunch input[type=checkbox]').prop('checked',true);
            lunchGegeten = true;
			cookieAdvices(14, 3);
        } else if (currentTime >= tijdTussendoorMiddag && currentTime < tijdAvondeten){
            $('#tussendoorMiddag input[type=checkbox]').prop('checked',true);
            tussendoorMiddagGegeten = true;
			cookieAdvices(14, 4);
        } else if (currentTime >= tijdAvondeten && currentTime < tijdTussendoorAvond){
            $('#avondeten input[type=checkbox]').prop('checked',true);
            avondetenGegeten = true;
			cookieAdvices(14, 5);
        } else if (currentTime >= tijdTussendoorAvond){
            $('#tussendoorAvond input[type=checkbox]').prop('checked',true);
            tussendoorAvondGegeten = true;
			cookieAdvices(14, 6);
        }
    });
    $('#reminder .later-btn').click(function(){
        resetTijdTotHerinnering();
        startInterval();
    });
    $('#reminder .anders-btn').click(function(){
        herinnering = false;
		tijdTotHerinnering = 60*30;
		setCookie("reminder", "f%1800")
        if (currentTime >= tijdVoorOntbijt && currentTime < tijdOntbijt){
            $('#ietsandersVoorOntbijt input[type=checkbox]').prop('checked',true);
			document.getElementById('ietsandersVoorOntbijt').style.display = 'flex';
			ietsandersVoorOntbijt = true;
			cookieAdvices(14, 7);
        } else if (currentTime >= tijdOntbijt && currentTime < tijdTussendoorOchtend){
			$('#ietsandersOntbijt input[type=checkbox]').prop('checked',true);
			document.getElementById('ietsandersOntbijt').style.display = 'flex';
            ietsandersOntbijt = true;
			cookieAdvices(14, 8);
        } else if (currentTime >= tijdTussendoorOchtend && currentTime < tijdLunch){
            ietsandersTussendoorOchtend = true;
			$('#ietsandersTussendoorOchtend input[type=checkbox]').prop('checked',true);
			document.getElementById('ietsandersTussendoorOchtend').style.display = 'flex';
			cookieAdvices(14, 9);
        } else if (currentTime >= tijdLunch && currentTime < tijdTussendoorMiddag){
			$('#ietsandersLunch input[type=checkbox]').prop('checked',true);
            ietsandersLunch = true;
			document.getElementById('ietsandersLunch').style.display = 'flex';
			cookieAdvices(14, 10);
        } else if (currentTime >= tijdTussendoorMiddag && currentTime < tijdAvondeten){
			document.getElementById('ietsandersTussendoorMiddag').style.display = 'flex';
			$('#ietsandersTussendoorMiddag input[type=checkbox]').prop('checked',true);
            ietsandersTussendoorMiddag = true;
			cookieAdvices(14, 11);
        } else if (currentTime >= tijdAvondeten && currentTime < tijdTussendoorAvond){
			$('#ietsandersAvond input[type=checkbox]').prop('checked',true);
			document.getElementById('ietsandersAvond').style.display = 'flex';
            ietsandersAvond = true;
			cookieAdvices(14, 12);
        } else if (currentTime >= tijdTussendoorAvond){
			$('#ietsandersTussendoorAvond input[type=checkbox]').prop('checked',true);
			document.getElementById('ietsandersTussendoorAvond').style.display = 'flex';
            ietsandersTussendoorAvond = true;
			cookieAdvices(14, 13);
        }
    });
	
	function checkReminderCookie() {
		if (getCookie("reminder") != "") {
			if (getCookie("reminder").split("%")[0] == "t") {
				herinnering = true;}
			if (getCookie("reminder").split("%")[0] == "f") {
				herinnering = false;}
			tijdTotHerinnering = getCookie("reminder").split("%")[1];
		}
	}

    /** The delay till reminder in secondes/minutes **/
    const uitstelTijd = 60*30;
    let tijdTotHerinnering = uitstelTijd;
	
    
    /* Reminder variable */
    let herinnering = false;
	
	checkReminderCookie();
	
	
	console.log(getCookie("reminder"));
	console.log(herinnering);
	console.log(tijdTotHerinnering);

    /* Interval variable */
    let interval = null; 
	if (herinnering) { interval = setInterval(fn60sec,1000); }

    /** Function for starting the function fn60sec to run every second/minute **/
    function startInterval(){
        /* Run the interval every seconde */
        var interval = setInterval(fn60sec,1000);
        /* Run the interval every minute */
        //interval = setInterval(fn60sec, 60 * 1000);
    };
    /** Function for stopping the function fn60sec from running every second/minute **/
    function stopInterval(){
        clearInterval(interval);
    };
    /** Function to reset the delay till reminder **/
    function resetTijdTotHerinnering(){
        tijdTotHerinnering = uitstelTijd;
    };

    /** Defining what the current time is **/
    const now = new Date();
        let currentTime = stringToTime(now.getHours() + ":" + now.getMinutes());
        //currentTime = stringToTime("19:05");  //this line is commented out so the current computer time is used instead of the breakfast time
        //console.log(currentTime);

    /** Function to show the right window according to the time **/
    function showochtend(){
        if (currentTime < stringToTime("12:00")){
            window.onbeforeunload = function () {
              window.scrollTo(0,0);
            };
        }
    }        
    function showmiddag(){
        if (currentTime >= stringToTime("12:00") && currentTime < stringToTime("18:00")){
            window.onbeforeunload = function () {
              window.scrollTo(0,560);
            };
        }
    }    
    function showavond(){
        if (currentTime >= stringToTime("18:00")){
            window.onbeforeunload = function () {
              window.scrollTo(0,1000);
            };
        }
    }
    
    showochtend();
    showmiddag();
    showavond();

    startInterval();

    function fn60sec() {   

        // als herinnering actief is
        if(herinnering == true){
            // trekken we bij elke iteratie 1 van af.
            tijdTotHerinnering--; 
            console.log(tijdTotHerinnering);
        }    

        const notVoorOntbijt = () => {
            //Show notification
            $('#notification').modal({
                show: true,
                backdrop: "static"
            });
            //If gender is 'vrouw'
            if (geslacht == 'vrouw' && voedingsadviesVoorOntbijt !== undefined) {
                let messageVoorOntbijt = `Goedemorgen ${aanspreekvorm} ${achternaam}, <br /><br /> Voor een goede start van de dag beveelt uw di&#235tist u aan om gelijk te beginnen met een eiwitrijk product. Zullen we beginnen met ${voedingsadviesVoorOntbijt}?`;
                document.getElementById("notification-content").innerHTML = messageVoorOntbijt;
            }
            //If gender is 'man'
            if (geslacht == 'man' && voedingsadviesVoorOntbijt !== undefined) {
                let messageVoorOntbijt = `Goedemorgen ${aanspreekvorm} ${achternaam}, <br /><br /> Om de dag niet slecht te beginnen, beveelt uw di&#235tist u aan om gelijk te starten met een eiwitrijk product. Zullen we beginnen met ${voedingsadviesVoorOntbijt}?`;
                document.getElementById("notification-content").innerHTML = messageVoorOntbijt;
            }
        }
       
        const notOntbijt = () => {
            $('#notification').modal({
                show: true,
                backdrop: "static"
            });
            if (geslacht == 'vrouw' && voedingsadviesOntbijt !== undefined) {
                let messageOntbijt = `Goedemorgen ${aanspreekvorm} ${achternaam}, <br /><br /> Tijd voor ontbijt. De di&#235tist beveelt voor het ontbijt ${voedingsadviesOntbijt} aan.`;
                document.getElementById("notification-content").innerHTML = messageOntbijt;
            }
            if (geslacht == 'man' && voedingsadviesOntbijt !== undefined) {
                let messageOntbijt = `Goedemorgen ${aanspreekvorm} ${achternaam}, <br /><br /> Sla geen ontbijt over. De di&#235tist beveelt voor het ontbijt ${voedingsadviesOntbijt} aan.`;
                document.getElementById("notification-content").innerHTML = messageOntbijt;
            }
        }
        
        const notTussendoorOchtend = () => {
            $('#notification').modal({
                show: true,
                backdrop: "static"
            });
            if (geslacht == 'vrouw' && voedingsadviesTussendoorOchtend !== undefined) {
                let messageTussendoorOchtend = `Neem lekker een tussendoortje. Lijkt ${voedingsadviesTussendoorOchtend} u wat?`;
                document.getElementById("notification-content").innerHTML = messageTussendoorOchtend;
            }
            if (geslacht == 'man' && voedingsadviesTussendoorOchtend !== undefined) {
                let messageTussendoorOchtend = `Wordt het geen tijd voor een tussendoortje? Lijkt ${voedingsadviesTussendoorOchtend} u wat?`;
                document.getElementById("notification-content").innerHTML = messageTussendoorOchtend;
            }
        }
        
        const notLunch = () => {
            $('#notification').modal({
                show: true,
                backdrop: "static"
            });
            if (geslacht == 'vrouw' && voedingsadviesLunch !== undefined) {
                let messageLunch = `Voor de lunch raadt de dietist u ${voedingsadviesLunch} aan. Klinkt dit niet goed?`;
                document.getElementById("notification-content").innerHTML = messageLunch;
            }
            if (geslacht == 'man' && voedingsadviesLunch !== undefined) {
                let messageLunch = `Voor de lunch raadt de dietist u ${voedingsadviesLunch} aan. Klinkt niet slecht, toch?`;
                document.getElementById("notification-content").innerHTML = messageLunch;
            }
        }
        
        const notTussendoorMiddag = () => {
            $('#notification').modal({
                show: true,
                backdrop: "static"
            });
            if (geslacht == 'vrouw' && voedingsadviesTussendoorMiddag !== undefined) {
                let messageTussendoorMiddag = `Een middagsnack die rijk is aan eiwitten is heel goed voor u. Wat dacht u van ${voedingsadviesTussendoorMiddag}?`;
                document.getElementById("notification-content").innerHTML = messageTussendoorMiddag;
            }
            if (geslacht == 'man' && voedingsadviesTussendoorMiddag !== undefined) {
                let messageTussendoorMiddag = `Een middagsnack is niet minder gezond als u iets eiwitrijks neemt. Wat dacht u van ${voedingsadviesTussendoorMiddag}?`;
                document.getElementById("notification-content").innerHTML = messageTussendoorMiddag;
            }    
        }
       
        const notAvondeten = () => {
            $('#notification').modal({
                show: true,
                backdrop: "static"
            });
            if (geslacht == 'vrouw' && voedingsadviesAvondeten !== undefined) {
                let messageAvond = `Goedenavond ${aanspreekvorm} ${achternaam}, <br /><br /> Heeft u al honger? Ook voor de avondmaaltijd is het essentieel dat u eiwitten consumeert. Gaat u voor ${voedingsadviesAvondeten}?`;
                document.getElementById("notification-content").innerHTML = messageAvond;
            }
            if (geslacht == 'man' && voedingsadviesAvondeten !== undefined) {
                let messageAvond = `Goedenavond ${aanspreekvorm} ${achternaam}, <br /><br /> Heeft u al honger? Ook voor de avondmaaltijd moet u zeker niet eiwitten vergeten te consumeren. Gaat u voor ${voedingsadviesAvondeten}?`;
                document.getElementById("notification-content").innerHTML = messageAvond;
            }           
        }
       
        const notTussendoorAvond = () => {
            $('#notification').modal({
                show: true,
                backdrop: "static"
            });
            if (geslacht == 'vrouw' && voedingsadviesTussendoorAvond !== undefined) {
                let messageTussendoorAvond = `Als u zin heeft in een avondsnack, is ${voedingsadviesTussendoorAvond} aan te raden. Gaat u ervoor?`;
                document.getElementById("notification-content").innerHTML = messageTussendoorAvond;
            }
            if (geslacht == 'man' && voedingsadviesTussendoorAvond !== undefined) {
                let messageTussendoorAvond = `Als u zin heeft in een avondsnack, is ${voedingsadviesTussendoorAvond} aan te raden. Gaat u ervoor?`;
                document.getElementById("notification-content").innerHTML = messageTussendoorAvond;
            }              
        }

        
        /** Notification functions **/

        const sendNotVoorOntbijt = () => {
            if(voorOntbijtGegeten == true || herinnering == true || ietsandersVoorOntbijt == true){
                return;
            }
            if (currentTime >= tijdVoorOntbijt && currentTime < tijdOntbijt) {
                notVoorOntbijt();
            }
        }

        const sendNotOntbijt = () => {
            if(ontbijtGegeten == true || herinnering == true || ietsandersOntbijt == true){
                return;
            }
            if (currentTime >= tijdOntbijt && currentTime < tijdTussendoorOchtend) {
                notOntbijt();
            }
        }

        const sendNotTussendoorOchtend = () => {
            if(tussendoorOchtendGegeten == true || herinnering == true || ietsandersTussendoorOchtend == true){
                return;
            }
            if (currentTime >= tijdTussendoorOchtend && currentTime < tijdLunch) {
                notTussendoorOchtend();
            }
        }

        const sendNotLunch = () => {
            if(lunchGegeten == true || herinnering == true || ietsandersLunch == true){
                return;
            }
            if (currentTime >= tijdLunch && currentTime < tijdTussendoorMiddag) {
                notLunch();
            }
        }

        const sendNotTussendoorMiddag = () => {
            if(tussendoorMiddagGegeten == true || herinnering == true || ietsandersTussendoorMiddag == true){
                return;
            }
            if (currentTime >= tijdTussendoorMiddag && currentTime < tijdAvondeten) {
                notTussendoorMiddag();
            }
        }

        const sendNotAvondeten = () => {
            // als de persoon zijn diner heeft gehad, hoeven we geen meldingen meer te sturen.
            if(avondetenGegeten == true || herinnering == true || ietsandersAvond == true){
                return;
            }
            if (currentTime >= tijdAvondeten && currentTime < tijdTussendoorAvond) {
                notAvondeten();
            }
        }

        const sendNotTussendoorAvond = () => {
            if(tussendoorAvondGegeten == true || herinnering == true || ietsandersTussendoorAvond == true){
                return;
            }
            if (currentTime >= tijdTussendoorAvond) {
                notTussendoorAvond();
            }
        }


        /** Reminder functions **/

        const herinneringVoorOntbijt = () => {
            if(tijdTotHerinnering <= 0 && currentTime >= tijdVoorOntbijt && currentTime < tijdOntbijt){
                //Show reminder
                $('#reminder').modal({
                        show: true,
                        backdrop: "static"
                })
                document.getElementById("reminder-content").textContent = `Vergeet u niet ${voedingsadviesVoorOntbijt} te nemen?`;
                //If reminder notification appears, the function fn60sec() needs to stop running continuously until 'Ik neem het later' button is clicked.
                stopInterval();
            }
        }

        const herinneringOntbijt = () => {
            if(tijdTotHerinnering <= 0 && currentTime >= tijdOntbijt && currentTime < tijdTussendoorOchtend){
                $('#reminder').modal({
                        show: true,
                        backdrop: "static"
                })
                document.getElementById("reminder-content").textContent = `Vergeet u niet te ontbijten? Neem ${voedingsadviesOntbijt}.`;
                stopInterval();
            }
        }

        const herinneringTussendoorOchtend = () => {
            if(tijdTotHerinnering <= 0 && currentTime >= tijdTussendoorOchtend && currentTime < tijdLunch){
                $('#reminder').modal({
                        show: true,
                        backdrop: "static"
                })
                document.getElementById("reminder-content").textContent = `Vergeet u niet nog ${voedingsadviesTussendoorOchtend} te nemen?`;
                stopInterval();
            }
        }

        const herinneringLunch = () => {
            if(tijdTotHerinnering <= 0 && currentTime >= tijdLunch && currentTime < tijdTussendoorMiddag){
                $('#reminder').modal({
                        show: true,
                        backdrop: "static"
                })
                document.getElementById("reminder-content").textContent = `Vergeet u niet te lunchen? Neem ${voedingsadviesLunch}.`;
                stopInterval();
            }
        }

        const herinneringTussendoorMiddag = () => {
            if(tijdTotHerinnering <= 0 && currentTime >= tijdTussendoorMiddag && currentTime < tijdAvondeten){
                $('#reminder').modal({
                        show: true,
                        backdrop: "static"
                })
                document.getElementById("reminder-content").textContent = `Vergeet u niet nog ${voedingsadviesTussendoorMiddag} te nemen?`;
                stopInterval();
            }
        }

        const herinneringAvond = () => {
            if(tijdTotHerinnering <= 0 && currentTime >= tijdAvondeten && currentTime < tijdTussendoorAvond){         
                $('#reminder').modal({
                        show: true,
                        backdrop: "static"
                })
                document.getElementById("reminder-content").textContent = `Vergeet u niet te dineren? Neem ${voedingsadviesAvondeten}.`;
                stopInterval();
            }
        }

        const herinneringTussendoorAvond = () => {
            if(tijdTotHerinnering <= 0 && currentTime >= tijdTussendoorAvond){
                $('#reminder').modal({
                        show: true,
                        backdrop: "static"
                })
                document.getElementById("reminder-content").textContent = `Vergeet u niet nog ${voedingsadviesTussendoorAvond} te nemen?`;
                stopInterval();
            }
        }

        sendNotVoorOntbijt();
        sendNotOntbijt();
        sendNotTussendoorOchtend();
        sendNotLunch();
        sendNotTussendoorMiddag();
        sendNotAvondeten();
        sendNotTussendoorAvond()

        herinneringVoorOntbijt();
        herinneringOntbijt();
        herinneringTussendoorOchtend();
        herinneringLunch();
        herinneringTussendoorMiddag();
        herinneringAvond();
        herinneringTussendoorAvond();
       
		if (herinnering) {
			setCookie("reminder", "t%"+ tijdTotHerinnering);
		} else {
			setCookie("reminder", "f%1800");
		}

		//check if there is a value for the counters for extra items in the cookie
		if (getCookie("extraItems") != "") {
			for (i in Array.from(Array(numberExtraItems).keys())) {
				//console.log(getCookie("extraItems").split("%"));
				extraItems[i] = parseInt(getCookie("extraItems").split("%")[i]);
				var tempName = "extraItem" + (parseInt(i) + 1);
				document.getElementById(tempName).innerHTML = extraItems[i] + "x";
			}
		}	
			}        



	//check if the checkboxes are turned off by user, ask for permission
	$("#voorOntbijtCheck").on('change', function() {
		this.checked=!this.checked?!confirm('Weet u zeker dat u dit wil uitvinken?'):true;
		if (this.checked && getCookie("advice").split("%")[0] != "1") {
			cookieAdvices(14, 0);
		}
		else if (!this.checked && getCookie("advice").split("%")[0] != "0") {
			cookieAdvices(14, 0);
		}
		
	});
	$("#ontbijtCheck").on('change', function() {
		this.checked=!this.checked?!confirm('Weet u zeker dat u dit wil uitvinken?'):true;
		if (this.checked && getCookie("advice").split("%")[1] != "1") {
			cookieAdvices(14, 1);
		}
		else if (!this.checked && getCookie("advice").split("%")[1] != "0") {
			cookieAdvices(14, 1);
		}
    });
    $("#tussendoorOchtendCheck").on('change', function() {
		this.checked=!this.checked?!confirm('Weet u zeker dat u dit wil uitvinken?'):true;
		if (this.checked && getCookie("advice").split("%")[2] != "1") {
			cookieAdvices(14, 2);
		}
		else if (!this.checked && getCookie("advice").split("%")[2] != "0") {
			cookieAdvices(14, 2);
		}
    });
    $("#lunchCheck").on('change', function() {
        this.checked=!this.checked?!confirm('Weet u zeker dat u dit wil uitvinken?'):true;
		if (this.checked && getCookie("advice").split("%")[3] != "1") {
			cookieAdvices(14, 3);
		}
		else if (!this.checked && getCookie("advice").split("%")[3] != "0") {
			cookieAdvices(14, 3);
		}
    });
    $("#tussendoorMiddagCheck").on('change', function() {
        this.checked=!this.checked?!confirm('Weet u zeker dat u dit wil uitvinken?'):true;
		if (this.checked && getCookie("advice").split("%")[4] != "1") {
			cookieAdvices(14, 4);
		}
		else if (!this.checked && getCookie("advice").split("%")[4] != "0") {
			cookieAdvices(14, 4);
		}
    });
    $("#avondetenCheck").on('change', function() {
        this.checked=!this.checked?!confirm('Weet u zeker dat u dit wil uitvinken?'):true;
		if (this.checked && getCookie("advice").split("%")[5] != "1") {
			cookieAdvices(14, 5);
		}
		else if (!this.checked && getCookie("advice").split("%")[5] != "0") {
			cookieAdvices(14, 5);
		}
    });
    $("#tussendoorAvondCheck").on('change', function() {
        this.checked=!this.checked?!confirm('Weet u zeker dat u dit wil uitvinken?'):true;
		if (this.checked && getCookie("advice").split("%")[6] != "1") {
			cookieAdvices(14, 6);
		}
		else if (!this.checked && getCookie("advice").split("%")[6] != "0") {
			cookieAdvices(14, 6);
		}
    });		
	$("#ietsandersVoorOntbijt").on('change', function() {
        this.checked=!this.checked?!confirm('Weet u zeker dat u dit wil uitvinken?'):true;
		if (this.checked && getCookie("advice").split("%")[7] != "1") {
			cookieAdvices(14, 7);
		}
		else if (!this.checked && getCookie("advice").split("%")[7] != "0") {
			cookieAdvices(14, 7);
		}
    });
	$("#ietsandersOntbijt").on('change', function() {
        this.checked=!this.checked?!confirm('Weet u zeker dat u dit wil uitvinken?'):true;
		if (this.checked && getCookie("advice").split("%")[8] != "1") {
			cookieAdvices(14, 8);
		}
		else if (!this.checked && getCookie("advice").split("%")[8] != "0") {
			cookieAdvices(14, 8);
		}
    });
	$("#ietsandersTussendoorMiddag").on('change', function() {
        this.checked=!this.checked?!confirm('Weet u zeker dat u dit wil uitvinken?'):true;
		if (this.checked && getCookie("advice").split("%")[9] != "1") {
			cookieAdvices(14, 9);
		}
		else if (!this.checked && getCookie("advice").split("%")[9] != "0") {
			cookieAdvices(14, 9);
		}
    });
	$("#ietsandersLunch").on('change', function() {
        this.checked=!this.checked?!confirm('Weet u zeker dat u dit wil uitvinken?'):true;
		if (this.checked && getCookie("advice").split("%")[10] != "1") {
			cookieAdvices(14, 10);
		}
		else if (!this.checked && getCookie("advice").split("%")[10] != "0") {
			cookieAdvices(14, 10);
		}
    });
	$("#ietsandersTussendoorMiddag").on('change', function() {
        this.checked=!this.checked?!confirm('Weet u zeker dat u dit wil uitvinken?'):true;
		if (this.checked && getCookie("advice").split("%")[11] != "1") {
			cookieAdvices(14, 11);
		}
		else if (!this.checked && getCookie("advice").split("%")[11] != "0") {
			cookieAdvices(14, 11);
		}
    });
	$("#ietsandersAvond").on('change', function() {
        this.checked=!this.checked?!confirm('Weet u zeker dat u dit wil uitvinken?'):true;
		if (this.checked && getCookie("advice").split("%")[12] != "1") {
			cookieAdvices(14, 12);
		}
		else if (!this.checked && getCookie("advice").split("%")[12] != "0") {
			cookieAdvices(14, 12);
		}
    });
	$("#ietsandersTussendoorAvond").on('change', function() {
        this.checked=!this.checked?!confirm('Weet u zeker dat u dit wil uitvinken?'):true;
		if (this.checked && getCookie("advice").split("%")[13] != "1") {
			cookieAdvices(14, 13);
		}
		else if (!this.checked && getCookie("advice").split("%")[13] != "0") {
			cookieAdvices(14, 13);
		}
    });
}





/** Add counter on items of extra dietary options slider - changed from Lihn's original:
Now use a list to store all values. **/
var extraItems = new Array(); //empty list for all counters extra items
var numberExtraItems = 10; //number of extra items that exist
//fill extraItems with zeroes
for (i in Array.from(Array(numberExtraItems).keys())) { 
	extraItems.push(0);
}

	
//store all values in the cookie
function cookieExtraValues() {
	var newValues = "";
	for (i in Array.from(Array(numberExtraItems).keys())) {
		newValues += extraItems[i].toString();
		newValues += "%";
	}
	setCookie("extraItems", newValues);
}

//changed from original
function clickExtraItem1(){
	extraItems[0] += 1;
    document.getElementById("extraItem1").innerHTML = extraItems[0] + "x";
	cookieExtraValues();
}
function clickExtraItem2(){
    extraItems[1] += 1;
    document.getElementById("extraItem2").innerHTML = extraItems[1] + "x";
	cookieExtraValues();
}
function clickExtraItem3(){
    extraItems[2] += 1;
    document.getElementById("extraItem3").innerHTML = extraItems[2] + "x";
	cookieExtraValues();
}
function clickExtraItem4(){
    extraItems[3] += 1;
    document.getElementById("extraItem4").innerHTML = extraItems[3] + "x";
	cookieExtraValues();
}
function clickExtraItem5(){
    extraItems[4] += 1;
    document.getElementById("extraItem5").innerHTML = extraItems[4] + "x";
	cookieExtraValues();
}
function clickExtraItem6(){
    extraItems[5] += 1;
    document.getElementById("extraItem6").innerHTML = extraItems[5] + "x";
	cookieExtraValues();
}
function clickExtraItem7(){
    extraItems[6] += 1;
    document.getElementById("extraItem7").innerHTML = extraItems[6] + "x";
	cookieExtraValues();
}
function clickExtraItem8(){
    extraItems[7] += 1;
    document.getElementById("extraItem8").innerHTML = extraItems[7] + "x";
	cookieExtraValues();
}
function clickExtraItem9(){
    extraItems[8] += 1;
    document.getElementById("extraItem9").innerHTML = extraItems[8] + "x";
	cookieExtraValues();
}
function clickExtraItem10(){
    extraItems[9] += 1;
    document.getElementById("extraItem10").innerHTML = extraItems[9] + "x";
	cookieExtraValues();
}


//create/rewrite a cookie for the advice checkboxes
function cookieAdvices(numberAdvices, indexAdvice) {
	var oldValue = getCookie("advice"); //get the old value of the cookie
	var newValues = ""; //create a new empty cookie value
	
	//check if the old cookie was empty 
	if (oldValue == "") {
		var newValues = "";
		for (i in Array.from(Array(numberAdvices).keys())) { //fill it with zeroes
			newValues += 0;
			newValues += "%";
		}
	}
	
	else {
		var newValuesList = oldValue.split("%"); //new value is a list of the values in the old value string
		
		//replace the value for the checkboxs of the selected index 
		if (newValuesList[indexAdvice] == 1) {
			newValuesList[indexAdvice] = 0; 
		} else {
			newValuesList[indexAdvice] = 1;
		}
		
		//make a string of all  values
		for (i in Array.from(Array(numberAdvices).keys())) { 
			newValues += newValuesList[i];
			newValues += "%";
		}
	}
	
	setCookie("advice", newValues);
	console.log("testing if cookie exists");
	console.log(document.cookie);
}

//check the cookie for the advice checkboxes
function checkCookiesAdvice(numberOfAdvices) {
	console.log("current cookie");
	console.log(getCookie("advice"));
	if (getCookie("advice") == "") {
		console.log("this is tested");
		cookieAdvices(14, 0);
	}
	
	for (i in Array.from(Array(numberOfAdvices).keys())) {
		i = parseInt(i);
		if (parseInt(getCookie("advice").split("%")[i]) != 0) {
			switch (i) {
				case 0:
					voorOntbijtGegeten = true;
					$('#voorOntbijt input[type=checkbox]').prop('checked',true);
					break;
				case 1:
					$('#ontbijt input[type=checkbox]').prop('checked',true);
					ontbijtGegeten = true;
					break;
				case 2:
					tussendoorOchtendGegeten = true;
					$('#tussendoorOchtend input[type=checkbox]').prop('checked',true);
					break;
				case 3:
					lunchGegeten = true;
					$('#lunch input[type=checkbox]').prop('checked',true);
					break;
				case 4:
					tussendoorMiddagGegeten = true;
					$('#tussendoorMiddag input[type=checkbox]').prop('checked',true);
					break;
				case 5:
					avondetenGegeten = true;
					$('#avondeten input[type=checkbox]').prop('checked',true);
					break;
				case 6:
					tussendoorAvondGegeten = true;
					$('#tussendoorAvond input[type=checkbox]').prop('checked',true);
					break;
				case 7:
					ietsandersVoorOntbijt = true;
					$('#ietsandersVoorOntbijt input[type=checkbox]').prop('checked',true);
					document.getElementById('ietsandersVoorOntbijt').style.display = 'flex';
					break;
				case 8:
					ietsandersOntbijt = true;
					$('#ietsandersOntbijt input[type=checkbox]').prop('checked',true);
					document.getElementById('ietsandersOntbijt').style.display = 'flex';
					break;
				case 9:
					$('#ietsandersTussendoorOchtend input[type=checkbox]').prop('checked',true);
					document.getElementById('ietsandersTussendoorOchtend').style.display = 'flex';
					ietsandersTussendoorOchtend = true;
					break;
				case 10:
					$('#ietsandersLunch input[type=checkbox]').prop('checked',true);
					document.getElementById('ietsandersLunch').style.display = 'flex';
					ietsandersLunch = true;
					break;
				case 11:
					$('#ietsandersTussendoorMiddag input[type=checkbox]').prop('checked',true);
					document.getElementById('ietsandersTussendoorMiddag').style.display = 'flex';
					ietsandersTussendoorMiddag = true;
					break;
				case 12:
					ietsandersAvond = true;
					$('#ietsandersAvond input[type=checkbox]').prop('checked',true);
					document.getElementById('ietsandersAvond').style.display = 'flex';
					break;
				case 13:
					$('#ietsandersTussendoorAvond input[type=checkbox]').prop('checked',true);
					document.getElementById('ietsandersTussendoorAvond').style.display = 'flex';
					ietsandersTussendoorAvond = true;
					break;
			}
		}
	}
	
}


//standard functions for cookies
function setCookie(cname, cvalue) { 
	//set expiration to next day 2 AM (!time zones..)
	var d = new Date();
	d.setDate(d.getDate() + 1);
	d.setHours(4, 0, 0, 0); //different time zone
	//console.log(d);
	var expires = "expires=" + d.toUTCString();
	
	//create cookie
	document.cookie = cname + "=" + cvalue + ";" + expires + "path=/";
}
	
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}
