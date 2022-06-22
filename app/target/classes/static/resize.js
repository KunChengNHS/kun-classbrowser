//resize
$(document).ready(function () {
    resize();
});
$(window).resize(function () {
    resize();
});
$(window).on('load', function () {
    resize();
});

function resize()
{
    $('#wrenDiv').height(calcWrenDiv());
    setIframeDivHeight();

    if ($("#frameForResults").css('display') === 'block') {
        $('#frameForResults').css({"bottom": "0", "top": ""});
        openSearchDiv();
    }
}
function setIframeDivHeight()
{

    var ribbonHeight = $('#divRibbon').height() + 10;//10 ribbon padding top 10px
    $('#swanDiv').css({"top": ribbonHeight});
    $('#swanDiv').height("calc(100% - " + ribbonHeight + "px)");

}
function calcWrenDiv()
{
    var docHeight = $(window).height();
    var footerHeight = $('#footer').height();
    var headerHeight = getHeaderHeight();

    var mainPanelHeight = docHeight - footerHeight - headerHeight;
//    console.log("docHeight: " + docHeight + " headerHeight: " + headerHeight +
//            " footerHeight: " + footerHeight
//            + " mainPanelHeight:" + mainPanelHeight);
    return mainPanelHeight;
}

function getHeaderHeight()
{
    return $('#header').height() + 15;
}