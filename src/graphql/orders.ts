import { gql } from '@apollo/client';

export const FIND_ORDERS = gql`
  query {
    findOrders {
      id
      status
      quantity
      total
      product {
        id
        price
        translations {
          language
          description
        }
      }
    }
  }
`;

export const FIND_ORDER_BY_ID = gql`
  query findOrderById($id: String!) {
    findOrderById(id: $id) {
      ... on Order {
        id
        status
        quantity
        total
        product {
          id
          price
          translations {
            language
            description
          }
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

export const CREATE_ORDER = gql`
  mutation createOrder($order: OrderInput!) {
    createOrder(order: $order) {
      ... on Order {
        id
        status
        quantity
        total
        product {
          id
          price
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

export const MARK_ORDER_AS_RECEIVED = gql`
  mutation markOrderAsReceived($id: String!) {
    markOrderAsReceived(id: $id) {
      ... on Order {
        id
        status
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

export const CANCEL_ORDER = gql`
  mutation cancelOrder($id: String!) {
    cancelOrder(id: $id) {
      ... on Order {
        id
        status
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