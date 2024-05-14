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
  
  // 현재 상태
  this.state = {
    nowPage: 1,
    inputValue: '',
    searchResult: [],
    totalResult : 0,
    isLoading: false,
  }
  
  // 상태 변경 함수
  this.setState = nextState => {
    this.state = nextState
  }
  
  // movie Div 만드는 곳
  const createMovie = () => {
    // movies가 정상인지 체크 로직 필요.
    this.state.searchResult.forEach(data => {
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
    })
  }
  
  // 데이터 들고오기
  const onFetch = async () => {
    try {
      this.setState({
        ...this.state,
        isLoading: true
      })
  
      const {inputValue, nowPage, searchResult} = this.state
  
      const url = `https://www.omdbapi.com/?i=tt3896198&apikey=9172b236&s=${inputValue}&page=${nowPage}`;
      const response = await fetch(url);
      const result = await response.json();
  
      const newSearchResult = result.Search.filter(item => !this.state.searchResult.some(existingItem => existingItem.imdbID === item.imdbID));
  
      this.setState({
        ...this.state,
        searchResult: [...this.state.searchResult, ...newSearchResult],
        totalResult: result.totalResults,
        nowPage: nowPage + 1,
        isLoading: false
      })
  
    } catch (error) {
      console.log('에러 원인 : ' + error);
      const err = document.createElement('p');
      err.className = 'errMsg';
      err.innerText = '검색 결과가 없습니다.';
      document.querySelector('.movies').appendChild(err);
    }
  }
  
  const onSearch = () => {
    this.setState({
      ...this.state,
      inputValue: document.getElementById("searchKey").value,
      nowPage: 1
    });
  
    onFetch();
    createMovie();
  };
  
  window.addEventListener('scroll', () => {
    console.log(window.innerHeight, window.scrollY, document.body.scrollHeight);
    const isScrollEnded = window.scrollY + window.innerHeight + 100 >= document.body.scrollHeight;
    const { searchResult, totalResult, isLoading } = this.state;
  
    if (isScrollEnded && searchResult.length < totalResult && !isLoading) {
      onFetch();
      createMovie();
    }
  });