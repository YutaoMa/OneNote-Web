"use strict";
(function(){

    window.onload = function(){
        updateNotebooks();
        document.getElementById("refresh").onclick = updateNotebooks;
        document.getElementById("new-note").onclick = newNote;
    }

    function updateNotebooks(){
        $("#notebooks-list").empty();
        $("#sections-list").empty();
        $("#pages-list").empty();
        $("#note").empty();
        $.get("/get", function(result){
            let notebooks = JSON.parse(result)['value'];
            for(let notebook of notebooks){
                let newNotebook = document.createElement('option');
                newNotebook.innerText = notebook['displayName'];
                newNotebook.value = notebook['id'];
                newNotebook.onclick = updateSections;
                document.getElementById('notebooks-list').appendChild(newNotebook);
            }
        })
    }

    function updateSections(){
        $("#sections-list").empty();
        $("#pages-list").empty();
        $("#note").empty();
        $.get("/get?notebook=" + this.value, function(result){
            let sections = JSON.parse(result)['value'];
            for(let section of sections){
                let newSection = document.createElement('option');
                newSection.innerText = section['displayName'];
                newSection.value = section['id'];
                newSection.onclick = updatePages;
                document.getElementById("sections-list").appendChild(newSection);
            }
        });
    }

    function updatePages(){
        $("#pages-list").empty();
        $("#note").empty();
        $.get("/get?section=" + this.value, function(result){
            let pages = JSON.parse(result)['value'];
            for(let page of pages){
                let newPage = document.createElement('option');
                newPage.innerText = page['title'];
                newPage.value = page['id'];
                newPage.onclick = updateNote;
                document.getElementById("pages-list").appendChild(newPage);
            }
        });
    }

    function updateNote(){
        $("#note").empty();
        $.get('/get?note=' + this.value, function(result){
            $("#note").html(result);
            updateContents();
            updateStyle();
        });
    }

    function updateContents(){
        let images= $("img");
        for(let image of images){
            let src = image.src;
            let parent = image.parentNode;
            parent.removeChild(image);
            let newImage = document.createElement("img");
            newImage.src = "/get?content=" + src;
            parent.appendChild(newImage); 
        }
    }

    function updateStyle(){
        let divs = $("#note div");
        for(let div of divs){
            div.style = "";
        }
    }

    function newNote(){
        $("#new-note-info").empty();
        let title = $("#new-note-name").val();
        let section = $("#sections-list").val();
        if(title != ""){
            if(section != null){
                $.get('/post?title=' + title + "&section=" + section, function(result){
                    if(result == "201"){
                        $("#new-note-info").text("New note created!");
                    } else{
                        $("#new-note-info").text("Request error: " + result);
                    }
                });
            } else{
                $("#new-note-info").text("Must choose a section first!");
            }
        } else{
            $("#new-note-info").text("New note name cannot be empty!");
        }
    }

})();
