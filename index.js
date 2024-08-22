// @bun
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);

// node_modules/abitype/dist/esm/version.js
var version;
var init_version = __esm(() => {
  version = "1.0.5";
});

// node_modules/abitype/dist/esm/errors.js
class BaseError extends Error {
  constructor(shortMessage, args = {}) {
    const details = args.cause instanceof BaseError ? args.cause.details : args.cause?.message ? args.cause.message : args.details;
    const docsPath = args.cause instanceof BaseError ? args.cause.docsPath || args.docsPath : args.docsPath;
    const message = [
      shortMessage || "An error occurred.",
      "",
      ...args.metaMessages ? [...args.metaMessages, ""] : [],
      ...docsPath ? [`Docs: https://abitype.dev${docsPath}`] : [],
      ...details ? [`Details: ${details}`] : [],
      `Version: abitype@${version}`
    ].join("\n");
    super(message);
    Object.defineProperty(this, "details", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "docsPath", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "metaMessages", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "shortMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiTypeError"
    });
    if (args.cause)
      this.cause = args.cause;
    this.details = details;
    this.docsPath = docsPath;
    this.metaMessages = args.metaMessages;
    this.shortMessage = shortMessage;
  }
}
var init_errors = __esm(() => {
  init_version();
});

// node_modules/abitype/dist/esm/regex.js
function execTyped(regex, string) {
  const match = regex.exec(string);
  return match?.groups;
}
var bytesRegex, integerRegex, isTupleRegex;
var init_regex = __esm(() => {
  bytesRegex = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
  integerRegex = /^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
  isTupleRegex = /^\(.+?\).*?$/;
});

// node_modules/abitype/dist/esm/human-readable/formatAbiParameter.js
function formatAbiParameter(abiParameter) {
  let type = abiParameter.type;
  if (tupleRegex.test(abiParameter.type) && "components" in abiParameter) {
    type = "(";
    const length = abiParameter.components.length;
    for (let i = 0;i < length; i++) {
      const component = abiParameter.components[i];
      type += formatAbiParameter(component);
      if (i < length - 1)
        type += ", ";
    }
    const result = execTyped(tupleRegex, abiParameter.type);
    type += `)${result?.array ?? ""}`;
    return formatAbiParameter({
      ...abiParameter,
      type
    });
  }
  if ("indexed" in abiParameter && abiParameter.indexed)
    type = `${type} indexed`;
  if (abiParameter.name)
    return `${type} ${abiParameter.name}`;
  return type;
}
var tupleRegex;
var init_formatAbiParameter = __esm(() => {
  init_regex();
  tupleRegex = /^tuple(?<array>(\[(\d*)\])*)$/;
});

// node_modules/abitype/dist/esm/human-readable/formatAbiParameters.js
function formatAbiParameters(abiParameters) {
  let params = "";
  const length = abiParameters.length;
  for (let i = 0;i < length; i++) {
    const abiParameter = abiParameters[i];
    params += formatAbiParameter(abiParameter);
    if (i !== length - 1)
      params += ", ";
  }
  return params;
}
var init_formatAbiParameters = __esm(() => {
  init_formatAbiParameter();
});

// node_modules/abitype/dist/esm/human-readable/formatAbiItem.js
function formatAbiItem(abiItem) {
  if (abiItem.type === "function")
    return `function ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})${abiItem.stateMutability && abiItem.stateMutability !== "nonpayable" ? ` ${abiItem.stateMutability}` : ""}${abiItem.outputs.length ? ` returns (${formatAbiParameters(abiItem.outputs)})` : ""}`;
  if (abiItem.type === "event")
    return `event ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`;
  if (abiItem.type === "error")
    return `error ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`;
  if (abiItem.type === "constructor")
    return `constructor(${formatAbiParameters(abiItem.inputs)})${abiItem.stateMutability === "payable" ? " payable" : ""}`;
  if (abiItem.type === "fallback")
    return "fallback()";
  return "receive() external payable";
}
var init_formatAbiItem = __esm(() => {
  init_formatAbiParameters();
});

// node_modules/abitype/dist/esm/human-readable/runtime/signatures.js
function isErrorSignature(signature) {
  return errorSignatureRegex.test(signature);
}
function execErrorSignature(signature) {
  return execTyped(errorSignatureRegex, signature);
}
function isEventSignature(signature) {
  return eventSignatureRegex.test(signature);
}
function execEventSignature(signature) {
  return execTyped(eventSignatureRegex, signature);
}
function isFunctionSignature(signature) {
  return functionSignatureRegex.test(signature);
}
function execFunctionSignature(signature) {
  return execTyped(functionSignatureRegex, signature);
}
function isStructSignature(signature) {
  return structSignatureRegex.test(signature);
}
function execStructSignature(signature) {
  return execTyped(structSignatureRegex, signature);
}
function isConstructorSignature(signature) {
  return constructorSignatureRegex.test(signature);
}
function execConstructorSignature(signature) {
  return execTyped(constructorSignatureRegex, signature);
}
function isFallbackSignature(signature) {
  return fallbackSignatureRegex.test(signature);
}
function isReceiveSignature(signature) {
  return receiveSignatureRegex.test(signature);
}
var errorSignatureRegex, eventSignatureRegex, functionSignatureRegex, structSignatureRegex, constructorSignatureRegex, fallbackSignatureRegex, receiveSignatureRegex, modifiers, eventModifiers, functionModifiers;
var init_signatures = __esm(() => {
  init_regex();
  errorSignatureRegex = /^error (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
  eventSignatureRegex = /^event (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
  functionSignatureRegex = /^function (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)(?: (?<scope>external|public{1}))?(?: (?<stateMutability>pure|view|nonpayable|payable{1}))?(?: returns\s?\((?<returns>.*?)\))?$/;
  structSignatureRegex = /^struct (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*) \{(?<properties>.*?)\}$/;
  constructorSignatureRegex = /^constructor\((?<parameters>.*?)\)(?:\s(?<stateMutability>payable{1}))?$/;
  fallbackSignatureRegex = /^fallback\(\) external(?:\s(?<stateMutability>payable{1}))?$/;
  receiveSignatureRegex = /^receive\(\) external payable$/;
  modifiers = new Set([
    "memory",
    "indexed",
    "storage",
    "calldata"
  ]);
  eventModifiers = new Set(["indexed"]);
  functionModifiers = new Set([
    "calldata",
    "memory",
    "storage"
  ]);
});

// node_modules/abitype/dist/esm/human-readable/errors/abiItem.js
class UnknownTypeError extends BaseError {
  constructor({ type }) {
    super("Unknown type.", {
      metaMessages: [
        `Type "${type}" is not a valid ABI type. Perhaps you forgot to include a struct signature?`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "UnknownTypeError"
    });
  }
}

class UnknownSolidityTypeError extends BaseError {
  constructor({ type }) {
    super("Unknown type.", {
      metaMessages: [`Type "${type}" is not a valid ABI type.`]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "UnknownSolidityTypeError"
    });
  }
}
var init_abiItem = __esm(() => {
  init_errors();
});

// node_modules/abitype/dist/esm/human-readable/errors/abiParameter.js
class InvalidParameterError extends BaseError {
  constructor({ param }) {
    super("Invalid ABI parameter.", {
      details: param
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidParameterError"
    });
  }
}

class SolidityProtectedKeywordError extends BaseError {
  constructor({ param, name }) {
    super("Invalid ABI parameter.", {
      details: param,
      metaMessages: [
        `"${name}" is a protected Solidity keyword. More info: https://docs.soliditylang.org/en/latest/cheatsheet.html`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "SolidityProtectedKeywordError"
    });
  }
}

class InvalidModifierError extends BaseError {
  constructor({ param, type, modifier }) {
    super("Invalid ABI parameter.", {
      details: param,
      metaMessages: [
        `Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidModifierError"
    });
  }
}

class InvalidFunctionModifierError extends BaseError {
  constructor({ param, type, modifier }) {
    super("Invalid ABI parameter.", {
      details: param,
      metaMessages: [
        `Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`,
        `Data location can only be specified for array, struct, or mapping types, but "${modifier}" was given.`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidFunctionModifierError"
    });
  }
}

class InvalidAbiTypeParameterError extends BaseError {
  constructor({ abiParameter }) {
    super("Invalid ABI parameter.", {
      details: JSON.stringify(abiParameter, null, 2),
      metaMessages: ["ABI parameter type is invalid."]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidAbiTypeParameterError"
    });
  }
}
var init_abiParameter = __esm(() => {
  init_errors();
});

// node_modules/abitype/dist/esm/human-readable/errors/signature.js
class InvalidSignatureError extends BaseError {
  constructor({ signature, type }) {
    super(`Invalid ${type} signature.`, {
      details: signature
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidSignatureError"
    });
  }
}

class UnknownSignatureError extends BaseError {
  constructor({ signature }) {
    super("Unknown signature.", {
      details: signature
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "UnknownSignatureError"
    });
  }
}

class InvalidStructSignatureError extends BaseError {
  constructor({ signature }) {
    super("Invalid struct signature.", {
      details: signature,
      metaMessages: ["No properties exist."]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidStructSignatureError"
    });
  }
}
var init_signature = __esm(() => {
  init_errors();
});

// node_modules/abitype/dist/esm/human-readable/errors/struct.js
class CircularReferenceError extends BaseError {
  constructor({ type }) {
    super("Circular reference detected.", {
      metaMessages: [`Struct "${type}" is a circular reference.`]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "CircularReferenceError"
    });
  }
}
var init_struct = __esm(() => {
  init_errors();
});

// node_modules/abitype/dist/esm/human-readable/errors/splitParameters.js
class InvalidParenthesisError extends BaseError {
  constructor({ current, depth }) {
    super("Unbalanced parentheses.", {
      metaMessages: [
        `"${current.trim()}" has too many ${depth > 0 ? "opening" : "closing"} parentheses.`
      ],
      details: `Depth "${depth}"`
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidParenthesisError"
    });
  }
}
var init_splitParameters = __esm(() => {
  init_errors();
});

// node_modules/abitype/dist/esm/human-readable/runtime/cache.js
function getParameterCacheKey(param, type) {
  if (type)
    return `${type}:${param}`;
  return param;
}
var parameterCache;
var init_cache = __esm(() => {
  parameterCache = new Map([
    ["address", { type: "address" }],
    ["bool", { type: "bool" }],
    ["bytes", { type: "bytes" }],
    ["bytes32", { type: "bytes32" }],
    ["int", { type: "int256" }],
    ["int256", { type: "int256" }],
    ["string", { type: "string" }],
    ["uint", { type: "uint256" }],
    ["uint8", { type: "uint8" }],
    ["uint16", { type: "uint16" }],
    ["uint24", { type: "uint24" }],
    ["uint32", { type: "uint32" }],
    ["uint64", { type: "uint64" }],
    ["uint96", { type: "uint96" }],
    ["uint112", { type: "uint112" }],
    ["uint160", { type: "uint160" }],
    ["uint192", { type: "uint192" }],
    ["uint256", { type: "uint256" }],
    ["address owner", { type: "address", name: "owner" }],
    ["address to", { type: "address", name: "to" }],
    ["bool approved", { type: "bool", name: "approved" }],
    ["bytes _data", { type: "bytes", name: "_data" }],
    ["bytes data", { type: "bytes", name: "data" }],
    ["bytes signature", { type: "bytes", name: "signature" }],
    ["bytes32 hash", { type: "bytes32", name: "hash" }],
    ["bytes32 r", { type: "bytes32", name: "r" }],
    ["bytes32 root", { type: "bytes32", name: "root" }],
    ["bytes32 s", { type: "bytes32", name: "s" }],
    ["string name", { type: "string", name: "name" }],
    ["string symbol", { type: "string", name: "symbol" }],
    ["string tokenURI", { type: "string", name: "tokenURI" }],
    ["uint tokenId", { type: "uint256", name: "tokenId" }],
    ["uint8 v", { type: "uint8", name: "v" }],
    ["uint256 balance", { type: "uint256", name: "balance" }],
    ["uint256 tokenId", { type: "uint256", name: "tokenId" }],
    ["uint256 value", { type: "uint256", name: "value" }],
    [
      "event:address indexed from",
      { type: "address", name: "from", indexed: true }
    ],
    ["event:address indexed to", { type: "address", name: "to", indexed: true }],
    [
      "event:uint indexed tokenId",
      { type: "uint256", name: "tokenId", indexed: true }
    ],
    [
      "event:uint256 indexed tokenId",
      { type: "uint256", name: "tokenId", indexed: true }
    ]
  ]);
});

// node_modules/abitype/dist/esm/human-readable/runtime/utils.js
function parseSignature(signature2, structs = {}) {
  if (isFunctionSignature(signature2)) {
    const match = execFunctionSignature(signature2);
    if (!match)
      throw new InvalidSignatureError({ signature: signature2, type: "function" });
    const inputParams = splitParameters2(match.parameters);
    const inputs = [];
    const inputLength = inputParams.length;
    for (let i = 0;i < inputLength; i++) {
      inputs.push(parseAbiParameter(inputParams[i], {
        modifiers: functionModifiers,
        structs,
        type: "function"
      }));
    }
    const outputs = [];
    if (match.returns) {
      const outputParams = splitParameters2(match.returns);
      const outputLength = outputParams.length;
      for (let i = 0;i < outputLength; i++) {
        outputs.push(parseAbiParameter(outputParams[i], {
          modifiers: functionModifiers,
          structs,
          type: "function"
        }));
      }
    }
    return {
      name: match.name,
      type: "function",
      stateMutability: match.stateMutability ?? "nonpayable",
      inputs,
      outputs
    };
  }
  if (isEventSignature(signature2)) {
    const match = execEventSignature(signature2);
    if (!match)
      throw new InvalidSignatureError({ signature: signature2, type: "event" });
    const params = splitParameters2(match.parameters);
    const abiParameters = [];
    const length = params.length;
    for (let i = 0;i < length; i++) {
      abiParameters.push(parseAbiParameter(params[i], {
        modifiers: eventModifiers,
        structs,
        type: "event"
      }));
    }
    return { name: match.name, type: "event", inputs: abiParameters };
  }
  if (isErrorSignature(signature2)) {
    const match = execErrorSignature(signature2);
    if (!match)
      throw new InvalidSignatureError({ signature: signature2, type: "error" });
    const params = splitParameters2(match.parameters);
    const abiParameters = [];
    const length = params.length;
    for (let i = 0;i < length; i++) {
      abiParameters.push(parseAbiParameter(params[i], { structs, type: "error" }));
    }
    return { name: match.name, type: "error", inputs: abiParameters };
  }
  if (isConstructorSignature(signature2)) {
    const match = execConstructorSignature(signature2);
    if (!match)
      throw new InvalidSignatureError({ signature: signature2, type: "constructor" });
    const params = splitParameters2(match.parameters);
    const abiParameters = [];
    const length = params.length;
    for (let i = 0;i < length; i++) {
      abiParameters.push(parseAbiParameter(params[i], { structs, type: "constructor" }));
    }
    return {
      type: "constructor",
      stateMutability: match.stateMutability ?? "nonpayable",
      inputs: abiParameters
    };
  }
  if (isFallbackSignature(signature2))
    return { type: "fallback" };
  if (isReceiveSignature(signature2))
    return {
      type: "receive",
      stateMutability: "payable"
    };
  throw new UnknownSignatureError({ signature: signature2 });
}
function parseAbiParameter(param, options) {
  const parameterCacheKey = getParameterCacheKey(param, options?.type);
  if (parameterCache.has(parameterCacheKey))
    return parameterCache.get(parameterCacheKey);
  const isTuple = isTupleRegex.test(param);
  const match = execTyped(isTuple ? abiParameterWithTupleRegex : abiParameterWithoutTupleRegex, param);
  if (!match)
    throw new InvalidParameterError({ param });
  if (match.name && isSolidityKeyword(match.name))
    throw new SolidityProtectedKeywordError({ param, name: match.name });
  const name = match.name ? { name: match.name } : {};
  const indexed = match.modifier === "indexed" ? { indexed: true } : {};
  const structs = options?.structs ?? {};
  let type;
  let components = {};
  if (isTuple) {
    type = "tuple";
    const params = splitParameters2(match.type);
    const components_ = [];
    const length = params.length;
    for (let i = 0;i < length; i++) {
      components_.push(parseAbiParameter(params[i], { structs }));
    }
    components = { components: components_ };
  } else if (match.type in structs) {
    type = "tuple";
    components = { components: structs[match.type] };
  } else if (dynamicIntegerRegex.test(match.type)) {
    type = `${match.type}256`;
  } else {
    type = match.type;
    if (!(options?.type === "struct") && !isSolidityType(type))
      throw new UnknownSolidityTypeError({ type });
  }
  if (match.modifier) {
    if (!options?.modifiers?.has?.(match.modifier))
      throw new InvalidModifierError({
        param,
        type: options?.type,
        modifier: match.modifier
      });
    if (functionModifiers.has(match.modifier) && !isValidDataLocation(type, !!match.array))
      throw new InvalidFunctionModifierError({
        param,
        type: options?.type,
        modifier: match.modifier
      });
  }
  const abiParameter2 = {
    type: `${type}${match.array ?? ""}`,
    ...name,
    ...indexed,
    ...components
  };
  parameterCache.set(parameterCacheKey, abiParameter2);
  return abiParameter2;
}
function splitParameters2(params, result = [], current = "", depth = 0) {
  const length = params.trim().length;
  for (let i = 0;i < length; i++) {
    const char = params[i];
    const tail = params.slice(i + 1);
    switch (char) {
      case ",":
        return depth === 0 ? splitParameters2(tail, [...result, current.trim()]) : splitParameters2(tail, result, `${current}${char}`, depth);
      case "(":
        return splitParameters2(tail, result, `${current}${char}`, depth + 1);
      case ")":
        return splitParameters2(tail, result, `${current}${char}`, depth - 1);
      default:
        return splitParameters2(tail, result, `${current}${char}`, depth);
    }
  }
  if (current === "")
    return result;
  if (depth !== 0)
    throw new InvalidParenthesisError({ current, depth });
  result.push(current.trim());
  return result;
}
function isSolidityType(type) {
  return type === "address" || type === "bool" || type === "function" || type === "string" || bytesRegex.test(type) || integerRegex.test(type);
}
function isSolidityKeyword(name) {
  return name === "address" || name === "bool" || name === "function" || name === "string" || name === "tuple" || bytesRegex.test(name) || integerRegex.test(name) || protectedKeywordsRegex.test(name);
}
function isValidDataLocation(type, isArray) {
  return isArray || type === "bytes" || type === "string" || type === "tuple";
}
var abiParameterWithoutTupleRegex, abiParameterWithTupleRegex, dynamicIntegerRegex, protectedKeywordsRegex;
var init_utils = __esm(() => {
  init_regex();
  init_abiItem();
  init_abiParameter();
  init_signature();
  init_splitParameters();
  init_cache();
  init_signatures();
  abiParameterWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
  abiParameterWithTupleRegex = /^\((?<type>.+?)\)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
  dynamicIntegerRegex = /^u?int$/;
  protectedKeywordsRegex = /^(?:after|alias|anonymous|apply|auto|byte|calldata|case|catch|constant|copyof|default|defined|error|event|external|false|final|function|immutable|implements|in|indexed|inline|internal|let|mapping|match|memory|mutable|null|of|override|partial|private|promise|public|pure|reference|relocatable|return|returns|sizeof|static|storage|struct|super|supports|switch|this|true|try|typedef|typeof|var|view|virtual)$/;
});

// node_modules/abitype/dist/esm/human-readable/runtime/structs.js
function parseStructs(signatures3) {
  const shallowStructs = {};
  const signaturesLength = signatures3.length;
  for (let i = 0;i < signaturesLength; i++) {
    const signature3 = signatures3[i];
    if (!isStructSignature(signature3))
      continue;
    const match = execStructSignature(signature3);
    if (!match)
      throw new InvalidSignatureError({ signature: signature3, type: "struct" });
    const properties = match.properties.split(";");
    const components = [];
    const propertiesLength = properties.length;
    for (let k = 0;k < propertiesLength; k++) {
      const property = properties[k];
      const trimmed = property.trim();
      if (!trimmed)
        continue;
      const abiParameter3 = parseAbiParameter(trimmed, {
        type: "struct"
      });
      components.push(abiParameter3);
    }
    if (!components.length)
      throw new InvalidStructSignatureError({ signature: signature3 });
    shallowStructs[match.name] = components;
  }
  const resolvedStructs = {};
  const entries = Object.entries(shallowStructs);
  const entriesLength = entries.length;
  for (let i = 0;i < entriesLength; i++) {
    const [name, parameters] = entries[i];
    resolvedStructs[name] = resolveStructs(parameters, shallowStructs);
  }
  return resolvedStructs;
}
var resolveStructs, typeWithoutTupleRegex;
var init_structs = __esm(() => {
  init_regex();
  init_abiItem();
  init_abiParameter();
  init_signature();
  init_struct();
  init_signatures();
  init_utils();
  resolveStructs = function(abiParameters, structs, ancestors = new Set) {
    const components = [];
    const length = abiParameters.length;
    for (let i = 0;i < length; i++) {
      const abiParameter3 = abiParameters[i];
      const isTuple = isTupleRegex.test(abiParameter3.type);
      if (isTuple)
        components.push(abiParameter3);
      else {
        const match = execTyped(typeWithoutTupleRegex, abiParameter3.type);
        if (!match?.type)
          throw new InvalidAbiTypeParameterError({ abiParameter: abiParameter3 });
        const { array, type } = match;
        if (type in structs) {
          if (ancestors.has(type))
            throw new CircularReferenceError({ type });
          components.push({
            ...abiParameter3,
            type: `tuple${array ?? ""}`,
            components: resolveStructs(structs[type] ?? [], structs, new Set([...ancestors, type]))
          });
        } else {
          if (isSolidityType(type))
            components.push(abiParameter3);
          else
            throw new UnknownTypeError({ type });
        }
      }
    }
    return components;
  };
  typeWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?$/;
});

// node_modules/abitype/dist/esm/human-readable/parseAbi.js
function parseAbi(signatures4) {
  const structs2 = parseStructs(signatures4);
  const abi = [];
  const length = signatures4.length;
  for (let i = 0;i < length; i++) {
    const signature3 = signatures4[i];
    if (isStructSignature(signature3))
      continue;
    abi.push(parseSignature(signature3, structs2));
  }
  return abi;
}
var init_parseAbi = __esm(() => {
  init_signatures();
  init_structs();
  init_utils();
});

// node_modules/abitype/dist/esm/exports/index.js
var init_exports = __esm(() => {
  init_formatAbiItem();
  init_parseAbi();
});

// node_modules/viem/_esm/utils/abi/formatAbiItem.js
function formatAbiItem2(abiItem3, { includeName = false } = {}) {
  if (abiItem3.type !== "function" && abiItem3.type !== "event" && abiItem3.type !== "error")
    throw new InvalidDefinitionTypeError(abiItem3.type);
  return `${abiItem3.name}(${formatAbiParams(abiItem3.inputs, { includeName })})`;
}
function formatAbiParams(params, { includeName = false } = {}) {
  if (!params)
    return "";
  return params.map((param) => formatAbiParam(param, { includeName })).join(includeName ? ", " : ",");
}
var formatAbiParam;
var init_formatAbiItem2 = __esm(() => {
  init_abi();
  formatAbiParam = function(param, { includeName }) {
    if (param.type.startsWith("tuple")) {
      return `(${formatAbiParams(param.components, { includeName })})${param.type.slice("tuple".length)}`;
    }
    return param.type + (includeName && param.name ? ` ${param.name}` : "");
  };
});

// node_modules/viem/_esm/utils/data/isHex.js
function isHex(value, { strict = true } = {}) {
  if (!value)
    return false;
  if (typeof value !== "string")
    return false;
  return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith("0x");
}
var init_isHex = __esm(() => {
});

// node_modules/viem/_esm/utils/data/size.js
function size(value) {
  if (isHex(value, { strict: false }))
    return Math.ceil((value.length - 2) / 2);
  return value.length;
}
var init_size = __esm(() => {
  init_isHex();
});

// node_modules/viem/_esm/errors/version.js
var version3;
var init_version2 = __esm(() => {
  version3 = "2.19.2";
});

// node_modules/viem/_esm/errors/base.js
class BaseError2 extends Error {
  constructor(shortMessage, args = {}) {
    const details = (() => {
      if (args.cause instanceof BaseError2)
        return args.cause.details;
      if (args.cause?.message)
        return args.cause.message;
      return args.details;
    })();
    const docsPath = (() => {
      if (args.cause instanceof BaseError2)
        return args.cause.docsPath || args.docsPath;
      return args.docsPath;
    })();
    const docsUrl = errorConfig.getDocsUrl?.({ ...args, docsPath });
    const message = [
      shortMessage || "An error occurred.",
      "",
      ...args.metaMessages ? [...args.metaMessages, ""] : [],
      ...docsUrl ? [`Docs: ${docsUrl}`] : [],
      ...details ? [`Details: ${details}`] : [],
      ...errorConfig.version ? [`Version: ${errorConfig.version}`] : []
    ].join("\n");
    super(message, args.cause ? { cause: args.cause } : undefined);
    Object.defineProperty(this, "details", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "docsPath", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "metaMessages", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "shortMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "version", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "BaseError"
    });
    this.details = details;
    this.docsPath = docsPath;
    this.metaMessages = args.metaMessages;
    this.name = args.name ?? this.name;
    this.shortMessage = shortMessage;
    this.version = version3;
  }
  walk(fn) {
    return walk(this, fn);
  }
}
var walk, errorConfig;
var init_base = __esm(() => {
  init_version2();
  walk = function(err, fn) {
    if (fn?.(err))
      return err;
    if (err && typeof err === "object" && "cause" in err)
      return walk(err.cause, fn);
    return fn ? null : err;
  };
  errorConfig = {
    getDocsUrl: ({ docsBaseUrl, docsPath = "", docsSlug }) => docsPath ? `${docsBaseUrl ?? "https://viem.sh"}${docsPath}${docsSlug ? `#${docsSlug}` : ""}` : undefined,
    version: version3
  };
});

// node_modules/viem/_esm/errors/abi.js
class AbiConstructorNotFoundError extends BaseError2 {
  constructor({ docsPath }) {
    super([
      "A constructor was not found on the ABI.",
      "Make sure you are using the correct ABI and that the constructor exists on it."
    ].join("\n"), {
      docsPath,
      name: "AbiConstructorNotFoundError"
    });
  }
}

class AbiConstructorParamsNotFoundError extends BaseError2 {
  constructor({ docsPath }) {
    super([
      "Constructor arguments were provided (`args`), but a constructor parameters (`inputs`) were not found on the ABI.",
      "Make sure you are using the correct ABI, and that the `inputs` attribute on the constructor exists."
    ].join("\n"), {
      docsPath,
      name: "AbiConstructorParamsNotFoundError"
    });
  }
}

class AbiDecodingDataSizeTooSmallError extends BaseError2 {
  constructor({ data, params, size: size3 }) {
    super([`Data size of ${size3} bytes is too small for given parameters.`].join("\n"), {
      metaMessages: [
        `Params: (${formatAbiParams(params, { includeName: true })})`,
        `Data:   ${data} (${size3} bytes)`
      ],
      name: "AbiDecodingDataSizeTooSmallError"
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "params", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "size", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    this.data = data;
    this.params = params;
    this.size = size3;
  }
}

class AbiDecodingZeroDataError extends BaseError2 {
  constructor() {
    super('Cannot decode zero data ("0x") with ABI parameters.', {
      name: "AbiDecodingZeroDataError"
    });
  }
}

class AbiEncodingArrayLengthMismatchError extends BaseError2 {
  constructor({ expectedLength, givenLength, type }) {
    super([
      `ABI encoding array length mismatch for type ${type}.`,
      `Expected length: ${expectedLength}`,
      `Given length: ${givenLength}`
    ].join("\n"), { name: "AbiEncodingArrayLengthMismatchError" });
  }
}

class AbiEncodingBytesSizeMismatchError extends BaseError2 {
  constructor({ expectedSize, value }) {
    super(`Size of bytes "${value}" (bytes${size(value)}) does not match expected size (bytes${expectedSize}).`, { name: "AbiEncodingBytesSizeMismatchError" });
  }
}

class AbiEncodingLengthMismatchError extends BaseError2 {
  constructor({ expectedLength, givenLength }) {
    super([
      "ABI encoding params/values length mismatch.",
      `Expected length (params): ${expectedLength}`,
      `Given length (values): ${givenLength}`
    ].join("\n"), { name: "AbiEncodingLengthMismatchError" });
  }
}

class AbiErrorSignatureNotFoundError extends BaseError2 {
  constructor(signature3, { docsPath }) {
    super([
      `Encoded error signature "${signature3}" not found on ABI.`,
      "Make sure you are using the correct ABI and that the error exists on it.",
      `You can look up the decoded signature here: https://openchain.xyz/signatures?query=${signature3}.`
    ].join("\n"), {
      docsPath,
      name: "AbiErrorSignatureNotFoundError"
    });
    Object.defineProperty(this, "signature", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    this.signature = signature3;
  }
}

class AbiEventSignatureEmptyTopicsError extends BaseError2 {
  constructor({ docsPath }) {
    super("Cannot extract event signature from empty topics.", {
      docsPath,
      name: "AbiEventSignatureEmptyTopicsError"
    });
  }
}

class AbiEventSignatureNotFoundError extends BaseError2 {
  constructor(signature3, { docsPath }) {
    super([
      `Encoded event signature "${signature3}" not found on ABI.`,
      "Make sure you are using the correct ABI and that the event exists on it.",
      `You can look up the signature here: https://openchain.xyz/signatures?query=${signature3}.`
    ].join("\n"), {
      docsPath,
      name: "AbiEventSignatureNotFoundError"
    });
  }
}

class AbiEventNotFoundError extends BaseError2 {
  constructor(eventName, { docsPath } = {}) {
    super([
      `Event ${eventName ? `"${eventName}" ` : ""}not found on ABI.`,
      "Make sure you are using the correct ABI and that the event exists on it."
    ].join("\n"), {
      docsPath,
      name: "AbiEventNotFoundError"
    });
  }
}

class AbiFunctionNotFoundError extends BaseError2 {
  constructor(functionName, { docsPath } = {}) {
    super([
      `Function ${functionName ? `"${functionName}" ` : ""}not found on ABI.`,
      "Make sure you are using the correct ABI and that the function exists on it."
    ].join("\n"), {
      docsPath,
      name: "AbiFunctionNotFoundError"
    });
  }
}

class AbiFunctionOutputsNotFoundError extends BaseError2 {
  constructor(functionName, { docsPath }) {
    super([
      `Function "${functionName}" does not contain any \`outputs\` on ABI.`,
      "Cannot decode function result without knowing what the parameter types are.",
      "Make sure you are using the correct ABI and that the function exists on it."
    ].join("\n"), {
      docsPath,
      name: "AbiFunctionOutputsNotFoundError"
    });
  }
}

class AbiItemAmbiguityError extends BaseError2 {
  constructor(x, y) {
    super("Found ambiguous types in overloaded ABI items.", {
      metaMessages: [
        `\`${x.type}\` in \`${formatAbiItem2(x.abiItem)}\`, and`,
        `\`${y.type}\` in \`${formatAbiItem2(y.abiItem)}\``,
        "",
        "These types encode differently and cannot be distinguished at runtime.",
        "Remove one of the ambiguous items in the ABI."
      ],
      name: "AbiItemAmbiguityError"
    });
  }
}

class BytesSizeMismatchError extends BaseError2 {
  constructor({ expectedSize, givenSize }) {
    super(`Expected bytes${expectedSize}, got bytes${givenSize}.`, {
      name: "BytesSizeMismatchError"
    });
  }
}

class DecodeLogDataMismatch extends BaseError2 {
  constructor({ abiItem: abiItem3, data, params, size: size3 }) {
    super([
      `Data size of ${size3} bytes is too small for non-indexed event parameters.`
    ].join("\n"), {
      metaMessages: [
        `Params: (${formatAbiParams(params, { includeName: true })})`,
        `Data:   ${data} (${size3} bytes)`
      ],
      name: "DecodeLogDataMismatch"
    });
    Object.defineProperty(this, "abiItem", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "params", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "size", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    this.abiItem = abiItem3;
    this.data = data;
    this.params = params;
    this.size = size3;
  }
}

class DecodeLogTopicsMismatch extends BaseError2 {
  constructor({ abiItem: abiItem3, param }) {
    super([
      `Expected a topic for indexed event parameter${param.name ? ` "${param.name}"` : ""} on event "${formatAbiItem2(abiItem3, { includeName: true })}".`
    ].join("\n"), { name: "DecodeLogTopicsMismatch" });
    Object.defineProperty(this, "abiItem", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    this.abiItem = abiItem3;
  }
}

class InvalidAbiEncodingTypeError extends BaseError2 {
  constructor(type, { docsPath }) {
    super([
      `Type "${type}" is not a valid encoding type.`,
      "Please provide a valid ABI type."
    ].join("\n"), { docsPath, name: "InvalidAbiEncodingType" });
  }
}

class InvalidAbiDecodingTypeError extends BaseError2 {
  constructor(type, { docsPath }) {
    super([
      `Type "${type}" is not a valid decoding type.`,
      "Please provide a valid ABI type."
    ].join("\n"), { docsPath, name: "InvalidAbiDecodingType" });
  }
}

class InvalidArrayError extends BaseError2 {
  constructor(value) {
    super([`Value "${value}" is not a valid array.`].join("\n"), {
      name: "InvalidArrayError"
    });
  }
}

class InvalidDefinitionTypeError extends BaseError2 {
  constructor(type) {
    super([
      `"${type}" is not a valid definition type.`,
      'Valid types: "function", "event", "error"'
    ].join("\n"), { name: "InvalidDefinitionTypeError" });
  }
}
var init_abi = __esm(() => {
  init_formatAbiItem2();
  init_size();
  init_base();
});

// node_modules/viem/_esm/errors/data.js
class SliceOffsetOutOfBoundsError extends BaseError2 {
  constructor({ offset, position, size: size3 }) {
    super(`Slice ${position === "start" ? "starting" : "ending"} at offset "${offset}" is out-of-bounds (size: ${size3}).`, { name: "SliceOffsetOutOfBoundsError" });
  }
}

class SizeExceedsPaddingSizeError extends BaseError2 {
  constructor({ size: size3, targetSize, type }) {
    super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (${size3}) exceeds padding size (${targetSize}).`, { name: "SizeExceedsPaddingSizeError" });
  }
}

class InvalidBytesLengthError extends BaseError2 {
  constructor({ size: size3, targetSize, type }) {
    super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} is expected to be ${targetSize} ${type} long, but is ${size3} ${type} long.`, { name: "InvalidBytesLengthError" });
  }
}
var init_data = __esm(() => {
  init_base();
});

// node_modules/viem/_esm/utils/data/pad.js
function pad(hexOrBytes, { dir, size: size3 = 32 } = {}) {
  if (typeof hexOrBytes === "string")
    return padHex(hexOrBytes, { dir, size: size3 });
  return padBytes(hexOrBytes, { dir, size: size3 });
}
function padHex(hex_, { dir, size: size3 = 32 } = {}) {
  if (size3 === null)
    return hex_;
  const hex = hex_.replace("0x", "");
  if (hex.length > size3 * 2)
    throw new SizeExceedsPaddingSizeError({
      size: Math.ceil(hex.length / 2),
      targetSize: size3,
      type: "hex"
    });
  return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size3 * 2, "0")}`;
}
function padBytes(bytes, { dir, size: size3 = 32 } = {}) {
  if (size3 === null)
    return bytes;
  if (bytes.length > size3)
    throw new SizeExceedsPaddingSizeError({
      size: bytes.length,
      targetSize: size3,
      type: "bytes"
    });
  const paddedBytes = new Uint8Array(size3);
  for (let i = 0;i < size3; i++) {
    const padEnd = dir === "right";
    paddedBytes[padEnd ? i : size3 - i - 1] = bytes[padEnd ? i : bytes.length - i - 1];
  }
  return paddedBytes;
}
var init_pad = __esm(() => {
  init_data();
});

// node_modules/viem/_esm/errors/encoding.js
class IntegerOutOfRangeError extends BaseError2 {
  constructor({ max, min, signed, size: size3, value }) {
    super(`Number "${value}" is not in safe ${size3 ? `${size3 * 8}-bit ${signed ? "signed" : "unsigned"} ` : ""}integer range ${max ? `(${min} to ${max})` : `(above ${min})`}`, { name: "IntegerOutOfRangeError" });
  }
}

class InvalidBytesBooleanError extends BaseError2 {
  constructor(bytes) {
    super(`Bytes value "${bytes}" is not a valid boolean. The bytes array must contain a single byte of either a 0 or 1 value.`, {
      name: "InvalidBytesBooleanError"
    });
  }
}

class SizeOverflowError extends BaseError2 {
  constructor({ givenSize, maxSize }) {
    super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`, { name: "SizeOverflowError" });
  }
}
var init_encoding = __esm(() => {
  init_base();
});

// node_modules/viem/_esm/utils/data/trim.js
function trim(hexOrBytes, { dir = "left" } = {}) {
  let data2 = typeof hexOrBytes === "string" ? hexOrBytes.replace("0x", "") : hexOrBytes;
  let sliceLength = 0;
  for (let i = 0;i < data2.length - 1; i++) {
    if (data2[dir === "left" ? i : data2.length - i - 1].toString() === "0")
      sliceLength++;
    else
      break;
  }
  data2 = dir === "left" ? data2.slice(sliceLength) : data2.slice(0, data2.length - sliceLength);
  if (typeof hexOrBytes === "string") {
    if (data2.length === 1 && dir === "right")
      data2 = `${data2}0`;
    return `0x${data2.length % 2 === 1 ? `0${data2}` : data2}`;
  }
  return data2;
}
var init_trim = __esm(() => {
});

// node_modules/viem/_esm/utils/encoding/fromHex.js
function assertSize(hexOrBytes, { size: size4 }) {
  if (size(hexOrBytes) > size4)
    throw new SizeOverflowError({
      givenSize: size(hexOrBytes),
      maxSize: size4
    });
}
function hexToBigInt(hex, opts = {}) {
  const { signed } = opts;
  if (opts.size)
    assertSize(hex, { size: opts.size });
  const value = BigInt(hex);
  if (!signed)
    return value;
  const size4 = (hex.length - 2) / 2;
  const max = (1n << BigInt(size4) * 8n - 1n) - 1n;
  if (value <= max)
    return value;
  return value - BigInt(`0x${"f".padStart(size4 * 2, "f")}`) - 1n;
}
function hexToNumber(hex, opts = {}) {
  return Number(hexToBigInt(hex, opts));
}
var init_fromHex = __esm(() => {
  init_encoding();
  init_size();
});

// node_modules/viem/_esm/utils/encoding/toHex.js
function toHex(value, opts = {}) {
  if (typeof value === "number" || typeof value === "bigint")
    return numberToHex(value, opts);
  if (typeof value === "string") {
    return stringToHex(value, opts);
  }
  if (typeof value === "boolean")
    return boolToHex(value, opts);
  return bytesToHex(value, opts);
}
function boolToHex(value, opts = {}) {
  const hex = `0x${Number(value)}`;
  if (typeof opts.size === "number") {
    assertSize(hex, { size: opts.size });
    return pad(hex, { size: opts.size });
  }
  return hex;
}
function bytesToHex(value, opts = {}) {
  let string = "";
  for (let i = 0;i < value.length; i++) {
    string += hexes[value[i]];
  }
  const hex = `0x${string}`;
  if (typeof opts.size === "number") {
    assertSize(hex, { size: opts.size });
    return pad(hex, { dir: "right", size: opts.size });
  }
  return hex;
}
function numberToHex(value_, opts = {}) {
  const { signed, size: size4 } = opts;
  const value = BigInt(value_);
  let maxValue;
  if (size4) {
    if (signed)
      maxValue = (1n << BigInt(size4) * 8n - 1n) - 1n;
    else
      maxValue = 2n ** (BigInt(size4) * 8n) - 1n;
  } else if (typeof value_ === "number") {
    maxValue = BigInt(Number.MAX_SAFE_INTEGER);
  }
  const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
  if (maxValue && value > maxValue || value < minValue) {
    const suffix = typeof value_ === "bigint" ? "n" : "";
    throw new IntegerOutOfRangeError({
      max: maxValue ? `${maxValue}${suffix}` : undefined,
      min: `${minValue}${suffix}`,
      signed,
      size: size4,
      value: `${value_}${suffix}`
    });
  }
  const hex = `0x${(signed && value < 0 ? (1n << BigInt(size4 * 8)) + BigInt(value) : value).toString(16)}`;
  if (size4)
    return pad(hex, { size: size4 });
  return hex;
}
function stringToHex(value_, opts = {}) {
  const value = encoder.encode(value_);
  return bytesToHex(value, opts);
}
var hexes, encoder;
var init_toHex = __esm(() => {
  init_encoding();
  init_pad();
  init_fromHex();
  hexes = Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, "0"));
  encoder = new TextEncoder;
});

// node_modules/viem/_esm/utils/encoding/toBytes.js
function toBytes(value, opts = {}) {
  if (typeof value === "number" || typeof value === "bigint")
    return numberToBytes(value, opts);
  if (typeof value === "boolean")
    return boolToBytes(value, opts);
  if (isHex(value))
    return hexToBytes(value, opts);
  return stringToBytes(value, opts);
}
function boolToBytes(value, opts = {}) {
  const bytes = new Uint8Array(1);
  bytes[0] = Number(value);
  if (typeof opts.size === "number") {
    assertSize(bytes, { size: opts.size });
    return pad(bytes, { size: opts.size });
  }
  return bytes;
}
function hexToBytes(hex_, opts = {}) {
  let hex = hex_;
  if (opts.size) {
    assertSize(hex, { size: opts.size });
    hex = pad(hex, { dir: "right", size: opts.size });
  }
  let hexString = hex.slice(2);
  if (hexString.length % 2)
    hexString = `0${hexString}`;
  const length = hexString.length / 2;
  const bytes = new Uint8Array(length);
  for (let index = 0, j = 0;index < length; index++) {
    const nibbleLeft = charCodeToBase16(hexString.charCodeAt(j++));
    const nibbleRight = charCodeToBase16(hexString.charCodeAt(j++));
    if (nibbleLeft === undefined || nibbleRight === undefined) {
      throw new BaseError2(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
    }
    bytes[index] = nibbleLeft * 16 + nibbleRight;
  }
  return bytes;
}
function numberToBytes(value, opts) {
  const hex = numberToHex(value, opts);
  return hexToBytes(hex);
}
function stringToBytes(value, opts = {}) {
  const bytes = encoder2.encode(value);
  if (typeof opts.size === "number") {
    assertSize(bytes, { size: opts.size });
    return pad(bytes, { dir: "right", size: opts.size });
  }
  return bytes;
}
var charCodeToBase16, encoder2, charCodeMap;
var init_toBytes = __esm(() => {
  init_base();
  init_isHex();
  init_pad();
  init_fromHex();
  init_toHex();
  charCodeToBase16 = function(char) {
    if (char >= charCodeMap.zero && char <= charCodeMap.nine)
      return char - charCodeMap.zero;
    if (char >= charCodeMap.A && char <= charCodeMap.F)
      return char - (charCodeMap.A - 10);
    if (char >= charCodeMap.a && char <= charCodeMap.f)
      return char - (charCodeMap.a - 10);
    return;
  };
  encoder2 = new TextEncoder;
  charCodeMap = {
    zero: 48,
    nine: 57,
    A: 65,
    F: 70,
    a: 97,
    f: 102
  };
});

// node_modules/@noble/hashes/esm/_assert.js
function isBytes(a) {
  return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
}
var number, bytes, hash, exists, output;
var init__assert = __esm(() => {
  number = function(n) {
    if (!Number.isSafeInteger(n) || n < 0)
      throw new Error(`positive integer expected, not ${n}`);
  };
  bytes = function(b, ...lengths) {
    if (!isBytes(b))
      throw new Error("Uint8Array expected");
    if (lengths.length > 0 && !lengths.includes(b.length))
      throw new Error(`Uint8Array expected of length ${lengths}, not of length=${b.length}`);
  };
  hash = function(h) {
    if (typeof h !== "function" || typeof h.create !== "function")
      throw new Error("Hash should be wrapped by utils.wrapConstructor");
    number(h.outputLen);
    number(h.blockLen);
  };
  exists = function(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (checkFinished && instance.finished)
      throw new Error("Hash#digest() has already been called");
  };
  output = function(out, instance) {
    bytes(out);
    const min = instance.outputLen;
    if (out.length < min) {
      throw new Error(`digestInto() expects output buffer of length at least ${min}`);
    }
  };
});

// node_modules/@noble/hashes/esm/_u64.js
var fromBig, split, U32_MASK64, _32n, rotlSH, rotlSL, rotlBH, rotlBL;
var init__u64 = __esm(() => {
  fromBig = function(n, le = false) {
    if (le)
      return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
    return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
  };
  split = function(lst, le = false) {
    let Ah = new Uint32Array(lst.length);
    let Al = new Uint32Array(lst.length);
    for (let i = 0;i < lst.length; i++) {
      const { h, l } = fromBig(lst[i], le);
      [Ah[i], Al[i]] = [h, l];
    }
    return [Ah, Al];
  };
  U32_MASK64 = BigInt(2 ** 32 - 1);
  _32n = BigInt(32);
  rotlSH = (h, l, s) => h << s | l >>> 32 - s;
  rotlSL = (h, l, s) => l << s | h >>> 32 - s;
  rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
  rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
});

// node_modules/@noble/hashes/esm/cryptoNode.js
import * as nc from "crypto";
var crypto;
var init_cryptoNode = __esm(() => {
  crypto = nc && typeof nc === "object" && "webcrypto" in nc ? nc.webcrypto : undefined;
});

// node_modules/@noble/hashes/esm/utils.js
function byteSwap32(arr) {
  for (let i = 0;i < arr.length; i++) {
    arr[i] = byteSwap(arr[i]);
  }
}
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes2(data2) {
  if (typeof data2 === "string")
    data2 = utf8ToBytes(data2);
  bytes(data2);
  return data2;
}
function concatBytes(...arrays) {
  let sum = 0;
  for (let i = 0;i < arrays.length; i++) {
    const a = arrays[i];
    bytes(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad4 = 0;i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad4);
    pad4 += a.length;
  }
  return res;
}
function wrapConstructor(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes2(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
function wrapXOFConstructorWithOpts(hashCons) {
  const hashC = (msg, opts) => hashCons(opts).update(toBytes2(msg)).digest();
  const tmp = hashCons({});
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = (opts) => hashCons(opts);
  return hashC;
}
function randomBytes(bytesLength = 32) {
  if (crypto && typeof crypto.getRandomValues === "function") {
    return crypto.getRandomValues(new Uint8Array(bytesLength));
  }
  throw new Error("crypto.getRandomValues must be defined");
}

class Hash {
  clone() {
    return this._cloneInto();
  }
}
var u32, createView, rotr, isLE, byteSwap, toStr;
var init_utils2 = __esm(() => {
  init_cryptoNode();
  init__assert();
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  u32 = (arr) => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
  createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
  rotr = (word, shift) => word << 32 - shift | word >>> shift;
  isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  byteSwap = (word) => word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
  toStr = {}.toString;
});

// node_modules/@noble/hashes/esm/sha3.js
function keccakP(s, rounds = 24) {
  const B = new Uint32Array(5 * 2);
  for (let round = 24 - rounds;round < 24; round++) {
    for (let x = 0;x < 10; x++)
      B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
    for (let x = 0;x < 10; x += 2) {
      const idx1 = (x + 8) % 10;
      const idx0 = (x + 2) % 10;
      const B0 = B[idx0];
      const B1 = B[idx0 + 1];
      const Th = rotlH(B0, B1, 1) ^ B[idx1];
      const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
      for (let y = 0;y < 50; y += 10) {
        s[x + y] ^= Th;
        s[x + y + 1] ^= Tl;
      }
    }
    let curH = s[2];
    let curL = s[3];
    for (let t = 0;t < 24; t++) {
      const shift = SHA3_ROTL[t];
      const Th = rotlH(curH, curL, shift);
      const Tl = rotlL(curH, curL, shift);
      const PI = SHA3_PI[t];
      curH = s[PI];
      curL = s[PI + 1];
      s[PI] = Th;
      s[PI + 1] = Tl;
    }
    for (let y = 0;y < 50; y += 10) {
      for (let x = 0;x < 10; x++)
        B[x] = s[y + x];
      for (let x = 0;x < 10; x++)
        s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
    }
    s[0] ^= SHA3_IOTA_H[round];
    s[1] ^= SHA3_IOTA_L[round];
  }
  B.fill(0);
}

class Keccak extends Hash {
  constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
    super();
    this.blockLen = blockLen;
    this.suffix = suffix;
    this.outputLen = outputLen;
    this.enableXOF = enableXOF;
    this.rounds = rounds;
    this.pos = 0;
    this.posOut = 0;
    this.finished = false;
    this.destroyed = false;
    number(outputLen);
    if (0 >= this.blockLen || this.blockLen >= 200)
      throw new Error("Sha3 supports only keccak-f1600 function");
    this.state = new Uint8Array(200);
    this.state32 = u32(this.state);
  }
  keccak() {
    if (!isLE)
      byteSwap32(this.state32);
    keccakP(this.state32, this.rounds);
    if (!isLE)
      byteSwap32(this.state32);
    this.posOut = 0;
    this.pos = 0;
  }
  update(data2) {
    exists(this);
    const { blockLen, state } = this;
    data2 = toBytes2(data2);
    const len = data2.length;
    for (let pos = 0;pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      for (let i = 0;i < take; i++)
        state[this.pos++] ^= data2[pos++];
      if (this.pos === blockLen)
        this.keccak();
    }
    return this;
  }
  finish() {
    if (this.finished)
      return;
    this.finished = true;
    const { state, suffix, pos, blockLen } = this;
    state[pos] ^= suffix;
    if ((suffix & 128) !== 0 && pos === blockLen - 1)
      this.keccak();
    state[blockLen - 1] ^= 128;
    this.keccak();
  }
  writeInto(out) {
    exists(this, false);
    bytes(out);
    this.finish();
    const bufferOut = this.state;
    const { blockLen } = this;
    for (let pos = 0, len = out.length;pos < len; ) {
      if (this.posOut >= blockLen)
        this.keccak();
      const take = Math.min(blockLen - this.posOut, len - pos);
      out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
      this.posOut += take;
      pos += take;
    }
    return out;
  }
  xofInto(out) {
    if (!this.enableXOF)
      throw new Error("XOF is not possible for this instance");
    return this.writeInto(out);
  }
  xof(bytes2) {
    number(bytes2);
    return this.xofInto(new Uint8Array(bytes2));
  }
  digestInto(out) {
    output(out, this);
    if (this.finished)
      throw new Error("digest() was already called");
    this.writeInto(out);
    this.destroy();
    return out;
  }
  digest() {
    return this.digestInto(new Uint8Array(this.outputLen));
  }
  destroy() {
    this.destroyed = true;
    this.state.fill(0);
  }
  _cloneInto(to) {
    const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
    to || (to = new Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
    to.state32.set(this.state32);
    to.pos = this.pos;
    to.posOut = this.posOut;
    to.finished = this.finished;
    to.rounds = rounds;
    to.suffix = suffix;
    to.outputLen = outputLen;
    to.enableXOF = enableXOF;
    to.destroyed = this.destroyed;
    return to;
  }
}
var SHA3_PI, SHA3_ROTL, _SHA3_IOTA, _0n, _1n, _2n, _7n, _256n, _0x71n, SHA3_IOTA_H, SHA3_IOTA_L, rotlH, rotlL, gen, sha3_224, sha3_256, sha3_384, sha3_512, keccak_224, keccak_256, keccak_384, keccak_512, genShake, shake128, shake256;
var init_sha3 = __esm(() => {
  init__assert();
  init__u64();
  init_utils2();
  SHA3_PI = [];
  SHA3_ROTL = [];
  _SHA3_IOTA = [];
  _0n = BigInt(0);
  _1n = BigInt(1);
  _2n = BigInt(2);
  _7n = BigInt(7);
  _256n = BigInt(256);
  _0x71n = BigInt(113);
  for (let round = 0, R = _1n, x = 1, y = 0;round < 24; round++) {
    [x, y] = [y, (2 * x + 3 * y) % 5];
    SHA3_PI.push(2 * (5 * y + x));
    SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
    let t = _0n;
    for (let j = 0;j < 7; j++) {
      R = (R << _1n ^ (R >> _7n) * _0x71n) % _256n;
      if (R & _2n)
        t ^= _1n << (_1n << BigInt(j)) - _1n;
    }
    _SHA3_IOTA.push(t);
  }
  [SHA3_IOTA_H, SHA3_IOTA_L] = split(_SHA3_IOTA, true);
  rotlH = (h, l, s) => s > 32 ? rotlBH(h, l, s) : rotlSH(h, l, s);
  rotlL = (h, l, s) => s > 32 ? rotlBL(h, l, s) : rotlSL(h, l, s);
  gen = (suffix, blockLen, outputLen) => wrapConstructor(() => new Keccak(blockLen, suffix, outputLen));
  sha3_224 = gen(6, 144, 224 / 8);
  sha3_256 = gen(6, 136, 256 / 8);
  sha3_384 = gen(6, 104, 384 / 8);
  sha3_512 = gen(6, 72, 512 / 8);
  keccak_224 = gen(1, 144, 224 / 8);
  keccak_256 = gen(1, 136, 256 / 8);
  keccak_384 = gen(1, 104, 384 / 8);
  keccak_512 = gen(1, 72, 512 / 8);
  genShake = (suffix, blockLen, outputLen) => wrapXOFConstructorWithOpts((opts = {}) => new Keccak(blockLen, suffix, opts.dkLen === undefined ? outputLen : opts.dkLen, true));
  shake128 = genShake(31, 168, 128 / 8);
  shake256 = genShake(31, 136, 256 / 8);
});

// node_modules/viem/_esm/utils/hash/keccak256.js
function keccak256(value, to_) {
  const to = to_ || "hex";
  const bytes2 = keccak_256(isHex(value, { strict: false }) ? toBytes(value) : value);
  if (to === "bytes")
    return bytes2;
  return toHex(bytes2);
}
var init_keccak256 = __esm(() => {
  init_sha3();
  init_isHex();
  init_toBytes();
  init_toHex();
});

// node_modules/viem/_esm/utils/hash/hashSignature.js
function hashSignature(sig) {
  return hash2(sig);
}
var hash2;
var init_hashSignature = __esm(() => {
  init_toBytes();
  init_keccak256();
  hash2 = (value) => keccak256(toBytes(value));
});

// node_modules/viem/_esm/utils/hash/normalizeSignature.js
function normalizeSignature(signature3) {
  let active = true;
  let current = "";
  let level = 0;
  let result = "";
  let valid = false;
  for (let i = 0;i < signature3.length; i++) {
    const char = signature3[i];
    if (["(", ")", ","].includes(char))
      active = true;
    if (char === "(")
      level++;
    if (char === ")")
      level--;
    if (!active)
      continue;
    if (level === 0) {
      if (char === " " && ["event", "function", ""].includes(result))
        result = "";
      else {
        result += char;
        if (char === ")") {
          valid = true;
          break;
        }
      }
      continue;
    }
    if (char === " ") {
      if (signature3[i - 1] !== "," && current !== "," && current !== ",(") {
        current = "";
        active = false;
      }
      continue;
    }
    result += char;
    current += char;
  }
  if (!valid)
    throw new BaseError2("Unable to normalize signature.");
  return result;
}
var init_normalizeSignature = __esm(() => {
  init_base();
});

// node_modules/viem/_esm/utils/hash/toSignature.js
var toSignature;
var init_toSignature = __esm(() => {
  init_exports();
  init_normalizeSignature();
  toSignature = (def) => {
    const def_ = (() => {
      if (typeof def === "string")
        return def;
      return formatAbiItem(def);
    })();
    return normalizeSignature(def_);
  };
});

// node_modules/viem/_esm/utils/hash/toSignatureHash.js
function toSignatureHash(fn) {
  return hashSignature(toSignature(fn));
}
var init_toSignatureHash = __esm(() => {
  init_hashSignature();
  init_toSignature();
});

// node_modules/viem/_esm/utils/hash/toEventSelector.js
var toEventSelector;
var init_toEventSelector = __esm(() => {
  init_toSignatureHash();
  toEventSelector = toSignatureHash;
});

// node_modules/viem/_esm/errors/address.js
class InvalidAddressError extends BaseError2 {
  constructor({ address }) {
    super(`Address "${address}" is invalid.`, {
      metaMessages: [
        "- Address must be a hex value of 20 bytes (40 hex characters).",
        "- Address must match its checksum counterpart."
      ],
      name: "InvalidAddressError"
    });
  }
}
var init_address = __esm(() => {
  init_base();
});

// node_modules/viem/_esm/utils/lru.js
class LruMap extends Map {
  constructor(size4) {
    super();
    Object.defineProperty(this, "maxSize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    this.maxSize = size4;
  }
  set(key, value) {
    super.set(key, value);
    if (this.maxSize && this.size > this.maxSize)
      this.delete(this.keys().next().value);
    return this;
  }
}
var init_lru = __esm(() => {
});

// node_modules/viem/_esm/utils/address/getAddress.js
function checksumAddress(address_, chainId) {
  if (checksumAddressCache.has(`${address_}.${chainId}`))
    return checksumAddressCache.get(`${address_}.${chainId}`);
  const hexAddress = chainId ? `${chainId}${address_.toLowerCase()}` : address_.substring(2).toLowerCase();
  const hash3 = keccak256(stringToBytes(hexAddress), "bytes");
  const address2 = (chainId ? hexAddress.substring(`${chainId}0x`.length) : hexAddress).split("");
  for (let i = 0;i < 40; i += 2) {
    if (hash3[i >> 1] >> 4 >= 8 && address2[i]) {
      address2[i] = address2[i].toUpperCase();
    }
    if ((hash3[i >> 1] & 15) >= 8 && address2[i + 1]) {
      address2[i + 1] = address2[i + 1].toUpperCase();
    }
  }
  const result = `0x${address2.join("")}`;
  checksumAddressCache.set(`${address_}.${chainId}`, result);
  return result;
}
function getAddress(address2, chainId) {
  if (!isAddress2(address2, { strict: false }))
    throw new InvalidAddressError({ address: address2 });
  return checksumAddress(address2, chainId);
}
var checksumAddressCache;
var init_getAddress = __esm(() => {
  init_address();
  init_toBytes();
  init_keccak256();
  init_lru();
  init_isAddress();
  checksumAddressCache = new LruMap(8192);
});

// node_modules/viem/_esm/utils/address/isAddress.js
function isAddress2(address2, options) {
  const { strict = true } = options ?? {};
  const cacheKey = `${address2}.${strict}`;
  if (isAddressCache.has(cacheKey))
    return isAddressCache.get(cacheKey);
  const result = (() => {
    if (!addressRegex.test(address2))
      return false;
    if (address2.toLowerCase() === address2)
      return true;
    if (strict)
      return checksumAddress(address2) === address2;
    return true;
  })();
  isAddressCache.set(cacheKey, result);
  return result;
}
var addressRegex, isAddressCache;
var init_isAddress = __esm(() => {
  init_lru();
  init_getAddress();
  addressRegex = /^0x[a-fA-F0-9]{40}$/;
  isAddressCache = new LruMap(8192);
});

// node_modules/viem/_esm/utils/data/concat.js
function concat(values) {
  if (typeof values[0] === "string")
    return concatHex(values);
  return concatBytes2(values);
}
function concatBytes2(values) {
  let length = 0;
  for (const arr of values) {
    length += arr.length;
  }
  const result = new Uint8Array(length);
  let offset = 0;
  for (const arr of values) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}
function concatHex(values) {
  return `0x${values.reduce((acc, x) => acc + x.replace("0x", ""), "")}`;
}
var init_concat = __esm(() => {
});

// node_modules/viem/_esm/utils/data/slice.js
function slice(value, start, end, { strict } = {}) {
  if (isHex(value, { strict: false }))
    return sliceHex(value, start, end, {
      strict
    });
  return sliceBytes(value, start, end, {
    strict
  });
}
function sliceBytes(value_, start, end, { strict } = {}) {
  assertStartOffset(value_, start);
  const value = value_.slice(start, end);
  if (strict)
    assertEndOffset(value, start, end);
  return value;
}
function sliceHex(value_, start, end, { strict } = {}) {
  assertStartOffset(value_, start);
  const value = `0x${value_.replace("0x", "").slice((start ?? 0) * 2, (end ?? value_.length) * 2)}`;
  if (strict)
    assertEndOffset(value, start, end);
  return value;
}
var assertStartOffset, assertEndOffset;
var init_slice = __esm(() => {
  init_data();
  init_isHex();
  init_size();
  assertStartOffset = function(value, start) {
    if (typeof start === "number" && start > 0 && start > size(value) - 1)
      throw new SliceOffsetOutOfBoundsError({
        offset: start,
        position: "start",
        size: size(value)
      });
  };
  assertEndOffset = function(value, start, end) {
    if (typeof start === "number" && typeof end === "number" && size(value) !== end - start) {
      throw new SliceOffsetOutOfBoundsError({
        offset: end,
        position: "end",
        size: size(value)
      });
    }
  };
});

// node_modules/viem/_esm/utils/abi/encodeAbiParameters.js
function encodeAbiParameters(params, values) {
  if (params.length !== values.length)
    throw new AbiEncodingLengthMismatchError({
      expectedLength: params.length,
      givenLength: values.length
    });
  const preparedParams = prepareParams({
    params,
    values
  });
  const data3 = encodeParams(preparedParams);
  if (data3.length === 0)
    return "0x";
  return data3;
}
function getArrayComponents(type) {
  const matches = type.match(/^(.*)\[(\d+)?\]$/);
  return matches ? [matches[2] ? Number(matches[2]) : null, matches[1]] : undefined;
}
var prepareParams, prepareParam, encodeParams, encodeAddress, encodeArray, encodeBytes, encodeBool, encodeNumber, encodeString, encodeTuple;
var init_encodeAbiParameters = __esm(() => {
  init_abi();
  init_address();
  init_base();
  init_isAddress();
  init_concat();
  init_pad();
  init_size();
  init_slice();
  init_toHex();
  prepareParams = function({ params, values }) {
    const preparedParams = [];
    for (let i = 0;i < params.length; i++) {
      preparedParams.push(prepareParam({ param: params[i], value: values[i] }));
    }
    return preparedParams;
  };
  prepareParam = function({ param, value }) {
    const arrayComponents = getArrayComponents(param.type);
    if (arrayComponents) {
      const [length, type] = arrayComponents;
      return encodeArray(value, { length, param: { ...param, type } });
    }
    if (param.type === "tuple") {
      return encodeTuple(value, {
        param
      });
    }
    if (param.type === "address") {
      return encodeAddress(value);
    }
    if (param.type === "bool") {
      return encodeBool(value);
    }
    if (param.type.startsWith("uint") || param.type.startsWith("int")) {
      const signed = param.type.startsWith("int");
      return encodeNumber(value, { signed });
    }
    if (param.type.startsWith("bytes")) {
      return encodeBytes(value, { param });
    }
    if (param.type === "string") {
      return encodeString(value);
    }
    throw new InvalidAbiEncodingTypeError(param.type, {
      docsPath: "/docs/contract/encodeAbiParameters"
    });
  };
  encodeParams = function(preparedParams) {
    let staticSize = 0;
    for (let i = 0;i < preparedParams.length; i++) {
      const { dynamic, encoded } = preparedParams[i];
      if (dynamic)
        staticSize += 32;
      else
        staticSize += size(encoded);
    }
    const staticParams = [];
    const dynamicParams = [];
    let dynamicSize = 0;
    for (let i = 0;i < preparedParams.length; i++) {
      const { dynamic, encoded } = preparedParams[i];
      if (dynamic) {
        staticParams.push(numberToHex(staticSize + dynamicSize, { size: 32 }));
        dynamicParams.push(encoded);
        dynamicSize += size(encoded);
      } else {
        staticParams.push(encoded);
      }
    }
    return concat([...staticParams, ...dynamicParams]);
  };
  encodeAddress = function(value) {
    if (!isAddress2(value))
      throw new InvalidAddressError({ address: value });
    return { dynamic: false, encoded: padHex(value.toLowerCase()) };
  };
  encodeArray = function(value, { length, param }) {
    const dynamic = length === null;
    if (!Array.isArray(value))
      throw new InvalidArrayError(value);
    if (!dynamic && value.length !== length)
      throw new AbiEncodingArrayLengthMismatchError({
        expectedLength: length,
        givenLength: value.length,
        type: `${param.type}[${length}]`
      });
    let dynamicChild = false;
    const preparedParams = [];
    for (let i = 0;i < value.length; i++) {
      const preparedParam = prepareParam({ param, value: value[i] });
      if (preparedParam.dynamic)
        dynamicChild = true;
      preparedParams.push(preparedParam);
    }
    if (dynamic || dynamicChild) {
      const data3 = encodeParams(preparedParams);
      if (dynamic) {
        const length2 = numberToHex(preparedParams.length, { size: 32 });
        return {
          dynamic: true,
          encoded: preparedParams.length > 0 ? concat([length2, data3]) : length2
        };
      }
      if (dynamicChild)
        return { dynamic: true, encoded: data3 };
    }
    return {
      dynamic: false,
      encoded: concat(preparedParams.map(({ encoded }) => encoded))
    };
  };
  encodeBytes = function(value, { param }) {
    const [, paramSize] = param.type.split("bytes");
    const bytesSize = size(value);
    if (!paramSize) {
      let value_ = value;
      if (bytesSize % 32 !== 0)
        value_ = padHex(value_, {
          dir: "right",
          size: Math.ceil((value.length - 2) / 2 / 32) * 32
        });
      return {
        dynamic: true,
        encoded: concat([padHex(numberToHex(bytesSize, { size: 32 })), value_])
      };
    }
    if (bytesSize !== Number.parseInt(paramSize))
      throw new AbiEncodingBytesSizeMismatchError({
        expectedSize: Number.parseInt(paramSize),
        value
      });
    return { dynamic: false, encoded: padHex(value, { dir: "right" }) };
  };
  encodeBool = function(value) {
    if (typeof value !== "boolean")
      throw new BaseError2(`Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`);
    return { dynamic: false, encoded: padHex(boolToHex(value)) };
  };
  encodeNumber = function(value, { signed }) {
    return {
      dynamic: false,
      encoded: numberToHex(value, {
        size: 32,
        signed
      })
    };
  };
  encodeString = function(value) {
    const hexValue = stringToHex(value);
    const partsLength = Math.ceil(size(hexValue) / 32);
    const parts = [];
    for (let i = 0;i < partsLength; i++) {
      parts.push(padHex(slice(hexValue, i * 32, (i + 1) * 32), {
        dir: "right"
      }));
    }
    return {
      dynamic: true,
      encoded: concat([
        padHex(numberToHex(size(hexValue), { size: 32 })),
        ...parts
      ])
    };
  };
  encodeTuple = function(value, { param }) {
    let dynamic = false;
    const preparedParams = [];
    for (let i = 0;i < param.components.length; i++) {
      const param_ = param.components[i];
      const index = Array.isArray(value) ? i : param_.name;
      const preparedParam = prepareParam({
        param: param_,
        value: value[index]
      });
      preparedParams.push(preparedParam);
      if (preparedParam.dynamic)
        dynamic = true;
    }
    return {
      dynamic,
      encoded: dynamic ? encodeParams(preparedParams) : concat(preparedParams.map(({ encoded }) => encoded))
    };
  };
});

// node_modules/viem/_esm/utils/hash/toFunctionSelector.js
var toFunctionSelector;
var init_toFunctionSelector = __esm(() => {
  init_slice();
  init_toSignatureHash();
  toFunctionSelector = (fn) => slice(toSignatureHash(fn), 0, 4);
});

// node_modules/viem/_esm/utils/abi/getAbiItem.js
function getAbiItem(parameters) {
  const { abi: abi4, args = [], name } = parameters;
  const isSelector = isHex(name, { strict: false });
  const abiItems = abi4.filter((abiItem3) => {
    if (isSelector) {
      if (abiItem3.type === "function")
        return toFunctionSelector(abiItem3) === name;
      if (abiItem3.type === "event")
        return toEventSelector(abiItem3) === name;
      return false;
    }
    return "name" in abiItem3 && abiItem3.name === name;
  });
  if (abiItems.length === 0)
    return;
  if (abiItems.length === 1)
    return abiItems[0];
  let matchedAbiItem = undefined;
  for (const abiItem3 of abiItems) {
    if (!("inputs" in abiItem3))
      continue;
    if (!args || args.length === 0) {
      if (!abiItem3.inputs || abiItem3.inputs.length === 0)
        return abiItem3;
      continue;
    }
    if (!abiItem3.inputs)
      continue;
    if (abiItem3.inputs.length === 0)
      continue;
    if (abiItem3.inputs.length !== args.length)
      continue;
    const matched = args.every((arg, index) => {
      const abiParameter3 = "inputs" in abiItem3 && abiItem3.inputs[index];
      if (!abiParameter3)
        return false;
      return isArgOfType(arg, abiParameter3);
    });
    if (matched) {
      if (matchedAbiItem && "inputs" in matchedAbiItem && matchedAbiItem.inputs) {
        const ambiguousTypes = getAmbiguousTypes(abiItem3.inputs, matchedAbiItem.inputs, args);
        if (ambiguousTypes)
          throw new AbiItemAmbiguityError({
            abiItem: abiItem3,
            type: ambiguousTypes[0]
          }, {
            abiItem: matchedAbiItem,
            type: ambiguousTypes[1]
          });
      }
      matchedAbiItem = abiItem3;
    }
  }
  if (matchedAbiItem)
    return matchedAbiItem;
  return abiItems[0];
}
function isArgOfType(arg, abiParameter3) {
  const argType = typeof arg;
  const abiParameterType = abiParameter3.type;
  switch (abiParameterType) {
    case "address":
      return isAddress2(arg, { strict: false });
    case "bool":
      return argType === "boolean";
    case "function":
      return argType === "string";
    case "string":
      return argType === "string";
    default: {
      if (abiParameterType === "tuple" && "components" in abiParameter3)
        return Object.values(abiParameter3.components).every((component, index) => {
          return isArgOfType(Object.values(arg)[index], component);
        });
      if (/^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(abiParameterType))
        return argType === "number" || argType === "bigint";
      if (/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(abiParameterType))
        return argType === "string" || arg instanceof Uint8Array;
      if (/[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(abiParameterType)) {
        return Array.isArray(arg) && arg.every((x) => isArgOfType(x, {
          ...abiParameter3,
          type: abiParameterType.replace(/(\[[0-9]{0,}\])$/, "")
        }));
      }
      return false;
    }
  }
}
function getAmbiguousTypes(sourceParameters, targetParameters, args) {
  for (const parameterIndex in sourceParameters) {
    const sourceParameter = sourceParameters[parameterIndex];
    const targetParameter = targetParameters[parameterIndex];
    if (sourceParameter.type === "tuple" && targetParameter.type === "tuple" && "components" in sourceParameter && "components" in targetParameter)
      return getAmbiguousTypes(sourceParameter.components, targetParameter.components, args[parameterIndex]);
    const types = [sourceParameter.type, targetParameter.type];
    const ambiguous = (() => {
      if (types.includes("address") && types.includes("bytes20"))
        return true;
      if (types.includes("address") && types.includes("string"))
        return isAddress2(args[parameterIndex], { strict: false });
      if (types.includes("address") && types.includes("bytes"))
        return isAddress2(args[parameterIndex], { strict: false });
      return false;
    })();
    if (ambiguous)
      return types;
  }
  return;
}
var init_getAbiItem = __esm(() => {
  init_abi();
  init_isHex();
  init_isAddress();
  init_toEventSelector();
  init_toFunctionSelector();
});

// node_modules/viem/_esm/accounts/utils/parseAccount.js
function parseAccount(account) {
  if (typeof account === "string")
    return { address: account, type: "json-rpc" };
  return account;
}
var init_parseAccount = __esm(() => {
});

// node_modules/viem/_esm/utils/abi/prepareEncodeFunctionData.js
function prepareEncodeFunctionData(parameters) {
  const { abi: abi6, args, functionName } = parameters;
  let abiItem3 = abi6[0];
  if (functionName) {
    const item = getAbiItem({
      abi: abi6,
      args,
      name: functionName
    });
    if (!item)
      throw new AbiFunctionNotFoundError(functionName, { docsPath: docsPath2 });
    abiItem3 = item;
  }
  if (abiItem3.type !== "function")
    throw new AbiFunctionNotFoundError(undefined, { docsPath: docsPath2 });
  return {
    abi: [abiItem3],
    functionName: toFunctionSelector(formatAbiItem2(abiItem3))
  };
}
var docsPath2;
var init_prepareEncodeFunctionData = __esm(() => {
  init_abi();
  init_toFunctionSelector();
  init_formatAbiItem2();
  init_getAbiItem();
  docsPath2 = "/docs/contract/encodeFunctionData";
});

// node_modules/viem/_esm/utils/abi/encodeFunctionData.js
function encodeFunctionData(parameters) {
  const { args } = parameters;
  const { abi: abi6, functionName } = (() => {
    if (parameters.abi.length === 1 && parameters.functionName?.startsWith("0x"))
      return parameters;
    return prepareEncodeFunctionData(parameters);
  })();
  const abiItem3 = abi6[0];
  const signature3 = functionName;
  const data3 = "inputs" in abiItem3 && abiItem3.inputs ? encodeAbiParameters(abiItem3.inputs, args ?? []) : undefined;
  return concatHex([signature3, data3 ?? "0x"]);
}
var init_encodeFunctionData = __esm(() => {
  init_concat();
  init_encodeAbiParameters();
  init_prepareEncodeFunctionData();
});

// node_modules/viem/_esm/constants/solidity.js
var panicReasons, solidityError, solidityPanic;
var init_solidity = __esm(() => {
  panicReasons = {
    1: "An `assert` condition failed.",
    17: "Arithmetic operation resulted in underflow or overflow.",
    18: "Division or modulo by zero (e.g. `5 / 0` or `23 % 0`).",
    33: "Attempted to convert to an invalid type.",
    34: "Attempted to access a storage byte array that is incorrectly encoded.",
    49: "Performed `.pop()` on an empty array",
    50: "Array index is out of bounds.",
    65: "Allocated too much memory or created an array which is too large.",
    81: "Attempted to call a zero-initialized variable of internal function type."
  };
  solidityError = {
    inputs: [
      {
        name: "message",
        type: "string"
      }
    ],
    name: "Error",
    type: "error"
  };
  solidityPanic = {
    inputs: [
      {
        name: "reason",
        type: "uint256"
      }
    ],
    name: "Panic",
    type: "error"
  };
});

// node_modules/viem/_esm/errors/cursor.js
class NegativeOffsetError extends BaseError2 {
  constructor({ offset }) {
    super(`Offset \`${offset}\` cannot be negative.`, {
      name: "NegativeOffsetError"
    });
  }
}

class PositionOutOfBoundsError extends BaseError2 {
  constructor({ length, position }) {
    super(`Position \`${position}\` is out of bounds (\`0 < position < ${length}\`).`, { name: "PositionOutOfBoundsError" });
  }
}

class RecursiveReadLimitExceededError extends BaseError2 {
  constructor({ count, limit }) {
    super(`Recursive read limit of \`${limit}\` exceeded (recursive read count: \`${count}\`).`, { name: "RecursiveReadLimitExceededError" });
  }
}
var init_cursor = __esm(() => {
  init_base();
});

// node_modules/viem/_esm/utils/cursor.js
function createCursor(bytes2, { recursiveReadLimit = 8192 } = {}) {
  const cursor2 = Object.create(staticCursor);
  cursor2.bytes = bytes2;
  cursor2.dataView = new DataView(bytes2.buffer, bytes2.byteOffset, bytes2.byteLength);
  cursor2.positionReadCount = new Map;
  cursor2.recursiveReadLimit = recursiveReadLimit;
  return cursor2;
}
var staticCursor;
var init_cursor2 = __esm(() => {
  init_cursor();
  staticCursor = {
    bytes: new Uint8Array,
    dataView: new DataView(new ArrayBuffer(0)),
    position: 0,
    positionReadCount: new Map,
    recursiveReadCount: 0,
    recursiveReadLimit: Number.POSITIVE_INFINITY,
    assertReadLimit() {
      if (this.recursiveReadCount >= this.recursiveReadLimit)
        throw new RecursiveReadLimitExceededError({
          count: this.recursiveReadCount + 1,
          limit: this.recursiveReadLimit
        });
    },
    assertPosition(position) {
      if (position < 0 || position > this.bytes.length - 1)
        throw new PositionOutOfBoundsError({
          length: this.bytes.length,
          position
        });
    },
    decrementPosition(offset) {
      if (offset < 0)
        throw new NegativeOffsetError({ offset });
      const position = this.position - offset;
      this.assertPosition(position);
      this.position = position;
    },
    getReadCount(position) {
      return this.positionReadCount.get(position || this.position) || 0;
    },
    incrementPosition(offset) {
      if (offset < 0)
        throw new NegativeOffsetError({ offset });
      const position = this.position + offset;
      this.assertPosition(position);
      this.position = position;
    },
    inspectByte(position_) {
      const position = position_ ?? this.position;
      this.assertPosition(position);
      return this.bytes[position];
    },
    inspectBytes(length, position_) {
      const position = position_ ?? this.position;
      this.assertPosition(position + length - 1);
      return this.bytes.subarray(position, position + length);
    },
    inspectUint8(position_) {
      const position = position_ ?? this.position;
      this.assertPosition(position);
      return this.bytes[position];
    },
    inspectUint16(position_) {
      const position = position_ ?? this.position;
      this.assertPosition(position + 1);
      return this.dataView.getUint16(position);
    },
    inspectUint24(position_) {
      const position = position_ ?? this.position;
      this.assertPosition(position + 2);
      return (this.dataView.getUint16(position) << 8) + this.dataView.getUint8(position + 2);
    },
    inspectUint32(position_) {
      const position = position_ ?? this.position;
      this.assertPosition(position + 3);
      return this.dataView.getUint32(position);
    },
    pushByte(byte) {
      this.assertPosition(this.position);
      this.bytes[this.position] = byte;
      this.position++;
    },
    pushBytes(bytes2) {
      this.assertPosition(this.position + bytes2.length - 1);
      this.bytes.set(bytes2, this.position);
      this.position += bytes2.length;
    },
    pushUint8(value) {
      this.assertPosition(this.position);
      this.bytes[this.position] = value;
      this.position++;
    },
    pushUint16(value) {
      this.assertPosition(this.position + 1);
      this.dataView.setUint16(this.position, value);
      this.position += 2;
    },
    pushUint24(value) {
      this.assertPosition(this.position + 2);
      this.dataView.setUint16(this.position, value >> 8);
      this.dataView.setUint8(this.position + 2, value & ~4294967040);
      this.position += 3;
    },
    pushUint32(value) {
      this.assertPosition(this.position + 3);
      this.dataView.setUint32(this.position, value);
      this.position += 4;
    },
    readByte() {
      this.assertReadLimit();
      this._touch();
      const value = this.inspectByte();
      this.position++;
      return value;
    },
    readBytes(length, size6) {
      this.assertReadLimit();
      this._touch();
      const value = this.inspectBytes(length);
      this.position += size6 ?? length;
      return value;
    },
    readUint8() {
      this.assertReadLimit();
      this._touch();
      const value = this.inspectUint8();
      this.position += 1;
      return value;
    },
    readUint16() {
      this.assertReadLimit();
      this._touch();
      const value = this.inspectUint16();
      this.position += 2;
      return value;
    },
    readUint24() {
      this.assertReadLimit();
      this._touch();
      const value = this.inspectUint24();
      this.position += 3;
      return value;
    },
    readUint32() {
      this.assertReadLimit();
      this._touch();
      const value = this.inspectUint32();
      this.position += 4;
      return value;
    },
    get remaining() {
      return this.bytes.length - this.position;
    },
    setPosition(position) {
      const oldPosition = this.position;
      this.assertPosition(position);
      this.position = position;
      return () => this.position = oldPosition;
    },
    _touch() {
      if (this.recursiveReadLimit === Number.POSITIVE_INFINITY)
        return;
      const count = this.getReadCount();
      this.positionReadCount.set(this.position, count + 1);
      if (count > 0)
        this.recursiveReadCount++;
    }
  };
});

// node_modules/viem/_esm/utils/encoding/fromBytes.js
function bytesToBigInt(bytes2, opts = {}) {
  if (typeof opts.size !== "undefined")
    assertSize(bytes2, { size: opts.size });
  const hex = bytesToHex(bytes2, opts);
  return hexToBigInt(hex, opts);
}
function bytesToBool(bytes_, opts = {}) {
  let bytes2 = bytes_;
  if (typeof opts.size !== "undefined") {
    assertSize(bytes2, { size: opts.size });
    bytes2 = trim(bytes2);
  }
  if (bytes2.length > 1 || bytes2[0] > 1)
    throw new InvalidBytesBooleanError(bytes2);
  return Boolean(bytes2[0]);
}
function bytesToNumber(bytes2, opts = {}) {
  if (typeof opts.size !== "undefined")
    assertSize(bytes2, { size: opts.size });
  const hex = bytesToHex(bytes2, opts);
  return hexToNumber(hex, opts);
}
function bytesToString(bytes_, opts = {}) {
  let bytes2 = bytes_;
  if (typeof opts.size !== "undefined") {
    assertSize(bytes2, { size: opts.size });
    bytes2 = trim(bytes2, { dir: "right" });
  }
  return new TextDecoder().decode(bytes2);
}
var init_fromBytes = __esm(() => {
  init_encoding();
  init_trim();
  init_fromHex();
  init_toHex();
});

// node_modules/viem/_esm/utils/abi/decodeAbiParameters.js
function decodeAbiParameters(params, data3) {
  const bytes2 = typeof data3 === "string" ? hexToBytes(data3) : data3;
  const cursor3 = createCursor(bytes2);
  if (size(bytes2) === 0 && params.length > 0)
    throw new AbiDecodingZeroDataError;
  if (size(data3) && size(data3) < 32)
    throw new AbiDecodingDataSizeTooSmallError({
      data: typeof data3 === "string" ? data3 : bytesToHex(data3),
      params,
      size: size(data3)
    });
  let consumed = 0;
  const values = [];
  for (let i = 0;i < params.length; ++i) {
    const param = params[i];
    cursor3.setPosition(consumed);
    const [data4, consumed_] = decodeParameter(cursor3, param, {
      staticPosition: 0
    });
    consumed += consumed_;
    values.push(data4);
  }
  return values;
}
var decodeParameter, decodeAddress, decodeArray, decodeBool, decodeBytes, decodeNumber, decodeTuple, decodeString, hasDynamicChild, sizeOfLength, sizeOfOffset;
var init_decodeAbiParameters = __esm(() => {
  init_abi();
  init_getAddress();
  init_cursor2();
  init_size();
  init_slice();
  init_trim();
  init_fromBytes();
  init_toBytes();
  init_toHex();
  init_encodeAbiParameters();
  decodeParameter = function(cursor3, param, { staticPosition }) {
    const arrayComponents = getArrayComponents(param.type);
    if (arrayComponents) {
      const [length, type] = arrayComponents;
      return decodeArray(cursor3, { ...param, type }, { length, staticPosition });
    }
    if (param.type === "tuple")
      return decodeTuple(cursor3, param, { staticPosition });
    if (param.type === "address")
      return decodeAddress(cursor3);
    if (param.type === "bool")
      return decodeBool(cursor3);
    if (param.type.startsWith("bytes"))
      return decodeBytes(cursor3, param, { staticPosition });
    if (param.type.startsWith("uint") || param.type.startsWith("int"))
      return decodeNumber(cursor3, param);
    if (param.type === "string")
      return decodeString(cursor3, { staticPosition });
    throw new InvalidAbiDecodingTypeError(param.type, {
      docsPath: "/docs/contract/decodeAbiParameters"
    });
  };
  decodeAddress = function(cursor3) {
    const value = cursor3.readBytes(32);
    return [checksumAddress(bytesToHex(sliceBytes(value, -20))), 32];
  };
  decodeArray = function(cursor3, param, { length, staticPosition }) {
    if (!length) {
      const offset = bytesToNumber(cursor3.readBytes(sizeOfOffset));
      const start = staticPosition + offset;
      const startOfData = start + sizeOfLength;
      cursor3.setPosition(start);
      const length2 = bytesToNumber(cursor3.readBytes(sizeOfLength));
      const dynamicChild = hasDynamicChild(param);
      let consumed2 = 0;
      const value2 = [];
      for (let i = 0;i < length2; ++i) {
        cursor3.setPosition(startOfData + (dynamicChild ? i * 32 : consumed2));
        const [data3, consumed_] = decodeParameter(cursor3, param, {
          staticPosition: startOfData
        });
        consumed2 += consumed_;
        value2.push(data3);
      }
      cursor3.setPosition(staticPosition + 32);
      return [value2, 32];
    }
    if (hasDynamicChild(param)) {
      const offset = bytesToNumber(cursor3.readBytes(sizeOfOffset));
      const start = staticPosition + offset;
      const value2 = [];
      for (let i = 0;i < length; ++i) {
        cursor3.setPosition(start + i * 32);
        const [data3] = decodeParameter(cursor3, param, {
          staticPosition: start
        });
        value2.push(data3);
      }
      cursor3.setPosition(staticPosition + 32);
      return [value2, 32];
    }
    let consumed = 0;
    const value = [];
    for (let i = 0;i < length; ++i) {
      const [data3, consumed_] = decodeParameter(cursor3, param, {
        staticPosition: staticPosition + consumed
      });
      consumed += consumed_;
      value.push(data3);
    }
    return [value, consumed];
  };
  decodeBool = function(cursor3) {
    return [bytesToBool(cursor3.readBytes(32), { size: 32 }), 32];
  };
  decodeBytes = function(cursor3, param, { staticPosition }) {
    const [_, size7] = param.type.split("bytes");
    if (!size7) {
      const offset = bytesToNumber(cursor3.readBytes(32));
      cursor3.setPosition(staticPosition + offset);
      const length = bytesToNumber(cursor3.readBytes(32));
      if (length === 0) {
        cursor3.setPosition(staticPosition + 32);
        return ["0x", 32];
      }
      const data3 = cursor3.readBytes(length);
      cursor3.setPosition(staticPosition + 32);
      return [bytesToHex(data3), 32];
    }
    const value = bytesToHex(cursor3.readBytes(Number.parseInt(size7), 32));
    return [value, 32];
  };
  decodeNumber = function(cursor3, param) {
    const signed = param.type.startsWith("int");
    const size7 = Number.parseInt(param.type.split("int")[1] || "256");
    const value = cursor3.readBytes(32);
    return [
      size7 > 48 ? bytesToBigInt(value, { signed }) : bytesToNumber(value, { signed }),
      32
    ];
  };
  decodeTuple = function(cursor3, param, { staticPosition }) {
    const hasUnnamedChild = param.components.length === 0 || param.components.some(({ name }) => !name);
    const value = hasUnnamedChild ? [] : {};
    let consumed = 0;
    if (hasDynamicChild(param)) {
      const offset = bytesToNumber(cursor3.readBytes(sizeOfOffset));
      const start = staticPosition + offset;
      for (let i = 0;i < param.components.length; ++i) {
        const component = param.components[i];
        cursor3.setPosition(start + consumed);
        const [data3, consumed_] = decodeParameter(cursor3, component, {
          staticPosition: start
        });
        consumed += consumed_;
        value[hasUnnamedChild ? i : component?.name] = data3;
      }
      cursor3.setPosition(staticPosition + 32);
      return [value, 32];
    }
    for (let i = 0;i < param.components.length; ++i) {
      const component = param.components[i];
      const [data3, consumed_] = decodeParameter(cursor3, component, {
        staticPosition
      });
      value[hasUnnamedChild ? i : component?.name] = data3;
      consumed += consumed_;
    }
    return [value, consumed];
  };
  decodeString = function(cursor3, { staticPosition }) {
    const offset = bytesToNumber(cursor3.readBytes(32));
    const start = staticPosition + offset;
    cursor3.setPosition(start);
    const length = bytesToNumber(cursor3.readBytes(32));
    if (length === 0) {
      cursor3.setPosition(staticPosition + 32);
      return ["", 32];
    }
    const data3 = cursor3.readBytes(length, 32);
    const value = bytesToString(trim(data3));
    cursor3.setPosition(staticPosition + 32);
    return [value, 32];
  };
  hasDynamicChild = function(param) {
    const { type } = param;
    if (type === "string")
      return true;
    if (type === "bytes")
      return true;
    if (type.endsWith("[]"))
      return true;
    if (type === "tuple")
      return param.components?.some(hasDynamicChild);
    const arrayComponents = getArrayComponents(param.type);
    if (arrayComponents && hasDynamicChild({ ...param, type: arrayComponents[1] }))
      return true;
    return false;
  };
  sizeOfLength = 32;
  sizeOfOffset = 32;
});

// node_modules/viem/_esm/utils/abi/decodeErrorResult.js
function decodeErrorResult(parameters) {
  const { abi: abi8, data: data3 } = parameters;
  const signature3 = slice(data3, 0, 4);
  if (signature3 === "0x")
    throw new AbiDecodingZeroDataError;
  const abi_ = [...abi8 || [], solidityError, solidityPanic];
  const abiItem3 = abi_.find((x) => x.type === "error" && signature3 === toFunctionSelector(formatAbiItem2(x)));
  if (!abiItem3)
    throw new AbiErrorSignatureNotFoundError(signature3, {
      docsPath: "/docs/contract/decodeErrorResult"
    });
  return {
    abiItem: abiItem3,
    args: "inputs" in abiItem3 && abiItem3.inputs && abiItem3.inputs.length > 0 ? decodeAbiParameters(abiItem3.inputs, slice(data3, 4)) : undefined,
    errorName: abiItem3.name
  };
}
var init_decodeErrorResult = __esm(() => {
  init_solidity();
  init_abi();
  init_slice();
  init_toFunctionSelector();
  init_decodeAbiParameters();
  init_formatAbiItem2();
});

// node_modules/viem/_esm/utils/stringify.js
var stringify;
var init_stringify = __esm(() => {
  stringify = (value, replacer, space) => JSON.stringify(value, (key, value_) => {
    const value2 = typeof value_ === "bigint" ? value_.toString() : value_;
    return typeof replacer === "function" ? replacer(key, value2) : value2;
  }, space);
});

// node_modules/viem/_esm/utils/abi/formatAbiItemWithArgs.js
function formatAbiItemWithArgs({ abiItem: abiItem3, args, includeFunctionName = true, includeName = false }) {
  if (!("name" in abiItem3))
    return;
  if (!("inputs" in abiItem3))
    return;
  if (!abiItem3.inputs)
    return;
  return `${includeFunctionName ? abiItem3.name : ""}(${abiItem3.inputs.map((input, i) => `${includeName && input.name ? `${input.name}: ` : ""}${typeof args[i] === "object" ? stringify(args[i]) : args[i]}`).join(", ")})`;
}
var init_formatAbiItemWithArgs = __esm(() => {
  init_stringify();
});

// node_modules/viem/_esm/constants/unit.js
var etherUnits, gweiUnits;
var init_unit = __esm(() => {
  etherUnits = {
    gwei: 9,
    wei: 18
  };
  gweiUnits = {
    ether: -9,
    wei: 9
  };
});

// node_modules/viem/_esm/utils/unit/formatUnits.js
function formatUnits(value, decimals) {
  let display = value.toString();
  const negative = display.startsWith("-");
  if (negative)
    display = display.slice(1);
  display = display.padStart(decimals, "0");
  let [integer, fraction] = [
    display.slice(0, display.length - decimals),
    display.slice(display.length - decimals)
  ];
  fraction = fraction.replace(/(0+)$/, "");
  return `${negative ? "-" : ""}${integer || "0"}${fraction ? `.${fraction}` : ""}`;
}
var init_formatUnits = __esm(() => {
});

// node_modules/viem/_esm/utils/unit/formatEther.js
function formatEther(wei, unit2 = "wei") {
  return formatUnits(wei, etherUnits[unit2]);
}
var init_formatEther = __esm(() => {
  init_unit();
  init_formatUnits();
});

// node_modules/viem/_esm/utils/unit/formatGwei.js
function formatGwei(wei, unit3 = "wei") {
  return formatUnits(wei, gweiUnits[unit3]);
}
var init_formatGwei = __esm(() => {
  init_unit();
  init_formatUnits();
});

// node_modules/viem/_esm/errors/stateOverride.js
function prettyStateMapping(stateMapping) {
  return stateMapping.reduce((pretty, { slot, value }) => {
    return `${pretty}        ${slot}: ${value}\n`;
  }, "");
}
function prettyStateOverride(stateOverride) {
  return stateOverride.reduce((pretty, { address: address3, ...state }) => {
    let val = `${pretty}    ${address3}:\n`;
    if (state.nonce)
      val += `      nonce: ${state.nonce}\n`;
    if (state.balance)
      val += `      balance: ${state.balance}\n`;
    if (state.code)
      val += `      code: ${state.code}\n`;
    if (state.state) {
      val += "      state:\n";
      val += prettyStateMapping(state.state);
    }
    if (state.stateDiff) {
      val += "      stateDiff:\n";
      val += prettyStateMapping(state.stateDiff);
    }
    return val;
  }, "  State Override:\n").slice(0, -1);
}

class AccountStateConflictError extends BaseError2 {
  constructor({ address: address3 }) {
    super(`State for account "${address3}" is set multiple times.`, {
      name: "AccountStateConflictError"
    });
  }
}

class StateAssignmentConflictError extends BaseError2 {
  constructor() {
    super("state and stateDiff are set on the same account.", {
      name: "StateAssignmentConflictError"
    });
  }
}
var init_stateOverride = __esm(() => {
  init_base();
});

// node_modules/viem/_esm/errors/transaction.js
function prettyPrint(args) {
  const entries = Object.entries(args).map(([key, value]) => {
    if (value === undefined || value === false)
      return null;
    return [key, value];
  }).filter(Boolean);
  const maxLength = entries.reduce((acc, [key]) => Math.max(acc, key.length), 0);
  return entries.map(([key, value]) => `  ${`${key}:`.padEnd(maxLength + 1)}  ${value}`).join("\n");
}

class FeeConflictError extends BaseError2 {
  constructor() {
    super([
      "Cannot specify both a `gasPrice` and a `maxFeePerGas`/`maxPriorityFeePerGas`.",
      "Use `maxFeePerGas`/`maxPriorityFeePerGas` for EIP-1559 compatible networks, and `gasPrice` for others."
    ].join("\n"), { name: "FeeConflictError" });
  }
}

class InvalidSerializableTransactionError extends BaseError2 {
  constructor({ transaction }) {
    super("Cannot infer a transaction type from provided transaction.", {
      metaMessages: [
        "Provided Transaction:",
        "{",
        prettyPrint(transaction),
        "}",
        "",
        "To infer the type, either provide:",
        "- a `type` to the Transaction, or",
        "- an EIP-1559 Transaction with `maxFeePerGas`, or",
        "- an EIP-2930 Transaction with `gasPrice` & `accessList`, or",
        "- an EIP-4844 Transaction with `blobs`, `blobVersionedHashes`, `sidecars`, or",
        "- an EIP-7702 Transaction with `authorizationList`, or",
        "- a Legacy Transaction with `gasPrice`"
      ],
      name: "InvalidSerializableTransactionError"
    });
  }
}

class TransactionNotFoundError extends BaseError2 {
  constructor({ blockHash, blockNumber, blockTag, hash: hash3, index }) {
    let identifier = "Transaction";
    if (blockTag && index !== undefined)
      identifier = `Transaction at block time "${blockTag}" at index "${index}"`;
    if (blockHash && index !== undefined)
      identifier = `Transaction at block hash "${blockHash}" at index "${index}"`;
    if (blockNumber && index !== undefined)
      identifier = `Transaction at block number "${blockNumber}" at index "${index}"`;
    if (hash3)
      identifier = `Transaction with hash "${hash3}"`;
    super(`${identifier} could not be found.`, {
      name: "TransactionNotFoundError"
    });
  }
}

class TransactionReceiptNotFoundError extends BaseError2 {
  constructor({ hash: hash3 }) {
    super(`Transaction receipt with hash "${hash3}" could not be found. The Transaction may not be processed on a block yet.`, {
      name: "TransactionReceiptNotFoundError"
    });
  }
}

class WaitForTransactionReceiptTimeoutError extends BaseError2 {
  constructor({ hash: hash3 }) {
    super(`Timed out while waiting for transaction with hash "${hash3}" to be confirmed.`, { name: "WaitForTransactionReceiptTimeoutError" });
  }
}
var init_transaction = __esm(() => {
  init_base();
});

// node_modules/viem/_esm/errors/utils.js
var getContractAddress, getUrl;
var init_utils3 = __esm(() => {
  getContractAddress = (address3) => address3;
  getUrl = (url) => url;
});

// node_modules/viem/_esm/errors/contract.js
class CallExecutionError extends BaseError2 {
  constructor(cause, { account: account_, docsPath: docsPath3, chain, data: data3, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value, stateOverride: stateOverride2 }) {
    const account = account_ ? parseAccount(account_) : undefined;
    let prettyArgs = prettyPrint({
      from: account?.address,
      to,
      value: typeof value !== "undefined" && `${formatEther(value)} ${chain?.nativeCurrency?.symbol || "ETH"}`,
      data: data3,
      gas,
      gasPrice: typeof gasPrice !== "undefined" && `${formatGwei(gasPrice)} gwei`,
      maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${formatGwei(maxFeePerGas)} gwei`,
      maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${formatGwei(maxPriorityFeePerGas)} gwei`,
      nonce
    });
    if (stateOverride2) {
      prettyArgs += `\n${prettyStateOverride(stateOverride2)}`;
    }
    super(cause.shortMessage, {
      cause,
      docsPath: docsPath3,
      metaMessages: [
        ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
        "Raw Call Arguments:",
        prettyArgs
      ].filter(Boolean),
      name: "CallExecutionError"
    });
    Object.defineProperty(this, "cause", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    this.cause = cause;
  }
}

class ContractFunctionExecutionError extends BaseError2 {
  constructor(cause, { abi: abi9, args, contractAddress, docsPath: docsPath3, functionName, sender }) {
    const abiItem3 = getAbiItem({ abi: abi9, args, name: functionName });
    const formattedArgs = abiItem3 ? formatAbiItemWithArgs({
      abiItem: abiItem3,
      args,
      includeFunctionName: false,
      includeName: false
    }) : undefined;
    const functionWithParams = abiItem3 ? formatAbiItem2(abiItem3, { includeName: true }) : undefined;
    const prettyArgs = prettyPrint({
      address: contractAddress && getContractAddress(contractAddress),
      function: functionWithParams,
      args: formattedArgs && formattedArgs !== "()" && `${[...Array(functionName?.length ?? 0).keys()].map(() => " ").join("")}${formattedArgs}`,
      sender
    });
    super(cause.shortMessage || `An unknown error occurred while executing the contract function "${functionName}".`, {
      cause,
      docsPath: docsPath3,
      metaMessages: [
        ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
        prettyArgs && "Contract Call:",
        prettyArgs
      ].filter(Boolean),
      name: "ContractFunctionExecutionError"
    });
    Object.defineProperty(this, "abi", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "args", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "cause", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "contractAddress", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "formattedArgs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "functionName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "sender", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    this.abi = abi9;
    this.args = args;
    this.cause = cause;
    this.contractAddress = contractAddress;
    this.functionName = functionName;
    this.sender = sender;
  }
}

class ContractFunctionRevertedError extends BaseError2 {
  constructor({ abi: abi9, data: data3, functionName, message }) {
    let cause;
    let decodedData = undefined;
    let metaMessages;
    let reason;
    if (data3 && data3 !== "0x") {
      try {
        decodedData = decodeErrorResult({ abi: abi9, data: data3 });
        const { abiItem: abiItem3, errorName, args: errorArgs } = decodedData;
        if (errorName === "Error") {
          reason = errorArgs[0];
        } else if (errorName === "Panic") {
          const [firstArg] = errorArgs;
          reason = panicReasons[firstArg];
        } else {
          const errorWithParams = abiItem3 ? formatAbiItem2(abiItem3, { includeName: true }) : undefined;
          const formattedArgs = abiItem3 && errorArgs ? formatAbiItemWithArgs({
            abiItem: abiItem3,
            args: errorArgs,
            includeFunctionName: false,
            includeName: false
          }) : undefined;
          metaMessages = [
            errorWithParams ? `Error: ${errorWithParams}` : "",
            formattedArgs && formattedArgs !== "()" ? `       ${[...Array(errorName?.length ?? 0).keys()].map(() => " ").join("")}${formattedArgs}` : ""
          ];
        }
      } catch (err) {
        cause = err;
      }
    } else if (message)
      reason = message;
    let signature3;
    if (cause instanceof AbiErrorSignatureNotFoundError) {
      signature3 = cause.signature;
      metaMessages = [
        `Unable to decode signature "${signature3}" as it was not found on the provided ABI.`,
        "Make sure you are using the correct ABI and that the error exists on it.",
        `You can look up the decoded signature here: https://openchain.xyz/signatures?query=${signature3}.`
      ];
    }
    super(reason && reason !== "execution reverted" || signature3 ? [
      `The contract function "${functionName}" reverted with the following ${signature3 ? "signature" : "reason"}:`,
      reason || signature3
    ].join("\n") : `The contract function "${functionName}" reverted.`, {
      cause,
      metaMessages,
      name: "ContractFunctionRevertedError"
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "reason", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "signature", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    this.data = decodedData;
    this.reason = reason;
    this.signature = signature3;
  }
}

class ContractFunctionZeroDataError extends BaseError2 {
  constructor({ functionName }) {
    super(`The contract function "${functionName}" returned no data ("0x").`, {
      metaMessages: [
        "This could be due to any of the following:",
        `  - The contract does not have the function "${functionName}",`,
        "  - The parameters passed to the contract function may be invalid, or",
        "  - The address is not a contract."
      ],
      name: "ContractFunctionZeroDataError"
    });
  }
}

class CounterfactualDeploymentFailedError extends BaseError2 {
  constructor({ factory }) {
    super(`Deployment for counterfactual contract call failed${factory ? ` for factory "${factory}".` : ""}`, {
      metaMessages: [
        "Please ensure:",
        "- The `factory` is a valid contract deployment factory (ie. Create2 Factory, ERC-4337 Factory, etc).",
        "- The `factoryData` is a valid encoded function call for contract deployment function on the factory."
      ],
      name: "CounterfactualDeploymentFailedError"
    });
  }
}

class RawContractError extends BaseError2 {
  constructor({ data: data3, message }) {
    super(message || "", { name: "RawContractError" });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 3
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    this.data = data3;
  }
}
var init_contract = __esm(() => {
  init_parseAccount();
  init_solidity();
  init_decodeErrorResult();
  init_formatAbiItem2();
  init_formatAbiItemWithArgs();
  init_getAbiItem();
  init_formatEther();
  init_formatGwei();
  init_abi();
  init_base();
  init_stateOverride();
  init_transaction();
  init_utils3();
});

// node_modules/viem/_esm/errors/request.js
class HttpRequestError extends BaseError2 {
  constructor({ body, cause, details, headers, status, url }) {
    super("HTTP request failed.", {
      cause,
      details,
      metaMessages: [
        status && `Status: ${status}`,
        `URL: ${getUrl(url)}`,
        body && `Request body: ${stringify(body)}`
      ].filter(Boolean),
      name: "HttpRequestError"
    });
    Object.defineProperty(this, "body", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "headers", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "status", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "url", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    this.body = body;
    this.headers = headers;
    this.status = status;
    this.url = url;
  }
}

class RpcRequestError extends BaseError2 {
  constructor({ body, error, url }) {
    super("RPC Request failed.", {
      cause: error,
      details: error.message,
      metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`],
      name: "RpcRequestError"
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    this.code = error.code;
  }
}

class TimeoutError extends BaseError2 {
  constructor({ body, url }) {
    super("The request took too long to respond.", {
      details: "The request timed out.",
      metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`],
      name: "TimeoutError"
    });
  }
}
var init_request = __esm(() => {
  init_stringify();
  init_base();
  init_utils3();
});

// node_modules/viem/_esm/errors/rpc.js
class RpcError extends BaseError2 {
  constructor(cause, { code, docsPath: docsPath3, metaMessages, name, shortMessage }) {
    super(shortMessage, {
      cause,
      docsPath: docsPath3,
      metaMessages: metaMessages || cause?.metaMessages,
      name: name || "RpcError"
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    this.name = name || cause.name;
    this.code = cause instanceof RpcRequestError ? cause.code : code ?? unknownErrorCode;
  }
}

class ProviderRpcError extends RpcError {
  constructor(cause, options) {
    super(cause, options);
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    this.data = options.data;
  }
}

class ParseRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: ParseRpcError.code,
      name: "ParseRpcError",
      shortMessage: "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
    });
  }
}

class InvalidRequestRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: InvalidRequestRpcError.code,
      name: "InvalidRequestRpcError",
      shortMessage: "JSON is not a valid request object."
    });
  }
}

class MethodNotFoundRpcError extends RpcError {
  constructor(cause, { method } = {}) {
    super(cause, {
      code: MethodNotFoundRpcError.code,
      name: "MethodNotFoundRpcError",
      shortMessage: `The method${method ? ` "${method}"` : ""} does not exist / is not available.`
    });
  }
}

class InvalidParamsRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: InvalidParamsRpcError.code,
      name: "InvalidParamsRpcError",
      shortMessage: [
        "Invalid parameters were provided to the RPC method.",
        "Double check you have provided the correct parameters."
      ].join("\n")
    });
  }
}

class InternalRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: InternalRpcError.code,
      name: "InternalRpcError",
      shortMessage: "An internal error was received."
    });
  }
}

class InvalidInputRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: InvalidInputRpcError.code,
      name: "InvalidInputRpcError",
      shortMessage: [
        "Missing or invalid parameters.",
        "Double check you have provided the correct parameters."
      ].join("\n")
    });
  }
}

class ResourceNotFoundRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: ResourceNotFoundRpcError.code,
      name: "ResourceNotFoundRpcError",
      shortMessage: "Requested resource not found."
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "ResourceNotFoundRpcError"
    });
  }
}

class ResourceUnavailableRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: ResourceUnavailableRpcError.code,
      name: "ResourceUnavailableRpcError",
      shortMessage: "Requested resource not available."
    });
  }
}

class TransactionRejectedRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: TransactionRejectedRpcError.code,
      name: "TransactionRejectedRpcError",
      shortMessage: "Transaction creation failed."
    });
  }
}

class MethodNotSupportedRpcError extends RpcError {
  constructor(cause, { method } = {}) {
    super(cause, {
      code: MethodNotSupportedRpcError.code,
      name: "MethodNotSupportedRpcError",
      shortMessage: `Method${method ? ` "${method}"` : ""} is not implemented.`
    });
  }
}

class LimitExceededRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: LimitExceededRpcError.code,
      name: "LimitExceededRpcError",
      shortMessage: "Request exceeds defined limit."
    });
  }
}

class JsonRpcVersionUnsupportedError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: JsonRpcVersionUnsupportedError.code,
      name: "JsonRpcVersionUnsupportedError",
      shortMessage: "Version of JSON-RPC protocol is not supported."
    });
  }
}

class UserRejectedRequestError extends ProviderRpcError {
  constructor(cause) {
    super(cause, {
      code: UserRejectedRequestError.code,
      name: "UserRejectedRequestError",
      shortMessage: "User rejected the request."
    });
  }
}

class UnauthorizedProviderError extends ProviderRpcError {
  constructor(cause) {
    super(cause, {
      code: UnauthorizedProviderError.code,
      name: "UnauthorizedProviderError",
      shortMessage: "The requested method and/or account has not been authorized by the user."
    });
  }
}

class UnsupportedProviderMethodError extends ProviderRpcError {
  constructor(cause, { method } = {}) {
    super(cause, {
      code: UnsupportedProviderMethodError.code,
      name: "UnsupportedProviderMethodError",
      shortMessage: `The Provider does not support the requested method${method ? ` " ${method}"` : ""}.`
    });
  }
}

class ProviderDisconnectedError extends ProviderRpcError {
  constructor(cause) {
    super(cause, {
      code: ProviderDisconnectedError.code,
      name: "ProviderDisconnectedError",
      shortMessage: "The Provider is disconnected from all chains."
    });
  }
}

class ChainDisconnectedError extends ProviderRpcError {
  constructor(cause) {
    super(cause, {
      code: ChainDisconnectedError.code,
      name: "ChainDisconnectedError",
      shortMessage: "The Provider is not connected to the requested chain."
    });
  }
}

class SwitchChainError extends ProviderRpcError {
  constructor(cause) {
    super(cause, {
      code: SwitchChainError.code,
      name: "SwitchChainError",
      shortMessage: "An error occurred when attempting to switch chain."
    });
  }
}

class UnknownRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      name: "UnknownRpcError",
      shortMessage: "An unknown RPC error occurred."
    });
  }
}
var unknownErrorCode;
var init_rpc = __esm(() => {
  init_base();
  init_request();
  unknownErrorCode = -1;
  Object.defineProperty(ParseRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32700
  });
  Object.defineProperty(InvalidRequestRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32600
  });
  Object.defineProperty(MethodNotFoundRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32601
  });
  Object.defineProperty(InvalidParamsRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32602
  });
  Object.defineProperty(InternalRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32603
  });
  Object.defineProperty(InvalidInputRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32000
  });
  Object.defineProperty(ResourceNotFoundRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32001
  });
  Object.defineProperty(ResourceUnavailableRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32002
  });
  Object.defineProperty(TransactionRejectedRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32003
  });
  Object.defineProperty(MethodNotSupportedRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32004
  });
  Object.defineProperty(LimitExceededRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32005
  });
  Object.defineProperty(JsonRpcVersionUnsupportedError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32006
  });
  Object.defineProperty(UserRejectedRequestError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 4001
  });
  Object.defineProperty(UnauthorizedProviderError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 4100
  });
  Object.defineProperty(UnsupportedProviderMethodError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 4200
  });
  Object.defineProperty(ProviderDisconnectedError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 4900
  });
  Object.defineProperty(ChainDisconnectedError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 4901
  });
  Object.defineProperty(SwitchChainError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 4902
  });
});

// node_modules/@noble/hashes/esm/_md.js
class HashMD extends Hash {
  constructor(blockLen, outputLen, padOffset, isLE2) {
    super();
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE2;
    this.finished = false;
    this.length = 0;
    this.pos = 0;
    this.destroyed = false;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data3) {
    exists(this);
    const { view, buffer, blockLen } = this;
    data3 = toBytes2(data3);
    const len = data3.length;
    for (let pos = 0;pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView(data3);
        for (;blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        continue;
      }
      buffer.set(data3.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
      }
    }
    this.length += data3.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    exists(this);
    output(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE: isLE2 } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    this.buffer.subarray(pos).fill(0);
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i = pos;i < blockLen; i++)
      buffer[i] = 0;
    setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE2);
    this.process(view, 0);
    const oview = createView(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const outLen = len / 4;
    const state = this.get();
    if (outLen > state.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i = 0;i < outLen; i++)
      oview.setUint32(4 * i, state[i], isLE2);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to || (to = new this.constructor);
    to.set(...this.get());
    const { blockLen, buffer, length, finished, destroyed, pos } = this;
    to.length = length;
    to.pos = pos;
    to.finished = finished;
    to.destroyed = destroyed;
    if (length % blockLen)
      to.buffer.set(buffer);
    return to;
  }
}
var setBigUint64, Chi, Maj;
var init__md = __esm(() => {
  init__assert();
  init_utils2();
  setBigUint64 = function(view, byteOffset, value, isLE2) {
    if (typeof view.setBigUint64 === "function")
      return view.setBigUint64(byteOffset, value, isLE2);
    const _32n2 = BigInt(32);
    const _u32_max = BigInt(4294967295);
    const wh = Number(value >> _32n2 & _u32_max);
    const wl = Number(value & _u32_max);
    const h = isLE2 ? 4 : 0;
    const l = isLE2 ? 0 : 4;
    view.setUint32(byteOffset + h, wh, isLE2);
    view.setUint32(byteOffset + l, wl, isLE2);
  };
  Chi = (a, b, c) => a & b ^ ~a & c;
  Maj = (a, b, c) => a & b ^ a & c ^ b & c;
});

// node_modules/@noble/hashes/esm/sha256.js
class SHA256 extends HashMD {
  constructor() {
    super(64, 32, 8, false);
    this.A = SHA256_IV[0] | 0;
    this.B = SHA256_IV[1] | 0;
    this.C = SHA256_IV[2] | 0;
    this.D = SHA256_IV[3] | 0;
    this.E = SHA256_IV[4] | 0;
    this.F = SHA256_IV[5] | 0;
    this.G = SHA256_IV[6] | 0;
    this.H = SHA256_IV[7] | 0;
  }
  get() {
    const { A, B, C, D, E, F, G, H } = this;
    return [A, B, C, D, E, F, G, H];
  }
  set(A, B, C, D, E, F, G, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G | 0;
    this.H = H | 0;
  }
  process(view, offset) {
    for (let i = 0;i < 16; i++, offset += 4)
      SHA256_W[i] = view.getUint32(offset, false);
    for (let i = 16;i < 64; i++) {
      const W15 = SHA256_W[i - 15];
      const W2 = SHA256_W[i - 2];
      const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
      const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
      SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
    }
    let { A, B, C, D, E, F, G, H } = this;
    for (let i = 0;i < 64; i++) {
      const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
      const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
      const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
      const T2 = sigma0 + Maj(A, B, C) | 0;
      H = G;
      G = F;
      F = E;
      E = D + T1 | 0;
      D = C;
      C = B;
      B = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C = C + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G = G + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C, D, E, F, G, H);
  }
  roundClean() {
    SHA256_W.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    this.buffer.fill(0);
  }
}
var SHA256_K, SHA256_IV, SHA256_W, sha256;
var init_sha256 = __esm(() => {
  init__md();
  init_utils2();
  SHA256_K = new Uint32Array([
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ]);
  SHA256_IV = new Uint32Array([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);
  SHA256_W = new Uint32Array(64);
  sha256 = wrapConstructor(() => new SHA256);
});

// node_modules/@noble/curves/esm/abstract/utils.js
var exports_utils = {};
__export(exports_utils, {
  validateObject: () => {
    {
      return validateObject;
    }
  },
  utf8ToBytes: () => {
    {
      return utf8ToBytes2;
    }
  },
  numberToVarBytesBE: () => {
    {
      return numberToVarBytesBE;
    }
  },
  numberToHexUnpadded: () => {
    {
      return numberToHexUnpadded;
    }
  },
  numberToBytesLE: () => {
    {
      return numberToBytesLE;
    }
  },
  numberToBytesBE: () => {
    {
      return numberToBytesBE;
    }
  },
  isBytes: () => {
    {
      return isBytes2;
    }
  },
  hexToNumber: () => {
    {
      return hexToNumber2;
    }
  },
  hexToBytes: () => {
    {
      return hexToBytes2;
    }
  },
  equalBytes: () => {
    {
      return equalBytes;
    }
  },
  ensureBytes: () => {
    {
      return ensureBytes;
    }
  },
  createHmacDrbg: () => {
    {
      return createHmacDrbg;
    }
  },
  concatBytes: () => {
    {
      return concatBytes3;
    }
  },
  bytesToNumberLE: () => {
    {
      return bytesToNumberLE;
    }
  },
  bytesToNumberBE: () => {
    {
      return bytesToNumberBE;
    }
  },
  bytesToHex: () => {
    {
      return bytesToHex2;
    }
  },
  bitSet: () => {
    {
      return bitSet;
    }
  },
  bitMask: () => {
    {
      return bitMask;
    }
  },
  bitLen: () => {
    {
      return bitLen;
    }
  },
  bitGet: () => {
    {
      return bitGet;
    }
  },
  abytes: () => {
    {
      return abytes;
    }
  }
});
function isBytes2(a) {
  return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
}
function abytes(item) {
  if (!isBytes2(item))
    throw new Error("Uint8Array expected");
}
function bytesToHex2(bytes2) {
  abytes(bytes2);
  let hex = "";
  for (let i = 0;i < bytes2.length; i++) {
    hex += hexes2[bytes2[i]];
  }
  return hex;
}
function numberToHexUnpadded(num) {
  const hex = num.toString(16);
  return hex.length & 1 ? `0${hex}` : hex;
}
function hexToNumber2(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  return BigInt(hex === "" ? "0" : `0x${hex}`);
}
function hexToBytes2(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    throw new Error("padded hex string expected, got unpadded hex of length " + hl);
  const array = new Uint8Array(al);
  for (let ai = 0, hi = 0;ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex.charCodeAt(hi));
    const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
    if (n1 === undefined || n2 === undefined) {
      const char = hex[hi] + hex[hi + 1];
      throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array[ai] = n1 * 16 + n2;
  }
  return array;
}
function bytesToNumberBE(bytes2) {
  return hexToNumber2(bytesToHex2(bytes2));
}
function bytesToNumberLE(bytes2) {
  abytes(bytes2);
  return hexToNumber2(bytesToHex2(Uint8Array.from(bytes2).reverse()));
}
function numberToBytesBE(n, len) {
  return hexToBytes2(n.toString(16).padStart(len * 2, "0"));
}
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
function numberToVarBytesBE(n) {
  return hexToBytes2(numberToHexUnpadded(n));
}
function ensureBytes(title, hex, expectedLength) {
  let res;
  if (typeof hex === "string") {
    try {
      res = hexToBytes2(hex);
    } catch (e) {
      throw new Error(`${title} must be valid hex string, got "${hex}". Cause: ${e}`);
    }
  } else if (isBytes2(hex)) {
    res = Uint8Array.from(hex);
  } else {
    throw new Error(`${title} must be hex string or Uint8Array`);
  }
  const len = res.length;
  if (typeof expectedLength === "number" && len !== expectedLength)
    throw new Error(`${title} expected ${expectedLength} bytes, got ${len}`);
  return res;
}
function concatBytes3(...arrays) {
  let sum = 0;
  for (let i = 0;i < arrays.length; i++) {
    const a = arrays[i];
    abytes(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad5 = 0;i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad5);
    pad5 += a.length;
  }
  return res;
}
function equalBytes(a, b) {
  if (a.length !== b.length)
    return false;
  let diff = 0;
  for (let i = 0;i < a.length; i++)
    diff |= a[i] ^ b[i];
  return diff === 0;
}
function utf8ToBytes2(str) {
  if (typeof str !== "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str));
}
function bitLen(n) {
  let len;
  for (len = 0;n > _0n2; n >>= _1n2, len += 1)
    ;
  return len;
}
function bitGet(n, pos) {
  return n >> BigInt(pos) & _1n2;
}
function bitSet(n, pos, value) {
  return n | (value ? _1n2 : _0n2) << BigInt(pos);
}
function createHmacDrbg(hashLen, qByteLen, hmacFn) {
  if (typeof hashLen !== "number" || hashLen < 2)
    throw new Error("hashLen must be a number");
  if (typeof qByteLen !== "number" || qByteLen < 2)
    throw new Error("qByteLen must be a number");
  if (typeof hmacFn !== "function")
    throw new Error("hmacFn must be a function");
  let v = u8n(hashLen);
  let k = u8n(hashLen);
  let i = 0;
  const reset = () => {
    v.fill(1);
    k.fill(0);
    i = 0;
  };
  const h = (...b) => hmacFn(k, v, ...b);
  const reseed = (seed = u8n()) => {
    k = h(u8fr([0]), seed);
    v = h();
    if (seed.length === 0)
      return;
    k = h(u8fr([1]), seed);
    v = h();
  };
  const gen2 = () => {
    if (i++ >= 1000)
      throw new Error("drbg: tried 1000 values");
    let len = 0;
    const out = [];
    while (len < qByteLen) {
      v = h();
      const sl = v.slice();
      out.push(sl);
      len += v.length;
    }
    return concatBytes3(...out);
  };
  const genUntil = (seed, pred) => {
    reset();
    reseed(seed);
    let res = undefined;
    while (!(res = pred(gen2())))
      reseed();
    reset();
    return res;
  };
  return genUntil;
}
function validateObject(object, validators, optValidators = {}) {
  const checkField = (fieldName, type, isOptional) => {
    const checkVal = validatorFns[type];
    if (typeof checkVal !== "function")
      throw new Error(`Invalid validator "${type}", expected function`);
    const val = object[fieldName];
    if (isOptional && val === undefined)
      return;
    if (!checkVal(val, object)) {
      throw new Error(`Invalid param ${String(fieldName)}=${val} (${typeof val}), expected ${type}`);
    }
  };
  for (const [fieldName, type] of Object.entries(validators))
    checkField(fieldName, type, false);
  for (const [fieldName, type] of Object.entries(optValidators))
    checkField(fieldName, type, true);
  return object;
}
var asciiToBase16, _0n2, _1n2, _2n2, hexes2, asciis, bitMask, u8n, u8fr, validatorFns;
var init_utils4 = __esm(() => {
  asciiToBase16 = function(char) {
    if (char >= asciis._0 && char <= asciis._9)
      return char - asciis._0;
    if (char >= asciis._A && char <= asciis._F)
      return char - (asciis._A - 10);
    if (char >= asciis._a && char <= asciis._f)
      return char - (asciis._a - 10);
    return;
  };
  /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  _0n2 = BigInt(0);
  _1n2 = BigInt(1);
  _2n2 = BigInt(2);
  hexes2 = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
  asciis = { _0: 48, _9: 57, _A: 65, _F: 70, _a: 97, _f: 102 };
  bitMask = (n) => (_2n2 << BigInt(n - 1)) - _1n2;
  u8n = (data3) => new Uint8Array(data3);
  u8fr = (arr) => Uint8Array.from(arr);
  validatorFns = {
    bigint: (val) => typeof val === "bigint",
    function: (val) => typeof val === "function",
    boolean: (val) => typeof val === "boolean",
    string: (val) => typeof val === "string",
    stringOrUint8Array: (val) => typeof val === "string" || isBytes2(val),
    isSafeInteger: (val) => Number.isSafeInteger(val),
    array: (val) => Array.isArray(val),
    field: (val, object) => object.Fp.isValid(val),
    hash: (val) => typeof val === "function" && Number.isSafeInteger(val.outputLen)
  };
});

// node_modules/@noble/curves/esm/abstract/modular.js
function mod(a, b) {
  const result = a % b;
  return result >= _0n3 ? result : b + result;
}
function pow(num, power, modulo) {
  if (modulo <= _0n3 || power < _0n3)
    throw new Error("Expected power/modulo > 0");
  if (modulo === _1n3)
    return _0n3;
  let res = _1n3;
  while (power > _0n3) {
    if (power & _1n3)
      res = res * num % modulo;
    num = num * num % modulo;
    power >>= _1n3;
  }
  return res;
}
function pow2(x, power, modulo) {
  let res = x;
  while (power-- > _0n3) {
    res *= res;
    res %= modulo;
  }
  return res;
}
function invert(number2, modulo) {
  if (number2 === _0n3 || modulo <= _0n3) {
    throw new Error(`invert: expected positive integers, got n=${number2} mod=${modulo}`);
  }
  let a = mod(number2, modulo);
  let b = modulo;
  let x = _0n3, y = _1n3, u = _1n3, v = _0n3;
  while (a !== _0n3) {
    const q = b / a;
    const r = b % a;
    const m = x - u * q;
    const n = y - v * q;
    b = a, a = r, x = u, y = v, u = m, v = n;
  }
  const gcd = b;
  if (gcd !== _1n3)
    throw new Error("invert: does not exist");
  return mod(x, modulo);
}
function tonelliShanks(P) {
  const legendreC = (P - _1n3) / _2n3;
  let Q, S, Z;
  for (Q = P - _1n3, S = 0;Q % _2n3 === _0n3; Q /= _2n3, S++)
    ;
  for (Z = _2n3;Z < P && pow(Z, legendreC, P) !== P - _1n3; Z++)
    ;
  if (S === 1) {
    const p1div4 = (P + _1n3) / _4n;
    return function tonelliFast(Fp, n) {
      const root = Fp.pow(n, p1div4);
      if (!Fp.eql(Fp.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    };
  }
  const Q1div2 = (Q + _1n3) / _2n3;
  return function tonelliSlow(Fp, n) {
    if (Fp.pow(n, legendreC) === Fp.neg(Fp.ONE))
      throw new Error("Cannot find square root");
    let r = S;
    let g = Fp.pow(Fp.mul(Fp.ONE, Z), Q);
    let x = Fp.pow(n, Q1div2);
    let b = Fp.pow(n, Q);
    while (!Fp.eql(b, Fp.ONE)) {
      if (Fp.eql(b, Fp.ZERO))
        return Fp.ZERO;
      let m = 1;
      for (let t2 = Fp.sqr(b);m < r; m++) {
        if (Fp.eql(t2, Fp.ONE))
          break;
        t2 = Fp.sqr(t2);
      }
      const ge = Fp.pow(g, _1n3 << BigInt(r - m - 1));
      g = Fp.sqr(ge);
      x = Fp.mul(x, ge);
      b = Fp.mul(b, g);
      r = m;
    }
    return x;
  };
}
function FpSqrt(P) {
  if (P % _4n === _3n) {
    const p1div4 = (P + _1n3) / _4n;
    return function sqrt3mod4(Fp, n) {
      const root = Fp.pow(n, p1div4);
      if (!Fp.eql(Fp.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    };
  }
  if (P % _8n === _5n) {
    const c1 = (P - _5n) / _8n;
    return function sqrt5mod8(Fp, n) {
      const n2 = Fp.mul(n, _2n3);
      const v = Fp.pow(n2, c1);
      const nv = Fp.mul(n, v);
      const i = Fp.mul(Fp.mul(nv, _2n3), v);
      const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
      if (!Fp.eql(Fp.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    };
  }
  if (P % _16n === _9n) {
  }
  return tonelliShanks(P);
}
function validateField(field) {
  const initial = {
    ORDER: "bigint",
    MASK: "bigint",
    BYTES: "isSafeInteger",
    BITS: "isSafeInteger"
  };
  const opts = FIELD_FIELDS.reduce((map, val) => {
    map[val] = "function";
    return map;
  }, initial);
  return validateObject(field, opts);
}
function FpPow(f, num, power) {
  if (power < _0n3)
    throw new Error("Expected power > 0");
  if (power === _0n3)
    return f.ONE;
  if (power === _1n3)
    return num;
  let p = f.ONE;
  let d = num;
  while (power > _0n3) {
    if (power & _1n3)
      p = f.mul(p, d);
    d = f.sqr(d);
    power >>= _1n3;
  }
  return p;
}
function FpInvertBatch(f, nums) {
  const tmp = new Array(nums.length);
  const lastMultiplied = nums.reduce((acc, num, i) => {
    if (f.is0(num))
      return acc;
    tmp[i] = acc;
    return f.mul(acc, num);
  }, f.ONE);
  const inverted = f.inv(lastMultiplied);
  nums.reduceRight((acc, num, i) => {
    if (f.is0(num))
      return acc;
    tmp[i] = f.mul(acc, tmp[i]);
    return f.mul(acc, num);
  }, inverted);
  return tmp;
}
function nLength(n, nBitLength) {
  const _nBitLength = nBitLength !== undefined ? nBitLength : n.toString(2).length;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return { nBitLength: _nBitLength, nByteLength };
}
function Field(ORDER, bitLen2, isLE2 = false, redef = {}) {
  if (ORDER <= _0n3)
    throw new Error(`Expected Field ORDER > 0, got ${ORDER}`);
  const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, bitLen2);
  if (BYTES > 2048)
    throw new Error("Field lengths over 2048 bytes are not supported");
  const sqrtP = FpSqrt(ORDER);
  const f = Object.freeze({
    ORDER,
    BITS,
    BYTES,
    MASK: bitMask(BITS),
    ZERO: _0n3,
    ONE: _1n3,
    create: (num) => mod(num, ORDER),
    isValid: (num) => {
      if (typeof num !== "bigint")
        throw new Error(`Invalid field element: expected bigint, got ${typeof num}`);
      return _0n3 <= num && num < ORDER;
    },
    is0: (num) => num === _0n3,
    isOdd: (num) => (num & _1n3) === _1n3,
    neg: (num) => mod(-num, ORDER),
    eql: (lhs, rhs) => lhs === rhs,
    sqr: (num) => mod(num * num, ORDER),
    add: (lhs, rhs) => mod(lhs + rhs, ORDER),
    sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
    mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
    pow: (num, power) => FpPow(f, num, power),
    div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
    sqrN: (num) => num * num,
    addN: (lhs, rhs) => lhs + rhs,
    subN: (lhs, rhs) => lhs - rhs,
    mulN: (lhs, rhs) => lhs * rhs,
    inv: (num) => invert(num, ORDER),
    sqrt: redef.sqrt || ((n) => sqrtP(f, n)),
    invertBatch: (lst) => FpInvertBatch(f, lst),
    cmov: (a, b, c) => c ? b : a,
    toBytes: (num) => isLE2 ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES),
    fromBytes: (bytes2) => {
      if (bytes2.length !== BYTES)
        throw new Error(`Fp.fromBytes: expected ${BYTES}, got ${bytes2.length}`);
      return isLE2 ? bytesToNumberLE(bytes2) : bytesToNumberBE(bytes2);
    }
  });
  return Object.freeze(f);
}
function getFieldBytesLength(fieldOrder) {
  if (typeof fieldOrder !== "bigint")
    throw new Error("field order must be bigint");
  const bitLength = fieldOrder.toString(2).length;
  return Math.ceil(bitLength / 8);
}
function getMinHashLength(fieldOrder) {
  const length = getFieldBytesLength(fieldOrder);
  return length + Math.ceil(length / 2);
}
function mapHashToField(key, fieldOrder, isLE2 = false) {
  const len = key.length;
  const fieldLen = getFieldBytesLength(fieldOrder);
  const minLen = getMinHashLength(fieldOrder);
  if (len < 16 || len < minLen || len > 1024)
    throw new Error(`expected ${minLen}-1024 bytes of input, got ${len}`);
  const num = isLE2 ? bytesToNumberBE(key) : bytesToNumberLE(key);
  const reduced = mod(num, fieldOrder - _1n3) + _1n3;
  return isLE2 ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}
var _0n3, _1n3, _2n3, _3n, _4n, _5n, _8n, _9n, _16n, FIELD_FIELDS;
var init_modular = __esm(() => {
  init_utils4();
  /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  _0n3 = BigInt(0);
  _1n3 = BigInt(1);
  _2n3 = BigInt(2);
  _3n = BigInt(3);
  _4n = BigInt(4);
  _5n = BigInt(5);
  _8n = BigInt(8);
  _9n = BigInt(9);
  _16n = BigInt(16);
  FIELD_FIELDS = [
    "create",
    "isValid",
    "is0",
    "neg",
    "inv",
    "sqrt",
    "sqr",
    "eql",
    "add",
    "sub",
    "mul",
    "pow",
    "div",
    "addN",
    "subN",
    "mulN",
    "sqrN"
  ];
});

// node_modules/@noble/curves/esm/abstract/curve.js
function wNAF(c, bits) {
  const constTimeNegate = (condition, item) => {
    const neg = item.negate();
    return condition ? neg : item;
  };
  const opts = (W) => {
    const windows = Math.ceil(bits / W) + 1;
    const windowSize = 2 ** (W - 1);
    return { windows, windowSize };
  };
  return {
    constTimeNegate,
    unsafeLadder(elm, n) {
      let p = c.ZERO;
      let d = elm;
      while (n > _0n4) {
        if (n & _1n4)
          p = p.add(d);
        d = d.double();
        n >>= _1n4;
      }
      return p;
    },
    precomputeWindow(elm, W) {
      const { windows, windowSize } = opts(W);
      const points = [];
      let p = elm;
      let base16 = p;
      for (let window2 = 0;window2 < windows; window2++) {
        base16 = p;
        points.push(base16);
        for (let i = 1;i < windowSize; i++) {
          base16 = base16.add(p);
          points.push(base16);
        }
        p = base16.double();
      }
      return points;
    },
    wNAF(W, precomputes, n) {
      const { windows, windowSize } = opts(W);
      let p = c.ZERO;
      let f = c.BASE;
      const mask = BigInt(2 ** W - 1);
      const maxNumber = 2 ** W;
      const shiftBy = BigInt(W);
      for (let window2 = 0;window2 < windows; window2++) {
        const offset = window2 * windowSize;
        let wbits = Number(n & mask);
        n >>= shiftBy;
        if (wbits > windowSize) {
          wbits -= maxNumber;
          n += _1n4;
        }
        const offset1 = offset;
        const offset2 = offset + Math.abs(wbits) - 1;
        const cond1 = window2 % 2 !== 0;
        const cond2 = wbits < 0;
        if (wbits === 0) {
          f = f.add(constTimeNegate(cond1, precomputes[offset1]));
        } else {
          p = p.add(constTimeNegate(cond2, precomputes[offset2]));
        }
      }
      return { p, f };
    },
    wNAFCached(P, precomputesMap, n, transform) {
      const W = P._WINDOW_SIZE || 1;
      let comp = precomputesMap.get(P);
      if (!comp) {
        comp = this.precomputeWindow(P, W);
        if (W !== 1) {
          precomputesMap.set(P, transform(comp));
        }
      }
      return this.wNAF(W, comp, n);
    }
  };
}
function validateBasic(curve) {
  validateField(curve.Fp);
  validateObject(curve, {
    n: "bigint",
    h: "bigint",
    Gx: "field",
    Gy: "field"
  }, {
    nBitLength: "isSafeInteger",
    nByteLength: "isSafeInteger"
  });
  return Object.freeze({
    ...nLength(curve.n, curve.nBitLength),
    ...curve,
    ...{ p: curve.Fp.ORDER }
  });
}
var _0n4, _1n4;
var init_curve = __esm(() => {
  init_modular();
  init_utils4();
  /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  _0n4 = BigInt(0);
  _1n4 = BigInt(1);
});

// node_modules/@noble/curves/esm/abstract/weierstrass.js
function weierstrassPoints(opts) {
  const CURVE = validatePointOpts(opts);
  const { Fp } = CURVE;
  const toBytes8 = CURVE.toBytes || ((_c, point, _isCompressed) => {
    const a = point.toAffine();
    return concatBytes3(Uint8Array.from([4]), Fp.toBytes(a.x), Fp.toBytes(a.y));
  });
  const fromBytes2 = CURVE.fromBytes || ((bytes2) => {
    const tail = bytes2.subarray(1);
    const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
    const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
    return { x, y };
  });
  function weierstrassEquation(x) {
    const { a, b } = CURVE;
    const x2 = Fp.sqr(x);
    const x3 = Fp.mul(x2, x);
    return Fp.add(Fp.add(x3, Fp.mul(x, a)), b);
  }
  if (!Fp.eql(Fp.sqr(CURVE.Gy), weierstrassEquation(CURVE.Gx)))
    throw new Error("bad generator point: equation left != right");
  function isWithinCurveOrder(num) {
    return typeof num === "bigint" && _0n5 < num && num < CURVE.n;
  }
  function assertGE(num) {
    if (!isWithinCurveOrder(num))
      throw new Error("Expected valid bigint: 0 < bigint < curve.n");
  }
  function normPrivateKeyToScalar(key) {
    const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n } = CURVE;
    if (lengths && typeof key !== "bigint") {
      if (isBytes2(key))
        key = bytesToHex2(key);
      if (typeof key !== "string" || !lengths.includes(key.length))
        throw new Error("Invalid key");
      key = key.padStart(nByteLength * 2, "0");
    }
    let num;
    try {
      num = typeof key === "bigint" ? key : bytesToNumberBE(ensureBytes("private key", key, nByteLength));
    } catch (error) {
      throw new Error(`private key must be ${nByteLength} bytes, hex or bigint, not ${typeof key}`);
    }
    if (wrapPrivateKey)
      num = mod(num, n);
    assertGE(num);
    return num;
  }
  const pointPrecomputes = new Map;
  function assertPrjPoint(other) {
    if (!(other instanceof Point))
      throw new Error("ProjectivePoint expected");
  }

  class Point {
    constructor(px, py, pz) {
      this.px = px;
      this.py = py;
      this.pz = pz;
      if (px == null || !Fp.isValid(px))
        throw new Error("x required");
      if (py == null || !Fp.isValid(py))
        throw new Error("y required");
      if (pz == null || !Fp.isValid(pz))
        throw new Error("z required");
    }
    static fromAffine(p) {
      const { x, y } = p || {};
      if (!p || !Fp.isValid(x) || !Fp.isValid(y))
        throw new Error("invalid affine point");
      if (p instanceof Point)
        throw new Error("projective point not allowed");
      const is0 = (i) => Fp.eql(i, Fp.ZERO);
      if (is0(x) && is0(y))
        return Point.ZERO;
      return new Point(x, y, Fp.ONE);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    static normalizeZ(points) {
      const toInv = Fp.invertBatch(points.map((p) => p.pz));
      return points.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
    }
    static fromHex(hex) {
      const P = Point.fromAffine(fromBytes2(ensureBytes("pointHex", hex)));
      P.assertValidity();
      return P;
    }
    static fromPrivateKey(privateKey) {
      return Point.BASE.multiply(normPrivateKeyToScalar(privateKey));
    }
    _setWindowSize(windowSize) {
      this._WINDOW_SIZE = windowSize;
      pointPrecomputes.delete(this);
    }
    assertValidity() {
      if (this.is0()) {
        if (CURVE.allowInfinityPoint && !Fp.is0(this.py))
          return;
        throw new Error("bad point: ZERO");
      }
      const { x, y } = this.toAffine();
      if (!Fp.isValid(x) || !Fp.isValid(y))
        throw new Error("bad point: x or y not FE");
      const left = Fp.sqr(y);
      const right = weierstrassEquation(x);
      if (!Fp.eql(left, right))
        throw new Error("bad point: equation left != right");
      if (!this.isTorsionFree())
        throw new Error("bad point: not in prime-order subgroup");
    }
    hasEvenY() {
      const { y } = this.toAffine();
      if (Fp.isOdd)
        return !Fp.isOdd(y);
      throw new Error("Field doesn't support isOdd");
    }
    equals(other) {
      assertPrjPoint(other);
      const { px: X1, py: Y1, pz: Z1 } = this;
      const { px: X2, py: Y2, pz: Z2 } = other;
      const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
      const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
      return U1 && U2;
    }
    negate() {
      return new Point(this.px, Fp.neg(this.py), this.pz);
    }
    double() {
      const { a, b } = CURVE;
      const b3 = Fp.mul(b, _3n2);
      const { px: X1, py: Y1, pz: Z1 } = this;
      let { ZERO: X3, ZERO: Y3, ZERO: Z3 } = Fp;
      let t0 = Fp.mul(X1, X1);
      let t1 = Fp.mul(Y1, Y1);
      let t2 = Fp.mul(Z1, Z1);
      let t3 = Fp.mul(X1, Y1);
      t3 = Fp.add(t3, t3);
      Z3 = Fp.mul(X1, Z1);
      Z3 = Fp.add(Z3, Z3);
      X3 = Fp.mul(a, Z3);
      Y3 = Fp.mul(b3, t2);
      Y3 = Fp.add(X3, Y3);
      X3 = Fp.sub(t1, Y3);
      Y3 = Fp.add(t1, Y3);
      Y3 = Fp.mul(X3, Y3);
      X3 = Fp.mul(t3, X3);
      Z3 = Fp.mul(b3, Z3);
      t2 = Fp.mul(a, t2);
      t3 = Fp.sub(t0, t2);
      t3 = Fp.mul(a, t3);
      t3 = Fp.add(t3, Z3);
      Z3 = Fp.add(t0, t0);
      t0 = Fp.add(Z3, t0);
      t0 = Fp.add(t0, t2);
      t0 = Fp.mul(t0, t3);
      Y3 = Fp.add(Y3, t0);
      t2 = Fp.mul(Y1, Z1);
      t2 = Fp.add(t2, t2);
      t0 = Fp.mul(t2, t3);
      X3 = Fp.sub(X3, t0);
      Z3 = Fp.mul(t2, t1);
      Z3 = Fp.add(Z3, Z3);
      Z3 = Fp.add(Z3, Z3);
      return new Point(X3, Y3, Z3);
    }
    add(other) {
      assertPrjPoint(other);
      const { px: X1, py: Y1, pz: Z1 } = this;
      const { px: X2, py: Y2, pz: Z2 } = other;
      let { ZERO: X3, ZERO: Y3, ZERO: Z3 } = Fp;
      const a = CURVE.a;
      const b3 = Fp.mul(CURVE.b, _3n2);
      let t0 = Fp.mul(X1, X2);
      let t1 = Fp.mul(Y1, Y2);
      let t2 = Fp.mul(Z1, Z2);
      let t3 = Fp.add(X1, Y1);
      let t4 = Fp.add(X2, Y2);
      t3 = Fp.mul(t3, t4);
      t4 = Fp.add(t0, t1);
      t3 = Fp.sub(t3, t4);
      t4 = Fp.add(X1, Z1);
      let t5 = Fp.add(X2, Z2);
      t4 = Fp.mul(t4, t5);
      t5 = Fp.add(t0, t2);
      t4 = Fp.sub(t4, t5);
      t5 = Fp.add(Y1, Z1);
      X3 = Fp.add(Y2, Z2);
      t5 = Fp.mul(t5, X3);
      X3 = Fp.add(t1, t2);
      t5 = Fp.sub(t5, X3);
      Z3 = Fp.mul(a, t4);
      X3 = Fp.mul(b3, t2);
      Z3 = Fp.add(X3, Z3);
      X3 = Fp.sub(t1, Z3);
      Z3 = Fp.add(t1, Z3);
      Y3 = Fp.mul(X3, Z3);
      t1 = Fp.add(t0, t0);
      t1 = Fp.add(t1, t0);
      t2 = Fp.mul(a, t2);
      t4 = Fp.mul(b3, t4);
      t1 = Fp.add(t1, t2);
      t2 = Fp.sub(t0, t2);
      t2 = Fp.mul(a, t2);
      t4 = Fp.add(t4, t2);
      t0 = Fp.mul(t1, t4);
      Y3 = Fp.add(Y3, t0);
      t0 = Fp.mul(t5, t4);
      X3 = Fp.mul(t3, X3);
      X3 = Fp.sub(X3, t0);
      t0 = Fp.mul(t3, t1);
      Z3 = Fp.mul(t5, Z3);
      Z3 = Fp.add(Z3, t0);
      return new Point(X3, Y3, Z3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    is0() {
      return this.equals(Point.ZERO);
    }
    wNAF(n) {
      return wnaf.wNAFCached(this, pointPrecomputes, n, (comp) => {
        const toInv = Fp.invertBatch(comp.map((p) => p.pz));
        return comp.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
      });
    }
    multiplyUnsafe(n) {
      const I = Point.ZERO;
      if (n === _0n5)
        return I;
      assertGE(n);
      if (n === _1n5)
        return this;
      const { endo } = CURVE;
      if (!endo)
        return wnaf.unsafeLadder(this, n);
      let { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
      let k1p = I;
      let k2p = I;
      let d = this;
      while (k1 > _0n5 || k2 > _0n5) {
        if (k1 & _1n5)
          k1p = k1p.add(d);
        if (k2 & _1n5)
          k2p = k2p.add(d);
        d = d.double();
        k1 >>= _1n5;
        k2 >>= _1n5;
      }
      if (k1neg)
        k1p = k1p.negate();
      if (k2neg)
        k2p = k2p.negate();
      k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
      return k1p.add(k2p);
    }
    multiply(scalar) {
      assertGE(scalar);
      let n = scalar;
      let point, fake;
      const { endo } = CURVE;
      if (endo) {
        const { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
        let { p: k1p, f: f1p } = this.wNAF(k1);
        let { p: k2p, f: f2p } = this.wNAF(k2);
        k1p = wnaf.constTimeNegate(k1neg, k1p);
        k2p = wnaf.constTimeNegate(k2neg, k2p);
        k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
        point = k1p.add(k2p);
        fake = f1p.add(f2p);
      } else {
        const { p, f } = this.wNAF(n);
        point = p;
        fake = f;
      }
      return Point.normalizeZ([point, fake])[0];
    }
    multiplyAndAddUnsafe(Q, a, b) {
      const G = Point.BASE;
      const mul = (P, a2) => a2 === _0n5 || a2 === _1n5 || !P.equals(G) ? P.multiplyUnsafe(a2) : P.multiply(a2);
      const sum = mul(this, a).add(mul(Q, b));
      return sum.is0() ? undefined : sum;
    }
    toAffine(iz) {
      const { px: x, py: y, pz: z } = this;
      const is0 = this.is0();
      if (iz == null)
        iz = is0 ? Fp.ONE : Fp.inv(z);
      const ax = Fp.mul(x, iz);
      const ay = Fp.mul(y, iz);
      const zz = Fp.mul(z, iz);
      if (is0)
        return { x: Fp.ZERO, y: Fp.ZERO };
      if (!Fp.eql(zz, Fp.ONE))
        throw new Error("invZ was invalid");
      return { x: ax, y: ay };
    }
    isTorsionFree() {
      const { h: cofactor, isTorsionFree } = CURVE;
      if (cofactor === _1n5)
        return true;
      if (isTorsionFree)
        return isTorsionFree(Point, this);
      throw new Error("isTorsionFree() has not been declared for the elliptic curve");
    }
    clearCofactor() {
      const { h: cofactor, clearCofactor } = CURVE;
      if (cofactor === _1n5)
        return this;
      if (clearCofactor)
        return clearCofactor(Point, this);
      return this.multiplyUnsafe(CURVE.h);
    }
    toRawBytes(isCompressed = true) {
      this.assertValidity();
      return toBytes8(Point, this, isCompressed);
    }
    toHex(isCompressed = true) {
      return bytesToHex2(this.toRawBytes(isCompressed));
    }
  }
  Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
  Point.ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
  const _bits = CURVE.nBitLength;
  const wnaf = wNAF(Point, CURVE.endo ? Math.ceil(_bits / 2) : _bits);
  return {
    CURVE,
    ProjectivePoint: Point,
    normPrivateKeyToScalar,
    weierstrassEquation,
    isWithinCurveOrder
  };
}
function weierstrass(curveDef) {
  const CURVE = validateOpts(curveDef);
  const { Fp, n: CURVE_ORDER } = CURVE;
  const compressedLen = Fp.BYTES + 1;
  const uncompressedLen = 2 * Fp.BYTES + 1;
  function isValidFieldElement(num) {
    return _0n5 < num && num < Fp.ORDER;
  }
  function modN(a) {
    return mod(a, CURVE_ORDER);
  }
  function invN(a) {
    return invert(a, CURVE_ORDER);
  }
  const { ProjectivePoint: Point, normPrivateKeyToScalar, weierstrassEquation, isWithinCurveOrder } = weierstrassPoints({
    ...CURVE,
    toBytes(_c, point, isCompressed) {
      const a = point.toAffine();
      const x = Fp.toBytes(a.x);
      const cat = concatBytes3;
      if (isCompressed) {
        return cat(Uint8Array.from([point.hasEvenY() ? 2 : 3]), x);
      } else {
        return cat(Uint8Array.from([4]), x, Fp.toBytes(a.y));
      }
    },
    fromBytes(bytes2) {
      const len = bytes2.length;
      const head = bytes2[0];
      const tail = bytes2.subarray(1);
      if (len === compressedLen && (head === 2 || head === 3)) {
        const x = bytesToNumberBE(tail);
        if (!isValidFieldElement(x))
          throw new Error("Point is not on curve");
        const y2 = weierstrassEquation(x);
        let y;
        try {
          y = Fp.sqrt(y2);
        } catch (sqrtError) {
          const suffix = sqrtError instanceof Error ? ": " + sqrtError.message : "";
          throw new Error("Point is not on curve" + suffix);
        }
        const isYOdd = (y & _1n5) === _1n5;
        const isHeadOdd = (head & 1) === 1;
        if (isHeadOdd !== isYOdd)
          y = Fp.neg(y);
        return { x, y };
      } else if (len === uncompressedLen && head === 4) {
        const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
        const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
        return { x, y };
      } else {
        throw new Error(`Point of length ${len} was invalid. Expected ${compressedLen} compressed bytes or ${uncompressedLen} uncompressed bytes`);
      }
    }
  });
  const numToNByteStr = (num) => bytesToHex2(numberToBytesBE(num, CURVE.nByteLength));
  function isBiggerThanHalfOrder(number2) {
    const HALF = CURVE_ORDER >> _1n5;
    return number2 > HALF;
  }
  function normalizeS(s) {
    return isBiggerThanHalfOrder(s) ? modN(-s) : s;
  }
  const slcNum = (b, from, to) => bytesToNumberBE(b.slice(from, to));

  class Signature {
    constructor(r, s, recovery) {
      this.r = r;
      this.s = s;
      this.recovery = recovery;
      this.assertValidity();
    }
    static fromCompact(hex) {
      const l = CURVE.nByteLength;
      hex = ensureBytes("compactSignature", hex, l * 2);
      return new Signature(slcNum(hex, 0, l), slcNum(hex, l, 2 * l));
    }
    static fromDER(hex) {
      const { r, s } = DER.toSig(ensureBytes("DER", hex));
      return new Signature(r, s);
    }
    assertValidity() {
      if (!isWithinCurveOrder(this.r))
        throw new Error("r must be 0 < r < CURVE.n");
      if (!isWithinCurveOrder(this.s))
        throw new Error("s must be 0 < s < CURVE.n");
    }
    addRecoveryBit(recovery) {
      return new Signature(this.r, this.s, recovery);
    }
    recoverPublicKey(msgHash) {
      const { r, s, recovery: rec } = this;
      const h = bits2int_modN(ensureBytes("msgHash", msgHash));
      if (rec == null || ![0, 1, 2, 3].includes(rec))
        throw new Error("recovery id invalid");
      const radj = rec === 2 || rec === 3 ? r + CURVE.n : r;
      if (radj >= Fp.ORDER)
        throw new Error("recovery id 2 or 3 invalid");
      const prefix = (rec & 1) === 0 ? "02" : "03";
      const R = Point.fromHex(prefix + numToNByteStr(radj));
      const ir = invN(radj);
      const u1 = modN(-h * ir);
      const u2 = modN(s * ir);
      const Q = Point.BASE.multiplyAndAddUnsafe(R, u1, u2);
      if (!Q)
        throw new Error("point at infinify");
      Q.assertValidity();
      return Q;
    }
    hasHighS() {
      return isBiggerThanHalfOrder(this.s);
    }
    normalizeS() {
      return this.hasHighS() ? new Signature(this.r, modN(-this.s), this.recovery) : this;
    }
    toDERRawBytes() {
      return hexToBytes2(this.toDERHex());
    }
    toDERHex() {
      return DER.hexFromSig({ r: this.r, s: this.s });
    }
    toCompactRawBytes() {
      return hexToBytes2(this.toCompactHex());
    }
    toCompactHex() {
      return numToNByteStr(this.r) + numToNByteStr(this.s);
    }
  }
  const utils11 = {
    isValidPrivateKey(privateKey) {
      try {
        normPrivateKeyToScalar(privateKey);
        return true;
      } catch (error) {
        return false;
      }
    },
    normPrivateKeyToScalar,
    randomPrivateKey: () => {
      const length = getMinHashLength(CURVE.n);
      return mapHashToField(CURVE.randomBytes(length), CURVE.n);
    },
    precompute(windowSize = 8, point = Point.BASE) {
      point._setWindowSize(windowSize);
      point.multiply(BigInt(3));
      return point;
    }
  };
  function getPublicKey(privateKey, isCompressed = true) {
    return Point.fromPrivateKey(privateKey).toRawBytes(isCompressed);
  }
  function isProbPub(item) {
    const arr = isBytes2(item);
    const str = typeof item === "string";
    const len = (arr || str) && item.length;
    if (arr)
      return len === compressedLen || len === uncompressedLen;
    if (str)
      return len === 2 * compressedLen || len === 2 * uncompressedLen;
    if (item instanceof Point)
      return true;
    return false;
  }
  function getSharedSecret(privateA, publicB, isCompressed = true) {
    if (isProbPub(privateA))
      throw new Error("first arg must be private key");
    if (!isProbPub(publicB))
      throw new Error("second arg must be public key");
    const b = Point.fromHex(publicB);
    return b.multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
  }
  const bits2int = CURVE.bits2int || function(bytes2) {
    const num = bytesToNumberBE(bytes2);
    const delta = bytes2.length * 8 - CURVE.nBitLength;
    return delta > 0 ? num >> BigInt(delta) : num;
  };
  const bits2int_modN = CURVE.bits2int_modN || function(bytes2) {
    return modN(bits2int(bytes2));
  };
  const ORDER_MASK = bitMask(CURVE.nBitLength);
  function int2octets(num) {
    if (typeof num !== "bigint")
      throw new Error("bigint expected");
    if (!(_0n5 <= num && num < ORDER_MASK))
      throw new Error(`bigint expected < 2^${CURVE.nBitLength}`);
    return numberToBytesBE(num, CURVE.nByteLength);
  }
  function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
    if (["recovered", "canonical"].some((k) => (k in opts)))
      throw new Error("sign() legacy options not supported");
    const { hash: hash3, randomBytes: randomBytes2 } = CURVE;
    let { lowS, prehash, extraEntropy: ent } = opts;
    if (lowS == null)
      lowS = true;
    msgHash = ensureBytes("msgHash", msgHash);
    if (prehash)
      msgHash = ensureBytes("prehashed msgHash", hash3(msgHash));
    const h1int = bits2int_modN(msgHash);
    const d = normPrivateKeyToScalar(privateKey);
    const seedArgs = [int2octets(d), int2octets(h1int)];
    if (ent != null && ent !== false) {
      const e = ent === true ? randomBytes2(Fp.BYTES) : ent;
      seedArgs.push(ensureBytes("extraEntropy", e));
    }
    const seed = concatBytes3(...seedArgs);
    const m = h1int;
    function k2sig(kBytes) {
      const k = bits2int(kBytes);
      if (!isWithinCurveOrder(k))
        return;
      const ik = invN(k);
      const q = Point.BASE.multiply(k).toAffine();
      const r = modN(q.x);
      if (r === _0n5)
        return;
      const s = modN(ik * modN(m + r * d));
      if (s === _0n5)
        return;
      let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n5);
      let normS = s;
      if (lowS && isBiggerThanHalfOrder(s)) {
        normS = normalizeS(s);
        recovery ^= 1;
      }
      return new Signature(r, normS, recovery);
    }
    return { seed, k2sig };
  }
  const defaultSigOpts = { lowS: CURVE.lowS, prehash: false };
  const defaultVerOpts = { lowS: CURVE.lowS, prehash: false };
  function sign(msgHash, privKey, opts = defaultSigOpts) {
    const { seed, k2sig } = prepSig(msgHash, privKey, opts);
    const C = CURVE;
    const drbg = createHmacDrbg(C.hash.outputLen, C.nByteLength, C.hmac);
    return drbg(seed, k2sig);
  }
  Point.BASE._setWindowSize(8);
  function verify(signature3, msgHash, publicKey, opts = defaultVerOpts) {
    const sg = signature3;
    msgHash = ensureBytes("msgHash", msgHash);
    publicKey = ensureBytes("publicKey", publicKey);
    if ("strict" in opts)
      throw new Error("options.strict was renamed to lowS");
    const { lowS, prehash } = opts;
    let _sig = undefined;
    let P;
    try {
      if (typeof sg === "string" || isBytes2(sg)) {
        try {
          _sig = Signature.fromDER(sg);
        } catch (derError) {
          if (!(derError instanceof DER.Err))
            throw derError;
          _sig = Signature.fromCompact(sg);
        }
      } else if (typeof sg === "object" && typeof sg.r === "bigint" && typeof sg.s === "bigint") {
        const { r: r2, s: s2 } = sg;
        _sig = new Signature(r2, s2);
      } else {
        throw new Error("PARSE");
      }
      P = Point.fromHex(publicKey);
    } catch (error) {
      if (error.message === "PARSE")
        throw new Error(`signature must be Signature instance, Uint8Array or hex string`);
      return false;
    }
    if (lowS && _sig.hasHighS())
      return false;
    if (prehash)
      msgHash = CURVE.hash(msgHash);
    const { r, s } = _sig;
    const h = bits2int_modN(msgHash);
    const is = invN(s);
    const u1 = modN(h * is);
    const u2 = modN(r * is);
    const R = Point.BASE.multiplyAndAddUnsafe(P, u1, u2)?.toAffine();
    if (!R)
      return false;
    const v = modN(R.x);
    return v === r;
  }
  return {
    CURVE,
    getPublicKey,
    getSharedSecret,
    sign,
    verify,
    ProjectivePoint: Point,
    Signature,
    utils: utils11
  };
}
function SWUFpSqrtRatio(Fp, Z) {
  const q = Fp.ORDER;
  let l = _0n5;
  for (let o = q - _1n5;o % _2n4 === _0n5; o /= _2n4)
    l += _1n5;
  const c1 = l;
  const _2n_pow_c1_1 = _2n4 << c1 - _1n5 - _1n5;
  const _2n_pow_c1 = _2n_pow_c1_1 * _2n4;
  const c2 = (q - _1n5) / _2n_pow_c1;
  const c3 = (c2 - _1n5) / _2n4;
  const c4 = _2n_pow_c1 - _1n5;
  const c5 = _2n_pow_c1_1;
  const c6 = Fp.pow(Z, c2);
  const c7 = Fp.pow(Z, (c2 + _1n5) / _2n4);
  let sqrtRatio = (u, v) => {
    let tv1 = c6;
    let tv2 = Fp.pow(v, c4);
    let tv3 = Fp.sqr(tv2);
    tv3 = Fp.mul(tv3, v);
    let tv5 = Fp.mul(u, tv3);
    tv5 = Fp.pow(tv5, c3);
    tv5 = Fp.mul(tv5, tv2);
    tv2 = Fp.mul(tv5, v);
    tv3 = Fp.mul(tv5, u);
    let tv4 = Fp.mul(tv3, tv2);
    tv5 = Fp.pow(tv4, c5);
    let isQR = Fp.eql(tv5, Fp.ONE);
    tv2 = Fp.mul(tv3, c7);
    tv5 = Fp.mul(tv4, tv1);
    tv3 = Fp.cmov(tv2, tv3, isQR);
    tv4 = Fp.cmov(tv5, tv4, isQR);
    for (let i = c1;i > _1n5; i--) {
      let tv52 = i - _2n4;
      tv52 = _2n4 << tv52 - _1n5;
      let tvv5 = Fp.pow(tv4, tv52);
      const e1 = Fp.eql(tvv5, Fp.ONE);
      tv2 = Fp.mul(tv3, tv1);
      tv1 = Fp.mul(tv1, tv1);
      tvv5 = Fp.mul(tv4, tv1);
      tv3 = Fp.cmov(tv2, tv3, e1);
      tv4 = Fp.cmov(tvv5, tv4, e1);
    }
    return { isValid: isQR, value: tv3 };
  };
  if (Fp.ORDER % _4n2 === _3n2) {
    const c12 = (Fp.ORDER - _3n2) / _4n2;
    const c22 = Fp.sqrt(Fp.neg(Z));
    sqrtRatio = (u, v) => {
      let tv1 = Fp.sqr(v);
      const tv2 = Fp.mul(u, v);
      tv1 = Fp.mul(tv1, tv2);
      let y1 = Fp.pow(tv1, c12);
      y1 = Fp.mul(y1, tv2);
      const y2 = Fp.mul(y1, c22);
      const tv3 = Fp.mul(Fp.sqr(y1), v);
      const isQR = Fp.eql(tv3, u);
      let y = Fp.cmov(y2, y1, isQR);
      return { isValid: isQR, value: y };
    };
  }
  return sqrtRatio;
}
function mapToCurveSimpleSWU(Fp, opts) {
  validateField(Fp);
  if (!Fp.isValid(opts.A) || !Fp.isValid(opts.B) || !Fp.isValid(opts.Z))
    throw new Error("mapToCurveSimpleSWU: invalid opts");
  const sqrtRatio = SWUFpSqrtRatio(Fp, opts.Z);
  if (!Fp.isOdd)
    throw new Error("Fp.isOdd is not implemented!");
  return (u) => {
    let tv1, tv2, tv3, tv4, tv5, tv6, x, y;
    tv1 = Fp.sqr(u);
    tv1 = Fp.mul(tv1, opts.Z);
    tv2 = Fp.sqr(tv1);
    tv2 = Fp.add(tv2, tv1);
    tv3 = Fp.add(tv2, Fp.ONE);
    tv3 = Fp.mul(tv3, opts.B);
    tv4 = Fp.cmov(opts.Z, Fp.neg(tv2), !Fp.eql(tv2, Fp.ZERO));
    tv4 = Fp.mul(tv4, opts.A);
    tv2 = Fp.sqr(tv3);
    tv6 = Fp.sqr(tv4);
    tv5 = Fp.mul(tv6, opts.A);
    tv2 = Fp.add(tv2, tv5);
    tv2 = Fp.mul(tv2, tv3);
    tv6 = Fp.mul(tv6, tv4);
    tv5 = Fp.mul(tv6, opts.B);
    tv2 = Fp.add(tv2, tv5);
    x = Fp.mul(tv1, tv3);
    const { isValid, value } = sqrtRatio(tv2, tv6);
    y = Fp.mul(tv1, u);
    y = Fp.mul(y, value);
    x = Fp.cmov(x, tv3, isValid);
    y = Fp.cmov(y, value, isValid);
    const e1 = Fp.isOdd(u) === Fp.isOdd(y);
    y = Fp.cmov(Fp.neg(y), y, e1);
    x = Fp.div(x, tv4);
    return { x, y };
  };
}
var validatePointOpts, validateOpts, b2n, h2b, DER, _0n5, _1n5, _2n4, _3n2, _4n2;
var init_weierstrass = __esm(() => {
  init_modular();
  init_utils4();
  init_utils4();
  init_curve();
  validatePointOpts = function(curve2) {
    const opts = validateBasic(curve2);
    validateObject(opts, {
      a: "field",
      b: "field"
    }, {
      allowedPrivateKeyLengths: "array",
      wrapPrivateKey: "boolean",
      isTorsionFree: "function",
      clearCofactor: "function",
      allowInfinityPoint: "boolean",
      fromBytes: "function",
      toBytes: "function"
    });
    const { endo, Fp, a } = opts;
    if (endo) {
      if (!Fp.eql(a, Fp.ZERO)) {
        throw new Error("Endomorphism can only be defined for Koblitz curves that have a=0");
      }
      if (typeof endo !== "object" || typeof endo.beta !== "bigint" || typeof endo.splitScalar !== "function") {
        throw new Error("Expected endomorphism with beta: bigint and splitScalar: function");
      }
    }
    return Object.freeze({ ...opts });
  };
  validateOpts = function(curve2) {
    const opts = validateBasic(curve2);
    validateObject(opts, {
      hash: "hash",
      hmac: "function",
      randomBytes: "function"
    }, {
      bits2int: "function",
      bits2int_modN: "function",
      lowS: "boolean"
    });
    return Object.freeze({ lowS: true, ...opts });
  };
  /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  ({ bytesToNumberBE: b2n, hexToBytes: h2b } = exports_utils);
  DER = {
    Err: class DERErr extends Error {
      constructor(m = "") {
        super(m);
      }
    },
    _parseInt(data3) {
      const { Err: E } = DER;
      if (data3.length < 2 || data3[0] !== 2)
        throw new E("Invalid signature integer tag");
      const len = data3[1];
      const res = data3.subarray(2, len + 2);
      if (!len || res.length !== len)
        throw new E("Invalid signature integer: wrong length");
      if (res[0] & 128)
        throw new E("Invalid signature integer: negative");
      if (res[0] === 0 && !(res[1] & 128))
        throw new E("Invalid signature integer: unnecessary leading zero");
      return { d: b2n(res), l: data3.subarray(len + 2) };
    },
    toSig(hex) {
      const { Err: E } = DER;
      const data3 = typeof hex === "string" ? h2b(hex) : hex;
      abytes(data3);
      let l = data3.length;
      if (l < 2 || data3[0] != 48)
        throw new E("Invalid signature tag");
      if (data3[1] !== l - 2)
        throw new E("Invalid signature: incorrect length");
      const { d: r, l: sBytes } = DER._parseInt(data3.subarray(2));
      const { d: s, l: rBytesLeft } = DER._parseInt(sBytes);
      if (rBytesLeft.length)
        throw new E("Invalid signature: left bytes after parsing");
      return { r, s };
    },
    hexFromSig(sig) {
      const slice6 = (s2) => Number.parseInt(s2[0], 16) & 8 ? "00" + s2 : s2;
      const h = (num) => {
        const hex = num.toString(16);
        return hex.length & 1 ? `0${hex}` : hex;
      };
      const s = slice6(h(sig.s));
      const r = slice6(h(sig.r));
      const shl = s.length / 2;
      const rhl = r.length / 2;
      const sl = h(shl);
      const rl = h(rhl);
      return `30${h(rhl + shl + 4)}02${rl}${r}02${sl}${s}`;
    }
  };
  _0n5 = BigInt(0);
  _1n5 = BigInt(1);
  _2n4 = BigInt(2);
  _3n2 = BigInt(3);
  _4n2 = BigInt(4);
});

// node_modules/@noble/curves/esm/abstract/hash-to-curve.js
function expand_message_xmd(msg, DST, lenInBytes, H) {
  abytes(msg);
  abytes(DST);
  anum(lenInBytes);
  if (DST.length > 255)
    DST = H(concatBytes3(utf8ToBytes2("H2C-OVERSIZE-DST-"), DST));
  const { outputLen: b_in_bytes, blockLen: r_in_bytes } = H;
  const ell = Math.ceil(lenInBytes / b_in_bytes);
  if (ell > 255)
    throw new Error("Invalid xmd length");
  const DST_prime = concatBytes3(DST, i2osp(DST.length, 1));
  const Z_pad = i2osp(0, r_in_bytes);
  const l_i_b_str = i2osp(lenInBytes, 2);
  const b = new Array(ell);
  const b_0 = H(concatBytes3(Z_pad, msg, l_i_b_str, i2osp(0, 1), DST_prime));
  b[0] = H(concatBytes3(b_0, i2osp(1, 1), DST_prime));
  for (let i = 1;i <= ell; i++) {
    const args = [strxor(b_0, b[i - 1]), i2osp(i + 1, 1), DST_prime];
    b[i] = H(concatBytes3(...args));
  }
  const pseudo_random_bytes = concatBytes3(...b);
  return pseudo_random_bytes.slice(0, lenInBytes);
}
function expand_message_xof(msg, DST, lenInBytes, k, H) {
  abytes(msg);
  abytes(DST);
  anum(lenInBytes);
  if (DST.length > 255) {
    const dkLen = Math.ceil(2 * k / 8);
    DST = H.create({ dkLen }).update(utf8ToBytes2("H2C-OVERSIZE-DST-")).update(DST).digest();
  }
  if (lenInBytes > 65535 || DST.length > 255)
    throw new Error("expand_message_xof: invalid lenInBytes");
  return H.create({ dkLen: lenInBytes }).update(msg).update(i2osp(lenInBytes, 2)).update(DST).update(i2osp(DST.length, 1)).digest();
}
function hash_to_field(msg, count, options) {
  validateObject(options, {
    DST: "stringOrUint8Array",
    p: "bigint",
    m: "isSafeInteger",
    k: "isSafeInteger",
    hash: "hash"
  });
  const { p, k, m, hash: hash3, expand, DST: _DST } = options;
  abytes(msg);
  anum(count);
  const DST = typeof _DST === "string" ? utf8ToBytes2(_DST) : _DST;
  const log2p = p.toString(2).length;
  const L = Math.ceil((log2p + k) / 8);
  const len_in_bytes = count * m * L;
  let prb;
  if (expand === "xmd") {
    prb = expand_message_xmd(msg, DST, len_in_bytes, hash3);
  } else if (expand === "xof") {
    prb = expand_message_xof(msg, DST, len_in_bytes, k, hash3);
  } else if (expand === "_internal_pass") {
    prb = msg;
  } else {
    throw new Error('expand must be "xmd" or "xof"');
  }
  const u = new Array(count);
  for (let i = 0;i < count; i++) {
    const e = new Array(m);
    for (let j = 0;j < m; j++) {
      const elm_offset = L * (j + i * m);
      const tv = prb.subarray(elm_offset, elm_offset + L);
      e[j] = mod(os2ip(tv), p);
    }
    u[i] = e;
  }
  return u;
}
function isogenyMap(field, map) {
  const COEFF = map.map((i) => Array.from(i).reverse());
  return (x, y) => {
    const [xNum, xDen, yNum, yDen] = COEFF.map((val) => val.reduce((acc, i) => field.add(field.mul(acc, x), i)));
    x = field.div(xNum, xDen);
    y = field.mul(y, field.div(yNum, yDen));
    return { x, y };
  };
}
function createHasher(Point, mapToCurve, def) {
  if (typeof mapToCurve !== "function")
    throw new Error("mapToCurve() must be defined");
  return {
    hashToCurve(msg, options) {
      const u = hash_to_field(msg, 2, { ...def, DST: def.DST, ...options });
      const u0 = Point.fromAffine(mapToCurve(u[0]));
      const u1 = Point.fromAffine(mapToCurve(u[1]));
      const P = u0.add(u1).clearCofactor();
      P.assertValidity();
      return P;
    },
    encodeToCurve(msg, options) {
      const u = hash_to_field(msg, 1, { ...def, DST: def.encodeDST, ...options });
      const P = Point.fromAffine(mapToCurve(u[0])).clearCofactor();
      P.assertValidity();
      return P;
    }
  };
}
var i2osp, strxor, anum, os2ip;
var init_hash_to_curve = __esm(() => {
  init_modular();
  init_utils4();
  i2osp = function(value, length) {
    if (value < 0 || value >= 1 << 8 * length) {
      throw new Error(`bad I2OSP call: value=${value} length=${length}`);
    }
    const res = Array.from({ length }).fill(0);
    for (let i = length - 1;i >= 0; i--) {
      res[i] = value & 255;
      value >>>= 8;
    }
    return new Uint8Array(res);
  };
  strxor = function(a, b) {
    const arr = new Uint8Array(a.length);
    for (let i = 0;i < a.length; i++) {
      arr[i] = a[i] ^ b[i];
    }
    return arr;
  };
  anum = function(item) {
    if (!Number.isSafeInteger(item))
      throw new Error("number expected");
  };
  os2ip = bytesToNumberBE;
});

// node_modules/@noble/hashes/esm/hmac.js
class HMAC extends Hash {
  constructor(hash3, _key) {
    super();
    this.finished = false;
    this.destroyed = false;
    hash(hash3);
    const key = toBytes2(_key);
    this.iHash = hash3.create();
    if (typeof this.iHash.update !== "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad5 = new Uint8Array(blockLen);
    pad5.set(key.length > blockLen ? hash3.create().update(key).digest() : key);
    for (let i = 0;i < pad5.length; i++)
      pad5[i] ^= 54;
    this.iHash.update(pad5);
    this.oHash = hash3.create();
    for (let i = 0;i < pad5.length; i++)
      pad5[i] ^= 54 ^ 92;
    this.oHash.update(pad5);
    pad5.fill(0);
  }
  update(buf) {
    exists(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    exists(this);
    bytes(out, this.outputLen);
    this.finished = true;
    this.iHash.digestInto(out);
    this.oHash.update(out);
    this.oHash.digestInto(out);
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.oHash.outputLen);
    this.digestInto(out);
    return out;
  }
  _cloneInto(to) {
    to || (to = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
    to = to;
    to.finished = finished;
    to.destroyed = destroyed;
    to.blockLen = blockLen;
    to.outputLen = outputLen;
    to.oHash = oHash._cloneInto(to.oHash);
    to.iHash = iHash._cloneInto(to.iHash);
    return to;
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
}
var hmac;
var init_hmac = __esm(() => {
  init__assert();
  init_utils2();
  hmac = (hash3, key, message) => new HMAC(hash3, key).update(message).digest();
  hmac.create = (hash3, key) => new HMAC(hash3, key);
});

// node_modules/@noble/curves/esm/_shortw_utils.js
function getHash(hash3) {
  return {
    hash: hash3,
    hmac: (key, ...msgs) => hmac(hash3, key, concatBytes(...msgs)),
    randomBytes
  };
}
function createCurve(curveDef, defHash) {
  const create = (hash3) => weierstrass({ ...curveDef, ...getHash(hash3) });
  return Object.freeze({ ...create(defHash), create });
}
var init__shortw_utils = __esm(() => {
  init_hmac();
  init_utils2();
  init_weierstrass();
  /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
});

// node_modules/@noble/curves/esm/secp256k1.js
var exports_secp256k1 = {};
__export(exports_secp256k1, {
  secp256k1: () => {
    {
      return secp256k1;
    }
  },
  schnorr: () => {
    {
      return schnorr;
    }
  },
  hashToCurve: () => {
    {
      return hashToCurve;
    }
  },
  encodeToCurve: () => {
    {
      return encodeToCurve;
    }
  }
});
var sqrtMod, taggedHash, schnorrGetExtPubKey, lift_x, challenge, schnorrGetPublicKey, schnorrSign, schnorrVerify, secp256k1P, secp256k1N, _1n6, _2n5, divNearest, Fp, secp256k1, _0n6, fe, ge, TAGGED_HASH_PREFIXES, pointToBytes, numTo32b, modP, modN, Point, GmulAdd, schnorr, isoMap, mapSWU, htf, hashToCurve, encodeToCurve;
var init_secp256k1 = __esm(() => {
  init_sha256();
  init_utils2();
  init_modular();
  init_weierstrass();
  init_utils4();
  init_hash_to_curve();
  init__shortw_utils();
  sqrtMod = function(y) {
    const P = secp256k1P;
    const _3n3 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
    const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
    const b2 = y * y * y % P;
    const b3 = b2 * b2 * y % P;
    const b6 = pow2(b3, _3n3, P) * b3 % P;
    const b9 = pow2(b6, _3n3, P) * b3 % P;
    const b11 = pow2(b9, _2n5, P) * b2 % P;
    const b22 = pow2(b11, _11n, P) * b11 % P;
    const b44 = pow2(b22, _22n, P) * b22 % P;
    const b88 = pow2(b44, _44n, P) * b44 % P;
    const b176 = pow2(b88, _88n, P) * b88 % P;
    const b220 = pow2(b176, _44n, P) * b44 % P;
    const b223 = pow2(b220, _3n3, P) * b3 % P;
    const t1 = pow2(b223, _23n, P) * b22 % P;
    const t2 = pow2(t1, _6n, P) * b2 % P;
    const root = pow2(t2, _2n5, P);
    if (!Fp.eql(Fp.sqr(root), y))
      throw new Error("Cannot find square root");
    return root;
  };
  taggedHash = function(tag, ...messages) {
    let tagP = TAGGED_HASH_PREFIXES[tag];
    if (tagP === undefined) {
      const tagH = sha256(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
      tagP = concatBytes3(tagH, tagH);
      TAGGED_HASH_PREFIXES[tag] = tagP;
    }
    return sha256(concatBytes3(tagP, ...messages));
  };
  schnorrGetExtPubKey = function(priv) {
    let d_ = secp256k1.utils.normPrivateKeyToScalar(priv);
    let p = Point.fromPrivateKey(d_);
    const scalar = p.hasEvenY() ? d_ : modN(-d_);
    return { scalar, bytes: pointToBytes(p) };
  };
  lift_x = function(x) {
    if (!fe(x))
      throw new Error("bad x: need 0 < x < p");
    const xx = modP(x * x);
    const c = modP(xx * x + BigInt(7));
    let y = sqrtMod(c);
    if (y % _2n5 !== _0n6)
      y = modP(-y);
    const p = new Point(x, y, _1n6);
    p.assertValidity();
    return p;
  };
  challenge = function(...args) {
    return modN(bytesToNumberBE(taggedHash("BIP0340/challenge", ...args)));
  };
  schnorrGetPublicKey = function(privateKey) {
    return schnorrGetExtPubKey(privateKey).bytes;
  };
  schnorrSign = function(message, privateKey, auxRand = randomBytes(32)) {
    const m = ensureBytes("message", message);
    const { bytes: px, scalar: d } = schnorrGetExtPubKey(privateKey);
    const a = ensureBytes("auxRand", auxRand, 32);
    const t = numTo32b(d ^ bytesToNumberBE(taggedHash("BIP0340/aux", a)));
    const rand = taggedHash("BIP0340/nonce", t, px, m);
    const k_ = modN(bytesToNumberBE(rand));
    if (k_ === _0n6)
      throw new Error("sign failed: k is zero");
    const { bytes: rx, scalar: k } = schnorrGetExtPubKey(k_);
    const e = challenge(rx, px, m);
    const sig = new Uint8Array(64);
    sig.set(rx, 0);
    sig.set(numTo32b(modN(k + e * d)), 32);
    if (!schnorrVerify(sig, m, px))
      throw new Error("sign: Invalid signature produced");
    return sig;
  };
  schnorrVerify = function(signature3, message, publicKey) {
    const sig = ensureBytes("signature", signature3, 64);
    const m = ensureBytes("message", message);
    const pub = ensureBytes("publicKey", publicKey, 32);
    try {
      const P = lift_x(bytesToNumberBE(pub));
      const r = bytesToNumberBE(sig.subarray(0, 32));
      if (!fe(r))
        return false;
      const s = bytesToNumberBE(sig.subarray(32, 64));
      if (!ge(s))
        return false;
      const e = challenge(numTo32b(r), pointToBytes(P), m);
      const R = GmulAdd(P, s, modN(-e));
      if (!R || !R.hasEvenY() || R.toAffine().x !== r)
        return false;
      return true;
    } catch (error) {
      return false;
    }
  };
  /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  secp256k1P = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f");
  secp256k1N = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
  _1n6 = BigInt(1);
  _2n5 = BigInt(2);
  divNearest = (a, b) => (a + b / _2n5) / b;
  Fp = Field(secp256k1P, undefined, undefined, { sqrt: sqrtMod });
  secp256k1 = createCurve({
    a: BigInt(0),
    b: BigInt(7),
    Fp,
    n: secp256k1N,
    Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
    Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
    h: BigInt(1),
    lowS: true,
    endo: {
      beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
      splitScalar: (k) => {
        const n = secp256k1N;
        const a1 = BigInt("0x3086d221a7d46bcde86c90e49284eb15");
        const b1 = -_1n6 * BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
        const a2 = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8");
        const b2 = a1;
        const POW_2_128 = BigInt("0x100000000000000000000000000000000");
        const c1 = divNearest(b2 * k, n);
        const c2 = divNearest(-b1 * k, n);
        let k1 = mod(k - c1 * a1 - c2 * a2, n);
        let k2 = mod(-c1 * b1 - c2 * b2, n);
        const k1neg = k1 > POW_2_128;
        const k2neg = k2 > POW_2_128;
        if (k1neg)
          k1 = n - k1;
        if (k2neg)
          k2 = n - k2;
        if (k1 > POW_2_128 || k2 > POW_2_128) {
          throw new Error("splitScalar: Endomorphism failed, k=" + k);
        }
        return { k1neg, k1, k2neg, k2 };
      }
    }
  }, sha256);
  _0n6 = BigInt(0);
  fe = (x) => typeof x === "bigint" && _0n6 < x && x < secp256k1P;
  ge = (x) => typeof x === "bigint" && _0n6 < x && x < secp256k1N;
  TAGGED_HASH_PREFIXES = {};
  pointToBytes = (point) => point.toRawBytes(true).slice(1);
  numTo32b = (n) => numberToBytesBE(n, 32);
  modP = (x) => mod(x, secp256k1P);
  modN = (x) => mod(x, secp256k1N);
  Point = secp256k1.ProjectivePoint;
  GmulAdd = (Q, a, b) => Point.BASE.multiplyAndAddUnsafe(Q, a, b);
  schnorr = (() => ({
    getPublicKey: schnorrGetPublicKey,
    sign: schnorrSign,
    verify: schnorrVerify,
    utils: {
      randomPrivateKey: secp256k1.utils.randomPrivateKey,
      lift_x,
      pointToBytes,
      numberToBytesBE,
      bytesToNumberBE,
      taggedHash,
      mod
    }
  }))();
  isoMap = (() => isogenyMap(Fp, [
    [
      "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa8c7",
      "0x7d3d4c80bc321d5b9f315cea7fd44c5d595d2fc0bf63b92dfff1044f17c6581",
      "0x534c328d23f234e6e2a413deca25caece4506144037c40314ecbd0b53d9dd262",
      "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa88c"
    ],
    [
      "0xd35771193d94918a9ca34ccbb7b640dd86cd409542f8487d9fe6b745781eb49b",
      "0xedadc6f64383dc1df7c4b2d51b54225406d36b641f5e41bbc52a56612a8c6d14",
      "0x0000000000000000000000000000000000000000000000000000000000000001"
    ],
    [
      "0x4bda12f684bda12f684bda12f684bda12f684bda12f684bda12f684b8e38e23c",
      "0xc75e0c32d5cb7c0fa9d0a54b12a0a6d5647ab046d686da6fdffc90fc201d71a3",
      "0x29a6194691f91a73715209ef6512e576722830a201be2018a765e85a9ecee931",
      "0x2f684bda12f684bda12f684bda12f684bda12f684bda12f684bda12f38e38d84"
    ],
    [
      "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffff93b",
      "0x7a06534bb8bdb49fd5e9e6632722c2989467c1bfc8e8d978dfb425d2685c2573",
      "0x6484aa716545ca2cf3a70c3fa8fe337e0a3d21162f0d6299a7bf8192bfd2a76f",
      "0x0000000000000000000000000000000000000000000000000000000000000001"
    ]
  ].map((i) => i.map((j) => BigInt(j)))))();
  mapSWU = (() => mapToCurveSimpleSWU(Fp, {
    A: BigInt("0x3f8731abdd661adca08a5558f0f5d272e953d363cb6f0e5d405447c01a444533"),
    B: BigInt("1771"),
    Z: Fp.create(BigInt("-11"))
  }))();
  htf = (() => createHasher(secp256k1.ProjectivePoint, (scalars) => {
    const { x, y } = mapSWU(Fp.create(scalars[0]));
    return isoMap(x, y);
  }, {
    DST: "secp256k1_XMD:SHA-256_SSWU_RO_",
    encodeDST: "secp256k1_XMD:SHA-256_SSWU_NU_",
    p: Fp.ORDER,
    m: 1,
    k: 128,
    expand: "xmd",
    hash: sha256
  }))();
  hashToCurve = (() => htf.hashToCurve)();
  encodeToCurve = (() => htf.encodeToCurve)();
});

// node_modules/viem/_esm/errors/node.js
class ExecutionRevertedError extends BaseError2 {
  constructor({ cause, message } = {}) {
    const reason = message?.replace("execution reverted: ", "")?.replace("execution reverted", "");
    super(`Execution reverted ${reason ? `with reason: ${reason}` : "for an unknown reason"}.`, {
      cause,
      name: "ExecutionRevertedError"
    });
  }
}

class FeeCapTooHighError extends BaseError2 {
  constructor({ cause, maxFeePerGas } = {}) {
    super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ""}) cannot be higher than the maximum allowed value (2^256-1).`, {
      cause,
      name: "FeeCapTooHighError"
    });
  }
}

class FeeCapTooLowError extends BaseError2 {
  constructor({ cause, maxFeePerGas } = {}) {
    super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)}` : ""} gwei) cannot be lower than the block base fee.`, {
      cause,
      name: "FeeCapTooLowError"
    });
  }
}

class NonceTooHighError extends BaseError2 {
  constructor({ cause, nonce } = {}) {
    super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}is higher than the next one expected.`, { cause, name: "NonceTooHighError" });
  }
}

class NonceTooLowError extends BaseError2 {
  constructor({ cause, nonce } = {}) {
    super([
      `Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}is lower than the current nonce of the account.`,
      "Try increasing the nonce or find the latest nonce with `getTransactionCount`."
    ].join("\n"), { cause, name: "NonceTooLowError" });
  }
}

class NonceMaxValueError extends BaseError2 {
  constructor({ cause, nonce } = {}) {
    super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}exceeds the maximum allowed nonce.`, { cause, name: "NonceMaxValueError" });
  }
}

class InsufficientFundsError extends BaseError2 {
  constructor({ cause } = {}) {
    super([
      "The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account."
    ].join("\n"), {
      cause,
      metaMessages: [
        "This error could arise when the account does not have enough funds to:",
        " - pay for the total gas fee,",
        " - pay for the value to send.",
        " ",
        "The cost of the transaction is calculated as `gas * gas fee + value`, where:",
        " - `gas` is the amount of gas needed for transaction to execute,",
        " - `gas fee` is the gas fee,",
        " - `value` is the amount of ether to send to the recipient."
      ],
      name: "InsufficientFundsError"
    });
  }
}

class IntrinsicGasTooHighError extends BaseError2 {
  constructor({ cause, gas } = {}) {
    super(`The amount of gas ${gas ? `(${gas}) ` : ""}provided for the transaction exceeds the limit allowed for the block.`, {
      cause,
      name: "IntrinsicGasTooHighError"
    });
  }
}

class IntrinsicGasTooLowError extends BaseError2 {
  constructor({ cause, gas } = {}) {
    super(`The amount of gas ${gas ? `(${gas}) ` : ""}provided for the transaction is too low.`, {
      cause,
      name: "IntrinsicGasTooLowError"
    });
  }
}

class TransactionTypeNotSupportedError extends BaseError2 {
  constructor({ cause }) {
    super("The transaction type is not supported for this chain.", {
      cause,
      name: "TransactionTypeNotSupportedError"
    });
  }
}

class TipAboveFeeCapError extends BaseError2 {
  constructor({ cause, maxPriorityFeePerGas, maxFeePerGas } = {}) {
    super([
      `The provided tip (\`maxPriorityFeePerGas\`${maxPriorityFeePerGas ? ` = ${formatGwei(maxPriorityFeePerGas)} gwei` : ""}) cannot be higher than the fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ""}).`
    ].join("\n"), {
      cause,
      name: "TipAboveFeeCapError"
    });
  }
}

class UnknownNodeError extends BaseError2 {
  constructor({ cause }) {
    super(`An error occurred while executing: ${cause?.shortMessage}`, {
      cause,
      name: "UnknownNodeError"
    });
  }
}
var init_node = __esm(() => {
  init_formatGwei();
  init_base();
  Object.defineProperty(ExecutionRevertedError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 3
  });
  Object.defineProperty(ExecutionRevertedError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /execution reverted/
  });
  Object.defineProperty(FeeCapTooHighError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /max fee per gas higher than 2\^256-1|fee cap higher than 2\^256-1/
  });
  Object.defineProperty(FeeCapTooLowError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /max fee per gas less than block base fee|fee cap less than block base fee|transaction is outdated/
  });
  Object.defineProperty(NonceTooHighError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /nonce too high/
  });
  Object.defineProperty(NonceTooLowError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /nonce too low|transaction already imported|already known/
  });
  Object.defineProperty(NonceMaxValueError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /nonce has max value/
  });
  Object.defineProperty(InsufficientFundsError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /insufficient funds/
  });
  Object.defineProperty(IntrinsicGasTooHighError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /intrinsic gas too high|gas limit reached/
  });
  Object.defineProperty(IntrinsicGasTooLowError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /intrinsic gas too low/
  });
  Object.defineProperty(TransactionTypeNotSupportedError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /transaction type not valid/
  });
  Object.defineProperty(TipAboveFeeCapError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /max priority fee per gas higher than max fee per gas|tip higher than fee cap/
  });
});

// node_modules/viem/_esm/utils/errors/getNodeError.js
function getNodeError(err, args) {
  const message = (err.details || "").toLowerCase();
  const executionRevertedError = err instanceof BaseError2 ? err.walk((e) => e.code === ExecutionRevertedError.code) : err;
  if (executionRevertedError instanceof BaseError2)
    return new ExecutionRevertedError({
      cause: err,
      message: executionRevertedError.details
    });
  if (ExecutionRevertedError.nodeMessage.test(message))
    return new ExecutionRevertedError({
      cause: err,
      message: err.details
    });
  if (FeeCapTooHighError.nodeMessage.test(message))
    return new FeeCapTooHighError({
      cause: err,
      maxFeePerGas: args?.maxFeePerGas
    });
  if (FeeCapTooLowError.nodeMessage.test(message))
    return new FeeCapTooLowError({
      cause: err,
      maxFeePerGas: args?.maxFeePerGas
    });
  if (NonceTooHighError.nodeMessage.test(message))
    return new NonceTooHighError({ cause: err, nonce: args?.nonce });
  if (NonceTooLowError.nodeMessage.test(message))
    return new NonceTooLowError({ cause: err, nonce: args?.nonce });
  if (NonceMaxValueError.nodeMessage.test(message))
    return new NonceMaxValueError({ cause: err, nonce: args?.nonce });
  if (InsufficientFundsError.nodeMessage.test(message))
    return new InsufficientFundsError({ cause: err });
  if (IntrinsicGasTooHighError.nodeMessage.test(message))
    return new IntrinsicGasTooHighError({ cause: err, gas: args?.gas });
  if (IntrinsicGasTooLowError.nodeMessage.test(message))
    return new IntrinsicGasTooLowError({ cause: err, gas: args?.gas });
  if (TransactionTypeNotSupportedError.nodeMessage.test(message))
    return new TransactionTypeNotSupportedError({ cause: err });
  if (TipAboveFeeCapError.nodeMessage.test(message))
    return new TipAboveFeeCapError({
      cause: err,
      maxFeePerGas: args?.maxFeePerGas,
      maxPriorityFeePerGas: args?.maxPriorityFeePerGas
    });
  return new UnknownNodeError({
    cause: err
  });
}
var init_getNodeError = __esm(() => {
  init_base();
  init_node();
});

// node_modules/viem/_esm/utils/formatters/extract.js
function extract(value_, { format }) {
  if (!format)
    return {};
  const value = {};
  function extract_(formatted2) {
    const keys = Object.keys(formatted2);
    for (const key of keys) {
      if (key in value_)
        value[key] = value_[key];
      if (formatted2[key] && typeof formatted2[key] === "object" && !Array.isArray(formatted2[key]))
        extract_(formatted2[key]);
    }
  }
  const formatted = format(value_ || {});
  extract_(formatted);
  return value;
}
var init_extract = __esm(() => {
});

// node_modules/viem/_esm/utils/formatters/transactionRequest.js
function formatTransactionRequest(request2) {
  const rpcRequest = {};
  if (typeof request2.authorizationList !== "undefined")
    rpcRequest.authorizationList = formatAuthorizationList(request2.authorizationList);
  if (typeof request2.accessList !== "undefined")
    rpcRequest.accessList = request2.accessList;
  if (typeof request2.blobVersionedHashes !== "undefined")
    rpcRequest.blobVersionedHashes = request2.blobVersionedHashes;
  if (typeof request2.blobs !== "undefined") {
    if (typeof request2.blobs[0] !== "string")
      rpcRequest.blobs = request2.blobs.map((x) => bytesToHex(x));
    else
      rpcRequest.blobs = request2.blobs;
  }
  if (typeof request2.data !== "undefined")
    rpcRequest.data = request2.data;
  if (typeof request2.from !== "undefined")
    rpcRequest.from = request2.from;
  if (typeof request2.gas !== "undefined")
    rpcRequest.gas = numberToHex(request2.gas);
  if (typeof request2.gasPrice !== "undefined")
    rpcRequest.gasPrice = numberToHex(request2.gasPrice);
  if (typeof request2.maxFeePerBlobGas !== "undefined")
    rpcRequest.maxFeePerBlobGas = numberToHex(request2.maxFeePerBlobGas);
  if (typeof request2.maxFeePerGas !== "undefined")
    rpcRequest.maxFeePerGas = numberToHex(request2.maxFeePerGas);
  if (typeof request2.maxPriorityFeePerGas !== "undefined")
    rpcRequest.maxPriorityFeePerGas = numberToHex(request2.maxPriorityFeePerGas);
  if (typeof request2.nonce !== "undefined")
    rpcRequest.nonce = numberToHex(request2.nonce);
  if (typeof request2.to !== "undefined")
    rpcRequest.to = request2.to;
  if (typeof request2.type !== "undefined")
    rpcRequest.type = rpcTransactionType[request2.type];
  if (typeof request2.value !== "undefined")
    rpcRequest.value = numberToHex(request2.value);
  return rpcRequest;
}
var formatAuthorizationList, rpcTransactionType;
var init_transactionRequest = __esm(() => {
  init_toHex();
  formatAuthorizationList = function(authorizationList) {
    return authorizationList.map((authorization) => ({
      address: authorization.contractAddress,
      r: authorization.r,
      s: authorization.s,
      chainId: numberToHex(authorization.chainId),
      nonce: numberToHex(authorization.nonce),
      ...typeof authorization.yParity !== "undefined" ? { yParity: numberToHex(authorization.yParity) } : {},
      ...typeof authorization.v !== "undefined" && typeof authorization.yParity === "undefined" ? { v: numberToHex(authorization.v) } : {}
    }));
  };
  rpcTransactionType = {
    legacy: "0x0",
    eip2930: "0x1",
    eip1559: "0x2",
    eip4844: "0x3",
    eip7702: "0x4"
  };
});

// node_modules/viem/_esm/utils/stateOverride.js
function serializeStateMapping(stateMapping) {
  if (!stateMapping || stateMapping.length === 0)
    return;
  return stateMapping.reduce((acc, { slot, value }) => {
    if (slot.length !== 66)
      throw new InvalidBytesLengthError({
        size: slot.length,
        targetSize: 66,
        type: "hex"
      });
    if (value.length !== 66)
      throw new InvalidBytesLengthError({
        size: value.length,
        targetSize: 66,
        type: "hex"
      });
    acc[slot] = value;
    return acc;
  }, {});
}
function serializeAccountStateOverride(parameters) {
  const { balance, nonce, state, stateDiff, code } = parameters;
  const rpcAccountStateOverride = {};
  if (code !== undefined)
    rpcAccountStateOverride.code = code;
  if (balance !== undefined)
    rpcAccountStateOverride.balance = numberToHex(balance);
  if (nonce !== undefined)
    rpcAccountStateOverride.nonce = numberToHex(nonce);
  if (state !== undefined)
    rpcAccountStateOverride.state = serializeStateMapping(state);
  if (stateDiff !== undefined) {
    if (rpcAccountStateOverride.state)
      throw new StateAssignmentConflictError;
    rpcAccountStateOverride.stateDiff = serializeStateMapping(stateDiff);
  }
  return rpcAccountStateOverride;
}
function serializeStateOverride(parameters) {
  if (!parameters)
    return;
  const rpcStateOverride = {};
  for (const { address: address4, ...accountState } of parameters) {
    if (!isAddress2(address4, { strict: false }))
      throw new InvalidAddressError({ address: address4 });
    if (rpcStateOverride[address4])
      throw new AccountStateConflictError({ address: address4 });
    rpcStateOverride[address4] = serializeAccountStateOverride(accountState);
  }
  return rpcStateOverride;
}
var init_stateOverride2 = __esm(() => {
  init_address();
  init_data();
  init_stateOverride();
  init_isAddress();
  init_toHex();
});

// node_modules/viem/_esm/utils/transaction/assertRequest.js
function assertRequest(args) {
  const { account: account_, gasPrice, maxFeePerGas, maxPriorityFeePerGas, to } = args;
  const account = account_ ? parseAccount(account_) : undefined;
  if (account && !isAddress2(account.address))
    throw new InvalidAddressError({ address: account.address });
  if (to && !isAddress2(to))
    throw new InvalidAddressError({ address: to });
  if (typeof gasPrice !== "undefined" && (typeof maxFeePerGas !== "undefined" || typeof maxPriorityFeePerGas !== "undefined"))
    throw new FeeConflictError;
  if (maxFeePerGas && maxFeePerGas > 2n ** 256n - 1n)
    throw new FeeCapTooHighError({ maxFeePerGas });
  if (maxPriorityFeePerGas && maxFeePerGas && maxPriorityFeePerGas > maxFeePerGas)
    throw new TipAboveFeeCapError({ maxFeePerGas, maxPriorityFeePerGas });
}
var init_assertRequest = __esm(() => {
  init_parseAccount();
  init_address();
  init_node();
  init_transaction();
  init_isAddress();
});

// node_modules/viem/_esm/utils/address/isAddressEqual.js
function isAddressEqual(a, b) {
  if (!isAddress2(a, { strict: false }))
    throw new InvalidAddressError({ address: a });
  if (!isAddress2(b, { strict: false }))
    throw new InvalidAddressError({ address: b });
  return a.toLowerCase() === b.toLowerCase();
}
var init_isAddressEqual = __esm(() => {
  init_address();
  init_isAddress();
});

// node_modules/viem/_esm/utils/abi/decodeFunctionResult.js
function decodeFunctionResult(parameters) {
  const { abi: abi13, args, functionName, data: data4 } = parameters;
  let abiItem3 = abi13[0];
  if (functionName) {
    const item = getAbiItem({ abi: abi13, args, name: functionName });
    if (!item)
      throw new AbiFunctionNotFoundError(functionName, { docsPath: docsPath4 });
    abiItem3 = item;
  }
  if (abiItem3.type !== "function")
    throw new AbiFunctionNotFoundError(undefined, { docsPath: docsPath4 });
  if (!abiItem3.outputs)
    throw new AbiFunctionOutputsNotFoundError(abiItem3.name, { docsPath: docsPath4 });
  const values = decodeAbiParameters(abiItem3.outputs, data4);
  if (values && values.length > 1)
    return values;
  if (values && values.length === 1)
    return values[0];
  return;
}
var docsPath4;
var init_decodeFunctionResult = __esm(() => {
  init_abi();
  init_decodeAbiParameters();
  init_getAbiItem();
  docsPath4 = "/docs/contract/decodeFunctionResult";
});

// node_modules/viem/_esm/constants/abis.js
var multicall3Abi, universalResolverErrors, universalResolverResolveAbi, universalResolverReverseAbi, textResolverAbi, addressResolverAbi, universalSignatureValidatorAbi;
var init_abis = __esm(() => {
  multicall3Abi = [
    {
      inputs: [
        {
          components: [
            {
              name: "target",
              type: "address"
            },
            {
              name: "allowFailure",
              type: "bool"
            },
            {
              name: "callData",
              type: "bytes"
            }
          ],
          name: "calls",
          type: "tuple[]"
        }
      ],
      name: "aggregate3",
      outputs: [
        {
          components: [
            {
              name: "success",
              type: "bool"
            },
            {
              name: "returnData",
              type: "bytes"
            }
          ],
          name: "returnData",
          type: "tuple[]"
        }
      ],
      stateMutability: "view",
      type: "function"
    }
  ];
  universalResolverErrors = [
    {
      inputs: [],
      name: "ResolverNotFound",
      type: "error"
    },
    {
      inputs: [],
      name: "ResolverWildcardNotSupported",
      type: "error"
    },
    {
      inputs: [],
      name: "ResolverNotContract",
      type: "error"
    },
    {
      inputs: [
        {
          name: "returnData",
          type: "bytes"
        }
      ],
      name: "ResolverError",
      type: "error"
    },
    {
      inputs: [
        {
          components: [
            {
              name: "status",
              type: "uint16"
            },
            {
              name: "message",
              type: "string"
            }
          ],
          name: "errors",
          type: "tuple[]"
        }
      ],
      name: "HttpError",
      type: "error"
    }
  ];
  universalResolverResolveAbi = [
    ...universalResolverErrors,
    {
      name: "resolve",
      type: "function",
      stateMutability: "view",
      inputs: [
        { name: "name", type: "bytes" },
        { name: "data", type: "bytes" }
      ],
      outputs: [
        { name: "", type: "bytes" },
        { name: "address", type: "address" }
      ]
    },
    {
      name: "resolve",
      type: "function",
      stateMutability: "view",
      inputs: [
        { name: "name", type: "bytes" },
        { name: "data", type: "bytes" },
        { name: "gateways", type: "string[]" }
      ],
      outputs: [
        { name: "", type: "bytes" },
        { name: "address", type: "address" }
      ]
    }
  ];
  universalResolverReverseAbi = [
    ...universalResolverErrors,
    {
      name: "reverse",
      type: "function",
      stateMutability: "view",
      inputs: [{ type: "bytes", name: "reverseName" }],
      outputs: [
        { type: "string", name: "resolvedName" },
        { type: "address", name: "resolvedAddress" },
        { type: "address", name: "reverseResolver" },
        { type: "address", name: "resolver" }
      ]
    },
    {
      name: "reverse",
      type: "function",
      stateMutability: "view",
      inputs: [
        { type: "bytes", name: "reverseName" },
        { type: "string[]", name: "gateways" }
      ],
      outputs: [
        { type: "string", name: "resolvedName" },
        { type: "address", name: "resolvedAddress" },
        { type: "address", name: "reverseResolver" },
        { type: "address", name: "resolver" }
      ]
    }
  ];
  textResolverAbi = [
    {
      name: "text",
      type: "function",
      stateMutability: "view",
      inputs: [
        { name: "name", type: "bytes32" },
        { name: "key", type: "string" }
      ],
      outputs: [{ name: "", type: "string" }]
    }
  ];
  addressResolverAbi = [
    {
      name: "addr",
      type: "function",
      stateMutability: "view",
      inputs: [{ name: "name", type: "bytes32" }],
      outputs: [{ name: "", type: "address" }]
    },
    {
      name: "addr",
      type: "function",
      stateMutability: "view",
      inputs: [
        { name: "name", type: "bytes32" },
        { name: "coinType", type: "uint256" }
      ],
      outputs: [{ name: "", type: "bytes" }]
    }
  ];
  universalSignatureValidatorAbi = [
    {
      inputs: [
        {
          name: "_signer",
          type: "address"
        },
        {
          name: "_hash",
          type: "bytes32"
        },
        {
          name: "_signature",
          type: "bytes"
        }
      ],
      stateMutability: "nonpayable",
      type: "constructor"
    }
  ];
});

// node_modules/viem/_esm/constants/contract.js
var aggregate3Signature;
var init_contract2 = __esm(() => {
  aggregate3Signature = "0x82ad56cb";
});

// node_modules/viem/_esm/constants/contracts.js
var deploylessCallViaBytecodeBytecode, deploylessCallViaFactoryBytecode, universalSignatureValidatorByteCode;
var init_contracts = __esm(() => {
  deploylessCallViaBytecodeBytecode = "0x608060405234801561001057600080fd5b5060405161018e38038061018e83398101604081905261002f91610124565b6000808351602085016000f59050803b61004857600080fd5b6000808351602085016000855af16040513d6000823e81610067573d81fd5b3d81f35b634e487b7160e01b600052604160045260246000fd5b600082601f83011261009257600080fd5b81516001600160401b038111156100ab576100ab61006b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156100d9576100d961006b565b6040528181528382016020018510156100f157600080fd5b60005b82811015610110576020818601810151838301820152016100f4565b506000918101602001919091529392505050565b6000806040838503121561013757600080fd5b82516001600160401b0381111561014d57600080fd5b61015985828601610081565b602085015190935090506001600160401b0381111561017757600080fd5b61018385828601610081565b915050925092905056fe";
  deploylessCallViaFactoryBytecode = "0x608060405234801561001057600080fd5b506040516102c03803806102c083398101604081905261002f916101e6565b836001600160a01b03163b6000036100e457600080836001600160a01b03168360405161005c9190610270565b6000604051808303816000865af19150503d8060008114610099576040519150601f19603f3d011682016040523d82523d6000602084013e61009e565b606091505b50915091508115806100b857506001600160a01b0386163b155b156100e1578060405163101bb98d60e01b81526004016100d8919061028c565b60405180910390fd5b50505b6000808451602086016000885af16040513d6000823e81610103573d81fd5b3d81f35b80516001600160a01b038116811461011e57600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561015457818101518382015260200161013c565b50506000910152565b600082601f83011261016e57600080fd5b81516001600160401b0381111561018757610187610123565b604051601f8201601f19908116603f011681016001600160401b03811182821017156101b5576101b5610123565b6040528181528382016020018510156101cd57600080fd5b6101de826020830160208701610139565b949350505050565b600080600080608085870312156101fc57600080fd5b61020585610107565b60208601519094506001600160401b0381111561022157600080fd5b61022d8782880161015d565b93505061023c60408601610107565b60608601519092506001600160401b0381111561025857600080fd5b6102648782880161015d565b91505092959194509250565b60008251610282818460208701610139565b9190910192915050565b60208152600082518060208401526102ab816040850160208701610139565b601f01601f1916919091016040019291505056fe";
  universalSignatureValidatorByteCode = "0x608060405234801561001057600080fd5b5060405161069438038061069483398101604081905261002f9161051e565b600061003c848484610048565b9050806000526001601ff35b60007f64926492649264926492649264926492649264926492649264926492649264926100748361040c565b036101e7576000606080848060200190518101906100929190610577565b60405192955090935091506000906001600160a01b038516906100b69085906105dd565b6000604051808303816000865af19150503d80600081146100f3576040519150601f19603f3d011682016040523d82523d6000602084013e6100f8565b606091505b50509050876001600160a01b03163b60000361016057806101605760405162461bcd60e51b815260206004820152601e60248201527f5369676e617475726556616c696461746f723a206465706c6f796d656e74000060448201526064015b60405180910390fd5b604051630b135d3f60e11b808252906001600160a01b038a1690631626ba7e90610190908b9087906004016105f9565b602060405180830381865afa1580156101ad573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101d19190610633565b6001600160e01b03191614945050505050610405565b6001600160a01b0384163b1561027a57604051630b135d3f60e11b808252906001600160a01b03861690631626ba7e9061022790879087906004016105f9565b602060405180830381865afa158015610244573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102689190610633565b6001600160e01b031916149050610405565b81516041146102df5760405162461bcd60e51b815260206004820152603a602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e6174757265206c656e6774680000000000006064820152608401610157565b6102e7610425565b5060208201516040808401518451859392600091859190811061030c5761030c61065d565b016020015160f81c9050601b811480159061032b57508060ff16601c14155b1561038c5760405162461bcd60e51b815260206004820152603b602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e617475726520762076616c756500000000006064820152608401610157565b60408051600081526020810180835289905260ff83169181019190915260608101849052608081018390526001600160a01b0389169060019060a0016020604051602081039080840390855afa1580156103ea573d6000803e3d6000fd5b505050602060405103516001600160a01b0316149450505050505b9392505050565b600060208251101561041d57600080fd5b508051015190565b60405180606001604052806003906020820280368337509192915050565b6001600160a01b038116811461045857600080fd5b50565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561048c578181015183820152602001610474565b50506000910152565b600082601f8301126104a657600080fd5b81516001600160401b038111156104bf576104bf61045b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156104ed576104ed61045b565b60405281815283820160200185101561050557600080fd5b610516826020830160208701610471565b949350505050565b60008060006060848603121561053357600080fd5b835161053e81610443565b6020850151604086015191945092506001600160401b0381111561056157600080fd5b61056d86828701610495565b9150509250925092565b60008060006060848603121561058c57600080fd5b835161059781610443565b60208501519093506001600160401b038111156105b357600080fd5b6105bf86828701610495565b604086015190935090506001600160401b0381111561056157600080fd5b600082516105ef818460208701610471565b9190910192915050565b828152604060208201526000825180604084015261061e816060850160208701610471565b601f01601f1916919091016060019392505050565b60006020828403121561064557600080fd5b81516001600160e01b03198116811461040557600080fd5b634e487b7160e01b600052603260045260246000fdfe5369676e617475726556616c696461746f72237265636f7665725369676e6572";
});

// node_modules/viem/_esm/errors/chain.js
class ChainDoesNotSupportContract extends BaseError2 {
  constructor({ blockNumber, chain, contract: contract2 }) {
    super(`Chain "${chain.name}" does not support contract "${contract2.name}".`, {
      metaMessages: [
        "This could be due to any of the following:",
        ...blockNumber && contract2.blockCreated && contract2.blockCreated > blockNumber ? [
          `- The contract "${contract2.name}" was not deployed until block ${contract2.blockCreated} (current block ${blockNumber}).`
        ] : [
          `- The chain does not have the contract "${contract2.name}" configured.`
        ]
      ],
      name: "ChainDoesNotSupportContract"
    });
  }
}

class ClientChainNotConfiguredError extends BaseError2 {
  constructor() {
    super("No chain was provided to the Client.", {
      name: "ClientChainNotConfiguredError"
    });
  }
}
var init_chain = __esm(() => {
  init_base();
});

// node_modules/viem/_esm/utils/abi/encodeDeployData.js
function encodeDeployData(parameters) {
  const { abi: abi14, args, bytecode } = parameters;
  if (!args || args.length === 0)
    return bytecode;
  const description = abi14.find((x) => ("type" in x) && x.type === "constructor");
  if (!description)
    throw new AbiConstructorNotFoundError({ docsPath: docsPath5 });
  if (!("inputs" in description))
    throw new AbiConstructorParamsNotFoundError({ docsPath: docsPath5 });
  if (!description.inputs || description.inputs.length === 0)
    throw new AbiConstructorParamsNotFoundError({ docsPath: docsPath5 });
  const data4 = encodeAbiParameters(description.inputs, args);
  return concatHex([bytecode, data4]);
}
var docsPath5;
var init_encodeDeployData = __esm(() => {
  init_abi();
  init_concat();
  init_encodeAbiParameters();
  docsPath5 = "/docs/contract/encodeDeployData";
});

// node_modules/viem/_esm/utils/chain/getChainContractAddress.js
function getChainContractAddress({ blockNumber, chain: chain2, contract: name }) {
  const contract2 = chain2?.contracts?.[name];
  if (!contract2)
    throw new ChainDoesNotSupportContract({
      chain: chain2,
      contract: { name }
    });
  if (blockNumber && contract2.blockCreated && contract2.blockCreated > blockNumber)
    throw new ChainDoesNotSupportContract({
      blockNumber,
      chain: chain2,
      contract: {
        name,
        blockCreated: contract2.blockCreated
      }
    });
  return contract2.address;
}
var init_getChainContractAddress = __esm(() => {
  init_chain();
});

// node_modules/viem/_esm/utils/errors/getCallError.js
function getCallError(err, { docsPath: docsPath6, ...args }) {
  const cause = (() => {
    const cause2 = getNodeError(err, args);
    if (cause2 instanceof UnknownNodeError)
      return err;
    return cause2;
  })();
  return new CallExecutionError(cause, {
    docsPath: docsPath6,
    ...args
  });
}
var init_getCallError = __esm(() => {
  init_contract();
  init_node();
  init_getNodeError();
});

// node_modules/viem/_esm/utils/promise/createBatchScheduler.js
function createBatchScheduler({ fn, id, shouldSplitBatch, wait = 0, sort }) {
  const exec = async () => {
    const scheduler = getScheduler();
    flush();
    const args = scheduler.map(({ args: args2 }) => args2);
    if (args.length === 0)
      return;
    fn(args).then((data4) => {
      if (sort && Array.isArray(data4))
        data4.sort(sort);
      for (let i = 0;i < scheduler.length; i++) {
        const { pendingPromise } = scheduler[i];
        pendingPromise.resolve?.([data4[i], data4]);
      }
    }).catch((err) => {
      for (let i = 0;i < scheduler.length; i++) {
        const { pendingPromise } = scheduler[i];
        pendingPromise.reject?.(err);
      }
    });
  };
  const flush = () => schedulerCache.delete(id);
  const getBatchedArgs = () => getScheduler().map(({ args }) => args);
  const getScheduler = () => schedulerCache.get(id) || [];
  const setScheduler = (item) => schedulerCache.set(id, [...getScheduler(), item]);
  return {
    flush,
    async schedule(args) {
      const pendingPromise = {};
      const promise = new Promise((resolve, reject) => {
        pendingPromise.resolve = resolve;
        pendingPromise.reject = reject;
      });
      const split2 = shouldSplitBatch?.([...getBatchedArgs(), args]);
      if (split2)
        exec();
      const hasActiveScheduler = getScheduler().length > 0;
      if (hasActiveScheduler) {
        setScheduler({ args, pendingPromise });
        return promise;
      }
      setScheduler({ args, pendingPromise });
      setTimeout(exec, wait);
      return promise;
    }
  };
}
var schedulerCache;
var init_createBatchScheduler = __esm(() => {
  schedulerCache = new Map;
});

// node_modules/viem/_esm/errors/ccip.js
class OffchainLookupError extends BaseError2 {
  constructor({ callbackSelector, cause, data: data4, extraData, sender, urls }) {
    super(cause.shortMessage || "An error occurred while fetching for an offchain result.", {
      cause,
      metaMessages: [
        ...cause.metaMessages || [],
        cause.metaMessages?.length ? "" : [],
        "Offchain Gateway Call:",
        urls && [
          "  Gateway URL(s):",
          ...urls.map((url) => `    ${getUrl(url)}`)
        ],
        `  Sender: ${sender}`,
        `  Data: ${data4}`,
        `  Callback selector: ${callbackSelector}`,
        `  Extra data: ${extraData}`
      ].flat(),
      name: "OffchainLookupError"
    });
  }
}

class OffchainLookupResponseMalformedError extends BaseError2 {
  constructor({ result, url }) {
    super("Offchain gateway response is malformed. Response data must be a hex value.", {
      metaMessages: [
        `Gateway URL: ${getUrl(url)}`,
        `Response: ${stringify(result)}`
      ],
      name: "OffchainLookupResponseMalformedError"
    });
  }
}

class OffchainLookupSenderMismatchError extends BaseError2 {
  constructor({ sender, to }) {
    super("Reverted sender address does not match target contract address (`to`).", {
      metaMessages: [
        `Contract address: ${to}`,
        `OffchainLookup sender address: ${sender}`
      ],
      name: "OffchainLookupSenderMismatchError"
    });
  }
}
var init_ccip = __esm(() => {
  init_stringify();
  init_base();
  init_utils3();
});

// node_modules/viem/_esm/utils/ccip.js
var exports_ccip = {};
__export(exports_ccip, {
  offchainLookupSignature: () => {
    {
      return offchainLookupSignature;
    }
  },
  offchainLookupAbiItem: () => {
    {
      return offchainLookupAbiItem;
    }
  },
  offchainLookup: () => {
    {
      return offchainLookup;
    }
  },
  ccipRequest: () => {
    {
      return ccipRequest;
    }
  }
});
async function offchainLookup(client, { blockNumber, blockTag, data: data4, to }) {
  const { args } = decodeErrorResult({
    data: data4,
    abi: [offchainLookupAbiItem]
  });
  const [sender, urls, callData, callbackSelector, extraData] = args;
  const { ccipRead } = client;
  const ccipRequest_ = ccipRead && typeof ccipRead?.request === "function" ? ccipRead.request : ccipRequest;
  try {
    if (!isAddressEqual(to, sender))
      throw new OffchainLookupSenderMismatchError({ sender, to });
    const result = await ccipRequest_({ data: callData, sender, urls });
    const { data: data_ } = await call2(client, {
      blockNumber,
      blockTag,
      data: concat([
        callbackSelector,
        encodeAbiParameters([{ type: "bytes" }, { type: "bytes" }], [result, extraData])
      ]),
      to
    });
    return data_;
  } catch (err) {
    throw new OffchainLookupError({
      callbackSelector,
      cause: err,
      data: data4,
      extraData,
      sender,
      urls
    });
  }
}
async function ccipRequest({ data: data4, sender, urls }) {
  let error = new Error("An unknown error occurred.");
  for (let i = 0;i < urls.length; i++) {
    const url = urls[i];
    const method = url.includes("{data}") ? "GET" : "POST";
    const body = method === "POST" ? { data: data4, sender } : undefined;
    try {
      const response = await fetch(url.replace("{sender}", sender).replace("{data}", data4), {
        body: JSON.stringify(body),
        method
      });
      let result;
      if (response.headers.get("Content-Type")?.startsWith("application/json")) {
        result = (await response.json()).data;
      } else {
        result = await response.text();
      }
      if (!response.ok) {
        error = new HttpRequestError({
          body,
          details: result?.error ? stringify(result.error) : response.statusText,
          headers: response.headers,
          status: response.status,
          url
        });
        continue;
      }
      if (!isHex(result)) {
        error = new OffchainLookupResponseMalformedError({
          result,
          url
        });
        continue;
      }
      return result;
    } catch (err) {
      error = new HttpRequestError({
        body,
        details: err.message,
        url
      });
    }
  }
  throw error;
}
var offchainLookupSignature, offchainLookupAbiItem;
var init_ccip2 = __esm(() => {
  init_call();
  init_ccip();
  init_request();
  init_decodeErrorResult();
  init_encodeAbiParameters();
  init_isAddressEqual();
  init_concat();
  init_isHex();
  init_stringify();
  offchainLookupSignature = "0x556f1830";
  offchainLookupAbiItem = {
    name: "OffchainLookup",
    type: "error",
    inputs: [
      {
        name: "sender",
        type: "address"
      },
      {
        name: "urls",
        type: "string[]"
      },
      {
        name: "callData",
        type: "bytes"
      },
      {
        name: "callbackFunction",
        type: "bytes4"
      },
      {
        name: "extraData",
        type: "bytes"
      }
    ]
  };
});

// node_modules/viem/_esm/actions/public/call.js
async function call2(client, args) {
  const { account: account_ = client.account, batch = Boolean(client.batch?.multicall), blockNumber, blockTag = "latest", accessList, blobs, code, data: data_, factory, factoryData, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value, stateOverride: stateOverride5, ...rest } = args;
  const account = account_ ? parseAccount(account_) : undefined;
  if (code && (factory || factoryData))
    throw new BaseError2("Cannot provide both `code` & `factory`/`factoryData` as parameters.");
  if (code && to)
    throw new BaseError2("Cannot provide both `code` & `to` as parameters.");
  const deploylessCallViaBytecode = code && data_;
  const deploylessCallViaFactory = factory && factoryData && to && data_;
  const deploylessCall = deploylessCallViaBytecode || deploylessCallViaFactory;
  const data4 = (() => {
    if (deploylessCallViaBytecode)
      return toDeploylessCallViaBytecodeData({
        code,
        data: data_
      });
    if (deploylessCallViaFactory)
      return toDeploylessCallViaFactoryData({
        data: data_,
        factory,
        factoryData,
        to
      });
    return data_;
  })();
  try {
    assertRequest(args);
    const blockNumberHex = blockNumber ? numberToHex(blockNumber) : undefined;
    const block3 = blockNumberHex || blockTag;
    const rpcStateOverride = serializeStateOverride(stateOverride5);
    const chainFormat = client.chain?.formatters?.transactionRequest?.format;
    const format = chainFormat || formatTransactionRequest;
    const request3 = format({
      ...extract(rest, { format: chainFormat }),
      from: account?.address,
      accessList,
      blobs,
      data: data4,
      gas,
      gasPrice,
      maxFeePerBlobGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      to: deploylessCall ? undefined : to,
      value
    });
    if (batch && shouldPerformMulticall({ request: request3 }) && !rpcStateOverride) {
      try {
        return await scheduleMulticall(client, {
          ...request3,
          blockNumber,
          blockTag
        });
      } catch (err) {
        if (!(err instanceof ClientChainNotConfiguredError) && !(err instanceof ChainDoesNotSupportContract))
          throw err;
      }
    }
    const response = await client.request({
      method: "eth_call",
      params: rpcStateOverride ? [
        request3,
        block3,
        rpcStateOverride
      ] : [request3, block3]
    });
    if (response === "0x")
      return { data: undefined };
    return { data: response };
  } catch (err) {
    const data5 = getRevertErrorData(err);
    const { offchainLookup: offchainLookup2, offchainLookupSignature: offchainLookupSignature2 } = await Promise.resolve().then(() => (init_ccip2(), exports_ccip));
    if (client.ccipRead !== false && data5?.slice(0, 10) === offchainLookupSignature2 && to)
      return { data: await offchainLookup2(client, { data: data5, to }) };
    if (deploylessCall && data5?.slice(0, 10) === "0x101bb98d")
      throw new CounterfactualDeploymentFailedError({ factory });
    throw getCallError(err, {
      ...args,
      account,
      chain: client.chain
    });
  }
}
async function scheduleMulticall(client, args) {
  const { batchSize = 1024, wait = 0 } = typeof client.batch?.multicall === "object" ? client.batch.multicall : {};
  const { blockNumber, blockTag = "latest", data: data4, multicallAddress: multicallAddress_, to } = args;
  let multicallAddress = multicallAddress_;
  if (!multicallAddress) {
    if (!client.chain)
      throw new ClientChainNotConfiguredError;
    multicallAddress = getChainContractAddress({
      blockNumber,
      chain: client.chain,
      contract: "multicall3"
    });
  }
  const blockNumberHex = blockNumber ? numberToHex(blockNumber) : undefined;
  const block3 = blockNumberHex || blockTag;
  const { schedule } = createBatchScheduler({
    id: `${client.uid}.${block3}`,
    wait,
    shouldSplitBatch(args2) {
      const size9 = args2.reduce((size10, { data: data5 }) => size10 + (data5.length - 2), 0);
      return size9 > batchSize * 2;
    },
    fn: async (requests) => {
      const calls = requests.map((request3) => ({
        allowFailure: true,
        callData: request3.data,
        target: request3.to
      }));
      const calldata = encodeFunctionData({
        abi: multicall3Abi,
        args: [calls],
        functionName: "aggregate3"
      });
      const data5 = await client.request({
        method: "eth_call",
        params: [
          {
            data: calldata,
            to: multicallAddress
          },
          block3
        ]
      });
      return decodeFunctionResult({
        abi: multicall3Abi,
        args: [calls],
        functionName: "aggregate3",
        data: data5 || "0x"
      });
    }
  });
  const [{ returnData, success }] = await schedule({ data: data4, to });
  if (!success)
    throw new RawContractError({ data: returnData });
  if (returnData === "0x")
    return { data: undefined };
  return { data: returnData };
}
function getRevertErrorData(err) {
  if (!(err instanceof BaseError2))
    return;
  const error = err.walk();
  return typeof error?.data === "object" ? error.data?.data : error.data;
}
var shouldPerformMulticall, toDeploylessCallViaBytecodeData, toDeploylessCallViaFactoryData;
var init_call = __esm(() => {
  init_exports();
  init_parseAccount();
  init_abis();
  init_contract2();
  init_contracts();
  init_base();
  init_chain();
  init_contract();
  init_decodeFunctionResult();
  init_encodeDeployData();
  init_encodeFunctionData();
  init_getChainContractAddress();
  init_toHex();
  init_getCallError();
  init_extract();
  init_transactionRequest();
  init_createBatchScheduler();
  init_stateOverride2();
  init_assertRequest();
  shouldPerformMulticall = function({ request: request3 }) {
    const { data: data4, to, ...request_ } = request3;
    if (!data4)
      return false;
    if (data4.startsWith(aggregate3Signature))
      return false;
    if (!to)
      return false;
    if (Object.values(request_).filter((x) => typeof x !== "undefined").length > 0)
      return false;
    return true;
  };
  toDeploylessCallViaBytecodeData = function(parameters) {
    const { code, data: data4 } = parameters;
    return encodeDeployData({
      abi: parseAbi(["constructor(bytes, bytes)"]),
      bytecode: deploylessCallViaBytecodeBytecode,
      args: [code, data4]
    });
  };
  toDeploylessCallViaFactoryData = function(parameters) {
    const { data: data4, factory, factoryData, to } = parameters;
    return encodeDeployData({
      abi: parseAbi(["constructor(address, bytes, address, bytes)"]),
      bytecode: deploylessCallViaFactoryBytecode,
      args: [to, data4, factory, factoryData]
    });
  };
});

// node_modules/viem/_esm/utils/getAction.js
function getAction(client, actionFn, name) {
  const action_implicit = client[actionFn.name];
  if (typeof action_implicit === "function")
    return action_implicit;
  const action_explicit = client[name];
  if (typeof action_explicit === "function")
    return action_explicit;
  return (params) => actionFn(client, params);
}

// node_modules/viem/_esm/utils/abi/encodeEventTopics.js
init_abi();

// node_modules/viem/_esm/errors/log.js
init_base();

class FilterTypeNotSupportedError extends BaseError2 {
  constructor(type) {
    super(`Filter type "${type}" is not supported.`, {
      name: "FilterTypeNotSupportedError"
    });
  }
}

// node_modules/viem/_esm/utils/abi/encodeEventTopics.js
init_toBytes();
init_keccak256();
init_toEventSelector();
init_encodeAbiParameters();
init_formatAbiItem2();
init_getAbiItem();
function encodeEventTopics(parameters) {
  const { abi: abi5, eventName, args } = parameters;
  let abiItem3 = abi5[0];
  if (eventName) {
    const item = getAbiItem({ abi: abi5, name: eventName });
    if (!item)
      throw new AbiEventNotFoundError(eventName, { docsPath });
    abiItem3 = item;
  }
  if (abiItem3.type !== "event")
    throw new AbiEventNotFoundError(undefined, { docsPath });
  const definition = formatAbiItem2(abiItem3);
  const signature3 = toEventSelector(definition);
  let topics = [];
  if (args && "inputs" in abiItem3) {
    const indexedInputs = abiItem3.inputs?.filter((param) => ("indexed" in param) && param.indexed);
    const args_ = Array.isArray(args) ? args : Object.values(args).length > 0 ? indexedInputs?.map((x) => args[x.name]) ?? [] : [];
    if (args_.length > 0) {
      topics = indexedInputs?.map((param, i) => {
        if (Array.isArray(args_[i]))
          return args_[i].map((_, j) => encodeArg({ param, value: args_[i][j] }));
        return args_[i] ? encodeArg({ param, value: args_[i] }) : null;
      }) ?? [];
    }
  }
  return [signature3, ...topics];
}
var encodeArg = function({ param, value }) {
  if (param.type === "string" || param.type === "bytes")
    return keccak256(toBytes(value));
  if (param.type === "tuple" || param.type.match(/^(.*)\[(\d+)?\]$/))
    throw new FilterTypeNotSupportedError(param.type);
  return encodeAbiParameters([param], [value]);
};
var docsPath = "/docs/contract/encodeEventTopics";

// node_modules/viem/_esm/actions/public/createContractEventFilter.js
init_toHex();

// node_modules/viem/_esm/utils/filters/createFilterRequestScope.js
function createFilterRequestScope(client, { method }) {
  const requestMap = {};
  if (client.transport.type === "fallback")
    client.transport.onResponse?.(({ method: method_, response: id, status, transport }) => {
      if (status === "success" && method === method_)
        requestMap[id] = transport.request;
    });
  return (id) => requestMap[id] || client.request;
}

// node_modules/viem/_esm/actions/public/createContractEventFilter.js
async function createContractEventFilter(client, parameters) {
  const { address: address3, abi: abi5, args, eventName, fromBlock, strict, toBlock } = parameters;
  const getRequest = createFilterRequestScope(client, {
    method: "eth_newFilter"
  });
  const topics = eventName ? encodeEventTopics({
    abi: abi5,
    args,
    eventName
  }) : undefined;
  const id = await client.request({
    method: "eth_newFilter",
    params: [
      {
        address: address3,
        fromBlock: typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
        toBlock: typeof toBlock === "bigint" ? numberToHex(toBlock) : toBlock,
        topics
      }
    ]
  });
  return {
    abi: abi5,
    args,
    eventName,
    id,
    request: getRequest(id),
    strict: Boolean(strict),
    type: "event"
  };
}

// node_modules/viem/_esm/actions/public/estimateContractGas.js
init_parseAccount();
init_encodeFunctionData();

// node_modules/viem/_esm/utils/errors/getContractError.js
init_abi();
init_base();
init_contract();
init_rpc();
function getContractError(err, { abi: abi10, address: address3, args, docsPath: docsPath3, functionName, sender }) {
  const { code, data: data3, message, shortMessage } = err instanceof RawContractError ? err : err instanceof BaseError2 ? err.walk((err2) => ("data" in err2)) || err.walk() : {};
  const cause = (() => {
    if (err instanceof AbiDecodingZeroDataError)
      return new ContractFunctionZeroDataError({ functionName });
    if ([EXECUTION_REVERTED_ERROR_CODE, InternalRpcError.code].includes(code) && (data3 || message || shortMessage)) {
      return new ContractFunctionRevertedError({
        abi: abi10,
        data: typeof data3 === "object" ? data3.data : data3,
        functionName,
        message: shortMessage ?? message
      });
    }
    return err;
  })();
  return new ContractFunctionExecutionError(cause, {
    abi: abi10,
    args,
    contractAddress: address3,
    docsPath: docsPath3,
    functionName,
    sender
  });
}
var EXECUTION_REVERTED_ERROR_CODE = 3;

// node_modules/viem/_esm/actions/public/estimateGas.js
init_parseAccount();
init_base();

// node_modules/viem/_esm/accounts/utils/publicKeyToAddress.js
init_getAddress();
init_keccak256();
function publicKeyToAddress(publicKey) {
  const address3 = keccak256(`0x${publicKey.substring(4)}`).substring(26);
  return checksumAddress(`0x${address3}`);
}

// node_modules/viem/_esm/utils/signature/recoverPublicKey.js
init_isHex();
init_fromHex();
init_toHex();
async function recoverPublicKey({ hash: hash3, signature: signature3 }) {
  const hashHex = isHex(hash3) ? hash3 : toHex(hash3);
  const { secp256k1: secp256k12 } = await Promise.resolve().then(() => (init_secp256k1(), exports_secp256k1));
  const signature_ = (() => {
    if (typeof signature3 === "object" && "r" in signature3 && "s" in signature3) {
      const { r, s, v, yParity } = signature3;
      const yParityOrV2 = Number(yParity ?? v);
      const recoveryBit2 = toRecoveryBit(yParityOrV2);
      return new secp256k12.Signature(hexToBigInt(r), hexToBigInt(s)).addRecoveryBit(recoveryBit2);
    }
    const signatureHex = isHex(signature3) ? signature3 : toHex(signature3);
    const yParityOrV = hexToNumber(`0x${signatureHex.slice(130)}`);
    const recoveryBit = toRecoveryBit(yParityOrV);
    return secp256k12.Signature.fromCompact(signatureHex.substring(2, 130)).addRecoveryBit(recoveryBit);
  })();
  const publicKey = signature_.recoverPublicKey(hashHex.substring(2)).toHex(false);
  return `0x${publicKey}`;
}
var toRecoveryBit = function(yParityOrV) {
  if (yParityOrV === 0 || yParityOrV === 1)
    return yParityOrV;
  if (yParityOrV === 27)
    return 0;
  if (yParityOrV === 28)
    return 1;
  throw new Error("Invalid yParityOrV value");
};

// node_modules/viem/_esm/utils/signature/recoverAddress.js
async function recoverAddress({ hash: hash3, signature: signature3 }) {
  return publicKeyToAddress(await recoverPublicKey({ hash: hash3, signature: signature3 }));
}

// node_modules/viem/_esm/experimental/eip7702/utils/hashAuthorization.js
init_concat();
init_toBytes();
init_toHex();

// node_modules/viem/_esm/utils/encoding/toRlp.js
init_base();
init_cursor2();
init_toBytes();
init_toHex();
function toRlp(bytes2, to = "hex") {
  const encodable = getEncodable(bytes2);
  const cursor4 = createCursor(new Uint8Array(encodable.length));
  encodable.encode(cursor4);
  if (to === "hex")
    return bytesToHex(cursor4.bytes);
  return cursor4.bytes;
}
var getEncodable = function(bytes2) {
  if (Array.isArray(bytes2))
    return getEncodableList(bytes2.map((x) => getEncodable(x)));
  return getEncodableBytes(bytes2);
};
var getEncodableList = function(list) {
  const bodyLength = list.reduce((acc, x) => acc + x.length, 0);
  const sizeOfBodyLength = getSizeOfLength(bodyLength);
  const length = (() => {
    if (bodyLength <= 55)
      return 1 + bodyLength;
    return 1 + sizeOfBodyLength + bodyLength;
  })();
  return {
    length,
    encode(cursor4) {
      if (bodyLength <= 55) {
        cursor4.pushByte(192 + bodyLength);
      } else {
        cursor4.pushByte(192 + 55 + sizeOfBodyLength);
        if (sizeOfBodyLength === 1)
          cursor4.pushUint8(bodyLength);
        else if (sizeOfBodyLength === 2)
          cursor4.pushUint16(bodyLength);
        else if (sizeOfBodyLength === 3)
          cursor4.pushUint24(bodyLength);
        else
          cursor4.pushUint32(bodyLength);
      }
      for (const { encode } of list) {
        encode(cursor4);
      }
    }
  };
};
var getEncodableBytes = function(bytesOrHex) {
  const bytes2 = typeof bytesOrHex === "string" ? hexToBytes(bytesOrHex) : bytesOrHex;
  const sizeOfBytesLength = getSizeOfLength(bytes2.length);
  const length = (() => {
    if (bytes2.length === 1 && bytes2[0] < 128)
      return 1;
    if (bytes2.length <= 55)
      return 1 + bytes2.length;
    return 1 + sizeOfBytesLength + bytes2.length;
  })();
  return {
    length,
    encode(cursor4) {
      if (bytes2.length === 1 && bytes2[0] < 128) {
        cursor4.pushBytes(bytes2);
      } else if (bytes2.length <= 55) {
        cursor4.pushByte(128 + bytes2.length);
        cursor4.pushBytes(bytes2);
      } else {
        cursor4.pushByte(128 + 55 + sizeOfBytesLength);
        if (sizeOfBytesLength === 1)
          cursor4.pushUint8(bytes2.length);
        else if (sizeOfBytesLength === 2)
          cursor4.pushUint16(bytes2.length);
        else if (sizeOfBytesLength === 3)
          cursor4.pushUint24(bytes2.length);
        else
          cursor4.pushUint32(bytes2.length);
        cursor4.pushBytes(bytes2);
      }
    }
  };
};
var getSizeOfLength = function(length) {
  if (length < 2 ** 8)
    return 1;
  if (length < 2 ** 16)
    return 2;
  if (length < 2 ** 24)
    return 3;
  if (length < 2 ** 32)
    return 4;
  throw new BaseError2("Length is too large.");
};

// node_modules/viem/_esm/experimental/eip7702/utils/hashAuthorization.js
init_keccak256();
function hashAuthorization(parameters) {
  const { chainId, contractAddress, nonce, to } = parameters;
  const hash3 = keccak256(concatHex([
    "0x05",
    toRlp([
      numberToHex(chainId),
      contractAddress,
      [nonce ? numberToHex(nonce) : "0x"]
    ])
  ]));
  if (to === "bytes")
    return hexToBytes(hash3);
  return hash3;
}

// node_modules/viem/_esm/experimental/eip7702/utils/recoverAuthorizationAddress.js
async function recoverAuthorizationAddress(parameters) {
  const { authorization, signature: signature3 } = parameters;
  return recoverAddress({
    hash: hashAuthorization(authorization),
    signature: signature3 ?? authorization
  });
}

// node_modules/viem/_esm/actions/public/estimateGas.js
init_toHex();

// node_modules/viem/_esm/errors/estimateGas.js
init_formatEther();
init_formatGwei();
init_base();
init_transaction();

class EstimateGasExecutionError extends BaseError2 {
  constructor(cause, { account, docsPath: docsPath3, chain, data: data3, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value }) {
    const prettyArgs = prettyPrint({
      from: account?.address,
      to,
      value: typeof value !== "undefined" && `${formatEther(value)} ${chain?.nativeCurrency?.symbol || "ETH"}`,
      data: data3,
      gas,
      gasPrice: typeof gasPrice !== "undefined" && `${formatGwei(gasPrice)} gwei`,
      maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${formatGwei(maxFeePerGas)} gwei`,
      maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${formatGwei(maxPriorityFeePerGas)} gwei`,
      nonce
    });
    super(cause.shortMessage, {
      cause,
      docsPath: docsPath3,
      metaMessages: [
        ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
        "Estimate Gas Arguments:",
        prettyArgs
      ].filter(Boolean),
      name: "EstimateGasExecutionError"
    });
    Object.defineProperty(this, "cause", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    this.cause = cause;
  }
}

// node_modules/viem/_esm/utils/errors/getEstimateGasError.js
init_node();
init_getNodeError();
function getEstimateGasError(err, { docsPath: docsPath3, ...args }) {
  const cause = (() => {
    const cause2 = getNodeError(err, args);
    if (cause2 instanceof UnknownNodeError)
      return err;
    return cause2;
  })();
  return new EstimateGasExecutionError(cause, {
    docsPath: docsPath3,
    ...args
  });
}

// node_modules/viem/_esm/actions/public/estimateGas.js
init_extract();
init_transactionRequest();
init_stateOverride2();
init_assertRequest();

// node_modules/viem/_esm/actions/wallet/prepareTransactionRequest.js
init_parseAccount();

// node_modules/viem/_esm/errors/fee.js
init_formatGwei();
init_base();

class BaseFeeScalarError extends BaseError2 {
  constructor() {
    super("`baseFeeMultiplier` must be greater than 1.", {
      name: "BaseFeeScalarError"
    });
  }
}

class Eip1559FeesNotSupportedError extends BaseError2 {
  constructor() {
    super("Chain does not support EIP-1559 fees.", {
      name: "Eip1559FeesNotSupportedError"
    });
  }
}

class MaxFeePerGasTooLowError extends BaseError2 {
  constructor({ maxPriorityFeePerGas }) {
    super(`\`maxFeePerGas\` cannot be less than the \`maxPriorityFeePerGas\` (${formatGwei(maxPriorityFeePerGas)} gwei).`, { name: "MaxFeePerGasTooLowError" });
  }
}

// node_modules/viem/_esm/actions/public/estimateMaxPriorityFeePerGas.js
init_fromHex();

// node_modules/viem/_esm/errors/block.js
init_base();

class BlockNotFoundError extends BaseError2 {
  constructor({ blockHash, blockNumber }) {
    let identifier = "Block";
    if (blockHash)
      identifier = `Block at hash "${blockHash}"`;
    if (blockNumber)
      identifier = `Block at number "${blockNumber}"`;
    super(`${identifier} could not be found.`, { name: "BlockNotFoundError" });
  }
}

// node_modules/viem/_esm/actions/public/getBlock.js
init_toHex();

// node_modules/viem/_esm/utils/formatters/transaction.js
init_fromHex();
function formatTransaction(transaction4) {
  const transaction_ = {
    ...transaction4,
    blockHash: transaction4.blockHash ? transaction4.blockHash : null,
    blockNumber: transaction4.blockNumber ? BigInt(transaction4.blockNumber) : null,
    chainId: transaction4.chainId ? hexToNumber(transaction4.chainId) : undefined,
    gas: transaction4.gas ? BigInt(transaction4.gas) : undefined,
    gasPrice: transaction4.gasPrice ? BigInt(transaction4.gasPrice) : undefined,
    maxFeePerBlobGas: transaction4.maxFeePerBlobGas ? BigInt(transaction4.maxFeePerBlobGas) : undefined,
    maxFeePerGas: transaction4.maxFeePerGas ? BigInt(transaction4.maxFeePerGas) : undefined,
    maxPriorityFeePerGas: transaction4.maxPriorityFeePerGas ? BigInt(transaction4.maxPriorityFeePerGas) : undefined,
    nonce: transaction4.nonce ? hexToNumber(transaction4.nonce) : undefined,
    to: transaction4.to ? transaction4.to : null,
    transactionIndex: transaction4.transactionIndex ? Number(transaction4.transactionIndex) : null,
    type: transaction4.type ? transactionType[transaction4.type] : undefined,
    typeHex: transaction4.type ? transaction4.type : undefined,
    value: transaction4.value ? BigInt(transaction4.value) : undefined,
    v: transaction4.v ? BigInt(transaction4.v) : undefined
  };
  if (transaction4.authorizationList)
    transaction_.authorizationList = formatAuthorizationList2(transaction4.authorizationList);
  transaction_.yParity = (() => {
    if (transaction4.yParity)
      return Number(transaction4.yParity);
    if (typeof transaction_.v === "bigint") {
      if (transaction_.v === 0n || transaction_.v === 27n)
        return 0;
      if (transaction_.v === 1n || transaction_.v === 28n)
        return 1;
      if (transaction_.v >= 35n)
        return transaction_.v % 2n === 0n ? 1 : 0;
    }
    return;
  })();
  if (transaction_.type === "legacy") {
    delete transaction_.accessList;
    delete transaction_.maxFeePerBlobGas;
    delete transaction_.maxFeePerGas;
    delete transaction_.maxPriorityFeePerGas;
    delete transaction_.yParity;
  }
  if (transaction_.type === "eip2930") {
    delete transaction_.maxFeePerBlobGas;
    delete transaction_.maxFeePerGas;
    delete transaction_.maxPriorityFeePerGas;
  }
  if (transaction_.type === "eip1559") {
    delete transaction_.maxFeePerBlobGas;
  }
  return transaction_;
}
var formatAuthorizationList2 = function(authorizationList) {
  return authorizationList.map((authorization) => ({
    contractAddress: authorization.address,
    r: authorization.r,
    s: authorization.s,
    chainId: Number(authorization.chainId),
    nonce: Number(authorization.nonce),
    ...typeof authorization.yParity !== "undefined" ? { yParity: Number(authorization.yParity) } : {},
    ...typeof authorization.v !== "undefined" && typeof authorization.yParity === "undefined" ? { v: Number(authorization.v) } : {}
  }));
};
var transactionType = {
  "0x0": "legacy",
  "0x1": "eip2930",
  "0x2": "eip1559",
  "0x3": "eip4844",
  "0x4": "eip7702"
};

// node_modules/viem/_esm/utils/formatters/block.js
function formatBlock(block) {
  const transactions = block.transactions?.map((transaction5) => {
    if (typeof transaction5 === "string")
      return transaction5;
    return formatTransaction(transaction5);
  });
  return {
    ...block,
    baseFeePerGas: block.baseFeePerGas ? BigInt(block.baseFeePerGas) : null,
    blobGasUsed: block.blobGasUsed ? BigInt(block.blobGasUsed) : undefined,
    difficulty: block.difficulty ? BigInt(block.difficulty) : undefined,
    excessBlobGas: block.excessBlobGas ? BigInt(block.excessBlobGas) : undefined,
    gasLimit: block.gasLimit ? BigInt(block.gasLimit) : undefined,
    gasUsed: block.gasUsed ? BigInt(block.gasUsed) : undefined,
    hash: block.hash ? block.hash : null,
    logsBloom: block.logsBloom ? block.logsBloom : null,
    nonce: block.nonce ? block.nonce : null,
    number: block.number ? BigInt(block.number) : null,
    size: block.size ? BigInt(block.size) : undefined,
    timestamp: block.timestamp ? BigInt(block.timestamp) : undefined,
    transactions,
    totalDifficulty: block.totalDifficulty ? BigInt(block.totalDifficulty) : null
  };
}

// node_modules/viem/_esm/actions/public/getBlock.js
async function getBlock(client, { blockHash, blockNumber, blockTag: blockTag_, includeTransactions: includeTransactions_ } = {}) {
  const blockTag = blockTag_ ?? "latest";
  const includeTransactions = includeTransactions_ ?? false;
  const blockNumberHex = blockNumber !== undefined ? numberToHex(blockNumber) : undefined;
  let block3 = null;
  if (blockHash) {
    block3 = await client.request({
      method: "eth_getBlockByHash",
      params: [blockHash, includeTransactions]
    }, { dedupe: true });
  } else {
    block3 = await client.request({
      method: "eth_getBlockByNumber",
      params: [blockNumberHex || blockTag, includeTransactions]
    }, { dedupe: Boolean(blockNumberHex) });
  }
  if (!block3)
    throw new BlockNotFoundError({ blockHash, blockNumber });
  const format = client.chain?.formatters?.block?.format || formatBlock;
  return format(block3);
}

// node_modules/viem/_esm/actions/public/getGasPrice.js
async function getGasPrice(client) {
  const gasPrice = await client.request({
    method: "eth_gasPrice"
  });
  return BigInt(gasPrice);
}

// node_modules/viem/_esm/actions/public/estimateMaxPriorityFeePerGas.js
async function estimateMaxPriorityFeePerGas(client, args) {
  return internal_estimateMaxPriorityFeePerGas(client, args);
}
async function internal_estimateMaxPriorityFeePerGas(client, args) {
  const { block: block_, chain = client.chain, request: request2 } = args || {};
  if (typeof chain?.fees?.defaultPriorityFee === "function") {
    const block3 = block_ || await getAction(client, getBlock, "getBlock")({});
    return chain.fees.defaultPriorityFee({
      block: block3,
      client,
      request: request2
    });
  }
  if (typeof chain?.fees?.defaultPriorityFee !== "undefined")
    return chain?.fees?.defaultPriorityFee;
  try {
    const maxPriorityFeePerGasHex = await client.request({
      method: "eth_maxPriorityFeePerGas"
    });
    return hexToBigInt(maxPriorityFeePerGasHex);
  } catch {
    const [block3, gasPrice] = await Promise.all([
      block_ ? Promise.resolve(block_) : getAction(client, getBlock, "getBlock")({}),
      getAction(client, getGasPrice, "getGasPrice")({})
    ]);
    if (typeof block3.baseFeePerGas !== "bigint")
      throw new Eip1559FeesNotSupportedError;
    const maxPriorityFeePerGas = gasPrice - block3.baseFeePerGas;
    if (maxPriorityFeePerGas < 0n)
      return 0n;
    return maxPriorityFeePerGas;
  }
}

// node_modules/viem/_esm/actions/public/estimateFeesPerGas.js
async function estimateFeesPerGas(client, args) {
  return internal_estimateFeesPerGas(client, args);
}
async function internal_estimateFeesPerGas(client, args) {
  const { block: block_, chain = client.chain, request: request2, type = "eip1559" } = args || {};
  const baseFeeMultiplier = await (async () => {
    if (typeof chain?.fees?.baseFeeMultiplier === "function")
      return chain.fees.baseFeeMultiplier({
        block: block_,
        client,
        request: request2
      });
    return chain?.fees?.baseFeeMultiplier ?? 1.2;
  })();
  if (baseFeeMultiplier < 1)
    throw new BaseFeeScalarError;
  const decimals = baseFeeMultiplier.toString().split(".")[1]?.length ?? 0;
  const denominator = 10 ** decimals;
  const multiply = (base22) => base22 * BigInt(Math.ceil(baseFeeMultiplier * denominator)) / BigInt(denominator);
  const block3 = block_ ? block_ : await getAction(client, getBlock, "getBlock")({});
  if (typeof chain?.fees?.estimateFeesPerGas === "function") {
    const fees = await chain.fees.estimateFeesPerGas({
      block: block_,
      client,
      multiply,
      request: request2,
      type
    });
    if (fees !== null)
      return fees;
  }
  if (type === "eip1559") {
    if (typeof block3.baseFeePerGas !== "bigint")
      throw new Eip1559FeesNotSupportedError;
    const maxPriorityFeePerGas = typeof request2?.maxPriorityFeePerGas === "bigint" ? request2.maxPriorityFeePerGas : await internal_estimateMaxPriorityFeePerGas(client, {
      block: block3,
      chain,
      request: request2
    });
    const baseFeePerGas = multiply(block3.baseFeePerGas);
    const maxFeePerGas = request2?.maxFeePerGas ?? baseFeePerGas + maxPriorityFeePerGas;
    return {
      maxFeePerGas,
      maxPriorityFeePerGas
    };
  }
  const gasPrice = request2?.gasPrice ?? multiply(await getAction(client, getGasPrice, "getGasPrice")({}));
  return {
    gasPrice
  };
}

// node_modules/viem/_esm/actions/public/getTransactionCount.js
init_fromHex();
init_toHex();
async function getTransactionCount(client, { address: address5, blockTag = "latest", blockNumber }) {
  const count = await client.request({
    method: "eth_getTransactionCount",
    params: [address5, blockNumber ? numberToHex(blockNumber) : blockTag]
  }, { dedupe: Boolean(blockNumber) });
  return hexToNumber(count);
}

// node_modules/viem/_esm/utils/blob/blobsToCommitments.js
init_toBytes();
init_toHex();
function blobsToCommitments(parameters) {
  const { kzg } = parameters;
  const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
  const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => hexToBytes(x)) : parameters.blobs;
  const commitments = [];
  for (const blob of blobs)
    commitments.push(Uint8Array.from(kzg.blobToKzgCommitment(blob)));
  return to === "bytes" ? commitments : commitments.map((x) => bytesToHex(x));
}

// node_modules/viem/_esm/utils/blob/blobsToProofs.js
init_toBytes();
init_toHex();
function blobsToProofs(parameters) {
  const { kzg } = parameters;
  const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
  const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => hexToBytes(x)) : parameters.blobs;
  const commitments = typeof parameters.commitments[0] === "string" ? parameters.commitments.map((x) => hexToBytes(x)) : parameters.commitments;
  const proofs = [];
  for (let i = 0;i < blobs.length; i++) {
    const blob = blobs[i];
    const commitment = commitments[i];
    proofs.push(Uint8Array.from(kzg.computeBlobKzgProof(blob, commitment)));
  }
  return to === "bytes" ? proofs : proofs.map((x) => bytesToHex(x));
}

// node_modules/viem/_esm/utils/blob/commitmentToVersionedHash.js
init_toHex();

// node_modules/viem/_esm/utils/hash/sha256.js
init_sha256();
init_isHex();
init_toBytes();
init_toHex();
function sha2564(value, to_) {
  const to = to_ || "hex";
  const bytes2 = sha256(isHex(value, { strict: false }) ? toBytes(value) : value);
  if (to === "bytes")
    return bytes2;
  return toHex(bytes2);
}

// node_modules/viem/_esm/utils/blob/commitmentToVersionedHash.js
function commitmentToVersionedHash(parameters) {
  const { commitment, version: version5 = 1 } = parameters;
  const to = parameters.to ?? (typeof commitment === "string" ? "hex" : "bytes");
  const versionedHash = sha2564(commitment, "bytes");
  versionedHash.set([version5], 0);
  return to === "bytes" ? versionedHash : bytesToHex(versionedHash);
}

// node_modules/viem/_esm/utils/blob/commitmentsToVersionedHashes.js
function commitmentsToVersionedHashes(parameters) {
  const { commitments, version: version5 } = parameters;
  const to = parameters.to ?? (typeof commitments[0] === "string" ? "hex" : "bytes");
  const hashes = [];
  for (const commitment of commitments) {
    hashes.push(commitmentToVersionedHash({
      commitment,
      to,
      version: version5
    }));
  }
  return hashes;
}

// node_modules/viem/_esm/constants/blob.js
var blobsPerTransaction = 6;
var bytesPerFieldElement = 32;
var fieldElementsPerBlob = 4096;
var bytesPerBlob = bytesPerFieldElement * fieldElementsPerBlob;
var maxBytesPerTransaction = bytesPerBlob * blobsPerTransaction - 1 - 1 * fieldElementsPerBlob * blobsPerTransaction;

// node_modules/viem/_esm/errors/blob.js
init_base();

class BlobSizeTooLargeError extends BaseError2 {
  constructor({ maxSize, size: size7 }) {
    super("Blob size is too large.", {
      metaMessages: [`Max: ${maxSize} bytes`, `Given: ${size7} bytes`],
      name: "BlobSizeTooLargeError"
    });
  }
}

class EmptyBlobError extends BaseError2 {
  constructor() {
    super("Blob data must not be empty.", { name: "EmptyBlobError" });
  }
}

// node_modules/viem/_esm/utils/blob/toBlobs.js
init_cursor2();
init_size();
init_toBytes();
init_toHex();
function toBlobs(parameters) {
  const to = parameters.to ?? (typeof parameters.data === "string" ? "hex" : "bytes");
  const data4 = typeof parameters.data === "string" ? hexToBytes(parameters.data) : parameters.data;
  const size_ = size(data4);
  if (!size_)
    throw new EmptyBlobError;
  if (size_ > maxBytesPerTransaction)
    throw new BlobSizeTooLargeError({
      maxSize: maxBytesPerTransaction,
      size: size_
    });
  const blobs = [];
  let active = true;
  let position = 0;
  while (active) {
    const blob3 = createCursor(new Uint8Array(bytesPerBlob));
    let size8 = 0;
    while (size8 < fieldElementsPerBlob) {
      const bytes2 = data4.slice(position, position + (bytesPerFieldElement - 1));
      blob3.pushByte(0);
      blob3.pushBytes(bytes2);
      if (bytes2.length < 31) {
        blob3.pushByte(128);
        active = false;
        break;
      }
      size8++;
      position += 31;
    }
    blobs.push(blob3);
  }
  return to === "bytes" ? blobs.map((x) => x.bytes) : blobs.map((x) => bytesToHex(x.bytes));
}

// node_modules/viem/_esm/utils/blob/toBlobSidecars.js
function toBlobSidecars(parameters) {
  const { data: data4, kzg, to } = parameters;
  const blobs = parameters.blobs ?? toBlobs({ data: data4, to });
  const commitments = parameters.commitments ?? blobsToCommitments({ blobs, kzg, to });
  const proofs = parameters.proofs ?? blobsToProofs({ blobs, commitments, kzg, to });
  const sidecars = [];
  for (let i = 0;i < blobs.length; i++)
    sidecars.push({
      blob: blobs[i],
      commitment: commitments[i],
      proof: proofs[i]
    });
  return sidecars;
}

// node_modules/viem/_esm/actions/wallet/prepareTransactionRequest.js
init_assertRequest();

// node_modules/viem/_esm/utils/transaction/getTransactionType.js
init_transaction();
function getTransactionType(transaction6) {
  if (transaction6.type)
    return transaction6.type;
  if (typeof transaction6.authorizationList !== "undefined")
    return "eip7702";
  if (typeof transaction6.blobs !== "undefined" || typeof transaction6.blobVersionedHashes !== "undefined" || typeof transaction6.maxFeePerBlobGas !== "undefined" || typeof transaction6.sidecars !== "undefined")
    return "eip4844";
  if (typeof transaction6.maxFeePerGas !== "undefined" || typeof transaction6.maxPriorityFeePerGas !== "undefined") {
    return "eip1559";
  }
  if (typeof transaction6.gasPrice !== "undefined") {
    if (typeof transaction6.accessList !== "undefined")
      return "eip2930";
    return "legacy";
  }
  throw new InvalidSerializableTransactionError({ transaction: transaction6 });
}

// node_modules/viem/_esm/actions/public/getChainId.js
init_fromHex();
async function getChainId(client) {
  const chainIdHex = await client.request({
    method: "eth_chainId"
  }, { dedupe: true });
  return hexToNumber(chainIdHex);
}

// node_modules/viem/_esm/actions/wallet/prepareTransactionRequest.js
async function prepareTransactionRequest(client, args) {
  const { account: account_ = client.account, blobs, chain, gas, kzg, nonce, parameters = defaultParameters, type } = args;
  const account = account_ ? parseAccount(account_) : undefined;
  const request2 = { ...args, ...account ? { from: account?.address } : {} };
  let block3;
  async function getBlock5() {
    if (block3)
      return block3;
    block3 = await getAction(client, getBlock, "getBlock")({ blockTag: "latest" });
    return block3;
  }
  let chainId;
  async function getChainId3() {
    if (chainId)
      return chainId;
    if (chain)
      return chain.id;
    if (typeof args.chainId !== "undefined")
      return args.chainId;
    const chainId_ = await getAction(client, getChainId, "getChainId")({});
    chainId = chainId_;
    return chainId;
  }
  if ((parameters.includes("blobVersionedHashes") || parameters.includes("sidecars")) && blobs && kzg) {
    const commitments = blobsToCommitments({ blobs, kzg });
    if (parameters.includes("blobVersionedHashes")) {
      const versionedHashes = commitmentsToVersionedHashes({
        commitments,
        to: "hex"
      });
      request2.blobVersionedHashes = versionedHashes;
    }
    if (parameters.includes("sidecars")) {
      const proofs = blobsToProofs({ blobs, commitments, kzg });
      const sidecars = toBlobSidecars({
        blobs,
        commitments,
        proofs,
        to: "hex"
      });
      request2.sidecars = sidecars;
    }
  }
  if (parameters.includes("chainId"))
    request2.chainId = await getChainId3();
  if (parameters.includes("nonce") && typeof nonce === "undefined" && account) {
    if (account.nonceManager) {
      const chainId2 = await getChainId3();
      request2.nonce = await account.nonceManager.consume({
        address: account.address,
        chainId: chainId2,
        client
      });
    } else {
      request2.nonce = await getAction(client, getTransactionCount, "getTransactionCount")({
        address: account.address,
        blockTag: "pending"
      });
    }
  }
  if ((parameters.includes("fees") || parameters.includes("type")) && typeof type === "undefined") {
    try {
      request2.type = getTransactionType(request2);
    } catch {
      const block4 = await getBlock5();
      request2.type = typeof block4?.baseFeePerGas === "bigint" ? "eip1559" : "legacy";
    }
  }
  if (parameters.includes("fees")) {
    if (request2.type !== "legacy" && request2.type !== "eip2930") {
      if (typeof request2.maxFeePerGas === "undefined" || typeof request2.maxPriorityFeePerGas === "undefined") {
        const block4 = await getBlock5();
        const { maxFeePerGas, maxPriorityFeePerGas } = await internal_estimateFeesPerGas(client, {
          block: block4,
          chain,
          request: request2
        });
        if (typeof args.maxPriorityFeePerGas === "undefined" && args.maxFeePerGas && args.maxFeePerGas < maxPriorityFeePerGas)
          throw new MaxFeePerGasTooLowError({
            maxPriorityFeePerGas
          });
        request2.maxPriorityFeePerGas = maxPriorityFeePerGas;
        request2.maxFeePerGas = maxFeePerGas;
      }
    } else {
      if (typeof args.maxFeePerGas !== "undefined" || typeof args.maxPriorityFeePerGas !== "undefined")
        throw new Eip1559FeesNotSupportedError;
      const block4 = await getBlock5();
      const { gasPrice: gasPrice_ } = await internal_estimateFeesPerGas(client, {
        block: block4,
        chain,
        request: request2,
        type: "legacy"
      });
      request2.gasPrice = gasPrice_;
    }
  }
  if (parameters.includes("gas") && typeof gas === "undefined")
    request2.gas = await getAction(client, estimateGas3, "estimateGas")({
      ...request2,
      account: account ? { address: account.address, type: "json-rpc" } : undefined
    });
  assertRequest(request2);
  delete request2.parameters;
  return request2;
}
var defaultParameters = [
  "blobVersionedHashes",
  "chainId",
  "fees",
  "gas",
  "nonce",
  "type"
];

// node_modules/viem/_esm/actions/public/getBalance.js
init_toHex();
async function getBalance(client, { address: address5, blockNumber, blockTag = "latest" }) {
  const blockNumberHex = blockNumber ? numberToHex(blockNumber) : undefined;
  const balance = await client.request({
    method: "eth_getBalance",
    params: [address5, blockNumberHex || blockTag]
  });
  return BigInt(balance);
}

// node_modules/viem/_esm/actions/public/estimateGas.js
async function estimateGas3(client, args) {
  const account_ = args.account ?? client.account;
  const account = account_ ? parseAccount(account_) : undefined;
  try {
    let estimateGas_rpc = function(parameters) {
      const { block: block4, request: request3, rpcStateOverride: rpcStateOverride2 } = parameters;
      return client.request({
        method: "eth_estimateGas",
        params: rpcStateOverride2 ? [request3, block4 ?? "latest", rpcStateOverride2] : block4 ? [request3, block4] : [request3]
      });
    };
    const { accessList, authorizationList, blobs, blobVersionedHashes, blockNumber, blockTag, data: data4, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce, value, stateOverride: stateOverride4, ...rest } = await prepareTransactionRequest(client, {
      ...args,
      parameters: account?.type === "local" ? undefined : ["blobVersionedHashes"]
    });
    const blockNumberHex = blockNumber ? numberToHex(blockNumber) : undefined;
    const block3 = blockNumberHex || blockTag;
    const rpcStateOverride = serializeStateOverride(stateOverride4);
    const to = await (async () => {
      if (rest.to)
        return rest.to;
      if (authorizationList && authorizationList.length > 0)
        return await recoverAuthorizationAddress({
          authorization: authorizationList[0]
        }).catch(() => {
          throw new BaseError2("`to` is required. Could not infer from `authorizationList`");
        });
      return;
    })();
    assertRequest(args);
    const chainFormat = client.chain?.formatters?.transactionRequest?.format;
    const format = chainFormat || formatTransactionRequest;
    const request2 = format({
      ...extract(rest, { format: chainFormat }),
      from: account?.address,
      accessList,
      authorizationList,
      blobs,
      blobVersionedHashes,
      data: data4,
      gas,
      gasPrice,
      maxFeePerBlobGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      to,
      value
    });
    let estimate = BigInt(await estimateGas_rpc({ block: block3, request: request2, rpcStateOverride }));
    if (authorizationList) {
      const value2 = await getBalance(client, { address: request2.from });
      const estimates = await Promise.all(authorizationList.map(async (authorization) => {
        const { contractAddress } = authorization;
        const estimate2 = await estimateGas_rpc({
          block: block3,
          request: {
            authorizationList: undefined,
            data: data4,
            from: account?.address,
            to: contractAddress,
            value: numberToHex(value2)
          },
          rpcStateOverride
        }).catch(() => 100000n);
        return 2n * BigInt(estimate2);
      }));
      estimate += estimates.reduce((acc, curr) => acc + curr, 0n);
    }
    return estimate;
  } catch (err) {
    throw getEstimateGasError(err, {
      ...args,
      account,
      chain: client.chain
    });
  }
}

// node_modules/viem/_esm/actions/public/estimateContractGas.js
async function estimateContractGas(client, parameters) {
  const { abi: abi10, address: address5, args, functionName, ...request2 } = parameters;
  const data4 = encodeFunctionData({
    abi: abi10,
    args,
    functionName
  });
  try {
    const gas = await getAction(client, estimateGas3, "estimateGas")({
      data: data4,
      to: address5,
      ...request2
    });
    return gas;
  } catch (error) {
    const account = request2.account ? parseAccount(request2.account) : undefined;
    throw getContractError(error, {
      abi: abi10,
      address: address5,
      args,
      docsPath: "/docs/contract/estimateContractGas",
      functionName,
      sender: account?.address
    });
  }
}

// node_modules/viem/_esm/actions/public/getContractEvents.js
init_getAbiItem();

// node_modules/viem/_esm/utils/abi/parseEventLogs.js
init_abi();
init_isAddressEqual();
init_toBytes();
init_keccak256();

// node_modules/viem/_esm/utils/abi/decodeEventLog.js
init_abi();
init_size();
init_toEventSelector();
init_cursor();
init_decodeAbiParameters();
init_formatAbiItem2();
function decodeEventLog(parameters) {
  const { abi: abi11, data: data4, strict: strict_, topics } = parameters;
  const strict = strict_ ?? true;
  const [signature3, ...argTopics] = topics;
  if (!signature3)
    throw new AbiEventSignatureEmptyTopicsError({ docsPath: docsPath3 });
  const abiItem3 = abi11.find((x) => x.type === "event" && signature3 === toEventSelector(formatAbiItem2(x)));
  if (!(abiItem3 && ("name" in abiItem3)) || abiItem3.type !== "event")
    throw new AbiEventSignatureNotFoundError(signature3, { docsPath: docsPath3 });
  const { name, inputs } = abiItem3;
  const isUnnamed = inputs?.some((x) => !(("name" in x) && x.name));
  let args = isUnnamed ? [] : {};
  const indexedInputs = inputs.filter((x) => ("indexed" in x) && x.indexed);
  for (let i = 0;i < indexedInputs.length; i++) {
    const param = indexedInputs[i];
    const topic = argTopics[i];
    if (!topic)
      throw new DecodeLogTopicsMismatch({
        abiItem: abiItem3,
        param
      });
    args[isUnnamed ? i : param.name || i] = decodeTopic({ param, value: topic });
  }
  const nonIndexedInputs = inputs.filter((x) => !(("indexed" in x) && x.indexed));
  if (nonIndexedInputs.length > 0) {
    if (data4 && data4 !== "0x") {
      try {
        const decodedData = decodeAbiParameters(nonIndexedInputs, data4);
        if (decodedData) {
          if (isUnnamed)
            args = [...args, ...decodedData];
          else {
            for (let i = 0;i < nonIndexedInputs.length; i++) {
              args[nonIndexedInputs[i].name] = decodedData[i];
            }
          }
        }
      } catch (err) {
        if (strict) {
          if (err instanceof AbiDecodingDataSizeTooSmallError || err instanceof PositionOutOfBoundsError)
            throw new DecodeLogDataMismatch({
              abiItem: abiItem3,
              data: data4,
              params: nonIndexedInputs,
              size: size(data4)
            });
          throw err;
        }
      }
    } else if (strict) {
      throw new DecodeLogDataMismatch({
        abiItem: abiItem3,
        data: "0x",
        params: nonIndexedInputs,
        size: 0
      });
    }
  }
  return {
    eventName: name,
    args: Object.values(args).length > 0 ? args : undefined
  };
}
var decodeTopic = function({ param, value }) {
  if (param.type === "string" || param.type === "bytes" || param.type === "tuple" || param.type.match(/^(.*)\[(\d+)?\]$/))
    return value;
  const decodedArg = decodeAbiParameters([param], value) || [];
  return decodedArg[0];
};
var docsPath3 = "/docs/contract/decodeEventLog";

// node_modules/viem/_esm/utils/abi/parseEventLogs.js
init_getAbiItem();
function parseEventLogs(parameters) {
  const { abi: abi12, args, logs, strict = true } = parameters;
  const eventName = (() => {
    if (!parameters.eventName)
      return;
    if (Array.isArray(parameters.eventName))
      return parameters.eventName;
    return [parameters.eventName];
  })();
  return logs.map((log2) => {
    try {
      const abiItem3 = getAbiItem({
        abi: abi12,
        name: log2.topics[0]
      });
      if (!abiItem3)
        return null;
      const event = decodeEventLog({
        ...log2,
        abi: [abiItem3],
        strict
      });
      if (eventName && !eventName.includes(event.eventName))
        return null;
      if (!includesArgs({
        args: event.args,
        inputs: abiItem3.inputs,
        matchArgs: args
      }))
        return null;
      return { ...event, ...log2 };
    } catch (err) {
      let eventName2;
      let isUnnamed;
      if (err instanceof AbiEventSignatureNotFoundError)
        return null;
      if (err instanceof DecodeLogDataMismatch || err instanceof DecodeLogTopicsMismatch) {
        if (strict)
          return null;
        eventName2 = err.abiItem.name;
        isUnnamed = err.abiItem.inputs?.some((x) => !(("name" in x) && x.name));
      }
      return { ...log2, args: isUnnamed ? [] : {}, eventName: eventName2 };
    }
  }).filter(Boolean);
}
var includesArgs = function(parameters) {
  const { args, inputs, matchArgs } = parameters;
  if (!matchArgs)
    return true;
  if (!args)
    return false;
  function isEqual(input, value, arg) {
    try {
      if (input.type === "address")
        return isAddressEqual(value, arg);
      if (input.type === "string" || input.type === "bytes")
        return keccak256(toBytes(value)) === arg;
      return value === arg;
    } catch {
      return false;
    }
  }
  if (Array.isArray(args) && Array.isArray(matchArgs)) {
    return matchArgs.every((value, index) => {
      if (!value)
        return true;
      const input = inputs[index];
      if (!input)
        return false;
      const value_ = Array.isArray(value) ? value : [value];
      return value_.some((value2) => isEqual(input, value2, args[index]));
    });
  }
  if (typeof args === "object" && !Array.isArray(args) && typeof matchArgs === "object" && !Array.isArray(matchArgs))
    return Object.entries(matchArgs).every(([key, value]) => {
      if (!value)
        return true;
      const input = inputs.find((input2) => input2.name === key);
      if (!input)
        return false;
      const value_ = Array.isArray(value) ? value : [value];
      return value_.some((value2) => isEqual(input, value2, args[key]));
    });
  return false;
};

// node_modules/viem/_esm/actions/public/getLogs.js
init_toHex();

// node_modules/viem/_esm/utils/formatters/log.js
function formatLog(log2, { args, eventName } = {}) {
  return {
    ...log2,
    blockHash: log2.blockHash ? log2.blockHash : null,
    blockNumber: log2.blockNumber ? BigInt(log2.blockNumber) : null,
    logIndex: log2.logIndex ? Number(log2.logIndex) : null,
    transactionHash: log2.transactionHash ? log2.transactionHash : null,
    transactionIndex: log2.transactionIndex ? Number(log2.transactionIndex) : null,
    ...eventName ? { args, eventName } : {}
  };
}

// node_modules/viem/_esm/actions/public/getLogs.js
async function getLogs(client, { address: address6, blockHash, fromBlock, toBlock, event, events: events_, args, strict: strict_ } = {}) {
  const strict = strict_ ?? false;
  const events = events_ ?? (event ? [event] : undefined);
  let topics = [];
  if (events) {
    const encoded = events.flatMap((event2) => encodeEventTopics({
      abi: [event2],
      eventName: event2.name,
      args: events_ ? undefined : args
    }));
    topics = [encoded];
    if (event)
      topics = topics[0];
  }
  let logs;
  if (blockHash) {
    logs = await client.request({
      method: "eth_getLogs",
      params: [{ address: address6, topics, blockHash }]
    });
  } else {
    logs = await client.request({
      method: "eth_getLogs",
      params: [
        {
          address: address6,
          topics,
          fromBlock: typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
          toBlock: typeof toBlock === "bigint" ? numberToHex(toBlock) : toBlock
        }
      ]
    });
  }
  const formattedLogs = logs.map((log3) => formatLog(log3));
  if (!events)
    return formattedLogs;
  return parseEventLogs({
    abi: events,
    args,
    logs: formattedLogs,
    strict
  });
}

// node_modules/viem/_esm/actions/public/getContractEvents.js
async function getContractEvents(client, parameters) {
  const { abi: abi12, address: address6, args, blockHash, eventName, fromBlock, toBlock, strict } = parameters;
  const event = eventName ? getAbiItem({ abi: abi12, name: eventName }) : undefined;
  const events = !event ? abi12.filter((x) => x.type === "event") : undefined;
  return getAction(client, getLogs, "getLogs")({
    address: address6,
    args,
    blockHash,
    event,
    events,
    fromBlock,
    toBlock,
    strict
  });
}

// node_modules/viem/_esm/actions/public/readContract.js
init_decodeFunctionResult();
init_encodeFunctionData();
init_call();
async function readContract(client, parameters) {
  const { abi: abi14, address: address6, args, functionName, ...rest } = parameters;
  const calldata = encodeFunctionData({
    abi: abi14,
    args,
    functionName
  });
  try {
    const { data: data4 } = await getAction(client, call2, "call")({
      ...rest,
      data: calldata,
      to: address6
    });
    return decodeFunctionResult({
      abi: abi14,
      args,
      functionName,
      data: data4 || "0x"
    });
  } catch (error) {
    throw getContractError(error, {
      abi: abi14,
      address: address6,
      args,
      docsPath: "/docs/contract/readContract",
      functionName
    });
  }
}

// node_modules/viem/_esm/actions/public/simulateContract.js
init_parseAccount();
init_decodeFunctionResult();
init_encodeFunctionData();
init_call();
async function simulateContract(client, parameters) {
  const { abi: abi14, address: address6, args, dataSuffix, functionName, ...callRequest } = parameters;
  const account = callRequest.account ? parseAccount(callRequest.account) : client.account;
  const calldata = encodeFunctionData({ abi: abi14, args, functionName });
  try {
    const { data: data4 } = await getAction(client, call2, "call")({
      batch: false,
      data: `${calldata}${dataSuffix ? dataSuffix.replace("0x", "") : ""}`,
      to: address6,
      ...callRequest,
      account
    });
    const result = decodeFunctionResult({
      abi: abi14,
      args,
      functionName,
      data: data4 || "0x"
    });
    const minimizedAbi = abi14.filter((abiItem3) => ("name" in abiItem3) && abiItem3.name === parameters.functionName);
    return {
      result,
      request: {
        abi: minimizedAbi,
        address: address6,
        args,
        dataSuffix,
        functionName,
        ...callRequest,
        account
      }
    };
  } catch (error) {
    throw getContractError(error, {
      abi: abi14,
      address: address6,
      args,
      docsPath: "/docs/contract/simulateContract",
      functionName,
      sender: account?.address
    });
  }
}

// node_modules/viem/_esm/actions/public/watchContractEvent.js
init_abi();
init_rpc();

// node_modules/viem/_esm/utils/observe.js
function observe(observerId, callbacks, fn) {
  const callbackId = ++callbackCount;
  const getListeners = () => listenersCache.get(observerId) || [];
  const unsubscribe = () => {
    const listeners2 = getListeners();
    listenersCache.set(observerId, listeners2.filter((cb) => cb.id !== callbackId));
  };
  const unwatch = () => {
    const cleanup2 = cleanupCache.get(observerId);
    if (getListeners().length === 1 && cleanup2)
      cleanup2();
    unsubscribe();
  };
  const listeners = getListeners();
  listenersCache.set(observerId, [
    ...listeners,
    { id: callbackId, fns: callbacks }
  ]);
  if (listeners && listeners.length > 0)
    return unwatch;
  const emit = {};
  for (const key in callbacks) {
    emit[key] = (...args) => {
      const listeners2 = getListeners();
      if (listeners2.length === 0)
        return;
      for (const listener of listeners2)
        listener.fns[key]?.(...args);
    };
  }
  const cleanup = fn(emit);
  if (typeof cleanup === "function")
    cleanupCache.set(observerId, cleanup);
  return unwatch;
}
var listenersCache = new Map;
var cleanupCache = new Map;
var callbackCount = 0;

// node_modules/viem/_esm/utils/wait.js
async function wait(time) {
  return new Promise((res) => setTimeout(res, time));
}

// node_modules/viem/_esm/utils/poll.js
function poll(fn, { emitOnBegin, initialWaitTime, interval }) {
  let active = true;
  const unwatch = () => active = false;
  const watch = async () => {
    let data4 = undefined;
    if (emitOnBegin)
      data4 = await fn({ unpoll: unwatch });
    const initialWait = await initialWaitTime?.(data4) ?? interval;
    await wait(initialWait);
    const poll2 = async () => {
      if (!active)
        return;
      await fn({ unpoll: unwatch });
      await wait(interval);
      poll2();
    };
    poll2();
  };
  watch();
  return unwatch;
}

// node_modules/viem/_esm/actions/public/watchContractEvent.js
init_stringify();

// node_modules/viem/_esm/utils/promise/withCache.js
function getCache(cacheKey) {
  const buildCache = (cacheKey2, cache2) => ({
    clear: () => cache2.delete(cacheKey2),
    get: () => cache2.get(cacheKey2),
    set: (data4) => cache2.set(cacheKey2, data4)
  });
  const promise = buildCache(cacheKey, promiseCache);
  const response = buildCache(cacheKey, responseCache);
  return {
    clear: () => {
      promise.clear();
      response.clear();
    },
    promise,
    response
  };
}
async function withCache(fn, { cacheKey, cacheTime = Number.POSITIVE_INFINITY }) {
  const cache2 = getCache(cacheKey);
  const response = cache2.response.get();
  if (response && cacheTime > 0) {
    const age = new Date().getTime() - response.created.getTime();
    if (age < cacheTime)
      return response.data;
  }
  let promise = cache2.promise.get();
  if (!promise) {
    promise = fn();
    cache2.promise.set(promise);
  }
  try {
    const data4 = await promise;
    cache2.response.set({ created: new Date, data: data4 });
    return data4;
  } finally {
    cache2.promise.clear();
  }
}
var promiseCache = new Map;
var responseCache = new Map;

// node_modules/viem/_esm/actions/public/getBlockNumber.js
async function getBlockNumber(client, { cacheTime = client.cacheTime } = {}) {
  const blockNumberHex = await withCache(() => client.request({
    method: "eth_blockNumber"
  }), { cacheKey: cacheKey(client.uid), cacheTime });
  return BigInt(blockNumberHex);
}
var cacheKey = (id) => `blockNumber.${id}`;

// node_modules/viem/_esm/actions/public/getFilterChanges.js
async function getFilterChanges(_client, { filter }) {
  const strict = "strict" in filter && filter.strict;
  const logs = await filter.request({
    method: "eth_getFilterChanges",
    params: [filter.id]
  });
  if (typeof logs[0] === "string")
    return logs;
  const formattedLogs = logs.map((log4) => formatLog(log4));
  if (!("abi" in filter) || !filter.abi)
    return formattedLogs;
  return parseEventLogs({
    abi: filter.abi,
    logs: formattedLogs,
    strict
  });
}

// node_modules/viem/_esm/actions/public/uninstallFilter.js
async function uninstallFilter(_client, { filter }) {
  return filter.request({
    method: "eth_uninstallFilter",
    params: [filter.id]
  });
}

// node_modules/viem/_esm/actions/public/watchContractEvent.js
function watchContractEvent(client, parameters) {
  const { abi: abi15, address: address6, args, batch = true, eventName, fromBlock, onError, onLogs, poll: poll_, pollingInterval = client.pollingInterval, strict: strict_ } = parameters;
  const enablePolling = (() => {
    if (typeof poll_ !== "undefined")
      return poll_;
    if (typeof fromBlock === "bigint")
      return true;
    if (client.transport.type === "webSocket")
      return false;
    if (client.transport.type === "fallback" && client.transport.transports[0].config.type === "webSocket")
      return false;
    return true;
  })();
  const pollContractEvent = () => {
    const strict = strict_ ?? false;
    const observerId = stringify([
      "watchContractEvent",
      address6,
      args,
      batch,
      client.uid,
      eventName,
      pollingInterval,
      strict,
      fromBlock
    ]);
    return observe(observerId, { onLogs, onError }, (emit) => {
      let previousBlockNumber;
      if (fromBlock !== undefined)
        previousBlockNumber = fromBlock - 1n;
      let filter;
      let initialized = false;
      const unwatch = poll(async () => {
        if (!initialized) {
          try {
            filter = await getAction(client, createContractEventFilter, "createContractEventFilter")({
              abi: abi15,
              address: address6,
              args,
              eventName,
              strict,
              fromBlock
            });
          } catch {
          }
          initialized = true;
          return;
        }
        try {
          let logs;
          if (filter) {
            logs = await getAction(client, getFilterChanges, "getFilterChanges")({ filter });
          } else {
            const blockNumber = await getAction(client, getBlockNumber, "getBlockNumber")({});
            if (previousBlockNumber && previousBlockNumber < blockNumber) {
              logs = await getAction(client, getContractEvents, "getContractEvents")({
                abi: abi15,
                address: address6,
                args,
                eventName,
                fromBlock: previousBlockNumber + 1n,
                toBlock: blockNumber,
                strict
              });
            } else {
              logs = [];
            }
            previousBlockNumber = blockNumber;
          }
          if (logs.length === 0)
            return;
          if (batch)
            emit.onLogs(logs);
          else
            for (const log5 of logs)
              emit.onLogs([log5]);
        } catch (err) {
          if (filter && err instanceof InvalidInputRpcError)
            initialized = false;
          emit.onError?.(err);
        }
      }, {
        emitOnBegin: true,
        interval: pollingInterval
      });
      return async () => {
        if (filter)
          await getAction(client, uninstallFilter, "uninstallFilter")({ filter });
        unwatch();
      };
    });
  };
  const subscribeContractEvent = () => {
    const strict = strict_ ?? false;
    const observerId = stringify([
      "watchContractEvent",
      address6,
      args,
      batch,
      client.uid,
      eventName,
      pollingInterval,
      strict
    ]);
    let active = true;
    let unsubscribe = () => active = false;
    return observe(observerId, { onLogs, onError }, (emit) => {
      (async () => {
        try {
          const transport = (() => {
            if (client.transport.type === "fallback") {
              const transport2 = client.transport.transports.find((transport3) => transport3.config.type === "webSocket");
              if (!transport2)
                return client.transport;
              return transport2.value;
            }
            return client.transport;
          })();
          const topics = eventName ? encodeEventTopics({
            abi: abi15,
            eventName,
            args
          }) : [];
          const { unsubscribe: unsubscribe_ } = await transport.subscribe({
            params: ["logs", { address: address6, topics }],
            onData(data4) {
              if (!active)
                return;
              const log5 = data4.result;
              try {
                const { eventName: eventName2, args: args2 } = decodeEventLog({
                  abi: abi15,
                  data: log5.data,
                  topics: log5.topics,
                  strict: strict_
                });
                const formatted = formatLog(log5, {
                  args: args2,
                  eventName: eventName2
                });
                emit.onLogs([formatted]);
              } catch (err) {
                let eventName2;
                let isUnnamed;
                if (err instanceof DecodeLogDataMismatch || err instanceof DecodeLogTopicsMismatch) {
                  if (strict_)
                    return;
                  eventName2 = err.abiItem.name;
                  isUnnamed = err.abiItem.inputs?.some((x) => !(("name" in x) && x.name));
                }
                const formatted = formatLog(log5, {
                  args: isUnnamed ? [] : {},
                  eventName: eventName2
                });
                emit.onLogs([formatted]);
              }
            },
            onError(error) {
              emit.onError?.(error);
            }
          });
          unsubscribe = unsubscribe_;
          if (!active)
            unsubscribe();
        } catch (err) {
          onError?.(err);
        }
      })();
      return () => unsubscribe();
    });
  };
  return enablePolling ? pollContractEvent() : subscribeContractEvent();
}

// node_modules/viem/_esm/actions/wallet/sendRawTransaction.js
async function sendRawTransaction(client, { serializedTransaction }) {
  return client.request({
    method: "eth_sendRawTransaction",
    params: [serializedTransaction]
  }, { retryCount: 0 });
}

// node_modules/viem/_esm/errors/eip712.js
init_base();

class Eip712DomainNotFoundError extends BaseError2 {
  constructor({ address: address6 }) {
    super(`No EIP-712 domain found on contract "${address6}".`, {
      metaMessages: [
        "Ensure that:",
        `- The contract is deployed at the address "${address6}".`,
        "- `eip712Domain()` function exists on the contract.",
        "- `eip712Domain()` function matches signature to ERC-5267 specification."
      ],
      name: "Eip712DomainNotFoundError"
    });
  }
}

// node_modules/viem/_esm/actions/public/getEip712Domain.js
async function getEip712Domain(client, parameters) {
  const { address: address6, factory, factoryData } = parameters;
  try {
    const [fields, name, version5, chainId, verifyingContract, salt, extensions] = await getAction(client, readContract, "readContract")({
      abi: abi15,
      address: address6,
      functionName: "eip712Domain",
      factory,
      factoryData
    });
    return {
      domain: {
        name,
        version: version5,
        chainId: Number(chainId),
        verifyingContract,
        salt
      },
      extensions,
      fields
    };
  } catch (e) {
    const error = e;
    if (error.name === "ContractFunctionExecutionError" && error.cause.name === "ContractFunctionZeroDataError") {
      throw new Eip712DomainNotFoundError({ address: address6 });
    }
    throw error;
  }
}
var abi15 = [
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      { name: "fields", type: "bytes1" },
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
      { name: "salt", type: "bytes32" },
      { name: "extensions", type: "uint256[]" }
    ],
    stateMutability: "view",
    type: "function"
  }
];

// node_modules/viem/_esm/clients/createClient.js
init_parseAccount();

// node_modules/viem/_esm/utils/uid.js
function uid(length = 11) {
  if (!buffer || index + length > size9 * 2) {
    buffer = "";
    index = 0;
    for (let i = 0;i < size9; i++) {
      buffer += (256 + Math.random() * 256 | 0).toString(16).substring(1);
    }
  }
  return buffer.substring(index, index++ + length);
}
var size9 = 256;
var index = size9;
var buffer;

// node_modules/viem/_esm/clients/createClient.js
function createClient(parameters) {
  const { batch, cacheTime = parameters.pollingInterval ?? 4000, ccipRead, key = "base", name = "Base Client", pollingInterval = 4000, type = "base" } = parameters;
  const chain3 = parameters.chain;
  const account = parameters.account ? parseAccount(parameters.account) : undefined;
  const { config, request: request3, value } = parameters.transport({
    chain: chain3,
    pollingInterval
  });
  const transport = { ...config, ...value };
  const client = {
    account,
    batch,
    cacheTime,
    ccipRead,
    chain: chain3,
    key,
    name,
    pollingInterval,
    request: request3,
    transport,
    type,
    uid: uid()
  };
  function extend(base28) {
    return (extendFn) => {
      const extended = extendFn(base28);
      for (const key2 in client)
        delete extended[key2];
      const combined = { ...base28, ...extended };
      return Object.assign(combined, { extend: extend(combined) });
    };
  }
  return Object.assign(client, { extend: extend(client) });
}

// node_modules/viem/_esm/utils/buildRequest.js
init_base();
init_request();
init_rpc();
init_toHex();
init_keccak256();

// node_modules/viem/_esm/utils/promise/withDedupe.js
init_lru();
function withDedupe(fn, { enabled = true, id }) {
  if (!enabled || !id)
    return fn();
  if (promiseCache2.get(id))
    return promiseCache2.get(id);
  const promise = fn().finally(() => promiseCache2.delete(id));
  promiseCache2.set(id, promise);
  return promise;
}
var promiseCache2 = new LruMap(8192);

// node_modules/viem/_esm/utils/promise/withRetry.js
function withRetry(fn, { delay: delay_ = 100, retryCount = 2, shouldRetry = () => true } = {}) {
  return new Promise((resolve, reject) => {
    const attemptRetry = async ({ count = 0 } = {}) => {
      const retry = async ({ error }) => {
        const delay = typeof delay_ === "function" ? delay_({ count, error }) : delay_;
        if (delay)
          await wait(delay);
        attemptRetry({ count: count + 1 });
      };
      try {
        const data4 = await fn();
        resolve(data4);
      } catch (err) {
        if (count < retryCount && await shouldRetry({ count, error: err }))
          return retry({ error: err });
        reject(err);
      }
    };
    attemptRetry();
  });
}

// node_modules/viem/_esm/utils/buildRequest.js
init_stringify();
function buildRequest(request4, options = {}) {
  return async (args, overrideOptions = {}) => {
    const { dedupe = false, retryDelay = 150, retryCount = 3, uid: uid3 } = {
      ...options,
      ...overrideOptions
    };
    const requestId = dedupe ? keccak256(stringToHex(`${uid3}.${stringify(args)}`)) : undefined;
    return withDedupe(() => withRetry(async () => {
      try {
        return await request4(args);
      } catch (err_) {
        const err = err_;
        switch (err.code) {
          case ParseRpcError.code:
            throw new ParseRpcError(err);
          case InvalidRequestRpcError.code:
            throw new InvalidRequestRpcError(err);
          case MethodNotFoundRpcError.code:
            throw new MethodNotFoundRpcError(err, { method: args.method });
          case InvalidParamsRpcError.code:
            throw new InvalidParamsRpcError(err);
          case InternalRpcError.code:
            throw new InternalRpcError(err);
          case InvalidInputRpcError.code:
            throw new InvalidInputRpcError(err);
          case ResourceNotFoundRpcError.code:
            throw new ResourceNotFoundRpcError(err);
          case ResourceUnavailableRpcError.code:
            throw new ResourceUnavailableRpcError(err);
          case TransactionRejectedRpcError.code:
            throw new TransactionRejectedRpcError(err);
          case MethodNotSupportedRpcError.code:
            throw new MethodNotSupportedRpcError(err, {
              method: args.method
            });
          case LimitExceededRpcError.code:
            throw new LimitExceededRpcError(err);
          case JsonRpcVersionUnsupportedError.code:
            throw new JsonRpcVersionUnsupportedError(err);
          case UserRejectedRequestError.code:
            throw new UserRejectedRequestError(err);
          case UnauthorizedProviderError.code:
            throw new UnauthorizedProviderError(err);
          case UnsupportedProviderMethodError.code:
            throw new UnsupportedProviderMethodError(err);
          case ProviderDisconnectedError.code:
            throw new ProviderDisconnectedError(err);
          case ChainDisconnectedError.code:
            throw new ChainDisconnectedError(err);
          case SwitchChainError.code:
            throw new SwitchChainError(err);
          case 5000:
            throw new UserRejectedRequestError(err);
          default:
            if (err_ instanceof BaseError2)
              throw err_;
            throw new UnknownRpcError(err);
        }
      }
    }, {
      delay: ({ count, error }) => {
        if (error && error instanceof HttpRequestError) {
          const retryAfter = error?.headers?.get("Retry-After");
          if (retryAfter?.match(/\d/))
            return Number.parseInt(retryAfter) * 1000;
        }
        return ~~(1 << count) * retryDelay;
      },
      retryCount,
      shouldRetry: ({ error }) => shouldRetry(error)
    }), { enabled: dedupe, id: requestId });
  };
}
function shouldRetry(error) {
  if ("code" in error && typeof error.code === "number") {
    if (error.code === -1)
      return true;
    if (error.code === LimitExceededRpcError.code)
      return true;
    if (error.code === InternalRpcError.code)
      return true;
    return false;
  }
  if (error instanceof HttpRequestError && error.status) {
    if (error.status === 403)
      return true;
    if (error.status === 408)
      return true;
    if (error.status === 413)
      return true;
    if (error.status === 429)
      return true;
    if (error.status === 500)
      return true;
    if (error.status === 502)
      return true;
    if (error.status === 503)
      return true;
    if (error.status === 504)
      return true;
    return false;
  }
  return true;
}

// node_modules/viem/_esm/clients/transports/createTransport.js
function createTransport({ key, name, request: request4, retryCount = 3, retryDelay = 150, timeout, type }, value) {
  const uid4 = uid();
  return {
    config: {
      key,
      name,
      request: request4,
      retryCount,
      retryDelay,
      timeout,
      type
    },
    request: buildRequest(request4, { retryCount, retryDelay, uid: uid4 }),
    value
  };
}

// node_modules/viem/_esm/clients/transports/http.js
init_request();

// node_modules/viem/_esm/errors/transport.js
init_base();

class UrlRequiredError extends BaseError2 {
  constructor() {
    super("No URL was provided to the Transport. Please provide a valid RPC URL to the Transport.", {
      docsPath: "/docs/clients/intro",
      name: "UrlRequiredError"
    });
  }
}

// node_modules/viem/_esm/clients/transports/http.js
init_createBatchScheduler();

// node_modules/viem/_esm/utils/rpc/http.js
init_request();

// node_modules/viem/_esm/utils/promise/withTimeout.js
function withTimeout(fn, { errorInstance = new Error("timed out"), timeout, signal }) {
  return new Promise((resolve, reject) => {
    (async () => {
      let timeoutId;
      try {
        const controller = new AbortController;
        if (timeout > 0) {
          timeoutId = setTimeout(() => {
            if (signal) {
              controller.abort();
            } else {
              reject(errorInstance);
            }
          }, timeout);
        }
        resolve(await fn({ signal: controller?.signal || null }));
      } catch (err) {
        if (err?.name === "AbortError")
          reject(errorInstance);
        reject(err);
      } finally {
        clearTimeout(timeoutId);
      }
    })();
  });
}

// node_modules/viem/_esm/utils/rpc/http.js
init_stringify();

// node_modules/viem/_esm/utils/rpc/id.js
var createIdStore = function() {
  return {
    current: 0,
    take() {
      return this.current++;
    },
    reset() {
      this.current = 0;
    }
  };
};
var idCache = createIdStore();

// node_modules/viem/_esm/utils/rpc/http.js
function getHttpRpcClient(url, options = {}) {
  return {
    async request(params) {
      const { body, onRequest = options.onRequest, onResponse = options.onResponse, timeout = options.timeout ?? 1e4 } = params;
      const fetchOptions = {
        ...options.fetchOptions ?? {},
        ...params.fetchOptions ?? {}
      };
      const { headers, method, signal: signal_ } = fetchOptions;
      try {
        const response = await withTimeout(async ({ signal }) => {
          const init = {
            ...fetchOptions,
            body: Array.isArray(body) ? stringify(body.map((body2) => ({
              jsonrpc: "2.0",
              id: body2.id ?? idCache.take(),
              ...body2
            }))) : stringify({
              jsonrpc: "2.0",
              id: body.id ?? idCache.take(),
              ...body
            }),
            headers: {
              "Content-Type": "application/json",
              ...headers
            },
            method: method || "POST",
            signal: signal_ || (timeout > 0 ? signal : null)
          };
          const request5 = new Request(url, init);
          if (onRequest)
            await onRequest(request5);
          const response2 = await fetch(url, init);
          return response2;
        }, {
          errorInstance: new TimeoutError({ body, url }),
          timeout,
          signal: true
        });
        if (onResponse)
          await onResponse(response);
        let data4;
        if (response.headers.get("Content-Type")?.startsWith("application/json"))
          data4 = await response.json();
        else {
          data4 = await response.text();
          data4 = JSON.parse(data4 || "{}");
        }
        if (!response.ok) {
          throw new HttpRequestError({
            body,
            details: stringify(data4.error) || response.statusText,
            headers: response.headers,
            status: response.status,
            url
          });
        }
        return data4;
      } catch (err) {
        if (err instanceof HttpRequestError)
          throw err;
        if (err instanceof TimeoutError)
          throw err;
        throw new HttpRequestError({
          body,
          cause: err,
          url
        });
      }
    }
  };
}

// node_modules/viem/_esm/clients/transports/http.js
function http2(url, config = {}) {
  const { batch, fetchOptions, key = "http", name = "HTTP JSON-RPC", onFetchRequest, onFetchResponse, retryDelay } = config;
  return ({ chain: chain3, retryCount: retryCount_, timeout: timeout_ }) => {
    const { batchSize = 1000, wait: wait4 = 0 } = typeof batch === "object" ? batch : {};
    const retryCount = config.retryCount ?? retryCount_;
    const timeout = timeout_ ?? config.timeout ?? 1e4;
    const url_ = url || chain3?.rpcUrls.default.http[0];
    if (!url_)
      throw new UrlRequiredError;
    const rpcClient = getHttpRpcClient(url_, {
      fetchOptions,
      onRequest: onFetchRequest,
      onResponse: onFetchResponse,
      timeout
    });
    return createTransport({
      key,
      name,
      async request({ method, params }) {
        const body = { method, params };
        const { schedule } = createBatchScheduler({
          id: url_,
          wait: wait4,
          shouldSplitBatch(requests) {
            return requests.length > batchSize;
          },
          fn: (body2) => rpcClient.request({
            body: body2
          }),
          sort: (a, b) => a.id - b.id
        });
        const fn = async (body2) => batch ? schedule(body2) : [
          await rpcClient.request({
            body: body2
          })
        ];
        const [{ error, result }] = await fn(body);
        if (error)
          throw new RpcRequestError({
            body,
            error,
            url: url_
          });
        return result;
      },
      retryCount,
      retryDelay,
      timeout,
      type: "http"
    }, {
      fetchOptions,
      url: url_
    });
  };
}
// node_modules/viem/_esm/actions/ens/getEnsAddress.js
init_abis();
init_decodeFunctionResult();
init_encodeFunctionData();
init_getChainContractAddress();
init_trim();
init_toHex();

// node_modules/viem/_esm/utils/ens/errors.js
init_solidity();
init_base();
init_contract();
function isNullUniversalResolverError(err, callType) {
  if (!(err instanceof BaseError2))
    return false;
  const cause = err.walk((e) => e instanceof ContractFunctionRevertedError);
  if (!(cause instanceof ContractFunctionRevertedError))
    return false;
  if (cause.data?.errorName === "ResolverNotFound")
    return true;
  if (cause.data?.errorName === "ResolverWildcardNotSupported")
    return true;
  if (cause.data?.errorName === "ResolverNotContract")
    return true;
  if (cause.data?.errorName === "ResolverError")
    return true;
  if (cause.data?.errorName === "HttpError")
    return true;
  if (cause.reason?.includes("Wildcard on non-extended resolvers is not supported"))
    return true;
  if (callType === "reverse" && cause.reason === panicReasons[50])
    return true;
  return false;
}

// node_modules/viem/_esm/utils/ens/namehash.js
init_concat();
init_toBytes();
init_toHex();
init_keccak256();

// node_modules/viem/_esm/utils/ens/encodedLabelToLabelhash.js
init_isHex();
function encodedLabelToLabelhash(label) {
  if (label.length !== 66)
    return null;
  if (label.indexOf("[") !== 0)
    return null;
  if (label.indexOf("]") !== 65)
    return null;
  const hash3 = `0x${label.slice(1, 65)}`;
  if (!isHex(hash3))
    return null;
  return hash3;
}

// node_modules/viem/_esm/utils/ens/namehash.js
function namehash(name) {
  let result = new Uint8Array(32).fill(0);
  if (!name)
    return bytesToHex(result);
  const labels = name.split(".");
  for (let i = labels.length - 1;i >= 0; i -= 1) {
    const hashFromEncodedLabel = encodedLabelToLabelhash(labels[i]);
    const hashed = hashFromEncodedLabel ? toBytes(hashFromEncodedLabel) : keccak256(stringToBytes(labels[i]), "bytes");
    result = keccak256(concat([result, hashed]), "bytes");
  }
  return bytesToHex(result);
}

// node_modules/viem/_esm/utils/ens/packetToBytes.js
init_toBytes();

// node_modules/viem/_esm/utils/ens/encodeLabelhash.js
function encodeLabelhash(hash3) {
  return `[${hash3.slice(2)}]`;
}

// node_modules/viem/_esm/utils/ens/labelhash.js
init_toBytes();
init_toHex();
init_keccak256();
function labelhash(label) {
  const result = new Uint8Array(32).fill(0);
  if (!label)
    return bytesToHex(result);
  return encodedLabelToLabelhash(label) || keccak256(stringToBytes(label));
}

// node_modules/viem/_esm/utils/ens/packetToBytes.js
function packetToBytes(packet) {
  const value = packet.replace(/^\.|\.$/gm, "");
  if (value.length === 0)
    return new Uint8Array(1);
  const bytes2 = new Uint8Array(stringToBytes(value).byteLength + 2);
  let offset = 0;
  const list = value.split(".");
  for (let i = 0;i < list.length; i++) {
    let encoded = stringToBytes(list[i]);
    if (encoded.byteLength > 255)
      encoded = stringToBytes(encodeLabelhash(labelhash(list[i])));
    bytes2[offset] = encoded.length;
    bytes2.set(encoded, offset + 1);
    offset += encoded.length + 1;
  }
  if (bytes2.byteLength !== offset + 1)
    return bytes2.slice(0, offset + 1);
  return bytes2;
}

// node_modules/viem/_esm/actions/ens/getEnsAddress.js
async function getEnsAddress(client, { blockNumber, blockTag, coinType, name, gatewayUrls, strict, universalResolverAddress: universalResolverAddress_ }) {
  let universalResolverAddress = universalResolverAddress_;
  if (!universalResolverAddress) {
    if (!client.chain)
      throw new Error("client chain not configured. universalResolverAddress is required.");
    universalResolverAddress = getChainContractAddress({
      blockNumber,
      chain: client.chain,
      contract: "ensUniversalResolver"
    });
  }
  try {
    const functionData = encodeFunctionData({
      abi: addressResolverAbi,
      functionName: "addr",
      ...coinType != null ? { args: [namehash(name), BigInt(coinType)] } : { args: [namehash(name)] }
    });
    const readContractParameters = {
      address: universalResolverAddress,
      abi: universalResolverResolveAbi,
      functionName: "resolve",
      args: [toHex(packetToBytes(name)), functionData],
      blockNumber,
      blockTag
    };
    const readContractAction = getAction(client, readContract, "readContract");
    const res = gatewayUrls ? await readContractAction({
      ...readContractParameters,
      args: [...readContractParameters.args, gatewayUrls]
    }) : await readContractAction(readContractParameters);
    if (res[0] === "0x")
      return null;
    const address6 = decodeFunctionResult({
      abi: addressResolverAbi,
      args: coinType != null ? [namehash(name), BigInt(coinType)] : undefined,
      functionName: "addr",
      data: res[0]
    });
    if (address6 === "0x")
      return null;
    if (trim(address6) === "0x00")
      return null;
    return address6;
  } catch (err) {
    if (strict)
      throw err;
    if (isNullUniversalResolverError(err, "resolve"))
      return null;
    throw err;
  }
}

// node_modules/viem/_esm/errors/ens.js
init_base();

class EnsAvatarInvalidMetadataError extends BaseError2 {
  constructor({ data: data4 }) {
    super("Unable to extract image from metadata. The metadata may be malformed or invalid.", {
      metaMessages: [
        "- Metadata must be a JSON object with at least an `image`, `image_url` or `image_data` property.",
        "",
        `Provided data: ${JSON.stringify(data4)}`
      ],
      name: "EnsAvatarInvalidMetadataError"
    });
  }
}

class EnsAvatarInvalidNftUriError extends BaseError2 {
  constructor({ reason }) {
    super(`ENS NFT avatar URI is invalid. ${reason}`, {
      name: "EnsAvatarInvalidNftUriError"
    });
  }
}

class EnsAvatarUriResolutionError extends BaseError2 {
  constructor({ uri }) {
    super(`Unable to resolve ENS avatar URI "${uri}". The URI may be malformed, invalid, or does not respond with a valid image.`, { name: "EnsAvatarUriResolutionError" });
  }
}

class EnsAvatarUnsupportedNamespaceError extends BaseError2 {
  constructor({ namespace }) {
    super(`ENS NFT avatar namespace "${namespace}" is not supported. Must be "erc721" or "erc1155".`, { name: "EnsAvatarUnsupportedNamespaceError" });
  }
}

// node_modules/viem/_esm/utils/ens/avatar/utils.js
async function isImageUri(uri) {
  try {
    const res = await fetch(uri, { method: "HEAD" });
    if (res.status === 200) {
      const contentType = res.headers.get("content-type");
      return contentType?.startsWith("image/");
    }
    return false;
  } catch (error) {
    if (typeof error === "object" && typeof error.response !== "undefined") {
      return false;
    }
    if (!globalThis.hasOwnProperty("Image"))
      return false;
    return new Promise((resolve) => {
      const img = new Image;
      img.onload = () => {
        resolve(true);
      };
      img.onerror = () => {
        resolve(false);
      };
      img.src = uri;
    });
  }
}
function getGateway(custom, defaultGateway) {
  if (!custom)
    return defaultGateway;
  if (custom.endsWith("/"))
    return custom.slice(0, -1);
  return custom;
}
function resolveAvatarUri({ uri, gatewayUrls }) {
  const isEncoded = base64Regex.test(uri);
  if (isEncoded)
    return { uri, isOnChain: true, isEncoded };
  const ipfsGateway = getGateway(gatewayUrls?.ipfs, "https://ipfs.io");
  const arweaveGateway = getGateway(gatewayUrls?.arweave, "https://arweave.net");
  const networkRegexMatch = uri.match(networkRegex);
  const { protocol, subpath, target, subtarget = "" } = networkRegexMatch?.groups || {};
  const isIPNS = protocol === "ipns:/" || subpath === "ipns/";
  const isIPFS = protocol === "ipfs:/" || subpath === "ipfs/" || ipfsHashRegex.test(uri);
  if (uri.startsWith("http") && !isIPNS && !isIPFS) {
    let replacedUri = uri;
    if (gatewayUrls?.arweave)
      replacedUri = uri.replace(/https:\/\/arweave.net/g, gatewayUrls?.arweave);
    return { uri: replacedUri, isOnChain: false, isEncoded: false };
  }
  if ((isIPNS || isIPFS) && target) {
    return {
      uri: `${ipfsGateway}/${isIPNS ? "ipns" : "ipfs"}/${target}${subtarget}`,
      isOnChain: false,
      isEncoded: false
    };
  }
  if (protocol === "ar:/" && target) {
    return {
      uri: `${arweaveGateway}/${target}${subtarget || ""}`,
      isOnChain: false,
      isEncoded: false
    };
  }
  let parsedUri = uri.replace(dataURIRegex, "");
  if (parsedUri.startsWith("<svg")) {
    parsedUri = `data:image/svg+xml;base64,${btoa(parsedUri)}`;
  }
  if (parsedUri.startsWith("data:") || parsedUri.startsWith("{")) {
    return {
      uri: parsedUri,
      isOnChain: true,
      isEncoded: false
    };
  }
  throw new EnsAvatarUriResolutionError({ uri });
}
function getJsonImage(data4) {
  if (typeof data4 !== "object" || !("image" in data4) && !("image_url" in data4) && !("image_data" in data4)) {
    throw new EnsAvatarInvalidMetadataError({ data: data4 });
  }
  return data4.image || data4.image_url || data4.image_data;
}
async function getMetadataAvatarUri({ gatewayUrls, uri }) {
  try {
    const res = await fetch(uri).then((res2) => res2.json());
    const image = await parseAvatarUri({
      gatewayUrls,
      uri: getJsonImage(res)
    });
    return image;
  } catch {
    throw new EnsAvatarUriResolutionError({ uri });
  }
}
async function parseAvatarUri({ gatewayUrls, uri }) {
  const { uri: resolvedURI, isOnChain } = resolveAvatarUri({ uri, gatewayUrls });
  if (isOnChain)
    return resolvedURI;
  const isImage = await isImageUri(resolvedURI);
  if (isImage)
    return resolvedURI;
  throw new EnsAvatarUriResolutionError({ uri });
}
function parseNftUri(uri_) {
  let uri = uri_;
  if (uri.startsWith("did:nft:")) {
    uri = uri.replace("did:nft:", "").replace(/_/g, "/");
  }
  const [reference, asset_namespace, tokenID] = uri.split("/");
  const [eip_namespace, chainID] = reference.split(":");
  const [erc_namespace, contractAddress] = asset_namespace.split(":");
  if (!eip_namespace || eip_namespace.toLowerCase() !== "eip155")
    throw new EnsAvatarInvalidNftUriError({ reason: "Only EIP-155 supported" });
  if (!chainID)
    throw new EnsAvatarInvalidNftUriError({ reason: "Chain ID not found" });
  if (!contractAddress)
    throw new EnsAvatarInvalidNftUriError({
      reason: "Contract address not found"
    });
  if (!tokenID)
    throw new EnsAvatarInvalidNftUriError({ reason: "Token ID not found" });
  if (!erc_namespace)
    throw new EnsAvatarInvalidNftUriError({ reason: "ERC namespace not found" });
  return {
    chainID: Number.parseInt(chainID),
    namespace: erc_namespace.toLowerCase(),
    contractAddress,
    tokenID
  };
}
async function getNftTokenUri(client, { nft }) {
  if (nft.namespace === "erc721") {
    return readContract(client, {
      address: nft.contractAddress,
      abi: [
        {
          name: "tokenURI",
          type: "function",
          stateMutability: "view",
          inputs: [{ name: "tokenId", type: "uint256" }],
          outputs: [{ name: "", type: "string" }]
        }
      ],
      functionName: "tokenURI",
      args: [BigInt(nft.tokenID)]
    });
  }
  if (nft.namespace === "erc1155") {
    return readContract(client, {
      address: nft.contractAddress,
      abi: [
        {
          name: "uri",
          type: "function",
          stateMutability: "view",
          inputs: [{ name: "_id", type: "uint256" }],
          outputs: [{ name: "", type: "string" }]
        }
      ],
      functionName: "uri",
      args: [BigInt(nft.tokenID)]
    });
  }
  throw new EnsAvatarUnsupportedNamespaceError({ namespace: nft.namespace });
}
var networkRegex = /(?<protocol>https?:\/\/[^\/]*|ipfs:\/|ipns:\/|ar:\/)?(?<root>\/)?(?<subpath>ipfs\/|ipns\/)?(?<target>[\w\-.]+)(?<subtarget>\/.*)?/;
var ipfsHashRegex = /^(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})(\/(?<target>[\w\-.]+))?(?<subtarget>\/.*)?$/;
var base64Regex = /^data:([a-zA-Z\-/+]*);base64,([^"].*)/;
var dataURIRegex = /^data:([a-zA-Z\-/+]*)?(;[a-zA-Z0-9].*?)?(,)/;

// node_modules/viem/_esm/utils/ens/avatar/parseAvatarRecord.js
async function parseAvatarRecord(client, { gatewayUrls, record }) {
  if (/eip155:/i.test(record))
    return parseNftAvatarUri(client, { gatewayUrls, record });
  return parseAvatarUri({ uri: record, gatewayUrls });
}
async function parseNftAvatarUri(client, { gatewayUrls, record }) {
  const nft = parseNftUri(record);
  const nftUri = await getNftTokenUri(client, { nft });
  const { uri: resolvedNftUri, isOnChain, isEncoded } = resolveAvatarUri({ uri: nftUri, gatewayUrls });
  if (isOnChain && (resolvedNftUri.includes("data:application/json;base64,") || resolvedNftUri.startsWith("{"))) {
    const encodedJson = isEncoded ? atob(resolvedNftUri.replace("data:application/json;base64,", "")) : resolvedNftUri;
    const decoded = JSON.parse(encodedJson);
    return parseAvatarUri({ uri: getJsonImage(decoded), gatewayUrls });
  }
  let uriTokenId = nft.tokenID;
  if (nft.namespace === "erc1155")
    uriTokenId = uriTokenId.replace("0x", "").padStart(64, "0");
  return getMetadataAvatarUri({
    gatewayUrls,
    uri: resolvedNftUri.replace(/(?:0x)?{id}/, uriTokenId)
  });
}

// node_modules/viem/_esm/actions/ens/getEnsText.js
init_abis();
init_decodeFunctionResult();
init_encodeFunctionData();
init_getChainContractAddress();
init_toHex();
async function getEnsText(client, { blockNumber, blockTag, name, key, gatewayUrls, strict, universalResolverAddress: universalResolverAddress_ }) {
  let universalResolverAddress = universalResolverAddress_;
  if (!universalResolverAddress) {
    if (!client.chain)
      throw new Error("client chain not configured. universalResolverAddress is required.");
    universalResolverAddress = getChainContractAddress({
      blockNumber,
      chain: client.chain,
      contract: "ensUniversalResolver"
    });
  }
  try {
    const readContractParameters = {
      address: universalResolverAddress,
      abi: universalResolverResolveAbi,
      functionName: "resolve",
      args: [
        toHex(packetToBytes(name)),
        encodeFunctionData({
          abi: textResolverAbi,
          functionName: "text",
          args: [namehash(name), key]
        })
      ],
      blockNumber,
      blockTag
    };
    const readContractAction = getAction(client, readContract, "readContract");
    const res = gatewayUrls ? await readContractAction({
      ...readContractParameters,
      args: [...readContractParameters.args, gatewayUrls]
    }) : await readContractAction(readContractParameters);
    if (res[0] === "0x")
      return null;
    const record = decodeFunctionResult({
      abi: textResolverAbi,
      functionName: "text",
      data: res[0]
    });
    return record === "" ? null : record;
  } catch (err) {
    if (strict)
      throw err;
    if (isNullUniversalResolverError(err, "resolve"))
      return null;
    throw err;
  }
}

// node_modules/viem/_esm/actions/ens/getEnsAvatar.js
async function getEnsAvatar(client, { blockNumber, blockTag, assetGatewayUrls, name, gatewayUrls, strict, universalResolverAddress }) {
  const record = await getAction(client, getEnsText, "getEnsText")({
    blockNumber,
    blockTag,
    key: "avatar",
    name,
    universalResolverAddress,
    gatewayUrls,
    strict
  });
  if (!record)
    return null;
  try {
    return await parseAvatarRecord(client, {
      record,
      gatewayUrls: assetGatewayUrls
    });
  } catch {
    return null;
  }
}

// node_modules/viem/_esm/actions/ens/getEnsName.js
init_abis();
init_getChainContractAddress();
init_toHex();
async function getEnsName(client, { address: address6, blockNumber, blockTag, gatewayUrls, strict, universalResolverAddress: universalResolverAddress_ }) {
  let universalResolverAddress = universalResolverAddress_;
  if (!universalResolverAddress) {
    if (!client.chain)
      throw new Error("client chain not configured. universalResolverAddress is required.");
    universalResolverAddress = getChainContractAddress({
      blockNumber,
      chain: client.chain,
      contract: "ensUniversalResolver"
    });
  }
  const reverseNode = `${address6.toLowerCase().substring(2)}.addr.reverse`;
  try {
    const readContractParameters = {
      address: universalResolverAddress,
      abi: universalResolverReverseAbi,
      functionName: "reverse",
      args: [toHex(packetToBytes(reverseNode))],
      blockNumber,
      blockTag
    };
    const readContractAction = getAction(client, readContract, "readContract");
    const [name, resolvedAddress] = gatewayUrls ? await readContractAction({
      ...readContractParameters,
      args: [...readContractParameters.args, gatewayUrls]
    }) : await readContractAction(readContractParameters);
    if (address6.toLowerCase() !== resolvedAddress.toLowerCase())
      return null;
    return name;
  } catch (err) {
    if (strict)
      throw err;
    if (isNullUniversalResolverError(err, "reverse"))
      return null;
    throw err;
  }
}

// node_modules/viem/_esm/actions/ens/getEnsResolver.js
init_getChainContractAddress();
init_toHex();
async function getEnsResolver(client, { blockNumber, blockTag, name, universalResolverAddress: universalResolverAddress_ }) {
  let universalResolverAddress = universalResolverAddress_;
  if (!universalResolverAddress) {
    if (!client.chain)
      throw new Error("client chain not configured. universalResolverAddress is required.");
    universalResolverAddress = getChainContractAddress({
      blockNumber,
      chain: client.chain,
      contract: "ensUniversalResolver"
    });
  }
  const [resolverAddress] = await getAction(client, readContract, "readContract")({
    address: universalResolverAddress,
    abi: [
      {
        inputs: [{ type: "bytes" }],
        name: "findResolver",
        outputs: [{ type: "address" }, { type: "bytes32" }],
        stateMutability: "view",
        type: "function"
      }
    ],
    functionName: "findResolver",
    args: [toHex(packetToBytes(name))],
    blockNumber,
    blockTag
  });
  return resolverAddress;
}

// node_modules/viem/_esm/clients/decorators/public.js
init_call();

// node_modules/viem/_esm/actions/public/createBlockFilter.js
async function createBlockFilter(client) {
  const getRequest = createFilterRequestScope(client, {
    method: "eth_newBlockFilter"
  });
  const id2 = await client.request({
    method: "eth_newBlockFilter"
  });
  return { id: id2, request: getRequest(id2), type: "block" };
}

// node_modules/viem/_esm/actions/public/createEventFilter.js
init_toHex();
async function createEventFilter(client, { address: address6, args, event, events: events_, fromBlock, strict, toBlock } = {}) {
  const events = events_ ?? (event ? [event] : undefined);
  const getRequest = createFilterRequestScope(client, {
    method: "eth_newFilter"
  });
  let topics = [];
  if (events) {
    const encoded = events.flatMap((event2) => encodeEventTopics({
      abi: [event2],
      eventName: event2.name,
      args
    }));
    topics = [encoded];
    if (event)
      topics = topics[0];
  }
  const id2 = await client.request({
    method: "eth_newFilter",
    params: [
      {
        address: address6,
        fromBlock: typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
        toBlock: typeof toBlock === "bigint" ? numberToHex(toBlock) : toBlock,
        ...topics.length ? { topics } : {}
      }
    ]
  });
  return {
    abi: events,
    args,
    eventName: event ? event.name : undefined,
    fromBlock,
    id: id2,
    request: getRequest(id2),
    strict: Boolean(strict),
    toBlock,
    type: "event"
  };
}

// node_modules/viem/_esm/actions/public/createPendingTransactionFilter.js
async function createPendingTransactionFilter(client) {
  const getRequest = createFilterRequestScope(client, {
    method: "eth_newPendingTransactionFilter"
  });
  const id2 = await client.request({
    method: "eth_newPendingTransactionFilter"
  });
  return { id: id2, request: getRequest(id2), type: "transaction" };
}

// node_modules/viem/_esm/actions/public/getBlobBaseFee.js
async function getBlobBaseFee(client) {
  const baseFee = await client.request({
    method: "eth_blobBaseFee"
  });
  return BigInt(baseFee);
}

// node_modules/viem/_esm/actions/public/getBlockTransactionCount.js
init_fromHex();
init_toHex();
async function getBlockTransactionCount(client, { blockHash, blockNumber, blockTag = "latest" } = {}) {
  const blockNumberHex = blockNumber !== undefined ? numberToHex(blockNumber) : undefined;
  let count;
  if (blockHash) {
    count = await client.request({
      method: "eth_getBlockTransactionCountByHash",
      params: [blockHash]
    }, { dedupe: true });
  } else {
    count = await client.request({
      method: "eth_getBlockTransactionCountByNumber",
      params: [blockNumberHex || blockTag]
    }, { dedupe: Boolean(blockNumberHex) });
  }
  return hexToNumber(count);
}

// node_modules/viem/_esm/actions/public/getCode.js
init_toHex();
async function getCode(client, { address: address6, blockNumber, blockTag = "latest" }) {
  const blockNumberHex = blockNumber !== undefined ? numberToHex(blockNumber) : undefined;
  const hex = await client.request({
    method: "eth_getCode",
    params: [address6, blockNumberHex || blockTag]
  }, { dedupe: Boolean(blockNumberHex) });
  if (hex === "0x")
    return;
  return hex;
}

// node_modules/viem/_esm/actions/public/getFeeHistory.js
init_toHex();

// node_modules/viem/_esm/utils/formatters/feeHistory.js
function formatFeeHistory(feeHistory) {
  return {
    baseFeePerGas: feeHistory.baseFeePerGas.map((value) => BigInt(value)),
    gasUsedRatio: feeHistory.gasUsedRatio,
    oldestBlock: BigInt(feeHistory.oldestBlock),
    reward: feeHistory.reward?.map((reward) => reward.map((value) => BigInt(value)))
  };
}

// node_modules/viem/_esm/actions/public/getFeeHistory.js
async function getFeeHistory(client, { blockCount, blockNumber, blockTag = "latest", rewardPercentiles }) {
  const blockNumberHex = blockNumber ? numberToHex(blockNumber) : undefined;
  const feeHistory2 = await client.request({
    method: "eth_feeHistory",
    params: [
      numberToHex(blockCount),
      blockNumberHex || blockTag,
      rewardPercentiles
    ]
  }, { dedupe: Boolean(blockNumberHex) });
  return formatFeeHistory(feeHistory2);
}

// node_modules/viem/_esm/actions/public/getFilterLogs.js
async function getFilterLogs(_client, { filter }) {
  const strict = filter.strict ?? false;
  const logs = await filter.request({
    method: "eth_getFilterLogs",
    params: [filter.id]
  });
  const formattedLogs = logs.map((log6) => formatLog(log6));
  if (!filter.abi)
    return formattedLogs;
  return parseEventLogs({
    abi: filter.abi,
    logs: formattedLogs,
    strict
  });
}

// node_modules/viem/_esm/actions/public/getProof.js
init_toHex();

// node_modules/viem/_esm/utils/chain/defineChain.js
function defineChain(chain3) {
  return {
    formatters: undefined,
    fees: undefined,
    serializers: undefined,
    ...chain3
  };
}

// node_modules/viem/_esm/utils/regex.js
var bytesRegex2 = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
var integerRegex2 = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;

// node_modules/viem/_esm/utils/typedData.js
init_abi();
init_address();
init_isAddress();
init_size();
init_toHex();

// node_modules/viem/_esm/utils/signature/hashTypedData.js
init_encodeAbiParameters();
init_concat();
init_toHex();
init_keccak256();
function hashTypedData(parameters) {
  const { domain = {}, message, primaryType } = parameters;
  const types = {
    EIP712Domain: getTypesForEIP712Domain({ domain }),
    ...parameters.types
  };
  validateTypedData({
    domain,
    message,
    primaryType,
    types
  });
  const parts = ["0x1901"];
  if (domain)
    parts.push(hashDomain({
      domain,
      types
    }));
  if (primaryType !== "EIP712Domain")
    parts.push(hashStruct({
      data: message,
      primaryType,
      types
    }));
  return keccak256(concat(parts));
}
function hashDomain({ domain, types }) {
  return hashStruct({
    data: domain,
    primaryType: "EIP712Domain",
    types
  });
}
function hashStruct({ data: data4, primaryType, types }) {
  const encoded = encodeData({
    data: data4,
    primaryType,
    types
  });
  return keccak256(encoded);
}
var encodeData = function({ data: data4, primaryType, types }) {
  const encodedTypes = [{ type: "bytes32" }];
  const encodedValues = [hashType({ primaryType, types })];
  for (const field of types[primaryType]) {
    const [type, value] = encodeField({
      types,
      name: field.name,
      type: field.type,
      value: data4[field.name]
    });
    encodedTypes.push(type);
    encodedValues.push(value);
  }
  return encodeAbiParameters(encodedTypes, encodedValues);
};
var hashType = function({ primaryType, types }) {
  const encodedHashType = toHex(encodeType({ primaryType, types }));
  return keccak256(encodedHashType);
};
function encodeType({ primaryType, types }) {
  let result = "";
  const unsortedDeps = findTypeDependencies({ primaryType, types });
  unsortedDeps.delete(primaryType);
  const deps = [primaryType, ...Array.from(unsortedDeps).sort()];
  for (const type of deps) {
    result += `${type}(${types[type].map(({ name, type: t }) => `${t} ${name}`).join(",")})`;
  }
  return result;
}
var findTypeDependencies = function({ primaryType: primaryType_, types }, results = new Set) {
  const match = primaryType_.match(/^\w*/u);
  const primaryType = match?.[0];
  if (results.has(primaryType) || types[primaryType] === undefined) {
    return results;
  }
  results.add(primaryType);
  for (const field of types[primaryType]) {
    findTypeDependencies({ primaryType: field.type, types }, results);
  }
  return results;
};
var encodeField = function({ types, name, type, value }) {
  if (types[type] !== undefined) {
    return [
      { type: "bytes32" },
      keccak256(encodeData({ data: value, primaryType: type, types }))
    ];
  }
  if (type === "bytes") {
    const prepend = value.length % 2 ? "0" : "";
    value = `0x${prepend + value.slice(2)}`;
    return [{ type: "bytes32" }, keccak256(value)];
  }
  if (type === "string")
    return [{ type: "bytes32" }, keccak256(toHex(value))];
  if (type.lastIndexOf("]") === type.length - 1) {
    const parsedType = type.slice(0, type.lastIndexOf("["));
    const typeValuePairs = value.map((item) => encodeField({
      name,
      type: parsedType,
      types,
      value: item
    }));
    return [
      { type: "bytes32" },
      keccak256(encodeAbiParameters(typeValuePairs.map(([t]) => t), typeValuePairs.map(([, v]) => v)))
    ];
  }
  return [{ type }, value];
};

// node_modules/viem/_esm/utils/typedData.js
function validateTypedData(parameters) {
  const { domain, message, primaryType, types } = parameters;
  const validateData = (struct2, data4) => {
    for (const param of struct2) {
      const { name, type } = param;
      const value = data4[name];
      const integerMatch = type.match(integerRegex2);
      if (integerMatch && (typeof value === "number" || typeof value === "bigint")) {
        const [_type, base32, size_] = integerMatch;
        numberToHex(value, {
          signed: base32 === "int",
          size: Number.parseInt(size_) / 8
        });
      }
      if (type === "address" && typeof value === "string" && !isAddress2(value))
        throw new InvalidAddressError({ address: value });
      const bytesMatch = type.match(bytesRegex2);
      if (bytesMatch) {
        const [_type, size_] = bytesMatch;
        if (size_ && size(value) !== Number.parseInt(size_))
          throw new BytesSizeMismatchError({
            expectedSize: Number.parseInt(size_),
            givenSize: size(value)
          });
      }
      const struct3 = types[type];
      if (struct3)
        validateData(struct3, value);
    }
  };
  if (types.EIP712Domain && domain)
    validateData(types.EIP712Domain, domain);
  if (primaryType !== "EIP712Domain")
    validateData(types[primaryType], message);
}
function getTypesForEIP712Domain({ domain }) {
  return [
    typeof domain?.name === "string" && { name: "name", type: "string" },
    domain?.version && { name: "version", type: "string" },
    typeof domain?.chainId === "number" && {
      name: "chainId",
      type: "uint256"
    },
    domain?.verifyingContract && {
      name: "verifyingContract",
      type: "address"
    },
    domain?.salt && { name: "salt", type: "bytes32" }
  ].filter(Boolean);
}

// node_modules/viem/_esm/utils/formatters/transactionReceipt.js
init_fromHex();
function formatTransactionReceipt(transactionReceipt) {
  const receipt = {
    ...transactionReceipt,
    blockNumber: transactionReceipt.blockNumber ? BigInt(transactionReceipt.blockNumber) : null,
    contractAddress: transactionReceipt.contractAddress ? transactionReceipt.contractAddress : null,
    cumulativeGasUsed: transactionReceipt.cumulativeGasUsed ? BigInt(transactionReceipt.cumulativeGasUsed) : null,
    effectiveGasPrice: transactionReceipt.effectiveGasPrice ? BigInt(transactionReceipt.effectiveGasPrice) : null,
    gasUsed: transactionReceipt.gasUsed ? BigInt(transactionReceipt.gasUsed) : null,
    logs: transactionReceipt.logs ? transactionReceipt.logs.map((log7) => formatLog(log7)) : null,
    to: transactionReceipt.to ? transactionReceipt.to : null,
    transactionIndex: transactionReceipt.transactionIndex ? hexToNumber(transactionReceipt.transactionIndex) : null,
    status: transactionReceipt.status ? receiptStatuses[transactionReceipt.status] : null,
    type: transactionReceipt.type ? transactionType[transactionReceipt.type] || transactionReceipt.type : null
  };
  if (transactionReceipt.blobGasPrice)
    receipt.blobGasPrice = BigInt(transactionReceipt.blobGasPrice);
  if (transactionReceipt.blobGasUsed)
    receipt.blobGasUsed = BigInt(transactionReceipt.blobGasUsed);
  return receipt;
}
var receiptStatuses = {
  "0x0": "reverted",
  "0x1": "success"
};

// node_modules/viem/_esm/utils/index.js
init_fromHex();

// node_modules/viem/_esm/utils/signature/hashMessage.js
init_keccak256();

// node_modules/viem/_esm/constants/strings.js
var presignMessagePrefix = `\x19Ethereum Signed Message:
`;

// node_modules/viem/_esm/utils/signature/toPrefixedMessage.js
init_concat();
init_size();
init_toHex();
function toPrefixedMessage(message_) {
  const message = (() => {
    if (typeof message_ === "string")
      return stringToHex(message_);
    if (typeof message_.raw === "string")
      return message_.raw;
    return bytesToHex(message_.raw);
  })();
  const prefix = stringToHex(`${presignMessagePrefix}${size(message)}`);
  return concat([prefix, message]);
}

// node_modules/viem/_esm/utils/signature/hashMessage.js
function hashMessage(message, to_) {
  return keccak256(toPrefixedMessage(message), to_);
}

// node_modules/viem/_esm/constants/bytes.js
var erc6492MagicBytes = "0x6492649264926492649264926492649264926492649264926492649264926492";

// node_modules/viem/_esm/utils/signature/isErc6492Signature.js
init_slice();
function isErc6492Signature(signature3) {
  return sliceHex(signature3, -32) === erc6492MagicBytes;
}

// node_modules/viem/_esm/utils/signature/serializeErc6492Signature.js
init_encodeAbiParameters();
init_concat();
init_toBytes();
function serializeErc6492Signature(parameters) {
  const { address: address7, data: data4, signature: signature3, to = "hex" } = parameters;
  const signature_ = concatHex([
    encodeAbiParameters([{ type: "address" }, { type: "bytes" }, { type: "bytes" }], [address7, data4, signature3]),
    erc6492MagicBytes
  ]);
  if (to === "hex")
    return signature_;
  return hexToBytes(signature_);
}

// node_modules/viem/_esm/utils/formatters/proof.js
var formatStorageProof = function(storageProof) {
  return storageProof.map((proof) => ({
    ...proof,
    value: BigInt(proof.value)
  }));
};
function formatProof(proof) {
  return {
    ...proof,
    balance: proof.balance ? BigInt(proof.balance) : undefined,
    nonce: proof.nonce ? hexToNumber(proof.nonce) : undefined,
    storageProof: proof.storageProof ? formatStorageProof(proof.storageProof) : undefined
  };
}

// node_modules/viem/_esm/actions/public/getProof.js
async function getProof(client, { address: address7, blockNumber, blockTag: blockTag_, storageKeys }) {
  const blockTag = blockTag_ ?? "latest";
  const blockNumberHex = blockNumber !== undefined ? numberToHex(blockNumber) : undefined;
  const proof2 = await client.request({
    method: "eth_getProof",
    params: [address7, storageKeys, blockNumberHex || blockTag]
  });
  return formatProof(proof2);
}

// node_modules/viem/_esm/actions/public/getStorageAt.js
init_toHex();
async function getStorageAt(client, { address: address7, blockNumber, blockTag = "latest", slot }) {
  const blockNumberHex = blockNumber !== undefined ? numberToHex(blockNumber) : undefined;
  const data4 = await client.request({
    method: "eth_getStorageAt",
    params: [address7, slot, blockNumberHex || blockTag]
  });
  return data4;
}

// node_modules/viem/_esm/actions/public/getTransaction.js
init_transaction();
init_toHex();
async function getTransaction(client, { blockHash, blockNumber, blockTag: blockTag_, hash: hash3, index: index2 }) {
  const blockTag = blockTag_ || "latest";
  const blockNumberHex = blockNumber !== undefined ? numberToHex(blockNumber) : undefined;
  let transaction9 = null;
  if (hash3) {
    transaction9 = await client.request({
      method: "eth_getTransactionByHash",
      params: [hash3]
    }, { dedupe: true });
  } else if (blockHash) {
    transaction9 = await client.request({
      method: "eth_getTransactionByBlockHashAndIndex",
      params: [blockHash, numberToHex(index2)]
    }, { dedupe: true });
  } else if (blockNumberHex || blockTag) {
    transaction9 = await client.request({
      method: "eth_getTransactionByBlockNumberAndIndex",
      params: [blockNumberHex || blockTag, numberToHex(index2)]
    }, { dedupe: Boolean(blockNumberHex) });
  }
  if (!transaction9)
    throw new TransactionNotFoundError({
      blockHash,
      blockNumber,
      blockTag,
      hash: hash3,
      index: index2
    });
  const format = client.chain?.formatters?.transaction?.format || formatTransaction;
  return format(transaction9);
}

// node_modules/viem/_esm/actions/public/getTransactionConfirmations.js
async function getTransactionConfirmations(client, { hash: hash3, transactionReceipt }) {
  const [blockNumber, transaction9] = await Promise.all([
    getAction(client, getBlockNumber, "getBlockNumber")({}),
    hash3 ? getAction(client, getTransaction, "getTransaction")({ hash: hash3 }) : undefined
  ]);
  const transactionBlockNumber = transactionReceipt?.blockNumber || transaction9?.blockNumber;
  if (!transactionBlockNumber)
    return 0n;
  return blockNumber - transactionBlockNumber + 1n;
}

// node_modules/viem/_esm/actions/public/getTransactionReceipt.js
init_transaction();
async function getTransactionReceipt(client, { hash: hash3 }) {
  const receipt = await client.request({
    method: "eth_getTransactionReceipt",
    params: [hash3]
  }, { dedupe: true });
  if (!receipt)
    throw new TransactionReceiptNotFoundError({ hash: hash3 });
  const format = client.chain?.formatters?.transactionReceipt?.format || formatTransactionReceipt;
  return format(receipt);
}

// node_modules/viem/_esm/actions/public/multicall.js
init_abis();
init_abi();
init_base();
init_contract();
init_decodeFunctionResult();
init_encodeFunctionData();
init_getChainContractAddress();
async function multicall(client, parameters) {
  const { allowFailure = true, batchSize: batchSize_, blockNumber, blockTag, multicallAddress: multicallAddress_, stateOverride: stateOverride5 } = parameters;
  const contracts2 = parameters.contracts;
  const batchSize = batchSize_ ?? (typeof client.batch?.multicall === "object" && client.batch.multicall.batchSize || 1024);
  let multicallAddress = multicallAddress_;
  if (!multicallAddress) {
    if (!client.chain)
      throw new Error("client chain not configured. multicallAddress is required.");
    multicallAddress = getChainContractAddress({
      blockNumber,
      chain: client.chain,
      contract: "multicall3"
    });
  }
  const chunkedCalls = [[]];
  let currentChunk = 0;
  let currentChunkSize = 0;
  for (let i = 0;i < contracts2.length; i++) {
    const { abi: abi18, address: address7, args, functionName } = contracts2[i];
    try {
      const callData = encodeFunctionData({ abi: abi18, args, functionName });
      currentChunkSize += (callData.length - 2) / 2;
      if (batchSize > 0 && currentChunkSize > batchSize && chunkedCalls[currentChunk].length > 0) {
        currentChunk++;
        currentChunkSize = (callData.length - 2) / 2;
        chunkedCalls[currentChunk] = [];
      }
      chunkedCalls[currentChunk] = [
        ...chunkedCalls[currentChunk],
        {
          allowFailure: true,
          callData,
          target: address7
        }
      ];
    } catch (err) {
      const error = getContractError(err, {
        abi: abi18,
        address: address7,
        args,
        docsPath: "/docs/contract/multicall",
        functionName
      });
      if (!allowFailure)
        throw error;
      chunkedCalls[currentChunk] = [
        ...chunkedCalls[currentChunk],
        {
          allowFailure: true,
          callData: "0x",
          target: address7
        }
      ];
    }
  }
  const aggregate3Results = await Promise.allSettled(chunkedCalls.map((calls) => getAction(client, readContract, "readContract")({
    abi: multicall3Abi,
    address: multicallAddress,
    args: [calls],
    blockNumber,
    blockTag,
    functionName: "aggregate3",
    stateOverride: stateOverride5
  })));
  const results = [];
  for (let i = 0;i < aggregate3Results.length; i++) {
    const result = aggregate3Results[i];
    if (result.status === "rejected") {
      if (!allowFailure)
        throw result.reason;
      for (let j = 0;j < chunkedCalls[i].length; j++) {
        results.push({
          status: "failure",
          error: result.reason,
          result: undefined
        });
      }
      continue;
    }
    const aggregate3Result = result.value;
    for (let j = 0;j < aggregate3Result.length; j++) {
      const { returnData, success } = aggregate3Result[j];
      const { callData } = chunkedCalls[i][j];
      const { abi: abi18, address: address7, functionName, args } = contracts2[results.length];
      try {
        if (callData === "0x")
          throw new AbiDecodingZeroDataError;
        if (!success)
          throw new RawContractError({ data: returnData });
        const result2 = decodeFunctionResult({
          abi: abi18,
          args,
          data: returnData,
          functionName
        });
        results.push(allowFailure ? { result: result2, status: "success" } : result2);
      } catch (err) {
        const error = getContractError(err, {
          abi: abi18,
          address: address7,
          args,
          docsPath: "/docs/contract/multicall",
          functionName
        });
        if (!allowFailure)
          throw error;
        results.push({ error, result: undefined, status: "failure" });
      }
    }
  }
  if (results.length !== contracts2.length)
    throw new BaseError2("multicall results mismatch");
  return results;
}

// node_modules/viem/_esm/actions/public/verifyHash.js
init_abis();
init_contracts();
init_contract();
init_encodeDeployData();
init_getAddress();
init_isAddressEqual();

// node_modules/viem/_esm/utils/data/isBytesEqual.js
init_utils4();
init_toBytes();
init_isHex();
function isBytesEqual(a_, b_) {
  const a = isHex(a_) ? toBytes(a_) : a_;
  const b = isHex(b_) ? toBytes(b_) : b_;
  return equalBytes(a, b);
}

// node_modules/viem/_esm/actions/public/verifyHash.js
init_isHex();
init_toHex();

// node_modules/viem/_esm/utils/signature/serializeSignature.js
init_secp256k1();
init_fromHex();
init_toBytes();
function serializeSignature({ r, s, to = "hex", v, yParity }) {
  const yParity_ = (() => {
    if (yParity === 0 || yParity === 1)
      return yParity;
    if (v && (v === 27n || v === 28n || v >= 35n))
      return v % 2n === 0n ? 1 : 0;
    throw new Error("Invalid `v` or `yParity` value");
  })();
  const signature3 = `0x${new secp256k1.Signature(hexToBigInt(r), hexToBigInt(s)).toCompactHex()}${yParity_ === 0 ? "1b" : "1c"}`;
  if (to === "hex")
    return signature3;
  return hexToBytes(signature3);
}

// node_modules/viem/_esm/actions/public/verifyHash.js
init_call();
async function verifyHash(client, parameters) {
  const { address: address7, factory, factoryData, hash: hash3, signature: signature3, ...rest } = parameters;
  const signatureHex = (() => {
    if (isHex(signature3))
      return signature3;
    if (typeof signature3 === "object" && "r" in signature3 && "s" in signature3)
      return serializeSignature(signature3);
    return bytesToHex(signature3);
  })();
  const wrappedSignature = await (async () => {
    if (!factory && !factoryData)
      return signatureHex;
    if (isErc6492Signature(signatureHex))
      return signatureHex;
    return serializeErc6492Signature({
      address: factory,
      data: factoryData,
      signature: signatureHex
    });
  })();
  try {
    const { data: data4 } = await getAction(client, call2, "call")({
      data: encodeDeployData({
        abi: universalSignatureValidatorAbi,
        args: [address7, hash3, wrappedSignature],
        bytecode: universalSignatureValidatorByteCode
      }),
      ...rest
    });
    return isBytesEqual(data4 ?? "0x0", "0x1");
  } catch (error) {
    try {
      const verified = isAddressEqual(getAddress(address7), await recoverAddress({ hash: hash3, signature: signature3 }));
      if (verified)
        return true;
    } catch {
    }
    if (error instanceof CallExecutionError) {
      return false;
    }
    throw error;
  }
}

// node_modules/viem/_esm/actions/public/verifyMessage.js
async function verifyMessage(client, { address: address7, message, factory, factoryData, signature: signature3, ...callRequest }) {
  const hash3 = hashMessage(message);
  return verifyHash(client, {
    address: address7,
    factory,
    factoryData,
    hash: hash3,
    signature: signature3,
    ...callRequest
  });
}

// node_modules/viem/_esm/actions/public/verifyTypedData.js
async function verifyTypedData(client, parameters) {
  const { address: address7, factory, factoryData, signature: signature3, message, primaryType, types, domain, ...callRequest } = parameters;
  const hash3 = hashTypedData({ message, primaryType, types, domain });
  return verifyHash(client, {
    address: address7,
    factory,
    factoryData,
    hash: hash3,
    signature: signature3,
    ...callRequest
  });
}

// node_modules/viem/_esm/actions/public/waitForTransactionReceipt.js
init_transaction();
init_stringify();

// node_modules/viem/_esm/actions/public/watchBlockNumber.js
init_fromHex();
init_stringify();
function watchBlockNumber(client, { emitOnBegin = false, emitMissed = false, onBlockNumber, onError, poll: poll_, pollingInterval = client.pollingInterval }) {
  const enablePolling = (() => {
    if (typeof poll_ !== "undefined")
      return poll_;
    if (client.transport.type === "webSocket")
      return false;
    if (client.transport.type === "fallback" && client.transport.transports[0].config.type === "webSocket")
      return false;
    return true;
  })();
  let prevBlockNumber;
  const pollBlockNumber = () => {
    const observerId = stringify([
      "watchBlockNumber",
      client.uid,
      emitOnBegin,
      emitMissed,
      pollingInterval
    ]);
    return observe(observerId, { onBlockNumber, onError }, (emit) => poll(async () => {
      try {
        const blockNumber = await getAction(client, getBlockNumber, "getBlockNumber")({ cacheTime: 0 });
        if (prevBlockNumber) {
          if (blockNumber === prevBlockNumber)
            return;
          if (blockNumber - prevBlockNumber > 1 && emitMissed) {
            for (let i = prevBlockNumber + 1n;i < blockNumber; i++) {
              emit.onBlockNumber(i, prevBlockNumber);
              prevBlockNumber = i;
            }
          }
        }
        if (!prevBlockNumber || blockNumber > prevBlockNumber) {
          emit.onBlockNumber(blockNumber, prevBlockNumber);
          prevBlockNumber = blockNumber;
        }
      } catch (err) {
        emit.onError?.(err);
      }
    }, {
      emitOnBegin,
      interval: pollingInterval
    }));
  };
  const subscribeBlockNumber = () => {
    const observerId = stringify([
      "watchBlockNumber",
      client.uid,
      emitOnBegin,
      emitMissed
    ]);
    return observe(observerId, { onBlockNumber, onError }, (emit) => {
      let active = true;
      let unsubscribe = () => active = false;
      (async () => {
        try {
          const transport2 = (() => {
            if (client.transport.type === "fallback") {
              const transport3 = client.transport.transports.find((transport4) => transport4.config.type === "webSocket");
              if (!transport3)
                return client.transport;
              return transport3.value;
            }
            return client.transport;
          })();
          const { unsubscribe: unsubscribe_ } = await transport2.subscribe({
            params: ["newHeads"],
            onData(data4) {
              if (!active)
                return;
              const blockNumber = hexToBigInt(data4.result?.number);
              emit.onBlockNumber(blockNumber, prevBlockNumber);
              prevBlockNumber = blockNumber;
            },
            onError(error) {
              emit.onError?.(error);
            }
          });
          unsubscribe = unsubscribe_;
          if (!active)
            unsubscribe();
        } catch (err) {
          onError?.(err);
        }
      })();
      return () => unsubscribe();
    });
  };
  return enablePolling ? pollBlockNumber() : subscribeBlockNumber();
}

// node_modules/viem/_esm/actions/public/waitForTransactionReceipt.js
async function waitForTransactionReceipt(client, {
  confirmations = 1,
  hash: hash3,
  onReplaced,
  pollingInterval = client.pollingInterval,
  retryCount = 6,
  retryDelay = ({ count }) => ~~(1 << count) * 200,
  timeout
}) {
  const observerId = stringify(["waitForTransactionReceipt", client.uid, hash3]);
  let count = 0;
  let transaction11;
  let replacedTransaction;
  let receipt;
  let retrying = false;
  return new Promise((resolve, reject) => {
    if (timeout)
      setTimeout(() => reject(new WaitForTransactionReceiptTimeoutError({ hash: hash3 })), timeout);
    const _unobserve = observe(observerId, { onReplaced, resolve, reject }, (emit) => {
      const _unwatch = getAction(client, watchBlockNumber, "watchBlockNumber")({
        emitMissed: true,
        emitOnBegin: true,
        poll: true,
        pollingInterval,
        async onBlockNumber(blockNumber_) {
          const done = (fn) => {
            _unwatch();
            fn();
            _unobserve();
          };
          let blockNumber = blockNumber_;
          if (retrying)
            return;
          if (count > retryCount)
            done(() => emit.reject(new WaitForTransactionReceiptTimeoutError({ hash: hash3 })));
          try {
            if (receipt) {
              if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations))
                return;
              done(() => emit.resolve(receipt));
              return;
            }
            if (!transaction11) {
              retrying = true;
              await withRetry(async () => {
                transaction11 = await getAction(client, getTransaction, "getTransaction")({ hash: hash3 });
                if (transaction11.blockNumber)
                  blockNumber = transaction11.blockNumber;
              }, {
                delay: retryDelay,
                retryCount
              });
              retrying = false;
            }
            receipt = await getAction(client, getTransactionReceipt, "getTransactionReceipt")({ hash: hash3 });
            if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations))
              return;
            done(() => emit.resolve(receipt));
          } catch (err) {
            if (err instanceof TransactionNotFoundError || err instanceof TransactionReceiptNotFoundError) {
              if (!transaction11) {
                retrying = false;
                return;
              }
              try {
                replacedTransaction = transaction11;
                retrying = true;
                const block4 = await withRetry(() => getAction(client, getBlock, "getBlock")({
                  blockNumber,
                  includeTransactions: true
                }), {
                  delay: retryDelay,
                  retryCount,
                  shouldRetry: ({ error }) => error instanceof BlockNotFoundError
                });
                retrying = false;
                const replacementTransaction = block4.transactions.find(({ from, nonce }) => from === replacedTransaction.from && nonce === replacedTransaction.nonce);
                if (!replacementTransaction)
                  return;
                receipt = await getAction(client, getTransactionReceipt, "getTransactionReceipt")({
                  hash: replacementTransaction.hash
                });
                if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations))
                  return;
                let reason = "replaced";
                if (replacementTransaction.to === replacedTransaction.to && replacementTransaction.value === replacedTransaction.value) {
                  reason = "repriced";
                } else if (replacementTransaction.from === replacementTransaction.to && replacementTransaction.value === 0n) {
                  reason = "cancelled";
                }
                done(() => {
                  emit.onReplaced?.({
                    reason,
                    replacedTransaction,
                    transaction: replacementTransaction,
                    transactionReceipt: receipt
                  });
                  emit.resolve(receipt);
                });
              } catch (err_) {
                done(() => emit.reject(err_));
              }
            } else {
              done(() => emit.reject(err));
            }
          } finally {
            count++;
          }
        }
      });
    });
  });
}

// node_modules/viem/_esm/actions/public/watchBlocks.js
init_stringify();
function watchBlocks(client, { blockTag = "latest", emitMissed = false, emitOnBegin = false, onBlock, onError, includeTransactions: includeTransactions_, poll: poll_, pollingInterval = client.pollingInterval }) {
  const enablePolling = (() => {
    if (typeof poll_ !== "undefined")
      return poll_;
    if (client.transport.type === "webSocket")
      return false;
    if (client.transport.type === "fallback" && client.transport.transports[0].config.type === "webSocket")
      return false;
    return true;
  })();
  const includeTransactions = includeTransactions_ ?? false;
  let prevBlock;
  const pollBlocks = () => {
    const observerId = stringify([
      "watchBlocks",
      client.uid,
      blockTag,
      emitMissed,
      emitOnBegin,
      includeTransactions,
      pollingInterval
    ]);
    return observe(observerId, { onBlock, onError }, (emit) => poll(async () => {
      try {
        const block5 = await getAction(client, getBlock, "getBlock")({
          blockTag,
          includeTransactions
        });
        if (block5.number && prevBlock?.number) {
          if (block5.number === prevBlock.number)
            return;
          if (block5.number - prevBlock.number > 1 && emitMissed) {
            for (let i = prevBlock?.number + 1n;i < block5.number; i++) {
              const block6 = await getAction(client, getBlock, "getBlock")({
                blockNumber: i,
                includeTransactions
              });
              emit.onBlock(block6, prevBlock);
              prevBlock = block6;
            }
          }
        }
        if (!prevBlock?.number || blockTag === "pending" && !block5?.number || block5.number && block5.number > prevBlock.number) {
          emit.onBlock(block5, prevBlock);
          prevBlock = block5;
        }
      } catch (err) {
        emit.onError?.(err);
      }
    }, {
      emitOnBegin,
      interval: pollingInterval
    }));
  };
  const subscribeBlocks = () => {
    let active = true;
    let unsubscribe = () => active = false;
    (async () => {
      try {
        const transport2 = (() => {
          if (client.transport.type === "fallback") {
            const transport3 = client.transport.transports.find((transport4) => transport4.config.type === "webSocket");
            if (!transport3)
              return client.transport;
            return transport3.value;
          }
          return client.transport;
        })();
        const { unsubscribe: unsubscribe_ } = await transport2.subscribe({
          params: ["newHeads"],
          onData(data4) {
            if (!active)
              return;
            const format = client.chain?.formatters?.block?.format || formatBlock;
            const block5 = format(data4.result);
            onBlock(block5, prevBlock);
            prevBlock = block5;
          },
          onError(error) {
            onError?.(error);
          }
        });
        unsubscribe = unsubscribe_;
        if (!active)
          unsubscribe();
      } catch (err) {
        onError?.(err);
      }
    })();
    return () => unsubscribe();
  };
  return enablePolling ? pollBlocks() : subscribeBlocks();
}

// node_modules/viem/_esm/actions/public/watchEvent.js
init_stringify();
init_abi();
init_rpc();
function watchEvent(client, { address: address7, args, batch = true, event, events, fromBlock, onError, onLogs, poll: poll_, pollingInterval = client.pollingInterval, strict: strict_ }) {
  const enablePolling = (() => {
    if (typeof poll_ !== "undefined")
      return poll_;
    if (typeof fromBlock === "bigint")
      return true;
    if (client.transport.type === "webSocket")
      return false;
    if (client.transport.type === "fallback" && client.transport.transports[0].config.type === "webSocket")
      return false;
    return true;
  })();
  const strict = strict_ ?? false;
  const pollEvent = () => {
    const observerId = stringify([
      "watchEvent",
      address7,
      args,
      batch,
      client.uid,
      event,
      pollingInterval,
      fromBlock
    ]);
    return observe(observerId, { onLogs, onError }, (emit) => {
      let previousBlockNumber;
      if (fromBlock !== undefined)
        previousBlockNumber = fromBlock - 1n;
      let filter;
      let initialized = false;
      const unwatch = poll(async () => {
        if (!initialized) {
          try {
            filter = await getAction(client, createEventFilter, "createEventFilter")({
              address: address7,
              args,
              event,
              events,
              strict,
              fromBlock
            });
          } catch {
          }
          initialized = true;
          return;
        }
        try {
          let logs;
          if (filter) {
            logs = await getAction(client, getFilterChanges, "getFilterChanges")({ filter });
          } else {
            const blockNumber = await getAction(client, getBlockNumber, "getBlockNumber")({});
            if (previousBlockNumber && previousBlockNumber !== blockNumber) {
              logs = await getAction(client, getLogs, "getLogs")({
                address: address7,
                args,
                event,
                events,
                fromBlock: previousBlockNumber + 1n,
                toBlock: blockNumber
              });
            } else {
              logs = [];
            }
            previousBlockNumber = blockNumber;
          }
          if (logs.length === 0)
            return;
          if (batch)
            emit.onLogs(logs);
          else
            for (const log8 of logs)
              emit.onLogs([log8]);
        } catch (err) {
          if (filter && err instanceof InvalidInputRpcError)
            initialized = false;
          emit.onError?.(err);
        }
      }, {
        emitOnBegin: true,
        interval: pollingInterval
      });
      return async () => {
        if (filter)
          await getAction(client, uninstallFilter, "uninstallFilter")({ filter });
        unwatch();
      };
    });
  };
  const subscribeEvent = () => {
    let active = true;
    let unsubscribe = () => active = false;
    (async () => {
      try {
        const transport2 = (() => {
          if (client.transport.type === "fallback") {
            const transport3 = client.transport.transports.find((transport4) => transport4.config.type === "webSocket");
            if (!transport3)
              return client.transport;
            return transport3.value;
          }
          return client.transport;
        })();
        const events_ = events ?? (event ? [event] : undefined);
        let topics = [];
        if (events_) {
          const encoded = events_.flatMap((event2) => encodeEventTopics({
            abi: [event2],
            eventName: event2.name,
            args
          }));
          topics = [encoded];
          if (event)
            topics = topics[0];
        }
        const { unsubscribe: unsubscribe_ } = await transport2.subscribe({
          params: ["logs", { address: address7, topics }],
          onData(data4) {
            if (!active)
              return;
            const log8 = data4.result;
            try {
              const { eventName, args: args2 } = decodeEventLog({
                abi: events_ ?? [],
                data: log8.data,
                topics: log8.topics,
                strict
              });
              const formatted = formatLog(log8, { args: args2, eventName });
              onLogs([formatted]);
            } catch (err) {
              let eventName;
              let isUnnamed;
              if (err instanceof DecodeLogDataMismatch || err instanceof DecodeLogTopicsMismatch) {
                if (strict_)
                  return;
                eventName = err.abiItem.name;
                isUnnamed = err.abiItem.inputs?.some((x) => !(("name" in x) && x.name));
              }
              const formatted = formatLog(log8, {
                args: isUnnamed ? [] : {},
                eventName
              });
              onLogs([formatted]);
            }
          },
          onError(error) {
            onError?.(error);
          }
        });
        unsubscribe = unsubscribe_;
        if (!active)
          unsubscribe();
      } catch (err) {
        onError?.(err);
      }
    })();
    return () => unsubscribe();
  };
  return enablePolling ? pollEvent() : subscribeEvent();
}

// node_modules/viem/_esm/actions/public/watchPendingTransactions.js
init_stringify();
function watchPendingTransactions(client, { batch = true, onError, onTransactions, poll: poll_, pollingInterval = client.pollingInterval }) {
  const enablePolling = typeof poll_ !== "undefined" ? poll_ : client.transport.type !== "webSocket";
  const pollPendingTransactions = () => {
    const observerId = stringify([
      "watchPendingTransactions",
      client.uid,
      batch,
      pollingInterval
    ]);
    return observe(observerId, { onTransactions, onError }, (emit) => {
      let filter;
      const unwatch = poll(async () => {
        try {
          if (!filter) {
            try {
              filter = await getAction(client, createPendingTransactionFilter, "createPendingTransactionFilter")({});
              return;
            } catch (err) {
              unwatch();
              throw err;
            }
          }
          const hashes = await getAction(client, getFilterChanges, "getFilterChanges")({ filter });
          if (hashes.length === 0)
            return;
          if (batch)
            emit.onTransactions(hashes);
          else
            for (const hash3 of hashes)
              emit.onTransactions([hash3]);
        } catch (err) {
          emit.onError?.(err);
        }
      }, {
        emitOnBegin: true,
        interval: pollingInterval
      });
      return async () => {
        if (filter)
          await getAction(client, uninstallFilter, "uninstallFilter")({ filter });
        unwatch();
      };
    });
  };
  const subscribePendingTransactions = () => {
    let active = true;
    let unsubscribe = () => active = false;
    (async () => {
      try {
        const { unsubscribe: unsubscribe_ } = await client.transport.subscribe({
          params: ["newPendingTransactions"],
          onData(data4) {
            if (!active)
              return;
            const transaction11 = data4.result;
            onTransactions([transaction11]);
          },
          onError(error) {
            onError?.(error);
          }
        });
        unsubscribe = unsubscribe_;
        if (!active)
          unsubscribe();
      } catch (err) {
        onError?.(err);
      }
    })();
    return () => unsubscribe();
  };
  return enablePolling ? pollPendingTransactions() : subscribePendingTransactions();
}

// node_modules/viem/_esm/utils/siwe/parseSiweMessage.js
function parseSiweMessage(message) {
  const { scheme, statement, ...prefix } = message.match(prefixRegex)?.groups ?? {};
  const { chainId, expirationTime, issuedAt, notBefore, requestId, ...suffix } = message.match(suffixRegex)?.groups ?? {};
  const resources = message.split("Resources:")[1]?.split("\n- ").slice(1);
  return {
    ...prefix,
    ...suffix,
    ...chainId ? { chainId: Number(chainId) } : {},
    ...expirationTime ? { expirationTime: new Date(expirationTime) } : {},
    ...issuedAt ? { issuedAt: new Date(issuedAt) } : {},
    ...notBefore ? { notBefore: new Date(notBefore) } : {},
    ...requestId ? { requestId } : {},
    ...resources ? { resources } : {},
    ...scheme ? { scheme } : {},
    ...statement ? { statement } : {}
  };
}
var prefixRegex = /^(?:(?<scheme>[a-zA-Z][a-zA-Z0-9+-.]*):\/\/)?(?<domain>[a-zA-Z0-9+-.]*(?::[0-9]{1,5})?) (?:wants you to sign in with your Ethereum account:\n)(?<address>0x[a-fA-F0-9]{40})\n\n(?:(?<statement>.*)\n\n)?/;
var suffixRegex = /(?:URI: (?<uri>.+))\n(?:Version: (?<version>.+))\n(?:Chain ID: (?<chainId>\d+))\n(?:Nonce: (?<nonce>[a-zA-Z0-9]+))\n(?:Issued At: (?<issuedAt>.+))(?:\nExpiration Time: (?<expirationTime>.+))?(?:\nNot Before: (?<notBefore>.+))?(?:\nRequest ID: (?<requestId>.+))?/;

// node_modules/viem/_esm/utils/siwe/validateSiweMessage.js
init_isAddressEqual();
function validateSiweMessage(parameters) {
  const { address: address7, domain, message, nonce, scheme, time = new Date } = parameters;
  if (domain && message.domain !== domain)
    return false;
  if (nonce && message.nonce !== nonce)
    return false;
  if (scheme && message.scheme !== scheme)
    return false;
  if (message.expirationTime && time >= message.expirationTime)
    return false;
  if (message.notBefore && time < message.notBefore)
    return false;
  try {
    if (!message.address)
      return false;
    if (address7 && !isAddressEqual(message.address, address7))
      return false;
  } catch {
    return false;
  }
  return true;
}

// node_modules/viem/_esm/actions/siwe/verifySiweMessage.js
async function verifySiweMessage(client, parameters) {
  const { address: address7, domain, message, nonce, scheme, signature: signature3, time = new Date, ...callRequest } = parameters;
  const parsed = parseSiweMessage(message);
  if (!parsed.address)
    return false;
  const isValid = validateSiweMessage({
    address: address7,
    domain,
    message: parsed,
    nonce,
    scheme,
    time
  });
  if (!isValid)
    return false;
  const hash3 = hashMessage(message);
  return verifyHash(client, {
    address: parsed.address,
    hash: hash3,
    signature: signature3,
    ...callRequest
  });
}

// node_modules/viem/_esm/clients/decorators/public.js
function publicActions(client) {
  return {
    call: (args) => call2(client, args),
    createBlockFilter: () => createBlockFilter(client),
    createContractEventFilter: (args) => createContractEventFilter(client, args),
    createEventFilter: (args) => createEventFilter(client, args),
    createPendingTransactionFilter: () => createPendingTransactionFilter(client),
    estimateContractGas: (args) => estimateContractGas(client, args),
    estimateGas: (args) => estimateGas3(client, args),
    getBalance: (args) => getBalance(client, args),
    getBlobBaseFee: () => getBlobBaseFee(client),
    getBlock: (args) => getBlock(client, args),
    getBlockNumber: (args) => getBlockNumber(client, args),
    getBlockTransactionCount: (args) => getBlockTransactionCount(client, args),
    getBytecode: (args) => getCode(client, args),
    getChainId: () => getChainId(client),
    getCode: (args) => getCode(client, args),
    getContractEvents: (args) => getContractEvents(client, args),
    getEip712Domain: (args) => getEip712Domain(client, args),
    getEnsAddress: (args) => getEnsAddress(client, args),
    getEnsAvatar: (args) => getEnsAvatar(client, args),
    getEnsName: (args) => getEnsName(client, args),
    getEnsResolver: (args) => getEnsResolver(client, args),
    getEnsText: (args) => getEnsText(client, args),
    getFeeHistory: (args) => getFeeHistory(client, args),
    estimateFeesPerGas: (args) => estimateFeesPerGas(client, args),
    getFilterChanges: (args) => getFilterChanges(client, args),
    getFilterLogs: (args) => getFilterLogs(client, args),
    getGasPrice: () => getGasPrice(client),
    getLogs: (args) => getLogs(client, args),
    getProof: (args) => getProof(client, args),
    estimateMaxPriorityFeePerGas: (args) => estimateMaxPriorityFeePerGas(client, args),
    getStorageAt: (args) => getStorageAt(client, args),
    getTransaction: (args) => getTransaction(client, args),
    getTransactionConfirmations: (args) => getTransactionConfirmations(client, args),
    getTransactionCount: (args) => getTransactionCount(client, args),
    getTransactionReceipt: (args) => getTransactionReceipt(client, args),
    multicall: (args) => multicall(client, args),
    prepareTransactionRequest: (args) => prepareTransactionRequest(client, args),
    readContract: (args) => readContract(client, args),
    sendRawTransaction: (args) => sendRawTransaction(client, args),
    simulateContract: (args) => simulateContract(client, args),
    verifyMessage: (args) => verifyMessage(client, args),
    verifySiweMessage: (args) => verifySiweMessage(client, args),
    verifyTypedData: (args) => verifyTypedData(client, args),
    uninstallFilter: (args) => uninstallFilter(client, args),
    waitForTransactionReceipt: (args) => waitForTransactionReceipt(client, args),
    watchBlocks: (args) => watchBlocks(client, args),
    watchBlockNumber: (args) => watchBlockNumber(client, args),
    watchContractEvent: (args) => watchContractEvent(client, args),
    watchEvent: (args) => watchEvent(client, args),
    watchPendingTransactions: (args) => watchPendingTransactions(client, args)
  };
}

// node_modules/viem/_esm/clients/createPublicClient.js
function createPublicClient(parameters) {
  const { key = "public", name = "Public Client" } = parameters;
  const client = createClient({
    ...parameters,
    key,
    name,
    type: "publicClient"
  });
  return client.extend(publicActions);
}
// node_modules/viem/_esm/index.js
init_formatUnits();

// node_modules/viem/_esm/chains/definitions/bscTestnet.js
var bscTestnet = defineChain({
  id: 97,
  name: "Binance Smart Chain Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "BNB",
    symbol: "tBNB"
  },
  rpcUrls: {
    default: { http: ["https://data-seed-prebsc-1-s1.bnbchain.org:8545"] }
  },
  blockExplorers: {
    default: {
      name: "BscScan",
      url: "https://testnet.bscscan.com",
      apiUrl: "https://testnet.bscscan.com/api"
    }
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 17422483
    }
  },
  testnet: true
});
// src/client.ts
var publicListenerClient = createPublicClient({
  chain: bscTestnet,
  transport: http2()
});
// abi/ERC20Token.json
var ERC20Token_default = {
  abi: [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "_user",
          type: "address"
        }
      ],
      name: "AddedBlackList",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256"
        }
      ],
      name: "Approval",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "_blackListedUser",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_balance",
          type: "uint256"
        }
      ],
      name: "DestroyedBlackFunds",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint8",
          name: "version",
          type: "uint8"
        }
      ],
      name: "Initialized",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address"
        }
      ],
      name: "OwnershipTransferred",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "account",
          type: "address"
        }
      ],
      name: "Paused",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "_user",
          type: "address"
        }
      ],
      name: "RemovedBlackList",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256"
        }
      ],
      name: "Transfer",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "account",
          type: "address"
        }
      ],
      name: "Unpaused",
      type: "event"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_evilUser",
          type: "address"
        }
      ],
      name: "addBlackList",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address"
        },
        {
          internalType: "address",
          name: "spender",
          type: "address"
        }
      ],
      name: "allowance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        }
      ],
      name: "approve",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address"
        }
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256"
        }
      ],
      name: "burn",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "subtractedValue",
          type: "uint256"
        }
      ],
      name: "decreaseAllowance",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_blackListedUser",
          type: "address"
        }
      ],
      name: "destroyBlackFunds",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_maker",
          type: "address"
        }
      ],
      name: "getBlackListStatus",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "addedValue",
          type: "uint256"
        }
      ],
      name: "increaseAllowance",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256"
        },
        {
          internalType: "address",
          name: "_mintTo",
          type: "address"
        }
      ],
      name: "mint",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "pause",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "paused",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_clearedUser",
          type: "address"
        }
      ],
      name: "removeBlackList",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        }
      ],
      name: "transfer",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address"
        },
        {
          internalType: "address",
          name: "to",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        }
      ],
      name: "transferFrom",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address"
        }
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "unPause",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    }
  ]
};

// node_modules/effect/dist/esm/Function.js
function pipe(a, ab, bc, cd, de, ef, fg, gh, hi) {
  switch (arguments.length) {
    case 1:
      return a;
    case 2:
      return ab(a);
    case 3:
      return bc(ab(a));
    case 4:
      return cd(bc(ab(a)));
    case 5:
      return de(cd(bc(ab(a))));
    case 6:
      return ef(de(cd(bc(ab(a)))));
    case 7:
      return fg(ef(de(cd(bc(ab(a))))));
    case 8:
      return gh(fg(ef(de(cd(bc(ab(a)))))));
    case 9:
      return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
    default: {
      let ret = arguments[0];
      for (let i = 1;i < arguments.length; i++) {
        ret = arguments[i](ret);
      }
      return ret;
    }
  }
}
var isFunction = (input) => typeof input === "function";
var dual = function(arity, body) {
  if (typeof arity === "function") {
    return function() {
      if (arity(arguments)) {
        return body.apply(this, arguments);
      }
      return (self2) => body(self2, ...arguments);
    };
  }
  switch (arity) {
    case 0:
    case 1:
      throw new RangeError(`Invalid arity ${arity}`);
    case 2:
      return function(a, b) {
        if (arguments.length >= 2) {
          return body(a, b);
        }
        return function(self2) {
          return body(self2, a);
        };
      };
    case 3:
      return function(a, b, c) {
        if (arguments.length >= 3) {
          return body(a, b, c);
        }
        return function(self2) {
          return body(self2, a, b);
        };
      };
    case 4:
      return function(a, b, c, d) {
        if (arguments.length >= 4) {
          return body(a, b, c, d);
        }
        return function(self2) {
          return body(self2, a, b, c);
        };
      };
    case 5:
      return function(a, b, c, d, e) {
        if (arguments.length >= 5) {
          return body(a, b, c, d, e);
        }
        return function(self2) {
          return body(self2, a, b, c, d);
        };
      };
    default:
      return function() {
        if (arguments.length >= arity) {
          return body.apply(this, arguments);
        }
        const args = arguments;
        return function(self2) {
          return body(self2, ...args);
        };
      };
  }
};
var identity = (a) => a;
var constant = (value) => () => value;
var constTrue = constant(true);
var constFalse = constant(false);
var constUndefined = constant(undefined);
var constVoid = constUndefined;
// node_modules/effect/dist/esm/Equivalence.js
var make = (isEquivalent) => (self2, that) => self2 === that || isEquivalent(self2, that);
var isStrictEquivalent = (x, y) => x === y;
var strict = () => isStrictEquivalent;
var number2 = strict();
var mapInput = dual(2, (self2, f) => make((x, y) => self2(f(x), f(y))));
var array = (item) => make((self2, that) => {
  if (self2.length !== that.length) {
    return false;
  }
  for (let i = 0;i < self2.length; i++) {
    const isEq = item(self2[i], that[i]);
    if (!isEq) {
      return false;
    }
  }
  return true;
});

// node_modules/effect/dist/esm/internal/doNotation.js
var let_ = (map) => dual(3, (self2, name, f) => map(self2, (a) => Object.assign({}, a, {
  [name]: f(a)
})));
var bindTo = (map) => dual(2, (self2, name) => map(self2, (a) => ({
  [name]: a
})));
var bind = (map, flatMap) => dual(3, (self2, name, f) => flatMap(self2, (a) => map(f(a), (b) => Object.assign({}, a, {
  [name]: b
}))));

// node_modules/effect/dist/esm/internal/version.js
var moduleVersion = "3.6.1";
var getCurrentVersion = () => moduleVersion;

// node_modules/effect/dist/esm/GlobalValue.js
var globalStoreId = Symbol.for(`effect/GlobalValue/globalStoreId/${getCurrentVersion()}`);
if (!(globalStoreId in globalThis)) {
  globalThis[globalStoreId] = new Map;
}
var globalStore = globalThis[globalStoreId];
var globalValue = (id2, compute) => {
  if (!globalStore.has(id2)) {
    globalStore.set(id2, compute());
  }
  return globalStore.get(id2);
};

// node_modules/effect/dist/esm/Predicate.js
var isString = (input) => typeof input === "string";
var isNumber = (input) => typeof input === "number";
var isBigInt = (input) => typeof input === "bigint";
var isFunction2 = isFunction;
var isRecordOrArray = (input) => typeof input === "object" && input !== null;
var isObject = (input) => isRecordOrArray(input) || isFunction2(input);
var hasProperty = dual(2, (self2, property) => isObject(self2) && (property in self2));
var isTagged = dual(2, (self2, tag) => hasProperty(self2, "_tag") && self2["_tag"] === tag);
var isNullable = (input) => input === null || input === undefined;
var isIterable = (input) => hasProperty(input, Symbol.iterator);
var isPromiseLike = (input) => hasProperty(input, "then") && isFunction2(input.then);

// node_modules/effect/dist/esm/internal/errors.js
var getBugErrorMessage = (message) => `BUG: ${message} - please report an issue at https://github.com/Effect-TS/effect/issues`;

// node_modules/effect/dist/esm/Utils.js
var mul64 = function(out, aHi, aLo, bHi, bLo) {
  let c1 = (aLo >>> 16) * (bLo & 65535) >>> 0;
  let c0 = (aLo & 65535) * (bLo >>> 16) >>> 0;
  let lo = (aLo & 65535) * (bLo & 65535) >>> 0;
  let hi = (aLo >>> 16) * (bLo >>> 16) + ((c0 >>> 16) + (c1 >>> 16)) >>> 0;
  c0 = c0 << 16 >>> 0;
  lo = lo + c0 >>> 0;
  if (lo >>> 0 < c0 >>> 0) {
    hi = hi + 1 >>> 0;
  }
  c1 = c1 << 16 >>> 0;
  lo = lo + c1 >>> 0;
  if (lo >>> 0 < c1 >>> 0) {
    hi = hi + 1 >>> 0;
  }
  hi = hi + Math.imul(aLo, bHi) >>> 0;
  hi = hi + Math.imul(aHi, bLo) >>> 0;
  out[0] = hi;
  out[1] = lo;
};
var add64 = function(out, aHi, aLo, bHi, bLo) {
  let hi = aHi + bHi >>> 0;
  const lo = aLo + bLo >>> 0;
  if (lo >>> 0 < aLo >>> 0) {
    hi = hi + 1 | 0;
  }
  out[0] = hi;
  out[1] = lo;
};
function yieldWrapGet(self2) {
  if (typeof self2 === "object" && self2 !== null && YieldWrapTypeId in self2) {
    return self2[YieldWrapTypeId]();
  }
  throw new Error(getBugErrorMessage("yieldWrapGet"));
}
class SingleShotGen {
  self;
  called = false;
  constructor(self2) {
    this.self = self2;
  }
  next(a) {
    return this.called ? {
      value: a,
      done: true
    } : (this.called = true, {
      value: this.self,
      done: false
    });
  }
  return(a) {
    return {
      value: a,
      done: true
    };
  }
  throw(e) {
    throw e;
  }
  [Symbol.iterator]() {
    return new SingleShotGen(this.self);
  }
}
var defaultIncHi = 335903614;
var defaultIncLo = 4150755663;
var MUL_HI = 1481765933 >>> 0;
var MUL_LO = 1284865837 >>> 0;
var BIT_53 = 9007199254740992;
var BIT_27 = 134217728;

class PCGRandom {
  _state;
  constructor(seedHi, seedLo, incHi, incLo) {
    if (isNullable(seedLo) && isNullable(seedHi)) {
      seedLo = Math.random() * 4294967295 >>> 0;
      seedHi = 0;
    } else if (isNullable(seedLo)) {
      seedLo = seedHi;
      seedHi = 0;
    }
    if (isNullable(incLo) && isNullable(incHi)) {
      incLo = this._state ? this._state[3] : defaultIncLo;
      incHi = this._state ? this._state[2] : defaultIncHi;
    } else if (isNullable(incLo)) {
      incLo = incHi;
      incHi = 0;
    }
    this._state = new Int32Array([0, 0, incHi >>> 0, ((incLo || 0) | 1) >>> 0]);
    this._next();
    add64(this._state, this._state[0], this._state[1], seedHi >>> 0, seedLo >>> 0);
    this._next();
    return this;
  }
  getState() {
    return [this._state[0], this._state[1], this._state[2], this._state[3]];
  }
  setState(state) {
    this._state[0] = state[0];
    this._state[1] = state[1];
    this._state[2] = state[2];
    this._state[3] = state[3] | 1;
  }
  integer(max) {
    if (!max) {
      return this._next();
    }
    max = max >>> 0;
    if ((max & max - 1) === 0) {
      return this._next() & max - 1;
    }
    let num = 0;
    const skew = (-max >>> 0) % max >>> 0;
    for (num = this._next();num < skew; num = this._next()) {
    }
    return num % max;
  }
  number() {
    const hi = (this._next() & 67108863) * 1;
    const lo = (this._next() & 134217727) * 1;
    return (hi * BIT_27 + lo) / BIT_53;
  }
  _next() {
    const oldHi = this._state[0] >>> 0;
    const oldLo = this._state[1] >>> 0;
    mul64(this._state, oldHi, oldLo, MUL_HI, MUL_LO);
    add64(this._state, this._state[0], this._state[1], this._state[2], this._state[3]);
    let xsHi = oldHi >>> 18;
    let xsLo = (oldLo >>> 18 | oldHi << 14) >>> 0;
    xsHi = (xsHi ^ oldHi) >>> 0;
    xsLo = (xsLo ^ oldLo) >>> 0;
    const xorshifted = (xsLo >>> 27 | xsHi << 5) >>> 0;
    const rot = oldHi >>> 27;
    const rot2 = (-rot >>> 0 & 31) >>> 0;
    return (xorshifted >>> rot | xorshifted << rot2) >>> 0;
  }
}
var YieldWrapTypeId = Symbol.for("effect/Utils/YieldWrap");

class YieldWrap {
  #value;
  constructor(value) {
    this.#value = value;
  }
  [YieldWrapTypeId]() {
    return this.#value;
  }
}
var structuralRegionState = globalValue("effect/Utils/isStructuralRegion", () => ({
  enabled: false,
  tester: undefined
}));
var tracingFunction = (name) => {
  const wrap = {
    [name](body) {
      return body();
    }
  };
  return function(fn) {
    return wrap[name](fn);
  };
};
var internalCall = tracingFunction("effect_internal_function");

// node_modules/effect/dist/esm/Hash.js
var randomHashCache = globalValue(Symbol.for("effect/Hash/randomHashCache"), () => new WeakMap);
var symbol = Symbol.for("effect/Hash");
var hash3 = (self2) => {
  if (structuralRegionState.enabled === true) {
    return 0;
  }
  switch (typeof self2) {
    case "number":
      return number3(self2);
    case "bigint":
      return string(self2.toString(10));
    case "boolean":
      return string(String(self2));
    case "symbol":
      return string(String(self2));
    case "string":
      return string(self2);
    case "undefined":
      return string("undefined");
    case "function":
    case "object": {
      if (self2 === null) {
        return string("null");
      } else if (self2 instanceof Date) {
        return hash3(self2.toISOString());
      } else if (isHash(self2)) {
        return self2[symbol]();
      } else {
        return random(self2);
      }
    }
    default:
      throw new Error(`BUG: unhandled typeof ${typeof self2} - please report an issue at https://github.com/Effect-TS/effect/issues`);
  }
};
var random = (self2) => {
  if (!randomHashCache.has(self2)) {
    randomHashCache.set(self2, number3(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)));
  }
  return randomHashCache.get(self2);
};
var combine = (b) => (self2) => self2 * 53 ^ b;
var optimize = (n) => n & 3221225471 | n >>> 1 & 1073741824;
var isHash = (u) => hasProperty(u, symbol);
var number3 = (n) => {
  if (n !== n || n === Infinity) {
    return 0;
  }
  let h = n | 0;
  if (h !== n) {
    h ^= n * 4294967295;
  }
  while (n > 4294967295) {
    h ^= n /= 4294967295;
  }
  return optimize(h);
};
var string = (str) => {
  let h = 5381, i = str.length;
  while (i) {
    h = h * 33 ^ str.charCodeAt(--i);
  }
  return optimize(h);
};
var structureKeys = (o, keys) => {
  let h = 12289;
  for (let i = 0;i < keys.length; i++) {
    h ^= pipe(string(keys[i]), combine(hash3(o[keys[i]])));
  }
  return optimize(h);
};
var structure = (o) => structureKeys(o, Object.keys(o));
var array2 = (arr) => {
  let h = 6151;
  for (let i = 0;i < arr.length; i++) {
    h = pipe(h, combine(hash3(arr[i])));
  }
  return optimize(h);
};
var cached = function() {
  if (arguments.length === 1) {
    const self3 = arguments[0];
    return function(hash5) {
      Object.defineProperty(self3, symbol, {
        value() {
          return hash5;
        },
        enumerable: false
      });
      return hash5;
    };
  }
  const self2 = arguments[0];
  const hash4 = arguments[1];
  Object.defineProperty(self2, symbol, {
    value() {
      return hash4;
    },
    enumerable: false
  });
  return hash4;
};

// node_modules/effect/dist/esm/Equal.js
function equals() {
  if (arguments.length === 1) {
    return (self2) => compareBoth(self2, arguments[0]);
  }
  return compareBoth(arguments[0], arguments[1]);
}
var compareBoth = function(self2, that) {
  if (self2 === that) {
    return true;
  }
  const selfType = typeof self2;
  if (selfType !== typeof that) {
    return false;
  }
  if (selfType === "object" || selfType === "function") {
    if (self2 !== null && that !== null) {
      if (isEqual(self2) && isEqual(that)) {
        if (hash3(self2) === hash3(that) && self2[symbol2](that)) {
          return true;
        } else {
          return structuralRegionState.enabled && structuralRegionState.tester ? structuralRegionState.tester(self2, that) : false;
        }
      } else if (self2 instanceof Date && that instanceof Date) {
        return self2.toISOString() === that.toISOString();
      }
    }
    if (structuralRegionState.enabled) {
      if (Array.isArray(self2) && Array.isArray(that)) {
        return self2.length === that.length && self2.every((v, i) => compareBoth(v, that[i]));
      }
      if (Object.getPrototypeOf(self2) === Object.prototype && Object.getPrototypeOf(self2) === Object.prototype) {
        const keysSelf = Object.keys(self2);
        const keysThat = Object.keys(that);
        if (keysSelf.length === keysThat.length) {
          for (const key of keysSelf) {
            if (!((key in that) && compareBoth(self2[key], that[key]))) {
              return structuralRegionState.tester ? structuralRegionState.tester(self2, that) : false;
            }
          }
          return true;
        }
      }
      return structuralRegionState.tester ? structuralRegionState.tester(self2, that) : false;
    }
  }
  return structuralRegionState.enabled && structuralRegionState.tester ? structuralRegionState.tester(self2, that) : false;
};
var symbol2 = Symbol.for("effect/Equal");
var isEqual = (u) => hasProperty(u, symbol2);
var equivalence = () => equals;

// node_modules/effect/dist/esm/Inspectable.js
var NodeInspectSymbol = Symbol.for("nodejs.util.inspect.custom");
var toJSON = (x) => {
  if (hasProperty(x, "toJSON") && isFunction2(x["toJSON"]) && x["toJSON"].length === 0) {
    return x.toJSON();
  } else if (Array.isArray(x)) {
    return x.map(toJSON);
  }
  return x;
};
var format = (x) => JSON.stringify(x, null, 2);
var BaseProto = {
  toJSON() {
    return toJSON(this);
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  toString() {
    return format(this.toJSON());
  }
};
var toStringUnknown = (u, whitespace = 2) => {
  try {
    return typeof u === "object" ? stringifyCircular(u, whitespace) : String(u);
  } catch (_) {
    return String(u);
  }
};
var stringifyCircular = (obj, whitespace) => {
  let cache2 = [];
  const retVal = JSON.stringify(obj, (_key, value) => typeof value === "object" && value !== null ? cache2.includes(value) ? undefined : cache2.push(value) && value : value, whitespace);
  cache2 = undefined;
  return retVal;
};

// node_modules/effect/dist/esm/Pipeable.js
var pipeArguments = (self2, args) => {
  switch (args.length) {
    case 1:
      return args[0](self2);
    case 2:
      return args[1](args[0](self2));
    case 3:
      return args[2](args[1](args[0](self2)));
    case 4:
      return args[3](args[2](args[1](args[0](self2))));
    case 5:
      return args[4](args[3](args[2](args[1](args[0](self2)))));
    case 6:
      return args[5](args[4](args[3](args[2](args[1](args[0](self2))))));
    case 7:
      return args[6](args[5](args[4](args[3](args[2](args[1](args[0](self2)))))));
    case 8:
      return args[7](args[6](args[5](args[4](args[3](args[2](args[1](args[0](self2))))))));
    case 9:
      return args[8](args[7](args[6](args[5](args[4](args[3](args[2](args[1](args[0](self2)))))))));
    default: {
      let ret = self2;
      for (let i = 0, len = args.length;i < len; i++) {
        ret = args[i](ret);
      }
      return ret;
    }
  }
};

// node_modules/effect/dist/esm/internal/opCodes/effect.js
var OP_ASYNC = "Async";
var OP_COMMIT = "Commit";
var OP_FAILURE = "Failure";
var OP_ON_FAILURE = "OnFailure";
var OP_ON_SUCCESS = "OnSuccess";
var OP_ON_SUCCESS_AND_FAILURE = "OnSuccessAndFailure";
var OP_SUCCESS = "Success";
var OP_SYNC = "Sync";
var OP_TAG = "Tag";
var OP_UPDATE_RUNTIME_FLAGS = "UpdateRuntimeFlags";
var OP_WHILE = "While";
var OP_WITH_RUNTIME = "WithRuntime";
var OP_YIELD = "Yield";
var OP_REVERT_FLAGS = "RevertFlags";

// node_modules/effect/dist/esm/internal/effectable.js
var EffectTypeId = Symbol.for("effect/Effect");
var StreamTypeId = Symbol.for("effect/Stream");
var SinkTypeId = Symbol.for("effect/Sink");
var ChannelTypeId = Symbol.for("effect/Channel");
var effectVariance = {
  _R: (_) => _,
  _E: (_) => _,
  _A: (_) => _,
  _V: getCurrentVersion()
};
var sinkVariance = {
  _A: (_) => _,
  _In: (_) => _,
  _L: (_) => _,
  _E: (_) => _,
  _R: (_) => _
};
var channelVariance = {
  _Env: (_) => _,
  _InErr: (_) => _,
  _InElem: (_) => _,
  _InDone: (_) => _,
  _OutErr: (_) => _,
  _OutElem: (_) => _,
  _OutDone: (_) => _
};
var EffectPrototype = {
  [EffectTypeId]: effectVariance,
  [StreamTypeId]: effectVariance,
  [SinkTypeId]: sinkVariance,
  [ChannelTypeId]: channelVariance,
  [symbol2](that) {
    return this === that;
  },
  [symbol]() {
    return cached(this, random(this));
  },
  [Symbol.iterator]() {
    return new SingleShotGen(new YieldWrap(this));
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var StructuralPrototype = {
  [symbol]() {
    return cached(this, structure(this));
  },
  [symbol2](that) {
    const selfKeys = Object.keys(this);
    const thatKeys = Object.keys(that);
    if (selfKeys.length !== thatKeys.length) {
      return false;
    }
    for (const key of selfKeys) {
      if (!((key in that) && equals(this[key], that[key]))) {
        return false;
      }
    }
    return true;
  }
};
var CommitPrototype = {
  ...EffectPrototype,
  _op: OP_COMMIT
};
var StructuralCommitPrototype = {
  ...CommitPrototype,
  ...StructuralPrototype
};

// node_modules/effect/dist/esm/internal/option.js
var TypeId = Symbol.for("effect/Option");
var CommonProto = {
  ...EffectPrototype,
  [TypeId]: {
    _A: (_) => _
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  toString() {
    return format(this.toJSON());
  }
};
var SomeProto = Object.assign(Object.create(CommonProto), {
  _tag: "Some",
  _op: "Some",
  [symbol2](that) {
    return isOption(that) && isSome(that) && equals(this.value, that.value);
  },
  [symbol]() {
    return cached(this, combine(hash3(this._tag))(hash3(this.value)));
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag,
      value: toJSON(this.value)
    };
  }
});
var NoneHash = hash3("None");
var NoneProto = Object.assign(Object.create(CommonProto), {
  _tag: "None",
  _op: "None",
  [symbol2](that) {
    return isOption(that) && isNone(that);
  },
  [symbol]() {
    return NoneHash;
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag
    };
  }
});
var isOption = (input) => hasProperty(input, TypeId);
var isNone = (fa) => fa._tag === "None";
var isSome = (fa) => fa._tag === "Some";
var none = Object.create(NoneProto);
var some = (value) => {
  const a = Object.create(SomeProto);
  a.value = value;
  return a;
};

// node_modules/effect/dist/esm/internal/either.js
var TypeId2 = Symbol.for("effect/Either");
var CommonProto2 = {
  ...EffectPrototype,
  [TypeId2]: {
    _R: (_) => _
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  toString() {
    return format(this.toJSON());
  }
};
var RightProto = Object.assign(Object.create(CommonProto2), {
  _tag: "Right",
  _op: "Right",
  [symbol2](that) {
    return isEither(that) && isRight(that) && equals(this.right, that.right);
  },
  [symbol]() {
    return combine(hash3(this._tag))(hash3(this.right));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      right: toJSON(this.right)
    };
  }
});
var LeftProto = Object.assign(Object.create(CommonProto2), {
  _tag: "Left",
  _op: "Left",
  [symbol2](that) {
    return isEither(that) && isLeft(that) && equals(this.left, that.left);
  },
  [symbol]() {
    return combine(hash3(this._tag))(hash3(this.left));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      left: toJSON(this.left)
    };
  }
});
var isEither = (input) => hasProperty(input, TypeId2);
var isLeft = (ma) => ma._tag === "Left";
var isRight = (ma) => ma._tag === "Right";
var left = (left2) => {
  const a = Object.create(LeftProto);
  a.left = left2;
  return a;
};
var right = (right2) => {
  const a = Object.create(RightProto);
  a.right = right2;
  return a;
};

// node_modules/effect/dist/esm/Either.js
var right2 = right;
var left2 = left;
var isLeft2 = isLeft;
var isRight2 = isRight;
var map = dual(2, (self2, f) => isRight2(self2) ? right2(f(self2.right)) : left2(self2.left));
var match = dual(2, (self2, {
  onLeft,
  onRight
}) => isLeft2(self2) ? onLeft(self2.left) : onRight(self2.right));
var merge = match({
  onLeft: identity,
  onRight: identity
});
var all = (input) => {
  if (Symbol.iterator in input) {
    const out2 = [];
    for (const e of input) {
      if (isLeft2(e)) {
        return e;
      }
      out2.push(e.right);
    }
    return right2(out2);
  }
  const out = {};
  for (const key of Object.keys(input)) {
    const e = input[key];
    if (isLeft2(e)) {
      return e;
    }
    out[key] = e.right;
  }
  return right2(out);
};

// node_modules/effect/dist/esm/internal/array.js
var isNonEmptyArray = (self2) => self2.length > 0;

// node_modules/effect/dist/esm/Order.js
var make2 = (compare) => (self2, that) => self2 === that ? 0 : compare(self2, that);
var number4 = make2((self2, that) => self2 < that ? -1 : 1);
var mapInput2 = dual(2, (self2, f) => make2((b1, b2) => self2(f(b1), f(b2))));
var greaterThan = (O) => dual(2, (self2, that) => O(self2, that) === 1);

// node_modules/effect/dist/esm/Option.js
var none2 = () => none;
var some2 = some;
var isNone2 = isNone;
var isSome2 = isSome;
var match2 = dual(2, (self2, {
  onNone,
  onSome
}) => isNone2(self2) ? onNone() : onSome(self2.value));
var getOrElse = dual(2, (self2, onNone) => isNone2(self2) ? onNone() : self2.value);
var orElseSome = dual(2, (self2, onNone) => isNone2(self2) ? some2(onNone()) : self2);
var fromNullable = (nullableValue) => nullableValue == null ? none2() : some2(nullableValue);
var getOrUndefined = getOrElse(constUndefined);
var getOrThrowWith = dual(2, (self2, onNone) => {
  if (isSome2(self2)) {
    return self2.value;
  }
  throw onNone();
});
var getOrThrow = getOrThrowWith(() => new Error("getOrThrow called on a None"));
var map2 = dual(2, (self2, f) => isNone2(self2) ? none2() : some2(f(self2.value)));
var flatMap = dual(2, (self2, f) => isNone2(self2) ? none2() : f(self2.value));
var containsWith = (isEquivalent) => dual(2, (self2, a) => isNone2(self2) ? false : isEquivalent(self2.value, a));
var _equivalence = equivalence();
var contains = containsWith(_equivalence);

// node_modules/effect/dist/esm/Tuple.js
var make3 = (...elements) => elements;

// node_modules/effect/dist/esm/Iterable.js
var unsafeHead = (self2) => {
  const iterator = self2[Symbol.iterator]();
  const result = iterator.next();
  if (result.done)
    throw new Error("unsafeHead: empty iterable");
  return result.value;
};
var constEmpty = {
  [Symbol.iterator]() {
    return constEmptyIterator;
  }
};
var constEmptyIterator = {
  next() {
    return {
      done: true,
      value: undefined
    };
  }
};
var empty = () => constEmpty;

// node_modules/effect/dist/esm/Array.js
var allocate = (n) => new Array(n);
var makeBy = (n, f) => {
  const max2 = Math.max(1, Math.floor(n));
  const out = new Array(max2);
  for (let i = 0;i < max2; i++) {
    out[i] = f(i);
  }
  return out;
};
var fromIterable = (collection) => Array.isArray(collection) ? collection : Array.from(collection);
var ensure = (self2) => Array.isArray(self2) ? self2 : [self2];
var prepend = dual(2, (self2, head) => [head, ...self2]);
var append = dual(2, (self2, last) => [...self2, last]);
var appendAll = dual(2, (self2, that) => fromIterable(self2).concat(fromIterable(that)));
var isArray = Array.isArray;
var isEmptyArray = (self2) => self2.length === 0;
var isEmptyReadonlyArray = isEmptyArray;
var isNonEmptyArray2 = isNonEmptyArray;
var isNonEmptyReadonlyArray = isNonEmptyArray;
var isOutOfBound = (i, as) => i < 0 || i >= as.length;
var clamp = (i, as) => Math.floor(Math.min(Math.max(0, i), as.length));
var get = dual(2, (self2, index2) => {
  const i = Math.floor(index2);
  return isOutOfBound(i, self2) ? none2() : some2(self2[i]);
});
var unsafeGet = dual(2, (self2, index2) => {
  const i = Math.floor(index2);
  if (isOutOfBound(i, self2)) {
    throw new Error(`Index ${i} out of bounds`);
  }
  return self2[i];
});
var head = get(0);
var headNonEmpty = unsafeGet(0);
var last = (self2) => isNonEmptyReadonlyArray(self2) ? some2(lastNonEmpty(self2)) : none2();
var lastNonEmpty = (self2) => self2[self2.length - 1];
var tailNonEmpty = (self2) => self2.slice(1);
var spanIndex = (self2, predicate) => {
  let i = 0;
  for (const a of self2) {
    if (!predicate(a, i)) {
      break;
    }
    i++;
  }
  return i;
};
var span = dual(2, (self2, predicate) => splitAt(self2, spanIndex(self2, predicate)));
var drop = dual(2, (self2, n) => {
  const input = fromIterable(self2);
  return input.slice(clamp(n, input), input.length);
});
var reverse = (self2) => Array.from(self2).reverse();
var sort = dual(2, (self2, O) => {
  const out = Array.from(self2);
  out.sort(O);
  return out;
});
var zip = dual(2, (self2, that) => zipWith(self2, that, make3));
var zipWith = dual(3, (self2, that, f) => {
  const as = fromIterable(self2);
  const bs = fromIterable(that);
  if (isNonEmptyReadonlyArray(as) && isNonEmptyReadonlyArray(bs)) {
    const out = [f(headNonEmpty(as), headNonEmpty(bs))];
    const len = Math.min(as.length, bs.length);
    for (let i = 1;i < len; i++) {
      out[i] = f(as[i], bs[i]);
    }
    return out;
  }
  return [];
});
var _equivalence2 = equivalence();
var splitAt = dual(2, (self2, n) => {
  const input = Array.from(self2);
  const _n = Math.floor(n);
  if (isNonEmptyReadonlyArray(input)) {
    if (_n >= 1) {
      return splitNonEmptyAt(input, _n);
    }
    return [[], input];
  }
  return [input, []];
});
var splitNonEmptyAt = dual(2, (self2, n) => {
  const _n = Math.max(1, Math.floor(n));
  return _n >= self2.length ? [copy(self2), []] : [prepend(self2.slice(1, _n), headNonEmpty(self2)), self2.slice(_n)];
});
var copy = (self2) => self2.slice();
var unionWith = dual(3, (self2, that, isEquivalent) => {
  const a = fromIterable(self2);
  const b = fromIterable(that);
  if (isNonEmptyReadonlyArray(a)) {
    if (isNonEmptyReadonlyArray(b)) {
      const dedupe = dedupeWith(isEquivalent);
      return dedupe(appendAll(a, b));
    }
    return a;
  }
  return b;
});
var union = dual(2, (self2, that) => unionWith(self2, that, _equivalence2));
var empty2 = () => [];
var of = (a) => [a];
var map3 = dual(2, (self2, f) => self2.map(f));
var flatMap2 = dual(2, (self2, f) => {
  if (isEmptyReadonlyArray(self2)) {
    return [];
  }
  const out = [];
  for (let i = 0;i < self2.length; i++) {
    const inner = f(self2[i], i);
    for (let j = 0;j < inner.length; j++) {
      out.push(inner[j]);
    }
  }
  return out;
});
var flatten = flatMap2(identity);
var filterMap = dual(2, (self2, f) => {
  const as = fromIterable(self2);
  const out = [];
  for (let i = 0;i < as.length; i++) {
    const o = f(as[i], i);
    if (isSome2(o)) {
      out.push(o.value);
    }
  }
  return out;
});
var getSomes = filterMap(identity);
var reduce = dual(3, (self2, b, f) => fromIterable(self2).reduce((b2, a, i) => f(b2, a, i), b));
var reduceRight = dual(3, (self2, b, f) => fromIterable(self2).reduceRight((b2, a, i) => f(b2, a, i), b));
var every = dual(2, (self2, refinement) => self2.every(refinement));
var unfold = (b, f) => {
  const out = [];
  let next = b;
  let o;
  while (isSome2(o = f(next))) {
    const [a, b2] = o.value;
    out.push(a);
    next = b2;
  }
  return out;
};
var getEquivalence = array;
var dedupeWith = dual(2, (self2, isEquivalent) => {
  const input = fromIterable(self2);
  if (isNonEmptyReadonlyArray(input)) {
    const out = [headNonEmpty(input)];
    const rest = tailNonEmpty(input);
    for (const r of rest) {
      if (out.every((a) => !isEquivalent(r, a))) {
        out.push(r);
      }
    }
    return out;
  }
  return [];
});
var dedupe = (self2) => dedupeWith(self2, equivalence());
var join = dual(2, (self2, sep) => fromIterable(self2).join(sep));
// node_modules/effect/dist/esm/BigDecimal.js
var TypeId3 = Symbol.for("effect/BigDecimal");
var BigDecimalProto = {
  [TypeId3]: TypeId3,
  [symbol]() {
    const normalized = normalize(this);
    return pipe(hash3(normalized.value), combine(number3(normalized.scale)), cached(this));
  },
  [symbol2](that) {
    return isBigDecimal(that) && equals2(this, that);
  },
  toString() {
    return `BigDecimal(${format2(this)})`;
  },
  toJSON() {
    return {
      _id: "BigDecimal",
      value: String(this.value),
      scale: this.scale
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var isBigDecimal = (u) => hasProperty(u, TypeId3);
var make4 = (value, scale) => {
  const o = Object.create(BigDecimalProto);
  o.value = value;
  o.scale = scale;
  return o;
};
var unsafeMakeNormalized = (value, scale) => {
  if (value !== bigint0 && value % bigint10 === bigint0) {
    throw new RangeError("Value must be normalized");
  }
  const o = make4(value, scale);
  o.normalized = o;
  return o;
};
var bigint0 = BigInt(0);
var bigint10 = BigInt(10);
var zero = unsafeMakeNormalized(bigint0, 0);
var normalize = (self2) => {
  if (self2.normalized === undefined) {
    if (self2.value === bigint0) {
      self2.normalized = zero;
    } else {
      const digits = `${self2.value}`;
      let trail = 0;
      for (let i = digits.length - 1;i >= 0; i--) {
        if (digits[i] === "0") {
          trail++;
        } else {
          break;
        }
      }
      if (trail === 0) {
        self2.normalized = self2;
      }
      const value = BigInt(digits.substring(0, digits.length - trail));
      const scale = self2.scale - trail;
      self2.normalized = unsafeMakeNormalized(value, scale);
    }
  }
  return self2.normalized;
};
var scale = (self2, scale2) => {
  if (scale2 > self2.scale) {
    return make4(self2.value * bigint10 ** BigInt(scale2 - self2.scale), scale2);
  }
  if (scale2 < self2.scale) {
    return make4(self2.value / bigint10 ** BigInt(self2.scale - scale2), scale2);
  }
  return self2;
};
var Equivalence = make((self2, that) => {
  if (self2.scale > that.scale) {
    return scale(that, self2.scale).value === self2.value;
  }
  if (self2.scale < that.scale) {
    return scale(self2, that.scale).value === that.value;
  }
  return self2.value === that.value;
});
var equals2 = dual(2, (self2, that) => Equivalence(self2, that));
var format2 = (n) => {
  const negative = n.value < bigint0;
  const absolute = negative ? `${n.value}`.substring(1) : `${n.value}`;
  let before;
  let after;
  if (n.scale >= absolute.length) {
    before = "0";
    after = "0".repeat(n.scale - absolute.length) + absolute;
  } else {
    const location = absolute.length - n.scale;
    if (location > absolute.length) {
      const zeros = location - absolute.length;
      before = `${absolute}${"0".repeat(zeros)}`;
      after = "";
    } else {
      after = absolute.slice(location);
      before = absolute.slice(0, location);
    }
  }
  const complete = after === "" ? before : `${before}.${after}`;
  return negative ? `-${complete}` : complete;
};
// node_modules/effect/dist/esm/Boolean.js
var not = (self2) => !self2;
// node_modules/effect/dist/esm/internal/context.js
var TagTypeId = Symbol.for("effect/Context/Tag");
var STMSymbolKey = "effect/STM";
var STMTypeId = Symbol.for(STMSymbolKey);
var TagProto = {
  ...EffectPrototype,
  _tag: "Tag",
  _op: "Tag",
  [STMTypeId]: effectVariance,
  [TagTypeId]: {
    _Service: (_) => _,
    _Identifier: (_) => _
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Tag",
      key: this.key,
      stack: this.stack
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  of(self2) {
    return self2;
  },
  context(self2) {
    return make5(this, self2);
  }
};
var makeGenericTag = (key) => {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const creationError = new Error;
  Error.stackTraceLimit = limit;
  const tag = Object.create(TagProto);
  Object.defineProperty(tag, "stack", {
    get() {
      return creationError.stack;
    }
  });
  tag.key = key;
  return tag;
};
var TypeId4 = Symbol.for("effect/Context");
var ContextProto = {
  [TypeId4]: {
    _Services: (_) => _
  },
  [symbol2](that) {
    if (isContext(that)) {
      if (this.unsafeMap.size === that.unsafeMap.size) {
        for (const k of this.unsafeMap.keys()) {
          if (!that.unsafeMap.has(k) || !equals(this.unsafeMap.get(k), that.unsafeMap.get(k))) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  },
  [symbol]() {
    return cached(this, number3(this.unsafeMap.size));
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Context",
      services: Array.from(this.unsafeMap).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var makeContext = (unsafeMap) => {
  const context = Object.create(ContextProto);
  context.unsafeMap = unsafeMap;
  return context;
};
var serviceNotFoundError = (tag) => {
  const error = new Error(`Service not found${tag.key ? `: ${String(tag.key)}` : ""}`);
  if (tag.stack) {
    const lines = tag.stack.split("\n");
    if (lines.length > 2) {
      const afterAt = lines[2].match(/at (.*)/);
      if (afterAt) {
        error.message = error.message + ` (defined at ${afterAt[1]})`;
      }
    }
  }
  if (error.stack) {
    const lines = error.stack.split("\n");
    lines.splice(1, 3);
    error.stack = lines.join("\n");
  }
  return error;
};
var isContext = (u) => hasProperty(u, TypeId4);
var _empty = makeContext(new Map);
var empty3 = () => _empty;
var make5 = (tag, service) => makeContext(new Map([[tag.key, service]]));
var add = dual(3, (self2, tag, service) => {
  const map4 = new Map(self2.unsafeMap);
  map4.set(tag.key, service);
  return makeContext(map4);
});
var unsafeGet2 = dual(2, (self2, tag) => {
  if (!self2.unsafeMap.has(tag.key)) {
    throw serviceNotFoundError(tag);
  }
  return self2.unsafeMap.get(tag.key);
});
var get2 = unsafeGet2;
var getOption = dual(2, (self2, tag) => {
  if (!self2.unsafeMap.has(tag.key)) {
    return none;
  }
  return some(self2.unsafeMap.get(tag.key));
});
var merge2 = dual(2, (self2, that) => {
  const map4 = new Map(self2.unsafeMap);
  for (const [tag, s] of that.unsafeMap) {
    map4.set(tag, s);
  }
  return makeContext(map4);
});

// node_modules/effect/dist/esm/Context.js
var GenericTag = makeGenericTag;
var isContext2 = isContext;
var empty4 = empty3;
var make6 = make5;
var add2 = add;
var get3 = get2;
var unsafeGet3 = unsafeGet2;
var getOption2 = getOption;
var merge3 = merge2;

// node_modules/effect/dist/esm/Chunk.js
var copy2 = function(src, srcPos, dest, destPos, len) {
  for (let i = srcPos;i < Math.min(src.length, srcPos + len); i++) {
    dest[destPos + i - srcPos] = src[i];
  }
  return dest;
};
var TypeId5 = Symbol.for("effect/Chunk");
var emptyArray = [];
var getEquivalence2 = (isEquivalent) => make((self2, that) => self2.length === that.length && toReadonlyArray(self2).every((value, i) => isEquivalent(value, unsafeGet4(that, i))));
var _equivalence3 = getEquivalence2(equals);
var ChunkProto = {
  [TypeId5]: {
    _A: (_) => _
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Chunk",
      values: toReadonlyArray(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  [symbol2](that) {
    return isChunk(that) && _equivalence3(this, that);
  },
  [symbol]() {
    return cached(this, array2(toReadonlyArray(this)));
  },
  [Symbol.iterator]() {
    switch (this.backing._tag) {
      case "IArray": {
        return this.backing.array[Symbol.iterator]();
      }
      case "IEmpty": {
        return emptyArray[Symbol.iterator]();
      }
      default: {
        return toReadonlyArray(this)[Symbol.iterator]();
      }
    }
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeChunk = (backing) => {
  const chunk = Object.create(ChunkProto);
  chunk.backing = backing;
  switch (backing._tag) {
    case "IEmpty": {
      chunk.length = 0;
      chunk.depth = 0;
      chunk.left = chunk;
      chunk.right = chunk;
      break;
    }
    case "IConcat": {
      chunk.length = backing.left.length + backing.right.length;
      chunk.depth = 1 + Math.max(backing.left.depth, backing.right.depth);
      chunk.left = backing.left;
      chunk.right = backing.right;
      break;
    }
    case "IArray": {
      chunk.length = backing.array.length;
      chunk.depth = 0;
      chunk.left = _empty2;
      chunk.right = _empty2;
      break;
    }
    case "ISingleton": {
      chunk.length = 1;
      chunk.depth = 0;
      chunk.left = _empty2;
      chunk.right = _empty2;
      break;
    }
    case "ISlice": {
      chunk.length = backing.length;
      chunk.depth = backing.chunk.depth + 1;
      chunk.left = _empty2;
      chunk.right = _empty2;
      break;
    }
  }
  return chunk;
};
var isChunk = (u) => hasProperty(u, TypeId5);
var _empty2 = makeChunk({
  _tag: "IEmpty"
});
var empty5 = () => _empty2;
var make7 = (...as) => as.length === 1 ? of2(as[0]) : unsafeFromNonEmptyArray(as);
var of2 = (a) => makeChunk({
  _tag: "ISingleton",
  a
});
var fromIterable2 = (self2) => isChunk(self2) ? self2 : makeChunk({
  _tag: "IArray",
  array: fromIterable(self2)
});
var copyToArray = (self2, array4, initial) => {
  switch (self2.backing._tag) {
    case "IArray": {
      copy2(self2.backing.array, 0, array4, initial, self2.length);
      break;
    }
    case "IConcat": {
      copyToArray(self2.left, array4, initial);
      copyToArray(self2.right, array4, initial + self2.left.length);
      break;
    }
    case "ISingleton": {
      array4[initial] = self2.backing.a;
      break;
    }
    case "ISlice": {
      let i = 0;
      let j = initial;
      while (i < self2.length) {
        array4[j] = unsafeGet4(self2, i);
        i += 1;
        j += 1;
      }
      break;
    }
  }
};
var toReadonlyArray_ = (self2) => {
  switch (self2.backing._tag) {
    case "IEmpty": {
      return emptyArray;
    }
    case "IArray": {
      return self2.backing.array;
    }
    default: {
      const arr = new Array(self2.length);
      copyToArray(self2, arr, 0);
      self2.backing = {
        _tag: "IArray",
        array: arr
      };
      self2.left = _empty2;
      self2.right = _empty2;
      self2.depth = 0;
      return arr;
    }
  }
};
var toReadonlyArray = toReadonlyArray_;
var reverseChunk = (self2) => {
  switch (self2.backing._tag) {
    case "IEmpty":
    case "ISingleton":
      return self2;
    case "IArray": {
      return makeChunk({
        _tag: "IArray",
        array: reverse(self2.backing.array)
      });
    }
    case "IConcat": {
      return makeChunk({
        _tag: "IConcat",
        left: reverse2(self2.backing.right),
        right: reverse2(self2.backing.left)
      });
    }
    case "ISlice":
      return unsafeFromArray(reverse(toReadonlyArray(self2)));
  }
};
var reverse2 = reverseChunk;
var get4 = dual(2, (self2, index2) => index2 < 0 || index2 >= self2.length ? none2() : some2(unsafeGet4(self2, index2)));
var unsafeFromArray = (self2) => makeChunk({
  _tag: "IArray",
  array: self2
});
var unsafeFromNonEmptyArray = (self2) => unsafeFromArray(self2);
var unsafeGet4 = dual(2, (self2, index2) => {
  switch (self2.backing._tag) {
    case "IEmpty": {
      throw new Error(`Index out of bounds`);
    }
    case "ISingleton": {
      if (index2 !== 0) {
        throw new Error(`Index out of bounds`);
      }
      return self2.backing.a;
    }
    case "IArray": {
      if (index2 >= self2.length || index2 < 0) {
        throw new Error(`Index out of bounds`);
      }
      return self2.backing.array[index2];
    }
    case "IConcat": {
      return index2 < self2.left.length ? unsafeGet4(self2.left, index2) : unsafeGet4(self2.right, index2 - self2.left.length);
    }
    case "ISlice": {
      return unsafeGet4(self2.backing.chunk, index2 + self2.backing.offset);
    }
  }
});
var append2 = dual(2, (self2, a) => appendAll2(self2, of2(a)));
var prepend2 = dual(2, (self2, elem) => appendAll2(of2(elem), self2));
var take = dual(2, (self2, n) => {
  if (n <= 0) {
    return _empty2;
  } else if (n >= self2.length) {
    return self2;
  } else {
    switch (self2.backing._tag) {
      case "ISlice": {
        return makeChunk({
          _tag: "ISlice",
          chunk: self2.backing.chunk,
          length: n,
          offset: self2.backing.offset
        });
      }
      case "IConcat": {
        if (n > self2.left.length) {
          return makeChunk({
            _tag: "IConcat",
            left: self2.left,
            right: take(self2.right, n - self2.left.length)
          });
        }
        return take(self2.left, n);
      }
      default: {
        return makeChunk({
          _tag: "ISlice",
          chunk: self2,
          offset: 0,
          length: n
        });
      }
    }
  }
});
var drop2 = dual(2, (self2, n) => {
  if (n <= 0) {
    return self2;
  } else if (n >= self2.length) {
    return _empty2;
  } else {
    switch (self2.backing._tag) {
      case "ISlice": {
        return makeChunk({
          _tag: "ISlice",
          chunk: self2.backing.chunk,
          offset: self2.backing.offset + n,
          length: self2.backing.length - n
        });
      }
      case "IConcat": {
        if (n > self2.left.length) {
          return drop2(self2.right, n - self2.left.length);
        }
        return makeChunk({
          _tag: "IConcat",
          left: drop2(self2.left, n),
          right: self2.right
        });
      }
      default: {
        return makeChunk({
          _tag: "ISlice",
          chunk: self2,
          offset: n,
          length: self2.length - n
        });
      }
    }
  }
});
var appendAll2 = dual(2, (self2, that) => {
  if (self2.backing._tag === "IEmpty") {
    return that;
  }
  if (that.backing._tag === "IEmpty") {
    return self2;
  }
  const diff = that.depth - self2.depth;
  if (Math.abs(diff) <= 1) {
    return makeChunk({
      _tag: "IConcat",
      left: self2,
      right: that
    });
  } else if (diff < -1) {
    if (self2.left.depth >= self2.right.depth) {
      const nr = appendAll2(self2.right, that);
      return makeChunk({
        _tag: "IConcat",
        left: self2.left,
        right: nr
      });
    } else {
      const nrr = appendAll2(self2.right.right, that);
      if (nrr.depth === self2.depth - 3) {
        const nr = makeChunk({
          _tag: "IConcat",
          left: self2.right.left,
          right: nrr
        });
        return makeChunk({
          _tag: "IConcat",
          left: self2.left,
          right: nr
        });
      } else {
        const nl = makeChunk({
          _tag: "IConcat",
          left: self2.left,
          right: self2.right.left
        });
        return makeChunk({
          _tag: "IConcat",
          left: nl,
          right: nrr
        });
      }
    }
  } else {
    if (that.right.depth >= that.left.depth) {
      const nl = appendAll2(self2, that.left);
      return makeChunk({
        _tag: "IConcat",
        left: nl,
        right: that.right
      });
    } else {
      const nll = appendAll2(self2, that.left.left);
      if (nll.depth === that.depth - 3) {
        const nl = makeChunk({
          _tag: "IConcat",
          left: nll,
          right: that.left.right
        });
        return makeChunk({
          _tag: "IConcat",
          left: nl,
          right: that.right
        });
      } else {
        const nr = makeChunk({
          _tag: "IConcat",
          left: that.left.right,
          right: that.right
        });
        return makeChunk({
          _tag: "IConcat",
          left: nll,
          right: nr
        });
      }
    }
  }
});
var isEmpty = (self2) => self2.length === 0;
var isNonEmpty = (self2) => self2.length > 0;
var head2 = get4(0);
var unsafeHead2 = (self2) => unsafeGet4(self2, 0);
var headNonEmpty2 = unsafeHead2;
var splitAt2 = dual(2, (self2, n) => [take(self2, n), drop2(self2, n)]);
var tailNonEmpty2 = (self2) => drop2(self2, 1);

// node_modules/effect/dist/esm/Duration.js
var TypeId6 = Symbol.for("effect/Duration");
var bigint02 = BigInt(0);
var bigint24 = BigInt(24);
var bigint60 = BigInt(60);
var bigint1e3 = BigInt(1000);
var bigint1e6 = BigInt(1e6);
var bigint1e9 = BigInt(1e9);
var DURATION_REGEX = /^(-?\d+(?:\.\d+)?)\s+(nanos?|micros?|millis?|seconds?|minutes?|hours?|days?|weeks?)$/;
var decode = (input) => {
  if (isDuration(input)) {
    return input;
  } else if (isNumber(input)) {
    return millis(input);
  } else if (isBigInt(input)) {
    return nanos(input);
  } else if (Array.isArray(input)) {
    if (input.length === 2 && isNumber(input[0]) && isNumber(input[1])) {
      return nanos(BigInt(input[0]) * bigint1e9 + BigInt(input[1]));
    }
  } else if (isString(input)) {
    DURATION_REGEX.lastIndex = 0;
    const match3 = DURATION_REGEX.exec(input);
    if (match3) {
      const [_, valueStr, unit3] = match3;
      const value = Number(valueStr);
      switch (unit3) {
        case "nano":
        case "nanos":
          return nanos(BigInt(valueStr));
        case "micro":
        case "micros":
          return micros(BigInt(valueStr));
        case "milli":
        case "millis":
          return millis(value);
        case "second":
        case "seconds":
          return seconds(value);
        case "minute":
        case "minutes":
          return minutes(value);
        case "hour":
        case "hours":
          return hours(value);
        case "day":
        case "days":
          return days(value);
        case "week":
        case "weeks":
          return weeks(value);
      }
    }
  }
  throw new Error("Invalid DurationInput");
};
var zeroValue = {
  _tag: "Millis",
  millis: 0
};
var infinityValue = {
  _tag: "Infinity"
};
var DurationProto = {
  [TypeId6]: TypeId6,
  [symbol]() {
    return cached(this, structure(this.value));
  },
  [symbol2](that) {
    return isDuration(that) && equals3(this, that);
  },
  toString() {
    return `Duration(${format3(this)})`;
  },
  toJSON() {
    switch (this.value._tag) {
      case "Millis":
        return {
          _id: "Duration",
          _tag: "Millis",
          millis: this.value.millis
        };
      case "Nanos":
        return {
          _id: "Duration",
          _tag: "Nanos",
          hrtime: toHrTime(this)
        };
      case "Infinity":
        return {
          _id: "Duration",
          _tag: "Infinity"
        };
    }
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var make8 = (input) => {
  const duration = Object.create(DurationProto);
  if (isNumber(input)) {
    if (isNaN(input) || input <= 0) {
      duration.value = zeroValue;
    } else if (!Number.isFinite(input)) {
      duration.value = infinityValue;
    } else if (!Number.isInteger(input)) {
      duration.value = {
        _tag: "Nanos",
        nanos: BigInt(Math.round(input * 1e6))
      };
    } else {
      duration.value = {
        _tag: "Millis",
        millis: input
      };
    }
  } else if (input <= bigint02) {
    duration.value = zeroValue;
  } else {
    duration.value = {
      _tag: "Nanos",
      nanos: input
    };
  }
  return duration;
};
var isDuration = (u) => hasProperty(u, TypeId6);
var zero2 = make8(0);
var nanos = (nanos2) => make8(nanos2);
var micros = (micros2) => make8(micros2 * bigint1e3);
var millis = (millis2) => make8(millis2);
var seconds = (seconds2) => make8(seconds2 * 1000);
var minutes = (minutes2) => make8(minutes2 * 60000);
var hours = (hours2) => make8(hours2 * 3600000);
var days = (days2) => make8(days2 * 86400000);
var weeks = (weeks2) => make8(weeks2 * 604800000);
var toMillis = (self2) => {
  const _self = decode(self2);
  switch (_self.value._tag) {
    case "Infinity":
      return Infinity;
    case "Nanos":
      return Number(_self.value.nanos) / 1e6;
    case "Millis":
      return _self.value.millis;
  }
};
var unsafeToNanos = (self2) => {
  const _self = decode(self2);
  switch (_self.value._tag) {
    case "Infinity":
      throw new Error("Cannot convert infinite duration to nanos");
    case "Nanos":
      return _self.value.nanos;
    case "Millis":
      return BigInt(Math.round(_self.value.millis * 1e6));
  }
};
var toHrTime = (self2) => {
  const _self = decode(self2);
  switch (_self.value._tag) {
    case "Infinity":
      return [Infinity, 0];
    case "Nanos":
      return [Number(_self.value.nanos / bigint1e9), Number(_self.value.nanos % bigint1e9)];
    case "Millis":
      return [Math.floor(_self.value.millis / 1000), Math.round(_self.value.millis % 1000 * 1e6)];
  }
};
var match3 = dual(2, (self2, options) => {
  const _self = decode(self2);
  switch (_self.value._tag) {
    case "Nanos":
      return options.onNanos(_self.value.nanos);
    case "Infinity":
      return options.onMillis(Infinity);
    case "Millis":
      return options.onMillis(_self.value.millis);
  }
});
var matchWith = dual(3, (self2, that, options) => {
  const _self = decode(self2);
  const _that = decode(that);
  if (_self.value._tag === "Infinity" || _that.value._tag === "Infinity") {
    return options.onMillis(toMillis(_self), toMillis(_that));
  } else if (_self.value._tag === "Nanos" || _that.value._tag === "Nanos") {
    const selfNanos = _self.value._tag === "Nanos" ? _self.value.nanos : BigInt(Math.round(_self.value.millis * 1e6));
    const thatNanos = _that.value._tag === "Nanos" ? _that.value.nanos : BigInt(Math.round(_that.value.millis * 1e6));
    return options.onNanos(selfNanos, thatNanos);
  }
  return options.onMillis(_self.value.millis, _that.value.millis);
});
var Equivalence2 = (self2, that) => matchWith(self2, that, {
  onMillis: (self3, that2) => self3 === that2,
  onNanos: (self3, that2) => self3 === that2
});
var times = dual(2, (self2, times2) => match3(self2, {
  onMillis: (millis2) => make8(millis2 * times2),
  onNanos: (nanos2) => make8(nanos2 * BigInt(times2))
}));
var sum = dual(2, (self2, that) => matchWith(self2, that, {
  onMillis: (self3, that2) => make8(self3 + that2),
  onNanos: (self3, that2) => make8(self3 + that2)
}));
var lessThan2 = dual(2, (self2, that) => matchWith(self2, that, {
  onMillis: (self3, that2) => self3 < that2,
  onNanos: (self3, that2) => self3 < that2
}));
var greaterThanOrEqualTo2 = dual(2, (self2, that) => matchWith(self2, that, {
  onMillis: (self3, that2) => self3 >= that2,
  onNanos: (self3, that2) => self3 >= that2
}));
var equals3 = dual(2, (self2, that) => Equivalence2(decode(self2), decode(that)));
var format3 = (self2) => {
  const duration = decode(self2);
  const parts = [];
  if (duration.value._tag === "Infinity") {
    return "Infinity";
  }
  const nanos2 = unsafeToNanos(duration);
  if (nanos2 % bigint1e6) {
    parts.push(`${nanos2 % bigint1e6}ns`);
  }
  const ms = nanos2 / bigint1e6;
  if (ms % bigint1e3 !== bigint02) {
    parts.push(`${ms % bigint1e3}ms`);
  }
  const sec = ms / bigint1e3;
  if (sec % bigint60 !== bigint02) {
    parts.push(`${sec % bigint60}s`);
  }
  const min2 = sec / bigint60;
  if (min2 % bigint60 !== bigint02) {
    parts.push(`${min2 % bigint60}m`);
  }
  const hr = min2 / bigint60;
  if (hr % bigint24 !== bigint02) {
    parts.push(`${hr % bigint24}h`);
  }
  const days2 = hr / bigint24;
  if (days2 !== bigint02) {
    parts.push(`${days2}d`);
  }
  return parts.reverse().join(" ");
};

// node_modules/effect/dist/esm/internal/hashMap/config.js
var SIZE = 5;
var BUCKET_SIZE = Math.pow(2, SIZE);
var MASK = BUCKET_SIZE - 1;
var MAX_INDEX_NODE = BUCKET_SIZE / 2;
var MIN_ARRAY_NODE = BUCKET_SIZE / 4;

// node_modules/effect/dist/esm/internal/hashMap/bitwise.js
function popcount(x) {
  x -= x >> 1 & 1431655765;
  x = (x & 858993459) + (x >> 2 & 858993459);
  x = x + (x >> 4) & 252645135;
  x += x >> 8;
  x += x >> 16;
  return x & 127;
}
function hashFragment(shift, h) {
  return h >>> shift & MASK;
}
function toBitmap(x) {
  return 1 << x;
}
function fromBitmap(bitmap, bit) {
  return popcount(bitmap & bit - 1);
}

// node_modules/effect/dist/esm/internal/stack.js
var make9 = (value, previous) => ({
  value,
  previous
});

// node_modules/effect/dist/esm/internal/hashMap/array.js
function arrayUpdate(mutate, at, v, arr) {
  let out = arr;
  if (!mutate) {
    const len = arr.length;
    out = new Array(len);
    for (let i = 0;i < len; ++i)
      out[i] = arr[i];
  }
  out[at] = v;
  return out;
}
function arraySpliceOut(mutate, at, arr) {
  const newLen = arr.length - 1;
  let i = 0;
  let g = 0;
  let out = arr;
  if (mutate) {
    i = g = at;
  } else {
    out = new Array(newLen);
    while (i < at)
      out[g++] = arr[i++];
  }
  ++i;
  while (i <= newLen)
    out[g++] = arr[i++];
  if (mutate) {
    out.length = newLen;
  }
  return out;
}
function arraySpliceIn(mutate, at, v, arr) {
  const len = arr.length;
  if (mutate) {
    let i2 = len;
    while (i2 >= at)
      arr[i2--] = arr[i2];
    arr[at] = v;
    return arr;
  }
  let i = 0, g = 0;
  const out = new Array(len + 1);
  while (i < at)
    out[g++] = arr[i++];
  out[at] = v;
  while (i < len)
    out[++g] = arr[i++];
  return out;
}

// node_modules/effect/dist/esm/internal/hashMap/node.js
function isEmptyNode(a) {
  return isTagged(a, "EmptyNode");
}
function isLeafNode(node5) {
  return isEmptyNode(node5) || node5._tag === "LeafNode" || node5._tag === "CollisionNode";
}
function canEditNode(node5, edit) {
  return isEmptyNode(node5) ? false : edit === node5.edit;
}
var pack = function(edit, count, removed, elements) {
  const children = new Array(count - 1);
  let g = 0;
  let bitmap = 0;
  for (let i = 0, len = elements.length;i < len; ++i) {
    if (i !== removed) {
      const elem = elements[i];
      if (elem && !isEmptyNode(elem)) {
        children[g++] = elem;
        bitmap |= 1 << i;
      }
    }
  }
  return new IndexedNode(edit, bitmap, children);
};
var expand = function(edit, frag, child, bitmap, subNodes) {
  const arr = [];
  let bit = bitmap;
  let count = 0;
  for (let i = 0;bit; ++i) {
    if (bit & 1)
      arr[i] = subNodes[count++];
    bit >>>= 1;
  }
  arr[frag] = child;
  return new ArrayNode(edit, count + 1, arr);
};
var mergeLeavesInner = function(edit, shift, h1, n1, h2, n2) {
  if (h1 === h2)
    return new CollisionNode(edit, h1, [n2, n1]);
  const subH1 = hashFragment(shift, h1);
  const subH2 = hashFragment(shift, h2);
  if (subH1 === subH2) {
    return (child) => new IndexedNode(edit, toBitmap(subH1) | toBitmap(subH2), [child]);
  } else {
    const children = subH1 < subH2 ? [n1, n2] : [n2, n1];
    return new IndexedNode(edit, toBitmap(subH1) | toBitmap(subH2), children);
  }
};
var mergeLeaves = function(edit, shift, h1, n1, h2, n2) {
  let stack = undefined;
  let currentShift = shift;
  while (true) {
    const res = mergeLeavesInner(edit, currentShift, h1, n1, h2, n2);
    if (typeof res === "function") {
      stack = make9(res, stack);
      currentShift = currentShift + SIZE;
    } else {
      let final = res;
      while (stack != null) {
        final = stack.value(final);
        stack = stack.previous;
      }
      return final;
    }
  }
};

class EmptyNode {
  _tag = "EmptyNode";
  modify(edit, _shift, f, hash4, key, size12) {
    const v = f(none2());
    if (isNone2(v))
      return new EmptyNode;
    ++size12.value;
    return new LeafNode(edit, hash4, key, v);
  }
}

class LeafNode {
  edit;
  hash;
  key;
  value;
  _tag = "LeafNode";
  constructor(edit, hash4, key, value) {
    this.edit = edit;
    this.hash = hash4;
    this.key = key;
    this.value = value;
  }
  modify(edit, shift, f, hash4, key, size12) {
    if (equals(key, this.key)) {
      const v2 = f(this.value);
      if (v2 === this.value)
        return this;
      else if (isNone2(v2)) {
        --size12.value;
        return new EmptyNode;
      }
      if (canEditNode(this, edit)) {
        this.value = v2;
        return this;
      }
      return new LeafNode(edit, hash4, key, v2);
    }
    const v = f(none2());
    if (isNone2(v))
      return this;
    ++size12.value;
    return mergeLeaves(edit, shift, this.hash, this, hash4, new LeafNode(edit, hash4, key, v));
  }
}

class CollisionNode {
  edit;
  hash;
  children;
  _tag = "CollisionNode";
  constructor(edit, hash4, children) {
    this.edit = edit;
    this.hash = hash4;
    this.children = children;
  }
  modify(edit, shift, f, hash4, key, size12) {
    if (hash4 === this.hash) {
      const canEdit = canEditNode(this, edit);
      const list = this.updateCollisionList(canEdit, edit, this.hash, this.children, f, key, size12);
      if (list === this.children)
        return this;
      return list.length > 1 ? new CollisionNode(edit, this.hash, list) : list[0];
    }
    const v = f(none2());
    if (isNone2(v))
      return this;
    ++size12.value;
    return mergeLeaves(edit, shift, this.hash, this, hash4, new LeafNode(edit, hash4, key, v));
  }
  updateCollisionList(mutate, edit, hash4, list, f, key, size12) {
    const len = list.length;
    for (let i = 0;i < len; ++i) {
      const child = list[i];
      if ("key" in child && equals(key, child.key)) {
        const value = child.value;
        const newValue2 = f(value);
        if (newValue2 === value)
          return list;
        if (isNone2(newValue2)) {
          --size12.value;
          return arraySpliceOut(mutate, i, list);
        }
        return arrayUpdate(mutate, i, new LeafNode(edit, hash4, key, newValue2), list);
      }
    }
    const newValue = f(none2());
    if (isNone2(newValue))
      return list;
    ++size12.value;
    return arrayUpdate(mutate, len, new LeafNode(edit, hash4, key, newValue), list);
  }
}

class IndexedNode {
  edit;
  mask;
  children;
  _tag = "IndexedNode";
  constructor(edit, mask, children) {
    this.edit = edit;
    this.mask = mask;
    this.children = children;
  }
  modify(edit, shift, f, hash4, key, size12) {
    const mask = this.mask;
    const children = this.children;
    const frag = hashFragment(shift, hash4);
    const bit = toBitmap(frag);
    const indx = fromBitmap(mask, bit);
    const exists2 = mask & bit;
    const canEdit = canEditNode(this, edit);
    if (!exists2) {
      const _newChild = new EmptyNode().modify(edit, shift + SIZE, f, hash4, key, size12);
      if (!_newChild)
        return this;
      return children.length >= MAX_INDEX_NODE ? expand(edit, frag, _newChild, mask, children) : new IndexedNode(edit, mask | bit, arraySpliceIn(canEdit, indx, _newChild, children));
    }
    const current = children[indx];
    const child = current.modify(edit, shift + SIZE, f, hash4, key, size12);
    if (current === child)
      return this;
    let bitmap = mask;
    let newChildren;
    if (isEmptyNode(child)) {
      bitmap &= ~bit;
      if (!bitmap)
        return new EmptyNode;
      if (children.length <= 2 && isLeafNode(children[indx ^ 1])) {
        return children[indx ^ 1];
      }
      newChildren = arraySpliceOut(canEdit, indx, children);
    } else {
      newChildren = arrayUpdate(canEdit, indx, child, children);
    }
    if (canEdit) {
      this.mask = bitmap;
      this.children = newChildren;
      return this;
    }
    return new IndexedNode(edit, bitmap, newChildren);
  }
}

class ArrayNode {
  edit;
  size;
  children;
  _tag = "ArrayNode";
  constructor(edit, size12, children) {
    this.edit = edit;
    this.size = size12;
    this.children = children;
  }
  modify(edit, shift, f, hash4, key, size12) {
    let count = this.size;
    const children = this.children;
    const frag = hashFragment(shift, hash4);
    const child = children[frag];
    const newChild = (child || new EmptyNode).modify(edit, shift + SIZE, f, hash4, key, size12);
    if (child === newChild)
      return this;
    const canEdit = canEditNode(this, edit);
    let newChildren;
    if (isEmptyNode(child) && !isEmptyNode(newChild)) {
      ++count;
      newChildren = arrayUpdate(canEdit, frag, newChild, children);
    } else if (!isEmptyNode(child) && isEmptyNode(newChild)) {
      --count;
      if (count <= MIN_ARRAY_NODE) {
        return pack(edit, count, frag, children);
      }
      newChildren = arrayUpdate(canEdit, frag, new EmptyNode, children);
    } else {
      newChildren = arrayUpdate(canEdit, frag, newChild, children);
    }
    if (canEdit) {
      this.size = count;
      this.children = newChildren;
      return this;
    }
    return new ArrayNode(edit, count, newChildren);
  }
}

// node_modules/effect/dist/esm/internal/hashMap.js
var HashMapSymbolKey = "effect/HashMap";
var HashMapTypeId = Symbol.for(HashMapSymbolKey);
var HashMapProto = {
  [HashMapTypeId]: HashMapTypeId,
  [Symbol.iterator]() {
    return new HashMapIterator(this, (k, v) => [k, v]);
  },
  [symbol]() {
    let hash4 = hash3(HashMapSymbolKey);
    for (const item of this) {
      hash4 ^= pipe(hash3(item[0]), combine(hash3(item[1])));
    }
    return cached(this, hash4);
  },
  [symbol2](that) {
    if (isHashMap(that)) {
      if (that._size !== this._size) {
        return false;
      }
      for (const item of this) {
        const elem = pipe(that, getHash2(item[0], hash3(item[0])));
        if (isNone2(elem)) {
          return false;
        } else {
          if (!equals(item[1], elem.value)) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashMap",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeImpl = (editable, edit, root, size12) => {
  const map4 = Object.create(HashMapProto);
  map4._editable = editable;
  map4._edit = edit;
  map4._root = root;
  map4._size = size12;
  return map4;
};

class HashMapIterator {
  map;
  f;
  v;
  constructor(map4, f) {
    this.map = map4;
    this.f = f;
    this.v = visitLazy(this.map._root, this.f, undefined);
  }
  next() {
    if (isNone2(this.v)) {
      return {
        done: true,
        value: undefined
      };
    }
    const v0 = this.v.value;
    this.v = applyCont(v0.cont);
    return {
      done: false,
      value: v0.value
    };
  }
  [Symbol.iterator]() {
    return new HashMapIterator(this.map, this.f);
  }
}
var applyCont = (cont) => cont ? visitLazyChildren(cont[0], cont[1], cont[2], cont[3], cont[4]) : none2();
var visitLazy = (node5, f, cont = undefined) => {
  switch (node5._tag) {
    case "LeafNode": {
      if (isSome2(node5.value)) {
        return some2({
          value: f(node5.key, node5.value.value),
          cont
        });
      }
      return applyCont(cont);
    }
    case "CollisionNode":
    case "ArrayNode":
    case "IndexedNode": {
      const children = node5.children;
      return visitLazyChildren(children.length, children, 0, f, cont);
    }
    default: {
      return applyCont(cont);
    }
  }
};
var visitLazyChildren = (len, children, i, f, cont) => {
  while (i < len) {
    const child = children[i++];
    if (child && !isEmptyNode(child)) {
      return visitLazy(child, f, [len, children, i, f, cont]);
    }
  }
  return applyCont(cont);
};
var _empty3 = makeImpl(false, 0, new EmptyNode, 0);
var empty6 = () => _empty3;
var fromIterable3 = (entries) => {
  const map4 = beginMutation(empty6());
  for (const entry of entries) {
    set(map4, entry[0], entry[1]);
  }
  return endMutation(map4);
};
var isHashMap = (u) => hasProperty(u, HashMapTypeId);
var isEmpty2 = (self2) => self2 && isEmptyNode(self2._root);
var get5 = dual(2, (self2, key) => getHash2(self2, key, hash3(key)));
var getHash2 = dual(3, (self2, key, hash4) => {
  let node5 = self2._root;
  let shift = 0;
  while (true) {
    switch (node5._tag) {
      case "LeafNode": {
        return equals(key, node5.key) ? node5.value : none2();
      }
      case "CollisionNode": {
        if (hash4 === node5.hash) {
          const children = node5.children;
          for (let i = 0, len = children.length;i < len; ++i) {
            const child = children[i];
            if ("key" in child && equals(key, child.key)) {
              return child.value;
            }
          }
        }
        return none2();
      }
      case "IndexedNode": {
        const frag = hashFragment(shift, hash4);
        const bit = toBitmap(frag);
        if (node5.mask & bit) {
          node5 = node5.children[fromBitmap(node5.mask, bit)];
          shift += SIZE;
          break;
        }
        return none2();
      }
      case "ArrayNode": {
        node5 = node5.children[hashFragment(shift, hash4)];
        if (node5) {
          shift += SIZE;
          break;
        }
        return none2();
      }
      default:
        return none2();
    }
  }
});
var has = dual(2, (self2, key) => isSome2(getHash2(self2, key, hash3(key))));
var set = dual(3, (self2, key, value) => modifyAt(self2, key, () => some2(value)));
var setTree = dual(3, (self2, newRoot, newSize) => {
  if (self2._editable) {
    self2._root = newRoot;
    self2._size = newSize;
    return self2;
  }
  return newRoot === self2._root ? self2 : makeImpl(self2._editable, self2._edit, newRoot, newSize);
});
var keys = (self2) => new HashMapIterator(self2, (key) => key);
var size12 = (self2) => self2._size;
var beginMutation = (self2) => makeImpl(true, self2._edit + 1, self2._root, self2._size);
var endMutation = (self2) => {
  self2._editable = false;
  return self2;
};
var mutate = dual(2, (self2, f) => {
  const transient = beginMutation(self2);
  f(transient);
  return endMutation(transient);
});
var modifyAt = dual(3, (self2, key, f) => modifyHash(self2, key, hash3(key), f));
var modifyHash = dual(4, (self2, key, hash4, f) => {
  const size13 = {
    value: self2._size
  };
  const newRoot = self2._root.modify(self2._editable ? self2._edit : NaN, 0, f, hash4, key, size13);
  return pipe(self2, setTree(newRoot, size13.value));
});
var remove2 = dual(2, (self2, key) => modifyAt(self2, key, none2));
var map4 = dual(2, (self2, f) => reduce2(self2, empty6(), (map5, value, key) => set(map5, key, f(value, key))));
var forEach = dual(2, (self2, f) => reduce2(self2, undefined, (_, value, key) => f(value, key)));
var reduce2 = dual(3, (self2, zero3, f) => {
  const root = self2._root;
  if (root._tag === "LeafNode") {
    return isSome2(root.value) ? f(zero3, root.value.value, root.key) : zero3;
  }
  if (root._tag === "EmptyNode") {
    return zero3;
  }
  const toVisit = [root.children];
  let children;
  while (children = toVisit.pop()) {
    for (let i = 0, len = children.length;i < len; ) {
      const child = children[i++];
      if (child && !isEmptyNode(child)) {
        if (child._tag === "LeafNode") {
          if (isSome2(child.value)) {
            zero3 = f(zero3, child.value.value, child.key);
          }
        } else {
          toVisit.push(child.children);
        }
      }
    }
  }
  return zero3;
});

// node_modules/effect/dist/esm/internal/hashSet.js
var HashSetSymbolKey = "effect/HashSet";
var HashSetTypeId = Symbol.for(HashSetSymbolKey);
var HashSetProto = {
  [HashSetTypeId]: HashSetTypeId,
  [Symbol.iterator]() {
    return keys(this._keyMap);
  },
  [symbol]() {
    return cached(this, combine(hash3(this._keyMap))(hash3(HashSetSymbolKey)));
  },
  [symbol2](that) {
    if (isHashSet(that)) {
      return size12(this._keyMap) === size12(that._keyMap) && equals(this._keyMap, that._keyMap);
    }
    return false;
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashSet",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeImpl2 = (keyMap) => {
  const set2 = Object.create(HashSetProto);
  set2._keyMap = keyMap;
  return set2;
};
var isHashSet = (u) => hasProperty(u, HashSetTypeId);
var _empty4 = makeImpl2(empty6());
var empty7 = () => _empty4;
var fromIterable4 = (elements) => {
  const set2 = beginMutation2(empty7());
  for (const value of elements) {
    add3(set2, value);
  }
  return endMutation2(set2);
};
var make10 = (...elements) => {
  const set2 = beginMutation2(empty7());
  for (const value of elements) {
    add3(set2, value);
  }
  return endMutation2(set2);
};
var has2 = dual(2, (self2, value) => has(self2._keyMap, value));
var size13 = (self2) => size12(self2._keyMap);
var beginMutation2 = (self2) => makeImpl2(beginMutation(self2._keyMap));
var endMutation2 = (self2) => {
  self2._keyMap._editable = false;
  return self2;
};
var mutate2 = dual(2, (self2, f) => {
  const transient = beginMutation2(self2);
  f(transient);
  return endMutation2(transient);
});
var add3 = dual(2, (self2, value) => self2._keyMap._editable ? (set(value, true)(self2._keyMap), self2) : makeImpl2(set(value, true)(self2._keyMap)));
var remove3 = dual(2, (self2, value) => self2._keyMap._editable ? (remove2(value)(self2._keyMap), self2) : makeImpl2(remove2(value)(self2._keyMap)));
var difference2 = dual(2, (self2, that) => mutate2(self2, (set2) => {
  for (const value of that) {
    remove3(set2, value);
  }
}));
var union2 = dual(2, (self2, that) => mutate2(empty7(), (set2) => {
  forEach2(self2, (value) => add3(set2, value));
  for (const value of that) {
    add3(set2, value);
  }
}));
var forEach2 = dual(2, (self2, f) => forEach(self2._keyMap, (_, k) => f(k)));
var reduce3 = dual(3, (self2, zero3, f) => reduce2(self2._keyMap, zero3, (z, _, a) => f(z, a)));

// node_modules/effect/dist/esm/HashSet.js
var empty8 = empty7;
var fromIterable5 = fromIterable4;
var make11 = make10;
var has3 = has2;
var size14 = size13;
var add4 = add3;
var remove4 = remove3;
var difference3 = difference2;
var union3 = union2;
var forEach3 = forEach2;
var reduce4 = reduce3;

// node_modules/effect/dist/esm/MutableRef.js
var TypeId7 = Symbol.for("effect/MutableRef");
var MutableRefProto = {
  [TypeId7]: TypeId7,
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableRef",
      current: toJSON(this.current)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var make12 = (value) => {
  const ref = Object.create(MutableRefProto);
  ref.current = value;
  return ref;
};
var compareAndSet = dual(3, (self2, oldValue, newValue) => {
  if (equals(oldValue, self2.current)) {
    self2.current = newValue;
    return true;
  }
  return false;
});
var get6 = (self2) => self2.current;
var set2 = dual(2, (self2, value) => {
  self2.current = value;
  return self2;
});

// node_modules/effect/dist/esm/internal/fiberId.js
var FiberIdSymbolKey = "effect/FiberId";
var FiberIdTypeId = Symbol.for(FiberIdSymbolKey);
var OP_NONE = "None";
var OP_RUNTIME = "Runtime";
var OP_COMPOSITE = "Composite";
var emptyHash = string(`${FiberIdSymbolKey}-${OP_NONE}`);

class None {
  [FiberIdTypeId] = FiberIdTypeId;
  _tag = OP_NONE;
  id = -1;
  startTimeMillis = -1;
  [symbol]() {
    return emptyHash;
  }
  [symbol2](that) {
    return isFiberId(that) && that._tag === OP_NONE;
  }
  toString() {
    return format(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag
    };
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
}

class Runtime {
  id;
  startTimeMillis;
  [FiberIdTypeId] = FiberIdTypeId;
  _tag = OP_RUNTIME;
  constructor(id2, startTimeMillis) {
    this.id = id2;
    this.startTimeMillis = startTimeMillis;
  }
  [symbol]() {
    return cached(this, string(`${FiberIdSymbolKey}-${this._tag}-${this.id}-${this.startTimeMillis}`));
  }
  [symbol2](that) {
    return isFiberId(that) && that._tag === OP_RUNTIME && this.id === that.id && this.startTimeMillis === that.startTimeMillis;
  }
  toString() {
    return format(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag,
      id: this.id,
      startTimeMillis: this.startTimeMillis
    };
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
}

class Composite {
  left;
  right;
  [FiberIdTypeId] = FiberIdTypeId;
  _tag = OP_COMPOSITE;
  constructor(left3, right3) {
    this.left = left3;
    this.right = right3;
  }
  _hash;
  [symbol]() {
    return pipe(string(`${FiberIdSymbolKey}-${this._tag}`), combine(hash3(this.left)), combine(hash3(this.right)), cached(this));
  }
  [symbol2](that) {
    return isFiberId(that) && that._tag === OP_COMPOSITE && equals(this.left, that.left) && equals(this.right, that.right);
  }
  toString() {
    return format(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag,
      left: toJSON(this.left),
      right: toJSON(this.right)
    };
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
}
var none3 = new None;
var isFiberId = (self2) => hasProperty(self2, FiberIdTypeId);
var combine2 = dual(2, (self2, that) => {
  if (self2._tag === OP_NONE) {
    return that;
  }
  if (that._tag === OP_NONE) {
    return self2;
  }
  return new Composite(self2, that);
});
var ids = (self2) => {
  switch (self2._tag) {
    case OP_NONE: {
      return empty8();
    }
    case OP_RUNTIME: {
      return make11(self2.id);
    }
    case OP_COMPOSITE: {
      return pipe(ids(self2.left), union3(ids(self2.right)));
    }
  }
};
var _fiberCounter = globalValue(Symbol.for("effect/Fiber/Id/_fiberCounter"), () => make12(0));
var threadName = (self2) => {
  const identifiers = Array.from(ids(self2)).map((n) => `#${n}`).join(",");
  return identifiers;
};
var unsafeMake = () => {
  const id2 = get6(_fiberCounter);
  pipe(_fiberCounter, set2(id2 + 1));
  return new Runtime(id2, Date.now());
};

// node_modules/effect/dist/esm/FiberId.js
var none4 = none3;
var combine3 = combine2;
var threadName2 = threadName;
var unsafeMake2 = unsafeMake;

// node_modules/effect/dist/esm/HashMap.js
var empty9 = empty6;
var fromIterable6 = fromIterable3;
var isEmpty3 = isEmpty2;
var get7 = get5;
var set3 = set;
var keys2 = keys;
var size15 = size12;
var mutate3 = mutate;
var modifyAt2 = modifyAt;
var map6 = map4;
var forEach4 = forEach;
var reduce5 = reduce2;

// node_modules/effect/dist/esm/List.js
var TypeId8 = Symbol.for("effect/List");
var toArray2 = (self2) => fromIterable(self2);
var getEquivalence3 = (isEquivalent) => mapInput(getEquivalence(isEquivalent), toArray2);
var _equivalence4 = getEquivalence3(equals);
var ConsProto = {
  [TypeId8]: TypeId8,
  _tag: "Cons",
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "List",
      _tag: "Cons",
      values: toArray2(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  [symbol2](that) {
    return isList(that) && this._tag === that._tag && _equivalence4(this, that);
  },
  [symbol]() {
    return cached(this, array2(toArray2(this)));
  },
  [Symbol.iterator]() {
    let done = false;
    let self2 = this;
    return {
      next() {
        if (done) {
          return this.return();
        }
        if (self2._tag === "Nil") {
          done = true;
          return this.return();
        }
        const value = self2.head;
        self2 = self2.tail;
        return {
          done,
          value
        };
      },
      return(value) {
        if (!done) {
          done = true;
        }
        return {
          done: true,
          value
        };
      }
    };
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeCons = (head3, tail) => {
  const cons = Object.create(ConsProto);
  cons.head = head3;
  cons.tail = tail;
  return cons;
};
var NilHash = string("Nil");
var NilProto = {
  [TypeId8]: TypeId8,
  _tag: "Nil",
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "List",
      _tag: "Nil"
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  [symbol]() {
    return NilHash;
  },
  [symbol2](that) {
    return isList(that) && this._tag === that._tag;
  },
  [Symbol.iterator]() {
    return {
      next() {
        return {
          done: true,
          value: undefined
        };
      }
    };
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var _Nil = Object.create(NilProto);
var isList = (u) => hasProperty(u, TypeId8);
var isNil = (self2) => self2._tag === "Nil";
var isCons = (self2) => self2._tag === "Cons";
var nil = () => _Nil;
var cons = (head3, tail) => makeCons(head3, tail);
var empty10 = nil;
var of3 = (value) => makeCons(value, _Nil);
var appendAll3 = dual(2, (self2, that) => prependAll(that, self2));
var prepend3 = dual(2, (self2, element) => cons(element, self2));
var prependAll = dual(2, (self2, prefix) => {
  if (isNil(self2)) {
    return prefix;
  } else if (isNil(prefix)) {
    return self2;
  } else {
    const result = makeCons(prefix.head, self2);
    let curr = result;
    let that = prefix.tail;
    while (!isNil(that)) {
      const temp = makeCons(that.head, self2);
      curr.tail = temp;
      curr = temp;
      that = that.tail;
    }
    return result;
  }
});
var reduce6 = dual(3, (self2, zero3, f) => {
  let acc = zero3;
  let these = self2;
  while (!isNil(these)) {
    acc = f(acc, these.head);
    these = these.tail;
  }
  return acc;
});
var reverse3 = (self2) => {
  let result = empty10();
  let these = self2;
  while (!isNil(these)) {
    result = prepend3(result, these.head);
    these = these.tail;
  }
  return result;
};

// node_modules/effect/dist/esm/internal/data.js
var ArrayProto = Object.assign(Object.create(Array.prototype), {
  [symbol]() {
    return cached(this, array2(this));
  },
  [symbol2](that) {
    if (Array.isArray(that) && this.length === that.length) {
      return this.every((v, i) => equals(v, that[i]));
    } else {
      return false;
    }
  }
});
var Structural = function() {
  function Structural2(args) {
    if (args) {
      Object.assign(this, args);
    }
  }
  Structural2.prototype = StructuralPrototype;
  return Structural2;
}();
var struct2 = (as) => Object.assign(Object.create(StructuralPrototype), as);

// node_modules/effect/dist/esm/internal/differ/chunkPatch.js
var variance = function(a) {
  return a;
};
var ChunkPatchTypeId = Symbol.for("effect/DifferChunkPatch");
var PatchProto = {
  ...Structural.prototype,
  [ChunkPatchTypeId]: {
    _Value: variance,
    _Patch: variance
  }
};

// node_modules/effect/dist/esm/internal/differ/contextPatch.js
var variance2 = function(a) {
  return a;
};
var ContextPatchTypeId = Symbol.for("effect/DifferContextPatch");
var PatchProto2 = {
  ...Structural.prototype,
  [ContextPatchTypeId]: {
    _Value: variance2,
    _Patch: variance2
  }
};
var EmptyProto = Object.assign(Object.create(PatchProto2), {
  _tag: "Empty"
});
var _empty5 = Object.create(EmptyProto);
var empty11 = () => _empty5;
var AndThenProto = Object.assign(Object.create(PatchProto2), {
  _tag: "AndThen"
});
var makeAndThen = (first, second) => {
  const o = Object.create(AndThenProto);
  o.first = first;
  o.second = second;
  return o;
};
var AddServiceProto = Object.assign(Object.create(PatchProto2), {
  _tag: "AddService"
});
var makeAddService = (key, service) => {
  const o = Object.create(AddServiceProto);
  o.key = key;
  o.service = service;
  return o;
};
var RemoveServiceProto = Object.assign(Object.create(PatchProto2), {
  _tag: "RemoveService"
});
var makeRemoveService = (key) => {
  const o = Object.create(RemoveServiceProto);
  o.key = key;
  return o;
};
var UpdateServiceProto = Object.assign(Object.create(PatchProto2), {
  _tag: "UpdateService"
});
var makeUpdateService = (key, update) => {
  const o = Object.create(UpdateServiceProto);
  o.key = key;
  o.update = update;
  return o;
};
var diff = (oldValue, newValue) => {
  const missingServices = new Map(oldValue.unsafeMap);
  let patch = empty11();
  for (const [tag, newService] of newValue.unsafeMap.entries()) {
    if (missingServices.has(tag)) {
      const old = missingServices.get(tag);
      missingServices.delete(tag);
      if (!equals(old, newService)) {
        patch = combine4(makeUpdateService(tag, () => newService))(patch);
      }
    } else {
      missingServices.delete(tag);
      patch = combine4(makeAddService(tag, newService))(patch);
    }
  }
  for (const [tag] of missingServices.entries()) {
    patch = combine4(makeRemoveService(tag))(patch);
  }
  return patch;
};
var combine4 = dual(2, (self2, that) => makeAndThen(self2, that));
var patch = dual(2, (self2, context2) => {
  if (self2._tag === "Empty") {
    return context2;
  }
  let wasServiceUpdated = false;
  let patches = of2(self2);
  const updatedContext = new Map(context2.unsafeMap);
  while (isNonEmpty(patches)) {
    const head3 = headNonEmpty2(patches);
    const tail = tailNonEmpty2(patches);
    switch (head3._tag) {
      case "Empty": {
        patches = tail;
        break;
      }
      case "AddService": {
        updatedContext.set(head3.key, head3.service);
        patches = tail;
        break;
      }
      case "AndThen": {
        patches = prepend2(prepend2(tail, head3.second), head3.first);
        break;
      }
      case "RemoveService": {
        updatedContext.delete(head3.key);
        patches = tail;
        break;
      }
      case "UpdateService": {
        updatedContext.set(head3.key, head3.update(updatedContext.get(head3.key)));
        wasServiceUpdated = true;
        patches = tail;
        break;
      }
    }
  }
  if (!wasServiceUpdated) {
    return makeContext(updatedContext);
  }
  const map7 = new Map;
  for (const [tag] of context2.unsafeMap) {
    if (updatedContext.has(tag)) {
      map7.set(tag, updatedContext.get(tag));
      updatedContext.delete(tag);
    }
  }
  for (const [tag, s] of updatedContext) {
    map7.set(tag, s);
  }
  return makeContext(map7);
});

// node_modules/effect/dist/esm/internal/differ/hashMapPatch.js
var variance3 = function(a) {
  return a;
};
var HashMapPatchTypeId = Symbol.for("effect/DifferHashMapPatch");
var PatchProto3 = {
  ...Structural.prototype,
  [HashMapPatchTypeId]: {
    _Value: variance3,
    _Key: variance3,
    _Patch: variance3
  }
};

// node_modules/effect/dist/esm/internal/differ/hashSetPatch.js
var variance4 = function(a) {
  return a;
};
var HashSetPatchTypeId = Symbol.for("effect/DifferHashSetPatch");
var PatchProto4 = {
  ...Structural.prototype,
  [HashSetPatchTypeId]: {
    _Value: variance4,
    _Key: variance4,
    _Patch: variance4
  }
};
var EmptyProto2 = Object.assign(Object.create(PatchProto4), {
  _tag: "Empty"
});
var _empty6 = Object.create(EmptyProto2);
var empty12 = () => _empty6;
var AndThenProto2 = Object.assign(Object.create(PatchProto4), {
  _tag: "AndThen"
});
var makeAndThen2 = (first, second) => {
  const o = Object.create(AndThenProto2);
  o.first = first;
  o.second = second;
  return o;
};
var AddProto = Object.assign(Object.create(PatchProto4), {
  _tag: "Add"
});
var makeAdd = (value) => {
  const o = Object.create(AddProto);
  o.value = value;
  return o;
};
var RemoveProto = Object.assign(Object.create(PatchProto4), {
  _tag: "Remove"
});
var makeRemove = (value) => {
  const o = Object.create(RemoveProto);
  o.value = value;
  return o;
};
var diff2 = (oldValue, newValue) => {
  const [removed, patch2] = reduce4([oldValue, empty12()], ([set4, patch3], value) => {
    if (has3(value)(set4)) {
      return [remove4(value)(set4), patch3];
    }
    return [set4, combine5(makeAdd(value))(patch3)];
  })(newValue);
  return reduce4(patch2, (patch3, value) => combine5(makeRemove(value))(patch3))(removed);
};
var combine5 = dual(2, (self2, that) => makeAndThen2(self2, that));
var patch2 = dual(2, (self2, oldValue) => {
  if (self2._tag === "Empty") {
    return oldValue;
  }
  let set4 = oldValue;
  let patches = of2(self2);
  while (isNonEmpty(patches)) {
    const head3 = headNonEmpty2(patches);
    const tail = tailNonEmpty2(patches);
    switch (head3._tag) {
      case "Empty": {
        patches = tail;
        break;
      }
      case "AndThen": {
        patches = prepend2(head3.first)(prepend2(head3.second)(tail));
        break;
      }
      case "Add": {
        set4 = add4(head3.value)(set4);
        patches = tail;
        break;
      }
      case "Remove": {
        set4 = remove4(head3.value)(set4);
        patches = tail;
      }
    }
  }
  return set4;
});

// node_modules/effect/dist/esm/internal/differ/orPatch.js
var variance5 = function(a) {
  return a;
};
var OrPatchTypeId = Symbol.for("effect/DifferOrPatch");
var PatchProto5 = {
  ...Structural.prototype,
  [OrPatchTypeId]: {
    _Value: variance5,
    _Key: variance5,
    _Patch: variance5
  }
};

// node_modules/effect/dist/esm/internal/differ/readonlyArrayPatch.js
var variance6 = function(a) {
  return a;
};
var ReadonlyArrayPatchTypeId = Symbol.for("effect/DifferReadonlyArrayPatch");
var PatchProto6 = {
  ...Structural.prototype,
  [ReadonlyArrayPatchTypeId]: {
    _Value: variance6,
    _Patch: variance6
  }
};
var EmptyProto3 = Object.assign(Object.create(PatchProto6), {
  _tag: "Empty"
});
var _empty7 = Object.create(EmptyProto3);
var empty13 = () => _empty7;
var AndThenProto3 = Object.assign(Object.create(PatchProto6), {
  _tag: "AndThen"
});
var makeAndThen3 = (first, second) => {
  const o = Object.create(AndThenProto3);
  o.first = first;
  o.second = second;
  return o;
};
var AppendProto = Object.assign(Object.create(PatchProto6), {
  _tag: "Append"
});
var makeAppend = (values3) => {
  const o = Object.create(AppendProto);
  o.values = values3;
  return o;
};
var SliceProto = Object.assign(Object.create(PatchProto6), {
  _tag: "Slice"
});
var makeSlice = (from, until) => {
  const o = Object.create(SliceProto);
  o.from = from;
  o.until = until;
  return o;
};
var UpdateProto = Object.assign(Object.create(PatchProto6), {
  _tag: "Update"
});
var makeUpdate = (index2, patch3) => {
  const o = Object.create(UpdateProto);
  o.index = index2;
  o.patch = patch3;
  return o;
};
var diff3 = (options) => {
  let i = 0;
  let patch3 = empty13();
  while (i < options.oldValue.length && i < options.newValue.length) {
    const oldElement = options.oldValue[i];
    const newElement = options.newValue[i];
    const valuePatch = options.differ.diff(oldElement, newElement);
    if (!equals(valuePatch, options.differ.empty)) {
      patch3 = combine6(patch3, makeUpdate(i, valuePatch));
    }
    i = i + 1;
  }
  if (i < options.oldValue.length) {
    patch3 = combine6(patch3, makeSlice(0, i));
  }
  if (i < options.newValue.length) {
    patch3 = combine6(patch3, makeAppend(drop(i)(options.newValue)));
  }
  return patch3;
};
var combine6 = dual(2, (self2, that) => makeAndThen3(self2, that));
var patch3 = dual(3, (self2, oldValue, differ) => {
  if (self2._tag === "Empty") {
    return oldValue;
  }
  let readonlyArray = oldValue.slice();
  let patches = of(self2);
  while (isNonEmptyArray2(patches)) {
    const head3 = headNonEmpty(patches);
    const tail = tailNonEmpty(patches);
    switch (head3._tag) {
      case "Empty": {
        patches = tail;
        break;
      }
      case "AndThen": {
        tail.unshift(head3.first, head3.second);
        patches = tail;
        break;
      }
      case "Append": {
        for (const value of head3.values) {
          readonlyArray.push(value);
        }
        patches = tail;
        break;
      }
      case "Slice": {
        readonlyArray = readonlyArray.slice(head3.from, head3.until);
        patches = tail;
        break;
      }
      case "Update": {
        readonlyArray[head3.index] = differ.patch(head3.patch, readonlyArray[head3.index]);
        patches = tail;
        break;
      }
    }
  }
  return readonlyArray;
});

// node_modules/effect/dist/esm/internal/differ.js
var DifferTypeId = Symbol.for("effect/Differ");
var DifferProto = {
  [DifferTypeId]: {
    _P: identity,
    _V: identity
  }
};
var make15 = (params) => {
  const differ = Object.create(DifferProto);
  differ.empty = params.empty;
  differ.diff = params.diff;
  differ.combine = params.combine;
  differ.patch = params.patch;
  return differ;
};
var environment = () => make15({
  empty: empty11(),
  combine: (first, second) => combine4(second)(first),
  diff: (oldValue, newValue) => diff(oldValue, newValue),
  patch: (patch7, oldValue) => patch(oldValue)(patch7)
});
var hashSet2 = () => make15({
  empty: empty12(),
  combine: (first, second) => combine5(second)(first),
  diff: (oldValue, newValue) => diff2(oldValue, newValue),
  patch: (patch7, oldValue) => patch2(oldValue)(patch7)
});
var readonlyArray = (differ) => make15({
  empty: empty13(),
  combine: (first, second) => combine6(first, second),
  diff: (oldValue, newValue) => diff3({
    oldValue,
    newValue,
    differ
  }),
  patch: (patch7, oldValue) => patch3(patch7, oldValue, differ)
});
var update = () => updateWith((_, a) => a);
var updateWith = (f) => make15({
  empty: identity,
  combine: (first, second) => {
    if (first === identity) {
      return second;
    }
    if (second === identity) {
      return first;
    }
    return (a) => second(first(a));
  },
  diff: (oldValue, newValue) => {
    if (equals(oldValue, newValue)) {
      return identity;
    }
    return constant(newValue);
  },
  patch: (patch7, oldValue) => f(oldValue, patch7(oldValue))
});

// node_modules/effect/dist/esm/internal/runtimeFlagsPatch.js
var BIT_MASK = 255;
var BIT_SHIFT = 8;
var active = (patch7) => patch7 & BIT_MASK;
var enabled = (patch7) => patch7 >> BIT_SHIFT & BIT_MASK;
var make16 = (active2, enabled2) => (active2 & BIT_MASK) + ((enabled2 & active2 & BIT_MASK) << BIT_SHIFT);
var empty17 = make16(0, 0);
var enable = (flag) => make16(flag, flag);
var disable = (flag) => make16(flag, 0);
var exclude = dual(2, (self2, flag) => make16(active(self2) & ~flag, enabled(self2)));
var andThen = dual(2, (self2, that) => self2 | that);
var invert2 = (n) => ~n >>> 0 & BIT_MASK;

// node_modules/effect/dist/esm/internal/runtimeFlags.js
var None2 = 0;
var Interruption = 1 << 0;
var OpSupervision = 1 << 1;
var RuntimeMetrics = 1 << 2;
var WindDown = 1 << 4;
var CooperativeYielding = 1 << 5;
var cooperativeYielding = (self2) => isEnabled(self2, CooperativeYielding);
var enable2 = dual(2, (self2, flag) => self2 | flag);
var interruptible = (self2) => interruption(self2) && !windDown(self2);
var interruption = (self2) => isEnabled(self2, Interruption);
var isEnabled = dual(2, (self2, flag) => (self2 & flag) !== 0);
var make17 = (...flags) => flags.reduce((a, b) => a | b, 0);
var none5 = make17(None2);
var runtimeMetrics = (self2) => isEnabled(self2, RuntimeMetrics);
var windDown = (self2) => isEnabled(self2, WindDown);
var diff7 = dual(2, (self2, that) => make16(self2 ^ that, that));
var patch7 = dual(2, (self2, patch8) => self2 & (invert2(active(patch8)) | enabled(patch8)) | active(patch8) & enabled(patch8));
var differ = make15({
  empty: empty17,
  diff: (oldValue, newValue) => diff7(oldValue, newValue),
  combine: (first, second) => andThen(second)(first),
  patch: (_patch, oldValue) => patch7(oldValue, _patch)
});

// node_modules/effect/dist/esm/RuntimeFlagsPatch.js
var empty18 = empty17;
var enable3 = enable;
var disable2 = disable;
var exclude2 = exclude;

// node_modules/effect/dist/esm/internal/blockedRequests.js
var empty19 = {
  _tag: "Empty"
};
var par = (self2, that) => ({
  _tag: "Par",
  left: self2,
  right: that
});
var seq = (self2, that) => ({
  _tag: "Seq",
  left: self2,
  right: that
});
var single = (dataSource, blockedRequest) => ({
  _tag: "Single",
  dataSource,
  blockedRequest
});
var flatten2 = (self2) => {
  let current = of3(self2);
  let updated = empty10();
  while (true) {
    const [parallel, sequential] = reduce6(current, [parallelCollectionEmpty(), empty10()], ([parallel2, sequential2], blockedRequest) => {
      const [par2, seq2] = step(blockedRequest);
      return [parallelCollectionCombine(parallel2, par2), appendAll3(sequential2, seq2)];
    });
    updated = merge4(updated, parallel);
    if (isNil(sequential)) {
      return reverse3(updated);
    }
    current = sequential;
  }
  throw new Error("BUG: BlockedRequests.flatten - please report an issue at https://github.com/Effect-TS/effect/issues");
};
var step = (requests) => {
  let current = requests;
  let parallel = parallelCollectionEmpty();
  let stack = empty10();
  let sequential = empty10();
  while (true) {
    switch (current._tag) {
      case "Empty": {
        if (isNil(stack)) {
          return [parallel, sequential];
        }
        current = stack.head;
        stack = stack.tail;
        break;
      }
      case "Par": {
        stack = cons(current.right, stack);
        current = current.left;
        break;
      }
      case "Seq": {
        const left3 = current.left;
        const right3 = current.right;
        switch (left3._tag) {
          case "Empty": {
            current = right3;
            break;
          }
          case "Par": {
            const l = left3.left;
            const r = left3.right;
            current = par(seq(l, right3), seq(r, right3));
            break;
          }
          case "Seq": {
            const l = left3.left;
            const r = left3.right;
            current = seq(l, seq(r, right3));
            break;
          }
          case "Single": {
            current = left3;
            sequential = cons(right3, sequential);
            break;
          }
        }
        break;
      }
      case "Single": {
        parallel = parallelCollectionAdd(parallel, current);
        if (isNil(stack)) {
          return [parallel, sequential];
        }
        current = stack.head;
        stack = stack.tail;
        break;
      }
    }
  }
  throw new Error("BUG: BlockedRequests.step - please report an issue at https://github.com/Effect-TS/effect/issues");
};
var merge4 = (sequential, parallel) => {
  if (isNil(sequential)) {
    return of3(parallelCollectionToSequentialCollection(parallel));
  }
  if (parallelCollectionIsEmpty(parallel)) {
    return sequential;
  }
  const seqHeadKeys = sequentialCollectionKeys(sequential.head);
  const parKeys = parallelCollectionKeys(parallel);
  if (seqHeadKeys.length === 1 && parKeys.length === 1 && equals(seqHeadKeys[0], parKeys[0])) {
    return cons(sequentialCollectionCombine(sequential.head, parallelCollectionToSequentialCollection(parallel)), sequential.tail);
  }
  return cons(parallelCollectionToSequentialCollection(parallel), sequential);
};
var EntryTypeId = Symbol.for("effect/RequestBlock/Entry");

class EntryImpl {
  request;
  result;
  listeners;
  ownerId;
  state;
  [EntryTypeId] = blockedRequestVariance;
  constructor(request6, result, listeners, ownerId, state) {
    this.request = request6;
    this.result = result;
    this.listeners = listeners;
    this.ownerId = ownerId;
    this.state = state;
  }
}
var blockedRequestVariance = {
  _R: (_) => _
};
var makeEntry = (options) => new EntryImpl(options.request, options.result, options.listeners, options.ownerId, options.state);
var RequestBlockParallelTypeId = Symbol.for("effect/RequestBlock/RequestBlockParallel");
var parallelVariance = {
  _R: (_) => _
};

class ParallelImpl {
  map;
  [RequestBlockParallelTypeId] = parallelVariance;
  constructor(map7) {
    this.map = map7;
  }
}
var parallelCollectionEmpty = () => new ParallelImpl(empty9());
var parallelCollectionAdd = (self2, blockedRequest) => new ParallelImpl(modifyAt2(self2.map, blockedRequest.dataSource, (_) => orElseSome(map2(_, append2(blockedRequest.blockedRequest)), () => of2(blockedRequest.blockedRequest))));
var parallelCollectionCombine = (self2, that) => new ParallelImpl(reduce5(self2.map, that.map, (map7, value, key) => set3(map7, key, match2(get7(map7, key), {
  onNone: () => value,
  onSome: (other) => appendAll2(value, other)
}))));
var parallelCollectionIsEmpty = (self2) => isEmpty3(self2.map);
var parallelCollectionKeys = (self2) => Array.from(keys2(self2.map));
var parallelCollectionToSequentialCollection = (self2) => sequentialCollectionMake(map6(self2.map, (x) => of2(x)));
var SequentialCollectionTypeId = Symbol.for("effect/RequestBlock/RequestBlockSequential");
var sequentialVariance = {
  _R: (_) => _
};

class SequentialImpl {
  map;
  [SequentialCollectionTypeId] = sequentialVariance;
  constructor(map7) {
    this.map = map7;
  }
}
var sequentialCollectionMake = (map7) => new SequentialImpl(map7);
var sequentialCollectionCombine = (self2, that) => new SequentialImpl(reduce5(that.map, self2.map, (map7, value, key) => set3(map7, key, match2(get7(map7, key), {
  onNone: () => empty5(),
  onSome: (a) => appendAll2(a, value)
}))));
var sequentialCollectionKeys = (self2) => Array.from(keys2(self2.map));
var sequentialCollectionToChunk = (self2) => Array.from(self2.map);

// node_modules/effect/dist/esm/internal/opCodes/cause.js
var OP_DIE = "Die";
var OP_EMPTY = "Empty";
var OP_FAIL = "Fail";
var OP_INTERRUPT = "Interrupt";
var OP_PARALLEL = "Parallel";
var OP_SEQUENTIAL = "Sequential";

// node_modules/effect/dist/esm/internal/cause.js
var CauseSymbolKey = "effect/Cause";
var CauseTypeId = Symbol.for(CauseSymbolKey);
var variance7 = {
  _E: (_) => _
};
var proto = {
  [CauseTypeId]: variance7,
  [symbol]() {
    return pipe(hash3(CauseSymbolKey), combine(hash3(flattenCause(this))), cached(this));
  },
  [symbol2](that) {
    return isCause(that) && causeEquals(this, that);
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
  toJSON() {
    switch (this._tag) {
      case "Empty":
        return {
          _id: "Cause",
          _tag: this._tag
        };
      case "Die":
        return {
          _id: "Cause",
          _tag: this._tag,
          defect: toJSON(this.defect)
        };
      case "Interrupt":
        return {
          _id: "Cause",
          _tag: this._tag,
          fiberId: this.fiberId.toJSON()
        };
      case "Fail":
        return {
          _id: "Cause",
          _tag: this._tag,
          failure: toJSON(this.error)
        };
      case "Sequential":
      case "Parallel":
        return {
          _id: "Cause",
          _tag: this._tag,
          left: toJSON(this.left),
          right: toJSON(this.right)
        };
    }
  },
  toString() {
    return pretty(this);
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var empty20 = (() => {
  const o = Object.create(proto);
  o._tag = OP_EMPTY;
  return o;
})();
var fail = (error) => {
  const o = Object.create(proto);
  o._tag = OP_FAIL;
  o.error = error;
  return o;
};
var die = (defect) => {
  const o = Object.create(proto);
  o._tag = OP_DIE;
  o.defect = defect;
  return o;
};
var interrupt = (fiberId) => {
  const o = Object.create(proto);
  o._tag = OP_INTERRUPT;
  o.fiberId = fiberId;
  return o;
};
var parallel = (left3, right3) => {
  const o = Object.create(proto);
  o._tag = OP_PARALLEL;
  o.left = left3;
  o.right = right3;
  return o;
};
var sequential = (left3, right3) => {
  const o = Object.create(proto);
  o._tag = OP_SEQUENTIAL;
  o.left = left3;
  o.right = right3;
  return o;
};
var isCause = (u) => hasProperty(u, CauseTypeId);
var isDieType = (self2) => self2._tag === OP_DIE;
var isEmpty5 = (self2) => {
  if (self2._tag === OP_EMPTY) {
    return true;
  }
  return reduce7(self2, true, (acc, cause) => {
    switch (cause._tag) {
      case OP_EMPTY: {
        return some2(acc);
      }
      case OP_DIE:
      case OP_FAIL:
      case OP_INTERRUPT: {
        return some2(false);
      }
      default: {
        return none2();
      }
    }
  });
};
var isInterrupted = (self2) => isSome2(interruptOption(self2));
var isInterruptedOnly = (self2) => reduceWithContext(undefined, IsInterruptedOnlyCauseReducer)(self2);
var failures = (self2) => reverse2(reduce7(self2, empty5(), (list, cause) => cause._tag === OP_FAIL ? some2(pipe(list, prepend2(cause.error))) : none2()));
var defects = (self2) => reverse2(reduce7(self2, empty5(), (list, cause) => cause._tag === OP_DIE ? some2(pipe(list, prepend2(cause.defect))) : none2()));
var interruptors = (self2) => reduce7(self2, empty8(), (set4, cause) => cause._tag === OP_INTERRUPT ? some2(pipe(set4, add4(cause.fiberId))) : none2());
var failureOption = (self2) => find(self2, (cause) => cause._tag === OP_FAIL ? some2(cause.error) : none2());
var failureOrCause = (self2) => {
  const option = failureOption(self2);
  switch (option._tag) {
    case "None": {
      return right2(self2);
    }
    case "Some": {
      return left2(option.value);
    }
  }
};
var interruptOption = (self2) => find(self2, (cause) => cause._tag === OP_INTERRUPT ? some2(cause.fiberId) : none2());
var keepDefects = (self2) => match4(self2, {
  onEmpty: none2(),
  onFail: () => none2(),
  onDie: (defect) => some2(die(defect)),
  onInterrupt: () => none2(),
  onSequential: (left3, right3) => {
    if (isSome2(left3) && isSome2(right3)) {
      return some2(sequential(left3.value, right3.value));
    }
    if (isSome2(left3) && isNone2(right3)) {
      return some2(left3.value);
    }
    if (isNone2(left3) && isSome2(right3)) {
      return some2(right3.value);
    }
    return none2();
  },
  onParallel: (left3, right3) => {
    if (isSome2(left3) && isSome2(right3)) {
      return some2(parallel(left3.value, right3.value));
    }
    if (isSome2(left3) && isNone2(right3)) {
      return some2(left3.value);
    }
    if (isNone2(left3) && isSome2(right3)) {
      return some2(right3.value);
    }
    return none2();
  }
});
var keepDefectsAndElectFailures = (self2) => match4(self2, {
  onEmpty: none2(),
  onFail: (failure) => some2(die(failure)),
  onDie: (defect) => some2(die(defect)),
  onInterrupt: () => none2(),
  onSequential: (left3, right3) => {
    if (isSome2(left3) && isSome2(right3)) {
      return some2(sequential(left3.value, right3.value));
    }
    if (isSome2(left3) && isNone2(right3)) {
      return some2(left3.value);
    }
    if (isNone2(left3) && isSome2(right3)) {
      return some2(right3.value);
    }
    return none2();
  },
  onParallel: (left3, right3) => {
    if (isSome2(left3) && isSome2(right3)) {
      return some2(parallel(left3.value, right3.value));
    }
    if (isSome2(left3) && isNone2(right3)) {
      return some2(left3.value);
    }
    if (isNone2(left3) && isSome2(right3)) {
      return some2(right3.value);
    }
    return none2();
  }
});
var stripFailures = (self2) => match4(self2, {
  onEmpty: empty20,
  onFail: () => empty20,
  onDie: (defect) => die(defect),
  onInterrupt: (fiberId) => interrupt(fiberId),
  onSequential: sequential,
  onParallel: parallel
});
var electFailures = (self2) => match4(self2, {
  onEmpty: empty20,
  onFail: (failure) => die(failure),
  onDie: (defect) => die(defect),
  onInterrupt: (fiberId) => interrupt(fiberId),
  onSequential: (left3, right3) => sequential(left3, right3),
  onParallel: (left3, right3) => parallel(left3, right3)
});
var flatMap6 = dual(2, (self2, f) => match4(self2, {
  onEmpty: empty20,
  onFail: (error) => f(error),
  onDie: (defect) => die(defect),
  onInterrupt: (fiberId) => interrupt(fiberId),
  onSequential: (left3, right3) => sequential(left3, right3),
  onParallel: (left3, right3) => parallel(left3, right3)
}));
var flatten3 = (self2) => flatMap6(self2, identity);
var causeEquals = (left3, right3) => {
  let leftStack = of2(left3);
  let rightStack = of2(right3);
  while (isNonEmpty(leftStack) && isNonEmpty(rightStack)) {
    const [leftParallel, leftSequential] = pipe(headNonEmpty2(leftStack), reduce7([empty8(), empty5()], ([parallel2, sequential2], cause) => {
      const [par2, seq2] = evaluateCause(cause);
      return some2([pipe(parallel2, union3(par2)), pipe(sequential2, appendAll2(seq2))]);
    }));
    const [rightParallel, rightSequential] = pipe(headNonEmpty2(rightStack), reduce7([empty8(), empty5()], ([parallel2, sequential2], cause) => {
      const [par2, seq2] = evaluateCause(cause);
      return some2([pipe(parallel2, union3(par2)), pipe(sequential2, appendAll2(seq2))]);
    }));
    if (!equals(leftParallel, rightParallel)) {
      return false;
    }
    leftStack = leftSequential;
    rightStack = rightSequential;
  }
  return true;
};
var flattenCause = (cause) => {
  return flattenCauseLoop(of2(cause), empty5());
};
var flattenCauseLoop = (causes, flattened) => {
  while (true) {
    const [parallel2, sequential2] = pipe(causes, reduce([empty8(), empty5()], ([parallel3, sequential3], cause) => {
      const [par2, seq2] = evaluateCause(cause);
      return [pipe(parallel3, union3(par2)), pipe(sequential3, appendAll2(seq2))];
    }));
    const updated = size14(parallel2) > 0 ? pipe(flattened, prepend2(parallel2)) : flattened;
    if (isEmpty(sequential2)) {
      return reverse2(updated);
    }
    causes = sequential2;
    flattened = updated;
  }
  throw new Error(getBugErrorMessage("Cause.flattenCauseLoop"));
};
var find = dual(2, (self2, pf) => {
  const stack = [self2];
  while (stack.length > 0) {
    const item = stack.pop();
    const option = pf(item);
    switch (option._tag) {
      case "None": {
        switch (item._tag) {
          case OP_SEQUENTIAL:
          case OP_PARALLEL: {
            stack.push(item.right);
            stack.push(item.left);
            break;
          }
        }
        break;
      }
      case "Some": {
        return option;
      }
    }
  }
  return none2();
});
var evaluateCause = (self2) => {
  let cause = self2;
  const stack = [];
  let _parallel = empty8();
  let _sequential = empty5();
  while (cause !== undefined) {
    switch (cause._tag) {
      case OP_EMPTY: {
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_FAIL: {
        _parallel = add4(_parallel, make7(cause._tag, cause.error));
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_DIE: {
        _parallel = add4(_parallel, make7(cause._tag, cause.defect));
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_INTERRUPT: {
        _parallel = add4(_parallel, make7(cause._tag, cause.fiberId));
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_SEQUENTIAL: {
        switch (cause.left._tag) {
          case OP_EMPTY: {
            cause = cause.right;
            break;
          }
          case OP_SEQUENTIAL: {
            cause = sequential(cause.left.left, sequential(cause.left.right, cause.right));
            break;
          }
          case OP_PARALLEL: {
            cause = parallel(sequential(cause.left.left, cause.right), sequential(cause.left.right, cause.right));
            break;
          }
          default: {
            _sequential = prepend2(_sequential, cause.right);
            cause = cause.left;
            break;
          }
        }
        break;
      }
      case OP_PARALLEL: {
        stack.push(cause.right);
        cause = cause.left;
        break;
      }
    }
  }
  throw new Error(getBugErrorMessage("Cause.evaluateCauseLoop"));
};
var IsInterruptedOnlyCauseReducer = {
  emptyCase: constTrue,
  failCase: constFalse,
  dieCase: constFalse,
  interruptCase: constTrue,
  sequentialCase: (_, left3, right3) => left3 && right3,
  parallelCase: (_, left3, right3) => left3 && right3
};
var OP_SEQUENTIAL_CASE = "SequentialCase";
var OP_PARALLEL_CASE = "ParallelCase";
var match4 = dual(2, (self2, {
  onDie,
  onEmpty,
  onFail,
  onInterrupt,
  onParallel,
  onSequential
}) => {
  return reduceWithContext(self2, undefined, {
    emptyCase: () => onEmpty,
    failCase: (_, error) => onFail(error),
    dieCase: (_, defect) => onDie(defect),
    interruptCase: (_, fiberId) => onInterrupt(fiberId),
    sequentialCase: (_, left3, right3) => onSequential(left3, right3),
    parallelCase: (_, left3, right3) => onParallel(left3, right3)
  });
});
var reduce7 = dual(3, (self2, zero3, pf) => {
  let accumulator = zero3;
  let cause = self2;
  const causes = [];
  while (cause !== undefined) {
    const option = pf(accumulator, cause);
    accumulator = isSome2(option) ? option.value : accumulator;
    switch (cause._tag) {
      case OP_SEQUENTIAL: {
        causes.push(cause.right);
        cause = cause.left;
        break;
      }
      case OP_PARALLEL: {
        causes.push(cause.right);
        cause = cause.left;
        break;
      }
      default: {
        cause = undefined;
        break;
      }
    }
    if (cause === undefined && causes.length > 0) {
      cause = causes.pop();
    }
  }
  return accumulator;
});
var reduceWithContext = dual(3, (self2, context2, reducer) => {
  const input = [self2];
  const output2 = [];
  while (input.length > 0) {
    const cause = input.pop();
    switch (cause._tag) {
      case OP_EMPTY: {
        output2.push(right2(reducer.emptyCase(context2)));
        break;
      }
      case OP_FAIL: {
        output2.push(right2(reducer.failCase(context2, cause.error)));
        break;
      }
      case OP_DIE: {
        output2.push(right2(reducer.dieCase(context2, cause.defect)));
        break;
      }
      case OP_INTERRUPT: {
        output2.push(right2(reducer.interruptCase(context2, cause.fiberId)));
        break;
      }
      case OP_SEQUENTIAL: {
        input.push(cause.right);
        input.push(cause.left);
        output2.push(left2({
          _tag: OP_SEQUENTIAL_CASE
        }));
        break;
      }
      case OP_PARALLEL: {
        input.push(cause.right);
        input.push(cause.left);
        output2.push(left2({
          _tag: OP_PARALLEL_CASE
        }));
        break;
      }
    }
  }
  const accumulator = [];
  while (output2.length > 0) {
    const either2 = output2.pop();
    switch (either2._tag) {
      case "Left": {
        switch (either2.left._tag) {
          case OP_SEQUENTIAL_CASE: {
            const left3 = accumulator.pop();
            const right3 = accumulator.pop();
            const value = reducer.sequentialCase(context2, left3, right3);
            accumulator.push(value);
            break;
          }
          case OP_PARALLEL_CASE: {
            const left3 = accumulator.pop();
            const right3 = accumulator.pop();
            const value = reducer.parallelCase(context2, left3, right3);
            accumulator.push(value);
            break;
          }
        }
        break;
      }
      case "Right": {
        accumulator.push(either2.right);
        break;
      }
    }
  }
  if (accumulator.length === 0) {
    throw new Error("BUG: Cause.reduceWithContext - please report an issue at https://github.com/Effect-TS/effect/issues");
  }
  return accumulator.pop();
});
var pretty = (cause, options) => {
  if (isInterruptedOnly(cause)) {
    return "All fibers interrupted without errors.";
  }
  return prettyErrors(cause).map(function(e) {
    if (options?.renderErrorCause !== true || e.cause === undefined) {
      return e.stack;
    }
    return `${e.stack} {\n${renderErrorCause(e.cause, "  ")}\n}`;
  }).join("\n");
};
var renderErrorCause = (cause, prefix) => {
  const lines = cause.stack.split("\n");
  let stack = `${prefix}[cause]: ${lines[0]}`;
  for (let i = 1, len = lines.length;i < len; i++) {
    stack += `\n${prefix}${lines[i]}`;
  }
  if (cause.cause) {
    stack += ` {\n${renderErrorCause(cause.cause, `${prefix}  `)}\n${prefix}}`;
  }
  return stack;
};

class PrettyError extends globalThis.Error {
  span = undefined;
  constructor(originalError) {
    const originalErrorIsObject = typeof originalError === "object" && originalError !== null;
    const prevLimit = Error.stackTraceLimit;
    Error.stackTraceLimit = 1;
    super(prettyErrorMessage(originalError), originalErrorIsObject && "cause" in originalError && typeof originalError.cause !== "undefined" ? {
      cause: new PrettyError(originalError.cause)
    } : undefined);
    if (this.message === "") {
      this.message = "An error has occurred";
    }
    Error.stackTraceLimit = prevLimit;
    this.name = originalError instanceof Error ? originalError.name : "Error";
    if (originalErrorIsObject) {
      if (spanSymbol in originalError) {
        this.span = originalError[spanSymbol];
      }
      Object.keys(originalError).forEach((key) => {
        if (!(key in this)) {
          this[key] = originalError[key];
        }
      });
    }
    this.stack = prettyErrorStack(`${this.name}: ${this.message}`, originalError instanceof Error && originalError.stack ? originalError.stack : "", this.span);
  }
}
var prettyErrorMessage = (u) => {
  if (typeof u === "string") {
    return u;
  }
  if (typeof u === "object" && u !== null && u instanceof Error) {
    return u.message;
  }
  try {
    if (hasProperty(u, "toString") && isFunction2(u["toString"]) && u["toString"] !== Object.prototype.toString && u["toString"] !== globalThis.Array.prototype.toString) {
      return u["toString"]();
    }
  } catch {
  }
  return JSON.stringify(u);
};
var locationRegex = /\((.*)\)/;
var spanToTrace = globalValue("effect/Tracer/spanToTrace", () => new WeakMap);
var prettyErrorStack = (message, stack, span2) => {
  const out = [message];
  const lines = stack.startsWith(message) ? stack.slice(message.length).split("\n") : stack.split("\n");
  for (let i = 1;i < lines.length; i++) {
    if (lines[i].includes("Generator.next")) {
      break;
    }
    if (lines[i].includes("effect_internal_function")) {
      out.pop();
      break;
    }
    out.push(lines[i].replace(/at .*effect_instruction_i.*\((.*)\)/, "at $1").replace(/EffectPrimitive\.\w+/, "<anonymous>"));
  }
  if (span2) {
    let current = span2;
    let i = 0;
    while (current && current._tag === "Span" && i < 10) {
      const stackFn = spanToTrace.get(current);
      if (typeof stackFn === "function") {
        const stack2 = stackFn();
        if (typeof stack2 === "string") {
          const locationMatch = stack2.match(locationRegex);
          const location = locationMatch ? locationMatch[1] : stack2.replace(/^at /, "");
          out.push(`    at ${current.name} (${location})`);
        } else {
          out.push(`    at ${current.name}`);
        }
      } else {
        out.push(`    at ${current.name}`);
      }
      current = getOrUndefined(current.parent);
      i++;
    }
  }
  return out.join("\n");
};
var spanSymbol = Symbol.for("effect/SpanAnnotation");
var prettyErrors = (cause) => reduceWithContext(cause, undefined, {
  emptyCase: () => [],
  dieCase: (_, unknownError) => {
    return [new PrettyError(unknownError)];
  },
  failCase: (_, error) => {
    return [new PrettyError(error)];
  },
  interruptCase: () => [],
  parallelCase: (_, l, r) => [...l, ...r],
  sequentialCase: (_, l, r) => [...l, ...r]
});

// node_modules/effect/dist/esm/internal/opCodes/deferred.js
var OP_STATE_PENDING = "Pending";
var OP_STATE_DONE = "Done";

// node_modules/effect/dist/esm/internal/deferred.js
var DeferredSymbolKey = "effect/Deferred";
var DeferredTypeId = Symbol.for(DeferredSymbolKey);
var deferredVariance = {
  _E: (_) => _,
  _A: (_) => _
};
var pending = (joiners) => {
  return {
    _tag: OP_STATE_PENDING,
    joiners
  };
};
var done = (effect) => {
  return {
    _tag: OP_STATE_DONE,
    effect
  };
};

// node_modules/effect/dist/esm/internal/singleShotGen.js
class SingleShotGen2 {
  self;
  called = false;
  constructor(self2) {
    this.self = self2;
  }
  next(a) {
    return this.called ? {
      value: a,
      done: true
    } : (this.called = true, {
      value: this.self,
      done: false
    });
  }
  return(a) {
    return {
      value: a,
      done: true
    };
  }
  throw(e) {
    throw e;
  }
  [Symbol.iterator]() {
    return new SingleShotGen2(this.self);
  }
}

// node_modules/effect/dist/esm/internal/tracer.js
var TracerTypeId = Symbol.for("effect/Tracer");
var make19 = (options) => ({
  [TracerTypeId]: TracerTypeId,
  ...options
});
var tracerTag = GenericTag("effect/Tracer");
var spanTag = GenericTag("effect/ParentSpan");
var randomHexString = function() {
  const characters = "abcdef0123456789";
  const charactersLength = characters.length;
  return function(length) {
    let result = "";
    for (let i = 0;i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
}();

class NativeSpan {
  name;
  parent;
  context;
  links;
  startTime;
  kind;
  _tag = "Span";
  spanId;
  traceId = "native";
  sampled = true;
  status;
  attributes;
  events = [];
  constructor(name, parent, context2, links, startTime, kind) {
    this.name = name;
    this.parent = parent;
    this.context = context2;
    this.links = links;
    this.startTime = startTime;
    this.kind = kind;
    this.status = {
      _tag: "Started",
      startTime
    };
    this.attributes = new Map;
    this.traceId = parent._tag === "Some" ? parent.value.traceId : randomHexString(32);
    this.spanId = randomHexString(16);
  }
  end(endTime, exit) {
    this.status = {
      _tag: "Ended",
      endTime,
      exit,
      startTime: this.status.startTime
    };
  }
  attribute(key, value) {
    this.attributes.set(key, value);
  }
  event(name, startTime, attributes) {
    this.events.push([name, startTime, attributes ?? {}]);
  }
}
var nativeTracer = make19({
  span: (name, parent, context2, links, startTime, kind) => new NativeSpan(name, parent, context2, links, startTime, kind),
  context: (f) => f()
});
var addSpanStackTrace = (options) => {
  if (options?.captureStackTrace === false) {
    return options;
  } else if (options?.captureStackTrace !== undefined && typeof options.captureStackTrace !== "boolean") {
    return options;
  }
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 3;
  const traceError = new Error;
  Error.stackTraceLimit = limit;
  let cache2 = false;
  return {
    ...options,
    captureStackTrace: () => {
      if (cache2 !== false) {
        return cache2;
      }
      if (traceError.stack !== undefined) {
        const stack = traceError.stack.split("\n");
        if (stack[3] !== undefined) {
          cache2 = stack[3].trim();
          return cache2;
        }
      }
    }
  };
};

// node_modules/effect/dist/esm/internal/core.js
var EffectErrorSymbolKey = "effect/EffectError";
var EffectErrorTypeId = Symbol.for(EffectErrorSymbolKey);
var isEffectError = (u) => hasProperty(u, EffectErrorTypeId);
var makeEffectError = (cause) => ({
  [EffectErrorTypeId]: EffectErrorTypeId,
  _tag: "EffectError",
  cause
});
var blocked = (blockedRequests, _continue) => {
  const effect = new EffectPrimitive("Blocked");
  effect.effect_instruction_i0 = blockedRequests;
  effect.effect_instruction_i1 = _continue;
  return effect;
};
var runRequestBlock = (blockedRequests) => {
  const effect = new EffectPrimitive("RunBlocked");
  effect.effect_instruction_i0 = blockedRequests;
  return effect;
};
var EffectTypeId2 = Symbol.for("effect/Effect");

class RevertFlags {
  patch;
  op;
  _op = OP_REVERT_FLAGS;
  constructor(patch8, op) {
    this.patch = patch8;
    this.op = op;
  }
}

class EffectPrimitive {
  _op;
  effect_instruction_i0 = undefined;
  effect_instruction_i1 = undefined;
  effect_instruction_i2 = undefined;
  trace = undefined;
  [EffectTypeId2] = effectVariance;
  constructor(_op) {
    this._op = _op;
  }
  [symbol2](that) {
    return this === that;
  }
  [symbol]() {
    return cached(this, random(this));
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toJSON() {
    return {
      _id: "Effect",
      _op: this._op,
      effect_instruction_i0: toJSON(this.effect_instruction_i0),
      effect_instruction_i1: toJSON(this.effect_instruction_i1),
      effect_instruction_i2: toJSON(this.effect_instruction_i2)
    };
  }
  toString() {
    return format(this.toJSON());
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new SingleShotGen2(new YieldWrap(this));
  }
}

class EffectPrimitiveFailure {
  _op;
  effect_instruction_i0 = undefined;
  effect_instruction_i1 = undefined;
  effect_instruction_i2 = undefined;
  trace = undefined;
  [EffectTypeId2] = effectVariance;
  constructor(_op) {
    this._op = _op;
    this._tag = _op;
  }
  [symbol2](that) {
    return exitIsExit(that) && that._op === "Failure" && equals(this.effect_instruction_i0, that.effect_instruction_i0);
  }
  [symbol]() {
    return pipe(string(this._tag), combine(hash3(this.effect_instruction_i0)), cached(this));
  }
  get cause() {
    return this.effect_instruction_i0;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toJSON() {
    return {
      _id: "Exit",
      _tag: this._op,
      cause: this.cause.toJSON()
    };
  }
  toString() {
    return format(this.toJSON());
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new SingleShotGen2(new YieldWrap(this));
  }
}

class EffectPrimitiveSuccess {
  _op;
  effect_instruction_i0 = undefined;
  effect_instruction_i1 = undefined;
  effect_instruction_i2 = undefined;
  trace = undefined;
  [EffectTypeId2] = effectVariance;
  constructor(_op) {
    this._op = _op;
    this._tag = _op;
  }
  [symbol2](that) {
    return exitIsExit(that) && that._op === "Success" && equals(this.effect_instruction_i0, that.effect_instruction_i0);
  }
  [symbol]() {
    return pipe(string(this._tag), combine(hash3(this.effect_instruction_i0)), cached(this));
  }
  get value() {
    return this.effect_instruction_i0;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toJSON() {
    return {
      _id: "Exit",
      _tag: this._op,
      value: toJSON(this.value)
    };
  }
  toString() {
    return format(this.toJSON());
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new SingleShotGen2(new YieldWrap(this));
  }
}
var isEffect = (u) => hasProperty(u, EffectTypeId2);
var withFiberRuntime = (withRuntime) => {
  const effect = new EffectPrimitive(OP_WITH_RUNTIME);
  effect.effect_instruction_i0 = withRuntime;
  return effect;
};
var acquireUseRelease = dual(3, (acquire, use, release) => uninterruptibleMask((restore) => flatMap7(acquire, (a) => flatMap7(exit(suspend(() => restore(use(a)))), (exit) => {
  return suspend(() => release(a, exit)).pipe(matchCauseEffect({
    onFailure: (cause) => {
      switch (exit._tag) {
        case OP_FAILURE:
          return failCause(parallel(exit.effect_instruction_i0, cause));
        case OP_SUCCESS:
          return failCause(cause);
      }
    },
    onSuccess: () => exit
  }));
}))));
var as = dual(2, (self2, value) => flatMap7(self2, () => succeed(value)));
var asVoid = (self2) => as(self2, undefined);
var custom = function() {
  const wrapper = new EffectPrimitive(OP_COMMIT);
  switch (arguments.length) {
    case 2: {
      wrapper.effect_instruction_i0 = arguments[0];
      wrapper.commit = arguments[1];
      break;
    }
    case 3: {
      wrapper.effect_instruction_i0 = arguments[0];
      wrapper.effect_instruction_i1 = arguments[1];
      wrapper.commit = arguments[2];
      break;
    }
    case 4: {
      wrapper.effect_instruction_i0 = arguments[0];
      wrapper.effect_instruction_i1 = arguments[1];
      wrapper.effect_instruction_i2 = arguments[2];
      wrapper.commit = arguments[3];
      break;
    }
    default: {
      throw new Error(getBugErrorMessage("you're not supposed to end up here"));
    }
  }
  return wrapper;
};
var unsafeAsync = (register, blockingOn = none4) => {
  const effect = new EffectPrimitive(OP_ASYNC);
  let cancelerRef = undefined;
  effect.effect_instruction_i0 = (resume) => {
    cancelerRef = register(resume);
  };
  effect.effect_instruction_i1 = blockingOn;
  return cancelerRef !== undefined ? onInterrupt(effect, (_) => cancelerRef) : effect;
};
var async = (register, blockingOn = none4) => {
  return custom(register, function() {
    let backingResume = undefined;
    let pendingEffect = undefined;
    function proxyResume(effect2) {
      if (backingResume) {
        backingResume(effect2);
      } else if (pendingEffect === undefined) {
        pendingEffect = effect2;
      }
    }
    const effect = new EffectPrimitive(OP_ASYNC);
    effect.effect_instruction_i0 = (resume) => {
      backingResume = resume;
      if (pendingEffect) {
        resume(pendingEffect);
      }
    };
    effect.effect_instruction_i1 = blockingOn;
    let cancelerRef = undefined;
    let controllerRef = undefined;
    if (this.effect_instruction_i0.length !== 1) {
      controllerRef = new AbortController;
      cancelerRef = internalCall(() => this.effect_instruction_i0(proxyResume, controllerRef.signal));
    } else {
      cancelerRef = internalCall(() => this.effect_instruction_i0(proxyResume));
    }
    return cancelerRef || controllerRef ? onInterrupt(effect, (_) => {
      if (controllerRef) {
        controllerRef.abort();
      }
      return cancelerRef ?? void_;
    }) : effect;
  });
};
var catchAllCause = dual(2, (self2, f) => {
  const effect = new EffectPrimitive(OP_ON_FAILURE);
  effect.effect_instruction_i0 = self2;
  effect.effect_instruction_i1 = f;
  return effect;
});
var catchAll = dual(2, (self2, f) => matchEffect(self2, {
  onFailure: f,
  onSuccess: succeed
}));
var catchIf = dual(3, (self2, predicate, f) => catchAllCause(self2, (cause) => {
  const either2 = failureOrCause(cause);
  switch (either2._tag) {
    case "Left":
      return predicate(either2.left) ? f(either2.left) : failCause(cause);
    case "Right":
      return failCause(either2.right);
  }
}));
var catchSome = dual(2, (self2, pf) => catchAllCause(self2, (cause) => {
  const either2 = failureOrCause(cause);
  switch (either2._tag) {
    case "Left":
      return pipe(pf(either2.left), getOrElse(() => failCause(cause)));
    case "Right":
      return failCause(either2.right);
  }
}));
var checkInterruptible = (f) => withFiberRuntime((_, status) => f(interruption(status.runtimeFlags)));
var spanSymbol2 = Symbol.for("effect/SpanAnnotation");
var originalSymbol = Symbol.for("effect/OriginalAnnotation");
var capture = (obj, span2) => {
  if (isSome2(span2)) {
    return new Proxy(obj, {
      has(target, p) {
        return p === spanSymbol2 || p === originalSymbol || p in target;
      },
      get(target, p) {
        if (p === spanSymbol2) {
          return span2.value;
        }
        if (p === originalSymbol) {
          return obj;
        }
        return target[p];
      }
    });
  }
  return obj;
};
var die2 = (defect) => isObject(defect) && !(spanSymbol2 in defect) ? withFiberRuntime((fiber) => failCause(die(capture(defect, currentSpanFromFiber(fiber))))) : failCause(die(defect));
var dieMessage = (message) => failCauseSync(() => die(new RuntimeException(message)));
var dieSync = (evaluate) => flatMap7(sync(evaluate), die2);
var either2 = (self2) => matchEffect(self2, {
  onFailure: (e) => succeed(left2(e)),
  onSuccess: (a) => succeed(right2(a))
});
var exit = (self2) => matchCause(self2, {
  onFailure: exitFailCause,
  onSuccess: exitSucceed
});
var fail2 = (error) => isObject(error) && !(spanSymbol2 in error) ? withFiberRuntime((fiber) => failCause(fail(capture(error, currentSpanFromFiber(fiber))))) : failCause(fail(error));
var failSync = (evaluate) => flatMap7(sync(evaluate), fail2);
var failCause = (cause) => {
  const effect = new EffectPrimitiveFailure(OP_FAILURE);
  effect.effect_instruction_i0 = cause;
  return effect;
};
var failCauseSync = (evaluate) => flatMap7(sync(evaluate), failCause);
var fiberId = withFiberRuntime((state) => succeed(state.id()));
var fiberIdWith = (f) => withFiberRuntime((state) => f(state.id()));
var flatMap7 = dual(2, (self2, f) => {
  const effect = new EffectPrimitive(OP_ON_SUCCESS);
  effect.effect_instruction_i0 = self2;
  effect.effect_instruction_i1 = f;
  return effect;
});
var andThen2 = dual(2, (self2, f) => flatMap7(self2, (a) => {
  const b = typeof f === "function" ? f(a) : f;
  if (isEffect(b)) {
    return b;
  } else if (isPromiseLike(b)) {
    return async((resume) => {
      b.then((a2) => resume(succeed(a2)), (e) => resume(fail2(new UnknownException(e))));
    });
  }
  return succeed(b);
}));
var step2 = (self2) => {
  const effect = new EffectPrimitive("OnStep");
  effect.effect_instruction_i0 = self2;
  return effect;
};
var flatten4 = (self2) => flatMap7(self2, identity);
var flip = (self2) => matchEffect(self2, {
  onFailure: succeed,
  onSuccess: fail2
});
var matchCause = dual(2, (self2, options) => matchCauseEffect(self2, {
  onFailure: (cause) => succeed(options.onFailure(cause)),
  onSuccess: (a) => succeed(options.onSuccess(a))
}));
var matchCauseEffect = dual(2, (self2, options) => {
  const effect = new EffectPrimitive(OP_ON_SUCCESS_AND_FAILURE);
  effect.effect_instruction_i0 = self2;
  effect.effect_instruction_i1 = options.onFailure;
  effect.effect_instruction_i2 = options.onSuccess;
  return effect;
});
var matchEffect = dual(2, (self2, options) => matchCauseEffect(self2, {
  onFailure: (cause) => {
    const defects2 = defects(cause);
    if (defects2.length > 0) {
      return failCause(electFailures(cause));
    }
    const failures2 = failures(cause);
    if (failures2.length > 0) {
      return options.onFailure(unsafeHead2(failures2));
    }
    return failCause(cause);
  },
  onSuccess: options.onSuccess
}));
var forEachSequential = dual(2, (self2, f) => suspend(() => {
  const arr = fromIterable(self2);
  const ret = allocate(arr.length);
  let i = 0;
  return as(whileLoop({
    while: () => i < arr.length,
    body: () => f(arr[i], i),
    step: (b) => {
      ret[i++] = b;
    }
  }), ret);
}));
var forEachSequentialDiscard = dual(2, (self2, f) => suspend(() => {
  const arr = fromIterable(self2);
  let i = 0;
  return whileLoop({
    while: () => i < arr.length,
    body: () => f(arr[i], i),
    step: () => {
      i++;
    }
  });
}));
var if_ = dual((args) => typeof args[0] === "boolean" || isEffect(args[0]), (self2, options) => isEffect(self2) ? flatMap7(self2, (b) => b ? options.onTrue() : options.onFalse()) : self2 ? options.onTrue() : options.onFalse());
var interrupt2 = flatMap7(fiberId, (fiberId2) => interruptWith(fiberId2));
var interruptWith = (fiberId2) => failCause(interrupt(fiberId2));
var interruptible2 = (self2) => {
  const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect.effect_instruction_i0 = enable3(Interruption);
  effect.effect_instruction_i1 = () => self2;
  return effect;
};
var interruptibleMask = (f) => custom(f, function() {
  const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect.effect_instruction_i0 = enable3(Interruption);
  effect.effect_instruction_i1 = (oldFlags) => interruption(oldFlags) ? internalCall(() => this.effect_instruction_i0(interruptible2)) : internalCall(() => this.effect_instruction_i0(uninterruptible));
  return effect;
});
var intoDeferred = dual(2, (self2, deferred) => uninterruptibleMask((restore) => flatMap7(exit(restore(self2)), (exit2) => deferredDone(deferred, exit2))));
var map9 = dual(2, (self2, f) => flatMap7(self2, (a) => sync(() => f(a))));
var mapBoth = dual(2, (self2, options) => matchEffect(self2, {
  onFailure: (e) => failSync(() => options.onFailure(e)),
  onSuccess: (a) => sync(() => options.onSuccess(a))
}));
var mapError = dual(2, (self2, f) => matchCauseEffect(self2, {
  onFailure: (cause) => {
    const either3 = failureOrCause(cause);
    switch (either3._tag) {
      case "Left": {
        return failSync(() => f(either3.left));
      }
      case "Right": {
        return failCause(either3.right);
      }
    }
  },
  onSuccess: succeed
}));
var onError = dual(2, (self2, cleanup) => onExit(self2, (exit2) => exitIsSuccess(exit2) ? void_ : cleanup(exit2.effect_instruction_i0)));
var onExit = dual(2, (self2, cleanup) => uninterruptibleMask((restore) => matchCauseEffect(restore(self2), {
  onFailure: (cause1) => {
    const result = exitFailCause(cause1);
    return matchCauseEffect(cleanup(result), {
      onFailure: (cause2) => exitFailCause(sequential(cause1, cause2)),
      onSuccess: () => result
    });
  },
  onSuccess: (success) => {
    const result = exitSucceed(success);
    return zipRight(cleanup(result), result);
  }
})));
var onInterrupt = dual(2, (self2, cleanup) => onExit(self2, exitMatch({
  onFailure: (cause) => isInterruptedOnly(cause) ? asVoid(cleanup(interruptors(cause))) : void_,
  onSuccess: () => void_
})));
var orElse = dual(2, (self2, that) => attemptOrElse(self2, that, succeed));
var orDie = (self2) => orDieWith(self2, identity);
var orDieWith = dual(2, (self2, f) => matchEffect(self2, {
  onFailure: (e) => die2(f(e)),
  onSuccess: succeed
}));
var partitionMap2 = (elements, f) => fromIterable(elements).reduceRight(([lefts, rights], current) => {
  const either3 = f(current);
  switch (either3._tag) {
    case "Left": {
      return [[either3.left, ...lefts], rights];
    }
    case "Right": {
      return [lefts, [either3.right, ...rights]];
    }
  }
}, [empty2(), empty2()]);
var runtimeFlags = withFiberRuntime((_, status) => succeed(status.runtimeFlags));
var succeed = (value) => {
  const effect = new EffectPrimitiveSuccess(OP_SUCCESS);
  effect.effect_instruction_i0 = value;
  return effect;
};
var suspend = (effect) => flatMap7(sync(effect), identity);
var sync = (evaluate) => {
  const effect = new EffectPrimitive(OP_SYNC);
  effect.effect_instruction_i0 = evaluate;
  return effect;
};
var tap = dual((args) => args.length === 3 || args.length === 2 && !(isObject(args[1]) && ("onlyEffect" in args[1])), (self2, f) => flatMap7(self2, (a) => {
  const b = typeof f === "function" ? f(a) : f;
  if (isEffect(b)) {
    return as(b, a);
  } else if (isPromiseLike(b)) {
    return async((resume) => {
      b.then((_) => resume(succeed(a)), (e) => resume(fail2(new UnknownException(e))));
    });
  }
  return succeed(a);
}));
var transplant = (f) => withFiberRuntime((state) => {
  const scopeOverride = state.getFiberRef(currentForkScopeOverride);
  const scope = pipe(scopeOverride, getOrElse(() => state.scope()));
  return f(fiberRefLocally(currentForkScopeOverride, some2(scope)));
});
var attemptOrElse = dual(3, (self2, that, onSuccess) => matchCauseEffect(self2, {
  onFailure: (cause) => {
    const defects2 = defects(cause);
    if (defects2.length > 0) {
      return failCause(getOrThrow(keepDefectsAndElectFailures(cause)));
    }
    return that();
  },
  onSuccess
}));
var uninterruptible = (self2) => {
  const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect.effect_instruction_i0 = disable2(Interruption);
  effect.effect_instruction_i1 = () => self2;
  return effect;
};
var uninterruptibleMask = (f) => custom(f, function() {
  const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect.effect_instruction_i0 = disable2(Interruption);
  effect.effect_instruction_i1 = (oldFlags) => interruption(oldFlags) ? internalCall(() => this.effect_instruction_i0(interruptible2)) : internalCall(() => this.effect_instruction_i0(uninterruptible));
  return effect;
});
var void_ = succeed(undefined);
var updateRuntimeFlags = (patch8) => {
  const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect.effect_instruction_i0 = patch8;
  effect.effect_instruction_i1 = undefined;
  return effect;
};
var whenEffect = dual(2, (self2, condition) => flatMap7(condition, (b) => {
  if (b) {
    return pipe(self2, map9(some2));
  }
  return succeed(none2());
}));
var whileLoop = (options) => {
  const effect = new EffectPrimitive(OP_WHILE);
  effect.effect_instruction_i0 = options.while;
  effect.effect_instruction_i1 = options.body;
  effect.effect_instruction_i2 = options.step;
  return effect;
};
var withConcurrency = dual(2, (self2, concurrency) => fiberRefLocally(self2, currentConcurrency, concurrency));
var withRequestBatching = dual(2, (self2, requestBatching) => fiberRefLocally(self2, currentRequestBatching, requestBatching));
var withRuntimeFlags = dual(2, (self2, update2) => {
  const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect.effect_instruction_i0 = update2;
  effect.effect_instruction_i1 = () => self2;
  return effect;
});
var withTracerEnabled = dual(2, (effect, enabled2) => fiberRefLocally(effect, currentTracerEnabled, enabled2));
var withTracerTiming = dual(2, (effect, enabled2) => fiberRefLocally(effect, currentTracerTimingEnabled, enabled2));
var yieldNow = (options) => {
  const effect = new EffectPrimitive(OP_YIELD);
  return typeof options?.priority !== "undefined" ? withSchedulingPriority(effect, options.priority) : effect;
};
var zip2 = dual(2, (self2, that) => flatMap7(self2, (a) => map9(that, (b) => [a, b])));
var zipLeft = dual(2, (self2, that) => flatMap7(self2, (a) => as(that, a)));
var zipRight = dual(2, (self2, that) => flatMap7(self2, () => that));
var zipWith2 = dual(3, (self2, that, f) => flatMap7(self2, (a) => map9(that, (b) => f(a, b))));
var never = async(() => {
  const interval = setInterval(() => {
  }, 2 ** 31 - 1);
  return sync(() => clearInterval(interval));
});
var interruptFiber = (self2) => flatMap7(fiberId, (fiberId2) => pipe(self2, interruptAsFiber(fiberId2)));
var interruptAsFiber = dual(2, (self2, fiberId2) => flatMap7(self2.interruptAsFork(fiberId2), () => self2.await));
var logLevelAll = {
  _tag: "All",
  syslog: 0,
  label: "ALL",
  ordinal: Number.MIN_SAFE_INTEGER,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelFatal = {
  _tag: "Fatal",
  syslog: 2,
  label: "FATAL",
  ordinal: 50000,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelError = {
  _tag: "Error",
  syslog: 3,
  label: "ERROR",
  ordinal: 40000,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelWarning = {
  _tag: "Warning",
  syslog: 4,
  label: "WARN",
  ordinal: 30000,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelInfo = {
  _tag: "Info",
  syslog: 6,
  label: "INFO",
  ordinal: 20000,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelDebug = {
  _tag: "Debug",
  syslog: 7,
  label: "DEBUG",
  ordinal: 1e4,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelTrace = {
  _tag: "Trace",
  syslog: 7,
  label: "TRACE",
  ordinal: 0,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelNone = {
  _tag: "None",
  syslog: 7,
  label: "OFF",
  ordinal: Number.MAX_SAFE_INTEGER,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var FiberRefSymbolKey = "effect/FiberRef";
var FiberRefTypeId = Symbol.for(FiberRefSymbolKey);
var fiberRefVariance = {
  _A: (_) => _
};
var fiberRefGet = (self2) => fiberRefModify(self2, (a) => [a, a]);
var fiberRefGetWith = dual(2, (self2, f) => flatMap7(fiberRefGet(self2), f));
var fiberRefSet = dual(2, (self2, value) => fiberRefModify(self2, () => [undefined, value]));
var fiberRefModify = dual(2, (self2, f) => withFiberRuntime((state) => {
  const [b, a] = f(state.getFiberRef(self2));
  state.setFiberRef(self2, a);
  return succeed(b);
}));
var fiberRefLocally = dual(3, (use, self2, value) => acquireUseRelease(zipLeft(fiberRefGet(self2), fiberRefSet(self2, value)), () => use, (oldValue) => fiberRefSet(self2, oldValue)));
var fiberRefLocallyWith = dual(3, (use, self2, f) => fiberRefGetWith(self2, (a) => fiberRefLocally(use, self2, f(a))));
var fiberRefUnsafeMake = (initial, options) => fiberRefUnsafeMakePatch(initial, {
  differ: update(),
  fork: options?.fork ?? identity,
  join: options?.join
});
var fiberRefUnsafeMakeHashSet = (initial) => {
  const differ2 = hashSet2();
  return fiberRefUnsafeMakePatch(initial, {
    differ: differ2,
    fork: differ2.empty
  });
};
var fiberRefUnsafeMakeReadonlyArray = (initial) => {
  const differ2 = readonlyArray(update());
  return fiberRefUnsafeMakePatch(initial, {
    differ: differ2,
    fork: differ2.empty
  });
};
var fiberRefUnsafeMakeContext = (initial) => {
  const differ2 = environment();
  return fiberRefUnsafeMakePatch(initial, {
    differ: differ2,
    fork: differ2.empty
  });
};
var fiberRefUnsafeMakePatch = (initial, options) => ({
  [FiberRefTypeId]: fiberRefVariance,
  initial,
  diff: (oldValue, newValue) => options.differ.diff(oldValue, newValue),
  combine: (first, second) => options.differ.combine(first, second),
  patch: (patch8) => (oldValue) => options.differ.patch(patch8, oldValue),
  fork: options.fork,
  join: options.join ?? ((_, n) => n),
  pipe() {
    return pipeArguments(this, arguments);
  }
});
var fiberRefUnsafeMakeRuntimeFlags = (initial) => fiberRefUnsafeMakePatch(initial, {
  differ,
  fork: differ.empty
});
var currentContext = globalValue(Symbol.for("effect/FiberRef/currentContext"), () => fiberRefUnsafeMakeContext(empty4()));
var currentSchedulingPriority = globalValue(Symbol.for("effect/FiberRef/currentSchedulingPriority"), () => fiberRefUnsafeMake(0));
var currentMaxOpsBeforeYield = globalValue(Symbol.for("effect/FiberRef/currentMaxOpsBeforeYield"), () => fiberRefUnsafeMake(2048));
var currentLogAnnotations = globalValue(Symbol.for("effect/FiberRef/currentLogAnnotation"), () => fiberRefUnsafeMake(empty9()));
var currentLogLevel = globalValue(Symbol.for("effect/FiberRef/currentLogLevel"), () => fiberRefUnsafeMake(logLevelInfo));
var currentLogSpan = globalValue(Symbol.for("effect/FiberRef/currentLogSpan"), () => fiberRefUnsafeMake(empty10()));
var withSchedulingPriority = dual(2, (self2, scheduler) => fiberRefLocally(self2, currentSchedulingPriority, scheduler));
var withMaxOpsBeforeYield = dual(2, (self2, scheduler) => fiberRefLocally(self2, currentMaxOpsBeforeYield, scheduler));
var currentConcurrency = globalValue(Symbol.for("effect/FiberRef/currentConcurrency"), () => fiberRefUnsafeMake("unbounded"));
var currentRequestBatching = globalValue(Symbol.for("effect/FiberRef/currentRequestBatching"), () => fiberRefUnsafeMake(true));
var currentUnhandledErrorLogLevel = globalValue(Symbol.for("effect/FiberRef/currentUnhandledErrorLogLevel"), () => fiberRefUnsafeMake(some2(logLevelDebug)));
var withUnhandledErrorLogLevel = dual(2, (self2, level) => fiberRefLocally(self2, currentUnhandledErrorLogLevel, level));
var currentMetricLabels = globalValue(Symbol.for("effect/FiberRef/currentMetricLabels"), () => fiberRefUnsafeMakeReadonlyArray(empty2()));
var metricLabels = fiberRefGet(currentMetricLabels);
var currentForkScopeOverride = globalValue(Symbol.for("effect/FiberRef/currentForkScopeOverride"), () => fiberRefUnsafeMake(none2(), {
  fork: () => none2(),
  join: (parent, _) => parent
}));
var currentInterruptedCause = globalValue(Symbol.for("effect/FiberRef/currentInterruptedCause"), () => fiberRefUnsafeMake(empty20, {
  fork: () => empty20,
  join: (parent, _) => parent
}));
var currentTracerEnabled = globalValue(Symbol.for("effect/FiberRef/currentTracerEnabled"), () => fiberRefUnsafeMake(true));
var currentTracerTimingEnabled = globalValue(Symbol.for("effect/FiberRef/currentTracerTiming"), () => fiberRefUnsafeMake(true));
var currentTracerSpanAnnotations = globalValue(Symbol.for("effect/FiberRef/currentTracerSpanAnnotations"), () => fiberRefUnsafeMake(empty9()));
var currentTracerSpanLinks = globalValue(Symbol.for("effect/FiberRef/currentTracerSpanLinks"), () => fiberRefUnsafeMake(empty5()));
var ScopeTypeId = Symbol.for("effect/Scope");
var CloseableScopeTypeId = Symbol.for("effect/CloseableScope");
var scopeAddFinalizer = (self2, finalizer) => self2.addFinalizer(() => asVoid(finalizer));
var scopeAddFinalizerExit = (self2, finalizer) => self2.addFinalizer(finalizer);
var scopeClose = (self2, exit2) => self2.close(exit2);
var scopeFork = (self2, strategy) => self2.fork(strategy);
var YieldableError = function() {
  class YieldableError2 extends globalThis.Error {
    commit() {
      return fail2(this);
    }
    toJSON() {
      return {
        ...this
      };
    }
    [NodeInspectSymbol]() {
      if (this.toString !== globalThis.Error.prototype.toString) {
        return this.stack ? `${this.toString()}\n${this.stack.split("\n").slice(1).join("\n")}` : this.toString();
      } else if ("Bun" in globalThis) {
        return pretty(fail(this), {
          renderErrorCause: true
        });
      }
      return this;
    }
  }
  Object.assign(YieldableError2.prototype, StructuralCommitPrototype);
  return YieldableError2;
}();
var makeException = (proto2, tag) => {

  class Base extends YieldableError {
    _tag = tag;
  }
  Object.assign(Base.prototype, proto2);
  Base.prototype.name = tag;
  return Base;
};
var RuntimeExceptionTypeId = Symbol.for("effect/Cause/errors/RuntimeException");
var RuntimeException = makeException({
  [RuntimeExceptionTypeId]: RuntimeExceptionTypeId
}, "RuntimeException");
var InterruptedExceptionTypeId = Symbol.for("effect/Cause/errors/InterruptedException");
var InterruptedException = makeException({
  [InterruptedExceptionTypeId]: InterruptedExceptionTypeId
}, "InterruptedException");
var isInterruptedException = (u) => hasProperty(u, InterruptedExceptionTypeId);
var IllegalArgumentExceptionTypeId = Symbol.for("effect/Cause/errors/IllegalArgument");
var IllegalArgumentException = makeException({
  [IllegalArgumentExceptionTypeId]: IllegalArgumentExceptionTypeId
}, "IllegalArgumentException");
var NoSuchElementExceptionTypeId = Symbol.for("effect/Cause/errors/NoSuchElement");
var NoSuchElementException = makeException({
  [NoSuchElementExceptionTypeId]: NoSuchElementExceptionTypeId
}, "NoSuchElementException");
var isNoSuchElementException = (u) => hasProperty(u, NoSuchElementExceptionTypeId);
var InvalidPubSubCapacityExceptionTypeId = Symbol.for("effect/Cause/errors/InvalidPubSubCapacityException");
var InvalidPubSubCapacityException = makeException({
  [InvalidPubSubCapacityExceptionTypeId]: InvalidPubSubCapacityExceptionTypeId
}, "InvalidPubSubCapacityException");
var ExceededCapacityExceptionTypeId = Symbol.for("effect/Cause/errors/ExceededCapacityException");
var ExceededCapacityException = makeException({
  [ExceededCapacityExceptionTypeId]: ExceededCapacityExceptionTypeId
}, "ExceededCapacityException");
var TimeoutExceptionTypeId = Symbol.for("effect/Cause/errors/Timeout");
var TimeoutException = makeException({
  [TimeoutExceptionTypeId]: TimeoutExceptionTypeId
}, "TimeoutException");
var timeoutExceptionFromDuration = (duration) => new TimeoutException(`Operation timed out before the specified duration of '${format3(duration)}' elapsed`);
var UnknownExceptionTypeId = Symbol.for("effect/Cause/errors/UnknownException");
var UnknownException = function() {

  class UnknownException2 extends YieldableError {
    cause;
    _tag = "UnknownException";
    error;
    constructor(cause, message) {
      super(message ?? "An unknown error occurred", {
        cause
      });
      this.cause = cause;
      this.error = cause;
    }
  }
  Object.assign(UnknownException2.prototype, {
    [UnknownExceptionTypeId]: UnknownExceptionTypeId,
    name: "UnknownException"
  });
  return UnknownException2;
}();
var exitIsExit = (u) => isEffect(u) && ("_tag" in u) && (u._tag === "Success" || u._tag === "Failure");
var exitIsFailure = (self2) => self2._tag === "Failure";
var exitIsSuccess = (self2) => self2._tag === "Success";
var exitAs = dual(2, (self2, value) => {
  switch (self2._tag) {
    case OP_FAILURE: {
      return exitFailCause(self2.effect_instruction_i0);
    }
    case OP_SUCCESS: {
      return exitSucceed(value);
    }
  }
});
var exitAsVoid = (self2) => exitAs(self2, undefined);
var exitCollectAll = (exits, options) => exitCollectAllInternal(exits, options?.parallel ? parallel : sequential);
var exitDie = (defect) => exitFailCause(die(defect));
var exitFail = (error) => exitFailCause(fail(error));
var exitFailCause = (cause) => {
  const effect = new EffectPrimitiveFailure(OP_FAILURE);
  effect.effect_instruction_i0 = cause;
  return effect;
};
var exitFlatMap = dual(2, (self2, f) => {
  switch (self2._tag) {
    case OP_FAILURE: {
      return exitFailCause(self2.effect_instruction_i0);
    }
    case OP_SUCCESS: {
      return f(self2.effect_instruction_i0);
    }
  }
});
var exitFlatten = (self2) => pipe(self2, exitFlatMap(identity));
var exitInterrupt = (fiberId2) => exitFailCause(interrupt(fiberId2));
var exitMap = dual(2, (self2, f) => {
  switch (self2._tag) {
    case OP_FAILURE:
      return exitFailCause(self2.effect_instruction_i0);
    case OP_SUCCESS:
      return exitSucceed(f(self2.effect_instruction_i0));
  }
});
var exitMatch = dual(2, (self2, {
  onFailure,
  onSuccess
}) => {
  switch (self2._tag) {
    case OP_FAILURE:
      return onFailure(self2.effect_instruction_i0);
    case OP_SUCCESS:
      return onSuccess(self2.effect_instruction_i0);
  }
});
var exitMatchEffect = dual(2, (self2, {
  onFailure,
  onSuccess
}) => {
  switch (self2._tag) {
    case OP_FAILURE:
      return onFailure(self2.effect_instruction_i0);
    case OP_SUCCESS:
      return onSuccess(self2.effect_instruction_i0);
  }
});
var exitSucceed = (value) => {
  const effect = new EffectPrimitiveSuccess(OP_SUCCESS);
  effect.effect_instruction_i0 = value;
  return effect;
};
var exitVoid = exitSucceed(undefined);
var exitZipWith = dual(3, (self2, that, {
  onFailure,
  onSuccess
}) => {
  switch (self2._tag) {
    case OP_FAILURE: {
      switch (that._tag) {
        case OP_SUCCESS:
          return exitFailCause(self2.effect_instruction_i0);
        case OP_FAILURE: {
          return exitFailCause(onFailure(self2.effect_instruction_i0, that.effect_instruction_i0));
        }
      }
    }
    case OP_SUCCESS: {
      switch (that._tag) {
        case OP_SUCCESS:
          return exitSucceed(onSuccess(self2.effect_instruction_i0, that.effect_instruction_i0));
        case OP_FAILURE:
          return exitFailCause(that.effect_instruction_i0);
      }
    }
  }
});
var exitCollectAllInternal = (exits, combineCauses) => {
  const list = fromIterable2(exits);
  if (!isNonEmpty(list)) {
    return none2();
  }
  return pipe(tailNonEmpty2(list), reduce(pipe(headNonEmpty2(list), exitMap(of2)), (accumulator, current) => pipe(accumulator, exitZipWith(current, {
    onSuccess: (list2, value) => pipe(list2, prepend2(value)),
    onFailure: combineCauses
  }))), exitMap(reverse2), exitMap((chunk) => toReadonlyArray(chunk)), some2);
};
var deferredUnsafeMake = (fiberId2) => ({
  [DeferredTypeId]: deferredVariance,
  state: make12(pending([])),
  blockingOn: fiberId2,
  pipe() {
    return pipeArguments(this, arguments);
  }
});
var deferredMake = () => flatMap7(fiberId, (id2) => deferredMakeAs(id2));
var deferredMakeAs = (fiberId2) => sync(() => deferredUnsafeMake(fiberId2));
var deferredAwait = (self2) => async((resume) => {
  const state = get6(self2.state);
  switch (state._tag) {
    case OP_STATE_DONE: {
      return resume(state.effect);
    }
    case OP_STATE_PENDING: {
      state.joiners.push(resume);
      return deferredInterruptJoiner(self2, resume);
    }
  }
}, self2.blockingOn);
var deferredComplete = dual(2, (self2, effect) => intoDeferred(effect, self2));
var deferredCompleteWith = dual(2, (self2, effect) => sync(() => {
  const state = get6(self2.state);
  switch (state._tag) {
    case OP_STATE_DONE: {
      return false;
    }
    case OP_STATE_PENDING: {
      set2(self2.state, done(effect));
      for (let i = 0, len = state.joiners.length;i < len; i++) {
        state.joiners[i](effect);
      }
      return true;
    }
  }
}));
var deferredDone = dual(2, (self2, exit2) => deferredCompleteWith(self2, exit2));
var deferredFailCause = dual(2, (self2, cause) => deferredCompleteWith(self2, failCause(cause)));
var deferredInterrupt = (self2) => flatMap7(fiberId, (fiberId2) => deferredCompleteWith(self2, interruptWith(fiberId2)));
var deferredSucceed = dual(2, (self2, value) => deferredCompleteWith(self2, succeed(value)));
var deferredUnsafeDone = (self2, effect) => {
  const state = get6(self2.state);
  if (state._tag === OP_STATE_PENDING) {
    set2(self2.state, done(effect));
    for (let i = 0, len = state.joiners.length;i < len; i++) {
      state.joiners[i](effect);
    }
  }
};
var deferredInterruptJoiner = (self2, joiner) => sync(() => {
  const state = get6(self2.state);
  if (state._tag === OP_STATE_PENDING) {
    const index2 = state.joiners.indexOf(joiner);
    if (index2 >= 0) {
      state.joiners.splice(index2, 1);
    }
  }
});
var constContext = fiberRefGet(currentContext);
var context2 = () => constContext;
var contextWithEffect = (f) => flatMap7(context2(), f);
var provideContext = dual(2, (self2, context3) => fiberRefLocally(currentContext, context3)(self2));
var provideSomeContext = dual(2, (self2, context3) => fiberRefLocallyWith(currentContext, (parent) => merge3(parent, context3))(self2));
var mapInputContext = dual(2, (self2, f) => contextWithEffect((context3) => provideContext(self2, f(context3))));
var currentSpanFromFiber = (fiber) => {
  const span2 = fiber.getFiberRef(currentContext).unsafeMap.get(spanTag.key);
  return span2 !== undefined && span2._tag === "Span" ? some2(span2) : none2();
};
var NoopSpanProto = {
  _tag: "Span",
  spanId: "noop",
  traceId: "noop",
  name: "noop",
  sampled: false,
  parent: none2(),
  context: empty4(),
  status: {
    _tag: "Ended",
    startTime: BigInt(0),
    endTime: BigInt(0),
    exit: exitVoid
  },
  attributes: new Map,
  links: [],
  kind: "internal",
  attribute() {
  },
  event() {
  },
  end() {
  }
};
var noopSpan = (name) => {
  const span2 = Object.create(NoopSpanProto);
  span2.name = name;
  return span2;
};

// node_modules/effect/dist/esm/Deferred.js
var _await = deferredAwait;
var done2 = deferredDone;
var interrupt3 = deferredInterrupt;
var unsafeMake3 = deferredUnsafeMake;

// node_modules/effect/dist/esm/Exit.js
var die3 = exitDie;
var fail3 = exitFail;
var failCause2 = exitFailCause;
var flatten5 = exitFlatten;
var interrupt4 = exitInterrupt;
var succeed2 = exitSucceed;

// node_modules/effect/dist/esm/MutableHashMap.js
var TypeId9 = Symbol.for("effect/MutableHashMap");
var MutableHashMapProto = {
  [TypeId9]: TypeId9,
  [Symbol.iterator]() {
    return new MutableHashMapIterator(this);
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableHashMap",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};

class MutableHashMapIterator {
  self;
  referentialIterator;
  bucketIterator;
  constructor(self2) {
    this.self = self2;
    this.referentialIterator = self2.referential[Symbol.iterator]();
  }
  next() {
    if (this.bucketIterator !== undefined) {
      return this.bucketIterator.next();
    }
    const result = this.referentialIterator.next();
    if (result.done) {
      this.bucketIterator = new BucketIterator(this.self.buckets.values());
      return this.next();
    }
    return result;
  }
  [Symbol.iterator]() {
    return new MutableHashMapIterator(this.self);
  }
}

class BucketIterator {
  backing;
  constructor(backing) {
    this.backing = backing;
  }
  currentBucket;
  next() {
    if (this.currentBucket === undefined) {
      const result2 = this.backing.next();
      if (result2.done) {
        return result2;
      }
      this.currentBucket = result2.value[Symbol.iterator]();
    }
    const result = this.currentBucket.next();
    if (result.done) {
      this.currentBucket = undefined;
      return this.next();
    }
    return result;
  }
}
var empty21 = () => {
  const self2 = Object.create(MutableHashMapProto);
  self2.referential = new Map;
  self2.buckets = new Map;
  self2.bucketsSize = 0;
  return self2;
};
var get8 = dual(2, (self2, key) => {
  if (isEqual(key) === false) {
    return self2.referential.has(key) ? some2(self2.referential.get(key)) : none2();
  }
  const hash4 = key[symbol]();
  const bucket = self2.buckets.get(hash4);
  if (bucket === undefined) {
    return none2();
  }
  return getFromBucket(self2, bucket, key);
});
var getFromBucket = (self2, bucket, key, remove6 = false) => {
  for (let i = 0, len = bucket.length;i < len; i++) {
    if (key[symbol2](bucket[i][0])) {
      const value = bucket[i][1];
      if (remove6) {
        bucket.splice(i, 1);
        self2.bucketsSize--;
      }
      return some2(value);
    }
  }
  return none2();
};
var has4 = dual(2, (self2, key) => isSome2(get8(self2, key)));
var set4 = dual(3, (self2, key, value) => {
  if (isEqual(key) === false) {
    self2.referential.set(key, value);
    return self2;
  }
  const hash4 = key[symbol]();
  const bucket = self2.buckets.get(hash4);
  if (bucket === undefined) {
    self2.buckets.set(hash4, [[key, value]]);
    self2.bucketsSize++;
    return self2;
  }
  removeFromBucket(self2, bucket, key);
  bucket.push([key, value]);
  self2.bucketsSize++;
  return self2;
});
var removeFromBucket = (self2, bucket, key) => {
  for (let i = 0, len = bucket.length;i < len; i++) {
    if (key[symbol2](bucket[i][0])) {
      bucket.splice(i, 1);
      self2.bucketsSize--;
      return;
    }
  }
};
var remove6 = dual(2, (self2, key) => {
  if (isEqual(key) === false) {
    self2.referential.delete(key);
    return self2;
  }
  const hash4 = key[symbol]();
  const bucket = self2.buckets.get(hash4);
  if (bucket === undefined) {
    return self2;
  }
  removeFromBucket(self2, bucket, key);
  if (bucket.length === 0) {
    self2.buckets.delete(hash4);
  }
  return self2;
});
var size16 = (self2) => {
  return self2.referential.size + self2.bucketsSize;
};

// node_modules/effect/dist/esm/MutableList.js
var TypeId10 = Symbol.for("effect/MutableList");
var MutableListProto = {
  [TypeId10]: TypeId10,
  [Symbol.iterator]() {
    let done3 = false;
    let head3 = this.head;
    return {
      next() {
        if (done3) {
          return this.return();
        }
        if (head3 == null) {
          done3 = true;
          return this.return();
        }
        const value = head3.value;
        head3 = head3.next;
        return {
          done: done3,
          value
        };
      },
      return(value) {
        if (!done3) {
          done3 = true;
        }
        return {
          done: true,
          value
        };
      }
    };
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableList",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeNode = (value) => ({
  value,
  removed: false,
  prev: undefined,
  next: undefined
});
var empty22 = () => {
  const list = Object.create(MutableListProto);
  list.head = undefined;
  list.tail = undefined;
  list._length = 0;
  return list;
};
var isEmpty6 = (self2) => length(self2) === 0;
var length = (self2) => self2._length;
var append3 = dual(2, (self2, value) => {
  const node5 = makeNode(value);
  if (self2.head === undefined) {
    self2.head = node5;
  }
  if (self2.tail === undefined) {
    self2.tail = node5;
  } else {
    self2.tail.next = node5;
    node5.prev = self2.tail;
    self2.tail = node5;
  }
  self2._length += 1;
  return self2;
});
var shift = (self2) => {
  const head3 = self2.head;
  if (head3 !== undefined) {
    remove7(self2, head3);
    return head3.value;
  }
  return;
};
var remove7 = (self2, node5) => {
  if (node5.removed) {
    return;
  }
  node5.removed = true;
  if (node5.prev !== undefined && node5.next !== undefined) {
    node5.prev.next = node5.next;
    node5.next.prev = node5.prev;
  } else if (node5.prev !== undefined) {
    self2.tail = node5.prev;
    node5.prev.next = undefined;
  } else if (node5.next !== undefined) {
    self2.head = node5.next;
    node5.next.prev = undefined;
  } else {
    self2.tail = undefined;
    self2.head = undefined;
  }
  if (self2._length > 0) {
    self2._length -= 1;
  }
};

// node_modules/effect/dist/esm/MutableQueue.js
var TypeId11 = Symbol.for("effect/MutableQueue");
var EmptyMutableQueue = Symbol.for("effect/mutable/MutableQueue/Empty");
var MutableQueueProto = {
  [TypeId11]: TypeId11,
  [Symbol.iterator]() {
    return Array.from(this.queue)[Symbol.iterator]();
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableQueue",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var make20 = (capacity) => {
  const queue = Object.create(MutableQueueProto);
  queue.queue = empty22();
  queue.capacity = capacity;
  return queue;
};
var unbounded = () => make20(undefined);
var offer = dual(2, (self2, value) => {
  const queueLength = length(self2.queue);
  if (self2.capacity !== undefined && queueLength === self2.capacity) {
    return false;
  }
  append3(value)(self2.queue);
  return true;
});
var poll7 = dual(2, (self2, def) => {
  if (isEmpty6(self2.queue)) {
    return def;
  }
  return shift(self2.queue);
});

// node_modules/effect/dist/esm/internal/clock.js
var ClockSymbolKey = "effect/Clock";
var ClockTypeId = Symbol.for(ClockSymbolKey);
var clockTag = GenericTag("effect/Clock");
var MAX_TIMER_MILLIS = 2 ** 31 - 1;
var globalClockScheduler = {
  unsafeSchedule(task, duration) {
    const millis2 = toMillis(duration);
    if (millis2 > MAX_TIMER_MILLIS) {
      return constFalse;
    }
    let completed = false;
    const handle = setTimeout(() => {
      completed = true;
      task();
    }, millis2);
    return () => {
      clearTimeout(handle);
      return !completed;
    };
  }
};
var performanceNowNanos = function() {
  const bigint1e62 = BigInt(1e6);
  if (typeof performance === "undefined") {
    return () => BigInt(Date.now()) * bigint1e62;
  } else if (typeof performance.timeOrigin === "number" && performance.timeOrigin === 0) {
    return () => BigInt(Math.round(performance.now() * 1e6));
  }
  const origin = BigInt(Date.now()) * bigint1e62 - BigInt(Math.round(performance.now() * 1e6));
  return () => origin + BigInt(Math.round(performance.now() * 1e6));
}();
var processOrPerformanceNow = function() {
  const processHrtime = typeof process === "object" && "hrtime" in process && typeof process.hrtime.bigint === "function" ? process.hrtime : undefined;
  if (!processHrtime) {
    return performanceNowNanos;
  }
  const origin = performanceNowNanos() - processHrtime.bigint();
  return () => origin + processHrtime.bigint();
}();

class ClockImpl {
  [ClockTypeId] = ClockTypeId;
  unsafeCurrentTimeMillis() {
    return Date.now();
  }
  unsafeCurrentTimeNanos() {
    return processOrPerformanceNow();
  }
  currentTimeMillis = sync(() => this.unsafeCurrentTimeMillis());
  currentTimeNanos = sync(() => this.unsafeCurrentTimeNanos());
  scheduler() {
    return succeed(globalClockScheduler);
  }
  sleep(duration) {
    return async((resume) => {
      const canceler = globalClockScheduler.unsafeSchedule(() => resume(void_), duration);
      return asVoid(sync(canceler));
    });
  }
}
var make21 = () => new ClockImpl;

// node_modules/effect/dist/esm/Number.js
var Order = number4;

// node_modules/effect/dist/esm/RegExp.js
var escape = (string2) => string2.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&");

// node_modules/effect/dist/esm/internal/opCodes/configError.js
var OP_AND = "And";
var OP_OR = "Or";
var OP_INVALID_DATA = "InvalidData";
var OP_MISSING_DATA = "MissingData";
var OP_SOURCE_UNAVAILABLE = "SourceUnavailable";
var OP_UNSUPPORTED = "Unsupported";

// node_modules/effect/dist/esm/internal/configError.js
var ConfigErrorSymbolKey = "effect/ConfigError";
var ConfigErrorTypeId = Symbol.for(ConfigErrorSymbolKey);
var proto2 = {
  _tag: "ConfigError",
  [ConfigErrorTypeId]: ConfigErrorTypeId
};
var And = (self2, that) => {
  const error = Object.create(proto2);
  error._op = OP_AND;
  error.left = self2;
  error.right = that;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      return `${this.left} and ${this.right}`;
    }
  });
  return error;
};
var Or = (self2, that) => {
  const error = Object.create(proto2);
  error._op = OP_OR;
  error.left = self2;
  error.right = that;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      return `${this.left} or ${this.right}`;
    }
  });
  return error;
};
var InvalidData = (path, message, options = {
  pathDelim: "."
}) => {
  const error = Object.create(proto2);
  error._op = OP_INVALID_DATA;
  error.path = path;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path2 = pipe(this.path, join(options.pathDelim));
      return `(Invalid data at ${path2}: "${this.message}")`;
    }
  });
  return error;
};
var MissingData = (path, message, options = {
  pathDelim: "."
}) => {
  const error = Object.create(proto2);
  error._op = OP_MISSING_DATA;
  error.path = path;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path2 = pipe(this.path, join(options.pathDelim));
      return `(Missing data at ${path2}: "${this.message}")`;
    }
  });
  return error;
};
var SourceUnavailable = (path, message, cause, options = {
  pathDelim: "."
}) => {
  const error = Object.create(proto2);
  error._op = OP_SOURCE_UNAVAILABLE;
  error.path = path;
  error.message = message;
  error.cause = cause;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path2 = pipe(this.path, join(options.pathDelim));
      return `(Source unavailable at ${path2}: "${this.message}")`;
    }
  });
  return error;
};
var Unsupported = (path, message, options = {
  pathDelim: "."
}) => {
  const error = Object.create(proto2);
  error._op = OP_UNSUPPORTED;
  error.path = path;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path2 = pipe(this.path, join(options.pathDelim));
      return `(Unsupported operation at ${path2}: "${this.message}")`;
    }
  });
  return error;
};
var prefixed = dual(2, (self2, prefix) => {
  switch (self2._op) {
    case OP_AND: {
      return And(prefixed(self2.left, prefix), prefixed(self2.right, prefix));
    }
    case OP_OR: {
      return Or(prefixed(self2.left, prefix), prefixed(self2.right, prefix));
    }
    case OP_INVALID_DATA: {
      return InvalidData([...prefix, ...self2.path], self2.message);
    }
    case OP_MISSING_DATA: {
      return MissingData([...prefix, ...self2.path], self2.message);
    }
    case OP_SOURCE_UNAVAILABLE: {
      return SourceUnavailable([...prefix, ...self2.path], self2.message, self2.cause);
    }
    case OP_UNSUPPORTED: {
      return Unsupported([...prefix, ...self2.path], self2.message);
    }
  }
});

// node_modules/effect/dist/esm/internal/configProvider/pathPatch.js
var empty23 = {
  _tag: "Empty"
};
var patch8 = dual(2, (path, patch9) => {
  let input = of3(patch9);
  let output2 = path;
  while (isCons(input)) {
    const patch10 = input.head;
    switch (patch10._tag) {
      case "Empty": {
        input = input.tail;
        break;
      }
      case "AndThen": {
        input = cons(patch10.first, cons(patch10.second, input.tail));
        break;
      }
      case "MapName": {
        output2 = map3(output2, patch10.f);
        input = input.tail;
        break;
      }
      case "Nested": {
        output2 = prepend(output2, patch10.name);
        input = input.tail;
        break;
      }
      case "Unnested": {
        const containsName = pipe(head(output2), contains(patch10.name));
        if (containsName) {
          output2 = tailNonEmpty(output2);
          input = input.tail;
        } else {
          return left2(MissingData(output2, `Expected ${patch10.name} to be in path in ConfigProvider#unnested`));
        }
        break;
      }
    }
  }
  return right2(output2);
});

// node_modules/effect/dist/esm/internal/opCodes/config.js
var OP_CONSTANT = "Constant";
var OP_FAIL2 = "Fail";
var OP_FALLBACK = "Fallback";
var OP_DESCRIBED = "Described";
var OP_LAZY = "Lazy";
var OP_MAP_OR_FAIL = "MapOrFail";
var OP_NESTED = "Nested";
var OP_PRIMITIVE = "Primitive";
var OP_SEQUENCE = "Sequence";
var OP_HASHMAP = "HashMap";
var OP_ZIP_WITH = "ZipWith";

// node_modules/effect/dist/esm/internal/configProvider.js
var concat11 = (l, r) => [...l, ...r];
var ConfigProviderSymbolKey = "effect/ConfigProvider";
var ConfigProviderTypeId = Symbol.for(ConfigProviderSymbolKey);
var configProviderTag = GenericTag("effect/ConfigProvider");
var FlatConfigProviderSymbolKey = "effect/ConfigProviderFlat";
var FlatConfigProviderTypeId = Symbol.for(FlatConfigProviderSymbolKey);
var make23 = (options) => ({
  [ConfigProviderTypeId]: ConfigProviderTypeId,
  pipe() {
    return pipeArguments(this, arguments);
  },
  ...options
});
var makeFlat = (options) => ({
  [FlatConfigProviderTypeId]: FlatConfigProviderTypeId,
  patch: options.patch,
  load: (path, config4, split2 = true) => options.load(path, config4, split2),
  enumerateChildren: options.enumerateChildren
});
var fromFlat = (flat) => make23({
  load: (config4) => flatMap7(fromFlatLoop(flat, empty2(), config4, false), (chunk) => match2(head(chunk), {
    onNone: () => fail2(MissingData(empty2(), `Expected a single value having structure: ${config4}`)),
    onSome: succeed
  })),
  flattened: flat
});
var fromEnv = (config4) => {
  const {
    pathDelim,
    seqDelim
  } = Object.assign({}, {
    pathDelim: "_",
    seqDelim: ","
  }, config4);
  const makePathString = (path) => pipe(path, join(pathDelim));
  const unmakePathString = (pathString) => pathString.split(pathDelim);
  const getEnv = () => typeof process !== "undefined" && ("env" in process) && typeof process.env === "object" ? process.env : {};
  const load = (path, primitive, split2 = true) => {
    const pathString = makePathString(path);
    const current = getEnv();
    const valueOpt = pathString in current ? some2(current[pathString]) : none2();
    return pipe(valueOpt, mapError(() => MissingData(path, `Expected ${pathString} to exist in the process context`)), flatMap7((value) => parsePrimitive(value, path, primitive, seqDelim, split2)));
  };
  const enumerateChildren = (path) => sync(() => {
    const current = getEnv();
    const keys3 = Object.keys(current);
    const keyPaths = keys3.map((value) => unmakePathString(value.toUpperCase()));
    const filteredKeyPaths = keyPaths.filter((keyPath) => {
      for (let i = 0;i < path.length; i++) {
        const pathComponent = pipe(path, unsafeGet(i));
        const currentElement = keyPath[i];
        if (currentElement === undefined || pathComponent !== currentElement) {
          return false;
        }
      }
      return true;
    }).flatMap((keyPath) => keyPath.slice(path.length, path.length + 1));
    return fromIterable5(filteredKeyPaths);
  });
  return fromFlat(makeFlat({
    load,
    enumerateChildren,
    patch: empty23
  }));
};
var extend = (leftDef, rightDef, left3, right3) => {
  const leftPad = unfold(left3.length, (index2) => index2 >= right3.length ? none2() : some2([leftDef(index2), index2 + 1]));
  const rightPad = unfold(right3.length, (index2) => index2 >= left3.length ? none2() : some2([rightDef(index2), index2 + 1]));
  const leftExtension = concat11(left3, leftPad);
  const rightExtension = concat11(right3, rightPad);
  return [leftExtension, rightExtension];
};
var appendConfigPath = (path, config4) => {
  let op = config4;
  if (op._tag === "Nested") {
    const out = path.slice();
    while (op._tag === "Nested") {
      out.push(op.name);
      op = op.config;
    }
    return out;
  }
  return path;
};
var fromFlatLoop = (flat, prefix, config4, split2) => {
  const op = config4;
  switch (op._tag) {
    case OP_CONSTANT: {
      return succeed(of(op.value));
    }
    case OP_DESCRIBED: {
      return suspend(() => fromFlatLoop(flat, prefix, op.config, split2));
    }
    case OP_FAIL2: {
      return fail2(MissingData(prefix, op.message));
    }
    case OP_FALLBACK: {
      return pipe(suspend(() => fromFlatLoop(flat, prefix, op.first, split2)), catchAll((error1) => {
        if (op.condition(error1)) {
          return pipe(fromFlatLoop(flat, prefix, op.second, split2), catchAll((error2) => fail2(Or(error1, error2))));
        }
        return fail2(error1);
      }));
    }
    case OP_LAZY: {
      return suspend(() => fromFlatLoop(flat, prefix, op.config(), split2));
    }
    case OP_MAP_OR_FAIL: {
      return suspend(() => pipe(fromFlatLoop(flat, prefix, op.original, split2), flatMap7(forEachSequential((a) => pipe(op.mapOrFail(a), mapError(prefixed(appendConfigPath(prefix, op.original))))))));
    }
    case OP_NESTED: {
      return suspend(() => fromFlatLoop(flat, concat11(prefix, of(op.name)), op.config, split2));
    }
    case OP_PRIMITIVE: {
      return pipe(patch8(prefix, flat.patch), flatMap7((prefix2) => pipe(flat.load(prefix2, op, split2), flatMap7((values3) => {
        if (values3.length === 0) {
          const name = pipe(last(prefix2), getOrElse(() => "<n/a>"));
          return fail2(MissingData([], `Expected ${op.description} with name ${name}`));
        }
        return succeed(values3);
      }))));
    }
    case OP_SEQUENCE: {
      return pipe(patch8(prefix, flat.patch), flatMap7((patchedPrefix) => pipe(flat.enumerateChildren(patchedPrefix), flatMap7(indicesFrom), flatMap7((indices) => {
        if (indices.length === 0) {
          return suspend(() => map9(fromFlatLoop(flat, patchedPrefix, op.config, true), of));
        }
        return pipe(forEachSequential(indices, (index2) => fromFlatLoop(flat, append(prefix, `[${index2}]`), op.config, true)), map9((chunkChunk) => {
          const flattened = flatten(chunkChunk);
          if (flattened.length === 0) {
            return of(empty2());
          }
          return of(flattened);
        }));
      }))));
    }
    case OP_HASHMAP: {
      return suspend(() => pipe(patch8(prefix, flat.patch), flatMap7((prefix2) => pipe(flat.enumerateChildren(prefix2), flatMap7((keys3) => {
        return pipe(keys3, forEachSequential((key) => fromFlatLoop(flat, concat11(prefix2, of(key)), op.valueConfig, split2)), map9((matrix) => {
          if (matrix.length === 0) {
            return of(empty9());
          }
          return pipe(transpose(matrix), map3((values3) => fromIterable6(zip(fromIterable(keys3), values3))));
        }));
      })))));
    }
    case OP_ZIP_WITH: {
      return suspend(() => pipe(fromFlatLoop(flat, prefix, op.left, split2), either2, flatMap7((left3) => pipe(fromFlatLoop(flat, prefix, op.right, split2), either2, flatMap7((right3) => {
        if (isLeft2(left3) && isLeft2(right3)) {
          return fail2(And(left3.left, right3.left));
        }
        if (isLeft2(left3) && isRight2(right3)) {
          return fail2(left3.left);
        }
        if (isRight2(left3) && isLeft2(right3)) {
          return fail2(right3.left);
        }
        if (isRight2(left3) && isRight2(right3)) {
          const path = pipe(prefix, join("."));
          const fail4 = fromFlatLoopFail(prefix, path);
          const [lefts, rights] = extend(fail4, fail4, pipe(left3.right, map3(right2)), pipe(right3.right, map3(right2)));
          return pipe(lefts, zip(rights), forEachSequential(([left4, right4]) => pipe(zip2(left4, right4), map9(([left5, right5]) => op.zip(left5, right5)))));
        }
        throw new Error("BUG: ConfigProvider.fromFlatLoop - please report an issue at https://github.com/Effect-TS/effect/issues");
      })))));
    }
  }
};
var fromFlatLoopFail = (prefix, path) => (index2) => left2(MissingData(prefix, `The element at index ${index2} in a sequence at path "${path}" was missing`));
var splitPathString = (text, delim) => {
  const split2 = text.split(new RegExp(`\\s*${escape(delim)}\\s*`));
  return split2;
};
var parsePrimitive = (text, path, primitive, delimiter, split2) => {
  if (!split2) {
    return pipe(primitive.parse(text), mapBoth({
      onFailure: prefixed(path),
      onSuccess: of
    }));
  }
  return pipe(splitPathString(text, delimiter), forEachSequential((char) => primitive.parse(char.trim())), mapError(prefixed(path)));
};
var transpose = (array5) => {
  return Object.keys(array5[0]).map((column) => array5.map((row) => row[column]));
};
var indicesFrom = (quotedIndices) => pipe(forEachSequential(quotedIndices, parseQuotedIndex), mapBoth({
  onFailure: () => empty2(),
  onSuccess: sort(Order)
}), either2, map9(merge));
var QUOTED_INDEX_REGEX = /^(\[(\d+)\])$/;
var parseQuotedIndex = (str) => {
  const match6 = str.match(QUOTED_INDEX_REGEX);
  if (match6 !== null) {
    const matchedIndex = match6[2];
    return pipe(matchedIndex !== undefined && matchedIndex.length > 0 ? some2(matchedIndex) : none2(), flatMap(parseInteger));
  }
  return none2();
};
var parseInteger = (str) => {
  const parsedIndex = Number.parseInt(str);
  return Number.isNaN(parsedIndex) ? none2() : some2(parsedIndex);
};

// node_modules/effect/dist/esm/internal/defaultServices/console.js
var TypeId12 = Symbol.for("effect/Console");
var consoleTag = GenericTag("effect/Console");
var defaultConsole = {
  [TypeId12]: TypeId12,
  assert(condition, ...args) {
    return sync(() => {
      console.assert(condition, ...args);
    });
  },
  clear: sync(() => {
    console.clear();
  }),
  count(label) {
    return sync(() => {
      console.count(label);
    });
  },
  countReset(label) {
    return sync(() => {
      console.countReset(label);
    });
  },
  debug(...args) {
    return sync(() => {
      console.debug(...args);
    });
  },
  dir(item, options) {
    return sync(() => {
      console.dir(item, options);
    });
  },
  dirxml(...args) {
    return sync(() => {
      console.dirxml(...args);
    });
  },
  error(...args) {
    return sync(() => {
      console.error(...args);
    });
  },
  group(options) {
    return options?.collapsed ? sync(() => console.groupCollapsed(options?.label)) : sync(() => console.group(options?.label));
  },
  groupEnd: sync(() => {
    console.groupEnd();
  }),
  info(...args) {
    return sync(() => {
      console.info(...args);
    });
  },
  log(...args) {
    return sync(() => {
      console.log(...args);
    });
  },
  table(tabularData, properties) {
    return sync(() => {
      console.table(tabularData, properties);
    });
  },
  time(label) {
    return sync(() => console.time(label));
  },
  timeEnd(label) {
    return sync(() => console.timeEnd(label));
  },
  timeLog(label, ...args) {
    return sync(() => {
      console.timeLog(label, ...args);
    });
  },
  trace(...args) {
    return sync(() => {
      console.trace(...args);
    });
  },
  warn(...args) {
    return sync(() => {
      console.warn(...args);
    });
  },
  unsafe: console
};

// node_modules/effect/dist/esm/internal/random.js
var RandomSymbolKey = "effect/Random";
var RandomTypeId = Symbol.for(RandomSymbolKey);
var randomTag = GenericTag("effect/Random");

class RandomImpl {
  seed;
  [RandomTypeId] = RandomTypeId;
  PRNG;
  constructor(seed) {
    this.seed = seed;
    this.PRNG = new PCGRandom(seed);
  }
  get next() {
    return sync(() => this.PRNG.number());
  }
  get nextBoolean() {
    return map9(this.next, (n) => n > 0.5);
  }
  get nextInt() {
    return sync(() => this.PRNG.integer(Number.MAX_SAFE_INTEGER));
  }
  nextRange(min2, max2) {
    return map9(this.next, (n) => (max2 - min2) * n + min2);
  }
  nextIntBetween(min2, max2) {
    return sync(() => this.PRNG.integer(max2 - min2) + min2);
  }
  shuffle(elements) {
    return shuffleWith(elements, (n) => this.nextIntBetween(0, n));
  }
}
var shuffleWith = (elements, nextIntBounded) => {
  return suspend(() => pipe(sync(() => Array.from(elements)), flatMap7((buffer2) => {
    const numbers = [];
    for (let i = buffer2.length;i >= 2; i = i - 1) {
      numbers.push(i);
    }
    return pipe(numbers, forEachSequentialDiscard((n) => pipe(nextIntBounded(n), map9((k) => swap(buffer2, n - 1, k)))), as(fromIterable2(buffer2)));
  })));
};
var swap = (buffer2, index1, index2) => {
  const tmp = buffer2[index1];
  buffer2[index1] = buffer2[index2];
  buffer2[index2] = tmp;
  return buffer2;
};
var make24 = (seed) => new RandomImpl(hash3(seed));

// node_modules/effect/dist/esm/internal/defaultServices.js
var liveServices = pipe(empty4(), add2(clockTag, make21()), add2(consoleTag, defaultConsole), add2(randomTag, make24(Math.random())), add2(configProviderTag, fromEnv()), add2(tracerTag, nativeTracer));
var currentServices = globalValue(Symbol.for("effect/DefaultServices/currentServices"), () => fiberRefUnsafeMakeContext(liveServices));
var sleep = (duration) => {
  const decodedDuration = decode(duration);
  return clockWith((clock) => clock.sleep(decodedDuration));
};
var clockWith = (f) => fiberRefGetWith(currentServices, (services) => f(get3(services, clockTag)));
var currentTimeMillis = clockWith((clock) => clock.currentTimeMillis);
var currentTimeNanos = clockWith((clock) => clock.currentTimeNanos);
var withClock = dual(2, (effect, value) => fiberRefLocallyWith(currentServices, add2(clockTag, value))(effect));
var withConfigProvider = dual(2, (effect, value) => fiberRefLocallyWith(currentServices, add2(configProviderTag, value))(effect));
var configProviderWith = (f) => fiberRefGetWith(currentServices, (services) => f(get3(services, configProviderTag)));
var config4 = (config5) => configProviderWith((_) => _.load(config5));
var randomWith = (f) => fiberRefGetWith(currentServices, (services) => f(get3(services, randomTag)));
var withRandom = dual(2, (effect, value) => fiberRefLocallyWith(currentServices, add2(randomTag, value))(effect));
var next = randomWith((random2) => random2.next);
var tracerWith = (f) => fiberRefGetWith(currentServices, (services) => f(get3(services, tracerTag)));
var withTracer = dual(2, (effect, value) => fiberRefLocallyWith(currentServices, add2(tracerTag, value))(effect));

// node_modules/effect/dist/esm/Clock.js
var sleep2 = sleep;
var currentTimeMillis2 = currentTimeMillis;
var currentTimeNanos2 = currentTimeNanos;
var clockWith2 = clockWith;
var Clock = clockTag;

// node_modules/effect/dist/esm/internal/fiberRefs.js
function unsafeMake4(fiberRefLocals) {
  return new FiberRefsImpl(fiberRefLocals);
}
function empty24() {
  return unsafeMake4(new Map);
}
var FiberRefsSym = Symbol.for("effect/FiberRefs");

class FiberRefsImpl {
  locals;
  [FiberRefsSym] = FiberRefsSym;
  constructor(locals) {
    this.locals = locals;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
var findAncestor = (_ref, _parentStack, _childStack, _childModified = false) => {
  const ref = _ref;
  let parentStack = _parentStack;
  let childStack = _childStack;
  let childModified = _childModified;
  let ret = undefined;
  while (ret === undefined) {
    if (isNonEmptyReadonlyArray(parentStack) && isNonEmptyReadonlyArray(childStack)) {
      const parentFiberId = headNonEmpty(parentStack)[0];
      const parentAncestors = tailNonEmpty(parentStack);
      const childFiberId = headNonEmpty(childStack)[0];
      const childRefValue = headNonEmpty(childStack)[1];
      const childAncestors = tailNonEmpty(childStack);
      if (parentFiberId.startTimeMillis < childFiberId.startTimeMillis) {
        childStack = childAncestors;
        childModified = true;
      } else if (parentFiberId.startTimeMillis > childFiberId.startTimeMillis) {
        parentStack = parentAncestors;
      } else {
        if (parentFiberId.id < childFiberId.id) {
          childStack = childAncestors;
          childModified = true;
        } else if (parentFiberId.id > childFiberId.id) {
          parentStack = parentAncestors;
        } else {
          ret = [childRefValue, childModified];
        }
      }
    } else {
      ret = [ref.initial, true];
    }
  }
  return ret;
};
var joinAs = dual(3, (self2, fiberId2, that) => {
  const parentFiberRefs = new Map(self2.locals);
  that.locals.forEach((childStack, fiberRef) => {
    const childValue = childStack[0][1];
    if (!childStack[0][0][symbol2](fiberId2)) {
      if (!parentFiberRefs.has(fiberRef)) {
        if (equals(childValue, fiberRef.initial)) {
          return;
        }
        parentFiberRefs.set(fiberRef, [[fiberId2, fiberRef.join(fiberRef.initial, childValue)]]);
        return;
      }
      const parentStack = parentFiberRefs.get(fiberRef);
      const [ancestor, wasModified] = findAncestor(fiberRef, parentStack, childStack);
      if (wasModified) {
        const patch9 = fiberRef.diff(ancestor, childValue);
        const oldValue = parentStack[0][1];
        const newValue = fiberRef.join(oldValue, fiberRef.patch(patch9)(oldValue));
        if (!equals(oldValue, newValue)) {
          let newStack;
          const parentFiberId = parentStack[0][0];
          if (parentFiberId[symbol2](fiberId2)) {
            newStack = [[parentFiberId, newValue], ...parentStack.slice(1)];
          } else {
            newStack = [[fiberId2, newValue], ...parentStack];
          }
          parentFiberRefs.set(fiberRef, newStack);
        }
      }
    }
  });
  return new FiberRefsImpl(parentFiberRefs);
});
var forkAs = dual(2, (self2, childId) => {
  const map10 = new Map;
  unsafeForkAs(self2, map10, childId);
  return new FiberRefsImpl(map10);
});
var unsafeForkAs = (self2, map10, fiberId2) => {
  self2.locals.forEach((stack, fiberRef) => {
    const oldValue = stack[0][1];
    const newValue = fiberRef.patch(fiberRef.fork)(oldValue);
    if (equals(oldValue, newValue)) {
      map10.set(fiberRef, stack);
    } else {
      map10.set(fiberRef, [[fiberId2, newValue], ...stack]);
    }
  });
};
var fiberRefs = (self2) => fromIterable5(self2.locals.keys());
var setAll = (self2) => forEachSequentialDiscard(fiberRefs(self2), (fiberRef) => fiberRefSet(fiberRef, getOrDefault(self2, fiberRef)));
var delete_ = dual(2, (self2, fiberRef) => {
  const locals = new Map(self2.locals);
  locals.delete(fiberRef);
  return new FiberRefsImpl(locals);
});
var get9 = dual(2, (self2, fiberRef) => {
  if (!self2.locals.has(fiberRef)) {
    return none2();
  }
  return some2(headNonEmpty(self2.locals.get(fiberRef))[1]);
});
var getOrDefault = dual(2, (self2, fiberRef) => pipe(get9(self2, fiberRef), getOrElse(() => fiberRef.initial)));
var updateAs = dual(2, (self2, {
  fiberId: fiberId2,
  fiberRef,
  value
}) => {
  if (self2.locals.size === 0) {
    return new FiberRefsImpl(new Map([[fiberRef, [[fiberId2, value]]]]));
  }
  const locals = new Map(self2.locals);
  unsafeUpdateAs(locals, fiberId2, fiberRef, value);
  return new FiberRefsImpl(locals);
});
var unsafeUpdateAs = (locals, fiberId2, fiberRef, value) => {
  const oldStack = locals.get(fiberRef) ?? [];
  let newStack;
  if (isNonEmptyReadonlyArray(oldStack)) {
    const [currentId, currentValue] = headNonEmpty(oldStack);
    if (currentId[symbol2](fiberId2)) {
      if (equals(currentValue, value)) {
        return;
      } else {
        newStack = [[fiberId2, value], ...oldStack.slice(1)];
      }
    } else {
      newStack = [[fiberId2, value], ...oldStack];
    }
  } else {
    newStack = [[fiberId2, value]];
  }
  locals.set(fiberRef, newStack);
};
var updateManyAs = dual(2, (self2, {
  entries: entries2,
  forkAs: forkAs2
}) => {
  if (self2.locals.size === 0) {
    return new FiberRefsImpl(new Map(entries2));
  }
  const locals = new Map(self2.locals);
  if (forkAs2 !== undefined) {
    unsafeForkAs(self2, locals, forkAs2);
  }
  entries2.forEach(([fiberRef, values3]) => {
    if (values3.length === 1) {
      unsafeUpdateAs(locals, values3[0][0], fiberRef, values3[0][1]);
    } else {
      values3.forEach(([fiberId2, value]) => {
        unsafeUpdateAs(locals, fiberId2, fiberRef, value);
      });
    }
  });
  return new FiberRefsImpl(locals);
});

// node_modules/effect/dist/esm/FiberRefs.js
var get10 = get9;
var getOrDefault2 = getOrDefault;
var joinAs2 = joinAs;
var setAll2 = setAll;
var updateManyAs2 = updateManyAs;
var empty25 = empty24;

// node_modules/effect/dist/esm/LogLevel.js
var All = logLevelAll;
var Fatal = logLevelFatal;
var Error2 = logLevelError;
var Warning = logLevelWarning;
var Info = logLevelInfo;
var Debug = logLevelDebug;
var Trace = logLevelTrace;
var None3 = logLevelNone;
var Order2 = pipe(Order, mapInput2((level) => level.ordinal));
var greaterThan2 = greaterThan(Order2);
var fromLiteral = (literal) => {
  switch (literal) {
    case "All":
      return All;
    case "Debug":
      return Debug;
    case "Error":
      return Error2;
    case "Fatal":
      return Fatal;
    case "Info":
      return Info;
    case "Trace":
      return Trace;
    case "None":
      return None3;
    case "Warning":
      return Warning;
  }
};

// node_modules/effect/dist/esm/internal/logSpan.js
var make25 = (label, startTime) => ({
  label,
  startTime
});
var render = (now) => (self2) => {
  const label = self2.label.replace(/[\s="]/g, "_");
  return `${label}=${now - self2.startTime}ms`;
};

// node_modules/effect/dist/esm/LogSpan.js
var make26 = make25;
var render2 = render;

// node_modules/effect/dist/esm/Readable.js
var TypeId13 = Symbol.for("effect/Readable");
var Proto = {
  [TypeId13]: TypeId13,
  pipe() {
    return pipeArguments(this, arguments);
  }
};

// node_modules/effect/dist/esm/internal/ref.js
var RefTypeId = Symbol.for("effect/Ref");
var refVariance = {
  _A: (_) => _
};

class RefImpl {
  ref;
  [RefTypeId] = refVariance;
  [TypeId13];
  constructor(ref) {
    this.ref = ref;
    this[TypeId13] = TypeId13;
    this.get = sync(() => get6(this.ref));
  }
  get;
  modify(f) {
    return sync(() => {
      const current = get6(this.ref);
      const [b, a] = f(current);
      if (current !== a) {
        set2(a)(this.ref);
      }
      return b;
    });
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
var unsafeMake5 = (value) => new RefImpl(make12(value));
var make27 = (value) => sync(() => unsafeMake5(value));
var get11 = (self2) => self2.get;
var set5 = dual(2, (self2, value) => self2.modify(() => [undefined, value]));
var getAndSet = dual(2, (self2, value) => self2.modify((a) => [a, value]));
var modify2 = dual(2, (self2, f) => self2.modify(f));
var update2 = dual(2, (self2, f) => self2.modify((a) => [undefined, f(a)]));

// node_modules/effect/dist/esm/Ref.js
var make28 = make27;
var get12 = get11;
var getAndSet2 = getAndSet;
var modify3 = modify2;
var update3 = update2;

// node_modules/effect/dist/esm/Tracer.js
var tracerWith2 = tracerWith;

// node_modules/effect/dist/esm/internal/fiberRefs/patch.js
var OP_EMPTY2 = "Empty";
var OP_ADD = "Add";
var OP_REMOVE = "Remove";
var OP_UPDATE = "Update";
var OP_AND_THEN = "AndThen";
var empty26 = {
  _tag: OP_EMPTY2
};
var diff8 = (oldValue, newValue) => {
  const missingLocals = new Map(oldValue.locals);
  let patch9 = empty26;
  for (const [fiberRef, pairs] of newValue.locals.entries()) {
    const newValue2 = headNonEmpty(pairs)[1];
    const old = missingLocals.get(fiberRef);
    if (old !== undefined) {
      const oldValue2 = headNonEmpty(old)[1];
      if (!equals(oldValue2, newValue2)) {
        patch9 = combine10({
          _tag: OP_UPDATE,
          fiberRef,
          patch: fiberRef.diff(oldValue2, newValue2)
        })(patch9);
      }
    } else {
      patch9 = combine10({
        _tag: OP_ADD,
        fiberRef,
        value: newValue2
      })(patch9);
    }
    missingLocals.delete(fiberRef);
  }
  for (const [fiberRef] of missingLocals.entries()) {
    patch9 = combine10({
      _tag: OP_REMOVE,
      fiberRef
    })(patch9);
  }
  return patch9;
};
var combine10 = dual(2, (self2, that) => ({
  _tag: OP_AND_THEN,
  first: self2,
  second: that
}));
var patch9 = dual(3, (self2, fiberId2, oldValue) => {
  let fiberRefs2 = oldValue;
  let patches = of(self2);
  while (isNonEmptyReadonlyArray(patches)) {
    const head3 = headNonEmpty(patches);
    const tail = tailNonEmpty(patches);
    switch (head3._tag) {
      case OP_EMPTY2: {
        patches = tail;
        break;
      }
      case OP_ADD: {
        fiberRefs2 = updateAs(fiberRefs2, {
          fiberId: fiberId2,
          fiberRef: head3.fiberRef,
          value: head3.value
        });
        patches = tail;
        break;
      }
      case OP_REMOVE: {
        fiberRefs2 = delete_(fiberRefs2, head3.fiberRef);
        patches = tail;
        break;
      }
      case OP_UPDATE: {
        const value = getOrDefault(fiberRefs2, head3.fiberRef);
        fiberRefs2 = updateAs(fiberRefs2, {
          fiberId: fiberId2,
          fiberRef: head3.fiberRef,
          value: head3.fiberRef.patch(head3.patch)(value)
        });
        patches = tail;
        break;
      }
      case OP_AND_THEN: {
        patches = prepend(head3.first)(prepend(head3.second)(tail));
        break;
      }
    }
  }
  return fiberRefs2;
});

// node_modules/effect/dist/esm/internal/metric/label.js
var MetricLabelSymbolKey = "effect/MetricLabel";
var MetricLabelTypeId = Symbol.for(MetricLabelSymbolKey);

class MetricLabelImpl {
  key;
  value;
  [MetricLabelTypeId] = MetricLabelTypeId;
  _hash;
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this._hash = string(MetricLabelSymbolKey + this.key + this.value);
  }
  [symbol]() {
    return this._hash;
  }
  [symbol2](that) {
    return isMetricLabel(that) && this.key === that.key && this.value === that.value;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
var make29 = (key, value) => {
  return new MetricLabelImpl(key, value);
};
var isMetricLabel = (u) => hasProperty(u, MetricLabelTypeId);

// node_modules/effect/dist/esm/internal/core-effect.js
var annotateLogs = dual((args) => isEffect(args[0]), function() {
  const args = arguments;
  return fiberRefLocallyWith(args[0], currentLogAnnotations, typeof args[1] === "string" ? set3(args[1], args[2]) : (annotations) => Object.entries(args[1]).reduce((acc, [key, value]) => set3(acc, key, value), annotations));
});
var asSome = (self2) => map9(self2, some2);
var asSomeError = (self2) => mapError(self2, some2);
var try_ = (arg) => {
  let evaluate;
  let onFailure = undefined;
  if (typeof arg === "function") {
    evaluate = arg;
  } else {
    evaluate = arg.try;
    onFailure = arg.catch;
  }
  return sync(() => {
    try {
      return evaluate();
    } catch (error) {
      throw makeEffectError(fail(onFailure ? onFailure(error) : new UnknownException(error)));
    }
  });
};
var _catch = dual(3, (self2, tag, options) => catchAll(self2, (e) => {
  if (hasProperty(e, tag) && e[tag] === options.failure) {
    return options.onFailure(e);
  }
  return fail2(e);
}));
var catchAllDefect = dual(2, (self2, f) => catchAllCause(self2, (cause) => {
  const option = find(cause, (_) => isDieType(_) ? some2(_) : none2());
  switch (option._tag) {
    case "None": {
      return failCause(cause);
    }
    case "Some": {
      return f(option.value.defect);
    }
  }
}));
var catchSomeCause = dual(2, (self2, f) => matchCauseEffect(self2, {
  onFailure: (cause) => {
    const option = f(cause);
    switch (option._tag) {
      case "None": {
        return failCause(cause);
      }
      case "Some": {
        return option.value;
      }
    }
  },
  onSuccess: succeed
}));
var catchSomeDefect = dual(2, (self2, pf) => catchAllCause(self2, (cause) => {
  const option = find(cause, (_) => isDieType(_) ? some2(_) : none2());
  switch (option._tag) {
    case "None": {
      return failCause(cause);
    }
    case "Some": {
      const optionEffect = pf(option.value.defect);
      return optionEffect._tag === "Some" ? optionEffect.value : failCause(cause);
    }
  }
}));
var catchTag = dual(3, (self2, k, f) => catchIf(self2, isTagged(k), f));
var catchTags = dual(2, (self2, cases) => {
  let keys3;
  return catchIf(self2, (e) => {
    keys3 ??= Object.keys(cases);
    return hasProperty(e, "_tag") && isString(e["_tag"]) && keys3.includes(e["_tag"]);
  }, (e) => cases[e["_tag"]](e));
});
var cause = (self2) => matchCause(self2, {
  onFailure: identity,
  onSuccess: () => empty20
});
var clockWith3 = clockWith2;
var clock2 = clockWith3(succeed);
var delay = dual(2, (self2, duration) => zipRight(sleep2(duration), self2));
var descriptorWith = (f) => withFiberRuntime((state, status) => f({
  id: state.id(),
  status,
  interruptors: interruptors(state.getFiberRef(currentInterruptedCause))
}));
var allowInterrupt = descriptorWith((descriptor) => size14(descriptor.interruptors) > 0 ? interrupt2 : void_);
var descriptor = descriptorWith(succeed);
var diffFiberRefs = (self2) => summarized(self2, fiberRefs2, diff8);
var diffFiberRefsAndRuntimeFlags = (self2) => summarized(self2, zip2(fiberRefs2, runtimeFlags), ([refs, flags], [refsNew, flagsNew]) => [diff8(refs, refsNew), diff7(flags, flagsNew)]);
var Do = succeed({});
var bind2 = bind(map9, flatMap7);
var bindTo2 = bindTo(map9);
var let_2 = let_(map9);
var dropUntil = dual(2, (elements, predicate) => suspend(() => {
  const iterator = elements[Symbol.iterator]();
  const builder = [];
  let next2;
  let dropping = succeed(false);
  let i = 0;
  while ((next2 = iterator.next()) && !next2.done) {
    const a = next2.value;
    const index2 = i++;
    dropping = flatMap7(dropping, (bool) => {
      if (bool) {
        builder.push(a);
        return succeed(true);
      }
      return predicate(a, index2);
    });
  }
  return map9(dropping, () => builder);
}));
var dropWhile = dual(2, (elements, predicate) => suspend(() => {
  const iterator = elements[Symbol.iterator]();
  const builder = [];
  let next2;
  let dropping = succeed(true);
  let i = 0;
  while ((next2 = iterator.next()) && !next2.done) {
    const a = next2.value;
    const index2 = i++;
    dropping = flatMap7(dropping, (d) => map9(d ? predicate(a, index2) : succeed(false), (b) => {
      if (!b) {
        builder.push(a);
      }
      return b;
    }));
  }
  return map9(dropping, () => builder);
}));
var contextWith = (f) => map9(context2(), f);
var eventually = (self2) => orElse(self2, () => flatMap7(yieldNow(), () => eventually(self2)));
var filterMap3 = dual(2, (elements, pf) => map9(forEachSequential(elements, identity), filterMap(pf)));
var filterOrDie = dual(3, (self2, predicate, orDieWith2) => filterOrElse(self2, predicate, (a) => dieSync(() => orDieWith2(a))));
var filterOrDieMessage = dual(3, (self2, predicate, message) => filterOrElse(self2, predicate, () => dieMessage(message)));
var filterOrElse = dual(3, (self2, predicate, orElse2) => flatMap7(self2, (a) => predicate(a) ? succeed(a) : orElse2(a)));
var liftPredicate = dual(3, (self2, predicate, orFailWith) => suspend(() => predicate(self2) ? succeed(self2) : fail2(orFailWith(self2))));
var filterOrFail = dual((args) => isEffect(args[0]), (self2, predicate, orFailWith) => filterOrElse(self2, predicate, (a) => orFailWith === undefined ? fail2(new NoSuchElementException) : failSync(() => orFailWith(a))));
var findFirst4 = dual(2, (elements, f) => suspend(() => {
  const iterator = elements[Symbol.iterator]();
  const next2 = iterator.next();
  if (!next2.done) {
    return findLoop(iterator, 0, f, next2.value);
  }
  return succeed(none2());
}));
var findLoop = (iterator, index2, f, value) => flatMap7(f(value, index2), (result) => {
  if (result) {
    return succeed(some2(value));
  }
  const next2 = iterator.next();
  if (!next2.done) {
    return findLoop(iterator, index2 + 1, f, next2.value);
  }
  return succeed(none2());
});
var firstSuccessOf = (effects) => suspend(() => {
  const list = fromIterable2(effects);
  if (!isNonEmpty(list)) {
    return dieSync(() => new IllegalArgumentException(`Received an empty collection of effects`));
  }
  return pipe(tailNonEmpty2(list), reduce(headNonEmpty2(list), (left3, right3) => orElse(left3, () => right3)));
});
var flipWith = dual(2, (self2, f) => flip(f(flip(self2))));
var match6 = dual(2, (self2, options) => matchEffect(self2, {
  onFailure: (e) => succeed(options.onFailure(e)),
  onSuccess: (a) => succeed(options.onSuccess(a))
}));
var every4 = dual(2, (elements, f) => suspend(() => forAllLoop(elements[Symbol.iterator](), 0, f)));
var forAllLoop = (iterator, index2, f) => {
  const next2 = iterator.next();
  return next2.done ? succeed(true) : flatMap7(f(next2.value, index2), (b) => b ? forAllLoop(iterator, index2 + 1, f) : succeed(b));
};
var forever = (self2) => {
  const loop = flatMap7(flatMap7(self2, () => yieldNow()), () => loop);
  return loop;
};
var gen2 = function() {
  let f;
  if (arguments.length === 1) {
    f = arguments[0];
  } else {
    f = arguments[1].bind(arguments[0]);
  }
  return suspend(() => {
    const iterator = f(pipe);
    const state = internalCall(() => iterator.next());
    const run = (state2) => {
      return state2.done ? succeed(state2.value) : flatMap7(yieldWrapGet(state2.value), (val) => run(internalCall(() => iterator.next(val))));
    };
    return run(state);
  });
};
var fiberRefs2 = withFiberRuntime((state) => succeed(state.getFiberRefs()));
var head3 = (self2) => flatMap7(self2, (as2) => {
  const iterator = as2[Symbol.iterator]();
  const next2 = iterator.next();
  if (next2.done) {
    return fail2(new NoSuchElementException);
  }
  return succeed(next2.value);
});
var ignore = (self2) => match6(self2, {
  onFailure: constVoid,
  onSuccess: constVoid
});
var ignoreLogged = (self2) => matchCauseEffect(self2, {
  onFailure: (cause2) => logDebug(cause2, "An error was silently ignored because it is not anticipated to be useful"),
  onSuccess: () => void_
});
var inheritFiberRefs = (childFiberRefs) => updateFiberRefs((parentFiberId, parentFiberRefs) => joinAs2(parentFiberRefs, parentFiberId, childFiberRefs));
var isFailure = (self2) => match6(self2, {
  onFailure: constTrue,
  onSuccess: constFalse
});
var isSuccess = (self2) => match6(self2, {
  onFailure: constFalse,
  onSuccess: constTrue
});
var iterate = (initial, options) => suspend(() => {
  if (options.while(initial)) {
    return flatMap7(options.body(initial), (z2) => iterate(z2, options));
  }
  return succeed(initial);
});
var logWithLevel = (level) => (...message) => {
  const levelOption = fromNullable(level);
  let cause2 = undefined;
  for (let i = 0, len = message.length;i < len; i++) {
    const msg = message[i];
    if (isCause(msg)) {
      if (cause2 !== undefined) {
        cause2 = sequential(cause2, msg);
      } else {
        cause2 = msg;
      }
      message = [...message.slice(0, i), ...message.slice(i + 1)];
      i--;
    }
  }
  if (cause2 === undefined) {
    cause2 = empty20;
  }
  return withFiberRuntime((fiberState) => {
    fiberState.log(message, cause2, levelOption);
    return void_;
  });
};
var log8 = logWithLevel();
var logTrace = logWithLevel(Trace);
var logDebug = logWithLevel(Debug);
var logInfo = logWithLevel(Info);
var logWarning = logWithLevel(Warning);
var logError = logWithLevel(Error2);
var logFatal = logWithLevel(Fatal);
var withLogSpan = dual(2, (effect, label) => flatMap7(currentTimeMillis2, (now) => fiberRefLocallyWith(effect, currentLogSpan, prepend3(make26(label, now)))));
var logAnnotations = fiberRefGet(currentLogAnnotations);
var loop = (initial, options) => options.discard ? loopDiscard(initial, options.while, options.step, options.body) : map9(loopInternal(initial, options.while, options.step, options.body), fromIterable);
var loopInternal = (initial, cont, inc, body) => suspend(() => cont(initial) ? flatMap7(body(initial), (a) => map9(loopInternal(inc(initial), cont, inc, body), prepend3(a))) : sync(() => empty10()));
var loopDiscard = (initial, cont, inc, body) => suspend(() => cont(initial) ? flatMap7(body(initial), () => loopDiscard(inc(initial), cont, inc, body)) : void_);
var mapAccum2 = dual(3, (elements, zero3, f) => suspend(() => {
  const iterator = elements[Symbol.iterator]();
  const builder = [];
  let result = succeed(zero3);
  let next2;
  let i = 0;
  while (!(next2 = iterator.next()).done) {
    const index2 = i++;
    const value = next2.value;
    result = flatMap7(result, (state) => map9(f(state, value, index2), ([z, b]) => {
      builder.push(b);
      return z;
    }));
  }
  return map9(result, (z) => [z, builder]);
}));
var mapErrorCause = dual(2, (self2, f) => matchCauseEffect(self2, {
  onFailure: (c) => failCauseSync(() => f(c)),
  onSuccess: succeed
}));
var memoize = (self2) => pipe(deferredMake(), flatMap7((deferred) => pipe(diffFiberRefsAndRuntimeFlags(self2), intoDeferred(deferred), once, map9((complete) => zipRight(complete, pipe(deferredAwait(deferred), flatMap7(([patch10, a]) => as(zip2(patchFiberRefs(patch10[0]), updateRuntimeFlags(patch10[1])), a))))))));
var merge5 = (self2) => matchEffect(self2, {
  onFailure: (e) => succeed(e),
  onSuccess: succeed
});
var negate = (self2) => map9(self2, (b) => !b);
var none6 = (self2) => flatMap7(self2, (option) => {
  switch (option._tag) {
    case "None":
      return void_;
    case "Some":
      return fail2(new NoSuchElementException);
  }
});
var once = (self2) => map9(make28(true), (ref) => asVoid(whenEffect(self2, getAndSet2(ref, false))));
var option = (self2) => matchEffect(self2, {
  onFailure: () => succeed(none2()),
  onSuccess: (a) => succeed(some2(a))
});
var orElseFail = dual(2, (self2, evaluate) => orElse(self2, () => failSync(evaluate)));
var orElseSucceed = dual(2, (self2, evaluate) => orElse(self2, () => sync(evaluate)));
var parallelErrors = (self2) => matchCauseEffect(self2, {
  onFailure: (cause2) => {
    const errors12 = fromIterable(failures(cause2));
    return errors12.length === 0 ? failCause(cause2) : fail2(errors12);
  },
  onSuccess: succeed
});
var patchFiberRefs = (patch10) => updateFiberRefs((fiberId2, fiberRefs3) => pipe(patch10, patch9(fiberId2, fiberRefs3)));
var promise = (evaluate) => evaluate.length >= 1 ? async((resolve, signal) => {
  evaluate(signal).then((a) => resolve(exitSucceed(a)), (e) => resolve(exitDie(e)));
}) : async((resolve) => {
  evaluate().then((a) => resolve(exitSucceed(a)), (e) => resolve(exitDie(e)));
});
var provideService = dual(3, (self2, tag, service) => contextWithEffect((env) => provideContext(self2, add2(env, tag, service))));
var provideServiceEffect = dual(3, (self2, tag, effect) => contextWithEffect((env) => flatMap7(effect, (service) => provideContext(self2, pipe(env, add2(tag, service))))));
var random2 = randomWith(succeed);
var reduce9 = dual(3, (elements, zero3, f) => fromIterable(elements).reduce((acc, el, i) => flatMap7(acc, (a) => f(a, el, i)), succeed(zero3)));
var reduceRight2 = dual(3, (elements, zero3, f) => fromIterable(elements).reduceRight((acc, el, i) => flatMap7(acc, (a) => f(el, a, i)), succeed(zero3)));
var reduceWhile = dual(3, (elements, zero3, options) => flatMap7(sync(() => elements[Symbol.iterator]()), (iterator) => reduceWhileLoop(iterator, 0, zero3, options.while, options.body)));
var reduceWhileLoop = (iterator, index2, state, predicate, f) => {
  const next2 = iterator.next();
  if (!next2.done && predicate(state)) {
    return flatMap7(f(state, next2.value, index2), (nextState) => reduceWhileLoop(iterator, index2 + 1, nextState, predicate, f));
  }
  return succeed(state);
};
var repeatN = dual(2, (self2, n) => suspend(() => repeatNLoop(self2, n)));
var repeatNLoop = (self2, n) => flatMap7(self2, (a) => n <= 0 ? succeed(a) : zipRight(yieldNow(), repeatNLoop(self2, n - 1)));
var sandbox = (self2) => matchCauseEffect(self2, {
  onFailure: fail2,
  onSuccess: succeed
});
var setFiberRefs = (fiberRefs3) => suspend(() => setAll2(fiberRefs3));
var sleep3 = sleep2;
var succeedNone = succeed(none2());
var succeedSome = (value) => succeed(some2(value));
var summarized = dual(3, (self2, summary, f) => flatMap7(summary, (start) => flatMap7(self2, (value) => map9(summary, (end) => [f(start, end), value]))));
var tagMetrics = dual((args) => isEffect(args[0]), function() {
  return labelMetrics(arguments[0], typeof arguments[1] === "string" ? [make29(arguments[1], arguments[2])] : Object.entries(arguments[1]).map(([k, v]) => make29(k, v)));
});
var labelMetrics = dual(2, (self2, labels) => fiberRefLocallyWith(self2, currentMetricLabels, (old) => union(old, labels)));
var takeUntil = dual(2, (elements, predicate) => suspend(() => {
  const iterator = elements[Symbol.iterator]();
  const builder = [];
  let next2;
  let effect = succeed(false);
  let i = 0;
  while ((next2 = iterator.next()) && !next2.done) {
    const a = next2.value;
    const index2 = i++;
    effect = flatMap7(effect, (bool) => {
      if (bool) {
        return succeed(true);
      }
      builder.push(a);
      return predicate(a, index2);
    });
  }
  return map9(effect, () => builder);
}));
var takeWhile = dual(2, (elements, predicate) => suspend(() => {
  const iterator = elements[Symbol.iterator]();
  const builder = [];
  let next2;
  let taking = succeed(true);
  let i = 0;
  while ((next2 = iterator.next()) && !next2.done) {
    const a = next2.value;
    const index2 = i++;
    taking = flatMap7(taking, (taking2) => pipe(taking2 ? predicate(a, index2) : succeed(false), map9((bool) => {
      if (bool) {
        builder.push(a);
      }
      return bool;
    })));
  }
  return map9(taking, () => builder);
}));
var tapBoth = dual(2, (self2, {
  onFailure,
  onSuccess
}) => matchCauseEffect(self2, {
  onFailure: (cause2) => {
    const either3 = failureOrCause(cause2);
    switch (either3._tag) {
      case "Left": {
        return zipRight(onFailure(either3.left), failCause(cause2));
      }
      case "Right": {
        return failCause(cause2);
      }
    }
  },
  onSuccess: (a) => as(onSuccess(a), a)
}));
var tapDefect = dual(2, (self2, f) => catchAllCause(self2, (cause2) => match2(keepDefects(cause2), {
  onNone: () => failCause(cause2),
  onSome: (a) => zipRight(f(a), failCause(cause2))
})));
var tapError = dual(2, (self2, f) => matchCauseEffect(self2, {
  onFailure: (cause2) => {
    const either3 = failureOrCause(cause2);
    switch (either3._tag) {
      case "Left":
        return zipRight(f(either3.left), failCause(cause2));
      case "Right":
        return failCause(cause2);
    }
  },
  onSuccess: succeed
}));
var tapErrorTag = dual(3, (self2, k, f) => tapError(self2, (e) => {
  if (isTagged(e, k)) {
    return f(e);
  }
  return void_;
}));
var tapErrorCause = dual(2, (self2, f) => matchCauseEffect(self2, {
  onFailure: (cause2) => zipRight(f(cause2), failCause(cause2)),
  onSuccess: succeed
}));
var timed = (self2) => timedWith(self2, currentTimeNanos2);
var timedWith = dual(2, (self2, nanos2) => summarized(self2, nanos2, (start, end) => nanos(end - start)));
var tracerWith3 = tracerWith2;
var tracer = tracerWith3(succeed);
var tryPromise = (arg) => {
  let evaluate;
  let catcher = undefined;
  if (typeof arg === "function") {
    evaluate = arg;
  } else {
    evaluate = arg.try;
    catcher = arg.catch;
  }
  if (evaluate.length >= 1) {
    return async((resolve, signal) => {
      try {
        evaluate(signal).then((a) => resolve(exitSucceed(a)), (e) => resolve(fail2(catcher ? catcher(e) : new UnknownException(e))));
      } catch (e) {
        resolve(fail2(catcher ? catcher(e) : new UnknownException(e)));
      }
    });
  }
  return async((resolve) => {
    try {
      evaluate().then((a) => resolve(exitSucceed(a)), (e) => resolve(fail2(catcher ? catcher(e) : new UnknownException(e))));
    } catch (e) {
      resolve(fail2(catcher ? catcher(e) : new UnknownException(e)));
    }
  });
};
var tryMap = dual(2, (self2, options) => flatMap7(self2, (a) => try_({
  try: () => options.try(a),
  catch: options.catch
})));
var tryMapPromise = dual(2, (self2, options) => flatMap7(self2, (a) => tryPromise({
  try: options.try.length >= 1 ? (signal) => options.try(a, signal) : () => options.try(a),
  catch: options.catch
})));
var unless = dual(2, (self2, condition) => suspend(() => condition() ? succeedNone : asSome(self2)));
var unlessEffect = dual(2, (self2, condition) => flatMap7(condition, (b) => b ? succeedNone : asSome(self2)));
var unsandbox = (self2) => mapErrorCause(self2, flatten3);
var updateFiberRefs = (f) => withFiberRuntime((state) => {
  state.setFiberRefs(f(state.id(), state.getFiberRefs()));
  return void_;
});
var updateService = dual(3, (self2, tag, f) => mapInputContext(self2, (context3) => add2(context3, tag, f(unsafeGet3(context3, tag)))));
var when = dual(2, (self2, condition) => suspend(() => condition() ? map9(self2, some2) : succeed(none2())));
var whenFiberRef = dual(3, (self2, fiberRef, predicate) => flatMap7(fiberRefGet(fiberRef), (s) => predicate(s) ? map9(self2, (a) => [s, some2(a)]) : succeed([s, none2()])));
var whenRef = dual(3, (self2, ref, predicate) => flatMap7(get12(ref), (s) => predicate(s) ? map9(self2, (a) => [s, some2(a)]) : succeed([s, none2()])));
var withMetric = dual(2, (self2, metric) => metric(self2));
var serviceFunctionEffect = (getService, f) => (...args) => flatMap7(getService, (a) => f(a)(...args));
var serviceFunction = (getService, f) => (...args) => map9(getService, (a) => f(a)(...args));
var serviceFunctions = (getService) => new Proxy({}, {
  get(_target, prop, _receiver) {
    return (...args) => flatMap7(getService, (s) => s[prop](...args));
  }
});
var serviceConstants = (getService) => new Proxy({}, {
  get(_target, prop, _receiver) {
    return flatMap7(getService, (s) => isEffect(s[prop]) ? s[prop] : succeed(s[prop]));
  }
});
var serviceMembers = (getService) => ({
  functions: serviceFunctions(getService),
  constants: serviceConstants(getService)
});
var serviceOption = (tag) => map9(context2(), getOption2(tag));
var serviceOptional = (tag) => flatMap7(context2(), getOption2(tag));
var annotateCurrentSpan = function() {
  const args = arguments;
  return ignore(flatMap7(currentSpan, (span2) => sync(() => {
    if (typeof args[0] === "string") {
      span2.attribute(args[0], args[1]);
    } else {
      for (const key in args[0]) {
        span2.attribute(key, args[0][key]);
      }
    }
  })));
};
var annotateSpans = dual((args) => isEffect(args[0]), function() {
  const args = arguments;
  return fiberRefLocallyWith(args[0], currentTracerSpanAnnotations, typeof args[1] === "string" ? set3(args[1], args[2]) : (annotations) => Object.entries(args[1]).reduce((acc, [key, value]) => set3(acc, key, value), annotations));
});
var currentParentSpan = serviceOptional(spanTag);
var currentSpan = flatMap7(context2(), (context3) => {
  const span2 = context3.unsafeMap.get(spanTag.key);
  return span2 !== undefined && span2._tag === "Span" ? succeed(span2) : fail2(new NoSuchElementException);
});
var linkSpans = dual((args) => isEffect(args[0]), (self2, span2, attributes) => fiberRefLocallyWith(self2, currentTracerSpanLinks, append2({
  _tag: "SpanLink",
  span: span2,
  attributes: attributes ?? {}
})));
var bigint03 = BigInt(0);
var unsafeMakeSpan = (fiber, name, options) => {
  const enabled2 = fiber.getFiberRef(currentTracerEnabled);
  if (enabled2 === false) {
    return noopSpan(name);
  }
  const context3 = fiber.getFiberRef(currentContext);
  const services = fiber.getFiberRef(currentServices);
  const tracer2 = get3(services, tracerTag);
  const clock3 = get3(services, Clock);
  const timingEnabled = fiber.getFiberRef(currentTracerTimingEnabled);
  const fiberRefs3 = fiber.getFiberRefs();
  const annotationsFromEnv = get10(fiberRefs3, currentTracerSpanAnnotations);
  const linksFromEnv = get10(fiberRefs3, currentTracerSpanLinks);
  const parent = options.parent ? some2(options.parent) : options.root ? none2() : getOption2(context3, spanTag);
  const links = linksFromEnv._tag === "Some" ? options.links !== undefined ? [...toReadonlyArray(linksFromEnv.value), ...options.links ?? []] : toReadonlyArray(linksFromEnv.value) : options.links ?? empty2();
  const span2 = tracer2.span(name, parent, options.context ?? empty4(), links, timingEnabled ? clock3.unsafeCurrentTimeNanos() : bigint03, options.kind ?? "internal");
  if (typeof options.captureStackTrace === "function") {
    spanToTrace.set(span2, options.captureStackTrace);
  }
  if (annotationsFromEnv._tag === "Some") {
    forEach4(annotationsFromEnv.value, (value, key) => span2.attribute(key, value));
  }
  if (options.attributes !== undefined) {
    Object.entries(options.attributes).forEach(([k, v]) => span2.attribute(k, v));
  }
  return span2;
};
var makeSpan = (name, options) => {
  options = addSpanStackTrace(options);
  return withFiberRuntime((fiber) => succeed(unsafeMakeSpan(fiber, name, options)));
};
var spanAnnotations = fiberRefGet(currentTracerSpanAnnotations);
var spanLinks = fiberRefGet(currentTracerSpanLinks);
var endSpan = (span2, exit2, clock3, timingEnabled) => sync(() => {
  if (span2.status._tag === "Ended") {
    return;
  }
  if (exitIsFailure(exit2) && spanToTrace.has(span2)) {
    span2.attribute("code.stacktrace", spanToTrace.get(span2)());
  }
  span2.end(timingEnabled ? clock3.unsafeCurrentTimeNanos() : bigint03, exit2);
});
var useSpan = (name, ...args) => {
  const options = addSpanStackTrace(args.length === 1 ? undefined : args[0]);
  const evaluate = args[args.length - 1];
  return withFiberRuntime((fiber) => {
    const span2 = unsafeMakeSpan(fiber, name, options);
    const timingEnabled = fiber.getFiberRef(currentTracerTimingEnabled);
    const clock3 = get3(fiber.getFiberRef(currentServices), clockTag);
    return onExit(evaluate(span2), (exit2) => endSpan(span2, exit2, clock3, timingEnabled));
  });
};
var withParentSpan = dual(2, (self2, span2) => provideService(self2, spanTag, span2));
var withSpan = function() {
  const dataFirst = typeof arguments[0] !== "string";
  const name = dataFirst ? arguments[1] : arguments[0];
  const options = addSpanStackTrace(dataFirst ? arguments[2] : arguments[1]);
  if (dataFirst) {
    const self2 = arguments[0];
    return useSpan(name, options, (span2) => withParentSpan(self2, span2));
  }
  return (self2) => useSpan(name, options, (span2) => withParentSpan(self2, span2));
};
var functionWithSpan = (options) => function() {
  let captureStackTrace = options.captureStackTrace ?? false;
  if (options.captureStackTrace !== false) {
    const limit = Error.stackTraceLimit;
    Error.stackTraceLimit = 2;
    const error = new Error;
    Error.stackTraceLimit = limit;
    let cache2 = false;
    captureStackTrace = () => {
      if (cache2 !== false) {
        return cache2;
      }
      if (error.stack) {
        const stack = error.stack.trim().split("\n");
        cache2 = stack.slice(2).join("\n").trim();
        return cache2;
      }
    };
  }
  return suspend(() => {
    const opts = typeof options.options === "function" ? options.options.apply(null, arguments) : options.options;
    return withSpan(suspend(() => internalCall(() => options.body.apply(this, arguments))), opts.name, {
      ...opts,
      captureStackTrace
    });
  });
};
var fromNullable2 = (value) => value == null ? fail2(new NoSuchElementException) : succeed(value);
var optionFromOptional = (self2) => catchAll(map9(self2, some2), (error) => isNoSuchElementException(error) ? succeedNone : fail2(error));

// node_modules/effect/dist/esm/Effectable.js
var EffectTypeId3 = EffectTypeId;
var EffectPrototype2 = EffectPrototype;

// node_modules/effect/dist/esm/internal/executionStrategy.js
var OP_SEQUENTIAL2 = "Sequential";
var OP_PARALLEL2 = "Parallel";
var OP_PARALLEL_N = "ParallelN";
var sequential2 = {
  _tag: OP_SEQUENTIAL2
};
var parallel2 = {
  _tag: OP_PARALLEL2
};
var parallelN = (parallelism) => ({
  _tag: OP_PARALLEL_N,
  parallelism
});
var isSequential = (self2) => self2._tag === OP_SEQUENTIAL2;
var isParallel = (self2) => self2._tag === OP_PARALLEL2;

// node_modules/effect/dist/esm/ExecutionStrategy.js
var sequential3 = sequential2;
var parallel3 = parallel2;
var parallelN2 = parallelN;

// node_modules/effect/dist/esm/FiberRefsPatch.js
var diff9 = diff8;
var patch10 = patch9;

// node_modules/effect/dist/esm/internal/fiberStatus.js
var FiberStatusSymbolKey = "effect/FiberStatus";
var FiberStatusTypeId = Symbol.for(FiberStatusSymbolKey);
var OP_DONE = "Done";
var OP_RUNNING = "Running";
var OP_SUSPENDED = "Suspended";
var DoneHash = string(`${FiberStatusSymbolKey}-${OP_DONE}`);

class Done {
  [FiberStatusTypeId] = FiberStatusTypeId;
  _tag = OP_DONE;
  [symbol]() {
    return DoneHash;
  }
  [symbol2](that) {
    return isFiberStatus(that) && that._tag === OP_DONE;
  }
}

class Running {
  runtimeFlags;
  [FiberStatusTypeId] = FiberStatusTypeId;
  _tag = OP_RUNNING;
  constructor(runtimeFlags2) {
    this.runtimeFlags = runtimeFlags2;
  }
  [symbol]() {
    return pipe(hash3(FiberStatusSymbolKey), combine(hash3(this._tag)), combine(hash3(this.runtimeFlags)), cached(this));
  }
  [symbol2](that) {
    return isFiberStatus(that) && that._tag === OP_RUNNING && this.runtimeFlags === that.runtimeFlags;
  }
}

class Suspended {
  runtimeFlags;
  blockingOn;
  [FiberStatusTypeId] = FiberStatusTypeId;
  _tag = OP_SUSPENDED;
  constructor(runtimeFlags2, blockingOn) {
    this.runtimeFlags = runtimeFlags2;
    this.blockingOn = blockingOn;
  }
  [symbol]() {
    return pipe(hash3(FiberStatusSymbolKey), combine(hash3(this._tag)), combine(hash3(this.runtimeFlags)), combine(hash3(this.blockingOn)), cached(this));
  }
  [symbol2](that) {
    return isFiberStatus(that) && that._tag === OP_SUSPENDED && this.runtimeFlags === that.runtimeFlags && equals(this.blockingOn, that.blockingOn);
  }
}
var done3 = new Done;
var running = (runtimeFlags2) => new Running(runtimeFlags2);
var suspended = (runtimeFlags2, blockingOn) => new Suspended(runtimeFlags2, blockingOn);
var isFiberStatus = (u) => hasProperty(u, FiberStatusTypeId);
var isDone = (self2) => self2._tag === OP_DONE;

// node_modules/effect/dist/esm/FiberStatus.js
var done4 = done3;
var running2 = running;
var suspended2 = suspended;
var isDone2 = isDone;

// node_modules/effect/dist/esm/Micro.js
var TypeId14 = Symbol.for("effect/Micro");
var runSymbol = Symbol.for("effect/Micro/runSymbol");
var MicroCauseTypeId = Symbol.for("effect/Micro/MicroCause");
var microCauseVariance = {
  _E: identity
};

class MicroCauseImpl extends globalThis.Error {
  _tag;
  traces;
  [MicroCauseTypeId];
  constructor(_tag, originalError, traces) {
    const causeName = `MicroCause.${_tag}`;
    let name;
    let message;
    let stack;
    if (originalError instanceof globalThis.Error) {
      name = `(${causeName}) ${originalError.name}`;
      message = originalError.message;
      const messageLines = message.split("\n").length;
      stack = originalError.stack ? `(${causeName}) ${originalError.stack.split("\n").slice(0, messageLines + 3).join("\n")}` : `${name}: ${message}`;
    } else {
      name = causeName;
      message = toStringUnknown(originalError, 0);
      stack = `${name}: ${message}`;
    }
    if (traces.length > 0) {
      stack += `\n    ${traces.join("\n    ")}`;
    }
    super(message);
    this._tag = _tag;
    this.traces = traces;
    this[MicroCauseTypeId] = microCauseVariance;
    this.name = name;
    this.stack = stack;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toString() {
    return this.stack;
  }
  [NodeInspectSymbol]() {
    return this.stack;
  }
}
var EnvTypeId = Symbol.for("effect/Micro/Env");
var EnvRefTypeId = Symbol.for("effect/Micro/EnvRef");
var EnvProto = {
  [EnvTypeId]: {
    _R: identity
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var envMake = (refs) => {
  const self2 = Object.create(EnvProto);
  self2.refs = refs;
  return self2;
};
var envUnsafeMakeEmpty = () => {
  const controller = new AbortController;
  const refs = Object.create(null);
  refs[currentAbortController.key] = controller;
  refs[currentAbortSignal.key] = controller.signal;
  refs[currentScheduler.key] = new MicroSchedulerDefault;
  return envMake(refs);
};
var envGet = dual(2, (self2, ref) => (ref.key in self2.refs) ? self2.refs[ref.key] : ref.initial);
var envSet = dual(3, (self2, ref, value) => {
  const refs = Object.assign(Object.create(null), self2.refs);
  refs[ref.key] = value;
  return envMake(refs);
});
var setImmediate = "setImmediate" in globalThis ? globalThis.setImmediate : (f) => setTimeout(f, 0);

class MicroSchedulerDefault {
  tasks = [];
  running = false;
  scheduleTask(task, _priority) {
    this.tasks.push(task);
    if (!this.running) {
      this.running = true;
      setImmediate(this.afterScheduled);
    }
  }
  afterScheduled = () => {
    this.running = false;
    this.runTasks();
  };
  runTasks() {
    const tasks = this.tasks;
    this.tasks = [];
    for (let i = 0, len = tasks.length;i < len; i++) {
      tasks[i]();
    }
  }
  shouldYield(_env) {
    return false;
  }
  flush() {
    while (this.tasks.length > 0) {
      this.runTasks();
    }
  }
}
var EnvRefProto = {
  [EnvRefTypeId]: EnvRefTypeId
};
var envRefMake = (key, initial) => globalValue(key, () => {
  const self2 = Object.create(EnvRefProto);
  self2.key = key;
  self2.initial = initial();
  return self2;
});
var currentAbortController = envRefMake("effect/Micro/currentAbortController", () => {
  return;
});
var currentAbortSignal = envRefMake("effect/Micro/currentAbortSignal", () => {
  return;
});
var currentContext2 = envRefMake("effect/Micro/currentContext", () => empty4());
var currentScheduler = envRefMake("effect/Micro/currentScheduler", () => new MicroSchedulerDefault);
var MicroProto = {
  ...EffectPrototype2,
  _op: "Micro",
  [TypeId14]: {
    _A: identity,
    _E: identity,
    _R: identity
  },
  [Symbol.iterator]() {
    return new SingleShotGen2(new YieldWrap(this));
  }
};

// node_modules/effect/dist/esm/Scheduler.js
class PriorityBuckets {
  buckets = [];
  scheduleTask(task, priority) {
    let bucket = undefined;
    let index2;
    for (index2 = 0;index2 < this.buckets.length; index2++) {
      if (this.buckets[index2][0] <= priority) {
        bucket = this.buckets[index2];
      } else {
        break;
      }
    }
    if (bucket) {
      bucket[1].push(task);
    } else {
      const newBuckets = [];
      for (let i = 0;i < index2; i++) {
        newBuckets.push(this.buckets[i]);
      }
      newBuckets.push([priority, [task]]);
      for (let i = index2;i < this.buckets.length; i++) {
        newBuckets.push(this.buckets[i]);
      }
      this.buckets = newBuckets;
    }
  }
}

class MixedScheduler {
  maxNextTickBeforeTimer;
  running = false;
  tasks = new PriorityBuckets;
  constructor(maxNextTickBeforeTimer) {
    this.maxNextTickBeforeTimer = maxNextTickBeforeTimer;
  }
  starveInternal(depth) {
    const tasks = this.tasks.buckets;
    this.tasks.buckets = [];
    for (const [_, toRun] of tasks) {
      for (let i = 0;i < toRun.length; i++) {
        toRun[i]();
      }
    }
    if (this.tasks.buckets.length === 0) {
      this.running = false;
    } else {
      this.starve(depth);
    }
  }
  starve(depth = 0) {
    if (depth >= this.maxNextTickBeforeTimer) {
      setTimeout(() => this.starveInternal(0), 0);
    } else {
      Promise.resolve(undefined).then(() => this.starveInternal(depth + 1));
    }
  }
  shouldYield(fiber) {
    return fiber.currentOpCount > fiber.getFiberRef(currentMaxOpsBeforeYield) ? fiber.getFiberRef(currentSchedulingPriority) : false;
  }
  scheduleTask(task, priority) {
    this.tasks.scheduleTask(task, priority);
    if (!this.running) {
      this.running = true;
      this.starve();
    }
  }
}
var defaultScheduler = globalValue(Symbol.for("effect/Scheduler/defaultScheduler"), () => new MixedScheduler(2048));

class SyncScheduler {
  tasks = new PriorityBuckets;
  deferred = false;
  scheduleTask(task, priority) {
    if (this.deferred) {
      defaultScheduler.scheduleTask(task, priority);
    } else {
      this.tasks.scheduleTask(task, priority);
    }
  }
  shouldYield(fiber) {
    return fiber.currentOpCount > fiber.getFiberRef(currentMaxOpsBeforeYield) ? fiber.getFiberRef(currentSchedulingPriority) : false;
  }
  flush() {
    while (this.tasks.buckets.length > 0) {
      const tasks = this.tasks.buckets;
      this.tasks.buckets = [];
      for (const [_, toRun] of tasks) {
        for (let i = 0;i < toRun.length; i++) {
          toRun[i]();
        }
      }
    }
    this.deferred = true;
  }
}
var currentScheduler2 = globalValue(Symbol.for("effect/FiberRef/currentScheduler"), () => fiberRefUnsafeMake(defaultScheduler));
var withScheduler = dual(2, (self2, scheduler) => fiberRefLocally(self2, currentScheduler2, scheduler));

// node_modules/effect/dist/esm/internal/completedRequestMap.js
var currentRequestMap = globalValue(Symbol.for("effect/FiberRef/currentRequestMap"), () => fiberRefUnsafeMake(new Map));

// node_modules/effect/dist/esm/internal/concurrency.js
var match8 = (concurrency, sequential4, unbounded2, bounded) => {
  switch (concurrency) {
    case undefined:
      return sequential4();
    case "unbounded":
      return unbounded2();
    case "inherit":
      return fiberRefGetWith(currentConcurrency, (concurrency2) => concurrency2 === "unbounded" ? unbounded2() : concurrency2 > 1 ? bounded(concurrency2) : sequential4());
    default:
      return concurrency > 1 ? bounded(concurrency) : sequential4();
  }
};
var matchSimple = (concurrency, sequential4, concurrent) => {
  switch (concurrency) {
    case undefined:
      return sequential4();
    case "unbounded":
      return concurrent();
    case "inherit":
      return fiberRefGetWith(currentConcurrency, (concurrency2) => concurrency2 === "unbounded" || concurrency2 > 1 ? concurrent() : sequential4());
    default:
      return concurrency > 1 ? concurrent() : sequential4();
  }
};

// node_modules/effect/dist/esm/internal/fiberMessage.js
var OP_INTERRUPT_SIGNAL = "InterruptSignal";
var OP_STATEFUL = "Stateful";
var OP_RESUME = "Resume";
var OP_YIELD_NOW = "YieldNow";
var interruptSignal = (cause2) => ({
  _tag: OP_INTERRUPT_SIGNAL,
  cause: cause2
});
var stateful = (onFiber) => ({
  _tag: OP_STATEFUL,
  onFiber
});
var resume = (effect) => ({
  _tag: OP_RESUME,
  effect
});
var yieldNow2 = () => ({
  _tag: OP_YIELD_NOW
});

// node_modules/effect/dist/esm/internal/fiberScope.js
var FiberScopeSymbolKey = "effect/FiberScope";
var FiberScopeTypeId = Symbol.for(FiberScopeSymbolKey);

class Global {
  [FiberScopeTypeId] = FiberScopeTypeId;
  fiberId = none4;
  roots = new Set;
  add(_runtimeFlags, child) {
    this.roots.add(child);
    child.addObserver(() => {
      this.roots.delete(child);
    });
  }
}

class Local {
  fiberId;
  parent;
  [FiberScopeTypeId] = FiberScopeTypeId;
  constructor(fiberId2, parent) {
    this.fiberId = fiberId2;
    this.parent = parent;
  }
  add(_runtimeFlags, child) {
    this.parent.tell(stateful((parentFiber) => {
      parentFiber.addChild(child);
      child.addObserver(() => {
        parentFiber.removeChild(child);
      });
    }));
  }
}
var unsafeMake6 = (fiber) => {
  return new Local(fiber.id(), fiber);
};
var globalScope = globalValue(Symbol.for("effect/FiberScope/Global"), () => new Global);

// node_modules/effect/dist/esm/internal/fiber.js
var FiberSymbolKey = "effect/Fiber";
var FiberTypeId = Symbol.for(FiberSymbolKey);
var fiberVariance = {
  _E: (_) => _,
  _A: (_) => _
};
var fiberProto = {
  [FiberTypeId]: fiberVariance,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var RuntimeFiberSymbolKey = "effect/Fiber";
var RuntimeFiberTypeId = Symbol.for(RuntimeFiberSymbolKey);
var _await2 = (self2) => self2.await;
var inheritAll = (self2) => self2.inheritAll;
var interruptAsFork = dual(2, (self2, fiberId2) => self2.interruptAsFork(fiberId2));
var join2 = (self2) => zipLeft(flatten4(self2.await), self2.inheritAll);
var never2 = {
  ...fiberProto,
  id: () => none4,
  await: never,
  children: succeed([]),
  inheritAll: never,
  poll: succeed(none2()),
  interruptAsFork: () => never
};
var currentFiberURI = "effect/FiberCurrent";

// node_modules/effect/dist/esm/internal/logger.js
var LoggerSymbolKey = "effect/Logger";
var LoggerTypeId = Symbol.for(LoggerSymbolKey);
var loggerVariance = {
  _Message: (_) => _,
  _Output: (_) => _
};
var makeLogger = (log9) => ({
  [LoggerTypeId]: loggerVariance,
  log: log9,
  pipe() {
    return pipeArguments(this, arguments);
  }
});
var none7 = {
  [LoggerTypeId]: loggerVariance,
  log: constVoid,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var stringLogger = makeLogger(({
  annotations,
  cause: cause2,
  date,
  fiberId: fiberId2,
  logLevel,
  message,
  spans
}) => {
  const nowMillis = date.getTime();
  const outputArray = [`timestamp=${date.toISOString()}`, `level=${logLevel.label}`, `fiber=${threadName(fiberId2)}`];
  let output2 = outputArray.join(" ");
  const messageArr = ensure(message);
  for (let i = 0;i < messageArr.length; i++) {
    const stringMessage = toStringUnknown(messageArr[i]);
    if (stringMessage.length > 0) {
      output2 = output2 + " message=";
      output2 = appendQuoted(stringMessage, output2);
    }
  }
  if (cause2 != null && cause2._tag !== "Empty") {
    output2 = output2 + " cause=";
    output2 = appendQuoted(pretty(cause2, {
      renderErrorCause: true
    }), output2);
  }
  if (isCons(spans)) {
    output2 = output2 + " ";
    let first = true;
    for (const span2 of spans) {
      if (first) {
        first = false;
      } else {
        output2 = output2 + " ";
      }
      output2 = output2 + pipe(span2, render2(nowMillis));
    }
  }
  if (size15(annotations) > 0) {
    output2 = output2 + " ";
    let first = true;
    for (const [key, value] of annotations) {
      if (first) {
        first = false;
      } else {
        output2 = output2 + " ";
      }
      output2 = output2 + filterKeyName(key);
      output2 = output2 + "=";
      output2 = appendQuoted(toStringUnknown(value), output2);
    }
  }
  return output2;
});
var escapeDoubleQuotes = (str) => `"${str.replace(/\\([\s\S])|(")/g, "\\$1$2")}"`;
var textOnly = /^[^\s"=]+$/;
var appendQuoted = (label, output2) => output2 + (label.match(textOnly) ? label : escapeDoubleQuotes(label));
var filterKeyName = (key) => key.replace(/[\s="]/g, "_");
var colors = {
  bold: "1",
  red: "31",
  green: "32",
  yellow: "33",
  blue: "34",
  cyan: "36",
  white: "37",
  gray: "90",
  black: "30",
  bgBrightRed: "101"
};
var logLevelColors = {
  None: [],
  All: [],
  Trace: [colors.gray],
  Debug: [colors.blue],
  Info: [colors.green],
  Warning: [colors.yellow],
  Error: [colors.red],
  Fatal: [colors.bgBrightRed, colors.black]
};
var processStdoutIsTTY = typeof process === "object" && process !== null && typeof process.stdout === "object" && process.stdout !== null && process.stdout.isTTY === true;
var isWorker = typeof self === "object" && self !== null && typeof self.constructor === "function" && self.constructor.name.includes("Worker");

// node_modules/effect/dist/esm/internal/metric/boundaries.js
var MetricBoundariesSymbolKey = "effect/MetricBoundaries";
var MetricBoundariesTypeId = Symbol.for(MetricBoundariesSymbolKey);

class MetricBoundariesImpl {
  values;
  [MetricBoundariesTypeId] = MetricBoundariesTypeId;
  constructor(values3) {
    this.values = values3;
    this._hash = pipe(string(MetricBoundariesSymbolKey), combine(array2(this.values)));
  }
  _hash;
  [symbol]() {
    return this._hash;
  }
  [symbol2](u) {
    return isMetricBoundaries(u) && equals(this.values, u.values);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
var isMetricBoundaries = (u) => hasProperty(u, MetricBoundariesTypeId);
var fromIterable7 = (iterable) => {
  const values3 = pipe(iterable, appendAll(of2(Number.POSITIVE_INFINITY)), dedupe);
  return new MetricBoundariesImpl(values3);
};
var exponential = (options) => pipe(makeBy(options.count - 1, (i) => options.start * Math.pow(options.factor, i)), unsafeFromArray, fromIterable7);

// node_modules/effect/dist/esm/internal/metric/keyType.js
var MetricKeyTypeSymbolKey = "effect/MetricKeyType";
var MetricKeyTypeTypeId = Symbol.for(MetricKeyTypeSymbolKey);
var CounterKeyTypeSymbolKey = "effect/MetricKeyType/Counter";
var CounterKeyTypeTypeId = Symbol.for(CounterKeyTypeSymbolKey);
var FrequencyKeyTypeSymbolKey = "effect/MetricKeyType/Frequency";
var FrequencyKeyTypeTypeId = Symbol.for(FrequencyKeyTypeSymbolKey);
var GaugeKeyTypeSymbolKey = "effect/MetricKeyType/Gauge";
var GaugeKeyTypeTypeId = Symbol.for(GaugeKeyTypeSymbolKey);
var HistogramKeyTypeSymbolKey = "effect/MetricKeyType/Histogram";
var HistogramKeyTypeTypeId = Symbol.for(HistogramKeyTypeSymbolKey);
var SummaryKeyTypeSymbolKey = "effect/MetricKeyType/Summary";
var SummaryKeyTypeTypeId = Symbol.for(SummaryKeyTypeSymbolKey);
var metricKeyTypeVariance = {
  _In: (_) => _,
  _Out: (_) => _
};

class CounterKeyType {
  incremental;
  bigint;
  [MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [CounterKeyTypeTypeId] = CounterKeyTypeTypeId;
  constructor(incremental, bigint3) {
    this.incremental = incremental;
    this.bigint = bigint3;
    this._hash = string(CounterKeyTypeSymbolKey);
  }
  _hash;
  [symbol]() {
    return this._hash;
  }
  [symbol2](that) {
    return isCounterKey(that);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
class HistogramKeyType {
  boundaries;
  [MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [HistogramKeyTypeTypeId] = HistogramKeyTypeTypeId;
  constructor(boundaries) {
    this.boundaries = boundaries;
    this._hash = pipe(string(HistogramKeyTypeSymbolKey), combine(hash3(this.boundaries)));
  }
  _hash;
  [symbol]() {
    return this._hash;
  }
  [symbol2](that) {
    return isHistogramKey(that) && equals(this.boundaries, that.boundaries);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
var counter = (options) => new CounterKeyType(options?.incremental ?? false, options?.bigint ?? false);
var histogram = (boundaries) => {
  return new HistogramKeyType(boundaries);
};
var isCounterKey = (u) => hasProperty(u, CounterKeyTypeTypeId);
var isFrequencyKey = (u) => hasProperty(u, FrequencyKeyTypeTypeId);
var isGaugeKey = (u) => hasProperty(u, GaugeKeyTypeTypeId);
var isHistogramKey = (u) => hasProperty(u, HistogramKeyTypeTypeId);
var isSummaryKey = (u) => hasProperty(u, SummaryKeyTypeTypeId);

// node_modules/effect/dist/esm/internal/metric/key.js
var MetricKeySymbolKey = "effect/MetricKey";
var MetricKeyTypeId = Symbol.for(MetricKeySymbolKey);
var metricKeyVariance = {
  _Type: (_) => _
};
var arrayEquivilence = getEquivalence(equals);

class MetricKeyImpl {
  name;
  keyType;
  description;
  tags;
  [MetricKeyTypeId] = metricKeyVariance;
  constructor(name, keyType, description, tags = []) {
    this.name = name;
    this.keyType = keyType;
    this.description = description;
    this.tags = tags;
    this._hash = pipe(string(this.name + this.description), combine(hash3(this.keyType)), combine(array2(this.tags)));
  }
  _hash;
  [symbol]() {
    return this._hash;
  }
  [symbol2](u) {
    return isMetricKey(u) && this.name === u.name && equals(this.keyType, u.keyType) && equals(this.description, u.description) && arrayEquivilence(this.tags, u.tags);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
var isMetricKey = (u) => hasProperty(u, MetricKeyTypeId);
var counter2 = (name, options) => new MetricKeyImpl(name, counter(options), fromNullable(options?.description));
var histogram2 = (name, boundaries, description) => new MetricKeyImpl(name, histogram(boundaries), fromNullable(description));
var taggedWithLabels = dual(2, (self2, extraTags) => extraTags.length === 0 ? self2 : new MetricKeyImpl(self2.name, self2.keyType, self2.description, union(self2.tags, extraTags)));

// node_modules/effect/dist/esm/internal/metric/state.js
var MetricStateSymbolKey = "effect/MetricState";
var MetricStateTypeId = Symbol.for(MetricStateSymbolKey);
var CounterStateSymbolKey = "effect/MetricState/Counter";
var CounterStateTypeId = Symbol.for(CounterStateSymbolKey);
var FrequencyStateSymbolKey = "effect/MetricState/Frequency";
var FrequencyStateTypeId = Symbol.for(FrequencyStateSymbolKey);
var GaugeStateSymbolKey = "effect/MetricState/Gauge";
var GaugeStateTypeId = Symbol.for(GaugeStateSymbolKey);
var HistogramStateSymbolKey = "effect/MetricState/Histogram";
var HistogramStateTypeId = Symbol.for(HistogramStateSymbolKey);
var SummaryStateSymbolKey = "effect/MetricState/Summary";
var SummaryStateTypeId = Symbol.for(SummaryStateSymbolKey);
var metricStateVariance = {
  _A: (_) => _
};

class CounterState {
  count;
  [MetricStateTypeId] = metricStateVariance;
  [CounterStateTypeId] = CounterStateTypeId;
  constructor(count) {
    this.count = count;
  }
  [symbol]() {
    return pipe(hash3(CounterStateSymbolKey), combine(hash3(this.count)), cached(this));
  }
  [symbol2](that) {
    return isCounterState(that) && this.count === that.count;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
var arrayEquals = getEquivalence(equals);

class FrequencyState {
  occurrences;
  [MetricStateTypeId] = metricStateVariance;
  [FrequencyStateTypeId] = FrequencyStateTypeId;
  constructor(occurrences) {
    this.occurrences = occurrences;
  }
  _hash;
  [symbol]() {
    return pipe(string(FrequencyStateSymbolKey), combine(array2(fromIterable(this.occurrences.entries()))), cached(this));
  }
  [symbol2](that) {
    return isFrequencyState(that) && arrayEquals(fromIterable(this.occurrences.entries()), fromIterable(that.occurrences.entries()));
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}

class GaugeState {
  value;
  [MetricStateTypeId] = metricStateVariance;
  [GaugeStateTypeId] = GaugeStateTypeId;
  constructor(value) {
    this.value = value;
  }
  [symbol]() {
    return pipe(hash3(GaugeStateSymbolKey), combine(hash3(this.value)), cached(this));
  }
  [symbol2](u) {
    return isGaugeState(u) && this.value === u.value;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}

class HistogramState {
  buckets;
  count;
  min;
  max;
  sum;
  [MetricStateTypeId] = metricStateVariance;
  [HistogramStateTypeId] = HistogramStateTypeId;
  constructor(buckets, count, min2, max2, sum2) {
    this.buckets = buckets;
    this.count = count;
    this.min = min2;
    this.max = max2;
    this.sum = sum2;
  }
  [symbol]() {
    return pipe(hash3(HistogramStateSymbolKey), combine(hash3(this.buckets)), combine(hash3(this.count)), combine(hash3(this.min)), combine(hash3(this.max)), combine(hash3(this.sum)), cached(this));
  }
  [symbol2](that) {
    return isHistogramState(that) && equals(this.buckets, that.buckets) && this.count === that.count && this.min === that.min && this.max === that.max && this.sum === that.sum;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}

class SummaryState {
  error;
  quantiles;
  count;
  min;
  max;
  sum;
  [MetricStateTypeId] = metricStateVariance;
  [SummaryStateTypeId] = SummaryStateTypeId;
  constructor(error, quantiles, count, min2, max2, sum2) {
    this.error = error;
    this.quantiles = quantiles;
    this.count = count;
    this.min = min2;
    this.max = max2;
    this.sum = sum2;
  }
  [symbol]() {
    return pipe(hash3(SummaryStateSymbolKey), combine(hash3(this.error)), combine(hash3(this.quantiles)), combine(hash3(this.count)), combine(hash3(this.min)), combine(hash3(this.max)), combine(hash3(this.sum)), cached(this));
  }
  [symbol2](that) {
    return isSummaryState(that) && this.error === that.error && equals(this.quantiles, that.quantiles) && this.count === that.count && this.min === that.min && this.max === that.max && this.sum === that.sum;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
var counter3 = (count) => new CounterState(count);
var frequency2 = (occurrences) => {
  return new FrequencyState(occurrences);
};
var gauge2 = (count) => new GaugeState(count);
var histogram3 = (options) => new HistogramState(options.buckets, options.count, options.min, options.max, options.sum);
var summary2 = (options) => new SummaryState(options.error, options.quantiles, options.count, options.min, options.max, options.sum);
var isCounterState = (u) => hasProperty(u, CounterStateTypeId);
var isFrequencyState = (u) => hasProperty(u, FrequencyStateTypeId);
var isGaugeState = (u) => hasProperty(u, GaugeStateTypeId);
var isHistogramState = (u) => hasProperty(u, HistogramStateTypeId);
var isSummaryState = (u) => hasProperty(u, SummaryStateTypeId);

// node_modules/effect/dist/esm/internal/metric/hook.js
var MetricHookSymbolKey = "effect/MetricHook";
var MetricHookTypeId = Symbol.for(MetricHookSymbolKey);
var metricHookVariance = {
  _In: (_) => _,
  _Out: (_) => _
};
var make30 = (options) => ({
  [MetricHookTypeId]: metricHookVariance,
  pipe() {
    return pipeArguments(this, arguments);
  },
  ...options
});
var bigint04 = BigInt(0);
var counter4 = (key) => {
  let sum2 = key.keyType.bigint ? bigint04 : 0;
  const canUpdate = key.keyType.incremental ? key.keyType.bigint ? (value) => value >= bigint04 : (value) => value >= 0 : (_value) => true;
  return make30({
    get: () => counter3(sum2),
    update: (value) => {
      if (canUpdate(value)) {
        sum2 = sum2 + value;
      }
    }
  });
};
var frequency3 = (key) => {
  const values3 = new Map;
  for (const word of key.keyType.preregisteredWords) {
    values3.set(word, 0);
  }
  const update4 = (word) => {
    const slotCount = values3.get(word) ?? 0;
    values3.set(word, slotCount + 1);
  };
  return make30({
    get: () => frequency2(values3),
    update: update4
  });
};
var gauge3 = (_key, startAt) => {
  let value = startAt;
  return make30({
    get: () => gauge2(value),
    update: (v) => {
      value = v;
    }
  });
};
var histogram4 = (key) => {
  const bounds = key.keyType.boundaries.values;
  const size17 = bounds.length;
  const values3 = new Uint32Array(size17 + 1);
  const boundaries = new Float32Array(size17);
  let count = 0;
  let sum2 = 0;
  let min2 = Number.MAX_VALUE;
  let max2 = Number.MIN_VALUE;
  pipe(bounds, sort(Order), map3((n, i) => {
    boundaries[i] = n;
  }));
  const update4 = (value) => {
    let from = 0;
    let to = size17;
    while (from !== to) {
      const mid = Math.floor(from + (to - from) / 2);
      const boundary = boundaries[mid];
      if (value <= boundary) {
        to = mid;
      } else {
        from = mid;
      }
      if (to === from + 1) {
        if (value <= boundaries[from]) {
          to = from;
        } else {
          from = to;
        }
      }
    }
    values3[from] = values3[from] + 1;
    count = count + 1;
    sum2 = sum2 + value;
    if (value < min2) {
      min2 = value;
    }
    if (value > max2) {
      max2 = value;
    }
  };
  const getBuckets = () => {
    const builder = allocate(size17);
    let cumulated = 0;
    for (let i = 0;i < size17; i++) {
      const boundary = boundaries[i];
      const value = values3[i];
      cumulated = cumulated + value;
      builder[i] = [boundary, cumulated];
    }
    return builder;
  };
  return make30({
    get: () => histogram3({
      buckets: getBuckets(),
      count,
      min: min2,
      max: max2,
      sum: sum2
    }),
    update: update4
  });
};
var summary3 = (key) => {
  const {
    error,
    maxAge,
    maxSize,
    quantiles
  } = key.keyType;
  const sortedQuantiles = pipe(quantiles, sort(Order));
  const values3 = allocate(maxSize);
  let head4 = 0;
  let count = 0;
  let sum2 = 0;
  let min2 = Number.MAX_VALUE;
  let max2 = Number.MIN_VALUE;
  const snapshot = (now) => {
    const builder = [];
    let i = 0;
    while (i !== maxSize - 1) {
      const item = values3[i];
      if (item != null) {
        const [t, v] = item;
        const age = millis(now - t);
        if (greaterThanOrEqualTo2(age, zero2) && age <= maxAge) {
          builder.push(v);
        }
      }
      i = i + 1;
    }
    return calculateQuantiles(error, sortedQuantiles, sort(builder, Order));
  };
  const observe8 = (value, timestamp) => {
    if (maxSize > 0) {
      head4 = head4 + 1;
      const target = head4 % maxSize;
      values3[target] = [timestamp, value];
    }
    count = count + 1;
    sum2 = sum2 + value;
    if (value < min2) {
      min2 = value;
    }
    if (value > max2) {
      max2 = value;
    }
  };
  return make30({
    get: () => summary2({
      error,
      quantiles: snapshot(Date.now()),
      count,
      min: min2,
      max: max2,
      sum: sum2
    }),
    update: ([value, timestamp]) => observe8(value, timestamp)
  });
};
var calculateQuantiles = (error, sortedQuantiles, sortedSamples) => {
  const sampleCount = sortedSamples.length;
  if (!isNonEmptyReadonlyArray(sortedQuantiles)) {
    return empty2();
  }
  const head4 = sortedQuantiles[0];
  const tail = sortedQuantiles.slice(1);
  const resolvedHead = resolveQuantile(error, sampleCount, none2(), 0, head4, sortedSamples);
  const resolved = of(resolvedHead);
  tail.forEach((quantile) => {
    resolved.push(resolveQuantile(error, sampleCount, resolvedHead.value, resolvedHead.consumed, quantile, resolvedHead.rest));
  });
  return map3(resolved, (rq) => [rq.quantile, rq.value]);
};
var resolveQuantile = (error, sampleCount, current, consumed, quantile, rest) => {
  let error_1 = error;
  let sampleCount_1 = sampleCount;
  let current_1 = current;
  let consumed_1 = consumed;
  let quantile_1 = quantile;
  let rest_1 = rest;
  let error_2 = error;
  let sampleCount_2 = sampleCount;
  let current_2 = current;
  let consumed_2 = consumed;
  let quantile_2 = quantile;
  let rest_2 = rest;
  while (true) {
    if (!isNonEmptyReadonlyArray(rest_1)) {
      return {
        quantile: quantile_1,
        value: none2(),
        consumed: consumed_1,
        rest: []
      };
    }
    if (quantile_1 === 1) {
      return {
        quantile: quantile_1,
        value: some2(lastNonEmpty(rest_1)),
        consumed: consumed_1 + rest_1.length,
        rest: []
      };
    }
    const sameHead = span(rest_1, (n) => n <= rest_1[0]);
    const desired = quantile_1 * sampleCount_1;
    const allowedError = error_1 / 2 * desired;
    const candConsumed = consumed_1 + sameHead[0].length;
    const candError = Math.abs(candConsumed - desired);
    if (candConsumed < desired - allowedError) {
      error_2 = error_1;
      sampleCount_2 = sampleCount_1;
      current_2 = head(rest_1);
      consumed_2 = candConsumed;
      quantile_2 = quantile_1;
      rest_2 = sameHead[1];
      error_1 = error_2;
      sampleCount_1 = sampleCount_2;
      current_1 = current_2;
      consumed_1 = consumed_2;
      quantile_1 = quantile_2;
      rest_1 = rest_2;
      continue;
    }
    if (candConsumed > desired + allowedError) {
      return {
        quantile: quantile_1,
        value: current_1,
        consumed: consumed_1,
        rest: rest_1
      };
    }
    switch (current_1._tag) {
      case "None": {
        error_2 = error_1;
        sampleCount_2 = sampleCount_1;
        current_2 = head(rest_1);
        consumed_2 = candConsumed;
        quantile_2 = quantile_1;
        rest_2 = sameHead[1];
        error_1 = error_2;
        sampleCount_1 = sampleCount_2;
        current_1 = current_2;
        consumed_1 = consumed_2;
        quantile_1 = quantile_2;
        rest_1 = rest_2;
        continue;
      }
      case "Some": {
        const prevError = Math.abs(desired - current_1.value);
        if (candError < prevError) {
          error_2 = error_1;
          sampleCount_2 = sampleCount_1;
          current_2 = head(rest_1);
          consumed_2 = candConsumed;
          quantile_2 = quantile_1;
          rest_2 = sameHead[1];
          error_1 = error_2;
          sampleCount_1 = sampleCount_2;
          current_1 = current_2;
          consumed_1 = consumed_2;
          quantile_1 = quantile_2;
          rest_1 = rest_2;
          continue;
        }
        return {
          quantile: quantile_1,
          value: some2(current_1.value),
          consumed: consumed_1,
          rest: rest_1
        };
      }
    }
  }
  throw new Error("BUG: MetricHook.resolveQuantiles - please report an issue at https://github.com/Effect-TS/effect/issues");
};

// node_modules/effect/dist/esm/internal/metric/pair.js
var MetricPairSymbolKey = "effect/MetricPair";
var MetricPairTypeId = Symbol.for(MetricPairSymbolKey);
var metricPairVariance = {
  _Type: (_) => _
};
var unsafeMake7 = (metricKey, metricState) => {
  return {
    [MetricPairTypeId]: metricPairVariance,
    metricKey,
    metricState,
    pipe() {
      return pipeArguments(this, arguments);
    }
  };
};

// node_modules/effect/dist/esm/internal/metric/registry.js
var MetricRegistrySymbolKey = "effect/MetricRegistry";
var MetricRegistryTypeId = Symbol.for(MetricRegistrySymbolKey);

class MetricRegistryImpl {
  [MetricRegistryTypeId] = MetricRegistryTypeId;
  map = empty21();
  snapshot() {
    const result = [];
    for (const [key, hook] of this.map) {
      result.push(unsafeMake7(key, hook.get()));
    }
    return result;
  }
  get(key) {
    const hook = pipe(this.map, get8(key), getOrUndefined);
    if (hook == null) {
      if (isCounterKey(key.keyType)) {
        return this.getCounter(key);
      }
      if (isGaugeKey(key.keyType)) {
        return this.getGauge(key);
      }
      if (isFrequencyKey(key.keyType)) {
        return this.getFrequency(key);
      }
      if (isHistogramKey(key.keyType)) {
        return this.getHistogram(key);
      }
      if (isSummaryKey(key.keyType)) {
        return this.getSummary(key);
      }
      throw new Error("BUG: MetricRegistry.get - unknown MetricKeyType - please report an issue at https://github.com/Effect-TS/effect/issues");
    } else {
      return hook;
    }
  }
  getCounter(key) {
    let value = pipe(this.map, get8(key), getOrUndefined);
    if (value == null) {
      const counter5 = counter4(key);
      if (!pipe(this.map, has4(key))) {
        pipe(this.map, set4(key, counter5));
      }
      value = counter5;
    }
    return value;
  }
  getFrequency(key) {
    let value = pipe(this.map, get8(key), getOrUndefined);
    if (value == null) {
      const frequency4 = frequency3(key);
      if (!pipe(this.map, has4(key))) {
        pipe(this.map, set4(key, frequency4));
      }
      value = frequency4;
    }
    return value;
  }
  getGauge(key) {
    let value = pipe(this.map, get8(key), getOrUndefined);
    if (value == null) {
      const gauge4 = gauge3(key, key.keyType.bigint ? BigInt(0) : 0);
      if (!pipe(this.map, has4(key))) {
        pipe(this.map, set4(key, gauge4));
      }
      value = gauge4;
    }
    return value;
  }
  getHistogram(key) {
    let value = pipe(this.map, get8(key), getOrUndefined);
    if (value == null) {
      const histogram5 = histogram4(key);
      if (!pipe(this.map, has4(key))) {
        pipe(this.map, set4(key, histogram5));
      }
      value = histogram5;
    }
    return value;
  }
  getSummary(key) {
    let value = pipe(this.map, get8(key), getOrUndefined);
    if (value == null) {
      const summary4 = summary3(key);
      if (!pipe(this.map, has4(key))) {
        pipe(this.map, set4(key, summary4));
      }
      value = summary4;
    }
    return value;
  }
}
var make31 = () => {
  return new MetricRegistryImpl;
};

// node_modules/effect/dist/esm/internal/metric.js
var MetricSymbolKey = "effect/Metric";
var MetricTypeId = Symbol.for(MetricSymbolKey);
var metricVariance = {
  _Type: (_) => _,
  _In: (_) => _,
  _Out: (_) => _
};
var globalMetricRegistry = globalValue(Symbol.for("effect/Metric/globalMetricRegistry"), () => make31());
var make32 = function(keyType, unsafeUpdate, unsafeValue) {
  const metric = Object.assign((effect) => tap(effect, (a) => update4(metric, a)), {
    [MetricTypeId]: metricVariance,
    keyType,
    unsafeUpdate,
    unsafeValue,
    register() {
      this.unsafeValue([]);
      return this;
    },
    pipe() {
      return pipeArguments(this, arguments);
    }
  });
  return metric;
};
var counter5 = (name, options) => fromMetricKey(counter2(name, options));
var fromMetricKey = (key) => {
  let untaggedHook;
  const hookCache = new WeakMap;
  const hook = (extraTags) => {
    if (extraTags.length === 0) {
      if (untaggedHook !== undefined) {
        return untaggedHook;
      }
      untaggedHook = globalMetricRegistry.get(key);
      return untaggedHook;
    }
    let hook2 = hookCache.get(extraTags);
    if (hook2 !== undefined) {
      return hook2;
    }
    hook2 = globalMetricRegistry.get(taggedWithLabels(key, extraTags));
    hookCache.set(extraTags, hook2);
    return hook2;
  };
  return make32(key.keyType, (input, extraTags) => hook(extraTags).update(input), (extraTags) => hook(extraTags).get());
};
var histogram5 = (name, boundaries, description) => fromMetricKey(histogram2(name, boundaries, description));
var tagged = dual(3, (self2, key, value) => taggedWithLabels2(self2, [make29(key, value)]));
var taggedWithLabels2 = dual(2, (self2, extraTags) => {
  return make32(self2.keyType, (input, extraTags1) => self2.unsafeUpdate(input, union(extraTags, extraTags1)), (extraTags1) => self2.unsafeValue(union(extraTags, extraTags1)));
});
var update4 = dual(2, (self2, input) => fiberRefGetWith(currentMetricLabels, (tags) => sync(() => self2.unsafeUpdate(input, tags))));

// node_modules/effect/dist/esm/internal/request.js
var RequestSymbolKey = "effect/Request";
var RequestTypeId = Symbol.for(RequestSymbolKey);
var requestVariance = {
  _E: (_) => _,
  _A: (_) => _
};
var RequestPrototype = {
  ...StructuralPrototype,
  [RequestTypeId]: requestVariance
};
var isRequest = (u) => hasProperty(u, RequestTypeId);
var complete = dual(2, (self2, result) => fiberRefGetWith(currentRequestMap, (map10) => sync(() => {
  if (map10.has(self2)) {
    const entry = map10.get(self2);
    if (!entry.state.completed) {
      entry.state.completed = true;
      deferredUnsafeDone(entry.result, result);
    }
  }
})));
class Listeners {
  count = 0;
  observers = new Set;
  interrupted = false;
  addObserver(f) {
    this.observers.add(f);
  }
  removeObserver(f) {
    this.observers.delete(f);
  }
  increment() {
    this.count++;
    this.observers.forEach((f) => f(this.count));
  }
  decrement() {
    this.count--;
    this.observers.forEach((f) => f(this.count));
  }
}

// node_modules/effect/dist/esm/internal/redBlackTree/iterator.js
var Direction = {
  Forward: 0,
  Backward: 1 << 0
};

class RedBlackTreeIterator {
  self;
  stack;
  direction;
  count = 0;
  constructor(self2, stack, direction) {
    this.self = self2;
    this.stack = stack;
    this.direction = direction;
  }
  clone() {
    return new RedBlackTreeIterator(this.self, this.stack.slice(), this.direction);
  }
  reversed() {
    return new RedBlackTreeIterator(this.self, this.stack.slice(), this.direction === Direction.Forward ? Direction.Backward : Direction.Forward);
  }
  next() {
    const entry = this.entry;
    this.count++;
    if (this.direction === Direction.Forward) {
      this.moveNext();
    } else {
      this.movePrev();
    }
    switch (entry._tag) {
      case "None": {
        return {
          done: true,
          value: this.count
        };
      }
      case "Some": {
        return {
          done: false,
          value: entry.value
        };
      }
    }
  }
  get key() {
    if (this.stack.length > 0) {
      return some2(this.stack[this.stack.length - 1].key);
    }
    return none2();
  }
  get value() {
    if (this.stack.length > 0) {
      return some2(this.stack[this.stack.length - 1].value);
    }
    return none2();
  }
  get entry() {
    return map2(last(this.stack), (node5) => [node5.key, node5.value]);
  }
  get index() {
    let idx = 0;
    const stack = this.stack;
    if (stack.length === 0) {
      const r = this.self._root;
      if (r != null) {
        return r.count;
      }
      return 0;
    } else if (stack[stack.length - 1].left != null) {
      idx = stack[stack.length - 1].left.count;
    }
    for (let s = stack.length - 2;s >= 0; --s) {
      if (stack[s + 1] === stack[s].right) {
        ++idx;
        if (stack[s].left != null) {
          idx += stack[s].left.count;
        }
      }
    }
    return idx;
  }
  moveNext() {
    const stack = this.stack;
    if (stack.length === 0) {
      return;
    }
    let n = stack[stack.length - 1];
    if (n.right != null) {
      n = n.right;
      while (n != null) {
        stack.push(n);
        n = n.left;
      }
    } else {
      stack.pop();
      while (stack.length > 0 && stack[stack.length - 1].right === n) {
        n = stack[stack.length - 1];
        stack.pop();
      }
    }
  }
  get hasNext() {
    const stack = this.stack;
    if (stack.length === 0) {
      return false;
    }
    if (stack[stack.length - 1].right != null) {
      return true;
    }
    for (let s = stack.length - 1;s > 0; --s) {
      if (stack[s - 1].left === stack[s]) {
        return true;
      }
    }
    return false;
  }
  movePrev() {
    const stack = this.stack;
    if (stack.length === 0) {
      return;
    }
    let n = stack[stack.length - 1];
    if (n != null && n.left != null) {
      n = n.left;
      while (n != null) {
        stack.push(n);
        n = n.right;
      }
    } else {
      stack.pop();
      while (stack.length > 0 && stack[stack.length - 1].left === n) {
        n = stack[stack.length - 1];
        stack.pop();
      }
    }
  }
  get hasPrev() {
    const stack = this.stack;
    if (stack.length === 0) {
      return false;
    }
    if (stack[stack.length - 1].left != null) {
      return true;
    }
    for (let s = stack.length - 1;s > 0; --s) {
      if (stack[s - 1].right === stack[s]) {
        return true;
      }
    }
    return false;
  }
}

// node_modules/effect/dist/esm/internal/redBlackTree/node.js
var Color = {
  Red: 0,
  Black: 1 << 0
};

// node_modules/effect/dist/esm/internal/redBlackTree.js
var RedBlackTreeSymbolKey = "effect/RedBlackTree";
var RedBlackTreeTypeId = Symbol.for(RedBlackTreeSymbolKey);
var redBlackTreeVariance = {
  _Key: (_) => _,
  _Value: (_) => _
};
var RedBlackTreeProto = {
  [RedBlackTreeTypeId]: redBlackTreeVariance,
  [symbol]() {
    let hash4 = hash3(RedBlackTreeSymbolKey);
    for (const item of this) {
      hash4 ^= pipe(hash3(item[0]), combine(hash3(item[1])));
    }
    return cached(this, hash4);
  },
  [symbol2](that) {
    if (isRedBlackTree(that)) {
      if ((this._root?.count ?? 0) !== (that._root?.count ?? 0)) {
        return false;
      }
      const entries2 = Array.from(that);
      return Array.from(this).every((itemSelf, i) => {
        const itemThat = entries2[i];
        return equals(itemSelf[0], itemThat[0]) && equals(itemSelf[1], itemThat[1]);
      });
    }
    return false;
  },
  [Symbol.iterator]() {
    const stack = [];
    let n = this._root;
    while (n != null) {
      stack.push(n);
      n = n.left;
    }
    return new RedBlackTreeIterator(this, stack, Direction.Forward);
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "RedBlackTree",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var isRedBlackTree = (u) => hasProperty(u, RedBlackTreeTypeId);
var keysForward = (self2) => keys3(self2, Direction.Forward);
var keys3 = (self2, direction) => {
  const begin = self2[Symbol.iterator]();
  let count = 0;
  return {
    [Symbol.iterator]: () => keys3(self2, direction),
    next: () => {
      count++;
      const entry = begin.key;
      if (direction === Direction.Forward) {
        begin.moveNext();
      } else {
        begin.movePrev();
      }
      switch (entry._tag) {
        case "None": {
          return {
            done: true,
            value: count
          };
        }
        case "Some": {
          return {
            done: false,
            value: entry.value
          };
        }
      }
    }
  };
};

// node_modules/effect/dist/esm/RedBlackTree.js
var keys4 = keysForward;

// node_modules/effect/dist/esm/SortedSet.js
var TypeId15 = Symbol.for("effect/SortedSet");
var SortedSetProto = {
  [TypeId15]: {
    _A: (_) => _
  },
  [symbol]() {
    return pipe(hash3(this.keyTree), combine(hash3(TypeId15)), cached(this));
  },
  [symbol2](that) {
    return isSortedSet(that) && equals(this.keyTree, that.keyTree);
  },
  [Symbol.iterator]() {
    return keys4(this.keyTree);
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "SortedSet",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var isSortedSet = (u) => hasProperty(u, TypeId15);

// node_modules/effect/dist/esm/internal/supervisor.js
var SupervisorSymbolKey = "effect/Supervisor";
var SupervisorTypeId = Symbol.for(SupervisorSymbolKey);
var supervisorVariance = {
  _T: (_) => _
};

class ProxySupervisor {
  underlying;
  value0;
  [SupervisorTypeId] = supervisorVariance;
  constructor(underlying, value0) {
    this.underlying = underlying;
    this.value0 = value0;
  }
  get value() {
    return this.value0;
  }
  onStart(context3, effect, parent, fiber) {
    this.underlying.onStart(context3, effect, parent, fiber);
  }
  onEnd(value, fiber) {
    this.underlying.onEnd(value, fiber);
  }
  onEffect(fiber, effect) {
    this.underlying.onEffect(fiber, effect);
  }
  onSuspend(fiber) {
    this.underlying.onSuspend(fiber);
  }
  onResume(fiber) {
    this.underlying.onResume(fiber);
  }
  map(f) {
    return new ProxySupervisor(this, pipe(this.value, map9(f)));
  }
  zip(right3) {
    return new Zip(this, right3);
  }
}

class Zip {
  left;
  right;
  _tag = "Zip";
  [SupervisorTypeId] = supervisorVariance;
  constructor(left3, right3) {
    this.left = left3;
    this.right = right3;
  }
  get value() {
    return zip2(this.left.value, this.right.value);
  }
  onStart(context3, effect, parent, fiber) {
    this.left.onStart(context3, effect, parent, fiber);
    this.right.onStart(context3, effect, parent, fiber);
  }
  onEnd(value, fiber) {
    this.left.onEnd(value, fiber);
    this.right.onEnd(value, fiber);
  }
  onEffect(fiber, effect) {
    this.left.onEffect(fiber, effect);
    this.right.onEffect(fiber, effect);
  }
  onSuspend(fiber) {
    this.left.onSuspend(fiber);
    this.right.onSuspend(fiber);
  }
  onResume(fiber) {
    this.left.onResume(fiber);
    this.right.onResume(fiber);
  }
  map(f) {
    return new ProxySupervisor(this, pipe(this.value, map9(f)));
  }
  zip(right3) {
    return new Zip(this, right3);
  }
}
var isZip = (self2) => hasProperty(self2, SupervisorTypeId) && isTagged(self2, "Zip");

class Track {
  [SupervisorTypeId] = supervisorVariance;
  fibers = new Set;
  get value() {
    return sync(() => Array.from(this.fibers));
  }
  onStart(_context, _effect, _parent, fiber) {
    this.fibers.add(fiber);
  }
  onEnd(_value, fiber) {
    this.fibers.delete(fiber);
  }
  onEffect(_fiber, _effect) {
  }
  onSuspend(_fiber) {
  }
  onResume(_fiber) {
  }
  map(f) {
    return new ProxySupervisor(this, pipe(this.value, map9(f)));
  }
  zip(right3) {
    return new Zip(this, right3);
  }
  onRun(execution, _fiber) {
    return execution();
  }
}

class Const {
  effect;
  [SupervisorTypeId] = supervisorVariance;
  constructor(effect) {
    this.effect = effect;
  }
  get value() {
    return this.effect;
  }
  onStart(_context, _effect, _parent, _fiber) {
  }
  onEnd(_value, _fiber) {
  }
  onEffect(_fiber, _effect) {
  }
  onSuspend(_fiber) {
  }
  onResume(_fiber) {
  }
  map(f) {
    return new ProxySupervisor(this, pipe(this.value, map9(f)));
  }
  zip(right3) {
    return new Zip(this, right3);
  }
  onRun(execution, _fiber) {
    return execution();
  }
}
var unsafeTrack = () => {
  return new Track;
};
var track = sync(unsafeTrack);
var fromEffect = (effect) => {
  return new Const(effect);
};
var none8 = globalValue("effect/Supervisor/none", () => fromEffect(void_));

// node_modules/effect/dist/esm/Differ.js
var make34 = make15;

// node_modules/effect/dist/esm/internal/supervisor/patch.js
var OP_EMPTY3 = "Empty";
var OP_ADD_SUPERVISOR = "AddSupervisor";
var OP_REMOVE_SUPERVISOR = "RemoveSupervisor";
var OP_AND_THEN2 = "AndThen";
var empty29 = {
  _tag: OP_EMPTY3
};
var combine11 = (self2, that) => {
  return {
    _tag: OP_AND_THEN2,
    first: self2,
    second: that
  };
};
var patch11 = (self2, supervisor) => {
  return patchLoop(supervisor, of2(self2));
};
var patchLoop = (_supervisor, _patches) => {
  let supervisor = _supervisor;
  let patches = _patches;
  while (isNonEmpty(patches)) {
    const head4 = headNonEmpty2(patches);
    switch (head4._tag) {
      case OP_EMPTY3: {
        patches = tailNonEmpty2(patches);
        break;
      }
      case OP_ADD_SUPERVISOR: {
        supervisor = supervisor.zip(head4.supervisor);
        patches = tailNonEmpty2(patches);
        break;
      }
      case OP_REMOVE_SUPERVISOR: {
        supervisor = removeSupervisor(supervisor, head4.supervisor);
        patches = tailNonEmpty2(patches);
        break;
      }
      case OP_AND_THEN2: {
        patches = prepend2(head4.first)(prepend2(head4.second)(tailNonEmpty2(patches)));
        break;
      }
    }
  }
  return supervisor;
};
var removeSupervisor = (self2, that) => {
  if (equals(self2, that)) {
    return none8;
  } else {
    if (isZip(self2)) {
      return removeSupervisor(self2.left, that).zip(removeSupervisor(self2.right, that));
    } else {
      return self2;
    }
  }
};
var toSet2 = (self2) => {
  if (equals(self2, none8)) {
    return empty8();
  } else {
    if (isZip(self2)) {
      return pipe(toSet2(self2.left), union3(toSet2(self2.right)));
    } else {
      return make11(self2);
    }
  }
};
var diff10 = (oldValue, newValue) => {
  if (equals(oldValue, newValue)) {
    return empty29;
  }
  const oldSupervisors = toSet2(oldValue);
  const newSupervisors = toSet2(newValue);
  const added = pipe(newSupervisors, difference3(oldSupervisors), reduce4(empty29, (patch12, supervisor) => combine11(patch12, {
    _tag: OP_ADD_SUPERVISOR,
    supervisor
  })));
  const removed = pipe(oldSupervisors, difference3(newSupervisors), reduce4(empty29, (patch12, supervisor) => combine11(patch12, {
    _tag: OP_REMOVE_SUPERVISOR,
    supervisor
  })));
  return combine11(added, removed);
};
var differ2 = make34({
  empty: empty29,
  patch: patch11,
  combine: combine11,
  diff: diff10
});

// node_modules/effect/dist/esm/internal/fiberRuntime.js
var fiberStarted = counter5("effect_fiber_started", {
  incremental: true
});
var fiberActive = counter5("effect_fiber_active");
var fiberSuccesses = counter5("effect_fiber_successes", {
  incremental: true
});
var fiberFailures = counter5("effect_fiber_failures", {
  incremental: true
});
var fiberLifetimes = tagged(histogram5("effect_fiber_lifetimes", exponential({
  start: 0.5,
  factor: 2,
  count: 35
})), "time_unit", "milliseconds");
var EvaluationSignalContinue = "Continue";
var EvaluationSignalDone = "Done";
var EvaluationSignalYieldNow = "Yield";
var runtimeFiberVariance = {
  _E: (_) => _,
  _A: (_) => _
};
var absurd = (_) => {
  throw new Error(`BUG: FiberRuntime - ${toStringUnknown(_)} - please report an issue at https://github.com/Effect-TS/effect/issues`);
};
var YieldedOp = Symbol.for("effect/internal/fiberRuntime/YieldedOp");
var yieldedOpChannel = globalValue("effect/internal/fiberRuntime/yieldedOpChannel", () => ({
  currentOp: null
}));
var contOpSuccess = {
  [OP_ON_SUCCESS]: (_, cont, value) => {
    return internalCall(() => cont.effect_instruction_i1(value));
  },
  ["OnStep"]: (_, _cont, value) => {
    return exitSucceed(exitSucceed(value));
  },
  [OP_ON_SUCCESS_AND_FAILURE]: (_, cont, value) => {
    return internalCall(() => cont.effect_instruction_i2(value));
  },
  [OP_REVERT_FLAGS]: (self2, cont, value) => {
    self2.patchRuntimeFlags(self2._runtimeFlags, cont.patch);
    if (interruptible(self2._runtimeFlags) && self2.isInterrupted()) {
      return exitFailCause(self2.getInterruptedCause());
    } else {
      return exitSucceed(value);
    }
  },
  [OP_WHILE]: (self2, cont, value) => {
    internalCall(() => cont.effect_instruction_i2(value));
    if (internalCall(() => cont.effect_instruction_i0())) {
      self2.pushStack(cont);
      return internalCall(() => cont.effect_instruction_i1());
    } else {
      return void_;
    }
  }
};
var drainQueueWhileRunningTable = {
  [OP_INTERRUPT_SIGNAL]: (self2, runtimeFlags3, cur, message) => {
    self2.processNewInterruptSignal(message.cause);
    return interruptible(runtimeFlags3) ? exitFailCause(message.cause) : cur;
  },
  [OP_RESUME]: (_self, _runtimeFlags, _cur, _message) => {
    throw new Error("It is illegal to have multiple concurrent run loops in a single fiber");
  },
  [OP_STATEFUL]: (self2, runtimeFlags3, cur, message) => {
    message.onFiber(self2, running2(runtimeFlags3));
    return cur;
  },
  [OP_YIELD_NOW]: (_self, _runtimeFlags, cur, _message) => {
    return flatMap7(yieldNow(), () => cur);
  }
};
var runBlockedRequests = (self2) => forEachSequentialDiscard(flatten2(self2), (requestsByRequestResolver) => forEachConcurrentDiscard(sequentialCollectionToChunk(requestsByRequestResolver), ([dataSource, sequential4]) => {
  const map10 = new Map;
  const arr = [];
  for (const block5 of sequential4) {
    arr.push(toReadonlyArray(block5));
    for (const entry of block5) {
      map10.set(entry.request, entry);
    }
  }
  const flat = arr.flat();
  return fiberRefLocally(invokeWithInterrupt(dataSource.runAll(arr), flat, () => flat.forEach((entry) => {
    entry.listeners.interrupted = true;
  })), currentRequestMap, map10);
}, false, false));

class FiberRuntime {
  [FiberTypeId] = fiberVariance;
  [RuntimeFiberTypeId] = runtimeFiberVariance;
  pipe() {
    return pipeArguments(this, arguments);
  }
  _fiberRefs;
  _fiberId;
  _runtimeFlags;
  _queue = new Array;
  _children = null;
  _observers = new Array;
  _running = false;
  _stack = [];
  _asyncInterruptor = null;
  _asyncBlockingOn = null;
  _exitValue = null;
  _steps = [];
  _supervisor;
  _scheduler;
  _tracer;
  currentOpCount = 0;
  isYielding = false;
  constructor(fiberId2, fiberRefs0, runtimeFlags0) {
    this._runtimeFlags = runtimeFlags0;
    this._fiberId = fiberId2;
    this._fiberRefs = fiberRefs0;
    this._supervisor = this.getFiberRef(currentSupervisor);
    this._scheduler = this.getFiberRef(currentScheduler2);
    if (runtimeMetrics(runtimeFlags0)) {
      const tags = this.getFiberRef(currentMetricLabels);
      fiberStarted.unsafeUpdate(1, tags);
      fiberActive.unsafeUpdate(1, tags);
    }
    this._tracer = get3(this.getFiberRef(currentServices), tracerTag);
  }
  id() {
    return this._fiberId;
  }
  resume(effect) {
    this.tell(resume(effect));
  }
  get status() {
    return this.ask((_, status) => status);
  }
  get runtimeFlags() {
    return this.ask((state, status) => {
      if (isDone2(status)) {
        return state._runtimeFlags;
      }
      return status.runtimeFlags;
    });
  }
  scope() {
    return unsafeMake6(this);
  }
  get children() {
    return this.ask((fiber) => Array.from(fiber.getChildren()));
  }
  getChildren() {
    if (this._children === null) {
      this._children = new Set;
    }
    return this._children;
  }
  getInterruptedCause() {
    return this.getFiberRef(currentInterruptedCause);
  }
  fiberRefs() {
    return this.ask((fiber) => fiber.getFiberRefs());
  }
  ask(f) {
    return suspend(() => {
      const deferred = deferredUnsafeMake(this._fiberId);
      this.tell(stateful((fiber, status) => {
        deferredUnsafeDone(deferred, sync(() => f(fiber, status)));
      }));
      return deferredAwait(deferred);
    });
  }
  tell(message) {
    this._queue.push(message);
    if (!this._running) {
      this._running = true;
      this.drainQueueLaterOnExecutor();
    }
  }
  get await() {
    return async((resume2) => {
      const cb = (exit2) => resume2(succeed(exit2));
      this.tell(stateful((fiber, _) => {
        if (fiber._exitValue !== null) {
          cb(this._exitValue);
        } else {
          fiber.addObserver(cb);
        }
      }));
      return sync(() => this.tell(stateful((fiber, _) => {
        fiber.removeObserver(cb);
      })));
    }, this.id());
  }
  get inheritAll() {
    return withFiberRuntime((parentFiber, parentStatus) => {
      const parentFiberId = parentFiber.id();
      const parentFiberRefs = parentFiber.getFiberRefs();
      const parentRuntimeFlags = parentStatus.runtimeFlags;
      const childFiberRefs = this.getFiberRefs();
      const updatedFiberRefs = joinAs(parentFiberRefs, parentFiberId, childFiberRefs);
      parentFiber.setFiberRefs(updatedFiberRefs);
      const updatedRuntimeFlags = parentFiber.getFiberRef(currentRuntimeFlags);
      const patch12 = pipe(diff7(parentRuntimeFlags, updatedRuntimeFlags), exclude2(Interruption), exclude2(WindDown));
      return updateRuntimeFlags(patch12);
    });
  }
  get poll() {
    return sync(() => fromNullable(this._exitValue));
  }
  unsafePoll() {
    return this._exitValue;
  }
  interruptAsFork(fiberId2) {
    return sync(() => this.tell(interruptSignal(interrupt(fiberId2))));
  }
  unsafeInterruptAsFork(fiberId2) {
    this.tell(interruptSignal(interrupt(fiberId2)));
  }
  addObserver(observer) {
    if (this._exitValue !== null) {
      observer(this._exitValue);
    } else {
      this._observers.push(observer);
    }
  }
  removeObserver(observer) {
    this._observers = this._observers.filter((o) => o !== observer);
  }
  getFiberRefs() {
    this.setFiberRef(currentRuntimeFlags, this._runtimeFlags);
    return this._fiberRefs;
  }
  unsafeDeleteFiberRef(fiberRef) {
    this._fiberRefs = delete_(this._fiberRefs, fiberRef);
  }
  getFiberRef(fiberRef) {
    if (this._fiberRefs.locals.has(fiberRef)) {
      return this._fiberRefs.locals.get(fiberRef)[0][1];
    }
    return fiberRef.initial;
  }
  setFiberRef(fiberRef, value) {
    this._fiberRefs = updateAs(this._fiberRefs, {
      fiberId: this._fiberId,
      fiberRef,
      value
    });
    this.refreshRefCache();
  }
  refreshRefCache() {
    this._tracer = get3(this.getFiberRef(currentServices), tracerTag);
    this._supervisor = this.getFiberRef(currentSupervisor);
    this._scheduler = this.getFiberRef(currentScheduler2);
  }
  setFiberRefs(fiberRefs3) {
    this._fiberRefs = fiberRefs3;
    this.refreshRefCache();
  }
  addChild(child) {
    this.getChildren().add(child);
  }
  removeChild(child) {
    this.getChildren().delete(child);
  }
  drainQueueOnCurrentThread() {
    let recurse = true;
    while (recurse) {
      let evaluationSignal = EvaluationSignalContinue;
      const prev = globalThis[currentFiberURI];
      globalThis[currentFiberURI] = this;
      try {
        while (evaluationSignal === EvaluationSignalContinue) {
          evaluationSignal = this._queue.length === 0 ? EvaluationSignalDone : this.evaluateMessageWhileSuspended(this._queue.splice(0, 1)[0]);
        }
      } finally {
        this._running = false;
        globalThis[currentFiberURI] = prev;
      }
      if (this._queue.length > 0 && !this._running) {
        this._running = true;
        if (evaluationSignal === EvaluationSignalYieldNow) {
          this.drainQueueLaterOnExecutor();
          recurse = false;
        } else {
          recurse = true;
        }
      } else {
        recurse = false;
      }
    }
  }
  drainQueueLaterOnExecutor() {
    this._scheduler.scheduleTask(this.run, this.getFiberRef(currentSchedulingPriority));
  }
  drainQueueWhileRunning(runtimeFlags3, cur0) {
    let cur = cur0;
    while (this._queue.length > 0) {
      const message = this._queue.splice(0, 1)[0];
      cur = drainQueueWhileRunningTable[message._tag](this, runtimeFlags3, cur, message);
    }
    return cur;
  }
  isInterrupted() {
    return !isEmpty5(this.getFiberRef(currentInterruptedCause));
  }
  addInterruptedCause(cause2) {
    const oldSC = this.getFiberRef(currentInterruptedCause);
    this.setFiberRef(currentInterruptedCause, sequential(oldSC, cause2));
  }
  processNewInterruptSignal(cause2) {
    this.addInterruptedCause(cause2);
    this.sendInterruptSignalToAllChildren();
  }
  sendInterruptSignalToAllChildren() {
    if (this._children === null || this._children.size === 0) {
      return false;
    }
    let told = false;
    for (const child of this._children) {
      child.tell(interruptSignal(interrupt(this.id())));
      told = true;
    }
    return told;
  }
  interruptAllChildren() {
    if (this.sendInterruptSignalToAllChildren()) {
      const it = this._children.values();
      this._children = null;
      let isDone3 = false;
      const body = () => {
        const next2 = it.next();
        if (!next2.done) {
          return asVoid(next2.value.await);
        } else {
          return sync(() => {
            isDone3 = true;
          });
        }
      };
      return whileLoop({
        while: () => !isDone3,
        body,
        step: () => {
        }
      });
    }
    return null;
  }
  reportExitValue(exit2) {
    if (runtimeMetrics(this._runtimeFlags)) {
      const tags = this.getFiberRef(currentMetricLabels);
      const startTimeMillis = this.id().startTimeMillis;
      const endTimeMillis = Date.now();
      fiberLifetimes.unsafeUpdate(endTimeMillis - startTimeMillis, tags);
      fiberActive.unsafeUpdate(-1, tags);
      switch (exit2._tag) {
        case OP_SUCCESS: {
          fiberSuccesses.unsafeUpdate(1, tags);
          break;
        }
        case OP_FAILURE: {
          fiberFailures.unsafeUpdate(1, tags);
          break;
        }
      }
    }
    if (exit2._tag === "Failure") {
      const level = this.getFiberRef(currentUnhandledErrorLogLevel);
      if (!isInterruptedOnly(exit2.cause) && level._tag === "Some") {
        this.log("Fiber terminated with an unhandled error", exit2.cause, level);
      }
    }
  }
  setExitValue(exit2) {
    this._exitValue = exit2;
    this.reportExitValue(exit2);
    for (let i = this._observers.length - 1;i >= 0; i--) {
      this._observers[i](exit2);
    }
  }
  getLoggers() {
    return this.getFiberRef(currentLoggers);
  }
  log(message, cause2, overrideLogLevel) {
    const logLevel = isSome2(overrideLogLevel) ? overrideLogLevel.value : this.getFiberRef(currentLogLevel);
    const minimumLogLevel = this.getFiberRef(currentMinimumLogLevel);
    if (greaterThan2(minimumLogLevel, logLevel)) {
      return;
    }
    const spans = this.getFiberRef(currentLogSpan);
    const annotations = this.getFiberRef(currentLogAnnotations);
    const loggers = this.getLoggers();
    const contextMap = this.getFiberRefs();
    if (size14(loggers) > 0) {
      const clockService = get3(this.getFiberRef(currentServices), clockTag);
      const date = new Date(clockService.unsafeCurrentTimeMillis());
      for (const logger of loggers) {
        logger.log({
          fiberId: this.id(),
          logLevel,
          message,
          cause: cause2,
          context: contextMap,
          spans,
          annotations,
          date
        });
      }
    }
  }
  evaluateMessageWhileSuspended(message) {
    switch (message._tag) {
      case OP_YIELD_NOW: {
        return EvaluationSignalYieldNow;
      }
      case OP_INTERRUPT_SIGNAL: {
        this.processNewInterruptSignal(message.cause);
        if (this._asyncInterruptor !== null) {
          this._asyncInterruptor(exitFailCause(message.cause));
          this._asyncInterruptor = null;
        }
        return EvaluationSignalContinue;
      }
      case OP_RESUME: {
        this._asyncInterruptor = null;
        this._asyncBlockingOn = null;
        this.evaluateEffect(message.effect);
        return EvaluationSignalContinue;
      }
      case OP_STATEFUL: {
        message.onFiber(this, this._exitValue !== null ? done4 : suspended2(this._runtimeFlags, this._asyncBlockingOn));
        return EvaluationSignalContinue;
      }
      default: {
        return absurd(message);
      }
    }
  }
  evaluateEffect(effect0) {
    this._supervisor.onResume(this);
    try {
      let effect = interruptible(this._runtimeFlags) && this.isInterrupted() ? exitFailCause(this.getInterruptedCause()) : effect0;
      while (effect !== null) {
        const eff = effect;
        const exit2 = this.runLoop(eff);
        if (exit2 === YieldedOp) {
          const op = yieldedOpChannel.currentOp;
          yieldedOpChannel.currentOp = null;
          if (op._op === OP_YIELD) {
            if (cooperativeYielding(this._runtimeFlags)) {
              this.tell(yieldNow2());
              this.tell(resume(exitVoid));
              effect = null;
            } else {
              effect = exitVoid;
            }
          } else if (op._op === OP_ASYNC) {
            effect = null;
          }
        } else {
          this._runtimeFlags = pipe(this._runtimeFlags, enable2(WindDown));
          const interruption2 = this.interruptAllChildren();
          if (interruption2 !== null) {
            effect = flatMap7(interruption2, () => exit2);
          } else {
            if (this._queue.length === 0) {
              this.setExitValue(exit2);
            } else {
              this.tell(resume(exit2));
            }
            effect = null;
          }
        }
      }
    } finally {
      this._supervisor.onSuspend(this);
    }
  }
  start(effect) {
    if (!this._running) {
      this._running = true;
      const prev = globalThis[currentFiberURI];
      globalThis[currentFiberURI] = this;
      try {
        this.evaluateEffect(effect);
      } finally {
        this._running = false;
        globalThis[currentFiberURI] = prev;
        if (this._queue.length > 0) {
          this.drainQueueLaterOnExecutor();
        }
      }
    } else {
      this.tell(resume(effect));
    }
  }
  startFork(effect) {
    this.tell(resume(effect));
  }
  patchRuntimeFlags(oldRuntimeFlags, patch12) {
    const newRuntimeFlags = patch7(oldRuntimeFlags, patch12);
    globalThis[currentFiberURI] = this;
    this._runtimeFlags = newRuntimeFlags;
    return newRuntimeFlags;
  }
  initiateAsync(runtimeFlags3, asyncRegister) {
    let alreadyCalled = false;
    const callback = (effect) => {
      if (!alreadyCalled) {
        alreadyCalled = true;
        this.tell(resume(effect));
      }
    };
    if (interruptible(runtimeFlags3)) {
      this._asyncInterruptor = callback;
    }
    try {
      asyncRegister(callback);
    } catch (e) {
      callback(failCause(die(e)));
    }
  }
  pushStack(cont) {
    this._stack.push(cont);
    if (cont._op === "OnStep") {
      this._steps.push({
        refs: this.getFiberRefs(),
        flags: this._runtimeFlags
      });
    }
  }
  popStack() {
    const item = this._stack.pop();
    if (item) {
      if (item._op === "OnStep") {
        this._steps.pop();
      }
      return item;
    }
    return;
  }
  getNextSuccessCont() {
    let frame = this.popStack();
    while (frame) {
      if (frame._op !== OP_ON_FAILURE) {
        return frame;
      }
      frame = this.popStack();
    }
  }
  getNextFailCont() {
    let frame = this.popStack();
    while (frame) {
      if (frame._op !== OP_ON_SUCCESS && frame._op !== OP_WHILE) {
        return frame;
      }
      frame = this.popStack();
    }
  }
  [OP_TAG](op) {
    return map9(fiberRefGet(currentContext), (context3) => unsafeGet3(context3, op));
  }
  ["Left"](op) {
    return fail2(op.left);
  }
  ["None"](_) {
    return fail2(new NoSuchElementException);
  }
  ["Right"](op) {
    return exitSucceed(op.right);
  }
  ["Some"](op) {
    return exitSucceed(op.value);
  }
  ["Micro"](op) {
    return unsafeAsync((microResume) => {
      const env = envUnsafeMakeEmpty().pipe(envSet(currentContext2, this.getFiberRef(currentContext)));
      let resume2 = microResume;
      op[runSymbol](env, (result) => {
        if (result._tag === "Right") {
          return resume2(exitSucceed(result.right));
        }
        switch (result.left._tag) {
          case "Interrupt": {
            return resume2(exitFailCause(interrupt(none4)));
          }
          case "Fail": {
            return resume2(fail2(result.left.error));
          }
          case "Die": {
            return resume2(die2(result.left.defect));
          }
        }
      });
      return async((abortResume) => {
        resume2 = (_) => {
          abortResume(void_);
        };
        envGet(env, currentAbortController).abort();
      });
    });
  }
  [OP_SYNC](op) {
    const value = internalCall(() => op.effect_instruction_i0());
    const cont = this.getNextSuccessCont();
    if (cont !== undefined) {
      if (!(cont._op in contOpSuccess)) {
        absurd(cont);
      }
      return contOpSuccess[cont._op](this, cont, value);
    } else {
      yieldedOpChannel.currentOp = exitSucceed(value);
      return YieldedOp;
    }
  }
  [OP_SUCCESS](op) {
    const oldCur = op;
    const cont = this.getNextSuccessCont();
    if (cont !== undefined) {
      if (!(cont._op in contOpSuccess)) {
        absurd(cont);
      }
      return contOpSuccess[cont._op](this, cont, oldCur.effect_instruction_i0);
    } else {
      yieldedOpChannel.currentOp = oldCur;
      return YieldedOp;
    }
  }
  [OP_FAILURE](op) {
    const cause2 = op.effect_instruction_i0;
    const cont = this.getNextFailCont();
    if (cont !== undefined) {
      switch (cont._op) {
        case OP_ON_FAILURE:
        case OP_ON_SUCCESS_AND_FAILURE: {
          if (!(interruptible(this._runtimeFlags) && this.isInterrupted())) {
            return internalCall(() => cont.effect_instruction_i1(cause2));
          } else {
            return exitFailCause(stripFailures(cause2));
          }
        }
        case "OnStep": {
          if (!(interruptible(this._runtimeFlags) && this.isInterrupted())) {
            return exitSucceed(exitFailCause(cause2));
          } else {
            return exitFailCause(stripFailures(cause2));
          }
        }
        case OP_REVERT_FLAGS: {
          this.patchRuntimeFlags(this._runtimeFlags, cont.patch);
          if (interruptible(this._runtimeFlags) && this.isInterrupted()) {
            return exitFailCause(sequential(cause2, this.getInterruptedCause()));
          } else {
            return exitFailCause(cause2);
          }
        }
        default: {
          absurd(cont);
        }
      }
    } else {
      yieldedOpChannel.currentOp = exitFailCause(cause2);
      return YieldedOp;
    }
  }
  [OP_WITH_RUNTIME](op) {
    return internalCall(() => op.effect_instruction_i0(this, running2(this._runtimeFlags)));
  }
  ["Blocked"](op) {
    const refs = this.getFiberRefs();
    const flags = this._runtimeFlags;
    if (this._steps.length > 0) {
      const frames = [];
      const snap = this._steps[this._steps.length - 1];
      let frame = this.popStack();
      while (frame && frame._op !== "OnStep") {
        frames.push(frame);
        frame = this.popStack();
      }
      this.setFiberRefs(snap.refs);
      this._runtimeFlags = snap.flags;
      const patchRefs = diff9(snap.refs, refs);
      const patchFlags = diff7(snap.flags, flags);
      return exitSucceed(blocked(op.effect_instruction_i0, withFiberRuntime((newFiber) => {
        while (frames.length > 0) {
          newFiber.pushStack(frames.pop());
        }
        newFiber.setFiberRefs(patch10(newFiber.id(), newFiber.getFiberRefs())(patchRefs));
        newFiber._runtimeFlags = patch7(patchFlags)(newFiber._runtimeFlags);
        return op.effect_instruction_i1;
      })));
    }
    return uninterruptibleMask((restore) => flatMap7(forkDaemon(runRequestBlock(op.effect_instruction_i0)), () => restore(op.effect_instruction_i1)));
  }
  ["RunBlocked"](op) {
    return runBlockedRequests(op.effect_instruction_i0);
  }
  [OP_UPDATE_RUNTIME_FLAGS](op) {
    const updateFlags = op.effect_instruction_i0;
    const oldRuntimeFlags = this._runtimeFlags;
    const newRuntimeFlags = patch7(oldRuntimeFlags, updateFlags);
    if (interruptible(newRuntimeFlags) && this.isInterrupted()) {
      return exitFailCause(this.getInterruptedCause());
    } else {
      this.patchRuntimeFlags(this._runtimeFlags, updateFlags);
      if (op.effect_instruction_i1) {
        const revertFlags = diff7(newRuntimeFlags, oldRuntimeFlags);
        this.pushStack(new RevertFlags(revertFlags, op));
        return internalCall(() => op.effect_instruction_i1(oldRuntimeFlags));
      } else {
        return exitVoid;
      }
    }
  }
  [OP_ON_SUCCESS](op) {
    this.pushStack(op);
    return op.effect_instruction_i0;
  }
  ["OnStep"](op) {
    this.pushStack(op);
    return op.effect_instruction_i0;
  }
  [OP_ON_FAILURE](op) {
    this.pushStack(op);
    return op.effect_instruction_i0;
  }
  [OP_ON_SUCCESS_AND_FAILURE](op) {
    this.pushStack(op);
    return op.effect_instruction_i0;
  }
  [OP_ASYNC](op) {
    this._asyncBlockingOn = op.effect_instruction_i1;
    this.initiateAsync(this._runtimeFlags, op.effect_instruction_i0);
    yieldedOpChannel.currentOp = op;
    return YieldedOp;
  }
  [OP_YIELD](op) {
    this.isYielding = false;
    yieldedOpChannel.currentOp = op;
    return YieldedOp;
  }
  [OP_WHILE](op) {
    const check = op.effect_instruction_i0;
    const body = op.effect_instruction_i1;
    if (check()) {
      this.pushStack(op);
      return body();
    } else {
      return exitVoid;
    }
  }
  [OP_COMMIT](op) {
    return internalCall(() => op.commit());
  }
  runLoop(effect0) {
    let cur = effect0;
    this.currentOpCount = 0;
    while (true) {
      if ((this._runtimeFlags & OpSupervision) !== 0) {
        this._supervisor.onEffect(this, cur);
      }
      if (this._queue.length > 0) {
        cur = this.drainQueueWhileRunning(this._runtimeFlags, cur);
      }
      if (!this.isYielding) {
        this.currentOpCount += 1;
        const shouldYield = this._scheduler.shouldYield(this);
        if (shouldYield !== false) {
          this.isYielding = true;
          this.currentOpCount = 0;
          const oldCur = cur;
          cur = flatMap7(yieldNow({
            priority: shouldYield
          }), () => oldCur);
        }
      }
      try {
        if (!("_op" in cur) || !(cur._op in this)) {
          absurd(cur);
        }
        cur = this._tracer.context(() => {
          if (getCurrentVersion() !== cur[EffectTypeId3]._V) {
            return dieMessage(`Cannot execute an Effect versioned ${cur[EffectTypeId3]._V} with a Runtime of version ${getCurrentVersion()}`);
          }
          return this[cur._op](cur);
        }, this);
        if (cur === YieldedOp) {
          const op = yieldedOpChannel.currentOp;
          if (op._op === OP_YIELD || op._op === OP_ASYNC) {
            return YieldedOp;
          }
          yieldedOpChannel.currentOp = null;
          return op._op === OP_SUCCESS || op._op === OP_FAILURE ? op : exitFailCause(die(op));
        }
      } catch (e) {
        if (isEffectError(e)) {
          cur = exitFailCause(e.cause);
        } else if (isInterruptedException(e)) {
          cur = exitFailCause(sequential(die(e), interrupt(none4)));
        } else {
          cur = die2(e);
        }
      }
    }
  }
  run = () => {
    this.drainQueueOnCurrentThread();
  };
}
var currentMinimumLogLevel = globalValue("effect/FiberRef/currentMinimumLogLevel", () => fiberRefUnsafeMake(fromLiteral("Info")));
var loggerWithConsoleLog = (self2) => makeLogger((opts) => {
  const services = getOrDefault2(opts.context, currentServices);
  get3(services, consoleTag).unsafe.log(self2.log(opts));
});
var defaultLogger = globalValue(Symbol.for("effect/Logger/defaultLogger"), () => loggerWithConsoleLog(stringLogger));
var tracerLogger = globalValue(Symbol.for("effect/Logger/tracerLogger"), () => makeLogger(({
  annotations,
  cause: cause2,
  context: context3,
  fiberId: fiberId2,
  logLevel,
  message
}) => {
  const span2 = flatMap(get9(context3, currentContext), getOption2(spanTag));
  const clockService = map2(get9(context3, currentServices), (_) => get3(_, clockTag));
  if (span2._tag === "None" || span2.value._tag === "ExternalSpan" || clockService._tag === "None") {
    return;
  }
  const attributes = Object.fromEntries(map6(annotations, toStringUnknown));
  attributes["effect.fiberId"] = threadName2(fiberId2);
  attributes["effect.logLevel"] = logLevel.label;
  if (cause2 !== null && cause2._tag !== "Empty") {
    attributes["effect.cause"] = pretty(cause2);
  }
  span2.value.event(String(message), clockService.value.unsafeCurrentTimeNanos(), attributes);
}));
var currentLoggers = globalValue(Symbol.for("effect/FiberRef/currentLoggers"), () => fiberRefUnsafeMakeHashSet(make11(defaultLogger, tracerLogger)));
var annotateLogsScoped = function() {
  if (typeof arguments[0] === "string") {
    return fiberRefLocallyScopedWith(currentLogAnnotations, set3(arguments[0], arguments[1]));
  }
  const entries2 = Object.entries(arguments[0]);
  return fiberRefLocallyScopedWith(currentLogAnnotations, mutate3((annotations) => {
    for (let i = 0;i < entries2.length; i++) {
      const [key, value] = entries2[i];
      set3(annotations, key, value);
    }
    return annotations;
  }));
};
var acquireRelease = dual((args) => isEffect(args[0]), (acquire, release) => uninterruptible(tap(acquire, (a) => addFinalizer((exit2) => release(a, exit2)))));
var acquireReleaseInterruptible = dual((args) => isEffect(args[0]), (acquire, release) => ensuring(acquire, addFinalizer((exit2) => release(exit2))));
var addFinalizer = (finalizer) => withFiberRuntime((runtime2) => {
  const acquireRefs = runtime2.getFiberRefs();
  const acquireFlags = runtime2._runtimeFlags;
  return flatMap7(scope, (scope) => scopeAddFinalizerExit(scope, (exit2) => withFiberRuntime((runtimeFinalizer) => {
    const preRefs = runtimeFinalizer.getFiberRefs();
    const preFlags = runtimeFinalizer._runtimeFlags;
    const patchRefs = diff9(preRefs, acquireRefs);
    const patchFlags = diff7(preFlags, acquireFlags);
    const inverseRefs = diff9(acquireRefs, preRefs);
    runtimeFinalizer.setFiberRefs(patch10(patchRefs, runtimeFinalizer.id(), acquireRefs));
    return ensuring(withRuntimeFlags(finalizer(exit2), patchFlags), sync(() => {
      runtimeFinalizer.setFiberRefs(patch10(inverseRefs, runtimeFinalizer.id(), runtimeFinalizer.getFiberRefs()));
    }));
  })));
});
var daemonChildren = (self2) => {
  const forkScope = fiberRefLocally(currentForkScopeOverride, some2(globalScope));
  return forkScope(self2);
};
var _existsParFound = Symbol.for("effect/Effect/existsPar/found");
var exists2 = dual((args) => isIterable(args[0]) && !isEffect(args[0]), (elements, f, options) => matchSimple(options?.concurrency, () => suspend(() => existsLoop(elements[Symbol.iterator](), 0, f)), () => matchEffect(forEach7(elements, (a, i) => if_(f(a, i), {
  onTrue: () => fail2(_existsParFound),
  onFalse: () => void_
}), options), {
  onFailure: (e) => e === _existsParFound ? succeed(true) : fail2(e),
  onSuccess: () => succeed(false)
})));
var existsLoop = (iterator2, index2, f) => {
  const next2 = iterator2.next();
  if (next2.done) {
    return succeed(false);
  }
  return pipe(flatMap7(f(next2.value, index2), (b) => b ? succeed(b) : existsLoop(iterator2, index2 + 1, f)));
};
var filter4 = dual((args) => isIterable(args[0]) && !isEffect(args[0]), (elements, f, options) => {
  const predicate = options?.negate ? (a, i) => map9(f(a, i), not) : f;
  return matchSimple(options?.concurrency, () => suspend(() => fromIterable(elements).reduceRight((effect, a, i) => zipWith2(effect, suspend(() => predicate(a, i)), (list, b) => b ? [a, ...list] : list), sync(() => new Array))), () => map9(forEach7(elements, (a, i) => map9(predicate(a, i), (b) => b ? some2(a) : none2()), options), getSomes));
});
var allResolveInput = (input) => {
  if (Array.isArray(input) || isIterable(input)) {
    return [input, none2()];
  }
  const keys5 = Object.keys(input);
  const size19 = keys5.length;
  return [keys5.map((k) => input[k]), some2((values3) => {
    const res = {};
    for (let i = 0;i < size19; i++) {
      res[keys5[i]] = values3[i];
    }
    return res;
  })];
};
var allValidate = (effects, reconcile, options) => {
  const eitherEffects = [];
  for (const effect of effects) {
    eitherEffects.push(either2(effect));
  }
  return flatMap7(forEach7(eitherEffects, identity, {
    concurrency: options?.concurrency,
    batching: options?.batching
  }), (eithers) => {
    const none9 = none2();
    const size19 = eithers.length;
    const errors12 = new Array(size19);
    const successes = new Array(size19);
    let errored = false;
    for (let i = 0;i < size19; i++) {
      const either3 = eithers[i];
      if (either3._tag === "Left") {
        errors12[i] = some2(either3.left);
        errored = true;
      } else {
        successes[i] = either3.right;
        errors12[i] = none9;
      }
    }
    if (errored) {
      return reconcile._tag === "Some" ? fail2(reconcile.value(errors12)) : fail2(errors12);
    } else if (options?.discard) {
      return void_;
    }
    return reconcile._tag === "Some" ? succeed(reconcile.value(successes)) : succeed(successes);
  });
};
var allEither = (effects, reconcile, options) => {
  const eitherEffects = [];
  for (const effect of effects) {
    eitherEffects.push(either2(effect));
  }
  if (options?.discard) {
    return forEach7(eitherEffects, identity, {
      concurrency: options?.concurrency,
      batching: options?.batching,
      discard: true
    });
  }
  return map9(forEach7(eitherEffects, identity, {
    concurrency: options?.concurrency,
    batching: options?.batching
  }), (eithers) => reconcile._tag === "Some" ? reconcile.value(eithers) : eithers);
};
var all3 = (arg, options) => {
  const [effects, reconcile] = allResolveInput(arg);
  if (options?.mode === "validate") {
    return allValidate(effects, reconcile, options);
  } else if (options?.mode === "either") {
    return allEither(effects, reconcile, options);
  }
  return options?.discard !== true && reconcile._tag === "Some" ? map9(forEach7(effects, identity, options), reconcile.value) : forEach7(effects, identity, options);
};
var allWith = (options) => (arg) => all3(arg, options);
var allSuccesses = (elements, options) => map9(all3(fromIterable(elements).map(exit), options), filterMap((exit2) => exitIsSuccess(exit2) ? some2(exit2.effect_instruction_i0) : none2()));
var replicate = dual(2, (self2, n) => Array.from({
  length: n
}, () => self2));
var replicateEffect = dual((args) => isEffect(args[0]), (self2, n, options) => all3(replicate(self2, n), options));
var forEach7 = dual((args) => isIterable(args[0]), (self2, f, options) => withFiberRuntime((r) => {
  const isRequestBatchingEnabled = options?.batching === true || options?.batching === "inherit" && r.getFiberRef(currentRequestBatching);
  if (options?.discard) {
    return match8(options.concurrency, () => finalizersMask(sequential3)((restore) => isRequestBatchingEnabled ? forEachConcurrentDiscard(self2, (a, i) => restore(f(a, i)), true, false, 1) : forEachSequentialDiscard(self2, (a, i) => restore(f(a, i)))), () => finalizersMask(parallel3)((restore) => forEachConcurrentDiscard(self2, (a, i) => restore(f(a, i)), isRequestBatchingEnabled, false)), (n) => finalizersMask(parallelN2(n))((restore) => forEachConcurrentDiscard(self2, (a, i) => restore(f(a, i)), isRequestBatchingEnabled, false, n)));
  }
  return match8(options?.concurrency, () => finalizersMask(sequential3)((restore) => isRequestBatchingEnabled ? forEachParN(self2, 1, (a, i) => restore(f(a, i)), true) : forEachSequential(self2, (a, i) => restore(f(a, i)))), () => finalizersMask(parallel3)((restore) => forEachParUnbounded(self2, (a, i) => restore(f(a, i)), isRequestBatchingEnabled)), (n) => finalizersMask(parallelN2(n))((restore) => forEachParN(self2, n, (a, i) => restore(f(a, i)), isRequestBatchingEnabled)));
}));
var forEachParUnbounded = (self2, f, batching) => suspend(() => {
  const as2 = fromIterable(self2);
  const array5 = new Array(as2.length);
  const fn = (a, i) => flatMap7(f(a, i), (b) => sync(() => array5[i] = b));
  return zipRight(forEachConcurrentDiscard(as2, fn, batching, false), succeed(array5));
});
var forEachConcurrentDiscard = (self2, f, batching, processAll, n) => uninterruptibleMask((restore) => transplant((graft) => withFiberRuntime((parent) => {
  let todos = Array.from(self2).reverse();
  let target = todos.length;
  if (target === 0) {
    return void_;
  }
  let counter6 = 0;
  let interrupted = false;
  const fibersCount = n ? Math.min(todos.length, n) : todos.length;
  const fibers = new Set;
  const results = new Array;
  const interruptAll = () => fibers.forEach((fiber) => {
    fiber._scheduler.scheduleTask(() => {
      fiber.unsafeInterruptAsFork(parent.id());
    }, 0);
  });
  const startOrder = new Array;
  const joinOrder = new Array;
  const residual = new Array;
  const collectExits = () => {
    const exits = results.filter(({
      exit: exit2
    }) => exit2._tag === "Failure").sort((a, b) => a.index < b.index ? -1 : a.index === b.index ? 0 : 1).map(({
      exit: exit2
    }) => exit2);
    if (exits.length === 0) {
      exits.push(exitVoid);
    }
    return exits;
  };
  const runFiber = (eff, interruptImmediately = false) => {
    const runnable = uninterruptible(graft(eff));
    const fiber = unsafeForkUnstarted(runnable, parent, parent._runtimeFlags, globalScope);
    parent._scheduler.scheduleTask(() => {
      if (interruptImmediately) {
        fiber.unsafeInterruptAsFork(parent.id());
      }
      fiber.resume(runnable);
    }, 0);
    return fiber;
  };
  const onInterruptSignal = () => {
    if (!processAll) {
      target -= todos.length;
      todos = [];
    }
    interrupted = true;
    interruptAll();
  };
  const stepOrExit = batching ? step2 : exit;
  const processingFiber = runFiber(async((resume2) => {
    const pushResult = (res, index2) => {
      if (res._op === "Blocked") {
        residual.push(res);
      } else {
        results.push({
          index: index2,
          exit: res
        });
        if (res._op === "Failure" && !interrupted) {
          onInterruptSignal();
        }
      }
    };
    const next2 = () => {
      if (todos.length > 0) {
        const a = todos.pop();
        let index2 = counter6++;
        const returnNextElement = () => {
          const a2 = todos.pop();
          index2 = counter6++;
          return flatMap7(yieldNow(), () => flatMap7(stepOrExit(restore(f(a2, index2))), onRes));
        };
        const onRes = (res) => {
          if (todos.length > 0) {
            pushResult(res, index2);
            if (todos.length > 0) {
              return returnNextElement();
            }
          }
          return succeed(res);
        };
        const todo = flatMap7(stepOrExit(restore(f(a, index2))), onRes);
        const fiber = runFiber(todo);
        startOrder.push(fiber);
        fibers.add(fiber);
        if (interrupted) {
          fiber._scheduler.scheduleTask(() => {
            fiber.unsafeInterruptAsFork(parent.id());
          }, 0);
        }
        fiber.addObserver((wrapped) => {
          let exit2;
          if (wrapped._op === "Failure") {
            exit2 = wrapped;
          } else {
            exit2 = wrapped.effect_instruction_i0;
          }
          joinOrder.push(fiber);
          fibers.delete(fiber);
          pushResult(exit2, index2);
          if (results.length === target) {
            resume2(succeed(getOrElse(exitCollectAll(collectExits(), {
              parallel: true
            }), () => exitVoid)));
          } else if (residual.length + results.length === target) {
            const requests = residual.map((blocked2) => blocked2.effect_instruction_i0).reduce(par);
            resume2(succeed(blocked(requests, forEachConcurrentDiscard([getOrElse(exitCollectAll(collectExits(), {
              parallel: true
            }), () => exitVoid), ...residual.map((blocked2) => blocked2.effect_instruction_i1)], (i) => i, batching, true, n))));
          } else {
            next2();
          }
        });
      }
    };
    for (let i = 0;i < fibersCount; i++) {
      next2();
    }
  }));
  return asVoid(onExit(flatten4(restore(join2(processingFiber))), exitMatch({
    onFailure: () => {
      onInterruptSignal();
      const target2 = residual.length + 1;
      const concurrency = Math.min(typeof n === "number" ? n : residual.length, residual.length);
      const toPop = Array.from(residual);
      return async((cb) => {
        const exits = [];
        let count = 0;
        let index2 = 0;
        const check = (index3, hitNext) => (exit2) => {
          exits[index3] = exit2;
          count++;
          if (count === target2) {
            cb(getOrThrow(exitCollectAll(exits, {
              parallel: true
            })));
          }
          if (toPop.length > 0 && hitNext) {
            next2();
          }
        };
        const next2 = () => {
          runFiber(toPop.pop(), true).addObserver(check(index2, true));
          index2++;
        };
        processingFiber.addObserver(check(index2, false));
        index2++;
        for (let i = 0;i < concurrency; i++) {
          next2();
        }
      });
    },
    onSuccess: () => forEachSequential(joinOrder, (f2) => f2.inheritAll)
  })));
})));
var forEachParN = (self2, n, f, batching) => suspend(() => {
  const as2 = fromIterable(self2);
  const array5 = new Array(as2.length);
  const fn = (a, i) => map9(f(a, i), (b) => array5[i] = b);
  return zipRight(forEachConcurrentDiscard(as2, fn, batching, false, n), succeed(array5));
});
var fork = (self2) => withFiberRuntime((state, status) => succeed(unsafeFork(self2, state, status.runtimeFlags)));
var forkDaemon = (self2) => forkWithScopeOverride(self2, globalScope);
var forkWithErrorHandler = dual(2, (self2, handler) => fork(onError(self2, (cause2) => {
  const either3 = failureOrCause(cause2);
  switch (either3._tag) {
    case "Left":
      return handler(either3.left);
    case "Right":
      return failCause(either3.right);
  }
})));
var unsafeFork = (effect, parentFiber, parentRuntimeFlags, overrideScope = null) => {
  const childFiber = unsafeMakeChildFiber(effect, parentFiber, parentRuntimeFlags, overrideScope);
  childFiber.resume(effect);
  return childFiber;
};
var unsafeForkUnstarted = (effect, parentFiber, parentRuntimeFlags, overrideScope = null) => {
  const childFiber = unsafeMakeChildFiber(effect, parentFiber, parentRuntimeFlags, overrideScope);
  return childFiber;
};
var unsafeMakeChildFiber = (effect, parentFiber, parentRuntimeFlags, overrideScope = null) => {
  const childId = unsafeMake2();
  const parentFiberRefs = parentFiber.getFiberRefs();
  const childFiberRefs = forkAs(parentFiberRefs, childId);
  const childFiber = new FiberRuntime(childId, childFiberRefs, parentRuntimeFlags);
  const childContext = getOrDefault(childFiberRefs, currentContext);
  const supervisor = childFiber._supervisor;
  supervisor.onStart(childContext, effect, some2(parentFiber), childFiber);
  childFiber.addObserver((exit2) => supervisor.onEnd(exit2, childFiber));
  const parentScope = overrideScope !== null ? overrideScope : pipe(parentFiber.getFiberRef(currentForkScopeOverride), getOrElse(() => parentFiber.scope()));
  parentScope.add(parentRuntimeFlags, childFiber);
  return childFiber;
};
var forkWithScopeOverride = (self2, scopeOverride) => withFiberRuntime((parentFiber, parentStatus) => succeed(unsafeFork(self2, parentFiber, parentStatus.runtimeFlags, scopeOverride)));
var mergeAll = dual((args) => isFunction2(args[2]), (elements, zero3, f, options) => matchSimple(options?.concurrency, () => fromIterable(elements).reduce((acc, a, i) => zipWith2(acc, a, (acc2, a2) => f(acc2, a2, i)), succeed(zero3)), () => flatMap7(make28(zero3), (acc) => flatMap7(forEach7(elements, (effect, i) => flatMap7(effect, (a) => update3(acc, (b) => f(b, a, i))), options), () => get12(acc)))));
var partition3 = dual((args) => isIterable(args[0]), (elements, f, options) => pipe(forEach7(elements, (a, i) => either2(f(a, i)), options), map9((chunk2) => partitionMap2(chunk2, identity))));
var validateAll = dual((args) => isIterable(args[0]), (elements, f, options) => flatMap7(partition3(elements, f, {
  concurrency: options?.concurrency,
  batching: options?.batching
}), ([es, bs]) => es.length === 0 ? options?.discard ? void_ : succeed(bs) : fail2(es)));
var raceAll = (all4) => {
  const list = fromIterable2(all4);
  if (!isNonEmpty(list)) {
    return dieSync(() => new IllegalArgumentException(`Received an empty collection of effects`));
  }
  const self2 = headNonEmpty2(list);
  const effects = tailNonEmpty2(list);
  const inheritAll2 = (res) => pipe(inheritAll(res[1]), as(res[0]));
  return pipe(deferredMake(), flatMap7((done5) => pipe(make28(effects.length), flatMap7((fails) => uninterruptibleMask((restore) => pipe(fork(interruptible2(self2)), flatMap7((head4) => pipe(effects, forEachSequential((effect) => fork(interruptible2(effect))), map9((fibers) => unsafeFromArray(fibers)), map9((tail) => pipe(tail, prepend2(head4))), tap((fibers) => pipe(fibers, reduce(void_, (effect, fiber) => pipe(effect, zipRight(pipe(_await2(fiber), flatMap7(raceAllArbiter(fibers, fiber, done5, fails)), fork, asVoid)))))), flatMap7((fibers) => pipe(restore(pipe(_await(done5), flatMap7(inheritAll2))), onInterrupt(() => pipe(fibers, reduce(void_, (effect, fiber) => pipe(effect, zipLeft(interruptFiber(fiber))))))))))))))));
};
var raceAllArbiter = (fibers, winner, deferred, fails) => (exit2) => exitMatchEffect(exit2, {
  onFailure: (cause2) => pipe(modify3(fails, (fails2) => [fails2 === 0 ? pipe(deferredFailCause(deferred, cause2), asVoid) : void_, fails2 - 1]), flatten4),
  onSuccess: (value) => pipe(deferredSucceed(deferred, [value, winner]), flatMap7((set6) => set6 ? pipe(fromIterable2(fibers), reduce(void_, (effect, fiber) => fiber === winner ? effect : pipe(effect, zipLeft(interruptFiber(fiber))))) : void_))
});
var reduceEffect = dual((args) => isIterable(args[0]) && !isEffect(args[0]), (elements, zero3, f, options) => matchSimple(options?.concurrency, () => fromIterable(elements).reduce((acc, a, i) => zipWith2(acc, a, (acc2, a2) => f(acc2, a2, i)), zero3), () => suspend(() => pipe(mergeAll([zero3, ...elements], none2(), (acc, elem, i) => {
  switch (acc._tag) {
    case "None": {
      return some2(elem);
    }
    case "Some": {
      return some2(f(acc.value, elem, i));
    }
  }
}, options), map9((option2) => {
  switch (option2._tag) {
    case "None": {
      throw new Error("BUG: Effect.reduceEffect - please report an issue at https://github.com/Effect-TS/effect/issues");
    }
    case "Some": {
      return option2.value;
    }
  }
})))));
var parallelFinalizers = (self2) => contextWithEffect((context3) => match2(getOption2(context3, scopeTag), {
  onNone: () => self2,
  onSome: (scope) => {
    switch (scope.strategy._tag) {
      case "Parallel":
        return self2;
      case "Sequential":
      case "ParallelN":
        return flatMap7(scopeFork(scope, parallel3), (inner) => scopeExtend(self2, inner));
    }
  }
}));
var parallelNFinalizers = (parallelism) => (self2) => contextWithEffect((context3) => match2(getOption2(context3, scopeTag), {
  onNone: () => self2,
  onSome: (scope) => {
    if (scope.strategy._tag === "ParallelN" && scope.strategy.parallelism === parallelism) {
      return self2;
    }
    return flatMap7(scopeFork(scope, parallelN2(parallelism)), (inner) => scopeExtend(self2, inner));
  }
}));
var finalizersMask = (strategy) => (self2) => contextWithEffect((context3) => match2(getOption2(context3, scopeTag), {
  onNone: () => self2(identity),
  onSome: (scope) => {
    const patch12 = strategy._tag === "Parallel" ? parallelFinalizers : strategy._tag === "Sequential" ? sequentialFinalizers : parallelNFinalizers(strategy.parallelism);
    switch (scope.strategy._tag) {
      case "Parallel":
        return patch12(self2(parallelFinalizers));
      case "Sequential":
        return patch12(self2(sequentialFinalizers));
      case "ParallelN":
        return patch12(self2(parallelNFinalizers(scope.strategy.parallelism)));
    }
  }
}));
var scopeWith = (f) => flatMap7(scopeTag, f);
var scopedEffect = (effect) => flatMap7(scopeMake(), (scope) => scopeUse(effect, scope));
var sequentialFinalizers = (self2) => contextWithEffect((context3) => match2(getOption2(context3, scopeTag), {
  onNone: () => self2,
  onSome: (scope) => {
    switch (scope.strategy._tag) {
      case "Sequential":
        return self2;
      case "Parallel":
      case "ParallelN":
        return flatMap7(scopeFork(scope, sequential3), (inner) => scopeExtend(self2, inner));
    }
  }
}));
var tagMetricsScoped = (key, value) => labelMetricsScoped([make29(key, value)]);
var labelMetricsScoped = (labels) => fiberRefLocallyScopedWith(currentMetricLabels, (old) => union(old, labels));
var using = dual(2, (self2, use) => acquireUseRelease(scopeMake(), (scope) => flatMap7(scopeExtend(self2, scope), use), (scope, exit2) => scopeClose(scope, exit2)));
var validate = dual((args) => isEffect(args[1]), (self2, that, options) => validateWith(self2, that, (a, b) => [a, b], options));
var validateWith = dual((args) => isEffect(args[1]), (self2, that, f, options) => flatten4(zipWithOptions(exit(self2), exit(that), (ea, eb) => exitZipWith(ea, eb, {
  onSuccess: f,
  onFailure: (ca, cb) => options?.concurrent ? parallel(ca, cb) : sequential(ca, cb)
}), options)));
var validateFirst = dual((args) => isIterable(args[0]), (elements, f, options) => flip(forEach7(elements, (a, i) => flip(f(a, i)), options)));
var withClockScoped = (value) => fiberRefLocallyScopedWith(currentServices, add2(clockTag, value));
var withRandomScoped = (value) => fiberRefLocallyScopedWith(currentServices, add2(randomTag, value));
var withConfigProviderScoped = (value) => fiberRefLocallyScopedWith(currentServices, add2(configProviderTag, value));
var withEarlyRelease = (self2) => scopeWith((parent) => flatMap7(scopeFork(parent, sequential2), (child) => pipe(self2, scopeExtend(child), map9((value) => [fiberIdWith((fiberId2) => scopeClose(child, exitInterrupt(fiberId2))), value]))));
var zipOptions = dual((args) => isEffect(args[1]), (self2, that, options) => zipWithOptions(self2, that, (a, b) => [a, b], options));
var zipLeftOptions = dual((args) => isEffect(args[1]), (self2, that, options) => {
  if (options?.concurrent !== true && (options?.batching === undefined || options.batching === false)) {
    return zipLeft(self2, that);
  }
  return zipWithOptions(self2, that, (a, _) => a, options);
});
var zipRightOptions = dual((args) => isEffect(args[1]), (self2, that, options) => {
  if (options?.concurrent !== true && (options?.batching === undefined || options.batching === false)) {
    return zipRight(self2, that);
  }
  return zipWithOptions(self2, that, (_, b) => b, options);
});
var zipWithOptions = dual((args) => isEffect(args[1]), (self2, that, f, options) => map9(all3([self2, that], {
  concurrency: options?.concurrent ? 2 : 1,
  batching: options?.batching
}), ([a, a2]) => f(a, a2)));
var withRuntimeFlagsScoped = (update5) => {
  if (update5 === empty18) {
    return void_;
  }
  return pipe(runtimeFlags, flatMap7((runtimeFlags3) => {
    const updatedRuntimeFlags = patch7(runtimeFlags3, update5);
    const revertRuntimeFlags = diff7(updatedRuntimeFlags, runtimeFlags3);
    return pipe(updateRuntimeFlags(update5), zipRight(addFinalizer(() => updateRuntimeFlags(revertRuntimeFlags))), asVoid);
  }), uninterruptible);
};
var scopeTag = GenericTag("effect/Scope");
var scope = scopeTag;
var scopeUnsafeAddFinalizer = (scope2, fin) => {
  if (scope2.state._tag === "Open") {
    scope2.state.finalizers.add(fin);
  }
};
var ScopeImplProto = {
  [ScopeTypeId]: ScopeTypeId,
  [CloseableScopeTypeId]: CloseableScopeTypeId,
  pipe() {
    return pipeArguments(this, arguments);
  },
  fork(strategy) {
    return sync(() => {
      const newScope = scopeUnsafeMake(strategy);
      if (this.state._tag === "Closed") {
        newScope.state = this.state;
        return newScope;
      }
      const fin = (exit2) => newScope.close(exit2);
      this.state.finalizers.add(fin);
      scopeUnsafeAddFinalizer(newScope, (_) => sync(() => {
        if (this.state._tag === "Open") {
          this.state.finalizers.delete(fin);
        }
      }));
      return newScope;
    });
  },
  close(exit2) {
    return suspend(() => {
      if (this.state._tag === "Closed") {
        return void_;
      }
      const finalizers = Array.from(this.state.finalizers.values()).reverse();
      this.state = {
        _tag: "Closed",
        exit: exit2
      };
      if (finalizers.length === 0) {
        return void_;
      }
      return isSequential(this.strategy) ? pipe(forEachSequential(finalizers, (fin) => exit(fin(exit2))), flatMap7((results) => pipe(exitCollectAll(results), map2(exitAsVoid), getOrElse(() => exitVoid)))) : isParallel(this.strategy) ? pipe(forEachParUnbounded(finalizers, (fin) => exit(fin(exit2)), false), flatMap7((results) => pipe(exitCollectAll(results, {
        parallel: true
      }), map2(exitAsVoid), getOrElse(() => exitVoid)))) : pipe(forEachParN(finalizers, this.strategy.parallelism, (fin) => exit(fin(exit2)), false), flatMap7((results) => pipe(exitCollectAll(results, {
        parallel: true
      }), map2(exitAsVoid), getOrElse(() => exitVoid))));
    });
  },
  addFinalizer(fin) {
    return suspend(() => {
      if (this.state._tag === "Closed") {
        return fin(this.state.exit);
      }
      this.state.finalizers.add(fin);
      return void_;
    });
  }
};
var scopeUnsafeMake = (strategy = sequential2) => {
  const scope2 = Object.create(ScopeImplProto);
  scope2.strategy = strategy;
  scope2.state = {
    _tag: "Open",
    finalizers: new Set
  };
  return scope2;
};
var scopeMake = (strategy = sequential2) => sync(() => scopeUnsafeMake(strategy));
var scopeExtend = dual(2, (effect, scope2) => mapInputContext(effect, merge3(make6(scopeTag, scope2))));
var scopeUse = dual(2, (effect, scope2) => pipe(effect, scopeExtend(scope2), onExit((exit2) => scope2.close(exit2))));
var fiberRefUnsafeMakeSupervisor = (initial) => fiberRefUnsafeMakePatch(initial, {
  differ: differ2,
  fork: empty29
});
var fiberRefLocallyScoped = dual(2, (self2, value) => asVoid(acquireRelease(flatMap7(fiberRefGet(self2), (oldValue) => as(fiberRefSet(self2, value), oldValue)), (oldValue) => fiberRefSet(self2, oldValue))));
var fiberRefLocallyScopedWith = dual(2, (self2, f) => fiberRefGetWith(self2, (a) => fiberRefLocallyScoped(self2, f(a))));
var currentRuntimeFlags = fiberRefUnsafeMakeRuntimeFlags(none5);
var currentSupervisor = fiberRefUnsafeMakeSupervisor(none8);
var fiberAwaitAll = (fibers) => asVoid(_await2(fiberAll(fibers)));
var fiberAll = (fibers) => ({
  [FiberTypeId]: fiberVariance,
  id: () => fromIterable(fibers).reduce((id2, fiber) => combine3(id2, fiber.id()), none4),
  await: exit(forEachParUnbounded(fibers, (fiber) => flatten4(fiber.await), false)),
  children: map9(forEachParUnbounded(fibers, (fiber) => fiber.children, false), flatten),
  inheritAll: forEachSequentialDiscard(fibers, (fiber) => fiber.inheritAll),
  poll: map9(forEachSequential(fibers, (fiber) => fiber.poll), reduceRight(some2(exitSucceed(new Array)), (optionB, optionA) => {
    switch (optionA._tag) {
      case "None": {
        return none2();
      }
      case "Some": {
        switch (optionB._tag) {
          case "None": {
            return none2();
          }
          case "Some": {
            return some2(exitZipWith(optionA.value, optionB.value, {
              onSuccess: (a, chunk2) => [a, ...chunk2],
              onFailure: parallel
            }));
          }
        }
      }
    }
  })),
  interruptAsFork: (fiberId2) => forEachSequentialDiscard(fibers, (fiber) => fiber.interruptAsFork(fiberId2)),
  pipe() {
    return pipeArguments(this, arguments);
  }
});
var raceWith = dual(3, (self2, other, options) => raceFibersWith(self2, other, {
  onSelfWin: (winner, loser) => flatMap7(winner.await, (exit2) => {
    switch (exit2._tag) {
      case OP_SUCCESS: {
        return flatMap7(winner.inheritAll, () => options.onSelfDone(exit2, loser));
      }
      case OP_FAILURE: {
        return options.onSelfDone(exit2, loser);
      }
    }
  }),
  onOtherWin: (winner, loser) => flatMap7(winner.await, (exit2) => {
    switch (exit2._tag) {
      case OP_SUCCESS: {
        return flatMap7(winner.inheritAll, () => options.onOtherDone(exit2, loser));
      }
      case OP_FAILURE: {
        return options.onOtherDone(exit2, loser);
      }
    }
  })
}));
var disconnect = (self2) => uninterruptibleMask((restore) => fiberIdWith((fiberId2) => flatMap7(forkDaemon(restore(self2)), (fiber) => pipe(restore(join2(fiber)), onInterrupt(() => pipe(fiber, interruptAsFork(fiberId2)))))));
var race = dual(2, (self2, that) => fiberIdWith((parentFiberId) => raceWith(self2, that, {
  onSelfDone: (exit2, right3) => exitMatchEffect(exit2, {
    onFailure: (cause2) => pipe(join2(right3), mapErrorCause((cause22) => parallel(cause2, cause22))),
    onSuccess: (value) => pipe(right3, interruptAsFiber(parentFiberId), as(value))
  }),
  onOtherDone: (exit2, left3) => exitMatchEffect(exit2, {
    onFailure: (cause2) => pipe(join2(left3), mapErrorCause((cause22) => parallel(cause22, cause2))),
    onSuccess: (value) => pipe(left3, interruptAsFiber(parentFiberId), as(value))
  })
})));
var raceFibersWith = dual(3, (self2, other, options) => withFiberRuntime((parentFiber, parentStatus) => {
  const parentRuntimeFlags = parentStatus.runtimeFlags;
  const raceIndicator = make12(true);
  const leftFiber = unsafeMakeChildFiber(self2, parentFiber, parentRuntimeFlags, options.selfScope);
  const rightFiber = unsafeMakeChildFiber(other, parentFiber, parentRuntimeFlags, options.otherScope);
  return async((cb) => {
    leftFiber.addObserver(() => completeRace(leftFiber, rightFiber, options.onSelfWin, raceIndicator, cb));
    rightFiber.addObserver(() => completeRace(rightFiber, leftFiber, options.onOtherWin, raceIndicator, cb));
    leftFiber.startFork(self2);
    rightFiber.startFork(other);
  }, combine3(leftFiber.id(), rightFiber.id()));
}));
var completeRace = (winner, loser, cont, ab, cb) => {
  if (compareAndSet(true, false)(ab)) {
    cb(cont(winner, loser));
  }
};
var ensuring = dual(2, (self2, finalizer) => uninterruptibleMask((restore) => matchCauseEffect(restore(self2), {
  onFailure: (cause1) => matchCauseEffect(finalizer, {
    onFailure: (cause2) => failCause(sequential(cause1, cause2)),
    onSuccess: () => failCause(cause1)
  }),
  onSuccess: (a) => as(finalizer, a)
})));
var invokeWithInterrupt = (self2, entries2, onInterrupt2) => fiberIdWith((id2) => flatMap7(flatMap7(forkDaemon(interruptible2(self2)), (processing) => async((cb) => {
  const counts = entries2.map((_) => _.listeners.count);
  const checkDone = () => {
    if (counts.every((count) => count === 0)) {
      if (entries2.every((_) => {
        if (_.result.state.current._tag === "Pending") {
          return true;
        } else if (_.result.state.current._tag === "Done" && exitIsExit(_.result.state.current.effect) && _.result.state.current.effect._tag === "Failure" && isInterrupted(_.result.state.current.effect.cause)) {
          return true;
        } else {
          return false;
        }
      })) {
        cleanup.forEach((f) => f());
        onInterrupt2?.();
        cb(interruptFiber(processing));
      }
    }
  };
  processing.addObserver((exit2) => {
    cleanup.forEach((f) => f());
    cb(exit2);
  });
  const cleanup = entries2.map((r, i) => {
    const observer = (count) => {
      counts[i] = count;
      checkDone();
    };
    r.listeners.addObserver(observer);
    return () => r.listeners.removeObserver(observer);
  });
  checkDone();
  return sync(() => {
    cleanup.forEach((f) => f());
  });
})), () => suspend(() => {
  const residual = entries2.flatMap((entry) => {
    if (!entry.state.completed) {
      return [entry];
    }
    return [];
  });
  return forEachSequentialDiscard(residual, (entry) => complete(entry.request, exitInterrupt(id2)));
})));
var makeSpanScoped = (name, options) => {
  options = addSpanStackTrace(options);
  return uninterruptible(withFiberRuntime((fiber) => {
    const scope2 = unsafeGet3(fiber.getFiberRef(currentContext), scopeTag);
    const span2 = unsafeMakeSpan(fiber, name, options);
    const timingEnabled = fiber.getFiberRef(currentTracerTimingEnabled);
    const clock_ = get3(fiber.getFiberRef(currentServices), clockTag);
    return as(scopeAddFinalizerExit(scope2, (exit2) => endSpan(span2, exit2, clock_, timingEnabled)), span2);
  }));
};
var withTracerScoped = (value) => fiberRefLocallyScopedWith(currentServices, add2(tracerTag, value));
var withSpanScoped = function() {
  const dataFirst = typeof arguments[0] !== "string";
  const name = dataFirst ? arguments[1] : arguments[0];
  const options = addSpanStackTrace(dataFirst ? arguments[2] : arguments[1]);
  if (dataFirst) {
    const self2 = arguments[0];
    return flatMap7(makeSpanScoped(name, addSpanStackTrace(options)), (span2) => provideService(self2, spanTag, span2));
  }
  return (self2) => flatMap7(makeSpanScoped(name, addSpanStackTrace(options)), (span2) => provideService(self2, spanTag, span2));
};

// node_modules/effect/dist/esm/internal/cache.js
var complete2 = (key, exit2, entryStats, timeToLiveMillis) => struct2({
  _tag: "Complete",
  key,
  exit: exit2,
  entryStats,
  timeToLiveMillis
});
var pending2 = (key, deferred) => struct2({
  _tag: "Pending",
  key,
  deferred
});
var refreshing = (deferred, complete3) => struct2({
  _tag: "Refreshing",
  deferred,
  complete: complete3
});
var MapKeyTypeId = Symbol.for("effect/Cache/MapKey");

class MapKeyImpl {
  current;
  [MapKeyTypeId] = MapKeyTypeId;
  previous = undefined;
  next = undefined;
  constructor(current) {
    this.current = current;
  }
  [symbol]() {
    return pipe(hash3(this.current), combine(hash3(this.previous)), combine(hash3(this.next)), cached(this));
  }
  [symbol2](that) {
    if (this === that) {
      return true;
    }
    return isMapKey(that) && equals(this.current, that.current) && equals(this.previous, that.previous) && equals(this.next, that.next);
  }
}
var makeMapKey = (current) => new MapKeyImpl(current);
var isMapKey = (u) => hasProperty(u, MapKeyTypeId);

class KeySetImpl {
  head = undefined;
  tail = undefined;
  add(key) {
    if (key !== this.tail) {
      if (this.tail === undefined) {
        this.head = key;
        this.tail = key;
      } else {
        const previous = key.previous;
        const next2 = key.next;
        if (next2 !== undefined) {
          key.next = undefined;
          if (previous !== undefined) {
            previous.next = next2;
            next2.previous = previous;
          } else {
            this.head = next2;
            this.head.previous = undefined;
          }
        }
        this.tail.next = key;
        key.previous = this.tail;
        this.tail = key;
      }
    }
  }
  remove() {
    const key = this.head;
    if (key !== undefined) {
      const next2 = key.next;
      if (next2 !== undefined) {
        key.next = undefined;
        this.head = next2;
        this.head.previous = undefined;
      } else {
        this.head = undefined;
        this.tail = undefined;
      }
    }
    return key;
  }
}
var makeKeySet = () => new KeySetImpl;
var makeCacheState = (map10, keys5, accesses, updating, hits, misses) => ({
  map: map10,
  keys: keys5,
  accesses,
  updating,
  hits,
  misses
});
var initialCacheState = () => makeCacheState(empty21(), makeKeySet(), unbounded(), make12(false), 0, 0);
var CacheSymbolKey = "effect/Cache";
var CacheTypeId = Symbol.for(CacheSymbolKey);
var cacheVariance = {
  _Key: (_) => _,
  _Error: (_) => _,
  _Value: (_) => _
};
var makeCacheStats = (options) => options;
var makeEntryStats = (loadedMillis) => ({
  loadedMillis
});

class CacheImpl {
  capacity;
  context;
  fiberId;
  lookup;
  timeToLive;
  [CacheTypeId] = cacheVariance;
  cacheState;
  constructor(capacity, context3, fiberId3, lookup, timeToLive) {
    this.capacity = capacity;
    this.context = context3;
    this.fiberId = fiberId3;
    this.lookup = lookup;
    this.timeToLive = timeToLive;
    this.cacheState = initialCacheState();
  }
  get(key) {
    return map9(this.getEither(key), merge);
  }
  get cacheStats() {
    return sync(() => makeCacheStats({
      hits: this.cacheState.hits,
      misses: this.cacheState.misses,
      size: size16(this.cacheState.map)
    }));
  }
  getOption(key) {
    return suspend(() => match2(get8(this.cacheState.map, key), {
      onNone: () => {
        const mapKey = makeMapKey(key);
        this.trackAccess(mapKey);
        this.trackMiss();
        return succeed(none2());
      },
      onSome: (value) => this.resolveMapValue(value)
    }));
  }
  getOptionComplete(key) {
    return suspend(() => match2(get8(this.cacheState.map, key), {
      onNone: () => {
        const mapKey = makeMapKey(key);
        this.trackAccess(mapKey);
        this.trackMiss();
        return succeed(none2());
      },
      onSome: (value) => this.resolveMapValue(value, true)
    }));
  }
  contains(key) {
    return sync(() => has4(this.cacheState.map, key));
  }
  entryStats(key) {
    return sync(() => {
      const option2 = get8(this.cacheState.map, key);
      if (isSome2(option2)) {
        switch (option2.value._tag) {
          case "Complete": {
            const loaded = option2.value.entryStats.loadedMillis;
            return some2(makeEntryStats(loaded));
          }
          case "Pending": {
            return none2();
          }
          case "Refreshing": {
            const loaded = option2.value.complete.entryStats.loadedMillis;
            return some2(makeEntryStats(loaded));
          }
        }
      }
      return none2();
    });
  }
  getEither(key) {
    return suspend(() => {
      const k = key;
      let mapKey = undefined;
      let deferred = undefined;
      let value = getOrUndefined(get8(this.cacheState.map, k));
      if (value === undefined) {
        deferred = unsafeMake3(this.fiberId);
        mapKey = makeMapKey(k);
        if (has4(this.cacheState.map, k)) {
          value = getOrUndefined(get8(this.cacheState.map, k));
        } else {
          set4(this.cacheState.map, k, pending2(mapKey, deferred));
        }
      }
      if (value === undefined) {
        this.trackAccess(mapKey);
        this.trackMiss();
        return map9(this.lookupValueOf(key, deferred), right2);
      } else {
        return flatMap7(this.resolveMapValue(value), match2({
          onNone: () => this.getEither(key),
          onSome: (value2) => succeed(left2(value2))
        }));
      }
    });
  }
  invalidate(key) {
    return sync(() => {
      remove6(this.cacheState.map, key);
    });
  }
  invalidateWhen(key, when2) {
    return sync(() => {
      const value = get8(this.cacheState.map, key);
      if (isSome2(value) && value.value._tag === "Complete") {
        if (value.value.exit._tag === "Success") {
          if (when2(value.value.exit.value)) {
            remove6(this.cacheState.map, key);
          }
        }
      }
    });
  }
  get invalidateAll() {
    return sync(() => {
      this.cacheState.map = empty21();
    });
  }
  refresh(key) {
    return clockWith3((clock3) => suspend(() => {
      const k = key;
      const deferred = unsafeMake3(this.fiberId);
      let value = getOrUndefined(get8(this.cacheState.map, k));
      if (value === undefined) {
        if (has4(this.cacheState.map, k)) {
          value = getOrUndefined(get8(this.cacheState.map, k));
        } else {
          set4(this.cacheState.map, k, pending2(makeMapKey(k), deferred));
        }
      }
      if (value === undefined) {
        return asVoid(this.lookupValueOf(key, deferred));
      } else {
        switch (value._tag) {
          case "Complete": {
            if (this.hasExpired(clock3, value.timeToLiveMillis)) {
              const found = getOrUndefined(get8(this.cacheState.map, k));
              if (equals(found, value)) {
                remove6(this.cacheState.map, k);
              }
              return asVoid(this.get(key));
            }
            return pipe(this.lookupValueOf(key, deferred), when(() => {
              const current = getOrUndefined(get8(this.cacheState.map, k));
              if (equals(current, value)) {
                const mapValue = refreshing(deferred, value);
                set4(this.cacheState.map, k, mapValue);
                return true;
              }
              return false;
            }), asVoid);
          }
          case "Pending": {
            return _await(value.deferred);
          }
          case "Refreshing": {
            return _await(value.deferred);
          }
        }
      }
    }));
  }
  set(key, value) {
    return clockWith3((clock3) => sync(() => {
      const now = clock3.unsafeCurrentTimeMillis();
      const k = key;
      const lookupResult = succeed2(value);
      const mapValue = complete2(makeMapKey(k), lookupResult, makeEntryStats(now), now + toMillis(decode(this.timeToLive(lookupResult))));
      set4(this.cacheState.map, k, mapValue);
    }));
  }
  get size() {
    return sync(() => {
      return size16(this.cacheState.map);
    });
  }
  get values() {
    return sync(() => {
      const values3 = [];
      for (const entry of this.cacheState.map) {
        if (entry[1]._tag === "Complete" && entry[1].exit._tag === "Success") {
          values3.push(entry[1].exit.value);
        }
      }
      return values3;
    });
  }
  get entries() {
    return sync(() => {
      const values3 = [];
      for (const entry of this.cacheState.map) {
        if (entry[1]._tag === "Complete" && entry[1].exit._tag === "Success") {
          values3.push([entry[0], entry[1].exit.value]);
        }
      }
      return values3;
    });
  }
  get keys() {
    return sync(() => {
      const keys5 = [];
      for (const entry of this.cacheState.map) {
        if (entry[1]._tag === "Complete" && entry[1].exit._tag === "Success") {
          keys5.push(entry[0]);
        }
      }
      return keys5;
    });
  }
  resolveMapValue(value, ignorePending = false) {
    return clockWith3((clock3) => {
      switch (value._tag) {
        case "Complete": {
          this.trackAccess(value.key);
          if (this.hasExpired(clock3, value.timeToLiveMillis)) {
            remove6(this.cacheState.map, value.key.current);
            return succeed(none2());
          }
          this.trackHit();
          return map9(value.exit, some2);
        }
        case "Pending": {
          this.trackAccess(value.key);
          this.trackHit();
          if (ignorePending) {
            return succeed(none2());
          }
          return map9(_await(value.deferred), some2);
        }
        case "Refreshing": {
          this.trackAccess(value.complete.key);
          this.trackHit();
          if (this.hasExpired(clock3, value.complete.timeToLiveMillis)) {
            if (ignorePending) {
              return succeed(none2());
            }
            return map9(_await(value.deferred), some2);
          }
          return map9(value.complete.exit, some2);
        }
      }
    });
  }
  trackHit() {
    this.cacheState.hits = this.cacheState.hits + 1;
  }
  trackMiss() {
    this.cacheState.misses = this.cacheState.misses + 1;
  }
  trackAccess(key) {
    offer(this.cacheState.accesses, key);
    if (compareAndSet(this.cacheState.updating, false, true)) {
      let loop2 = true;
      while (loop2) {
        const key2 = poll7(this.cacheState.accesses, EmptyMutableQueue);
        if (key2 === EmptyMutableQueue) {
          loop2 = false;
        } else {
          this.cacheState.keys.add(key2);
        }
      }
      let size19 = size16(this.cacheState.map);
      loop2 = size19 > this.capacity;
      while (loop2) {
        const key2 = this.cacheState.keys.remove();
        if (key2 !== undefined) {
          if (has4(this.cacheState.map, key2.current)) {
            remove6(this.cacheState.map, key2.current);
            size19 = size19 - 1;
            loop2 = size19 > this.capacity;
          }
        } else {
          loop2 = false;
        }
      }
      set2(this.cacheState.updating, false);
    }
  }
  hasExpired(clock3, timeToLiveMillis) {
    return clock3.unsafeCurrentTimeMillis() > timeToLiveMillis;
  }
  lookupValueOf(input, deferred) {
    return clockWith3((clock3) => suspend(() => {
      const key = input;
      return pipe(this.lookup(input), provideContext(this.context), exit, flatMap7((exit2) => {
        const now = clock3.unsafeCurrentTimeMillis();
        const stats = makeEntryStats(now);
        const value = complete2(makeMapKey(key), exit2, stats, now + toMillis(decode(this.timeToLive(exit2))));
        set4(this.cacheState.map, key, value);
        return zipRight(done2(deferred, exit2), exit2);
      }), onInterrupt(() => zipRight(interrupt3(deferred), sync(() => {
        remove6(this.cacheState.map, key);
      }))));
    }));
  }
}
var unsafeMakeWith = (capacity, lookup, timeToLive) => new CacheImpl(capacity, empty4(), none3, lookup, (exit2) => decode(timeToLive(exit2)));
// node_modules/effect/dist/esm/Cause.js
var fail4 = fail;
var die4 = die;
var interrupt5 = interrupt;
var NoSuchElementException2 = NoSuchElementException;
// node_modules/effect/dist/esm/Effect.js
var exports_Effect = {};
__export(exports_Effect, {
  zipWith: () => {
    {
      return zipWith6;
    }
  },
  zipRight: () => {
    {
      return zipRight3;
    }
  },
  zipLeft: () => {
    {
      return zipLeft3;
    }
  },
  zip: () => {
    {
      return zip4;
    }
  },
  yieldNow: () => {
    {
      return yieldNow3;
    }
  },
  withUnhandledErrorLogLevel: () => {
    {
      return withUnhandledErrorLogLevel2;
    }
  },
  withTracerTiming: () => {
    {
      return withTracerTiming2;
    }
  },
  withTracerScoped: () => {
    {
      return withTracerScoped2;
    }
  },
  withTracerEnabled: () => {
    {
      return withTracerEnabled2;
    }
  },
  withTracer: () => {
    {
      return withTracer2;
    }
  },
  withSpanScoped: () => {
    {
      return withSpanScoped2;
    }
  },
  withSpan: () => {
    {
      return withSpan2;
    }
  },
  withSchedulingPriority: () => {
    {
      return withSchedulingPriority2;
    }
  },
  withScheduler: () => {
    {
      return withScheduler2;
    }
  },
  withRuntimeFlagsPatchScoped: () => {
    {
      return withRuntimeFlagsPatchScoped;
    }
  },
  withRuntimeFlagsPatch: () => {
    {
      return withRuntimeFlagsPatch;
    }
  },
  withRequestCaching: () => {
    {
      return withRequestCaching2;
    }
  },
  withRequestCache: () => {
    {
      return withRequestCache2;
    }
  },
  withRequestBatching: () => {
    {
      return withRequestBatching2;
    }
  },
  withRandomScoped: () => {
    {
      return withRandomScoped2;
    }
  },
  withRandom: () => {
    {
      return withRandom2;
    }
  },
  withParentSpan: () => {
    {
      return withParentSpan2;
    }
  },
  withMetric: () => {
    {
      return withMetric2;
    }
  },
  withMaxOpsBeforeYield: () => {
    {
      return withMaxOpsBeforeYield2;
    }
  },
  withLogSpan: () => {
    {
      return withLogSpan2;
    }
  },
  withFiberRuntime: () => {
    {
      return withFiberRuntime2;
    }
  },
  withEarlyRelease: () => {
    {
      return withEarlyRelease2;
    }
  },
  withConsoleScoped: () => {
    {
      return withConsoleScoped2;
    }
  },
  withConsole: () => {
    {
      return withConsole2;
    }
  },
  withConfigProviderScoped: () => {
    {
      return withConfigProviderScoped2;
    }
  },
  withConfigProvider: () => {
    {
      return withConfigProvider2;
    }
  },
  withConcurrency: () => {
    {
      return withConcurrency2;
    }
  },
  withClockScoped: () => {
    {
      return withClockScoped2;
    }
  },
  withClock: () => {
    {
      return withClock2;
    }
  },
  whileLoop: () => {
    {
      return whileLoop2;
    }
  },
  whenRef: () => {
    {
      return whenRef2;
    }
  },
  whenFiberRef: () => {
    {
      return whenFiberRef2;
    }
  },
  whenEffect: () => {
    {
      return whenEffect2;
    }
  },
  when: () => {
    {
      return when2;
    }
  },
  void: () => {
    {
      return _void;
    }
  },
  validateWith: () => {
    {
      return validateWith2;
    }
  },
  validateFirst: () => {
    {
      return validateFirst2;
    }
  },
  validateAll: () => {
    {
      return validateAll2;
    }
  },
  validate: () => {
    {
      return validate2;
    }
  },
  using: () => {
    {
      return using2;
    }
  },
  useSpan: () => {
    {
      return useSpan2;
    }
  },
  updateService: () => {
    {
      return updateService2;
    }
  },
  updateFiberRefs: () => {
    {
      return updateFiberRefs2;
    }
  },
  unsandbox: () => {
    {
      return unsandbox2;
    }
  },
  unsafeMakeSemaphore: () => {
    {
      return unsafeMakeSemaphore2;
    }
  },
  unlessEffect: () => {
    {
      return unlessEffect2;
    }
  },
  unless: () => {
    {
      return unless2;
    }
  },
  uninterruptibleMask: () => {
    {
      return uninterruptibleMask2;
    }
  },
  uninterruptible: () => {
    {
      return uninterruptible2;
    }
  },
  tryPromise: () => {
    {
      return tryPromise2;
    }
  },
  tryMapPromise: () => {
    {
      return tryMapPromise2;
    }
  },
  tryMap: () => {
    {
      return tryMap2;
    }
  },
  try: () => {
    {
      return try_2;
    }
  },
  transplant: () => {
    {
      return transplant2;
    }
  },
  tracerWith: () => {
    {
      return tracerWith4;
    }
  },
  tracer: () => {
    {
      return tracer2;
    }
  },
  timeoutTo: () => {
    {
      return timeoutTo2;
    }
  },
  timeoutOption: () => {
    {
      return timeoutOption2;
    }
  },
  timeoutFailCause: () => {
    {
      return timeoutFailCause2;
    }
  },
  timeoutFail: () => {
    {
      return timeoutFail2;
    }
  },
  timeout: () => {
    {
      return timeout2;
    }
  },
  timedWith: () => {
    {
      return timedWith2;
    }
  },
  timed: () => {
    {
      return timed2;
    }
  },
  tapErrorTag: () => {
    {
      return tapErrorTag2;
    }
  },
  tapErrorCause: () => {
    {
      return tapErrorCause2;
    }
  },
  tapError: () => {
    {
      return tapError2;
    }
  },
  tapDefect: () => {
    {
      return tapDefect2;
    }
  },
  tapBoth: () => {
    {
      return tapBoth2;
    }
  },
  tap: () => {
    {
      return tap2;
    }
  },
  takeWhile: () => {
    {
      return takeWhile2;
    }
  },
  takeUntil: () => {
    {
      return takeUntil2;
    }
  },
  tagMetricsScoped: () => {
    {
      return tagMetricsScoped2;
    }
  },
  tagMetrics: () => {
    {
      return tagMetrics2;
    }
  },
  sync: () => {
    {
      return sync3;
    }
  },
  suspend: () => {
    {
      return suspend2;
    }
  },
  supervised: () => {
    {
      return supervised2;
    }
  },
  summarized: () => {
    {
      return summarized2;
    }
  },
  succeedSome: () => {
    {
      return succeedSome2;
    }
  },
  succeedNone: () => {
    {
      return succeedNone2;
    }
  },
  succeed: () => {
    {
      return succeed6;
    }
  },
  step: () => {
    {
      return step3;
    }
  },
  spanLinks: () => {
    {
      return spanLinks2;
    }
  },
  spanAnnotations: () => {
    {
      return spanAnnotations2;
    }
  },
  sleep: () => {
    {
      return sleep4;
    }
  },
  setFiberRefs: () => {
    {
      return setFiberRefs2;
    }
  },
  serviceOptional: () => {
    {
      return serviceOptional2;
    }
  },
  serviceOption: () => {
    {
      return serviceOption2;
    }
  },
  serviceMembers: () => {
    {
      return serviceMembers2;
    }
  },
  serviceFunctions: () => {
    {
      return serviceFunctions2;
    }
  },
  serviceFunctionEffect: () => {
    {
      return serviceFunctionEffect2;
    }
  },
  serviceFunction: () => {
    {
      return serviceFunction2;
    }
  },
  serviceConstants: () => {
    {
      return serviceConstants2;
    }
  },
  sequentialFinalizers: () => {
    {
      return sequentialFinalizers2;
    }
  },
  scoped: () => {
    {
      return scoped;
    }
  },
  scopeWith: () => {
    {
      return scopeWith2;
    }
  },
  scope: () => {
    {
      return scope2;
    }
  },
  scheduleFrom: () => {
    {
      return scheduleFrom;
    }
  },
  scheduleForked: () => {
    {
      return scheduleForked2;
    }
  },
  schedule: () => {
    {
      return schedule;
    }
  },
  sandbox: () => {
    {
      return sandbox2;
    }
  },
  runtime: () => {
    {
      return runtime3;
    }
  },
  runSyncExit: () => {
    {
      return runSyncExit;
    }
  },
  runSync: () => {
    {
      return runSync;
    }
  },
  runRequestBlock: () => {
    {
      return runRequestBlock2;
    }
  },
  runPromiseExit: () => {
    {
      return runPromiseExit;
    }
  },
  runPromise: () => {
    {
      return runPromise;
    }
  },
  runFork: () => {
    {
      return runFork;
    }
  },
  runCallback: () => {
    {
      return runCallback;
    }
  },
  retryOrElse: () => {
    {
      return retryOrElse;
    }
  },
  retry: () => {
    {
      return retry;
    }
  },
  request: () => {
    {
      return request8;
    }
  },
  replicateEffect: () => {
    {
      return replicateEffect2;
    }
  },
  replicate: () => {
    {
      return replicate2;
    }
  },
  repeatOrElse: () => {
    {
      return repeatOrElse;
    }
  },
  repeatN: () => {
    {
      return repeatN2;
    }
  },
  repeat: () => {
    {
      return repeat;
    }
  },
  reduceWhile: () => {
    {
      return reduceWhile2;
    }
  },
  reduceRight: () => {
    {
      return reduceRight3;
    }
  },
  reduceEffect: () => {
    {
      return reduceEffect3;
    }
  },
  reduce: () => {
    {
      return reduce12;
    }
  },
  randomWith: () => {
    {
      return randomWith2;
    }
  },
  random: () => {
    {
      return random4;
    }
  },
  raceWith: () => {
    {
      return raceWith2;
    }
  },
  raceFirst: () => {
    {
      return raceFirst2;
    }
  },
  raceAll: () => {
    {
      return raceAll2;
    }
  },
  race: () => {
    {
      return race2;
    }
  },
  provideServiceEffect: () => {
    {
      return provideServiceEffect2;
    }
  },
  provideService: () => {
    {
      return provideService3;
    }
  },
  provide: () => {
    {
      return provide;
    }
  },
  promise: () => {
    {
      return promise2;
    }
  },
  patchRuntimeFlags: () => {
    {
      return patchRuntimeFlags;
    }
  },
  patchFiberRefs: () => {
    {
      return patchFiberRefs2;
    }
  },
  partition: () => {
    {
      return partition4;
    }
  },
  parallelFinalizers: () => {
    {
      return parallelFinalizers2;
    }
  },
  parallelErrors: () => {
    {
      return parallelErrors2;
    }
  },
  orElseSucceed: () => {
    {
      return orElseSucceed2;
    }
  },
  orElseFail: () => {
    {
      return orElseFail2;
    }
  },
  orElse: () => {
    {
      return orElse3;
    }
  },
  orDieWith: () => {
    {
      return orDieWith2;
    }
  },
  orDie: () => {
    {
      return orDie2;
    }
  },
  optionFromOptional: () => {
    {
      return optionFromOptional2;
    }
  },
  option: () => {
    {
      return option2;
    }
  },
  once: () => {
    {
      return once3;
    }
  },
  onInterrupt: () => {
    {
      return onInterrupt2;
    }
  },
  onExit: () => {
    {
      return onExit2;
    }
  },
  onError: () => {
    {
      return onError2;
    }
  },
  none: () => {
    {
      return none9;
    }
  },
  never: () => {
    {
      return never3;
    }
  },
  negate: () => {
    {
      return negate2;
    }
  },
  metricLabels: () => {
    {
      return metricLabels2;
    }
  },
  mergeAll: () => {
    {
      return mergeAll2;
    }
  },
  merge: () => {
    {
      return merge6;
    }
  },
  matchEffect: () => {
    {
      return matchEffect2;
    }
  },
  matchCauseEffect: () => {
    {
      return matchCauseEffect2;
    }
  },
  matchCause: () => {
    {
      return matchCause2;
    }
  },
  match: () => {
    {
      return match12;
    }
  },
  mapInputContext: () => {
    {
      return mapInputContext3;
    }
  },
  mapErrorCause: () => {
    {
      return mapErrorCause2;
    }
  },
  mapError: () => {
    {
      return mapError2;
    }
  },
  mapBoth: () => {
    {
      return mapBoth3;
    }
  },
  mapAccum: () => {
    {
      return mapAccum3;
    }
  },
  map: () => {
    {
      return map12;
    }
  },
  makeSpanScoped: () => {
    {
      return makeSpanScoped2;
    }
  },
  makeSpan: () => {
    {
      return makeSpan2;
    }
  },
  makeSemaphore: () => {
    {
      return makeSemaphore2;
    }
  },
  loop: () => {
    {
      return loop2;
    }
  },
  logWithLevel: () => {
    {
      return logWithLevel2;
    }
  },
  logWarning: () => {
    {
      return logWarning2;
    }
  },
  logTrace: () => {
    {
      return logTrace2;
    }
  },
  logInfo: () => {
    {
      return logInfo2;
    }
  },
  logFatal: () => {
    {
      return logFatal2;
    }
  },
  logError: () => {
    {
      return logError2;
    }
  },
  logDebug: () => {
    {
      return logDebug2;
    }
  },
  logAnnotations: () => {
    {
      return logAnnotations2;
    }
  },
  log: () => {
    {
      return log9;
    }
  },
  locallyWith: () => {
    {
      return locallyWith;
    }
  },
  locallyScopedWith: () => {
    {
      return locallyScopedWith;
    }
  },
  locallyScoped: () => {
    {
      return locallyScoped;
    }
  },
  locally: () => {
    {
      return locally;
    }
  },
  linkSpans: () => {
    {
      return linkSpans2;
    }
  },
  liftPredicate: () => {
    {
      return liftPredicate2;
    }
  },
  let: () => {
    {
      return let_3;
    }
  },
  labelMetricsScoped: () => {
    {
      return labelMetricsScoped2;
    }
  },
  labelMetrics: () => {
    {
      return labelMetrics2;
    }
  },
  iterate: () => {
    {
      return iterate2;
    }
  },
  isSuccess: () => {
    {
      return isSuccess3;
    }
  },
  isFailure: () => {
    {
      return isFailure3;
    }
  },
  isEffect: () => {
    {
      return isEffect2;
    }
  },
  intoDeferred: () => {
    {
      return intoDeferred2;
    }
  },
  interruptibleMask: () => {
    {
      return interruptibleMask2;
    }
  },
  interruptible: () => {
    {
      return interruptible3;
    }
  },
  interruptWith: () => {
    {
      return interruptWith2;
    }
  },
  interrupt: () => {
    {
      return interrupt6;
    }
  },
  inheritFiberRefs: () => {
    {
      return inheritFiberRefs2;
    }
  },
  ignoreLogged: () => {
    {
      return ignoreLogged2;
    }
  },
  ignore: () => {
    {
      return ignore2;
    }
  },
  if: () => {
    {
      return if_2;
    }
  },
  head: () => {
    {
      return head4;
    }
  },
  getRuntimeFlags: () => {
    {
      return getRuntimeFlags;
    }
  },
  getFiberRefs: () => {
    {
      return getFiberRefs;
    }
  },
  gen: () => {
    {
      return gen3;
    }
  },
  functionWithSpan: () => {
    {
      return functionWithSpan2;
    }
  },
  fromNullable: () => {
    {
      return fromNullable3;
    }
  },
  fromFiberEffect: () => {
    {
      return fromFiberEffect2;
    }
  },
  fromFiber: () => {
    {
      return fromFiber2;
    }
  },
  forkWithErrorHandler: () => {
    {
      return forkWithErrorHandler2;
    }
  },
  forkScoped: () => {
    {
      return forkScoped2;
    }
  },
  forkIn: () => {
    {
      return forkIn2;
    }
  },
  forkDaemon: () => {
    {
      return forkDaemon2;
    }
  },
  forkAll: () => {
    {
      return forkAll2;
    }
  },
  fork: () => {
    {
      return fork3;
    }
  },
  forever: () => {
    {
      return forever3;
    }
  },
  forEach: () => {
    {
      return forEach8;
    }
  },
  flipWith: () => {
    {
      return flipWith2;
    }
  },
  flip: () => {
    {
      return flip2;
    }
  },
  flatten: () => {
    {
      return flatten6;
    }
  },
  flatMap: () => {
    {
      return flatMap8;
    }
  },
  firstSuccessOf: () => {
    {
      return firstSuccessOf2;
    }
  },
  findFirst: () => {
    {
      return findFirst6;
    }
  },
  finalizersMask: () => {
    {
      return finalizersMask2;
    }
  },
  filterOrFail: () => {
    {
      return filterOrFail2;
    }
  },
  filterOrElse: () => {
    {
      return filterOrElse2;
    }
  },
  filterOrDieMessage: () => {
    {
      return filterOrDieMessage2;
    }
  },
  filterOrDie: () => {
    {
      return filterOrDie2;
    }
  },
  filterMap: () => {
    {
      return filterMap4;
    }
  },
  filter: () => {
    {
      return filter7;
    }
  },
  fiberIdWith: () => {
    {
      return fiberIdWith2;
    }
  },
  fiberId: () => {
    {
      return fiberId3;
    }
  },
  failSync: () => {
    {
      return failSync2;
    }
  },
  failCauseSync: () => {
    {
      return failCauseSync2;
    }
  },
  failCause: () => {
    {
      return failCause5;
    }
  },
  fail: () => {
    {
      return fail7;
    }
  },
  exit: () => {
    {
      return exit2;
    }
  },
  exists: () => {
    {
      return exists3;
    }
  },
  every: () => {
    {
      return every5;
    }
  },
  eventually: () => {
    {
      return eventually2;
    }
  },
  ensuringChildren: () => {
    {
      return ensuringChildren2;
    }
  },
  ensuringChild: () => {
    {
      return ensuringChild2;
    }
  },
  ensuring: () => {
    {
      return ensuring3;
    }
  },
  either: () => {
    {
      return either4;
    }
  },
  dropWhile: () => {
    {
      return dropWhile2;
    }
  },
  dropUntil: () => {
    {
      return dropUntil2;
    }
  },
  disconnect: () => {
    {
      return disconnect2;
    }
  },
  diffFiberRefs: () => {
    {
      return diffFiberRefs2;
    }
  },
  dieSync: () => {
    {
      return dieSync2;
    }
  },
  dieMessage: () => {
    {
      return dieMessage2;
    }
  },
  die: () => {
    {
      return die5;
    }
  },
  descriptorWith: () => {
    {
      return descriptorWith2;
    }
  },
  descriptor: () => {
    {
      return descriptor2;
    }
  },
  delay: () => {
    {
      return delay2;
    }
  },
  daemonChildren: () => {
    {
      return daemonChildren2;
    }
  },
  custom: () => {
    {
      return custom2;
    }
  },
  currentSpan: () => {
    {
      return currentSpan2;
    }
  },
  currentParentSpan: () => {
    {
      return currentParentSpan2;
    }
  },
  contextWithEffect: () => {
    {
      return contextWithEffect2;
    }
  },
  contextWith: () => {
    {
      return contextWith2;
    }
  },
  context: () => {
    {
      return context4;
    }
  },
  consoleWith: () => {
    {
      return consoleWith2;
    }
  },
  console: () => {
    {
      return console5;
    }
  },
  configProviderWith: () => {
    {
      return configProviderWith2;
    }
  },
  clockWith: () => {
    {
      return clockWith4;
    }
  },
  clock: () => {
    {
      return clock3;
    }
  },
  checkInterruptible: () => {
    {
      return checkInterruptible2;
    }
  },
  cause: () => {
    {
      return cause2;
    }
  },
  catchTags: () => {
    {
      return catchTags2;
    }
  },
  catchTag: () => {
    {
      return catchTag2;
    }
  },
  catchSomeDefect: () => {
    {
      return catchSomeDefect2;
    }
  },
  catchSomeCause: () => {
    {
      return catchSomeCause2;
    }
  },
  catchSome: () => {
    {
      return catchSome2;
    }
  },
  catchIf: () => {
    {
      return catchIf2;
    }
  },
  catchAllDefect: () => {
    {
      return catchAllDefect2;
    }
  },
  catchAllCause: () => {
    {
      return catchAllCause2;
    }
  },
  catchAll: () => {
    {
      return catchAll2;
    }
  },
  catch: () => {
    {
      return _catch2;
    }
  },
  cachedWithTTL: () => {
    {
      return cachedWithTTL;
    }
  },
  cachedInvalidateWithTTL: () => {
    {
      return cachedInvalidateWithTTL2;
    }
  },
  cachedFunction: () => {
    {
      return cachedFunction2;
    }
  },
  cached: () => {
    {
      return cached3;
    }
  },
  cacheRequestResult: () => {
    {
      return cacheRequestResult;
    }
  },
  blocked: () => {
    {
      return blocked2;
    }
  },
  bindTo: () => {
    {
      return bindTo3;
    }
  },
  bind: () => {
    {
      return bind3;
    }
  },
  awaitAllChildren: () => {
    {
      return awaitAllChildren2;
    }
  },
  asyncEffect: () => {
    {
      return asyncEffect2;
    }
  },
  async: () => {
    {
      return async2;
    }
  },
  asVoid: () => {
    {
      return asVoid3;
    }
  },
  asSomeError: () => {
    {
      return asSomeError2;
    }
  },
  asSome: () => {
    {
      return asSome2;
    }
  },
  as: () => {
    {
      return as4;
    }
  },
  ap: () => {
    {
      return ap;
    }
  },
  annotateSpans: () => {
    {
      return annotateSpans2;
    }
  },
  annotateLogsScoped: () => {
    {
      return annotateLogsScoped2;
    }
  },
  annotateLogs: () => {
    {
      return annotateLogs2;
    }
  },
  annotateCurrentSpan: () => {
    {
      return annotateCurrentSpan2;
    }
  },
  andThen: () => {
    {
      return andThen5;
    }
  },
  allowInterrupt: () => {
    {
      return allowInterrupt2;
    }
  },
  allWith: () => {
    {
      return allWith2;
    }
  },
  allSuccesses: () => {
    {
      return allSuccesses2;
    }
  },
  all: () => {
    {
      return all4;
    }
  },
  addFinalizer: () => {
    {
      return addFinalizer2;
    }
  },
  acquireUseRelease: () => {
    {
      return acquireUseRelease2;
    }
  },
  acquireReleaseInterruptible: () => {
    {
      return acquireReleaseInterruptible2;
    }
  },
  acquireRelease: () => {
    {
      return acquireRelease2;
    }
  },
  Tag: () => {
    {
      return Tag2;
    }
  },
  EffectTypeId: () => {
    {
      return EffectTypeId4;
    }
  },
  Do: () => {
    {
      return Do2;
    }
  }
});

// node_modules/effect/dist/esm/internal/schedule/interval.js
var IntervalSymbolKey = "effect/ScheduleInterval";
var IntervalTypeId = Symbol.for(IntervalSymbolKey);
var empty30 = {
  [IntervalTypeId]: IntervalTypeId,
  startMillis: 0,
  endMillis: 0
};
var make36 = (startMillis, endMillis) => {
  if (startMillis > endMillis) {
    return empty30;
  }
  return {
    [IntervalTypeId]: IntervalTypeId,
    startMillis,
    endMillis
  };
};
var lessThan3 = dual(2, (self2, that) => min2(self2, that) === self2);
var min2 = dual(2, (self2, that) => {
  if (self2.endMillis <= that.startMillis)
    return self2;
  if (that.endMillis <= self2.startMillis)
    return that;
  if (self2.startMillis < that.startMillis)
    return self2;
  if (that.startMillis < self2.startMillis)
    return that;
  if (self2.endMillis <= that.endMillis)
    return self2;
  return that;
});
var isEmpty7 = (self2) => {
  return self2.startMillis >= self2.endMillis;
};
var intersect = dual(2, (self2, that) => {
  const start = Math.max(self2.startMillis, that.startMillis);
  const end = Math.min(self2.endMillis, that.endMillis);
  return make36(start, end);
});
var size20 = (self2) => {
  return millis(self2.endMillis - self2.startMillis);
};
var after = (startMilliseconds) => {
  return make36(startMilliseconds, Number.POSITIVE_INFINITY);
};

// node_modules/effect/dist/esm/ScheduleInterval.js
var make37 = make36;
var empty31 = empty30;
var lessThan4 = lessThan3;
var isEmpty8 = isEmpty7;
var intersect2 = intersect;
var size21 = size20;
var after2 = after;

// node_modules/effect/dist/esm/internal/schedule/intervals.js
var IntervalsSymbolKey = "effect/ScheduleIntervals";
var IntervalsTypeId = Symbol.for(IntervalsSymbolKey);
var make38 = (intervals) => {
  return {
    [IntervalsTypeId]: IntervalsTypeId,
    intervals
  };
};
var union6 = dual(2, (self2, that) => {
  if (!isNonEmpty(that.intervals)) {
    return self2;
  }
  if (!isNonEmpty(self2.intervals)) {
    return that;
  }
  if (headNonEmpty2(self2.intervals).startMillis < headNonEmpty2(that.intervals).startMillis) {
    return unionLoop(tailNonEmpty2(self2.intervals), that.intervals, headNonEmpty2(self2.intervals), empty5());
  }
  return unionLoop(self2.intervals, tailNonEmpty2(that.intervals), headNonEmpty2(that.intervals), empty5());
});
var unionLoop = (_self, _that, _interval, _acc) => {
  let self2 = _self;
  let that = _that;
  let interval = _interval;
  let acc = _acc;
  while (isNonEmpty(self2) || isNonEmpty(that)) {
    if (!isNonEmpty(self2) && isNonEmpty(that)) {
      if (interval.endMillis < headNonEmpty2(that).startMillis) {
        acc = pipe(acc, prepend2(interval));
        interval = headNonEmpty2(that);
        that = tailNonEmpty2(that);
        self2 = empty5();
      } else {
        interval = make37(interval.startMillis, headNonEmpty2(that).endMillis);
        that = tailNonEmpty2(that);
        self2 = empty5();
      }
    } else if (isNonEmpty(self2) && isEmpty(that)) {
      if (interval.endMillis < headNonEmpty2(self2).startMillis) {
        acc = pipe(acc, prepend2(interval));
        interval = headNonEmpty2(self2);
        that = empty5();
        self2 = tailNonEmpty2(self2);
      } else {
        interval = make37(interval.startMillis, headNonEmpty2(self2).endMillis);
        that = empty5();
        self2 = tailNonEmpty2(self2);
      }
    } else if (isNonEmpty(self2) && isNonEmpty(that)) {
      if (headNonEmpty2(self2).startMillis < headNonEmpty2(that).startMillis) {
        if (interval.endMillis < headNonEmpty2(self2).startMillis) {
          acc = pipe(acc, prepend2(interval));
          interval = headNonEmpty2(self2);
          self2 = tailNonEmpty2(self2);
        } else {
          interval = make37(interval.startMillis, headNonEmpty2(self2).endMillis);
          self2 = tailNonEmpty2(self2);
        }
      } else if (interval.endMillis < headNonEmpty2(that).startMillis) {
        acc = pipe(acc, prepend2(interval));
        interval = headNonEmpty2(that);
        that = tailNonEmpty2(that);
      } else {
        interval = make37(interval.startMillis, headNonEmpty2(that).endMillis);
        that = tailNonEmpty2(that);
      }
    } else {
      throw new Error(getBugErrorMessage("Intervals.unionLoop"));
    }
  }
  return make38(pipe(acc, prepend2(interval), reverse2));
};
var intersect3 = dual(2, (self2, that) => intersectLoop(self2.intervals, that.intervals, empty5()));
var intersectLoop = (_left, _right, _acc) => {
  let left3 = _left;
  let right3 = _right;
  let acc = _acc;
  while (isNonEmpty(left3) && isNonEmpty(right3)) {
    const interval = pipe(headNonEmpty2(left3), intersect2(headNonEmpty2(right3)));
    const intervals = isEmpty8(interval) ? acc : pipe(acc, prepend2(interval));
    if (pipe(headNonEmpty2(left3), lessThan4(headNonEmpty2(right3)))) {
      left3 = tailNonEmpty2(left3);
    } else {
      right3 = tailNonEmpty2(right3);
    }
    acc = intervals;
  }
  return make38(reverse2(acc));
};
var start = (self2) => {
  return pipe(self2.intervals, head2, getOrElse(() => empty31)).startMillis;
};
var end = (self2) => {
  return pipe(self2.intervals, head2, getOrElse(() => empty31)).endMillis;
};
var lessThan5 = dual(2, (self2, that) => start(self2) < start(that));
var isNonEmpty3 = (self2) => {
  return isNonEmpty(self2.intervals);
};
var max3 = dual(2, (self2, that) => lessThan5(self2, that) ? that : self2);

// node_modules/effect/dist/esm/ScheduleIntervals.js
var make39 = make38;
var union7 = union6;
var intersect4 = intersect3;
var start2 = start;
var end2 = end;
var lessThan6 = lessThan5;
var isNonEmpty4 = isNonEmpty3;
var max4 = max3;

// node_modules/effect/dist/esm/internal/schedule/decision.js
var OP_CONTINUE = "Continue";
var OP_DONE2 = "Done";
var _continue = (intervals) => {
  return {
    _tag: OP_CONTINUE,
    intervals
  };
};
var continueWith = (interval) => {
  return {
    _tag: OP_CONTINUE,
    intervals: make39(of2(interval))
  };
};
var done5 = {
  _tag: OP_DONE2
};
var isContinue = (self2) => {
  return self2._tag === OP_CONTINUE;
};
var isDone3 = (self2) => {
  return self2._tag === OP_DONE2;
};

// node_modules/effect/dist/esm/ScheduleDecision.js
var _continue2 = _continue;
var continueWith2 = continueWith;
var done6 = done5;
var isContinue2 = isContinue;
var isDone4 = isDone3;

// node_modules/effect/dist/esm/Scope.js
var close = scopeClose;
var fork2 = scopeFork;

// node_modules/effect/dist/esm/String.js
var isNonEmpty5 = (self2) => self2.length > 0;

// node_modules/effect/dist/esm/Cron.js
var aliasOrValue = function(field, aliases) {
  return aliases?.[field.toLocaleLowerCase()] ?? Number(field);
};
var TypeId16 = Symbol.for("effect/Cron");
var CronProto = {
  [TypeId16]: TypeId16,
  [symbol2](that) {
    return isCron(that) && equals4(this, that);
  },
  [symbol]() {
    return pipe(array2(fromIterable(this.minutes)), combine(array2(fromIterable(this.hours))), combine(array2(fromIterable(this.days))), combine(array2(fromIterable(this.months))), combine(array2(fromIterable(this.weekdays))), cached(this));
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Cron",
      minutes: fromIterable(this.minutes),
      hours: fromIterable(this.hours),
      days: fromIterable(this.days),
      months: fromIterable(this.months),
      weekdays: fromIterable(this.weekdays)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var isCron = (u) => hasProperty(u, TypeId16);
var make40 = ({
  days: days2,
  hours: hours2,
  minutes: minutes2,
  months,
  weekdays
}) => {
  const o = Object.create(CronProto);
  o.minutes = new Set(sort(minutes2, Order));
  o.hours = new Set(sort(hours2, Order));
  o.days = new Set(sort(days2, Order));
  o.months = new Set(sort(months, Order));
  o.weekdays = new Set(sort(weekdays, Order));
  return o;
};
var ParseErrorTypeId = Symbol.for("effect/Cron/errors/ParseError");
var ParseErrorProto = {
  _tag: "ParseError",
  [ParseErrorTypeId]: ParseErrorTypeId
};
var ParseError = (message, input) => {
  const o = Object.create(ParseErrorProto);
  o.message = message;
  if (input !== undefined) {
    o.input = input;
  }
  return o;
};
var parse = (cron) => {
  const segments = cron.split(" ").filter(isNonEmpty5);
  if (segments.length !== 5) {
    return left2(ParseError(`Invalid number of segments in cron expression`, cron));
  }
  const [minutes2, hours2, days2, months, weekdays] = segments;
  return all({
    minutes: parseSegment(minutes2, minuteOptions),
    hours: parseSegment(hours2, hourOptions),
    days: parseSegment(days2, dayOptions),
    months: parseSegment(months, monthOptions),
    weekdays: parseSegment(weekdays, weekdayOptions)
  }).pipe(map((segments2) => make40(segments2)));
};
var match10 = (cron, date) => {
  const {
    days: days2,
    hours: hours2,
    minutes: minutes2,
    months,
    weekdays
  } = cron;
  const minute = date.getMinutes();
  if (minutes2.size !== 0 && !minutes2.has(minute)) {
    return false;
  }
  const hour = date.getHours();
  if (hours2.size !== 0 && !hours2.has(hour)) {
    return false;
  }
  const month = date.getMonth() + 1;
  if (months.size !== 0 && !months.has(month)) {
    return false;
  }
  if (days2.size === 0 && weekdays.size === 0) {
    return true;
  }
  const day = date.getDate();
  if (weekdays.size === 0) {
    return days2.has(day);
  }
  const weekday = date.getDay();
  if (days2.size === 0) {
    return weekdays.has(weekday);
  }
  return days2.has(day) || weekdays.has(weekday);
};
var next2 = (cron, now) => {
  const {
    days: days2,
    hours: hours2,
    minutes: minutes2,
    months,
    weekdays
  } = cron;
  const restrictMinutes = minutes2.size !== 0;
  const restrictHours = hours2.size !== 0;
  const restrictDays = days2.size !== 0;
  const restrictMonths = months.size !== 0;
  const restrictWeekdays = weekdays.size !== 0;
  const current = now ? new Date(now.getTime()) : new Date;
  current.setMinutes(current.getMinutes() + 1);
  current.setSeconds(0);
  current.setMilliseconds(0);
  const limit = new Date(current).setFullYear(current.getFullYear() + 8);
  while (current.getTime() <= limit) {
    if (restrictMonths && !months.has(current.getMonth() + 1)) {
      current.setMonth(current.getMonth() + 1);
      current.setDate(1);
      current.setHours(0);
      current.setMinutes(0);
      continue;
    }
    if (restrictDays && restrictWeekdays) {
      if (!days2.has(current.getDate()) && !weekdays.has(current.getDay())) {
        current.setDate(current.getDate() + 1);
        current.setHours(0);
        current.setMinutes(0);
        continue;
      }
    } else if (restrictDays) {
      if (!days2.has(current.getDate())) {
        current.setDate(current.getDate() + 1);
        current.setHours(0);
        current.setMinutes(0);
        continue;
      }
    } else if (restrictWeekdays) {
      if (!weekdays.has(current.getDay())) {
        current.setDate(current.getDate() + 1);
        current.setHours(0);
        current.setMinutes(0);
        continue;
      }
    }
    if (restrictHours && !hours2.has(current.getHours())) {
      current.setHours(current.getHours() + 1);
      current.setMinutes(0);
      continue;
    }
    if (restrictMinutes && !minutes2.has(current.getMinutes())) {
      current.setMinutes(current.getMinutes() + 1);
      continue;
    }
    return current;
  }
  throw new Error("Unable to find next cron date");
};
var Equivalence3 = make((self2, that) => restrictionsEquals(self2.minutes, that.minutes) && restrictionsEquals(self2.hours, that.hours) && restrictionsEquals(self2.days, that.days) && restrictionsEquals(self2.months, that.months) && restrictionsEquals(self2.weekdays, that.weekdays));
var restrictionsArrayEquals = array(number2);
var restrictionsEquals = (self2, that) => restrictionsArrayEquals(fromIterable(self2), fromIterable(that));
var equals4 = dual(2, (self2, that) => Equivalence3(self2, that));
var minuteOptions = {
  segment: "minute",
  min: 0,
  max: 59
};
var hourOptions = {
  segment: "hour",
  min: 0,
  max: 23
};
var dayOptions = {
  segment: "day",
  min: 1,
  max: 31
};
var monthOptions = {
  segment: "month",
  min: 1,
  max: 12,
  aliases: {
    jan: 1,
    feb: 2,
    mar: 3,
    apr: 4,
    may: 5,
    jun: 6,
    jul: 7,
    aug: 8,
    sep: 9,
    oct: 10,
    nov: 11,
    dec: 12
  }
};
var weekdayOptions = {
  segment: "weekday",
  min: 0,
  max: 6,
  aliases: {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6
  }
};
var parseSegment = (input, options) => {
  const capacity = options.max - options.min + 1;
  const values3 = new Set;
  const fields = input.split(",");
  for (const field of fields) {
    const [raw, step3] = splitStep(field);
    if (raw === "*" && step3 === undefined) {
      return right2(new Set);
    }
    if (step3 !== undefined) {
      if (!Number.isInteger(step3)) {
        return left2(ParseError(`Expected step value to be a positive integer`, input));
      }
      if (step3 < 1) {
        return left2(ParseError(`Expected step value to be greater than 0`, input));
      }
      if (step3 > options.max) {
        return left2(ParseError(`Expected step value to be less than ${options.max}`, input));
      }
    }
    if (raw === "*") {
      for (let i = options.min;i <= options.max; i += step3 ?? 1) {
        values3.add(i);
      }
    } else {
      const [left3, right3] = splitRange(raw, options.aliases);
      if (!Number.isInteger(left3)) {
        return left2(ParseError(`Expected a positive integer`, input));
      }
      if (left3 < options.min || left3 > options.max) {
        return left2(ParseError(`Expected a value between ${options.min} and ${options.max}`, input));
      }
      if (right3 === undefined) {
        values3.add(left3);
      } else {
        if (!Number.isInteger(right3)) {
          return left2(ParseError(`Expected a positive integer`, input));
        }
        if (right3 < options.min || right3 > options.max) {
          return left2(ParseError(`Expected a value between ${options.min} and ${options.max}`, input));
        }
        if (left3 > right3) {
          return left2(ParseError(`Invalid value range`, input));
        }
        for (let i = left3;i <= right3; i += step3 ?? 1) {
          values3.add(i);
        }
      }
    }
    if (values3.size >= capacity) {
      return right2(new Set);
    }
  }
  return right2(values3);
};
var splitStep = (input) => {
  const seperator = input.indexOf("/");
  if (seperator !== -1) {
    return [input.slice(0, seperator), Number(input.slice(seperator + 1))];
  }
  return [input, undefined];
};
var splitRange = (input, aliases) => {
  const seperator = input.indexOf("-");
  if (seperator !== -1) {
    return [aliasOrValue(input.slice(0, seperator), aliases), aliasOrValue(input.slice(seperator + 1), aliases)];
  }
  return [aliasOrValue(input, aliases), undefined];
};

// node_modules/effect/dist/esm/Random.js
var next3 = next;

// node_modules/effect/dist/esm/internal/schedule.js
var ScheduleSymbolKey = "effect/Schedule";
var ScheduleTypeId = Symbol.for(ScheduleSymbolKey);
var isSchedule = (u) => hasProperty(u, ScheduleTypeId);
var ScheduleDriverSymbolKey = "effect/ScheduleDriver";
var ScheduleDriverTypeId = Symbol.for(ScheduleDriverSymbolKey);
var scheduleVariance = {
  _Out: (_) => _,
  _In: (_) => _,
  _R: (_) => _
};
var scheduleDriverVariance = {
  _Out: (_) => _,
  _In: (_) => _,
  _R: (_) => _
};

class ScheduleImpl {
  initial;
  step;
  [ScheduleTypeId] = scheduleVariance;
  constructor(initial, step3) {
    this.initial = initial;
    this.step = step3;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}

class ScheduleDriverImpl {
  schedule;
  ref;
  [ScheduleDriverTypeId] = scheduleDriverVariance;
  constructor(schedule, ref) {
    this.schedule = schedule;
    this.ref = ref;
  }
  get state() {
    return map9(get11(this.ref), (tuple3) => tuple3[1]);
  }
  get last() {
    return flatMap7(get11(this.ref), ([element, _]) => {
      switch (element._tag) {
        case "None": {
          return failSync(() => new NoSuchElementException);
        }
        case "Some": {
          return succeed(element.value);
        }
      }
    });
  }
  get reset() {
    return set5(this.ref, [none2(), this.schedule.initial]);
  }
  next(input) {
    return pipe(map9(get11(this.ref), (tuple3) => tuple3[1]), flatMap7((state) => pipe(currentTimeMillis2, flatMap7((now) => pipe(suspend(() => this.schedule.step(now, input, state)), flatMap7(([state2, out, decision]) => {
      const setState = set5(this.ref, [some2(out), state2]);
      if (isDone4(decision)) {
        return zipRight(setState, fail2(none2()));
      }
      const millis2 = start2(decision.intervals) - now;
      if (millis2 <= 0) {
        return as(setState, out);
      }
      return pipe(setState, zipRight(sleep3(millis(millis2))), as(out));
    }))))));
  }
}
var makeWithState = (initial, step3) => new ScheduleImpl(initial, step3);
var addDelay = dual(2, (self2, f) => addDelayEffect(self2, (out) => sync(() => f(out))));
var addDelayEffect = dual(2, (self2, f) => modifyDelayEffect(self2, (out, duration) => map9(f(out), (delay2) => sum(duration, decode(delay2)))));
var andThen4 = dual(2, (self2, that) => map10(andThenEither(self2, that), merge));
var andThenEither = dual(2, (self2, that) => makeWithState([self2.initial, that.initial, true], (now, input, state) => state[2] ? flatMap7(self2.step(now, input, state[0]), ([lState, out, decision]) => {
  if (isDone4(decision)) {
    return map9(that.step(now, input, state[1]), ([rState, out2, decision2]) => [[lState, rState, false], right2(out2), decision2]);
  }
  return succeed([[lState, state[1], true], left2(out), decision]);
}) : map9(that.step(now, input, state[1]), ([rState, out, decision]) => [[state[0], rState, false], right2(out), decision])));
var as3 = dual(2, (self2, out) => map10(self2, () => out));
var asVoid2 = (self2) => map10(self2, constVoid);
var bothInOut = dual(2, (self2, that) => makeWithState([self2.initial, that.initial], (now, [in1, in2], state) => zipWith2(self2.step(now, in1, state[0]), that.step(now, in2, state[1]), ([lState, out, lDecision], [rState, out2, rDecision]) => {
  if (isContinue2(lDecision) && isContinue2(rDecision)) {
    const interval = pipe(lDecision.intervals, union7(rDecision.intervals));
    return [[lState, rState], [out, out2], _continue2(interval)];
  }
  return [[lState, rState], [out, out2], done6];
})));
var check = dual(2, (self2, test) => checkEffect(self2, (input, out) => sync(() => test(input, out))));
var checkEffect = dual(2, (self2, test) => makeWithState(self2.initial, (now, input, state) => flatMap7(self2.step(now, input, state), ([state2, out, decision]) => {
  if (isDone4(decision)) {
    return succeed([state2, out, done6]);
  }
  return map9(test(input, out), (cont) => cont ? [state2, out, decision] : [state2, out, done6]);
})));
var collectAllInputs = () => collectAllOutputs(identity2());
var collectAllOutputs = (self2) => reduce11(self2, empty5(), (outs, out) => pipe(outs, append2(out)));
var collectUntil = (f) => collectAllOutputs(recurUntil(f));
var collectUntilEffect = (f) => collectAllOutputs(recurUntilEffect(f));
var collectWhile = (f) => collectAllOutputs(recurWhile(f));
var collectWhileEffect = (f) => collectAllOutputs(recurWhileEffect(f));
var compose = dual(2, (self2, that) => makeWithState([self2.initial, that.initial], (now, input, state) => flatMap7(self2.step(now, input, state[0]), ([lState, out, lDecision]) => map9(that.step(now, out, state[1]), ([rState, out2, rDecision]) => isDone4(lDecision) ? [[lState, rState], out2, done6] : isDone4(rDecision) ? [[lState, rState], out2, done6] : [[lState, rState], out2, _continue2(pipe(lDecision.intervals, max4(rDecision.intervals)))]))));
var mapInput3 = dual(2, (self2, f) => mapInputEffect(self2, (input2) => sync(() => f(input2))));
var mapInputContext2 = dual(2, (self2, f) => makeWithState(self2.initial, (now, input, state) => mapInputContext(self2.step(now, input, state), f)));
var mapInputEffect = dual(2, (self2, f) => makeWithState(self2.initial, (now, input2, state) => flatMap7(f(input2), (input) => self2.step(now, input, state))));
var cron = (expression) => {
  const parsed = isCron(expression) ? right2(expression) : parse(expression);
  return makeWithState([true, [Number.MIN_SAFE_INTEGER, 0, 0]], (now, _, [initial, previous]) => {
    if (now < previous[0]) {
      return succeed([[false, previous], [previous[1], previous[2]], continueWith2(make37(previous[1], previous[2]))]);
    }
    if (isLeft2(parsed)) {
      return die2(parsed.left);
    }
    const cron2 = parsed.right;
    const date = new Date(now);
    let next4;
    if (initial && match10(cron2, date)) {
      next4 = now;
    } else {
      const result = next2(cron2, date);
      next4 = result.getTime();
    }
    const start3 = beginningOfMinute(next4);
    const end3 = endOfMinute(next4);
    const interval = make37(start3, end3);
    return succeed([[false, [next4, start3, end3]], [start3, end3], continueWith2(interval)]);
  });
};
var dayOfMonth = (day) => {
  return makeWithState([Number.NEGATIVE_INFINITY, 0], (now, _, state) => {
    if (!Number.isInteger(day) || day < 1 || 31 < day) {
      return dieSync(() => new IllegalArgumentException(`Invalid argument in: dayOfMonth(${day}). Must be in range 1...31`));
    }
    const n = state[1];
    const initial = n === 0;
    const day0 = nextDayOfMonth(now, day, initial);
    const start3 = beginningOfDay(day0);
    const end3 = endOfDay(day0);
    const interval = make37(start3, end3);
    return succeed([[end3, n + 1], n, continueWith2(interval)]);
  });
};
var dayOfWeek = (day) => {
  return makeWithState([Number.MIN_SAFE_INTEGER, 0], (now, _, state) => {
    if (!Number.isInteger(day) || day < 1 || 7 < day) {
      return dieSync(() => new IllegalArgumentException(`Invalid argument in: dayOfWeek(${day}). Must be in range 1 (Monday)...7 (Sunday)`));
    }
    const n = state[1];
    const initial = n === 0;
    const day0 = nextDay(now, day, initial);
    const start3 = beginningOfDay(day0);
    const end3 = endOfDay(day0);
    const interval = make37(start3, end3);
    return succeed([[end3, n + 1], n, continueWith2(interval)]);
  });
};
var delayed = dual(2, (self2, f) => delayedEffect(self2, (duration) => sync(() => f(duration))));
var delayedEffect = dual(2, (self2, f) => modifyDelayEffect(self2, (_, delay2) => f(delay2)));
var delayedSchedule = (schedule) => addDelay(schedule, (x) => x);
var delays = (self2) => makeWithState(self2.initial, (now, input, state) => pipe(self2.step(now, input, state), flatMap7(([state2, _, decision]) => {
  if (isDone4(decision)) {
    return succeed([state2, zero2, decision]);
  }
  return succeed([state2, millis(start2(decision.intervals) - now), decision]);
})));
var mapBoth2 = dual(2, (self2, {
  onInput,
  onOutput
}) => map10(mapInput3(self2, onInput), onOutput));
var mapBothEffect = dual(2, (self2, {
  onInput,
  onOutput
}) => mapEffect(mapInputEffect(self2, onInput), onOutput));
var driver = (self2) => pipe(make27([none2(), self2.initial]), map9((ref) => new ScheduleDriverImpl(self2, ref)));
var duration = (durationInput) => {
  const duration2 = decode(durationInput);
  const durationMillis = toMillis(duration2);
  return makeWithState(true, (now, _, state) => succeed(state ? [false, duration2, continueWith2(after2(now + durationMillis))] : [false, zero2, done6]));
};
var either3 = dual(2, (self2, that) => union8(self2, that));
var eitherWith = dual(3, (self2, that, f) => unionWith2(self2, that, f));
var ensuring2 = dual(2, (self2, finalizer) => makeWithState(self2.initial, (now, input, state) => flatMap7(self2.step(now, input, state), ([state2, out, decision]) => isDone4(decision) ? as(finalizer, [state2, out, decision]) : succeed([state2, out, decision]))));
var exponential2 = (baseInput, factor = 2) => {
  const base33 = decode(baseInput);
  return delayedSchedule(map10(forever2, (i) => times(base33, Math.pow(factor, i))));
};
var fibonacci = (oneInput) => {
  const one = decode(oneInput);
  return delayedSchedule(pipe(unfold2([one, one], ([a, b]) => [b, sum(a, b)]), map10((out) => out[0])));
};
var fixed = (intervalInput) => {
  const interval = decode(intervalInput);
  const intervalMillis = toMillis(interval);
  return makeWithState([none2(), 0], (now, _, [option2, n]) => sync(() => {
    switch (option2._tag) {
      case "None": {
        return [[some2([now, now + intervalMillis]), n + 1], n, continueWith2(after2(now + intervalMillis))];
      }
      case "Some": {
        const [startMillis, lastRun] = option2.value;
        const runningBehind = now > lastRun + intervalMillis;
        const boundary = equals(interval, zero2) ? interval : millis(intervalMillis - (now - startMillis) % intervalMillis);
        const sleepTime = equals(boundary, zero2) ? interval : boundary;
        const nextRun = runningBehind ? now : now + toMillis(sleepTime);
        return [[some2([startMillis, nextRun]), n + 1], n, continueWith2(after2(nextRun))];
      }
    }
  }));
};
var fromDelay = (delay2) => duration(delay2);
var fromDelays = (delay2, ...delays2) => makeWithState([[delay2, ...delays2].map((_) => decode(_)), true], (now, _, [durations, cont]) => sync(() => {
  if (cont) {
    const x = durations[0];
    const interval = after2(now + toMillis(x));
    if (durations.length >= 2) {
      return [[durations.slice(1), true], x, continueWith2(interval)];
    }
    const y = durations.slice(1);
    return [[[x, ...y], false], x, continueWith2(interval)];
  }
  return [[durations, false], zero2, done6];
}));
var fromFunction = (f) => map10(identity2(), f);
var hourOfDay = (hour) => makeWithState([Number.NEGATIVE_INFINITY, 0], (now, _, state) => {
  if (!Number.isInteger(hour) || hour < 0 || 23 < hour) {
    return dieSync(() => new IllegalArgumentException(`Invalid argument in: hourOfDay(${hour}). Must be in range 0...23`));
  }
  const n = state[1];
  const initial = n === 0;
  const hour0 = nextHour(now, hour, initial);
  const start3 = beginningOfHour(hour0);
  const end3 = endOfHour(hour0);
  const interval = make37(start3, end3);
  return succeed([[end3, n + 1], n, continueWith2(interval)]);
});
var identity2 = () => makeWithState(undefined, (now, input, state) => succeed([state, input, continueWith2(after2(now))]));
var intersect5 = dual(2, (self2, that) => intersectWith(self2, that, intersect4));
var intersectWith = dual(3, (self2, that, f) => makeWithState([self2.initial, that.initial], (now, input, state) => pipe(zipWith2(self2.step(now, input, state[0]), that.step(now, input, state[1]), (a, b) => [a, b]), flatMap7(([[lState, out, lDecision], [rState, out2, rDecision]]) => {
  if (isContinue2(lDecision) && isContinue2(rDecision)) {
    return intersectWithLoop(self2, that, input, lState, out, lDecision.intervals, rState, out2, rDecision.intervals, f);
  }
  return succeed([[lState, rState], [out, out2], done6]);
}))));
var intersectWithLoop = (self2, that, input, lState, out, lInterval, rState, out2, rInterval, f) => {
  const combined = f(lInterval, rInterval);
  if (isNonEmpty4(combined)) {
    return succeed([[lState, rState], [out, out2], _continue2(combined)]);
  }
  if (pipe(lInterval, lessThan6(rInterval))) {
    return flatMap7(self2.step(end2(lInterval), input, lState), ([lState2, out3, decision]) => {
      if (isDone4(decision)) {
        return succeed([[lState2, rState], [out3, out2], done6]);
      }
      return intersectWithLoop(self2, that, input, lState2, out3, decision.intervals, rState, out2, rInterval, f);
    });
  }
  return flatMap7(that.step(end2(rInterval), input, rState), ([rState2, out22, decision]) => {
    if (isDone4(decision)) {
      return succeed([[lState, rState2], [out, out22], done6]);
    }
    return intersectWithLoop(self2, that, input, lState, out, lInterval, rState2, out22, decision.intervals, f);
  });
};
var jittered = (self2) => jitteredWith(self2, {
  min: 0.8,
  max: 1.2
});
var jitteredWith = dual(2, (self2, options) => {
  const {
    max: max5,
    min: min3
  } = Object.assign({
    min: 0.8,
    max: 1.2
  }, options);
  return delayedEffect(self2, (duration2) => map9(next3, (random4) => {
    const d = toMillis(duration2);
    const jittered2 = d * min3 * (1 - random4) + d * max5 * random4;
    return millis(jittered2);
  }));
});
var linear = (baseInput) => {
  const base33 = decode(baseInput);
  return delayedSchedule(map10(forever2, (i) => times(base33, i + 1)));
};
var map10 = dual(2, (self2, f) => mapEffect(self2, (out) => sync(() => f(out))));
var mapEffect = dual(2, (self2, f) => makeWithState(self2.initial, (now, input, state) => flatMap7(self2.step(now, input, state), ([state2, out, decision]) => map9(f(out), (out2) => [state2, out2, decision]))));
var minuteOfHour = (minute) => makeWithState([Number.MIN_SAFE_INTEGER, 0], (now, _, state) => {
  if (!Number.isInteger(minute) || minute < 0 || 59 < minute) {
    return dieSync(() => new IllegalArgumentException(`Invalid argument in: minuteOfHour(${minute}). Must be in range 0...59`));
  }
  const n = state[1];
  const initial = n === 0;
  const minute0 = nextMinute(now, minute, initial);
  const start3 = beginningOfMinute(minute0);
  const end3 = endOfMinute(minute0);
  const interval = make37(start3, end3);
  return succeed([[end3, n + 1], n, continueWith2(interval)]);
});
var modifyDelay = dual(2, (self2, f) => modifyDelayEffect(self2, (out, duration2) => sync(() => f(out, duration2))));
var modifyDelayEffect = dual(2, (self2, f) => makeWithState(self2.initial, (now, input, state) => flatMap7(self2.step(now, input, state), ([state2, out, decision]) => {
  if (isDone4(decision)) {
    return succeed([state2, out, decision]);
  }
  const intervals = decision.intervals;
  const delay2 = size21(make37(now, start2(intervals)));
  return map9(f(out, delay2), (durationInput) => {
    const duration2 = decode(durationInput);
    const oldStart = start2(intervals);
    const newStart = now + toMillis(duration2);
    const delta = newStart - oldStart;
    const newEnd = Math.max(0, end2(intervals) + delta);
    const newInterval = make37(newStart, newEnd);
    return [state2, out, continueWith2(newInterval)];
  });
})));
var onDecision = dual(2, (self2, f) => makeWithState(self2.initial, (now, input, state) => flatMap7(self2.step(now, input, state), ([state2, out, decision]) => as(f(out, decision), [state2, out, decision]))));
var passthrough = (self2) => makeWithState(self2.initial, (now, input, state) => pipe(self2.step(now, input, state), map9(([state2, _, decision]) => [state2, input, decision])));
var provideContext2 = dual(2, (self2, context3) => makeWithState(self2.initial, (now, input, state) => provideContext(self2.step(now, input, state), context3)));
var provideService2 = dual(3, (self2, tag, service) => makeWithState(self2.initial, (now, input, state) => contextWithEffect((env) => provideContext(self2.step(now, input, state), add2(env, tag, service)))));
var recurUntil = (f) => untilInput(identity2(), f);
var recurUntilEffect = (f) => untilInputEffect(identity2(), f);
var recurUntilOption = (pf) => untilOutput(map10(identity2(), pf), isSome2);
var recurUpTo = (durationInput) => {
  const duration2 = decode(durationInput);
  return whileOutput(elapsed, (elapsed) => lessThan2(elapsed, duration2));
};
var recurWhile = (f) => whileInput(identity2(), f);
var recurWhileEffect = (f) => whileInputEffect(identity2(), f);
var recurs = (n) => whileOutput(forever2, (out) => out < n);
var reduce11 = dual(3, (self2, zero3, f) => reduceEffect2(self2, zero3, (z, out) => sync(() => f(z, out))));
var reduceEffect2 = dual(3, (self2, zero3, f) => makeWithState([self2.initial, zero3], (now, input, [s, z]) => flatMap7(self2.step(now, input, s), ([s2, out, decision]) => isDone4(decision) ? succeed([[s2, z], z, decision]) : map9(f(z, out), (z2) => [[s2, z2], z, decision]))));
var repetitions = (self2) => reduce11(self2, 0, (n, _) => n + 1);
var resetAfter = dual(2, (self2, durationInput) => {
  const duration2 = decode(durationInput);
  return pipe(self2, intersect5(elapsed), resetWhen(([, time]) => greaterThanOrEqualTo2(time, duration2)), map10((out) => out[0]));
});
var resetWhen = dual(2, (self2, f) => makeWithState(self2.initial, (now, input, state) => flatMap7(self2.step(now, input, state), ([state2, out, decision]) => f(out) ? self2.step(now, input, self2.initial) : succeed([state2, out, decision]))));
var run = dual(3, (self2, now, input) => pipe(runLoop(self2, now, fromIterable2(input), self2.initial, empty5()), map9((list) => reverse2(list))));
var runLoop = (self2, now, inputs, state, acc) => {
  if (!isNonEmpty(inputs)) {
    return succeed(acc);
  }
  const input = headNonEmpty2(inputs);
  const nextInputs = tailNonEmpty2(inputs);
  return flatMap7(self2.step(now, input, state), ([state2, out, decision]) => {
    if (isDone4(decision)) {
      return sync(() => pipe(acc, prepend2(out)));
    }
    return runLoop(self2, start2(decision.intervals), nextInputs, state2, prepend2(acc, out));
  });
};
var secondOfMinute = (second) => makeWithState([Number.NEGATIVE_INFINITY, 0], (now, _, state) => {
  if (!Number.isInteger(second) || second < 0 || 59 < second) {
    return dieSync(() => new IllegalArgumentException(`Invalid argument in: secondOfMinute(${second}). Must be in range 0...59`));
  }
  const n = state[1];
  const initial = n === 0;
  const second0 = nextSecond(now, second, initial);
  const start3 = beginningOfSecond(second0);
  const end3 = endOfSecond(second0);
  const interval = make37(start3, end3);
  return succeed([[end3, n + 1], n, continueWith2(interval)]);
});
var spaced = (duration2) => addDelay(forever2, () => duration2);
var succeed3 = (value) => map10(forever2, () => value);
var sync2 = (evaluate) => map10(forever2, evaluate);
var tapInput = dual(2, (self2, f) => makeWithState(self2.initial, (now, input, state) => zipRight(f(input), self2.step(now, input, state))));
var tapOutput = dual(2, (self2, f) => makeWithState(self2.initial, (now, input, state) => tap(self2.step(now, input, state), ([, out]) => f(out))));
var unfold2 = (initial, f) => makeWithState(initial, (now, _, state) => sync(() => [f(state), state, continueWith2(after2(now))]));
var union8 = dual(2, (self2, that) => unionWith2(self2, that, union7));
var unionWith2 = dual(3, (self2, that, f) => makeWithState([self2.initial, that.initial], (now, input, state) => zipWith2(self2.step(now, input, state[0]), that.step(now, input, state[1]), ([lState, l, lDecision], [rState, r, rDecision]) => {
  if (isDone4(lDecision) && isDone4(rDecision)) {
    return [[lState, rState], [l, r], done6];
  }
  if (isDone4(lDecision) && isContinue2(rDecision)) {
    return [[lState, rState], [l, r], _continue2(rDecision.intervals)];
  }
  if (isContinue2(lDecision) && isDone4(rDecision)) {
    return [[lState, rState], [l, r], _continue2(lDecision.intervals)];
  }
  if (isContinue2(lDecision) && isContinue2(rDecision)) {
    const combined = f(lDecision.intervals, rDecision.intervals);
    return [[lState, rState], [l, r], _continue2(combined)];
  }
  throw new Error("BUG: Schedule.unionWith - please report an issue at https://github.com/Effect-TS/effect/issues");
})));
var untilInput = dual(2, (self2, f) => check(self2, (input, _) => !f(input)));
var untilInputEffect = dual(2, (self2, f) => checkEffect(self2, (input, _) => negate(f(input))));
var untilOutput = dual(2, (self2, f) => check(self2, (_, out) => !f(out)));
var untilOutputEffect = dual(2, (self2, f) => checkEffect(self2, (_, out) => negate(f(out))));
var upTo = dual(2, (self2, duration2) => zipLeft2(self2, recurUpTo(duration2)));
var whileInput = dual(2, (self2, f) => check(self2, (input, _) => f(input)));
var whileInputEffect = dual(2, (self2, f) => checkEffect(self2, (input, _) => f(input)));
var whileOutput = dual(2, (self2, f) => check(self2, (_, out) => f(out)));
var whileOutputEffect = dual(2, (self2, f) => checkEffect(self2, (_, out) => f(out)));
var windowed = (intervalInput) => {
  const interval = decode(intervalInput);
  const millis2 = toMillis(interval);
  return makeWithState([none2(), 0], (now, _, [option2, n]) => {
    switch (option2._tag) {
      case "None": {
        return succeed([[some2(now), n + 1], n, continueWith2(after2(now + millis2))]);
      }
      case "Some": {
        return succeed([[some2(option2.value), n + 1], n, continueWith2(after2(now + (millis2 - (now - option2.value) % millis2)))]);
      }
    }
  });
};
var zipLeft2 = dual(2, (self2, that) => map10(intersect5(self2, that), (out) => out[0]));
var zipRight2 = dual(2, (self2, that) => map10(intersect5(self2, that), (out) => out[1]));
var zipWith4 = dual(3, (self2, that, f) => map10(intersect5(self2, that), ([out, out2]) => f(out, out2)));
var beginningOfSecond = (now) => {
  const date = new Date(now);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0).getTime();
};
var endOfSecond = (now) => {
  const date = new Date(beginningOfSecond(now));
  return date.setSeconds(date.getSeconds() + 1);
};
var nextSecond = (now, second, initial) => {
  const date = new Date(now);
  if (date.getSeconds() === second && initial) {
    return now;
  }
  if (date.getSeconds() < second) {
    return date.setSeconds(second);
  }
  const newDate = new Date(date.setSeconds(second));
  return newDate.setTime(newDate.getTime() + 1000 * 60);
};
var beginningOfMinute = (now) => {
  const date = new Date(now);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), 0, 0).getTime();
};
var endOfMinute = (now) => {
  const date = new Date(beginningOfMinute(now));
  return date.setMinutes(date.getMinutes() + 1);
};
var nextMinute = (now, minute, initial) => {
  const date = new Date(now);
  if (date.getMinutes() === minute && initial) {
    return now;
  }
  if (date.getMinutes() < minute) {
    return date.setMinutes(minute);
  }
  const newDate = new Date(date.setMinutes(minute));
  return newDate.setTime(newDate.getTime() + 1000 * 60 * 60);
};
var beginningOfHour = (now) => {
  const date = new Date(now);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0, 0, 0).getTime();
};
var endOfHour = (now) => {
  const date = new Date(beginningOfHour(now));
  return date.setHours(date.getHours() + 1);
};
var nextHour = (now, hour, initial) => {
  const date = new Date(now);
  if (date.getHours() === hour && initial) {
    return now;
  }
  if (date.getHours() < hour) {
    return date.setHours(hour);
  }
  const newDate = new Date(date.setHours(hour));
  return newDate.setTime(newDate.getTime() + 1000 * 60 * 60 * 24);
};
var beginningOfDay = (now) => {
  const date = new Date(now);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0).getTime();
};
var endOfDay = (now) => {
  const date = new Date(beginningOfDay(now));
  return date.setDate(date.getDate() + 1);
};
var nextDay = (now, dayOfWeek2, initial) => {
  const date = new Date(now);
  if (date.getDay() === dayOfWeek2 && initial) {
    return now;
  }
  const nextDayOfWeek = (7 + dayOfWeek2 - date.getDay()) % 7;
  return date.setDate(date.getDate() + (nextDayOfWeek === 0 ? 7 : nextDayOfWeek));
};
var nextDayOfMonth = (now, day, initial) => {
  const date = new Date(now);
  if (date.getDate() === day && initial) {
    return now;
  }
  if (date.getDate() < day) {
    return date.setDate(day);
  }
  return findNextMonth(now, day, 1);
};
var findNextMonth = (now, day, months) => {
  const d = new Date(now);
  const tmp1 = new Date(d.setDate(day));
  const tmp2 = new Date(tmp1.setMonth(tmp1.getMonth() + months));
  if (tmp2.getDate() === day) {
    const d2 = new Date(now);
    const tmp3 = new Date(d2.setDate(day));
    return tmp3.setMonth(tmp3.getMonth() + months);
  }
  return findNextMonth(now, day, months + 1);
};
var ScheduleDefectTypeId = Symbol.for("effect/Schedule/ScheduleDefect");

class ScheduleDefect {
  error;
  [ScheduleDefectTypeId];
  constructor(error) {
    this.error = error;
    this[ScheduleDefectTypeId] = ScheduleDefectTypeId;
  }
}
var isScheduleDefect = (u) => hasProperty(u, ScheduleDefectTypeId);
var scheduleDefectWrap = (self2) => catchAll(self2, (e) => die2(new ScheduleDefect(e)));
var scheduleDefectRefail = (self2) => catchAllCause(self2, (cause2) => match2(find(cause2, (_) => isDieType(_) && isScheduleDefect(_.defect) ? some2(_.defect) : none2()), {
  onNone: () => failCause(cause2),
  onSome: (error) => fail2(error.error)
}));
var repeat_Effect = dual(2, (self2, schedule) => repeatOrElse_Effect(self2, schedule, (e, _) => fail2(e)));
var repeat_combined = dual(2, (self2, options) => {
  if (isSchedule(options)) {
    return repeat_Effect(self2, options);
  }
  const base33 = options.schedule ?? passthrough(forever2);
  const withWhile = options.while ? whileInputEffect(base33, (a) => {
    const applied = options.while(a);
    if (typeof applied === "boolean") {
      return succeed(applied);
    }
    return scheduleDefectWrap(applied);
  }) : base33;
  const withUntil = options.until ? untilInputEffect(withWhile, (a) => {
    const applied = options.until(a);
    if (typeof applied === "boolean") {
      return succeed(applied);
    }
    return scheduleDefectWrap(applied);
  }) : withWhile;
  const withTimes = options.times ? intersect5(withUntil, recurs(options.times)).pipe(map10((intersectionPair) => intersectionPair[0])) : withUntil;
  return scheduleDefectRefail(repeat_Effect(self2, withTimes));
});
var repeatOrElse_Effect = dual(3, (self2, schedule, orElse2) => flatMap7(driver(schedule), (driver2) => matchEffect(self2, {
  onFailure: (error) => orElse2(error, none2()),
  onSuccess: (value) => repeatOrElseEffectLoop(self2, driver2, orElse2, value)
})));
var repeatOrElseEffectLoop = (self2, driver2, orElse2, value) => {
  return matchEffect(driver2.next(value), {
    onFailure: () => orDie(driver2.last),
    onSuccess: (b) => matchEffect(self2, {
      onFailure: (error) => orElse2(error, some2(b)),
      onSuccess: (value2) => repeatOrElseEffectLoop(self2, driver2, orElse2, value2)
    })
  });
};
var retry_Effect = dual(2, (self2, policy) => retryOrElse_Effect(self2, policy, (e, _) => fail2(e)));
var retry_combined = dual(2, (self2, options) => {
  if (isSchedule(options)) {
    return retry_Effect(self2, options);
  }
  const base33 = options.schedule ?? forever2;
  const withWhile = options.while ? whileInputEffect(base33, (e) => {
    const applied = options.while(e);
    if (typeof applied === "boolean") {
      return succeed(applied);
    }
    return scheduleDefectWrap(applied);
  }) : base33;
  const withUntil = options.until ? untilInputEffect(withWhile, (e) => {
    const applied = options.until(e);
    if (typeof applied === "boolean") {
      return succeed(applied);
    }
    return scheduleDefectWrap(applied);
  }) : withWhile;
  const withTimes = options.times ? intersect5(withUntil, recurs(options.times)) : withUntil;
  return scheduleDefectRefail(retry_Effect(self2, withTimes));
});
var retryOrElse_Effect = dual(3, (self2, policy, orElse2) => flatMap7(driver(policy), (driver2) => retryOrElse_EffectLoop(self2, driver2, orElse2)));
var retryOrElse_EffectLoop = (self2, driver2, orElse2) => {
  return catchAll(self2, (e) => matchEffect(driver2.next(e), {
    onFailure: () => pipe(driver2.last, orDie, flatMap7((out) => orElse2(e, out))),
    onSuccess: () => retryOrElse_EffectLoop(self2, driver2, orElse2)
  }));
};
var schedule_Effect = dual(2, (self2, schedule) => scheduleFrom_Effect(self2, undefined, schedule));
var scheduleFrom_Effect = dual(3, (self2, initial, schedule) => flatMap7(driver(schedule), (driver2) => scheduleFrom_EffectLoop(self2, initial, driver2)));
var scheduleFrom_EffectLoop = (self2, initial, driver2) => matchEffect(driver2.next(initial), {
  onFailure: () => orDie(driver2.last),
  onSuccess: () => flatMap7(self2, (a) => scheduleFrom_EffectLoop(self2, a, driver2))
});
var count = unfold2(0, (n) => n + 1);
var elapsed = makeWithState(none2(), (now, _, state) => {
  switch (state._tag) {
    case "None": {
      return succeed([some2(now), zero2, continueWith2(after2(now))]);
    }
    case "Some": {
      return succeed([some2(state.value), millis(now - state.value), continueWith2(after2(now))]);
    }
  }
});
var forever2 = unfold2(0, (n) => n + 1);
var once2 = asVoid2(recurs(1));
var stop = asVoid2(recurs(0));

// node_modules/effect/dist/esm/internal/effect/circular.js
class Semaphore {
  permits;
  waiters = new Set;
  taken = 0;
  constructor(permits) {
    this.permits = permits;
  }
  get free() {
    return this.permits - this.taken;
  }
  take = (n) => async((resume2) => {
    if (this.free < n) {
      const observer = () => {
        if (this.free < n) {
          return;
        }
        this.waiters.delete(observer);
        this.taken += n;
        resume2(succeed(n));
      };
      this.waiters.add(observer);
      return sync(() => {
        this.waiters.delete(observer);
      });
    }
    this.taken += n;
    return resume2(succeed(n));
  });
  updateTaken = (f) => withFiberRuntime((fiber) => {
    this.taken = f(this.taken);
    if (this.waiters.size > 0) {
      fiber.getFiberRef(currentScheduler2).scheduleTask(() => {
        const iter = this.waiters.values();
        let item = iter.next();
        while (item.done === false && this.free > 0) {
          item.value();
          item = iter.next();
        }
      }, fiber.getFiberRef(currentSchedulingPriority));
    }
    return succeed(this.free);
  });
  release = (n) => this.updateTaken((taken) => taken - n);
  releaseAll = this.updateTaken((_) => 0);
  withPermits = (n) => (self2) => uninterruptibleMask((restore) => flatMap7(restore(this.take(n)), (permits) => ensuring(restore(self2), this.release(permits))));
}
var unsafeMakeSemaphore = (permits) => new Semaphore(permits);
var makeSemaphore = (permits) => sync(() => unsafeMakeSemaphore(permits));
var awaitAllChildren = (self2) => ensuringChildren(self2, fiberAwaitAll);
var cached2 = dual(2, (self2, timeToLive) => map9(cachedInvalidateWithTTL(self2, timeToLive), (tuple3) => tuple3[0]));
var cachedInvalidateWithTTL = dual(2, (self2, timeToLive) => {
  const duration2 = decode(timeToLive);
  return flatMap7(context2(), (env) => map9(makeSynchronized(none2()), (cache2) => [provideContext(getCachedValue(self2, duration2, cache2), env), invalidateCache(cache2)]));
});
var computeCachedValue = (self2, timeToLive, start3) => {
  const timeToLiveMillis = toMillis(decode(timeToLive));
  return pipe(deferredMake(), tap((deferred) => intoDeferred(self2, deferred)), map9((deferred) => some2([start3 + timeToLiveMillis, deferred])));
};
var getCachedValue = (self2, timeToLive, cache2) => uninterruptibleMask((restore) => pipe(clockWith3((clock3) => clock3.currentTimeMillis), flatMap7((time) => updateSomeAndGetEffectSynchronized(cache2, (option2) => {
  switch (option2._tag) {
    case "None": {
      return some2(computeCachedValue(self2, timeToLive, time));
    }
    case "Some": {
      const [end3] = option2.value;
      return end3 - time <= 0 ? some2(computeCachedValue(self2, timeToLive, time)) : none2();
    }
  }
})), flatMap7((option2) => isNone2(option2) ? dieMessage("BUG: Effect.cachedInvalidate - please report an issue at https://github.com/Effect-TS/effect/issues") : restore(deferredAwait(option2.value[1])))));
var invalidateCache = (cache2) => set5(cache2, none2());
var ensuringChild = dual(2, (self2, f) => ensuringChildren(self2, (children) => f(fiberAll(children))));
var ensuringChildren = dual(2, (self2, children) => flatMap7(track, (supervisor) => pipe(supervised(self2, supervisor), ensuring(flatMap7(supervisor.value, children)))));
var forkAll = dual((args) => isIterable(args[0]), (effects, options) => options?.discard ? forEachSequentialDiscard(effects, fork) : map9(forEachSequential(effects, fork), fiberAll));
var forkIn = dual(2, (self2, scope2) => uninterruptibleMask((restore) => flatMap7(scope2.fork(sequential2), (child) => pipe(restore(self2), onExit((exit2) => child.close(exit2)), forkDaemon, tap((fiber) => child.addFinalizer(() => fiberIdWith((fiberId3) => equals(fiberId3, fiber.id()) ? void_ : asVoid(interruptFiber(fiber)))))))));
var forkScoped = (self2) => scopeWith((scope2) => forkIn(self2, scope2));
var fromFiber = (fiber) => join2(fiber);
var fromFiberEffect = (fiber) => suspend(() => flatMap7(fiber, join2));
var memoKeySymbol = Symbol.for("effect/Effect/memoizeFunction.key");

class Key {
  a;
  eq;
  [memoKeySymbol] = memoKeySymbol;
  constructor(a, eq) {
    this.a = a;
    this.eq = eq;
  }
  [symbol2](that) {
    if (hasProperty(that, memoKeySymbol)) {
      if (this.eq) {
        return this.eq(this.a, that.a);
      } else {
        return equals(this.a, that.a);
      }
    }
    return false;
  }
  [symbol]() {
    return this.eq ? 0 : cached(this, hash3(this.a));
  }
}
var cachedFunction = (f, eq) => {
  return pipe(sync(() => empty21()), flatMap7(makeSynchronized), map9((ref) => (a) => pipe(ref.modifyEffect((map11) => {
    const result = pipe(map11, get8(new Key(a, eq)));
    if (isNone2(result)) {
      return pipe(deferredMake(), tap((deferred) => pipe(diffFiberRefs(f(a)), intoDeferred(deferred), fork)), map9((deferred) => [deferred, pipe(map11, set4(new Key(a, eq), deferred))]));
    }
    return succeed([result.value, map11]);
  }), flatMap7(deferredAwait), flatMap7(([patch12, b]) => pipe(patchFiberRefs(patch12), as(b))))));
};
var raceFirst = dual(2, (self2, that) => pipe(exit(self2), race(exit(that)), (effect) => flatten4(effect)));
var scheduleForked = dual(2, (self2, schedule) => pipe(self2, schedule_Effect(schedule), forkScoped));
var supervised = dual(2, (self2, supervisor) => {
  const supervise = fiberRefLocallyWith(currentSupervisor, (s) => s.zip(supervisor));
  return supervise(self2);
});
var timeout = dual(2, (self2, duration2) => timeoutFail(self2, {
  onTimeout: () => timeoutExceptionFromDuration(duration2),
  duration: duration2
}));
var timeoutFail = dual(2, (self2, {
  duration: duration2,
  onTimeout
}) => flatten4(timeoutTo(self2, {
  onTimeout: () => failSync(onTimeout),
  onSuccess: succeed,
  duration: duration2
})));
var timeoutFailCause = dual(2, (self2, {
  duration: duration2,
  onTimeout
}) => flatten4(timeoutTo(self2, {
  onTimeout: () => failCauseSync(onTimeout),
  onSuccess: succeed,
  duration: duration2
})));
var timeoutOption = dual(2, (self2, duration2) => timeoutTo(self2, {
  duration: duration2,
  onSuccess: some2,
  onTimeout: none2
}));
var timeoutTo = dual(2, (self2, {
  duration: duration2,
  onSuccess,
  onTimeout
}) => fiberIdWith((parentFiberId) => raceFibersWith(self2, interruptible2(sleep3(duration2)), {
  onSelfWin: (winner, loser) => flatMap7(winner.await, (exit2) => {
    if (exit2._tag === "Success") {
      return flatMap7(winner.inheritAll, () => as(interruptAsFiber(loser, parentFiberId), onSuccess(exit2.value)));
    } else {
      return flatMap7(interruptAsFiber(loser, parentFiberId), () => exitFailCause(exit2.cause));
    }
  }),
  onOtherWin: (winner, loser) => flatMap7(winner.await, (exit2) => {
    if (exit2._tag === "Success") {
      return flatMap7(winner.inheritAll, () => as(interruptAsFiber(loser, parentFiberId), onTimeout()));
    } else {
      return flatMap7(interruptAsFiber(loser, parentFiberId), () => exitFailCause(exit2.cause));
    }
  }),
  otherScope: globalScope
})));
var SynchronizedSymbolKey = "effect/Ref/SynchronizedRef";
var SynchronizedTypeId = Symbol.for(SynchronizedSymbolKey);
var synchronizedVariance = {
  _A: (_) => _
};

class SynchronizedImpl {
  ref;
  withLock;
  [SynchronizedTypeId] = synchronizedVariance;
  [RefTypeId] = refVariance;
  [TypeId13];
  constructor(ref, withLock) {
    this.ref = ref;
    this.withLock = withLock;
    this[TypeId13] = TypeId13;
    this.get = get11(this.ref);
  }
  get;
  modify(f) {
    return this.modifyEffect((a) => succeed(f(a)));
  }
  modifyEffect(f) {
    return this.withLock(pipe(flatMap7(get11(this.ref), f), flatMap7(([b, a]) => as(set5(this.ref, a), b))));
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
var makeSynchronized = (value) => sync(() => unsafeMakeSynchronized(value));
var unsafeMakeSynchronized = (value) => {
  const ref = unsafeMake5(value);
  const sem = unsafeMakeSemaphore(1);
  return new SynchronizedImpl(ref, sem.withPermits(1));
};
var updateSomeAndGetEffectSynchronized = dual(2, (self2, pf) => self2.modifyEffect((value) => {
  const result = pf(value);
  switch (result._tag) {
    case "None": {
      return succeed([value, value]);
    }
    case "Some": {
      return map9(result.value, (a) => [a, a]);
    }
  }
}));

// node_modules/effect/dist/esm/internal/opCodes/layer.js
var OP_FRESH = "Fresh";

// node_modules/effect/dist/esm/Fiber.js
var interruptAs = interruptAsFiber;

// node_modules/effect/dist/esm/internal/runtime.js
var unsafeFork2 = (runtime2) => (self2, options) => {
  const fiberId3 = unsafeMake2();
  const fiberRefUpdates = [[currentContext, [[fiberId3, runtime2.context]]]];
  if (options?.scheduler) {
    fiberRefUpdates.push([currentScheduler2, [[fiberId3, options.scheduler]]]);
  }
  let fiberRefs3 = updateManyAs2(runtime2.fiberRefs, {
    entries: fiberRefUpdates,
    forkAs: fiberId3
  });
  if (options?.updateRefs) {
    fiberRefs3 = options.updateRefs(fiberRefs3, fiberId3);
  }
  const fiberRuntime = new FiberRuntime(fiberId3, fiberRefs3, runtime2.runtimeFlags);
  let effect = self2;
  if (options?.scope) {
    effect = flatMap7(fork2(options.scope, sequential2), (closeableScope) => zipRight(scopeAddFinalizer(closeableScope, fiberIdWith((id3) => equals(id3, fiberRuntime.id()) ? void_ : interruptAsFiber(fiberRuntime, id3))), onExit(self2, (exit2) => close(closeableScope, exit2))));
  }
  const supervisor = fiberRuntime._supervisor;
  if (supervisor !== none8) {
    supervisor.onStart(runtime2.context, effect, none2(), fiberRuntime);
    fiberRuntime.addObserver((exit2) => supervisor.onEnd(exit2, fiberRuntime));
  }
  globalScope.add(runtime2.runtimeFlags, fiberRuntime);
  if (options?.immediate === false) {
    fiberRuntime.resume(effect);
  } else {
    fiberRuntime.start(effect);
  }
  return fiberRuntime;
};
var unsafeRunCallback = (runtime2) => (effect, options = {}) => {
  const fiberRuntime = unsafeFork2(runtime2)(effect, options);
  if (options.onExit) {
    fiberRuntime.addObserver((exit2) => {
      options.onExit(exit2);
    });
  }
  return (id3, cancelOptions) => unsafeRunCallback(runtime2)(pipe(fiberRuntime, interruptAs(id3 ?? none4)), {
    ...cancelOptions,
    onExit: cancelOptions?.onExit ? (exit2) => cancelOptions.onExit(flatten5(exit2)) : undefined
  });
};
var unsafeRunSync = (runtime2) => (effect) => {
  const result = unsafeRunSyncExit(runtime2)(effect);
  if (result._tag === "Failure") {
    throw fiberFailure(result.effect_instruction_i0);
  } else {
    return result.effect_instruction_i0;
  }
};

class AsyncFiberExceptionImpl extends Error {
  fiber;
  _tag = "AsyncFiberException";
  constructor(fiber) {
    super(`Fiber #${fiber.id().id} cannot be resolved synchronously. This is caused by using runSync on an effect that performs async work`);
    this.fiber = fiber;
    this.name = this._tag;
    this.stack = this.message;
  }
}
var asyncFiberException = (fiber) => {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 0;
  const error = new AsyncFiberExceptionImpl(fiber);
  Error.stackTraceLimit = limit;
  return error;
};
var FiberFailureId = Symbol.for("effect/Runtime/FiberFailure");
var FiberFailureCauseId = Symbol.for("effect/Runtime/FiberFailure/Cause");

class FiberFailureImpl extends Error {
  [FiberFailureId];
  [FiberFailureCauseId];
  constructor(cause2) {
    super();
    this[FiberFailureId] = FiberFailureId;
    this[FiberFailureCauseId] = cause2;
    const prettyErrors2 = prettyErrors(cause2);
    if (prettyErrors2.length > 0) {
      const head4 = prettyErrors2[0];
      this.name = head4.name;
      this.message = head4.message;
      this.stack = head4.stack;
    }
    this.name = `(FiberFailure) ${this.name}`;
    if (this.message === undefined || this.message.length === 0) {
      this.message = "An error has occurred";
    }
  }
  toJSON() {
    return {
      _id: "FiberFailure",
      cause: this[FiberFailureCauseId].toJSON()
    };
  }
  toString() {
    return "(FiberFailure) " + (this.stack ?? this.message);
  }
  [NodeInspectSymbol]() {
    return this.toString();
  }
}
var fiberFailure = (cause2) => {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 0;
  const error = new FiberFailureImpl(cause2);
  Error.stackTraceLimit = limit;
  return error;
};
var fastPath = (effect) => {
  const op = effect;
  switch (op._op) {
    case "Failure":
    case "Success": {
      return op;
    }
    case "Left": {
      return exitFail(op.left);
    }
    case "Right": {
      return exitSucceed(op.right);
    }
    case "Some": {
      return exitSucceed(op.value);
    }
    case "None": {
      return exitFail(NoSuchElementException());
    }
  }
};
var unsafeRunSyncExit = (runtime2) => (effect) => {
  const op = fastPath(effect);
  if (op) {
    return op;
  }
  const scheduler = new SyncScheduler;
  const fiberRuntime = unsafeFork2(runtime2)(effect, {
    scheduler
  });
  scheduler.flush();
  const result = fiberRuntime.unsafePoll();
  if (result) {
    return result;
  }
  throw asyncFiberException(fiberRuntime);
};
var unsafeRunPromise = (runtime2) => (effect, options) => unsafeRunPromiseExit(runtime2)(effect, options).then((result) => {
  switch (result._tag) {
    case OP_SUCCESS: {
      return result.effect_instruction_i0;
    }
    case OP_FAILURE: {
      throw fiberFailure(result.effect_instruction_i0);
    }
  }
});
var unsafeRunPromiseExit = (runtime2) => (effect, options) => new Promise((resolve) => {
  const op = fastPath(effect);
  if (op) {
    resolve(op);
  }
  const fiber = unsafeFork2(runtime2)(effect);
  fiber.addObserver((exit2) => {
    resolve(exit2);
  });
  if (options?.signal !== undefined) {
    if (options.signal.aborted) {
      fiber.unsafeInterruptAsFork(fiber.id());
    } else {
      options.signal.addEventListener("abort", () => {
        fiber.unsafeInterruptAsFork(fiber.id());
      }, {
        once: true
      });
    }
  }
});

class RuntimeImpl {
  context;
  runtimeFlags;
  fiberRefs;
  constructor(context3, runtimeFlags3, fiberRefs3) {
    this.context = context3;
    this.runtimeFlags = runtimeFlags3;
    this.fiberRefs = fiberRefs3;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
var make41 = (options) => new RuntimeImpl(options.context, options.runtimeFlags, options.fiberRefs);
var runtime2 = () => withFiberRuntime((state, status2) => succeed(new RuntimeImpl(state.getFiberRef(currentContext), status2.runtimeFlags, state.getFiberRefs())));
var defaultRuntimeFlags = make17(Interruption, CooperativeYielding, RuntimeMetrics);
var defaultRuntime = make41({
  context: empty4(),
  runtimeFlags: defaultRuntimeFlags,
  fiberRefs: empty25()
});
var unsafeRunEffect = unsafeRunCallback(defaultRuntime);
var unsafeForkEffect = unsafeFork2(defaultRuntime);
var unsafeRunPromiseEffect = unsafeRunPromise(defaultRuntime);
var unsafeRunPromiseExitEffect = unsafeRunPromiseExit(defaultRuntime);
var unsafeRunSyncEffect = unsafeRunSync(defaultRuntime);
var unsafeRunSyncExitEffect = unsafeRunSyncExit(defaultRuntime);
var asyncEffect = (register) => suspend(() => {
  let cleanup = undefined;
  return flatMap7(deferredMake(), (deferred) => flatMap7(runtime2(), (runtime3) => uninterruptibleMask((restore) => zipRight(fork(restore(matchCauseEffect(register((cb) => unsafeRunCallback(runtime3)(intoDeferred(cb, deferred))), {
    onFailure: (cause2) => deferredFailCause(deferred, cause2),
    onSuccess: (cleanup_) => {
      cleanup = cleanup_;
      return void_;
    }
  }))), restore(onInterrupt(deferredAwait(deferred), () => cleanup ?? void_))))));
});

// node_modules/effect/dist/esm/internal/synchronizedRef.js
var modifyEffect = dual(2, (self2, f) => self2.modifyEffect(f));

// node_modules/effect/dist/esm/internal/layer.js
var LayerSymbolKey = "effect/Layer";
var LayerTypeId = Symbol.for(LayerSymbolKey);
var layerVariance = {
  _RIn: (_) => _,
  _E: (_) => _,
  _ROut: (_) => _
};
var proto3 = {
  [LayerTypeId]: layerVariance,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var MemoMapTypeIdKey = "effect/Layer/MemoMap";
var MemoMapTypeId = Symbol.for(MemoMapTypeIdKey);
var isLayer = (u) => hasProperty(u, LayerTypeId);
var isFresh = (self2) => {
  return self2._tag === OP_FRESH;
};

class MemoMapImpl {
  ref;
  [MemoMapTypeId];
  constructor(ref) {
    this.ref = ref;
    this[MemoMapTypeId] = MemoMapTypeId;
  }
  getOrElseMemoize(layer, scope2) {
    return pipe(modifyEffect(this.ref, (map12) => {
      const inMap = map12.get(layer);
      if (inMap !== undefined) {
        const [acquire, release] = inMap;
        const cached3 = pipe(acquire, flatMap7(([patch12, b]) => pipe(patchFiberRefs(patch12), as(b))), onExit(exitMatch({
          onFailure: () => void_,
          onSuccess: () => scopeAddFinalizerExit(scope2, release)
        })));
        return succeed([cached3, map12]);
      }
      return pipe(make27(0), flatMap7((observers) => pipe(deferredMake(), flatMap7((deferred) => pipe(make27(() => void_), map9((finalizerRef) => {
        const resource = uninterruptibleMask((restore) => pipe(scopeMake(), flatMap7((innerScope) => pipe(restore(flatMap7(makeBuilder(layer, innerScope, true), (f) => diffFiberRefs(f(this)))), exit, flatMap7((exit2) => {
          switch (exit2._tag) {
            case OP_FAILURE: {
              return pipe(deferredFailCause(deferred, exit2.effect_instruction_i0), zipRight(scopeClose(innerScope, exit2)), zipRight(failCause(exit2.effect_instruction_i0)));
            }
            case OP_SUCCESS: {
              return pipe(set5(finalizerRef, (exit3) => pipe(scopeClose(innerScope, exit3), whenEffect(modify2(observers, (n) => [n === 1, n - 1])), asVoid)), zipRight(update2(observers, (n) => n + 1)), zipRight(scopeAddFinalizerExit(scope2, (exit3) => pipe(sync(() => map12.delete(layer)), zipRight(get11(finalizerRef)), flatMap7((finalizer) => finalizer(exit3))))), zipRight(deferredSucceed(deferred, exit2.effect_instruction_i0)), as(exit2.effect_instruction_i0[1]));
            }
          }
        })))));
        const memoized = [pipe(deferredAwait(deferred), onExit(exitMatchEffect({
          onFailure: () => void_,
          onSuccess: () => update2(observers, (n) => n + 1)
        }))), (exit2) => pipe(get11(finalizerRef), flatMap7((finalizer) => finalizer(exit2)))];
        return [resource, isFresh(layer) ? map12 : map12.set(layer, memoized)];
      }))))));
    }), flatten4);
  }
}
var makeMemoMap = suspend(() => map9(makeSynchronized(new Map), (ref) => new MemoMapImpl(ref)));
var buildWithScope = dual(2, (self2, scope2) => flatMap7(makeMemoMap, (memoMap) => flatMap7(makeBuilder(self2, scope2), (run2) => run2(memoMap))));
var makeBuilder = (self2, scope2, inMemoMap = false) => {
  const op = self2;
  switch (op._tag) {
    case "Locally": {
      return sync(() => (memoMap) => op.f(memoMap.getOrElseMemoize(op.self, scope2)));
    }
    case "ExtendScope": {
      return sync(() => (memoMap) => scopeWith((scope3) => memoMap.getOrElseMemoize(op.layer, scope3)));
    }
    case "Fold": {
      return sync(() => (memoMap) => pipe(memoMap.getOrElseMemoize(op.layer, scope2), matchCauseEffect({
        onFailure: (cause2) => memoMap.getOrElseMemoize(op.failureK(cause2), scope2),
        onSuccess: (value) => memoMap.getOrElseMemoize(op.successK(value), scope2)
      })));
    }
    case "Fresh": {
      return sync(() => (_) => pipe(op.layer, buildWithScope(scope2)));
    }
    case "FromEffect": {
      return inMemoMap ? sync(() => (_) => op.effect) : sync(() => (memoMap) => memoMap.getOrElseMemoize(self2, scope2));
    }
    case "Provide": {
      return sync(() => (memoMap) => pipe(memoMap.getOrElseMemoize(op.first, scope2), flatMap7((env) => pipe(memoMap.getOrElseMemoize(op.second, scope2), provideContext(env)))));
    }
    case "Scoped": {
      return inMemoMap ? sync(() => (_) => scopeExtend(op.effect, scope2)) : sync(() => (memoMap) => memoMap.getOrElseMemoize(self2, scope2));
    }
    case "Suspend": {
      return sync(() => (memoMap) => memoMap.getOrElseMemoize(op.evaluate(), scope2));
    }
    case "ProvideMerge": {
      return sync(() => (memoMap) => pipe(memoMap.getOrElseMemoize(op.first, scope2), zipWith2(memoMap.getOrElseMemoize(op.second, scope2), op.zipK)));
    }
    case "ZipWith": {
      return sync(() => (memoMap) => pipe(memoMap.getOrElseMemoize(op.first, scope2), zipWithOptions(memoMap.getOrElseMemoize(op.second, scope2), op.zipK, {
        concurrent: true
      })));
    }
  }
};
var provideSomeLayer = dual(2, (self2, layer) => acquireUseRelease(scopeMake(), (scope2) => flatMap7(buildWithScope(layer, scope2), (context3) => provideSomeContext(self2, context3)), (scope2, exit2) => scopeClose(scope2, exit2)));
var provideSomeRuntime = dual(2, (self2, rt) => {
  const patchRefs = diff9(defaultRuntime.fiberRefs, rt.fiberRefs);
  const patchFlags = diff7(defaultRuntime.runtimeFlags, rt.runtimeFlags);
  return uninterruptibleMask((restore) => withFiberRuntime((fiber) => {
    const oldContext = fiber.getFiberRef(currentContext);
    const oldRefs = fiber.getFiberRefs();
    const newRefs = patch10(fiber.id(), oldRefs)(patchRefs);
    const oldFlags = fiber._runtimeFlags;
    const newFlags = patch7(patchFlags)(oldFlags);
    const rollbackRefs = diff9(newRefs, oldRefs);
    const rollbackFlags = diff7(newFlags, oldFlags);
    fiber.setFiberRefs(newRefs);
    fiber._runtimeFlags = newFlags;
    return ensuring(provideSomeContext(restore(self2), merge3(oldContext, rt.context)), withFiberRuntime((fiber2) => {
      fiber2.setFiberRefs(patch10(fiber2.id(), fiber2.getFiberRefs())(rollbackRefs));
      fiber2._runtimeFlags = patch7(rollbackFlags)(fiber2._runtimeFlags);
      return void_;
    }));
  }));
});
var effect_provide = dual(2, (self2, source) => isLayer(source) ? provideSomeLayer(self2, source) : isContext2(source) ? provideSomeContext(self2, source) : provideSomeRuntime(self2, source));

// node_modules/effect/dist/esm/internal/console.js
var console4 = map9(fiberRefGet(currentServices), get3(consoleTag));
var consoleWith = (f) => fiberRefGetWith(currentServices, (services) => f(get3(services, consoleTag)));
var withConsole = dual(2, (effect, value) => fiberRefLocallyWith(effect, currentServices, add2(consoleTag, value)));
var withConsoleScoped = (console5) => fiberRefLocallyScopedWith(currentServices, add2(consoleTag, console5));

// node_modules/effect/dist/esm/internal/query.js
var currentCache = globalValue(Symbol.for("effect/FiberRef/currentCache"), () => fiberRefUnsafeMake(unsafeMakeWith(65536, () => map9(deferredMake(), (handle) => ({
  listeners: new Listeners,
  handle
})), () => seconds(60))));
var currentCacheEnabled = globalValue(Symbol.for("effect/FiberRef/currentCacheEnabled"), () => fiberRefUnsafeMake(false));
var fromRequest = (request8, dataSource) => flatMap7(isEffect(dataSource) ? dataSource : succeed(dataSource), (ds) => fiberIdWith((id3) => {
  const proxy = new Proxy(request8, {});
  return fiberRefGetWith(currentCacheEnabled, (cacheEnabled) => {
    if (cacheEnabled) {
      const cached3 = fiberRefGetWith(currentCache, (cache3) => flatMap7(cache3.getEither(proxy), (orNew) => {
        switch (orNew._tag) {
          case "Left": {
            if (orNew.left.listeners.interrupted) {
              return flatMap7(cache3.invalidateWhen(proxy, (entry) => entry.handle === orNew.left.handle), () => cached3);
            }
            orNew.left.listeners.increment();
            return uninterruptibleMask((restore) => flatMap7(exit(blocked(empty19, restore(deferredAwait(orNew.left.handle)))), (exit2) => {
              orNew.left.listeners.decrement();
              return exit2;
            }));
          }
          case "Right": {
            orNew.right.listeners.increment();
            return uninterruptibleMask((restore) => flatMap7(exit(blocked(single(ds, makeEntry({
              request: proxy,
              result: orNew.right.handle,
              listeners: orNew.right.listeners,
              ownerId: id3,
              state: {
                completed: false
              }
            })), restore(deferredAwait(orNew.right.handle)))), () => {
              orNew.right.listeners.decrement();
              return deferredAwait(orNew.right.handle);
            }));
          }
        }
      }));
      return cached3;
    }
    const listeners = new Listeners;
    listeners.increment();
    return flatMap7(deferredMake(), (ref) => ensuring(blocked(single(ds, makeEntry({
      request: proxy,
      result: ref,
      listeners,
      ownerId: id3,
      state: {
        completed: false
      }
    })), deferredAwait(ref)), sync(() => listeners.decrement())));
  });
}));
var cacheRequest = (request8, result) => {
  return fiberRefGetWith(currentCacheEnabled, (cacheEnabled) => {
    if (cacheEnabled) {
      return fiberRefGetWith(currentCache, (cache3) => flatMap7(cache3.getEither(request8), (orNew) => {
        switch (orNew._tag) {
          case "Left": {
            return void_;
          }
          case "Right": {
            return deferredComplete(orNew.right.handle, result);
          }
        }
      }));
    }
    return void_;
  });
};
var withRequestCaching = dual(2, (self2, strategy) => fiberRefLocally(self2, currentCacheEnabled, strategy));
var withRequestCache = dual(2, (self2, cache3) => fiberRefLocally(self2, currentCache, cache3));

// node_modules/effect/dist/esm/Request.js
var isRequest2 = isRequest;

// node_modules/effect/dist/esm/Effect.js
var EffectTypeId4 = EffectTypeId2;
var isEffect2 = isEffect;
var cachedWithTTL = cached2;
var cachedInvalidateWithTTL2 = cachedInvalidateWithTTL;
var cached3 = memoize;
var cachedFunction2 = cachedFunction;
var once3 = once;
var all4 = all3;
var allWith2 = allWith;
var allSuccesses2 = allSuccesses;
var dropUntil2 = dropUntil;
var dropWhile2 = dropWhile;
var every5 = every4;
var exists3 = exists2;
var filter7 = filter4;
var filterMap4 = filterMap3;
var findFirst6 = findFirst4;
var firstSuccessOf2 = firstSuccessOf;
var forEach8 = forEach7;
var head4 = head3;
var mergeAll2 = mergeAll;
var partition4 = partition3;
var reduce12 = reduce9;
var reduceEffect3 = reduceEffect;
var reduceRight3 = reduceRight2;
var reduceWhile2 = reduceWhile;
var replicate2 = replicate;
var replicateEffect2 = replicateEffect;
var takeUntil2 = takeUntil;
var takeWhile2 = takeWhile;
var validateAll2 = validateAll;
var validateFirst2 = validateFirst;
var async2 = async;
var asyncEffect2 = asyncEffect;
var custom2 = custom;
var withFiberRuntime2 = withFiberRuntime;
var fail7 = fail2;
var failSync2 = failSync;
var failCause5 = failCause;
var failCauseSync2 = failCauseSync;
var die5 = die2;
var dieMessage2 = dieMessage;
var dieSync2 = dieSync;
var gen3 = gen2;
var never3 = never;
var none9 = none6;
var promise2 = promise;
var succeed6 = succeed;
var succeedNone2 = succeedNone;
var succeedSome2 = succeedSome;
var suspend2 = suspend;
var sync3 = sync;
var _void = void_;
var yieldNow3 = yieldNow;
var _catch2 = _catch;
var catchAll2 = catchAll;
var catchAllCause2 = catchAllCause;
var catchAllDefect2 = catchAllDefect;
var catchIf2 = catchIf;
var catchSome2 = catchSome;
var catchSomeCause2 = catchSomeCause;
var catchSomeDefect2 = catchSomeDefect;
var catchTag2 = catchTag;
var catchTags2 = catchTags;
var cause2 = cause;
var eventually2 = eventually;
var ignore2 = ignore;
var ignoreLogged2 = ignoreLogged;
var parallelErrors2 = parallelErrors;
var sandbox2 = sandbox;
var retry = retry_combined;
var retryOrElse = retryOrElse_Effect;
var try_2 = try_;
var tryMap2 = tryMap;
var tryMapPromise2 = tryMapPromise;
var tryPromise2 = tryPromise;
var unsandbox2 = unsandbox;
var allowInterrupt2 = allowInterrupt;
var checkInterruptible2 = checkInterruptible;
var disconnect2 = disconnect;
var interrupt6 = interrupt2;
var interruptWith2 = interruptWith;
var interruptible3 = interruptible2;
var interruptibleMask2 = interruptibleMask;
var onInterrupt2 = onInterrupt;
var uninterruptible2 = uninterruptible;
var uninterruptibleMask2 = uninterruptibleMask;
var liftPredicate2 = liftPredicate;
var as4 = as;
var asSome2 = asSome;
var asSomeError2 = asSomeError;
var asVoid3 = asVoid;
var flip2 = flip;
var flipWith2 = flipWith;
var map12 = map9;
var mapAccum3 = mapAccum2;
var mapBoth3 = mapBoth;
var mapError2 = mapError;
var mapErrorCause2 = mapErrorCause;
var merge6 = merge5;
var negate2 = negate;
var acquireRelease2 = acquireRelease;
var acquireReleaseInterruptible2 = acquireReleaseInterruptible;
var acquireUseRelease2 = acquireUseRelease;
var addFinalizer2 = addFinalizer;
var ensuring3 = ensuring;
var onError2 = onError;
var onExit2 = onExit;
var parallelFinalizers2 = parallelFinalizers;
var finalizersMask2 = finalizersMask;
var sequentialFinalizers2 = sequentialFinalizers;
var scope2 = scope;
var scopeWith2 = scopeWith;
var scoped = scopedEffect;
var using2 = using;
var withEarlyRelease2 = withEarlyRelease;
var awaitAllChildren2 = awaitAllChildren;
var daemonChildren2 = daemonChildren;
var descriptor2 = descriptor;
var descriptorWith2 = descriptorWith;
var diffFiberRefs2 = diffFiberRefs;
var ensuringChild2 = ensuringChild;
var ensuringChildren2 = ensuringChildren;
var fiberId3 = fiberId;
var fiberIdWith2 = fiberIdWith;
var fork3 = fork;
var forkDaemon2 = forkDaemon;
var forkAll2 = forkAll;
var forkIn2 = forkIn;
var forkScoped2 = forkScoped;
var forkWithErrorHandler2 = forkWithErrorHandler;
var fromFiber2 = fromFiber;
var fromFiberEffect2 = fromFiberEffect;
var supervised2 = supervised;
var transplant2 = transplant;
var withConcurrency2 = withConcurrency;
var withScheduler2 = withScheduler;
var withSchedulingPriority2 = withSchedulingPriority;
var withMaxOpsBeforeYield2 = withMaxOpsBeforeYield;
var clock3 = clock2;
var clockWith4 = clockWith3;
var withClockScoped2 = withClockScoped;
var withClock2 = withClock;
var console5 = console4;
var consoleWith2 = consoleWith;
var withConsoleScoped2 = withConsoleScoped;
var withConsole2 = withConsole;
var delay2 = delay;
var sleep4 = sleep3;
var timed2 = timed;
var timedWith2 = timedWith;
var timeout2 = timeout;
var timeoutOption2 = timeoutOption;
var timeoutFail2 = timeoutFail;
var timeoutFailCause2 = timeoutFailCause;
var timeoutTo2 = timeoutTo;
var configProviderWith2 = configProviderWith;
var withConfigProvider2 = withConfigProvider;
var withConfigProviderScoped2 = withConfigProviderScoped;
var context4 = context2;
var contextWith2 = contextWith;
var contextWithEffect2 = contextWithEffect;
var mapInputContext3 = mapInputContext;
var provide = effect_provide;
var provideService3 = provideService;
var provideServiceEffect2 = provideServiceEffect;
var serviceFunction2 = serviceFunction;
var serviceFunctionEffect2 = serviceFunctionEffect;
var serviceFunctions2 = serviceFunctions;
var serviceConstants2 = serviceConstants;
var serviceMembers2 = serviceMembers;
var serviceOption2 = serviceOption;
var serviceOptional2 = serviceOptional;
var updateService2 = updateService;
var Do2 = Do;
var bind3 = bind2;
var bindTo3 = bindTo2;
var let_3 = let_2;
var either4 = either2;
var exit2 = exit;
var intoDeferred2 = intoDeferred;
var option2 = option;
var if_2 = if_;
var filterOrDie2 = filterOrDie;
var filterOrDieMessage2 = filterOrDieMessage;
var filterOrElse2 = filterOrElse;
var filterOrFail2 = filterOrFail;
var unless2 = unless;
var unlessEffect2 = unlessEffect;
var when2 = when;
var whenEffect2 = whenEffect;
var whenFiberRef2 = whenFiberRef;
var whenRef2 = whenRef;
var flatMap8 = flatMap7;
var andThen5 = andThen2;
var flatten6 = flatten4;
var raceAll2 = raceAll;
var race2 = race;
var raceFirst2 = raceFirst;
var raceWith2 = raceWith;
var summarized2 = summarized;
var tap2 = tap;
var tapBoth2 = tapBoth;
var tapDefect2 = tapDefect;
var tapError2 = tapError;
var tapErrorTag2 = tapErrorTag;
var tapErrorCause2 = tapErrorCause;
var forever3 = forever;
var iterate2 = iterate;
var loop2 = loop;
var repeat = repeat_combined;
var repeatN2 = repeatN;
var repeatOrElse = repeatOrElse_Effect;
var schedule = schedule_Effect;
var scheduleForked2 = scheduleForked;
var scheduleFrom = scheduleFrom_Effect;
var whileLoop2 = whileLoop;
var getFiberRefs = fiberRefs2;
var inheritFiberRefs2 = inheritFiberRefs;
var locally = fiberRefLocally;
var locallyWith = fiberRefLocallyWith;
var locallyScoped = fiberRefLocallyScoped;
var locallyScopedWith = fiberRefLocallyScopedWith;
var patchFiberRefs2 = patchFiberRefs;
var setFiberRefs2 = setFiberRefs;
var updateFiberRefs2 = updateFiberRefs;
var isFailure3 = isFailure;
var isSuccess3 = isSuccess;
var match12 = match6;
var matchCause2 = matchCause;
var matchCauseEffect2 = matchCauseEffect;
var matchEffect2 = matchEffect;
var log9 = log8;
var logWithLevel2 = (level, ...message) => logWithLevel(level)(...message);
var logTrace2 = logTrace;
var logDebug2 = logDebug;
var logInfo2 = logInfo;
var logWarning2 = logWarning;
var logError2 = logError;
var logFatal2 = logFatal;
var withLogSpan2 = withLogSpan;
var annotateLogs2 = annotateLogs;
var annotateLogsScoped2 = annotateLogsScoped;
var logAnnotations2 = logAnnotations;
var withUnhandledErrorLogLevel2 = withUnhandledErrorLogLevel;
var orDie2 = orDie;
var orDieWith2 = orDieWith;
var orElse3 = orElse;
var orElseFail2 = orElseFail;
var orElseSucceed2 = orElseSucceed;
var random4 = random2;
var randomWith2 = randomWith;
var withRandom2 = withRandom;
var withRandomScoped2 = withRandomScoped;
var runtime3 = runtime2;
var getRuntimeFlags = runtimeFlags;
var patchRuntimeFlags = updateRuntimeFlags;
var withRuntimeFlagsPatch = withRuntimeFlags;
var withRuntimeFlagsPatchScoped = withRuntimeFlagsScoped;
var tagMetrics2 = tagMetrics;
var labelMetrics2 = labelMetrics;
var tagMetricsScoped2 = tagMetricsScoped;
var labelMetricsScoped2 = labelMetricsScoped;
var metricLabels2 = metricLabels;
var withMetric2 = withMetric;
var unsafeMakeSemaphore2 = unsafeMakeSemaphore;
var makeSemaphore2 = makeSemaphore;
var runFork = unsafeForkEffect;
var runCallback = unsafeRunEffect;
var runPromise = unsafeRunPromiseEffect;
var runPromiseExit = unsafeRunPromiseExitEffect;
var runSync = unsafeRunSyncEffect;
var runSyncExit = unsafeRunSyncExitEffect;
var validate2 = validate;
var validateWith2 = validateWith;
var zip4 = zipOptions;
var zipLeft3 = zipLeftOptions;
var zipRight3 = zipRightOptions;
var zipWith6 = zipWithOptions;
var ap = dual(2, (self2, that) => zipWith6(self2, that, (f, a) => f(a)));
var blocked2 = blocked;
var runRequestBlock2 = runRequestBlock;
var step3 = step2;
var request8 = dual((args) => isRequest2(args[0]), fromRequest);
var cacheRequestResult = cacheRequest;
var withRequestBatching2 = withRequestBatching;
var withRequestCaching2 = withRequestCaching;
var withRequestCache2 = withRequestCache;
var tracer2 = tracer;
var tracerWith4 = tracerWith;
var withTracer2 = withTracer;
var withTracerScoped2 = withTracerScoped;
var withTracerEnabled2 = withTracerEnabled;
var withTracerTiming2 = withTracerTiming;
var annotateSpans2 = annotateSpans;
var annotateCurrentSpan2 = annotateCurrentSpan;
var currentSpan2 = currentSpan;
var currentParentSpan2 = currentParentSpan;
var spanAnnotations2 = spanAnnotations;
var spanLinks2 = spanLinks;
var linkSpans2 = linkSpans;
var makeSpan2 = makeSpan;
var makeSpanScoped2 = makeSpanScoped;
var useSpan2 = useSpan;
var withSpan2 = withSpan;
var functionWithSpan2 = functionWithSpan;
var withSpanScoped2 = withSpanScoped;
var withParentSpan2 = withParentSpan;
var fromNullable3 = fromNullable2;
var optionFromOptional2 = optionFromOptional;
var Tag2 = (id3) => () => {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const creationError = new Error;
  Error.stackTraceLimit = limit;
  function TagClass() {
  }
  Object.setPrototypeOf(TagClass, TagProto);
  TagClass.key = id3;
  Object.defineProperty(TagClass, "stack", {
    get() {
      return creationError.stack;
    }
  });
  const cache3 = new Map;
  const done8 = new Proxy(TagClass, {
    get(_target, prop, _receiver) {
      if (prop === "use") {
        return (body) => andThen2(TagClass, body);
      }
      if (prop in TagClass) {
        return TagClass[prop];
      }
      if (cache3.has(prop)) {
        return cache3.get(prop);
      }
      const fn = (...args) => andThen2(TagClass, (s) => {
        if (typeof s[prop] === "function") {
          cache3.set(prop, (...args2) => andThen2(TagClass, (s2) => s2[prop](...args2)));
          return s[prop](...args);
        }
        cache3.set(prop, andThen2(TagClass, (s2) => s2[prop]));
        return s[prop];
      });
      const cn = andThen2(TagClass, (s) => s[prop]);
      Object.assign(fn, cn);
      Object.setPrototypeOf(fn, Object.getPrototypeOf(cn));
      cache3.set(prop, fn);
      return fn;
    }
  });
  return done8;
};

// node_modules/effect/dist/esm/FiberRef.js
var currentContext3 = currentContext;
var currentSchedulingPriority2 = currentSchedulingPriority;
var currentScheduler3 = currentScheduler2;

// node_modules/effect/dist/esm/internal/pubsub.js
var AbsentValue = Symbol.for("effect/PubSub/AbsentValue");
class UnboundedPubSub {
  replayBuffer;
  publisherHead = {
    value: AbsentValue,
    subscribers: 0,
    next: null
  };
  publisherTail = this.publisherHead;
  publisherIndex = 0;
  subscribersIndex = 0;
  capacity = Number.MAX_SAFE_INTEGER;
  constructor(replayBuffer) {
    this.replayBuffer = replayBuffer;
  }
  replayWindow() {
    return this.replayBuffer ? new ReplayWindowImpl(this.replayBuffer) : emptyReplayWindow;
  }
  isEmpty() {
    return this.publisherHead === this.publisherTail;
  }
  isFull() {
    return false;
  }
  size() {
    return this.publisherIndex - this.subscribersIndex;
  }
  publish(value) {
    const subscribers = this.publisherTail.subscribers;
    if (subscribers !== 0) {
      this.publisherTail.next = {
        value,
        subscribers,
        next: null
      };
      this.publisherTail = this.publisherTail.next;
      this.publisherIndex += 1;
    }
    if (this.replayBuffer) {
      this.replayBuffer.offer(value);
    }
    return true;
  }
  publishAll(elements) {
    if (this.publisherTail.subscribers !== 0) {
      for (const a of elements) {
        this.publish(a);
      }
    } else if (this.replayBuffer) {
      this.replayBuffer.offerAll(elements);
    }
    return empty5();
  }
  slide() {
    if (this.publisherHead !== this.publisherTail) {
      this.publisherHead = this.publisherHead.next;
      this.publisherHead.value = AbsentValue;
      this.subscribersIndex += 1;
    }
    if (this.replayBuffer) {
      this.replayBuffer.slide();
    }
  }
  subscribe() {
    this.publisherTail.subscribers += 1;
    return new UnboundedPubSubSubscription(this, this.publisherTail, this.publisherIndex, false);
  }
}

class UnboundedPubSubSubscription {
  self;
  subscriberHead;
  subscriberIndex;
  unsubscribed;
  constructor(self2, subscriberHead, subscriberIndex, unsubscribed) {
    this.self = self2;
    this.subscriberHead = subscriberHead;
    this.subscriberIndex = subscriberIndex;
    this.unsubscribed = unsubscribed;
  }
  isEmpty() {
    if (this.unsubscribed) {
      return true;
    }
    let empty34 = true;
    let loop3 = true;
    while (loop3) {
      if (this.subscriberHead === this.self.publisherTail) {
        loop3 = false;
      } else {
        if (this.subscriberHead.next.value !== AbsentValue) {
          empty34 = false;
          loop3 = false;
        } else {
          this.subscriberHead = this.subscriberHead.next;
          this.subscriberIndex += 1;
        }
      }
    }
    return empty34;
  }
  size() {
    if (this.unsubscribed) {
      return 0;
    }
    return this.self.publisherIndex - Math.max(this.subscriberIndex, this.self.subscribersIndex);
  }
  poll(default_) {
    if (this.unsubscribed) {
      return default_;
    }
    let loop3 = true;
    let polled = default_;
    while (loop3) {
      if (this.subscriberHead === this.self.publisherTail) {
        loop3 = false;
      } else {
        const elem = this.subscriberHead.next.value;
        if (elem !== AbsentValue) {
          polled = elem;
          this.subscriberHead.subscribers -= 1;
          if (this.subscriberHead.subscribers === 0) {
            this.self.publisherHead = this.self.publisherHead.next;
            this.self.publisherHead.value = AbsentValue;
            this.self.subscribersIndex += 1;
          }
          loop3 = false;
        }
        this.subscriberHead = this.subscriberHead.next;
        this.subscriberIndex += 1;
      }
    }
    return polled;
  }
  pollUpTo(n) {
    const builder = [];
    const default_ = AbsentValue;
    let i = 0;
    while (i !== n) {
      const a = this.poll(default_);
      if (a === default_) {
        i = n;
      } else {
        builder.push(a);
        i += 1;
      }
    }
    return fromIterable2(builder);
  }
  unsubscribe() {
    if (!this.unsubscribed) {
      this.unsubscribed = true;
      this.self.publisherTail.subscribers -= 1;
      while (this.subscriberHead !== this.self.publisherTail) {
        if (this.subscriberHead.next.value !== AbsentValue) {
          this.subscriberHead.subscribers -= 1;
          if (this.subscriberHead.subscribers === 0) {
            this.self.publisherHead = this.self.publisherHead.next;
            this.self.publisherHead.value = AbsentValue;
            this.self.subscribersIndex += 1;
          }
        }
        this.subscriberHead = this.subscriberHead.next;
      }
    }
  }
}
class ReplayBuffer {
  capacity;
  constructor(capacity2) {
    this.capacity = capacity2;
  }
  head = {
    value: AbsentValue,
    next: null
  };
  tail = this.head;
  size = 0;
  index = 0;
  slide() {
    this.index++;
  }
  offer(a) {
    this.tail.value = a;
    this.tail.next = {
      value: AbsentValue,
      next: null
    };
    this.tail = this.tail.next;
    if (this.size === this.capacity) {
      this.head = this.head.next;
    } else {
      this.size += 1;
    }
  }
  offerAll(as5) {
    for (const a of as5) {
      this.offer(a);
    }
  }
}

class ReplayWindowImpl {
  buffer;
  head;
  index;
  remaining;
  constructor(buffer2) {
    this.buffer = buffer2;
    this.index = buffer2.index;
    this.remaining = buffer2.size;
    this.head = buffer2.head;
  }
  fastForward() {
    while (this.index < this.buffer.index) {
      this.head = this.head.next;
      this.index++;
    }
  }
  take() {
    if (this.remaining === 0) {
      return;
    } else if (this.index < this.buffer.index) {
      this.fastForward();
    }
    this.remaining--;
    const value = this.head.value;
    this.head = this.head.next;
    return value;
  }
  takeN(n) {
    if (this.remaining === 0) {
      return empty5();
    } else if (this.index < this.buffer.index) {
      this.fastForward();
    }
    const len = Math.min(n, this.remaining);
    const items = new Array(len);
    for (let i = 0;i < len; i++) {
      const value = this.head.value;
      this.head = this.head.next;
      items[i] = value;
    }
    this.remaining -= len;
    return unsafeFromArray(items);
  }
  takeAll() {
    return this.takeN(this.remaining);
  }
}
var emptyReplayWindow = {
  remaining: 0,
  take: () => {
    return;
  },
  takeN: () => empty5(),
  takeAll: () => empty5()
};

// node_modules/effect/dist/esm/internal/channel/childExecutorDecision.js
var ChildExecutorDecisionSymbolKey = "effect/ChannelChildExecutorDecision";
var ChildExecutorDecisionTypeId = Symbol.for(ChildExecutorDecisionSymbolKey);
var proto4 = {
  [ChildExecutorDecisionTypeId]: ChildExecutorDecisionTypeId
};

// node_modules/effect/dist/esm/internal/channel/upstreamPullStrategy.js
var UpstreamPullStrategySymbolKey = "effect/ChannelUpstreamPullStrategy";
var UpstreamPullStrategyTypeId = Symbol.for(UpstreamPullStrategySymbolKey);
var upstreamPullStrategyVariance = {
  _A: (_) => _
};
var proto5 = {
  [UpstreamPullStrategyTypeId]: upstreamPullStrategyVariance
};

// node_modules/effect/dist/esm/internal/core-stream.js
var ChannelSymbolKey = "effect/Channel";
var ChannelTypeId2 = Symbol.for(ChannelSymbolKey);
var channelVariance2 = {
  _Env: (_) => _,
  _InErr: (_) => _,
  _InElem: (_) => _,
  _InDone: (_) => _,
  _OutErr: (_) => _,
  _OutElem: (_) => _,
  _OutDone: (_) => _
};
var proto6 = {
  [ChannelTypeId2]: channelVariance2,
  pipe() {
    return pipeArguments(this, arguments);
  }
};

// node_modules/effect/dist/esm/internal/channel/channelState.js
var ChannelStateTypeId = Symbol.for("effect/ChannelState");
var channelStateVariance = {
  _E: (_) => _,
  _R: (_) => _
};
var proto7 = {
  [ChannelStateTypeId]: channelStateVariance
};

// node_modules/effect/dist/esm/internal/channel/upstreamPullRequest.js
var UpstreamPullRequestSymbolKey = "effect/ChannelUpstreamPullRequest";
var UpstreamPullRequestTypeId = Symbol.for(UpstreamPullRequestSymbolKey);
var upstreamPullRequestVariance = {
  _A: (_) => _
};
var proto8 = {
  [UpstreamPullRequestTypeId]: upstreamPullRequestVariance
};

// node_modules/effect/dist/esm/internal/channel/mergeDecision.js
var MergeDecisionSymbolKey = "effect/ChannelMergeDecision";
var MergeDecisionTypeId = Symbol.for(MergeDecisionSymbolKey);
var proto9 = {
  [MergeDecisionTypeId]: {
    _R: (_) => _,
    _E0: (_) => _,
    _Z0: (_) => _,
    _E: (_) => _,
    _Z: (_) => _
  }
};

// node_modules/effect/dist/esm/internal/channel/mergeState.js
var MergeStateSymbolKey = "effect/ChannelMergeState";
var MergeStateTypeId = Symbol.for(MergeStateSymbolKey);
var proto10 = {
  [MergeStateTypeId]: MergeStateTypeId
};

// node_modules/effect/dist/esm/internal/channel/mergeStrategy.js
var MergeStrategySymbolKey = "effect/ChannelMergeStrategy";
var MergeStrategyTypeId = Symbol.for(MergeStrategySymbolKey);
var proto11 = {
  [MergeStrategyTypeId]: MergeStrategyTypeId
};

// node_modules/effect/dist/esm/internal/sink.js
var SinkTypeId2 = Symbol.for("effect/Sink");

// node_modules/effect/dist/esm/Schedule.js
var exports_Schedule = {};
__export(exports_Schedule, {
  zipWith: () => {
    {
      return zipWith8;
    }
  },
  zipRight: () => {
    {
      return zipRight6;
    }
  },
  zipLeft: () => {
    {
      return zipLeft4;
    }
  },
  windowed: () => {
    {
      return windowed2;
    }
  },
  whileOutputEffect: () => {
    {
      return whileOutputEffect2;
    }
  },
  whileOutput: () => {
    {
      return whileOutput2;
    }
  },
  whileInputEffect: () => {
    {
      return whileInputEffect2;
    }
  },
  whileInput: () => {
    {
      return whileInput2;
    }
  },
  upTo: () => {
    {
      return upTo2;
    }
  },
  untilOutputEffect: () => {
    {
      return untilOutputEffect2;
    }
  },
  untilOutput: () => {
    {
      return untilOutput2;
    }
  },
  untilInputEffect: () => {
    {
      return untilInputEffect2;
    }
  },
  untilInput: () => {
    {
      return untilInput2;
    }
  },
  unionWith: () => {
    {
      return unionWith3;
    }
  },
  union: () => {
    {
      return union9;
    }
  },
  unfold: () => {
    {
      return unfold3;
    }
  },
  tapOutput: () => {
    {
      return tapOutput2;
    }
  },
  tapInput: () => {
    {
      return tapInput2;
    }
  },
  sync: () => {
    {
      return sync6;
    }
  },
  succeed: () => {
    {
      return succeed10;
    }
  },
  stop: () => {
    {
      return stop2;
    }
  },
  spaced: () => {
    {
      return spaced2;
    }
  },
  secondOfMinute: () => {
    {
      return secondOfMinute2;
    }
  },
  run: () => {
    {
      return run3;
    }
  },
  resetWhen: () => {
    {
      return resetWhen2;
    }
  },
  resetAfter: () => {
    {
      return resetAfter2;
    }
  },
  repetitions: () => {
    {
      return repetitions2;
    }
  },
  repeatForever: () => {
    {
      return repeatForever;
    }
  },
  reduceEffect: () => {
    {
      return reduceEffect4;
    }
  },
  reduce: () => {
    {
      return reduce14;
    }
  },
  recurs: () => {
    {
      return recurs2;
    }
  },
  recurWhileEffect: () => {
    {
      return recurWhileEffect2;
    }
  },
  recurWhile: () => {
    {
      return recurWhile2;
    }
  },
  recurUpTo: () => {
    {
      return recurUpTo2;
    }
  },
  recurUntilOption: () => {
    {
      return recurUntilOption2;
    }
  },
  recurUntilEffect: () => {
    {
      return recurUntilEffect2;
    }
  },
  recurUntil: () => {
    {
      return recurUntil2;
    }
  },
  provideService: () => {
    {
      return provideService5;
    }
  },
  provideContext: () => {
    {
      return provideContext4;
    }
  },
  passthrough: () => {
    {
      return passthrough3;
    }
  },
  once: () => {
    {
      return once4;
    }
  },
  onDecision: () => {
    {
      return onDecision2;
    }
  },
  modifyDelayEffect: () => {
    {
      return modifyDelayEffect2;
    }
  },
  modifyDelay: () => {
    {
      return modifyDelay2;
    }
  },
  minuteOfHour: () => {
    {
      return minuteOfHour2;
    }
  },
  mapInputEffect: () => {
    {
      return mapInputEffect2;
    }
  },
  mapInputContext: () => {
    {
      return mapInputContext4;
    }
  },
  mapInput: () => {
    {
      return mapInput4;
    }
  },
  mapEffect: () => {
    {
      return mapEffect4;
    }
  },
  mapBothEffect: () => {
    {
      return mapBothEffect2;
    }
  },
  mapBoth: () => {
    {
      return mapBoth4;
    }
  },
  map: () => {
    {
      return map18;
    }
  },
  makeWithState: () => {
    {
      return makeWithState2;
    }
  },
  linear: () => {
    {
      return linear2;
    }
  },
  jitteredWith: () => {
    {
      return jitteredWith2;
    }
  },
  jittered: () => {
    {
      return jittered2;
    }
  },
  intersectWith: () => {
    {
      return intersectWith2;
    }
  },
  intersect: () => {
    {
      return intersect6;
    }
  },
  identity: () => {
    {
      return identity3;
    }
  },
  hourOfDay: () => {
    {
      return hourOfDay2;
    }
  },
  fromFunction: () => {
    {
      return fromFunction3;
    }
  },
  fromDelays: () => {
    {
      return fromDelays2;
    }
  },
  fromDelay: () => {
    {
      return fromDelay2;
    }
  },
  forever: () => {
    {
      return forever4;
    }
  },
  fixed: () => {
    {
      return fixed2;
    }
  },
  fibonacci: () => {
    {
      return fibonacci2;
    }
  },
  exponential: () => {
    {
      return exponential3;
    }
  },
  ensuring: () => {
    {
      return ensuring5;
    }
  },
  elapsed: () => {
    {
      return elapsed2;
    }
  },
  eitherWith: () => {
    {
      return eitherWith2;
    }
  },
  either: () => {
    {
      return either5;
    }
  },
  duration: () => {
    {
      return duration2;
    }
  },
  driver: () => {
    {
      return driver2;
    }
  },
  delays: () => {
    {
      return delays2;
    }
  },
  delayedSchedule: () => {
    {
      return delayedSchedule2;
    }
  },
  delayedEffect: () => {
    {
      return delayedEffect2;
    }
  },
  delayed: () => {
    {
      return delayed2;
    }
  },
  dayOfWeek: () => {
    {
      return dayOfWeek2;
    }
  },
  dayOfMonth: () => {
    {
      return dayOfMonth2;
    }
  },
  cron: () => {
    {
      return cron2;
    }
  },
  count: () => {
    {
      return count2;
    }
  },
  compose: () => {
    {
      return compose2;
    }
  },
  collectWhileEffect: () => {
    {
      return collectWhileEffect2;
    }
  },
  collectWhile: () => {
    {
      return collectWhile2;
    }
  },
  collectUntilEffect: () => {
    {
      return collectUntilEffect2;
    }
  },
  collectUntil: () => {
    {
      return collectUntil2;
    }
  },
  collectAllOutputs: () => {
    {
      return collectAllOutputs2;
    }
  },
  collectAllInputs: () => {
    {
      return collectAllInputs2;
    }
  },
  checkEffect: () => {
    {
      return checkEffect2;
    }
  },
  check: () => {
    {
      return check2;
    }
  },
  bothInOut: () => {
    {
      return bothInOut2;
    }
  },
  asVoid: () => {
    {
      return asVoid4;
    }
  },
  as: () => {
    {
      return as6;
    }
  },
  andThenEither: () => {
    {
      return andThenEither2;
    }
  },
  andThen: () => {
    {
      return andThen6;
    }
  },
  addDelayEffect: () => {
    {
      return addDelayEffect2;
    }
  },
  addDelay: () => {
    {
      return addDelay2;
    }
  },
  ScheduleTypeId: () => {
    {
      return ScheduleTypeId2;
    }
  },
  ScheduleDriverTypeId: () => {
    {
      return ScheduleDriverTypeId2;
    }
  }
});
var ScheduleTypeId2 = ScheduleTypeId;
var ScheduleDriverTypeId2 = ScheduleDriverTypeId;
var makeWithState2 = makeWithState;
var addDelay2 = addDelay;
var addDelayEffect2 = addDelayEffect;
var andThen6 = andThen4;
var andThenEither2 = andThenEither;
var as6 = as3;
var asVoid4 = asVoid2;
var bothInOut2 = bothInOut;
var check2 = check;
var checkEffect2 = checkEffect;
var collectAllInputs2 = collectAllInputs;
var collectAllOutputs2 = collectAllOutputs;
var collectUntil2 = collectUntil;
var collectUntilEffect2 = collectUntilEffect;
var collectWhile2 = collectWhile;
var collectWhileEffect2 = collectWhileEffect;
var compose2 = compose;
var mapInput4 = mapInput3;
var mapInputContext4 = mapInputContext2;
var mapInputEffect2 = mapInputEffect;
var count2 = count;
var cron2 = cron;
var dayOfMonth2 = dayOfMonth;
var dayOfWeek2 = dayOfWeek;
var delayed2 = delayed;
var delayedEffect2 = delayedEffect;
var delayedSchedule2 = delayedSchedule;
var delays2 = delays;
var mapBoth4 = mapBoth2;
var mapBothEffect2 = mapBothEffect;
var driver2 = driver;
var duration2 = duration;
var either5 = either3;
var eitherWith2 = eitherWith;
var elapsed2 = elapsed;
var ensuring5 = ensuring2;
var exponential3 = exponential2;
var fibonacci2 = fibonacci;
var fixed2 = fixed;
var forever4 = forever2;
var fromDelay2 = fromDelay;
var fromDelays2 = fromDelays;
var fromFunction3 = fromFunction;
var hourOfDay2 = hourOfDay;
var identity3 = identity2;
var intersect6 = intersect5;
var intersectWith2 = intersectWith;
var jittered2 = jittered;
var jitteredWith2 = jitteredWith;
var linear2 = linear;
var map18 = map10;
var mapEffect4 = mapEffect;
var minuteOfHour2 = minuteOfHour;
var modifyDelay2 = modifyDelay;
var modifyDelayEffect2 = modifyDelayEffect;
var onDecision2 = onDecision;
var once4 = once2;
var passthrough3 = passthrough;
var provideContext4 = provideContext2;
var provideService5 = provideService2;
var recurUntil2 = recurUntil;
var recurUntilEffect2 = recurUntilEffect;
var recurUntilOption2 = recurUntilOption;
var recurUpTo2 = recurUpTo;
var recurWhile2 = recurWhile;
var recurWhileEffect2 = recurWhileEffect;
var recurs2 = recurs;
var reduce14 = reduce11;
var reduceEffect4 = reduceEffect2;
var repeatForever = forever2;
var repetitions2 = repetitions;
var resetAfter2 = resetAfter;
var resetWhen2 = resetWhen;
var run3 = run;
var secondOfMinute2 = secondOfMinute;
var spaced2 = spaced;
var stop2 = stop;
var succeed10 = succeed3;
var sync6 = sync2;
var tapInput2 = tapInput;
var tapOutput2 = tapOutput;
var unfold3 = unfold2;
var union9 = union8;
var unionWith3 = unionWith2;
var untilInput2 = untilInput;
var untilInputEffect2 = untilInputEffect;
var untilOutput2 = untilOutput;
var untilOutputEffect2 = untilOutputEffect;
var upTo2 = upTo;
var whileInput2 = whileInput;
var whileInputEffect2 = whileInputEffect;
var whileOutput2 = whileOutput;
var whileOutputEffect2 = whileOutputEffect;
var windowed2 = windowed;
var zipLeft4 = zipLeft2;
var zipRight6 = zipRight2;
var zipWith8 = zipWith4;

// node_modules/effect/dist/esm/internal/stream.js
var StreamSymbolKey = "effect/Stream";
var StreamTypeId2 = Symbol.for(StreamSymbolKey);
// node_modules/effect/dist/esm/internal/redacted.js
var RedactedSymbolKey = "effect/Redacted";
var redactedRegistry = globalValue("effect/Redacted/redactedRegistry", () => new WeakMap);
var RedactedTypeId = Symbol.for(RedactedSymbolKey);
var proto12 = {
  [RedactedTypeId]: {
    _A: (_) => _
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
  toString() {
    return "<redacted>";
  },
  toJSON() {
    return "<redacted>";
  },
  [symbol]() {
    return pipe(hash3(RedactedSymbolKey), combine(hash3(redactedRegistry.get(this))), cached(this));
  },
  [symbol2](that) {
    return isRedacted(that) && equals(redactedRegistry.get(this), redactedRegistry.get(that));
  }
};
var isRedacted = (u) => hasProperty(u, RedactedTypeId);

// node_modules/effect/dist/esm/internal/config.js
var ConfigSymbolKey = "effect/Config";
var ConfigTypeId = Symbol.for(ConfigSymbolKey);
var configVariance = {
  _A: (_) => _
};
var proto13 = {
  ...CommitPrototype,
  [ConfigTypeId]: configVariance,
  commit() {
    return config4(this);
  }
};
// node_modules/effect/dist/esm/DateTime.js
var TypeId17 = Symbol.for("effect/DateTime");
var TimeZoneTypeId = Symbol.for("effect/DateTime/TimeZone");
var Proto2 = {
  [TypeId17]: TypeId17,
  pipe() {
    return pipeArguments(this, arguments);
  },
  [NodeInspectSymbol]() {
    return this.toString();
  },
  toJSON() {
    return toDateUtc(this).toJSON();
  }
};
var ProtoUtc = {
  ...Proto2,
  _tag: "Utc",
  [symbol]() {
    return cached(this, number3(this.epochMillis));
  },
  [symbol2](that) {
    return isDateTime(that) && that._tag === "Utc" && this.epochMillis === that.epochMillis;
  },
  toString() {
    return `DateTime.Utc(${toDateUtc(this).toJSON()})`;
  }
};
var ProtoZoned = {
  ...Proto2,
  _tag: "Zoned",
  [symbol]() {
    return pipe(number3(this.epochMillis), combine(hash3(this.zone)), cached(this));
  },
  [symbol2](that) {
    return isDateTime(that) && that._tag === "Zoned" && this.epochMillis === that.epochMillis && equals(this.zone, that.zone);
  },
  toString() {
    return `DateTime.Zoned(${formatIsoZoned(this)})`;
  }
};
var ProtoTimeZone = {
  [TimeZoneTypeId]: TimeZoneTypeId,
  [NodeInspectSymbol]() {
    return this.toString();
  }
};
var ProtoTimeZoneNamed = {
  ...ProtoTimeZone,
  _tag: "Named",
  [symbol]() {
    return cached(this, string(`Named:${this.id}`));
  },
  [symbol2](that) {
    return isTimeZone(that) && that._tag === "Named" && this.id === that.id;
  },
  toString() {
    return `TimeZone.Named(${this.id})`;
  },
  toJSON() {
    return {
      _id: "TimeZone",
      _tag: "Named",
      id: this.id
    };
  }
};
var ProtoTimeZoneOffset = {
  ...ProtoTimeZone,
  _tag: "Offset",
  [symbol]() {
    return cached(this, string(`Offset:${this.offset}`));
  },
  [symbol2](that) {
    return isTimeZone(that) && that._tag === "Offset" && this.offset === that.offset;
  },
  toString() {
    return `TimeZone.Offset(${offsetToString(this.offset)})`;
  },
  toJSON() {
    return {
      _id: "TimeZone",
      _tag: "Offset",
      offset: this.offset
    };
  }
};
var isDateTime = (u) => hasProperty(u, TypeId17);
var isTimeZone = (u) => hasProperty(u, TimeZoneTypeId);
var toDateUtc = (self2) => new Date(self2.epochMillis);
var toDate = (self2) => {
  if (self2._tag === "Utc") {
    return new Date(self2.epochMillis);
  } else if (self2.zone._tag === "Offset") {
    return new Date(self2.epochMillis + self2.zone.offset);
  } else if (self2.adjustedEpochMillis !== undefined) {
    return new Date(self2.adjustedEpochMillis);
  }
  const parts = self2.zone.format.formatToParts(self2.epochMillis).filter((_) => _.type !== "literal");
  const date2 = new Date(0);
  date2.setUTCFullYear(Number(parts[2].value), Number(parts[0].value) - 1, Number(parts[1].value));
  date2.setUTCHours(Number(parts[3].value), Number(parts[4].value), Number(parts[5].value), Number(parts[6].value));
  self2.adjustedEpochMillis = date2.getTime();
  return date2;
};
var zonedOffset = (self2) => {
  const date2 = toDate(self2);
  return date2.getTime() - toEpochMillis(self2);
};
var offsetToString = (offset) => {
  const abs = Math.abs(offset);
  const hours2 = Math.floor(abs / (60 * 60 * 1000));
  const minutes2 = Math.round(abs % (60 * 60 * 1000) / (60 * 1000));
  return `${offset < 0 ? "-" : "+"}${String(hours2).padStart(2, "0")}:${String(minutes2).padStart(2, "0")}`;
};
var zonedOffsetIso = (self2) => offsetToString(zonedOffset(self2));
var toEpochMillis = (self2) => self2.epochMillis;
var formatIsoOffset = (self2) => {
  const date2 = toDate(self2);
  return self2._tag === "Utc" ? date2.toISOString() : `${date2.toISOString().slice(0, -1)}${zonedOffsetIso(self2)}`;
};
var formatIsoZoned = (self2) => self2.zone._tag === "Offset" ? formatIsoOffset(self2) : `${formatIsoOffset(self2)}[${self2.zone.id}]`;
// node_modules/effect/dist/esm/FiberHandle.js
var TypeId18 = Symbol.for("effect/FiberHandle");
var Proto3 = {
  [TypeId18]: TypeId18,
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "FiberHandle",
      state: this.state
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
// node_modules/effect/dist/esm/FiberMap.js
var TypeId19 = Symbol.for("effect/FiberMap");
var Proto4 = {
  [TypeId19]: TypeId19,
  [Symbol.iterator]() {
    if (this.state._tag === "Closed") {
      return empty();
    }
    return this.state.backing[Symbol.iterator]();
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "FiberMap",
      state: this.state
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
// node_modules/effect/dist/esm/FiberSet.js
var TypeId20 = Symbol.for("effect/FiberSet");
var Proto5 = {
  [TypeId20]: TypeId20,
  [Symbol.iterator]() {
    if (this.state._tag === "Closed") {
      return empty();
    }
    return this.state.backing[Symbol.iterator]();
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "FiberMap",
      state: this.state
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
// node_modules/effect/dist/esm/internal/pool.js
var PoolTypeId = Symbol.for("effect/Pool");
var poolVariance = {
  _E: (_) => _,
  _A: (_) => _
};
class PoolImpl {
  acquire;
  concurrency;
  minSize;
  maxSize;
  strategy;
  targetUtilization;
  [PoolTypeId];
  isShuttingDown = false;
  semaphore;
  items = new Set;
  available = new Set;
  invalidated = new Set;
  waiters = 0;
  constructor(acquire, concurrency, minSize, maxSize, strategy, targetUtilization) {
    this.acquire = acquire;
    this.concurrency = concurrency;
    this.minSize = minSize;
    this.maxSize = maxSize;
    this.strategy = strategy;
    this.targetUtilization = targetUtilization;
    this[PoolTypeId] = poolVariance;
    this.semaphore = unsafeMakeSemaphore(concurrency * maxSize);
  }
  allocate = acquireUseRelease(scopeMake(), (scope4) => this.acquire.pipe(scopeExtend(scope4), exit, flatMap7((exit3) => {
    const item = {
      exit: exit3,
      finalizer: catchAllCause(scope4.close(exit3), reportUnhandledError),
      refCount: 0,
      disableReclaim: false
    };
    this.items.add(item);
    this.available.add(item);
    return as(exit3._tag === "Success" ? this.strategy.onAcquire(item) : zipRight(item.finalizer, this.strategy.onAcquire(item)), item);
  })), (scope4, exit3) => exit3._tag === "Failure" ? scope4.close(exit3) : void_);
  get currentUsage() {
    let count5 = this.waiters;
    for (const item of this.items) {
      count5 += item.refCount;
    }
    return count5;
  }
  get targetSize() {
    if (this.isShuttingDown)
      return 0;
    const utilization = this.currentUsage / this.targetUtilization;
    const target = Math.ceil(utilization / this.concurrency);
    return Math.min(Math.max(this.minSize, target), this.maxSize);
  }
  get activeSize() {
    return this.items.size - this.invalidated.size;
  }
  resizeLoop = suspend(() => {
    if (this.activeSize >= this.targetSize) {
      return void_;
    }
    return this.strategy.reclaim(this).pipe(flatMap7(match2({
      onNone: () => this.allocate,
      onSome: succeed
    })), zipRight(this.resizeLoop));
  });
  resizeSemaphore = unsafeMakeSemaphore(1);
  resize = this.resizeSemaphore.withPermits(1)(this.resizeLoop);
  getPoolItem = uninterruptibleMask((restore) => restore(this.semaphore.take(1)).pipe(zipRight(scopeTag), flatMap7((scope4) => suspend(() => {
    this.waiters++;
    if (this.isShuttingDown) {
      return interrupt2;
    } else if (this.targetSize > this.activeSize) {
      return zipRight(restore(this.resize), sync(() => unsafeHead(this.available)));
    }
    return succeed(unsafeHead(this.available));
  }).pipe(ensuring(sync(() => this.waiters--)), tap((item) => {
    if (item.exit._tag === "Failure") {
      this.items.delete(item);
      this.invalidated.delete(item);
      this.available.delete(item);
      return this.semaphore.release(1);
    }
    item.refCount++;
    this.available.delete(item);
    if (item.refCount < this.concurrency) {
      this.available.add(item);
    }
    return scope4.addFinalizer(() => zipRight(suspend(() => {
      item.refCount--;
      if (this.invalidated.has(item)) {
        return this.invalidatePoolItem(item);
      }
      this.available.add(item);
      return void_;
    }), this.semaphore.release(1)));
  }), onInterrupt(() => this.semaphore.release(1))))));
  get = flatMap7(suspend(() => this.isShuttingDown ? interrupt2 : this.getPoolItem), (_) => _.exit);
  invalidate(item) {
    return suspend(() => {
      if (this.isShuttingDown)
        return void_;
      for (const poolItem of this.items) {
        if (poolItem.exit._tag === "Success" && poolItem.exit.value === item) {
          poolItem.disableReclaim = true;
          return uninterruptible(this.invalidatePoolItem(poolItem));
        }
      }
      return void_;
    });
  }
  invalidatePoolItem(poolItem) {
    return suspend(() => {
      if (!this.items.has(poolItem)) {
        return void_;
      } else if (poolItem.refCount === 0) {
        this.items.delete(poolItem);
        this.available.delete(poolItem);
        this.invalidated.delete(poolItem);
        return zipRight(poolItem.finalizer, this.resize);
      }
      this.invalidated.add(poolItem);
      this.available.delete(poolItem);
      return void_;
    });
  }
  get shutdown() {
    return suspend(() => {
      if (this.isShuttingDown)
        return void_;
      this.isShuttingDown = true;
      const size25 = this.items.size;
      const semaphore = unsafeMakeSemaphore(size25);
      return forEachSequentialDiscard(this.items, (item) => {
        if (item.refCount > 0) {
          item.finalizer = zipLeft(item.finalizer, semaphore.release(1));
          this.invalidated.add(item);
          return semaphore.take(1);
        }
        this.items.delete(item);
        this.available.delete(item);
        this.invalidated.delete(item);
        return item.finalizer;
      }).pipe(zipRight(this.semaphore.releaseAll), zipRight(semaphore.take(size25)));
    });
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
var reportUnhandledError = (cause3) => withFiberRuntime((fiber) => {
  const unhandledLogLevel = fiber.getFiberRef(currentUnhandledErrorLogLevel);
  if (unhandledLogLevel._tag === "Some") {
    fiber.log("Unhandled error in pool finalizer", cause3, unhandledLogLevel);
  }
  return void_;
});
// node_modules/effect/dist/esm/internal/matcher.js
var makeTypeMatcher = function(cases) {
  const matcher = Object.create(TypeMatcherProto);
  matcher.cases = cases;
  return matcher;
};
var makeValueMatcher = function(provided, value) {
  const matcher = Object.create(ValueMatcherProto);
  matcher.provided = provided;
  matcher.value = value;
  return matcher;
};
var TypeId21 = Symbol.for("@effect/matcher/Matcher");
var TypeMatcherProto = {
  [TypeId21]: {
    _input: identity,
    _filters: identity,
    _remaining: identity,
    _result: identity,
    _return: identity
  },
  _tag: "TypeMatcher",
  add(_case) {
    return makeTypeMatcher([...this.cases, _case]);
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var ValueMatcherProto = {
  [TypeId21]: {
    _input: identity,
    _filters: identity,
    _result: identity,
    _return: identity
  },
  _tag: "ValueMatcher",
  add(_case) {
    if (this.value._tag === "Right") {
      return this;
    }
    if (_case._tag === "When" && _case.guard(this.provided) === true) {
      return makeValueMatcher(this.provided, right2(_case.evaluate(this.provided)));
    } else if (_case._tag === "Not" && _case.guard(this.provided) === false) {
      return makeValueMatcher(this.provided, right2(_case.evaluate(this.provided)));
    }
    return this;
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
// node_modules/effect/dist/esm/MutableHashSet.js
var TypeId22 = Symbol.for("effect/MutableHashSet");
var MutableHashSetProto = {
  [TypeId22]: TypeId22,
  [Symbol.iterator]() {
    return Array.from(this.keyMap).map(([_]) => _)[Symbol.iterator]();
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableHashSet",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
// node_modules/effect/dist/esm/Stream.js
var StreamTypeId3 = StreamTypeId2;

// node_modules/effect/dist/esm/internal/stm/opCodes/stm.js
var OP_WITH_STM_RUNTIME = "WithSTMRuntime";
var OP_ON_FAILURE2 = "OnFailure";
var OP_ON_RETRY = "OnRetry";
var OP_ON_SUCCESS2 = "OnSuccess";
var OP_PROVIDE3 = "Provide";
var OP_SYNC2 = "Sync";
var OP_SUCCEED2 = "Succeed";
var OP_RETRY = "Retry";
var OP_FAIL4 = "Fail";
var OP_DIE2 = "Die";
var OP_INTERRUPT2 = "Interrupt";

// node_modules/effect/dist/esm/internal/stm/opCodes/tExit.js
var OP_FAIL5 = "Fail";
var OP_DIE3 = "Die";
var OP_INTERRUPT3 = "Interrupt";
var OP_SUCCEED3 = "Succeed";
var OP_RETRY2 = "Retry";

// node_modules/effect/dist/esm/internal/stm/opCodes/tryCommit.js
var OP_DONE5 = "Done";
var OP_SUSPEND3 = "Suspend";

// node_modules/effect/dist/esm/internal/stm/stm/versioned.js
class Versioned {
  value;
  constructor(value4) {
    this.value = value4;
  }
}

// node_modules/effect/dist/esm/internal/stm/stm/entry.js
var make60 = (ref, isNew) => ({
  ref,
  isNew,
  isChanged: false,
  expected: ref.versioned,
  newValue: ref.versioned.value
});
var unsafeGet7 = (self2) => {
  return self2.newValue;
};
var unsafeSet = (self2, value4) => {
  self2.isChanged = true;
  self2.newValue = value4;
};
var commit = (self2) => {
  self2.ref.versioned = new Versioned(self2.newValue);
};
var isInvalid = (self2) => {
  return self2.ref.versioned !== self2.expected;
};
var isChanged = (self2) => {
  return self2.isChanged;
};

// node_modules/effect/dist/esm/internal/stm/stm/journal.js
var JournalAnalysisInvalid = "Invalid";
var JournalAnalysisReadWrite = "ReadWrite";
var JournalAnalysisReadOnly = "ReadOnly";
var commitJournal = (journal) => {
  for (const entry of journal) {
    commit(entry[1]);
  }
};
var analyzeJournal = (journal) => {
  let val = JournalAnalysisReadOnly;
  for (const [, entry] of journal) {
    val = isInvalid(entry) ? JournalAnalysisInvalid : isChanged(entry) ? JournalAnalysisReadWrite : val;
    if (val === JournalAnalysisInvalid) {
      return val;
    }
  }
  return val;
};
var collectTodos = (journal) => {
  const allTodos = new Map;
  for (const [, entry] of journal) {
    for (const todo of entry.ref.todos) {
      allTodos.set(todo[0], todo[1]);
    }
    entry.ref.todos = new Map;
  }
  return allTodos;
};
var execTodos = (todos) => {
  const todosSorted = Array.from(todos.entries()).sort((x, y) => x[0] - y[0]);
  for (const [_, todo] of todosSorted) {
    todo();
  }
};
var addTodo = (txnId, journal, todoEffect) => {
  let added = false;
  for (const [, entry] of journal) {
    if (!entry.ref.todos.has(txnId)) {
      entry.ref.todos.set(txnId, todoEffect);
      added = true;
    }
  }
  return added;
};

// node_modules/effect/dist/esm/internal/stm/opCodes/stmState.js
var OP_DONE6 = "Done";
var OP_INTERRUPTED = "Interrupted";
var OP_RUNNING2 = "Running";

// node_modules/effect/dist/esm/internal/stm/stm/stmState.js
var STMStateSymbolKey = "effect/STM/State";
var STMStateTypeId = Symbol.for(STMStateSymbolKey);
var isSTMState = (u) => hasProperty(u, STMStateTypeId);
var isRunning3 = (self2) => {
  return self2._tag === OP_RUNNING2;
};
var isDone6 = (self2) => {
  return self2._tag === OP_DONE6;
};
var done9 = (exit3) => {
  return {
    [STMStateTypeId]: STMStateTypeId,
    _tag: OP_DONE6,
    exit: exit3,
    [symbol]() {
      return pipe(hash3(STMStateSymbolKey), combine(hash3(OP_DONE6)), combine(hash3(exit3)), cached(this));
    },
    [symbol2](that) {
      return isSTMState(that) && that._tag === OP_DONE6 && equals(exit3, that.exit);
    }
  };
};
var interruptedHash = pipe(hash3(STMStateSymbolKey), combine(hash3(OP_INTERRUPTED)), combine(hash3("interrupted")));
var interrupted2 = {
  [STMStateTypeId]: STMStateTypeId,
  _tag: OP_INTERRUPTED,
  [symbol]() {
    return interruptedHash;
  },
  [symbol2](that) {
    return isSTMState(that) && that._tag === OP_INTERRUPTED;
  }
};
var runningHash = pipe(hash3(STMStateSymbolKey), combine(hash3(OP_RUNNING2)), combine(hash3("running")));
var running3 = {
  [STMStateTypeId]: STMStateTypeId,
  _tag: OP_RUNNING2,
  [symbol]() {
    return runningHash;
  },
  [symbol2](that) {
    return isSTMState(that) && that._tag === OP_RUNNING2;
  }
};
var fromTExit = (tExit) => {
  switch (tExit._tag) {
    case OP_FAIL5: {
      return done9(fail3(tExit.error));
    }
    case OP_DIE3: {
      return done9(die3(tExit.defect));
    }
    case OP_INTERRUPT3: {
      return done9(interrupt4(tExit.fiberId));
    }
    case OP_SUCCEED3: {
      return done9(succeed2(tExit.value));
    }
    case OP_RETRY2: {
      throw new Error("BUG: STM.STMState.fromTExit - please report an issue at https://github.com/Effect-TS/effect/issues");
    }
  }
};

// node_modules/effect/dist/esm/internal/stm/stm/tExit.js
var TExitSymbolKey = "effect/TExit";
var TExitTypeId = Symbol.for(TExitSymbolKey);
var variance8 = {
  _A: (_) => _,
  _E: (_) => _
};
var isExit2 = (u) => hasProperty(u, TExitTypeId);
var isSuccess4 = (self2) => {
  return self2._tag === OP_SUCCEED3;
};
var isRetry = (self2) => {
  return self2._tag === OP_RETRY2;
};
var fail14 = (error2) => ({
  [TExitTypeId]: variance8,
  _tag: OP_FAIL5,
  error: error2,
  [symbol]() {
    return pipe(hash3(TExitSymbolKey), combine(hash3(OP_FAIL5)), combine(hash3(error2)), cached(this));
  },
  [symbol2](that) {
    return isExit2(that) && that._tag === OP_FAIL5 && equals(error2, that.error);
  }
});
var die8 = (defect) => ({
  [TExitTypeId]: variance8,
  _tag: OP_DIE3,
  defect,
  [symbol]() {
    return pipe(hash3(TExitSymbolKey), combine(hash3(OP_DIE3)), combine(hash3(defect)), cached(this));
  },
  [symbol2](that) {
    return isExit2(that) && that._tag === OP_DIE3 && equals(defect, that.defect);
  }
});
var interrupt8 = (fiberId4) => ({
  [TExitTypeId]: variance8,
  _tag: OP_INTERRUPT3,
  fiberId: fiberId4,
  [symbol]() {
    return pipe(hash3(TExitSymbolKey), combine(hash3(OP_INTERRUPT3)), combine(hash3(fiberId4)), cached(this));
  },
  [symbol2](that) {
    return isExit2(that) && that._tag === OP_INTERRUPT3 && equals(fiberId4, that.fiberId);
  }
});
var succeed16 = (value4) => ({
  [TExitTypeId]: variance8,
  _tag: OP_SUCCEED3,
  value: value4,
  [symbol]() {
    return pipe(hash3(TExitSymbolKey), combine(hash3(OP_SUCCEED3)), combine(hash3(value4)), cached(this));
  },
  [symbol2](that) {
    return isExit2(that) && that._tag === OP_SUCCEED3 && equals(value4, that.value);
  }
});
var retryHash = pipe(hash3(TExitSymbolKey), combine(hash3(OP_RETRY2)), combine(hash3("retry")));
var retry5 = {
  [TExitTypeId]: variance8,
  _tag: OP_RETRY2,
  [symbol]() {
    return retryHash;
  },
  [symbol2](that) {
    return isExit2(that) && isRetry(that);
  }
};

// node_modules/effect/dist/esm/internal/stm/stm/tryCommit.js
var done10 = (exit3) => {
  return {
    _tag: OP_DONE5,
    exit: exit3
  };
};
var suspend7 = (journal) => {
  return {
    _tag: OP_SUSPEND3,
    journal
  };
};

// node_modules/effect/dist/esm/internal/stm/stm/txnId.js
var txnCounter = {
  ref: 0
};
var make61 = () => {
  const newId = txnCounter.ref + 1;
  txnCounter.ref = newId;
  return newId;
};

// node_modules/effect/dist/esm/internal/stm/core.js
var STMSymbolKey2 = "effect/STM";
var STMTypeId2 = Symbol.for(STMSymbolKey2);
var stmVariance = {
  _R: (_) => _,
  _E: (_) => _,
  _A: (_) => _
};

class STMPrimitive {
  effect_instruction_i0;
  _tag = OP_COMMIT;
  _op = OP_COMMIT;
  effect_instruction_i1 = undefined;
  effect_instruction_i2 = undefined;
  [EffectTypeId4];
  [StreamTypeId3];
  [SinkTypeId2];
  [ChannelTypeId2];
  get [STMTypeId2]() {
    return stmVariance;
  }
  constructor(effect_instruction_i0) {
    this.effect_instruction_i0 = effect_instruction_i0;
    this[EffectTypeId4] = effectVariance;
    this[StreamTypeId3] = stmVariance;
    this[SinkTypeId2] = stmVariance;
    this[ChannelTypeId2] = stmVariance;
  }
  [symbol2](that) {
    return this === that;
  }
  [symbol]() {
    return cached(this, random(this));
  }
  [Symbol.iterator]() {
    return new SingleShotGen2(new YieldWrap(this));
  }
  commit() {
    return unsafeAtomically(this, constVoid, constVoid);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
var unsafeAtomically = (self2, onDone2, onInterrupt3) => withFiberRuntime((state) => {
  const fiberId4 = state.id();
  const env = state.getFiberRef(currentContext3);
  const scheduler = state.getFiberRef(currentScheduler3);
  const priority = state.getFiberRef(currentSchedulingPriority2);
  const commitResult = tryCommitSync(fiberId4, self2, env, scheduler, priority);
  switch (commitResult._tag) {
    case OP_DONE5: {
      onDone2(commitResult.exit);
      return commitResult.exit;
    }
    case OP_SUSPEND3: {
      const txnId = make61();
      const state2 = {
        value: running3
      };
      const effect4 = async2((k) => tryCommitAsync(fiberId4, self2, txnId, state2, env, scheduler, priority, k));
      return uninterruptibleMask2((restore) => pipe(restore(effect4), catchAllCause2((cause3) => {
        let currentState = state2.value;
        if (isRunning3(currentState)) {
          state2.value = interrupted2;
        }
        currentState = state2.value;
        if (isDone6(currentState)) {
          onDone2(currentState.exit);
          return currentState.exit;
        }
        onInterrupt3();
        return failCause5(cause3);
      })));
    }
  }
});
var tryCommit = (fiberId4, stm, state, env, scheduler, priority) => {
  const journal = new Map;
  const tExit = new STMDriver(stm, journal, fiberId4, env).run();
  const analysis = analyzeJournal(journal);
  if (analysis === JournalAnalysisReadWrite) {
    commitJournal(journal);
  } else if (analysis === JournalAnalysisInvalid) {
    throw new Error("BUG: STM.TryCommit.tryCommit - please report an issue at https://github.com/Effect-TS/effect/issues");
  }
  switch (tExit._tag) {
    case OP_SUCCEED3: {
      state.value = fromTExit(tExit);
      return completeTodos(succeed2(tExit.value), journal, scheduler, priority);
    }
    case OP_FAIL5: {
      state.value = fromTExit(tExit);
      const cause3 = fail4(tExit.error);
      return completeTodos(failCause2(cause3), journal, scheduler, priority);
    }
    case OP_DIE3: {
      state.value = fromTExit(tExit);
      const cause3 = die4(tExit.defect);
      return completeTodos(failCause2(cause3), journal, scheduler, priority);
    }
    case OP_INTERRUPT3: {
      state.value = fromTExit(tExit);
      const cause3 = interrupt5(fiberId4);
      return completeTodos(failCause2(cause3), journal, scheduler, priority);
    }
    case OP_RETRY2: {
      return suspend7(journal);
    }
  }
};
var tryCommitSync = (fiberId4, stm, env, scheduler, priority) => {
  const journal = new Map;
  const tExit = new STMDriver(stm, journal, fiberId4, env).run();
  const analysis = analyzeJournal(journal);
  if (analysis === JournalAnalysisReadWrite && isSuccess4(tExit)) {
    commitJournal(journal);
  } else if (analysis === JournalAnalysisInvalid) {
    throw new Error("BUG: STM.TryCommit.tryCommitSync - please report an issue at https://github.com/Effect-TS/effect/issues");
  }
  switch (tExit._tag) {
    case OP_SUCCEED3: {
      return completeTodos(succeed2(tExit.value), journal, scheduler, priority);
    }
    case OP_FAIL5: {
      const cause3 = fail4(tExit.error);
      return completeTodos(failCause2(cause3), journal, scheduler, priority);
    }
    case OP_DIE3: {
      const cause3 = die4(tExit.defect);
      return completeTodos(failCause2(cause3), journal, scheduler, priority);
    }
    case OP_INTERRUPT3: {
      const cause3 = interrupt5(fiberId4);
      return completeTodos(failCause2(cause3), journal, scheduler, priority);
    }
    case OP_RETRY2: {
      return suspend7(journal);
    }
  }
};
var tryCommitAsync = (fiberId4, self2, txnId, state, context9, scheduler, priority, k) => {
  if (isRunning3(state.value)) {
    const result = tryCommit(fiberId4, self2, state, context9, scheduler, priority);
    switch (result._tag) {
      case OP_DONE5: {
        completeTryCommit(result.exit, k);
        break;
      }
      case OP_SUSPEND3: {
        addTodo(txnId, result.journal, () => tryCommitAsync(fiberId4, self2, txnId, state, context9, scheduler, priority, k));
        break;
      }
    }
  }
};
var completeTodos = (exit3, journal, scheduler, priority) => {
  const todos = collectTodos(journal);
  if (todos.size > 0) {
    scheduler.scheduleTask(() => execTodos(todos), priority);
  }
  return done10(exit3);
};
var completeTryCommit = (exit3, k) => {
  k(exit3);
};
class STMDriver {
  self;
  journal;
  fiberId;
  contStack = [];
  env;
  constructor(self2, journal, fiberId4, r0) {
    this.self = self2;
    this.journal = journal;
    this.fiberId = fiberId4;
    this.env = r0;
  }
  getEnv() {
    return this.env;
  }
  pushStack(cont) {
    this.contStack.push(cont);
  }
  popStack() {
    return this.contStack.pop();
  }
  nextSuccess() {
    let current2 = this.popStack();
    while (current2 !== undefined && current2.effect_instruction_i0 !== OP_ON_SUCCESS2) {
      current2 = this.popStack();
    }
    return current2;
  }
  nextFailure() {
    let current2 = this.popStack();
    while (current2 !== undefined && current2.effect_instruction_i0 !== OP_ON_FAILURE2) {
      current2 = this.popStack();
    }
    return current2;
  }
  nextRetry() {
    let current2 = this.popStack();
    while (current2 !== undefined && current2.effect_instruction_i0 !== OP_ON_RETRY) {
      current2 = this.popStack();
    }
    return current2;
  }
  run() {
    let curr = this.self;
    let exit3 = undefined;
    while (exit3 === undefined && curr !== undefined) {
      try {
        const current2 = curr;
        if (current2) {
          switch (current2._tag) {
            case "Tag": {
              curr = effect4((_, __, env) => unsafeGet3(env, current2));
              break;
            }
            case "Left": {
              curr = fail15(current2.left);
              break;
            }
            case "None": {
              curr = fail15(new NoSuchElementException2);
              break;
            }
            case "Right": {
              curr = succeed17(current2.right);
              break;
            }
            case "Some": {
              curr = succeed17(current2.value);
              break;
            }
            case "Commit": {
              switch (current2.effect_instruction_i0) {
                case OP_DIE2: {
                  exit3 = die8(internalCall(() => current2.effect_instruction_i1()));
                  break;
                }
                case OP_FAIL4: {
                  const cont = this.nextFailure();
                  if (cont === undefined) {
                    exit3 = fail14(internalCall(() => current2.effect_instruction_i1()));
                  } else {
                    curr = internalCall(() => cont.effect_instruction_i2(internalCall(() => current2.effect_instruction_i1())));
                  }
                  break;
                }
                case OP_RETRY: {
                  const cont = this.nextRetry();
                  if (cont === undefined) {
                    exit3 = retry5;
                  } else {
                    curr = internalCall(() => cont.effect_instruction_i2());
                  }
                  break;
                }
                case OP_INTERRUPT2: {
                  exit3 = interrupt8(this.fiberId);
                  break;
                }
                case OP_WITH_STM_RUNTIME: {
                  curr = internalCall(() => current2.effect_instruction_i1(this));
                  break;
                }
                case OP_ON_SUCCESS2:
                case OP_ON_FAILURE2:
                case OP_ON_RETRY: {
                  this.pushStack(current2);
                  curr = current2.effect_instruction_i1;
                  break;
                }
                case OP_PROVIDE3: {
                  const env = this.env;
                  this.env = internalCall(() => current2.effect_instruction_i2(env));
                  curr = pipe(current2.effect_instruction_i1, ensuring7(sync12(() => this.env = env)));
                  break;
                }
                case OP_SUCCEED2: {
                  const value4 = current2.effect_instruction_i1;
                  const cont = this.nextSuccess();
                  if (cont === undefined) {
                    exit3 = succeed16(value4);
                  } else {
                    curr = internalCall(() => cont.effect_instruction_i2(value4));
                  }
                  break;
                }
                case OP_SYNC2: {
                  const value4 = internalCall(() => current2.effect_instruction_i1());
                  const cont = this.nextSuccess();
                  if (cont === undefined) {
                    exit3 = succeed16(value4);
                  } else {
                    curr = internalCall(() => cont.effect_instruction_i2(value4));
                  }
                  break;
                }
              }
              break;
            }
          }
        }
      } catch (e) {
        curr = die9(e);
      }
    }
    return exit3;
  }
}
var catchAll6 = dual(2, (self2, f) => {
  const stm = new STMPrimitive(OP_ON_FAILURE2);
  stm.effect_instruction_i1 = self2;
  stm.effect_instruction_i2 = f;
  return stm;
});
var die9 = (defect) => dieSync5(() => defect);
var dieSync5 = (evaluate2) => {
  const stm = new STMPrimitive(OP_DIE2);
  stm.effect_instruction_i1 = evaluate2;
  return stm;
};
var effect4 = (f) => withSTMRuntime((_) => succeed17(f(_.journal, _.fiberId, _.getEnv())));
var ensuring7 = dual(2, (self2, finalizer2) => matchSTM(self2, {
  onFailure: (e) => zipRight10(finalizer2, fail15(e)),
  onSuccess: (a) => zipRight10(finalizer2, succeed17(a))
}));
var fail15 = (error2) => failSync6(() => error2);
var failSync6 = (evaluate2) => {
  const stm = new STMPrimitive(OP_FAIL4);
  stm.effect_instruction_i1 = evaluate2;
  return stm;
};
var flatMap13 = dual(2, (self2, f) => {
  const stm = new STMPrimitive(OP_ON_SUCCESS2);
  stm.effect_instruction_i1 = self2;
  stm.effect_instruction_i2 = f;
  return stm;
});
var matchSTM = dual(2, (self2, {
  onFailure,
  onSuccess
}) => pipe(self2, map23(right2), catchAll6((e) => pipe(onFailure(e), map23(left2))), flatMap13((either8) => {
  switch (either8._tag) {
    case "Left": {
      return succeed17(either8.left);
    }
    case "Right": {
      return onSuccess(either8.right);
    }
  }
})));
var withSTMRuntime = (f) => {
  const stm = new STMPrimitive(OP_WITH_STM_RUNTIME);
  stm.effect_instruction_i1 = f;
  return stm;
};
var interruptAs2 = (fiberId4) => {
  const stm = new STMPrimitive(OP_INTERRUPT2);
  stm.effect_instruction_i1 = fiberId4;
  return stm;
};
var map23 = dual(2, (self2, f) => pipe(self2, flatMap13((a) => sync12(() => f(a)))));
var retry6 = new STMPrimitive(OP_RETRY);
var succeed17 = (value4) => {
  const stm = new STMPrimitive(OP_SUCCEED2);
  stm.effect_instruction_i1 = value4;
  return stm;
};
var sync12 = (evaluate2) => {
  const stm = new STMPrimitive(OP_SYNC2);
  stm.effect_instruction_i1 = evaluate2;
  return stm;
};
var zipRight10 = dual(2, (self2, that) => pipe(self2, flatMap13(() => that)));
var zipWith12 = dual(3, (self2, that, f) => pipe(self2, flatMap13((a) => pipe(that, map23((b) => f(a, b))))));

// node_modules/effect/dist/esm/internal/stm/stm.js
var flatten11 = (self2) => flatMap13(self2, identity);
var forEach10 = dual((args) => isIterable(args[0]), (iterable, f, options) => {
  if (options?.discard) {
    return pipe(sync12(() => iterable[Symbol.iterator]()), flatMap13((iterator2) => {
      const loop3 = suspend8(() => {
        const next4 = iterator2.next();
        if (next4.done) {
          return void_6;
        }
        return pipe(f(next4.value), flatMap13(() => loop3));
      });
      return loop3;
    }));
  }
  return suspend8(() => fromIterable(iterable).reduce((acc, curr) => zipWith12(acc, f(curr), (array6, elem) => {
    array6.push(elem);
    return array6;
  }), succeed17([])));
});
var suspend8 = (evaluate2) => flatten11(sync12(evaluate2));
var void_6 = succeed17(undefined);

// node_modules/effect/dist/esm/STM.js
var interruptAs3 = interruptAs2;
// node_modules/effect/dist/esm/SortedMap.js
var TypeId25 = Symbol.for("effect/SortedMap");
var SortedMapProto = {
  [TypeId25]: {
    _K: (_) => _,
    _V: (_) => _
  },
  [symbol]() {
    return pipe(hash3(this.tree), combine(hash3("effect/SortedMap")), cached(this));
  },
  [symbol2](that) {
    return isSortedMap(that) && equals(this.tree, that.tree);
  },
  [Symbol.iterator]() {
    return this.tree[Symbol.iterator]();
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "SortedMap",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var isSortedMap = (u) => hasProperty(u, TypeId25);
// node_modules/effect/dist/esm/Subscribable.js
var TypeId26 = Symbol.for("effect/Subscribable");
var Proto6 = {
  [TypeId13]: TypeId13,
  [TypeId26]: TypeId26,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
// node_modules/effect/dist/esm/internal/stm/tRef.js
var TRefSymbolKey = "effect/TRef";
var TRefTypeId = Symbol.for(TRefSymbolKey);
var tRefVariance = {
  _A: (_) => _
};

class TRefImpl {
  [TRefTypeId] = tRefVariance;
  todos;
  versioned;
  constructor(value5) {
    this.versioned = new Versioned(value5);
    this.todos = new Map;
  }
  modify(f) {
    return effect4((journal) => {
      const entry = getOrMakeEntry(this, journal);
      const [retValue, newValue] = f(unsafeGet7(entry));
      unsafeSet(entry, newValue);
      return retValue;
    });
  }
}
var getOrMakeEntry = (self2, journal) => {
  if (journal.has(self2)) {
    return journal.get(self2);
  }
  const entry = make60(self2, false);
  journal.set(self2, entry);
  return entry;
};
var unsafeGet8 = dual(2, (self2, journal) => unsafeGet7(getOrMakeEntry(self2, journal)));
var unsafeSet2 = dual(3, (self2, value5, journal) => {
  const entry = getOrMakeEntry(self2, journal);
  unsafeSet(entry, value5);
  return;
});
// node_modules/effect/dist/esm/internal/stm/opCodes/strategy.js
var OP_BACKPRESSURE_STRATEGY = "BackPressure";
var OP_DROPPING_STRATEGY = "Dropping";
var OP_SLIDING_STRATEGY = "Sliding";

// node_modules/effect/dist/esm/internal/stm/tQueue.js
var TEnqueueSymbolKey = "effect/TQueue/TEnqueue";
var TEnqueueTypeId = Symbol.for(TEnqueueSymbolKey);
var TDequeueSymbolKey = "effect/TQueue/TDequeue";
var TDequeueTypeId = Symbol.for(TDequeueSymbolKey);
var tDequeueVariance = {
  _Out: (_) => _
};
var tEnqueueVariance = {
  _In: (_) => _
};

class TQueueImpl {
  ref;
  requestedCapacity;
  strategy;
  [TDequeueTypeId] = tDequeueVariance;
  [TEnqueueTypeId] = tEnqueueVariance;
  constructor(ref, requestedCapacity, strategy) {
    this.ref = ref;
    this.requestedCapacity = requestedCapacity;
    this.strategy = strategy;
  }
  capacity() {
    return this.requestedCapacity;
  }
  size = withSTMRuntime((runtime4) => {
    const queue = unsafeGet8(this.ref, runtime4.journal);
    if (queue === undefined) {
      return interruptAs3(runtime4.fiberId);
    }
    return succeed17(queue.length);
  });
  isFull = map23(this.size, (size28) => size28 === this.requestedCapacity);
  isEmpty = map23(this.size, (size28) => size28 === 0);
  shutdown = withSTMRuntime((runtime4) => {
    unsafeSet2(this.ref, undefined, runtime4.journal);
    return void_6;
  });
  isShutdown = effect4((journal) => {
    const queue = unsafeGet8(this.ref, journal);
    return queue === undefined;
  });
  awaitShutdown = flatMap13(this.isShutdown, (isShutdown4) => isShutdown4 ? void_6 : retry6);
  offer(value5) {
    return withSTMRuntime((runtime4) => {
      const queue = pipe(this.ref, unsafeGet8(runtime4.journal));
      if (queue === undefined) {
        return interruptAs2(runtime4.fiberId);
      }
      if (queue.length < this.requestedCapacity) {
        queue.push(value5);
        unsafeSet2(this.ref, queue, runtime4.journal);
        return succeed17(true);
      }
      switch (this.strategy._tag) {
        case OP_BACKPRESSURE_STRATEGY: {
          return retry6;
        }
        case OP_DROPPING_STRATEGY: {
          return succeed17(false);
        }
        case OP_SLIDING_STRATEGY: {
          if (queue.length === 0) {
            return succeed17(true);
          }
          queue.shift();
          queue.push(value5);
          unsafeSet2(this.ref, queue, runtime4.journal);
          return succeed17(true);
        }
      }
    });
  }
  offerAll(iterable) {
    return withSTMRuntime((runtime4) => {
      const as10 = Array.from(iterable);
      const queue = unsafeGet8(this.ref, runtime4.journal);
      if (queue === undefined) {
        return interruptAs2(runtime4.fiberId);
      }
      if (queue.length + as10.length <= this.requestedCapacity) {
        unsafeSet2(this.ref, [...queue, ...as10], runtime4.journal);
        return succeed17(true);
      }
      switch (this.strategy._tag) {
        case OP_BACKPRESSURE_STRATEGY: {
          return retry6;
        }
        case OP_DROPPING_STRATEGY: {
          const forQueue = as10.slice(0, this.requestedCapacity - queue.length);
          unsafeSet2(this.ref, [...queue, ...forQueue], runtime4.journal);
          return succeed17(false);
        }
        case OP_SLIDING_STRATEGY: {
          const forQueue = as10.slice(0, this.requestedCapacity - queue.length);
          const toDrop = queue.length + forQueue.length - this.requestedCapacity;
          const newQueue = queue.slice(toDrop);
          unsafeSet2(this.ref, [...newQueue, ...forQueue], runtime4.journal);
          return succeed17(true);
        }
      }
    });
  }
  peek = withSTMRuntime((runtime4) => {
    const queue = unsafeGet8(this.ref, runtime4.journal);
    if (queue === undefined) {
      return interruptAs2(runtime4.fiberId);
    }
    if (queue.length === 0) {
      return retry6;
    }
    return succeed17(queue[0]);
  });
  peekOption = withSTMRuntime((runtime4) => {
    const queue = unsafeGet8(this.ref, runtime4.journal);
    if (queue === undefined) {
      return interruptAs2(runtime4.fiberId);
    }
    return succeed17(fromNullable(queue[0]));
  });
  take = withSTMRuntime((runtime4) => {
    const queue = unsafeGet8(this.ref, runtime4.journal);
    if (queue === undefined) {
      return interruptAs2(runtime4.fiberId);
    }
    if (queue.length === 0) {
      return retry6;
    }
    const dequeued = queue.shift();
    unsafeSet2(this.ref, queue, runtime4.journal);
    return succeed17(dequeued);
  });
  takeAll = withSTMRuntime((runtime4) => {
    const queue = unsafeGet8(this.ref, runtime4.journal);
    if (queue === undefined) {
      return interruptAs2(runtime4.fiberId);
    }
    unsafeSet2(this.ref, [], runtime4.journal);
    return succeed17(queue);
  });
  takeUpTo(max5) {
    return withSTMRuntime((runtime4) => {
      const queue = unsafeGet8(this.ref, runtime4.journal);
      if (queue === undefined) {
        return interruptAs2(runtime4.fiberId);
      }
      const [toTake, remaining] = splitAt2(unsafeFromArray(queue), max5);
      unsafeSet2(this.ref, Array.from(remaining), runtime4.journal);
      return succeed17(Array.from(toTake));
    });
  }
}

// node_modules/effect/dist/esm/internal/stm/tPubSub.js
var TPubSubSymbolKey = "effect/TPubSub";
var TPubSubTypeId = Symbol.for(TPubSubSymbolKey);
var AbsentValue2 = Symbol.for("effect/TPubSub/AbsentValue");
var makeNode2 = (head8, subscribers, tail) => ({
  head: head8,
  subscribers,
  tail
});

class TPubSubImpl {
  pubsubSize;
  publisherHead;
  publisherTail;
  requestedCapacity;
  strategy;
  subscriberCount;
  subscribers;
  [TPubSubTypeId] = {
    _A: (_) => _
  };
  [TEnqueueTypeId] = tEnqueueVariance;
  constructor(pubsubSize, publisherHead, publisherTail, requestedCapacity, strategy, subscriberCount, subscribers) {
    this.pubsubSize = pubsubSize;
    this.publisherHead = publisherHead;
    this.publisherTail = publisherTail;
    this.requestedCapacity = requestedCapacity;
    this.strategy = strategy;
    this.subscriberCount = subscriberCount;
    this.subscribers = subscribers;
  }
  isShutdown = effect4((journal) => {
    const currentPublisherTail = unsafeGet8(this.publisherTail, journal);
    return currentPublisherTail === undefined;
  });
  awaitShutdown = flatMap13(this.isShutdown, (isShutdown4) => isShutdown4 ? void_6 : retry6);
  capacity() {
    return this.requestedCapacity;
  }
  size = withSTMRuntime((runtime4) => {
    const currentPublisherTail = unsafeGet8(this.publisherTail, runtime4.journal);
    if (currentPublisherTail === undefined) {
      return interruptAs2(runtime4.fiberId);
    }
    return succeed17(unsafeGet8(this.pubsubSize, runtime4.journal));
  });
  isEmpty = map23(this.size, (size28) => size28 === 0);
  isFull = map23(this.size, (size28) => size28 === this.capacity());
  offer(value5) {
    return withSTMRuntime((runtime4) => {
      const currentPublisherTail = unsafeGet8(this.publisherTail, runtime4.journal);
      if (currentPublisherTail === undefined) {
        return interruptAs2(runtime4.fiberId);
      }
      const currentSubscriberCount = unsafeGet8(this.subscriberCount, runtime4.journal);
      if (currentSubscriberCount === 0) {
        return succeed17(true);
      }
      const currentPubSubSize = unsafeGet8(this.pubsubSize, runtime4.journal);
      if (currentPubSubSize < this.requestedCapacity) {
        const updatedPublisherTail = new TRefImpl(undefined);
        const updatedNode = makeNode2(value5, currentSubscriberCount, updatedPublisherTail);
        unsafeSet2(currentPublisherTail, updatedNode, runtime4.journal);
        unsafeSet2(this.publisherTail, updatedPublisherTail, runtime4.journal);
        unsafeSet2(this.pubsubSize, currentPubSubSize + 1, runtime4.journal);
        return succeed17(true);
      }
      switch (this.strategy._tag) {
        case OP_BACKPRESSURE_STRATEGY: {
          return retry6;
        }
        case OP_DROPPING_STRATEGY: {
          return succeed17(false);
        }
        case OP_SLIDING_STRATEGY: {
          if (this.requestedCapacity > 0) {
            let currentPublisherHead = unsafeGet8(this.publisherHead, runtime4.journal);
            let loop4 = true;
            while (loop4) {
              const node5 = unsafeGet8(currentPublisherHead, runtime4.journal);
              if (node5 === undefined) {
                return retry6;
              }
              const head8 = node5.head;
              const tail = node5.tail;
              if (head8 !== AbsentValue2) {
                const updatedNode2 = makeNode2(AbsentValue2, node5.subscribers, node5.tail);
                unsafeSet2(currentPublisherHead, updatedNode2, runtime4.journal);
                unsafeSet2(this.publisherHead, tail, runtime4.journal);
                loop4 = false;
              } else {
                currentPublisherHead = tail;
              }
            }
          }
          const updatedPublisherTail = new TRefImpl(undefined);
          const updatedNode = makeNode2(value5, currentSubscriberCount, updatedPublisherTail);
          unsafeSet2(currentPublisherTail, updatedNode, runtime4.journal);
          unsafeSet2(this.publisherTail, updatedPublisherTail, runtime4.journal);
          return succeed17(true);
        }
      }
    });
  }
  offerAll(iterable) {
    return map23(forEach10(iterable, (a) => this.offer(a)), every(identity));
  }
  shutdown = effect4((journal) => {
    const currentPublisherTail = unsafeGet8(this.publisherTail, journal);
    if (currentPublisherTail !== undefined) {
      unsafeSet2(this.publisherTail, undefined, journal);
      const currentSubscribers = unsafeGet8(this.subscribers, journal);
      forEach3(currentSubscribers, (subscriber) => {
        unsafeSet2(subscriber, undefined, journal);
      });
      unsafeSet2(this.subscribers, empty8(), journal);
    }
  });
}

class TPubSubSubscriptionImpl {
  pubsubSize;
  publisherHead;
  requestedCapacity;
  subscriberHead;
  subscriberCount;
  subscribers;
  [TPubSubTypeId] = TPubSubTypeId;
  [TDequeueTypeId] = tDequeueVariance;
  constructor(pubsubSize, publisherHead, requestedCapacity, subscriberHead, subscriberCount, subscribers) {
    this.pubsubSize = pubsubSize;
    this.publisherHead = publisherHead;
    this.requestedCapacity = requestedCapacity;
    this.subscriberHead = subscriberHead;
    this.subscriberCount = subscriberCount;
    this.subscribers = subscribers;
  }
  isShutdown = effect4((journal) => {
    const currentSubscriberHead = unsafeGet8(this.subscriberHead, journal);
    return currentSubscriberHead === undefined;
  });
  awaitShutdown = flatMap13(this.isShutdown, (isShutdown4) => isShutdown4 ? void_6 : retry6);
  capacity() {
    return this.requestedCapacity;
  }
  size = withSTMRuntime((runtime4) => {
    let currentSubscriberHead = unsafeGet8(this.subscriberHead, runtime4.journal);
    if (currentSubscriberHead === undefined) {
      return interruptAs2(runtime4.fiberId);
    }
    let loop4 = true;
    let size28 = 0;
    while (loop4) {
      const node5 = unsafeGet8(currentSubscriberHead, runtime4.journal);
      if (node5 === undefined) {
        loop4 = false;
      } else {
        const head8 = node5.head;
        const tail = node5.tail;
        if (head8 !== AbsentValue2) {
          size28 = size28 + 1;
          if (size28 >= Number.MAX_SAFE_INTEGER) {
            loop4 = false;
          }
        }
        currentSubscriberHead = tail;
      }
    }
    return succeed17(size28);
  });
  isEmpty = map23(this.size, (size28) => size28 === 0);
  isFull = map23(this.size, (size28) => size28 === this.capacity());
  peek = withSTMRuntime((runtime4) => {
    let currentSubscriberHead = unsafeGet8(this.subscriberHead, runtime4.journal);
    if (currentSubscriberHead === undefined) {
      return interruptAs2(runtime4.fiberId);
    }
    let value5 = AbsentValue2;
    let loop4 = true;
    while (loop4) {
      const node5 = unsafeGet8(currentSubscriberHead, runtime4.journal);
      if (node5 === undefined) {
        return retry6;
      }
      const head8 = node5.head;
      const tail = node5.tail;
      if (head8 !== AbsentValue2) {
        value5 = head8;
        loop4 = false;
      } else {
        currentSubscriberHead = tail;
      }
    }
    return succeed17(value5);
  });
  peekOption = withSTMRuntime((runtime4) => {
    let currentSubscriberHead = unsafeGet8(this.subscriberHead, runtime4.journal);
    if (currentSubscriberHead === undefined) {
      return interruptAs2(runtime4.fiberId);
    }
    let value5 = none2();
    let loop4 = true;
    while (loop4) {
      const node5 = unsafeGet8(currentSubscriberHead, runtime4.journal);
      if (node5 === undefined) {
        value5 = none2();
        loop4 = false;
      } else {
        const head8 = node5.head;
        const tail = node5.tail;
        if (head8 !== AbsentValue2) {
          value5 = some2(head8);
          loop4 = false;
        } else {
          currentSubscriberHead = tail;
        }
      }
    }
    return succeed17(value5);
  });
  shutdown = effect4((journal) => {
    let currentSubscriberHead = unsafeGet8(this.subscriberHead, journal);
    if (currentSubscriberHead !== undefined) {
      unsafeSet2(this.subscriberHead, undefined, journal);
      let loop4 = true;
      while (loop4) {
        const node5 = unsafeGet8(currentSubscriberHead, journal);
        if (node5 === undefined) {
          loop4 = false;
        } else {
          const head8 = node5.head;
          const tail = node5.tail;
          if (head8 !== AbsentValue2) {
            const subscribers = node5.subscribers;
            if (subscribers === 1) {
              const size28 = unsafeGet8(this.pubsubSize, journal);
              const updatedNode = makeNode2(AbsentValue2, 0, tail);
              unsafeSet2(currentSubscriberHead, updatedNode, journal);
              unsafeSet2(this.publisherHead, tail, journal);
              unsafeSet2(this.pubsubSize, size28 - 1, journal);
            } else {
              const updatedNode = makeNode2(head8, subscribers - 1, tail);
              unsafeSet2(currentSubscriberHead, updatedNode, journal);
            }
          }
          currentSubscriberHead = tail;
        }
      }
      const currentSubscriberCount = unsafeGet8(this.subscriberCount, journal);
      unsafeSet2(this.subscriberCount, currentSubscriberCount - 1, journal);
      unsafeSet2(this.subscribers, remove4(unsafeGet8(this.subscribers, journal), this.subscriberHead), journal);
    }
  });
  take = withSTMRuntime((runtime4) => {
    let currentSubscriberHead = unsafeGet8(this.subscriberHead, runtime4.journal);
    if (currentSubscriberHead === undefined) {
      return interruptAs2(runtime4.fiberId);
    }
    let value5 = AbsentValue2;
    let loop4 = true;
    while (loop4) {
      const node5 = unsafeGet8(currentSubscriberHead, runtime4.journal);
      if (node5 === undefined) {
        return retry6;
      }
      const head8 = node5.head;
      const tail = node5.tail;
      if (head8 !== AbsentValue2) {
        const subscribers = node5.subscribers;
        if (subscribers === 1) {
          const size28 = unsafeGet8(this.pubsubSize, runtime4.journal);
          const updatedNode = makeNode2(AbsentValue2, 0, tail);
          unsafeSet2(currentSubscriberHead, updatedNode, runtime4.journal);
          unsafeSet2(this.publisherHead, tail, runtime4.journal);
          unsafeSet2(this.pubsubSize, size28 - 1, runtime4.journal);
        } else {
          const updatedNode = makeNode2(head8, subscribers - 1, tail);
          unsafeSet2(currentSubscriberHead, updatedNode, runtime4.journal);
        }
        unsafeSet2(this.subscriberHead, tail, runtime4.journal);
        value5 = head8;
        loop4 = false;
      } else {
        currentSubscriberHead = tail;
      }
    }
    return succeed17(value5);
  });
  takeAll = this.takeUpTo(Number.POSITIVE_INFINITY);
  takeUpTo(max5) {
    return withSTMRuntime((runtime4) => {
      let currentSubscriberHead = unsafeGet8(this.subscriberHead, runtime4.journal);
      if (currentSubscriberHead === undefined) {
        return interruptAs2(runtime4.fiberId);
      }
      const builder = [];
      let n = 0;
      while (n !== max5) {
        const node5 = unsafeGet8(currentSubscriberHead, runtime4.journal);
        if (node5 === undefined) {
          n = max5;
        } else {
          const head8 = node5.head;
          const tail = node5.tail;
          if (head8 !== AbsentValue2) {
            const subscribers = node5.subscribers;
            if (subscribers === 1) {
              const size28 = unsafeGet8(this.pubsubSize, runtime4.journal);
              const updatedNode = makeNode2(AbsentValue2, 0, tail);
              unsafeSet2(currentSubscriberHead, updatedNode, runtime4.journal);
              unsafeSet2(this.publisherHead, tail, runtime4.journal);
              unsafeSet2(this.pubsubSize, size28 - 1, runtime4.journal);
            } else {
              const updatedNode = makeNode2(head8, subscribers - 1, tail);
              unsafeSet2(currentSubscriberHead, updatedNode, runtime4.journal);
            }
            builder.push(head8);
            n = n + 1;
          }
          currentSubscriberHead = tail;
        }
      }
      unsafeSet2(this.subscriberHead, currentSubscriberHead, runtime4.journal);
      return succeed17(builder);
    });
  }
}
// node_modules/effect/dist/esm/internal/trie.js
var TrieSymbolKey = "effect/Trie";
var TrieTypeId = Symbol.for(TrieSymbolKey);
var trieVariance = {
  _Value: (_) => _
};
var TrieProto = {
  [TrieTypeId]: trieVariance,
  [Symbol.iterator]() {
    return new TrieIterator(this, (k, v) => [k, v], () => true);
  },
  [symbol]() {
    let hash4 = hash3(TrieSymbolKey);
    for (const item of this) {
      hash4 ^= pipe(hash3(item[0]), combine(hash3(item[1])));
    }
    return cached(this, hash4);
  },
  [symbol2](that) {
    if (isTrie(that)) {
      const entries2 = Array.from(that);
      return Array.from(this).every((itemSelf, i) => {
        const itemThat = entries2[i];
        return equals(itemSelf[0], itemThat[0]) && equals(itemSelf[1], itemThat[1]);
      });
    }
    return false;
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Trie",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
class TrieIterator {
  trie;
  f;
  filter;
  stack = [];
  constructor(trie, f, filter14) {
    this.trie = trie;
    this.f = f;
    this.filter = filter14;
    const root = trie._root !== undefined ? trie._root : undefined;
    if (root !== undefined) {
      this.stack.push([root, "", false]);
    }
  }
  next() {
    while (this.stack.length > 0) {
      const [node5, keyString, isAdded] = this.stack.pop();
      if (isAdded) {
        const value5 = node5.value;
        if (value5 !== undefined) {
          const key = keyString + node5.key;
          if (this.filter(key, value5)) {
            return {
              done: false,
              value: this.f(key, value5)
            };
          }
        }
      } else {
        this.addToStack(node5, keyString);
      }
    }
    return {
      done: true,
      value: undefined
    };
  }
  addToStack(node5, keyString) {
    if (node5.right !== undefined) {
      this.stack.push([node5.right, keyString, false]);
    }
    if (node5.mid !== undefined) {
      this.stack.push([node5.mid, keyString + node5.key, false]);
    }
    this.stack.push([node5, keyString, true]);
    if (node5.left !== undefined) {
      this.stack.push([node5.left, keyString, false]);
    }
  }
  [Symbol.iterator]() {
    return new TrieIterator(this.trie, this.f, this.filter);
  }
}
var isTrie = (u) => hasProperty(u, TrieTypeId);
// src/handler.ts
var policy = exports_Schedule.fixed("100 millis");
var handleLogs = (logs) => exports_Effect.gen(function* () {
  yield* exports_Effect.log("Event received....", logs[0]);
  const callWebhook = yield* exports_Effect.tryPromise({
    try: () => fetch(Bun.env.NODE_ENV === "development" ? Bun.env.WEBHOOK_PROXY_PAYLOAD ?? "https://smee.io/f29WKHg05Pg0u4dT" : Bun.env.MAIN_API_WEBHOOK ?? "https://staging.api.wrapcbdc.com/api/services/blockchain/events/evm/burn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logs[0], (_, v) => typeof v === "bigint" ? formatUnits(v, 6) : v)
    }).then((res) => res.json()),
    catch: () => exports_Effect.fail(new Error("Error calling webhook forwarder"))
  });
  yield* exports_Effect.log(callWebhook, ":::webhook called");
  yield* exports_Effect.log("Webhook call finished...");
});

// index.ts
console.log(Bun.env.WEBHOOK_PROXY_PAYLOAD, ":::webhook proxy");
var watchInstance = publicListenerClient.watchContractEvent({
  address: "0x2Dda0158EFe7006B8aFf9e5FEe6E9112F16841D8",
  eventName: "Transfer",
  abi: ERC20Token_default?.abi,
  args: { to: "0x0000000000000000000000000000000000000000" },
  onLogs: (logs) => handleLogs(logs).pipe(exports_Effect.retry({ times: 3 }), exports_Effect.runPromise),
  onError: (error2) => console.log(error2, "::: error on listening")
});
console.log(watchInstance, ":::watcher started");
