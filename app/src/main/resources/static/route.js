/**
 * 
 * initilise route object
 */
var currentBookVersion = '';

function initRoute() {


    var viewPage = function(rawRrl) {
        console.log("rawRrl is : " + rawRrl);
        var treeNodeId = '';
        if (rawRrl.toLowerCase().includes(".htm")) {
            console.log("is html" + rawRrl);
            treeNodeId = decodingURL(rawRrl);
        } else if (rawRrl.toLowerCase().endsWith('.pdf')) {
            treeNodeId = rawRrl;
        } else {
            // root
            console.log("Root in router");
            if (rawRrl.startsWith("OPCS")) {
                console.log("OPCS Root in router");
                treeNodeId = rawRrl + '/volume1-cover.html';
            } else {
                console.log("ICD Root in router");
                treeNodeId = rawRrl + "/vol1" + '/volume1-cover.html';
            }

        }

        var bookVersion = getBookVersion(rawRrl);
        console.log("bookVersion is : " + bookVersion);
        if (currentBookVersion != bookVersion) {
            resfreshJSTree(bookVersion);
            currentBookVersion = bookVersion;
        }

        isHomePage(false);
        updateBookContent(treeNodeId);
        updatePageTitle(treeNodeId);



        //update title
        $('#treeNav').on('redraw.jstree', function() {
            setTtitleVersion(bookVersion);
        });
    };



    var homePage = function() {
        console.log("homePage Function");
        isHomePage(true);
    };

    var errorPage = function() {
        console.log("errorPage Function");
        setTtitleVersion("");
        // console.debug("got here too");
        // var html="<h1>Page not found.</h1><p>If you entered a web address
        // please check it was correct.</p>";
        var frame = $('#iContent')[0];
        // frame.src=html;
        frame.contentWindow.location.replace('/error');
    };



    var routes = {
        '/book': {
            '/(.*)': viewPage,
        },
        '/': homePage,
        '.+': errorPage,
    };

    var router = Router(routes);
    router.init(['/']);
}

function getBookVersion(rawUrl) {

    var arr = rawUrl.split("/");
    return arr[0];
}

function setTtitleVersion(bookVersion) {
    $('#titleVersion').html('Classifications Browser ' + bookVersion);
}

function resfreshJSTree(bookVersion) {
    setTtitleVersion("");
    if (bookVersion !== '') {
        var url = window.location.href;
        var arr = url.split("/");


        var hostPath = arr[0] + "//" + arr[2];

        $('#treeNav').jstree(true).settings.core.data.url =
            hostPath + '/' + bookVersion + '/' + bookVersion + '.json';
        $('#treeNav').jstree(true).refresh();
    }
}

function isHomePage(isYes) {
    var mainPanel = document.getElementById('wrenDiv');
    var landing = document.getElementById('landingDiv');
    if (isYes) {
        mainPanel.style.display = 'none';
        landing.className = 'landing_show';
        jQuery
            .ajax({
                url: 'landing.html',
                dataType: 'html',
            })
            .done(function(responseHtml) {
                $('#landingDiv').html(responseHtml);
            });
    } else {
        mainPanel.style.display = 'block';
        landing.className = 'landing_hide';
        if (window.location.href.indexOf('#/book/OPCS-4') > -1) {
            checkIfAcceptedOPCS4();
        } // opcs
    }
}

/**
 * replace # to +
 * 
 * @param {type}
 *            url
 * @returns url like OPCS-4.8/v1intro.html+INTRO_The_Revision_Process
 */
function encodingURL(url) {
    return url.replace('#', '+');
}

/**
 * replace + to #
 * 
 * @param {type}
 *            url
 * @returns url like OPCS-4.8/v1intro.html#INTRO_The_Revision_Process
 */
function decodingURL(url) {
    return url.replace('+', '#');
}
/**
 * update iframe url and sync tree, ribbon
 * 
 * @param {type}
 *            url
 * @returns {undefined}
 */
function updateBookContent(url) {
    var frame = $('#iContent')[0];
    frame.contentWindow.location.replace(url);
    selectNode(url);
    // OPCS-4.8/volume1-p1.html#P1-0018DFAF00F06916C465F522D88E5744_anchor

    makeGaEntry();
}
/**
 * Update page title when router triggered.
 * 
 * @param {type}
 *            treeNodeId
 * @returns {undefined}
 */
function updatePageTitle(treeNodeId) {
    var selectedNode = $('#treeNav').jstree(true).get_node(treeNodeId);
    var parents;
    var pageTitle = '';
    if (selectedNode === false) {
        var tree_id = theClosestTreeId();
        if (tree_id !== undefined) {
            selectedNode = $('#treeNav').jstree(true).get_node(tree_id);
            parents = $('#treeNav').jstree(true).get_node(tree_id).parents;
        } else {
            parents = null;
        }
    } else {
        parents = selectedNode.parents;
    }
    if (null !== parents) {
        pageTitle += $('#treeNav').jstree(true).get_node(parents[parents.length - 2]).text + ' ';
        pageTitle += selectedNode.text;
    } else {
        pageTitle = 'Classifications Browser';
    }
    document.title = pageTitle;
}

function setLastPostionBeforeForwarding() {
    var tree_id = theClosestTreeId();
    if (tree_id !== undefined) {
        console.log("setLastPostionBeforeForwarding treeid: " + tree_id);
        var url = '#/book/' + encodingURL(tree_id);

        console.log("setLastPostionBeforeForwarding: " + url);
        window.location.href = url;
        updatePageTitle(tree_id);
    }
}

function theClosestTreeId() {
    var positionY = $('#iContent').contents().scrollTop();
    return findValidAnchor(positionY);
}