var workbook;
var excelIO;
var achternaam = "A";

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
    const tijdVoorOntbijt = json.sheets[achternaam].data.dataTable[10][1].value;
    const tijdOntbijt = json.sheets[achternaam].data.dataTable[11][1].value;
    const tijdTussendoorOchtend = json.sheets[achternaam].data.dataTable[12][1].value;
    const tijdLunch = json.sheets[achternaam].data.dataTable[13][1].value;
    const tijdTussendoorMiddag = json.sheets[achternaam].data.dataTable[14][1].value;
    const tijdAvondeten = json.sheets[achternaam].data.dataTable[15][1].value;
    const tijdTussendoorAvond = json.sheets[achternaam].data.dataTable[16][1].value;

    /** The text content of the items in index.html **/
    document.getElementById("inputVoorOntbijt").textContent = voedingsadviesVoorOntbijt;
    document.getElementById("inputOntbijt").textContent = voedingsadviesOntbijt;
    document.getElementById("inputTussendoorOchtend").textContent = voedingsadviesTussendoorOchtend;
    document.getElementById("inputLunch").textContent = voedingsadviesLunch;
    document.getElementById("inputTussendoorMiddag").textContent = voedingsadviesTussendoorMiddag;
    document.getElementById("inputAvondeten").textContent = voedingsadviesAvondeten;
    document.getElementById("inputTussendoorAvond").textContent = voedingsadviesTussendoorAvond;

    /** Dietary advice taken **/
    let voorOntbijtGegeten = false;
    let ontbijtGegeten = false;
    let tussendoorOchtendGegeten = false;
    let lunchGegeten = false;
    let tussendoorMiddagGegeten = false
    let avondetenGegeten = false;
    let tussendoorAvondGegeten = false;

    /** Taking something else than dietary advice **/
    let ietsandersVoorOntbijt = false
    let ietsandersOntbijt = false
    let ietsandersTussendoorOchtend = false
    let ietsandersLunch = false
    let ietsandersTussendoorMiddag = false
    let ietsandersAvond = false
    let ietsandersTussendoorAvond = false

    /** Notification buttons **/
    $('#notification .nu-btn').click(function(){
        if (currentTime == tijdVoorOntbijt){
            $('#voorOntbijt input[type=checkbox]').prop('checked',true);
            voorOntbijtGegeten = true;
        } else if (currentTime == tijdOntbijt){
            $('#ontbijt input[type=checkbox]').prop('checked',true);
            ontbijtGegeten = true;
        } else if (currentTime == tijdTussendoorOchtend){
            $('#tussendoorOchtend input[type=checkbox]').prop('checked',true);
            tussendoorOchtendGegeten = true;
        } else if (currentTime == tijdLunch){
            $('#lunch input[type=checkbox]').prop('checked',true);
            lunchGegeten = true;
        } else if (currentTime == tijdTussendoorMiddag){
            $('#tussendoorMiddag input[type=checkbox]').prop('checked',true);
            tussendoorMiddagGegeten = true;
        } else if (currentTime == tijdAvondeten){
            $('#avondeten input[type=checkbox]').prop('checked',true);
            avondetenGegeten = true;
        } else if (currentTime == tijdTussendoorAvond){
            $('#tussendoorAvond input[type=checkbox]').prop('checked',true);
            tussendoorAvondGegeten = true;
        }
    });
    $('#notification .later-btn').click(function(){
        herinnering = true; 
    });
    $('#notification .anders-btn').click(function(){
        herinnering = false;
        if (currentTime == tijdVoorOntbijt){
            ietsandersVoorOntbijt = true;
        } else if (currentTime == tijdOntbijt){
            ietsandersOntbijt = true;
        } else if (currentTime == tijdTussendoorOchtend){
            ietsandersTussendoorOchtend = true;
        } else if (currentTime == tijdLunch){
            ietsandersLunch = true;
        } else if (currentTime == tijdTussendoorMiddag){
            ietsandersTussendoorMiddag = true;
        } else if (currentTime == tijdAvondeten){
            ietsandersAvond = true;
        } else if (currentTime == tijdTussendoorAvond){
            ietsandersTussendoorAvond = true;
        }
    });

    /** Reminder buttons **/
    $('#reminder .nu-btn').click(function(){
        herinnering = false;
        if (currentTime == tijdVoorOntbijt){
            $('#voorOntbijt input[type=checkbox]').prop('checked',true);
            voorOntbijtGegeten = true;
        } else if (currentTime == tijdOntbijt){
            $('#ontbijt input[type=checkbox]').prop('checked',true);
            ontbijtGegeten = true;
        } else if (currentTime == tijdTussendoorOchtend){
            $('#tussendoorMiddag input[type=checkbox]').prop('checked',true);
            tussendoorOchtendGegeten = true;
        } else if (currentTime == tijdLunch){
            $('#lunch input[type=checkbox]').prop('checked',true);
            lunchGegeten = true;
        } else if (currentTime == tijdTussendoorMiddag){
            $('#tussendoorMiddag input[type=checkbox]').prop('checked',true);
            tussendoorMiddagGegeten = true;
        } else if (currentTime == tijdAvondeten){
            $('#avondeten input[type=checkbox]').prop('checked',true);
            avondetenGegeten = true;
        } else if (currentTime == tijdTussendoorAvond){
            $('#tussendoorAvond input[type=checkbox]').prop('checked',true);
            tussendoorAvondGegeten = true;
        }
    });
    $('#reminder .later-btn').click(function(){
        resetTijdTotHerinnering();
        startInterval();
    });
    $('#reminder .anders-btn').click(function(){
        herinnering = false;
        if (currentTime == tijdVoorOntbijt){
            ietsandersVoorOntbijt = true;
        } else if (currentTime == tijdOntbijt){
            ietsandersOntbijt = true;
        } else if (currentTime == tijdTussendoorOchtend){
            ietsandersTussendoorOchtend = true;
        } else if (currentTime == tijdLunch){
            ietsandersLunch = true;
        } else if (currentTime == tijdTussendoorMiddag){
            ietsandersTussendoorMiddag = true;
        } else if (currentTime == tijdAvondeten){
            ietsandersAvond = true;
        } else if (currentTime == tijdTussendoorAvond){
            ietsandersTussendoorAvond = true;
        }
    });

    /** The delay till reminder in secondes/minutes **/
    const uitstelTijd = 10;
    let tijdTotHerinnering = uitstelTijd;
    
    /* Reminder variable */
    let herinnering = false;

    /* Interval variable */
    let interval = null;    

    /** Function for starting the function fn60sec to run every second/minute **/
    function startInterval(){
        /* Run the interval every seconde */
        interval = setInterval(fn60sec,1000);
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
        let currentTime = now.getHours() + ":" + now.getMinutes();
        currentTime = tijdVoorOntbijt;
        console.log(currentTime);

    /** Function to show the right window according to the time **/
    function showochtend(){
        if (currentTime < "12:00"){
            window.onbeforeunload = function () {
              window.scrollTo(0,0);
            };
        }
    }        
    function showmiddag(){
        if (currentTime >= "12:00" && currentTime < "18:00"){
            window.onbeforeunload = function () {
              window.scrollTo(0,560);
            };
        }
    }    
    function showavond(){
        if (currentTime >= "18:00"){
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
            if (currentTime == tijdVoorOntbijt) {
                notVoorOntbijt();
            }
        }

        const sendNotOntbijt = () => {
            if(ontbijtGegeten == true || herinnering == true || ietsandersOntbijt == true){
                return;
            }
            if (currentTime == tijdOntbijt) {
                notOntbijt();
            }
        }

        const sendNotTussendoorOchtend = () => {
            if(tussendoorOchtendGegeten == true || herinnering == true || ietsandersTussendoorOchtend == true){
                return;
            }
            if (currentTime == tijdTussendoorOchtend) {
                notTussendoorochtend();
            }
        }

        const sendNotLunch = () => {
            if(lunchGegeten == true || herinnering == true || ietsandersLunch == true){
                return;
            }
            if (currentTime == tijdLunch) {
                notLunch();
            }
        }

        const sendNotTussendoorMiddag = () => {
            if(tussendoorMiddagGegeten == true || herinnering == true || ietsandersTussendoorMiddag == true){
                return;
            }
            if (currentTime == tijdTussendoorMiddag) {
                notTussendoorMiddag();
            }
        }

        const sendNotAvondeten = () => {
            // als de persoon zijn diner heeft gehad, hoeven we geen meldingen meer te sturen.
            if(avondetenGegeten == true || herinnering == true || ietsandersAvond == true){
                return;
            }
            if (currentTime == tijdAvondeten) {
                notAvondeten();
            }
        }

        const sendNotTussendoorAvond = () => {
            if(tussendoorAvondGegeten == true || herinnering == true || ietsandersTussendoorAvond == true){
                return;
            }
            if (currentTime == tijdTussendoorAvond) {
                notTussendoorAvond();
            }
        }


        /** Reminder functions **/

        const herinneringVoorOntbijt = () => {
            if(tijdTotHerinnering == 0 && currentTime == tijdVoorOntbijt){
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
            if(tijdTotHerinnering == 0 && currentTime == tijdOntbijt){
                $('#reminder').modal({
                        show: true,
                        backdrop: "static"
                })
                document.getElementById("reminder-content").textContent = `Vergeet u niet te ontbijten? Neem ${voedingsadviesOntbijt}.`;
                stopInterval();
            }
        }

        const herinneringTussendoorOchtend = () => {
            if(tijdTotHerinnering == 0 && currentTime == tijdTussendoorOchtend){
                $('#reminder').modal({
                        show: true,
                        backdrop: "static"
                })
                document.getElementById("reminder-content").textContent = `Vergeet u niet nog ${voedingsadviesTussendoorOchtend} te nemen?`;
                stopInterval();
            }
        }

        const herinneringLunch = () => {
            if(tijdTotHerinnering == 0 && currentTime == tijdLunch){
                $('#reminder').modal({
                        show: true,
                        backdrop: "static"
                })
                document.getElementById("reminder-content").textContent = `Vergeet u niet te lunchen? Neem ${voedingsadviesLunch}.`;
                stopInterval();
            }
        }

        const herinneringTussendoorMiddag = () => {
            if(tijdTotHerinnering == 0 && currentTime == tijdTussendoorMiddag){
                $('#reminder').modal({
                        show: true,
                        backdrop: "static"
                })
                document.getElementById("reminder-content").textContent = `Vergeet u niet nog ${voedingsadviesTussendoorMiddag} te nemen?`;
                stopInterval();
            }
        }

        const herinneringAvond = () => {
            if(tijdTotHerinnering == 0 && currentTime == tijdAvondeten){         
                $('#reminder').modal({
                        show: true,
                        backdrop: "static"
                })
                document.getElementById("reminder-content").textContent = `Vergeet u niet te dineren? Neem ${voedingsadviesAvondeten}.`;
                stopInterval();
            }
        }

        const herinneringTussendoorAvond = () => {
            if(tijdTotHerinnering == 0 && currentTime == tijdTussendoorAvond){
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
       
    }         
}

/** Add counter on items of extra dietary options slider **/

let addExtraItem1 = (function () {
    let counter = 0;
    return function () {return counter += 1;}
})();
let addExtraItem2 = (function () {
    let counter = 0;
    return function () {return counter += 1;}
})();
let addExtraItem3 = (function () {
    let counter = 0;
    return function () {return counter += 1;}
})();
let addExtraItem4 = (function () {
    let counter = 0;
    return function () {return counter += 1;}
})();
let addExtraItem5 = (function () {
    let counter = 0;
    return function () {return counter += 1;}
})();
let addExtraItem6 = (function () {
    let counter = 0;
    return function () {return counter += 1;}
})();
let addExtraItem7 = (function () {
    let counter = 0;
    return function () {return counter += 1;}
})();
let addExtraItem8 = (function () {
    let counter = 0;
    return function () {return counter += 1;}
})();
let addExtraItem9 = (function () {
    let counter = 0;
    return function () {return counter += 1;}
})();
let addExtraItem10 = (function () {
    let counter = 0;
    return function () {return counter += 1;}
})();
let addExtraItem11 = (function () {
    let counter = 0;
    return function () {return counter += 1;}
})();
let addExtraItem12 = (function () {
    let counter = 0;
    return function () {return counter += 1;}
})();

function clickExtraItem1(){
    document.getElementById("extraItem1").innerHTML = addExtraItem1() + "x";
}
function clickExtraItem2(){
    document.getElementById("extraItem2").innerHTML = addExtraItem2() + "x";
}
function clickExtraItem3(){
    document.getElementById("extraItem3").innerHTML = addExtraItem3() + "x";
}
function clickExtraItem4(){
    document.getElementById("extraItem4").innerHTML = addExtraItem4() + "x";
}
function clickExtraItem5(){
    document.getElementById("extraItem5").innerHTML = addExtraItem5() + "x";
}
function clickExtraItem6(){
    document.getElementById("extraItem6").innerHTML = addExtraItem6() + "x";
}
function clickExtraItem7(){
    document.getElementById("extraItem7").innerHTML = addExtraItem7() + "x";
}
function clickExtraItem8(){
    document.getElementById("extraItem8").innerHTML = addExtraItem8() + "x";
}
function clickExtraItem9(){
    document.getElementById("extraItem9").innerHTML = addExtraItem9() + "x";
}
function clickExtraItem10(){
    document.getElementById("extraItem10").innerHTML = addExtraItem10() + "x";
}
function clickExtraItem11(){
    document.getElementById("extraItem11").innerHTML = addExtraItem11() + "x";
}
function clickExtraItem12(){
    document.getElementById("extraItem12").innerHTML = addExtraItem12() + "x";
}






