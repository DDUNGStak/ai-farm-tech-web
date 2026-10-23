# AI팜테크 홈페이지 (ai-farm-tech.com)

빌드 과정이 없는 정적 사이트입니다. 폴더를 그대로 웹 호스팅에 올리면 됩니다.

| 주소 | 파일 | 내용 |
|---|---|---|
| `/` | `index.html` | 회사 홈페이지 (메인) |
| `/meongsam/` | `meongsam/index.html` | 멍삼연구소 브랜드 페이지 → 네이버 스마트스토어 연결 |

```
assets/
  css/style.css      공통 스타일 (아래쪽에 멍삼연구소 전용 스타일)
  js/config.js       ★ 스마트스토어 주소·회사 정보 — 여기만 고치면 전체 반영
  js/main.js         메뉴·스크롤 효과·config 값 채우기
  img/mark.svg             AI팜테크 로고 마크 (파비콘 겸용)
  img/meongsam-mark.svg    멍삼연구소 로고 마크
  img/meongsam-dog.svg     멍삼연구소 강아지 일러스트
  img/og-image.png         공유용 대표 이미지 (카카오톡·SNS 미리보기, 1200×630)
robots.txt  sitemap.xml  llms.txt   검색엔진·AI 크롤러용 (GEO)
```

`index.html`의 자주 묻는 질문(#faq)과 `<head>`의 JSON-LD FAQPage는 같은 문구입니다. 한쪽을 고치면 다른 쪽도 함께 고칩니다.

## 자주 고칠 곳

- **스마트스토어 주소**: `assets/js/config.js` → `links.smartstore`
- **유튜브·인스타그램**: 같은 파일의 `links.youtube`, `links.instagram` — 비워 두면 버튼이 자동으로 숨겨집니다
- **사업자등록번호**: `company.bizNo` — 채우면 푸터에 표시됩니다

## 로컬 미리보기

```bash
python -m http.server 8790 --directory C:/Users/dygks/ai-farm-tech-web
```

브라우저에서 http://localhost:8790 접속.

## 공개 전 확인할 것

- [ ] 스마트스토어 개설 시: `config.js`에 주소를 넣고 '판매할 예정' 문구를 현재형으로 되돌리기 — `index.html`(FAQ 12번·JSON-LD·멍삼연구소 밴드), `meongsam/index.html`(설명·안내 문구), `llms.txt`
- [ ] 사업자등록번호 입력 (법인 전환 시 상호도 `주식회사 AI팜테크` 등으로 수정)
- [x] 협력 기업 이름 공개 동의 확인 (2026-10-21 동의, `#partners` 섹션)
- [ ] 문의 이메일을 대표 개인 주소 대신 `contact@` 같은 공용 주소로 바꿀지 결정
- [ ] 멍삼연구소 카피를 실제 제품 정보(원재료·급여량)와 맞추기 — 사료관리법상 질병 예방·치료 등 효능 표현은 쓰지 않기
- [x] 공유용 대표 이미지(og:image, 1200×630) 추가 — `assets/img/og-image.png` (두 페이지 공통)

## 배포 메모

무료 정적 호스팅(Cloudflare Pages, GitHub Pages, Netlify 등) 어디든 올릴 수 있고,
도메인 등록업체 DNS에서 `ai-farm-tech.com`과 `www`를 호스팅으로 연결하면 됩니다.
