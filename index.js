const mainDiv = document.getElementById('MainDiv')
let page = 1
async function fetchQ(countPage) {
    const users = await fetch(
      `https://api.unsplash.com/photos/?client_id=ab3411e4ac868c2646c0ed488dfd919ef612b04c264f3374c97fff98ed253dc9&page=${countPage === undefined ? '1' : countPage}`
    )
    const json = await users.json()
    return json
  }

  async function main(page) {
    mainDiv.innerHTML = '';
    const gUsers = await fetchQ(page)
    createList(gUsers)
  }
  function createList(gUsers) {  
    
    mainDiv.classList.add('MainDiv')
    const divHead = document.createElement('div');
    divHead.classList.add('HeadText', 'box-container');
  
    const HeadContent = document.createElement('div');
    HeadContent.textContent = 'List users';
  
    const divArrow = document.createElement('div');
    divArrow.classList.add('hide');
    
    mainDiv.appendChild(divHead);
    divHead.appendChild(divArrow);
    divHead.appendChild(HeadContent);
  
    gUsers.forEach((element) => {
      const div = document.createElement('div');
      div.classList.add('box-container', 'ListText','underline');
      div.textContent = element.user.username;
      div.id = element.id;
      div.addEventListener('click', () => showProfile(gUsers, element, divHead, divArrow, HeadContent));
  
      const img = document.createElement('img');
      img.src = element.user.profile_image.small;
      div.appendChild(img);
      mainDiv.appendChild(div);
    });
    paginationHtml()
  }
  
   function paginationHtml() {
    const pagesNum = Array.from(Array(10), (_,i) => i + 1)

    const divPaginate = document.createElement('div')
    divPaginate.id = "paginate";
    divPaginate.classList.add('paginate-box')

    const ArrowBack = document.createElement("div")
    const ArrowNext = document.createElement("div")
    ArrowBack.classList.add('arrow-left')
    ArrowNext.classList.add('arrow-right')

    divPaginate.appendChild(ArrowBack)
    pagesNum.forEach((element) => {
      const divPage = document.createElement(`div`)
      divPage.textContent = element
      divPage.classList.add('paginate')
      divPage.addEventListener('click',() => {
        mainDiv.innerHTML = '';
        page = element
        main(page)
      })
        page === element ? divPage.classList.add('selectPage') : divPage.classList.remove('selectPage') 
        divPaginate.appendChild(divPage)
    })
     
    divPaginate.appendChild(ArrowNext)
    ArrowBack.addEventListener("click", ()=>{ 
      if(page != 1){
        page = page - 1
        main(page) 
        } 
      })
    ArrowNext.addEventListener("click", ()=>{ 
      if(page != 10){ 
          page = page + 1
          main(page) 
        } 
      })
    mainDiv.appendChild(divPaginate)
  }

   function showProfile(gUser, chosenUser, divHead, divArrow, HeadContent) {
      const divPaginate = document.getElementById('paginate')
      divPaginate.classList.add('hide')

      divArrow.classList.add('arrow-left');
      divArrow.classList.remove('hide');
    
      divHead.classList.remove('HeadText');
      divHead.classList.add('ListText');
      
      const profileImage = document.createElement('img');
      profileImage.src = chosenUser.user.profile_image.small;
      HeadContent.textContent = chosenUser.user.username;
    
      const Photo = document.createElement('img');
      Photo.classList.add('Photo');
      mainDiv.style.background = chosenUser.color

      const divLikes = document.createElement('div')
      divLikes.classList.add('box-Likes')
      const HeartLike = document.createElement('div')
      HeartLike.classList.add('heart')
      const DivCountLikes = document.createElement('div')
      DivCountLikes.textContent = chosenUser.likes
      DivCountLikes.classList.add('LikesText')
      divLikes.appendChild(HeartLike)
      divLikes.appendChild(DivCountLikes)
      gUser.forEach((element) => {
        const div = document.getElementById(element.id);
        div.classList.add('hide')
        if(element.liked_by_user){
          HeartLike.classList.add('redHeart')
        }
      });
      Photo.src = chosenUser.urls.regular;
      mainDiv.appendChild(Photo);
      divHead.appendChild(profileImage);   
      mainDiv.appendChild(divLikes)
      divArrow.addEventListener('click', () => reset(gUser, divHead, divArrow, HeadContent, profileImage, Photo, divLikes));
      HeartLike.addEventListener('click',() =>  ClickOnLikes(HeartLike, DivCountLikes, chosenUser))
      Photo.addEventListener('dblclick',() => ClickOnLikes(HeartLike, DivCountLikes, chosenUser))
  }
  function ClickOnLikes(HeartLike,DivCountLikes,chosenUser){
    if(!HeartLike.classList.contains('redHeart')){
      HeartLike.classList.add('redHeart')
      chosenUser.likes += 1
      chosenUser.liked_by_user = true
    }else{
      chosenUser.likes -= 1
      HeartLike.classList.remove('redHeart')
      chosenUser.liked_by_user = false
    }

      
    DivCountLikes.textContent = chosenUser.likes
  }
  function reset (gUser, divHead, divArrow, HeadContent, profileImage, Photo, divLikes){
    gUser.forEach((element) => {
      const div = document.getElementById(element.id);
      div.classList.remove('hide');
    });

    const divPaginate = document.getElementById('paginate')
    divPaginate.classList.remove('hide')

    HeadContent.textContent = "List users"
    divArrow.classList.add('hide')
    divHead.classList.remove('ListText')
    divHead.classList.add('HeadText')
    divHead.removeChild(profileImage)
    mainDiv.removeChild(Photo)
    mainDiv.removeChild(divLikes)
    mainDiv.style.background = 'white'
  }
main();