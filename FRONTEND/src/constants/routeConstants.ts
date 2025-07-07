const BASE="articles"
export const ARTICLE_ROUTES = {
    FEED:`/${BASE}/feeds`,
    ADD: `/${BASE}/addArticle`,
    UPDATE: (id: string) => `/${BASE}/update/${id}`,
    DELETE: (id: string) => `/${BASE}/delete/${id}`,
    GET_ONE: (id: string) => `/${BASE}/${id}`,
    GET_ALL: "/articles",
    USER_ARTICLES: `/${BASE}/my-articles`,
};

export const AUTH_ROUTES={
    REGISTER: "/register",
    LOGIN: "/login",
    LOGOUT: "/logout",
    PROFILE: "/profile",
    CATEGORIES: "/categories",
}