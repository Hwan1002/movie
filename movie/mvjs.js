(() => {
    console.log("DOM start script");
  
    /**
     * @description Element 스타일 핸들러
     * @return {void}
     */
      const initStyle = () => {
      const inputNode = document.querySelector("#searchKey");
        //   inputNode instanceof HTMLInputElement && (inputNode.style.padding = "0.25rem 1rem");
        //   inputNode instanceof HTMLInputElement && (inputNode.style.outline = "none");
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
  
  /**
   * @description search 버튼 클릭 이벤트 핸들러.
   */
  const onSearch = async () => {
    try {
      debugger;
      const s = document.getElementById("searchKey").value;
      const url = `https://www.omdbapi.com/?i=tt3896198&apikey=9172b236&s=${s}`;
      const response = await fetch(url);
      const result = await response.json();

      for(data of result.Search){
        console.log(data);
        // const obj = JSON.stringify(data);
        const mvForm = document.getElementsByClassName("mvForm");
        const mvContent = document.createElement("div").className = 'mvContent';
        const mvImage = document.createElement("div").className ='mvImage';
        const mvposter = document.createElement("img");

        mvForm.append(mvContent);

        const moviePtag = document.createElement("p");
        moviePtag.style.padding = "1rem 1rem";
        moviePtag.style.color="#fff";
        moviePtag.innerHTML = data["Title"];

        const title = mvContent.appendChild(moviePtag);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
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
  