function formSetup(){
    let uploadForm = document.getElementById("uploadForm");
    let fileInput = document.getElementById("xmlFileUpload");
    uploadForm.addEventListener("submit",function(e){
        e.preventDefault();
        fileUploadProcess();
    });
    async function fileUploadProcess(){
        let filesToUpload = new FormData();
        for(let i = 0;i < fileInput.files.length;i++)
        {
            let fileName = "xmlFile" + i;
            filesToUpload.append(fileName,fileInput.files[i]);
        }
        let response = await fetch("/test", {
            method: "POST",
            body: filesToUpload
        });
        if(response.ok){
            console.log("File transfer to server successful");
        } else {
            console.log("File transfer to server failed");
        }
    }
}
