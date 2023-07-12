import React, { useState } from 'react';
import { TextField, Button, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Colecao from '../../../logic/firebase/db/Colecao';

const useStyles = makeStyles((theme) => ({
  form: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
  },
}));

const AvisoPost = ({ setAvisos }) => {
  const classes = useStyles();
  const [newAviso, setNewAviso] = useState({
    titulo: '',
    texto: '',
  });

  const handleAddAviso = async () => {
    try {
      // Salvar o novo aviso no Firestore
      const colecao = new Colecao();
      const avisoSalvo = await colecao.salvar('avisos', newAviso);
      setAvisos((prevAvisos) => [...prevAvisos, avisoSalvo]);
      setNewAviso({
        titulo: '',
        texto: '',
      });
    } catch (error) {
      console.error('Erro ao adicionar o aviso:', error);
    }
  };

  return (
    <div className="justify-center container mx-auto p-4">
      <Paper className={classes.form}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Título do Aviso"
              value={newAviso.titulo}
              onChange={(e) => setNewAviso({ ...newAviso, titulo: e.target.value })}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Texto do Aviso"
              value={newAviso.texto}
              onChange={(e) => setNewAviso({ ...newAviso, texto: e.target.value })}
              fullWidth
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Button onClick={handleAddAviso} variant="contained" color="primary" size="large" fullWidth>
          Adicionar Aviso
        </Button>
      </Paper>
    </div>
  );
};

export default AvisoPost;
