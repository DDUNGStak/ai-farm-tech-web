/*
 * 사이트 전역 설정 — 외부 링크와 회사 정보는 이 파일 한 곳에서만 고칩니다.
 * HTML에서 data-link="키" 가 붙은 링크는 아래 값으로 주소가 채워지고,
 * 값이 비어 있으면 해당 요소(data-optional)는 화면에서 숨겨집니다.
 */
window.SITE_CONFIG = {
  links: {
    // TODO: 멍삼연구소 네이버 스마트스토어 주소로 교체 (예: https://smartstore.naver.com/meongsamlab)
    smartstore: 'https://smartstore.naver.com/',
    // 선택: 유튜브 채널 주소 — 비워 두면 버튼이 숨겨집니다
    youtube: '',
    // 선택: 인스타그램 주소 — 비워 두면 버튼이 숨겨집니다
    instagram: '',
  },
  company: {
    name: 'AI팜테크',
    ceo: '탁요한',
    address: '전북특별자치도 진안군 진안읍',
    email: 'ceotak@ai-farm-tech.com',
    // TODO: 사업자등록번호 — 비워 두면 푸터에 표시되지 않습니다
    bizNo: '',
  },
};
