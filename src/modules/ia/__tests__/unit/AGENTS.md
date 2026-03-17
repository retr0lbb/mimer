# AIOrchestrator Testing Guide

## Overview
This document outlines the testing strategy and structure for the `AIOrchestrator` class and its dependencies.

## Folder Structure
```
src/modules/ia/
├── __tests__/
│   └── unit/
│       ├── ai.orchestrator.test.ts
│       └── mocks/
│           ├── provider.factory.mock.ts
│           ├── provider.mock.ts
│           ├── tool.executor.mock.ts
│           └── tool.registry.mock.ts
```

## Dependencies to Mock

| Dependency | File | Mock Purpose |
|------------|------|--------------|
| ProviderFactory | `mocks/provider.factory.mock.ts` | Returns mock AIProvider |
| AIProvider | `mocks/provider.mock.ts` | Mock `generate()` and `generateStream()` |
| ToolExecutor | `mocks/tool.executor.mock.ts` | Mock `execute()` |
| ToolRegistry | `mocks/tool.registry.mock.ts` | Mock `getToolsForTenant()` |

## Test Scenarios

### AIOrchestrator.run()

| # | Scenario | Expected Result |
|---|----------|-----------------|
| 1 | Basic run without tools, returns text | Returns `{ type: "final", content: string }` |
| 2 | Run with tool call, executes tool, returns final | Tool executed once, returns final response |
| 3 | Run with multiple tool calls (2-3 iterations) | Each tool executed, returns after last |
| 4 | Max iterations exceeded (5 tool calls) | Throws `"Too Many Interations"` |
| 5 | Provider throws error | Error propagates |
| 6 | Tool executor throws | Error propagates |

### AIOrchestrator.runStream()

| # | Scenario | Expected Result |
|---|----------|-----------------|
| 1 | Provider doesn't support streaming | Throws `"Stream not supported by provider"` |
| 2 | With tools - delegates to `run()` | Returns result from `run()` |
| 3 | Without tools - uses generateStream() | Calls provider.generateStream, returns final |
| 4 | Stream throws error | Error propagates |

### ToolExecutor

| # | Scenario | Expected Result |
|---|----------|-----------------|
| 1 | Tool not found for tenant | Throws `Tool ${toolName} not implemented for tenant` |
| 2 | Handler type unsupported | Throws `"Unsuported Tool Handler Type"` |
| 3 | Internal handler not implemented | Throws `"Internal Handler not implemented yet"` |
| 4 | HTTP call fails | Throws `"HTTP call failed"` |

## Test Data Fixtures

### AIMessage Examples
```typescript
const userMessage: AIMessage = { role: "user", content: "Hello" };
const assistantMessage: AIMessage = { role: "assistant", content: "Hi there" };
const systemMessage: AIMessage = { role: "system", content: "You are helpful" };
const toolMessage: AIMessage = { role: "tool", name: "buscar_boleto", content: '{"result": "..."}' };
```

### AITool Examples
```typescript
const buscarBoletoTool: AITool = {
  name: "buscar_boleto",
  description: "busca um boleto em json pelo nome e cpf de uma pessoa",
  schema: {
    type: "object",
    properties: {
      nome: { type: "string" },
      cpf: { type: "string" },
    },
    required: ["nome", "cpf"],
  },
};
```

### AIProviderResponse Examples
```typescript
const textResponse: AIProviderResponse = {
  text: "Hello, how can I help you?",
  finishReason: "stop",
};

const toolCallResponse: AIProviderResponse = {
  toolCall: {
    id: "call_123",
    name: "buscar_boleto",
    arguments: { nome: "John", cpf: "12345678900" },
  },
  finishReason: "tool_call",
};
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- ai.orchestrator.test.ts

# Run with coverage
npm test -- --coverage
```

## Notes

- All mocks use `jest.fn()` for function mocking
- Tests follow Arrange-Act-Assert pattern
- Each test should be independent and not rely on shared state
- Use descriptive test names following the pattern: `should [expected behavior] when [condition]`
