const Runner = function(strat) {
  this.strategy = strat;
  this.run = function() {
    this.strategy();
  };
};

const coroutineRunner = function(genFunc) {
  const genObj = genFunc();

  function step({ value, done }) {
    if (!done) {
      value
        .then(res => {
          step(genObj.next(res));
        })
        .catch(err => {
          step(genObj.throw(err));
        });
    }
  }

  step(genObj.next());
};

// Ex 1: serial, callbacks, no fail

const serialCbNoFail = function() {
  function task1(cb) {
    console.log("Task 1 started");
    setTimeout(() => {
      cb();
    }, 3000);
  }

  function task2(cb) {
    console.log("Task 2 started");
    setTimeout(() => {
      cb();
    }, 1000);
  }

  task1(() => {
    console.log("Task 1 completed");
    task2(() => {
      console.log("Task 2 completed");
      console.log("Both tasks completed");
    });
  });
};

// Ex 2: serial, Promises, no fail

const serialPromisesNoFail = function() {
  function task1() {
    return new Promise(resolve => {
      console.log("Task 1 has started");
      setTimeout(resolve, 3000);
    });
  }

  function task2() {
    return new Promise(resolve => {
      console.log("Task 2 has started");
      setTimeout(resolve, 1000);
    });
  }

  function task1Complete() {
    console.log("Task 1 completed");
  }

  function task2Complete() {
    console.log("Task 2 completed");
  }

  function allComplete() {
    console.log("All tasks completed");
  }

  task1()
    .then(task1Complete)
    .then(task2)
    .then(task2Complete)
    .then(allComplete);
};

// Ex 3: parallel, callbacks, no fail

const parallelCbNoFail = function() {
  const tasks = ["Task 1", "Task 2"];
  const results = [];

  function doneTasks() {
    console.log("Both tasks completed", results);
  }

  function task(t, duration) {
    console.log(`${t} started`);
    setTimeout(() => {
      console.log(`${t} completed`);
      results.push(t);

      if (tasks.length === results.length) {
        doneTasks();
      }
    }, duration);
  }

  tasks.forEach(t => {
    task(t, Math.random() * 3000 + 1000);
  });
};

// Ex 4: parallel, promises, no fail

const parallelPromisesNoFail = function() {
  function task1() {
    return new Promise(resolve => {
      console.log("Task 1 has started");
      setTimeout(() => {
        resolve("Task 1 completed");
      }, 6000);
    });
  }

  function task2() {
    return new Promise(resolve => {
      console.log("Task 2 has started");
      setTimeout(() => {
        resolve("Task 2 completed");
      }, 1000);
    });
  }

  function allComplete() {
    console.log("All tasks completed");
  }

  Promise.all([task1(), task2()])
    .then(msgs => {
      msgs.forEach(msg => {
        console.log(msg);
      });
    })
    .then(allComplete);
};

// Ex 5: serial, callbacks, with fail

const serialCbWithFail = function() {
  function task1(successCb, errCb) {
    console.log("Task 1 started");
    setTimeout(() => {
      if (Math.random() > 0.5) {
        errCb(new Error("Task 1 failed"));
      } else {
        successCb("Task 1 completed");
      }
    }, 3000);
  }

  function task2(successCb, errCb) {
    console.log("Task 2 started");
    setTimeout(() => {
      if (Math.random() < 0.5) {
        errCb(new Error("Task 2 failed"));
      } else {
        successCb("Task 2 completed");
      }
    }, 1000);
  }

  task1(
    msg => {
      console.log(msg);
      task2(
        msg2 => {
          console.log(msg2);
          console.log("Both tasks completed");
        },
        err2 => {
          console.log(err2);
          console.log("Some task(s) failed");
        }
      );
    },
    err => {
      console.log(err);
      console.log("Some task(s) failed");
    }
  );
};

// Ex 6: serial, promises, with fail

const serialPromisesWithFail = function() {
  function task1() {
    return new Promise((resolve, reject) => {
      console.log("Task 1 has started");

      setTimeout(() => {
        if (Math.random() < 0.5) {
          reject(new Error("Task 1 failed"));
        } else {
          resolve("Task 1 completed");
        }
      }, 3000);
    });
  }

  function task2() {
    return new Promise((resolve, reject) => {
      console.log("Task 2 has started");

      setTimeout(() => {
        if (Math.random() > 0.5) {
          reject(new Error("Task 2 failed"));
        } else {
          resolve("Task 2 completed");
        }
      }, 1000);
    });
  }

  function allComplete() {
    console.log("All tasks completed");
  }

  task1()
    .then(msg => {
      console.log(msg);
    })
    .then(task2)
    .then(msg => {
      console.log(msg);
    })
    .then(allComplete)
    .catch(err => {
      console.log(err);
      console.log("Some task(s) failed");
    });
};

// Ex 7: parallel, callbacks, with fail

const parallelCbWithFail = function() {
  const tasks = ["Task 1", "Task 2"];
  const results = [];
  const errors = [];

  function doneTasks() {
    if (tasks.length === results.length) {
      console.log("Both tasks completed", results);
    } else if (errors.length > 0) {
      console.log("Some task(s) failed", errors);
    }
  }

  function task(t, duration) {
    console.log(`${t} started`);
    setTimeout(() => {
      if (Math.random() > 0.5) {
        console.log(`${t} completed`);
        results.push(t);
      } else {
        console.log(new Error(`${t} failed`));
        errors.push(t);
      }

      doneTasks();
    }, duration);
  }

  tasks.forEach(t => {
    task(t, Math.random() * 3000 + 1000);
  });
};

// Ex 8: parallel, promises, with fail

const parallelPromisesWithFail = function() {
  function task1() {
    return new Promise((resolve, reject) => {
      console.log("Task 1 has started");

      setTimeout(() => {
        if (Math.random() < 0.5) {
          reject(new Error("Task 1 failed"));
        } else {
          resolve("Task 1 completed");
        }
      }, 1000);
    });
  }

  function task2() {
    return new Promise((resolve, reject) => {
      console.log("Task 2 has started");

      setTimeout(() => {
        if (Math.random() > 0.5) {
          reject(new Error("Task 2 failed"));
        } else {
          resolve("Task 2 completed");
        }
      }, 3000);
    });
  }

  Promise.all([task1(), task2()])
    .then(msgs => {
      msgs.forEach(msg => {
        console.log(msg);
      });
    })
    .then(() => {
      console.log("All tasks completed");
    })
    .catch(errs => {
      console.log(errs);
      console.log("Some task(s) failed");
    });
};

// Ex 9: parallel, promises, no fail, race

const parallelPromisesNoFailRace = function() {
  function task1() {
    return new Promise(resolve => {
      console.log("Task 1 has started");
      setTimeout(() => {
        resolve("Task 1 completed");
      }, 3000);
    });
  }

  function task2() {
    return new Promise(resolve => {
      console.log("Task 2 has started");
      setTimeout(() => {
        resolve("Task 2 completed");
      }, 4000);
    });
  }

  function allComplete() {
    console.log("All tasks completed");
  }

  Promise.race([task1(), task2()])
    .then(msg => {
      console.log(msg);
    })
    .then(allComplete);
};

// Ex 10: parallel, promises, with fail, race

const parallelPromisesWithFailRace = function() {
  function task1() {
    return new Promise((resolve, reject) => {
      console.log("Task 1 has started");

      setTimeout(() => {
        if (Math.random() < 0.5) {
          reject(new Error("Task 1 failed"));
        } else {
          resolve("Task 1 completed");
        }
      }, 5000);
    });
  }

  function task2() {
    return new Promise((resolve, reject) => {
      console.log("Task 2 has started");

      setTimeout(() => {
        if (Math.random() > 0.5) {
          reject(new Error("Task 2 failed"));
        } else {
          resolve("Task 2 completed");
        }
      }, 3000);
    });
  }

  Promise.race([task1(), task2()])
    .then(msg => {
      console.log(msg);
    })
    .then(() => {
      console.log("All tasks completed");
    })
    .catch(errs => {
      console.log(errs);
      console.log("Some task(s) failed");
    });
};

// Ex 11: serial, async/await, no fail

const serialAsyncAwaitNoFail = async function() {
  function task1() {
    return new Promise(resolve => {
      console.log("Task 1 has started");
      setTimeout(resolve, 3000);
    });
  }

  function task2() {
    return new Promise(resolve => {
      console.log("Task 2 has started");
      setTimeout(resolve, 1000);
    });
  }

  await task1();
  console.log("Task 1 completed");
  await task2();
  console.log("Task 2 completed");
  console.log("All tasks completed");
};

// Ex 12: serial, async/await, with fail

const serialAsyncAwaitWithFail = async function() {
  function task1() {
    return new Promise((resolve, reject) => {
      console.log("Task 1 has started");

      setTimeout(() => {
        if (Math.random() < 0.5) {
          reject(new Error("Task 1 failed"));
        } else {
          resolve();
        }
      }, 3000);
    });
  }

  function task2() {
    return new Promise((resolve, reject) => {
      console.log("Task 2 has started");
      setTimeout(() => {
        if (Math.random() > 0.5) {
          reject(new Error("Task 2 failed"));
        } else {
          resolve();
        }
      }, 1000);
    });
  }

  try {
    await task1();
    console.log("Task 1 completed");
    await task2();
    console.log("Task 2 completed");
    console.log("All tasks completed");
  } catch (e) {
    console.error(e);
  }
};

// Ex 13: parallel, async/await, no fail

const parallelAsyncAwaitNoFail = async function() {
  function task1() {
    return new Promise(resolve => {
      console.log("Task 1 has started");
      setTimeout(() => {
        resolve("Task 1 completed");
      }, 7000);
    });
  }

  function task2() {
    return new Promise(resolve => {
      console.log("Task 2 has started");
      setTimeout(() => {
        resolve("Task 2 completed");
      }, 1000);
    });
  }

  const res = await Promise.all([task1(), task2()]);
  res.forEach(msg => {
    console.log(msg);
  });
  console.log("All tasks completed");
};

// Ex 14: parallel, async/await, with fail

const parallelAsyncAwaitWithFail = async function() {
  function task1() {
    return new Promise((resolve, reject) => {
      console.log("Task 1 has started");

      setTimeout(() => {
        if (Math.random() < 0.5) {
          reject(new Error("Task 1 failed"));
        } else {
          resolve("Task 1 completed");
        }
      }, 3000);
    });
  }

  function task2() {
    return new Promise((resolve, reject) => {
      console.log("Task 2 has started");

      setTimeout(() => {
        if (Math.random() > 0.5) {
          reject(new Error("Task 2 failed"));
        } else {
          resolve("Task 2 completed");
        }
      }, 6000);
    });
  }

  try {
    const res = await Promise.all([task1(), task2()]);
    res.forEach(msg => {
      console.log(msg);
    });
    console.log("All tasks completed");
  } catch (e) {
    console.error(e);
  }
};

// Ex 15: coroutines, serial, no fail

const coroutinesSerialNoFail = function() {
  function task1() {
    return new Promise(resolve => {
      console.log("Task 1 has started");
      setTimeout(resolve, 3000);
    });
  }

  function task2() {
    return new Promise(resolve => {
      console.log("Task 2 has started");
      setTimeout(resolve, 3000);
    });
  }
  coroutineRunner(function*() {
    yield task1();
    console.log("Task 1 completed");
    yield task2();
    console.log("Task 2 completed");
    console.log("All tasks completed");
  });
};

// Ex 16: coroutines, parallel, no fail

const coroutinesParallelNoFail = function() {
  function task1() {
    return new Promise(resolve => {
      console.log("Task 1 has started");
      setTimeout(() => {
        resolve("Task 1 completed");
      }, 7000);
    });
  }
  function task2() {
    return new Promise(resolve => {
      console.log("Task 2 has started");
      setTimeout(() => {
        resolve("Task 2 completed");
      }, 5000);
    });
  }

  coroutineRunner(function*() {
    const results = yield Promise.all([task1(), task2()]);
    results.forEach(msg => {
      console.log(msg);
    });
    console.log("All tasks completed");
  });
};

// Ex 17: coroutines, serial, with fail

const coroutinesSerialWithFail = function() {
  function task1() {
    return new Promise((resolve, reject) => {
      console.log("Task 1 has started");

      setTimeout(() => {
        if (Math.random() < 0.5) {
          reject(new Error("Task 1 failed"));
        } else {
          resolve();
        }
      }, 3000);
    });
  }

  function task2() {
    return new Promise((resolve, reject) => {
      console.log("Task 2 has started");
      setTimeout(() => {
        if (Math.random() > 0.5) {
          reject(new Error("Task 2 failed"));
        } else {
          resolve();
        }
      }, 1000);
    });
  }
  coroutineRunner(function*() {
    try {
      yield task1();
      console.log("Task 1 completed");
      yield task2();
      console.log("Task 2 completed");
      console.log("All tasks completed");
    } catch (e) {
      console.error(e);
    }
  });
};

// Ex 18: coroutines, parallel, with fail

const coroutinesParallelWithFail = function() {
  function task1() {
    return new Promise((resolve, reject) => {
      console.log("Task 1 has started");

      setTimeout(() => {
        if (Math.random() < 0.5) {
          reject(new Error("Task 1 failed"));
        } else {
          resolve("Task 1 completed");
        }
      }, 3000);
    });
  }

  function task2() {
    return new Promise((resolve, reject) => {
      console.log("Task 2 has started");

      setTimeout(() => {
        if (Math.random() > 0.5) {
          reject(new Error("Task 2 failed"));
        } else {
          resolve("Task 2 completed");
        }
      }, 6000);
    });
  }

  coroutineRunner(function*() {
    try {
      const results = yield Promise.all([task1(), task2()]);
      results.forEach(msg => {
        console.log(msg);
      });

      console.log("All tasks completed");
    } catch (e) {
      console.error(e);
    }
  });
};

new Runner(coroutinesParallelWithFail).run();
