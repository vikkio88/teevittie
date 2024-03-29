const latestStackHelper = {
    handle(body, max, stack) {
        stack = Boolean(stack) ? stack : [];
        if (body.finished || body.time === 0) {
            return this.remove(body.id, stack);
        }
        const found = stack.length && stack.findIndex(({ id }) => id === body.id);
        if (found > -1) {
            stack.splice(found, 1);
        }

        if (stack.length + 1 > max) stack.pop();

        stack.unshift({ ...body });
        return stack;
    },
    remove(id, stack) {
        stack = stack.filter(e => e.id !== id);
        return stack;
    }
};

module.exports = { latestStackHelper };