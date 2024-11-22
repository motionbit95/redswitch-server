// Account class for validation (optional)
class Account {
  constructor(data) {
    this.id = data.id || null;
    this.provider_id = data.provider_id || null;
    this.branch_id = data.branch_id || null;
    this.user_id = data.user_id;
    this.user_password = data.user_password;
    this.user_email = data.user_email;
    this.user_name = data.user_name;
    this.user_phone = data.user_phone;
    this.permission = data.permission || "1";
    this.created_at = data.created_at || new Date();
    this.activate_at = data.activate_at || null;
    this.updated_at = data.updated_at || null;
    this.office_position = data.office_position || null;
  }

  // Convert to plain object before passing to Firestore
  toJSON() {
    return {
      id: this.id,
      provider_id: this.provider_id,
      branch_id: this.branch_id,
      user_id: this.user_id,
      user_password: this.user_password,
      user_email: this.user_email,
      user_name: this.user_name,
      user_phone: this.user_phone,
      permission: this.permission,
      created_at: this.created_at,
      activate_at: this.activate_at,
      updated_at: this.updated_at,
      office_position: this.office_position,
    };
  }
}

module.exports = Account;
