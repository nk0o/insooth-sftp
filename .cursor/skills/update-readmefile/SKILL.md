---
name: update-readmefile
description: Updates the Insooth skin README.md folder tree by running the project script. Use only when the user explicitly says "update readmefile".
disable-model-invocation: true
---

# update readmefile

README.md는 사용자가 `update readmefile`이라고 했을 때만 갱신한다. 파일을 만들거나 고친 뒤 README를 같이 수정하지 않는다.

## 실행

프로젝트 루트에서 이 명령만 실행한다.

```bash
node .cursor/skills/update-readmefile/scripts/update-readme-tree.js
```

## 규칙

- 최상위 표와 유지보수 파일 트리는 스크립트 출력만 쓴다. 손으로 다시 쓰지 않는다.
- 마커 밖 문장은 스크립트가 그대로 둔다.
- 파일 옆 설명을 바꿀 때만 스크립트의 `DESCRIPTIONS`, `NOTES`를 수정한 뒤 같은 명령을 다시 실행한다.
- 끝난 뒤 갱신됐는지, 이미 최신인지만 짧게 알린다.
