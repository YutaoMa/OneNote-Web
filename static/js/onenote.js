"use strict";
(function(){

    window.onload = function(){
        updateNotebooks();
        document.getElementById("refresh").onclick = updateNotebooks;
        document.getElementById("new-note").onclick = newNote;
        document.getElementById("delete-note").onclick = deleteNote;
        document.getElementById("rename-note").onclick = renameNote;
        document.getElementById("new-section").onclick = newSection;
    }

    function updateNotebooks(){
        $("#notebook-info").text("Getting notebooks...");
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
                newNotebook.ondblclick = updateSections;
                document.getElementById('notebooks-list').appendChild(newNotebook);
            }
            $("#notebook-info").text("Fetch notebooks success.");
        })
    }

    function updateSections(){
        $("#section-info").text("Getting sections...");
        $("#sections-list").empty();
        $("#pages-list").empty();
        $("#note").empty();
        $.get("/get?notebook=" + this.value, function(result){
            let sections = JSON.parse(result)['value'];
            for(let section of sections){
                let newSection = document.createElement('option');
                newSection.innerText = section['displayName'];
                newSection.value = section['id'];
                newSection.ondblclick = updatePages;
                document.getElementById("sections-list").appendChild(newSection);
            }
            $("#section-info").text("Fetch sections success.");
        });
    }

    function updatePages(){
        $("#note-info").text("Getting notes...");
        $("#pages-list").empty();
        $("#note").empty();
        $.get("/get?section=" + this.value, function(result){
            let pages = JSON.parse(result)['value'];
            for(let page of pages){
                let newPage = document.createElement('option');
                newPage.innerText = page['title'];
                newPage.value = page['id'];
                newPage.ondblclick = updateNote;
                document.getElementById("pages-list").appendChild(newPage);
            }
            $("#note-info").text("Fetching notes success.");
        });
    }

    function updateNote(){
        $("#note").text("Openning note...");
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
        $("#note-info").text("Creating new note...");
        let title = $("#note-name").val();
        let section = $("#sections-list").val();
        if(title != ""){
            if(section != null){
                $.get('/post?title=' + title + "&section=" + section, function(result){
                    if(result == "201"){
                        $("#note-info").text("New note created.");
                    } else{
                        $("#note-info").text("Request error: " + result);
                    }
                });
            } else{
                $("#note-info").text("Must choose a section first!");
            }
        } else{
            $("#note-info").text("New note name cannot be empty!");
        }
    }

    function deleteNote(){
        $("#note-info").text("Deleting note...");
        let page = $("#pages-list").val();
        if(page != null){
            $.get("/delete?page=" + page, function(result){
                if(result == "204"){
                    $("#note-info").text("Note deleted.");
                } else{
                    $("#note-info").text("Request error: " + result);
                }
            });
        } else{
            $("#note-info").text("Select a note to delete first!");
        }
    }

    function renameNote(){
        $("#note-info").text("Renaming note...");
        let note = $("#pages-list").val();
        let title = $("#note-name").val();
        if(note != null){
            if(title != ""){
                $.get("/update?note=" + note + "&title=" + title, function(result){
                    if(result == "204"){
                        $("#note-info").text("Note renamed.");
                    } else{
                        $("#note-info").text("Request error: " + result);
                    }
                });
            } else{
                $("#note-info").text("New note name cannot be empty!");
            }            
        } else{
            $("#note-info").text("Select a note to rename first!");
        }
    }

    function newSection(){
        $("#section-info").empty();
        let title = $("#section-name").val();
        let notebook = $("#notebooks-list").val();
        if(title != ""){
            if(notebook != null){
                $.get('/post?title=' + title + "&notebook=" + notebook, function(result){
                    if(result == "201"){
                        $("#section-info").text("New section created.");
                    } else{
                        $("#section-info").text("Request error: " + result);
                    }
                });
            } else{
                $("#section-info").text("Must choose a notebook first!");
            }
        } else{
            $("#section-info").text("New section name cannot be empty!");
        }
    }

})();
