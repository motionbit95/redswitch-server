// 상품 카테고리, 물자, 상품, 재고를 관리합니다.

const admin = require("firebase-admin");
const database = admin.database();
const categoriesRef = database.ref("categories"); // 'categories' 경로 참조
const materialsRef = database.ref("materials"); // 'materials' 경로 참조
const productsRef = database.ref("products"); // 'products' 경로 참조
const orderingHistoryRef = database.ref("ordering_history"); // 'ordering_history' 경로 참조
const orderingProductRef = database.ref("ordering_product"); // 'ordering_product' 경로 참조
const inventoryRef = database.ref("inventory"); // 'inventory' 경로 참조

class Category {
  constructor(data) {
    this.pk = data.pk || null; // 데이터베이스에서 자동 생성됨
    this.product_category = data.product_category;
    this.product_category_code = data.product_category_code;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || null;
  }

  toJSON() {
    return {
      product_category: this.product_category,
      product_category_code: this.product_category_code,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  // Create a new category
  async create() {
    try {
      const newCategoryRef = await categoriesRef.push(this.toJSON());
      this.pk = newCategoryRef.key;
      await newCategoryRef.update({ pk: this.pk });
      return this;
    } catch (error) {
      console.error("Error creating category:", error);
      throw new Error("Failed to create category");
    }
  }

  // Get a category by PK
  static async getByPk(pk) {
    try {
      const snapshot = await categoriesRef.child(pk).once("value");
      if (!snapshot.exists()) {
        throw new Error("Category not found");
      }
      return { pk, ...snapshot.val() };
    } catch (error) {
      console.error("Error fetching category:", error);
      throw new Error("Failed to fetch category");
    }
  }

  // Get all categories
  static async getAll() {
    try {
      const snapshot = await categoriesRef.once("value");
      if (!snapshot.exists()) {
        return [];
      }
      const categories = [];
      snapshot.forEach((child) => {
        categories.push({ pk: child.key, ...child.val() });
      });
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Failed to fetch categories");
    }
  }

  // Update a category by PK
  async update() {
    try {
      if (!this.pk) {
        throw new Error("Category PK is required for update");
      }

      // 현재 시간 갱신
      this.updated_at = new Date().toISOString();

      // 객체 데이터를 JSON으로 변환 및 undefined 필드 제거
      const updateData = Object.fromEntries(
        Object.entries(this.toJSON()).filter(
          ([_, value]) => value !== undefined
        )
      );

      if (Object.keys(updateData).length === 0) {
        throw new Error("No valid fields to update");
      }

      // 데이터베이스 업데이트
      await categoriesRef.child(this.pk).update(updateData);

      return this;
    } catch (error) {
      console.error("Error updating category:", error);
      throw new Error("Failed to update category");
    }
  }

  // Delete a category by PK
  static async deleteByPk(pk) {
    try {
      const snapshot = await categoriesRef.child(pk).once("value");
      if (!snapshot.exists()) {
        throw new Error("Category not found");
      }
      await categoriesRef.child(pk).remove();
      return { message: "Category deleted successfully" };
    } catch (error) {
      console.error("Error deleting category:", error);
      throw new Error("Failed to delete category");
    }
  }
}

class Material {
  constructor(data) {
    this.pk = data.pk || null; // Firebase에서 자동 생성됨
    this.product_code = data.product_code || "A01010001"; // 기본 상품 코드
    this.product_name = data.product_name;
    this.product_sale = data.product_sale;
    this.provider_name = data.provider_name;
    this.original_image = data.original_image || null;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || null;
    this.provider_code = data.provider_code;
    this.product_category_code = data.product_category_code;
  }

  toJSON() {
    return {
      product_code: this.product_code,
      product_name: this.product_name,
      product_sale: this.product_sale,
      provider_name: this.provider_name,
      original_image: this.original_image,
      created_at: this.created_at,
      updated_at: this.updated_at,
      provider_code: this.provider_code,
      product_category_code: this.product_category_code,
    };
  }

  // Create a new material
  async create() {
    try {
      const newMaterialRef = await materialsRef.push(this.toJSON());
      this.pk = newMaterialRef.key;
      await newMaterialRef.update({ pk: this.pk });
      return this;
    } catch (error) {
      console.error("Error creating material:", error);
      throw new Error("Failed to create material");
    }
  }

  // Get a material by PK
  static async getByPk(pk) {
    try {
      const snapshot = await materialsRef.child(pk).once("value");
      if (!snapshot.exists()) {
        throw new Error("Material not found");
      }
      return { pk, ...snapshot.val() };
    } catch (error) {
      console.error("Error fetching material:", error);
      throw new Error("Failed to fetch material");
    }
  }

  // Get all materials
  static async getAll() {
    try {
      const snapshot = await materialsRef.once("value");
      if (!snapshot.exists()) {
        return [];
      }
      const materials = [];
      snapshot.forEach((child) => {
        materials.push({ pk: child.key, ...child.val() });
      });
      return materials;
    } catch (error) {
      console.error("Error fetching materials:", error);
      throw new Error("Failed to fetch materials");
    }
  }

  // Update a material by PK
  async update() {
    try {
      if (!this.pk) {
        throw new Error("Material PK is required for update");
      }

      // 현재 시간 갱신
      this.updated_at = new Date().toISOString();

      // 객체 데이터를 JSON으로 변환 및 undefined 필드 제거
      const updateData = Object.fromEntries(
        Object.entries(this.toJSON()).filter(
          ([_, value]) => value !== undefined
        )
      );

      if (Object.keys(updateData).length === 0) {
        throw new Error("No valid fields to update");
      }

      // 데이터베이스 업데이트
      await materialsRef.child(this.pk).update(updateData);

      return this;
    } catch (error) {
      console.error("Error updating material:", error);
      throw new Error("Failed to update material");
    }
  }

  // Delete a material by PK
  static async deleteByPk(pk) {
    try {
      const snapshot = await materialsRef.child(pk).once("value");
      if (!snapshot.exists()) {
        throw new Error("Material not found");
      }
      await materialsRef.child(pk).remove();
      return { message: "Material deleted successfully" };
    } catch (error) {
      console.error("Error deleting material:", error);
      throw new Error("Failed to delete material");
    }
  }
}

class Product {
  constructor(data) {
    this.PK = data.PK || null; // 데이터베이스에서 자동 생성됨
    this.product_code = data.product_code;
    this.branch_id = data.branch_id;
    this.product_name = data.product_name;
    this.product_price = data.product_price || 0;
    this.product_image = data.product_image;
    this.blurred_image = data.blurred_image || null;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || null;
  }

  toJSON() {
    return {
      product_code: this.product_code,
      branch_id: this.branch_id,
      product_name: this.product_name,
      product_price: this.product_price,
      product_image: this.product_image,
      blurred_image: this.blurred_image,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  // Create a new product
  async create() {
    try {
      const newProductRef = await productsRef.push(this.toJSON());
      this.PK = newProductRef.key;
      await newProductRef.update({ PK: this.PK });
      return this;
    } catch (error) {
      console.error("Error creating product:", error);
      throw new Error("Failed to create product");
    }
  }

  // Get a product by PK
  static async getByPK(PK) {
    try {
      const snapshot = await productsRef.child(PK).once("value");
      if (!snapshot.exists()) {
        throw new Error("Product not found");
      }
      return { PK, ...snapshot.val() };
    } catch (error) {
      console.error("Error fetching product:", error);
      throw new Error("Failed to fetch product");
    }
  }

  // Get all products
  static async getAll() {
    try {
      const snapshot = await productsRef.once("value");
      if (!snapshot.exists()) {
        return [];
      }
      const products = [];
      snapshot.forEach((child) => {
        products.push({ PK: child.key, ...child.val() });
      });
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }
  }

  // Update a product by PK
  async update() {
    try {
      if (!this.PK) {
        throw new Error("Product PK is required for update");
      }

      this.updated_at = new Date().toISOString();

      const updateData = Object.fromEntries(
        Object.entries(this.toJSON()).filter(
          ([_, value]) => value !== undefined
        )
      );

      if (Object.keys(updateData).length === 0) {
        throw new Error("No valid fields to update");
      }

      await productsRef.child(this.PK).update(updateData);
      return this;
    } catch (error) {
      console.error("Error updating product:", error);
      throw new Error("Failed to update product");
    }
  }

  // Delete a product by PK
  static async deleteByPK(PK) {
    try {
      const snapshot = await productsRef.child(PK).once("value");
      if (!snapshot.exists()) {
        throw new Error("Product not found");
      }
      await productsRef.child(PK).remove();
      return { message: "Product deleted successfully" };
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error("Failed to delete product");
    }
  }
}

class OrderingHistory {
  constructor(data) {
    this.pk = data.pk || null; // Primary Key
    this.provider_id = data.provider_id;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || null;
    this.arrive = data.arrive || 0;
  }

  toJSON() {
    return {
      provider_id: this.provider_id,
      created_at: this.created_at,
      updated_at: this.updated_at,
      arrive: this.arrive,
    };
  }

  // Create a new ordering history entry
  async create() {
    try {
      const newRef = await orderingHistoryRef.push(this.toJSON());
      this.pk = newRef.key;
      await newRef.update({ pk: this.pk });
      return this;
    } catch (error) {
      console.error("Error creating ordering history:", error);
      throw new Error("Failed to create ordering history");
    }
  }

  // Get an ordering history by PK
  static async getByPK(pk) {
    try {
      const snapshot = await orderingHistoryRef.child(pk).once("value");
      if (!snapshot.exists()) {
        throw new Error("Ordering history not found");
      }
      return { pk, ...snapshot.val() };
    } catch (error) {
      console.error("Error fetching ordering history:", error);
      throw new Error("Failed to fetch ordering history");
    }
  }

  // Get all ordering history entries
  static async getAll() {
    try {
      const snapshot = await orderingHistoryRef.once("value");
      if (!snapshot.exists()) {
        return [];
      }
      const histories = [];
      snapshot.forEach((childSnapshot) => {
        histories.push({ pk: childSnapshot.key, ...childSnapshot.val() });
      });
      return histories;
    } catch (error) {
      console.error("Error fetching ordering histories:", error);
      throw new Error("Failed to fetch ordering histories");
    }
  }

  // Update an ordering history entry
  async update() {
    try {
      if (!this.pk) {
        throw new Error("PK is required for update");
      }
      this.updated_at = new Date().toISOString();
      const updatedData = Object.fromEntries(
        Object.entries(this.toJSON()).filter(
          ([_, value]) => value !== undefined
        )
      );
      await orderingHistoryRef.child(this.pk).update(updatedData);
      return this;
    } catch (error) {
      console.error("Error updating ordering history:", error);
      throw new Error("Failed to update ordering history");
    }
  }

  // Delete an ordering history entry by PK
  static async deleteByPK(pk) {
    try {
      const snapshot = await orderingHistoryRef.child(pk).once("value");
      if (!snapshot.exists()) {
        throw new Error("Ordering history not found");
      }
      await orderingHistoryRef.child(pk).remove();
      return { message: "Ordering history deleted successfully" };
    } catch (error) {
      console.error("Error deleting ordering history:", error);
      throw new Error("Failed to delete ordering history");
    }
  }
}

class OrderingProduct {
  constructor(data) {
    this.pk = data.pk || null; // 데이터베이스에서 자동 생성됨
    this.history_pk = data.history_pk;
    this.provider_id = data.provider_id;
    this.ordered_cnt = data.ordered_cnt;
    this.material_pk = data.material_pk;
    this.product_code = data.product_code || "A01010001"; // 기본값
    this.provider_code = data.provider_code;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || null;
  }

  toJSON() {
    return {
      pk: this.pk,
      history_pk: this.history_pk,
      provider_id: this.provider_id,
      ordered_cnt: this.ordered_cnt,
      material_pk: this.material_pk,
      product_code: this.product_code,
      provider_code: this.provider_code,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  // Create a new ordering product
  async create() {
    try {
      const newRef = await orderingProductRef.push(this.toJSON());
      this.pk = newRef.key;
      await newRef.update({ pk: this.pk });
      return this;
    } catch (error) {
      console.error("Error creating ordering product:", error);
      throw new Error("Failed to create ordering product");
    }
  }

  // Get an ordering product by PK
  static async getByPK(pk) {
    try {
      const snapshot = await orderingProductRef.child(pk).once("value");
      if (!snapshot.exists()) {
        throw new Error("Ordering product not found");
      }
      return { pk, ...snapshot.val() };
    } catch (error) {
      console.error("Error fetching ordering product:", error);
      throw new Error("Failed to fetch ordering product");
    }
  }

  // Get all ordering products
  static async getAll() {
    try {
      const snapshot = await orderingProductRef.once("value");
      if (!snapshot.exists()) {
        return [];
      }
      const products = [];
      snapshot.forEach((child) => {
        products.push({ pk: child.key, ...child.val() });
      });
      return products;
    } catch (error) {
      console.error("Error fetching ordering products:", error);
      throw new Error("Failed to fetch ordering products");
    }
  }

  // Update an ordering product by PK
  async update() {
    try {
      if (!this.pk) {
        throw new Error("Ordering product PK is required for update");
      }

      this.updated_at = new Date().toISOString();

      const updateData = Object.fromEntries(
        Object.entries(this.toJSON()).filter(
          ([_, value]) => value !== undefined
        )
      );

      if (Object.keys(updateData).length === 0) {
        throw new Error("No valid fields to update");
      }

      await orderingProductRef.child(this.pk).update(updateData);
      return this;
    } catch (error) {
      console.error("Error updating ordering product:", error);
      throw new Error("Failed to update ordering product");
    }
  }

  // Delete an ordering product by PK
  static async deleteByPK(pk) {
    try {
      const snapshot = await orderingProductRef.child(pk).once("value");
      if (!snapshot.exists()) {
        throw new Error("Ordering product not found");
      }
      await orderingProductRef.child(pk).remove();
      return { message: "Ordering product deleted successfully" };
    } catch (error) {
      console.error("Error deleting ordering product:", error);
      throw new Error("Failed to delete ordering product");
    }
  }
}

class Inventory {
  constructor(data) {
    this.pk = data.pk || null; // 데이터베이스에서 자동 생성
    this.inventory_cnt = data.inventory_cnt || null;
    this.inventory_min_cnt = data.inventory_min_cnt || null;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || null;
    this.product_pk = data.product_pk;
    this.product_code = data.product_code || "A01010001";
    this.branch_id = data.branch_id;
    this.provider_id = data.provider_id;
  }

  toJSON() {
    return {
      inventory_cnt: this.inventory_cnt,
      inventory_min_cnt: this.inventory_min_cnt,
      created_at: this.created_at,
      updated_at: this.updated_at,
      product_pk: this.product_pk,
      product_code: this.product_code,
      branch_id: this.branch_id,
      provider_id: this.provider_id,
    };
  }

  // Create a new inventory
  async create() {
    try {
      const newRef = await inventoryRef.push(this.toJSON());
      this.pk = newRef.key;
      await newRef.update({ pk: this.pk });
      return this;
    } catch (error) {
      console.error("Inventory 생성 오류:", error);
      throw new Error("Inventory 생성 실패");
    }
  }

  // Get inventory by PK
  static async getByPK(pk) {
    try {
      const snapshot = await inventoryRef.child(pk).once("value");
      if (!snapshot.exists()) throw new Error("Inventory를 찾을 수 없습니다.");
      return { pk, ...snapshot.val() };
    } catch (error) {
      console.error("Inventory 조회 오류:", error);
      throw new Error("Inventory 조회 실패");
    }
  }

  // Get all inventories
  static async getAll() {
    try {
      const snapshot = await inventoryRef.once("value");
      if (!snapshot.exists()) return [];
      const inventories = [];
      snapshot.forEach((child) => {
        inventories.push({ pk: child.key, ...child.val() });
      });
      return inventories;
    } catch (error) {
      console.error("모든 Inventory 조회 오류:", error);
      throw new Error("모든 Inventory 조회 실패");
    }
  }

  // Update inventory by PK
  async update() {
    try {
      if (!this.pk) throw new Error("Inventory PK가 필요합니다.");
      this.updated_at = new Date().toISOString();
      const updateData = Object.fromEntries(
        Object.entries(this.toJSON()).filter(
          ([_, value]) => value !== undefined
        )
      );
      await inventoryRef.child(this.pk).update(updateData);
      return this;
    } catch (error) {
      console.error("Inventory 업데이트 오류:", error);
      throw new Error("Inventory 업데이트 실패");
    }
  }

  // Delete inventory by PK
  static async deleteByPK(pk) {
    try {
      const snapshot = await inventoryRef.child(pk).once("value");
      if (!snapshot.exists()) throw new Error("Inventory를 찾을 수 없습니다.");
      await inventoryRef.child(pk).remove();
      return { message: "Inventory 삭제 성공" };
    } catch (error) {
      console.error("Inventory 삭제 오류:", error);
      throw new Error("Inventory 삭제 실패");
    }
  }
}

module.exports = {
  Category,
  Material,
  Product,
  OrderingHistory,
  OrderingProduct,
  Inventory,
};
