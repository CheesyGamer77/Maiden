import { equals, intersection, union } from '../src/commands/role/setUtils';

describe('Set Equality', () => {
    test('Empty Set === Empty Set', () => {
        const a = new Set<string>();
        const b = new Set<string>();

        expect(equals(a, b)).toBe(true);
    });

    test('Empty Set =/= Non-Empty Set', () => {
        const a = new Set<string>();
        const b = new Set<string>(['a', 'b', 'c']);

        expect(equals(a, b)).toBe(false);
    });

    test('Set(1, 2, 3) === Set(3, 2, 1)', () => {
        const a = new Set([1, 2, 3]);
        const b = new Set([3, 2, 1]);

        expect(equals(a, b)).toBe(true);
    });

    test('Set(1, 2, 3) =/= Set(1, 2, 3, 4)', () => {
        const a = new Set([1, 2, 3]);
        const b = new Set([1, 2, 3, 4]);

        expect(equals(a, b)).toBe(false);
    });
});

describe('Set Union', () => {
    test('Empty Set + Empty Set', () => {
        const a = new Set<string>();
        const b = new Set<string>();

        expect(union(
            a, b,
        ).size).toBe(0);
    });

    test('Set("a", "b", "c") + Empty Set === Set("a", "b", "c")', () => {
        const a = new Set<string>(['a', 'b', 'c']);
        const b = new Set<string>();

        const c = union(a, b);
        expect(c.size).toBe(3);
        expect(equals(c, a)).toBe(true);
    });

    test('Empty Set + Set("a", "b", "c") === Set("a", "b", "c")', () => {
        const a = new Set<string>();
        const b = new Set<string>(['a', 'b', 'c']);

        const c = union(a, b);
        expect(c.size).toBe(3);
        expect(equals(c, b)).toBe(true);
    });
});

describe('Set Intersection', () => {
    test('Empty Set & Empty Set', () => {
        const a = new Set();
        const b = new Set();

        const c = intersection(a, b);
        expect(c.size).toBe(0);
        expect(equals(c, new Set())).toBe(true);
    });

    test('Empty Set & Set("a", "b", "c")', () => {
        const a = new Set();
        const b = new Set(['a', 'b', 'c']);

        const c = intersection(a, b);
        expect(c.size).toBe(0);
    });

    test('Set("a", "b", "c", "d") & Set("b", "c", "a")', () => {
        const a = new Set(['a', 'b', 'c', 'd']);
        const b = new Set(['b', 'c', 'a']);

        const c = intersection(a, b);
        expect(c.size).toBe(3);
        expect(equals(c, new Set(['a', 'b', 'c']))).toBe(true);
    });
});
