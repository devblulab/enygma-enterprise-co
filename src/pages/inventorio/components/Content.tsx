import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Grid, List, ListItem } from '@material-ui/core';
import Colecao from '../../../logic/firebase/db/Colecao';
import Header from './Header';
import ValorTotal from './ValorTotal';

interface Product {
  id: string;
  name: string;
  quantity: number;
  value: number;
}

const Content: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    id: '',
    name: '',
    quantity: 0,
    value: 0,
  });

  useEffect(() => {
    // Ao carregar o componente, consultar os produtos do Firestore
    consultarProdutos();
  }, []);

  const colecao = new Colecao();

  const consultarProdutos = async () => {
    try {
      const produtos = await colecao.consultar('inventory');
      setProducts(produtos);
    } catch (error) {
      console.error('Erro ao consultar os produtos:', error);
    }
  };

  const adicionarProduto = async () => {
    try {
      // Salvar o novo produto no Firestore
      const produtoSalvo = await colecao.salvar('inventory', newProduct);
      setProducts([...products, produtoSalvo]);
      setNewProduct({ id: '', name: '', quantity: 0, value: 0 });
    } catch (error) {
      console.error('Erro ao adicionar o produto:', error);
    }
  };

  const removerProduto = async (productId: string) => {
    try {
      // Remover o produto do Firestore
      await colecao.excluir('inventory', productId);
      const updatedProducts = products.filter((product) => product.id !== productId);
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Erro ao remover o produto:', error);
    }
  };

  const editarQuantidade = async (productId: string, newQuantity: number) => {
    try {
      // Atualizar a quantidade do produto no Firestore
      await colecao.salvar('inventory', { id: productId, quantity: newQuantity }, productId);
      const updatedProducts = products.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: newQuantity };
        }
        return product;
      });
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Erro ao editar a quantidade do produto:', error);
    }
  };

  const editarValor = async (productId: string, newValue: number) => {
    try {
      // Atualizar o valor do produto no Firestore
      await colecao.salvar('inventory', { id: productId, value: newValue }, productId);
      const updatedProducts = products.map((product) => {
        if (product.id === productId) {
          return { ...product, value: newValue };
        }
        return product;
      });
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Erro ao editar o valor do produto:', error);
    }
  };

  const salvarProduto = async (productId: string) => {
    try {
      const productToSave = products.find((product) => product.id === productId);
      if (productToSave) {
        await colecao.salvar('inventory', productToSave, productId);
        // Atualizar o estado dos produtos após salvar no Firestore
        const updatedProducts = products.map((product) => {
          if (product.id === productId) {
            return productToSave;
          }
          return product;
        });
        setProducts(updatedProducts);
      }
    } catch (error) {
      console.error('Erro ao salvar o produto:', error);
    }
  };

  const calcularValorTotalEstoque = () => {
    let totalValue = 0;
    products.forEach((product) => {
      totalValue += product.quantity * product.value;
    });
    return totalValue.toFixed(2);
  };

  return (
    <div className="justify-center container mx-auto p-4">
      <Header
        newProduct={newProduct}
        onProductChange={setNewProduct}
        onAddProduct={adicionarProduto}
      />
      <List>
        {products.map((product) => (
          <ListItem
            key={product.id}
            className=" flex items-center justify-between bg-gray-400 rounded-md p-4 mb-4"
          >
            <Grid container alignItems="center">
              <Grid item xs={3}>
                <Typography variant="body1" color="textPrimary" component="span">
                  ID: {product.id}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body1" color="textPrimary" component="span">
                  Nome: {product.name}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  type="number"
                  label="Quantidade"
                  value={product.quantity}
                  onChange={(e) => editarQuantidade(product.id, parseInt(e.target.value) || 0)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  type="number"
                  label="Valor"
                  value={product.value}
                  onChange={(e) => editarValor(product.id, parseFloat(e.target.value) || 0)}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <div className="flex gap-4">
              <Button
                onClick={() => removerProduto(product.id)}
                variant="contained"
                color="secondary"
              >
                Remover
              </Button>
              <Button onClick={() => salvarProduto(product.id)} variant="contained" color="primary">
                Salvar
              </Button>
            </div>
          </ListItem>
        ))}
      </List>
      <ValorTotal valorTotal={calcularValorTotalEstoque()} />
    </div>
  );
};

export default Content;
