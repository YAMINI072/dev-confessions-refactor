# Pre-Refactor Audit

This audit was completed after reading every starter file in the challenge directory and before changing application logic. The refactor treats this list as its acceptance contract.

## 1. Application structure

- `app.js` owns Express setup, in-memory data storage, validation, business rules, response formatting, logging, routing, configuration, and server startup.
- HTTP route declarations invoke a single dispatcher with string command names instead of delegating to focused controllers.
- There are no `routes/`, `controllers/`, `services/`, or `config/` modules, so responsibilities cannot be tested or changed in isolation.
- Server startup runs as a side effect whenever `app.js` is imported, which makes automated testing and composition difficult.

## 2. Naming and variable clarity

- `app` is declared with `var` even though it is never reassigned.
- `confessions` is mutable global state with no encapsulated access layer.
- `x` is an unexplained numeric identifier counter.
- `handleAll` does not describe its multiple responsibilities.
- `d`, `r`, `t`, `i`, `cat`, `cats`, `arr`, `tmp`, `res2`, and `handler` are vague names that obscure their data and purpose.
- The callback parameter `x` inside category filtering shadows the global identifier counter.
- `startStr` is an unnecessary temporary whose value is already a clear log message.

## 3. Function responsibilities

- `handleAll` handles five operations: create, list, fetch by ID, filter by category, and delete.
- The create branch combines request validation, category validation, ID generation, persistence, logging, and response construction.
- The get-one branch combines parameter parsing, lookup, invariant checking, logging, and response handling.
- The delete branch combines authorization, parameter validation, lookup, mutation, logging, and response handling.
- The route layer cannot reuse or independently test any of these behaviors because they are embedded in the dispatcher.

## 4. Configuration and security

- The port `3000` is hardcoded in the server bootstrap.
- The delete token `supersecret123` is a hardcoded secret in application logic.
- No `.env.example` documents the required runtime configuration.
- No configuration module centralizes environment parsing and safe defaults.

## 5. Maintainability and correctness risks

- Deeply nested conditional blocks make the create flow hard to read and increase the chance of changing the wrong branch.
- The same category list is declared twice instead of having one source of truth.
- `parseInt` is used without an explicit radix.
- The list operation sorts the shared in-memory array in place, coupling read ordering to storage order.
- The category filter uses a verbose callback where a direct predicate would be clearer.
- The `confessions.length > 500` check is unreachable as a meaningful safeguard because it only logs after the request handlers and does not enforce a limit.
- Error messages and response shapes are inconsistent (`msg`, `error`, and plain text), though the refactor must preserve the existing public behavior.
- There are no automated tests covering the documented endpoints, validation branches, authorization, or response shapes.
- The README does not document environment variables, deployment, test commands, or the refactored architecture.

## Refactor acceptance criteria

The completed code must preserve all existing endpoint paths, status codes, response payloads, category values, delete-header behavior, and in-memory semantics while moving responsibilities into MVC-style modules, centralizing configuration, using descriptive names, adding rationale comments, and documenting decisions in `CHANGES.md`.
