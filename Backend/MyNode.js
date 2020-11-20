class MyNode
{
    constructor(content, leftNode = null, rightNode = null)
    {
        this.content = content;
        this.leftNode= leftNode;
        this.rightNode = rightNode;
    }
}

module.exports.MyNode = MyNode;