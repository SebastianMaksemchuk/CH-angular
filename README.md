# CHAngularMaksemchuk

Entrega final del proyecto para el curso Angular de CoderHouse comisión 57210.

Para correr la aplicación deben ejecutarse por consola:
Run `json-server db.json --watch` (http://localhost:3000/) to start json server.
Run `ng serve -o` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

Para revisar los test unitarios ejecutar por consola:
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

Se utiliza NgRx para crear y modificar el state durante la ejecución y para realizar la lectura y modificación desde y hacia la base de datos, a través de los servicios que realizan http requests a través de la api de json server.

## Explicación general de la app y algunos detalles de funcionamiento

Al ejecutarse por primera vez deberá autenticarse con un usuario. En el mismo componente de login se muestran dos usuarios con los que se puede ingresar.
No se puede acceder a ninguna otra funcionalidad hasta que se haga el login, todo lo demás está protegido por un guard. Una vez autenticado se guarda el usuario en localStorage, para validar el token de usuario. Si se sale de la applicación mediante el botón del toolbar o la barra lateral, se borra el usuario guardado.

Hay dos tipos de usuario, Administrador y Profesor.
El usuario de tipo Administrador puede acceder a todas las funcionalidades. Puede listar, crear, editar, ver detalles y eliminar cursos, alumnos, inscripciones y usuarios.
El usuario de tipo Profesor solo puede listar y ver detalles de cursos y alumnos. Puede listar, creaer y eliminar inscripciones. No puede crear ni eliminar cursos y alumnos. Tampoco puede acceder a la sección de usuarios.

Las listas se muestran en tablas.
Se puede filtrar el contenido de las tablas utilizando el input Buscar que se encuentra sobre cada tabla.
Los botones para crear abren un diálogo con un formulario vacío que permite crear en la base de datos una entrada correspondiente al componente.
Los botones editar abren los mismos diálogos precargando los datos correspondientes al item que se quiera editar.
Los botones de eliminar permiten elimiar el item de la base de datos, previa confirmación. Asi mismo, cuando se elimina un curso o un alumno, también se eliminan todas las inscripciones relacionadas al mismo.
Los cursos tienen un profesor asignado, que debe ser un usuario del tipo profesor. Si un usuario administrador llegara a eliminar un usuario profesor, que tuviera cursos asignados, simplemente queda sin asignación.
Con los botones de detalle se puede acceder a componentes que muestran mas datos que las tablas para cada entrada. En el caso de los cursos y alumnos, se listan tambien las inscripciones relacionadas y desde allí mismo se pueden eliminar.
Para evitar que se eliminen todos los administradores, un administrador no puede editar, ni eliminar su propio usuario.
