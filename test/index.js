
import { expect } from 'chai';
import { stub, assert as sinonAssert } from 'sinon';
import { Map } from 'immutable';

import Hook from '../src/index';

describe('API spec', function() {
  it('should be have contructor', function() {
    expect(Hook).to.be.a('function');
  });

  it('constructor should have API functions', function() {
    expect(Hook()).to.have.all.keys(
      'addHookType', 'removeHookType', 'addHook', 'addHookBefore',
      'addHookAfter', 'resolveHook', 'getHookStructure',
      'resolveHookBefore', 'resolveHookAfter', 'clearHooks',
      'wrap'
    );
  });
});

describe('Hook structure', function() {
  it('should return atom with correct structure', function() {
    const HookDataStructure = Hook().getHookStructure();

    expect(HookDataStructure).to.be.instanceof(Map);
    expect(HookDataStructure.has('hooks')).to.be.ok;
  });
});

describe('Hook Type', function() {
  it('should be register type', function() {
    const HookAPI = Hook();
    const HookStruct = HookAPI.addHookType('testhook');

    expect(HookStruct).to.be.instanceof(Map);
    expect(HookStruct).to.be.eql(HookAPI.getHookStructure());
  });

  it('should be remove type', function() {
    const HookAPI = Hook();

    HookAPI.addHookType('testhook');

    expect(HookAPI.removeHookType('testhook')).to.be.instanceof(Map);
    expect(
      HookAPI.getHookStructure().get('hooks').has('testhook')
    ).to.be.not.ok;
  });

  it('should be clear types', function() {
    const HookAPI = Hook();

    HookAPI.addHookType('testhook');
    HookAPI.addHookType('testhooktest');

    expect(
      HookAPI.getHookStructure().get('hooks').has('testhook')
    ).to.be.ok;
    expect(
      HookAPI.getHookStructure().get('hooks').has('testhooktest')
    ).to.be.ok;

    HookAPI.clearHooks();

    expect(
      HookAPI.getHookStructure().get('hooks').has('testhook')
    ).to.be.not.ok;
    expect(
      HookAPI.getHookStructure().get('hooks').has('testhooktest')
    ).to.be.not.ok;
  });
});

describe('Hooks', function() {
  it('should be add before hook', function() {
    const HookAPI = Hook();
    const beforeHook = stub();

    HookAPI.addHookType('testhook');

    HookAPI.addHook('testhook', 'before', beforeHook);

    expect(
      HookAPI.getHookStructure().getIn(
        ['hooks', 'testhook', 'before']
      ).contains(beforeHook)
    ).to.be.ok;
  });

  it('should add after hook', function() {
    const HookAPI = Hook();
    const afterHook = stub();

    HookAPI.addHookType('testhook');

    HookAPI.addHook('testhook', 'after', afterHook);

    expect(
      HookAPI.getHookStructure().getIn(
        ['hooks', 'testhook', 'after']
      ).contains(afterHook)
    ).to.be.ok;
  });

  it('should add before hook in custom func', function() {
    const HookAPI = Hook();
    const beforeHook = stub();

    HookAPI.addHookType('testhook');

    HookAPI.addHookBefore('testhook', beforeHook);

    expect(
      HookAPI.getHookStructure().getIn(
        ['hooks', 'testhook', 'before']
      ).contains(beforeHook)
    ).to.be.ok;
  });

  it('should add after hook in custom func', function() {
    const HookAPI = Hook();
    const afterHook = stub();

    HookAPI.addHookType('testhook');

    HookAPI.addHookAfter('testhook', afterHook);

    expect(
      HookAPI.getHookStructure().getIn(
        ['hooks', 'testhook', 'after']
      ).contains(afterHook)
    ).to.be.ok;
  });
});

describe('Resolving Hook', function() {
  it('should be resolve sync before hooks', function(done) {
    const HookAPI = Hook();
    const beforeHook = stub();

    HookAPI.addHookType('testhook');

    HookAPI.addHook('testhook', 'before', beforeHook);

    HookAPI.resolveHook('testhook', 'before')().then(function() {
      sinonAssert.calledOnce(beforeHook);

      done();
    });
  });

  it('should be resolve sync after hooks', function(done) {
    const HookAPI = Hook();
    const afterHook = stub();

    HookAPI.addHookType('testhook');

    HookAPI.addHook('testhook', 'after', afterHook);

    HookAPI.resolveHook('testhook', 'after')().then(function() {
      sinonAssert.calledOnce(afterHook);

      done();
    });
  });

  it('should be resolve sync before hooks with custom func', function(done) {
    const HookAPI = Hook();
    const beforeHook = stub();

    HookAPI.addHookType('testhook');

    HookAPI.addHook('testhook', 'before', beforeHook);

    HookAPI.resolveHookBefore('testhook')().then(function() {
      sinonAssert.calledOnce(beforeHook);

      done();
    });
  });

  it('should be resolve sync after hooks with custom func', function(done) {
    const HookAPI = Hook();
    const afterHook = stub();

    HookAPI.addHookType('testhook');

    HookAPI.addHook('testhook', 'after', afterHook);

    HookAPI.resolveHookAfter('testhook')().then(function() {
      sinonAssert.calledOnce(afterHook);

      done();
    });
  });

  it('should resolve async before hooks', function(done) {
    const HookAPI = Hook();
    const beforeHook = stub().returns(Promise.resolve());

    HookAPI.addHookType('testhook');

    HookAPI.addHook('testhook', 'before', beforeHook);

    HookAPI.resolveHook('testhook', 'before')().then(function() {
      done();
    });
  });

  it('should resolve async after hooks', function(done) {
    const HookAPI = Hook();
    const beforeHook = stub().returns(Promise.resolve());

    HookAPI.addHookType('testhook');

    HookAPI.addHook('testhook', 'before', beforeHook);

    HookAPI.resolveHook('testhook', 'before')().then(function() {
      done();
    });
  });

  it('should before called with one argument', function(done) {
    const HookAPI = Hook();
    const beforeHook = stub();

    HookAPI.addHookType('testhook');

    HookAPI.addHook('testhook', 'before', beforeHook);

    HookAPI.resolveHook('testhook', 'before')(1).then(function() {
      expect(beforeHook.calledOnce).to.be.ok;
      expect(beforeHook.calledWith(1)).to.be.ok;

      done();
    });
  });

  it('should after called with one argument', function(done) {
    const HookAPI = Hook();
    const afterHook = stub();

    HookAPI.addHookType('testhook');

    HookAPI.addHook('testhook', 'before', afterHook);

    HookAPI.resolveHook('testhook', 'before')(1).then(function() {
      expect(afterHook.calledOnce).to.be.ok;
      expect(afterHook.calledWith(1)).to.be.ok;

      done();
    });
  });

  it('should after called with multiple argument', function(done) {
    const HookAPI = Hook();
    const afterHook = stub();

    HookAPI.addHookType('testhook');

    HookAPI.addHook('testhook', 'before', afterHook);

    HookAPI.resolveHook('testhook', 'before')(1, 2).then(function() {
      expect(afterHook.calledOnce).to.be.ok;
      expect(afterHook.calledWith(1, 2)).to.be.ok;

      done();
    });
  });

  it('should before called with multiple argument', function(done) {
    const HookAPI = Hook();
    const beforeHook = stub();

    HookAPI.addHookType('testhook');

    HookAPI.addHook('testhook', 'before', beforeHook);

    HookAPI.resolveHook('testhook', 'before')(1, 2).then(function() {
      expect(beforeHook.calledOnce).to.be.ok;
      expect(beforeHook.calledWith(1, 2)).to.be.ok;

      done();
    });
  });
});

describe('Wrap of hooks', function() {
  it('should be return function', function() {
    const HookAPI = Hook();
    const beforeHook = stub();
    const afterHook = stub();
    const wrappedHandler = stub();

    HookAPI.addHookType('testhook');

    HookAPI.addHook('testhook', 'before', beforeHook);
    HookAPI.addHook('testhook', 'after', afterHook);

    expect(HookAPI.wrap('testhook', wrappedHandler)).to.be.a('function');
  });

  it('wrapped function should be return function', function(done) {
    const HookAPI = Hook();
    const beforeHook = stub().returns(1);
    const afterHook = stub().returns(5);
    const wrappedHandler = stub();

    HookAPI.addHookType('testhook');

    HookAPI.addHook('testhook', 'before', beforeHook);
    HookAPI.addHook('testhook', 'after', afterHook);

    HookAPI.wrap('testhook', wrappedHandler)().then(function(five) {
      sinonAssert.calledOnce(afterHook);
      sinonAssert.calledOnce(beforeHook);
      expect(five).to.eql(5);

      done();
    });
  });
});
