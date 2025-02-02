export class PathBuilder {
    constructor() {
        this.parents = [];
    }
    goTo(node, key) {
        const parentIndex = this.parents.findIndex(p => p.node === node);
        if (parentIndex !== -1) {
            this.parents.length = parentIndex;
        }
        this.parents.push({ node, key });
    }
    getPath() {
        const parts = this.parents
            .map(p => p.key)
            .filter(key => !!key);
        return parts.join('.');
    }
    getValue(root, path) {
        const parts = path.split('.');
        let value = root;
        try {
            for (const part of parts) {
                value = value[part];
            }
        }
        catch (error) {
            return;
        }
        return value;
    }
}
