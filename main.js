var version = "1.1";

var savedPosition = "";

var canvas = document.getElementById("autoStartPos");

var g2d = canvas.getContext("2d");

var fieldImage = new Image(300, 363);

fieldImage.src = "resources/fieldImageSmall.png";

fieldImage.onload = function() {
    g2d.drawImage(fieldImage, 0, 0, canvas.width, canvas.height);
}
if (document.cookie.length >= 1) {
    document.getElementById("ScoutName").value = getCookie("scoutName");
}
var flagImage = new Image(60, 60);

document.getElementById("ScoutName").addEventListener("keyup", function(event) {
    setCookie("scoutName", document.getElementById("ScoutName").value);
});
document.getElementById("NoShow").addEventListener("change", function(event) {
    if (document.getElementById("NoShow").checked) {
        document.getElementById("reqAutoStartPos").required = false;
    } else if (!(document.getElementById("NoShow").checked)) {
        document.getElementById("reqAutoStartPos").required = truess;
    }
});

flagImage.src = "resources/target.png";
canvas.addEventListener("click", function(event) {
    g2d.drawImage(fieldImage, 0, 0, canvas.width, canvas.height);
    g2d.drawImage(flagImage, event.pageX - canvas.offsetLeft - flagImage.width / 2, event.pageY - canvas.offsetTop - flagImage.height / 2);
    savedPosition = "(" + (event.pageX - canvas.offsetLeft) / canvas.width + ";" + (event.pageY - canvas.offsetTop) / canvas.height + ")";
    console.log(event);
    console.log(savedPosition);
    document.getElementById("reqAutoStartPos").value = savedPosition;
});

function scoreDisplay(bettingScore) {

    document.getElementById("myScore").innerHTML = bettingScore;
    //displays current amount of points a person can bet
}

var score = getCookie("score");

if (score == "") {
    //if the cookie does not already exist
    var newId = 200;
    setCookie("score", newId, 20);
    score = newId;
}

var name = getCookie("name");

if (name != "" && name != "undefined") {
    document.getElementById("ScoutName").value = name;
}

var teamNumber = getCookie("number");

if (teamNumber != "") {
    document.getElementById("ScoutTeamNumber").value = teamNumber;
}

function betting(bettingScore, name1, name2, bet) {
    //should add/take away points based on how much was bet, doesn't work yet
    if (name1 == name2) {
        //if the answer given to two inputs is the same
        score += bet;
    } else {
        score -= bet;
    }
}

function deselect(name) {
    //goes through and clears selected radio buttons with the given name
    var x = document.getElementsByName(name);
    for (var i = 0; i < x.length; i++) {
        console.log(x[i].checked);
        x[i].checked = false;
    }
}

function deselectStar(id, name) {
    //if a selected star is clicked, deselects that star (does not work yet)
    var x = document.getElementById(id);
    var y = document.getElementsByName(name)
        //check if the radio button is checked before pressing it
    console.log(x.checked)
        //if(x.checked){
        //    x.checked=true;
        //}
        //else
        //    for(i=0; i<y.length; i++) {
        //        y[i].checked = false;
        //    }
}

var dropDownMap = {
    "endGame-two": "expanding",
    "endGame-three": "expanding1",
    "AutoScaleNum": "expanding-auto",
    "AutoSwitchNum": "expanding-auto",
    "Fall": "expandingFall"
}

var conditionalRequrementsMap = {
    "endGame-two": "FailOption",
    "endGame-three": "SuccessOption",
    "Fall": "ExpandingFall"
}

function dropDown() {
    //causes menus to drop down when a button is selected
    for (var key in dropDownMap) {
        var element = document.getElementById(key);
        var hidden = document.getElementById(dropDownMap[key]);
        var innerQuestions = document.getElementsByName(conditionalRequrementsMap[key]);

        hidden.classList.remove("expand-after");
        for (i = 0; i < innerQuestions.length; i++) {
            innerQuestions[i].checked = false;
            innerQuestions[i].required = false;
        }
    }

    for (var key in dropDownMap) {
        var element = document.getElementById(key);
        var hidden = document.getElementById(dropDownMap[key]);
        var innerQuestions = document.getElementsByName(conditionalRequrementsMap[key]);
        if (element.checked) {
            hidden.classList.add("expand-after");
            for (i = 0; i < innerQuestions.length; i++) {
                innerQuestions[i].required = true;
            }
        } else if ((element.type == "text" || element.type == "number") && element.value != 0) {
            hidden.classList.add("expand-after");
            for (i = 0; i < innerQuestions.length; i++) {
                innerQuestions[i].required = true;
            }
        } else {
            continue;
        }

    }
    if (!(document.getElementById("endGame-three").checked)) {
        document.getElementById("ClimbSecond").value = "";
        document.getElementById("ClimbSecond").disabled = true;
        document.getElementById("ClimbSecond").required = false;

    } else {
        document.getElementById("ClimbSecond").disabled = false;
        document.getElementById("ClimbSecond").required = true;

    }

    if (!(document.getElementById("Fall").checked)) {
        document.getElementById("fallTime").value = "";

    }


}

function autoTimeDisplay() {
    var scaleNum = document.getElementById("AutoScaleNum").value;
    var switchNum = document.getElementById("AutoSwitchNum").value;

    if (switchNum > 0) {
        document.getElementById("autoTimeElement").innerHTML = "Switch";
    } else if (scaleNum > 0) {
        document.getElementById("autoTimeElement").innerHTML = "Scale";
    }
}

//Set the URL to send a POST to. If on the server, go to the google script. Otherwise submit to the webpage
var submitURL;
if (window.location.origin.includes("troyappel.com")) {
    submitURL = "https://script.google.com/a/francisparker.org/macros/s/AKfycbxn72bqQg-RBbDd71zobYSnuZcykrRwNBPe_P-vMuE6L1mkU7Q/exec"
} else if (window.location.origin.includes("localhost")) {
    submitURL = "thanksForScouting.html";
} else {
    submitURL = "https://script.google.com/a/francisparker.org/macros/s/AKfycbxn72bqQg-RBbDd71zobYSnuZcykrRwNBPe_P-vMuE6L1mkU7Q/exec"
    alert("There is something wrong with your browser's location. Please make sure to use the site at scout.troyappel.com or use our official scouting programs.")
}

function submitForm() {
    var status = validateData();
    if (status !== true) {
        alert(status);
        return;
    }

    setCookie("name", document.getElementById("ScoutName").value, 30)

    setCookie("number", document.getElementById("ScoutTeamNumber").value, 30)



    var data = serialize(document.getElementById("mainForm"))

    data += ",Version," + version + ","

    console.log(data);

    var form = document.createElement("form");
    var element1 = document.createElement("input");

    form.style.display = "none";
    element1.style.display = "none";

    form.method = "POST";
    form.action = submitURL;

    element1.value = data;
    element1.name = "data";

    form.appendChild(element1);

    document.body.appendChild(form);

    form.submit();


}

function clearData() {
    document.getElementsByTagName("input").innerHTML = "";

    g2d.drawImage(fieldImage, 0, 0, canvas.width, canvas.height);
    savedPosition = "";
}

//returns PROMISE that resolves with string of response. Callback is optional, if no callback then this returns a Promise object
function httpPostAsynchronous(url, callback, failCallback) {
    var httpPromise = new Promise(function(resolve, reject) {
        if (!url) {
            reject("Url to get is undefined");
            return;
        }

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                var data = xmlHttp.responseText;
                resolve(data);
                return;
            }
            if (xmlHttp.status == 403) {
                reject(xmlHttp.status);
                return;
            }
            if (xmlHttp.status == 400) {
                reject(xmlHttp.status);
                return;
            }
        }
        xmlHttp.open("POST", url, true); // true for asynchronous
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        xmlHttp.send(null);
    });

    //If there is a callback, no need to return anything; just ensure it is called after resolutiojn
    if (callback) {
        httpPromise.then(callback);
        if (failCallback) {
            httpPromise.catch(failCallback)
        }
    } else {
        return httpPromise;
    }
}

function validateData() {
    // if(!(document.getElementById("ScaleCubeNumber").value == 0) || !(document.getElementById("SwitchCubeNumber").value == 0)){
    //   if(document.getElementById("time-four").checked){
    //     return "Please input a placement time";
    //   }
    // }
    // if (document.getElementById("endGame-three").checked) {
    //     if (document.getElementById("ClimbSecond").value == 0) {
    //         return "Please input a climb time";
    //     }
    //     if (!(document.getElementById("NoShow").checked)) {
    //         if (!savedPosition) {
    //             return "Starting position not checked";
    //         }
    //     }
    // }
    // if (savedPosition == ""&&document.getElementById("NoShow").value==noshow) {
    //     return "Please select a auto start position";
    // }
    return true;
}

function openBetting(id1, id2) {
    var x = document.getElementById(id1);
    var y = document.getElementById(id2);
    x.classList.add("page-disappear");
    y.classList.remove("page-disappear");


}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    //checks if a cookie exists, if it does it returns it, if not it returns null
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
}

//Shamelessly ripped from StackOverflow
function serialize(form) {
    var field, s = [];
    if (typeof form == 'object' && form.nodeName == "FORM") {
        var len = form.elements.length;
        for (i = 0; i < len; i++) {
            field = form.elements[i];
            if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
                if (field.type == 'select-multiple') {
                    for (j = form.elements[i].options.length - 1; j >= 0; j--) {
                        if (field.options[j].selected)
                            s[s.length] = encodeURIComponent(field.name) + "," + encodeURIComponent(field.options[j].value);
                    }
                } else if ((field.type != 'checkbox' && field.type != 'radio')) {
                    //If field type is number, we want to default it to 0; other
                    if (field.type == "number" && !field.value) {
                        s[s.length] = encodeURIComponent(field.name) + "," + 0;

                    } else {
                        s[s.length] = encodeURIComponent(field.name) + "," + encodeURIComponent(field.value);
                    }
                } else if (field.type == "checkbox") {
                    if (field.checked) {
                        s[s.length] = encodeURIComponent(field.name) + "," + (field.value | 1);
                    } else {
                        s[s.length] = encodeURIComponent(field.name) + "," + "0";
                    }
                } else if (field.type == "radio" && field.checked) {
                    s[s.length] = encodeURIComponent(field.name) + "," + encodeURIComponent(field.value);

                }
            }
        }
    }
    return s.join(',');
}