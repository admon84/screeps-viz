import { Table } from "./Table";
import { viz } from "../Viz"

jest.mock('../Viz');

describe('Table', () => {
    beforeEach(() => {
        (viz().text as jest.Mock).mockClear();
    })
    it('should plot optional label', () => {
        const widget = Table(() => ({
            data: [],
            config: {label: 'Hello World'}
        }));
        widget({
            pos: {x: 0, y: 0}, 
            width: 10, 
            height: 10,
        });
        expect(viz().text).toBeCalledWith('Hello World', 5, 0);
    });
    it('should plot two rows', () => {
        const widget = Table(() => ({
            data: [['hello1', 'world1'], ['hello2', 'world2']], 
            config: {headers: ['header1', 'header2']}
        }));
        widget({
            pos: {x: 0, y: 0}, 
            width: 10, 
            height: 10,
        });
        expect(viz().text).toBeCalledTimes(6);
        expect(viz().text).toBeCalledWith('hello1', 0, 1, {'align': 'left'});
        expect(viz().text).toBeCalledWith('world2', 5, 2, {'align': 'left'});
    });
    it('should plot wider columns', () => {
        const widget = Table(() => ({
            data: [['1', '222'], ['3', '444']], 
            config: {headers: ['1', '2']}
        }));
        widget({
            pos: {x: 0, y: 0}, 
            width: 10, 
            height: 10,
        });
        expect(viz().text).toBeCalledTimes(6);
        expect(viz().text).toBeCalledWith('1', 0, 1, {'align': 'left'});
        expect(viz().text).toBeCalledWith('444', 2.5, 2, {'align': 'left'});
    });
    it('should plot multiple columns', () => {
        const widget = Table(() => ({
            data: [['1', '2', '3', '4'], ['5', '6', '7', '8']], 
            config: {headers: ['1', '2', '3', '4']}
        }));
        widget({
            pos: {x: 0, y: 0}, 
            width: 10, 
            height: 10,
        });
        expect(viz().text).toBeCalledTimes(12);
        expect(viz().text).toBeCalledWith('1', 0, 1, {'align': 'left'});
        expect(viz().text).toBeCalledWith('8', 7.5, 2, {'align': 'left'});
    });
    it('should plot headers with no data', () => {
        const widget = Table(() => ({
            data: [], 
            config: {headers: ['1', '2', '3', '4']}
        }));
        widget({
            pos: {x: 0, y: 0}, 
            width: 10, 
            height: 10,
        });
        expect(viz().text).toBeCalledTimes(4);
        expect(viz().text).toBeCalledWith('1', 0, 0, {'align': 'left'});
        expect(viz().text).toBeCalledWith('2', 2.5, 0, {'align': 'left'});
        expect(viz().text).toBeCalledWith('3', 5, 0, {'align': 'left'});
        expect(viz().text).toBeCalledWith('4', 7.5, 0, {'align': 'left'});
    });
    it('should not crash if row is short', () => {
        const widget = Table(() => ({
            data: [['1', '2', '3'], ['5', '6', '7', '8']], 
            config: {headers: ['1', '2', '3', '4']}
        }));
        widget({
            pos: {x: 0, y: 0}, 
            width: 10, 
            height: 10,
        });
        expect(viz().text).toBeCalledTimes(11);
        expect(viz().text).toBeCalledWith('1', 0, 1, {'align': 'left'});
        expect(viz().text).toBeCalledWith('8', 7.5, 2, {'align': 'left'});
    });
});