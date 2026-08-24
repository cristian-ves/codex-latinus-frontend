# Manual Técnico - Compilador Codex Latinus

## 1. Visión General de la Arquitectura

El sistema **Codex Latinus** es un compilador cliente-servidor para un lenguaje de programación imperativo y fuertemente tipado con sintaxis basada en latín. El backend analiza, valida semánticamente y traduce el código fuente a **Pig Latin**, generando adicionalmente el Árbol de Sintaxis Abstracta (AST) para su visualización interactiva en el frontend.

### Pipeline de Compilación

```text
[Código Fuente .codex]
        │
        ▼
[Lexer (ANTLR4)] ────────► [Tokens]
        │
        ▼
[Parser (ANTLR4)] ───────► [Parse Tree (CST)]
        │
        ▼
[ASTBuilder (Visitor)] ──► [CodexASTNode (AST Core)]
        │
        ├───► [SemanticAnalysisVisitor] ──► [Tabla de Símbolos / Detección de Errores]
        │
        └───► [PigLatinTranslationVisitor] ──► [Código Traducido a Pig Latin]
```

---

## 2. Estructura del Proyecto

```text
codex-latinus-compiler/
├── backend/
│   ├── src/main/
│   │   ├── antlr4/com/aleja/codexlatinus/compiler/
│   │   │   ├── CodexLexer.g4
│   │   │   └── CodexParser.g4
│   │   └── java/com/aleja/codexlatinus/compiler/
│   │       ├── ast/                      # Nodos del AST (ProgramNode, VarDeclNode, etc.)
│   │       ├── controller/               # CompilerController (REST Endpoints)
│   │       ├── error/                    # Manejo de errores léxicos, sintácticos y semánticos
│   │       ├── semantic/                 # Analizador semántico y Tabla de Símbolos
│   │       │   ├── BinaryOperatorChecker.java
│   │       │   ├── Scope.java
│   │       │   ├── SemanticAnalysisVisitor.java
│   │       │   ├── StructLiteralChecker.java
│   │       │   ├── Symbol.java
│   │       │   ├── SymbolTable.java
│   │       │   └── SymbolType.java
│   │       ├── service/                  # CompilerService (Orquestador)
│   │       └── visitor/                  # ASTBuilder y PigLatinTranslationVisitor
│   ├── Dockerfile
│   └── pom.xml
└── frontend/
    ├── src/
    │   ├── components/                   # Editor de código, Árbol AST (react-d3-tree), Consola
    │   ├── services/                     # Cliente HTTP (Axios / Fetch)
    │   └── App.tsx
    └── package.json
```

---

## 3. Componentes Principales del Backend

### 3.1. Analizador Léxico y Sintáctico (ANTLR4)

-   **`CodexLexer.g4`**: Define los tokens, palabras reservadas (`MAIOR>`, `esto`, `series`, `structura`), operadores y literales.
-   **`CodexParser.g4`**: Especifica la gramática libre de contexto y la jerarquía de precedencia de operadores.

### 3.2. Construcción del AST (`ASTBuilder`)

Implementa el patrón Visitor sobre el árbol de análisis sintáctico (CST) generado por ANTLR4 para transformarlo en un AST ligero y desacoplado de las clases de ANTLR.

-   **Patrón de diseño**: `Visitor`
-   **Clase base**: `CodexParserBaseVisitor<CodexASTNode>`
-   **Entrada**: `ProgramContext`
-   **Salida**: `ProgramNode` (Nodo raíz del AST)

### 3.3. Análisis Semántico y Verificación de Tipos

El análisis semántico se ejecuta mediante `SemanticAnalysisVisitor`, el cual realiza un recorrido en profundidad (_Depth-First Search_) sobre el AST comprobando el tipado estático y el alcance (_scoping_).

#### Componentes Semánticos Clave:

1. **`SymbolTable` y `Scope`**:

    - Mantiene un árbol de ámbitos anidados (`GLOBAL`, `FUNCTION`, `LOCAL`).
    - Permite la resolución encadenada de identificadores hacia ámbitos superiores (_parent scope_).
    - Detecta re-declaraciones ilegales en el mismo ámbito y variables no declaradas.

2. **`BinaryOperatorChecker`**:

    - Encargado de validar la compatibilidad de tipos en expresiones binarias (aritméticas, relacionales, de igualdad y lógicas).
    - Aplica reglas de promoción implícita (`numerus` + `decimalis` $\rightarrow$ `decimalis`).
    - Genera instancias de `SemanticError` cuando los tipos son incompatibles (ej. suma de `textum` con `numerus`).

3. **`StructLiteralChecker`**:
    - Valida que las asignaciones a instancias de `structura` coincidan en nombre de campos, orden y tipos definidos en la declaración original.

### 3.4. Generación de Código (`PigLatinTranslationVisitor`)

Recorre el AST semánticamente válido para traducir las instrucciones del lenguaje Codex Latinus a **Pig Latin**, transformando los identificadores y palabras clave mediante las reglas fonéticas del algoritmo Pig Latin.

---

## 4. Especificación de la API REST

### Endpoint Principal de Compilación

-   **URL:** `/api/v1/compiler/compile`
-   **Método:** `POST`
-   **Content-Type:** `application/json`

#### Estructura de Solicitud (Request Body)

```json
{
    "code": "MAIOR> esto x: numerus 10; >> x; FINIS;"
}
```

#### Estructura de Respuesta Satisfactoria (200 OK)

```json
{
    "success": true,
    "errors": [],
    "translatedCode": "AIORMAY> estoway xway: umerusnay 10way; >> xway; INISFAY;",
    "astTree": {
        "name": "ProgramNode",
        "attributes": { "line": 1, "column": 0 },
        "children": [
            {
                "name": "VarDeclNode",
                "attributes": { "identifier": "x", "type": "numerus" }
            }
        ]
    }
}
```

#### Estructura de Respuesta con Errores Semánticos/Sintácticos (200 OK / 400 Bad Request)

```json
{
    "success": false,
    "errors": [
        {
            "type": "SEMANTIC",
            "message": "Operator '+' requires numeric operands, found textum and numerus.",
            "line": 3,
            "column": 12
        }
    ],
    "translatedCode": null,
    "astTree": null
}
```

---

## 5. Requisitos del Entorno y Despliegue

### Requisitos Mínimos de Desarrollo

-   **Java Development Kit (JDK):** 17 o superior
-   **Apache Maven:** 3.9.x
-   **Node.js:** 18.x / 20.x
-   **Docker Engine:** 24.x (opcional para contenerización)

### Comandos de Construcción y Ejecución Local

#### Backend (Spring Boot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

#### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

### Contenerización con Docker

```dockerfile
# Dockerfile Multi-stage para Backend
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```
