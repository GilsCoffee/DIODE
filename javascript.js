$(document).ready(function(){
    var fileName = prompt("Enter File Name.  No special characters", "Untitled");
    if(fileName != null){
        if(isJava){
            fileName = fileName+".java";
        } else {
            fileName = fileName+".c";
        }
        
        initEditor("", fileName);
    }
    if(isJava == true){
        $.get("java.txt", function(data) {
        getActiveEditor().setValue(data.replace("Main", fileNames[0].substring(0, fileNames[0].length-5)));
        });
    }
    else{
        $.get("c.txt", function(data) {
        getActiveEditor().setValue(data);
        });
    }
});



var isJava = confirm("Press confirm to use Java, and cancel to use C");
var editorObjects = [];
var fileNames = [];
var editorList = $('#editorList');
var navList = $('#navList');
var editorCount = 0;
var activeEditorIndex = 0;
var maxLineNum = (($(window).height() - $("body").height()) / 14) + 12;

var getEditorDiv = function(index){
    return document.getElementById("editor"+index);
};

var save = function(){
    //alert("save called");
    
    for(var i = 0; i < editorCount-1; i++){
        sendDataToServer(editorObjects[i].getValue(),fileNames[i]);
    };
    //sendDataToServer(editorObjects[0].getValue(), fileNames[0]);
};

var getActiveEditorDiv = function(){
    return getEditorDiv(activeEditorIndex);
};

var getActiveEditor = function(){
    return editorObjects[activeEditorIndex];
};

var swapActiveEditor = function(index){
    getActiveEditorDiv().style.display="none";
    activeEditorIndex = index;
    getEditorDiv(index).style.display="block";
    $("#activeEditorName").html(fileNames[index]);
};

var findText = document.getElementById("findText");
var replaceText = document.getElementById("replaceText");

$('.save').click(function() {
    save();
});
$('.findButton').click(function() {
    getActiveEditor().find(findText.value);
});
$('.replaceButton').click(function() {
    getActiveEditor().replace(replaceText.value);
    getActiveEditor().find(findText.value);
});
$('.replaceAllButton').click(function() {
    getActiveEditor().find(findText.value);
    getActiveEditor().replaceAll(replaceText.value);
});

$('.deleteButton').click(function() {
    var confirmation = confirm("Are you sure you want to delete this file? The file will not be able to be recovered.");
    if(confirmation == true){
        delete editorObjects[activeEditorIndex];
        
    }
    else{}
});
$('.rename').click(function() {
    var newName = prompt("Rename to...", fileNames[activeEditorIndex]);
    if(newName != null){
        fileNames[activeEditorIndex] = newName;
        $("#activeEditorName").html(newName);
        $("#"+activeEditorIndex).html(newName);
    }
});

var initEditor = function(contents, fileName) {
    //alert("called");
    
    //console.log(prompt("derp", "derp"));
    var newDiv =  $('<li><div class="editor" id="editor'+editorCount+'">hi</div></li>');
    var newButton = $('<li><button class="navButton active" id="'+editorCount+'">'+fileName+'</button></li>');
    editorList.append(newDiv);
    navList.append(newButton);
    switchButton(editorCount);
    var newEditor = ace.edit("editor" + editorCount);
    newEditor.setTheme("ace/theme/eclipse");
    if(isJava){
        newEditor.getSession().setMode("ace/mode/java");
    }else {
        newEditor.getSession().setMode("ace/mode/c_cpp");
    }
    newEditor.setOptions({
        maxLines: maxLineNum,
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: false
    });
    newEditor.setValue(contents);
    
    editorObjects.push(newEditor);
    fileNames.push(fileName);
    swapActiveEditor(editorCount);
    editorCount = editorCount+1;
   
    $('.navButton').click(function() {
        switchButton(this.id);
        swapActiveEditor(parseInt(this.id, 10));
    });
};

$('.newTab').click(function() {
    var fileName = prompt("Enter File Name.  No special characters", "Untitled");
    if(fileName != null){
        if(isJava){
            fileName = fileName+".java";
        } else {
            fileName = fileName+".c";
        }
        initEditor("", fileName);
    }
});



function switchButton(id) {
    document.getElementById(activeEditorIndex).className = "navButton";
    document.getElementById(id).className = "navButton active";
}

function sendDataToServer(code, filename) {
    var data = {};
    data.code = code;
    data.filename = filename;
    $.post("//52.68.54.0/save.php", data, function() {
        alert("Code = " + code + "Filename = " + filename);
    });
    alert("Sent.");
}

/*
function pollServer() {
    while (1 == 1) {
        var finished = $.get("//52.68.54.0/isdone.php);
            if (finished == 0) {
                getDataFromServer();
            }
            else {
                break;
            }
        }
}
            

*/
function wait(waitsecs){
setTimeout(donothing(), 'waitsecs');
}

function donothing() {

}
var getOutputFromServer = function(filename){

    $.post("http://ec2-52-68-54-0.ap-northeast-1.compute.amazonaws.com/compileAndRun.php",{fileToRun:filename}, function(){
        alert("Completed Succesfully");
        
        $.get("http://ec2-52-68-54-0.ap-northeast-1.compute.amazonaws.com/output.txt",function(data) {
            alert(data);
            var output = document.getElementById("output");
            output.value = data;//.substring(0,terminate);
        });
    });
};
$(".compile").click(function(){
   var div = document.getElementById("activeEditorName");
   var output = document.getElementById("output");
   output.value = getOutputFromServer(div.innerHTML);
});
function getDataFromServer(){
    var list = $.get("//52.68.54.0/getlist.php");
    var filenames = list.split(",");
    for(var i = 0; i < filenames.size(); i = i+1){
        var file = $.get("http://ec2-52-68-54-0.ap-northeast-1.compute.amazonaws.com/getDataList.php", filenames[i]);
        initEditor(file, filenames[i]);
    }
        
}