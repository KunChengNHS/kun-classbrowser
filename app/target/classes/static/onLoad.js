/**
 * 
 * initilise tree object
 */

$('#treeNav').jstree({
    core: {
        data: [''],
        error: function(err) {
            var mainPanel = document.getElementById('wrenDiv');
            var landing = document.getElementById('landingDiv');

            mainPanel.style.display = 'none';
            landing.className = 'landing_show';
            jQuery
                .ajax({
                    url: '404.html',
                    dataType: 'html',
                })
                .done(function(responseHtml) {
                    $('#landingDiv').html(responseHtml);
                });
        },
    },
    plugins: ['checkbox'],
    checkbox: {
        keep_selected_style: false,
        visible: false,
        //do not cascade parents node when select single node.
        three_state: false,
        whole_node: false, // to avoud click node when checking.
        tie_selection: false, //checkbox apis take over control jstree api.
    },
});

/**
 * click tree node event
 */
$('#treeNav').on('select_node.jstree', function(e, data) {
    if (data.selected.length && data.event !== undefined) {
        var url = data.instance.get_selected(true)[0].id;
        var final_url = '#/book/' + encodingURL(url);
        //fina_url like #/book/OPCS-4.8/v1intro.html+INTRO_The_Revision_Process
        console.log("select_node.jstree fun: " + final_url);
        setLastPostionBeforeForwarding();
        window.location.href = final_url;
    }
});
/**
 * Initialise router after tree fully loaded, otherwise expand tree 
 * and ribbon will not work
 */
$('#treeNav').bind('ready.jstree', function(e, data) {
    console.log("ready.jstree");
    initRoute();
});

var iContentEL = document.getElementById('iContent');

function buttonClick(src) {
    iContentEL.src = src;
    iContentEL.contentWindow.postMessage(src, '*');
}
window.addEventListener('message', function(event) {
    if (event.data.event_id === 'iframe_url_click') {
        setLastPostionBeforeForwarding();
        window.location.href = event.data.router_url;
    }
});

/*
 * browser version check
 */
var $buoop = { required: { e: -3, f: -3, o: -3, s: -1, c: -3 }, insecure: true, api: 2019.03 };

function $buo_f() {
    var e = document.createElement('script');
    e.src = '//browser-update.org/update.min.js';
    document.body.appendChild(e);
}
try {
    document.addEventListener('DOMContentLoaded', $buo_f, false);
} catch (e) {
    window.attachEvent('onload', $buo_f);
}

/*
 * license
 * 
 */
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + '=');
        if (c_start !== -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(';', c_start);
            if (c_end === -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return '';
} // getCookie

function getOpcs4LicenseName() {
    return 'OPCS4Licence';
} // getOpcs4LicenseName

function checkIfAcceptedOPCS4() {
    if (getCookie(getOpcs4LicenseName()) !== 'true') {
        jQuery
            .ajax({
                url: 'opcs4-license.html',
                dataType: 'html',
            })
            .done(function(responseHtml) {
                $('#licenseOpcs4Div').html(responseHtml);
            });
    } // if cookie not true
} // checkIfAcceptedOPCS4

/*
 * Google GA
 */
function makeGaEntry(reportType, reportMsg) {
    if (typeof ga == 'function') {
        reportType =
            reportType == 'exception' ? reportType : reportType == 'search' ? reportType : 'pageView';
        ga('set', 'anonymizeIp', true);

        ga(
            'set',
            'location',
            '' +
            (reportType == 'search' ? '' + '/?searchTerm=' + reportMsg + '&' : '?') +
            'p=page' +
            '/' +
            window.location.pathname +
            window.location.hash
        ); // location

        if (reportType == 'exception') {
            ga('send', {
                hitType: 'event',
                eventCategory: 'exception category',
                eventAction: 'error happen',
                eventLabel: reportMsg,
            });
        } else {
            // if exc
            ga('send', 'pageview');
        } // else exc
    } // if ga
} // makeGaEntry

/**
 * Catch error
 */
function catchErrorDsp(errorMsg, url, lineNumber) {
    var _lineNumber = typeof lineNumber == 'number' ? lineNumber : '';
    var errorMessage =
        '' +
        'errorMsg: ' +
        errorMsg +
        (typeof url == 'undefined' ? '' : '' + '\nScript: ' + url) +
        (_lineNumber == '' ? '' : '' + '\nLine: ' + _lineNumber);
    reportOnError(errorMessage);
} // catchErrorDsp

function reportOnError(errorMessage) {
    // It is possible, that makeGaEntry is not available yet
    if (typeof ga == 'function') {
        makeGaEntry('exception', errorMessage);
    } else {
        // if ga
        // not loaded yet
        setTimeout(function() {
            makeGaEntry('exception', errorMessage);
        }, 2000);
    } // else ga

    var img = document.createElement('img');
    var encodedMsg =
        '' + (typeof encodeURIComponent == 'function' ? encodeURIComponent(errorMessage) : errorMessage);
    img.src = '' + './images/onErrorImg.png?' + encodedMsg;
} // reportOnError

window.onerror = catchErrorDsp;