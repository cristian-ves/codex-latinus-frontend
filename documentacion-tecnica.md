# Documentación Técnica - Codex Latinus

## Tecnologías Utilizadas

-   **Lenguaje y Entorno Backend:** Java 17 (JDK Eclipse Temurin)
-   **Framework Backend:** Spring Boot 4.1.0 (`spring-boot-starter-webmvc`)
-   **Generador de Parsers:** ANTLR4 4.13.2 (`antlr4-runtime` y `antlr4-maven-plugin`)
-   **Librerías Auxiliares Backend:** Project Lombok, Spring Boot DevTools
-   **Herramienta de Construcción:** Apache Maven 3.9+
-   **Contenerización y Despliegue Backend:** Docker (Multi-stage build), Render (Web Service)
-   **Frontend y UI:** React 19, TypeScript, Vite 5, Tailwind CSS
-   **Visualización de Árbol (AST):** `react-d3-tree`, `lucide-react`
-   **Despliegue Frontend:** Netlify

---

## Especificaciones de Palabras Reservadas, Símbolos y Gramática

El lenguaje **Codex Latinus** es strictly sensible a mayúsculas y minúsculas (_case-sensitive_).

### Palabras Reservadas (Keywords)

| Categoría                  | Palabra Reservada | Descripción                                                 |
| :------------------------- | :---------------- | :---------------------------------------------------------- |
| **Secciones del Programa** | `VARIABILES>`     | Delimitador de la sección de variables globales             |
|                            | `VARIABILES[`     | Delimitador de la sección de variables locales en funciones |
|                            | `MUNERA>`         | Delimitador de la sección de funciones                      |
|                            | `MAIOR>`          | Delimitador del bloque principal de ejecución               |
|                            | `finis`           | Cierre de bloques de control, funciones y structs           |
|                            | `FINIS`           | Cierre definitivo del programa principal                    |
| **Declaraciones**          | `esto`            | Declaración de variable o campo                             |
|                            | `series`          | Declaración de arreglo                                      |
|                            | `structura`       | Definición de estructura                                    |
| **Tipos de Datos**         | `textum`          | Cadena de caracteres                                        |
|                            | `decimalis`       | Número de coma flotante                                     |
|                            | `numerus`         | Número entero                                               |
|                            | `littera`         | Carácter individual                                         |
|                            | `bool`            | Booleano (`verum` / `falsus`)                               |
| **Flujo de Control**       | `si`              | Condicional IF                                              |
|                            | `aliter`          | Condicional ELSE                                            |
|                            | `dum`             | Bucle WHILE (o condición final de DO-WHILE)                 |
|                            | `facere`          | Inicio de bucle DO-WHILE                                    |
|                            | `per`             | Bucle FOR                                                   |
|                            | `perge`           | Salto a siguiente iteración (CONTINUE)                      |
|                            | `interrumpe`      | Ruptura de bucle (BREAK)                                    |
| **Funciones**              | `actio`           | Función sin retorno (`void`)                                |
|                            | `ratio`           | Función con valor de retorno                                |
|                            | `reddere`         | Sentencia de retorno (`return`)                             |
| **Literales Booleanos**    | `verum`           | Valor verdadero (`true`)                                    |
|                            | `falsus`          | Valor falso (`false`)                                       |

### Símbolos y Operadores

| Símbolo                     | Nombre / Tipo                      | Descripción                                                       |
| :-------------------------- | :--------------------------------- | :---------------------------------------------------------------- |
| `<<`                        | Operador de lectura                | Entrada de datos por consola (`read`)                             |
| `>>`                        | Operador de impresión              | Salida de datos por consola (`print`)                             |
| `++` / `--`                 | Incremento / Decremento            | Operadores unarios de modificación en 1                           |
| `+` / `-`                   | Suma / Resta                       | Operadores aritméticos binarios (y resta unaria)                  |
| `*` / `/` / `%`             | Multiplicación / División / Módulo | Operadores aritméticos de alta precedencia                        |
| `=`                         | Asignación                         | Asignación de valor a variable o campo                            |
| `==` / `!=`                 | Igualdad / Desigualdad             | Operadores relacionales de comparación exacta                     |
| `>` / `<` / `>=` / `<=`     | Comparadores relacionales          | Comparadores de magnitud numérica                                 |
| `&&` / `\|\|` / `non`       | Lógicos (AND, OR, NOT)             | Operadores booleanos binarios y unario (`non`)                    |
| `;` / `,` / `.` / `:`       | Puntuación                         | Delimitador de instrucción, separador, acceso a miembros y tipado |
| `(` `)` / `{` `}` / `[` `]` | Agrupadores                        | Delimitadores de expresiones, bloques y subíndices de arreglos    |

### Estructura Gramatical (Jerarquía de Expresiones y Reglas)

```text
program                 : structDeclaration* globalSection? functionsSection? mainSection EOF ;
globalSection           : 'VARIABILES>' varDeclaration+ ;
functionsSection        : 'MUNERA>' functionDeclaration+ ;
mainSection             : 'MAIOR>' statement* 'FINIS' ';' ;

// Regla de precedencia de operadores (de menor a mayor precedencia):
expression              : orExpression ;
orExpression            : andExpression ('||' andExpression)* ;
andExpression           : equalityExpression ('&&' equalityExpression)* ;
equalityExpression      : relationalExpression (('==' | '!=') relationalExpression)* ;
relationalExpression    : additiveExpression (('>' | '<' | '>=' | '<=') additiveExpression)* ;
additiveExpression      : multiplicativeExpression (('+' | '-') multiplicativeExpression)* ;
multiplicativeExpression: unaryExpression (('*' | '/' | '%') unaryExpression)* ;
unaryExpression         : ('non' | '-') unaryExpression | postfixExpression ;
postfixExpression       : primaryExpression ('[' expression ']' | '.' IDENTIFIER)* ;
```

---

## Tabla de Compatibilidad de Tipos

El analizador semántico de Codex Latinus (`BinaryOperatorChecker`) aplica reglas estrictas de tipado estático:

### 1. Operaciones Aritméticas Binarias (`+`, `-`, `*`, `/`, `%`)

| Operando Izquierdo (L) | Operando Derecho (R)   | Tipo Resultante     | Observación / Regla                                          |
| :--------------------- | :--------------------- | :------------------ | :----------------------------------------------------------- |
| `numerus`              | `numerus`              | `numerus`           | Operación entera estándar                                    |
| `numerus`              | `decimalis`            | `decimalis`         | Promoción implícita (widening)                               |
| `decimalis`            | `numerus`              | `decimalis`         | Promoción implícita (widening)                               |
| `decimalis`            | `decimalis`            | `decimalis`         | Operación flotante estándar                                  |
| `textum`               | `numerus` / Cualquiera | **ERROR SEMÁNTICO** | No se permite concatenación con `+`                          |
| `numerus`              | `textum`               | **ERROR SEMÁNTICO** | Sin coerción implícita de tipos a `textum`                   |
| `bool` / `littera`     | Cualquiera             | **ERROR SEMÁNTICO** | Los tipos booleanos y caracteres no participan en aritmética |

### 2. Operadores Relacionales (`>`, `<`, `>=`, `<=`)

| Operando Izquierdo (L)        | Operando Derecho (R)     | Tipo Resultante     | Regla                                                       |
| :---------------------------- | :----------------------- | :------------------ | :---------------------------------------------------------- |
| `numerus` \| `decimalis`      | `numerus` \| `decimalis` | `bool`              | Válido entre cualquier combinación de tipos numéricos       |
| `textum` / `littera` / `bool` | Cualquiera               | **ERROR SEMÁNTICO** | No se permite comparación relacional de cadenas o booleanos |

### 3. Operadores de Igualdad (`==`, `!=`)

| Operando Izquierdo (L) | Operando Derecho (R) | Tipo Resultante     | Regla                                                                   |
| :--------------------- | :------------------- | :------------------ | :---------------------------------------------------------------------- |
| T                      | T                    | `bool`              | Válido únicamente si los dos tipos son idénticos (`left.equals(right)`) |
| `numerus`              | `decimalis`          | **ERROR SEMÁNTICO** | No se permite comparación estricta directa entre int y float            |
| `textum`               | `numerus`            | **ERROR SEMÁNTICO** | Tipos incompatibles para comparación de igualdad                        |

### 4. Operadores Lógicos (`&&`, `||`) y Unario (`non`)

| Operando Izquierdo (L) | Operando Derecho (R) | Tipo Resultante     | Regla                                             |
| :--------------------- | :------------------- | :------------------ | :------------------------------------------------ |
| `bool`                 | `bool`               | `bool`              | Ambos operandos deben ser strictly de tipo `bool` |
| Cualquier otro tipo    | Cualquiera           | **ERROR SEMÁNTICO** | No hay evaluación de valores truthy / falsy       |

### 5. Compatibilidad en Asignaciones (`variable = expresión`)

| Tipo Variable (LHS) | Tipo Expresión (RHS) | Resultado Semántico | Regla                                                   |
| :------------------ | :------------------- | :------------------ | :------------------------------------------------------ |
| T                   | T                    | **VÁLIDO**          | Coincidencia directa de tipo                            |
| `decimalis`         | `numerus`            | **VÁLIDO**          | Promoción implícita permitida                           |
| `numerus`           | `decimalis`          | **ERROR SEMÁNTICO** | Reducción con pérdida de precisión no permitida         |
| `struct A`          | `struct B`           | **ERROR SEMÁNTICO** | Válido solo si A y B corresponden a la misma estructura |
