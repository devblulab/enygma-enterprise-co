import React, { useState } from 'react';
import Cabecalho from '../../components/template/Cabecalho';
import SetAviso from './components/SetAviso';
import AvisoList from './components/AvisoList';

interface AvisoItem {
  id: string;
  titulo: string;
  texto: string;
}

const PostPage: React.FC = () => {
  const [avisos, setAvisos] = useState<AvisoItem[]>([]);

  const addAviso = (titulo: string, texto: string) => {
    const newAviso: AvisoItem = {
      id: Math.random().toString(),
      titulo,
      texto,
    };
    setAvisos((prevAvisos) => [...prevAvisos, newAviso]);
  };

  return (
    <>
      <Cabecalho />
      <SetAviso setAvisos={setAvisos} />
      <AvisoList avisos={avisos} />
    </>
  );
};

export default PostPage;
