## 📦 BLUEMAP GI Registry 설치 방법

이 프로젝트는 **Ubuntu + Docker 환경**에서 작동하며, 다음 두 가지 방식 중 하나로 설치할 수 있습니다:

1. Docker Hub에서 이미지 다운로드 및 실행
2. tar 파일을 통해 로컬에서 직접 설치

---

## 📁 디렉토리 구성

```bash
bash
복사편집
04-deploy/
├── docker-compose.yml
├── run_by_docker_hub.sh      # Docker Hub에서 설치할 때 사용
├── run_by_tar.sh             # tar 파일로 설치할 때 사용
├── nginx_conf/
│   └── default.conf

```

> ※ 모든 설치 작업은 04-deploy 디렉토리에서 진행합니다.
> 

---

## ✅ 사전 설정 필요 없음

- **서버 주소(`ROOT_SERVER`)는 자동 감지되므로**, 별도로 설정할 필요가 없습니다.
- 내부적으로 실행 스크립트에서 현재 서버의 IP를 자동으로 인식해 환경변수에 반영합니다.

---

## 🚀 설치 방법

### [방법 1] Docker Hub에서 설치

```bash
bash
복사편집
chmod +x run_by_docker_hub.sh
sudo ./run_by_docker_hub.sh

```

---

### [방법 2] tar 파일로 로컬에서 설치

1. `.tar` 파일을 서버로 업로드
2. 아래 명령어 실행

```bash
bash
복사편집
chmod +x run_by_tar.sh
sudo ./run_by_tar.sh

```

---

## 🔍 배포 후 접속 확인

| 서비스 | 주소 |
| --- | --- |
| ✅ **Backend Swagger UI** | `http://<서버주소>:21803/swagger-ui/index.html` |
| ✅ **Frontend UI** | `http://<서버주소>:21804` |
| 🔎 (선택) Admin CSS 확인 | `http://<서버주소>:21803/static/admin/css/base.css` |

※ `<서버주소>`는 스크립트에서 자동 감지되므로 따로 작성하지 않아도 됩니다.