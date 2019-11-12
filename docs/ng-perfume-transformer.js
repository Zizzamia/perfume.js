import * as ts from 'typescript';

export const dummyTransformer = <T extends ts.Node>(context: ts.TransformationContext) => {
  return (rootNode: ts.SourceFile) => {
    console.log('Transforming file: ' + rootNode.fileName);
    function visit(node: ts.Node): ts.Node {
      return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(rootNode, visit);
  };
};
