//Clear table for entries
function clearTable() {
    var productbody = document.querySelector("#component-list");
    productbody.innerHTML = "";
}

//Get Table Data then add to table
async function getTableData() {
    clearTable();
    const api_url = 'http://localhost:2090/component/show'
    const response = await fetch(api_url);
    const data = await response.json();
    for(i=0; i<data.length; i++) {
        const cid = data[i].componentid;
        const cname = data[i].name;
        const desc = data[i].description;
        const list = document.querySelector("#component-list");
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${cid}</td>
            <td>${cname}</td>
            <td>${desc}</td>
            <td>
            <a class="btn btn-warning btn-sm edit">Edit</a>
            <a class="btn btn-danger btn-sm delete">Delete</a>
        `;
        list.append(row);
    }
}

//Show Alerts
function showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector("#maincontainer");
    const main = document.querySelector(".main");
    container.insertBefore(div, main);
    setTimeout(() => document.querySelector(".alert").remove(),2000);
}

//Add component
function addComponent() {
    sessionStorage.setItem("c_operation","ADD")
    window.location.href = `./comp-add-edit.html`;
}


//Edit component
document.querySelector("#component-table").addEventListener("click",(e) =>{
    target = e.target;
    if(target.classList.contains("edit")) {
        selectedRow = target.parentElement.parentElement;
        cid = selectedRow.children[0].textContent;
        cname = selectedRow.children[1].textContent;
        desc= selectedRow.children[2].textContent;
        sessionStorage.setItem("c_operation","EDIT")
        var editdetails = {"cid":cid,"cname":cname,"desc":desc};
        sessionStorage.setItem("c_editdets",JSON.stringify(editdetails));
        window.location.href = `./comp-add-edit.html`;
    }
})

//Delete Component
async function deleteComponent(data = {}) {
    const insert_url = 'http://localhost:2090/component/delete';
    const response = await fetch(insert_url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

//Check if component is linked to product
async function checkifLinked(data = {}) {
    const insert_url = 'http://localhost:2090/component/checkiflinked';
    const response = await fetch(insert_url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    const value = await response.json();
    return value;
}

//Delete from database
document.querySelector("#component-table").addEventListener("click",(e) =>{
    target = e.target;
    if(target.classList.contains("delete")) {
        selectedRow = target.parentElement.parentElement;
        cid = selectedRow.children[0].textContent;
        checkifLinked({"componentid":cid}).then(data => {
            if(data.length > 0) {
                showAlert("This component is still linked with a product! Please unlink this component for deletion!","danger")
            }
            else {
                if(window.confirm("Are you sure you want to delete this component? This will delete all supplier links it has!")) {
                    deleteComponent({"componentid":cid}).then(() => getTableData()).then(() => showAlert("Product Deleted!","success"));
                }
            }
        })
        
        
    }
})