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
- Obtener todos los usuarios: **http://localhost:3000/usuarios/**
- Obtener la información de un usuario: **http://localhost:3000/usuarios/_Ismael_**

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

CREATE PROCEDURE dbo.UsuariosSEL
AS
    SELECT 
    U.Nombre,
    U.ClaveEncriptada,
    U.Email,
    (SELECT T.Token, T.Caducidad FROM dbo.TOKEN T WHERE T.Usuario_Nombre = U.Nombre FOR JSON PATH) AS Tokens
    FROM dbo.Usuario U 
GO

CREATE PROCEDURE dbo.UsuarioSEL
    @nombre NVARCHAR(50),
    @fechaActual BIGINT OUTPUT
AS
    SET @fechaActual = DATEDIFF(SECOND,{d '1970-01-01'}, GETDATE()) -- Obtener fecha actual en formato UNIX
    
    SELECT 
    U.Nombre,
    U.ClaveEncriptada,
    U.Email,
    (SELECT T.Token, T.Caducidad FROM dbo.TOKEN T WHERE T.Usuario_Nombre = U.Nombre FOR JSON PATH) AS Tokens
    FROM dbo.Usuario U 
    WHERE U.Nombre = @nombre
GO

```
- Agregad datos a ambas tablas. (Token.Usuario_Nombre se relaciona con Usuario.Nombre

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