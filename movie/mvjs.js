//데이터 가져오는 api
const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener('click',function() {
	try {
        debugger;
        const s = document.getElementById("searchKey").value;
        const url = `https://www.omdbapi.com/?i=tt3896198&apikey=9172b236&s=${s}`;
        debugger;
        fetch(url).then((response) => {
            console.log('response', 'body' in response, 'json' in response, 'text' in response)
            return response.body()
            }).then(json => {
            console.log('json', json)
            })
		console.log('json:', json);

	} catch (error) {
		console.error(error);
	}
    
})

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
