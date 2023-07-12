import React, { useEffect, useState } from 'react';
import { Typography, List, ListItem, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { collection, getFirestore, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { app } from '../../../logic/firebase/config/app';
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

const db = getFirestore(app);
const itemsCollectionRef = collection(db, 'items');

interface Item {
  id: string;
  nome: string;
  quantidade: number;
  localCompra: string;
}

interface ItemListProps {
  items: Item[];
}

const ItemList: React.FC<ItemListProps> = ({ items }) => {
  const classes = useStyles();
  const [updatedItems, setUpdatedItems] = useState<Item[]>(items);
  const colecao = new Colecao();

  useEffect(() => {
    const unsubscribe = onSnapshot(itemsCollectionRef, (querySnapshot) => {
      const fetchedItems: Item[] = [];
      querySnapshot.forEach((doc) => {
        fetchedItems.push({
          id: doc.id,
          nome: doc.data().nome,
          quantidade: doc.data().quantidade,
          localCompra: doc.data().localCompra,
        });
      });
      setUpdatedItems(fetchedItems);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  
  const editNome = async (itemId: string, newNome: string) => {
    try {
      await updateDoc(doc(itemsCollectionRef, itemId), { nome: newNome });
    } catch (error) {
      console.error('Erro ao editar o nome do item:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await deleteDoc(doc(itemsCollectionRef, itemId));
    } catch (error) {
      console.error('Erro ao remover o produto:', error);
    }
  };

  const editQuantity = async (itemId: string, newQuantity: number) => {
    try {
      await updateDoc(doc(itemsCollectionRef, itemId), { quantidade: newQuantity });
    } catch (error) {
      console.error('Erro ao editar a quantidade do item:', error);
    }
  };

  const editLocalCompra = async (itemId: string, newLocalCompra: string) => {
    try {
      await updateDoc(doc(itemsCollectionRef, itemId), { localCompra: newLocalCompra });
    } catch (error) {
      console.error('Erro ao editar o local de compra do item:', error);
    }
  };

  const salvarItems = async (itemId: string) => {
    try {
      const itemToSave = updatedItems.find((item) => item.id === itemId);
      if (itemToSave) {
        await colecao.salvar('inventory', itemToSave, itemId);
      }
    } catch (error) {
      console.error('Erro ao salvar o produto:', error);
    }
  };

  return (
    <div className="justify-center text-black bg-gray-100 container mx-auto p-4 rounded-md p-4 mb-4">
      <div className={classes.root}>
        <Typography variant="h5" align="center" gutterBottom>
          Lista de Compras
        </Typography>
        <List>
          <div className="bg-gray-200 mx-auto p-4 rounded-md">
            {updatedItems.map((item) => (
              <ListItem key={item.id} className={classes.item}>
                <Typography variant="body1" color="textPrimary">
                 
                </Typography>
                
                <TextField
  label="Nome"
  value={item.nome}
  onChange={(e) => editNome(item.id, e.target.value)}
  variant="outlined"
  size="small"
  style={{ width: '200px' }}
/>

                <TextField
                  type="number"
                  label="Quantidade"
                  value={item.quantidade}
                  onChange={(e) => editQuantity(item.id, parseInt(e.target.value, 10) || 0)}
                  variant="outlined"
                  size="small"
                  style={{ width: '100px' }}
                />
                <TextField
                  label="Local"
                  value={item.localCompra}
                  onChange={(e) => editLocalCompra(item.id, e.target.value)}
                  variant="outlined"
                  size="small"
                  style={{ width: '200px' }}
                />
                <Button onClick={() => removeItem(item.id)} variant="contained" color="secondary" size="small">
                  Remover
                </Button>
                <Button onClick={() => salvarItems(item.id)} variant="contained" color="primary">
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

export default ItemList;
