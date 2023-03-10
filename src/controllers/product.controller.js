import { ProductModel } from "../models/product.model.js";
import { validationResult } from "express-validator";
import { formatTimeStamp } from "../utils/format.js";
import { findLastProductId } from "../utils/utils.js";
import passport from "passport";

const passportOptions = {
  badRequestMessage: "Error. Username o Password incorrectos",
};

export const getAllProducts = async (req, res) => {
  try {
    let products = await ProductModel.find();
    res.status(200).json({
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    if (isNaN(req.params.id)) {
      return res.status(400).json({
        error: "Error. Debe enviar un ID valido.",
      });
    }
    const id = parseInt(req.params.id);
    let product = await ProductModel.findOne({ id: id });
    if (!product) {
      return res.status(404).json({
        mensaje: "Error. El producto no existe o no fue encontrado.",
      });
    } else {
      return res.status(200).json({
        data: product,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, code, photo, value, stock } = req.body;

    let lastId = await findLastProductId();
    let newId = lastId + 1;
    let id = newId;
    let timestamp = formatTimeStamp();

    const newProduct = await ProductModel.create({
      id,
      timestamp,
      title,
      description,
      code,
      photo,
      value,
      stock,
    });
    return res.status(201).json({
      data: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
};

export const updateProductById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    if (isNaN(req.params.id)) {
      return res.status(400).json({
        error: "Error. Debe enviar un ID valido.",
      });
    }

    const id = parseInt(req.params.id);
    const { title, description, code, photo, value, stock } = req.body;

    let product = await ProductModel.findOne({ id: id });

    if (!product) {
      return res.status(404).json({
        mensaje: "Error. El producto no existe o no fue encontrado.",
      });
    } else {
      const productUpdated = await ProductModel.findByIdAndUpdate(
        product._id,
        { title, description, code, photo, value, stock },
        { new: true }
      );
      return res.status(200).json({
        mensaje: "El producto fue actualizado exitosamente",
        data: productUpdated,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
};

export const deleteProductById = async (req, res, next) => {
  try {
    if (isNaN(req.params.id)) {
      return res.status(400).json({
        error: "Error. Debe enviar un ID valido.",
      });
    }
    const id = parseInt(req.params.id);

    let product = await ProductModel.findOne({ id: id });

    if (!product) {
      return res.status(404).json({
        mensaje: "Error. El producto no existe o no fue encontrado.",
      });
    } else {
      await ProductModel.findByIdAndDelete(product._id);
      return res.status(200).json({
        mensaje: "El producto fue eliminado exitosamente.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
};