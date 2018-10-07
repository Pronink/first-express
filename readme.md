Poner en marcha el servidor NodeJs con Express
==============================================
- Primero descargad o clonad este repositorio
- Desde la terminal acceder a la raiz del proyecto
- Ejecutad **npm install**
- Copiad el texto contenido en el archivo **configuracionSql.example.json**
- En la raiz del proyecto cread un archivo llamado **configuracionSql.json** y pegad lo copiado anteriormente. 
Ahora rellenadlo con los datos de la base de datos.

Probar la aplicación:
===============
- Ejecutad **npm run start** o **npm run nodemon** en la raiz del proyecto
- En el navegador, acceded a: **http://localhost:3000/usuarios/**

Poner en marcha el servidor de Microsoft SQL Server
===========
- Cread un servidor de Microsoft SQL Server (no voy a explicar esto aquí)
- Ejecutad los siguientes scripts:
```sql
USE master
GO

CREATE DATABASE FirstAngular
GO

CREATE TABLE [FirstAngular].[dbo].[Usuario]
(
    [Nombre] NVARCHAR(50) NOT NULL PRIMARY KEY,
    [Email] NVARCHAR(100) NOT NULL,
    [Edad] INT NOT NULL,
    [ClaveEncriptada] NVARCHAR(MAX) NOT NULL
);
GO

CREATE TABLE [FirstAngular].[dbo].[Token]
(
    [Usuario_Nombre] NVARCHAR(50) NOT NULL,
    [Token] NVARCHAR(200) NOT NULL,
    [Caducidad] BIGINT NOT NULL
    CONSTRAINT [UQ_codes] UNIQUE
    (
        [Nombre], [Token]
    )
);
GO
```
Pasos para crear un proyecto como el mío desde cero:
===================================
- npm install -g express-generator
- express --no-view --git
- npm install
- npm install --save mssql
- npm install --save cli-color
- npm install --save-dev nodemon
- npm install --save-dev @types/express
- npm install --save-dev @types/mssql
- npm install --save-dev @types/cli-color 
- Agregad manualmente **"nodemon": "nodemon ./bin/www"** a 
**"scripts"** en el archivo **package.json**