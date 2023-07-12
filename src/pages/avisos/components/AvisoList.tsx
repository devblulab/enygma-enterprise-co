import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { collection, getFirestore, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from '../../../logic/firebase/config/app';
import Colecao from '../../../logic/firebase/db/Colecao';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#CCCCCC',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  item: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

const db = getFirestore(firebaseConfig);
const avisosCollectionRef = collection(db, 'avisos');

interface Aviso {
  id: string;
  titulo: string;
  texto: string;
}

interface AvisoListProps {
  avisos: Aviso[];
}

const AvisoList: React.FC<AvisoListProps> = ({ avisos }) => {
  const classes = useStyles();
  const [updatedAvisos, setUpdatedAvisos] = useState<Aviso[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(avisosCollectionRef, (querySnapshot) => {
      const fetchedAvisos: Aviso[] = [];
      querySnapshot.forEach((doc) => {
        fetchedAvisos.push({
          id: doc.id,
          titulo: doc.data().titulo,
          texto: doc.data().texto,
        });
      });
      setUpdatedAvisos(fetchedAvisos);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setUpdatedAvisos(avisos);
  }, [avisos]);

  const colecao = new Colecao();

  const editTitulo = async (avisoId: string, newTitulo: string) => {
    try {
      await updateDoc(doc(avisosCollectionRef, avisoId), { titulo: newTitulo });
    } catch (error) {
      console.error('Erro ao editar o título do aviso:', error);
    }
  };

  const removeAviso = async (avisoId: string) => {
    try {
      await deleteDoc(doc(avisosCollectionRef, avisoId));
    } catch (error) {
      console.error('Erro ao remover o aviso:', error);
    }
  };

  const editTexto = async (avisoId: string, newTexto: string) => {
    try {
      await updateDoc(doc(avisosCollectionRef, avisoId), { texto: newTexto });
    } catch (error) {
      console.error('Erro ao editar o texto do aviso:', error);
    }
  };

  const salvarAvisos = async (avisoId: string) => {
    try {
      const avisoToSave = updatedAvisos.find((aviso) => aviso.id === avisoId);
      if (avisoToSave) {
        await colecao.salvar('avisos', avisoToSave, avisoId);
      }
    } catch (error) {
      console.error('Erro ao salvar o aviso:', error);
    }
  };

  return (
    <div className="justify-center text-black bg-gray-100 container mx-auto p-4 rounded-md p-4 mb-4">
      <div className={classes.root}>
        <Typography variant="h5" align="center" gutterBottom>
          Lista de Avisos
        </Typography>
        <List>
          <div className="bg-gray-200 mx-auto p-4 rounded-md">
            {updatedAvisos.map((aviso) => (
              <ListItem key={aviso.id} className={classes.item}>
                <Typography variant="body1" color="textPrimary">
                  {aviso.titulo}
                </Typography>
                <TextField
                  label="Título"
                  value={aviso.titulo}
                  onChange={(e) => editTitulo(aviso.id, e.target.value)}
                  variant="outlined"
                  size="small"
                  style={{ width: '200px' }}
                />
                <TextField
                  label="Texto"
                  value={aviso.texto}
                  onChange={(e) => editTexto(aviso.id, e.target.value)}
                  variant="outlined"
                  size="small"
                  style={{ width: '200px' }}
                />
                <Button onClick={() => removeAviso(aviso.id)} variant="contained" color="secondary" size="small">
                  Remover
                </Button>
                <Button onClick={() => salvarAvisos(aviso.id)} variant="contained" color="primary">
                  Salvar
                </Button>
              </ListItem>
            ))}
          </div>
        </List>
      </div>
    </div>
  );
};

export default AvisoList;
