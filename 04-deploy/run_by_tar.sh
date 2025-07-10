#!/bin/bash

# 환경변수 파일 불러오기
source .env_registry

# 동적으로 환경 변수 설정
export REACT_APP_ROOT_DEPLOY_URL=http://${ROOT_SERVER}:21803
export API_BASE_URL=http://${ROOT_SERVER}:21803
export MONGO_URI=mongodb://${ROOT_SERVER}:21801

echo "▶ Docker 이미지 로드 중..."
docker load -i ./gi-registry-all.tar

echo "▶ 현재 디렉토리: $(pwd)"
echo "▶ GI Registry Docker Compose 실행 시작..."

docker-compose up -d --build

echo ""
echo "✅ GI Registry가 다음 주소에서 실행됩니다:"
echo "   - 프론트엔드: $REACT_APP_ROOT_DEPLOY_URL"
echo "   - 백엔드(API Gateway): $API_BASE_URL"
echo "   - MongoDB 내부 접근 (Docker 네트워크 기준): $MONGO_URI"
