## BLUEMAP GI Registry 설치방법

우분투 & 도커를 사용함

다음과 같이 둘 중 하나의 방법으로 설치가 가능합니다. 

```jsx
1. docker-hub에서 실행
2. tar 파일을 다운로드받아 로컬에서 진행
```

초기 폴더구조는 다음과 같습니다. 

```jsx
04-deploy/
├── "이 위치에서 진행"
├── docker-compose.yml
├── run_compose.sh
├── nginx_conf/
│   ├── default.conf
```

1. 준비사항
    - 해당 프로젝트는 DB, FE, BE 세가지로 구성되어있어 각각 서버주소가 필요함
    - `.env_registry` 파일에서 `ROOT_SERVER` 값을 구동하고 있는 서버에 맞게 작성한 수 저장
        
        ```jsx
        # 서버 기본 주소 (사용자가 지정 - 해당 항목만 변경할 것)
        ROOT_SERVER=localhost  # 또는 example.kr
        ```
        
2. 도커 허브에서 이미지 직접 다운받는 경우
    - 다음 명령어를 실행
    
    ```jsx
    ./run_by_docker_hub.sh
    ```
    
3. tar 파일을 받아서 로컬에서 진행
    - tar 파일을 파일시스템 상으로 업로드
    - 이후 다음 명령어를 실행
    
    ```jsx
    ./run_by_tar.sh
    ```