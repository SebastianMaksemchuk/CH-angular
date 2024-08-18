# CHAngularMaksemchuk

Entrega final del proyecto para el curso Angular de CoderHouse comisión 57210.

Para correr la aplicación deben ejecutarse por consola:
Run `json-server db.json --watch` (http://localhost:3000/) to start json server.
Run `ng serve -o` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

Para revisar los test unitarios ejecutar por consola:
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

# Explicación general de la app

Al ejecutarse por primera vez deberá autenticarse con un usuario. En el mismo componente de login se muestran dos usuarios con los que se puede ingresar.
No se puede acceder a ninguna otra funcionalidad hasta que se haga el login, todo lo demás está protegido por un guard. Una vez autenticado se guarda el usuario en localStorage, para validar el token de usuario. Si se sale de la applicación mediante el botón del toolbar, se borra el usuario guardado.

Hay dos tipos de usuario, Administrador y Profesor.
El usuario de tipo Administrador puede acceder a todas las funcionalidades. Puede listar, crear, editar, ver detalles y eliminar cursos, alumnos, inscripciones y usuarios.
El usuario de tipo Profesor solo puede listar y ver detalles de cursos y alumnos. Puede listar, creaer y eliminar inscripciones. No puede crear ni eliminar cursos y alumnos. Tampoco puede acceder a la sección de usuarios.

Se utiliza NgRx para crear y modificar el state durante la ejecución y para realizar la lectura y modificación desde y hacia la base de datos, a través de los servicios que realizan http requests a través de la api de json server.


