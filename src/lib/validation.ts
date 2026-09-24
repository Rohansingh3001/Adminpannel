export interface ValidationErrors {
  [key: string]: string;
}

export const validateProductForm = (data: {
  title: string;
  price: number | string;
  stock: number | string;
  category: string;
}): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.title.trim()) {
    errors.title = 'Title is required';
  }

  const priceNum = Number(data.price);
  if (data.price === '' || isNaN(priceNum)) {
    errors.price = 'Price is required and must be numeric';
  } else if (priceNum <= 0) {
    errors.price = 'Price must be positive';
  }

  const stockNum = Number(data.stock);
  if (data.stock === '' || isNaN(stockNum)) {
    errors.stock = 'Stock is required and must be numeric';
  } else if (stockNum < 0) {
    errors.stock = 'Stock must not be negative';
  }

  if (!data.category.trim()) {
    errors.category = 'Category is required';
  }

  return errors;
};
