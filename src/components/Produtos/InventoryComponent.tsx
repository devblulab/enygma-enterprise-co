import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Mail, Twitter } from 'lucide-react';
import Link from 'next/link';

// Definindo a interface para o tipo de produto
interface Product {
  id: number;
  name: string;
  quantity: number;
}

const InventoryComponent: React.FC = () => {
  // Estado para armazenar os produtos
  const [products, setProducts] = useState<Product[]>([]);

  // Estado para armazenar o novo produto a ser adicionado
  const [newProduct, setNewProduct] = useState<Product>({
    id: 0,
    name: '',
    quantity: 0,
  });

  // Estado para armazenar mensagens de erro
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    id: '',
    name: '',
    quantity: '',
  });

  // Função para adicionar um novo produto
  const addProduct = () => {
    if (validateForm()) {
      setProducts([...products, newProduct]);
      setNewProduct({ id: 0, name: '', quantity: 0 });
      clearErrors();
    }
  };

  // Função para remover um produto
  const removeProduct = (productId: number) => {
    const updatedProducts = products.filter(
      (product) => product.id !== productId
    );
    setProducts(updatedProducts);
  };

  // Função para editar a quantidade de um produto
  const editQuantity = (productId: number, newQuantity: number) => {
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        return { ...product, quantity: newQuantity };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  // Função para validar o formulário
  const validateForm = () => {
    let valid = true;
    const newErrors: { [key: string]: string } = {};

    if (newProduct.id <= 0) {
      newErrors.id = 'ID inválido. Insira um número positivo.';
      valid = false;
    }

    if (newProduct.name.trim() === '') {
      newErrors.name = 'Nome do produto é obrigatório.';
      valid = false;
    }

    if (newProduct.quantity <= 0) {
      newErrors.quantity = 'Quantidade inválida. Insira um número positivo.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Função para limpar as mensagens de erro
  const clearErrors = () => {
    setErrors({ id: '', name: '', quantity: '' });
  };

  // Função para validar apenas números
  const validateNumberInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const sanitizedValue = inputValue.replace(/[^0-9]/g, '');
    event.target.value = sanitizedValue;
  };

  // Função para validar apenas letras
  const validateLetterInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const sanitizedValue = inputValue.replace(/[^A-Za-z ]/g, '');
    event.target.value = sanitizedValue;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Controle de Estoque</h1>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-2">Adicionar Produto</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col">
            <label className="text-lg">ID do Produto:</label>
            <input
              className={`border ${
                errors.id ? 'border-red-500' : 'border-gray-300'
              } rounded-md p-2 text-black`}
              type="text"
              value={newProduct.id}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  id: parseInt(e.target.value) || 0,
                })
              }
              onInput={validateNumberInput}
            />
            {errors.id && <p className="text-red-500">{errors.id}</p>}
          </div>
          <div className="flex flex-col">
            <label className="text-lg">Nome do Produto:</label>
            <input
              className={`border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } rounded-md p-2 text-black`}
              type="text"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              onInput={validateLetterInput}
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>
          <div className="flex flex-col">
            <label className="text-lg">Quantidade:</label>
            <input
              className={`border ${
                errors.quantity ? 'border-red-500' : 'border-gray-300'
              } rounded-md p-2 text-black`}
              type="text"
              value={newProduct.quantity}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  quantity: parseInt(e.target.value) || 0,
                })
              }
              onInput={validateNumberInput}
            />
            {errors.quantity && (
              <p className="text-red-500">{errors.quantity}</p>
            )}
          </div>
        </div>
        <motion.button
          onClick={addProduct}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-500 text-white rounded-md p-2 mt-4 md:mt-0 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Adicionar
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8"
      >
        <h2 className="text-black-2xl font-bold mb-
2">Controle de Estoque</h2>
{products.length === 0 ? (
<p className="text-lg">Nenhum produto disponível.</p>
) : (
<ul className="list-disc pl-4">
{products.map((product) => (
<li key={product.id} className="text-lg flex items-center gap-4">
<span>{product.name} - Quantidade: {product.quantity}</span>
<div className="flex gap-2">
<motion.button
onClick={() => removeProduct(product.id)}
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
className="bg-red-500 text-black rounded-md p-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
>
Remover
</motion.button>
<input
type="text-black"
value={product.quantity}
onChange={(e) =>
editQuantity(product.id, parseInt(e.target.value) || 0)
}
className="border border-gray-300 rounded-md p-2 w-20 text-black"
onInput={validateNumberInput}
/>
<motion.button
onClick={() => editQuantity(product.id, 0)}
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
className="bg-green-500 text-black rounded-md p-2 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
>
Editar
</motion.button>
</div>
</li>
))}
</ul>
)}
</motion.div>
</div>
);
};

export default InventoryComponent;