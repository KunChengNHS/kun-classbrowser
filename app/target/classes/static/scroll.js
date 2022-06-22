var timer;

/**
 * Attach scroll event when iframe loaded. 
 */
$("#iContent").on('load', function() {
    iframeScroll();
    var iframe = $("#iContent").contents();
    $(iframe).scroll(function() {
        //your code here
        if (timer) {
            window.clearTimeout(timer);
        }
        timer = window.setTimeout(function() {
            iframeScroll();
        }, 200);
    });
});


function iframeScroll() {
    var positionY = $('#iContent').contents().scrollTop();
    var tree_id = findValidAnchor(positionY);
    selectNode(tree_id);
}

/**
 * 
 * @param {type} positionY
 */
function findValidAnchor(positionY) {
    var els = $('#iContent').contents().find('.valid_tree_node');
    if (els.length === 0)
        return;
    var anchor = closest(positionY, els);
    var iframe_src_url = $('#iContent').contents().get(0).location.href;
    var urls = iframe_src_url.split("/");
    console.log("findValidAnchor urls", urls);
    var pageVithAnchor = "";
    var urlsLenght = urls.length;
    if (urlsLenght === 5) {
        //opcs
        pageVithAnchor = urls[urlsLenght - 2] + "/" + urls[urlsLenght - 1];
    } else {
        //icd10
        pageVithAnchor = urls[urlsLenght - 3] + "/" + urls[urlsLenght - 2] + "/" + urls[urlsLenght - 1];
    }
    console.log("findValidAnchor pageVithAnchor  ", pageVithAnchor);
    var hashArray = pageVithAnchor.split("#");
    var lastPart = "";
    if (anchor.getAttribute("id") === null) {
        lastPart = anchor.getAttribute("name");

    } else {
        lastPart = anchor.getAttribute("id");
    }
    return hashArray[0] + "#" + lastPart;

}

/**
 * 
 * @param {type} py postion Y
 * @param {type} arr array of valid tree node in the html file.
 * @returns {closest.arr} return cloest element
 */
function closest(py, arr) {
    var mid;
    var lo = 0;
    var returnValue;
    var hi = arr.length - 1;
    while (hi - lo > 1) {
        mid = Math.floor((lo + hi) / 2);
        if (arr[mid].offsetTop < py) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    var loD = arr[lo].offsetTop - py;
    var hiD = arr[hi].offsetTop - py;
    var diff = arr[hi].offsetTop - arr[lo].offsetTop;

    if (hiD >= 0 && hiD <= 1 || (loD < 0 && hiD < 0)) {
        returnValue = arr[hi];
    } else if ((loD >= -10 && loD <= 0) || diff > 50) {
        returnValue = arr[lo];
    } else {
        returnValue = arr[hi];
    }

    //    console.log("Top position Y: " + py
    //            + "     low: " + arr[lo].getAttribute("id")
    //            + "     low Y: " + arr[lo].offsetTop
    //            + "     hi: " + arr[hi].getAttribute("id")
    //            + "     hi Y: " + arr[hi].offsetTop
    //            + "     lo - Y = " + loD
    //            + "     hi - Y = " + hiD
    //            + "     hi - lo = " + diff
    //            + "     return  = " + returnValue.getAttribute("id")
    //            );

    return returnValue;
}

/**
 * Sync tree branch and ribbon when anchor changed. 
 * @param {type} treeNodeId
 * @returns {undefined}
 */
function selectNode(treeNodeId) {
    var isFromOpenNewBrowser = false;
    $('#treeNav').on('redraw.jstree', function() {
        //redraw.jstree for reload tree json file when open new browser or refresh page 
        isFromOpenNewBrowser = true;
        updateNode(treeNodeId);

    })
    if (isFromOpenNewBrowser === false) {
        //normal syunc when click anchor in the iframe or tree navigator
        updateNode(treeNodeId);
    }
}

function updateNode(treeNodeId) {
    if ($('#treeNav').jstree(true).get_node(treeNodeId) !== false) {
        console.log("jstree(true)");
        expandNode(treeNodeId);
        updateRibbon(treeNodeId);
        focusOnIframe();
    }
}

function focusOnIframe() {
    var iContent = document.getElementById("iContent");
    if (iContent.contentWindow) {
        iContent.contentWindow.focus();
    } else if (iContent.contentDocument && iContent.contentDocument.documentElement) {
        // For old versions of Safari
        iContent.contentDocument.documentElement.focus();
    }
}

/**
 * Open current tree branch according tree node id. 
 * @param {type} treeNodeId
 */
function expandNode(treeNodeId) {
    $('#treeNav').jstree("deselect_all");
    $('#treeNav').jstree('close_all');
    $('#treeNav').jstree('select_node', treeNodeId);
    $('#treeNav').jstree(true).get_node(treeNodeId, true).children('.jstree-anchor').focus();
}
/**
 * Update ribbon when treeid changed
 * @param {type} treeNodeId
 */
function updateRibbon(treeNodeId) {
    var selectedNode = $('#treeNav').jstree(true).get_node(treeNodeId);
    if (selectedNode === false)
        return;
    var parents = selectedNode.parents;
    var ribbon = "";
    for (var i = parents.length - 1; i--;) {
        ribbon += $('#treeNav').jstree(true).get_node(parents[i]).text + " &#10148; ";
    }
    ribbon += selectedNode.text;
    document.getElementById("divRibbon").innerHTML = ribbon;
}