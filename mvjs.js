(() => {
    console.log("DOM start script");
    /**
     * @description Element 스타일 핸들러
     * @return {void}
     */
      const initStyle = () => {
      const inputNode = document.querySelector("#searchKey");
    };
  
    /**
     * @description 키보드 눌렀을때(`down`) 엔터키 막기 이벤트 핸들러
     * @param {KeyboardEvent<HTMLInputElement>} e
     * @returns {void}
     */
    const onBlockEnter = (e) => {
      if (e.keyCode === 13 && e.key === "Enter") {
        e.preventDefault();
        onSearch();
      }
    };
    document.addEventListener("keydown", onBlockEnter);
    initStyle();
  })();
  
//현재상태값 저장
this.state = {
  nowPage: 1,
  inputValue: '',
  searchResult: [],
  totalPage : 0,
}
/**
 * @description API 연동 
 */


/**
 * @description 디브 자동 생성 함수
 */
function createMvDiv(){
  for(const [index, data] of Object.entries(this.state.searchResult)){
    //mvcontent div영역
    const divNodeDummy = document.createElement('div');
    divNodeDummy.classList.add('mvContent');
    
    //위에 안에 있는 mvImage div 영역
    const divImgNode = document.createElement('div');
    divImgNode.classList.add('mvImage');
    
    //img 태그 
    const imgNode = document.createElement('img');
    imgNode.src=data['Poster'];
    imgNode.onerror=this.src='img/pic_error.png';
    
    // imgNode.onerror=this.src='img/pic_error.png';
    //mvTitle 영역
    const divTitle = document.createElement('div');
    divTitle.classList.add('mvTitle');
    const spanNode = document.createElement('span');
    spanNode.innerHTML = `
    <p class="title" id="title">${data["Title"]}</p>
    <p class="type" id="type">${data["Type"]}</p>
    <button type="button" class="btn" onclick="starClicked(this)">
    LOVE IT!
    </button>
    `;
    
    divTitle.appendChild(spanNode);
    divImgNode.appendChild(imgNode);
    divNodeDummy.appendChild(divImgNode);
    divNodeDummy.appendChild(divTitle);

    document.querySelector('.movies').appendChild(divNodeDummy);
  }
}
  /**
   * @description 즐겨찾기 버튼 
   */

 function favorClicked(){
   //즐겨찾기 한 내용들 보여주기
   console.log("hello");
 }
function starClicked(e){
console.log(e);
  console.log(document.querySelector("#star"), "시발 좆같이 안되네");
  const titlename = document.getElementById("title");
  const typename = document.getElementById("type");
  console.log(titlename.value);
  console.log(typename.value);
}

/**
 * @description api fetch 
 */    

/**
 * @description search 버튼 클릭 이벤트 핸들러.
 */
const onSearch = async () => {
  try { 
      const s = document.getElementById("searchKey").value;
      const url = `https://www.omdbapi.com/?i=tt3896198&apikey=9172b236&s=${s}`;
      const response = await fetch(url);
      const result = await response.json();
      const totalResult = result.totalResults;
      const totalPage = Math.ceil(totalResult/10);

      
      this.state.inputValue += s;
      this.state.totalPage += totalPage;
      this.state.searchResult = result.Search;
      
      createMvDiv();

  } catch (error) {
      console.log('에러 원인 : ' + error);
    const err = document.createElement('p');
    err.className = 'errMsg';
    err.innerText = '검색 결과가 없습니다.';
    document.querySelector('.movies').appendChild(err);
  }
};

  // const  mvContent = document.querySelectorAll(".mvContent");
  // const observer = new IntersectionObserver(
  //   (mvContents) => {
  //     mvContents.forEach((mvContent) => {
  //       if(mvContent.isIntersecting){
  //         mvContent.target.classList.add("visible");
  //       }else{
  //         mvContent.target.classList.remove("visible");
  //       }
  //     });
  //   },
  // );

  window.addEventListener('scroll', () => {
    const isScrollEnded = window.scrollY + window.innerHeight + 100 >= document.body.scrollHeight;
    if (isScrollEnded) {
      const scrollFetch = async () => {
        try{
          const url = `https://www.omdbapi.com/?i=tt3896198&apikey=9172b236&s=${this.state.inputValue}&page=${this.state.nowPage += 1}`;
          const response = await fetch(url);
          const result = await response.json();
          this.state.searchResult = result.Search;
          createMvDiv();

        }catch(error){
          console.log('에러 원인 : ' + error);
          const err = document.createElement('p');
        err.className = 'errMsg';
        err.innerText = '검색 결과가 없습니다.';
        document.querySelector('.movies').appendChild(err);
        }
      }
       scrollFetch(); 
    }
  });




  
  
 
  
    

 
  //데이터 가져오는 api
  // const searchBtn = document.getElementById("searchBtn");
  
  // searchBtn.addEventListener("click", function (e) {
  //   try {
  //     e.preventDefault();
  //     const s = document.getElementById("searchKey").value;
  //     const url = `https://www.omdbapi.com/?i=tt3896198&apikey=9172b236&s=${s}`;
  //     fetch(url)
  //       .then((response) => {
  //         debugger;
  //         console.log("response", "body" in response, "json" in response, "text" in response);
  //         return response.body();
  //       })
  //       .then((json) => {
  //         debugger;
  //         console.log("json", json);
  //       });
  //     console.log("json:", json);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // });
  
  // searchBtn.addEventListener("click", function(){
  //     debugger;
  //     const http = new XMLHttpRequest();
  //     const s = document.getElementById("searchKey").value;
  //     const url = `https://www.omdbapi.com/?i=tt3896198&apikey=9172b236&s=${s}`;
  //     http.open("GET",url);
  //     http.send();
  //     http.onreadystatechange= function(){
  //             debugger;
  //             const result = JSON.parse(http.response);
  //             console.log(typeof result);
  //             // var json = JSON.stringify(result);
  //             // const movieDiv = document.createElement("div");
  //             // const movieSpan = movieDiv.appendChild("span");
  //             // const moviePtag = movieSpan.appendChild("p");
  //             for(const data of result){
  //                 debugger;
  //                 console.log(data);
  //             }
  //             // console.log(json.search["title"]);
  //             console.log(result);
  //             return result;
  //     }
  // });
  
