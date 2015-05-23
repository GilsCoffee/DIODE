var editor = ace.edit("editor");
editor.setTheme("ace/theme/eclipse");
editor.getSession().setMode("ace/mode/java");
editor.setOptions({
    maxLines: 30
});

var findText = document.getElementById("findText");
var replaceText = document.getElementById("replaceText");

$('.save').click(function() {
    var value = editor.getSession().getValue();
    sendDataToServer(value);
});
$('.findButton').click(function() {
    editor.find(findText.value);
});
$('.replaceButton').click(function() {
    editor.replace(replaceText.value);
    editor.find(findText.value);
});
$('.replaceAllButton').click(function() {
    editor.find(findText.value);
    editor.replaceAll(replaceText.value)
});
$.get("start.txt", function(data) {
    editor.setValue(data);
});

function sendDataToServer(data){
    $.post("", data, function(){alert("Status")});
    alert("Sent.");
}