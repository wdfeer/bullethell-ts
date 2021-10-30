declare interface Array<T> {
    /**
     * Converts every element to a number using the func function,
     * returns the maximum value in the resulting array
     */
    max(func: (element: T) => number): number;
    /**
     * Converts every element to a number using the func function,
     * returns the minimum value in the resulting array
     */
    min(func: (element: T) => number): number;
}
Array.prototype.max = function <T>(func: (element: T) => number): number {
    let max: number = func(this[0]);
    this.forEach(element => {
        let num = func(element);
        if (num > max)
            max = num;
    });
    return max;
}
Array.prototype.min = function <T>(func: (element: T) => number): number {
    let min: number = func(this[0]);
    this.forEach(element => {
        let num = func(element);
        if (num < min)
            min = num;
    });
    return min;
}