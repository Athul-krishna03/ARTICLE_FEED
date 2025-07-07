import * as Yup from "yup";
export const articleSchema = Yup.object({
    title: Yup.string()
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title must be less than 100 characters')
        .required('Title is required'),
    description: Yup.string()
        .min(10, 'Description must be at least 10 characters')
        .max(500, 'Description must be less than 500 characters')
        .required('Description is required'),
    tags: Yup.string()
        .max(100, 'Tags must be less than 100 characters'),
    category: Yup.string()
        .required('Category is required')
});