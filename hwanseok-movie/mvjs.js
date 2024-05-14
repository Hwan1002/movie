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
      
      //mvTitle 영역
      const divTitle = document.createElement('div');
      divTitle.classList.add('mvTitle');
      const spanNode = document.createElement('span');
      spanNode.innerHTML = `<p class="p1" value="Good Times">${data["Title"]}</p><p class="p2">${data["Type"]}</p>`;

      divTitle.appendChild(spanNode);
      divImgNode.appendChild(imgNode);
      divNodeDummy.appendChild(divImgNode);
      divNodeDummy.appendChild(divTitle);

      document.querySelector('.movies').appendChild(divNodeDummy);
    }
  }
  /**
   * @description search 버튼 클릭 이벤트 핸들러.
   */
  const onSearch = async () => {
    try { 
        const s = document.getElementById("searchKey").value;
        const url = `https://www.omdbapi.com/?i=tt3896198&apikey=9172b236&s=${s}&page=${this.state.nowPage}`;
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

  window.addEventListener('scroll', () => {
    console.log(window.innerHeight, window.scrollY, document.body.scrollHeight);
    console.log("스크롤진행");
    
    const isScrollEnded = window.scrollY + window.innerHeight + 100 >= document.body.scrollHeight;
  
    if (isScrollEnded) {
      const scrollFetch = async () => {
        try{
          for(let i=1; i<this.state.totalPage; i++){
          const url = `https://www.omdbapi.com/?i=tt3896198&apikey=9172b236&s=${this.state.inputValue}&page=${this.state.nowPage + i}`;
          const response = await fetch(url);
          const result = await response.json();
          this.state.searchResult = result.Search;
          createMvDiv();
          }

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
  
  ////////////////////////////////////////////////////////////////////
  //fetch 로 api 연동
  // searchBtn.addEventListener("click", async function logMovies(){
  //     const s = document.getElementById("searchKey").value;
  //     const url = `https://www.omdbapi.com/?i=tt3896198&apikey=9172b236&s=${s}`;
  //     const api = await fetch(url)
  //     .then((response) => response.json())
  //     .catch((error) => console.log(error));
  //     const result = response.json();
  //     debugger;
  //     console.log(result);
  //     console.log("welcome html");
  // });
  
  ////////////////////////////////////////////////////////////////////
  // 포스터 api 요청
  // api로 영화 포스터랑 내용값 뿌려주기
  // 검색값이랑 가지고 있는 영화 이름들을 비교 조회후에 맞는걸 보여주기
  