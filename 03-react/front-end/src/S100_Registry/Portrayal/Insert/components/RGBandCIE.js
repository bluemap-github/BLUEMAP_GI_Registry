import React, { useState, useEffect  } from 'react';

function RGBandCIE({ onValuesChange }) {
    // State to handle transparency, RGB, and CIE values
    const [transparency, setTransparency] = useState("");
    const [rgbValues, setRgbValues] = useState({ red: "", green: "", blue: "" });
    const [cieValues, setCieValues] = useState({ x: "", y: "", L: "" });

    useEffect(() => {
        onValuesChange(transparency, { sRGB: rgbValues, cie: cieValues });
    }, []); // []: 컴포넌트가 처음 렌더링될 때만 실행됨

    // Handle change for transparency input
    const handleTransparencyChange = (e) => {
        const value = e.target.value;
        setTransparency(value);
        // 각각 transparency와 colourValue를 따로 전달
        onValuesChange(value, { sRGB: rgbValues, cie: cieValues });
    };

    // Handle change for RGB inputs
    const handleRgbChange = (e) => {
        const { name, value } = e.target;
        const updatedRgbValues = { ...rgbValues, [name]: value };
        setRgbValues(updatedRgbValues);
        // 각각 transparency와 colourValue를 따로 전달
        onValuesChange(transparency, { sRGB: updatedRgbValues, cie: cieValues });
    };

    // Handle change for CIE inputs
    const handleCieChange = (e) => {
        const { name, value } = e.target;
        const updatedCieValues = { ...cieValues, [name]: value };
        setCieValues(updatedCieValues);
        // 각각 transparency와 colourValue를 따로 전달
        onValuesChange(transparency, { sRGB: rgbValues, cie: updatedCieValues });
    };

    return (
        <div style={{ backgroundColor: 'white', padding: '10px', paddingTop: '5px'}} className='mb-4'>
            <h5 style={{marginTop: '8px'}}>Colour Value</h5>
            <div className="d-flex justify-content-between">
                <div className="input-group input-group-sm mb-2" style={{ flex: 2, marginRight: '10px' }}>
                    <span className="input-group-text" style={{ width: '60%', fontWeight: 'bold' }}>
                        Transparency
                    </span>
                    <input
                        type="number"
                        className="form-control"
                        value={transparency}
                        onChange={handleTransparencyChange}
                    />
                </div>  
                <div className="input-group input-group-sm mb-2" style={{ flex: 4, marginRight: '10px' }}>
                    <span className="input-group-text" style={{ width: '25%', fontWeight: 'bold' }}>
                        RGB Values
                    </span>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="R"
                        name="red"
                        value={rgbValues.red}
                        onChange={handleRgbChange}
                    />
                    <input
                        type="number"
                        className="form-control"
                        placeholder="G"
                        name="green"
                        value={rgbValues.green}
                        onChange={handleRgbChange}
                    />
                    <input
                        type="number"
                        className="form-control"
                        placeholder="B"
                        name="blue"
                        value={rgbValues.blue}
                        onChange={handleRgbChange}
                    />
                </div>
                <div className="input-group input-group-sm mb-2" style={{ flex: 4 }}>
                    <span className="input-group-text" style={{ width: '25%', fontWeight: 'bold' }}>
                        CIE Values
                    </span>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="X"
                        name="x"
                        value={cieValues.x}
                        onChange={handleCieChange}
                    />
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Y"
                        name="y"
                        value={cieValues.y}
                        onChange={handleCieChange}
                    />
                    <input
                        type="number"
                        className="form-control"
                        placeholder="L"
                        name="L"
                        value={cieValues.L}
                        onChange={handleCieChange}
                    />
                </div>
            </div>
        </div>
    );
}

export default RGBandCIE;
