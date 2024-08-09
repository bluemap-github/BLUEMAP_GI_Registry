import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemContext } from '../../context/ItemContext';
import { DDR_DETAIL } from '../../Common/PageLinks';
const DDRList = ({ viewType, items }) => { // props로 items 수신
  const USER_SERIAL = sessionStorage.getItem('USER_SERIAL');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' }); // Initial sort config
  const { setItemDetails } = useContext(ItemContext);
  const navigate = useNavigate();

  const handleDetailClick = (item) => {
    setItemDetails({
      view_item_type: viewType,
      user_serial: USER_SERIAL,
      item_id: item._id.encrypted_data,
      item_iv: item._id.iv,
    });
    navigate(DDR_DETAIL);
  };

  const renderTableCell = (item, field, style) => (
    <td
      onClick={() => handleDetailClick(item)}
      className="th-inner sortable both"
      style={style}
    >
      <div className="single-line-ellipsis">{item[field]}</div>
    </td>
  );

  const sortItems = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending';
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = React.useMemo(() => {
    const sortableItems = [...items];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  return (
    <div>
      <table
        className="table table-hover table-bordered table-striped"
        style={{ tableLayout: 'fixed', width: '85%' }}
      >
        <thead>
          <tr>
            <th
              scope="col"
              style={{ width: '15%', cursor: 'pointer' }}
              onClick={() => sortItems('name')}
            >
              Name
              <span
                style={{
                  marginLeft: '5px',
                  fontWeight: 'bold',
                  color: sortConfig.key === 'name' && sortConfig.direction === 'ascending' ? 'blue' : 'grey',
                }}
              >
                ↑
              </span>
              <span
                style={{
                  fontWeight: 'bold',
                  color: sortConfig.key === 'name' && sortConfig.direction === 'descending' ? 'blue' : 'grey',
                }}
              >
                ↓
              </span>
            </th>
            <th
              scope="col"
              style={{ width: '15%', cursor: 'pointer' }}
              onClick={() => sortItems('camelCase')}
            >
              <div className="single-line-ellipsis">
                Camel Case
                <span
                  style={{
                    marginLeft: '5px',
                    fontWeight: 'bold',
                    color: sortConfig.key === 'camelCase' && sortConfig.direction === 'ascending' ? 'blue' : 'grey',
                  }}
                >
                  ↑
                </span>
                <span
                  style={{
                    fontWeight: 'bold',
                    color: sortConfig.key === 'camelCase' && sortConfig.direction === 'descending' ? 'blue' : 'grey',
                  }}
                >
                  ↓
                </span>
              </div>
            </th>
            <th scope="col" style={{ width: '40%' }}>Definition</th>
            <th scope="col" style={{ width: '11%' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">No items found</td>
            </tr>
          ) : (
            sortedItems.map((item) => (
              <tr key={item._id.encrypted_data} style={{ cursor: 'pointer' }}>
                {renderTableCell(item, 'name', { width: '15%' })}
                {renderTableCell(item, 'camelCase', { width: '15%' })}
                {renderTableCell(item, 'definition', { width: '40%' })}
                {renderTableCell(item, 'itemStatus', { width: '11%' })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DDRList;
