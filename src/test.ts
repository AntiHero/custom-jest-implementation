const a = {
  print(a: string) {
    console.log(a);
  },
};

interface Mock {
  mockImplementation: (fn: (...args: any[]) => any) => MockFn;
}

interface MockFn {
  (...args: any[]): any;
  mock: {
    calls: any[];
  };
  restore(): void;
}

function spyOn<T>(obj: T, key: keyof T): Mock {
  const originalFn = obj[key];

  let mock: Mock = {
    mockImplementation(fn: (...args: any[]) => any) {
      const mockFn: MockFn = function (...args: any[]) {
        mockFn.mock.calls.push(args);

        fn.apply(null, args);
      };

      mockFn.mock = { calls: [] };
      mockFn.restore = () => {
        obj[key] = originalFn;
      };

      obj[key] = <any>mockFn;

      return mockFn;
    },
  };

  return mock;
}

const mockFn = spyOn(a, 'print').mockImplementation((a: string) => null);

a.print('hello');
a.print('world');

console.log(mockFn.mock.calls);

mockFn.restore();

a.print('hello');
