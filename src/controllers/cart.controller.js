import { CartModel } from "../models/cart.model.js";
import { ProductModel } from "../models/product.model.js";
import { validationResult } from "express-validator";
import { formatTimeStamp } from "../utils/format.js";
import { findLastCartId } from "../utils/utils.js";

export const getProductsInCart = async (req, res) => {
  try {
    if (isNaN(req.params.id)) {
      return res.status(400).json({
        error: "Error de ID. Debe enviar un ID valido.",
      });
    }
    const id = parseInt(req.params.id);

    const cart = await CartModel.findOne({ id: id });

    if (!cart) {
      return res.status(404).json({
        mensaje: "Error. El carrito no existe o no fue encontrado.",
      });
    } else {
      return res.status(200).json({
        data: cart,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
};

export const createCart = async (req, res) => {
  try {
    let lastId = await findLastCartId();
    let newId = lastId + 1;
    let id = newId;
    let timestamp = formatTimeStamp();
    let products = [];

    await CartModel.create({
      id,
      timestamp,
      products,
    });

    return res.status(201).json({
      mensaje: `Se ha creado un carrito con ${newId} exitosamente.`,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
};

export const addProductsToCart = async (req, res) => {
  try {
    if (isNaN(req.params.id)) {
      return res.status(400).json({
        error: "Error. El ID de carrito no es válido.",
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    const cartId = parseInt(req.params.id);
    const productId = parseInt(req.body.id);

    let cart = await CartModel.findOne({ id: cartId });

    if (!cart) {
      return res.status(404).json({
        mensaje: "Error. El carrito no existe o no fue encontrado.",
      });
    }

    let product = await ProductModel.findOne({ id: productId });

    let products = cart.products;
    products.push(product);

    if (!product) {
      return res.status(404).json({
        mensaje: "Error. El producto no existe o no fue encontrado.",
      });
    } else {
      const productAddedToCart = await CartModel.findByIdAndUpdate(
        cart._id,
        { products },
        { new: true }
      );

      return res.status(201).json({
        mensaje: "El producto fue agregado al carrito exitosamente.",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
};

export const deleteCartById = async (req, res) => {
  try {
    if (isNaN(req.params.id)) {
      return res.status(400).json({
        error: "Error. Debe enviar un ID valido.",
      });
    }
    const id = parseInt(req.params.id);
    let cart = await CartModel.findOne({ id: id });

    if (!cart) {
      return res.status(404).json({
        mensaje: "Error. El carrito no fue encontrado.",
      });
    } else {
      await CartModel.findByIdAndDelete(cart._id);
      return res.status(200).json({
        mensaje: "El carrito fue eliminado exitosamente.",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
};

export const deleteProductInCartById = async (req, res) => {
  try {
    if (isNaN(req.params.id) || isNaN(req.params.id_prod)) {
      return res.status(400).json({
        error: "Error. Debe enviar correctamente los parametros",
      });
    }
    const cartId = parseInt(req.params.id);
    const productId = parseInt(req.params.id_prod);

    let cart = await CartModel.findOne({ id: cartId });

    if (!cart) {
      return res.status(404).json({
        mensaje: "Error. El carrito no existe o no fue encontrado.",
      });
    }

    let productExists = cart.products.find((item) => item.id == productId);

    if (!productExists) {
      return res.status(404).json({
        mensaje: "Error. El producto no existe o no fue encontrado.",
      });
    } else {
      let products = cart.products;
      const filteredProducts = products.filter((item) => item.id !== productId);
      products = filteredProducts;

      const productAddedToCart = await CartModel.findByIdAndUpdate(cart._id, {
        products,
      });

      return res.status(201).json({
        mensaje: "El producto fue eliminado del carrito exisotamente",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
};