import { describe, expect, it } from 'vitest';
import { Clerk, Model, Visitor } from './model';

describe('Model', () => {
    it('adds a clerk to the system', () => {
        const model = new Model();

        expect(model.clerks).toHaveLength(0);

        model.addClerk('Alice');

        expect(model.clerks).toHaveLength(1);
        expect(model.clerks[0]).toMatchObject({
            name: 'Alice',
            visitor: [],
            helped: 0
        });
    });

    it('removes a clerk from the system', () => {
        const model = new Model();
        model.addClerk('Alice');
        const clerk = model.clerks[0];

        const result = model.removeClerk(clerk);

        expect(result).toBe(true);
        expect(model.clerks).toHaveLength(0);
    });

    it('refuses to add a clerk with a duplicate name', () => {
        const model = new Model();

        model.addClerk('Alice');
        const result = model.addClerk('Alice');

        expect(result).toBe(false);
        expect(model.clerks).toHaveLength(1);
    });

    it('adds a visitor to the queue', () => {
        const model = new Model();

        expect(model.visitors).toHaveLength(0);

        model.addVisitor('Bob', 'New license plate');

        expect(model.visitors).toHaveLength(1);
        expect(model.visitors[0]).toMatchObject({
            name: 'Bob',
            number: 1,
            reason: 'New license plate',
            assigned: false
        });

    });

    it('assigns a visitor to a clerk', () => {
        const model = new Model();
        model.addClerk('Alice');
        model.addVisitor('Bob', 'New license plate');

        const visitor = model.visitors[0];
        const clerk = model.clerks[0];

        const result = model.assignVisitor(visitor, clerk);

        expect(result).toBe(true);
        expect(visitor.assigned).toBe(true);
        expect(clerk.visitor).toEqual([visitor]);
    });

    it('clears a clerk from an assigned visitor', () => {
        const model = new Model();
        model.addClerk('Alice');
        model.addVisitor('Bob', 'New license plate');

        const visitor = model.visitors[0];
        const clerk = model.clerks[0];

        model.assignVisitor(visitor, clerk);

        const result = model.clearClerk(clerk);

        expect(result).toBe(true);
        expect(clerk.visitor).toEqual([]);
        expect(model.visitors).toEqual([]);
    });

    it('refuses to clear a clerk without an assigned visitor', () => {
        const model = new Model();
        model.addClerk('Alice');

        const clerk = model.clerks[0];

        const result = model.clearClerk(clerk);

        expect(result).toBe(false);
        expect(clerk.visitor).toEqual([]);
    });
    
    it('refuses to assign a visitor to a clerk that is already assigned', () => {
        const model = new Model();
        model.addClerk('Alice');
        model.addVisitor('Bob', 'New license plate');
        
        const visitor = model.visitors[0];
        const clerk = model.clerks[0];
        
        model.assignVisitor(visitor, clerk);
        const result = model.assignVisitor(visitor, clerk);
        
        expect(result).toBe(false);
        expect(clerk.visitor).toEqual([visitor]);
    });

    it('refuses to clear a clerk with no assigned visitor', () => {
        const model = new Model();
        model.addClerk('Alice');

        const clerk = model.clerks[0];
        const result = model.clearClerk(clerk);

        expect(result).toBe(false);
        expect(clerk.visitor).toEqual([]);
    });

    it('refuses to remove a clerk that is not in the system', () => {
        const model = new Model();
        const clerk = new Clerk('Alice');
        const result = model.removeClerk(clerk);

        expect(result).toBe(false);
        expect(model.clerks).toEqual([]);
    });

    it('refuses to remove a visitor that is not in the queue', () => {
        const model = new Model();
        const visitor = new Visitor('Bob', 1, 'New license plate', new Date());
        const result = model.removeVisitor(visitor);

        expect(result).toBe(false);
        expect(model.visitors).toEqual([]);
    });
});