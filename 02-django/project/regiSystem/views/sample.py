from bson.objectid import ObjectId
from rest_framework.response import Response
from ..models import (
        collections, 
        collections0417,
        post_classroom,
        getClassroom
    )
from rest_framework.decorators import api_view
from ..sampleSerializers import StudentSerializer, ClassroomSerializer
from rest_framework.status import (
        HTTP_200_OK, 
        HTTP_201_CREATED, 
        HTTP_204_NO_CONTENT, 
        HTTP_400_BAD_REQUEST, 
        HTTP_404_NOT_FOUND,
        HTTP_405_METHOD_NOT_ALLOWED
    )


@api_view(['POST'])
# validated_data는 is_valid() 를 거치고 난 후에 사용할 수 있음 (이전에 사용하면 에러남)
        # validated_data는 딕셔너리 형태로 돼 있음
        # DB에 저장할 때 별도의 BSON 변환 절차가 없어도 됨 => "insert_one" 메서드가 자동으로 BSON으로 변환해주기 때문
def create_student_info(request):
    serializer = StudentSerializer(data=request.data)
    if serializer.is_valid():
        # validated_data를 사용하여 classroom_id를 ObjectId로 변환
        validated_data = serializer.validated_data
        validated_data['classroom_id'] = ObjectId(validated_data['classroom_id'])
        
        collections.insert_one(validated_data) 
        return Response(serializer.data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def get_student_list(request):
    if request.method == 'GET':
        cursor = collections0417.find()
        serializer = StudentSerializer(cursor, many=True)
        return Response(serializer.data)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_student_info(request, student_id):  
    if request.method == 'GET':
        try:
            student = collections0417.find_one({'_id': ObjectId(student_id)})
            if student:
                serializer = StudentSerializer(student)
                return Response(serializer.data)
            else:
                return Response({'error': 'Student not found'}, status=HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)
    return Response(status=HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['POST'])
def create_classroom(request):
    serializer = ClassroomSerializer(data=request.data)
    if serializer.is_valid():
        post_classroom.insert_one(serializer.validated_data) 
        return Response(serializer.data, status=HTTP_201_CREATED) # 이 부분을 "직접 응답 데이터"라고 말함
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def get_classroom(request):
    if request.method == 'GET':
        # 모든 Classroom 조회
        classrooms_cursor = getClassroom.find()
        classrooms = list(classrooms_cursor)

        # 각 Classroom에 속한 학생데이터도 응답 JSON에 포함시키기
        for classroom in classrooms:
            students_cursor = collections.find({"classroom_id": ObjectId(classroom['_id'])})
            students = list(students_cursor)
            classroom['students'] = students

        serializer = ClassroomSerializer(classrooms, many=True)
        return Response(serializer.data)
