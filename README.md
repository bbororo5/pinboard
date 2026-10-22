# Pinboard

마음에 드는 장면을 발견하고 나만의 보드에 모으는 Pinterest 스타일 프론트엔드 데모입니다. React · TypeScript · Vite · React Router · IndexedDB로 구현했습니다. 한국어 UI와 모바일·태블릿·데스크톱 레이아웃을 제공합니다.

## 실행과 검증

Node.js 22.12 이상(22.x, 24.x, 26 이상)과 npm이 필요합니다.

```bash
npm ci
npm run dev
```

터미널에 표시된 로컬 주소를 여세요. 기본 주소는 `http://127.0.0.1:5173`입니다.

```bash
npm run typecheck
npm test
npm run build
npm audit
node scripts/verify-history.mjs
```

배포용 파일은 `dist/`에 생성됩니다. 호스팅은 포함하지 않습니다. 추후 정적 호스팅 시 모든 앱 경로를 `index.html`로 연결하는 SPA fallback이 필요합니다. 개발 서버는 localhost에만 바인딩합니다.

