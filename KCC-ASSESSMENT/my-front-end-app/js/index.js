//Clear table for entries
function clearTable() {
    var productbody = document.querySelector("#product-list");
    productbody.innerHTML = "";
}

//Get Table Data then add to table
async function getTableData() {
    clearTable();
    const api_url = 'http://localhost:2090/product/show'
    const response = await fetch(api_url);
    const data = await response.json();
    for(i=0; i<data.length; i++) {
        const pid = data[i].productid;
        const pname = data[i].productname;
        const quant = data[i].quantity;
        const list = document.querySelector("#product-list");
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${pid}</td>
            <td>${pname}</td>
            <td>${quant}</td>
            <td>
            <a class="btn btn-warning btn-sm edit">Edit</a>
            <a class="btn btn-danger btn-sm delete">Delete</a>
        `;
        list.append(row);
    }
}

//Go to product add/edit
function gotoProductOperationsAdd() {
    sessionStorage.setItem("p_operation","ADD")
    window.location.href = `./prod-add-edit.html`;
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

//Edit Product
document.querySelector("#product-table").addEventListener("click",(e) =>{
    target = e.target;
    if(target.classList.contains("edit")) {
        selectedRow = target.parentElement.parentElement;
        pid = selectedRow.children[0].textContent;
        pname = selectedRow.children[1].textContent;
        quant = selectedRow.children[2].textContent;
        sessionStorage.setItem("p_operation","EDIT")
        var editdetails = {"pid":pid,"pname":pname,"quant":quant};
        sessionStorage.setItem("p_editdets",JSON.stringify(editdetails));
        window.location.href = `./prod-add-edit.html`;
    }
})

//Delete from database
async function deleteProduct(data = {}) {
    const insert_url = 'http://localhost:2090/product/delete';
    const response = await fetch(insert_url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

//Delete Product
document.querySelector("#product-table").addEventListener("click",(e) =>{
    target = e.target;
    if(target.classList.contains("delete")) {
        selectedRow = target.parentElement.parentElement;
        pid = selectedRow.children[0].textContent;
        if(window.confirm("Are you sure you want to delete this product? This will delete all component links!")) {
            deleteProduct({"productid":pid}).then(() => getTableData()).then(() => showAlert("Product Deleted!","success"));
        }
    }
})