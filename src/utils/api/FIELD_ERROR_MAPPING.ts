const FIELD_ERROR_MAPPING = {
    login: {
      INVALID_CREDENTIALS: { email: "", password: "" },
      USER_NOT_FOUND: { email: "" },
      DEFAULT: { email: "", password: "" }
    },
};

export default FIELD_ERROR_MAPPING;
