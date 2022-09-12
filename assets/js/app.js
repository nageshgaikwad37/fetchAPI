let cl = console.log;

const postForm = document.getElementById('postForm');
const title = document.getElementById('title');
const info = document.getElementById('info');
const cardPost = document.getElementById('cardPost');
const addPostBtn = document.getElementById('addPostBtn');
const updateBtn = document.getElementById('updateBtn');

let baseUrl = 'http://localhost:3000/posts';
let token = "nagesh";
localStorage.setItem('tokenV', token);


const onedithandler = (e) => {
    let getEditId = e.dataset.id;
    localStorage.setItem('setEditId', getEditId)
    let getediturl =`${baseUrl}/${getEditId}`
    makeAPICall(getediturl, 'GET')
        .then(data => {
            title.value = data.title;
            info.value = data.info
        })
        .catch(cl)
        addPostBtn.classList.add('d-none')
        updateBtn.classList.remove('d-none')

}

const onDeletehandler = (e) => {
    let deleteId = e.dataset.id;
    let deleteUrl = `${baseUrl}/${deleteId}`;
    makeAPICall(deleteUrl, 'DELETE')
       .then(cl)
       .catch(cl)
}

const tamplating = (arr) => {
    result = '';
    arr.forEach(ele => {
        result += `
        <div class="col-md-4 offset-md-3 mt-4">
           <div class="card">
           <div class="card-body">
           <h3>${ele.title}</h3>
           <p>${ele.info}</p>
           <p class="text-right mt-2">
             <button class="btn btn-info" data-id="${ele.id}" onclick="onedithandler(this)">Edit</button>
             <button class="btn btn-danger" data-id="${ele.id}" onclick="onDeletehandler(this)">Delete</button>
           </p>
        </div>
    </div>
        </div>  
            `
    })
    cardPost.innerHTML = result;
}

function makeAPICall(url, methodName, objbody) {
   return fetch(url, {
        method : methodName,
        body : objbody,
        headers : {
            "content-type" : "application/json; charset=UTF-8",
            "autherazation" : localStorage.getItem('tokenV')
        }
    }).then(res => res.json())
}

makeAPICall(baseUrl, 'GET')
   .then(data => tamplating(data))
   .catch(cl)








const onformSubmit = (e) => {
    e.preventDefault();
    let obj = {
        title : title.value,
        info : info.value,
        userId : Math.ceil(Math.random() * 10)
    }
    cl(obj)
    makeAPICall(baseUrl, 'POST', JSON.stringify(obj))
       .then(cl)
       .catch(cl)
    e.target.reset();
}

const onPostUpdate = () => {
    let updateId = localStorage.getItem('setEditId');
    let updatedUrl = `${baseUrl}/${updateId}`
    let obj = {
        title: title.value,
        info: info.value
    }
    makeAPICall(updatedUrl, 'PATCH', JSON.stringify(obj))
        .then(cl)
        .catch(cl)

        addPostBtn.classList.remove('d-none')
        updateBtn.classList.add('d-none')
}






postForm.addEventListener('submit', onformSubmit);
updateBtn.addEventListener('click', onPostUpdate);