// 상품 카테고리, 물자, 상품, 재고를 관리합니다.

const admin = require("firebase-admin");
const database = admin.database();
const categoriesRef = database.ref("categories"); // 'categories' 경로 참조

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

module.exports = { Category };
