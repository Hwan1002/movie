# HWANFLIX 🎬

영화를 검색하고 즐겨찾기에 추가/삭제할 수 있는 바닐라 JS 토이 프로젝트

**Demo**: https://hwan1002.github.io/movie/

## 기능

- **오늘의 추천** — 첫 화면에 랜덤 키워드 기반 추천 영화 자동 표시
- **영화 검색** — [OMDb API](https://www.omdbapi.com/) 기반 제목 검색, 결과 개수 표시
- **최근 검색어** — localStorage에 최대 8개 저장, 칩 클릭으로 재검색
- **무한 스크롤** — `IntersectionObserver` 기반 다음 페이지 자동 로드 (마지막 페이지에서 자동 중단)
- **카드 등장 애니메이션** — 스크롤로 화면에 들어오는 카드가 fade-in으로 등장
- **상세 정보 모달** — 카드 클릭 시 줄거리, 평점, 감독, 출연진 표시 (ESC / 바깥 클릭으로 닫기)
- **즐겨찾기** — localStorage에 저장, `imdbID` 기준 중복 방지
- **로딩 스피너 & 토스트 알림** — 요청 중 상태 표시, alert 대신 토스트 UI
- **맨 위로 버튼** — 일정 스크롤 이후 표시, 클릭 시 부드럽게 상단 이동
- **포스터 대체 이미지** — 포스터가 없거나 로드 실패 시 인라인 SVG 플레이스홀더

## 기술 스택

- HTML / CSS / Vanilla JavaScript (프레임워크, 빌드 도구 없음)
- OMDb REST API + `fetch` / `async-await`
- `localStorage`, `IntersectionObserver` (무한스크롤·등장 애니메이션), debounce

## 참고

- 클라이언트 전용 정적 사이트라 OMDb API 키가 소스 노출중. OMDb 무료 키는 공개를 전제로 하지만, 실서비스라면 서버 프록시를 통해 키를 숨겨함
