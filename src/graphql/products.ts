import { gql } from '@apollo/client';

export const FIND_PRODUCTS = gql`
  query {
    findProducts {
      id
      isActive
      price
      translations {
        language
        description
      }
    }
  }
`;

export const FIND_PRODUCT_BY_ID = gql`
  query findProductById($id: String!) {
    findProductById(id: $id) {
      ... on Product {
        id
        isActive
        price
        translations {
          language
          description
        }
      }
      ... on Error {
        statusCode
        cause
        message
        context
      }
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation createProduct($product: CreateProductInput!) {
    createProduct(product: $product) {
      ... on Product {
        id
        isActive
        price
        translations {
          language
          description
        }
      }
      ... on Error {
        statusCode
        cause
        message
        context
      }
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation updateProduct($id: String!, $product: UpdateProductInput!) {
    updateProduct(id: $id, product: $product) {
      ... on Product {
        id
        isActive
        price
        translations {
          language
          description
        }
      }
      ... on Error {
        statusCode
        cause
        message
        context
      }
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation deleteProduct($id: String!) {
    deleteProduct(id: $id) {
      ... on Product {
        id
      }
      ... on Error {
        statusCode
        cause
        message
        context
      }
    }
  }
`;

export const ACTIVATE_PRODUCT = gql`
  mutation activateProduct($id: String!) {
    activateProduct(id: $id) {
      ... on Product {
        id
        isActive
      }
      ... on Error {
        statusCode
        cause
        message
        context
      }
    }
  }
`;

export const DEACTIVATE_PRODUCT = gql`
  mutation deactivateProduct($id: String!) {
    deactivateProduct(id: $id) {
      ... on Product {
        id
        isActive
      }
      ... on Error {
        statusCode
        cause
        message
        context
      }
    }
  }
`;