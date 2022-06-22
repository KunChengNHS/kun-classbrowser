(function prepareButtons() {
    var searchInputName = "SearchInput";
    var searchInputObj = document.getElementById(searchInputName);
    window.searchInput_ = searchInputObj;
    if (!searchInputObj) {
        throw new Error("Cannot find: " + searchInputName);
    } // ! searchInputObj
    var SearchHistoryResultsName = "SearchHistoryResults";
    var SearchHistoryResultsObj = document.getElementById(SearchHistoryResultsName);
    if (!SearchHistoryResultsObj) {
        throw new Error("Cannot find: " + SearchHistoryResultsName);
    } // ! SearchHistoryResultsObj
    window.SearchHistoryResults_ = SearchHistoryResultsObj;

    forIE();

    addEventDp(window.searchInput_, "onkeyup", function (event) {
        if (event.key) {
            if (event.key === "Enter") {
                searchOnClick();
            } else { // Enter
                rememberSearch(false);
            } // else Enter
        } else { // if event.key
            /**
             * keycode for IE
             **/
            if (event.keyCode == 13) {
                searchOnClick();
            } else { // Enter
                rememberSearch(false);
            } // else Enter
        } // else event.key
    }); // addEventListener



    var searchButtonName = "SearchButton";
    var searchButtonObj = document.getElementById(searchButtonName);
    if (!searchButtonObj) {
        throw new Error("Cannot find: " + searchButtonName);
    } // ! searchButtonObj
    searchButtonObj.onclick = searchOnClick;


    var searchAdvancedName = "SearchAdvancedOptions";
    var searchAdvancedObj = document.getElementById(searchAdvancedName);
    if (!searchAdvancedObj) {
        throw new Error("Cannot find: " + searchAdvancedName);
    } // ! searchAdvancedObj

    searchAdvancedObj.onclick = AdvancedSearchOnClick;
    window.searchAdvanced = searchAdvancedObj;

    searchResultsSetMouseMove();

})(); // self prepareButtons

/**
 * search results top div
 **/
window.isDownSrtd = false;


function forIE() {
    checkPreviousElementSibling();
} // forIE


function checkPreviousElementSibling() {
    // from: https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/previousElementSibling
    // Source: https://github.com/Alhadis/Snippets/blob/master/js/polyfills/IE8-child-elements.js
    if (!("previousElementSibling" in document.documentElement)) {
        Object.defineProperty(Element.prototype, "previousElementSibling", {
            get: function () {
                var e = this.previousSibling;
                while (e && 1 !== e.nodeType)
                    e = e.previousSibling;
                return e;
            }
        });
    } // if
} // checkPreviousElementSibling



function searchResultsSetMouseMove() {
    var searchResultDivTopName = "frameResultsTop";
    var searchResultDivTopObj = document.getElementById(searchResultDivTopName);
    if (!searchResultDivTopObj) {
        searchResultDivTopObj.cannotFindSearchResultsDivTop.cannotFindSearchResultsDivTop();
    } else { // searchResultDivTopObj
        window.srtd2 = searchResultDivTopObj;
        rsdn = "resultSearchDiv";
        window.resultSearchDiv = document.getElementById(rsdn);
        if (!window.resultSearchDiv) {
            window.resultSearchDiv.cannotFindResultSearchDiv();
        } // ! resultSearchDiv
        window.frameForSearchResults = window.srtd2.parentNode;
        window.swanDiv = window.frameForSearchResults.previousElementSibling;

        addEventDp(searchResultDivTopObj, 'onmousedown', function () {
            $("#swanDiv").css("z-index", "-1");
            srtdmd();
        });
        addEventDp(document.body, 'onmouseup', function () {
            // temp off: window.console.info( "Mouse up");
            window.isDownSrtd = false;
            $("#swanDiv").css("z-index", "100");

        }); // add event on mouse up
        addEventDp(document.body, 'onmousemove', srtdmm);
        setCloseSearchResults();
        setMinimiseSearchResults();

    } // else searchResultDivTopObj
} // searchResultsMove


function srtdmm(event) {
    /**
     * search result top div mouse down
     **/
    if (window.isDownSrtd) {
        clearSelection()

        mousePosition = {

            x: event.clientX,
            y: event.clientY

        };

//frameForResults
//  frameResultsTop
//  resultSearchDiv
        //frameForResults
        var headerHeight = getHeaderHeight();
        window.srtd2.parentNode.style.top = mousePosition.y - headerHeight + 'px'; //85 is header height.
//        window.resultSearchDiv.parentNode.style.height = height - mousePosition.y - window.scrollbarWidth + "px";

        window.swanDiv.style.height = mousePosition.y - getOffsetDp(swanDiv).top + "px";

        if (event.preventDefault) {
            event.preventDefault();
        } // preventDefault
        return false;
    }
} // srtdmm

function clearSelection() {
    /**
     * from: https://stackoverflow.com/a/14788286
     **/
    var sel;
    if ((sel = document.selection) && sel.empty) {
        sel.empty();
    } else {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
        var activeEl = document.activeElement;
        if (activeEl) {
            var tagName = activeEl.nodeName.toLowerCase();
            if (tagName == "textarea" ||
                    (tagName == "input" && activeEl.type == "text")) {
                // Collapse the selection to the end
                activeEl.selectionStart = activeEl.selectionEnd;
            }
        }
    }
}

function srtdmd() {
    /**
     * search result top div mouse down
     **/
    window.isDownSrtd = true;
} // srtdmd

window.ajaxUseTimeout = true;
function searchOnClick() {
    var bla = $('#SearchInput').val();
    if (bla.trim() === "") {
        searchErrorDP(-1, "Search must contain text");
    }
    else if(bla.trim().length < 3){
    	searchErrorDP(-1, "Please enter at least 3 characters");
    }	
    else {
        // before: rememberSearch( true);
        hideSearchHistory();
        var branchObjs = $('#treeNav').jstree(true).get_checked(true);

        var doubleQ = "\"";
        var branchStr = "";
        if (branchObjs.length !== 0) {
            for (var i = 0, length = branchObjs.length; i < length; i++) {
                var currentText = branchObjs[i].text;

                var parentsList = branchObjs[i].parents;
                var parentsStr = "";
                for (var p = parentsList.length - 2; p--; ) {
                    parentsStr += $('#treeNav').jstree(true).get_node(parentsList[p]).text + " ";
                }
                branchStr += doubleQ + parentsStr + currentText + doubleQ;


                if (i !== branchObjs.length - 1) {
                    branchStr += ",";
                }
            }
        }

        var socName = "SearchInput";
        var socObj = document.getElementById(socName);
        if (!socObj) {
            window.console.error("Cannot find: " + socName);
        } else { // if ! soc
            searchWait();
            var xhttp = new XMLHttpRequest();
            var searchText = socObj.value;
            var searchTextForInfo = searchText;
            searchText = searchText.replace(new RegExp("\"", "g"), "\\" + "\"");
            if (window.ajaxUseTimeout) {
                try {
                    xhttp.timeout = 10 * 1000; // time in milliseconds
                } catch (timeoutException) {
                    window.ajaxUseTimeout = false;
                }
            } // window.ajaxUseTimeout

            if (window.ajaxUseTimeout) {
                xhttp.ontimeout = function (e) {
                    searchErrorDP(-1, "Timeout happen");
                }; // ontimeout
            } // ajaxUseTimeout
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        searchResult(searchTextForInfo, this.responseText);
                    } else { // 200
                        searchErrorDP(this.status, this.responseText, bla);
                    } // else 200
                } // 4 
            }; // change


            var search_url = window.location.protocol
                    + "//" + window.location.hostname
                    + "/bookdoc/search";
            xhttp.open(
                    "POST",
                    search_url
                    , true
                    );

            // must be open			
            xhttp.setRequestHeader("accept", "application/json");
            xhttp.setRequestHeader("Content-Type", "application/json");

            var sendSearchRequest = ""
                    + "{  "
                    + "    \"branches\": ["

                    + branchStr
                    + "]"
                    + "  , \"releaseVersions\": ["
                    + "       \""+currentBookVersion+"\""
                    + "     ]"
                    + "  ,  \"searchContent\": \""
                    + searchText + "\""
                    + "  }"
            xhttp.send(sendSearchRequest); // send

            // copy for GA
            makeGaEntry("search", searchText);
        } // else ! soc
    } // else empty search string
}  // search on click

var isAdvanced = false;
function AdvancedSearchOnClick() {
    isAdvanced = !isAdvanced;
    if (window.isAdvanced) {
        $('#treeNav').jstree().show_checkboxes();
    } else {
        $('#treeNav').jstree('uncheck_all');
        $('#treeNav').jstree('hide_checkboxes');
    }
} // AdvancedSearchOnClick 

function setCloseSearchResults() {
    closeX = document.createElement("div");
    closeX.style.position = "absolute";
    closeX.style.top = 1 + "ex";
    closeX.style.right = "3ex";
    closeX.style.cursor = "pointer";
    closeX.title = "Close search results. (It will reopen when you make another search";
    closeX.innerHTML = "&#128473;";
    closeX.style.color = "grey";
    closeX.zIndex = 12;
    closeX.opacity = 0.5;
    closeX.classList.add("closeMiniButton");
    window.frameForSearchResults.appendChild(closeX);

    closeX.onclick = function () {
        window.frameForSearchResults.style.display = "none";
        setIframeDivHeight();

    } // x click
} // createResultDiv

function removeShowSearchResultButton()
{
    var button = document.getElementById("showSearchResultButton")
    if (button) {
        var showSearchResultButton = document.getElementById("showSearchResultButton");
        showSearchResultButton.parentNode.removeChild(showSearchResultButton);
    }

}
function setMinimiseSearchResults() {
    mini = document.createElement("div");
    mini.style.position = "absolute";
    mini.style.top = 1 + "ex";
    mini.style.right = "7ex";
    mini.style.cursor = "pointer";
    mini.title = "Minimise search results. (It will reopen when you make another search";
    mini.innerHTML = "&#128469;";
    mini.style.color = "grey";
    mini.zIndex = 12;
    mini.opacity = 0.5;
    mini.classList.add("closeMiniButton");


    window.frameForSearchResults.appendChild(mini);

    mini.onclick = function () {
        window.frameForSearchResults.style.display = "none";
        setIframeDivHeight();

        var showSearchResultButton = document.createElement("BUTTON");
        var text = document.createTextNode("Show search results");
        showSearchResultButton.appendChild(text);
        showSearchResultButton.id = "showSearchResultButton";
        document.getElementById("wrenDiv").appendChild(showSearchResultButton);
        showSearchResultButton.onclick = function () {
            openSearchDiv();

        }
    }
}


function openSearchDiv() {
    removeShowSearchResultButton();
    window.frameForSearchResults.style.display = 'block'; /// does not work for IE8 "initial";
    window.swanDiv.style.height = ""
            + (getOffsetDp(window.frameForSearchResults).top
                    - getOffsetDp(swanDiv).top

                    )
            + "px"
            ;
    //} // else window.pesSupported
} // openSearchDiv

function searchWait() {
    openSearchDiv();
    document.getElementById("resultMsg").innerHTML = "<br>Searching, please wait for results ....";
} // searchWait
function searchErrorDP(errStatus, errResponseText)
{
    searchErrorDP(errStatus, errResponseText, "");
}
function searchErrorDP(errStatus, errResponseText, searchContent) {

    if ($('#resultSearchTree').jstree(true) !== false) {
        $('#resultSearchTree').jstree(true).settings.core.data = null;
        $('#resultSearchTree').jstree(true).refresh();
    }
    var srObj = document.getElementById("resultMsg");
    openSearchDiv();
    var errorMsg = "";
    if (errStatus === 0 || errStatus === 12029)
    {  // old IE
        errorMsg = "Search is temporary not available. Try again later, please!";
    } else if (errStatus === 500)
    {
        errorMsg = "No result found: " + searchContent;
    } else
    {
        errorMsg = errResponseText;
    }
    srObj.innerHTML = "<br>" + errorMsg;

    var scrollToTop = true;
    srObj.scrollIntoView(scrollToTop);
    reportOnError(srObj.innerHTML);


} // searchErrorDP


/**
 * click tree node event
 */
$('#resultSearchTree').on("select_node.jstree", function (e, data) {
    if (data.selected.length && data.event !== undefined) {


        var url = data.instance.get_selected(true)[0].id;
        var final_url = "#/book/" + encodingURL(url);
        //fina_url like #/book/OPCS-4.8/v1intro.html+INTRO_The_Revision_Process
        window.location.href = final_url;
    }

});
$('#resultSearchTree').on('ready.jstree', function (e, data) {
    $("#resultSearchTree").jstree("open_all");
});

function searchResult(searchText, searchJson) {

    var arrJson = JSON.parse(searchJson);
    openSearchDiv();
    var srObj = window.resultSearchDiv;
    document.getElementById("resultMsg").innerHTML = "";
    if (arrJson.hasOwnProperty("children") === true) {
        rememberSearch(true);
    } // if found


    $('#resultSearchTree').jstree({});
    $('#resultSearchTree').jstree(true).settings.core.data = arrJson;
    $('#resultSearchTree').jstree(true).refresh();






    var scrollToTop = true;
    srObj.scrollIntoView(scrollToTop);

    openSearchDiv();
} // searchResult



function searchClick(url) {
    var final_url = "#/book/" + encodingURL(url);
    window.location.href = final_url;

} // searchClick

function addEventDp(obj, evnt, func) {
    // Though for more cross-browser compatibility, you may want a function like the below, as older IE versions use .attachEvent instead of .addEventListener
    if (typeof func !== 'function') {
        devAsWindowDp("This is not function");
        return false;
    } // typeof func !== 'function'
    if (typeof obj.addEventListener == 'function') {
        return obj.addEventListener(evnt.replace(/^on/, ''), func, false);
    } // typeof obj.addEventListener == 'function'
    if (typeof obj.attachEvent == 'function' || typeof obj.attachEvent == 'object') {
        return obj.attachEvent(evnt, func);
    } // typeof obj.attachEvent == 'function' || typeof obj.attachEvent == 'object'
    if (evnt == "onload") {
        setTimeout(func, 0);
        return false;
    } // evnt onload
    divAsWindowDsp("Sorry, cannot add new function into event");
    return false;
} // addEventDsp










function rememberSearch(addToStorage) {
    /**
     * As requested by Andrew:
     *	- no duplicates
     *	- no time
     * 	- persist
     **/
    if (typeof (Storage) !== "undefined") {

        var fs_obj = window.searchInput_;
        if (!fs_obj) {
            searchErrorDP(-123, "Cannot find search input for remember search");
        } else { // if fs do not exist
            // If you want your data to persist across pages on the same origin, use localStorage instead.
            // Opening a page in a new tab or window will cause a new session to be initiated
            findBy = (1 == 11 ? sessionStorage : localStorage);

            var clearBoolean = false;
            if (clearBoolean) {
                /**
                 * Works for both: sessionStorage and localStorage
                 **/
                findBy.removeItem("sessionRememberSearch");
            } // clearBoolean

            if (addToStorage) {
                if (findBy.sessionRememberSearch) {
                    // pass
                } else { // has previous
                    findBy.sessionRememberSearch = "\n";
                } // else has previous

                findBy.sessionRememberSearch += ""
                        + (findBy.sessionRememberSearch.indexOf("\n" + fs_obj.value + "\n") == -1
                                ? ""
                                + fs_obj.value
                                + "\n"
                                : ""
                                )
                        ;
            } else { // addToStorage
                if (fs_obj.value.trim().length > 2) {
                    var glastName = "Glast";
                    window.SearchHistoryResults_.innerHTML = ""
                            + "<div id = \""
                            + glastName
                            + "\">"
                            + "</div></i>"
                            ;
                    window.SearchHistoryResults_.style.border = "solid 1px gray";
                    window.SearchHistoryResults_.style.padding = "1ex";
                    var glastObj = document.getElementById(glastName);
                    if (!glastObj) {
                        throw new Error("Cannot find: " + glastName);
                    } // ! glastObj
                    var foundSearch = 0;
                    var sessionSearch = (!findBy ? "" : (!findBy.sessionRememberSearch ? "" : findBy.sessionRememberSearch.trim())).split("\n");
                    for (var searchLoop = 0; searchLoop < sessionSearch.length; searchLoop++) {
                        var searchStart = sessionSearch[ searchLoop].indexOf(window.searchInput_.value);
                        if (searchStart > -1
                                || window.searchInput_.value == "***"
                                ) {
                            foundSearch++;
                            var loopDiv = document.createElement("div");
                            loopDiv.innerHTML = ""
                                    + (searchStart > -1
                                            ? ""
                                            + sessionSearch[ searchLoop].substr(0, searchStart)
                                            + "<b>"
                                            + window.searchInput_.value.replace(new RegExp("<", "g"), "&lt;").replace(new RegExp("&", "g"), "&amp;")
                                            + "</b>"
                                            + sessionSearch[ searchLoop].substr(searchStart + window.searchInput_.value.length)
                                            : ""
                                            + sessionSearch[ searchLoop].replace(new RegExp("<", "g"), "&lt;").replace(new RegExp("&", "g"), "&amp;")
                                            )
                                    ;
                            loopDiv.forClick = sessionSearch[ searchLoop];
                            loopDiv.onclick = searchFromHistory;
                            glastObj.appendChild(loopDiv);
                        } // searchStart > -1
                    } // loop search
                    if (foundSearch < 1) {
                        hideSearchHistory();
                    }
                } else { // len > 2
                    hideSearchHistory();
                } // else len > 2
            } // else addToStorage
        } // else fs do not exists
    } else {
        searchErrorDP(-124, "Sorry, your browser does not support web storage...");
    }
} // rememberSearch

function searchFromHistory() {
    window.searchInput_.value = this.forClick;
    searchOnClick();
} // searchFromHistory

function hideSearchHistory() {
    window.SearchHistoryResults_.innerHTML = "";
    window.SearchHistoryResults_.style.border = "";
    window.SearchHistoryResults_.style.padding = "0";
} // hideSearchHistory

function restoreSearch(search) {
    window.debug.info(search);
} // restoreSearch

/**
 * 
 * Hide search history panel.
 */
var isOnDiv = false;
$("#SearchHistoryResults").mouseenter(function () {
    isOnDiv = true;
});
$("#SearchHistoryResults").mouseleave(function () {
    isOnDiv = false;
});
function hideSearchHistoryDiv()
{
    if (isOnDiv === false)
    {
        hideSearchHistory();
    }
}

function getOffsetDp(element) {
    var _x = 0;
    var _y = 0;
    while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
        _x += element.offsetLeft;// for current position: - element.scrollLeft;
        _y += element.offsetTop; // for current position: - element.scrollTop;
        element = element.offsetParent;
    }
    return {top: _y, left: _x};
} // getOffsetDp
 