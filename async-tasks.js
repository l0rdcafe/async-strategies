var Runner = function (strat) {
  this.strategy = strat;
  this.run = function () {
    this.strategy();
  };
};


// Ex 1: serial, callbacks, no fail

var serialCbNoFail = function () {
  function task1(cb) {
    console.log('Task 1 started');
    setTimeout(function () {
      cb();
    }, 3000);
  }

  function task2(cb) {
    console.log('Task 2 started');
    setTimeout(function () {
      cb();
    }, 1000);
  }

  task1(function () {
    console.log('Task 1 completed');
    task2(function () {
      console.log('Task 2 completed');
      console.log('Both tasks completed');
    });
  });
};

// Ex 2: serial, Promises, no fail

var serialPromisesNoFail = function () {
  function task1() {
    return new Promise(function (resolve) {
      console.log('Task 1 has started');
      setTimeout(resolve, 3000);
    });
  }

  function task2() {
    return new Promise(function (resolve) {
      console.log('Task 2 has started');
      setTimeout(resolve, 1000);
    });
  }

  function task1Complete() {
    console.log('Task 1 completed');
  }

  function task2Complete() {
    console.log('Task 2 completed');
  }

  function allComplete() {
    console.log('All tasks completed');
  }

  task1()
      .then(task1Complete)
      .then(task2)
      .then(task2Complete)
      .then(allComplete);
};

// Ex 3: parallel, callbacks, no fail

var parallelCbNoFail = function () {
  var tasks = ['Task 1', 'Task 2'];
  var results = [];

  function doneTasks() {
    console.log('Both tasks completed', results);
  }

  function task(t, duration) {
    console.log(t + ' started');
    setTimeout(function () {
      console.log(t + ' completed');
      results.push(t);

      if (tasks.length === results.length) {
        doneTasks();
      }
    }, duration);
  }

  tasks.forEach(function (t) {
    task(t, (Math.random() * 3000) + 1000);
  });
};

// Ex 4: parallel, promises, no fail

var parallelPromisesNoFail = function () {
  function task1() {
    return new Promise(function (resolve) {
      console.log('Task 1 has started');
      setTimeout(function () {
        resolve('Task 1 completed');
      }, 6000);
    });
  }

  function task2() {
    return new Promise(function (resolve) {
      console.log('Task 2 has started');
      setTimeout(function () {
        resolve('Task 2 completed');
      }, 1000);
    });
  }

  function allComplete() {
    console.log('All tasks completed');
  }

  Promise.all([task1(), task2()])
    .then(function (msgs) {
      msgs.forEach(function (msg) {
        console.log(msg);
      });
    })
    .then(allComplete);
};

// Ex 5: serial, callbacks, with fail

var serialCbWithFail = function () {
  function task1(successCb, errCb) {
    console.log('Task 1 started');
    setTimeout(function () {
      if (Math.random() > 0.5) {
        errCb(new Error('Task 1 failed'));
      } else {
        successCb('Task 1 completed');
      }
    }, 3000);
  }

  function task2(successCb, errCb) {
    console.log('Task 2 started');
    setTimeout(function () {
      if (Math.random() < 0.5) {
        errCb(new Error('Task 2 failed'));
      } else {
        successCb('Task 2 completed');
      }
    }, 1000);
  }

  task1(function (msg) {
    console.log(msg);
    task2(function (msg2) {
      console.log(msg2);
      console.log('Both tasks completed');
    }, function (err2) {
      console.log(err2);
      console.log('Some task(s) failed');
    });
  }, function (err) {
    console.log(err);
    console.log('Some task(s) failed');
  });
};


// Ex 6: serial, promises, with fail

var serialPromisesWithFail = function () {
  function task1() {
    return new Promise(function (resolve, reject) {
      console.log('Task 1 has started');

      setTimeout(function () {
        if (Math.random() < 0.5) {
          reject(new Error('Task 1 failed'));
        } else {
          resolve('Task 1 completed');
        }
      }, 3000);
    });
  }

  function task2() {
    return new Promise(function (resolve, reject) {
      console.log('Task 2 has started');

      setTimeout(function () {
        if (Math.random() > 0.5) {
          reject(new Error('Task 2 failed'));
        } else {
          resolve('Task 2 completed');
        }
      }, 1000);
    });
  }

  function allComplete() {
    console.log('All tasks completed');
  }

  task1()
    .then(function (msg) { console.log(msg); })
    .then(task2)
    .then(function (msg) { console.log(msg); })
    .then(allComplete)
    .catch(function (err) {
      console.log(err);
      console.log('Some task(s) failed');
    });
};

// Ex 7: parallel, callbacks, with fail

var parallelCbWithFail = function () {
  var tasks = ['Task 1', 'Task 2'];
  var results = [];
  var errors = [];

  function doneTasks() {
    if (tasks.length === results.length) {
      console.log('Both tasks completed', results);
    } else if (errors.length > 0) {
      console.log('Some task(s) failed', errors);
    }
  }

  function task(t, duration) {
    console.log(t + ' started');
    setTimeout(function () {
      if (Math.random() > 0.5) {
        console.log(t + ' completed');
        results.push(t);
      } else {
        console.log(new Error(t + ' failed'));
        errors.push(t);
      }

      doneTasks();
    }, duration);
  }

  tasks.forEach(function (t) {
    task(t, (Math.random() * 3000) + 1000);
  });
};

// Ex 8: parallel, promises, with fail

var parallelPromisesWithFail = function () {
  function task1() {
    return new Promise(function (resolve, reject) {
      console.log('Task 1 has started');

      setTimeout(function () {
        if (Math.random() < 0.5) {
          reject(new Error('Task 1 failed'));
        } else {
          resolve('Task 1 completed');
        }
      }, 1000);
    });
  }

  function task2() {
    return new Promise(function (resolve, reject) {
      console.log('Task 2 has started');

      setTimeout(function () {
        if (Math.random() > 0.5) {
          reject(new Error('Task 2 failed'));
        } else {
          resolve('Task 2 completed');
        }
      }, 3000);
    });
  }

  Promise.all([task1(), task2()])
    .then(function (msgs) {
      msgs.forEach(function (msg) {
        console.log(msg);
      });
    })
    .then(function () {
      console.log('All tasks completed');
    })
    .catch(function (errs) {
      console.log(errs);
      console.log('Some task(s) failed');
    });
};

// Ex 9: parallel, promises, no fail, race

var parallelPromisesNoFailRace = function () {
  function task1() {
    return new Promise(function (resolve) {
      console.log('Task 1 has started');
      setTimeout(function () {
        resolve('Task 1 completed');
      }, 3000);
    });
  }

  function task2() {
    return new Promise(function (resolve) {
      console.log('Task 2 has started');
      setTimeout(function () {
        resolve('Task 2 completed');
      }, 4000);
    });
  }

  function allComplete() {
    console.log('All tasks completed');
  }

  Promise.race([task1(), task2()])
      .then(function (msg) {
        console.log(msg);
      })
      .then(allComplete);
};

// Ex 10: parallel, promises, with fail, race

var parallelPromisesWithFailRace = function () {
  function task1() {
    return new Promise(function (resolve, reject) {
      console.log('Task 1 has started');

      setTimeout(function () {
        if (Math.random() < 0.5) {
          reject(new Error('Task 1 failed'));
        } else {
          resolve('Task 1 completed');
        }
      }, 5000);
    });
  }

  function task2() {
    return new Promise(function (resolve, reject) {
      console.log('Task 2 has started');

      setTimeout(function () {
        if (Math.random() > 0.5) {
          reject(new Error('Task 2 failed'));
        } else {
          resolve('Task 2 completed');
        }
      }, 3000);
    });
  }

  Promise.race([task1(), task2()])
      .then(function (msg) {
        console.log(msg);
      })
      .then(function () {
        console.log('All tasks completed');
      })
      .catch(function (errs) {
        console.log(errs);
        console.log('Some task(s) failed');
      });
};

new Runner(parallelPromisesWithFail).run();
