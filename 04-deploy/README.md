## 📦 BLUEMAP GI Registry 설치 방법

이 프로젝트는 **Ubuntu + Docker 환경**에서 작동하며, 다음 두 가지 방식 중 하나로 설치할 수 있습니다:

1. Docker Hub에서 이미지 다운로드 및 실행
2. tar 파일을 통해 로컬에서 직접 설치

---

## 📁 디렉토리 구성

```bash
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

## 🚀 설치 방법

### [방법 1] Docker Hub에서 설치

```bash
chmod +x run_by_docker_hub.sh
sudo ./run_by_docker_hub.sh

```

---

### [방법 2] tar 파일로 설치

1. `.tar` 파일을 서버로 업로드 (docker-compose.yml 파일과 동일한 위치에 둠)
2. 아래 명령어 실행
3. 이후 tar 파일은 삭제

```bash
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

※ `<서버주소>`는 현재 사용하고 있는 서버의 주소를 대입해 확인하시면 됩니다. 

---

## +) 컨테이너 다운 시
```bash
docker-compose -p gi-registry down
```