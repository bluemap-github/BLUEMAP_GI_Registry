import React from 'react';

const preProcessingData = (data) => {
    // 데이터의 깊은 복사본을 생성
    data = JSON.parse(JSON.stringify(data));

    // _id 필드를 추출하여 별도의 변수에 저장하고, 원본 객체에서는 삭제
    const extractedId = { ...data._id };
    delete data._id;  // _id 필드를 data에서 제거

    const reMakingRouteMonitor = [];
    const reMakingRoutePlan = [];

    // routeMonitor 배열을 순회하면서 _id 값만 추출하여 새로운 배열에 저장
    if (data.routeMonitor) {
        for (const monitor of data.routeMonitor) {
            if (monitor && monitor._id) {
                reMakingRouteMonitor.push(monitor._id);
            }
        }
    }

    // routePlan 배열을 순회하면서 _id 값만 추출하여 새로운 배열에 저장
    if (data.routePlan) {
        for (const plan of data.routePlan) {
            if (plan && plan._id) {
                reMakingRoutePlan.push(plan._id);
            }
        }
    }

    // 가공된 배열을 data에 다시 삽입
    data.routeMonitor = reMakingRouteMonitor;
    data.routePlan = reMakingRoutePlan;

    return { data, extractedId };  // 가공된 data와 추출된 _id 반환
}

const UpdatePRAlertItem = ({ data }) => {
    const { data: preProcessedData, extractedId } = preProcessingData(data);

    console.log("Extracted _id:", extractedId);  // 추출된 _id를 확인 (PUT 요청에서 사용 가능)

    return (
        <div>
            <h3>Processed Data:</h3>
            <pre>{JSON.stringify(preProcessedData, null, 2)}</pre>
            <h4>Extracted _id:</h4>
            <pre>{JSON.stringify(extractedId, null, 2)}</pre>
        </div>
    );
};

export default UpdatePRAlertItem;
