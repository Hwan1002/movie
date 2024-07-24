(() => {
    console.log("DOM start script");

    // DOM 요소 스타일 핸들러
    const initStyle = () => {
        const inputNode = document.querySelector("#searchKey");
    };

    // 키보드에서 엔터키 눌렀을 때 검색 실행
    const onBlockEnter = (e) => {
        if (e.keyCode === 13 && e.key === "Enter") {
            e.preventDefault();
            onSearch();
        }
    };
    document.addEventListener("keydown", onBlockEnter);
    initStyle();
})();

// 현재 상태값 저장
const state = {
    nowPage: 1,
    inputValue: '',
    searchResult: [], // 검색 결과를 저장하는 배열
    totalPage: 0,
    isProcessing: false,
};
//즐겨찾기 버튼 클릭 시 텍스트 변경
const favBtn = document.querySelector(".favBtn"); 
    favBtn.addEventListener("click", function(){
        if(favBtn.innerText==="즐겨찾기"){
            favBtn.innerText="돌아가기";
        }else{
            favBtn.innerText="즐겨찾기";
        }
    })
// 즐겨찾기 버튼 클릭 시 동작

const favorClicked = () => {
    console.log("즐겨찾기 버튼 클릭");
    const movies = document.querySelector(".movies");
    
    getFavorite();
    movies.classList.toggle("hide");
    document.querySelector(".favorites").classList.toggle("hide");
};

// 즐겨찾기 버튼 클릭 시 영화 추가
const loveClicked = (movie) => {
    console.log("러브잇 버튼 클릭 loveClicked 실행");

    // 로컬스토리지에서 즐겨찾기 목록을 가져옴
    let favorites = JSON.parse(localStorage.getItem('savedFavorite')) || [];
    // favorites가 배열인지 확인 및 초기화
    if (!Array.isArray(favorites)) {
        favorites = [];
    }
    // 영화가 이미 즐겨찾기에 있는지 확인
    if (favorites.some(favorite => favorite.Title === movie.Title)) {
        alert('이미 등록된 영화입니다.');
    } else {
        // 영화가 즐겨찾기에 없으면 추가
        favorites.push(movie);
        // 로컬스토리지에 즐겨찾기 목록을 저장
        localStorage.setItem('savedFavorite', JSON.stringify(favorites));
        getFavorite(movie);
        alert(`${movie.Title} 영화가 즐겨찾기에 추가되었습니다.`);
    }
};

// CANCEL 버튼 클릭 시 즐겨찾기 목록 초기화
const cancelClicked = (title) => {

   // 로컬스토리지에서 즐겨찾기 목록을 가져옴
   let favorites = JSON.parse(localStorage.getItem("savedFavorite")) || [];
   
   // 즐겨찾기 목록에서 해당 제목의 영화를 제거
   favorites = favorites.filter(movie => movie.Title !== title);

   // 업데이트된 즐겨찾기 목록을 로컬스토리지에 저장
   localStorage.setItem("savedFavorite", JSON.stringify(favorites));
    alert(`${title}을 즐겨찾기에서 삭제하였습니다.`)
   // 즐겨찾기 목록을 다시 불러와 갱신
   getFavorite();
};

// 로컬 스토리지에서 데이터 가져오기
const getFavorite = () => {
   
    let getData = localStorage.getItem("savedFavorite");
    const favoritesContainer = document.querySelector(".favorites");
    favoritesContainer.innerHTML = ''; // 기존 즐겨찾기 목록 초기화

    if (!getData) {
        return [];
    } else {
        const favorites = JSON.parse(getData);
        favorites.forEach(movie => {
            console.log(movie.Title); // 각 영화의 제목을 콘솔에 출력
            const divNodeDummy = document.createElement('div');
            divNodeDummy.classList.add('mvContent');
            divNodeDummy.classList.add('favContent');
            const divImgNode = document.createElement('div');
            divImgNode.classList.add('mvImage');
            const imgNode = document.createElement('img');
            imgNode.src=movie.Poster;
            imgNode.onerror=this.src='img/pic_error.png';
            
            const divTitle = document.createElement('div');
            divTitle.classList.add('mvTitle');
            const spanNode = document.createElement('span');
            const titleP = document.createElement('p');
            titleP.classList.add("title");
            titleP.id="title";
            titleP.innerText=movie.Title;
            const typeP = document.createElement('p');
            typeP.id="type";
            typeP.innerText=movie.Type;
            const btn = document.createElement("button");
            btn.classList.add("btn");
            btn.type="button";
            btn.onclick = () => cancelClicked(movie.Title);

            btn.innerText="CANCEL";

            divTitle.appendChild(spanNode);
            spanNode.appendChild(titleP);
            spanNode.appendChild(typeP);
            spanNode.appendChild(btn);

            // spanNode.appendChild(button);
            divImgNode.appendChild(imgNode);
            divNodeDummy.appendChild(divImgNode);
            divNodeDummy.appendChild(divTitle);

            document.querySelector('.favorites').appendChild(divNodeDummy);
        });
        return favorites;
    
    }
    
};

// 검색 버튼 클릭 시 검색창 표시/숨김
const searchBtnClicked = () => {
    console.log("검색버튼 클릭");
    const searchBtn = document.querySelector(".searchBtn");
    const searchBar = document.querySelector(".mvSearch");
    searchBtn.classList.toggle("hide");
    searchBar.classList.toggle("hide");
};

// 검색 결과로 영화 DIV 생성
const createMvDiv = () => {
    console.log("start create DIV");

    for (const [index, data] of Object.entries(state.searchResult)) {
        // mvcontent div영역
        const divNodeDummy = document.createElement('div');
        divNodeDummy.classList.add('mvContent');

        // mvImage div 영역
        const divImgNode = document.createElement('div');
        divImgNode.classList.add('mvImage');
        const imgNode = document.createElement('img');
        imgNode.src = data['Poster'];
        imgNode.onerror = () => imgNode.src = 'img/pic_error.png';

        // mvTitle 영역
        const divTitle = document.createElement('div');
        divTitle.classList.add('mvTitle');
        const spanNode = document.createElement('span');
        const titleP = document.createElement('p');
        titleP.classList.add("title");
        titleP.id = "title";
        titleP.innerText = data["Title"];
        const typeP = document.createElement('p');
        typeP.id = "type";
        typeP.innerText = data["Type"];
        const btn = document.createElement("button");
        btn.classList.add('btn');
        btn.textContent = 'LOVE IT!';
        btn.onclick = () => loveClicked(data); // movie 객체를 넘김

        divTitle.appendChild(spanNode);
        spanNode.appendChild(titleP);
        spanNode.appendChild(typeP);
        spanNode.appendChild(btn);

        divImgNode.appendChild(imgNode);
        divNodeDummy.appendChild(divImgNode);
        divNodeDummy.appendChild(divTitle);

        document.querySelector('.movies').appendChild(divNodeDummy);
    }
};

// 검색 버튼 클릭 이벤트 핸들러
const onSearch = async () => {
    try {
        const s = document.getElementById("searchKey").value;
        const url = `https://www.omdbapi.com/?i=tt3896198&apikey=9172b236&s=${s}`;
        const response = await fetch(url);
        const result = await response.json();
        const totalResult = result.totalResults;
        const totalPage = Math.ceil(totalResult / 10);

        state.inputValue += s;
        state.totalPage += totalPage;
        state.searchResult = result.Search;
        
        createMvDiv();

    } catch (error) {
        console.log('에러 원인 : ' + error);
        const err = document.querySelector('.errMsg');
        err.classList.remove("hide");
    }
};

// 디바운스 함수
const debounce = (callback, delay = 120) => {
    let timer;
    return (e) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            callback(e);
        }, delay);
    };
};

// 스크롤 시 무한 스크롤 처리
const scrollBouce = async () => {
    console.log(window.scrollY, window.innerHeight);
    console.log(state.isProcessing);

    const isScrollEnded = window.scrollY + window.innerHeight + 100 >= document.body.scrollHeight;

    if (isScrollEnded && !state.isProcessing) {
        state.isProcessing = true;

        try {
            const url = `https://www.omdbapi.com/?i=tt3896198&apikey=9172b236&s=${state.inputValue}&page=${state.nowPage += 1}`;
            console.log(url);
            const response = await fetch(url);
            const result = await response.json();
            state.searchResult = result.Search;
            createMvDiv();
        } catch (error) {
            console.log('wating to scroll ' + error);
            const err = document.createElement('p');
            err.className = 'errMsg';
            document.querySelector('.movies').appendChild(err);
        } finally {
            state.isProcessing = false;
        }
    }
};

window.addEventListener('scroll', debounce(scrollBouce));
