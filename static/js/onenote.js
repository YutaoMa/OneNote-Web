"use strict";
(function(){

    window.onload = function(){
        updateNotebooks();
    }

    function updateNotebooks(){
        $("#notebooks-list").empty();
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
            let note = JSON.parse(result)['previewText'];
            document.getElementById("note").innerText = note;
        });
    }

})();
