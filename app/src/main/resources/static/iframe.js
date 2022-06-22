// add mouse down listener
var bodyEl = document.getElementsByTagName("BODY")[0],
    myWin = bodyEl.ownerDocument.defaultView;
myWin.addEventListener('mousedown', contentClick);

/**
 * This function match with mouse down event to handle all of the hyper link click event. 
 * including internal links(code inside the content html), 
 * external links,
 * NCCS links. 
 * @param {type} e event object
 */
function contentClick(e) {
    var clickObj = e.target;
    clickObj.onclick = function(e) {
        stopDefault(e);
    };
    var currentHref = "";
    if (clickObj.localName === 'a') {
        currentHref = clickObj.href;


    } else if (clickObj.localName === 'span' && clickObj.parentElement.localName === 'a') {
        currentHref = clickObj.parentElement.href;

    }
    // icd10 have a lof of a tag without herf <a name="A00-A09" id="A00-A09" class="anchor valid_tree_node valid_node">xxx </a>
    if (currentHref !== "") {
        openURL(currentHref);
    }
}
/**
 * Determining how to open url.  
 * @param {type} currentHref
 */
function openURL(currentHref) {
    if (currentHref.indexOf(window.location.host) >= 0 && currentHref.toUpperCase().indexOf(".PDF") === -1 &&
        currentHref.toUpperCase().indexOf(".XLS") === -1) {
        openInternalURL(currentHref);
    } else {
        openInNewWinow(currentHref);
    }
}
/**
 * open internal url 
 * @param {type} url
 * @returns {undefined}
 */
function openInternalURL(url) {

    var urls = url.split("/");
    var pageVithAnchor = "";
    var urlsLenght = urls.length;
    if (urlsLenght === 5) {
        //opcs
        pageVithAnchor = urls[urlsLenght - 2] + "/" + urls[urlsLenght - 1];
    } else {
        //icd10
        pageVithAnchor = urls[urlsLenght - 3] + "/" + urls[urlsLenght - 2] + "/" + urls[urlsLenght - 1];
    }
    var final_url = "#/book/" + encodingURL(pageVithAnchor);
    console.log("openInternalURL ", url, " final_url ", final_url);
    console.log("openInternalURL ", urls);
    //send to parent for update Ribbon, url, tree
    window.parent.postMessage({
            event_id: 'iframe_url_click',
            router_url: final_url
        },
        "*" //or "www.parentpage.com"
    );
    //    location.href = url;
}

function encodingURL(url) {
    return url.replace("#", "+");
}
/**
 *  to stop hyperlink forward behavoir. 
 * @param {type} e html event object
 * @returns {undefined}
 */
function stopDefault(e) {
    if (e && e.preventDefault)
        e.preventDefault();
    else
        window.event.returnValue = false;
}

/**
 * open external url on the new window. 
 * @param {type} url
 * @returns {undefined}
 */
function openInNewWinow(url) {
    if (url.toUpperCase().indexOf(".PDF") !== -1) {
        //if PDF file
        var win = window.open(url, 'NCCS_PDF');
        win.addEventListener("hashchange", function() {
            this.location.reload();
        }, false);
        if (window.focus) {
            win.focus();
        }

        if (!win.closed) {
            win.focus();
        }

    } else {
        var win = window.open(url, '_blank');
        win.focus();
    }

}

//loadjscssfile("https://hypothes.is/embed.js", "js", true);
//
//function loadjscssfile(filename, filetype, isAsync) {
//    if (filetype === "js") {
//        var fileref = document.createElement('script');
//        fileref.setAttribute("type", "text/javascript");
//        fileref.setAttribute("src", filename);
//        if (isAsync)
//            fileref.setAttribute("async", "async");
//    } else if (filetype === "css") {
//        var fileref = document.createElement("link");
//        fileref.setAttribute("rel", "stylesheet");
//        fileref.setAttribute("type", "text/css");
//        fileref.setAttribute("href", filename);
//    }
//    if (typeof fileref !== "undefined")
//        document.body.appendChild(fileref);
//}