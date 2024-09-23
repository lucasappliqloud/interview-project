# Proyecto de prueba de AppliQloud

Los candidatos a formar parte del equipo de desarrollo de AppliQloud deberán elaborar un proyecto de prueba en donde utilicen sus conocimientos y su experiencia para desarrollar un aplicativo web.

## Prueba de frontend

En esta prueba se evaluarán los conocimientos del candidato para el desarrollo frontend, desde el diseño visual del aplicativo, hasta el correcto funcionamiento de la lógica de negocio.

### Pasos a seguir

- Forkear este repositorio (solo la rama `main`)
- Clonar el fork en el entorno local
- Crear una nueva rama con el formato `nombre`-`prueba`(ej. `david-frontend`, `lucas-frontend`, etc.)
- Desarrollar el proyecto
  - El proyecto consiste en un aplicativo web para gestionar productos y órdenes.
  - Para las consultas del proyecto se puede utilizar REST o GraphQL (GraphQL es lo que se utiliza en AppliQloud)
    - Las consultas se harán a la url `https://interview.appliqloud.com` 
  - Hay dos tipos de roles de usuarios, `ADMIN` y `USER`.
  - La aplicación de productos debe permitir las operaciones de creación, modificación, lectura, borrado, activación y desactivación de productos.
    - REST
      - `GET /products/count`
      - `GET /products`
      - `GET /products/{id}`
      - `POST /products`
      - `PUT /products/{id}`
      - `PUT /products/deactivate/{id}`
      - `PUT /products/activate/{id}`
      - `DELETE /products/{id}`
   - GraphQL (`/graphql`)
     - Queries
       - `countProducts`
       - `findProducts`
       - `findProductById`
     - Mutations
       - `createProduct`
       - `updateProduct`
       - `deactivateProduct`
       - `activateProduct`
       - `deleteProduct`
  - Los usuarios `ADMIN` deberian tener acceso a todas las acciones de la aplicación de órdenes.
  - Los usuarios `USER` deberan tambien ver esta aplicación, pero con una vista de solo lectura, bloqueando las demas acciones
  - La aplicación de órdenes permite crear órdenes en base a productos existentes.
    - REST
      - `GET /orders/count`
      - `GET /orders`
      - `GET /orders/{id}`
      - `POST /orders`
      - `PUT /orders/mark-as-received/{id}`
      - `PUT /orders/cancel/{id}`
   - GraphQL (`/graphql`)
     - Queries
       - `countOrders`
       - `findOrders`
       - `findOrdersById`
       - `findAllOrders`
     - Mutations
       - `createOrder`
       - `markOrderAsReceived`
       - `cancelOrder`
  - Los usuarios `ADMIN` deben de poder ver todas las órdenes existentes, además de poder marcar una órden como recibida o cancelarla.
  - Los usuarios `USER` deben de poder ver solo las órdenes que ellos crearon, crear nuevas órdenes o cancelar una órden.
  - El login se hace a través de OAuth2, mandando una petición `POST` al endpoint `/users/token`, enviando el usuario y contraseña y recibiendo como respuesta un token de acceso.
  - Este token de acceso vence a los 15 minutos y se envia en el header `Authorization` bajo el esquema `Bearer Token` en todas las demás peticiones.
  - En caso de que el token haya vencido, hay que redireccionar al usuario al login
  - El layout y la estética general del aplicativo quedan a discreción del candidato.
- Publicar la rama local en el fork de GitHub
- Enviar un pull request del fork a la rama `main` del repositorio padre
