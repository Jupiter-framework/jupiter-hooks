
import { Map, List, fromJS } from 'immutable';
import { memoize, compose, partialRight, call } from 'ramda';
import { Promise } from 'es6-promise';

function createHookStructure() {
  return fromJS({hooks: Map() });
}

function hookAtom() {
  return Map({
    'before': List(),
    'after': List(),
  });
}

function Hook() {
  const hookAPI = {};

  hookAPI.getHookStructure = memoize(()=> createHookStructure());

  function updateHookStructure(newStructure) {
    hookAPI.getHookStructure = memoize(()=> newStructure);

    return newStructure;
  }

  function setHookType(hookName) {
    return hookAPI.getHookStructure().set(
      'hooks',
      hookAPI.getHookStructure().get('hooks').set(hookName, hookAtom())
    );
  }

  function removeHookType(hookName) {
    return hookAPI.getHookStructure().set(
      'hooks',
      hookAPI.getHookStructure().get('hooks').remove(hookName)
    );
  }

  function clearHooks() {
    return hookAPI.getHookStructure().set('hooks', Map());
  }

  function addHook(name, position, hook) {
    return hookAPI.getHookStructure().setIn(
      ['hooks', name, position],
      hookAPI.getHookStructure().getIn(['hooks', name, position]).push(hook)
    );
  }

  function resolveHook(name, pos) {
    const sequence = hookAPI.getHookStructure().getIn(['hooks', name, pos]);

    return function(...args) {
      return sequence.reduce(
        function(initialValue, hook) {
          return initialValue.then(()=> hook.apply(this, args));
        },
        Promise.resolve(null)
      );
    };
  }

  function wrapHandler(name, handler) {
    return function(...args) {
      return call(resolveHook(name, 'before'), args)
        .then(function(beforeSeq) {
          return Promise.resolve(beforeSeq).then(handler).then(resolveHook(name, 'after'));
        });
    };
  }

  hookAPI.addHookType = compose(
    updateHookStructure,
    (type)=> setHookType(type)
  );

  hookAPI.removeHookType = compose(
    updateHookStructure,
    (type)=> removeHookType(type)
  );

  hookAPI.clearHooks = compose(
    updateHookStructure,
    ()=> clearHooks()
  );

  hookAPI.addHook = compose(
    updateHookStructure,
    addHook
  );

  hookAPI.addHookBefore = (name, hook)=> hookAPI.addHook(name, 'before', hook);

  hookAPI.addHookAfter = (name, hook)=> hookAPI.addHook(name, 'after', hook);

  hookAPI.resolveHook = resolveHook;

  hookAPI.resolveHookBefore = partialRight(resolveHook, 'before');

  hookAPI.resolveHookAfter = partialRight(resolveHook, 'after');

  hookAPI.wrap = wrapHandler;

  return hookAPI;
}

export default Hook;
