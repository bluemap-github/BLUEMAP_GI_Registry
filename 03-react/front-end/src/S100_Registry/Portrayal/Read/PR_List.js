import React, {useEffect, useContext, useState}  from 'react';
import axios from 'axios';
import {GET_SYMBOL_SCHEMA} from '../api/api';
import Cookies from 'js-cookie';


const PR_List = () => {
  const [symbolSchema, setSymbolSchema] = useState([]);
  const regi_uri = Cookies.get('REGISTRY_URI'); 
  useEffect(() => {
      axios.get(GET_SYMBOL_SCHEMA, {params: { regi_uri: regi_uri }})
      .then((res) => {
          console.log(res);
          setSymbolSchema(res.data);
      })
      .catch((err) => {
          console.log(err);
      });
  }, []);

  return (
    <div>
      <p>Symbol Schema List</p>
      <ul>
        {symbolSchema.map((schema) => (
          <li key={schema._id}>{schema.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PR_List;