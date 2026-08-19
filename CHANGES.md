# Refactor Change Log

## Variable Renames

| Old Name | New Name | Why |
|---|---|---|
| `x` | `nextConfessionId` | Makes the identifier counter's purpose explicit. |
| `d` | `confessionData` | Describes the request payload being validated and saved. |
| `r` | `request.params` | Removes the vague alias and keeps parameter access self-documenting. |
| `t` | Controller function selection | Replaced string dispatch with explicit route-to-controller delegation. |
| `arr` | `sortedConfessions` | Explains that the value is an ordered collection of stored confessions. |
| `result` | `getAllConfessions()` result | Keeps the response aggregate tied to its service operation. |
| `i` | `confessionId` | States that the parsed number identifies a confession. |
| `info` | `confession` | Identifies the retrieved domain object. |
| `cat` | `category` | Uses the domain term instead of an abbreviation. |
| `cats` | `CATEGORIES` | Signals a shared, immutable set of valid category values. |
| callback `x` | `confession` | Removes shadowing and identifies each filtered item. |
| `handler` | `confessionIndex` | Describes the array position used for deletion. |
| `res2` | `deletedConfession` | Describes the removed object returned to the client. |
| `tmp` | `savedConfession` | Makes the persisted object and its lifecycle clear. |
| `startStr` | Removed | The temporary added no meaning to an already readable log message. |

## Function Splits

### `handleAll()` split into

- `createConfession()` — validates request input, saves a valid confession, and sends the creation response.
- `listConfessions()` — returns the sorted collection response.
- `getConfession()` — parses an ID, retrieves one confession, and sends the response.
- `listConfessionsByCategory()` — validates a category and returns matching confessions.
- `deleteConfession()` — authorizes and removes a confession.

The original dispatcher mixed five unrelated responsibilities behind string flags. Explicit controllers make each endpoint independently understandable and testable.

### Service-level responsibilities

- `validateConfessionInput()` contains creation validation without HTTP concerns.
- `saveConfession()` owns ID generation and in-memory persistence.
- `getAllConfessions()`, `getConfessionById()`, and `getConfessionsByCategory()` expose focused read operations.
- `deleteConfessionById()` owns the storage mutation for deletion.

## MVC and configuration decisions

The route module now only maps HTTP methods and paths to controllers. Controllers translate HTTP concerns and preserve the starter response behavior. Services own business logic and state. The entry point only configures Express, mounts the route module, and starts the server when executed directly.

`PORT` and `DELETE_TOKEN` are loaded through `config/env.js`. The delete-token default remains `supersecret123` solely to preserve the starter API's behavior when no environment file is provided; deployments should set a private value through the environment. `.env.example` documents both keys without containing a real secret.

The list service sorts a shallow copy rather than the backing array. This preserves the observable ordering while avoiding a read operation mutating storage. Explicit radix arguments were added to all integer parsing. Comments explain the non-obvious copy-before-sort rationale rather than restating the code.

## Verification

The Node test suite covers the documented endpoints, response status codes, response payloads, input validation, category filtering, delete authorization, and not-found behavior. The README includes the local run and test commands and identifies the deployment field to complete after hosting.
