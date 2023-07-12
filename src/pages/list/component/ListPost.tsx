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

const ListPost = ({ setItems }) => {
  const classes = useStyles();
  const [newItem, setNewItem] = useState({
    nome: '',
    quantidade: 0,
    localCompra: '',
  });

  const handleAddItem = async () => {
    try {
      // Salvar o novo item no Firestore
      const colecao = new Colecao();
      const itemSalvo = await colecao.salvar('items', newItem);
      setItems((prevItems) => [...prevItems, itemSalvo]);
      setNewItem({
        nome: '',
        quantidade: 0,
        localCompra: '',
      });
    } catch (error) {
      console.error('Erro ao adicionar o item:', error);
    }
  };

  return (
    <div className="justify-center container mx-auto p-4">
      <Paper className={classes.form}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Nome do Item"
              value={newItem.nome}
              onChange={(e) => setNewItem({ ...newItem, nome: e.target.value })}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Quantidade"
              type="number"
              value={newItem.quantidade}
              onChange={(e) => setNewItem({ ...newItem, quantidade: parseInt(e.target.value, 10) || 0 })}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Local de Compra"
              value={newItem.localCompra}
              onChange={(e) => setNewItem({ ...newItem, localCompra: e.target.value })}
              fullWidth
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Button onClick={handleAddItem} variant="contained" color="primary" size="large" fullWidth>
          Adicionar Item
        </Button>
      </Paper>
    </div>
  );
};

export default ListPost;
