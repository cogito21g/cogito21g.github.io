document.addEventListener('DOMContentLoaded', () => {
    // 한 페이지당 표시할 항목 수
    const itemsPerPage = 5;

    // videos.json 파일에서 데이터 가져오기
    fetch('data/videos.json')
        .then(response => response.json()) // JSON 데이터로 변환
        .then(data => {
            const navbar = document.getElementById('navbar'); // 네비게이션 바 요소 가져오기
            const content = document.getElementById('content'); // 컨텐츠 영역 요소 가져오기

            // 각 카테고리에 대해 반복 처리
            data.categories.forEach((category, categoryIndex) => {
                // 네비게이션 바에 카테고리 추가
                const navItem = document.createElement('li'); // 리스트 아이템 요소 생성
                const navLink = document.createElement('a'); // 링크 요소 생성
                navLink.href = `#${category.name}`; // 링크 주소 설정
                navLink.textContent = category.name; // 링크 텍스트 설정
                navItem.appendChild(navLink); // 링크를 리스트 아이템에 추가
                navbar.appendChild(navItem); // 리스트 아이템을 네비게이션 바에 추가

                // 카테고리별 테이블 컨테이너 생성
                const tableContainer = document.createElement('div'); // 테이블을 감싸는 컨테이너 요소 생성
                tableContainer.id = category.name; // 컨테이너 요소의 id 설정
                content.appendChild(tableContainer); // 컨텐츠 영역에 컨테이너 요소 추가

                // 테이블 제목 생성
                const tableTitle = document.createElement('h2'); // 테이블 제목 요소 생성
                tableTitle.textContent = category.name; // 제목 텍스트 설정
                tableContainer.appendChild(tableTitle); // 테이블 컨테이너에 제목 요소 추가

                // 테이블 요소 생성
                const table = document.createElement('table'); // 테이블 요소 생성
                tableContainer.appendChild(table); // 테이블 컨테이너에 테이블 요소 추가
                const thead = document.createElement('thead'); // 테이블 헤더 요소 생성
                const tbody = document.createElement('tbody'); // 테이블 바디 요소 생성

                // 테이블 헤더 생성
                const headers = ['Title', 'Description', 'Link', 'Date']; // 헤더 항목 배열
                const headerRow = document.createElement('tr'); // 헤더 행 요소 생성
                headers.forEach(headerText => {
                    const th = document.createElement('th'); // 셀(열) 요소 생성
                    th.textContent = headerText; // 셀 텍스트 설정
                    headerRow.appendChild(th); // 헤더 행에 셀 추가
                });
                thead.appendChild(headerRow); // 테이블 헤더에 헤더 행 추가
                table.appendChild(thead); // 테이블에 헤더 추가
                table.appendChild(tbody); // 테이블에 바디 추가

                // 페이지 네이션을 위한 컨테이너 생성
                const pagination = document.createElement('div'); // 페이지네이션 요소 생성
                pagination.className = 'pagination'; // 클래스 설정
                tableContainer.appendChild(pagination); // 테이블 컨테이너에 페이지네이션 요소 추가

                // 이전 페이지 버튼 생성 및 이벤트 처리
                const prevButton = document.createElement('button'); // 이전 페이지 버튼 요소 생성
                prevButton.textContent = 'Prev'; // 버튼 텍스트 설정
                prevButton.addEventListener('click', () => changePage(categoryIndex, -1)); // 클릭 이벤트 추가
                pagination.appendChild(prevButton); // 페이지네이션에 버튼 추가

                // 페이지 입력 필드 생성 및 이벤트 처리
                const pageInput = document.createElement('input'); // 페이지 입력 필드 요소 생성
                pageInput.type = 'number'; // 입력 필드 타입 설정
                pageInput.value = 1; // 초기 값 설정
                pageInput.min = 1; // 최소 값 설정
                pageInput.addEventListener('change', () => { // 변경 이벤트 처리
                    const newPage = parseInt(pageInput.value); // 입력된 페이지 값 가져오기
                    if (newPage >= 1 && newPage <= pageInput.max) { // 유효한 페이지 범위 확인
                        displayPage(categoryIndex, newPage); // 페이지 표시 함수 호출
                    } else {
                        pageInput.value = currentPage; // 현재 페이지로 되돌리기
                    }
                });
                pagination.appendChild(pageInput); // 페이지네이션에 입력 필드 추가

                // 전체 페이지 수 표시 요소 생성
                const totalPagesDisplay = document.createElement('span'); // 전체 페이지 수 요소 생성
                pagination.appendChild(totalPagesDisplay); // 페이지네이션에 추가

                // 다음 페이지 버튼 생성 및 이벤트 처리
                const nextButton = document.createElement('button'); // 다음 페이지 버튼 요소 생성
                nextButton.textContent = 'Next'; // 버튼 텍스트 설정
                nextButton.addEventListener('click', () => changePage(categoryIndex, 1)); // 클릭 이벤트 추가
                pagination.appendChild(nextButton); // 페이지네이션에 버튼 추가

                // 초기 페이지 표시
                displayPage(categoryIndex, 1); // 초기 페이지 표시 함수 호출

                // 페이지 변경 함수
                function changePage(categoryIndex, direction) {
                    const currentPage = parseInt(pageInput.value); // 현재 페이지 번호 가져오기
                    const totalPages = parseInt(pageInput.max); // 전체 페이지 수 가져오기
                    const newPage = currentPage + direction; // 새로운 페이지 계산
                    if (newPage >= 1 && newPage <= totalPages) { // 페이지 번호가 유효한 범위 내인지 확인
                        displayPage(categoryIndex, newPage); // 새 페이지 표시 함수 호출
                    }
                }

                // 페이지 표시 함수
                function displayPage(categoryIndex, pageNum) {
                    const category = data.categories[categoryIndex]; // 선택한 카테고리 데이터 가져오기
                    const table = document.querySelector(`#${category.name} table tbody`); // 테이블 바디 요소 선택
                    table.innerHTML = ''; // 기존 행 모두 삭제

                    const start = (pageNum - 1) * itemsPerPage; // 페이지 시작 인덱스 계산
                    const end = start + itemsPerPage; // 페이지 끝 인덱스 계산
                    const pageVideos = category.videos.slice(start, end); // 해당 페이지에 표시할 비디오 가져오기

                    // 페이지에 표시할 각 비디오 데이터 처리
                    pageVideos.forEach((video, videoIndex) => {
                        const row = document.createElement('tr'); // 행 요소 생성

                        // 제목 셀 생성 및 데이터 설정
                        const titleCell = document.createElement('td'); // 제목 셀 요소 생성
                        titleCell.textContent = video.title; // 제목 설정
                        row.appendChild(titleCell); // 행에 셀 추가

                        // 설명 셀 생성 및 데이터 설정
                        const descriptionCell = document.createElement('td'); // 설명 셀 요소 생성
                        descriptionCell.textContent = video.description; // 설명 설정
                        descriptionCell.className = 'description'; // 클래스 설정
                        row.appendChild(descriptionCell); // 행에 셀 추가

                        // 링크 셀 생성 및 데이터 설정
                        const linkCell = document.createElement('td'); // 링크 셀 요소 생성
                        const link = document.createElement('a'); // 링크 요소 생성
                        link.href = `detail.html?category=${categoryIndex}&video=${start + videoIndex}`; // 링크 URL 설정
                        link.textContent = "View Video"; // 링크 텍스트 설정
                        linkCell.appendChild(link); // 링크 셀에 링크 요소 추가
                        row.appendChild(linkCell); // 행에 셀 추가

                        // 날짜 셀 생성 및 데이터 설정
                        const dateCell = document.createElement('td'); // 날짜 셀 요소 생성
                        dateCell.textContent = video.date; // 날짜 설정
                        row.appendChild(dateCell); // 행에 셀 추가

                        table.appendChild(row); // 테이블에 행 추가
                    });

                    // 전체 페이지 수 계산 및 표시
                    const totalPages = Math.ceil(category.videos.length / itemsPerPage); // 전체 페이지 수 계산
                    pageInput.max = totalPages; // 입력 필드의 최대 값 설정
                    pageInput.value = pageNum; // 입력 필드의 값 설정
                    totalPagesDisplay.textContent = ` / ${totalPages}`; // 전체 페이지 수 표시
                }
            });

            // 섹션으로 스무스 스크롤 설정
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault(); // 기본 동작 방지
                    document.querySelector(this.getAttribute('href')).scrollIntoView({ // 해당 섹션으로 스무스 스크롤
                        behavior: 'smooth'
                    });
                });
            });
        })
        .catch(error => console.error('Error loading videos:', error)); // 데이터 로딩 중 에러 처리
});
