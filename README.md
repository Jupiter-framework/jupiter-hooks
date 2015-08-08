# jupiter-hooks

[![Build Status](https://travis-ci.org/Jupiter-framework/jupiter-hooks.svg)](https://travis-ci.org/Jupiter-framework/jupiter-hooks)
[![Coverage Status](https://coveralls.io/repos/Jupiter-framework/jupiter-hooks/badge.svg?branch=master&service=github)](https://coveralls.io/github/Jupiter-framework/jupiter-hooks?branch=master)

Simple hooks realizations

* [Motivation](#motivation)
* [API](#api)

## Motivation

For tasks where needed execute some actions before or after main handlers. It
very abstract and repetitive task, for realization on external package. Also
this package support Promises.

## API

### Constructor

Create hooks structure and return API for manipulate hooks.

**Example:**
```javascript
import Hook from 'jupiter-hooks';

let hook = Hook();
```

### .addHookType(typeName)

Add new type of hook in current hook structure. Used for define hook namespace.

**Arguments**
* typeName - { String } Name of hook type

**Example:**

```javascript
hook.addHookType('testhook');
```

### .removeHookType(removeHookType)

Remove type of hook and all hooks of this type.

**Arguments**
* typeName - { String } Name of hook type

**Example:**

```javascript
hook.removeHookType('testhook');
```

### .clearHooks()

Remove all types and hooks by this hook structure.

**Example:**

```javascript
hook.clearHooks();
```

### .addHook(typeName, order, hook)

Add hook for `typeName` in `order`. Order can be `before` or `after`.

**Arguments**
* typeName - { String } Name of hook type
* order - { String } Order of hook execution. Can be `before` or `after`.
* hook - { Function } Hook function

**Example:**

```javascript
hook.addHook('testhook', 'before', function before() {});
hook.addHook('testhook', 'after', function after() {});
```

### .addHookBefore(typeName, hook)

Add hook for `typeName` in `before` order.

**Arguments**
* typeName - { String } Name of hook type
* hook - { Function } Hook function

**Example:**

```javascript
hook.addHookBefore('testhook', function before() {});
```

### .addHookAfter(typeName, hook)

Add hook for `typeName` in `after` order.

**Arguments**
* typeName - { String } Name of hook type
* hook - { Function } Hook function

**Example:**

```javascript
hook.addHookBefore('testhook', function before() {});
```

### .resolveHook(typeName, order)

Execute all hooks in `order` by order of adding.

**Arguments**
* typeName - { String } Name of hook type
* order - { String } Order of hooks type

**Example:**

```javascript
hook.resolveHook('testhook', 'before');
hook.resolveHook('testhook', 'after');
```

### .resolveHookBefore(typeName)

Execute all `before` hooks by order of adding.

**Arguments**
* typeName - { String } Name of hook type

**Example:**

```javascript
hook.resolveHookBefore('testhook');
```

### .resolveHookAfter(typeName)

Execute all `after` hooks by order of adding.

**Arguments**
* typeName - { String } Name of hook type

**Example:**

```javascript
hook.resolveHookAfter('testhook');
```

### .wrap(typeName, handler)

Wrap handler of `before` and `after` hooks of `typeName` type.
Return function, that return Promise.

**Arguments**
* typeName - { String } Name of hook type

**Example:**

```javascript
import Hook from 'jupiter-hooks';

let hook = Hook();

hook.addHookType('testhook');

hook.addHookBefore('testhook', ()=> console.log('before'));
hook.addHookAfter('testhook', ()=> console.log('after'));

hook.wrap('testhook', ()=> console.log('handler'))();
// Output will be `before`, then `handler` and then `after`
```
