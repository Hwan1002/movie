<h1>HWANFLIX 🎬</h1>

<div className="readImg">
    <img src="https://raw.githubusercontent.com/Hwan1002/movie/main/docs/home.png" style="width:100%" alt="메인 화면"/>
</div>
<br/>
<h4 style="color:black; background-color:white; margin:0; padding:0;">넷플릭스 감성의 영화 검색 서비스 !</h4><br/>

<b>🍿 Vanilla JS 영화 검색 & 즐겨찾기 서비스</b><br/>

<div className="readLineheight">
 프레임워크와 빌드 도구 없이 순수 자바스크립트로 만든 영화 검색 서비스입니다. <br/>
 OMDb API로 영화를 검색하고, 상세 정보를 확인하고, 즐겨찾기로 나만의 컬렉션을 관리할 수 있습니다.
</div>
<br/>

<p align="center">
    <a href="https://hwan1002.github.io/movie/">
        🔗 지금 바로 HWANFLIX 사용하기</a>
</p>
<br/>

<h4 style="color:black; background-color:white; margin:0; padding:0;">🚀 프로젝트 소개</h4>

<b>🔍 영화 검색 & 오늘의 추천
</b>
<div className="readImg">
    <img
        src="https://raw.githubusercontent.com/Hwan1002/movie/main/docs/search.gif"
        style="width:100%"
        alt="검색 데모"/>
</div>

<div className="readLineheight">
<b>
    "오늘은 어떤 영화를 볼까?"</b><br/>
<ul>
    <li>첫 화면에는 랜덤 키워드 기반의 '오늘의 추천' 영화가 자동으로 채워집니다.</li>
    <li>타이핑을 멈추면 자동으로 결과가 갱신되는 실시간 검색(debounce)을 지원합니다.</li>
    <li>타입(영화/시리즈/에피소드)과 연도 필터로 원하는 결과만 골라볼 수 있습니다.</li>
    <li>최근 검색어가 칩으로 저장되어 클릭 한 번으로 재검색할 수 있습니다.</li>
    <li>검색 상태가 URL(<code>?s=batman&type=movie</code>)로 동기화되어 새로고침·링크 공유가 가능합니다.</li>
</ul>
</div>
<br/>

<b>🎢 무한 스크롤
</b>
<div className="readImg">
    <img
        src="https://raw.githubusercontent.com/Hwan1002/movie/main/docs/scroll.gif"
        style="width:100%"
        alt="무한 스크롤 데모"/>
</div>

<div className="readLineheight">
<b>
    "스크롤만 내리면 영화가 계속!"</b><br/>
<ul>
    <li>IntersectionObserver로 페이지 하단을 감지해 다음 페이지를 미리 불러옵니다.</li>
    <li>새로 등장하는 카드는 fade-in 애니메이션으로 자연스럽게 나타납니다.</li>
    <li>로딩 중에는 스켈레톤 카드가 먼저 깔려 화면 흔들림 없이 자연스럽게 전환됩니다.</li>
    <li>같은 검색(키워드+필터+페이지)은 메모리에 캐싱되어 불필요한 API 호출을 줄였습니다.</li>
    <li>'맨 위로' 버튼으로 언제든 부드럽게 상단으로 돌아갈 수 있습니다.</li>
</ul>
</div>
<br/>

<b>❤️ 상세 정보 & 즐겨찾기
</b>
<div className="readImg">
    <img
        src="https://raw.githubusercontent.com/Hwan1002/movie/main/docs/favorite.gif"
        style="width:100%"
        alt="상세 모달과 즐겨찾기 데모"/>
</div>

<div className="readLineheight">
<b>
    "마음에 드는 영화는 내 컬렉션으로!"</b><br/>
<ul>
    <li>카드를 클릭하면 줄거리, IMDb 평점, 감독, 출연진을 모달로 보여줍니다.</li>
    <li>모달 안에서 바로 즐겨찾기 추가/해제(LOVE IT!)가 가능합니다.</li>
    <li>즐겨찾기는 localStorage에 저장되어 브라우저를 껐다 켜도 유지됩니다.</li>
    <li>즐겨찾기 버튼에 저장된 영화 개수가 뱃지로 표시됩니다.</li>
    <li>모달의 공유 버튼으로 검색 링크를 공유(Web Share API / 클립보드 복사)할 수 있습니다.</li>
    <li>alert 대신 토스트 알림으로 부드러운 피드백을 제공합니다.</li>
</ul>
</div>

<h1>
    <b>🛠️ Tech Stack</b>
</h1>

<p align="center">
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
    <img src="https://img.shields.io/badge/OMDb%20API-BE213F?style=for-the-badge" alt="OMDb API"/>
    <img src="https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Pages"/>
</p>

<div className="readLineheight">
<ul>
    <li>프레임워크 없이 HTML / CSS / Vanilla JavaScript로만 구현</li>
    <li><code>fetch</code> + <code>async/await</code>, <code>URLSearchParams</code>, History API</li>
    <li><code>IntersectionObserver</code> — 무한스크롤 감지 & 카드 등장 애니메이션</li>
    <li><code>localStorage</code> — 즐겨찾기·최근 검색어, 메모리 <code>Map</code> — 검색 결과 캐싱</li>
</ul>
</div>
<br/>

<div className="readLineheight">
 ※ 클라이언트 전용 정적 사이트라 OMDb API 키가 소스에 노출됩니다. OMDb 무료 키는 공개를 전제로 하지만, 실서비스라면 서버 프록시를 통해 키를 숨겨야 합니다.
</div>
<br/>

<b>✨ 지금 바로 HWANFLIX에서 인생 영화를 찾아보세요!
</b>
