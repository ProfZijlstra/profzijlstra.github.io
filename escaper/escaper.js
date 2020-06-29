// made by Michael Zijlstra 28 June 2020
"use strict";

/**
 * @namespace ESCAPER
 */
const ESCAPER = Object.create(null);

window.onload = () => {
    /* *****************************************************************
    * Our 'global' variables
    ********************************************************************/
    ESCAPER.input = document.getElementById("input");
    ESCAPER.output = document.getElementById("output");
    ESCAPER.autoPaste = document.getElementById("autoPaste");
    ESCAPER.autoCopy = document.getElementById("autoCopy");
    ESCAPER.addPre = document.getElementById("addPre");

    /* *****************************************************************
     * First our private helper functions
     * 
     * Cookie functions from:  https://www.quirksmode.org/js/cookies.html
     * Addtional cooie info from: https://javascript.info/cookie
    ********************************************************************/

    /**
     * Creates a cookie with given name, and value that last for days
     * 
     * @param {String} name of cookie 
     * @param {String} value of cookie
     * @param {Number} days it lasts
     * @returns {undefined}
     */
    function createCookie(name, value, days) {
        name = encodeURIComponent(name);
        value = encodeURIComponent(value);
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        }
        document.cookie = `${name}=${value}${expires}; path=/; samesite=strict`;
    }

    /**
     * Gives the value of the given cookie name
     * 
     * @param {String} name of cookie
     * @returns {String} the value
     */
    function readCookie(name) {
        const nameEQ = name + "=";
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            let char = cookies[i];
            while (char.charAt(0) === " ") {
                char = char.substring(1, char.length);
            }
            if (char.indexOf(nameEQ) == 0) {
                return char.substring(nameEQ.length, char.length);
            }
        }
        return null;
    }

    /**
     * Removes the cookie with the given name
     * 
     * @param {String} name of cookie
     * @returns {undefined}
     */
    function eraseCookie(name) {
        createCookie(name, "", -1);
    }

    /**
     * Converts the given text to an escaped version and places it in output
     * 
     * @param {String} text to covert
     * @returns {undefined}
     */
    function convert(text) {
        text = ESCAPER.escapeHtml(text);
        if (ESCAPER.addPre.checked) {
            text = `<pre>\n${text}\n</pre>`;
        }
        ESCAPER.output.innerText = text;
        if (ESCAPER.autoCopy.checked && navigator.clipboard) {
            navigator.clipboard.writeText(text);
        }
    }

    /**
     * Helper method to create or erase cookies for checkboxes
     * 
     * @param {String} name of cookie
     * @returns {undefined}
     */
    function handlerHelper(name) {
        if (this.checked) {
            createCookie(name, true, 14);
        } else {
            eraseCookie(name);
        }
    }

    /* *****************************************************************
     * Our single public function
    ********************************************************************/

    /**
     * Escapes html in the given unsafe string
     * 
     * @param {String} unsafe html string
     * @returns {String} version with html chars escaped
     */
    ESCAPER.escapeHtml = function (unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    /* *****************************************************************
     * Our window.onload actions
    ********************************************************************/
    // hook up event handlers
    ESCAPER.input.onpaste = (evt) => {
        convert(evt.clipboardData.getData("text"));
    };
    ESCAPER.input.onkeypress = () => {
        convert(this.value);
    };

    // for each of the checkbox options
    ["autoPaste", "autoCopy", "addPre"].forEach(elm => {
        // Curry the helper to create our event handler
        ESCAPER[elm].onclick = handlerHelper.bind(ESCAPER[elm], elm);
        // if cookie is set
        if (readCookie(elm)) {
            // make sure checkbox is set
            ESCAPER[elm].checked = true;
            // and make sure cookie is refreshed
            ESCAPER[elm].onclick();
        }
    });

    // check to enable clipboard functionality (generally requires https)
    if (navigator.clipboard) {
        document.getElementById("autoCopyArea").classList = "";
        if (navigator.clipboard.readText) {
            document.getElementById("autoPasteArea").classList = "";
        }
    }

    // perform auto paste functionality if desired
    if (ESCAPER.autoPaste.checked && navigator.clipboard
            && navigator.clipboard.readText) {
        navigator.clipboard.readText().then(text => {
            ESCAPER.input.value = text;
            convert(text);    
        });
    }
};
