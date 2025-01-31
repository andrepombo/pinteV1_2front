import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios';
import { useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function AutoCompleteMultiple(props) {
  const { id } = useParams();
  
  // Inicializando `data` como um array vazio
  const [data, setData] = useState([]);
  const [value, setValue] = useState([]); // Inicializa como um array vazio


  useEffect(() => {
    axiosInstance.get(`heatfilter/${id}`)
      .then(res => {             
        setData(res.data['macros'] || []); // Garante que seja um array
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }, [id]); // Adiciona `id` como dependência para evitar loops infinitos

  return (
    <Autocomplete
      multiple
      id="tags-outlined"
      options={data} // Agora sempre será um array
      getOptionLabel={(option) => option.label || option} // Garante que haja um label válido
      value={value} // Garante que o valor selecionado seja compatível
      onChange={(event, newValue) => {
        setValue(newValue);
        props.changeWord(newValue);
      }}
      style={{ marginLeft: 20, marginBottom: 10, backgroundColor: 'white' }}
      sx={{ width: 400 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Selecione o Macro"
          placeholder="Escolha o Macro"
        />
      )}
    />
  );
}
