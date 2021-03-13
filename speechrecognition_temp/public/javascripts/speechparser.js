// On load, retrieve XML mappings and save to global variables
var actions = [];
var objects = [];
var functions = [];

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        retrieveMappings(this);
    }
};
xmlhttp.open("GET", "mappings/speechmapping.xml", true);
xmlhttp.send();

//Populate variables with speech mapping values
function retrieveMappings(xml) {

    var i, xmlDoc, xmlKey, xmlWord, xmlFName, xmlFAKey, xmlFOKey;

    xmlDoc = xml.responseXML;

    // Build list of Actions
    xmlKey = xmlDoc.getElementsByTagName("ACTION_ACTION_KEY");
    xmlWord = xmlDoc.getElementsByTagName("ACTION_KEYWORDS");

    for (i = 0; i < xmlKey.length; i++) {
        let action = new Action(xmlKey[i].childNodes[0].nodeValue, xmlWord[i].childNodes[0].nodeValue);
        actions.push(action);

    }

    // Build list of Objects
    xmlKey = xmlDoc.getElementsByTagName("OBJECT_OBJECT_KEY");
    xmlWord = xmlDoc.getElementsByTagName("OBJECT_KEYWORDS");

    for (i = 0; i < xmlKey.length; i++) {
        let object = new Object(xmlKey[i].childNodes[0].nodeValue, xmlWord[i].childNodes[0].nodeValue);
        objects.push(object);
    }

    // Build list of Functions
    xmlFName = xmlDoc.getElementsByTagName("FUNCTION_NAME");
    xmlFAKey = xmlDoc.getElementsByTagName("ACTION_KEY");
    xmlFOKey = xmlDoc.getElementsByTagName("OBJECT_KEY");

    for (i = 0; i < xmlFName.length; i++) {
        let func = new Function(xmlFName[i].childNodes[0].nodeValue, xmlFAKey[i].childNodes[0].nodeValue, xmlFOKey[i].childNodes[0].nodeValue);
        functions.push(func);
    }

    console.log(actions);
    console.log(objects);
    console.log(functions);

    console.log("End On Load XML")


}

function testSpeech() {

    console.log("Enter Test Speech");

    let speechParser = new SpeechParser();
    var testString = "I want to go to my profile"
    var result = speechParser.getFunctionName(testString);

    if (result == "") {
        console.log("Cannot find a function");
    }
    else {
        console.log(result);
    }

}



class SpeechParser {
    constructor() { }

    getFunctionName(inputString) {
        console.log("Enter getFunctionName with input: " + inputString);

        // 1. Input is a speech string
        // 2. Parse speech string to words
        // 3. Match each word to either an action keyword or object keyword
        // 4. Output is an action key and an object key
        // Assumption is the last match will be taken (ex. I want to "go" "send" a message, the last action word send will be used)

        var parseSpeechInput = inputString.split(" ");
        // Remove blank spaces
        parseSpeechInput = parseSpeechInput.filter(item => item);
        console.log(parseSpeechInput);

        var actionMatch = "";
        var objectMatch = "";

        parseSpeechInput.forEach(word => {

            actions.forEach(a => {

                var aKeyword = a.action_keywords.split("~");
                aKeyword.forEach (w => {

                    if (w.toLowerCase() == word.toLowerCase()) {
                        console.log("found action match: " + word);
                        actionMatch = a.action_key;
                    }               
                });
            });

            objects.forEach(o => {

                var oKeyword = o.object_keywords.split("~");
                oKeyword.forEach (w => {

                    if (w.toLowerCase() == word.toLowerCase()) {
                        console.log("found object match: " + word);
                        objectMatch = o.object_key;
                    }
                    
                });
            });

        });

        console.log("My action key is: " + actionMatch);
        console.log("My object key is: " + objectMatch);


        // Determine Function Name based on action key and object key
        var functionMatch = "";

        functions.forEach(f => {

            if (f.action_key == actionMatch && f.object_key == objectMatch) {
                functionMatch = f.function_name;
            }
        });

        return functionMatch;
    }
}

class Action {
    constructor(action_key, action_keywords) {
        this.action_key = action_key;
        this.action_keywords = action_keywords;
    }
}

class Object {
    constructor(object_key, object_keywords) {
        this.object_key = object_key;
        this.object_keywords = object_keywords;
    }
}

class Function {
    constructor(function_name, action_key, object_key) {
        this.function_name = function_name;
        this.action_key = action_key;
        this.object_key = object_key;
    }
}

