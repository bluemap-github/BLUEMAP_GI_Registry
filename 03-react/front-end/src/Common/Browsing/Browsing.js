import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BROWSING_REGISTRIES } from '../../S100_Registry/Concept/api';
import { useNavigate } from 'react-router-dom';
import {ENTER_REGI } from '../../Common/PageLinks';

const Browsing = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchData = async () => {
        try {
            const response = await axios.get(BROWSING_REGISTRIES, {
                params: {
                    search_term: searchTerm,
                    page: page,
                    page_size: pageSize,
                }
            });
            setResults(response.data.results);
            setTotalItems(response.data.total_items);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [page, pageSize]);

    const connectToRegistry = (e, registry) => {
        sessionStorage.setItem('REGISTRY_NAME', registry.name);
        navigate(ENTER_REGI(registry.uniformResourceIdentifier));
    };

    const handleSearch = () => {
        setPage(1); // 검색 시 페이지를 1로 초기화
        fetchData();
    };

    const handlePageSizeChange = (e) => {
        setPageSize(parseInt(e.target.value));
        setPage(1); // 페이지 크기 변경 시 페이지를 1로 초기화
    };

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '50px' }}>
                <div style={{ display: 'flex', width: '100%', maxWidth: '600px', borderRadius: '15px', border: '1px solid #dfe1e5', padding: '10px 20px', backgroundColor: '#fff' }}>
                    <input
                        type="text"
                        placeholder="레지스트리 이름 검색 ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', border: 'none', outline: 'none', fontSize: '16px' }}
                    />
                    <button className='btn btn-outline-secondary' onClick={handleSearch}>Search</button>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                    <select value={pageSize} onChange={handlePageSizeChange}>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>

            <div className='p-5'>
                <div>{totalItems} results found</div>
                <div>
                    {results.map((registry) => (
                        <div key={registry._id} onClick={(e) => connectToRegistry(e, registry)}>
                            <div className='card regi-card mb-4'>
                                <div className="card-body">
                                    <h4>{registry.name}</h4>
                                    <div>개설일 : {registry.dateOfLastChange}</div>
                                    <div>상세 : {registry.contentSummary}</div>
                                    <div style={{color : 'gray'}}>http://bluemap.kr:21804/{registry.uniformResourceIdentifier}</div>
                                </div>
                            </div>
                        </div>    
                    ))}
                </div>
                
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    <button 
                        className='btn btn-outline-secondary' 
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </button>
                    <span>Page {page} of {totalPages}</span>
                    <button 
                        className='btn btn-outline-secondary' 
                        disabled={page >= totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
};

export default Browsing;
