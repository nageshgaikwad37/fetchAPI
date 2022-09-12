let cl = console.log;
const postinfo = document.getElementById('postInfo');
const postForm = document.getElementById('postForm');
const title = document.getElementById('title');
const info = document.getElementById('info');
const submitBtn = document.getElementById('submitBtn');
const updateBtn = document.getElementById('updateBtn');


let baseUrl = `https://jsonplaceholder.typicode.com/posts`;
let postArray = []


function makeNetworkCall(methodName, url, body){
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest() ;

xhr.open(methodName, url);

xhr.onload = function(){
    if(xhr.status === 200 || xhr.status === 201){
        resolve(xhr.response)
    }else{
        reject('something went wrong')
    }
}
 xhr.send(body)
    })
    
}

makeNetworkCall('GET',baseUrl)
    .then(res => {
        postArray = JSON.parse(res)
        templating(postArray);
    })
    .catch(cl);

    const onEditHandler = (ele) => {
        let getId = +ele.dataset.id;
        cl(getId)
        localStorage.setItem('setUpdatedId', getId);
        let getObj = postArray.find(e => (e.id === getId))
                title.value = getObj.title;
                info.value = getObj.body;
                updateBtn.classList.remove('d-none')
                submitBtn.classList.add('d-none')
                



 }

 function onUpdateHandler(event){
       let getId = +(localStorage.getItem('setUpdatedId'));
       cl(getId)
       postArray.forEach(obj => {
        if(obj.id === getId){
            obj.title = title.value;
            obj.body = info.value;
        }
       })
       templating(postArray);
       let updatedObj = {
        title : title.value,
        body : info.value
       }
       let updateUrl = `${baseUrl}/${getId}`;
       makeNetworkCall('PATCH',updateUrl, updatedObj);
       postForm.reset();
       updateBtn.classList.add('d-none')
       submitBtn.classList.remove('d-none')

 }

function onDeleteHandler(ele){
    let getDeleteId = +ele.dataset.id;
    let deleteUrl = `${baseUrl}/${getDeleteId}`;
    makeNetworkCall('DELETE', deleteUrl)
    postArray = postArray.filter(post => post.id != getDeleteId)
    templating(postArray)
}

function templating (arr) {
    result = '';
    arr.forEach((ele) => {
        result += `
                   <tr>
                     <td>${ele.id}</td>
                     <td>${ele.userId}</td>
                     <td>${ele.title}</td>
                     <td>${ele.body}</td>
                     <td><button class="btn btn-info" data-id ="${ele.id}" onclick = 'onEditHandler(this)' >Edit</button></td>
                     <td><button class="btn btn-danger" data-id ="${ele.id}" onclick = 'onDeleteHandler(this)' >Delete</button></td>
                   </tr>`
    })
  postinfo.innerHTML= result;
}


postForm.addEventListener('submit', onSubmitHandler)
updateBtn.addEventListener('click', onUpdateHandler)


function onSubmitHandler(eve){
      eve.preventDefault();
      cl('triggered');
      let obj = {
        title : title.value,
        body : info.value,
        userId : Math.floor(Math.random() * 10 ) + 1  
      }
      makeNetworkCall('POST', baseUrl, JSON.stringify(obj))
         .then(res => {
            obj.id = JSON.parse(res).id;
            postArray.push(obj)
            templating(postArray)
         })
         .catch(cl)
      eve.target.reset()
}












