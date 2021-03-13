class SpeechFunction {
    constructor() {}

    executeFunction(function_name) {
        
        switch (function_name) {
            case "nav_chatrooms":
                nav_chatrooms();
                break;
            case "nav_feed":
                nav_feed();
                break;            
            case "nav_profile":
                nav_profile();
                break;            

            default:
                console.log("Did not find function to execute");
        }


    }
}


// Add Speech Functions Below. Try to keep consistent with speechmappings.
function nav_chatrooms() {
    console.log("Execute nav_chatrooms function");

}

function nav_feed() {
    console.log("Execute nav_feed function");
}

function nav_profile() {
    window.location.href="http://localhost:3000/"
}
