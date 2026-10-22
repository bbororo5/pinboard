# 구조와 데이터 흐름

React Router가 화면 URL을 관리하고, DataProvider가 비동기 저장소의 snapshot과 쓰기 후 갱신을 조정합니다. 화면 컴포넌트는 IndexedDB 트랜잭션을 직접 다루지 않습니다. UI가 성공을 표시하기 전에 저장 완료와 새 snapshot 조회를 기다립니다. 모달·업로드 미리보기·입력·페이지 크기는 각 컴포넌트의 React 상태입니다.

## 경로

| 경로                     | 화면                        |
| ------------------------ | --------------------------- |
| `/`                      | 홈 피드                     |
| `/search?q=…&category=…` | 검색·필터                   |
| `/pin/:id`               | 상세·확대·관련 핀           |
| `/pin/:id/edit`          | 직접 만든 핀 수정           |
| `/boards`                | 보드 목록                   |
| `/boards/:id`            | 보드·저장 해제              |
| `/profile?tab=created`   | 만든 핀 (`tab` 없으면 보드) |
| `/create`                | 핀 만들기                   |
| `/about`                 | 데모·사진 안내              |
| 그 외                    | 없는 페이지 안내            |

## 모듈

- `domain`: Pin, Board, BoardPin, Profile 타입 및 검색·입력 검증. 공백과 대소문자를 정규화하고 모든 검색 단어를 포함하는 레코드를 반환합니다.
- `storage`: idb 데이터베이스와 repository. 초기 데이터는 최초 실행 시 단일 트랜잭션으로 주입합니다. 보드·핀 삭제는 저장 관계와 함께 원자적으로 처리합니다.
- `context`: loading/error/snapshot, 성공 이후 refresh와 라이브 알림.
- `components`: PinImage, PinCard, PinGrid, BoardCard, dialog 등 재사용 UI.
- `pages`: 사용자 흐름별 화면. 파일은 브라우저에서 검증·디코딩하고 Blob으로 저장합니다.
- `styles`: 전역 토큰과 CSS Modules. 피드는 CSS columns, 화면 폭에 따라 2~6열로 전환합니다.

## 저장 계약

DB `pinboard`, 버전 1. `pins`와 `boards`는 `id`, `saved`는 `[boardId,pinId]`를 키로 사용합니다. `meta`는 최초 초기화 여부를 보관합니다. 저장 관계는 중복되지 않으며 존재하는 핀·보드만 연결합니다. Blob URL은 사용 시 생성하고 컴포넌트 해제 시 반환합니다. 샘플 이미지는 `/images/`에서 읽습니다. 브라우저 데이터 삭제는 복구할 수 없으며 백엔드·계정·동기화는 없습니다.

관련 핀은 공통 태그 수 내림차순이며 자기 자신을 제외합니다. 검색 결과는 URL로 재현됩니다. 추가 로딩은 로컬 데이터에서 18개씩 표시합니다. HTTP(S) 외의 출처 링크는 렌더링하지 않습니다. 서버 API 및 공개 토큰은 없습니다.

## 변경 시 주의

새 저장소 스키마는 IndexedDB 버전을 올리고 upgrade 마이그레이션을 추가해야 합니다. origin이 바뀌면 저장소도 달라집니다. 이미지가 삭제되면 object URL도 재생성·정리됩니다. 서버를 도입할 때 repository의 비동기 계약을 교체하고 인증·서버 권한·이미지 보관 정책을 별도로 구현하세요.
