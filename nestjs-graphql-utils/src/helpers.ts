import "reflect-metadata";
import { ROUTE_ARGS_METADATA } from "@nestjs/common/constants";

export function getParamDecoratorFactory(decorator: Function) {
  class Test {
    public test(@decorator() value) {}
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, "test");
  return args[Object.keys(args)[0]].factory;
}
