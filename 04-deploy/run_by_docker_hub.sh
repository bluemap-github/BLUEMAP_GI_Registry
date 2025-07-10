#!/bin/bash

# 환경변수 파일 불러오기
# source .env_registry
ROOT_SERVER=$(hostname -I | awk '{print $1}')

# 동적으로 환경 변수 설정
export REACT_APP_ROOT_DEPLOY_URL=http://${ROOT_SERVER}:21803
export API_BASE_URL=http://${ROOT_SERVER}:21803
export MONGO_URI=mongodb://${ROOT_SERVER}:21801

echo "▶ 필요한 이미지 다운로드 중..."
docker pull 8x15yz/gi-web:latest
docker pull 8x15yz/gi-frontend:latest
docker pull mongo:4.4
docker pull nginx:latest

# compose에서 참조하는 이름으로 태그 재설정
docker tag 8x15yz/gi-web:latest gi-web:latest
docker tag 8x15yz/gi-frontend:latest gi-frontend:latest

# docker-compose 실행
docker-compose -p gi-registry up -d --build

echo ""
echo "✅ GI Registry가 다음 주소에서 실행됩니다:"
echo "   - 프론트엔드: http://$ROOT_SERVER:21804"
echo "   - 백엔드(API Gateway): $API_BASE_URL/swagger-ui/index.html"
echo "   - MongoDB 내부 접근 (Docker 네트워크 기준): $MONGO_URI"